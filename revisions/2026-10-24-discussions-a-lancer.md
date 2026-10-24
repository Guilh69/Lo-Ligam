# Cinq discussions à lancer (2026-10-24)

> **Dépassé le jour même** : le projet est sorti de Documents (`C:\Users\perie\Depots\Lo_Ligam`, cahier §11) et les discussions en un clic remarchent ; les cinq ont été lancées ainsi. Ce fichier ne sert plus que de trace.

Les tâches suggérées par Claude n'ont pas pu démarrer : elles s'ouvrent dans une copie à part du projet, ce que l'application ne gère pas depuis que le carnet de Git est hors de Documents.

**Comment faire, pour chacune :** dans l'onglet Code de l'application Claude, ouvre une nouvelle session dans le dossier `Documents › 6_Projectes › Lo_Ligam`, sans « worktree ». Copie le bloc de la discussion choisie et colle-le comme premier message. Ordre conseillé : 1, puis 2 quand tu as les documents du catalan, puis 3, 5 et 4.

## 1. Page 02 S'apren et l'écran « Cours en visio »

```
Chantier 19 du PILOTATGE. Début de séance : git pull, lire CLAUDE.md, PILOTATGE.md (chantier 19, barreau 6), cahier-des-charges.md §11 (dont « écarté »), DIRECCION.md et charte-graphique.md par extraits.
Ma demande : créer la page de la rubrique 02 S'apren (rôle distinct de l'accueil, pas de doublon). Et pour les cours en visio : quand on clique, un écran qui explique la méthode plus précisément, avant d'arriver sur mon calendrier (aujourd'hui le menu, app/src/lib/data/planSite.js, envoie directement vers RESERVAR de app/src/lib/acuelh/donadas.js).
Propose-moi deux ou trois options concrètes, une décision à la fois, puis code ce que je choisis. Textes modifiables par moi avec l'édition sur place (use:editar, filet elements-filet.json). Le contenu pédagogique vient de moi : tu peux reprendre l'accueil et me poser des questions. Mots occitans vérifiés avec verificar-oc.mjs. Build, captures à 1830 px et téléphone, commit des fichiers par leur nom, push, ligne au cahier §11 et au PILOTATGE.
```

## 2. Progression, sur le modèle de mon cours de catalan

```
Chantier 20 du PILOTATGE. Début de séance : git pull, lire CLAUDE.md, PILOTATGE.md (chantiers 20, 3, 4, 5, 16), cahier-des-charges.md §11 et les documents pédagogiques listés dans PILOTATGE, par extraits.
Ma demande : réfléchir à ma progression en m'appuyant sur mon cours de catalan, dont le circuit est très intéressant. Je t'envoie les documents (captures, PDF, liens).
Analyse le circuit (déroulé d'une leçon, ordre des notions, répétitions, évaluations), rapproche-le de la méthode déjà validée (méthodo A à D, scènes « Lumière avec pastilles », unité 1), puis propose-moi deux ou trois façons de le transposer à l'occitan, une décision à la fois, en distinguant ce que je fais seul et ce qui demande du code. Posture compagnon : je pense, tu questionnes et vérifies, tu ne rédiges pas le contenu pédagogique. Décisions au cahier §11 et au PILOTATGE, commit et push.
```

## 3. Page 01 Se parla et les musiques des artistes

```
Chantier 21 du PILOTATGE. Début de séance : git pull, lire CLAUDE.md, PILOTATGE.md (chantier 21, barreau 6), cahier-des-charges.md §11, DIRECCION.md et charte-graphique.md par extraits.
Ma demande : créer la page de la rubrique 01 Se parla (aujourd'hui /carta, /wiki vide, /obras, /articles vide), et réfléchir à l'intégration des musiques : Deezer et plusieurs formats, juste des liens. Je ne veux rien voler, seulement permettre d'accéder aux musiques des artistes que j'identifie.
Contraintes : outils européens d'abord (Deezer, Qobuz ; Bandcamp aide les artistes), sobriété, vie privée (un lecteur intégré pose des traceurs : seulement au clic, avec consentement). Je dois pouvoir ajouter moi-même artistes et liens (édition sur place ou table avec RLS écrites et vérifiées). Propose deux ou trois options, une décision à la fois, puis code. Mots occitans vérifiés, build, captures, commit, push, cahier §11 et PILOTATGE.
```

## 4. Page 03 Amassa : groupes, forum, boîte à idées

```
Chantier 22 du PILOTATGE. Début de séance : git pull, lire CLAUDE.md, PILOTATGE.md (chantier 22, barreau 6), cahier-des-charges.md §11 (dont « écarté ») et DIRECCION.md par extraits.
Ma demande : réfléchir à comment créer des groupes, des forums et une boîte à idées, pour que les gens se rencontrent et sachent qu'ici ils trouvent d'autres locuteurs de l'occitan. Le menu annonce /forum, /grops, /ideas, vides ; la carte a déjà les cercles occitans et les Calandretas ; comptes Supabase (UE) ; site pas encore public.
Je suis seul pour modérer, outils européens uniquement, RLS écrites et vérifiées avant d'ouvrir quoi que ce soit, RGPD. Réflexion d'abord, pas de code avant mon choix : compare deux ou trois options (par exemple annuaire des groupes existants plus boîte à idées ; forum dans le site ; outil européen à part) avec modération, risques, coût et ce que je peux faire seul. Puis la première marche choisie, build, captures, commit, push, cahier §11 et PILOTATGE.
```

## 5. Mon istòria et Contacte

```
Chantier 23 du PILOTATGE. Début de séance : git pull, lire CLAUDE.md, PILOTATGE.md (chantiers 7 et 23), cahier-des-charges.md §11, transposicion-racine2.md (A prepaus, Contacte, FAQ) et charte-graphique.md §3bis par extraits.
Ma demande : mettre en place la page Mon histoire, avec le contact peut-être ; il faut peut-être regrouper, à voir. Le menu (planSite.js, liste LO_LIGAM) annonce /istoria et /contacte, vides ; l'accueil a déjà le manifeste et ma photo.
Propose deux ou trois options (page unique avec contact en fin ; deux pages ; contact dans le pied de page partout) et pour le contact : formulaire (anti-spam, RGPD, outil européen), adresse protégée ou prise de rendez-vous. Une décision à la fois. Mon récit vient de moi : tu structures et questionnes, tu n'inventes pas. Textes modifiables par l'édition sur place. Mots occitans vérifiés, build, captures, commit, push, cahier §11 et PILOTATGE.
```
