# Chaîne de fabrication des données de la carte

Ces scripts fabriquent les fichiers de `app/static/data/` utilisés par la carte :
`limits-carta.json` (domaine de la langue, frontière, régions, départements,
Val d'Aran, vallées d'Italie), `dialectes.geojson`, `creissent.geojson`,
`zonas-mixtas.geojson`, `transicions.geojson`, et le dialecte de chaque ville
dans `app/src/lib/acuelh/carta-estelas.js`.

Ils ont été écrits le 2026-10-07 dans un dossier de travail temporaire, puis
copiés ici tels quels : **les chemins écrits en dur dans les scripts pointent
encore vers ce dossier temporaire** (`…/scratchpad/occitanica`, `…/limits`,
`…/osm`). Pour refaire les données, recréer ces trois dossiers à partir d'ici
ou corriger les chemins.

## Outils

- Node (déjà là pour le site) ; `sharp` est pris dans `app/node_modules`.
- QGIS 4.2.3 pour Python et GDAL : `C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat script.py`.

## Entrées qui ne sont pas ici

- La carte Occitanica : `Modules_cors/Base_donnees_linguistica/Carta_occitanica.jpg`
  (« Carte linguistique de l'Occitanie », CIRDÒC, fiche 21242, Licence Ouverte).
  `treball.png` en est la version de travail (4000 px de large).
- La côte Natural Earth (`ne/costa.geojson`), tirée de `carta-estelas.js` (COSTA).
- Les communes d'Italie (`comunas-it.json`, 8 Mo, OpenStreetMap ODbL), à
  retélécharger avec l'API Overpass :
  `[out:json];rel["boundary"="administrative"]["admin_level"="8"]["ref:ISTAT"](44.0,6.6,45.25,7.8);out geom;`
- Le Val d'Aran (`aran.geojson`, gardé ici) vient de
  `https://polygons.openstreetmap.fr/get_geojson.py?id=2810776&params=0`.
- Les corrections et les bandes de transition : `SIG/Dialecte/transicions-dialectes.json`.

## Ordre

1. Calage de la carte Occitanica : `pastilhas.cjs` (points des villes), `calatge.cjs`
   (calage polynomial en Lambert-93, écrit `transfo.json`).
2. Masque du domaine : `masca.cjs`, puis `vectorizar.py masca.png domeni-occitanica.geojson`.
3. Zones de dialectes en pixels : `dialectes.cjs` (écrit `dial-1.png` à `dial-7.png`).
4. Vallées d'Italie : `valadas.py` (écrit `valadas.json` et `valadas.geojson`).
5. Croissant : `creissent.py` (à partir de `creissent-nostre.json`, relevé d'après
   Tourtoulon et Bringuier 1876 et Ronjat 1930).
6. Domaine : `fusion.py` (Occitanica + Isère, moins Petite Gavacherie et Blayais,
   limité à la France, plus Aran et vallées, aligné sur le Croissant).
7. Frontière et anneaux : `node domeni.mjs 2 domeni-occitanica.geojson domeni-occitanica-costa.geojson "<source>"`,
   puis `costa-domeni.py` (découpe par la vraie côte, Monaco exclu), puis de nouveau `domeni.mjs`.
8. Dialectes : `dialectes-vector.py` (corrections de Mende et de la recherche,
   Rhône pour l'auvergnat), copier `dialectes-occitanica.geojson` vers `app/static/data/dialectes.geojson`.
9. Dialecte des villes : `node luocs-dial.mjs escriure`.
10. Territoires hors de France au survol : `node territoris-extra.mjs` ; noms des vallées : `noms-valadas.mjs`.
11. Zones mixtes et gascon éteint : `mixtas.py` ; bandes de transition : `transicions.py`.

## Contrôles

Après chaque passage, vérifier les villes témoins (voir l'historique Git du
2026-10-07 : 48 villes pour la frontière, 34 pour les dialectes) et regarder
la carte à l'écran.
