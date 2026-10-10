# Breton, étape 1 : les communes de Bretagne (22, 29, 35, 44, 56) avec leur
# point intérieur, leurs voisines (limite commune) et le canton de 2013 de la
# carte linguistique des Archives nationales qui les contient (zone « 6 breton » ou autre).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/breton-comunas.py
#
# Entrées : SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg (IGN, Licence ouverte 2.0),
#            SIG/brut/oil/an-cantons-2013.geojson (Archives nationales, cantons 2013).
# Sortie : SIG/brut/breton/comunas-bzh.json
#   { insee: { nom, dep, pop, lon, lat, canton, zona, vesinas: [insee…] } }
import json, os
from osgeo import ogr, osr
ogr.UseExceptions()
osr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
DEPS = ('22', '29', '35', '44', '56')

l93, wgs = osr.SpatialReference(), osr.SpatialReference()
l93.ImportFromEPSG(2154)
wgs.ImportFromEPSG(4326)
for s in (l93, wgs):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versW = osr.CoordinateTransformation(l93, wgs)

gp = ogr.Open(os.path.join(R, 'SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg'))
ly = gp.GetLayerByName('commune')
ly.SetAttributeFilter("code_insee_du_departement IN (%s)" % ','.join("'%s'" % d for d in DEPS))
com = {}
for f in ly:
    g = f.GetGeometryRef().Clone()
    p = g.PointOnSurface()
    p.Transform(versW)
    com[f.GetField('code_insee')] = {
        'nom': f.GetField('nom_officiel'), 'dep': f.GetField('code_insee_du_departement'),
        'pop': f.GetField('population'), 'lon': round(p.GetX(), 5), 'lat': round(p.GetY(), 5),
        'geom': g, 'env': g.GetEnvelope()}
print('Comunas : %d' % len(com))

# voisines : enveloppes qui se touchent, puis intersection réelle (tolérance 1 m)
claus = sorted(com)
for k in claus:
    com[k]['vesinas'] = []
for i, a in enumerate(claus):
    ea = com[a]['env']
    ga = com[a]['geom'].Buffer(1)
    for b in claus[i + 1:]:
        eb = com[b]['env']
        if eb[0] > ea[1] + 2 or eb[1] < ea[0] - 2 or eb[2] > ea[3] + 2 or eb[3] < ea[2] - 2:
            continue
        if ga.Intersects(com[b]['geom']):
            com[a]['vesinas'].append(b)
            com[b]['vesinas'].append(a)

# canton AN de 2013 qui contient le point intérieur de la commune
an = ogr.Open(os.path.join(R, 'SIG/brut/oil/an-cantons-2013.geojson'))
cl = an.GetLayer(0)
cantons = []
for f in cl:
    g = f.GetGeometryRef()
    if g is None:
        continue
    cantons.append((f.GetField('CANTON'), str(f.GetField('N° ZONE')), f.GetField('DIALECTE'), g.Clone(), g.GetEnvelope()))
for k, c in com.items():
    pt = ogr.Geometry(ogr.wkbPoint)
    pt.AddPoint_2D(c['lon'], c['lat'])
    c['canton'], c['zona'] = None, None
    for nom, zona, dial, g, e in cantons:
        if e[0] <= c['lon'] <= e[1] and e[2] <= c['lat'] <= e[3] and g.Contains(pt):
            c['canton'], c['zona'] = nom, '%s %s' % (zona, dial)
            break

for c in com.values():
    del c['geom'], c['env']
os.makedirs(os.path.join(R, 'SIG/brut/breton'), exist_ok=True)
with open(os.path.join(R, 'SIG/brut/breton/comunas-bzh.json'), 'w', encoding='utf-8') as fo:
    json.dump(com, fo, ensure_ascii=False)
from collections import Counter
print(Counter((c['dep'], c['zona']) for c in com.values()).most_common())
print('Sens canton : %s' % [k for k, c in com.items() if not c['canton']][:20])
