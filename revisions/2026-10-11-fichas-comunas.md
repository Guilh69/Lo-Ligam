# Cadre : les fiches des communes de la carte (conversation neuve)

Préparé le 2026-10-11 à la fin de la conversation « carte, zoom et noms ». À lire en entier au début de la conversation « fiches », avant de toucher au code.

## 1. Où on en est, en deux phrases

Sur `/carta`, un clic sur le nom d'une commune la choisit : son contour se trace en doré, la carte vole vers elle sans bloquer le zoom, et une **fiche** s'ouvre en bas. La fiche arrive repliée (photo, noms, chiffres) et se déplie (texte de Wikipèdia, liens, crédits) ; elle est dans la langue du lieu, avec un choix pour lire en occitan ou en français.

Tout est en ligne sur `master` (site pas encore public). Dernier commit de la série : « Carta : la ficha d'una comuna dins la lenga del luòc ».

## 2. Ce que Romain a demandé (2026-10-11, dans l'ordre)

1. Cliquer sur un nom choisit la ville et y mène en douceur, à une échelle centrée sur elle.
2. Choisir la **surface** de la commune, pas seulement son nom.
3. Même chose dans **toutes les zones couvertes** (règle « même paquet », cahier §11).
4. Remplacer le petit rond qui scintillait (pas adapté aux noms longs) : le nom est maintenant dans un ovale doré.
5. Une fiche en bas : nom, silhouette, photo, population avec son année, superficie, quelques infos « génériques et curieuses », lien vers l'article entier de Wikipèdia.
6. Le choix d'une commune ne doit pas bloquer le zoom.
7. Le choix remplace l'ancien repère doré rond des villes à page (« Descobrir la vila » passe dans la fiche).
8. D'abord la partie haute, puis on déplie pour le texte et le lien, puis les crédits en plus petit.
9. Fiche par défaut **dans la langue du lieu** (Lyon en arpitan, Brest en breton), possibilité de passer en occitan ; nom local d'abord, puis occitan, puis français.
10. Bayonne : basque, occitan **et** français ; le choix de langue plus discret et plus clair (fait : petit bouton « Eu · Òc · Fr » avec l'icône des langues, sur le modèle du bouton Òc / Fr du site, à droite du texte ; les drapeaux restent une option si Romain préfère).
11. De près (10 à 5 km), plus d'aplat des dialectes ni de clic : le dialecte du centre de la carte s'écrit au-dessus de l'échelle (`majDialLuòc` dans `CartaOccitania.svelte`, `aTenchas` dans `escalas.js`).
12. Choix de la langue : après plusieurs essais (cadran, boussole, manège, roue, onglets), **les emblèmes seuls**, posés au-dessus du coin haut gauche de la fiche ; la langue choisie pilote toute la fiche ; changement par une **révélation** en cercle depuis l'emblème cliqué (transition de vue, `app/src/app.css`), clic sonore.
13. **Règle des langues** : langues du lieu (langue régionale, puis l'occitan dans son domaine), puis l'occitan, puis la langue du site ; seulement celles qui ont un article. Site en occitan : ville occitane = occitan seul ; autre langue régionale = elle, puis l'occitan. Autres langues du site à venir (anglais, espagnol, catalan, allemand, italien…) : `TÈXTES` et `LENGAS` dans `FichaComuna.svelte`, paramètre `s=` du serveur.

**Question ouverte (Romain hésite) : le site en français.**
- A. Langue du lieu d'abord, comme en occitan (Bayonne s'ouvre en basque, Montpelhièr en occitan ; le français est proposé). Ce qui distingue la carte de Google Maps ; cohérent avec les noms sur la carte, déjà dans la langue du lieu. *C'est le fonctionnement actuel.*
- B. Le français d'abord, l'occitan derrière (et la langue du lieu proposée).
- Recommandation de Claude : A, en retenant le choix du visiteur (s'il choisit le français une fois, les fiches suivantes s'ouvrent en français) ; à décider aussi : les noms sur la carte elle-même en interface française.

Pas encore fait dans la demande 5 : les « infos curieuses » (pour l'instant, seulement les premières phrases de l'article).

## 3. Comment ça marche

Parcours d'un clic : `nomsComunas.js` sait quel nom est sous la souris → `CartaOccitania.svelte` (`causirNomComuna`, `anarALaComuna`) met le nom en doré, cherche le contour (`contornComuna.js`), dessine la surface et vole → `FichaComuna.svelte` demande les données à notre serveur (`/api/comuna`), qui interroge Wikidata, Wikipèdia et Commons.

| Fichier | Rôle |
|---|---|
| `app/src/lib/components/FichaComuna.svelte` | la fiche : noms (local, oc, fr), photo ou silhouette, chiffres, « Legir mai » / « Plegar », choix de la langue du texte, liens, crédits |
| `app/src/routes/api/comuna/+server.js` | relais serveur : trouve l'élément Wikidata (code INSEE, sinon nom + position), population et année, km², altitude, gentilé, articles oc / fr / langue du lieu, photo et crédits ; texte coupé à 280 caractères, sans les prononciations |
| `app/src/routes/api/comuna/foto/+server.js` | relais des photos (seulement `upload.` et `thumb.wikimedia.org`), cache 30 jours |
| `app/src/lib/carta/contornComuna.js` | contour d'une commune à partir d'un point ; renvoie aussi sa **zone** (`30`, `arpitan-69`…), qui donne la langue du lieu |
| `app/src/lib/carta/nomsComunas.js` | moteur des noms (placement à chaque image, fondus) ; `a(p)` = nom sous un point ; `causir(c)` = ovale doré |
| `app/src/lib/components/CartaOccitania.svelte` | sélection, vol (laisse ~170 px pour la fiche), surface (calque `comunaCausida`), Échap pour fermer, clics ignorés sur les boutons et la fiche |
| `app/src/lib/carta/vilasFichas.js` | villes qui auront une page sur le site (Montpelhièr en prototype, `ligam: null` → « Descobrir la vila : lèu ») |
| `SIG/cadena/comunas-mixtas.mjs` | communes de deux langues : propriété `lg` d'après les zones de transition des langues (209 communes : Bayonne, Anglet, bande arpitan-occitan, breton-galo…) ; relancé à la fin de `comunas.mjs` et `comunas-lengas.mjs` |
| `app/static/data/comunas/` | contours par département (`index.json`) et par zone de langue (`index-lengas.json`), noms occitans (`noms.json`), noms dans les autres langues (`noms-lengas.json`) |

Langue du lieu : table `WIKIS` dans `FichaComuna.svelte` (catalan → ca, arpitan → frp, basque → eu, breton → br, alsacien → als, francique → lb/pfl/ksh/li, flamand → vls/nl, corse → co, oïl → pcd/wa/nrm). Quand il y a plusieurs Wikipèdias possibles, le serveur garde celle qui nomme la ville comme notre carte (Lile → picard). Dans le domaine occitan, la langue du lieu est l'occitan.

## 4. Données, droits, vie privée

- **Wikidata** (CC0) : chiffres, libre sans condition.
- **Wikipèdia** (CC BY-SA 4.0) : extrait court, cité, avec lien vers l'article et la licence dans les crédits.
- **Photos de Commons** : auteur et licence de chaque photo, avec lien vers sa page.
- Les requêtes passent par **notre serveur Scaleway** (Paris) : l'adresse IP des visiteurs ne va pas chez Wikimedia. Réponses gardées 1 jour en mémoire du serveur (perdues à chaque redémarrage) et 1 jour dans le navigateur.
- Ne pas confondre avec lo Congrès : ses réponses ne doivent **jamais** être stockées (CGU). Wikimedia, oui.

## 5. Règles à respecter

- Toujours en français avec Romain ; vérifier tout mot occitan avec `node scripts/verificar-oc.mjs` (dans `app/`).
- « Même paquet » : toute amélioration de la fiche vaut pour toutes les zones couvertes, pas seulement l'occitan.
- Noms dans le dialecte du lieu, graphie classique ; sans forme connue, on masque.
- « Clic ailleurs, jamais deux clics » ; ne jamais retirer une fonction ; sobre, pas kitsch.
- Avant d'annoncer : `npm run build` + capture d'écran. Tester dans un **onglet séparé** du navigateur intégré (l'onglet « seed » est celui de Romain) et le fermer après.
- Commit par petits lots, seulement ses fichiers, push sur `master`.

## 6. Limites connues

- Communes hors de France : pas de code INSEE, recherche par nom et position ; peu testé (Suisse, Italie, Belgique, Allemagne, Pays-Bas, Espagne).
- Noms occitans hors du domaine : ce sont les libellés oc de Wikidata (Lion, Brèst, Lilla, Estrasborg), **non vérifiés**. Masqués quand ils copient le français.
- Qualité des textes : on prend la première phrase de l'article telle quelle (celle de Montpellier en français est mal tournée sur Wikipédia même).
- Cache serveur en mémoire seulement : chaque redémarrage refait les requêtes.
- Mots de la fiche à faire valider par Romain : « Legir mai », « Plegar », « Descobrir la vila : lèu », « Abitants », « Chifras », « Lenga del tèxt », « Francés », « Picard », « Normand ». Confirmés par l'API (forme ou lemme) : fòto, tampar, descobrir, vila, lèu, desplegar, plegar, abitant, chifra, tèxt, lenga, occitan, valon, flamenc, neerlandés. Absents du dictionnaire de base : francés, picard, normand (à voir sur dicodòc).

## 7. Pistes pour la suite (à proposer une par une)

**Ce que Romain peut faire seul, maintenant**
1. Ouvrir quelques communes de chaque langue sur son écran (Liyon, Brest, Lile, Strosbùri, Baiona, Ajaccio, une commune suisse) et envoyer des captures de ce qui ne va pas.
2. Valider les mots de la section 6.
3. Choisir, parmi les pistes ci-dessous, les deux ou trois pour le lancement.

**Pistes qui demandent Claude** (lancement = sert les cours ; évolution = plus tard)
1. *Lancement* : ligne **Lenga** dans la fiche : le dialecte du lieu d'après nos couches (lengadocian, gascon…), ville de bordure à deux dialectes, zone mixte. Données déjà là. Une séance courte.
2. *Lancement* : ligne **Aprene** : la Calandreta la plus proche (déjà calculée par la carte) et les cours de Romain.
3. *Lancement* : les **infos curieuses** demandées : tirées de Wikidata (CC0), par exemple cours d'eau, villes jumelées, personnalités nées là, ancien nom. À choisir avec Romain : trois rubriques au plus, sobres.
4. *Lancement* : lien vers la **page de la ville** (lot 3 de `revisions/2026-10-10-concept-wiki.md`, gabarit « vila » en §2.3 et exemple Montpelhièr en §7.2) : Montpelhièr d'abord, textes de Romain.
5. *Évolution* : **adresse à partager** (`/carta?comuna=34172`) qui ouvre la carte sur la commune avec sa fiche (concept-wiki §2.6, « Fiche → carte »).
6. *Évolution* : **noms occitans hors du domaine** venant d'une source sûre (ou liste à valider par Romain) plutôt que de Wikidata.
7. *Évolution* : fiche sur **téléphone** (hauteur, geste pour déplier), clavier et lecteur d'écran (focus à l'ouverture, retour au nom à la fermeture).
8. *Évolution* : **cache durable** côté serveur (fichier), pour ne plus refaire les requêtes après un redémarrage.
9. *Évolution* : prononciation du nom (voix de Romain, plus tard ; pas de synthèse).

## 8. Comment tester vite

- Dans `app/`, serveur de développement « lo-ligam-app-dev » (http://localhost:5173/carta).
- Serveur seul : `curl "http://localhost:5173/api/comuna?i=69123&l=frp&nl=Liyon"` (Lyon), `?i=34172` (Montpelhièr), `?i=59350&l=pcd,wa,nrm&nl=Lile` (Lille).
- À l'écran : allumer la langue dans « Autras lengas », puis en console `__carta.map.setView([45.7579, 4.8305], 10.5)`, cliquer sur le nom, « Legir mai ».

## 9. Message à coller pour démarrer la conversation

> On travaille sur les fiches des communes de la carte. Lis d'abord `revisions/2026-10-11-fichas-comunas.md` (le cadre), puis `PILOTATGE.md` et `revisions/2026-10-10-concept-wiki.md` §2.3 et §7.2. Fais `git pull`. Ensuite propose-moi les pistes de la section 7 une par une, en commençant par celles du lancement, sans rien coder avant mon choix.
