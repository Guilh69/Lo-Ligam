# Breton : domaine, dialectes, sources et incertitudes (2026-10-10)

Données préparées pour la carte (/carta), sur le modèle du basque et des langues d'oïl. Rien n'est encore intégré à l'application.
Proposition de départ, à valider par Romain : **état historique de la langue (1886)**, comme pour l'occitan ; **dialectes d'après les anciens évêchés**, corrigés par l'auteur de la limite lui-même.

## Fichiers

- `dialectes-breton.csv` : 621 lignes, séparateur `;`, UTF-8 avec BOM. Colonnes : `regio` (France), `unitat` (ancien évêché de la paroisse : Léon, Tréguier, Cornouaille, Vannes, Saint-Brieuc, Nantes), `mena` (comuna_fr), `nom_oficial` (IGN), `nom_local` (nom breton), `codi` (INSEE 2026), `domeni`, `dialecte`, `parlar`, `transicio`, `part_oc` (vide), `nota`, `font`.
  - `domeni` : `breton` (586) ; `mixta` (7, bande mixte, à hachurer) ; `vesina` (19, communes gallèses de la limite où Sébillot signale des villages ou des familles bretonnantes : hors domaine, pour mémoire) ; `desaparegut` (9, breton éteint, zone historique).
  - `dialecte` : `leoneg`, `tregerieg`, `kerneveg`, `gwenedeg`.
  - `transicio` : `galo` (commune touchée par la limite de 1886), `kerneveg-gwenedeg`, `leoneg-tregerieg`, `leoneg-kerneveg` (parler de passage entre deux dialectes, d'après une source citée dans la note).
  - `font` : codes ci-dessous.
- `dialectes-breton.json` : les 4 dialectes (noms br, fr, oc, parlers, nombre de communes), `apart: null`, 7 zones (`Tmixta`, `Tgalo`, `Tvesina`, `Tkg`, `Tlt`, `Tlk`, `Tist`) avec leurs listes de communes.
- `noms-br.csv` : 1 408 communes des 5 départements (22, 29, 35, 44, 56), `insee;nom_br;font`.
- Données brutes (hors Git) : `SIG/brut/breton/` (texte et images de Sébillot, articles Wikipédia copiés, réponses Wikidata et OSM, `controle.txt` = tous les contrôles).
- Chaîne, dans l'ordre : `SIG/cadena/breton-comunas.py` (Python de QGIS), `breton-wikidata.mjs`, `breton-classament.py` (`py`), `breton-json.mjs`.

## Sources (codes de la colonne `font`)

| code | source | licence | servi à |
|---|---|---|---|
| SEB86 | Paul Sébillot, « La langue bretonne, limites et statistique », *Revue d'ethnographie*, t. V, 1886, p. 1-29, fig. 3 (p. 12) et fig. 5 (p. 16, « carte d'ensemble, par communes »). Numérisation : https://archive.org/details/revuedethnograp03hamygoog | domaine public | limite du breton, commune par commune et village par village ; corrections des dialectes |
| EV | Listes de paroisses des anciens évêchés, Wikipédia en français (consultées le 2026-10-10) : « Léon (archidiaconé) », « Kemenet-Ily », « Ac'h (archidiaconé) », « Tréguier (archidiaconé) », « Minihy de Tréguier », « Cornouaille (archidiaconé) », « Poher (archidiaconé) », « Doyenné de Lanmeur », « Doyenné de Lannion », « Lanvollon (doyenné) », « Diocèse de Vannes » (§ Territoire), « Diocèse de Tréguier ». Elles citent : J. Kerhervé, F. Roudaut, J. Tanguy, *La Bretagne en 1665 d'après le rapport de Colbert de Croissy*, CRBC, 1978 ; A. de Courson, *La Bretagne du Ve au XIIe siècle*, 1863 ; F. Merlet, « Les limites des diocèses à la veille de la Révolution dans le département des Côtes-du-Nord », 1951 ; Geslin de Bourgogne et Barthélemy, 1855 | CC BY-SA 4.0 (faits repris et cités, texte non recopié) | évêché de chaque paroisse ; chaque lien résolu en code INSEE par Wikidata (P374, P1366, P131) |
| DED | Déduction (commune absente des listes), justifiée dans la note : Morbihan = Vannes par défaut (146), archidiaconé de Plougastel de Tréguier dont la liste manque (19, à l'ouest du Léguer), Trégor finistérien (15, Morlaix compris), Goëlo (15), Minihy de Saint-Pol (3), etc. Articles de communes consultés : Mellionnec, Plélauff, Le Cloître-Saint-Thégonnec, Lohuec | | évêché des 206 communes non listées |
| WPB | Wikipédia en français, « Breton de Batz-sur-Mer » (cite L. Bureau 1875, Coquebert de Montbret 1806, P. Benoist, chanoine Le Méné 1889, Y. Mathelier 2005, ALBB 1911) | CC BY-SA 4.0 (faits cités) | breton éteint du pays de Guérande et du sud de la Vilaine |
| IGN | ADMIN EXPRESS COG CARTO 2026, couche `commune` (`SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg`) | Licence ouverte 2.0 | communes, populations, voisinages |
| WD-brwiki | Wikidata (requête SPARQL sur les liens de site vers br.wikipedia.org et P374), titre de l'article breton sans le complément entre parenthèses | CC0 | noms bretons (1 401) |
| OSM | OpenStreetMap, `name:br` des communes (API Overpass, miroir maps.mail.ru) | ODbL | noms bretons manquants (7) et contrôle des 1 401 autres |
| AN | Carte linguistique des Archives nationales (cantons 2013, zone « 6 breton »), `SIG/brut/oil/an-cantons-2013.geojson` | voir `SIG/oil/FONTS.md` | contrôle seulement |

Écartées : **Office public de la langue bretonne** (pas de couche ouverte de la limite à la commune trouvée) ; lignes de **Panier (1941)**, **Timm (1980)** et travaux de **Broudic** (*À la recherche de la frontière*, 1995-1997), **Bernard Tanguy**, **Jean Le Dû** (*Nouvel atlas linguistique de la Basse-Bretagne*, 2001) : ouvrages sous droits, non consultables en ligne, cités pour mémoire ; **Wikimedia Commons « Breton_dialectes.svg »** (Pmx, 2006, GFDL et CC BY-SA, « travail personnel » sans aucune source citée, zone gallèse « actuelle ») : non utilisée. Aucune source « NC » n'a servi.

## La limite retenue : Sébillot 1886

Pourquoi : c'est la seule limite publiée **commune par commune, et même village par village**, sur toute la longueur (Plouha à l'embouchure de la Vilaine, avec l'enclave de Batz) ; elle donne l'état de la fin du XIXe siècle, comme le domaine occitan de la carte ; elle est dans le domaine public. Sébillot l'a établie avec des correspondants locaux (curés, notaires, médecins) et, pour le Morbihan, avec le Dr Mauricet et l'évêché.

Méthode :
1. Les 46 communes que la limite touche sont classées à la main d'après le texte (table `LIMITA` du script, phrase de Sébillot résumée dans la note).
   - **breton** : commune bretonnante pour au moins trois quarts, ou dont seuls quelques villages sont français (Pléguien « neuf dixièmes », Saint-Connec « cinq sixièmes », Ambon « sauf le village de Penesclus »…) ;
   - **mixta** : part notable de chaque côté (de un tiers à deux tiers), ou prédication dans les deux langues : Saint-Gildas (2/3 breton, bourg français), Le Vieux-Bourg (un peu moins de moitié), Saint-Mayeux, Saint-Gilles-Vieux-Marché, Guerlédan (Mûr bilingue + Saint-Guen français), Saint-Allouestre (2/3), Elven (« à peu près par moitié ») ;
   - **vesina** : bourg et majorité français, quelques villages ou familles bretonnants : Tréveneuc, Plourhan, Tréguidel, Plélo, Châtelaudren-Plouagat, Boqueho, Saint-Martin-des-Prés, Saint-Caradec, Hémonstoir, Saint-Gonnery, Gueltas, Réguiny, Radenac, Guéhenno, Plumelec, Trédion, La Vraie-Croix, Noyal-Muzillac, Muzillac.
2. Les autres communes sont rangées par propagation : toute commune reliée au Finistère par des voisines sans franchir la limite est bretonne. Huit communes à l'est de la limite, non nommées par Sébillot, servent de butée (Saint-Bihy, Lantic, La Harmoye, Buléon, Questembert, Crédin, Billio, Billiers), d'après les figures 3 et 5.
3. Îles : d'après la carte AN (toutes en zone bretonne) et Sébillot (arrondissement de Lorient entièrement bretonnant).

Contrôle avec la carte AN (au canton) : aucune commune bretonne en 1886 n'est gallèse pour l'AN (Locmiquélic tombe hors des polygones AN) ; à l'inverse, l'AN met dans le breton, par majorité cantonale, 13 communes des Côtes-d'Armor (cantons d'Uzel, de Châtelaudren, d'Étables), 12 du Morbihan (cantons de Questembert, de La Roche-Bernard, de Muzillac), sans compter les communes de la limite, et 9 communes du pays de Guérande, que Sébillot range en français en 1886 (liste dans `controle.txt`).

## Les dialectes : anciens évêchés, corrigés par Sébillot

Sébillot (§ 3) : « Les dialectes bretons correspondent approximativement à l'ancienne limite des évêchés. » Chaque commune prend l'évêché de sa paroisse (415 d'après les listes, 206 par déduction), puis : Léon → léonard ; Tréguier et partie bretonnante de Saint-Brieuc (Goëlo) → trégorrois, comme le dit Sébillot (« toute la partie de l'arrondissement de Saint-Brieuc qui parle breton ») ; Cornouaille → cornouaillais ; Vannes → vannetais. Enclaves de Dol : dialecte de leur entourage (Locquénolé en léonard, Magoar en cornouaillais, les autres en trégorrois).

Corrections que Sébillot donne lui-même (appliquées) :
- **Morlaix** : léonard (« toute la ville de Morlaix et plusieurs communes des environs situées sur la rive trécorroise parlent le breton de Léon » ; ces communes ne sont pas nommées) ;
- **arrondissement de Quimperlé entièrement cornouaillais** : Arzano, Guilligomarc'h, Rédené (paroisses de Vannes) en cornouaillais, avec la transition ;
- **cantons du Faouët et de Gourin** : cornouaillais « fortement teinté de vannetais » (Berné, Meslan, Priziac, Plouray, paroisses de Vannes, y compris) ;
- **Ouessant** : léonard, mais « une plus grande parenté » avec le trégorrois (Luzel).

Contradictions non tranchées (évêché gardé, transition et note « à vérifier ») : Neulliac et Kergrist (Cornouaille, mais Sébillot ne compte dans le Morbihan que Le Faouët et Gourin en cornouaillais) ; Mellionnec, Plélauff, Lescouët-Gouarec (Vannes, pays Pourlet, mais pour Sébillot « le dialecte de Vannes n'est parlé que dans le Morbihan »).

Parlers : seuls ceux qu'une source ou la géographie isole sans discussion : **Goëlo** (Goueloù, 20 communes) ; les **îles** (Ouessant, Molène, Batz, Bréhat, Sein, Groix, Belle-Île, Houat, Hœdic, Île-aux-Moines, Île-d'Arz) ; le **breton de Batz ou guérandais** (éteint). Non retenus faute de source ouverte à la commune : Bas-Léon et Haut-Léon (Sébillot les sépare par l'Aber-Benoît, sans tracé plus loin), pays Pourlet, haut et bas vannetais, Haute-Cornouaille.

## Chiffres

| dialecte | breton | mixta | domaine (breton + mixta) | vesina |
|---|---|---|---|---|
| kerneveg (cornouaillais) | 206 | 5 | 211 | 3 |
| tregerieg (trégorrois) | 137 | 0 | 137 | 6 |
| gwenedeg (vannetais) | 133 | 2 | 135 | 10 |
| leoneg (léonard) | 110 | 0 | 110 | 0 |
| **total** | **586** | **7** | **593** | **19** |

Par département : Finistère 277 (toutes ses communes) ; Côtes-d'Armor 166 + 5 mixtes ; Morbihan 143 + 2 mixtes. Breton éteint : 9 (6 en Loire-Atlantique, 3 au sud de la Vilaine). Population 2026 : 1 755 325 dans les communes bretonnes, 11 609 dans les mixtes.

## Breton éteint (zone historique, `desaparegut`)

- **Batz-sur-Mer** : sûr. Breton parlé en 1886 dans sept villages paludiers (Sébillot, d'après Léon Bureau : 200 locuteurs habituels), derniers locuteurs dans les années 1960.
- **Attesté au XIXe siècle**, preuves plus minces : Le Pouliguen (locuteurs tardifs à Penchâteau), Piriac-sur-Mer (après 1830), Mesquer (plus tard encore), Assérac et Saint-Molf (en partie, interprétation de l'enquête de 1806, « imprécise » pour ce département), Férel, Camoël, Pénestin (1806 ; éteint avant 1889).
- **Non retenus** : Guérande, La Turballe, Saint-Lyphard, Herbignac, Le Croisic, La Baule-Escoublac, Pornichet, Saint-André-des-Eaux, La Chapelle-des-Marais, que la carte AN met dans le breton (le breton y a reculé aux XVIIe-XVIIIe siècles, carte de Nolin de 1695). Option à trancher.
- Dialecte : rangé avec le vannetais, parler `gwenrann`, à titre provisoire (certains auteurs parlent d'un « breton guérandais » à part).

## Incertitudes

1. Sébillot compte 13 communes « mi-parties » dans les Côtes-du-Nord et 18 dans le Morbihan, **sans les nommer** ; nos 7 `mixta`, 19 `vesina` et 20 communes bretonnes marquées `galo` sont une lecture de son texte, avec la règle ci-dessus.
2. Le Vieux-Bourg : le texte met le bourg en pays breton, la figure 5 à l'est de la limite. Saint-Connec : l'OCR lit « 8/6 », lu « 5/6 ». Saint-Martin-des-Prés n'est rangée que d'après la figure 5 (un astérisque non expliqué suit son nom).
3. Communes nouvelles coupées par la limite : Guerlédan (Mûr + Saint-Guen), Châtelaudren-Plouagat, Saint-Gérand-Croixanvec : classées d'après la partie qui domine, dite dans la note.
4. Les évêchés ne sont qu'une **approximation des dialectes** (Sébillot lui-même le dit) ; les isoglosses savantes (Le Dû, Falc'hun) ne sont pas en accès libre. Zones les plus fragiles : Trégor finistérien et environs de Morlaix, Plougastel-Daoulas (Cornouaille), pays Pourlet, Le Faouët et Gourin.
5. 206 communes ont un évêché déduit, surtout le Morbihan (146, Vannes par défaut) et l'ouest du Léguer (19, archidiaconé de Plougastel dont la liste manque sur Wikipédia ; source à consulter : Courson 1863, p. 191-192, sur Gallica).
6. Brest et Lorient sont comptées bretonnantes par Sébillot, mais il les dit en grande partie françaises (note). Belle-Île (4 communes) : bretonne d'après la carte AN, à confirmer.
7. Noms bretons : le titre de la Wikipédia bretonne diffère du `name:br` d'OpenStreetMap pour 31 communes (souvent l'apostrophe, parfois la forme : Rostrenenn / Rostrenn, Gwenrann / Gwerrann, Laoulan / Lanwelan, Sant-Seo / Sant-Sev) ; les formes officielles de l'Office public de la langue bretonne (KerOfis) n'ont pas été consultées. Merdrignac n'a aucun nom breton dans les deux sources.

## À valider par Romain

1. **L'état de 1886** (comme l'occitan) plutôt que l'état actuel (comme le basque).
2. La **bande mixte** (7 communes hachurées) et le sort des 19 `vesina` (ne rien dessiner, ou hachures légères).
3. Le **breton éteint** : Batz seul, ou les 9 communes, ou tout le pays de Guérande comme l'AN.
4. Les **dialectes par évêché** et les cas signalés « à vérifier » (Neulliac, Kergrist, Mellionnec, Plélauff, Lescouët-Gouarec, Morlaix).
5. Les **noms occitans** (propositions, absentes du Basic, API de lo Congrès le 2026-10-10) : leonés, tregorés, cornoalhés, vanetés, galo. Vérifiés : breton, dialècte, zòna, mixta, contacte, transicion, illa, parlar, comuna, vesina, escantit (participe d'escantir), amb, de. « lo » et « la » renvoient une erreur de l'API.
6. Les **noms bretons** des parlers (Goueloù, Ar Gerveur, Brezhoneg Gwenrann, Enizenac'h…) et des communes : relecture par un brittophone, ou comparaison avec KerOfis.
7. **Licences** : Sébillot (domaine public) et IGN (Licence ouverte) sans réserve ; listes de Wikipédia (CC BY-SA) citées comme sources de faits ; noms bretons Wikidata (CC0) ; 7 noms OSM (ODbL, attribution « © contributeurs OpenStreetMap » à prévoir si on les garde).

## Ajout du 2026-10-10 : extension historique et présence actuelle

### `breton-istoric.csv` (3 100 lignes, `insee;nom;limit;font`, UTF-8 avec BOM)

Communes des départements 22, 35, 44 et 56 situées à l'intérieur de chaque limite ancienne (le Finistère est entièrement dedans à toutes les époques). Toutes les communes intérieures sont listées, y compris celles du domaine de 1886 : pour les hachures sur le gallo, ne garder que celles qui ne sont pas `breton` ou `mixta` dans `dialectes-breton.csv`.

| limit | communes | hors domaine 1886 | source du tracé |
|---|---|---|---|
| `IXe-Loth` (vers 900, extension maximale, « ligne Loth ») | 779 | 463 | TL02, d'après Joseph Loth (*L'émigration bretonne en Armorique*, 1883) |
| `XIIe` | 688 | 372 | FL82 |
| `XIIIe` | 495 | 179 | FL82, BRK79 |
| `XIVe` | 393 | 77 | FL82, BRK79 |
| `1588-Argentre` (le plus proche de « 1500 ») | 384 | 68 | ARG1588 |
| `1806-Coquebert` | 361 | 45 | CDM1806 |

Sources (codes) :
- **SEMHUR** : Sémhur (Ivan d'Hostingue), « Frontière linguistique du breton map-fr.svg », Wikimedia Commons, 2020, **CC BY-SA 4.0** : https://commons.wikimedia.org/wiki/File:Fronti%C3%A8re_linguistique_du_breton_map-fr.svg (copie : `SIG/brut/breton/istoric/semhur-frontiera.svg`). Carte vectorielle faite sous QGIS, une couche par époque.
- **TL02** : Bernard Tanguy et Michel Lagrée, *Atlas d'histoire de Bretagne*, Skol Vreizh, 2002, carte 72, p. 158-159. **FL82** : Léon Fleuriot, « Le gallo et les langues celtiques », *Les cahiers du LERG* 1, 1982. **BRK79** : Yann Brekilien, *Histoire de la Bretagne*, 1979. **ARG1588** : Bertrand d'Argentré, *Histoire de Bretagne*, 1588. **CDM1806** : enquête linguistique de Coquebert de Montbret, 1806. Ouvrages cités par Sémhur, non consultés directement (sous droits pour les trois premiers).

Méthode (scripts dans le bloc-notes de la séance, à ranger dans `SIG/cadena/` si on garde la chaîne) : lecture des chemins SVG ; calage affine sur les limites des 9 départements dessinés (22, 29, 35, 44, 56, 50, 53, 49, 85), centroïdes puis ajustement itératif sur 18 288 sommets des limites IGN ; une commune est dedans si **au moins la moitié de sa surface** est à l'intérieur du polygone de l'époque (îles comprises). Polygones calés : `SIG/brut/breton/istoric/semhur-limits-l93.geojson`.

**Écart du calage** : médiane 10 m, 90 % des sommets à moins de 70 m (moins de 230 m pour chaque département). Le calage n'est donc pas la source d'erreur : c'est le tracé des historiens, dessiné à petite échelle, qui l'est (plusieurs kilomètres).

Contrôles :
- La couche 1886 de Sémhur, comparée à notre liste Sébillot commune par commune : 7 désaccords sur 1 132 communes (5 `vesina`, Lantic, Le Croisic), soit la marge d'une commune le long de la limite.
- Textes (Wikipédia, « Frontière linguistique bretonne ») : IXe, breton jusqu'à Dol, Montfort-sur-Meu, Blain et Donges, Rennes et Nantes en dehors : conforme ; XIIe, Dinan et Pornichet dedans : conforme ; 1806, Saint-Caradec, Questembert, Pénestin, Camoël, Batz dedans : conforme (Férel 48 %, Péaule 72 %).

Incertitudes :
1. **Pas de limite « 1500 »** publiée : `1588-Argentre` (et `XIVe`, presque identique) en tient lieu.
2. **XIVe contesté** : Erwan Vallerie (1995) fait passer la limite du début du XIVe siècle par Pléhérel, Plédéliac, Merdrignac, Gaël, Plélan-le-Grand, Maure, Sixt, Avessac, Missillac, Herbignac et Escoublac, c'est-à-dire près de notre `XIIe`, bien plus à l'est que la ligne de Fleuriot et Brekilien.
3. La « ligne Loth » est discutée pour le haut Moyen Âge (limite de la toponymie bretonne, pas forcément d'une langue parlée par tous).
4. Une trentaine de communes par époque sont coupées (entre 10 et 90 % de surface) : la règle de la moitié tranche.
5. Jean-Yves Le Moing (*Les noms de lieux bretons de Haute-Bretagne*, 1990) et les autres travaux de Tanguy ne sont pas en accès libre : non utilisés directement.
6. Licence : la liste dérive d'une carte CC BY-SA 4.0. Mention à prévoir : « d'après Sémhur, Wikimedia Commons, CC BY-SA 4.0 ».

### `breton-actual.csv` (1 248 lignes, `insee;nom;indicador;valor;annada;font;url`, UTF-8 avec BOM)

215 communes ayant une offre d'enseignement bilingue en 2025 (Finistère 82, Morbihan 59, Côtes-d'Armor 43, Ille-et-Vilaine 25, Loire-Atlantique 6), 19 978 élèves. Indicateurs : `eleves_bilingues` (toujours présent), `eleves_maternelle`, `eleves_elementaire`, `eleves_college`, `eleves_lycee`, `eleves_public`, `eleves_catholique`, `eleves_diwan`, `etablissements`, `etablissements_diwan` (lignes à zéro omises).

Source **OPLB2025** : Office public de la langue bretonne, page « Données libres de droits » (https://www.fr.brezhoneg.bzh/212-donnees-libres-de-droits.htm), fichiers « Effectifs de l'enseignement bilingue par commune en 2025 » et « par établissement en 2025 », **licence ODbL** (attribution et partage à l'identique de la base). Copies : `SIG/brut/breton/oplb/` (encodage Windows-1252). Tous les codes INSEE existent dans le COG 2026 ; les sommes par filière égalent le total de chaque commune.

Hors du domaine de 1886 : **53 communes, 4 511 élèves** (Rennes 1 012, Nantes 533, Saint-Herblain 325, Saint-Brieuc 184, Bruz 144, Questembert 142, Redon 138…).

Incertitudes et manques :
1. `etablissements` compte des numéros UAI : une école maternelle et une école élémentaire voisines comptent pour deux.
2. **Cours pour adultes** : aucune donnée ouverte à la commune trouvée (l'OPLB ne publie que des graphiques par département, pays et intercommunalité). Non inclus.
3. Les options de breton en collège et lycée hors filière bilingue ne sont pas dans ces fichiers.
4. Piste non exploitée : la base KerOfis (noms bretons officiels, CSV du 2026-09-25, même page, ODbL) répondrait au point 7 des incertitudes ci-dessus.
