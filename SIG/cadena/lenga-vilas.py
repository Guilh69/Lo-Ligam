# Las vilas d'una lenga vesina per la carta (2026-10-10), sul modèl de
# oil-vilas.py : nom dins la lenga del luòc, ponch, renc, zòna.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/lenga-vilas.py <lenga>
#
# França : cap-luòc e populacion de las comunas IGN (ADE-COG-CARTO_2026.gpkg).
# Autres país : los ponches place=city|town d'OpenStreetMap amb lor populacion
# (una requèsta Overpass sus l'emprèsa del domeni ; ODbL).
# Nom local, dins aqueste òrdre : SIG/<lenga>/noms-locals.csv (o noms-br.csv...)
# per còdi de comuna (França), puèi las etiquetas OSM de CONF['osm_noms']
# (ex. name:br), si que non lo nom oficial (« local »: false).
# Renc : 1 = mai de 100 000 abitants ; 2 = mai de 20 000 ; 3 = mai de 7 000 ;
# 4 = los autres (mai de 2 000). Espaçament : 30 km (renc 1), 22, 25, 28 km :
# pas de mantèl de banlègas (retorn de Romain : pas de bruch textual).
# Sortida : « vilas » dins app/static/data/<lenga>.json e SIG/<lenga>/vilas-<lenga>.json.
import csv, glob, json, math, os, sys, time, urllib.parse, urllib.request
from osgeo import ogr, osr

ogr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
L = sys.argv[1]
CONF = json.load(open(os.path.join(R, 'SIG', L, 'carta.json'), encoding='utf-8'))
FIC = os.path.join(R, 'app', 'static', 'data', CONF.get('sortida', L + '.json'))
MAX = CONF.get('vilas_max', 200)
ESPAÇ = {1: 30000, 2: 22000, 3: 25000, 4: 28000}
OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
            'https://overpass.private.coffee/api/interpreter']
UA = {'User-Agent': 'LoLigam-carta/1.0 (preparacion de donadas)'}

d = json.load(open(FIC, encoding='utf-8'))
zonas = []
for f in d['features']:
    p = f['properties']
    if p.get('apart') or p.get('transicio'):
        continue
    g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
    zonas.append((p['kod'], g, g.GetEnvelope()))
X0 = min(z[2][0] for z in zonas); X1 = max(z[2][1] for z in zonas)
Y0 = min(z[2][2] for z in zonas); Y1 = max(z[2][3] for z in zonas)


def zona_de(lon, lat):
    p = ogr.Geometry(ogr.wkbPoint)
    p.AddPoint_2D(lon, lat)
    return next((k for k, g, (x0, x1, y0, y1) in zonas if x0 <= lon <= x1 and y0 <= lat <= y1 and g.Contains(p)), None)


# noms locals per còdi
locals_ = {}
for fic in glob.glob(os.path.join(R, 'SIG', L, 'noms-*.csv')):
    for r in csv.DictReader(open(fic, encoding='utf-8-sig'), delimiter=';'):
        c = r.get('codi') or r.get('insee')
        n = r.get('nom_local') or next((r[k] for k in r if k and k.startswith('nom_') and k != 'nom_oficial' and r[k]), None)
        if c and n:
            locals_.setdefault(c, (n.strip(), os.path.basename(fic)))

wgs, l93 = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326)
l93.ImportFromEPSG(2154)
for s in (wgs, l93):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versW = osr.CoordinateTransformation(l93, wgs)
vers93 = osr.CoordinateTransformation(wgs, l93)
cands = []
deps = CONF.get('deps', [])
if deps:
    gp = ogr.Open(os.path.join(R, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
    cl = {}
    for f in gp.GetLayerByName('chef_lieu_de_commune'):
        g = f.GetGeometryRef()
        cl[f.GetField('code_insee_de_la_commune')] = (g.GetX(), g.GetY())
    cm = gp.GetLayerByName('commune')
    cm.SetAttributeFilter('population >= 2000 AND code_insee_du_departement IN (%s)' % ','.join("'%s'" % x for x in deps))
    for f in cm:
        c = f.GetField('code_insee')
        if c not in cl:
            continue
        p = ogr.Geometry(ogr.wkbPoint)
        p.AddPoint_2D(*cl[c])
        p.Transform(versW)
        kod = zona_de(p.GetX(), p.GetY())
        if not kod:
            continue
        nl = locals_.get(c)
        cands.append({'codi': c, 'nom_oficial': f.GetField('nom_officiel'), 'nom': nl[0] if nl else f.GetField('nom_officiel'),
                      'local': bool(nl), 'font': nl[1] if nl else 'nom oficial (IGN)', 'lon': round(p.GetX(), 4), 'lat': round(p.GetY(), 4),
                      'pop': f.GetField('population') or 0, 'zona': kod, 'estat': 'FR'})
if CONF.get('osm_vilas', True) and CONF.get('paises', ['France']) != ['France']:
    q = '[out:json][timeout:180];node["place"~"^(city|town)$"]["population"](%f,%f,%f,%f);out tags qt;' % (Y0, X0, Y1, X1)
    r = None
    for u in OVERPASS:
        try:
            req = urllib.request.Request(u, data=urllib.parse.urlencode({'data': q}).encode(), headers=UA)
            r = json.load(urllib.request.urlopen(req, timeout=240))
            break
        except Exception as e:
            print('Overpass %s : %s' % (u, e))
            time.sleep(5)
    for e in (r or {}).get('elements', []):
        t = e.get('tags', {})
        kod = zona_de(e['lon'], e['lat'])
        if not kod:
            continue
        cc = (t.get('is_in:country_code') or t.get('ISO3166-1') or '').upper()
        if cc == 'FR':
            continue
        try:
            pop = int(str(t.get('population', '0')).replace(' ', '').replace('.', '').replace(',', '').split(';')[0])
        except ValueError:
            continue
        if pop < 2000:
            continue
        nl = next((t[k] for k in CONF.get('osm_noms', []) if t.get(k)), None)
        cands.append({'codi': 'osm:%d' % e['id'], 'nom_oficial': t.get('name', ''), 'nom': nl or t.get('name', ''), 'local': bool(nl) and nl != t.get('name'),
                      'font': 'OSM ' + next((k for k in CONF.get('osm_noms', []) if t.get(k)), 'name'), 'lon': round(e['lon'], 4), 'lat': round(e['lat'], 4),
                      'pop': pop, 'zona': kod, 'estat': cc or '?'})

for v in cands:
    v['renc'] = 1 if v['pop'] >= 100000 else 2 if v['pop'] >= 20000 else 3 if v['pop'] >= 7000 else 4
    p = ogr.Geometry(ogr.wkbPoint)
    p.AddPoint_2D(v['lon'], v['lat'])
    p.Transform(vers93)
    v['x'], v['y'] = p.GetX(), p.GetY()
# (las vilas de França venon de l'IGN : un ponch OSM a mens de 2 km d'un cap-luòc
# de comuna francesa es levat)
if deps:
    gr = {}
    for x, y in cl.values():
        gr.setdefault((int(x // 2000), int(y // 2000)), []).append((x, y))

    def pròche_fr(v):
        i, j = int(v['x'] // 2000), int(v['y'] // 2000)
        return any(math.hypot(v['x'] - x, v['y'] - y) < 2000 for a in (-1, 0, 1) for b in (-1, 0, 1) for x, y in gr.get((i + a, j + b), ()))
    cands = [v for v in cands if v['estat'] == 'FR' or not pròche_fr(v)]
cands.sort(key=lambda v: -v['pop'])
gard = []
for v in cands:
    if len(gard) >= MAX:
        break
    if any(math.hypot(v['x'] - g['x'], v['y'] - g['y']) < ESPAÇ[v['renc']] for g in gard):
        continue
    gard.append(v)
for v in gard:
    del v['x'], v['y']
d['vilas'] = [[v['lon'], v['lat'], v['nom'], v['renc'], v['zona']] for v in gard]
json.dump(d, open(FIC, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
json.dump(gard, open(os.path.join(R, 'SIG', L, 'vilas-%s.json' % L), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('Vilas : %d (renc 1 : %d, 2 : %d, 3 : %d, 4 : %d), %d amb un nom local' % (
    len(gard), *[sum(v['renc'] == r for v in gard) for r in (1, 2, 3, 4)], sum(v['local'] for v in gard)))
print('Renc 1 e 2 :', ', '.join('%s (%s)' % (v['nom'], v['nom_oficial']) if v['nom'] != v['nom_oficial'] else v['nom'] for v in gard if v['renc'] <= 2))
