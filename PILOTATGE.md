# Pilotatge — tableau de bord de Lo Ligam

> **Le document de reprise.** Créé le 2026-09-18 après l'inventaire complet du
> projet (6 agents, tous les documents et tout l'historique Git relus), à la
> demande de Romain : « il va falloir que tu m'aides à faire la gestion de ce
> projet et que je puisse repartir d'une bonne manière. »
>
> **Rituel** : toute conversation l'OUVRE en début de séance et le MET À JOUR
> en fin de séance. Une conversation = un chantier. Les décisions vont au
> §11 du cahier des charges ; ici, seulement l'état et la prochaine action.

## La photo du projet (2026-09-18)

Le socle est solide : un site en ligne sur infrastructure européenne avec
déploiement automatique, une unité 1 complète et jouable (4 modules, lexique
vérifié par les API du Congrès), un cursus A1→C2 cadré, une identité visuelle
tranchée et appliquée, et une cinquantaine de décisions datées au journal.

L'impression de « tout reprendre à chaque fois » ne vient pas d'un manque de
décisions : elle vient d'un **défaut de consignation** — des décisions clés
vivent hors du journal §11, des sections périmées n'ont jamais été barrées,
et chaque conversation retombe sur des textes qui ne disent plus la vérité.
Ça se répare en deux séances : un **toilettage documentaire** (Claude) et une
**séance d'arbitrage** (Romain). Ensuite, la file de production est limpide —
et l'essentiel de ce qui reste est exactement ce que Romain veut garder pour
lui : rédiger le module 0 depuis ses livres, enregistrer sa voix, choisir ses
photos.

## Répartition des rôles (rappel permanent)

- **Romain, et lui seul** : la vision, les livres et ressources, le choix et
  la prise des photos, la voix, la validation de l'occitan, chaque décision.
- **Claude** : le code, la recherche, la mise en forme des matériaux de
  Romain — jamais de contenu inventé à sa place.
- **Ensemble** : les choix visuels, sur maquettes comparées, une décision à
  la fois.

## Les chantiers

| # | Chantier | État | Prochaine action (UNE seule) | Qui |
|---|---|---|---|---|
| 1 | **Toilettage documentaire** | ✅ fait le 2026-09-18 | 18 corrections vérifiées par relecture de contrôle (cahier v0.6, §11 complété, bandeaux sur les 4 docs de juillet, charte à jour, cursus annoté, §9 question 15 ajoutée, titre unité 2 harmonisé en « D'ont siás ? ») | Claude |
| 2 | **Séance « Estructura » : blocs & concept** | **prochaine séance (choix de Romain, 18-09)** | Consolider l'ossature avant de remplir : (a) le concept en une page, avec les mots de Romain ; (b) `estructura-site.md` — tous les blocs du site, page par page, chacun avec rôle / état / source de remplissage (livre de Romain, ses photos, sa plume, API, Claude) | ensemble |
| 2b | **Séance d'arbitrage** (questions ouvertes) | après la séance Estructura | Claude pose les questions une par une, Romain tranche ou classe « plus tard » explicitement ; tout part au §11 | ensemble |
| 2c | **Redesign visuel** (méthode : planches comparées + esbòs, §11) | **Base validée le 06-10 : l'« esbòs de nuèch »** (`app/static/esbos-nuech.html`, consultable sur téléphone : https://claude.ai/artifact/G5uEmXxrZLb2dpE8jpKw5q, copie à republier après chaque changement : `node outils/esbos-telefon.js <dossier>` puis publication sur le même lien). Fond « Venas d'aur » palette **Brasa** (couleurs des 213 visuels Instagram), croix-constellation, bandeau du **Lexic de Max Roqueta**, « Tres biais d'aprene » (visio Proton, parcours jusqu'au B1, sur mesure / Lyon), sélecteur de langue de cours (drapeaux), **carte en étoiles** (304 lieux, rivières, relief, noms au toucher sur téléphone, Montpelhièr prioritaire, Vielha / Draonier / Baiona), citation **Max Roqueta** sur la fenêtre de l'Erau, photo de Romain, rendez-vous **Proton Calendar** branchés. **Vrai site** : cadre commun ✅ (en-tête, pied de page, ambiance thème sombre/clair/système + daltonisme, bouton « Tornar amont ») ; galerie **Afichas** sur /obras ✅ ; **accueil porté dans le site le 07-10** ✅ (`app/src/lib/acuelh/` + `routes/+page.svelte`, première page en thème sombre ; textes plus éditables dans /admin/textes, à rebrancher) ; **Mots harmonisée le 07-10** ✅ (sommaire des thèmes en colonne fixe / ligne glissante sur téléphone ; par défaut, fiches regroupées par thème façon profil Instagram, la vignette s'agrandit en carrousel du thème). Idée en attente : récupérer les sources Canva pour des fiches « immersives » (calques animés), à tester sur un thème. Mis de côté : steampunk (« trop IA »). | **Carte, étape 1 faite (07-10)** : la carte en étoiles est la carte (§11). Suite carte : relief, dialectes / départements / régions, puis Europe et monde. Harmoniser ensuite òbras, parcours (à la 3e page, regrouper le cadre commun des pages harmonisées : fond, bandeau pleine largeur, repères) ; rebrancher les textes de l'accueil sur /admin/textes. Les retouches de l'accueil se font désormais dans le site (l'esbòs reste comme archive). En attente de Romain : validation dicodòc de l'occitan nouveau (bandeau, légendes, rivières, dialectes, « Tres biais »…) ; liens Occitanica des affiches ; phrase-clé A/B/C ; titre de la page de réservation Proton à renommer ; nouvelle photo (sans manteau) ; découpe du nòrd-occitan en 3 dialectes dans QGIS (plus tard) | ensemble |
| 2d | **Logo + nouvelle typographie** (30-09, §11) | logo croix-constellation en cours dans Canva (symbole ✅ test favicon, carré ✅) ; typo Barrio/Limelight/corps tranchée | **Logo ✅ intégré (variante C) et polices ✅ migrées le 30-09** (Barrio/Limelight/Luciole auto-hébergées, vérifié à l'écran). Master Canva ✅ répercuté en C et réexporté (8 SVG, dont un nouveau format nom-en-arc). Palette ✅ alignée sur le logo le 30-09 (§11). Restent : crédit Luciole (CC BY) sur la future page accessibilité · direction redesign « éditorial aéré » actée au §11 · rappels d'erreur Vercel à éteindre (projet fantôme côté compte Vercel de Romain, rien dans le dépôt). Bibliothèque de blocs comparés toujours à bâtir (Romain juge le graphisme actuel « trop classique Claude ») — à articuler avec Estructura (2) | Claude |
| 3 | **Module 0** (« L'occitan… Kezako ? ») | bloqué | Romain écrit son brouillon d'intro d'une page, depuis ses livres et sa vision ; Claude met en forme ensuite | Romain |
| 4 | **Audio de l'unité 1** (sa voix) | bloqué | Enregistrer UNE scène (le soir du 1.1) au téléphone pour relancer la machine — les LISTA.txt de chaque dossier disent quoi enregistrer | Romain |
| 5 | **Validation occitane** (modules 1.1-1.4 + promesse) | bloqué | Une session dicodòc : relire les 4 modules, trancher les 3 questions de graphie notées dans le 1.1, valider la ligne de promesse | Romain |
| 6 | **Refonte de /aprene en « Camin »** | à faire | Construire le sommaire du cursus avec la frise du chemin (essai → Modul 0 → A1) et les 4 modules de l'unité 1 visibles | Claude |
| 7 | **Transposition Racine² sur le site** | à faire | Coder le premier lot : ligne de promesse + ancre héros, pages A prepaus + Contacte, FAQ accordéon, kit de fluidité | Claude |
| 8 | **Photos « sang e aur »** | bloqué | Romain inventorie ses photos existantes et pressent son casting ; Claude prépare le modèle d'autorisation (droit à l'image et à la voix) | Romain |
| 9 | **Vidéo et design-stock** (~60 Mo hors Git) | flou | Claude mesure Officialitat.mp4, propose un plafond de poids et une règle écrite « quoi committer / quoi archiver » ; Romain tranche | ensemble |
| 10 | **Réveil technique** | bloqué | Romain ouvre le tableau de bord Supabase et relance le projet (2 minutes — le plan gratuit se met en pause après inactivité) | Romain |
| 11 | **Courriels** (Votz/CGU lo Congrès + relance LISN) | bloqué | Claude prépare les deux brouillons ; Romain les envoie de sa boîte | Romain |
| 12 | **Autoformation de Romain** (décision du 2026-10-04) | **en cours, prioritaire sur 3, 5 et 6** | Suivre `autoformation-parcours.md` étape par étape ; écrire la page de l'étape 1 dans `carnet-concepcion/etapa-1-nivels.md` ; Claude relit avec cinq questions, vérifie, code, ne produit plus de contenu pédagogique à sa place | Romain |

## Les décisions déjà prises — à NE PAS rouvrir

(Le §11 du cahier des charges fait foi ; ceci est l'aide-mémoire.)

1. **2026-08-22 — Site vs application : tranché.** Un seul produit, deux
   registres (RÉCIT expressif / OUTIL sobre), une seule adresse, pas d'app
   native.
2. **2026-08-22 — Typographie : tranchée et en production.** Syne (titres),
   Instrument Sans (courant), Cormorant Garamond italique (citations),
   Fredoka logo seul.
3. **2026-08-22 — Accueil** : héros « Lo riu » + 6 stations ; reconfirmé le
   18-09.
4. **2026-07-28** — Graphie classique · nom « Lo Ligam » · MVP = A1 òc+fr ·
   15 ans minimum · questionnaire en minimisation RGPD.
5. **2026-08-29** — UN seul chemin d'apprentissage (le cursus) ; module 0
   sans compte remplacera l'essai libre ; rythme au choix de la personne.
6. **2026-08-29** — Gamification : Arbre del Ligam, còla pyrénéenne, Fuòc de
   l'ostal, zéro classement ; catalogue d'exercices : socle + 6 mécaniques.
7. **2026-08-29** — API lo Congrès : conception/vérification seulement,
   jamais d'appel depuis le site public.
8. **2026-08-29/30** — Prononciation = l'usage vivant de Romain ; style des
   textes apprenants fixé.
9. **2026-08-30** — Photos « sang e aur » : 3 niveaux, double liseré, refus
   des images IA (charte §3bis).
10. **2026-08-08/09** — SvelteKit + Supabase (UE, migration reportée
    sciemment) + Scaleway Paris, déploiement automatique.
11. **2026-08-03/04/06** — Admin : RLS seul rempart, SVG interdit, MP4 à
    l'ouverture de fiche, pas de CMS externe, tout texte visible en base.
12. **2026-09-03** — **Romain est seul** : tout se classe lancement /
    évolution (grille §8 bis de l'état de l'art des parcours).
13. **2026-09-18** — Transposition Racine² actée (`transposicion-racine2.md`).
14. **2026-10-04** — **Romain monte en compétence lui-même** : Claude vérifie,
    questionne et code ; plus de contenu pédagogique produit à sa place
    (`autoformation-parcours.md` §2). Les documents pédagogiques existants
    deviennent des hypothèses à relire par lui.

## Les vraies questions ouvertes (pour la séance d'arbitrage)

1. **Modèle économique** : où passe la limite gratuit/payant du parcours
   autonome ? La logique solidaire est-elle la même qu'en visio ? *(ouverte
   depuis le 31-07 — conditionne le statut juridique et le périmètre)*
2. **Combien d'unités A1 pour lancer** ? L'ancien repère (4-6) n'a jamais été
   confronté au nouveau volume (10 unités + module 0 = 41 modules).
3. **La cartographie passe-t-elle en premier ?** À trancher avant de
   réorganiser les phases ; dépend de la réponse du LISN (relance à envoyer).
4. **Statut juridique** : micro-entreprise ou association ? (verrouille dons
   et paiement solidaire)
5. **Les 14 questions d'arbitrage du §9** de l'état de l'art des parcours
   (répétition espacée, courriel hebdo, animations par défaut…).
6. **Le nom « Lo Ligam »** : domaine, INPI, stores — vérifiés ou pas ?
7. **Casting** : qui joue les personnages ? (+ autorisations écrites)
8. **design-stock** : que committer, qu'archiver ? (~60 Mo hors Git)

## Restes du toilettage (2026-09-18) — pour les conversations concernées

- Conversation pédagogie : confirmer la question 15 du §9 (tableau spiralaire
  vs cartes) et harmoniser les annonces des cartes A2/B1/B2 ; corriger dans
  `corpus-design.md` l'attribution de la revue Duolingo (Shortt et al. 2021,
  pas Loewen) ; décider du sort d'`unitat-1-adieu.md` (archive ?).
- Romain : les deux maquettes photo (`maqueta.html` committée-validée vs
  `maqueta-view.html` non committée) — laquelle fait foi ?
- Actions déjà au tableau : courriels (chantier 11), clé Scaleway avant le
  2027-08-08, réveil Supabase (chantier 10).

## Incohérences purgées le 2026-09-18 (archive du chantier 1)

- En-tête du cahier figé à « v0.5 · 31 juillet » alors que le journal court
  jusqu'au 18-09.
- Décision du 03-09 (« Romain est seul ») absente du §11.
- Trois formulations site/app périmées (§3, §5, ligne du 28-07) contredisent
  le 22-08.
- Audio : la ligne « Votz d'abord » du 28-07 contredite par le 29-08 et par
  la voix de Romain déjà en ligne.
- §6 présente comme acté un modèle « envisagé, pas tranché ».
- §13 « Prochaines étapes » périmé ; cases §10 non cochées.
- Les 4 documents de juillet sans bandeau « remplacé par le cursus v0.3 ».
- Incohérences internes du cursus (261 vs 258 modules, RS5464 échue, titre
  unité 2, tableau spiralaire).
- Charte : bandeau « v0.1 · hex approximatifs » malgré des décisions
  définitives ; kit de fluidité Racine² à y intégrer.
- Deux maquettes photo concurrentes (maqueta.html vs maqueta-view.html) —
  laquelle fait foi ?
- §8 : « contacter lo Congrès » encore écrit alors que c'est fait ;
  l'expiration de la clé API Scaleway (2027-08-08) écrite nulle part.
- L'essai libre « remplacé » par le module 0 mais toujours en ligne sans
  date de bascule écrite.
