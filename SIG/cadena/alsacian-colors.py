# Alsacian e francic : colors mai frequentas d'un imatge (paleta d'una carta).
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-colors.py imatge.png [n]
import sys
import numpy as np
from osgeo import gdal
a = gdal.Open(sys.argv[1]).ReadAsArray()
if a.ndim == 2:
    print('imatge a una banda (paleta)')
    b = gdal.Open(sys.argv[1]).GetRasterBand(1)
    ct = b.GetColorTable()
    v, n = np.unique(a, return_counts=True)
    for i in np.argsort(-n)[:int(sys.argv[2]) if len(sys.argv) > 2 else 25]:
        print(v[i], ct.GetColorEntry(int(v[i])) if ct else '', n[i])
else:
    a = a[:3].transpose(1, 2, 0).reshape(-1, 3).astype(np.int64)
    c = a[:, 0].astype(np.int64) * 65536 + a[:, 1] * 256 + a[:, 2]
    v, n = np.unique(c, return_counts=True)
    for i in np.argsort(-n)[:int(sys.argv[2]) if len(sys.argv) > 2 else 25]:
        print('#%06x' % v[i], n[i])
