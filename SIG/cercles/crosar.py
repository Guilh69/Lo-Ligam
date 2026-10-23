# Croise les candidats du RNA avec les preuves de vie et place chaque
# association à sa commune du domaine.
# Usage : py -I crosar.py <dossier de travail>
# Entrées (dans le dossier) : rna-classats.csv, comunas-domeni.json,
# ieo-2026.json, felibrige.json, oplo-cultura.json, oplo-cors.json, calendiari.json
# Sortie : crosat.json (une ligne par association ou structure)
import csv, json, re, sys, unicodedata, collections as C

D = sys.argv[1]
def plier(s):
    s = unicodedata.normalize('NFKD', s or '')
    s = ''.join(c for c in s if not unicodedata.combining(c)).upper().replace('’', "'")
    return re.sub(r'\s+', ' ', re.sub(r"[^A-Z0-9]", ' ', s)).strip()

GEN = set(('ASSOCIATION ASSOCIACION ASSOCIACIOUN ASSOC ASSO CERCLE CERCLES CERCLO OCCITAN OCCITANE OCCITANS OCCITANES '
           'DE DU DES DEL DELS DAU DOU DEU DETH DERA DE LA LE LES LO LOS LAS LI LEI L D E ET A AU AUX EN PER POUR SUS '
           'SECTION SECCION LOCAL LOCALE INSTITUT ETUDES ESTUDIS IEO I O CULTUREL CULTURELLE CULTURAL CULTURAU '
           'GROUPE GROP AMICALE CLUB FOYER RURAL MJC CENTRE COMITE').split())
def coeur(s):
    return ' '.join(m for m in plier(s).split() if m not in GEN and len(m) > 1)

comunas = json.load(open(f'{D}/comunas-domeni.json', encoding='utf-8'))
par_nom = C.defaultdict(list)
for i, c in comunas.items():
    par_nom[plier(c['fr'])].append(i)
    if c.get('oc'): par_nom[plier(c['oc'])].append(i)
def dep_insee(i): return i[:2] if not i.startswith('0') or len(i) == 5 else i
def trobar_comuna(insee='', nom='', dep='', cp=''):
    if insee:
        if insee.startswith('132') and len(insee) == 5: insee = '13055'
        if insee in comunas: return insee
    n = plier(re.sub(r'\b(CEDEX|\d+E?R?)\b.*$', '', plier(nom))) if nom else ''
    n = re.sub(r'^(LE|LA|LES|L) ', lambda m: m.group(0), n)
    d = dep or (cp[:2] if cp else '')
    for k in (n, n.replace('SAINT ', 'ST ').replace('ST ', 'SAINT '), re.sub(r'^(LE|LA|LES) ', '', n)):
        c = [i for i in par_nom.get(k, []) if not d or i.startswith(d)]
        if len(c) == 1: return c[0]
        if len(set(c)) == 1 and c: return c[0]
    return None
def pròcha(lon, lat, dep=''):
    best, bd = None, 1e9
    for i, c in comunas.items():
        if dep and not i.startswith(dep): continue
        p = c['p']; dd = (p[0] - lon) ** 2 + (p[1] - lat) ** 2
        if dd < bd: best, bd = i, dd
    return best

DEPS = {'Ariège':'09','Aude':'11','Aveyron':'12','Gard':'30','Haute-Garonne':'31','Gers':'32','Hérault':'34','Lot':'46',
        'Lozère':'48','Hautes-Pyrénées':'65','Pyrénées-Orientales':'66','Tarn':'81','Tarn-et-Garonne':'82','Charente':'16',
        'Corrèze':'19','Creuse':'23','Dordogne':'24','Gironde':'33','Landes':'40','Lot-et-Garonne':'47',
        'Pyrénées-Atlantiques':'64','Haute-Vienne':'87'}
def dep_de_nom(n):
    n = (n or '').strip()
    for k, v in DEPS.items():
        if plier(k) == plier(n): return v
    return ''

# --- le RNA ---
rna = [x for x in csv.DictReader(open(f'{D}/rna-classats.csv', encoding='utf-8')) if x['source'] != 'import-migre']
fiches = []
for x in rna:
    if x['classa'] == 'calandreta' or x['zone'] == 'hors': continue
    ci = trobar_comuna(x.get('insee', ''), x['commune'], x['dep'], x['cp'])
    if not ci: continue
    fiches.append({'id': x['id'], 'font': 'RNA', 'nom': x['titre'], 'objet': x['objet'], 'classa': x['classa'],
                   'comuna': ci, 'dep': ci[:2], 'creacion': x['date_creat'][:10], 'declaracion': x['date_decla'][:10],
                   'dissolucion': x['date_disso'][:10] if x['date_disso'][:4] not in ('', '0001') else '',
                   'posicion': x['position'], 'fichier': x['source'], 'site': x['siteweb'], 'motius': x['motifs'],
                   'proves': [], 'cors': []})
print('fiches RNA placees dans le domaine', len(fiches))
index = C.defaultdict(list)
for f in fiches:
    f['coeur'] = coeur(f['nom'])
    for m in f['coeur'].split(): index[m].append(f)

def candidats(nom, dep=None, comuna=None):
    k = coeur(nom)
    if not k: return []
    mots = k.split()
    pool = {id(f): f for m in mots for f in index.get(m, [])}.values()
    res = []
    for f in pool:
        if dep and f['dep'] != dep: continue
        fc = f['coeur']
        if fc == k or (len(mots) >= 2 and (k in fc or (fc in k and len(fc.split()) >= 2))) or \
           (len(mots) == 1 and len(k) >= 5 and (fc == k or fc.startswith(k + ' ') or fc.endswith(' ' + k))):
            res.append(f)
    if comuna and len(res) > 1:
        r2 = [f for f in res if f['comuna'] == comuna]
        if r2: res = r2
    return res

ambigus = []
def triar(nom, r):
    # le nom exact d'abord, puis le cœur exact, puis les classes langue et culture
    r = [f for f in r if f['posicion'] not in ('D', 'S')] or r
    for test in (lambda f: plier(f['nom']) == plier(nom), lambda f: f['coeur'] == coeur(nom),
                 lambda f: f['classa'] != 'bruit'):
        r2 = [f for f in r if test(f)]
        if len(r2) == 1: return r2
        if r2: r = r2
    return r
def provar(nom, prova, dep=None, comuna=None):
    r = triar(nom, candidats(nom, dep, comuna))
    if len(r) == 1:
        r[0]['proves'].append(prova); return r[0]
    if len(r) > 1: ambigus.append((prova['font'], nom, [f['nom'] for f in r][:4]))
    return None

# IEO 2026
IEO_DEP = {}
for e in json.load(open(f'{D}/ieo-2026.json', encoding='utf-8')):
    p = {'font': 'guide IEO 2026', 'ligam': 'https://ieo-opm.com/wp-content/uploads/GuideReseauIEO2026.pdf', 'data': '2026-06'}
    dep = e['cp'][:2] if e.get('cp') else None
    m = re.match(r'^IEO (\d\d)$', e['nom'].strip())
    if m:
        r = [f for f in fiches if f['dep'] == m.group(1) and re.search(r'INSTITUT D.(ESTUDIS|ETUDES?) OCC|\bI\.?E\.?O\b', plier(f['nom']))
             and f['posicion'] == 'A' and f['fichier'] == 'waldec']
        r.sort(key=lambda f: ('SECTION' not in plier(f['nom']) and 'SECCION' not in plier(f['nom']), f['declaracion']), reverse=False)
        if r: r[0]['proves'].append(p)
        else: ambigus.append(('IEO', e['nom'], []))
        continue
    ci = trobar_comuna('', e.get('ville') or '', dep or '', e.get('cp') or '')
    if not provar(e['nom'], p, dep or (ci[:2] if ci else None), ci):
        e['_sens'] = True
ieo_sens = [e for e in json.load(open(f'{D}/ieo-2026.json', encoding='utf-8'))]

# Félibrige
for e in json.load(open(f'{D}/felibrige.json', encoding='utf-8')):
    nom = re.sub(r"^(L.ESCOLO|ESCOLO FELIBRENCO|ESC[OÒ]LA FELIBRENCA)\s+", '', e['nom'], flags=re.I)
    p = {'font': e['font'], 'ligam': e['url'], 'data': '2026-10'}
    provar(e['nom'], p) or provar(nom, p)

# OPLO, culture et cours
oplo_sols = []
for e in json.load(open(f'{D}/oplo-cultura.json', encoding='utf-8')):
    dep = dep_de_nom(e['dep']); lon, lat = e['coord']
    ci = trobar_comuna('', e['ville'], dep, e['cp']) or pròcha(lon, lat, dep)
    p = {'font': "carte « Actors de terren » de l'OPLO", 'ligam': 'https://umap.openstreetmap.fr/fr/map/actors-de-terren-siti_1186246', 'data': '2026-02'}
    f = provar(e['nom'], p, dep or None, ci)
    if not f: oplo_sols.append({'nom': e['nom'], 'comuna': ci, 'dep': ci[:2] if ci else dep, 'desc': e['desc'], 'site': e['ligam']})
cors_sols = []
for e in json.load(open(f'{D}/oplo-cors.json', encoding='utf-8')):
    dep = dep_de_nom(e['dep']); lon, lat = e['coord']
    ci = trobar_comuna('', e['ville'], dep, e['cp']) or pròcha(lon, lat, dep)
    org = e['organisator'] or e['nom']
    r = triar(org, candidats(org, dep or None, ci))
    cour = {'titol': e['nom'], 'comuna': ci, 'font': 'OPLO'}
    if len(r) == 1:
        r[0]['cors'].append(cour)
        if not any(p['font'].startswith('carte') for p in r[0]['proves']):
            r[0]['proves'].append({'font': "carte « Actors de terren » de l'OPLO (cours)", 'ligam': 'https://umap.openstreetmap.fr/fr/map/actors-de-terren-siti_1186246', 'data': '2026-02'})
    else:
        cors_sols.append({'organisator': org, 'comuna': ci, 'dep': ci[:2] if ci else dep, 'titol': e['nom']})

# Lo CalenDiari : un événement depuis 18 mois
# (même département que l'événement ; un nom fait seulement de mots courants
# ne prouve rien)
COMUN = set(('CHORALE CORALA CHANT CHANTS CANT CANTS BAL BALS BALETI MUSIQUE MUSICA MUSIQUES THEATRE TEATRE FESTIVAL '
             'PROVENCE PROVENCAL PROVENCALE GASCOGNE GASCON GASCONNE OCCITANIE OCCITANIA PAYS PAIS TRADITION TRADITIONS '
             'FOLKLORIQUE FOLKLORE AMIS AMICS DANSE DANSES TRAD LANGUE LENGA CULTURE CULTURA PATRIMOINE FETE FETES '
             'NOSTE NOSTRE NOSTA OC LOU LEI DI DIS ESCOLO FELIBRIGE PARLAREN OSTAL OSTAU BEARN BEARNAIS LIMOUSIN '
             'AUVERGNE ROUERGUE QUERCY LANGUEDOC TOULOUSE MONTPELLIER BORDEAUX MARSEILLE NICE PAU').split())
ev = [e for e in json.load(open(f'{D}/calendiari.json', encoding='utf-8')) if '2025-04-23' <= e['debut'] <= '2026-10-23']
txt = [(e, (e.get('cp') or '')[:2], ' ' + plier(' '.join([e['titre'], e['desc'], e['long'], e['lieu'], e['origine']])) + ' ') for e in ev]
for f in fiches:
    if f['posicion'] in ('D', 'S'): continue
    k = f['coeur']
    if not k or not (len(k.split()) >= 2 or len(k) >= 6): continue
    if all(m in COMUN or m.isdigit() for m in k.split()): continue
    cle = k if len(k.split()) >= 2 or len(k) >= 7 else plier(re.sub(r'(?i)^association ', '', f['nom']))
    hits = [e for e, dep, t in txt if dep == f['dep'] and ' ' + cle + ' ' in t]
    if hits:
        e = max(hits, key=lambda e: e['debut'])
        f['proves'].append({'font': 'agenda Lo CalenDiari', 'ligam': f"https://openagenda.com/agendas/41454951/events/{e['uid']}", 'data': e['debut'], 'titol': e['titre'][:80]})

json.dump({'fiches': fiches, 'oplo_sols': oplo_sols, 'cors_sols': cors_sols, 'ambigus': ambigus},
          open(f'{D}/crosat.json', 'w', encoding='utf-8'), ensure_ascii=False)
viu = [f for f in fiches if f['proves']]
print('avec une preuve de vie', len(viu), C.Counter(p['font'] for f in fiches for p in f['proves']))
print('OPLO culture sans fiche RNA', len(oplo_sols), '; cours sans organisateur retrouve', len(cors_sols), '; ambigus', len(ambigus))
