# Las comunas de las autras lengas de la carta, coma las del domeni occitan
# (comunas.mjs / comunas.py) : « dès qu'on couvre une nouvelle zone il faut
# qu'elle soit ouverte avec le même package que les autres » (Romain,
# 2026-10-11). Partida geometrica, apelada per comunas-lengas.mjs.
#
#   - França : las comunas IGN ADMIN EXPRESS 2026 que lor ponch es dins lo
#     domeni d'una lenga (app/static/data/<lenga>.json), levat las del domeni
#     occitan (ja dins comunas/<dep>.json) ;
#   - estrangièr : las comunas de SIG/brut/<lenga>/*comun*.geojson (Soïssa,
#     Alemanha, Luxemborg, Belgica, Païses Basses, Itàlia, Espanha) dins lo
#     domeni d'una lenga ;
#   - per cada comuna : còdi, nom oficial, nom local (las listas de
#     noms-lengas.py, o los noms OSM name:frp / name:eu), ponch, populacion, zòna
#     (lenga-despartament o lenga-país) e emprèsa.
# Sortida : SIG/brut/comunas/trabalh/comunas-lengas.geojson (WGS84)
import csv, glob, json, os
from osgeo import ogr, osr

ogr.UseExceptions(); osr.UseExceptions()
CADENA = os.path.dirname(os.path.abspath(__file__))
SIG = os.path.normpath(os.path.join(CADENA, '..'))
BRUT = os.path.join(SIG, 'brut')
DATA = os.path.normpath(os.path.join(SIG, '..', 'app', 'static', 'data'))
SORTIDA = os.path.join(BRUT, 'comunas', 'trabalh', 'comunas-lengas.geojson')
LENGAS = ['breton', 'cors', 'alsacian', 'francic', 'flamenc', 'arpitan', 'basc', 'catalan', 'oil']

l93 = osr.SpatialReference(); l93.ImportFromEPSG(2154); l93.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
wgs = osr.SpatialReference(); wgs.ImportFromEPSG(4326); wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
a_ll = osr.CoordinateTransformation(l93, wgs)

def legir(cami):
    return list(csv.DictReader(open(cami, encoding='utf-8-sig'), delimiter=';')) if os.path.exists(cami) else []

# ---- los domenis (anèls en règla de paritat)
def domeni(lenga):
    d = json.load(open(os.path.join(DATA, lenga + '.json'), encoding='utf-8'))
    g = None
    for a in (d.get('domeni') or {}).get('anels', []):
        r = ogr.Geometry(ogr.wkbLinearRing)
        for x, y in a: r.AddPoint_2D(x, y)
        if a[0] != a[-1]: r.AddPoint_2D(*a[0])
        p = ogr.Geometry(ogr.wkbPolygon); p.AddGeometry(r)
        p = p if p.IsValid() else p.MakeValid()
        g = p if g is None else g.SymDifference(p)
    return g.Buffer(0.003)
DOM = {l: domeni(l) for l in LENGAS}
ENV = {l: DOM[l].GetEnvelope() for l in LENGAS}
def lenga_de(x, y):
    pt = None
    for l in LENGAS:
        w, e, s, n = ENV[l]
        if not (w <= x <= e and s <= y <= n): continue
        pt = pt or ogr.CreateGeometryFromWkt('POINT (%f %f)' % (x, y))
        if DOM[l].Contains(pt): return l
    return None

# ---- los noms locals (meteissas listas que noms-lengas.py)
noms = {}
def nom(codi, local):
    local = (local or '').strip()
    if codi and local and codi not in noms: noms[codi] = local
for r in legir(os.path.join(SIG, 'arpitan', 'noms-locals.csv')): nom(r['codi'], r['nom_local'])
for r in legir(os.path.join(SIG, 'breton', 'noms-br.csv')): nom(r['insee'], r['nom_br'])
for f in ['cors', 'alsacian', 'flamenc', 'oil-belgica']:
    for r in legir(os.path.join(SIG, f, 'noms-locals.csv')): nom(r['codi'], r['nom_local'])
for r in legir(os.path.join(SIG, 'oil', 'noms-oil-locals.csv')): nom(r['insee'], r['nom_local'])
for r in legir(os.path.join(BRUT, 'cadena-entradas', 'noms-wikidata.csv')): nom(r['codi'], r['nom_local'])

occitanas = set(json.load(open(os.path.join(BRUT, 'comunas', 'trabalh', 'atributs.json'), encoding='utf-8')))
sortida, vist = [], set()

def apondre(codi, fr, local, x, y, pop, zona_fin, geom, lenga):
    if codi in vist: return
    vist.add(codi)
    if local and fr and local.strip().lower() == fr.strip().lower(): local = None
    w, e, s, n = geom.GetEnvelope()
    sortida.append({'type': 'Feature', 'properties': {
        'i': codi, 'fr': fr, 'oc': local or None, 'p': [round(x, 4), round(y, 4)], 'pop': int(pop) if pop else 0,
        'd': '%s-%s' % (lenga, zona_fin), 'bb': [round(w, 4), round(s, 4), round(e, 4), round(n, 4)]},
        'geometry': json.loads(geom.ExportToJson())})

# ---- França
gp = ogr.Open(os.path.join(BRUT, 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
for f in gp.GetLayerByName('commune'):
    codi = f.GetField('code_insee')
    if codi in occitanas: continue
    g = f.GetGeometryRef()
    if g is None: continue
    g = g.Clone(); g.Transform(a_ll)
    p = g.PointOnSurface()
    l = lenga_de(p.GetX(), p.GetY())
    if not l: continue
    dep = f.GetField('code_insee_du_departement')
    apondre(codi, f.GetField('nom_officiel'), noms.get(codi), p.GetX(), p.GetY(), f.GetField('population'), dep, g, l)
print('França', len(sortida))

# ---- l'estrangièr
def codi_de(pr):
    if pr.get('codi'): return pr['codi']
    if pr.get('swisstopo:BFS_NUMMER'): return 'ch:' + pr['swisstopo:BFS_NUMMER']
    if pr.get('ref:ISTAT'): return 'it:' + pr['ref:ISTAT']
    if pr.get('ine:municipio'): return 'es:' + pr['ine:municipio']
    return None
for fic in sorted(glob.glob(os.path.join(BRUT, '*', '*comun*.geojson'))):
    if os.sep + 'comunas' + os.sep in fic or 'fr-' in os.path.basename(fic) or 'comunas-fr' in fic: continue
    n0 = len(sortida)
    for ft in json.load(open(fic, encoding='utf-8')).get('features', []):
        pr = ft.get('properties') or {}
        codi = codi_de(pr)
        if not codi or not ft.get('geometry') or codi.startswith('fr') or codi[:1].isdigit(): continue
        g = ogr.CreateGeometryFromJson(json.dumps(ft['geometry']))
        if g is None or g.IsEmpty(): continue
        if not g.IsValid(): g = g.MakeValid()
        if pr.get('ponch'): x, y = map(float, pr['ponch'].split(','))
        else:
            q = g.PointOnSurface(); x, y = q.GetX(), q.GetY()
        l = lenga_de(x, y)
        if not l: continue
        fr = pr.get('nom') or pr.get('nom_oficial') or pr.get('official_name') or pr.get('name')
        local = noms.get(codi) or pr.get('nom_local') or pr.get('name:frp') or pr.get('name:eu') or pr.get('name:co')
        if local and ';' in local: local = local.split(';')[0]
        pop = pr.get('populacion') or pr.get('pop') or pr.get('population')
        try: pop = int(str(pop).replace(' ', '')) if pop else 0
        except ValueError: pop = 0
        apondre(codi, fr, local, x, y, pop, codi.split(':')[0], g, l)
    print('  %-45s %d' % (os.path.relpath(fic, BRUT), len(sortida) - n0))

per = {}
for f in sortida: per[f['properties']['d'].split('-')[0]] = per.get(f['properties']['d'].split('-')[0], 0) + 1
amb = sum(1 for f in sortida if f['properties']['oc'])
print('total', len(sortida), 'comunas,', amb, 'amb un nom local ;', per)
json.dump({'type': 'FeatureCollection', 'features': sortida}, open(SORTIDA, 'w', encoding='utf-8'), ensure_ascii=False)
print('escrich', SORTIDA)
