# Lo contorn de França (metropòla e Corsega) d'un sol tenent, per lo mòde
# « Lengas de França » (Romain, 2026-10-10) : una lenga alucada mòstra d'en
# primièr sa part francesa ; la carta retalha son dessenh segon aqueste
# contorn, puèi « Veire la lenga dins son environament lingüistic » mòstra la
# rèsta.
#
# Entrada : SIG/brut/regions.geojson (las 13 regions de l'IGN) ; fusionadas
# (cap de fendascla entre doas regions), simplificadas a 0,002° (~200 m).
# Sortida : app/static/data/franca.json, [[[lon, lat], ...], ...] (anèls exteriors).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/franca-contorn.py
import json, os
from osgeo import ogr

ogr.UseExceptions()
RAIC = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ENTRADA = os.path.join(RAIC, 'SIG', 'brut', 'regions.geojson')
SORTIDA = os.path.join(RAIC, 'app', 'static', 'data', 'franca.json')

ds = ogr.Open(ENTRADA)
lc = ds.GetLayer()
union = ogr.Geometry(ogr.wkbMultiPolygon)
for f in lc:
    g = f.GetGeometryRef()
    if g.GetGeometryType() in (ogr.wkbPolygon, ogr.wkbPolygon25D):
        union.AddGeometry(g)
    else:
        for i in range(g.GetGeometryCount()):
            union.AddGeometry(g.GetGeometryRef(i))
franca = union.UnionCascaded().SimplifyPreserveTopology(0.002)

aneis = []
polis = [franca] if franca.GetGeometryType() == ogr.wkbPolygon else [franca.GetGeometryRef(i) for i in range(franca.GetGeometryCount())]
for p in polis:
    ext = p.GetGeometryRef(0)
    pts = [[round(ext.GetX(i), 4), round(ext.GetY(i), 4)] for i in range(ext.GetPointCount())]
    if len(pts) >= 4 and p.GetArea() > 0.0005:  # (los ilhòts minuscules : pas besonh)
        aneis.append(pts)

with open(SORTIDA, 'w', encoding='utf-8') as s:
    json.dump(aneis, s, separators=(',', ':'))
print('franca.json', os.path.getsize(SORTIDA), 'octets,', len(aneis), 'anèls,', sum(len(a) for a in aneis), 'ponches')
