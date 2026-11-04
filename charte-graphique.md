# Charte graphique — Lo Ligam

> Dérivée de l'identité **Instagram Lo Ligam** déjà existante. L'app *prolonge* cette marque (même âme visuelle), avec la retenue qu'exige une interface.
> ~~Couleurs en hex **approximatifs** — à prélever précisément sur les vrais visuels. · v0.1~~ *(périmé — les couleurs sont des tokens exacts dans `app/src/app.css` depuis le 2026-07-28, annotation du toilettage 2026-09-18)*
> **État réel** : les couleurs du §1 sont **exactes** — ce sont les tokens de `app/src/app.css` (`--color-terracotta: #c8562e` · `--color-brick: #a5342a` · `--color-gold: #e0a43b` · `--color-cream: #f7f3ee` (plâtre depuis le 2026-10-21, était #f5ead8) · `--color-teal: #1f5f63` · `--color-sky: #3e7cb1` · `--color-olive: #5e7b3a` · `--color-text: #2a1a10` (depuis le 2026-10-21, était #3a2a20)). La typographie du §2 est **définitive** (décision du 2026-08-22) ; le système photo du §3bis est **acté** (décision du 2026-08-30). Charte vivante, mais ses décisions datées sont fermes.

---

## 1. Palette

**Chaudes (cœur de marque)** — *alignées sur le logo le 2026-09-30 (§11) :
le logo est le maître des couleurs, plus l'inverse.*
- Brique du logo (ex-terracotta, token `--color-terracotta`) : **#B53D17** (était #C8562E)
- Rouge brique (accent texte) : #A5342A (inchangé)
- Or (token `--color-gold`) : **#EEAF34** (était #E0A43B)
- Or clair des pommettes (`--color-gold-light`, nouveau) : **#FFD47F**
- Fond : **plâtre #F7F3EE** (2026-10-21, refonte claire, voir ci-dessous) ;
  le crème #F5EAD8 reste la teinte des textes sur fond sombre et des visuels
  Instagram

**Accents**
- Teal / pétrole : ~#1F5F63
- Bleu ciel : ~#3E7CB1
- Vert olive : ~#5E7B3A
- Texte brun-noir : **#2A1A10** (2026-10-21, était #3A2A20)

**Rôles des couleurs (Romain, 2026-10-23, règle B ; cahier §11)**
- **Ce qui se clique** : le rouge du fond du logo **#B53D17** (`--t-accion`), en aplat sous un texte crème #FBF1E1 pour les boutons (chaque bouton est une tuile du logo), en soulignement de 2 px pour les liens. Le même sur les deux thèmes et avec les couleurs adaptées au daltonisme.
- **Ce qui est mis en valeur** : l'or en sombre, l'ocre en clair (mots forts du titre, numéros, chiffres, surtitres).
- **Jamais ce rouge en texte sur le fond sombre** : il a la teinte du fond (14° contre 15°, contraste 3,2). Planche des trois règles comparées : https://claude.ai/artifact/M1DRchgv6cnutGiu2etmY4.
- **Sur la carte et dans les panneaux**, l'or dit « allumé ou choisi » (couches, onglets, interrupteurs) ; le rouge dit « cliquable » (boutons, liens, survols). Le contour du focus clavier reste en or, plus visible. Appliqué à tout le site le 2026-10-23 (cahier §11).

**Thème clair « Plâtre » (2026-10-21), thème par défaut du site.** Choisi
par Romain contre « Terre cuite » et « Ciel du Sud » (essai `/ensag/clar`),
d'après les couleurs mesurées de leoparpeix.com : plâtre, pierre, encre
brun-noir, la brique seule couleur vive. Jetons `--t-*` d'`app/src/app.css` :

| Jeton | Valeur | Contraste sur le fond |
|---|---|---|
| `--t-fons` (plâtre) | #F7F3EE | |
| `--t-fons-2` (pierre) | #EDE6DC | |
| `--t-tinta` (encre) | #2A1A10 | 15,2 |
| `--t-tinta-2` (texte second) | encre à 72 % | 6,3 |
| `--t-linha` (filets) | encre à 14 % | |
| `--t-aur` (or des petits textes) | #9C5611 | 5,1 (4,5 sur la pierre) |
| `--t-terra` (brique) | #B53D17 | 5,2 (blanc dessus : 5,8) |

**Le 2026-10-22, Romain revient au thème sombre « Éclat » avec le fond
Venas d'aur comme défaut** (« je préfère, mais il y aura encore la version
light », cahier §11) : le Plâtre reste le thème clair, entier, au choix dans
le panneau Ambiance ; la version légère (§5septies) reste due. ⚠ L'ancien or `--color-gold` #EEAF34 ne doit jamais servir de texte
sur fond clair (1,8:1) : à traquer page par page (refonte, étape 6).

> ⚠️ **Note (toilettage 2026-09-18)** : les « ~ » ci-dessus datent de la v0.1. Ces huit valeurs sont **exactes** depuis le 2026-07-28 : ce sont les tokens de `app/src/app.css` (voir bandeau d'en-tête).

Croix occitana (or sur rouge) = signature à réutiliser avec parcimonie.

---

## 1 bis. Logo officiel : la croix-constellation (2026-09-30)

Dessiné par Romain dans Canva (design « Lo ligam », DAGRAv9LPy8). La croix
occitane redessinée en **points reliés** : 12 pommettes + un moyeu central,
la croix n'existe que parce que les points sont liés — c'est *Lo Ligam* au
sens propre. Validé par les tests favicon, une-couleur et réduction.

- **Fichiers vecteurs** : `design-stock/logo/svg/` — 8 formats :
  `simbol-blanc` (favicon, avatars) · `carrat-color` (carré éditorial,
  réseaux) · `vertical-color/-blanc` · `vertical-arc-color` (nom en arc de
  cercle : autocollants, tampons) · `orizontal-color/-blanc/-brun`
  (en-têtes, bannières). Typo du nom : Barrio (voir §2).
- **Recettes de couleurs** : couleur = points or clair #FFD47F, moyeu
  #EEAF34, traits et nom blancs, fond brique #B53D17 · une-couleur blanc
  (fonds foncés/photos) · une-couleur brun #3A2A20 (fonds clairs).
- ✅ **Écart résolu le 2026-09-30** : Romain a tranché — la palette du site
  s'aligne sur le logo (§1 mis à jour, tokens et 33 occurrences en dur
  remplacés dans le code).
- **Variante C adoptée le 2026-09-30** (après la remarque « grande roue »
  de la sœur de Romain, variantes comparées) : moyeu réduit (r 25→17) et
  arcs épaissis (5→9) — la croix reprend le dessus sur la roue. Appliquée
  dans `app/src/lib/assets/favicon.svg` (fichier reconstruit à la main,
  3 Ko, qui sert de favicon et de pastille de marque). Master Canva mis à
  jour en C et réexporté par Romain le même jour (les 8 SVG de
  design-stock sont la version C).
- Logo intégré au site le 2026-09-30 : favicon, barre d'accueil, en-tête
  des pages app, pied de page.
- **Règle (Romain, 2026-10-21) : la croix ne prend que les couleurs de ces
  recettes, jamais d'autres.** Barre du haut : le logo complet (tuile
  brique, traits blancs, points or clair, moyeu or), identique dans les deux
  thèmes. Grande croix de l'accueil : en sombre, traits blancs, points or
  clair, moyeu or ; en clair, **ocre et rouge** (points or #EEAF34, traits et
  moyeu brique #B53D17 ; la version brune, essayée le même soir, est
  écartée : « je voudrais la croix avec les couleurs type Lo Ligam »). Sur
  le voile brique du menu : traits blancs, points or. Jetons `--logo-*`
  d'`app/src/app.css`, composant `Crotz.svelte` (`teula` = logo complet).
- **La croix qui se charge (chemin de S'apren, Romain, 2026-11-04, piste 1
  « le tour puis les liens »)** : quatre ronds de verre fumé (sombre :
  rgba(34, 16, 10, 0.62) ; clair : rgba(251, 241, 225, 0.84)) cerclés d'un
  filet d'or (`--or` : #EEAF34 en sombre, ocre #8F5400 en clair), un seul poids
  de trait de 0,7 unité (celui du logo). La croix reste seule, aux couleurs des
  recettes (jetons `--logo-*`), jamais animée en couleur. **Quatre niveaux, du
  débutant à la croix pleine** : 3, 6, 9 puis 12 points allumés, cercle tracé
  d'autant, rayons et arcs seulement entre points allumés ; les points pas
  encore allumés restent de petites perles (la taille, pas l'opacité) ; le
  dernier rond, la croix pleine, porte un double cercle. Un filet fait le tour
  du rond et allume les points, puis le moyeu, les rayons et les arcs les
  relient ; tout fini en moins de 5 s (RGAA 13.8), sans rebond ; sans animation,
  les quatre niveaux s'affichent d'emblée. Jamais de rouge en aplat, de disque
  plein, de lueur ni de fondu entre couleurs éloignées (il passe par un kaki
  sale). Code : `CaminCrotz.svelte`, `camin-plan.js`, `crotz-geometria.js` ;
  essais `/ensag/crotz2` (les trois pistes) et `/ensag/crotz` (variante C,
  écartée), retirés le 04-11 une fois la piste 1 choisie (visibles dans l'historique Git).

---

## 2. Typographie & ton

**Système typographique tranché le 2026-09-30** (Romain, sur planches
comparées pendant le travail du logo — REMPLACE le système Syne /
Instrument Sans / Cormorant / Fredoka du 2026-08-22) :

| Voix | Famille | Usage exclusif |
|---|---|---|
| Logo & titres | **Limelight** | le nom « Lo Ligam », les titres de leçons, de sections et les grands titres éditoriaux (Art déco, une seule graisse). **Barrio est sortie le 2026-10-05** : le logo réel de Romain est dessiné en Limelight (vérifié sur planche comparée), une police de moins à charger |
| Courant | **Luciole** (choisie le 2026-09-30, contre Atkinson Hyperlegible) | tout le reste : corps de texte, boutons, interface — police française conçue pour les lecteurs malvoyants, cohérente avec l'exigence d'accessibilité et le choix européen |

- Point encore ouvert : dire si la voix « poétique » (Cormorant italique
  pour les citations de troubadours) survit ou disparaît.
- **Migré dans le site le 2026-09-30** (`fonts.css`, `app.css`) : Barrio et
  Limelight auto-hébergées (woff2, latin + latin-ext), Luciole en 400/700/
  italique (couvre nativement les diacritiques occitans). `font-synthesis:
  none` interdit les faux gras (Barrio et Limelight n'ont qu'une graisse).
- ⚠ Luciole est sous licence **CC BY 4.0** : créditer ses auteurs (CTRDV,
  L. Bourcellier & J. Perez) sur la future page accessibilité.
- **Auto-hébergées** en woff2, sous-ensemble latin + latin-ext (ç è í ò ü) —
  zéro requête vers Google, comme le reste du site.
- Graisses strictement limitées à celles du tableau : chaque graisse pèse.
- Sous-titre : français en *italique*, entre parenthèses.
- Prononciation phonétique proposée + bouton audio (« escota »).
- Ton : fier, chaleureux, pédagogique, jamais froid.

---

## 2 bis. Formes locales assumées (2026-10-22)

L'occitan du site suit la norme classique languedocienne et se vérifie avec
le Basic et vèrb'Òc de lo Congrès. Romain, qui valide tout l'occitan, peut
y assumer des formes de son parler, listées ici ; le script
`app/scripts/verificar-oc.mjs` les reconnaît (`FORMAS_ASSUMIDAS`) au lieu de
les signaler absentes.

| Forme | Norme | Pourquoi | Où |
|---|---|---|---|
| **siès** (« tu es ») | siás (Basic), ès (vèrb'Òc) | montpelliéranisme assumé : « bien distingué de siás et de es » (Romain, 22-10) ; forme de l'est languedocien, inconnue du Basic et de vèrb'Òc | la phrase sous le titre de l'accueil ; partout où le site dit « tu es » |

Règle : une forme locale s'ajoute ici avec sa norme en face, jamais en
silence.

---

## 3. Illustrations

- Style plat, chaleureux, un brin storybook / troubadour.
- Motifs récurrents : ostal, dracs, castèls, arbres/paysages, rose des vents, croix occitana, cartes de l'espace occitan.
- Rôle dans l'app : **accents**, pas décor permanent (voir §5).

---

## 3bis. Photographies — le système « sang e aur » (décision 2026-08-30)

Les photos de Romain, détourées, avec un **double liseré** aux couleurs occitanes :
terracotta **#C8562E** à l'intérieur, or **#E0A43B** à l'extérieur, tracé légèrement
irrégulier (jamais un contour lisse d'ordinateur). Choix de valeurs : authenticité
plutôt qu'images IA, vrais lieux et vraies personnes du territoire.
Maquette validée : `design-stock/Fotos/maqueta.html`.

### Trois niveaux d'images
1. **Couverture de bloc** (bandeau) : introduit une scène ou un module. Paysage ou
   lieu ; liseré **sur la ligne de crête / silhouette seulement**, ciel supprimé
   (transparent → blanc de la carte). Le lieu peut être évocateur plutôt que
   littéral (une fête de village peut « avoir lieu » dans un paysage cévenol).
2. **Vignette personnage** : personne détourée, liseré **sur tout le tour**, posée
   en bas d'un encadré de scène (comme un autocollant). Les personnages (Loís,
   Núria…) sont joués par des proches **volontaires** : recueillir une
   **autorisation écrite de droit à l'image** avant publication, et tenir la liste
   des identités attribuées.
3. **Image de vocabulaire** : un objet ou un thème, détouré, liseré tour complet.
   À taille moyenne (flashcards, cartes de mots). **En dessous de ~80 px le liseré
   devient illisible** : les petits pictogrammes restent des emoji/pictos, pas des
   photos.

### Recette de traitement (Canva)
Réglages identiques pour toutes les photos (l'œil lit la répétition comme du
professionnalisme) : Température **+10**, Saturation **−15**, Contraste **+10**,
Hautes lumières **−10**, Netteté **+5**. Seule la **luminosité** s'ajuste photo par
photo. Régler une photo de référence puis « Copier le style » (rouleau) sur les
autres. Export : **PNG fond transparent**, couleurs du liseré saisies par code hexa.

### Poids cibles (sobriété)
- Bandeau : ~900 px de large, JPEG qualité ~82, ciel aplati en blanc → **≤ 250 Ko**.
- Vignette/objet : ~300 px, PNG transparent → **≤ 150 Ko**.

---

## 4. Conventions bilingues (héritées)

Occitan (grand) → français italique → phonétique + audio. À conserver dans les leçons pour la continuité de marque.

---

## 5. Adaptation à l'application (note d'expert)

Les visuels Instagram sont **denses** (bon pour un post). Une **interface** doit rester **plus aérée et lisible** :
- Fonds majoritairement crème/blanc cassé ; couleurs vives en touches (boutons, réussites, accents).
- Illustrations en récompenses, en-têtes d'unité, capsules culturelles — pas sur chaque écran.
- Animations fluides sur ces touches, dans la sobriété (éco).

→ **Corriger la maquette** : remplacer le rouge générique par terracotta #C8562E + or, fond crème #F5EAD8.

---

## 5bis. Piliers d'expérience (UX) — exigences

**Animations** (soignées, à chaque interaction) : survol/pression d'une case (rebond léger, état net), clic (retour < 100 ms, satisfaisant), réussite (célébration fluide : coche, points qui montent, micro-confetti sobre). Élégant, jamais clinquant. Fluide ≠ énergivore.

**Sons** : un son court par événement clé (bonne réponse, erreur douce, fin de leçon, déverrouillage). Toujours **désactivables** ; fichiers **légers** (éco). → constituer une petite bibliothèque sonore.

**Humour fin, par touches** : ton complice et malicieux, bien dosé (encouragements, capsules culturelles), jamais à chaque écran. Renforce la fierté chaleureuse de la marque.

---

## 5ter. Navigation — anticiper les sections futures

L'app n'a aujourd'hui que 2 pôles (Aprendre, Compte), reliés par un simple bouton retour-accueil (`AppHeader.svelte`, `app/src/lib/components/`). Les phases futures ajouteront **Comunautat** (groupes par ville) et **Contribuir** (contribution citoyenne) — cf. cahier des charges §3, Phase 4.

- **Ne pas afficher ces sections avant qu'elles existent** (sobriété, pas de promesse non tenue) : pas d'icônes grisées "bientôt" dans l'interface actuelle.
- **Mais garder l'architecture prête** : `AppHeader.svelte` centralise déjà l'en-tête des écrans internes (au lieu d'un en-tête dupliqué par page) — ajouter une vraie barre de navigation (probablement basse, mobile-first) entre sections quand elles existeront ne demandera pas de tout refaire.
- **Réserver dès maintenant le style des icônes** de ces 2 futures sections, cohérent avec les motifs déjà identifiés (§3) : par ex. un groupe de toits/ostals pour Comunautat, une plume ou une main pour Contribuir — même langage graphique que `HomeIcon.svelte` (silhouette pleine, traits épais, pas un pictogramme générique).

---

## 5quater. Fluidité (décision 2026-09-18)

Kit de motifs actés lors de la transposition de la référence centre-racine2.com
(analyse du 2026-09-18) : **blocs-déclarations à mots surlignés** (or/terracotta
sur crème ou brique) · **carte-héros arrondie** en tête de chaque page feuille ·
**accordéons souples** · **barre qui se condense** au défilement · **jamais
d'impasse** (toute page se termine en renvoyant quelque part) · **transitions de
page** (View Transitions, natif). Toujours : CSS pur, `prefers-reduced-motion`
respecté, 60 fps (transform/opacity uniquement). Détail et justifications :
`transposicion-racine2.md` §6 · démo interactive : « Fluiditat Lo Ligam »
(https://claude.ai/artifact/UfWbWE9UPufi27nHf2pZkF).


## 5quinquies. Animations de texte (2026-10-11)

Onze effets d'entrée, repris des « suggestions » de Canva, disponibles partout dans le site : `app/src/lib/actions/animarText.js` (`animarText(el, efèct, { tèxt, retard, velocitat })`, ou `{@attach animat('rebond')}` en Svelte). Banc d'essai : `/ensag/letra`.

| Canva | Code | Pour quoi (proposition) |
|---|---|---|
| Machine à écrire | `maquina` | une citation, une phrase qui se dit (Max Roqueta à l'accueil) |
| Ascension | `ascension` | un titre de page, une étiquette qui change (dialecte au-dessus de l'échelle) |
| Décalage | `decalatge` | un nom propre qui arrive (ville, langue) |
| Fusion | `fusion` | deux formes qui se rejoignent (occitan et français) |
| Bloc | `bloc` | un mot mis en avant, un titre de rubrique (bloc d'or) |
| Explosion | `explosion` | une réussite (fin de leçon, série complète) |
| Rebond | `rebond` | une bonne réponse, un « Plan fach ! » |
| Déroulé | `deroulat` | un mot qu'on découvre (carte retournée, mot du jour) |
| Patinage | `patinatge` | un passage d'une page à l'autre, un défilement |
| Écart | `escart` | un grand titre, le nom « Lo Ligam » |
| Clarifier | `clarificar` | un texte qui change de langue, un nom qui se précise |

Règles : sobre, pas kitsch (une seule animation de texte à la fois sur l'écran) ; courtes (moins d'une seconde, sauf la machine à écrire) ; jamais sur un texte long ; seulement le mouvement, l'opacité et le flou ; `prefers-reduced-motion` respecté (le texte apparaît sans effet) ; le texte entier reste lisible pour les lecteurs d'écran.

## 5sexies. Icônes pratiques et ressources de design (décision 2026-10-12)

**Deux familles d'icônes.** Les icônes d'identité (croix, plume, livre, communauté…) restent dessinées maison (§5ter). Les icônes pratiques (fermer, suivant, précédent, lien externe, lire, pause, écouter, son coupé, réglages, validé, rechercher, revenir) viennent d'**Iconoir** (licence MIT, créateur italien), trait **1,7** comme les icônes maison, choisi sur planche comparée contre Phosphor (`/ensag/icones`).
- Un seul composant : `app/src/lib/components/Icona.svelte` (`<Icona nom="fermer" />`, taille 1em par défaut, elle suit le texte). Douze tracés, 3 Ko : on copie une icône à la fois depuis iconoir.com, jamais la bibliothèque entière.
- Plus de caractères (× → ↗ ▶ ⚙) ni d'émojis (🔊 🔇) pour les boutons : leur dessin et leur couleur changent d'un téléphone à l'autre. Les flèches dans une phrase (« A → Z ») et les émojis de contenu (🗣️ 🎶 ✍️ des notes, 🦥 du ralenti) restent.
- Pseudo-élément CSS (où un composant ne peut pas aller) : même tracé en `mask` (exemple : la sageta du rail de la carte).

**Ressources de design (tri du 2026-10-12)**
- *Inspiration* (on regarde, on ne copie pas) : Land-book, Lapa Ninja, One Page Love (pages d'accueil), Unsection (sections : tarifs, questions fréquentes), Web Interactions Gallery (petites animations), Dribbble et Behance (illustration, écrans de téléphone), Awwwards (idées audacieuses, souvent trop lourdes). Méthode : Romain range ses captures dans `design-stock/Inspiration/<chantier>/` avec une ligne sur ce qui lui plaît ; Claude analyse, propose une page d'essai dans `/ensag/`, Romain décide, la décision entre ici.
- *Matériaux* : Iconoir (retenu) ; CodePen (créations publiques sous licence MIT, à adapter allégées et avec `prefers-reduced-motion`) ; PhotoGradient (idée : un dégradé tiré de la photo affiché pendant son chargement).
- *Écartées* : Fontshare et Fontspace (typographie close, §2 ; licences mêlées chez Fontspace), Vecteezy (attribution obligatoire, beaucoup d'images IA, style générique), Replicate (IA payante à l'usage, contraire au §3bis).
---

## 5septies. Version légère (décision 2026-10-14)

Le site aura une **version légère** : même site, mêmes fonctions, presque rien
qui bouge, pour l'accessibilité et pour qui préfère le minimalisme. Elle n'est
pas imposée : le visiteur la choisit au premier passage, le choix est mémorisé
dans le navigateur et reste modifiable dans le panneau Ambiance. Elle s'ajoute
au respect de `prefers-reduced-motion` (réglage du système), qui reste dû
partout.

**Règle dès maintenant : toute nouvelle animation prévoit sa version légère**
(immobile, ou un fondu court), branchée sur `:root[data-leugier='on']` en CSS
ou sur `ambianca.leugier` en JavaScript (`app/src/lib/stores/ambianca.svelte.js`).

- Déjà fait : le fond de l'accueil (la braise, CSS seul, sans WebGL).
- À reprendre à la fin du site : la croix-constellation qui tourne et se forme,
  la constellation redessinée à chaque image, le défilement amorti (Lenis), le
  curseur, l'entrée en scène de la carte, le scintillement des étoiles, les
  animations de texte, les révélations au défilement.
- Le libellé « Fons leugièr » deviendra celui de toute la version légère
  (nouveau nom à vérifier avec l'API de lo Congrès).

## 5octies. Mise en page : règles mesurables (2026-10-21)

Tirées d'une synthèse de recommandations transmise par Romain (USWDS, WCAG 2.2,
loi de proximité de la Gestalt, échelles d'espacement en 8 px), triées pour Lo
Ligam. Chaque règle se vérifie par une mesure. Accessibilité : bloquant ; le
reste : à signaler.

| Règle | Critère | Test |
|---|---|---|
| ESP-01 Échelle | Espacements pris dans 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 px : variables `--esp-4` à `--esp-128` (`app/src/app.css`), en rem pour suivre la taille de texte du visiteur | marges, écarts et rembourrages calculés : multiples de 4 |
| ESP-02 Proximité | Ce qui va ensemble est plus proche que ce qui est séparé | écart dans un groupe < écart entre groupes ; un élément loin de tout groupe « flotte » |
| ESP-03 Paragraphes | Entre paragraphes 1 à 1,5 em ; entre items de liste au moins 0,5 em ; pas d'alinéa | marge basse du paragraphe / taille de police |
| GRI-01 Grille | Sur ordinateur, les grands blocs se posent sur 12 colonnes, gouttière 24 px, marges `--marge` | bords des blocs sur des lignes de colonne |
| TYP-01 Hiérarchie | Trois niveaux de texte au plus par écran ; tailles décroissantes ; texte courant de 45 à 75 signes par ligne, interligne 1,4 à 1,6 ; fer à gauche (centré pour titres courts et citations) ; plus d'espace au-dessus d'un titre qu'en dessous | tailles calculées, largeur en `ch` |
| ACC-01 Contraste | WCAG 2.2 AA : 4,5:1 texte courant, 3:1 grand texte, dans les deux thèmes ; sur le fond animé, mesurer aussi sur les veines les plus claires | ratio calculé, couleur à transparence mélangée au fond |
| ACC-02 Cibles | Tout ce qui se clique fait au moins 24 × 24 px (WCAG 2.2, 2.5.8), 44 px visés sur téléphone | taille du lien ou du bouton |

Premier diagnostic (ouverture de l'accueil, 1906 × 902) : les boutons étaient à
254 px du texte et à plus de 500 px de la croix, proches d'aucun groupe : d'où
l'impression qu'ils « flottent » (ESP-02). Le doré du thème clair passait à
4,16:1 pour les petits textes : assombri en `#9c5611` (4,70:1, ACC-01).

Écarté : le Système de design de l'État (DSFR), réservé aux sites de l'État
(lecture possible, usage non) ; une grille de ligne de base stricte (sans objet
en responsive) ; la « touche méditerranéenne » de la note, non sourcée, alors
que Lo Ligam a déjà son identité (§3bis, gamme Éclat) ; les normes ISO 9241,
payantes, dont le sommaire peut servir plus tard de liste de contrôle.

Application : l'échelle et ces règles valent pour tout nouveau travail ; le
reste du site s'y range au fil des chantiers, sans refonte d'un coup.

## 6. Décision

L'identité visuelle de Lo Ligam est **actée** : celle de l'Instagram existant, adaptée aux règles d'interface ci-dessus. Sert de référence à Claude Code.
