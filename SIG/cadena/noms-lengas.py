# Los noms de las comunas dins las autras lengas de la carta (retorn de Romain,
# 2026-10-11 : « tu as pas des noms en plus pour les différents fonds ? Et la
# règle de l'apparition des villes doit s'appliquer à l'ensemble des zones
# couvertes ») : coma comunas/noms.json pel domeni occitan, una lista amb lo
# ponch e la populacion de cada comuna, per que los noms apareguen d'aprèp la
# populacion, a totas las escalas (nomsComunas.js).
#
# Entradas (noms) :
#   breton   SIG/breton/noms-br.csv (insee;nom_br)
#   còrs     SIG/cors/noms-locals.csv (codi;nom_oficial;nom_local)
#   alsacian e francic  SIG/alsacian/noms-locals.csv (codi;…;nom_local;lenga;dialecte)
#   flamenc  SIG/flamenc/noms-locals.csv
#   oïl      SIG/oil/noms-oil-locals.csv, SIG/oil-belgica/noms-locals.csv
#   arpitan  SIG/arpitan/noms-locals.csv (Savòia, grafia de Conflans : arpitan-conflans.mjs)
#   basc, catalan, arpitan, picard : SIG/brut/cadena-entradas/noms-wikidata.csv (noms-wikidata.mjs)
# Entradas (ponches, populacions) : comunas IGN ADMIN EXPRESS 2026 ; per
# l'estrangièr, SIG/brut/*/*comun*.geojson (proprietat « codi »).
# Filtre : lo ponch de la comuna dins lo domeni de la lenga (app/static/data/<lenga>.json).
# Sortida : app/static/data/comunas/noms-lengas.json
#   { font, lengas, c: [[nom local, lon, lat, populacion|null, indèx de la lenga], …] }
#   (lo nom oficial e lo còdi demòran dins las listas d'entrada : pas besonh sus la carta)
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -u -P SIG/cadena/noms-lengas.py
import csv, glob, json, os
from osgeo import ogr, osr

ogr.UseExceptions(); osr.UseExceptions()
AQUI = os.path.dirname(os.path.abspath(__file__))
SIG = os.path.normpath(os.path.join(AQUI, '..'))
DATA = os.path.normpath(os.path.join(SIG, '..', 'app', 'static', 'data'))
SORTIDA = os.path.join(DATA, 'comunas', 'noms-lengas.json')

def legir(cami):
    if not os.path.exists(cami):
        print('  (manca)', cami); return []
    return list(csv.DictReader(open(cami, encoding='utf-8-sig'), delimiter=';'))

# ---- ponches e populacions
l93 = osr.SpatialReference(); l93.ImportFromEPSG(2154); l93.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
wgs = osr.SpatialReference(); wgs.ImportFromEPSG(4326); wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
a_ll = osr.CoordinateTransformation(l93, wgs)
pts = {}
gp = ogr.Open(os.path.join(SIG, 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg'))
cm = gp.GetLayerByName('commune')
for f in cm:
    g = f.GetGeometryRef()
    if g is None: continue
    p = g.PointOnSurface(); p.Transform(a_ll)
    pop = f.GetField('population')
    pts[f.GetField('code_insee')] = (round(p.GetX(), 4), round(p.GetY(), 4), int(pop) if pop is not None else None)
print('comunas IGN', len(pts))
for fic in glob.glob(os.path.join(SIG, 'brut', '*', '*comun*.geojson')):
    for f in json.load(open(fic, encoding='utf-8')).get('features', []):
        pr = f.get('properties') or {}
        codi = pr.get('codi')
        if not codi or codi in pts: continue
        pop = pr.get('populacion') or pr.get('pop') or pr.get('population')
        if pr.get('ponch'):
            x, y = map(float, pr['ponch'].split(','))
        elif f.get('geometry'):
            g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
            if g is None or g.IsEmpty(): continue
            q = g.PointOnSurface() if g.IsValid() else g.Centroid()
            x, y = q.GetX(), q.GetY()
        else: continue
        pts[codi] = (round(x, 4), round(y, 4), int(pop) if pop else None)
print('amb l\'estrangièr', len(pts))

# ---- domenis de las lengas
def domeni(lenga):
    d = json.load(open(os.path.join(DATA, lenga + '.json'), encoding='utf-8'))
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for a in (d.get('domeni') or {}).get('anels', []):
        r = ogr.Geometry(ogr.wkbLinearRing)
        for x, y in a: r.AddPoint_2D(x, y)
        p = ogr.Geometry(ogr.wkbPolygon); p.AddGeometry(r)
        m.AddGeometry(p.Buffer(0))
    return m.UnionCascaded().Buffer(0.01)
DOM = {l: domeni(l) for l in ['breton', 'cors', 'alsacian', 'francic', 'flamenc', 'oil', 'arpitan', 'basc', 'catalan']}

# ---- los noms
FRANCIC = {'letzebuergesch', 'moselfrankisch', 'rheinfrankisch', 'sudfrankisch', 'ripuarisch', 'limburgisch'}
noms = {}  # (codi) -> (nom_oficial, nom_local, lenga, font)
def apondre(codi, oficial, local, lenga, font, prima=False):
    local = (local or '').strip()
    if not codi or not local or local.lower() == (oficial or '').strip().lower(): return
    if codi in noms and not prima: return
    noms[codi] = (oficial, local, lenga, font)

for r in legir(os.path.join(SIG, 'breton', 'noms-br.csv')): apondre(r['insee'], None, r['nom_br'], 'breton', 'OPLB / Wikidata')
for r in legir(os.path.join(SIG, 'cors', 'noms-locals.csv')): apondre(r['codi'], r['nom_oficial'], r['nom_local'], 'cors', 'Collectivité de Corse')
for r in legir(os.path.join(SIG, 'alsacian', 'noms-locals.csv')):
    apondre(r['codi'], r['nom_oficial'], r['nom_local'], 'francic' if r.get('dialecte') in FRANCIC else 'alsacian', r.get('font') or 'Wikidata')
for r in legir(os.path.join(SIG, 'flamenc', 'noms-locals.csv')): apondre(r['codi'], r['nom_oficial'], r['nom_local'], 'flamenc', 'Wikipedia vls')
for r in legir(os.path.join(SIG, 'oil', 'noms-oil-locals.csv')): apondre(r['insee'], r['nom_oficial'], r['nom_local'], 'oil', r.get('font') or '')
for r in legir(os.path.join(SIG, 'oil-belgica', 'noms-locals.csv')): apondre(r['codi'], r['nom_oficial'], r['nom_local'], 'oil', 'Wikipedia wa')
# (Savòia : la grafia de Conflans d'en primièr, puèi Wikidata)
for r in legir(os.path.join(SIG, 'arpitan', 'noms-locals.csv')): apondre(r['codi'], r['nom_oficial'], r['nom_local'], 'arpitan', 'Wikipédia fr, Conflans', prima=True)
LG = {'eu': 'basc', 'ca': 'catalan', 'frp': 'arpitan', 'pcd': 'oil'}
for r in legir(os.path.join(SIG, 'brut', 'cadena-entradas', 'noms-wikidata.csv')):
    if r['lenga'] in LG: apondre(r['codi'], r['nom_oficial'], r['nom_local'], LG[r['lenga']], r['font'])

# ---- jonch, filtre pel domeni
sortida, fòra, sens = [], {}, 0
for codi, (oficial, local, lenga, font) in noms.items():
    if codi not in pts: sens += 1; continue
    x, y, pop = pts[codi]
    p = ogr.Geometry(ogr.wkbPoint); p.AddPoint_2D(x, y)
    if not DOM[lenga].Contains(p):
        fòra[lenga] = fòra.get(lenga, 0) + 1; continue
    sortida.append([local, x, y, pop, lenga])
sortida.sort(key=lambda c: -(c[3] or 0))
per = {}
for c in sortida: per[c[4]] = per.get(c[4], 0) + 1
LENGAS = sorted(per)
for c in sortida: c[4] = LENGAS.index(c[4])
print('noms gardats', len(sortida), per, '; fòra del domeni', fòra, '; sens ponch', sens)
FONT = ("Noms locals : OPLB e Wikidata (breton), Collectivité de Corse (còrs), Wikidata (alsacian, francic, basc, catalan, arpitan, picard), "
        "Wikipèdia vls e wa (flamenc, valon), Wikipédia fr segon lo Lexique francoprovençal des communes de Savoie, grafia de Conflans (Savòia) ; "
        "ponches e populacions : IGN ADMIN EXPRESS 2026 (Licéncia dobèrta 2.0) e instituts nacionals")
json.dump({'font': FONT, 'lengas': LENGAS, 'c': sortida}, open(SORTIDA, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('escrich', SORTIDA, os.path.getsize(SORTIDA), 'octets')
