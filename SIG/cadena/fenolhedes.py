# Lo domeni occitan pels Pirenèus Orientals, comuna per comuna (retorn de
# Romain, 2026-10-08 : « pour les frontières entre le catalan et l'occitan,
# il faut que ça se rejoigne de manière parfaite, pas qu'il y ait des trous
# entre les couches »).
#
# Lo domeni d'Occitanica (legit sus una carta estampada) passava a 1 o 2 km
# de la vertadièra limita : lo Fenolhedés (28 comunas occitanofònas del 66,
# 358 km²) n'èra defòra, una benda de comunas de l'Auda e de l'Arièja
# (96 km²) tanben, e lo domeni mordissiá sus 34 km² de comunas catalanas.
# Aqueste escript met lo domeni (limits-carta.json) e lo lengadocian
# (dialectes.geojson) sus las limits de las comunas de l'IGN, las meteissas
# que lo catalan (SIG/cadena/catalan.py) :
#   domeni = (domeni ∪ comunas de l'Auda e de l'Arièja a mens de 3 km del 66)
#            − Pirenèus Orientals ∪ Fenolhedés
# e torna calcular las linhas de frontièra dins la zòna cambiada (la limita
# amb las comunas catalanas, e la frontièra d'Andòrra e d'Espanha a l'oèst ;
# pas la còsta).
#
# Entradas : SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg (IGN ADMIN EXPRESS COG
# CARTO 2026, Licéncia dobèrta 2.0), SIG/catalan/fenolhedes.geojson (fabricat
# per catalan.py a partir del classament SIG/catalan/dialectes-catalan.csv).
# S'aplica APRÈP domeni.mjs, costa-domeni.py, mixtas.py e gavacharia.mjs, e
# ABANS catalan.py (que lèva lo domeni occitan del catalan).
#
# Usatge : "C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat" -s -P SIG/cadena/fenolhedes.py [dorsièr de sortida]
# (sens dorsièr : escriu dins app/static/data ; amb : un ensag, sens res tocar)
import json
import os
import sys

from osgeo import ogr, osr

ogr.UseExceptions()
RAIC = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DATA = os.path.join(RAIC, 'app', 'static', 'data')
SORTIDA = sys.argv[1] if len(sys.argv) > 1 else DATA
VESINAT = 3000  # m : las comunas de l'Auda e de l'Arièja près del 66
SIMPL = 40  # m : simplificacion de las comunas apondudas (lo domeni es a ~1 km)

wgs = osr.SpatialReference()
wgs.ImportFromEPSG(4326)
wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
l93 = osr.SpatialReference()
l93.ImportFromEPSG(2154)
l93.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
cap93 = osr.CoordinateTransformation(wgs, l93)
capWgs = osr.CoordinateTransformation(l93, wgs)


def km2(g):
    return round(g.GetArea() / 1e6, 2) if g and not g.IsEmpty() else 0


def anel(a):
    r = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in a:
        r.AddPoint_2D(x, y)
    r.CloseRings()
    p = ogr.Geometry(ogr.wkbPolygon)
    p.AddGeometry(r)
    p.Transform(cap93)
    return p.Buffer(0)


def de_geojson(g):
    o = ogr.CreateGeometryFromJson(json.dumps(g))
    o.Transform(cap93)
    return o.Buffer(0)


def en_geojson(g):
    c = g.Clone()
    c.Transform(capWgs)
    d = json.loads(c.ExportToJson())

    def arredondir(x):
        if isinstance(x, list):
            if x and isinstance(x[0], (int, float)):
                return [round(x[0], 5), round(x[1], 5)]
            return [arredondir(y) for y in x]
        return x

    d['coordinates'] = arredondir(d['coordinates'])
    return d


def poligons(g):
    t = ogr.GT_Flatten(g.GetGeometryType())
    if t == ogr.wkbPolygon:
        return [g]
    if t in (ogr.wkbMultiPolygon, ogr.wkbGeometryCollection):
        return [g.GetGeometryRef(i) for i in range(g.GetGeometryCount()) if ogr.GT_Flatten(g.GetGeometryRef(i).GetGeometryType()) == ogr.wkbPolygon]
    return []


def linhas_de(g):
    t = ogr.GT_Flatten(g.GetGeometryType())
    if t == ogr.wkbLineString:
        return [g]
    if t in (ogr.wkbMultiLineString, ogr.wkbGeometryCollection):
        out = []
        for i in range(g.GetGeometryCount()):
            out += linhas_de(g.GetGeometryRef(i))
        return out
    return []


# --- las comunas de l'IGN
gp = ogr.Open(os.path.join(RAIC, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
cm = gp.GetLayerByName('commune')


def union_comunas(deps, filtre=None):
    u = None
    cm.SetAttributeFilter('code_insee_du_departement IN (%s)' % ','.join("'%s'" % d for d in deps))
    for f in cm:
        g = f.GetGeometryRef().Clone()
        if filtre is not None and not g.Intersects(filtre):
            continue
        u = g if u is None else u.Union(g)
    cm.SetAttributeFilter(None)
    return u


po = union_comunas(['66']).Buffer(0)
F = json.load(open(os.path.join(RAIC, 'SIG', 'catalan', 'fenolhedes.geojson'), encoding='utf8'))
fen = None
for f in F['features']:
    g = de_geojson(f['geometry'])
    fen = g if fen is None else fen.Union(g)
vesins = union_comunas(['11', '09'], po.Buffer(VESINAT)).Buffer(0)
catalan66 = po.Difference(fen)

# --- lo domeni
pL = os.path.join(DATA, 'limits-carta.json')
L = json.load(open(pL, encoding='utf8'))
dom = None
for a in L['domeni']['anels']:
    p = anel(a)
    dom = p if dom is None else dom.SymDifference(p)
abans = {
    'Fenolhedes defora': km2(fen.Difference(dom)),
    'Auda e Arieja defora': km2(vesins.Difference(dom)),
    'comunas catalanas dedins': km2(dom.Intersection(catalan66)),
}
apondut = vesins.SimplifyPreserveTopology(SIMPL).Union(fen.SimplifyPreserveTopology(SIMPL))
# (las comunas catalanas, levadas sens simplificacion : la limita es la de l'IGN)
dom2 = dom.Union(apondut).Difference(catalan66).Buffer(0)
# (las escrinhas que l'union daissa, illòts e traucs de mens de 0,5 km², son
# levadas : lo domeni a pas qu'aquelas d'abans, totas mai grandas)
PICHON = 0.5e6
net = ogr.Geometry(ogr.wkbMultiPolygon)
for p in poligons(dom2):
    ext = ogr.Geometry(ogr.wkbPolygon)
    ext.AddGeometry(p.GetGeometryRef(0).Clone())
    if ext.GetArea() < PICHON:
        continue
    q = ogr.Geometry(ogr.wkbPolygon)
    q.AddGeometry(p.GetGeometryRef(0).Clone())
    for i in range(1, p.GetGeometryCount()):
        t = ogr.Geometry(ogr.wkbPolygon)
        t.AddGeometry(p.GetGeometryRef(i).Clone())
        if t.GetArea() >= PICHON:
            q.AddGeometry(p.GetGeometryRef(i).Clone())
    net.AddGeometry(q)
dom2 = net
apres = {
    'Fenolhedes defora': km2(fen.Difference(dom2)),
    'Auda e Arieja defora': km2(vesins.Difference(dom2)),
    'comunas catalanas dedins': km2(dom2.Intersection(catalan66)),
}

# los anèls (règla par-impar : exteriors e interiors)
anels = []
for p in poligons(dom2):
    for i in range(p.GetGeometryCount()):
        r = p.GetGeometryRef(i)
        pl = ogr.Geometry(ogr.wkbPolygon)
        pl.AddGeometry(r.Clone())
        anels.append(en_geojson(pl)['coordinates'][0])

# las linhas : las d'abans, levat dins la zòna cambiada ; puèi, dins aquesta
# zòna, la limita amb las comunas catalanas e, a l'oèst, la frontièra
# d'Andòrra e d'Espanha (pas la còsta de l'Auda, a l'èst)
zona = vesins.Union(po).Buffer(150)
linhas_g = []
for l in L['domeni']['linhas']:
    g = ogr.Geometry(ogr.wkbLineString)
    for x, y in l:
        g.AddPoint_2D(x, y)
    g.Transform(cap93)
    linhas_g += linhas_de(g.Difference(zona))
contorn = dom2.Boundary().Intersection(zona)
oest = ogr.CreateGeometryFromWkt('POLYGON((560000 6100000, 640000 6100000, 640000 6200000, 560000 6200000, 560000 6100000))')
novèlas = contorn.Intersection(catalan66.Buffer(60).Union(oest))
linhas_g += linhas_de(novèlas)
mlin = ogr.Geometry(ogr.wkbMultiLineString)
for g in linhas_g:
    if g.Length() > 1:
        mlin.AddGeometry(g)
# (union amb se meteissa : nosa los tròces que se tòcan, puèi los cadena)
fusion = ogr.ForceToMultiLineString(mlin.Union(ogr.Geometry(ogr.wkbMultiLineString)))
try:
    fusion = fusion.LineMerge()
except Exception:
    pass
linhas = []
for g in linhas_de(fusion):
    d = en_geojson(g)
    linhas.append(d['coordinates'])

# --- lo lengadocian e los autres dialèctes
pD = os.path.join(DATA, 'dialectes.geojson')
D = json.load(open(pD, encoding='utf8'))
geoms = {f['properties']['kod']: de_geojson(f['geometry']) for f in D['features']}
autres = None
for k, g in geoms.items():
    if k != 'lan':
        autres = g if autres is None else autres.Union(g)
catalan66s = catalan66.SimplifyPreserveTopology(120)
for f in D['features']:
    k = f['properties']['kod']
    g = geoms[k]
    if k == 'lan':
        # (la benda de l'Auda e de l'Arièja que cap de dialècte cobrissiá, e lo Fenolhedés)
        g = g.Union(apondut.Difference(autres)).SimplifyPreserveTopology(120)
    # (la tencha d'un dialècte es retalhada pel domeni, que garda la limita
    # exacta : la zòna pòt èsser simplificada, la tencha espandida cobrís l'escart)
    g = g.Difference(catalan66s).Buffer(0)
    f['geometry'] = en_geojson(g)

os.makedirs(SORTIDA, exist_ok=True)
L['domeni']['anels'] = anels
L['domeni']['linhas'] = linhas
with open(os.path.join(SORTIDA, 'limits-carta.json'), 'w', encoding='utf8') as o:
    json.dump(L, o, ensure_ascii=False, separators=(',', ':'))
with open(os.path.join(SORTIDA, 'dialectes.geojson'), 'w', encoding='utf8') as o:
    json.dump(D, o, ensure_ascii=False, separators=(',', ':'))
print('abans :', abans)
print('aprèp :', apres)
print('anèls :', len(anels), [len(a) for a in anels], '; linhas :', len(linhas), [len(l) for l in linhas])
print('lengadocian : km²', km2(de_geojson([f for f in D['features'] if f['properties']['kod'] == 'lan'][0]['geometry'])))
