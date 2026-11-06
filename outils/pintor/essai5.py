import sys
import numpy as np
from PIL import Image
import essai4  # noqa : pose les remplacements (lissage guidé, ombres relevées)
import pintor2 as p2
from pintor import flou, lum, tenseur, aligner


def champ2(img, f0=0.03, kc=0.35):
	"""comme champ, mais le ciel et les grands aplats restent couchés à l'horizontale"""
	L = flou(lum(img), 1.2)
	fx, fy, fc, ff = tenseur(L, 5)
	cx, cy, cc, cf = tenseur(L, 28)
	hx, hy = np.ones_like(L), np.zeros_like(L)
	wc = kc * np.clip(cc * 1.4, 0, 1) * np.clip(cf / f0, 0, 1)
	cx, cy = aligner(cx, cy, hx, hy)
	bx, by = wc * cx + (1 - wc) * hx, wc * cy + (1 - wc) * hy
	n = np.hypot(bx, by) + 1e-9
	bx, by = bx / n, by / n
	wf = np.clip(fc * 1.3, 0, 1) * np.clip(ff / f0, 0, 1)
	fx, fy = aligner(fx, fy, bx, by)
	tx, ty = wf * fx + (1 - wf) * bx, wf * fy + (1 - wf) * by
	n = np.hypot(tx, ty) + 1e-9
	return (tx / n).astype(np.float32), (ty / n).astype(np.float32)


p2.champ = champ2
simp0 = p2.kuwahara


def simplifier(img, r):
	if r == 'G':
		return essai4.guidat(img, 16, 0.01)
	return simp0(img, r)


p2.kuwahara = simplifier
C = [(46, 0, 5, 0.2), (28, 0.05, 7, 0.1), (16, 0.065, 9, 0.08), (9, 0.11, 10, 0.07), (5, 0.2, 12, 0.06)]
D = sys.argv[1]
for nom in sys.argv[2:]:
	p2.pintar(f'{D}/{nom}-1920.webp', f'{nom}-v6.png', 7, couches=C, k=36, kuw=('G', 5))
	Image.open(f'{nom}-v6.png').resize((800, 600), Image.LANCZOS).save(f'{nom}-v6-800.png')
