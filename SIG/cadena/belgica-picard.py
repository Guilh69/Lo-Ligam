# Los parlars picards de las comunas de Belgica (Tornaisian, Borain…), amb la
# meteissa carta e lo meteis calatge que per França (picard-carta.py, que
# es pas modificat : son còdi es executat fins al calatge, puèi aplicat al
# ponch interior de cada comuna belga). Carta : « Carte des variétés du
# picard », Epi2025, Wikimedia Commons, CC BY-SA 4.0 ; calatge afin sus 22
# ponches, escart mejan 7 km : una indicacion, pas mai.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/belgica-picard.py
#
# Sortida : SIG/brut/oil-belgica/parlars-picards-be.csv (codi ; parlar ; zona ;
# dist_km a la zòna colorada).
import csv, json, os
from osgeo import ogr

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
cami = os.path.join(R, 'SIG', 'cadena', 'picard-carta.py')
src = open(cami, encoding='utf-8').read()
src = src[:src.index('wgs, l93 = osr.SpatialReference()')]
g = {'__file__': cami, '__name__': 'picard_carta'}
exec(compile(src, cami, 'exec'), g)
Minv, A, W, H, asg_tot, grans, ZONA, dist_col, kmpx = (g[k] for k in ('Minv', 'A', 'W', 'H', 'asg_tot', 'grans', 'ZONA', 'dist_col', 'kmpx'))
np = g['np']
d = json.load(open(os.path.join(R, 'SIG', 'brut', 'flamenc', 'be-comunas.geojson'), encoding='utf-8'))
linhas = []
for f in d['features']:
    c = f['properties']['codi']
    if not c[3:].startswith(('5', '25', '9', '6')):
        continue
    pt = ogr.CreateGeometryFromJson(json.dumps(f['geometry'])).PointOnSurface()
    q = Minv @ (np.array([pt.GetX(), pt.GetY()]) - A[2])
    px, py = int(round(q[0])), int(round(q[1]))
    if not (0 <= px < W and 0 <= py < H):
        continue
    i = asg_tot[py, px]
    if i < 0:
        continue
    n = grans[i][0]
    linhas.append((c, n, ZONA.get(n, 'picard'), round(dist_col[py, px] * kmpx, 1)))
os.makedirs(os.path.join(R, 'SIG', 'brut', 'oil-belgica'), exist_ok=True)
with open(os.path.join(R, 'SIG', 'brut', 'oil-belgica', 'parlars-picards-be.csv'), 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['codi', 'parlar', 'zona', 'dist_km'])
    w.writerows(sorted(linhas))
print('%d comunas belgas dins la carta picarda' % len(linhas))
