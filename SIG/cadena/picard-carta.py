# Los parlars picards d'aprèp la carta de Wikipèdia (Romain, 2026-10-10 : « tu
# as une carte sur Wikipédia qui montre les parlers, essaie de t'en servir ») :
# calatge de la carta, zònas de color (rochi, autres parlars, picard gasanhat
# sul flamand) copadas per sos traits blancs, puèi lo parlar de cada comuna.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/picard-carta.py
#
# Entradas :
#  - Modules_cors/Autras_lengas/Oil/Picard_carte_wiki.png : « Carte des
#    variétés du picard », Epi2025, Wikimedia Commons, CC BY-SA 4.0 ;
#  - SIG/oil/gcp-picard.csv : ponches de calatge (bocals de la còsta, vilas
#    que donan lor nom als parlars) ;
#  - SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg (cap-luòc de las comunas, IGN).
# Sortida : SIG/oil/parlars-picards.csv (insee ; parlar ; zòna ; distància a
# la zòna colorada en km). oil.py la legís per las comunas picardas dels
# Archius nacionals. Una zòna de color amb mantun nom es partejada al nom pus
# pròche ; los pixèls sens nom (letras, traits) prenon lo parlar pus pròche.
# La carta es esquematica : a l'escala de la comuna, una indicacion.
import csv, math, os
import numpy as np
from scipy import ndimage
from osgeo import gdal, ogr, osr

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
IMG = os.path.join(R, 'Modules_cors', 'Autras_lengas', 'Oil', 'Picard_carte_wiki.png')
SORTIDA = os.path.join(R, 'SIG', 'oil', 'parlars-picards.csv')

a = gdal.Open(IMG).ReadAsArray()[:3].transpose(1, 2, 0).astype(np.int32)
H, W = a.shape[:2]

# colors de la carta (O : rochi, G : autres parlars, L : picard gasanhat sul
# flamand), lo fons e los traits
REF = {'O': (251, 184, 112), 'G': (90, 175, 32), 'L': (165, 195, 130), 'crema': (255, 255, 213),
       'mar': (190, 230, 250), 'blanc': (255, 255, 255), 'negre': (0, 0, 0)}
noms = list(REF)
dist = np.stack([((a - np.array(REF[k])) ** 2).sum(axis=2) for k in noms])
cls = np.array(noms)[dist.argmin(axis=0)]
for k in ('O', 'G', 'L'):
    print('%s : %d pixèls' % (k, (cls == k).sum()))

PARLARS = [
    ('Dunkerquois', 555, 48, 'L'), ('Calaisien', 371, 106, 'L'), ('Audomarois', 500, 221, 'L'),
    ('Boulonnais', 335, 279, 'L'), ('Circum-Lillois', 789, 250, 'L'),
    ('Chti/Artésien urbain', 655, 371, 'G'), ('Saint-Polois', 514, 412, 'G'), ('Artésien rural', 653, 453, 'G'),
    ('Variétés du Ponthieu', 410, 546, 'G'), ('Variétés du Vimeu', 320, 653, 'G'), ('Amiénois', 609, 736, 'G'),
    ('Beauvaisis', 518, 994, 'G'), ('Vermandois', 865, 770, 'G'), ('Thiérachien', 1151, 756, 'G'),
    ('Lillois', 879, 346, 'O'), ('Tournaisien', 995, 256, 'O'), ('Borain', 1162, 357, 'O'),
    ('Valenciennois', 1049, 409, 'O'), ('Chti/Douaisien', 907, 449, 'O'), ('Kimberlot', 881, 566, 'O'),
    ('Avesnois', 1121, 553, 'O')]
ZONA = {'Chti/Artésien urbain': 'chti', 'Chti/Douaisien': 'chti'}
for n in ('Lillois', 'Tournaisien', 'Borain', 'Valenciennois', 'Kimberlot', 'Avesnois'):
    ZONA[n] = 'rouchi'

yy, xx = np.mgrid[0:H, 0:W]
# las zònas de color de mai de 2000 pixèls (pas los traucs de las letras)
COMP, gran = {}, {}
for c in ('O', 'G', 'L'):
    comp, nc = ndimage.label(cls == c)
    talha = np.bincount(comp.ravel())
    talha[0] = 0
    COMP[c] = comp
    gran[c] = talha[comp] > 2000
# lo grani de cada nom : lo pixèl de sa color pus pròche de l'etiqueta, dins una zòna granda
grans = []
for n, x, y, c in PARLARS:
    y0, y1, x0, x1 = max(0, y - 60), min(H, y + 60), max(0, x - 60), min(W, x + 60)
    m = gran[c][y0:y1, x0:x1]
    if not m.any():
        print('ATENCION : cap de pixèl %s a l\'entorn de %s' % (c, n))
        continue
    d2 = (yy[y0:y1, x0:x1] - y) ** 2 + (xx[y0:y1, x0:x1] - x) ** 2
    d2 = np.where(m, d2, 1 << 30)
    k = np.unravel_index(d2.argmin(), d2.shape)
    grans.append((n, y0 + k[0], x0 + k[1], c))

asg = np.full((H, W), -1, dtype=np.int32)
for c in ('O', 'G', 'L'):
    comp = COMP[c]
    per = {}
    for i, (n, gy, gx, gc) in enumerate(grans):
        if gc == c:
            per.setdefault(comp[gy, gx], []).append(i)
    for cid, idx in per.items():
        m = comp == cid
        if len(idx) == 1:
            asg[m] = idx[0]
        else:
            py, px = np.nonzero(m)
            d = np.stack([(py - grans[i][1]) ** 2 + (px - grans[i][2]) ** 2 for i in idx])
            asg[py, px] = np.array(idx)[d.argmin(axis=0)]
colorat = np.isin(cls, ['O', 'G', 'L'])
# los pixèls sens nom (letras, traits, tròces sens etiqueta) : lo parlar pus pròche
_, (iy, ix) = ndimage.distance_transform_edt(asg < 0, return_indices=True)
asg_tot = asg[iy, ix]
dist_col = ndimage.distance_transform_edt(~colorat)
print('Pixèls colorats sens nom, rengats al pus pròche : %d' % (colorat & (asg < 0)).sum())
for i, (n, gy, gx, gc) in enumerate(grans):
    print('  grani %-24s (%d, %d) %s : %d pixèls' % (n, gx, gy, gc, (asg == i).sum()))

# calatge : afinitat lon/lat <- pixèls, mendres carrats
gcp = list(csv.DictReader(open(os.path.join(R, 'SIG', 'oil', 'gcp-picard.csv'), encoding='utf-8'), delimiter=';'))
P = np.array([[float(g['px_x']), float(g['px_y']), 1.0] for g in gcp])
L = np.array([[float(g['lon']), float(g['lat'])] for g in gcp])
A, *_ = np.linalg.lstsq(P, L, rcond=None)
res = P @ A - L
km = np.hypot(res[:, 0] * 111.32 * math.cos(math.radians(50.2)), res[:, 1] * 110.57)
for g, e in zip(gcp, km):
    print('  %-24s %5.1f km' % (g['nom'], e))
print('Calatge : escart mejan %.1f km, lo pus marrit %.1f km' % (km.mean(), km.max()))
M = A[:2].T  # [lon, lat] = M @ [px, py] + A[2]
Minv = np.linalg.inv(M)
kmpx = math.hypot(M[0, 0] * 111.32 * math.cos(math.radians(50.2)), M[1, 0] * 110.57)
print('Escala : %.3f km per pixèl' % kmpx)

wgs, l93 = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326)
l93.ImportFromEPSG(2154)
for s in (wgs, l93):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versW = osr.CoordinateTransformation(l93, wgs)
gp = ogr.Open(os.path.join(R, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
cl = gp.GetLayerByName('chef_lieu_de_commune')
cl.SetAttributeFilter("substr(code_insee_de_la_commune, 1, 2) IN ('59', '62', '80', '60', '02', '76', '08', '27', '95', '77', '51')")
linhas, comptes = [], {}
for f in cl:
    g = f.GetGeometryRef().Clone()
    g.Transform(versW)
    q = Minv @ (np.array([g.GetX(), g.GetY()]) - A[2])
    px, py = int(round(q[0])), int(round(q[1]))
    if not (0 <= px < W and 0 <= py < H):
        continue
    i = asg_tot[py, px]
    if i < 0:
        continue
    n = grans[i][0]
    dk = dist_col[py, px] * kmpx
    linhas.append((f.GetField('code_insee_de_la_commune'), n, ZONA.get(n, 'picard'), round(dk, 1)))
    if dk == 0:
        comptes[n] = comptes.get(n, 0) + 1
with open(SORTIDA, 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['insee', 'parlar', 'zona', 'dist_km'])
    w.writerows(sorted(linhas))
print('Comunas dins la carta : %d (%d dins una zòna colorada)' % (len(linhas), sum(comptes.values())))
for n, k in sorted(comptes.items(), key=lambda x: -x[1]):
    print('  %-24s %4d' % (n, k))
