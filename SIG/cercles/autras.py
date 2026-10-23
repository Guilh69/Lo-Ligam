# Structures sans fiche au RNA, par règles (pas de relecture ligne à ligne) :
# carte « Actors de terren » de l'OPLO, puis Val d'Aran (registre catalan).
# Usage : py -I autras.py <dossier de travail>  →  autras.csv (ce dossier-ci)
import csv, json, os, re, sys, unicodedata, urllib.parse, urllib.request

D = sys.argv[1]
ICI = os.path.dirname(os.path.abspath(__file__))
def plier(s):
    s = unicodedata.normalize('NFKD', s or '')
    return ' '.join(re.sub(r'[^A-Z0-9]', ' ', ''.join(c for c in s if not unicodedata.combining(c)).upper()).split())

d = json.load(open(f'{D}/crosat.json', encoding='utf-8'))
com = json.load(open(f'{D}/comunas-domeni.json', encoding='utf-8'))
dec = {r['id']: r['decision'] for r in csv.DictReader(open(f'{ICI}/decisions.csv', encoding='utf-8'), delimiter=';')}
gardadas = [f for f in d['fiches'] if dec.get(f['id'], 'fora') != 'fora']
per_comuna, ids_comuna = {}, {}
for f in gardadas:
    per_comuna.setdefault(f['comuna'], []).append(plier(f['nom']))
    ids_comuna.setdefault(f['comuna'], []).append(f['id'])
# un doublon d'une fiche gardée lui passe sa preuve (la carte de l'OPLO) :
# la fiche de la commune qui partage le plus de mots avec lui
provas = []
def passar(e, n):
    mots = set(n.split()) - {'DE', 'DU', 'LA', 'LE', 'L', 'D', 'E', 'ET', 'LOS', 'LO', 'CERCLE', 'OCCITAN', 'IEO'}
    best = max(zip(per_comuna[e['comuna']], ids_comuna[e['comuna']]), key=lambda x: len(mots & set(x[0].split())))
    provas.append(best[1])

# hors de la couche : autre couche (Calandreta), institutions, médias,
# éditeurs, librairies, écoles de musique, musées
FORA = re.compile(r'CALANDRETA|CALANDRETO|ECOLE IMMERSIVE|OFICI PUBLIC|OPLO|CONGRES PERMANENT|FRANCE 3|CANOPE|CIRDOC|MEDIATECA|'
                  r'CONSERVATOIRE|ECOLE DE MUSIQUE|MUSEE|LIBRAIRIE|LIBRARIA|EDITION|EDICIONS|LABEL|RADIO|TELEVISION|WEB TV|OC TELE|'
                  r'CHAINE|MAGAZINE|REVUE|REVISTA|AGENCE CULTURELLE|CENTRE REGIONAL DES ENSEIGNANTS|CFPO|COLLEGI D OCCITANIA|'
                  r'LIGUE OCCITANE DE TAMBOURIN|MARQUE|PROSPECTIVE|DIARI')
LENGA = re.compile(r'LANGUE|LENGA|COURS|OCCITAN|GASCON|BEARNAIS|IEO|CERCLE|CERCLE OCCITAN|OSTAU|OSTAL|FELIBR|ESCOLA')
rangs = []
for e in d['oplo_sols']:
    n, desc = plier(e['nom']), plier(e['desc'])
    if not e.get('comuna') or FORA.search(n) or FORA.search(desc[:160]): continue
    # une section IEO ou un cercle déjà placé dans la commune : doublon
    deja = per_comuna.get(e['comuna'], [])
    if re.search(r'\bIEO\b|CERCLE|CERCLO|OSTAU', n) and any(re.search(r'INSTITUT|\bIEO\b|CERCLE|OSTAU|SECTION|SECCION', x) for x in deja):
        passar(e, n); continue
    if any(n == x or (len(n) > 6 and n in x) for x in deja):
        passar(e, n); continue
    mena = 'lenga' if LENGA.search(n) or re.search(r'LANGUE|LENGA|COURS D OCCITAN|COURS POUR ADULTES', desc) else 'cultura'
    rangs.append({'nom': e['nom'].strip(' "'), 'mena': mena, 'comuna': e['comuna'],
                  'font': "carte « Actors de terren » de l'OPLO", 'ligam': 'https://umap.openstreetmap.fr/fr/map/actors-de-terren-siti_1186246',
                  'data': '2026-02', 'cors': ''})
print('OPLO gardées', len(rangs), 'sur', len(d['oplo_sols']))

# Val d'Aran : registre des entités de Catalogne (licence ouverte de la Generalitat)
q = ("$select=nom_entitat,nom_poblacio,estat,classificacio_general,contingut_finalitats&$limit=400"
     "&$where=nom_comarca like '%Aran%'")
url = 'https://analisi.transparenciacatalunya.cat/resource/y6fz-g3ff.json?' + urllib.parse.quote(q, safe='=&$')
aran = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'LoLigam'}), timeout=60))
AR = re.compile(r'ARANES|ARANESA|OCCITAN|LENGUA|LENGA|CULTURAU|CULTURA ARANESA|ESTUDIS ARANESI|ESTUDI DERA CULTURA')
par_nom = {}
for i, c in com.items():
    if c['f'] == 'ARAN':
        par_nom[plier(c['fr'])] = i
        par_nom[plier(re.sub(r' e .*', '', c['fr']))] = i
n0 = len(rangs)
for e in aran:
    t = plier(e.get('nom_entitat', '') + ' ' + e.get('contingut_finalitats', ''))
    if e.get('estat') != 'Inscrita' or not AR.search(t) or not re.search(r'LENG|ESTUDI|CULTUR|DANC|MUSIC|TEATR|ARTISTIC|CANT', t)        or re.search(r'SNOWBO|HARLEY|POMPIER|ESPORT|CACA|ESQUI|TAXI|CRIADOR|PRODUCTES|MUSULMAN|INNOV|TERRITORI|ESPLAI|FUTUR|NUMERIC|MUSEU|UNIVERSITAR|OFICIS|RECREAT|STEREO|SOLEI|ARANIA', t): continue
    p = plier(e.get('nom_poblacio', ''))
    ci = par_nom.get(p) or next((v for k, v in par_nom.items() if p and (p in k or k in p)), None) or par_nom.get('VIELHA E MIJARAN')
    if not ci: continue
    rangs.append({'nom': e['nom_entitat'], 'mena': 'lenga' if re.search(r'LENG|ARANES|ESTUDIS', t) else 'cultura', 'comuna': ci,
                  'font': "Registre d'entitats de Catalunya", 'ligam': 'https://analisi.transparenciacatalunya.cat/d/y6fz-g3ff',
                  'data': '2026-10', 'cors': ''})
print('Aran', len(rangs) - n0, [r['nom'][:40] for r in rangs[n0:]])

open(f'{ICI}/provas-oplo.txt', 'w', encoding='utf-8').write(chr(10).join(sorted(set(provas))) + chr(10))
print('preuves OPLO passées à des fiches gardées', len(set(provas)))
with open(f'{ICI}/autras.csv', 'w', newline='', encoding='utf-8') as s:
    w = csv.DictWriter(s, fieldnames=['nom', 'mena', 'comuna', 'font', 'ligam', 'data', 'cors'], delimiter=';')
    w.writeheader(); w.writerows(rangs)
