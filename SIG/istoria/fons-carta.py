# Lo Ligam : fond de la carte de « Mon ligam amb l'occitan » (Romain, 2026-11-05 :
# « une carte à l'échelle qui permette de naviguer entre Paris, Montpellier et
# Valencia, Barcelone… des zooms et dézooms selon l'endroit de l'histoire »).
#
# Sortie : app/src/lib/istoria/carta-fons.js, des tracés SVG déjà projetés,
# chargés seulement quand la carte approche de l'écran.
#   - terra      : les terres, en aplat (France : départements IGN ; ailleurs :
#                  Natural Earth 1:10M, domaine public)
#   - frontieras : les frontières d'États, tracées une seule fois (pointillé fin)
#   - erau       : le département de l'Hérault (IGN, union des communes de comunas/34.json)
#   - occitan    : le domaine occitan (union des dialectes d'Occitanica,
#                  static/data/dialectes.geojson)
#   - catalan    : le domaine catalan (static/data/catalan.json, OSM, ODbL)
# Projection équirectangulaire à l'échelle vraie au 44e parallèle :
# 1 unité = 1/100 de degré de latitude (≈ 1,11 km).
#
#   "C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat" SIG\istoria\fons-carta.py
import json, math, os
from osgeo import ogr

ogr.UseExceptions()
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIC = os.path.normpath(os.path.join(AQUI, '..', '..'))
GPKG = r"C:\Program Files\QGIS 4.2.3\apps\qgis\resources\data\world_map.gpkg"
SORTIDA = os.path.join(RAIC, 'app', 'src', 'lib', 'istoria', 'carta-fons.js')

LON0, LAT0, K = 1.5, 44.0, 100.0
COS0 = math.cos(math.radians(LAT0))
BBOX = (-8.5, 35.8, 11.5, 51.8)  # un peu plus large que ce que la caméra montre


def proj(lon, lat):
    return ((lon - LON0) * COS0 * K, (LAT0 - lat) * K)


def cadre():
    r = ogr.Geometry(ogr.wkbLinearRing)
    x0, y0, x1, y1 = BBOX
    for x, y in ((x0, y0), (x1, y0), (x1, y1), (x0, y1), (x0, y0)):
        r.AddPoint_2D(x, y)
    p = ogr.Geometry(ogr.wkbPolygon)
    p.AddGeometry(r)
    return p


def anel_txt(pts, tancar):
    out, prec = [], None
    for lon, lat in pts:
        x, y = proj(lon, lat)
        q = (round(x, 1), round(y, 1))
        if q == prec:
            continue
        out.append(q)
        prec = q
    if len(out) < (4 if tancar else 2):
        return ''
    s = 'M' + ' '.join(f'{fmt(x)} {fmt(y)}' for x, y in out[:1]) + 'L' + ' '.join(f'{fmt(x)} {fmt(y)}' for x, y in out[1:])
    return s + ('Z' if tancar else '')


def fmt(v):
    s = f'{v:.1f}'.rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def tracat(g):
    """Géométrie OGR (polygones ou lignes) → chemin SVG."""
    nom = g.GetGeometryName()
    if nom in ('POLYGON',):
        return ''.join(anel_txt(g.GetGeometryRef(i).GetPoints(), True) for i in range(g.GetGeometryCount()))
    if nom in ('LINESTRING',):
        return anel_txt(g.GetPoints(), False)
    if nom in ('MULTIPOLYGON', 'MULTILINESTRING', 'GEOMETRYCOLLECTION'):
        return ''.join(tracat(g.GetGeometryRef(i)) for i in range(g.GetGeometryCount()))
    return ''


ds = ogr.Open(GPKG)
clip = cadre()

# 1. Les pays du cadre
pays = {}
lyr = ds.GetLayerByName('countries')
lyr.SetSpatialFilter(clip)
for f in lyr:
    g = f.GetGeometryRef().Clone().MakeValid()
    g = g.Intersection(clip.Buffer(0.5))
    if not g.IsEmpty():
        pays[f.GetField('ISO_A3') or f.GetField('NAME')] = g

# La France vient des départements de l'IGN (static/data/departements.geojson),
# sauf autour du golfe du Lion, où l'on zoome : là, l'union des communes de
# l'IGN (static/data/comunas/<dép>.json, TopoJSON), bien plus fine.
DETALH = float(os.environ.get('DETALH', '0.004'))
FINS = ('11', '13', '30', '34')


def comunas(dep):
    with open(os.path.join(RAIC, 'app', 'static', 'data', 'comunas', dep + '.json'), encoding='utf-8') as fh:
        t = json.load(fh)
    (sx, sy), (tx, ty) = t['transform']['scale'], t['transform']['translate']
    arcs = []
    for a in t['arcs']:
        x = y = 0
        pts = []
        for dx, dy in a:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    tot = ogr.Geometry(ogr.wkbMultiPolygon)
    for g in t['objects']['comunas']['geometries']:
        polys = [g['arcs']] if g['type'] == 'Polygon' else g['arcs'] if g['type'] == 'MultiPolygon' else []
        for poly in polys:
            p = ogr.Geometry(ogr.wkbPolygon)
            for ids in poly:
                r = ogr.Geometry(ogr.wkbLinearRing)
                pts = []
                for i in ids:
                    seg = arcs[i] if i >= 0 else arcs[~i][::-1]
                    pts.extend(seg if not pts else seg[1:])
                for x, y in pts:
                    r.AddPoint_2D(x, y)
                r.CloseRings()
                p.AddGeometry(r)
            tot.AddGeometry(p)
    return tot.Buffer(0)  # dissout les limites entre communes


deps, erau = None, None
with open(os.path.join(RAIC, 'app', 'static', 'data', 'departements.geojson'), encoding='utf-8') as fh:
    for feat in json.load(fh)['features']:
        if feat['properties']['code'] in FINS:
            continue
        g = ogr.CreateGeometryFromJson(json.dumps(feat['geometry'])).MakeValid()
        deps = g if deps is None else deps.Union(g)
grossiers = deps.Buffer(0.0005).Buffer(-0.0005).SimplifyPreserveTopology(DETALH)
fins = None
for dep in FINS:
    g = comunas(dep).Buffer(0.0003).Buffer(-0.0003)
    if dep == '34':
        erau = g.SimplifyPreserveTopology(0.0015)
    g = g.SimplifyPreserveTopology(0.0015)
    fins = g if fins is None else fins.Union(g)
# les deux sources ne se touchent pas tout à fait : on comble la couture
costura = fins.Buffer(0.015).Intersection(grossiers.Buffer(0.015))
deps = grossiers.Union(fins).Union(costura)
terra = deps
for k, g in pays.items():
    if k != 'FRA':
        terra = terra.Union(g.Difference(deps.Buffer(0.01)).SimplifyPreserveTopology(0.01))
terra = terra.Intersection(clip)

# 2. Les frontières, une seule fois chacune : le bord de A qui touche B
claus = sorted(pays)
frontieras = []
for i, a in enumerate(claus):
    for b in claus[i + 1:]:
        if not pays[a].Intersects(pays[b].Buffer(0.02)):
            continue
        l = pays[a].Boundary().Intersection(pays[b].Buffer(0.02))
        l = l.Intersection(clip)
        if not l.IsEmpty() and l.Length() > 0.05:
            frontieras.append(l.SimplifyPreserveTopology(0.012))

# 3. L'Hérault : pris plus haut dans les communes de l'IGN
if erau is None:
    raise SystemExit("Hérault introuvable dans comunas/34.json")

# 4. Le domaine occitan : l'union des dialectes, sans les traits entre eux
occ = None
with open(os.path.join(RAIC, 'app', 'static', 'data', 'dialectes.geojson'), encoding='utf-8') as fh:
    for feat in json.load(fh)['features']:
        g = ogr.CreateGeometryFromJson(json.dumps(feat['geometry'])).MakeValid().Buffer(0.004)
        occ = g if occ is None else occ.Union(g)
occ = occ.Buffer(-0.004).Intersection(terra.Buffer(0.02)).SimplifyPreserveTopology(0.015)

# 5. Le domaine catalan
cat = None
with open(os.path.join(RAIC, 'app', 'static', 'data', 'catalan.json'), encoding='utf-8') as fh:
    for anel in json.load(fh)['domeni']['anels']:
        r = ogr.Geometry(ogr.wkbLinearRing)
        for lon, lat in anel:
            r.AddPoint_2D(lon, lat)
        p = ogr.Geometry(ogr.wkbPolygon)
        p.AddGeometry(r)
        p = p.MakeValid()
        cat = p if cat is None else cat.Union(p)
cat = cat.Intersection(terra.Buffer(0.02)).SimplifyPreserveTopology(0.015)

x0, y1 = proj(BBOX[0], BBOX[1])
x1, y0 = proj(BBOX[2], BBOX[3])
donadas = {
    'terra': tracat(terra),
    'frontieras': ''.join(tracat(l) for l in frontieras),
    'erau': tracat(erau),
    'occitan': tracat(occ),
    'catalan': tracat(cat),
}
os.makedirs(os.path.dirname(SORTIDA), exist_ok=True)
with open(SORTIDA, 'w', encoding='utf-8', newline='\n') as fh:
    fh.write('// Généré par SIG/istoria/fons-carta.py : ne pas modifier à la main.\n')
    fh.write('// Terres et Hérault : IGN (Licence Ouverte) en France, Natural Earth 1:10M (domaine public) ailleurs ;\n')
    fh.write('// domaine occitan : Occitanica ; domaine catalan : © contributeurs OpenStreetMap (ODbL).\n')
    fh.write(f'// Projection : x = (lon − {LON0}) × cos({LAT0}°) × {K:g}, y = ({LAT0} − lat) × {K:g}.\n')
    fh.write(f'export const PROJ = {{ lon0: {LON0}, lat0: {LAT0}, k: {K:g} }};\n')
    fh.write(f'export const CADRE = [{fmt(x0)}, {fmt(y0)}, {fmt(x1 - x0)}, {fmt(y1 - y0)}];\n')
    for k, v in donadas.items():
        fh.write(f'export const {k.upper()} = {json.dumps(v)};\n')
for k, v in donadas.items():
    print(f'{k:11s} {len(v):7d} caractères')
print('Écrit :', SORTIDA)
