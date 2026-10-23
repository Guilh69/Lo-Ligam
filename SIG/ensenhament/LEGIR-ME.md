# Établissements qui enseignent l'occitan (hors Calandretas) : inventaire des sources

**Relevé du 2026-10-23 ; plan retenu le même jour (Romain : la liste des établissements est une donnée publique, pas de demande à faire), voir « Ce qui est construit » en bas. Relevé à valider par Romain.**

Les Calandretas sont faites à part : `SIG/calandretas/` et la couche `app/static/data/calandretas.geojson`. Les cercles occitans et les cours pour adultes relèvent d'une autre conversation.

## Ce qu'on cherche
- **Écoles publiques** à filière bilingue français-occitan (parité horaire), et si possible l'enseignement « renforcé » (3 h par semaine).
- **Collèges et lycées** : section bilingue, option de langue et culture régionales (collège), langue vivante B ou C (lycée), enseignement de spécialité LLCER occitan (première et terminale).
- **Supérieur** : licences, masters, diplômes d'université, formation des enseignants (INSPE, Aprene).
- Hors de France : Val d'Aran, vallées occitanes d'Italie.

## En bref
| Niveau | Meilleure source sous licence ouverte | Ce qu'elle donne | Ce qui manque |
|---|---|---|---|
| Écoles bilingues publiques | **aucune** | | toute la liste ; seule la carte de l'OPLO la donne (reprise avec mention, § 6), sur 22 départements |
| Collèges | ONISEP « Langues au collège » (ODbL) ; « Offre de langues » (Licence Ouverte) | l'occitan en LV2 seulement : 8 à 10 collèges | l'option de langue régionale et les sections bilingues, c'est-à-dire presque tout |
| Lycées | ONISEP « Enseignements optionnels de seconde » et « Spécialités de première » (ODbL) | LVC occitan, spécialité LLCER occitan, par établissement | fichier à jour inaccessible depuis ce poste (voir § 3) |
| Supérieur | Parcoursup et Mon Master (Licence Ouverte) | 3 licences, 2 masters de recherche, les masters MEEF occitan, la nouvelle licence de professorat de Carcassonne | les diplômes d'université, les options et unités d'enseignement, Aprene |
| Val d'Aran | annuaire des écoles de Catalogne (licence ouverte de la Generalitat) | les 14 établissements de l'Aran en 2026-2027 | rien : l'aranais y est langue d'enseignement |
| Italie | aucune | | toute la liste |

## Les sources une par une

### 1. Annuaire de l'éducation (`fr-en-annuaire-education`)
- data.education.gouv.fr, **Licence Ouverte 2.0**, mis à jour chaque jour (relevé du 2026-10-23).
- **Aucun champ de langue régionale.** Il a des champs pour les sections européennes, internationales, sportives, artistiques, pas pour les langues régionales.
- Utile quand même : il donne le code UAI, les coordonnées et l'état (ouvert ou fermé) de chaque établissement. C'est la table de jointure de toute couche, quelle que soit la source de la liste.

### 2. Offre de langues dans les collèges et lycées (`fr-en-offre-langues-2d`)
- data.education.gouv.fr, **Licence Ouverte 2.0**, rentrée 2024, mis en ligne le 2026-01-31, tiré des données de l'ONISEP. 39 858 lignes (établissement × langue).
- Ne connaît que trois enseignements : LV1, LV2, langues anciennes. **L'occitan n'y apparaît qu'en LV2 : 30 établissements** (20 lycées, 10 collèges ; académies de Toulouse 24, Montpellier 5, Bordeaux 1 ; 28 publics, 2 privés).
- Manque : l'option de langue régionale du collège, la LVC et la spécialité du lycée, les sections bilingues. À lui seul, il donnerait une carte très trompeuse.

### 3. ONISEP, jeux « Idéo » (`opendata.onisep.fr`, aussi publiés sur data.gouv.fr)
- Licence **ODbL** (attribution, et partage à l'identique si on rediffuse une base qui en dérive). Mis à jour le 2026-10-22.
- **Serveur inaccessible depuis ce poste** (erreur 403 en ligne de commande comme dans le navigateur, le 2026-10-23 ; peut-être un blocage du réseau ou du VPN). À retenter depuis le navigateur de Romain. Lu ici par les copies d'archive.org :
  - « Idéo-Langues au collège » (copie du 2025-03-26, 7 139 collèges) : LV1 et LV2 seulement ; **8 collèges** ont l'occitan en LV2 (Toulouse 7, Montpellier 1). L'option de langue régionale n'y est pas.
  - « Idéo-Enseignements optionnels de seconde générale et technologique » (copie de 2021, tronquée) : l'occitan y figure comme option (LVC). La version à jour est à télécharger.
  - « Idéo-Enseignements de spécialité de première générale » (copie de 2025-02, tronquée) : « LLCER occitan-langue d'oc » y figure, par établissement.
  - « Idéo-Actions de formation initiale, univers enseignement supérieur » : à croiser avec Parcoursup pour le supérieur.
- Manque : les écoles, et au collège tout ce qui n'est pas LV2.

### 4. Parcoursup (`fr-esr-parcoursup`, `fr-esr-cartographie_formations_parcoursup`)
- data.enseignementsup-recherche.gouv.fr, **Licence Ouverte 2.0**. Session 2025 (vœux et places), cartographie des formations 2020 à 2026 (avec coordonnées).
- Formations dont l'intitulé nomme l'occitan :
  - Toulouse, Université Toulouse Jean Jaurès : licence LLCER parcours occitan (65 places en 2025) ; parcours bi-disciplinaire occitan-catalan (10 places). Chaque année depuis 2020.
  - Montpellier, Université Paul-Valéry : licence LLCER parcours occitan (45 places en 2025). Chaque année depuis 2020.
  - **Nouveau en 2026** : Carcassonne, Université de Montpellier : licence « Professorat des écoles, parcours langues régionales occitan » (la même existe à Perpignan pour le catalan).
- Manque : les options, mineures et unités d'enseignement d'occitan dans d'autres licences (Bordeaux Montaigne, Pau, Aix-Marseille, Nice…), qui n'ont pas d'intitulé propre.

### 5. Mon Master (`fr-esr-mon_master`)
- Même portail, **Licence Ouverte 2.0**, campagnes 2024 et 2025.
- Masters dont l'intitulé nomme l'occitan (2025) :
  - Toulouse Jean Jaurès : master LLCER « Étude et valorisation des patrimoines occitan et catalan » (EVOCA) ; master MEEF second degré occitan (INSPE de Toulouse) ; master MEEF premier degré « professeur des écoles bilingue français-occitan » (sites de Montauban et de Tarbes).
  - Paul-Valéry Montpellier : master LLCER « Études occitanes » ; master MEEF second degré occitan (avec l'INSPE).
  - Université de Montpellier, faculté d'éducation, site de Carcassonne (et Perpignan) : master MEEF premier degré « langue régionale occitan ».
  - Université de Bordeaux, INSPE de Pau : master MEEF premier degré, parcours bilingue français/occitan.
- Attention aux faux positifs : à Toulouse, le département s'appelle « Lettres modernes, cinéma et occitan », ses masters de lettres et de cinéma ne sont pas des masters d'occitan.

### 6. Carte uMap de l'OPLO « Ensenhament 24-25 » (n° 1158538)
- https://umap.openstreetmap.fr/fr/map/1158538 , compte « OficiPublicdelaLengaOccitana ». Aucune licence déclarée sur la carte, mais **les mentions légales de l'OPLO** (https://www.ofici-occitan.eu/fr/mentions-legales/, lues le 2026-10-23) disent que la reproduction des textes publiés « n'est pas soumise à une autorisation préalable », avec mention obligatoire de l'OPLO et de l'adresse de la source, hors usage commercial ou publicitaire ; les utilisateurs doivent **informer** la direction de l'OPLO de l'usage qui en est fait (une information, pas une demande). Décision de Romain (2026-10-23) : la liste est reprise, sans demande. On n'en garde que le code UAI et la forme d'enseignement.
- La carte « Actors de terren » (n° 1186246, modifiée le 2026-02-09) reprend les mêmes calques scolaires, avec un collège de plus (230) : c'est elle que lit le script.
- La source la plus complète, mais sur **les 22 départements de l'OPLO seulement** (académies de Toulouse, Montpellier, Bordeaux, Limoges). Rentrée 2024. Huit calques :

| Calque | Objets | Détail |
|---|---|---|
| Calandreta, immersif | 59 | déjà couvert |
| 1er degré, bilingue (parité horaire) | 188 | Toulouse 82, Bordeaux 77, Montpellier 29 ; 187 publics |
| 1er degré, renforcé (3 h par semaine) | 78 | Bordeaux 54, Montpellier 13, Toulouse 10, Limoges 1 |
| 1er degré, extensif (30 min à 1 h 30) | 448 | Toulouse 304, Montpellier 144 ; surtout des initiations par des associations |
| Collèges | 229 | option 173, enseignement d'une matière en occitan + option 56 |
| Lycées | 62 | LVC 31, LVB + LVC 17, spécialité LLCER 4, section bilingue 1… |
| Enseignement supérieur | 16 | universités, INSPE, Aprene |
| Départements | 22 | contours |

- Le code UAI de chaque école figure dans son adresse électronique (188 écoles bilingues sur 188) : la jointure avec l'annuaire de l'éducation (§ 1) donne les positions sans rien géocoder. Les colonnes latitude et longitude du calque sont fausses (géocodage raté), ne pas s'y fier.
- L'OPLO est un groupement d'intérêt public : ses données publiées sont aussi des informations publiques réutilisables (code des relations entre le public et l'administration, article L321-1), à condition de citer la source et la date et de ne pas en dénaturer le sens.

### 7. Relevés de la FELCO (« Efectius 2025 »)
- https://www.felco-creo.org/wp-content/uploads/2025/08/2508-24-FELCO-Efectius-2025-V220825.pdf (9 pages, août 2025). Fédération des enseignants de langue et culture d'oc. Pas de licence : référence.
- **Des totaux, pas de liste** : 8 académies (Aix-Marseille, Bordeaux, Clermont-Ferrand, Grenoble pour la Drôme et l'Ardèche, Limoges, Montpellier, Nice, Toulouse), chiffres des conseils académiques des langues régionales, rentrée 2024 (2023 pour Aix-Marseille) : **99 806 élèves** reçoivent un enseignement de ou en occitan, soit 3,3 % des élèves, « pour l'immense majorité » de la sensibilisation au primaire. Une page par académie, avec le détail primaire, collège, lycée.
- C'est la seule source qui couvre Provence, Alpes, Drôme et Cantal. Utile pour une page de chiffres, pas pour des points.

### 8. Documents des rectorats et des services départementaux
- Présentations des conseils académiques et des groupes de travail départementaux, souvent publiées par les syndicats ou la FELCO. Ce sont des documents administratifs, citables avec leur source. Exemples lus :
  - Académie de Toulouse, éléments pour le conseil académique du 2024-12-13 : 5 206 élèves en cursus bilingue du premier degré (parité et immersif) ; la carte des sites y est une image.
  - Haute-Garonne, groupe de travail 2025-2026 : 569 élèves bilingues dans le public, 6 sites ; section bilingue 158 élèves dans 4 collèges ; option 540 élèves dans 18 collèges. Les sites ne sont pas tous nommés.
  - Autres documents repérés : Aude, Gard, Lozère, Cantal (conseil académique d'Aurillac, 2025-07-01).
- Manque : une liste nommée et complète. Reconstituer les écoles à partir de ces documents serait long et partiel.

### 9. Documents des villes
- Toulouse Métropole, plaquette 2025 : 4 sites bilingues publics à Toulouse (groupes scolaires Bayard-Matabiau, La Gloire-Bonhoure, Ada Lovelace, Molière). Montpellier (2024-12) : un seul site bilingue public (maternelle Francis Garnier et élémentaire Marie de Sévigné). Pau : sites Stanislas Lavigne et Bosquet (2024-2025).
- Utile pour contrôler, pas pour couvrir.

### 10. Val d'Aran : annuaire des écoles de Catalogne
- « Directori de centres docents », portail de données ouvertes de la Generalitat (analisi.transparenciacatalunya.cat, jeu `kvmv-ahh4`), licence ouverte de la Generalitat (attribution). Coordonnées, niveaux, année scolaire.
- **14 établissements dans l'Aran en 2026-2027** (15 l'année d'avant). L'aranais y est la langue d'enseignement (statut contesté depuis la loi catalane 8/2022 ; le Conselh Generau d'Aran demande qu'il reste langue d'enseignement) : toutes les écoles de l'Aran peuvent figurer, avec cette note.

### 11. Vallées occitanes d'Italie
- Pas de liste trouvée. La loi 482/1999 permet l'occitan à l'école dans les communes désignées ; les projets sont financés année par année. L'annuaire des écoles italiennes est ouvert, mais il ne dit pas lesquelles enseignent l'occitan.
- À laisser vide pour l'instant, ou à chercher plus tard du côté de la Région Piémont (minoranzelinguistiche.regione.piemonte.it).

### 12. À côté
- « Opération Caminaires 2019-2020 », département des Hautes-Pyrénées (data.gouv.fr, licence non précisée) : initiation à l'occitan en maternelle et primaire, ancien.
- « Langues vivantes enseignées dans l'enseignement agricole » (ministère de l'Agriculture, 2017) : ancien, non regardé en détail.

## Ce qui manque partout
1. **Les écoles bilingues publiques** : aucune liste ouverte, dans aucune académie. C'est pourtant le cœur de la reviscolada à l'école.
2. **L'option de langue régionale au collège**, la forme la plus répandue au collège (173 collèges sur la carte de l'OPLO) : absente des données ouvertes.
3. **Hors des 22 départements de l'OPLO** (Provence, Alpes-Maritimes, Drôme, Cantal, Haute-Loire, Italie) : des totaux seulement, aucune liste.

## Ce qui est construit (2026-10-23)
Plan retenu : cahier des charges § 11, entrée du 2026-10-23 (« L'enseignement de l'occitan sur la carte »).

- **Script** : `SIG/cadena/ensenhament.py` (depuis la racine : `py -I SIG/cadena/ensenhament.py`, ajouter `--refrescar` pour tout retélécharger). Réponses brutes dans `SIG/brut/ensenhament/` (hors Git).
- **Tableau sourcé** : `establiments.csv`, un établissement par ligne (niveau, forme, code UAI, nom officiel, commune, département, académie, position et sa source, source de la liste).
- **Supérieur** : `superior.csv`, écrit à la main (formations séparées par « | », sources ; position fixée à la main quand le géocodage échoue, ici Béziers d'après la cartographie Parcoursup 2026).
- **À regarder** : `a-verificar.csv`. Une école dont le code a disparu de l'annuaire (fermée, ou fondue dans une école primaire) est remplacée par l'établissement ouvert du même type, à moins de 200 m de son adresse et partageant un mot de son nom ; sinon elle est écartée. Deux codes faux dans la carte de l'OPLO sont ainsi corrigés (collège du Fezensaguet, collège René Billères).
- **Couche de la carte** : `app/static/data/ensenhament.json`, format compact décrit dans le script (75 Ko, 18 Ko à l'envoi). Dans le rail, famille « Ensenhament » (2026-10-23) : Calandretas, Escòlas bilingüas (avec les écoles de l'Aran), L'occitan a l'escòla (renforcé et sensibilisation), Collègis e licèus (avec l'institut de l'Aran), Universitats e formacion, Corses per adults (lus dans `cercles.geojson`, propriété `k`). Répartition : `app/src/lib/carta/ensenhament.js`.

| Niveau | Établissements |
|---|---|
| École bilingue (parité horaire) | 180 |
| École, enseignement renforcé (3 h par semaine) | 78 |
| École, sensibilisation (30 min à 1 h 30) | 395 |
| Collège | 230 |
| Lycée | 62 |
| Supérieur | 17 |
| Val d'Aran (écoles, institut, formation professionnelle) | 8 |
| **Total** | **970** |

Les Calandretas (codes de `calandretas.geojson`) sont retirées. Écartés du Val d'Aran faute de preuve : crèches, école des techniciens sportifs, centre pour adultes.

À faire : informer l'OPLO de l'usage de sa liste (ses mentions légales le demandent), une fois la couche en ligne ; lycées à recouper avec les fichiers de l'ONISEP quand le serveur répondra.
