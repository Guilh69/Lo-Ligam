# Réel OPLO 2020, version 2 (Romain, 2026-10-24, après la v1 jugée « grossière ») :
# mise en page de ses posts récents (Article definit, Eclipsi, Dets, Drech,
# Officialitat) avec la charte du projet, fond pétrole (choix A). Ouverture
# validée par Romain ; étapes 2 à 7 proposées d'un seul tenant (Romain, 24-10 :
# « va au bout de la vidéo, fais-moi une proposition »).
# Mouvement : pas de rebond ; départ franc, longue décélération.
# Grammaire de page : l'étiquette du titre reste en haut ; dessous, la phrase de
# l'étape en occitan puis sa traduction en italique derrière le petit drapeau
# rond du kit ; les phrases sont des cases « ✎ » que Romain écrit lui-même.
# Maquette fixe (avant les retouches du 24-10) : design-stock/publicacions/2026-10-oplo/real-dobertura.html.
# Blason et logo : blason.png et logo-instagram.png, refaits par fabricar-logo-instagram.py.
# Chiffres : SIG/oplo-2020/LEGIR-ME.md et la synthèse de l'OPLO (près de 600 000 locuteurs).
# py effectcraft-real-oplo-v2.py <dernière étape, 1 à 7> > lot.tsv   puis   bash effectcraft-lancer.sh lot.tsv
import json, math, sys
import os as _os
RAIZ = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..'))
sys.stdout.reconfigure(encoding="utf-8")

C = "OPLO 2020 real v2"
DOS = RAIZ + "/design-stock/publicacions/2026-10-oplo/"
PETROLE, BRIQUE, CREME, BLANC = "#1F5F63", "#B53D17", "#F5EAD8", "#FFFFFF"
ORC, OR = "#FFD47F", "#EEAF34"
BLAU, ROGE = "#2B4C9B", "#D6372B"  # le drapeau rond du kit
GAMA = [CREME, ORC, OR, "#D4702A", BRIQUE]  # du plus clair au plus foncé, comme la couche « Locutors »
CLASSAS = [0, 5, 10, 15, 20]
DY = 460   # la silhouette du domaine (repère 4:5) descend de 460 px
# Départements : aplats sans contour, comme un remplissage sans trait dans QGIS
# (Romain, 24-10) ; la couleur distingue. Leurs frontières communes, chacune
# tracée une seule fois, en pointillé blanc très fin (Romain, 24-10 : « un trait
# très fin blanc en pointillé ») : points de `ep` px tous les `pas` px, à
# `opac` % ; None : aucune limite.
SEPARACION = {"ep": 2, "pas": 5.5, "opac": 70}

# début de chaque étape (s)
T = {1: 0.0, 2: 4.0, 3: 9.6, 4: 15.6, 5: 21.4, 6: 25.8, 7: 31.0, 8: 34.0}
N = int(sys.argv[1])
FIN = T[N + 1]

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


def frontieras(deps):
    """Les frontières communes entre départements, chacune une seule fois, en lignes ouvertes."""
    from collections import Counter, defaultdict
    n = Counter(frozenset((a, b)) for d in deps for r in anels(d["d"]) for a, b in zip(r, r[1:] + r[:1]) if a != b)
    voisins = defaultdict(list)
    for e, k in n.items():
        if k == 2:  # un segment partagé par deux départements (les bords extérieurs n'en sont pas)
            a, b = tuple(e)
            voisins[a].append(b)
            voisins[b].append(a)
    vus, lignes = set(), []

    def suivre(a, b):
        l = [a, b]
        vus.add(frozenset((a, b)))
        while len(voisins[b]) == 2:
            c = next((c for c in voisins[b] if frozenset((b, c)) not in vus), None)
            if c is None:
                break
            vus.add(frozenset((b, c)))
            l.append(c)
            b = c
        return l
    for depuis_bouts in (True, False):  # des bouts et carrefours d'abord, puis les boucles fermées
        for a in list(voisins):
            if depuis_bouts and len(voisins[a]) == 2:
                continue
            for b in voisins[a]:
                if frozenset((a, b)) not in vus:
                    lignes.append(suivre(a, b))
    return lignes


def classa(p):
    return max(i for i, m in enumerate(CLASSAS) if p >= m)


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


def cercle(cx, cy, r, n=40):
    return [[round(cx + r * math.cos(2 * math.pi * k / n), 2), round(cy + r * math.sin(2 * math.pi * k / n), 2)]
            for k in range(n)]


def forma(nom, anneaux, fill=None, stroke=None, ep=None):
    """Un calque de forme fait d'anneaux en coordonnées de la compo."""
    cmd("layer.newShape", kind="none", name=nom)
    for v in anneaux:
        v = [[round(x, 1), round(y, 1)] for x, y in simplificar(v)]
        if len(v) < 3:
            continue
        trait = {"stroke": stroke, "strokeWidth": ep} if stroke else {"stroke": False}
        cmd("shape.newPath", layer=nom, vertices=v, closed=True, space="comp", fill=fill or False, **trait)


def texte(nom, txt, pos, police, style, taille, couleur, t0, t1, justify="center"):
    cmd("layer.newText", text=txt, name=nom, position=pos, font=police, style=style, size=taille, fill=couleur,
        justify=justify)
    duree(nom, t0, t1)


def monta(nom, t, pos, dy=14, dur=0.6):
    """Arrivée d'une ligne : fondu et petite montée."""
    doux(nom, "transform/opacity", t, t + dur * 0.7, 0, 100)
    doux(nom, "transform/position", t, t + dur, [pos[0], pos[1] + dy], pos)


def fondre(noms, t, dur=0.4, v0=100):
    """Sortie : fondu, sans mouvement."""
    for n in noms:
        doux(n, "transform/opacity", t, t + dur, v0, 0, 40, 60)


def deroula(nom, t0, t1):
    """La ligne se déroule de gauche à droite (comme la traduction du titre)."""
    A = "text/animators/animator/"
    cmd("layer.addTextAnimator", layer=nom, properties=["opacity"])
    cmd("prop.set", layer=nom, path=A + "properties/opacity", value=0)
    cmd("prop.set", layer=nom, path=A + "selectors/rangeSelector/advanced/shape", value=1)
    doux(nom, A + "selectors/rangeSelector/offset", t0, t1, -100, 100, 20, 60)


def a_esquerra(nom, cible, ecart):
    """Le calque suit le bord gauche du texte cible, centré sur sa hauteur (le texte peut changer)."""
    cmd("prop.setExpression", layer=nom, path="transform/position", expression=(
        f'var t = thisComp.layer("{cible}"); var r = t.sourceRectAtTime(time, false); '
        f'var p = t.transform.position; [p[0] + r.left - {ecart}, p[1] + r.top + r.height / 2]'))


def drapeu(nom, cible, t0, t1, r=15):
    """Le petit drapeau rond du kit devant une traduction : trois bandes égales dans un disque."""
    a = math.acos(1 / 3)
    arc = lambda a0, a1: [[round(540 + r * math.cos(a0 + (a1 - a0) * k / 16), 2),
                           round(960 + r * math.sin(a0 + (a1 - a0) * k / 16), 2)] for k in range(17)]
    cmd("layer.newShape", kind="none", name=nom)
    cmd("shape.newPath", layer=nom, vertices=cercle(540, 960, r, 48), closed=True, space="comp", fill=BLANC,
        stroke=False)
    cmd("shape.newPath", layer=nom, vertices=arc(math.pi - a, math.pi + a), closed=True, space="comp", fill=BLAU,
        stroke=False)
    cmd("shape.newPath", layer=nom, vertices=arc(-a, a), closed=True, space="comp", fill=ROGE, stroke=False)
    a_esquerra(nom, cible, r + 12)
    duree(nom, t0, t1)
    doux(nom, "transform/opacity", t0, t0 + 0.35, 0, 100)
    doux(nom, "transform/scale", t0, t0 + 0.5, [60, 60, 100], [100, 100, 100])


def revirada(nom, txt, y, t0, t1, taille=30, x=540):
    """Une traduction : drapeau, puis le texte en italique qui se déroule."""
    decal = (2 * 15 + 12) / 2  # le groupe drapeau + texte reste centré
    texte(nom, txt, [x + decal, y], "Luciole", "Italic", taille, CREME, t0, t1)
    deroula(nom, t0 + 0.1, t0 + 0.9)
    drapeu(nom + " drapèu", nom, t0, t1)
    return [nom, nom + " drapèu"]


def frasa(n, indice, t0, t1):
    """La case de la phrase de Romain sous le titre : l'occitan, puis sa traduction."""
    oc = f"Frasa {n}"
    texte(oc, "✎ " + indice, [540, 668], "Luciole", "Bold", 38, BLANC, t0, t1)
    monta(oc, t0, [540, 668])
    noms = [oc] + revirada(f"Frasa {n} fr", "(sa traduction en français)", 718, t0 + 0.4, t1)
    if t1 < FIN:
        fondre(noms, t1 - 0.4)


IMPORTATS = set()


def importar(fichier, nom, t, pos, echelle):
    if fichier not in IMPORTATS:  # un seul élément de projet par fichier
        cmd("file.import", paths=[DOS + fichier])
        IMPORTATS.add(fichier)
    cmd("layer.addItem", item=fichier, time=t, position=pos)
    cmd("layer.rename", name=nom)
    cmd("prop.set", layer=nom, path="transform/scale", value=[echelle, echelle, 100])


# La flèche à boucle du kit (corps), en coordonnées locales
P = [(10, 40), (120, 60), (80, 55), (225, 110)]
OUT = [(50, -40), (-15, 45), (20, -35)]
IN = [(20, -60), (-20, 35), (-45, -80)]


def fleca(nom, L, T_, t0, t1, ep=6, miralh=False):
    """La flèche dessinée du kit, de L vers T_, qui se trace en 0,7 s puis reçoit sa pointe."""
    pts = [(x, -y) for x, y in P] if miralh else P
    o = [(x, -y) for x, y in OUT] if miralh else OUT
    i_ = [(x, -y) for x, y in IN] if miralh else IN
    sx, sy = pts[0]
    ex, ey = pts[3]
    s = math.hypot(T_[0] - L[0], T_[1] - L[1]) / math.hypot(ex - sx, ey - sy)
    th = math.atan2(T_[1] - L[1], T_[0] - L[0]) - math.atan2(ey - sy, ex - sx)
    co, si = math.cos(th), math.sin(th)
    rot = lambda dx, dy: [round(s * (co * dx - si * dy), 2), round(s * (si * dx + co * dy), 2)]
    v = [[round(L[0] + a[0], 2), round(L[1] + a[1], 2)] for a in (rot(x - sx, y - sy) for x, y in pts)]
    to = [rot(*k) for k in o] + [[0, 0]]
    ti = [[0, 0]] + [rot(*k) for k in i_]
    cmd("layer.newShape", kind="none", name=nom)
    cmd("shape.newPath", layer=nom, vertices=v, inTangents=ti, outTangents=to, closed=False, space="comp",
        fill=False, stroke=BLANC, strokeWidth=ep)
    cmd("prop.set", layer=nom, path="contents/group/contents/stroke/cap", value=1)
    cmd("layer.addShapeItem", layer=nom, kind="trim", group="contents/group")
    doux(nom, "contents/group/contents/trim/end", t0, t0 + 0.7, 0, 100, 40, 70)
    duree(nom, t0, t1)
    # la pointe, dans l'axe de l'arrivée du trait
    dx, dy = ti[3]
    d = math.atan2(-dy, -dx)
    pt = lambda a: [round(T_[0] - 26 * math.cos(d + a), 2), round(T_[1] - 26 * math.sin(d + a), 2)]
    cmd("layer.newShape", kind="none", name=nom + " punta")
    cmd("shape.newPath", layer=nom + " punta", vertices=[pt(0.55), list(T_), pt(-0.55)], closed=False,
        space="comp", fill=False, stroke=BLANC, strokeWidth=ep)
    cmd("prop.set", layer=nom + " punta", path="contents/group/contents/stroke/cap", value=1)
    cmd("prop.set", layer=nom + " punta", path="contents/group/contents/stroke/join", value=1)
    duree(nom + " punta", t0, t1)
    doux(nom + " punta", "transform/opacity", t0 + 0.62, t0 + 0.75, 0, 100)
    return [nom, nom + " punta"]


def pastilha(nom, txt, pos, w, fons, tinta, t0, t1, taille=50, police="Limelight", style="Regular", h=72):
    """Une pastille de la couleur de son département, qui arrive en douceur."""
    cmd("layer.newShape", kind="rounded", name=nom, size=[w, h], fill=fons, position=pos)
    cmd("prop.set", layer=nom, path="contents/group/contents/rect/roundness", value=14)
    duree(nom, t0, t1)
    texte(nom + " tèxt", txt, [pos[0], pos[1] + taille * 0.36], police, style, taille, tinta, t0, t1)
    for n in (nom, nom + " tèxt"):
        doux(n, "transform/opacity", t0, t0 + 0.35, 0, 100)
    doux(nom, "transform/scale", t0, t0 + 0.55, [82, 82, 100], [100, 100, 100])
    cmd("layer.setParent", layers=[nom + " tèxt"], parent=nom)
    return [nom, nom + " tèxt"]


# ———————————————————————— étape 1 : l'ouverture (validée le 24-10) ————————————————————————
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
duree("Domeni contorn", 0, min(FIN, 3.6))
doux("Domeni contorn", "contents/trim/end", 0.5, 2.4, 0, 100, 25, 70)
doux("Domeni", "transform/opacity", 2.0, 3.0, 0, 16)
doux("Domeni contorn", "transform/opacity", 2.5, 3.4, 70, 0)

# l'étiquette brique et le titre en Limelight, là dès la première image, jusqu'au bout
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

CARTA_NOMS = ["Domeni"]  # tout ce qui part avec la carte à la fin de l'étape 3

# ———————————————————————— étape 2 : l'enquête ————————————————————————
# La traduction du titre laisse la place à la phrase ; la zone enquêtée
# s'éclaire, les limites des départements apparaissent, puis chaque
# département prend sa couleur, du plus petit taux au plus grand.
if N >= 2:
    t = T[2]
    fondre(["Revirada"], t - 0.1)
    deps = sorted(CARTA["deps"], key=lambda d: d["pct"])
    zona = [r for d in deps for r in anels(d["d"])]
    forma("Zona", zona, fill=BLANC)
    duree("Zona", t, FIN)
    doux("Zona", "transform/opacity", t + 0.2, t + 1.1, 0, 24)
    noms = []
    for i, d in enumerate(deps):
        nom = f"Dep {d['code']}"
        c = GAMA[classa(d["pct"])]
        forma(nom, anels(d["d"]), fill=c, stroke=c, ep=1)  # trait de la couleur du fond : ferme les jours, ne se voit pas
        duree(nom, t, FIN)
        ancrar(nom, d["c"][0], d["c"][1] + DY)
        t0 = t + 1.7 + i * 0.11 + (0.25 if d["code"] == "ARAN" else 0)
        doux(nom, "transform/opacity", t0, t0 + 0.45, 0, 100)
        doux(nom, "transform/scale", t0, t0 + 0.6, [94, 94, 100], [100, 100, 100])
        noms.append(nom)
    if SEPARACION:
        lignes = [l for l in (simplificar(l) for l in frontieras(deps)) if len(l) >= 2]
        cmd("layer.newShape", kind="none", name="Limits")
        for l in lignes:
            cmd("shape.newPath", layer="Limits", vertices=[[round(x, 1), round(y, 1)] for x, y in l], closed=False,
                space="comp", fill=False, stroke=BLANC, strokeWidth=SEPARACION["ep"])
        for k in range(len(lignes)):  # tiret presque nul à bout rond : un point
            g = "contents/group" + (f"#{k + 1}" if k else "")
            cmd("prop.set", layer="Limits", path=g + "/contents/stroke/cap", value=1)
            cmd("prop.set", layer="Limits", path=g + "/contents/stroke/dashes/dash", value=0.1)
            cmd("prop.set", layer="Limits", path=g + "/contents/stroke/dashes/gap", value=SEPARACION["pas"])
        duree("Limits", t, FIN)
        doux("Limits", "transform/opacity", t + 0.5, t + 1.3, 0, SEPARACION["opac"])
        noms.append("Limits")
    # découpé sur le domaine (Béarn, Charente occitane) : un précompo, le domaine en cache
    cmd("layer.precompose", layers=["Zona"] + noms, name="Carta departaments v2", mode="move")
    forma("Domeni masca", anels(CARTA["domeni"]), fill=BLANC)
    cmd("layer.setTrackMatte", layer="Carta departaments v2", matte="Domeni masca", kind="alpha")
    CARTA_NOMS += ["Carta departaments v2"]
    frasa(2, "Ta phrase : qui, quand, combien ?", t + 0.4, T[3])

# ———————————————————————— étape 3 : de 2 % à 62 % ————————————————————————
# Trois pastilles de la couleur de leur département, reliées par la flèche du kit.
if N >= 3:
    t = T[3]
    frasa(3, "Ta phrase : les chiffres et les lieux", t + 0.2, T[4])
    dep = {d["code"]: d for d in CARTA["deps"]}
    for k, (code, nom, pos, w, L, cote, miralh) in enumerate((
            ("33", "Gironda", [110, 852], 120, (112, 900), "dessus", False),
            ("48", "Losèra", [850, 880], 150, (775, 905), "dessous", False),
            ("ARAN", "Val d’Aran", [600, 1440], 150, (515, 1428), "drecha", True))):
        d = dep[code]
        i = classa(d["pct"])
        t0 = t + 0.7 + k * 1.0
        CARTA_NOMS += pastilha(f"Pastilha {code}", f"{d['pct']} %", pos, w, GAMA[i], "#3A2A20" if i <= 2 else BLANC,
                               t0, FIN)
        np = f"Pastilha {code} nom"
        if cote in ("dessous", "dessus"):  # sous la pastille, ou dessus quand la flèche part d'en bas
            y = pos[1] + 78 if cote == "dessous" else pos[1] - 50
            texte(np, nom, [pos[0], y], "Luciole", "Bold", 32, BLANC, t0, FIN)
            monta(np, t0 + 0.15, [pos[0], y], 10)
        else:
            texte(np, nom, [pos[0] + w / 2 + 18, pos[1] + 11], "Luciole", "Bold", 32, BLANC, t0, FIN, "left")
            monta(np, t0 + 0.15, [pos[0] + w / 2 + 18, pos[1] + 11], 10)
        CARTA_NOMS += [np]
        CARTA_NOMS += fleca(f"Fleca {code}", L, (d["c"][0], d["c"][1] + DY - 8), t0 + 0.3, FIN, miralh=miralh)
    fondre(CARTA_NOMS[1:], T[4] - 0.5)
    fondre(["Domeni"], T[4] - 0.5, v0=16)

# ———————————————————————— étape 4 : parler, comprendre ————————————————————————
# Cent points pour cent personnes : 7 parlent, 15 comprennent bien
# (les 7 qui parlent sont comptés parmi les 15).
if N >= 4:
    t = T[4]
    frasa(4, "Ta phrase : parler, comprendre", t + 0.2, T[5])
    sortents = []
    PAS, R = 50, 17
    x0, y0 = 540 - 4.5 * PAS, 975
    for row in range(10):
        nom = f"Punts {row}"
        cmd("layer.newShape", kind="none", name=nom)
        for col in range(10):
            cmd("shape.newPath", layer=nom, vertices=cercle(x0 + col * PAS, y0 + row * PAS, R), closed=True,
                space="comp", fill=CREME, stroke=False)
        duree(nom, t, FIN)
        t0 = t + 0.5 + row * 0.06
        doux(nom, "transform/opacity", t0, t0 + 0.4, 0, 28)
        doux(nom, "transform/position", t0, t0 + 0.5, [540, 970], [540, 960])
        sortents.append(nom)
    for k in range(15):
        nom = f"Punt {k}"
        x, y = x0 + (k % 10) * PAS, y0 + (k // 10) * PAS
        cmd("layer.newShape", kind="none", name=nom)
        cmd("shape.newPath", layer=nom, vertices=cercle(x, y, R), closed=True, space="comp",
            fill=BRIQUE if k < 7 else OR, stroke=False)
        ancrar(nom, x, y)
        duree(nom, t, FIN)
        t0 = t + 1.6 + k * 0.07 if k < 7 else t + 2.9 + (k - 7) * 0.07
        doux(nom, "transform/opacity", t0, t0 + 0.3, 0, 100)
        doux(nom, "transform/scale", t0, t0 + 0.45, [50, 50, 100], [100, 100, 100])
        sortents.append(nom)
    # les deux légendes, au-dessus de la grille
    for nom, xc, chif, oc, fr, coul, t0 in (("Legenda parlan", 300, "7 %", "parlan", "(parlent)", BRIQUE, t + 1.5),
                                            ("Legenda comprenon", 780, "15 %", "comprenon plan",
                                             "(comprennent bien)", OR, t + 2.8)):
        texte(nom, chif, [xc + 16, 832], "Limelight", "Regular", 60, BLANC, t0, FIN)
        monta(nom, t0, [xc + 16, 832])
        cmd("layer.newShape", kind="none", name=nom + " punt")
        cmd("shape.newPath", layer=nom + " punt", vertices=cercle(540, 960, 14), closed=True, space="comp",
            fill=coul, stroke=False)
        a_esquerra(nom + " punt", nom, 30)
        duree(nom + " punt", t0, FIN)
        doux(nom + " punt", "transform/opacity", t0, t0 + 0.3, 0, 100)
        texte(nom + " oc", oc, [xc, 876], "Luciole", "Bold", 34, BLANC, t0, FIN)
        monta(nom + " oc", t0 + 0.15, [xc, 876])
        sortents += [nom, nom + " punt", nom + " oc"] + revirada(nom + " fr", fr, 912, t0 + 0.35, FIN, 26, xc)
    texte("Nota 100", "Sur 100 personnes de 15 ans et plus", [540, 1478], "Luciole", "Italic", 24, CREME, t + 0.9, FIN)
    doux("Nota 100", "transform/opacity", t + 0.9, t + 1.4, 0, 75)
    sortents.append("Nota 100")
    fondre(sortents, T[5] - 0.5)
    fondre(["Nota 100"], T[5] - 0.5, v0=75)
    for row in range(10):
        fondre([f"Punts {row}"], T[5] - 0.5, v0=28)

# ———————————————————————— étape 5 : près de 600 000 ————————————————————————
if N >= 5:
    t = T[5]
    frasa(5, "Ta phrase : un constat sec", t + 0.2, T[6])
    texte("Nombre", "600 000", [540, 1075], "Limelight", "Regular", 190, ORC, t + 0.4, FIN)
    cmd("prop.setExpression", layer="Nombre", path="text/sourceText", expression=(
        f'var v = Math.round(ease(time, {t + 0.5}, {t + 2.1}, 0, 600) ) * 1000; '
        f'var s = String(v); s.length > 3 ? s.slice(0, -3) + " " + s.slice(-3) : s'))
    doux("Nombre", "transform/opacity", t + 0.4, t + 0.8, 0, 100)
    texte("Nombre oc", "locutors", [540, 1160], "Luciole", "Bold", 52, BLANC, t + 1.2, FIN)
    monta("Nombre oc", t + 1.2, [540, 1160])
    sortents = ["Nombre", "Nombre oc"] + revirada("Nombre fr", "(locuteurs)", 1210, t + 1.5, FIN, 32)
    sortents += pastilha("Mejana", "7 % en mejana", [540, 1330], 420, BRIQUE, BLANC, t + 2.3, FIN, 40, "Luciole",
                         "Bold", 76)
    sortents += revirada("Mejana fr", "(en moyenne)", 1410, t + 2.6, FIN, 28)
    fondre(sortents, T[6] - 0.5)

# ———————————————————————— étape 6 : l'âge ————————————————————————
# 2 % chez les 15-29 ans ; l'âge moyen des locuteurs (66 ans) glisse sur une
# règle des âges, au-delà de celui de l'ensemble (50 ans).
if N >= 6:
    t = T[6]
    frasa(6, "Ta question de fin", t + 0.2, FIN)
    texte("Joves", "15-29 ans", [540, 818], "Luciole", "Bold", 36, CREME, t + 0.5, FIN)
    monta("Joves", t + 0.5, [540, 818])
    texte("Joves chifra", "2 %", [540, 960], "Limelight", "Regular", 150, ORC, t + 0.7, FIN)
    monta("Joves chifra", t + 0.7, [540, 960], 20, 0.8)
    texte("Joves oc", "parlan", [540, 1010], "Luciole", "Bold", 34, BLANC, t + 1.0, FIN)
    monta("Joves oc", t + 1.0, [540, 1010])
    sortents = ["Joves", "Joves chifra", "Joves oc"] + revirada("Joves fr", "(parlent)", 1046, t + 1.2, FIN, 26)
    texte("Atge oc", "atge mejan dels locutors", [540, 1150], "Luciole", "Bold", 34, BLANC, t + 2.0, FIN)
    monta("Atge oc", t + 2.0, [540, 1150])
    sortents += ["Atge oc"] + revirada("Atge fr", "(âge moyen des locuteurs ; 50 ans pour l’ensemble)", 1188,
                                       t + 2.2, FIN, 26)
    # la règle des âges, de 15 à 90 ans
    X = lambda age: 140 + (age - 15) * 800 / 75
    cmd("layer.newShape", kind="none", name="Regla")
    cmd("shape.newPath", layer="Regla", vertices=[[140, 1340], [940, 1340]], closed=False, space="comp", fill=False,
        stroke=CREME, strokeWidth=3)
    cmd("prop.set", layer="Regla", path="contents/group/contents/stroke/cap", value=1)
    cmd("layer.addShapeItem", layer="Regla", kind="trim", group="contents/group")
    doux("Regla", "contents/group/contents/trim/end", t + 2.4, t + 3.1, 0, 100, 40, 70)
    duree("Regla", t + 2.4, FIN)
    cmd("prop.set", layer="Regla", path="transform/opacity", value=60)
    sortents.append("Regla")
    for nom, txt, x in (("Regla 15", "15", 140), ("Regla 90", "90 ans", 940)):
        texte(nom, txt, [x, 1382], "Luciole", "Regular", 24, CREME, t + 2.6, FIN)
        doux(nom, "transform/opacity", t + 2.6, t + 3.0, 0, 70)
        sortents.append(nom)
    # l'ensemble : 50 ans
    cmd("layer.newShape", kind="none", name="Regla 50")
    cmd("shape.newPath", layer="Regla 50", vertices=cercle(X(50), 1340, 9), closed=True, space="comp", fill=CREME,
        stroke=False)
    duree("Regla 50", t + 3.0, FIN)
    doux("Regla 50", "transform/opacity", t + 3.0, t + 3.3, 0, 100)
    texte("Regla 50 tèxt", "50", [X(50), 1382], "Luciole", "Bold", 26, CREME, t + 3.0, FIN)  # sous la règle : le 66 passe au-dessus
    doux("Regla 50 tèxt", "transform/opacity", t + 3.0, t + 3.3, 0, 80)
    sortents += ["Regla 50", "Regla 50 tèxt"]
    # les locuteurs : 66 ans, le point glisse depuis 15 ans
    cmd("layer.newShape", kind="none", name="Regla 66")
    cmd("shape.newPath", layer="Regla 66", vertices=cercle(540, 960, 16), closed=True, space="comp", fill=OR,
        stroke=False)
    duree("Regla 66", t + 3.2, FIN)
    doux("Regla 66", "transform/opacity", t + 3.2, t + 3.4, 0, 100)
    doux("Regla 66", "transform/position", t + 3.2, t + 4.4, [140, 1340], [X(66), 1340], 35, 85)
    texte("Regla 66 tèxt", "66 ans", [0, -40], "Limelight", "Regular", 60, ORC, t + 3.2, FIN)
    cmd("layer.setParent", layers=["Regla 66 tèxt"], parent="Regla 66", compensate=False)
    doux("Regla 66 tèxt", "transform/opacity", t + 3.2, t + 3.5, 0, 100)
    sortents += ["Regla 66", "Regla 66 tèxt"]
    if N >= 7:
        fondre(sortents, T[7] - 0.5)
        fondre(["Regla"], T[7] - 0.5, v0=60)
        fondre(["Regla 15", "Regla 90"], T[7] - 0.5, v0=70)
        fondre(["Regla 50 tèxt"], T[7] - 0.5, v0=80)

# ———————————————————————— étape 7 : la fin ————————————————————————
# Le logo du site (Romain, 24-10 : « le logo qu'on utilise sur le site ») arrive
# au centre, sous la question de fin : la tuile de la barre du haut
# (crotz-teula.png, fabricar-crotz-teula.py) et « Lo Ligam » en Limelight, aux
# proportions de la barre (tuile 30 px, nom 1,3 rem, écart 0,6 rem). La tuile
# tourne d'un quart de tour en arrivant, comme au survol sur le site. Le logo
# du coin s'efface.
if N >= 7:
    t = T[7]
    fondre(["Logo"], t - 0.1, 0.5)
    TUILA, TALHA, ECART, CY = 170, 118, 54, 1060
    try:  # largeur et métriques du nom, mesurées dans la police
        from PIL import ImageFont
        pol = ImageFont.truetype(_os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Windows\Fonts\limelight.ttf"), TALHA)
        larg, (asc, desc) = pol.getlength("Lo Ligam"), pol.getmetrics()
    except Exception:
        larg, asc, desc = 549, 108, 37
    x0 = 540 - (TUILA + ECART + larg) / 2
    importar("crotz-teula.png", "Marca tuila", t, [round(x0 + TUILA / 2, 1), CY], 50)
    duree("Marca tuila", t, FIN)
    doux("Marca tuila", "transform/opacity", t + 0.2, t + 0.6, 0, 100)
    doux("Marca tuila", "transform/scale", t + 0.2, t + 1.4, [40, 40, 100], [50, 50, 100], 15, 90)
    doux("Marca tuila", "transform/rotation", t + 0.2, t + 1.4, -90, 0, 15, 90)
    pos = [round(x0 + TUILA + ECART, 1), round(CY + (asc - desc) / 2, 1)]
    texte("Marca nom", "Lo Ligam", pos, "Limelight", "Regular", TALHA, BLANC, t, FIN, "left")
    doux("Marca nom", "transform/opacity", t + 0.6, t + 1.1, 0, 100)
    doux("Marca nom", "transform/position", t + 0.6, t + 1.5, [pos[0] - 30, pos[1]], pos, 15, 90)
