# Pilotatge — tableau de bord de Lo Ligam

> **Rituel.** Toute discussion l'OUVRE en début de séance et le MET À JOUR en fin de séance : une ligne, pas un paragraphe. Les décisions vont au §11 du cahier des charges ; ici, seulement l'état et la prochaine action.
>
> **Rangé le 2026-10-24** par la discussion mère (une ligne par chantier). L'ancienne version, avec tout l'historique détaillé des chantiers jusqu'au 23-10, est dans `revisions/PILOTATGE-archiu-2026-10-24.md`. Derniers points d'étape : `revisions/2026-10-22-analisi-profonda.md` (relecture profonde du 22-10) et `revisions/BILAN-2026-10-08.md`.
>
> **La discussion mère** (celle qui a ouvert ce tableau le 18-09) garde la vue d'ensemble : elle relit les autres discussions par Git, tient ce fichier à jour et signale les déséquilibres.

## 1. Ce que Romain a à faire, dans l'ordre

**Maintenant**
1. **Proton Drive abîmait `.git`** : ✅ réglé sur ce PC le 24-10. Proton ne sait pas exclure un sous-dossier ; le carnet de Git a donc été sorti de Documents, dans `C:\Users\perie\Depots\Lo_Ligam.git` (un fichier `.git` d'une ligne y renvoie, le projet ne bouge pas). Restent : jeter l'ancien carnet gardé en réserve, `C:\Users\perie\Depots\reserva-git-2026-10-24`, et la quarantaine `C:\Users\perie\Lo_Ligam_quarantena_2026-10-12` d'ici une semaine si tout va bien ; **sur l'autre ordinateur, la même opération avec Claude** si Proton y synchronise aussi les Documents.
2. **L'édition sur place, séance 1 faite dans la nuit du 24-10** (`revisions/2026-10-24-edicion-sus-plaça.md`, cahier §11) : **Romain colle `supabase/supabase-pagina-elements.sql` dans Supabase** (SQL Editor → New query → coller → Run), puis, connecté sur loligam.eu, touche le bouton « Editar » en bas à droite de l'accueil, change un mot, « Publicar », vérifie en navigation privée que le public le voit ; essaie aussi une image, un lien, « + Apondre », ↑ ↓, Suprimir, sur téléphone et sur ordinateur. Ensuite : séance 2 (historique, aperçu téléphone), 3 (apparence), 4 (mouvement, autres pages, Atelier).
3. **Répondre au bloc 4 de `DIRECCION.md`** (l'accueil, vue d'ensemble) : barreau 3, après l'éditeur.
4. **Une question de couleur** : le rouge du logo aussi sur les boutons de zoom de la carte et sur « Écouter la voix la plus proche » ? (règle B, 23-10)

**Ensuite**
4. Regarder sur téléphone et valider : les premiers pas de la carte (forme et occitan, `app/src/lib/components/Guida.svelte`), la famille Ensenhament (`SIG/ensenhament/LEGIR-ME.md` : « renfortit », « oras », « oraria »), les libellés des cercles, des voix et de « La carta se prepara… ».
5. Reprendre les visuels dans Canva (logo C, 4:5, six familles, un export sans textes) : c'est ce qui débloque les scènes des unités (chantier 16).
6. La pédagogie bloquée depuis le 18-09 : le brouillon d'une page du module 0, UN enregistrement (le soir du 1.1, `app/static/audio/moduls/`), une séance dicodòc sur les modules 1.1 à 1.4 ; le carnet de conception (`carnet-concepcion/`, huit pages encore vides).
7. **La pile de validations occitanes** (environ 1 450 noms, dont 915 communes) : les fichiers `*-a-validar.csv` de `SIG/` (communes, provinces, parcs, relief, Calandretas, vallées, sous-dialectes, surnoms), `SIG/<lenga>/FONTS.md`, `SIG/lisn/mots-a-validar.csv`, les mots du menu (« Menú », « Corses en visio », « Mon istòria », « Reservar un cors »).
8. Tester un vrai courriel de confirmation de compte (l'adresse de Supabase est passée à loligam.eu le 15-10).

**Avant le lancement** (barreau 8)
9. Accord écrit du LISN pour les voix de l'Atlas ; droit de réutiliser la carte d'Occitanica ; mention de la carte de l'OPLO ; relecture du pays mentonnais par quelqu'un qui connaît la zone (`revisions/2026-10-12-zona-mentonasca.md`).
10. Rouvrir le site aux moteurs de recherche (fermé le 24-10 : `app/static/robots.txt` et `X-Robots-Tag` dans `app/src/hooks.server.js`).

## 2. L'échelle unique (écrite le 2026-10-22)

Une seule marche à suivre, qui fond les 7 étapes de `revisions/2026-10-21-refonte-claire.md` et les 8 blocs de `DIRECCION.md`. Chaque séance dit sur quel barreau elle travaille ; on ne change pas de barreau sans l'écrire ici.

| Barreau | Contenu | État |
|---|---|---|
| 1 | L'ambiance : sombre « Éclat » et Venas d'aur par défaut, clair « Plâtre » au choix | ✅ fait (21-22-10) |
| 2 | Pourquoi, pour qui, les trois rubriques (blocs 1 à 3) | ✅ fait (22-10) |
| 3 | **L'accueil, la vue d'ensemble** (bloc 4) | **prochain : Romain répond au bloc 4** |
| 4 | La charte et le mouvement (blocs 5 et 6), le cadre commun des pages | en partie : règle B des couleurs sur tout le site (23-10) ; reste la question du point 3 ci-dessus |
| 5 | Les mots (bloc 7) | en partie : tutoiement partout, « uèi » validé (22-23-10) ; reste la pile de validations |
| 6 | Les pages de rubrique : Se parla (carte, puis wiki), S'apren, Amassa | carte très avancée (prise en avance le 22-10) ; wiki, S'apren et Amassa à faire |
| 7 | Les pages intérieures, l'administration remise en cohérence | **pris en avance le 24-10** : l'édition sur place, séance 1 faite (accueil, tout le niveau Contenu) ; séances 2 à 4 à faire |
| 8 | Lancement (bloc 8) | à faire |

## 3. Les chantiers (une ligne chacun)

| # | Chantier | État | Prochaine action | Qui |
|---|---|---|---|---|
| 2 | **Direction du site** (`DIRECCION.md`) | blocs 1 à 3 répondus (22-10) | bloc 4 | Romain |
| 3 | Module 0 | bloqué depuis le 18-09 | brouillon d'une page | Romain |
| 4 | Audio de l'unité 1 (sa voix) | 1 enregistrement sur 17 | enregistrer le soir du 1.1 | Romain |
| 5 | Validation occitane des modules 1.1 à 1.4 | bloqué | une séance dicodòc | Romain |
| 6 | /aprene en « Camin » (sommaire du cursus) | à faire | attend S'apren (barreau 6) | Claude |
| 7 | Transposition Racine² : A prepaus, Contacte, FAQ | à faire ; les liens du menu mènent à des pages vides (wiki, articles, forum, groupes, idées, istòria, contacte) | à ranger dans les barreaux 6 et 7 | Claude |
| 8 | Photos « sang e aur » | bloqué | inventaire des photos et casting | Romain |
| 9 | design-stock et Proton Drive | règle « rien de plus de 1 Mo dans Git » en place (12-10) ; carnet de Git sorti de Documents sur ce PC (24-10) | l'autre ordinateur (point 1 de la liste) | Romain + Claude |
| 12 | Autoformation de Romain (`autoformation-parcours.md`) | carnet ouvert le 04-10, pages encore vides | page de l'étape 1 | Romain |
| 13 | **Carte /carta** (le gros du travail d'octobre) | remise en ordre en deux lots faite (23-10) ; langues de France, voix, lecture « Uèi », Ensenhament (970 lieux, 61 Calandretas), cercles (983), premiers pas en 11 étapes | validations du point 4 ; test iPhone ; plus tard la page qui vulgarise l'enquête OPLO, « Lo viatge » (voix), le mode d'export | Romain + Claude |
| 13 bis | Fiches des communes | en ligne, la voix d'ici repliée en une ligne (23-10) | captures de Romain sur quelques communes | Romain |
| 14 | Icônes pratiques | ✅ fait (12-10) | restes : cadenas de /aprene, carrousel de /mots flou au chargement | Claude |
| 15 | Outils EffectCraft et VectorCraft | évalués, pilotés à l'écran (`outils/craft/`) | choisir les récompenses des cours (plus tard) | Romain |
| 16 | Parcours pédagogique et scènes | méthode et « Lumière avec pastilles » validées (20-10) | **visuels Canva de Romain**, puis `/admin/scenas` | Romain puis Claude |
| 18 | Infrastructure | loligam.eu (15-10), mémoire du navigateur (23-10), garde-fou Git (15-10), site fermé aux moteurs de recherche (24-10) | clé Scaleway à renouveler avant le 2027-08-08 ; namespace vide `lo-ligam-site` à supprimer | Romain |

Petits restes, détaillés dans l'archive : côte OpenStreetMap autour de la France (`node SIG/cadena/costa-osm.mjs`, puis `mar.py` et `costa-ref.py`), Lomagne (attente d'une source), photos des vallées d'Italie, attribution de la revue Duolingo dans `corpus-design.md`, sort d'`unitat-1-adieu.md`, laquelle des deux maquettes photo fait foi, crédit Luciole sur la future page accessibilité.

Clos et archivés : 1 (toilettage du 18-09), 2b (séance d'arbitrage, fondue dans DIRECCION et la section 5), 2c, 2d et 17 (redesign, logo, typographie et refonte claire, fondus dans l'échelle), 10 (réveil Supabase, sans objet tant que le site sert chaque jour), 11 (courriels, clos sans envoi le 12-10).

## 4. Le déséquilibre à surveiller (constat du 24-10)

Depuis le 12-10 : 211 changements, dont la moitié pour la carte, un tiers pour l'accueil, la charte et la direction, un sur dix pour l'apprentissage. Le site est le support des cours de Romain (repositionnement du 06-10), mais S'apren n'a presque pas bougé depuis septembre : un enregistrement sur 17, module 0 et carnet vides. La discussion mère le rappelle à chaque point d'étape.

## 5. Les décisions déjà prises — à NE PAS rouvrir

(Le §11 du cahier fait foi ; ceci est l'aide-mémoire.)

1. **22-08** : un seul produit, deux registres (récit expressif / outil sobre), une seule adresse, pas d'appli native.
2. **30-09 / 05-10** : Limelight (titres et logo), Luciole (texte), Cormorant Garamond (citations) ; seules ces trois polices.
3. **22-10** : l'accueil s'ouvre sur la carte en étoiles ; « Se parla. S'apren. Amassa. » est le plan du site, dans cet ordre ; le site s'ouvre en occitan, bascule Òc / Fr mise en avant ; le premier public est le curieux.
4. **28-07** : graphie classique · nom « Lo Ligam » · 15 ans minimum · questionnaire en minimisation RGPD.
5. **29-08** : un seul chemin d'apprentissage (le cursus), rythme au choix ; gamification sans classement ; API de lo Congrès pour concevoir et vérifier seulement.
6. **29-30-08** : prononciation = l'usage vivant de Romain ; photos « sang e aur », pas d'images IA.
7. **08-09-08** : SvelteKit + Supabase (UE) + Scaleway Paris, déploiement automatique ; admin : RLS seul rempart, SVG interdit, pas de CMS externe.
8. **03-09** : Romain est seul, tout se classe lancement / évolution.
9. **04-10 et 15-10** : Romain conçoit le parcours (« charpente et chair ») : Claude propose la charpente, vérifie et code, Romain écrit la chair.
10. **15-10** : loligam.eu.
11. **22-10** : tutoiement partout.
12. **23-10** : règle B des couleurs : le rouge du logo pour ce qui se clique, l'or et l'ocre pour mettre en valeur.
13. **Pas d'agents ni de longs enchaînements sans l'accord de Romain** (forfait).

## 6. Les vraies questions ouvertes

1. **Modèle économique** : limite gratuit / payant du parcours autonome ; logique solidaire (ouverte depuis le 31-07).
2. **Combien d'unités A1 pour lancer ?**
3. **Statut juridique** : micro-entreprise ou association ?
4. **Les 14 questions du §9** de l'état de l'art des parcours (répétition espacée, courriel hebdo…).
5. **Casting** des personnages et autorisations écrites.
6. **Héberger soi-même les photos satellite** si des trous reviennent (environ 6 Go).
7. **Migration de Supabase** vers un hébergeur européen (reportée sciemment, loi américaine CLOUD Act).

## 7. Les discussions et leur chantier

| Chantier | Discussion |
|---|---|
| Vue d'ensemble, ce tableau | la discussion mère |
| Direction, accueil, charte (barreaux 1 à 5) | « Refonte design du site », « Réorganisation logique de la page » |
| Carte (13, 13 bis) | « Réorganisation logique de la page » et ses discussions liées ; « Carte sur iPhone : mémoire et rechargements » |
| Parcours et scènes (16) | « Parcours pédagogique occitan » |
| Outils ArtCraft (15) | « Artcraft sécurité et utilisation » |
| Vidéos et conseils | « Transcription et conseils vidéo » |

Une discussion close s'archive (rien n'est perdu, on peut la restaurer) ; avant d'archiver, la discussion mère vérifie que tout est poussé et noté ici.
