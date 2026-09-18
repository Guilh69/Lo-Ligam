# Lo Ligam

Site d'apprentissage de l'occitan (languedocien, norme classique) + plateforme de l'écosystème occitan. Prolonge la marque Instagram « Lo Ligam ».

## Travailler avec Romain
- **Non développeur.** Expliquer en français simple, une étape à la fois, dire quoi cliquer.
- **Ne jamais demander de clé API** : il utilise son abonnement.
- Contredire quand c'est justifié ; signaler coûts, risques et dérives de périmètre.
- Rôles : Claude conçoit/code/explique ; Romain installe, héberge, paie, décide.

## VOUS DEVEZ vérifier avant d'annoncer que c'est fait
- `npm run build` dans `app/` doit passer.
- Pour tout changement visuel : **regarder la page** (capture d'écran), pas seulement mesurer des valeurs en JS. Des mesures correctes ont déjà masqué des chevauchements bien visibles.
- Montrer la preuve (sortie de commande, capture). Ne jamais affirmer un succès non vérifié.
- Le panneau Browser doit être affiché côté Romain pour que les captures fonctionnent.

## Valeurs (non négociables)
Éthique, écologie (**sobriété : poids des pages et des images**), inclusivité (RGAA/WCAG, écriture inclusive), fierté occitane. Européen quand possible.

## Contenu
- L'occitan produit par Claude est **toujours à valider par Romain** (dicodòc / lo Congrès) avant publication.
- UX : animations soignées, sons discrets et désactivables, humour fin par touches.
- Périmètre MVP : A1, compte, questionnaire. Cartographie et modèle payant = en cours d'arbitrage, voir `cahier-des-charges.md` §3/§6/§11 avant de supposer l'ancien périmètre.

## Documents de référence
**`PILOTATGE.md` d'abord : l'ouvrir en début de séance, le mettre à jour en fin.** Puis `cahier-des-charges.md` (source de vérité + journal des décisions §11) · `charte-graphique.md` · `corpus-design.md` · `transposicion-racine2.md` · les documents pédagogiques listés dans PILOTATGE.

## Plusieurs conversations en parallèle
Romain travaille via plusieurs conversations séparées, une par thème. Elles ne se voient pas : **Git est le seul canal de synchronisation**.
- Avant une tâche conséquente : `git log --oneline -15` et `git status`.
- Committer par petits lots, **uniquement les fichiers qu'on a soi-même modifiés**.
- **Jamais de `git add -A`** sans relire `git status`.
- Modifications non committées d'une autre conversation : ne pas les écraser ni les committer à sa place ; le signaler à Romain.
- Fin de séance : vérifier que tout est **poussé** (committé ≠ poussé).
- Décisions transverses → `cahier-des-charges.md` §11, pas la mémoire d'une conversation.

## Économiser le contexte
La fenêtre de contexte est la ressource limitante : les performances se dégradent quand elle se remplit.
- Lire des extraits ciblés plutôt que des fichiers entiers ; préférer `grep` à la lecture intégrale.
- Ne pas relire un fichier qu'on vient d'éditer.
- Déléguer les explorations larges à un sous-agent plutôt que de remplir la conversation principale.
- Lors du compactage : **préserver la liste des fichiers modifiés, les décisions prises et ce qui reste à faire**.
