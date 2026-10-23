# Cercles occitans et associations de terrain : inventaire des sources

**Étape 1, relevé du 2026-10-23. Rien n'est construit : le périmètre, le critère « vivant », les sources et la forme sur la carte reviennent à Romain (voir « Choix en attente » en bas).**

Les Calandretas sont faites à part (`SIG/calandretas/`), l'enseignement scolaire aussi (`SIG/ensenhament/`). Les cours pour adultes donnés par les associations sont de ce côté-ci.

## Ce qu'on cherche
Les structures de terrain qui font vivre la langue : cercles occitans, ostals, sections et cercles locaux de l'Institut d'estudis occitans (IEO), escolo du Félibrige, associations Parlaren, associations de cours, de théâtre, de chant ou de veillées en occitan. Sur tout le domaine : 4 régions françaises, Val d'Aran, vallées d'Italie, Monaco.

## En bref
| Source | Couverture | Licence | Format | Fraîcheur | Usage proposé |
|---|---|---|---|---|---|
| Répertoire national des associations (RNA) | toute la France, toutes les associations déclarées | **Licence Ouverte** | CSV par département (500 Mo) | mensuelle, fichier du 2026-10-01 | **base** : identité, commune, date de dernière déclaration, dissolution |
| Guide du réseau IEO Occitanie 2026 | région Occitanie : ~110 associations (9 sections, cercles locaux, 82 adhérentes) | aucune (document de l'IEO) | PDF | **juin 2026** | **preuve de vie** et contrôle, rien recopié |
| Carte « Actors de terren » de l'OPLO (uMap 1186246) | 22 départements (Occitanie, Nouvelle-Aquitaine) : 439 structures culturelles, 279 cours pour tous publics (169 organisateurs) | **aucune déclarée** | GeoJSON (uMap) | février 2026 | contrôle ; réutilisation seulement avec l'accord écrit de l'OPLO |
| Listes des escolo du Félibrige | Provence ~50, Aquitaine 8, Limousin ~10 ; rien pour Auvergne, Languedoc, Gascogne | aucune | pages web | non datées | preuve de vie |
| Lo CalenDiari (agenda occitan, OpenAgenda 41454951) | 2 110 événements depuis 2017, surtout 2024-2026 ; fort en Haute-Garonne, faible en Provence | **Licence Ouverte 2.0** (champ `rights` de chaque événement) | JSON | quotidienne | **preuve de vie** (un événement récent) |
| Registre des entités de Catalogne | Val d'Aran : 174 entités, une douzaine liées à l'aranais | licence ouverte de la Generalitat (attribution) | API (jeu `y6fz-g3ff`) | 2026-10-22 | base pour l'Aran |
| Annuaire des entreprises (API recherche-entreprises) | associations qui ont un SIRET seulement | Licence Ouverte | API | quotidienne | appoint |
| Observatoire du Collectif Prouvènço (Óusservatòri) | Provence : ~450 associations, traditions comprises | aucune | pages web | 2021-2025 | contrôle prudent (voir plus bas) |

## Les sources une par une

### 1. Répertoire national des associations (RNA)
- data.gouv.fr, jeu « Répertoire National des Associations » (ministère de l'Intérieur), Licence Ouverte. Deux fichiers : `rna_waldec` (associations déclarées ou modifiées depuis 2009 environ, 410 Mo) et `rna_import` (anciennes associations jamais remises à jour depuis, 98 Mo). Téléchargés le 2026-10-23 hors du dépôt.
- Champs utiles : titre, objet, adresse du siège, date de création, **date de la dernière déclaration**, date de dissolution, position (active, dissoute, supprimée), code d'objet. Le code `006110` veut dire « langues, dialectes, patois ».
- Filtre par mots-clés (`filtrar_rna.py`, 8 min) : occitan, IEO, Institut d'estudis occitans, Félibrige, escolo, ostal, ostau, lenga, Parlaren, òc, langue d'oc, plus provençal, gascon, béarnais, nissart, patois et le code `006110`. « Occitanie » (la région) est exclu. **13 617 candidats** bruts sur toute la France.
- Tri en classes (`classar_rna.py`) : « langue » quand le nom ou l'objet parle de la langue (ou nom de réseau : cercle occitan, IEO, Félibrige, Parlaren…), « culture » quand une variété est citée avec chant, danse, théâtre, tradition…, le reste en bruit. Sur le domaine, doublons retirés :

| Région | Classe « langue » | dont déclarée depuis 2021 | 2016-2020 | avant 2016 | jamais remise à jour (avant 2010) | dissoute |
|---|---|---|---|---|---|---|
| Occitanie | 527 | 199 | 71 | 116 | 88 | 53 |
| Nouvelle-Aquitaine | 287 | 108 | 39 | 54 | 39 | 47 |
| Auvergne-Rhône-Alpes | 125 | 51 | 20 | 29 | 14 | 11 |
| Provence-Alpes-Côte d'Azur | 348 | 149 | 45 | 64 | 50 | 40 |
| **Total** | **1 287** | **507 (39 %)** | **175 (14 %)** | **263 (20 %)** | **191 (15 %)** | **151 (12 %)** |

- **Précision** : sur un échantillon tiré au hasard, environ **3 sur 4** sont vraiment des associations de langue. Les faux positifs : « Cercle de jeux occitan » (rugby), « Félibrige H2O » (réseau d'eau d'un lieu-dit), un habitat pour seniors nommé « L'Ostal », du francoprovençal en Isère, des associations de langues en général. La classe « culture » (2 335 candidats) n'est juste qu'**une fois sur deux** (groupes de musique sans lien avec l'occitan, propriétaires forestiers des « coteaux gascons »…).
- **Rappel** : une structure de l'IEO apparaît dans 29 départements du domaine, souvent sous son nom complet et pas « IEO 09 » (Per Noste, section béarnaise, sans le sigle ; rien trouvé sous ce nom pour le Tarn-et-Garonne ni la Creuse) ; 185 associations du Félibrige, escolo ou Parlaren ; 83 « cercles occitans ». Ce que le RNA ne peut pas trouver : les foyers ruraux, MJC, cafés, compagnies et librairies qui font de l'occitan sans le dire dans leur objet. Le guide IEO 2026 en compte une vingtaine en Occitanie.
- Les dissolutions sont régulières : 4 à 10 par an dans la classe « langue » depuis 2015 (IEO de Haute-Vienne et de Charente, cercle IEO du Haut-Rouergue, Gents de Ventor…).
- Adresse : le siège est souvent le domicile d'un membre. **Sur la carte, ne placer qu'à la commune.**

### 2. La date de dernière déclaration est-elle un bon indice de vie ?
Contrôle fait sur les 39 associations adhérentes du guide IEO 2026 (vivantes par définition) retrouvées sans ambiguïté dans le RNA : 26 déclarées depuis 2021, 3 entre 2016 et 2020, **7 avant 2016**, 3 notées dissoutes (sans doute des homonymes ou d'anciens dossiers). Une déclaration récente est donc un bon signe, mais **son absence ne prouve pas la mort** : une association vivante sur quatre n'a rien déclaré depuis dix ans. Il faut une autre preuve (réseau, agenda, presse).

### 3. Guide du réseau IEO, Occitanie Pyrénées-Méditerranée
- 2026 : https://ieo-opm.com/wp-content/uploads/GuideReseauIEO2026.pdf (créé le 2026-06-23, 21 pages). 2024-2025 : https://ieo-opm.com/wp-content/uploads/GuideReseauIEO2024.pdf.
- Sections départementales et cercles affiliés avec leurs activités (cours, ateliers, veillées), puis 82 associations adhérentes par département. Contient des noms, téléphones et courriels de personnes : **rien n'en est recopié**. Usage : cocher « vu dans le guide IEO 2026 » sur une association trouvée dans le RNA, avec le lien.
- Ailleurs, pas d'équivalent trouvé : IEO Aquitània (site ancien), IEO Lemosin (pas de liste), IEO Provence (ieo-creo-provence.org : une carte de fond seulement), sites IEO 04-05, 06, 83, 84 sans liste commune.

### 4. Carte « Actors de terren » de l'OPLO
- https://umap.openstreetmap.fr/fr/map/actors-de-terren-siti_1186246 , compte de l'Office public de la langue occitane, modifiée le 2026-02-09. **Aucune licence déclarée** (même constat que `SIG/ensenhament/LEGIR-ME.md` pour la carte voisine 1158538).
- Calques utiles ici : « Culture et Patrimoine » (439 structures avec nom, description, ville, département : associations de langue, éditeurs, festivals, foyers ruraux, associations de parents de Calandreta) et « Cours et ateliers tous publics » (279 cours, 169 organisateurs, en tête le CFPOC, Parlem !, l'IEO du Lot). Les autres calques (écoles, collèges, lycées) relèvent de l'enseignement.
- C'est la meilleure liste sur ses 22 départements. L'OPLO est un groupement d'intérêt public : ses informations publiées sont en principe réutilisables (code des relations entre le public et l'administration, art. L321-1), sauf données personnelles, mais **mieux vaut un accord écrit** avant d'en reprendre quoi que ce soit.

### 5. Félibrige
- Le site national (felibrige.org) n'a pas de liste. Les sites des maintenances en ont : Provence (provence.felibrige.org/escolo-felibrenco-prouvenco/, ~50 escolo avec leur ville), Aquitaine (8), Limousin (une dizaine, avec dates de création). Auvergne : pas de page ; Languedoc et Gascogne : sites injoignables le 23-10.
- Statuts : une escolo doit prévoir « une formation dans la langue d'Oc » : elle entre dans le périmètre.

### 6. Lo CalenDiari, l'agenda occitan commun
- https://agenda.lodiari.com (IEO Occitanie avec lo Congrès et l'OPLO ; Jornalet renvoie aussi à cet agenda). Moteur OpenAgenda, export JSON public, **chaque événement sous Licence Ouverte 2.0**.
- 2 110 événements (539 entre le 2025-10-23 et le 2026-10-23, dans 195 communes). Haute-Garonne 181, Hérault 55, Aveyron 50, Tarn et Pyrénées-Atlantiques 38, Gironde 30 ; Bouches-du-Rhône 18, Vaucluse 3, Alpes-Maritimes 0.
- L'organisateur n'est pas un champ à part : il se lit dans le texte ou l'agenda d'origine. Essai grossier : le nom de 61 des 945 associations « langue » actives du RNA apparaît dans un événement de l'année. **Une présence prouve la vie ; une absence ne prouve rien.**
- Ràdio Lenga d'Òc et La Setmana : pas d'agenda en ligne trouvé.

### 7. Provence : l'observatoire du Collectif Prouvènço
- https://www.observatoire-provence.com/associations/ (Óusservatòri, Cheval-Blanc) : ~30 pages de 15 fiches, associations de langue et de traditions (confréries, feux de la Saint-Jean, élection d'ambassadrices…). Aucune licence.
- Le Collectif Prouvènço défend le provençal comme langue distincte de l'occitan. Décision de Romain (2026-10-23) : le provençal est de l'occitan, la Provence est montrée entière, et le débat est mentionné comme une information. L'annuaire n'ayant pas de licence, il sert de preuve de vie (avec lien), l'identité des associations venant du RNA.

### 8. Val d'Aran
- « Entitats jurídiques del Registre d'entitats de Catalunya » (analisi.transparenciacatalunya.cat, jeu `y6fz-g3ff`, mis à jour le 2026-10-22) : 174 entités dans l'Aran. Une douzaine liées à l'aranais : Institut d'Estudis Aranesi (académie de la langue), Centre d'Estudis Aranesi, Es Paoms (musique et langue), Almosc (interculturel occitano-catalan)… L'état « Inscrita » ne prouve pas l'activité.

### 9. Vallées occitanes d'Italie
- Registre national du tiers secteur (RUNTS) : consultable fiche par fiche, **pas d'export national ouvert trouvé**. Les associations sont peu nombreuses (Chambra d'Òc, Espaci Occitan à Dronero, quelques associations de vallée) : liste à faire à la main depuis leurs sites, une vingtaine attendue.

### 10. Monaco
- Rien trouvé. La langue propre de Monaco est le monégasque (ligure) ; aucune association occitane repérée.

### 11. À côté, non retenu ou non mesuré
- **OpenStreetMap** : les serveurs Overpass ont refusé ou dépassé le temps les 4 essais du 23-10. Non mesuré, à refaire si besoin.
- **Annuaire des entreprises** (recherche-entreprises.api.gouv.fr) : ne voit que les associations qui ont un SIRET (47 « cercle occitan ») et les dit presque toutes actives. Utile pour un lien vers la fiche, pas pour la vie.
- **Occitanica / CIRDÒC** : pas d'annuaire des associations (Vidas est un dictionnaire de personnes).
- **Presse régionale** (flux Google Actualités, html.duckduckgo.com, puis lecture avec curl) : méthode éprouvée pour les Calandretas, à réserver aux cas douteux, elle coûte cher à grande échelle.
- **Journal officiel des associations** : non regardé ; les dissolutions déclarées sont déjà dans le RNA.

## Mortes ou en sommeil : ce qu'on peut dire
Sur les 1 287 associations « langue » du RNA dans le domaine : 12 % dissoutes, 15 % jamais remises à jour depuis 2009 environ, 20 % sans déclaration depuis 2016. Avec le contrôle du point 2, une estimation honnête : **entre un tiers et la moitié des associations inscrites ne sont plus actives**, sans qu'on puisse dire lesquelles sans preuve de vie.

## Ce qui manque partout
1. Une liste des réseaux hors de la région Occitanie (IEO de Nouvelle-Aquitaine, d'Auvergne-Rhône-Alpes, de Provence).
2. Un champ « organisateur » dans l'agenda.
3. Toute source pour l'Italie et Monaco.

## Fichiers de ce dossier
- `filtrar_rna.py` : filtre des deux fichiers du RNA par mots-clés (`py -I filtrar_rna.py <waldec.zip> <import.zip> <sortie.csv>`).
- `classar_rna.py` : classes langue / culture / bruit et tableaux ci-dessus.
- Les extractions restent hors du dépôt (dossier de travail de la séance) : elles se refont en dix minutes.

## Choix de Romain (2026-10-23)
L'option la plus complète : langue et culture, Provence comprise (le débat sur le provençal mentionné comme une information), carte de l'OPLO reprise sans demande préalable (ses mentions légales le permettent, avec mention de l'OPLO et du lien, hors usage commercial ; ni données personnelles ni textes recopiés). Plan détaillé au cahier des charges § 11, entrée du 2026-10-23.

## Étape 2 : la couche (2026-10-23)
`app/static/data/cercles.geojson` (185 Ko, 33 Ko compressé) : **983 points**, dont 547 associations de langue (couche « Cercles e associacions ») et 436 de culture (« Associacions culturalas »), dans la lecture Reviscolada. Point plein : activité prouvée (434) ; point vide : seulement déclarée en préfecture depuis 2021 (549).
- RNA : 1 386 fiches relues à la main, 821 gardées (`decisions.csv` : id, décision, nom). Écartés : pétanque et joutes « provençales », clubs taurins, gastronomie, comités des fêtes, crèches et santons, loges, francoprovençal, catalan, basque.
- Carte de l'OPLO : 151 structures sans fiche au RNA, gardées par règles (`autras.py`, sans associations de Calandreta, institutions, médias, éditeurs ni conservatoires) ; 19 doublons passent leur preuve à la fiche du RNA.
- Val d'Aran : 11 associations du registre catalan (point vide : l'inscription ne prouve pas l'activité).
- Cours : 93 associations marquées « cours d'occitan » (carte de l'OPLO).
- Chaîne : `filtrar_rna.py` → `classar_rna.py` → `crosar.py` → `relectura.py` (liste à relire) → `autras.py` → `exportar.py`.

**Reste à faire** : vallées d'Italie (liste à la main) ; contrôle par Romain des libellés occitans de la couche et des bulles ; les 152 cours sans organisateur retrouvé.
