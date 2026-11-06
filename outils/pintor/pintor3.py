# Lo pintor, troisième manière (après la relecture de Joan) : de grands coups
# calmes dans le ciel et l'eau, des touches variées dans les feuillages, un
# pinceau fin seulement sur les arêtes nettes (toits, tours, troncs, horizon),
# des ombres lumineuses, et l'image peinte plus grande que le cadre puis rognée.
import sys
import time
import numpy as np
from PIL import Image, ImageDraw
from pintor import lire, flou, lum, tenseur, aligner, poligon, lic
import pintor2 as p2

MARGE = 24


def boite_c(a, r):
	pad = ((r, 0), (r, 0)) + ((0, 0),) * (a.ndim - 2)
	b = np.pad(a, pad, mode='edge')
	return p2.boite(b, 2 * r + 1)[: a.shape[0], : a.shape[1]]


def guidat(I, r, eps):
	out = np.empty_like(I)
	for c in range(3):
		p = I[..., c]
		m = boite_c(p, r)
		v = boite_c(p * p, r) - m * m
		a = v / (v + eps)
		b = m - a * m
		out[..., c] = boite_c(a, r) * p + boite_c(b, r)
	return np.clip(out, 0, 1)


def preparar(path, relevar=0.24, sat=1.08):
	src = lire(path)
	L = lum(src)[..., None]
	# des ombres lumineuses et colorées, jamais noires
	src = np.clip(src + relevar * (1 - L) ** 3 * np.array([0.85, 1.0, 1.12], np.float32), 0, 1)
	L = lum(src)[..., None]
	src = L + (src - L) * sat
	t = np.clip((L - 0.2) / 0.6, 0, 1)
	src = src * (np.array([0.95, 0.985, 1.05], np.float32) * (1 - t) + np.array([1.035, 1.0, 0.95], np.float32) * t)
	src = np.clip(src, 0, 1).astype(np.float32)
	return np.pad(src, ((MARGE, MARGE), (MARGE, MARGE), (0, 0)), mode='reflect')


def masques(simp):
	L = lum(simp)
	m = boite_c(L, 10)
	sd = np.sqrt(np.maximum(boite_c(L * L, 10) - m * m, 0))
	lisse = flou(np.clip((0.035 - sd) / 0.02, 0, 1), 6)
	fx, fy, fc, ff = tenseur(flou(L, 1.2), 5)
	arete = np.clip((fc - 0.45) / 0.3, 0, 1) * np.clip(ff / 0.06, 0, 1)
	return lisse, arete, (fx, fy, fc, ff)


def champ3(lisse, tens, rng):
	fx, fy, fc, ff = tens
	H, W = lisse.shape
	n1 = flou(rng.standard_normal((H, W)).astype(np.float32), 50)
	n1 /= n1.std() + 1e-9
	n2 = flou(rng.standard_normal((H, W)).astype(np.float32), 7)
	n2 /= n2.std() + 1e-9
	# l'horizon qui ondule à peine dans les aplats ; des touches en tous sens dans les feuillages
	ang = 0.2 * n1 + (1 - lisse) * 0.9 * n2
	bx, by = np.cos(ang), np.sin(ang)
	wf = np.clip(fc * 1.3, 0, 1) * np.clip(ff / 0.03, 0, 1)
	fx, fy = aligner(fx, fy, bx, by)
	tx, ty = wf * fx + (1 - wf) * bx, wf * fy + (1 - wf) * by
	n = np.hypot(tx, ty) + 1e-9
	return (tx / n).astype(np.float32), (ty / n).astype(np.float32)


def couche(dr, dang, dalt, canvas, refq, R, T, nmax, tol, tx, ty, rng, premiera, var, masc):
	H, W = refq.shape[:2]
	g = max(2, int(round(R * 0.9)))
	Hc, Wc = H // g, W // g
	if premiera:
		jj, ii = np.mgrid[0:Hc, 0:Wc]
		sx = ((ii + 0.5 + rng.uniform(-0.45, 0.45, ii.shape)) * g).ravel()
		sy = ((jj + 0.5 + rng.uniform(-0.45, 0.45, jj.shape)) * g).ravel()
	else:
		D = np.sqrt(((canvas - refq) ** 2).sum(-1))
		if masc is not None:
			D = D * masc
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
	F = p2.tracar(sx, sy, col, refq, R, nmax, tol, tx, ty, 1)
	B = p2.tracar(sx, sy, col, refq, R, nmax, tol, tx, ty, -1)
	nf = (~np.isnan(F[:, :, 0])).sum(1)
	nb = (~np.isnan(B[:, :, 0])).sum(1)
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


# rayon, seuil, longueur max (en pas d'un rayon), tolérance, où (tout, texturé, arêtes)
COUCHES = [
	(60, 0, 4, 0.22, 'tot'),
	(34, 0.05, 6, 0.12, 'tot'),
	(18, 0.06, 8, 0.09, 'textura'),
	(10, 0.09, 9, 0.075, 'textura'),
	(5.5, 0.16, 10, 0.065, 'textura'),
	(3, 0.07, 8, 0.08, 'arestas'),
]


def pintar(path, sortie, graine=7, couches=COUCHES, k=36, fsig=0.35, var=0.022,
           relief=0.14, fil=0.018, brosse=0.05, relevar=0.24):
	t0 = time.time()
	rng = np.random.default_rng(graine)
	src = preparar(path, relevar)
	simp = p2.kuwahara(guidat(src, 16, 0.01), 5)
	pal = p2.paleta(simp, k, rng)
	lisse, arete, tens = masques(simp)
	tx, ty = champ3(lisse, tens, rng)
	H, W = src.shape[:2]
	canvas = p2.quantar(flou(simp, 30), pal)
	im = Image.fromarray((canvas * 255 + 0.5).astype(np.uint8))
	ang = Image.new('L', (W, H), 0)
	alt = Image.new('L', (W, H), 40)
	dr, dang, dalt = ImageDraw.Draw(im), ImageDraw.Draw(ang), ImageDraw.Draw(alt)
	tot = 0
	ls = lisse[..., None]
	for i, (R, T, nmax, tol, on) in enumerate(couches):
		if on == 'arestas':
			ref = flou(src, 1.0)
			masc = arete
		else:
			refs = flou(simp, fsig * R)
			# l'eau et le ciel en dégradés continus ; ailleurs, la palette du peintre
			ref = ls * refs + (1 - ls) * p2.quantar(refs, pal)
			masc = (1 - lisse) if on == 'textura' else None
		tot += couche(dr, dang, dalt, canvas, ref, R, T, nmax, tol, tx, ty, rng, i == 0, var, masc)
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
	out = out[MARGE:-MARGE, MARGE:-MARGE]
	img = Image.fromarray((out * 255 + 0.5).astype(np.uint8))
	img.save(sortie)
	print(f'fait : {sortie}, {tot} coups, {time.time() - t0:.1f} s')
	return img


if __name__ == '__main__':
	D = sys.argv[1]
	for nom in sys.argv[2:]:
		img = pintar(f'{D}/{nom}-1920.webp', f'{nom}-v7.png')
		img.resize((800, 600), Image.LANCZOS).save(f'{nom}-v7-800.png')
		img.resize((560, 420), Image.LANCZOS).save(f'{nom}-v7-560.webp', 'WEBP', quality=72, method=6)
