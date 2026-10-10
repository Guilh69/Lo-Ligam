# Alsacian e francic : contraròtle per la carta dels Archius nacionals (cantons
# 2013, zònas 7.2 a 7.5) : zòna AN del cap-luòc de cada comuna francesa, cara al
# classament final.
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-an.py
import csv, json, os
from collections import Counter
from osgeo import ogr
ogr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
an = ogr.Open(os.path.join(R, 'SIG', 'brut', 'oil', 'an-cantons-2013.geojson'))
zonas = [(f.GetField('N° ZONE'), f.GetField('DIALECTE'), f.GetGeometryRef().Clone()) for f in an.GetLayer(0)]
cl = {}
with open(os.path.join(R, 'SIG', 'alsacian', 'dialectes-alsacian.csv'), encoding='utf-8-sig') as f:
    for r in csv.DictReader(f, delimiter=';'):
        if r['regio'] == 'France': cl[r['codi']] = r
c = Counter()
for ft in json.load(open(os.path.join(R, 'SIG', 'brut', 'alsacian', 'comunas-fr.geojson'), encoding='utf-8'))['features']:
    p = ft['properties']
    if p['codi'] not in cl or not p.get('cap_luoc'): continue
    pt = ogr.Geometry(ogr.wkbPoint); pt.AddPoint_2D(*p['cap_luoc'])
    z = next(('%s %s' % (n, d) for n, d, g in zonas if g.Contains(pt)), '?')
    r = cl[p['codi']]
    c[(z, r['dialecte'] or r['domeni'])] += 1
for (z, d), n in sorted(c.items()):
    print('%-45s %-20s %4d' % (z, d, n))
