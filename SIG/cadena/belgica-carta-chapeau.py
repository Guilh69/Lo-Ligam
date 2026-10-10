# Dialèctes romans de Belgica comuna per comuna, d'aprèp la « Carte dialectale
# de la Belgique romane - Chapeau » (Wikimedia Commons, Reptilien.19831209BE1,
# 2022, CC BY-SA 4.0 ; obra derivada de « Mape tchapea.jpg », Lucyin, 2017,
# CC BY-SA 4.0) : picard, valon (oèst-valon, namurés, liegés, sud-valon),
# champanés, gaumés, parlars germanics.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/belgica-carta-chapeau.py
#
# Entradas : SIG/brut/oil-belgica/chapeau-3840.png (rendut 3840 px de la SVG
# per Wikimedia), SIG/brut/flamenc/be-comunas.geojson. Sortidas :
# SIG/brut/oil-belgica/chapeau-comunas.csv, chapeau-contraròtle.png.
# Las soszònas valonas son separadas per de traits puntejats : los traits son
# barrats (fermadura morfologica) abans de cercar las zònas.
import csv, importlib.util, os, sys
import numpy as np
from scipy import ndimage
from osgeo import gdal

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
spec = importlib.util.spec_from_file_location('calatge', os.path.join(R, 'SIG', 'cadena', 'flamenc-calatge.py'))
cal = importlib.util.module_from_spec(spec); spec.loader.exec_module(cal)
BRUT = os.path.join(R, 'SIG', 'brut', 'oil-belgica')

a = gdal.Open(os.path.join(BRUT, 'chapeau-3840.png')).ReadAsArray().astype(np.int32)
rgb, alpha = a[:3].transpose(1, 2, 0), a[3]
H, W = alpha.shape
PAL = {'picard': (104, 179, 203), 'valon': (105, 181, 154), 'champanes': (149, 100, 177),
       'gaumes': (205, 140, 95), 'germanic': (236, 236, 236), 'crema': (255, 246, 213),
       'roge': (200, 55, 55), 'negre': (26, 26, 26), 'trait': (52, 42, 42)}
noms = list(PAL)
d = np.stack([((rgb - np.array(PAL[k])) ** 2).sum(axis=2) for k in noms])
dmin = d.min(axis=0)
cls = np.array(noms, dtype=object)[d.argmin(axis=0)]
cls[alpha < 128] = 'fons'
cls[dmin > 900] = 'autre'  # colors intermediàrias (antialiasing, letras de las etiquetas)
for c in ('champanes', 'gaumes', 'germanic', 'picard'):
    # las letras de color de las etiquetas (« TCHAPÊ/É » en irange, « CAPIÔ » en blau)
    comp_, n_ = ndimage.label(cls == c)
    t_ = np.bincount(comp_.ravel()); t_[0] = 0
    cls[(t_[comp_] < 4000) & (comp_ > 0)] = 'autre'
colorat = np.isin(cls, ['picard', 'valon', 'champanes', 'gaumes', 'germanic'])
_yy, _xx = np.mgrid[0:H, 0:W]
colorat &= ~((_yy > 1950) & (_xx < 1700))  # la legenda (carrat gris dels parlars germanics)
traits = np.isin(cls, ['negre', 'trait'])
terra = ndimage.binary_fill_holes(colorat | traits | np.isin(cls, ['crema', 'roge', 'autre']))
# gardar la tèrra que tòca la carta (pas lo títol, pas la legenda) ; las
# etiquetas que despassan sul bòrd (« CAPIA », « TCHAPIÔ ») son gardadas
lab_, n_ = ndimage.label(terra)
part_ = np.bincount(lab_[colorat], minlength=n_ + 1)
terra = np.isin(lab_, np.nonzero(part_ > 0.02 * colorat.sum())[0]) & (lab_ > 0)
# los traits de la frontièra que despassan (a l'entorn de Fouron) : copats
terra &= ndimage.binary_dilation(colorat | np.isin(cls, ['crema', 'roge']), iterations=12)
terra = ndimage.binary_fill_holes(terra)
terra &= ~((_yy < 380) & (_xx < 2800))  # lo títol « CHAPEAU »
print('Tèrra : %d pixèls' % terra.sum())

# soszònas valonas : barrar los puntejats (traits de 7 px, voids de 10 a 15 px)
# (una fermadura morfologica barra pas los traits fins : los puntejats son
# espessits fins que se tòquen, la banda es puèi partejada al pus pròche)
letras = ndimage.binary_dilation(cls == 'negre', iterations=4)
barrat = ndimage.binary_dilation((cls == 'trait') & ~letras, iterations=10)  # los traits (52, 42, 42), pas las letras (26, 26, 26) e lor contorn
CL = ['picard', 'oest_valon', 'namures', 'lieges', 'sud_valon', 'champanes', 'gaumes', 'germanic']
classa = np.full((H, W), -1, dtype=np.int32)
for c, i in (('picard', 0), ('champanes', 5), ('gaumes', 6), ('germanic', 7)):
    classa[cls == c] = i
GRANS = {'oest_valon': (1728, 922), 'namures': (2266, 1200), 'lieges': (2899, 1129), 'sud_valon': (2765, 1801)}
v = (cls == 'valon') & ~barrat
comp, nc = ndimage.label(v)
talha = np.bincount(comp.ravel()); talha[0] = 0
grans = {}
for z, (x, y) in GRANS.items():
    y0, x0 = max(0, y - 150), max(0, x - 150)
    sub = comp[y0:y + 150, x0:x + 150]
    yy, xx = np.nonzero(sub > 0)
    i = np.argmin((yy + y0 - y) ** 2 + (xx + x0 - x) ** 2)
    grans[z] = (sub[yy[i], xx[i]], y0 + yy[i], x0 + xx[i])
    print('  grani %-10s : componenta %d (%d px)' % (z, grans[z][0], talha[grans[z][0]]))
per = {}
for z, (k, gy, gx) in grans.items():
    per.setdefault(k, []).append(z)
for k, zs in per.items():
    m = comp == k
    if len(zs) == 1:
        classa[m] = CL.index(zs[0])
    else:
        print('  ATENCION : %s dins la meteissa componenta (puntejat dobèrt) : partiment al pus pròche' % zs)
        py, px = np.nonzero(m)
        dd = np.stack([(py - grans[z][1]) ** 2 + (px - grans[z][2]) ** 2 for z in zs])
        classa[py, px] = np.array([CL.index(z) for z in zs])[dd.argmin(axis=0)]
# las autras componentas valonas (pichonas, closas per de letras) : la sosszòna
# pus pròcha
assignat = np.isin(classa, [1, 2, 3, 4])
_, (iy, ix) = ndimage.distance_transform_edt(~assignat, return_indices=True)
resta = (cls == 'valon') & (classa < 0)
# los tròces verds pichons (pixèls de letras dins lo picard…) : laissats a
# l'entorn (emplenar) ; los grands : la soszòna pus pròcha
pichon = (talha[comp] < 3000) & (comp > 0)
grand = resta & ~pichon
classa[grand] = classa[iy[grand], ix[grand]]
classa_tota = cal.emplenar(classa, terra)

comunas = cal.cargar_comunas([os.path.join(R, 'SIG', 'brut', 'flamenc', 'be-comunas.geojson')],
                             lambda p: p['codi'][3:].startswith(('25', '5', '6', '8', '9')))
print('Comunas de Valonia : %d' % len(comunas))
melhor = None
for pj in ('+proj=eqc +lat_ts=50.5 +units=m +ellps=WGS84', '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m'):
    cal.projeccion(pj)
    com = cal.cargar_comunas([os.path.join(R, 'SIG', 'brut', 'flamenc', 'be-comunas.geojson')],
                             lambda p: p['codi'][3:].startswith(('25', '5', '6', '8', '9')))
    M, e = cal.calar(terra, [g for _, g in com], res=200.0, caps=(20000, 8000, 3000, 1500))
    print('  %s : escart mejan %.0f m' % (pj.split()[0], e))
    if melhor is None or e < melhor[1]:
        melhor = (pj, e, M, com)
pj, e, M, comunas = melhor
cal.projeccion(pj)
print('Projeccion retenguda : %s (escart %.0f m), escala %.0f m/pixèl' % (pj.split()[0], e, np.sqrt(abs(np.linalg.det(M[:2, :2])))))
f, _ = cal.afinar(terra, [g for _, g in comunas], M, res=200.0, ordre=2, caps=(8000, 5000, 3000, 2000, 1000))
gt, gw, gh = cal.grilha([g for _, g in comunas], 150.0)
cg = cal.reprojectar(classa_tota, f, gt, gw, gh)
tab = cal.parts_grilha(cg, gt, comunas, len(CL))
# las doas etiquetas de transicion (« capia » e « tchapiô », zònas de passatge
# del picard a l'oèst-valon) : part de la comuna jos l'etiqueta
ETIQ = {'capia': (1590, 696), 'tchapio': (1637, 1529)}
# lo quadre roge de l'etiqueta (lo crèma es copat per las letras)
labc, _ = ndimage.label(ndimage.binary_dilation(cls == 'roge', iterations=2))
etiq = np.full((H, W), -1, dtype=np.int32)
for i, (k, (x, y)) in enumerate(ETIQ.items()):
    yy, xx = np.nonzero(labc[y - 80:y + 80, x - 200:x + 200] > 0)
    j = np.argmin((yy - 80) ** 2 + (xx - 200) ** 2)
    c = labc[y - 80 + yy[j], x - 200 + xx[j]]
    ys_, xs_ = np.nonzero(labc == c)
    etiq[ys_.min() - 8:ys_.max() + 9, xs_.min() - 8:xs_.max() + 9] = i
    print('  etiqueta %s : %d x %d px' % (k, xs_.max() - xs_.min(), ys_.max() - ys_.min()))
cge = cal.reprojectar(etiq, f, gt, gw, gh)
tabe = cal.parts_grilha(cge, gt, comunas, len(ETIQ))
COL = [(104, 179, 203), (60, 160, 110), (105, 181, 154), (170, 220, 120), (40, 120, 90), (149, 100, 177), (205, 140, 95), (200, 200, 200)]
cal.contraròtle(cg, COL, gt, comunas, os.path.join(BRUT, 'chapeau-contraròtle.png'))
with open(os.path.join(BRUT, 'chapeau-comunas.csv'), 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['codi', 'zona', 'part', 'zona2', 'part2', 'defora'] + CL + ['etiq_' + k for k in ETIQ])
    for (p, g), t, te in zip(comunas, tab, tabe):
        dins = t[1:]
        o = np.argsort(-dins)
        z1 = CL[o[0]] if dins[o[0]] > 0 else ''
        z2 = CL[o[1]] if dins[o[1]] > 0 else ''
        w.writerow([p['codi'], z1, round(dins[o[0]] / max(1, dins.sum()), 3), z2,
                    round(dins[o[1]] / max(1, dins.sum()), 3), round(t[0] / max(1, t.sum()), 3)] + list(dins)
                   + [round(x / max(1, te.sum()), 3) for x in te[1:]])
print('fait')
