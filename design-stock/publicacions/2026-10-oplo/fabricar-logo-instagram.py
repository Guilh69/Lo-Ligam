# Reconstruit à l'identique deux éléments des posts Canva de Romain (2026-10-24),
# d'après la composition lue dans le post « Eclipsi » (positions, tailles,
# rotations, couleurs, opacités, en pixels Canva d'un post 1080 × 1350) :
#  - le blason des coins du titre : écu « Shield Icon » (MADdGPMUVjw) brique
#    #b34725 et « Icone Croix Occitane » (MAFv6HJa7Zo) or clair #fbce77 ;
#  - le logo Instagram du coin bas droit : pastille brique inclinée à -135°,
#    croix or #e7a932, bulles (MAEbcerF7p0), et le texte « Lo ligam » avec ses
#    points blancs, relevés sur l'export Canva du post (police manuscrite de
#    Canva, que nous n'avons pas).
# Entrées (téléchargées depuis Canva, hors dépôt) : blason-s.png, crotz-t.png,
# bulles-t.png, eclipsi-4x.png (export PNG 4320 px de large).
# py fabricar-logo-instagram.py <dossier des entrées>   → blason.png, logo-instagram.png
import sys
from PIL import Image, ImageDraw, ImageFilter

ENT = sys.argv[1]
SORT = __file__.rsplit("/", 1)[0].rsplit("\\", 1)[0]
K = 4  # pixels par pixel Canva


def nuanciar(masque, color, opac=1.0):
    """Une couleur unie dont l'alpha est le masque (L)."""
    r, g, b = (int(color[i:i + 2], 16) for i in (1, 3, 5))
    im = Image.new("RGBA", masque.size, (r, g, b, 0))
    im.putalpha(masque.point(lambda v: round(v * opac)))
    return im


def alpha_de(fichier):
    return Image.open(ENT + "/" + fichier).convert("RGBA").getchannel("A")


def boita(v):
    return round(v * K)


# — le blason —
W, H = boita(45.677), boita(58.467)
escut = Image.open(ENT + "/blason-s.png").crop((0, 800, 625, 1600)).resize((W, H), Image.LANCZOS)
blason = nuanciar(escut, "#b34725")
c = boita(37.939)
crotz = alpha_de("crotz-t.png").resize((c, c), Image.LANCZOS)
blason.alpha_composite(nuanciar(crotz, "#fbce77"), (boita(3.869), boita(5.287)))
blason.save(SORT + "/blason.png", optimize=True)

# — le logo Instagram — (cadre en pixels Canva)
X0, Y0, X1, Y1 = 960, 1225, 1140, 1405
logo = Image.new("RGBA", (boita(X1 - X0), boita(Y1 - Y0)), (0, 0, 0, 0))
# la pastille : une gélule 142,77 × 76,15 tournée de -135° (sens horaire de Canva)
L, Hh = boita(142.767), boita(76.147)
gel = Image.new("L", (L * 4, Hh * 4), 0)
ImageDraw.Draw(gel).rounded_rectangle((0, 0, L * 4 - 1, Hh * 4 - 1), radius=Hh * 2, fill=255)
gel = gel.resize((L, Hh), Image.LANCZOS).rotate(135, resample=Image.BICUBIC, expand=True)
cx, cy = boita(978.014 + 142.767 / 2 - X0), boita(1281.324 + 76.147 / 2 - Y0)
logo.alpha_composite(nuanciar(gel, "#b34725", 0.8281), (cx - gel.width // 2, cy - gel.height // 2))
# la croix
c = boita(63.321)
# (trait épaissi d'un pixel : la croix vectorielle de Canva est rendue un peu plus grasse)
crotz = alpha_de("crotz-t.png").resize((c, c), Image.LANCZOS).filter(ImageFilter.MaxFilter(3))
logo.alpha_composite(nuanciar(crotz, "#e7a932", 0.91), (boita(1004.928 - X0), boita(1274.645 - Y0)))
# les bulles : orange → or, vert pâle → blanc
bw, bh = boita(6.285), boita(6.263)
bulles = Image.open(ENT + "/bulles-t.png").convert("RGBA").resize((bw, bh), Image.LANCZOS)
px = bulles.load()
for y in range(bh):
    for x in range(bw):
        r, g, b, a = px[x, y]
        px[x, y] = ((238, 175, 52) if r > g + 40 else (255, 255, 255)) + (round(a * 0.91),)
logo.alpha_composite(bulles, (boita(1041.748 - X0), boita(1273.251 - Y0)))
# « Lo ligam » et les points blancs, relevés sur l'export (le blanc seul, dans la pastille)
exp = Image.open(ENT + "/eclipsi-4x.png").convert("RGB")
k = exp.width / 1080
exp = exp.crop((round(X0 * k), round(Y0 * k), round(X1 * k), round(Y1 * k))).resize(logo.size, Image.LANCZOS)
dins = Image.new("L", logo.size, 0)
dins.paste(gel.point(lambda v: 255 if v > 250 else 0), (cx - gel.width // 2, cy - gel.height // 2))
dins = dins.filter(ImageFilter.MinFilter(9))
blau = exp.getchannel("B").point(lambda v: max(0, min(255, round((v - 110) * 255 / 145))))
blanc = Image.composite(blau, Image.new("L", logo.size, 0), dins)
logo.alpha_composite(nuanciar(blanc, "#ffffff"))
logo.save(SORT + "/logo-instagram.png", optimize=True)
print("blason", blason.size, "logo", logo.size)
