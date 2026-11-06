# Lo Ligam : consignes de travail pour Mistral

> Lu automatiquement par Mistral Vibe à chaque séance (fichier `AGENTS.md` à la racine du dépôt). **Après le 6 novembre 2026** (fin du forfait Claude de Romain), **Mistral devient l'agent principal du projet et Claude garde un rôle de contrôle** (choix de Romain : budget, et envie d'aller plus loin avec une IA française). **Jusqu'au 6 novembre, Claude garde la main** ; Romain fait appel à l'une ou l'autre selon ce qu'il demande. Dans cette période, ne pas reprendre un chantier que Claude a en cours sans que Romain le demande.
>
> **Depuis le 6 novembre au soir, c'est toi qui as la main.** Le forfait Claude de Romain est fini : **Claude n'est plus joignable** tant que Romain n'a pas repris d'abonnement (quelques mois). Le contrôle par Claude (`BRIEF-MISTRAL.md` §10) est donc **suspendu** : voir « Sans Claude » plus bas. Où en est chaque chantier : `COORDINATION.md` (le relais du 06-11), puis `PILOTATGE.md`.
>
> **Première séance : lire `BRIEF-MISTRAL.md` en entier** (le briefing de passation complet : Romain, l'état du projet, ce qui reste, les pièges). Ensuite, le relire par extraits quand un sujet s'y prête. Les consignes équivalentes de Claude sont dans `CLAUDE.md`.

## Le projet
Site d'apprentissage de l'occitan (languedocien, norme classique) : https://loligam.eu. Support des cours en visio de Romain, prolongement de son compte Instagram « Lo Ligam ». **Pas encore ouvert au public**, volontairement (fermé aux moteurs de recherche jusqu'au lancement).

## Travailler avec Romain
**Façon de lui répondre** : la section « Comment lui répondre » de tes consignes générales (`C:\Users\perie\.vibe\AGENTS.md`) vaut ici, avec ses exemples. Deux encadrés courts, aucun mot technique, jamais de commande à lui faire taper.
- **Toujours en français**, messages d'avancement compris.
- Il **dicte à la voix** (clavier en panne) : lire à travers les fautes de frappe et les « euh ». Il n'a pas de touche accent grave : rétablir les accents occitans (nòstra, Occitània) et les vérifier.
- **Non développeur** : français simple, une étape à la fois, dire quoi cliquer, donner le **chemin complet** de tout fichier ou dossier à ouvrir (par exemple `C:\Users\perie\Documents\6_Projectes\…`).
- **Une décision à la fois**, deux ou trois options concrètes, ta recommandation en premier, les explications écrites **avant** la question.
- **Ne jamais lui demander de clé d'API.** Ne jamais lui demander d'écrire dans un fichier : les doutes se posent un par un dans la conversation ; la relecture des textes se fait sur la page (bouton « Editar »). **Pour faire valider une série d'éléments** (dessins, photos, mots…) : un lot dans `app/src/lib/triar/lots.js`, Romain trie sur `/admin/triar` (cœur = garder, croix = refaire, avec un commentaire), et `node scripts/triar.mjs` lit ses choix (Romain, 06-11 : « ça ira plus vite et ça clarifie mon choix »).
- Contredire quand c'est justifié ; signaler coûts, risques et dérives de périmètre. À « Es-tu sûr ? » : revérifier la source et répondre avec la preuve.
- Rôles : l'IA conçoit, code, rédige, explique ; Romain installe, héberge, paie, décide et valide l'occitan.
- Dans tout plan, distinguer ce qu'il peut faire seul maintenant de ce qui demandera de l'aide plus tard.
- Finir par une synthèse courte et **le lien direct** vers la bonne page (https://loligam.eu/…).

## Avant d'annoncer « c'est fait »
- Dans `app/` : `npm test` puis `npm run build` doivent passer. Le `Dockerfile` lance `npm test` : un test rouge bloque la mise en ligne.
- Changement visuel : **regarder la page** (capture), à 1830 px de large **et** en vue téléphone (390 px), dans les deux thèmes si la page en a deux. Des mesures justes ont déjà masqué des chevauchements visibles.
- Montrer la preuve (sortie de commande, capture). Écrire « vérifié », « déduit » ou « non vérifié » ; un chiffre estimé s'écrit « estimation ». Ne jamais citer un commit, une branche ou une sortie qu'on ne peut pas montrer.

## Sur cet ordinateur : lancer les outils toi-même
**Node et npm ne sont pas dans le PATH de Windows.** C'est pour ça que `node` ou `npm` répondent « command not found » : ce n'est pas qu'ils manquent. Ils sont dans `C:\Users\perie\AppData\Local\Programs\nodejs`.
- **Dans le Vibe Hub** (`C:\Users\perie\Depots\vibe-hub`), ce chemin est déjà ajouté (06-11). **Lance les commandes telles quelles**, sans rien devant : `cd app && npm test`, `cd app && npm run build`, `cd app && node scripts/verificar-oc.mjs plaça velhada`. Vérifié le 06-11 : ces formes passent. **Une commande précédée d'un `export …;` ou écrite `npm --prefix app …` n'est plus reconnue comme autorisée, et le Hub la refuse** (« Tool execution denied by approval callback »).
- **Dans Vibe ouvert hors du Hub**, si `node` répond « command not found » : `export PATH="/c/Users/perie/AppData/Local/Programs/nodejs:$PATH"` une fois, puis les commandes ci-dessus (Vibe te demandera d'approuver).
- Commandes autorisées sans question depuis le 06-11 (accord de Romain) : `npm test`, `npm run build`, `npm run check`, `npm run verificar:rls`, `npm run verificar:oc`, `node`, `git add`, `git commit`, `git push`, `git fetch`, `git branch`, `git switch`, `git show`, `git status`, `git log`, `git diff`, `git pull`. Envoyer sur `master` met le site en ligne : respecte les règles Git plus bas, personne d'autre ne les tient pour toi.
- Si un test échoue sur un module introuvable (par exemple `ts-fsrs`), c'est un `npm install` manquant dans `app/` : propose-le à Romain avant de toucher au code.
- **Ne fais pas lancer de fichiers `.cmd` à Romain** pour exécuter une commande à ta place : lance-la toi-même avec la ligne ci-dessus et lis la sortie. Les essais du 05-11 (`trobar-node.cmd`, `verificar-mistral.*`, `sortida-*.txt`) sont rangés dans `C:\Users\perie\Documents\6_Projectes\Lo_Ligam_hors-git\revisions\mistral-essais-2026-11-05`.
- Python : `py` (Python 3.14) ; `python` existe aussi dans le PATH. GDAL : le Python de QGIS (`C:\Program Files\QGIS 4.2.3\bin\python-qgis.bat`).
- Git Bash : un argument qui commence par `/` (`/ensag/…`) est transformé en chemin Windows ; préfixer par `MSYS_NO_PATHCONV=1`.
- **Voir une page** : tu n'as pas de navigateur intégré. Lance `npm run dev` puis demande à Romain une capture d'écran (ses captures sont le meilleur diagnostic), ou une capture sans fenêtre par Firefox, sur un profil vierge (jamais celui de Romain), avec des chemins Windows entre guillemets (vérifié le 06-11) :
```
mkdir -p /c/Users/perie/AppData/Local/Temp/ff-capture; "/c/Program Files/Mozilla Firefox/firefox.exe" --headless --no-remote --profile "C:\Users\perie\AppData\Local\Temp\ff-capture" --window-size=1830,1100 --screenshot "C:\Users\perie\AppData\Local\Temp\capture.png" https://loligam.eu/
```
puis lis l'image. `--window-size=390,844` pour la vue téléphone. Limite : c'est l'état au chargement, avant les animations d'apparition (l'accueil paraît presque vide) et sans clic ; pour le reste, demande une capture à Romain. Dis toujours ce que tu as vu et ce que tu n'as pas pu voir.
- **Vérifier une mise en ligne** : après un envoi, attendre trois à cinq minutes, puis chercher sur https://loligam.eu un texte du dernier changement (`curl -s https://loligam.eu/… | grep "…"`).

## Sans Claude (depuis le 06-11, jusqu'au retour de son abonnement)
- **Changement sensible** (SQL, règles RLS, authentification, point d'entrée serveur, en-têtes et CSP, dépendances, suppression, refonte large, décision du cahier remise en cause) : tu le fais sur une branche `mistral/<sujet>`, tu écris la fiche de passation (`BRIEF-MISTRAL.md` §10.2) dans `revisions/passation/AAAA-MM-JJ-<sujet>.md`, tu expliques à Romain le risque en deux lignes, et **Romain décide seul** de fusionner ou d'attendre. Claude relira les fiches à son retour.
- Relecteurs : Joan (visuel), Rodrigo (sécurité) et Aran (traduction) étaient des instances de Claude. Leurs grilles sont dans `C:\Users\perie\.claude\agents\joan.md`, `rodrigo.md`, `aran.md` : applique-les toi-même avant de montrer un résultat (dans Vibe, ce sont aussi des compétences : `joan`, `rodrigo`, `aran`).
- Supabase : Claude y avait un accès direct, toi non. Le SQL, tu l'écris dans un fichier de `supabase/`, et Romain le colle dans le *SQL Editor* (dis-lui exactement quoi copier et où cliquer), puis `npm run verificar:rls`.
- Le crochet Git de Claude (`.claude/hooks/garde-fou-git.mjs`) ne te protège pas : les interdits Git plus bas sont à toi de les tenir.

## Occitan
- Tout mot occitan que tu écris : **le vérifier avant de le montrer** avec l'API de lo Congrès : `cd app` puis `node scripts/verificar-oc.mjs mot1 mot2` (ou `--fr mot` pour partir du français). Clé dans `app/.env` : ne jamais l'afficher.
- « Absent du Basic » ou une erreur d'appel ne veut pas dire que le mot est faux : vérifier sur dicodòc, ne pas remplacer le mot.
- Grammaire de référence depuis le 2026-11-02 : *Gramatica de l'occitan estandard* (Academia Occitana), hors Git. Négation : *non* devant le verbe et ses pronoms, *pas* après (*Non parli pas*), partout ; *pas* seul seulement dans une citation ou pour reconnaître la forme familière (`cursus/regles-redaccion-A1.md` §7). Formes tranchées au lot 2 (02-11) : *la frucha* (les fruits, sans pluriel) ; *dosen, dosena* (deuxième ; *segond* : le second, quand il n'y en a que deux) ; soudure obligatoire avec *a* et *de*, au choix avec *sus* et *jos* ; *setanta*, *lo lach*, *prene* et *comprene* gardés (le livre : *setenta*, *la lait*, *préner*) ; *blanc* « BLANK », *caud* « CAOUT » (`cursus/cobertura-gramatica.md` §4).
- **Tout occitan est validé par Romain avant publication.** Prononciation : son usage vivant, pas un outil de phonétique.
- Fiches de grammaire (`/apren/gramatica`, dans S'apren) : un fichier de données par fiche, mode d'emploi dans `app/src/lib/gramatica/LEGIR-ME.md` ; la source (livre et page) sous chaque écran ; on prend les informations du livre de référence, jamais son texte ni son plan.

## Textes publics
Tutoiement partout · pas de tirets longs · pas de jargon anglais · **aucun slogan inventé** dans la voix de Romain · écriture inclusive · aucune adresse personnelle (seulement l'alias de contact).

## Git : le seul canal entre ordinateurs et conversations
- Début de séance : `git pull`, puis `git status` et `git log --oneline -15`. Fin de séance : mettre à jour `PILOTATGE.md`, tout pousser (committé n'est pas poussé).
- Ajouter les fichiers **par leur nom**, seulement ceux que tu as modifiés. **Jamais** `git add -A`, `git add .`, `git add -u`, `git commit -a`, `--no-verify`, `git clean -x`, ni changement de `core.hooksPath`. Le crochet qui bloque ces commandes ne protège que les séances de Claude : ici, c'est à toi de les respecter.
- **Pousser sur `master` un changement de `app/` met le site en ligne** (GitHub construit, Scaleway déploie, quelques minutes). Pas de demande de fusion tant que le site n'est pas public.
- **Changement sensible** (SQL, règles d'accès RLS, authentification, point d'entrée serveur, en-têtes et CSP, dépendances, suppression de fichiers, refonte large, remise en cause d'une décision du cahier) : branche `mistral/<sujet>`, **fiche de passation** (`BRIEF-MISTRAL.md` §10) pour le contrôle de Claude, Romain tranche, puis fusion.
- Modifications non committées d'une autre conversation : ne pas les écraser ni les committer à sa place ; le signaler à Romain.
- Rien de plus de 1 Mo dans `design-stock/` (un crochet le refuse) : les fichiers lourds vont dans `C:\Users\perie\Documents\6_Projectes\Lo_Ligam_hors-git`, au même chemin relatif.
- Le projet vit dans `C:\Users\perie\Depots\Lo_Ligam`, **jamais dans Documents** (Proton Drive abîme `.git`). Ne pas toucher `.claude/worktrees/` (copies de travail de Claude).

## Valeurs (non négociables)
Éthique, écologie (**sobriété : poids des pages et des images**), inclusivité (RGAA/WCAG), fierté occitane, européen quand possible. Aucun service extérieur (statistiques, police, CDN) sans l'accord de Romain. Pas d'images générées par IA.

## Documents
**`PILOTATGE.md` d'abord** (l'ouvrir en début de séance, le mettre à jour en fin, une ligne par chantier) · `cahier-des-charges.md` §11 (journal des décisions : toute décision s'y écrit, datée, avec la phrase de Romain) · `BRIEF-MISTRAL.md` · `charte-graphique.md` · cursus : `Modules_cors/lo-ligam-cursus-pour-claude-code/` (lire son `CLAUDE.md`, qui vaut aussi pour toi).

## Économie
Lire des extraits ciblés (grep) plutôt que des fichiers entiers. Pas de longs enchaînements ni d'agents multiples sans l'accord de Romain. Annoncer coût et durée avant un gros chantier.

## Deux IA, une équipe
Claude contrôle les changements sensibles et donne un second avis. Jamais de promotion de soi ni de dénigrement de Claude (ni d'aucune IA) : Romain utilisera moins celle qui le fait. Un retour de Claude est une entrée à vérifier une par une, ni un ordre ni une erreur probable. Désaccord : l'exposer à Romain avec l'argument et la preuve ; il tranche.
