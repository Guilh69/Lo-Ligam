# Lo contorn de França (metropòla e Corsega) d'un sol tenent, per lo mòde
# « Lengas de França » (Romain, 2026-10-10) : una lenga alucada mòstra d'en
# primièr sa part francesa ; la carta retalha son dessenh segon aqueste
# contorn, puèi « Veire la lenga dins son environament lingüistic » mòstra la
# rèsta.
#
# Entrada : SIG/brut/regions.geojson (las 13 regions de l'IGN) ; fusionadas
# (cap de fendascla entre doas regions), simplificadas a 0,002° (~200 m).
# Sortida : app/static/data/franca.json, [[[lon, lat], ...], ...] (anèls exteriors).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/franca-contorn.py
import json, os
from osgeo import ogr

ogr.UseExceptions()
RAIC = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ENTRADA = os.path.join(RAIC, 'SIG', 'brut', 'regions.geojson')
SORTIDA = os.path.join(RAIC, 'app', 'static', 'data', 'franca.json')

ds = ogr.Open(ENTRADA)
lc = ds.GetLayer()
union = ogr.Geometry(ogr.wkbMultiPolygon)
for f in lc:
    g = f.GetGeometryRef()
    if g.GetGeometryType() in (ogr.wkbPolygon, ogr.wkbPolygon25D):
        union.AddGeometry(g)
    else:
        for i in range(g.GetGeometryCount()):
            union.AddGeometry(g.GetGeometryRef(i))
franca = union.UnionCascaded().SimplifyPreserveTopology(0.002)

aneis = []
polis = [franca] if franca.GetGeometryType() == ogr.wkbPolygon else [franca.GetGeometryRef(i) for i in range(franca.GetGeometryCount())]
for p in polis:
    ext = p.GetGeometryRef(0)
    pts = [[round(ext.GetX(i), 4), round(ext.GetY(i), 4)] for i in range(ext.GetPointCount())]
    if len(pts) >= 4 and p.GetArea() > 0.0005:  # (los ilhòts minuscules : pas besonh)
        aneis.append(pts)

# Las lengas que desbòrdan de França : la part de lor domeni (lengas-vesinas.json)
# en defòra de França espandida d'1 km (la còsta e sa simplificacion comptan pas),
# mai de 1 % de lor susfàcia (lo breton, tot en França, a pas de boton « environament »)
franca_larga = union.UnionCascaded().Buffer(0.01)
vesinas = json.load(open(os.path.join(RAIC, 'app', 'static', 'data', 'lengas-vesinas.json'), encoding='utf-8'))
estrangier = []
for k, anels in vesinas.items():
    if k == 'franca':
        continue
    dom = None
    for a in anels:
        anel = ogr.Geometry(ogr.wkbLinearRing)
        for x, y in a:
            anel.AddPoint_2D(x, y)
        p = ogr.Geometry(ogr.wkbPolygon)
        p.AddGeometry(anel)
        p = p.Buffer(0)  # (un anèl simplificat que se copa el meteis : reparat)
        dom = p if dom is None else dom.Union(p)
    part = dom.Difference(franca_larga).GetArea() / max(dom.GetArea(), 1e-12)
    print(f'  {k} : {part:.1%} en defòra de França')
    if part > 0.01:
        estrangier.append(k)

# Los dialèctes de cada lenga : en França (mai de 98,5 % de lor zòna), sus la
# frontièra, o defòra (mens de 1,5 %) ; lo mòde « Lengas de França » los rènga
# en tres gropes (demanda de Romain, 2026-10-10). Lo lindal d'1,5 % passa
# lo bruch dels traçats (còsta simplificada, frontièra a 1 km pròche : fins a
# 1,3 %) ; la Val d'Aran (2 %) o la ponta de Givet (1,9 %) i passan.
DATA = os.path.join(RAIC, 'app', 'static', 'data')
dialectes = {}
pcts = {}
for k, fic in [(k, k + '.json') for k in vesinas if k != 'franca'] + [('occitan', 'dialectes.geojson')]:
    cami = os.path.join(DATA, fic)
    if not os.path.exists(cami):
        continue
    res = {}
    for f in json.load(open(cami, encoding='utf-8'))['features']:
        if not f.get('geometry'):
            continue
        g = ogr.CreateGeometryFromJson(json.dumps(f['geometry'])).Buffer(0)
        a = g.GetArea()
        if a <= 0:
            continue
        dins = g.Intersection(franca_larga).GetArea() / a
        res[f['properties']['kod']] = 'fr' if dins > 0.985 else 'defora' if dins < 0.015 else 'frontiera'
        pcts[k + ':' + f['properties']['kod']] = dins
    dialectes[k] = res
    print(f'  {k} :', ', '.join(f'{d} {c}' for d, c in res.items()))

print('  dins França :', ', '.join(f'{d} {p:.2%}' for d, p in pcts.items() if 0.001 < p < 0.999))
with open(SORTIDA, 'w', encoding='utf-8') as s:
    json.dump({'aneis': aneis, 'estrangier': estrangier, 'dialectes': dialectes}, s, separators=(',', ':'))
print('franca.json', os.path.getsize(SORTIDA), 'octets,', len(aneis), 'anèls,', sum(len(a) for a in aneis), 'ponches ; desbòrdan :', ', '.join(estrangier))
