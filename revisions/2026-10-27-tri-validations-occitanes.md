# Tri de la pile de validations occitanes (2026-10-27)

Décisions de Romain (questions à boutons, séance « 5 % de crédit »). Rien n'est encore appliqué aux fichiers de données : à faire à la séance suivante.

## Décisions
1. **Communes couvertes par top'Òc** (API lo Congrès, 12 départements : 09, 12, 31, 32, 33, 40, 46, 47, 64, 65, 81, 82) : la forme de lo Congrès prime sur OSM et BDTOPOC. Environ 270 des 311 communes concernées ont une réponse (appel par code INSEE : `node scripts/verificar-oc.mjs --topo 12218 ...`). Les accents graves sont à rétablir et à contrôler avant d'écrire.
2. **Pays** (`SIG/mond/noms-a-validar.csv`) : 42 sur 56 confirmés par l'API, inchangés. Six divergences, **la forme de l'API gagne** : Belgica (et non Bèlgica), Eslovenia, Azerbaijan, San Marino, Monegue, Bòsnia e Hercegovina. Huit absents de l'API (Tchéquie, Estonie, Finlande, Macédoine du Nord, Kosovo, Libye, Serbie, Monténégro) : formes proposées par Claude conservées, à contrôler par Wikidata.
3. **Communes hors zone de l'API** (604) : garder le choix déjà fait (colonne `retengut`), comparer avec Wikidata, ne montrer à Romain que les cas où OSM, BDTOPOC et Wikidata se contredisent.

## Reste à faire
- Appliquer 1 et 2 aux fichiers (`SIG/comunas`, `SIG/mond`) puis régénérer ce qui en dépend.
- Comparer avec Wikidata (point 3), puis questions à boutons pour les contradictions.
- Parcs, reliefs, provinces, surnoms, sous-dialectes, Calandretas, mots LISN : pas de source dans l'API, passer par Wikidata puis questions à Romain.

## État en fin de séance (27-10)
- Fait et poussé : 242 communes top'Òc appliquées (nom français identique à la commune actuelle ; 8 anciennes communes fusionnées ignorées) ; 6 pays alignés sur l'API ; 21 communes du Lot-et-Garonne et du Médoc (forme soudée, puis 4 cas tranchés).
- Les 5 dernières communes à deux formes sont tranchées (Castèl Culhèr-Grand Fons, La Bastida-Veirias, Lo Laurés del Laussó, Fraishes de Madalhan, Monteton). Les 8 communes fusionnées n’ont pas d’entrée dans top’Òc : nom actuel conservé.
- Build non lancé (worktree sans dépendances) : seuls des textes JSON ont changé, JSON contrôlés valides.

## Point 2 : parcs et reliefs sans nom occitan (décision de Romain : ne pas chercher plus longtemps)
- Recherches faites le 27-10 : Wikipédia occitan et Wikidata n'ont rien pour Devès, Tanargue, Monts du Forez, ni pour les parcs (Vercors, Verdon, Calanques, etc.). Seuls « calanca », « massís », « pargue » sont confirmés par lo Basic ; « Calanco » est la graphie mistralienne, « calanca » la classique.
- Défaut retenu : ces noms restent **sans forme occitane, donc masqués** (règle « sans forme connue on masque »). Rien n'est inventé.
- Piste à garder, non appliquée : « Calancas » (massif) et « Parc nacional de las Calancas » (assemblage de Claude, à valider).
- À reprendre quand Romain a une source (dicodòc, locuteur de la zone).

## Communes hors zone top'Òc (604) : fait le 27-10
- 292 désaccords : choix déjà fait conservé (OSM). Wikidata n'apporte rien : environ 190 de ses « noms occitans » copient le français ; 87 cas où il diffère vraiment, non retenus.
- 312 sans nom : 150 reçoivent le libellé occitan de Wikidata (décision de Romain), **à valider** (surtout formes vivaro-alpines et provençales). 162 restent sans nom.
