# Parcs naturels : étape GDAL (QGIS Python), appelée par parcs.mjs.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" parcs.py decopar
#       lit les fichiers bruts de SIG/brut/natura (voir parcs.mjs pour les
#       téléchargements), reconstruit le PNR Comminges-Barousse-Pyrénées à
#       partir des communes du décret, extrait les parcs du Piémont, découpe le
#       tout selon le domaine de la langue (prolongé en mer, voir masque())
#       et écrit SIG/brut/natura/parcs-decopats.geojson (pleine précision).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" parcs.py simplificar <mètres> <sortie>
#       simplifie chaque parc (bord commun exact entre cœur et aire
#       d'adhésion), enlève les morceaux et les trous de moins de 0,5 km²,
#       cale les sommets à 4 décimales.
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" parcs.py verificar <fichier>
#       vérifie que chaque géométrie du fichier final est valide et que son
#       point d'étiquette tombe dedans.
#
# Tous les chemins sont relatifs à ce script.
import json, os, re, sys, unicodedata
from osgeo import gdal, ogr, osr

gdal.UseExceptions()
ogr.UseExceptions()
osr.UseExceptions()

AQUI = os.path.dirname(os.path.abspath(__file__))
BRUT = os.path.normpath(os.path.join(AQUI, '..', 'brut', 'natura'))
DATA = os.path.normpath(os.path.join(AQUI, '..', '..', 'app', 'static', 'data'))

wgs, laea = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326)
laea.ImportFromEPSG(3035)  # projection européenne à surfaces égales, en mètres
for s in (wgs, laea):
    s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versM = osr.CoordinateTransformation(wgs, laea)
versW = osr.CoordinateTransformation(laea, wgs)


def km2(g):
    c = g.Clone()
    c.Transform(versM)
    return c.GetArea() / 1e6


def valide(g):
    if g is None or g.IsEmpty():
        return g
    if not g.IsValid():
        g = g.MakeValid()
    # ne garder que les surfaces (MakeValid ou Intersection peuvent rendre des
    # collections avec des lignes ou des points)
    if g.GetGeometryType() in (ogr.wkbGeometryCollection, ogr.wkbGeometryCollection25D):
        m = ogr.Geometry(ogr.wkbMultiPolygon)
        for i in range(g.GetGeometryCount()):
            p = g.GetGeometryRef(i)
            t = ogr.GT_Flatten(p.GetGeometryType())
            if t == ogr.wkbPolygon:
                m.AddGeometry(p)
            elif t == ogr.wkbMultiPolygon:
                for j in range(p.GetGeometryCount()):
                    m.AddGeometry(p.GetGeometryRef(j))
        g = m
    return g


def poly_de_anels(anels):
    p = ogr.Geometry(ogr.wkbPolygon)
    for a in anels:
        r = ogr.Geometry(ogr.wkbLinearRing)
        for x, y in a:
            r.AddPoint_2D(x, y)
        r.CloseRings()
        p.AddGeometry(r)
    return p


# ---------------------------------------------------------------- masque
# Le domaine de limits-carta.json suit, le long de la mer, une côte grossière
# (Natural Earth) : découper les parcs côtiers et marins par ce contour les
# amputerait (îles d'Hyères, cœurs marins des Calanques et de Port-Cros, parcs
# marins). On remplace donc les deux tronçons côtiers du contour par un détour
# en mer, tracé à la main, qui part des deux points où la limite terrestre de
# la langue touche la côte :
#  - Atlantique : du point basque (Bidart) plein ouest jusqu'à 3,5° O, au nord
#    jusqu'à 45,60° N (entre Royan et la pointe de Grave), puis par le milieu
#    de l'estuaire de la Gironde jusqu'à la rive du Médoc (Saint-Estèphe) ;
#    au-delà, l'estuaire reste coupé par le contour du domaine (le Blayais et
#    la Saintonge sont hors domaine).
#  - Méditerranée : de Menton vers le sud-est puis plein sud jusqu'à 41,6° N,
#    à l'ouest jusqu'à 4,2° E, puis plein ouest à la latitude de la limite
#    catalane (grau de Leucate) : la mer au large du Roussillon est exclue.
# Les trous du domaine (Monaco, étang de Berre, Petite Gavacherie) sont gardés.
DETOUR_ATL = [(-3.5, None), (-3.5, 45.60), (-1.05, 45.60), (-0.97, 45.52), (-0.86, 45.44), (-0.80, 45.37)]
ATTACHE_ESTUAIRE = (-0.75, 45.334)  # sommet du contour du domaine, rive du Médoc
DETOUR_MED = [(7.62, 43.62), (7.62, 41.6), (4.2, 41.6), (4.2, None)]


def masque():
    lim = json.load(open(os.path.join(DATA, 'limits-carta.json'), encoding='utf-8'))
    dom = lim['domeni']
    ext = dom['anels'][0]
    l0, l1 = dom['linhas'][0], dom['linhas'][1]

    def proche(p):
        return min(range(len(ext) - 1), key=lambda i: (ext[i][0] - p[0]) ** 2 + (ext[i][1] - p[1]) ** 2)

    # linha 0 : de l'estuaire de la Gironde à Menton ; linha 1 : de Leucate à la côte basque
    i_menton = proche(l0[-1])
    i_leucate = proche(l1[0])
    i_estuaire = proche(ATTACHE_ESTUAIRE)
    # le contour tourne dans le sens des aiguilles d'une montre : la côte
    # atlantique va de l'indice 0 (Bidart) à l'estuaire, la côte
    # méditerranéenne de Menton à Leucate
    assert ext[0] == ext[-1]
    assert 0 < i_estuaire < i_menton < i_leucate, (i_estuaire, i_menton, i_leucate)
    basque = ext[0]
    leucate = ext[i_leucate]
    anel = []
    anel += ext[i_estuaire:i_menton + 1]
    anel += [(x, leucate[1] if y is None else y) for x, y in DETOUR_MED]
    anel += ext[i_leucate:]  # se termine sur ext[-1] == ext[0] (Bidart)
    anel += [(x, basque[1] if y is None else y) for x, y in DETOUR_ATL]
    anel.append(ext[i_estuaire])
    m = poly_de_anels([anel] + dom['anels'][1:])
    assert m.IsValid(), 'masque invalide'
    domaine = poly_de_anels(dom['anels'])
    if not domaine.IsValid():
        domaine = domaine.MakeValid()
    return m, domaine


# ------------------------------------------------------- noms et tables
# kod : code MNHN pour la France (FR80… PNR, FR33… cœur, FR34… aire
# d'adhésion, FR91… parc marin), code EUAP (liste officielle italienne) pour
# l'Italie, code fait main pour Comminges (pas encore de code MNHN).
# fr : nom officiel complet ; wd : élément Wikidata (pour le nom occitan).
PATRINAT = {
    # PNR
    'FR8000049': ('Parc naturel régional des Préalpes d\'Azur', 'Q3364630'),
    'FR8000001': ('Parc naturel régional du Vercors', 'Q3364644'),
    'FR8000031': ('Parc naturel régional du Massif des Bauges', 'Q3123538'),
    'FR8000033': ('Parc naturel régional du Verdon', 'Q1690573'),
    'FR8000035': ('Parc naturel régional Périgord-Limousin', 'Q850607'),
    'FR8000011': ('Parc naturel régional de Camargue', 'Q1570460'),
    'FR8000004': ('Parc naturel régional de Chartreuse', 'Q3364619'),
    'FR8000027': ('Parc naturel régional du Pilat', 'Q3364643'),
    'FR8000014': ('Parc naturel régional des Grands Causses', 'Q2685564'),
    'FR8000028': ('Parc naturel régional des Volcans d\'Auvergne', 'Q2138367'),
    'FR8000039': ('Parc naturel régional des Causses du Quercy', 'Q2323358'),
    'FR8000015': ('Parc naturel régional du Haut-Jura', 'Q3364633'),
    'FR8000016': ('Parc naturel régional du Haut-Languedoc', 'Q3364639'),
    'FR8000002': ('Parc naturel régional du Queyras', 'Q3364641'),
    'FR8000047': ('Parc naturel régional des Pyrénées ariégeoises', 'Q2138364'),
    'FR8000050': ('Parc naturel régional du Marais poitevin', 'Q3364387'),
    'FR8000054': ('Parc naturel régional de l\'Aubrac', 'Q54561886'),
    'FR8000045': ('Parc naturel régional de Millevaches en Limousin', 'Q2138344'),
    'FR8000055': ('Parc naturel régional du Médoc', 'Q64174288'),
    'FR8000059': ('Parc naturel régional Corbières-Fenouillèdes', 'Q108539989'),
    'FR8000008': ('Parc naturel régional de la Brenne', 'Q1304427'),
    'FR8000044': ('Parc naturel régional des Pyrénées catalanes', 'Q1570794'),
    'FR8000053': ('Parc naturel régional de la Sainte-Baume', 'Q49119210'),
    'FR8000003': ('Parc naturel régional du Luberon', 'Q2138343'),
    'FR8000056': ('Parc naturel régional du Mont-Ventoux', 'Q97391055'),
    'FR8000052': ('Parc naturel régional des Baronnies provençales', 'Q19407172'),
    'FR8000042': ('Parc naturel régional de la Narbonnaise en Méditerranée', 'Q2138337'),
    'FR8000019': ('Parc naturel régional Livradois-Forez', 'Q911925'),
    'FR8000018': ('Parc naturel régional des Landes de Gascogne', 'Q780321'),
    'FR8000041': ('Parc naturel régional des Monts d\'Ardèche', 'Q1421234'),
    'FR8000046': ('Parc naturel régional des Alpilles', 'Q1516356'),
    # parcs nationaux : cœur (FR33…) et aire d'adhésion (FR34…), même nom
    'FR3300003': ('Parc national des Pyrénées', 'Q738435'),
    'FR3400003': ('Parc national des Pyrénées', 'Q738435'),
    'FR3300004': ('Parc national des Cévennes', 'Q1368807'),
    'FR3400004': ('Parc national des Cévennes', 'Q1368807'),
    'FR3300005': ('Parc national des Écrins', 'Q476446'),
    'FR3400005': ('Parc national des Écrins', 'Q476446'),
    'FR3300006': ('Parc national du Mercantour', 'Q1535042'),
    'FR3400006': ('Parc national du Mercantour', 'Q1535042'),
    'FR3300002': ('Parc national de Port-Cros', 'Q388279'),
    'FR3400002': ('Parc national de Port-Cros', 'Q388279'),
    'FR3300010': ('Parc national des Calanques', 'Q2600427'),
    'FR3400010': ('Parc national des Calanques', 'Q2600427'),
    'FR3300001': ('Parc national de la Vanoise', 'Q174250'),
    'FR3400001': ('Parc national de la Vanoise', 'Q174250'),
    # parcs naturels marins
    'FR9100003': ('Parc naturel marin du golfe du Lion', 'Q3364610'),
    'FR9100006': ('Parc naturel marin du bassin d\'Arcachon', 'Q17166771'),
    'FR9100007': ('Parc naturel marin de l\'estuaire de la Gironde et de la mer des Pertuis', 'Q19833246'),
}
# Écartés d'office : Pyrénées catalanes (choix de Romain), Vanoise (hors domaine).
ECARTES = {'FR8000044', 'FR3300001', 'FR3400001'}

# Piémont : codice_amministrativo -> (code EUAP, nom officiel italien, Wikidata)
PIEMONT = {
    'a8': ('IT-EUAP1057', 'Parco naturale delle Alpi Marittime', 'Q3364595'),
    'a9': ('IT-EUAP0214', 'Parco naturale del Marguareis', 'Q1533952'),
    'a18ter': ('IT-EUAP1253', 'Parco naturale del Monviso', 'Q47192508'),
    'a2': ('IT-EUAP0217', 'Parco naturale della Val Troncea', 'Q2052058'),
    'a3': ('IT-EUAP0223', 'Parco naturale Orsiera-Rocciavrè', 'Q2052054'),
    'a1': ('IT-EUAP0208', 'Parco naturale del Gran Bosco di Salbertrand', 'Q388329'),
    # en plus de la liste demandée : petit parc de la Val Germanasca (vallée occitane)
    'b4': ('IT-EUAP0884', 'Parco naturale di Conca Cialancia', 'Q16587118'),
    # testé seulement (piémont de Pignerol, en limite) : gardé si surtout dans le domaine
    'b3': ('IT-EUAP0887', 'Parco naturale del Monte Tre Denti - Freidour', 'Q3895655'),
}

COMMINGES = ('PNR-COMMINGES', 'Parc naturel régional Comminges-Barousse-Pyrénées', 'Q141066325', 2026)
# nom d'usage dans le décret -> nom officiel du Code officiel géographique
ALIAS_COMMUNES = {'Sainte-Marie-de-Barousse': 'Sainte-Marie'}  # 65391

# Un parc dont moins de 5 % de la surface tombe dans le domaine n'est pas
# montré (sinon : un lambeau de la Brenne dans le Croissant, un coin du
# Marguareis) ; il est signalé dans le rapport et dans la liste à valider.
PART_MIN = 0.05


def sans_accents(s):
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', ' ', s.lower()).strip()


def comminges():
    """Union des communes de l'article 1er (I) du décret 2026-606."""
    html = open(os.path.join(BRUT, 'decret-2026-606.html'), encoding='utf-8').read()
    texte = re.sub(r'<[^>]+>', '\n', html)
    texte = texte.replace('&nbsp;', ' ').replace('&#039;', "'").replace('&rsquo;', "'")
    debut = texte.index('Sont classés en parc naturel régional')
    fin = texte.index('II.', debut)
    art = texte[debut:fin]
    noms = {}
    for bloc in re.split(r'-\s*dans le département (?:de la |des )', art)[1:]:
        bloc = re.sub(r'\s+', ' ', bloc).strip()
        for dep, cle in (('31', 'Haute-Garonne'), ('65', 'Hautes-Pyrénées')):
            if bloc.startswith(cle):
                liste = bloc[len(cle):].strip().rstrip(';.').strip()
                noms[dep] = [n.strip() for n in liste.split(',') if n.strip()]
    com = json.load(open(os.path.join(BRUT, 'communes-comminges.json'), encoding='utf-8'))
    index = {}
    for f in com['features']:
        p = f['properties']
        index[(p['code_insee_du_departement'], sans_accents(p['nom_officiel']))] = f
    trouvees, manquantes = [], []
    for dep, liste in noms.items():
        for n in liste:
            f = index.get((dep, sans_accents(ALIAS_COMMUNES.get(n, n))))
            (trouvees if f else manquantes).append((dep, n, f))
    print('Comminges : %d communes dans le décret (31 : %d, 65 : %d), %d trouvées, manquantes : %s' % (
        sum(len(v) for v in noms.values()), len(noms['31']), len(noms['65']), len(trouvees),
        [m[1] for m in manquantes]))
    multi = ogr.Geometry(ogr.wkbMultiPolygon)
    for dep, n, f in trouvees:
        g = valide(ogr.CreateGeometryFromJson(json.dumps(f['geometry'])))
        if g.GetGeometryType() == ogr.wkbPolygon:
            multi.AddGeometry(g)
        else:
            for k in range(g.GetGeometryCount()):
                multi.AddGeometry(g.GetGeometryRef(k))
    u = valide(multi.UnionCascaded())
    codes = sorted(f['properties']['code_insee'] for _, _, f in trouvees)
    json.dump({'decret': 'n° 2026-606 du 9 juillet 2026, article 1er (I)', 'communes': codes},
              open(os.path.join(BRUT, 'comminges-communes.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    return u, len(manquantes)


def piemont():
    gpkg = os.path.join(BRUT, 'Aree_protette_Piemonte.gpkg')
    if not os.path.exists(gpkg):
        import zipfile
        zipfile.ZipFile(os.path.join(BRUT, 'Aree_protette_Piemonte.zip')).extractall(BRUT)
    ds = ogr.Open(gpkg)
    lay = ds.GetLayerByIndex(0)
    src = lay.GetSpatialRef().Clone()
    src.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    tr = osr.CoordinateTransformation(src, wgs)
    groupes, dates = {}, {}
    for f in lay:
        code = f.GetField('codice_amministrativo')
        if code not in PIEMONT:
            continue
        g = f.GetGeometryRef().Clone()
        g.Transform(tr)
        groupes.setdefault(code, []).append(valide(g))
        dates[code] = f.GetField('data_istituzione')
    res = []
    for code, geoms in groupes.items():
        u = geoms[0]
        for g in geoms[1:]:
            u = u.Union(g)
        kod, nom, wd = PIEMONT[code]
        annada = int(dates[code][-4:]) if dates.get(code) else None
        res.append((kod, nom, wd, annada, valide(u)))
    return res


def decopar():
    m, domaine = masque()
    print('masque : %.0f km² (domaine seul : %.0f km²)' % (km2(m), km2(domaine)))
    # contrôle : le détour en mer ne doit pas mordre sur la terre hors domaine
    dep = json.load(open(os.path.join(DATA, 'departements.geojson'), encoding='utf-8'))
    for f in dep['features']:
        if f['properties']['code'] in ('17', '64', '66', '33', '06'):
            g = valide(ogr.CreateGeometryFromJson(json.dumps(f['geometry'])))
            hors = valide(g.Intersection(m)).Difference(domaine)
            print('  département %s : terre ajoutée par le détour en mer, hors domaine : %.2f km²' % (
                f['properties']['code'], km2(hors) if hors and not hors.IsEmpty() else 0))

    entrees = []  # (kod, mena, fr, wd, annada, geom)
    for fichier, mena_de in (('wfs-pnr.json', lambda p: 'pnr'),
                             ('wfs-parc_national.json', lambda p: 'pn-cor' if p['zone'].startswith('C') else 'pn-adesion'),
                             ('wfs-pnm.json', lambda p: 'pnm')):
        d = json.load(open(os.path.join(BRUT, fichier), encoding='utf-8'))
        for f in d['features']:
            p = f['properties']
            kod = p['id_mnhn']
            if kod in ECARTES:
                continue
            fr, wd = PATRINAT[kod]
            annada = int(p['date_crea'][:4]) if p.get('date_crea') else None
            g = valide(ogr.CreateGeometryFromJson(json.dumps(f['geometry'])))
            entrees.append((kod, mena_de(p), fr, wd, annada, g))
    g, nmanq = comminges()
    entrees.append((COMMINGES[0], 'pnr', COMMINGES[1], COMMINGES[2], COMMINGES[3], g))
    for kod, nom, wd, annada, g in piemont():
        entrees.append((kod, 'parc-it', nom, wd, annada, g))

    sortie = {'type': 'FeatureCollection', 'features': []}
    rapport = []
    for kod, mena, fr, wd, annada, g in entrees:
        a0 = km2(g)
        c = valide(g.Intersection(m))
        a1 = km2(c) if c and not c.IsEmpty() else 0
        part = a1 / a0 if a0 else 0
        rapport.append((kod, fr, mena, round(a0, 1), round(a1, 1), round(part * 100, 1)))
        if a1 < 0.5 or part < PART_MIN:
            continue
        sortie['features'].append({'type': 'Feature', 'properties': {
            'kod': kod, 'mena': mena, 'fr': fr, 'wd': wd, 'annada': annada,
            'km2_total': round(a0, 1), 'km2_domeni': round(a1, 1), 'part': round(part, 4)},
            'geometry': json.loads(c.ExportToJson())})
    json.dump(sortie, open(os.path.join(BRUT, 'parcs-decopats.geojson'), 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump(rapport, open(os.path.join(BRUT, 'parcs-decopatge-rapport.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print('%d parcs en entrée, %d gardés (au moins 0,5 km² et 5 %% de leur surface dans le domaine)' % (len(entrees), len(sortie['features'])))
    for r in sorted(rapport, key=lambda r: r[5]):
        print('  %-12s %-6s %8.1f km² -> %8.1f km² (%5.1f %%) %s' % (r[0], r[2], r[3], r[4], r[5], r[1]))


def sans_miettes(g, seuil=0.5):
    """Enlève les morceaux et les trous de moins de `seuil` km²."""
    g = valide(g)
    t = ogr.GT_Flatten(g.GetGeometryType())
    polys = [g] if t == ogr.wkbPolygon else [g.GetGeometryRef(i) for i in range(g.GetGeometryCount())]
    res = ogr.Geometry(ogr.wkbMultiPolygon)
    for p in polys:
        if km2(poly_de_anneau(p.GetGeometryRef(0))) < seuil:
            continue
        q = ogr.Geometry(ogr.wkbPolygon)
        q.AddGeometry(p.GetGeometryRef(0))
        for k in range(1, p.GetGeometryCount()):
            if km2(poly_de_anneau(p.GetGeometryRef(k))) >= seuil:
                q.AddGeometry(p.GetGeometryRef(k))
        res.AddGeometry(q)
    return res


def poly_de_anneau(r):
    p = ogr.Geometry(ogr.wkbPolygon)
    p.AddGeometry(r)
    return p


def simplifier_m(g, tol):
    """Simplification Douglas-Peucker en mètres (projection LAEA), sans
    rendre la géométrie invalide (GEOS SimplifyPreserveTopology)."""
    c = g.Clone()
    c.Transform(versM)
    c = c.SimplifyPreserveTopology(tol)
    c.Transform(versW)
    return valide(c)


def finir(g):
    """Miettes enlevées, sommets calés sur une grille de 0,0001° (4 décimales,
    environ 10 m) sans créer d'anneau qui se recoupe, polygone simple si un
    seul morceau."""
    g = sans_miettes(g)
    g = valide(g.SetPrecision(1e-4))
    g = sans_miettes(g)
    if g.GetGeometryCount() == 1:
        g = g.GetGeometryRef(0).Clone()
    assert g.IsValid() and not g.IsEmpty()
    return g


def simplificar(tol, sortie):
    """Simplifie chaque parc à `tol` mètres. Le cœur et l'aire d'adhésion d'un
    parc national gardent un bord commun exact : on simplifie le cœur C et
    l'ensemble C + A, puis l'aire d'adhésion devient (C + A simplifié) moins
    C simplifié. Les parcs voisins venus de couches différentes (PNR, parc
    national, Piémont) sont simplifiés chacun de son côté : leurs bords
    communs, déjà légèrement décalés dans les sources, peuvent s'écarter
    d'au plus `tol` mètres."""
    d = json.load(open(os.path.join(BRUT, 'parcs-decopats.geojson'), encoding='utf-8'))
    geoms = {f['properties']['kod']: ogr.CreateGeometryFromJson(json.dumps(f['geometry'])) for f in d['features']}
    for f in d['features']:
        p = f['properties']
        kod = p['kod']
        if p['mena'] == 'pn-adesion' and kod.replace('FR34', 'FR33') in geoms:
            c = geoms[kod.replace('FR34', 'FR33')]
            cs = simplifier_m(c, tol)
            u = simplifier_m(valide(c.Union(geoms[kod])), tol)
            g = valide(u.Difference(cs))
        else:
            g = simplifier_m(geoms[kod], tol)
        g = finir(g)
        f['geometry'] = json.loads(g.ExportToJson(['COORDINATE_PRECISION=4']))
        f['properties'] = {k: p[k] for k in ('kod', 'mena', 'fr', 'wd', 'annada')}
    json.dump(d, open(sortie, 'w', encoding='utf-8'), ensure_ascii=False)
    print('%d parcs simplifiés à %g m' % (len(d['features']), tol))


def verificar(chemin):
    """Chaque géométrie doit être valide, et son point d'étiquette « eti »
    doit tomber dedans."""
    d = json.load(open(chemin, encoding='utf-8'))
    mauvais = 0
    for f in d['features']:
        p = f['properties']
        g = ogr.CreateGeometryFromJson(json.dumps(f['geometry']))
        if not g.IsValid():
            mauvais += 1
            print('INVALIDE :', p.get('kod'), p.get('fr'))
        if p.get('eti'):
            pt = ogr.Geometry(ogr.wkbPoint)
            pt.AddPoint_2D(*p['eti'])
            if not g.Contains(pt):
                mauvais += 1
                print('ÉTIQUETTE HORS DU PARC :', p.get('kod'), p['eti'])
    print('%d géométries, %d erreurs' % (len(d['features']), mauvais))
    sys.exit(1 if mauvais else 0)


if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else 'decopar'
    if mode == 'verificar':
        verificar(sys.argv[2])
    elif mode == 'simplificar':
        simplificar(float(sys.argv[2]), sys.argv[3])
    else:
        decopar()
