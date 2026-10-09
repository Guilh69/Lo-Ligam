# Langues d'oïl : sources (2026-10-09)

Décision : famille de 9 langues (liste officielle) + « parlers du Centre », cahier §11 du 2026-10-09.

## Source principale : carte linguistique des Archives nationales
- Page : https://www.archives-nationales.culture.gouv.fr/centres-de-recherche/carte-linguistique-de-la-france
- Carte interactive (export qgis2web) : https://www.archives-nationales.culture.gouv.fr/vv/cartographie/
  données dans `layers/*.js` (GeoJSON, CRS84). PDF : lien sur la page.
- Auteurs : Pierre-Henri Billy (CNRS/Lamop), Sébastien Nadiras ; réalisation Jean-François Moufflet (AN), Chloë Fize.
- Précision : **le canton** (nomenclature 2013) ; canton partagé → zone de la majorité de ses communes.
- Licence : site sous Etalab 2.0 « sauf mention contraire » ; image marquée « © Archives nationales ».
  À confirmer (courriel de courtoisie aux AN avant publication).
- Copie locale : `SIG/brut/oil/an-cantons-2013.geojson` (3225 cantons, champs CANTON, DIALECTE, N° ZONE ; non versionné).
- Couverture : France seulement (wallon : 1 canton, Givet). Belgique à trouver ailleurs.

### 18 zones d'oïl (nombre de cantons) → regroupement Lo Ligam
| Zone AN | Parler | Cantons | Langue sur la carte |
|---|---|---|---|
| 1.3 | picard | 183 | picard |
| 1.2 | wallon | 1 | wallon (+ Belgique) |
| 1.4 | normand | 203 | normand |
| 1.5 | gallo | 115 | gallo |
| 1.8 / 1.9 | poitevin / saintongeais | 88 / 70 | poitevin-saintongeais (2 parlers) |
| 1.16 | champenois | 212 | champenois |
| 1.17 | lorrain | 123 | lorrain |
| 1.15 | bourguignon | 111 | bourguignon-morvandiau |
| 1.18 | comtois d'oïl | 82 | franc-comtois |
| 1.1, 1.12, 1.13, 1.14, 1.11 | « francien », orléanais, berrichon, bourbonnais, percheron | 247, 76, 51, 33, 17 | parlers du Centre |
| 1.6, 1.7, 1.10 | manceau, angevin, tourangeau | 45, 44, 30 | parlers de l'Ouest (tourangeau : Ouest ou Centre, à trancher) |

Les parlers AN peuvent servir de niveau fin (comme les sous-dialectes occitans).
Autres couches du même export, utiles pour les limites extérieures : aire celtique (breton), aire germanique.

## Contrôle seulement
- `Modules_cors/Autras_lengas/Oil/Langues_d'oïl_et_Croissant.png` : Wikimedia Commons, Vida Nova, 2021, CC BY-SA 4.0,
  mais **dérivée de l'Atlas sonore (LISN/LIMSI)**, sous CC BY-NC-SA → même statut que l'atlas : contrôle, pas base.

## Dialectes du picard (2026-10-10, demande de Romain)
Pas de carte ouverte des dialectes picards au niveau des communes (référence savante : Atlas linguistique et ethnographique picard, Carton et Lebègue, 1989-1998). Base retenue (choix de Romain) : la « Carte des variétés du picard » de Wikipédia (Epi2025, Wikimedia Commons, CC BY-SA 4.0), copie dans `Modules_cors/Autras_lengas/Oil/Picard_carte_wiki.png`, 21 parlers en trois familles (rouchi, autres parlers picards, picard gagné sur le flamand).
- `SIG/cadena/picard-carta.py` : calage affine sur 22 points (`SIG/oil/gcp-picard.csv` : embouchures de la côte, villes qui donnent leur nom aux parlers), écart moyen 7 km (pire 16 km, Lille) : la carte est schématique. Zones de couleur découpées par les traits blancs ; une zone à plusieurs noms est partagée au nom le plus proche. Sortie `SIG/oil/parlars-picards.csv` (parler de chaque commune).
- Regroupement sur la carte : **ch'ti** = Chti/Artésien urbain + Chti/Douaisien (216 communes) ; **rouchi** = Lillois, Valenciennois, Kimberlot, Avesnois (+ Tournaisien, Borain en Belgique) (399) ; **picard** = les autres parlers (2 293). « Langue picarde » entière sélectionnable à part.
- Communes de la carte des Archives classées picardes mais à plus de 15 km des zones colorées : picard sans parler.

## Noms des villes dans la langue du lieu (2026-10-10)
- Picard, normand, wallon : titres des articles des Wikipédias pcd (≈ 1 900 communes françaises), nrm (≈ 290, surtout le Cotentin) et wa (≈ 30 en France), via Wikidata (requête SPARQL sur les liens de site, données CC0) → `SIG/brut/oil/wd-*.csv`. Un nom n'est pris que dans la langue de la zone de la commune (la Wikipédia wallonne nomme aussi Rouen « Rouwan »).
- OpenStreetMap : name:pcd 694, name:nrf 363, name:wa 2401 objets (pas encore utilisés) ; rien pour le gallo, le champenois, le lorrain, le bourguignon, le franc-comtois, le poitevin-saintongeais.
- Gallo : répertoires de Chubri (« Noms en gallo de chefs-lieux de canton de Haute-Bretagne », 2015 ; livrets 44 et 56, 2014 ; graphie Moga), lus avec pdftotext (`SIG/cadena/gallo-noms.py`, 220 noms, liste dans `SIG/brut/oil/` hors Git). Les livrets portent « tous droits réservés » ; décision de Romain (2026-10-10) : un nom attesté appartient à tout le monde ; seuls les noms des villes affichées vont sur la carte, avec la source citée.
- Autres langues : introduction de l'article de la Wikipédia en français (« … en poitevin »), 3 noms trouvés (Beane, Brsuire, Leneinvile), à vérifier ; sinon nom officiel. Bilan : 210 villes (`SIG/cadena/oil-vilas.py`, espacement 22 à 30 km, pas de banlieues en grappe), dont 62 avec un nom local.

## À trouver
- Belgique : wallon (4 dialectes), picard, lorrain (gaumais), champenois (décret de la Communauté française, 1990).
- Îles Anglo-Normandes : jèrriais, guernesiais (normand).
