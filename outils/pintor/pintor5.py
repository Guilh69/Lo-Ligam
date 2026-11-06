# Lo pintor, cinquième manière : le tableau se peint par plans, comme à l'atelier.
# - le ciel est peint à part : un dégradé propre, les nuages gardés en douceur,
#   un voile chaud vers l'horizon, le fil léger d'une large brosse ; jamais de taches ;
# - la terre est peinte sans jamais voir le ciel (la photo y est prolongée), puis le
#   ciel vient se poser par-dessus : les silhouettes (toits, crêtes, arbres) sont nettes ;
# - l'eau se peint en coups horizontaux, d'après une image étirée en largeur ;
# - là où le regard se pose, le peintre regarde la photo de plus près (plus de détail).
import sys
import time
import numpy as np
from PIL import Image
from pintor import flou, lum, aligner, lic
import pintor2 as p2
from pintor3 import guidat
from pintor4 import (MARGE, REGARD, COUCHES, lire_photo, preparar, masques, regard, bruit, couche)
from zonas import masque_ciel, masque_aiga

REGLAGES = {'garona': dict(relevar=0.24, sat=1.12)}


def flou_xy(a, sx, sy):
	"""flou étiré : sx en largeur, sy en hauteur"""
	p = int(3 * max(sx, sy)) + 1
	pad = ((p, p), (p, p)) + ((0, 0),) * (a.ndim - 2)
	b = np.pad(a, pad, mode='reflect')
	H, W = b.shape[:2]
	fy = np.fft.fftfreq(H)[:, None]
	fx = np.fft.rfftfreq(W)[None, :]
	g = np.exp(-2 * np.pi ** 2 * (sx ** 2 * fx ** 2 + sy ** 2 * fy ** 2))
	if b.ndim == 2:
		r = np.fft.irfft2(np.fft.rfft2(b) * g, s=(H, W))
	else:
		r = np.stack([np.fft.irfft2(np.fft.rfft2(b[..., c]) * g, s=(H, W)) for c in range(b.shape[2])], -1)
	return r[p:-p, p:-p].astype(np.float32)


def prolonger(img, m, s):
	"""la couleur de l'image hors du masque m (m = 1 là où l'on garde), prolongée dedans"""
	k = m[..., None]
	return flou(img * k, s) / (flou(m, s)[..., None] + 1e-6)


def champ5(lisse, tens, eau, rng):
	fx, fy, fc, ff = tens
	H, W = lisse.shape
	ang = 0.17 * bruit(rng, H, W, 60) + lisse * 0.32 * bruit(rng, H, W, 22) + (1 - lisse) * 0.85 * bruit(rng, H, W, 7)
	bx, by = np.cos(ang), np.sin(ang)
	wf = np.clip(fc * 1.3, 0, 1) * np.clip(ff / 0.03, 0, 1) * (1 - 0.6 * lisse)
	fx, fy = aligner(fx, fy, bx, by)
	tx, ty = wf * fx + (1 - wf) * bx, wf * fy + (1 - wf) * by
	if eau is not None:
		# l'eau : des coups couchés, à peine ondulés
		wa = 0.05 * bruit(rng, H, W, 40)
		tx = eau * np.cos(wa) + (1 - eau) * tx
		ty = eau * np.sin(wa) + (1 - eau) * ty
	n = np.hypot(tx, ty) + 1e-9
	return (tx / n).astype(np.float32), (ty / n).astype(np.float32)


def ciel_peint(src, M, rng):
	H, W = M.shape
	base = prolonger(src, M, 48)
	moyen = prolonger(src, M, 14)
	fin = prolonger(src, M, 4)
	c = base + 0.9 * (moyen - base) + 0.65 * (fin - moyen)
	# un voile chaud vers l'horizon, le haut du ciel un peu moins cyan
	ys = np.arange(H, dtype=np.float32)[:, None] * np.ones((1, W), np.float32)
	rows = np.nonzero(M.mean(1) > 0.02)[0]
	y0, y1 = (rows.min(), rows.max()) if len(rows) else (0, H)
	t = np.clip((ys - y0) / max(1, y1 - y0), 0, 1)[..., None]
	L = lum(c)[..., None]
	c = c + (t ** 1.6) * np.array([0.035, 0.012, -0.03], np.float32) * np.clip(L * 1.3, 0, 1)
	bleu = np.clip((c[..., 2:3] - c[..., 0:1]) * 2, 0, 1)
	c[..., 1:2] -= 0.035 * bleu * (1 - t)
	# le fil d'une large brosse, couché, qui ondule à peine ; des passages un peu plus chauds ou plus froids
	ang = (0.2 * bruit(rng, H, W, 90) + 0.1 * bruit(rng, H, W, 28)) % np.pi
	br = lic(ang, bruit(rng, H, W, 1.4), 34)
	br = (br - br.mean()) / (br.std() + 1e-9)
	pl = bruit(rng, H, W, 45)
	c = c * (1 + 0.016 * br[..., None]) + 0.012 * pl[..., None] * np.array([1.0, 0.4, -0.6], np.float32)
	return np.clip(c, 0, 1).astype(np.float32)


def pintar(nom, path, sortie, graine=7, couches=COUCHES, k=36, fsig=0.35, var=0.022):
	t0 = time.time()
	rng = np.random.default_rng(graine)
	a = lire_photo(path, nom)
	Mc = np.pad(masque_ciel(a, nom), MARGE, mode='reflect')
	src = preparar(a, **REGLAGES.get(nom, {}))
	Ea = masque_aiga(a, nom, Mc[MARGE:-MARGE, MARGE:-MARGE])
	eau = None if Ea is None else np.pad(Ea, MARGE, mode='reflect')
	# la terre ne voit jamais le ciel : la photo y est prolongée
	src_t = Mc[..., None] * prolonger(src, 1 - Mc, 30) + (1 - Mc[..., None]) * src
	simp = p2.kuwahara(guidat(src_t, 16, 0.01), 5)
	fin = p2.kuwahara(guidat(src_t, 5, 0.003), 3)
	pal = p2.paleta(simp, k, rng)
	lisse, arete, tens = masques(simp)
	tx, ty = champ5(lisse, tens, eau, rng)
	H, W = src.shape[:2]
	foc = regard(H, W, REGARD[nom])
	foc2 = np.clip((foc - 0.55) / 0.4, 0, 1)[..., None]
	ls = lisse[..., None]
	canvas = ls * flou(simp, 12) + (1 - ls) * p2.quantar(flou(simp, 30), pal)
	tot = 0
	for i, (R, T, nmax, tol, on) in enumerate(couches):
		if on == 'arestas':
			ref = flou(src_t, 1.0)
			masc = arete * np.maximum(foc, 0.35)
		else:
			base = simp if on in ('tot', 'textura') else foc2 * fin + (1 - foc2) * simp
			refs = flou(base, fsig * R)
			if eau is not None:
				e = eau[..., None]
				sx, sy = max(2.0, fsig * R * 3.2), max(0.5, fsig * R * 0.3)
				refe = flou_xy(base * e, sx, sy) / (flou_xy(eau, sx, sy)[..., None] + 1e-6)
				refs = e * refe + (1 - e) * refs
			ref = ls * refs + (1 - ls) * p2.quantar(refs, pal)
			masc = {'tot': None, 'textura': 1 - lisse, 'regard': (1 - lisse) * foc, 'regard2': (1 - lisse) * foc * foc}[on]
		canvas, n = couche(canvas, ref, R, T, nmax, tol, tx, ty, rng, i == 0, var, masc, lisse, on == 'arestas')
		tot += n
		print(f'  {nom} couche {i} (rayon {R}) : {tot} coups, {time.time() - t0:.1f} s')
	# le ciel posé par-dessus, bord net mais pas découpé au scalpel
	ciel = ciel_peint(src, Mc, rng)
	Mf = np.clip((flou(Mc, 1.3) - 0.5) * 2.4 + 0.5 + 0.1 * bruit(rng, H, W, 1.1), 0, 1)[..., None]
	canvas = Mf * ciel + (1 - Mf) * canvas
	out = canvas[MARGE:-MARGE, MARGE:-MARGE]
	img = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))
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
