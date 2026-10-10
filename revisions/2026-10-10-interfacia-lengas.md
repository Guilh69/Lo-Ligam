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

## Questions encore ouvertes (une à la fois)

1. ✅ Icône « Autres langues » : **deux bulles de discussion**, une pleine et une au trait (Romain, 2026-10-10, d'après son modèle ; en place dans `RailJaces.svelte`).
2. ✅ Limites historiques du breton : **donnée à part du mode**, rubrique « Données » à côté des écoles bilingues ; l'allumer cale la vue sur la Bretagne (Romain, 2026-10-10).
3. ✅ Onglets Europe et Monde : **retirés**. Le mode est une seule liste « Langues de France », sans onglets ; Europe et Monde reviendront plus tard avec leur propre entrée, quand il y aura des données (Romain, 2026-10-10).
