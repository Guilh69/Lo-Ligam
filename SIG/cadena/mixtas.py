# Zònas mixtas (causida de Romain, 2026-10-07) : mostradas en asclas, dins lo
# domeni o a son bòrd, amb una nòta al survòl. Ròia e Briga (ligur de traches
# occitans), Monegue (ligur, niçard tanben), comunas italianas declaradas
# occitanas per la lei 482 mas de parlar piemontés. Noms occitans de validar.
import os
import json
from osgeo import ogr, osr
import os as _os
RAIZ = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..'))  # racine du projet, où qu'il soit
ogr.UseExceptions()
# entradas de la cadena (fòra Git) : SIG/brut/cadena-entradas
ENTRADAS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'brut', 'cadena-entradas') + '/'
S = ENTRADAS + 'osm/'
R = json.load(open(RAIZ + '/SIG/Dialecte/transicions-dialectes.json', encoding='utf-8'))['corrections']
wgs, m = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326); m.ImportFromEPSG(3035)
for s in (wgs, m): s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versM, versW = osr.CoordinateTransformation(wgs, m), osr.CoordinateTransformation(m, wgs)

def poli(pts):
    if pts[0] != pts[-1]: pts = pts + [pts[0]]
    g = ogr.CreateGeometryFromWkt('POLYGON((' + ','.join('%f %f' % (x, y) for x, y in pts) + '))').Buffer(0)
    g.Transform(versM)
    return g

# Ròia : contorn de la recèrca, arredondit (es una zòna d'escala de valada)
roia = poli([c for c in R if c['id'] == 'roya'][0]['polygone']).Buffer(1500, 16).Buffer(-1500, 16)
# Monegue : contorn fach a la man (pus fin que lo de la recèrca, que desbòrda sus Bèlsolelh)
monegue = poli([[7.4085, 43.7245], [7.4170, 43.7240], [7.4305, 43.7395], [7.4395, 43.7485], [7.4400, 43.7525], [7.4315, 43.7500], [7.4175, 43.7335]])
# Comunas declaradas : contorns OSM de las comunas
def anels_de(rel):
    trocs = [[(p['lon'], p['lat']) for p in mm['geometry']] for mm in rel['members'] if mm['type'] == 'way' and mm.get('role', 'outer') in ('outer', '') and 'geometry' in mm]
    anels = []
    while trocs:
        a = trocs.pop(0); cambiat = True
        while a[0] != a[-1] and cambiat:
            cambiat = False
            for i, t in enumerate(trocs):
                if t[0] == a[-1]: a += t[1:]
                elif t[-1] == a[-1]: a += t[::-1][1:]
                elif t[-1] == a[0]: a = t[:-1] + a
                elif t[0] == a[0]: a = t[::-1][:-1] + a
                else: continue
                trocs.pop(i); cambiat = True; break
        if len(a) >= 4 and a[0] == a[-1]: anels.append(a)
    return anels
comunas = {e['tags']['name']: e for e in json.load(open(S + 'comunas-it.json', encoding='utf-8'))['elements']}
declaradas = None
for n in ['Luserna San Giovanni', 'Bricherasio', 'Paesana', 'Sanfront', 'Dronero', 'Caraglio', 'Borgo San Dalmazzo']:
    mp = ogr.Geometry(ogr.wkbMultiPolygon)
    for a in anels_de(comunas[n]):
        r = ogr.Geometry(ogr.wkbLinearRing)
        for x, y in a: r.AddPoint_2D(x, y)
        p = ogr.Geometry(ogr.wkbPolygon); p.AddGeometry(r); mp.AddGeometry(p)
    g = mp.Buffer(0); g.Transform(versM)
    declaradas = g if declaradas is None else declaradas.Union(g)
declaradas = declaradas.Buffer(50).Buffer(-50)

# Gascon escantit (domeni istoric) : nòrd de la Dordonha, Borgés, Cubzagués,
# Fronsadés, Liburnés fins a Lussac (recèrca : gascon recuolat fàcia al
# saintongés dempuèi lo sègle XVI) ; contorn aproximatiu, arredondit
istoric = poli([[-0.66, 45.10], [-0.55, 45.09], [-0.45, 45.065], [-0.30, 45.05], [-0.15, 45.04], [-0.03, 45.01], [0.0, 44.96], [-0.08, 44.92], [-0.20, 44.915], [-0.27, 44.93], [-0.37, 44.955], [-0.48, 44.985], [-0.56, 45.01], [-0.63, 45.05]]).Buffer(1500, 16).Buffer(-1500, 16)
# Pichona Gavachariá : enclava de lenga d'oïl (saintongés) a l'entorn de
# Montségur, poblada al sègle XV-XVI per de colons de Saintonja, Peitau e
# Engolmés (recèrca : Bourciez 1895, Nowak) ; fòra del domeni, explicada al survòl
gav = [c for c in R if c['id'] == 'petite-gavacherie'][0]['polygone']
gavacharia = poli(gav)
feats = []
for kod, g, oc, fr, sota_oc, sota_fr in [
    # (2026-10-08, retorn de Romain : l'illòt a desaparegut al sègle XX ; zòna
    # particulara dins lo gascon, pas pus enclava ; puèi : node SIG/cadena/gavacharia.mjs)
    ('mix-gavacharia', gavacharia, 'La Pichona Gavachariá', 'La Petite Gavacherie', "ancian illòt de lenga d'oïl (saintongés), del sègle XV al sègle XX", "ancien îlot de langue d'oïl (saintongeais), du XVe au XXe siècle"),
    ('ist-gascon', istoric, 'Gascon', 'Gascon', 'domeni istoric, parlar escantit', 'domaine historique, parler éteint'),
    ('mix-roia', roia, 'Ròia e Briga', 'Roya et Brigue', 'parlar ligur de traches occitans', 'parler ligure à traits occitans'),
    ('mix-monegue', monegue, 'Monegue', 'Monaco', 'ligur (monegasc), niçard tanben', 'ligure (monégasque), niçois aussi'),
    ('mix-lei482', declaradas, 'Comunas declaradas occitanas', 'Communes déclarées occitanes', 'per la lei italiana, de parlar piemontés', 'par la loi italienne, de parler piémontais'),
]:
    g = g.SimplifyPreserveTopology(120)
    eti = g.PointOnSurface()
    g.Transform(versW); eti.Transform(versW)
    gj = json.loads(g.ExportToJson())
    def arr(c): return [arr(x) for x in c] if isinstance(c[0], list) else [round(c[0], 4), round(c[1], 4)]
    gj['coordinates'] = arr(gj['coordinates'])
    feats.append({'type': 'Feature', 'properties': {'kod': kod, 'mena': 'istoric' if kod.startswith('ist-') else 'enclava' if kod.startswith('enc-') else 'mixta', 'oc': oc, 'fr': fr, 'sota_oc': sota_oc, 'sota_fr': sota_fr, 'eti': [round(eti.GetX(), 3), round(eti.GetY(), 3)]}, 'geometry': gj})
    print(kod, gj['type'])
json.dump({'type': 'FeatureCollection', 'font': "Recèrca suls transicions (SIG/Dialecte/transicions-dialectes.md) ; comunas : OpenStreetMap (ODbL)", 'features': feats},
          open(RAIZ + '/app/static/data/zonas-mixtas.geojson', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
