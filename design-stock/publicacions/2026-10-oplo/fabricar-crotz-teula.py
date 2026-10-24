# Le logo du site en image (Romain, 2026-10-24 : « prendre mon logo qui a été
# validé dans le projet, le logo qu'on utilise sur le site ») : la tuile brique
# de la barre du haut, croix-constellation à traits blancs, pommettes or clair,
# moyeu or. La géométrie est lue dans app/src/lib/components/Crotz.svelte
# (version `teula`), pour rester identique au site ; dessinée 4 fois plus grand
# puis réduite, pour des bords nets.
# py fabricar-crotz-teula.py   → crotz-teula.png (340 × 340)
import re
from pathlib import Path
from PIL import Image, ImageDraw

AQUI = Path(__file__).resolve().parent
SVELTE = (AQUI / "../../../app/src/lib/components/Crotz.svelte").read_text(encoding="utf-8")
COTE, SUR = 340, 4
M = 1.366  # demi-côté de la tuile (viewBox de la version `teula`)
S = COTE * SUR / (2 * M)  # pixels par unité
TEULA, TRAC, PONCH, MOIEU = "#b53d17", "#ffffff", "#ffd47f", "#eeaf34"

px = lambda x, y: ((x + M) * S, (y + M) * S)
im = Image.new("RGBA", (COTE * SUR,) * 2, (0, 0, 0, 0))
dr = ImageDraw.Draw(im)
dr.rounded_rectangle((0, 0, COTE * SUR - 1, COTE * SUR - 1), radius=0.466 * S, fill=TEULA)


def trait(pts, ep):
    """Un trait à bouts ronds (stroke-linecap: round)."""
    l = ep * S
    q = [px(*p) for p in pts]
    for a, b in zip(q, q[1:]):  # segment par segment, un disque à chaque sommet : ni encoche ni jour
        dr.line([a, b], fill=TRAC, width=round(l))
    for x, y in q:
        dr.ellipse((x - l / 2, y - l / 2, x + l / 2, y + l / 2), fill=TRAC)


nombre = r"(-?[\d.]+)"
for d, ep in re.findall(r'<path d="([^"]+)" stroke-width="([\d.]+)"', SVELTE):
    ep = float(ep)
    for seg in d.split("M")[1:]:
        if "Q" in seg:  # une courbe quadratique, échantillonnée
            a, rest = seg.split("Q")
            (x0, y0), (cx, cy, x1, y1) = map(float, a.split()), map(float, rest.split())
            pts = [((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1,
                    (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1) for t in (k / 48 for k in range(49))]
        else:
            pts = [tuple(map(float, p.split())) for p in seg.split("L")]
        trait(pts, ep)
for cx, cy, r, moieu in re.findall(r'<circle cx="' + nombre + '" cy="' + nombre + '" r="' + nombre + '"( style)?',
                                  SVELTE):
    x, y = px(float(cx), float(cy))
    r = float(r) * S
    dr.ellipse((x - r, y - r, x + r, y + r), fill=MOIEU if moieu else PONCH)

im.resize((COTE, COTE), Image.LANCZOS).save(AQUI / "crotz-teula.png", optimize=True)
print("crotz-teula.png", COTE)
