# Arpitan : domaine, dialectes, sources et incertitudes

Travail du 2026-10-09 (conversation « carte, autres langues »), sur le modèle du catalan.
Décisions de Romain, le même jour :
- **sources « A + 1 »** : le domaine commune par commune, avec la meilleure source dans chaque pays ; les parlers d'après les entités culturelles, refaits à partir des unités administratives, sans recopier aucun tracé ;
- **7 dialectes**, avec les parlers de la Vouiquipèdia en sous-dialectes (même lecture que le catalan) ;
- **contact avec l'occitan** : la ligne occitane de la carte reste la limite ; les 79 communes revendiquées des deux côtés sont hachurées ;
- **Oisans** : arpitan.

## Fichiers

- `dialectes-arpitan.csv` : 3 445 lignes, séparateur `;`. Une ligne par commune du domaine, de la bande hachurée ou de la bordure. Colonnes : `regio`, `unitat`, `mena`, `nom_oficial`, `codi` (INSEE, `ofs:`, `istat:`), `domeni` (`arpitan`, `occitan` = bande hachurée, `exclos`), `dialecte`, `parlar`, `transicio` (`oc`, `oil`, `pms`), `part_carta` et `part_oc` (part de la commune dans la carte arpitania.eu et dans le domaine occitan de la carte), `nota`, `font`.
- `dialectes-arpitan.json` : les 7 dialectes (noms frp, fr, oc, couleur, parlers), la zone à part et les 3 transitions.
- `gcp-arpitania.csv` : les 60 villes qui calent la carte arpitania.eu.
- `vilas-arpitan.json` et `FONTS-vilas.md` : les 200 villes (travail du 2026-10-08).
- Sortie : `app/static/data/arpitan.json` (100 Ko environ).

Chaîne : voir `SIG/cadena/LEGISSETZ-ME.md`, section Arpitan.

## Répartition

| | communes | dialecte (parlers) |
|---|---|---|
| France | 2 536 + 79 hachurées | lyonnais (liyonês 178, forésien 174, rouanês 113, biôjolês 78, mâconês 80 et brionês-charolês 11 en transition vers l'oïl) ; bressan-jurassien (jurassien 350, brêssan 202, bugisto 152, burgondan 98, dombisto 49) ; dauphinois (dârfenouès 475) ; savoyard (savoyârd 552, genevês de Gex 24) |
| Suisse | 521 | romand (vôdouès 300, friborgês 93, nôchâtelês 24) ; savoyard (genevês de Genève 45) ; alpin (valêsan 59) |
| Italie | 128 | alpin (vâldoten 71, vallées du Piémont 52, vâlsoanin 3) ; faetar (2) |

## Sources (codes de la colonne `font`)

| code | source | servi à |
|---|---|---|
| ARP | « Geographic distribution of Arpitan », Savoyerli / arpitania.eu, 2009, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Arpitan_francoprovencal_map.jpg), **CC BY-SA 3.0** (et GFDL) ; copie : `Modules_cors/Autras_lengas/Arpitan_francoprovencal_map.jpg` | domaine en France (commune arpitane si la moitié de sa surface est dans la carte) ; calage sur 60 villes, écart moyen 1,5 km, au pire 4,3 km. Le contour est schématique : à l'échelle de la commune, seule la règle des 50 % compte. |
| OCC | domaine occitan de la carte (`limits-carta.json`, d'après Occitanica) | limite avec l'occitan, gardée point par point |
| OFS | Office fédéral de la statistique, « Régions linguistiques 2020 » par commune, état au 1er janvier 2026 ([application des communes](https://www.agvchapp.bfs.admin.ch/fr/typologies/results?SnapshotDate=01.01.2026&SelectedTypologies%5B0%5D=HR_SPRGEB2020)) ; copie : `SIG/arpitan/ofs-regions-linguisticas.csv` | communes de langue française de Genève, Vaud, Neuchâtel, Fribourg et Valais |
| VDA | statut de la Vallée d'Aoste (communes walser) | 71 communes sur 74 ; Gressoney-La-Trinité, Gressoney-Saint-Jean et Issime exclues |
| L482 | Région Piémont, « Comuni piemontesi appartenenti a ciascuna minoranza linguistica » (loi 482/1999) ; copie : `SIG/arpitan/piemont-482.pdf` | 50 communes déclarées arpitanes (province de Turin) |
| BRETTE | bailliages de 1789 (Gay, Gobbi, Goñi 2024, d'après Brette 1904, CC BY 4.0) | parler en France : Gex, Bresse, Bugey, Dombes, Lyonnais, Beaujolais, Forez, Mâconnais, Charolais et Brionnais, Dauphiné |
| DEP, ARR, SAV | département (Doubs = burgondan, Jura = jurassien), arrondissement de Roanne (rouanês), Savoie et Haute-Savoie entières (savoyârd ; sardes en 1789, hors des bailliages) | parler |
| VQ | Vouiquipèdia en arpitan, article « Arpetan » : liste des parlers (« dialèctes ») et parlers de passage | noms ORB des parlers |
| (contrôle) | Atlas sonore LIMSI/LISN (`SIG/Limsi/`, CC BY-NC-SA) : **jamais source** | contrôle de la bande de contact : il met 34 des 79 communes en arpitan (surtout la Drôme du nord) |

Pour la carte des dialectes que Romain avait trouvée (`Arpitan_et_ses_dialectes.png`) : seul son **découpage** a servi, pas son dessin. Sur Commons, elle dit venir de l'Atlas LIMSI (licence non commerciale) et sa fiche est contestée (« les régions ne correspondent pas à la source »).

## Règles particulières

- **Piémont**, comme pour les vallées occitanes : les communes déclarées des vallées, plus 6 communes non déclarées de la basse vallée de Suse (Bussoleno, Bruzolo, San Didero, Borgone Susa, Caprie, Chiusa di San Michele) ; Avigliana et Giaveno, déclarées mais au débouché des vallées et hors de la carte arpitania.eu, sont **hachurées** (parler à vérifier, piémontais ?) ; Castagnole Piemonte, déclarée mais en plaine, est **exclue** (comme Barge pour l'occitan).
- **Contact avec l'occitan** : l'arpitan prend aussi, jusqu'à la ligne occitane, les morceaux hors du domaine occitan des communes occitanes voisines (45 km²) : ni chevauchement ni vide dans les communes connues.
- **Lacs** : le Léman est un trou du domaine (pas de frontière dessinée sur ses rives).
- **Frontière avec l'occitan, deuxième version** (retour de Romain, 2026-10-09 : « des trous identifiés ») : le domaine occitan suit désormais les communes au contact de l'arpitan (`SIG/cadena/raccord-arpitan.py`, comme le Fenouillèdes). Les communes occitanes voisines y entrent entières : les 79 de la bande hachurée, celles du Puy-de-Dôme (monts du Forez : Saint-Anthème, Arconsat, Le Brugeron…) et des Hautes-Alpes (La Grave, Névache) ; les communes arpitanes en sortent (165 km²). Vides restants entre les deux langues : 0,03 km².
- **Montagne bourbonnaise** (Allier) : sources contradictoires (arpitan pour Wikipédia en français, occitan influencé par l'arpitan pour Wikipedia en anglais). Décision de Romain : bande de transition hachurée, comme l'Ardèche et la Drôme. Arfeuilles, La Chabanne, Châtel-Montagne, Ferrières-sur-Sichon, La Guillermie, Laprugne, Lavoine et Saint-Nicolas-des-Biefs entrent dans l'auvergnat et portent les hachures arpitanes. Le Bourbonnais d'oïl au nord (Lapalisse) reste hors des deux langues.
- **Zone « Arpitania de France »** : domaine moins l'étranger, découpé sur la frontière des départements de la carte (`SIG/cadena/apart-frontiera.py`, aussi pour la Catalogne Nord).

## À valider par Romain

1. Les noms arpitans des 3 groupes inventés (`brêssan-jurassien`, `romand`, `alpin`), de la zone à part (« Arpitania de France ») et des parlers des vallées du Piémont (`valadas`).
2. Tous les noms occitans (`oc`) : lionés, bressan-jurassian, delfinenc, savoiard, romand, alpenc, faetar, arpitan de França, et ceux des transitions (Avilhana, Giavèn…).
3. Les couleurs : langue unifiée en vert (choix de Romain, comme sur les cartes des langues de France ; le basque aura un vert plus foncé), dialectes en violets et mauves, à essayer.
4. Le nom de la langue (révision des échelles, décision n° 8 : arpitan ou francoprovençal) : la carte dit « arpitan », le panneau « Arpitan (francoprovençal) ».

## Incertitudes et suites

- **Licence** : le domaine en France est fait de communes IGN choisies d'après une carte CC BY-SA 3.0, et la Suisse et l'Italie viennent d'OSM (ODbL). Le crédit est affiché sur la carte. Comme pour Occitanica, Romain devra vérifier qu'on peut réutiliser ce classement (la compatibilité entre CC BY-SA et ODbL n'est pas garantie).
- **Vides hors des communes connues** : fermés le 2026-10-09 (voir « Frontière avec l'occitan, deuxième version »).
- **Parlers rangés à grands traits** : tout le Doubs en burgondan et tout le Jura en jurassien ; le nord de l'Ardèche (Annonay) et de la Haute-Loire en forésien (bande hachurée seulement) ; Gex en genevês.
- **Enclave du Mâconnais en Bresse** : 49 km² de communes à l'est de la Saône relevant du bailliage de Mâcon (vers Cuisery) forment un morceau détaché du lyonnais (mâconês). C'est historique, à confirmer.
- **Non traités** : La Neuveville (canton de Berne) ; Valchiusella et haut Canavese.
- **Limite nord** (oïl) : elle ne repose que sur la carte arpitania.eu ; 83 communes de bordure (moins de 50 % dedans) sont listées comme exclues, avec leur part, pour une relecture.
