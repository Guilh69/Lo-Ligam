# Belgique romane (et communes germanophones de Wallonie) : sources, méthode, incertitudes

Travail du 2026-10-10 (sous-agent, conversation « carte, autres langues »), suite de `SIG/oil/FONTS.md` (« À trouver : Belgique »).
Rien n'est intégré à l'application.

## Fichiers

- `dialectes-oil-belgica.csv` : 261 lignes (toutes les communes de la Région wallonne en 2025, Communauté germanophone comprise), séparateur `;`, colonnes du basque : `regio`, `unitat` (province), `mena`, `nom_oficial` (français ; allemand pour les 9 communes germanophones), `nom_local`, `codi` (`be:NIS`), `domeni` (`oil` ou `germanic`), `dialecte` (la langue : `picard`, `valon`, `lorren`, `campanes` ; `platdiets`, `ripuari`, `francic_mosellan`, `luxemborgues`), `parlar` (sous-zone wallonne, parler picard, `gaumes`), `transicio`, `part_oc` (0), `nota`, `font`.
- `dialectes-oil-belgica.json` : langues, parlers (endo, fr, oc proposé), transitions.
- `noms-locals.csv` : 225 noms (wa 185, pcd 35, lb 5).
- Géométries : `SIG/brut/flamenc/be-comunas.geojson` (565 communes belges, voir `SIG/flamenc/FONTS.md`).

Chaîne : `belgica-carta-chapeau.py`, `belgica-carta-pierret.py`, `belgica-picard.py`, puis `belgica-taula.py` (après `flamenc-geometrias.py` et `flamenc-wikidata.mjs`).

## Sources

| code | source | usage |
|---|---|---|
| CHAP22 | « Carte dialectale de la Belgique romane - Chapeau » (Wikimedia Commons, Reptilien.19831209BE1, 2022-04-06, CC BY-SA 4.0 ; dérivée de « Mape tchapea.jpg », Lucyin, 2017, CC BY-SA 4.0) : `https://commons.wikimedia.org/wiki/File:Carte_dialectale_de_la_Belgique_romane_-_Chapeau.svg`. Rendu 3840 px de la SVG par Wikimedia (`SIG/brut/oil-belgica/chapeau-3840.png`). | **base** : picard, wallon (ouest-wallon, namurois, liégeois, sud-wallon), champenois, gaumais, parlers germaniques ; deux étiquettes de transition (« capia », « tchapiô ») |
| PIE84 | « Wallonie-linguistique-fr.svg » (Wikimedia Commons, David Descamps, 2006, **domaine public**), qui cite pour la Belgique : Jean-Marie Pierret, « Les dialectes d'Ardenne et de Gaume », *Le grand livre d'Ardenne et de Gaume*, 1984, carte p. 238 | **contrôle** des sous-zones wallonnes (wallo-picard, namurois, liégeois, wallo-lorrain) |
| EPI25 | « Carte des variétés du picard » (Epi2025, Wikimedia Commons, CC BY-SA 4.0), même calage que pour la France (`picard-carta.py`, non modifié, exécuté par `belgica-picard.py`) | parler picard de chaque commune (Tournaisien, Borain… : famille rouchi) |
| WPDE | Wikipédia allemande : « Deutschsprachige Gemeinschaft » (canton d'Eupen : bas-francique/limbourgeois et ripuaire ; canton de Saint-Vith : francique mosellan et ripuaire), « Ripuarische Dialekte » (ripuaire au nord-est et au centre de l'aire germanophone), « Plattdeutsche Gemeinden » (Plombières, Welkenraedt, Baelen : même parler qu'à Lontzen, Eupen, Kelmis ; facilités dormantes), « Areler Land » (Arlon, Attert, Aubange, Martelange, Messancy ; sections luxembourgeoises de Hachy (Habay) et Tintange (Fauvillers)) | parlers germaniques, commune par commune |
| LEG | législation linguistique belge | facilités (Comines-Warneton, Mouscron, Flobecq, Enghien pour les néerlandophones ; Malmedy, Waimes pour les germanophones) |

L'*Atlas linguistique de la Wallonie* n'est pas disponible en ligne sous licence libre : la carte de Pierret (1984) le remplace comme contrôle.

## Méthode
1. Calage automatique de la carte Chapeau sur le contour des communes wallonnes (affinité puis déformation polynomiale) : écart médian 205 m (240 m après ajout des étiquettes), pour 72 m par pixel. Carte de Pierret calée de même (écart médian 500 m).
2. Les sous-zones wallonnes sont séparées par des pointillés : les tirets (couleur des traits, pas celle des lettres) sont épaissis jusqu'à se toucher, chaque zone est nommée par son étiquette (« ouest-wallon », « namurois », « liégeois », « sud-wallon »), la bande épaissie est partagée au plus proche.
3. Part de chaque zone dans chaque commune sur une grille de 150 m ; zone majoritaire ; `transicio` si la seconde zone d'une autre langue atteint 25 % (ou 30 % pour deux sous-zones wallonnes), ou si 30 % de la commune est sous l'étiquette « capia » ou « tchapiô » (classement extrapolé sous l'étiquette).
4. Contrôle Pierret : pour les communes wallonnes, la sous-zone concorde dans **166 cas sur 180** ; les désaccords sont dans la `nota` (Burdinne, Héron, Ohey, Hannut : liégeois chez Pierret ; Doische, Florennes : wallo-picard ; Gedinne : wallo-lorrain…).

## Résultat (261 communes)

| domaine | langue (dialecte) | parlers | communes |
|---|---|---|---|
| oïl | wallon (`valon`) | liégeois 76, namurois 55, ouest-wallon 31, sud-wallon 24 | 186 |
| | picard | Borain 31, Tournaisien 13, Circum-Lillois 3 (Comines-Warneton, Mouscron…), Lillois 1, Valenciennois 1, Avesnois 1 | 50 |
| | lorrain (`lorren`) | gaumais | 8 (Virton, Étalle, Meix-devant-Virton, Musson, Rouvroy, Saint-Léger, Tintigny, Florenville) |
| | champenois (`campanes`) | | 0 en majorité ; Vresse-sur-Semois 40 % (transition) |
| germanique | platdiets | Plombières, Welkenraedt, Baelen, Kelmis, Lontzen, Eupen | 6 |
| | ripuaire (`ripuari`) | Raeren, Büllingen, Bütgenbach | 3 |
| | francique mosellan (`francic_mosellan`) | Amel, Sankt Vith, Burg-Reuland | 3 |
| | luxembourgeois (`luxemborgues`) | Arlon, Attert, Martelange, Messancy, Aubange (pays d'Arlon) | 5 |

Transitions : 8 communes sous les étiquettes « capia » (Braine-le-Comte, Rebecq, Tubize, Ittre, Braine-le-Château, Enghien) et « tchapiô » (Sivry-Rance, Froidchapelle) ; 18 entre deux langues (dont Messancy, Aubange et Arlon luxembourgeois / gaumais, Chiny et Florenville gaumais / sud-wallon, Habay, Vresse-sur-Semois) ; 9 entre deux sous-zones wallonnes.

## Noms dans la langue du lieu
Titres des Wikipédias wallonne (wa, 185), picarde (pcd, 35) et luxembourgeoise (lb, 5 : Arel, Atert, Éibeng, Maartel, Miezeg), via Wikidata (CC0), sans la parenthèse d'homonymie, seulement dans la langue de la commune. Pas de nom gaumais, champenois ni allemand dialectal : nom officiel.

## Noms occitans (API de lo Congrès, 2026-10-10)
Connus : valon, luxemborgés, oèst, sud, meridional, oriental, occidental, Lièja. Repris de `SIG/oil/lengas-oil.json` : picard, lorren, campanés (absent du Basic). **Absents** : namurés, liegés, gaumés, ripuari, francic, mosellan, germanic, Valonia, Namur. Propositions : « valon de l'oèst », « namurés », « liegés », « valon del sud », « gaumés », « ripuari », « francic mosellan », « platdiets » (nom néerlandais gardé).
Endonymes wallons : seuls les titres de la Wikipédia wallonne sont repris (« walon do Coûtchant », « walon do Mitan », gaumais « gåmès », champenois « tchampnwès ») ; rien de sûr pour le liégeois et le sud-wallon.

## À valider par Romain
1. Le regroupement : wallon en 4 parlers (ou les appeler « wallon occidental, central, oriental, méridional ») ; gaumais rangé sous le lorrain comme en France.
2. Les parlers germaniques commune par commune (source générale, pas de carte) : surtout Eupen (platdiets ou ripuaire), Büllingen, Bütgenbach, Amel ; Aubange et Messancy (luxembourgeois ou gaumais).
3. Les communes wallonnes en transition « germanique » sur la carte : Dalhem et Aubel (probablement un décalage de la carte près de Fouron/Voeren), Waimes (minorité germanophone historique), Fauvillers (section luxembourgeoise de Tintange : justifiée).
4. Les noms occitans.

## Incertitudes
- La carte Chapeau est une carte de vulgarisation (le mot « chapeau ») : limites approximatives, sans source savante citée.
- Les étiquettes « capia » et « tchapiô » cachent la carte : les communes dessous sont classées par extrapolation.
- Arlon est en majorité francophone aujourd'hui (Wikipédia allemande, « Areler Land ») : classée luxembourgeoise au titre du parler traditionnel.
