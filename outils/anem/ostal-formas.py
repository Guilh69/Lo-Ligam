# Contours exacts des quatre choses de la maison (Anem !, 2026-11-05), tirés du
# dessin : on reconnaît chaque chose à sa couleur dans sa boîte, on prend ses
# bords ligne par ligne, on simplifie, et on écrit un chemin SVG (repère 1328).
import sys, json
import numpy as np
from PIL import Image
s = sys.argv[1]
a = np.asarray(Image.open(s + '/ostal-sortie/ostal-plen3.png').convert('RGB')).astype(float)
H, W, _ = a.shape
fons = np.array([0xb3, 0x47, 0x25], float)
lum = a @ np.array([0.299, 0.587, 0.114])
sat = a.max(2) - a.min(2)
nonfons = np.abs(a - fons).sum(2) > 40
# le mur crème et le soubassement sable : clairs ; le crème est peu saturé
mur = (lum > 200) & (sat < 60)
sable = (lum > 180) & (sat >= 60) & (a[..., 0] > 230)

def boite(m, x0, x1, y0, y1):
    z = np.zeros_like(m); z[y0:y1, x0:x1] = m[y0:y1, x0:x1]; return z

def dilatar(m, n):
    for _ in range(n):
        p = m.copy()
        p[1:, :] |= m[:-1, :]; p[:-1, :] |= m[1:, :]
        p[:, 1:] |= m[:, :-1]; p[:, :-1] |= m[:, 1:]
        m = p
    return m

def rdp(pts, eps):
    if len(pts) < 3: return pts
    a_, b_ = np.array(pts[0], float), np.array(pts[-1], float)
    d = b_ - a_; n = np.hypot(*d) or 1.0
    dist = [abs(d[0] * (a_[1] - p[1]) - d[1] * (a_[0] - p[0])) / n for p in pts]
    i = int(np.argmax(dist))
    if dist[i] > eps:
        return rdp(pts[:i + 1], eps)[:-1] + rdp(pts[i:], eps)
    return [pts[0], pts[-1]]

def chemin(m, pas=3, eps=1.6):
    ys = np.nonzero(m.any(1))[0]
    g, d = [], []
    for y in range(ys.min(), ys.max() + 1, pas):
        xs = np.nonzero(m[y])[0]
        if len(xs): g.append((int(xs.min()), int(y))); d.append((int(xs.max()) + 1, int(y)))
    y = ys.max(); xs = np.nonzero(m[y])[0]
    g.append((int(xs.min()), int(y) + 1)); d.append((int(xs.max()) + 1, int(y) + 1))
    pts = rdp(g, eps) + rdp(d[::-1], eps)
    return 'M' + ' '.join(f'{x} {y}' for x, y in pts) + 'Z'

formas = {}
# toit : tout le dessin au-dessus de l'avant-toit (fenêtres du toit comprises),
# puis les festons bruns de l'avant-toit (ni mur, ni fond)
toit = boite(nonfons, 0, W, 0, 492) | boite(nonfons & ~mur & ~sable, 0, W, 492, 522)
formas['teulat'] = chemin(dilatar(toit, 3))
# fenêtres du bas : ni mur, ni fond, ni sable, dans leur boîte
fen = []
for (x0, x1, y0, y1) in ((300, 530, 560, 870), (775, 1030, 535, 860)):
    fen.append(chemin(dilatar(boite(nonfons & ~mur & ~sable, x0, x1, y0, y1), 3)))
# fenêtres du toit : cadre crème ou vitre sombre (pas les tuiles orange ni leurs joints)
for (x0, x1, y0, y1) in ((395, 605, 165, 385), (725, 930, 165, 385)):
    m = (mur | (lum < 70)) & nonfons
    # un seul pixel de marge : au-delà, le liseré de tuiles orange se colorie aussi
    fen.append(chemin(dilatar(boite(m, x0, x1, y0, y1), 1)))
formas['fenestras'] = ''.join(fen)
# porte : le bois (sombre) et sa poignée, ni mur ni sable
# (boîte serrée en largeur et en bas : la bande sombre du bas du soubassement déborde de la porte)
formas['porta'] = chemin(dilatar(boite(nonfons & ~mur & ~sable, 560, 776, 615, 977), 3))
formas['claus'] = chemin(dilatar(boite(nonfons, 960, 1240, 1000, 1270), 4))
for k, v in formas.items():
    print(k, len(v), 'caractères')
json.dump(formas, open(s + '/ostal-formas.json', 'w'), ensure_ascii=False, indent=1)

# contrôle visuel : la version pâle, et chaque forme coloriée par-dessus
from PIL import ImageDraw
gris = Image.open(s + '/ostal-sortie/ostal-gris-1080.webp').convert('RGB').resize((W, H))
col = Image.open(s + '/ostal-sortie/ostal-plen3.png').convert('RGB')
for k in formas:
    mk = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(mk)
    for sub in formas[k].split('Z'):
        if not sub: continue
        nums = list(map(int, sub[1:].split()))
        dr.polygon(list(zip(nums[0::2], nums[1::2])), fill=255)
    gris.paste(col, (0, 0), mk)
    gris.resize((664, 664)).save(f'{s}/forma-{k}.png')
