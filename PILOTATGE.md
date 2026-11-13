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
- 22 Page Amassa : en ligne (25-10), boîte à idées codée, option A. Romain : relire l'occitan, SQL ; groupes avec chat ; supprimer ensuite `Bastian_proba`.
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
- 34 Carte qui s'assemble au défilement : essai `/ensag/pieces-defilement` jugé « bof » (12-11). Romain regarde ; sinon abandon.
- 35 Motifs-symboles au défilement : essai refait `/ensag/motius-simbols` (12-11). Romain regarde sur téléphone ; s'il garde, intégration à l'accueil.
- 36 Audit final, la carte : fait (12-11), correction des noms inconnus (c0c4338f). Romain répond aux questions ; ensuite Claude.
- 37 Audit final, l'accueil : fait et en ligne (12-11). Mesurer le moteur `app/src/lib/acuelh/motor.js` sur machine à carte graphique ; Romain regarde les confettis.
- 38 Constitution en occitan : en ligne (12-11), `/constitucion`, hors menu. Romain relit l'occitan (`app/src/lib/constitucion/LEGIR-ME.md`), dit si elle entre dans Se parla.
- 39 Audit final, code, couleurs, sources : fait (12-11), 1 047 tests verts. Avant lancement : accord LISN, lever le `noindex`, retirer les essais `/ensag/`.
- 40 Une seule porte : fait (12-11). Claude relève les cartes 155 à 159, notes 126 et 128, applique « rotge-carta ».
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

## 8. Chantiers de la méthode L'amic (ouverts le 13-11)

- 43 Ménage des consignes : `CLAUDE.md` et ce tableau allégés ; 18 documents de la racine rangés dans `docs/pedagogia/` et `docs/archius/` (13-11, index `docs/LEGIR-ME.md`). Reste : alléger `AGENTS.md`, `COORDINATION.md`, `BRIEF-MISTRAL.md`.
- 44 Livret technique : en ligne le 13-11, `/admin/libret` (neuf briques ; données `app/src/lib/libret/fichas.js`). À chaque décision technique : ajouter ou corriger une fiche.
- 45 Séances dans le nuage : `app/.env` absent, donc pas de relève de « Per tu » ni de vérification de l'occitan. À décider avec Romain.
- 46 Feuille de route (13-11) : cœur = apprendre l'A1 et explorer la carte ; février n'est plus une date ; à-côtés à trier au cas par cas avec Romain. Constat : 38 modules A1 sur 38 écrits et jouables, 1 fichier audio sur 39 pour la seule unité 1, aucun son branché, 26 pages d'essai `/ensag/`, deux parcours (`/apren`, `/aprene`). À écrire avec Romain.
- 47 Alertes de langue : avertissement « des erreurs peuvent subsister » et filtre qui regroupe les alertes reçues par le contact. À cadrer.
