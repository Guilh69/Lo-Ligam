# Lo trait de còsta de la carta en estelas de /carta, tornat traçar sus la
# meteissa referéncia que las tenchas (retorn de Romain, 2026-10-09 : de
# luènh, lo contorn del domeni, calat sus las comunas, e lo trait de còsta
# Natural Earth (~1 km) se dobdavan). La carta de l'acuèlh garda COSTA
# (carta-estelas.js) : a son escala, la diferéncia se vei pas, e lo fichièr
# novèl la fariá pesar mai.
#
#   tèrra = despartaments de l'IGN (ADMIN EXPRESS COG CARTO : la còsta de las
#           comunas) ∪ païses vesins (Catalonha : limit OSM precisa ; endacòm
#           mai Natural Earth, en esperant la còsta OSM de costa-osm.mjs)
#   còsta = bòrd de la mar dobèrta (emprèsa − tèrra, sonque çò que tòca lo bòrd
#           de l'emprèsa), levats los bòrds de l'emprèsa e las illas de mens
#           de MIN
# simplificada a SIMPL (la carta en estelas cedís al satellit vèrs 20 km, ont
# un ponch fa ~110 m). Sortida : app/static/data/costa.json, en entièrs
# (1e-3 grau) e en diferéncias.
#
# Usatge : "C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat" SIG/cadena/costa-estelas.py [dorsièr de sortida]
import json
import os
import sys

from osgeo import ogr

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mar import RAIC, enL93, rect, unir, versL93, versWGS, vesin  # noqa: E402

ogr.UseExceptions()
EMPRESA = (-3.2, 41.3, 10.0, 47.2)  # o, s, e, n : la de l'ancian trait (meteissa dins mond.mjs, EMPRESA_COSTA)
SIMPL = 100  # m
MIN = 2e6  # m² : illas de mens de 2 km², invisiblas de luènh
Q = 1000
SORTIDA = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIC, 'app', 'static', 'data')


def principal():
    zW = rect(*EMPRESA)
    zL = enL93(zW)
    gp = ogr.Open(os.path.join(RAIC, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
    dl = gp.GetLayerByName('departement')
    dl.SetSpatialFilter(zL)
    tèrra = [f.GetGeometryRef().Clone() for f in dl]
    nds = ogr.Open(os.path.join(RAIC, 'SIG', 'brut', 'mond', 'countries-50m.json'))
    ne = nds.GetLayer(0)
    ne.SetSpatialFilter(zW)
    for f in ne:
        nom = f.GetField('name')
        if nom == 'France':
            continue
        g = f.GetGeometryRef().Clone()
        g.Transform(versL93)
        tèrra += vesin(nom, g, SIMPL, 0)
    mar = zL.Difference(unir(tèrra))
    # sonque la mar dobèrta, que tòca lo bòrd de l'emprèsa (pas los interstices
    # entre la França de l'IGN e los vesins de Natural Earth, long de las
    # frontièras) ; las illas de mens de MIN levadas (traucs dins la mar)
    bòrd = zL.Boundary()
    multi = ogr.GT_Flatten(mar.GetGeometryType()) == ogr.wkbMultiPolygon
    net = ogr.Geometry(ogr.wkbMultiPolygon)
    for k in range(mar.GetGeometryCount() if multi else 1):
        p = mar.GetGeometryRef(k) if multi else mar
        if not p.Intersects(bòrd):
            continue
        q = ogr.Geometry(ogr.wkbPolygon)
        for a in range(p.GetGeometryCount()):
            r = p.GetGeometryRef(a)
            if a == 0 or ogr.ForceToPolygon(r.Clone()).GetArea() >= MIN:
                q.AddGeometry(r.Clone())
        net.AddGeometry(q)
    còsta = net.Boundary().Difference(bòrd.Buffer(50)).SimplifyPreserveTopology(SIMPL)
    còsta.Transform(versWGS)
    linhas = []
    for k in range(còsta.GetGeometryCount() or 1):
        l = còsta.GetGeometryRef(k) if còsta.GetGeometryCount() else còsta
        pts = []
        for m in range(l.GetPointCount()):
            q = (round(l.GetX(m) * Q), round(l.GetY(m) * Q))
            if not pts or q != pts[-1]:
                pts.append(q)
        if len(pts) >= 2:
            d = [pts[0][0], pts[0][1]]
            for a, b in zip(pts, pts[1:]):
                d += [b[0] - a[0], b[1] - a[1]]
            linhas.append(d)
    linhas.sort(key=len, reverse=True)
    cami = os.path.join(SORTIDA, 'costa.json')
    with open(cami, 'w', encoding='utf-8') as fh:
        json.dump({'font': 'IGN ADMIN EXPRESS COG CARTO 2026 (Licéncia dobèrta 2.0) ; OpenStreetMap (ODbL) ; Natural Earth', 'q': Q, 'l': linhas},
                  fh, separators=(',', ':'), ensure_ascii=False)
    print(len(linhas), 'linhas,', sum(len(l) // 2 for l in linhas), 'ponches,', os.path.getsize(cami) // 1024, 'Ko ->', cami)


if __name__ == '__main__':
    principal()
