"""Dépliant de présentation de Lo Ligam, monté dans DesignCraft (2026-11-06).

A4 à l'italienne, pli roulé en trois volets :
  recto : rabat (97 mm) | dos (100 mm) | couverture (100 mm)
  verso : intérieur gauche « Se parla. » | milieu « S'apren. » | droite « Amassa. »

Ce script :
1. prépare les images : croix du logo (recette sombre de Crotz.svelte), pictogrammes
   des cases (repris de Pictograma.svelte), photos du site en JPEG sans métadonnées ;
2. écrit le script DesignCraft (nuancier, styles de paragraphe, calques, fonds, cases,
   textes, photos, code QR, repères de pli, notes de montage hors page) ;
3. lance designcraft-cli : fichier .designcraft modifiable, PDF (impression et écran),
   aperçus PNG des deux faces.

Les textes sont ceux du site (filet des éléments du 06-11), sauf ceux marqués
« À VALIDER » ci-dessous. Lancer :  py outils/depliant/depliant.py
Sorties : Documents/6_Projectes/Lo_Ligam_hors-git/diffusion/depliant/
"""
import json
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parents[2]
APP = REPO / 'app'
SORTIDA = Path.home() / 'Documents' / '6_Projectes' / 'Lo_Ligam_hors-git' / 'diffusion' / 'depliant'
IMG = SORTIDA / 'img'
CLI = Path('C:/Program Files/DesignCraft/designcraft-cli.exe')
NOM = 'depliant-lo-ligam'

MM = 72 / 25.4
W, H = 297 * MM, 210 * MM
FONS_PERDUT = 3 * MM      # fond perdu
MX, MY = 9 * MM, 10 * MM  # marges dans un volet (côtés, haut et bas)
GOUT = 4 * MM             # espace entre deux cases
RAYON = 4                 # coins arrondis des cases et des photos (pt)

# volets [x0, x1] : recto = rabat A | dos B | couverture C ; verso = C' | B' | A'
RECTO = {'A': (0, 97 * MM), 'B': (97 * MM, 197 * MM), 'C': (197 * MM, W)}
VERSO = {'C': (0, 100 * MM), 'B': (100 * MM, 200 * MM), 'A': (200 * MM, W)}

# --- couleurs du site (app/src/app.css, thèmes Éclat et Plâtre ; cases : teulas.js) ---
NUANCES = {
    'Nuit': '#22100a', 'Crème': '#fbf1e1', 'Crème douce': '#cbbfb2', 'Or vif': '#f6b73c',
    'Plâtre': '#f7f3ee', 'Encre': '#2a1a10', 'Encre douce': '#63574e', 'Ocre': '#9c5611',
    'Brique': '#b53d17', 'Pétrole': '#1f5f63', 'Olive': '#55702f', 'Bleu': '#2f6a9c',
    'Or': '#eeaf34', 'Prune': '#6b3a5b',
}
# palette « charta » des cases, dans l'ordre du site (i % 6)
PALETA = [('Brique', 'Crème'), ('Pétrole', 'Crème'), ('Olive', 'Crème'),
          ('Bleu', 'Crème'), ('Or', 'Encre'), ('Prune', 'Crème')]


def lim(size, leading, **kw):
    return {'fontFamily': 'Limelight', 'fontStyle': 'Regular', 'size': size,
            'leading': {'kind': 'points', 'value': leading}, **kw}


def luc(size, leading, gras=False, **kw):
    return {'fontFamily': 'Luciole', 'fontStyle': 'Bold' if gras else 'Regular', 'size': size,
            'leading': {'kind': 'points', 'value': leading}, **kw}


CAPS = {'capitalization': 'allCaps'}
STYLES = {
    'Case numéro': ({'spaceAfter': 3}, lim(20, 20, fill='Crème')),
    # petites cases : nom en Luciole gras (Limelight réservé aux gros titres, Romain 02-11 ; vu par Joan)
    'Case nom': ({'spaceAfter': 4}, luc(8.6, 10.5, gras=True, tracking=40, fill='Crème', **CAPS)),
    'Case texte': ({}, luc(7.6, 10.4, fill='Crème')),
    'Grande case numéro': ({'spaceAfter': 4}, lim(30, 30, fill='Crème')),
    'Grande case nom': ({'spaceAfter': 5}, lim(15, 17, tracking=20, fill='Crème', **CAPS)),
    'Grande case texte': ({}, luc(9, 12.5, fill='Crème')),
    'Très grande case numéro': ({'spaceAfter': 4}, lim(40, 40, fill='Crème')),
    'Très grande case nom': ({'spaceAfter': 6}, lim(26, 28, tracking=20, fill='Crème', **CAPS)),
    'Très grande case texte': ({}, luc(11, 15, fill='Crème')),
    'Titre de volet': ({'spaceAfter': 5}, lim(30, 33, fill='Encre')),
    'Phrase de volet': ({}, luc(9.5, 13, fill='Encre douce')),
    'Titre de section': ({'spaceAfter': 8}, lim(19, 22, fill='Encre')),
    'Titre secondaire': ({'spaceAfter': 7}, lim(15, 18, fill='Encre')),
    'Liste': ({}, luc(8.6, 11.5, fill='Encre')),
    'Manifeste oc': ({'spaceAfter': 6}, luc(10.5, 14.5, fill='Encre')),
    'Manifeste fr': ({}, luc(9, 12.5, fill='Encre douce')),
    'Texte courant': ({'spaceAfter': 6}, luc(9, 12.6, fill='Encre')),
    'Intertitre': ({'spaceAfter': 3}, luc(9, 12, gras=True, fill='Encre')),
    'Légende photo': ({}, luc(8.6, 12, fill='Encre douce')),
    'Chiffre': ({'spaceAfter': 1}, lim(28, 30, fill='Brique')),
    'Légende de chiffre': ({'spaceAfter': 1}, luc(8.6, 11, gras=True, fill='Encre')),
    'Source de chiffre': ({'spaceAfter': 18}, luc(7.6, 10, fill='Encre douce')),
    'Adresse du site': ({'spaceAfter': 4}, luc(15, 18, gras=True, fill='Brique')),
    'Note': ({}, luc(7.6, 10, fill='Encre douce')),
    'Couverture titre': ({'align': 'center'}, lim(46, 50, fill='Crème')),
    'Couverture surtitre': ({'align': 'center', 'spaceAfter': 7},
                            luc(8.5, 11, gras=True, tracking=150, fill='Or vif', **CAPS)),
    'Couverture trois mots': ({'align': 'center'}, lim(21, 25, fill='Crème')),
    'Couverture accueil oc': ({'align': 'center', 'spaceAfter': 6}, luc(9.5, 13.5, fill='Crème')),
    'Couverture accueil fr': ({'align': 'center'}, luc(9, 12.5, fill='Crème douce')),
    'Couverture adresse': ({'align': 'center'}, luc(14, 17, gras=True, fill='Or vif')),
    'Note de montage': ({}, luc(9, 11.5, fill='Bleu')),
}
GRAS_OCRE = {'fontStyle': 'Bold', 'fill': 'Ocre'}
GRAS = {'fontStyle': 'Bold'}

# --- textes -----------------------------------------------------------------------------
# Repris du site (elements-filet.json, 06-11) sauf mention « À VALIDER ».
VOLETS_INTERIEURS = [
    ('C', 'Se parla.', 'Découvre la géographie occitane et les productions en lenga nòstra.', [
        # (n° de couleur sur le site, nom oc, texte fr, pictogramme)
        (0, 'La carta', 'L’aire culturelle occitane, ses langues et ses lieux.', 'carta'),
        (1, 'Cultura', 'La langue, le pays, ses poètes et ses chansons, en fiches courtes.', 'cultura'),
        (2, 'Òbras', 'Ce que j’écoute, ce que je lis, ce que je te fais découvrir.', 'obras'),
        (4, 'Mèdias', 'Les radios, les télévisions et la presse.', 'medias'),
    ]),
    ('B', 'S’apren.', 'Découvre, apprends et pratique la langue à ta manière.', [
        (0, 'Corses en visio', 'En tête-à-tête. Le premier est offert.', 'visio'),
        (1, 'Lo parcors', 'De zéro jusqu’au niveau B1, leçon par leçon.', 'parcors'),
        (2, 'Anem ! Per los pichons', 'De 3 à 6 ans : on touche une bête, on entend son nom.', 'anem'),
        # À VALIDER : le site dit « Deux jeux… : le serpent des lettres et les paniers »
        (3, 'Jòcs', 'Des jeux pour jouer avec les mots.', 'jocs'),
        (5, 'Remira', 'Les mots se dessinent en poussière d’or, un par un, pour les apprendre au calme.', 'remira'),
        (0, 'Gramatica', 'Les règles de la langue, notion par notion.', 'wiki'),
    ]),
    ('A', 'Amassa.', 'Crée du lien avec le monde occitan.', [
        # À VALIDER : « Bientôt. » ajouté (les groupes ne sont pas encore ouverts)
        (0, 'Grops', 'Rencontrer d’autres personnes qui parlent occitan, près de chez toi ou en ligne. Bientôt.', 'grops'),
        (1, 'Cercles e associacions', 'Les associations occitanes, sur la carte.', 'carta'),
        (3, 'Boita d’idèas', 'Pour améliorer Lo Ligam avec toi.', 'ideas'),
        (4, 'Instagram', 'Les visuels de Lo Ligam.', 'imatges'),
    ]),
]
MANIFESTE_OC = [('Aicí, l’occitan s’apren mai que mai en creant ', None), ('ligam,', GRAS_OCRE),
                (' ', None), ('sens vergonha', GRAS_OCRE), (' e ', None), ('amb benvolença.', GRAS_OCRE)]
MANIFESTE_FR = [('Ici, l’occitan s’apprend avant tout en créant du ', None), ('lien,', GRAS_OCRE),
                (' ', None), ('sans honte', GRAS_OCRE), (' et ', None), ('avec bienveillance.', GRAS_OCRE)]
CHIFFRES = [  # site : acuelh.chifras
    ('≈ 600 000', 'locuteurs en Nouvelle-Aquitaine / Occitanie',
     'Estimation, enquête sociolinguistique OPLO, 2020'),
    ('32', 'départements', 'plus le Val d’Aran et les vallées occitanes d’Italie'),
    ('10', 'siècles de littérature', 'depuis les premiers troubadours'),
]
# À VALIDER : textes de diffusion/fiche.md (06-11), pas encore sur le site
COMMENT = [
    ('Un site gratuit,', ' en occitan languedocien et en graphie classique, qui se lit en six langues.'),
    ('Une langue vérifiée.', ' Chaque mot occitan est vérifié dans les ressources de lo Congrès et la '
                             '« Gramatica de l’occitan estandard », puis relu par Romain.'),
    ('Sobre.', ' Hébergé en Europe, sans publicité ni pistage, avec des pages légères.'),
    # « aucune image n’est générée » retiré le 06-11 (Joan) : pictogrammes et dessins du site sont tracés
    # en code ; à Romain de dire s'il veut le préciser
    ('L’intelligence artificielle comme outil.', ' Les photos sont celles de Romain. Le code et le premier '
     'jet des leçons ont été faits avec des assistants d’intelligence artificielle, sous sa direction.'),
]
PORTRAIT = ('Romain Perier', 'Urbaniste et locuteur d’occitan. Il a conçu le site et donne les cours en visio.')
FRANCITAN = [  # site : acuelh.bandel.francitan
    ('lo pichon', 'le petit (pitchoun)'), ('pecaire', 'hélas ! (peuchère)'), ('degun', 'personne (dégun)'),
    ('escagassar', 'esquinter (escagasser)'), ('la fogassa', 'la fougasse'), ('la cigala', 'la cigale'),
]


def typo(s):
    """Apostrophe typographique, espace insécable devant ? ! : ; et dans les nombres."""
    s = s.replace("'", '’')
    # la marque et deux fins de ligne qui laissaient un mot seul
    for groupe in ('Lo Ligam', 'à ta manière', 'le francitan'):
        s = s.replace(groupe, groupe.replace(' ', chr(0xA0)))
    s = s.replace(' »', chr(0xA0) + '»')
    s = re.sub(r' ([?!:;»])', '\u00a0\\1', s)
    s = re.sub(r'(?<=\d) (?=\d{3}\b)', '\u00a0', s)
    return s.replace('« ', '«\u00a0').replace('≈ ', '≈\u00a0')


# --- images ---------------------------------------------------------------------------
RAIS = ('M0 0L0.486 -0.797M0 0L0.809 -0.48M0 0L0.809 0.48M0 0L0.486 0.797M0 0L-0.468 0.797'
        'M0 0L-0.786 0.48M0 0L-0.786 -0.48M0 0L-0.468 -0.797')
ARCS = ('M-0.468 -0.797Q-0.194 -0.746 0 -1M0 -1Q0.202 -0.746 0.486 -0.797M0.809 -0.48Q0.751 -0.199 1 0'
        'M1 0Q0.751 0.199 0.809 0.48M0.486 0.797Q0.202 0.742 0 0.992M0 0.992Q-0.194 0.742 -0.468 0.797'
        'M-0.786 0.48Q-0.731 0.203 -0.976 0.009M-0.976 0.009Q-0.731 -0.195 -0.786 -0.48')
PONCHS = [(0, -1), (0.486, -0.797), (0.809, -0.48), (1, 0), (0.809, 0.48), (0.486, 0.797), (0, 0.992),
          (-0.468, 0.797), (-0.786, 0.48), (-0.976, 0.009), (-0.786, -0.48), (-0.468, -0.797)]


def crotz(fichier, trac, ponch, moieu):
    """La croix du logo, d'après Crotz.svelte (recettes de Romain : jetons --logo-*)."""
    cercles = ''.join(f'<circle cx="{x}" cy="{y}" r="0.109" fill="{ponch}"/>' for x, y in PONCHS)
    fichier.write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.25 -1.25 2.5 2.5" width="250" height="250">'
        f'<g fill="none" stroke-linecap="round" stroke="{trac}">'
        f'<path d="{RAIS}" stroke-width="0.063"/><path d="{ARCS}" stroke-width="0.07"/></g>'
        f'<circle cx="0" cy="0" r="0.124" fill="{moieu}"/>{cercles}</svg>', encoding='utf-8')
    return fichier


def pictogrammes(noms):
    """Extrait les pictogrammes au trait du site, en crème et en encre."""
    src = (APP / 'src/lib/apren/Pictograma.svelte').read_text(encoding='utf-8')
    for n in noms:
        m = re.search(r"\{(?:#if|:else if) nom === '%s'\}(.*?)(?=\{:else|\{/if\})" % n, src, re.S)
        if not m:
            sys.exit(f'Pictogramme introuvable dans Pictograma.svelte : {n}')
        corps = re.sub(r'<!--.*?-->', '', m.group(1), flags=re.S).strip()
        if '{' in corps:
            sys.exit(f'Pictogramme {n} : syntaxe Svelte à traduire à la main')
        for teinte, hexa in (('creme', NUANCES['Crème']), ('encre', NUANCES['Encre'])):
            (IMG / f'picto-{n}-{teinte}.svg').write_text(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" '
                f'fill="none" stroke="{hexa}" stroke-width="2.2" stroke-linecap="round" '
                f'stroke-linejoin="round">{corps.replace("currentColor", hexa)}</svg>', encoding='utf-8')


def photo(source, nom):
    """Photo du site en JPEG, sans métadonnées (ni GPS ni appareil)."""
    im = Image.open(source).convert('RGB')
    cible = IMG / nom
    im.save(cible, 'JPEG', quality=90)
    return cible


# --- script DesignCraft ---------------------------------------------------------------
class Script:
    def __init__(self):
        self.lignes = []

    def __call__(self, commande, args=None):
        self.lignes.append(commande if args is None else commande + ' ' + json.dumps(args, ensure_ascii=False))
        return len(self.lignes) - 1


S = Script()


def ref(i, cle='id'):
    return f'${i}.{cle}'


def octets(s):
    return len(s.encode('utf-8'))


def chemin(p):
    return str(p).replace('\\', '/')


def r2(rect):
    return [round(v, 2) for v in rect]


def texte(spread, rect, paras, nom, inset=None, vjust=None):
    """Un bloc de texte : paras = [(style, 'texte' | [(morceau, attributs ou None), …])]."""
    pieces = []
    for style, contenu in paras:
        runs = [(contenu, None)] if isinstance(contenu, str) else contenu
        pieces.append((style, [(typo(t), a) for t, a in runs]))
    brut = '\n'.join(''.join(t for t, _ in runs) for _, runs in pieces)
    i = S('frame.create', {'spread': spread, 'rect': r2(rect), 'content': 'text', 'text': brut})
    histoire = ref(i, 'story')
    pos = 0
    for style, runs in pieces:
        long = sum(octets(t) for t, _ in runs)
        S('text.select', {'story': histoire, 'anchor': pos, 'focus': pos + long})
        S('style.paragraph.apply', {'name': style})
        p = pos
        for t, a in runs:
            if a:
                S('text.select', {'story': histoire, 'anchor': p, 'focus': p + octets(t)})
                S('type.char', {'attrs': a})
            p += octets(t)
        pos += long + 1
    options = {}
    if inset is not None:
        options['inset'] = [inset] * 4
    if vjust:
        options['verticalJustification'] = vjust
    if options:
        S('object.textFrameOptions', {**options, 'ids': [ref(i)]})
    S('object.rename', {'id': ref(i), 'name': nom})
    return i, octets(brut)


def filet(spread, x0, x1, y, nuance='Ocre', epaisseur=0.6, nom='Filet'):
    i = S('line.create', {'spread': spread, 'a': [round(x0, 2), round(y, 2)], 'b': [round(x1, 2), round(y, 2)]})
    S('object.stroke', {'swatch': nuance, 'weight': epaisseur, 'ids': [ref(i)]})
    S('object.rename', {'id': ref(i), 'name': nom})


def image(spread, rect, fichier, nom, rayon=RAYON):
    c = S('frame.create', {'spread': spread, 'rect': r2(rect), 'content': 'graphic'})
    if rayon:
        S('object.cornerOptions', {'shape': 'rounded', 'size': rayon, 'ids': [ref(c)]})
    S('file.place', {'path': chemin(fichier), 'frame': ref(c)})
    S('object.fit', {'mode': 'fillProportionally', 'ids': [ref(c)]})
    S('object.rename', {'id': ref(c), 'name': nom})


def fond(spread, rect, nuance, nom):
    i = S('frame.create', {'spread': spread, 'rect': r2(rect), 'content': 'unassigned'})
    S('object.fill', {'swatch': nuance, 'ids': [ref(i)]})
    S('object.rename', {'id': ref(i), 'name': nom})


def case(spread, rect, couleur, num, nom, sota, picto, granda=False):
    """Une case de couleur du site : numéro, nom, texte, pictogramme en bas à droite."""
    fons, tinta = PALETA[couleur]
    granda = int(granda)  # 0 petite, 1 grande (une rangée), 2 très grande (carrée, comme sur le site)
    prefixe = ('Case', 'Grande case', 'Très grande case')[granda]
    st = tuple(f'{prefixe} {x}' for x in ('numéro', 'nom', 'texte'))
    pad = (9, 13, 16)[granda]
    x0, y0, x1, y1 = rect
    debut, fin = sota.rsplit(' ', 1)  # jamais un mot seul sur la dernière ligne
    sota = debut + chr(0xA0) + fin
    i, total = texte(spread, rect, [(st[0], num), (st[1], nom), (st[2], sota)], f'Case {num} {nom}', inset=pad)
    S('object.fill', {'swatch': fons, 'ids': [ref(i)]})
    S('object.cornerOptions', {'shape': 'rounded', 'size': RAYON, 'ids': [ref(i)]})
    if tinta != 'Crème':
        S('text.select', {'story': ref(i, 'story'), 'anchor': 0, 'focus': total})
        S('type.char', {'attrs': {'fill': tinta}})
    taille = (22, 44, 72)[granda]
    teinte = 'creme' if tinta == 'Crème' else 'encre'
    p = S('file.place', {'path': chemin(IMG / f'picto-{picto}-{teinte}.svg'), 'spread': spread,
                         'x': round(x1 - pad - taille, 2), 'y': round(y1 - pad - taille, 2), 'width': taille})
    S('object.textWrap', {'mode': 'boundingBox', 'offset': 3, 'ids': [ref(p)]})
    S('object.rename', {'id': ref(p), 'name': f'Pictogramme {nom}'})


def construire(base=NOM):
    IMG.mkdir(parents=True, exist_ok=True)
    croix = crotz(IMG / 'crotz-sombre.svg', '#ffffff', '#ffd47f', '#eeaf34')
    pictogrammes(sorted({t[3] for _, _, _, cases in VOLETS_INTERIEURS for t in cases}))
    vilatge = photo(APP / 'static/apren/paisatges/vilatge-1920.webp', 'vilatge.jpg')
    retrat = photo(APP / 'static/acuelh/romain.webp', 'romain.jpg')

    S('file.new', {'width': round(W, 2), 'height': round(H, 2), 'units': 'points', 'pages': 2,
                   'facingPages': False, 'margins': 0, 'bleed': round(FONS_PERDUT, 3),
                   'title': 'Lo Ligam, dépliant'})
    for nom, hexa in NUANCES.items():
        S('swatch.create', {'name': nom, 'color': hexa})
    for nom, (para, chars) in STYLES.items():
        S('style.paragraph.create', {'name': nom, 'para': {**para, 'hyphenate': False}, 'chars': chars})

    # calque 1 : les fonds (verrouillé à la fin)
    S('layer.set', {'id': 1, 'name': 'Fonds'})
    fp = FONS_PERDUT
    # un seul aplat clair sous tout le recto (pas de joint visible au pli), la nuit par-dessus
    fond(0, (-fp, -fp, W + fp, H + fp), 'Plâtre', 'Fond du rabat et du dos')
    fond(0, (RECTO['C'][0], -fp, W + fp, H + fp), 'Brique', 'Fond de la couverture')
    fond(1, (-fp, -fp, W + fp, H + fp), 'Plâtre', 'Fond de l’intérieur')

    calque_textes = S('layer.new', {'name': 'Cases et textes'})
    S('layer.activate', {'id': ref(calque_textes)})

    # ---------------- verso : les trois rubriques ----------------
    haut_cases = MY + 78
    for lettre, titre, phrase, cases in VOLETS_INTERIEURS:
        v0, v1 = VERSO[lettre]
        x0, x1 = v0 + MX, v1 - MX
        texte(1, (x0, MY, x1, haut_cases - 8), [('Titre de volet', titre), ('Phrase de volet', phrase)],
              f'Titre {titre}')
        petite = (x1 - x0 - GOUT) / 2
        rang = 110.56  # hauteur d'une rangée de petites cases, la même dans les trois volets
        y_r = [haut_cases, haut_cases + 130 + GOUT]  # rangée 1 (grande case), rangée 2
        y_r += [y_r[1] + rang + GOUT, y_r[1] + 2 * (rang + GOUT)]
        bas = H - MY
        g = x0 + petite + GOUT  # colonne de droite
        n = [f'{k:02d}' for k in range(1, len(cases) + 1)]
        if lettre == 'C':
            case(1, (x0, y_r[0], x1, y_r[1] + rang), *cases[0][:1], n[0], *cases[0][1:], granda=2)
            case(1, (x0, y_r[2], x0 + petite, y_r[2] + rang), cases[1][0], n[1], *cases[1][1:])
            case(1, (g, y_r[2], x1, y_r[2] + rang), cases[2][0], n[2], *cases[2][1:])
            case(1, (x0, y_r[3], x1, bas), cases[3][0], n[3], *cases[3][1:])
        elif lettre == 'B':
            case(1, (x0, y_r[0], x1, y_r[0] + 130), cases[0][0], n[0], *cases[0][1:], granda=True)
            for k, (y, col) in enumerate([(y_r[1], 0), (y_r[1], 1), (y_r[2], 0), (y_r[2], 1)], start=1):
                cx0 = x0 if col == 0 else g
                case(1, (cx0, y, cx0 + petite, y + rang), cases[k][0], n[k], *cases[k][1:])
            case(1, (x0, y_r[3], x1, bas), cases[5][0], n[5], *cases[5][1:])
        else:
            case(1, (x0, y_r[0], x1, y_r[0] + 130), cases[0][0], n[0], *cases[0][1:], granda=True)
            case(1, (x0, y_r[1], x0 + petite, y_r[1] + rang), cases[1][0], n[1], *cases[1][1:])
            case(1, (g, y_r[1], x1, y_r[1] + rang), cases[2][0], n[2], *cases[2][1:])
            haut_bandeau = bas - y_r[3]
            case(1, (x0, y_r[2], x1, y_r[2] + haut_bandeau), cases[3][0], n[3], *cases[3][1:])
            y_f = y_r[2] + haut_bandeau + 14
            filet(1, x0, x1, y_f, nom='Filet du francitan')
            # une paire par ligne, la traduction calée sur une tabulation (vu par Joan)
            titre_f = 'Des mots d’oc que tu connais déjà : le francitan'
            liste = [('Liste', [(oc, GRAS_OCRE), ('\t' + fr, None)]) for oc, fr in FRANCITAN]
            i, total = texte(1, (x0, y_f + 9, x1, bas), [('Intertitre', titre_f)] + liste, 'Le francitan')
            S('text.select', {'story': ref(i, 'story'), 'anchor': octets(typo(titre_f)) + 1, 'focus': total})
            S('type.tabs.add', {'position': 64})

    # ---------------- recto : couverture ----------------
    c0, c1 = RECTO['C']
    cx = (c0 + c1) / 2
    texte(0, (c0 + MX, 190, c1 - MX, 246), [('Couverture titre', 'Lo Ligam')], 'Couverture : Lo Ligam')
    filet(0, cx - 18, cx + 18, 262, nuance='Or vif', epaisseur=0.75, nom='Filet de la couverture')
    texte(0, (c0 + MX, 276, c1 - MX, 380),
          [('Couverture surtitre', 'L’occitan'), ('Couverture trois mots', 'Se parla.'),
           ('Couverture trois mots', 'S’apren.'), ('Couverture trois mots', 'Amassa.')],
          'Couverture : les trois mots')
    texte(0, (c0 + 14 * MM, 400, c1 - 14 * MM, 492),
          [('Couverture accueil oc', 'Benvenguda dins ton ligam amb lo mond occitan. D’ont que siás, aicí siès en çò tieu.'),
           ('Couverture accueil fr', 'Bienvenue dans ton lien avec le monde occitan. D’où que tu sois, tu es ici chez toi.')],
          'Couverture : accueil')
    texte(0, (c0 + MX, 522, c1 - MX, 546), [('Couverture adresse', 'loligam.eu')], 'Couverture : adresse')

    # ---------------- recto : rabat (Qu'es aquò ?) ----------------
    a0, a1 = RECTO['A'][0] + MX, RECTO['A'][1] - MX
    texte(0, (a0, MY, a1, 176),
          [('Titre de section', 'Qu’es aquò, Lo Ligam ?'), ('Manifeste oc', MANIFESTE_OC),
           ('Manifeste fr', MANIFESTE_FR)], 'Rabat : manifeste')
    texte(0, (a0 + 88 + 12, 190, a1, 300),
          [('Intertitre', PORTRAIT[0]), ('Légende photo', PORTRAIT[1])], 'Rabat : légende du portrait')
    filet(0, a0, a1, 318, nuance='Brique', nom='Filet des chiffres')
    paras = []
    for num, nom, source in CHIFFRES:
        # Limelight n'a pas le signe ≈ : il passe en Luciole
        runs = [('≈', {'fontFamily': 'Luciole', 'fontStyle': 'Regular', 'size': 20}), (' ' + num[2:], None)] \
            if num.startswith('≈') else num
        paras += [('Chiffre', runs), ('Légende de chiffre', nom), ('Source de chiffre', source)]
    texte(0, (a0, 332, a1, H - MY), paras, 'Rabat : chiffres')

    # ---------------- recto : dos (comment c'est fait, contact) ----------------
    b0, b1 = RECTO['B'][0] + MX, RECTO['B'][1] - MX
    haut_photo = (b1 - b0) * 0.75  # la photo entière, en 4:3
    texte(0, (b0, MY + haut_photo + 18, b1, 452),
          [('Titre secondaire', 'Comment c’est fait')] + [('Texte courant', [(a, GRAS), (b, None)]) for a, b in COMMENT],
          'Dos : comment c’est fait')
    filet(0, b0, b1, 466, nom='Filet du contact')
    texte(0, (b0 + 72 + 14, 482, b1, H - MY),
          [('Adresse du site', 'loligam.eu'), ('Texte courant', 'Instagram : @lo_ligam'),
           ('Note', 'Scanne le code pour ouvrir le site.')], 'Dos : contact')

    # calque 3 : photos, logo, code QR
    calque_images = S('layer.new', {'name': 'Photos, logo et code QR'})
    S('layer.activate', {'id': ref(calque_images)})
    i = S('file.place', {'path': chemin(croix), 'spread': 0, 'x': round(cx - 58, 2), 'y': 60, 'width': 116})
    S('object.rename', {'id': ref(i), 'name': 'Logo : la croix (recette sombre)'})
    image(0, (a0, 190, a0 + 88, 300), retrat, 'Portrait de Romain')
    image(0, (b0, MY, b1, MY + haut_photo), vilatge, 'Photo : lo vilatge')
    q = S('object.qrCode', {'content': 'https://loligam.eu', 'rect': r2((b0, 482, b0 + 72, 554)),
                            'color': 'Encre', 'spread': 0})
    S('object.rename', {'id': ref(q), 'name': 'Code QR vers loligam.eu'})

    # calque 4 : notes de montage, hors page et non imprimées
    calque_notes = S('layer.new', {'name': 'Notes de montage (non imprimées)'})
    S('layer.activate', {'id': ref(calque_notes)})
    notes = [
        (0, RECTO['A'], 'RABAT, 97 mm. Se replie à l’intérieur ; se lit en ouvrant la couverture.'),
        (0, RECTO['B'], 'DOS, 100 mm. Le dos du dépliant fermé.'),
        (0, RECTO['C'], 'COUVERTURE, 100 mm.'),
        (1, VERSO['C'], 'INTÉRIEUR GAUCHE, 100 mm (derrière la couverture).'),
        (1, VERSO['B'], 'INTÉRIEUR MILIEU, 100 mm.'),
        (1, VERSO['A'], 'INTÉRIEUR DROIT, 97 mm (derrière le rabat).'),
    ]
    for spread, (v0, v1), note in notes:
        texte(spread, (v0 + 4, -62, v1 - 4, -18), [('Note de montage', note)], 'Note de montage')
    S('layer.set', {'id': ref(calque_notes), 'printable': False})

    # repères de pli
    for spread, volets in ((0, RECTO), (1, VERSO)):
        for v0, _ in sorted(volets.values())[1:]:
            S('guide.add', {'orientation': 'vertical', 'position': round(v0, 2), 'spread': spread})

    S('layer.set', {'id': 1, 'locked': True})
    S('layer.activate', {'id': ref(calque_textes)})
    inspection = S('document.inspect')
    SORTIDA.mkdir(parents=True, exist_ok=True)
    S('file.exportPdf', {'path': chemin(SORTIDA / f'{base}-impression.pdf'), 'bleed': True,
                         'marks': {'crop': True}, 'title': 'Lo Ligam, dépliant'})
    S('file.exportPdf', {'path': chemin(SORTIDA / f'{base}-ecran.pdf'), 'title': 'Lo Ligam, dépliant'})
    return inspection


def lancer():
    dcs = SORTIDA / f'{NOM}.dcs'
    doc = SORTIDA / f'{NOM}.designcraft'
    base = NOM
    # Ne jamais écraser un dépliant retouché à la main dans DesignCraft : s'il a été
    # enregistré après la dernière génération, le nouveau (et ses PDF) part sous un autre nom.
    if doc.exists() and dcs.exists() and doc.stat().st_mtime > dcs.stat().st_mtime + 120:
        from datetime import datetime
        base = f'{NOM}-{datetime.now():%Y-%m-%d-%Hh%M}'
        doc = SORTIDA / f'{base}.designcraft'
        print(f'Le dépliant a été retouché à la main : il est gardé, le nouveau va dans {doc.name}')
    inspection = construire(base)
    dcs.write_text('\n'.join(S.lignes) + '\n', encoding='utf-8')
    r = subprocess.run([str(CLI), 'script', str(dcs), '--save', str(doc)],
                       capture_output=True, text=True, encoding='utf-8')
    try:
        sortie = json.loads(r.stdout)
    except json.JSONDecodeError:
        sys.exit(f'DesignCraft : sortie illisible\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}')
    if r.returncode != 0 or sortie.get('error'):
        k = sortie.get('failedIndex')
        sys.exit(f"Erreur à l'étape {k} : {sortie.get('error')}\n{S.lignes[k] if k is not None else ''}")
    insp = sortie['results'][inspection]
    deborde = [s.get('preview', '')[:50] for s in insp.get('stories', []) if s.get('overset')]
    print('Textes qui débordent :', deborde or 'aucun')
    for res in sortie['results'][inspection + 1:]:
        if res and res.get('warnings'):
            print('Avertissements PDF :', res['warnings'])
    r = subprocess.run([str(CLI), 'run', '--in', str(doc), '--scale', '2',
                        '--page', '0', '--export', str(SORTIDA / f'apercu-exterieur{base[len(NOM):]}.png'),
                        '--page', '1', '--export', str(SORTIDA / f'apercu-interieur{base[len(NOM):]}.png')],
                       capture_output=True, text=True, encoding='utf-8')
    print(r.stdout.strip()[-600:], r.stderr.strip()[-600:])


if __name__ == '__main__':
    lancer()
