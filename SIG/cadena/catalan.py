# Lo catalan sus la carta (demanda de Romain, 2026-10-08) : contorns dels
# dialèctes, fabricats a partir de las unitats administrativas (comarcas,
# municipalitats, illas, comunas de França) e del classament de
# SIG/catalan/dialectes-catalan.csv.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/catalan.py [tolerància en mètres, 300 per defaut]
#
# (2026-10-08, abans lo raccord : 300 m → 95 Ko, 25 Ko en gzip ; 450 m → 69 Ko ;
# los 60 Ko demandan environ 550 m.) Dura un minuta e mièja.
#
# Entradas : SIG/brut/catalan/geojson/ (contorns OSM e IGN, fabricats per
# catalan-brut.mjs), SIG/catalan/dialectes-catalan.csv e .json (classament),
# app/static/data/limits-carta.json (domeni occitan, pel rapòrt e per
# reconéisser las frontièras terrèstras), SIG/brut/mond/countries-50m.json
# (tèrra de Natural Earth, per destriar la còsta de las frontièras).
#
# Sortidas :
#  - app/static/data/catalan.json, FeatureCollection : un objècte per
#    dialècte (kod, ca, fr, oc, bloc, color, eti), puèi « catalunya-nord »
#    (la part de França, causida a despart, « Catalunya Nord » en catalan :
#    meteissa geometria que lo rossellonés), e a la raiç « domeni » =
#    { anels : anèls del domeni (exteriors, e los dos traucs d'enclavas
#    castelhanas, Asp e Montfort, Domenyo : la carta pinta en « evenodd »),
#    linhas : frontièras terrèstras amb las autras lengas (aragonés,
#    castelhan...), sens la còsta e sens la frontièra amb l'occitan, que la
#    carta occitana traça ja }. Coordenadas a 4 decimalas, levat la
#    frontièra amb l'occitan : ponches de limits-carta.json e de
#    fenolhedes.geojson represes tal quals, crosaments a 8 decimalas ;
#  - SIG/catalan/fenolhedes.geojson : las comunas dels Pirenèus Orientals
#    que son pas catalanas (lo Fenolhedés, occitan), de apondre al domeni
#    occitan de la carta (étapa 3a).
# Puèi : node SIG/cadena/catalan-app.mjs i apond las vilas e la còsta.
#
# Los noms occitans (oc) son de propausas, de validar per Romain.
#
# Etapas :
#  1. cada unitat pren son dialècte dins lo CSV (pel còdi INE, INSEE, ISTAT,
#     o pel nom per las comarcas) ; las unitats sens classament son listadas ;
#  2. union per dialècte ; a la frontièra d'Espanha, lo rossellonés (comunas
#     IGN) pren la linha d'OSM ; lo domeni es barrat (tampon +B puèi -B) e las
#     fendas entre vesins van al dialècte que ne tòca mai ;
#  3. simplificacion topologica : las frontièras comunas son copadas en arcs,
#     cada arc es simplificat un sol còp (GEOS, sens crosament), puèi las
#     facias son refachas e rendudas a lor dialècte : ni trauc ni recobriment ;
#     los traucs pichons (estanhs, pòrts) e las facias minusculas van al vesin ;
#  3a. lo Fenolhedés (comunas PO pas catalanas) es escrich a despart ;
#  3b. raccord amb lo domeni occitan corregit (limits-carta ∪ Fenolhedés) :
#     ni recobriment ni vuèg minuscul, sens espandir lo catalan dins una
#     comuna pas catalana ; los vuèges de mai de 1 km2 son signalats ;
#  4. la còsta es destriada de las frontièras terrèstras : de cada segment del
#     bòrd, de ponches cap a l'exterior tomban sus tèrra (autras lengas de las
#     donadas precisas, o tèrra Natural Earth) o en mar (vejatz tèst()) ;
#  5. etiquetas : centre del pus grand cercle inscrich dins lo tròç pus grand.
import csv, json, math, os, re, sys, unicodedata
from collections import defaultdict
from osgeo import gdal, ogr, osr

ogr.UseExceptions()
osr.UseExceptions()
# (los avertiments de GEOS sus las geometrias brutas invalidas, que son
# reparadas : « Nested shells »...)
gdal.PushErrorHandler('CPLQuietErrorHandler')

AQUI = os.path.dirname(os.path.abspath(__file__))
SIG = os.path.normpath(os.path.join(AQUI, '..'))
BRUT = os.path.join(SIG, 'brut', 'catalan', 'geojson')
DATA = os.path.normpath(os.path.join(SIG, '..', 'app', 'static', 'data'))
SORTIDA = os.path.join(DATA, 'catalan.json')

TOL = float(sys.argv[1]) if len(sys.argv) > 1 else 300.0  # simplificacion (m)
B = 150.0  # tampon que barra las fendas (m)
ESTRANH = 2000.0  # distància del ponch de tèst còsta / tèrra (m)

wgs, laea = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326)
laea.ImportFromEPSG(3035)  # projeccion europèa a susfàcias egalas, en mètres
for s in (wgs, laea):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versM = osr.CoordinateTransformation(wgs, laea)
versW = osr.CoordinateTransformation(laea, wgs)


# ---------------------------------------------------------------- utilitaris

def valid(g):
    """Geometria valida, sonque de susfàcias (MultiPolygon)."""
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    if g is None or g.IsEmpty():
        return m
    if not g.IsValid():
        g = g.MakeValid()
    def apondre(p):
        t = ogr.GT_Flatten(p.GetGeometryType())
        if t == ogr.wkbPolygon:
            if not p.IsEmpty():
                m.AddGeometry(p)
        elif t in (ogr.wkbMultiPolygon, ogr.wkbGeometryCollection):
            for i in range(p.GetGeometryCount()):
                apondre(p.GetGeometryRef(i))
    apondre(g)
    return m


def tròces(g):
    """Los polígons d'una geometria."""
    t = ogr.GT_Flatten(g.GetGeometryType())
    if t == ogr.wkbPolygon:
        return [g]
    return [g.GetGeometryRef(i) for i in range(g.GetGeometryCount())]


def unir(geoms):
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for g in geoms:
        for p in tròces(g):
            m.AddGeometry(p)
    return valid(m.UnaryUnion())


def aira(g):
    """Aira d'una geometria, 0 per una linha o un ponch (contacte sens susfàcia)."""
    t = ogr.GT_Flatten(g.GetGeometryType())
    return g.GetArea() if t in (ogr.wkbPolygon, ogr.wkbMultiPolygon, ogr.wkbGeometryCollection) else 0.0


def km2(g):
    return g.GetArea() / 1e6


def ponch(x, y):
    p = ogr.Geometry(ogr.wkbPoint)
    p.AddPoint_2D(x, y)
    return p


def sens_accents(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r"^(el|la|l'|els|les|vall? d')\s*", '', s.replace('’', "'"))
    return re.sub(r'[^a-z0-9]', '', s)


def capa(nom):
    """Las entitats d'un GeoJSON brut : [(proprietats, geometria en mètres)]."""
    d = json.load(open(os.path.join(BRUT, nom), encoding='utf-8'))
    res = []
    for f in d['features']:
        g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
        g.Transform(versM)
        res.append((f['properties'], valid(g)))
    return res


def poligon(anels_lonlat):
    """MultiPolygon en mètres a partir d'anèls [lon, lat] (un polígon per anèl)."""
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for a in anels_lonlat:
        r = ogr.Geometry(ogr.wkbLinearRing)
        for x, y in a:
            r.AddPoint_2D(x, y)
        r.CloseRings()
        p = ogr.Geometry(ogr.wkbPolygon)
        p.AddGeometry(r)
        m.AddGeometry(p)
    m.Transform(versM)
    return valid(m)


def poligon_ll(anel):
    """Polígon en lon/lat d'un anèl [lon, lat], coordenadas gardadas tal quals."""
    r = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in anel:
        r.AddPoint_2D(x, y)
    r.CloseRings()
    p = ogr.Geometry(ogr.wkbPolygon)
    p.AddGeometry(r)
    return p


def en_m(g):
    """Còpia en mètres (LAEA) d'una geometria en lon/lat."""
    c = g.Clone()
    c.Transform(versM)
    return c


def en_ll(g):
    """Còpia en lon/lat d'una geometria en mètres."""
    c = g.Clone()
    c.Transform(versW)
    return c


# ------------------------------------------------- 1. unitats e classament

linhas_csv = list(csv.DictReader(open(os.path.join(SIG, 'catalan', 'dialectes-catalan.csv'), encoding='utf-8-sig'), delimiter=';'))
classa = json.load(open(os.path.join(SIG, 'catalan', 'dialectes-catalan.json'), encoding='utf-8'))
DIAL = {d['kod']: d for d in classa['dialectes']}

unitats = []  # {regio, nom, dial, g}
trobadas = set()  # linhas del CSV qu'an trobat una geometria
autras = []  # geometrias de las autras lengas a l'entorn (pel tèst còsta / tèrra)
fora = []  # unitats sens classament


def unitat(i, g, nom=None):
    r = linhas_csv[i]
    trobadas.add(i)
    unitats.append({'regio': r['regio'], 'nom': nom or r['nom_ca'], 'dial': r['dialecte'], 'codi': r['codi'], 'sub': r['subdialecte'], 'g': g})


def per_codi(regio_pref):
    return {r['codi']: i for i, r in enumerate(linhas_csv) if r['regio'].startswith(regio_pref)}


# Catalonha : las comarcas, pel nom (lo CSV a los còdis IDESCAT, OSM pas)
idx = {}
for i, r in enumerate(linhas_csv):
    if r['mena'] == 'comarca':
        idx[sens_accents(r['nom_ca'])] = i
        idx[sens_accents(r['nom_oficial'])] = i
for p, g in capa('catalonha-comarcas.geojson'):
    i = next((idx[k] for k in (sens_accents(p.get('name:ca') or ''), sens_accents(p['name'])) if k in idx), None)
    if i is None:
        fora.append('comarca ' + p['name'])
    else:
        unitat(i, g)
# Andòrra
unitat(per_codi('Andorra')['AD'], capa('andorra.geojson')[0][1])
# Aragon (Franja) e País Valencian : las municipalitats, pel còdi INE
for nom, pref in (('arago-est-comunas.geojson', 'Franja'), ('valencian-comunas.geojson', 'País Valencià')):
    codis = per_codi(pref)
    for p, g in capa(nom):
        c = (p.get('ref:ine') or '')[:5]
        if c in codis:
            unitat(codis[c], g, p.get('name:ca') or p['name'])
        elif pref == 'Franja':
            autras.append(g)  # municipalitat aragonesa defòra de la Franja
        else:
            fora.append('municipi valencian ' + p['name'])
# Balears : las illas (lo CSV las a per municipalitat, l'illa dins « unitat »)
illas = defaultdict(list)
for i, r in enumerate(linhas_csv):
    if r['regio'] == 'Illes Balears':
        illas[r['unitat']].append(i)
for p, g in capa('balears-illas.geojson'):
    nom = 'Mallorca' if p['name'] == 'Cabrera' else p['name']  # Cabrera es de Palma
    if nom not in illas:
        fora.append('illa ' + p['name'])
        continue
    trobadas.update(illas[nom])
    dials = {linhas_csv[i]['dialecte'] for i in illas[nom]}
    assert len(dials) == 1, dials
    unitats.append({'regio': 'Illes Balears', 'nom': p['name'], 'dial': dials.pop(), 'g': g})
# l'Alguèr
unitat(per_codi("l'Alguer")['istat:090003'], capa('alguer.geojson')[0][1])
# Catalonha del Nòrd : las comunas, pel còdi INSEE
codis = per_codi('Catalunya del Nord')
for p, g in capa('pireneus-orientals-comunas.geojson'):
    if p['insee'] in codis:
        unitat(codis[p['insee']], g, p['nom'])
    else:
        fora.append('comuna ' + p['nom'])

# Lo Carxe (Múrcia) : sonque de masatges dins Jumella, Iecla e Favanella. Zòna
# aproximativa : envolopa dels masatges e dels ponches pus pròches del
# valencian vesin (lo Pinós, l'Alguenya), espandida de 2 km, dins las tres
# comunas.
murcia = capa('murcia-carxe-comunas.geojson')
murcia_u = unir([g for _, g in murcia])
masatges = []
for i, r in enumerate(linhas_csv):
    if r['mena'] == 'nucli':
        m = re.search(r'lat (-?\d+\.\d+), lon (-?\d+\.\d+)', r['nota'])
        if m:
            p = ponch(float(m.group(2)), float(m.group(1)))
            p.Transform(versM)
            masatges.append(p)
            trobadas.add(i)
valencia_brut = unir([u['g'] for u in unitats if u['dial'] == 'valencia' and u['regio'] == 'País Valencià'])
nuvol = ogr.Geometry(ogr.wkbMultiPoint)
for p in masatges:
    nuvol.AddGeometry(p)
    # lo ponch del valencian pus pròche (a mens de 6 km)
    if p.Distance(valencia_brut) < 6000:
        bord = valencia_brut.GetBoundary()
        # ponch del bòrd pus pròche : per un tampon que s'espandís
        d = p.Distance(valencia_brut)
        tòca = p.Buffer(d + 20, 8).Intersection(bord)
        if not tòca.IsEmpty():
            c = tòca.Centroid()
            nuvol.AddGeometry(ponch(c.GetX(), c.GetY()))
carxe = valid(nuvol.ConvexHull().Buffer(2000, 16).Intersection(murcia_u))
unitats.append({'regio': 'el Carxe (Múrcia)', 'nom': 'el Carxe', 'dial': 'valencia', 'g': carxe})
autras.append(valid(murcia_u.Difference(carxe)))

print('Unitats : %d ; linhas del CSV amb una geometria : %d / %d' % (len(unitats), len(trobadas), len(linhas_csv)))

# lo domeni occitan (dins limits-carta.json) : tèrra d'una autra lenga, e
# referéncia de la frontièra comuna (étapa 3b). Sos anèls se legisson en
# règla « evenodd », coma la carta ; sos ponches son gardats tal quals.
lim_oc = json.load(open(os.path.join(DATA, 'limits-carta.json'), encoding='utf-8'))['domeni']
oc_ll = ogr.Geometry(ogr.wkbPolygon)
for a in lim_oc['anels']:
    oc_ll = oc_ll.SymDifference(valid(poligon_ll(a)))
oc_ll = valid(oc_ll)
VÈRT_OC = {(x, y) for a in lim_oc['anels'] for x, y in a}
occitan = en_m(oc_ll)
autras += [u['g'] for u in unitats if u['dial'] == 'exclos'] + [occitan]

# ------------------------------------------------- 2. union per dialècte

ORDRE = ['rossellones', 'central', 'nordoccidental', 'tortosi', 'valencia', 'balear', 'algueres']
assert set(ORDRE) == set(DIAL), set(DIAL) ^ set(ORDRE)

# Las claus de la particion (Romain, 2026-10-08) : lo dialècte, puèi « |FR »
# per las comunas de França (la zòna a despart « catalunya-nord » n'es
# l'union : sa geometria es pas pus la del rossellonés, dempuèi que la
# Cerdanha tota es en central), e « |Tben », « |Tsep » per las zònas de
# parlar de transicion. Totas las claus son simplificadas ensems (étapa 3) :
# lors bòrds comuns son exactament los meteisses ; los dialèctes,
# catalunya-nord e las transicions ne son de reünions (étapa 4).
BENASQUÉS = ['Benasque', 'Bisaurri', 'Castejón de Sos', 'Chía', 'Sahún', 'Sesué', 'Villanova']
CÒDIS_BENASQUÉS = {r['codi'] for r in linhas_csv if r['regio'].startswith('Franja') and r['nom_oficial'] in BENASQUÉS}
assert len(CÒDIS_BENASQUÉS) == len(BENASQUÉS), CÒDIS_BENASQUÉS
TRANSICIONS = {
    'Tben': {'kod': 'trans-benasques', 'ca': 'benasquès', 'fr': 'benasquais', 'oc': 'benasqués', 'entre': ['nordoccidental', 'aragonés'],
             'nota': "parlar de transicion entre lo catalan e l'aragonés"},
    'Tsep': {'kod': 'trans-septentrional', 'ca': 'septentrional de transició', 'fr': 'septentrional de transition', 'oc': 'septentrional de transicion', 'entre': ['central', 'rossellones'],
             'nota': "parlar de transicion entre lo catalan central e lo rossellonés (Veny lo met dins lo central)"},
}


def clau(u):
    k = u['dial'] + ('|FR' if u['regio'].startswith('Catalunya del Nord') else '')
    if u.get('codi') in CÒDIS_BENASQUÉS:
        k += '|Tben'
    elif u.get('sub') == 'septentrional_transicio':
        k += '|Tsep'
    return k


CLAUS = sorted({clau(u) for u in unitats if u['dial'] in DIAL}, key=lambda k: (ORDRE.index(k.split('|')[0]), k))
# Prioritat dels recobriments : las fonts OSM (Espanha, Andòrra, Itàlia)
# d'en primièr, l'IGN (França) en darrièr
PRIORITAT = [k for k in CLAUS if '|FR' not in k] + [k for k in CLAUS if '|FR' in k]
print('Claus de la particion :', ', '.join(CLAUS))
# La frontièra d'Espanha (e d'Andòrra) : las comunas IGN e las comarcas OSM i
# fan de fendas e de recobriments (de qualques mètres a qualques centenats).
# Las comunas de França prenon la frontièra d'OSM : las fendas a mens de
# 300 m de las doas bandas (barradas, sens la mar) son sieunas (a la clau que
# ne tòca mai), puèi tot çò qu'es en Espanha lor es levat.
g_clau = {k: unir([u['g'] for u in unitats if u['dial'] in DIAL and clau(u) == k]) for k in CLAUS}
CLAUS_FR = [k for k in CLAUS if '|FR' in k]
g_fr = unir([g_clau[k] for k in CLAUS_FR])
x0, x1, y0, y1 = g_fr.GetEnvelope()
caixa = ogr.CreateGeometryFromWkt('POLYGON((%f %f,%f %f,%f %f,%f %f,%f %f))' % (x0 - 5000, y0 - 5000, x1 + 5000, y0 - 5000, x1 + 5000, y1 + 5000, x0 - 5000, y1 + 5000, x0 - 5000, y0 - 5000))
esp = valid(unir([u['g'] for u in unitats if u['regio'] in ('Catalunya', 'Andorra')]).Intersection(caixa))
zona_f = valid(g_fr.Buffer(300, 4).Intersection(esp.Buffer(300, 4)))
ge = unir([g_fr, esp])
fenda_f = valid(valid(ge.Buffer(300, 8).Buffer(-300, 8)).Intersection(zona_f).Difference(ge))
fenda_de = defaultdict(list)
for q in tròces(fenda_f):
    qb = q.Buffer(5, 2)
    fenda_de[max(CLAUS_FR, key=lambda k: aira(qb.Intersection(g_clau[k])) if qb.Intersects(g_clau[k]) else 0)].append(q.Clone())
brut = {}
pres = ogr.Geometry(ogr.wkbMultiPolygon)
rapòrt_rec = ['comunas de França : %.2f km2 de fendas e %.2f km2 de recobriments amb la frontièra OSM' % (km2(fenda_f), km2(valid(g_fr.Intersection(esp))))]
for d in PRIORITAT:
    g = g_clau[d]
    if '|FR' in d:
        g = valid(unir([g] + fenda_de[d]).Difference(esp))
    if not pres.IsEmpty():
        r = valid(g.Intersection(pres))
        if km2(r) > 0.001:
            rapòrt_rec.append('%s : %.2f km2 levats (recobriment amb un vesin)' % (d, km2(r)))
        g = valid(g.Difference(pres))
    brut[d] = g
    pres = unir([pres, g])

# domeni barrat : las fendas (fins a 2B de larg) se tampan
tot = pres
dom = valid(tot.Buffer(B, 8).Buffer(-B, 8))
dom = unir([dom, tot])
fendas = valid(dom.Difference(tot))
# (las fendas de mens de 1000 m2, d'erosions del tampon sus la còsta, son
# daissadas : la simplificacion las escafa, e los traucs que demòran se
# tampan a l'etapa 3)
fendas = [f.Clone() for f in tròces(fendas) if f.GetArea() >= 1000]
zona = unir([f.Buffer(40, 4) for f in fendas])
# los dialèctes, retalhats a l'entorn de las fendas (mai leugièrs)
ribas = {}
for d in CLAUS:
    ribas[d] = [(q.Clone(), q.GetEnvelope()) for q in tròces(valid(brut[d].Intersection(zona)))]


def tòca(g, parts):
    """Aira de g recobèrta per una lista de tròces (amb lor emprèsa)."""
    x0, x1, y0, y1 = g.GetEnvelope()
    a = 0.0
    for q, (u0, u1, v0, v1) in parts:
        if u0 <= x1 and x0 <= u1 and v0 <= y1 and y0 <= v1 and g.Intersects(q):
            a += aira(g.Intersection(q))
    return a


afectadas = defaultdict(list)
for f in fendas:
    fb = f.Buffer(30, 4)
    afectadas[max(CLAUS, key=lambda d: tòca(fb, ribas[d]))].append(f)
P = {d: unir([brut[d]] + afectadas[d]) for d in CLAUS}
print('Fendas tampadas : %d tròces, %.2f km2' % (len(fendas), sum(f.GetArea() for f in fendas) / 1e6))
for r in rapòrt_rec:
    print('  ' + r)

# ------------------------------------------------- 3. simplificacion topologica


def anèls(g):
    for p in tròces(g):
        for k in range(p.GetGeometryCount()):
            yield p.GetGeometryRef(k)


tòtas = ogr.Geometry(ogr.wkbMultiLineString)
for d in CLAUS:
    for a in anèls(P[d]):
        l = ogr.Geometry(ogr.wkbLineString)
        for k in range(a.GetPointCount()):
            l.AddPoint_2D(a.GetX(k), a.GetY(k))
        tòtas.AddGeometry(l)
nosat = tòtas.UnaryUnion()  # tròces copats a cada crosament, sens doblons
segs = []
for k in range(nosat.GetGeometryCount()):
    l = nosat.GetGeometryRef(k)
    segs.append([(l.GetX(j), l.GetY(j)) for j in range(l.GetPointCount())])
# los tròces se jonhon en arcs, d'un nos (gra diferent de 2) a l'autre
cap = defaultdict(list)
for k, s in enumerate(segs):
    cap[s[0]].append(k)
    cap[s[-1]].append(k)
usats = set()
arcs = []
for k in range(len(segs)):
    if k in usats:
        continue
    usats.add(k)
    arc = list(segs[k])
    for sens in (0, 1):
        while True:
            p = arc[-1]
            if len(cap[p]) != 2 or (len(arc) > 2 and arc[0] == p):
                break
            seg = [j for j in cap[p] if j not in usats]
            if not seg:
                break
            j = seg[0]
            usats.add(j)
            s = segs[j]
            arc += s[1:] if s[0] == p else s[::-1][1:]
        arc.reverse()
    arcs.append(arc)
ml = ogr.Geometry(ogr.wkbMultiLineString)
for a in arcs:
    l = ogr.Geometry(ogr.wkbLineString)
    for x, y in a:
        l.AddPoint_2D(x, y)
    ml.AddGeometry(l)
simple = ml.SimplifyPreserveTopology(TOL)
print('Arcs : %d (%d ponches -> %d)' % (len(arcs), sum(len(a) for a in arcs), sum(simple.GetGeometryRef(k).GetPointCount() for k in range(simple.GetGeometryCount()))))
facias = simple.Polygonize()
# cada facia a son dialècte (lo que ne recobrís mai) ; las autras son de
# traucs del domeni
fac_d = []  # [facia, dialècte]
traucs = []
for k in range(facias.GetGeometryCount()):
    f = facias.GetGeometryRef(k).Clone()
    cobs = {d: (aira(f.Intersection(P[d])) if f.Intersects(P[d]) else 0) for d in CLAUS}
    if sum(cobs.values()) < 0.5 * f.GetArea():
        traucs.append(f)
    else:
        fac_d.append([f, max(cobs, key=cobs.get)])


def vesins(f):
    """Long de contacte (en m2 d'un tampon de 5 m) de f amb cada dialècte."""
    fb = f.Buffer(5, 2)
    v = defaultdict(float)
    for f2, d2 in fac_d:
        if f2 is not f and d2 is not None and fb.Intersects(f2):
            v[d2] += aira(fb.Intersection(f2))
    return v


# los traucs de mens de 1,5 km2 (estanhs, pòrts, fendas) van al vesin que
# tòcan mai ; los autres son d'enclavas d'una autra lenga (Asp e Montfort)
traucs_gardats = []
for f in traucs:
    v = vesins(f) if f.GetArea() < 1.5e6 else None
    if v:
        fac_d.append([f, max(v, key=v.get)])
    else:
        traucs_gardats.append(f)
# las facias minusculas (< 1 km2) dins lo domeni van al vesin que tòcan mai ;
# las illetas solas de mens de 0,3 km2 se daissan
for e in sorted(fac_d, key=lambda e: e[0].GetArea()):
    f = e[0]
    if f.GetArea() >= 1e6:
        break
    v = vesins(f)
    if v:
        e[1] = max(v, key=v.get)
    elif f.GetArea() < 0.3e6:
        e[1] = None
FIN = {d: unir([f for f, d2 in fac_d if d2 == d]) for d in CLAUS}

# ------------------------------------------------- tèrra de Natural Earth

# (TopoJSON world-atlas, SIG/brut/mond) : la tèrra defòra de nòstras donadas
# (Aude, Arièja...) per l'étapa 3b, e lo tèst còsta / frontièra de l'étapa 4
topo = json.load(open(os.path.join(SIG, 'brut', 'mond', 'countries-50m.json'), encoding='utf-8'))
sc, tr = topo['transform']['scale'], topo['transform']['translate']
arcs_ne = []
for a in topo['arcs']:
    x = y = 0
    pts = []
    for dx, dy in a:
        x += dx
        y += dy
        pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
    arcs_ne.append(pts)


def anel_ne(idxs):
    pts = []
    for i in idxs:
        a = arcs_ne[i] if i >= 0 else arcs_ne[~i][::-1]
        pts += a if not pts else a[1:]
    return pts


païses = []
for o in topo['objects']['countries']['geometries']:
    if o.get('properties', {}).get('name') in ('Spain', 'France', 'Andorra', 'Italy', 'Monaco', 'Portugal'):
        pols = o['arcs'] if o['type'] == 'MultiPolygon' else [o['arcs']]
        païses.append(poligon([anel_ne(p[0]) for p in pols]))
tèrra_ne_tota = unir(païses)

# ------------------------------------------------- 3a. lo Fenolhedés
#
# Las comunas dels Pirenèus Orientals que son pas catalanas dins lo CSV (las
# 28 del Fenolhedés, occitanas) mancan al domeni occitan de la carta (que n'a
# sonque Caudièrs). Lor union (contorns IGN sens simplificacion, 4 decimalas)
# es escricha dins SIG/catalan/fenolhedes.geojson, per èsser aponduda al
# domeni occitan e al lengadocian (Romain e Claude, 2026-10-08). Lo raccord
# de l'étapa 3b se fa contra aquel domeni corregit : limits-carta ∪ Fenolhedés.
FENOLHEDES = os.path.join(SIG, 'catalan', 'fenolhedes.geojson')


def km2_ll(g):
    """Susfàcia d'una geometria en lon/lat, mesurada en lon/lat (gras² ×
    111,32² × cos(lat)) : una geometria tornada projectar fariá parèisser de
    falsas fendas (un segment drech en lon/lat es corbat en mètres ; sus
    3 km, d'unes decimètres), pas de la geometria vertadièra."""
    return sum(p.GetArea() * 111.32 ** 2 * math.cos(math.radians(p.Centroid().GetY())) for p in tròces(valid(g)))


def arredondir_ll(g_ll, n=4):
    """Geometria en lon/lat, ponches arredondits a n decimalas."""
    gj = json.loads(valid(g_ll).ExportToJson())
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for pol in gj['coordinates']:
        p = ogr.Geometry(ogr.wkbPolygon)
        for a in pol:
            r = ogr.Geometry(ogr.wkbLinearRing)
            for x, y in a:
                r.AddPoint_2D(round(x, n), round(y, n))
            r.CloseRings()
            p.AddGeometry(r)
        m.AddGeometry(p)
    return valid(m)


def arredondir(g_m):
    """Geometria en mètres -> lon/lat, ponches arredondits a 4 decimalas."""
    return arredondir_ll(en_ll(valid(g_m)))


codis_po = per_codi('Catalunya del Nord')
fen_comunas, fen_geoms = [], []
for f in json.load(open(os.path.join(BRUT, 'pireneus-orientals-comunas.geojson'), encoding='utf-8'))['features']:
    i = codis_po.get(f['properties']['insee'])
    if i is None or linhas_csv[i]['dialecte'] not in DIAL:
        fen_comunas.append({'insee': f['properties']['insee'], 'nom': f['properties']['nom'], 'nom_ca': linhas_csv[i]['nom_ca'] if i is not None else None})
        fen_geoms.append(valid(ogr.CreateGeometryFromJson(json.dumps(f['geometry']))))
fen_ll = arredondir_ll(unir(fen_geoms))
fen_comunas.sort(key=lambda c: c['insee'])
json.dump({
    'type': 'FeatureCollection',
    'font': "Comunas dels Pirenèus Orientals : IGN ADMIN EXPRESS COG CARTO 2026 (Licéncia dobèrta 2.0), sens simplificacion ; classament : SIG/catalan/dialectes-catalan.csv (dialècte « exclos » : occitan)",
    'features': [{'type': 'Feature', 'properties': {
        'kod': 'fenolhedes', 'oc': 'Fenolhedés', 'fr': 'Fenouillèdes', 'oc_a_validar': True,
        'nota': "Comunas occitanofònas dels Pirenèus Orientals, defòra del domeni catalan ; de apondre al domeni occitan de la carta (limits-carta.json) e al lengadocian.",
        'km2': round(km2_ll(fen_ll), 1), 'n_comunas': len(fen_comunas), 'comunas': fen_comunas},
        'geometry': json.loads(fen_ll.ExportToJson(['COORDINATE_PRECISION=4']))}],
}, open(FENOLHEDES, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
# (relegit del fichièr : lo raccord se fa sus las coordenadas escrichas)
fen_ll = valid(ogr.CreateGeometryFromJson(json.dumps(json.load(open(FENOLHEDES, encoding='utf-8'))['features'][0]['geometry'])))
VÈRT_FEN = {(r.GetX(j), r.GetY(j)) for p in tròces(fen_ll) for r in (p.GetGeometryRef(k) for k in range(p.GetGeometryCount())) for j in range(r.GetPointCount())}
# (Dempuèi lo 2026-10-08 a 23 h, limits-carta.json conten ja lo Fenolhedés,
# apondut per SIG/cadena/fenolhedes.py, que seguís las comunas IGN dins los
# Pirenèus Orientals : lo domeni de referéncia es alara limits-carta sol ;
# se lo Fenolhedés i mancava encara, seriá limits-carta ∪ Fenolhedés.)
fen_mancant = km2_ll(valid(fen_ll.Difference(oc_ll)))
if fen_mancant < 1:
    ref_ll, VÈRT_REF = oc_ll, set(VÈRT_OC)
else:
    ref_ll, VÈRT_REF = unir([oc_ll, fen_ll]), VÈRT_OC | VÈRT_FEN
ref_m = en_m(ref_ll)

# ------------------------------------------------- 3b. raccord amb l'occitan
#
# Las zònas catalanas se raccòrdan exactament al domeni occitan de la carta,
# sens trauc ni recobriment, mas sens s'espandir dins una comuna que siá pas
# catalana (Romain, 2026-10-08) :
#  a. los dialèctes, ja simplificats (étapa 3), passan en lon/lat, a 4 decimalas ;
#  b. dins la zòna de contacte (a mens de RACCORD m dels dos domenis, sus
#     tèrra), los vuèges :
#       - dins una comuna (o comarca) catalana (contorns bruts, pas
#         simplificats) : van al catalan, al dialècte que ne tòca mai ;
#       - defòra : sonque los tròces de mens de VUÈG_MAX que son dins cap de
#         comuna coneguda (mens de TRAUC_COMUNA dins una comuna d'autra
#         lenga) : la tèrra de degun entre doas fonts (frontièra d'Espanha
#         d'OSM contra la de l'IGN) ; los autres son signalats, pas tampats ;
#  c. lo domeni occitan es levat del catalan, sens tornar simplificar : la
#     frontièra comuna repren exactament sos ponches (meteissas coordenadas).
RACCORD = 3000.0
VUÈG_MAX = 1.0  # km2
TRAUC_COMUNA = 0.01  # km2
MASCA_TOL = 100.0  # m : contorns de las comunas catalanas, simplificats un pauc (pes del fichièr)


def a_lonlat(t):
    """Un ponch dins una geometria en mètres, en lon/lat (pel rapòrt)."""
    c = t.PointOnSurface()
    c.Transform(versW)
    return '%.3f, %.3f' % (c.GetX(), c.GetY())


# a. en lon/lat
DIAL_LL = {d: arredondir(FIN[d]) for d in CLAUS}
U_ll = unir(list(DIAL_LL.values()))
U_m = en_m(U_ll)
zona_m = valid(U_m.Buffer(RACCORD, 4).Intersection(ref_m.Buffer(RACCORD, 4)))
# la tèrra de la zòna : unitats brutas (de totas lengas) e tèrra Natural Earth
autras_unitats = [a for a in autras if a is not occitan]
pròchas = [u['g'] for u in unitats if u['g'].Intersects(zona_m)] + [a for a in autras_unitats if a.Intersects(zona_m)]
unitats_zona = unir(pròchas)
tèrra_m = valid(unir([unitats_zona, valid(tèrra_ne_tota.Intersection(zona_m))]).Intersection(zona_m))

# Las comunas de la zòna : (nom, sector, catalana ?, geometria en mètres).
# Pirenèus Orientals (IGN), Andòrra, comarcas de Catalonha (Aran a despart),
# comunas d'Aragon (OSM) ; Arièja, Aude, Nauta Garona e Nauts Pirenèus dins
# lo GeoPackage IGN de SIG/brut/comunas.
SECTORS = ['Pirenèus Orientals', 'Andòrra', 'Catalonha (fòra Aran)', 'Aran', 'Aragon', 'Arièja, Aude, Nauta Garona']
comunas_zona = []
for u in unitats:
    if not u['g'].Intersects(zona_m):
        continue
    if u['regio'].startswith('Catalunya del Nord'):
        s = SECTORS[0]
    elif u['regio'] == 'Andorra':
        s = SECTORS[1]
    elif u['regio'] == 'Catalunya':
        s = SECTORS[3] if u['dial'] == 'exclos' else SECTORS[2]
    elif u['regio'].startswith('Franja'):
        s = SECTORS[4]
    else:
        s = u['regio']
    comunas_zona.append((u['nom'], s, u['dial'] in DIAL, u['g']))
franja = per_codi('Franja')
comunas_zona += [('%s (Aragon, %s)' % (p['name'], (p.get('ref:ine') or '')[:5]), SECTORS[4], False, g)
                 for p, g in capa('arago-est-comunas.geojson') if (p.get('ref:ine') or '')[:5] not in franja and g.Intersects(zona_m)]
try:
    ds_ign = ogr.Open(os.path.join(SIG, 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
    lc = ds_ign.GetLayerByName('commune')
    sr = lc.GetSpatialRef().Clone()
    sr.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    versM_ign = osr.CoordinateTransformation(sr, laea)
    lc.SetAttributeFilter("code_insee_du_departement IN ('09', '11', '31', '65')")
    for f in lc:
        g = f.GetGeometryRef().Clone()
        g.Transform(versM_ign)
        if g.Intersects(zona_m):
            comunas_zona.append(('%s (%s)' % (f.GetField('nom_officiel'), f.GetField('code_insee')), SECTORS[5], False, valid(g)))
except Exception as e:
    print('  (GeoPackage IGN pas legit : %s)' % e)
cat_brut_m = valid(unir([g for n, s, c, g in comunas_zona if c]).SimplifyPreserveTopology(MASCA_TOL))
autra_m = valid(unir([g for n, s, c, g in comunas_zona if not c]).Difference(ref_m).Difference(cat_brut_m))
aragonés_m = unir([g for n, s, c, g in comunas_zona if not c and s == SECTORS[4]])
tèrra_ll, cat_brut_ll = en_ll(tèrra_m), en_ll(cat_brut_m)
sector_ll = {s: en_ll(unir([g for n, s2, c, g in comunas_zona if s2 == s])) for s in SECTORS}


def comunas_de(q_m, min_km2=0.05):
    r = sorted(((km2(valid(q_m.Intersection(g))), n) for n, s, c, g in comunas_zona if g.Intersects(q_m)), reverse=True)
    return ', '.join('%s %.1f' % (n, a) for a, n in r if a >= min_km2) or 'cap comuna (entre doas fonts)'


def mesura(X_ll):
    """Recobriments e vuèges (km2) entre l'union catalana X_ll e lo domeni
    occitan, dins la zòna de contacte sus tèrra : en tot, e per sector."""
    rec = valid(X_ll.Intersection(ref_ll))
    v = valid(tèrra_ll.Difference(ref_ll).Difference(X_ll))
    out = {'rec': km2_ll(rec), 'vuèg': km2_ll(v), 'n_vuèg_1': sum(1 for q in tròces(v) if km2_ll(q) > VUÈG_MAX)}
    for s in SECTORS:
        out['rec', s] = km2_ll(valid(rec.Intersection(sector_ll[s]))) if rec.Intersects(sector_ll[s]) else 0.0
        out['vuèg', s] = km2_ll(valid(v.Intersection(sector_ll[s]))) if v.Intersects(sector_ll[s]) else 0.0
    return out


abans = mesura(U_ll)
# b. los vuèges
vuèg_ll = valid(tèrra_ll.Difference(ref_ll).Difference(U_ll))
dins_cat = valid(vuèg_ll.Intersection(cat_brut_ll))
defòra = valid(vuèg_ll.Difference(cat_brut_ll))
apond = defaultdict(list)
n_dins = n_defòra = 0
a_dins = a_defòra = 0.0


def vesin(q):
    qb = q.Buffer(2e-5, 2)  # (environ 2 m)
    c = {d: (aira(qb.Intersection(DIAL_LL[d])) if qb.Intersects(DIAL_LL[d]) else 0) for d in CLAUS}
    d = max(c, key=c.get)
    return d if c[d] > 0 else None


for q in tròces(dins_cat):
    d = vesin(q)
    if d:
        apond[d].append(q.Clone())
        n_dins += 1
        a_dins += km2_ll(q)
for q in tròces(defòra):
    q_m = en_m(q)
    d = vesin(q)
    dins_autra = km2(valid(q_m.Intersection(autra_m))) if q_m.Intersects(autra_m) else 0.0
    if d and km2_ll(q) < VUÈG_MAX and dins_autra < TRAUC_COMUNA:
        apond[d].append(q.Clone())
        n_defòra += 1
        a_defòra += km2_ll(q)
# c. lo domeni occitan, levat del catalan
DIAL2_LL = {}
for d in CLAUS:
    g = unir([DIAL_LL[d]] + apond[d]) if apond[d] else DIAL_LL[d]
    if g.Intersects(ref_ll):
        g = valid(g.Difference(ref_ll))
    DIAL2_LL[d] = g
U2_ll = unir(list(DIAL2_LL.values()))
aprèp = mesura(U2_ll)
rapòrt_raccord = []
for q in tròces(valid(U_ll.Intersection(ref_ll))):
    if km2_ll(q) > VUÈG_MAX:
        q_m = en_m(q)
        rapòrt_raccord.append('  recobriment levat (comunas catalanas dins lo domeni occitan) : %.1f km2 a %s : %s' % (km2_ll(q), a_lonlat(q_m), comunas_de(q_m)))
# los vuèges que demòran
vuèg_fin_ll = valid(tèrra_ll.Difference(ref_ll).Difference(U2_ll))
vuèg_fin_m = en_m(vuèg_fin_ll)
vuèg_oc_m = valid(vuèg_fin_m.Difference(aragonés_m))  # (tèrra occitana o de degun : pas de linha)
for q in sorted(tròces(vuèg_fin_ll), key=lambda q: -q.GetArea()):
    if km2_ll(q) > VUÈG_MAX:
        q_m = en_m(q)
        rapòrt_raccord.append('  vuèg daissat : %.1f km2 a %s : %s' % (km2_ll(q), a_lonlat(q_m), comunas_de(q_m)))
pichons = [q for q in tròces(vuèg_fin_ll) if km2_ll(q) <= VUÈG_MAX]
n_pichons, a_pichons = len(pichons), sum(km2_ll(q) for q in pichons)
pichons_01 = [q for q in pichons if km2_ll(q) > 0.1]
for q in sorted(pichons_01, key=lambda q: -q.GetArea()):
    q_m = en_m(q)
    rapòrt_raccord.append('  vuèg pichon daissat : %.2f km2 a %s : %s' % (km2_ll(q), a_lonlat(q_m), comunas_de(q_m, 0.01)))

# ------------------------------------------------- 4. domeni, còsta e frontièras

# Las reünions de claus : dialèctes, catalunya-nord (comunas catalanas de
# França) e zònas de transicion. Los bòrds comuns son exactament los
# meteisses (las claus partejan lors ponches).
CLAU_LL = DIAL2_LL
DIAL2_LL = {d: unir([CLAU_LL[k] for k in CLAUS if k.split('|')[0] == d]) for d in ORDRE}
NÒRD_LL = unir([CLAU_LL[k] for k in CLAUS if '|FR' in k])
DINS_NÒRD = [d for d in ORDRE if any(k.split('|')[0] == d and '|FR' in k for k in CLAUS)]
TRANS_LL = {t: unir([CLAU_LL[k] for k in CLAUS if '|' + t in k]) for t in TRANSICIONS}
domeni_ll = U2_ll
domeni = en_m(domeni_ll)
FIN = {d: en_m(DIAL2_LL[d]) for d in ORDRE}  # (en mètres : etiquetas, surfàcias)
tèrra_ne_brut = valid(tèrra_ne_tota.Intersection(domeni.Buffer(30000, 4)))
# (lo domeni n'es levat : al fons d'una cala o d'un golf, lo ponch de tèst
# tomba sus l'autra riba, qu'es encara catalana : es la mar que compta)
tèrra_ne = valid(tèrra_ne_brut.Buffer(-1500, 4).Difference(domeni.Buffer(10, 4)))
autras_t = valid(unir(autras).Difference(domeni.Buffer(10, 4)))
tèrra_ne_8 = valid(tèrra_ne_brut.Buffer(-8000, 4))


def tèst(x, y, nx, ny):
    """Lo segment de mitan (x, y) e de normala exteriora (nx, ny) dona sus
    tèrra ? Respond (precís, ne, luènh) : precís = tèrra d'una autra lenga dins
    las donadas precisas, a 300 m o a 1 km ; ne = tèrra Natural Earth a 2 km e a
    6 km (es generalizada : de còps sa còsta es qualques km en mar, coma sus la
    Còsta Vermelha) ; luènh = lo segment es a mai de 8 km de la mar."""
    def dins(g, d):
        return g.Contains(ponch(x + nx * d, y + ny * d))
    return (dins(autras_t, 300) or dins(autras_t, 1000),
            dins(tèrra_ne, ESTRANH) and dins(tèrra_ne, 3 * ESTRANH),
            tèrra_ne_8.Contains(ponch(x, y)))


def es_illa(anel):
    """Un anèl exterior es una illa se sa tèrra Natural Earth es pas gaire
    mai granda que el (Balears) ; l'Alguèr e lo continent, non."""
    p = ogr.Geometry(ogr.wkbPolygon)
    p.AddGeometry(anel.Clone())
    c = p.PointOnSurface()
    for q in tròces(tèrra_ne_tota):
        if q.Contains(c):
            return q.GetArea() < 2 * p.GetArea()
    return True


def fmt(pts):
    """Ponches [lon, lat] escriches : los del domeni occitan corregit tal
    quals (coma dins limits-carta.json e fenolhedes.geojson), los autres a 8
    decimalas (los del catalan son ja a 4 ; los ponches de crosament amb la
    frontièra occitana, qualques desenas, a 8 : environ 1 mm), sens doblons."""
    out = []
    for x, y in pts:
        q = [x, y] if (x, y) in VÈRT_REF else [round(x, 8), round(y, 8)]
        if not out or q != out[-1]:
            out.append(q)
    return out


# Los anèls del domeni : los exteriors, e tanben los traucs (enclavas d'una
# autra lenga), que la carta pinta en « evenodd ». Cada segment del bòrd es
# « oc » (sus la frontièra occitana : l'occitan la traça ja, pas dins las
# linhas), « tèrra » (frontièra amb una autra lenga : dins las linhas) o « mar ».
oc_bòrd = ref_ll.GetBoundary()
oc_o_vuèg_m = unir([valid(ref_m.Intersection(zona_m.Buffer(2000, 4))), vuèg_oc_m])
ox0, ox1, oy0, oy1 = ref_ll.GetEnvelope()
anels_dom, linhas, traucs_dom = [], [], []
n_seg_oc = 0
for p, k in [(p, k) for p in tròces(domeni_ll) for k in range(p.GetGeometryCount())]:
    a = p.GetGeometryRef(k)
    pll = [(a.GetX(j), a.GetY(j)) for j in range(a.GetPointCount())]
    anel_m = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in pll:
        q = ponch(x, y)
        q.Transform(versM)
        anel_m.AddPoint_2D(q.GetX(), q.GetY())
    pts = [(anel_m.GetX(j), anel_m.GetY(j)) for j in range(anel_m.GetPointCount())]
    if k > 0:
        t = ogr.Geometry(ogr.wkbPolygon)
        t.AddGeometry(anel_m.Clone())
        traucs_dom.append(t)
    # sens de l'anèl (aira signada) : per un anèl exterior en sens
    # trigonometric, lo defòra es a dreita ; per un trauc, a l'invèrs
    s = sum(pts[j][0] * pts[j + 1][1] - pts[j + 1][0] * pts[j][1] for j in range(len(pts) - 1))
    sgn = (1 if s > 0 else -1) * (1 if k == 0 else -1)
    illa = k == 0 and es_illa(anel_m)
    ax0, ax1, ay0, ay1 = a.GetEnvelope()
    pròche_oc = ax0 <= ox1 and ox0 <= ax1 and ay0 <= oy1 and oy0 <= ay1
    mena = []
    for j in range(len(pts) - 1):
        if pròche_oc and oc_bòrd.Distance(ponch((pll[j][0] + pll[j + 1][0]) / 2, (pll[j][1] + pll[j + 1][1]) / 2)) < 1e-7:
            mena.append('oc')
            continue
        (x0, y0), (x1, y1) = pts[j], pts[j + 1]
        L = math.hypot(x1 - x0, y1 - y0) or 1
        nx, ny = sgn * (y1 - y0) / L, -sgn * (x1 - x0) / L
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        # (un segment que dona sus lo domeni occitan corregit, o sus un vuèg
        # de tèrra occitana defòra d'aquel domeni : frontièra amb l'occitan
        # tanben, pas dins las linhas)
        if pròche_oc and any(oc_o_vuèg_m.Contains(ponch(mx + nx * e, my + ny * e)) for e in (300, 1000)):
            mena.append('oc')
            continue
        mena.append((False, False, False) if illa else tèst(mx, my, nx, ny))
    # Natural Earth sola (sens vesins dins las donadas precisas) : pertot per
    # un anèl que n'a pas cap (l'Alguèr), sonque luènh de la mar pels autres
    # (País Valencian contra Castelha, Ports contra Terol, Pirenèus)
    a_precís = any(m[0] for m in mena if m != 'oc')
    mena = [m if m == 'oc' else ('tèrra' if m[0] or (m[1] and (m[2] or not a_precís)) else 'mar') for m in mena]
    # un segment sol, d'una mena diferenta de sos dos vesins, pren lor mena
    # (un tèst que rata, pas una vertadièra còsta de 1 km dins una frontièra)
    n = len(mena)
    if n > 2:
        mena = [mena[(j - 1) % n] if mena[j] != 'oc' and mena[(j - 1) % n] == mena[(j + 1) % n] != 'oc' else mena[j] for j in range(n)]
    n_seg_oc += mena.count('oc')
    anels_dom.append(fmt(pll))
    # las frontièras : seguidas de segments « tèrra » (l'anèl es redond : se
    # comença just aprèp un segment d'una autra mena)
    if all(m == 'tèrra' for m in mena):
        linhas.append(fmt(pll))
        continue
    if 'tèrra' not in mena:
        continue
    k0 = next(j for j in range(n) if mena[j] != 'tèrra') + 1
    cur = []
    for jj in range(n):
        j = (k0 + jj) % n
        if mena[j] == 'tèrra':
            if not cur:
                cur.append(pll[j])
            cur.append(pll[j + 1])
        elif cur:
            linhas.append(fmt(cur))
            cur = []
    if cur:
        linhas.append(fmt(cur))
linhas = [l for l in linhas if len(l) > 1]

# ------------------------------------------------- 5. etiquetas e escritura


def eti(g):
    """Ponch d'etiqueta : lo centre del pus grand cercle inscrich (environ)
    dins lo tròç pus grand."""
    p = max(tròces(g), key=lambda q: q.GetArea())
    lo, hi, melhor = 0.0, math.sqrt(p.GetArea()), p.PointOnSurface()
    for _ in range(16):
        m = (lo + hi) / 2
        b = p.Buffer(-m, 4)
        if b.IsEmpty():
            hi = m
        else:
            lo = m
            melhor = max(tròces(b), key=lambda q: q.GetArea()).PointOnSurface()
    c = melhor.Clone()
    c.Transform(versW)
    return [round(c.GetX(), 3), round(c.GetY(), 3)], melhor


def geojson_ll(g):
    pols = []
    for p in tròces(g):
        anels = [fmt([(a.GetX(j), a.GetY(j)) for j in range(a.GetPointCount())]) for a in (p.GetGeometryRef(k) for k in range(p.GetGeometryCount()))]
        anels = [a for a in anels if len(a) >= 4]
        if anels:
            pols.append(anels)
    return {'type': 'MultiPolygon', 'coordinates': pols}


feats = []
etis = {}
for d in ORDRE:
    x = DIAL[d]
    e, pe = eti(FIN[d])
    etis[d] = pe
    feats.append({'type': 'Feature', 'properties': {'kod': d, 'ca': x['ca'], 'fr': x['fr'], 'oc': x['oc'], 'bloc': x['bloc'], 'color': x['color'], 'eti': e}, 'geometry': geojson_ll(DIAL2_LL[d])})
# La part de França, causida a despart (nom catalan : « Catalunya Nord ») :
# l'union de las comunas catalanas dels Pirenèus Orientals ; « dins » : los
# dialèctes que recobrís (Romain, 2026-10-08)
r = DIAL['rossellones']
e, pe = eti(en_m(NÒRD_LL))
feats.append({'type': 'Feature', 'properties': {'kod': 'catalunya-nord', 'ca': 'Catalunya Nord', 'fr': 'Catalogne du Nord', 'oc': 'Catalonha del Nòrd',
              'bloc': r['bloc'], 'color': r['color'], 'eti': e, 'apart': True, 'dins': DINS_NÒRD}, 'geometry': geojson_ll(NÒRD_LL)})
# Las zònas de parlar de transicion : per dessús los dialèctes, sens los
# traucar ni los remplaçar (lor rendut, en asclas, es fach per la carta)
for t, x in TRANSICIONS.items():
    if TRANS_LL[t].IsEmpty():
        continue
    e, pe = eti(en_m(TRANS_LL[t]))
    feats.append({'type': 'Feature', 'properties': {'kod': x['kod'], 'transicio': True, 'ca': x['ca'], 'fr': x['fr'], 'oc': x['oc'], 'oc_a_validar': True,
                  'entre': x['entre'], 'nota': x['nota'], 'eti': e}, 'geometry': geojson_ll(TRANS_LL[t])})
sortida = {
    'type': 'FeatureCollection',
    'font': "Comarcas, municipalitats e illas © contributors OpenStreetMap (ODbL) ; comunas de França : IGN ADMIN EXPRESS COG CARTO (Licéncia dobèrta 2.0) ; dialèctes : SIG/catalan/dialectes-catalan.csv (d'aprèp Veny) ; frontièra amb l'occitan : domeni occitan de la carta (limits-carta.json)",
    'a_validar': 'noms occitans (oc) : propausas, de validar per Romain',
    'domeni': {'anels': anels_dom, 'linhas': linhas},
    'features': feats,
}
json.dump(sortida, open(SORTIDA, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

# ------------------------------------------------- 6. rapòrt

print('\nTolerància %g m, tampon %g m' % (TOL, B))
print('%-16s %9s %8s %7s' % ('dialècte', 'km2', 'tròces', 'ponches'))
tot_p = 0
for f in feats:
    d = f['properties']['kod']
    g = FIN[d] if d in FIN else en_m(valid(ogr.CreateGeometryFromJson(json.dumps(f['geometry']))))
    n = sum(len(a) for p in f['geometry']['coordinates'] for a in p)
    tot_p += n
    print('%-16s %9.0f %8d %7d' % (d, km2(g), len(f['geometry']['coordinates']), n))
n_a = sum(len(a) for a in anels_dom)
n_l = sum(len(l) for l in linhas)
print('domeni : %.0f km2, %d anèls (%d ponches), dont %d traucs (%s) ; %d linhas de frontièra (%d ponches, %.0f km) ; %d segments sus la frontièra occitana (fòra de las linhas)' % (
    km2(domeni), len(anels_dom), n_a, len(traucs_dom), ', '.join('%.1f km2 a %s' % (km2(t), a_lonlat(t)) for t in traucs_dom),
    len(linhas), n_l, sum(math.hypot((l[j][0] - l[j - 1][0]) * 82000, (l[j][1] - l[j - 1][1]) * 111000) for l in linhas for j in range(1, len(l))) / 1000, n_seg_oc))
print('ponches en tot : %d ; fichièr : %.1f Ko' % (tot_p + n_a + n_l, os.path.getsize(SORTIDA) / 1024))

print('\nRaccord amb lo domeni occitan (zòna de contacte : %.0f km2 de tèrra a mens de %g m dels dos domenis) :' % (km2(tèrra_m), RACCORD))
print('  Fenolhedés escrich (%s) : %d comunas, %.1f km2, dont %.2f km2 defòra de limits-carta -> referéncia : %s' % (
    os.path.relpath(FENOLHEDES, SIG), len(fen_comunas), km2_ll(fen_ll), fen_mancant, 'limits-carta sol' if ref_ll is oc_ll else 'limits-carta + Fenolhedés'))
print('  %-28s %22s %22s' % ('', 'recobriment km2', 'vuèges km2'))
print('  %-28s %10s %11s %10s %11s' % ('', 'abans', 'aprèp', 'abans', 'aprèp'))
for s in SECTORS:
    print('  %-28s %10.3f %11.4f %10.3f %11.4f' % (s, abans['rec', s], aprèp['rec', s], abans['vuèg', s], aprèp['vuèg', s]))
print('  %-28s %10.3f %11.4f %10.3f %11.4f' % ('en tot', abans['rec'], aprèp['rec'], abans['vuèg'], aprèp['vuèg']))
print('  (los sectors se recobrisson un pauc a las frontièras d\'Estat : las somas pòdon despassar lo total)')
print('  vuèges tampats : %d tròces dins de comunas catalanas (%.2f km2), %d tròces entre doas fonts, defòra de tota comuna (%.2f km2) ; vuèges daissats de mens de %g km2 : %d (%.2f km2)' % (
    n_dins, a_dins, n_defòra, a_defòra, VUÈG_MAX, n_pichons, a_pichons))
for l in rapòrt_raccord:
    print(l)

# Verificacions sul fichièr escrich : geometrias valIdas, ni recobriment ni
# trauc entre dialèctes, etiquetas dedins, catalunya-nord e transicions dins los dialèctes,
# raccord amb l'occitan
rel = json.load(open(SORTIDA, encoding='utf-8'))
G, G_ll = {}, {}
for f in rel['features']:
    g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
    G_ll[f['properties']['kod']] = valid(g)
    if not g.IsValid():
        print('  ATENCION : geometria invalida per', f['properties']['kod'])
    g = en_m(g)
    G[f['properties']['kod']] = g
    e = ponch(*f['properties']['eti'])
    e.Transform(versM)
    if not g.Contains(e):
        print('  ATENCION : etiqueta defòra per', f['properties']['kod'])
G = {k: valid(g) for k, g in G.items()}
rec = sum(km2(valid(G[a].Intersection(G[b]))) for i, a in enumerate(ORDRE) for b in ORDRE[i + 1:] if G[a].Intersects(G[b]))
dom_f = ogr.Geometry(ogr.wkbPolygon)
for a in rel['domeni']['anels']:
    dom_f = dom_f.SymDifference(valid(poligon_ll(a)))  # règla « evenodd », coma la carta
dom_f = valid(dom_f)
u_ll = unir([G_ll[d] for d in ORDRE])
print('\nVerificacion sul fichièr :')
print('  recobriments entre dialèctes : %.4f km2 ; domeni sens dialècte : %.4f km2 ; dialèctes defòra del domeni : %.4f km2' % (
    rec, km2_ll(valid(dom_f.Difference(u_ll))), km2_ll(valid(u_ll.Difference(dom_f)))))
m_f = mesura(u_ll)
print('  raccord amb lo domeni occitan : recobriment %.4f km2 ; vuèges %.3f km2 (%d de mai de %g km2)' % (m_f['rec'], m_f['vuèg'], m_f['n_vuèg_1'], VUÈG_MAX))
n_v = sum(1 for f in [f for f in rel['features'] if f['properties']['kod'] in ORDRE] for p in f['geometry']['coordinates'] for a in p for x, y in a if (x, y) in VÈRT_OC)
n_vf = sum(1 for f in [f for f in rel['features'] if f['properties']['kod'] in ORDRE] for p in f['geometry']['coordinates'] for a in p for x, y in a if (x, y) in VÈRT_FEN)
n_vl = sum(1 for l in rel['domeni']['linhas'] for x, y in l if (x, y) in VÈRT_REF)
print('  ponches represes tal quals dins los dialèctes : %d de limits-carta, %d del Fenolhedés ; dins las linhas : %d' % (n_v, n_vf, n_vl))
for f in rel['features']:
    p = f['properties']
    if p['kod'] in ORDRE:
        continue
    gz = G_ll[p['kod']]
    print('  %s (%s%s) : %.1f km2, defòra dels dialèctes : %.4f km2%s' % (p['kod'], p['ca'], ', dins : ' + '+'.join(p['dins']) if 'dins' in p else ', entre : ' + ' / '.join(p['entre']), km2_ll(gz), km2_ll(valid(gz.Difference(u_ll))),
        ' ; comunas catalanas del 66 : %.1f km2' % km2(unir([u['g'] for u in unitats if u['regio'].startswith('Catalunya del Nord') and u['dial'] in DIAL])) if p['kod'] == 'catalunya-nord' else ''))
po = unir([u['g'] for u in unitats if u['regio'].startswith('Catalunya del Nord')])
print('  Pirenèus Orientals ni catalans ni dins lo domeni occitan : %.0f km2 (lo Fenolhedés, occitan segon lo CSV)' % km2(valid(po.Difference(occitan).Difference(domeni))))
# los tròces segondaris d'un dialècte que tòcan un autre dialècte (enclavas,
# exclavas de comarcas o de comunas, o classament de verificar)
print('Tròces segondaris (mai de 1 km2, pas d\'illas) :')
for d in ORDRE:
    pp = sorted(tròces(G[d]), key=lambda q: -q.GetArea())
    for q in pp[1:]:
        if km2(q) > 1 and any(q.Buffer(50, 2).Intersects(G[e]) for e in ORDRE if e != d):
            print('  %s : %.1f km2 a %s' % (d, km2(q), a_lonlat(q)))
print('\nUnitats sens classament :', len(fora))
for x in fora:
    print('  ' + x)
sens = [r for i, r in enumerate(linhas_csv) if i not in trobadas]
print('Linhas del CSV sens geometria :', len(sens))
for r in sens:
    print('  %s | %s | %s | %s' % (r['regio'], r['unitat'], r['nom_ca'], r['dialecte']))
print('Lo Carxe : %.1f km2 (zòna aproximativa, %d masatges amb coordenadas)' % (km2(carxe), len(masatges)))
