# Breton, étape 3 : classement commune par commune (domaine, dialecte, parler).
#
#   py SIG/cadena/breton-classament.py
#
# Entrées (SIG/brut/breton/, hors Git) :
#  - comunas-bzh.json (breton-comunas.py : communes IGN 2026, voisines, canton AN 2013) ;
#  - parroquias.json (breton-wikidata.mjs : paroisses des anciens évêchés, codes INSEE) ;
#  - wd-br.csv (breton-wikidata.mjs : titres de la Wikipédia bretonne).
# Sorties : SIG/breton/dialectes-breton.csv, SIG/breton/noms-br.csv,
#           SIG/brut/breton/controle.txt (contrôles et cas à vérifier).
#
# Méthode (détail dans SIG/breton/FONTS.md) :
#  1. Domaine = état de 1886 d'après Paul Sébillot, « La langue bretonne, limites
#     et statistique », Revue d'ethnographie, t. V, 1886, p. 1-29 (domaine public) :
#     la limite y est décrite village par village. Les communes que la limite
#     traverse sont classées à la main ci-dessous (table LIMITA), avec la phrase
#     de Sébillot résumée dans la note. Les autres communes sont rangées par
#     propagation : toute commune reliée au Finistère sans franchir la limite est
#     bretonne.
#  2. Dialecte = ancien évêché de la paroisse (Sébillot : « Les dialectes bretons
#     correspondent approximativement à l'ancienne limite des évêchés »), avec
#     les corrections que Sébillot donne lui-même (Morlaix, Quimperlé, cantons
#     du Faouët et de Gourin, reste du Morbihan).
import csv, json, os, unicodedata
from collections import Counter, defaultdict

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
BRUT = os.path.join(R, 'SIG', 'brut', 'breton')
SORT = os.path.join(R, 'SIG', 'breton')
com = json.load(open(os.path.join(BRUT, 'comunas-bzh.json'), encoding='utf-8'))
par = json.load(open(os.path.join(BRUT, 'parroquias.json'), encoding='utf-8'))
ctl = []


def log(*a):
    s = ' '.join(str(x) for x in a)
    ctl.append(s)
    print(s)


# ---------------------------------------------------------------- 1. limite de 1886
S86 = 'SEB86'
# (insee, domaine, transicio, note) ; domaine : breton | mixta | vesina | galo (gallo :
# commune française en 1886 qui sert seulement de butée à la propagation, non sortie)
LIMITA = [
    # Côtes-du-Nord, du nord au sud (p. 6-11 et fig. 5)
    ('22222', 'breton', 'galo', "Plouha : on y parle breton partout, souvent aussi le français ; derniers villages bretons à l'est : Kerégal, la Lande-Mergat, Kervizel, Boisgougen"),
    ('22377', 'vesina', 'galo', "Tréveneuc : presque personne n'y sait ou n'y parle le breton ; prédication en français"),
    ('22232', 'vesina', 'galo', "Plourhan : la limite passe par les villages bretons de la Ville-Hélio, du Rohat et de Bois-Buhain ; très grande majorité de la commune française"),
    ('22177', 'breton', 'galo', "Pléguien : bretonnante pour les neuf dixièmes ; prédication en breton"),
    ('22375', 'breton', 'galo', "Tressignaux : totalement bretonnante"),
    ('22361', 'vesina', 'galo', "Tréguidel : française pour les neuf dixièmes, familles bretonnes isolées vers Pléguien et Tressignaux"),
    ('22182', 'vesina', 'galo', "Plélo : entièrement française, mais beaucoup de familles bretonnantes (Saint-Quay, la Ville-Garre, Beauchamp)"),
    ('22019', 'breton', 'galo', "Bringolo : bretonnante, un tiers parle aussi bien le français ; prédication en breton et en français"),
    ('22206', 'vesina', 'galo', "Plouagat : aucun village exclusivement breton, mais le breton y est plus parlé qu'il y a quarante ans (Kerharscouët, Christ, le Leshouarn) ; prédication en français. Châtelaudren (réunie en 2019) : à l'est de la limite"),
    ('22304', 'breton', 'galo', "Saint-Jean-Kerdaniel : le français y est connu mais n'est usité nulle part ; prédication en breton"),
    ('22116', 'breton', 'galo', "Lanrodec : aucun village exclusivement français, le français presque aussi usité que le breton ; prédication en breton"),
    ('22011', 'vesina', 'galo', "Boqueho : entièrement française, à part deux ou trois familles bretonnantes au village de Saint-Laurent"),
    ('22289', 'breton', 'galo', "Saint-Fiacre : purement bretonne"),
    ('22291', 'mixta', 'galo', "Saint-Gildas : bretonnante pour les deux tiers, bourg en pays français ; prédication en français"),
    ('22386', 'mixta', 'galo', "Le Vieux-Bourg : bretonnante pour un peu moins de moitié ; prédication en français (le texte place le bourg en pays breton, la fig. 5 à l'est de la limite)"),
    ('22074', 'breton', 'galo', "Le Haut-Corlay : la limite entre dans la commune par les villages bretons de Kerchouan, la Ville-Jouan, Pertuga, la Salle, la Croix de Corlay ; prédication en breton"),
    ('22047', 'breton', 'galo', "Corlay : presque entièrement bretonnante (limite à Kernion) ; prédication en breton"),
    ('22313', 'vesina', 'galo', "Saint-Martin-des-Prés : à l'est de la limite sur la fig. 5 ; non citée dans le texte (canton de Corlay, zone bretonne de la carte AN)"),
    ('22316', 'mixta', 'galo', "Saint-Mayeux : villages extrêmes bretons Kerfaven, Kerléau, Ker-Brun… ; prédication en breton et en français"),
    ('22295', 'mixta', 'galo', "Saint-Gilles-Vieux-Marché : villages bretons à l'ouest (Kercadou, Kerouault, Kergoué, Kerniault), bourg et est de la commune français (majorité) ; prédication en breton et en français"),
    ('22158', 'mixta', 'galo', "Mûr : derniers villages bretons Kerbotin et le Botrain, prédication en breton et en français ; Saint-Guen (réunie en 2017 dans Guerlédan) : française"),
    ('22285', 'breton', 'galo', "Saint-Connec : bretonnante pour les cinq sixièmes (l'OCR lit « 8/6 ») ; Brenné et Tréhouët, villages français ; prédication en breton et en français"),
    ('22279', 'vesina', 'galo', "Saint-Caradec : la limite y englobe le village breton de Tréviel"),
    ('22075', 'vesina', 'galo', "Hémonstoir : la limite passe à Réguly ; prédication en français"),
    # Morbihan (p. 11-14, fig. 3), limite tracée par le Dr Mauricet
    ('56213', 'breton', 'galo', "Croixanvec : bretonnante, la limite y entre au village de Crano ; prédication en breton. Saint-Gérand (réunie en 2022) : à l'ouest de la limite"),
    ('56215', 'vesina', 'galo', "Saint-Gonnery : de langue française, sauf une petite pointe à l'ouest"),
    ('56072', 'vesina', 'galo', "Gueltas : la commune entière en pays français (le breton y disparaissait déjà selon Guyot-Jomard, 1861)"),
    ('56151', 'breton', 'galo', "Noyal-Pontivy : parle breton, sauf deux villages à l'est de la limite"),
    ('56092', 'breton', 'galo', "Kerfourn : bourg en pays bretonnant ; la limite passe par les hameaux de Gahvern et Lesoanic"),
    ('56190', 'vesina', 'galo', "Réguiny : bourg en pays français, à petite distance du breton ; hameaux bretons du Theil et de Couedrien ; prédication en français"),
    ('56189', 'vesina', 'galo', "Radenac : française, sauf une petite pointe autour du village de Nespy"),
    ('56204', 'mixta', 'galo', "Saint-Allouestre : bourg et deux tiers du territoire en pays bretonnant ; prédication en breton"),
    ('56017', 'breton', 'galo', "Bignan : presque entièrement bretonne (hameau de Kercado sur la limite)"),
    ('56071', 'vesina', 'galo', "Guéhenno : en majeure partie française (hameau de Kermel sur la limite)"),
    ('56222', 'breton', 'galo', "Saint-Jean-Brévelay : toute bretonne, sauf le hameau de Kermorin"),
    ('56172', 'vesina', 'galo', "Plumelec : bourg en pays français ; séparation entre Cadoudal et Lestiernau"),
    ('56157', 'breton', 'galo', "Plaudren : bretonnante ; la limite suit celle de Trédion"),
    ('56254', 'vesina', 'galo', "Trédion : française, sauf une petite pointe à Kerdossan"),
    ('56053', 'mixta', 'galo', "Elven : coupée à peu près par moitié, bourg en pays français ; un vicaire breton sur quatre prêtres"),
    ('56255', 'breton', 'galo', "Treffléan : à l'ouest de la limite"),
    ('56261', 'vesina', 'galo', "La Vraie-Croix : bourg français ; la limite passe plus près de cette commune que de Treffléan"),
    ('56247', 'breton', 'galo', "Sulniac : bretonne (hameaux de Kerbournis et du Château sur la limite) ; prédication en breton"),
    ('56015', 'breton', 'galo', "Berric : laissée un peu à l'ouest, la limite passe au Drenegy ; prédication en breton"),
    ('56149', 'vesina', 'galo', "Noyal-Muzillac : bourg en pays français ; hameaux de Bourgeul et Muren à l'ouest de la limite"),
    ('56143', 'vesina', 'galo', "Muzillac : française ; la limite suit un étang de la commune puis la rivière vers Ambon"),
    ('56002', 'breton', 'galo', "Ambon : entièrement bretonnante, sauf le village de Penesclus ; prédication en français et en breton"),
]
# communes à l'est de la limite non citées par Sébillot (fig. 5 et fig. 3) : butées
BUTADAS = ['22276',  # Saint-Bihy
           '22117',  # Lantic (à l'est de Plourhan et Pléguien)
           '22073',  # La Harmoye
           '56027',  # Buléon (cercle sans nom à l'est de Nespy, fig. 3)
           '56184',  # Questembert
           '56047',  # Crédin
           '56019',  # Billio
           '56018',  # Billiers
           ]
# breton éteint (zone historique)
ISTORIC = [
    ('44010', "Batz-sur-Mer (Bourg-de-Batz) : breton encore parlé en 1886 dans sept villages paludiers (Kervalet, Trégaté, Roffiat, Kermoisan…), 200 locutrices et locuteurs habituels selon Léon Bureau ; derniers locuteurs morts dans les années 1960", 'SEB86 WPB'),
    ('44135', "Le Pouliguen (séparé de Batz en 1854) : locuteurs tardifs au village de Penchâteau (XIXe siècle)", 'WPB'),
    ('44125', "Piriac-sur-Mer : des anciens parlaient breton après 1830 (témoignage recueilli par Paulin Benoist) ; mots notés en 1823 par Édouard Richer", 'WPB'),
    ('44097', "Mesquer : breton parlé plus tard encore qu'à Piriac (Paulin Benoist)", 'WPB'),
    ('44006', "Assérac (partie ouest) : en 1806, la limite des deux langues « commence aux salines d'Herbignac » (enquête Coquebert de Montbret, imprécise pour ce département)", 'WPB'),
    ('44183', "Saint-Molf (en partie) : même interprétation de l'enquête de 1806", 'WPB'),
    ('56058', "Férel : breton parlé en 1806 (Coquebert de Montbret) ; éteint au sud de la Vilaine en 1886 (Sébillot)", 'WPB SEB86'),
    ('56030', "Camoël : breton parlé en 1806 (Coquebert de Montbret) ; éteint au sud de la Vilaine en 1886 (Sébillot)", 'WPB SEB86'),
    ('56155', "Pénestin : breton parlé en 1806 (Coquebert de Montbret) ; disparu « à une époque assez rapprochée » selon le chanoine Le Méné (1889)", 'WPB SEB86'),
]

etat = {}  # insee -> (domaine, transicio, note, font)
for k, d, t, n in LIMITA:
    assert k in com, k
    etat[k] = (d, t, n, S86)
for k in BUTADAS:
    etat[k] = ('galo', '', '', S86)

# propagation depuis le Finistère : on traverse les communes non classées et les
# communes « breton » de la table, on s'arrête aux autres
dom = set(k for k, c in com.items() if c['dep'] == '29')
pila = list(dom)
while pila:
    a = pila.pop()
    for b in com[a]['vesinas']:
        if b in dom or com[b]['dep'] not in ('22', '29', '56'):
            continue
        if b in etat and etat[b][0] != 'breton':
            continue
        dom.add(b)
        pila.append(b)
# îles sans voisine : rangées d'après la carte AN (toutes en zone « 6 breton » ici)
illas = [k for k, c in com.items() if not c['vesinas'] and c['dep'] in ('22', '29', '56')]
for k in illas:
    log('île sans voisine : %s %s, zone AN %s' % (k, com[k]['nom'], com[k]['zona']))
    if com[k]['zona'] and com[k]['zona'].startswith('6'):
        dom.add(k)
# îles reliées entre elles mais pas au continent (Belle-Île) : carte AN
for k, c in com.items():
    if c['dep'] in ('22', '29', '56') and k not in dom and k not in etat and (c['zona'] or '').startswith('6'):
        if all(com[b]['dep'] == c['dep'] and b not in etat for b in c['vesinas']) and c['canton'] == 'Le Palais':
            dom.add(k)
            log('Belle-Île : %s %s rangée en breton (canton AN Le Palais)' % (k, c['nom']))
# contrôle de la propagation : communes bretonnes hors zone AN et inversement
log('\n== Domaine 1886 contre la carte AN (cantons 2013)')
for k in sorted(dom):
    if not (com[k]['zona'] or '').startswith('6'):
        log('  bretonne en 1886, gallo dans AN : %s %s (%s)' % (k, com[k]['nom'], com[k]['canton']))
for k, c in sorted(com.items()):
    if c['dep'] in ('22', '56', '44') and (c['zona'] or '').startswith('6') and k not in dom:
        log('  zone AN bretonne, hors domaine 1886 : %s %s (%s) %s' % (k, c['nom'], c['canton'],
            etat.get(k, ('desaparegut' if k in [x for x, _, _ in ISTORIC] else '',))[0]))

json.dump({'dom': sorted(dom), 'etat': etat}, open(os.path.join(BRUT, 'etapa-domeni.json'), 'w', encoding='utf-8'), ensure_ascii=False)

# ---------------------------------------------------------------- 2. évêchés
pertot = defaultdict(set)   # insee actuel -> évêchés
fonts_av = defaultdict(set)
for e in par:
    if not e.get('cibla'):
        continue
    cands = [x for x in (e.get('codi') or []) if x in com] or [x for x in (e.get('rempl') or []) if x in com] \
        or [x for x in (e.get('dins') or []) if x in com]
    if not cands:
        log('paroisse sans commune actuelle : %s / %s (%s)' % (e['avesc'], e['cibla'], e.get('qid')))
        continue
    for x in cands[:1]:
        pertot[x].add(e['avesc'])
        fonts_av[x].add(e['lista'])
# paroisses sans lien dans les listes, rapprochées à la main
for k, a in (('29068', 'leon'), ('29115', 'cornouaille'), ('22020', 'cornouaille')):
    pertot[k].add(a)
    fonts_av[k].add('à la main')
# Morbihan : paroisses venues d'autres évêchés (Wikipédia « Diocèse de Vannes », § Territoire)
pertot['56024'].add('saint-brieuc')   # Bréhan (Saint-Samson est aujourd'hui dans Rohan) : hors domaine
for nom in ('Camoël', 'Férel', 'Nivillac', 'Pénestin', 'La Roche-Bernard', 'Saint-Dolay', 'Théhillac'):
    for k, c in com.items():
        if c['nom'] == nom and c['dep'] == '56':
            pertot[k].add('nantes')
multi = {k: v for k, v in pertot.items() if len(v) > 1}
log('\n== Communes à plusieurs évêchés (fusions ou trèves) : %d' % len(multi))
for k, v in sorted(multi.items()):
    log('  %s %s : %s' % (k, com[k]['nom'], ', '.join(sorted(v))))
sens = sorted(k for k in dom if k not in pertot)
log('\n== Communes bretonnes sans évêché dans les listes : %d' % len(sens))
for dep in ('22', '29', '56'):
    l = [k for k in sens if com[k]['dep'] == dep]
    log('  %s (%d) : %s' % (dep, len(l), ', '.join('%s %s' % (k, com[k]['nom']) for k in l)))


# ---------------------------------------------------------------- 3. dialectes
def kod(nom, dep):
    l = [k for k, c in com.items() if c['nom'] == nom and c['dep'] == dep]
    assert len(l) == 1, (nom, dep, l)
    return l[0]


def noms(dep, *ns):
    return [kod(n, dep) for n in ns]


DED = {}  # évêché déduit pour les communes absentes des listes
for k in noms('29', 'Saint-Pol-de-Léon', 'Roscoff', 'Santec'):
    DED[k] = ('leon', "Minihy de Saint-Pol (Léon), absent des listes d'archidiaconés")
for k in noms('29', 'Arzano', "Guilligomarc'h", 'Rédené'):
    DED[k] = ('vannes', "une des trois paroisses de l'évêché de Vannes passées au Finistère")
for k in noms('22', 'Kerfot', 'Lannebert', 'Pléguien', 'Pléhédel', 'Plouézec', 'Plouha', 'Plourivo', 'Pludual',
              'Tressignaux', 'Yvias', 'Tréméven', 'Plourhan', 'Tréveneuc', 'Tréguidel', 'Plélo'):
    DED[k] = ('saint-brieuc', "Goëlo, archidiaconé de l'évêché de Saint-Brieuc")
DED[kod('Minihy-Tréguier', '22')] = ('treguier', 'Minihy de Tréguier')
for k in noms('22', 'Mellionnec', 'Plélauff', 'Lescouët-Gouarec'):
    DED[k] = ('vannes', "pays Pourlet, évêché de Vannes (articles Mellionnec et Plélauff)")
DED[kod('Le Cloître-Saint-Thégonnec', '29')] = ('treguier', "trève de Plourin, évêché de Tréguier (article de la commune)")
DED[kod('Lohuec', '22')] = ('treguier', "trève de Plougras, évêché de Tréguier (article de la commune)")
for k in sorted(set(dom) | {x for x, e in etat.items() if e[0] in ('mixta', 'vesina')}):
    if k in pertot or k in DED:
        continue
    c = com[k]
    if c['dep'] == '56':
        DED[k] = ('vannes', "Morbihan : évêché de Vannes par défaut (exceptions citées : paroisses de Cornouaille, de Saint-Brieuc et de Nantes)")
    elif c['dep'] == '29':
        DED[k] = ('treguier', "Trégor finistérien : absent des listes de Léon et de Cornouaille (le Finistère a reçu 15 paroisses de Tréguier)")
    elif c['dep'] == '22':
        DED[k] = ('treguier', "archidiaconé de Plougastel (Tréguier, entre Léguer et Queffleuth), liste absente de Wikipédia : déduit")
# enclaves de Dol : dialecte de leur entourage
DOL = {}
for n in ('Locquénolé',):
    DOL[kod(n, '29')] = 'leon'
DOL[kod('Magoar', '22')] = 'cornouaille'  # trève de Coadout « enclavée dans l'évêché de Cornouaille »
for n in ('Lanmeur', 'Locquirec'):
    DOL[kod(n, '29')] = 'treguier'
for n in ('Coadout', 'Lanvellec', 'Lanmodez', 'Perros-Guirec', 'Trévou-Tréguignec', 'Lannion'):
    DOL[kod(n, '22')] = 'treguier'
for n in ('Île-de-Bréhat', 'Lanloup', 'Lanleff', 'Lanvollon', 'Ploubazlanec', 'Paimpol', 'Saint-Quay-Portrieux'):
    DOL[kod(n, '22')] = 'saint-brieuc'

DIAL = {'leon': 'leoneg', 'treguier': 'tregerieg', 'saint-brieuc': 'tregerieg', 'cornouaille': 'kerneveg',
        'vannes': 'gwenedeg', 'nantes': 'gwenedeg'}
NOM_AV = {'leon': 'Léon', 'treguier': 'Tréguier', 'saint-brieuc': 'Saint-Brieuc', 'cornouaille': 'Cornouaille',
          'vannes': 'Vannes', 'nantes': 'Nantes', 'dol': 'Dol'}
# corrections données par Sébillot lui-même (p. 15-18)
FORCAT = {kod('Morlaix', '29'): ('leoneg', 'leoneg-tregerieg', "Sébillot : « toute la ville de Morlaix et plusieurs communes des environs situées sur la rive trécorroise parlent le breton de Léon » (communes non nommées) ; paroisses Saint-Mathieu et Saint-Melaine de Tréguier, Saint-Martin de Léon")}
for n in ('Arzano', "Guilligomarc'h", 'Rédené'):
    FORCAT[kod(n, '29')] = ('kerneveg', 'kerneveg-gwenedeg', "Sébillot : le cornouaillais « comprend les arrondissements entiers de Châteaulin, de Quimper et de Quimperlé »")
for n in ('Berné', 'Meslan', 'Priziac', 'Plouray'):
    FORCAT[kod(n, '56')] = ('kerneveg', 'kerneveg-gwenedeg', "Sébillot : les cantons du Faouët et de Gourin parlent un dialecte « fortement teinté de vannetais » mais plus proche du cornouaillais")
for n in ('Le Faouët', 'Guiscriff', 'Lanvénégen', 'Gourin', 'Langonnet', 'Roudouallec', 'Le Saint'):
    FORCAT[kod(n, '56')] = ('kerneveg', 'kerneveg-gwenedeg', "Sébillot : cantons du Faouët et de Gourin, dialecte « fortement teinté de vannetais », plus proche du cornouaillais")
for n in ('Neulliac', 'Kergrist'):
    FORCAT[kod(n, '56')] = ('kerneveg', 'kerneveg-gwenedeg', "évêché de Cornouaille ; mais Sébillot ne range dans le cornouaillais, pour le Morbihan, que les cantons du Faouët et de Gourin : à vérifier")
for n in ('Mellionnec', 'Plélauff', 'Lescouët-Gouarec'):
    FORCAT[kod(n, '22')] = ('gwenedeg', 'kerneveg-gwenedeg', "mais pour Sébillot le vannetais « n'est parlé que dans le Morbihan » : à vérifier")
FORCAT[kod('Landerneau', '29')] = ('leoneg', 'leoneg-kerneveg', "ville partagée entre Léon et Cornouaille (paroisse Saint-Thomas) ; Sébillot fait passer la limite « entre Landerneau et la Martyre »")
FORCAT[kod('Ouessant', '29')] = ('leoneg', 'leoneg-tregerieg', "évêché de Léon ; d'après Luzel, cité par Sébillot, le parler d'Ouessant a « une plus grande parenté » avec le trégorrois")

ILLAS = {'29155': 'eusa', '29084': 'molenez', '29082': 'enez-vaz', '29083': 'enez-sun', '22016': 'enez-vriad',
         '56069': 'groe', '56009': 'ar-gerveur', '56114': 'ar-gerveur', '56152': 'ar-gerveur',
         '56241': 'ar-gerveur', '56086': 'enez-houad', '56085': 'edig', '56087': 'enizenach',
         '56088': 'an-arzh'}


def classa(k):
    """évêché, dialecte, transicio, parlar, note, font"""
    av, nota, font = None, '', 'EV'
    if k in DOL:
        av, nota = DOL[k], "enclave de l'évêché de Dol, rangée avec son entourage (%s)" % NOM_AV[DOL[k]]
    elif k in pertot:
        s = pertot[k] - {'dol'}
        av = sorted(s)[0] if s else None
        if s == {'leon', 'cornouaille'}:
            av = 'leon'  # Landerneau : deux paroisses de Léon, une de Cornouaille
        if len(s) > 1:
            nota = 'paroisses de plusieurs évêchés : %s' % ', '.join(NOM_AV[x] for x in sorted(s))
    if av is None and k in DED:
        av, nota, font = DED[k][0], DED[k][1], 'DED'
    if av is None:
        return None, '', '', '', 'évêché inconnu', ''
    d, t = DIAL[av], ''
    if k in FORCAT:
        d, t, n2 = FORCAT[k]
        nota = (nota + ' ; ' if nota else '') + n2
        font += ' SEB86'
    p = ''
    if av == 'saint-brieuc':
        p = 'goelo'
    if k in ILLAS:
        p = ILLAS[k]
    return av, d, t, p, nota, font


# ---------------------------------------------------------------- 4. sorties
br = {}
for l in list(csv.reader(open(os.path.join(BRUT, 'wd-br.csv'), encoding='utf-8'), delimiter=';'))[1:]:
    br[l[0]] = l
osm = dict(list(csv.reader(open(os.path.join(BRUT, 'osm-name-br.csv'), encoding='utf-8'), delimiter=';'))[1:])


def nom_br(k):
    l = br.get(k)
    if l and l[2]:
        t = l[2]
        if t.endswith(')') and ' (' in t:
            t = t[:t.rindex(' (')]
        return t, 'WD-brwiki'
    if osm.get(k):
        return osm[k], 'OSM'
    return '', ''


ist = {x: (n, f) for x, n, f in ISTORIC}
linhas = []
for k in sorted(set(dom) | {x for x, e in etat.items() if e[0] in ('mixta', 'vesina')} | set(ist)):
    c = com[k]
    if k in etat and etat[k][0] in ('breton', 'mixta', 'vesina'):
        domeni, trans, nota, font = etat[k]
    elif k in ist:
        domeni, trans = 'desaparegut', ''
        nota, font = ist[k]
    else:
        domeni, trans, nota, font = 'breton', '', '', S86
    av, d, t2, p, n2, f2 = classa(k)
    if domeni == 'desaparegut':
        av = 'nantes'  # Batz, Guérande, Férel, Camoël, Pénestin : évêché de Nantes
        d, t2, p, f2 = 'gwenedeg', '', 'gwenrann', 'WPB'
        n2 = "breton de Batz rangé avec le vannetais, à titre provisoire (certains auteurs parlent d'un « breton guérandais » à part)"
    transicio = ','.join(x for x in (trans, t2) if x)
    if c['nom'] in ('Brest', 'Lorient'):
        nota = (nota + ' ; ' if nota else '') + "comptée bretonnante par Sébillot, mais « îlot à peu près français » (Brest, rive gauche de la Penfeld) / enclave « presque entièrement française » (Lorient intra-muros)"
    if k in ILLAS and domeni == 'breton' and not trans:
        nota = (nota + ' ; ' if nota else '') + "île : domaine d'après la carte AN (zone 6) et Sébillot"
    nb, fnb = nom_br(k)
    fonts = ' '.join(dict.fromkeys((font + ' ' + f2 + ' IGN ' + fnb).split()))
    linhas.append(['France', NOM_AV.get(av, ''), 'comuna_fr', c['nom'], nb, k, domeni, d, p, transicio, '',
                   ' | '.join(x for x in (nota, n2) if x), fonts])
os.makedirs(SORT, exist_ok=True)
with open(os.path.join(SORT, 'dialectes-breton.csv'), 'w', encoding='utf-8-sig', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['regio', 'unitat', 'mena', 'nom_oficial', 'nom_local', 'codi', 'domeni', 'dialecte', 'parlar',
                'transicio', 'part_oc', 'nota', 'font'])
    w.writerows(linhas)
with open(os.path.join(SORT, 'noms-br.csv'), 'w', encoding='utf-8-sig', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['insee', 'nom_br', 'font'])
    for k in sorted(com):
        nb, f = nom_br(k)
        if nb:
            w.writerow([k, nb, f])

# ---------------------------------------------------------------- 5. chiffres et contrôles
log('\n== Chiffres')
log('lignes CSV : %d' % len(linhas))
log('par domaine : %s' % Counter(l[6] for l in linhas).most_common())
for dom_ in ('breton', 'mixta', 'vesina', 'desaparegut'):
    sub = [l for l in linhas if l[6] == dom_]
    log('  %s par dialecte : %s ; population 2026 : %s' % (dom_, Counter(l[7] for l in sub).most_common(),
        sum(com[l[5]]['pop'] or 0 for l in sub)))
log('par dialecte (breton + mixta) : %s' % Counter(l[7] for l in linhas if l[6] in ('breton', 'mixta')).most_common())
log('par parler : %s' % Counter(l[8] for l in linhas if l[8]).most_common())
log('par évêché : %s' % Counter(l[1] for l in linhas).most_common())
log('transitions : %s' % Counter(l[9] for l in linhas if l[9]).most_common())
log("par source de l'évêché : %s" % Counter('DED' if 'DED' in l[12] else 'EV' for l in linhas).most_common())
log('sans nom breton : %s' % [l[5] for l in linhas if not l[4]])
log('sans dialecte : %s' % [(l[5], l[3]) for l in linhas if not l[7]])
dif = [(k, nom_br(k)[0], osm.get(k, '')) for k in sorted(com) if nom_br(k)[1] == 'WD-brwiki' and osm.get(k) and osm[k] != nom_br(k)[0]]
log('noms bretons : titre brwiki différent de OSM name:br : %d' % len(dif))
for x in dif:
    log('  %s %s | %s | OSM %s' % (x[0], com[x[0]]['nom'], x[1], x[2]))
open(os.path.join(BRUT, 'controle.txt'), 'w', encoding='utf-8').write('\n'.join(ctl) + '\n')
