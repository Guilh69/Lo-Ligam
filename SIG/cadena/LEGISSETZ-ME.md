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

Les fichiers de travail de la chaîne sont dans `SIG/brut/cadena-entradas/`
(hors Git, rangés le 2026-10-09 depuis un ancien dossier temporaire) :
`limits/` (domaine), `ne/` (côte Natural Earth), `occitanica/` (dialectes en
pixels et vectorisés), `osm/` (communes d'Italie, vallées, Aran). Les scripts
y accèdent par un chemin relatif.

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
    Puis `node SIG/cadena/mentonasc.mjs` (après `mixtas.py`) : le pays mentonnais (Menton,
    Roquebrune, Gorbio, Sainte-Agnès) en zone de transition entre l'occitan alpin et le
    ligure intémélien (Romain, 2026-10-12). À relancer ensuite : `lisn-enquistas.mjs`.
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
| Communes de deux langues | `node SIG/cadena/comunas-mixtas.mjs` (relancé à la fin de `comunas.mjs` et `comunas-lengas.mjs`) : jointure du point de chaque commune avec les zones de transition des langues (`<lenga>.json`, `transicio`, `entre`) | propriété `lg` dans `app/static/data/comunas/*.json` (fiche de la commune : Bayonne en basque, occitan et français) |
| Calandretas | `node SIG/cadena/calandretas.mjs` (annuaire de l'éducation, plus les écoles sans code de `SIG/calandretas/escolas-sens-uai.csv`) | `app/static/data/calandretas.geojson` ; état : `SIG/calandretas/etat-2026-10.md` |
| Provinces de 1789 | `python-qgis.bat SIG/cadena/provincias.py` | `app/static/data/provincias-1789.json` ; table : `SIG/provincias/taula-bailliages.csv` |
| Pays traditionnels (juridictions de 1789) | `python-qgis.bat SIG/cadena/paises.py` (se sert de `provincias.py` ; noms occitans pris dans sa propre table, `noms-oc-jaces.mjs` n'y touche pas) | `app/static/data/paises-1789.json` ; table : `SIG/paises/taula-paises.csv` ; sources et doutes : `SIG/paises/FONTS.md` |
| Parcs | `node SIG/cadena/parcs.mjs` (appelle `parcs.py`) | `app/static/data/parcs.json` |
| Massifs et sommets | `node SIG/cadena/releu-noms.mjs` | `app/static/data/releu-noms.json` |
| Noms occitans (provinces, parcs) | `node SIG/cadena/noms-oc-jaces.mjs`, à relancer après une correction des tables `SIG/provincias/noms-oc.csv` et `SIG/natura/noms-parcs-oc.csv` | les deux fichiers ci-dessus |
| Sons de la carte | `node SIG/cadena/sons-copar.mjs entree.mp3 sortie.mp3 debut fin` (découpe sans réencoder) | `app/static/sons/`, crédits dans `FONTS.md` |
| Enquêtes vocales de l'Atlas sonore (LISN, CC BY-NC-SA), **démonstrateur** | `node SIG/cadena/lisn-enquistas.mjs` (points de l'Atlas rangés dans nos dialectes ; les sons restent sur le site de l'Atlas ; repère aussi trois mots de la fable, corrections dans `SIG/lisn/mots-corregits.csv`) | `app/static/data/enquistas-lisn.json` ; à relire : `SIG/lisn/mots-a-validar.csv` |

Après une nouvelle fabrication des provinces ou des parcs, relancer
`noms-oc-jaces.mjs` (les scripts réécrivent les noms occitans de la source).

## Arpitan (2026-10-09)

Sources, règles et points à valider : `SIG/arpitan/FONTS.md`. Dans l'ordre :

1. `node SIG/cadena/arpitan-brut.mjs` : contours bruts (France IGN, Suisse et Italie OSM) dans `SIG/brut/arpitan/`.
1 bis. `python-qgis.bat -s -P SIG/cadena/raccord-arpitan.py` (une fois le classement fait, étape 4, puis relancer 2 à 6) : le domaine occitan au contact de l'arpitan suit les communes, comme le Fenouillèdes : les communes occitanes voisines (bande hachurée, Puy-de-Dôme, Hautes-Alpes, Montagne bourbonnaise) y entrent entières, les communes arpitanes en sortent (simplification 300 m). Réécrit `limits-carta.json` et `dialectes.geojson` ; à lancer sur les fichiers d'avant (`git checkout`), pas deux fois de suite.
2. `node SIG/cadena/arpitan-carta.cjs` : calage de la carte arpitania.eu (`SIG/arpitan/gcp-arpitania.csv`), masque, part de chaque commune dans la carte et dans le domaine occitan (`SIG/brut/arpitan/parts-comunas.json`).
3. `python-qgis.bat -s -P SIG/cadena/arpitan-bailliages.py` : bailliage de 1789 et arrondissement de chaque commune française.
4. `node SIG/cadena/arpitan-classament.mjs` : domaine, dialecte et parler de chaque commune (`SIG/arpitan/dialectes-arpitan.csv`). La liste OFS (`ofs-regions-linguisticas.csv`) et celle de la loi 482 (`piemont-482.pdf`) sont dans `SIG/arpitan/` ; les communes piémontaises sont écrites dans le script.
5. `python-qgis.bat -s -P SIG/cadena/arpitan.py` : `app/static/data/arpitan.json` (1 min 40).
6. `node SIG/cadena/arpitan-app.mjs` : ajoute les villes.
7. `python-qgis.bat -s -P SIG/cadena/apart-frontiera.py` : les zones à part (Catalunya Nord, Arpitania de France) suivent exactement la frontière nationale des départements de la carte. À relancer aussi après `catalan.py`.

Principe (Romain, 2026-10-09) : ce n'est pas une science exacte. Entre deux données, on se cale sur la plus sûre (une limite bien délimitée : frontière d'État, communes) ; à précision égale, les géométries se recouvrent plutôt que de laisser un vide ; de près, la carte montre le mélange (fondu, hachures), pas une coupure.

Après une retouche du domaine occitan (`limits-carta.json`), relancer à partir de l'étape 2.

## Basque (2026-10-09)

Sources, règles et points à valider : `SIG/basc/FONTS.md`. Dans l'ordre :

1. `node SIG/cadena/basc-brut.mjs` : communes du 64 (IGN) et d'Espagne (Euskadi, Navarre, Treviño : OSM) dans `SIG/brut/basc/`. Les listes sources (agglomération, loi navarraise, comarques) sont dans `SIG/basc/fonts/`.
2. `python-qgis.bat -s -P SIG/cadena/basc-comunas-fr.py` : bailliage de 1789 et part occitane de chaque commune du 64.
3. `node SIG/cadena/basc-classament.mjs` : domaine, dialecte et parler de chaque commune (`SIG/basc/dialectes-basc.csv`).
4. `python-qgis.bat -s -P SIG/cadena/raccord-basc.py` (après `raccord-arpitan.py`, une seule fois, sur les fichiers d'avant) : le domaine occitan suit les communes au contact du basque. Réécrit `limits-carta.json` et `dialectes.geojson`. Puis relancer `costa-ref.py`.
4 bis. `python-qgis.bat -s -P SIG/cadena/basc-mixtas.py` (se relance sans risque) : les trois zones mixtes occitanes de tradition gasconne (Bayonne, Bidache et l'Adour, Esquiule et Lichos), leurs encadrés au survol et leurs bandes de couleur gasconne, d'après `SIG/basc/dialectes-basc.json`.
5. `python-qgis.bat -s -P SIG/cadena/basc.py` : `app/static/data/basc.json` (50 s).
6. `node SIG/cadena/basc-vilas.mjs` puis `node SIG/cadena/basc-app.mjs` : les villes (rangs éclaircis). Sur la carte en étoiles, une ville occitane au même endroit qu'une ville basque s'efface tant que le basque est allumé.
6 bis. Côte du Pays basque espagnol : contour OSM d'Euskadi et de Navarre ajouté à `PRECIS` dans `mar.py` ; relancer `mar.py`, `costa-estelas.py` (`costa.json`) puis `costa-ref.py`.
7. `node SIG/cadena/lengas-vesinas.mjs` : contours de « Découvrir le basque ».

## Langues d'oïl (2026-10-10)

Une famille de 9 langues (liste Cerquiglini) et les parlers du Centre et de l'Ouest (cahier §11 du 2026-10-09). Sources et regroupement : `SIG/oil/FONTS.md`, `SIG/oil/lengas-oil.json` (noms, groupes, couleurs). À relancer **après** l'occitan et l'arpitan : leur frontière est reprise point par point.

1. Données brutes : la couche des cantons de la carte linguistique des Archives nationales, extraite de leur carte en ligne (`layers/Cantons0.js`, voir FONTS.md) dans `SIG/brut/oil/an-cantons-2013.geojson`.
2. `python-qgis.bat -s -P SIG/cadena/oil.py` : `app/static/data/oil.json` (13 min 30, 195 Ko). Chaque commune IGN prend le parler du canton qui contient son point intérieur ; les terres que les Archives mettent en occitan ou en arpitan mais hors de nos domaines vont à la langue d'oïl voisine.
3. `node SIG/cadena/lengas-vesinas.mjs` : contours de « Découvrir les langues d'oïl ».

## Bord de mer et mer du satellite (2026-10-09)

Une seule référence terre / eau pour toute la carte : les communes de l'IGN (`SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg`), qui suivent la côte à quelques mètres (Hérault : 70 % du bord à moins de 10 m de la limite terre-mer Shom-IGN). Le bord de mer fabriqué à l'étape 7 (côte Natural Earth élargie de 1,5 km) est recalé dessus en fin de chaîne.

1. `python-qgis.bat SIG/cadena/costa-ref.py` (30 s), **à lancer en dernier**, après `apart-frontiera.py` : domaine occitan et catalan sans l'eau, terre côtière oubliée (lidos, ports, îles) rendue à la langue et au dialecte majoritaires de sa commune, extrémités des frontières menées au rivage. Les frontières terrestres et les sommets partagés ne bougent pas ; un second passage ne change rien (fichiers identiques).
2. `python-qgis.bat SIG/cadena/mar.py` : `app/static/data/mar.json`, la mer posée sur les photos aériennes au zoom proche (l'IGN y est blanc), en fondu de 500 m jusqu'à la côte. `mar.py` contient aussi la référence terre / eau (`tèrra_e_aiga`) dont se sert `costa-ref.py`.

3. `python-qgis.bat SIG/cadena/costa-estelas.py` : `app/static/data/costa.json`, le trait de côte « au crayon » de la carte en étoiles de /carta, recalé sur la même référence (simplifié à 100 m, 10 Ko compressés). La carte en étoiles de l'accueil garde `COSTA` (Natural Earth, dans `carta-estelas.js`) : à son échelle la différence ne se voit pas.
4. `node SIG/cadena/costa-osm.mjs` : la côte OpenStreetMap des pays voisins (dans `SIG/brut/costa-osm/`), à brancher dans `PRECIS` de `mar.py` une fois téléchargée.
5. `node SIG/cadena/lengas-vesinas.mjs` : `app/static/data/lengas-vesinas.json` (12 Ko), le contour simplifié des langues voisines (catalan, arpitan) pour l'invitation « Découvrir… » au survol ; à relancer quand un domaine change.

L'étang de Berre, le bassin d'Arcachon et l'estuaire de la Gironde sont hors communes : sans teinte, et pas peints par la mer (rectangles `DINS` de `mar.py`). Hors de France (Espagne, Italie, Monaco), faute de trait de côte précis, une marge de 2 km protège la terre : la mer et le recalage n'y touchent pas.

## Contrôles

Après chaque passage, vérifier les villes témoins (voir l'historique Git du
2026-10-07 : 48 villes pour la frontière, 34 pour les dialectes) et regarder
la carte à l'écran.
