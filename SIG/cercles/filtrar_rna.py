# Filtre du Répertoire national des associations (RNA, Licence Ouverte) :
# associations occitanes candidates, sur tous les départements.
# Usage : py -I filtrar_rna.py <waldec.zip> <import.zip> <sortie.csv>
import csv, io, re, sys, unicodedata, zipfile

DOMAINE = {'09','11','12','30','31','32','34','46','48','65','81','82',
           '19','23','24','33','40','47','87',
           '07','15','43','63',
           '04','05','06','13','83','84'}
PARTIEL = {'03','16','18','26','36','38','42','64','66','86'}

def plier(s):
    s = unicodedata.normalize('NFKD', s or '')
    return ''.join(c for c in s if not unicodedata.combining(c)).upper()

FORT = [
    ('occitan', r"\bOCCITAN(E|ES|S)?\b"),
    ('ieo', r"\bI\.?\s?E\.?\s?O\.?\b|INSTITUT D.ESTUDIS OCCITANS|INSTITUT D.ETUDES OCCITANES"),
    ('felibrige', r"FELIBR"),
    ('escolo', r"\bESCOLO\b"),
    ('oc', r"(LENGA|LANGUE|LENGO|PAYS|PAIS|PAÏS|TERRA|TERRO) D.\s?OC\b|['’]\s?OC\b"),
    ('ostal', r"\bOSTAL\b|\bOSTAU\b|\bOUSTAU\b"),
    ('lenga', r"\bLENGA\b|\bLENGO\b|\bLENGUO\b|PARLAREN"),
    ('calandreta', r"CALANDRET|CALENDRET"),
]
MOYEN = [
    ('provencal', r"\bPROVENCAL(E|ES|S)?\b|\bPROUVENCAU\b"),
    ('gascon', r"\bGASCON(NE|NES|S)?\b|\bGASCOUN\b"),
    ('bearnais', r"\bBEARNAIS(E|ES)?\b|\bBIARNES\b"),
    ('nissart', r"\bNISSART\b|\bNISSARDA?\b"),
    ('auvergnat', r"LANGUE AUVERGNATE|PARLER AUVERGNAT|\bAUVERNHAT\b|\bAUVERNHE\b"),
    ('limousin', r"LANGUE LIMOUSINE|PARLER LIMOUSIN|\bLEMOSIN\b|\bLEMOUZI\b"),
    ('languedocien', r"LANGUEDOCIEN"),
    ('patois', r"\bPATOIS\b"),
    ('langue_regionale', r"LANGUES? REGIONALES?"),
    ('troubadour', r"TROBADOR|TROUBADOUR"),
    ('escola', r"\bESCOLA\b|\bESCOLAS\b"),
    ('cercle_occ', r"CERCLE.{0,20}OCCITAN"),
]
RE_F = [(n, re.compile(p)) for n, p in FORT]
RE_M = [(n, re.compile(p)) for n, p in MOYEN]
RE_OC_ACCENT = re.compile(r"\bÒC\b|\bòc\b|\bÒc\b")
CODE_LANGUE = '006110'

def chercher(titre, objet, codes):
    t = plier(titre); o = plier(objet)
    trouves = []
    for n, r in RE_F:
        if r.search(t): trouves.append(n + ':t')
        elif r.search(o): trouves.append(n + ':o')
    for n, r in RE_M:
        if r.search(t): trouves.append(n + ':t')
        elif r.search(o): trouves.append(n + ':o')
    if RE_OC_ACCENT.search(titre or '') or RE_OC_ACCENT.search(objet or ''):
        trouves.append('oc_accent')
    if CODE_LANGUE in codes:
        trouves.append('code_006110')
    return trouves

def dep_de(cp, insee):
    c = (insee or cp or '').strip()
    if c.startswith('97'): return c[:3]
    return c[:2]

def lire(zipchemin, fichier):
    z = zipfile.ZipFile(zipchemin)
    for nom in z.namelist():
        with z.open(nom) as h:
            txt = io.TextIOWrapper(h, encoding='utf-8-sig', errors='replace', newline='')
            for ligne in csv.DictReader(txt, delimiter=';'):
                yield fichier, ligne

champs = ['source','id','id_ex','siret','titre','objet','codes','cp','insee','commune','dep','zone',
          'date_creat','date_decla','date_disso','position','maj_time','siteweb','motifs']
w_ex = set()
with open(sys.argv[3], 'w', newline='', encoding='utf-8') as s:
    out = csv.DictWriter(s, fieldnames=champs); out.writeheader()
    n = 0
    for fichier, l in lire(sys.argv[1], 'waldec'):
        if l.get('id_ex'): w_ex.add(l['id_ex'].strip())
        codes = (l.get('objet_social1',''), l.get('objet_social2',''))
        m = chercher(l.get('titre','') + ' ' + l.get('titre_court',''), l.get('objet',''), codes)
        if not m: continue
        dep = dep_de(l.get('adrs_codepostal'), l.get('adrs_codeinsee'))
        if m == ['code_006110'] and dep not in DOMAINE | PARTIEL: continue
        out.writerow({'source':'waldec','id':l['id'],'id_ex':l.get('id_ex',''),'siret':l.get('siret',''),
            'titre':l.get('titre',''),'objet':(l.get('objet','') or '')[:400],'codes':'/'.join(codes),
            'cp':l.get('adrs_codepostal',''),'insee':l.get('adrs_codeinsee',''),'commune':l.get('adrs_libcommune',''),'dep':dep,
            'zone':'domaine' if dep in DOMAINE else 'partiel' if dep in PARTIEL else 'hors',
            'date_creat':l.get('date_creat',''),'date_decla':l.get('date_decla',''),
            'date_disso':l.get('date_disso',''),'position':l.get('position',''),'maj_time':l.get('maj_time',''),
            'siteweb':l.get('siteweb',''),'motifs':' '.join(m)}); n += 1
    for fichier, l in lire(sys.argv[2], 'import'):
        codes = (l.get('objet_social1',''), l.get('objet_social2',''))
        m = chercher(l.get('titre',''), l.get('objet',''), codes)
        if not m: continue
        dep = dep_de(l.get('adrs_codepostal'), '')
        if m == ['code_006110'] and dep not in DOMAINE | PARTIEL: continue
        doublon = (l.get('id_ex','').strip() in w_ex) or (l.get('rup_mi','').startswith('W'))
        out.writerow({'source':'import' + ('-migre' if doublon else ''),'id':l['id'],'id_ex':l.get('id_ex',''),
            'siret':l.get('siret',''),'titre':l.get('titre',''),'objet':(l.get('objet','') or '')[:400],
            'codes':'/'.join(codes),'cp':l.get('adrs_codepostal',''),'insee':'','commune':l.get('libcom',''),'dep':dep,
            'zone':'domaine' if dep in DOMAINE else 'partiel' if dep in PARTIEL else 'hors',
            'date_creat':l.get('date_creat',''),'date_decla':l.get('date_publi',''),'date_disso':'',
            'position':l.get('position',''),'maj_time':l.get('maj_time',''),'siteweb':l.get('siteweb',''),
            'motifs':' '.join(m)}); n += 1
print('candidats', n)
