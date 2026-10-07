# Calandretas absentes de l'Annuaire de l'éducation

Relevé du 2026-10-07. La couche `app/static/data/calandretas.geojson` contient les
58 établissements de l'Annuaire de l'éducation (53 écoles, 4 collèges, 1 lycée).
La Confederacion Calandreta annonce 62 écoles : il en manque 9, listées ici pour plus tard.

Elles n'ont pas de code UAI dans l'annuaire (recherche par nom et par commune).
Hypothèses, non vérifiées : écoles récentes, ou deuxièmes sites rattachés au code
d'une autre école de la même ville (à Carcassonne, l'OPLO donne la même adresse
électronique « carcassona-ciutat » pour Barbacana et pour l'école 0111001D).

| Nom (graphie de la source) | Commune | Vue sur |
|---|---|---|
| Calandreta Candòla | Montpellier (34) | carte Confederacion, carte OPLO, OSM (chemin 715180313) |
| Calandreta de Barbacana | Carcassonne (11) | carte Confederacion, carte OPLO, OSM (chemin 175404112, « Calandreta de Carcassona - Barbacane ») |
| Calandreta dels Petaçons | Cournonterral (34) | carte Confederacion, carte OPLO, OSM (point 9278061633) |
| Calandreta Falabreguièrs | Béziers (34) | carte Confederacion, carte OPLO |
| Calandreta lo Garric | Béziers (34) | carte Confederacion, carte OPLO |
| Calandreta Jaquetona | Narbonne (11) | carte Confederacion, carte OPLO |
| Calandreta La Rosèla | Villedubert (11) | carte Confederacion, carte OPLO |
| Calandreta Drin a drin | Espoey (64) | carte Confederacion, carte OPLO, OSM (chemin 1036953585) |
| Calandreta l'Esquiròl | Saint-Céré (46) | carte OPLO, OSM (chemin 1482578713, code UAI 0460731V absent de l'annuaire) ; pas sur la carte de la Confederacion |

Sources consultées :

- carte de la Confederacion : uMap « Escòlas Calandretas » n° 401511 (calque des écoles),
  copie brute dans `SIG/brut/calandretas/umap-confederacion-escolas.geojson`.
  Pas de licence, reproduction interdite par les mentions légales du site : sert de référence seulement ;
- carte OPLO : uMap « Ensenhament 24-25 » n° 1158538, calque Calandreta (pas de licence,
  clause non commerciale), copie brute dans `SIG/brut/calandretas/umap-oplo-calandreta.geojson` ;
- OSM : requête Overpass du 2026-10-07 (ODbL), copie brute dans `SIG/brut/calandretas/osm-calandretas.json`.

Pour les ajouter plus tard, deux chemins :

1. avec l'accord de la Confederacion : reprendre nom et adresse, géocoder l'adresse avec
   `https://data.geopf.fr/geocodage/search?q=<adresse>&limit=1`, marquer « à vérifier » ;
2. sans attendre : prendre nom et position dans OSM pour les 5 écoles qui y sont
   (Candòla, Barbacana, Petaçons, Drin a drin, Esquiròl), et publier alors la couche sous ODbL.

Dans les deux cas, ajouter un champ qui distingue ces écoles (pas de code UAI) et vérifier
chaque année si l'annuaire leur a donné un code : le script `SIG/cadena/calandretas.mjs`
signale tout nouvel établissement privé dont le nom contient calandreta, calendreta ou calentreta.
