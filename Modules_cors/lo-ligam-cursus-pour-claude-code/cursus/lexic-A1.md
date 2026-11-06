# Lexique exact de l'A1 (module 0, unités 2 à 8, haltes, mission)

> Rédigé par Claude le 2026-11-01 pour les rédacteurs de l'A1 (voir `regles-redaccion-A1.md`). La carte validée par Romain fait foi (`01-A1-carta-8-unitats.md`) ; ce fichier en donne l'encadré « À retenir » exact, module par module.
> Tout l'occitan a été passé à l'API de lo Congrès le 2026-11-01 (`node scripts/verificar-oc.mjs`, depuis `C:/Users/perie/Depots/Lo_Ligam/app`) : lo Basic (variété languedocienne), puis vèrb'Òc pour les formes conjuguées, top'Òc pour les pays. Aucune réponse brute n'est gardée : seulement ✓ ou ⚠️. **Romain relit et valide l'occitan avant publication.**

## 0. Mode d'emploi (à lire avant d'écrire)

1. **Copie les items tels quels** (`id`, `oc`, `sound`, `fr`) dans les blocs `type: 'chunks'` de ton module, coupés en blocs de 5 lignes au plus, chacun placé juste avant l'exercice qui l'emploie (`regles-redaccion-A1.md` §9, règle 1). Un écart nécessaire : minimal, et signalé dans ton compte rendu.
2. **Le contrôle compare des formes exactes** (`scripts/controle-explications.mjs`, fonction `motsDe`) : *pomas* n'est pas *poma*, *cantam* n'est pas *cantar*. Toute forme que tu emploies (pluriel, personne du verbe, féminin) doit figurer dans l'`oc` d'un item, de ton module ou d'un module précédent. C'est pourquoi les items ci-dessous donnent les pluriels et les paradigmes entiers. Le contrôle lit aussi l'*italique* du champ `fr` des items : n'y mets en italique que des mots déjà appris.
3. **Un `id` ne vit que dans un seul encadré.** Le test `app/src/lib/carnet/regles.test.js` (« chaque chose a un id unique ») échoue sinon. Le mémo de l'unité (x.4), les haltes et la mission n'ont donc **pas** de `chunks` avec `id` : un bloc `table`, ou un `chunks` dont les items n'ont pas d'`id`. Leurs exercices renvoient aux id existants par `choses: [...]`.
4. **Module 0 et module 1.1 partagent six formules.** Comme 1.1 déclare déjà leurs id, le module 0 ne peut pas les redéclarer (test ci-dessus). Solution retenue : l'encadré du module 0 est un `chunks` **sans `id`** (le contrôle compte ses mots comme enseignés, le carnet ne crée pas de doublon) et ses exercices portent les id de 1.1 dans `choses` (`adieu`, `cossi-vas`, `va-plan-e-tu`, `vau-plan`, `al-cop-que-ven`, `a-leu`) : les réponses du module 0 nourrissent donc déjà les cartes de 1.1. (Autre voie, non retenue : donner les id au module 0 et les retirer de l'encadré de 1.1, ce qui oblige à retoucher 1.1.)
5. **Le titre de l'unité, sur la carte de titre de x.1 (`ouverture.titre`), est contrôlé.** D'où quatre items « titre de l'unité », appris en bloc : *Parlas occitan ?* (2.1), *la familha* (3.1), *Qué fas ?* (4.1), *la jornada* (6.1). *Al mercat* (5.1) et *L'ostal* (7.1) sont dans leur module ; *En vila* (8.1) n'a que des mots connus.
6. **Les titres des modules sont contrôlés aussi** (`modul.oc`). *Tasca* (squelettes des x.4) est absent du Basic : des titres faits de mots connus sont proposés plus bas. *Pausa* ✓ et *Mission* ✓ restent, mais se glosent dans leur module (`glosa: { pausa: 'halte' }`, `glosa: { mission: 'mission' }`). Le titre du module 0, *Benvengut dins lo mond occitan*, se glose de même (*benvengut, dins, lo, mond, occitan*).
7. **Ça sonne comme** (même notation que l'unité 1) : syllabe forte en MAJUSCULES ; *o* = « ou », *ò* = « Ò » ; *-a* final non accentué = « o » ; *-as* final = « os » ; *e* = « é », *è* = « è » ; *v* = « b » ; *j*, *g* devant *e, i*, *tg* = « dj » ; *ch* = « tch » ; *lh* = « ly » (« l » en fin de mot) ; *nh* = « gn » (« n » en fin de mot) ; *tz* = « ts » ; *s* entre voyelles = « z » ; *-r* de l'infinitif et *-n* final des noms se taisent (« (n) » = *n* léger) ; les voyelles devant *n* ne sont jamais nasales comme en français (Chatbèrt, fiche 09 §A4). **Toutes les notations sont des propositions**, à confirmer par Romain à l'enregistrement, comme dans l'unité 1.
8. **Légende de la vérification** : ✓ = connu du Basic ou de vèrb'Òc ; ✓ (pluriel) = pluriel régulier d'un singulier ✓ ; ✓ (fr) = trouvé en partant du français (`--fr`) quand l'appel en occitan a planté ; *outil* = mot d'une ou deux lettres que l'API ne sait pas traiter (forme de base d'Alibèrt, exclue de l'API par le script lui-même) ; ⚠️ À VÉRIFIER (dicodòc) = absent, ou erreur d'appel dans les deux sens. Rien n'a été remplacé par une forme inventée.

---

## Module 0 · `0` · *Benvengut dins lo mond occitan* (Bienvenue dans le monde occitan)

**Forme du jour** : aucune grammaire. Les six formules du cours 0 de Romain (`visio-A1.md` §2), en bloc.

**À retenir** (6 items, **sans `id`**, voir point 4) :

```js
// Module 0 : pas d'`id` ici (les six cartes appartiennent au module 1.1).
// Exercices du module 0 : choses: ['adieu'], ['cossi-vas'], ['va-plan-e-tu'], ['vau-plan'], ['al-cop-que-ven'], ['a-leu']
items: [
	{ oc: 'Adieu !', sound: 'a-DIOU', fr: 'salut ! (bonjour et au revoir, entre amis)' },
	{ oc: 'Cossí vas ?', sound: 'cou-si BAS', fr: 'comment vas-tu ? (le v sonne « b »)' },
	{ oc: 'Va plan, e tu ?', sound: 'ba PLA, é TU', fr: 'ça va bien, et toi ?' },
	{ oc: 'Vau plan, mercés !', sound: 'baou PLA, mér-SÉS', fr: 'je vais bien, merci ! (réponse à *Cossí vas ?*)' },
	{ oc: 'Al còp que ven !', sound: 'al COP qué BÈN', fr: 'à la prochaine !' },
	{ oc: 'A lèu !', sound: 'a LÈOU', fr: 'à bientôt !' }
]
```

**Vérification** : tout ✓ (cours 0 vérifié le 2026-11-01, unité 1).
**À gloser en passant** : le titre (*benvengut, dins, lo, mond, occitan*) ; des mots du français du Midi venus de l'occitan, tous ✓ : *pichon* (« pitchoun »), *fada*, *pegar* (« ça pègue »), *pecaire* (« peuchère »), *macarèl*, *garriga*, *mistral*, *caçolet* (« cassoulet »), *escagassar* (« escagasser ») ; *cagada* ✓ mais familier, à éviter. *Occitània* : nom propre, absent du Basic.
**Son du jour** : le *v* sonne « b » : *vas* « BAS », *va* « BA », *vau* « BAOU », *ven* « BÈN ». (Repris en 3.1 et 6.3, comme le prévoit la carte.)
**Spirale** : rien avant. Le module 1.1 reprend les six formules et ajoute *Adieu-siatz, Bonjorn, Bon ser, Cossí anatz ?, Mercés, A deman*.

---

## Unité 2 · *Parlas occitan ?* (scène : la fièra)

**Carte de titre (dans 2.1)** : `numero: 2`, bloc *Ieu e los meus* (moi et les miens), titre *Parlas occitan ?* (parles-tu occitan ?), question *Siás occitana ?* (es-tu occitane ?).

### 2.1 · `2-1` · *Siás occitana ?* (Es-tu occitane ?)

**Forme du jour** : masculin et féminin. On ajoute *-a* : *occitan → occitana*, *francés → francesa*, *espanhòl → espanhòla* ; de même *el → ela*.

**À retenir** (12 items ; carte : 10) :

```js
items: [
	{ id: 'parlas-occitan', oc: 'Parlas occitan ?', sound: 'PAR-los ou-tsi-TA', fr: 'parles-tu occitan ? (titre de l’unité : le verbe s’explique au module suivant)' },
	{ id: 'occitan-occitana', oc: 'occitan · occitana', sound: 'ou-tsi-TA · ou-tsi-TA-no', fr: 'occitan · occitane' },
	{ id: 'frances-francesa', oc: 'francés · francesa', sound: 'fran-SÉS · fran-SÉ-zo', fr: 'français · française' },
	{ id: 'catalan-catalana', oc: 'catalan · catalana', sound: 'ca-ta-LA · ca-ta-LA-no', fr: 'catalan · catalane' },
	{ id: 'espanhol-espanhola', oc: 'espanhòl · espanhòla', sound: 'es-pa-GNÒL · es-pa-GNÒ-lo', fr: 'espagnol · espagnole' },
	{ id: 'italian-italiana', oc: 'italian · italiana', sound: 'i-ta-LYA · i-ta-LYA-no', fr: 'italien · italienne' },
	{ id: 'angles-anglesa', oc: 'anglés · anglesa', sound: 'an-GLÉS · an-GLÉ-zo', fr: 'anglais · anglaise' },
	{ id: 'portugues-portuguesa', oc: 'portugués · portuguesa', sound: 'pour-tu-GUÉS · pour-tu-GUÉ-zo', fr: 'portugais · portugaise' },
	{ id: 'marroquin-marroquina', oc: 'marroquin · marroquina', sound: 'ma-rou-KI · ma-rou-KI-no', fr: 'marocain · marocaine' },
	{ id: 'argerian-argeriana', oc: 'argerian · argeriana', sound: 'ar-djé-RYA · ar-djé-RYA-no', fr: 'algérien · algérienne' },
	{ id: 'el-ela', oc: 'el · ela', sound: 'ÉL · É-lo', fr: 'lui, il · elle (*Ela es catalana.*)' },
	{ id: 'oc-non', oc: 'Òc ! · Non !', sound: 'OK · NOU', fr: 'oui ! · non !' }
]
```

**Vérification** : ✓ occitan, occitana, catalan(a), espanhòl(a), italian(a), anglés, anglesa, portugués, portuguesa, marroquin(a), argerian(a) (le Basic donne *argerian* pour « algérien »), ela, òc, non ; *parlas* ✓ (vèrb'Òc). ⚠️ À VÉRIFIER (dicodòc) : *francés, francesa* (absents du Basic et de vèrb'Òc ; « français » sans traduction ; déjà signalé par la carte). *el* : outil.
**À gloser en passant** : *la fièra* ✓ (la foire) ; pays ✓ (top'Òc) : *França, Espanha, Itàlia, Portugal, Alemanha, Marròc, Argeria, Reialme Unit* ; *alemand · alemanda* ✓ (allemand) ; prénoms (dans `nomsPropris`). Pour nommer quelqu'un : *Es Núria.* (*s'apèla* n'est pas enseigné).
**Son du jour** : *nh* sonne « gn » : *espanhòl* « es-pa-GNÒL », *espanhòla* « es-pa-GNÒ-lo » ; à côté, le *lh* de *Montpelhièr* « moun-pé-LYÈ ». (Glosés : *Espanha* « es-PA-gno », *Alemanha* « a-lé-MA-gno ».)
**Spirale** : `soi-de`, `d-ont-sias`, `es-de`, `noms-vilas` (*Soi de Tolosa : soi occitana*) ; `me-dison`, `encantat` ; `adieu`, `bonjorn`.

### 2.2 · `2-2` · *Parlas occitan ?* (Parles-tu occitan ?)

**Forme du jour** : *parlar* et *comprene* au singulier ; la négation, forme du livre (*Gramatica de l'occitan estandard*, p54) : *non* devant le verbe, *pas* après. Une ligne signale la forme familière, *pas* seul, à reconnaître (Romain, 2026-11-02).
- *parlar* : *parli, parlas, parla* ✓
- *comprene* : *compreni, comprenes, compren* ✓
- *Non parli pas catalan. Non compreni pas.*

**À retenir** (7 items ; carte : 8) :

```js
items: [
	{ id: 'parlar-singular', oc: 'parlar : parli · parlas · parla', sound: 'par-LA : PAR-li · PAR-los · PAR-lo', fr: 'parler : je parle · tu parles · il ou elle parle' },
	{ id: 'comprene-singular', oc: 'comprene : compreni · comprenes · compren', sound: 'coum-PRÉ-né : coum-PRÉ-ni · coum-PRÉ-nés · coum-PRÉ(N)', fr: 'comprendre : je comprends · tu comprends · il ou elle comprend' },
	{ id: 'pas', oc: 'Non parli pas… · Non compreni pas.', sound: 'nou PAR-li PAS · nou coum-PRÉ-ni PAS', fr: 'je ne parle pas… · je ne comprends pas. (*non* devant le verbe, *pas* après)' },
	{ id: 'un-pauc-plan', oc: 'un pauc · plan', sound: 'un PAOUK · PLA', fr: 'un peu · bien (*Parli un pauc occitan. Compreni plan.*)' },
	{ id: 'mas', oc: 'mas', sound: 'MAS', fr: 'mais (*Compreni, mas non parli pas.*)' },
	{ id: 'tanben', oc: 'tanben', sound: 'tam-BÉ', fr: 'aussi (*Parli tanben catalan.*)' },
	{ id: 'la-lenga', oc: 'la lenga', sound: 'la LÉN-go', fr: 'la langue' }
]
```

**Vérification** : ✓ parlar, pauc, plan, mas, tanben, lenga, non, pas (Basic) ; parli, parlas, parla, comprene, compreni, comprenes, compren (vèrb'Òc).
**À gloser en passant** : les phrases du jeu « l'oreille des pays » (gascon, provençal) : `glosa`, voir `alhors-en-occitania-A1.md`.
**Son du jour** : *é* fermé, *è* ouvert ; sans accent, *e* est fermé : *francés* « fran-SÉS », *mercés* « mér-SÉS », *deman* « dé-MA » ; *Besièrs* « bé-ZYÈS », *lèu* « LÈOU ».
**Spirale** : les nationalités de 2.1 deviennent des langues au masculin (*Parli francés*) ; `va-plan-e-tu` (*plan*) ; `demori-a`.

### 2.3 · `2-3` · *Cossí se ditz… ?* (Comment dit-on… ?)

**Forme du jour** : les mots pour questionner : *qué* (quoi), *ont* (où, 1.3), *cossí* (comment, 1.1), *qui* (qui : on attend un nom), *qual* (qui : on attend ce qu'est la personne, son rôle ; la grammaire de référence fait cette différence, p47), *quin · quina* (quel · quelle). La question garde l'ordre de la phrase : c'est la voix qui la fait.

**À retenir** (9 items ; carte : 9) :

```js
items: [
	{ id: 'que-es-aquo', oc: 'Qu’es aquò ?', sound: 'kés a-KÒ', fr: 'qu’est-ce que c’est ?' },
	{ id: 'cossi-se-ditz', oc: 'Cossí se ditz… en occitan ?', sound: 'cou-si sé DITS… én ou-tsi-TA', fr: 'comment dit-on… en occitan ?' },
	{ id: 'que-vol-dire', oc: 'Qué vòl dire… ?', sound: 'ké BÒL DI-ré', fr: 'que veut dire… ?' },
	{ id: 'podes-repetir', oc: 'Pòdes repetir, se te plai ?', sound: 'PÒ-dés ré-pé-TI, sé té PLAÏ', fr: 'tu peux répéter, s’il te plaît ?' },
	{ id: 'sabi-pas', oc: 'Non sabi pas.', sound: 'nou SA-bi PAS', fr: 'je ne sais pas.' },
	{ id: 'qui-es', oc: 'Qui es ?', sound: 'ki ÉS', fr: 'qui est-ce ? (on attend un nom : *Es Loís*)' },
	{ id: 'qual-es', oc: 'Qual es ?', sound: 'kal ÉS', fr: 'qui est-ce ? (on attend ce qu’est la personne, son rôle)' },
	{ id: 'quin-quina', oc: 'Quin… ? · Quina… ?', sound: 'KI(N) · KI-no', fr: 'quel… ? · quelle… ? (*Quina lenga parlas ?*)' },
	{ id: 'o-ou', oc: 'Occitan o francés ?', sound: 'ou-tsi-TA ou fran-SÉS', fr: 'occitan ou français ? (*o* : ou)' }
]
```

**Vérification** : ✓ qué, aquò, dire, vòl, repetir, qui, qual, quin, quina (Basic) ; ditz, pòdes, plai, sabi (vèrb'Òc) ; *se, en, te, o* : outils.
**Son du jour** : la voix qui monte dans la question sans mot pour questionner : *Parlas occitan ?*, *Siás occitana ?*, *Comprenes ?*, *Pòdes repetir ?*
**Spirale** : `comprene-singular`, `pas` (*Non compreni pas. Pòdes repetir ?*) ; `cossi-te-dison` (*cossí*) ; `d-ont-sias`, `ont-demoras` (*ont*).

### 2.4 · `2-4` · tâche · titre proposé *Quina lenga parla ?* (Quelle langue parle-t-il, parle-t-elle ?)

Aucun mot nouveau. Mobilise : `me-dison`, `soi-de`, `es-de`, `demori-a` ; toutes les nationalités, `el-ela`, `oc-non` (2.1) ; `parlar-singular`, `comprene-singular`, `pas`, `un-pauc-plan`, `mas`, `tanben`, `la-lenga` (2.2) ; les questions de 2.3. Mémo de l'unité : `table`.

### Halte 1 · `pausa-1` · *Pausa 1* (glose *pausa*)

Aucun mot nouveau. Une rencontre à la fièra (*fièra* à gloser de nouveau si besoin) : saluer et vouvoyer (1.1), se nommer (1.2), origine et habitat (1.3), nationalité (2.1), langues (2.2), faire répéter, demander un mot (2.3). Bilan : `checklist` et lien vers `/aprene/carnet`.

---

## Unité 3 · *La familha* (scène : le repas de famille)

**Carte de titre (dans 3.1)** : `numero: 3`, bloc *Ieu e los meus*, titre *La familha* (la famille), question *Quant as d'ans ?* (quel âge as-tu ?).

### 3.1 · `3-1` · *Quant as d'ans ?* (Quel âge as-tu ?)

**Forme du jour** : *Ai… ans* en bloc (le verbe *aver* s'explique en 3.3). Nombres de 0 à 20 ; *un · una* et *dos · doas* changent au féminin ; de 17 à 19, trait d'union et *e* (*dètz-e-sèt*, cadre §3, Alibèrt).

**À retenir** (24 items ; carte : 22) :

```js
items: [
	{ id: 'la-familha', oc: 'la familha', sound: 'la fa-MI-lyo', fr: 'la famille (titre de l’unité)' },
	{ id: 'quant-as-d-ans', oc: 'Quant as d’ans ? · Ai… ans.', sound: 'KAN as DANS · aï… ANS', fr: 'quel âge as-tu ? · j’ai… ans. (mot à mot : combien as-tu d’ans ?)' },
	{ id: 'a-ans', oc: 'Ela a… ans. · un an', sound: 'É-lo a… ANS · u-NAN', fr: 'elle a… ans. · un an' },
	{ id: 'nombre-0', oc: 'zèro', sound: 'ZÈ-rou', fr: '0' },
	{ id: 'nombre-1', oc: 'un · una', sound: 'U(N) · U-no', fr: '1 (au masculin · au féminin)' },
	{ id: 'nombre-2', oc: 'dos · doas', sound: 'DOUS · DOUOS', fr: '2 (au masculin · au féminin)' },
	{ id: 'nombre-3', oc: 'tres', sound: 'TRÉS', fr: '3' },
	{ id: 'nombre-4', oc: 'quatre', sound: 'KA-tré', fr: '4' },
	{ id: 'nombre-5', oc: 'cinc', sound: 'SINK', fr: '5' },
	{ id: 'nombre-6', oc: 'sièis', sound: 'SYÈÏS', fr: '6' },
	{ id: 'nombre-7', oc: 'sèt', sound: 'SÈT', fr: '7' },
	{ id: 'nombre-8', oc: 'uèch', sound: 'UÈTCH', fr: '8' },
	{ id: 'nombre-9', oc: 'nòu', sound: 'NÒOU', fr: '9' },
	{ id: 'nombre-10', oc: 'dètz', sound: 'DÈTS', fr: '10' },
	{ id: 'nombre-11', oc: 'onze', sound: 'OUN-zé', fr: '11' },
	{ id: 'nombre-12', oc: 'dotze', sound: 'DOUT-sé', fr: '12' },
	{ id: 'nombre-13', oc: 'tretze', sound: 'TRÉT-sé', fr: '13' },
	{ id: 'nombre-14', oc: 'catòrze', sound: 'ca-TÒR-zé', fr: '14' },
	{ id: 'nombre-15', oc: 'quinze', sound: 'KIN-zé', fr: '15' },
	{ id: 'nombre-16', oc: 'setze', sound: 'SÉT-sé', fr: '16' },
	{ id: 'nombre-17', oc: 'dètz-e-sèt', sound: 'dèts-é-SÈT', fr: '17 (dix et sept)' },
	{ id: 'nombre-18', oc: 'dètz-e-uèch', sound: 'dèts-é-UÈTCH', fr: '18' },
	{ id: 'nombre-19', oc: 'dètz-e-nòu', sound: 'dèts-é-NÒOU', fr: '19' },
	{ id: 'nombre-20', oc: 'vint', sound: 'BIN', fr: '20 (le v sonne « b »)' }
]
```

**Vérification** : ✓ familha, quant, una, dos, doas, tres, quatre, cinc, sièis, sèt, uèch, nòu, dètz, onze, dotze, tretze, catòrze, quinze, setze, vint, ela (Basic) ; *ai, as* ✓ ; *an* ✓ (fr), *ans* ✓ (pluriel). ⚠️ À VÉRIFIER (dicodòc) : *zèro* (absent ; « zéro » sans traduction ; déjà signalé par la carte). *un, a* : outils.
**Son du jour** : le *v* sonne « b » : *vint* « BIN », *vila* « BI-lo », *vos* « BOUS », *vau* « BAOU ».
**Spirale** : `me-dison` (*Me dison Loís, ai vint ans*), `soi-de` ; `qual-es`, `quin-quina` ; `el-ela`.

### 3.2 · `3-2` · *Qual es ?* (Qui est-ce ?)

**Forme du jour** : les articles *lo* (le), *la* (la), *l'* (devant une voyelle), *los* (les, au masculin), *las* (les, au féminin) ; les possessifs *mon, ma, ton, ta*.

**À retenir** (12 items ; carte : 12) :

```js
items: [
	{ id: 'articles-lo-la', oc: 'lo · la · l’ · los · las', sound: 'lou · la · l’ · lous · las', fr: 'le · la · l’ (devant une voyelle) · les (masculin) · les (féminin)' },
	{ id: 'possessius-mon-ma', oc: 'mon · ma · ton · ta', sound: 'moun · ma · toun · ta', fr: 'mon · ma · ton · ta (*mon paire, ma maire*)' },
	{ id: 'lo-paire', oc: 'lo paire', sound: 'lou PAÏ-ré', fr: 'le père' },
	{ id: 'la-maire', oc: 'la maire', sound: 'la MAÏ-ré', fr: 'la mère' },
	{ id: 'lo-fraire', oc: 'lo fraire · los fraires', sound: 'lou FRAÏ-ré · lous FRAÏ-rés', fr: 'le frère · les frères' },
	{ id: 'la-sorre', oc: 'la sòrre · las sòrres', sound: 'la SÒ-rré · las SÒ-rrés', fr: 'la sœur · les sœurs' },
	{ id: 'filh-filha', oc: 'lo filh · la filha', sound: 'lou FIL · la FI-lyo', fr: 'le fils · la fille' },
	{ id: 'papeta-mameta', oc: 'lo papeta · la mameta', sound: 'lou pa-PÉ-to · la ma-MÉ-to', fr: 'le grand-père · la grand-mère' },
	{ id: 'oncle-tanta', oc: 'l’oncle · la tanta', sound: 'LOUN-clé · la TAN-to', fr: 'l’oncle · la tante' },
	{ id: 'cosin-cosina', oc: 'lo cosin · la cosina', sound: 'lou cou-ZI · la cou-ZI-no', fr: 'le cousin · la cousine' },
	{ id: 'drolle-drolla', oc: 'lo dròlle · la dròlla · los dròlles', sound: 'lou DRÒ-lé · la DRÒ-lo · lous DRÒ-lés', fr: 'l’enfant, le garçon · la fille · les enfants' },
	{ id: 'companh-companha', oc: 'lo companh · la companha', sound: 'lou coum-PAN · la coum-PA-gno', fr: 'le compagnon · la compagne' }
]
```

**Vérification** : ✓ paire, fraire, filh, filha, papeta, mameta, oncle, tanta, cosin, cosina, dròlle, dròlla, companha, mon, ton, los, las (Basic ; le Basic donne *papeta, mameta* pour grand-père, grand-mère, et *dròlle* pour « enfant » : *enfant* n'y est pas) ; *maire, companh* ✓ (fr : l'appel en occitan a planté) ; *fraires, dròlles* ✓ (pluriel). ⚠️ À VÉRIFIER (dicodòc) : *sòrre, sòrres* (absents ; « sœur » sans traduction ; déjà signalé par la carte). *lo, la, l', ma, ta* : outils.
**À gloser en passant** : *lo repais* ✓ (le repas) ; *pepin · menina* ✓ (se dit aussi pour grand-père, grand-mère) ; *mainatge* ✓ (autre mot pour l'enfant).
**À éviter** : les possessifs pluriels (*mos, mas, tos, tas*) et *son, sa* : non enseignés en A1.
**Son du jour** : *lh* sonne « ly » : *familha* « fa-MI-lyo », *filha* « FI-lyo », *Montpelhièr* « moun-pé-LYÈ » ; en fin de mot, il sonne « l » : *filh* « FIL ».
**Spirale** : nombres et `a-ans` (*Ma sòrre a dotze ans*) ; nationalités (*Mon paire es marroquin*) ; `demori-a`, `es-de`.

### 3.3 · `3-3` · *As de fraires ?* (As-tu des frères ?)

**Forme du jour** : *aver* au singulier ; *un, una* devant le nom ; *i a* (il y a) ; après *pas*, on dit *de*.
- *aver* : *ai, as, a* ✓

**À retenir** (9 items ; carte : 8) :

```js
items: [
	{ id: 'aver-singular', oc: 'aver : ai · as · a', sound: 'a-BÉ : AÏ · AS · A', fr: 'avoir : j’ai · tu as · il ou elle a' },
	{ id: 'un-una-article', oc: 'un fraire · una sòrre', sound: 'un FRAÏ-ré · U-no SÒ-rré', fr: 'un frère · une sœur (*un, una* : comme le nombre 1)' },
	{ id: 'i-a', oc: 'I a… · Non i a pas de…', sound: 'YA · nou ya PAS dé', fr: 'il y a… · il n’y a pas de…' },
	{ id: 'ai-pas-de', oc: 'Non ai pas de can.', sound: 'nou aï PAS dé CA', fr: 'je n’ai pas de chien. (après *pas*, on dit *de*)' },
	{ id: 'lo-can', oc: 'lo can', sound: 'lou CA', fr: 'le chien' },
	{ id: 'lo-cat', oc: 'lo cat · la cata', sound: 'lou CAT · la CA-to', fr: 'le chat · la chatte' },
	{ id: 'l-aucel', oc: 'l’aucèl', sound: 'laou-SÈL', fr: 'l’oiseau' },
	{ id: 'lo-caval', oc: 'lo caval', sound: 'lou ca-BAL', fr: 'le cheval' },
	{ id: 'la-galina', oc: 'la galina', sound: 'la ga-LI-no', fr: 'la poule' }
]
```

**Vérification** : ✓ aver, can, cat, cata, aucèl, caval, galina, una, pas (Basic) ; *ai, as* ✓ ; *a, i, un* : outils. Le Basic donne *can* (occitan) et *gos* (languedocien) pour « chien » : voir les doutes.
**À gloser en passant** : *gos* ✓ (chien, en languedocien) ; *conilh* ✓ (lapin) ; *peis* ✓ (poisson) ; *bèstia* ✓ (animal).
**Son du jour** : le *-n* final s'efface : *plan* « PLA », *deman* « dé-MA », *can* « CA », *catalan* « ca-ta-LA ».
**Spirale** : la famille de 3.2 (*Ai una sòrre e dos fraires*) ; nombres ; `pas` ; `es-de`.

### 3.4 · `3-4` · tâche · titre proposé *E ta familha ?* (Et ta famille ?)

Aucun mot nouveau. Mobilise : nombres, `quant-as-d-ans`, `a-ans` (3.1) ; articles, possessifs, famille (3.2) ; `aver-singular`, `un-una-article`, `i-a`, animaux (3.3) ; `demori-a`, `es-de` (1.3) ; nationalités (2.1) ; `parlar-singular` (*Mon papeta parla occitan*). Mémo : `table`.

---

## Unité 4 · *Qué fas ?* (scène : la semaine de Loís)

**Carte de titre (dans 4.1)** : `numero: 4`, bloc *Ieu e los meus*, titre *Qué fas ?* (que fais-tu ?), question *Ont trabalhas ?* (où travailles-tu ?).

### 4.1 · `4-1` · *Ont trabalhas ?* (Où travailles-tu ?)

**Forme du jour** : le présent des verbes en *-ar*, six personnes : on enlève *-ar*, on ajoute *-i, -as, -a, -am, -atz, -an*. Le pronom sujet ne sert qu'à insister. Deux détails d'écriture : *manjar → mangi* (*g* devant *i*), *dançar → danci* (*c* devant *i*). *demorar* : le *ò* revient quand la voix appuie dessus (*demòri, demoram*).
- modèle *parlar* : *parli, parlas, parla, parlam, parlatz, parlan* ✓ (les six formes)
- tous les paradigmes ci-dessous sont ✓ forme par forme (vèrb'Òc).

**À retenir** (11 items ; carte : 10) :

```js
items: [
	{ id: 'que-fas', oc: 'Qué fas ?', sound: 'ké FAS', fr: 'que fais-tu ? (titre de l’unité : le verbe s’explique au module suivant)' },
	{ id: 'trabalhar', oc: 'trabalhar : trabalhi · trabalhas · trabalha · trabalham · trabalhatz · trabalhan', sound: 'tra-ba-LYA : tra-BA-lyi · tra-BA-lyos · tra-BA-lyo · tra-ba-LYAN · tra-ba-LYATS · tra-BA-lyon', fr: 'travailler : je travaille, tu travailles, il ou elle travaille, nous travaillons, vous travaillez, ils ou elles travaillent' },
	{ id: 'parlar-plural', oc: 'parlam · parlatz · parlan', sound: 'par-LAN · par-LATS · PAR-lon', fr: 'nous parlons · vous parlez · ils ou elles parlent' },
	{ id: 'pronoms-plural', oc: 'nosautres, nosautras · vosautres, vosautras · eles, elas', sound: 'nou-ZAOU-trés, nou-ZAOU-tros · bou-ZAOU-trés, bou-ZAOU-tros · É-lés, É-los', fr: 'nous · vous · eux, elles (pour insister seulement : la fin du verbe suffit)' },
	{ id: 'cantar', oc: 'cantar : canti · cantas · canta · cantam · cantatz · cantan', sound: 'can-TA : CAN-ti · CAN-tos · CAN-to · can-TAN · can-TATS · CAN-ton', fr: 'chanter' },
	{ id: 'manjar', oc: 'manjar : mangi · manjas · manja · manjam · manjatz · manjan', sound: 'man-DJA : MAN-dji · MAN-djos · MAN-djo · man-DJAN · man-DJATS · MAN-djon', fr: 'manger (*mangi* : g devant i)' },
	{ id: 'caminar', oc: 'caminar : camini · caminas · camina · caminam · caminatz · caminan', sound: 'ca-mi-NA : ca-MI-ni · ca-MI-nos · ca-MI-no · ca-mi-NAN · ca-mi-NATS · ca-MI-non', fr: 'marcher' },
	{ id: 'escotar', oc: 'escotar : escoti · escotas · escota · escotam · escotatz · escotan', sound: 'es-cou-TA : es-COU-ti · es-COU-tos · es-COU-to · es-cou-TAN · es-cou-TATS · es-COU-ton', fr: 'écouter' },
	{ id: 'dancar', oc: 'dançar : danci · danças · dança · dançam · dançatz · dançan', sound: 'dan-SA : DAN-si · DAN-sos · DAN-so · dan-SAN · dan-SATS · DAN-son', fr: 'danser (*danci* : c devant i)' },
	{ id: 'cosinar', oc: 'cosinar : cosini · cosinas · cosina · cosinam · cosinatz · cosinan', sound: 'cou-zi-NA : cou-ZI-ni · cou-ZI-nos · cou-ZI-no · cou-zi-NAN · cou-zi-NATS · cou-ZI-non', fr: 'cuisiner' },
	{ id: 'demorar-plural', oc: 'demoram · demoratz · demòran', sound: 'dé-mou-RAN · dé-mou-RATS · dé-MÒ-ron', fr: 'nous habitons · vous habitez · ils ou elles habitent' }
]
```

**Vérification** : ✓ trabalhar, cantar, manjar, caminar, escotar, dançar, nosautres, nosautras, eles, elas (Basic) ; toutes les formes conjuguées, *cosinar* et *fas* ✓ (vèrb'Òc). ⚠️ À VÉRIFIER (dicodòc) : *vosautres, vosautras* (erreur d'appel, en occitan comme en partant du français).
**À gloser en passant** : *l'escòla* ✓, *la botiga* ✓, *l'espital* ✓, *la corala* ✓ ; *nautres · vautres* (se dit aussi, Roergue, Carcin, Albigés, cadre §3) : absents du Basic, à gloser avec ⚠️ ; *estudiar, nadar, ajudar, aimar* ✓ à l'infinitif seulement (*estudii* est inconnu de vèrb'Òc).
**Son du jour** : la syllabe forte des terminaisons : *parlam* « par-LAN », *parlatz* « par-LATS » (la voix appuie sur la fin, comme *anatz* « a-NATS », *apelatz* « a-pé-LATS ») ; *parlan* « PAR-lon », *parlas* « PAR-los » (la voix appuie avant). Piège : *parlam* (nous) et *parlan* (ils).
**Spirale** : `parlar-singular` devient six personnes ; `demori-a` devient *demorar* entier ; la famille (*Mon paire trabalha a Tolosa*) ; `noms-vilas` (*Trabalhi a Besièrs*).

### 4.2 · `4-2` · *Qué fas dins la vida ?* (Que fais-tu dans la vie ?)

**Forme du jour** : *far* au singulier, pour la question ; *soi* + métier, sans article, pour la réponse (*Soi regent*) ; *far de* + métier (*Fau de regent*), calque du catalan absent de la grammaire de référence, retiré le 2026-11-02 ; *dins la vida* en bloc (*dins* s'explique en 7.1). Le féminin des métiers, comme en 2.1 : *-a*, *-ièr → -ièra*, *-aire → -aira*, *-eire → -eira*.
- *far* : *fau, fas, fa* ✓

**À retenir** (14 items ; carte : 12) :

```js
items: [
	{ id: 'far-singular', oc: 'far : fau · fas · fa', sound: 'FA : FAOU · FAS · FA', fr: 'faire : je fais · tu fais · il ou elle fait' },
	{ id: 'que-fas-dins-la-vida', oc: 'Qué fas dins la vida ? · Soi regent.', sound: 'ké FAS dins la BI-do · souï ré-DJÉN', fr: 'que fais-tu dans la vie ? · je suis instituteur (sans article, comme en français)' },
	{ id: 'regent-regenta', oc: 'regent · regenta', sound: 'ré-DJÉN · ré-DJÉN-to', fr: 'instituteur · institutrice' },
	{ id: 'metge', oc: 'mètge', sound: 'MÈ-djé', fr: 'médecin' },
	{ id: 'paisan-paisana', oc: 'paisan · paisana', sound: 'paï-ZA · paï-ZA-no', fr: 'paysan · paysanne' },
	{ id: 'cosinier-cosiniera', oc: 'cosinièr · cosinièra', sound: 'cou-zi-NYÈ · cou-zi-NYÈ-ro', fr: 'cuisinier · cuisinière' },
	{ id: 'infirmier-infirmiera', oc: 'infirmièr · infirmièra', sound: 'in-fir-MYÈ · in-fir-MYÈ-ro', fr: 'infirmier · infirmière' },
	{ id: 'estudiant-estudianta', oc: 'estudiant · estudianta', sound: 'es-tu-DYAN · es-tu-DYAN-to', fr: 'étudiant · étudiante' },
	{ id: 'fornier-forniera', oc: 'fornièr · fornièra', sound: 'four-NYÈ · four-NYÈ-ro', fr: 'boulanger · boulangère' },
	{ id: 'vendeire-vendeira', oc: 'vendeire · vendeira', sound: 'bén-DÉÏ-ré · bén-DÉÏ-ro', fr: 'vendeur · vendeuse' },
	{ id: 'engenhaire-engenhaira', oc: 'engenhaire · engenhaira', sound: 'én-djé-GNAÏ-ré · én-djé-GNAÏ-ro', fr: 'ingénieur · ingénieure' },
	{ id: 'obrier-obriera', oc: 'obrièr · obrièra', sound: 'ou-BRYÈ · ou-BRYÈ-ro', fr: 'ouvrier · ouvrière' },
	{ id: 'vinhairon', oc: 'vinhairon', sound: 'bi-gnaï-ROU', fr: 'vigneron' },
	{ id: 'a-la-retirada', oc: 'Soi a la retirada.', sound: 'souï a la ré-ti-RA-do', fr: 'je suis à la retraite.' }
]
```

**Vérification** : ✓ far, fau, dins, vida, regent(a), mètge, paisan(a), cosinièr(a), infirmièr(a), estudiant(a), fornièr(a), vendeire, vendeira, engenhaire, engenhaira, obrièr(a), vinhairon, retirada (Basic) ; *fas, fa* ✓ (vèrb'Òc). ⚠️ À VÉRIFIER (dicodòc) : le féminin de *mètge* (*mètgessa* absent) et *vinhairona* (absent) : en attendant, ne pas employer de féminin pour ces deux métiers. Écartés car absents du Basic : *botiguièr, pastre* (le Basic donne *pastor*).
**À gloser en passant** : *lo mestièr* ✓ (le métier) ; *mèstre · mèstra* ✓ (se dit aussi pour *regent*, cadre §3) ; *musician · musiciana* ✓ ; *pastor · pastora* ✓ ; *comerçant · comerçanta* ✓ ; *l'escòla, l'espital, la botiga* ✓.
**Son du jour** : le *-r* final ne se dit pas : *cantar* « can-TA », *trabalhar* « tra-ba-LYA », *Montpelhièr* « moun-pé-LYÈ », *cosinièr* « cou-zi-NYÈ ». Mais dans un mot d'une seule syllabe, il se dit : *Bon ser* « bou(n) SÉR » (grammaire de référence, p11 ; choix de Romain le 02-11).
**Spirale** : verbes en *-ar* (*Trabalhi a l'espital*) ; masculin et féminin de 2.1 ; `es-de` ; la famille (*Mon paire fa de fornièr*).

### 4.3 · `4-3` · *Qué fas lo dimenge ?* (Que fais-tu le dimanche ?)

**Forme du jour** : les jours ; *lo dimenge* = le dimanche, chaque dimanche (l'habitude). *jogar* : le *ò* revient quand la voix appuie dessus, et *gu* garde le son « g » devant *i*.
- *jogar* : *jògui, jògas, jòga, jogam, jogatz, jògan* ✓

**À retenir** (11 items ; carte : 10) :

```js
items: [
	{ id: 'diluns', oc: 'diluns', sound: 'di-LUNS', fr: 'lundi' },
	{ id: 'dimars', oc: 'dimars', sound: 'di-MAS', fr: 'mardi' },
	{ id: 'dimecres', oc: 'dimècres', sound: 'di-MÈ-crés', fr: 'mercredi' },
	{ id: 'dijous', oc: 'dijòus', sound: 'di-DJÒOUS', fr: 'jeudi' },
	{ id: 'divendres', oc: 'divendres', sound: 'di-BÉN-drés', fr: 'vendredi' },
	{ id: 'dissabte', oc: 'dissabte', sound: 'di-SAT-té', fr: 'samedi' },
	{ id: 'dimenge', oc: 'dimenge · lo dimenge', sound: 'di-MÉN-djé · lou di-MÉN-djé', fr: 'dimanche · le dimanche (chaque dimanche)' },
	{ id: 'jogar', oc: 'jogar : jògui · jògas · jòga · jogam · jogatz · jògan', sound: 'djou-GA : DJÒ-gui · DJÒ-gos · DJÒ-go · djou-GAN · djou-GATS · DJÒ-gon', fr: 'jouer (*jògui* : le u garde le son « g »)' },
	{ id: 'la-setmana', oc: 'la setmana', sound: 'la sém-MA-no', fr: 'la semaine' },
	{ id: 'amb', oc: 'amb', sound: 'AM(B)', fr: 'avec (*amb mon fraire*)' },
	{ id: 'amic-amiga', oc: 'l’amic · l’amiga · los amics · las amigas', sound: 'la-MIC · la-MI-go · lou-za-MITS · la-za-MI-gos', fr: 'l’ami · l’amie · les amis · les amies' }
]
```

**Vérification** : ✓ diluns, dimars, dimècres, dijòus, divendres, dissabte, dimenge, jogar, jòga, setmana, amb, amic, amiga (Basic) ; jògui, jògas, jogam, jogatz, jògan (vèrb'Òc) ; *amics, amigas* ✓ (pluriel).
**À gloser en passant** : *lo rugbi* ✓, *lo balon* ✓, *las cartas* ✓ (*carta* ✓), *lo balèti* ✓ (le bal), *la corala* ✓.
**Son du jour** : *j*, et *g* devant *e, i*, sonnent « dj » : *dijòus* « di-DJÒOUS », *dimenge* « di-MÉN-djé », *vilatge* « bi-LA-djé », *regent* « ré-DJÉN », *mangi* « MAN-dji ».
**Spirale** : verbes en *-ar* ; `far-singular` (*Qué fa lo dimenge ?*) ; la famille (*amb ma sòrre*) ; `a-deman`, `al-cop-que-ven`.

### 4.4 · `4-4` · tâche · titre proposé *Qué fa lo dimenge ?* (Que fait-il, que fait-elle le dimanche ?)

Aucun mot nouveau. Mobilise 4.1 à 4.3, la famille et les nombres (unité 3), `parlar-singular`. *far* n'est enseigné qu'au singulier : pour le pluriel, passer par les verbes en *-ar* (*Lo dimenge, cantam*). Mémo : `table`.

### Halte 2 · `pausa-2` · *Pausa 2*

Aucun mot nouveau. Un dimanche en famille : âge et nombres (3.1), famille (3.2, 3.3), métiers et activités (4.1 à 4.3), jours (4.3). Bilan : `checklist` et carnet.

---

## Unité 5 · *Al mercat* (scène : le marché)

**Carte de titre (dans 5.1)** : `numero: 5`, bloc *Lo monde a l'entorn* (le monde autour), titre *Al mercat* (au marché), question *Qué i a al mercat ?* (qu'y a-t-il au marché ?).

### 5.1 · `5-1` · *Qué i a al mercat ?* (Qu'y a-t-il au marché ?)

**Forme du jour** : le pluriel : on ajoute *-s* (*l'uòu → los uòus*) ; *-a* devient *-as* (*la poma → las pomas*) ; *la frucha* (les fruits), nom collectif sans pluriel (grammaire de référence p33, choix de Romain du 2026-11-02 ; avant, *las frutas*) ; *un quilò de* + nom ; *al mercat* en bloc (*al* = *a* + *lo*, expliqué en 7.2).

**À retenir** (17 items ; carte : 15) :

```js
items: [
	{ id: 'al-mercat', oc: 'al mercat · lo mercat', sound: 'al mér-CAT · lou mér-CAT', fr: 'au marché · le marché (titre de l’unité)' },
	{ id: 'un-quilo-de', oc: 'un quilò de… · dos quilòs de…', sound: 'un ki-LÒ dé · dous ki-LÒS dé', fr: 'un kilo de… · deux kilos de…' },
	{ id: 'lo-pan', oc: 'lo pan', sound: 'lou PA', fr: 'le pain' },
	{ id: 'lo-formatge', oc: 'lo formatge', sound: 'lou four-MA-djé', fr: 'le fromage' },
	{ id: 'lo-vin', oc: 'lo vin', sound: 'lou BI', fr: 'le vin' },
	{ id: 'l-uou', oc: 'l’uòu · los uòus', sound: 'LUÒOU · lou-ZUÒOUS', fr: 'l’œuf · les œufs' },
	{ id: 'lo-lach', oc: 'lo lach', sound: 'lou LATCH', fr: 'le lait' },
	{ id: 'la-poma', oc: 'la poma · las pomas', sound: 'la POU-mo · las POU-mos', fr: 'la pomme · les pommes' },
	{ id: 'la-pera', oc: 'la pera · las peras', sound: 'la PÉ-ro · las PÉ-ros', fr: 'la poire · les poires' },
	{ id: 'lo-rasim', oc: 'lo rasim', sound: 'lou ra-ZIN', fr: 'le raisin' },
	{ id: 'la-tomata', oc: 'la tomata · las tomatas', sound: 'la tou-MA-to · las tou-MA-tos', fr: 'la tomate · les tomates' },
	{ id: 'la-ceba', oc: 'la ceba · las cebas', sound: 'la SÉ-bo · las SÉ-bos', fr: 'l’oignon · les oignons' },
	{ id: 'l-alh', oc: 'l’alh', sound: 'LAL', fr: 'l’ail' },
	{ id: 'la-salada', oc: 'la salada', sound: 'la sa-LA-do', fr: 'la salade' },
	{ id: 'l-oliva', oc: 'l’oliva · las olivas', sound: 'lou-LI-bo · la-zou-LI-bos', fr: 'l’olive · les olives' },
	{ id: 'la-patana', oc: 'la patana · las patanas', sound: 'la pa-TA-no · las pa-TA-nos', fr: 'la pomme de terre · les pommes de terre' },
	{ id: 'frutas-legums', oc: 'la frucha · los legums', sound: 'la FRU-tcho · lous lé-GUNS', fr: 'les fruits (tous ensemble, sans *-s*) · les légumes' }
]
```

**Vérification** : ✓ mercat, quilò, pan, formatge, vin, uòu, lach, poma, pera, rasim, tomata, ceba, alh, salada, oliva, patana, fruta, legum (Basic), *frucha* ✓ (Basic, 2026-11-02) ; *quilòs, uòus, pomas…* ✓ (pluriel). Le Basic donne *patana* (pas *trufa*) et *crompar* (pas *comprar*).
**À gloser en passant** : *la carn* ✓ (viande), *la salsissa* ✓ (saucisse), *lo caçolet* ✓ ; *crompar* ✓ (acheter) à l'infinitif seulement : *crompi* est inconnu de vèrb'Òc. *mèl* (miel) : erreur d'appel, à éviter.
**Son du jour** : le *-as* final sonne « os » : *pomas* « POU-mos », *peras* « PÉ-ros », *parlas* « PAR-los », *demòras* « dé-MÒ-ros ».
**Spirale** : nombres (*dos quilòs*) ; `i-a`, `un-una-article` ; le féminin en *-a* de 2.1 ; `bonjorn`, `merce`.

### 5.2 · `5-2` · *Quant còsta ?* (Combien ça coûte ?)

**Forme du jour** : les nombres de 20 à 100 ; *còsta* (une chose), *còstan* (plusieurs) ; de 21 à 29 : *vint-e-un, vint-e-dos…* (avec *e*, comme *dètz-e-sèt*). De 31 à 99, hors A1 : *trenta un*, *quaranta dos*…, en deux mots, sans *e* ni trait d'union (grammaire de référence, fixé le 2026-11-02).
- *costar* : *còsta, còstan* ✓

**À retenir** (12 items ; carte : 10) :

```js
items: [
	{ id: 'quant-costa', oc: 'Quant còsta ? · Quant còstan ?', sound: 'KAN CÒS-to · KAN CÒS-ton', fr: 'combien ça coûte ? (une chose) · combien ça coûte ? (plusieurs)' },
	{ id: 'nombre-30', oc: 'trenta', sound: 'TRÉN-to', fr: '30' },
	{ id: 'nombre-40', oc: 'quaranta', sound: 'ka-RAN-to', fr: '40' },
	{ id: 'nombre-50', oc: 'cinquanta', sound: 'sin-KAN-to', fr: '50' },
	{ id: 'nombre-60', oc: 'seissanta', sound: 'séï-SAN-to', fr: '60' },
	{ id: 'nombre-70', oc: 'setanta', sound: 'sé-TAN-to', fr: '70' },
	{ id: 'nombre-80', oc: 'ochanta', sound: 'ou-TCHAN-to', fr: '80' },
	{ id: 'nombre-90', oc: 'nonanta', sound: 'nou-NAN-to', fr: '90' },
	{ id: 'nombre-100', oc: 'cent', sound: 'SÉN', fr: '100' },
	{ id: 'vint-e-un', oc: 'vint-e-un · vint-e-dos · vint-e-tres', sound: 'bin-té-U(N) · bin-té-DOUS · bin-té-TRÉS', fr: '21 · 22 · 23, et ainsi de suite jusqu’à 29 (avec e, comme *dètz-e-sèt*)' },
	{ id: 'euro-centim', oc: 'un euro · dos euros · un centim · dos centims', sound: 'u-NÉOU-rou · dou-ZÉOU-rous · un sén-TIN · dous sén-TINS', fr: 'un euro · deux euros · un centime · deux centimes' },
	{ id: 'vaqui', oc: 'Vaquí !', sound: 'ba-KI', fr: 'voilà ! (en tendant quelque chose)' }
]
```

**Vérification** : ✓ quant, trenta, quaranta, cinquanta, seissanta, setanta, ochanta, nonanta, euro, centim, còsta, vaquí (Basic ; *ochanta* confirmé aussi pour « quatre-vingts ») ; *còstan* ✓ (vèrb'Òc) ; *euros, centims* ✓ (pluriel). ⚠️ À VÉRIFIER (dicodòc) : *cent* (erreur d'appel dans les deux sens ; déjà signalé par la carte).
**À éviter** : les nombres de 31 à 99 qui ne sont pas des dizaines, tant que Romain n'a pas tranché la forme (voir les doutes) : prix ronds, ou de 21 à 29.
**À gloser en passant** : *car · cara* ✓ (cher, chère : *Es car !*). *Quant fa ?* (combien ça fait ?) n'a que des mots connus.
**Son du jour** : distinguer à l'oreille : *tres* « TRÉS » et *trenta* « TRÉN-to » ; *quatre* « KA-tré » et *quaranta* « ka-RAN-to » ; *cinc* « SINK » et *cinquanta* « sin-KAN-to » ; *sèt* « SÈT » et *setanta* « sé-TAN-to ».
**Spirale** : nombres de 0 à 20 ; produits de 5.1 ; `far-singular` (*Quant fa ?*) ; `podes-repetir`.

### 5.3 · `5-3` · *Qué vòls ?* (Que veux-tu ?)

**Forme du jour** : *voler* et *poder* au singulier ; *Volriái…* (je voudrais) en bloc ; *m'agrada* (ça me plaît), *m'agradan* devant un pluriel.
- *voler* : *vòli, vòls, vòl* ✓ (et *volètz*, vous voulez ✓)
- *poder* : *pòdi, pòdes, pòt* ✓
- *volriái* ✓ (conditionnel, je) ; *agradar* : *agrada, agradan* ✓

**À retenir** (8 items ; carte : 8) :

```js
items: [
	{ id: 'que-vols', oc: 'Qué vòls ? · Qué volètz ?', sound: 'ké BÒLS · ké bou-LÈTS', fr: 'que veux-tu ? · que voulez-vous ?' },
	{ id: 'voler-singular', oc: 'voler : vòli · vòls · vòl', sound: 'bou-LÉ : BÒ-li · BÒLS · BÒL', fr: 'vouloir : je veux · tu veux · il ou elle veut' },
	{ id: 'poder-singular', oc: 'poder : pòdi · pòdes · pòt', sound: 'pou-DÉ : PÒ-di · PÒ-dés · PÒT', fr: 'pouvoir : je peux · tu peux · il ou elle peut' },
	{ id: 'volriai', oc: 'Volriái…', sound: 'boul-RYOÏ', fr: 'je voudrais… (plus poli que *Vòli*)' },
	{ id: 'se-vos-plai', oc: 'Se vos plai.', sound: 'sé bous PLAÏ', fr: 's’il vous plaît. (à un ami : *se te plai*)' },
	{ id: 'm-agrada', oc: 'M’agrada… · M’agradan… · T’agrada ?', sound: 'ma-GRA-do · ma-GRA-don · ta-GRA-do', fr: 'j’aime… (une chose) · j’aime… (plusieurs) · tu aimes ? (*Non m’agrada pas* : je n’aime pas)' },
	{ id: 'quicom-mai', oc: 'Quicòm mai ? · Es tot.', sound: 'ki-CÒM MAÏ · és TOUT', fr: 'autre chose ? · c’est tout.' },
	{ id: 'de-res', oc: 'Mercés ! · De res.', sound: 'mér-SÉS · dé RÉS', fr: 'merci ! · de rien.' }
]
```

**Vérification** : ✓ voler, poder, pòt, res, tot, quicòm, mai (Basic) ; vòli, vòls, volètz, pòdi, pòdes, volriái, agrada, agradan, plai (vèrb'Òc) ; *se, vos, m', t'* : outils.
**À gloser en passant** : *crompar* ✓ (infinitif seulement), *fòrça* ✓ (beaucoup : *M'agrada fòrça*), *bon · bona* ✓ (*Es bon !*).
**Son du jour** : *ò* sonne « o », *o* sonne « ou », dans le même verbe : *vòli* « BÒ-li » et *voler* « bou-LÉ » ; *pòdi* « PÒ-di » et *poder* « pou-DÉ » ; aussi *còsta* « CÒS-to », *sòrre* « SÒ-rré ».
**Spirale** : produits et prix (5.1, 5.2) ; `podes-repetir` (*se te plai*) ; `bonjorn`, `merce`, `adieu-siatz` (on vouvoie le marchand) ; `pas`.

### 5.4 · `5-4` · tâche · titre proposé *Quicòm mai ?* (Autre chose ?)

Aucun mot nouveau. Jeu de rôle du client (8 répliques). Mobilise : salutations et vouvoiement (1.1), nombres (3.1, 5.2), produits (5.1), `quant-costa`, `vaqui`, `euro-centim`, toute l'unité 5.3. Mémo : `table`.

---

## Unité 6 · *La jornada* (scène : une journée, du matin au soir)

**Carte de titre (dans 6.1)** : `numero: 6`, bloc *Lo monde a l'entorn*, titre *La jornada* (la journée), question *Quina ora es ?* (quelle heure est-il ?).

### 6.1 · `6-1` · *Quina ora es ?* (Quelle heure est-il ?)

**Forme du jour** : *Es una ora* (une heure : singulier) ; *Son doas oras, son tres oras…* (*son* : ils sont) ; *… e quart*, *… e mièja*, *… mens lo quart* ; *a* + heure (*a sèt oras*).

**À retenir** (9 items ; carte : 8) :

```js
items: [
	{ id: 'la-jornada', oc: 'la jornada', sound: 'la djour-NA-do', fr: 'la journée (titre de l’unité)' },
	{ id: 'quina-ora-es', oc: 'Quina ora es ?', sound: 'KI-no OU-ro ÉS', fr: 'quelle heure est-il ?' },
	{ id: 'es-una-ora', oc: 'Es una ora.', sound: 'é-ZU-no OU-ro', fr: 'il est une heure.' },
	{ id: 'son-doas-oras', oc: 'Son doas oras. · Son tres oras.', sound: 'soun DOUOS OU-ros · soun TRÉ-zou-ros', fr: 'il est deux heures. · il est trois heures. (*son* : ils sont, elles sont)' },
	{ id: 'e-mieja', oc: '… e mièja', sound: 'é MYÈ-djo', fr: '… et demie' },
	{ id: 'e-quart', oc: '… e quart · … mens lo quart', sound: 'é KART · méns lou KART', fr: '… et quart · … moins le quart' },
	{ id: 'miegjorn', oc: 'miègjorn · mièjanuèch', sound: 'myèd-DJOUR · myè-dja-NUÈTCH', fr: 'midi · minuit' },
	{ id: 'a-quina-ora', oc: 'A quina ora ? · A sèt oras.', sound: 'a KI-no OU-ro · a SÈ-tou-ros', fr: 'à quelle heure ? · à sept heures.' },
	{ id: 'ara', oc: 'ara', sound: 'A-ro', fr: 'maintenant' }
]
```

**Vérification** : ✓ jornada, ora, una, doas, tres, son, mièja, quart, mens, miègjorn, mièjanuèch, ara (Basic) ; *oras* ✓ (pluriel). *mens lo quart* : les deux mots sont ✓, la tournure est à confirmer (voir les doutes).
**Son du jour** : *o* sans accent sonne « ou » : *ora* « OU-ro », *dos* « DOUS », *poma* « POU-mo », *Tolosa* « tou-LOU-zo ».
**Spirale** : nombres ; `bonjorn`, `bon-ser`, `a-deman` ; jours (*Dijòus, a uèch oras*) ; verbes en *-ar* (*Trabalhi a nòu oras*).

### 6.2 · `6-2` · *Quin temps fa ?* (Quel temps fait-il ?)

**Forme du jour** : *fa* + temps (*Fa caud, fa freg, fa bèl, fa solelh, fa vent*) ; deux verbes à part : *Plòu* (il pleut), *Nèva* (il neige).
- *far* : *fa* ✓ ; *plòure* : *plòu* ✓ ; *nevar* : *nèva* ✓

**À retenir** (11 items ; carte : 10) :

```js
items: [
	{ id: 'quin-temps-fa', oc: 'Quin temps fa ?', sound: 'kin TÉMS FA', fr: 'quel temps fait-il ?' },
	{ id: 'fa-caud', oc: 'Fa caud.', sound: 'fa CAOUT', fr: 'il fait chaud.' },
	{ id: 'fa-freg', oc: 'Fa freg.', sound: 'fa FRÉTCH', fr: 'il fait froid.' },
	{ id: 'fa-bel', oc: 'Fa bèl.', sound: 'fa BÈL', fr: 'il fait beau.' },
	{ id: 'fa-solelh', oc: 'Fa solelh.', sound: 'fa sou-LÉL', fr: 'il y a du soleil (*lo solelh* : le soleil).' },
	{ id: 'fa-vent', oc: 'Fa vent.', sound: 'fa BÉN', fr: 'il y a du vent (*lo vent* : le vent).' },
	{ id: 'plou', oc: 'Plòu.', sound: 'PLÒOU', fr: 'il pleut.' },
	{ id: 'neva', oc: 'Nèva.', sound: 'NÈ-bo', fr: 'il neige.' },
	{ id: 'la-plueja', oc: 'la pluèja', sound: 'la PLUÈ-djo', fr: 'la pluie' },
	{ id: 'la-neu', oc: 'la nèu', sound: 'la NÈOU', fr: 'la neige' },
	{ id: 'uei', oc: 'uèi', sound: 'UÈÏ', fr: 'aujourd’hui (*Uèi, plòu. Deman, fa solelh.*)' }
]
```

**Vérification** : ✓ temps, caud, freg, bèl, solelh, vent, pluèja, nèu (Basic) ; plòu, nèva, fa (vèrb'Òc) ; *uèi* ✓ (forme validée par Romain, acceptée par le script).
**À gloser en passant** : *lo cèl* ✓ (le ciel) ; *lo mistral* ✓ ; *nívol* ✓ (nuage), à gloser seul, sans article. *cèrs, autan* : ⚠️ absents du Basic et de vèrb'Òc, à écrire en français dans la note culture (comme `visio-A1.md`).
**Son du jour** : *òu* et *èu* : *plòu* « PLÒOU », *nèu* « NÈOU », *lèu* « LÈOU », *nòu* « NÒOU », *dijòus* « di-DJÒOUS ».
**Spirale** : `far-singular` ; jours (*Dimenge, plòu*) ; `a-deman` ; heures (6.1).

### 6.3 · `6-3` · *A quina ora te lèvas ?* (À quelle heure te lèves-tu ?)

**Forme du jour** : *Me lèvi, te lèvas, se lèva* en bloc (le verbe *levar* avec *me, te, se*) ; la journée dans l'ordre : *lo matin, a miègjorn, lo tantòst, lo ser* ; *puèi* (ensuite).
- *levar* : *lèvi, lèvas, lèva* ✓ ; *dejunar* : *dejuni* ✓ ; *dinnar* : *dinni, dinna* ✓ ; *sopar* : *sopi* ✓

**À retenir** (11 items ; carte : 10) :

```js
items: [
	{ id: 'me-levi', oc: 'Me lèvi · te lèvas · se lèva', sound: 'mé LÈ-bi · té LÈ-bos · sé LÈ-bo', fr: 'je me lève · tu te lèves · il ou elle se lève' },
	{ id: 'lo-matin', oc: 'lo matin', sound: 'lou ma-TI', fr: 'le matin' },
	{ id: 'lo-tantost', oc: 'lo tantòst', sound: 'lou tan-TÒST', fr: 'l’après-midi' },
	{ id: 'lo-ser', oc: 'lo ser', sound: 'lou SÉR', fr: 'le soir' },
	{ id: 'dejunar', oc: 'dejunar : dejuni · dejuna', sound: 'dé-dju-NA : dé-DJU-ni · dé-DJU-no', fr: 'prendre le petit déjeuner : je le prends · il ou elle le prend' },
	{ id: 'dinnar', oc: 'dinnar : dinni · dinna', sound: 'di-NA : DI-ni · DI-no', fr: 'déjeuner, le repas de midi : je déjeune · il ou elle déjeune' },
	{ id: 'sopar', oc: 'sopar : sopi · sopa', sound: 'sou-PA : SOU-pi · SOU-po', fr: 'dîner, le repas du soir : je dîne · il ou elle dîne' },
	{ id: 'vau-al-liech', oc: 'Vau al lièch.', sound: 'baou al LYÈTCH', fr: 'je vais au lit (*lo lièch* : le lit).' },
	{ id: 'vau-al-trabalh', oc: 'Vau al trabalh.', sound: 'baou al tra-BAL', fr: 'je vais au travail (*lo trabalh* : le travail).' },
	{ id: 'puei', oc: 'puèi', sound: 'PUÈÏ', fr: 'puis, ensuite' },
	{ id: 'totjorn', oc: 'totjorn', sound: 'tout-DJOUR', fr: 'toujours' }
]
```

**Vérification** : ✓ levar, matin, tantòst, dejunar, dinnar, lièch, trabalh, puèi, totjorn (Basic) ; lèvi, lèvas, lèva, dejuni, dinni, dinna, sopi (vèrb'Òc) ; *sopar* ✓ (vèrb'Òc : l'appel au Basic a planté) ; *dejuna, sopa* ✓ (formes régulières, comme *dejuni, sopi* ; le Basic les connaît aussi comme *dejun* « à jeun » et *sopa* « soupe »). Écartés : *dinar* (inconnu), *d'abòrd, cada, après* (absents ou erreur d'appel).
**À gloser en passant** : *colcar, jaire* ✓ (se coucher) à l'infinitif seulement.
**Son du jour** : le *v* sonne « b », revu : *lèvi* « LÈ-bi », *nèva* « NÈ-bo », *vint* « BIN », *vin* « BI ».
**Spirale** : `a-quina-ora`, heures ; verbes en *-ar* (*Trabalhi, manjam*) ; jours ; *me, te* de 1.2 (*Me dison* puis *Me lèvi*).

### 6.4 · `6-4` · tâche · titre proposé *E ta jornada ?* (Et ta journée ?)

Aucun mot nouveau. Mobilise 6.1 à 6.3, verbes en *-ar* (4.1), jours (4.3), famille (3.2), météo (6.2). Fluidité 40, 30, 20 secondes. Mémo : `table`.

### Halte 3 · `pausa-3` · *Pausa 3*

Aucun mot nouveau. Une journée de marché, du départ au retour : heures (6.1), temps (6.2), journée (6.3), produits, prix, demandes polies (5.1 à 5.3). Bilan : `checklist` et carnet.

---

## Unité 7 · *L'ostal* (scène : la maison de Marià)

**Carte de titre (dans 7.1)** : `numero: 7`, bloc *Lo monde a l'entorn*, titre *L'ostal* (la maison), question *Qué i a dins l'ostal ?* (qu'y a-t-il dans la maison ?).

### 7.1 · `7-1` · *Qué i a dins l'ostal ?* (Qu'y a-t-il dans la maison ?)

**Forme du jour** : *i a* + nom (revu de 3.3) ; *dins* (dans), vu en bloc en 4.2 ; *l'* devant une voyelle (*l'ostal, l'armari*).

**À retenir** (13 items ; carte : 12) :

```js
items: [
	{ id: 'l-ostal', oc: 'l’ostal', sound: 'lous-TAL', fr: 'la maison, et ceux qui y vivent (titre de l’unité)' },
	{ id: 'dins', oc: 'dins', sound: 'DINS', fr: 'dans (*dins la vida*, *dins la cosina*)' },
	{ id: 'la-cosina', oc: 'la cosina', sound: 'la cou-ZI-no', fr: 'la cuisine (le même mot que la cousine !)' },
	{ id: 'la-cambra', oc: 'la cambra', sound: 'la CAM-bro', fr: 'la chambre' },
	{ id: 'la-sala', oc: 'la sala', sound: 'la SA-lo', fr: 'la salle, le séjour' },
	{ id: 'la-sala-de-banh', oc: 'la sala de banh', sound: 'la SA-lo dé BAN', fr: 'la salle de bain' },
	{ id: 'la-taula', oc: 'la taula', sound: 'la TAOU-lo', fr: 'la table' },
	{ id: 'la-cadiera', oc: 'la cadièra', sound: 'la ca-DYÈ-ro', fr: 'la chaise' },
	{ id: 'lo-canape', oc: 'lo canapè', sound: 'lou ca-na-PÈ', fr: 'le canapé' },
	{ id: 'l-armari', oc: 'l’armari', sound: 'lar-MA-ri', fr: 'l’armoire' },
	{ id: 'la-porta', oc: 'la pòrta', sound: 'la PÒR-to', fr: 'la porte' },
	{ id: 'la-fenestra', oc: 'la fenèstra', sound: 'la fé-NÈS-tro', fr: 'la fenêtre' },
	{ id: 'lo-jardin', oc: 'lo jardin', sound: 'lou djar-DI', fr: 'le jardin' }
]
```

**Vérification** : ✓ ostal, dins, cosina, cambra, sala, banh, taula, cadièra, canapè, armari, pòrta, fenèstra, jardin (Basic ; *cosina* est donné pour « cuisine », *cosin* pour « cousin, cousine »).
**À gloser en passant** : *lo mas* (la ferme ; même forme que *mas*, mais, appris en 2.2) ; *lo lièch* est appris en 6.3 ; *lo cantou* : ⚠️ absent du Basic, à éviter.
**Son du jour** : le *-l* final se dit « l » : *ostal* « ous-TAL », *espanhòl* « es-pa-GNÒL », *aucèl* « aou-SÈL », *caval* « ca-BAL ». (Dans d'autres dialectes, il sonne « ou » : *ostau*, forme absente du Basic languedocien, à gloser dans l'encart *Alhors*.)
**Spirale** : `i-a`, animaux (*Lo cat es dins la cambra*) ; `que-fas-dins-la-vida` (*dins*) ; famille ; `dejunar` (*Dejuni dins la cosina*).

### 7.2 · `7-2` · *Ont es ?* (Où est-ce ?)

**Forme du jour** : *sus* (sur), *jos* (sous), *davant* (devant), *darrièr* (derrière), *al costat de* (à côté de), *entre* ; les petits mots qui se soudent : *a + lo = al*, *de + lo = del*, *a + los = als*, *de + los = dels*, *sus + lo = sul*, *sus + los = suls* (ajouté le 2026-11-02, grammaire de référence) ; la soudure est obligatoire avec *a* et *de*, au choix avec *sus* et *jos* (*sus lo canapè*, *jol canapè* : p21, choix de Romain du 2026-11-02) ; devant *la*, rien ne change (*a la, de la, sus la*).

**À retenir** (7 items ; carte : 8) :

```js
items: [
	{ id: 'sus-sul', oc: 'sus · sul · suls', sound: 'SUS · SUL · SULS', fr: 'sur · sur le · sur les (*sul* = *sus* + *lo* ; *suls* = *sus* + *los*)' },
	{ id: 'jos', oc: 'jos', sound: 'DJOUS', fr: 'sous' },
	{ id: 'davant', oc: 'davant', sound: 'da-BAN', fr: 'devant' },
	{ id: 'darrier', oc: 'darrièr', sound: 'da-RRYÈ', fr: 'derrière' },
	{ id: 'al-del', oc: 'al · del · als · dels', sound: 'AL · DÉL · ALS · DÉLS', fr: 'au · du · aux · des (*al* = a + *lo* ; *del* = *de* + *lo*)' },
	{ id: 'al-costat-de', oc: 'al costat de…', sound: 'al cous-TAT dé', fr: 'à côté de…' },
	{ id: 'entre', oc: 'entre', sound: 'ÉN-tré', fr: 'entre' }
]
```

**Vérification** : ✓ sus, jos, als, dels, costat, entre (Basic). ⚠️ À VÉRIFIER (dicodòc) : *davant, darrièr* (erreur d'appel dans les deux sens ; déjà signalés par la carte) ; *sul* et *suls* (absents du Basic, qui ne donne pas les contractions ; le cadre §3 cite *sul* ; la grammaire de référence emploie les deux, 2026-11-02) ; *jol* (signalé dans une note le 2026-11-02 : grammaire de référence p21 ; absent du Basic et de dicodòc, qui ne donnent pas les contractions) ; *canapès* (pluriel régulier en *-s*, grammaire de référence).
**Son du jour** : *al* et *del* se lient au mot qui suit : *al còp que ven* « al COP qué BÈN », *del vilatge* « dél bi-LA-djé », *al mercat* « al mér-CAT », *al lièch* « al LYÈTCH ».
**Spirale** : pièces et meubles de 7.1 ; animaux (*Ont es lo cat ? Es jos la taula.*) ; `soi-d-aqui` (*aquí*) ; *ont*.

### 7.3 · `7-3` · *De quina color es ?* (De quelle couleur est-ce ?)

**Forme du jour** : l'accord, revu (2.1) : les couleurs suivent le nom et prennent *-a* au féminin (*un can blanc, una cata blanca*) ; attention à *roge → roja*, *blau → blava*, *nòu → nòva*. La taille et l'âge se placent aussi d'habitude après le nom : *un ostal vièlh* (grammaire de référence, ajouté le 2026-11-02) ; devant le nom, le sens change (pas avant l'A2).

**À retenir** (12 items ; carte : 10) :

```js
items: [
	{ id: 'la-color', oc: 'la color', sound: 'la cou-LOU', fr: 'la couleur' },
	{ id: 'roge-roja', oc: 'roge · roja', sound: 'ROU-djé · ROU-djo', fr: 'rouge (au masculin · au féminin)' },
	{ id: 'blau-blava', oc: 'blau · blava', sound: 'BLAOU · BLA-bo', fr: 'bleu · bleue' },
	{ id: 'verd-verda', oc: 'verd · verda', sound: 'BÉRT · BÉR-do', fr: 'vert · verte' },
	{ id: 'jaune-jauna', oc: 'jaune · jauna', sound: 'DJAOU-né · DJAOU-no', fr: 'jaune (au masculin · au féminin)' },
	{ id: 'negre-negra', oc: 'negre · negra', sound: 'NÉ-gré · NÉ-gro', fr: 'noir · noire' },
	{ id: 'blanc-blanca', oc: 'blanc · blanca', sound: 'BLANK · BLAN-co', fr: 'blanc · blanche' },
	{ id: 'gris-grisa', oc: 'gris · grisa', sound: 'GRIS · GRI-zo', fr: 'gris · grise' },
	{ id: 'grand-granda', oc: 'grand · granda', sound: 'GRAN · GRAN-do', fr: 'grand · grande' },
	{ id: 'pichon-pichona', oc: 'pichon · pichona', sound: 'pi-TCHOU · pi-TCHOU-no', fr: 'petit · petite' },
	{ id: 'vielh-vielha', oc: 'vièlh · vièlha', sound: 'BYÈL · BYÈ-lyo', fr: 'vieux · vieille' },
	{ id: 'nou-nova', oc: 'nòu · nòva', sound: 'NÒOU · NÒ-bo', fr: 'neuf, nouveau · neuve, nouvelle (comme le nombre 9 !)' }
]
```

**Vérification** : ✓ color, roge, roja, blau, blava, verd, verda, jaune, jauna, negre, negra, blanc, blanca, gris, grisa, pichon, pichona, vièlh, vièlha, nòva (Basic). ⚠️ À VÉRIFIER (dicodòc) : *grand, granda* (absents ; « grand » sans traduction ; déjà signalé par la carte).
**À gloser en passant** : *aur* ✓ (or) et *la crotz* ✓ (la croix) : *la crotz d'aur*, pour les couleurs occitanes.
**À éviter** : le pluriel des adjectifs (*blaus, blavas*), non listé.
**Son du jour** : la consonne du bout. Elle se tait dans *grand* « GRAN », *jardin* « djar-DI », et revient au féminin : *granda* « GRAN-do ». Elle se dit dans *blanc* « BLANK », comme *cinc* « SINK » (*-nc* final, grammaire de référence p16, tranché le 2026-11-02), puis *blanca* « BLAN-co ». Après *r*, le *d* final sonne « t » : *verd* « BÉRT », *verda* « BÉR-do » (grammaire de référence ; tranché le 2026-11-02).
**Spirale** : masculin et féminin de 2.1 ; objets de 7.1 (*la pòrta blava*) ; animaux (*un cat negre*) ; `sus-sul`.

### 7.4 · `7-4` · tâche · titre proposé *E ton ostal ?* (Et ta maison ?)

Aucun mot nouveau. Mobilise 7.1 à 7.3, `i-a` et les nombres (*I a tres cambras*), la famille (qui vit là). Mémo : `table`.

---

## Unité 8 · *En vila* (scène : la ville, de la gare au café)

**Carte de titre (dans 8.1)** : `numero: 8`, bloc *Lo monde a l'entorn*, titre *En vila* (en ville), question *Ont es la gara ?* (où est la gare ?).

### 8.1 · `8-1` · *Ont es la gara ?* (Où est la gare ?)

**Forme du jour** : *a drecha* (à droite), *a esquèrra* (à gauche), *tot drech* (tout droit) ; *Es luènh ? · Es prèp.*

**À retenir** (9 items ; carte : 8) :

```js
items: [
	{ id: 'la-gara', oc: 'la gara', sound: 'la GA-ro', fr: 'la gare' },
	{ id: 'la-carriera', oc: 'la carrièra', sound: 'la ca-RRYÈ-ro', fr: 'la rue' },
	{ id: 'la-placa', oc: 'la plaça', sound: 'la PLA-ço', fr: 'la place' },
	{ id: 'la-gleisa', oc: 'la glèisa', sound: 'la GLÈÏ-zo', fr: 'l’église' },
	{ id: 'a-drecha', oc: 'a drecha', sound: 'a DRÉ-tcho', fr: 'à droite' },
	{ id: 'a-esquerra', oc: 'a esquèrra', sound: 'a es-KÈ-rro', fr: 'à gauche' },
	{ id: 'tot-drech', oc: 'tot drech', sound: 'tout DRÉTCH', fr: 'tout droit' },
	{ id: 'es-luenh', oc: 'Es luènh ? · Es prèp.', sound: 'és LUÈN · és PRÈP', fr: 'c’est loin ? · c’est près.' },
	{ id: 'perdon', oc: 'Perdon…', sound: 'pér-DOU', fr: 'pardon…, excuse-moi… (pour aborder quelqu’un)' }
]
```

**Vérification** : ✓ gara, carrièra, plaça, glèisa, drecha, esquèrra, tot, drech, luènh, prèp, perdon (Basic).
**À gloser en passant** : *lo pont* ✓ ; *Benvengut ! · Benvenguda !* ✓ (bienvenue). À éviter : *la mairia*, *lo metro* (absents du Basic), *fins a* (absent).
**Son du jour** : *ch* sonne « tch » : *drecha* « DRÉ-tcho », *drech* « DRÉTCH », *uèch* « UÈTCH », *lach* « LATCH », *lièch* « LYÈTCH ».
**Spirale** : `davant`, `darrier`, `al-costat-de` (*La gara es darrièr la glèisa*) ; `vilatge-vila-pais`, `noms-vilas` ; `podes-repetir`, `sabi-pas` ; `bonjorn`, `merce`.

### 8.2 · `8-2` · *Cossí i vau ?* (Comment j'y vais ?)

**Forme du jour** : *anar* au singulier : *vau, vas, va* (déjà entendus dans *Vau plan*, *Cossí vas ?*, *Va plan* : c'est le verbe aller) ; *i* (y) ; deux ordres en bloc : *Vira…* (tourne), *Pren…* (prends).
- *anar* : *vau, vas, va* ✓ ; *virar* : *vira* (ordre) ✓ ; *prene* : *pren* (ordre) ✓

**À retenir** (6 items ; carte : 6) :

```js
items: [
	{ id: 'cossi-i-vau', oc: 'Cossí i vau ?', sound: 'cou-si i BAOU', fr: 'comment j’y vais ? (*i* : y)' },
	{ id: 'anar-singular', oc: 'anar : vau · vas · va', sound: 'a-NA : BAOU · BAS · BA', fr: 'aller : je vais · tu vas · il ou elle va (comme dans *Vau plan* et *Cossí vas ?*)' },
	{ id: 'vira', oc: 'Vira a drecha ! · Vira a esquèrra !', sound: 'BI-ro a DRÉ-tcho · BI-ro a es-KÈ-rro', fr: 'tourne à droite ! · tourne à gauche !' },
	{ id: 'pren', oc: 'Pren la carrièra…', sound: 'PRÉ(N) la ca-RRYÈ-ro', fr: 'prends la rue…' },
	{ id: 'primier-segond', oc: 'lo primièr · la primièra · lo dosen · la dosena', sound: 'lou pri-MYÈ · la pri-MYÈ-ro · lou dou-ZÉN · la dou-ZÉ-no', fr: 'le premier · la première · le deuxième · la deuxième (*lo segond*, *la segonda* : le second, quand il n’y en a que deux)' },
	{ id: 'a-pe', oc: 'a pè', sound: 'a PÈ', fr: 'à pied' }
]
```

**Vérification** : ✓ anar, primièr, primièra, segond, segonda, pè (Basic) ; ⚠️ *dosen, dosena* (grammaire de référence p52, choix de Romain du 2026-11-02) : absents du Basic, dicodòc (Laus) ✓ ; vira, pren (vèrb'Òc) ; *vau, vas, va* ✓ (unité 1, cours 0).
**À éviter** : le pluriel d'*anar* (seul *anatz* est connu, depuis 1.1).
**Son du jour** : la syllabe forte, revue : *vira* « BI-ro », *anar* « a-NA », *carrièra* « ca-RRYÈ-ro », *esquèrra* « es-KÈ-rro », *primièra* « pri-MYÈ-ro ».
**Spirale** : 8.1 ; `vau-plan`, `cossi-vas`, `va-plan-e-tu` ; nombres (*dos* et *la dosena*) ; `i-a` (*i*).

### 8.3 · `8-3` · *Qué prenes ?* (Que prends-tu ?)

**Forme du jour** : *prene* au singulier (forme des dictionnaires languedociens, Laus et Lagarde ; le livre écrit *préner*, p94, que dicodòc ne donne qu'en gascon : une note du 8.3 le fait reconnaître, choix de Romain du 2026-11-02).
- *prene* : *preni, prenes, pren* ✓

**À retenir** (9 items ; carte : 8) :

```js
items: [
	{ id: 'prene-singular', oc: 'prene : preni · prenes · pren', sound: 'PRÉ-né : PRÉ-ni · PRÉ-nés · PRÉ(N)', fr: 'prendre : je prends · tu prends · il ou elle prend' },
	{ id: 'un-cafe', oc: 'un cafè · lo cafè', sound: 'un ca-FÈ · lou ca-FÈ', fr: 'un café · le café (la boisson, et aussi le lieu)' },
	{ id: 'l-aiga', oc: 'l’aiga', sound: 'LAÏ-go', fr: 'l’eau' },
	{ id: 'un-te', oc: 'un tè', sound: 'un TÈ', fr: 'un thé' },
	{ id: 'suc-de-fruta', oc: 'un suc de frucha', sound: 'un SUC dé FRU-tcho', fr: 'un jus de fruit' },
	{ id: 'un-veire-de', oc: 'un veire de…', sound: 'un BÉÏ-ré dé', fr: 'un verre de… (*un veire d’aiga*)' },
	{ id: 'per-ieu', oc: 'Per ieu, …', sound: 'pér YÉOU', fr: 'pour moi, … (pour commander)' },
	{ id: 'l-addicion', oc: 'L’addicion, se vos plai.', sound: 'la-di-SYOU, sé bous PLAÏ', fr: 'l’addition, s’il vous plaît.' },
	{ id: 'ai-set', oc: 'Ai set.', sound: 'aï SÉT', fr: 'j’ai soif. (*set*, la soif, ne se dit pas comme *sèt*, sept)' }
]
```

**Vérification** : ✓ prene, cafè, aiga, tè, suc, fruta, veire, per, addicion, set (Basic) ; preni, prenes, pren (vèrb'Òc). Le 2026-11-02 : *frucha* ✓ (Basic) remplace *fruta* ; *préner* (grammaire de référence p94), absent du Basic et des dictionnaires languedociens de dicodòc, est seulement à reconnaître.
**À gloser en passant** : *la nòta* ✓ (se dit aussi pour l'addition), *la bièrra* ✓, *lo chocolat* ✓, *lo sucre* ✓ ; *amb de lach* n'a que des mots connus.
**Son du jour** : *é* et *è*, revus : *set* « SÉT » (la soif) et *sèt* « SÈT » (sept) ; *cafè* « ca-FÈ », *tè* « TÈ » ; *prenes* « PRÉ-nés », *veire* « BÉÏ-ré ».
**Spirale** : `volriai`, `se-vos-plai`, `que-vols` ; `quant-costa`, `euro-centim` ; `lo-lach`, `lo-vin` ; `fa-caud` (*Fa caud : ai set*) ; `merce`.

### 8.4 · `8-4` · tâche · titre proposé *Per tu, un cafè ?* (Pour toi, un café ?)

Aucun mot nouveau. Accueillir un visiteur : saluer et se présenter (unité 1), le chemin (8.1, 8.2), le café (8.3), le temps qu'il fait (6.2), les prix (5.2). Mémo : `table`.

### Halte 4 · `pausa-4` · *Pausa 4*

Aucun mot nouveau. Un visiteur à accompagner dans la ville : maison et objets (unité 7), chemin et café (unité 8). Bilan de tout le carnet de l'A1.

### Mission A1 · `mission-a1` · *Mission A1* (glose *mission*)

Aucun mot nouveau. Lire une affiche de fête : jours (4.3), heures (6.1), prix (5.2), lieux (8.1 : *la plaça, la glèisa*) ; *la fèsta* (glosée en 1.2) et *lo balèti* (à gloser). Écouter un message : salutations (1.1), heure, temps qu'il fait, chemin. Présenter en visio ce qu'on propose au visiteur : unités 1, 2, 7, 8. Écrire un court message : *Adieu ! … A deman !*, *Al còp que ven !*.

---

## Mots outils : où ils s'apprennent

| Mot | Module | | Mot | Module |
|---|---|---|---|---|
| *e* (et), *a* (à), *al* (bloc), *que* (seulement dans *Al còp que ven*) | 1.1 | | *amb* (avec) | 4.3 |
| *de, d', del* (bloc) ; *lo, la* ; *ont* ; *aquí* | 1.3 | | *dins* | 4.2 (bloc), 7.1 |
| *òc, non* ; *el, ela* | 2.1 | | *sus, sul, jos, davant, darrièr, entre, al costat de* ; *al, del, als, dels* expliqués | 7.2 |
| *non… pas, mas, tanben, un pauc* | 2.2 | | *puèi, totjorn, ara, uèi* | 6.1 à 6.3 |
| *qué, qual, quin, quina, aquò, o* (ou), *en*, *se* | 2.3 | | *son* (ils sont) | 6.1 |
| *quant* (bloc) ; *un, una* | 3.1 | | *i* (y) ; *anar* | 8.2 (*i* dès 3.3 dans *i a*) |
| *l', los, las* ; *mon, ma, ton, ta* | 3.2 | | *per* (pour) | 8.3 |
| *i a* ; *pas de* | 3.3 | | *tot* (*Es tot*, *tot drech*), *mai* (*Quicòm mai*) | 5.3, 8.1 |
| *nosautres, vosautres, eles, elas* | 4.1 | | | |

**Pas enseigné en A1 (à éviter, ou à gloser)** : *èsser* au pluriel sauf *son* (*sèm, sètz*) ; *aver, far, anar, voler, poder, prene* au pluriel (sauf *anatz* et *volètz*) ; *mos, mas, tos, tas, son, sa* (possessifs) ; *aquel, aquela, aqueste* ; *li, lor, ne* ; *s'apèla* ; le passé et le futur ; les verbes en *-ir* (sauf *repetir* à l'infinitif) ; *quand, perqué, fins a* ; le pluriel des adjectifs ; les nombres de 31 à 99 hors dizaines (forme fixée le 2026-11-02 : *trenta un*, en deux mots) ; les ordinaux après *dosen*.

---

## Doutes pour Romain

Tranchés par Romain le 2026-11-02 (cahier des charges §11), la grammaire de référence à l'appui quand elle en parle : *zèro* ; *lo can* ; *papeta, mameta* ; *Soi regent* (*Fau de* retiré) ; de 31 à 99, *trenta un* en deux mots ; *mens lo quart* ; *verd* « BÉRT » ; *dimars* « di-MAS » (le 2026-11-04, Romain revient sur « di-MARS » : *rs* final sonne « s », comme dans *Besièrs*, Chabbert page 65) ; *volriái* « boul-RYOÏ » ; *occitan* « ou-tsi-TA » (la grammaire dit « ou-tsi-TAN », mot savant : note au son du jour de 2.1) ; *sul* et *suls*. Lot 2 (unités 5 à 8) : *la frucha*, collectif sans pluriel ; soudure au choix avec *sus* et *jos* (*sus lo*, *jol*) ; *dosen, dosena* (*segond* : le second, quand il n'y en a que deux) ; *setanta*, *lo lach*, *prene* et *comprene* gardés ; *blanc* « BLANK » ; *caud* « CAOUT ».

Restent :

- **1.** Mots que l'API n'a pas pu confirmer (*francés, sòrre, vosautres, cent, davant, darrièr, grand, vinhairona*) : tu les valides tels quels ?
- **4.** « Enfant » : *lo dròlle · la dròlla* (le Basic n'a pas *enfant*) : oui ?
- **6.** Médecin au féminin : *la mètge* ou *la mètgessa* (absente du Basic) ?
- **13.** « Monde » : *mond* (titre du module 0) et *monde* (nom du bloc 2) cohabitent : on harmonise ?
- **14.** Au marché, *Quicòm mai ? · Es tot.* (autre chose ? c'est tout) te va, plutôt que *E amb aquò ?* (calque du français) ?

---

## Tableau récapitulatif

| Module | Items | ⚠️ | | Module | Items | ⚠️ |
|---|---|---|---|---|---|---|
| 0 | 6 (sans `id`) | 0 | | 5.1 | 17 | 0 |
| 2.1 | 12 | 1 (*francés*) | | 5.2 | 12 | 1 (*cent*) |
| 2.2 | 7 | 0 | | 5.3 | 8 | 0 |
| 2.3 | 8 | 0 | | 5.4 · tâche | 0 | 0 |
| 2.4 · tâche | 0 | 0 | | 6.1 | 9 | 0 |
| Halte 1 | 0 | 0 | | 6.2 | 11 | 0 |
| 3.1 | 24 | 1 (*zèro*) | | 6.3 | 11 | 0 |
| 3.2 | 12 | 1 (*sòrre*) | | 6.4 · tâche | 0 | 0 |
| 3.3 | 9 | 0 | | Halte 3 | 0 | 0 |
| 3.4 · tâche | 0 | 0 | | 7.1 | 13 | 0 |
| 4.1 | 11 | 1 (*vosautres*) | | 7.2 | 7 | 3 (*davant, darrièr, sul*) |
| 4.2 | 14 | 2 (féminins de *mètge*, *vinhairon*, laissés hors encadré) | | 7.3 | 12 | 1 (*grand*) |
| 4.3 | 11 | 0 | | 7.4 · tâche | 0 | 0 |
| 4.4 · tâche | 0 | 0 | | 8.1 | 9 | 0 |
| Halte 2 | 0 | 0 | | 8.2 | 6 | 1 (*dosen*, dicodòc ✓) |
| | | | | 8.3 | 9 | 0 |
| | | | | 8.4 · tâche, Halte 4, Mission | 0 | 0 |

**Total** : 232 items avec `id` (unités 2 à 8) et 6 sans `id` (module 0), soit 238. 12 ⚠️ : 10 dans les encadrés (*francés, zèro, sòrre, vosautres, cent, davant, darrièr, sul, grand* ; *dosen* depuis le 2026-11-02), 2 sur des féminins laissés hors encadré ; 7 étaient déjà signalés par la carte du 2026-10-25. Hors encadré, à gloser seulement : *cèrs, autan, ostau, cantou, nautres, vautres* ⚠️.
