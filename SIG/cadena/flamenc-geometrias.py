# Geometrias tèrra de las comunas de Belgica, dels Païses Basses e del
# Westhoek francés, per las cartas del flamenc, del neerlandés e de la
# Belgica romana (demanda de Romain, 2026-10-10 : « il faut une géométrie
# TERRESTRE, la carte cale toutes les limites de langue sur la côte précise »).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/flamenc-geometrias.py
#
# Entradas (SIG/brut/flamenc/, fòra Git) :
#  - cbs-gemeenten-2025-rd.json : CBS Wijk- en Buurtkaart 2025, servici WFS de
#    PDOK (wijkenbuurten:gemeenten), RD New (EPSG:28992). Cada comuna i es
#    partejada en doas entitats : water = NEE (tèrra) e water = JA (mar del
#    Nòrd, Waddenzee, IJsselmeer, estuaris de Zelanda, lacs grands). Gardam
#    NEE solament.
#  - be-comunas-2025-brut.geojson : SPF Finanças (AGDP), servici INSPIRE
#    « Administrative units » nivèl 5, 565 comunas (flamenc-be-comunas.mjs).
#    Las comunas de la còsta s'arrèstan a la linha de baissa mar : las copam
#    per la còsta d'OpenStreetMap (SIG/brut/costa-osm/belgica.json, ODbL).
#  - SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg (IGN), comunas del Nòrd e del
#    Pas-de-Calais a l'entorn del Westhoek.
# Sortidas (SIG/brut/flamenc/) : nl-comunas.geojson, be-comunas.geojson,
# fr-westhoek-comunas.geojson, fr-westhoek-insee.txt, en WGS84, proprietat
# « codi » (nl:GMxxxx, be:NIS, INSEE per França).
import json, os
from osgeo import ogr, osr

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
BRUT = os.path.join(R, 'SIG', 'brut', 'flamenc')

wgs = osr.SpatialReference(); wgs.ImportFromEPSG(4326)
rd = osr.SpatialReference(); rd.ImportFromEPSG(28992)
l93 = osr.SpatialReference(); l93.ImportFromEPSG(2154)
lambBE = osr.SpatialReference(); lambBE.ImportFromEPSG(3812)
for s in (wgs, rd, l93, lambBE):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)


def escriure(nom, feats):
    out = {'type': 'FeatureCollection', 'features': feats}
    with open(os.path.join(BRUT, nom), 'w', encoding='utf-8') as fo:
        json.dump(out, fo, ensure_ascii=False, separators=(',', ':'))
    print('escrich %s (%d entitats, %.1f Mo)' % (nom, len(feats), os.path.getsize(os.path.join(BRUT, nom)) / 1e6))


def geojson(g):
    return json.loads(g.ExportToJson(['COORDINATE_PRECISION=6']))


# --- Païses Basses : CBS, tèrra solament
t = osr.CoordinateTransformation(rd, wgs)
d = json.load(open(os.path.join(BRUT, 'cbs-gemeenten-2025-rd.json'), encoding='utf-8'))
nl, aigas = [], 0.0
for f in d['features']:
    p = f['properties']
    g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
    if p['water'] == 'JA':
        aigas += g.GetArea()
        continue
    if p['water'] != 'NEE':
        continue
    area = g.GetArea() / 1e6
    g.Transform(t)
    nl.append({'type': 'Feature', 'properties': {
        'codi': 'nl:' + p['gemeentecode'], 'nom_oficial': p['gemeentenaam'], 'pais': 'NL',
        'pop': p.get('aantalInwoners'), 'km2_tèrra': round(area, 2)}, 'geometry': geojson(g)})
print('Païses Basses : %d comunas, aiga levada %.0f km2' % (len(nl), aigas / 1e6))
escriure('nl-comunas.geojson', nl)

# --- Belgica : la mar segon la còsta OSM
costa = json.load(open(os.path.join(R, 'SIG', 'brut', 'costa-osm', 'belgica.json'), encoding='utf-8'))
linhas = ogr.Geometry(ogr.wkbMultiLineString)
for e in costa['elements']:
    if e['type'] != 'way':
        continue
    l = ogr.Geometry(ogr.wkbLineString)
    for n in e['geometry']:
        l.AddPoint_2D(n['lon'], n['lat'])
    linhas.AddGeometry(l)
# quadre de la zòna telecargada (s 50.95, o 2.4, n 51.5, e 3.8) : clau los traits
quadre = ogr.CreateGeometryFromWkt('LINESTRING (2.4 50.95, 2.4 51.5, 3.8 51.5, 3.8 50.95, 2.4 50.95)')
ret = linhas.Union(quadre)
polis = ret.Polygonize()
mar = None
punt = ogr.CreateGeometryFromWkt('POINT (2.8 51.4)')
for i in range(polis.GetGeometryCount()):
    p = polis.GetGeometryRef(i)
    if p.Contains(punt):
        mar = p.Clone()
print('Mar del Nòrd (zòna belga) : %s' % ('trobada' if mar else 'PAS TROBADA'))
tbe = osr.CoordinateTransformation(wgs, lambBE)
d = json.load(open(os.path.join(BRUT, 'be-comunas-2025-brut.geojson'), encoding='utf-8'))
be = []
for f in d['features']:
    p = f['properties']
    g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
    levat = 0.0
    if mar is not None and g.Intersects(mar):
        a0 = g.Clone(); a0.Transform(tbe)
        g2 = g.Difference(mar)
        a1 = g2.Clone(); a1.Transform(tbe)
        levat = (a0.GetArea() - a1.GetArea()) / 1e6
        if levat > 0.001:
            print('  be:%s : %.2f km2 de mar levats' % (p['nationalCode'], levat))
            g = g2
    a = g.Clone(); a.Transform(tbe)
    be.append({'type': 'Feature', 'properties': {
        'codi': 'be:' + p['nationalCode'], 'pais': 'BE', 'km2_tèrra': round(a.GetArea() / 1e6, 2),
        'km2_mar_levats': round(levat, 2)}, 'geometry': geojson(g)})
escriure('be-comunas.geojson', be)

# --- França : comunas del Nòrd e del Pas-de-Calais a l'entorn del Westhoek
tfr = osr.CoordinateTransformation(l93, wgs)
gp = ogr.Open(os.path.join(R, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
lay = gp.GetLayerByName('commune')
lay.SetAttributeFilter("code_insee_du_departement IN ('59', '62')")
# encastre larg : de Calais e Sant-Omer a Lilla e a la Lis
lay.SetSpatialFilterRect(610000, 7040000, 715000, 7120000)
fr, codis = [], []
for f in lay:
    g = f.GetGeometryRef().Clone()
    g.Transform(tfr)
    c = f.GetField('code_insee')
    codis.append(c)
    fr.append({'type': 'Feature', 'properties': {
        'codi': c, 'nom_oficial': f.GetField('nom_officiel'), 'pais': 'FR',
        'pop': f.GetField('population'), 'arrondissement': f.GetField('code_insee_de_l_arrondissement'),
        'canton': f.GetField('code_insee_du_canton')}, 'geometry': geojson(g)})
escriure('fr-westhoek-comunas.geojson', fr)
open(os.path.join(BRUT, 'fr-westhoek-insee.txt'), 'w').write('\n'.join(sorted(codis)))
# comunas associadas de Dunkerque e autras (Malo, Rosendaël, Petite-Synthe…)
lay = gp.GetLayerByName('commune_associee_ou_deleguee')
lay.SetSpatialFilterRect(610000, 7040000, 715000, 7120000)
ca = []
for f in lay:
    g = f.GetGeometryRef().Clone()
    g.Transform(tfr)
    props = {k: f.GetField(k) for k in ('code_insee', 'nom_officiel', 'code_insee_de_la_commune_de_rattach') if f.GetFieldIndex(k) >= 0}
    ca.append({'type': 'Feature', 'properties': props, 'geometry': geojson(g)})
escriure('fr-westhoek-comunas-associadas.geojson', ca)
