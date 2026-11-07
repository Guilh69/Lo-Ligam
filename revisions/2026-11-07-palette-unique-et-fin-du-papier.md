# Palette unique et fin du papier découpé : plan (07-11, soir)

Demande de Romain (07-11) : finir le papier découpé, mais d'abord un plan détaillé, et **tout regrouper en un seul endroit** pour pouvoir changer vite de direction artistique. Être efficace et logique.

## Constat (inventaire du 07-11)
- 664 couleurs différentes écrites en dur dans les fichiers publics. Les teintes de la direction artistique sont recopiées partout : le rouge du logo dans 15 fichiers, l'or dans 19, la crème et l'encre dans 19 et 26.
- Il en résulte des quasi-doublons qui « se baladent » : olive `#4f6a2f` (jeux) et `#55702f` (cases de S'apren, Cultura), bleu `#2b6496` (jeux) et `#2f6a9c` (cases).
- Environ 150 boutons publics ne sont pas encore en papier ; une partie ne sont pas de vrais boutons (cartes, tuiles de jeu, onglets en verre du rail).

## Principe
1. **Une seule source : `app/src/lib/styles/palette.js`.** Elle contient les teintes (brique, rouge vif, or, olive, sarcelle, bleu, bleu de l'oïl, prune, ocre, orange clair, crème, encre, tuile), puis leurs rôles : boutons (agir, carton par thème, choisi, juste), familles de jeux, carte (intensité, occitan, dialectes, langues), cases des rubriques.
2. **Le CSS en découle** : `app/src/lib/styles/palette.css` est **généré** par `node scripts/palette-css.mjs` (variables `--p-…` et jetons des boutons par thème) ; `app.css` l'importe en premier. Un test vérifie que le CSS généré est à jour : impossible d'oublier de le régénérer.
3. **Tout le reste lit la palette** : `app.css` et `papier.css` (jetons), carte (`colaDonadas.js`, `colaLenga.js`, `lengas.js`, `RailJaces.svelte`), jeux (`Illustracion.svelte`, `Sala.svelte`), cases (`teulas.js`, donc aussi le parcours et `cultura/index.js`).
4. Hors palette, volontairement : les couleurs du logo (`--logo-*`, recettes de Romain), les dessins (scènes des jeux, pluie de mots : ce sont des illustrations), le daltonisme (palette Okabe-Ito à part).

**Changer de direction artistique = modifier `palette.js`, lancer `node scripts/palette-css.mjs`, puis `npm run build`.**

## Étapes, dans l'ordre
| # | Étape | Fichiers | Contrôle |
|---|---|---|---|
| 1 | Créer `palette.js`, le générateur et le test | `lib/styles/palette.js`, `scripts/palette-css.mjs`, `lib/styles/palette.css`, `lib/styles/palette.test.js` | test au vert |
| 2 | Brancher les jetons : boutons et socle papier | `app.css`, `papier.css` | rendu identique (captures avant/après) |
| 3 | Brancher la carte | `colaDonadas.js`, `colaLenga.js`, `lengas.js`, `RailJaces.svelte` | rendu identique |
| 4 | Brancher jeux et cases (les quasi-doublons s'alignent : olive et bleu) | `Illustracion.svelte`, `Sala.svelte`, `teulas.js`, `cultura/index.js` | captures : salle de jeux, S'apren, Cultura |
| 5 | Commit et mise en ligne du lot palette | | build, tests |
| 6 | Papier sur les zones restantes, une zone par commit : Remira, Anem, lecteur de livre, interrupteurs, voile du menu, choix de langue, panneau d'ambiance, voix (atlas, fiche), guide, médias (radios, télé), carrousel, visio | un composant à la fois | capture clair et sombre |
| 7 | Mise en ligne, PILOTATGE, mémoire | | |

Laissés de côté, à dire à Romain : outil d'édition (Edicion, pour lui seul), onglets en verre du rail de la carte (décision du 15-10), admin et Lo talhièr.

## Méthode par zone (étape 6)
Lire le balisage et le style du composant ; un vrai bouton reçoit `pc` (pièce rouge), `pc pc-2` (carton), `pc pc-icone`, `pc pc-chip` ; une carte ou une tuile reste telle quelle ; la feuille du composant ne garde que la mise en page. Relire le diff, capture en clair et en sombre, build et tests, commit.

## Ce que Romain peut faire seul / avec aide
- Seul, maintenant : rien à faire pendant le chantier ; regarder le site en ligne à la fin.
- Avec aide, plus tard : changer de direction artistique (demander « change la palette » : une seule modification de `palette.js`).
