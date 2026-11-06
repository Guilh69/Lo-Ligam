"""Fonds photo de Remira (option « Fons : Fòto »), refaits le 2026-11-06 après la note de Romain
(« trop zoomé et mauvaise qualité + à-coups ») : les anciens fonds faisaient 960 à 1280 px, adoucis
d'un léger flou, et s'affichaient agrandis plus de deux fois sur un écran d'ordinateur.

Ici, depuis les photos d'origine de Romain :
- couleurs ramenées en sRGB, aucune métadonnée gardée (ni GPS, ni date, ni appareil) ;
- même recadrage qu'avant (Al mercat sans les étiquettes en français, Joan 05-11 ; Garriga = le bas
  de la photo de l'accueil) ;
- même teinte qu'avant : la retouche de chaque fond (saturation -15 %, luminosité du centre ramenée,
  teinte froide de Garriga et Fenèstra) a été relevée sur la version en ligne sous forme d'une
  matrice RVB, et appliquée telle quelle ; plus de flou ;
- deux largeurs, 1024 et 1920 px (ou la largeur de la source si elle est plus petite), en WebP.
Sortie : app/static/apren/remira/<clau>-<largeur>.webp ; les tailles vont dans lib/plueja/scenas.js.

Dépendances : pillow, numpy. Usage (depuis la racine du dépôt) : py outils/remira/fonds.py [qualité]
"""
import io, pathlib, sys
import numpy as np
from PIL import Image, ImageOps, ImageCms

ICI = pathlib.Path(__file__).parent
APP = ICI.parents[1] / 'app'
FOTOS = pathlib.Path.home() / 'Documents' / '6_Projectes' / 'Lo_Ligam_hors-git' / 'design-stock' / 'Fotos'
B = FOTOS / 'Bases_foto'
SORT = APP / 'static' / 'apren' / 'remira'
QUAL = int(sys.argv[1]) if len(sys.argv) > 1 else 50  # 50 : à l’œil comme 60 sous le voile, 13 % plus léger (06-11)
LARGORS = (1024, 1920)

# source, recadrage (pixels, ou fractions gauche/haut/droite/bas)
SOURCES = {
    'garriga': (FOTOS / 'extraits' / '1.png', (0, 788, 1748, 1999)),
    'fenestra': (APP / 'static' / 'acuelh' / 'erau.webp', None),
    'u1': (B / '20241231_164848.jpg', None),
    'u2': (B / 'DSCF1944.JPG', None),
    'u3': (B / 'PXL_20210811_130938113.jpg', None),
    'u4': (B / 'DSCF2324.JPG', None),
    'u5': (B / '20250507_153516.jpg', ('frac', 0.17, 0.22, 0.60, 0.66)),
    'u6': (B / '20180228_111329.jpg', None),
    'u7': (B / 'DSCF1645.JPG', None),
    'u8': (B / '20180103_140446.jpg', None),
}
# la retouche d'avant : sortie = (R, V, B, 1) · matrice (lignes : R, V, B, constante)
RETOCA = {
    'garriga': [(0.5263, 0.0933, 0.0004), (0.3125, 0.7467, 0.4730), (-0.0062, 0.0292, 0.5088), (0.0946, 3.5057, 4.4950)],
    'fenestra': [(0.6035, 0.0909, -0.0063), (0.2160, 0.7480, 0.3145), (0.0259, 0.0447, 0.6267), (2.1669, 2.8941, 8.9584)],
    'u1': [(0.5288, 0.0475, 0.0331), (0.1192, 0.5686, 0.0658), (-0.0169, 0.0202, 0.5398), (-0.0834, -0.2587, -0.8778)],
    'u2': [(0.4642, 0.0403, 0.0216), (0.1143, 0.5279, 0.1337), (-0.0025, 0.0092, 0.4258), (-0.8361, -1.0209, -3.0062)],
    'u3': [(0.7504, 0.0581, 0.0224), (0.1383, 0.8182, 0.1566), (-0.0043, 0.0126, 0.7207), (-1.9651, -1.7620, -3.5520)],
    'u4': [(0.5776, 0.0461, 0.0029), (0.0948, 0.6346, 0.1597), (0.0141, 0.0081, 0.5329), (-0.1166, -0.9589, -3.6664)],
    'u5': [(0.8541, 0.0644, 0.0343), (0.1425, 0.9163, 0.1492), (0.0057, 0.0248, 0.8235), (-0.0974, -0.4306, -1.0617)],
    'u6': [(0.4430, 0.0819, 0.0243), (0.0955, 0.4395, 0.1337), (-0.0001, 0.0160, 0.3840), (-1.1033, -0.8765, -1.9814)],
    'u7': [(0.7049, 0.0437, 0.0376), (0.1028, 0.7391, 0.0876), (-0.0038, 0.0256, 0.6809), (-1.2841, -0.2551, -0.8599)],
    'u8': [(0.7782, -0.0061, -0.0393), (0.0831, 0.8645, 0.1794), (-0.0072, 0.0019, 0.7231), (3.0972, 2.6178, 1.7400)],
}
SRGB = ImageCms.createProfile('sRGB')


def charger(cami, talh):
    im = Image.open(cami)
    icc = im.info.get('icc_profile')
    im = ImageOps.exif_transpose(im)
    if icc:
        try:
            im = ImageCms.profileToProfile(im, ImageCms.ImageCmsProfile(io.BytesIO(icc)), SRGB, outputMode='RGB')
        except Exception:
            im = im.convert('RGB')
    im = im.convert('RGB')
    if talh and talh[0] == 'frac':
        g, h, d, b = talh[1:]
        im = im.crop((round(im.width * g), round(im.height * h), round(im.width * d), round(im.height * b)))
    elif talh:
        im = im.crop(talh)
    return im


def retocar(im, M):
    a = np.asarray(im, dtype=np.float32)
    M = np.asarray(M, dtype=np.float32)
    o = a @ M[:3] + M[3]
    return Image.fromarray(np.clip(o + 0.5, 0, 255).astype(np.uint8), 'RGB')


SORT.mkdir(parents=True, exist_ok=True)
tot = 0
for clau, (cami, talh) in SOURCES.items():
    im = charger(cami, talh)
    largors = sorted({min(l, im.width) for l in LARGORS})
    tailles = []
    for l in largors:
        h = round(im.height * l / im.width)
        r = retocar(im.resize((l, h), Image.LANCZOS), RETOCA[clau])
        out = SORT / f'{clau}-{l}.webp'
        r.save(out, 'WEBP', quality=QUAL, method=6)  # sans exif ni icc
        k = out.stat().st_size / 1024
        tot += k
        tailles.append(f'{l}x{h} {k:.0f} Ko')
    print(f"{clau:9} amples: [{', '.join(str(l) for l in largors)}], l: {largors[-1]}, h: {round(im.height * largors[-1] / im.width)}   ({' ; '.join(tailles)})")
print(f'total {tot:.0f} Ko')
