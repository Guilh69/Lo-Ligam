# Lo Creissent, traçat NÒSTRE (2026-10-07) : limitas nord e sud relevadas
# comuna per comuna dins Tourtoulon e Bringuier (1876, domeni public ; mitat
# oèst, contra-verificada) e Ronjat (1930, d'aprèp las nòtas de Tourtoulon ;
# mitat èst). Aproximatiu : poligòn liscat (2 km), de validar per Romain.
import os
import json
from osgeo import ogr, osr
import os as _os
RAIZ = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..'))  # racine du projet, où qu'il soit
ogr.UseExceptions()
# entradas de la cadena (fòra Git) : SIG/brut/cadena-entradas
ENTRADAS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'brut', 'cadena-entradas') + '/'
S = ENTRADAS + 'osm/'
D = RAIZ + '/app/static/data/creissent.geojson'
d = json.load(open(S + 'creissent-nostre.json', encoding='utf-8'))
wgs, l93 = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326); l93.ImportFromEPSG(2154)
for s in (wgs, l93): s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
r = ogr.Geometry(ogr.wkbLinearRing)
for x, y in d['anel']: r.AddPoint_2D(x, y)
p = ogr.Geometry(ogr.wkbPolygon); p.AddGeometry(r)
p.Transform(osr.CoordinateTransformation(wgs, l93))
p = p.MakeValid() if not p.IsValid() else p
# lissatge : fermadura puèi dobertura (3 km), que pas cap d'angle viu fague
# creire a una precision qu'avèm pas (retorn de Romain)
p = p.Buffer(3000, 16).Buffer(-4500, 16).Buffer(1500, 16).SimplifyPreserveTopology(250)
# los tròces de mai de 30 km² (lo Creissent se pinça a Availles-Limosina, ont
# las doas limitas se tòcan segon 1876 : la pointa de Charenta es un tròç a part)
if p.GetGeometryName() == 'MULTIPOLYGON':
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for i in range(p.GetGeometryCount()):
        if p.GetGeometryRef(i).GetArea() > 30e6: m.AddGeometry(p.GetGeometryRef(i).Clone())
    p = m if m.GetGeometryCount() > 1 else m.GetGeometryRef(0).Clone()
print('tròces', p.GetGeometryCount() if p.GetGeometryName() == 'MULTIPOLYGON' else 1)
gros = max((p.GetGeometryRef(i) for i in range(p.GetGeometryCount())), key=lambda g: g.GetArea()) if p.GetGeometryName() == 'MULTIPOLYGON' else p
eti = gros.Buffer(-6000).PointOnSurface() if gros.Buffer(-6000).GetArea() > 0 else gros.PointOnSurface()
print('km2', round(p.GetArea() / 1e6), p.IsValid())
back = osr.CoordinateTransformation(l93, wgs)
p.Transform(back); eti.Transform(back)
gj = json.loads(p.ExportToJson())
def arr(c): return [arr(x) for x in c] if isinstance(c[0], list) else [round(c[0], 3), round(c[1], 3)]
gj['coordinates'] = arr(gj['coordinates'])
json.dump({'type': 'FeatureCollection',
           'font': "Traçat de Lo Ligam d'aprèp Tourtoulon e Bringuier, Étude sur la limite géographique de la langue d'oc et de la langue d'oïl (1876, domeni public) e Ronjat (1930) ; aproximatiu",
           'features': [{'type': 'Feature', 'properties': {'kod': 'cro', 'oc': 'lo Creissent', 'fr': 'le Croissant', 'eti': [round(eti.GetX(), 3), round(eti.GetY(), 3)]}, 'geometry': gj}]},
          open(D, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('ok', round(eti.GetX(), 2), round(eti.GetY(), 2))
