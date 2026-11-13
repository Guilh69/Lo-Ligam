# E — Les 65 noms suspects des autres départements (12-11 au soir, session Sonnet)

## Résultat en une ligne

**Commit `c7d3cb06`, poussé sur master** (`c83bff94..c7d3cb06`). **2 noms masqués** sur 65 : Les Issards (09) et Lées-Athas (64), les deux seuls que lo Congrès contredit. **25 noms confirmés** par lo Congrès (09, 12, 31, 32, 81, 82). **38 noms** des départements non couverts (03, 11, 23, 34, 63, 87) : aucun n'a de mot français évident, **gardés et listés pour Romain**. Tests : 35 fichiers, 1 070 passés ; construction : code 0.

## Une correction de méthode importante (code sans zéro)

L'API top'Òc enregistre les codes INSEE des départements à zéro initial **sans le zéro** : l'Ariège est « 9122 », pas « 09122 ». Interroger « 09063 » répond « aucun toponyme » même pour une commune connue. Ma première passe sur l'Ariège a donc donné 9 absences **fausses** ; refaite avec « 9063 », « 9122 »…, elle donne 8 confirmés et 1 autre forme. **Aucun nom n'a été masqué sur la foi de la première passe.**

- **Le constat sur l'Ardèche (note D) tient** : je l'ai revérifié avec les codes sans zéro (7001, 7186 : toujours « aucun toponyme ») et par nom (« Incorrect department » pour `dep=07` et `dep=7`, l'API ne liste que 09, 12, 31, 32, 33, 40, 46, 47, 64, 65, 81, 82). Mon sondage de l'Ardèche utilisait « 07xxx » ; il n'aurait pu rien trouver de toute façon, mais la preuve solide est l'erreur de département.
- **Défaut du script du dépôt** : `app/scripts/verificar-oc.mjs --topo` envoie le code tel quel, donc `--topo 09145` répond à tort « pas trobat ». À corriger en retirant le zéro initial des codes à 5 chiffres commençant par 0 (une ligne). Je ne l'ai **pas** modifié (hors du périmètre demandé) ; c'est un correctif à part.

## Nombres par département

Critère pour les départements couverts : même forme que l'API, aux détails de typographie près (majuscules, apostrophe, trait d'union) = confirmé ; autre forme = masqué ; absence = gardé et listé ; erreur d'appel = jamais masqué (aucune n'est survenue : 27 appels, 0 erreur après la correction du code). Pour les non couverts : on ne masque que le français évident (Jean, sur, sous, lès, Saint, Sainte restés tels quels) ; « le » et « les » ne suffisent jamais.

| Dép. | Couvert par top'Òc | Suspects | Confirmés | Autre forme (masqués) | Sans réponse | Erreurs | Masqués | Gardés |
|---|---|---|---|---|---|---|---|---|
| 03 | non | 2 | - | - | - | - | **0** | 2 |
| 09 | oui | 9 | 8 | 1 | 0 | 0 | **1** | 8 |
| 11 | non | 8 | - | - | - | - | **0** | 8 |
| 12 | oui | 1 | 1 | 0 | 0 | 0 | **0** | 1 |
| 23 | non | 4 | - | - | - | - | **0** | 4 |
| 31 | oui | 12 | 12 | 0 | 0 | 0 | **0** | 12 |
| 32 | oui | 1 | 1 | 0 | 0 | 0 | **0** | 1 |
| 34 | non | 2 | - | - | - | - | **0** | 2 |
| 63 | non | 21 | - | - | - | - | **0** | 21 |
| 64 | oui | 1 | 0 | 1 | 0 | 0 | **1** | 0 |
| 81 | oui | 1 | 1 | 0 | 0 | 0 | **0** | 1 |
| 82 | oui | 2 | 2 | 0 | 0 | 0 | **0** | 2 |
| 87 | non | 1 | - | - | - | - | **0** | 1 |
| **Total** | | **65** | **25** | **2** | **0** | **0** | **2** | **63** |

## Les 2 noms masqués

| Dép. | Code | Commune | Nom écarté | Motif |
|---|---|---|---|---|
| 09 | 09145 | Les Issards | Les Eissarts | lo Congrès donne une autre forme (code 9145, confirmé par le nom de la commune) |
| 64 | 64330 | Lées-Athas | Les e Atàs | lo Congrès donne une autre forme : seul l'accent de « Lées » manque sur la carte (confirmé par le nom) |

Exemples de ce que répond l'API (deux seulement, par règle ; rien n'est écrit dans le dépôt) : pour Les Issards, une forme qui n'a aucun rapport avec « Eissarts » ; pour Lées-Athas, la forme avec l'accent. Le CSV garde le nom écarté tel qu'il était sur la carte et le motif `pas confirmat (top'Òc balha una autra forma)`, comme pour Laàs et Laà-Mondrans.

## Contrôles

- **Diff** : `09.json` et `64.json` : même nombre de géométries, arcs identiques, **seule la propriété `oc` de 09145 et de 64330 disparaît**, 0 autre écart ; les 8 autres fichiers de contours ne sont pas touchés (Git ne voit que 3 fichiers de données modifiés). `noms.json` : mêmes clés, 10 042 entrées, **2 entrées passent à `null`, 0 autre modification** (null 235 → 237).
- `npm test` : 35 fichiers, 1 070 tests passés. `npm run build` : code 0.
- **Captures** (pilote Firefox sans fenêtre, 1 830 × 1 000, interface occitane, satellite, centre 43,079 N 1,736 E, zoom 13, barre « 1,5 km ») : `E-captures/autres-ariege-avant.png` et `E-captures/autres-ariege-apres.png`. Avant : « Les Eissarts » est écrit près du centre ; après : il a disparu ; « Les Pujòls » (confirmé) et tous les autres noms de la vue sont intacts. Lées-Athas (Pyrénées-Atlantiques) n'est pas dans le cadre ; je n'ai pas fait de seconde capture (même mécanisme, un seul nom de plus).
- Copie de travail `.claude/worktrees/noms-ardecha-bceefa` : entrée temporaire de `launch.json` retirée, serveur arrêté.

## Les 25 noms confirmés par lo Congrès (gardés)

Ils portent un « Le » / « Les » que lo Congrès écrit de la même façon ; la règle de la session cheffe est confirmée dans les faits : en 09 et 31, « Le » est bien l'article local (8 sur 9 en 09, 12 sur 12 en 31 confirmés, ainsi que 12, 32, 81 et 82).

| Dép. | Code | Commune | Nom de la carte |
|---|---|---|---|
| 09 | 09063 | Le Bosc | Le Bòsc |
| 09 | 09231 | Le Port | Le Pòrt |
| 09 | 09079 | Carla-Bayle | Le Carlar de Baile |
| 09 | 09181 | Le Mas-d'Azil | Le Mas d'Asil |
| 09 | 09229 | Le Peyrat | Le Peirat |
| 09 | 09281 | Sautel | Le Sautèlh |
| 09 | 09080 | Carla-de-Roquefort | Le Carlar de Ròcafòrt |
| 09 | 09238 | Les Pujols | Les Pujòls |
| 12 | 12172 | Le Nayrac | Le Nairac |
| 31 | 31082 | Bourg-Saint-Bernard | Le Borg de Sant Bernat |
| 31 | 31418 | Pin-Balma | Le Pin de Balmar |
| 31 | 31488 | Saint-Jean | Sent Joan le Vièlh |
| 31 | 31180 | Falga | Le Falgar |
| 31 | 31570 | Vaux | Le Bauç |
| 31 | 31120 | Le Castéra | Le Casterar |
| 31 | 31234 | Le Grès | Le Gres |
| 31 | 31093 | Le Burgaud | Le Burgau |
| 31 | 31419 | Le Pin-Murelet | Le Pin Murelet |
| 31 | 31193 | Le Fousseret | Le Hosseret |
| 31 | 31181 | Le Fauga | Le Haugar |
| 31 | 31292 | Lescuns | Les Cunhs |
| 32 | 32207 | Leboulin | Le Bolin |
| 81 | 81055 | Les Cammazes | Les Capmases |
| 82 | 82105 | Mas-Grenier | Le Mas Granièr |
| 82 | 82036 | Le Causé | Le Cause |

## Les 38 noms laissés à Romain (départements non couverts)

Rien dans ces noms n'est du français évident : aucun `Jean`, `sur`, `sous`, `lès`, `Saint`, `Sainte`. Ils sont gardés. La colonne « Wikidata » est indicative (voir la note D-bis : Wikidata n'est pas une autorité).

### À relire en priorité (13)

| Dép. | Code | Commune | Carte | Wikidata | Pourquoi |
|---|---|---|---|---|---|
| 03 | 03043 | Broût-Vernet | Brot e Le Vernet | Brot e Vernet ; Broût-Vernet ; Brot e Le Vernet | carte « Brot e Le Vernet » ; Wikidata a « Brot e Vernet » |
| 11 | 11221 | Les Martys | Les Martins | Les Martins | le nom français est « Les Martys », la carte écrit « Les Martins » (graphie à demi française ?) ; Wikidata a la même forme |
| 11 | 11074 | Les Cassés | Les Casses | Les Casses | accent : « Les Cassés » en français, « Les Casses » sur la carte ; Wikidata a la même |
| 11 | 11277 | Pécharic-et-le-Py | Puègaric e Le Pin | Puèg Aric e Le Pin ; Puèg-Aric e Le Pin | carte « Puègaric e Le Pin » ; Wikidata a « Puèg Aric e Le Pin » |
| 11 | 11357 | Saint-Martin-le-Vieil | Sant Martin le Vièlh | Sant Martin le Vièlh | mélange « Sant Martin le Vièlh » (« le » + « Vièlh » occitan) ; Wikidata a la même |
| 11 | 11358 | Saint-Martin-Lys | Sant Martin de Les | Sant Martin de Les | « Lys » devenu « Les » : forme à vérifier ; Wikidata a la même |
| 11 | 11223 | Mas-des-Cours | Le Mas | Le Mas | le nom français est « Mas-des-Cours », la carte écrit seulement « Le Mas » ; Wikidata a la même |
| 11 | 11414 | Villar-en-Val | Le Vilar en Val | Le Vilar en Val | « Le Vilar en Val » : « en » est aussi du français ; Wikidata a la même |
| 23 | 23074 | Le Donzeil | Sent Saupise le Donselh | Sent Saupise le Donselh | la commune s'appelle « Le Donzeil » et la carte écrit « Sent Saupise le Donselh » (forme d'une autre dénomination ?) ; Wikidata a la même |
| 23 | 23095 | Le Grand-Bourg | Le Borg (de Salanhac) | Le Borg ; Le Grand Borg | parenthèse « (de Salanhac) » ; Wikidata a « Le Borg » et « Le Grand Borg » |
| 63 | 63108 | Le Cheix-sur-Morge | Le Chèir | Le Cheix-sur-Morge ; Le Chèir de Mòrja | carte « Le Chèir » ; Wikidata a aussi « Le Chèir de Mòrja » |
| 63 | 63317 | Saint-André-le-Coq | Sent Andrè le Jau | Saint-André-le-Coq ; Sent André | carte « Sent Andrè le Jau » ; Wikidata a « Sent André » |
| 63 | 63448 | Le Vernet-Chaméane | Le Varnet e Chamiana | Vernet-la-Varenne ; Le Vernet la Varena ; Le Vernet e Chameana ; Le Vernet e Chamiana | Wikidata a plusieurs variantes, dont « Vernet-la-Varenne » (nom d'une autre commune) |

### Probablement légitimes (25) : à faire confirmer d'un coup par Romain, département par département

- **Puy-de-Dôme (63) : « le » est écrit 21 fois sur 21** (« Le Borg de Lastic », « Murat e le Caire », « Sauset le Freid »…), en tête de nom, entre deux noms ou en épithète, à la fois par la carte et par Wikidata. Un défaut de source serait peu probable sur une telle régularité ; cela correspond plutôt à un usage local de l'article. Ni l'API ni moi ne pouvons le confirmer : **une seule question à Romain pour tout le département**.
- **Hérault (34) :** « Castèlnòu de Les » et « Pradas de Les » : « Les » est le nom occitan du Lez (la rivière), ce n'est pas du français. Wikidata a la même forme.
- **Haute-Vienne (87) :** « Le Daurat » (Le Dorat) ; même forme chez Wikidata.
- **Allier (03) :** « Le Maiet d'Escòla » ; Wikidata a « Lo Maiet d'Escòla » à côté.
- **Aude (11) :** « Les Brunèls » ; même forme chez Wikidata.

| Dép. | Code | Commune | Carte | Wikidata |
|---|---|---|---|---|
| 03 | 03164 | Le Mayet-d'École | Le Maiet d'Escòla | Le Mayet-d'École ; Lo Maiet d'Escòla |
| 11 | 11054 | Les Brunels | Les Brunèls | Les Brunèls |
| 23 | 23183 | Saint-Avit-le-Pauvre | Sent Avit le Paubre | Sent Avit le Paubre |
| 23 | 23029 | Le Bourg-d'Hem | Le Borg d'Hem | Le Borg d'Hem |
| 34 | 34057 | Castelnau-le-Lez | Castèlnòu de Les | Castèlnòu de Les ; Castelnau-le-Lez |
| 34 | 34217 | Prades-le-Lez | Pradas de Les | Pradas de Les |
| 63 | 63048 | Bourg-Lastic | Le Borg de Lastic | Bourg-Lastic ; Le Borg Lastic |
| 63 | 63292 | Puy-Saint-Gulmier | Le Puèi Sent Gulmèir | Puy-Saint-Gulmier ; Le Puèi Sent Gulmèir |
| 63 | 63246 | Murat-le-Quaire | Murat e le Caire | Murat-le-Quaire ; Murat e le Caire |
| 63 | 63407 | Saulzet-le-Froid | Sauset le Freid | Saulzet-le-Froid ; Sauset le Freid |
| 63 | 63449 | Le Vernet-Sainte-Marguerite | Le Vernet Senta Margarita | Le Vernet-Sainte-Marguerite ; Le Vernet Senta Margaida |
| 63 | 63234 | Montaigut-le-Blanc | Montagut le Blanc | Montagut lo Blanc ; Montagut le Blanc |
| 63 | 63237 | Montel-de-Gelat | Le Montelh Dejalat | Montel-de-Gelat ; Le Montelh Dejalat |
| 63 | 63293 | Le Quartier | Le Quartièr | Le Quartier ; Le Quartièr |
| 63 | 63157 | Fayet-le-Château | Faiet le Chastèl | Faiet lo Chastèl ; Fayet-le-Château ; Faiet le Chastèl |
| 63 | 63230 | Le Monestier | Le Monestèir | Le Monestier ; Le Monestèir |
| 63 | 63231 | La Monnerie-le-Montel | La Monèria e le Montelh | La Monnerie-le-Montel ; La Moneiriá e le Montelh |
| 63 | 63006 | Anzat-le-Luguet | Anzac e le Luguet | Anzac dau Luguet ; Anzac e le Luguet |
| 63 | 63440 | Valbeleix | Le Bòsc Belet | Valbeleix ; Le Bòsc Belet |
| 63 | 63158 | Fayet-Ronaye | Le Faiet e Ronaias | Fayet-Ronaye ; Le Faiet e Ronaias |
| 63 | 63323 | Saint-Bonnet-le-Bourg | Sent Bonet le Borg | Sent Bonet lo Borg ; Le Borg Sent Bonet |
| 63 | 63079 | Champagnat-le-Jeune | Champanhac le Joine | Champanhat lo Jove ; Champanhac le Joine |
| 63 | 63052 | Le Breuil-sur-Couze | Le Bruelh de Cosa | Le Breuil-sur-Couze ; Lo Bruelh ; Le Bruelh de Cosa |
| 63 | 63054 | Le Broc | Le Bròc | Le Broc ; Le Bròc |
| 87 | 87059 | Le Dorat | Le Daurat | Le Daurat |

## La suite

1. **Une question à Romain** sur l'article « le » dans le Puy-de-Dôme (63), et un coup d'œil à la liste « à relire en priorité » (13 noms) ; si Romain dit qu'une forme est fausse, le mécanisme est le même (une ligne dans `noms-escartats.csv`).
2. **Correctif du script `verificar-oc.mjs --topo`** pour les codes à zéro initial (une ligne) : à faire dans un commit à part.
3. **Les 25 « confirmés » et les départements 09, 31, 12, 32, 81, 82, 64 en entier** : seuls ces 65 noms ont été contrôlés ; les autres communes de ces départements n'ont pas été passées à l'API (hors périmètre). L'API peut le faire par lot, par code sans zéro.
