# Los noms gallos de las comunas (Romain, 2026-10-10 : « si le nom d'une ville
# est attesté dans une langue, ça appartient à tout le monde »), d'aprèp los
# repertòris de Chubri (enquèstas oralas, grafia Moga) :
#  - « Noms en gallo de chefs-lieux de canton de Haute-Bretagne » (2015) ;
#  - « Noms en gallo de communes » de Léger Atlantic (44) e de Morbihan (56) (2014).
# Los PDF son legits amb pdftotext (Poppler) : SIG/brut/oil/chubri/*.txt.
#
#   py SIG/cadena/gallo-noms.py
#
# Sortida : SIG/brut/oil/noms-gallo.csv (fr ; dep ; gallo ; variantas ; font),
# pas seguit per Git : la carta ne pren sonque los noms de sas vilas.
import csv, os, re

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
B = os.path.join(R, 'SIG', 'brut', 'oil', 'chubri')
LIN_C = re.compile(r'^(\S.*?)\s{2,}(\d{2})\s{2,}(.+?)\s{2,}\[')
LIN_L = re.compile(r'^(\S.*?)\s{2,}(.+?)\s{2,}\[')
noms = {}


def forma(t):
    v = [re.sub(r'\s*\(.*?\)', '', x).strip() for x in t.split(',')]
    v = [x for x in v if x]
    return (v[0], ', '.join(v[1:])) if v else (None, '')


for l in open(os.path.join(B, 'Teett-de-canton.txt'), encoding='utf-8'):
    m = LIN_C.match(l)
    if m and not m.group(1)[0].isdigit():
        g, alt = forma(m.group(3))
        noms[(m.group(1).strip(), m.group(2))] = (g, alt, 'Chubri 2015 (caps-luòcs de canton)')
for f, dep in (('livret-cmunn-44-v2.txt', '44'), ('livret-cmunn-56.txt', '56')):
    for l in open(os.path.join(B, f), encoding='utf-8'):
        m = LIN_L.match(l)
        if m and not l.lstrip().startswith('•'):
            g, alt = forma(m.group(2))
            if g:
                noms.setdefault((m.group(1).strip(), dep), (g, alt, 'Chubri 2014 (%s)' % dep))
with open(os.path.join(R, 'SIG', 'brut', 'oil', 'noms-gallo.csv'), 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['fr', 'dep', 'gallo', 'variantas', 'font'])
    for (fr, dep), (g, alt, font) in sorted(noms.items()):
        w.writerow([fr, dep, g, alt, font])
print('Noms gallos : %d' % len(noms))
for k in [('Rennes', '35'), ('Nantes', '44'), ('Saint-Malo', '35'), ('Vannes', '56'), ('Saint-Nazaire', '44')]:
    print('  %s : %s' % (k[0], noms.get(k, ('?',))[0]))
