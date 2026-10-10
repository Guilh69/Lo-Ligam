# Lo flamenc en França comuna per comuna, d'aprèp las cartas d'Alex Vanneste,
# « Taaltoestand in Frans-Vlaanderen » 1 e 2, Ons Erfdeel, 15, 1972 (DBNL) :
# las donadas de Bocave (de Coussemaker, « Délimitation du flamand et du
# français dans le Nord de la France », 1857 : situacion de 1856), de Kurth
# (1900), de Celen (1933 : situacion de 1932) e son enquèsta de 1971,
# portadas per el sus una meteissa carta de las comunas (119 localitats
# entre la mar, la Belgica, la Lis e l'Aa).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/flamenc-carta-vanneste.py
#
# Entradas : SIG/brut/flamenc/fonts/vanneste1972/ill*.gif (imatges de la DBNL,
# 470 px), SIG/brut/flamenc/fr-westhoek-comunas*.geojson. Sortida :
# SIG/brut/flamenc/vanneste-comunas.csv : per comuna e per carta, la densitat
# de negre (d) e la part dels pixèls negres que tòcan un negre en dessús (v) e
# a drecha (h) : crosilhat (eentalig Frans) d e h nauts, regas verticalas
# (tweetalig Frans) v naut e h bas, ponchs (tweetalig Vlaams) d bas, blanc
# (eentalig Vlaams) d ≈ 0. La classa es decidida dins flamenc-taula.py.
# Las cartas son pas republicadas (drech d'autor) : solament lor contengut.
import csv, importlib.util, json, os
import numpy as np
from scipy import ndimage
from osgeo import gdal, ogr

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
spec = importlib.util.spec_from_file_location('calatge', os.path.join(R, 'SIG', 'cadena', 'flamenc-calatge.py'))
cal = importlib.util.module_from_spec(spec); spec.loader.exec_module(cal)
BRUT = os.path.join(R, 'SIG', 'brut', 'flamenc')
DIR = os.path.join(BRUT, 'fonts', 'vanneste1972')
CARTAS = [('1856', 'ill205.gif', 468), ('1900', 'ill207.gif', 468), ('1932', 'ill208.gif', 468), ('1971', 'ill160.gif', 468)]


def gris(cami):
    ds = gdal.Open(cami)
    b = ds.GetRasterBand(1)
    idx = b.ReadAsArray()
    ct = b.GetColorTable()
    if ct is None:
        return idx.astype(float)
    lut = np.array([sum(ct.GetColorEntry(i)[:3]) / 3 for i in range(ct.GetCount())])
    return lut[idx]


comunas = cal.cargar_comunas([os.path.join(BRUT, 'fr-westhoek-comunas.geojson')],
                             lambda p: p['arrondissement'] == '594' or p['codi'] == '62225')
assoc = cal.cargar_comunas([os.path.join(BRUT, 'fr-westhoek-comunas-associadas.geojson')],
                           lambda p: p['code_insee'] in ('59248', '59540', '59154', '59404', '59380', '59588', '59260'))
for p, g in assoc:
    p['codi'] = p['code_insee']; p['nom_oficial'] = p['nom_officiel'] + ' (comuna associada)'
totas = comunas + assoc
print('Comunas : %d + %d associadas' % (len(comunas), len(assoc)))
# comunas reduchas de 250 m (los limits negres de la carta), o mens se pichonas
reduchas = []
for p, g in totas:
    for b in (-250, -150, -60, 0):
        r = g.Buffer(b)
        if r is not None and not r.IsEmpty() and r.GetArea() > 0.15 * g.GetArea():
            reduchas.append((p, r)); break
res = {}
MS = []
for nom, fic, ylim in CARTAS:
    gi = gris(os.path.join(DIR, fic))
    H, W = gi.shape
    negre = gi < 128
    negre[ylim:, :] = False
    # tèrra : l'interior del contorn. Lo quadre de l'imatge (se i es) es levat,
    # los traucs d'un o dos pixèls del contorn barrats (espessir, emplenar, aprimar)
    n2 = negre.copy()
    n2[:4, :] = False; n2[-4:, :] = False; n2[:, :4] = False; n2[:, -4:] = False
    terra = ndimage.binary_erosion(ndimage.binary_fill_holes(ndimage.binary_dilation(n2, iterations=4)), iterations=4)
    lab, n = ndimage.label(terra)
    t = np.bincount(lab.ravel()); t[0] = 0
    terra = ndimage.binary_fill_holes(lab == np.argmax(t))
    print('Carta %s : %d x %d, tèrra %d px' % (nom, W, H, terra.sum()))
    # ensag per l'encastre, puèi a partir dels calatges de las autras cartas
    # (meteissa carta de basa) : se garda lo melhor
    M, e = cal.calar(terra, [g for _, g in comunas], res=100.0, caps=(10000, 4000, 1500, 800))
    for M0 in list(MS):
        M1, e1 = cal.calar(terra, [g for _, g in comunas], res=100.0, ensag=M0[:2], caps=(4000, 1500, 800))
        if e1 < e:
            M, e = M1, e1
    MS.append(M)
    print('  calatge retengut : %.0f m' % e)
    f, _ = cal.afinar(terra, [g for _, g in comunas], M, res=100.0, ordre=2, caps=(3000, 2000, 1000, 600))
    gt, gw, gh = cal.grilha([g for _, g in totas], 40.0)
    # pixèls dins una corsa negra de 4 pixèls o mai, verticala (v) o orizontala (h)
    def corsa(m, ax, k=4):
        r = np.zeros_like(m)
        n_ = m.shape[ax]
        for o in range(k):
            w_ = np.ones_like(m)
            for j in range(k):
                sh = j - o
                s_ = np.roll(m, -sh, axis=ax)
                if sh > 0:
                    idx = [slice(None)] * 2; idx[ax] = slice(n_ - sh, n_); s_[tuple(idx)] = False
                elif sh < 0:
                    idx = [slice(None)] * 2; idx[ax] = slice(0, -sh); s_[tuple(idx)] = False
                w_ &= s_
            r |= w_
        return r
    # las regas de las tramas son grisas (110-190) : sulhet de 215 per la tèxtura
    # (los limits de comunas, negres, < 128, servisson al contorn)
    # corsas de 7 pixèls o mai al sulhet de 175 : las regas verticalas d'un
    # costat, las orizontalas del crosilhat de l'autre (verificat sus 12
    # comunas regardadas a l'uèlh : h < 0,02 per las regas, h > 0,27 pel crosilhat)
    trama = gi < 215
    trama[ylim:, :] = False
    t175 = gi < 175
    t175[ylim:, :] = False
    v = corsa(t175, 0, 7)
    h = corsa(t175, 1, 7)
    # ponchs : componentas negras pichonas (2 a 15 pixèls, 5 x 5 al mai)
    lab_, n_ = ndimage.label(trama)
    talh = np.bincount(lab_.ravel())
    sl = ndimage.find_objects(lab_)
    pich = np.zeros(n_ + 1, bool)
    for k_, s_ in enumerate(sl, start=1):
        if s_ is not None and 2 <= talh[k_] <= 15 and (s_[0].stop - s_[0].start) <= 5 and (s_[1].stop - s_[1].start) <= 5:
            pich[k_] = True
    ponch = pich[lab_] & (lab_ > 0)
    cod = (trama.astype(np.int32) + 2 * v + 4 * h + 8 * ponch)
    cod[~terra] = -1
    cg = cal.reprojectar(cod, f, gt, gw, gh)
    ids = cal.raster_geoms([g for _, g in reduchas], gt, gw, gh, valors=list(range(len(reduchas))))
    for i, (p, g) in enumerate(reduchas):
        m = ids == i
        c = cg[m]
        c = c[c >= 0]
        if len(c) == 0:
            res.setdefault(p['codi'], {})[nom] = None
            continue
        ng = (c & 1).sum()
        res.setdefault(p['codi'], {})[nom] = (len(c), ng / len(c), ((c & 2) > 0).sum() / len(c), ((c & 4) > 0).sum() / len(c), ((c & 8) > 0).sum() / len(c))
with open(os.path.join(BRUT, 'vanneste-comunas.csv'), 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    cols = ['codi', 'nom_oficial']
    for nom, _, _ in CARTAS:
        cols += [nom + '_n', nom + '_d', nom + '_v', nom + '_h', nom + '_p']
    w.writerow(cols)
    for p, g in reduchas:
        l = [p['codi'], p['nom_oficial']]
        for nom, _, _ in CARTAS:
            x = res[p['codi']].get(nom)
            l += ['', '', '', '', ''] if x is None else [x[0], round(x[1], 3), round(x[2], 3), round(x[3], 3), round(x[4], 3)]
        w.writerow(l)
print('fait')
