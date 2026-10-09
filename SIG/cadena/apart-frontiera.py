# Las zònas « a despart » d'una lenga (la part de França : Catalunya Nord,
# Arpitania de França) se pegan a la frontièra nacionala (Romain, 2026-10-09 :
# « quand je le sélectionne, se colle à la frontière nationale. Idem pour le
# catalan »).
#
# Principi : se calar sus la donada pus segura. Aquí, la frontièra d'Estat de
# l'IGN, la meteissa que los despartaments de la carta (limits-carta.json) ;
# las comunas de la zòna a despart, simplificadas a 300 m, ne flotavan de
# qualques centenats de mètres. Zòna a despart = domeni de la lenga − estrangièr,
# ont l'estrangièr = païses vesins de Natural Earth espandits de 3 km, levat
# França (despartaments) : son bòrd es exactament la frontièra dels
# despartaments ; la còsta del domeni (Rosselhon) es pas tocada.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/apart-frontiera.py
#
# De tornar aviar aprèp catalan.py / catalan-app.mjs e arpitan.py / arpitan-app.mjs.
import json, math, os
from osgeo import ogr

ogr.UseExceptions()
RAIC = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DATA = os.path.join(RAIC, 'app', 'static', 'data')
LENGAS = {
    'catalan.json': ['Spain', 'Andorra'],
    'arpitan.json': ['Switzerland', 'Italy'],
}
ESPAND = 0.03  # gra (environ 3 km)


def valid(g):
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    if g is None or g.IsEmpty():
        return m
    if not g.IsValid():
        g = g.MakeValid()
    def apondre(p):
        t = ogr.GT_Flatten(p.GetGeometryType())
        if t == ogr.wkbPolygon:
            if not p.IsEmpty():
                m.AddGeometry(p)
        elif t in (ogr.wkbMultiPolygon, ogr.wkbGeometryCollection):
            for i in range(p.GetGeometryCount()):
                apondre(p.GetGeometryRef(i))
    apondre(g)
    return m


def anel(a):
    r = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in a:
        r.AddPoint_2D(x, y)
    r.CloseRings()
    p = ogr.Geometry(ogr.wkbPolygon)
    p.AddGeometry(r)
    return valid(p)


def evenodd(anels):
    g = ogr.Geometry(ogr.wkbPolygon)
    for a in anels:
        g = g.SymDifference(anel(a))
    return valid(g)


def km2(g):
    return sum(valid(g).GetGeometryRef(i).GetArea() for i in range(valid(g).GetGeometryCount())) * 111.32 * 111.32 * 0.7


# França : los despartaments de la carta
L = json.load(open(os.path.join(DATA, 'limits-carta.json'), encoding='utf-8'))
fr = ogr.Geometry(ogr.wkbMultiPolygon)
for _, _, anels in L['despartaments']:
    for p in valid(evenodd(anels)):
        fr.AddGeometry(p.Clone())
franca = valid(fr.UnaryUnion())

# los païses vesins (TopoJSON de Natural Earth, SIG/brut/mond)
topo = json.load(open(os.path.join(RAIC, 'SIG', 'brut', 'mond', 'countries-50m.json'), encoding='utf-8'))
sc, tr = topo['transform']['scale'], topo['transform']['translate']
arcs = []
for a in topo['arcs']:
    x = y = 0
    pts = []
    for dx, dy in a:
        x += dx
        y += dy
        pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
    arcs.append(pts)


def anel_ne(idxs):
    pts = []
    for i in idxs:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts += a if not pts else a[1:]
    return pts


def païs(nom):
    o = next(o for o in topo['objects']['countries']['geometries'] if o.get('properties', {}).get('name') == nom)
    pols = o['arcs'] if o['type'] == 'MultiPolygon' else [o['arcs']]
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for p in pols:
        for q in valid(anel(anel_ne(p[0]))):
            m.AddGeometry(q.Clone())
    return valid(m.UnaryUnion())


def anels_de(g):
    out = []
    for p in valid(g):
        for k in range(p.GetGeometryCount()):
            r = p.GetGeometryRef(k)
            out.append([[round(r.GetX(j), 4), round(r.GetY(j), 4)] for j in range(r.GetPointCount())])
    return out


for fic, vesins in LENGAS.items():
    pf = os.path.join(DATA, fic)
    d = json.load(open(pf, encoding='utf-8'))
    dom = evenodd(d['domeni']['anels'])
    estr = ogr.Geometry(ogr.wkbMultiPolygon)
    for n in vesins:
        for q in païs(n).Buffer(ESPAND, 4).Difference(franca):
            pass
        for q in valid(païs(n).Buffer(ESPAND, 4).Difference(franca)):
            estr.AddGeometry(q.Clone())
    estr = valid(estr.UnaryUnion())
    for f in d['features']:
        p = f['properties']
        if not p.get('apart'):
            continue
        abans = valid(ogr.CreateGeometryFromJson(json.dumps(f['geometry'])))
        nòu = valid(dom.Difference(estr))
        # (sonque los tròces que tòcan l'anciana zòna : pas d'illòts del domeni
        # que serián estats defòra de França)
        tròces = [q.Clone() for q in nòu if q.Intersects(abans)]
        m = ogr.Geometry(ogr.wkbMultiPolygon)
        for q in tròces:
            m.AddGeometry(q)
        nòu = valid(m)
        f['geometry'] = {'type': 'MultiPolygon', 'coordinates': [[[list(pt) for pt in a] for a in [anels_de(q)[i] for i in range(len(anels_de(q)))]] for q in nòu]}
        if not valid(ogr.CreateGeometryFromJson(json.dumps(f['geometry']))).Contains(ogr.CreateGeometryFromWkt('POINT (%f %f)' % tuple(p['eti']))):
            c = nòu.PointOnSurface()
            p['eti'] = [round(c.GetX(), 3), round(c.GetY(), 3)]
        n = sum(len(a) for pol in f['geometry']['coordinates'] for a in pol)
        print('%s / %s : %.0f km2 -> %.0f km2 (diferéncia %.1f km2), %d ponches' % (
            fic, p['kod'], km2(abans), km2(nòu), km2(valid(abans.SymDifference(nòu))), n))
    json.dump(d, open(pf, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
