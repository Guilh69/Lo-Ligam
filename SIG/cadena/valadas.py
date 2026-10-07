# Valadas occitanas d'Itàlia : comunas OpenStreetMap (ODbL) gropadas per
# valada, unidas, simplificadas (~150 m). Lista de las comunas : APROXIMATIVA,
# d'aprèp la lei 482/1999 e la lista de la Region Piemont, sens las comunas de
# plana de parlar piemontés (Barge, Saluzzo, Boves…) ; de validar per Romain.
# Sortida : valadas.json { valadas: [[code, nomFr, anels]], totas: anels },
# e valadas.geojson (union, pel domeni de la lenga).
import json
from osgeo import ogr, osr
ogr.UseExceptions()
S = 'C:/Users/perie/AppData/Local/Temp/claude/C--Users-perie-Documents-6-Projectes-Lo-Ligam/0e63bbde-6a7e-4082-97fe-1ae56a3855ba/scratchpad/osm/'

VALADAS = [
    ('V-SUSA', 'Haute vallée de Suse', ['Bardonecchia', 'Oulx', 'Cesana Torinese', 'Claviere', 'Sauze di Cesana', "Sauze d'Oulx", 'Salbertrand', 'Exilles', 'Chiomonte']),
    ('V-CLUSON', 'Val Chisone', ['Sestriere', 'Pragelato', 'Usseaux', 'Fenestrelle', 'Roure', 'Perosa Argentina', 'Pinasca', 'Inverso Pinasca', 'Villar Perosa', 'San Germano Chisone', 'Porte', 'Pramollo', 'Prarostino']),
    ('V-SANTMARTIN', 'Val Germanasca', ['Prali', 'Perrero', 'Massello', 'Salza di Pinerolo', 'Pomaretto']),
    ('V-PELIS', 'Val Pellice', ['Bobbio Pellice', 'Villar Pellice', 'Torre Pellice', 'Luserna San Giovanni', 'Angrogna', 'Rorà', 'Lusernetta', 'Bibiana', 'Bricherasio']),
    ('V-PO', 'Vallée du Pô', ['Crissolo', 'Oncino', 'Ostana', 'Paesana', 'Sanfront', 'Gambasca', 'Martiniana Po', 'Rifreddo']),
    ('V-VARACHA', 'Val Varaita', ['Pontechianale', 'Bellino', 'Casteldelfino', 'Sampeyre', 'Frassino', 'Melle', 'Brossasco', 'Isasca', 'Venasca', 'Rossana', 'Piasco']),
    ('V-MAIRA', 'Val Maira', ['Acceglio', 'Canosio', 'Prazzo', 'Marmora', 'Elva', 'Stroppo', 'Macra', 'Celle di Macra', 'San Damiano Macra', 'Cartignano', 'Roccabruna', 'Dronero', 'Villar San Costanzo']),
    ('V-GRANA', 'Val Grana', ['Castelmagno', 'Pradleves', 'Monterosso Grana', 'Valgrana', 'Montemale di Cuneo', 'Bernezzo', 'Caraglio']),
    ('V-ESTURA', 'Val Stura', ['Argentera', 'Pietraporzio', 'Sambuco', 'Vinadio', 'Aisone', 'Demonte', 'Moiola', 'Gaiola', 'Valloriate', 'Rittana', 'Roccasparvera', 'Borgo San Dalmazzo']),
    ('V-GES', 'Val Gesso', ['Entracque', 'Valdieri', 'Roaschia']),
    ('V-VERMENANHA', 'Val Vermenagna', ['Limone Piemonte', 'Vernante', 'Robilante', 'Roccavione']),
]

wgs, l93 = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326); l93.ImportFromEPSG(3035)  # projeccion europèa equivalenta, en mètres
for s in (wgs, l93): s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
versM, versWGS = osr.CoordinateTransformation(wgs, l93), osr.CoordinateTransformation(l93, wgs)

def anels_de(rel):
    # assembla los camins « outer » en anèls tampats
    trocs = [[(p['lon'], p['lat']) for p in m['geometry']] for m in rel['members'] if m['type'] == 'way' and m.get('role', 'outer') in ('outer', '') and 'geometry' in m]
    anels = []
    while trocs:
        a = trocs.pop(0)
        cambiat = True
        while a[0] != a[-1] and cambiat:
            cambiat = False
            for i, t in enumerate(trocs):
                if t[0] == a[-1]: a += t[1:]
                elif t[-1] == a[-1]: a += t[::-1][1:]
                elif t[-1] == a[0]: a = t[:-1] + a
                elif t[0] == a[0]: a = t[::-1][:-1] + a
                else: continue
                trocs.pop(i); cambiat = True; break
        if len(a) >= 4 and a[0] == a[-1]: anels.append(a)
    return anels

def poligon(anels):
    mp = ogr.Geometry(ogr.wkbMultiPolygon)
    for a in anels:
        r = ogr.Geometry(ogr.wkbLinearRing)
        for x, y in a: r.AddPoint_2D(x, y)
        p = ogr.Geometry(ogr.wkbPolygon); p.AddGeometry(r); mp.AddGeometry(p)
    return mp.Buffer(0)

comunas = {e['tags']['name']: e for e in json.load(open(S + 'comunas-it.json', encoding='utf-8'))['elements']}
sortida, totas, mancan = [], None, []
def en_anels(g):
    g = g.Clone(); g.Transform(versWGS)
    polys = [g] if g.GetGeometryName() == 'POLYGON' else [g.GetGeometryRef(i) for i in range(g.GetGeometryCount())]
    res = []
    for p in polys:
        r = p.GetGeometryRef(0)
        res.append([[round(r.GetX(k), 3), round(r.GetY(k), 3)] for k in range(r.GetPointCount())])
    return res
for code, nom, noms in VALADAS:
    u = None
    for n in noms:
        if n not in comunas: mancan.append(n); continue
        p = poligon(anels_de(comunas[n]))
        p.Transform(versM)
        u = p if u is None else u.Union(p)
    u = u.Buffer(50).Buffer(-50).SimplifyPreserveTopology(150)
    totas = u.Clone() if totas is None else totas.Union(u)
    sortida.append([code, nom, en_anels(u)])
    print(code, round(u.GetArea() / 1e6), 'km2')
totas = totas.Buffer(50).Buffer(-50).SimplifyPreserveTopology(150)
print('totas', round(totas.GetArea() / 1e6), 'km2 ; mancan :', mancan)
json.dump({'valadas': sortida, 'totas': en_anels(totas)}, open(S + 'valadas.json', 'w', encoding='utf-8'), ensure_ascii=False)
tw = totas.Clone(); tw.Transform(versWGS)
json.dump({'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'properties': {}, 'geometry': json.loads(tw.ExportToJson())}]}, open(S + 'valadas.geojson', 'w'))
