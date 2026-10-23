# Corpus design — état de l'art et spécialisation Lo Ligam

> Constitué le 2026-08-22 à la demande de Romain : « rien ne doit être laissé au
> hasard ». Ce document est la référence commune de toutes les conversations
> pour les décisions esthétiques, fonctionnelles et techniques. Il complète la
> `charte-graphique.md` (qui dit *quoi*) en disant *pourquoi* et *comment*.

---

## 1. Méthode : ce que font les meilleurs studios et écoles

### 1.1 Le socle suisse (écoles de Bâle et Zurich)

La typographie moderne vient de là : Müller-Brockmann (*Grid Systems in
Graphic Design*, 1981) et Ruder (*Typographie*, 1967). Les systèmes de design
actuels (Material, Apple HIG) en encodent directement les principes.

**Règles retenues pour Lo Ligam :**
- **La grille d'abord.** Toute page se pose sur une grille explicite (colonnes,
  gouttières, rythme vertical). Pas d'alignement « à l'œil ».
- **Hiérarchie typographique stricte** : une échelle de tailles définie une
  fois (ratio constant), jamais de taille improvisée dans un composant.
- **L'espace blanc est un matériau**, pas un vide à remplir. La respiration
  entre sections fait le « professionnel » plus que n'importe quel effet.
- **Peu de familles de caractères** (1 à 2), déclinées en graisses.

### 1.2 Les heuristiques de Nielsen (NN/g, révision 2020)

Les 10 règles d'évaluation d'une interface. Celles qui nous concernent le plus :

| Heuristique | Application Lo Ligam |
|---|---|
| Visibilité de l'état du système | progression de leçon toujours visible ; états de chargement dessinés |
| Correspondance avec le monde réel | vocabulaire de l'interface en occitan naturel, pas en jargon technique |
| Contrôle et liberté | toujours pouvoir sortir d'une leçon, annuler, revenir |
| Cohérence et standards | mêmes gestes partout ; un seul style de bouton par rôle |
| Reconnaître plutôt que se rappeler | icônes toujours accompagnées de libellés (déjà acté : feedback « finicion ») |
| Design esthétique et minimaliste | chaque élément doit gagner sa place ; pas de « data slop » |

### 1.3 La leçon des studios primés (elias.studio, Locomotive, Hello Monday…)

Ce qui distingue leurs sites, constaté sur pièces :
- **L'interface se tait pour que le travail parle.** Fond neutre, couleur
  portée par les œuvres — pas par les boutons.
- **Chaque projet repart d'une page blanche** (Locomotive) : les technologies
  se réutilisent, pas les mises en page.
- **La personnalité vient de peu d'éléments très soignés** (Hello Monday) :
  une animation signature, une illustration, pas dix effets.
- **Le récit avant la décoration** : brief court, puis essais visuels qu'on
  confronte — exactement la méthode « maquettes à comparer » adoptée ici.

**Conséquence pour Lo Ligam :** les ~200 designs Canva sont notre « travail
qui parle ». L'interface doit les magnifier, pas rivaliser avec eux.

---

## 2. Science de l'apprentissage × design

### 2.1 Théorie cognitive de l'apprentissage multimédia (Mayer, 200+ expériences)

Trois hypothèses : traitement actif, capacité limitée, double canal
(visuel/auditif). Principes directement applicables aux leçons :

- **Multimédia** : mots + images > mots seuls. Chaque mot de vocabulaire
  mérite son visuel (les fichas font déjà ça — c'est validé par la science).
- **Cohérence** : exclure tout ce qui est joli mais étranger au contenu.
  Une animation décorative *pendant* un exercice nuit à l'apprentissage.
- **Signalisation** : indiquer visuellement ce qui est essentiel (le mot
  nouveau se distingue du texte d'habillage).
- **Contiguïté spatiale et temporelle** : le mot occitan et son image côte à
  côte, le son joué au moment où le mot s'affiche — jamais décalés.
- **Segmentation** : leçons en petites unités contrôlées par l'apprenant
  plutôt qu'en flux continu.
- **Personnalisation** : ton conversationnel > ton formel. Le tutoiement
  occitan chaleureux est un choix pédagogiquement fondé.

### 2.2 Charge cognitive (Sweller, 1988)

Trois charges : **intrinsèque** (difficulté du contenu), **extrinsèque**
(imposée par une interface mal conçue), **germane** (construction du savoir).
Le design ne peut agir que sur l'extrinsèque — et doit la réduire à zéro :

- Pendant un exercice : rien d'animé, rien de clignotant, pas de choix
  d'interface à faire. Toute l'attention va au mot.
- Le vocabulaire a une « interactivité d'éléments » faible (chaque mot
  s'apprend seul) : parfait pour des sessions courtes et fréquentes.
- L'habillage expressif (vagues, designs, animations) vit **entre** les
  moments d'apprentissage, jamais pendant.

### 2.3 Ce que la recherche sur Duolingo enseigne (revue systématique 2012-2020)

- **Ce qui marche, preuves à l'appui** : répétition espacée, rappel actif
  (retrieval practice), feedback immédiat, association image/son/mot.
- **Ce qui s'essouffle** : la gamification-nouveauté (badges, classements).
  Une fois la nouveauté passée, la compétition ne compense pas un contenu
  pauvre. Les études pointent : compétition > collaboration = erreur.
- **Aubaine pour Lo Ligam** : nos valeurs (communauté, coopération, fierté
  culturelle) sont précisément ce que la recherche recommande *contre* le
  modèle compétitif. La motivation durable est identitaire et sociale —
  « je me relie à une culture » — pas un score.

**Règles dérivées :** sessions courtes segmentées · rappel actif dès la
première leçon · audio systématique (Votz) · récompenses = progression
visible et beauté, pas classements · communauté = entraide, pas duel.

### 2.4 Psychologie de l'interface : cinq effets (2026-10-23)

Point de départ : la vidéo de Wyatt Feaster, designer d'applications, *The
psychology trick that makes any app feel 10x better* (YouTube, 6 min 30,
https://www.youtube.com/watch?v=MVOpq3WRnbo), envoyée par Romain et relue
d'après sa transcription. Ce sont des effets connus de la psychologie, pas
une étude : des repères, passés ici au crible des valeurs du projet.

| Effet | Ce qu'il dit | Chez Lo Ligam aujourd'hui | Règle retenue |
|---|---|---|---|
| **Gradient d'objectif** (Hull, 1932) | On accélère quand on voit l'arrivée : « 5 étapes sur 7 » motive plus que « fais cette étape ». | Premiers pas de la carte : compteur « 3 / 11 » et barre d'or (`Guida.svelte`) ; lo Fuòc de l'ostal (`gamification.md` §5 bis). | Tout parcours en étapes dit où on en est et ce qui reste (leçon, module, premiers pas, futur test de positionnement). Jamais de compte à rebours qui presse. |
| **Pic et fin** (Kahneman et coll., 1993) | On retient le meilleur moment, le pire, et la fin ; le reste s'efface. | Entrée en scène de la carte ; fin des premiers pas (cercle d'or, « Tot es a punt ! ») ; célébrations (`gamification.md` §5). | Soigner la fin de chaque parcours. **Et traiter les pires moments avant d'ajouter des fêtes** : une carte qui se recharge sur iPhone pèse plus lourd dans le souvenir que dix belles animations. |
| **Illusion du travail** (Buell et Norton, 2011) | On accorde plus de valeur à ce qui semble demander du travail ; certaines applications ajoutent une attente factice. | Écran « La carta se prepara… » pendant un vrai chargement. | **Écarté : jamais d'attente inventée** (contraire à l'éthique et à la sobriété). Version honnête, celle que l'étude d'origine soutient : quand un vrai travail se fait, le montrer plutôt que le cacher. |
| **Effet d'isolement** (von Restorff, 1933) | On se souvient de ce qui diffère du reste. | L'or (l'ocre en clair) met en valeur les mots forts, les numéros, les chiffres ; « Reservar un cors » partage ce même or, il ne ressort donc pas (relevé du 23-10 : 22 éléments dorés sur l'accueil). | **L'or met en valeur, le rouge du logo dit « ça se clique ».** Retirer l'or des ornements a été écarté par Romain (23-10 : il « permet de bien mettre en valeur certains trucs ») ; règle B retenue le même jour : boutons en aplat du rouge du logo, liens soulignés de ce rouge, jamais ce rouge en texte sur le sombre (charte §1, cahier §11). |
| **Surcharge de choix** (Iyengar et Lepper, 2000) | Trop d'options d'un coup inquiète et fait renoncer. | Barre presque vide et menu en trois rubriques (modèle de l'Alliance, §11 du 15-10) ; recherche et familles repliables du rail de la carte. | Peu de choix visibles d'un coup : ranger, filtrer, chercher, retirer ce qui ne sert pas. À surveiller : le rail de la carte et le panneau des langues, qui grossissent à chaque couche. |

**Nuance.** L'effet de surcharge est discuté : la méta-analyse de
Scheibehenne et coll. (2010) trouve un effet moyen proche de zéro, net
seulement quand les options se comparent mal. D'où la règle : moins de choix
*à la fois*, pas moins de contenu.

---

## 3. Accessibilité daltonisme (décision Romain 2026-08-22)

### 3.1 Le principe non négociable (WCAG 1.4.1, niveau A)

**La couleur ne doit jamais être le seul vecteur d'information.** Toujours
doubler : libellé, icône, motif, forme, graisse. Ceci vaut pour TOUT le site,
pas seulement le mode daltonien — c'est la base, l'option vient en plus.

### 3.2 Analyse de notre palette

Confusions probables (deutéranopie/protanopie, ~8 % des hommes) :
- **terracotta `#c8562e` ↔ olive `#5e7b3a`** : axe rouge-vert, la pire paire.
  Ce sont les couleurs des familles « Aprene » et « Participar » → les
  familles doivent être distinguables par leur icône et leur libellé seuls.
- **brick `#a5342a` ↔ teal `#1f5f63`** : sombres tous deux, risque en
  protanopie sur petits éléments.
- gold `#e0a43b` et sky `#3e7cb1` : sans problème majeur.

### 3.3 Palette de secours de référence : Okabe-Ito (2008)

Standard scientifique, 8 couleurs discernables par tous les types courants :
noir `#000000`, orange `#E69F00`, bleu ciel `#56B4E9`, vert-bleu `#009E73`,
jaune `#F0E442`, bleu `#0072B2`, vermillon `#D55E00`, pourpre `#CC79A7`.

### 3.4 Plan d'implémentation (option à cocher)

1. **D'office, sans option** : redondance icône+libellé partout, contrastes
   AA vérifiés, test en niveaux de gris avant toute publication.
2. **Option « mode daltonien »** (case dans les réglages, persistée en
   `localStorage`) : pose `data-vision="daltonisme"` sur `<html>` ; les
   tokens `--color-*` basculent vers des équivalents alignés Okabe-Ito
   (terracotta→vermillon `#D55E00`, olive→bleu `#0072B2`, teal→vert-bleu
   `#009E73`, gold→jaune, sky→bleu ciel) ; la carte ajoute des motifs
   (hachures/pointillés) aux zones dialectales.
3. **Vérification** : simulateurs (deutéranopie, protanopie, tritanopie) +
   capture en niveaux de gris, à chaque évolution visuelle.

---

## 4. Identité méditerranéenne — contre le « site de nulle part »

### 4.1 Le gisement occitan lui-même

- **La croix occitane** : rouge et or — notre palette brick/gold est déjà
  la sienne. Ses douze pommeaux et ses bras évasés sont un motif géométrique
  déclinable (filets, puces, trames) sans jamais la caricaturer.
- **L'étoile à sept branches du Félibrige** : second motif identitaire,
  plus rare, utilisable en détail (puces de liste, séparateurs).
- **L'héritage des troubadours** : la première grande littérature d'Europe
  en langue vulgaire. Autorise un registre typographique éditorial :
  lettrines, citations mises en scène, rythme de page « manuscrit ».

### 4.2 Catalogne (la cousine)

- Tradition : La Llotja (1775), le modernisme, **Miró** (couleurs franches,
  formes organiques, joie), **Mariscal** (trait libre, chaleur populaire).
- Studios actuels : **Mucho** (identité Fondation Miró), **Forma**
  (graphisme + illustration). Barcelone prouve qu'on peut être
  méditerranéen ET minimal : couleur vive posée sur structure rigoureuse.

### 4.3 Italie

- **Munari** et l'école milanaise (Olivetti) : la rigueur joueuse — un
  design savant qui garde l'esprit d'enfance. Référence de ton parfaite
  pour un site d'apprentissage exigeant et chaleureux.
- `archiviograficaitaliana.com` : répertoire de référence à consulter.

### 4.4 Grèce

- Studios actuels (Kunst, Komodo, The Greek Foundation) : minimalisme
  ensoleillé — blanc généreux, une couleur saturée, récit culturel assumé.
  Preuve qu'une petite culture peut avoir un design de classe mondiale
  sans folklore.

### 4.5 Synthèse : la formule Lo Ligam

**Structure suisse + lumière méditerranéenne + matière occitane.**
Grille et hiérarchie strictes (§1) ; crème chaud, terracotta et or comme
lumière du Midi, aplats francs à la Miró ; croix/étoile en motifs discrets,
designs Canva en vedette, lettrines de troubadour aux moments de récit.
Jamais : clichés folkloriques (parchemin, faux médiéval), ni le minimalisme
gris interchangeable des templates.

---

## 5. Faire vivre le site — innovations à intégrer

État de l'art 2026, tout en natif (0 Ko de JavaScript d'animation) :

- **View Transitions API** : transitions de page fluides et natives entre
  les routes (SvelteKit l'expose via `onNavigate`). Le site cesse de
  « clignoter » entre pages → sensation d'application vivante.
- **Animations pilotées par le défilement** (`animation-timeline: view()`)
  — déjà en place sur l'accueil, à généraliser avec garde `@supports`.
- **Micro-interactions utiles seulement** : feedback au clic, états de
  survol soignés, jamais de mouvement gratuit (cohérence Mayer §2.1).
- **Deux disciplines absolues** : `prefers-reduced-motion` respecté
  partout ; animations sur le compositeur (transform/opacity uniquement)
  pour tenir 60 fps et le Core Web Vital INP.
- **Idées propres au projet** : le mot du jour qui se révèle, la carte qui
  « respire » en fond de section, les designs en vitrine qui glissent
  lentement — la vie aux moments de récit, le calme aux moments d'étude.

### 5 bis. Chorégraphie du défilement de l'accueil (décidée le 2026-08-22)

Le scénario appliqué à la page d'accueil, réutilisable pour toute page RÉCIT :

1. **Lié au geste, jamais subi** : les apparitions sont pilotées par le
   progrès du défilement (`animation-timeline: view()`), donc réversibles —
   remonter rejoue à l'envers. Aucune animation « déclenchée » qui se joue
   sans qu'on la contrôle.
2. **Un seul motif d'apparition** : fondu + translation verticale de ~26 px,
   fenêtre `entry 8% → 42%`. Pas de zoom, pas de rotation, pas de rebond.
3. **L'échelonnement raconte l'ordre de lecture** : frères décalés de ~8 %
   de fenêtre chacun (les 4 portes, les 3 chiffres) — la page « s'égrène ».
4. **Un seul moment signature** : le filet ondulé se **dessine** au passage
   (`stroke-dashoffset` piloté par le défilement, `pathLength="1"`).
5. **Les vies indépendantes ne se mélangent pas** : le fleuve de designs
   défile en continu, indifférent au scroll — c'est le fond vivant, pas un
   événement.
6. **Discipline technique** : `transform`/`opacity` uniquement (compositeur,
   60 fps) ; tout dans `@supports (animation-timeline: view())` — navigateur
   ancien = page complète sans animation ; `prefers-reduced-motion: reduce`
   fige tout, fleuve compris.

---

## 6. Site vs App — clarification proposée (à valider par Romain)

Le flou vient de ce qu'on nomme deux choses « le site ». Proposition :

**Un seul produit** (la plateforme web Lo Ligam, une seule base de code,
une seule adresse), mais **deux registres d'écrans** aux règles distinctes :

| | Registre RÉCIT (« site ») | Registre OUTIL (« app ») |
|---|---|---|
| Pages | accueil, découvrir, carte, designs, qui sommes-nous | parcours, leçons, exercices, compte, admin |
| Rôle | donner envie, raconter, relier | faire apprendre, faire agir |
| Design | expressif : animations, designs en vedette, typographie généreuse | sobre : charge cognitive minimale (§2.2), zéro décor pendant l'effort |
| Rythme | scroll, découverte | sessions courtes, gestes répétés |

Une décision de design se prend donc toujours en sachant **dans quel
registre** on est. (Il n'y a pas d'application mobile native au programme ;
le mot « app » dans nos documents désigne le registre outil.)

---

## 7. Rien au hasard — liste de contrôle qualité

Avant toute mise en ligne d'un changement visuel :
1. `npm run build` passe ; tests verts.
2. **Regarder la page** (capture), desktop ET mobile — pas seulement mesurer.
3. Contraste AA vérifié sur les textes touchés ; test niveaux de gris.
4. `prefers-reduced-motion` : la page reste complète sans animation.
5. Poids : images WebP dimensionnées, pas de police ni de script ajoutés
   sans pesée (sobriété = valeur du projet).
6. Occitan nouveau → validation Romain (dicodòc / lo Congrès).
7. Cohérence : tokens de `app.css` uniquement, grille respectée, un seul
   style par rôle de bouton.
8. Psychologie (§2.4) : étapes comptées, fin soignée, l'or pour mettre en
   valeur et le rouge du logo (aplat ou soulignement) pour ce qui se clique,
   peu de choix à la fois, aucune attente inventée.
9. Les deux langues : regarder la page en occitan ET en français ; un texte
   français plus long ne doit ni déborder ni mordre sur ses voisins.

---

## Sources principales

Nielsen Norman Group (10 heuristiques, 2020) · Müller-Brockmann, *Grid
Systems* · Ruder, *Typographie* · Mayer, *Cognitive Theory of Multimedia
Learning* (Cambridge) · Sweller, *Cognitive load theory* (1988) · Loewen
et al., revue systématique Duolingo, *CALL* (2021) · Settles & Meeder, *A
Trainable Spaced Repetition Model*, ACL 2016 (research.duolingo.com) ·
Okabe & Ito, *Color Universal Design* (2008) · W3C, WCAG 2.1 SC 1.4.1 ·
awwwards.com (sites primés) · elias.studio · locomotive.ca ·
archiviograficaitaliana.com · Institut Ramon Llull (arts visuels catalans) ·
CSS-Tricks & Chrome DevRel (View Transitions, scroll-driven animations) ·
Wyatt Feaster, vidéo YouTube citée au §2.4 · Hull, *The goal-gradient
hypothesis* (1932) · Kahneman et coll., *When more pain is preferred to
less* (1993) · Buell & Norton, *The labor illusion*, *Management Science*
(2011) · von Restorff (1933) · Iyengar & Lepper, *When choice is
demotivating* (2000) · Scheibehenne et coll., méta-analyse de la surcharge
de choix, *Journal of Consumer Research* (2010).
