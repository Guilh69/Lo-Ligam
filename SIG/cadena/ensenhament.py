# Ensenhament : fabrica app/static/data/ensenhament.json (la jaça de /carta) e lo
# tablèu sorsat SIG/ensenhament/establiments.csv. Las Calandretas son a despart
# (SIG/cadena/calandretas.mjs).
#
# Usage, depuis la racine du dépôt :  py -I SIG/cadena/ensenhament.py [--refrescar]
#
# Sources (détail et licences : SIG/ensenhament/LEGIR-ME.md) :
# 1. la liste : carte uMap de l'OPLO « Actors de terren » (n° 1186246), calques scolaires,
#    rentrée 2024-2025 ; reproduction permise par les mentions légales de l'OPLO, avec mention
#    de l'OPLO et du lien (décision de Romain, cahier §11, 2026-10-23). On n'en garde que le
#    code UAI (lu dans l'adresse électronique de l'établissement) et la forme d'enseignement :
#    ni courriel, ni téléphone, ni nom de personne ;
# 2. le nom officiel, la commune, la position et l'état : annuaire de l'éducation
#    (data.education.gouv.fr, fr-en-annuaire-education, Licence Ouverte 2.0), par code UAI ;
#    sans code ou code inconnu : adresse de l'OPLO géocodée par l'IGN (Géoplateforme, Licence Ouverte) ;
# 3. le supérieur : SIG/ensenhament/superior.csv, écrit à la main d'après Parcoursup, Mon Master
#    (Licence Ouverte) et la carte de l'OPLO ; adresses géocodées par l'IGN ;
# 4. le Val d'Aran : annuaire des écoles de Catalogne (jeu kvmv-ahh4, Generalitat de Catalunya,
#    licence ouverte d'utilisation de l'information), toutes les écoles de l'Aran.
#
# Les réponses brutes sont gardées dans SIG/brut/ensenhament/ (hors Git) ; sans --refrescar,
# le script les reprend. Les cas à regarder (code inconnu, établissement fermé, adresse mal
# géocodée) vont dans SIG/ensenhament/a-verificar.csv.

import csv, json, os, re, sys, urllib.parse, urllib.request

DIR = os.path.dirname(os.path.abspath(__file__))
RAIC = os.path.normpath(os.path.join(DIR, '..', '..'))
BRUT = os.path.join(RAIC, 'SIG', 'brut', 'ensenhament')
REV = os.path.join(RAIC, 'SIG', 'ensenhament')
SORTIDA = os.path.join(RAIC, 'app', 'static', 'data', 'ensenhament.json')
CALANDRETAS = os.path.join(RAIC, 'app', 'static', 'data', 'calandretas.geojson')
REFRESCAR = '--refrescar' in sys.argv
os.makedirs(BRUT, exist_ok=True)

UMAP = 1186246
UMAP_URL = f'https://umap.openstreetmap.fr/fr/map/{UMAP}'
ANNUARI = 'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records'
GEOCODATGE = 'https://data.geopf.fr/geocodage/search'
CATALONHA = 'https://analisi.transparenciacatalunya.cat/resource/kvmv-ahh4.json'
CURS_ARAN = '2026/2027'

# calque de l'OPLO -> nivèl de la jaça
CALQUES = {
	'1er degré - Enseignement bilingue': 'bilingue',
	'1er degré - Enseignement renforcé (3h/semaine)': 'renfortit',
	'1er degré - Enseignement extensif (30min - 1h30)': 'sensibilizacion',
	'Collèges': 'collègi',
	'Lycées': 'licèu',
}
# pour un même établissement présent dans plusieurs calques : on garde le plus fort
FORÇA = {'bilingue': 3, 'renfortit': 2, 'sensibilizacion': 1}


def legir(url, nom, json_=True):
	f = os.path.join(BRUT, nom)
	if REFRESCAR or not os.path.exists(f):
		req = urllib.request.Request(url, headers={'User-Agent': 'Lo Ligam (loligam.eu)'})
		with urllib.request.urlopen(req, timeout=60) as r:
			open(f, 'wb').write(r.read())
	return json.load(open(f, encoding='utf-8')) if json_ else open(f, encoding='utf-8').read()


# --- 1. la carte de l'OPLO -------------------------------------------------------------
carta = legir(f'https://umap.openstreetmap.fr/fr/map/{UMAP}/geojson/', 'oplo-carta.json')
entradas = []  # une par objet des calques scolaires
for cal in carta['properties']['datalayers']:
	g = legir(f'https://umap.openstreetmap.fr/fr/datalayer/{UMAP}/{cal["id"]}/', f'oplo-{cal["id"]}.json')
	nivel = CALQUES.get((g.get('_umap_options') or {}).get('name'))
	if not nivel:
		continue
	for ft in g['features']:
		p = ft['properties']
		m = re.search(r'(\d{7}[A-Za-z])', p.get('Mail') or '')
		entradas.append({
			'nivel': nivel,
			'forma_oplo': (p.get('Modalité') or p.get('Description') or '').strip(),
			'uai': m.group(1).upper() if m else '',
			'nom_oplo': (p.get('Nom') or '').strip(),
			'adreca': ' '.join(str(p.get(k) or '').strip() for k in ('Adresse', 'Code postal', 'Code Postal', 'Ville')).strip(),
		})


def forma(nivel, t):
	"""La forme d'enseignement, en codes courts (traduits dans la carte)."""
	if nivel == 'collègi':
		return ['opcion', 'dnl'] if 'DNL' in t else ['opcion']
	if nivel == 'licèu':
		f = [c for c, mot in (('LVB', 'LVB'), ('LVC', 'LVC'), ('LLCER', 'LLCER'), ('seccion', 'Section bilingue'), ('dnl', 'DNL')) if mot in t]
		return f
	if nivel == 'sensibilizacion':
		if 'LVR' in t:
			return ['lvr']
		m = re.search(r"par (?:l'association |le )(.+)$", t)
		return ['associacion:' + m.group(1).strip()] if m else []
	return []


# --- 2. l'annuaire de l'éducation ------------------------------------------------------
calandretas = {f['properties']['uai'] for f in json.load(open(CALANDRETAS, encoding='utf-8'))['features'] if f['properties'].get('uai')}
uais = sorted({e['uai'] for e in entradas if e['uai']})
annuari = {}
for i in range(0, len(uais), 80):
	lot = uais[i:i + 80]
	q = {
		'where': 'identifiant_de_l_etablissement in (' + ','.join(f'"{u}"' for u in lot) + ')',
		'select': 'identifiant_de_l_etablissement,nom_etablissement,nom_commune,code_commune,libelle_departement,libelle_academie,latitude,longitude,etat,type_etablissement,statut_public_prive',
		'limit': 100,
	}
	d = legir(ANNUARI + '?' + urllib.parse.urlencode(q), f'annuari-{i // 80:02d}.json')
	for r in d['results']:
		annuari[r['identifiant_de_l_etablissement']] = r

geocache_f = os.path.join(BRUT, 'geocodatge.json')
geocache = {} if REFRESCAR or not os.path.exists(geocache_f) else json.load(open(geocache_f, encoding='utf-8'))


def geocodar(adreca):
	if adreca not in geocache:
		u = GEOCODATGE + '?' + urllib.parse.urlencode({'q': adreca, 'limit': 1})
		with urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Lo Ligam (loligam.eu)'}), timeout=30) as r:
			fs = json.load(r).get('features') or []
		geocache[adreca] = None if not fs else {
			'lon': fs[0]['geometry']['coordinates'][0], 'lat': fs[0]['geometry']['coordinates'][1],
			'label': fs[0]['properties']['label'], 'score': fs[0]['properties']['score'],
			'type': fs[0]['properties']['type'], 'comuna': fs[0]['properties'].get('city', ''),
		}
	return geocache[adreca]


TIPE = {'bilingue': 'Ecole', 'renfortit': 'Ecole', 'sensibilizacion': 'Ecole', 'collègi': 'Collège', 'licèu': 'Lycée'}


GENERICS = set('ecole école maternelle elementaire élémentaire primaire publique public privee privée prive privé college collège lycee lycée '
	'general général generale générale technologique polyvalent professionnel et de du des la le les l d groupe scolaire site'.split())


def mots(nom):
	return {m for m in re.split(r"[^\wàâçéèêëîïôûùüÿœ]+", nom.lower()) if len(m) > 1 and m not in GENERICS}


def successor(g, nivel, nom_oplo):
	"""Code absent de l'annuaire (école fermée ou fusionnée) ou pas de code : l'établissement
	ouvert du même type le plus proche de l'adresse, à moins de 200 m, qui partage un mot de
	son nom (sauf si le nom de l'OPLO est générique, « École maternelle ») ; jamais une SEGPA."""
	q = {
		'where': f"within_distance(position, geom'POINT({g['lon']} {g['lat']})', 200m) and type_etablissement='{TIPE[nivel]}' and etat='OUVERT'",
		'select': 'identifiant_de_l_etablissement,nom_etablissement,nom_commune,libelle_departement,libelle_academie,latitude,longitude,statut_public_prive',
		'limit': 20,
	}
	rs = legir(ANNUARI + '?' + urllib.parse.urlencode(q), f'successor-{g["lon"]:.5f}-{g["lat"]:.5f}-{TIPE[nivel]}.json')['results']
	rs = [r for r in rs if r.get('latitude') is not None and not r['nom_etablissement'].lower().startswith('section d')]
	if mots(nom_oplo):
		rs = [r for r in rs if mots(nom_oplo) & mots(r['nom_etablissement'])]
	return min(rs, key=lambda r: (r['longitude'] - g['lon']) ** 2 + (r['latitude'] - g['lat']) ** 2) if rs else None


establiments = {}  # clau : UAI (o nom+adreça sens UAI)
verificar = []
for e in entradas:
	if e['uai'] in calandretas:
		continue
	clau = e['uai'] or (e['nom_oplo'] + ' | ' + e['adreca'])
	a = annuari.get(e['uai'])
	if a and a.get('etat') != 'OUVERT':
		verificar.append({'uai': e['uai'], 'nom': e['nom_oplo'], 'nivel': e['nivel'], 'motiu': 'fermé dans l\'annuaire (' + str(a.get('etat')) + ')'})
		continue
	if a and a.get('latitude') is not None:
		pos = {'lon': a['longitude'], 'lat': a['latitude'], 'posicion': 'annuaire de l\'éducation'}
		nom, comuna = a['nom_etablissement'], a['nom_commune']
		dep, aca = a.get('libelle_departement') or '', a.get('libelle_academie') or ''
	else:
		g = geocodar(e['adreca']) if e['adreca'] else None
		motiu = 'code UAI absent de l\'annuaire' if e['uai'] else 'pas de code UAI'
		if not g or g['score'] < 0.6:
			verificar.append({'uai': e['uai'], 'nom': e['nom_oplo'], 'nivel': e['nivel'], 'motiu': motiu + ', adresse non retrouvée : ' + e['adreca']})
			continue
		s = successor(g, e['nivel'], e['nom_oplo'])
		if not s:
			# pas d'établissement ouvert à cette adresse : fermé, on ne le montre pas
			verificar.append({'uai': e['uai'], 'nom': e['nom_oplo'], 'nivel': e['nivel'], 'motiu': motiu + f', aucun établissement ouvert à moins de 200 m de l\'adresse (« {g["label"]} ») : écarté'})
			continue
		verificar.append({'uai': e['uai'], 'nom': e['nom_oplo'], 'nivel': e['nivel'], 'motiu': motiu + f', remplacé par l\'établissement ouvert le plus proche de l\'adresse : {s["nom_etablissement"]} ({s["identifiant_de_l_etablissement"]}, {s["nom_commune"]})'})
		e['uai'] = s['identifiant_de_l_etablissement']
		if e['uai'] in calandretas:
			continue
		clau = e['uai']
		pos = {'lon': s['longitude'], 'lat': s['latitude'], 'posicion': 'annuaire de l\'éducation (par l\'adresse de l\'OPLO)'}
		nom, comuna = s['nom_etablissement'], s['nom_commune']
		dep, aca = s.get('libelle_departement') or '', s.get('libelle_academie') or ''
	f = forma(e['nivel'], e['forma_oplo'])
	ja = establiments.get(clau)
	if ja:
		# même établissement dans deux calques : le niveau le plus fort, les formes réunies
		if FORÇA.get(e['nivel'], 0) > FORÇA.get(ja['nivel'], 0):
			ja['nivel'] = e['nivel']
		ja['forma'] = list(dict.fromkeys(ja['forma'] + f))
		ja['forma_oplo'] += ' / ' + e['forma_oplo']
		continue
	establiments[clau] = {'nivel': e['nivel'], 'forma': f, 'forma_oplo': e['forma_oplo'], 'uai': e['uai'], 'nom': nom, 'comuna': comuna,
		'departement': dep, 'academie': aca, **pos, 'font': 'OPLO, carte « Actors de terren » (rentrée 2024-2025)'}

# --- 3. le supérieur --------------------------------------------------------------------
for s in csv.DictReader(open(os.path.join(REV, 'superior.csv'), encoding='utf-8'), delimiter=';'):
	# position fixée à la main (colonnes lon, lat) quand le géocodage ne trouve pas l'adresse
	g = {'lon': float(s['lon']), 'lat': float(s['lat']), 'score': 1} if s.get('lon') else geocodar(s['adreca'])
	if not g or g['score'] < 0.5:
		verificar.append({'uai': '', 'nom': s['nom'], 'nivel': 'superior', 'motiu': 'adresse non retrouvée : ' + s['adreca']})
		continue
	establiments['sup:' + s['id']] = {'nivel': 'superior', 'forma': [], 'forma_oplo': s['formacions'], 'uai': '', 'nom': s['nom'], 'comuna': s['comuna'],
		'departement': '', 'academie': '', 'lon': g['lon'], 'lat': g['lat'], 'posicion': 'adresse, géocodage IGN', 'font': s['fonts']}

# --- 4. le Val d'Aran -------------------------------------------------------------------
q = {'$where': f"curs='{CURS_ARAN}' AND upper(nom_comarca) like '%ARAN%'", '$limit': 100}
for r in legir(CATALONHA + '?' + urllib.parse.urlencode(q), 'catalonha-aran.json'):
	if not r.get('coordenades_geo_x'):
		verificar.append({'uai': r.get('codi_centre', ''), 'nom': r.get('denominaci_completa', ''), 'nivel': 'aran', 'motiu': 'sans coordonnées'})
		continue
	f = [c for c, k in (('infantil', 'einf2c'), ('primària', 'epri'), ('ESO', 'eso'), ('batxillerat', 'batx'), ('FP', 'cfpm')) if r.get(k)]
	# le système scolaire seulement (l'aranais y est langue d'enseignement) : ni crèches,
	# ni école des techniciens sportifs, ni centre pour adultes, faute de preuve
	if not f:
		continue
	establiments['aran:' + r['codi_centre']] = {'nivel': 'aran', 'forma': f, 'forma_oplo': '', 'uai': r['codi_centre'], 'nom': r['denominaci_completa'],
		'comuna': r['nom_municipi'], 'departement': 'Val d\'Aran', 'academie': '', 'lon': float(r['coordenades_geo_x']), 'lat': float(r['coordenades_geo_y']),
		'posicion': 'annuaire des écoles de Catalogne', 'font': f'Generalitat de Catalunya, annuaire des écoles ({CURS_ARAN})'}

json.dump(geocache, open(geocache_f, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

# --- sorties ----------------------------------------------------------------------------
ORDRE = ['bilingue', 'renfortit', 'sensibilizacion', 'collègi', 'licèu', 'superior', 'aran']
llista = sorted(establiments.values(), key=lambda x: (ORDRE.index(x['nivel']), x['departement'], x['comuna'], x['nom']))
cols = ['nivel', 'forma', 'forma_oplo', 'uai', 'nom', 'comuna', 'departement', 'academie', 'lon', 'lat', 'posicion', 'font']
with open(os.path.join(REV, 'establiments.csv'), 'w', encoding='utf-8', newline='') as fo:
	w = csv.DictWriter(fo, cols, delimiter=';')
	w.writeheader()
	for x in llista:
		w.writerow({**x, 'forma': ' '.join(x['forma']), 'lon': round(x['lon'], 5), 'lat': round(x['lat'], 5)})
with open(os.path.join(REV, 'a-verificar.csv'), 'w', encoding='utf-8', newline='') as fo:
	w = csv.DictWriter(fo, ['nivel', 'uai', 'nom', 'motiu'], delimiter=';')
	w.writeheader()
	w.writerows(verificar)

FONT = (f'Liste : OPLO, carte « Actors de terren » (rentrée 2024-2025), {UMAP_URL} ; positions : annuaire de l\'éducation '
	'(Licence Ouverte 2.0) et géocodage IGN ; supérieur : Parcoursup, Mon Master ; Val d\'Aran : Generalitat de Catalunya')
# Pour la carte, un format compact plutôt que du GeoJSON (deux fois moins lourd) : un tableau
# par point, [lon, lat, nivèl, nom, comuna, forma, formacions] ; nivèl en une lettre
# (b bilingue, r renfortit, s sensibilizacion, c collègi, l licèu, u superior, a Aran) ;
# forma : codes séparés par une espace (opcion, dnl, seccion, LVB, LVC, LLCER, lvr,
# @association, infantil, primària, ESO, batxillerat) ; formacions (supérieur seulement) :
# les formations, séparées par « | ». Les colonnes vides de la fin sont omises.
LETRA = {'bilingue': 'b', 'renfortit': 'r', 'sensibilizacion': 's', 'collègi': 'c', 'licèu': 'l', 'superior': 'u', 'aran': 'a'}
ponches = []
for x in llista:
	f = ' '.join('@' + t[12:] if t.startswith('associacion:') else t for t in x['forma'])
	p = [round(x['lon'], 5), round(x['lat'], 5), LETRA[x['nivel']], x['nom'], x['comuna'], f, x['forma_oplo'] if x['nivel'] == 'superior' else '']
	while p[-1] == '':
		p.pop()
	ponches.append(p)
feats = ponches
with open(SORTIDA, 'w', encoding='utf-8', newline='\n') as fo:
	fo.write('{"font":' + json.dumps(FONT, ensure_ascii=False) + ',"ponches":[\n')
	fo.write(',\n'.join(json.dumps(p, ensure_ascii=False, separators=(',', ':')) for p in ponches))
	fo.write('\n]}\n')

from collections import Counter
print('entrées OPLO', len(entradas), '| UAI distincts', len(uais), '| dans l\'annuaire', len(annuari))
print('couche :', len(feats), dict(Counter(x['nivel'] for x in llista)))
print('à vérifier :', len(verificar), dict(Counter(v['motiu'].split(',')[0] for v in verificar)))
print('fichier :', SORTIDA, os.path.getsize(SORTIDA), 'octets')
