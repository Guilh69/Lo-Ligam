# Vectorise un masque (pixels de la carte Occitanica, 4000 px) en polygones
# géographiques : contours → simplification → calage polynomial (Lambert-93)
# → WGS84. Usage : python vectorizar.py masca.png sortida.geojson [valeur]
import sys, json
from osgeo import gdal, ogr, osr

dir_ = sys.argv[0].rsplit('\\', 1)[0].rsplit('/', 1)[0] + '/'
entrada, sortida = sys.argv[1], sys.argv[2]
valor = int(sys.argv[3]) if len(sys.argv) > 3 else 255
T = json.load(open(dir_ + 'transfo.json'))['T']
NX, NY = 2000.0, 1136.0

def poly(x, y):
    u, v = (x - NX) / NX, (y - NY) / NY
    b = [1, u, v, u * u, u * v, v * v]
    return sum(T[0][k] * b[k] for k in range(6)), sum(T[1][k] * b[k] for k in range(6))

src = gdal.Open(dir_ + entrada)
src.SetGeoTransform((0, 1, 0, 0, 0, 1))  # coordonnées = pixels (y vers le bas)
banda = src.GetRasterBand(1)
mem = ogr.GetDriverByName('Memory').CreateDataSource('m')
lay = mem.CreateLayer('p', geom_type=ogr.wkbPolygon)
lay.CreateField(ogr.FieldDefn('v', ogr.OFTInteger))
gdal.Polygonize(banda, None, lay, 0)

l93, wgs = osr.SpatialReference(), osr.SpatialReference()
l93.ImportFromEPSG(2154)
wgs.ImportFromEPSG(4326)
wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
l93.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
ct = osr.CoordinateTransformation(l93, wgs)

feats = []
for f in lay:
    if f.GetField('v') != valor:
        continue
    g = f.GetGeometryRef().SimplifyPreserveTopology(1.2)
    if g.GetArea() < 400:
        continue
    anels = []
    for i in range(g.GetGeometryCount()):
        r = g.GetGeometryRef(i)
        pts = []
        for k in range(r.GetPointCount()):
            X, Y = poly(r.GetX(k), r.GetY(k))
            lon, lat, _ = ct.TransformPoint(X, Y)
            pts.append([round(lon, 4), round(lat, 4)])
        anels.append(pts)
    feats.append({'type': 'Feature', 'properties': {'v': valor}, 'geometry': {'type': 'Polygon', 'coordinates': anels}})
json.dump({'type': 'FeatureCollection', 'features': feats}, open(dir_ + sortida, 'w'))
print('polygones', len(feats), 'anneaux', sum(len(f['geometry']['coordinates']) for f in feats), 'points', sum(len(a) for f in feats for a in f['geometry']['coordinates']))
