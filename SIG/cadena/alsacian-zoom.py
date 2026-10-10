# Alsacian e francic : agrandiment d'una partida d'un imatge amb una grasilha
# graduada (pixèls de l'imatge d'origina), per legir de ponches de calatge.
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-zoom.py imatge.png sortida.png x0 y0 x1 y1 [factor] [pas]
import sys
from qgis.PyQt.QtGui import QImage, QPainter, QColor, QPen, QFont
from qgis.PyQt.QtCore import Qt, QRect
from qgis.PyQt.QtWidgets import QApplication
app = QApplication.instance() or QApplication(['x', '-platform', 'offscreen'])
src, dst = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = [int(v) for v in sys.argv[3:7]]
k = int(sys.argv[7]) if len(sys.argv) > 7 else 4
pas = int(sys.argv[8]) if len(sys.argv) > 8 else 10
im = QImage(src).copy(QRect(x0, y0, x1 - x0, y1 - y0))
im = im.scaled(im.width() * k, im.height() * k, Qt.AspectRatioMode.IgnoreAspectRatio, Qt.TransformationMode.FastTransformation)
im = im.convertToFormat(QImage.Format.Format_ARGB32)
p = QPainter(im)
p.setFont(QFont('Arial', 9))
for x in range((x0 // pas + 1) * pas, x1, pas):
    p.setPen(QPen(QColor(255, 0, 0, 200 if x % (pas * 5) == 0 else 90), 1))
    p.drawLine((x - x0) * k, 0, (x - x0) * k, im.height())
    if x % (pas * 5) == 0:
        p.drawText((x - x0) * k + 2, 12, str(x))
for y in range((y0 // pas + 1) * pas, y1, pas):
    p.setPen(QPen(QColor(255, 0, 0, 200 if y % (pas * 5) == 0 else 90), 1))
    p.drawLine(0, (y - y0) * k, im.width(), (y - y0) * k)
    if y % (pas * 5) == 0:
        p.drawText(2, (y - y0) * k - 2, str(y))
p.end()
im.save(dst)
print(dst, im.width(), im.height())
