# Couche « Pays traditionnels » (1789) : sources, choix et doutes

Fabriquée par `SIG/cadena/paises.py` (voir `SIG/cadena/LEGISSETZ-ME.md`), à partir de
la table `SIG/paises/taula-paises.csv`, qui est la référence : on la corrige, puis on
relance le script. Sortie : `app/static/data/paises-1789.json`.

## Ce que la couche montre, et ce qu'elle ne montre pas

- Chaque unité est une **juridiction électorale de 1789** (sénéchaussée, bailliage,
  siège royal, « pays », comté, élection du Dauphiné…), telle que la donne l'atlas
  d'Armand Brette (1904), numérisé par Gay, Gobbi et Goñi (2024).
- Ce ne sont **pas des pays dessinés pour eux-mêmes**. Le champ `pais_fr` ne nomme un
  pays que lorsqu'une source le rattache à la juridiction (21 unités sur 107). Même
  alors, l'étendue dessinée est celle de la juridiction en 1789, pas forcément celle
  du pays, dont les limites varient selon les auteurs.
- Plusieurs pays connus **n'existent pas comme unités** en 1789 : l'Albigeois (Albi est
  dans la sénéchaussée de Carcassonne, Gaillac, Lavaur et Rabastens dans celle de
  Toulouse, Castres a la sienne), la Lomagne (Lectoure est dans la sénéchaussée
  d'Armagnac, Beaumont-de-Lomagne dans l'unité de Rivière-Verdun), le Nébouzan
  (Saint-Gaudens dans le Comminges, Montréjeau dans Rivière-Verdun), le Fenouillèdes et
  le pays de Sault audois (dans la sénéchaussée de Limoux). Ces rattachements de villes
  viennent d'un test de points dans les contours de Gay et al. (script de contrôle,
  octobre 2026), pas d'une source historique.

## Niveau retenu

Les données offrent :
1. un contour par juridiction (435 en France), **principale ou secondaire, chacune avec
   son propre contour** ; le rang (principale, secondaire) et la principale de
   rattachement sont donnés (`BAIL_RK`, `BAIL_SUP`) ;
2. donc, par regroupement, le niveau des seules juridictions principales (une
   principale avec ses secondaires) ;
3. la généralité de chaque juridiction (33 généralités chez Brette) ;
4. les paroisses de Cassini en points (43 792), qui ne portent dans nos fichiers que le
   territoire (royaume ou terre étrangère), pas la juridiction (le Dataverse propose une
   version en points des bailliages, non téléchargée ici) ;
5. aucune couche de villes en surfaces : seulement le chef-lieu de chaque juridiction
   (point et noms).

**Choix : le niveau 1**, chaque juridiction avec son contour. C'est le plus fin et le plus
proche de l'échelle des pays : le niveau 2 refait presque les provinces (Quercy = Cahors
et ses 5 secondaires, Périgord = Périgueux et 2 secondaires, Bigorre avec le Rustan),
le niveau 3 est plus grossier encore. Au niveau 1, des pays apparaissent tels quels
(Lauragais, Gévaudan, Couserans, Bigorre, Rustan, Soule, Béarn, Carladès…).

Rappel des définitions (Gay et al. 2024, §4.3) : une juridiction est « principale » si
elle avait déjà formé une circonscription aux États généraux de 1614, « secondaire »
sinon ; c'est un rang formel, sans autre différence.

## Unités retenues

- 107 unités : 98 juridictions de Brette, le comté de Sault et 7 territoires hors du
  royaume (État d'Avignon, Comtat Venaissin, Bidache, comté de Nice, Monaco, Val
  d'Aran, vallées d'Italie), ces derniers repris tels quels de la couche des provinces.
- Même règle que les provinces : une unité est gardée si au moins 5 % de sa surface est
  dans le domaine de la langue, sans la découper.
- Règle ajoutée : une unité sous les 5 % est gardée **en entier** si une de ses enclaves
  ferait sinon un trou dans le domaine. Deux cas : bailliage de Châteauroux (4,4 % ;
  enclave de 149 km² près de 2,32 E, 46,47 N, presque toute dans le domaine) et
  sénéchaussée de Poitiers (2,3 % ; enclaves de Charente limousine, 30 km² de trous).
  Conséquence visible : tout le Poitou de la sénéchaussée de Poitiers est dessiné,
  comme dans la couche des provinces. **Choix à confirmer par Romain** (autres
  possibilités : laisser les trous, ou ne dessiner que les enclaves).
- Fichier : 174 Ko (43 Ko compressé). Simplification 1,1 km pour les unités surtout
  dans le domaine, 3 km pour les autres, coordonnées arrondies à 3 décimales (environ
  100 m), comme les provinces.

## Pays retenus (21) et nature de la preuve

« Titre » : le pays est nommé dans le nom original de la juridiction chez Brette
(champ `bailliage_name_brette` des données). « B.4 » : Gay et al. 2024, tableau B.4,
cas 1, « le nom de la juridiction est une région ».

| Unité (id) | Pays | Preuve |
|---|---|---|
| Sénéchaussée d'Albret à Nérac (003) | Albret | Titre + B.4. La sénéchaussée de Casteljaloux, secondaire de celle-ci, est à part |
| Sénéchaussée d'Armagnac à Lectoure (020) | Armagnac | Titre + B.4. Auch, Vic-Fezensac et Mirande sont dans la sénéchaussée d'Auch |
| Pays des Quatre-Vallées (023) | Quatre-Vallées | Titre + B.4 |
| Comté de Comminges, assemblé à Muret (067) | Comminges | Titre + B.4. Saint-Bertrand-de-Comminges est dans l'unité de Rivière-Verdun |
| Pays de Couserans (068) | Couserans | Titre + B.4 |
| Bailliage de Forez à Montbrison (097) | Forez | Titre + B.4 (12,9 % dans le domaine) |
| Pays de Rivière-Verdun, Gaure, Launac et Marestaing (181) | Rivière-Verdun | Titre + B.4. Quatre pays réunis, plusieurs morceaux |
| Sénéchaussée du Haut-Vivarais (240) | Haut-Vivarais | Titre + B.4 |
| Sénéchaussée de Lauraguais, séant à Castelnaudary (243) | Lauragais | Titre + B.4 ; Wikipèdia oc « Lauragués », d'après Sabarthès 1912 |
| Bailliage de Gévaudan, séant à Mende (246) | Gévaudan | Titre + B.4 |
| Sénéchaussée du Bas-Vivarais (251) | Bas-Vivarais | Titre + B.4 |
| Pays de Soule (298) | Soule | Titre + B.4 |
| Pays de Bigorre (301) | Bigorre | Titre + B.4 |
| Pays de Rustaing (302) | Rustan | Titre + B.4 (secondaire de la Bigorre) |
| Royaume de Navarre (311) | Basse-Navarre | Titre + B.4 ; partie française de la Navarre |
| Souveraineté de Béarn (443) | Béarn | Titre + B.4 |
| Comté de Foix (Sénéchaussée de Pamiers) (299) | Comté de Foix | Titre seul (absent du tableau B.4, dont le nom court est « Pamiers ») |
| Sénéchausée de Guéret (Haute-Marche) (124) | Haute-Marche | Titre seul |
| Comté de Sault (territoire IX) | Comté de Sault | Nom du territoire chez Brette (Gay et al., tableau B.2) |
| Bailliage d'Ustaritz (pays des Basques) (294) | Labourd | Titre (« pays des Basques ») + Wikipédia « Labourd », d'après M. Lafourcade 1989 : le bailliage du Labourd siège à Ustaritz. **À recouper** |
| Bailliage de Vic-en-Carladez (094) | Carladès | Pays dans le nom du chef-lieu + Wikipédia « Carladès », d'après A. Imberdis 1863 et Expilly. Partie auvergnate seulement (Mur-de-Barrez est en Rouergue). **À recouper** |

## Pistes non retenues (pas de source suffisante)

- **Velay** (sénéchaussée du Puy-en-Velay, 249) : aucune source lue ne dit que la
  sénéchaussée couvrait tout le Velay et lui seul. Brioude et Langeac sont dans le
  bailliage de Riom. À vérifier, par exemple dans « Paroisses et communes de France »,
  volume Haute-Loire.
- **Basse-Marche** (Le Dorat 122, Bellac 123) : Wikipédia (« Marche (province) ») le dit
  sans source.
- **Lannes** (Dax 102, Bayonne 103, Saint-Sever 104) : « sénéchaussée des Lannes » est le
  nom ancien de la juridiction (Wikipédia, d'après P. Hourmat 1986, A. Zink, S. Lerat
  1983), plutôt qu'un nom de pays.
- Bazadais (Bazas), Agenais (Agen), Condomois (Condom), Marsan (Mont-de-Marsan),
  Sarladais (Sarlat), Toulousain, Biterrois, Nîmois…, vallée de Barcelonnette : pays
  nommés d'après la ville, **non recherchés** ; rien n'est affirmé.
- Rouergue, Quercy, Périgord, Limousin, Auvergne : partagés entre plusieurs
  juridictions, aucune n'est un pays nommé.
- Élections du Dauphiné (Romans, Grenoble, Valence, Gap, Montélimar) : circonscriptions
  choisies par les États du Dauphiné en 1789 (Gay et al. §2.2), pas des pays.

## Noms occitans (colonne `oc`) : tous à valider par Romain

Règle : `oc` est le nom de l'étiquette. Si l'unité a un pays (`pais_fr`), c'est le nom
occitan du pays ; sinon celui du chef-lieu qui donne son nom à la juridiction (nom court
de Gay et al.). Le champ `fr` du GeoJSON suit la même règle. Une forme dont la source
commence par « Proposition » n'entre dans la carte qu'avec `a_validar = non` (même
règle que les provinces).

Sources, dans cet ordre :
1. **BdTopoc 2023**, Institut d'Estudis Occitans, data.gouv.fr, licence ODbL :
   https://www.data.gouv.fr/datasets/basa-de-donadas-noms-de-lespaci-occitan-base-de-donnees-nom-de-lespace-occitan
   (fichier déjà téléchargé par `comunas.mjs`, recherche par code INSEE).
2. **OpenStreetMap**, étiquette `name:oc` des communes (ODbL), fichiers de `comunas.mjs` ;
   la source déclarée est le plus souvent BdTopoc, donc pas une confirmation
   indépendante. En cas de désaccord, la forme de la carte des communes (OpenStreetMap
   d'abord) est reprise et le désaccord noté.
3. **Wikidata** (CC0), libellés occitans : Lauragais Q1500011, Armagnac Q676745, Carladès
   Q1041589, Haut-Vivarais Q3128419, Bas-Vivarais Q12948134, Haute Marche Q3128545,
   Labourd Q671023 ; les autres comme dans `SIG/provincias/noms-a-validar.csv`.
4. **Wikipèdia en occitan** (CC BY-SA), à recouper : « Labrit » (Albret), « Arrostanh »
   (Rustan), « Lauragués », « Gaure (parçan) », « Tèrras adjacentas de Provença » (comtat
   de Saut), « Bigòrra », « Hauts Pirenèus », « Peiret » (Quate Vaths), « Verdun de
   Garona », « Sent Sardòs », « Borèth », « Canton de Tria » (Ribèra-Verdun).

Le Topòc de Lo Congrès (https://dicodoc.eu/oc/toponimia) n'a pas été interrogé : son
interface de programmation demande une clé. Romain peut y vérifier les formes à la main.

Points à trancher :
- **Désaccords** BdTopoc / OpenStreetMap : Usson (« Usson » / « Içon »), Montaigut
  (« Montagut » / « Montagut de Combralha »), Cahors (« Caors » / « Cáors »),
  Clermont-Ferrand (« Clarmont d'Auvèrnha » / « Clarmont-Ferrand »).
- **Formes raccourcies** : « Briva » (BdTopoc « Briva (La Galharda) »), « Sarlat »
  (BdTopoc « Sarlat e la Canedat »).
- **Une seule source** (OpenStreetMap) : Moulins « Molins » (source déclarée :
  Wikipédia), Draguignan, Toulon, Brignoles, Hyères (le Var manque dans BdTopoc 2023),
  Castelmoron-d'Albret, Montmorillon.
- **Aucune forme** : Dun-le-Roi, Issoudun, Châteauroux, Poitiers (hors du domaine),
  Le Dorat (OpenStreetMap donne « Le Daurat », avec l'article français).
- **Gascon ou commun** : « Quate Vaths » (formes de Wikipèdia) alors que la couche des
  provinces propose « Quatre Valadas » ; « Arrostanh » pour le Rustan.
- **Arles** : deux unités ont Arles pour chef-lieu (sénéchaussée, 384 ; ville et
  terroir, 385), toutes deux « Arle » en occitan ; le français les distingue entre
  parenthèses.
- **Comté de Foix** : « Comtat de Fois », comme les provinces (Romain y demandait si
  « Fois » seul suffit) ; Wikidata a aussi « País de Fois ».
- **Propositions sans source** reprises des provinces, absentes de la carte : État
  d'Avignon, Bidache.
- Si l'on veut nommer le type de juridiction en occitan : l'article de Wikipèdia en
  occitan « Senescauciá e bailiatge » donne senescauciá (variantes senescalciá,
  seneschauciá…) et bailiatge ; à vérifier dans le dicodòc.

## Limites des données

- Brette prévient que ses cartes indiquent à quelle juridiction appartient une paroisse,
  pas des limites exactes (Gay et al. 2024, §2.3).
- Gay et al. ont attribué à la main les communes de 2021 : une commune issue de fusions
  peut mêler deux juridictions, ce qui rend quelques limites inexactes (§3).
- Beaucoup d'unités ont des enclaves, parfois loin du chef-lieu (Riom et Clermont,
  Rivière-Verdun, Comminges…) : c'est la réalité de 1789, pas une erreur de dessin.
- Le comté de Sault est hors du royaume pour Brette (territoire IX) ; la couche le
  rattache à la Provence, comme les provinces (voir `SIG/provincias/taula-bailliages.csv`).
- La Soule a 82 % de sa surface dans le domaine tel que le dessine `limits-carta.json` :
  cela dépend de la couche du domaine, pas de cette couche-ci.

## Références

- Gay, V., Gobbi, P. E., Goñi, M. (2024). « The Atlas of Local Jurisdictions of Ancien
  Régime France ». Journal of Historical Geography, 84, 49-60.
  https://doi.org/10.1016/j.jhg.2024.03.008. Version de travail (2023) :
  https://dipot.ulb.ac.be/dspace/bitstream/2013/365275/3/2023-21-GAY_GOBBI_GONI-the-atlas.pdf
- Gay, V., Gobbi, P. E., Goñi, M. (2024). « Bailliages in 1789 France », Harvard
  Dataverse, version 2.0, https://doi.org/10.7910/DVN/T8UXHK, licence CC BY 4.0.
- Brette, A. (1904). Atlas des bailliages ou juridictions assimilées ayant formé unité
  électorale en 1789. Paris, Imprimerie nationale (texte numérisé par Sciences Po,
  ARK 46513/sc16qxv1, d'après Gay et al.).
- Institut d'Estudis Occitans (2023). BdTopoc, data.gouv.fr, ODbL (lien plus haut).
- Wikipédia, articles « Labourd », « Carladès », « Sénéchaussée des Lannes », « Marche
  (province) », « Velay » (points d'entrée seulement ; références citées dans la table).
