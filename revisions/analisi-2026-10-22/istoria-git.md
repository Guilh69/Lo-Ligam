# Lo Ligam : ce que raconte l'historique Git (28 juillet → 21 octobre 2026)

Corpus : 682 commits, 86 jours calendaires, 35 jours de commits, 43 séances (blocs séparés de plus de 3 h). Sources : `git log` en lecture seule, journal §11 de `cahier-des-charges.md` (numéros de ligne), `PILOTATGE.md`, `DIRECCION.md`, `istoria-romain.md`. Les parts par thème viennent de mots-clés sur les sujets de commits : des ordres de grandeur.

## a) Chronologie en onze périodes

| Période | Commits | Ce qui a été construit (commits) |
|---|---|---|
| P1 · 28-31 juillet | 81 | Cinq documents de cadrage (0443b07), squelette SvelteKit (5c0116a), 24 commits pour verser le stock Canva (49934f4 → 0c2fe82), fond animé de designs (b1883f3), essai libre (db0c49e), compte Supabase + questionnaire (1bf3ccf, 7fc3cf5), premier volet carta (71638b3), Vercel (§11 l.191). Le 31 juillet seul : 21 commits d'accueil (7facdac → e88ed0b). |
| P2 · 2-9 août | 70 | Images 16,9 Mo → 355 Ko (08fab9c), 213 fiches en bibliothèque (5b448fa), espace d'administration et verrous RLS (dd40e1a → 367c19d), carte pilotée par Supabase puis couches génériques (88371d1, dcda1d6), sécurité, mentions légales, polices auto-hébergées, migration Scaleway (dcc2c97 → 15a8b4a). |
| P3 · 22 août | 13 | Une nuit (00:06 → 01:52) : corpus design, « un seul produit, deux registres », typographie Syne / Instrument / Cormorant, accueil « Lo riu » (0c8ed8a → 139999d). |
| P4 · 25-30 août | 31 | Cursus A1-C2 et moteur de leçon (560270e, 7fad032), script de vérification lo Congrès (63d3634), méthode A → D (8b4f54c → 243032c), unité 1 jouable (ce9491d), première voix de Romain (58f843d), système photo « sang e aur » (1a4ce03). |
| P5 · septembre | 18 | Quatre jours de commits. Contrainte « Romain est seul » (55f853e), transposition racine2 et naissance de PILOTATGE (21fb968, 9e672c9), Claude Design (a26a839) ; le 30 : logo croix-constellation, Barrio / Limelight / Luciole, palette alignée, maquette « editorial aerat » jugée « es geniala » (4adf3a4 → 23e6e08). |
| P6 · 1-5 octobre | 3 | Règle multi-ordinateurs (4a000d8), autoformation : Romain conçoit le parcours (4f3b39c), accueil éditorial intégré (0be83e2). |
| P7 · 6 octobre | 26 | Passe « hauts standards » après minuit (0e39c16) ; le soir, esbòs de nuèch et repositionnement cours en visio (61d6b11, 647a7bd) : 46 commits d'une traite jusqu'à 01:18. |
| P8 · 7-12 octobre | 363 | 53 % de l'historique en six jours, dont 239 commits de carte : la carte en étoiles devient la carte (5d1bf30), Occitanica, dialectes, communes, langues voisines (catalan, arpitan, basque, oïl, breton, alsacien, corse, flamand), fiches de communes, voix de l'Atlas ; bilan du 08-10 (4494c28) ; six gabarits de publication (f146b1f) ; rangement du projet (c7ad9b1). |
| P9 · 14-16 octobre | 50 | Retours de Cyril (8a57716), loligam.eu (8900cf6 → e124a3e), garde-fou Git (759150f), accueil « Se parla. S'apren. Se viu. » (bc01763), menu définitif (5dc02f0), reprise du parcours et scène de l'unité (4ecec1d → 183cc48). |
| P10 · 19-20 octobre | 17 | Mémoire de la carte sur téléphone (634afff), couche active façon QGIS (b87f6fa), révélateur « Lumière avec pastilles » et admin des scènes décidés (e0cb9c2, e92fe84). |
| P11 · 21 octobre | 10 | Refonte claire « Plâtre » (2f55bc4, c36df3e), logo aux couleurs de Romain (609ee75), « Se parla. S'apren. Amassa. » et DIRECCION.md (e8eafea). |

## b) Où est passé le temps

| Thème (classement exclusif) | Commits | Part |
|---|---|---|
| Carte : carta, SIG, langues, Atlas | 290 | 43 % |
| Documents : PILOTATGE, cahier §11, bilans, règles | 124 | 18 % |
| Accueil, design, typographie, logo, thème | 91 | 13 % |
| Apprentissage et contenu : leçons, Mots, design-stock, scènes | 68 | 10 % |
| Admin, infrastructure, déploiement, sécurité | 32 | 5 % |
| Inclassable | 77 | 11 % |

Les fichiers touchés confirment : `app/src/lib/carta` 292 touches contre `lib/lesson` 55 et `lib/acuelh` 63 ; `SIG/` 344 ; `PILOTATGE.md` 137 et `cahier-des-charges.md` 131, soit 268 touches pour deux fichiers de pilotage. Les routes `aprene` comptent 32 touches : le code d'apprentissage pèse moins de 5 % de l'effort, alors que le cahier le pose comme cœur du MVP (§11 l.173 : « MVP = apprentissage languedocien + onboarding + relais »). Lignes ajoutées : juillet +8 534, août +18 531, septembre +1 334, octobre +125 440 (données SIG comprises).

## c) Les retours en arrière

| Objet | Versions successives |
|---|---|
| Accueil | Vitrine « inspirée de VanMoof » (28-07, 66fe9ab) → fond animé de designs (29-07, b1883f3) → menu unifié, vagues, « Benvenguda » (31-07, 7facdac) → « la promessa pòrta la pagina » (03-08, b23959f) → « Lo riu » (22-08, a516a29) → « editorial aerat » (30-09, 23e6e08 ; intégré le 05-10) → hauts standards (06-10, 00:10) → esbòs de nuèch le soir même (61d6b11), porté dans le site avec −1 943 lignes de `+page.svelte` (07-10, 468e98d) → « Quatre camins » (14-10, 8a57716) → « Se parla. S'apren. Se viu. » (15-10, bc01763) → Plâtre et « Amassa » (21-10). Neuf accueils en douze semaines. |
| Typographie | Fredoka + Inter (08-08, 21c5830) → Syne / Instrument Sans / Cormorant (22-08, 08ef680) → Barrio / Limelight / Luciole (30-09, 59940d3) → Barrio sort (05-10, §11 l.236). Trois systèmes, les polices précédentes supprimées chaque fois (`git log --name-status -- app/static/fonts`). |
| Logo | Logo Fredoka (28-07) → croix-constellation de Romain, variante C (30-09, 4adf3a4, e3e8111) → couleurs de Romain seules (21-10, 609ee75). |
| Palette | Terracotta / or de l'Instagram (§11 l.189) → brique #B53D17 alignée sur le logo (30-09, 123c84a) → « Brasa », tirée des publications Instagram (07-10, ea88dd0) → gamme « Éclat » (15-10, 13395a6) → Plâtre clair (21-10). |
| Fond, thème | Crème clair (28-07 → 05-10) → sombre par défaut (06-10, §11 l.238) → braise automatique sur téléphone, retirée le jour même (14-10, 05982a7 puis 4ab1184) → clair par défaut, sombre en option (21-10, §11 l.335). |
| Hébergement | Vercel (31-07) → Scaleway (08-08) ; Vercel « secours » débranché le 07-10, il ne marchait plus depuis le 08-08 (§11 l.256). |
| Outil de design | Canva → Claude Design (18-09, a26a839) → « mis en pause », retour Canva (30-09, §11 l.234) → EffectCraft / VectorCraft (12-10, 8fecd8f). |
| Carte | Couches admin Supabase (06/07-08) → catalogue dans le code (07-10, §11 l.246) ; Croissant retiré puis retracé le même après-midi (07-10, 1bccc42, bf2c1cd) ; vue d'ensemble 70 → 50 → 70 km (78b4f99, ebc0ae5) ; mentonnais vivaro-alpin (07-10) → zone de transition (12-10, §11 l.311) ; couche Départements retirée (12-10, ec80728). |
| Révisions à J+1 | Vidéos « aucun MP4 » (03-08) révisée le 04-08 (§11 l.199) ; fond « inspiré microsoft.ai » annulé en six minutes (31-07, c21ea46 → 2d6c5a9). |

Deux `Revert` formels seulement (31-07, 09-10) : on revient en arrière en réécrivant, pas par Git. 62 sujets parlent de retrait, d'écart ou d'annulation.

## d) Ce qui a tenu depuis le début

- Nom, graphie classique, quatre phases, âge minimum 15 ans, occitan par défaut + français (§11 l.173-190) ; sélecteur Òc / Fr fonctionnel le 31-07 (4dfbb8b), partagé sur tout le site le 02-08 (6b7968d).
- Le socle : SvelteKit (28-07), Supabase (31-07), déploiement automatique Scaleway (08-08), loligam.eu (15-10). Jamais refait.
- Le stock Canva : versé le 29-07, 213 fiches le 03-08, 242 fichiers encore suivis dans `design-stock/`, devenu « Mots en imatges » puis regroupé « coma un perfil Instagram » (07-10, 48de39a).
- La croix occitane : premier écran (28-07, 8aefd2f), croix-constellation (30-09), icône « Lenga » de la carte (09-10, 74f6e5a), « croix ocre et rouge » (21-10).
- La vérification par l'API de lo Congrès (29-08, 63d3634), étendue (`--fr` 09-10, `--topo` 10-10), inscrite dans CLAUDE.md (e949bd6).
- L'unité 1 (quatre modules) et le moteur de leçon (25 et 29-08) : jouables depuis, jamais refaits (`lib/lesson` 55 touches).
- Le journal §11, tenu sans interruption du 28-07 au 21-10.
- La sobriété comme réflexe : compression (02-08), polices auto-hébergées (08-08), geojson compressés (08-10, f0f34cb), mémoire téléphone 589 → 315 Mo (19-10, §11 l.327).
- La carte : ouverte le 31-07 (71638b3), jamais abandonnée, « chantier principal depuis octobre » (PILOTATGE l.62).

## e) Le rythme de Romain

- 35 jours actifs sur 86, 43 séances. Des rafales : la séance du 9 octobre 09:42 au 10 octobre 03:57 compte 111 commits sur dix-huit heures ; celle du 7 octobre 11:10 → 19:28, 58.
- 252 commits (37 %) entre 22 h et 4 h, 129 (19 %) après minuit ; heure de pointe 23 h (77). Mercredi 146, vendredi 135, samedi 135 : 61 % à eux trois.
- Trois pauses : 10-21 août (12 jours), 4-17 septembre (14), 19-29 septembre (10). Septembre, 18 commits, est le mois de la reprise documentaire : « il va falloir que tu m'aides à faire la gestion de ce projet et que je puisse repartir d'une bonne manière » (PILOTATGE l.4-5).
- Méthode lisible dans les sujets : 85 commits parlent d'essai, de planche, de comparaison, d'esbòs ou de maquette ; 57 citent Romain (« causida de Romain », « retorn de Romain »). La décision se prend devant plusieurs variantes, l'essai est retiré ensuite (15-10 : d0ecd64 → b5dbdd0, a4cb624 → 13395a6).
- Ce qui marche, d'après les traces : une nuit, un sujet, une méthode par étapes consignée (22-08 ; étapes A → D du 29-08 ; 7-12 octobre). Ce qui bloque, dit par Romain le 21-10 : « trop de bruit, pas assez de structure » (§11 l.335), « on avance à l'aveugle » (l.340) ; sept liens du menu en 404 et le chantier 2 « Estructura » du 18-09 « jamais tenu » (l.340).

## Instagram, l'origine, dans le Git

Le fil est posé le premier jour : « Identité visuelle = celle de l'Instagram Lo Ligam existant » (§11 l.189). Romain le raconte : « En 2022, je me suis lancé, sans trop savoir pourquoi, dans un compte Instagram » ; « des animations de plus en plus travaillées, avec Canva comme outil principal » (istoria-romain.md l.39-41). Il revient par touches : palette « Brasa » (07-10), Mots « coma un perfil Instagram » (07-10), six gabarits de publication (12-10). Huit sujets de commits sur 682 nomment Instagram. La question reste ouverte dans DIRECCION.md bloc 5 (l.173-179) : les visuels Instagram « (brique, or, dense) et le site (plâtre, aéré) ne se ressemblent pas encore » ; « Le site doit-il ressembler à tes visuels Instagram … ou en être le calme à côté ? ».
