# Flamand de France et continuum néerlandais : sources, méthode, incertitudes

Travail du 2026-10-10 (sous-agent, conversation « carte, autres langues »), sur le modèle de `SIG/basc/FONTS.md`.
Rien n'est intégré à l'application : ce dossier ne contient que des tableaux et des fiches à valider.

## Fichiers

- `dialectes-flamenc.csv` : 765 lignes, séparateur `;`, une ligne par commune : France (Westhoek, 119), Flandre (285), Bruxelles (19), Pays-Bas (342). Colonnes du basque : `regio`, `unitat` (province ; canton AN 2013 en France), `mena`, `nom_oficial`, `nom_local`, `codi` (`nl:GMxxxx`, `be:NIS`, INSEE), `domeni` (`neerlandes`, `bassaxon`, `frison`, `exclos`), `dialecte`, `parlar`, `transicio`, `part_oc` (toujours 0), `nota`, `font`.
- `dialectes-flamenc.json` : domaines, groupes de Daan, 15 dialectes (endo, fr, oc proposé, résultat de la vérification occitane, parlers), la zone à part (flamand de France) et les transitions.
- `noms-locals.csv` : 325 noms dans la langue du lieu (vls 166, nds-nl 72, li 63, fy 13, zea 13), avec le titre brut de l'article et l'élément Wikidata.
- `westhoek-istoric.csv` : pour chaque commune du Westhoek, l'état linguistique en 1806, 1856, 1900, 1932 et 1971, et les mesures de lecture des cartes (voir plus bas).
- Géométries (hors Git, `SIG/brut/flamenc/`) : `nl-comunas.geojson` (342 communes, terre seule), `be-comunas.geojson` (565 communes, côte découpée), `fr-westhoek-comunas.geojson` (communes IGN du Nord et du Pas-de-Calais autour du Westhoek), `fr-westhoek-comunas-associadas.geojson` (Saint-Pol-sur-Mer, Mardyck, Fort-Mardyck, Coudekerque-Village, Les Moëres…). WGS84, propriété `codi`.

Chaîne (dans l'ordre) : `flamenc-be-comunas.mjs`, `flamenc-geometrias.py`, `flamenc-wikidata.mjs`, `flamenc-carta-daan.py`, `flamenc-carta-treehill.py`, `flamenc-carta-vanneste.py`, `flamenc-taula.py` (tous dans `SIG/cadena/`, Python de QGIS sauf les `.mjs`). Module commun de calage : `flamenc-calatge.py`.

## Géométries et traitement de l'eau

| pays | source | traitement |
|---|---|---|
| Pays-Bas | CBS, *Wijk- en Buurtkaart 2025*, service WFS PDOK `https://service.pdok.nl/cbs/wijkenbuurten/2025/wfs/v1_0`, couche `gemeenten` (RD New) | chaque commune y est découpée en deux objets, `water = NEE` (terre) et `water = JA` (mer du Nord, Waddenzee, IJsselmeer, estuaires de Zélande, grands lacs) : seule la terre est gardée (342 communes, 6 463 km² d'eau ôtés). Licence : données ouvertes du CBS (CC BY 4.0 annoncée par le CBS, à confirmer sur la fiche PDOK). |
| Belgique | SPF Finances (AGDP), service INSPIRE *Administrative units*, niveau 5 : `https://ccff02.minfin.fgov.be/geoservices/arcgis/rest/services/INSPIRE/AU/MapServer/1` | **565 communes, pas 581** : depuis le 1er janvier 2025, fusions en Flandre (300 → 285 communes) et Bastogne-Bertogne. Les communes côtières s'arrêtent à la laisse de basse mer : découpées par la côte OpenStreetMap (`SIG/brut/costa-osm/belgica.json`, ODbL), 1 à 4,6 km² ôtés pour chacune des 10 communes de la côte (plage, port de Zeebrugge…). Statbel était inaccessible (protection anti-robots) ; licence du service AGDP non indiquée, à vérifier. |
| France | IGN, ADMIN EXPRESS COG CARTO 2026, couche `commune` (`SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg`), Licence ouverte | la version CARTO suit déjà le trait de côte. |

## Partie France : le flamand du Westhoek, commune par commune

### Sources

| code | source | usage |
|---|---|---|
| VAN72 | Alex Vanneste, « Taaltoestand in Frans-Vlaanderen », 1 et 2, *Ons Erfdeel*, 15, 1972, p. 57-… et p. 29-… (DBNL : `https://www.dbnl.org/tekst/_ons003197201_01/_ons003197201_01_0090.php` et `…_0128.php`). Droits réservés : les cartes ne sont ni recopiées ni publiées, seul leur contenu sert. | Vanneste a reporté sur une même carte des 119 localités (entre la mer, la Belgique, la Lys et l'Aa) : la carte de **Bocave** publiée par **de Coussemaker** (« Délimitation du flamand et du français dans le Nord de la France », 1857, situation de **1856**), celle de **Kurth** (1900), celle de **Celen** (1933, situation de 1932) et sa propre enquête de **1971** (questionnaires et visites, pourcentages pour 40 villages). Classes : unilingue français, bilingue à majorité française, bilingue à majorité flamande, unilingue flamand. |
| BRU27 | Ferdinand Brunot, *Histoire de la langue française*, t. IX, 1927, d'après l'enquête de Coquebert de Montbret (1806), cité par Wikipédia, « Flamand de France » | 1806 : toutes les communes des arrondissements de Dunkerque et d'Hazebrouck flamandes, sauf Gravelines, Loon, Mardyck et dix communes du sud (Blaringhem, Boëseghem, Thiennes, Haverskerque, Merville, La Gorgue, Estaires, Neuf-Berquin, Steenwerck, Nieppe) ; Holque et Saint-Momelin mixtes ; Wervicq-Sud seule commune flamande de l'arrondissement de Lille. |
| CFF57 | *Annales du Comité flamand de France*, t. III, 1856-1857, cité par Wikipédia | flamand encore parlé en 1845 à Clairmarais, Saint-Folquin, au Haut-Pont (Saint-Omer), à Saint-Omer-Capelle, Oye, Ruminghem, Vieille-Église. |
| AN13 | Archives nationales, carte linguistique (2013, au canton), zone 7.1 « bas francique (flamand) » : 8 cantons (Bergues, Cassel, Hondschoote, Steenvoorde, Wormhout, Coudekerque-Branche, Hazebrouck, Bailleul) | contrôle seulement |

Cartes libres de Wikimedia Commons examinées et **écartées** (sans source citée) : « Flemish in the arrondissement of Dunkirk.png » (Dimitri, 2006, « zelfgemaakt »), « France Flanders language-*.svg » (d'après « Kaartfransvlaanderen.jpg », Domie, 2003), « Frans-Vlaanderen.png » (Gruna 1, 2008). Les travaux de Ryckeboer (*Het Nederlands in Noord-Frankrijk*, DBNL) n'ont pas été dépouillés faute de temps : à faire si Romain veut une limite du XXe siècle.

### Méthode (`flamenc-carta-vanneste.py`)
1. Les quatre cartes (images de la DBNL, 470 px) sont calées automatiquement sur les communes IGN de l'arrondissement de Dunkerque et Clairmarais : affinité puis déformation polynomiale ajustée sur le contour (écart médian 140 à 170 m, la carte a ~130 m par pixel).
2. Pour chaque commune (réduite de 250 m pour éviter les limites communales noires), trois mesures : corsas horizontales (quadrillage = unilingue français), corsas verticales (hachures = bilingue français), petits points (bilingue flamand) ; le reste est blanc (unilingue flamand). Seuils réglés sur 21 communes regardées à l'œil ; une lecture visuelle corrige Craywick (1856 : hachures).
3. **Contrôle** : pour 1971, la lecture de la carte et le texte de Vanneste (qui classe la plupart des villages) concordent pour **102 communes sur 104** (désaccords : Cappelle-Brouck, Ebblinghem ; le texte prime). Pour 1856, les effectifs sont proches des chiffres de 1857 cités par Wikipédia (arrondissement d'Hazebrouck : 8 communes françaises, 3 bilingues françaises ; mesuré : 9 et 3-4).

### Règle de classement (à valider)
- `domeni = neerlandes`, dialecte `flamenc_occidental`, parler `frans-vlaams` : commune flamande en 1856 (unilingue ou bilingue à majorité flamande) : **86 communes**.
- `transicio = pcd` (hachures flamand / picard) : bilingue à majorité française en 1856, ou flamande en 1806 et française en 1856 : **16 communes** (Dunkerque, Coudekerque-Branche, Grande-Synthe, Bourbourg, Loon-Plage, Craywick, Saint-Georges-sur-l'Aa, Watten, Holque, Saint-Momelin, Saint-Pierre-Brouck, Clairmarais, Blaringhem, Boëseghem, Renescure, Le Doulieu).
- `domeni = exclos` : française en 1856 et en 1806 (Gravelines, Grand-Fort-Philippe, Thiennes, Haverskerque, La Gorgue, Estaires, Merville, Neuf-Berquin, Steenwerck, Nieppe) : 10 ; et `transicio = istoric` pour 7 localités flamandes au XIXe siècle hors de la carte de 1856 (Wervicq-Sud, Saint-Omer, Ruminghem, Saint-Folquin, Saint-Omer-Capelle, Oye-Plage, Vieille-Église).
- **Dunkerque** : flamande en 1806, unilingue française dès 1856 (Bocave), entièrement francisée en 1971 : en transition (hachures), comme demandé. La commune actuelle comprend Malo, Rosendaël, Petite-Synthe, Saint-Pol-sur-Mer, Mardyck et Fort-Mardyck (classés à part dans `westhoek-istoric.csv`).
- La série complète 1806-1856-1900-1932-1971 est dans la `nota` de chaque commune (V1 unilingue flamand, V2 bilingue flamand, F2 bilingue français, F1 unilingue français) ; en 1971 il ne reste aucune commune unilingue flamande.
- Comparaison avec les Archives nationales (au canton) : sur les 80 communes des cantons de la zone 7.1, 73 flamandes, 4 en transition, 3 exclues (Nieppe, Steenwerck, Thiennes, françaises dès 1806) ; 25 communes rangées picardes par les AN sont flamandes ou en transition ici (cantons de Dunkerque, Bourbourg, Grande-Synthe, Merville), parce que le canton ne descend pas à la commune.

## Partie Belgique et Pays-Bas : dialectes néerlandais

### Sources

| code | source | usage |
|---|---|---|
| DB69 | **Jo Daan et D. P. Blok, carte « Dialecten » (1969, *Van Randstad tot Landrand*)**, par la carte libre « Dutch-dialects.svg » (Wikimedia Commons, Jeroen, 2008, CC BY-SA 3.0 / GFDL : `https://commons.wikimedia.org/wiki/File:Dutch-dialects.svg`), qui dit reprendre « for the most part » le classement de Daan ; c'est la carte de l'article « Nederlandse dialecten » de la Wikipédia néerlandaise. 24 zones numérotées en 6 groupes, plus la Flevoland et la Frise (en blanc). | **base retenue** : domaine, dialecte, parler (zone) |
| TH22 | « Dutch dialects map - fr.svg » (Wikimedia Commons, Treehill, 2022, CC BY-SA 4.0, « own work », **sans source**) : plus fine (brabançon et limbourgeois subdivisés), ne couvre pas la France | parlers du brabançon et du limbourgeois ; contrôle (désaccords notés) |
| WPNL | Wikipédia néerlandaise, « Nederlandse dialecten » | Kerkrade, Simpelveld, Vaals : ripuaire |
| LEG | législation linguistique belge | Bruxelles bilingue, communes à facilités |

Calage : comme pour la France, automatique sur le contour des communes (projection plate carrée, la meilleure pour ces cartes) puis deux déformations polynomiales régionales, au nord et au sud des grands fleuves : écart médian 570-600 m (Daan) et 500-870 m (Treehill), pour des cartes à 160-175 m par pixel. La part de chaque zone dans chaque commune est mesurée sur une grille de 250 m.

### Résultat (communes)

| | dialecte (code) | Flandre | Bruxelles | Pays-Bas |
|---|---|---|---|---|
| néerlandais | flamand occidental (`flamenc_occidental`) | 60 | | 2 (Sluis, Terneuzen) |
| | flamand oriental (`flamenc_oriental`) | 49 | | 1 (Hulst) |
| | brabançon (`brabancon`) | 138 | 19 | 67 (dont Limbourg du Nord) |
| | limbourgeois (`limborgues`) | 38 | | 26 |
| | zélandais (`zelandes`) | | | 11 (dont Goeree-Overflakkee) |
| | hollandais (`olandes`) | | | 86 |
| | utrechtois-alblasserwaardais (`utrechtes`, groupe D de Daan) | | | 38 |
| | gueldrois méridional (`zuid_gelders`) | | | 18 |
| | Flevoland, sans dialecte majoritaire (Daan) | | | 5 |
| bas-saxon (`bassaxon`) | gronings 12, stellingwerfs 4, drents 10, twents 14, gelders-overijssels 25 (dont Urk), veluws 10 | | | 75 |
| frison (`frison`) | frison occidental | | | 13 |

- La Flandre zélandaise : la légende de Daan met « Zeeuws-Vlaams » avec le flamand occidental (zone 1) ; Treehill la partage (ouest flamand occidental, centre zélandais, est flamand oriental) : noté.
- Bruxelles : `transicio = fr`, région bilingue à majorité francophone, brabançon (brussels) historique. Les 6 communes flamandes à facilités sont notées.
- Frise : communes blanches sur la carte de Daan = frison ; Waadhoeke (bildts, 45 %), Achtkarspelen et Noardeast-Fryslân (kollumerlands, bas-saxon, 26-29 %) en transition ; les ronds de la carte (villes en stadsfries) sont trop petits pour changer une commune et sont seulement notés. Ooststellingwerf et Weststellingwerf : bas-saxon.
- Îles : Texel et Vlieland hollandais (flèches de la carte), Terschelling et Ameland zone 9 (hollandais à substrat frison ; transition frison pour Terschelling), Schiermonnikoog frison.
- Cas hors carte, à la main : Voeren (limbourgeois oriental, platdiets), Herstappe (limbourgeois).
- Transitions : 43 communes partagées entre deux zones de Daan (25 % ou plus dans la seconde) ; 39 communes à moins de 70 % dans leur zone, dont 21 à moins de 60 % (notées « incert »). Treehill contredit Daan (à 50 % ou plus de la commune) pour 110 communes, surtout aux limites flamand occidental / oriental (Courtrai, Waregem : Daan flamand occidental, Treehill oriental), brabançon / limbourgeois (Hageland : Tirlemont, Diest) et dans le Gueldre (Nimègue : gueldrois méridional chez Daan, « limbourgeois gueldrois » chez Treehill) : notées, Daan gardé.

## Noms dans la langue du lieu
Wikidata (CC0, requête SPARQL sur les codes NIS, CBS et INSEE) puis titre de l'article de la Wikipédia régionale, sans la parenthèse d'homonymie, **seulement dans la langue de la zone de la commune** : vls (flamand occidental, y compris le Westhoek : Dunkerque « Duunkerke », Bailleul « Belle »), zea (zélandais et Flandre zélandaise), li (limbourgeois), nds-nl (bas-saxon), fy (frison). Pas de Wikipédia pour le brabançon, le flamand oriental, le hollandais : nom officiel seulement.

## Noms occitans (vérifiés avec l'API de lo Congrès le 2026-10-10)
Connus du Basic : neerlandés, olandés, flamenc, occidental, oriental, meridional, bas, luxemborgés, bilingüe, transicion, dialècte, domeni, zòna, istoric. **Absents** (propositions à valider) : brabançon, limborgés (formé sur luxemborgés), zelandés (sur olandés), frison, saxon, utrechtés, gueldrés, et les toponymes Flandra, Brabant, Limborg, Zelanda, Brussèlas, Anvèrs, França. Les noms des dialectes bas-saxons sont laissés en néerlandais.

## À valider par Romain
1. La **limite historique** retenue en France (1856, carte de Bocave) et le traitement de Dunkerque et des 16 communes en transition ; les 7 localités « istoric » (hachures ou non ?).
2. Le choix de Daan (1969) pour la Belgique et les Pays-Bas, avec ses groupes (utrechtois et gueldrois méridional à part, Veluws et Urk en bas-saxon, Limbourg du Nord en brabançon), contre Treehill ou d'autres classements.
3. Les noms occitans (liste ci-dessus) et les couleurs.
4. Les parlers de Treehill (source inconnue) pour le brabançon et le limbourgeois : les garder comme indication ou les retirer.

## Incertitudes
- Les cartes de Daan et de Treehill sont schématiques (contours dessinés à la main) : une commune à la limite de deux zones peut basculer (voir `nota`).
- Westhoek : lecture automatique d'images de 470 px ; 1856 mesuré au contour actuel des communes (fusions de Téteghem-Coudekerque-Village et de Ghyvelde-Les Moëres en 2016).
- Wikidata attribue par erreur le code 71072 à Hasselt et à Hoeselt : Hasselt gardée.
