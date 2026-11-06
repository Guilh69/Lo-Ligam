# Feuille de coordination

> Lue par Mistral (Vibe, Vibe Hub) et par Claude avant toute tâche. Elle dit **qui a la main** et **ce qui est en cours entre deux agents**. Le détail de chaque chantier est dans `PILOTATGE.md`, les décisions dans `cahier-des-charges.md` §11 : ne pas les recopier ici. Une ligne par point, datée.

## Qui a la main
- **Depuis le 2026-11-06 au soir : Mistral.** Le forfait Claude de Romain est fini ; Claude reviendra quand Romain reprendra un abonnement (quelques mois). D'ici là, pas de contrôle par Claude : voir `AGENTS.md`, « Sans Claude ».

## Relais de Claude (2026-11-06)
- **Tout le travail de Claude est sur `master` et en ligne**, sauf ce qui suit.
- **Deux discussions Claude tournaient encore ce soir-là** (jeux de l'A1 ; correction « Qu'es aquò ? » dans les dessins de Remira, branche `claude/occitan-words-focus-interface-88d16a`, un fichier modifié non envoyé). Si au prochain `git pull` le commit 89030a4 n'est pas sur `master`, ne pas le refaire : demander à Romain.
- **Outil d'interpellation des parlementaires** : un commit jamais envoyé (`f8520d4`, script `app/scripts/elus-generar.mjs` et `app/static/data/elus.json`), sur la branche locale `claude/occitan-parliament-tool-c4e7c1` ; le dernier message de Romain était « Phase 3 », sans suite. À reprendre seulement si Romain le demande.
- **En attente d'un choix de Romain** (ne rien coder avant) : refonte de l'espace administrateur « Lo talhièr » (proposition du 06-11, PILOTATGE chantier 7) ; essai « Profondeur » v2 sur `/ensag/prigondor` (chantier 29) ; tri des 257 dessins de Remira sur `/admin/triar` (chantier 26).
- **Ce que Romain a à faire seul** : la liste du §1 de `PILOTATGE.md`.

## À faire par Mistral en premier (réglages, une fois)
1. Vérifier que `node` répond dans ton terminal (`node --version`). Sinon, voir `AGENTS.md`, « Sur cet ordinateur ».
2. Vérifier que tes compétences `joan`, `rodrigo`, `aran` sont visibles (dossier `C:\Users\perie\.vibe\skills`, écrit par Claude le 06-11). Si Vibe ne les trouve pas, proposer à Romain d'ajouter `skill_paths = ["C:\\Users\\perie\\.vibe\\skills"]` en haut de `C:\Users\perie\.vibe\config.toml`.
3. Vérifier que tes consignes générales sont lues : `C:\Users\perie\.vibe\AGENTS.md` (écrit par Claude le 06-11, à partir de la carte des projets de Romain).
4. **Autorisations** : par défaut, Vibe demande avant `npm test`, `git commit`, `git push`. Dans le Vibe Hub (sans fenêtre de question), ces commandes peuvent être refusées. Proposer à Romain, une fois, de les autoriser dans une séance Vibe en terminal (« toujours autoriser ») ; Claude n'a pas eu le droit de les ajouter lui-même.
5. **Garde-fou Git pour toi** : Vibe sait lancer un crochet avant chaque commande (`hooks.toml`, point `pre_tool` ; il reçoit en JSON `tool_name` et `tool_input`, et refuse si la sortie est `{"decision": "deny", "reason": "…"}`). Adapter `.claude/hooks/garde-fou-git.mjs` (qui bloque `git add -A`, `commit -a`, `--no-verify`, `core.hooksPath`) en crochet Vibe serait la meilleure protection : à proposer à Romain, sur une branche `mistral/garde-fou`, après lecture de la documentation de Vibe.

## Dernier point Mistral
- (aucun pour l'instant)

## Dernier point Claude
- 2026-11-06 : relais écrit (ce fichier, `AGENTS.md` « Sur cet ordinateur » et « Sans Claude », `C:\Users\perie\.vibe\AGENTS.md`, compétences joan/rodrigo/aran) ; Vibe Hub corrigé (Node dans le PATH, anciens dossiers de Lo Ligam retirés, messages d'erreur en français ; copie d'avant dans `C:\Users\perie\Depots\vibe-hub\.copies`).

## Consignes pour les deux agents
- Lire ce fichier avant de commencer une tâche ; y noter toute décision qui concerne l'autre agent, en une ligne datée.
- En fin de séance : mettre à jour « Dernier point » ici et `PILOTATGE.md`, puis tout envoyer (`git push`). Git est le seul canal entre les agents et les ordinateurs.
