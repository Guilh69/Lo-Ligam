# Dialèctes neerlandeses comuna per comuna, d'aprèp la carta « Dutch dialects
# map - fr.svg » de Wikimedia Commons (Treehill, 2022, CC BY-SA 4.0, « own
# work », sens font indicada). Mai fina que la de Daan (brabançon e limborgés
# partejats), servís de contraròtle e per los parlars del brabançon e del
# limborgés de Belgica. Cobrís pas la Flandres francesa.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/flamenc-carta-treehill.py
#
# Entradas : SIG/brut/flamenc/fonts/fr-1920.png (rendut 1920 px per Wikimedia),
# SIG/brut/flamenc/{nl,be}-comunas.geojson. Sortida : treehill-comunas.csv,
# treehill-contraròtle.png. Calatge : flamenc-calatge.py (plata carrada).
import csv, importlib.util, os
import numpy as np
from scipy import ndimage
from osgeo import gdal

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
spec = importlib.util.spec_from_file_location('calatge', os.path.join(R, 'SIG', 'cadena', 'flamenc-calatge.py'))
cal = importlib.util.module_from_spec(spec); spec.loader.exec_module(cal)
BRUT = os.path.join(R, 'SIG', 'brut', 'flamenc')

a = gdal.Open(os.path.join(BRUT, 'fonts', 'fr-1920.png')).ReadAsArray().astype(np.int32)
rgb = a[:3].transpose(1, 2, 0)
H, W = rgb.shape[:2]
CL = [  # (còdi, nom sus la carta, color)
    ('fo', 'flamand occidental', (252, 252, 128)), ('fe', 'flamand oriental', (253, 209, 209)),
    ('zel', 'zélandais', (240, 228, 100)), ('vho', 'vieil hollandais', (228, 200, 68)),
    ('hn', 'hollandais du nord', (157, 166, 236)), ('hs', 'hollandais du sud', (144, 84, 0)),
    ('hl', 'hollandais du littoral', (0, 40, 208)), ('flev', 'flevisch', (0, 84, 220)),
    ('utr', 'utrechtois', (208, 152, 12)), ('vel', 'veluwsch', (172, 112, 0)),
    ('fri', 'frison', (180, 236, 252)), ('friu', 'frison urbain', (0, 156, 240)),
    ('gro', 'groningois', (155, 155, 155)), ('ste', 'stellingwerfsch', (103, 103, 103)),
    ('dre', 'drenthois', (173, 173, 173)), ('gov', "gueldrois d'Overijssel", (188, 188, 188)),
    ('mgu', 'moyen gueldrois', (212, 212, 212)), ('urk', 'urkois', (96, 0, 0)),
    ('bocc', 'brabançon occidental', (252, 88, 88)), ('bor', 'brabançon oriental', (158, 222, 158)),
    ('banv', 'brabançon anversois', (253, 117, 117)), ('bals', 'brabançon alostois', (253, 178, 178)),
    ('blou', 'brabançon de Louvain', (253, 151, 151)), ('locc', 'limbourgeois occidental', (58, 175, 58)),
    ('lsep', 'limbourgeois septentrional', (116, 190, 116)), ('lmer', 'limbourgeois méridional', (124, 156, 124)),
    ('lori', 'limbourgeois oriental', (161, 254, 144)), ('lgue', 'limbourgeois gueldrois', (81, 105, 81))]
AUTRES = [('blanc', (255, 255, 255)), ('negre', (0, 0, 0)), ('blau', (9, 120, 171))]
cols = np.array([c for _, _, c in CL] + [c for _, c in AUTRES])
# color exacta solament (los pixèls d'antialiasing van als traits)
k = rgb[..., 0] * 65536 + rgb[..., 1] * 256 + rgb[..., 2]
classa = np.full((H, W), -1, dtype=np.int32)
for i, (_, _, c) in enumerate(CL):
    classa[k == c[0] * 65536 + c[1] * 256 + c[2]] = i
blanc = k == 0xffffff
colorat = classa >= 0
# tèrra : las colors, los traits entre zònas e las letras dedins (traucs pichons)
traits = ~colorat & ~blanc
terra = colorat.copy()
lab, n = ndimage.label(traits)
# un trait es dins la tèrra se tòca de colors de dos costats : simplificat,
# los traucs de la tèrra mens grands que 6000 px son emplenats
t = ndimage.binary_fill_holes(colorat | traits) & ~colorat
lab, n = ndimage.label(t)
talha = np.bincount(lab.ravel()); talha[0] = 0
terra |= (talha[lab] < 6000) & (lab > 0)
# los traits fins entre doas colors
terra |= ndimage.binary_closing(colorat, structure=np.ones((5, 5))) & ~blanc
print('Tèrra de la carta : %d pixèls' % terra.sum())
classa_tota = cal.emplenar(classa, terra)

cal.projeccion('+proj=eqc +lat_ts=52 +units=m +ellps=WGS84')
FLANDRES = ('1', '3', '4', '7', '21', '23', '24')
FLEVO = {'Almere', 'Lelystad', 'Dronten', 'Zeewolde', 'Noordoostpolder', 'Urk'}
comunas = cal.cargar_comunas([os.path.join(BRUT, 'nl-comunas.geojson'), os.path.join(BRUT, 'be-comunas.geojson')],
                             lambda p: p['pais'] == 'NL' or p['codi'][3:].startswith(FLANDRES))
ref = [g for p, g in comunas if p.get('nom_oficial') not in FLEVO]
M, e = cal.calar(terra, ref, res=300.0)
print('Afinitat : escart mejan %.0f m ; escala %.0f m/pixèl' % (e, np.sqrt(abs(np.linalg.det(M[:2, :2])))))
yy, xx = np.mgrid[0:H, 0:W]
esc = (yy < 160)  # illas del nòrd, esquematicas
# dos calatges regionals (la carta es tròp deformada per un sol) : lo nòrd e lo
# sud dels grands rius (51,85° N), amb un recobriment de 60 km
_, ylim = cal.pixel_de(M, 5.0, 51.85)
_, ynord = cal.pixel_de(M, 5.0, 52.40)
_, ysud = cal.pixel_de(M, 5.0, 51.30)
gt, gw, gh = cal.grilha([g for _, g in comunas], 250.0)
f_n, _ = cal.afinar(terra, ref, M, esclure=esc | (yy > ysud), ordre=2, caps=(15000, 12000, 8000, 5000, 3000))
f_s, _ = cal.afinar(terra, ref, M, esclure=esc | (yy < ynord), ordre=2, caps=(15000, 12000, 8000, 5000, 3000))
cg_n = cal.reprojectar(classa_tota, f_n, gt, gw, gh)
cg_s = cal.reprojectar(classa_tota, f_s, gt, gw, gh)
# raccòrd a 51,85° N
lat0 = cal.VERS_LAEA.TransformPoint(5.0, 51.85)[1]
ys = gt[3] + (np.arange(gh) + 0.5) * gt[5]
cg = np.where((ys > lat0)[:, None], cg_n, cg_s)
tab = cal.parts_grilha(cg, gt, comunas, len(CL))
cal.contraròtle(cg, [c for _, _, c in CL], gt, comunas, os.path.join(BRUT, 'treehill-contraròtle.png'))
COD = [c for c, _, _ in CL]
with open(os.path.join(BRUT, 'treehill-comunas.csv'), 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['codi', 'nom_oficial', 'zona', 'part', 'zona2', 'part2', 'defora'] + COD)
    for (p, g), t in zip(comunas, tab):
        dins = t[1:]
        o = np.argsort(-dins)
        z1 = COD[o[0]] if dins[o[0]] > 0 else ''
        z2 = COD[o[1]] if dins[o[1]] > 0 else ''
        w.writerow([p['codi'], p.get('nom_oficial', ''), z1, round(dins[o[0]] / max(1, dins.sum()), 3), z2,
                    round(dins[o[1]] / max(1, dins.sum()), 3), round(t[0] / max(1, t.sum()), 3)] + list(dins))
print('fait')
