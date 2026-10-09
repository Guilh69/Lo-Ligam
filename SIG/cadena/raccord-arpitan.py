# Lo domeni occitan al contacte de l'arpitan, comuna per comuna (retorn de
# Romain, 2026-10-09 : « des trous identifiés » entre l'occitan e l'arpitan).
#
# Lo domeni d'Occitanica s'arrèsta de còps qualques km abans lo despartament
# (vèrs del Puèi de Domat dels monts de Forés, nòrd dels Nauts Aups), e
# mordís sus de comunas arpitanas. Coma pel Fenolhedés (fenolhedes.py), aqueste
# escript met lo domeni (limits-carta.json) e los dialèctes (dialectes.geojson)
# sus las limits de las comunas de l'IGN :
#   domeni = (domeni ∪ comunas occitanas vesinas de l'arpitan) − comunas arpitanas
# Las comunas occitanas vesinas (a mens de VESINAT de l'arpitan) : las de la
# benda de transicion e las autras comunas majoritàriament occitanas dels
# despartaments del classament arpitan (SIG/arpitan/dialectes-arpitan.csv,
# parts-comunas.json), e totas las del Puèi de Domat e dels Nauts Aups,
# despartaments occitans. Totas son simplificadas a SIMPL.
# La benda de transicion demòra occitana (decision de Romain, 2026-10-09).
#
# Entradas : SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg, SIG/arpitan/dialectes-arpitan.csv,
# SIG/brut/arpitan/parts-comunas.json (arpitan-carta.cjs).
# S'aplica APRÈP fenolhedes.py e ABANS arpitan-carta.cjs (puèi tota la cadena
# arpitana : LEGISSETZ-ME.md).
#
# Usatge : "C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat" -s -P SIG/cadena/raccord-arpitan.py [dorsièr de sortida]
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
SIMPL = 300  # m : simplificacion de las comunas, coma lo catalan e l'arpitan (lo domeni d'Occitanica es a ~1 km ; l'arpitan se i raccòrda ponch per ponch)
DEPS_OC = ['63', '05']  # despartaments occitans vesins, pas dins lo classament arpitan

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


# --- classament arpitan
linhas_csv = list(csv.DictReader(open(os.path.join(RAIC, 'SIG', 'arpitan', 'dialectes-arpitan.csv'), encoding='utf-8-sig'), delimiter=';'))
ARP = {r['codi'] for r in linhas_csv if r['regio'] == 'France' and r['domeni'] == 'arpitan'}
BENDA = {r['codi'] for r in linhas_csv if r['regio'] == 'France' and r['domeni'] == 'occitan'}
parts = json.load(open(os.path.join(RAIC, 'SIG', 'brut', 'arpitan', 'parts-comunas.json'), encoding='utf-8'))
OCC = {p['id'] for p in parts if p['src'] == 'comunas-fr' and p['occ'] >= 0.5 and p['id'] not in ARP}
DEPS_ARP = sorted({c[:2] for c in ARP | OCC | BENDA})

# --- las comunas de l'IGN
gp = ogr.Open(os.path.join(RAIC, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
cm = gp.GetLayerByName('commune')
geo = {}
cm.SetAttributeFilter('code_insee_du_departement IN (%s)' % ','.join("'%s'" % d for d in DEPS_ARP + DEPS_OC))
for f in cm:
    geo[f.GetField('code_insee')] = (f.GetField('code_insee_du_departement'), f.GetField('nom_officiel') if f.GetFieldIndex('nom_officiel') >= 0 else '', f.GetGeometryRef().Clone().Buffer(0))
cm.SetAttributeFilter(None)
arp = unir([geo[c][2] for c in ARP if c in geo])
pròche = arp.Buffer(VESINAT)
vesinas = [c for c, (d, n, g) in geo.items() if c not in ARP and g.Intersects(pròche) and (c in OCC or c in BENDA or d in DEPS_OC)]
apondut = unir([geo[c][2] for c in vesinas])

# --- lo domeni
pL = os.path.join(DATA, 'limits-carta.json')
L = json.load(open(pL, encoding='utf8'))
dom = None
for a in L['domeni']['anels']:
    p = anel(a)
    dom = p if dom is None else dom.SymDifference(p)
abans = {
    'comunas vesinas defora': km2(apondut.Difference(dom)),
    'comunas arpitanas dedins': km2(dom.Intersection(arp)),
}
arp_d = arp.SimplifyPreserveTopology(SIMPL)
# (las comunas apondudas e las arpitanas, simplificadas cadun de son costat,
# se tòcan pas mai : las apondudas desbòrdan de 2×SIMPL cap a l'arpitan, que
# las retalha ; sens aquò, de vuèges de qualques centenats de mètres)
desbòrd = apondut.Buffer(2 * SIMPL).Intersection(arp_d.Buffer(2 * SIMPL))
dom2 = dom.Union(apondut.SimplifyPreserveTopology(SIMPL)).Union(desbòrd).Difference(arp_d).Buffer(0)
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
    'comunas arpitanas dedins': km2(dom2.Intersection(arp)),
}
nòu = dom2.Difference(dom)
print('apondut al domeni occitan : %.1f km2 ; levat (comunas arpitanas) : %.1f km2' % (km2(nòu), km2(dom.Difference(dom2))))
per_dep = {}
for c in vesinas:
    a = km2(geo[c][2].Intersection(nòu))
    if a > 0.5:
        per_dep.setdefault(geo[c][0], []).append('%s %.1f' % (geo[c][1] or c, a))
for d, l in sorted(per_dep.items()):
    print('  %s : %s' % (d, ', '.join(l)))

# los anèls
anels = []
for p in poligons(dom2):
    for i in range(p.GetGeometryCount()):
        pl = ogr.Geometry(ogr.wkbPolygon)
        pl.AddGeometry(p.GetGeometryRef(i).Clone())
        anels.append(en_geojson(pl)['coordinates'][0])

# las linhas : las d'abans, levat dins la zòna cambiada ; dins aquesta zòna, lo
# contorn novèl (frontièra amb l'arpitan e l'oïl, pas de còsta aquí)
zona = arp.Buffer(VESINAT).Intersection(dom.Union(dom2).Buffer(VESINAT)).Buffer(150)
linhas_g = []
for l in L['domeni']['linhas']:
    g = ogr.Geometry(ogr.wkbLineString)
    for x, y in l:
        g.AddPoint_2D(x, y)
    g.Transform(cap93)
    linhas_g += linhas_de(g.Difference(zona))
linhas_g += linhas_de(dom2.Boundary().Intersection(zona))
mlin = ogr.Geometry(ogr.wkbMultiLineString)
for g in linhas_g:
    if g.Length() > 1:
        mlin.AddGeometry(g)
fusion = ogr.ForceToMultiLineString(mlin.Union(ogr.Geometry(ogr.wkbMultiLineString)))
try:
    fusion = fusion.LineMerge()
except Exception:
    pass
linhas = [en_geojson(g)['coordinates'] for g in linhas_de(fusion)]

# --- los dialèctes : los tròces novèls al dialècte que ne tòca mai ; las
# comunas arpitanas levadas (la tencha es retalhada pel domeni : simplificacion de 120 m)
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
arp_s = arp.SimplifyPreserveTopology(120)
for f in D['features']:
    k = f['properties']['kod']
    g = geoms[k]
    if apond[k]:
        g = unir([g] + apond[k]).SimplifyPreserveTopology(120)
        print('  dialècte %s : +%.1f km2' % (k, sum(km2(q) for q in apond[k])))
    g = g.Difference(arp_s).Buffer(0)
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
print('anèls :', len(anels), '; linhas :', len(linhas))
