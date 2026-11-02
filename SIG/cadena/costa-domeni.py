# Le bord côtier du domaine (carte stylisée) ne suit pas la vraie côte : par
# endroits il reste dans les terres (villes côtières dehors), ailleurs il
# déborde en mer. On découpe une enveloppe du domaine (8 km) par le vrai trait
# de côte (Natural Earth) : les morceaux côté terre forment la « terre ». Puis
#   domaine final = (domaine + bande côtière de 6 km côté terre) ∩ terre,
# la bande étant retirée à moins de 7 km des frontières terrestres de la
# langue (sinon elle passait la frontière le long de la mer : Salses,
# Menton, côte basque).
import os
import json
from osgeo import ogr, osr
import os as _os
RAIZ = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..'))  # racine du projet, où qu'il soit
ogr.UseExceptions()
# entradas de la cadena (fòra Git) : SIG/brut/cadena-entradas
ENTRADAS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'brut', 'cadena-entradas') + '/'
base = ENTRADAS
wgs, l93 = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326); l93.ImportFromEPSG(2154)
for s in (wgs, l93): s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versL93, versWGS = osr.CoordinateTransformation(wgs, l93), osr.CoordinateTransformation(l93, wgs)

dom = ogr.CreateGeometryFromJson(json.dumps(json.load(open(base + 'limits/domeni-occitanica.geojson'))['features'][0]['geometry']))
dom.Transform(versL93)
dom = dom.Buffer(0)
costa = ogr.Geometry(ogr.wkbMultiLineString)
for f in json.load(open(base + 'ne/costa.geojson'))['features']:
    g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
    for i in range(max(1, g.GetGeometryCount())):
        sub = g.GetGeometryRef(i) if g.GetGeometryCount() else g
        costa.AddGeometry(sub.Clone())
costa.Transform(versL93)

# terre : enveloppe du domaine coupée par la côte, morceaux surtout couverts par le domaine
env = dom.Buffer(8000)
linhas = ogr.Geometry(ogr.wkbMultiLineString)
bord = env.GetBoundary()
for i in range(max(1, bord.GetGeometryCount())):
    linhas.AddGeometry((bord.GetGeometryRef(i) if bord.GetGeometryCount() else bord).Clone())
cc = costa.Intersection(env.Buffer(2000))
for i in range(max(1, cc.GetGeometryCount())):
    sub = cc.GetGeometryRef(i) if cc.GetGeometryCount() else cc
    if sub.GetGeometryName() == 'LINESTRING': linhas.AddGeometry(sub.Clone())
morceaux = linhas.UnaryUnion().Polygonize()
terra = ogr.Geometry(ogr.wkbMultiPolygon)
nT = nM = 0
for i in range(morceaux.GetGeometryCount()):
    p = morceaux.GetGeometryRef(i)
    if not p.Within(env.Buffer(10)) and p.Intersection(env).GetArea() < 0.5 * p.GetArea(): continue
    if p.Intersection(dom).GetArea() > 0.45 * p.GetArea(): terra.AddGeometry(p.Clone()); nT += 1
    else: nM += 1
terra = terra.UnaryUnion()
print('morceaux terre', nT, 'mer', nM, '; terre km2', round(terra.GetArea() / 1e6), 'domaine km2', round(dom.GetArea() / 1e6))

# frontières terrestres de la langue (déjà calculées dans limits-carta.json)
lim = json.load(open(RAIZ + '/app/static/data/limits-carta.json', encoding='utf-8'))['domeni']['linhas']
fr = ogr.Geometry(ogr.wkbMultiLineString)
for l in lim:
    ls = ogr.Geometry(ogr.wkbLineString)
    for lon, lat in l: ls.AddPoint_2D(lon, lat)
    fr.AddGeometry(ls)
fr.Transform(versL93)

# La terre est découpée par les frontières de la langue (prolongées de 2 km à
# chaque bout pour bien couper la côte) : le domaine est le morceau surtout
# couvert par la carte Occitanica, élargi de 1,5 km vers la mer seulement
# (la côte Natural Earth est généralisée : villes de lido, ports)
def prolongar(ls, d=2000):
    n = ls.GetPointCount()
    out = ogr.Geometry(ogr.wkbLineString)
    def bout(i, j):
        x0, y0 = ls.GetX(i), ls.GetY(i); x1, y1 = ls.GetX(j), ls.GetY(j)
        L = ((x0 - x1) ** 2 + (y0 - y1) ** 2) ** 0.5 or 1
        return x0 + (x0 - x1) / L * d, y0 + (y0 - y1) / L * d
    out.AddPoint_2D(*bout(0, 1))
    for k in range(n): out.AddPoint_2D(ls.GetX(k), ls.GetY(k))
    out.AddPoint_2D(*bout(n - 1, n - 2))
    return out
coupe = ogr.Geometry(ogr.wkbMultiLineString)
tb = terra.GetBoundary()
for i in range(max(1, tb.GetGeometryCount())):
    coupe.AddGeometry((tb.GetGeometryRef(i) if tb.GetGeometryCount() else tb).Clone())
for i in range(fr.GetGeometryCount()):
    coupe.AddGeometry(prolongar(fr.GetGeometryRef(i)))
pieces = coupe.UnaryUnion().Polygonize()
coeur = dom.Buffer(-3000)
occ = ogr.Geometry(ogr.wkbMultiPolygon); autres = ogr.Geometry(ogr.wkbMultiPolygon)
for i in range(pieces.GetGeometryCount()):
    p = pieces.GetGeometryRef(i)
    if not p.Intersection(terra).GetArea() > 0.5 * p.GetArea(): continue
    # occitan : le morceau recouvre largement le cœur du domaine (domaine rogné de
    # 3 km : les bandes étroites de l'autre côté de la frontière ne comptent pas)
    (occ if p.Intersection(coeur).GetArea() > 0.3 * p.GetArea() else autres).AddGeometry(p.Clone())
occ = occ.UnaryUnion(); autres = autres.UnaryUnion()
print('domaine découpé km2', round(occ.GetArea() / 1e6), '; autres terres km2', round(autres.GetArea() / 1e6))
fin = occ.Buffer(1500).Difference(autres).Buffer(0).SimplifyPreserveTopology(300)
# Monegue (enclava de parlar ligur sus la còsta) : la marga de 1,5 km l'aviá
# tornat metre dins lo domeni
monegue = ogr.CreateGeometryFromWkt('POLYGON((7.4085 43.7245,7.4170 43.7240,7.4305 43.7395,7.4395 43.7485,7.4400 43.7525,7.4315 43.7500,7.4175 43.7335,7.4085 43.7245))')
monegue.Transform(versL93)
fin = fin.Difference(monegue).Buffer(0)
fin.Transform(versWGS)
print('ok', fin.GetGeometryName(), fin.GetGeometryCount())
json.dump({'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'properties': {}, 'geometry': json.loads(fin.ExportToJson())}]}, open(base + 'limits/domeni-occitanica-costa.geojson', 'w'))
