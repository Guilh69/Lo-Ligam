# Complète limits-carta.json avec TOUS les départements et régions de France
# (Romain, 2026-10-24 : « il faut l'ensemble des départements français ») ;
# avant, seuls ceux qui touchaient la zone étaient gardés (75 sur 96).
# Même format que l'existant : [code, nom, anneaux], coordonnées à 3 décimales,
# simplification Douglas-Peucker légère. Les entrées déjà là ne bougent pas.
# Sources : app/static/data/departements.geojson et SIG/brut/regions.geojson (Etalab).
import json, os, sys
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LIM = os.path.join(RAIZ, 'app/static/data/limits-carta.json')
TOL = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0015

def dp(pts, tol):
    if len(pts) < 4: return pts
    def d(p, a, b):
        (x, y), (x1, y1), (x2, y2) = p, a, b
        dx, dy = x2 - x1, y2 - y1
        if dx == dy == 0: return ((x - x1) ** 2 + (y - y1) ** 2) ** .5
        t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
        return ((x - x1 - t * dx) ** 2 + (y - y1 - t * dy) ** 2) ** .5
    garda = [False] * len(pts); garda[0] = garda[-1] = True
    pila = [(0, len(pts) - 1)]
    while pila:
        i, j = pila.pop()
        m, k = 0, None
        for n in range(i + 1, j):
            v = d(pts[n], pts[i], pts[j])
            if v > m: m, k = v, n
        if k is not None and m > tol:
            garda[k] = True; pila += [(i, k), (k, j)]
    return [p for p, g in zip(pts, garda) if g]

def anels(geom):
    polys = geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]
    out = []
    for p in polys:
        r = dp(p[0], TOL)  # anneau extérieur seul, comme l'existant
        r = [[round(x, 3), round(y, 3)] for x, y in r]
        r = [q for i, q in enumerate(r) if i == 0 or q != r[i - 1]]
        if len(r) >= 4: out.append(r)
    return out

lim = json.load(open(LIM, encoding='utf-8'))
apondut = []
for clau, font in (('despartaments', 'app/static/data/departements.geojson'), ('regions', 'SIG/brut/regions.geojson')):
    g = json.load(open(os.path.join(RAIZ, font), encoding='utf-8'))
    a = {x[0] for x in lim[clau]}
    for f in g['features']:
        c, n = f['properties']['code'], f['properties']['nom']
        if c in a: continue
        lim[clau].append([c, n, anels(f['geometry'])]); apondut.append((clau, c, n))
    lim[clau].sort(key=lambda x: x[0])
json.dump(lim, open(LIM, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(apondut), 'ajoutés :', ', '.join(f'{c} {n}' for _, c, n in apondut))
print('départements', len(lim['despartaments']), '· régions', len(lim['regions']))
