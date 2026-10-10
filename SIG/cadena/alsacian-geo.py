# Alsacian e francic : geometrias de las comunas dels païses vesins, en
# geometria terrèstra, WGS 84, amb un còdi oficial prefixat (« codi »).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -P SIG/cadena/alsacian-geo.py
#
# Entradas (SIG/brut/alsacian/, ignorat per Git) :
#  - de/…/DE_VG250.gpkg : BKG, VG250-EW (estat al 31.12.2024), jaç vg250_gem,
#    licéncia dl-de/by-2-0 ; sonque GF = 4 (« mit Struktur Land ») : las partidas
#    d'aiga (GF 1 e 2 : lo lac de Constança, la mar) son daissadas. Los flumes
#    (Rin, Mosèla) son dins las comunas, coma en França.
#    Sarre (10) e Renània-Palatinat (07) entièrs ; Bade-Wurtemberg (08) : las
#    comunas a mens de 150 km de França (distància del centre a la frontièra).
#  - osm/soissa.osm.gz : comunas suíssas (swisstopo:BFS_NUMMER), © OSM (ODbL).
#    Las comunas OSM (coma swissBOUNDARIES3D) contenon los lacs : levam los
#    22 lacs de mai de 5 km2 de l'OFS (ch/Lacs_G1_20250101_2056.geojson, limits
#    generalizats 2025, « utilisation libre, source obligatoire »). Los lacs
#    mendres demòran dins las comunas (coma en França). Sonque las comunas a
#    mens de 150 km de França.
#  - osm/luxemborg.osm.gz : las comunas del Grand Ducat, © OSM (ODbL).
#  - osm/belgica.osm.gz : comunas de l'èst de Belgica (ref:INS), © OSM (ODbL).
# Sortidas : de-comunas.geojson, ch-comunas.geojson, lu-comunas.geojson, be-comunas.geojson
import gzip, json, os, re
from osgeo import gdal, ogr, osr

gdal.UseExceptions(); ogr.UseExceptions()
gdal.SetConfigOption('OSM_USE_CUSTOM_INDEXING', 'NO')
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
BRUT = os.path.join(R, 'SIG', 'brut', 'alsacian')
GPKG_FR = os.path.join(R, 'SIG', 'brut', 'comunas', 'ADE-COG-CARTO_2026.gpkg')
VG250 = os.path.join(BRUT, 'de', 'vg250-ew_12-31.utm32s.gpkg.ebenen', 'vg250-ew_ebenen_1231', 'DE_VG250.gpkg')
LACS = os.path.join(BRUT, 'ch', 'Lacs_G1_20250101_2056.geojson')
BANDA = 150000  # m

def srs(e):
    s = osr.SpatialReference(); s.ImportFromEPSG(e); s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER); return s
WGS, L93, LAEA, UTM, LV95 = srs(4326), srs(2154), srs(3035), srs(25832), srs(2056)
T = lambda a, b: osr.CoordinateTransformation(a, b)

# França (regions IGN, unidas) en LAEA, per las distàncias
gp = ogr.Open(GPKG_FR)
fr = None
for f in gp.GetLayerByName('region'):
    g = f.GetGeometryRef().Clone()
    fr = g if fr is None else fr.Union(g)
fr.Transform(T(L93, LAEA))
fr = fr.Simplify(200)
fr_bord = fr.Boundary()
print('França : %.0f km2' % (fr.GetArea() / 1e6))

def dist_fr(g_wgs):
    p = g_wgs.PointOnSurface().Clone(); p.Transform(T(WGS, LAEA))
    return 0.0 if p.Within(fr) else p.Distance(fr)

def escriure(nom, ents, camps):
    f = os.path.join(BRUT, nom)
    if os.path.exists(f): os.remove(f)
    ds = ogr.GetDriverByName('GeoJSON').CreateDataSource(f)
    ly = ds.CreateLayer(nom.replace('.geojson', ''), WGS, ogr.wkbMultiPolygon, ['RFC7946=YES', 'COORDINATE_PRECISION=6', 'WRITE_NAME=NO'])
    for k, t in camps:
        ly.CreateField(ogr.FieldDefn(k, t))
    inval = 0
    for p, g in ents:
        o = ogr.Feature(ly.GetLayerDefn())
        for k, _ in camps:
            if p.get(k) is not None: o.SetField(k, p[k])
        if not g.IsValid():
            g = g.MakeValid(); inval += 1
        g = ogr.ForceToMultiPolygon(g)
        o.SetGeometry(g); ly.CreateFeature(o)
    ds = None
    print('%s : %d entitats, %.1f Mo%s' % (nom, len(ents), os.path.getsize(f) / 1e6, (', %d reparadas' % inval) if inval else ''))

S, I, F = ogr.OFTString, ogr.OFTInteger, ogr.OFTReal
CAMPS = [('codi', S), ('nom', S), ('nom_de', S), ('nom_fr', S), ('nom_lb', S), ('unitat', S), ('unitat2', S), ('mena', S),
         ('populacion', I), ('dist_fr_km', F), ('aiga_levada_km2', F), ('ponch', S), ('wikidata', S)]

def ponch(g):
    p = g.PointOnSurface()
    return '%.5f,%.5f' % (p.GetX(), p.GetY())

# ---------- Alemanha (VG250) ----------
ds = ogr.Open(VG250)
krs = {}
for f in ds.GetLayerByName('vg250_krs'):
    krs[f.GetField('AGS')] = '%s %s' % (f.GetField('BEZ'), f.GetField('GEN'))
LAND = {'07': 'Rheinland-Pfalz', '08': 'Baden-Württemberg', '10': 'Saarland'}
ly = ds.GetLayerByName('vg250_gem')
ly.SetAttributeFilter("SN_L IN ('07', '08', '10') AND GF = 4")
ents, tirats = [], 0
toW = T(UTM, WGS)
for f in ly:
    g = f.GetGeometryRef().Clone(); g.Transform(toW)
    d = dist_fr(g)
    sn = f.GetField('SN_L')
    if sn == '08' and d > BANDA:
        tirats += 1; continue
    bez = f.GetField('BEZ') or ''
    ents.append(({'codi': 'de:' + f.GetField('AGS'), 'nom': f.GetField('GEN'), 'nom_de': f.GetField('GEN'), 'unitat': LAND[sn],
                  'unitat2': krs.get(f.GetField('AGS')[:5], ''), 'mena': 'gemeindefrei_de' if 'gemeindefrei' in bez.lower() else 'comuna_de',
                  'populacion': f.GetField('EWZ'), 'dist_fr_km': round(d / 1000, 1), 'ponch': ponch(g)}, g))
print('Alemanha : %d comunas gardadas, %d de Bade-Wurtemberg a mai de 150 km' % (len(ents), tirats))
escriure('de-comunas.geojson', ents, CAMPS)

# ---------- OSM : lectura comuna ----------
ETIQ = re.compile(r'"((?:[^"\\]|\\.)*)"=>"((?:[^"\\]|\\.)*)"')
def osm(nom):
    f = os.path.join(BRUT, 'osm', nom + '.osm.gz')
    d = gdal.OpenEx('/vsigzip/' + f, gdal.OF_VECTOR)
    out = []
    for ft in d.GetLayerByName('multipolygons'):
        if not ft.GetField('osm_id'): continue
        p = {k: ft.GetField(k) for k in ('name', 'admin_level', 'boundary') if ft.GetField(k)}
        for k, v in ETIQ.findall(ft.GetField('other_tags') or ''):
            p[k] = v
        g = ft.GetGeometryRef()
        if g is not None:
            out.append((int(ft.GetField('osm_id')), p, g.Clone()))
    return out

def pop(p):
    try: return int(re.sub(r'[^0-9]', '', p.get('population', '')) or 0) or None
    except Exception: return None

# ---------- Soïssa ----------
CANTONS = ['ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'ZG', 'FR', 'SO', 'BS', 'BL', 'SH', 'AG', 'TG', 'VS', 'JU']
lacs = []
lj = ogr.Open(LACS)
for f in lj.GetLayer(0):
    g = f.GetGeometryRef().Clone(); g.Transform(T(LV95, WGS))
    lacs.append((f.GetField('SEENAME'), g.MakeValid() if not g.IsValid() else g))
es = osm('soissa')
cant = [(p['ISO3166-2'][3:], g.MakeValid()) for _, p, g in es if p.get('admin_level') == '4' and p.get('ISO3166-2', '').startswith('CH-')]
print('Cantons : %d (%s)' % (len(cant), ' '.join(sorted(c for c, _ in cant))))
ents, tirats, lacs_lev = [], {'fora': 0, 'banda': 0, 'sens_bfs': 0}, {}
for i, p, g in es:
    if p.get('admin_level') != '8': continue
    if 'swisstopo:BFS_NUMMER' not in p:
        tirats['sens_bfs'] += 1; continue
    if int(p['swisstopo:BFS_NUMMER']) >= 9000:  # parts cantonalas de lacs (OFS 9xxx) : d'aiga
        tirats['lacs'] = tirats.get('lacs', 0) + 1; continue
    g = g.MakeValid() if not g.IsValid() else g
    pt = g.PointOnSurface()
    k = [c for c, cg in cant if pt.Within(cg)]
    if not k:
        tirats['fora'] += 1; continue
    d = dist_fr(g)
    if d > BANDA:
        tirats['banda'] += 1; continue
    a0 = None; lev = 0.0
    for n, lg in lacs:
        if g.Intersects(lg):
            gw = g.Difference(lg)
            gl = g.Intersection(lg); gl.Transform(T(WGS, LAEA)); a = gl.GetArea() / 1e6
            if a > 0.01:
                lev += a; lacs_lev[n] = lacs_lev.get(n, 0) + 1
                g = gw
    ents.append(({'codi': 'ch:' + p['swisstopo:BFS_NUMMER'], 'nom': p.get('name'), 'nom_de': p.get('name:de'), 'nom_fr': p.get('name:fr'),
                  'unitat': k[0], 'mena': 'comuna_ch', 'populacion': pop(p), 'dist_fr_km': round(d / 1000, 1),
                  'aiga_levada_km2': round(lev, 2) if lev else None, 'ponch': ponch(g), 'wikidata': p.get('wikidata')}, g))
print('Soïssa : %d comunas ; levadas : %s ; lacs levats : %s' % (len(ents), tirats, ', '.join('%s (%d)' % x for x in sorted(lacs_lev.items()))))
escriure('ch-comunas.geojson', ents, CAMPS)

# ---------- Luxemborg ----------
es = osm('luxemborg')
pais = [g for i, p, g in es if i == 2171347]
claus = {}
ents = []
for i, p, g in es:
    if p.get('admin_level') != '8': continue
    g = g.MakeValid() if not g.IsValid() else g
    if pais and not g.PointOnSurface().Within(pais[0]): continue
    for k in p: claus[k] = claus.get(k, 0) + 1
    codi = p.get('ref:lau2') or ('osm' + str(i))
    ents.append(({'codi': 'lu:' + codi, 'nom': p.get('name'), 'nom_de': p.get('name:de'), 'nom_fr': p.get('name:fr'), 'nom_lb': p.get('name:lb'),
                  'unitat': p.get('is_in:canton', ''), 'mena': 'comuna_lu', 'populacion': pop(p), 'dist_fr_km': round(dist_fr(g) / 1000, 1),
                  'ponch': ponch(g), 'wikidata': p.get('wikidata')}, g))
print('Luxemborg : %d comunas ; etiquetas : %s' % (len(ents), ', '.join('%s %d' % x for x in sorted(claus.items()) if x[1] > 50)))
escriure('lu-comunas.geojson', ents, CAMPS)

# ---------- Belgica ----------
es = osm('belgica')
ents = []
for i, p, g in es:
    if p.get('admin_level') != '8' or 'ref:INS' not in p: continue
    g = g.MakeValid() if not g.IsValid() else g
    ents.append(({'codi': 'be:' + p['ref:INS'], 'nom': p.get('name'), 'nom_de': p.get('name:de'), 'nom_fr': p.get('name:fr'), 'nom_lb': p.get('name:lb'),
                  'unitat': p.get('ref:INS')[:2], 'mena': 'comuna_be', 'populacion': pop(p), 'dist_fr_km': round(dist_fr(g) / 1000, 1),
                  'ponch': ponch(g), 'wikidata': p.get('wikidata')}, g))
print('Belgica : %d comunas : %s' % (len(ents), ', '.join(sorted('%s %s' % (p['codi'][3:], p['nom']) for p, _ in ents))))
escriure('be-comunas.geojson', ents, CAMPS)
