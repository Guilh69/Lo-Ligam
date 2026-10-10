# Las vilas de las lengas d'oïl per la carta (Romain, 2026-10-10 : « trouve
# les noms des villes dans leur langue locale »), sul modèl del basc.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/oil-vilas.py
#
# Entradas : app/static/data/oil.json (oil.py), SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg
# (populacion e cap-luòc de las comunas, IGN), e los noms dins la lenga del
# luòc : títols dels articles de las Viquipèdias picarda (pcd), normanda (nrm)
# e valona (wa) per las comunas de França, via Wikidata (SIG/brut/oil/wd-*.csv,
# CC0 ; vejatz SIG/oil/FONTS.md). Un nom es pres sonque dins la lenga de la
# zòna de la comuna (la Viquipèdia valona a tanben « Rouwan » per Rouen).
# Lo galò : los repertòris de Chubri (gallo-noms.py). Las autras lengas, e las
# vilas que mancan : l'introduccion de l'article de la Viquipèdia en francés
# (« Resnn en gallo ») ; si que non, nom oficial, marcat « local: false ».
#
# Renc : 1 = mai de 100 000 abitants ; 2 = mai de 20 000 ; 3 = mai de 7 000 ;
# 4 = los autres. Una vila es gardada se cap de vila pus granda es pas a mens
# de 15 km (renc 1), 22 km (renc 2), 25 km (renc 3) o 28 km (renc 4) : pas de mantèl de
# banlègas a l'entorn de París (retorn de Romain : pas de bruch textual) ; 250 vilas al pus.
#
# Sortida : « vilas » dins oil.json ([lon, lat, nom, renc, zòna]) e
# SIG/oil/vilas-oil.json (detalh, per la verificacion).
import csv, json, math, os, re, urllib.parse, urllib.request
from osgeo import ogr, osr

ogr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
FIC = os.path.join(R, 'app', 'static', 'data', 'oil.json')
MAX = 250
ESPAÇ = {1: 15000, 2: 22000, 3: 25000, 4: 28000}
WIKI = {'chti': 'pcd', 'rouchi': 'pcd', 'picard': 'pcd', 'normand': 'nrm', 'wallon': 'wa'}

d = json.load(open(FIC, encoding='utf-8'))
zonas = [(f['properties']['kod'], ogr.CreateGeometryFromJson(json.dumps(f['geometry'])))
         for f in d['features'] if not f['properties'].get('apart')]
zonas = [(k, g, g.GetEnvelope()) for k, g in zonas]

noms = {}
for l in ('pcd', 'nrm', 'wa'):
    for r in csv.DictReader(open(os.path.join(R, 'SIG', 'brut', 'oil', 'wd-%s.csv' % l), encoding='utf-8')):
        noms[(l, r['insee'])] = re.sub(r'\s*\(.*\)$', '', r['nom']).strip()

# lo galò : repertòris de Chubri (gallo-noms.py), per nom oficial e departament
GALO = {(r['fr'], r['dep']): r['gallo'] for r in csv.DictReader(open(os.path.join(R, 'SIG', 'brut', 'oil', 'noms-gallo.csv'), encoding='utf-8'), delimiter=';')}

LENGAS_ZONA = {'poitevin_saintongeais': ('poitevin-saintongeais', 'saintongeais', 'poitevin'), 'franc_comtois': ('franc-comtois',),
               'gallo': ('gallo',), 'bourguignon': ('morvandiau', 'bourguignon'), 'lorrain': ('lorrain',), 'champenois': ('champenois',),
               'centre': ('berrichon', 'orléanais', 'bourbonnais'), 'oest': ('mayennais', 'angevin', 'manceau', 'tourangeau')}
LOC_OIL = {}
F_LOC = os.path.join(R, 'SIG', 'oil', 'noms-oil-locals.csv')
if os.path.exists(F_LOC):
    for r in csv.DictReader(open(F_LOC, encoding='utf-8-sig'), delimiter=';'):
        if r.get('nom_local') and 'DOUTEUX' not in (r.get('nota') or ''):
            LOC_OIL[r['insee']] = (r['nom_local'].strip(), r['lenga_de_la_font'].strip(), r.get('font', ''))

wgs, l93 = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326)
l93.ImportFromEPSG(2154)
for s in (wgs, l93):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versW = osr.CoordinateTransformation(l93, wgs)
gp = ogr.Open(os.path.join(R, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
cl = {}
for f in gp.GetLayerByName('chef_lieu_de_commune'):
    g = f.GetGeometryRef().Clone()
    cl[f.GetField('code_insee_de_la_commune')] = (g.GetX(), g.GetY())
cands = []
cm = gp.GetLayerByName('commune')
cm.SetAttributeFilter("population >= 2000 AND code_insee_du_departement NOT IN ('2A', '2B')")
for f in cm:
    c = f.GetField('code_insee')
    if c not in cl:
        continue
    x, y = cl[c]
    p = ogr.Geometry(ogr.wkbPoint)
    p.AddPoint_2D(x, y)
    p.Transform(versW)
    lon, lat = p.GetX(), p.GetY()
    kod = next((k for k, g, (x0, x1, y0, y1) in zonas if x0 <= lon <= x1 and y0 <= lat <= y1 and g.Contains(p)), None)
    if not kod:
        continue
    pop = f.GetField('population') or 0
    w = WIKI.get(kod)
    nl = noms.get((w, c)) if w else None
    font = ('Viquipèdia ' + w) if nl else 'nom oficial (IGN)'
    if kod == 'gallo' and (f.GetField('nom_officiel'), c[:2]) in GALO:
        nl, font = GALO[(f.GetField('nom_officiel'), c[:2])], 'Chubri'
    # (los noms trobats per la recèrca, SIG/oil/noms-oil-locals.csv : sonque dins
    # la lenga de la zòna de la vila, e pas los noms marcats « DOUTEUX »)
    if not nl and c in LOC_OIL and LOC_OIL[c][1] in LENGAS_ZONA.get(kod, ()):
        nl, font = LOC_OIL[c][0], 'recèrca : ' + LOC_OIL[c][2][:80]
    cands.append({'insee': c, 'nom_oficial': f.GetField('nom_officiel'), 'nom': nl or f.GetField('nom_officiel'),
                  'local': bool(nl), 'font': font,
                  'lon': round(lon, 4), 'lat': round(lat, 4), 'x': x, 'y': y, 'pop': pop, 'zona': kod,
                  'renc': 1 if pop >= 100000 else 2 if pop >= 20000 else 3 if pop >= 7000 else 4})

cands.sort(key=lambda v: -v['pop'])
gard = []
for v in cands:
    if len(gard) >= MAX:
        break
    e = ESPAÇ.get(v['renc'])
    if e and any(math.hypot(v['x'] - g['x'], v['y'] - g['y']) < e for g in gard):
        continue
    gard.append(v)
for v in gard:
    del v['x'], v['y']

# Las autras lengas : lo nom dins la lenga del luòc tal coma lo dona l'introduccion
# de l'article de la Viquipèdia en francés (« Rennes ... Resnn en gallo »),
# sonque per las vilas gardadas ; de verificar (SIG/oil/vilas-oil.json, « font »)
LENGA_FR = {'gallo': 'gallo', 'poitevin_saintongeais': 'poitevin(?:-saintongeais)?|saintongeais',
            'champenois': 'champenois', 'lorrain': 'lorrain(?: roman)?', 'bourguignon': 'bourguignon|morvandiau',
            'franc_comtois': 'franc-comtois|comtois', 'oest': 'mayennais|angevin|manceau|sarthois|tourangeau',
            'normand': 'normand|cauchois|cotentinais', 'chti': "picard|ch'ti|rouchi", 'rouchi': 'rouchi|picard',
            'picard': 'picard', 'wallon': 'wallon'}
UA = {'User-Agent': 'LoLigam-carta/1.0 (preparacion de donadas)'}


def json_url(url, data=None):
    q = urllib.request.Request(url, data=data, headers=UA)
    return json.load(urllib.request.urlopen(q, timeout=120))


manca = [v for v in gard if not v['local'] and v['zona'] in LENGA_FR]
titol = {}
for i in range(0, len(manca), 100):
    vals = ' '.join('"%s"' % v['insee'] for v in manca[i:i + 100])
    q = 'SELECT ?insee ?t WHERE { VALUES ?insee { %s } ?c wdt:P374 ?insee . ?a schema:about ?c ; schema:isPartOf <https://fr.wikipedia.org/> ; schema:name ?t . }' % vals
    r = json_url('https://query.wikidata.org/sparql?' + urllib.parse.urlencode({'query': q, 'format': 'json'}))
    for b_ in r['results']['bindings']:
        titol[b_['insee']['value']] = b_['t']['value']
intro = {}
tits = [titol[v['insee']] for v in manca if v['insee'] in titol]
for i in range(0, len(tits), 20):
    r = json_url('https://fr.wikipedia.org/w/api.php?' + urllib.parse.urlencode({
        'action': 'query', 'prop': 'extracts', 'exintro': 1, 'explaintext': 1, 'exlimit': 20, 'redirects': 1,
        'format': 'json', 'titles': '|'.join(tits[i:i + 20])}))
    for pg in r['query']['pages'].values():
        intro[pg.get('title')] = pg.get('extract', '')
    for rd in r['query'].get('redirects', []):
        intro.setdefault(rd['from'], None)
trobats = []
for v in manca:
    t = intro.get(titol.get(v['insee']))
    if not t:
        continue
    t = t[:600]
    ln = LENGA_FR[v['zona']]
    m = re.search(r'en (?:%s)\s*:\s*([^;,()\n]+)' % ln, t) or re.search(r'([A-ZÀ-ÖØ-Ý][^;,()\n«»]{1,40}?)\s+en (?:%s)\b' % ln, t)
    if m:
        n = m.group(1).strip(' «»"\'')
        n = re.split(r' ou | / ', re.sub(r'\s*[/\[].*?[/\]]', '', n))[0].strip()
        if 1 < len(n) <= 40 and n.lower() != v['nom_oficial'].lower():
            v.update(nom=n, local=True, font='Viquipèdia fr (introduccion)')
            trobats.append('%s → %s' % (v['nom_oficial'], n))
print('Noms locals trobats dins la Viquipèdia en francés : %d' % len(trobats))
for t in trobats:
    print('  ' + t)

d['vilas'] = [[v['lon'], v['lat'], v['nom'], v['renc'], v['zona']] for v in gard]
json.dump(d, open(FIC, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
json.dump(gard, open(os.path.join(R, 'SIG', 'oil', 'vilas-oil.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

per = {}
for v in gard:
    per.setdefault(v['zona'], [0, 0])
    per[v['zona']][0] += 1
    per[v['zona']][1] += v['local']
print('Vilas : %d (renc 1 : %d, 2 : %d, 3 : %d, 4 : %d)' % (len(gard), *[sum(v['renc'] == r for v in gard) for r in (1, 2, 3, 4)]))
for k, (n, nl) in per.items():
    print('  %-22s %3d vilas, %3d amb un nom local' % (k, n, nl))
print('Renc 1 :', ', '.join('%s (%s)' % (v['nom'], v['nom_oficial']) if v['local'] and v['nom'] != v['nom_oficial'] else v['nom'] for v in gard if v['renc'] == 1))
