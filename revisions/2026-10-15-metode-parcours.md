# Reprise du parcours pédagogique : proposition de méthode

> **2026-10-15.** Demande de Romain : reprendre le parcours, du niveau le plus
> simple au plus avancé, avec un test de positionnement (code et méthode qui
> tiennent sans Claude), une histoire tout le long, les fogassas, un ton qui
> mêle sérieux et jeu, jamais culpabilisant, et l'occitan montré là où il se vit.
> **Statut : proposition.** Rien n'est décidé tant que Romain n'a pas tranché.
> Repères : ✓ vérifié (source ou commande citée) · ~ à vérifier · ◇ avis de Claude.

---

## 1. Ce qui existe déjà (on ne repart pas de zéro)

| Pièce | État | Fichier |
|---|---|---|
| Cadre du cursus A1 → C2, 8 principes, gabarit de module | hypothèse (décision 14) | `Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/00-cadre-methodologique.md` |
| Cartes des niveaux : A1 = 10 unités, 41 modules ; environ 260 modules jusqu'à C2 | hypothèse | même dossier, `01-A1.md` à `06-C2.md` |
| État de l'art (12 principes sourcés, publics, 15 questions d'arbitrage jamais tranchées) | hypothèse | `etat-de-l-art-parcours.md` §3, §5.5, §9 |
| Jeu : fogassas, còla des personnages, Arbre del Ligam, Fuòc de l'ostal | **décidé** (29-08) | `gamification.md` |
| Moteur de leçon, unité 1 jouable (modules 1.1 à 1.4) | en ligne ✓ | `app/src/lib/lesson/` |
| Test de positionnement | **rien de conçu** ✓ (état de l'art §8.2 point 4) | |
| Histoire suivie du début à la fin | **n'existe pas** ✓ : des personnages par dialogue, la còla par unité, pas de fil | |
| Carnet de conception de Romain | pages vierges depuis le 04-10 ✓ (un seul commit) | `carnet-concepcion/` |

◇ Le carnet vierge n'est pas un reproche : la carte a pris tout octobre. Il dit
surtout que la formule « lire seul, puis écrire une page » ne s'est pas
enclenchée. Ta manière de décider (devant deux ou trois options concrètes)
marche mieux : la méthode ci-dessous s'appuie dessus.

## 2. La tension à régler d'abord : la décision 14 (2026-10-04)

Le 4 octobre : « Claude ne produit plus de contenu pédagogique à ta place »
(peur de l'atrophie). Aujourd'hui tu demandes des propositions argumentées.
Les deux se concilient si l'on sépare **la charpente** de **la chair** :

- **Charpente** (Claude propose, tu choisis) : ordre des étapes, formes
  possibles de l'histoire, mécanique du test, gabarits, listes de contrôle, code.
  Chaque proposition dit son intérêt, ses limites, sa cohérence avec le reste.
- **Chair** (toi seul) : l'histoire elle-même, les personnages, les dialogues,
  les explications de grammaire, ta voix, tes photos.
- **Vérification** (Claude, toujours) : chaque mot occitan par l'API de
  lo Congrès, chaque fait par sa source, chaque écran par une capture.

**Décision 1 prise par Romain le 2026-10-15 : charpente et chair** (cahier §11).
La décision 14 tient toujours pour la chair ; Claude propose désormais aussi
des options argumentées pour la charpente.

## 3. La méthode : « conception à rebours » + « tranche complète »

**Conception à rebours** ✓ (Wiggins et McTighe, *Understanding by Design*,
1998 ; racine chez Tyler, 1949) : 1) ce que la personne saura faire,
2) comment on le prouve, 3) seulement ensuite, les activités.
Pour Lo Ligam, ça donne :

| Phase | Contenu | Qui | Livrable |
|---|---|---|---|
| **0. Contrat** | Rôles, règle de vérification, protocole « es-tu sûr ? » (§7) | ensemble | ce document validé |
| **1. Charpente** (légère, tout le parcours) | a) par niveau, 5 à 8 phrases « au village, cette personne sait… » ; b) comment on le prouve : missions de fin de niveau + test de positionnement ; c) l'arc de l'histoire en une page + la fiche des personnages | toi (a, c) ; Claude fournit les descripteurs officiels du CECR et vérifie | une page par niveau, une page d'histoire |
| **2. Tranche complète** | L'unité 1 reprise avec l'histoire + le test de positionnement v1, joués par 3 à 5 vraies personnes (ton amie testeuse, Cyril, un·e élève de visio) | toi (texte, voix) ; Claude (code, captures) | une unité « modèle », des retours notés |
| **3. Série** | Unité par unité, avec la même fiche d'unité et la même liste de contrôle | toi ; Claude vérifie et code | le parcours, à ton rythme |

**Pourquoi pas « tout détailler d'abord »** ◇ : 260 modules détaillés avant
le moindre test, c'est la garantie de tout réécrire (l'état de l'art a déjà
trouvé des contradictions entre le tableau en spirale et les cartes, §9 n°15).
**Pourquoi pas « au fil de l'eau »** ◇ : l'histoire et le test ont besoin de
voir tout l'arc, sinon ils se contredisent plus tard.
Ta première idée (plan d'ensemble, puis détail au fur et à mesure) est donc la
bonne, avec deux garde-fous : un plan d'ensemble **léger**, et une première
unité **testée par de vraies personnes** avant la série.

**Ce qui fait tenir la méthode sans Claude** : une fiche d'unité à remplir
(objectifs, épisode de l'histoire, mots nouveaux, point de grammaire, place
dans le jeu), une liste de contrôle avant publication (8 principes, style,
vérification occitane), le script de vérification déjà en place
(`node scripts/verificar-oc.mjs`), et un moteur où un module = un fichier.

## 4. Le test de positionnement (proposition v1)

**Modèle** ✓ : DIALANG, outil du Conseil de l'Europe. Un test de vocabulaire
« vrais mots / mots inventés » choisit le niveau des épreuves, complété par une
auto-évaluation « je peux… » tirée du CECR, comparée ensuite au résultat
(Alderson, *Diagnosing Foreign Language Proficiency*, 2006). Le vocabulaire y
pèse plus lourd parce qu'il prédit mieux le niveau.

| Partie | Ce qu'elle fait | Durée ◇ |
|---|---|---|
| 1. Profil | 2 ou 3 questions : occitan entendu en famille ? une autre langue romane (catalan, espagnol, italien) ? → oriente vers les publics de l'état de l'art §5.5 (natif rouillé, romanophone, débutant) | 1 min |
| 2. Vrais mots, mots inventés | une trentaine de mots, rangés par fréquence (les 1 001 mots pour A1), dont un tiers inventés ; « oui » à un mot inventé corrige le score à la baisse | 3 min |
| 3. Compréhension, en escalier | 8 à 12 épreuves (écoute avec ta voix, lecture courte) ; on monte après une réussite, on descend après un échec | 4 à 5 min |
| 4. « Je peux… » (facultatif) | auto-évaluation, comparée au résultat, sans jugement | 1 min |

**Résultat** : un point d'entrée (« commence à l'unité 4 », « reprends la
graphie d'abord ») et jamais un verdict ; on peut toujours revenir en arrière
ou sauter. Une question par écran, gros boutons : le téléphone d'abord.

**Vérifié aujourd'hui** ✓ : `verificar-oc.mjs` reconnaît *ostal* et *aiga* et
déclare absents du Basic et de vèrb'Òc deux mots inventés pour l'essai
(*brascolh*, *pentilar* : **ce ne sont pas des mots occitans**). L'API sait
donc valider les vrais mots et écarter les faux.
**Limite** ~ : « absent du Basic languedocien » ne prouve pas l'absence dans un
autre dialecte ; chaque mot inventé passe aussi sur dicodòc à la main.

**Le code** ◇ : une fonction de calcul seule (`app/src/lib/positionament/`),
les épreuves dans un fichier de données, les seuils dans un tableau lisible,
des tests automatiques, et une notice « ajouter une épreuve, régler un seuil »
écrite pour toi. Aucun service extérieur ; rien n'est gardé sans compte
(minimisation RGPD, décision du 28-07).

**Limites honnêtes** :
- Ce n'est pas un test certifié. Les seuils sont des estimations tant qu'ils
  n'ont pas été réglés sur des personnes de niveau connu ; **tes élèves de
  visio sont cet échantillon**. (L'état de l'art classe déjà « test validé sur
  un échantillon » en évolution, §8 bis.)
- Un test qui choisit chaque question d'après une statistique fine (test
  adaptatif « item par item ») demande beaucoup de passations pour se régler :
  pas pour le lancement. Même DIALANG choisit un niveau d'épreuve, pas chaque
  question ✓.
- Le test ne peut placer que vers du contenu qui existe. Au lancement (A1
  seul), il dira : début A1, milieu A1, ou « tu dépasses A1 : les cours en
  visio sont faits pour toi ». ◇ C'est cohérent avec le repositionnement du
  06-10 (la visio au centre).

## 5. L'histoire tout le long

**Précédents** ✓ :
- *French in Action* (Yale, Pierre Capretz) : 52 épisodes, une seule histoire
  (Robert et Mireille), la grammaire glissée dans le récit, tout en français.
- *Destinos* (1992, Bill VanPatten et James Cooke) : 52 épisodes, un feuilleton ;
  une avocate enquête sur le passé d'une famille et voyage d'un pays à
  l'autre, ce qui fait entendre accents et variantes (Mexique, Espagne,
  Argentine, Porto Rico).

**Ce que l'histoire apporte** ◇ : l'envie de revenir (savoir la suite), un
réemploi naturel des mots (mêmes lieux, mêmes personnages), un liant entre
grammaire, jeu et pauses. **Limite** ~ : je n'ai pas encore cherché d'étude
qui mesure l'effet d'une histoire suivie sur l'apprentissage lui-même ;
c'est d'abord un choix de motivation. À vérifier à la phase 1c.

**Trois formes possibles** (la forme seulement ; l'histoire, c'est toi) :

| Forme | Principe | Intérêt | Limite |
|---|---|---|---|
| A. **Le voyage** (façon *Destinos*) | un personnage traverse les pays occitans pour une raison qui le dépasse | la variation par pays arrive d'elle-même ; chaque épisode devient un lieu cliquable de la carte, le chantier principal | voyager coûte en images et en voix de plusieurs pays (§8 bis : « évolution ») |
| B. **L'ostal** (feuilleton en un lieu) | une maison, un village, un café ; des habitué·es qui reviennent | simple à produire seul, attachement aux personnages, proche de tes photos | la variation entre pays doit venir d'ailleurs (visiteurs, *Los que parlan*) |
| C. **Ton propre chemin** | l'apprenant·e est le héros (« tu ») ; la còla l'accompagne | se marie avec le jeu déjà décidé (Arbre, Fuòc de l'ostal) | moins de suspense qu'un feuilleton |

◇ Les formes se combinent (par exemple B en A1-A2, puis A à partir de B1).

**Retour de Romain (2026-10-15)** : un seul univers risque de lasser ; plutôt
**faire voyager**, découvrir l'Occitanie au fur et à mesure, sans histoire à
suivre comme dans un livre ; de la culture, des situations, et du **moderne**
pour ne pas être seulement folklorique. D'où une quatrième forme :

| Forme | Principe | Intérêt | Limite |
|---|---|---|---|
| D. **Le voyage-découverte** (sans intrigue) | chaque unité est une étape : un lieu de la carte, une situation de la vie (marché, gare, match, concert, école, travail), un usage d'hier et un usage d'aujourd'hui | pas de lassitude (un nouveau lieu à chaque unité) ; chaque étape tient seule, donc le test de positionnement peut faire commencer n'importe où ; relie le parcours à la carte ; montre ta vision de l'Occitanie (repositionnement du 06-10) | moins d'« envie de la suite » qu'un feuilleton, à compenser par la découverte elle-même ; le réemploi des mots n'est plus automatique, il faut le prévoir (révisions en spirale) |

Trois points de cohérence pour D ◇ :
1. **La géographie suit la progression.** Le site enseigne le languedocien :
   en A1-A2, les étapes restent en pays languedocien ; les autres dialectes
   arrivent à partir de B1, quand le cadre prévoit la variation en écoute
   (`00-cadre-methodologique.md`, tableau en spirale). Puis au-delà : Val
   d'Aran, vallées d'Italie, voisins.
2. **La còla devient les compagnons de route** : un personnage par unité qui
   « porte son pays » (décision du 29-08), rencontré à l'étape. Le fil
   récurrent n'est plus une intrigue, c'est ton chemin et ta còla qui grandit.
3. **Question ouverte** : une carte « qui se remplit » au fil des étapes
   ferait doublon avec l'Arbre del Ligam (déjà décidé). Soit la carte n'est
   que le décor, soit on repense l'Arbre plus tard. Pas à trancher maintenant.

**Le moderne, exemples vérifiés** ✓ (pour montrer le genre, le choix reste à
toi) : Massilia Sound System, groupe marseillais qui chante en occitan et en
français depuis les années 1980 ; Ràdio Occitània, radio toulousaine fondée en
1981, environ 80 % de ses émissions en occitan ; Jornalet, journal en ligne en
occitan depuis 2012, tous dialectes, graphie classique ; les Calandretas,
écoles en occitan (déjà sur la carte). Règle proposée ◇ : à chaque étape, au
moins un usage d'aujourd'hui.

**Deux règles de cohérence** ◇ :
1. **Des épisodes qui tiennent debout seuls**, avec un « précédemment » en
   trois lignes : sinon l'histoire empêche le test de positionnement de faire
   commencer quelqu'un à l'unité 4.
2. **Deux couches** : la còla (le merveilleux, déjà décidée) et le réel
   (lieux vrais de la carte, gens qui parlent occitan aujourd'hui, usages
   concrets : marché, Calandreta, panneaux, chansons, radio). Le réel répond à
   ta demande de « montrer où l'occitan se vit ».

**Coûts à prévoir** : images (tes photos « sang e aur », jamais d'images IA,
décision 9), voix (la tienne d'abord), personnages dessinés (qui dessine ?
question ouverte de `gamification.md`), casting et autorisations (question
ouverte 7). Les vidéos : quelques-unes, courtes, pour le poids des pages.

## 6. Le ton et le jeu (déjà acquis, à garder)

Fogassas = récolte immédiate ; rien ne meurt, le Fuòc de l'ostal ne s'éteint
jamais, l'Ors fête les retours ; zéro classement (décisions du 29-08).
À ajouter ◇ : une **pause** prévue dans chaque module (capsule d'humour ou de
culture, une minute), et une **règle de ton** : une phrase sérieuse, une
phrase complice, jamais de reproche, même après trois erreurs.

## 7. Protocole « es-tu sûr ? »

Quand tu demandes « es-tu sûr ? », Claude **revérifie la source** (API,
document, page web, capture) et répond avec la preuve. Il ne change d'avis
que si la vérification le contredit, et il dit alors ce qui était faux.
Jamais « oui, tu as raison » sans avoir revérifié.

## 8. Les décisions, une à la fois

1. ✅ **Le partage des rôles** (§2) : charpente et chair (Romain, 2026-10-15).
2. La méthode du §3 (à rebours + tranche complète).
3. La forme du fil (§5) : piste de Romain = le voyage-découverte (D), à voir.
4. Le test v1 (§4) : on le code dès la phase 1, ou après l'unité modèle.

## 9. Ce que tu peux faire seul / ce qui demandera de l'aide

- **Seul, maintenant** : coller ici le rendu de l'autre discussion ; trancher
  la décision 1 ; noter en vrac tes idées d'histoire (personnages vrais ou
  inventés, lieux, raison du voyage).
- **Avec Claude** : la comparaison du rendu avec l'existant, les descripteurs
  officiels du CECR par niveau, le code du test, la vérification de chaque mot.
- **Plus tard, avec d'autres** : réglage des seuils (élèves de visio), voix de
  natifs, dessins des personnages, droit à l'image.

**Coût** ◇ : rien de lourd. Phases 0 et 1 en conversation, sans agents ; le
code du test v1 tient en une séance.
