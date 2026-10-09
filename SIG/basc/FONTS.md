# Basque : domaine, dialectes, sources et incertitudes

Travail du 2026-10-09 (conversation « carte, autres langues »), sur le modèle du catalan et de l'arpitan.
Décisions de Romain, le même jour :
- **état actuel de la langue**, pas le domaine du XIXe siècle : Bayonne, Anglet et Biarritz restent dans le basque (« elles ne peuvent pas être enlevées du basque »), avec leur influence gasconne historique en hachures ;
- **Espagne : la loi** (option A) : Biscaye et Guipuscoa en basque plein ; Navarre selon les trois zones de sa loi de 1986 ;
- **Alava** : basque disparu depuis deux siècles, en teinte à part, comme la Petite Gavacherie ;
- **dialectes de Zuazo (2008)** (option A), les sous-dialectes en parlers ;
- **densité des villes** (retour sur capture) : peu de grandes villes de loin.

## Fichiers

- `dialectes-basc.csv` : 759 lignes, séparateur `;`. Une ligne par commune (France : les 158 de l'agglomération Pays basque et Esquiule ; Espagne : toutes celles d'Euskadi, de Navarre et l'enclave de Treviño). Colonnes : `regio`, `unitat` (province ou comarque), `mena`, `nom_oficial`, `nom_eu`, `codi` (INSEE, `ine:`, `osm:` pour les terres communes), `domeni` (`basc`, `mixta` = zone mixte de Navarre, `desaparegut` = basque éteint, `exclos`, `vesina` = terre commune rangée avec sa voisine), `dialecte`, `parlar`, `transicio` (`oc` tradition gasconne, `es` Encartaciones, `naf`/`erd`/`nl`/`zub` parler de passage entre dialectes), `part_oc` (part de la commune dans le domaine occitan de la carte, avant raccord), `nota`, `font`.
- `dialectes-basc.json` : les 7 dialectes (noms eu, fr, oc, couleur, parlers), la zone à part (Iparralde) et les 3 zones hachurées.
- `vilas-basc.json` : 200 villes (nom basque, rang).
- Sortie : `app/static/data/basc.json` (85 Ko).

Chaîne : `SIG/cadena/LEGISSETZ-ME.md`, section Basque.

## Répartition

| | communes | dialecte (parlers) |
|---|---|---|
| France | 159 (dont 14 de tradition gasconne, hachurées) | navarro-labourdin (ouest du Labourd, côte, centre du Labourd, oriental, Mixe) ; souletin |
| Euskadi | 203 en basque plein + 49 d'Alava éteintes (+ Treviño, 2) | biscayen (occidental, intermédiaire, oriental ; Encartaciones hachurées) ; guipuscoan (Goierri, Urola, Beterri, Tolosaldea, Oiartzun-Bidassoa) ; alavais éteint |
| Navarre | 64 bascophones + 98 mixtes (hachurées) ; 110 hors domaine | haut-navarrais (nord, sud, Aezkoa) ; guipuscoan (Araitz, Larraun, Burunda) ; navarro-labourdin (Baztan, Urdazubi, Zugarramurdi, Luzaide) ; navarrais oriental éteint (Roncal, Salazar) |

## Sources (codes de la colonne `font`)

| code | source | servi à |
|---|---|---|
| CAPB | État, `geo.api.gouv.fr/epcis/200067106/communes` : les 158 communes de la Communauté d'agglomération Pays basque | domaine en France (état actuel : politique publique de la langue basque) |
| GASC | Wikipédia fr « Gascon » (zones d'influence : Bayonne, Anglet, Biarritz, Bidache, La Bastide-Clairence) ; bailliages de 1789 (Brette, CC BY 4.0 : principauté de Bidache, sénéchaussées de Dax et de Tartas, Béarn) | les 14 communes de tradition gasconne : Bayonne, Anglet, Biarritz, Boucau, Bidache, Came, Sames, Guiche, Arancou, Bergouey-Viellenave, Urt, La Bastide-Clairence, Lichos, et Esquiule (village bascophone du Béarn, hors agglomération) |
| OCC | domaine occitan de la carte (`limits-carta.json`) | contrôle de la limite, puis raccord (voir plus bas) |
| LFN | Wikipédia es « Ley Foral del Euskera » (loi navarraise 18/1986, modifiée en 2010 et 2017), copie : `SIG/basc/fonts/ley-foral.wiki` | les trois zones de Navarre |
| LEU | Statut d'autonomie : le basque est officiel dans toute la communauté autonome | Biscaye et Guipuscoa en basque plein |
| Z08 | Koldo Zuazo, *Euskalkiak* (Elkar, 2008), d'après la Wikipédia en basque (« Mendebaleko euskara », « Gipuzkera », « Goi-nafarrera », « Nafar-lapurtera », « Zuberera », « Ekialdeko nafar euskalkia », « Arabako euskara ») | dialectes et parlers, vallée par vallée |
| VQ-ES | Wikipédia es « Anexo:Municipios de Vizcaya », « … de Guipúzcoa » | comarque de chaque commune (pour les parlers) |
| OSM | © contributeurs OpenStreetMap (ODbL) : communes d'Espagne, noms basques (`name:eu`), populations | contours, noms, villes |
| IGN | Admin Express COG Carto 2026 (Licence ouverte) | communes de France, chefs-lieux, populations |

La carte de Zuazo n'est **pas** recopiée (pas de licence libre) : seul son classement, vallée par vallée, sert, appliqué aux communes.

## Règles particulières

- **Raccord avec l'occitan** (`raccord-basc.py`) : le domaine d'Occitanica passait trop à l'ouest dans le 64 (toute la Soule et l'Amikuze en gascon, Mauléon et Saint-Palais à 100 %). Le domaine occitan suit désormais les communes : les 159 communes basques en sortent (980 km²), les communes occitanes voisines y entrent entières (Saint-Martin-de-Seignanx, Saint-Laurent-de-Gosse…). Les 14 communes de tradition gasconne deviennent une **zone mixte** de la carte occitane (`zonas-mixtas.geojson`, « mix-baiona », hachures comme Roya ou Monaco) et portent aussi les hachures « tradition gasconne » dans le basque.
- **Zone mixte de Navarre** : basque en hachures, dialecte haut-navarrais du sud (le basque y a reculé au XIXe siècle). Les 44 communes passées en zone mixte en 2017 (Tafalla, Olite, Sangüesa…) le sont par choix politique : la note le dit dans le CSV.
- **Encartaciones** (ouest de la Biscaye) : basque officiel mais castillan depuis le Moyen Âge : hachurées.
- **Basque éteint, plus pâle** : l'alavais (Alava sauf Aramaio et Legutio, où le basque ne s'est jamais perdu, et Treviño) et le navarrais oriental (Roncal, éteint en 1991 ; Salazar). Dessin : `colaLenga.js`, zones « istoric ».
- **Terres communes** (facerías, Bardenas, Urbasa, Aralar…) : rangées avec la commune voisine qui a la plus longue limite commune.
- **Trous gardés** : l'enclave cantabre de Villaverde et quelques communes navarraises non bascophones entourées par la zone mixte (vallée d'Elorz…).
- **Villes** : de loin (rang 1), une grande ville tous les 35 km au moins (Bilbo, Gasteiz, Donostia, Iruña, Baiona) ; rang 2 tous les 18 km, avec les chefs-lieux historiques (Maule, Donibane-Garazi, Donapaleu, Uztaritze, Gernika) ; rang 3 tous les 8 km. Tolosa (Guipuscoa) au rang 3, pour ne pas croiser Toulouse.

## À valider par Romain

1. Les noms occitans, **absents du Basic** (vérifiés avec l'API de lo Congrès le 2026-10-09) : biscaïn, gipuscoan, labordin, soletin, alavés ; et les toponymes Navarra, Encartacions, País Basc del Nòrd. Validés : basc, navarrés, oriental, naut, nòrd, zòna, mixta, tradicion, gascona, escantit, ara (« basc ara, de tradicion gascona »).
2. Les noms basques des groupes : on a pris ceux de Zuazo (mendebalekoa, erdialdekoa…). Un relecteur bascophone serait utile, ainsi que pour Iruña (forme officielle) ou Iruñea (forme de l'Académie).
3. Les couleurs : une famille de verts (du vert olive à l'aigue-marine), loin du violet gascon voisin.
4. La liste des 14 communes de tradition gasconne, surtout **Urt** et **Lichos**, et l'absence de Montory et d'Osserain-Rivareyte (rangées en basque).
5. La licence : communes OSM (ODbL) et IGN, classement d'après Zuazo (cité, pas recopié).

## Incertitudes et suites

- **Alava** : toute la province est mise en « basque éteint », Rioja alavesa comprise, où la présence du basque est très ancienne et mal connue.
- **Zone moyenne de Navarre** hors zone mixte (Estella-sud, Ribera) : le basque y a reculé entre le Moyen Âge et le XVIIIe siècle, mais faute de source commune par commune, elle est laissée hors du domaine.
- **Burunda** (Altsasu, Olazti…) : rangée en guipuscoan, comme la liste de Zuazo ; la page « Goi-nafarrera » la décrit comme un haut-navarrais à traits guipuscoans et biscayens.
- **Noms basques en France** : quatre communes sans `name:eu` dans OSM (Ahaxe-Alciette-Bascassan, Berrogain-Laruns, Jatxou, Souraïde) gardent leur nom officiel.
