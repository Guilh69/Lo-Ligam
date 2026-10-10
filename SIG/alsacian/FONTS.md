# Alsacien et francique : domaine, dialectes, sources et incertitudes

Travail du 2026-10-10 (données seulement, rien dans `app/`), sur le modèle du basque et des langues d'oïl.
Tout est **à valider par Romain** : voir la dernière section.

## Fichiers

- `dialectes-alsacian.csv` : 6 613 lignes, séparateur `;`, sans guillemets (les notes multiples sont séparées par `|`). Une ligne par commune. Colonnes :
  - `regio` (France, Luxembourg, Belgique, Allemagne, Suisse) ; `unitat` (département, province, Land et Kreis, canton `CH-XX`) ; `mena` (`comuna_fr`, `comuna_de`, `gemeindefrei_de`, `comuna_ch`, `comuna_lu`, `comuna_be`) ;
  - `nom_oficial`, `nom_local` (voir `noms-locals.csv`) ;
  - `codi` : INSEE en France, `de:` + AGS (8 chiffres), `ch:` + numéro OFS, `lu:` + code LAU2, `be:` + code INS/NIS ;
  - `domeni` : `alemanic`, `francic`, `mixta` (commune partagée entre parler roman et parler germanique), `roman` (commune romane gardée pour tracer la limite), `vesina` (territoire sans commune, forêt, classé avec la carte), `incert` (aucune source) ;
  - `dialecte`, `parlar` (codes ci-dessous), `transicio` (autre(s) dialecte(s) présent(s) dans la commune selon une source), `part_oc` (toujours 0 : loin du domaine occitan), `nota`, `font` (codes de la table des sources).
- `dialectes-alsacian.json` : `font`, `a_validar`, `dialectes` (10 dialectes : `kod`, `endo`, `fr`, `oc`, `grope`, `parlars`, nombre de communes par pays), `apart` (Alsace et Moselle germanophone : 1 220 communes), `transicions` (21 groupes, avec la liste des communes).
- `noms-locals.csv` : 2 490 noms (`codi`, `nom_oficial`, `nom_local`, `lenga`, `dialecte`, `font`, `autras_formas`).
- Géométries (hors Git, `SIG/brut/alsacian/`) : `comunas-fr.geojson` (IGN, départements 54, 57, 67, 68, 88, 90), `de-comunas.geojson` (3 394), `ch-comunas.geojson` (1 435), `lu-comunas.geojson` (100), `be-comunas.geojson` (81). Toutes en WGS 84, 6 décimales, propriété `codi` préfixée comme dans le CSV.

## Codes des dialectes

| `dialecte` | français | occitan proposé | groupe | parlers (`parlar`) |
|---|---|---|---|---|
| `letzebuergesch` | luxembourgeois (francique luxembourgeois) | luxemborgés | francique | |
| `moselfrankisch` | francique mosellan | francic mosellan | francique | `nord` (op), `sud` (of) : Allemagne, Belgique |
| `rheinfrankisch` | francique rhénan | francic renan | francique | `lorrain`, `alsace_bossue` |
| `sudfrankisch` | francique méridional | francic meridional | francique | |
| `ripuarisch` | ripuaire | ripuari | francique | |
| `limburgisch` | francique rhéno-mosan, « plat » (limbourgeois, bas francique) | limborgés | francique | |
| `niederalemannisch` | bas-alémanique (alsacien) | bas alemanic (alsacian) | alémanique | `nord`, `sud`, `strasbourgeois` (France) ; `oberrhein`, `bodensee` (Bade) ; `basel` |
| `hochalemannisch` | haut-alémanique | naut alemanic | alémanique | |
| `hochstalemannisch` | alémanique supérieur (très haut alémanique) | alemanic superior | alémanique | |
| `schwabisch` | souabe | soabe | alémanique | |

## Répartition (communes)

| | France | Luxembourg | Belgique | Allemagne | Suisse |
|---|---|---|---|---|---|
| luxembourgeois | 83 (+1 mixte) | 100 | 4 (+3 mixtes) | | |
| francique mosellan | 70 | | 3 | 1 498 (nord 526, sud 972) | |
| francique rhénan | 276 (Lorraine 216, Alsace bossue 60) | | | 868 | |
| francique méridional | 35 | | | 145 | |
| ripuaire, rhéno-mosan | | | 3, 7 | | |
| bas-alémanique | 674 (nord 403 dont 13 en Moselle, sud 270, Strasbourg) | | | 193 (Rhin supérieur 136, lac de Constance 57) | 1 (Bâle) |
| haut-alémanique | 76 | | | 95 | 1 003 |
| alémanique supérieur | | | | | 194 |
| souabe | | | | 543 | |
| mixtes roman et germanique | 8 | | 3 | | 2 |
| romanes (limite) | 385 | | 59 | | 237 |
| sans source | | | | 52 | |

Moselle : 381 communes germaniques et 5 mixtes. Contrôle : Maurice Toussaint compte en 1945 « 370 germaniques et 30 bilingues » (Wikipédia fr « Lorraine germanophone ») ; la limite de 1887 donne 378 communes (même article).
Alsace : 46 communes romanes (Ban de la Roche, haute vallée de la Bruche, val de Villé en partie, val d'Orbey, val de Lièpvre, et 11 communes de parler franc-comtois près de Belfort et à Courtavon et Levoncourt).

## Sources (codes de la colonne `font`)

| code | source | licence | sert à |
|---|---|---|---|
| IGN | IGN, Admin Express COG Carto 2026, `SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg` (couches `commune`, `commune_associee_ou_deleguee`, `chef_lieu_de_commune`) | Licence Ouverte 2.0 | communes françaises, voisinages, anciennes communes |
| SEL | « Sprachen in Elsass-Lothringen » ([Commons](https://commons.wikimedia.org/wiki/File:Sprachen_in_Elsass-Lothringen.svg)), Furfur, 2023, **dessinée commune par commune** ; dérivée de « Alsace-Lorraine Dialectes-Fr.png » ([Commons](https://commons.wikimedia.org/wiki/File:Alsace-Lorraine_Dialectes-Fr.png), Rosss, 2010, domaine public), faite d'après les cartes historiques du Digitaler Wenker-Atlas (diwa.info, enquêtes Wenker, vers 1880) et la carte de Constant This (1886) | CC BY-SA 3.0 | **base en France** : limite romane et germanique et dialectes, commune par commune (état du XIXe siècle) |
| THIS | Constant This, *Die deutsch-französische Sprachgrenze in Lothringen*, Strasbourg, 1887, p. 23-24 (domaine public), listes de communes des deux côtés de la limite citées par la Wikipédia fr « Francique lorrain » (révision 230862562) | domaine public / texte CC BY-SA 4.0 | contrôle de la limite en Moselle ; communes traversées par la limite |
| GRZ | Wikipédia de « [Grenzorte des alemannischen Dialektraums](https://de.wikipedia.org/wiki/Grenzorte_des_alemannischen_Dialektraums) » (révision 271083426 du 2026-10-05) : communes limites de l'alémanique, en France, en Suisse et en Bade-Wurtemberg | CC BY-SA 4.0 | limite alémanique et francique au nord de l'Alsace et autour de Dabo ; limite alémanique et souabe face au francique en Bade-Wurtemberg ; contrôle de la limite romane en Alsace |
| WFL | Wikipédia fr « Francique lorrain » : lignes *op/of* (luxembourgeois et mosellan) et *wat/was* (mosellan et rhénan), communes de part et d'autre | CC BY-SA 4.0 | partage luxembourgeois et mosellan en Moselle |
| WALS | Wikipédia fr « Alsacien » (révision 239901825) : subdivisions de l'alsacien d'après Brunner, Bothorel-Witz et Philipp (*Encyclopédie de l'Alsace*), parler de Strasbourg, bâlois | CC BY-SA 4.0 | parlers nord, sud, strasbourgeois ; Bâle |
| RF | « Rheinischer Fächer » ([Commons](https://commons.wikimedia.org/wiki/File:Rheinischer_faecher.png)), Hans Erren, 2021, d'après Cornelissen et Beckers | CC BY-SA 3.0 | Sarre, Rhénanie-Palatinat, Belgique de l'Est ; contrôle en Moselle et au Luxembourg |
| ALM | « Alemannic-Dialects-Map-German.svg » ([Commons](https://commons.wikimedia.org/wiki/File:Alemannic-Dialects-Map-German.svg)), Pyrokrat, 2010, d'après Sémhur, faite d'après les articles de la Wikipédia de (« Alemannische Dialekte », « Grenzorte ») | CC BY-SA 3.0 | Bade-Wurtemberg, Suisse ; contrôle en Alsace |
| VG250 | BKG, VG250-EW (état au 31.12.2024), [téléchargement](https://daten.gdz.bkg.bund.de/produkte/vg/vg250-ew_ebenen_1231/aktuell/), couche `vg250_gem`, « © GeoBasis-DE / BKG (2026) » | dl-de/by-2-0 | communes allemandes, codes AGS, populations |
| OFS | Office fédéral de la statistique : limites généralisées 2025 ([page](https://www.bfs.admin.ch/asset/fr/ag-b-00.03-875-gg25), fichier `Lacs_G1`, 22 lacs de plus de 5 km²) ; régions linguistiques 2020 par commune, déjà dans `SIG/arpitan/ofs-regions-linguisticas.csv` (source dans `SIG/arpitan/FONTS.md`) | libre, source obligatoire | lacs retirés des communes ; langue (allemand, français) de chaque commune suisse |
| OSM | © contributeurs OpenStreetMap, API Overpass, 2026-10-10 (journal : `SIG/brut/alsacian/telecargaments.json`) | ODbL 1.0 | communes suisses (`swisstopo:BFS_NUMMER`), luxembourgeoises (`ref:lau2`, `name:lb`), belges (`ref:INS`) |
| LUX84 | Loi luxembourgeoise du 24 février 1984 sur le régime des langues (le luxembourgeois, langue nationale) | | tout le Luxembourg en luxembourgeois |
| PARL | Wikipédia fr « Pays d'Arlon » (révision 232525636) : communes et sections du Pays d'Arlon, noms luxembourgeois | CC BY-SA 4.0 | Arlon, Attert, Messancy, Martelange ; Aubange, Fauvillers, Habay en partie |
| OSTB | Wikipédia de « Ostbelgien » (révision 270140882), section Dialekte, d'après le Zentrum für Ostbelgische Geschichte (2019) : bas francique à Eupen et au nord, moyen francique à l'est et au sud, wallon à Malmedy et Waimes | CC BY-SA 4.0 | Communauté germanophone, communes « platdiets » |
| THIOIS | Wikipédia fr « Thiois » : francique rhéno-mosan (« plat ») des Fourons à Eupen par Plombières | CC BY-SA 4.0 | rhéno-mosan |
| BECONST | Constitution du canton de Berne (1993), art. 6 : français et allemand langues officielles dans l'arrondissement administratif de Biel/Bienne | | Biel/Bienne et Evilard mixtes |
| WD | Wikidata (SPARQL, 2026-10-10) : libellés `gsw` et `lb`, propriété P1705, titres des Wikipédias als, lb, pfl, ksh | CC0 | noms locaux |

Contrôle seulement (pas de reprise) :
- **Hudlett 2001** : Albert Hudlett, « Carte géolinguistique de l'Alsace », Atlas historique d'Alsace (CRESAT, Université de Haute-Alsace), notice CRDP d'Alsace 2010 ([PDF](https://archives.plarela.eu/www.crdp-strasbourg.fr/data/geographie/cartes/pdf/geolinguistique.pdf)), © CRDP. Fixe la nomenclature (francique luxembourgeois, mosellan, rhénan lorrain, rhénan méridional, bas-alémanique du Nord et du Sud, haut-alémanique, alémanique supérieur) et sert à trancher au nord de l'Alsace.
- **Archives nationales** (`SIG/brut/oil/an-cantons-2013.geojson`, zones 7.2 à 7.5, au canton) : 95 % des communes dans le même domaine (roman ou germanique) que notre classement ; les écarts viennent du canton (cantons « lorrains » avec des villages germaniques, et l'inverse). La carte AN range Bitche et Sarreguemines en « francique mosellan » et Wissembourg en bas-alémanique : trop grossier pour les dialectes.
- Téléchargées, non exploitées : carte de Maurice Toussaint 1955 (« Carte moselle germanophone 2.JPG », domaine public : utile pour contrôler la limite de 1945 en Moselle), « Les dialectes mosellans.jpg » (Peter Gabriel, CC BY 3.0), « Dialectes de Moselle (new).svg » (2026, CC BY-SA 4.0, aucune source citée : écartée), « Deutsche Mundarten », « Oberdeutsche Mundarten » (domaine public, trop grossières). Copies dans `SIG/brut/alsacian/fonts/` avec `commons.json` (auteur, date, licence).

## Méthode

Chaîne (scripts `SIG/cadena/alsacian-*`, dans cet ordre) : `alsacian-wiki.mjs` et `alsacian-commons.mjs` (sources), `alsacian-grenzorte.mjs` (tables des Grenzorte en CSV), `alsacian-comunas-fr.py`, `alsacian-svg.py`, `alsacian-control.mjs`, `alsacian-fr.mjs`, `alsacian-brut.mjs` (Overpass), `alsacian-geo.py`, `alsacian-alem-svg.mjs` puis `alsacian-svg-png.py` (rasterisation), `alsacian-calatge.py rf` et `alem`, `alsacian-noms.mjs` (Wikidata), `alsacian-classament.mjs` (sorties). Contrôles : `alsacian-an.py`, `alsacian-apercu.py` (aperçu de contrôle, une couleur par dialecte, hachures = transition : `SIG/brut/alsacian/apercu-classament.png`). Les rasters de la carte ALM (`alem-zonas.png`, `alem-limits.png`) sont gardés dans `SIG/brut/alsacian/` pour relancer le calage. Outils : `alsacian-zoom.py`, `alsacian-colors.py`, `alsacian-lacs-carta.py`, `alsacian-gpkg-info.py`.

1. **France, base SEL.** Les 1 644 polygones colorés du SVG sont recalés sur les 1 605 communes IGN (affinité par département, les trois cartes départementales de la source ayant été assemblées à la main) : écart médian des centres 58 à 88 m. Part de chaque commune dans chaque couleur.
2. **Contrôle par les listes écrites.** This 1887 : 111 communes sur 133 identifiables d'accord ; les autres sont des anciennes communes ou des hameaux (Mancy, Nidange…) ou des cas cohérents (hameau de Saint-Bernard roman, commune de Piblange germanique). Grenzorte : 126 sur 151 d'accord.
3. **Limite alémanique et francique au nord de l'Alsace.** SEL (Wenker) met les Vosges du Nord en francique ; les Grenzorte et la carte de Hudlett y mettent l'alémanique. Retenu : Grenzorte (sources modernes, accord de deux sources). 12 communes passent au bas-alémanique (Baerenthal, Philippsbourg, Dambach, Obersteinbach, Wingen, Climbach, Lichtenberg, Reipertswiller, Wimmenau, Erckartswiller, Arzviller, Danne-et-Quatre-Vents), avec `transicio` = le francique de SEL. Dabo et Walscheid restent francique rhénan (« îlots » selon les Grenzorte), Dabo et Phalsbourg avec hameaux alémaniques.
4. **Luxembourgeois et mosellan.** SEL ne les distingue pas (« Moselfränkisch »). Les deux listes de la ligne *op/of* (hameaux rapportés à leur commune : Zeurange → Flastroff, Rodlach → Bibiche, Edling → Anzeling, Beckerholtz → Filstroff, Diding → Freistroff, Lacroix → Saint-François-Lacroix) forment une barrière fermée de la frontière allemande à la limite romane ; chaque côté s'étend de proche en proche. Résultat : 83 luxembourgeois, 70 mosellans. Accord indépendant avec la carte RF : 78 sur 83 et 63 sur 70. Ligne *wat/was* : 2 désaccords avec SEL (Adelange, Porcelette), notés en transition.
5. **Bas-alémanique du Nord et du Sud** : limite Bas-Rhin / Haut-Rhin (approximation administrative, proche de la ligne de Hudlett) ; les 13 communes alémaniques de Moselle vont au nord. **Strasbourg** seule porte le parler strasbourgeois.
6. **Communes mixtes** : limite de This « à travers » la commune (Serémange-Erzange, Uckange, Ébersviller, Albestroff) ou commune hachurée dans SEL à plus de 15 % (Sainte-Marie-aux-Mines, Aubure, Bretten, Abreschviller).
7. **Pays voisins : cartes recalées.** RF : calage automatique des traits de frontière de la carte sur les limites réelles (Kreise allemands, départements, Luxembourg, cantons suisses ; ICP en projection LAEA) : écart médian 1,2 km, 0,53 km par pixel. ALM : calage sur les centres de 11 lacs suisses (OFS), écarts 0,6 à 1,4 km, 0,16 km par pixel (l'ICP divergeait, abandonné ; contrôle visuel : les villes de la carte tombent dans leurs communes). Pour chaque commune, 1 point intérieur et jusqu'à 49 points en grille ; classe majoritaire ; autre classe à plus de 25 % → `transicio`. Accord avec la France : bas-alémanique 639 sur 674, haut-alémanique 73 sur 76, francique méridional 33 sur 35, francique rhénan 266 sur 276.
8. **Allemagne** : Sarre et Rhénanie-Palatinat avec RF (ALM en secours), Bade-Wurtemberg avec ALM (RF en secours) ; Grenzorte appliqués (74 communes d'accord, 4 corrigées : Muggensturm, Nordheim, Untergruppenbach, Großerlach). Bade-Wurtemberg limité aux communes à moins de 150 km de la France (62 exclues).
9. **Suisse** : langue de la commune par l'OFS (allemand → dialecte d'après ALM ; français → roman, arpitan pour FR et VS, oïl pour JU et le Jura bernois). Les quelques communes que la carte met en bas-alémanique (Leimental, Kreuzlingen) passent en haut-alémanique (décalage de calage à la frontière), sauf Bâle-Ville (Baseldytsch).
10. **Belgique** : sources écrites (PARL, OSTB, THIOIS) ; RF pour ripuaire et mosellan dans la Communauté germanophone. Riemst et Tongres-Looz (Limbourg néerlandais) écartés.
11. **Géométrie terrestre.** Allemagne : VG250 `GF = 4` (terre) ; le lac de Constance (GF 1 et 2) est exclu ; fleuves dans les communes comme en France. Suisse : les communes OSM contiennent les lacs ; les 22 lacs de plus de 5 km² de l'OFS sont retirés (champ `aiga_levada_km2`), les parts cantonales de lacs (OFS 9xxx) supprimées ; les lacs plus petits restent dans les communes. Luxembourg, Belgique : OSM tel quel (lac de la Haute-Sûre, lacs de barrage dans les communes).

## Noms locaux

- Wikidata : le libellé `gsw` et la propriété P1705 donnent les noms dialectaux (Strasbourg *Strosbùri*, Haguenau *Hàwenàu*, Saverne *Zàwere*, Sarreguemines *Saargemìnn*, Thionville *Diddenuewen*, Zurich *Züri*, Stuttgart *Schduagert*). Les titres de la Wikipédia alémanique (als) sont presque toujours les **noms allemands standard** (Straßburg, Mülhausen) : non retenus.
- Règle : P1705 en `gsw`, sinon libellé `gsw` (alémanique, francique de Lorraine et d'Alsace) ; libellé ou titre `lb` pour le luxembourgeois ; OSM `name:lb` (nom officiel) au Luxembourg ; Wikipédia fr « Pays d'Arlon » en Belgique. Un nom identique au nom officiel aux accents, tirets ou canton près est écarté.
- Répartition : France 1 034, Allemagne 569, Suisse 793, Luxembourg 85, Belgique 9. Origine des libellés `gsw` de Wikidata inconnue (graphies hétérogènes : Orthal en Alsace, autres ailleurs) : **à relire**.

## Noms occitans (API de lo Congrès, `verificar-oc.mjs`, 2026-10-10)

- Connus de lo Basic : *luxemborgés*, *luxemborguesa*, *meridional*, *bas*, *naut*, *superior*, *nòrd*, *sud*, *parlar*, *dialècte*, *romanic*, *roman*, *zòna*, *transicion*, *mixta*, *lac*, *Soïssa*, *Bavièra*, *boçut* / *boçuda* (pour « Alsace bossue »).
- Absents (à vérifier sur dicodòc) : *alemanic*, *francic*, *mosellan*, *alsacian*, *Alsàcia*, *soabe*, *ripuari*, *limborgés*, *estrasborgés*, *basilés*, *Lorena*, *Mosèla*, *Luxemborg*, *Belgica*, *Alemanha*, *Palatinat*, *Rin*, *Constança*, *germanofòn*. *Alsacian e francic* est déjà le libellé du catalogue de la carte.
- Pièges : *renan* n'existe dans lo Basic que comme forme du verbe *renar* (« ils grognent ») ; préférer peut-être *francic del Rin*. *Sarra* y est un nom commun (scie, crête), pas la Sarre.
- `--fr` : seuls *bossu* → *boçut* et *dialecte* → *dialècte* ont une traduction ; *alémanique*, *francique*, *alsacien*, *souabe*, *ripuaire*, *limbourgeois*, *lorrain*, *mosellan*, *rhénan*, *strasbourgeois* n'en ont pas.

## Incertitudes

1. **Nord de l'Alsace** (choix du point 3) : selon le critère (isoglosses *Pfund/Pund*, *Apfel/Appel*), la limite se déplace de 10 à 20 km ; Wenker (SEL) et les Grenzorte ne sont pas d'accord sur 12 communes.
2. **« Francique méridional »** : nom français (Hudlett : « francique rhénan méridional ») ; la dialectologie allemande range le parler de la Südpfalz dans le palatin (rhénan). ALM met la Südpfalz et Karlsruhe en *nordoberdeutsch* (francique méridional), RF en rhénan : 30 communes de la Südpfalz notées en transition.
3. Bas-alémanique du Nord et du Sud au département ; Strasbourg seule en strasbourgeois.
4. Ligne *op/of* : listes de communes de la Wikipédia fr sans source précise (mais confirmées par RF).
5. Cartes RF et ALM schématiques : à la commune, une indication ; 151 communes allemandes et 38 suisses en transition. Limite haut-alémanique / alémanique supérieur tirée d'ALM (Thoune y tombe en alémanique supérieur : discutable).
6. **52 communes du nord-est du Bade** (Main-Tauber, Odenwald, Hohenlohe) hors des deux cartes : `incert` (francique oriental ou méridional). 39 autres en francique méridional avec transition `ostfrankisch` possible. À classer ou à exclure.
7. Belgique : Eupen rangé en rhéno-mosan (bas francique) d'après OSTB et RF, Raeren, Bütgenbach et Büllingen en ripuaire d'après RF seulement ; Aubange, Fauvillers et Habay seulement en partie luxembourgeois ; Malmedy et Waimes romanes (minorité germanophone).
8. Fribourg et Morat : villes bilingues de fait, non classées mixtes faute de source officielle (notées).
9. VG250 au 31.12.2024 : les fusions allemandes de 2025-2026 ne sont pas prises en compte. Communes suisses OSM de 2026.
10. **Codes suisses** : préfixe `ch:` (comme demandé) alors que `SIG/arpitan` utilise `ofs:` ; à harmoniser à l'intégration.
11. **Licences** : SEL, RF, ALM et Wikipédia sont sous **CC BY-SA** : les données qui en dérivent le sont aussi (attribution et partage à l'identique sur la carte). Géométries OSM : ODbL ; Allemagne : dl-de/by-2-0 (« © GeoBasis-DE / BKG ») ; Hudlett : contrôle seulement.

## À valider par Romain

- Le choix des Grenzorte (et de Hudlett) contre la carte de Wenker au nord de l'Alsace (12 communes).
- Les noms français et occitans des dialectes et des parlers (table ci-dessus), et le mot pour « rhénan ».
- Le partage nord / sud du bas-alémanique au département, le parler strasbourgeois limité à Strasbourg.
- Les 13 communes mixtes (8 en France, 3 en Belgique, Biel/Bienne et Evilard).
- La bande retenue (Sarre et Rhénanie-Palatinat entières, Bade-Wurtemberg et 17 cantons suisses à moins de 150 km de la France) et les 52 communes `incert`.
- Les noms locaux (`noms-locals.csv`) : provenance des libellés `gsw` inconnue.
- Courtoisie : aucune source n'impose de demande ; citer les auteurs des cartes Commons sur la carte (CC BY-SA).
