# La mar del satellit (retorn de Romain, 2026-10-09 : « une couche en dehors
# des limites terrestres, qui fait un fondu jusqu'à la côte, et qui ne touche
# pas du tout l'intérieur des terres »).
#
# Al larg, a partir del zoom 13, l'IGN a pas mai de fòto : tuèlas blancas,
# puèi res. La carta pausa per dessús una mar d'un blau unit (lo de l'IGN al
# zoom 12, rgb(10, 59, 89)), en fondut fins a la còsta. Aqueste escript
# fabrica aquela mar, a partir de la referéncia tèrra / aiga de la carta
# (tèrra_e_aiga, que servís tanben a costa-ref.py) :
#   aiga = zòna − comunas de l'IGN (lo vertadièr trait de còsta, a qualques
#          mètres) − païses estrangièrs de Natural Earth alargats de 2 km (son
#          trait es a ~1 km près : la mar i demòra al larg, sens tocar la tèrra)
#   mar = aiga − l'estanh de Berre, lo bacin d'Arcaishon e l'estuari de la
#         Gironda (aigas dins las tèrras, que la fòto mòstra plan)
# Doas zònas : la Mediterranèa del domeni (de Cotlliure a Menton) e la còsta
# gascona (de Hendaia a la Gironda). Copadas en cases de 0,25° per que la
# carta dessenhe sonque çò que se vei ; los bòrds de las cases son pas de
# còsta (la carta i fa pas de fondut).
#
# Entradas : SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg (IGN ADMIN EXPRESS COG
# CARTO 2026, Licéncia dobèrta 2.0), SIG/brut/mond/countries-50m.json
# (Natural Earth, domeni public, via world-atlas).
# Sortida : app/static/data/mar.json — per cada tròç, sos anèls en entièrs
# (1e-5 grau), en diferéncias.
#
# Usatge : "C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat" SIG/cadena/mar.py [dorsièr de sortida]
import json
import os
import sys

from osgeo import ogr, osr

ogr.UseExceptions()
RAIC = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SORTIDA = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIC, 'app', 'static', 'data')
ZONAS = [(2.75, 41.75, 7.75, 44.0), (-2.25, 43.25, -0.75, 45.75)]  # o, s, e, n (multiples de 0,25)
CASA = 0.25
ESTRANGIER = 2000  # m
SIMPL = 8  # m (invisible jos un fondut de 500 m)
Q = 100000
# aigas dins las tèrras, que l'IGN compta coma mar : o, s, e, n
# un païs vesin a sa còsta precisa quand l'avèm (limits OpenStreetMap, que
# seguisson lo ribatge) ; endacòm mai, Natural Earth alargat de ESTRANGIER
PRECIS = {'Spain': os.path.join(RAIC, 'SIG', 'brut', 'catalan', 'geojson', 'catalonha-limit.geojson')}
DINS = [(4.96, 43.415, 5.26, 43.57), (-1.24, 44.59, -0.98, 44.79), (-1.07, 45.03, -0.53, 45.60)]

wgs, l93 = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326)
l93.ImportFromEPSG(2154)
for s in (wgs, l93):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versL93, versWGS = osr.CoordinateTransformation(wgs, l93), osr.CoordinateTransformation(l93, wgs)


def rect(o, s, e, n):
    r = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in ((o, s), (e, s), (e, n), (o, n), (o, s)):
        r.AddPoint_2D(x, y)
    p = ogr.Geometry(ogr.wkbPolygon)
    p.AddGeometry(r)
    return p


def enL93(g):
    g = g.Clone()
    g.Segmentize(0.01)  # (un rectangle en graus se corba en Lambert)
    g.Transform(versL93)
    return g


def unir(gs):
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for g in gs:
        g = g.MakeValid() if not g.IsValid() else g
        t = g.GetGeometryType()
        if ogr.GT_Flatten(t) == ogr.wkbPolygon:
            m.AddGeometry(g)
        elif ogr.GT_Flatten(t) in (ogr.wkbMultiPolygon, ogr.wkbGeometryCollection):
            for i in range(g.GetGeometryCount()):
                if ogr.GT_Flatten(g.GetGeometryRef(i).GetGeometryType()) == ogr.wkbPolygon:
                    m.AddGeometry(g.GetGeometryRef(i))
    return m.UnionCascaded()


def precis(cami, simpl):
    """Un contorn precís de païs vesin (GeoJSON en graus) → Lambert-93,
    simplificat coma las comunas."""
    d = ogr.Open(cami)
    g = unir([f.GetGeometryRef().Clone() for f in d.GetLayer(0)])
    g.Transform(versL93)
    return g.SimplifyPreserveTopology(simpl)


def tèrra_e_aiga(simpl=SIMPL):
    """La referéncia tèrra / aiga de la carta, per zòna, en Lambert-93 :
    {'zona', 'zL', 'tèrra' : las comunas de França unidas e simplificadas,
     'aiga' : zòna − tèrra − païses vesins alargats (la mar, e las aigas que
     son dins cap de comuna), 'comunas' : [(còdi INSEE, geometria)]}.
    Servís a la còla mar (çai-jos) e al recalatge del bòrd de mar (costa-ref.py)."""
    gp = ogr.Open(os.path.join(RAIC, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
    cm = gp.GetLayerByName('commune')
    ne = ogr.Open(os.path.join(RAIC, 'SIG', 'brut', 'mond', 'countries-50m.json'))
    nel = ne.GetLayer(0)
    res = []
    for zona in ZONAS:
        zW = rect(*zona)
        zL = enL93(zW)
        # las comunas de la zòna (e un pauc a l'entorn)
        cm.SetSpatialFilter(zL.Buffer(5000))
        comunas = [(f.GetField('code_insee'), f.GetGeometryRef().Clone()) for f in cm]
        cm.SetSpatialFilter(None)
        tèrra = unir([g for _, g in comunas]).SimplifyPreserveTopology(simpl)
        # los païses estrangièrs (França levada : sas comunas la dison melhor)
        est = []
        nel.SetSpatialFilter(zW.Buffer(0.5))
        for f in nel:
            if f.GetField('name') == 'France':
                continue
            g = f.GetGeometryRef().Clone()
            g.Transform(versL93)
            if f.GetField('name') in PRECIS:
                p = precis(PRECIS[f.GetField('name')], simpl)
                est.append(p)
                g = g.Difference(p.Buffer(5 * ESTRANGIER))
            est.append(g.Buffer(ESTRANGIER))
        nel.SetSpatialFilter(None)
        print(zona, len(comunas), 'comunas,', len(est), 'païses vesins')
        res.append({'zona': zona, 'zL': zL, 'tèrra': tèrra, 'aiga': zL.Difference(unir([tèrra, *est])), 'comunas': comunas})
    return res


def principal():
    tròces = []
    dins = unir([enL93(rect(*d)) for d in DINS])
    for z in tèrra_e_aiga():
        zona = z['zona']
        # la mar de la còla : l'aiga, levadas las aigas dins las tèrras
        mar = z['aiga'].Difference(dins)
        mar.Transform(versWGS)
        # copat en cases, en graus (los bòrds de las cases tomban sus de multiples de 0,25)
        o, s, e, n = zona
        for i in range(round((e - o) / CASA)):
            for j in range(round((n - s) / CASA)):
                c = rect(o + i * CASA, s + j * CASA, o + (i + 1) * CASA, s + (j + 1) * CASA)
                t = mar.Intersection(c)
                if t is None or t.IsEmpty() or t.GetArea() < 1e-9:
                    continue
                tròces.append(t)

    # anèls en entièrs, en diferéncias
    def anèls(g, sortida):
        t = ogr.GT_Flatten(g.GetGeometryType())
        if t == ogr.wkbPolygon:
            p = []
            for k in range(g.GetGeometryCount()):
                r = g.GetGeometryRef(k)
                pts = [(round(r.GetX(m) * Q), round(r.GetY(m) * Q)) for m in range(r.GetPointCount())]
                # (ponches doblats après l'arredondit levats)
                net = [pts[0]]
                for q in pts[1:]:
                    if q != net[-1]:
                        net.append(q)
                if len(net) < 4:
                    continue
                d = [net[0][0], net[0][1]]
                for a, b in zip(net, net[1:]):
                    d += [b[0] - a[0], b[1] - a[1]]
                p.append(d)
            if p:
                sortida.append(p)
        elif t in (ogr.wkbMultiPolygon, ogr.wkbGeometryCollection):
            for k in range(g.GetGeometryCount()):
                anèls(g.GetGeometryRef(k), sortida)


    polis = []
    for t in tròces:
        anèls(t, polis)
    res = {
        'font': "IGN ADMIN EXPRESS COG CARTO 2026 (Licéncia dobèrta 2.0) ; Natural Earth (domeni public)",
        'q': Q,
        'casa': round(CASA * Q),
        'color': [10, 59, 89],
        'p': polis,
    }
    cami = os.path.join(SORTIDA, 'mar.json')
    with open(cami, 'w', encoding='utf-8') as fh:
        json.dump(res, fh, separators=(',', ':'), ensure_ascii=False)
    print(len(polis), 'tròces,', sum(len(r) // 2 for p in polis for r in p), 'ponches,', os.path.getsize(cami) // 1024, 'Ko ->', cami)


if __name__ == '__main__':
    principal()
