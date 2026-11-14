# Pilotatge — tableau de bord de Lo Ligam

> **Qui a la main.** Claude garde la main, Mistral reste en soutien sur une branche `mistral/<sujet>` (Claude relit et met en ligne) : décision du 06-11, cahier §11.
> **Rituel.** Toute discussion ouvre ce fichier en début de séance et le met à jour en fin de séance : une ligne par point, pas un paragraphe. Les décisions vont au §11 du cahier des charges ; ici, l'état et la prochaine action.
> **Archives** : `revisions/PILOTATGE-archiu-2026-10-24.md` (historique détaillé jusqu'au 23-10) et `revisions/PILOTATGE-archiu-2026-11-13.md` (version complète du 13-11).
> **Méthode L'amic (13-11, cahier §11).** Le cerveau, c'est Romain et ce fichier. Romain entre par la discussion mère (L'amic), qui écrit un cahier des charges par tâche, délègue au modèle le moins coûteux qui suffit, relit, et tient ce tableau. Les décisions se prennent là, en QCM ; « Per tu » (`/admin`) garde les notes sur les pages et la pile. Détail : `CLAUDE.md`.
> **Allégé le 13-11** (79 000 caractères ramenés à 15 000, par un assistant Sonnet, relu par L'amic). Les « prochaines actions » des chantiers 19 à 31 sont des résumés : avant d'ouvrir l'un d'eux, relire sa ligne complète dans l'archive du 13-11.

## 1. Ce que Romain a à faire, dans l'ordre

**Maintenant**
1. **Proton Drive et Git** : ouvrir les sessions depuis `C:\Users\perie\Depots\Lo_Ligam` ; vider la corbeille (ancien dossier `Documents › 6_Projectes › Lo_Ligam`) ; vers le 31-10, jeter `C:\Users\perie\Lo_Ligam_quarantena`. Autre ordinateur, avec Claude : cloner dans `Depots`, lancer le script des raccourcis.
2. **Édition sur place** (`revisions/2026-10-24-edicion-sus-plaça.md`) : essayer image, lien, « + Apondre », ↑ ↓, Suprimir, sur téléphone et ordinateur, et vérifier en navigation privée. Ensuite séances 2 (historique, aperçu téléphone), 3 (apparence), 4 (mouvement, autres pages, Atelier).
3. **Mon ligam amb l'occitan (ex-Mon istòria)** : recoller `supabase/supabase-pagina-elements.sql` dans Supabase ; relire le récit (« Editar »), écrire l'occitan, publier ; confirmer la conservation des messages un an au plus.
4. **Diffusion, cercle 1 (chantier 30)** : envoyer l'invitation aux testeurs (`diffusion/messages.md` §1) ; rendre le dépôt GitHub privé ; enregistrer ta voix pour le module d'accueil et l'unité 1.
5. **Lo talhièr** : épingler une note sur une page (« Comentar »), la retrouver dans « Per tu » (`/admin`) ; l'IA répond à sa séance suivante. Lot 4 en ligne (la pile, « Validar »). Lots 2, 3, 5 par Claude, dans cet ordre (`revisions/2026-11-06-talhier.md` §13).

**Ensuite**
6. Regarder sur téléphone et valider : premiers pas de la carte (`app/src/lib/components/Guida.svelte`), famille Ensenhament (`SIG/ensenhament/LEGIR-ME.md` : « renfortit », « oras », « oraria »), libellés des cercles, des voix et de « La carta se prepara… ».
7. Reprendre les visuels dans Canva (logo C, 4:5, six familles, un export sans textes) : débloque les scènes des unités (chantier 16).
8. Pédagogie bloquée depuis le 18-09 : brouillon d'une page du module 0, un enregistrement (soir du 1.1, `app/static/audio/moduls/`), carnet de conception (`carnet-concepcion/`, huit pages vides).
9. ~~Pile de validations occitanes~~ : levée le 13-11. L'occitan est vérifié par l'API de lo Congrès, Romain ne valide plus mot à mot (cahier §11). Les mentions « Romain relit l'occitan » des chantiers ci-dessous sont caduques.
10. Courriels du compte : renouveler la clé Scaleway avant le 25-10-2027 (Supabase et conteneur) ; supprimer ou garder le compte d'essai créé avec l'alias loligam@.

**Avant le lancement** (barreau 8)
11. Mentions légales : adresse et téléphone à afficher (ni domicile ni domiciliation payante : solution à trouver) ; élargir l'activité de la micro-entreprise sur procedures.inpi.fr (cours en visio, déco et textile, prestations intellectuelles) avant le premier cours payant.
12. Dépôt GitHub privé : github.com/Guilh69/Lo-Ligam/settings › Danger Zone › Change visibility › private, trois confirmations ; Claude vérifie ensuite (l'ancien chapeau de Mon ligam reste lisible dans l'historique).
13. Accord écrit du LISN pour les voix de l'Atlas ; droit de réutiliser la carte d'Occitanica ; mention de la carte de l'OPLO ; relecture du pays mentonnais (`revisions/2026-10-12-zona-mentonasca.md`).
14. Rouvrir le site aux moteurs de recherche (fermé le 24-10 : `app/static/robots.txt`, `X-Robots-Tag` dans `app/src/hooks.server.js`).

## 2. L'échelle unique (écrite le 2026-10-22)

Une marche à suivre, qui fond les 7 étapes de `revisions/2026-10-21-refonte-claire.md` et les 8 blocs de `docs/archius/DIRECCION.md`. Chaque séance dit son barreau ; on n'en change pas sans l'écrire ici.

1. L'ambiance (sombre « Éclat », Venas d'aur par défaut, clair « Plâtre ») : fait (21-22-10).
2. Pourquoi, pour qui, trois rubriques (blocs 1 à 3) : fait (22-10).
3. L'accueil (bloc 4) : fait, dix corrections de Romain du 03-11 appliquées (croix occitane en quatre niveaux, 04-11) ; nombre de places du premier cours à écrire par Romain (`revisions/2026-11-03-accueil-corrections-passation.md`).
4. Charte et mouvement (blocs 5, 6) : en partie, règle B des couleurs partout (23-10).
5. Les mots (bloc 7) : en partie, tutoiement et « uèi » validés ; reste la pile de validations.
6. Pages de rubrique : carte très avancée ; S'apren, Se parla, Amassa en ligne (24-25-10) ; grammaire `/apren/gramatica`, 36 fiches à relire par Romain (04-11, méthode `cursus/11-fonts-integradas.md`) ; Cultura remplace le wiki (`/cultura`, 30 fiches, photos teintées le 06-11) ; reste d'autres grammaires à croiser.
7. Pages intérieures et administration : édition sur place séance 1 faite, séances 2 à 4 à faire ; « Lo talhièr » (`revisions/2026-11-06-talhier.md`) lots 1 et 4 en ligne, lots 2, 3, 5 par Claude.
8. Lancement (bloc 8) : à faire ; diffusion en trois cercles choisie le 06-11 (`diffusion/strategie.md`, `diffusion/synthese.md`, chantier 30), lancement public en février 2027.

## 3. Les chantiers (une ligne chacun)

Format : numéro, chantier, état, prochaine action, référence. Détail dans l'archive du 13-11.

- 2 Direction du site (`docs/archius/DIRECCION.md`) : fait, clos le 06-11. Rien.
- 3 Module 0 : fait, clos le 06-11 ; relecture et voix suivies en 4 et 5.
- 4 Audio de l'unité 1 : 1 enregistrement sur 17. Romain enregistre le soir du 1.1.
- 5 Validation occitane des modules 1.1 à 1.4 : séance dicodòc close le 06-11. Relectures dans la pile de Per tu (Romain).
- 6 /aprene « Camin » : fait (02-11). Reste l'ami arabophone pour l'arabe ; fiche `revisions/2026-11-02-parcors-passation.md`.
- 7 Transposition Racine² (A prepaus, Contacte, FAQ) : à faire ; liens du menu vers pages vides ; istòria et contacte faits (24-10). Ranger aux barreaux 6 et 7 (Claude).
- 8 Photos « sang e aur » : en pause depuis le 06-11. Le casting reviendra avec les scènes des unités.
- 9 design-stock et Proton Drive : règle 1 Mo en place, projet sorti de Documents (24-10). Reste l'autre ordinateur.
- 12 Autoformation (`docs/pedagogia/autoformation-parcours.md`) : en pause depuis le 06-11, pages vides depuis le 04-10.
- 13 Carte /carta : remise en ordre (23-10), langues, voix, Ensenhament, cercles, premiers pas. Validations (point 6), test iPhone, page enquête OPLO, « Lo viatge ».
- 13 bis Fiches des communes : en ligne. Captures de Romain sur quelques communes.
- 14 Icônes pratiques : fait (12-10). Reste : carrousel de /mots flou au chargement.
- 15 EffectCraft et VectorCraft : évalués (`outils/craft/`). Choisir les récompenses des cours plus tard.
- 16 Parcours pédagogique et scènes : méthode et « Lumière avec pastilles » validées (20-10). Visuels Canva de Romain, puis `/admin/scenas`.
- 18 Infrastructure : loligam.eu, garde-fou Git, site fermé aux moteurs. Renouveler la clé Scaleway avant le 2027-08-08 ; supprimer le namespace vide `lo-ligam-site`.
- 19 Page S'apren et « Cours en visio » : en ligne (24-10), prix grille A 15/22/30 €, factures `outils/factura/`. Romain : SQL `supabase/supabase-acces-claude.sql`, Réglages des factures, relire l'occitan, compte dédié.
- 20 Progression du cursus (modèle catalan) : DCL pour cap, décisions de charpente prises, carnet FSRS codé (`revisions/2026-10-24-progression-catala.md`). Restent A1-13 à A1-20 et A1-27 à A1-36 ; Romain relit l'occitan.
- 21 Page Se parla et musiques : en ligne (25-10), `/obras#musicas`. Espace musique via Deezer après accord, recomposition d'Òbras, maquettes d'abord ; essais `/ensag/musica`.
- 22 Page Amassa : en ligne (25-10), boîte à idées codée, option A. Romain : relire l'occitan, SQL ; groupes avec chat mis de côté le 14-11 (branche archiu/grops-2026-11-14), remplacés par « Parlar amassa » (mise en relation) : essai /ensag/ligams en ligne, base écrite le 14-11 (supabase-ligams.sql, auditée par Rodrigo) ; reste : brancher la page sur la base (profil, contact, demandes reçues), retirer /grops ; supprimer ensuite `Bastian_proba`.
- 23 Mon istòria et Contacte : fait (24-10), `/istoria` ; récit sur carte à l'échelle (05-11). Romain : valider la partie 03 et la fin, SQL, envoi Scaleway, publier son récit.
- 24 Réel Instagram OPLO 2020 : animations dans `design-stock/MP4/OPLO-2020-per-Canva/aquarelle/`. Romain monte dans Canva, valide « comprenon plan », « 7 % en mejana », Gironda, Losèra.
- 25 Site multilingue es/en/ca/ar : cinq langues en ligne (26-10), arabe caché du globe. Ami arabophone relit ; décider du dernier lot.
- 26 Pluie de mots : essai `/ensag/plueja` en ligne (04-11). Romain regarde, relit les doutes, décide de la relier au site.
- 27 Jeux classiques : deux jeux sur `/ensag/jocs` (05-11), rubrique `/apren/jocs`. Romain valide « Sageta tenguda : la sèrp accelèra. ».
- 28 Espace enfants « Anem ! » : `/anem` en ligne (05-11), quatre coins. Romain : 20 fichiers audio, comptines, fiche suivante.
- 29 Photos de Romain (163 retenues) : fonds, leçons, Paisatges, « Ont es… ? », thèmes (06-11). Choisir l'usage suivant ; autorisation écrite pour les personnes.
- 30 Diffusion : trois cercles choisis (06-11), `diffusion/`. Romain : invitations, dépôt privé, voix ; décembre : appel « Parlem ! » 2027, fiche, courriels.
- 31 Illustrations IA et cagnotte : mention en ligne, `/illustracions` ; une seule caisse, la micro-entreprise. Avant la cagnotte : mentions légales, Urssaf, devis illustrateur (`revisions/2026-11-06-sosten-dons-transparence.md`).
- 32 Papier découpé et couleurs : en ligne (07-11), `lib/styles/papier.css`, palette unique. Reste exprès : édition, onglets en verre, admin, Lo talhièr ; relecture de Joan.
- 33 API de lo Congrès : séance 1 faite, « L'intrús » dans Jòcs (07-11). Romain joue aux séries ; séance 2 rimas ; `docs/pedagogia/construction-pedagogique.md` §2.
- 34 Carte qui s'assemble au défilement : essai `/ensag/pieces-defilement` jugé « bof » (12-11). Page retirée le 13-11 (abandon, Per tu #158), récupérable dans Git.
- 35 Motifs-symboles au défilement : essai refait `/ensag/motius-simbols` (12-11). Romain regarde sur téléphone ; s'il garde, intégration à l'accueil.
- 36 Audit final, la carte : fait (12-11), correction des noms inconnus (c0c4338f). Romain répond aux questions ; ensuite Claude.
- 37 Audit final, l'accueil : fait et en ligne (12-11). Mesurer le moteur `app/src/lib/acuelh/motor.js` sur machine à carte graphique ; Romain regarde les confettis.
- 38 Constitution en occitan : en ligne (12-11), `/constitucion`, hors menu. Romain relit l'occitan (`app/src/lib/constitucion/LEGIR-ME.md`), dit si elle entre dans Se parla.
- 39 Audit final, code, couleurs, sources : fait (12-11), 1 047 tests verts. Avant lancement : accord LISN, lever le `noindex`, retirer les essais `/ensag/`.
- 40 Une seule porte : fait (12-11). Cartes 155 à 159 appliquées le 13-11 (textes en base, ménage des essais en ligne, cahier §11). Reste : notes 126 (flèche de Remira) et 128 (bouton de langue de `/apren/visio`), « rotge-carta ».
- 41 S'imagina, 4e rubrique : étape 1 en ligne (12-11), `/imagina`. Romain : SQL, valider l'occitan, premières pièces ; accueil à rouvrir plus tard.
- 42 Colors : en ligne et essayé (13-11), `revisions/2026-11-13-colors-sus-plaça.md`. Claude : mettre au registre ce qui est « écrit en dur », à la demande de Romain.

Clos et archivés : 1, 2b, 2c, 2d, 10, 11, 17. Petits restes, détaillés dans l'archive : côte OpenStreetMap, Lomagne, photos des vallées d'Italie, attribution Duolingo, `docs/pedagogia/unitat-1-adieu.md`, maquettes photo. Application installable (PWA), page `/accessibilitat` et Laboratòri `/admin/labo` : séances closes, détail dans l'archive.

## 4. Le déséquilibre à surveiller (constat du 24-10)

Depuis le 12-10 : 211 changements, la moitié pour la carte, un tiers pour l'accueil, la charte et la direction, un sur dix pour l'apprentissage. S'apren a presque pas bougé depuis septembre (un enregistrement sur 17, module 0 et carnet vides). La discussion mère le rappelle à chaque point d'étape.

## 5. Les décisions déjà prises — à NE PAS rouvrir

(Le §11 du cahier fait foi.)

1. **22-08** : un seul produit, deux registres, une adresse, pas d'appli native.
2. **30-09 / 05-10** : Limelight, Luciole, Cormorant Garamond, seulement ces trois polices.
3. **22-10** : accueil sur la carte en étoiles ; « Se parla. S'apren. Amassa. » dans cet ordre ; site ouvert en occitan, bascule Òc / Fr ; premier public : le curieux.
4. **28-07** : graphie classique, nom « Lo Ligam », 15 ans minimum, questionnaire en minimisation RGPD.
5. **29-08** : un seul chemin (le cursus), rythme au choix ; gamification sans classement ; API de lo Congrès pour concevoir et vérifier seulement.
6. **29-30-08** : prononciation = usage vivant de Romain ; photos « sang e aur », pas d'images IA.
7. **08-09-08** : SvelteKit, Supabase (UE), Scaleway Paris, déploiement automatique ; admin : RLS seul rempart, SVG interdit, pas de CMS externe.
8. **03-09** : Romain est seul, tout se classe lancement / évolution.
9. **04-10 et 15-10** : Romain conçoit le parcours (« charpente et chair ») : Claude propose, vérifie, code ; Romain écrit la chair. **Renversé le 25-10** : Claude rédige les unités, Romain fixe le cap et valide l'occitan.
10. **15-10** : loligam.eu.
11. **22-10** : tutoiement partout.
12. **23-10** : règle B des couleurs : rouge du logo pour ce qui se clique, or et ocre pour mettre en valeur.
13. Pas d'agents ni de longs enchaînements sans l'accord de Romain (forfait). **Accord donné le 13-11** pour la méthode L'amic : délégations courtes, cadrées, sur le modèle le moins coûteux.
14. **02-11** : deux IA, une équipe, sans concurrence ni dénigrement. **Reporté le 06-11 au soir** : Claude garde la main, Mistral en soutien (`AGENTS.md`, `BRIEF-MISTRAL.md` §10).
15. **14-11** : gel des nouveaux chantiers (sauf demande ou besoin majeur) ; on termine l'existant. Une règle ne change qu'après deux échecs ; une ajoutée, une retirée. Agents resserrés (cahier §11).

## 6. Les vraies questions ouvertes

1. Modèle économique : repoussé le 06-11 ; au lancement tout le parcours en ligne est gratuit, l'argent vient des visios et de la cagnotte ; limite gratuit / payant à décider avec des utilisateurs.
2. Combien d'unités A1 pour lancer : tranché le 06-11, l'A1 seul en février.
3. Statut juridique : tranché le 24-10, micro-entreprise.
4. Les 14 questions du §9 de l'état de l'art des parcours (répétition espacée, courriel hebdo…).
5. Casting des personnages et autorisations écrites.
6. Héberger soi-même les photos satellite si des trous reviennent (environ 6 Go).
7. Migration de Supabase vers un hébergeur européen (reportée sciemment, CLOUD Act).

## 7. Les discussions et leur chantier

Depuis le 2026-11-13 : une discussion mère (L'amic) et des sous-discussions par tâche ; l'ancienne liste est dans l'archive du 13-11.

**Archivage du 13-11 au soir** (demande de Romain) : L'amic a lu la fin des 30 autres discussions Lo Ligam et contrôlé leurs copies de travail. 25 n'avaient rien hors de `master` ni de non committé (la fin de deux d'entre elles, la session cheffe de l'audit final et « Data Deception », ne disait rien d'exploitable) : leurs restes étaient déjà dans ce tableau ou sont repris au §9. Quatre branches portent du travail hors de `master` (chantiers 55, 57, 58, 59), gardé aussi sous `archiu/<nom>`. Deux discussions restent ouvertes : « Occitaniser photos avec switch langue » (travail non committé, chantier 56) et l'ancienne « Discussion mère (fork 2) », épinglée.

## 8. Chantiers de la méthode L'amic (ouverts le 13-11)

- 43 Ménage des consignes : `CLAUDE.md` et ce tableau allégés ; 18 documents de la racine rangés dans `docs/pedagogia/` et `docs/archius/` (13-11, index `docs/LEGIR-ME.md`). Reste : alléger `AGENTS.md`, `COORDINATION.md`, `BRIEF-MISTRAL.md`.
- 44 Livret technique : en ligne le 13-11, `/admin/libret` (neuf briques ; données `app/src/lib/libret/fichas.js`). À chaque décision technique : ajouter ou corriger une fiche.
- 45 Séances dans le nuage : `app/.env` absent, donc pas de relève de « Per tu » ni de vérification de l'occitan. À décider avec Romain.
- 46 Feuille de route (13-11) : cœur = apprendre l'A1 et explorer la carte ; février n'est plus une date ; à-côtés à trier au cas par cas avec Romain. Constat : 38 modules A1 sur 38 écrits et jouables, 1 fichier audio sur 39 pour la seule unité 1, aucun son branché, 26 pages d'essai `/ensag/`, deux parcours (`/apren`, `/aprene`). À écrire avec Romain.
- 47 Alertes de langue : avertissement « des erreurs peuvent subsister » et filtre qui regroupe les alertes reçues par le contact. À cadrer.
- 48 LISN (13-11) : visio tenue, le LISN est favorable à l'usage de ses voix sur le site ; nouvelle visio en décembre où Romain présente le site. Sujet : utiliser leurs audios en leur apportant du trafic, tout en gardant l'écoute sur le site. À préparer : propositions concrètes et page à montrer.
- 49 Voix de l'A1 (13-11) : Romain enregistrera, et veut d'abord une étude de faisabilité de Votz (synthèse vocale de lo Congrès). Étude lancée le 13-11. Votz : étude incomplète (sites de lo Congrès bloqués dans le nuage), licence à éclaircir par écrit ; Romain a déjà utilisé Vòtz sur Instagram. Il enregistrera lui-même mais demande un moyen simple d'enregistrer à volume et qualité réguliers : proposition de L'amic, un studio d'enregistrement dans `/admin` (à décider). Interview sur son vécu : `docs/pedagogia/entrevista-metode.md`.
- 50 Principes de l'A1 à reprendre (13-11) : Romain n'aime pas « Tu l'as déjà entendu » (idée de l'IA, pas forcément vraie). Il précise : il n'est pas professeur et n'a pas encore de cours, la méthode est à construire avec lui. Il veut une entrée par le lien personnel, adaptée à trois profils : locuteurs, néolocuteurs, curieux. Constat : personnages, dialogues et ordre du module 0 sont des ajouts de l'IA. Ne rien réécrire avant que la méthode soit posée avec lui. **Choisi le 13-11** : un parcours, trois portes (une question d'accueil sur le lien avec l'occitan, puis un accueil propre à chaque profil) ; méthode fondée sur son vécu d'apprenant, la recherche et de bons modèles.
- 51 Studio de voix (13-11) : premier chantier de la feuille de route. Environ 770 phrases dans l'A1 (504 répliques, 266 expressions). Choix de Romain : enregistrements mis au propre par lots (bruts dans un bucket privé Supabase, script ffmpeg sur son ordinateur, fichiers légers hébergés avec le site) ; avancer unité par unité (l'IA relit l'unité selon les huit principes, puis il l'enregistre). Trois lots : 1 la leçon joue un son par phrase (en cours, Sonnet) ; 2 la page studio `/admin/voix` et son SQL (à confier à Opus : droits et stockage) ; 3 le script `voix-polir` (exige l'ordinateur de Romain et ffmpeg). Une phrase = un fichier, clé tirée du texte : une phrase corrigée est à refaire. **État au 13-11 soir** : lots 1 et 2 en ligne (`/admin/voix`, 1 123 tests). `supabase/supabase-voix.sql` exécuté le 13-11 par L'amic avec l'accord de Romain (connecteur Supabase ; contrôle : dossier privé, 2 Mo, quatre règles). **Romain** : vérifier sur `/admin/verrolhs`, essayer sur son téléphone (une dizaine de phrases). Lot 3 à faire sur son ordinateur : script `voix-polir` ; pour lire le bucket privé, créer un compte Supabase dédié non administrateur avec une seule règle de lecture (la clé limitée de l'IA ne peut pas lire le stockage) ; ajouter ensuite une fiche « la voix » au livret technique.
- Méthode de Lo Ligam : huit principes validés le 13-11 (`docs/pedagogia/entrevista-metode.md`). Ordre retenu ensuite : studio de voix, puis module 0 (trois portes, vergonha), puis relecture des 38 étapes sous les huit principes, puis fiabilité (lo Congrès, alertes), puis carte.
- 52 Tableau de bord par facettes (13-11) : grille croisée 6 rubriques × 8 exigences en tête de `/admin/seguit` (données `app/src/lib/seguit/facetas.js`), pas de limite de rubriques en chantier (Romain, 13-11 ; en ce moment : lo parcors et S'imagina), en ligne dans `/admin/seguit` (première version le 13-11 avec 35 cases grises ; mise à jour le 13-11 au soir : 28 cases jugées sur preuve, 20 à évaluer). Mots de Romain : `docs/vision/facetas-romain-2026-11-13.md`. Prochain pas : évaluer la colonne Expérience (sa première exigence, jamais jugée sur cinq rubriques sur six), puis Coût et Faisabilité. Petit défaut vu le 13-11 : les en-têtes « Authenticité » et « Accessibilité » se coupent en deux lignes. L'apprentissage se construit par interview de Romain, avec les outils de référence (lo Congrès, CIRDOC, Occitanica, OPLO).
- 53 Module 0 (13-11) : proposition prête, `docs/pedagogia/11-modul-0-proposicion.md` (12 écrans, quatre décisions en QCM non encore posées : place des héritiers, écart entre portes, qui parle de la vergonha, vrai texte ou non). Mots à vérifier depuis l'ordinateur de Romain (commande dans le fichier).
- 54 Entraînement à la traduction (13-11) : page d'administration pour Romain (phrase en français, traduction sans aide, touches d'accents, mots vérifiés par lo Congrès puis modèle) ; construite le 13-11 (`/admin/revirar`, `app/src/lib/revirar/`, route `/api/congres/verificar` réservée à l'administrateur : lo Basic puis vèrb'Òc), en ligne le 13-11 au soir avec l'accord de Romain (contrôle de sécurité de Rodrigo : rien de bloquant) ; la chaîne lo Basic puis vèrb'Òc répond avec la vraie clé (essai direct de L'amic), la page elle-même attend le premier essai de Romain connecté. Interview du parcours ouverte (Q5 à Q7 et deux textes d'essai dans `docs/pedagogia/entrevista-metode.md`) : sa mécanique tient, ses écarts sont les accents et les formes calquées du français ; il reste à tester le futur. État de S'imagina : `docs/vision/s-imagina-estat-2026-11-13.md` (cinq questions d'interview prêtes) ; grille des facettes à jour, en ligne le 13-11 au soir. Phrases de Revirar corrigées le 13-11 d'après lo Congrès (dormís, volriái, mainats) ; reste à faire reconnaître « uèi », « Tolosa » et les noms propres par la route de vérification.
- 51, suite : lot 3 écrit et essayé sur de faux bruts (`app/scripts/voix-polir.mjs`, `outils/voix-polir.cmd`, `supabase/supabase-voix-lector.sql` non exécuté, fiche « La voix » du livret). Dans `master`. Reste à Romain : installer ffmpeg, créer le compte lecteur, essayer.
- 55 Consolidation (14-11) : **fait le 14-11, accord de Romain.** Mémoire 121 fiches → 57 (44 gardées, 21 archivées, 56 regroupées en 13 ; tout est dans `memory/archiu-2026-11-14/`, index 17 Ko → 9 Ko). Agents réécrits (Joan 494, Rodrigo 591, Aran 613, Clara 450 mots ; anciens dans `~/.claude/agents/archiu-2026-11-14/`) ; Joan = relecture à froid, plus de verdict de goût. Contradictions tranchées : Lo Ligam garde son sombre brun et le papier découpé (la consigne générale vaut ailleurs) ; goût visuel = Romain ; un sous-agent seul oui, plusieurs sur accord. Reste : alléger le CLAUDE.md global (DA « sans teinte, filets fins » à nuancer pour Lo Ligam ; règle multi-agents à préciser) et le CLAUDE.md du projet (retirer le renvoi au rôle de filtre de Joan s'il existe) ; les fiches regroupées sont encore des concaténations, à condenser plus tard.

## 9. Tâches reprises des anciennes discussions (13-11)

Relevées à la fin de chaque discussion avant archivage. « Romain » = une décision à poser en QCM dans la discussion mère ; « sous-discussion » = un travail à confier.

- 55 Audit critique du 13-11 : **en ligne le 14-11** (accord de Romain : « Oui, mets en ligne » ; master `e5e93038`, aucune coupure). Tuiles d'Amassa et de Mèdias ; « Mencions legalas », confidentialité réécrite (relue par Aran, arabe et espagnol retouchés ; l'arabe reste à faire relire par un arabophone), méta de `/apren` ; « navigator » dans le texte occitan de la carte (confirmé par lo Congrès) ; compression du serveur (`app/src/serveur/`, lancée par le Dockerfile) : accueil de 125 à 25 ko en ligne, polices en cache 30 jours, en-têtes de sécurité intacts. Reste mineur : la page 404 n'est pas compressée. Romain, plus tard : « ara, soi a Lion », entrées « Aviat », `/apren` ou `/aprene`, protection de `/ensag/*`.
- 56 S'imagina, outil photo : **recadré par interview de Romain le 13-11** (`docs/vision/entrevista-imagina-fotos-2026-11-13.md`). Atelier public : le visiteur touche un endroit repéré sur une photo choisie par Romain, prend un mot dans une liste vérifiée, voit tout de suite une esquisse (un dessin assumé) et peut l'enregistrer ; le site ne garde rien ; il repart avec un possible, une question, une audace. Sous-discussion de la discussion mère : page d'essai sur 3 ou 4 photos, styles d'esquisse comparés. L'acquis (perspective mesurée, `/admin/imaginar`, montages réalistes) est committé et poussé sur la branche `claude/occitan-photo-language-switch-39b8aa` (`dc344d35`), pas en ligne. **Les quatre montages réalistes sont rejetés par Romain (13-11 : « Il ne me vont pas donc à refaire »)** : à refaire **en montages réalistes** (Romain, même jour : « Non, en réaliste », quand L'amic a demandé « en esquisse, dans l'atelier ? »). Deux volets donc : l'atelier public à esquisse (sous-discussion en cours) et quatre montages réalistes à reprendre. Quatrième rejet du réalisme. **Diagnostic de Romain (13-11, QCM)** : « ça se voit que c'est ajouté », « l'objet ne fait pas vrai », « mal placé, mauvaise taille » ; le choix des photos et des mots n'est pas en cause, c'est la fabrication. Lecture de L'amic : la technique actuelle (perspective et lumière calculées, objet collé) a atteint son plafond, et l'emplacement revient à Romain (`/admin/imaginar`, jamais encore utilisé pour un vrai montage). Trois pistes posées, **aucune choisie** : essai par une IA d'images via Canva (piloté par L'amic sur une seule photo, la photo part chez Canva), essai par Le Chat de Mistral (modèle FLUX, européen, fait à la main par Romain, import d'une photo non confirmé), texte seulement sur des objets qui existent déjà. **Romain reporte le sujet (13-11 : « On verra plus tard pour ce sujet. Plutôt semaine prochaine ») : ne pas le relancer avant la semaine du 16-11**, lui reposer alors la question des trois pistes ; ne pas relancer de retouches à l'aveugle ; rien n'est supprimé de la branche. **L'atelier à esquisse a rendu sa page le 13-11** : `/ensag/imagina-atelier` (essai, non référencé), branche `claude/imagina-atelier-esquisse-e7f636` (`a235f7e9`), pas en ligne, fusion sans conflit. Trois photos, sept endroits, mots vérifiés par lo Congrès, trois styles côte à côte (le trait, le papier découpé, le calque), image fabriquée dans le navigateur, rien gardé ; 1198 tests et construction passés (son rapport). Regardée par L'amic à 375 et 1830 px : sobre, aucune erreur ; un point à reprendre : sur téléphone la photo reste fixée en haut et couvre le milieu de l'écran, un bouton amené là (clavier, lecteur d'écran) se retrouve dessous. Trois questions pour Romain, une à la fois, **quand il y reviendra** : le style ; le nom « Androna de Lo Prat » (« androna » est languedocien) ; les textes de la question et de l'audace (brouillons de l'IA). Suites proposées par la sous-discussion : endroits tracés depuis `/admin/imaginar` plutôt qu'écrits à la main dans `atelier.js`. Romain, plus tard, une à la fois : choix des 10 à 20 photos ; relecture du texte « question » et des gestes d'audace ; où montrer les montages réalistes une fois refaits ; `/admin/imaginar` en ligne maintenant ou avec l'atelier ; vrai nom de la rue du montage « Carrièra de Sant Pèire ».
- 57 Carte en papier découpé (`/ensag/carta-papier`) : six commits sur `claude/map-paper-cutout-style-0679de`, pas en ligne. Romain : Lisérés (recommandé) ou Calque ; ensuite report dans la vraie carte ; déplacer ou non la frontière des six bandes qui penchent.
- 58 Interpellation des parlementaires : phase 2 faite sur `claude/occitan-parliament-tool-c4e7c1` (`app/scripts/elus-generar.mjs`, `app/static/data/elus.json` : 156 députés et 94 sénateurs de la zone), non poussée. Romain : le texte du message et l'emplacement du lien de pétition. Avant mise en ligne : vérifier les sénatoriales de septembre 2026.
- 59 Bibliothèque d'inspirations (14 boutons et éléments) : un commit sur `claude/inspirations-elements-67dbfd`. Romain : lesquels lui plaisent, et pourquoi en deux mots.
- 60 Moteur de la carte : étude MapLibre faite (onze fichiers dépendent de Leaflet, neuf couches sur canevas ; poids et mémoire sur téléphone en jeu). Romain : essai `/ensag/carta-maplibre` d'abord (recommandé), tout migrer, ou garder Leaflet.
- 61 Police à la main de Romain (Calligraphr) : sa sélection fait 73 signes, sans apostrophe, ponctuation ni chiffres. Romain : titres seulement (gratuit) ou textes courants (payant).
- 62 Carte, noms : lo Congrès donne « Jarnat » (Les Issards) et « Lées e Atàs » (Lées-Athas), à afficher à la place du masque ; 63 noms gardés sans source ; noms à demi français en Ardèche ; deux écarts de l'audit A (Laà-Mondrans, La Rochette-du-Buis).
- 63 Livre de Louis Pastre : corrections page par page sur captures de Romain ; lenteur à l'ouverture à confirmer par lui.
- 64 Petites corrections du 13-11 : **en ligne le 14-11** (accord de Romain : « Oui, mets en ligne » ; master `9f663886`). Relues par Sonnet (effort moyen) : 1188 tests et construction passés, aucun défaut ; en-tête et Remira regardés à l'écran par L'amic, grille des facettes non (connexion administrateur). Angle mort voulu de Revirar : un mot avec une majuscule en milieu de phrase est pris pour un nom propre et n'est pas vérifié.
- Petits restes : Remira (dessin doré peu lisible sur la porte ocre de L'ostal, cadrage du mode Paisatges) ; phrase sous la tuile « Mots en imatges » ; talhièr, lot 2 ; idée pour S'imagina : générateur de plaques de rue (noms du mod Cities Skylines II) ; page « Soutenir » : virement d'abord ou service de paiement (chantier 31) ; en-têtes de la grille des facettes qui se coupent.
