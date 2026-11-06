# Planche : chaque photo de Romain à gauche, son tableau à droite (une ligne par paysage)
import sys
from PIL import Image

D, v, sortie = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = int(sys.argv[4]) if len(sys.argv) > 4 else 480, None
H = W * 3 // 4
ids = ['garona', 'vilatge', 'riu', 'plana', 'mar-pin']
G = 8
pl = Image.new('RGB', (W * 2 + G * 3, (H + G) * len(ids) + G), (24, 20, 18))
for r, n in enumerate(ids):
	ph = Image.open(f'{D}/{n}-1920.webp').convert('RGB')
	if n == 'garona':
		ph = ph.resize((1920, 1440), Image.LANCZOS).crop((0, 40, 1632, 1264))
	ph = ph.resize((W, H), Image.LANCZOS)
	pt = Image.open(f'{n}-{v}.png').convert('RGB').resize((W, H), Image.LANCZOS)
	y = G + r * (H + G)
	pl.paste(ph, (G, y))
	pl.paste(pt, (W + 2 * G, y))
pl.save(sortie)
print(sortie, pl.size)
