# Comunas francesas del domeni basc (demanda de Romain, 2026-10-09) : per cada
# comuna del 64, lo bailliatge de 1789 (Labord, Sola, reialme de Navarra,
# senescalcia de Baiona, Bearn) e la part de sa susfàcia dins lo domeni occitan
# de la carta (limits-carta.json). Aquela part decidís las asclas gasconas
# (Baiona, Anglet, Biàrritz…) : comunas que demòran dins lo basc (estat actual,
# causida de Romain) amb una influéncia gascona istorica.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/basc-comunas-fr.py
#
# Entradas : SIG/brut/provincias/bailliages/BAILLIAGES_1789_BRETTE.shp (Gay, Gobbi,
# Goñi 2024, d'aprèp Brette 1904, CC BY 4.0), SIG/brut/basc/comunas-fr.geojson
# (basc-brut.mjs), app/static/data/limits-carta.json (anèls del domeni occitan).
# Sortida : SIG/brut/basc/comunas-fr-info.json { insee: [bailliatge, BAIL_ID, part_oc] }.
import json, os
from collections import Counter
from osgeo import ogr, osr
ogr.UseExceptions()
osr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))

ds = ogr.Open(os.path.join(R, 'SIG/brut/provincias/bailliages/BAILLIAGES_1789_BRETTE.shp'))
ly = ds.GetLayer(0)
srs = ly.GetSpatialRef()
srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
wgs = osr.SpatialReference()
wgs.ImportFromEPSG(4326)
wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
l93 = osr.SpatialReference()
l93.ImportFromEPSG(2154)
l93.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
tr = osr.CoordinateTransformation(wgs, srs)
tr93 = osr.CoordinateTransformation(wgs, l93)
bails = [(f.GetField('BAIL_NS'), f.GetField('BAIL_ID'), f.GetGeometryRef().Clone()) for f in ly]

# Domeni occitan : anèls en règla par-impar (un anèl dins un autre = trauc).
# Sonque los anèls que tòcan l'empresa del 64, per anar d'enpressa.
EMP = (-1.9, 42.7, -0.0, 43.7)
dom = None
for anel in json.load(open(os.path.join(R, 'app/static/data/limits-carta.json'), encoding='utf-8'))['domeni']['anels']:
    xs = [p[0] for p in anel]; ys = [p[1] for p in anel]
    if max(xs) < EMP[0] or min(xs) > EMP[2] or max(ys) < EMP[1] or min(ys) > EMP[3]:
        continue
    r = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in anel: r.AddPoint_2D(x, y)
    r.CloseRings()
    p = ogr.Geometry(ogr.wkbPolygon); p.AddGeometry(r)
    p = p.MakeValid()
    dom = p if dom is None else dom.SymDifference(p)
dom.Transform(tr93)

g = json.load(open(os.path.join(R, 'SIG/brut/basc/comunas-fr.geojson'), encoding='utf-8'))
out = {}
for f in g['features']:
    p = f['properties']
    pt = ogr.Geometry(ogr.wkbPoint)
    pt.AddPoint_2D(p['mairie_lon'], p['mairie_lat'])
    pt.Transform(tr)
    b = next(((str(n), str(i)) for n, i, geo in bails if geo.Contains(pt)), (None, None))
    c = ogr.CreateGeometryFromJson(json.dumps(f['geometry'])).MakeValid()
    c.Transform(tr93)
    a = c.GetArea()
    part = c.Intersection(dom).GetArea() / a if a else 0
    out[p['insee']] = [b[0], b[1], round(part, 3)]
json.dump(out, open(os.path.join(R, 'SIG/brut/basc/comunas-fr-info.json'), 'w', encoding='utf-8'), ensure_ascii=False)
print(len(out), 'comunas ;', Counter(v[0] for v in out.values()).most_common(12))
print('part occitana >= 0,5 :', sum(1 for v in out.values() if v[2] >= 0.5), '; entre 0,05 e 0,5 :', sum(1 for v in out.values() if 0.05 <= v[2] < 0.5))
