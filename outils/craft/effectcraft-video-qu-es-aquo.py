# Génère les commandes EffectCraft de la vidéo « Qu'es aquò » en 9:16, calée sur la voix
# d'origine (131,4 s). Textes occitans de Romain repris tels quels (aquó -> aquò, espace
# après València) ; noms des familles vérifiés par l'API de lo Congrès le 2026-10-12.
# py video.py <scène> > lot.tsv   (une commande par ligne : id<TAB>json)
import json, sys
import os as _os
RAIZ = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..'))  # racine du projet, où qu'il soit
sys.stdout.reconfigure(encoding="utf-8")

C = "Qu'es aquò 9:16"
CANVA = RAIZ + "/design-stock/canva-vf/"
VOIX = RAIZ + "/design-stock/MP4/qu-es-aquo-son.wav"
BRIQUE, OR, ORC, CREME, BRUN, PETROLE, BLANC = "#B53D17", "#EEAF34", "#FFD47F", "#F5EAD8", "#3A2A20", "#1F5F63", "#FFFFFF"

def cmd(i, **p):
    print(i + "\t" + json.dumps(p, ensure_ascii=False))

def duree(nom, t0, t1):
    cmd("layer.timing", layers=[nom], **{"in": t0, "out": t1})

def fond(nom, couleur, t0, t1):
    cmd("layer.newSolid", name=nom, color=couleur)
    duree(nom, t0, t1)

def texte(nom, txt, t0, t1, preset=None, **st):
    cmd("layer.newText", text=txt, name=nom, **st)
    duree(nom, t0, t1)
    if preset:
        cmd("time.set", time=t0)
        cmd("layer.applyTextPreset", layer=nom, preset=preset)

def cle(nom, chemin, t, v):
    cmd("prop.addKey", layer=nom, path=chemin, time=round(t, 3), timeBase="comp", value=v)

def pop(nom, t, final=100):
    cle(nom, "transform/scale", t, [0, 0, 100])
    cle(nom, "transform/scale", t + 0.15, [final * 1.25, final * 1.25, 100])
    cle(nom, "transform/scale", t + 0.3, [final, final, 100])

def trait(nom, d_points, t0, t1, tdeb, tfin, couleur, ep=8):
    """Un tracé (sommets + tangentes, repère de la compo) qui se dessine de tdeb à tfin."""
    v, ti, to = d_points
    cmd("layer.newShape", kind="none", name=nom)
    cmd("shape.newPath", layer=nom, vertices=v, inTangents=ti, outTangents=to, closed=False, space="comp",
        fill=False, stroke=couleur, strokeWidth=ep)
    cmd("prop.set", layer=nom, path="contents/group/contents/stroke/cap", value=1)
    cmd("layer.addShapeItem", layer=nom, kind="trim", group="contents/group")
    cle(nom, "contents/group/contents/trim/end", tdeb, 0)
    cle(nom, "contents/group/contents/trim/end", tfin, 100)
    duree(nom, t0, t1)

def boucle(x, y, k):
    """La flèche à boucle du kit (corps seul), en sommets et tangentes."""
    P = [(10, 40), (120, 60), (80, 55), (225, 110)]
    OUT = [(50, -40), (-15, 45), (20, -35)]
    IN = [(20, -60), (-20, 35), (-45, -80)]
    v = [[x + k * a, y + k * b] for a, b in P]
    to = [[k * a, k * b] for a, b in OUT] + [[0, 0]]
    ti = [[0, 0]] + [[k * a, k * b] for a, b in IN]
    return v, ti, to

def centre(taille, couleur, police="Limelight", style="Regular"):
    return dict(font=police, style=style, size=taille, fill=couleur, justify="center")

sc = sys.argv[1]

if sc == "s1":
    cmd("comp.new", name=C, width=1080, height=1920, frameRate=25, duration=131.4, background=BRIQUE)
    cmd("file.import", paths=[VOIX])
    cmd("layer.addItem", item="qu-es-aquo-son.wav", time=0)
    fond("S1 fond", BRIQUE, 0, 5)
    cmd("layer.addItem", item="D Fil d'or", time=0, position=[540, 820])
    cmd("layer.rename", name="S1 fil")
    cmd("prop.set", layer="S1 fil", path="transform/scale", value=[230, 230, 100])
    cmd("layer.freezeOnLastFrame", layers=["S1 fil"])
    cmd("layer.setSwitch", layers=["S1 fil"], switch="collapse", value=True)
    duree("S1 fil", 0, 5)
    texte("S1 titre", "Lo Ligam", 2.2, 5, "blurIn", position=[540, 1330], **centre(150, BLANC))
    texte("S1 question", "Qu’es aquò ?", 3.0, 5, "fadeUpCharacters", position=[540, 1440], **centre(64, ORC, "Luciole", "Bold"))

if sc == "s2":
    fond("S2 fond", CREME, 5, 16)
    texte("S2 nascut", "Soi nascut a Montpelhièr", 5.3, 16, "fadeUpCharacters", position=[540, 480], **centre(72, BRIQUE))
    for nom, (x, y), t in (("S2 point Montpelhier", (700, 760), 5.6), ("S2 point Valencia", (390, 1170), 10.3)):
        cmd("layer.newShape", kind="ellipse", name=nom, size=[40, 40], fill=BRIQUE, position=[x, y])
        pop(nom, t)
        duree(nom, t, 16)
    texte("S2 etiquette M", "Montpelhièr", 5.8, 16, None, position=[740, 772], font="Luciole", style="Bold", size=40, fill=BRUN, justify="left")
    texte("S2 etiquette V", "València", 10.5, 16, None, position=[430, 1182], font="Luciole", style="Bold", size=40, fill=BRUN, justify="left")
    trait("S2 arc", ([[700, 760], [390, 1170]], [[0, 0], [150, -230]], [[-20, 200], [0, 0]]), 8.0, 16, 8.0, 10.4, OR, 9)
    texte("S2 Valencia", "Soi anat viure a València en 2015", 10.0, 16, "fadeUpCharacters", box=[90, 1300, 900, 260], **centre(66, BRUN))

if sc == "s3":
    fond("S3 fond", OR, 16, 27)
    texte("S3 titre", "Una presa de consciéncia lingüistica en País catalan/valencian", 16.3, 27, "dropInLines",
          box=[80, 500, 920, 520], **centre(80, BRUN))
    texte("S3 besonh", "E un besonh de me tornar ligar amb aquela lenga presenta discretament dins ma familha, que, per ieu, aviá pas encara de nom.",
          20.0, 27, "dropInLines", box=[110, 1060, 860, 420], **centre(46, BRUN, "Luciole"))

if sc == "s4":
    fond("S4 fond", BRIQUE, 27, 48)
    texte("S4 titre", "Un constat", 27.3, 48, "trackingIn", position=[540, 520], **centre(110, BLANC))
    for k, (txt, y, t) in enumerate((("Pauc de contenguts en occitan sus las rets socialas", 640, 29.5),
                                     ("Un interès per la lenga creissent", 860, 33.0),
                                     ("Una enveja d'aprene en partejant mon trajècte", 1010, 36.5))):
        p = f"S4 puntet {k+1}"
        cmd("layer.newShape", kind="ellipse", name=p, size=[22, 22], fill=ORC, position=[130, y + 34])
        pop(p, t)
        duree(p, t, 48)
        texte(f"S4 punt {k+1}", txt, t, 48, "dropInLines", box=[170, y, 820, 200], font="Luciole", size=48, fill=BLANC, justify="left")
    texte("S4 revirada", "L'idèa del compte instagram es nascuda amb l'arribada del traductor automatic Revirada", 41.0, 48, "dropInLines",
          box=[110, 1250, 860, 230], **centre(40, ORC, "Luciole"))

if sc == "s5":
    fond("S5 fond", PETROLE, 48, 52)
    texte("S5 nasquet", "Nasquèt en", 48.2, 52, "fadeUpCharacters", position=[540, 760], **centre(64, BLANC, "Luciole", "Bold"))
    texte("S5 annada", "2022", 48.6, 52, "bounceInWords", position=[540, 1090], **centre(300, OR))

if sc == "s6":
    fond("S6 fond", CREME, 52, 76)
    a = "Es un projècte personal de reapropriacion d'una lenga que m'es cara. Un mejan de partejar amb lo mond aquela lenga polida."
    b = ("E enfin, de n'acabar amb aquela vergonha qu'avèm aguda de parlar, perque nòstra lenga es estada relegada al reng de « patés », "
         "e amb aquela vergonha de saber pas la parlar « corrèctament » davant los locutors natius.")
    texte("S6 a", a, 52.3, 63.5, "dropInLines", box=[110, 540, 860, 640], **centre(54, BRUN, "Luciole"))
    texte("S6 b", b, 63.5, 76, "dropInLines", box=[90, 460, 900, 860], **centre(48, BRUN, "Luciole"))
    for nom, txt, mots in (("S6 a", a, ["projècte personal", "reapropriacion", "partejar"]), ("S6 b", b, ["vergonha"])):
        for m in mots:
            i = txt.find(m)
            while i >= 0:
                cmd("layer.setText", layer=nom, range=[i, i + len(m)], style="Bold", fill=BRIQUE)
                i = txt.find(m, i + 1)
    cmd("layer.addItem", item="C Croix", time=52.0, position=[540, 1380])
    cmd("layer.rename", name="S6 croix")
    cmd("prop.set", layer="S6 croix", path="transform/scale", value=[55, 55, 100])
    cmd("layer.freezeOnLastFrame", layers=["S6 croix"])
    cmd("layer.setSwitch", layers=["S6 croix"], switch="collapse", value=True)
    duree("S6 croix", 52.0, 76)

if sc == "s7":
    for k, (mot, t0, t1, fondc, txtc) in enumerate((("Reapropriacion", 76.0, 80.7, OR, BRUN),
                                                    ("Partatge", 80.7, 85.3, BRIQUE, BLANC),
                                                    ("Cap de vergonha", 85.3, 90.0, BRUN, BLANC))):
        fond(f"S7 fond {k+1}", fondc, t0, t1)
        texte(f"S7 mot {k+1}", mot, t0 + 0.1, t1, "trackingIn", position=[540, 930], **centre(120 if len(mot) < 15 else 108, txtc))
        trait(f"S7 fleche {k+1}", boucle(330, 1010, 1.6), t0, t1, t0 + 0.7, t0 + 1.6, txtc, 9)

if sc == "s8":
    fond("S8 fond", BRIQUE, 90, 95)
    texte("S8 titre", "Concretament", 90.2, 95, "trackingIn", position=[540, 880], **centre(110, BLANC))
    texte("S8 sous", "Qualques exemples", 91.0, 95, "fadeUpCharacters", position=[540, 990], **centre(56, ORC, "Luciole", "Bold"))

if sc == "s9":
    fond("S9 fond", CREME, 95, 119)
    IMGS = [("35-Conta-me-istoria/Drac.png", "Vocabulari", 72), ("34-Conjugason/Conjugason-2.png", "Gramatica", 72),
            ("30-Biaisses-cognitius/Cognitius.png", "Sensibilizacion", 72), ("36-Amor-dAussau/Amor-dAussau.png", "Cultura", 52)]
    cmd("file.import", paths=[CANVA + f for f, _, _ in IMGS], sequence=False)
    for k, (f, fam, ech) in enumerate(IMGS):
        t0 = 95 + k * 6
        nom = f.split("/")[1]
        cmd("layer.addItem", item=nom, time=t0, position=[540, 860])
        nom = f"S9 imatge {k+1}"
        cmd("layer.rename", name=nom)
        cle(nom, "transform/scale", t0, [ech * 0.85, ech * 0.85, 100])
        cle(nom, "transform/scale", t0 + 0.5, [ech, ech, 100])
        cle(nom, "transform/opacity", t0, 0)
        cle(nom, "transform/opacity", t0 + 0.4, 100)
        duree(nom, t0, t0 + 6)
        texte(f"S9 familha {k+1}", fam, t0 + 0.3, t0 + 6, "fadeUpCharacters", position=[540, 1450], **centre(52, BRIQUE, "Luciole", "Bold"))

if sc == "s10":
    fond("S10 fond", PETROLE, 119, 128)
    texte("S10 uei", "Uèi sèm", 119.2, 128, "fadeUpCharacters", position=[540, 640], **centre(64, BLANC, "Luciole", "Bold"))
    texte("S10 nombre", "0 000", 119.6, 128, "bounceInWords", position=[540, 900], **centre(220, OR))
    texte("S10 compte", "sul compte", 120.2, 128, "fadeUpCharacters", position=[540, 1010], **centre(52, BLANC, "Luciole"))
    texte("S10 suita", "e soi plan urós de contribuïr a mon nivèl pichon a far viure la lenga.", 122.0, 128, "dropInLines",
          box=[110, 1120, 860, 320], **centre(46, ORC, "Luciole"))

if sc == "s11":
    fond("S11 fond", BRIQUE, 128, 131.4)
    texte("S11 fin", "A plan lèu sus @lo_ligam !", 128.1, 131.4, "bounceInWords", box=[90, 640, 900, 320], **centre(84, BLANC))
    cmd("layer.addItem", item="D Fil d'or", time=128.2, position=[540, 1220])
    cmd("layer.rename", name="S11 fil")
    cmd("prop.set", layer="S11 fil", path="transform/scale", value=[90, 90, 100])
    cmd("layer.freezeOnLastFrame", layers=["S11 fil"])
    cmd("layer.setSwitch", layers=["S11 fil"], switch="collapse", value=True)
    duree("S11 fil", 128.2, 131.4)
