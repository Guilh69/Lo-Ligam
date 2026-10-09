# Lo bòrd de mar del domeni occitan, del catalan e de lors dialèctes, calat
# sus una sola referéncia tèrra / aiga : las comunas de l'IGN (metòde causit
# lo 2026-10-09, aprèp un estat dels luòcs : retorn de Romain, « faire
# correspondre la donnée des dialectes et la donnée de côte de manière
# précise, par une jointure spatiale »).
#
# Abans, costa-domeni.py copava lo domeni per la còsta Natural Earth (~1 km)
# e l'alargava de 1,5 km cap a la mar per pas perdre las vilas de lido : la
# tencha dels dialèctes (copada pel domeni a l'afichatge) passava 1,3 a 1,5 km
# al larg (1 300 km² en mar). Las comunas de l'IGN seguisson la còsta a
# qualques mètres (Erau : 70 % del bòrd a mens de 10 m de la limita tèrra-mar
# Shom-IGN). La règla, per cada domeni (occitan, catalan) :
#   1. domeni − aiga (l'aiga de mar.py : zòna − comunas − païses vesins
#      alargats) : la tèrra demòra tala quala, cada frontièra s'arrèsta al
#      ribatge ;
#   2. una comuna que tòca l'aiga e qu'es dins lo domeni a mai de mitat i
#      apond sa tèrra de la benda de 1 km long de l'aiga (lidos, pòrts,
#      illas), levat a mens de 300 m d'una frontièra (la tolerància dels
#      anèls) ;
#   3. aquela tèrra aponduda va al dialècte majoritari de sa comuna, se cap
#      de dialècte la cobrís ja (los dialèctes gardan lor bòrd larg en mar :
#      l'afichatge los copa pel domeni) ;
#   4. las frontièras (linhas) : un cap dins l'aiga es copat al ribatge ; un
#      cap en tèrra a mens de 2,5 km de l'aiga i es menat (dins l'axe de son
#      darrièr segment, si que non al ponch de ribatge mai pròche).
# Las limitas terrèstras se mòvon pas. L'estanh de Berre, lo bacin
# d'Arcaishon e l'estuari de la Gironda son dins cap de comuna : son d'aiga,
# sens tencha (la còla mar, ela, los pinta pas : la fòto i es).
#
# S'aplica a la fin de la cadena (aprèp apart-frontiera.py), sus los fichièrs
# de app/static/data ; un segond passatge cambia pas res. Entradas : las de
# mar.py. Sortidas : limits-carta.json (domeni), dialectes.geojson,
# catalan.json (domeni e dialèctes).
#
# Usatge : "C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat" SIG/cadena/costa-ref.py [dorsièr de sortida]
import json
import os
import sys

from osgeo import ogr

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mar import RAIC, tèrra_e_aiga, unir, versL93, versWGS  # noqa: E402

ogr.UseExceptions()
DATA = os.path.join(RAIC, 'app', 'static', 'data')
SORTIDA = sys.argv[1] if len(sys.argv) > 1 else DATA
SIMPL = 40  # m : la tencha s'esvanís entre los zooms 11,5 e 13 (un ponch : 40 a 14 m)
LARG = 150  # m : l'apondut d'un dialècte, larg (lo domeni lo copa a l'afichatge)
BENDA = 1000  # m
FRONT = 300  # m
CAP = 2500  # m
MIN = 50000  # m² : illòts e micas de mens de 5 ha, que se veirián pas
FIN = 8  # m : un tròç de mens de 16 m de larg es una mica d'arredondit (4 decimalas : ±6 m)


def poligònes(g):
    t = ogr.GT_Flatten(g.GetGeometryType())
    if t == ogr.wkbPolygon:
        yield g
    elif t in (ogr.wkbMultiPolygon, ogr.wkbGeometryCollection):
        for k in range(g.GetGeometryCount()):
            yield from poligònes(g.GetGeometryRef(k))


def anèlsEnGeom(anèls):
    """Anèls [[lon, lat]…] emplenats en par-impar → geometria en Lambert-93."""
    g = None
    for a in anèls:
        r = ogr.Geometry(ogr.wkbLinearRing)
        for x, y in a:
            r.AddPoint_2D(x, y)
        r.CloseRings()
        p = ogr.Geometry(ogr.wkbPolygon)
        p.AddGeometry(r)
        p = p.MakeValid()
        g = p if g is None else g.SymDifference(p)
    g.Transform(versL93)
    return g


def ancians(anèls):
    """Los sommets d'origina, per los tornar escriure tals quals (son partejats
    amb d'autras còlas al ponch près) : (lon, lat) a 7 decimalas → [lon, lat]
    (l'anar-tornar en Lambert-93 desplaça d'un milliardena de grau ; doas
    originas pròchas d'un mètre demòran distinctas)."""
    return {(round(x, 7), round(y, 7)): [x, y] for a in anèls for x, y in a}


def geomEnPoligònes(g, dec, gardar=None):
    """Geometria en Lambert-93 → [[anèl de fòra, traucs…]…] en graus, sens los
    anèls de mens de MIN m². Un sommet d'origina (gardar) es tornat tal qual ;
    los novèls an dec decimalas."""
    gardar = gardar or {}
    res = []
    for p in poligònes(g):
        p = p.Clone()
        aires = [ogr.ForceToPolygon(p.GetGeometryRef(k).Clone()).GetArea() for k in range(p.GetGeometryCount())]
        if aires[0] < MIN:
            continue
        p.Transform(versWGS)
        anèls = []
        for k in range(p.GetGeometryCount()):
            if aires[k] < MIN:
                continue
            r = p.GetGeometryRef(k)
            pts = []
            for m in range(r.GetPointCount()):
                q = gardar.get((round(r.GetX(m), 7), round(r.GetY(m), 7))) or [round(r.GetX(m), dec), round(r.GetY(m), dec)]
                if not pts or q != pts[-1]:
                    pts.append(q)
            if len(pts) >= 4:
                anèls.append(pts)
        if anèls:
            res.append(anèls)
    return res


def epès(g, isolat=None):
    """Los tròces de g de mai de 2·FIN de larg (las micas d'arredondit
    s'oblidan : un segond passatge cambia pas res), levat los tròces de mens
    de MIN m² que serián un anèl a despart (illa o trauc), que lo fichièr
    gardariá pas : isolat(p) o ditz."""
    return [p.Clone() for p in poligònes(g) if not p.Buffer(-FIN).IsEmpty() and not (p.GetArea() < MIN and isolat and isolat(p))]


def linhaEnGeom(l):
    g = ogr.Geometry(ogr.wkbLineString)
    for x, y in l:
        g.AddPoint_2D(x, y)
    g.Transform(versL93)
    return g


def enWGS(x, y, dec=5):
    p = ogr.Geometry(ogr.wkbPoint)
    p.AddPoint_2D(x, y)
    p.Transform(versWGS)
    return [round(p.GetX(), dec), round(p.GetY(), dec)]


def menarAlRibatge(pts, aiga, ribatge):
    """Lo cap pts[-1] (en tèrra) menat fins a l'aiga, se n'es a mens de CAP."""
    (x0, y0), (x1, y1) = pts[-2], pts[-1]
    cap = ogr.Geometry(ogr.wkbPoint)
    cap.AddPoint_2D(x1, y1)
    dist = cap.Distance(aiga)
    if dist > CAP or dist < 1:  # (luènh de l'aiga, o ja al ribatge)
        return pts
    d = ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** 0.5 or 1
    rai = ogr.Geometry(ogr.wkbLineString)
    rai.AddPoint_2D(x1, y1)
    rai.AddPoint_2D(x1 + (x1 - x0) / d * CAP, y1 + (y1 - y0) / d * CAP)
    tòca = rai.Intersection(ribatge)
    if tòca and not tòca.IsEmpty():
        ps = [tòca.GetGeometryRef(k) for k in range(tòca.GetGeometryCount())] if tòca.GetGeometryCount() else [tòca]
        pm = min((p for p in ps if ogr.GT_Flatten(p.GetGeometryType()) == ogr.wkbPoint), key=lambda p: p.Distance(cap), default=None)
        if pm is not None:
            return pts + [(pm.GetX(), pm.GetY())]
    # (si que non, lo ponch de ribatge mai pròche : un cap pausat a la man,
    # coma a Leucata ; lo ribatge es simplificat a SIMPL, sos sommets son pròches)
    near = cap.Buffer(CAP).Intersection(ribatge)
    best = None
    for sub in ([near.GetGeometryRef(k) for k in range(near.GetGeometryCount())] if near.GetGeometryCount() else [near]):
        for m in range(sub.GetPointCount()):
            q = (sub.GetX(m), sub.GetY(m))
            dq = (q[0] - x1) ** 2 + (q[1] - y1) ** 2
            if best is None or dq < best[0]:
                best = (dq, q)
    return pts + [best[1]] if best else pts


def recalarLinhas(linhas, aiga, ribatge):
    """Etapa 4, sonque suls caps : los sommets d'origina demòran tals quals."""
    res = []
    for l in linhas:
        g = linhaEnGeom(l)
        pts = [(g.GetX(m), g.GetY(m)) for m in range(g.GetPointCount())]
        dins = []
        for x, y in pts:
            p = ogr.Geometry(ogr.wkbPoint)
            p.AddPoint_2D(x, y)
            dins.append(p.Within(aiga))
        # los trachs de sommets en tèrra (una linha que traversa l'aiga se copa)
        trachs, cur = [], []
        for k, d in enumerate(dins):
            if d:
                if cur:
                    trachs.append(cur)
                cur = []
            else:
                cur.append(k)
        if cur:
            trachs.append(cur)
        for t in trachs:
            a, b = t[0], t[-1]
            nòu = [list(l[k]) for k in t]
            for (k, vesin, pas) in ((a, a - 1, 1), (b, b + 1, -1)):
                if 0 <= vesin < len(pts):
                    # lo cap venguèt d'un sommet dins l'aiga : copat al ribatge
                    seg = ogr.Geometry(ogr.wkbLineString)
                    seg.AddPoint_2D(*pts[k])
                    seg.AddPoint_2D(*pts[vesin])
                    x = seg.Intersection(ribatge)
                    p0 = ogr.Geometry(ogr.wkbPoint)
                    p0.AddPoint_2D(*pts[k])
                    qs = [x.GetGeometryRef(i) for i in range(x.GetGeometryCount())] if x.GetGeometryCount() else [x]
                    q = min((q for q in qs if q and not q.IsEmpty()), key=lambda q: q.Distance(p0), default=None)
                    if q is not None:
                        pq = enWGS(q.GetX(), q.GetY())
                        nòu = [pq] + nòu if pas == 1 else nòu + [pq]
                elif len(t) >= 2:
                    # lo cap es en tèrra : menat al ribatge s'es pròche
                    seq = [pts[i] for i in (t[::-1] if pas == 1 else t)]
                    mes = menarAlRibatge(seq[-2:], aiga, ribatge)
                    if len(mes) > 2:
                        pq = enWGS(*mes[-1])
                        nòu = [pq] + nòu if pas == 1 else nòu + [pq]
            if len(nòu) >= 2:
                res.append(nòu)
    return res


def recalar(dom, linhas, aiga, tèrra, benda, comunas):
    """Etapas 1 e 2 : lo domeni sus la tèrra, e sa tèrra oblidada long de l'aiga."""
    # (un tròç d'aiga tot dins lo domeni seriá un trauc)
    levar = epès(dom.Intersection(aiga), lambda p: p.Buffer(1).Within(dom))
    d1 = dom.Difference(unir(levar)) if levar else dom
    lims = unir([linhaEnGeom(l).Buffer(FRONT) for l in linhas]) if linhas else None
    oblits = []
    for còdi, cg in comunas:
        if cg.Intersection(d1).GetArea() < 0.5 * cg.GetArea():
            continue
        o = cg.Intersection(tèrra).Intersection(benda).Difference(d1)
        if lims is not None:
            o = o.Difference(lims)
        # (un tròç que tòca pas lo domeni seriá una illa)
        o = epès(o, lambda p: not p.Intersects(d1.Buffer(1)))
        if o:
            oblits.append((còdi, unir(o)))
    if not levar and not oblits:
        return None, []  # (res a cambiar)
    return unir([d1, *(o for _, o in oblits)]) if oblits else d1, oblits


def apondreAsDialèctes(features, oblits, comunas):
    """Etapa 3 : la tèrra aponduda al dialècte majoritari de sa comuna."""
    geoms, orig = [], []
    for f in features:
        gm = f['geometry']
        anèls = gm['coordinates'] if gm['type'] == 'Polygon' else [a for p in gm['coordinates'] for a in p]
        geoms.append(anèlsEnGeom(anèls))
        orig.append(ancians(anèls))
    totes = unir(geoms)
    perComuna = dict(comunas)
    apond = [[] for _ in features]
    for còdi, o in oblits:
        o = epès(o.Difference(totes))
        if not o:
            continue
        o = unir(o)
        cg = perComuna[còdi]
        parts = [cg.Intersection(g).GetArea() for g in geoms]
        apond[parts.index(max(parts))].append(o)
    for i, f in enumerate(features):
        if not apond[i]:
            continue
        # (larg e simple : es lo domeni que dona la còsta a l'afichatge)
        autres = unir([g for k, g in enumerate(geoms) if k != i])
        larg = unir(apond[i]).Buffer(LARG).SimplifyPreserveTopology(LARG).Difference(autres)
        ps = geomEnPoligònes(unir([geoms[i], larg]), 4, orig[i])
        f['geometry'] = {'type': 'Polygon', 'coordinates': ps[0]} if len(ps) == 1 else {'type': 'MultiPolygon', 'coordinates': ps}
        print('   %s : %.2f km² aponduts' % (f['properties'].get('kod') or f['properties'].get('k') or i, sum(o.GetArea() for o in apond[i]) / 1e6))


def principal():
    zonas = tèrra_e_aiga(SIMPL)
    aiga = unir([z['aiga'] for z in zonas])
    tèrra = unir([z['tèrra'] for z in zonas])
    benda = aiga.Buffer(BENDA)
    ribatge = aiga.Boundary()
    vista = {}
    for z in zonas:
        for c, g in z['comunas']:
            vista.setdefault(c, g)
    tòcan = aiga.Buffer(10)
    comunas = [(c, g) for c, g in vista.items() if g.Intersects(tòcan)]
    print(len(comunas), "comunas tòcan l'aiga")

    sortidas = {}
    for nom, dial in (('limits-carta.json', 'dialectes.geojson'), ('catalan.json', None)):
        donadas = json.load(open(os.path.join(DATA, nom), encoding='utf-8'))
        dom = donadas['domeni']
        g = anèlsEnGeom(dom['anels'])
        g2, oblits = recalar(g, dom['linhas'], aiga, tèrra, benda, comunas)
        print('%s : %.1f km² levats en aiga, %.2f km² aponduts' % (nom, g.Intersection(aiga).GetArea() / 1e6 if g2 else 0, sum(o.GetArea() for _, o in oblits) / 1e6))
        if g2 is not None:
            dom['anels'] = [a for p in geomEnPoligònes(g2, 4, ancians(dom['anels'])) for a in p]
        dom['linhas'] = recalarLinhas(dom['linhas'], aiga, ribatge)
        sortidas[nom] = donadas
        if dial:
            d = json.load(open(os.path.join(DATA, dial), encoding='utf-8'))
            apondreAsDialèctes(d['features'], oblits, comunas)
            sortidas[dial] = d
        elif donadas.get('features'):
            apondreAsDialèctes(donadas['features'], oblits, comunas)

    os.makedirs(SORTIDA, exist_ok=True)
    for nom, obj in sortidas.items():
        c = os.path.join(SORTIDA, nom)
        with open(c, 'w', encoding='utf-8') as fh:
            json.dump(obj, fh, separators=(',', ':'), ensure_ascii=False)
        print(nom, os.path.getsize(c) // 1024, 'Ko')


if __name__ == '__main__':
    principal()
