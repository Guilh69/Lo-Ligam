# Aisinas comunas per calar una carta imatge (carta dialectala de Wikimedia
# Commons, carta d'un article) sus las comunas vertadièras, sens ponches de
# calatge picats a la man : l'afinitat pixèl -> mètres (EPSG:3035) es cercada
# de biais que lo contorn de la tèrra de la carta tombe sul contorn de las
# comunas (distància de chanfren simetrica, metòde de Powell). Puèi cada
# comuna recep la part de cada color (zòna) de la carta que la cobrís.
#
# Modul cargat per flamenc-carta-*.py e belgica-carta.py :
#   spec = importlib.util.spec_from_file_location('calatge', '.../flamenc-calatge.py')
import json, math
import numpy as np
from scipy import ndimage, optimize
from osgeo import gdal, ogr, osr

gdal.UseExceptions()
ogr.UseExceptions()
osr.UseExceptions()

WGS = osr.SpatialReference(); WGS.ImportFromEPSG(4326)
LAEA = osr.SpatialReference(); LAEA.ImportFromEPSG(3035)
for _s in (WGS, LAEA):
    _s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
VERS_LAEA = osr.CoordinateTransformation(WGS, LAEA)


def projeccion(proj4):
    """Cambiar la projeccion de trabalh (per defaut EPSG:3035) : las cartas
    de Wikipèdia son sovent en plata carrada (+proj=eqc) o en Mercator."""
    global LAEA, VERS_LAEA
    LAEA = osr.SpatialReference(); LAEA.ImportFromProj4(proj4)
    LAEA.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    VERS_LAEA = osr.CoordinateTransformation(WGS, LAEA)


def cargar_comunas(camins, filtre=None):
    """GeoJSON WGS84 -> lista de (props, geometria OGR en EPSG:3035)."""
    out = []
    for c in camins:
        d = json.load(open(c, encoding='utf-8'))
        for f in d['features']:
            p = f['properties']
            if filtre and not filtre(p):
                continue
            g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
            g.Transform(VERS_LAEA)
            out.append((p, g))
    return out


def raster_geoms(geoms, gt, w, h, valors=None, tot_tocat=False):
    """Rasteriza de geometrias EPSG:3035 dins una grasilha (geotransform gt)."""
    drv = ogr.GetDriverByName('Memory')
    ds = drv.CreateDataSource('m')
    lay = ds.CreateLayer('l', LAEA, ogr.wkbMultiPolygon)
    lay.CreateField(ogr.FieldDefn('v', ogr.OFTInteger))
    for i, g in enumerate(geoms):
        f = ogr.Feature(lay.GetLayerDefn())
        f.SetGeometry(g)
        f.SetField('v', int(valors[i]) if valors is not None else 1)
        lay.CreateFeature(f)
    r = gdal.GetDriverByName('MEM').Create('', w, h, 1, gdal.GDT_Int32)
    r.SetGeoTransform(gt)
    r.SetProjection(LAEA.ExportToWkt())
    r.GetRasterBand(1).Fill(0 if valors is None else -1)
    opts = ['ATTRIBUTE=v'] + (['ALL_TOUCHED=TRUE'] if tot_tocat else [])
    gdal.RasterizeLayer(r, [1], lay, options=opts)
    return r.GetRasterBand(1).ReadAsArray()


def bord(m):
    """Pixèls del masc que tòcan un pixèl defòra."""
    er = ndimage.binary_erosion(m, structure=np.ones((3, 3)), border_value=0)
    return m & ~er


def calar(masc, geoms, res=250.0, ensag=None, caps=(30000, 12000, 5000, 2500), n=6000, semença=1, projectiu=False):
    """Cèrca l'afinitat A (2x3) : [x, y] (EPSG:3035) = A @ [px, py, 1].
    masc : booleans (H, W), la tèrra de la carta ; geoms : contorns de referéncia.
    Torna A e l'escart mejan (m) dels bords, dins los dos sens."""
    H, W = masc.shape
    env = [g.GetEnvelope() for g in geoms]
    x0 = min(e[0] for e in env) - 20000; x1 = max(e[1] for e in env) + 20000
    y0 = min(e[2] for e in env) - 20000; y1 = max(e[3] for e in env) + 20000
    w, h = int((x1 - x0) / res), int((y1 - y0) / res)
    gt = (x0, res, 0, y1, 0, -res)
    ref = raster_geoms(geoms, gt, w, h) > 0
    bref = bord(ref)
    dref = ndimage.distance_transform_edt(~bref) * res
    by, bx = np.nonzero(bref)
    rng = np.random.default_rng(semença)
    k = rng.choice(len(bx), min(n, len(bx)), replace=False)
    pref = np.stack([x0 + (bx[k] + 0.5) * res, y1 - (by[k] + 0.5) * res], axis=1)
    bm = bord(masc)
    dmap = ndimage.distance_transform_edt(~bm)
    my, mx = np.nonzero(bm)
    k = rng.choice(len(mx), min(n, len(mx)), replace=False)
    pmap = np.stack([mx[k] + 0.5, my[k] + 0.5, np.ones(len(k))], axis=1)

    def mat(v):
        if projectiu:
            return np.array([[v[0], v[1], v[2]], [v[3], v[4], v[5]], [v[6] * 1e-6, v[7] * 1e-6, 1.0]])
        return np.array([[v[0], v[1], v[2]], [v[3], v[4], v[5]], [0, 0, 1.0]])

    def cost(v, cap):
        M = mat(v)
        q = pmap @ M.T
        qx, qy = q[:, 0] / q[:, 2], q[:, 1] / q[:, 2]
        ix = ((qx - x0) / res).astype(int); iy = ((y1 - qy) / res).astype(int)
        ok = (ix >= 0) & (ix < w) & (iy >= 0) & (iy < h)
        d1 = np.full(len(qx), cap); d1[ok] = np.minimum(dref[iy[ok], ix[ok]], cap)
        try:
            Mi = np.linalg.inv(M)
        except np.linalg.LinAlgError:
            return 1e12
        r = np.concatenate([pref, np.ones((len(pref), 1))], axis=1) @ Mi.T
        rx, ry = r[:, 0] / r[:, 2], r[:, 1] / r[:, 2]
        jx, jy = rx.astype(int), ry.astype(int)
        ok = (jx >= 0) & (jx < W) & (jy >= 0) & (jy < H)
        pix = math.sqrt(abs(np.linalg.det(M[:2, :2])))
        d2 = np.full(len(rx), cap); d2[ok] = np.minimum(dmap[jy[ok], jx[ok]] * pix, cap)
        return d1.mean() + d2.mean()

    if ensag is None:
        ys, xs = np.nonzero(masc)
        ry, rx = np.nonzero(ref)
        sx = ((rx.max() - rx.min()) * res) / (xs.max() - xs.min())
        sy = ((ry.max() - ry.min()) * res) / (ys.max() - ys.min())
        ax = x0 + rx.min() * res - xs.min() * sx
        ay = y1 - ry.min() * res + ys.min() * sy
        v = np.array([sx, 0, ax, 0, -sy, ay])
    else:
        v = np.array(ensag, dtype=float).ravel()[:6]
    if projectiu:
        v = np.concatenate([v, [0.0, 0.0]])
    for cap in caps:
        r = optimize.minimize(cost, v, args=(cap,), method='Powell',
                              options={'xtol': 1e-3, 'ftol': 1e-3, 'maxfev': 20000})
        v = r.x
        print('    calatge, plafond %5.0f m : escart mejan %.0f m' % (cap, r.fun / 2))
    M = mat(v)
    return M, r.fun / 2


def _termes(u, v, ordre):
    return np.stack([u ** i * v ** (k - i) for k in range(ordre + 1) for i in range(k + 1)], axis=1)


def afinar(masc, geoms, M, res=300.0, caps=(8000, 5000, 3000, 2000), n=3000, ordre=3, semença=2, esclure=None):
    """Après l'afinitat, una deformacion lisa (polinòme d'òrdre 3, « rubber
    sheeting ») que mena lo contorn de la carta sul contorn vertadièr : las
    cartas dialectalas son dessenhadas a la man, una afinitat sola i laissa
    d'escarts de mantun quilomètre. Correspondéncias iterativas (ICP) : cada
    ponch del bord de la carta va al ponch del bord vertadièr pus pròche (s'es
    a mens de « cap »), mendres carrats robustes. esclure : masc (H, W) dels
    bords de la carta de pas utilizar (illas esquematicas…).
    Torna una foncion mètres -> pixèls (tablèu N x 2) e la foncion inversa."""
    from scipy.spatial import cKDTree
    H, W = masc.shape
    env = [g.GetEnvelope() for g in geoms]
    x0 = min(e[0] for e in env) - 20000; x1 = max(e[1] for e in env) + 20000
    y0 = min(e[2] for e in env) - 20000; y1 = max(e[3] for e in env) + 20000
    w, h = int((x1 - x0) / res), int((y1 - y0) / res)
    ref = raster_geoms(geoms, (x0, res, 0, y1, 0, -res), w, h) > 0
    by, bx = np.nonzero(bord(ref))
    pref = np.stack([x0 + (bx + 0.5) * res, y1 - (by + 0.5) * res], axis=1)
    arbre = cKDTree(pref)
    bm = bord(masc)
    if esclure is not None:
        bm &= ~esclure
    my, mx = np.nonzero(bm)
    rng = np.random.default_rng(semença)
    k = rng.choice(len(mx), min(n, len(mx)), replace=False)
    P = np.stack([mx[k] + 0.5, my[k] + 0.5], axis=1)
    cpx, cpy, sp = W / 2, H / 2, max(W, H) / 2
    Q = np.concatenate([P, np.ones((len(P), 1))], axis=1) @ M[:2].T
    cmx, cmy = Q[:, 0].mean(), Q[:, 1].mean()
    sm = sp * math.sqrt(abs(np.linalg.det(M[:2, :2])))

    def avant(coef, pts):
        A = _termes((pts[:, 0] - cpx) / sp, (pts[:, 1] - cpy) / sp, ordre)
        o = A @ coef
        return np.stack([o[:, 0] * sm + cmx, o[:, 1] * sm + cmy], axis=1)
    # començar per l'afinitat
    A = _termes((P[:, 0] - cpx) / sp, (P[:, 1] - cpy) / sp, ordre)
    coef = np.linalg.lstsq(A, np.stack([(Q[:, 0] - cmx) / sm, (Q[:, 1] - cmy) / sm], axis=1), rcond=None)[0]
    d0, _ = arbre.query(avant(coef, P))
    print('    afinitat : escart mejan %.0f m (mediana %.0f m)' % (np.minimum(d0, caps[0]).mean(), np.median(d0)))
    for cap in caps:
        for _ in range(3):
            Q = avant(coef, P)
            dist, j = arbre.query(Q)
            ok = dist < cap
            T = pref[j]
            for _r in range(3):  # mendres carrats robustes
                c2 = np.linalg.lstsq(A[ok], np.stack([(T[ok, 0] - cmx) / sm, (T[ok, 1] - cmy) / sm], axis=1), rcond=None)[0]
                res_ = np.hypot(*(avant(c2, P) - T).T)
                ok = ok & (res_ < max(3 * np.median(res_[ok]), res * 2))
            coef = c2
        d2, _ = arbre.query(avant(coef, P))
        print('    deformacion (polinòme %d), plafond %5.0f m : %d correspondéncias, escart mejan %.0f m (mediana %.0f m)'
              % (ordre, cap, ok.sum(), np.minimum(d2, cap).mean(), np.median(d2)))
    # inversa : sus una grasilha de ponches de la carta
    gy, gx = np.mgrid[0:H:8, 0:W:8]
    G = np.stack([gx.ravel() + 0.5, gy.ravel() + 0.5], axis=1)
    GQ = avant(coef, G)
    B = _termes((GQ[:, 0] - cmx) / sm, (GQ[:, 1] - cmy) / sm, ordre + 2)
    ci = np.linalg.lstsq(B, (G - [cpx, cpy]) / sp, rcond=None)[0]
    err = np.hypot(*((B @ ci) * sp + [cpx, cpy] - G).T)
    print('    inversa : escart mejan %.2f pixèl (max %.1f)' % (err.mean(), err.max()))

    def mètres_vers_pixèls(x, y):
        x = np.ravel(x); y = np.ravel(y)
        B = _termes((x - cmx) / sm, (y - cmy) / sm, ordre + 2)
        return (B @ ci) * sp + [cpx, cpy]

    def pixèls_vers_mètres(px, py):
        return avant(coef, np.stack([np.ravel(px), np.ravel(py)], axis=1))
    return mètres_vers_pixèls, pixèls_vers_mètres


def reprojectar(classa, foncion, gt, w, h, pas=8):
    """La carta classada sus una grasilha en mètres (gt, w, h) : pixèl de la
    carta calculat sus una grasilha grossièra (cada « pas » malhas) puèi
    interpolat."""
    from scipy.ndimage import map_coordinates
    H, W = classa.shape
    gx = np.arange(0, w + pas, pas); gy = np.arange(0, h + pas, pas)
    X = gt[0] + (gx[None, :] + 0.5) * gt[1] + 0 * gy[:, None]
    Y = gt[3] + (gy[:, None] + 0.5) * gt[5] + 0 * gx[None, :]
    p = foncion(X, Y)
    PX = p[:, 0].reshape(X.shape); PY = p[:, 1].reshape(X.shape)
    fy = np.arange(h) / pas; fx = np.arange(w) / pas
    FY, FX = np.meshgrid(fy, fx, indexing='ij')
    px = map_coordinates(PX, [FY, FX], order=1)
    py = map_coordinates(PY, [FY, FX], order=1)
    ix = np.round(px).astype(int); iy = np.round(py).astype(int)
    ok = (ix >= 0) & (ix < W) & (iy >= 0) & (iy < H)
    out = np.full((h, w), -1, dtype=np.int32)
    out[ok] = classa[iy[ok], ix[ok]]
    return out


def parts_grilha(cgrid, gt, comunas, ncl):
    """Per cada comuna, pixèls de cada classa sus la grasilha en mètres
    (colomna 0 : defòra la carta)."""
    h, w = cgrid.shape
    ids = raster_geoms([g for _, g in comunas], gt, w, h, valors=list(range(len(comunas))))
    ok = ids >= 0
    tab = np.bincount(ids[ok] * (ncl + 1) + cgrid[ok] + 1, minlength=len(comunas) * (ncl + 1)).reshape(len(comunas), ncl + 1)
    for i, (p, g) in enumerate(comunas):
        if tab[i].sum() == 0:
            pt = g.PointOnSurface()
            ix = int((pt.GetX() - gt[0]) / gt[1]); iy = int((pt.GetY() - gt[3]) / gt[5])
            if 0 <= ix < w and 0 <= iy < h:
                tab[i, cgrid[iy, ix] + 1] += 1
    return tab


def grilha(geoms, res, marge=5000):
    env = [g.GetEnvelope() for g in geoms]
    x0 = min(e[0] for e in env) - marge; x1 = max(e[1] for e in env) + marge
    y0 = min(e[2] for e in env) - marge; y1 = max(e[3] for e in env) + marge
    w, h = int((x1 - x0) / res) + 1, int((y1 - y0) / res) + 1
    return (x0, res, 0, y1, 0, -res), w, h


def contraròtle(cgrid, colors, gt, comunas, cami, fons=(255, 255, 255)):
    """Imatge de contraròtle : la carta reprojectada e los limits de las comunas."""
    h, w = cgrid.shape
    img = np.zeros((h, w, 3), np.uint8); img[:] = fons
    for i, c in enumerate(colors):
        img[cgrid == i] = c
    ids = raster_geoms([g for _, g in comunas], gt, w, h, valors=list(range(len(comunas))))
    lim = np.zeros((h, w), bool)
    lim[:, 1:] |= ids[:, 1:] != ids[:, :-1]
    lim[1:, :] |= ids[1:, :] != ids[:-1, :]
    img[lim] = (90, 0, 0)
    png(img, cami)


def emplenar(classa, dins):
    """Los pixèls sens classa (-1 : traits, letras) dins la tèrra prenon la
    classa pus pròcha."""
    vuege = (classa < 0)
    _, (iy, ix) = ndimage.distance_transform_edt(vuege, return_indices=True)
    c = classa[iy, ix]
    c[~dins] = -1
    return c


def parts(classa, M, comunas, ncl, ombra=None):
    """Per cada comuna, lo nombre de pixèls de cada classa (0..ncl-1) e los
    pixèls defòra la carta (classa -1). M afinitat pixèl -> EPSG:3035
    (afina solament). Las comunas tròp pichonas per aver un pixèl son
    tastadas a lor ponch interior."""
    H, W = classa.shape
    gt = (M[0, 2], M[0, 0], M[0, 1], M[1, 2], M[1, 0], M[1, 1])
    ids = raster_geoms([g for _, g in comunas], gt, W, H, valors=list(range(len(comunas))))
    ok = ids >= 0
    cl = classa[ok] + 1  # 0 = defòra
    idv = ids[ok]
    tab = np.bincount(idv * (ncl + 1) + cl, minlength=len(comunas) * (ncl + 1)).reshape(len(comunas), ncl + 1)
    Mi = np.linalg.inv(M)
    for i, (p, g) in enumerate(comunas):
        if tab[i].sum() == 0:
            pt = g.PointOnSurface()
            q = Mi @ np.array([pt.GetX(), pt.GetY(), 1.0])
            px, py = int(q[0]), int(q[1])
            if 0 <= px < W and 0 <= py < H:
                tab[i, classa[py, px] + 1] += 1
    return tab


def pixel_de(M, lon, lat):
    pt = ogr.Geometry(ogr.wkbPoint); pt.AddPoint_2D(lon, lat); pt.Transform(VERS_LAEA)
    q = np.linalg.inv(M) @ np.array([pt.GetX(), pt.GetY(), 1.0])
    return q[0], q[1]


def geotiff(classa, M, cami):
    """Escriu la carta classada calada (contraròtle dins QGIS)."""
    H, W = classa.shape
    r = gdal.GetDriverByName('GTiff').Create(cami, W, H, 1, gdal.GDT_Int16, ['COMPRESS=DEFLATE'])
    r.SetGeoTransform((M[0, 2], M[0, 0], M[0, 1], M[1, 2], M[1, 0], M[1, 1]))
    r.SetProjection(LAEA.ExportToWkt())
    b = r.GetRasterBand(1); b.WriteArray(classa.astype(np.int16)); b.SetNoDataValue(-1)
    r = None


def png(rgb, cami):
    """Escriu un PNG (H, W, 3) uint8 per GDAL (sens PIL)."""
    H, W, _ = rgb.shape
    m = gdal.GetDriverByName('MEM').Create('', W, H, 3, gdal.GDT_Byte)
    for i in range(3):
        m.GetRasterBand(i + 1).WriteArray(rgb[:, :, i])
    gdal.GetDriverByName('PNG').CreateCopy(cami, m)
