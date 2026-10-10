# Las lengas d'oïl sus la carta (demanda de Romain, 2026-10-09) : una familha
# de 9 lengas (lista Cerquiglini) e los parlars del Centre e de l'Oèst,
# fabricats a partir de las comunas de l'IGN. Cada comuna pren lo parlar del
# canton que conten son ponch interior dins la Carta lingüistica de França dels
# Archius nacionals (precision : lo canton de 2013). A partir de basc.py.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/oil.py [tolerància en mètres, 300 per defaut]
#
# Entradas : SIG/brut/oil/an-cantons-2013.geojson (Archius nacionals, vejatz
# SIG/oil/FONTS.md), SIG/oil/lengas-oil.json (regropament e colors),
# SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg (comunas IGN),
# app/static/data/limits-carta.json (domeni occitan) e arpitan.json (domeni
# arpitan), SIG/brut/mond/countries-50m.json (tèrra Natural Earth).
#
# Sortida : app/static/data/oil.json, FeatureCollection : un objècte per lenga
# (kod, fr, oc, color, grope, eti, parlars), e a la raiç « domeni » = { anels,
# linhas } : linhas = frontièras terrèstras amb las autras lengas (breton,
# lengas germanicas, Belgica...), sens la frontièra amb l'occitan e l'arpitan
# ni la còsta.
#
# Raccord : la frontièra amb l'occitan e l'arpitan es la de lors cartas, ponch
# per ponch, sens recobriment ni trauc ; las comunas que los Archius metan dins
# l'occitan o l'arpitan mas que son defòra de nòstres domenis prenon la lenga
# d'oïl vesina.
import csv, json, math, os, sys
from collections import defaultdict
from osgeo import gdal, ogr, osr

ogr.UseExceptions()
osr.UseExceptions()
gdal.PushErrorHandler('CPLQuietErrorHandler')

AQUI = os.path.dirname(os.path.abspath(__file__))
SIG = os.path.normpath(os.path.join(AQUI, '..'))
BRUT = os.path.join(SIG, 'brut', 'oil')
DATA = os.path.normpath(os.path.join(SIG, '..', 'app', 'static', 'data'))
SORTIDA = os.path.join(DATA, 'oil.json')

TOL = float(sys.argv[1]) if len(sys.argv) > 1 else 300.0
B = 150.0  # tampon que barra las fendas (m)

wgs, laea = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326)
laea.ImportFromEPSG(3035)
for s in (wgs, laea):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versM = osr.CoordinateTransformation(wgs, laea)
versW = osr.CoordinateTransformation(laea, wgs)


# ---------------------------------------------------------------- utilitaris
# (los meteisses que dins catalan.py)

def valid(g):
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
    t = ogr.GT_Flatten(g.GetGeometryType())
    return g.GetArea() if t in (ogr.wkbPolygon, ogr.wkbMultiPolygon, ogr.wkbGeometryCollection) else 0.0


def km2(g):
    return g.GetArea() / 1e6


def ponch(x, y):
    p = ogr.Geometry(ogr.wkbPoint)
    p.AddPoint_2D(x, y)
    return p


def poligon_ll(anel):
    r = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in anel:
        r.AddPoint_2D(x, y)
    r.CloseRings()
    p = ogr.Geometry(ogr.wkbPolygon)
    p.AddGeometry(r)
    return p


def en_m(g):
    c = g.Clone()
    c.Transform(versM)
    return c


def en_ll(g):
    c = g.Clone()
    c.Transform(versW)
    return c


def a_lonlat(t):
    c = t.PointOnSurface()
    c.Transform(versW)
    return '%.3f, %.3f' % (c.GetX(), c.GetY())


# ------------------------------------------------- 1. unitats e classament

classa = json.load(open(os.path.join(SIG, 'oil', 'lengas-oil.json'), encoding='utf-8'))
DIAL = {d['kod']: d for d in classa['lengas']}
ORDRE = [d['kod'] for d in classa['lengas']]
ZONA = {z: d['kod'] for d in classa['lengas'] for z in d['zonas']}
DOMS = ('oil',)
PAS = 20000.0  # grasilha dels indèxes (m)

# los cantons dels Archius nacionals (CRS84), en mètres, indexats en grasilha
cantons = []
for f in json.load(open(os.path.join(BRUT, 'an-cantons-2013.geojson'), encoding='utf-8'))['features']:
    p = f['properties']
    g = valid(en_m(ogr.CreateGeometryFromJson(json.dumps(f['geometry']))))
    cantons.append((str(p['N° ZONE']), p['DIALECTE'], g))
grasilha_c = defaultdict(list)
for i, (_, _, g) in enumerate(cantons):
    x0, x1, y0, y1 = g.GetEnvelope()
    for gx in range(int(x0 // PAS), int(x1 // PAS) + 1):
        for gy in range(int(y0 // PAS), int(y1 // PAS) + 1):
            grasilha_c[(gx, gy)].append(i)
# los parlars dels Archius dins cada lenga (« francien » : las sonam
# parlars d'Illa de França, lo francien es una construccion del sègle XIX)
PARLARS = defaultdict(set)
for z, dia, _ in cantons:
    if z in ZONA:
        if ZONA[z] != 'picard':
            PARLARS[ZONA[z]].add('île-de-France' if dia == 'francien' else dia)


def canton_de(pt):
    x, y = pt.GetX(), pt.GetY()
    for i in grasilha_c.get((int(x // PAS), int(y // PAS)), ()):
        if cantons[i][2].Contains(pt):
            return i
    # (los cantons son generalizats : sus la còsta e los bòrds, lo pus pròche
    # a mens de 5 km)
    best, bd = None, 5000.0
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            for i in grasilha_c.get((int(x // PAS) + dx, int(y // PAS) + dy), ()):
                d = cantons[i][2].Distance(pt)
                if d < bd:
                    best, bd = i, d
    return best


# las comunas de l'IGN (fòra Corsega)
l93 = osr.SpatialReference()
l93.ImportFromEPSG(2154)
l93.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
l93_laea = osr.CoordinateTransformation(l93, laea)
gp = ogr.Open(os.path.join(SIG, 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
cm = gp.GetLayerByName('commune')
cm.SetAttributeFilter("code_insee_du_departement NOT IN ('2A', '2B')")
geo, zona_de, nom_de = {}, {}, {}
sens_canton = []
for f in cm:
    c = f.GetField('code_insee')
    g = f.GetGeometryRef().Clone()
    g.Transform(l93_laea)
    geo[c] = valid(g)
    nom_de[c] = f.GetField('nom_officiel')
    i = canton_de(geo[c].PointOnSurface())
    zona_de[c] = None if i is None else cantons[i][0]
    if i is None:
        sens_canton.append(nom_de[c])
print('Comunas : %d ; sens canton a mens de 5 km : %d (%s)' % (len(geo), len(sens_canton), ', '.join(sens_canton[:10]) or 'cap'))

# Los dialèctes picards (Romain, 2026-10-10) : lo parlar de cada comuna
# d'aprèp la carta dels parlars picards de Wikipèdia (picard-carta.py) ; ch'ti
# (Artesian urban, Doaisian), rochi (Lillés, Valencianés, Cambresin...),
# picard pels autres
PIC = {r['insee']: r for r in csv.DictReader(open(os.path.join(SIG, 'oil', 'parlars-picards.csv'), encoding='utf-8'), delimiter=';')}


def clau_de(c, k):
    if k == 'picard' and c in PIC and float(PIC[c]['dist_km']) <= 15:
        PARLARS[PIC[c]['zona']].add(PIC[c]['parlar'])
        return PIC[c]['zona']
    return k


unitats = [{'codi': c, 'nom': nom_de[c], 'dial': ZONA[z], 'domeni': 'oil', 'clau': clau_de(c, ZONA[z]), 'g': geo[c]}
           for c, z in zona_de.items() if z in ZONA]
# La Belgica romana (2026-10-10, SIG/oil-belgica/FONTS.md) : valon e sos
# quatre dialèctes (en sosdialèctes del valon, coma lo ch'ti dins lo picard),
# picard, gaumés (lorren), campanés ; contorns terrèstres de SIG/brut/flamenc
BEL = os.path.join(SIG, 'oil-belgica', 'dialectes-oil-belgica.csv')
BEG = os.path.join(SIG, 'brut', 'flamenc', 'be-comunas.geojson')
MAP_BE = {'valon': 'wallon', 'picard': 'picard', 'lorren': 'lorrain', 'campanes': 'champenois'}
SOT_BE = {'lieges': 'valon_lieges', 'namures': 'valon_namures', 'oest_valon': 'valon_oest', 'sud_valon': 'valon_sud'}
n_be = 0
if os.path.exists(BEL) and os.path.exists(BEG):
    geo_be = {f['properties']['codi']: f['geometry'] for f in json.load(open(BEG, encoding='utf-8'))['features'] if f.get('geometry')}
    for r in csv.DictReader(open(BEL, encoding='utf-8-sig'), delimiter=';'):
        if r['domeni'] != 'oil' or r['dialecte'] not in MAP_BE or r['codi'] not in geo_be:
            continue
        k = MAP_BE[r['dialecte']]
        if k == 'wallon' and r['parlar'] in SOT_BE:
            k = SOT_BE[r['parlar']]
        g = valid(en_m(ogr.CreateGeometryFromJson(json.dumps(geo_be[r['codi']]))))
        geo[r['codi']] = g
        unitats.append({'codi': r['codi'], 'nom': r['nom_oficial'], 'dial': k, 'domeni': 'oil', 'clau': k, 'g': g})
        n_be += 1
print('Belgica romana : %d comunas' % n_be, flush=True)
print('Unitats : %d comunas d\'oïl (%s)' % (len(unitats), ', '.join('%s %d' % (k, sum(u['clau'] == k for u in unitats)) for k in ORDRE)))


# La barrièra : domeni occitan e domeni arpitan (anèls « evenodd ») ; lors
# ponches seràn gardats tal quals
def domeni_evenodd(anels):
    g = ogr.Geometry(ogr.wkbPolygon)
    for a in anels:
        g = g.SymDifference(valid(poligon_ll(a)))
    return valid(g)


lim_oc = json.load(open(os.path.join(DATA, 'limits-carta.json'), encoding='utf-8'))['domeni']
lim_frp = json.load(open(os.path.join(DATA, 'arpitan.json'), encoding='utf-8'))['domeni']
# las lengas traçadas comuna per comuna aprèp l'oïl (2026-10-10) : l'oïl s'arrèsta
# sus lor frontièra ; las comunas que los Archius i metan e que son defòra
# prenon la lenga d'oïl vesina (zònas dels Archius : 6 breton, 7.1 flamenc,
# 7.2 a 7.5 alemanic e francic)
VESINAS = {'breton.json': ('6',), 'flamenc.json': ('7.1',), 'alsacian.json': ('7.4', '7.5'), 'francic.json': ('7.2', '7.3')}
anels_v, ZONAS_V = [], ()
for fic, zs in VESINAS.items():
    if os.path.exists(os.path.join(DATA, fic)):
        anels_v += json.load(open(os.path.join(DATA, fic), encoding='utf-8'))['domeni']['anels']
        ZONAS_V += zs
print('Barrièra : occitan, arpitan%s' % ''.join(', ' + f[:-5] for f in VESINAS if os.path.exists(os.path.join(DATA, f))))
oc_ll = unir([domeni_evenodd(lim_oc['anels']), domeni_evenodd(lim_frp['anels'])] + ([domeni_evenodd(anels_v)] if anels_v else []))
VÈRT_OC = {(x, y) for a in lim_oc['anels'] + lim_frp['anels'] + anels_v for x, y in a}
oc_m = en_m(oc_ll)

# ------------------------------------------------- 2. union per clau

CLAUS = [k for k in ORDRE if any(u['clau'] == k for u in unitats)]
print('Claus :', ', '.join(CLAUS))
dom_brut = unir([u['g'] for u in unitats])
oc_local = valid(oc_m.Intersection(dom_brut.Buffer(20000, 4)))
brut = {}
pres = ogr.Geometry(ogr.wkbMultiPolygon)
rapòrt = []
for k in CLAUS:
    g = unir([u['g'] for u in unitats if u['clau'] == k])
    r = valid(g.Intersection(oc_local))
    if km2(r) > 0.01:
        rapòrt.append('%s : %.1f km2 dins l\'occitan o l\'arpitan, levats' % (k, km2(r)))
    g = valid(g.Difference(oc_local))
    if not pres.IsEmpty():
        g = valid(g.Difference(pres))
    brut[k] = g
    pres = unir([pres, g])

# Las comunas que los Archius metan dins l'occitan o l'arpitan (o sens canton)
# mas que son defòra de nòstres domenis : a la lenga d'oïl vesina, de man en
# man (una tèrra pus luènha pren la lenga de sas vesinas ja rengadas)
autras = [geo[c] for c, z in zona_de.items() if z is None or z[0] in '23' or z in ZONAS_V]
# lo Jura soís (Ajoie, Delémont, Jura bernés : franc-comtés, retorn de Romain
# 2026-10-10) : las comunas de JU, BE, NE e SO que son ni arpitanas ni
# alemanicas prenon la lenga d'oïl vesina (SIG/brut/alsacian/ch-comunas.geojson,
# swisstopo)
CH = os.path.join(SIG, 'brut', 'alsacian', 'ch-comunas.geojson')
n_ch = 0
if os.path.exists(CH):
    for f in json.load(open(CH, encoding='utf-8'))['features']:
        if (f['properties'].get('unitat') in ('JU', 'BE', 'NE', 'SO')) and f.get('geometry'):
            autras.append(valid(en_m(ogr.CreateGeometryFromJson(json.dumps(f['geometry'])))))
            n_ch += 1
print('Comunas soïssas del Jura e a l entorn : %d' % n_ch, flush=True)
autras_m = unir(autras)
comunas_tot = unir([dom_brut, autras_m])
resta = valid(autras_m.Difference(oc_m).Difference(pres))
# tampa tanben las fendas finas (mens de 2 B_OC) entre las comunas e la linha
# de la barrièra (sonque al ras de la linha : pas las calas de la còsta)
B_OC = 400.0
benda = oc_local.Buffer(3000, 4)
tot = valid(unir([pres, oc_local]).Intersection(benda))
fendas_oc = valid(valid(valid(tot.Buffer(B_OC, 8).Buffer(-B_OC, 8)).Difference(tot)).Intersection(oc_local.Buffer(1500, 4)))
resta = unir([resta, fendas_oc])
grasilha_u = defaultdict(list)  # (geometria, clau) de las comunas d'oïl e dels tròces rengats


def indexar(g, k):
    x0, x1, y0, y1 = g.GetEnvelope()
    for gx in range(int(x0 // PAS), int(x1 // PAS) + 1):
        for gy in range(int(y0 // PAS), int(y1 // PAS) + 1):
            grasilha_u[(gx, gy)].append((g, k))


for u in unitats:
    indexar(u['g'], u['clau'])


def contactes(q):
    qb = q.Buffer(10, 2)
    x0, x1, y0, y1 = qb.GetEnvelope()
    vist, c = set(), defaultdict(float)
    for gx in range(int(x0 // PAS), int(x1 // PAS) + 1):
        for gy in range(int(y0 // PAS), int(y1 // PAS) + 1):
            for g, k in grasilha_u.get((gx, gy), ()):
                if id(g) in vist:
                    continue
                vist.add(id(g))
                if qb.Intersects(g):
                    c[k] += aira(qb.Intersection(g))
    return c


apond = defaultdict(list)
daissats = [q.Clone() for q in tròces(resta) if q.GetArea() > 1]
for _ in range(50):
    demòra = []
    for q in daissats:
        c = contactes(q)
        if c:
            k = max(c, key=c.get)
            apond[k].append(q)
            indexar(q, k)
        else:
            demòra.append(q)
    if len(demòra) == len(daissats):
        break
    daissats = demòra
for k in CLAUS:
    if apond[k]:
        brut[k] = valid(unir([brut[k]] + apond[k]).Difference(oc_local))
rapòrt.append('tèrras dels Archius occitanas o arpitanas defòra de nòstres domenis : %.1f km2 apondudas a l\'oïl (%d tròces) ; %d tròces sens vesina d\'oïl, daissats (%.1f km2)' % (
    sum(km2(q) for v in apond.values() for q in v), sum(len(v) for v in apond.values()), len(daissats), sum(km2(q) for q in daissats)))
for q in sorted(daissats, key=lambda q: -q.GetArea())[:6]:
    if km2(q) > 1:
        rapòrt.append('  daissat %.1f km2 a %s' % (km2(q), a_lonlat(q)))

# fendas intèrnas (entre doas fonts, Soïssa contra França, Itàlia...) : a la
# clau que ne tòca mai ; los traucs de mai de 1,5 km2 (lacs) demòran
P = dict(brut)
tot = unir(list(P.values()))
fendas = valid(valid(tot.Buffer(B, 8).Buffer(-B, 8)).Difference(tot).Difference(oc_local))
n_f = 0
for q in tròces(fendas):
    if q.GetArea() < 500:
        continue
    qb = q.Buffer(10, 2)
    c = {k: aira(qb.Intersection(P[k])) if qb.Intersects(P[k]) else 0 for k in CLAUS}
    k = max(c, key=c.get)
    if c[k] > 0:
        P[k] = unir([P[k], q.Clone()])
        n_f += 1
rapòrt.append('fendas intèrnas tampadas : %d tròces, %.2f km2' % (n_f, km2(fendas)))
for r in rapòrt:
    print('  ' + r)

# ------------------------------------------------- 3. simplificacion topologica


def anèls(g):
    for p in tròces(g):
        for k in range(p.GetGeometryCount()):
            yield p.GetGeometryRef(k)


# l'occitan entra dins la particion coma clau « OC » (los arcs de sa frontièra
# son pas simplificats, per gardar sos ponches)
OC_CLAU = valid(oc_local.Intersection(unir(list(P.values())).Buffer(5000, 4)))
CLAUS_P = CLAUS + ['OC']
P['OC'] = OC_CLAU
tòtas = ogr.Geometry(ogr.wkbMultiLineString)
for d in CLAUS_P:
    for a in anèls(P[d]):
        l = ogr.Geometry(ogr.wkbLineString)
        for k in range(a.GetPointCount()):
            l.AddPoint_2D(a.GetX(k), a.GetY(k))
        tòtas.AddGeometry(l)
nosat = tòtas.UnaryUnion()
segs = [[(nosat.GetGeometryRef(k).GetX(j), nosat.GetGeometryRef(k).GetY(j)) for j in range(nosat.GetGeometryRef(k).GetPointCount())] for k in range(nosat.GetGeometryCount())]
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
oc_bòrd_m = OC_CLAU.GetBoundary()


def sus_oc(arc):
    """L'arc seguís la frontièra occitana (sos ponches de mitan i son)."""
    mids = [arc[len(arc) // 2]] + ([((arc[0][0] + arc[1][0]) / 2, (arc[0][1] + arc[1][1]) / 2)] if len(arc) > 1 else [])
    return all(oc_bòrd_m.Distance(ponch(x, y)) < 0.5 for x, y in mids)


ml_s, ml_f = ogr.Geometry(ogr.wkbMultiLineString), ogr.Geometry(ogr.wkbMultiLineString)
n_oc = 0
for a in arcs:
    l = ogr.Geometry(ogr.wkbLineString)
    for x, y in a:
        l.AddPoint_2D(x, y)
    if sus_oc(a):
        ml_f.AddGeometry(l)
        n_oc += 1
    else:
        ml_s.AddGeometry(l)
simple = ml_s.SimplifyPreserveTopology(TOL)
for k in range(ml_f.GetGeometryCount()):
    simple.AddGeometry(ml_f.GetGeometryRef(k).Clone())
print('Arcs : %d, dont %d sus la frontièra occitana (pas simplificats) ; %d ponches -> %d' % (
    len(arcs), n_oc, sum(len(a) for a in arcs), sum(simple.GetGeometryRef(k).GetPointCount() for k in range(simple.GetGeometryCount()))))
facias = simple.UnaryUnion().Polygonize()
fac_d, traucs = [], []
for k in range(facias.GetGeometryCount()):
    f = facias.GetGeometryRef(k).Clone()
    cobs = {d: (aira(f.Intersection(P[d])) if f.Intersects(P[d]) else 0) for d in CLAUS_P}
    if sum(cobs.values()) < 0.5 * f.GetArea():
        traucs.append(f)
    else:
        fac_d.append([f, max(cobs, key=cobs.get)])


def vesins(f):
    fb = f.Buffer(5, 2)
    v = defaultdict(float)
    for f2, d2 in fac_d:
        if f2 is not f and d2 not in (None, 'OC') and fb.Intersects(f2):
            v[d2] += aira(fb.Intersection(f2))
    return v


traucs_gardats = []
for f in traucs:
    # (retorn de Romain, 2026-10-09 : « pourquoi des trous sur des zones non
    # habitées ? ») : tot trau enviroutat pel domeni pren la zòna de sos vesins,
    # quina que siá sa talha : enclavas non vascofònas de la zòna mixta de Navarra
    # (Guirguillano, Uterga, Úcar...), tèrras pas cobèrtas per las comunas d'OSM
    # en Araba, enclava cantabra de Villaverde dins las Encartacions
    v = vesins(f)
    if v:
        fac_d.append([f, max(v, key=v.get)])
    else:
        traucs_gardats.append(f)
for e in sorted(fac_d, key=lambda e: e[0].GetArea()):
    f = e[0]
    if f.GetArea() >= 1e6:
        break
    if e[1] == 'OC':
        continue
    v = vesins(f)
    if v:
        e[1] = max(v, key=v.get)
    elif f.GetArea() < 0.3e6:
        e[1] = None
FIN = {d: unir([f for f, d2 in fac_d if d2 == d]) for d in CLAUS}

# ------------------------------------------------- 4. lon/lat, domeni e frontièras


def fmt(pts):
    """Ponches [lon, lat] : los de la frontièra occitana tal quals (coma dins
    limits-carta.json), los autres a 4 decimalas, sens doblons. Los ponches
    alinhats amb lors vesins (a mens de 0,5 m de la drecha), coma los
    crosaments de las limitas comunalas amb la linha occitana, son levats
    abans l'arredondiment : la forma cambia pas (geojson_ll repara las
    geometrias que l'arredondiment rend invalidas)."""
    def alinhat(a, b, c):
        kx = 111320 * math.cos(math.radians(b[1]))
        ax, ay, cx, cy = (b[0] - a[0]) * kx, (b[1] - a[1]) * 110570, (c[0] - a[0]) * kx, (c[1] - a[1]) * 110570
        L = math.hypot(cx, cy)
        if L == 0:
            return True
        t = (ax * cx + ay * cy) / (L * L)
        return 0 <= t <= 1 and abs(ax * cy - ay * cx) / L < 0.5
    gard = []
    for i, p in enumerate(pts):
        if gard and 0 < i < len(pts) - 1 and p not in VÈRT_OC and alinhat(gard[-1], p, pts[i + 1]):
            continue
        gard.append(p)
    out = []
    for x, y in gard:
        q = [x, y] if (x, y) in VÈRT_OC else [round(x, 4), round(y, 4)]
        if not out or q != out[-1]:
            out.append(q)
    return out


# Lo ponch occitan pus pròche (a mens de 1e-6 gra) remplaça lo ponch tornat
# projectar : la frontièra repren exactament las coordenadas occitanas
grilha = defaultdict(list)
for x, y in VÈRT_OC:
    grilha[(round(x, 3), round(y, 3))].append((x, y))


def aimantar(x, y):
    best, bd = None, 1e-6
    cx, cy = round(x, 3), round(y, 3)
    for i in (-1, 0, 1):
        for j in (-1, 0, 1):
            for p in grilha.get((round(cx + i * 0.001, 3), round(cy + j * 0.001, 3)), ()):
                d = abs(p[0] - x) + abs(p[1] - y)
                if d < bd:
                    best, bd = p, d
    return best or (x, y)


def geom_ll(g_m):
    """Geometria en mètres -> lon/lat, ponches aimantats a la frontièra
    occitana, autres arredondits a 4 decimalas."""
    gj = json.loads(valid(en_ll(valid(g_m))).ExportToJson())
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for pol in gj['coordinates']:
        p = ogr.Geometry(ogr.wkbPolygon)
        for a in pol:
            r = ogr.Geometry(ogr.wkbLinearRing)
            for x, y in a:
                q = aimantar(x, y)
                if q == (x, y):
                    q = (round(x, 4), round(y, 4))
                r.AddPoint_2D(*q)
            r.CloseRings()
            if r.GetPointCount() >= 4:
                p.AddGeometry(r)
        if p.GetGeometryCount():
            m.AddGeometry(p)
    return valid(m)


CLAU_LL = {k: geom_ll(FIN[k]) for k in CLAUS}
# lo domeni occitan es levat (las coordenadas arredondidas pòdon i mordre de
# qualques mètres), sens tornar simplificar
for k in CLAUS:
    CLAU_LL[k] = valid(CLAU_LL[k].Difference(oc_ll))
# los vuèges que la simplificacion daissa entre lo basc e la linha occitana,
# dins las comunas conegudas : a la clau que ne tòca mai
comunas_ll = valid(en_ll(comunas_tot.SimplifyPreserveTopology(TOL)))
zona_ll = valid(en_ll(oc_local.Buffer(3000, 4)).Intersection(en_ll(dom_brut.Buffer(3000, 4))))
vuèg_ll = valid(zona_ll.Intersection(comunas_ll).Difference(oc_ll).Difference(unir(list(CLAU_LL.values()))))
vuèg_ll = unir([q for q in tròces(vuèg_ll) if km2(en_m(q)) < 1])  # (los grands : pas de tampar, signalats)
n_v = 0
for q in tròces(vuèg_ll):
    qb = q.Buffer(2e-5, 2)
    c = {k: aira(qb.Intersection(CLAU_LL[k])) if qb.Intersects(CLAU_LL[k]) else 0 for k in CLAUS}
    k = max(c, key=c.get)
    if c[k] > 0:
        CLAU_LL[k] = valid(unir([CLAU_LL[k], q.Clone()]).Difference(oc_ll))
        n_v += 1
print('Vuèges amb l\'occitan tampats aprèp simplificacion : %d tròces, %.2f km2' % (n_v, km2(en_m(vuèg_ll))))
pres_ll = ogr.Geometry(ogr.wkbMultiPolygon)
for k in CLAUS:  # (sens recobriment entre claus aprèp lo tampatge)
    CLAU_LL[k] = valid(CLAU_LL[k].Difference(pres_ll))
    pres_ll = unir([pres_ll, CLAU_LL[k]])
# Netejatge del bòrd occitan : los comblaments daissan de pichons zigzags al
# ras de la linha occitana. Cada clau es espandida de ESPAND (sonque dins una
# benda de ESPAND a l'entorn de la linha occitana), puèi lo domeni occitan e
# las claus ja passadas ne son levats : los zigzags passan darrièr la linha,
# e lo bòrd seguís exactament sos sommets.
ESPAND = 0.0007  # gra (environ 55 m en longitud, 78 m en latitud)
benda_oc = valid(oc_ll.Buffer(ESPAND, 2)).Difference(oc_ll)
pres_ll = ogr.Geometry(ogr.wkbMultiPolygon)
a_e = 0.0
for k in CLAUS:
    abans_k = km2(en_m(CLAU_LL[k]))
    g = unir([CLAU_LL[k], valid(CLAU_LL[k].Buffer(ESPAND, 1).Intersection(benda_oc))])
    CLAU_LL[k] = valid(g.Difference(oc_ll).Difference(pres_ll))
    a_e += km2(en_m(CLAU_LL[k])) - abans_k
    pres_ll = unir([pres_ll, CLAU_LL[k]])
print('Netejatge del bòrd occitan : %.2f km2 apondut al ras de la linha' % a_e)
# los illòts isolats de mens de 1 km2 (tròces de bocatge dins l'Alèir...) son levats
illòts = [p.Clone() for p in tròces(unir(list(CLAU_LL.values()))) if km2(en_m(p)) < 1]
if illòts:
    ill = unir(illòts)
    for k in CLAUS:
        CLAU_LL[k] = valid(CLAU_LL[k].Difference(ill.Buffer(1e-6, 1)))
    print('Illòts levats : %d (%.2f km2)' % (len(illòts), sum(km2(en_m(p)) for p in illòts)))
DIAL_LL = {d: unir([CLAU_LL[k] for k in CLAUS if k.split('|')[0] == d]) for d in ORDRE}
domeni_ll = unir(list(DIAL_LL.values()))
# Los dialèctes d'una lenga de la familha (ch'ti e rochi dins lo picard,
# retorn de Romain 2026-10-10 : « pas au même niveau qu'une autre langue
# d'oïl ») : la lenga los recòbre ; la carta los mòstra quand es causida
SOTS = [d for d in ORDRE if DIAL[d].get('de')]
for d in SOTS:
    DIAL_LL[DIAL[d]['de']] = unir([DIAL_LL[DIAL[d]['de']], DIAL_LL[d]])
NIV1 = [d for d in ORDRE if d not in SOTS]

# La tèrra a l'entorn : Natural Earth (Espanha, França), rosigada de 1,5 km
# (sa còsta es generalizada), e las comunas precisas defòra del domeni
topo = json.load(open(os.path.join(SIG, 'brut', 'mond', 'countries-50m.json'), encoding='utf-8'))
sc, trn = topo['transform']['scale'], topo['transform']['translate']
arcs_ne = []
for a in topo['arcs']:
    x = y = 0
    pts = []
    for dx, dy in a:
        x += dx
        y += dy
        pts.append((x * sc[0] + trn[0], y * sc[1] + trn[1]))
    arcs_ne.append(pts)


def anel_ne(idxs):
    pts = []
    for i in idxs:
        a = arcs_ne[i] if i >= 0 else arcs_ne[~i][::-1]
        pts += a if not pts else a[1:]
    return pts


dom_m = en_m(domeni_ll)
zonaT = dom_m.Buffer(30000, 4)
ne = []
for o in topo['objects']['countries']['geometries']:
    if o.get('properties', {}).get('name') in ('France', 'Belgium', 'Luxembourg', 'Germany', 'Switzerland'):
        for p in (o['arcs'] if o['type'] == 'MultiPolygon' else [o['arcs']]):
            q = valid(en_m(valid(poligon_ll(anel_ne(p[0])))))
            if q.Intersects(zonaT):
                ne.append(valid(q.Intersection(zonaT)))
# (las comunas bretonas, germanicas, basquas e catalanas)
precisas = [geo[c] for c, z in zona_de.items() if z and z[0] in '4567' and geo[c].Intersects(zonaT)]
# (coma pel catalan : las comunas precisas a 300 m o 1 km ; Natural Earth
# sonque a 2 km E a 6 km, que sa còsta escafa las calas e las rias)
# (sonque una benda a l'entorn del bòrd del domeni : los tèsts se fan a 300 m
# e 1 km (comunas), 2 e 6 km (Natural Earth) ; los polígons entièrs fasián
# durar lo calcul mai d'una ora)
bòrd_dom = dom_m.Boundary()
benda_p, benda_ne = bòrd_dom.Buffer(1500, 2), bòrd_dom.Buffer(7000, 2)
tèrra_p = valid(valid(unir([g for g in precisas if g.Intersects(benda_p)]).Intersection(benda_p)).Difference(dom_m.Buffer(10, 4)))
tèrra_ne = valid(valid(valid(unir(ne).Buffer(-1500, 4)).Intersection(benda_ne)).Difference(dom_m.Buffer(10, 4)))
print('Tèrra a l entorn : %d comunas dins la benda' % sum(1 for g in precisas if g.Intersects(benda_p)), flush=True)
oc_b_ll = oc_ll.GetBoundary()
ox0, ox1, oy0, oy1 = oc_ll.GetEnvelope()
anels_dom, linhas = [], []
n_seg = defaultdict(int)
for p, k in [(p, k) for p in tròces(domeni_ll) for k in range(p.GetGeometryCount())]:
    a = p.GetGeometryRef(k)
    pll = [(a.GetX(j), a.GetY(j)) for j in range(a.GetPointCount())]
    pts = []
    for x, y in pll:
        q = ponch(x, y)
        q.Transform(versM)
        pts.append((q.GetX(), q.GetY()))
    s = sum(pts[j][0] * pts[j + 1][1] - pts[j + 1][0] * pts[j][1] for j in range(len(pts) - 1))
    sgn = (1 if s > 0 else -1) * (1 if k == 0 else -1)
    mena = []
    for j in range(len(pts) - 1):
        mx_ll, my_ll = (pll[j][0] + pll[j + 1][0]) / 2, (pll[j][1] + pll[j + 1][1]) / 2
        if ox0 - 0.01 <= mx_ll <= ox1 + 0.01 and oy0 - 0.01 <= my_ll <= oy1 + 0.01 and oc_b_ll.Distance(ponch(mx_ll, my_ll)) < 1e-6:
            mena.append('oc')
            continue
        (x0, y0), (x1, y1) = pts[j], pts[j + 1]
        L = math.hypot(x1 - x0, y1 - y0) or 1
        nx, ny = sgn * (y1 - y0) / L, -sgn * (x1 - x0) / L
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        if any(oc_m.Contains(ponch(mx + nx * e, my + ny * e)) for e in (100, 400)):
            mena.append('oc')
        elif k > 0 or any(tèrra_p.Contains(ponch(mx + nx * e, my + ny * e)) for e in (300, 1000)) or all(tèrra_ne.Contains(ponch(mx + nx * e, my + ny * e)) for e in (2000, 6000)):
            mena.append('tèrra')
        else:
            mena.append('mar')
    n = len(mena)
    if n > 2:
        mena = [mena[(j - 1) % n] if mena[(j - 1) % n] == mena[(j + 1) % n] != mena[j] else mena[j] for j in range(n)]
    for m in mena:
        n_seg[m] += 1
    anels_dom.append(fmt(pll))
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
anels_dom = [a for a in anels_dom if len(a) >= 4]

# ------------------------------------------------- 5. etiquetas e escritura


def eti(g):
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
    return [round(c.GetX(), 3), round(c.GetY(), 3)]


def geojson_ll(g):
    pols = []
    for p in tròces(g):
        anels = [fmt([(a.GetX(j), a.GetY(j)) for j in range(a.GetPointCount())]) for a in (p.GetGeometryRef(k) for k in range(p.GetGeometryCount()))]
        anels = [a for a in anels if len(a) >= 4]
        if anels:
            pols.append(anels)
    gj = {'type': 'MultiPolygon', 'coordinates': pols}
    r = ogr.CreateGeometryFromJson(json.dumps(gj))
    if not r.IsValid():  # (anèls que se tòcan aprèp l'arredondiment)
        gj = json.loads(valid(r).ExportToJson())
        gj = {'type': 'MultiPolygon', 'coordinates': gj['coordinates'] if gj['type'] == 'MultiPolygon' else [gj['coordinates']]}
    return gj


def props_dial(x):
    p = {'kod': x['kod'], 'fr': x['fr'], 'oc': x['oc'], 'color': x.get('color', '#a48cff'), 'grope': x['grope']}
    for k in ('de', 'sota_fr', 'sota_oc'):
        if k in x:
            p[k] = x[k]
    return p


feats = []
for d in ORDRE:
    x = DIAL[d]
    # (etiqueta : la del JSON se n'i a una, plaçada luènh de las vilas ; si que non, lo mitan pus larg de la zòna)
    feats.append({'type': 'Feature', 'properties': {**props_dial(x), 'eti': x.get('eti') or eti(en_m(DIAL_LL[d])),
                  'parlars': sorted(PARLARS[d])}, 'geometry': geojson_ll(DIAL_LL[d])})
sortida = {
    'type': 'FeatureCollection',
    'font': classa['font'],
    'gropes': classa['gropes'],
    'a_validar': classa['a_validar'],
    'domeni': {'anels': anels_dom, 'linhas': linhas},
    'features': feats,
}
json.dump(sortida, open(SORTIDA, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

# ------------------------------------------------- 6. rapòrt

print('\nTolerància %g m' % TOL)
tot_p = 0
for f in feats:
    n = sum(len(a) for p in f['geometry']['coordinates'] for a in p)
    tot_p += n
    g = valid(ogr.CreateGeometryFromJson(json.dumps(f['geometry'])))
    print('  %-18s %8.0f km2 %5d tròces %6d ponches' % (f['properties']['kod'], km2(en_m(g)), len(f['geometry']['coordinates']), n))
n_a = sum(len(a) for a in anels_dom)
print('domeni : %.0f km2, %d anèls (%d ponches) ; %d linhas (%d ponches) ; segments : %s' % (
    km2(en_m(domeni_ll)), len(anels_dom), n_a, len(linhas), sum(len(l) for l in linhas), dict(n_seg)))
print('traucs gardats (lacs, enclavas) : %s' % (', '.join('%.1f km2 a %s' % (km2(t), a_lonlat(t)) for t in traucs_gardats) or 'cap'))
print('fichièr : %.1f Ko (%d ponches)' % (os.path.getsize(SORTIDA) / 1024, tot_p + n_a))

# Verificacions
rel = json.load(open(SORTIDA, encoding='utf-8'))
G = {}
for f in rel['features']:
    g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
    if not g.IsValid():
        print('  ATENCION : geometria invalida per', f['properties']['kod'])
    G[f['properties']['kod']] = valid(g)
    if not g.Contains(ponch(*f['properties']['eti'])):
        print('  ATENCION : etiqueta defòra per', f['properties']['kod'])
rec = sum(km2(en_m(valid(G[a].Intersection(G[b])))) for i, a in enumerate(NIV1) for b in NIV1[i + 1:] if G[a].Intersects(G[b]))
u_ll = unir([G[d] for d in ORDRE])
rec_oc = km2(en_m(valid(u_ll.Intersection(oc_ll))))
zona = valid(en_ll(oc_local.Buffer(3000, 4)).Intersection(en_ll(dom_brut.Buffer(3000, 4))))
vuèg = valid(valid(valid(valid(zona).Difference(oc_ll)).Difference(u_ll)).Intersection(valid(en_ll(comunas_tot))))
print('\nVerificacion : recobriments entre dialèctes %.4f km2 ; recobriment amb l\'occitan %.4f km2 ; vuèges amb l\'occitan (dins de comunas) %.3f km2 (%d de mai de 0,1 km2)' % (
    rec, rec_oc, km2(en_m(vuèg)), sum(1 for q in tròces(vuèg) if km2(en_m(q)) > 0.1)))
for q in tròces(vuèg):
    if km2(en_m(q)) > 0.1:
        print('  vuèg %.2f km2 a %s' % (km2(en_m(q)), a_lonlat(en_m(q))))
n_v = sum(1 for d in ORDRE for p in rel['features'][ORDRE.index(d)]['geometry']['coordinates'] for a in p for x, y in a if (x, y) in VÈRT_OC)
print('ponches de la frontièra occitana represes tal quals : %d' % n_v)
for d in ORDRE:
    pp = sorted(tròces(en_m(G[d])), key=lambda q: -q.GetArea())
    for q in pp[1:]:
        if km2(q) > 1:
            print('  tròç segondari %s : %.1f km2 a %s' % (d, km2(q), a_lonlat(q)))
# los vuèges defòra de las comunas conegudas, entre lo basc e l'occitan
# (lo domeni occitan de la carta que s'arrèsta abans lo despartament)
ext = valid(zona_ll.Difference(oc_ll).Difference(u_ll).Difference(comunas_ll))
grands = sorted([q for q in tròces(ext) if km2(en_m(q)) > 1], key=lambda q: -q.GetArea())
print('Vuèges defòra de las comunas conegudas, de mai de 1 km2 : %d (%.0f km2)' % (len(grands), sum(km2(en_m(q)) for q in grands)))
for q in grands[:12]:
    print('  %.1f km2 a %s' % (km2(en_m(q)), a_lonlat(en_m(q))))
