# Corse et continuum : communes italiennes (Sardaigne du Nord, Capraia) en
# géométrie terrestre précise, d'après les limites administratives ISTAT non
# généralisées au 1er janvier 2026 (licence CC BY 4.0).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/cors-istat.py
#
# Entrée : SIG/brut/cors/istat/Limiti01012026.zip, téléchargé depuis
#   https://www.istat.it/storage/cartografia/confini_amministrativi/non_generalizzati/2026/Limiti01012026.zip
#   (couche Com01012026_WGS84 : en fait UTM 32N / WGS84, EPSG:32632).
# Sortie : SIG/brut/cors/comuni-it-nord.geojson (WGS84, 6 décimales) : toutes
#   les communes de la Città metropolitana di Sassari (112), de la Provincia
#   del Nord-Est Sardegna (113) et Capraia Isola (049005). Propriétés : codi
#   (« it:» + code ISTAT), nom, nom_alt (COMUNE_A), provincia.
#   cors-classament.py en tire comuni-it-cors.geojson (communes classées).
import json, os
from osgeo import ogr, osr

ogr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
ZIP = os.path.join(R, 'SIG', 'brut', 'cors', 'istat', 'Limiti01012026.zip').replace('\\', '/')
SORTIDA = os.path.join(R, 'SIG', 'brut', 'cors', 'comuni-it-nord.geojson')
PROV = {112: 'Città metropolitana di Sassari', 113: 'Provincia del Nord-Est Sardegna', 49: 'Provincia di Livorno'}

ds = ogr.Open('/vsizip/' + ZIP + '/Com01012026/Com01012026_WGS84.shp')
lay = ds.GetLayer(0)
wgs = osr.SpatialReference()
wgs.ImportFromEPSG(4326)
wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
src = lay.GetSpatialRef()
src.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
T = osr.CoordinateTransformation(src, wgs)
lay.SetAttributeFilter("COD_UTS IN (312, 113) OR PRO_COM_T = '049005'")


def arrondir(c):
    if isinstance(c[0], (int, float)):
        return [round(c[0], 6), round(c[1], 6)]
    return [arrondir(x) for x in c]


feats = []
for f in lay:
    g = f.GetGeometryRef().Clone()
    g.Transform(T)
    gj = json.loads(g.ExportToJson())
    gj['coordinates'] = arrondir(gj['coordinates'])
    feats.append({'type': 'Feature', 'properties': {
        'codi': 'it:' + f.GetField('PRO_COM_T'), 'nom': f.GetField('COMUNE'),
        'nom_alt': f.GetField('COMUNE_A'), 'provincia': PROV.get(f.GetField('COD_PROV'), str(f.GetField('COD_PROV')))},
        'geometry': gj})
feats.sort(key=lambda x: x['properties']['codi'])
with open(SORTIDA, 'w', encoding='utf-8') as fo:
    json.dump({'type': 'FeatureCollection',
               'font': 'ISTAT, Confini delle unità amministrative a fini statistici al 1° gennaio 2026, versione non generalizzata (CC BY 4.0)',
               'features': feats}, fo, ensure_ascii=False, separators=(',', ':'))
print('%d communes -> %s (%.1f Mo)' % (len(feats), SORTIDA, os.path.getsize(SORTIDA) / 1e6))
