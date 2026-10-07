# Couche « Provincias istoricas » : provinces et gouvernements généraux de 1789.
#
# Lancement (depuis n'importe quel dossier) :
#   "C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat" SIG\cadena\provincias.py
#
# Entrées (SIG/brut/provincias/, non suivi par Git, retéléchargé si absent) :
#   - Gay, Gobbi, Goñi 2024, « Bailliages in 1789 France », Harvard Dataverse,
#     doi:10.7910/DVN/T8UXHK, CC BY 4.0 (d'après l'atlas d'A. Brette, 1904) :
#     BAILLIAGES_1789_BRETTE.zip (bailliages), FRANCE_1789_BRETTE.zip (royaume),
#     FRANCE_1789_BRETTE_POINTS.zip (paroisses de Cassini avec leur territoire :
#     sert à séparer Avignon, le Comtat et Sault, et à reconnaître Nice et Bidache).
#   - Contours des communes (IGN ADMIN EXPRESS via geo.api.gouv.fr, Licence
#     ouverte) : Vaucluse, Alpes-Maritimes, Barret-de-Lioure et Ferrassières.
# Entrées suivies par Git :
#   - SIG/provincias/taula-bailliages.csv : bailliage -> province -> gouvernement.
#   - SIG/provincias/noms-a-validar.csv : noms occitans (relus par Romain).
#   - app/static/data/limits-carta.json : domaine de la langue (anneaux pair-impair).
# Sortie : app/static/data/provincias-1789.json
#
# Étapes : 1) provinces = fusion de bailliages entiers ; 2) territoires hors du
# royaume (trous du royaume de 1789, comté de Nice, Monaco) ; 3) Val d'Aran et
# vallées d'Italie = partie du domaine hors de ces contours ; 4) part de chaque
# unité dans le domaine, on écarte celles à moins de 5 % (sans découper les autres) ;
# 5) mapshaper (outil libre MPL-2.0, par npx) : nettoyage, simplification avec
# topologie (environ 1,1 km pour les unités surtout dans le domaine, 3 km pour
# les autres ; réglable par les variables PROV_INTERVALLE et PROV_MARGE), arrondi
# à 3 décimales, fusion en gouvernements ; 6) écriture du GeoJSON final.
# À 500 m le fichier pèse environ 300 Ko (85 Ko compressé) ; à 1,1 km, 140 Ko (38 Ko).
# Ce script réécrit tout le fichier de sortie : un script qui le retouche ensuite
# (par exemple SIG/cadena/noms-oc-jaces.mjs pour les noms) doit être relancé après.

import csv
import heapq
import json
import os
import shutil
import subprocess
import urllib.request
import zipfile

from osgeo import ogr, osr

ogr.UseExceptions()
osr.UseExceptions()

ICI = os.path.dirname(os.path.abspath(__file__))
SIG = os.path.dirname(ICI)
DEPOT = os.path.dirname(SIG)
BRUT = os.path.join(SIG, 'brut', 'provincias')
TRABALH = os.path.join(BRUT, 'trabalh')
TAULA = os.path.join(SIG, 'provincias', 'taula-bailliages.csv')
NOMS = os.path.join(SIG, 'provincias', 'noms-a-validar.csv')
LIMITS = os.path.join(DEPOT, 'app', 'static', 'data', 'limits-carta.json')
SORTIDA = os.path.join(DEPOT, 'app', 'static', 'data', 'provincias-1789.json')

SEUIL_DOMAINE = 0.05      # part minimale de l'unité dans le domaine
INTERVALLE_SIMPL = int(os.environ.get('PROV_INTERVALLE', 1100))  # mètres, unités surtout dans le domaine
INTERVALLE_MARGE = int(os.environ.get('PROV_MARGE', 3000))      # mètres, unités surtout hors du domaine
PART_MARGE = 0.5          # en dessous de cette part dans le domaine, simplification forte
# Aran et Italie : leur contour est la limite du domaine, déjà dessinée par la carte.
MARGE_FORCEE = {'aran', 'sardaigne'}
DECIMALES = 3             # ~100 m, en dessous de la simplification
LAMBERT93 = ('+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 '
             '+y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
FONT = ("Gay, Gobbi & Goñi 2024, d'après Brette 1904 (CC BY 4.0) ; IGN (Licence ouverte) ; "
        "OpenStreetMap (ODbL) ; données regroupées et simplifiées")

DATAVERSE = 'https://dataverse.harvard.edu/api/access/datafile/'
TELECHARGEMENTS = {
    'BAILLIAGES_1789_BRETTE.zip': DATAVERSE + '10148648',
    'FRANCE_1789_BRETTE.zip': DATAVERSE + '10148649',
    'FRANCE_1789_BRETTE_POINTS.zip': DATAVERSE + '10148645',
    'BAILLIAGES_1789_BRETTE.txt': DATAVERSE + '10148657',
    'README.txt': DATAVERSE + '10148659',
    'communes-84.geojson': 'https://geo.api.gouv.fr/departements/84/communes?format=geojson&geometry=contour&fields=nom,code',
    'communes-06.geojson': 'https://geo.api.gouv.fr/departements/06/communes?format=geojson&geometry=contour&fields=nom,code',
    # Barret-de-Lioure et Ferrassières (Drôme), du comté de Sault : une requête par commune
    'communes-26-sault.geojson': ['https://geo.api.gouv.fr/communes?code=' + c + '&format=geojson&geometry=contour&fields=nom,code'
                                  for c in ('26026', '26135')],
}

# Unités : kod -> (niveau, nom français, gouvernement parent, note courte)
G = 'governament'
P = 'provincia'
F = 'fora'
UNITATS = {
    'g-guyenne': (G, 'Guyenne et Gascogne', None, None),
    'g-bearn': (G, 'Navarre et Béarn', None, None),
    'g-foix': (G, 'Foix', None, "Gouvernement de Foix, Donezan et Andorre (l'Andorre n'est pas dessinée)."),
    'g-languedoc': (G, 'Languedoc', None, None),
    'g-provence': (G, 'Provence', None, None),
    'g-dauphine': (G, 'Dauphiné', None, None),
    'g-auvergne': (G, 'Auvergne', None, None),
    'g-limousin': (G, 'Limousin', None, None),
    'g-marche': (G, 'Marche', None, None),
    'g-saintonge': (G, 'Saintonge et Angoumois', None, None),
    'g-poitou': (G, 'Poitou', None, None),
    'g-berry': (G, 'Berry', None, None),
    'g-bourbonnais': (G, 'Bourbonnais', None, None),
    'g-lyonnais': (G, 'Lyonnais, Forez et Beaujolais', None, None),
    'g-roussillon': (G, 'Roussillon', None, None),
    'g-bourgogne': (G, 'Bourgogne', None, None),
    'g-touraine': (G, 'Touraine', None, None),

    'guyenne': (P, 'Guyenne', 'g-guyenne', 'Guyenne au sens étroit : Bordelais, Bazadais, Agenais, Condomois.'),
    'gascogne': (P, 'Gascogne', 'g-guyenne', "Landes, Albret, Armagnac et Astarac. La Lomagne y est comprise."),
    'perigord': (P, 'Périgord', 'g-guyenne', None),
    'quercy': (P, 'Quercy', 'g-guyenne', None),
    'rouergue': (P, 'Rouergue', 'g-guyenne', None),
    'labourd': (P, 'Labourd', 'g-guyenne', None),
    'soule': (P, 'Soule', 'g-guyenne', None),
    'bigorre': (P, 'Bigorre', 'g-guyenne', None),
    'quatre-vallees': (P, 'Quatre-Vallées', 'g-guyenne', 'Aure, Barousse, Magnoac et Neste.'),
    'comminges': (P, 'Comminges', 'g-guyenne', 'Avec la plus grande partie du Nébouzan (Saint-Gaudens).'),
    'couserans': (P, 'Couserans', 'g-guyenne', None),
    'riviere-verdun': (P, 'Rivière-Verdun', 'g-guyenne', 'Avec la Gaure, Launac et Marestaing : plusieurs morceaux.'),
    'bearn': (P, 'Béarn', 'g-bearn', None),
    'navarre': (P, 'Basse-Navarre', 'g-bearn', None),
    'foix': (P, 'Comté de Foix', 'g-foix', 'Avec le Donezan.'),
    'languedoc': (P, 'Languedoc', 'g-languedoc', 'Sans le Vivarais, le Velay et le Gévaudan, dessinés à part.'),
    'vivarais': (P, 'Vivarais', 'g-languedoc', None),
    'velay': (P, 'Velay', 'g-languedoc', None),
    'gevaudan': (P, 'Gévaudan', 'g-languedoc', None),
    'provence': (P, 'Provence', 'g-provence', 'Avec la vallée de Barcelonnette (française depuis 1713) et le comté de Sault.'),
    'dauphine': (P, 'Dauphiné', 'g-dauphine', None),
    'orange': (P, "Principauté d'Orange", 'g-dauphine', 'Française depuis 1713.'),
    'auvergne': (P, 'Auvergne', 'g-auvergne', None),
    'limousin': (P, 'Limousin', 'g-limousin', None),
    'marche': (P, 'Marche', 'g-marche', 'Haute et Basse-Marche.'),
    'angoumois': (P, 'Angoumois', 'g-saintonge', None),
    'saintonge': (P, 'Saintonge', 'g-saintonge', None),
    'poitou': (P, 'Poitou', 'g-poitou', None),
    'berry': (P, 'Berry', 'g-berry', None),
    'bourbonnais': (P, 'Bourbonnais', 'g-bourbonnais', None),
    'forez': (P, 'Forez', 'g-lyonnais', None),
    'lyonnais': (P, 'Lyonnais', 'g-lyonnais', None),
    'beaujolais': (P, 'Beaujolais', 'g-lyonnais', None),
    'roussillon': (P, 'Roussillon', 'g-roussillon', None),
    'bourgogne': (P, 'Bourgogne', 'g-bourgogne', None),
    'charolais': (P, 'Charolais', 'g-bourgogne', None),
    'maconnais': (P, 'Mâconnais', 'g-bourgogne', None),
    'touraine': (P, 'Touraine', 'g-touraine', None),

    'avignon': (F, "État d'Avignon", None, 'Terre du pape (États pontificaux) en 1789, réunie à la France en 1791.'),
    'comtat': (F, 'Comtat Venaissin', None, 'Terre du pape (États pontificaux) en 1789, réunie à la France en 1791.'),
    'nice': (F, 'Comté de Nice', None, 'États de Savoie (royaume de Sardaigne) en 1789.'),
    'monaco': (F, 'Principauté de Monaco', None, 'Monaco, Menton et Roquebrune, sous protection française en 1789.'),
    'bidache': (F, 'Souveraineté de Bidache', None, 'Terre des ducs de Gramont, à part du royaume en 1789.'),
    'aran': (F, "Val d'Aran", None, 'Principauté de Catalogne (monarchie espagnole) en 1789.'),
    'sardaigne': (F, 'Royaume de Sardaigne', None, "États de Savoie en 1789. Les hautes vallées d'Oulx, de Pragela et de Château-Dauphin étaient dauphinoises jusqu'en 1713. Seule la partie de langue occitane est dessinée."),
}

WGS = osr.SpatialReference()
WGS.ImportFromEPSG(4326)
WGS.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
L93 = osr.SpatialReference()
L93.ImportFromEPSG(2154)
L93.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
VERS_L93 = osr.CoordinateTransformation(WGS, L93)
VERS_WGS = osr.CoordinateTransformation(L93, WGS)


def dit(*a):
    print(*a, flush=True)


# ---------------------------------------------------------------- sources
def prepara_brut():
    os.makedirs(TRABALH, exist_ok=True)
    for nom, url in TELECHARGEMENTS.items():
        chemin = os.path.join(BRUT, nom)
        if not os.path.exists(chemin):
            dit('téléchargement', nom)
            if isinstance(url, list):   # plusieurs requêtes GeoJSON réunies
                feats = []
                for u in url:
                    req = urllib.request.Request(u, headers={'User-Agent': 'LoLigam-SIG/1.0'})
                    with urllib.request.urlopen(req) as r:
                        feats += json.load(r)['features']
                with open(chemin, 'w', encoding='utf-8') as f:
                    json.dump({'type': 'FeatureCollection', 'features': feats}, f)
                continue
            req = urllib.request.Request(url, headers={'User-Agent': 'LoLigam-SIG/1.0'})
            with urllib.request.urlopen(req) as r, open(chemin, 'wb') as f:
                shutil.copyfileobj(r, f)
    for zipnom, dossier in (('BAILLIAGES_1789_BRETTE.zip', 'bailliages'),
                            ('FRANCE_1789_BRETTE.zip', 'france'),
                            ('FRANCE_1789_BRETTE_POINTS.zip', 'france-points')):
        d = os.path.join(BRUT, dossier)
        if not os.path.isdir(d):
            with zipfile.ZipFile(os.path.join(BRUT, zipnom)) as z:
                z.extractall(d)


# ---------------------------------------------------------------- géométrie
def vide():
    return ogr.Geometry(ogr.wkbMultiPolygon)


def polys(g):
    """Liste des polygones simples d'une géométrie (ignore points et lignes)."""
    if g is None or g.IsEmpty():
        return []
    t = ogr.GT_Flatten(g.GetGeometryType())
    if t == ogr.wkbPolygon:
        return [g.Clone()]
    if t in (ogr.wkbMultiPolygon, ogr.wkbGeometryCollection):
        out = []
        for i in range(g.GetGeometryCount()):
            out += polys(g.GetGeometryRef(i))
        return out
    return []


def multi(liste):
    m = ogr.Geometry(ogr.wkbMultiPolygon)
    for p in liste:
        for q in polys(p):
            m.AddGeometry(q)
    return m


def union(liste):
    m = multi(liste)
    if m.IsEmpty():
        return m
    u = m.UnionCascaded()
    return multi([u.MakeValid()])


def propre(g):
    if g is None:
        return vide()
    if not g.IsValid():
        g = g.MakeValid()
    return multi([g])


def sans_miettes(g, km2):
    """Retire les morceaux plus petits que km2."""
    return multi([p for p in polys(g) if p.GetArea() >= km2 * 1e6])


def anneau(coords):
    r = ogr.Geometry(ogr.wkbLinearRing)
    for x, y in coords:
        r.AddPoint_2D(x, y)
    if tuple(coords[0]) != tuple(coords[-1]):
        r.AddPoint_2D(*coords[0])
    return r


def poly_wgs_vers_l93(rings):
    p = ogr.Geometry(ogr.wkbPolygon)
    for r in rings:
        p.AddGeometry(anneau(r))
    p.Transform(VERS_L93)
    return p


def lire_geojson_l93(chemin):
    """Features GeoJSON (WGS84) -> liste (properties, géométrie L93 valide)."""
    with open(chemin, encoding='utf-8') as f:
        d = json.load(f)
    out = []
    for ft in d['features']:
        g = ogr.CreateGeometryFromJson(json.dumps(ft['geometry']))
        g.Transform(VERS_L93)
        out.append((ft['properties'], propre(g)))
    return out


# ---------------------------------------------------------------- données
def lire_domaine():
    with open(LIMITS, encoding='utf-8') as f:
        d = json.load(f)
    dom = None
    monaco = None
    for r in d['domeni']['anels']:
        p = poly_wgs_vers_l93([r]).MakeValid()
        xs = [c[0] for c in r]
        ys = [c[1] for c in r]
        if min(xs) < 7.42 < max(xs) and min(ys) < 43.735 < max(ys) and len(r) < 50:
            monaco = multi([p])  # le trou de Monaco dans le domaine
        dom = p if dom is None else dom.SymDifference(p)   # règle pair-impair
    return propre(dom), monaco


def lire_taula():
    lignes = []
    with open(TAULA, encoding='utf-8-sig', newline='') as f:
        for r in csv.DictReader(f, delimiter=';'):
            lignes.append(r)
    return lignes


def lire_noms():
    noms = {}
    if not os.path.exists(NOMS):
        dit('ATTENTION : noms-a-validar.csv absent, aucun nom occitan')
        return noms
    with open(NOMS, encoding='utf-8-sig', newline='') as f:
        for r in csv.DictReader(f, delimiter=';'):
            oc = (r.get('oc') or '').strip()
            font = (r.get('font') or '').strip().lower()
            valide = (r.get('a_validar') or '').strip().lower() == 'non'
            # Une forme proposée par nous (sans source) n'entre dans la carte
            # qu'une fois validée par Romain (a_validar = non).
            if oc and (valide or not font.startswith('proposition')):
                noms[r['kod'].strip()] = oc
    return noms


def kod_par_nom(niveau, nom):
    for k, (n, fr, _, _) in UNITATS.items():
        if n == niveau and fr == nom:
            return k
    raise SystemExit(f'Nom inconnu dans la table ({niveau}) : {nom}')


# ---------------------------------------------------------------- étape 1 et 2
def construire():
    dom, anneau_monaco = lire_domaine()
    dit('domaine', round(dom.GetArea() / 1e6), 'km2')
    voisinage = dom.Buffer(30000)

    # Bailliages
    ds = ogr.Open(os.path.join(BRUT, 'bailliages', 'BAILLIAGES_1789_BRETTE.shp'))
    bail = {}
    for ft in ds.GetLayer():
        bail[ft['BAIL_ID']] = propre(ft.GetGeometryRef().Clone())
    ds = None

    taula = lire_taula()
    ids = {r['bailliage_id'] for r in taula}
    manquent = [i for i, g in bail.items() if g.Intersects(voisinage) and i not in ids]
    if manquent:
        raise SystemExit('Bailliages du voisinage absents de la table : ' + ', '.join(manquent))

    prov_geoms = {}
    gouv_de = {}
    for r in taula:
        i = r['bailliage_id']
        if i.startswith('terr-'):
            continue
        k = kod_par_nom(P, r['provincia_fr'])
        g = kod_par_nom(G, r['governament_fr'])
        if UNITATS[k][2] != g:
            raise SystemExit(f'Gouvernement incohérent pour {i} : {g} / {UNITATS[k][2]}')
        prov_geoms.setdefault(k, []).append(bail[i])
        gouv_de[k] = g

    # Royaume de 1789 et ses trous
    ds = ogr.Open(os.path.join(BRUT, 'france', 'FRANCE_1789_BRETTE.shp'))
    lyr = ds.GetLayer()
    ft = lyr.GetNextFeature()
    royaume = propre(ft.GetGeometryRef().Clone())
    ft = lyr = ds = None
    trous = []
    plein = []
    for p in polys(royaume):
        e = ogr.Geometry(ogr.wkbPolygon)
        e.AddGeometry(p.GetGeometryRef(0).Clone())
        plein.append(e)
        for j in range(1, p.GetGeometryCount()):
            h = ogr.Geometry(ogr.wkbPolygon)
            h.AddGeometry(p.GetGeometryRef(j).Clone())
            trous.append(h)
    royaume_plein = union(plein)

    # Paroisses avec leur territoire (I Avignon, II Comtat, III Bidache, IX Sault, XIII Nice)
    ds = ogr.Open(os.path.join(BRUT, 'france-points', 'FRANCE_1789_BRETTE_POINTS.shp'))
    points = []
    for ft in ds.GetLayer():
        t = ft['TER_ID']
        if t in ('I', 'II', 'III', 'IX', 'XIII'):
            points.append((t, ft.GetGeometryRef().Clone()))
    ds = None

    def territoire_majoritaire(g):
        comptes = {}
        for t, pt in points:
            if g.Contains(pt):
                comptes[t] = comptes.get(t, 0) + 1
        return max(comptes, key=comptes.get) if comptes else None

    # Communes de Vaucluse et de la Drôme (Sault) : séparer Avignon / Comtat / Sault
    communes = (lire_geojson_l93(os.path.join(BRUT, 'communes-84.geojson'))
                + lire_geojson_l93(os.path.join(BRUT, 'communes-26-sault.geojson')))
    par_terr = {'I': [], 'IX': []}
    for props, g in communes:
        t = territoire_majoritaire(g)
        if t in par_terr:
            par_terr[t].append(g)
    zone_avignon = union(par_terr['I']).Buffer(50)
    zone_sault = union(par_terr['IX']).Buffer(50)

    fora = {'avignon': [], 'comtat': [], 'bidache': [], 'nice': [], 'monaco': []}
    sault = []
    for h in trous:
        presents = {t for t, pt in points if h.Contains(pt)}
        if not presents:
            continue   # Llívia (Espagne) ou miette sans paroisse
        if presents <= {'III'}:
            fora['bidache'].append(h)
            continue
        if not presents <= {'I', 'II', 'IX'}:
            raise SystemExit(f'Trou inattendu, territoires {presents}')
        a = h.Intersection(zone_avignon) if 'I' in presents else vide()
        s = h.Intersection(zone_sault) if 'IX' in presents else vide()
        c = h.Difference(a).Difference(s)
        fora['avignon'].append(a)
        sault.append(s)
        fora['comtat'].append(c)

    # Comté de Nice et Monaco : communes des Alpes-Maritimes hors du royaume de 1789
    c06 = lire_geojson_l93(os.path.join(BRUT, 'communes-06.geojson'))
    dehors = union([g.Buffer(50) for _, g in c06]).Difference(royaume_plein)
    mm = union([g for p, g in c06 if p['code'] in ('06083', '06104')]).Buffer(50)   # Menton, Roquebrune
    monaco = union([dehors.Intersection(mm), anneau_monaco])
    nice = sans_miettes(dehors.Difference(monaco), 1)
    fora['monaco'] = [monaco]
    fora['nice'] = [nice]

    # Val d'Aran et vallées d'Italie : le domaine hors de tout ce qui précède,
    # sans les lanières le long des frontières (ouverture de 150 m).
    deja = union([royaume_plein, nice, monaco])
    reste = propre(dom.Difference(deja))
    reste = propre(reste.Buffer(-150).Buffer(150).Intersection(reste))
    fora['aran'] = []
    fora['sardaigne'] = []
    for p in polys(reste):
        a = p.GetArea() / 1e6
        if a < 20:
            continue
        c = p.Centroid()
        c.Transform(VERS_WGS)
        if c.GetX() < 2 and c.GetY() < 43.1:
            fora['aran'].append(p)
        elif c.GetX() > 6:
            fora['sardaigne'].append(p)
        else:
            # Étangs et lacs littoraux (Thau, Berre, Hourtin...) et bandes de mer :
            # le domaine suit la côte Natural Earth, les communes IGN non.
            dit(f'(ignoré : {a:.0f} km2 du domaine hors des communes, vers {c.GetX():.2f}, {c.GetY():.2f})')

    # Géométries des unités
    geoms = {}
    for k, liste in prov_geoms.items():
        if k == 'provence':
            liste = liste + sault
        geoms[k] = union(liste)
    for k, liste in fora.items():
        geoms[k] = sans_miettes(union(liste), 0.01)
    gouv_geoms = {}
    for k, g in gouv_de.items():
        gouv_geoms.setdefault(g, []).append(geoms[k])
    for g, liste in gouv_geoms.items():
        geoms[g] = union(liste)

    # Part dans le domaine
    part = {}
    for k, g in geoms.items():
        a = g.GetArea()
        part[k] = (g.Intersection(dom).GetArea() / a) if a else 0
    gardes = {k for k, v in part.items() if v >= SEUIL_DOMAINE}
    for k in list(gardes):
        g = UNITATS[k][2]
        if g and g not in gardes:
            dit(f'gouvernement {g} gardé à cause de sa province {k}')
            gardes.add(g)

    dit('\nunité ; niveau ; km2 ; part dans le domaine ; gardée')
    for k in sorted(geoms, key=lambda k: (UNITATS[k][0], k)):
        dit(f'{k} ; {UNITATS[k][0]} ; {geoms[k].GetArea() / 1e6:.0f} ; {100 * part[k]:.1f} % ; '
            f'{"oui" if k in gardes else "non"}')
    return geoms, gardes, part


# ---------------------------------------------------------------- étape 5 (mapshaper)
def ecrire_l93(chemin, feats):
    out = {'type': 'FeatureCollection', 'features': []}
    for props, g in feats:
        out['features'].append({'type': 'Feature', 'properties': props,
                                'geometry': json.loads(g.ExportToJson(['COORDINATE_PRECISION=1']))})
    with open(chemin, 'w', encoding='utf-8') as f:
        json.dump(out, f)


def mapshaper(*args):
    # L'environnement Python de QGIS ne voit pas toujours Node : on le cherche.
    candidats = [shutil.which('npx.cmd'), shutil.which('npx'),
                 os.path.join(os.environ.get('LOCALAPPDATA', ''), 'Programs', 'nodejs', 'npx.cmd'),
                 os.path.join(os.environ.get('ProgramFiles', 'C:/Program Files'), 'nodejs', 'npx.cmd')]
    npx = next((c for c in candidats if c and os.path.exists(c)), None)
    if not npx:
        raise SystemExit('npx introuvable (Node.js)')
    env = dict(os.environ)
    env['PATH'] = os.path.dirname(npx) + os.pathsep + env.get('PATH', '')
    cmd = [npx, '-y', 'mapshaper@0.7.80', *args]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', env=env)
    for l in (r.stdout + r.stderr).splitlines():
        if l.strip() and 'npm' not in l:
            dit('  mapshaper :', l)
    if r.returncode:
        raise SystemExit('mapshaper a échoué')


def simplifier(geoms, gardes, part):
    # Une seule couche « pièces » qui pave le terrain : toutes les provinces des
    # gouvernements gardés (même écartées, pour fermer le gouvernement) et les
    # territoires hors du royaume gardés. Les gouvernements sont refaits par
    # fusion des pièces simplifiées : les traits épais tombent pile sur les fins.
    pieces = []
    for k, (n, fr, g, _) in UNITATS.items():
        if k not in geoms:
            continue
        if n == P and g in gardes:
            pieces.append(({'kod': k, 'gov': g, 'part': round(part[k], 3)}, geoms[k]))
        elif n == F and k in gardes:
            pieces.append(({'kod': k, 'gov': '', 'part': 0 if k in MARGE_FORCEE else round(part[k], 3)}, geoms[k]))
    entree = os.path.join(TRABALH, 'pecas-l93.json')
    sortie = os.path.join(TRABALH, 'pecas-simpl.json')
    gouv = os.path.join(TRABALH, 'governaments-simpl.json')
    ecrire_l93(entree, pieces)
    precision = f'{10 ** -DECIMALES:.{DECIMALES}f}'
    mapshaper('-i', entree, 'snap', '-proj', f'init={LAMBERT93}',
              '-clean', 'gap-fill-area=2000000',
              '-simplify', 'variable', 'keep-shapes',
              f'interval=part >= {PART_MARGE} ? {INTERVALLE_SIMPL} : {INTERVALLE_MARGE}',
              '-clean', 'gap-fill-area=2000000',
              # Passage en degrés et arrondi par mapshaper : le même sommet est
              # arrondi pareil des deux côtés d'une limite, et les croisements
              # créés par l'arrondi sont réparés.
              '-proj', 'wgs84', '-snap', f'precision={precision}', 'fix-geometry',
              '-clean', 'gap-fill-area=0.000001',
              '-o', sortie, 'format=geojson', f'precision={precision}', 'force')
    mapshaper('-i', sortie, '-filter', "gov !== ''", '-dissolve', 'gov',
              '-o', gouv, 'format=geojson', f'precision={precision}', 'force')
    with open(sortie, encoding='utf-8') as f:
        ps = json.load(f)['features']
    with open(gouv, encoding='utf-8') as f:
        gs = json.load(f)['features']
    res = {}
    for ft in ps:
        res[ft['properties']['kod']] = ogr.CreateGeometryFromJson(json.dumps(ft['geometry']))
    for ft in gs:
        res[ft['properties']['gov']] = ogr.CreateGeometryFromJson(json.dumps(ft['geometry']))
    return res


# ---------------------------------------------------------------- étape 6
def aire_signee(r):
    s = 0
    for i in range(len(r) - 1):
        s += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]
    return s / 2


def anneau_json(ring, exterieur):
    pts = []
    for i in range(ring.GetPointCount()):
        x, y = ring.GetX(i), ring.GetY(i)
        p = [round(x, DECIMALES), round(y, DECIMALES)]
        if not pts or p != pts[-1]:
            pts.append(p)
    if pts[0] != pts[-1]:
        pts.append(pts[0])
    if len(pts) < 4:
        return None
    sens = aire_signee(pts)
    if (exterieur and sens < 0) or (not exterieur and sens > 0):
        pts.reverse()   # RFC 7946 : extérieur dans le sens inverse des aiguilles d'une montre
    return pts


def geom_json(g):
    sortie = []
    for p in polys(g):
        ext = anneau_json(p.GetGeometryRef(0), True)
        if not ext:
            continue
        rings = [ext]
        for j in range(1, p.GetGeometryCount()):
            r = anneau_json(p.GetGeometryRef(j), False)
            if r:
                rings.append(r)
        sortie.append(rings)
    if len(sortie) == 1:
        return {'type': 'Polygon', 'coordinates': sortie[0]}
    return {'type': 'MultiPolygon', 'coordinates': sortie}


def pole_inaccessibilite(poly, precision=1000):
    """Point intérieur le plus éloigné du bord (méthode « polylabel », en mètres).
    Toujours sur la surface, comme PointOnSurface, mais bien au milieu de la forme."""
    bord = poly.Boundary()
    xmin, xmax, ymin, ymax = poly.GetEnvelope()

    def dist(x, y):
        p = ogr.Geometry(ogr.wkbPoint)
        p.AddPoint_2D(x, y)
        d = bord.Distance(p)
        return d if poly.Contains(p) else -d

    taille = min(xmax - xmin, ymax - ymin)
    if taille <= 0:
        pt = poly.PointOnSurface()
        return pt.GetX(), pt.GetY()
    demi = taille / 2
    tas = []
    x = xmin
    while x < xmax:
        y = ymin
        while y < ymax:
            cx, cy = x + demi, y + demi
            d = dist(cx, cy)
            heapq.heappush(tas, (-(d + demi * 1.4143), cx, cy, demi, d))
            y += taille
        x += taille
    pos = poly.PointOnSurface()
    meilleur = (dist(pos.GetX(), pos.GetY()), pos.GetX(), pos.GetY())
    while tas:
        _, cx, cy, h, d = heapq.heappop(tas)
        if d > meilleur[0]:
            meilleur = (d, cx, cy)
        if d + h * 1.4143 - meilleur[0] <= precision:
            continue
        h /= 2
        for dx in (-h, h):
            for dy in (-h, h):
                nd = dist(cx + dx, cy + dy)
                heapq.heappush(tas, (-(nd + h * 1.4143), cx + dx, cy + dy, h, nd))
    return meilleur[1], meilleur[2]


def point_etiquette(g):
    """Point d'étiquette dans le plus grand morceau de l'unité (degrés, 3 décimales)."""
    plus_grand = max(polys(g), key=lambda p: p.GetArea()).Clone()
    plus_grand.Transform(VERS_L93)
    x, y = pole_inaccessibilite(plus_grand)
    p = ogr.Geometry(ogr.wkbPoint)
    p.AddPoint_2D(x, y)
    p.Transform(VERS_WGS)
    eti = [round(p.GetX(), 3), round(p.GetY(), 3)]
    test = ogr.Geometry(ogr.wkbPoint)
    test.AddPoint_2D(*eti)
    if not g.Contains(test):   # l'arrondi l'a fait sortir : point sûr
        pt = max(polys(g), key=lambda q: q.GetArea()).PointOnSurface()
        eti = [round(pt.GetX(), 3), round(pt.GetY(), 3)]
    return eti


def ecrire(simpl, gardes):
    noms = lire_noms()
    feats = []
    invalides = []
    ordre = {G: 0, P: 1, F: 2}
    for k in sorted(gardes, key=lambda k: (ordre[UNITATS[k][0]], k)):
        n, fr, g, nota = UNITATS[k]
        geo = simpl[k]   # déjà en degrés (mapshaper)
        gj = geom_json(geo)
        verif = ogr.CreateGeometryFromJson(json.dumps(gj))
        if not verif.IsValid():
            # L'arrondi a pu créer un nœud papillon : on répare sur place et on
            # arrondit de nouveau (les sommets intacts restent identiques chez le voisin).
            dit(f'réparation après arrondi : {k}')
            gj = geom_json(multi([verif.MakeValid()]))
            verif = ogr.CreateGeometryFromJson(json.dumps(gj))
        if not verif.IsValid():
            invalides.append(k)
        if k not in noms:
            dit(f'(pas de nom occitan validé ou sourcé pour {k})')
        feats.append({'type': 'Feature', 'properties': {
            'kod': k, 'nivel': n, 'fr': fr, 'oc': noms.get(k),
            'governament': g, 'nota': nota, 'eti': point_etiquette(verif)},
            'geometry': gj})
    if invalides:
        raise SystemExit('Géométries invalides après arrondi : ' + ', '.join(invalides))
    out = {'type': 'FeatureCollection', 'font': FONT, 'features': feats}
    with open(SORTIDA, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
    dit(f'\nécrit {SORTIDA} : {len(feats)} unités, {os.path.getsize(SORTIDA) / 1024:.0f} Ko')


def main():
    prepara_brut()
    geoms, gardes, part = construire()
    simpl = simplifier(geoms, gardes, part)
    ecrire(simpl, gardes)


if __name__ == '__main__':
    main()
