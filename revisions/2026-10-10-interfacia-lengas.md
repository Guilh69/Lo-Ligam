# Chantier : interface « Langues de France » et catalogue de la carte

Demandes de Romain du 2026-10-10 (dictées), à mener dans une conversation neuve, sans agents. Estimation : 2 à 3 séances.

## Principes

- **Priorité au visiteur occitan** : l'interface par défaut, c'est l'occitan et ses données (Culture, Administration, Histoire, Nature). Les autres langues sont nettement à part.
- **Se caler sur la donnée** : allumer une donnée amène la vue sur toute son étendue (le breton → la Bretagne, le corse → la Corse, les provinces historiques → l'ensemble des provinces). Aujourd'hui, `PLAJAS` ne change que l'échelle.

## Ce qu'il faut construire

1. **Icône « Autres langues »** à remplacer : l'actuelle mêle un alphabet non latin, sans rapport avec le sujet.
2. **Un vrai mode « Langues de France »** : cliquer sur « Autres langues » fait entrer dans une autre interface (rail et panneau propres), avec un retour à l'occitan.
   - **L'occitan y reste affiché, à égalité avec les autres langues** (choix de Romain) ; ses données (culture, histoire…) disparaissent tant qu'on est dans ce mode.
   - On y choisit des **données propres aux langues** : écoles bilingues en breton, écoles en corse ; d'autres données par région viendront au fil du temps.
3. **Plus d'onglets France / Transfrontalières** (trois langues d'un côté, six de l'autre : ce n'est pas ce qu'on veut montrer).
   - On choisit une langue : la carte montre **d'abord sa partie française** (les zones « à part » existent déjà : Catalogne Nord, Alsace, Moselle, Flandre de France, Corse…).
   - Puis une proposition « **Voir la langue dans son environnement linguistique** » : un clic déclenche tout le groupe linguistique, de part et d'autre de la frontière.

## Données déjà prêtes pour ce mode

- `SIG/breton/breton-actual.csv` : écoles bilingues par commune (Office public de la langue bretonne, rentrée 2025, ODbL), 215 communes, dont 53 hors du domaine de 1886 (Rennes 1 012 élèves, Nantes 533).
- `SIG/breton/breton-istoric.csv` : limites historiques du breton (9ᵉ siècle à 1806, carte de Sémhur, CC BY-SA 4.0). Dessin retenu (option A) : traits fins datés sur le gallo.
- `SIG/cadena/breton-istoric.py` : script écrit, **pas encore lancé** (Romain a interrompu : à décider si ces deux données vont dans la couche bretonne ou dans les données du mode).
- Écoles en corse : source à chercher.

## Suite (2026-10-10)

- Plan en 4 étapes : entrée dans le mode, liste unique, « Voir la langue dans son environnement linguistique », rubrique Données. Romain a choisi **une maquette d'essai d'abord** pour l'étape 1.
- **En pause** : Romain veut d'abord monter en gamme le rail et le catalogue de données (références de sites haut de gamme, puis choix d'une direction). La maquette du mode viendra ensuite, dans la direction retenue.
- Mots de la maquette vérifiés (lo Congrès) : lenga, tornar, escòla, bilingüe, limit, istoric, veire, dins, lingüistic (environament), causir, vesin, frontièra, locutor, grèu, dangièr. Non confirmés par l'API : França (absent des toponymes), donadas (seulement participe), celtic, germanic, alsacian, francic, arpitan.

- **Reprise (2026-10-10, après le chantier rail et légende)** : entrée dans le mode choisie par Romain, **option A, le rail se transforme**.
- ✅ **Étapes 1 et 2 faites (2026-10-10)** dans `RailJaces.svelte` : « Autras lengas » fait entrer dans le mode ; l'état de la carte occitane est mis de côté, les familles Cultura et Istòria s'effacent ; rail du mode = « ‹ Occitan » (retour, restaure la carte comme avant), « Sus la carta », « Lengas » ; panneau « Lengas de França » sans onglets, toutes les langues dans une liste (A→Z sur le nom occitan, ou par locuteurs), l'occitan dedans avec ses dialectes (ligne simple : pas encore de fiche sourcée). Même chose sur téléphone (barre du bas).
- **Reste** : étape 3 (« Voir la langue dans son environnement linguistique ») ; étape 4 (« Donadas » : écoles bilingues et limites historiques du breton, puis écoles en corse) ; une fiche sourcée pour l'occitan (locuteurs, statut UNESCO, sources) ; mots occitans à trancher : « França » (absent de l'API toponymique), « Donadas » (l'API ne connaît que le participe).

- ✅ **Icônes des langues** (2026-10-10) : dans la silhouette, la partie française en plein, le reste en clair (contour de la France : régions IGN, `SIG/cadena/lengas-vesinas.mjs`).
- **Étape 3, idée de Romain (2026-10-10)** : une langue allumée ne montre d'abord que sa partie française ; survoler la partie claire de son icône affiche « Voir la langue dans son environnement linguistique », un clic allume le reste sur la carte ; la liste des dialectes se range en trois groupes : **en France**, **transfrontaliers**, **hors de France**.

- ✅ **Étape 3, première moitié (2026-10-10)** : dans le mode, chaque langue (occitan compris) ne montre que sa partie française : couche découpée au contour de la France (`app/static/data/franca.json`, fabriqué par `SIG/cadena/franca-contorn.py`, chargé seulement dans le mode), villes d'au-delà masquées (choix A de Romain), survol et clic hors de France ignorés. L'icône d'une langue qui déborde est un bouton « Veire la lenga dins son environament lingüistic » / « Sonque la part francesa ». Vérifié avec le catalan (Roussillon seul, puis tout le domaine). « francesa » validé par Romain.
- ✅ **Suite (2026-10-10)** : descriptions des fiches centrées sur la partie française (à valider : « germanofòna », « continuum ») ; « Veire las lengas » pour l'oïl ; bouton seulement pour les langues qui débordent vraiment (surface hors de France > 1 %, calculée par `franca-contorn.py` ; le breton n'en a pas) ; la carte vole sur les langues qu'on vient d'activer (un seul vol pour plusieurs, ~50 km au plus près) ; « Descobrir la rèsta del catalan » au survol de la partie étrangère ; feu d'artifice quand le reste apparaît (occitan compris), fondu de 0,6 s quand il disparaît.
- ✅ **Bugs corrigés (2026-10-10)** : frontière de la France tracée d'après l'IGN (`SIG/cadena/mond.mjs`, plus Natural Earth le long de la France) ; picard : le rouchi sélectionné n'envahit plus le ch'ti. Le ch'ti en deux morceaux (artésien urbain, douaisien) est fidèle à la carte Wikipédia ; décalage d'environ 7 km dû au calage.
- **À faire plus tard** : frontières précises entre pays voisins (Belgique-Allemagne…), qui demandent de télécharger Natural Earth au 1:10 M (accord de Romain nécessaire).
- **Reste de l'étape 3** : ranger les dialectes en trois groupes (en France, transfrontaliers, hors de France).
- **Idée pour plus tard (Romain, 2026-10-10)** : la galerie des silhouettes des langues, grandes, avec seulement leur nom (partie française pleine, reste clair) ; pour une future encyclopédie ou un wiki, ou en ouverture du mode.

## Questions encore ouvertes (une à la fois)

1. ✅ Icône « Autres langues » : **deux bulles de discussion**, une pleine et une au trait (Romain, 2026-10-10, d'après son modèle ; en place dans `RailJaces.svelte`).
2. ✅ Limites historiques du breton : **donnée à part du mode**, rubrique « Données » à côté des écoles bilingues ; l'allumer cale la vue sur la Bretagne (Romain, 2026-10-10).
3. ✅ Onglets Europe et Monde : **retirés**. Le mode est une seule liste « Langues de France », sans onglets ; Europe et Monde reviendront plus tard avec leur propre entrée, quand il y aura des données (Romain, 2026-10-10).
