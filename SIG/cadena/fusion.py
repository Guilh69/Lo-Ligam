# Domaine occitan final : celui de la carte Occitanica (France, Val d'Aran),
# plus les vallées occitanes d'Italie reprises de l'ancienne carte des dialectes
# (Occitanica ne les colorie pas, elle les nomme seulement).
import json
from osgeo import ogr
ogr.UseExceptions()
dir_ = 'C:/Users/perie/AppData/Local/Temp/claude/C--Users-perie-Documents-6-Projectes-Lo-Ligam/0e63bbde-6a7e-4082-97fe-1ae56a3855ba/scratchpad/'
nou = ogr.CreateGeometryFromJson(json.dumps(json.load(open(dir_ + 'occitanica/domeni-occitanica.geojson'))['features'][0]['geometry']))
vielh = ogr.CreateGeometryFromJson(json.dumps(json.load(open(dir_ + 'limits/domeni.geojson'))['features'][0]['geometry']))
# Vallées occitanes d'Italie et Val d'Aran : contours OpenStreetMap (ODbL),
# communes regroupées par vallée (osm/valadas.py, liste à valider par Romain)
osm = dir_ + 'osm/'
valadas = ogr.CreateGeometryFromJson(json.dumps(json.load(open(osm + 'valadas.geojson'))['features'][0]['geometry']))
aran = json.load(open(osm + 'aran.geojson'))
aran = ogr.CreateGeometryFromJson(json.dumps(aran['geometries'][0] if aran.get('type') == 'GeometryCollection' else aran))
valadas = valadas.Union(aran)
# Frontièras d'Estat respectadas (retorn de Romain) : lo domeni s'arrèsta a la
# França (union dels despartaments, Etalab), levat ont l'occitan es atestat
# fòra de França : Val d'Aran e valadas d'Itàlia (Andòrra e Mónegue defòra)
deps = json.load(open('C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/static/data/departements.geojson', encoding='utf-8'))
franca = None
for f in deps['features']:
    g = ogr.CreateGeometryFromJson(json.dumps(f['geometry'])).Buffer(0)
    franca = g if franca is None else franca.Union(g)
franca = franca.Buffer(0.0005).Buffer(-0.0005)  # junts entre despartaments
# Isèra (Vercòrs, Trièves, Valbonés, Oisans) : vivaroaupenc, absent de la carta
# Occitanica (recèrca suls transicions, validada per Romain lo 2026-10-07)
isera = [c for c in json.load(open('C:/Users/perie/Documents/6_Projectes/Lo_Ligam/SIG/Dialecte/transicions-dialectes.json', encoding='utf-8'))['corrections'] if c['id'] == 'isere-vercors-oisans'][0]['polygone']
if isera[0] != isera[-1]: isera = isera + [isera[0]]
isera = ogr.CreateGeometryFromWkt('POLYGON((' + ','.join('%f %f' % (x, y) for x, y in isera) + '))').Buffer(0)
nou = nou.Union(isera)
# Fòra del domeni (lenga d'oïl, saintongés) : la Pichona Gavachariá (enclava
# a l'entorn de Montségur) e lo Blaiés (recèrca, validat per Romain)
for idc in ('petite-gavacherie', 'blayais-hors-domaine'):
    pp = [c for c in json.load(open('C:/Users/perie/Documents/6_Projectes/Lo_Ligam/SIG/Dialecte/transicions-dialectes.json', encoding='utf-8'))['corrections'] if c['id'] == idc][0]['polygone']
    if pp[0] != pp[-1]: pp = pp + [pp[0]]
    nou = nou.Difference(ogr.CreateGeometryFromWkt('POLYGON((' + ','.join('%f %f' % (x, y) for x, y in pp) + '))').Buffer(0))
fin = nou.Intersection(franca).Union(valadas).Buffer(0)
print('França', round(franca.GetArea(), 2), '; domeni dins França + Aran + valadas', round(fin.GetArea(), 3))

# Lo Creissent fa part del domeni (zòna de transicion), e la frontièra de la
# lenga seguís son bòrd nòrd (retorn de Romain : pas de decalatge entre los
# dos). Region al nòrd del Creissent = de son bòrd nòrd fins a 48,5° N.
cro = ogr.CreateGeometryFromJson(json.dumps(json.load(open('C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/static/data/creissent.geojson', encoding='utf-8'))['features'][0]['geometry']))
def nord_de(poli):
    r = poli.GetGeometryRef(0)
    pts = [(r.GetX(k), r.GetY(k)) for k in range(r.GetPointCount() - 1)]
    iw = min(range(len(pts)), key=lambda k: pts[k][0]); ie = max(range(len(pts)), key=lambda k: pts[k][0])
    cami = lambda a, b: [pts[k % len(pts)] for k in range(a, b + (len(pts) if b < a else 0) + 1)]
    c1, c2 = cami(iw, ie), cami(ie, iw)[::-1]
    nord = c1 if sum(y for _, y in c1) / len(c1) > sum(y for _, y in c2) / len(c2) else c2
    anel = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in nord + [(nord[-1][0], 48.5), (nord[0][0], 48.5), nord[0]]: anel.AddPoint_2D(x, y)
    g = ogr.Geometry(ogr.wkbPolygon); g.AddGeometry(anel)
    print('Creissent : bòrd nòrd de', len(nord), 'ponches, de', round(nord[0][0], 2), 'a', round(nord[-1][0], 2))
    return g.Buffer(0)
tròces = [cro.GetGeometryRef(i) for i in range(cro.GetGeometryCount())] if cro.GetGeometryName() == 'MULTIPOLYGON' else [cro]
regionNord = None
for t in tròces:
    n = nord_de(t)
    regionNord = n if regionNord is None else regionNord.Union(n)
fin = fin.Difference(regionNord).Union(cro).Buffer(0)
# simplificat a ~150 m : lo contorn de França es detalhat (pes del fichièr)
# interstices de quauques centenats de mètres entre contorns (França / Aran) : tampats
fin = fin.Buffer(0.002).Buffer(-0.002)
fin = fin.SimplifyPreserveTopology(0.0015)
print('nou', round(nou.GetArea(), 3), 'valadas', round(valadas.GetArea(), 3), 'final', round(fin.GetArea(), 3), fin.GetGeometryName())
json.dump({'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'properties': {'font': "Carta dels dialèctes d'Occitanica (calada en Lambert-93) + valadas d'Itàlia e Val d'Aran (OSM)"}, 'geometry': json.loads(fin.ExportToJson())}]}, open(dir_ + 'limits/domeni-occitanica.geojson', 'w'))
