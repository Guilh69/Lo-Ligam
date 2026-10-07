# Netejatge de dialectes.geojson (2026-10-07, retorn de Romain : « perqué i a
# un trauc ? » a Bourg-Lastic). La lectura de las colors de la carta
# Occitanica laissa d'illòts minúsculs (una letra, un simbòl pres per una
# color) e de traucs voids. Aquí : los tròces de dialècte de mens de 20 km²
# son levats, e los traucs de mens de 20 km² son tampats, levat se una zòna
# mixta los explica (Ròia). Los traucs grands (estanh de Bèrra : d'aiga)
# demòran. Las coordenadas son pas tocadas : sonque d'anèls levats.
import json
from osgeo import ogr, osr
ogr.UseExceptions()
D = 'C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/static/data/'
LIMIT = 20e6  # m²
wgs, m = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326); m.ImportFromEPSG(3035)
for s in (wgs, m): s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
T = osr.CoordinateTransformation(wgs, m)

def poli(anels):
    g = ogr.CreateGeometryFromJson(json.dumps({'type': 'Polygon', 'coordinates': anels}))
    g.Transform(T)
    return g

dial = json.load(open(D + 'dialectes.geojson', encoding='utf-8'))
mix = [poli(p) for f in json.load(open(D + 'zonas-mixtas.geojson', encoding='utf-8'))['features']
       for p in (f['geometry']['coordinates'] if f['geometry']['type'] == 'MultiPolygon' else [f['geometry']['coordinates']])]
for f in dial['features']:
    g = f['geometry']
    parts = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    novèlas = []
    for p in parts:
        a = poli([p[0]]).GetArea()
        if a < LIMIT:
            print('illòt levat', f['properties']['kod'], '%.1f km2' % (a / 1e6), p[0][0])
            continue
        gardats = [p[0]]
        for h in p[1:]:
            t = poli([h])
            ta = t.GetArea()
            explicat = any(t.Intersection(x).GetArea() > 0.01 * ta for x in mix)
            if ta < LIMIT and not explicat:
                if ta > 0.5e6: print('trauc tampat', f['properties']['kod'], '%.2f km2' % (ta / 1e6), h[0])
                continue
            gardats.append(h)
        novèlas.append(gardats)
    f['geometry'] = {'type': 'MultiPolygon', 'coordinates': novèlas} if len(novèlas) > 1 else {'type': 'Polygon', 'coordinates': novèlas[0]}
    if g['type'] == 'MultiPolygon' and len(novèlas) == 1:
        f['geometry'] = {'type': 'MultiPolygon', 'coordinates': novèlas}
json.dump(dial, open(D + 'dialectes.geojson', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
