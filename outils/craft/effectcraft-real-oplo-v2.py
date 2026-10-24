# Réel OPLO 2020, version 2 (Romain, 2026-10-24, après la v1 jugée « grossière ») :
# mise en page de ses posts récents (Article définit, Eclipsi, Dets, Drech,
# Officialitat) avec la charte du projet, fond pétrole (choix A), construite
# étape par étape, chaque étape validée par Romain avant la suivante.
# Mouvement : pas de rebond ; départ franc, longue décélération ; les lettres
# montent de quelques pixels en passant du flou au net.
# Maquette fixe (avant les retouches du 24-10) : design-stock/publicacions/2026-10-oplo/real-dobertura.html.
# Blason et logo : blason.png et logo-instagram.png, refaits par fabricar-logo-instagram.py.
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

if etape == "1":  # ouverture (retouches de Romain du 24-10 : titre là dès le début, ses blasons, son logo Instagram)
    cmd("comp.new", name=C, width=1080, height=1920, frameRate=30, duration=FIN, background=PETROLE)
    cmd("layer.newSolid", name="Fons", color=PETROLE)
    duree("Fons", 0, FIN)

    # le domaine : le contour se dessine d'un trait, puis l'intérieur apparaît
    # et le trait s'efface (pas de contour sur les couches, comme dans ses posts)
    anneaux = [[[round(x, 1), round(y, 1)] for x, y in simplificar(r)] for r in anels(CARTA["domeni"])]
    anneaux = [v for v in anneaux if len(v) >= 3]
    cmd("layer.newShape", kind="none", name="Domeni")
    cmd("layer.newShape", kind="none", name="Domeni contorn")
    aire = lambda v: abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(v, v[1:] + v[:1]))) / 2
    for v in anneaux:
        cmd("shape.newPath", layer="Domeni", vertices=v, closed=True, space="comp", fill=BLANC, stroke=False)
        if aire(v) < 400:  # les îlots ne se dessinent pas : ils clignoteraient pendant le tracé
            continue
        cmd("shape.newPath", layer="Domeni contorn", vertices=v, closed=True, space="comp", fill=False,
            stroke=BLANC, strokeWidth=4)
    cmd("layer.addShapeItem", layer="Domeni contorn", kind="trim")
    duree("Domeni", 0, FIN)
    duree("Domeni contorn", 0, FIN)
    doux("Domeni contorn", "contents/trim/end", 0.5, 2.4, 0, 100, 25, 70)
    doux("Domeni", "transform/opacity", 2.0, 3.0, 0, 16)
    doux("Domeni contorn", "transform/opacity", 2.5, 3.4, 70, 0)

    # l'étiquette brique et le titre en Limelight, là dès la première image
    cmd("layer.newShape", kind="rounded", name="Etiqueta", size=[780, 270], fill=BRIQUE, position=[540, 425])
    cmd("prop.set", layer="Etiqueta", path="contents/group/contents/rect/roundness", value=10)
    duree("Etiqueta", 0, FIN)
    cmd("layer.newText", text="QUAL PARLA\nOCCITAN UÈI ?", name="Titol", box=[150, 318, 780, 230],
        font="Limelight", style="Regular", size=76, leading=108, fill=BLANC, justify="center")
    duree("Titol", 0, FIN)

    # ses blasons de part et d'autre du titre (blason.png, tiré de ses posts Canva)
    for nom, x in (("Blason esquèrra", 75), ("Blason drech", 1005)):
        importar("blason.png", nom, 0, [x, 425], 43)
        duree(nom, 0, FIN)

    # la traduction se déroule de gauche à droite
    cmd("layer.newText", text="(Qui parle occitan aujourd’hui ?)", name="Revirada", position=[540, 630],
        font="Luciole", style="Italic", size=36, fill=CREME, justify="center")
    duree("Revirada", 0, FIN)
    A = "text/animators/animator/"
    cmd("layer.addTextAnimator", layer="Revirada", properties=["opacity"])
    cmd("prop.set", layer="Revirada", path=A + "properties/opacity", value=0)
    cmd("prop.set", layer="Revirada", path=A + "selectors/rangeSelector/advanced/shape", value=1)
    doux("Revirada", A + "selectors/rangeSelector/offset", 0.3, 1.3, -100, 100, 20, 60)

    # son logo Instagram en bas à droite, coupé par le bord comme dans ses posts ;
    # le crédit en bas à gauche
    importar("logo-instagram.png", "Logo", 0, [1035, 1585], 37.5)
    duree("Logo", 0, FIN)
    cmd("layer.newText", text="© RP · enquête OPLO 2020", name="Credit", position=[44, 1670],
        font="Luciole", style="Regular", size=18, fill=CREME, justify="left")
    cmd("prop.set", layer="Credit", path="transform/rotation", value=-90)
    cmd("prop.set", layer="Credit", path="transform/opacity", value=70)
    duree("Credit", 0, FIN)
