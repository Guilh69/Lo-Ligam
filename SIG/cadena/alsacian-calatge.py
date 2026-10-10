# Alsacian e francic : calatge automatic d'una carta imatge (Wikimedia
# Commons) sus las limits administrativas vertadièras, puèi color de la carta
# jos cada comuna.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-calatge.py rf|alem
#
# Metòde : los pixèls de las limits dessenhadas sus la carta (color donada)
# son aparelhats als ponches de las limits vertadièras (frontièras, Länder e
# Kreise alemands, departaments franceses, cantons suïsses, Luxemborg), en
# projeccion LAEA (EPSG:3035). Partissèm d'un calatge aproximatiu (tres o
# quatre ponches legits a la man) e l'afinam per ICP (afinitat, mendres
# carrats, 20 % dels parelhs los pus luènhs daissats a cada pas).
# Puèi, per cada comuna (ponch interior), la color de la carta ; se lo pixèl
# es un trait (limit, flume, tèxte), la classa del pixèl acolorit pus pròche.
#
# Entradas : SIG/brut/alsacian/fonts/<carta> ; SIG/brut/alsacian/{fr? ,de,ch,lu,be}-comunas.geojson
# Sortida : SIG/brut/alsacian/calatge-<carta>.csv (codi ; classa ; dist_px ; dist_km)
#           e calatge-<carta>.json (afinitat, escarts).
import csv, json, math, os, sys
import numpy as np
from scipy import ndimage
from scipy.spatial import cKDTree
from osgeo import gdal, ogr, osr

gdal.UseExceptions(); ogr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
BRUT = os.path.join(R, 'SIG', 'brut', 'alsacian')
FONTS = os.path.join(BRUT, 'fonts')
SP = os.environ.get('SCRATCH', BRUT)

CARTAS = {
    # Rheinischer Fächer, Hans Erren (2021), CC BY-SA 3.0
    'rf': {
        'imatge': 'Rheinischer_faecher.png',
        'trait': [(0x50, 0x50, 0x50)],
        'classas': {'#ffff90': 'nordniederfrankisch', '#c0ff60': 'sudniederfrankisch', '#70a0ff': 'ripuarisch',
                    '#a0a0ff': 'moselfrankisch_nord', '#7070ff': 'moselfrankisch_sud', '#c890ff': 'rheinfrankisch',
                    '#8080ff': 'moselfrankisch_nord', '#a0c0ff': 'ripuarisch'},
        'fons': ['#ffffff', '#0000ff'],
        # ponches aproximatius (pixèl x, y) -> (lon, lat) : Speyer, Benrath, Schengen (tripònch)
        'gcp': [((486, 597), (8.431, 49.317)), ((306, 195), (6.876, 51.163)), ((210, 552), (6.367, 49.469)), ((403, 417), (7.711, 50.152))],
        'comunas': ['de', 'lu', 'be', 'fr'],
    },
    # Alemannic-Dialects-Map-German.svg (Pyrokrat 2010, d'aprèp Sémhur), CC BY-SA 3.0, rasterizada per alsacian-svg-png.py
    # jaces « zone » e « region » rasterizats a part (alsacian-alem-svg.mjs, 3829 x 2687 px)
    'alem': {
        'imatge': 'alem-zonas.png',
        'imatge_trait': 'alem-limits.png',
        'trait': [(0x64, 0x64, 0x64), (0x65, 0x65, 0x65)],
        'classas': {'#c7feff': 'schwabisch', '#9bf4ff': 'oberrheinalemannisch', '#59ebff': 'bodenseealemannisch',
                    '#00ccf4': 'hochalemannisch', '#00aadc': 'hochstalemannisch', '#a5ffb1': 'bairisch',
                    '#55ff68': 'nordoberdeutsch', '#00ec1b': 'mitteldeutsch', '#feabab': 'oil', '#fc8c8c': 'francoprovencal',
                    '#fff323': 'galloitalic', '#fbda1e': 'retoroman'},
        'fons': ['#ffffff'],
        # centres dels lacs (taças blancas del jaç « riviere ») -> centres OFS (LV95)
        'gcp_lv95': [((742.8, 2142.5), (2530004, 1141088)), ((919.7, 1826.8), (2555641, 1194882)), ((1779.2, 2461.6), (2694163, 1091453)),
                     ((1697.2, 1782.8), (2677513, 1205069)), ((1817.9, 1613.5), (2693635, 1233392)), ((1933.5, 2442.3), (2720339, 1095096)),
                     ((1339.6, 1968.7), (2621592, 1171267)), ((1463.1, 1948.1), (2640699, 1175058)), ((1066.6, 1706.1), (2578589, 1213934)),
                     ((1038.2, 1805.3), (2572883, 1197797)), ((2056.7, 1694.7), (2734135, 1220804))],
        'gcp': [],
        'icp': {'iter': 0},
        'comunas': ['de', 'ch', 'fr'],
    },
}
nom = sys.argv[1]
K = CARTAS[nom]
if len(sys.argv) > 2:
    K.update(json.load(open(sys.argv[2], encoding='utf-8')))

def srs(e):
    s = osr.SpatialReference(); s.ImportFromEPSG(e); s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER); return s
WGS, L93, LAEA, UTM = srs(4326), srs(2154), srs(3035), srs(25832)
T = lambda a, b: osr.CoordinateTransformation(a, b)

# ---------- limits vertadièras (cache) ----------
CACHE = os.path.join(BRUT, 'limits-ref-laea.npy')
def densificar(g, pas=250.0):
    out = []
    def linha(l):
        pts = np.array(l.GetPoints())[:, :2]
        for a, b in zip(pts[:-1], pts[1:]):
            n = max(1, int(math.hypot(*(b - a)) / pas))
            for k in range(n):
                out.append(a + (b - a) * k / n)
    def rec(x):
        t = ogr.GT_Flatten(x.GetGeometryType())
        if t in (ogr.wkbLineString, ogr.wkbLinearRing):
            linha(x)
        else:
            for i in range(x.GetGeometryCount()):
                rec(x.GetGeometryRef(i))
    rec(g)
    return out
if not os.path.exists(CACHE):
    pts = []
    vg = ogr.Open(os.path.join(BRUT, 'de', 'vg250-ew_12-31.utm32s.gpkg.ebenen', 'vg250-ew_ebenen_1231', 'DE_VG250.gpkg'))
    ly = vg.GetLayerByName('vg250_krs'); ly.SetAttributeFilter('GF = 4')
    for f in ly:
        g = f.GetGeometryRef().Clone(); g.Transform(T(UTM, LAEA)); pts += densificar(g.Boundary())
    gp = ogr.Open(os.path.join(R, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
    ly = gp.GetLayerByName('departement')
    ly.SetAttributeFilter("code_insee IN ('08','51','52','54','55','57','67','68','88','90','25','39','70','01','74','73','21','10','02','59')")
    for f in ly:
        g = f.GetGeometryRef().Clone(); g.Transform(T(L93, LAEA)); pts += densificar(g.Boundary())
    for pais, camp in (('lu', None), ('ch', 'unitat')):
        gj = ogr.Open(os.path.join(BRUT, pais + '-comunas.geojson'))
        grop = {}
        for f in gj.GetLayer(0):
            k = f.GetField(camp) if camp else 'tot'
            g = f.GetGeometryRef().Clone().Buffer(0)
            grop[k] = g if k not in grop else grop[k].Union(g)
        for g in grop.values():
            g.Transform(T(WGS, LAEA)); pts += densificar(g.Boundary())
    np.save(CACHE, np.array(pts))
REF = np.load(CACHE)
arbre = cKDTree(REF)
print('limits vertadièras : %d ponches' % len(REF))

# ---------- imatge ----------
def legir(n):
    return gdal.Open(os.path.join(SP if not os.path.exists(os.path.join(FONTS, n)) else FONTS, n)).ReadAsArray()
def codis(im):
    a = im[:3].transpose(1, 2, 0).astype(np.int64)
    return a[:, :, 0] * 65536 + a[:, :, 1] * 256 + a[:, :, 2]
img = legir(K['imatge'])
cod = codis(img)
H, W = cod.shape
cod_t = codis(legir(K['imatge_trait'])) if K.get('imatge_trait') else cod
trait = np.zeros((H, W), bool)
for r, g, b in K['trait']:
    trait |= cod_t == (r * 65536 + g * 256 + b)
py, px = np.nonzero(trait)
P = np.c_[px + 0.5, py + 0.5]
print('pixèls de trait : %d' % len(P))

def a_laea(lon, lat):
    p = ogr.Geometry(ogr.wkbPoint); p.AddPoint_2D(lon, lat); p.Transform(T(WGS, LAEA)); return p.GetX(), p.GetY()
LV95 = srs(2056)
for (px_, py_), (e, n) in K.get('gcp_lv95', []):
    p = ogr.Geometry(ogr.wkbPoint); p.AddPoint_2D(e, n); p.Transform(T(LV95, WGS))
    K['gcp'].append(((px_, py_), (p.GetX(), p.GetY())))
G = np.array([[x, y] for (x, y), _ in K['gcp']], float)
Q = np.array([a_laea(*ll) for _, ll in K['gcp']])
def afin(P, Q):
    A, *_ = np.linalg.lstsq(np.c_[P, np.ones(len(P))], Q, rcond=None); return A
apl = lambda A, P: np.c_[P, np.ones(len(P))] @ A
A = afin(G, Q)
res0 = np.hypot(*(apl(A, G) - Q).T)
print('calatge inicial : escarts als ponches legits %s km' % ', '.join('%.1f' % (r / 1000) for r in res0))
# ICP : parelhs trait / limit vertadièra pus pròcha ; los 20 % pus luènhs daissats,
# e (se « dmax ») los parelhs de mai de dmax mètres ; los ponches legits gardan
# un pes (« pes_gcp » còps) per que lo calatge se'n alonhe pas.
icp = K.get('icp', {'iter': 80})
for it in range(icp['iter']):
    d, j = arbre.query(apl(A, P))
    k = d <= np.percentile(d, 80)
    if icp.get('dmax'):
        k &= d <= icp['dmax']
    w = icp.get('pes_gcp', 0)
    A = afin(np.vstack([P[k]] + [G] * w), np.vstack([REF[j[k]]] + [Q] * w))
d, j = arbre.query(apl(A, P))
print('ICP : distància mediana dels traits a las limits %.2f km, 80 %% %.2f km, 95 %% %.2f km' % (np.median(d) / 1000, np.percentile(d, 80) / 1000, np.percentile(d, 95) / 1000))
res1 = np.hypot(*(apl(A, G) - Q).T)
print('ponches legits aprèp ICP : %s km' % ', '.join('%.1f' % (r / 1000) for r in res1))
kmpx = math.hypot(A[0, 0], A[0, 1]) / 1000
print('escala : %.3f km per pixèl' % kmpx)
M = A[:2].T; Minv = np.linalg.inv(M)
# contraròtle visual : las limits vertadièras en roge sus la carta
if os.environ.get('SUSPAUSAR'):
    q = (REF - A[2]) @ Minv.T
    ok = (q[:, 0] >= 0) & (q[:, 0] < W) & (q[:, 1] >= 0) & (q[:, 1] < H)
    b = img[:3].copy()
    b[0, q[ok, 1].astype(int), q[ok, 0].astype(int)] = 255
    b[1, q[ok, 1].astype(int), q[ok, 0].astype(int)] = 0
    b[2, q[ok, 1].astype(int), q[ok, 0].astype(int)] = 0
    out = gdal.GetDriverByName('MEM').Create('', W, H, 3, gdal.GDT_Byte)
    for i in range(3): out.GetRasterBand(i + 1).WriteArray(b[i])
    gdal.GetDriverByName('PNG').CreateCopy(os.environ['SUSPAUSAR'], out)
    print('susposicion :', os.environ['SUSPAUSAR'])

# ---------- classas ----------
cls = np.full((H, W), -1, np.int32)
noms = sorted(set(K['classas'].values()))
for h, n in K['classas'].items():
    v = int(h[1:], 16)
    cls[cod == v] = noms.index(n)
fons = np.zeros((H, W), bool)
for h in K['fons']:
    fons |= cod == int(h[1:], 16)
# etiqueta de cada pixèl : classa (>= 0), fons (-2) ; los traits (-1) prenon
# l'etiqueta del pixèl pas trait pus pròche (classa o fons).
lab = cls.copy()
lab[fons & (cls < 0)] = -2
_, (iy, ix) = ndimage.distance_transform_edt(lab == -1, return_indices=True)
lab_tot = lab[iy, ix]
dist_c, (iy2, ix2) = ndimage.distance_transform_edt(cls < 0, return_indices=True)
cls_pp = cls[iy2, ix2]  # classa pus pròcha (per lo fons)

def etiqueta(lon, lat):
    x, y = a_laea(lon, lat)
    q = Minv @ (np.array([x, y]) - A[2])
    i, j = int(q[0]), int(q[1])
    if not (0 <= i < W and 0 <= j < H):
        return None
    return int(lab_tot[j, i]), int(cls_pp[j, i]), float(dist_c[j, i] * kmpx)

linhas, compte, fora = [], {}, 0
for pais in K['comunas']:
    f = os.path.join(BRUT, ('comunas-fr' if pais == 'fr' else pais + '-comunas') + '.geojson')
    ds = ogr.Open(f)
    for ft in ds.GetLayer(0):
        codi = ft.GetField('codi')
        if pais == 'fr' and ft.GetField('dep') not in ('57', '67', '68'):
            continue
        g = ft.GetGeometryRef()
        # escapolons : lo ponch interior e una grasilha de ponches dins la comuna
        pt = g.PointOnSurface()
        mostras = [(pt.GetX(), pt.GetY())]
        x0, x1, y0, y1 = g.GetEnvelope()
        n = 7
        for a_ in range(n):
            for b_ in range(n):
                x = x0 + (a_ + 0.5) * (x1 - x0) / n; y = y0 + (b_ + 0.5) * (y1 - y0) / n
                p = ogr.Geometry(ogr.wkbPoint); p.AddPoint_2D(x, y)
                if g.Contains(p):
                    mostras.append((x, y))
        e0 = etiqueta(*mostras[0])
        if e0 is None:
            linhas.append((codi, 'fora_carta', '', '', '')); fora += 1; continue
        parts = {}
        for m in mostras:
            e = etiqueta(*m)
            if e is None: continue
            k = 'fons' if e[0] == -2 else noms[e[0]]
            parts[k] = parts.get(k, 0) + 1
        tot = sum(parts.values())
        maj = max(parts, key=lambda k: (parts[k], k == ('fons' if e0[0] == -2 else noms[e0[0]])))
        txt = ' '.join('%s:%.2f' % (k, v / tot) for k, v in sorted(parts.items(), key=lambda z: -z[1]))
        vesina = noms[e0[1]] if maj == 'fons' else ''
        linhas.append((codi, maj, txt, vesina, round(e0[2], 1)))
        compte[maj] = compte.get(maj, 0) + 1
with open(os.path.join(BRUT, 'calatge-%s.csv' % nom), 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';'); w.writerow(['codi', 'classa', 'parts', 'classa_vesina', 'dist_km']); w.writerows(linhas)
json.dump({'carta': K['imatge'], 'afinitat': A.tolist(), 'km_per_pixel': kmpx, 'mediana_km': float(np.median(d) / 1000),
           'p95_km': float(np.percentile(d, 95) / 1000), 'gcp_escarts_km': [float(r / 1000) for r in res1]},
          open(os.path.join(BRUT, 'calatge-%s.json' % nom), 'w'), indent=1)
print('comunas : %s ; fòra de la carta : %d' % (', '.join('%s %d' % x for x in sorted(compte.items())), fora))
