# Bailliatge de 1789 e arrondiment de cada comuna francesa del domeni arpitan
# (demanda de Romain, 2026-10-09) : los parlars arpitans de França seguisson
# los país istorics (Brêssa, Bugèy, Domba, Gèx, Biôjolês, Forêz, Mâconês...).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/arpitan-bailliages.py
#
# Entradas : SIG/brut/provincias/bailliages/BAILLIAGES_1789_BRETTE.shp (Gay, Gobbi,
# Goñi 2024, d'aprèp Brette 1904, CC BY 4.0 ; vejatz provincias.py),
# SIG/brut/arpitan/comunas-fr.geojson (ponch de la comuna),
# SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg (arrondiment, IGN, Licéncia dobèrta).
# Sortida : SIG/brut/arpitan/bailliages.json { insee: [bailliatge, BAIL_ID, arrondiment] } ;
# la Savòia (sarda en 1789) a pas de bailliatge (null).
import json, os, sys
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
tr = osr.CoordinateTransformation(wgs, srs)
bails = [(f.GetField('BAIL_NS'), f.GetField('BAIL_ID'), f.GetGeometryRef().Clone()) for f in ly]

gp = ogr.Open(os.path.join(R, 'SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg'))
arr = {f.GetField('code_insee'): f.GetField('code_insee_de_l_arrondissement') for f in gp.GetLayerByName('commune')}

g = json.load(open(os.path.join(R, 'SIG/brut/arpitan/comunas-fr.geojson'), encoding='utf-8'))
out = {}
for f in g['features']:
    p = f['properties']
    pt = ogr.Geometry(ogr.wkbPoint)
    pt.AddPoint_2D(p['mairie_lon'], p['mairie_lat'])
    pt.Transform(tr)
    b = next(((str(n), str(i)) for n, i, geo in bails if geo.Contains(pt)), (None, None))
    out[p['insee']] = [b[0], b[1], arr.get(p['insee'])]
json.dump(out, open(os.path.join(R, 'SIG/brut/arpitan/bailliages.json'), 'w', encoding='utf-8'), ensure_ascii=False)
print(len(out), 'comunas ;', Counter(v[0] for v in out.values()).most_common(12))
print('sens arrondiment :', [k for k, v in out.items() if not v[2]][:10])
