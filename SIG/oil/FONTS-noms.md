# Noms des villes dans la langue d'oïl du lieu : sources (2026-10-10)

Fichier : `noms-oil-locals.csv` (34 villes, séparateur « ; »). Seules les villes de `vilas-oil.json` sans nom local y figurent.
Règle suivie : un nom n'entre que s'il est écrit dans une source citée, qui dit dans quelle langue il est. Aucun nom fabriqué.
Quand la langue de la source n'est pas celle de la zone (carte des Archives nationales), la colonne `nota` commence par « LANGUE ≠ ZONE ».
Les cas fragiles commencent par « DOUTEUX » ou « À TRANCHER ».

## Bilan par langue
| Langue (zone) | Noms | Sources principales |
|---|---|---|
| franc-comtois | 5 | Wikipédia fr « Franc-comtois », §Toponymie ; glossaires de Roussey (1894) et Vautherin (1896) |
| bourguignon-morvandiau | 2 | Chambure, *Glossaire du Morvan* (1878) |
| lorrain | 2, douteux | Wikipédia fr « Lorrain », §Toponymie |
| champenois | 0 | rien trouvé (2 noms d'autres langues, voir plus bas) |
| parlers du Centre | 2 (1 picard, 1 douteux) | Wikipédia |
| parlers de l'Ouest | 1 (poitevin) | carte Pivetea |
| gallo | 4 | Institut du galo, liste des communes (2021) |
| poitevin-saintongeais | 16 | Wikipédia en, carte Pivetea, Lexilogos |

## Sources, licence, fiabilité
- **Glossaires du XIXe siècle** (archive.org, domaine public), les plus sûrs : Roussey, *Glossaire du parler de Bournois* (1894) : « bâm » Baume-les-Dames, « bèfo » Belfort ; Vautherin, *Glossaire du patois de Châtenois* (1896) : « Bîefoûe, Béfô ou Béfôe » ; Chambure, *Glossaire du Morvan* (1878) : « SAULEU pour Saulieu », « ai N'var » (à Nevers).
- **Wikipédia fr, article « Franc-comtois »** (CC BY-SA) : tableaux de toponymie par département, références générales (Société belfortaine d'émulation 1896, Roussey, Vautherin…), pas de référence par nom. Attention : le petit tableau qui donne « Luire » pour Lure est une étymologie, pas un nom comtois (écarté).
- **Wikipédia fr, article « Lorrain »**, §Toponymie (CC BY-SA) : liste « en lorrain roman du XIXe siècle » (Nanceye, Pinaud, L'nainville) avec renvoi à Lepage (Meurthe, 1862) et Bouteiller (Moselle, 1868). Nanceye ne figure pas dans les formes de Lepage reprises par DicoTopo, et Épinal n'est couvert par aucun des deux : douteux.
- **Wikipédia en, introductions des articles de villes** (CC BY-SA) : la plupart des noms poitevins, sans source.
- **Carte Pivetea** (http://pivetea.free.fr/aeraie.htm, site personnel en graphie normalisée poitevine, signalé par Lexilogos) : image de 500 px, lue à l'agrandissement. Aucune licence. Seule source pour 7 villes.
- **Lexilogos**, page Poitou-Charentes : Poetae, La Rochéle, Sénte, Engoulaeme.
- **Institut du galo**, *Rolée des qemunes de Haote-Bertègn* (2021, PDF, pas de licence indiquée) : graphie de l'Institut, différente de celle de Chubri (graphie Moga) utilisée pour les 13 autres villes gallèses. Il faudra choisir une graphie pour toute la carte, ou l'assumer.
- **OpenStreetMap** (ODbL, citer « contributeurs OpenStreetMap ») : name:fr-x-fc (Béfô, B'sosson, Vezou), name:fr-x-brg (Béâne), name:pcd (Compiène). Données saisies par des contributeurs : variantes seulement.
- **dicobourguignon.fr** : dictionnaire participatif, mêle formes de l'ancien français (Digeon, Clugny, celles des chartes) et patois. Pris seulement en appui.
- **Sans résultat** : Wikidata (aucun nom monolingue utile), Wiktionnaire (catégories lorrain et poitevin : villages seulement), DicoTopo du CTHS (formes anciennes, pas de patois), Tarbé, Saubinet, Zéliqzon, Adam, Jaubert (aucune forme patoise des grandes villes).

## Écartés
- Formes médiévales, pas des noms patois : Rains/Reins (Reims), Troies (Troyes), Mès (Metz, 1444), Digeon/Digion (Dijon). Les textes en patois de Dijon (La Monnoye, *Pièces en patois bourguignon*) écrivent « Dijon ».
- Noms identiques ou presque au français : Dole (« Dole »), Lure (« lur »), Rochefort (« Rochfort »), Coutras, Yeu.
- Noms donnés par une autre langue : Rins, Troéïes, Bzanchon (Wikipédia picarde), Angiers, Orliauns (Wikipédia normande), Pwetî (wallonne), Môlingn' (Moulins) et Pairis (Paris) en morvandiau.
- Saint-Dié-des-Vosges et Neufchâteau : Wikipédia ne donne qu'une prononciation (API) en vosgien, pas d'écriture.

## Noms déjà sur la carte à revoir
- Caen : la carte a « Caën » (Wikipédia normande), Wikipédia en donne « Kaem ».
- Béthune : « Bétunne » sur la carte, « Béthinne » sur Wikipédia en.
- Bressuire : « Brsuire » ; variantes Brseùire (Wikipédia fr), Beurseure (Wikipédia en), « Brseüre » sur la carte Pivetea.
- Lunéville : « Leneinvile » (sans source) ; L'nainville dans l'article « Lorrain ».
- Beaune : « Beane » ; OSM écrit « Béâne ».

## Ce que Romain doit vérifier
1. Les lignes « DOUTEUX », « À TRANCHER » et « LANGUE ≠ ZONE » : garder, écarter, ou chercher mieux.
2. Le choix d'une graphie par langue (gallo : Chubri ou Institut du galo ; poitevin : graphie normalisée de la carte Pivetea).
3. Lorrain et champenois : la meilleure piste restante est le papier (Lepage 1862 pour Nancy ; dictionnaires de Cordier pour l'ardennais, Diot pour le briard) ou un contact avec les associations.
