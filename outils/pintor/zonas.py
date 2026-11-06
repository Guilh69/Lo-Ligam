# Les zones du tableau : le ciel (peint à part, en dégradé propre, silhouette nette)
# et l'eau (coups horizontaux). Calculées sur la photo, avec un indice par tableau.
import numpy as np
from PIL import Image
from pintor import flou, lum
from pintor3 import boite_c

# limite basse possible du ciel, ciel relié au bord haut, limite haute possible
CIEL = {
	'garona': dict(ymax=0.6, connexe=True),
	'vilatge': dict(ymax=0.42, connexe=True),
	'riu': dict(ymax=0.5, connexe=True),
	'plana': dict(ymax=0.48, connexe=False, ymin=0.22, lmin=0.6),
	'mar-pin': dict(ymax=0.45, connexe=True, horizon=(0.3, 0.45)),
}
AIGA = {
	'garona': dict(ymin=0.575, lmax=0.72),
	'mar-pin': dict(mer=True),
}


def guidat_gris(G, p, r, eps):
	"""filtre guidé : le masque p épouse les bords de l'image grise G"""
	mI = boite_c(G, r)
	mp = boite_c(p, r)
	cov = boite_c(G * p, r) - mI * mp
	var = boite_c(G * G, r) - mI * mI
	a = cov / (var + eps)
	b = mp - a * mI
	return boite_c(a, r) * G + boite_c(b, r)


def croissance(cand, graine, it=3000):
	m = graine & cand
	for _ in range(it):
		d = m.copy()
		d[1:] |= m[:-1]
		d[:-1] |= m[1:]
		d[:, 1:] |= m[:, :-1]
		d[:, :-1] |= m[:, 1:]
		d &= cand
		if (d == m).all():
			break
		m = d
	return m


def horizon_ligne(a, y0, y1):
	"""la ligne d'horizon de la mer, droite (éventuellement penchée) : le saut de clarté le plus fort"""
	H, W = a.shape[:2]
	L = flou(lum(a), 1.5)
	gy = np.zeros_like(L)
	gy[1:-1] = L[:-2] - L[2:]
	ys = []
	xs = []
	for k in range(8):
		x0, x1 = k * W // 8, (k + 1) * W // 8
		band = gy[int(y0 * H):int(y1 * H), x0:x1].mean(1)
		ys.append(int(y0 * H) + int(band.argmax()))
		xs.append((x0 + x1) / 2)
	ys = np.array(ys, np.float32)
	xs = np.array(xs, np.float32)
	med = np.median(ys)
	ok = np.abs(ys - med) < H * 0.02
	p = np.polyfit(xs[ok], ys[ok], 1)
	return p


def masque_ciel(a, nom):
	"""1 dans le ciel, 0 ailleurs, bord doux de 1 à 2 pixels qui épouse la photo"""
	c = CIEL[nom]
	H, W = a.shape[:2]
	s = 4
	im = Image.fromarray((a * 255 + 0.5).astype(np.uint8)).resize((W // s, H // s), Image.BOX)
	b = np.asarray(im, dtype=np.float32) / 255.0
	h, w = b.shape[:2]
	L = lum(b)
	R, G, B = b[..., 0], b[..., 1], b[..., 2]
	mx, mn = b.max(-1), b.min(-1)
	sat = (mx - mn) / (mx + 1e-6)
	bleu = (B > R + 0.08) & (B >= G - 0.03) & (L > 0.38)
	pale = (L > c.get('lmin', 0.68)) & (sat < 0.2)
	ys = (np.arange(h, dtype=np.float32)[:, None] + 0.5) / h * np.ones((1, w), np.float32)
	cand = (bleu | pale) & (ys < c['ymax']) & (ys >= c.get('ymin', 0))
	if 'lmin' in c:
		cand &= L > c['lmin']
	if 'horizon' in c:
		p = horizon_ligne(b, *c['horizon'])
		xs = np.arange(w, dtype=np.float32)[None, :]
		cand &= ys * h < (p[0] * xs + p[1])
	# pas à travers un bord net
	Lf = flou(L, 0.8)
	gx = np.zeros_like(Lf)
	gy = np.zeros_like(Lf)
	gx[:, 1:-1] = Lf[:, 2:] - Lf[:, :-2]
	gy[1:-1] = Lf[2:] - Lf[:-2]
	cand &= np.hypot(gx, gy) < 0.09
	if c['connexe']:
		g = np.zeros_like(cand)
		g[0] = True
		m = croissance(cand, g)
	else:
		m = cand
	# les trous de quelques pixels (un oiseau, une miette) refermés
	mf = flou(m.astype(np.float32), 1.0) > 0.5
	m = (m | (mf & (ys < c['ymax']))).astype(np.float32)
	M = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), dtype=np.float32) / 255.0
	Lp = lum(a)
	M = np.clip(guidat_gris(Lp, M, 6, 2e-3), 0, 1)
	M = np.clip((M - 0.5) * 2.2 + 0.5, 0, 1)
	if 'horizon' in c:
		p = horizon_ligne(a, *c['horizon'])
		yy = np.arange(H, dtype=np.float32)[:, None]
		xx = np.arange(W, dtype=np.float32)[None, :]
		M *= np.clip((p[0] * xx + p[1]) - yy + 0.5, 0, 1)
	return M.astype(np.float32)


def masque_aiga(a, nom, ciel):
	c = AIGA.get(nom)
	H, W = a.shape[:2]
	if c is None:
		return None
	L = flou(lum(a), 2.0)
	R, G, B = [flou(a[..., k], 2.0) for k in range(3)]
	ys = np.arange(H, dtype=np.float32)[:, None] / H * np.ones((1, W), np.float32)
	if c.get('mer'):
		p = horizon_ligne(a, *CIEL[nom]['horizon'])
		xx = np.arange(W, dtype=np.float32)[None, :]
		yy = np.arange(H, dtype=np.float32)[:, None]
		sous = np.clip(yy - (p[0] * xx + p[1]) + 0.5, 0, 1)
		m = sous * ((B > R + 0.15) & (B > G + 0.08) & (L < 0.62)).astype(np.float32)
	else:
		m = ((ys > c['ymin']) & (L < c['lmax']) & (B >= R - 0.02)).astype(np.float32)
	m = flou(m, 6.0)
	m = np.clip((m - 0.5) * 3 + 0.5, 0, 1) * (1 - ciel)
	return m.astype(np.float32)


if __name__ == '__main__':
	import sys
	from pintor4 import lire_photo
	D = sys.argv[1]
	rows = []
	for nom in ['garona', 'vilatge', 'riu', 'plana', 'mar-pin']:
		a = lire_photo(f'{D}/{nom}-1920.webp', nom)
		M = masque_ciel(a, nom)
		E = masque_aiga(a, nom, M)
		v = a.copy()
		v = v * (1 - 0.55 * M[..., None]) + 0.55 * M[..., None] * np.array([1, 0.1, 0.1], np.float32)
		if E is not None:
			v = v * (1 - 0.5 * E[..., None]) + 0.5 * E[..., None] * np.array([1, 0.9, 0], np.float32)
		im = Image.fromarray((np.clip(v, 0, 1) * 255 + 0.5).astype(np.uint8)).resize((480, 360), Image.LANCZOS)
		rows.append(im)
		np.save(f'ciel-{nom}.npy', M)
		print(nom, 'ciel', round(float(M.mean()), 3), 'eau', None if E is None else round(float(E.mean()), 3))
	pl = Image.new('RGB', (960 + 10, 360 * 3 + 20), (30, 30, 30))
	for i, im in enumerate(rows):
		pl.paste(im, ((i % 2) * 490, (i // 2) * 370))
	pl.save('zonas.png')
