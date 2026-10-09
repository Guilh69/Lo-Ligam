# Las zònas mixtas occitanas al contacte del basc (retorns de Romain,
# 2026-10-09) : las comunas basquas de tradicion gascona son dins lo basc (estat
# actual) ; del costat occitan, son de zònas mixtas en asclas (coma Ròia o
# Mónegue), de bendas de la color del gascon (« mescla ») que s'entremesclan
# amb lo verd basc, e un encadrat al survòl. Tres zònas, cadun son tèxt (lo
# tèxt de Baiona parlava pas de Bidaishe) : Baiona-Anglet-Biàrritz-lo Bocau ;
# Bidaishe e l'Ador ; Esquiula e Lishòs. Sens etiqueta sus la carta (lo nom
# « Baiona » de la zòna se sobrepausava a la vila).
#
# Entradas : SIG/basc/dialectes-basc.json (transicions « Toc1 » a « Toc3 » :
# comunas, noms, encadrats), SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg.
# Sortida : app/static/data/zonas-mixtas.geojson (las zònas « mix- » del basc
# remplaçadas, las autras gardadas). Se pòt tornar lançar.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/basc-mixtas.py
import json
import os

from osgeo import ogr, osr

ogr.UseExceptions()
RAIC = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DATA = os.path.join(RAIC, 'app', 'static', 'data')

wgs = osr.SpatialReference()
wgs.ImportFromEPSG(4326)
wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
l93 = osr.SpatialReference()
l93.ImportFromEPSG(2154)
l93.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
capWgs = osr.CoordinateTransformation(l93, wgs)

classa = json.load(open(os.path.join(RAIC, 'SIG', 'basc', 'dialectes-basc.json'), encoding='utf-8'))
gropes = [t for t in classa['transicions'] if 'comunas' in t]
KODS = {'mix-' + t['kod'][len('trans-oc-'):] for t in gropes} | {'mix-baiona'}

gp = ogr.Open(os.path.join(RAIC, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
cm = gp.GetLayerByName('commune')
codis = [c for t in gropes for c in t['comunas']]
cm.SetAttributeFilter('code_insee IN (%s)' % ','.join("'%s'" % c for c in codis))
geo = {f.GetField('code_insee'): (f.GetGeometryRef().Clone().Buffer(0), f.GetField('population') or 0) for f in cm}
manca = set(codis) - set(geo)
if manca:
    raise SystemExit('Comunas absentas : %s' % sorted(manca))


def en_geojson(g):
    c = g.Clone()
    c.Transform(capWgs)
    d = json.loads(c.ExportToJson())

    def arr(x):
        if isinstance(x, list):
            if x and isinstance(x[0], (int, float)):
                return [round(x[0], 5), round(x[1], 5)]
            return [arr(y) for y in x]
        return x

    d['coordinates'] = arr(d['coordinates'])
    return d


pM = os.path.join(DATA, 'zonas-mixtas.geojson')
M = json.load(open(pM, encoding='utf8'))
M['features'] = [f for f in M['features'] if f['properties'].get('kod') not in KODS]
for t in gropes:
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for c in t['comunas']:
        g = geo[c][0]
        for i in range(g.GetGeometryCount()) if g.GetGeometryType() == ogr.wkbMultiPolygon else [None]:
            m.AddGeometry(g.GetGeometryRef(i).Clone() if i is not None else g.Clone())
    u = m.UnaryUnion().Buffer(0).SimplifyPreserveTopology(120)
    gran = max(t['comunas'], key=lambda c: geo[c][1])
    p = geo[gran][0].PointOnSurface()
    p.Transform(capWgs)
    M['features'].append({'type': 'Feature', 'properties': {
        'kod': 'mix-' + t['kod'][len('trans-oc-'):], 'mena': 'mixta', 'mescla': 'gas',
        'oc': t['oc'], 'fr': t['fr'],
        'sota_oc': t['nota_oc'], 'sota_fr': t['nota'],
        'oc_a_validar': True,
        'encadrat': t['encadrat'],
        'eti': [round(p.GetX(), 3), round(p.GetY(), 3)],
    }, 'geometry': en_geojson(u)})
    print('%s : %d comunas, %.0f km2' % (t['kod'], len(t['comunas']), u.GetArea() / 1e6))
with open(pM, 'w', encoding='utf8') as o:
    json.dump(M, o, ensure_ascii=False, separators=(',', ':'))
