# Dialectes catalans : sources et incertitudes

Recherche du 2026-10-08 pour ajouter le catalan à la carte (onglet « autres langues »).
Aucune donnée géographique téléchargée : seulement des listes (noms, codes, classements).
Les noms occitans proposés (champ `oc` du JSON) sont **à valider par Romain**.

## Les trois fichiers

- `dialectes-catalan.csv` : 961 lignes, séparateur `;`, UTF-8.
- `dialectes-catalan.json` : les 7 dialectes (noms ca/fr/oc, bloc, couleur, villes capitales, sous-dialectes).
- `FONTS.md` : ce fichier.

### Colonnes du CSV

| colonne | contenu |
|---|---|
| `regio` | Catalunya, Andorra, Catalunya del Nord, Franja de Ponent (Aragó), País Valencià, Illes Balears, l'Alguer (Sardenya), el Carxe (Múrcia) |
| `unitat` | unité englobante : comarque historique (66), comarque (Franja, País Valencià), île (Baléares), commune (Carxe) |
| `mena` | `comarca` (Catalogne), `pais` (Andorre), `comuna_fr` (66), `municipi` (Franja, País Valencià, Baléares, l'Alguer), `nucli` (hameaux du Carxe, ajout par rapport à la consigne) |
| `nom_ca` | nom catalan (article en minuscule : « el Campell ») |
| `nom_oficial` | nom officiel (INSEE, INE ou IDESCAT ; bilingue « valencien / castillan » quand l'INE le donne) |
| `codi` | `idescat:NN` (comarques de Catalogne), INSEE (66), INE à 5 chiffres (Espagne), `AD` (Andorre), `istat:090003` (l'Alguer) |
| `dialecte` | `rossellones`, `central`, `balear`, `algueres`, `nordoccidental`, `tortosi`, `valencia`, ou **`exclos`** (hors domaine catalan, à ne pas dessiner) |
| `subdialecte` | `rossellones`, `capcines`, `cerda` ; `barceloni`, `tarragoni`, `xipella`, `salat`, `septentrional_transicio` ; `mallorqui`, `menorqui`, `eivissenc` ; `algueres` ; `lleidata`, `pallares`, `ribagorca`, `solsoni` ; `tortosi`, `valencia_transicio` ; `castellonenc`, `apitxat`, `meridional`, `alacanti` ; vide = pas de sous-dialecte précis |
| `transicio` | `si` si l'unité est à une limite dialectale ou linguistique (hachures possibles) |
| `nota` | explication en français |
| `font` | codes de sources, voir plus bas |

### Répartition

| région | lignes | dialecte |
|---|---|---|
| Catalogne | 43 comarques | 26 central, 12 nord-occidental, 4 tortosin, 1 exclue (Aran) |
| Andorre | 1 | nord-occidental |
| Catalogne du Nord | 226 communes | 198 roussillonnais, 28 exclues (Fenouillèdes) |
| Franja | 73 communes | 41 nord-occidental, 29 tortosin, 3 exclues (Graus, Capella, Foradada) |
| País Valencià | 542 communes (toutes) | 354 valencien, 43 tortosin (Ports, Maestrat), 145 exclues (castillan) |
| Baléares | 67 communes | baléare |
| l'Alguer | 1 | alguérois |
| el Carxe | 8 hameaux | valencien alacantin |

## Sources (codes de la colonne `font`)

| code | source | servi à |
|---|---|---|
| LUEV | Llei 4/1983 d'ús i ensenyament del valencià, art. 35 et 36, texte consolidé du BOE : https://www.boe.es/eli/es-vc/l/1983/11/23/4/con | prédominance valencienne ou castillane de chaque commune valencienne |
| VQ-PV | Viquipèdia ca, « Llista dels municipis del País Valencià » : https://ca.wikipedia.org/wiki/Llista_de_municipis_del_Pa%C3%ADs_Valenci%C3%A0 | comarque et nom catalan de chaque commune (sa colonne de prédominance contient des erreurs, non utilisée) |
| INE | INE, « Relación de municipios y sus códigos » au 1er janvier 2026 : https://www.ine.es/daco/daco42/codmun/diccionario26.xlsx | codes INE et noms officiels |
| VQ-CN | Viquipèdia ca, « Llista de comunes de la Catalunya del Nord » : https://ca.wikipedia.org/wiki/Llista_de_municipis_de_la_Catalunya_del_Nord | comarque historique et nom catalan des 198 communes catalanes |
| (local) | IGN, ADMIN EXPRESS COG CARTO 2026 (`SIG/brut/comunas/ADE-COG-CARTO_2026.gpkg`) | codes INSEE et noms officiels des 226 communes du 66 |
| VQ-FEN | Wikipédia fr « Fenouillèdes » : https://fr.wikipedia.org/wiki/Fenouill%C3%A8des et Viquipèdia ca « Fenolledès » : https://ca.wikipedia.org/wiki/Fenolled%C3%A8s | 28 communes occitanes du 66 à exclure, communes catalanes au contact |
| VQ-FRANJA | Viquipèdia ca « Franja de Ponent » : https://ca.wikipedia.org/wiki/Franja_de_Ponent et Wikipedia es « Anexo:Toponimia de los municipios de la Franja de Aragón » : https://es.wikipedia.org/wiki/Anexo:Toponimia_de_los_municipios_de_la_Franja_de_Arag%C3%B3n | communes catalanophones d'Aragon, noms catalans et castillans, communes de transition (IEC) et ajouts de la GREC |
| VQ-NOC | https://ca.wikipedia.org/wiki/Catal%C3%A0_nord-occidental | étendue du nord-occidental, sous-dialectes, transitions |
| VQ-CEN | https://ca.wikipedia.org/wiki/Catal%C3%A0_central | sous-dialectes du central |
| VQ-SEPT | https://ca.wikipedia.org/wiki/Catal%C3%A0_septentrional | roussillonnais, capcinois |
| VQ-STR | https://ca.wikipedia.org/wiki/Catal%C3%A0_septentrional_de_transici%C3%B3 | bande de transition (Cadaqués à Martinet), rangée dans le central par Veny |
| VQ-XIP | https://ca.wikipedia.org/wiki/Xipella | xipella (Conca de Barberà, Odèn, les Oluges, Cornudella, Tuixent) |
| VQ-TORT | https://ca.wikipedia.org/wiki/Tortos%C3%AD | étendue du tortosin (Catalogne, Aragon, Ports et Maestrat sauf Olocau del Rei) |
| VQ-PAL, VQ-RIB | https://ca.wikipedia.org/wiki/Pallar%C3%A8s , https://ca.wikipedia.org/wiki/Ribagor%C3%A7%C3%A0 | pallarès ; ribagorçan (Ribagorce et Llitera), benasquès de transition |
| VQ-VSEP, VQ-VCEN, VQ-VMER, VQ-VALA | Viquipèdia ca « Valencià septentrional », « Valencià central », « Valencià meridional », « Valencià alacantí » | sous-dialectes valenciens, enclave Catadau-Alfarb, limite nord de l'alacantin (Atles lingüístic valencià cité par l'article) |
| VQ-BAL | https://ca.wikipedia.org/wiki/Catal%C3%A0_balear | sous-dialectes baléares, formenterais |
| VQ-ALG | https://ca.wikipedia.org/wiki/Alguer%C3%A8s | alguérois (ville seule, classement discuté) |
| VQ-CARXE | https://ca.wikipedia.org/wiki/El_Carxe | hameaux, communes (Jumella, Iecla, Favanella), population |
| VQ-ARAN | (connaissance commune) | Aran est occitan, déjà sur la carte |
| WD | Wikidata (API) | coordonnées des hameaux du Carxe, des villes capitales, code ISTAT d'Alghero |
| — | IDESCAT, codes des comarques : https://www.idescat.cat/codis/?id=50&n=10 | codes `idescat:01` à `43` (vérifiés, Moianès 42, Lluçanès 43) |

**Honnêteté sur les sources** : le livre de Joan Veny (*Els parlars catalans*) et l'atlas de l'IEC n'ont **pas** été consultés directement. Les classements viennent des articles de la Viquipèdia, qui les citent. Pistes lues seulement en résumé : Boladeras (1999, *Miscel·lània Cerverina*, transition Segarra), Plaza i Arqué (Conca de Barberà). La Gran Enciclopèdia Catalana n'a rien donné d'exploitable en ligne.

## Choix tranchés (à relire)

1. **Septentrional de transition** (Alt Empordà, Garrotxa, Ripollès, Cerdanya) rangé dans le **central** (dernières éditions de Veny), marqué `transicio=si`. Le `rossellones` ne couvre donc que la Catalogne du Nord : la frontière d'État et la limite dialectale se confondent presque, sauf en Cerdagne, entière en central (voir 2).
2. **Cerdagne et Capcir** (décision de Romain du 2026-10-08 : même parler des deux côtés de la frontière d'État, la coupure par la frontière était un artefact de méthode). La source (VQ-STR, relue le 2026-10-08) range le septentrional de transition, bande « de Cadaqués à l'ouest de Martinet », dans le **central** d'après les dernières éditions de Veny ; l'encadré de VQ-SEPT le décrit comme les « parlars de la Garrotxa i la Cerdanya ». Donc **toute la Cerdagne** va en central, sous-dialecte `septentrional_transicio`, `transicio=si` : la Cerdanya espagnole (comarque, avec Llívia) et les 26 communes de l'Alta Cerdanya française (avant : roussillonnais, `cerda`). Le **Capcir** reste en **roussillonnais** (`capcines`) : VQ-SEPT en fait un sous-dialecte du septentrional (« Té un subdialecte, el capcinès »), et VQ-STR ne le cite pas dans la bande de transition. La zone à part « Catalunya Nord » est désormais l'union des communes catalanes du 66 (roussillonnais + Cerdagne française, `dins: ["rossellones", "central"]`).
3. **Comarques de transition en Catalogne**, rangées selon l'usage le plus courant : Conca de Barberà → central (xipella) ; Solsonès, Segarra, Priorat → nord-occidental ; Ribera d'Ebre → tortosin ; Anoia, Baix Camp → central. Toutes marquées `transicio=si`. Alta Ribagorça (côté catalan) n'est **pas** de transition : la transition avec l'aragonais concerne la Ribagorce aragonaise.
4. **Tortosin** pris comme dialecte à part (code `tortosi`), y compris dans les Ports, le Baix Maestrat et l'Alt Maestrat, que la tradition valencienne appelle « valencien de transition » (`subdialecte=valencia_transicio`). Xodos aussi (exclu du castellonenc par Viquipèdia). **Vistabella del Maestrat** rattachée de même au tortosin (`valencia_transicio`, `transicio=si`), comme Xodos sa voisine, sur recommandation de la vérification du 2026-10-08 (avant : valencien castellonenc) : **décision à valider par Romain**.
5. **Pays valencien** : prédominance d'après la **loi**, pas d'après l'usage réel. Alacant reste valencien (art. 35) malgré une demande municipale de 2025 restée sans suite. Communes créées après 1983 : prédominance héritée de la commune d'origine (Los Montesinos, Pilar de la Horadada, San Isidro → castillan ; les Alqueries, Sant Joan de Moró, Benicull → valencien). Gàtova, listée dans la province de Castelló en 1983, est rattachée à València.
6. **Sous-dialectes valenciens** : Plana et Alcalatén → castellonenc (Onda → apitxat) ; Horta, Camp de Túria, Camp de Morvedre, Ribera Alta et Baixa → apitxat (Catadau et Alfarb → méridional) ; Safor, Vall d'Albaida, Costera, Comtat, Marina Alta et Marina Baixa, Alcoi → méridional ; Alacantí, Vinalopó, Foia de Castalla, Guardamar → alacantin. Beneixama et el Camp de Mirra mis en méridional (au nord de la ligne Biar-la Canyada).
7. **Franja** : Ribagorce → ribagorçan ; Llitera → ribagorçan (Viquipèdia) ; Baix Cinca → lleidatan ; Matarranya, Bas-Aragon catalanophone, Maella, Favara, Faió, Nonasp → tortosin, tous `transicio=si`.
8. **Le Carxe** : rangé dans l'alacantin (l'article « Valencià alacantí » le cite, l'article « el Carxe » parle de méridional au sens large ; colons venus du Pinós, de Monòver, de l'Alguenya, de Novelda).
9. **Formentera** : `eivissenc` (le formenterais est tantôt compté à part, tantôt avec l'ibicenc).

## Ce qui reste incertain

- **Benasquès** (Benasque, Bisaurri, Castejón de Sos, Chía, Sahún, Sesué, Villanova) : parler de transition aragonais / catalan, compté par la GREC, **pas** par l'IEC. Laissé en nord-occidental avec `transicio=si`. Depuis le 2026-10-08 (Romain : une zone de transition avec la langue voisine est marquée comme « parler de transition »), catalan.json porte en plus une zone `trans-benasques` (`entre: ["nordoccidental", "aragonés"]`), posée par-dessus le nord-occidental et hachurée par la carte ; de même `trans-septentrional` (`entre: ["central", "rossellones"]`) pour le septentrional de transition.
- **Torre la Ribera, Valle de Lierp, Beranuy** : à la limite de l'aragonais, marqués transition. Graus, Capella, Foradada del Toscar : communes exclues, mais quelques hameaux catalanophones (Güel, Torres del Bisbe, Jusseu, Llaguarres, Espluga, Vacamorta) ; à représenter par un point si on veut être fin.
- **Bélesta, Caramany, Cassagnes, Montalba-le-Château, Planèzes, Rasiguères, Latour-de-France** : occitan de transition vers le catalan (« Fenolleda rossellonesa »). Exclus du catalan, marqués `transicio=si`. Côté catalan, Estagel, Tautavel, Montner, Arboussols, Tarerach sont marqués transition.
- **Population de Caudiès-de-Conflent** erronée dans la liste Viquipèdia (139 au lieu de 23) : corrigé à la main ; Casteil = Castell de Vernet.
- **Limites internes en Catalogne** : comarque entière attribuée à un seul dialecte. Les vraies isoglosses coupent la Segarra, la Conca de Barberà, le Priorat, la Ribera d'Ebre, l'Anoia, le Baix Camp. Pas de source en ligne assez fine pour descendre à la commune.
- **Limites internes au Pays valencien** : apitxat / méridional dans la Ribera (le sud de la Ribera Alta et de la Ribera Baixa est de transition), Plana Baixa sud (la Vall d'Uixó, Almenara, Xilxes), limite alacantin / méridional « diffuse » selon l'article. Attribution par comarque, sauf les exceptions notées.
- **Sant Antoni de Benaixeve** (1997, issue de Paterna) : absente de la loi, Viquipèdia la dit castillanophone. Laissée valencienne (héritage), `transicio=si`.
- **L'Alcúdia de Veo** : seul le noyau principal est valencianophone (la loi le précise), les hameaux de Veo et Benitandús sont castillanophones.
- **Emperador** : absent du texte publié de la loi (probable oubli), compté valencien.
- **Puebla de Rocamora** : citée par la version valencienne de la loi, n'est pas une commune INE (sans effet).
- **Hameaux du Carxe** sans coordonnées trouvées : la Raixa, la Sarsa, el Collado dels Gabriels (dans la zone centrée vers lat 38.40, lon -1.10). Repère : la Serra del Carxe, lat 38.4272, lon -1.1647.
- **Code ISTAT d'Alghero** : 090003 (ancienne province de Sassari) ; Wikidata donne aussi 112001 (après la réforme sarde). Choisir selon le fond de carte.
- **Coordonnée d'Eivissa (ville)** : de mémoire (lat 38.9089, lon 1.4329), Wikidata n'a renvoyé que l'île.
- **Noms occitans** des dialectes et sous-dialectes : tous à valider (par exemple « lheidatan », « castelhonenc », « apichat »).
