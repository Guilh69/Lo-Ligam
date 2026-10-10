# Corse : calage de deux cartes dialectales libres de Wikimedia Commons et
# lecture de la zone de chaque commune.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/cors-cartas.py
#
# Cartes (copies dans SIG/brut/cors/fonts/) :
#  G : « Parlers de Corse », Gcapadovani, 2018, CC BY-SA 4.0
#      https://commons.wikimedia.org/wiki/File:Parlers_de_Corse.jpg
#      5 zones corses (cismunticu capicursinu, cismunticu nordicu, cismunticu,
#      pumunticu di transizione, corsu taravesu & sartinesu), ligure (Calvi,
#      Ajaccio, Bonifacio), grec de Cargèse. Points noirs = villages nommés.
#  J : « Dialetti corsi vector ita », Jkens / Snowdog / Lokiseinchef, 2006,
#      CC BY-SA 3.0 it  https://commons.wikimedia.org/wiki/File:Dialetti_corsi_vector_ita.svg
#      capraiese, cismontano capocorsino, cismontano, transizione,
#      oltramontano, oltramontano sartenese, gallurese, castellanese,
#      sassarese ; sarde, ligure, catalan. Rendue en PNG (2x) par Qt si absente.
# Points de calage : SIG/cors/gcp-parlars-de-corse.csv (47 villages : point de
# la carte / chef-lieu IGN), SIG/cors/gcp-dialetti-corsi.csv (16 villes ;
# Sardaigne et Capraia : coordonnées Wikidata). Modèle : polynôme (ordre 2
# pour G, 1 pour J) des pixels en fonction des coordonnées UTM 32N, et
# inverse pour mesurer les écarts en km.
# Communes : IGN ADMIN EXPRESS COG CARTO 2026 (couche commune, 2A et 2B, et
# chefs-lieux) ; ISTAT 2026 (comuni-it-nord.geojson, cors-istat.py) pour J.
# Sortie : SIG/cors/cors-cartas.csv : pour chaque carte, la zone au chef-lieu
# (ou la zone colorée la plus proche, distance en km), les zones présentes à
# moins de 1,5 km du chef-lieu et la part de chaque zone dans la commune.
# Contrôle visuel : SIG/brut/cors/controle-G.png et controle-J.png (limites
# communales projetées sur chaque carte).
import csv, json, math, os, sys
import numpy as np
from scipy import ndimage
from osgeo import gdal, ogr, osr

gdal.UseExceptions()
ogr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
F = os.path.join(R, 'SIG', 'brut', 'cors', 'fonts')
SORTIDA = os.path.join(R, 'SIG', 'cors', 'cors-cartas.csv')
RAI_KM = 1.5


def hexrgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


CARTAS = {
    'G': dict(img=os.path.join(F, 'Parlers_de_Corse.jpg'), gcp=os.path.join(R, 'SIG', 'cors', 'gcp-parlars-de-corse.csv'),
              gcp_escala=1.0, pas=2, ordre=2,
              zonas={'capicursinu': (255, 128, 157), 'nordicu': (253, 126, 0), 'cismunticu': (85, 255, 0),
                     'transizione': (132, 255, 228), 'taravesu_sartinesu': (204, 255, 0), 'ligure': (255, 30, 30),
                     'grecu': (212, 236, 236)},
              autres={'blanc': (252, 252, 252), 'negre': (4, 4, 4), 'legenda': (60, 68, 60), 'blau': (28, 92, 244),
                      'leg_rosa': (228, 196, 196), 'leg_cian': (228, 252, 252)},
              mascas=[(2760, 0, 99999, 99999)]),
    'J': dict(img=os.path.join(F, 'Dialetti_corsi_vector_ita-x2.png'), svg=os.path.join(F, 'Dialetti_corsi_vector_ita.svg'),
              gcp=os.path.join(R, 'SIG', 'cors', 'gcp-dialetti-corsi.csv'), gcp_escala=2.0, pas=1, ordre=1,
              zonas={'capraiese': hexrgb('#166b34'), 'capocorsino': hexrgb('#187037'), 'cismontano': hexrgb('#1e8843'),
                     'transizione': hexrgb('#26ac55'), 'oltramontano': hexrgb('#31ce68'), 'sartenese': hexrgb('#50d880'),
                     'gallurese': hexrgb('#79e19d'), 'castellanese': hexrgb('#a0e9b9'), 'sassarese': hexrgb('#bdd2b9'),
                     'sardo': hexrgb('#808080'), 'ligure': hexrgb('#f808fa'), 'catalano': hexrgb('#804141'),
                     'toscano': hexrgb('#075276')},
              autres={'mar': hexrgb('#4e74fa'), 'negre': (0, 0, 0), 'legenda': hexrgb('#8080ff'), 'blanc': (255, 255, 255),
                      'gris_clar': hexrgb('#c0c0c0')},
              # cadres de la légende (unités SVG x2) : x0, y0, x1, y1
              mascas=[(0, 0, 1090, 1620), (0, 1760, 620, 2540)]),
}


def rendre_svg(svg, png, escala):
    os.environ.setdefault('QT_QPA_PLATFORM', 'offscreen')
    from qgis.PyQt.QtGui import QGuiApplication, QImage, QPainter, QColor
    from qgis.PyQt.QtSvg import QSvgRenderer
    app = QGuiApplication.instance() or QGuiApplication(sys.argv[:1])
    r = QSvgRenderer(svg)
    s = r.defaultSize()
    img = QImage(int(s.width() * escala), int(s.height() * escala), QImage.Format.Format_ARGB32)
    img.fill(QColor(255, 255, 255))
    p = QPainter(img)
    r.render(p)
    p.end()
    img.save(png)
    print('Rendu %s (%d x %d)' % (png, img.width(), img.height()))


wgs, utm, l93 = osr.SpatialReference(), osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326)
utm.ImportFromEPSG(32632)
l93.ImportFromEPSG(2154)
for s in (wgs, utm, l93):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
W2U = osr.CoordinateTransformation(wgs, utm)
L2U = osr.CoordinateTransformation(l93, utm)


def termes(E, N, ordre):
    E, N = np.asarray(E, float), np.asarray(N, float)
    t = [np.ones_like(E), E, N]
    if ordre >= 2:
        t += [E * E, E * N, N * N]
    return np.stack(t, axis=-1)


# --- communes
gp = ogr.Open(os.path.join(R, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
comunas = []  # (codi, nom, geom UTM km, chef-lieu (E, N) km ou None)
cl = gp.GetLayerByName('chef_lieu_de_commune')
cl.SetAttributeFilter("substr(code_insee_de_la_commune, 1, 2) IN ('2A', '2B')")
cap = {}
for f in cl:
    g = f.GetGeometryRef().Clone()
    g.Transform(L2U)
    cap[f.GetField('code_insee_de_la_commune')] = (g.GetX() / 1000, g.GetY() / 1000)
co = gp.GetLayerByName('commune')
co.SetAttributeFilter("code_insee_du_departement IN ('2A','2B')")
for f in co:
    g = f.GetGeometryRef().Clone()
    g.Transform(L2U)
    comunas.append((f.GetField('code_insee'), f.GetField('nom_officiel'), g, cap.get(f.GetField('code_insee'))))
nfr = len(comunas)
it = json.load(open(os.path.join(R, 'SIG', 'brut', 'cors', 'comuni-it-nord.geojson'), encoding='utf-8'))
for ft in it['features']:
    g = ogr.CreateGeometryFromJson(json.dumps(ft['geometry']))
    g.Transform(W2U)
    comunas.append((ft['properties']['codi'], ft['properties']['nom'], g, None))
print('Communes : %d en Corse, %d en Italie' % (nfr, len(comunas) - nfr))


def vers_px(g, f):
    """Géométrie UTM (m) -> géométrie en pixels de la carte (f : E, N km -> px, py)."""
    g = g.Clone()
    def conv(geom):
        n = geom.GetGeometryCount()
        if n:
            for i in range(n):
                conv(geom.GetGeometryRef(i))
            return
        pts = np.array(geom.GetPoints())
        if len(pts) == 0:
            return
        px, py = f(pts[:, 0] / 1000, pts[:, 1] / 1000)
        for i in range(len(pts)):
            geom.SetPoint_2D(i, float(px[i]), float(py[i]))
    conv(g)
    return g


resultats = {c[0]: {'nom': c[1]} for c in comunas}
for clau, C in CARTAS.items():
    print('\n=== Carte %s' % clau)
    if not os.path.exists(C['img']):
        rendre_svg(C['svg'], C['img'], C['gcp_escala'])
    a = gdal.Open(C['img']).ReadAsArray()[:3].transpose(1, 2, 0)
    pas = C['pas']
    a = a[::pas, ::pas].astype(np.int32)
    H, Wd = a.shape[:2]
    noms = list(C['zonas']) + list(C['autres'])
    refs = [C['zonas'][k] for k in C['zonas']] + [C['autres'][k] for k in C['autres']]
    dist = np.stack([((a - np.array(r)) ** 2).sum(axis=2) for r in refs])
    cls = dist.argmin(axis=0).astype(np.int16)
    dmin = dist.min(axis=0)
    nz = len(C['zonas'])
    zona = (cls < nz) & (dmin < 60 ** 2)
    for (x0, y0, x1, y1) in C['mascas']:
        zona[max(0, y0 // pas):max(0, y1 // pas), max(0, x0 // pas):max(0, x1 // pas)] = False
    # on ne garde que les grandes plages colorées (pas les lettres des étiquettes)
    lab, n = ndimage.label(zona, structure=np.ones((3, 3)))
    talha = np.bincount(lab.ravel())
    talha[0] = 0
    zona &= talha[lab] > 4000 // pas
    cls = np.where(zona, cls, -1)
    for i, k in enumerate(C['zonas']):
        print('  %-20s %9d pixels' % (k, (cls == i).sum()))
    # calage
    gcp = list(csv.DictReader(open(C['gcp'], encoding='utf-8'), delimiter=';'))
    EN = []
    for g in gcp:
        p = ogr.Geometry(ogr.wkbPoint)
        p.AddPoint_2D(float(g['lon']), float(g['lat']))
        p.Transform(W2U)
        EN.append((p.GetX() / 1000, p.GetY() / 1000))
    EN = np.array(EN)
    PX = np.array([[float(g['px_x']) * C['gcp_escala'] / pas, float(g['px_y']) * C['gcp_escala'] / pas] for g in gcp])
    Tf = termes(EN[:, 0], EN[:, 1], C['ordre'])
    Af, *_ = np.linalg.lstsq(Tf, PX, rcond=None)
    Ti = termes(PX[:, 0], PX[:, 1], C['ordre'])
    Ai, *_ = np.linalg.lstsq(Ti, EN, rcond=None)
    res = np.hypot(*(Ti @ Ai - EN).T)
    for g, e in zip(gcp, res):
        if e > 2.5:
            print('  écart fort : %-22s %5.1f km' % (g['nom'], e))
    print('  Calage (%d points, ordre %d) : écart moyen %.2f km, médian %.2f km, max %.2f km (%s)' % (
        len(gcp), C['ordre'], res.mean(), np.median(res), res.max(), gcp[int(res.argmax())]['nom']))
    # échelle locale (km par pixel) au centre de la Corse
    e0 = termes([520.0], [4680.0], C['ordre']) @ Af
    e1 = termes([530.0], [4680.0], C['ordre']) @ Af
    kmpx = 10.0 / float(np.hypot(*(e1 - e0)[0]))
    print('  Échelle : %.3f km par pixel' % kmpx)

    def f(E, N):
        p = termes(E, N, C['ordre']) @ Af
        return p[..., 0], p[..., 1]

    # zone la plus proche pour les pixels non colorés
    _, (iy, ix) = ndimage.distance_transform_edt(cls < 0, return_indices=True)
    dcol = ndimage.distance_transform_edt(cls < 0)
    cls_tot = cls[iy, ix]
    # rasterisation de toutes les communes (identifiant = rang + 1)
    drv = ogr.GetDriverByName('MEM') or ogr.GetDriverByName('Memory')
    mem = drv.CreateDataSource('m')
    lay = mem.CreateLayer('c', geom_type=ogr.wkbMultiPolygon)
    lay.CreateField(ogr.FieldDefn('id', ogr.OFTInteger))
    lin = mem.CreateLayer('l', geom_type=ogr.wkbMultiLineString)
    for i, c in enumerate(comunas):
        gpx = vers_px(c[2], f)
        ft = ogr.Feature(lay.GetLayerDefn())
        ft.SetField('id', i + 1)
        ft.SetGeometry(gpx)
        lay.CreateFeature(ft)
        fl = ogr.Feature(lin.GetLayerDefn())
        fl.SetGeometry(gpx.Boundary())
        lin.CreateFeature(fl)
    ras = gdal.GetDriverByName('MEM').Create('', Wd, H, 1, gdal.GDT_Int32)
    ras.SetGeoTransform((0, 1, 0, 0, 0, 1))
    gdal.RasterizeLayer(ras, [1], lay, options=['ATTRIBUTE=id'])
    ids = ras.ReadAsArray()
    ok = (ids > 0) & (cls >= 0)
    tab = np.zeros((len(comunas) + 1, nz), dtype=np.int64)
    np.add.at(tab, (ids[ok], cls[ok]), 1)
    tot = np.bincount(ids.ravel(), minlength=len(comunas) + 1)
    zn = list(C['zonas'])
    for i, c in enumerate(comunas):
        r = resultats[c[0]]
        sh = tab[i + 1]
        r[clau + '_cobert'] = round(sh.sum() / tot[i + 1], 2) if tot[i + 1] else 0
        r[clau + '_poly'] = ' '.join('%s:%.2f' % (zn[k], sh[k] / sh.sum()) for k in np.argsort(-sh) if sh[k] / sh.sum() >= 0.02) if sh.sum() else ''
        if c[3] is None:
            continue
        px, py = f(np.array([c[3][0]]), np.array([c[3][1]]))
        x, y = int(round(float(px[0]))), int(round(float(py[0])))
        if not (0 <= x < Wd and 0 <= y < H):
            continue
        # zone au chef-lieu : majorité des pixels colorés à moins de 0,5 km
        # (le point du village, les lettres et les pixels isolés de bord ne
        # comptent pas) ; à défaut, la zone colorée la plus proche
        r[clau + '_cl'] = zn[cls_tot[y, x]]
        r[clau + '_dist_km'] = round(float(dcol[y, x]) * kmpx, 2)
        for rk, camp in ((0.5, None), (RAI_KM, '_disc')):
            rp = rk / kmpx
            yy, xx = np.mgrid[-int(rp) - 1:int(rp) + 2, -int(rp) - 1:int(rp) + 2]
            dsk = (yy ** 2 + xx ** 2) <= rp ** 2
            y0, x0 = y - dsk.shape[0] // 2, x - dsk.shape[1] // 2
            win = cls[max(0, y0):y0 + dsk.shape[0], max(0, x0):x0 + dsk.shape[1]]
            dwin = dsk[max(0, -y0):max(0, -y0) + win.shape[0], max(0, -x0):max(0, -x0) + win.shape[1]]
            v = win[dwin & (win >= 0)]
            if not v.size:
                continue
            bc = np.bincount(v, minlength=nz)
            if camp is None:
                r[clau + '_cl'] = zn[int(bc.argmax())]
            else:
                r[clau + camp] = ' '.join('%s:%.2f' % (zn[k], bc[k] / v.size) for k in np.argsort(-bc) if bc[k] / v.size >= 0.02)
    # image de contrôle : carte + limites communales en noir + chefs-lieux en rouge
    lr = gdal.GetDriverByName('MEM').Create('', Wd, H, 1, gdal.GDT_Byte)
    lr.SetGeoTransform((0, 1, 0, 0, 0, 1))
    gdal.RasterizeLayer(lr, [1], lin, burn_values=[1])
    lm = lr.ReadAsArray() > 0
    out = a.astype(np.uint8).copy()
    out[lm] = (0, 0, 0)
    for c in comunas:
        if c[3] is None:
            continue
        px, py = f(np.array([c[3][0]]), np.array([c[3][1]]))
        x, y = int(round(float(px[0]))), int(round(float(py[0])))
        out[max(0, y - 2):y + 3, max(0, x - 2):x + 3] = (255, 0, 0)
    for g, (gx, gy) in zip(gcp, PX):
        x, y = int(round(gx)), int(round(gy))
        out[max(0, y - 4):y + 5, max(0, x - 1):x + 2] = (0, 0, 255)
        out[max(0, y - 1):y + 2, max(0, x - 4):x + 5] = (0, 0, 255)
    m = gdal.GetDriverByName('MEM').Create('', Wd, H, 3, gdal.GDT_Byte)
    for b in range(3):
        m.GetRasterBand(b + 1).WriteArray(out[:, :, b])
    gdal.GetDriverByName('PNG').CreateCopy(os.path.join(R, 'SIG', 'brut', 'cors', 'controle-%s.png' % clau), m)

camps = ['codi', 'nom']
for k in CARTAS:
    camps += [k + '_cl', k + '_dist_km', k + '_disc', k + '_poly', k + '_cobert']
with open(SORTIDA, 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(camps)
    for c in comunas:
        r = resultats[c[0]]
        w.writerow([c[0]] + [r.get(k, '') for k in camps[1:]])
print('\n%s' % SORTIDA)
for k in CARTAS:
    cnt = {}
    for c in comunas[:nfr]:
        v = resultats[c[0]].get(k + '_cl', '?')
        cnt[v] = cnt.get(v, 0) + 1
    print('  %s (chefs-lieux corses) : %s' % (k, ', '.join('%s %d' % kv for kv in sorted(cnt.items(), key=lambda x: -x[1]))))
