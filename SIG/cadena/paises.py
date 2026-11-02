# Jaç « Païses tradicionals » : los bailiatges e senescalcias de 1789.
#
# Aviada (de qualque dorsièr que siá) :
#   "C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat" SIG\cadena\paises.py
#
# Dintradas (las meteissas que SIG/cadena/provincias.py, utilizat coma modul) :
#   - Gay, Gobbi, Goñi 2024, « Bailliages in 1789 France », Harvard Dataverse,
#     doi:10.7910/DVN/T8UXHK, CC BY 4.0 (segon l'atlàs d'A. Brette, 1904), dins
#     SIG/brut/provincias/ (non seguit per Git, tornat telecargar se manca) :
#     contorns (BAILLIAGES_1789_BRETTE.shp) e noms amb accents
#     (BAILLIAGES_1789_BRETTE.txt, encodatge Windows-1252).
#   - Los territòris fòra del reialme, fabricats per provincias.py (Avinhon, Comtat,
#     comtat de Saut, Bidaishe, Niça, Monegue, Aran, valadas d'Itàlia).
# Dintradas seguidas per Git :
#   - SIG/provincias/taula-bailliages.csv : bailiatge -> província -> governament.
#   - SIG/paises/taula-paises.csv : país atestat e nom occitan de cada unitat, amb
#     lors fonts (de relegir per Romain). Las fonts e los dobtes : SIG/paises/FONTS.md.
#   - app/static/data/limits-carta.json : domeni de la lenga.
# Sortida : app/static/data/paises-1789.json
#
# Nivèl causit : cada bailiatge o senescalcia de Brette, principal o secondari,
# amb son pròpri contorn (es lo nivèl mai fin de las donadas en polígons).
#
# Etapas : 1) provincias.construire() fa lo domeni e los territòris fòra del
# reialme ; lo comtat de Saut (dins la Provença per las provincias) es tractat
# a despart ; 2) part de cada unitat dins lo domeni : se gardan las qu'i an
# almens 5 % (sens las talhar), e las que taparián un trauc dins lo domeni
# (enclavas) ; 3) mapshaper (MPL-2.0, per npx) : neteja,
# simplificacion amb topologia (environ 1,1 km per las unitats sustot dins lo
# domeni, 3 km per las autras ; variablas PAIS_INTERVALLE e PAIS_MARGE),
# arredondit a 3 decimalas ; 4) escritura del GeoJSON.
# Una unitat gardada que manca dins taula-paises.csv arrèsta lo script, que
# n'escriu la linha de començar (de completar a la man).

import csv
import json
import os
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
import provincias as P   # noqa: E402  (meteissa cadena, meteis tractament del domeni)

from osgeo import ogr     # noqa: E402

SIG = P.SIG
TAULA_PAISES = os.path.join(SIG, 'paises', 'taula-paises.csv')
TRABALH = os.path.join(SIG, 'brut', 'paises', 'trabalh')
SORTIDA = os.path.join(P.DEPOT, 'app', 'static', 'data', 'paises-1789.json')

SEUIL_DOMAINE = P.SEUIL_DOMAINE   # 5 %, coma las provincias
INTERVALLE_SIMPL = int(os.environ.get('PAIS_INTERVALLE', 1100))  # mètres, unitats sustot dins lo domeni
INTERVALLE_MARGE = int(os.environ.get('PAIS_MARGE', 3000))      # mètres, las autras
PART_MARGE = P.PART_MARGE
MARGE_FORCEE = P.MARGE_FORCEE    # Aran e Itàlia : lor contorn es lo del domeni
DECIMALES = P.DECIMALES
COLONAS = ['id', 'nom_fr', 'mena', 'cap', 'provincia_fr', 'pais_fr', 'font_pais', 'oc', 'font_oc', 'a_validar']
FONT = ("Gay, Gobbi & Goñi 2024, d'après Brette 1904 (CC BY 4.0) ; IGN (Licence ouverte) ; "
        "OpenStreetMap (ODbL) ; noms occitans : IEO BdTopoc (ODbL), Wikidata (CC0), Wikipèdia (CC BY-SA), "
        "à valider ; données regroupées et simplifiées")

# Territòris fòra dels bailiatges : id de taula-bailliages.csv -> kod de provincias.py
TERRITORIS = {'terr-I': 'avignon', 'terr-II': 'comtat', 'terr-III': 'bidache', 'terr-IX': 'sault',
              'terr-XIII': 'nice', 'terr-mon': 'monaco', 'terr-aran': 'aran', 'terr-it': 'sardaigne'}
NOTA_SAULT = ("Hors des bailliages chez Brette (territoire IX). Terre adjacente de Provence, "
              "rattachée à la Provence comme dans la couche des provinces.")

# Mena de jurisdiccion, legida al començament del nom long (Gay et al.)
MENAS = [('sénéchaussée', 'sénéchaussée'), ('sénéchausée', 'sénéchaussée'), ('bailliage', 'bailliage'),
         ('baillage', 'bailliage'), ('baillaige', 'bailliage'), ('siège royal', 'siège royal'),
         ('pays', 'pays'), ('comté', 'comté'), ('souveraineté', 'souveraineté'), ('royaume', 'royaume'),
         ('élection', 'élection'), ('principauté', 'principauté'), ('ville et terroir', 'ville et terroir'),
         ('viguerie', 'viguerie'), ('baronnie', 'baronnie'), ('prévôté', 'prévôté'),
         ('gouvernance', 'gouvernance'), ('châtellenie', 'châtellenie'), ('vicomté', 'vicomté'),
         ('juridiction', 'juridiction'), ('district', 'district'), ('ville', 'ville'), ('province', 'province')]


def dit(*a):
    print(*a, flush=True)


def mena_de(nom_long):
    n = nom_long.lower()
    for debut, mena in MENAS:
        if n.startswith(debut):
            return mena
    raise SystemExit(f'Mena desconeguda : {nom_long}')


def kod_de(i):
    return TERRITORIS.get(i) or 'b' + i.lower()


# ---------------------------------------------------------------- donadas
def lire_txt():
    """Taula de Gay et al. amb accents (lo .dbf es en majusculas sens accents)."""
    txt = {}
    with open(os.path.join(P.BRUT, 'BAILLIAGES_1789_BRETTE.txt'), encoding='cp1252', newline='') as f:
        for r in csv.DictReader(f):
            txt[r['bailliage']] = r
    return txt


def lire_taula_paises():
    if not os.path.exists(TAULA_PAISES):
        return {}
    with open(TAULA_PAISES, encoding='utf-8-sig', newline='') as f:
        lignes = list(csv.DictReader(f, delimiter=';'))
    if lignes and list(lignes[0].keys()) != COLONAS:
        raise SystemExit('Colonas inesperadas dins taula-paises.csv : ' + ';'.join(lignes[0].keys()))
    for r in lignes:
        if None in r:   # un « ; » de tròp dins un tèxte
            raise SystemExit(f"taula-paises.csv, linha {r['id']} : tròp de « ; » (utilizar « / » dins los tèxtes)")
    return {r['id'].strip(): r for r in lignes}


def nom_oc_valid(r):
    """Coma per las provincias : una forma prepausada sens font (font_oc que
    comença per « Proposition ») dintra pas dins la carta tant que Romain l'a pas
    validada (a_validar = non)."""
    oc = (r.get('oc') or '').strip()
    font = (r.get('font_oc') or '').strip().lower()
    valide = (r.get('a_validar') or '').strip().lower() == 'non'
    return oc if oc and (valide or not font.startswith('proposition')) else None


# ---------------------------------------------------------------- etapas 1 e 2
def construire():
    # Domeni e territòris fòra del reialme : los de provincias.py, sens son jornal
    dit_prov = P.dit
    P.dit = lambda *a: None
    try:
        geoms_p, gardes_p, part_p = P.construire()
    finally:
        P.dit = dit_prov
    dom, _ = P.lire_domaine()

    txt = lire_txt()
    taula = P.lire_taula()
    ds = ogr.Open(os.path.join(P.BRUT, 'bailliages', 'BAILLIAGES_1789_BRETTE.shp'))
    bail = {ft['BAIL_ID']: P.propre(ft.GetGeometryRef().Clone()) for ft in ds.GetLayer()}
    ds = None

    unitats = {}   # kod -> dict (proprietats sens geometria)
    geoms = {}
    part = {}
    provence = []
    for r in taula:
        i = r['bailliage_id']
        if i.startswith('terr-'):
            continue
        if r['provincia_fr'] == 'Provence':
            provence.append(bail[i])
        g = bail[i]
        p = g.Intersection(dom).GetArea() / g.GetArea()
        t = txt[i]
        prov = P.kod_par_nom(P.P, r['provincia_fr'])
        cap = t['cl_nom_1999']
        if t['cl_nom_2021'] != cap:
            cap += f" (aujourd'hui {t['cl_nom_2021']})"
        k = kod_de(i)
        unitats[k] = {
            'id': i, 'nivel': 'pais', 'court': t['bailliage_name_prop'],
            'nom_fr': t['bailliage_name_brette'], 'mena': mena_de(t['bailliage_name_long_prop']),
            'cap': cap, 'rang': 'secondari' if t['bailliage_rank'] == '3' else 'principal',
            'principal': kod_de(t['bailliage_sup']) if t['bailliage_sup'] else None,
            'provincia_fr': r['provincia_fr'], 'provincia': prov, 'governament': P.UNITATS[prov][2],
            'nota': None}
        geoms[k] = g
        part[k] = p

    # Comtat de Saut : la Provença de provincias.py, mens sos bailiatges
    sault = P.sans_miettes(P.propre(geoms_p['provence'].Difference(P.union(provence))), 1)
    a = sault.GetArea()
    if a:
        unitats['sault'] = {
            'id': 'terr-IX', 'nivel': 'pais', 'court': 'Comté de Sault', 'nom_fr': 'Comté de Sault',
            'mena': 'comté', 'cap': '', 'rang': None, 'principal': None, 'provincia_fr': 'Provence',
            'provincia': 'provence', 'governament': 'g-provence', 'nota': NOTA_SAULT}
        geoms['sault'] = sault
        part['sault'] = sault.Intersection(dom).GetArea() / a

    # Autres territòris fòra del reialme, gardats per provincias.py
    for i, k in TERRITORIS.items():
        if k == 'sault' or k not in gardes_p:
            continue
        n, fr, _, nota = P.UNITATS[k]
        unitats[k] = {
            'id': i, 'nivel': 'fora', 'court': fr, 'nom_fr': fr, 'mena': 'hors du royaume', 'cap': '',
            'rang': None, 'principal': None, 'provincia_fr': fr, 'provincia': None, 'governament': None,
            'nota': nota}
        geoms[k] = geoms_p[k]
        part[k] = part_p[k]

    gardes = {k for k in unitats if part[k] >= SEUIL_DOMAINE}
    fermar_traucs(unitats, geoms, part, gardes, dom)
    dit('\nunitat ; mena ; km2 ; part dins lo domeni')
    for k in sorted(gardes, key=lambda k: unitats[k]['id']):
        dit(f"{unitats[k]['id']} {unitats[k]['nom_fr']} ; {unitats[k]['mena']} ; "
            f"{geoms[k].GetArea() / 1e6:.0f} ; {100 * part[k]:.1f} %")
    return unitats, geoms, part, gardes


def fermar_traucs(unitats, geoms, part, gardes, dom):
    """Una unitat jos los 5 % que fa un trauc dins lo domeni, al mièg de las
    unitats gardadas (una enclava), es gardada tanben : se que non la carta
    auriá un trauc dins lo domeni. Cas conegut : un tròç del bailiatge de
    Châteauroux (149 km2, quasi tot dins lo domeni), enclavat al mièg de las
    unitats gardadas."""
    while True:
        traucs = []
        for p in P.polys(P.union([geoms[k] for k in gardes])):
            for j in range(1, p.GetGeometryCount()):
                h = ogr.Geometry(ogr.wkbPolygon)
                h.AddGeometry(p.GetGeometryRef(j).Clone())
                h = h.Intersection(dom)
                if h.GetArea() > 1e6:   # mai d'1 km2 dins lo domeni
                    traucs.append(h)
        novelas = {}
        for h in traucs:
            for k in unitats:
                if k not in gardes:
                    a = sum(q.GetArea() for q in P.polys(geoms[k].Intersection(h)))
                    if a > 1e6:
                        novelas[k] = novelas.get(k, 0) + a
        if not novelas:
            return
        for k, a in novelas.items():
            pc = f'{100 * part[k]:.1f}'.replace('.', ',')
            unitats[k]['nota'] = (f"{pc} % seulement dans le domaine : dessinée en entier "
                                  f"parce qu'une de ses enclaves y ferait un trou.")
            dit(f"gardada per tapar un trauc de {a / 1e6:.0f} km2 dins lo domeni : "
                f"{unitats[k]['id']} {unitats[k]['nom_fr']}")
        gardes |= set(novelas)


# ---------------------------------------------------------------- taula de las fonts
def legir_fonts(unitats, gardes):
    taula = lire_taula_paises()
    manquent = [k for k in gardes if unitats[k]['id'] not in taula]
    if manquent:
        dit('\nUnitats absentas de SIG/paises/taula-paises.csv (linhas de completar) :')
        dit(';'.join(COLONAS))
        for k in sorted(manquent, key=lambda k: unitats[k]['id']):
            u = unitats[k]
            dit(';'.join([u['id'], u['nom_fr'], u['mena'], u['cap'], u['provincia_fr'] or '', '', '', '', '', 'oui']))
        raise SystemExit(f'{len(manquent)} unitat(s) sens linha dins taula-paises.csv')
    ids = {unitats[k]['id'] for k in gardes}
    for i in sorted(set(taula) - ids):
        dit(f'(linha {i} de taula-paises.csv sens unitat gardada : ignorada)')
    # Las colonas recopiadas de Brette devon èsser las de las donadas
    for k in gardes:
        u, r = unitats[k], taula[unitats[k]['id']]
        for c in ('nom_fr', 'mena', 'cap', 'provincia_fr'):
            if (r[c] or '').strip() != (u[c] or ''):
                dit(f"ATENCION {u['id']} : {c} = « {r[c]} » dins la taula, « {u[c]} » dins las donadas")
    return taula


# ---------------------------------------------------------------- etapa 3 (mapshaper)
def simplifier(geoms, gardes, part):
    os.makedirs(TRABALH, exist_ok=True)
    pieces = [({'kod': k, 'part': 0 if k in MARGE_FORCEE else round(part[k], 3)}, geoms[k])
              for k in sorted(gardes)]
    entree = os.path.join(TRABALH, 'paises-l93.json')
    sortie = os.path.join(TRABALH, 'paises-simpl.json')
    P.ecrire_l93(entree, pieces)
    precision = f'{10 ** -DECIMALES:.{DECIMALES}f}'
    P.mapshaper('-i', entree, 'snap', '-proj', f'init={P.LAMBERT93}',
                '-clean', 'gap-fill-area=2000000',
                '-simplify', 'variable', 'keep-shapes',
                f'interval=part >= {PART_MARGE} ? {INTERVALLE_SIMPL} : {INTERVALLE_MARGE}',
                '-clean', 'gap-fill-area=2000000',
                # en grases e arredondit per mapshaper : un meteis som es arredondit
                # parièr de cada costat d'un limit, e los crosaments son reparats.
                '-proj', 'wgs84', '-snap', f'precision={precision}', 'fix-geometry',
                '-clean', 'gap-fill-area=0.000001',
                '-o', sortie, 'format=geojson', f'precision={precision}', 'force')
    with open(sortie, encoding='utf-8') as f:
        return {ft['properties']['kod']: ogr.CreateGeometryFromJson(json.dumps(ft['geometry']))
                for ft in json.load(f)['features']}


# ---------------------------------------------------------------- etapa 4
def ecrire(unitats, simpl, gardes, taula):
    feats = []
    invalides = []
    sens_oc = []
    ordre = {'pais': 0, 'fora': 1}
    for k in sorted(gardes, key=lambda k: (ordre[unitats[k]['nivel']], unitats[k]['id'])):
        u = unitats[k]
        r = taula[u['id']]
        gj = P.geom_json(simpl[k])
        verif = ogr.CreateGeometryFromJson(json.dumps(gj))
        if not verif.IsValid():
            dit(f'reparacion aprèp arredondit : {k}')
            gj = P.geom_json(P.multi([verif.MakeValid()]))
            verif = ogr.CreateGeometryFromJson(json.dumps(gj))
        if not verif.IsValid():
            invalides.append(k)
        pais = (r['pais_fr'] or '').strip() if (r['font_pais'] or '').strip() else ''
        oc = nom_oc_valid(r)
        if not oc:
            sens_oc.append(u['id'])
        feats.append({'type': 'Feature', 'properties': {
            'kod': k, 'nivel': u['nivel'],
            # nom de l'etiqueta : lo país quand es atestat, si que non lo nom cort de Gay et al.
            'fr': pais or u['court'], 'oc': oc,
            'nom_fr': u['nom_fr'], 'mena': u['mena'], 'cap': u['cap'] or None,
            'rang': u['rang'], 'principal': u['principal'],
            'provincia_fr': u['provincia_fr'], 'provincia': u['provincia'], 'governament': u['governament'],
            'pais_fr': pais or None, 'nota': u['nota'], 'eti': P.point_etiquette(verif)},
            'geometry': gj})
    if invalides:
        raise SystemExit('Geometrias invalidas aprèp arredondit : ' + ', '.join(invalides))
    out = {'type': 'FeatureCollection', 'font': FONT, 'features': feats}
    with open(SORTIDA, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
    dit(f'\n(sens nom occitan dins la carta : {", ".join(sens_oc) or "cap"})')
    dit(f'escrich {SORTIDA} : {len(feats)} unitats, {os.path.getsize(SORTIDA) / 1024:.0f} Ko')


def main():
    P.prepara_brut()
    unitats, geoms, part, gardes = construire()
    taula = legir_fonts(unitats, gardes)
    simpl = simplifier(geoms, gardes, part)
    ecrire(unitats, simpl, gardes, taula)


if __name__ == '__main__':
    main()
