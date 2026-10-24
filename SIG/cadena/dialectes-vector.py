# Zones de dialectes : masques par classe -> polygones (calage polynomial),
# fusion de la bande sombre du Rhône dans l'auvergnat, découpe par le domaine
# final (avec vallées d'Italie et côte), lacunes rendues à la zone voisine.
import os
import json, subprocess, sys
from osgeo import ogr, osr
import os as _os
RAIZ = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..'))  # racine du projet, où qu'il soit
ogr.UseExceptions()
# entradas de la cadena (fòra Git) : SIG/brut/cadena-entradas
ENTRADAS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'brut', 'cadena-entradas') + '/'
d = ENTRADAS
CL = {1: 'gas', 2: 'lan', 3: 'pro', 4: 'lem', 5: 'auv', 6: 'viv', 7: 'auv'}
wgs, l93 = osr.SpatialReference(), osr.SpatialReference()
wgs.ImportFromEPSG(4326); l93.ImportFromEPSG(2154)
for s in (wgs, l93): s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
vL93, vWGS = osr.CoordinateTransformation(wgs, l93), osr.CoordinateTransformation(l93, wgs)

zones = {}
for k, cod in CL.items():
    subprocess.run([sys.executable, d + 'occitanica/vectorizar.py', f'dial-{k}.png', f'dial-{k}.geojson'], check=True)
    for f in json.load(open(d + f'occitanica/dial-{k}.geojson'))['features']:
        g = ogr.CreateGeometryFromJson(json.dumps(f['geometry'])); g.Transform(vL93)
        zones[cod] = g.Buffer(0) if cod not in zones else zones[cod].Union(g).Buffer(0)

dom = ogr.CreateGeometryFromJson(json.dumps(json.load(open(d + 'limits/domeni-occitanica-costa.geojson'))['features'][0]['geometry']))
dom.Transform(vL93)
# l'auvergnat s'arrête au Rhône : la bande sombre qui le déborde (recouvrement
# auvergnat / vivaro-alpin sur la carte) est rendue, à l'est du fleuve, aux
# zones voisines par la découpe en carreaux plus bas
est = ogr.CreateGeometryFromJson(json.dumps(json.load(open(d + 'occitanica/est-rose.geojson'))['features'][0]['geometry']))
est.Transform(vL93)
zones['auv'] = zones['auv'].Difference(est).Buffer(0)
# Corrections à la main (sources ou Romain), appliquées avant la découpe :
# la zone est retirée aux autres dialectes et donnée à celui indiqué
CORRECCIONS = [
    # Gévaudan : Mende et Marvejols languedociens, en transition vers l'auvergnat
    # (Romain, 2026-10-07 ; la carte Occitanica les met en auvergnat). Le nord
    # de la Lozère (Margeride : Saint-Chély-d'Apcher, Le Malzieu) reste auvergnat.
    ('lan', 'POLYGON((2.95 44.66, 3.45 44.68, 3.75 44.63, 3.98 44.56, 3.98 44.0, 2.95 44.0, 2.95 44.66))'),
]
# Correccions de la recèrca sus las transicions (SIG/Dialecte/transicions-dialectes.json),
# validadas per Romain lo 2026-10-07 : Ardèche (nòrd vivaroaupenc, sud lengadocian),
# Gironda e Òlt e Garona (gascon), Alps Maritims (Vesubia, Tinèa, Mentonasc :
# vivaroaupenc), Isèra (Vercòrs, Trièves, Oisans : vivaroaupenc). Dins l'òrdre de la recèrca.
RECERCA = json.load(open(RAIZ + '/SIG/Dialecte/transicions-dialectes.json', encoding='utf-8'))['corrections']
APLICADAS = ['velay-vivarais-nord', 'bas-vivarais', 'ardeche-rhodanienne', 'bordelais-rive-droite', 'garonnais-albret', 'brulhois', 'vesubie-tinee', 'mentonnais', 'isere-vercors-oisans',
             # limitas debatudas, conselhs de la recèrca seguits (Romain, 2026-10-07)
             'creuse-correze-est', 'baronnies-sud', 'perigord-ouest',
             # pichonas correccions (confiança mejana), validadas per Romain
             'toulouse-ouest', 'couserans-massat', 'carlades-pierrefort', 'vidourle', 'digne-annot']
for c in sorted([c for c in RECERCA if c['id'] in APLICADAS], key=lambda c: c.get('ordre', 0)):
    p = c['polygone']
    if p[0] != p[-1]: p = p + [p[0]]
    CORRECCIONS.append((c['dialecte'], 'POLYGON((' + ','.join('%f %f' % (x, y) for x, y in p) + '))'))
for cod, wkt in CORRECCIONS:
    g = ogr.CreateGeometryFromWkt(wkt); g.Transform(vL93)
    g = g.Buffer(0)
    if cod == 'lan' and wkt.startswith('POLYGON((2.95 44.66'): g = g.Intersection(zones['auv'].Union(zones['lan']))
    for c in zones:
        if c != cod: zones[c] = zones[c].Difference(g).Buffer(0)
    zones[cod] = zones[cod].Union(g).Buffer(0)
# chaque zone limitée au domaine, sans recouvrement (ordre de priorité fixe)
pris = None
for cod in ['gas', 'lan', 'pro', 'lem', 'auv', 'viv']:
    z = zones[cod].Intersection(dom).Buffer(0)
    if pris is not None: z = z.Difference(pris).Buffer(0)
    zones[cod] = z
    pris = z.Clone() if pris is None else pris.Union(z).Buffer(0)
# lacunes du domaine (vallées d'Italie, frange côtière, interstices) : découpées
# en carreaux de 4 km, chacun rendu à la zone qui le touche le plus (une bande
# côtière d'un seul tenant irait sinon tout entière à un seul dialecte)
lac = dom.Difference(pris).Buffer(0)
env = lac.GetEnvelope()
morceaux = []
C = 4000
x = env[0]
while x < env[1]:
    y = env[2]
    while y < env[3]:
        cel = ogr.CreateGeometryFromWkt(f'POLYGON(({x} {y},{x+C} {y},{x+C} {y+C},{x} {y+C},{x} {y}))')
        p = cel.Intersection(lac)
        if p and not p.IsEmpty() and p.GetArea() > 1: morceaux.append(p)
        y += C
    x += C
# chaque carreau va à la zone d'ORIGINE la plus proche (zones figées : une
# attribution de proche en proche faisait courir un dialecte le long de toute
# la côte, ex. le languedocien jusqu'à Port-Saint-Louis)
fixas = {c: zones[c].Clone() for c in zones}
n = 0
for p in morceaux:
    estRose = p.Centroid().Within(est)
    # à l'est du Rhône, ni auvergnat ni languedocien
    cands = [c for c in fixas if not (estRose and c in ('auv', 'lan'))]
    best = min(cands, key=lambda c: (round(p.Distance(fixas[c]) / 500), -p.Buffer(2000).Intersection(fixas[c]).GetArea()))
    zones[best] = zones[best].Union(p).Buffer(0); n += 1
print('lacunes rendues :', n)

feats = []
ETI_MAN = {'lem': (1.25, 45.52)}  # le nom couvrait Limòtges
NOMS = {'gas': ('gascon', 'Gascon'), 'lan': ('lengadocian', 'Languedocien'), 'pro': ('provençal', 'Provençal'),
        'lem': ('lemosin', 'Limousin'), 'auv': ('auvernhat', 'Auvergnat'), 'viv': ('vivaroaupenc', 'Vivaro-alpin')}
for cod in ['gas', 'lan', 'pro', 'lem', 'auv', 'viv']:
    z = zones[cod].SimplifyPreserveTopology(400)
    # étiquette : point intérieur le plus éloigné des bords (approché)
    eti = z.Buffer(-15000) if z.Buffer(-15000).GetArea() > 0 else z
    pt = eti.PointOnSurface()
    # place du nom choisie à la main quand le point calculé tombe sur une grande ville
    if cod in ETI_MAN:
        pt = ogr.CreateGeometryFromWkt('POINT(%f %f)' % ETI_MAN[cod]); pt.Transform(vL93)
    # garder seulement les morceaux de plus de 4 km²
    if z.GetGeometryName() == 'MULTIPOLYGON':
        m = ogr.Geometry(ogr.wkbMultiPolygon)
        for i in range(z.GetGeometryCount()):
            if z.GetGeometryRef(i).GetArea() > 4e6: m.AddGeometry(z.GetGeometryRef(i))
        z = m
    print(cod, 'km2', round(z.GetArea() / 1e6), 'morceaux', z.GetGeometryCount() if z.GetGeometryName() == 'MULTIPOLYGON' else 1)
    z.Transform(vWGS); pt.Transform(vWGS)
    gj = json.loads(z.ExportToJson())
    def arr(c): return [arr(x) for x in c] if isinstance(c[0], list) else [round(c[0], 3), round(c[1], 3)]
    gj['coordinates'] = arr(gj['coordinates'])
    feats.append({'type': 'Feature', 'properties': {'kod': cod, 'oc': NOMS[cod][0], 'fr': NOMS[cod][1], 'eti': [round(pt.GetX(), 3), round(pt.GetY(), 3)]}, 'geometry': gj})
json.dump({'type': 'FeatureCollection', 'font': "Carta dels dialèctes d'Occitanica (Mediatèca Occitanica), calada en Lambert-93", 'features': feats},
          open(d + 'occitanica/dialectes-occitanica.geojson', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
