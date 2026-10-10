# Alsacian e francic : jaces e camps d'un fichièr vectorial (contraròtle).
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-gpkg-info.py fichièr [jaç filtre_sql]
import os, sys
from osgeo import ogr
d = ogr.Open(sys.argv[1])
for i in range(d.GetLayerCount()):
    l = d.GetLayer(i)
    if len(sys.argv) > 2 and l.GetName() != sys.argv[2]:
        continue
    dfn = l.GetLayerDefn()
    print(l.GetName(), l.GetFeatureCount(), l.GetSpatialRef().GetName() if l.GetSpatialRef() else '-',
          [dfn.GetFieldDefn(j).GetName() for j in range(dfn.GetFieldCount())])
    filtre = os.environ.get('FILTRE') or (sys.argv[3] if len(sys.argv) > 3 else None)
    if filtre:
        l.SetAttributeFilter(filtre)
        for k, f in enumerate(l):
            if k >= 5:
                break
            print('  ', {dfn.GetFieldDefn(j).GetName(): f.GetField(j) for j in range(dfn.GetFieldCount())})
