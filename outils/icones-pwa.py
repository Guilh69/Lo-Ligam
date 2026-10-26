# Fabrique les icônes de l'application installable (PWA) à partir de la
# géométrie de la crotz-constellacion (app/src/lib/components/Crotz.svelte,
# variante « teula »). Lancer : py outils/icones-pwa.py
from PIL import Image, ImageDraw
import os

SORTIDA = os.path.join(os.path.dirname(__file__), '..', 'app', 'static', 'icones-app')
M = 1.366
RAJOLS = [(0.486,-0.797),(0.809,-0.48),(0.809,0.48),(0.486,0.797),(-0.468,0.797),(-0.786,0.48),(-0.786,-0.48),(-0.468,-0.797)]
ARCS = [((-0.468,-0.797),(-0.194,-0.746),(0,-1)),((0,-1),(0.202,-0.746),(0.486,-0.797)),
        ((0.809,-0.48),(0.751,-0.199),(1,0)),((1,0),(0.751,0.199),(0.809,0.48)),
        ((0.486,0.797),(0.202,0.742),(0,0.992)),((0,0.992),(-0.194,0.742),(-0.468,0.797)),
        ((-0.786,0.48),(-0.731,0.203),(-0.976,0.009)),((-0.976,0.009),(-0.731,-0.195),(-0.786,-0.48))]
PONCHS = [(0,-1),(0.486,-0.797),(0.809,-0.48),(1,0),(0.809,0.48),(0.486,0.797),(0,0.992),(-0.468,0.797),(-0.786,0.48),(-0.976,0.009),(-0.786,-0.48),(-0.468,-0.797)]

def dessenhar(talha, plen, rond):
    S = 4  # sur-échantillonnage pour lisser
    N = talha * S
    im = Image.new('RGBA', (N, N), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if rond:
        d.rounded_rectangle([0, 0, N - 1, N - 1], radius=int(N * 0.466 / (2 * M)), fill='#b53d17')
    else:
        d.rectangle([0, 0, N, N], fill='#b53d17')
    k = N / (2 * M) * plen  # plen < 1 : symbole réduit (zone sûre des icônes « maskable »)
    P = lambda x, y: (N / 2 + x * k, N / 2 + y * k)
    def fil(a, b, ep):
        d.line([P(*a), P(*b)], fill='#ffffff', width=max(1, round(ep * k)), joint='curve')
        for p in (a, b):
            x, y = P(*p); r = ep * k / 2
            d.ellipse([x - r, y - r, x + r, y + r], fill='#ffffff')
    for r in RAJOLS:
        fil((0, 0), r, 0.063)
    for a, c, b in ARCS:
        pts = [((1-t)**2*a[0]+2*(1-t)*t*c[0]+t*t*b[0], (1-t)**2*a[1]+2*(1-t)*t*c[1]+t*t*b[1]) for t in [i/24 for i in range(25)]]
        for p, q in zip(pts, pts[1:]):
            fil(p, q, 0.07)
    for p in PONCHS:
        x, y = P(*p); r = 0.109 * k
        d.ellipse([x - r, y - r, x + r, y + r], fill='#ffd47f')
    x, y = P(0, 0); r = 0.124 * k
    d.ellipse([x - r, y - r, x + r, y + r], fill='#eeaf34')
    return im.resize((talha, talha), Image.LANCZOS)

os.makedirs(SORTIDA, exist_ok=True)
for nom, talha, plen, rond in [('icona-192.png',192,1,True),('icona-512.png',512,1,True),
                                ('icona-maskable-512.png',512,0.62,False),('apple-touch-180.png',180,0.8,False)]:
    dessenhar(talha, plen, rond).save(os.path.join(SORTIDA, nom), optimize=True)
    print(nom, os.path.getsize(os.path.join(SORTIDA, nom)))
