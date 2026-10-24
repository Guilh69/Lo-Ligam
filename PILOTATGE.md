# Pilotatge — tableau de bord de Lo Ligam

> **Rituel.** Toute discussion l'OUVRE en début de séance et le MET À JOUR en fin de séance : une ligne, pas un paragraphe. Les décisions vont au §11 du cahier des charges ; ici, seulement l'état et la prochaine action.
>
> **Rangé le 2026-10-24** par la discussion mère (une ligne par chantier). L'ancienne version, avec tout l'historique détaillé des chantiers jusqu'au 23-10, est dans `revisions/PILOTATGE-archiu-2026-10-24.md`. Derniers points d'étape : `revisions/2026-10-22-analisi-profonda.md` (relecture profonde du 22-10) et `revisions/BILAN-2026-10-08.md`.
>
> **La discussion mère** (celle qui a ouvert ce tableau le 18-09) garde la vue d'ensemble : elle relit les autres discussions par Git, tient ce fichier à jour et signale les déséquilibres.

## 1. Ce que Romain a à faire, dans l'ordre

**Maintenant**
1. **Proton Drive et Git** : ✅ réglé pour de bon le 24-10. Le projet est sorti de Documents, dans `C:\Users\perie\Depots\Lo_Ligam` (dossier `.git` normal, sauvegarde GitHub) ; les fichiers lourds hors Git sont dans `Documents › 6_Projectes › Lo_Ligam_hors-git` (sauvegarde Proton), rattachés au projet par des raccourcis. Les discussions en un clic remarchent. **Pour toi** : ouvrir désormais les sessions de Lo Ligam depuis le dossier `C:\Users\perie\Depots\Lo_Ligam` ; l'ancien dossier `Documents › 6_Projectes › Lo_Ligam` est dans la corbeille de Windows depuis le 24-10 (la vider quand tu veux ; le dossier vide qui reste disparaît après un redémarrage de l'application, ou se supprime à la main) ; vers le 31-10, si tout va bien, jeter `C:\Users\perie\Lo_Ligam_quarantena` (ancienne quarantaine et ancien carnet). **Sur l'autre ordinateur, avec Claude** : cloner dans `Depots`, puis lancer le script des raccourcis.
2. **L'édition sur place, séance 1 faite dans la nuit du 24-10** (`revisions/2026-10-24-edicion-sus-plaça.md`, cahier §11) : SQL collé dans Supabase par Romain le 24-10 ✅, l'éditeur marche (« ok ça marche ») ; connecté sur loligam.eu, touche le bouton « Editar » en bas à droite de l'accueil, change un mot, « Publicar », vérifie en navigation privée que le public le voit ; essaie aussi une image, un lien, « + Apondre », ↑ ↓, Suprimir, sur téléphone et sur ordinateur. Ensuite : séance 2 (historique, aperçu téléphone), 3 (apparence), 4 (mouvement, autres pages, Atelier).
3. **Répondre au bloc 4 de `DIRECCION.md`** (l'accueil, vue d'ensemble) : barreau 3, après l'éditeur.
4. **Une question de couleur** : le rouge du logo aussi sur les boutons de zoom de la carte et sur « Écouter la voix la plus proche » ? (règle B, 23-10)
5. **Mon ligam amb l’occitan, ex-Mon istòria (24-10)** : ① recoller `supabase/supabase-pagina-elements.sql` dans Supabase (ajoute les textes de la page, n'écrase rien) ; ② Scaleway : activer Transactional Email, ajouter le domaine loligam.eu, créer une clé d'API (droit TransactionalEmailFullAccess) et poser `SCW_TEM_CLAU` et `SCW_PROJECTE` dans les réglages du conteneur (tant que ce n'est pas fait, le formulaire renvoie vers l'adresse) ; ③ relire ton récit, affiché tel que dicté (« Editar »), et écrire l'occitan, puis publier ; ④ confirmer la conservation des messages un an au plus.

**Ensuite**
4. Regarder sur téléphone et valider : les premiers pas de la carte (forme et occitan, `app/src/lib/components/Guida.svelte`), la famille Ensenhament (`SIG/ensenhament/LEGIR-ME.md` : « renfortit », « oras », « oraria »), les libellés des cercles, des voix et de « La carta se prepara… ».
5. Reprendre les visuels dans Canva (logo C, 4:5, six familles, un export sans textes) : c'est ce qui débloque les scènes des unités (chantier 16).
6. La pédagogie bloquée depuis le 18-09 : le brouillon d'une page du module 0, UN enregistrement (le soir du 1.1, `app/static/audio/moduls/`), une séance dicodòc sur les modules 1.1 à 1.4 ; le carnet de conception (`carnet-concepcion/`, huit pages encore vides).
7. **La pile de validations occitanes** (environ 1 450 noms, dont 915 communes) : les fichiers `*-a-validar.csv` de `SIG/` (communes, provinces, parcs, relief, Calandretas, vallées, sous-dialectes, surnoms), `SIG/<lenga>/FONTS.md`, `SIG/lisn/mots-a-validar.csv`, les mots du menu (« Menú », « Corses en visio », « Mon istòria », « Reservar un cors »).
8. Tester un vrai courriel de confirmation de compte (l'adresse de Supabase est passée à loligam.eu le 15-10).

**Avant le lancement** (barreau 8)
- **Mentions légales (24-10)** : une adresse et un téléphone à afficher, obligatoires dès que le site vend (Romain ne veut ni son domicile ni louer une domiciliation : solution à trouver) ; élargir l'activité de la micro-entreprise sur procedures.inpi.fr (aujourd'hui : vente de cartes seulement ; ajouter cours en visio, déco et textile, prestations intellectuelles) avant le premier cours payant.
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
| 6 | Les pages de rubrique : Se parla (carte, puis wiki), S'apren, Amassa | carte très avancée (prise en avance le 22-10) ; **les trois pages lancées le 24-10** (chantiers 19 à 23, une discussion chacun), S'apren d'abord |
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
| 7 | Transposition Racine² : A prepaus, Contacte, FAQ | à faire ; les liens du menu mènent à des pages vides (wiki, articles, forum, groupes, idées) ; istòria et contacte faits le 24-10 (chantier 23) | à ranger dans les barreaux 6 et 7 | Claude |
| 8 | Photos « sang e aur » | bloqué | inventaire des photos et casting | Romain |
| 9 | design-stock et Proton Drive | règle « rien de plus de 1 Mo dans Git » en place (12-10) ; projet sorti de Documents, fichiers lourds dans `Lo_Ligam_hors-git` (24-10) | l'autre ordinateur (point 1 de la liste) | Romain + Claude |
| 12 | Autoformation de Romain (`autoformation-parcours.md`) | carnet ouvert le 04-10, pages encore vides | page de l'étape 1 | Romain |
| 13 | **Carte /carta** (le gros du travail d'octobre) | remise en ordre en deux lots faite (23-10) ; langues de France, voix, lecture « Uèi », Ensenhament (970 lieux, 61 Calandretas), cercles (983), premiers pas en 11 étapes | validations du point 4 ; test iPhone ; plus tard la page qui vulgarise l'enquête OPLO, « Lo viatge » (voix), le mode d'export | Romain + Claude |
| 13 bis | Fiches des communes | en ligne, la voix d'ici repliée en une ligne (23-10) | captures de Romain sur quelques communes | Romain |
| 14 | Icônes pratiques | ✅ fait (12-10) | restes : cadenas de /aprene, carrousel de /mots flou au chargement | Claude |
| 15 | Outils EffectCraft et VectorCraft | évalués, pilotés à l'écran (`outils/craft/`) | choisir les récompenses des cours (plus tard) | Romain |
| 16 | Parcours pédagogique et scènes | méthode et « Lumière avec pastilles » validées (20-10) | **visuels Canva de Romain**, puis `/admin/scenas` | Romain puis Claude |
| 18 | Infrastructure | loligam.eu (15-10), mémoire du navigateur (23-10), garde-fou Git (15-10), site fermé aux moteurs de recherche (24-10) | clé Scaleway à renouveler avant le 2027-08-08 ; namespace vide `lo-ligam-site` à supprimer | Romain |
| 19 | **Page 02 S'apren** et l'écran « Cours en visio » (méthode expliquée avant le calendrier) | **en ligne le 24-10** : `/apren` en cases de couleur, `/apren/visio` avant le calendrier ; **questionnaire avant le premier cours**, méthode, déroulé en cinq temps, prix affichés (grille A, 24-10, cahier §11) ; **factures : page locale qui génère la facture numérotée et tient le livre des recettes** (`outils/factura/`, 25-10, cahier §11) | Romain : coller `supabase/supabase-acces-claude.sql` dans Supabase (accès de Claude aux textes) ; relire l'occitan et les listes de réponses (Editar) ; choisir les couleurs sur `/apren?ensag=colors` ; poser la clé d'envoi Scaleway ; prix : grille A retenue (15 / 22 / 30 €), solidaire sur déclaration, cours individuels seulement ; bouquets valables 2 et 5 mois , pas de règle d'annulation pour l'instant , paiement par virement ; Romain : ouvrir un compte réservé à l'activité (et déclarer la micro-entreprise si ce n'est pas fait) (`revisions/2026-10-24-prix-visio.md` §5) ; Romain : double-cliquer sur `outils/factura/Factures.cmd` et remplir les Réglages (adresse, SIRET, IBAN), mode d'emploi `outils/factura/LISEZMOI.md` ; décembre 2026 : vérifier la nouvelle mention de TVA (CIBS, 1er janvier 2027) ; avant septembre 2027 : choisir une plateforme agréée (e-reporting) ; plus tard : interface d'écriture | Romain puis Claude |
| 20 | **Progression du cursus**, sur le modèle du cours de catalan de Romain | cours du CPNL et DCL analysés ; **décision 1 : le DCL est le cap de tout le cursus** (niveaux A1, A2, B1.1, B1.2, B2, C1 affichés, mission au format DCL en fin de niveau) (24-10) ; **décision 2 : des blocs de 45 h** (24-10) ; **décision 3 : le site porte tout le parcours, une visio de rencontre au départ, des cours en visio à la carte** (24-10) ; **décision 4 : la scène ouvre l'unité, la tâche la ferme, un mémo la résume, nos modules à l'intérieur renommés en questions** (24-10) ; **décision 5 : A1 = 2 blocs, A2 = 3, le reste plus tard** (24-10) ; `revisions/2026-10-24-progression-catala.md` ; **décision 6 : une révision nommée toutes les deux unités** (24-10) ; **la répétition espacée (méthode Anki) devient l'outil central** (24-10) ; **notation surtout automatique, « Pas encore » / « Acquis » sinon, FSRS** (24-10) ; **deux cartes par chose : « je reconnais » puis « je produis »** (24-10) ; **la séance du jour commence par la révision plafonnée** (24-10) ; **halte = réemploi des deux unités, puis bilan du carnet** (24-10) ; **carnet dans le navigateur sans compte, rattaché au compte à l'inscription** (24-10) ; **son du jour = celui de la forme du jour, dans l'ordre du DCL** (24-10). Toutes les décisions de charpente prises ; **carnet de révision codé** (FSRS, deux cartes, acquise en deux jours, unité 1 branchée, page de contrôle `/aprene/carnet`, table Supabase collée et vérifiée) (24-10) | **Claude** (rédige les unités depuis le 25-10, cahier §11) : carte A1 en 8 unités **validée le 25-10** (`cursus/01-A1-carta-8-unitats.md`) ; relecture tranchée (C : en ligne mais cachée, fiche par module, 25-10) ; voix tranchée (A : celle de Romain seule, liste d'enregistrement par module, 25-10) ; scènes tranchées (B : carte de titre sobre en attendant les visuels, 25-10) ; questions 5 et 6 à poser (accents, jeux à côté), puis l'unité 1 comme modèle et les autres une à une ; ensuite la séance du jour, les haltes, l'affichage des niveaux. **Romain** : répondre aux questions une à une, relire et valider l'occitan | Romain + Claude |
| 21 | **Page 01 Se parla** et les musiques des artistes (liens vers Deezer et autres, sans copier) | lancé le 24-10, discussion à part | proposition de page et liste d'artistes de Romain | Claude puis Romain |
| 22 | **Page 03 Amassa** : groupes, forum, boîte à idées | **`/amassa` en ligne le 25-10** : cinq cases sur le modèle de S'apren (gabarit commun `PaginaTeulas`) ; **option A choisie le 25-10** (annuaire + boîte à idées ; C plus tard) ; **boîte à idées codée le 25-10** (`/ideas`, `/admin/ideas`, règles d'accès vérifiées par 18 contrôles) | **Romain** : faire créer la table `ideas` (`supabase/supabase-ideas.sql`) ; relire l'occitan (Editar) ; coller `supabase/supabase-pagina-elements.sql`. **Claude** ensuite : l'annuaire des groupes, une décision à la fois | Claude puis Romain |
| 23 | **Mon istòria et Contacte** (regroupées ou non) | **fait le 24-10** : une seule page `/istoria`, contact en fin de page avec formulaire (cahier §11) | Romain : SQL, envoi Scaleway, relire et publier son récit | Romain |

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
3. ~~**Statut juridique**~~ : tranché le 24-10, micro-entreprise (cahier §11).
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
