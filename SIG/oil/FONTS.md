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

## À trouver
- Belgique : wallon (4 dialectes), picard, lorrain (gaumais), champenois (décret de la Communauté française, 1990).
- Îles Anglo-Normandes : jèrriais, guernesiais (normand).
