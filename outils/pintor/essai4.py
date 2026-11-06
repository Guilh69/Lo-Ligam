import sys
import numpy as np
from PIL import Image
import pintor2 as p2
from pintor import lire, harmonia, lum


def boite_c(a, r):
	pad = ((r, 0), (r, 0)) + ((0, 0),) * (a.ndim - 2)
	b = np.pad(a, pad, mode='edge')
	return p2.boite(b, 2 * r + 1)[: a.shape[0], : a.shape[1]]


def guidat(I, r, eps):
	"""lissage qui garde les contours (filtre guidé, chaque couleur se guide elle-même)"""
	out = np.empty_like(I)
	for c in range(3):
		p = I[..., c]
		m = boite_c(p, r)
		v = boite_c(p * p, r) - m * m
		a = v / (v + eps)
		b = m - a * m
		out[..., c] = boite_c(a, r) * p + boite_c(b, r)
	return np.clip(out, 0, 1)


ancien_kuw = p2.kuwahara


def simplifier(img, r):
	if r == 'g':
		return guidat(img, 10, 0.004)
	return ancien_kuw(img, r)


p2.kuwahara = simplifier
harm0 = p2.harmonia


def harmonia2(img, sat):
	L = lum(img)[..., None]
	lift = 0.16 * (1 - L) ** 3
	img = img + lift * np.array([0.85, 1.0, 1.12], np.float32)
	return harm0(np.clip(img, 0, 1), sat)


p2.harmonia = harmonia2
if __name__ == "__main__":
	D = sys.argv[1]
	for nom in sys.argv[2:]:
		p2.pintar(f'{D}/{nom}-1920.webp', f'{nom}-v5.png', 7, k=36, kuw=('g', 4))
		im = Image.open(f'{nom}-v5.png')
		a = im.resize((800, 600), Image.LANCZOS)
		b = im.resize((400, 300), Image.LANCZOS)
		sheet = Image.new('RGB', (1216, 600), (27, 27, 27))
		sheet.paste(a, (0, 0))
		sheet.paste(b, (816, 0))
		sheet.paste(im.crop((900, 250, 1300, 550)), (816, 300))
		sheet.save(f'{nom}-v5-planche.png')
