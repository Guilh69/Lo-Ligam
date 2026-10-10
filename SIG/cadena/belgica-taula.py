# Taula de la Belgica romana (e de las comunas germanofònas de Valonia) : una
# linha per comuna valona, al format de SIG/basc/dialectes-basc.csv.
# Assembla : belgica-carta-chapeau.py (basa), belgica-carta-pierret.py
# (contraròtle de las soszònas valonas), belgica-picard.py (parlars picards),
# flamenc-wikidata.mjs (noms).
#
#   py SIG/cadena/belgica-taula.py
#
# Sortidas : SIG/oil-belgica/dialectes-oil-belgica.csv, dialectes-oil-belgica.json,
# noms-locals.csv.
import csv, json, os, re
from collections import Counter

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
BF = os.path.join(R, 'SIG', 'brut', 'flamenc')
BB = os.path.join(R, 'SIG', 'brut', 'oil-belgica')
OUT = os.path.join(R, 'SIG', 'oil-belgica')
os.makedirs(OUT, exist_ok=True)


def lcsv(p):
    return list(csv.DictReader(open(p, encoding='utf-8-sig'), delimiter=';'))


def titol(t):
    return re.sub(r'\s*\([^)]*\)\s*$', '', t or '').strip()


wd = {}
for r in lcsv(os.path.join(BF, 'wd-be.csv')):
    k = 'be:' + r['codi']
    if k in wd and int(r['pop'] or 0) < int(wd[k]['pop'] or 0):
        continue
    wd[k] = r
chap = lcsv(os.path.join(BB, 'chapeau-comunas.csv'))
pier = {r['codi']: r for r in lcsv(os.path.join(BB, 'pierret-comunas.csv'))}
pic = {r['codi']: r for r in lcsv(os.path.join(BB, 'parlars-picards-be.csv'))}
PROV = [('25', 'Brabant wallon'), ('5', 'Hainaut'), ('6', 'Liège'), ('8', 'Luxembourg'), ('9', 'Namur')]
VALON = {'oest_valon', 'namures', 'lieges', 'sud_valon'}
PIER = {'wallo_picard': 'oest_valon', 'namurois': 'namures', 'liegeois': 'lieges', 'wallo_lorrain': 'sud_valon'}
LENGA = {'picard': 'picard', 'oest_valon': 'valon', 'namures': 'valon', 'lieges': 'valon', 'sud_valon': 'valon',
         'champanes': 'campanes', 'gaumes': 'lorren', 'germanic': 'germanic'}
DG = {'63023', '63040', '63048', '63061', '63001', '63012', '63013', '63067', '63087'}  # Comunautat germanofòna
# parlars germanics comuna per comuna (a validar) : Wikipèdia alemanda,
# « Deutschsprachige Gemeinschaft » (canton d'Eupen : niederfränkisch/limburgisch
# e ripuarisch ; canton de Sant-Vith : moselfränkisch e ripuarisch),
# « Ripuarische Dialekte » (ripuari al nòrd-èst e al mitan de l'aira germanofòna),
# « Plattdeutsche Gemeinden » (Plombières, Welkenraedt, Baelen : lo meteis
# parlar qu'a Lontzen, Eupen e Kelmis), « Areler Land » (5 comunas).
GERM = {
    '63088': ('platdiets', 'parlar de Plombières/Bleyberg ; facilitats dormentas (Plattdeutsche Gemeinden)'),
    '63084': ('platdiets', 'facilitats dormentas (Plattdeutsche Gemeinden)'),
    '63004': ('platdiets', 'facilitats dormentas (Plattdeutsche Gemeinden)'),
    '63040': ('platdiets', 'Comunautat germanofòna'),
    '63048': ('platdiets', 'Comunautat germanofòna'),
    '63023': ('platdiets', 'Comunautat germanofòna ; parlar d\'Eupen, ripuari segon d\'autras fonts'),
    '63061': ('ripuari', 'Comunautat germanofòna'),
    '63013': ('ripuari', 'Comunautat germanofòna ; « mitan » de l\'aira germanofòna, ripuari o francic mosellan : incert'),
    '63012': ('ripuari', 'Comunautat germanofòna ; « mitan » de l\'aira germanofòna, ripuari o francic mosellan : incert'),
    '63001': ('francic_mosellan', 'Comunautat germanofòna ; francic mosellan o ripuari : incert'),
    '63067': ('francic_mosellan', 'Comunautat germanofòna'),
    '63087': ('francic_mosellan', 'Comunautat germanofòna'),
    '81001': ('luxemborgues', 'Areler Land ; vila d\'Arlon francofòna en majoritat'),
    '81003': ('luxemborgues', 'Areler Land'),
    '81013': ('luxemborgues', 'Areler Land'),
    '81015': ('luxemborgues', 'Areler Land ; Chapeau : mitat gaumés'),
    '81004': ('luxemborgues', 'Areler Land ; Chapeau : gaumés (Halanzy, Aubange) ; Athus e lo sud-èst luxemborgés'),
}
FACIL = {'57097': 'facilitats pels neerlandofòns', '57096': 'facilitats pels neerlandofòns',  # Comines-Warneton, Mouscron
         '51019': 'facilitats pels neerlandofòns', '51067': 'facilitats pels neerlandofòns',  # Flobecq, Enghien (còdis verificats, wd-be.csv)
         '63049': 'facilitats pels germanofòns ; minoritat germanofòna istorica', '63080': 'facilitats pels germanofòns ; minoritat germanofòna istorica'}
SECCIONS = {'85046': 'seccion de Hachy (Herzig) : luxemborgés (Areler Land, Luxemburger Wörterbuch)',
            '82009': 'seccion de Tintange (Tintingen) : luxemborgés (Areler Land)'}
linhas, noms = [], []
for r in chap:
    codi, nis = r['codi'], r['codi'][3:]
    w = wd.get(codi, {})
    z, part, z2, part2 = r['zona'], float(r['part'] or 0), r['zona2'], float(r['part2'] or 0)
    if nis in DG:
        nom = w.get('de') or titol(w.get('wp_de'))
    else:
        nom = w.get('fr') or titol(w.get('wp_fr'))
    unitat = next(n for p, n in PROV if nis.startswith(p))
    nota, font, transicio = [], ['CHAP22'], ''
    lenga = LENGA.get(z, '')
    dom = 'germanic' if lenga == 'germanic' else 'oil'
    parlar = z if z in VALON else ('gaumes' if z == 'gaumes' else '')
    dial = lenga
    if nis in GERM and (lenga == 'germanic' or nis in ('81015', '81004')):
        dom, dial = 'germanic', GERM[nis][0]
        parlar = ''
        nota.append(GERM[nis][1])
        font.append('WPDE')
        if nis in ('81015', '81004'):
            transicio = 'lorren'
    elif lenga == 'germanic':
        nota.append('parlar germanic de precisar')
    if lenga == 'picard' and codi in pic:
        pp = pic[codi]
        parlar = pp['parlar'].lower()
        nota.append('parlar picard : %s (%s)%s' % (pp['parlar'], pp['zona'], '' if float(pp['dist_km']) == 0 else ', a %s km de la zòna colorada' % pp['dist_km']))
        font.append('EPI25')
    # transicion : segonda zòna d'una autra lenga, 25 % o mai
    if not transicio and z2 and part2 >= 0.25 and LENGA.get(z2) != LENGA.get(z):
        transicio = LENGA.get(z2)
        nota.append('Chapeau : %d %% %s, %d %% %s' % (round(100 * part), z, round(100 * part2), z2))
        if transicio == 'germanic' and nis not in GERM:
            nota.append("aira germanica vesina (Fouron/Voeren, parlars platdiets) : decalatge possible de la carta, de verificar")
    elif z2 and part2 >= 0.3 and z2 in VALON and z in VALON:
        transicio = z2
        nota.append('Chapeau : %d %% %s, %d %% %s' % (round(100 * part), z, round(100 * part2), z2))
    # etiquetas de transicion de la carta (« capia », « tchapiô ») : picard -> oèst-valon
    for k, lab in (('etiq_capia', 'capia'), ('etiq_tchapio', 'tchapiô')):
        if float(r.get(k) or 0) >= 0.3:
            transicio = 'valon' if lenga == 'picard' else 'picard'
            nota.append('zòna de transicion « %s » de la carta (%d %% de la comuna jos l\'etiqueta : classament extrapolat)'
                        % (lab, round(100 * float(r[k]))))
    if nis in FACIL:
        nota.append(FACIL[nis])
        font.append('LEG')
    if nis in SECCIONS:
        nota.append(SECCIONS[nis])
        font.append('WPDE')
    # contraròtle Pierret (1984)
    pz = pier.get(codi)
    if pz and dial == 'valon':
        pzz = PIER.get(pz['zona'], '')
        if float(pz['defora']) > 0.5:
            nota.append('Pierret : fòra del valon')
        elif pzz and pzz != parlar:
            nota.append('Pierret : %s (%d %%)' % (pz['zona'], round(100 * float(pz['part']))))
        font.append('PIE84')
    elif pz and dial in ('picard', 'lorren', 'campanes') and float(pz['defora']) < 0.5 and pz['zona']:
        nota.append('Pierret : %s (%d %%)' % (pz['zona'], round(100 * float(pz['part']))))
        font.append('PIE84')
    if part and part < 0.6:
        nota.append('incert : %d %% sola dins la zòna de Chapeau' % round(100 * part))
    # nom local
    wk = {'valon': 'wa', 'picard': 'pcd', 'luxemborgues': 'lb'}.get(dial, '')
    nl_ = titol(w.get('wp_' + wk, '')) if wk else ''
    l = {'regio': 'Wallonie', 'unitat': unitat, 'mena': 'comuna_be', 'nom_oficial': nom, 'nom_local': nl_,
         'codi': codi, 'domeni': dom, 'dialecte': dial, 'parlar': parlar, 'transicio': transicio, 'part_oc': 0,
         'nota': ' ; '.join(nota), 'font': ' '.join(dict.fromkeys(font))}
    linhas.append(l)
    if nl_:
        noms.append({'codi': codi, 'nom_oficial': nom, 'nom_local': nl_, 'wikipedia': wk,
                     'titol': w.get('wp_' + wk, ''), 'wikidata': w.get('item', '')})
COLS = ['regio', 'unitat', 'mena', 'nom_oficial', 'nom_local', 'codi', 'domeni', 'dialecte', 'parlar', 'transicio',
        'part_oc', 'nota', 'font']
linhas.sort(key=lambda l: (l['unitat'], l['nom_oficial']))
with open(os.path.join(OUT, 'dialectes-oil-belgica.csv'), 'w', encoding='utf-8-sig', newline='') as fo:
    w = csv.DictWriter(fo, COLS, delimiter=';')
    w.writeheader()
    w.writerows(linhas)
with open(os.path.join(OUT, 'noms-locals.csv'), 'w', encoding='utf-8-sig', newline='') as fo:
    w = csv.DictWriter(fo, ['codi', 'nom_oficial', 'nom_local', 'wikipedia', 'titol', 'wikidata'], delimiter=';')
    w.writeheader()
    w.writerows(sorted(noms, key=lambda x: x['codi']))
for k, n in sorted(Counter((l['domeni'], l['dialecte'], l['parlar']) for l in linhas).items()):
    print('%-9s %-17s %-22s %3d' % (k + (n,)))
print('transicions :', Counter(l['transicio'] for l in linhas if l['transicio']))
print('noms locals :', Counter(n['wikipedia'] for n in noms), '; sens nom oficial :', [l['codi'] for l in linhas if not l['nom_oficial']])
pc = Counter()
for l in linhas:
    if l['dialecte'] == 'valon':
        pz = pier.get(l['codi'])
        if pz and float(pz['defora']) <= 0.5:
            pc['acòrd' if PIER.get(pz['zona']) == l['parlar'] else 'desacòrd'] += 1
print('contraròtle Pierret (soszònas valonas) :', dict(pc))
print('linhas :', len(linhas))


# --- JSON
def comunas_de(f):
    return sorted(l['codi'] for l in linhas if f(l))


D = [  # kod, domeni, endo, fr, oc, oc verificat, parlars [(kod, endo, fr, oc)]
    ('picard', 'oil', 'picard', 'picard', 'picard', 'ja dins lengas-oil.json',
     [('tournaisien', '', 'tournaisien', ''), ('borain', '', 'borain', ''), ('lillois', '', 'lillois', ''),
      ('circum-lillois', '', 'circum-lillois', ''), ('valenciennois', '', 'valenciennois', ''), ('avesnois', '', 'avesnois', '')]),
    ('valon', 'oil', 'walon', 'wallon', 'valon', 'òc',
     [('oest_valon', 'walon do Coûtchant', 'ouest-wallon (wallo-picard chez Pierret)', "valon de l'oèst"),
      ('namures', 'walon do Mitan', 'namurois (wallon central)', 'namurés'),
      ('lieges', '', 'liégeois (wallon oriental)', 'liegés'),
      ('sud_valon', '', 'sud-wallon (wallo-lorrain chez Pierret, wallon méridional)', 'valon del sud')]),
    ('lorren', 'oil', 'gåmès (gaumais)', 'lorrain (gaumais)', 'lorren', 'ja dins lengas-oil.json',
     [('gaumes', 'gåmès', 'gaumais', 'gaumés')]),
    ('campanes', 'oil', 'tchampnwès', 'champenois', 'campanés', 'ja dins lengas-oil.json (absent del Basic)', []),
    ('platdiets', 'germanic', 'Platdiets / Plattdeutsch', 'platdiets (bas-francique de transition limbourgeois-ripuaire)', 'platdiets', 'nom neerlandés gardat', []),
    ('ripuari', 'germanic', 'Ripuarisch', 'ripuaire', 'ripuari', 'non (absent del Basic)', []),
    ('francic_mosellan', 'germanic', 'Moselfränkisch', 'francique mosellan', 'francic mosellan', 'non (absent del Basic)', []),
    ('luxemborgues', 'germanic', 'Lëtzebuergesch', 'luxembourgeois', 'luxemborgés', 'òc', []),
]
out = {
    'font': ("Belgica romana : comunas SPF Finanças INSPIRE 2025 ; dialèctes d'aprèp la « Carte dialectale de la Belgique "
             "romane - Chapeau » (Reptilien.19831209BE1, 2022, d'aprèp « Mape tchapea.jpg », Lucyin, 2017, Wikimedia Commons, "
             "CC BY-SA 4.0), contraròtle per « Wallonie-linguistique-fr.svg » (David Descamps, 2006, domeni public, d'aprèp "
             "J.-M. Pierret, Le grand livre d'Ardenne et de Gaume, 1984) ; parlars picards d'aprèp la « Carte des variétés du "
             "picard » (Epi2025, CC BY-SA 4.0) ; parlars germanics d'aprèp la Wikipèdia alemanda ; noms locals : Wikidata "
             "(CC0), títols de las Wikipèdias wa, pcd, lb"),
    'a_validar': ("noms occitans (oc) dels parlars valons e germanics, absents del Basic ; parlars germanics comuna per "
                  "comuna (font generala, pas una carta) ; las comunas jos las etiquetas « capia » e « tchapiô » ; "
                  "endonims valons : solament los títols de la Wikipèdia valona (walon do Coûtchant, walon do Mitan), "
                  "pas d'endonim trobat pel liegés e lo sud-valon"),
    'domenis': {'oil': {'fr': "langues d'oïl", 'oc': "lengas d'oïl"},
                'germanic': {'fr': 'parlers germaniques (Communauté germanophone, pays d\'Arlon, Platdiets)', 'oc': 'parlars germanics',
                             'oc_verificat': 'germanic absent del Basic'}},
    'dialectes': [],
    'transicions': [],
}
for kod, dom, endo, fr, oc, ver, parl in D:
    out['dialectes'].append({
        'kod': kod, 'domeni': dom, 'endo': endo, 'fr': fr, 'oc': oc, 'oc_verificat': ver,
        'comunas': sum(1 for l in linhas if l['dialecte'] == kod),
        'parlars': [{'kod': a, 'endo': b, 'fr': c, 'oc': d, 'comunas': sum(1 for l in linhas if l['dialecte'] == kod and l['parlar'] == a)}
                    for a, b, c, d in parl]})
out['transicions'] = [
    {'kod': 'capia_tchapio', 'fr': "zones de transition picard / ouest-wallon de la carte (« capia » vers Soignies-Nivelles, « tchapiô » vers Chimay)",
     'oc': 'picard / valon', 'comunas': comunas_de(lambda l: 'capia' in l['nota'] or 'tchapiô' in l['nota'])},
    {'kod': 'lenga', 'fr': 'commune partagée entre deux langues sur la carte (25 % ou plus de la seconde) : transicio = seconde langue',
     'oc': 'transicion entre lengas',
     'comunas': comunas_de(lambda l: l['transicio'] in ('picard', 'valon', 'lorren', 'campanes', 'germanic') and 'capia' not in l['nota'] and 'tchapiô' not in l['nota'])},
    {'kod': 'parlar', 'fr': 'commune partagée entre deux sous-zones wallonnes (30 % ou plus de la seconde)',
     'oc': 'transicion entre parlars valons', 'comunas': comunas_de(lambda l: l['transicio'] in VALON)},
]
json.dump(out, open(os.path.join(OUT, 'dialectes-oil-belgica.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent='\t')
print('JSON :', [(d['kod'], d['comunas']) for d in out['dialectes']], [(t['kod'], len(t['comunas'])) for t in out['transicions']])
