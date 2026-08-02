# Charte graphique — Lo Ligam

> Dérivée de l'identité **Instagram Lo Ligam** déjà existante. L'app *prolonge* cette marque (même âme visuelle), avec la retenue qu'exige une interface.
> Couleurs en hex **approximatifs** — à prélever précisément sur les vrais visuels. · v0.1

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

Croix occitana (or sur rouge) = signature à réutiliser avec parcimonie.

---

## 2. Typographie & ton

- Titres : semi-serif / slab chaleureux, occitan d'abord.
- Sous-titre : français en *italique*, entre parenthèses.
- Prononciation phonétique proposée + bouton audio (« escota »).
- Ton : fier, chaleureux, pédagogique, jamais froid.

---

## 3. Illustrations

- Style plat, chaleureux, un brin storybook / troubadour.
- Motifs récurrents : ostal, dracs, castèls, arbres/paysages, rose des vents, croix occitana, cartes de l'espace occitan.
- Rôle dans l'app : **accents**, pas décor permanent (voir §5).

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

## 6. Décision

L'identité visuelle de Lo Ligam est **actée** : celle de l'Instagram existant, adaptée aux règles d'interface ci-dessus. Sert de référence à Claude Code.
