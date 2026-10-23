# Classe les candidats du RNA : calandreta / lenga / cultura / bruit
# Usage : py -I classar_rna.py <rna-candidats.csv> <sortie.csv>
import csv, re, sys, unicodedata, collections as C

def plier(s):
    s = unicodedata.normalize('NFKD', s or '')
    return ''.join(c for c in s if not unicodedata.combining(c)).upper()

VARIETES = r"(OCCITAN|D.\s?OC\b|PROVENCAL|PROUVENCAU|GASCON|BEARNAIS|NISSART|NICOIS|LIMOUSIN|AUVERGNAT|LANGUEDOCIEN|VIVARO|ALPIN|REGIONAL)"
LANG = re.compile(r"\bLANGUES?\b.{0,40}" + VARIETES + r"|\bLENGAS?\b|\bLENGO\b|\bL.OCCITAN\b|\bEN OCCITAN\b|"
                  r"\bOCCITAN(E)? (LANGUE|LENGA)|PARLERS? (OCCITAN|PROVENCAL|GASCON|LOCAL|NISSART|BEARNAIS)|"
                  r"\bPATOIS\b|DIALECTE|IDIOME|\bPARLAR\b|BILINGU|\bCOURS D.OCCITAN|ENSEIGNEMENT DE L.OCCITAN")
NOM_LANG = re.compile(r"CERCLE.{0,25}OCCITAN|\bI\.?\s?E\.?\s?O\.?\b|INSTITUT D.ESTUDIS|INSTITUT D.ETUDES OCCITANES|"
                      r"FELIBR|\bESCOLO\b|\bOSTAL\b|\bOSTAU\b|\bLENGA\b|\bLENGO\b|PARLAREN")
VAR_SEULE = re.compile(VARIETES + r"|['’]\s?OC|TROBADOR|TROUBADOUR|\bOSTAL\b|\bOSTAU\b|\bOUSTAU\b|\bESCOLO\b|FELIBR")
CULT = re.compile(r"CULTUR|TRADITION|FOLKLOR|\bCHANTS?\b|\bCANTS?\b|CHORAL|CORALA|\bDANSES?\b|DANSAS|\bBALS?\b|BALETI|"
                  r"MUSIQU|MUSICA|THEATR|TEATRE|PATRIMOINE|PATRIMONI|LITTERA|LITERA|POESI|CONTE|VEILLEE|VELHADA|COSTUM|"
                  r"FARANDOL|PASTORALE|CRECHE|SANTON")

r = list(csv.DictReader(open(sys.argv[1], encoding='utf-8')))
for x in r:
    t = plier(x['titre']); o = plier(x['objet']); m = x['motifs']
    if 'calandreta' in m:
        x['classa'] = 'calandreta'
    elif LANG.search(t) or LANG.search(o) or NOM_LANG.search(t) or 'oc_accent' in m:
        x['classa'] = 'lenga'
    elif VAR_SEULE.search(t + ' ' + o) and CULT.search(t + ' ' + o):
        x['classa'] = 'cultura'
    else:
        x['classa'] = 'bruit'
    a = (x['date_decla'] or '')[:4]
    x['an_decla'] = a if a and a != '0001' else ''
    if x['dep'] == '17': x['zone'] = 'hors'

with open(sys.argv[2], 'w', newline='', encoding='utf-8') as s:
    w = csv.DictWriter(s, fieldnames=list(r[0].keys())); w.writeheader(); w.writerows(r)

print(C.Counter((x['classa'], x['zone']) for x in r).most_common())
uniq = [x for x in r if x['source'] != 'import-migre']
for cl in ('lenga', 'cultura'):
    sel = [x for x in uniq if x['classa'] == cl and x['zone'] != 'hors']
    print('\n==', cl, 'domaine+partiel, sans doublons :', len(sel))
    print(' source', C.Counter(x['source'] for x in sel))
    print(' position', C.Counter(x['position'] for x in sel))
    act = [x for x in sel if x['position'] == 'A' and x['source'] == 'waldec']
    tr = C.Counter()
    for x in act:
        a = x['an_decla']
        tr['inconnue' if not a else '<2010' if a < '2010' else '2010-2015' if a < '2016' else '2016-2020' if a < '2021' else '2021+'] += 1
    print(' waldec actives', len(act), 'derniere declaration', dict(tr))
    print(' siret', sum(1 for x in act if x['siret'].strip()), 'site web', sum(1 for x in act if x['siteweb'].strip()))
