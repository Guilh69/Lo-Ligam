# Exporte la couche de la carte : app/static/data/cercles.geojson
# Usage : py -I exportar.py <dossier de travail> <sortie.geojson>
# Entrées : crosat.json, comunas-domeni.json (dossier de travail),
# decisions.csv et autras.csv (ce dossier-ci, relus à la main)
import csv, json, math, os, re, sys, collections as C

D, SORTIDA = sys.argv[1], sys.argv[2]
ICI = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(f'{D}/crosat.json', encoding='utf-8'))
com = json.load(open(f'{D}/comunas-domeni.json', encoding='utf-8'))

# décisions de relecture : id;decision;nom (garda = garder tel quel ; lenga ;
# cultura ; fora = hors du périmètre)
dec = {r['id']: r for r in csv.DictReader(open(f'{ICI}/decisions.csv', encoding='utf-8'), delimiter=';')}

def viu(f):
    return bool(f['proves'])

OPLO = {'font': "carte « Actors de terren » de l'OPLO", 'ligam': 'https://umap.openstreetmap.fr/fr/map/actors-de-terren-siti_1186246', 'data': '2026-02'}
provas_oplo = set(open(f'{ICI}/provas-oplo.txt', encoding='utf-8').read().split())
punts = []
for f in d['fiches']:
    if f['id'] in provas_oplo and not any(p['font'].startswith('carte') for p in f['proves']):
        f['proves'].append(OPLO)
    if f['posicion'] in ('D', 'S'): continue
    r = dec.get(f['id'])
    if not r or r['decision'] == 'fora': continue
    if not (viu(f) or f['declaracion'][:4] >= '2021'): continue
    mena = f['classa'] if r['decision'] == 'garda' else r['decision']
    if r.get('sens_agenda') == '1':
        f['proves'] = [p for p in f['proves'] if not p['font'].startswith('agenda')]
    punts.append({'nom': r.get('nom') or f['nom'], 'mena': mena, 'comuna': f['comuna'],
                  'estat': 'viu' if viu(f) else 'declarat', 'declaracion': f['declaracion'][:4],
                  'proves': [{k: p[k] for k in ('font', 'ligam', 'data') if p.get(k)} for p in f['proves']],
                  'cors': bool(f['cors']) or None, 'rna': f['id'],
                  'site': f['site'] if f['site'].startswith('http') else None})

# structures sans fiche au RNA (carte OPLO, Aran, Italie), relues à la main :
# nom;mena;comuna(insee);font;ligam;data;cors
for r in csv.DictReader(open(f'{ICI}/autras.csv', encoding='utf-8'), delimiter=';'):
    # (le registre catalan ne prouve pas l'activité : point vide)
    punts.append({'nom': r['nom'], 'mena': r['mena'], 'comuna': r['comuna'],
                  'estat': 'declarat' if r['font'].startswith('Registre') else 'viu', 'declaracion': None,
                  'proves': [{'font': r['font'], 'ligam': r['ligam'], 'data': r['data']}],
                  'cors': r.get('cors') == '1' or None, 'rna': None, 'site': None})

# cours de la carte OPLO sans organisateur retrouvé : à la seule association
# de langue de leur commune, s'il n'y en a qu'une
langas = {}
for p in punts:
    if p['mena'] == 'lenga': langas.setdefault(p['comuna'], []).append(p)
for c in d['cors_sols']:
    l = langas.get(c['comuna'], [])
    if len(l) == 1: l[0]['cors'] = True

PETITS = set("de du des del dels dau deu deth dera la le les lo los las lei li lou lous d l e et en a al als per sus".split())
def nom_net(n):
    n = ' '.join(n.replace('"', '').replace("''", '').split()).strip(" -'")
    if len(n) > 42:
        n = re.split(r' - | \(|, ', n)[0].strip(" -'")
    if n.upper() != n: return n
    mots = []
    for k, m in enumerate(n.lower().split(' ')):
        parts = re.split(r"(['’])", m)
        parts = [x if (x in PETITS and (k or i)) or x in ("'", '’') else x[:1].upper() + x[1:] for i, x in enumerate(parts)]
        mots.append(''.join(parts))
    return ' '.join(mots)
CODIS = [('agenda', 'ag'), ('guide IEO', 'ieo'), ('Félibrige, maintenance de Provence', 'fp'), ("Félibrige, maintenance d'Aquitaine", 'fa'),
         ('Félibrige, maintenance du Limousin', 'fl'), ('carte', 'op'), ('Registre', 'ar')]
def codi(x):
    c = next(k for f, k in CODIS if x['font'].startswith(f))
    r = [c, x.get('data', '')[:7]]
    if c == 'ag': r.append(int(x['ligam'].rsplit('/', 1)[1]))
    return r

# plusieurs associations dans une commune : en cercle autour du point de la
# commune (environ 300 m), pour qu'aucune n'en cache une autre
per = C.defaultdict(list)
for p in punts: per[p['comuna']].append(p)
feats = []
for ci, ps in per.items():
    lon0, lat0 = com[ci]['p']
    ps.sort(key=lambda p: (p['mena'], p['nom']))
    for k, p in enumerate(ps):
        if len(ps) == 1: dx = dy = 0
        else:
            r = 0.0028 * (1 + k // 8); a = 2 * math.pi * (k % 8) / min(8, len(ps)) + 0.4 * (k // 8)
            dx, dy = r * math.cos(a) / math.cos(math.radians(lat0)), r * math.sin(a)
        # format court (sobriété) : n nom, m l/c, e v/d, c commune, o son nom
        # occitan, a année de déclaration, k cours, p preuves [code, date, uid]
        props = {'n': nom_net(p['nom']), 'm': p['mena'][0], 'e': p['estat'][0], 'c': com[ci]['fr']}
        if com[ci].get('oc') and com[ci]['oc'] != com[ci]['fr']: props['o'] = com[ci]['oc']
        if p.get('declaracion'): props['a'] = int(p['declaracion'])
        if p.get('cors'): props['k'] = 1
        if p['proves']: props['p'] = [codi(x) for x in p['proves']]
        feats.append({'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': [round(lon0 + dx, 4), round(lat0 + dy, 4)]}, 'properties': props})

FONT = ("Répertoire national des associations, ministère de l'Intérieur, Licence Ouverte (2026-10-01) ; "
        "preuves d'activité : guide du réseau IEO 2026, listes du Félibrige, agenda Lo CalenDiari (Licence Ouverte 2.0), "
        "carte « Actors de terren » de l'Office public de la langue occitane (2026-02) ; Aran : Registre d'entitats de Catalunya")
json.dump({'type': 'FeatureCollection', 'font': FONT, 'features': feats}, open(SORTIDA, 'w', encoding='utf-8'),
          ensure_ascii=False, separators=(',', ':'))
print(len(feats), 'points', C.Counter((f['properties']['m'], f['properties']['e']) for f in feats))
print('poids', os.path.getsize(SORTIDA) // 1024, 'Ko')
