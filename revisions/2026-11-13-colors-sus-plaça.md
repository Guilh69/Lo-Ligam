# Colors : régler les couleurs du site depuis le site (2026-11-13)

Demande de Romain, le 13-11 : « Il faut que je puisse changer toutes les couleurs du site directement dans le site. »

## Ce que Romain voit

Connecté avec son compte administrateur, sa barre d'outils (Lo talhièr) a une entrée de plus, **Colors**. Elle ouvre un panneau sur le bord de l'écran ; la page se range à côté et reste utilisable (sur téléphone, le panneau monte du bas).

- **Trois façons de trouver une couleur** : les groupes (fond et texte, mise en valeur, boutons, la palette, la croix du logo, cases des rubriques, jeux, langues de l'en-tête, carte, leçons, pages anciennes), la recherche (un nom ou un code), et « Toucher un endroit de la page », qui dit quelles couleurs sont à cet endroit.
- **Changer** : le carré de couleur ouvre le sélecteur du navigateur ; on peut aussi taper le code. Le petit carré posé sur le grand est le texte de la pièce. Le contraste est affiché, en rouge s'il est trop faible.
- **Voir** : le changement s'applique aussitôt, pour lui seul. Il peut se promener sur le site panneau ouvert, changer de thème (Clair, Sombre), recharger la page : son brouillon le suit.
- **Publier** : « Publicar » rend ses choix publics (dans la minute). « Anullar » jette le brouillon. « Rétablir » remet une couleur à sa valeur d'origine.
- **Autres gestes** : recharger la page (si la carte ou un dessin n'a pas suivi), revenir avant la dernière publication, tout remettre aux couleurs d'origine.

## Comment ça marche

| Pièce | Fichier | Rôle |
|---|---|---|
| La palette | `app/src/lib/styles/palette.js` | Les valeurs d'origine (teintes, rôles). Les exports (`TEINTES`, `BOUTONS`, `CARTE`…) sont des vues vivantes : ils se lisent au moment de s'en servir. `fixarColors()` pose les surcharges, `quandCambia()` prévient les modules qui gardent des valeurs calculées. |
| Le registre | `app/src/lib/colors/registre.js` | La liste de toutes les couleurs réglables : identifiant, nom, groupe, valeur d'origine, variable CSS. `netejar()` ne laisse passer que des identifiants connus et des couleurs `#rrggbb`. `cssColors()` écrit la feuille des surcharges. |
| Le serveur | `app/src/lib/server/colors.js`, `app/src/hooks.server.js`, `app/src/app.html` | Lit le publié (au plus toutes les 20 s, filet de secours compris), le pose sur la palette du serveur et l'écrit dans chaque page : une balise `<style id="colors-publicadas">` et la liste `window.__loLigamColors`, avant le premier affichage. |
| Le signal | `app/src/lib/colors/senhal.svelte.js` | La seule part que tout visiteur charge : les pages se redessinent quand la palette change. |
| L'outil | `app/src/lib/colors/colors.svelte.js`, `ColorsPanel.svelte`, `app/src/lib/talhier/Talhier.svelte` | Brouillon, publication, retour en arrière ; le panneau. Chargés pour l'administrateur seulement. |

**Stockage.** Aucun changement de base. Les surcharges sont des éléments de la « page » `colors` de la table `pagina_elements` (celle de l'édition sur place) : clé `colors.<identifiant>`, la couleur dans la colonne `oc`. Brouillon (`estat = 'brolhon'`), publication par `publicar_pagina('colors')`, photographie d'avant dans `pagina_publicacions`, retour par `restaurar_publicacion`. Les politiques RLS existantes s'appliquent : seul l'administrateur écrit.

**Identifiants.** `teinte.or` (une teinte de la palette), `role.BOUTONS.agir`, `role.CARTE.dialectes.gas`, `role.CASES.0.0` (un rôle, par son chemin dans palette.js), `tema.clar.t-fons`, `tema.sorne.t-fons` (un jeton d'app.css, par thème), `comun.color-brick` (un jeton commun).

**Ordre des valeurs.** Une teinte changée entraîne tous les rôles qui s'en servent ; un rôle changé pour lui-même ne suit plus sa teinte. Les jetons d'app.css définis par `var()` (le terracotta du clair suit la brique) suivent leur source.

**Sélecteurs.** La feuille des surcharges utilise `html:root`, `html:root[data-tema='clar']`, `html:root:not([data-tema='clar'])` : elle l'emporte sur app.css et palette.css quel que soit l'ordre des feuilles. Les couleurs adaptées au daltonisme ne sont jamais écrasées (`:not([data-dalt='on'])` pour les jetons qu'elles redéfinissent).

**Brouillon dans l'onglet.** Tant que le panneau est ouvert avec des changements, la vue de Romain est gardée dans `sessionStorage` (`lo-ligam-colors-vista`, `-vista-css`, `-dubert`) : `app.html` la repose avant le démarrage, pour que même les modules qui recopient une couleur à leur évaluation (carte, dessins) la prennent après un rechargement.

## Ce qui a changé ailleurs

- `app.css` : le texte secondaire, les filets et le voile (`--t-tinta-2`, `--t-linha`, `--t-vel`) sont calculés depuis le texte et le fond (`color-mix`), mêmes rendus qu'avant ; ils suivent les couleurs choisies.
- Les modules qui recopiaient une couleur une fois pour toutes la lisent maintenant au moment de s'en servir : `lib/apren/teulas.js` (les camaïeux des sous-pages suivent leur teinte mère, avec le même écart de clarté, d'intensité et de teinte), `lib/cultura/index.js`, `lib/parcors/colors.js`, `lib/carta/lengas.js`, `lib/carta/colaDonadas.js`.

## Ce qui n'est pas réglable depuis le site (à faire entrer au besoin)

- Les **dessins** : scènes et affiches des jeux, pluie de mots, paysages, le fond animé de l'accueil (Venas d'aur).
- Sur la **carte** : les halos et les textes posés sur les aplats, les étoiles, quelques limites. Les aplats (occitan, dialectes, autres langues, enseignement) sont réglables ; la carte les prend au chargement de la page.
- Les **textes posés sur une photo** (crème ou blanc écrits dans la page).
- Les couleurs adaptées au **daltonisme** (Okabe-Ito) : volontairement fixes.
- Les pages d'**administration** et les pages d'essai (`/ensag`).

« Toucher un endroit de la page » le dit quand on tombe sur une couleur écrite en dur. Pour en faire entrer une : la remplacer dans la page par une variable, ajouter sa ligne dans `JETONS` (registre.js) et sa valeur d'origine dans app.css ; le test `registre.test.js` vérifie que les deux disent la même chose.

## Vérifié

- `npm run build` : passe. Tests : 36 fichiers, 1 082 tests, dont `lib/colors/registre.test.js` (valeurs d'origine identiques à app.css, rôles qui suivent leur teinte, refus des valeurs qui ne sont pas des couleurs, daltonisme préservé, camaïeux lisibles).
- La version construite (`node build`) sert l'accueil, S'apren et la carte ; la feuille et la liste y sont vides tant que rien n'est publié.
- Relecture de sécurité (agent Rodrigo, 13-11) : rien de bloquant. Deux durcissements appliqués : le registre n'a plus de noms hérités (« constructor » n'est pas un identifiant), et la feuille gardée dans l'onglet n'est reposée que si elle a exactement la forme que le site écrit. Non vérifié par lui : les politiques réellement actives en base (lues dans le dépôt seulement).
- En local, en simulation (`?edicion=simular`, rien n'est écrit dans la base) : changement en direct d'un bouton, d'une teinte, du fond et du texte ; brouillon retrouvé après rechargement ; publication simulée ; pipette ; clair, sombre, téléphone.
- Rendu serveur, avec des couleurs publiées simulées dans le filet : la feuille et la liste sont dans le HTML, les cases et le bouton de langue sont rendus avec les bonnes couleurs, une valeur malveillante est rejetée, la carte s'affiche.
- **Pas encore vérifié** : le vrai circuit avec la base (brouillon écrit, « Publicar », lecture par le public). Il ne peut l'être qu'avec le compte de Romain.

## Pour la suite

- Un sous-panneau « historique » (liste des publications, revenir à l'une d'elles) si le seul « revenir avant la dernière » ne suffit pas.
- Faire suivre la carte sans rechargement.
- Faire entrer dans le registre ce que Romain signale avec « Comentar ».
