# Retouche de deux traces de flèche sur le toit (ostal-plen.png) : on recopie un
# joint de tuile propre de la même rangée sur le joint barbouillé, avec un fondu.
import sys
import numpy as np
from PIL import Image
s = sys.argv[1]
a = np.asarray(Image.open(s + '/ostal-sortie/ostal-plen.png')).astype(float)
sx, tx, dy = 622, 995, -4
y0, y1 = 284, 356
w, f = 24, 10
pec = a[y0:y1, sx - w:sx + w].copy()
h = y1 - y0
ax = np.clip((w - np.abs(np.arange(-w, w) + 0.5)) / f, 0, 1)
ay = np.clip(np.minimum(np.arange(h) + 0.5, h - np.arange(h) - 0.5) / 4, 0, 1)
al = (ay[:, None] * ax[None, :])[..., None]
dst = a[y0 + dy:y1 + dy, tx - w:tx + w]
a[y0 + dy:y1 + dy, tx - w:tx + w] = al * pec + (1 - al) * dst
Image.fromarray(a.round().clip(0, 255).astype(np.uint8)).save(s + '/ostal-sortie/ostal-plen2.png')

# bord du toit : les pixels verdâtres du bout de la boucle redeviennent un
# mélange de tuile et de fond, selon leur position entre les deux couleurs
a = np.asarray(Image.open(s + '/ostal-sortie/ostal-plen2.png')).astype(float)
teula = a[250:262, 990:1010].reshape(-1, 3).mean(0)
fons = np.array([0xb3, 0x47, 0x25], float)
x0, x1, y0, y1 = 1038, 1102, 255, 318
z = a[y0:y1, x0:x1]
d = teula - fons
t = np.clip(((z - fons) @ d) / (d @ d), 0, 1)[..., None]
proj = fons + t * d
brun = a[274:280, 985:1000].reshape(-1, 3).mean(0)
rest = np.linalg.norm(z - proj, axis=2)
dbrun = np.linalg.norm(z - brun, axis=2)
# seulement les pixels hors teinte (ni tuile, ni fond, ni joint brun)
m = (rest > 22) & (dbrun > 45)
z[m] = proj[m]
a[y0:y1, x0:x1] = z
print('pixels repeints au bord', int(m.sum()))
# petite tache claire sur la ligne de tuiles du dessous : copie de la ligne 22 px à gauche
a[344:360, 998:1020] = a[344:360, 976:998]
Image.fromarray(a.round().clip(0, 255).astype(np.uint8)).save(s + '/ostal-sortie/ostal-plen3.png')
img = Image.fromarray(a.round().clip(0, 255).astype(np.uint8))
for c in (360, 720, 1080):
    f = s + f'/ostal-sortie/ostal-{c}.webp'
    img.resize((c, c), Image.LANCZOS).save(f, 'WEBP', quality=82, method=6)
