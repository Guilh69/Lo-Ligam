# Le pays mentonnais sur la carte : sources et incertitudes

*2026-10-12. Note de prudence demandée par Romain : « je connais mal cette zone, il faut faire attention, c'est une zone complexe avec le niçois, le ligure, le gavot ». Rien ne doit changer à l'est des Alpes-Maritimes sans source précise.*

## Ce qui a été fait

- **2026-10-07** : décision « le mentonnais est vivaro-alpin » (`revisions/2026-10-08-lengas-escalas.md`), d'après Dalbera 1994.
- **2026-10-12** : la voix de Roquebrune-Cap-Martin dans l'Atlas sonore (LISN) sonne nettement ligure (« U vèntu e u sù se dispütavun… u ciü forte »). Romain demande : « c'est sûr ? ». Après recherche, **Menton, Roquebrune-Cap-Martin, Gorbio et Sainte-Agnès** passent en zone de transition quadrillée, comme la Roya. Elles restent dans le domaine occitan, sur le vivaro-alpin. Légende : « parler de transition entre l'occitan alpin (gavot) et le ligure intémélien (à confirmer) ». Script : `SIG/cadena/mentonasc.mjs`. Cahier §11.

## Ce que disent les sources consultées

| Source | Ce qu'elle dit | Statut |
|---|---|---|
| Wikipédia, « Mentonnais » (fr) | Parler nord-occitan, rangé dans le vivaro-alpin ; **intermédiaire entre le vivaro-alpin et le ligure intémélien**, avec des traits vivaro-alpins de structure ; revendiqué localement comme occitan. Aire : Menton et son canton (Gorbio, Sainte-Agnès, Castellar) ; on peut y rattacher Castillon, Sospel et Moulinet. Distinct du niçois et du monégasque à l'ouest, de l'intémélien à l'est ; proche du royasque (haute Roya, Bévéra) et du pignasque (Pigna). Roquebrune : « généralement » une variante du mentonnais, peut-être un parler distinct. | lu le 2026-10-12 |
| Dalbera (thèse 1984, article 1989, cités par Wikipédia) | Place le mentonnais dans l'espace occitan et étudie les interférences entre provençal et ligure. | cité, non lu |
| Dalbera, *Les parlers des Alpes-Maritimes*, AIEO 1994 | Référence de base pour toute la zone ; notre table `SIG/vilas/sotdialectes-a-validar.csv` lui attribue les « traits structurels vivaro-alpins » du mentonnais. | **à lire en priorité** |
| Forner, « Le mentonnais entre toutes les chaises ? » (in Caserio et al. 2001) | Le titre résume le débat : le mentonnais ne rentre dans aucune case. | cité, non lu |
| Forner, *Morphologie comparée du mentonnais et du ligurien alpin*, De Gruyter 2022 | Compare le mentonnais au ligure alpin (Roya, etc.). D'après un compte rendu (*Estudis Romànics* 48, 2026), les anciens auteurs hésitaient entre des **affinités gavotes** (le niçois de l'arrière-pays) et des **traits ligures alpins**. | compte rendu entrevu, livre non lu |
| Olivieri (citée par Wikipédia) | Range les parlers de Menton et de Sospel au « stade 0 » des dialectes occitans (pas de pronom sujet). | cité, non lu |

**À retenir.** Le côté occitan du mentonnais est le **gavot**, l'occitan de la montagne niçoise que les dialectologues rattachent au vivaro-alpin, et non le niçois de la côte. Le côté ligure est l'**intémélien**, celui de Vintimille. L'intuition de Romain, « entre ligure et niçois », est donc juste à cette nuance près.

## La zone voisine sur notre carte

- **Niçois** (provençal) : Nice et ses environs immédiats, sur la côte jusqu'à Cap-d'Ail (Dalbera 1994 ; Wikipédia « Niçois »).
- **Beausoleil** : laissée sans sous-dialecte, entre l'aire du niçois et celle du mentonnais. Aucune source lue ne la classe.
- **Monaco** : zone mixte « ligure (monégasque), niçois aussi », hors du domaine.
- **Roya et La Brigue** : zone mixte « parler ligure à traits occitans » (décision du 2026-10-07). Saorge et La Brigue y sont.
- **Arrière-pays (gavot)** : vivaro-alpin.

## Ce qui reste incertain

1. **Castellar** fait partie du canton de Menton mais manque dans nos données de communes (`app/static/data/comunas/06.json`). Pourquoi ?
2. **Castillon, Sospel, Moulinet** : rattachés au mentonnais par certains auteurs, pas par d'autres. Laissés en vivaro-alpin.
3. **Roquebrune-Cap-Martin** : variante du mentonnais ou parler distinct ?
4. **La limite niçois / gavot / mentonnais** autour de Beausoleil, La Turbie, Peille.
5. **Les noms occitans de la légende** (« País mentonasc », « gavòt », « intemelian ») ne sont pas dans le Basic de lo Congrès.

## Avant l'ouverture au public

- Lire Dalbera 1994 (au moins le chapitre sur le mentonnais et le classement de la zone).
- Faire relire la zone par quelqu'un qui la connaît : un dialectologue, une association locale ou lo Congrès. **Romain choisit qui et écrit lui-même.**
- D'ici là : la légende dit « à confirmer », et rien d'autre ne change dans l'est des Alpes-Maritimes sans source précise.

## Liens

- Wikipédia, « Mentonnais » : https://fr.wikipedia.org/wiki/Mentonnais
- Wikipédia (en), « Mentonasc dialect » : https://en.wikipedia.org/wiki/Mentonasc_dialect
- Wikipédia (en), « Intemelio dialect » : https://en.wikipedia.org/wiki/Intemelio_dialect
- Forner 2022, De Gruyter : https://doi.org/10.1515/9783110755893
