# Sources de vilas-arpitan.json

2026-10-08. `vilas-arpitan.json` : 200 lieux (120 FR, 57 CH, 23 IT ; renc 1 = 13, 2 = 25, 3 = 49, 4 = 113), un objet par ligne, triés par rang puis population.

## Champs

| champ | contenu |
|---|---|
| `nom_frp` | nom arpitan, graphie de référence (ORB large), source dans `font_nom` |
| `nom_oficial` | nom officiel : français (France, Suisse, Vallée d'Aoste ; « Aoste / Aosta » bilingue), italien (Piémont, Pouilles) |
| `nom_fr` | nom français quand l'officiel est italien (Suse, Chanoux, Jaillons, Novalaise, Ussel) |
| `lat`, `lon` | Wikidata (P625), arrondi à 4 décimales |
| `renc` | 1 à 4, voir plus bas |
| `dialecte`, `dialecte2` | nom français du dialecte (provisoire, voir plus bas) ; `dialecte2` = autre rattachement possible |
| `pop`, `pop_an` | Wikidata (P1082), valeur la plus récente et son année (France 2023, Italie 2023, Suisse 2018 à 2024) |
| `estat` | FR, CH, IT |
| `font` | élément Wikidata `Qxxx` (coordonnées et population, CC0) |
| `font_nom` | page(s) de la Vouiquipèdia en arpitan qui donnent le nom, avec numéro de révision |
| `variantes` | autres formes relevées dans ces sources (53 lieux) |
| `nom_oc_a_validar`, `font_oc` | proposition occitane pour la légende (11 lieux de rang 1 ou 2) : titre de l'article de la Vikipèdia occitane. **À valider par Romain** |
| `incertitud` | ce qui reste à vérifier (32 lieux) |

## Sources

- **Noms arpitans** : Vouiquipèdia en arpitan (frp.wikipedia.org), écrite en ORB (modèle « Grafia RèfB » en tête des articles ; listes de communes titrées « ORB lârge »). Pages lues le 2026-10-08 par l'API, révisions citées dans `font_nom` :
  - les articles des communes (174 noms viennent au moins d'un article) ;
  - les listes de communes : En (rev. 229781), Isera (228922), Lêre (231957), Rôno (231736), mètropola de Liyon (229335), Savouè-d'Amont (228713), Savouè-d'Avâl (231779), cantons de Geneva (229731), Nôchâtél (232152), Vôd (231123), Valês (231122), Fribôrg (231116), Vâl d'Aoûta (231930), comenes arpitanes du Piemont (217209) ;
  - la page « Veles d'Arpetania » (229777), qui range aussi Lons, Pontarlier (lien en graphie française ; l'article dit Pontarliér) et Sent-Amôr parmi les villes arpitanes de Franche-Comté ;
  - la liste des dialectes de l'article « Arpetan » et les articles de dialectes (Forésien, Biôjolês, Jurassien, Friborgês, Valâdes arpetanes...).
  - Je n'ai pas pu consulter directement le dictionnaire de Stich ni le site de l'Aliance culturela arpitana : les formes ORB passent par la Vouiquipèdia, qui les applique.
- **Coordonnées, population, nom officiel** : Wikidata, CC0, requêtes SPARQL légères du 2026-10-08.
- **Proposition occitane** : titres de la Vikipèdia occitane (via Wikidata). Retenus seulement s'ils diffèrent du nom officiel : Lion, Genèva, Sant Estève, Grenòble, Lausana, Anecí, Chamberí, Borg de Bressa, Roana, Macon, Viana.
- **Contrôle (jamais source)** : carte de l'Atlas sonore LIMSI/LISN (`SIG/Limsi/`, CC BY-NC-SA), polygone « frp », qui ne couvre que la France. Les 120 lieux français y tombent tous en arpitan, sauf Vif, Saint-Marcellin et La Mure (occitans pour LIMSI, voir plus bas) et Évian (point dans le lac, hors polygone).

## Choix du nom

Pour chaque lieu, j'ai comparé jusqu'à cinq formes : titre de l'article, nom en gras de sa première ligne, liste des communes, page « Veles d'Arpetania », libellé frp de Wikidata. La forme la plus fréquente gagne ; à égalité, le titre de l'article (dernier choix éditorial). Les autres formes vont dans `variantes`.

Cas réglés à la main (source dans `font_nom`) :
- **Nôchâtél** (Neuchâtel) : l'article s'intitule « N'châtél » mais sa première ligne, la liste du canton et « Veles d'Arpetania » donnent Nôchâtél.
- **Sent-Jian-de-Môrièna** et **Bôrg-Sant-Mori** : formes complètes données par la première ligne de l'article (« Sent-Jian » et « Lo Bôrg » y sont des formes courtes ; « Lo Bôrg » se confondrait avec Bôrg, Bourg-en-Bresse).
- **Lons**, **Pôlegni** : articles propres (celui de Poligny est rattaché dans Wikidata à un doublon).
- **Sant-Gllôdo** (Saint-Claude) : article « Jurassien » ; pas de fiche de commune.
- **Sant-Chamond** (Saint-Chamond, 35 600 hab.) : seulement mentionné dans le texte de deux articles ; la liste de la Loire met « xx ». Signalé incertain.
- **Novalêse**, **Usei** (Piémont) : liste piémontaise, graphie locale (« ORB sarrâye ») et non ORB large.

## Choix des lieux

- **Domaine** : France (Rhône et métropole de Lyon, Loire, Ain, Isère, Savoie, Haute-Savoie ; Jura, Doubs et Mâconnais à la limite nord), Suisse romande sauf canton du Jura et Jura bernois (oïl), Vallée d'Aoste, vallées arpitanes du Piémont, Faeto et Celle di San Vito (Pouilles).
- **Exclus** : communes germanophones (Brigue, Naters, Viège, Zermatt, Loèche, Morat, Guin) et walser (Gressoney, Issime) ; communes d'oïl selon LIMSI (Besançon, Louhans, Pont-de-Vaux) ; Ivrée et Rivoli (piémontais) ; Bâgé-Dommartin (seul le nom de l'ancienne Bâgé-la-Ville est sourcé) ; Ceres (graphie incertaine) ; communes déléguées d'Annecy.
- **Limite sud** : chaque point a été testé contre le domaine occitan de la carte (`limits-carta.json`, anneaux pair-impair) et contre les communes occitanes (`static/data/comunas/`). Aucun des 200 lieux n'est dans le domaine occitan. Le plus proche d'une ville occitane de la carte : Lo Chambon (Le Chambon-Feugerolles), à 2,8 km de Frominiu (Firminy).
- **Rang** : même logique que l'occitan et le catalan. 1 = métropole ou capitale d'un grand dialecte (Liyon, Geneva, Sant-Etiève, Grenoblo, Losena, Èneci, Chambèri, Nôchâtél, Bôrg, Fribôrg, Sion, Aoûta, et Fayéte pour le faetar, comme l'Alguer pour le catalan) ; 2 = grande ville ou chef-lieu, un repère par grande zone ; 3 = sous-préfecture, chef-lieu de district ou ville moyenne ; 4 = le reste. Si l'assemblage retient le jurassien comme dialecte, Lons ou Sant-Gllôdo peut passer en rang 1.

## Dialectes (provisoires)

Noms français des dialectes de la liste de la Vouiquipèdia frp (article « Arpetan », découpage par entités culturelles, pas par isoglosses) : lyonnais, beaujolais, forézien, roannais, bressan, dombiste, bugeysan, savoyard, dauphinois, jurassien, burgondan, mâconnais (transition vers l'oïl), genevois, vaudois, fribourgeois, neuchâtelois, valaisan, valdôtain, arpitan du Piémont, faetar. Rattachement d'après le pays que l'article déclare (« arpetana du Forês », « de la Domba », « du Velin en Dârfénât »...) ou d'après le département, le canton ou la vallée. L'assemblage fera la correspondance avec la classification retenue, puis le recalcul par point dans polygone, comme pour l'occitan.

## Incertitudes (champ `incertitud`)

- **Limite sud, Isère** : Viu (Vif), Sant-Marcellin, La Mura (La Mure). Hors du domaine occitan de la carte et nommés dans la liste frp de l'Isère, mais occitans pour LIMSI. Stich (cité par Wikipédia fr) met la limite au Drac, entre Trièves et Matheysine, ce qui rend La Mure arpitane.
- **Limite nord** : Lons, Sant-Gllôdo, Champagnôla, Pôlegni, Sâlins, Sent-Amôr, Pontarliér (arpitans pour la Vouiquipèdia frp et LIMSI ; Wikipédia fr ne retient qu'« une partie de la Franche-Comté ») ; Mâcon et La Chapèla-de-Guinchê (mâconnais, dialecte de transition).
- **Pays de Gex** (Gèx, Sant-Genés-Polyi, Farnê, Digouona) : savoyard ou genevois, à trancher.
- **Velin** (Vilorbana, Venécié, Vâls-en-Velin, Sant-Priét, Mêsiô) : lyonnais par l'agglomération, dauphinois par l'histoire (`dialecte2`).
- **Nêrtrâblo** (Noirétable) : l'article dit « probâblament arpetana ». **Vâr-de-Giér** (Rive-de-Gier) : l'article hésite sur la graphie.
- **Piémont** : Jalyon (Giaglione) est à 1 km du domaine occitan (Chiomonte) : vérifier le raccord.

## Pour le tracé de la frontière avec l'occitan (à l'attention de l'assemblage)

Écarts entre la carte et le contrôle LIMSI, commune par commune (population au moins 1 800 ou article frp) :
- **Hors du domaine occitan de la carte, mais occitanes pour LIMSI** : Firminy, Unieux, Fraisses, Saint-Maurice-en-Gourgois, Saint-Romain-le-Puy (à 13 km de la limite), Vif, Saint-Georges-de-Commiers, Le Gua, Saint-Marcellin, Chatte, Saint-Sauveur, Autrans-Méaudre, La Mure. **Firminy pose un vrai problème** : la carte l'affiche déjà comme ville occitane (Frominiu, dans `LUOCS`) alors que son point tombe hors du domaine occitan (à 1,2 km). Le Gua est dans les communes occitanes mais son point tombe hors du domaine. À trancher avant de donner ce vide à l'arpitan.
- **Dans le domaine occitan de la carte, mais arpitanes pour LIMSI** (et nommées en ORB dans la Vouiquipèdia frp) : nord de la Drôme (Valloire et Galaure : Saint-Rambert-d'Albon, Anneyron, Albon, Hauterives, Châteauneuf-de-Galaure, Épinouze, Saint-Sorlin-en-Valloire, Moras-en-Valloire...) et nord de l'Ardèche (Félines, Serrières, Peyraud, Champagne). Je les ai laissées à l'occitan, comme le veut la carte, sans les mettre dans la liste.
- Charnas, Limony et Vinzieux (Ardèche) sont hors du domaine occitan et arpitanes pour LIMSI : le domaine arpitan doit les couvrir, même sans étiquette.

## Villes notables sans nom arpitan sourcé (absentes de la liste)

Oyonnax (22 500 hab. ; « xx » dans la liste de l'Ain), Villefontaine, Saint-Just-Saint-Rambert, Brignais, Roussillon et Le Péage-de-Roussillon, La Côte-Saint-André, Beaurepaire, Morez (Hauts de Bienne), Morteau, Cluny, Gland, Prilly, Crissier. Je ne les ai pas nommées, pour ne rien inventer.

## À valider par Romain

Les 11 noms occitans (`nom_oc_a_validar`), les rangs, les 32 incertitudes, et le traitement de la zone de Firminy.
