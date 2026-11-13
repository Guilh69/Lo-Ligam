# S'imagina : état des lieux (13 novembre 2026)

Établi à partir du dépôt seulement. Romain : « L'outil s'imagina est super important : c'est celui qui me stimule le plus et devra être soigné et faire réfléchir » (`docs/vision/facetas-romain-2026-11-13.md`).

## Le schéma

```
S'imagina (rubrique 04, /imagina) ........ en chantier, 1 pièce sur 2
│
├─ Constitution (/constitucion) ......... EN LIGNE
│    ├─ Constitution de 1958 (445 blocs) ┐
│    ├─ Déclaration de 1789 (36)         │ occitan et français,
│    ├─ Préambule de 1946 (18)           │ face à face possible
│    └─ Charte de l'environnement (30)   ┘ non relue par Romain, noindex
│
├─ Las carrièras (/imagina/carrieras) ... « AVIAT » : la case existe, la page n'existe pas
│
└─ Plus tard (idées, rien de construit) : photomontages, produits, accueil
```

## Ce qui existe
- Rubrique dans le plan du site (`app/src/lib/data/planSite.js`) : menu, pied de page, onglets du téléphone. Page `/imagina` en deux cases (`app/src/routes/imagina/+page.svelte`).
- Constitution : 529 blocs, traduits de zéro (aucune traduction complète n'existait). Fichiers dans `app/src/lib/constitucion/`, 11 tests. Mentions « traduction non officielle », `noindex`.
- Case « Las carrièras » : marquée « Aviat », le lien est coupé. Aucune plaque, aucun générateur dans le dépôt.
- Les textes de la page sont modifiables par Romain (`imagina.*` dans `supabase/supabase-pagina-elements.sql`). Le SQL doit être exécuté par lui (PILOTATGE, chantier 41) : non vérifié d'ici.
- L'accueil n'a pas de quatrième porte : Romain a tranché « rien pour l'instant » (12-11).

## Ce que Romain a dit (ses mots)
- 12-11, pour la rubrique : « une catégorie s'imagine, un peu plus revendicatrice, avec la Constitution en occitan, des photomontages de plaques de rue en occitan, ce à quoi pourrait ressembler l'espace public avec de l'occitan, créer un imaginaire » (`cahier-des-charges.md` §11, 2026-11-12).
- Pour la Constitution : « montrer à quoi pourrait ressembler un pays qui respecte ses langues ; il ne faut pas changer les mots » ; « si elle n'existe pas, il faut la traduire avec une attention très importante » (§11, 2026-11-12).
- 13-11 : l'outil « me stimule le plus et devra être soigné et faire réfléchir » ; il ne veut pas se brider sur le nombre de chantiers (§11, 2026-11-13).
- Il a choisi la 4e rubrique parmi trois options, et « rien pour l'instant » pour l'accueil.

## Ce qui vient de l'IA (pas de Romain)
- Le nom « S'imagina », le ton (« montrer par les faits, jamais militant au sens pesant », repris du 22-10), les pictogrammes (fronton, deux plaques).
- Les pièces « envisagées » : générateur de plaque de rue à partir des noms de lieux du mod CS2, produits (dépend de l'INPI). Ce sont des pistes de l'IA, pas des demandes de Romain.
- Toute la traduction de la Constitution, l'occitan des cases, les langues es/en/ca/ar.
- Aucune pièce personnelle de Romain (photo, texte, plaque) n'est dans la rubrique.

## Ce qui manque
- Les pièces de Romain : c'est la case « Authenticité » de la grille (« manque »).
- Sa relecture de l'occitan de la Constitution (`LEGIR-ME.md` : mots à valider, noms d'outre-mer, tournures).
- Une raison de revenir : une seule pièce en ligne, dont la lecture est longue et plutôt passive.
- Rien qui « fasse réfléchir » au sens de Romain : pas de contraste avant/après, pas de question posée au visiteur.
- Pas de contrôle d'accessibilité ni de mesure du poids propres à la rubrique.

## Questions ouvertes pour une interview de Romain
1. Quelle émotion veux-tu qu'une personne ressente en sortant de S'imagina : de la fierté, de la surprise, un malaise, l'envie d'agir ?
2. Quelle rue, quel lieu ou quelle plaque as-tu en tête quand tu dis « l'espace public avec de l'occitan » ? Pourquoi celui-là ?
3. Revendicatrice, jusqu'où ? Qu'est-ce qui serait trop pesant à tes yeux, et qu'est-ce qui serait trop timide ?
4. Qu'est-ce qui, pour toi, « fait réfléchir » : une comparaison avant/après, un chiffre, une question, une histoire vécue ?
5. Au-delà de la Constitution et des rues, quelle autre scène du quotidien (administration, transports, écran du téléphone) aimerais-tu voir en occitan ?
