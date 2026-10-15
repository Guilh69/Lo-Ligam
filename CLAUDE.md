# Lo Ligam

Site d'apprentissage de l'occitan (languedocien, norme classique), support des cours en visio de Romain (repositionnement du 2026-10-06, cahier §11). Prolonge la marque Instagram « Lo Ligam ».

## Travailler avec Romain
- **Toujours en français**, sans exception : réponses, messages d'avancement, légendes de captures, questions. Jamais d'anglais (Romain s'en est agacé plusieurs fois).
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
- **Vérifier d'abord avec l'API de lo Congrès**, avant de montrer un mot à Romain : `cd app` puis `node scripts/verificar-oc.mjs mot1 mot2` (occitan) ou `node scripts/verificar-oc.mjs --fr mot` (français → occitan, avec la variété). Clé dans `app/.env`, ne jamais l'afficher.
- Depuis le 2026-10-04, Claude ne produit plus de contenu pédagogique à la place de Romain : il questionne, vérifie et code (cahier §11).
- UX : animations soignées, sons discrets et désactivables, humour fin par touches.
- Périmètre MVP : A1, compte, questionnaire. Cartographie et modèle payant = en cours d'arbitrage, voir `cahier-des-charges.md` §3/§6/§11 avant de supposer l'ancien périmètre.

## Documents de référence
**`PILOTATGE.md` d'abord : l'ouvrir en début de séance, le mettre à jour en fin.** Puis `cahier-des-charges.md` (source de vérité + journal des décisions §11) · `charte-graphique.md` · `corpus-design.md` · `transposicion-racine2.md` · les documents pédagogiques listés dans PILOTATGE.

## Plusieurs conversations en parallèle — et plusieurs ordinateurs
Romain travaille via plusieurs conversations séparées, une par thème, et depuis plusieurs ordinateurs. Rien de tout ça ne se voit : **Git est le seul canal de synchronisation**.
- **Début de séance : `git pull` d'abord** (l'autre ordinateur a pu pousser) ; fin de séance : tout pousser.
- Avant une tâche conséquente : `git log --oneline -15` et `git status`.
- Committer par petits lots, **uniquement les fichiers qu'on a soi-même modifiés**.
- **Jamais de `git add -A`** sans relire `git status`.
- Ces règles sont appliquées par un crochet (`.claude/hooks/garde-fou-git.mjs`, déclaré dans `.claude/settings.json`) : `git add -A/./-u`, `commit -a`, `--no-verify` et tout changement de `core.hooksPath` sont bloqués. Ajouter les fichiers par leur nom. Les autorisations communes à tous les ordinateurs vont dans `.claude/settings.json`, pas dans `settings.local.json`.
- **design-stock : rien de plus de 1 Mo dans Git** (vidéos et .zip ignorés ; `.githooks/pre-commit` refuse le reste). Ne pas contourner le garde-fou : le gros fichier reste sur le disque (cahier §11, 2026-10-12).
- Modifications non committées d'une autre conversation : ne pas les écraser ni les committer à sa place ; le signaler à Romain.
- Fin de séance : vérifier que tout est **poussé** (committé ≠ poussé).
- Décisions transverses → `cahier-des-charges.md` §11, pas la mémoire d'une conversation.

## Économiser le contexte
La fenêtre de contexte est la ressource limitante : les performances se dégradent quand elle se remplit.
- Lire des extraits ciblés plutôt que des fichiers entiers ; préférer `grep` à la lecture intégrale.
- Ne pas relire un fichier qu'on vient d'éditer.
- Déléguer les explorations larges à un sous-agent plutôt que de remplir la conversation principale.
- Lors du compactage : **préserver la liste des fichiers modifiés, les décisions prises et ce qui reste à faire**.
