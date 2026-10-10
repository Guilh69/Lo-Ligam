# Taula del flamenc e del contunh neerlandés (Païses Basses, Flandres,
# Brussèlas, Westhoek francés) : una linha per comuna, al format de
# SIG/basc/dialectes-basc.csv. Assembla los resultats de :
#   flamenc-carta-daan.py     (dialèctes, Daan e Blok 1969 d'aprèp Jeroen 2008)
#   flamenc-carta-treehill.py (parlars del brabançon e del limborgés, contraròtle)
#   flamenc-carta-vanneste.py (Flandres francesa : 1856, 1900, 1932, 1971)
#   flamenc-wikidata.mjs      (noms locals)
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/flamenc-taula.py
#
# Sortidas : SIG/flamenc/dialectes-flamenc.csv, dialectes-flamenc.json,
# noms-locals.csv, westhoek-istoric.csv.
import csv, json, os, re
from osgeo import ogr

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
B = os.path.join(R, 'SIG', 'brut', 'flamenc')
OUT = os.path.join(R, 'SIG', 'flamenc')
os.makedirs(OUT, exist_ok=True)


def lcsv(p):
    return list(csv.DictReader(open(p, encoding='utf-8-sig'), delimiter=';'))


def titol(t):
    """Títol d'article -> nom local : sens l'esclariment entre parentèsis."""
    return re.sub(r'\s*\([^)]*\)\s*$', '', t or '').strip()


# --- Wikidata
wd = {}
for pais in ('be', 'nl', 'fr'):
    for r in lcsv(os.path.join(B, 'wd-%s.csv' % pais)):
        k = ('be:' if pais == 'be' else 'nl:GM' if pais == 'nl' else '') + r['codi']
        if k in wd and int(r['pop'] or 0) < int(wd[k]['pop'] or 0):
            continue  # 71072 : Hasselt e (per error) Hoeselt ; se garda lo pus poblat
        wd[k] = r
prov_nl = {r['item']: r['provincia'] for r in lcsv(os.path.join(B, 'wd-nl-provincias.csv'))}
PROV_BE = [('21', 'Bruxelles-Capitale / Brussels Hoofdstedelijk Gewest'), ('23', 'Vlaams-Brabant'), ('24', 'Vlaams-Brabant'),
           ('25', 'Brabant wallon'), ('1', 'Antwerpen'), ('3', 'West-Vlaanderen'), ('4', 'Oost-Vlaanderen'),
           ('5', 'Hainaut'), ('6', 'Liège'), ('7', 'Limburg'), ('8', 'Luxembourg'), ('9', 'Namur')]


def prov_be(nis):
    for p, n in PROV_BE:
        if nis.startswith(p):
            return n


# --- cartas
daan = {r['codi']: r for r in lcsv(os.path.join(B, 'daan-comunas.csv'))}
tree = {r['codi']: r for r in lcsv(os.path.join(B, 'treehill-comunas.csv'))}
ZD = {  # zòna de la carta de Daan -> (domeni, dialècte, parlar)
    '1': ('neerlandes', 'flamenc_occidental', 'west-vlaams en zeeuws-vlaams'),
    '2': ('neerlandes', 'zelandes', 'zeeuws'),
    '3': ('neerlandes', 'olandes', 'zuid-hollands'),
    '4': ('neerlandes', 'olandes', 'westhoeks'),
    '5': ('neerlandes', 'olandes', 'waterlands en volendams'),
    '6': ('neerlandes', 'olandes', 'zaans'),
    '7': ('neerlandes', 'olandes', 'kennemerlands'),
    '8': ('neerlandes', 'olandes', 'west-fries'),
    '9': ('neerlandes', 'olandes', 'bildts, midslands, stadsfries, amelands'),
    '10': ('bassaxon', 'gronings', 'kollumerlands'),
    '11': ('bassaxon', 'gronings', 'gronings en noord-drents'),
    '12': ('bassaxon', 'stellingwerfs', 'stellingwerfs'),
    '13': ('bassaxon', 'drents', 'midden-drents'),
    '14': ('bassaxon', 'drents', 'zuid-drents'),
    '15': ('bassaxon', 'twents', 'twents'),
    '16': ('bassaxon', 'twents', 'twents-graafschaps'),
    '17': ('bassaxon', 'gelders_overijssels', 'gelders-overijssels'),
    '18': ('bassaxon', 'veluws', 'veluws'),
    'FL': ('neerlandes', '', 'flevoland'),
    '19': ('neerlandes', 'utrechtes', 'utrechts-alblasserwaards'),
    '20': ('neerlandes', 'zuid_gelders', 'zuid-gelders'),
    '21': ('neerlandes', 'brabancon', 'noord-brabants en noord-limburgs'),
    '22': ('neerlandes', 'brabancon', 'brabants'),
    '23': ('neerlandes', 'flamenc_oriental', 'oost-vlaams'),
    '24': ('neerlandes', 'limborgues', 'limburgs'),
}
TH = {  # classa de Treehill -> (dialècte de Daan correspondent, parlar)
    'fo': ('flamenc_occidental', 'flamand occidental'), 'fe': ('flamenc_oriental', 'flamand oriental'),
    'zel': ('zelandes', 'zélandais'), 'vho': ('olandes', 'vieil hollandais'), 'hn': ('olandes', 'hollandais du nord'),
    'hs': ('olandes', 'hollandais du sud'), 'hl': ('olandes', 'hollandais du littoral'), 'flev': ('', 'flevisch'),
    'utr': ('utrechtes', 'utrechtois'), 'vel': ('veluws', 'veluwsch'), 'fri': ('frison', 'frison'),
    'friu': ('olandes', 'frison urbain'), 'gro': ('gronings', 'groningois'), 'ste': ('stellingwerfs', 'stellingwerfsch'),
    'dre': ('drents', 'drenthois'), 'gov': ('gelders_overijssels', "gueldrois d'Overijssel"),
    'mgu': ('zuid_gelders', 'moyen gueldrois'), 'urk': ('gelders_overijssels', 'urkois'),
    'bocc': ('brabancon', 'brabançon occidental'), 'bor': ('brabancon', 'brabançon oriental'),
    'banv': ('brabancon', 'brabançon anversois'), 'bals': ('brabancon', 'brabançon alostois'),
    'blou': ('brabancon', 'brabançon de Louvain'), 'locc': ('limborgues', 'limbourgeois occidental'),
    'lsep': ('limborgues', 'limbourgeois septentrional'), 'lmer': ('limborgues', 'limbourgeois méridional'),
    'lori': ('limborgues', 'limbourgeois oriental'), 'lgue': ('limborgues', 'limbourgeois gueldrois')}
WIKI = {'flamenc_occidental': 'vls', 'zelandes': 'zea', 'limborgues': 'li', 'frison': 'fy'}
FRISA = {'Achtkarspelen', 'Ameland', 'Dantumadiel', 'De Fryske Marren', 'Harlingen', 'Heerenveen', 'Leeuwarden',
         'Noardeast-Fryslân', 'Ooststellingwerf', 'Opsterland', 'Schiermonnikoog', 'Smallingerland',
         'Súdwest-Fryslân', 'Terschelling', 'Tytsjerksteradiel', 'Vlieland', 'Waadhoeke', 'Weststellingwerf'}
FACILITATS = {'23098': 'Drogenbos', '23099': 'Kraainem', '23100': 'Linkebeek', '23101': 'Sint-Genesius-Rode',
              '23102': 'Wemmel', '23103': 'Wezembeek-Oppem'}  # verificats sus Wikidata (wd-be.csv)

linhas, noms = [], []


def nom_local(codi, dial, pais):
    r = wd.get(codi, {})
    w = WIKI.get(dial)
    if dial in ('gronings', 'stellingwerfs', 'drents', 'twents', 'gelders_overijssels', 'veluws'):
        w = 'nds-nl'
    if pais == 'NL' and dial == 'flamenc_occidental':
        w = 'zea'  # Flandres zelandesa : la Wikipèdia zelandesa
    if not w:
        return '', ''
    t = r.get('wp_' + w, '')
    return titol(t), (w if t else '')


def ajustar(l):
    linhas.append(l)
    if l['nom_local']:
        noms.append({'codi': l['codi'], 'nom_oficial': l['nom_oficial'], 'nom_local': l['nom_local'],
                     'wikipedia': l['_wiki'], 'titol': wd.get(l['codi'], {}).get('wp_' + l['_wiki'], ''),
                     'wikidata': wd.get(l['codi'], {}).get('item', '')})


# --- Païses Basses e Flandres + Brussèlas
for codi, d in daan.items():
    t = tree.get(codi, {})
    r = wd.get(codi, {})
    pais = 'NL' if codi.startswith('nl:') else 'BE'
    nis = codi[3:]
    z, part, z2, part2, defo = d['zona'], float(d['part'] or 0), d['zona2'], float(d['part2'] or 0), float(d['defora'])
    nl0 = r.get('nl') or titol(r.get('wp_nl'))
    fr0 = r.get('fr') or titol(r.get('wp_fr'))
    nom = d['nom_oficial'] if pais == 'NL' else (nl0 if not nis.startswith('21') else '%s / %s' % (fr0, nl0))
    nota, font, transicio = [], ['DB69'], ''
    dom, dial, parlar = ZD.get(z, ('', '', ''))
    if pais == 'NL':
        unitat, regio = prov_nl.get(r.get('item'), ''), 'Nederland'
    else:
        unitat, regio = prov_be(nis), ('Brussel' if nis.startswith('21') else 'Vlaanderen')
    # la Frisa : blanca sus la carta de Daan (frison), levat las zònas de color
    if pais == 'NL' and d['nom_oficial'] in FRISA and defo > 0.5 and d['nom_oficial'] not in ('Ooststellingwerf', 'Weststellingwerf'):
        dom, dial, parlar = 'frison', 'frison', ''
        font.append('DB69-blanc')
        if z in ('9', '10') and part > 0:
            sh = 1 - defo
            if sh >= 0.2:
                transicio = 'olandes' if z == '9' else 'bassaxon'
            nota.append('Daan : %d %% de la comuna en zòna %s (%s)%s' % (round(100 * sh), z, ZD[z][2],
                        '' if sh >= 0.2 else ', vila o vilatge sol (ronds de la carta)'))
    # casses particulars, a validar
    MAN = {
        'Texel': ('neerlandes', 'olandes', 'west-fries', 'illa : sageta de Daan cap al nòrd de l\'Olanda (zòna 8)'),
        'Vlieland': ('neerlandes', 'olandes', 'west-fries', 'illa : sageta de Daan cap a Texel ; Treehill : « flevisch »'),
        'Terschelling': ('neerlandes', 'olandes', 'bildts, midslands, stadsfries, amelands', 'Daan zòna 9 (midslands) ; los vilatges de l\'èst parlan frison (aasters), non cartografiat'),
        'Ameland': ('neerlandes', 'olandes', 'bildts, midslands, stadsfries, amelands', 'Daan zòna 9 (amelands)'),
        'Schiermonnikoog': ('frison', 'frison', '', 'illa ; frison de Schiermonnikoog (Treehill : frison)'),
        'Urk': ('bassaxon', 'gelders_overijssels', 'urkers', 'Daan : zòna 17 « Gelders-Overijssels en Urkers » ; Treehill : « urkois » a part'),
        'Voeren': ('neerlandes', 'limborgues', 'oost-limburgs (platdiets)', 'enclau defòra la carta de Daan ; Treehill : limbourgeois oriental'),
        'Herstappe': ('neerlandes', 'limborgues', 'limburgs', 'tròp pichona per la carta de Daan : zòna 24 tot a l\'entorn'),
    }
    if nom in MAN or d['nom_oficial'] in MAN:
        k = nom if nom in MAN else d['nom_oficial']
        dom, dial, parlar, nn = MAN[k]
        nota.append(nn)
        font.append('man')
        transicio = transicio if k in ('Terschelling',) else ''
        if k == 'Terschelling':
            transicio = 'frison'
    # transicion : segonda zòna d'un autre dialècte, 25 % o mai
    if not transicio and z2 and part2 >= 0.25 and ZD.get(z2, ('', '', ''))[1] != dial and dom != 'frison':
        transicio = ZD[z2][1] or 'flevoland'
        nota.append('Daan : %d %% %s, %d %% %s' % (round(100 * part), ZD.get(z, ('', '', z))[2], round(100 * part2), ZD[z2][2]))
    # Treehill : parlar del brabançon e del limborgés ; desacòrds notats
    tz = t.get('zona', '')
    if tz and 'man' not in font:
        tdial, tparl = TH.get(tz, ('', tz))
        if tdial == dial and dial in ('brabancon', 'limborgues', 'flamenc_oriental', 'flamenc_occidental', 'zelandes'):
            if dial in ('brabancon', 'limborgues'):
                parlar = tparl
                font.append('TH22')
        elif tdial and tdial != dial and float(t.get('part') or 0) >= 0.5:
            nota.append('Treehill : %s (%d %%)' % (tparl, round(100 * float(t['part']))))
            font.append('TH22')
    if pais == 'NL' and dial == 'flamenc_occidental':
        parlar = 'zeeuws-vlaams'
        if tz in ('zel', 'fe') and not any(n.startswith('Treehill') for n in nota):
            nota.append('Treehill : %s' % TH[tz][1])
    elif pais == 'BE' and dial == 'flamenc_occidental':
        parlar = 'west-vlaams'
    if pais == 'NL' and d['nom_oficial'] in ('Kerkrade', 'Simpelveld', 'Vaals'):
        transicio = 'ripuari'
        nota.append('kerkraads, bocholtzer, vaalser : dialèctes ripuaris segon la Wikipèdia neerlandesa (« Nederlandse dialecten »), fòra del limborgés')
        font.append('WPNL')
    if nis.startswith('21') and pais == 'BE':
        parlar, transicio = 'brussels', 'fr'
        nota.append('Region de Brussèlas-Capitala, bilingüe ; francés majoritari, brabançon (brussels) istoric')
        font.append('LEG')
    if pais == 'BE' and nis in FACILITATS:
        nota.append('comuna amb facilitats pels francofòns')
        font.append('LEG')
    if part and part < 0.6 and dial:
        nota.append('incert : %d %% sola dins la zòna de Daan' % round(100 * part))
    nl_, wiki = nom_local(codi, dial, pais)
    ajustar({'regio': regio, 'unitat': unitat or '', 'mena': 'comuna_' + pais.lower(), 'nom_oficial': nom,
             'nom_local': nl_, 'codi': codi, 'domeni': dom, 'dialecte': dial, 'parlar': parlar,
             'transicio': transicio, 'part_oc': 0, 'nota': ' ; '.join(nota), 'font': ' '.join(dict.fromkeys(font)),
             '_wiki': wiki})

# --- França : Westhoek (Vanneste 1972, Brunot 1927)
van = {r['codi']: r for r in lcsv(os.path.join(B, 'vanneste-comunas.csv'))}


def cl4(r, an):
    """Classa d'una comuna sus una carta de Vanneste (flamenc-carta-vanneste.py) :
    h = corsas orizontalas (crosilhat, eentalig Frans, F1), v = corsas verticalas
    (regas, tweetalig Frans, F2), p = ponchs (tweetalig Vlaams, V2), lo demai
    blanc (eentalig Vlaams, V1). Sulhets causits sus 21 comunas regardadas a
    l'uèlh. Torna (classa, incertitud)."""
    x = {k: (float(r[an + '_' + k]) if r.get(an + '_' + k) not in (None, '') else None) for k in 'dvhp'}
    if x['d'] is None:
        return '', False
    v, h, p = x['v'], x['h'], x['p']
    if an == '1900':  # Kurth : doas classas (crosilhat o blanc)
        return ('F1' if h >= 0.12 else 'V1'), 0.07 <= h < 0.17
    if an == '1971':  # pas de blanc : crosilhat, regas, ponchs
        c = 'F1' if h >= 0.12 else 'V2' if p >= 0.05 else 'F2'
        return c, (0.07 <= h < 0.17) or (0.03 <= p < 0.07)
    if h >= 0.12:
        return 'F1', h < 0.17
    if v >= 0.15:
        return 'F2', h >= 0.07 or v < 0.2
    if p >= 0.07:
        return 'V2', p < 0.1
    return 'V1', p >= 0.04


VISUAL = {('Craywick', '1856'): 'F2'}  # lectura a l'uèlh (regas verticalas ; lo crosilhat vesin de Saint-Georges contamina)


# Vanneste 1972, part 1 (enquèsta de 1971) : lo tèxte classa la màger part de las comunas
T71 = {}
for n in ("Téteghem", "Cappelle-la-Grande", "Saint-Georges-sur-l'Aa", "Bourbourg", "Dunkerque", "Coudekerque-Branche",
          "Saint-Pol-sur-Mer", "Grande-Synthe", "Mardyck", "Loon-Plage", "Gravelines", "Craywick", "Bray-Dunes",
          "Zuydcoote", "Leffrinckoucke", "Haverskerque", "Estaires", "Nieppe", "Le Doulieu", "Thiennes", "Merville",
          "Neuf-Berquin", "La Gorgue", "Steenwerck", "Boëseghem", "Watten", "Renescure", "Clairmarais", "Saint-Momelin",
          "Holque", "Saint-Pierre-Brouck", "Ebblinghem", "Blaringhem", "Vieux-Berquin"):
    T71[n] = 'F1'
for n in ("Cassel", "Oxelaëre", "Wallon-Cappel", "Hazebrouck", "Morbecque", "Steenvoorde", "Eecke", "Bavinchove", "Staple",
          "Lynde", "Borre", "Terdeghem", "Sercus", "Hondeghem", "Hondschoote", "Pitgam", "Bollezeele", "Steene",
          "Armbouts-Cappel", "Spycker", "Brouckerque", "Drincham", "Looberghe", "Cappelle-Brouck", "Merckeghem", "Millam",
          "Socx", "Crochte", "Bierne", "Coudekerque-Village", "Wulverdinghe"):
    T71[n] = 'F2'
for n in ("Caëstre", "Saint-Sylvestre-Cappel", "Sainte-Marie-Cappel", "Wemaers-Cappel", "Hardifort", "Warhem", "Killem",
          "Quaëdypre", "Bissezeele", "Zegerscappel", "Rubrouck", "Zermezeele", "Oudezeele", "Wylder", "West-Cappel",
          "Boeschepe", "Bailleul", "Saint-Jans-Cappel", "Steenbecque", "Noordpeene", "Lederzeele", "Broxeele",
          "Volckerinckhove", "Ochtezeele", "Zuytpeene", "Les Moëres", "Oost-Cappel", "Houtkerque", "Hoymille", "Ghyvelde",
          "Uxem", "Rexpoëde", "Bambecque", "Herzeele", "Winnezeele", "Flêtre", "Méteren", "Godewaersvelde", "Berthen"):
    T71[n] = 'V2'
for n in ("Esquelbecq", "Wormhout", "Ledringhem", "Arnèke", "Eringhem", "Bergues"):
    T71[n] = '50'  # « moeilijk te bepalen » (40-60 %)
P71 = {'Arnèke': 39, 'Bailleul': 55, 'Bergues': 50, 'Berthen': 76, 'Boeschepe': 54, 'Bollezeele': 28, 'Bourbourg': 5,
       'Cappelle-la-Grande': 4, 'Cassel': 20, 'Eecke': 29, 'Eringhem': 50, 'Esquelbecq': 50, 'Estaires': 0, 'Flêtre': 80,
       'Godewaersvelde': 76, 'Haverskerque': 0, 'Hazebrouck': 10, 'Hondschoote': 33, 'Houtkerque': 84, 'Hoymille': 82,
       'Lederzeele': 85, 'Le Doulieu': 1, 'Ledringhem': 52, 'Méteren': 72, 'Les Moëres': 77, 'Morbecque': 22, 'Nieppe': 0,
       'Noordpeene': 60, 'Oost-Cappel': 80, 'Oxelaëre': 18, 'Pitgam': 20, 'Renescure': 0, "Saint-Georges-sur-l'Aa": 0,
       'Steenbecque': 53, 'Steenvoorde': 23, 'Téteghem': 13, 'Vieux-Berquin': 18, 'Wallon-Cappel': 22, 'Watten': 3,
       'Wormhout': 50}
# Brunot, HLF IX (1927), d'aprèp l'enquèsta de Coquebert de Montbret (1806)
FR1806 = {'Gravelines', 'Loon-Plage', 'Mardyck', 'Blaringhem', 'Boëseghem', 'Thiennes', 'Haverskerque', 'Merville',
          'La Gorgue', 'Estaires', 'Neuf-Berquin', 'Steenwerck', 'Nieppe', 'Grand-Fort-Philippe'}
MIXT1806 = {'Holque', 'Saint-Momelin'}
NOMS_FR = {'59588': 'Téteghem', '59154': 'Coudekerque-Village', '59404': 'Les Moëres', '59540': 'Saint-Pol-sur-Mer',
           '59380': 'Mardyck', '59248': 'Fort-Mardyck'}
fr_geo = json.load(open(os.path.join(B, 'fr-westhoek-comunas.geojson'), encoding='utf-8'))['features']
fr_p = {f['properties']['codi']: f for f in fr_geo}
# cantons de 2013 de la carta dels Archius nacionals (contraròtle)
an = ogr.Open(os.path.join(R, 'SIG', 'brut', 'oil', 'an-cantons-2013.geojson'))
anl = an.GetLayer(0)


def canton_an(geom):
    pt = geom.PointOnSurface()
    anl.SetSpatialFilter(pt)
    for f in anl:
        return f.GetField('CANTON'), f.GetField('N° ZONE')
    return '', ''


ISTORIC = {  # localitats flamencas al sègle XIX, defòra la carta de 1856 (còdis verificats sus l'IGN)
    '59656': ('Wervicq-Sud', "flamand en 1806, seule commune flamande de l'arrondissement de Lille (Brunot 1927)"),
    '62765': ('Saint-Omer', 'faubourgs du Haut-Pont et de Lyzel flamands en 1807 et 1845 ; 75 % des maraîchers parlent flamand en 1911 (Doncker 2022)'),
    '62225': ('Clairmarais', 'flamand en 1807 et 1845'),
    '62730': ('Ruminghem', 'flamand en 1807 et 1845'),
    '62748': ('Saint-Folquin', 'flamand en 1845'),
    '62766': ('Saint-Omer-Capelle', 'flamand en 1845'),
    '62645': ('Oye-Plage', 'flamand en 1845'),
    '62852': ('Vieille-Église', 'flamand en 1845'),
}
ist = []
cods = [c for c, f in fr_p.items() if f['properties']['arrondissement'] == '594'] + [c for c in ISTORIC if c in fr_p]
for c in cods:
    if c in NOMS_FR and c not in ('59588',):
        continue  # comunas associadas : dins la nota de la comuna
    f = fr_p[c]
    p = f['properties']
    nom = p['nom_oficial']
    g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
    cant, zona_an = canton_an(g)
    v = van.get(c)
    st = {}
    inc = []
    for an_ in ('1856', '1900', '1932', '1971'):
        if v:
            k, i = cl4(v, an_)
            if (nom, an_) in VISUAL:
                k, i = VISUAL[(nom, an_)], False
            st[an_] = k
            if i:
                inc.append(an_)
    nom71 = NOMS_FR.get(c, nom)
    if c == '59588':
        nom71 = 'Téteghem'
    t71 = T71.get(nom71)
    s71 = t71 if t71 and t71 != '50' else st.get('1971', '')
    if t71 == '50':
        s71 = '≈50 % (' + st.get('1971', '') + ')'
    pc71 = P71.get(nom71)
    s06 = 'FR' if nom in FR1806 else 'mixt' if nom in MIXT1806 else ('FL' if p['arrondissement'] == '594' else '')
    if c == '59656':
        s06 = 'FL'
    c56 = st.get('1856', '')
    nota, font, transicio, dom = [], ['VAN72'], '', ''
    if c in ISTORIC and c not in ('62225',):
        dom, transicio = 'exclos', 'istoric'
        nota.append(ISTORIC[c][1])
        font = ['BRU27' if c == '59656' else 'CFF57']
    elif c56.startswith('V'):
        dom = 'neerlandes'
    elif c56 == 'F2':
        dom, transicio = 'neerlandes', 'pcd'
        nota.append('bilingue, français majoritaire en 1856 (Bocave)')
    elif c56 == 'F1':
        if s06 == 'FR' or s06 == '':
            dom = 'exclos'
            nota.append('unilingue français en 1856 (Bocave)' + (' et en 1806 (Brunot)' if s06 == 'FR' else ''))
        else:
            dom, transicio = 'neerlandes', 'pcd'
            nota.append('flamand en 1806 (Brunot), unilingue français en 1856 (Bocave)')
            font.append('BRU27')
    if c == '62225':
        nota.append(ISTORIC[c][1])
        font.append('CFF57')
    if c == '59183':
        nota.append('comprend Malo-les-Bains, Rosendaël, Petite-Synthe (fusionnées vers 1970), Saint-Pol-sur-Mer, Mardyck et Fort-Mardyck (associées) ; Mardyck français en 1806 (Brunot)')
    if c == '59588':
        nota.append('Téteghem et Coudekerque-Village (fusion 2016) : 1971 Téteghem 13 %, Coudekerque-Village bilingue français')
    if c == '59260':
        nota.append('avec Les Moëres (associée, 1971 : 77 % de flamandophones)')
    if nom in MIXT1806:
        nota.append('français et flamand en 1806 (Brunot)')
        font.append('BRU27')
    if inc:
        nota.append('lecture de carte incertaine : ' + ', '.join(inc))
    hist = '1806 %s ; 1856 %s ; 1900 %s ; 1932 %s ; 1971 %s%s' % (s06 or '?', c56 or '?', st.get('1900', '?') or '?',
                                                                  st.get('1932', '?') or '?', s71 or '?',
                                                                  (' (%d %%)' % pc71) if pc71 is not None else '')
    nota.insert(0, hist)
    if zona_an:
        nota.append('AN 2013 : canton %s, zone %s' % (cant, zona_an))
    font.append('AN13')
    dial = 'flamenc_occidental' if dom == 'neerlandes' else ''
    parlar = 'frans-vlaams' if dom == 'neerlandes' else ''
    nl_ = titol(wd.get(c, {}).get('wp_vls', '')) if dom == 'neerlandes' or transicio == 'istoric' else ''
    l = {'regio': 'France', 'unitat': cant or ('Pas-de-Calais' if c.startswith('62') else 'Nord'),
         'mena': 'comuna_fr', 'nom_oficial': nom, 'nom_local': nl_, 'codi': c, 'domeni': dom, 'dialecte': dial,
         'parlar': parlar, 'transicio': transicio, 'part_oc': 0, 'nota': ' ; '.join(nota),
         'font': ' '.join(dict.fromkeys(font)), '_wiki': 'vls' if nl_ else ''}
    ajustar(l)
    if v:
        ist.append([c, nom, s06, c56, st.get('1900', ''), st.get('1932', ''), st.get('1971', ''), t71 or '', pc71 if pc71 is not None else '',
                    ','.join(inc), cant, zona_an] + [v.get(k, '') for k in v if k not in ('codi', 'nom_oficial')])
    else:
        ist.append([c, nom, s06, '', '', '', '', '', '', '', cant, zona_an])
# comunas associadas (Dunkerque, Téteghem…) : linhas de contraròtle dins westhoek-istoric.csv
for c in ('59154', '59404', '59540', '59380', '59248'):
    v = van.get(c)
    if v:
        st = {an_: cl4(v, an_)[0] for an_ in ('1856', '1900', '1932', '1971')}
        ist.append([c, NOMS_FR[c] + ' (associée)', 'FR' if NOMS_FR[c] == 'Mardyck' else 'FL', st['1856'], st['1900'], st['1932'],
                    st['1971'], T71.get(NOMS_FR[c], ''), P71.get(NOMS_FR[c], ''), '', '', ''] +
                   [v.get(k, '') for k in v if k not in ('codi', 'nom_oficial')])

COLS = ['regio', 'unitat', 'mena', 'nom_oficial', 'nom_local', 'codi', 'domeni', 'dialecte', 'parlar', 'transicio',
        'part_oc', 'nota', 'font']
ordre = {'France': 0, 'Vlaanderen': 1, 'Brussel': 2, 'Nederland': 3}
linhas.sort(key=lambda l: (ordre[l['regio']], l['unitat'], l['nom_oficial']))
with open(os.path.join(OUT, 'dialectes-flamenc.csv'), 'w', encoding='utf-8-sig', newline='') as fo:
    w = csv.DictWriter(fo, COLS, delimiter=';', extrasaction='ignore')
    w.writeheader()
    w.writerows(linhas)
with open(os.path.join(OUT, 'noms-locals.csv'), 'w', encoding='utf-8-sig', newline='') as fo:
    w = csv.DictWriter(fo, ['codi', 'nom_oficial', 'nom_local', 'wikipedia', 'titol', 'wikidata'], delimiter=';')
    w.writeheader()
    w.writerows(sorted(noms, key=lambda x: x['codi']))
with open(os.path.join(OUT, 'westhoek-istoric.csv'), 'w', encoding='utf-8-sig', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    vk = [k for k in next(iter(van.values())) if k not in ('codi', 'nom_oficial')]
    w.writerow(['insee', 'nom', '1806', '1856', '1900', '1932', '1971_carta', '1971_tèxte', '1971_pct', 'lectura_incerta',
                'canton_AN2013', 'zona_AN'] + vk)
    w.writerows(ist)
# recapitulatiu
from collections import Counter
cnt = Counter((l['regio'], l['domeni'], l['dialecte']) for l in linhas)
for k in sorted(cnt):
    print('%-12s %-12s %-22s %4d' % (k + (cnt[k],)))
print('transicions :', Counter((l['regio'], l['transicio']) for l in linhas if l['transicio']))
print('noms locals :', Counter(n['wikipedia'] for n in noms))
print('linhas :', len(linhas))


# --- JSON : dialèctes, zòna a part (França), transicions
def comunas_de(**k):
    return sorted(l['codi'] for l in linhas if all(l[a] == b for a, b in k.items()))


D = [  # kod, domeni, grope de Daan, endo (neerlandés), fr, oc (propausa), oc verificat (API lo Congrès, 2026-10-10)
    ('flamenc_occidental', 'neerlandes', 'A', 'West-Vlaams', 'flamand occidental', 'flamenc occidental', 'òc (flamenc, occidental)'),
    ('zelandes', 'neerlandes', 'A', 'Zeeuws', 'zélandais', 'zelandés', 'non (absent del Basic ; format sus olandés)'),
    ('olandes', 'neerlandes', 'B', 'Hollands', 'hollandais', 'olandés', 'òc (lengadocian)'),
    ('utrechtes', 'neerlandes', 'D', 'Utrechts-Alblasserwaards', 'utrechtois-alblasserwaardais', 'utrechtés', 'non'),
    ('zuid_gelders', 'neerlandes', 'E', 'Zuid-Gelders', 'gueldrois méridional', 'gueldrés meridional', 'non (meridional òc)'),
    ('brabancon', 'neerlandes', 'E', 'Brabants', 'brabançon', 'brabançon', 'non'),
    ('flamenc_oriental', 'neerlandes', 'E', 'Oost-Vlaams', 'flamand oriental', 'flamenc oriental', 'òc (flamenc, oriental)'),
    ('limborgues', 'neerlandes', 'F', 'Limburgs', 'limbourgeois', 'limborgés', 'non (format sus luxemborgés, verificat)'),
    ('gronings', 'bassaxon', 'C', 'Gronings (Grunnegs)', 'groningois', 'gronings', 'nom neerlandés gardat'),
    ('stellingwerfs', 'bassaxon', 'C', 'Stellingwerfs', 'stellingwerfois', 'stellingwerfs', 'nom neerlandés gardat'),
    ('drents', 'bassaxon', 'C', 'Drents', 'drenthois', 'drents', 'nom neerlandés gardat'),
    ('twents', 'bassaxon', 'C', 'Twents', 'twentois', 'twents', 'nom neerlandés gardat'),
    ('gelders_overijssels', 'bassaxon', 'C', 'Gelders-Overijssels (Achterhoeks, Sallands)', "gueldrois-overijsselois", 'gelders-overijssels', 'nom neerlandés gardat'),
    ('veluws', 'bassaxon', 'C', 'Veluws', 'veluwois', 'veluws', 'nom neerlandés gardat'),
    ('frison', 'frison', '', 'Frysk', 'frison occidental', 'frison', 'non (absent del Basic)'),
]
GROPES = {'A': ('Zuidwestelijke groep (Zeeuws/West-Vlaams)', 'groupe sud-occidental'),
          'B': ('Noordwestelijke groep (Hollands)', 'groupe nord-occidental'),
          'C': ('Noordoostelijke groep (Nedersaksisch)', 'groupe nord-oriental (bas-saxon)'),
          'D': ('Noordelijk-centrale groep', 'groupe central nord'),
          'E': ('Zuidelijk-centrale groep', 'groupe central sud'),
          'F': ('Zuidoostelijke groep (Limburgs)', 'groupe sud-oriental (limbourgeois)')}
DOMENIS = {'neerlandes': {'endo': 'Nederlands', 'fr': 'néerlandais', 'oc': 'neerlandés', 'oc_verificat': 'òc'},
           'bassaxon': {'endo': 'Nedersaksisch', 'fr': 'bas-saxon', 'oc': 'bas saxon', 'oc_verificat': 'bas òc, saxon absent del Basic'},
           'frison': {'endo': 'Frysk', 'fr': 'frison occidental', 'oc': 'frison', 'oc_verificat': 'non'}}
out = {
    'font': ("Flamenc e neerlandés : comunas CBS Wijk- en Buurtkaart 2025 (tèrra, PDOK), SPF Finanças "
             "INSPIRE 2025 (Belgica, còsta copada per OpenStreetMap, ODbL), IGN ADMIN EXPRESS COG CARTO 2026 ; dialèctes "
             "d'aprèp Jo Daan e D. P. Blok (1969) per la carta « Dutch-dialects.svg » (Jeroen, Wikimedia Commons, CC BY-SA 3.0), "
             "parlars del brabançon e del limborgés d'aprèp « Dutch dialects map - fr.svg » (Treehill, Wikimedia Commons, "
             "CC BY-SA 4.0) ; Flandres francesa : Alex Vanneste, Ons Erfdeel 15 (1972), cartas de 1856 (Bocave / de "
             "Coussemaker 1857), 1900 (Kurth), 1932 (Celen), 1971 ; Brunot, Histoire de la langue française IX (1927) ; "
             "noms locals : Wikidata (CC0), títols de las Wikipèdias vls, zea, li, nds-nl, fy"),
    'a_validar': ("noms occitans (oc) : propausas, la màger part absentas del Basic de lo Congrès (verificacion 2026-10-10, "
                  "camp oc_verificat) ; classament de las comunas a la termièra de dos dialèctes (camp nota, « incert ») ; "
                  "limit istoric del flamenc en França (1856) e tractament de Dunkerque"),
    'domenis': DOMENIS,
    'gropes': {k: {'endo': v[0], 'fr': v[1]} for k, v in GROPES.items()},
    'dialectes': [],
    'apart': {},
    'transicions': [],
}
for kod, dom, grp, endo, fr, oc, ver in D:
    parl = sorted({l['parlar'] for l in linhas if l['dialecte'] == kod and l['parlar']})
    out['dialectes'].append({
        'kod': kod, 'domeni': dom, 'grope_daan': grp, 'endo': endo, 'fr': fr, 'oc': oc, 'oc_verificat': ver,
        'comunas': sum(1 for l in linhas if l['dialecte'] == kod),
        'parlars': [{'kod': p, 'nom': p, 'font': 'Treehill' if p.startswith(('brabançon', 'limbourgeois')) else 'Daan',
                     'comunas': sum(1 for l in linhas if l['dialecte'] == kod and l['parlar'] == p)} for p in parl]})
out['apart'] = {
    'kod': 'frans_vlaams', 'domeni': 'neerlandes', 'dialecte': 'flamenc_occidental', 'endo': 'Frans-Vlaams',
    'fr': 'flamand de France (Westhoek)', 'oc': 'flamenc de França', 'oc_verificat': 'flamenc òc ; França absent del Basic',
    'nota': ("Lo flamenc occidental de França, separat de Belgica per la frontièra d'Estat : domeni = comunas flamencas en "
             "1856 (carta de Bocave, publicada per de Coussemaker en 1857, recopiada per Vanneste en 1972), amb las "
             "comunas bilingüas a majoritat francesa en 1856 e las comunas flamencas en 1806 vengudas francesas en 1856 "
             "(Dunkerque, Coudekerque-Branche…) en zòna de transicion. En 1971 (Vanneste) pas mai cap de comuna unilingüa "
             "flamenca."),
    'comunas': comunas_de(regio='France', domeni='neerlandes'),
}
out['transicions'] = [
    {'kod': 'pcd', 'fr': 'flamand / français (picard) : bilingue à majorité française en 1856, ou flamand en 1806 et français en 1856',
     'oc': 'flamenc / picard', 'comunas': comunas_de(regio='France', transicio='pcd')},
    {'kod': 'istoric', 'fr': 'flamand attesté au XIXe siècle (1806-1845), hors du domaine de 1856',
     'oc': 'flamenc istoric', 'comunas': comunas_de(regio='France', transicio='istoric')},
    {'kod': 'fr', 'fr': 'Bruxelles-Capitale : région bilingue, français majoritaire, brabançon (brussels) historique',
     'oc': 'Brussèlas, bilingüe', 'comunas': comunas_de(regio='Brussel')},
    {'kod': 'ripuari', 'fr': 'Kerkrade, Simpelveld, Vaals : dialectes ripuaires (allemands) dans le Limbourg néerlandais',
     'oc': 'ripuari', 'comunas': comunas_de(transicio='ripuari')},
    {'kod': 'dialecte', 'fr': "commune partagée entre deux zones de Daan (25 % ou plus dans la seconde) : le champ transicio donne le second dialecte",
     'oc': 'transicion entre dialèctes',
     'comunas': sorted(l['codi'] for l in linhas if l['transicio'] and l['transicio'] not in ('pcd', 'istoric', 'fr', 'ripuari'))},
]
json.dump(out, open(os.path.join(OUT, 'dialectes-flamenc.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent='\t')
print('JSON :', len(out['dialectes']), 'dialèctes ;', len(out['apart']['comunas']), 'comunas a part ;',
      [(t['kod'], len(t['comunas'])) for t in out['transicions']])
