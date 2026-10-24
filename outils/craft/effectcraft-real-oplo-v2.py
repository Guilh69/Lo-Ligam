# Réel OPLO 2020, version 2 (Romain, 2026-10-24, après la v1 jugée « grossière ») :
# mise en page de ses posts récents (Article définit, Eclipsi, Dets, Drech,
# Officialitat) avec la charte du projet, fond pétrole (choix A), construite
# étape par étape, chaque étape validée par Romain avant la suivante.
# Mouvement : pas de rebond ; départ franc, longue décélération ; les lettres
# montent de quelques pixels en passant du flou au net.
# Maquette fixe : design-stock/publicacions/2026-10-oplo/real-dobertura.html.
# py effectcraft-real-oplo-v2.py <étape> > lot.tsv   puis   bash effectcraft-lancer.sh lot.tsv
import json, math, sys
import os as _os
RAIZ = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..'))
sys.stdout.reconfigure(encoding="utf-8")

C = "OPLO 2020 real v2"
DOS = RAIZ + "/design-stock/publicacions/2026-10-oplo/"
PETROLE, BRIQUE, CREME, BLANC = "#1F5F63", "#B53D17", "#F5EAD8", "#FFFFFF"
FIN = 4.0  # s'allonge à chaque étape validée
DY = 460   # la silhouette du domaine (repère 4:5) descend de 460 px

with open(DOS + "carta-donadas.js", encoding="utf-8") as f:
    CARTA = json.loads(f.read().split("=", 1)[1].strip().rstrip(";"))


def anels(d, dy=DY):
    """Les anneaux d'un chemin « M x yL x y…Z », décalés dans le 9:16."""
    out = []
    for r in d.split("M")[1:]:
        pts = [tuple(map(float, p.split())) for p in r.replace("Z", "").split("L")]
        out.append([(x, y + dy) for x, y in pts])
    return out


def simplificar(pts, tol=0.8):
    """Douglas-Peucker : moins de sommets, même silhouette au pixel près."""
    if len(pts) < 4:
        return pts
    def dist(p, a, b):
        (x, y), (x1, y1), (x2, y2) = p, a, b
        dx, dy = x2 - x1, y2 - y1
        if dx == dy == 0:
            return math.hypot(x - x1, y - y1)
        return abs(dy * x - dx * y + x2 * y1 - y2 * x1) / math.hypot(dx, dy)
    garda = [False] * len(pts)
    garda[0] = garda[-1] = True
    pila = [(0, len(pts) - 1)]
    while pila:
        i, j = pila.pop()
        k, dm = None, tol
        for m in range(i + 1, j):
            dd = dist(pts[m], pts[i], pts[j])
            if dd > dm:
                k, dm = m, dd
        if k is not None:
            garda[k] = True
            pila += [(i, k), (k, j)]
    return [p for p, g in zip(pts, garda) if g]


def cmd(i, **p):
    print(i + "\t" + json.dumps(p, ensure_ascii=False))


def duree(nom, t0, t1):
    cmd("layer.timing", layers=[nom], **{"in": t0, "out": t1})


def cle(nom, chemin, t, v):
    cmd("prop.addKey", layer=nom, path=chemin, time=round(t, 3), timeBase="comp", value=v)


def doux(nom, chemin, t0, t1, v0, v1, sortie=30, arrivee=85):
    """Deux clés : départ franc, longue décélération, sans rebond."""
    cle(nom, chemin, t0, v0)
    cle(nom, chemin, t1, v1)
    cmd("keys.setEase", layer=nom, path=chemin, time=round(t0, 3), side="out", speed=0, influence=sortie)
    cmd("keys.setEase", layer=nom, path=chemin, time=round(t1, 3), side="in", speed=0, influence=arrivee)


def ancrar(nom, x, y):
    """Ancre au point (x, y) de la compo, sans bouger le calque de forme."""
    cmd("prop.set", layer=nom, path="transform/anchor", value=[x - 540, y - 960])
    cmd("prop.set", layer=nom, path="transform/position", value=[x, y])


def apareisser(nom, t, dur=0.6, echelle=None, montee=None, pos=None):
    """Arrivée douce : fondu, et au choix une petite mise à l'échelle ou une montée."""
    doux(nom, "transform/opacity", t, t + dur * 0.7, 0, 100)
    if echelle:
        doux(nom, "transform/scale", t, t + dur, [echelle[0]] * 2 + [100], [echelle[1]] * 2 + [100])
    if montee:
        doux(nom, "transform/position", t, t + dur, [pos[0], pos[1] + montee], pos)


def lettres(nom, t0, t1, montee=40, flou=8):
    """Les lettres montent une à une de quelques pixels et passent du flou au net."""
    A = "text/animators/animator/"
    cmd("layer.addTextAnimator", layer=nom, properties=["position", "opacity", "blur"])
    cmd("prop.set", layer=nom, path=A + "properties/position", value=[0, montee])
    cmd("prop.set", layer=nom, path=A + "properties/opacity", value=0)
    cmd("prop.set", layer=nom, path=A + "properties/blur", value=[0, flou])
    cmd("prop.set", layer=nom, path=A + "selectors/rangeSelector/advanced/shape", value=1)
    cmd("prop.set", layer=nom, path=A + "selectors/rangeSelector/advanced/easeLow", value=100)
    doux(nom, A + "selectors/rangeSelector/offset", t0, t1, -100, 100, 20, 60)


IMPORTATS = set()


def importar(fichier, nom, t, pos, echelle):
    if fichier not in IMPORTATS:  # un seul élément de projet par fichier
        cmd("file.import", paths=[DOS + fichier])
        IMPORTATS.add(fichier)
    cmd("layer.addItem", item=fichier, time=t, position=pos)
    cmd("layer.rename", name=nom)
    cmd("prop.set", layer=nom, path="transform/scale", value=[echelle, echelle, 100])


etape = sys.argv[1]

if etape == "1":  # ouverture : silhouette, étiquette, titre, écussons, traduction, logo, crédit
    cmd("comp.new", name=C, width=1080, height=1920, frameRate=30, duration=FIN, background=PETROLE)
    cmd("layer.newSolid", name="Fons", color=PETROLE)
    duree("Fons", 0, FIN)

    # le domaine en silhouette calme ; la carte arrivera dessus
    cmd("layer.newShape", kind="none", name="Domeni")
    xs, ys = [], []
    for r in anels(CARTA["domeni"]):
        v = [[round(x, 1), round(y, 1)] for x, y in simplificar(r)]
        if len(v) >= 3:
            cmd("shape.newPath", layer="Domeni", vertices=v, closed=True, space="comp", fill=BLANC, stroke=False)
            xs += [p[0] for p in v]
            ys += [p[1] for p in v]
    ancrar("Domeni", (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2)
    duree("Domeni", 0, FIN)
    doux("Domeni", "transform/opacity", 0.0, 1.4, 0, 16)
    doux("Domeni", "transform/scale", 0.0, 1.6, [96, 96, 100], [100, 100, 100], 10, 90)

    # l'étiquette brique, qui s'ouvre depuis son centre
    cmd("layer.newShape", kind="rounded", name="Etiqueta", size=[780, 270], fill=BRIQUE, position=[540, 425])
    cmd("prop.set", layer="Etiqueta", path="contents/group/contents/rect/roundness", value=10)
    duree("Etiqueta", 0.15, FIN)
    doux("Etiqueta", "transform/scale", 0.15, 0.8, [0, 100, 100], [100, 100, 100], 35, 90)

    # le titre en Limelight, lettre à lettre
    cmd("layer.newText", text="QUAL PARLA\nOCCITAN UÈI ?", name="Titol", box=[150, 318, 780, 230],
        font="Limelight", style="Regular", size=76, leading=108, fill=BLANC, justify="center")
    duree("Titol", 0.4, FIN)
    lettres("Titol", 0.4, 1.6)

    # les écussons de part et d'autre, qui tournent en se posant
    for nom, x, t in (("Escut esquèrra", 80, 1.05), ("Escut drecha", 1000, 1.15)):
        importar("logo-lo-ligam.svg", nom, t, [x, 425], 14)
        duree(nom, t, FIN)
        doux(nom, "transform/opacity", t, t + 0.35, 0, 100)
        doux(nom, "transform/scale", t, t + 0.7, [8, 8, 100], [14, 14, 100])
        doux(nom, "transform/rotation", t, t + 0.9, -120, 0)

    # la traduction, petite, en italique, entre parenthèses
    cmd("layer.newText", text="(Qui parle occitan aujourd’hui ?)", name="Revirada", position=[540, 630],
        font="Luciole", style="Italic", size=36, fill=CREME, justify="center")
    duree("Revirada", 1.4, FIN)
    apareisser("Revirada", 1.4, 0.7, montee=22, pos=[540, 630])

    # le logo complet sur sa tuile, en bas à droite ; le crédit, en bas à gauche
    # (la tuile est une forme : le découpage arrondi d'un SVG n'est pas lu à l'import)
    cmd("layer.newShape", kind="rounded", name="Logo tuila", size=[140, 140], fill=BRIQUE, position=[960, 1600])
    cmd("prop.set", layer="Logo tuila", path="contents/group/contents/rect/roundness", value=22)
    importar("logo-vertical-color-sens-fons.svg", "Logo", 1.9, [960, 1600], 31.5)
    cmd("layer.setParent", layers=["Logo"], parent="Logo tuila")
    for nom in ("Logo tuila", "Logo"):
        duree(nom, 1.9, FIN)
        doux(nom, "transform/opacity", 1.9, 2.4, 0, 100)
    doux("Logo tuila", "transform/scale", 1.9, 2.6, [86, 86, 100], [100, 100, 100])
    cmd("layer.newText", text="© RP · enquête OPLO 2020", name="Credit", position=[44, 1670],
        font="Luciole", style="Regular", size=18, fill=CREME, justify="left")
    cmd("prop.set", layer="Credit", path="transform/rotation", value=-90)
    duree("Credit", 2.1, FIN)
    doux("Credit", "transform/opacity", 2.1, 2.7, 0, 70)
