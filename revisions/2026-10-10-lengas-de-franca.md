# Langues de France sur la carte : bilan de la nuit du 9 au 10 octobre 2026

Chantier mené en autonomie (Romain absent puis présent), avec des agents de recherche pour les données.

## Ce qui est en ligne

| Couche | Données | Source principale | Zone à part |
|---|---|---|---|
| Langues d'oïl | 9 langues + Centre et Ouest, commune par commune | Archives nationales (canton), liste Cerquiglini | (à faire : oïl de France) |
| Picard → ch'ti, rouchi | sous-dialectes, visibles quand le picard est choisi | carte des parlers de Wikipédia, calée (7 km) | |
| Wallon → liégeois, namurois, Ouest, Sud | Belgique romane | carte de L. Chapeau, contrôle Pierret (1984) | |
| Breton | 4 dialectes, Guérande éteint, bande mixte | Sébillot (1886), évêchés | |
| Alsacien | alémanique (Alsace, Bade, Suisse, Souabe) | Wenker, Constant This, cartes Commons | Alsace |
| Francique (platt) | mosellan, rhénan, méridional, luxembourgeois | idem + isoglosses de Moselle | Moselle germanophone |
| Flamand et néerlandais | Westhoek, Belgique, Pays-Bas, polders | Vanneste (1972), Daan et Blok (1969) | Flandre de France |
| Corse | 3 aires + gallurais, sassarais, Bonifacio | cartes Commons, lois sardes | Corse |

Chaîne commune : `SIG/cadena/lenga.py <lenga>` (réglages `SIG/<lenga>/carta.json`), `lenga-vilas.py`, `fichas-app.py` ; l'oïl : `oil.py`, `oil-vilas.py`, `picard-carta.py`, `gallo-noms.py`.

## Règles fixées (cahier §11)

- Hiérarchie : langue (ou famille) → dialectes → sous-dialectes seulement à la sélection.
- Jamais de trou ; une autre langue n'est pas un trou ; une terre sans dialecte est une zone pâle.
- Limites calées sur la côte précise ; zone française à part quand la langue déborde.
- Noms des villes et des langues dans la langue du lieu, attestés et sourcés.
- Chaque information du panneau avec sa source au survol.
- Validation de l'occitan par les API de lo Congrès (`verificar-oc.mjs`, `--fr`, `--topo` pour les noms de lieux).

## Corrections faites pendant le balayage

- Le francique ne s'affichait pas (sa clé de nom « de » se confondait avec celle des sous-dialectes) : corrigé, garde-fou dans `lenga.py`.
- Villes : à partir de 70 km, rang 2 à partir de 40 000 habitants (moins de villes moyennes), écart minimal entre grandes villes.
- Noms lointains des langues qui se chevauchaient : évitement automatique.
- Trait de côte précis étendu à toute la France.

## Propositions pour embellir le panneau « Autres langues »

1. **Fait** : silhouette de l'aire de chaque langue dans sa fiche, qui s'éclaire quand la langue est allumée.
2. **Survol croisé** : survoler une fiche fait briller l'aire de la langue sur la carte, et inversement.
3. **Barre de locuteurs** discrète sous le nom (échelle logarithmique), pour comparer d'un coup d'œil.
4. **État de la langue** en anneau de couleur autour de la silhouette plutôt qu'en texte.
5. **Ouverture en cascade** : à l'ouverture du panneau, les fiches arrivent une à une (comme les dialectes en feu d'artifice).
6. **Onglet Europe** : les langues voisines hors de France (italien et ses dialectes, castillan, aragonais, ligure…), avec la même fiche.

## Reste à faire

- **Alléger `oil.json` (422 Ko, 55 Ko compressé)** : les communes belges détaillées ne coïncident pas avec la frontière déjà simplifiée du flamand et créent 16 000 petits arcs ; simplifier les arcs de frontière n'y change rien (essayé, 424 Ko) : il faut caler les communes belges sur la frontière flamande avant le calcul.
- Frontières d'États précises (Natural Earth 1:50 M trop grossier de près).
- Fleuves au-delà de l'Occitanie (`RIUS` s'arrête à 47°).
- Zone « oïl de France » à part.
- Noms de villes : à valider (« Belgica » donné par top'Òc, « Bèlgica » sur la carte) ; Caen (Caën ou Kaem), Béthune (Bétunne ou Béthinne) à trancher.
- Noms occitans des dialectes : validation par l'API (la plupart sont des noms propres absents du Basic).
