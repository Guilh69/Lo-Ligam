# Génère les commandes EffectCraft du réel 9:16 « Qual parla occitan uèi ? »
# (enquête OPLO 2020, Romain 2026-10-24). DA Instagram de Romain, variante B2 :
# fond pétrole, aplats francs sans contour, chiffres sur des pastilles de la
# couleur du département, flèches dessinées du kit. Les phrases de chaque scène
# sont des cases « TA FRASA … » que Romain écrit lui-même.
# Carte : design-stock/publicacions/2026-10-oplo/carta-donadas.js (generar.mjs).
# Chiffres : SIG/oplo-2020/LEGIR-ME.md.
# py effectcraft-real-oplo.py <scène> > lot.tsv   puis   bash effectcraft-lancer.sh lot.tsv
import json, math, sys
import os as _os
RAIZ = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..'))
sys.stdout.reconfigure(encoding="utf-8")

C = "OPLO 2020 real"
DOS = RAIZ + "/design-stock/publicacions/2026-10-oplo/"
PETROLE, BRIQUE, OR, ORC, CREME, BRUN, BLANC = "#1F5F63", "#B53D17", "#EEAF34", "#FFD47F", "#F5EAD8", "#3A2A20", "#FFFFFF"
GAMA = [CREME, ORC, OR, "#D4702A", BRIQUE]
CLASSAS = [0, 5, 10, 15, 20]
DY = 300  # la carte (repère 4:5) descend de 300 px dans le 9:16
FIN = 32.6

with open(DOS + "carta-donadas.js", encoding="utf-8") as f:
    CARTA = json.loads(f.read().split("=", 1)[1].strip().rstrip(";"))


def classa(p):
    return max(i for i, m in enumerate(CLASSAS) if p >= m)


def anels(d):
    """Les anneaux d'un chemin « M x yL x y…Z », décalés dans le 9:16."""
    out = []
    for r in d.split("M")[1:]:
        pts = [tuple(map(float, p.split())) for p in r.replace("Z", "").split("L")]
        out.append([(x, y + DY) for x, y in pts])
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


def pop(nom, t, final=100):
    """Arrivée en rebond, comme les autocollants des visuels."""
    cle(nom, "transform/scale", t, [0, 0, 100])
    cle(nom, "transform/scale", t + 0.15, [final * 1.18, final * 1.18, 100])
    cle(nom, "transform/scale", t + 0.3, [final, final, 100])


def tremol(nom, amp=1.2):
    """Le « tremblé » du dessin à la main : un petit bougé saccadé à 6 images par seconde."""
    cmd("prop.setExpression", layer=nom, path="transform/rotation", expression=f"posterizeTime(6); wiggle(6, {amp})")


def forma(nom, poli, t0, t1, fill, opac=100, ancra=None):
    """Un calque de forme fait d'un ou plusieurs anneaux pleins, sans contour visible."""
    cmd("layer.newShape", kind="none", name=nom)
    for r in poli:
        v = [[round(x, 1), round(y, 1)] for x, y in simplificar(r)]
        if len(v) < 3:
            continue
        cmd("shape.newPath", layer=nom, vertices=v, closed=True, space="comp", fill=fill,
            fillOpacity=opac, stroke=fill, strokeOpacity=opac, strokeWidth=1.5)
    if ancra:
        # l'ancre se compte depuis la position par défaut du calque (le centre de la compo)
        cmd("prop.set", layer=nom, path="transform/anchor", value=[ancra[0] - 540, ancra[1] - 960])
        cmd("prop.set", layer=nom, path="transform/position", value=ancra)
    duree(nom, t0, t1)


def texte(nom, txt, t0, t1, preset=None, **st):
    cmd("layer.newText", text=txt, name=nom, **st)
    duree(nom, t0, t1)
    if preset:
        cmd("time.set", time=t0)
        cmd("layer.applyTextPreset", layer=nom, preset=preset)


def frasa(nom, registre, t0, t1, y=1370):
    """La case de la phrase de Romain : il remplace ce texte dans EffectCraft."""
    texte(nom, "✎ " + registre, t0, t1, "fadeUpCharacters", box=[190, y, 730, 130],
          font="Luciole", style="Italic", size=34, fill=BLANC, justify="left")
    cmd("prop.set", layer=nom, path="transform/opacity", value=70)


def pastilha(nom, txt, x, y, w, h, fons, tinta, t, t1, taille=52, police="Limelight", style="Regular"):
    """Une pastille arrondie avec son texte, qui arrive en rebond."""
    cmd("layer.newShape", kind="rounded", name=nom + " fons", size=[w, h], fill=fons, position=[x, y])
    texte(nom, txt, t, t1, None, position=[x, y + taille * 0.36], font=police, style=style, size=taille,
          fill=tinta, justify="center")
    duree(nom + " fons", t, t1)
    cmd("layer.setParent", layers=[nom], parent=nom + " fons")
    pop(nom + " fons", t)
    tremol(nom + " fons", 1.0)


# La flèche à boucle du kit (corps), en coordonnées locales
P = [(10, 40), (120, 60), (80, 55), (225, 110)]
OUT = [(50, -40), (-15, 45), (20, -35)]
IN = [(20, -60), (-20, 35), (-45, -80)]


def fleca(nom, L, T, t0, t1, tdeb, couleur=BLANC, ep=7):
    """La flèche dessinée de L (près du nom) vers T, qui se trace de tdeb à tdeb + 0,6 s."""
    sx, sy = P[0]
    ex, ey = P[3]
    s = math.hypot(T[0] - L[0], T[1] - L[1]) / math.hypot(ex - sx, ey - sy)
    th = math.atan2(T[1] - L[1], T[0] - L[0]) - math.atan2(ey - sy, ex - sx)
    co, si = math.cos(th), math.sin(th)
    rot = lambda dx, dy: [s * (co * dx - si * dy), s * (si * dx + co * dy)]
    v = [[L[0] + a[0], L[1] + a[1]] for a in (rot(x - sx, y - sy) for x, y in P)]
    to = [rot(*o) for o in OUT] + [[0, 0]]
    ti = [[0, 0]] + [rot(*i) for i in IN]
    cmd("layer.newShape", kind="none", name=nom)
    cmd("shape.newPath", layer=nom, vertices=v, inTangents=ti, outTangents=to, closed=False, space="comp",
        fill=False, stroke=couleur, strokeWidth=ep)
    cmd("prop.set", layer=nom, path="contents/group/contents/stroke/cap", value=1)
    cmd("layer.addShapeItem", layer=nom, kind="trim", group="contents/group")
    cle(nom, "contents/group/contents/trim/end", tdeb, 0)
    cle(nom, "contents/group/contents/trim/end", tdeb + 0.6, 100)
    duree(nom, t0, t1)
    # la pointe, qui arrive au bout du trait
    d = th + math.atan2(80, 45)
    pt = lambda a: [T[0] - 30 * math.cos(d + a), T[1] - 30 * math.sin(d + a)]
    cmd("layer.newShape", kind="none", name=nom + " punta")
    cmd("shape.newPath", layer=nom + " punta", vertices=[pt(0.5), list(T), pt(-0.5)], closed=False, space="comp",
        fill=False, stroke=couleur, strokeWidth=ep)
    cmd("prop.set", layer=nom + " punta", path="contents/group/contents/stroke/cap", value=1)
    cmd("prop.set", layer=nom + " punta", path="contents/group/contents/stroke/join", value=1)
    duree(nom + " punta", tdeb + 0.55, t1)
    cle(nom + " punta", "transform/opacity", tdeb + 0.55, 0)
    cle(nom + " punta", "transform/opacity", tdeb + 0.62, 100)


DEPS = sorted(CARTA["deps"], key=lambda d: d["pct"])
for i, d in enumerate(DEPS):
    d["t0"] = 11.6 if d["code"] == "48" else 12.8 if d["code"] == "ARAN" else 7.6 + i * 0.16
    d["c"] = [d["c"][0], d["c"][1] + DY]

sc = sys.argv[1]

if sc == "s0":  # la composition, le fond, l'écusson
    cmd("comp.new", name=C, width=1080, height=1920, frameRate=30, duration=FIN, background=PETROLE)
    cmd("layer.newSolid", name="Fons", color=PETROLE)
    duree("Fons", 0, FIN)
    with open(DOS + "logo-lo-ligam.svg", "w", encoding="utf-8") as f:
        f.write('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="48 1208 108 108">'
                + CARTA["gabarit"]["logo"] + "</svg>")
    cmd("file.import", paths=[DOS + "logo-lo-ligam.svg"])
    cmd("layer.addItem", item="logo-lo-ligam.svg", time=0, position=[102, 1430])
    cmd("layer.rename", name="Escut")
    cmd("prop.set", layer="Escut", path="transform/scale", value=[18, 18, 100])
    duree("Escut", 0, 30.2)
    pop("Escut", 0.4, 18)

if sc == "s1":  # ouverture : le titre, la traduction
    texte("S1 titol", "QUAL PARLA OCCITAN UÈI ?", 0.2, 15.2, "bounceInWords", box=[90, 300, 900, 200],
          font="Luciole", style="Bold", size=76, fill=BLANC, justify="center", leading=90)
    # drapeau (trois bandes) et traduction
    for k, (col, dx) in enumerate((("#2B3F8F", -11), (BLANC, 0), ("#D8312B", 11))):
        cmd("layer.newShape", kind="rect", name=f"S1 drapeu {k}", size=[11, 26], fill=col, position=[318 + dx, 545])
        duree(f"S1 drapeu {k}", 0.9, 15.2)
    texte("S1 revirada", "Qui parle occitan aujourd’hui ?", 0.9, 15.2, "fadeUpCharacters", position=[345, 556],
          font="Luciole", style="Italic", size=34, fill=BLANC, justify="left")
    frasa("TA FRASA S1", "Ta phrase d’accroche (registre : question directe, comme « Sabètz cossí… ? »)", 1.4, 3.2)

if sc == "s2":  # l'enquête : le domaine, la zone enquêtée
    # aplat plein, la transparence portée par le calque : pas de jours entre les anneaux
    forma("Domeni fons", anels(CARTA["domeni"]), 3.2, 15.2, BLANC)
    cle("Domeni fons", "transform/opacity", 3.2, 0)
    cle("Domeni fons", "transform/opacity", 3.8, 12)
    frasa("TA FRASA S2", "Ta phrase factuelle (registre : qui, quand, combien de personnes)", 3.6, 7.2)

if sc == "s3":  # de 2 % à 62 % : les départements, du plus petit taux au plus grand
    noms = []
    for d in DEPS:
        nom = f"Dep {d['code']}"
        forma(nom, anels(d["d"]), 3.2, 15.2, GAMA[classa(d["pct"])], 100, d["c"])
        cle(nom, "transform/opacity", d["t0"], 0)
        cle(nom, "transform/opacity", d["t0"] + 0.12, 100)
        pop(nom, d["t0"])
        noms.append(nom)
    # la zone enquêtée, d'un seul aplat clair, avant les couleurs
    zona = [r for d in DEPS for r in anels(d["d"])]
    forma("Zona enquestada", zona, 4.2, 15.2, BLANC)
    cle("Zona enquestada", "transform/opacity", 4.2, 0)
    cle("Zona enquestada", "transform/opacity", 5.0, 22)
    cmd("layer.arrange", layers=["Zona enquestada"], to="back")
    cmd("layer.arrange", layers=["Domeni fons"], to="back")
    cmd("layer.arrange", layers=["Fons"], to="back")
    # tout découpé sur le domaine : un précompo, et le domaine en cache
    cmd("layer.precompose", layers=noms + ["Zona enquestada"], name="Carta departaments", mode="move")
    forma("Domeni masca", anels(CARTA["domeni"]), 3.2, 15.2, BLANC, 100)
    cmd("layer.setTrackMatte", layer="Carta departaments", matte="Domeni masca", kind="alpha")
    duree("Carta departaments", 3.2, 15.2)
    # trois noms : pastille de la couleur du département, flèche dessinée
    for code, nom, x, y, L in (("33", "Gironda", 70, 650, (150, 710)), ("48", "Losèra", 760, 690, (760, 760)),
                               ("ARAN", "Val d’Aran", 420, 1300, (430, 1270))):
        d = next(e for e in DEPS if e["code"] == code)
        i = classa(d["pct"])
        w = 118 if d["pct"] < 10 else 172
        t = d["t0"] + 0.3
        pastilha(f"S3 {code}", f"{d['pct']} %", x - 12 + w / 2, y - 19, w, 66, GAMA[i], BRUN if i <= 2 else BLANC, t, 15.2)
        texte(f"S3 {code} nom", nom, t + 0.1, 15.2, "fadeUpCharacters", position=[x, y + 44],
              font="Luciole", style="Bold", size=32, fill=BLANC, justify="left")
        fleca(f"S3 {code} fleca", L, d["c"], t, 15.2, t + 0.15)
        tremol(f"S3 {code} fleca", 0.8)
    frasa("TA FRASA S3", "Ta phrase sur les chiffres (registre : juste les chiffres et les lieux)", 7.4, 15.2)

if sc == "s4":  # parler, comprendre
    for nom, txt, sous, y, fons, tinta, t in (("S4 parlan", "7 %", "parlent occitan", 720, BRIQUE, BLANC, 15.5),
                                              ("S4 comprenon", "15 %", "le comprennent bien", 1080, OR, BRUN, 16.7)):
        cmd("layer.newShape", kind="rounded", name=nom + " fons", size=[860, 300], fill=fons, position=[540, y])
        duree(nom + " fons", t, 20.2)
        pop(nom + " fons", t)
        tremol(nom + " fons", 0.6)
        texte(nom, txt, t + 0.1, 20.2, "bounceInWords", position=[540, y + 10], font="Limelight", style="Regular",
              size=150, fill=tinta, justify="center")
        texte(nom + " sota", sous, t + 0.3, 20.2, "fadeUpCharacters", position=[540, y + 100], font="Luciole",
              style="Bold", size=44, fill=tinta, justify="center")
        cmd("layer.setParent", layers=[nom, nom + " sota"], parent=nom + " fons")
    texte("S4 titol", "DE 15 ANS ET PLUS", 15.3, 20.2, "trackingIn", position=[540, 470], font="Luciole",
          style="Bold", size=50, fill=BLANC, justify="center")
    frasa("TA FRASA S4", "Ta phrase parler / comprendre (registre : une touche d’humour, comme le « còr pelut »)", 17.6, 20.2)

if sc == "s5":  # près de 600 000
    texte("S5 nombre", "600 000", 20.4, 24.2, "bounceInWords", position=[540, 860], font="Limelight", style="Regular",
          size=190, fill=ORC, justify="center")
    texte("S5 sota", "LOCUTEURS", 20.8, 24.2, "trackingIn", position=[540, 980], font="Luciole", style="Bold",
          size=60, fill=BLANC, justify="center")
    pastilha("S5 mejana", "7 % en moyenne", 540, 1110, 520, 80, BRIQUE, BLANC, 21.3, 24.2, 44, "Luciole", "Bold")
    frasa("TA FRASA S5", "Ta phrase sur la moyenne (registre : un constat sec, sans adjectif)", 21.6, 24.2)

if sc == "s6":  # l'âge
    texte("S6 titol", "ET LES JEUNES ?", 24.4, 30.2, "bounceInWords", position=[540, 470], font="Luciole",
          style="Bold", size=64, fill=BLANC, justify="center")
    for nom, haut, bas, y, fons, tinta, t in (("S6 joves", "15-29 ANS", "2 %", 760, CREME, BRUN, 24.9),
                                              ("S6 mejana", "ÂGE MOYEN DES LOCUTEURS", "66 ANS", 1120, BRIQUE, BLANC, 26.2)):
        cmd("layer.newShape", kind="rounded", name=nom + " fons", size=[860, 300], fill=fons, position=[540, y])
        duree(nom + " fons", t, 30.2)
        pop(nom + " fons", t)
        tremol(nom + " fons", 0.6)
        texte(nom + " naut", haut, t + 0.1, 30.2, "fadeUpCharacters", position=[540, y - 60], font="Luciole",
              style="Bold", size=40, fill=tinta, justify="center")
        texte(nom, bas, t + 0.3, 30.2, "bounceInWords", position=[540, y + 80], font="Limelight", style="Regular",
              size=130, fill=tinta, justify="center")
        cmd("layer.setParent", layers=[nom, nom + " naut"], parent=nom + " fons")
    frasa("TA FRASA S6", "Ta question de fin (registre : une question ouverte, sans slogan)", 27.4, 30.2)

if sc == "s7":  # fin : l'écusson et le nom
    cmd("layer.addItem", item="logo-lo-ligam.svg", time=30.2, position=[540, 860])
    cmd("layer.rename", name="S7 escut")
    duree("S7 escut", 30.2, FIN)
    pop("S7 escut", 30.3, 70)
    texte("S7 nom", "Lo Ligam", 30.6, FIN, "blurIn", position=[540, 1180], font="Limelight", style="Regular",
          size=120, fill=BLANC, justify="center")
