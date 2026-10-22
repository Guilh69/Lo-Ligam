# Proposition : repartir d'une page presque blanche (2026-10-22, nuit)

## 1. Ce que c'est, comment la lire

Une proposition, après neuf lectures (`revisions/analisi-2026-10-22/00-resums.md`), pour la demande du 21-10 : « repartir d'une page presque blanche en réutilisant ce qui fonctionne et ce que j'aime », « en se recentrant sur l'idée de Lo Ligam à la base, qui est les publications Instagram ».

Comment la lire : du général au précis ; chaque fait porte sa source ; l'occitan est recopié du site ou des visuels, sauf deux expressions marquées « à valider par Romain ». La chair reste à Romain, signalée `[a escriure per Romain]`.

Décidé par Romain, non rouvert : les trois verbes, une page par rubrique, le menu-voile tel quel, l'accueil comme vue d'ensemble, le Plâtre, le logo et ses recettes, Limelight / Luciole, « charpente et chair », la scène « Lumière avec pastilles », l'ordre « Canva d'abord, admin des scènes ensuite » (cahier §11 du 15-10 au 21-10 ; PILOTATGE, liste des 15). Proposé : ce que l'accueil met au centre, où vont les fiches, ce qui part, trois choses à oser ; le §11 liste ce qui frotte.

## 2. L'idée

**En une phrase, dans ses mots** : Lo Ligam, c'est « apprendre en même temps que je partage » (istoria-romain.md §8) ; le site part donc de ce que Romain partage déjà, ses fiches, pas d'une carte ni d'un slogan.

**En dix lignes.** Trois angles : A, le fil Instagram comme site (36 thèmes, six familles, la fiche comme unité) ; B, la classe calme (l'apprentissage en porte, structure de Léo Parpeix) ; C, lo país (la carte et le wiki en porte). Je retiens **A dans le cadre de B, C rangé à sa place**, pour cinq raisons. Un : la demande dit « les publications Instagram » à la base, seul contenu que Romain produit sans Claude depuis 2022 (212 visuels, marca-instagram). Deux : « trop de bruit, pas assez de structure » (21-10) appelle B, et l'opposition « Instagram brique et dense contre site plâtre » est une illusion : 50 % des visuels ont un fond blanc, 0 % un fond brique (referencias-principis) ; la densité vit dans la tuile. Trois : C a déjà « pris toute la place » (DIRECCION.md l.19) et rien de ce qui manque au lancement n'est la carte (carta-plaça). Quatre : B en porte contredit le 15-10 (les cours ne sont plus la porte d'entrée). Cinq : ce que Romain se réserve n'avance pas (module 0, audio, carnet : romain-sa-faiçon) ; ses fiches, il les tient depuis trois ans : bâtir sur ce qu'il fait vraiment. La carte devient « où se dit ce mot », l'apprentissage « ce mot, en scène ». Le site est le calme ; le contenu est Instagram (marca-instagram, proposition 1).

## 3. L'accueil, bloc par bloc (sept blocs)

| # | Bloc | Rôle | Ce qu'on voit | Matière | Romain écrit |
|---|---|---|---|---|---|
| 1 | Ouverture | poser le nom et le geste | la croix ocre et rouge (`Crotz.svelte`), « L'occitan · Se parla. S'apren. Amassa. » en Limelight, une phrase, et **la fiche de la semaine** : un visuel Canva en tuile pleine, mot, prononciation, français | titre existant (`+page.svelte` l.301-304) ; un des 212 PNG de `design-stock/canva-vf/`, ex. `11-Meteo/Plou.png`, servi en 540 px webp | la phrase sous le titre (DIRECCION bloc 3, q6) ; la fiche, 5 min par semaine |
| 2 | Bandeau de mots | le ton : des mots simples, « le ciel, la montagne, les oiseaux » (istoria-romain §8) | onze mots qui défilent, chacun menant à sa fiche | `MOTS` d'`app/src/lib/acuelh/donadas.js` l.11, remplacés par onze mots des fiches | choisit les onze |
| 3 | Qu'es aquò, Lo Ligam ? | dire qui parle | la photo de Romain, la déclaration, trois lignes d'origine, lien « Mon istòria » | titre existant (l.379) ; `MANIFEST` (donadas.js l.16, « occitan de validar ») ; `app/static/ensag/clar/romain-480.webp` (18 Ko) ; istoria-romain.md §8 | coupe ses trois lignes |
| 4 | 01 Se parla | le pays de la langue | la carte en étoiles qui se dessine, les chiffres, « Lo wiki de las lengas e dels luòcs » | `carta-estelas.js` ; les 30 fiches de `SIG/lengas-fichas.json` | une ligne |
| 5 | 02 S'apren | comment on apprend | une scène d'unité (la maison, ombre et pastille dorée), puis « En visio, amb ieu », « A ton ritme », « Sus mesura » | `app/static/ensag/scena/ostal-net.webp` (28 Ko) ; textes existants (l.452-489) | une ligne |
| 6 | 03 Amassa | la communauté telle qu'elle est | six tuiles : les six derniers visuels publiés, lien Instagram ; « La comunautat » (« Fòrum, grops e idèas », 21-10) si elle existe au lancement | six PNG de `canva-vf/` ; `planSite.js` l.52 | une ligne |
| 7 | Appel | finir chaud | Max Rouquette, « Prèst·a per començar ? », « Tres mots uèi, una lenga deman. », deux liens | textes existants (l.563-615) | rien |

Pas de « quatre chemins » (retiré le 15-10) ni de liste qui répète le menu.

## 4. Les trois pages de rubrique

Même gabarit pour `/parla`, `/apren`, `/viu` (21-10) : numéro et verbe en titre géant, une phrase de Romain, une grille de tuiles ; chaque tuile est un contenu, pas un lien nu, jamais vers une page absente.

- **01 Se parla** : la carte (carte en étoiles, bouton « Dobrir la carta entièra »), le wiki (30 fiches, `SIG/lengas-fichas.json`), « Un mot, cent parlars » (carte, cahier §11 12-10).
- **02 S'apren** : le parcours (frise « Camin » : module 0, unité 1), la leçon d'essai jusqu'au module 0, les cours en visio (`RESERVAR`), « Ma progression », et **Mots en imatges**, qui y passe : « c'est de l'apprentissage » (DIRECCION §1 ; refonte-claire, q2).
- **03 Amassa** : les Òbras, la bande Instagram, « La comunautat » quand elle existe. « Articles » quitte le menu : les 28 visuels de sensibilisation (marca-instagram) seront les premiers articles, en tuiles, quand Romain leur donne un texte.

## 5. Les pages intérieures

| Page | Devient |
|---|---|
| `/mots` | **la fiche gagne du texte** : occitan, prononciation, français, audio, l'humour de Romain (« Ne me demandez pas pourquoi », `03-Cos-uman/Cor.png`), « Se ditz tanben » (`Tomata.png`). Aujourd'hui : titre et images seulement (`supabase/supabase-admin-schema.sql` l.115-122 ; `FichaTunnel.svelte` l.139). Quatre colonnes de plus, saisies dans `app/src/routes/admin/designs` ; pas d'ovales, donc pas l'admin des scènes : l'ordre du 20-10 tient |
| `/carta` | gel des couches ; une « première visite » en trois gestes qui finit sur une fiche ; lien « Sus la carta » (à valider par Romain) depuis les fiches dont le mot a ses variantes LISN (trois aujourd'hui) ; le reste tel quel (carta-plaça) |
| `/aprene` | la refonte « Camin » : une frise, le module 0, l'unité 1 reliée à `/aprene/modul/1-1`, aujourd'hui orphelin (aprendre-estat) ; la scène ouvre la 1-1 avec les trois visuels de `/ensag/scena` |
| scène | de `/ensag/scena` à un composant du moteur (`app/src/lib/lesson/`) ; l'admin des scènes après la reprise Canva |
| `/compte` | refait au cadre commun, registre OUTIL : trois tailles, zéro décor (referencias) |
| `/wiki` | lot 1 : les 30 fiches de langues et dialectes déjà rédigées |
| `/istoria`, `/contacte` | faits avant le lancement : istoria-romain.md (892 mots de Romain) ; adresse Proton et `RESERVAR` |
| `/forum`, `/grops`, `/ideas` | évolution ; d'ici là, pas de lien (question 3 du §14) |

## 6. Réutilisé, jeté, nouveau (chemins vérifiés par `ls` le 22-10)

**Réutilisé tel quel** : `app/src/lib/components/` AppHeader, MenuVel, SiteFooter, AmbiancaPanel, TornarAmont, Crotz, Icona ; `app/src/lib/stores/ambianca.svelte.js` ; `app/src/lib/data/planSite.js` ; les jetons d'`app/src/app.css` et `app/src/fonts.css` avec les six woff2 d'`app/static/fonts/` (207 Ko) ; `app/src/lib/actions/animarText.js` ; `app/src/lib/acuelh/` carta-estelas.js, donadas.js, amassa.js ; `app/src/lib/lesson/` ; `app/src/lib/carta/` et la carte ; `FichaTunnel.svelte` et les fiches Supabase ; les 212 PNG de `design-stock/canva-vf/` ; les six gabarits de `design-stock/vecteurs/gabarits/` ; les huit SVG de `design-stock/logo/svg/` ; `app/static/ensag/clar/` et `app/static/ensag/scena/` (six webp légers) ; `app/scripts/verificar-oc.mjs`, `levar-esbos.mjs` ; `istoria-romain.md` ; `SIG/lengas-fichas.json`.

**Jeté** (déplacé hors d'`app/src`, Git garde tout) : `WelcomeDialog`, `OfficialitatCarousel`, `BgCarousel`, `WaveLandscape`, `PageBackground`, `OccitaniaIcon` (920 l. sans lecteur, site-actual) ; `lib/data/siteSections.js`, `icones.js` ; `routes/admin/textes` (table que rien ne lit) ; `app/static/bg/`, `app/static/officialitat/` ; les dix `static/esbos-*.html` et `maqueta-*.html`, vers `design-stock/brut/` ; `app/static/acuelh/erau.webp` (333 Ko) et `paisatge.jpg`, doublons ; le curseur et Lenis (`motor.js` l.29, 81-92 ; 33 Ko) ; les neuf contours de texte (DIRECCION §1) ; les 31 tailles d'`acuelh.css` (referencias), remplacées par trois.

**Nouveau** : `Mot.svelte` (le trio écusson, haut-parleur, drapeau, dérivé de `1-vocabulaire.png`), `Teula.svelte` (la tuile), trois pages de rubrique, `/wiki` lot 1, `/istoria`, `/contacte`, quatre champs dans l'admin des fiches, un marqueur « fiche de la semaine ».

## 7. Direction visuelle

- **Fond** : plâtre `#F7F3EE`, pierre `#EDE6DC` pour le papier des tuiles, encre `#2A1A10` (charte §1).
- **La seule couleur vive** : la brique `#B53D17`, pour les boutons, le lien courant et la croix (ocre et rouge, 21-10) ; l'or `#9C5611` pour les petits textes. **Les tuiles portent leurs propres couleurs** (pétrole, brique, nuit, ocre : fonds mesurés des 169 visuels pleins, marca-instagram), la page jamais.
- **Typographie** : Limelight pour le titre géant et le mot occitan de chaque tuile (déjà le titre du gabarit `1-vocabulaire.png`) ; Luciole pour le reste ; Cormorant italique pour Max Rouquette seul, ce qui ferme le point ouvert de la charte §2. Trois tailles.
- **Images** : les visuels Canva tels quels, carrés, servis en 540 px webp (40 à 60 Ko) ; deux photos « sang e aur » (Romain, l'Hérault) ; aucune image générée.
- **Instagram et le Plâtre réconciliés** : le visuel est l'unité dense (six étiquettes dans un carré), la page est la grille qui respire ; une grille Instagram est justement une page blanche de carrés (referencias §4). L'humour et la prononciation « à la française », signatures des visuels absentes du site (marca-instagram), reviennent en texte dans la tuile. De Parpeix, seulement les règles : fond clair, un accent, titre géant, grille.

## 8. Le mouvement

Une seule chose bouge par écran (sur téléphone, chaque bloc est un écran) : ouverture, les lettres en braise au survol (sans halo, 21-10) ; 01, la carte en étoiles qui se dessine ; 02, une pastille dorée qui respire sur la scène, le geste de la leçon ; 03 et 07, rien, les tuiles se soulèvent au survol. Ce qui part : le fond WebGL hors option « Venas d'aur », Lenis, le curseur, le flux d'Amassa (il va en tête de `/viu`). Version légère (charte §5septies) : tout immobile, la carte dessinée d'un coup, images seules.

## 9. Lancement, évolution

**Lancement** : l'accueil en sept blocs ; trois pages de rubrique ; les fiches avec texte (sans texte, l'image seule) ; `/aprene` Camin, module 0 et unité 1 reliés ; la scène dans la 1-1 ; `/wiki` lot 1 ; `/istoria`, `/contacte` ; un menu sans 404 ; l'audio de la 1-1 (17 fichiers, `app/static/audio/moduls/1-1/LISTA.txt`) ; le sombre dérivé du clair ; la version légère.
**Évolution** : admin des scènes et 200 scènes ; forum, groupes, idées ; articles (28 visuels de sensibilisation) ; calendrier (20 visuels) ; wiki lot 2 ; couches de carte ; salle 3D ; unités 2 à 10 ; modèle économique.

## 10. Heures

| Romain | Heures |
|---|---|
| Phrase du titre, trois lignes d'intention, trois d'origine (dictées) | 1 |
| Trio des 212 fiches, une minute chacune, deux soirées | 4 |
| Audio de la 1-1 : 17 fichiers | 2 |
| Module 0 : deux séances dictées sur questions de Claude | 3 |
| Validation occitane de l'unité 1 (deux questions de graphie, `cursus/modules/1.1-adieu-cossi-vas.md` l.104 et l.199) | 1,5 |
| Relecture d'istoria-romain.md pour `/istoria` | 0,5 |
| Trois décisions du §14 ; fiche de la semaine | 1 ; 5 min par semaine |
| **Total** | **13 h** |

Séances de Claude, une par chantier, sans agents (retour du 09-10) : S1 accueil et `acuelh.css` à trois tailles ; S2 `Mot`, `Teula`, `/mots` avec texte, admin ; S3 pages de rubrique, `planSite.js` sans 404, `/istoria`, `/contacte` ; S4 `/aprene` Camin, moteur relié, scène dans la 1-1 ; S5 `/wiki` lot 1 ; S6 `/compte`, version légère, sombre dérivé, nettoyage du §6 ; S7 `npm run build`, captures téléphone et 1830 px, contrastes. Sept séances de deux à trois heures, chacune close par un commit.

## 11. Décisions existantes qui frottent

| Décision | Proposition | Rouvrir ou respecter |
|---|---|---|
| 15-10 : « un seul bouton principal, la carte » (§11 l.318) | la fiche de la semaine au centre de l'ouverture | **rouvrir** : la demande du 21-10 recentre sur les publications ; la carte « a pris toute la place » et garde la section 01 entière. Question 1 |
| 15-10 : « lien normal dès maintenant » aux rubriques non faites | aucun lien vers une page absente | **rouvrir** : le 21-10 constate « la structure doit exister avant l'habillage » ; charte §5ter. Un lien mort n'est pas une fonction, la règle du 14-10 tient. Question 3 |
| 15-10 : Mots en imatges sous Amassa | passe dans S'apren | question ouverte (DIRECCION bloc 3, q3), pas un verrou. Question 2 |
| 21-10 : « l'accueil reste… rien à ajouter » | un bloc ajouté (la fiche), la bande de visuels en 03 | **rouvrir** par la demande postérieure, « page presque blanche » ; Romain confirme |
| PILOTATGE 3 : accueil = esbòs de nuèch | le code de `lib/acuelh` reste | déjà remplacée le 21-10 |
| 20-10 : Canva d'abord, admin des scènes ensuite | champs de texte dans l'admin des fiches | **respecter** : pas l'admin des scènes |
| 07-10 : palette « calée sur Instagram » | plâtre pour la page, couleurs Instagram dans les tuiles | **respecter** les deux : la mesure les réconcilie |
| 14-10 : bandes séparées écartées | titre et filet, pas de bandes | respecter |
| 29-08 : pas d'appel API depuis le site ; module 0 remplace l'essai ; typographie du 30-09 | inchangés | respecter |

## 12. Trois « oser »

1. **Le site commence par une publication, pas par un slogan.** Sur téléphone, la fiche de la semaine est plus grande que le titre. Un visiteur comprend Lo Ligam en une tuile, comme sur Instagram depuis 2022.
2. **La prononciation écrite en gros, partout.** La « bouche qui parle » des visuels (marca-instagram) entre dans la fiche, la scène et la leçon, en Limelight, à la hauteur du mot : l'usage vivant de Romain (29-08), assumé.
3. **Le mot mène au pays.** Depuis une fiche, « Sus la carta » ouvre la carte sur les variantes du mot (« Un mot, cent parlars », trois mots aujourd'hui) ; depuis la carte, une commune mène aux fiches de son dialecte quand « Se ditz tanben » les connaît. La carte devient l'arrière-pays des fiches : C sans la porte.

## 13. Gabarit en texte de l'accueil

Blocs 1 et 4 à 6 : une phrase `[a escriure per Romain]` sous le titre.

1. **Ouverture.** Titre : « L'occitan » puis « Se parla. S'apren. Amassa. » ; image : fiche de la semaine, ex. `design-stock/canva-vf/11-Meteo/Plou.png` (540 px webp), étiquette « Lo mot de la setmana » (à valider par Romain) ; liens : la fiche vers `/mots#<fiche>`, « Aprene l'occitan » vers `/apren` ; croix `Crotz.svelte`, recette claire.
2. **Bandeau.** Onze mots des fiches, `[a causir per Romain]` ; liens : chaque mot vers sa fiche.
3. **Qu'es aquò, Lo Ligam ?** Texte : `MANIFEST` (à valider) ; trois lignes de istoria-romain.md §8 ; image : `app/static/ensag/clar/romain-480.webp` ; lien « Mon istòria » vers `/istoria`.
4. **01 Se parla.** Image : carte en étoiles (`carta-estelas.js`) ; liens : « Dobrir la carta entièra » vers `/carta`, « Lo wiki de las lengas e dels luòcs » vers `/wiki`.
5. **02 S'apren.** Image : `app/static/ensag/scena/ostal-net.webp` ; trois façons : « En visio, amb ieu » (`RESERVAR`), « A ton ritme » (`/aprene`), « Sus mesura » (`RESERVAR`).
6. **03 Amassa.** Images : six PNG de `canva-vf/` choisis par Romain ; liens : « Mots en imatges » vers `/mots`, « Òbras » vers `/obras`, Instagram (`planSite.js` l.52) ; « La comunautat » seulement si elle existe.
7. **Appel.** Max Rouquette (texte existant) ; « Prèst·a per començar ? » ; « Tres mots uèi, una lenga deman. » ; liens : « Reservar un primièr cors » (`RESERVAR`), « Començar sol·a » (`/aprene`).

## 14. Trois questions pour la première séance, une à la fois

1. **L'ouverture** : la fiche de la semaine est-elle l'action principale (la carte garde la section 01), ou la carte garde-t-elle son bouton et la fiche n'est que l'image ?
2. **Mots en imatges** : passe dans S'apren, ou reste dans Amassa ?
3. **Les pages absentes** (Articles, Fòrum, Grops, Boita d'idèas) : retirées du menu jusqu'à ce qu'elles existent, ou une page d'attente honnête ?
