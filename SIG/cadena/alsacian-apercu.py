# Alsacian e francic : apercebut de contraròtle (PNG) del classament final,
# comuna per comuna, per agachar la coeréncia (pas per la carta del site).
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-apercu.py sortida.png [largor_px]
import csv, os, sys
import numpy as np
from osgeo import gdal, ogr, osr

gdal.UseExceptions(); ogr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
BRUT = os.path.join(R, 'SIG', 'brut', 'alsacian')
cl = {}
with open(os.path.join(R, 'SIG', 'alsacian', 'dialectes-alsacian.csv'), encoding='utf-8-sig') as f:
    for r in csv.DictReader(f, delimiter=';'):
        cl[r['codi']] = r
COL = {'letzebuergesch': (230, 120, 160), 'moselfrankisch': (180, 90, 200), 'rheinfrankisch': (70, 90, 180), 'sudfrankisch': (90, 160, 230),
       'ripuarisch': (120, 60, 140), 'limburgisch': (200, 200, 60), 'niederalemannisch': (60, 170, 90), 'hochalemannisch': (20, 110, 50),
       'hochstalemannisch': (10, 60, 30), 'schwabisch': (150, 210, 120), 'roman': (240, 200, 170), 'incert': (200, 200, 200)}
noms = list(COL)
mem = ogr.GetDriverByName('Memory').CreateDataSource('m')
laea = osr.SpatialReference(); laea.ImportFromEPSG(3035); laea.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
wgs = osr.SpatialReference(); wgs.ImportFromEPSG(4326); wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
tr = osr.CoordinateTransformation(wgs, laea)
ly = mem.CreateLayer('c', laea, ogr.wkbMultiPolygon)
ly.CreateField(ogr.FieldDefn('k', ogr.OFTInteger)); ly.CreateField(ogr.FieldDefn('m', ogr.OFTInteger))
for nom in ('comunas-fr.geojson', 'de-comunas.geojson', 'ch-comunas.geojson', 'lu-comunas.geojson', 'be-comunas.geojson'):
    ds = ogr.Open(os.path.join(BRUT, nom))
    for ft in ds.GetLayer(0):
        r = cl.get(ft.GetField('codi'))
        if not r: continue
        k = r['dialecte'] if r['dialecte'] else ('roman' if r['domeni'] in ('roman', 'mixta') else 'incert')
        o = ogr.Feature(ly.GetLayerDefn())
        o.SetField('k', noms.index(k) + 1); o.SetField('m', 1 if (r['domeni'] == 'mixta' or r['transicio']) else 0)
        g = ft.GetGeometryRef().Clone(); g.Transform(tr); o.SetGeometry(g); ly.CreateFeature(o)
x0, x1, y0, y1 = ly.GetExtent()
L = int(sys.argv[2]) if len(sys.argv) > 2 else 1400
H = int(L * (y1 - y0) / (x1 - x0))
def rast(camp, contorn=False):
    d = gdal.GetDriverByName('MEM').Create('', L, H, 1, gdal.GDT_Byte)
    d.SetGeoTransform((x0, (x1 - x0) / L, 0, y1, 0, -(y1 - y0) / H)); d.SetProjection(laea.ExportToWkt())
    gdal.RasterizeLayer(d, [1], ly, options=['ATTRIBUTE=' + camp] + (['ALL_TOUCHED=TRUE'] if contorn else []))
    return d.ReadAsArray()
k = rast('k'); m = rast('m')
img = np.full((3, H, L), 255, np.uint8)
for i, n in enumerate(noms):
    for c in range(3):
        img[c][k == i + 1] = COL[n][c]
# regas sus las comunas amb transicion
yy, xx = np.mgrid[0:H, 0:L]
reg = (m == 1) & (((xx + yy) // 3) % 3 == 0)
for c in range(3):
    img[c][reg] = (img[c][reg] * 0.55).astype(np.uint8)
out = gdal.GetDriverByName('MEM').Create('', L, H, 3, gdal.GDT_Byte)
for c in range(3): out.GetRasterBand(c + 1).WriteArray(img[c])
gdal.GetDriverByName('PNG').CreateCopy(sys.argv[1], out)
print(sys.argv[1], L, H, ' '.join('%s=%s' % (n, COL[n]) for n in noms))
