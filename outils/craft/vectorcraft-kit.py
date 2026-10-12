# Génère les lots de commandes VectorCraft de la planche « Kit Lo Ligam ».
# py kit.py <section> > lot.jsonl
import json, sys
sys.stdout.reconfigure(encoding="utf-8")

def out(tool, **args):
    print(json.dumps({"tool": tool, "args": args}, ensure_ascii=False))

def titre(texte, y):
    out("add_text", text=texte, x=80, y=y, font="Luciole", size=26, color="#3A2A20")
    out("run_command", command="text.setStyle", params={"style": "Bold"})

# Géométrie du logo (app/src/lib/acuelh/simbol.js)
P = [[0, 0], [0, -1], [0.486, -0.797], [0.809, -0.48], [1, 0], [0.809, 0.48], [0.486, 0.797],
     [0, 0.992], [-0.468, 0.797], [-0.786, 0.48], [-0.976, 0.009], [-0.786, -0.48], [-0.468, -0.797]]
BRANCAS = [2, 3, 5, 6, 8, 9, 11, 12]
ARCS = [[12, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [9, 10], [10, 11]]

def croix(cx, cy, r, trait, point, moyeu, ep):
    """La croix-constellation : un seul chemin pour les traits, puis les pastilles."""
    f = lambda i: (cx + r * P[i][0], cy + r * P[i][1])
    d = []
    for i in BRANCAS:
        x, y = f(i)
        d.append(f"M{cx:.2f} {cy:.2f}L{x:.2f} {y:.2f}")
    for a, b in ARCS:
        (ax, ay), (bx, by) = f(a), f(b)
        qx, qy = cx + r * (P[a][0] + P[b][0]) * 0.415, cy + r * (P[a][1] + P[b][1]) * 0.415
        d.append(f"M{ax:.2f} {ay:.2f}Q{qx:.2f} {qy:.2f} {bx:.2f} {by:.2f}")
    out("draw_path", d="".join(d), fill="none", stroke=trait, strokeWidth=ep)
    out("run_command", command="stroke.set", params={"cap": "round", "join": "round"})
    pr = r * 0.11
    for i in range(1, 13):
        x, y = f(i)
        out("draw_shape", shape="ellipse", x=x - pr, y=y - pr, width=2 * pr, height=2 * pr, fill=point, stroke="none")
    mr = r * 0.14
    out("draw_shape", shape="ellipse", x=cx - mr, y=cy - mr, width=2 * mr, height=2 * mr, fill=moyeu, stroke="none")

# Flèches dessinées à la main (dessinées dans une boîte d'environ 230 × 120), corps + pointe
FLECHES = [
    ("boucle", "M10 40C60 0 140 0 120 60C105 105 60 90 80 55C100 20 180 30 225 110", "M225.3 82L225 110L201 95.8"),
    ("arc", "M10 120C0 40 80 0 150 20", "M130.5 0L150 20L123 26.9"),
    ("vague", "M10 60C60 80 90 40 70 15C50 -10 20 30 60 50C100 70 160 40 200 0", "M173 7.2L200 0L192.8 27"),
]

def deplace(d, dx, dy, k=1.0):
    import re
    nums = re.findall(r"[A-Za-z]|-?\d+(?:\.\d+)?", d)
    res, paire = [], 0
    for t in nums:
        if t.isalpha():
            res.append(t); paire = 0
        else:
            v = float(t) * k + (dx if paire % 2 == 0 else dy)
            res.append(f"{v:.1f}"); paire += 1
    s = ""
    for t in res:
        s += t if t.isalpha() else (" " + t if s and not s[-1].isalpha() else t)
    return s

sec = sys.argv[1]

if sec == "palette":
    titre("Couleurs", 290)
    COUL = [("#B53D17", "Brique"), ("#A5342A", "Rouge brique"), ("#EEAF34", "Or"), ("#FFD47F", "Or clair"),
            ("#F5EAD8", "Crème"), ("#3A2A20", "Brun"), ("#3E7CB1", "Bleu ciel"), ("#1F5F63", "Pétrole")]
    for k, (hexa, nom) in enumerate(COUL):
        x = 80 + k * 118
        out("draw_shape", shape="rectangle", x=x, y=320, width=96, height=96, radius=22, fill=hexa,
            stroke="#3A2A20" if hexa == "#F5EAD8" else "none", strokeWidth=1.5)
        out("add_text", text=nom, x=x, y=446, font="Luciole", size=15, color="#3A2A20")
        out("add_text", text=hexa, x=x, y=468, font="Luciole", size=13, color="#7A6A5A")
    out("run_command", command="swatch.newGroup", params={"name": "Lo Ligam", "colors": [c for c, _ in COUL]})

if sec == "fleches":
    titre("Flèches dessinées", 540)
    out("draw_shape", shape="rectangle", x=80, y=565, width=920, height=230, radius=28, fill="#B53D17", stroke="none")
    for k, (nom, corps, pointe) in enumerate(FLECHES):
        dx, dy = 120 + k * 300, 615
        out("draw_path", d=deplace(corps, dx, dy), fill="none", stroke="#FFFFFF", strokeWidth=7)
        out("run_command", command="stroke.set", params={"cap": "round", "join": "round"})
        out("run_command", command="stroke.widthProfile.set", params={"points": [[0, 0.35, 0.35], [0.25, 1, 1], [0.85, 1, 1], [1, 0.75, 0.75]]})
        out("draw_path", d=deplace(pointe, dx, dy), fill="none", stroke="#FFFFFF", strokeWidth=6)
        out("run_command", command="stroke.set", params={"cap": "round", "join": "round"})

if sec == "bloc":
    titre("Bloc de vocabulaire et prononciation", 860)
    out("draw_shape", shape="rectangle", x=80, y=885, width=920, height=380, radius=28, fill="#3E7CB1", stroke="none")
    # pastille croix
    out("draw_shape", shape="ellipse", x=130, y=930, width=64, height=64, fill="#B53D17", stroke="#EEAF34", strokeWidth=3)
    croix(162, 962, 23, "#FFD47F", "#FFD47F", "#EEAF34", 2.2)
    out("add_text", text="Mot en occitan", x=215, y=980, font="Luciole", size=46, color="#FFFFFF")
    out("run_command", command="text.setStyle", params={"style": "Bold"})
    # haut-parleur
    out("draw_path", d=deplace("M0 12L10 12L22 2L22 38L10 28L0 28Z", 140, 1008), fill="#FFFFFF", stroke="none")
    out("draw_path", d=deplace("M29 12C34 16 34 24 29 28M35 6C44 14 44 26 35 34", 140, 1008), fill="none", stroke="#FFFFFF", strokeWidth=3.5)
    out("run_command", command="stroke.set", params={"cap": "round"})
    out("add_text", text="Prononciation", x=215, y=1040, font="Luciole", size=36, color="#FFFFFF")
    # traduction (petit drapeau rond trois bandes)
    out("draw_shape", shape="ellipse", x=144, y=1062, width=34, height=34, fill="#FFFFFF", stroke="none")
    out("draw_path", d="M161 1062A17 17 0 0 0 161 1096L155 1096L155 1062Z", fill="#2B4C9B", stroke="none")
    out("draw_path", d="M161 1062A17 17 0 0 1 161 1096L167 1096L167 1062Z", fill="#D6372B", stroke="none")
    out("add_text", text="Traduction", x=215, y=1090, font="Luciole", size=32, color="#FFD47F")
    # pastille de prononciation
    out("draw_shape", shape="rectangle", x=600, y=1150, width=360, height=84, radius=16, fill="#F5EAD8", stroke="none")
    out("draw_shape", shape="ellipse", x=614, y=1162, width=60, height=60, fill="#EEAF34", stroke="none")
    out("draw_path", d=deplace("M0 12L10 12L22 2L22 38L10 28L0 28Z", 628, 1172), fill="#FFFFFF", stroke="none")
    out("draw_path", d=deplace("M29 12C34 16 34 24 29 28", 628, 1172), fill="none", stroke="#FFFFFF", strokeWidth=3.5)
    out("add_text", text="Prononciation", x=694, y=1204, font="Luciole", size=30, color="#3A2A20")

# ---- Gabarit de publication 4:5, sur le 2e plan de travail (origine x = 1180)
def vocab(x, y, mot, pron, trad):
    out("draw_shape", shape="ellipse", x=x, y=y - 46, width=56, height=56, fill="#B53D17", stroke="#EEAF34", strokeWidth=3)
    croix(x + 28, y - 18, 20, "#FFD47F", "#FFD47F", "#EEAF34", 2)
    out("add_text", text=mot, x=x + 72, y=y, font="Luciole", size=56, color="#FFFFFF")
    out("run_command", command="text.setStyle", params={"style": "Bold"})
    out("draw_path", d=deplace("M0 12L10 12L22 2L22 38L10 28L0 28Z", x + 14, y + 22, 0.85), fill="#FFFFFF", stroke="none")
    out("draw_path", d=deplace("M29 12C34 16 34 24 29 28M35 6C44 14 44 26 35 34", x + 14, y + 22, 0.85), fill="none", stroke="#FFFFFF", strokeWidth=3)
    out("add_text", text=pron, x=x + 72, y=y + 52, font="Luciole", size=40, color="#FFFFFF")
    out("draw_shape", shape="ellipse", x=x + 16, y=y + 72, width=30, height=30, fill="#FFFFFF", stroke="none")
    out("draw_path", d=f"M{x+31} {y+72}A15 15 0 0 0 {x+31} {y+102}L{x+26} {y+102}L{x+26} {y+72}Z", fill="#2B4C9B", stroke="none")
    out("draw_path", d=f"M{x+31} {y+72}A15 15 0 0 1 {x+31} {y+102}L{x+36} {y+102}L{x+36} {y+72}Z", fill="#D6372B", stroke="none")
    out("add_text", text=trad, x=x + 72, y=y + 98, font="Luciole", size=32, color="#FFD47F")

def fleche(k, dx, dy, ech=1.0):
    nom, corps, pointe = FLECHES[k]
    out("draw_path", d=deplace(corps, dx, dy, ech), fill="none", stroke="#FFFFFF", strokeWidth=7)
    out("run_command", command="stroke.set", params={"cap": "round", "join": "round"})
    out("run_command", command="stroke.widthProfile.set", params={"points": [[0, 0.35, 0.35], [0.25, 1, 1], [0.85, 1, 1], [1, 0.75, 0.75]]})
    out("draw_path", d=deplace(pointe, dx, dy, ech), fill="none", stroke="#FFFFFF", strokeWidth=6)
    out("run_command", command="stroke.set", params={"cap": "round", "join": "round"})

if sec == "gabarit":
    O = 1180
    out("run_command", command="select.allOnArtboard", params={"artboard": 1})
    out("run_command", command="edit.clear", params={})
    out("draw_shape", shape="rectangle", x=O, y=0, width=1080, height=1350, fill="#B53D17", stroke="none")
    out("run_command", command="paint.setFill", params={"gradient": {"kind": "linear", "angle": -90, "stops": [
        {"offset": 0, "color": "#C04A1E"}, {"offset": 1, "color": "#8F2D14"}]}})
    out("add_text", text="Titre en occitan", x=O + 540, y=150, font="Limelight", size=88, color="#FFFFFF")
    out("run_command", command="text.setStyle", params={"justify": "center"})
    out("add_text", text="(Traduction)", x=O + 540, y=215, font="Luciole", size=40, color="#FFFFFF")
    out("run_command", command="text.setStyle", params={"justify": "center"})
    # emplacement de l'illustration
    out("draw_shape", shape="rectangle", x=O + 340, y=440, width=520, height=500, radius=40, fill="none", stroke="#FFFFFF", strokeWidth=3)
    out("run_command", command="stroke.set", params={"dash": [14, 12], "cap": "round"})
    out("add_text", text="Illustration", x=O + 600, y=700, font="Luciole", size=34, color="#FFFFFF")
    out("run_command", command="text.setStyle", params={"justify": "center"})
    vocab(O + 110, 330, "Mot 1", "Prononciation", "Traduction")
    fleche(0, O + 470, 330, 1.0)
    vocab(O + 90, 1000, "Mot 2", "Prononciation", "Traduction")
    fleche(2, O + 360, 920, 1.0)
    # logo rond et pastille de prononciation
    out("draw_shape", shape="ellipse", x=O + 50, y=1210, width=104, height=104, fill="#B53D17", stroke="none")
    croix(O + 102, 1262, 38, "#FFFFFF", "#FFD47F", "#EEAF34", 3.2)
    out("draw_shape", shape="rectangle", x=O + 360, y=1222, width=360, height=84, radius=16, fill="#F5EAD8", stroke="none")
    out("run_command", command="paint.setFill", params={"color": "#F5EAD8"})
    out("draw_shape", shape="ellipse", x=O + 374, y=1234, width=60, height=60, fill="#EEAF34", stroke="none")
    out("draw_path", d=deplace("M0 12L10 12L22 2L22 38L10 28L0 28Z", O + 388, 1244), fill="#FFFFFF", stroke="none")
    out("draw_path", d=deplace("M29 12C34 16 34 24 29 28", O + 388, 1244), fill="none", stroke="#FFFFFF", strokeWidth=3.5)
    out("add_text", text="Prononciation", x=O + 454, y=1276, font="Luciole", size=30, color="#3A2A20")

# ---- Gabarits par famille (2026-10-12) : une couleur de fond et une étiquette par famille
def fond(O, h, c1, c2):
    out("draw_shape", shape="rectangle", x=O, y=0, width=1080, height=h, fill=c1, stroke="none")
    out("run_command", command="paint.setFill", params={"gradient": {"kind": "linear", "angle": -90, "stops": [
        {"offset": 0, "color": c1}, {"offset": 1, "color": c2}]}})

def etiquette(O, texte, fondc, textec, y0=56):
    w = 44 + len(texte) * 14
    out("draw_shape", shape="rectangle", x=O + 60, y=y0, width=w, height=50, radius=25, fill=fondc, stroke="none")
    out("add_text", text=texte, x=O + 82, y=y0 + 34, font="Luciole", size=24, color=textec)
    out("run_command", command="text.setStyle", params={"style": "Bold"})

def titre_centre(O, y, texte, taille, couleur, police="Limelight"):
    out("add_text", text=texte, x=O + 540, y=y, font=police, size=taille, color=couleur)
    out("run_command", command="text.setStyle", params={"justify": "center"})

def logo_rond(O, y, anneau="#FFD47F"):
    out("draw_shape", shape="ellipse", x=O + 50, y=y, width=104, height=104, fill="#B53D17", stroke=anneau, strokeWidth=3)
    croix(O + 102, y + 52, 38, "#FFFFFF", "#FFD47F", "#EEAF34", 3.2)

def plan(k, nom, h=1350):
    O = 1180 * k
    if len(sys.argv) > 2:
        out("run_command", command="select.allOnArtboard", params={"artboard": k})
        out("run_command", command="edit.clear", params={})
        return O
    out("run_command", command="artboard.new", params={"x": O, "y": 0, "width": 1080, "height": h, "name": nom})
    return O

if sec == "grammaire":
    O = plan(2, "Grammaire 4:5")
    fond(O, 1350, "#24706F", "#163F42")
    etiquette(O, "Grammaire", "#FFD47F", "#1F5F63")
    titre_centre(O, 210, "Titre en occitan", 84, "#FFFFFF")
    titre_centre(O, 272, "(Traduction)", 40, "#FFFFFF", "Luciole")
    out("draw_shape", shape="rectangle", x=O + 90, y=330, width=900, height=640, radius=28, fill="#F5EAD8", stroke="none")
    for i in range(6):
        y = 330 + 40 + i * 100
        if i:
            out("draw_shape", shape="line", x1=O + 130, y1=y - 18, x2=O + 950, y2=y - 18, stroke="#D9C9AE", strokeWidth=2)
        out("add_text", text=f"Pronom {i+1}", x=O + 140, y=y + 48, font="Luciole", size=40, color="#B53D17")
        out("run_command", command="text.setStyle", params={"style": "Bold"})
        out("add_text", text=f"Forme {i+1}", x=O + 560, y=y + 48, font="Luciole", size=40, color="#3A2A20")
    out("draw_shape", shape="rectangle", x=O + 90, y=1010, width=900, height=150, radius=24, fill="#FFD47F", stroke="none")
    out("add_text", text="À retenir : une règle courte, en une ou deux lignes.", x=O + 130, y=1040, width=820, height=100, font="Luciole", size=34, color="#3A2A20")
    logo_rond(O, 1210)
    out("add_text", text="1/3", x=O + 960, y=1275, font="Luciole", size=30, color="#FFFFFF")

if sec == "culture":
    O = plan(3, "Culture 4:5")
    fond(O, 1350, "#F0B43C", "#FAD994")
    etiquette(O, "Culture et calendrier", "#B53D17", "#FFFFFF")
    out("draw_shape", shape="ellipse", x=O + 860, y=40, width=160, height=160, fill="#B53D17", stroke="#FFFFFF", strokeWidth=4)
    out("add_text", text="24", x=O + 940, y=128, font="Limelight", size=64, color="#FFFFFF")
    out("run_command", command="text.setStyle", params={"justify": "center"})
    out("add_text", text="décembre", x=O + 940, y=166, font="Luciole", size=24, color="#FFD47F")
    out("run_command", command="text.setStyle", params={"justify": "center"})
    titre_centre(O, 300, "Titre en occitan", 84, "#3A2A20")
    titre_centre(O, 362, "(Traduction)", 40, "#3A2A20", "Luciole")
    out("draw_shape", shape="rectangle", x=O + 240, y=420, width=600, height=480, radius=40, fill="none", stroke="#3A2A20", strokeWidth=3)
    out("run_command", command="stroke.set", params={"dash": [14, 12], "cap": "round"})
    titre_centre(O, 672, "Illustration", 34, "#3A2A20", "Luciole")
    out("add_text", text="Un court texte qui raconte la tradition ou l'histoire : deux ou trois lignes, pas plus.", x=O + 110, y=950, width=860, height=180, font="Luciole", size=36, color="#3A2A20")
    out("run_command", command="text.setStyle", params={"justify": "center"})
    logo_rond(O, 1210, "#FFFFFF")

if sec == "sensibilisation":
    O = plan(4, "Sensibilisation 4:5")
    fond(O, 1350, "#3A2A20", "#241913")
    croix(O + 840, 1090, 190, "#4A382C", "#4A382C", "#4A382C", 8)
    etiquette(O, "Sensibilisation", "#EEAF34", "#3A2A20")
    out("add_text", text="«", x=O + 70, y=330, font="Limelight", size=240, color="#EEAF34")
    out("add_text", text="Une phrase forte et courte, qui fait réfléchir.", x=O + 90, y=360, width=900, height=330, font="Limelight", size=76, color="#FFFFFF")
    out("add_text", text="00 %", x=O + 90, y=860, font="Limelight", size=170, color="#EEAF34")
    out("add_text", text="ce que mesure ce chiffre, en une ligne", x=O + 100, y=920, font="Luciole", size=34, color="#F5EAD8")
    out("add_text", text="Source : à préciser", x=O + 100, y=975, font="Luciole", size=24, color="#B8A890")
    logo_rond(O, 1210)

if sec == "video":
    O = plan(5, "Vidéo 9:16", 1920)
    fond(O, 1920, "#C04A1E", "#8F2D14")
    for y, lib in ((250, "au-dessus : masqué par Instagram"), (1500, "en dessous : masqué par Instagram")):
        out("draw_shape", shape="line", x1=O, y1=y, x2=O + 1080, y2=y, stroke="#FFD47F", strokeWidth=2)
        out("run_command", command="stroke.set", params={"dash": [10, 10]})
        out("add_text", text=lib, x=O + 40, y=y + (40 if y > 1000 else -16), font="Luciole", size=24, color="#FFD47F")
    etiquette(O, "Vidéo", "#FFD47F", "#B53D17", 290)
    titre_centre(O, 760, "Titre en occitan", 104, "#FFFFFF")
    titre_centre(O, 840, "(Traduction)", 46, "#FFFFFF", "Luciole")
    fleche(0, O + 420, 900, 1.3)
    out("draw_shape", shape="rectangle", x=O + 290, y=1100, width=500, height=300, radius=36, fill="none", stroke="#FFFFFF", strokeWidth=3)
    out("run_command", command="stroke.set", params={"dash": [14, 12], "cap": "round"})
    titre_centre(O, 1262, "Illustration ou vidéo", 32, "#FFFFFF", "Luciole")
    logo_rond(O, 1330)

if sec == "annonces":
    O = plan(6, "Annonces 4:5")
    fond(O, 1350, "#F5EAD8", "#EADBC0")
    etiquette(O, "Annonce", "#B53D17", "#FFFFFF")
    titre_centre(O, 280, "Titre de l'annonce", 92, "#B53D17")
    titre_centre(O, 345, "Une phrase qui donne envie, en français", 36, "#3A2A20", "Luciole")
    for i, (lib, val) in enumerate((("Quand", "Date et horaire"), ("Où", "En visio"), ("Pour qui", "Niveau, public"))):
        y = 430 + i * 160
        out("draw_shape", shape="rectangle", x=O + 140, y=y, width=800, height=130, radius=24, fill="#FFFFFF", stroke="#B53D17", strokeWidth=3)
        out("draw_shape", shape="ellipse", x=O + 170, y=y + 39, width=52, height=52, fill="#EEAF34", stroke="none")
        out("add_text", text=lib, x=O + 250, y=y + 56, font="Luciole", size=26, color="#B53D17")
        out("run_command", command="text.setStyle", params={"style": "Bold"})
        out("add_text", text=val, x=O + 250, y=y + 98, font="Luciole", size=36, color="#3A2A20")
    out("draw_shape", shape="rectangle", x=O + 340, y=960, width=400, height=96, radius=48, fill="#B53D17", stroke="none")
    titre_centre(O, 1022, "Lien en bio", 38, "#FFFFFF", "Luciole")
    croix(O + 540, 1180, 70, "#B53D17", "#EEAF34", "#EEAF34", 4)
    logo_rond(O, 1210, "#B53D17")
