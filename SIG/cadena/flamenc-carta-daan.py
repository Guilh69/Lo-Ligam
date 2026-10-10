# Dialèctes neerlandeses comuna per comuna, d'aprèp la carta « Dutch-dialects.svg »
# de Wikimedia Commons (Jeroen, 2008, CC BY-SA 3.0 / GFDL ; « The data has for
# the most part been taken from the classification the dialectologist Jo Daan
# has made » : es lo clafiment de Daan e Blok, 1969, représ per la Wikipèdia
# neerlandesa, article « Nederlandse dialecten »).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/flamenc-carta-daan.py
#
# Entradas : SIG/brut/flamenc/fonts/en-1920.png (rendut 1920 px de la SVG per
# Wikimedia), SIG/brut/flamenc/{nl,be}-comunas.geojson (flamenc-geometrias.py).
# Sortidas : SIG/brut/flamenc/daan-comunas.csv (per comuna : part de cada zòna
# numerotada de la carta), daan-calat.tif (contraròtle), daan-contraròtle.png.
# Calatge automatic (flamenc-calatge.py) : lo contorn de la tèrra de la carta
# sus las comunas tèrra (Païses Basses, Flandres, Brussèlas), levat la Frisa
# (blanca sus la carta, coma la mar).
import csv, importlib.util, os
import numpy as np
from scipy import ndimage
from osgeo import gdal

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
spec = importlib.util.spec_from_file_location('calatge', os.path.join(R, 'SIG', 'cadena', 'flamenc-calatge.py'))
cal = importlib.util.module_from_spec(spec); spec.loader.exec_module(cal)
BRUT = os.path.join(R, 'SIG', 'brut', 'flamenc')

a = gdal.Open(os.path.join(BRUT, 'fonts', 'en-1920.png')).ReadAsArray().astype(np.int32)
rgb, alpha = a[:3].transpose(1, 2, 0), a[3]
H, W = alpha.shape
PAL = {'A': (207, 231, 242), 'B': (241, 203, 203), 'C': (233, 224, 247), 'D': (195, 237, 206),
       'E': (255, 228, 181), 'F': (237, 241, 185), 'FL': (219, 227, 226),
       'trait': (60, 57, 50), 'negre': (0, 0, 0)}
noms = list(PAL)
d = np.stack([((rgb - np.array(PAL[k])) ** 2).sum(axis=2) for k in noms])
cls = np.array(noms, dtype=object)[d.argmin(axis=0)]
cls[alpha < 128] = 'fons'
pastel = np.isin(cls, ['A', 'B', 'C', 'D', 'E', 'F', 'FL'])
# tèrra = pastèls + traits + los traucs pichons (chifras, ponches)
terra = pastel | (cls == 'trait')
traucs = ndimage.binary_fill_holes(terra) & ~terra
lab, n = ndimage.label(traucs)
talha = np.bincount(lab.ravel()); talha[0] = 0
terra |= (talha[lab] < 6000) & (lab > 0)
print('Tèrra de la carta : %d pixèls' % terra.sum())

# zònas : componentas connèxas de cada color pastèl, nomenadas pels grans
GRANS = {'1': (310, 1830, 'A'), '3': (865, 1075, 'B'), '4': (893, 1289, 'B'), '5': (1022, 768, 'B'),
         '6': (942, 781, 'B'), '7': (897, 712, 'B'), '8': (984, 601, 'B'), '10': (1514, 225, 'C'),
         '11': (1669, 187, 'C'), '12': (1525, 444, 'C'), '13': (1685, 375, 'C'), '14': (1677, 514, 'C'),
         '15': (1824, 802, 'C'), '16': (1737, 942, 'C'), '17': (1557, 808, 'C'), '18': (1359, 920, 'C'),
         'FL': (1268, 756, 'FL'), '19': (1134, 1046, 'D'), '20': (1455, 1124, 'E'), '21': (1236, 1359, 'E'),
         '22': (1025, 1771, 'E'), '23': (624, 1798, 'E'), '24': (1418, 1787, 'F')}
ZONAS = list(GRANS) + ['2', '9']
zid = {z: i for i, z in enumerate(ZONAS)}
zona = np.full((H, W), -1, dtype=np.int32)
for c in ('A', 'B', 'C', 'D', 'E', 'F', 'FL'):
    comp, nc = ndimage.label(cls == c)  # 4-connexitat : los traits fins separan
    talha = np.bincount(comp.ravel()); talha[0] = 0
    vist = {}
    for z, (x, y, gc) in GRANS.items():
        if gc != c:
            continue
        # lo pixèl de la color pus pròche del centre de la chifra
        y0, y1, x0, x1 = max(0, y - 60), y + 60, max(0, x - 60), x + 60
        sub = comp[y0:y1, x0:x1]
        yy, xx = np.nonzero(sub > 0)
        if not len(yy):
            print('ATENCION : pas de color %s a l\'entorn de %s' % (c, z)); continue
        i = np.argmin((yy + y0 - y) ** 2 + (xx + x0 - x) ** 2)
        k = sub[yy[i], xx[i]]
        vist[k] = z
        zona[comp == k] = zid[z]
    # componentas sens chifra
    for k in range(1, nc + 1):
        if k in vist or talha[k] < 30:
            continue
        ys, xs = np.nonzero(comp == k)
        cy, cx = ys.mean(), xs.mean()
        if c == 'A':
            z = '2'   # las illas de Zelanda (la Flandres zelandesa es dins la componenta de la zòna 1)
        elif c == 'B' and cy < 470 and cx > 1050:
            z = '9'   # illas de la Frisa e vilas de la Frisa (bildts, stadsfries, amelands, midslands)
        elif c == 'FL':
            z = 'FL'
        else:
            # la zòna numerotada de la meteissa color pus pròcha
            best, bd = None, 1e18
            for zz, (x, y, gc) in GRANS.items():
                if gc == c and (x - cx) ** 2 + (y - cy) ** 2 < bd:
                    best, bd = zz, (x - cx) ** 2 + (y - cy) ** 2
            z = best
        zona[comp == k] = zid[z]
        print('  componenta %s sens chifra (%d px, %.0f, %.0f) -> %s' % (c, talha[k], cx, cy, z))
zona_tota = cal.emplenar(zona, terra)


# calatge : afinitat puèi deformacion lisa del contorn
ESCLUSAS_FRISA = {'Achtkarspelen', 'Ameland', 'Dantumadiel', 'De Fryske Marren', 'Harlingen', 'Heerenveen',
                  'Leeuwarden', 'Noardeast-Fryslân', 'Opsterland', 'Schiermonnikoog', 'Smallingerland',
                  'Súdwest-Fryslân', 'Terschelling', 'Tytsjerksteradiel', 'Vlieland', 'Waadhoeke'}
ILLAS = {'Texel', 'Vlieland', 'Terschelling', 'Ameland', 'Schiermonnikoog'}
FLANDRES = ('1', '3', '4', '7', '21', '23', '24')
# la carta es dessenhada en plata carrada (calatge melhor qu'en Lambert o Mercator)
cal.projeccion('+proj=eqc +lat_ts=52 +units=m +ellps=WGS84')
comunas = cal.cargar_comunas([os.path.join(BRUT, 'nl-comunas.geojson'), os.path.join(BRUT, 'be-comunas.geojson')],
                             lambda p: p['pais'] == 'NL' or p['codi'][3:].startswith(FLANDRES))
ref = [g for p, g in comunas if p.get('nom_oficial') not in ESCLUSAS_FRISA | ILLAS]
print('Comunas : %d (referéncia del calatge : %d)' % (len(comunas), len(ref)))
M, e = cal.calar(terra, ref, res=300.0)
print('Afinitat : escart mejan %.0f m ; escala %.0f m/pixèl' % (e, np.sqrt(abs(np.linalg.det(M[:2, :2])))))
# las illas e la Frisa (blanca coma la mar) son esquematicas : fòra la deformacion
yy, xx = np.mgrid[0:H, 0:W]
esc = (yy < 480) & (xx < 1400)
# dos calatges regionals (la carta es tròp deformada per un sol) : lo nòrd e lo
# sud dels grands rius (51,85° N), amb un recobriment de 60 km
_, ylim = cal.pixel_de(M, 5.0, 51.85)
_, ynord = cal.pixel_de(M, 5.0, 52.40)
_, ysud = cal.pixel_de(M, 5.0, 51.30)
gt, gw, gh = cal.grilha([g for _, g in comunas], 250.0)
f_n, _ = cal.afinar(terra, ref, M, esclure=esc | (yy > ysud), ordre=2, caps=(15000, 12000, 8000, 5000, 3000))
f_s, _ = cal.afinar(terra, ref, M, esclure=esc | (yy < ynord), ordre=2, caps=(15000, 12000, 8000, 5000, 3000))
cg_n = cal.reprojectar(zona_tota, f_n, gt, gw, gh)
cg_s = cal.reprojectar(zona_tota, f_s, gt, gw, gh)
# raccòrd a 51,85° N
lat0 = cal.VERS_LAEA.TransformPoint(5.0, 51.85)[1]
ys = gt[3] + (np.arange(gh) + 0.5) * gt[5]
cg = np.where((ys > lat0)[:, None], cg_n, cg_s)
tab = cal.parts_grilha(cg, gt, comunas, len(ZONAS))
COL = {'1': (150, 200, 230), '2': (60, 140, 200), '3': (240, 150, 150), '4': (200, 80, 80), '5': (250, 190, 190),
       '6': (230, 120, 160), '7': (250, 100, 120), '8': (220, 170, 200), '9': (180, 90, 130), '10': (200, 190, 250),
       '11': (150, 130, 230), '12': (120, 100, 200), '13': (190, 170, 240), '14': (160, 150, 250), '15': (110, 90, 180),
       '16': (210, 200, 255), '17': (170, 160, 220), '18': (140, 120, 210), 'FL': (200, 200, 200), '19': (150, 230, 170),
       '20': (250, 210, 140), '21': (255, 228, 181), '22': (240, 190, 110), '23': (250, 160, 90), '24': (210, 230, 120)}
cal.contraròtle(cg, [COL[z] for z in ZONAS], gt, comunas, os.path.join(BRUT, 'daan-contraròtle.png'))
cal.geotiff(cg, np.array([[gt[1], 0, gt[0]], [0, gt[5], gt[3]], [0, 0, 1]]),
            os.path.join(BRUT, 'daan-calat.tif'))
with open(os.path.join(BRUT, 'daan-comunas.csv'), 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['codi', 'nom_oficial', 'zona', 'part', 'zona2', 'part2', 'defora'] + ['z' + z for z in ZONAS])
    for (p, g), t in zip(comunas, tab):
        dins = t[1:]
        tot = t.sum()
        o = np.argsort(-dins)
        z1 = ZONAS[o[0]] if dins[o[0]] > 0 else ''
        z2 = ZONAS[o[1]] if dins[o[1]] > 0 else ''
        w.writerow([p['codi'], p.get('nom_oficial', ''), z1, round(dins[o[0]] / max(1, dins.sum()), 3), z2,
                    round(dins[o[1]] / max(1, dins.sum()), 3), round(t[0] / max(1, tot), 3)] + list(dins))
print('fait')
