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
- Reste 5 communes à deux formes de l'API : Castelculier, Labastide-Castel-Amouroux, Laussou, Madaillan, Monteton. Et les 8 anciennes communes ignorées (Cransac-les-Thermes, Conques-en-Rouergue, Cap d'Astarac, Les Artigues-de-Lussac, Pern-Lhospitalet, Sousceyrac-en-Quercy, Montgaillard-en-Albret, Ance Féas) : chercher par nom, pas par code.
- Build non lancé (worktree sans dépendances) : seuls des textes JSON ont changé, JSON contrôlés valides.
