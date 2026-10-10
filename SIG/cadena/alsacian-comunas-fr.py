# Alsacian e francic : comunas francesas del GeoPackage IGN (Admin Express COG
# Carto 2026, Licéncia dobèrta 2.0) per Mosèla (57), Bas-Rin (67), Naut-Rin
# (68), e Meurthe-et-Moselle (54), Vosges (88), Territòri de Belfòrt (90) per
# contrarotlar la limit.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-comunas-fr.py
#
# Sortidas dins SIG/brut/alsacian/ :
#   comunas-fr.geojson      contorns WGS 84 (6 decimalas), codi = INSEE, nom, dep, populacion,
#                           canton, arrondiment ; punt = cap-luòc (IGN)
#   comunas-fr-vesins.csv   parelhs de comunas que se tòcan (limit comuna de mai de 50 m)
#   comunas-fr-delegadas.csv ancianas comunas (associadas o delegadas) e lor comuna d'ara
import csv, json, os
from osgeo import ogr, osr

ogr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
GPKG = os.path.join(R, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg')
BRUT = os.path.join(R, 'SIG', 'brut', 'alsacian')
DEPS = ('57', '67', '68', '54', '88', '90')

wgs, l93 = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326); l93.ImportFromEPSG(2154)
for s in (wgs, l93):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versW = osr.CoordinateTransformation(l93, wgs)

gp = ogr.Open(GPKG)
cl = gp.GetLayerByName('chef_lieu_de_commune')
cl.SetAttributeFilter("substr(code_insee_de_la_commune, 1, 2) IN (%s)" % ','.join("'%s'" % d for d in DEPS))
caplo = {}
for f in cl:
    g = f.GetGeometryRef().Clone(); g.Transform(versW)
    caplo[f.GetField('code_insee_de_la_commune')] = [round(g.GetX(), 5), round(g.GetY(), 5)]

lc = gp.GetLayerByName('commune')
lc.SetAttributeFilter("code_insee_du_departement IN (%s)" % ','.join("'%s'" % d for d in DEPS))
feats, geoms = [], {}
for f in lc:
    i = f.GetField('code_insee')
    g = f.GetGeometryRef().Clone()
    geoms[i] = g.Clone()
    g.Transform(versW)
    feats.append({'type': 'Feature', 'properties': {
        'codi': i, 'nom': f.GetField('nom_officiel'), 'dep': f.GetField('code_insee_du_departement'),
        'populacion': f.GetField('population'), 'canton': f.GetField('code_insee_du_canton'),
        'arrondiment': f.GetField('code_insee_de_l_arrondissement'), 'cap_luoc': caplo.get(i)},
        'geometry': json.loads(g.ExportToJson(['COORDINATE_PRECISION=6']))})
with open(os.path.join(BRUT, 'comunas-fr.geojson'), 'w', encoding='utf-8') as fo:
    json.dump({'type': 'FeatureCollection', 'font': 'IGN Admin Express COG Carto 2026 (Licence Ouverte 2.0)', 'features': feats}, fo, ensure_ascii=False)
print('comunas-fr.geojson : %d comunas' % len(feats))

# vesins : limit comuna (intersection de las bòrdas) de mai de 50 m
ids = sorted(geoms)
env = {i: geoms[i].GetEnvelope() for i in ids}
parelhs = []
for a in range(len(ids)):
    ea = env[ids[a]]
    for b in range(a + 1, len(ids)):
        eb = env[ids[b]]
        if ea[1] < eb[0] or eb[1] < ea[0] or ea[3] < eb[2] or eb[3] < ea[2]:
            continue
        x = geoms[ids[a]].Intersection(geoms[ids[b]])
        if x is None or x.IsEmpty():
            continue
        lon = x.Length() if x.GetDimension() >= 1 else 0
        if lon > 50:
            parelhs.append((ids[a], ids[b], round(lon)))
with open(os.path.join(BRUT, 'comunas-fr-vesins.csv'), 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';'); w.writerow(['a', 'b', 'limit_m']); w.writerows(parelhs)
print('comunas-fr-vesins.csv : %d parelhs' % len(parelhs))

ld = gp.GetLayerByName('commune_associee_ou_deleguee')
ld.SetAttributeFilter("substr(code_insee_de_la_commune_de_rattach, 1, 2) IN (%s)" % ','.join("'%s'" % d for d in DEPS))
with open(os.path.join(BRUT, 'comunas-fr-delegadas.csv'), 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';'); w.writerow(['insee_ancian', 'nom', 'nature', 'insee_comuna'])
    n = 0
    for f in ld:
        w.writerow([f.GetField('code_insee'), f.GetField('nom_officiel'), f.GetField('nature'), f.GetField('code_insee_de_la_commune_de_rattach')]); n += 1
print('comunas-fr-delegadas.csv : %d' % n)
