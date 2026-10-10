# Corse et continuum (Gallura, Sassari, Capraia) : classement de chaque commune
# par dialecte, noms locaux, géométries italiennes des communes classées.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/cors-classament.py
#
# Entrées :
#  - SIG/cors/cors-cartas.csv (cors-cartas.py : lecture des cartes G et J) ;
#  - SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg (IGN : communes 2A/2B, EPCI) ;
#  - SIG/brut/cors/comuni-it-nord.geojson (cors-istat.py : ISTAT 2026) ;
#  - SIG/brut/cors/noms/ : dc-communes-noms.csv (Collectivité de Corse,
#    data.corsica, « communes de Corse en corse et en français », Licence
#    Ouverte 2.0), wd-co.csv et wd-sardegna.csv (Wikidata, CC0), osm-co.csv
#    (OpenStreetMap name:co, ODbL).
# Sorties : SIG/cors/dialectes-cors.csv, SIG/cors/noms-locals.csv,
#   SIG/brut/cors/comuni-it-cors.geojson. Le JSON des dialectes est écrit à
#   la main (SIG/cors/dialectes-cors.json) ; les comptes sont affichés ici.
# Méthode et sources : SIG/cors/FONTS.md.
import csv, json, os, re, unicodedata
from osgeo import ogr

ogr.UseExceptions()
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SIG = os.path.join(R, 'SIG')
NOMS = os.path.join(SIG, 'brut', 'cors', 'noms')
csv.field_size_limit(10 ** 9)


def norm(s):
    s = unicodedata.normalize('NFD', s or '').encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()


# ---------------------------------------------------------------- Corse
gp = ogr.Open(os.path.join(SIG, 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
epci = {f.GetField('code_siren'): f.GetField('nom_officiel') for f in gp.GetLayerByName('epci')}
co = gp.GetLayerByName('commune')
co.SetAttributeFilter("code_insee_du_departement IN ('2A','2B')")
comunas = []
for f in co:
    sirens = [s for s in (f.GetField('codes_siren_des_epci') or '').split('/') if s]
    comunas.append({'codi': f.GetField('code_insee'), 'nom': f.GetField('nom_officiel'),
                    'pop': f.GetField('population'), 'epci': epci.get(sirens[0], '') if sirens else ''})
comunas.sort(key=lambda c: c['codi'])
parnom = {c['nom']: c['codi'] for c in comunas}
cartas = {r['codi']: r for r in csv.DictReader(open(os.path.join(SIG, 'cors', 'cors-cartas.csv'), encoding='utf-8'), delimiter=';')}


def codis(noms):
    out = []
    for n in noms:
        if n not in parnom:
            raise SystemExit('Commune introuvable : %s' % n)
        out.append(parnom[n])
    return out


# Microrégions qui portent un parler nommé dans les sources (notes seulement)
NIOLU = codis(['Corscia', 'Lozzi', 'Albertacce', 'Casamaccioli', 'Calacuccia'])  # fr.wiki « Niolo »
CINARCA = codis(['Lopigna', 'Arro', 'Ambiegna', 'Casaglione', "Sari-d'Orcino", 'Cannelle', "Sant'Andréa-d'Orcino", 'Calcatoggio'])  # fr.wiki « Cinarca »
GRAVONA = codis(['Bocognano', 'Tavera', 'Ucciani', 'Vero', 'Carbuccia', 'Tavaco', 'Peri', 'Cuttoli-Corticchiato',
                 'Sarrola-Carcopino', 'Bastelicaccia', 'Ajaccio'])  # fr.wiki « Gravona » (communes traversées)
TARAVU = codis(['Palneca', 'Cozzano', 'Ciamannacce', 'Zicavo', 'Sampolo', 'Guitera-les-Bains', 'Corrano', 'Olivese',
                'Zévaco', 'Forciolo', 'Argiusta-Moriccio', 'Zigliara', 'Moca-Croce', 'Petreto-Bicchisano', 'Urbalacone',
                'Guargualé', 'Pila-Canale', 'Cognocoli-Monticchi', 'Casalabriva', 'Sollacaro', 'Serra-di-Ferro', 'Olmeto'])  # fr.wiki « Taravo »
ALTA_ROCCA = codis(['Carbini', 'Levie', 'San-Gavino-di-Carbini', 'Zonza', 'Aullène', 'Quenza', 'Serra-di-Scopamène',
                    'Sorbollano', 'Zérubia', 'Altagène', 'Cargiaca', 'Loreto-di-Tallano', 'Mela', 'Olmiccia',
                    'Sainte-Lucie-de-Tallano', 'Zoza'])  # fr.wiki « Alta Rocca » (3 pièves, 16 communes)
FIUMORBU = codis(['Isolaccio-di-Fiumorbo', 'Prunelli-di-Fiumorbo', 'San-Gavino-di-Fiumorbo', 'Serra-di-Fiumorbo'])  # fr.wiki « Fiumorbo »
UNICS = {'Bastia': 'bastiacciu', 'Ajaccio': 'aiaccinu', 'Bastelica': 'bastelicaccio', 'Sari-Solenzara': 'parler de Solenzara',
         'Cervione': 'parler de Cervioni', 'Sartène': 'sartinesu', 'Porto-Vecchio': 'portivechjacciu',
         'Figari': 'parler de Figari (iddu, idda)'}

# Écarts entre les cartes tranchés par le texte d'it.wiki « Lingua corsa »
# (zone de transition : Fiumorbo, Solenzara ; le pumuntincu commence au sud
# de Solenzara) : G dit sud, J dit transition -> transition.
T_PER_J = codis(['Sari-Solenzara', 'Serra-di-Fiumorbo', 'Solaro', 'Ventiseri', 'San-Gavino-di-Fiumorbo', 'Chisa'])
# Bastelica : point du village sur la limite de G (côté sud) ; it.wiki la range
# nommément dans la transition (« bastelicaccio ») et fait passer la limite du
# pumuntincu « au sud de Bastelica »
T_PER_TEXT = codis(['Bastelica'])

DIAL_G = {'capicursinu': ('cismuntincu', 'capicursinu'), 'nordicu': ('cismuntincu', 'nordicu'),
          'cismunticu': ('cismuntincu', 'cismunticu'), 'transizione': ('transizione', 'transizione'),
          'taravesu_sartinesu': ('oltramuntincu', None)}
LIB_G = {'capicursinu': 'cismunticu capicursinu', 'nordicu': 'cismunticu nordicu', 'cismunticu': 'cismunticu',
         'transizione': 'pumunticu di transizione', 'taravesu_sartinesu': 'corsu taravesu & sartinesu',
         'ligure': 'corsu-ligure', 'grecu': 'grecu di Carghjese'}
LIB_J = {'capocorsino': 'cismontano capocorsino', 'cismontano': 'cismontano', 'transizione': 'transizione',
         'oltramontano': 'oltramontano', 'sartenese': 'oltramontano sartenese'}
ACORD = {'capicursinu': ('capocorsino',), 'nordicu': ('cismontano', 'capocorsino'), 'cismunticu': ('cismontano',),
         'transizione': ('transizione',), 'taravesu_sartinesu': ('oltramontano', 'sartenese')}


def parts(s):
    out = []
    for p in (s or '').split():
        k, v = p.rsplit(':', 1)
        out.append((k, float(v)))
    return out


linhas = []
stats = {}
for c in comunas:
    k = c['codi']
    m = cartas[k]
    g, j = m['G_cl'], m['J_cl']
    notas, font = [], ['G18', 'J06']
    domeni, transicio = 'cors', ''
    gbase = g
    if g in ('ligure', 'grecu'):
        # sous la tache ligure ou grecque : la zone corse voisine dans la commune
        gbase = next((z for z, v in parts(m['G_poly']) if z not in ('ligure', 'grecu')), 'transizione')
    dialecte, parlar = DIAL_G[gbase]
    # Cap Corse : J (capocorsino) et la communauté de communes du Cap Corse
    if j == 'capocorsino' and c['epci'] == 'CC du Cap Corse':
        if gbase != 'capicursinu':
            notas.append('G : %s' % LIB_G[gbase])
        dialecte, parlar = 'cismuntincu', 'capicursinu'
        font.append('EPCI')
    elif j == 'capocorsino' and gbase != 'capicursinu':
        notas.append('J : %s' % LIB_J[j])
    if k in T_PER_J:
        notas.append('G : %s ; J et it.wiki : transition' % LIB_G[gbase])
        dialecte, parlar = 'transizione', 'transizione'
        font.append('WIT')
    elif k in T_PER_TEXT:
        notas.append('G : %s (village sur la limite) ; J : %s ; it.wiki : transition' % (LIB_G[gbase], LIB_J.get(j, j)))
        dialecte, parlar = 'transizione', 'transizione'
        font.append('WIT')
    elif dialecte == 'oltramuntincu':
        jj = j
        if jj not in ('oltramontano', 'sartenese'):
            jj = next((z for z, v in parts(m['J_poly']) if z in ('oltramontano', 'sartenese')), 'oltramontano')
            notas.append('J : %s au chef-lieu' % LIB_J.get(j, j))
        parlar = 'taravesu' if jj == 'oltramontano' else 'sartinesu'
    elif gbase in ACORD and j not in ACORD[gbase] and not (j == 'capocorsino'):
        notas.append('J : %s' % LIB_J.get(j, j))
    # zones voisines près du chef-lieu (carte G, rayon 1,5 km)
    autres = [z for z, v in parts(m['G_disc']) if z != g and z not in ('ligure', 'grecu') and v >= 0.15]
    if autres and k not in T_PER_J + T_PER_TEXT:
        notas.append('limite de zone sur G (à moins de 1,5 km : %s)' % ', '.join(LIB_G[z] for z in autres))
    # cas à part
    if c['nom'] == 'Bonifacio':
        domeni, dialecte, parlar = 'ligure', '', 'bunifazzinu'
        notas.insert(0, 'ville de langue ligure (bunifazzinu), de moins en moins parlée ; campagne de la commune corsophone (%s sur G et J)' % ('corsu taravesu & sartinesu / oltramontano sartenese'))
        font.append('WIT')
    elif c['nom'] == 'Calvi':
        transicio = 'lij'
        notas.insert(0, 'ancien parler ligure (calvese), éteint selon it.wiki ; « corsu-ligure calvese » sur G')
        font.append('WIT')
    elif c['nom'] == 'Ajaccio':
        transicio = 'lij'
        notas.insert(0, 'aiaccinu : base méridionale, influence ligure (fr.wiki, it.wiki) ; « corsu-ligure aghjaccinu » sur G')
        font.append('WIT')
    elif c['nom'] == 'Cargèse':
        transicio = 'el'
        notas.insert(0, 'colonie grecque (1676) ; le grec ne sert plus qu’à la liturgie (it.wiki) ; « grecu di Carghjese » sur G')
        font.append('WIT')
    elif g == 'ligure':
        notas.insert(0, 'chef-lieu dans la tache « corsu-ligure » de G autour d’une ville (symbole) : non retenu')
    # parlers locaux nommés par les sources (notes)
    loc = []
    if c['epci'] in ('CC de Calvi Balagne', "CC de l'Île-Rousse - Balagne"):
        loc.append('balaninu (Balagne)')
    if k in NIOLU:
        loc.append('niulincu (Niolu)')
    if k in ALTA_ROCCA:
        loc.append('rucchisgianu (Alta Rocca)')
    if k in CINARCA:
        loc.append('Cinarca : transition (it.wiki)')
    if k in GRAVONA and c['nom'] != 'Ajaccio':
        loc.append('Gravona : transition (it.wiki)')
    if k in TARAVU:
        loc.append('taravesu (vallée du Taravo)')
    if k in FIUMORBU:
        loc.append('fiumorbacciu (Fiumorbo)')
    if c['nom'] in UNICS:
        loc.append(UNICS[c['nom']])
    if c['nom'] == 'Vivario':
        loc.append('hameau de Vizzavona : transition (it.wiki)')
    if c['nom'] == 'Grosseto-Prugna':
        loc.append('hameau de Porticcio : transition (it.wiki : le pumuntincu commence au sud de Porticcio)')
    if loc:
        notas.append('parler cité : ' + ' ; '.join(loc))
        if 'WIT' not in font:
            font.append('WIT')
    font.append('IGN')
    stats[(dialecte, parlar)] = stats.get((dialecte, parlar), 0) + 1
    linhas.append(['Corsica', c['epci'], 'comuna_fr', c['nom'], '', k, domeni, dialecte, parlar, transicio, 0,
                   ' ; '.join(notas), ' '.join(font)])

# Parler isolé : une commune dont le parler (niveau fin, lu sur J) n'est celui
# d'aucune voisine prend celui de ses voisines du même dialecte, s'il est unique.
geo = {}
co.ResetReading()
for f in co:
    geo[f.GetField('code_insee')] = f.GetGeometryRef().Clone()
par_codi = {l[5]: l for l in linhas}
env = {k: g.GetEnvelope() for k, g in geo.items()}
for k, g in geo.items():
    l = par_codi[k]
    if l[6] != 'cors' or not l[8]:
        continue
    e = env[k]
    vz = [v for v in geo if v != k and not (env[v][1] < e[0] or env[v][0] > e[1] or env[v][3] < e[2] or env[v][2] > e[3])
          and g.Intersects(geo[v])]
    if any(par_codi[v][8] == l[8] for v in vz):
        continue
    meme = {par_codi[v][8] for v in vz if par_codi[v][7] == l[7] and par_codi[v][8]}
    if len(meme) == 1:
        nou = meme.pop()
        l[11] = ' ; '.join([x for x in [l[11], 'lu %s sur J, aucune voisine dans ce parler : rangée avec ses voisines (%s)' % (l[8], nou)] if x])
        stats[(l[7], l[8])] -= 1
        stats[(l[7], nou)] = stats.get((l[7], nou), 0) + 1
        l[8] = nou
        print('Parler isolé : %s %s -> %s' % (k, l[3], nou))

# ---------------------------------------------------------------- Italie
it = json.load(open(os.path.join(SIG, 'brut', 'cors', 'comuni-it-nord.geojson'), encoding='utf-8'))
itnom = {f['properties']['nom']: f for f in it['features']}
GALL = ['Tempio Pausania', 'Arzachena', 'Calangianus', 'Aggius', 'Bortigiadas', 'Santa Teresa Gallura', 'Luogosanto', 'Palau',
        'Aglientu', "Trinità d'Agultu e Vignola", 'Telti', 'Badesi', "Sant'Antonio di Gallura", 'Loiri Porto San Paolo',
        'San Teodoro', 'Erula', 'Viddalba', 'Santa Maria Coghinas']
NOTA_GALL = {'Tempio Pausania': 'timpiesu, variété de référence (hameau de Nuchis : variante propre)',
             'Calangianus': 'caragnanesu', "Sant'Antonio di Gallura": 'caragnanesu',
             'Santa Teresa Gallura': 'teresinu / lungunesu au bourg seulement',
             'Aggius': 'agghjesu', 'Badesi': 'agghjesu', "Trinità d'Agultu e Vignola": 'agghjesu', 'Viddalba': 'agghjesu',
             'Bortigiadas': 'variante de Bortigiadas', 'Santa Maria Coghinas': 'cuzinesu',
             'Erula': 'hors de la Gallura historique', 'San Teodoro': 'Gallura côtière'}
SASS = ['Sassari', 'Porto Torres', 'Sorso', 'Stintino']
CAST = ['Castelsardo', 'Sedini', 'Tergu']
PARCIAL = ['Budoni', 'Perfugas', 'Tula', 'Padru', 'Oschiri']
it_linhas = {}


def it_lin(nom, domeni, dialecte, parlar, transicio, nota, font):
    f = itnom[nom]
    p = f['properties']
    regio = 'Toscana' if p['codi'] == 'it:049005' else 'Sardegna'
    it_linhas[p['codi']] = [regio, p['provincia'], 'comune_it', nom, '', p['codi'], domeni, dialecte, parlar, transicio, 0, nota, font]


for n in GALL:
    it_lin(n, 'cors', 'gadduresu', '', '', ('variante locale : %s (it.wiki)' % NOTA_GALL[n]) if n in NOTA_GALL else '', 'WGAL LR97 LR18 J06 ISTAT')
it_lin('La Maddalena', 'cors', 'gadduresu', 'isulanu', '',
       'isulanu : variété du gallurais pour la loi (LR 22/2018, art. 8) ; corse du Sud (comme Sartène) pour la dialectologie (it.wiki, fr.wiki ; carte J : oltramontano sartenese)',
       'LR18 WGAL WFR J06 ISTAT')
for n in ('Olbia', 'Golfo Aranci'):
    it_lin(n, 'cors', 'gadduresu', '', 'sc',
           ('ville historiquement de langue sarde (logudorais), gallurais répandu dans les campagnes depuis le XIXe s. (it.wiki, co.wiki) ; 39,9 %% de locuteurs actifs du gallurais, 44,6 %% du sarde (Oppo 2007)' if n == 'Olbia'
            else 'une grande partie du territoire de langue sarde (logudorais), gallurais dans les campagnes (it.wiki, co.wiki)'),
           'WGAL J06 ISTAT')
for n in CAST:
    it_lin(n, 'cors', 'gadduresu', 'castiddanesu', 'sas',
           'castellanese%s : variété du gallurais pour la loi (LR 22/2018), parler de passage entre gallurais et sassarais (it.wiki)' % (' (sedinese)' if n == 'Sedini' else ''),
           'LR18 WGAL WSAS J06 ISTAT')
it_lin('Valledoria', 'cors', 'gadduresu', '', 'sas',
       'gallurais (agghjesu au centre, Codaruina) et castellanese aux hameaux de La Muddizza et La Ciaccia (it.wiki)', 'WGAL J06 ISTAT')
for n in SASS:
    it_lin(n, 'cors', 'sassaresu', '', '',
           'sassarese de la ville' if n == 'Sassari' else 'variété « provinciale » du sassarese (it.wiki)', 'WSAS LR97 LR18 J06 ISTAT')
for n in PARCIAL:
    it_lin(n, 'vesina', '', '', 'gal', 'commune de langue sarde (logudorais) ; gallurais sur une partie du territoire (it.wiki, co.wiki)', 'WGAL ISTAT')
it_lin('Luras', 'vesina', '', '', '',
       'enclave de langue sarde (logudorais) entourée de communes galluraises (it.wiki « isola linguistica » ; point gris de J)', 'WGAL J06 ISTAT')
it_lin('Capraia Isola', 'desaparegut', 'cismuntincu', 'capraiese', '',
       'parler corse de l’île, éteint au XXe siècle (fr.wiki, it.wiki) ; autrefois rattaché à la zone du Cap Corse (Retali-Medori 2024, contrôle) ; carte J : capraiese',
       'WFR WIT J06 ISTAT')
# voisines de langue sarde (ou catalane) pour fermer la zone
dom = [cd for cd, l in it_linhas.items() if l[6] == 'cors']
geoms = {f['properties']['codi']: ogr.CreateGeometryFromJson(json.dumps(f['geometry'])) for f in it['features']}
for f in it['features']:
    cd = f['properties']['codi']
    if cd in it_linhas or cd == 'it:049005':
        continue
    if any(geoms[cd].Intersects(geoms[d]) for d in dom):
        nota = 'catalan (l’Alguer), voir SIG/catalan' if f['properties']['nom'] == 'Alghero' else 'commune voisine de langue sarde (logudorais)'
        if f['properties']['nom'] == 'Sennori':
            nota += ' ; sarde influencé par le sassarese (it.wiki)'
        it_lin(f['properties']['nom'], 'vesina', '', '', '', nota, 'ISTAT')
for cd in sorted(it_linhas):
    linhas.append(it_linhas[cd])

# ---------------------------------------------------------------- noms locaux
dc = {}
for r in csv.DictReader(open(os.path.join(NOMS, 'dc-communes-noms.csv'), encoding='utf-8'), delimiter=';'):
    dc.setdefault(r['insee'], []).append(r)
wd = {}
for r in csv.DictReader(open(os.path.join(NOMS, 'wd-co.csv'), encoding='utf-8')):
    if r['nom'] or r['lab']:
        wd[r['insee']] = r
osm = {r['ref:INSEE']: r for r in csv.DictReader(open(os.path.join(NOMS, 'osm-co.csv'), encoding='utf-8'), delimiter=';')}
wds = {r['it']: r for r in csv.DictReader(open(os.path.join(NOMS, 'wd-sardegna.csv'), encoding='utf-8'))}
# it.wiki « Lingua sassarese », Toponimi
SASS_TOP = {'Castelsardo': 'Castheddu sardhu', 'Porto Torres': 'Porthu Torra', 'Sedini': 'Séddini', 'Sorso': 'Sossu',
            'Stintino': 'Isthintini', 'Tergu': 'Zélgu', 'Sassari': 'Sassari'}


def sens_par(s):
    return re.sub(r'\s*\([^)]*\)$', '', s or '').strip()


noms = []
estat = {'acord3': 0, 'acord2': 0, 'desacord': 0}
for l in linhas:
    nomo, cd = l[3], l[5]
    if not cd.startswith('it:'):
        rows = dc.get(cd, [])
        r = next((x for x in rows if norm(x['nom_francais']) == norm(nomo)), None)
        if r is None and len(rows) == 1:
            r = rows[0]
        ctc = r['nom_corse'] if r else ''
        w = wd.get(cd, {})
        art, lab = sens_par(w.get('nom', '')), w.get('lab', '')
        o = (osm.get(cd) or {}).get('name:co', '')
        autres = [v for v in (art, lab, o) if v]
        n_ac = sum(1 for v in autres if v == ctc)
        nota = []
        def sens_art(s):
            return re.sub(r"^(u|a|i|e|l|lu|la|li|le) ", '', norm(s))
        if ctc and autres and n_ac == 0 and any(sens_art(v) == sens_art(ctc) for v in autres):
            nota.append('même forme ailleurs à l’article ou aux accents près')
            estat['article_accent'] = estat.get('article_accent', 0) + 1
        elif ctc and autres and n_ac == 0:
            nota.append('aucune autre source ne donne la forme de la Collectivité')
            estat['desacord'] += 1
        elif n_ac >= 2:
            estat['acord3'] += 1
        elif n_ac == 1:
            estat['acord2'] += 1
        else:
            estat['sol'] = estat.get('sol', 0) + 1
        if not r:
            nota.append('absent de la liste de la Collectivité')
        nloc = ctc or art or lab
        noms.append([cd, nomo, nloc, 'CTC' if ctc else ('WD' if nloc else ''), ctc, art, lab, o, ' ; '.join(nota)])
        l[4] = nloc
    else:
        w = wds.get(nomo, {})
        art, lab = sens_par(w.get('cowiki', '')), w.get('co', '')
        top = SASS_TOP.get(nomo, '')
        nloc, src, nota = '', '', []
        if l[6] in ('cors', 'desaparegut'):
            if nomo == 'Capraia Isola':
                nloc, src = 'Capraia Isula', 'WD'
            elif l[7] == 'sassaresu' or (nomo in ('Sedini', 'Tergu') and not art):
                nloc, src = top or art, 'WSAS' if top else 'WD'
                if nomo in ('Sedini', 'Tergu'):
                    nota.append('pas d’article co.wiki ; forme sassarese donnée par it.wiki (« Lingua sassarese », Toponimi)')
            elif nomo == 'San Teodoro':
                nloc, src = 'Santu Tiadoru', 'COWIKI-TXT'
                nota.append('pas d’article co.wiki ; forme du lien dans l’article co.wiki « Gadduresu » (liste des communes)')
            elif nomo == 'Olbia':
                nloc, src = lab, 'WD'
                nota.append('titre co.wiki « Olbia » ; « Tarranoa » : libellé co de Wikidata et texte de co.wiki')
            else:
                nloc, src = art or lab, 'WD' if (art or lab) else ''
            if art and lab and art != lab and nomo != 'Olbia':
                nota.append('libellé co de Wikidata : %s' % lab)
            if top and top != nloc:
                nota.append('forme sassarese (it.wiki) : %s' % top)
            if art and nloc != art and nomo not in ('Olbia',):
                nota.append('titre co.wiki : %s' % art)
            if not nloc:
                nloc = ''
                nota.append('pas de nom local dans une source ouverte')
        else:
            continue  # commune voisine (sarde, catalane) : nom local non recherché
        noms.append([cd, nomo, nloc, src, '', art, lab, '', ' ; '.join(nota)])
        l[4] = nloc

ENT = ['regio', 'unitat', 'mena', 'nom_oficial', 'nom_local', 'codi', 'domeni', 'dialecte', 'parlar', 'transicio', 'part_oc', 'nota', 'font']
with open(os.path.join(SIG, 'cors', 'dialectes-cors.csv'), 'w', encoding='utf-8-sig', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(ENT)
    w.writerows(linhas)
with open(os.path.join(SIG, 'cors', 'noms-locals.csv'), 'w', encoding='utf-8-sig', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['codi', 'nom_oficial', 'nom_local', 'font_retenguda', 'collectivite_corse', 'cowiki_titol', 'wikidata_co', 'osm_name_co', 'nota'])
    w.writerows(noms)
# géométries italiennes des communes classées
feats = []
for f in it['features']:
    cd = f['properties']['codi']
    if cd in it_linhas:
        l = it_linhas[cd]
        p = dict(f['properties'])
        p.update({'domeni': l[6], 'dialecte': l[7], 'parlar': l[8], 'transicio': l[9], 'nom_local': l[4]})
        feats.append({'type': 'Feature', 'properties': p, 'geometry': f['geometry']})
sortida = os.path.join(SIG, 'brut', 'cors', 'comuni-it-cors.geojson')
with open(sortida, 'w', encoding='utf-8') as fo:
    json.dump({'type': 'FeatureCollection', 'font': it['font'], 'features': feats}, fo, ensure_ascii=False, separators=(',', ':'))

print('Corse : %d communes' % len(comunas))
for kv in sorted(stats.items()):
    print('  %-14s %-12s %3d' % (kv[0][0] or '-', kv[0][1] or '-', kv[1]))
cnt = {}
for l in linhas:
    if l[0] != 'Corsica':
        cnt[(l[6], l[7], l[9])] = cnt.get((l[6], l[7], l[9]), 0) + 1
print('Italie : %d communes' % len(it_linhas))
for kv in sorted(cnt.items()):
    print('  %-12s %-12s %-4s %3d' % (kv[0][0], kv[0][1] or '-', kv[0][2] or '-', kv[1]))
print('Noms corses (Corse) : %s' % estat)
print('%s (%d communes, %.1f Mo)' % (sortida, len(feats), os.path.getsize(sortida) / 1e6))
