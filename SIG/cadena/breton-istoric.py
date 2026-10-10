# Breton : las limitas istoricas (sègle IX a 1806) e las escòlas bilingüas
# defòra del domeni de 1886, apondudas a app/static/data/breton.json
#
# - limitas : per epòca, lo contorn de (domeni de 1886 + comunas de l'epòca,
#   SIG/breton/breton-istoric.csv, d'après la carta de Sémhur), sens la còsta
#   e sens los tròces que seguisson la limita de 1886 : demòra lo traç dins lo
#   país galo
# - escòlas : comunas amb d'escolans bilingües (OPLB 2025, SIG/breton/
#   breton-actual.csv) defòra del domeni breton (Rennes, Nantes…)
#
# Aviar aprèp lenga.py breton (que tòrna escriure breton.json) :
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -u -P SIG/cadena/breton-istoric.py
import csv, json, os
from collections import defaultdict
from osgeo import ogr, osr

AQUI = os.path.dirname(os.path.abspath(__file__))
SIG = os.path.normpath(os.path.join(AQUI, '..'))
BR = os.path.join(SIG, 'breton')
SORTIDA = os.path.join(SIG, '..', 'app', 'static', 'data', 'breton.json')

l93 = osr.SpatialReference(); l93.ImportFromEPSG(2154); l93.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
wgs = osr.SpatialReference(); wgs.ImportFromEPSG(4326); wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
a_ll = osr.CoordinateTransformation(l93, wgs)

def valid(g):
    return g if g.IsValid() else g.MakeValid()

def unir(gs):
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for g in gs:
        g = valid(g)
        if g.GetGeometryType() in (ogr.wkbPolygon, ogr.wkbPolygon25D):
            m.AddGeometry(g)
        else:
            for i in range(g.GetGeometryCount()):
                p = g.GetGeometryRef(i)
                if p.GetGeometryType() in (ogr.wkbPolygon, ogr.wkbPolygon25D):
                    m.AddGeometry(p)
    return valid(m.UnionCascaded())

# las comunas IGN : Bretanha e los despartaments vesins (la còsta = lo contorn)
gp = ogr.Open(os.path.join(SIG, 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
cm = gp.GetLayerByName('commune')
cm.SetAttributeFilter("code_insee_du_departement IN ('22','29','35','44','56','50','53','49','85')")
geo = {f.GetField('code_insee'): valid(f.GetGeometryRef().Clone()) for f in cm}

classa = {r['codi']: r['domeni'] for r in csv.DictReader(open(os.path.join(BR, 'dialectes-breton.csv'), encoding='utf-8-sig'), delimiter=';')}
domeni = unir(geo[c] for c, d in classa.items() if d in ('breton', 'mixta') and c in geo)
tèrra = unir(geo.values())
costa = tèrra.Boundary().Buffer(250)
bòrd = domeni.Boundary().Buffer(250)

# ------------------------------------------------- las limitas
EPÒCAS = [  # (clau del CSV, nom curt oc, fr, an pel tri)
    ('IXe-Loth', 's. IX', 'IXe s.', 850),
    ('XIIe', 's. XII', 'XIIe s.', 1150),
    ('XIIIe', 's. XIII', 'XIIIe s.', 1250),
    ('XIVe', 's. XIV', 'XIVe s.', 1350),
    ('1588-Argentre', '1588', '1588', 1588),
    ('1806-Coquebert', '1806', '1806', 1806),
]
per_epòca = defaultdict(set)
for r in csv.DictReader(open(os.path.join(BR, 'breton-istoric.csv'), encoding='utf-8-sig'), delimiter=';'):
    per_epòca[r['limit']].add(r['insee'])

def linhas_ll(g, min_m=3000):
    out = []
    g = g.SimplifyPreserveTopology(120)
    parts = [g] if g.GetGeometryType() in (ogr.wkbLineString, ogr.wkbLineString25D) else [g.GetGeometryRef(i) for i in range(g.GetGeometryCount())]
    for p in parts:
        if p.GetGeometryType() not in (ogr.wkbLineString, ogr.wkbLineString25D) or p.Length() < min_m:
            continue
        q = p.Clone(); q.Transform(a_ll)
        out.append([[round(q.GetX(i), 4), round(q.GetY(i), 4)] for i in range(q.GetPointCount())])
    return out

istoric = []
for clau, oc, fr, an in EPÒCAS:
    cs = [geo[c] for c in per_epòca[clau] if c in geo]
    P = unir([domeni] + cs)
    l = P.Boundary().Difference(costa).Difference(bòrd)
    l = l.LineMerge() if hasattr(l, 'LineMerge') else l
    ls = linhas_ll(l)
    n = sum(len(x) for x in ls)
    print('%-15s %4d comunas, %d tròces, %d ponches, %.0f km' % (clau, len(cs), len(ls), n, l.Length() / 1000))
    istoric.append({'an': an, 'oc': oc, 'fr': fr, 'l': ls})

# ------------------------------------------------- las escòlas
noms_br = {r['insee']: r['nom_br'] for r in csv.DictReader(open(os.path.join(BR, 'noms-br.csv'), encoding='utf-8-sig'), delimiter=';')}
escolans = {}
noms_fr = {}
for r in csv.DictReader(open(os.path.join(BR, 'breton-actual.csv'), encoding='utf-8-sig'), delimiter=';'):
    if r['indicador'] == 'eleves_bilingues':
        escolans[r['insee']] = int(r['valor'])
        noms_fr[r['insee']] = r['nom']
escòlas = []
for c, n in sorted(escolans.items(), key=lambda x: -x[1]):
    if classa.get(c) in ('breton', 'mixta') or c not in geo:
        continue
    p = geo[c].PointOnSurface(); p.Transform(a_ll)
    escòlas.append([round(p.GetX(), 4), round(p.GetY(), 4), n, noms_fr[c], noms_br.get(c) or None])
print('Escòlas defòra del domeni : %d comunas, %d escolans' % (len(escòlas), sum(e[2] for e in escòlas)))

d = json.load(open(SORTIDA, encoding='utf-8'))
d['istoric'] = istoric
d['escolas'] = escòlas
FONT = " ; limites anciennes d'après Sémhur, Wikimedia Commons, CC BY-SA 4.0 (Tanguy et Lagrée 2002, Fleuriot 1982, Brekilien 1979), calées sur les communes ; écoles bilingues : Office public de la langue bretonne, rentrée 2025 (ODbL)"
d['font'] = d['font'].split(" ; limites anciennes")[0] + FONT
json.dump(d, open(SORTIDA, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('Escrich :', os.path.getsize(SORTIDA), 'octets')
