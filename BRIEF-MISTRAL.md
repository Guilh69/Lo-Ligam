# Briefing de passation : Mistral reprend Lo Ligam

> **Écrit par Claude le 2026-11-02, à la demande de Romain.** Romain passe à Mistral pour quelques mois (budget, et envie d'aller plus loin avec une IA française) et garde Claude en contrôle. La logique s'inverse : **Mistral devient l'agent principal, Claude le regard de contrôle.** Ce document remplace l'ancien brief où Mistral était le garde-fou.
>
> **Calendrier** (Romain, 2026-11-02) : **jusqu'au 6 novembre, Claude garde la main**, et c'est « un peu des deux, en fonction de ce que je demande ». **Le vrai changement se fait après le 6 novembre**, à la fin du forfait Claude. Pendant ces quelques jours, Mistral peut déjà travailler sur ce que Romain lui confie, mais ne reprend pas un chantier en cours de Claude sans qu'il le demande ; `git pull` avant tout, Claude pousse encore sur `master`.
>
> Il contient tout ce qu'il faut pour reprendre efficacement : qui est Romain et comment il travaille (§2, la partie la plus précieuse : elle ne se lit nulle part ailleurs dans le dépôt), ce qui est fait (§4), ce qui reste (§5), où sont les choses (§6), les pièges techniques (§7) et la façon dont Claude contrôle (§10).
>
> Les règles courtes sont dans `AGENTS.md` (lu automatiquement par Mistral Vibe). Ce fichier est la référence complète : à lire en entier une fois, puis par extraits. Les libellés occitans cités ici sont ceux qui existent déjà sur le site.

## Sommaire
1. La nouvelle répartition des rôles
2. Romain, et comment travailler avec lui
3. Le projet en une page
4. Ce qui est accompli (bilan au 2026-11-02)
5. Ce qui reste à faire, par ordre de priorité
6. Carte du dépôt
7. Technique et pièges connus
8. Les outils de vérification
9. Décisions déjà prises, à ne pas rouvrir sans argument nouveau
10. Le contrôle par Claude : mode opératoire
11. Ce qui ne passe pas d'une IA à l'autre, et comment compenser
12. Leçons du premier passage (calibrage)
13. Mode d'emploi pour Romain

---

## 1. La nouvelle répartition des rôles

| | Rôle après le 6 novembre 2026 (jusque-là, Claude garde la main) |
|---|---|
| **Romain** | Urbaniste, locuteur d'occitan, seul sur le projet. Fixe le cap, décide, installe, héberge, paie, **valide l'occitan**. Non développeur. |
| **Mistral** | **Agent principal.** Conçoit, code, rédige les unités du cursus, explique. Tient `PILOTATGE.md` et le journal des décisions (`cahier-des-charges.md` §11). Écrit une fiche de passation pour chaque changement sensible. |
| **Claude** | **Contrôle ciblé.** Relit les changements sensibles sur fiche de passation, donne un second avis avant une grosse décision, aide sur un blocage. Ne code plus par défaut. Son temps coûte (c'est la raison du changement) : on le réserve aux sujets qui le méritent, une fiche par sujet, jamais un audit général. |

**Ce que Romain attend des deux IA** : qu'elles travaillent ensemble. Si elles sont d'accord, il gagne du temps ; si elles ne le sont pas, il gagne une information. **Celle qui se met en avant ou rabaisse l'autre sera celle qu'il utilisera le moins.** Claude s'y engage de son côté (`CLAUDE.md`) ; la même règle vaut pour Mistral.

Concrètement, dans les deux sens :
- Dire d'abord ce qui est juste dans le travail de l'autre, puis corriger sur le fond, avec la preuve, sans juger l'auteur.
- Un retour de l'autre IA est une entrée à vérifier une par une (relancer la commande, lire le fichier), ni un ordre ni une erreur probable.
- Reconnaître ses propres erreurs simplement.
- En cas de désaccord, l'exposer à Romain avec l'argument et ce qui le prouverait. Il tranche.

## 2. Romain, et comment travailler avec lui

Ces règles viennent de trois mois de travail ensemble (fin juillet à début novembre 2026). Chacune est née d'un vrai incident ou d'une demande explicite de Romain.

### 2.1 Communication
- **Toujours en français**, sans exception, messages d'avancement compris. Il s'est agacé plusieurs fois de recevoir de l'anglais.
- **Il dicte à la voix** (touches du clavier en panne) : lire à travers les fautes de frappe et les « euh ». Il n'a pas de touche accent grave : quand il écrit « nostra » ou « Occitania », rétablir *nòstra*, *Occitània*, et vérifier.
- **Non développeur** : expliquer en français simple, une étape à la fois, dire quoi cliquer.
- **Chemins complets** : tout dossier ou fichier qu'il doit ouvrir se donne en entier, pas à pas, avec les numéros des dossiers (`C:\Users\perie\Documents\6_Projectes\…`), et se rappelle à chaque fois.
- **Ne jamais lui demander de clé d'API.**
- **Il ne peut pas écrire dans un fichier** `.md` : les doutes se posent dans la conversation, une question à la fois ; la relecture des textes du site se fait sur la page avec le bouton « Editar ».
- **L'heure** : lire l'horloge (`date`) avant de dire « ce soir » ou d'horodater une note.
- **Finir par une synthèse courte et le bon lien** (https://loligam.eu/la-page-concernée), jamais le faire fouiller. S'il y a plusieurs aperçus, n'en pointer qu'un.

### 2.2 Décisions
- **Une décision à la fois, deux ou trois options concrètes**, ta recommandation en premier. Écrire les options et les explications **avant** la question, pas après.
- **« Es-tu sûr ? »** : revérifier la source et répondre avec la preuve. Ne jamais céder sans vérifier, ne jamais s'obstiner sans vérifier.
- **Contredire quand c'est justifié**, signaler coûts, risques et dérives de périmètre.
- **Relire les idées écartées** avant de proposer une mécanique : `grep -n "écart" cahier-des-charges.md` (exemple : « vrai mot ou mot inventé », écarté le 2026-08-29).
- **Un souci qui revient** : revenir à la méthode d'origine (une donnée de référence, une jointure propre), pas de rustine par-dessus une rustine.
- **Romain est seul** : tout se classe « lancement » ou « évolution ».
- **Ne jamais retirer une fonction existante** sans son accord.
- Les décisions vont au **cahier §11**, datées, avec sa phrase entre guillemets et les options écartées. Pas dans la mémoire d'une conversation.

### 2.3 Visuel
- **Il juge sur la page, pas sur des chiffres.** Ses captures d'écran sont le meilleur outil de diagnostic. Son écran fait environ 1830 px de large ; **le téléphone est l'usage principal du site**.
- **Méthode des essais** : une page d'essai `/ensag/<sujet>` (non indexée) montre deux ou trois propositions côte à côte ; il choisit (« je prends C ») ; on garde le choix seul, puis on le branche sur la vraie page. Les essais en ligne passent par une route `/ensag/…`, pas par des fichiers `static/esbos-*.html` (retirés au build).
- **Oser proposer** : des pistes franches et différentes, pas trois retouches prudentes de l'existant (« tu te censurais »).
- **Une maquette habille le vrai composant**, elle ne le redessine pas à côté.
- **Sobre, pas kitsch** : lisibilité d'abord, une seule touche thématique discrète, panneaux translucides (le portulan orné a été rejeté le 2026-10-10).
- **Finition** (« ça fait amateur » sinon) : grouper et hiérarchiser, libeller les icônes dans la langue choisie, `@container` plutôt que `@media`.
- **Polices** : Limelight **seulement** pour les gros titres et les gros chiffres (le reste est « assez difficile à lire », 2026-11-02) ; Luciole pour tout le reste ; Cormorant Garamond pour les citations. Aucune autre police.
- **Couleurs, règle B** (2026-10-23) : le rouge du logo, en aplat ou en soulignement, pour **ce qui se clique** ; l'or et l'ocre pour **mettre en valeur** ; jamais de rouge en texte sur fond sombre. Couleurs du logo : uniquement les recettes de Romain (jetons `--logo-*`, composant `Crotz.svelte`) ; sur fond clair, ocre et rouge, jamais de brun. Couleurs de données : seulement les teintes de la charte, contraste d'au moins 3 pour 1.
- **Photos** : le langage média du site (panneau arrondi, image en *cover*), pas de cadre bricolé (liseré, arc, vignette rejetés le 2026-10-25). Pas d'images générées par IA. Système photo « sang e aur » : `charte-graphique.md` §3bis.
- **Icônes** : jamais d'écriture non latine pour figurer les langues (pas de « A/文 »).
- **Navigation** : « clic ailleurs, jamais deux clics » : un panneau se ferme quand on clique ailleurs.
- **Cartes** : aplats sans contour, comme dans QGIS ; limites en pointillé blanc très fin, frontière tracée une seule fois.
- **Optimiser au maximum à chaque changement, sans jamais dégrader le rendu** : mesurer avant et après.
- **Animations de texte** : onze effets reproduits de Canva (`app/src/lib/actions/animarText.js`, démonstration sur `/ensag/letra`), à proposer sobrement quand c'est pertinent.

### 2.4 Textes et contenus
- **Tutoiement partout** sur le site.
- **Pas de tirets longs, pas de jargon anglais** dans les textes publics.
- **Aucun slogan ni accroche inventés** dans la voix de Romain (il en a retiré un le 2026-10-25). On lui propose des options, on n'écrit pas à sa place.
- **Prononciation** : son usage vivant, pas fon'Òc, et sans contraste avec le français standard.
- **Noms de lieux** : la forme du dialecte du lieu, en graphie classique, jamais phonétique ; **sans forme sûre, on masque le nom** plutôt que d'en inventer un.
- **Adresse** : seul l'alias de contact apparaît sur le site, jamais l'adresse personnelle de Romain.
- **Ton** : animations soignées, sons discrets et désactivables, humour fin par touches.

## 3. Le projet en une page

**Lo Ligam** est un site d'apprentissage de l'occitan (languedocien, norme classique), **support des cours en visio de Romain** (repositionnement du 2026-10-06) et prolongement de sa marque Instagram. Adresse unique : **https://loligam.eu** (www et l'ancienne adresse Scaleway y renvoient).

- **Plan du site**, dans cet ordre : **Se parla** (où et comment l'occitan se parle : la carte, les médias, les œuvres), **S'apren** (le parcours d'apprentissage et les cours en visio), **Amassa** (la communauté : groupes, boîte à idées). L'accueil s'ouvre sur la carte en étoiles. Le site s'ouvre en occitan, avec la bascule Òc / Fr bien visible et un globe pour l'espagnol, l'anglais, le catalan et l'arabe.
- **Premier public** : le curieux. Âge minimum 15 ans.
- **Modèle économique** : cours en visio payants (grille A : 15, 22 ou 30 €, tarif solidaire sur déclaration, cours individuels, paiement par virement), sous **micro-entreprise**. La limite gratuit / payant du parcours autonome n'est pas tranchée.
- **État** : **pas encore lancé au public**, volontairement : `app/static/robots.txt` dit `Disallow: /` et `app/src/hooks.server.js` envoie `X-Robots-Tag: noindex, nofollow`. On les retire au lancement (barreau 8). Donc pas de plan de site ni de balises de partage avant.
- **Valeurs non négociables** : éthique, écologie (**sobriété : poids des pages et des images**), inclusivité (RGAA/WCAG, écriture inclusive), fierté occitane, européen quand possible. Pas de pistage publicitaire, pas de revente de données, minimisation des données (RGPD).
- **Volume** : environ 1 085 commits depuis le 2026-07-28.

## 4. Ce qui est accompli (bilan au 2026-11-02)

### 4.1 Socle et mise en ligne
- SvelteKit 2 (Svelte 5) dans `app/`, `adapter-node`, Supabase (base, comptes, stockage, région UE), conteneur Scaleway à Paris, nom de domaine `loligam.eu` (2026-10-15).
- **Déploiement automatique** : un `git push` sur `master` qui touche `app/**` (hors `.md`) lance `.github/workflows/desplegar.yml` : GitHub construit l'image (Node 22), l'envoie au registre Scaleway, redéploie le conteneur `lo-ligam` et vérifie que le site répond. Romain n'a rien à faire.
- Application installable sur téléphone (PWA, 2026-10-26) : `app/static/manifest.webmanifest`, icônes faites par `outils/icones-pwa.py`.
- Courriels du compte et du formulaire de contact par **Scaleway Transactional Email** (2026-10-25) : domaine validé (SPF, DMARC, MX), SMTP réglé dans Supabase, variables `SCW_PROJECTE` et `SCW_TEM_CLAU` posées dans le conteneur.
- Sécurité : politique de sécurité du contenu stricte (`app/svelte.config.js`), règles d'accès RLS sur toutes les tables (`supabase/`, contrôle `npm run verificar:rls`), mot de passe de 10 caractères avec complexité, mot de passe actuel exigé (et vérifié par le serveur) pour le changer ou supprimer le compte. Mise à jour des dépendances du 2026-11-02 : 7 alertes faibles restantes, qui demandent SvelteKit 3 (changement cassant, laissé de côté).

### 4.2 Accueil, ambiance et charte (barreaux 1 et 2 de l'échelle)
- Thème sombre « Éclat » avec les « Venas d'aur » par défaut, thème clair « Plâtre » au choix (`app/src/lib/stores/ambianca.svelte.js`, liste des pages sombres tenue identique dans `app/src/app.html`).
- Pourquoi, pour qui, les trois rubriques : tranchés (blocs 1 à 3 de `DIRECCION.md`). L'accueil montre « occitan ⇄ ta langue » avec animations.

### 4.3 La carte `/carta` (le gros du travail d'octobre, chantier 13)
- Communes cliquables (10 042 noms, `app/static/data/comunas/noms.json`, recherche dans `app/src/lib/comunas.js`), fiches de communes, noms locaux dans leur dialecte, langues de France et langues voisines (hiérarchie langue, dialecte, sous-dialecte, sans trou), sources au survol.
- Voix (« Écouter la voix la plus proche »), lecture « Uèi », couche Ensenhament (970 lieux, dont 61 Calandretas), cercles (983), premiers pas en onze étapes (`app/src/lib/components/Guida.svelte`), interface pleine page sur téléphone.
- Chaîne de données dans `SIG/` (scripts Python et Node : `lenga.py`, `carta.json`, `noms-lengas.py`, `comunas-lengas.mjs`, `SIG/cadena/`). Données brutes hors Git (jonctions `SIG/brut`, `SIG/Limsi`).
- Administration : `/admin/carta`, `/admin/carta/luocs`.

### 4.4 S'apren : le parcours et les cours
- `/apren` en cases de couleur ; `/apren/visio` : la méthode avant le calendrier, le déroulé en cinq temps, les prix, **le questionnaire avant le premier cours** (sur la même page ; `/compte/questionnaire` est le questionnaire du compte).
- **Tout l'A1 est rédigé et jouable en ligne** depuis le 2026-11-02 : module 0, unités 1 à 8 (quatre modules chacune), haltes 1 à 4, mission A1, un encart *Alhors en Occitània* par unité (les mêmes mots dans les cinq autres grands dialectes). Un module = un fichier `app/src/lib/lesson/moduls/modul-*.js`, inscrit dans `index.js`. Blocs de leçon : `app/src/lib/lesson/*Block.svelte`.
- **« Lo camin »** (`/aprene`, 2026-11-02) : le parcours en plateau de jeu, une case par module, les haltes en gares, l'A2 fermé ; cadenas pour l'élève, tout ouvert pour l'administrateur. Logique : `app/src/lib/parcors/`. Fiche de passation : `revisions/2026-11-02-parcors-passation.md`.
- **Carnet de révision** (répétition espacée FSRS, `ts-fsrs`) : deux cartes par chose (« je reconnais » puis « je produis »), carnet dans le navigateur sans compte, rattaché au compte à l'inscription ; page de contrôle `/aprene/carnet` ; code `app/src/lib/carnet/` ; table `supabase/supabase-carnet.sql`.
- **Charpente du cursus** (toutes les décisions prises le 2026-10-24) : le **DCL** est le cap ; blocs de 45 h ; A1 = 2 blocs, A2 = 3 ; la scène ouvre l'unité, la tâche la ferme, un mémo la résume ; une révision nommée toutes les deux unités ; la séance du jour commence par la révision plafonnée. Détail : `revisions/2026-10-24-progression-catala.md`.
- **Cours en visio** : plan par défaut en quatre temps (culture, on écoute une chanson, on lit un texte, les mots), un cours par unité plus le cours 0 de Romain (*Benvengut dins lo mond occitan*) : `Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/visio-A1.md` (trous : chansons des cours 5 et 7, textes des cours 5 à 7).
- **Règles de rédaction** : `cursus/regles-redaccion-A1.md` (dont 17 règles tirées de la recherche, `revisions/2026-11-01-recerca-pedagogica.md`), lexique exact par module `cursus/lexic-A1.md`, contrôle « rien sans explication » (`app/scripts/controle-explications.mjs`).
- **Grammaire de référence** (2026-11-02) : carte de couverture `cursus/cobertura-gramatica.md` ; les 29 points manquants sont placés dans `cursus/trama-A2-C1.md` (marqués ◆, validés par Romain). Doutes A1-1 à A1-12 et A1-21 à A1-26 tranchés et appliqués (fiche : `revisions/2026-11-02-passacion-gramatica.md`).
- **Factures** des cours : page locale `outils/factura/` (numéros continus, avoirs, livre des recettes, facture bilingue), données dans `Lo_Ligam_hors-git\factures`. Mode d'emploi : `outils/factura/LISEZMOI.md`.

### 4.5 Se parla : médias et œuvres
- `/parla` en cases de couleur. `/medias` (teintes or) : radios en carte (`/medias/radios`), télévision en téléviseur à zapper (`/medias/television`), presse en kiosque (`/medias/premsa`).
- `/obras` (teintes vertes), une porte par art : littérature en bibliothèque (`/obras/literatura`), cinéma en mur d'affiches (`/obras/cinema`), affiches (`/obras/afichas`), scène à venir. Les anciennes adresses `/ensag/…` redirigent (`app/src/hooks.server.js`).
- **Café musique** : `/ensag/musica` (journal à pages, lecteur Deezer chargé au clic après accord) ; tri par Romain dans `/admin/musica` (cocher, étoiler, ajouter par le nom, « Enregistrar » publie ; le café relit Deezer chaque jour).
- Livre numérique de Louis Pastre (1913) : `/medias/livres/pastre-1913` (lots 1 et 2 faits, lots 3 à 8 à faire ; outils dans un dossier de Romain hors du dépôt).
- `/mots` : carrousel de mots.

### 4.6 Amassa : la communauté
- `/amassa` : cinq cases (gabarit commun `PaginaTeulas`).
- **Boîte à idées** : `/ideas`, modération `/admin/ideas`, table créée et vérifiée (18 contrôles).
- **Groupes et messagerie** `/grops` : **fermés au public**, visibles de l'administrateur seul. Catalogue de 83 groupes, quatre salons ouverts au départ, profils vérifiés sans photo (`/grops/perfil`, validation `/admin/perfils`), lieu tiré de la carte ou du monde (Photon), contacts et messages un à un, blocage, signalement. SQL : `supabase/supabase-grops*.sql`, `supabase-perfils.sql`, `supabase-contactes.sql`, avec leurs fichiers `verificacion-*.sql` (tous au vert).
- Compte d'essai `Bastian_proba` (id `00000000-0000-4000-a000-00000000b0b0`) gardé pour essayer la future page de modération, **à supprimer ensuite**.

### 4.7 Compte, pages légales, accessibilité
- Parcours de compte complet : bouton « Se connectar » puis « Mon compte » dans le bandeau, `/compte`, mot de passe oublié, `/compte/mot-de-pas`, suppression du compte (droit à l'effacement).
- `/istoria` : le récit de Romain et le formulaire de contact en fin de page (envoi par Scaleway).
- `/mencions-legalas`, `/confidencialitat`, `/accessibilitat` (déclaration honnête « conformité non évaluée »), lien d'évitement « Anar al contengut ».

### 4.8 Édition sur place (2026-10-24)
Romain modifie lui-même textes, liens, images et listes, connecté en administrateur : bouton « Editar » en bas à droite, brouillons dans la table `pagina_elements`, « Publicar » les rend publics, « + Apondre », ↑ ↓, « Suprimir ». Un **filet de secours** dans le code (`app/src/lib/data/elements-filet.json`) sert si la base ne répond pas. Lecture dans les pages par `txt()`, `ligam()`, `imatge()`, `lista()` de `app/src/lib/edicion/edicion.svelte.js`, et `use:editar={clau}` sur l'élément. Détail : `revisions/2026-10-24-edicion-sus-plaça.md`. Séance 1 faite ; séances 2 (historique, aperçu téléphone), 3 (apparence) et 4 (mouvement, autres pages) à faire.

### 4.9 Site multilingue (2026-10-25 et 26)
- Fonction `tria({ oc, fr, es, en, ca, ar })` dans `app/src/lib/stores/lang.svelte.js` : repli langue choisie, puis occitan, puis français. Textes modifiables : colonnes du filet.
- Òc / Fr par défaut ; une langue choisie au globe prend la deuxième place du bouton. Anglais britannique ; noms de villes en forme occitane dans toutes les langues ; formes inclusives reformulées sans point médian en espagnol et en catalan.
- Arabe : tout le site traduit, remis au globe le 2026-10-26 (« un bonus, un clin d'œil »), relecture par un ami arabophone de Romain : ses corrections passent par Editar (colonne arabe du filet). La page de relecture `RELECTURE-ARABE.html` citée dans `PILOTATGE.md` ne se trouve plus ni dans le dépôt ni dans `Lo_Ligam_hors-git` (vérifié le 2026-11-02) : demander à Romain s'il l'a encore.

### 4.10 Relecteurs et outils annexes
- Trois relecteurs internes, qui étaient des instances de Claude : **Joan** (web designer et vérificateur, filtre tout visuel avant Romain), **Rodrigo** (sécurité : RLS, authentification, endpoints, CSP, dépendances), **Aran** (traducteur oc, fr, es, en, ca ; ne touche jamais à l'occitan ni au français). Voir §11 pour les reprendre.
- `outils/craft/` : pilotage d'EffectCraft et VectorCraft (animations pour Canva), `canva-mp4.py` (Canva refuse les MP4 d'EffectCraft).
- `outils/liens-hors-git.ps1` : recrée les six jonctions vers les fichiers lourds.

## 5. Ce qui reste à faire, par ordre de priorité

### 5.1 Les points chauds, à traiter en premier
1. **Le tri des noms de la carte du 27-10** (décisions de Romain : 242 communes alignées sur lo Congrès, six pays, communes du Lot-et-Garonne et du Médoc, reliefs et parcs sans forme sûre masqués) est **fusionné et en ligne depuis le 2026-11-02** (commit `3edeab5`, 85 tests et construction au vert). **Reste** : les 150 communes nommées depuis Wikidata sont « à valider » par Romain (surtout les formes vivaro-alpines et provençales) ; 162 communes restent sans nom ; parcs, reliefs, provinces, surnoms, sous-dialectes, Calandretas et mots LISN attendent une source. Détail : `revisions/2026-10-27-tri-validations-occitanes.md`.
2. **Les doutes A1 restants** : A1-13 à A1-20 et A1-27 à A1-36 (`DOBTES-OCCITAN.md` §5). Les poser à Romain **un par un**, dans la conversation, avec deux ou trois options ; appliquer, puis régénérer les fiches (`node scripts/fichas-relectura.mjs`) et relancer le contrôle des explications.
3. **Vérifier l'A1 contre la grammaire de référence**, par lots (unité par unité).
4. **« Lo camin »** : la contre-relecture n'a pas été finie. Non vérifiés : clavier, lecteur d'écran, traductions es/en/ca/ar des nouveaux libellés. Les trois questions à creuser sont dans la fiche `revisions/2026-11-02-parcors-passation.md` §6.
5. **Le déséquilibre** : depuis le 12-10, la moitié des changements a porté sur la carte et un sur dix sur l'apprentissage, alors que le site est d'abord le support des cours. Le rappeler à Romain quand un nouveau chantier de carte s'ouvre.

### 5.2 Ce que Romain peut faire seul, maintenant
(Liste tenue dans `PILOTATGE.md` §1 ; en résumé)
- Tester tout l'A1 sur https://loligam.eu/aprene et relire l'occitan avec « Editar ».
- Essayer l'édition sur place sur téléphone et ordinateur (image, lien, ajout, ordre, suppression).
- Répondre au bloc 4 de `DIRECCION.md` (l'accueil, vue d'ensemble) : c'est le barreau 3 de l'échelle.
- Une question de couleur : le rouge du logo sur les boutons de zoom de la carte et sur « Écouter la voix la plus proche » ?
- Recoller `supabase/supabase-pagina-elements.sql` dans Supabase (ajoute des textes, n'écrase rien) ; relire et publier son récit sur `/istoria`.
- Faire le tri des 149 musiques dans `/admin/musica`.
- Enregistrer sa voix (listes par module dans `Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/modules/relectura/` ; dépôt dans Proton Drive › My files › Lo-Ligam-Audios).
- Les visuels Canva (logo, 4:5, six familles, un export sans textes) : ils débloquent les scènes des unités.
- La pile de validations occitanes de la carte (environ 1 450 noms : fichiers `SIG/**/*-a-validar.csv`).
- Les noms occitans du catalogue des groupes (`supabase/supabase-grops-catalog.sql`).
- Remplir les réglages des factures (`outils/factura/Factures.cmd`).

### 5.3 Ce qui demandera l'IA (Mistral), dans l'ordre suggéré
1. Les points chauds du §5.1.
2. Parcours : la séance du jour tirée du carnet ; l'affichage des niveaux ; les jeux « à coder » remplacés pour l'essai par des QCM (plan de ville à toucher, aiguilles d'horloge, chronomètre 40/30/20 s, jeu de rôle enregistré) ; détailler la trame A2-C1 (10 questions ouvertes en fin de `cursus/trama-A2-C1.md`).
3. Édition sur place : séances 2 à 4.
4. Amassa : le lexique du chat (séance 2), la page de modération (séance 3, **pas** à l'adresse `/admin/grops`, déjà prise par les groupes de designs), la charte des groupes et la page Confidentialité (séance 4) avant d'ouvrir le chat au public ; puis supprimer `Bastian_proba`.
5. Transposition Racine² : pages « A prepaus », FAQ ; les liens du menu qui mènent encore à des pages vides (wiki, articles, forum).
6. Accessibilité : corriger la phrase « Lengas del site » et traduire `/accessibilitat` en es, en, ca ; plus tard sous-titres, contrastes sur toutes les pages.
7. Multilingue : « Débutants » (nom de salon venu de la base, sans traduction), phrase source « OpenStreetMap e occitan » des mentions légales (fautive en oc et en fr), barre de recherche de la carte tronquée à 375 px.
8. Petits restes : côte OpenStreetMap autour de la France (`node SIG/cadena/costa-osm.mjs`, puis `mar.py` et `costa-ref.py`), carrousel de `/mots` flou au chargement, Lomagne (en attente d'une source).

### 5.4 Avant le lancement (barreau 8)
- Rouvrir aux moteurs de recherche (`robots.txt`, `X-Robots-Tag`), puis plan de site et balises de partage **page par page**.
- Mentions légales : une adresse et un téléphone (sans domicile ni domiciliation payante : solution à trouver) ; élargir l'activité de la micro-entreprise sur procedures.inpi.fr avant le premier cours payant.
- Accord écrit du LISN pour les voix de l'Atlas ; droit de réutiliser la carte d'Occitanica ; mention de l'OPLO ; relecture du pays mentonnais (`revisions/2026-10-12-zona-mentonasca.md`).

### 5.5 Échéances datées
- **Décembre 2026** : vérifier la nouvelle mention de TVA sur les factures (CIBS, au 1er janvier 2027).
- **Avant le 2027-08-08** : renouveler la clé Scaleway (chantier 18).
- **Avant septembre 2027** : choisir une plateforme agréée pour la facturation électronique (e-reporting).
- **Avant le 2027-10-25** : renouveler la clé d'API des courriels Scaleway (dans Supabase et dans le conteneur).

### 5.6 Questions ouvertes (ne pas trancher sans Romain)
Limite gratuit / payant du parcours autonome ; combien d'unités A1 pour lancer ; les 14 questions du §9 de `etat-de-l-art-parcours.md` ; casting des personnages et autorisations écrites ; héberger soi-même les photos satellite (environ 6 Go) ; **migration de Supabase vers un hébergeur européen** (reportée sciemment : loi américaine CLOUD Act).

## 6. Carte du dépôt

```
C:\Users\perie\Depots\Lo_Ligam\
├── AGENTS.md                 consignes courtes pour Mistral (lu automatiquement)
├── BRIEF-MISTRAL.md          ce briefing
├── CLAUDE.md                 consignes de Claude (contrôle)
├── PILOTATGE.md              tableau de bord : à ouvrir en début, à mettre à jour en fin
├── cahier-des-charges.md     source de vérité ; §11 = journal daté de toutes les décisions
├── DIRECCION.md              direction du site en 8 blocs (bloc 4 en attente de Romain)
├── charte-graphique.md       couleurs, polices, photos (§3bis « sang e aur »)
├── DOBTES-OCCITAN.md         doutes d'occitan en file (§4 et §5)
├── DOBTES-TRADUCION*.md, DOBTES-ARABE*.md   doutes de traduction
├── corpus-design.md, transposicion-racine2.md, methode-pedagogique.md,
│   construction-pedagogique.md, gamification.md, catalogue-exercicis.md, …  documents de fond
├── revisions/                points d'étape, fiches de passation, analyses datées
├── Modules_cors/lo-ligam-cursus-pour-claude-code/
│   ├── CLAUDE.md             règles du cursus (valent pour toute IA)
│   └── cursus/               cadre méthodologique, carte A1, lexique, règles de rédaction,
│                             visio, culture, trame A2-C1, couverture de la grammaire,
│                             modules/relectura/ (fiches et listes d'enregistrement)
├── app/                      le site (SvelteKit)
│   ├── src/routes/           une route par page (voir §4)
│   ├── src/lib/lesson/       moteur de leçon ; moduls/ = les modules de l'A1
│   ├── src/lib/parcors/      « Lo camin »
│   ├── src/lib/carnet/       répétition espacée (FSRS)
│   ├── src/lib/edicion/      édition sur place
│   ├── src/lib/stores/       langue (lang.svelte.js), thème (ambianca.svelte.js)
│   ├── src/lib/carta/, grops/, apren/, acuelh/, components/, data/ …
│   ├── src/hooks.server.js   redirections, en-têtes, non-indexation
│   ├── svelte.config.js      politique de sécurité du contenu (CSP)
│   ├── scripts/              outils de vérification et de maintenance (§8)
│   ├── static/               images (presque toutes en WebP), données, manifeste
│   ├── Dockerfile            lance npm test puis npm run build
│   └── .env                  clés (hors Git, ne jamais afficher)
├── supabase/                 SQL des tables et règles d'accès + fichiers verificacion-*.sql
├── SIG/                      chaîne de données de la carte, fichiers *-a-validar.csv
├── design-stock/             visuels (rien de plus de 1 Mo)
├── outils/                   factura/, craft/, icones-pwa.py, liens-hors-git.ps1
└── .github/workflows/desplegar.yml   déploiement automatique
```

**Hors du dépôt** :
- `C:\Users\perie\Documents\6_Projectes\Lo_Ligam_hors-git` : fichiers lourds ou personnels (vidéos, photos brutes, .zip, données brutes de la carte, base linguistique dont la grammaire de référence, factures), sauvegardés par Proton Drive. Six dossiers du dépôt y renvoient par des jonctions (`SIG/brut`, `SIG/Limsi`, `Modules_cors/Base_donnees_linguistica`, `design-stock/MP4`, `design-stock/brut`, `design-stock/animations`), recréées par `powershell -ExecutionPolicy Bypass -File outils\liens-hors-git.ps1`.
- `C:\Users\perie\Documents\6_Projectes\_Carta` : fiches communes à tous les projets de Romain (`occitan.md`, `jornal.md`…).

## 7. Technique et pièges connus

- **Commandes** (dans `app/`) : `npm run dev` (site en local), `npm test` (Vitest), `npm run build`, `npm run check`, `npm run verificar:rls`, `npm run verificar:oc`.
- **Le Dockerfile lance `npm test` avant `npm run build`** : un test rouge bloque la mise en ligne. Les deux doivent passer en local avant tout envoi.
- **Vérifier une mise en ligne** : le dépôt est privé et `gh` n'est pas installé, les journaux de GitHub Actions ne se lisent pas d'ici. On cherche une chaîne du dernier changement dans les fichiers JS du site en ligne. Un déploiement qui n'arrive pas se relance en poussant un petit changement dans `app/` (le workflow ne se déclenche que sur `app/**`).
- **CSP stricte** (`app/svelte.config.js`, `script-src 'self'`) : tout script ou ressource extérieure ajouté sans passer par elle sera bloqué par le navigateur. Un bloc `application/ld+json` est une donnée, il n'est pas bloqué.
- **Balises de tête** (titre, description, partage) : page par page, dans chaque route. Une balise dans `+layout.svelte` s'appliquerait à toutes les pages, essais non indexés compris.
- **`sharp`** est un outil de développement côté serveur (scripts d'images), jamais dans le code envoyé au navigateur.
- **Images** : sobriété d'abord ; ne jamais recompresser en écrasant des fichiers sans copie de départ et sans comparer le rendu. Presque toutes les images de `app/static/` sont déjà en WebP : le gain restant est faible.
- **Textes du site** : ne pas écrire de texte en dur à côté du système d'édition. Pour rendre un nouvel élément modifiable : une ligne dans `elements-filet.json`, puis `node scripts/elements-sql.mjs` (produit le SQL que Romain colle), et `use:editar={clau}` dans la page.
- **Supabase** : le SQL se colle par Romain dans le *SQL Editor* de Supabase (lui dire exactement quoi copier et où cliquer). Chaque nouvelle table a ses règles RLS et un fichier `verificacion-*.sql` de contrôles ; relancer `npm run verificar:rls` après tout changement. Compte Supabase gratuit : la protection contre les mots de passe divulgués est réservée à l'offre payante (écartée).
- **Windows et Git Bash** : un argument qui commence par `/` (par exemple `/ensag/…`) devient `C:/Program Files/Git/…` ; préfixer la commande par `MSYS_NO_PATHCONV=1`. Python se lance par `py` (Python 3.14), pas `python` ; GDAL est dans le Python de QGIS.
- **Fins de ligne CRLF** : `PILOTATGE.md`, `cahier-des-charges.md`, `CLAUDE.md` sont en CRLF. Un script qui les modifie doit les gérer ; en résolvant un conflit, vérifier qu'aucun marqueur `<<<<<<<` ne reste avant `git add`.
- **Piège `perl`** : `s|…|…|` avec un `\|` dans le motif produit une alternance vide et insère le remplacement en tête du fichier. Pour les tableaux Markdown, utiliser `s{…}{…}` ou Python, puis contrôler la première ligne.
- **Carte et mémoire du téléphone** : mesurer sur l'iPhone ; seuils de la carte relatifs à l'écran (`fixarEcran`). Les tuiles en occitan viennent de `tile.openstreetmap.bzh/oc/…` (service bénévole : prendre contact avant d'augmenter la charge).
- **Plusieurs ordinateurs** : sur un autre ordinateur, `git clone https://github.com/Guilh69/Lo-Ligam.git C:\Users\<nom>\Depots\Lo_Ligam`, copier `app/.env` depuis `Lo_Ligam_hors-git\app`, lancer le script des jonctions, puis `git config core.hooksPath .githooks` (réglage initial, une seule fois par ordinateur ; ensuite on n'y touche plus).

## 8. Les outils de vérification

Tous dans `app/scripts/`, à lancer depuis `C:\Users\perie\Depots\Lo_Ligam\app`.

| Commande | Rôle |
|---|---|
| `node scripts/verificar-oc.mjs mot1 mot2` | Vérifie l'occitan contre lo Congrès (Basic languedocien, puis formes conjuguées de vèrb'Òc). `--fr mot` part du français. Mots déjà validés par Romain reconnus (exemple : *uèi*). |
| `node scripts/controle-explications.mjs` | « Rien sans explication » : chaque mot occitan d'un module doit figurer dans son encadré « À retenir » ou dans celui d'un module précédent. |
| `node scripts/fichas-relectura.mjs` | Régénère les fiches de relecture et les listes d'enregistrement des modules, tirées du contenu même du site. |
| `node scripts/remarcas.mjs` | Lit les remarques de relecture posées par Romain sur les pages, et les marque traitées après correction. |
| `node scripts/elements-modificar.mjs <clau> --oc "…" --fr "…" --nota "…"` | Modifie un texte de page dans la base (publié, et brouillon de Romain s'il y en a un), après une photographie pour revenir en arrière. **Seulement à la demande de Romain.** |
| `node scripts/elements-filet.mjs` | Rafraîchit le filet de secours depuis la base. |
| `node scripts/elements-sql.mjs` | Produit le SQL des nouveaux éléments modifiables. |
| `npm run verificar:rls` | Contrôle les règles d'accès de la base. |

Clés lues dans `app/.env` (noms seulement) : `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `LOCONGRES_API_KEY` (lo Congrès), `CLAUDE_EDICION_CLAU` (accès limité aux textes des pages, `supabase/supabase-acces-claude.sql` ; le nom vient de l'époque Claude, la clé sert à tout agent local). **Ne jamais afficher une valeur.**

**Lo Congrès** sert à concevoir et vérifier, jamais depuis le site lui-même ; ne jamais stocker ses réponses dans le dépôt. Quand l'API plante sur un mot (erreur de mémoire PHP connue), vérifier sur dicodòc au lieu de remplacer le mot.

## 9. Décisions déjà prises, à ne pas rouvrir sans argument nouveau

Le cahier §11 fait foi ; `PILOTATGE.md` §5 en est l'aide-mémoire. Si une décision paraît mauvaise, le dire à Romain avec un argument que l'historique ne contient pas encore, sans la contourner dans le code.

1. Un seul produit, deux registres (récit expressif, outil sobre), une seule adresse, pas d'appli native (22-08).
2. Graphie classique, nom « Lo Ligam », 15 ans minimum, questionnaire en minimisation RGPD (28-07).
3. Un seul chemin d'apprentissage (le cursus), rythme au choix ; gamification sans classement ; lo Congrès pour concevoir et vérifier seulement (29-08).
4. Prononciation = usage vivant de Romain ; photos « sang e aur », pas d'images IA (29-30-08).
5. SvelteKit, Supabase (UE), Scaleway Paris, déploiement automatique ; administration : RLS seul rempart, SVG interdit, pas de CMS externe (08-09-08).
6. Romain est seul : tout se classe lancement ou évolution (03-09).
7. Trois polices seulement ; Limelight réservée aux gros titres et gros chiffres (30-09, 05-10, 02-11).
8. loligam.eu (15-10).
9. L'accueil s'ouvre sur la carte en étoiles ; « Se parla. S'apren. Amassa. » est le plan du site, dans cet ordre ; le site s'ouvre en occitan ; premier public : le curieux (22-10).
10. Tutoiement partout (22-10). Règle B des couleurs (23-10).
11. **Depuis le 2026-10-25, l'IA rédige les unités du cursus** (revirement du 04-10) : Romain fixe le cap, répond aux questions une à une, relit et valide l'occitan. Exigences : logique d'ensemble visible, un objectif clair par leçon, aucun mot ni notion non expliqués avant, répétition, découverte, variété des jeux.
12. Charpente du cursus : DCL, blocs de 45 h, FSRS, deux cartes par chose (24-10). Cours en visio en quatre temps, un par unité plus le cours 0 (01-11). Les formules de salut de Romain font foi (01-11).
13. *Gramatica de l'occitan estandard* comme référence ; le cursus de l'A1 au C1 doit couvrir tout le livre (02-11).
14. Pas de demande de fusion tant que le site n'est pas public ; pousser sur `master` = mettre en ligne.
15. Pas d'agents multiples ni de longs enchaînements sans l'accord de Romain.
16. Deux IA, une équipe (02-11) ; Mistral agent principal et Claude en contrôle après le 6 novembre, Claude garde la main jusque-là (02-11, ce document).

## 10. Le contrôle par Claude : mode opératoire

### 10.1 Quand demander un contrôle
Avant de pousser sur `master` (donc sur une branche `mistral/<sujet>`) :
- SQL, tables, règles RLS, fonctions de la base ;
- authentification, compte, mots de passe, données personnelles ;
- nouveau point d'entrée serveur (`+server.js`, `+page.server.js`), formulaire, envoi de courriel ;
- en-têtes, CSP, redirections, `hooks.server.js` ;
- dépendances (`package.json`) ;
- suppression de fichiers ou de fonctions, refonte qui touche plus d'une rubrique ;
- toute remise en cause d'une décision du cahier §11.

Pas besoin de Claude pour : un texte, un style, un module de leçon dont les doutes sont tranchés, une page d'essai `/ensag/…`. Dans ces cas, `npm test`, `npm run build` et une capture suffisent avant de pousser.

Pour l'occitan, le contrôle de base est `verificar-oc.mjs` (disponible pour Mistral aussi) ; demander un avis à Claude seulement sur un vrai doute que l'outil ne règle pas. **Romain reste le seul à valider l'occitan.**

### 10.2 La fiche de passation (Mistral l'écrit, Romain la colle à Claude)

```
FICHE DE PASSATION : <sujet> : <date>
1. Ce qui a changé : branche, commits, fichiers.
2. Pourquoi : le problème, la demande de Romain (sa phrase), la ligne du cahier §11.
3. Les choix faits ET les options écartées : au moins une alternative,
   et la raison pour laquelle elle n'a pas été retenue.
4. Comment c'est vérifié : commandes lancées et sortie réelle.
   Ce qui n'a PAS été vérifié.
5. Risques et points où tu es le moins sûr.
6. À challenger : deux ou trois questions précises pour Claude.
7. Périmètre : ce qui ne doit pas être touché.
```

Joindre **le vrai diff** (`git diff master...mistral/<sujet>`) ou pousser la branche pour que Claude la lise lui-même. Jamais un extrait recomposé. Deux exemples réels de fiches : `revisions/2026-11-02-parcors-passation.md`, `revisions/2026-11-02-passacion-gramatica.md`.

### 10.3 Ce que Claude renvoie

```
VERDICT : une ligne (OK / OK avec réserves / à revoir).
CE QUI EST JUSTE : ce qui tient.
PROBLÈMES : classés par gravité (bloquant, important, mineur), chacun avec
  le fichier et la ligne, la raison, la preuve (sortie de commande ou extrait),
  une correction proposée.
CE QUE JE N'AI PAS PU VÉRIFIER : liste honnête.
QUESTION POUR ROMAIN : une seule décision, deux ou trois options.
```

Claude étiquette « vérifié », « déduit » ou « supposé », reste dans le périmètre demandé (le reste en une ligne à la fin) et ne pousse rien sur `master` sans l'accord de Romain.

### 10.4 Le retour
Romain colle la réponse de Claude à Mistral. Mistral la traite point par point : ce qui est juste, il l'applique ; ce qui lui paraît faux, il l'expose à Romain avec la preuve. Puis fusion dans `master`, `npm test`, `npm run build`, envoi, ligne dans `PILOTATGE.md`.

## 11. Ce qui ne passe pas d'une IA à l'autre, et comment compenser

| Ce que Claude avait | Pour Mistral |
|---|---|
| **Sa mémoire de projet** (préférences de Romain apprises en trois mois) | Transposée au §2 de ce document. Les fichiers d'origine sont dans `C:\Users\perie\.claude\projects\C--Users-perie-Depots-Lo-Ligam\memory\` si un détail manque. |
| **Ses conversations passées** | Pas transmissibles. Tout ce qui compte est dans le cahier §11, `PILOTATGE.md` et `revisions/`. |
| **Les relecteurs Joan, Rodrigo, Aran** (et Clara, urbanisme, pour un autre projet) | Leurs consignes complètes sont dans `C:\Users\perie\.claude\agents\joan.md`, `rodrigo.md`, `aran.md`. On peut les recréer comme agents Mistral (Vibe ou Le Chat) à partir de ces fichiers. En attendant : relire soi-même avec leurs grilles. Joan : la vraie page, charte et §11, occitan vérifié avant de montrer. Rodrigo : penser en attaquant, classer par gravité, montrer la preuve. Aran : traduire l'intention, pas la forme ; ne jamais toucher à l'occitan ni au français. |
| **L'accès direct à Supabase** (Claude pouvait exécuter du SQL, avec le feu vert de Romain) | Par défaut, Romain colle le SQL lui-même dans Supabase. Un accès direct pour Mistral serait à décider avec Romain, plus tard, avec contrôle de Claude. |
| **Le crochet Git** `.claude/hooks/garde-fou-git.mjs` et les autorisations de `.claude/settings.json` | Ne s'appliquent qu'à Claude. Mistral applique les mêmes règles de lui-même (`AGENTS.md`). Le crochet `.githooks/pre-commit` (1 Mo dans `design-stock/`) vaut pour tout le monde. |
| **La méthode de rédaction des modules** (compétence « occitan-module » de Claude) | Écrite dans le dépôt : `cursus/00-cadre-methodologique.md`, `cursus/regles-redaccion-A1.md`, `cursus/lexic-A1.md` et le `CLAUDE.md` du dossier du cursus. |
| **L'aperçu du site dans l'application Claude** (`.claude/launch.json`) | `cd app` puis `npm run dev`, et ouvrir l'adresse affichée dans un navigateur. |

## 12. Leçons du premier passage (calibrage)

Le 2026-11-02, Mistral avait fait un premier passage en regard extérieur, sans le contexte de ce document. **Ce qui était juste** : les alertes de sécurité sur les dépendances étaient réelles (`npm audit` les a confirmées, correctif en ligne le jour même) ; le mode « simulation » avant tout traitement d'images est une bonne pratique ; penser au référencement est pertinent pour le lancement. **Ce qui venait du manque de contexte**, et que ce document corrige : le domaine (`loligam.eu`, pas `lo-ligam.fr`), la non-indexation voulue avant le lancement, le vouvoiement et les accroches inventées, l'occitan non vérifié, un parcours « jusqu'au B1 » annoncé alors que seul l'A1 est rédigé, `sharp` côté navigateur, des balises globales dans `+layout.svelte`. **Une règle de preuve** : une branche et des commits cités n'existaient pas sur le dépôt, d'où l'étiquetage « vérifié / non vérifié » demandé partout. Claude, de son côté, avait affirmé à tort qu'une balise de données structurées serait bloquée par la CSP ; il l'a corrigé.

## 13. Mode d'emploi pour Romain

**Ce que tu peux faire seul, maintenant**
1. Ouvre Mistral Vibe (l'outil de Mistral qui travaille dans un dossier, comme Claude Code) dans le dossier `C:\Users\perie\Depots\Lo_Ligam`. Quand il demande si le dossier est de confiance, réponds oui : c'est ce qui lui fait lire `AGENTS.md`.
2. Première phrase à lui dire : « Lis BRIEF-MISTRAL.md en entier, puis PILOTATGE.md, et dis-moi en cinq lignes où on en est et ce que tu proposes de faire en premier. »
3. Pour un contrôle par Claude : demande à Mistral « fais la fiche de passation pour Claude ». Ouvre une conversation Claude dans le même dossier, colle la fiche et écris « Claude, contrôle cette fiche ». Rapporte la réponse à Mistral.
4. Si tu utilises Le Chat (sans accès au dossier) : colle d'abord `AGENTS.md`, puis la partie de ce document qui concerne ta question.

**Ce qui demandera de l'aide plus tard**
- Installer Mistral Vibe s'il ne l'est pas encore (demander à Mistral dans Le Chat de te guider pas à pas, ou à Claude).
- Recréer Joan, Rodrigo et Aran comme agents Mistral.
- Donner à Mistral les règles communes à tous tes projets : copier l'esprit de `C:\Users\perie\.claude\CLAUDE.md` (ta carte des projets) dans le fichier d'instructions global de Mistral Vibe (`C:\Users\perie\.vibe\AGENTS.md`).
- Sur l'autre ordinateur : cloner le dépôt et lancer le script des jonctions (§7).
