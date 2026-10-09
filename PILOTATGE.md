# Pilotatge — tableau de bord de Lo Ligam

> **Le document de reprise.** Créé le 2026-09-18 après l'inventaire complet du
> projet (6 agents, tous les documents et tout l'historique Git relus), à la
> demande de Romain : « il va falloir que tu m'aides à faire la gestion de ce
> projet et que je puisse repartir d'une bonne manière. »
>
> **Rituel** : toute conversation l'OUVRE en début de séance et le MET À JOUR
> en fin de séance. Une conversation = un chantier. Les décisions vont au
> §11 du cahier des charges ; ici, seulement l'état et la prochaine action.
>
> **Dernier point d'étape : `BILAN-2026-10-08.md`** (révision complète de la
> carte et du site, nuit du 7 au 8 octobre : 52 corrections, 94 constats
> restants, ce que Romain peut faire seul, ce qui concerne chaque
> conversation). À lire avant de reprendre un chantier.

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
| 2c | **Redesign visuel** (méthode : planches comparées + esbòs, §11) | **Base validée le 06-10 : l'« esbòs de nuèch »** (`app/static/esbos-nuech.html`, consultable sur téléphone : https://claude.ai/artifact/G5uEmXxrZLb2dpE8jpKw5q, copie à republier après chaque changement : `node outils/esbos-telefon.js <dossier>` puis publication sur le même lien). Fond « Venas d'aur » palette **Brasa** (couleurs des 213 visuels Instagram), croix-constellation, bandeau du **Lexic de Max Roqueta**, « Tres biais d'aprene » (visio Proton, parcours jusqu'au B1, sur mesure / Lyon), sélecteur de langue de cours (drapeaux), **carte en étoiles** (304 lieux, rivières, relief, noms au toucher sur téléphone, Montpelhièr prioritaire, Vielha / Draonier / Baiona), citation **Max Roqueta** sur la fenêtre de l'Erau, photo de Romain, rendez-vous **Proton Calendar** branchés. **Vrai site** : cadre commun ✅ (en-tête, pied de page, ambiance thème sombre/clair/système + daltonisme, bouton « Tornar amont ») ; galerie **Afichas** sur /obras ✅ ; **accueil porté dans le site le 07-10** ✅ (`app/src/lib/acuelh/` + `routes/+page.svelte`, première page en thème sombre ; textes plus éditables dans /admin/textes, à rebrancher) ; **Mots harmonisée le 07-10** ✅ (sommaire des thèmes en colonne fixe / ligne glissante sur téléphone ; par défaut, fiches regroupées par thème façon profil Instagram, la vignette s'agrandit en carrousel du thème). Idée en attente : récupérer les sources Canva pour des fiches « immersives » (calques animés), à tester sur un thème. Mis de côté : steampunk (« trop IA »). | **Carte, étape 1 faite (07-10)** : la carte en étoiles est la carte (§11). Trait de côte ✅ (carte + accueil), relais sans doublons avec OSM ✅, repère doré cliquable des villes à fiche ✅ (prototype Montpelhièr, « Lèu »). Relief ✅ (courbes de niveau, 07-10). Noms en 4 niveaux (métropoles, villes repères, villes du département, villages) ✅ ; relais net vers OSM ✅ ; barre de recherche (lieux oc/fr, départements, régions, sans service extérieur) ✅. Suite carte : dialectes / départements / régions, puis Europe et monde. Régions / départements révélés au survol ou au clic dans un vide ✅, frontière linguistique ✅ : points terre cuite seuls, même fond partout, tracée d'après la **carte des dialectes d'Occitanica** (calée automatiquement, écart ≈ 3 à 6 km) + vallées d'Italie tracées à la main (approximatif, à remplacer par la liste des communes de la loi 482) ; teinte des territoires limitée à la partie occitanophone. **À vérifier par Romain : droit de réutiliser la carte Occitanica** (crédit affiché dans la carte). **Dialectes** (6 zones d'après Occitanica, fondues entre elles, villes de bordure à deux dialectes) et **catalogue de données** en 5 familles (Langue, Administration, Culture, Histoire, Nature), valable sur tous les fonds ✅. À valider : noms occitans du catalogue et des dialectes (lemosin, auvernhat, vivaroaupenc…). La page /admin/carta gère encore les couleurs de l'ancienne table carta_dialectes, devenue inutile. **Suite (07-10)** : carte de base « Contorns » (côte + frontière), couches rangées en 5 familles dans un rail (Sus la carta avec Anullar / Netejar, Fons avec couleurs), dialectes sélectionnables avec diffusion, nuancier des transitions (22 bandes de la recherche, 5 à 35 km), dialectes corrigés (Ardèche, Gironde et Lot-et-Garonne, Alpes-Maritimes, Isère, Creuse-Corrèze est, Baronnies, Toulouse ouest, Massat, Carladès, Vidourle, Digne), zones mixtes en quadrillage (Roya, Monaco, communes italiennes déclarées), gascon éteint plus pâle, Petite Gavacherie expliquée, Croissant retracé d'après Tourtoulon 1876 et aligné sur la frontière, domaine limité à la France sauf Aran et vallées d'Italie (OSM), icônes Tabler, polices des villes à l'essai ✅. Rapport et données : SIG/Dialecte/transicions-dialectes.md ; chaîne de fabrication : SIG/cadena/LEGISSETZ-ME.md. **Suite (07/08-10)** : entrée en scène à l'arrivée (côte au crayon, relief qui gronde, fleuves de la source à la mer avec un vrai son d'eau, grandes villes, dialectes en feux d'artifice ; un clic saute à la fin), mêmes liens menu et accueil ; dialectes sélectionnables à plusieurs, Croissant en pastille ; nouvelles couches de sources publiques : communes (IGN 2026, dès « 7 km », noms occitans OSM/BdTopoc à 94 %), Calandretas (annuaire, 58, avec contact), provinces de 1789 (gouvernements colorés, noms centrés), parcs, massifs et sommets ; panneau des couches déplaçable et réductible ; version téléphone (barre en bas) ; noms qui s'évitent d'une couche à l'autre. Chaîne de fabrication : SIG/cadena/LEGISSETZ-ME.md. À faire : **révision complète** (lancée le 08-10) ; Romain valide les noms occitans (SIG/provincias/noms-oc.csv, SIG/natura/noms-parcs-oc.csv, SIG/natura/noms-releu-a-validar.csv, SIG/comunas/noms-a-validar.csv, SIG/calandretas/noms-a-validar.csv, et les anciens : vallées, familles du rail, zones mixtes, « domeni istoric ») ; 9 Calandretas manquantes (SIG/calandretas/escolas-mancantas.md) ; Lomagne (attente d'une source ou d'un locuteur) ; 110 communes des vallées à valider ; module d'export à arbitrer (SIG/export-carta-estudi.md). | ensemble |
| 2d | **Logo + nouvelle typographie** (30-09, §11) | logo croix-constellation en cours dans Canva (symbole ✅ test favicon, carré ✅) ; typo Barrio/Limelight/corps tranchée | **Logo ✅ intégré (variante C) et polices ✅ migrées le 30-09** (Barrio/Limelight/Luciole auto-hébergées, vérifié à l'écran). Master Canva ✅ répercuté en C et réexporté (8 SVG, dont un nouveau format nom-en-arc). Palette ✅ alignée sur le logo le 30-09 (§11). Restent : crédit Luciole (CC BY) sur la future page accessibilité · direction redesign « éditorial aéré » actée au §11. Bibliothèque de blocs comparés toujours à bâtir (Romain juge le graphisme actuel « trop classique Claude ») — à articuler avec Estructura (2) | Claude |
| 3 | **Module 0** (« L'occitan… Kezako ? ») | bloqué | Romain écrit son brouillon d'intro d'une page, depuis ses livres et sa vision ; Claude met en forme ensuite | Romain |
| 4 | **Audio de l'unité 1** (sa voix) | bloqué | Enregistrer UNE scène (le soir du 1.1) au téléphone pour relancer la machine — les LISTA.txt de chaque dossier disent quoi enregistrer | Romain |
| 5 | **Validation occitane** (modules 1.1-1.4 + promesse) | bloqué | Une session dicodòc : relire les 4 modules, trancher les 3 questions de graphie notées dans le 1.1, valider la ligne de promesse | Romain |
| 6 | **Refonte de /aprene en « Camin »** | à faire | Construire le sommaire du cursus avec la frise du chemin (essai → Modul 0 → A1) et les 4 modules de l'unité 1 visibles | Claude |
| 7 | **Transposition Racine² sur le site** | à faire | Coder le premier lot : ligne de promesse + ancre héros, pages A prepaus + Contacte, FAQ accordéon, kit de fluidité | Claude |
| 8 | **Photos « sang e aur »** | bloqué | Romain inventorie ses photos existantes et pressent son casting ; Claude prépare le modèle d'autorisation (droit à l'image et à la voix) | Romain |
| 9 | **Vidéo et design-stock** (103 Mo de PNG dans Git + 91 Mo hors Git, mesuré le 08-10) | flou | Claude mesure Officialitat.mp4, propose un plafond de poids et une règle écrite « quoi committer / quoi archiver » ; Romain tranche | ensemble |
| 10 | **Réveil technique** | bloqué | Romain ouvre le tableau de bord Supabase et relance le projet (2 minutes — le plan gratuit se met en pause après inactivité) | Romain |
| 11 | **Courriels** (Votz/CGU lo Congrès + relance LISN) | bloqué | Claude prépare les deux brouillons ; Romain les envoie de sa boîte | Romain |
| 12 | **Autoformation de Romain** (décision du 2026-10-04) | **en cours, prioritaire sur 3, 5 et 6** | Suivre `autoformation-parcours.md` étape par étape ; écrire la page de l'étape 1 dans `carnet-concepcion/etapa-1-nivels.md` ; Claude relit avec cinq questions, vérifie, code, ne produit plus de contenu pédagogique à sa place | Romain |
| 13 | **Carte /carta** (chantier principal depuis octobre) | en ligne (site pas encore public) : entrée en scène, couches publiques, dézoom (langues unies à 150 km, dialectes dès 100 km), « Autras lengas » avec le **catalan** (dialectes, villes, Catalunya Nord, benasquès en transition), frontière catalan / occitan sans trou (Fenouillèdes ajouté), plein écran, Calandreta la plus proche, sous-dialectes et surnoms des villes. Conception des échelles et du panneau : `revisions/2026-10-08-lengas-escalas.md` et `app/static/maqueta-lengas.html`. Données : `SIG/cadena/LEGISSETZ-ME.md` | 0) ✅ **Icônes qui masquaient les noms de villes** (Limòtges, Tolosa, Montpelhièr) : fait le 2026-10-09, `app/src/lib/carta/degatjament.js`. Les noms sont dans les tuiles, leur place est estimée d'après `comunas/noms.json` (ville = nom centré, village = au-dessus ou à droite) ; l'icône se décale (dessous, côté, puis plus loin) avec un trait fin vers le lieu. le 2026-10-09 (2e passage, demande de Romain) : l'icône reste collée à son lieu (plus jamais de longs traits) et s'accroche au point de la ville de luènh ; 0 bis) **demandes du 2026-10-09** : (a) ✅ Calandretas de loin : étoiles, l'icône éclot en s'approchant (option 1 choisie) ; (b) chaque couche apparaît de façon adaptée et poétique, les dialectes en feu d'artifice comme à l'ouverture (la carte est une expérience, pas seulement de l'information) ; (c) « Sus la carta » mis en avant, avec réglage des couleurs des couches choisies et une belle palette ; 1) **Atelier de la carte** (pages d'admin Vilas, Noms a validar, Lengas) dans une conversation neuve, sans agents ; 2) Romain colle `supabase-carta-luocs-ligam.sql` dans Supabase et valide l'occitan (`SIG/vilas/*-a-validar.csv`, noms catalans) ; 3) moyen : couche des pays de 1789 (`app/static/data/paises-1789.json` prête), liste des îlots, synthèse des 105 écarts de noms de villes ; 3 bis) ✅ **fond satellite vers 15 km** fait le 2026-10-09 (IGN France + PNOA Espagne, EOX retiré, §11) ; le 2026-10-09 (2e passage) : les étoiles cèdent directement la place au satellite vers 20 km (plus d'OSM dans le fond par défaut) et les noms occitans de toutes les communes s'affichent (`comunas/noms.json`, par population, sans chevauchement) ; scintillement des étoiles rendu léger (18 → 12 ms par image à 1830 px). Reste : vallées d'Italie sans photo (fond vide sous les noms) tant qu'aucune source libre n'est vérifiée ; noms dans la langue du lieu (catalan en Catalogne) ; le clic sur un dialecte garde quelques images lentes (redessin des dialectes, à optimiser) ; orthographe des noms de communes à valider par Romain ; transition étoiles → satellite alignée sur celle d'OSM (nuages, noms après) et photos manquées redemandées (2026-10-09) ; **à décider** : héberger nous-mêmes les photos (≈ 6 Go jusqu'au zoom 15, fichier unique PMTiles sur un stockage européen) si des trous persistent en usage réel ; Romain (2026-10-09) : plus de trous, on reste ainsi ; si ça revient, envisager d'abord un fond OSM **sans étiquettes** (juste le fond) sous les photos; 4) lourd, plus tard : arpitan (classement des dialectes à faire), grille des échelles et panneau | Romain + Claude |

## Les décisions déjà prises — à NE PAS rouvrir

(Le §11 du cahier des charges fait foi ; ceci est l'aide-mémoire.)

1. **2026-08-22 — Site vs application : tranché.** Un seul produit, deux
   registres (RÉCIT expressif / OUTIL sobre), une seule adresse, pas d'app
   native.
2. **2026-09-30 / 10-05 — Typographie** (remplace celle du 22-08) :
   Limelight (titres et logo), Luciole (texte courant), Cormorant Garamond
   (citations). Seules ces trois polices sont chargées (`app/src/fonts.css`).
3. **2026-10-06 / 07 — Accueil** (remplace « Lo riu » du 22-08) : l'« esbòs
   de nuèch », porté dans `app/src/lib/acuelh`.
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
    l'ouverture de fiche, pas de CMS externe, tout texte visible en base
    (exception provisoire : les textes de l'accueil sont en dur, à
    rebrancher ; la page d'admin « Tèxtes » n'alimente plus rien, bilan du
    08-10).
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
   réorganiser les phases. (Plus de dépendance au LISN depuis le 07-10 : la
   carte s'appuie sur Occitanica, Licence Ouverte. Dans les faits, la carte
   est le chantier principal depuis début octobre, voir chantier 13.)
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
