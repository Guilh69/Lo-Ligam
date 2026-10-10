# Las fichas del panèl « Autras lengas » (opcion A) : app/src/lib/carta/fichas-lengas.js
# a partir de SIG/lengas-fichas.json (recèrca sorsada : locutors, UNESCO, familha)
# e de las fonts dels dialèctes de cada jaça (SIG/<lenga>/FONTS.md).
# Demanda de Romain (2026-10-10) : cada informacion amb sa font al survòl, de
# cercaires o d'institucions, idealament la reconeissença locala.
#
#   py SIG/cadena/fichas-app.py
import json, os

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
F = {x['kod']: x for x in json.load(open(os.path.join(R, 'SIG', 'lengas-fichas.json'), encoding='utf-8'))}
# jaça de la carta -> fiche de la recèrca ; nom anglés per Glottolog (Institut Max Planck)
JACAS = {'catalan': ('catalan', 'Catalan'), 'arpitan': ('arpitan', 'Franco-Provencal'), 'basc': ('basc', 'Basque'),
         'oil': ('oil', 'Oil'), 'alsacian': ('alsacian', 'Alemannic'), 'francic': ('francique', 'Moselle Franconian'),
         'breton': ('breton', 'Breton'), 'cors': ('cors', 'Corsican'), 'flamenc': ('flamenc', 'Vlaams')}
FAM = {'catalan': ('romana', 'romane'), 'arpitan': ('romana', 'romane'), 'basc': ('isolat', 'isolat'), 'oil': ('romanas, una familha', 'romanes, une famille'),
       'alsacian': ('germanica, alemanica', 'germanique, alémanique'), 'francic': ('germanica, francica', 'germanique, francique'),
       'breton': ('celtica', 'celtique'), 'cors': ('romana', 'romane'), 'flamenc': ('germanica', 'germanique')}
DIAL = {
    'catalan': ("Classement de Joan Veny (Institut d'Estudis Catalans), via la Viquipèdia", 'https://ca.wikipedia.org/wiki/Dialectes_del_catal%C3%A0'),
    'arpitan': ("Domaine : carte d'arpitania.eu ; Suisse : Office fédéral de la statistique ; Italie : loi 482/1999 ; dialectes : Vouiquipèdia", 'https://www.bfs.admin.ch/'),
    'basc': ("Koldo Zuazo (2008), classement repris par l'Académie de la langue basque (Euskaltzaindia)", 'https://www.euskaltzaindia.eus/'),
    'oil': ("Carte linguistique de la France, Archives nationales (P.-H. Billy, S. Nadiras) ; liste des langues : rapport Cerquiglini (1999) et ministère de la Culture ; picard : carte des parlers de Wikipédia ; Belgique : L. Chapeau, contrôle Pierret (1984)", 'https://www.archives-nationales.culture.gouv.fr/centres-de-recherche/carte-linguistique-de-la-france'),
    'alsacian': ("Georg Wenker, Constant This (1887), cartes « Sprachen in Elsass-Lothringen » et « Alemannic dialects » (Wikimedia Commons)", 'https://www.olcalsace.org/'),
    'francic': ("Constant This (1887), isoglosses de Moselle, carte « Rheinischer Fächer » (Wikimedia Commons)", 'https://www.olcalsace.org/'),
    'breton': ("Limite : Paul Sébillot (1886) ; dialectes : anciens évêchés (Léon, Trégor, Cornouaille, Vannes)", 'https://www.fr.brezhoneg.bzh/'),
    'cors': ("Cartes des parlers de Corse (Wikimedia Commons), contrôle : M.-J. Dalbera-Stefanaggi ; Sardaigne : lois régionales 26/1997 et 22/2018", 'https://www.isula.corsica/'),
    'flamenc': ("Westhoek : Alex Vanneste (1972) ; Belgique et Pays-Bas : Jo Daan et Dirk Blok (1969)", 'https://nl.wikipedia.org/wiki/Nederlandse_dialecten'),
}
VIT = {'vulnérable': ('vulnerabla', 'vulnerabla', 'vulnérable'), 'en danger': ('en_dangier', 'en dangièr', 'en danger'),
       'sérieusement en danger': ('en_dangier_greu', 'en dangièr grèu', 'sérieusement en danger')}


def xifra(n):
    if n >= 1e6:
        return ('%.1f M' % (n / 1e6)).replace('.', ',')
    if n >= 1e4:
        return '%d %03d' % (n // 1000, 0) if False else '{:,}'.format(int(round(n, -3))).replace(',', ' ')
    return '{:,}'.format(int(n)).replace(',', ' ')


# l'onglet del panèl (Romain, 2026-10-10) : lengas de França, lengas transfrontalièras
ONGLET = {'breton': 'franca', 'oil': 'franca', 'cors': 'franca'}
out = {}
for j, (k, en) in JACAS.items():
    x = F.get(k, {})
    o = {'familha': {'oc': FAM[j][0], 'fr': FAM[j][1]},
         'fontFamilha': {'t': 'Classement : ' + (x.get('famille') or '') + ' (Glottolog, Institut Max Planck)', 'url': 'https://glottolog.org/glottolog?search=' + en.replace(' ', '+')},
         'fontDialectes': {'t': DIAL[j][0], 'url': DIAL[j][1]}}
    o['onglet'] = ONGLET.get(j, 'trans')
    l = x.get('locuteurs') or {}
    if l.get('nombre'):
        o['n'] = l['nombre']
        o['locutors'] = '≈ ' + xifra(l['nombre'])
        o['fontLocutors'] = {'t': '%s ; %s, %s' % (l.get('affichage') or l.get('mesure') or '', l.get('source') or '', l.get('annee') or ''), 'url': l.get('url') or ''}
    u = x.get('unesco') or {}
    st = (u.get('statut') if isinstance(u, dict) else u) or ''
    if st in VIT:
        o['vital'] = {'k': VIT[st][0], 'oc': VIT[st][1], 'fr': VIT[st][2], 't': 'Atlas des langues en danger, UNESCO (%s)' % (u.get('annee') or 2010)}
    out[j] = o

js = ('// Generat per SIG/cadena/fichas-app.py a partir de SIG/lengas-fichas.json : pas de modificar a la man.\n'
      '// Las fichas del panèl « Autras lengas » (opcion A, Romain 2026-10-10) : familha, locutors, estat\n'
      '// (UNESCO) e fonts de cada informacion, al survòl (cercaires, institucions).\n'
      'export const FICHAS = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n\n'
      "export const VITALITAT = { vulnerabla: '#7fd67a', en_dangier: '#ffb35c', en_dangier_greu: '#ff6b5a', critica: '#d0304a' };\n")
open(os.path.join(R, 'app', 'src', 'lib', 'carta', 'fichas-lengas.js'), 'w', encoding='utf-8', newline='\n').write(js)
print(len(out), 'fichas')
