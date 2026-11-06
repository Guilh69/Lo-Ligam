# Lo pintor, seconde manière : le peintre simplifie d'abord (il voit des masses,
# pas des détails), choisit une palette limitée, puis pose de larges coups de
# pinceau qui suivent les formes ; les coups fins ne vont qu'aux vrais contours.
import sys
import time
import numpy as np
from PIL import Image, ImageDraw
from pintor import lire, flou, lum, harmonia, champ, poligon, lic


def boite(a, s):
	"""moyenne sur [y, y+s) × [x, x+s), bords prolongés"""
	pad = ((0, s), (0, s)) + ((0, 0),) * (a.ndim - 2)
	b = np.pad(a.astype(np.float64), pad, mode='edge')
	c = b.cumsum(0).cumsum(1)
	c = np.pad(c, ((1, 0), (1, 0)) + ((0, 0),) * (a.ndim - 2))
	H, W = a.shape[:2]
	S = c[s:s + H, s:s + W] - c[0:H, s:s + W] - c[s:s + H, 0:W] + c[0:H, 0:W]
	return (S / (s * s)).astype(np.float32)


def kuwahara(img, r):
	"""garde, autour de chaque point, le coin le plus uni : les masses sans le grain"""
	s = r + 1
	H, W = img.shape[:2]
	L = lum(img)
	M = boite(img, s)
	V = boite(L * L, s) - boite(L, s) ** 2
	ys = [np.clip(np.arange(H) + d, 0, H - 1) for d in (-r, 0)]
	xs = [np.clip(np.arange(W) + d, 0, W - 1) for d in (-r, 0)]
	best = None
	bestv = None
	for yy in ys:
		for xx in xs:
			v = V[yy][:, xx]
			m = M[yy][:, xx]
			if best is None:
				best, bestv = m, v
			else:
				w = v < bestv
				best = np.where(w[..., None], m, best)
				bestv = np.where(w, v, bestv)
	return best


def paleta(img, k, rng, n=60000, it=18):
	X = img.reshape(-1, 3)
	X = X[rng.choice(len(X), n, replace=False)]
	C = X[rng.choice(n, k, replace=False)].copy()
	for _ in range(it):
		a = ((X[:, None, :] - C[None]) ** 2).sum(-1).argmin(1)
		for j in range(k):
			m = a == j
			if m.any():
				C[j] = X[m].mean(0)
	return C.astype(np.float32)


def quantar(img, C):
	H, W = img.shape[:2]
	X = img.reshape(-1, 3)
	out = np.empty_like(X)
	for i in range(0, len(X), 400000):
		x = X[i:i + 400000]
		out[i:i + 400000] = C[((x[:, None, :] - C[None]) ** 2).sum(-1).argmin(1)]
	return out.reshape(H, W, 3)


def tracar(sx, sy, col, refq, R, nmax, tol, tx, ty, sens):
	H, W = refq.shape[:2]
	n = len(sx)
	x, y = sx.copy(), sy.copy()
	ix = np.clip(x.astype(np.int32), 0, W - 1)
	iy = np.clip(y.astype(np.int32), 0, H - 1)
	dx, dy = tx[iy, ix] * sens, ty[iy, ix] * sens
	vius = np.ones(n, bool)
	P = np.full((n, nmax, 2), np.nan, np.float32)
	for k in range(nmax):
		ix = np.clip(x.astype(np.int32), 0, W - 1)
		iy = np.clip(y.astype(np.int32), 0, H - 1)
		ux, uy = tx[iy, ix].copy(), ty[iy, ix].copy()
		s = np.where(ux * dx + uy * dy < 0, -1.0, 1.0)
		ux, uy = ux * s, uy * s
		ux, uy = 0.55 * ux + 0.45 * dx, 0.55 * uy + 0.45 * dy
		nn = np.hypot(ux, uy) + 1e-9
		ux, uy = ux / nn, uy / nn
		vira = (ux * dx + uy * dy) < 0.6
		nx, ny = x + ux * R, y + uy * R
		dins = (nx >= 0) & (nx <= W - 1) & (ny >= 0) & (ny <= H - 1)
		jx = np.clip(nx.astype(np.int32), 0, W - 1)
		jy = np.clip(ny.astype(np.int32), 0, H - 1)
		es = np.sqrt(((refq[jy, jx] - col) ** 2).sum(-1))
		vius &= dins & ~vira & (es < tol)
		if not vius.any():
			break
		x, y = np.where(vius, nx, x), np.where(vius, ny, y)
		dx, dy = np.where(vius, ux, dx), np.where(vius, uy, dy)
		P[vius, k, 0] = nx[vius]
		P[vius, k, 1] = ny[vius]
	return P


def couche(dr, dang, dalt, canvas, refq, R, T, nmax, tol, tx, ty, rng, premiera, var):
	H, W = refq.shape[:2]
	g = max(2, int(round(R * 0.9)))
	Hc, Wc = H // g, W // g
	if premiera:
		jj, ii = np.mgrid[0:Hc, 0:Wc]
		sx = ((ii + 0.5 + rng.uniform(-0.45, 0.45, ii.shape)) * g).ravel()
		sy = ((jj + 0.5 + rng.uniform(-0.45, 0.45, jj.shape)) * g).ravel()
	else:
		D = np.sqrt(((canvas - refq) ** 2).sum(-1))
		Dc = D[: Hc * g, : Wc * g].reshape(Hc, g, Wc, g).transpose(0, 2, 1, 3).reshape(Hc, Wc, g * g)
		err = Dc.mean(-1)
		am = Dc.argmax(-1)
		yy = np.arange(Hc)[:, None] * g + am // g
		xx = np.arange(Wc)[None, :] * g + am % g
		sel = err > T
		sx = xx[sel] + rng.uniform(-0.2, 0.2, sel.sum()) * g
		sy = yy[sel] + rng.uniform(-0.2, 0.2, sel.sum()) * g
	sx = np.clip(sx, 0, W - 1).astype(np.float32)
	sy = np.clip(sy, 0, H - 1).astype(np.float32)
	n = len(sx)
	if n == 0:
		return 0
	col = refq[sy.astype(np.int32), sx.astype(np.int32)].copy()
	F = tracar(sx, sy, col, refq, R, nmax, tol, tx, ty, 1)
	B = tracar(sx, sy, col, refq, R, nmax, tol, tx, ty, -1)
	nf = (~np.isnan(F[:, :, 0])).sum(1)
	nb = (~np.isnan(B[:, :, 0])).sum(1)
	# la main n'est jamais tout à fait la même
	colp = np.clip(col + rng.normal(0, var, (n, 1)) + rng.normal(0, var * 0.4, (n, 3)), 0, 1)
	larg = R * rng.uniform(0.85, 1.15, n)
	alt = rng.integers(70, 256, n)
	for i in rng.permutation(n):
		pts = np.concatenate([B[i, : nb[i]][::-1], [[sx[i], sy[i]]], F[i, : nf[i]]])
		poly = poligon(pts, larg[i]).ravel().tolist()
		if len(pts) > 1:
			dv = pts[-1] - pts[0]
		else:
			dv = (tx[int(sy[i]), int(sx[i])], ty[int(sy[i]), int(sx[i])])
		a = int((np.arctan2(dv[1], dv[0]) % np.pi) / np.pi * 255) % 256
		dr.polygon(poly, fill=tuple(int(v * 255 + 0.5) for v in colp[i]))
		dang.polygon(poly, fill=a)
		dalt.polygon(poly, fill=int(alt[i]))
	return n


COUCHES = [
	# rayon, seuil, longueur max (en pas d'un rayon), tolérance de couleur
	(46, 0, 5, 0.2),
	(28, 0.05, 7, 0.1),
	(16, 0.06, 9, 0.08),
	(9, 0.09, 10, 0.07),
	(5, 0.15, 12, 0.06),
]


def pintar(path, sortie, graine=7, couches=COUCHES, k=30, kuw=(5, 9), fsig=0.35, var=0.022,
           relief=0.14, fil=0.018, brosse=0.05, sat=1.08):
	t0 = time.time()
	rng = np.random.default_rng(graine)
	src = harmonia(lire(path), sat)
	simp = src
	for r in kuw:
		simp = kuwahara(simp, r)
	pal = paleta(simp, k, rng)
	tx, ty = champ(simp)
	H, W = src.shape[:2]
	canvas = quantar(flou(simp, 30), pal)
	im = Image.fromarray((canvas * 255 + 0.5).astype(np.uint8))
	ang = Image.new('L', (W, H), 0)
	alt = Image.new('L', (W, H), 40)
	dr, dang, dalt = ImageDraw.Draw(im), ImageDraw.Draw(ang), ImageDraw.Draw(alt)
	tot = 0
	for i, (R, T, nmax, tol) in enumerate(couches):
		refq = quantar(flou(simp, fsig * R), pal)
		tot += couche(dr, dang, dalt, canvas, refq, R, T, nmax, tol, tx, ty, rng, i == 0, var)
		canvas = np.asarray(im, dtype=np.float32) / 255.0
		print(f'  couche {i} (rayon {R}) : {tot} coups, {time.time() - t0:.1f} s')
	a = np.asarray(ang, dtype=np.float32) / 255.0 * np.pi
	b = flou(rng.random((H, W)).astype(np.float32), 1.3)
	b = lic(a, (b - b.mean()) / (b.std() + 1e-9), 12)
	b = (b - b.mean()) / (b.std() + 1e-9)
	h = flou(np.asarray(alt, dtype=np.float32) / 255.0, 1.6) + brosse * b
	gx = np.zeros_like(h)
	gy = np.zeros_like(h)
	gx[:, 1:-1] = (h[:, 2:] - h[:, :-2]) * 0.5
	gy[1:-1, :] = (h[2:, :] - h[:-2, :]) * 0.5
	nx, ny = -9.0 * gx, -9.0 * gy
	nn = np.sqrt(nx ** 2 + ny ** 2 + 1)
	lx, ly, lz = -0.55, -0.65, 0.9
	ll = (lx * lx + ly * ly + lz * lz) ** 0.5
	sh = (nx * lx + ny * ly + lz) / (nn * ll) - lz / ll
	out = np.clip(canvas * (1 + relief * sh[..., None]) * (1 + fil * b[..., None]), 0, 1)
	img = Image.fromarray((out * 255 + 0.5).astype(np.uint8))
	img.save(sortie)
	print(f'fait : {sortie}, {tot} coups, {time.time() - t0:.1f} s')
	return img


if __name__ == '__main__':
	pintar(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 7)
