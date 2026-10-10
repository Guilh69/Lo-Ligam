# Corse et continuum corso-sarde : dialectes, sources, incertitudes

Travail du 2026-10-10 (sous-agent de la conversation « carte, autres langues »), sur le modèle du basque et des langues d'oïl. Données seulement : rien n'est intégré à `app/`. Tout est à valider par Romain.

## Fichiers

- `dialectes-cors.csv` : 413 lignes, séparateur `;`, UTF-8 avec BOM. Une ligne par commune : les 360 communes de Corse (2A, 2B), 52 communes de Sardaigne du Nord, Capraia Isola. Colonnes : `regio` (Corsica, Sardegna, Toscana), `unitat` (intercommunalité en Corse, province en Italie), `mena` (`comuna_fr`, `comune_it`), `nom_oficial` (IGN, ISTAT), `nom_local` (voir plus bas), `codi` (INSEE ; `it:` + code ISTAT 2026), `domeni` (`cors`, `ligure` pour Bonifacio, `desaparegut` pour Capraia, `vesina` = commune voisine de langue sarde ou catalane qui ferme la zone), `dialecte`, `parlar`, `transicio` (`lij` héritage ligure, `el` grec, `sc` ville de tradition sarde, `sas` passage au sassarais, `gal` gallurais sur une partie d'une commune sarde), `part_oc` (toujours 0), `nota`, `font` (codes plus bas).
- `dialectes-cors.json` : les 5 dialectes (noms co, it, fr, oc ; parlers ; parlers cités par les sources), la zone à part (Corse), le domaine distinct (ligure de Bonifacio), les 6 zones de transition, Capraia (éteint).
- `noms-locals.csv` : 390 lignes (360 communes corses, 30 communes du domaine en Italie) : nom retenu, source retenue, et chaque source à côté (Collectivité de Corse, titre co.wiki, libellé co de Wikidata, OSM `name:co`).
- `gcp-parlars-de-corse.csv`, `gcp-dialetti-corsi.csv` : points de calage des deux cartes.
- `cors-cartas.csv` : lecture brute des deux cartes pour chaque commune (zone au chef-lieu, zones à moins de 1,5 km, part de chaque zone dans la commune). Sert de preuve et de contrôle.
- Hors Git (`SIG/brut/cors/`) : `comuni-it-cors.geojson` (53 communes italiennes classées, géométrie ISTAT non généralisée, WGS84, propriété `codi`, 2,7 Mo), `comuni-it-nord.geojson` (93 communes des provinces 112, 113 et Capraia), `fonts/` (cartes, article de Retali-Medori), `noms/` (extraits Wikidata, OSM, Collectivité de Corse), `istat/` (archive ISTAT), `controle-G.png`, `controle-J.png` (limites communales projetées sur chaque carte).

## Chaîne

Scripts dans `SIG/cadena/`, Python de QGIS (`"C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s script.py`) :

1. `cors-istat.py` : extrait de l'archive ISTAT 2026 les communes des provinces 112 (Città metropolitana di Sassari) et 113 (Provincia del Nord-Est Sardegna) et Capraia Isola (049005).
2. `cors-cartas.py` : rend la carte J en PNG (Qt), cale les deux cartes, lit la zone de chaque commune.
3. `cors-classament.py` : classe chaque commune, ajoute les noms locaux, écrit le CSV, `noms-locals.csv` et le GeoJSON des communes italiennes classées.

Les extraits de noms (`SIG/brut/cors/noms/`) ont été téléchargés à la main le 2026-10-10 : requêtes SPARQL Wikidata (celle de la demande, plus les libellés `co`), Overpass (`name:co` des communes, `ISO3166-2=FR-20R`), export CSV de data.corsica.

## Répartition

| | communes | parlers |
|---|---|---|
| **cismuntincu** (corse du Nord) | 227 en Corse + Capraia (éteint) | capicursinu 18 (Cap Corse), nordicu 128 (Bastia, Nebbiu, Casinca, Castagniccia), cismunticu 81 (Balagne, Niolu, Corte) ; Calvi hachuré (ancien ligure) |
| **transizione** | 64 | de Piana et Vico à Ajaccio, Cinarca, Gravona, Bastelica, Ghisoni, Fiumorbo, Solenzara ; Ajaccio (influence ligure) et Cargèse (grec) hachurés |
| **oltramuntincu** (corse du Sud) | 68 | taravesu 40, sartinesu 28 |
| **ligure** (domaine distinct) | 1 | Bonifacio (bunifazzinu) |
| **gadduresu** (Sardaigne) | 25 | isulanu (La Maddalena), castiddanesu (Castelsardo, Sedini, Tergu, hachurés vers le sassarais, avec Valledoria) ; Olbia et Golfo Aranci hachurés (tradition sarde) |
| **sassaresu** | 4 | Sassari, Porto Torres, Sorso, Stintino |
| voisines (`vesina`) | 23 | 18 communes de langue sarde, dont Luras (enclave), et Alghero (catalan) ; 5 communes sardes avec du gallurais sur une partie du territoire (Budoni, Perfugas, Tula, Padru, Oschiri) |

## Sources (codes de la colonne `font`)

| code | source | licence | servi à |
|---|---|---|---|
| G18 | « Parlers de Corse », Gcapadovani, 2018-06-25, Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Parlers_de_Corse.jpg (carte utilisée par l'article « Lingua corsa » de la Wikipédia corse) | CC BY-SA 4.0 | **base** : 5 zones corses (cismunticu capicursinu, cismunticu nordicu, cismunticu, pumunticu di transizione, corsu taravesu & sartinesu), ligure (Calvi, Ajaccio, Bonifacio), grec (Cargèse) ; 47 villages pointés ont servi au calage |
| J06 | « Dialetti corsi vector ita », Jkens, Snowdog, Lokiseinchef, 2006, https://commons.wikimedia.org/wiki/File:Dialetti_corsi_vector_ita.svg (aussi en anglais : Maps of Corsican Dialects.svg ; version recadrée de Pikkupapupata, 2025) | CC BY-SA 3.0 (it) | **seconde carte** : capraiese, capocorsino, cismontano, transizione, oltramontano, oltramontano sartenese ; en Sardaigne gallurese, castellanese, sassarese, sarde ; sert au Cap Corse, au partage taravesu / sartinesu, au contrôle |
| WIT | Wikipédia en italien, « Lingua corsa », sections Varianti et Area di diffusione (consultée le 2026-10-10), https://it.wikipedia.org/wiki/Lingua_corsa | CC BY-SA 4.0 | lignes de partage décrites par villages (cismontano au nord de Piana, Vico, Vizzavona, Ghisoni, Ghisonaccia ; pumontincu au sud de Porticcio, Bastelica, col de Verde, Solenzara ; transition entre les deux), parlers nommés (bastiacciu, balaninu, niulincu, aiaccinu, bastelicaccio, fiumorbacciu, taravesu, sartinesu, rucchisgianu, portivechjacciu), Calvi et Bonifacio, Cargèse. **Attention** : la section Varianti (lignes, parlers) n'a pas de référence (la note qui la suit, de Jacques Fusina, porte sur un autre point) ; la section Area di diffusione (Bonifacio, Calvi, Sardaigne) cite Retali-Medori (2024). La Wikipédia corse (« Lingua corsa », section Varietà) donne la même ligne principale : au-dessus d'Ajaccio (entre Casaglione et Calcatoggio), au-dessus de Bocognano, au-dessous de Ghisoni |
| WFR | Wikipédia en français, « Corse (langue) », section Répartition géographique, https://fr.wikipedia.org/wiki/Corse_(langue) | CC BY-SA 4.0 | mêmes lignes ; influence ligure à Ajaccio ; Capraia éteint ; La Maddalena « similaire à celui de Sartène » |
| WFRM | Wikipédia en français, pages « Niolo », « Cinarca », « Gravona » (communes traversées), « Taravo » (communes traversées), « Fiumorbo », « Alta Rocca », « Balagne » | CC BY-SA 4.0 | communes des microrégions qui portent un parler nommé (notes seulement) |
| EPCI | IGN, couche `epci` : communauté de communes du Cap Corse (18 communes) ; Pays de Balagne = CC Calvi Balagne + CC de l'Île-Rousse - Balagne (36 communes, d'après fr.wiki « Balagne ») | Licence ouverte 2.0 | Cap Corse (parler capicursinu), Balagne (balaninu) |
| RM24 | Stella Retali-Medori, « Corsican Dialect Classifications », *Dialectologia*, numéro spécial 12, 2024, p. 99-145, doi:10.1344/Dialectologia2024.2024.4 ; carte 6 « The current classification of Corsican dialects » (J. Jouve, plateforme LOCUS, 2024) | **CC BY-NC-ND 4.0** | **contrôle seulement** (clause NC) : classement actuel de Dalbera-Stefanaggi (NALC) en 5 aires : Cap Corse, nord-est, centre-nord, aire taravaise (avec le Fiumorbo), aire corso-gallurienne, et le sassarais à part |
| WGAL | Wikipédia en italien, « Lingua gallurese » (Area di diffusione, Varianti locali), https://it.wikipedia.org/wiki/Lingua_gallurese ; Wikipédia en corse, « Gadduresu » | CC BY-SA 4.0 | liste des communes galluraises, Olbia et Luras de tradition sarde, communes sardes partiellement galluraises, variantes locales ; ces listes viennent des travaux de Mauro Maxia cités par l'article |
| WSAS | Wikipédia en italien, « Lingua sassarese », https://it.wikipedia.org/wiki/Lingua_sassarese | CC BY-SA 4.0 | communes sassaraises, castellanese, toponymes sassarais |
| LR97 | Loi régionale sarde 26 du 15 octobre 1997, art. 2, al. 4 : même valeur que le sarde reconnue « al dialetto sassarese e a quello gallurese » (texte : CEFAN, https://www.axl.cefan.ulaval.ca/europe/italiesardaigne-loi97.htm) | texte de loi | reconnaissance ; aucune liste de communes (« con riferimento al territorio interessato ») ; art. 2 abrogé par la loi 22/2018 |
| LR18 | Loi régionale sarde 22 du 3 juillet 2018, art. 2 (gallurese, sassarese, tabarchino dans le patrimoine de la Région) et art. 8, al. 9 : « il gallurese con le sue varietà castellanese e isulanu dell'Arcipelago di La Maddalena » (texte : CEFAN, https://axl.cefan.ulaval.ca/europe/italiesardaigne-loi-2018.htm) | texte de loi | castellanese et isulanu rangés dans le gallurais |
| CTC | Collectivité territoriale de Corse, « Communes de Corse en corse et en français », data.corsica, mis à jour le 2023-11-28, https://data.corsica/explore/dataset/communes-de-corse-en-corse-et-francais/ | Licence ouverte 2.0 | **noms corses des 360 communes** (nom officiel de la Collectivité) |
| WD | Wikidata (requête de la demande : liens de site de co.wikipedia et P374 ; libellés `co` ; communes de Sardaigne avec liens co et sc) | CC0 | noms corses de contrôle ; noms gallurais (titres co.wiki) ; coordonnées des villes sardes et de Capraia pour le calage de J |
| OSM | OpenStreetMap, `name:co` des communes (64 sur 360 en ont un) | ODbL | noms de contrôle |
| IGN | ADMIN EXPRESS COG CARTO 2026 (couches `commune`, `chef_lieu_de_commune`, `epci`) | Licence ouverte 2.0 | communes de Corse, chefs-lieux, intercommunalités |
| ISTAT | Confini delle unità amministrative a fini statistici al 1° gennaio 2026, version non généralisée, https://www.istat.it/notizia/confini-delle-unita-amministrative-a-fini-statistici-al-1-gennaio-2018-2/ | CC BY 4.0 (note légale de l'ISTAT) | communes italiennes, côte précise |

Le texte d'Oppo (*Le lingue dei sardi*, 2007) n'est cité qu'au travers d'it.wiki (chiffres d'Olbia).

### Ce qui n'a pas servi, et pourquoi
- **Nouvel atlas linguistique et ethnographique de la Corse** (Dalbera-Stefanaggi, NALC-BDLC) : pas de données ouvertes commune par commune ; son classement n'est connu ici que par la carte 6 de Retali-Medori, sous licence NC-ND, donc contrôle seulement.
- **ALEIC** (Bottiglioni, 1933-1942) : 49 points d'enquête et des cartes de mots, pas un découpage dialectal ; Bottiglioni contestait d'ailleurs la bipartition (Retali-Medori 2024).
- **Jean-Marie Comiti** : ses travaux sont sociolinguistiques ; aucune carte dialectale ouverte de lui n'a été trouvée.
- Carte « Idioma corso » (Fobos92) : simple extension de la langue.

## Méthode

1. **Calage** (`cors-cartas.py`) : modèle polynomial des pixels en fonction des coordonnées UTM 32N (ordre 2 pour G, 1 pour J), ajusté sur les points de calage. G : 47 villages (point noir de la carte / chef-lieu IGN), écart moyen 1,55 km, médian 1,23 km, maximum 4,3 km (Ponte-Leccia) : la carte est dessinée à main levée. J : 16 villes (centres des points de la carte SVG ; Sardaigne et Capraia : coordonnées Wikidata), écart moyen 2,4 km, maximum 6,6 km (Corte). Contrôle visuel : `SIG/brut/cors/controle-G.png`, `controle-J.png`.
2. **Lecture** : couleur de chaque pixel ramenée à la plus proche des couleurs de la légende ; les étiquettes colorées hors de l'île sont écartées. Zone d'une commune = zone majoritaire à moins de 0,5 km de son chef-lieu (le point noir du village et les lettres ne comptent pas) ; on note aussi les zones à moins de 1,5 km et la part de chaque zone dans la commune.
3. **Accord des deux cartes** : sur les trois groupes (nord, transition, sud), G et J s'accordent pour 336 des 355 communes lisibles (5 chefs-lieux sont sous une tache ligure ou grecque de G).
4. **Classement** (`cors-classament.py`) :
   - groupe et parler de G ; sous la tache ligure ou grecque, la zone corse voisine dans la commune ;
   - **Cap Corse** : capicursinu pour les 18 communes de la communauté de communes, que J range toutes en « capocorsino » (G n'en met que 8 en capicursinu, le reste en cismunticu nordicu ; la carte de contrôle RM24 donne aussi tout le nord du Cap) ;
   - **écarts tranchés par it.wiki** : Sari-Solenzara, Serra-di-Fiumorbo, San-Gavino-di-Fiumorbo, Solaro, Ventiseri, Chisa en transition (G : sud ; J et le texte : transition, le pumuntincu commençant au sud de Solenzara) ; Bastelica en transition (le village est sur la limite de G ; it.wiki la nomme dans la transition). Ailleurs, G est gardée et l'avis de J est noté (Gravona, Prunelli, Guagno, Orto, Vivario…) ;
   - **sud** : taravesu ou sartinesu selon J (« oltramontano » ou « oltramontano sartenese ») ; Conca et Lecci, lues taravesu mais sans aucune voisine taravesu, sont rangées en sartinesu comme leurs voisines (règle générale : un parler isolé prend celui de ses voisines du même dialecte) ;
   - **cas à part** : Bonifacio (domaine ligure distinct), Calvi (hachures, ancien ligure éteint), Ajaccio (hachures, influence ligure), Cargèse (hachures, tradition grecque) ;
   - **parlers nommés** par it.wiki : en note seulement, pour les communes de la microrégion (listes de fr.wiki) ou du village nommé ; ils n'ont pas de limites dans les sources.
5. **Sardaigne** : listes de communes d'it.wiki (Maxia), la loi pour le rang de castellanese et isulanu ; voisines = communes sardes qui touchent le domaine. La carte J a servi de contrôle (gallurais à 87 % ou plus pour Olbia et Tempio, castellanese pour Castelsardo, Sedini, Tergu, sassarese pour Sassari, Porto Torres, Stintino, Sorso).

## Noms locaux

- **Corse** : nom de la Collectivité de Corse (CTC, officiel, Licence ouverte) pour les 360 communes. Comparaison : la forme CTC est aussi celle d'au moins deux autres sources pour 208 communes, d'une seule pour 69, ne diffère qu'à l'article ou aux accents pour 32 (A Piana / Piana, Bastia / Bastìa) et n'est donnée par aucune autre source pour 51 (variantes réelles : Appietu / Appiettu, Cutuli / Cuttuli, Reza / Scanafaghjaccia, etc.). Les titres co.wiki ont des formes étranges (Sari di Portivechju pour Sari-Solenzara, U Serraghju pour Venaco, Urnasu pour Serra-di-Fiumorbo, suffixes « (cumuna) ») : ils ne sont pas retenus. OSM n'a de `name:co` que pour 64 communes.
- **Sardaigne** : titre de l'article co.wiki (formes galluraises : Tempiu, Alzachena, Caragnani, A Madalena, Lungoni…) ; communes sassaraises : toponymes d'it.wiki (Porthu Torra, Sossu, Isthintini) ; Sedini et Tergu, sans article co.wiki : formes sassaraises d'it.wiki (Séddini, Zélgu) ; Olbia : Tarranoa (libellé co de Wikidata et texte de co.wiki, le titre co.wiki étant « Olbia ») ; San Teodoro : Santu Tiadoru (lien de l'article co.wiki « Gadduresu »). Communes voisines : pas de nom local recherché.

## Noms occitans (vérifiés avec l'API de lo Congrès le 2026-10-10)

- Connus du Basic : còrs, nòrd, sud, del, de, parlar, transicion, ligur, grèc, sarde, sarda, tradicion, vila, influéncia, ancian, passatge, sus, una, part, territòri, comuna, illa, zòna, lenga, dialècte, carta, lei, nom, occitan, grop, forma, font, absent, mot, per, tot, validar, licéncia, italian, collectivitat ; escantit, dobèrta, verificat, es, vejatz (formes verbales, vèrb'Òc).
- Retenus pour les dialectes : **còrs del nòrd**, **parlars de transicion**, **còrs del sud**.
- **Absents du Basic, à valider** : gallurés, sassarés, Corsega ; et les formes écartées cismontan, ultramontan, capcorsin, bonifacian, sard, grèga (non employés). Les noms de lieux corses gardent leur forme corse dans les étiquettes (Calvi, Aiacciu, Carghjese, Bunifaziu).

## Incertitudes

- **Les deux cartes sont des dessins d'amateurs**, schématiques (lignes lisses, île stylisée sur G) ; aucune ne cite sa source. Une commune proche d'une limite peut changer de zone : 17 communes portent la note « limite de zone sur G », 24 une divergence de J. La précision réelle est de l'ordre de 1,5 à 2 km.
- **Les lignes de partage d'it.wiki ne sont pas sourcées** dans l'article (co.wiki donne la même ligne principale, sans source non plus) : elles n'ont servi qu'à trancher entre les deux cartes (7 communes).
- **Le partage en trois groupes n'est pas celui des linguistes d'aujourd'hui** : Dalbera-Stefanaggi distingue 5 aires (Cap, nord-est, centre-nord, taravaise, corso-gallurienne). Les parlers de G (capicursinu, nordicu, cismunticu) et de J (taravesu, sartinesu) s'en approchent ; mais l'aire taravaise (Ajaccio, Taravo, Fiumorbo) regroupe notre transition et notre taravesu.
- **Cap Corse** : G réduit le capicursinu à la côte ouest (Canari, Nonza…) ; Retali-Medori note que le vocalisme propre au Cap ne survit qu'à Morsiglia et Centuri. Le choix des 18 communes suit J et RM24.
- **Transition** : sa place est discutée (G la met dans le sud, it.wiki la partage entre les deux groupes) ; elle forme ici un groupe à part.
- **Gravona, Prunelli** (Bocognano, Carbuccia, Cuttoli, Peri, Tavera, Ucciani, Ocana, Tolla, Cauro, Eccica-Suarella) : transition sur G, sud sur J ; it.wiki dit que la Gravona est de transition « mais plus nettement méridionale au sud ».
- **Bonifacio** : commune entière en ligure alors que sa campagne parle corse ; Porticcio (hameau de Grosseto-Prugna) et Vizzavona (hameau de Vivario) sont de transition pour it.wiki, leur commune ne l'est pas.
- **Sardaigne** : pas de liste officielle des communes (la loi parle du « territoire concerné ») ; les listes viennent d'it.wiki et de co.wiki. Olbia et Golfo Aranci sont rangées en gallurais hachuré, mais sont historiquement de langue sarde ; Luras est une enclave sarde ; La Maddalena est rangée dans le gallurais (loi) alors que la dialectologie y voit du corse du Sud.
- **Codes ISTAT** : ceux du 1er janvier 2026 (réforme des provinces sardes : 112 Città metropolitana di Sassari, 113 Nord-Est Sardegna). Wikidata mélange anciens et nouveaux codes ; le fichier catalan donne Alghero en `istat:090003` (ancien code), ici `it:112001`.

## À valider par Romain

1. Les trois groupes corses et leurs noms : faut-il garder la transition comme groupe à part (comme les deux cartes) ou la partager entre nord et sud (comme it.wiki) ? Et les noms occitans « còrs del nòrd », « parlars de transicion », « còrs del sud ».
2. Les noms corses des groupes : cismuntincu, pumuntincu (« oltramuntincu », demandé, n'apparaît dans aucune source lue), pumunticu di transizione ; et des parlers : capicursinu, cismunticu nordicu, cismunticu, taravesu, sartinesu.
3. Le Cap Corse : 18 communes (choix retenu) ou les 8 de G.
4. Bonifacio en domaine ligure distinct (commune entière) ; Calvi, Ajaccio, Cargèse en hachures.
5. Sardaigne : la loi plutôt que la dialectologie pour La Maddalena (gallurais) ; Olbia et Golfo Aranci hachurées ; Luras en trou ou en hachures ; les 5 communes sardes partiellement galluraises.
6. Les noms occitans absents du Basic : gallurés, sassarés, Corsega.
7. Les licences : les classements dérivent de deux cartes CC BY-SA (mention « d'après Gcapadovani, 2018, et Jkens, Snowdog, Lokiseinchef, 2006, Wikimedia Commons, CC BY-SA » ; si la couche publiée est vue comme une adaptation, même licence pour elle, comme pour la carte picarde) ; ISTAT CC BY 4.0 (mention de la source) ; noms CTC en Licence ouverte. L'article de Retali-Medori (NC-ND) n'a servi qu'au contrôle et n'est pas republié.
