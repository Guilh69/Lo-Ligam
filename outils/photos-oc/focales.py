"""Focale de chaque photo en ligne, pour le calcul de perspective de la page Imaginar.

La page calcule le plan du mur dans le navigateur (app/src/lib/imagina/perspectiva.js). Il lui faut la focale
de la prise de vue : elle est dans la photo d'origine (EXIF), pas dans le WebP en ligne, qui n'a plus aucune
métadonnée. Ce script relit donc les originaux et écrit app/src/lib/imagina/focales.json :

    { "<clau>": [f, cx, cy] }   f = focale en largeurs d'image ; cx, cy = centre optique en fraction de la photo

Rien d'autre ne sort des originaux (ni lieu, ni date, ni appareil). Une photo recadrée pour le site est
retrouvée dans son original par corrélation, pour que le centre optique reste juste.

Usage : python.exe -X utf8 outils/photos-oc/focales.py [--dossier <Bases_foto>]
"""
import argparse, json, os, re, sys
import numpy as np
from PIL import Image, ImageOps

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.abspath(os.path.join(ICI, '..', '..'))
DOSSIER = 'C:/Users/perie/Documents/6_Projectes/Lo_Ligam_hors-git/design-stock/Fotos/Bases_foto'
TABLE = os.path.join(RACINE, 'revisions', '2026-11-06-paisatges-temas.md')
LISTE = os.path.join(RACINE, 'app', 'src', 'lib', 'paisatges', 'paisatges.js')
EN_LIGNE = os.path.join(RACINE, 'app', 'static', 'apren', 'paisatges')
SORTIE = os.path.join(RACINE, 'app', 'src', 'lib', 'imagina', 'focales.json')


def table():
    """clé du site -> nom du fichier d'origine (sans extension), lue dans la note du 06-11."""
    t = {}
    for ligne in open(TABLE, encoding='utf-8'):
        if '←' not in ligne:
            continue
        for bout in re.split(r'[|·]', ligne):
            m = re.match(r'\s*([a-z0-9-]+)\s*←\s*(.+?)\s*$', bout)
            if m:
                t[m.group(1)] = m.group(2).strip()
    return t


def liste():
    """clé -> (l, h, plus grande largeur) lue dans paisatges.js."""
    txt = open(LISTE, encoding='utf-8').read()
    r = {}
    for m in re.finditer(r"clau: '([^']+)',\s*tema: '[^']+',\s*amples: \[([^\]]+)\],\s*l: (\d+),\s*h: (\d+)", txt):
        r[m.group(1)] = (int(m.group(3)), int(m.group(4)), max(int(a) for a in m.group(2).split(',')))
    return r


def trouver(dossier, nom):
    for ext in ('.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG', '.webp'):
        c = os.path.join(dossier, nom + ext)
        if os.path.exists(c):
            return c
    bas = nom.lower()
    for f in os.listdir(dossier):
        if os.path.splitext(f)[0].lower() == bas:
            return os.path.join(dossier, f)
    return None


def cadre_dans_original(orig, enligne):
    """Où la photo en ligne se trouve dans l'original (x0, y0, x1, y1 en fractions), par corrélation à petite taille."""
    Wo, Ho = orig.size
    l, h = enligne.size
    # même hauteur ou même largeur : le recadrage ne joue que sur un axe quand les proportions diffèrent
    n = 96
    a = np.asarray(orig.convert('L').resize((n * 2, round(n * 2 * Ho / Wo)), Image.LANCZOS), np.float32)
    meilleur = None
    for k in np.linspace(0.5, 1.0, 26):       # part de la largeur de l'original que couvre la photo en ligne
        w = round(a.shape[1] * k); hh = round(w * h / l)
        if hh > a.shape[0] or w < 16 or hh < 16:
            continue
        b = np.asarray(enligne.convert('L').resize((w, hh), Image.LANCZOS), np.float32)
        b = (b - b.mean()) / (b.std() + 1e-6)
        for y in range(0, a.shape[0] - hh + 1, 2):
            for x in range(0, a.shape[1] - w + 1, 2):
                c = a[y:y + hh, x:x + w]
                s = float(((c - c.mean()) / (c.std() + 1e-6) * b).mean())
                if meilleur is None or s > meilleur[0]:
                    meilleur = (s, x / a.shape[1], y / a.shape[0], (x + w) / a.shape[1], (y + hh) / a.shape[0])
    return meilleur


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dossier', default=DOSSIER)
    a = ap.parse_args()
    tb, ls = table(), liste()
    sortie, manque, recadrees, sans_focale = {}, [], [], []
    for clau, (l, h, ample) in ls.items():
        nom = tb.get(clau)
        chemin = trouver(a.dossier, nom) if nom else None
        if not chemin:
            manque.append(clau)
            continue
        im = Image.open(chemin)
        exif = im.getexif()
        f35 = None
        try:
            f35 = exif.get_ifd(0x8769).get(0xA405)
        except Exception:
            pass
        f_capteur = None
        if not f35:
            # pas d'équivalent 24×36 : focale réelle et finesse du capteur (pixels par unité), quand l'appareil les donne
            try:
                sous = exif.get_ifd(0x8769)
                fl, res, unite = sous.get(0x920A), sous.get(0xA20E), sous.get(0xA210, 2)
                larg_capteur_px = sous.get(0xA002) or max(im.size)
                if fl and res:
                    mm = {2: 25.4, 3: 10.0, 4: 1.0}.get(int(unite), 25.4)
                    f_capteur = float(fl) * float(res) / mm / float(larg_capteur_px)   # en grands côtés d'image
            except Exception:
                pass
        im = ImageOps.exif_transpose(im)
        Wo, Ho = im.size
        if f35:
            f_orig = float(f35) / 43.27 * float(np.hypot(Wo, Ho))  # focale en pixels de l'original
        elif f_capteur and 0.3 < f_capteur < 6:
            f_orig = f_capteur * max(Wo, Ho)
        else:
            sans_focale.append(clau)
            continue
        x0, y0, x1, y1 = 0.0, 0.0, 1.0, 1.0
        if abs((l / h) / (Wo / Ho) - 1) > 0.012:
            en = Image.open(os.path.join(EN_LIGNE, f'{clau}-{ample}.webp'))
            s, x0, y0, x1, y1 = cadre_dans_original(im, en)
            recadrees.append((clau, round(s, 3), [round(v, 3) for v in (x0, y0, x1, y1)]))
        larg = (x1 - x0) * Wo                                        # largeur de l'original que montre la photo en ligne
        haut = (y1 - y0) * Ho
        sortie[clau] = [round(f_orig / larg, 4), round((0.5 - x0) / (x1 - x0), 4), round((0.5 - y0) / (y1 - y0), 4)]
    with open(SORTIE, 'w', encoding='utf-8', newline='\n') as fh:
        json.dump(sortie, fh, ensure_ascii=False, separators=(',', ':'), sort_keys=True)
        fh.write('\n')
    print(f'{len(sortie)} focales sur {len(ls)} photos -> {os.path.relpath(SORTIE, RACINE)}')
    if recadrees:
        print('recadrées (corrélation, cadre) :')
        for r in recadrees:
            print('  ', *r)
    if sans_focale:
        print('sans focale dans l\'original :', ', '.join(sans_focale))
    if manque:
        print('original introuvable :', ', '.join(manque))
    fs = sorted(v[0] for v in sortie.values())
    print('focale (largeurs d\'image) : min', fs[0], 'médiane', fs[len(fs) // 2], 'max', fs[-1])


if __name__ == '__main__':
    sys.exit(main())
