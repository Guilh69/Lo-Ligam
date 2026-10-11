# Charte graphique — Lo Ligam

> Dérivée de l'identité **Instagram Lo Ligam** déjà existante. L'app *prolonge* cette marque (même âme visuelle), avec la retenue qu'exige une interface.
> ~~Couleurs en hex **approximatifs** — à prélever précisément sur les vrais visuels. · v0.1~~ *(périmé — les couleurs sont des tokens exacts dans `app/src/app.css` depuis le 2026-07-28, annotation du toilettage 2026-09-18)*
> **État réel** : les couleurs du §1 sont **exactes** — ce sont les tokens de `app/src/app.css` (`--color-terracotta: #c8562e` · `--color-brick: #a5342a` · `--color-gold: #e0a43b` · `--color-cream: #f5ead8` · `--color-teal: #1f5f63` · `--color-sky: #3e7cb1` · `--color-olive: #5e7b3a` · `--color-text: #3a2a20`). La typographie du §2 est **définitive** (décision du 2026-08-22) ; le système photo du §3bis est **acté** (décision du 2026-08-30). Charte vivante, mais ses décisions datées sont fermes.

---

## 1. Palette

**Chaudes (cœur de marque)** — *alignées sur le logo le 2026-09-30 (§11) :
le logo est le maître des couleurs, plus l'inverse.*
- Brique du logo (ex-terracotta, token `--color-terracotta`) : **#B53D17** (était #C8562E)
- Rouge brique (accent texte) : #A5342A (inchangé)
- Or (token `--color-gold`) : **#EEAF34** (était #E0A43B)
- Or clair des pommettes (`--color-gold-light`, nouveau) : **#FFD47F**
- Crème (fond) : #F5EAD8 (inchangé — le fond reste en question pour le redesign)

**Accents**
- Teal / pétrole : ~#1F5F63
- Bleu ciel : ~#3E7CB1
- Vert olive : ~#5E7B3A
- Texte brun foncé : ~#3A2A20

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

## 6. Décision

L'identité visuelle de Lo Ligam est **actée** : celle de l'Instagram existant, adaptée aux règles d'interface ci-dessus. Sert de référence à Claude Code.
