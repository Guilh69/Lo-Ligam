# Charte graphique — Lo Ligam

> Dérivée de l'identité **Instagram Lo Ligam** déjà existante. L'app *prolonge* cette marque (même âme visuelle), avec la retenue qu'exige une interface.
> ~~Couleurs en hex **approximatifs** — à prélever précisément sur les vrais visuels. · v0.1~~ *(périmé — les couleurs sont des tokens exacts dans `app/src/app.css` depuis le 2026-07-28, annotation du toilettage 2026-09-18)*
> **État réel** : les couleurs du §1 sont **exactes** — ce sont les tokens de `app/src/app.css` (`--color-terracotta: #c8562e` · `--color-brick: #a5342a` · `--color-gold: #e0a43b` · `--color-cream: #f5ead8` · `--color-teal: #1f5f63` · `--color-sky: #3e7cb1` · `--color-olive: #5e7b3a` · `--color-text: #3a2a20`). La typographie du §2 est **définitive** (décision du 2026-08-22) ; le système photo du §3bis est **acté** (décision du 2026-08-30). Charte vivante, mais ses décisions datées sont fermes.

---

## 1. Palette

**Chaudes (cœur de marque)**
- Terracotta / rouge-orangé : ~#C8562E
- Rouge brique : ~#A5342A
- Or / ocre : ~#E0A43B
- Crème (fond) : ~#F5EAD8

**Accents**
- Teal / pétrole : ~#1F5F63
- Bleu ciel : ~#3E7CB1
- Vert olive : ~#5E7B3A
- Texte brun foncé : ~#3A2A20

> ⚠️ **Note (toilettage 2026-09-18)** : les « ~ » ci-dessus datent de la v0.1. Ces huit valeurs sont **exactes** depuis le 2026-07-28 : ce sont les tokens de `app/src/app.css` (voir bandeau d'en-tête).

Croix occitana (or sur rouge) = signature à réutiliser avec parcimonie.

---

## 2. Typographie & ton

**Système typographique tranché le 2026-08-22** (Romain, sur maquettes
comparées — canvas « Tipografia Lo Ligam ») : trois voix, une par usage.

| Voix | Famille | Usage exclusif |
|---|---|---|
| Titres | **Syne** (700/800, capitales pour le héros) | h1/h2/h3, la voix principale — moderne, dessinée en France pour un centre d'art |
| Courant | **Instrument Sans** (400/500/600) | corps de texte, boutons, interface |
| Poétique | **Cormorant Garamond *italique*** (500) | citations littéraires uniquement (troubadours, poèmes) — jamais pour l'interface |

- **Fredoka survit uniquement dans le logo** « Lo Ligam » (wordmark). Plus
  aucun titre en Fredoka. Marcellus a été envisagé (jalons) puis écarté :
  trois familles suffisent, la sobriété prime.
- **Le « g » de Syne est volontairement presque sans queue** : c'est le
  dessin de la police, pas un bug de rendu. Vérifié et **assumé par Romain
  le 2026-08-22** (Bricolage Grotesque comparée puis écartée) — ne pas
  « corriger », ne pas rouvrir.
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

---

## 6. Décision

L'identité visuelle de Lo Ligam est **actée** : celle de l'Instagram existant, adaptée aux règles d'interface ci-dessus. Sert de référence à Claude Code.
