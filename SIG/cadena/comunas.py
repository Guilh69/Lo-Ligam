# Couche « Comunas » : partie géométrique (GDAL), appelée par comunas.mjs.
#   python-qgis.bat comunas.py seleccion   communes du domaine, mairies
#   python-qgis.bat comunas.py verificar   contrôle des fichiers de la carte
# Chemins relatifs au dépôt : SIG/brut/comunas (entrées), app/static/data.
import json, os, sys, csv
from osgeo import ogr, osr
ogr.UseExceptions()

CADENA = os.path.dirname(os.path.abspath(__file__))
BRUT = os.path.normpath(os.path.join(CADENA, '..', 'brut', 'comunas'))
TRABALH = os.path.join(BRUT, 'trabalh')
REVISION = os.path.normpath(os.path.join(CADENA, '..', 'comunas'))
DATA = os.path.normpath(os.path.join(CADENA, '..', '..', 'app', 'static', 'data'))
GPKG = os.path.join(BRUT, 'ADE-COG-CARTO_2026.gpkg')
SEUIL = 0.5  # part minimale de la surface de la commune dans le domaine

wgs, l93 = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326); l93.ImportFromEPSG(2154)
for s in (wgs, l93): s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versL93, versWGS = osr.CoordinateTransformation(wgs, l93), osr.CoordinateTransformation(l93, wgs)


def anel(coords):
    r = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in coords: r.AddPoint_2D(x, y)
    if coords[0] != coords[-1]: r.AddPoint_2D(*coords[0])
    p = ogr.Geometry(ogr.wkbPolygon); p.AddGeometry(r)
    return p if p.IsValid() else p.MakeValid()


def domeni():
    """Domaine de la langue en Lambert-93 (anneaux en règle pair-impair : un anneau contenu dans un autre est un trou)."""
    d = json.load(open(os.path.join(DATA, 'limits-carta.json'), encoding='utf-8'))['domeni']['anels']
    g = None
    for r in d:
        p = anel(r)
        g = p if g is None else g.SymDifference(p)
    g.Transform(versL93)
    return g if g.IsValid() else g.MakeValid()


def anels_osm(rel, role):
    """Assemble les chemins d'une relation OSM (géométrie Overpass « out geom ») en anneaux fermés."""
    trocs = [[(p['lon'], p['lat']) for p in m['geometry']] for m in rel['members']
             if m['type'] == 'way' and (m.get('role') or 'outer') == role and m.get('geometry')]
    anels = []
    while trocs:
        a = trocs.pop(0)
        cambiat = True
        while a[0] != a[-1] and cambiat:
            cambiat = False
            for i, t in enumerate(trocs):
                if t[0] == a[-1]: a = a + t[1:]
                elif t[-1] == a[-1]: a = a + t[::-1][1:]
                elif t[-1] == a[0]: a = t[:-1] + a
                elif t[0] == a[0]: a = t[::-1][:-1] + a
                else: continue
                trocs.pop(i); cambiat = True; break
        if len(a) >= 4 and a[0] == a[-1]: anels.append(a)
    return anels


def poligon_osm(rel):
    ext = None
    for a in anels_osm(rel, 'outer'):
        p = anel(a); ext = p if ext is None else ext.Union(p)
    if ext is None: return None
    for a in anels_osm(rel, 'inner'):
        ext = ext.Difference(anel(a))
    return ext


def multi(g):
    """Toujours un MultiPolygon (sans morceaux qui ne sont pas des surfaces)."""
    t = ogr.GT_Flatten(g.GetGeometryType())
    if t == ogr.wkbPolygon: return ogr.ForceToMultiPolygon(g)
    if t == ogr.wkbMultiPolygon: return g
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for k in range(g.GetGeometryCount()):
        s = g.GetGeometryRef(k)
        if ogr.GT_Flatten(s.GetGeometryType()) in (ogr.wkbPolygon, ogr.wkbMultiPolygon):
            sm = multi(s)
            for j in range(sm.GetGeometryCount()): m.AddGeometry(sm.GetGeometryRef(j))
    return m


def r4(x): return round(x, 4)


def point_wgs(x, y):
    p = ogr.Geometry(ogr.wkbPoint); p.AddPoint_2D(x, y); p.Transform(versWGS)
    return [r4(p.GetX()), r4(p.GetY())]


def seleccion():
    os.makedirs(TRABALH, exist_ok=True)
    dom = domeni()
    print('Domaine : %d km²' % round(dom.GetArea() / 1e6))
    feats, atributs, limita = [], {}, []

    def garda(code, d, nom, pop, geom_l93, punt, oc_osm=None, part=None):
        g = geom_l93.Clone(); g.Transform(versWGS)
        g = multi(g if g.IsValid() else g.MakeValid())
        env = g.GetEnvelope()
        if punt is None:
            pt = geom_l93.PointOnSurface(); punt = point_wgs(pt.GetX(), pt.GetY())
        feats.append('{"type":"Feature","properties":%s,"geometry":%s}' % (
            json.dumps({'i': code, 'd': d}), g.ExportToJson(['COORDINATE_PRECISION=6'])))
        a = {'d': d, 'fr': nom, 'pop': int(pop or 0), 'p': punt, 'part': round(part, 3), 'bbox': [env[0], env[2], env[1], env[3]]}
        if oc_osm: a['oc_osm'] = oc_osm
        atributs[code] = a

    def part_dins(g):
        if not g.Intersects(dom): return 0.0
        if dom.Contains(g): return 1.0
        return g.Intersection(dom).GetArea() / g.GetArea()

    # France : IGN ADMIN EXPRESS COG CARTO 2026
    ds = ogr.Open(GPKG)
    chefs = {}
    for f in ds.GetLayerByName('chef_lieu_de_commune'):
        g = f.GetGeometryRef()
        if g: chefs[f.GetField('code_insee_de_la_commune')] = (g.GetX(), g.GetY())
    lay = ds.GetLayerByName('commune')
    env = dom.GetEnvelope()
    lay.SetSpatialFilterRect(env[0], env[2], env[1], env[3])
    sens_chef = []
    for f in lay:
        g = f.GetGeometryRef().Clone()
        if not g.IsValid(): g = g.MakeValid()
        part = part_dins(g)
        code, nom, d = f.GetField('code_insee'), f.GetField('nom_officiel'), f.GetField('code_insee_du_departement')
        if 0.05 <= part < 0.95: limita.append((d, code, nom, part))
        if part < SEUIL: continue
        punt = point_wgs(*chefs[code]) if code in chefs else None
        if punt is None: sens_chef.append(code)
        garda(code, d, nom, f.GetField('population'), g, punt, part=part)
    print('France : %d communes gardées ; sans chef-lieu (point de repli) : %s' % (len(atributs), sens_chef))

    # Val d'Aran et vallées d'Italie : OpenStreetMap
    for fichier, d, cle in (('comunas-aran.json', 'ARAN', 'ine:municipio'), ('comunas-it.json', 'IT', 'ref:ISTAT')):
        n = 0
        if not os.path.exists(os.path.join(BRUT, fichier)):
            print('ATTENTION : %s absent, %s non traité' % (fichier, d)); continue
        for e in json.load(open(os.path.join(BRUT, fichier), encoding='utf-8'))['elements']:
            t = e.get('tags', {})
            if e['type'] != 'relation' or t.get('boundary') != 'administrative': continue
            code = t.get(cle) or t.get('ref:INE') or t.get('ine:municipio')
            g = poligon_osm(e)
            if g is None or not code:
                print('  ignorée (%s) : %s %s' % (fichier, t.get('name'), code)); continue
            g.Transform(versL93)
            if not g.IsValid(): g = g.MakeValid()
            part = part_dins(g)
            if 0.05 <= part < 0.95: limita.append((d, code, t.get('name'), part))
            if part < SEUIL: continue
            punt = None
            for m in e['members']:
                if m['type'] == 'node' and m.get('role') in ('admin_centre', 'label') and 'lat' in m:
                    punt = [r4(m['lon']), r4(m['lat'])]
                    if m['role'] == 'admin_centre': break
            pop = t.get('population', '0').replace(' ', '').replace('.', '')
            nom = t.get('name:it') if d == 'IT' and t.get('name:it') else t.get('name')
            garda(code, d, nom, int(pop) if pop.isdigit() else 0, g, punt, oc_osm=t.get('name:oc'), part=part)
            n += 1
        print('%s : %d communes gardées' % (d, n))

    with open(os.path.join(TRABALH, 'comunas-sel.geojson'), 'w', encoding='utf-8') as o:
        o.write('{"type":"FeatureCollection","features":[\n' + ',\n'.join(feats) + '\n]}\n')
    json.dump(atributs, open(os.path.join(TRABALH, 'atributs.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    # Communes à cheval sur la limite du domaine, pour contrôle
    os.makedirs(REVISION, exist_ok=True)
    with open(os.path.join(REVISION, 'comunas-a-la-limita.csv'), 'w', encoding='utf-8', newline='') as o:
        w = csv.writer(o, delimiter=';', lineterminator='\n')
        w.writerow(['dep', 'i', 'fr', 'part_dins_lo_domeni', 'gardada'])
        for d, code, nom, part in sorted(limita):
            w.writerow([d, code, nom, '%d %%' % round(part * 100), 'oui' if part >= SEUIL else 'non'])
    print('Total : %d communes ; %d à cheval sur la limite (SIG/comunas/comunas-a-la-limita.csv)' % (len(atributs), len(limita)))


def verificar():
    dossier = os.path.join(DATA, 'comunas')
    index = json.load(open(os.path.join(dossier, 'index.json'), encoding='utf-8'))
    atributs = json.load(open(os.path.join(TRABALH, 'atributs.json'), encoding='utf-8'))
    ref = {}
    ds_ref = ogr.Open(os.path.join(TRABALH, 'comunas-sel.geojson'))  # gardat : GDAL libèra la font sens el
    for f in ds_ref.GetLayer(0):
        g = f.GetGeometryRef().Clone(); g.Transform(versL93)
        ref[f.GetField('i')] = g.GetArea()
    total, invalides, problemes = 0, [], []
    for dep in index['deps']:
        ds = ogr.Open(os.path.join(dossier, dep['d'] + '.json'))
        lay = ds.GetLayerByName('comunas')
        n, somme, union, somme_ref = 0, 0.0, None, 0.0
        for f in lay:
            n += 1
            g = f.GetGeometryRef().Clone(); g.Transform(versL93)
            i = f.GetField('i')
            if not g.IsValid(): invalides.append(i)
            if f.GetField('fr') in (None, '') or i not in atributs: problemes.append(i)
            somme += g.GetArea(); somme_ref += ref[i]
            union = g.Buffer(0) if union is None else union.Union(g.Buffer(0))
        chevauch = (somme - union.GetArea()) / 1e6
        ecart = 100 * (somme - somme_ref) / somme_ref
        print('%-5s %4d communes (index %4d) ; chevauchements %.3f km² ; surface %+.2f %% / source' % (dep['d'], n, dep['n'], chevauch, ecart))
        if n != dep['n']: problemes.append(dep['d'])
        total += n
    print('Total %d communes ; géométries invalides : %d %s ; autres problèmes : %s' % (total, len(invalides), invalides[:20], problemes[:20]))


if __name__ == '__main__':
    {'seleccion': seleccion, 'verificar': verificar}[sys.argv[1]]()
