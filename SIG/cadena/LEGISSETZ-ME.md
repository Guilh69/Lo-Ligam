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
   Puis `dialectes-traucs.py` : enlève les îlots et les trous de moins de 20 km²
   (erreurs de lecture de la carte : lettres ou symboles pris pour une couleur).
9. Dialecte des villes : `node luocs-dial.mjs escriure`.
10. Territoires hors de France au survol : `node territoris-extra.mjs` ; noms des vallées : `noms-valadas.mjs`.
11. Zones mixtes et gascon éteint : `mixtas.py` ; bandes de transition : `transicions.py`.
    Puis `node SIG/cadena/gavacharia.mjs` (après `domeni.mjs` et `mixtas.py`) : la Petite
    Gavacherie, îlot d'oïl éteint au XXe siècle, n'est plus un trou du domaine mais une
    zone particulière hachurée dans le gascon, expliquée au survol (Romain, 2026-10-08).
12. Frontière avec le catalan : `python-qgis.bat -s -P SIG/cadena/fenolhedes.py` (après
    `gavacharia.mjs`, avant `catalan.py`). Dans les Pyrénées-Orientales, le domaine et le
    languedocien suivent les communes IGN : le Fenouillèdes (28 communes occitanes, liste
    dans `SIG/catalan/dialectes-catalan.csv`) et la bande voisine de l'Aude et de l'Ariège y
    entrent, les communes catalanes en sortent. Les deux langues se touchent sans trou
    (Romain, 2026-10-08). Avec un dossier en argument, le script écrit un essai sans rien toucher.

## Couches de sources publiques (2026-10-07 et 08)

Ces scripts-là utilisent des chemins relatifs au dépôt. Les données brutes
téléchargées vont dans `SIG/brut/` (ignoré par Git, refait par les scripts).

| Couche | Commande | Sortie |
|---|---|---|
| Communes | `node SIG/cadena/comunas.mjs` (appelle `comunas.py` ; `--sens-noms-osm` si Overpass est saturé) | `app/static/data/comunas/<dep>.json` et `index.json` ; à valider : `SIG/comunas/noms-a-validar.csv` |
| Calandretas | `node SIG/cadena/calandretas.mjs` (annuaire de l'éducation) | `app/static/data/calandretas.geojson` ; manquantes : `SIG/calandretas/escolas-mancantas.md` |
| Provinces de 1789 | `python-qgis.bat SIG/cadena/provincias.py` | `app/static/data/provincias-1789.json` ; table : `SIG/provincias/taula-bailliages.csv` |
| Pays traditionnels (juridictions de 1789) | `python-qgis.bat SIG/cadena/paises.py` (se sert de `provincias.py` ; noms occitans pris dans sa propre table, `noms-oc-jaces.mjs` n'y touche pas) | `app/static/data/paises-1789.json` ; table : `SIG/paises/taula-paises.csv` ; sources et doutes : `SIG/paises/FONTS.md` |
| Parcs | `node SIG/cadena/parcs.mjs` (appelle `parcs.py`) | `app/static/data/parcs.json` |
| Massifs et sommets | `node SIG/cadena/releu-noms.mjs` | `app/static/data/releu-noms.json` |
| Noms occitans (provinces, parcs) | `node SIG/cadena/noms-oc-jaces.mjs`, à relancer après une correction des tables `SIG/provincias/noms-oc.csv` et `SIG/natura/noms-parcs-oc.csv` | les deux fichiers ci-dessus |
| Sons de la carte | `node SIG/cadena/sons-copar.mjs entree.mp3 sortie.mp3 debut fin` (découpe sans réencoder) | `app/static/sons/`, crédits dans `FONTS.md` |

Après une nouvelle fabrication des provinces ou des parcs, relancer
`noms-oc-jaces.mjs` (les scripts réécrivent les noms occitans de la source).

## Arpitan (2026-10-09)

Sources, règles et points à valider : `SIG/arpitan/FONTS.md`. Dans l'ordre :

1. `node SIG/cadena/arpitan-brut.mjs` : contours bruts (France IGN, Suisse et Italie OSM) dans `SIG/brut/arpitan/`.
2. `node SIG/cadena/arpitan-carta.cjs` : calage de la carte arpitania.eu (`SIG/arpitan/gcp-arpitania.csv`), masque, part de chaque commune dans la carte et dans le domaine occitan (`SIG/brut/arpitan/parts-comunas.json`).
3. `python-qgis.bat -s -P SIG/cadena/arpitan-bailliages.py` : bailliage de 1789 et arrondissement de chaque commune française.
4. `node SIG/cadena/arpitan-classament.mjs` : domaine, dialecte et parler de chaque commune (`SIG/arpitan/dialectes-arpitan.csv`). La liste OFS (`ofs-regions-linguisticas.csv`) et celle de la loi 482 (`piemont-482.pdf`) sont dans `SIG/arpitan/` ; les communes piémontaises sont écrites dans le script.
5. `python-qgis.bat -s -P SIG/cadena/arpitan.py` : `app/static/data/arpitan.json` (1 min 40).
6. `node SIG/cadena/arpitan-app.mjs` : ajoute les villes.

Après une retouche du domaine occitan (`limits-carta.json`), relancer à partir de l'étape 2.

## Contrôles

Après chaque passage, vérifier les villes témoins (voir l'historique Git du
2026-10-07 : 48 villes pour la frontière, 34 pour les dialectes) et regarder
la carte à l'écran.
