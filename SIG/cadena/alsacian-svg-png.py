# Alsacian e francic : rasteriza un SVG (Qt de QGIS) per lo poder agachar.
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-svg-png.py entrada.svg sortida.png [largor]
import sys
try:
    from qgis.PyQt.QtSvg import QSvgRenderer
    from qgis.PyQt.QtGui import QImage, QPainter, QColor
    from qgis.PyQt.QtWidgets import QApplication
except Exception as e:
    print('Qt manca :', e)
    raise
app = QApplication.instance() or QApplication(['x', '-platform', 'offscreen'])
r = QSvgRenderer(sys.argv[1])
s = r.defaultSize()
L = int(sys.argv[3]) if len(sys.argv) > 3 else s.width()
H = int(round(s.height() * L / s.width()))
img = QImage(L, H, QImage.Format.Format_ARGB32)
img.fill(QColor(255, 255, 255))
p = QPainter(img)
r.render(p)
p.end()
img.save(sys.argv[2])
print('%s : %dx%d -> %dx%d' % (sys.argv[2], s.width(), s.height(), L, H))
