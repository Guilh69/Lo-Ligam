# Effectifs annoncés par la Confederacion Calandreta

**Relevé du 2026-10-23. Mis de côté par Romain le même jour : chiffres non actuels, utiles seulement pour l’évolution. État consolidé : `etat-2026-10.md`.** Chiffres recopiés tels que publiés, sommes recalculées. Tableaux : `efectius-confederacion-totals.csv` (ensemble) et `efectius-confederacion-federations.csv` (par fédération).

## Source
- Page « Efectius » du site de la Confederacion Calandreta, consultée le 2026-10-23 : https://calandreta.org/oc/efectius/
  Les chiffres sont dans le code de la page (compteurs animés) : un simple copier-coller du texte affiché ne les donne pas.
- Versions anciennes de la même page, archives de l'Internet Archive. Adresse d'une version : `https://web.archive.org/web/<version_archivee sans tirets>/https://calandreta.org/oc/efectius/`. Versions relevées : 2016-12-02, 2019-02-10, 2021-07-29, 2021-12-28, 2022-12-27, 2024-09-06 (identiques à la version du jour). Les versions du 2017-10-16, 2019-08-13, 2021-10-19, 2025-01-29 et 2025-06-14 répètent la précédente.
- Droits : les mentions légales du site réservent toute reproduction du site (textes et photos). On ne garde ici que des chiffres, c'est-à-dire des faits, cités avec leur source. Aucune copie de la page dans le dépôt.

## Ce que dit la page aujourd'hui
| Ensemble | Chiffre affiché |
|---|---|
| Élèves (« Enfants escolarizats ») | 3 981 |
| Écoles | 62 |
| Collèges | 4 |
| Lycée | 1 |
| Départements | 19 |
| Enseignants (« + ensenhaires », lu « plus de ») | 225 |
| Salariés non enseignants | 350 |
| Bénévoles des associations (« associatius ») | 10 000 |

| Fédération (graphie de la page) | Écoles | Élèves du primaire | Collèges, lycée | Collégiens et lycéens |
|---|---|---|---|---|
| Miègjorn-Pirenèus | 18 | 1 051 | 1 | 83 |
| Lengadòc | 24 | 1 775 | 3 | 212 |
| Aquitanha | 13 | 585 | 1 | 60 |
| Limousin | 1 | 20 | | |
| Provença | 3 | 104 | | |
| Auvernha | 3 | 99 | | |

## Avant de citer un chiffre : date et incohérences
1. **Aucune date.** Depuis 2021 la page ne dit plus l'année scolaire. Les archives datent la mise en ligne : chiffres par fédération actuels publiés entre le 2022-12-27 et le 2024-09-06, sans doute ceux de 2023-2024 (hypothèse). En 2016 et 2017, la page était datée (« chifras de setembre de 2016 », « de 2017 »).
2. **Total figé depuis 2022.** 3 981 est la somme de la version de décembre 2022. Les fédérations ont été mises à jour depuis, pas le total : leur somme donne **3 989** (3 634 au primaire, 355 au collège et au lycée).
3. **Le 92,5 % du primaire date de septembre 2017** (3 603 sur 3 894). Aujourd'hui la somme des fédérations donne 91,1 %.
4. **Juillet 2021** : le Languedoc affiche 1 988 élèves au primaire, ce qui donne 216 de trop au total ; 216, c'est justement son nombre de collégiens et lycéens, comptés deux fois.
5. Décembre 2021 et 2022 : 65 écoles annoncées, 66 dans la somme des fédérations. Le libellé « 3 + 1 » collèges et lycée du Languedoc (2021) ne colle pas avec le total de 4 collèges.

## Évolution (somme des fédérations, sauf mention)
| Version | Élèves | Primaire | Collège et lycée | Écoles |
|---|---|---|---|---|
| septembre 2016 | 3 795 | 3 585 | 210 | 65 annoncées (64 en somme) |
| septembre 2017 | 3 894 | 3 603 | 291 | 67 |
| en ligne en juillet 2021 | 3 937 (publié) | 3 617 (corrigé) | 320 | 64 |
| en ligne en décembre 2021 | 3 905 | 3 552 | 353 | 65 annoncées (66 en somme) |
| en ligne en décembre 2022 | 3 981 | 3 631 | 350 | 65 annoncées (66 en somme) |
| en ligne depuis 2024 au moins | 3 989 | 3 634 | 355 | 62 |

Lectures possibles, à vérifier avant tout usage public :
- le primaire tient autour de 3 600 élèves ; le collège et le lycée passent de 210 à 355 élèves (+ 69 %) entre 2016 et la version actuelle ;
- les écoles passent de 67 (2017) à 62 ;
- le Limousin passe de 57 élèves (2016) à 20, l'Aquitaine de 14 à 13 écoles après un pic à 16 (2017).

## Recoupement avec la couche de la carte
La couche `app/static/data/calandretas.geojson` reprend 58 établissements de l'annuaire de l'éducation : 53 écoles, 4 collèges, 1 lycée. Les 9 écoles absentes de l'annuaire sont dans `escolas-mancantas.md`.

Les départements sont rangés par fédération d'après la géographie (hypothèse : la page ne donne pas cette liste).

| Fédération | Départements de la couche | Écoles annoncées | Écoles de la couche | Absentes de l'annuaire | Écart |
|---|---|---|---|---|---|
| Miègjorn-Pirenèus | 09, 12, 31, 65, 81 (+ 46) | 18 | 17 | 1 (l'Esquiròl, Lot) | 0 |
| Lengadòc | 11, 30, 34 | 24 | 17 | 7 | 0 |
| Aquitanha | 24, 33, 47, 64 | 13 | 11 | 1 (Drin a drin) | il en manque 1 |
| Limousin | 87 | 1 | 1 | | 0 |
| Provença | 05, 13, 84 | 3 | 4 | | 1 de trop |
| Auvernha | 15, 43 | 3 | 3 | | 0 |
| **Total** | 18 + le Lot = **19** | **62** | **53** | **9** | **0** |

- Collèges et lycée : 1 à Toulouse, 2 collèges et le lycée en Languedoc (Montpellier, Maraussan), 1 à Pau. Conforme à la page.
- 53 + 9 = 62 et 19 départements : la liste des écoles manquantes est confirmée dans l'ensemble, et le Languedoc tombe juste.
- Restent deux écarts : une école de plus en Provence dans l'annuaire (Gap, Marseille, Orange, Valréas), une de moins en Aquitaine. Une ouverture ou une fermeture depuis la mise à jour de la page peut l'expliquer : à demander à la Confederacion.
- L'Esquiròl (Saint-Céré) n'est pas sur la carte de la Confederacion, mais le compte de Miègjorn-Pirenèus suppose une école de plus que l'annuaire : c'est elle, ou une autre.

## Ce que le site pourrait en faire (mis de côté le 2026-10-23)
1. **Note de la couche Calandretas sur la carte** (`app/src/lib/carta/catalogue.js`), qui ne dit pas aujourd'hui qu'il manque des écoles. Proposition, mots occitans vérifiés avec l'API de lo Congrès (establiment, anonciar, escòla, collègi, licèu, annuari, educacion, confederacion, dels, per) :
   - oc : « Escòlas, collègis e licèu de l'annuari de l'educacion : 58 dels 67 establiments anonciats per la Confederacion Calandreta »
   - fr : « Écoles, collèges et lycée de l'annuaire de l'éducation : 58 des 67 établissements annoncés par la Confédération Calandreta »
2. **Lecture « Reviscolada »** : les élèves par fédération, avec la date incertaine dite clairement.
3. **Page de vulgarisation** (déjà prévue pour l'enquête OPLO 2020) : la courbe 2016 à aujourd'hui, avec les réserves ci-dessus.
