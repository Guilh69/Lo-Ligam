# Alsacian e francic : la carta « Sprachen in Elsass-Lothringen » (Wikimedia
# Commons, Furfur, 2023, CC BY-SA 3.0, d'aprèp « Alsace-Lorraine
# Dialectes-Fr.png », Rosss, 2010, domeni public, que se fonda sus las cartas
# del Digitaler Wenker-Atlas e sus Constant This, 1886-1887) es dessenhada
# comuna per comuna. Aqueste programa recampa sos poligònes amb las comunas
# IGN : calatge afin (ICP sus los centres, puèi un calatge per departament,
# las tres cartas departamentalas de la font son estadas jostadas a la man),
# puèi part de la susfàcia de cada comuna dins cada color de la carta.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-svg.py
#
# Entradas : SIG/brut/alsacian/fonts/Sprachen_in_Elsass-Lothringen.svg ;
#            SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg (comunas 57, 67, 68).
# Sortida : SIG/brut/alsacian/svg-comunas.csv (insee ; classa majoritària ;
#           parts ; regas = comuna regada dins la font ; distància del calatge).
import csv, math, os, re
import numpy as np
from scipy.spatial import cKDTree
from osgeo import ogr

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SVG = os.path.join(R, 'SIG', 'brut', 'alsacian', 'fonts', 'Sprachen_in_Elsass-Lothringen.svg')
GPKG = os.path.join(R, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg')
SORTIDA = os.path.join(R, 'SIG', 'brut', 'alsacian', 'svg-comunas.csv')

COLOR = {'#5E2784': 'moselfrankisch', '#355CA7': 'rheinfrankisch', '#3E76BB': 'pfalzisch',
         '#37AD60': 'elsassisch', '#148035': 'hochalemannisch', '#F07E4D': 'lothringisch', '#EF7F9F': 'frainc_comtou'}

s = open(SVG, encoding='utf-8').read()
estil = dict(re.findall(r'\.(st\d+)\{([^}]*)\}', s))
def color(cl):
    m = re.search(r'fill:(#[0-9A-Fa-f]{6})', estil.get(cl, ''))
    return m.group(1).upper() if m else None
def contorn(cl):  # poligòne amb un trait blanc = comuna ; sens trait = regas
    return 'stroke:#FFFFFF' in estil.get(cl, '')

def camin(d):  # M, L, H, V, C, Z (absoluts e relatius) -> ponches
    tok = re.findall(r'[MmLlHhVvCcSsZz]|-?\d*\.?\d+(?:e-?\d+)?', d)
    pts, x, y, i, cmd = [], 0.0, 0.0, 0, None
    while i < len(tok):
        t = tok[i]
        if re.match(r'[A-Za-z]', t):
            cmd = t; i += 1
            if cmd in 'Zz':
                continue
        n = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4}[cmd.upper()]
        v = [float(z) for z in tok[i:i + n]]; i += n
        rel = cmd.islower()
        if cmd.upper() == 'H':
            x = x + v[0] if rel else v[0]
        elif cmd.upper() == 'V':
            y = y + v[0] if rel else v[0]
        else:
            x, y = (x + v[-2], y + v[-1]) if rel else (v[-2], v[-1])
        pts.append((x, y))
        if cmd == 'M': cmd = 'L'
        elif cmd == 'm': cmd = 'l'
    return pts

pols = []  # (classa, color, es_comuna, ponches)
for cl, p in re.findall(r'<polygon class="(st\d+)" points="([^"]+)"', s):
    n = [float(z) for z in re.split(r'[\s,]+', p.strip())]
    pols.append((cl, color(cl), contorn(cl), list(zip(n[0::2], n[1::2]))))
for cl, d in re.findall(r'<path class="(st\d+)" d="([^"]+)"', s):
    pols.append((cl, color(cl), contorn(cl), camin(d)))
pols = [p for p in pols if len(p[3]) >= 3 and min(y for _, y in p[3]) > 480]  # sens la legenda

def aire_centre(pts):
    a = np.array(pts); x, y = a[:, 0], a[:, 1]
    x1, y1 = np.roll(x, -1), np.roll(y, -1)
    c = x * y1 - x1 * y
    A = c.sum() / 2
    if abs(A) < 1e-9:
        return 0, x.mean(), y.mean()
    return abs(A), ((x + x1) * c).sum() / (6 * A), ((y + y1) * c).sum() / (6 * A)

com = [p for p in pols if p[2] and p[1] in COLOR]
print('Poligònes : %d, de comunas acolorits : %d' % (len(pols), len(com)))
for k in sorted(set(COLOR.values())):
    print('  %-16s %d' % (k, sum(1 for p in com if COLOR[p[1]] == k)))
S = np.array([aire_centre(p[3]) for p in com])  # aire, cx, cy (SVG)

# comunas IGN
gp = ogr.Open(GPKG)
cl_ = gp.GetLayerByName('commune')
cl_.SetAttributeFilter("code_insee_du_departement IN ('57', '67', '68')")
comunas = []
for f in cl_:
    g = f.GetGeometryRef().Clone()
    c = g.Centroid()
    comunas.append({'insee': f.GetField('code_insee'), 'nom': f.GetField('nom_officiel'), 'dep': f.GetField('code_insee_du_departement'),
                    'g': g, 'x': c.GetX(), 'y': c.GetY(), 'a': g.GetArea()})
C = np.array([[c['x'], c['y']] for c in comunas])
dep = np.array([c['dep'] for c in comunas])
print('Comunas IGN : %d' % len(comunas))

def afin(P, Q):  # Q ~ [P 1] @ A
    M = np.c_[P, np.ones(len(P))]
    A, *_ = np.linalg.lstsq(M, Q, rcond=None)
    return A
def apl(A, P):
    return np.c_[P, np.ones(len(P))] @ A

# calatge inicial : encastres
sx0, sy0, sx1, sy1 = S[:, 1].min(), S[:, 2].min(), S[:, 1].max(), S[:, 2].max()
X0, Y0, X1, Y1 = C[:, 0].min(), C[:, 1].min(), C[:, 0].max(), C[:, 1].max()
A = np.array([[(X1 - X0) / (sx1 - sx0), 0], [0, -(Y1 - Y0) / (sy1 - sy0)], [X0 - sx0 * (X1 - X0) / (sx1 - sx0), Y1 + sy0 * (Y1 - Y0) / (sy1 - sy0)]])
arbre = cKDTree(C)
def icp(A, idx, n=60):
    for it in range(n):
        T = apl(A, S[idx, 1:])
        d, j = arbre.query(T)
        lim = np.percentile(d, 80)
        k = d <= lim
        A = afin(S[idx, 1:][k], C[j[k]])
    T = apl(A, S[idx, 1:]); d, j = arbre.query(T)
    return A, d, j
tot = np.arange(len(S))
A, d, j = icp(A, tot)
print('ICP global : distància mediana %.0f m, 90 %% %.0f m' % (np.median(d), np.percentile(d, 90)))
# un calatge per departament (las tres cartas son estadas jostadas)
Adep = {}
for it in range(3):
    T = apl(A, S[:, 1:]) if it == 0 else np.vstack([apl(Adep[dep_s[i]], S[i:i + 1, 1:]) for i in range(len(S))])
    dd, jj = arbre.query(T)
    dep_s = dep[jj]
    for D in ('57', '67', '68'):
        idx = np.nonzero(dep_s == D)[0]
        Adep[D], dD, _ = icp(Adep.get(D, A), idx, 40)
        print('  pas %d, %s : %d poligònes, distància mediana %.0f m, 90 %% %.0f m' % (it, D, len(idx), np.median(dD), np.percentile(dD, 90)))
for D in ('57', '67', '68'):
    a = Adep[D]
    print('  %s : escala x %.1f m/px, y %.1f m/px, cisalhament %.3f %.3f' % (D, math.hypot(a[0, 0], a[0, 1]), math.hypot(a[1, 0], a[1, 1]), a[0, 1], a[1, 0]))

# poligònes de la carta en Lambert 93 (calatge de lor departament)
def ogrpol(pts, A):
    q = apl(A, np.array(pts))
    r = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in q:
        r.AddPoint_2D(float(x), float(y))
    r.AddPoint_2D(float(q[0, 0]), float(q[0, 1]))
    g = ogr.Geometry(ogr.wkbPolygon); g.AddGeometry(r)
    return g.MakeValid() if not g.IsValid() else g
T = np.vstack([apl(Adep[dep_s[i]], S[i:i + 1, 1:]) for i in range(len(S))])
geo = []  # (classa, geometria, encastre)
for i, p in enumerate(com):
    g = ogrpol(p[3], Adep[dep_s[i]])
    geo.append((COLOR[p[1]], g, g.GetEnvelope()))
# regas (comunas mixtas) : contorns sens emplenatge (trait blanc, fill none) e regas de color
_, dsr = None, None
regas_contorn = [p for p in pols if p[1] is None and 'stroke:#FFFFFF' in estil.get(p[0], '')]
regas = [p for p in pols if not p[2] and p[1] in COLOR]
def dep_de(pts):
    a, cx, cy = aire_centre(pts)
    return dep_s[np.argmin(np.hypot(S[:, 1] - cx, S[:, 2] - cy))]
geo_regas = []
for p in regas:
    g = ogrpol(p[3], Adep[dep_de(p[3])])
    geo_regas.append((COLOR[p[1]], g, g.GetEnvelope()))
print('Regas : %d contorns, %d regas de color' % (len(regas_contorn), len(regas)))

def dins(e, f):
    return not (e[1] < f[0] or e[0] > f[1] or e[3] < f[2] or e[2] > f[3])
linhas = []
for c in comunas:
    g, e = c['g'], c['g'].GetEnvelope()
    parts = {}
    for k, h, f in geo:
        if dins(e, f):
            x = g.Intersection(h)
            if x is not None and not x.IsEmpty():
                parts[k] = parts.get(k, 0) + x.GetArea()
    rg = {}
    for k, h, f in geo_regas:
        if dins(e, f):
            x = g.Intersection(h)
            if x is not None and not x.IsEmpty():
                rg[k] = rg.get(k, 0) + x.GetArea()
    cub = sum(parts.values()) / c['a']
    maj = max(parts, key=parts.get) if parts else ''
    linhas.append([c['insee'], c['nom'], c['dep'], maj,
                   ' '.join('%s:%.2f' % (k, v / c['a']) for k, v in sorted(parts.items(), key=lambda z: -z[1])),
                   ' '.join('%s:%.3f' % (k, v / c['a']) for k, v in sorted(rg.items(), key=lambda z: -z[1])),
                   '%.2f' % cub])
with open(SORTIDA, 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['insee', 'nom', 'dep', 'classa', 'parts', 'regas', 'cubertura'])
    w.writerows(linhas)
from collections import Counter
print('Classas majoritàrias :', Counter(l[3] for l in linhas))
print('Comunas mal cubèrtas (< 0,8) : %d' % sum(1 for l in linhas if float(l[6]) < 0.8))
print('Comunas partejadas (classa majoritària < 0,8) : %d' % sum(1 for l in linhas if l[4] and float(l[4].split()[0].split(':')[1]) < 0.8))
