# Doutes occitans — le seul endroit à relire

> **Pour Romain.** Tu ne relis plus des milliers de mots. Claude et Joan vont chercher et valident le vocabulaire ; **ici ne remontent que les vrais doutes**, une question à la fois. Tu réponds, Claude corrige et vide la ligne.
>
> **Méthode.** Tout mot occitan écrit par Claude passe d'abord par l'API de lo Congrès (`cd app` puis `node scripts/verificar-oc.mjs …`). Un ✓ ne valide ni le sens ni l'usage : seul toi tranches l'usage vivant. Mis à jour le 2026-11-02 (réponses de Romain appliquées : A1-1 à A1-12 et A1-21 à A1-26 retirés).

---

## 1. Décisions d'usage qui attendent ton avis (unité 1 du cursus)

Ce ne sont **pas** des fautes d'orthographe : l'orthographe est confirmée. Ce sont des choix d'usage, de prononciation ou de pédagogie, à toi de les trancher.

| # | La question | Mon avis | Ta réponse |
|---|---|---|---|
| 1 | **`siás` ou `siès` pour « tu es » ?** Le cadre du cursus dit `siás` ; l'accueil du site dit `siès` (ton choix du 22-10, montpelliéranisme assumé). On garde `siás` dans les leçons et `siès` à l'accueil ? | Cohérent : `siès` est ta couleur de Montpelhièr à l'accueil, `siás` la forme large pour apprendre. Mais à confirmer. | |
| 2 | **`demorar` pour « habiter » en A1 ?** (`Demòri a Tolosa`) | Oui, c'est l'usage courant. | |
| 3 | **Deux façons de dire son nom** présentées comme équivalentes : `Me dison…` (« on me dit ») et `M'apèli…`. Les deux te vont en A1 ? | Les deux sont justes et vivantes ; garder les deux enrichit. | |
| 4 | **Vouvoiement** : `Cossí vos dison ?` et `Cossí vos apelatz ?` — à confirmer. | Corrects tous les deux. | |
| 5 | **Règle de politesse donnée à l'élève** : `Adieu` est familier (amis, jeunes, même à la première rencontre) ; à une personne qu'on vouvoie, plutôt `Bonjorn`. C'est bien ton usage ? | À valider par toi : c'est de l'usage, pas de la règle. | |
| 6 | **Prononciations à confirmer à l'enregistrement** : `Adieu` « a-DIOU », `Adieu-siatz` « a-di-SSIATS », `Bon ser` « bou(n) SÉ » (r muet), `Bonjorn` « boun-DJOUR ». Villes en forme de leur dialecte : `Limòtges` (limousin), `Niça` (niçois), `Bordèu` (gascon). | Tu confirmeras naturellement en enregistrant. | |
| 7 | **Page Cinéma : `camèra` ou `camera` ?** Le texte du film Istòria d'Adrian dit `Camèra d’Aur a Canas` (« Caméra d’or à Cannes »). L'API de lo Congrès connaît `camera` sans accent, et ignore `camèra`. Quelle forme dans ton usage ? | Je penche pour `camèra` (accent d'usage), mais l'outil ne le confirme pas : à vérifier sur dicodòc. | |
| 8 | **Page Cinéma : l'étiquette « téléfilm » (Malaterra).** Écrite `Filme de television` ; `telefilme` est absent de lo Basic. Et pour « série », l'API donne `seria` (oc) mais `tièra` (lengadoc) : `Seria` convient-il pour le languedocien, comme étiquette de genre ? | `Filme de television` est limpide et sans risque. Pour `seria`, c'est aussi le titre de la série (Wikipèdia oc), donc on le garde pour le titre ; l'étiquette de genre est à ta main. | |

## 2. Mots corrects que les outils ne savent pas confirmer (aucune action, pour mémoire)

Ces mots sont du bon occitan ; c'est l'outil qui a une lacune ou un bug, pas le mot. À vérifier d'un coup d'œil sur dicodòc.eu si tu veux en avoir le cœur net, mais **aucun doute réel**.

| mot | ce que fait l'outil | pourquoi c'est normal |
|---|---|---|
| `ieu` | absent de lo Basic et de vèrb'Òc | c'est le pronom « moi/je » de base, dans toutes les grammaires ; ni Basic (lexique) ni vèrb'Òc (verbes) ne le portent |
| `vos` | l'API plante (erreur d'appel) | bug PHP connu de l'API, déjà rencontré ; `vos` est standard |
| `país` | l'API plante | même bug ; `país` est standard |
| `menú` (nom du menu de navigation) | absent de Basic et de vèrb'Òc | emprunt courant ; **à vérifier sur dicodòc** si tu préfères une autre forme (ex. `carta`) — seul vrai point ouvert de cette liste |
| `francés`, `francesa` (2.1 et suivants) | absents de lo Basic et de vèrb'Òc | **confirmés** sur dicodòc (2026-11-02) : « francés, -esa » chez Lagarde et chez Laus, deux dictionnaires languedociens |
| `sòrre`, `sòrres` (3.2 et suivants) | absents de lo Basic | **confirmés** sur dicodòc (2026-11-02) : « sòr, sòrre » chez Laus (languedocien), et `sòrre` aussi en gascon, en provençal et en auvergnat |
| `dètz-e-sèt`, `dètz-e-uèch`, `dètz-e-nòu` (3.1) | mots composés : l'outil ne les connaît pas | `dètz-e-sèt` **confirmé** chez Laus (languedocien) ; 18 et 19 suivent le même modèle (cadre §3) |
| `amics`, `ans`, `dròlles`, `cartas` | absents de lo Basic | pluriels réguliers : le Basic ne porte que les mots de base (`amic`, `an`, `dròlle`, `carta` sont tous ✓) |
| `hès` (gascon), `fases` (auvergnat) : encart *Alhors en Occitània* de 4.4 | inconnus de vèrb'Òc (variété languedocienne) | formes d'autres dialectes, sourcées dans `cursus/alhors-en-occitania-A1.md` (Per Noste, Omelhièr) : ce n'est pas à lo Basic de les valider |

## 3. La grande pile de la carte (~1 450 noms) — relecture par zone, pas par toi

Noms de lieux en **forme locale, graphie classique**. Un dictionnaire général ne peut pas les trancher : c'est une relecture humaine par zone, que **Joan** mènera et ne te remontera qu'au cas par cas. Fichiers de référence :

- `SIG/*-a-validar.csv` : communes (~915), provinces, parcs, relief, Calandretas, vallées, sous-dialectes, surnoms.
- `SIG/<lenga>/FONTS.md` et `SIG/lisn/mots-a-validar.csv`.
- Règle en cas d'absence de forme sûre : **on masque le nom** (jamais de phonétique, jamais d'invention).

## 4. Bloc 1 de l'A1 (module 0, unités 2 à 4, haltes 1 et 2) : relu par Joan, 2026-11-02

Les 209 mots des encadrés « À retenir » de ces modules ont été repassés à l'API de lo Congrès : tout est connu de lo Basic ou de vèrb'Òc, sauf les formes de la section 2 (lignes ajoutées). Les questions de prononciation propres à chaque module restent dans la fiche de relecture du module ; ici, seulement ce qui engage plusieurs modules.

*Tout est tranché (2026-11-02, cahier des charges §11).*

## 5. Questions des rédacteurs de l'A1 (2026-11-01 et 02), dans l'ordre où te les poser

Claude te les pose une à une, avec des boutons, d'abord ce qui touche plusieurs modules ; tu n'as rien à écrire ici. Chaque forme est passée par l'API de lo Congrès ou dicodòc ; ta réponse fait foi, puis la ligne est retirée. Les autres doutes restent dans `cursus/lexic-A1.md` (5 doutes), `cursus/alhors-en-occitania-A1.md` (fin du fichier) et `cursus/trama-A2-C1.md` (10 questions).

**Formes qui touchent plusieurs modules**

| # | La question | Où |
|---|---|---|
| A1-13 | `Cossí se ditz en occitan ?`, sans le mot au milieu : naturel ? | 6.x |
| A1-14 | `Plòu ? Lo balèti es dins la sala del vilatge.` : la condition par une question, sans `se` ? | halte 3 |
| A1-15 | `Soi a la gara a onze oras e mièja` pour « j'arrive » ? | halte 4 |
| A1-16 | `cent` (l'API plante sur ce mot) : validé ? | 5.x |
| A1-17 | `Òc ! Yasmine es d'aquí` pour rester en occitan quand Marià passe au français (faute de `podètz`) ? | 5.4 |
| A1-18 | `dròlle` (enfant) ; `dissabte` ou `lo dissabte` (habitude) ; `E vos, lo dimenge, cantatz ?` ; `Soi estudianta` | 3.x, 4.x |
| A1-19 | `Quicòm mai ?` (titre de 5.4) ; `mond` ou `monde` | 5.4, lexique |
| A1-20 | Unité 2 : `Pòdes repetir en occitan, se te plai ?` ; Marià tutoie Giulia ; formes gasconnes et provençales du jeu 2.2 | 2.x |

**Prononciations (avant l'enregistrement)**

*Tout est tranché (2026-11-02, cahier des charges §11).*

**Culture et chansons**

| # | La question | Où |
|---|---|---|
| A1-27 | « langue dialectale », « plusieurs millions », Guilhem IX à la place de Roqueta, `Amor d'Aussau` (L'Ouzoum), `benvenguda` | 0 |
| A1-28 | `Plòu a Marselha` : on garde ? Le refrain de Mistral (provençal) : traduction à relire | 6.x |
| A1-29 | `A mon ostal` (Castanha e Vinovèl) : la même chanson que celle recueillie dans l'Aude ? | 7.x |
| A1-30 | `Parla patois` (Massilia Sound System) pour le 8.3 : te va ? | 8.3 |
| A1-31 | Godolin et le Consistori cités tels quels (vers non comparé à une édition savante) | 8.x |
| A1-32 | Encarts *Alhors* : cases vides, 16 formes assemblées (relecture par un locuteur ?), « auvergnat » = sud de l'Auvergne (Omelhièr) | toutes les unités |

**Histoire et personnages**

| # | La question | Où |
|---|---|---|
| A1-33 | Ramon, fromager âgé, vouvoie Karim et tutoie Inès, douze ans : le bon usage ? | 5.x |
| A1-34 | Lisa dort sur le canapé chez Núria : la plaisanterie te va ? | halte 4 |
| A1-35 | Mirèlha et la grand-mère du Val d'Aran ; familles diverses ; répartition des métiers | 3.x, 4.x |
| A1-36 | La tâche 4.4 racontée au prof en visio | 4.4 |

## 6. Interface des jeux (/apren/jocs, 2026-11-05) : à voir avec tes livres, sans urgence

| # | La question | Où |
|---|---|---|
| J-1 | « Sageta tenguda : la sèrp accelèra. » (aide de la sèrp : quand on garde la flèche enfoncée, la sèrp va plus vite). API : `sageta`, `tenguda`, `sèrp` connus du Basic ; `accelèra` = 3e personne de `accelerar` (vèrb’Òc). Doute sur la tournure, pas sur les mots : dit-on « sageta tenguda » pour une touche maintenue ? | aide de la sèrp |
| J-2 | « Totas » et « Unitats 1 a 8 » (toutes les unités mélangées). API : `totas` et `unitat` connus du Basic (*unitats* : pluriel régulier). Doute : « Totas » seul se comprend-il, ou faut-il « Totas las unitats » ? | choix du niveau de la sèrp |
| J-3 | Les noms des thèmes nouveaux : « Lo o la », « Los nombres », « El o ela », « Singular o plural », « Un ostal o una pòrta ». API : `nombre`, `singular`, `plural`, `ostal`, `pòrta` connus du Basic. Doute : « Los nombres » ou « Los numèros » (`numèro` aussi connu) pour un débutant ? | thèmes des panièrs |
| J-4 | Les étiquettes des paniers : « de 0 a 10 », « de 11 a 20 », « un ostal… », « una pòrta… ». Doute : les chiffres, comme en français, ou les nombres en toutes lettres ? (le mot pour « zéro » n’est pas dans le Basic) | étiquettes des panièrs |
| J-5 | Les pièges voulus : « lo papeta » (grand-père) dans le panier *lo* malgré son *-a* ; « la frucha » (les fruits, tous ensemble) dans *singular*. Les deux viennent des modules 3-2 et 5-1 ; *la frucha* y est encore marquée « À relire » (ton choix du 02-11, grammaire de référence p. 33). Joan conseille de garder ce piège une fois l’usage vivant confirmé, sinon de retirer la paire. Même chose pour *regent* et *regenta* (module 4-2, proposition à valider). | thèmes « Lo o la », « Singular o plural », « El o ela » |
| J-6 | « La sala de jòcs » (titre de la salle) et « ‹ Sala de jòcs » (le lien qui y ramène depuis un jeu). API : `sala`, `jòc` connus du Basic. Pas de doute particulier, à relire. | salle de jeux |
| J-7 | Les cinq familles : « Jòcs d’adreça », « Jòcs de mots », « Jòcs d’observacion », « Jòcs de memòria », « Jòcs per escotar ». API : `adreça`, `mot`, `observacion`, `memòria` connus du Basic ; le nom `escota` (l’écoute) en est absent, seul le verbe `escotar` y est, d’où « per escotar » plutôt que « d’escota ». Doute : « Jòcs d’escota » se dit-il dans tes livres ? | familles de la salle |
| J-8 | Ce que les jeux font travailler, sous « Fa trabalhar » : Vocabulari, Ortografia, Gramatica, Memòria, Atencion, Observacion, Escotar, Logica, Adreça. API : tous connus du Basic (`fa` : 3e personne de `far`, vèrb’Òc). *Logica* sans accent, comme *gramatica* et *musica* que le Basic écrit ainsi (*lògica* y est absent). Doute : « Adreça » ou « Abiletat » pour l’habileté des doigts ? Le Basic donne les deux pour « adresse », et *abiletat* aussi pour « habileté ». Même choix pour la famille « Jòcs d’adreça » | filtre et familles de la salle |
| J-9 | Les jeux à venir : « Mots crosats » (`crosat` : participe de `crosar`, vèrb’Òc), « Mots mesclats », « Los parelhs », « Escota e causís » (impératifs `escota` et `causís` vérifiés dans vèrb’Òc). Doute : comment tes livres nomment-ils les mots croisés et les mots mêlés ? | jeux à venir |
| J-10 | Les deux tèmas : « Calme » et « Joiós » (`festiu` absent du Basic, d’où « Joiós »), avec « Tèma », « Tot », « Jogar », « A venir ». API : connus du Basic (`venir`). Doute : « Joiós » dit-il bien un habillage coloré et animé ? | choix du tèma |

---

### Comment répondre

Dis-moi simplement, par exemple : « doute 1 : garde `siás` partout » ou « doute 6 : `menú` ok ». Je corrige, je vérifie, et je retire la ligne.
