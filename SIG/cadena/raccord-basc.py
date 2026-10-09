# Lo domeni occitan al contacte del basc, comuna per comuna (2026-10-09).
#
# Lo domeni d'Occitanica passa trop a l'oèst dins lo 64 : met tota la Sola e
# l'Amikuze dins lo gascon (Maulion, Sant Palai : 100 %). Coma pel Fenolhedés
# e l'arpitan (raccord-arpitan.py), lo domeni (limits-carta.json) e los
# dialèctes (dialectes.geojson) seguisson ara las limits de las comunas de l'IGN :
#   domeni = (domeni ∪ comunas occitanas vesinas del basc) − comunas basquas
# Las comunas basquas : las de SIG/basc/dialectes-basc.csv (domeni « basc »,
# França). Baiona, Anglet, Biàrritz e las autras comunas d'influéncia gascona
# ne fan partida (decision de Romain : demòran dins lo basc) ; son marcadas del
# costat occitan per tres zònas mixtas (basc-mixtas.py), en asclas coma Ròia o Mónegue.
#
# Entradas : SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg, SIG/basc/dialectes-basc.csv.
# S'aplica APRÈP raccord-arpitan.py e ABANS basc-mixtas.py e basc.py ; puèi tornar lançar
# costa-ref.py (bòrd de mar). Sus los fichièrs d'abans (git checkout), pas dos
# còps de seguida.
#
# Usatge : "C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat" -s -P SIG/cadena/raccord-basc.py [dorsièr de sortida]
# (sens dorsièr : escriu dins app/static/data ; amb : un ensag, sens res tocar)
import csv
import json
import os
import sys

from osgeo import ogr, osr

ogr.UseExceptions()
RAIC = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DATA = os.path.join(RAIC, 'app', 'static', 'data')
SORTIDA = sys.argv[1] if len(sys.argv) > 1 else DATA
VESINAT = 3000  # m
SIMPL = 300  # m, coma raccord-arpitan.py
DEPS = ['64', '40']

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


def unir(gs):
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for g in gs:
        for p in poligons(g):
            m.AddGeometry(p.Clone())
    return m.UnaryUnion().Buffer(0)


def eti(g):
    p = max(poligons(g), key=lambda q: q.GetArea())
    c = p.PointOnSurface()
    c.Transform(capWgs)
    return [round(c.GetX(), 3), round(c.GetY(), 3)]


# --- classament basc
linhas_csv = list(csv.DictReader(open(os.path.join(RAIC, 'SIG', 'basc', 'dialectes-basc.csv'), encoding='utf-8-sig'), delimiter=';'))
BASC = {r['codi'] for r in linhas_csv if r['regio'] == 'France' and r['domeni'] == 'basc'}
GASC = {r['codi'] for r in linhas_csv if r['regio'] == 'France' and r['domeni'] == 'basc' and r['transicio'] == 'oc'}

# --- las comunas de l'IGN
gp = ogr.Open(os.path.join(RAIC, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
cm = gp.GetLayerByName('commune')
geo = {}
cm.SetAttributeFilter('code_insee_du_departement IN (%s)' % ','.join("'%s'" % d for d in DEPS))
for f in cm:
    geo[f.GetField('code_insee')] = (f.GetField('code_insee_du_departement'), f.GetField('nom_officiel'), f.GetField('population') or 0, f.GetGeometryRef().Clone().Buffer(0))
manca = BASC - set(geo)
if manca:
    raise SystemExit('Comunas basquas absentas del GeoPackage : %s' % sorted(manca))
basc = unir([geo[c][3] for c in BASC])
pròche = basc.Buffer(VESINAT)
vesinas = [c for c, (d, n, p, g) in geo.items() if c not in BASC and g.Intersects(pròche)]
apondut = unir([geo[c][3] for c in vesinas])

# --- lo domeni
pL = os.path.join(DATA, 'limits-carta.json')
L = json.load(open(pL, encoding='utf8'))
dom = None
for a in L['domeni']['anels']:
    p = anel(a)
    dom = p if dom is None else dom.SymDifference(p)
abans = {
    'comunas vesinas defora': km2(apondut.Difference(dom)),
    'comunas basquas dedins': km2(dom.Intersection(basc)),
}
basc_d = basc.SimplifyPreserveTopology(SIMPL)
desbòrd = apondut.Buffer(2 * SIMPL).Intersection(basc_d.Buffer(2 * SIMPL))
# (lo desbòrd demòra dins la tèrra : pas cap a la mar, a la còsta de Tarnòs)
desbòrd = desbòrd.Intersection(unir([apondut, basc]).Buffer(0))
dom2 = dom.Union(apondut.SimplifyPreserveTopology(SIMPL)).Union(desbòrd).Difference(basc_d).Buffer(0)
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
    'comunas vesinas defora': km2(apondut.Difference(dom2)),
    'comunas basquas dedins': km2(dom2.Intersection(basc)),
}
nòu = dom2.Difference(dom)
levat = dom.Difference(dom2)
print('apondut al domeni occitan : %.1f km2 ; levat (comunas basquas) : %.1f km2' % (km2(nòu), km2(levat)))
for c in vesinas:
    a = km2(geo[c][3].Intersection(nòu))
    if a > 0.5:
        print('  + %s %.1f' % (geo[c][1], a))
for c in sorted(BASC, key=lambda c: -geo[c][3].Intersection(levat).GetArea())[:12]:
    print('  - %s %.1f' % (geo[c][1], km2(geo[c][3].Intersection(levat))))

# los anèls
anels = []
for p in poligons(dom2):
    for i in range(p.GetGeometryCount()):
        pl = ogr.Geometry(ogr.wkbPolygon)
        pl.AddGeometry(p.GetGeometryRef(i).Clone())
        anels.append(en_geojson(pl)['coordinates'][0])

# las linhas : las d'abans, levat dins la zòna cambiada ; dins aquesta zòna, lo
# contorn novèl, sonque long del basc (pas la còsta) e long de las linhas
# d'abans (frontièra d'Estat, se n'i aviá)
zona = basc.Buffer(VESINAT).Intersection(dom.Union(dom2).Buffer(VESINAT)).Buffer(150)
vièlhas = []
linhas_g = []
for l in L['domeni']['linhas']:
    g = ogr.Geometry(ogr.wkbLineString)
    for x, y in l:
        g.AddPoint_2D(x, y)
    g.Transform(cap93)
    vièlhas.append(g)
    linhas_g += linhas_de(g.Difference(zona))
vièlhas_z = ogr.Geometry(ogr.wkbMultiLineString)
for g in vièlhas:
    for s in linhas_de(g.Intersection(zona)):
        vièlhas_z.AddGeometry(s)
gardar = basc_d.Buffer(60).Union(vièlhas_z.Buffer(100) if not vièlhas_z.IsEmpty() else ogr.Geometry(ogr.wkbMultiPolygon))
linhas_g += linhas_de(dom2.Boundary().Intersection(zona).Intersection(gardar))
mlin = ogr.Geometry(ogr.wkbMultiLineString)
for g in linhas_g:
    if g.Length() > 1:
        mlin.AddGeometry(g)
fusion = ogr.ForceToMultiLineString(mlin.Union(ogr.Geometry(ogr.wkbMultiLineString)))
try:
    fusion = fusion.LineMerge()
except Exception:
    pass
linhas = [en_geojson(g)['coordinates'] for g in linhas_de(fusion) if g.Length() > 200]
print('linhas d\'abans dins la zòna : %.1f km' % (vièlhas_z.Length() / 1000))

# --- los dialèctes : los tròces novèls al dialècte que ne tòca mai ; las
# comunas basquas levadas
pD = os.path.join(DATA, 'dialectes.geojson')
D = json.load(open(pD, encoding='utf8'))
geoms = {f['properties']['kod']: de_geojson(f['geometry']) for f in D['features']}
tots = unir(list(geoms.values()))
apond = {k: [] for k in geoms}
for q in poligons(nòu.Difference(tots).Buffer(0)):
    qb = q.Buffer(30)
    c = {k: (qb.Intersection(g).GetArea() if qb.Intersects(g) else 0) for k, g in geoms.items()}
    k = max(c, key=c.get)
    if c[k] > 0:
        apond[k].append(q.Clone())
basc_s = basc.SimplifyPreserveTopology(120)
for f in D['features']:
    k = f['properties']['kod']
    g = geoms[k]
    a0 = km2(g)
    if apond[k]:
        g = unir([g] + apond[k]).SimplifyPreserveTopology(120)
    g = g.Difference(basc_s).Buffer(0)
    if abs(km2(g) - a0) > 0.5:
        print('  dialècte %s : %+.1f km2' % (k, km2(g) - a0))
    f['geometry'] = en_geojson(g)

os.makedirs(SORTIDA, exist_ok=True)
L['domeni']['anels'] = anels
L['domeni']['linhas'] = linhas
for nom, obj in (('limits-carta.json', L), ('dialectes.geojson', D)):
    with open(os.path.join(SORTIDA, nom), 'w', encoding='utf8') as o:
        json.dump(obj, o, ensure_ascii=False, separators=(',', ':'))
print('abans :', abans)
print('aprèp :', apres)
print('anèls :', len(anels), '; linhas :', len(linhas))
