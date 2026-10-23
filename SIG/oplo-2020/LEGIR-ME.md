# Enquête sociolinguistique occitane 2020 (OPLO) : taux de locuteurs par département

**Relevé du 2026-10-22 au soir. Colonne des locuteurs validée par Romain le 22-10 (« Oui ça a l'air bon ») ; colonne de la compréhension ajoutée à sa demande le même soir.**

## Source
Office public de la langue occitane (OPLO), *Enquête sociolinguistique occitane 2020 – Résultats* (volet quantitatif, institut COHDA, 8 000 personnes de 15 ans et plus, 22 départements de Nouvelle-Aquitaine et d'Occitanie + Val d'Aran) :
https://www.ofici-occitan.eu/wp-content/uploads/2020/09/OPLO_Enquete-sociolingusitique-occitan-2020_Resultats.pdf

- Définition du **locuteur** (p. 25 du rapport) : déclare parler occitan sans difficulté ou suffisamment pour tenir une conversation simple. Base : population totale de 15 ans et plus.
- Chiffres pris dans le graphique « Taux de locuteurs et total locuteurs + occitano-imprégnés par département (base totale) », p. 63, série « Locuteur – TOUS », recoupés avec les pages de focus (Dordogne 9 %, Béarn et Bas-Adour 12 %, Charente occitane 15 %, Gers 8 %, Tarn 14 %, Lozère 22 %) et les moyennes régionales (Limousin 10 %, Midi-Pyrénées 8 %, Languedoc-Roussillon 6 %, Nouvelle-Aquitaine 7 %, Occitanie 7 %, interrégional 7 %). Val d'Aran : 62 % (p. 25).
- La lecture du graphique est faite à partir du texte du PDF (étiquettes et positions) : **à contrôler à l'œil sur la page 63** pour la Corrèze (11 %, une étiquette « 10 % » voisine appartient à la série des 15-29 ans) et la Creuse (11 %).

## Deuxième niveau : la compréhension
Colonne `comprenon_pct` : part des 15 ans et plus qui **comprennent l'occitan parfaitement ou facilement** (graphique « Niveau de compréhension selon le territoire », p. 78 du rapport, page 79 du PDF, base : population totale ; capture fournie par Romain, valeurs lisibles sans ambiguïté). Moyennes : 15 % en Nouvelle-Aquitaine comme en Occitanie, 73 % au Val d'Aran. Les couples échantillonnés ensemble sont séparés d'après la note du graphique : Charente 38 % / Dordogne 19 % ; Aude 21 % / Pyrénées-Orientales occitanes 36 %.

Selon l'âge (ensemble interrégional, même graphique) : 15-29 ans 3 %, 30-44 ans 4 %, 45-59 ans 13 %, 60-74 ans 25 %, 75 ans et plus 39 %. Utile pour la page de vulgarisation.

## Ce que la carte montre (fait le 2026-10-23)
- Lecture « Uèi » de `/carta` (bascule Territòri | Uèi | Reviscolada) : un aplat par département enquêté, cinq classes (moins de 5 %, 5, 10, 15, 20 % et plus) du rose pâle au rouge profond dans tous les thèmes, découpé sur le domaine occitan (Béarn, Charente occitane) ; survol ou toucher : taux de locuteurs, compréhension, source et définition. Données recopiées dans `app/src/lib/carta/locutors.js` : **corriger ce tableau-ci d'abord, puis le module**.
- **Là où aucune enquête n'existe, rien n'est indiqué** (décision de Romain, 23-10 ; remplace le « ND affiché » prévu le 22-10). Pyrénées-Orientales occitanes : rien non plus (taux de locuteurs non publié).
- Enquêtes cherchées pour le reste du domaine : `autras-enquestas.md` (vallées d'Italie : rien, Romain 23-10 ; Auvergne : décision en attente).

## Ce qui reste à faire
1. Plus tard : une page qui vulgarise l'enquête (graphiques, analyse).
