# Parcours utilisateur — Lo Ligam — MVP (Phase 1)

> Document vivant, rattaché au cahier des charges (étape 2 : spécifications fonctionnelles).
> Couvre **uniquement** le trajet du premier utilisateur, de l'ouverture à la fin de la leçon 1.
> Version : 0.1 · 28 juillet 2026

---

## 1. Vue d'ensemble

```
Ouverture
   │
   ▼
[A] Écran d'accueil ──► [B] Essai libre (1 mini-leçon, sans compte)   ← décision
   │                          │
   ▼                          ▼
[C] Création de compte / Connexion
   │
   ▼
[D] Questionnaire d'accueil
   │
   ▼
[E] Le parcours (carte des unités)
   │
   ▼
[F] Leçon 1, de bout en bout
   │
   ▼
[G] Fin de leçon (récompense) ──► retour au parcours
```

L'objectif de tout ce trajet : que la personne **apprenne ses premiers mots d'occitan dans les 3 premières minutes**, et ait envie de revenir.

---

## 2. Écran par écran

### [A] Écran d'accueil (première ouverture)
- **Objectif** : accueillir chaleureusement, dire la promesse en une phrase, donner envie d'entrer.
- **Choix de langue (au tout premier lancement)** : au MVP, deux langues — **occitan (par défaut, mis en avant)** et français. Les suivantes s'ajouteront progressivement : **catalan** (gros marché, langue sœur), puis **anglais**, puis espagnol / italien. Message implicite : l'occitan est chez lui, mais chacun peut passer à sa langue en un geste. Modifiable ensuite dans les réglages.
- **Ce que voit l'utilisateur** : le nom et l'identité de *Lo Ligam*, une phrase de bienvenue (ex. « *Benvenguda !* Apprends l'occitan, relie-toi à sa culture »), une illustration soignée.
- **Actions** : « Començar » (commencer) · « Ai ja un compte » (se connecter).
- **Points ouverts** : ton visuel, présence d'une courte animation d'accueil.

### [B] Essai libre avant inscription — *décision*
- **Objectif** : laisser goûter *avant* de demander un compte, pour réduire la friction et créer l'envie.
- **Ce que voit l'utilisateur** : une toute petite leçon (2-3 mots, avec audio et image), sans rien remplir.
- **Après l'essai** : « Crée un compte pour sauvegarder ta progression ».
- **Point ouvert (à trancher)** : garde-t-on cet essai libre au MVP, ou demande-t-on le compte d'emblée ? *(Recommandation : le garder — c'est un accélérateur d'adhésion éprouvé.)*

### [C] Création de compte / Connexion
- **Objectif** : entrer avec un minimum d'effort.
- **Ce que voit l'utilisateur** : « Continuer avec Google », « Continuer avec Apple », « Avec un e-mail ». Lien vers connexion si compte existant.
- **Actions** : choisir un mode, accepter les conditions + politique de confidentialité (case claire).
- **Points ouverts / contraintes** :
  - « Continuer avec Apple » est **obligatoire** si on propose d'autres connexions sociales et qu'on publie sur l'App Store.
  - RGPD : consentement explicite, finalités expliquées (cf. cahier des charges §8).

### [D] Questionnaire d'accueil
- **Objectif** : personnaliser l'expérience *et* recueillir des données utiles, sans lasser, en respectant la minimisation RGPD.
- **Sélection du niveau** : choix déclaré — « Debuti » (je débute) / « Ai qualas basas » (j'ai des bases) / niveaux supérieurs. Structuré selon le **CEFR (A1, A2, B1…)**. ⚠️ Au MVP, seul l'A1 a du contenu : les niveaux supérieurs s'affichent « bientôt ». Un vrai test de placement viendra plus tard.
- **Champs proposés** (à confirmer) :
  - *Nécessaire au compte* : e-mail (ou connexion Google/Apple).
  - *Utile & recommandé* : prénom ou pseudo · langue de départ (déjà choisie écran [A]) · niveau déclaré · motivation.
  - *Facultatif* : lieu de vie · origine (si déplacé·e). Précieux pour la carte et la communauté (phases ultérieures), jamais obligatoire.
- **Idée d'usage** : la **motivation** règle l'objectif quotidien (doux / normal / intensif) ; l'**origine** peut personnaliser un mot d'accueil.
- **Actions** : répondre, ou passer les champs facultatifs.
- **Âge** : **âge minimum 15 ans** (décidé). En dessous, pas d'inscription — ce qui évite l'obligation de consentement parental (seuil RGPD France = 15 ans). Vérifier l'âge à l'inscription (déclaratif au minimum).
- **Transparence** : une ligne expliquant *pourquoi* on demande chaque info.

### [E] Le parcours (carte des unités)
- **Objectif** : montrer le chemin, donner le sentiment d'une aventure, inviter à la 1ʳᵉ leçon.
- **Ce que voit l'utilisateur** : les unités du Cicle 1 présentées comme un chemin ; la 1ʳᵉ est ouverte, les suivantes verrouillées ; la progression (points, série) est visible.
- **Actions** : lancer la leçon 1.
- **Points ouverts** : métaphore visuelle du parcours (un chemin dans un paysage occitan ?), animations de déverrouillage.

### [F] Déroulé d'une leçon (la leçon 1)
- **Objectif** : enseigner un petit bloc cohérent, de façon vivante et gamifiée.
- **Enchaînement type** :
  1. Courte intro de l'unité (le lieu, l'ambiance).
  2. Présentation de 3-4 mots/expressions (audio + image, peu de texte pour un vrai débutant).
  3. Série d'exercices variés (écoute-et-choisis, association, reconstruction…).
  4. **Capsula culturala** : un temps culturel non noté (proverbe, chanson).
  5. Petit récap.
- **Actions** : répondre, écouter, réessayer.
- **Points ouverts** : nombre d'exercices, gestion de l'erreur (bienveillante), déclenchement des animations de réussite.

### [G] Fin de leçon (récompense)
- **Objectif** : célébrer, ancrer l'envie de continuer.
- **Ce que voit l'utilisateur** : points gagnés, série mise à jour, encouragement chaleureux (en occitan : « *Plan jogat !* »), éventuel badge.
- **Actions** : continuer vers la leçon suivante, ou revenir au parcours.
- **Point ouvert** : forme exacte de la récompense, animation de célébration (élégante, pas tape-à-l'œil).

---

## 3. Décisions d'expérience (tranchées / en cours)

- [x] **Essai libre avant compte** : OUI.
- [x] **Langues au MVP** : **occitan (par défaut) + français**, pour l'interface *et* le cœur du parcours d'apprentissage. Élargissement ensuite : catalan → anglais → espagnol / italien.
- [x] **Langue du contenu = langue d'interface au MVP** (oc + fr). On n'ouvre pas 6 langues de contenu d'un coup : on élargit langue par langue.
- [x] **Niveaux structurés CEFR** (A1, A2, B1…). MVP = contenu A1 ; niveaux supérieurs « bientôt ». Choix de niveau déclaré au départ ; test de placement plus tard.
- [x] **Champs du questionnaire** : minimum nécessaire + utiles + facultatifs (voir [D]). À confirmer dans le détail.
- [x] **Âge minimum : 15 ans** (pas d'inscription en dessous). Évite le consentement parental (seuil RGPD France = 15 ans).

---

## 4. Prochaine étape proposée

Une fois ce parcours validé (ou amendé par tes idées), deux suites possibles :
- **Étape 3 — Choix techniques** : quelle technologie pour construire tout ça (web + mobile), quels services pour les comptes et les données.
- **Étape 4 — Design** : commencer à dessiner un de ces écrans (l'accueil, le parcours, ou la leçon) pour voir Lo Ligam prendre vie.
