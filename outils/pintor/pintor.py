# Lo pintor : un programme qui peint une photo coup de pinceau par coup de
# pinceau (méthode de Hertzmann, 1998 : des couches de pinceaux du plus gros au
# plus fin, chaque coup suit les formes de l'image), puis donne la matière : le
# fil des poils de la brosse et le relief de la peinture sous une lumière
# venue d'en haut à gauche.
# Usage : python pintor.py photo.webp sortie.png [graine]
import sys
import time
import numpy as np
from PIL import Image, ImageDraw

LARG = 1920


def lire(path, W=LARG):
	im = Image.open(path).convert('RGB')
	H = round(im.height * W / im.width)
	if im.size != (W, H):
		im = im.resize((W, H), Image.LANCZOS)
	return np.asarray(im, dtype=np.float32) / 255.0


def flou(a, s):
	"""flou gaussien (écart s en pixels), par la transformée de Fourier, bords en miroir"""
	if s <= 0.3:
		return a.astype(np.float32)
	p = int(3 * s) + 1
	pad = ((p, p), (p, p)) + ((0, 0),) * (a.ndim - 2)
	b = np.pad(a, pad, mode='reflect')
	H, W = b.shape[:2]
	fy = np.fft.fftfreq(H)[:, None]
	fx = np.fft.rfftfreq(W)[None, :]
	g = np.exp(-2 * np.pi ** 2 * s ** 2 * (fx ** 2 + fy ** 2))
	if b.ndim == 2:
		r = np.fft.irfft2(np.fft.rfft2(b) * g, s=(H, W))
	else:
		r = np.stack([np.fft.irfft2(np.fft.rfft2(b[..., c]) * g, s=(H, W)) for c in range(b.shape[2])], -1)
	return r[p:-p, p:-p].astype(np.float32)


def lum(a):
	return a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114


def harmonia(img, sat=1.1):
	"""l'accord du peintre : un peu plus de couleur, lumière chaude, ombres froides"""
	L = lum(img)[..., None]
	img = L + (img - L) * sat
	t = np.clip((L - 0.2) / 0.6, 0, 1)
	caud = np.array([1.035, 1.0, 0.95], np.float32)
	freg = np.array([0.95, 0.985, 1.05], np.float32)
	img = img * (freg * (1 - t) + caud * t)
	return np.clip(img, 0, 1).astype(np.float32)


def tenseur(L, s):
	gx = np.zeros_like(L)
	gy = np.zeros_like(L)
	gx[:, 1:-1] = (L[:, 2:] - L[:, :-2]) * 0.5
	gy[1:-1, :] = (L[2:, :] - L[:-2, :]) * 0.5
	Jxx = flou(gx * gx, s)
	Jyy = flou(gy * gy, s)
	Jxy = flou(gx * gy, s)
	th = 0.5 * np.arctan2(2 * Jxy, Jxx - Jyy)
	d = np.sqrt((Jxx - Jyy) ** 2 + 4 * Jxy ** 2)
	l1 = (Jxx + Jyy + d) / 2
	l2 = (Jxx + Jyy - d) / 2
	coh = (l1 - l2) / (l1 + l2 + 1e-12)
	return -np.sin(th), np.cos(th), coh, np.sqrt(np.maximum(l1, 0))


def aligner(ax, ay, bx, by):
	s = np.where(ax * bx + ay * by < 0, -1.0, 1.0)
	return ax * s, ay * s


def champ(img, f0=0.03):
	"""le sens des coups : le long des formes là où elles sont nettes, sinon le
	sens d'ensemble, sinon l'horizontale"""
	L = flou(lum(img), 1.2)
	fx, fy, fc, ff = tenseur(L, 5)
	cx, cy, cc, cf = tenseur(L, 28)
	hx = np.ones_like(L)
	hy = np.zeros_like(L)
	wc = np.clip(cc * 1.4, 0, 1) * np.clip(cf / f0, 0, 1)
	cx, cy = aligner(cx, cy, hx, hy)
	bx = wc * cx + (1 - wc) * hx
	by = wc * cy + (1 - wc) * hy
	n = np.hypot(bx, by) + 1e-9
	bx, by = bx / n, by / n
	wf = np.clip(fc * 1.3, 0, 1) * np.clip(ff / f0, 0, 1)
	fx, fy = aligner(fx, fy, bx, by)
	tx = wf * fx + (1 - wf) * bx
	ty = wf * fy + (1 - wf) * by
	n = np.hypot(tx, ty) + 1e-9
	return (tx / n).astype(np.float32), (ty / n).astype(np.float32)


def tracar(sx, sy, col, ref, canvas, R, nmax, nmin, tol, tx, ty, sens, premiera):
	H, W = ref.shape[:2]
	n = len(sx)
	x = sx.copy()
	y = sy.copy()
	ix = np.clip(x.astype(np.int32), 0, W - 1)
	iy = np.clip(y.astype(np.int32), 0, H - 1)
	dx = tx[iy, ix] * sens
	dy = ty[iy, ix] * sens
	vius = np.ones(n, bool)
	P = np.full((n, nmax, 2), np.nan, np.float32)
	for k in range(nmax):
		ix = np.clip(x.astype(np.int32), 0, W - 1)
		iy = np.clip(y.astype(np.int32), 0, H - 1)
		ux = tx[iy, ix].copy()
		uy = ty[iy, ix].copy()
		s = np.where(ux * dx + uy * dy < 0, -1.0, 1.0)
		ux *= s
		uy *= s
		ux = 0.6 * ux + 0.4 * dx
		uy = 0.6 * uy + 0.4 * dy
		nn = np.hypot(ux, uy) + 1e-9
		ux /= nn
		uy /= nn
		vira = (ux * dx + uy * dy) < 0.55
		nx = x + ux * R
		ny = y + uy * R
		dins = (nx >= 0) & (nx <= W - 1) & (ny >= 0) & (ny <= H - 1)
		jx = np.clip(nx.astype(np.int32), 0, W - 1)
		jy = np.clip(ny.astype(np.int32), 0, H - 1)
		r = ref[jy, jx]
		es = np.sqrt(((r - col) ** 2).sum(-1))
		ok = dins & ~vira & (es < tol)
		if not premiera:
			ec = np.sqrt(((r - canvas[jy, jx]) ** 2).sum(-1))
			ok &= (k < nmin) | (es <= ec)
		vius &= ok
		if not vius.any():
			break
		x = np.where(vius, nx, x)
		y = np.where(vius, ny, y)
		dx = np.where(vius, ux, dx)
		dy = np.where(vius, uy, dy)
		P[vius, k, 0] = nx[vius]
		P[vius, k, 1] = ny[vius]
	return P


def poligon(pts, R):
	"""un coup de pinceau : plus large au milieu, effilé aux bouts"""
	m = len(pts)
	if m == 1:
		x, y = pts[0]
		a = np.linspace(0, 2 * np.pi, 9)[:-1]
		return np.stack([x + np.cos(a) * R * 0.9, y + np.sin(a) * R * 0.75], -1)
	t = np.gradient(pts, axis=0)
	t /= np.hypot(t[:, 0], t[:, 1])[:, None] + 1e-9
	nrm = np.stack([-t[:, 1], t[:, 0]], -1)
	seg = np.hypot(*np.diff(pts, axis=0).T)
	s = np.concatenate([[0], np.cumsum(seg)])
	s /= s[-1] + 1e-9
	w = R * (0.58 + 0.42 * np.sin(np.pi * s))
	g = pts + nrm * w[:, None]
	d = pts - nrm * w[:, None]
	c0 = pts[0] - t[0] * w[0] * 0.75
	c1 = pts[-1] + t[-1] * w[-1] * 0.75
	return np.concatenate([[c0], g, [c1], d[::-1]])


def couche(dr, dang, dalt, canvas, ref, R, T, nmax, nmin, tol, tx, ty, rng, premiera=False, var=0.03):
	H, W = ref.shape[:2]
	g = max(2, int(round(R)))
	Hc, Wc = H // g, W // g
	if premiera:
		jj, ii = np.mgrid[0:Hc, 0:Wc]
		sx = ((ii + 0.5 + rng.uniform(-0.45, 0.45, ii.shape)) * g).ravel().astype(np.float32)
		sy = ((jj + 0.5 + rng.uniform(-0.45, 0.45, jj.shape)) * g).ravel().astype(np.float32)
	else:
		D = np.sqrt(((canvas - ref) ** 2).sum(-1))
		Dc = D[: Hc * g, : Wc * g].reshape(Hc, g, Wc, g).transpose(0, 2, 1, 3).reshape(Hc, Wc, g * g)
		err = Dc.mean(-1)
		am = Dc.argmax(-1)
		yy = np.arange(Hc)[:, None] * g + am // g
		xx = np.arange(Wc)[None, :] * g + am % g
		sel = err > T
		sx = (xx[sel] + rng.uniform(-0.25, 0.25, sel.sum()) * g).astype(np.float32)
		sy = (yy[sel] + rng.uniform(-0.25, 0.25, sel.sum()) * g).astype(np.float32)
	sx = np.clip(sx, 0, W - 1)
	sy = np.clip(sy, 0, H - 1)
	n = len(sx)
	if n == 0:
		return 0
	col = ref[sy.astype(np.int32), sx.astype(np.int32)].copy()
	# la main n'est jamais tout à fait la même : un peu plus clair, plus sombre, plus chaud
	col += rng.normal(0, var, (n, 1)).astype(np.float32) + rng.normal(0, var * 0.35, (n, 3)).astype(np.float32)
	col = np.clip(col, 0, 1)
	F = tracar(sx, sy, col, ref, canvas, R, nmax, nmin, tol, tx, ty, 1, premiera)
	B = tracar(sx, sy, col, ref, canvas, R, nmax, nmin, tol, tx, ty, -1, premiera)
	nf = (~np.isnan(F[:, :, 0])).sum(1)
	nb = (~np.isnan(B[:, :, 0])).sum(1)
	larg = R * rng.uniform(0.85, 1.15, n)
	alt = rng.integers(70, 256, n)
	for i in rng.permutation(n):
		pts = np.concatenate([B[i, : nb[i]][::-1], [[sx[i], sy[i]]], F[i, : nf[i]]])
		poly = poligon(pts, larg[i]).ravel().tolist()
		c = tuple(int(v * 255 + 0.5) for v in col[i])
		dv = pts[-1] - pts[0] if len(pts) > 1 else np.array([tx[int(sy[i]), int(sx[i])], ty[int(sy[i]), int(sx[i])]])
		a = int((np.arctan2(dv[1], dv[0]) % np.pi) / np.pi * 255) % 256
		dr.polygon(poly, fill=c)
		dang.polygon(poly, fill=a)
		dalt.polygon(poly, fill=int(alt[i]))
	return n


def lic(ang, bruch, L):
	"""le fil de la brosse : du bruit étiré dans le sens de chaque coup"""
	H, W = bruch.shape
	ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
	acc = bruch.copy()
	for sgn in (1.0, -1.0):
		x = xs.copy()
		y = ys.copy()
		for _ in range(L):
			ix = np.clip(x.astype(np.int32), 0, W - 1)
			iy = np.clip(y.astype(np.int32), 0, H - 1)
			a = ang[iy, ix]
			x += sgn * np.cos(a)
			y += sgn * np.sin(a)
			jx = np.clip(x.astype(np.int32), 0, W - 1)
			jy = np.clip(y.astype(np.int32), 0, H - 1)
			acc += bruch[jy, jx]
	return acc / (2 * L + 1)


COUCHES = [
	# rayon, seuil, longueur max et min (en pas d'un rayon), tolérance de couleur
	(34, 0, 6, 1, 0.16),
	(20, 0.05, 8, 2, 0.13),
	(11, 0.05, 10, 2, 0.11),
	(6, 0.06, 12, 2, 0.09),
	(3.5, 0.085, 14, 2, 0.08),
]


def pintar(path, sortie, graine=7, couches=COUCHES, fsig=0.5, relief=0.2, fil=0.02, brosse=0.06, var=0.05):
	t0 = time.time()
	rng = np.random.default_rng(graine)
	src = harmonia(lire(path))
	H, W = src.shape[:2]
	tx, ty = champ(src)
	# l'ébauche : les grandes masses de couleur
	canvas = flou(src, 40)
	im = Image.fromarray((canvas * 255 + 0.5).astype(np.uint8))
	ang = Image.new('L', (W, H), 0)
	alt = Image.new('L', (W, H), 40)
	dr, dang, dalt = ImageDraw.Draw(im), ImageDraw.Draw(ang), ImageDraw.Draw(alt)
	tot = 0
	for k, (R, T, nmax, nmin, tol) in enumerate(couches):
		ref = flou(src, fsig * R)
		tot += couche(dr, dang, dalt, canvas, ref, R, T, nmax, nmin, tol, tx, ty, rng, premiera=(k == 0), var=var)
		canvas = np.asarray(im, dtype=np.float32) / 255.0
		print(f'  couche {k} (rayon {R}) : {tot} coups, {time.time() - t0:.1f} s')
	# la matière : le fil des poils, le relief de la pâte
	a = np.asarray(ang, dtype=np.float32) / 255.0 * np.pi
	b = flou(rng.random((H, W)).astype(np.float32), 1.3)
	b = lic(a, (b - b.mean()) / (b.std() + 1e-9), 12)
	b = (b - b.mean()) / (b.std() + 1e-9)
	h = flou(np.asarray(alt, dtype=np.float32) / 255.0, 1.6) + brosse * b
	gx = np.zeros_like(h)
	gy = np.zeros_like(h)
	gx[:, 1:-1] = (h[:, 2:] - h[:, :-2]) * 0.5
	gy[1:-1, :] = (h[2:, :] - h[:-2, :]) * 0.5
	k = 9.0
	nx, ny, nz = -k * gx, -k * gy, np.ones_like(h)
	nn = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
	lx, ly, lz = -0.55, -0.65, 0.9
	ll = (lx * lx + ly * ly + lz * lz) ** 0.5
	sh = (nx * lx + ny * ly + nz * lz) / (nn * ll) - lz / ll
	out = canvas * (1 + relief * sh[..., None]) * (1 + fil * b[..., None])
	out = np.clip(out, 0, 1)
	img = Image.fromarray((out * 255 + 0.5).astype(np.uint8))
	img.save(sortie)
	print(f'fait : {sortie}, {tot} coups, {time.time() - t0:.1f} s')
	return img


if __name__ == '__main__':
	pintar(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 7)
