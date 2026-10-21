# La carte /carta : ce qu'elle est devenue, ce qu'elle coûte, sa place

Rapport du 2026-10-22, 0 h. Lecture par extraits ; chaque affirmation porte sa source (fichier et ligne, date du journal §11 du cahier des charges, ou commit). Les mots entre guillemets sont recopiés tels quels.

## 1. Ce que la carte est devenue, et en combien de jours

| Date | Étape | Source |
|---|---|---|
| 31-07 | Volet /carta : « fond de carte occitan plein écran » ; couches génériques via Supabase les 06 et 07-08 | commit 71638b3 ; §11 L205-206 |
| 06-10 | Vision « ancrés mais connectés » : villes → rivières → relief → pays → Europe → monde ; « pas une île occitane coupée de tout » | §11 L240 |
| 07-10 | « La carte en étoiles devient la carte » ; domaine et six dialectes d'après Occitanica (Romain : « la référence ») ; catalogue en cinq familles | §11 L243, L245, L246 ; 92 commits |
| 08-10 | Europe et monde au dézoom, famille « Autras lengas », catalan ; « une carte informative mais aussi artistique, vraiment captivante » | §11 L260, L263, L264 |
| 09-10 | Arpitan, basque, satellite IGN et PNOA, côte unique, grille des échelles | §11 L266-278 ; 82 commits |
| 10-10 | Oïl, breton, alsacien, francique, flamand, corse ; mode « Langues de France » ; rail « atelier du cartographe » | `revisions/2026-10-10-lengas-de-franca.md` L5-19 ; §11 L279-294 ; 85 commits de 0 h à 15 h |
| 11 et 12-10 | Fiches de communes dans la langue du lieu, « même paquet pour toute zone », zoom « comme Google Maps » ; téléphone ; enquêtes vocales du LISN en ligne | §11 L295-300, L306-310 |
| 19-10 | Mémoire allégée sur téléphone ; audit des clics ; diversité des langues au-delà de 400 km | §11 L327-331 |

Du 07 au 19-10, treize jours dont six de production intense, le dépôt reçoit 466 commits, 226 touchant la carte, ses données ou `SIG/` (`git log --since=2026-10-06`). La carte contient dix langues (l'occitan et neuf voisines dans `LENGAS`, `app/src/lib/carta/lengas.js` L10), 30 fiches de langues et dialectes (`SIG/lengas-fichas.json`), 22 couches (`catalogue.js`), 10 042 communes nommées (`static/data/comunas/noms.json`) et 114 points d'enquête du LISN (`enquistas-lisn.json`).

## 2. Ce qu'elle coûte

| Poste | Mesure | Source |
|---|---|---|
| Code | 28 fichiers, 484 Ko, 10 105 lignes dans `app/src/lib/carta` ; 5 819 lignes autour (`CartaOccitania.svelte` 140 Ko, `carta-estelas.js`, route, recherche, admin) : environ 16 000 lignes | `find`, `wc` du 22-10 |
| Chaîne SIG | 112 scripts, 19 793 lignes (`SIG/cadena`) ; 1,65 Go de brut hors Git (`SIG/brut`) | `wc`, `du` ; `.gitignore` L11 |
| Données servies | 174 fichiers, 33,7 Mo (10,9 Mo compressés), dont 28,7 Mo de communes | `du`, `gzip` |
| Mémoire téléphone (vue iPhone 14, 19-10) | ouverture 174 → 123 Mo ; cinq langues 589 → 315 Mo ; langues éteintes 588 → 122 Mo ; une toile pleine taille = 13 Mo ; « toutes les langues allumées » ≈ 470 Mo, écarté ; nouveau test iPhone à faire | `PILOTATGE.md` L62 ; §11 L327, L329 |
| Noms occitans à valider | ≈ 1 450 lignes : 915 communes (`SIG/comunas/noms-a-validar.csv`, motif « desacòrd » OSM / BdTopoc), 141 relief, 114 mots LISN, 58 pays, 58 Calandretas, 55 parcs, 51 provinces, 36 surnoms, 16 sous-dialectes ; plus les dialectes de neuf `SIG/<lenga>/FONTS.md` et neuf arbitrages de données | `wc -l` ; `2026-10-10-audit-donadas.md` L137-160 |
| Audits non traités | 47 constats « carta » du 08-10 ; quatre lots de l'audit des clics (villages, étiquettes, clavier, recherche) | `BILAN-2026-10-08.md` L219-270 ; `2026-10-19-audit-clics-carta.md` L72-77 |

La validation n'a presque pas commencé : `SIG/lisn/mots-corregits.csv` porte une seule correction, et les commits disent « de validar », jamais validé (`git log`). Romain a tranché des choix (§11 L252), pas les listes. Le rythme a eu un prix : 84 commits entre 0 h et 6 h depuis le 06-10, et le 09-10 : « je consomme trop vite les crédits » (mémoire `feedback_limites_et_phase_lancement.md`).

## 3. Sa place dans l'intention du projet : apprendre l'occitan

**Porte d'entrée (pour).** La vision promet aux non-occitans « une porte d'entrée vers l'Occitanie, sa langue, son histoire et son territoire » (cahier L16). Le journal dit « fonctionnalité phare » (§11 L240) ; l'accueil du 15-10 s'ouvre « avec un seul bouton principal, la carte », « Apprendre l'occitan » en second (§11 L318). Le repositionnement du 06-10 veut « montrer sa vision de l'Occitanie » (§11 L239). `DIRECCION.md` : « L'émotion la plus forte aujourd'hui est dans la carte (découverte, fierté du territoire), pas dans l'apprentissage » (L77-78) ; « le curieux veut la carte » (L99). Le wiki relie carte et cours : « Ont es ? » et « D'ont siás ? » renvoient aux fiches de villes (`2026-10-10-concept-wiki.md` §1).

**Dispersion (contre).** `DIRECCION.md` : la séance de structure prévue depuis le 18-09 n'a jamais eu lieu, « la carte a pris toute la place. C'est de là que vient l'impression de bloquer » (L19-20). La question « La cartographie passe-t-elle en premier ? » reste ouverte (PILOTATGE L118) alors que les faits l'ont tranchée. Le cahier avertit : cinq produits, « Chacun est un vrai projet » (L33-35), « la Phase 1 est le prérequis de tout » (L59). Pour le lancement il manque « module 0, audio de l'unité 1, validation occitane des modules, photos, les pages promises par le menu » (DIRECCION L234-235) : rien de cela n'est la carte. Depuis le 04-10 Romain écrit lui-même le parcours (§11 L235) : valider 1 450 noms de lieux se paie en heures de module 0. La carte est gratuite dans le modèle économique (§6 L109).

**Lecture d'ensemble.** Les deux sont vrais. La carte est le produit le plus abouti (DIRECCION L54), mais aucun fil ne mène de la carte à une première leçon, alors que les cours en visio sont « l'activité principale » (§11 L239). Une carte qui n'y conduit pas reste un produit à part.

## 4. Ce qui manque pour qu'un inconnu en profite

1. **Entrée guidée.** « La richesse cache l'entrée : rien ne dit à un nouveau venu par où commencer » ; proposition : « une "première visite" guidée en trois gestes » (DIRECCION L54). La seule pancarte de première visite présente encore le fond OSM (`routes/carta/+page.svelte` L22-40), dépassée depuis le 08-10 (BILAN L261).
2. **Wiki promis, page absente.** Menu et accueil pointent vers `/wiki` (`planSite.js` L15 ; `+page.svelte` L421) ; aucun `src/routes/wiki` : lien mort (DIRECCION L53). Premier lot chiffré : dix langues, 2 à 3 séances de code, « environ 1 h par fiche, soit 10 h » de textes (concept-wiki §6).
3. **Accessibilité.** Canevas : « un lecteur d'écran n'en lit rien », vue en liste manquante (audit visuel, point 10).
4. **Téléphone.** En-tête sur trois rangées, icônes sans libellés (audit visuel 4-5) ; test iPhone à refaire (PILOTATGE L62).
5. **Lignes « à venir »** qui « diluent ce qui marche », recherche limitée aux villes, départements et régions (audit visuel 2 et 8).
6. **Données à arbitrer** : attribution Glottolog erronée, « ≈ 700 000 » alsaciens non sourcé, liens cassés (audit-donadas L7-16).

## 5. Risques juridiques encore ouverts

| Source | État | Ce qui reste | Source |
|---|---|---|---|
| Occitanica (CIRDÒC) | Licence Ouverte vérifiée, « rediffusion possible en citant la source » | « droit de réutilisation à demander au CIRDÒC » ; « demande de courtoisie en cours » le 10-10, sans trace d'envoi ; chantier 11 clos sans la citer | §11 L245, L249 ; concept-wiki §3 ; PILOTATGE L60 |
| LISN, tracés | risque levé : contrôle seulement, fichier hors Git | rien | §11 L265 ; `.gitignore` L13 |
| LISN, enquêtes vocales | couche **en ligne** depuis le 12-10 (site non public), sons lus depuis `atlas.lisn.upsaclay.fr`, 114 points | CC BY-NC-SA face au volet payant (§8) : « À revoir avant l'ouverture au public : accord écrit du LISN » ; aucun courriel prévu | §11 L302, L306, L307 ; `votz.js` L5 |
| arpitania.eu (CC BY-SA 3.0) | domaine arpitan de France classé d'après cette carte ; limite nord repose sur elle seule | « la compatibilité entre CC BY-SA et ODbL n'est pas garantie » ; publier les dérivés sous la même licence et l'écrire dans le panneau | `SIG/arpitan/FONTS.md` L32, L62, L67 ; audit-donadas, point 7 |
| Secondaires | tuiles `tile.openstreetmap.bzh` (bénévole) ; textes Wikipédia (CC BY-SA) dans les fiches de communes | courtoisie ; attribution à vérifier | `CartaOccitania.svelte` L49 ; §11 L297 |

## 6. Propositions, une décision à la fois

- **Lancement, sans code.** Geler l'ajout de langues et de couches ; ne valider que ce qui se lit à 70 km : pays (58), provinces (51), dialectes des FONTS. Les 915 communes attendent : un nom inconnu est déjà masqué (§11 L281).
- **Lancement, une séance.** La « première visite » en trois gestes (DIRECCION L54), qui finit sur la première leçon : le lien manquant entre « Se parla » et « S'apren ».
- **Lancement, deux à trois séances.** Le lot 1 du wiki (dix langues), pour que `/wiki` cesse d'être un lien mort ; textes de Romain, charpente de Claude (§11 L325).
- **Retour à Instagram.** La palette de la carte vient des 213 visuels (§11 L241) ; l'export « Fai ta carta d'Occitània » est « faisable sans alourdir la page » (§11 L250). Une vue de carte par publication (§11 L301) ferait de la carte une source de publications, pas un produit à part.
- **Avant l'ouverture au public.** Trois courriers de Romain : CIRDÒC (courtoisie), LISN (accord écrit), note de licence arpitan dans le panneau « Fonts ».
