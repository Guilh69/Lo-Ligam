# Lo pintor, quatrième manière (relecture de Joan : « peu de coups, bien placés »)
# - chaque couche est posée comme une vraie brosse : le cœur du coup couvre, ses
#   bords s'effilochent selon les poils (brosse sèche) et laissent voir dessous ;
# - le détail n'existe que là où le regard se pose (une ellipse par tableau),
#   ailleurs de grandes touches ;
# - ciel et eau : de grands coups croisés, en dégradé continu, jamais de touche fine ;
# - ombres lumineuses ; image peinte plus grande que le cadre puis rognée ;
# - retouches de la photo avant de peindre (les grues de Toulouse, le garde-corps).
import sys
import time
import numpy as np
from PIL import Image, ImageDraw
from pintor import flou, lum, tenseur, aligner, poligon, lic
import pintor2 as p2
from pintor3 import boite_c, guidat

MARGE = 28

# où se pose le regard (centre x, centre y, demi-largeur, demi-hauteur, en fraction du cadre)
REGARD = {
	'garona': (0.5, 0.5, 0.62, 0.24),
	'vilatge': (0.56, 0.35, 0.42, 0.2),
	'riu': (0.42, 0.56, 0.46, 0.34),
	'plana': (0.5, 0.6, 0.5, 0.28),
	'mar-pin': (0.6, 0.45, 0.3, 0.46),
}


def sans_grues(a):
	"""Toulouse : les deux grues du chantier effacées du ciel (la photo reste la photo)"""
	H, W = a.shape[:2]
	L = lum(a)
	m = np.zeros((H, W), np.float32)
	for x0, x1, y0, y1 in [(460, 604, 598, 654), (546, 578, 598, 676), (718, 812, 556, 608), (760, 792, 556, 700)]:
		zone = L[y0:y1, x0:x1]
		ciel = np.percentile(zone, 85)
		m[y0:y1, x0:x1] = (zone < ciel - 0.04).astype(np.float32)
	m = (flou(m, 2.0) > 0.08).astype(np.float32)
	keep = 1 - m
	fond = flou(a * keep[..., None], 10) / (flou(keep, 10)[..., None] + 1e-6)
	return a * keep[..., None] + fond * m[..., None]


def lire_photo(path, nom, W=1920):
	im = Image.open(path).convert('RGB')
	if im.size != (1920, 1440):
		im = im.resize((1920, 1440), Image.LANCZOS)
	a = np.asarray(im, dtype=np.float32) / 255.0
	if nom == 'garona':
		a = sans_grues(a)
		# la ville est à contre-jour : le peintre lui rend la couleur de la brique
		ys = np.arange(1440, dtype=np.float32)[:, None] / 1440
		bande = np.clip(1 - np.abs(ys - 0.47) / 0.09, 0, 1)
		L = lum(a)
		w = (bande * np.clip((0.55 - L) / 0.4, 0, 1))[..., None]
		a = np.clip(a * (1 + w * np.array([0.32, 0.04, -0.12], np.float32)) + w * 0.05, 0, 1)
		# le garde-corps du bas à droite reste hors du cadre : on resserre la vue
		im = Image.fromarray((a * 255 + 0.5).astype(np.uint8)).crop((0, 40, 1632, 1264)).resize((1920, 1440), Image.LANCZOS)
		a = np.asarray(im, dtype=np.float32) / 255.0
	return a


def preparar(a, relevar=0.18, sat=1.08):
	L = lum(a)[..., None]
	a = np.clip(a + relevar * (1 - L) ** 3 * np.array([0.85, 1.0, 1.12], np.float32), 0, 1)
	L = lum(a)[..., None]
	a = L + (a - L) * sat
	t = np.clip((L - 0.2) / 0.6, 0, 1)
	a = a * (np.array([0.95, 0.985, 1.05], np.float32) * (1 - t) + np.array([1.035, 1.0, 0.95], np.float32) * t)
	a = np.clip(a, 0, 1).astype(np.float32)
	return np.pad(a, ((MARGE, MARGE), (MARGE, MARGE), (0, 0)), mode='reflect')


def masques(simp):
	L = flou(lum(simp), 2.0)
	m = boite_c(L, 12)
	sd = np.sqrt(np.maximum(boite_c(L * L, 12) - m * m, 0))
	lisse = flou(np.clip((0.04 - sd) / 0.025, 0, 1), 8)
	fx, fy, fc, ff = tenseur(flou(lum(simp), 1.2), 5)
	arete = np.clip((fc - 0.45) / 0.3, 0, 1) * np.clip(ff / 0.06, 0, 1)
	return lisse, arete, (fx, fy, fc, ff)


def regard(H, W, e):
	cx, cy, rx, ry = e
	ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
	x = (xs - MARGE) / (W - 2 * MARGE)
	y = (ys - MARGE) / (H - 2 * MARGE)
	d2 = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
	return np.clip(1.25 - 0.5 * d2, 0.12, 1).astype(np.float32)


def bruit(rng, H, W, s):
	n = flou(rng.standard_normal((H, W)).astype(np.float32), s)
	return n / (n.std() + 1e-9)


def champ4(lisse, tens, rng):
	fx, fy, fc, ff = tens
	H, W = lisse.shape
	# aplats : l'horizon qui ondule, des coups croisés par plaques ; feuillages : touches en tous sens
	ang = 0.17 * bruit(rng, H, W, 60) + lisse * 0.32 * bruit(rng, H, W, 22) + (1 - lisse) * 0.85 * bruit(rng, H, W, 7)
	bx, by = np.cos(ang), np.sin(ang)
	wf = np.clip(fc * 1.3, 0, 1) * np.clip(ff / 0.03, 0, 1) * (1 - 0.6 * lisse)
	fx, fy = aligner(fx, fy, bx, by)
	tx, ty = wf * fx + (1 - wf) * bx, wf * fy + (1 - wf) * by
	n = np.hypot(tx, ty) + 1e-9
	return (tx / n).astype(np.float32), (ty / n).astype(np.float32)


def couche(canvas, refq, R, T, nmax, tol, tx, ty, rng, premiera, var, masc, lisse, net=False):
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
		return canvas, 0
	col = refq[sy.astype(np.int32), sx.astype(np.int32)].copy()
	F = p2.tracar(sx, sy, col, refq, R, nmax, tol, tx, ty, 1)
	B = p2.tracar(sx, sy, col, refq, R, nmax, tol, tx, ty, -1)
	nf = (~np.isnan(F[:, :, 0])).sum(1)
	nb = (~np.isnan(B[:, :, 0])).sum(1)
	# la main varie moins dans le ciel et l'eau que dans les feuillages
	vl = (var * (0.3 + 0.7 * (1 - lisse[sy.astype(np.int32), sx.astype(np.int32)])))[:, None]
	colp = np.clip(col + rng.normal(0, 1, (n, 1)) * vl + rng.normal(0, 0.4, (n, 3)) * vl, 0, 1)
	larg = R * rng.uniform(0.8, 1.2, n)
	Lc = Image.new('RGB', (W, H))
	Lm = Image.new('L', (W, H), 0)
	La = Image.new('L', (W, H), 0)
	dc, dm, da = ImageDraw.Draw(Lc), ImageDraw.Draw(Lm), ImageDraw.Draw(La)
	for i in rng.permutation(n):
		pts = np.concatenate([B[i, : nb[i]][::-1], [[sx[i], sy[i]]], F[i, : nf[i]]])
		poly = poligon(pts, larg[i]).ravel().tolist()
		if len(pts) > 1:
			dv = pts[-1] - pts[0]
		else:
			dv = (tx[int(sy[i]), int(sx[i])], ty[int(sy[i]), int(sx[i])])
		a = int((np.arctan2(dv[1], dv[0]) % np.pi) / np.pi * 255) % 256
		dc.polygon(poly, fill=tuple(int(v * 255 + 0.5) for v in colp[i]))
		dm.polygon(poly, fill=255)
		da.polygon(poly, fill=a)
	lmh = np.asarray(Lm, dtype=np.float32) / 255.0
	lc0 = np.asarray(Lc, dtype=np.float32) / 255.0
	sa = max(1.0, R / 5)
	# hors des coups, la couleur du coup voisin (jamais le noir du calque vide)
	bave = flou(lc0 * lmh[..., None], sa * 1.5) / (flou(lmh, sa * 1.5)[..., None] + 1e-6)
	lc = np.where(lmh[..., None] > 0.5, lc0, bave)
	lm = flou(lmh, 0.6)
	la = np.asarray(La, dtype=np.float32) / 255.0 * np.pi
	# les poils de la brosse : du bruit étiré le long des coups, à l'échelle du pinceau
	br = lic(la, bruit(rng, H, W, max(0.7, R / 7)), int(min(22, max(6, 1.6 * R))))
	br = (br - br.mean()) / (br.std() + 1e-9)
	if premiera or net:
		# l'ébauche, et les arêtes (horizon, toits, troncs) : des bords francs
		al = lm
	else:
		# brosse sèche dans les feuillages et la roche ; dans le ciel et l'eau, des bords fondus
		coeur = flou(lm, max(1.0, R / 2.5))
		sec = lm * np.clip(0.5 + (coeur - 0.5) * 3.0 + 0.45 * br, 0, 1)
		fondu = np.minimum(flou(lmh, sa), 1)
		al = lisse * fondu + (1 - lisse) * sec
	lc = lc * (1 + 0.045 * br[..., None] * (0.35 + 0.65 * (1 - lisse))[..., None])
	canvas = canvas * (1 - al[..., None]) + lc * al[..., None]
	return np.clip(canvas, 0, 1).astype(np.float32), n


# rayon, seuil, longueur max (en pas d'un rayon), tolérance, où
COUCHES = [
	(62, 0, 4, 0.22, 'tot'),
	(36, 0.05, 6, 0.12, 'tot'),
	(19, 0.06, 8, 0.09, 'textura'),
	(10.5, 0.085, 9, 0.075, 'regard'),
	(5.5, 0.13, 10, 0.065, 'regard2'),
	(3, 0.07, 8, 0.08, 'arestas'),
]


REGLAGES = {'garona': dict(relevar=0.32, sat=1.15)}


def pintar(nom, path, sortie, graine=7, couches=COUCHES, k=36, fsig=0.35, var=0.022):
	t0 = time.time()
	rng = np.random.default_rng(graine)
	src = preparar(lire_photo(path, nom), **REGLAGES.get(nom, {}))
	simp = p2.kuwahara(guidat(src, 16, 0.01), 5)
	pal = p2.paleta(simp, k, rng)
	lisse, arete, tens = masques(simp)
	tx, ty = champ4(lisse, tens, rng)
	H, W = src.shape[:2]
	foc = regard(H, W, REGARD[nom])
	ls = lisse[..., None]
	# l'ébauche : le ciel et l'eau déjà en dégradé, ailleurs les grandes masses
	canvas = ls * flou(simp, 12) + (1 - ls) * p2.quantar(flou(simp, 30), pal)
	tot = 0
	for i, (R, T, nmax, tol, on) in enumerate(couches):
		if on == 'arestas':
			ref = flou(src, 1.0)
			masc = arete * np.maximum(foc, 0.35)
		else:
			refs = flou(simp, fsig * R)
			ref = ls * refs + (1 - ls) * p2.quantar(refs, pal)
			masc = {'tot': None, 'textura': 1 - lisse, 'regard': (1 - lisse) * foc, 'regard2': (1 - lisse) * foc * foc}[on]
		canvas, n = couche(canvas, ref, R, T, nmax, tol, tx, ty, rng, i == 0, var, masc, lisse, on == 'arestas')
		tot += n
		print(f'  {nom} couche {i} (rayon {R}) : {tot} coups, {time.time() - t0:.1f} s')
	out = canvas[MARGE:-MARGE, MARGE:-MARGE]
	img = Image.fromarray((out * 255 + 0.5).astype(np.uint8))
	img.save(sortie)
	print(f'fait : {sortie}, {tot} coups, {time.time() - t0:.1f} s')
	return img


if __name__ == '__main__':
	D = sys.argv[1]
	v = sys.argv[2]
	for nom in sys.argv[3:]:
		img = pintar(nom, f'{D}/{nom}-1920.webp', f'{nom}-{v}.png')
		img.resize((800, 600), Image.LANCZOS).save(f'{nom}-{v}-800.webp', 'WEBP', quality=74, method=6)
		img.resize((560, 420), Image.LANCZOS).save(f'{nom}-{v}-560.webp', 'WEBP', quality=72, method=6)
