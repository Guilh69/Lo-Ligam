# Diagnostic des couleurs, 2026-11-07

Demande de Romain : « Les couleurs ne vont pas. Le crème fait slop Claude et la palette ne va pas bien ensemble. »
Rien n'a été changé dans les jetons du site (`app.css`, `papier.css`). Les pistes sont sur des pages d'essai `/ensag/palette-*`.

## Comment c'est mesuré

- Firefox sans fenêtre, 1830 × 940 (ordinateur) et 390 × 844 (téléphone, densité 2), thèmes clair et sombre.
- Pages : accueil `/`, `/apren`, `/apren/jocs`, et l'accueil avec le menu ouvert. 16 captures, regardées une à une.
- Pour chaque texte : couleur calculée par le navigateur, fond réel derrière lui, contraste WCAG.
- Pour chaque capture : part de l'écran occupée par chaque famille de teinte (« vive » = intensité d'au moins 45 sur 255).
- Les captures et les scripts sont dans le dossier de notes de la session (`captures-diagnostic-couleurs`), hors du dépôt pour ne pas l'alourdir.

## Ce qui est mesuré

### 1. Trop de teintes vives, à poids égal

| Page (thème clair, ordinateur) | Teintes vives | Part de l'écran |
|---|---|---|
| Accueil, barre du haut | 3 : brique, sarcelle, or | boutons seulement |
| `/apren` | 6 : brique 19 %, sarcelle 6 %, or 4 %, olive 4 %, bleu 4 %, prune 1 % | 39 % de l’écran |
| `/apren/jocs` | 5 : sarcelle 11,5 %, brique 10,8 %, or 10,6 %, bleu 10,4 %, olive 9,6 % | 53 % de l'écran |

Sur les jeux, aucune teinte ne domine : cinq couleurs à 10 % chacune, toutes de clarté voisine (OKLCH L de 0,45 à 0,53). L'œil n'a pas de point d'entrée, et les teintes se disputent. Les teintes elles-mêmes (OKLCH H) : brique 37°, ocre 58°, or 79°, olive 130°, sarcelle 201°, bleu 248°, prune 341° : sept teintes réparties sur tout le cercle. La brique et la sarcelle sont presque complémentaires (164° d'écart) : c'est la paire qui vibre le plus.
Chez Busuu et La Fourche, c'est l'inverse : une couleur d'action (plus le vert du « juste » chez Busuu, plus un jaune pâle chez La Fourche), le reste est neutre.

La barre du haut aggrave cela depuis le 07-11 : « Reservar un cors » en brique, « Se connecter », « Menú », « Fr » et le globe en sarcelle, « Òc » en or. Trois teintes dans la même rangée de boutons.

### 2. La palette s'est faite par couches, pas par système

Mesuré avant puis après la fusion de la « palette unique » de midi (`palette.js`). Celle-ci a réglé les doublons entre S'apren et les jeux (bleu `#2b6496` et olive `#4f6a2f` partout), mais pas les autres :

- Il reste un troisième bleu, `#3e7cb1` (`--color-sky`, `--t-ens-bil`), et une troisième olive, `#5e7b3a` (`--color-olive`, `--t-ens-esc`), dans `app.css`, hors de la palette unique.
- Huit crèmes différents lus à l'écran sur les pages publiques : `#f7f3ee`, `#fbf1e1`, `#f5ead8`, `#efe1c6`, `#f7e6d5`, `#eee8d9`, `#efe9dd`, `#f1e9d6` (les trois derniers, lus sur la page des jeux, sont à 4 niveaux au plus l'un de l'autre sur 255 : trois crèmes que l'œil ne distingue pas).
- 739 valeurs hexadécimales différentes écrites en dur dans `app/src` après la fusion (742 avant ; illustrations et cartes comprises). Les plus fréquentes : `#fbf1e1`, `#2a1a10`, `#b53d17`, `#eeaf34`.
- Aucun changement visible de l'écran entre avant et après la fusion : les teintes de la palette unique reprenaient celles qui étaient déjà affichées.

### 3. Pourquoi le crème fait « générique »

- Le fond lui-même (`#f7f3ee`) est presque neutre (OKLCH intensité 0,008). Ce n'est donc pas lui qui fait « crème » : c'est tout ce qui l'entoure.
- Le halo rose-saumon de l'accueil : 20 % des pixels sur ordinateur (lavis chauds : halo et reliefs de la carte), environ 61 % de l’écran sur téléphone, des fumées de terracotta qui rappellent les fonds à dégradé flou des pages générées.
- Quatre teintes chaudes contiguës (brique 37°, ocre 58°, or 79°, crème 80-84°) : l'ocre d'« Amassa. » et la brique du bouton ne se distinguent que par la clarté, pas par la teinte.
- L'association beige + terracotta + titres à empattement est, à mon avis (pas une mesure), la recette que reproduisent le plus souvent les pages générées par IA. Les titres Limelight, eux, sont singuliers : le problème n'est pas la police.
- Les deux inspirations de Romain ont un fond blanc ou bleuté, pas crème.

Hypothèse de départ de la demande : confirmée sur le nombre de teintes et sur l'accumulation des crèmes ; **nuancée** sur le fond : le plâtre est presque blanc, c'est le halo et l'entourage chaud qui donnent l'impression de crème.

### 4. Défauts de contraste réels (hors question de goût)

| Où | Mesure | Cause |
|---|---|---|
| Accueil, clair : « Reservar un cors » | encre `#2a1a10` sur brique : **2,91** (13 px) | `.acuelh a { color: inherit }` (`app/src/lib/acuelh/acuelh.css:43`) l'emporte sur `.pc` : le texte ne prend plus la couleur de la pièce |
| Accueil, clair : « Se connecter » | encre sur sarcelle : **2,29** | même règle |
| Accueil, sombre : « Se connecter » | crème sur carton crème : **1,15** (presque invisible) | même règle ; c'est ce qu'on voit sur la capture sombre de l'accueil |
| Menu : « La comunautat », « Lo Ligam » | `#e3baa2` sur brique : **3,23** (11,5 px) | texte secondaire trop pâle sur la brique |
| Accueil sur téléphone : paragraphe sur le halo | **4,05** à droite du paragraphe, 5,7 à gauche (pixels derrière le texte) | le halo saumon passe derrière un texte de 19 px ; seuil 4,5 |

Un correctif d'une ligne règle les trois premiers (`.acuelh a:not(.pc)`). Je ne l'ai pas appliqué : à décider avec Romain, hors du choix de palette.

Tout le reste passe : encre sur plâtre 15,2 ; texte secondaire 6,3 ; ocre sur plâtre 5,07 ; brique sur plâtre 5,2 ; crème sur brique 5,15 ; crème sur sarcelle 6,5 ; crème sur bleu 5,1 à 5,6 ; crème sur olive 5,0 à 5,5 ; crème sur prune 7,9 ; encre sur or 8,6. La page des jeux n'a aucune erreur de contraste. Le brique en texte sur le fond sombre est à 3,18 : c'est la règle B du 23-10 (jamais de rouge en texte sur le sombre), respectée.

Non vérifié : les mots « Aicí, l'occitan s'apren » (couleur pâle qui se remplit au défilement) et les chiffres « 01 02 03 » (contours) sont des états d'animation, mesurés hors animation à 1,35 et 1 : à regarder en défilant, pas à compter comme défauts.

### 5. Le thème sombre

Même diagnostic, un cran moins grave : le fond `#22100a` est un brun très sombre (intensité 0,033, plus marquée que celle du plâtre clair) et l'accueil n'y montre que la brique et l'or. Les pages S'apren et jeux montrent les mêmes cinq ou six teintes en aplat. L'anomalie propre au sombre est « Se connecter » (voir plus haut).

## Le halo : d'où il vient, et ce qui en a été retiré (demande de Romain, 07-11)

Romain : « il faut savoir d'où vient ce halo et le supprimer s'il n'est pas utile ». Il y en a deux, de même famille, et aucun ne porte d'information :

1. **L'accueil : le fond animé `#fons`** (`app/src/lib/acuelh/motor.js`, shader WebGL « Venas d'aur », la « Brasa » de 2026-10-07). Il est dessiné pour le thème sombre : un marbrage de brique et de corail, des veines d'or, une lueur sous la souris. En clair, le shader ne fait que reteindre ce même marbrage en saumon sur le plâtre (`col = mix(plâtre, #c26e42, intensité)`), d'où le halo rose : environ 61 % de l'écran sur téléphone, avec un texte à 4,05 de contraste au plus fort du halo. Il a un coût : 25 évaluations de bruit par pixel et par image (cinq marbrages de cinq niveaux), à demi-résolution. **Retiré en clair** : le fond est le plâtre nu. Les courbes de niveau de la carte (du vrai relief, tracées par le même shader) restent. Le fond léger CSS (`.brasa`) fait pareil en clair (lueurs, dégradé beige, vignettage) : retiré aussi.
2. **Les pages intérieures : la « braise » en haut à gauche** (24 pages, un dégradé radial de terracotta à 26 % posé dans chaque page, et un coin d'or à 9 % en haut à droite dans 20 d'entre elles). C'est le cadre commun des pages depuis `/mots`. Remplacée dans les 24 fichiers par deux jetons, `--t-braise` et `--t-braise-or` (`app.css`) : **transparents en clair, inchangés en sombre**. Pour la rendre au clair, il suffit de remettre la valeur du sombre dans ces deux jetons.

Vérifié : le coin haut-gauche de l'accueil et de S'apren passe de `rgb(238, 218, 208)` à `rgb(247, 243, 238)`, le plâtre exact ; même résultat sur `/mots`, `/ideas`, `/apren/visio`. Le thème sombre n'a pas bougé (S'apren sombre : 2 152 pixels différents avant et après, contre 5 421 entre deux captures identiques : ce sont les dessins animés des tuiles). Rien d'autre n'a été touché.

Laissé tel quel, à dire à Romain : le thème sombre garde son « Venas d'aur » (choix de Romain des 07, 15 et 22-10) ; les petits points de poussière de l'accueil (`#estelas`) ; quelques dégradés radiaux isolés, de forme différente, dans la carte et les fiches ; le composant `PageBackground.svelte` (« halos colorés flous »), qui n'est utilisé nulle part.

## Les trois pistes et l'outil (pages d'essai, rien n'est changé sur le site)

Pages : `/ensag/palette-actuel` (référence), `/ensag/palette-brique`, `/ensag/palette-jaune`, `/ensag/palette-accordee`. Chacune montre les vrais composants (pièces de `papier.css`, croix du logo, polices, tuiles de S'apren, familles de jeux, réponses, textes) en clair et en sombre, avec le panneau « Retoucher les couleurs ».

| Piste | Idée | Teintes vives | Ce qu'elle remet en cause |
|---|---|---|---|
| 1 · Brique seule | Fond presque blanc, texte presque noir, la brique pour agir et pour la mise en valeur ; « choisi » noir ; « juste » en vert pâle | 1 | les tuiles de couleur du 24-10 (blanches sauf la première) ; l'ocre et l'or de l'interface (ils restent dans le logo) |
| 2 · Brique et jaune pâle | Fond blanc, brique + jaune pâle et or pour les pièces et les tuiles (La Fourche) | 2 | la sarcelle des pièces discrètes (07-11), le bleu et la prune |
| 3 · Multicolore accordé | Tuiles de couleur conservées, mais à la même clarté et intensité (OKLCH L 0,50, C 0,072), fond très légèrement froid (Busuu), pièces discrètes gris-bleu | 2 (brique, or) | la sarcelle vive des pièces (07-11) ; les tuiles saturées du 24-10 |

Aucune piste ne touche à la brique du logo ni à la règle B (la brique reste ce qui se clique). Le diagnostic vise deux décisions récentes de Romain : les tuiles multicolores de S'apren (24-10) et les cartons sarcelle du thème clair (07-11).

Verdict de l'outil sur les valeurs mesurées (`coherence.test.js` les verrouille) : le site actuel en clair sort « À revoir » (3 teintes vives, 3 teintes chaudes voisines, action et « juste » confondus au daltonisme) ; les trois pistes sortent « Accordée » en clair et en sombre, tous les textes à 4,5 ou plus.

### L'outil « Retoucher les couleurs »

- `app/src/lib/palette/coherence.js` : contrastes WCAG, OKLCH, simulation du daltonisme, verdict en phrases, « Accorder et tamiser les tuiles ».
- `app/src/lib/palette/pistes.js` : les rôles (fond, surface, texte, action, choisi, juste, bouton discret, mise en valeur, textes sur pièces, six tuiles) et les trois pistes ; chaque rôle correspond à `palette.js` (TEINTES, BOUTONS, CASES) et aux jetons de fond d'`app.css`.
- `PaletteOutil.svelte` et `EssaiPalette.svelte` : le panneau et la scène. Les modifications restent dans le navigateur de Romain (localStorage) ; « Copier ma palette » les renvoie à Claude.
- Pour la suite (non fait) : le même panneau sur le vrai site, pour Romain connecté, avec « Publicar » ; il écrirait en base, donc demandera le feu vert de Romain et se branchera sur le Laboratòri.

## Contraintes à respecter par les pistes

- Logo : couleurs des recettes de Romain (`--logo-*`) ; sur fond clair, ocre et brique, jamais de brun.
- WCAG 2.2 AA dans les deux thèmes, jamais la couleur comme seul signal.
- Sobre, pas kitsch ; filets fins ; pas de fondu entre couleurs éloignées.
