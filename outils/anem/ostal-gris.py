# Version « à colorier » de la maison (Anem !, 2026-11-05) : la maison et les
# clefs en gris pâle, comme un dessin pas encore colorié ; le fond reste rouille.
import sys
import numpy as np
from PIL import Image
s, dst = sys.argv[1], sys.argv[2]
a = np.asarray(Image.open(s + '/ostal-sortie/ostal-plen3.png').convert('RGB')).astype(float)
fons = np.array([0xb3, 0x47, 0x25], float)
dist = np.abs(a - fons).sum(2)
al = np.clip((dist - 20) / 60, 0, 1)[..., None]  # 0 sur le fond, 1 dans le dessin
lum = (a @ np.array([0.299, 0.587, 0.114]))[..., None]
pal = float(sys.argv[3]) if len(sys.argv) > 3 else 0.35  # part de blanc : un trait de crayon
gris = lum * (1 - pal) + 255 * pal
gris = np.repeat(gris, 3, axis=2) * np.array([1.0, 0.985, 0.96])  # gris chaud, pas bleuté
out = al * gris + (1 - al) * a
img = Image.fromarray(out.round().clip(0, 255).astype(np.uint8))
for c in (360, 720, 1080):
    f = f'{dst}/ostal-gris-{c}.webp'
    img.resize((c, c), Image.LANCZOS).save(f, 'WEBP', quality=80, method=6)
    print(f, __import__('os').path.getsize(f))
