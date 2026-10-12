# Génère les commandes EffectCraft des options C et D à partir de la géométrie du logo
# (app/src/lib/acuelh/simbol.js). Sortie : une commande par ligne « id<TAB>json ».
import json, sys

P = [[0, 0], [0, -1], [0.486, -0.797], [0.809, -0.48], [1, 0], [0.809, 0.48], [0.486, 0.797],
     [0, 0.992], [-0.468, 0.797], [-0.786, 0.48], [-0.976, 0.009], [-0.786, -0.48], [-0.468, -0.797]]
BRANCAS = [2, 3, 5, 6, 8, 9, 11, 12]
ARCS = [[12, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [9, 10], [10, 11]]
CX = CY = 200
R = 120

def pt(i):
    return [round(CX + R * P[i][0], 2), round(CY + R * P[i][1], 2)]

def branca(i):
    return {"vertices": [pt(0), pt(i)], "inTangents": [[0, 0], [0, 0]], "outTangents": [[0, 0], [0, 0]]}

def arc(a, b):
    pa, pb = pt(a), pt(b)
    # contrôle quadratique (a+b)*0.415 autour du centre, converti en tangentes cubiques
    c = [CX + R * (P[a][0] + P[b][0]) * 0.415, CY + R * (P[a][1] + P[b][1]) * 0.415]
    out_a = [round(2 / 3 * (c[0] - pa[0]), 2), round(2 / 3 * (c[1] - pa[1]), 2)]
    in_b = [round(2 / 3 * (c[0] - pb[0]), 2), round(2 / 3 * (c[1] - pb[1]), 2)]
    return {"vertices": [pa, pb], "inTangents": [[0, 0], in_b], "outTangents": [out_a, [0, 0]]}

def cmd(i, p):
    print(i + "\t" + json.dumps(p, ensure_ascii=False))

def key(layer, path, t, v):
    cmd("prop.addKey", {"layer": layer, "path": path, "time": round(t, 3), "timeBase": "comp", "value": v})

def pop(layer, t, over=130):
    key(layer, "transform/scale", t, [0, 0, 100])
    key(layer, "transform/scale", t + 0.12, [over, over, 100])
    key(layer, "transform/scale", t + 0.22, [100, 100, 100])

mode = sys.argv[1]

if mode == "C":
    cmd("comp.new", {"name": "C Croix", "width": 400, "height": 400, "frameRate": 60, "duration": 1.3, "background": "#F5EAD8"})
    cmd("layer.newShape", {"kind": "none", "name": "Traits"})
    for i in BRANCAS:
        cmd("shape.newPath", {"layer": "Traits", **branca(i), "closed": False, "space": "comp", "fill": False, "stroke": "#B53D17", "strokeWidth": 5.4})
    for a, b in ARCS:
        cmd("shape.newPath", {"layer": "Traits", **arc(a, b), "closed": False, "space": "comp", "fill": False, "stroke": "#B53D17", "strokeWidth": 6})
    cmd("layer.newShape", {"kind": "ellipse", "name": "Centre", "size": [30, 30], "fill": "#EEAF34", "position": pt(0)})
    pop("Centre", 0.0)
    for n in range(1, 13):
        cmd("layer.newShape", {"kind": "ellipse", "name": f"P{n}", "size": [22, 22], "fill": "#EEAF34", "position": pt(n)})
        pop(f"P{n}", 0.45 + (n - 1) * 0.035)

if mode == "D":
    cmd("comp.new", {"name": "D Fil d'or", "width": 400, "height": 400, "frameRate": 60, "duration": 2.4, "background": "#B53D17"})
    cmd("layer.newShape", {"kind": "rounded", "name": "Fond", "size": [400, 400], "fill": "#B53D17", "position": [200, 200]})
    cmd("layer.newShape", {"kind": "none", "name": "Fil"})
    # le fil part du centre et dessine les branches dans le sens des aiguilles d'une montre,
    # chaque arc suit la branche qui le touche
    ordre = []
    for i in BRANCAS:
        ordre.append(("b", i))
    for a, b in ARCS:
        ordre.append(("a", (a, b)))
    for kind, v in ordre:
        geo = branca(v) if kind == "b" else arc(*v)
        cmd("shape.newPath", {"layer": "Fil", **geo, "closed": False, "space": "comp", "fill": False, "stroke": "#EEAF34", "strokeWidth": 5})
    cmd("layer.newShape", {"kind": "ellipse", "name": "Moyeu", "size": [32, 32], "fill": "#EEAF34", "position": pt(0)})
    pop("Moyeu", 0.0, 120)
    for n in range(1, 13):
        cmd("layer.newShape", {"kind": "ellipse", "name": f"Q{n}", "size": [22, 22], "fill": "#FFD47F", "position": pt(n)})
