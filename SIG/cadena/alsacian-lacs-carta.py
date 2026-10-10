# Alsacian e francic : las taças blancas (lacs) d'una carta rasterizada, amb
# lor centre e lor susfàcia en pixèls, per trobar de ponches de calatge.
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-lacs-carta.py imatge.png [xmax]
import sys
import numpy as np
from scipy import ndimage
from osgeo import gdal
a = gdal.Open(sys.argv[1]).ReadAsArray()[:3].astype(int)
blanc = (a[0] > 245) & (a[1] > 245) & (a[2] > 245)
xmax = int(sys.argv[2]) if len(sys.argv) > 2 else blanc.shape[1]
blanc[:, xmax:] = False
lab, n = ndimage.label(blanc)
# las taças que tòcan la bòrda son de fons, pas de lacs
bord = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, xmax - 1]]))
talha = np.bincount(lab.ravel())
res = []
for i in range(1, n + 1):
    if i in bord or talha[i] < 30:
        continue
    yy, xx = np.nonzero(lab == i)
    res.append((talha[i], xx.mean(), yy.mean(), xx.min(), xx.max(), yy.min(), yy.max()))
for t, x, y, x0, x1, y0, y1 in sorted(res, reverse=True)[:30]:
    print('%7d px  centre (%.1f, %.1f)  x %d-%d  y %d-%d' % (t, x, y, x0, x1, y0, y1))
