# La maison à toucher (Anem !, 2026-11-05) : on part de l'export Canva de
# Romain en 2160 px (design « Ostal »), on efface flèches et textes grâce à la
# version nette en 860 px (ostal-net.webp, sans flèches), on garde la maison et
# les clefs, on les recompose dans un carré et on enregistre trois tailles.
# Chaîne complète (dossier de travail D, hors du dépôt, avec D/canva-ostal/ostal.png) :
#   py ostal.py D/canva-ostal/ostal.png app/static/ensag/scena/ostal-net.webp D/ostal-sortie
#   py ostal-retoc.py D      (deux traces de flèche sur le toit)
#   py ostal-gris.py D D/ostal-sortie   (la version pâle, à colorier)
#   py ostal-formas.py D     (les contours exacts, à recopier dans app/src/lib/anem/scenas.js)
# puis copier D/ostal-sortie/ostal-*.webp dans app/static/anem/. Même recette pour le corps.
import sys
from collections import Counter, deque
from pathlib import Path
import numpy as np
from PIL import Image

src, net, dst = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
dst.mkdir(parents=True, exist_ok=True)
A = np.asarray(Image.open(src).convert('RGB')).astype(np.int16)
H, W, _ = A.shape
B = np.asarray(Image.open(net).convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.int16)
FONS = np.array(Counter(map(tuple, A[::7, ::7].reshape(-1, 3))).most_common(1)[0][0], dtype=np.int16)
print('fond', '#%02x%02x%02x' % tuple(int(v) for v in FONS))

def dilatar(m, n):
    for _ in range(n):
        p = m.copy()
        p[1:, :] |= m[:-1, :]; p[:-1, :] |= m[1:, :]
        p[:, 1:] |= m[:, :-1]; p[:, :-1] |= m[:, 1:]
        m = p
    return m

# flèches et lettres : blanches dans l'export, absentes de la version nette
diff = np.abs(A - B).sum(2)
blanc = A.min(2) > 215
fleca = dilatar(blanc & (diff > 110), 6)
A2 = np.where(fleca[..., None], B, A)
print('pixels de flèche remplacés', int(fleca.sum()))
plen = np.abs(A2 - FONS).sum(2) > 36

def emplenar(graines, x0, x1, y0, y1):
    m = np.zeros((H, W), bool)
    q = deque()
    for (x, y) in graines:
        if not plen[y, x]:
            ys, xs = np.nonzero(plen[y - 60:y + 60, x - 60:x + 60])
            assert len(xs), (x, y)
            i = np.argmin((xs - 60) ** 2 + (ys - 60) ** 2)
            x, y = x - 60 + xs[i], y - 60 + ys[i]
        m[y, x] = True
        q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if x0 <= nx <= x1 and y0 <= ny <= y1 and not m[ny, nx] and plen[ny, nx]:
                m[ny, nx] = True
                q.append((nx, ny))
    return m

def tirar(graines, x0, x1, y0, y1):
    m = emplenar(graines, x0, x1, y0, y1)
    m = dilatar(m, 3)
    zona = np.zeros((H, W), bool); zona[y0:y1 + 1, x0:x1 + 1] = True
    m &= zona
    ys, xs = np.nonzero(m)
    bx0, bx1, by0, by1 = xs.min(), xs.max(), ys.min(), ys.max()
    pec = np.where(m[..., None], A2, FONS)[by0:by1 + 1, bx0:bx1 + 1]
    mas = m[by0:by1 + 1, bx0:bx1 + 1]
    print('  boîte', (bx0, bx1, by0, by1))
    return pec, mas

print('maison'); ostal, mo = tirar([(1080, 900), (660, 1300), (1060, 1400), (1300, 1300)], 470, 1700, 640, 1620)
print('clefs'); claus, mc = tirar([(2000, 2000), (2060, 2040), (2090, 2000)], 1900, 2150, 1850, 2150)

hO, wO = ostal.shape[:2]; hC, wC = claus.shape[:2]
M = 100  # marge
costat = wO + 2 * M
tela = np.empty((costat, costat, 3), np.uint8); tela[:] = FONS
oy = (costat - (hO + 40 + hC)) // 2  # maison et clefs centrées ensemble en hauteur
ox = M
tela[oy:oy + hO, ox:ox + wO][mo] = ostal[mo]
# les clefs pendent sous le coin droit de la maison
cx, cy = ox + wO - wC - 30, oy + hO + 40
tela[cy:cy + hC, cx:cx + wC][mc] = claus[mc]
print('carré', costat, 'maison', (ox, oy, wO, hO), 'clefs', (cx, cy, wC, hC))
img = Image.fromarray(tela)
img.save(dst / 'ostal-plen.png')
for c in (360, 720, 1080):
    f = dst / f'ostal-{c}.webp'
    img.resize((c, c), Image.LANCZOS).save(f, 'WEBP', quality=82, method=6)
    print(f.name, f.stat().st_size, 'octets')
