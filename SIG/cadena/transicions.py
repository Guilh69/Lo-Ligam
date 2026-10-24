# Bendas de transicion entre dialèctes (recèrca del 2026-10-07) : l'axe de
# cada benda espessit de sa mitat de largor ; la carta i pinta un fondut pus
# larg (nuancièr). Sonque las bendas entre dos dialèctes occitans.
import json
from osgeo import ogr, osr
import os as _os
RAIZ = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..'))  # racine du projet, où qu'il soit
ogr.UseExceptions()
B = json.load(open(RAIZ + '/SIG/Dialecte/transicions-dialectes.json', encoding='utf-8'))['bandes']
D = {'gas', 'lan', 'pro', 'lem', 'auv', 'viv'}
wgs, m = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326); m.ImportFromEPSG(2154)
for s in (wgs, m): s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versM, versW = osr.CoordinateTransformation(wgs, m), osr.CoordinateTransformation(m, wgs)
feats = []
for b in B:
    p = b['paire'].split('/')
    if len(p) != 2 or not set(p) <= D or len(b.get('axe') or []) < 2: continue
    l = ogr.Geometry(ogr.wkbLineString)
    for x, y in b['axe']: l.AddPoint_2D(x, y)
    l.Transform(versM)
    larg = max(4.0, float(b['largeur_km']))
    g = l.Buffer(larg * 500, 8).SimplifyPreserveTopology(500)
    g.Transform(versW)
    gj = json.loads(g.ExportToJson())
    def arr(c): return [arr(x) for x in c] if isinstance(c[0], list) else [round(c[0], 3), round(c[1], 3)]
    gj['coordinates'] = arr(gj['coordinates'])
    feats.append({'type': 'Feature', 'properties': {'id': b['id'], 'paire': b['paire'], 'larg': larg, 'confiance': b.get('confiance')}, 'geometry': gj})
    print(b['id'], b['paire'], larg)
json.dump({'type': 'FeatureCollection', 'font': 'Recèrca suls transicions entre dialèctes (SIG/Dialecte/transicions-dialectes.md)', 'features': feats},
          open(RAIZ + '/app/static/data/transicions.geojson', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(feats), 'bendas')
