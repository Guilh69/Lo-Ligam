# L'apprentissage dans Lo Ligam : état des lieux au 2026-10-22

Relecture de la nuit du 21 au 22 octobre 2026 : cursus, moteur de leçon, scène, carnet, cahier §4 et §11, `PILOTATGE.md`, `DIRECCION.md`, révisions du 15-10. Aucun contenu pédagogique n'est produit ici (règle du 04-10, précisée le 15-10 : « charpente et chair »).

## 1. Ce qui existe et marche

| Pièce | État | Preuve |
|---|---|---|
| Cursus A1 → C2 | cadré : A1 = « 10 unités + accueil · 41 modules » | `cursus/01-A1.md` l.1 ; `cursus/CLAUDE.md` |
| Unité 1 rédigée (1.1 à 1.4) | 4 fichiers markdown, « lexique et conjugaisons passés par les API lo Congrès le 29/08/2026 » | `cursus/CLAUDE.md`, rubrique Fichiers ; commits 560270e, cd508e3 |
| Moteur de leçon | 4 modules enregistrés (`1-1` à `1-4`), 548 + 485 + 431 + 257 lignes de données ; 8 types de blocs (note, reveal, qcm, checklist, table, order, dialogue, chunks) | `app/src/lib/lesson/moduls/index.js` l.8-16 ; `wc -l` ; `grep type:` |
| Progression | sauvée dans Supabase (`lesson_progress`, bitmask) avec repli `localStorage` | `aprene/modul/[modulId]/+page.svelte` l.38-39, l.60-113 |
| Vérification lexicale | script `verificar:oc` (API lo Congrès), jamais appelé depuis le site | `app/package.json` l.14 ; cahier §11 2026-08-29 ; commit 63d3634 |
| Leçon d'essai `/aprene/essai` | « Contenu validé par Romain » ; fogassa qui vole vers le compteur | `aprene/essai/+page.svelte` l.11, l.86-90 |
| Audio | une scène en ligne : `lo-matin-sul-mercat.m4a` (284 Ko, 29-08) | `app/static/audio/moduls/1-1/` |

Le socle est réel : « une unité 1 complète et jouable (4 modules, lexique vérifié par les API du Congrès) » (`PILOTATGE.md` l.19-21), chaque module renvoyant à sa « source de vérité pédagogique » dans le cursus (`modul-1-1.js` l.1-3).

**Mais le moteur est orphelin.** Aucun lien du site ne mène à `/aprene/modul/1-1` (grep sur `app/src` et `app/static` : seule mention, le commentaire d'`index.js` l.2). La page `/aprene` affiche trois chapitres fictifs (« Las basas », « A la botiga », « A la bolangariá ») étrangers au cursus, et son seul module ouvert pointe vers `/aprene/essai` (`aprene/+page.svelte` l.14-38). `DIRECCION.md` l.57 : la page « ne dit pas ce qu'est le parcours ni d'où l'on part ». La refonte « Camin » est « à faire » depuis le 18-09 (`PILOTATGE.md`, chantier 6).

## 2. Ce qui bloque sur Romain, et depuis quand

| Blocage | Depuis | Preuve | Action notée |
|---|---|---|---|
| **Module 0** (remplacera l'essai libre, décision du 29-08) | 29-08 : « premier de la file » ; 02-09 : titre de travail posé, « L'occitan, la lenga d'òc, le patois ? Kezako ? » ; « bloqué » au pilotage depuis le 18-09 | `construction-pedagogique.md` §9 ; commit b90afe1 ; `PILOTATGE.md` chantier 3 | « Romain écrit son brouillon d'intro d'une page » |
| **Audio de l'unité 1** | 29-08 : un seul fichier déposé ; la liste attend 2 scènes, 10 expressions, 4 mots de glossaire, 1 voix native ; les dossiers 1-2 à 1-4 ne contiennent que `LISTA.txt` | `app/static/audio/moduls/*/` ; `modul-1-1.js` l.447 « voix native : à venir » | « Enregistrer UNE scène (le soir du 1.1) » (chantier 4) |
| **Validation occitane** | 25-08 : « ⚠️ Occitan à valider par Romain » en tête de chaque module ; questions de graphie non tranchées (*Adieu-siatz* vs *adieussiatz*, *Bon ser* ⚠️) | `modul-1-1.js` l.4 ; `1.1-adieu-cossi-vas.md` l.104, l.199 | « Une session dicodòc » (chantier 5) |
| **Carnet de conception** (étapes 1 à 8) | 04-10 : huit gabarits créés, un seul commit (4f3b39c) ; **aucune page écrite**, « Date de lecture : » vide partout (114 lignes au total) | `carnet-concepcion/etapa-*.md` ; `git log -- carnet-concepcion` | « écrire la page de l'étape 1 » (chantier 12, « prioritaire sur 3, 5 et 6 ») |

Les quatre blocages datent de la même semaine (fin août) et ont traversé octobre intacts : « la carte a pris tout octobre » (`revisions/2026-10-15-metode-parcours.md` l.27). Le pilotage l'avait écrit : « l'essentiel de ce qui reste est exactement ce que Romain veut garder pour lui : rédiger le module 0 depuis ses livres, enregistrer sa voix, choisir ses photos » (`PILOTATGE.md` l.30-33) ; `DIRECCION.md` l.234-235 redit la même liste pour le lancement.

La décision 14 pèse sur tout cela. Romain, le 04-10 : « ça va vers l'atrophie cognitive en réalisant tout par IA, je réfléchis plus » (cahier §11). Diagnostic du 15-10 : « la formule “lire seul, puis écrire une page” ne s'est pas enclenchée. Ta manière de décider (devant deux ou trois options concrètes) marche mieux » (`metode-parcours.md` l.28-30).

## 3. La scène de l'unité : « Lumière avec pastilles »

**Fait.** Décision du 15-10 : « La scène de l'unité devient le fil rouge de chaque unité » ; raison notée : « La scène relie ses visuels Instagram, la carte et le jeu sans ajouter de récompense » (cahier §11). Quatre passages d'essai en cinq jours (caches et flèches ; voiles de couleur ; aplat, sépia, brume ; planches avant/après), puis choix de Romain le 20-10 : « Lumière avec pastilles », « ✅ validé par Romain après essai sur téléphone » (`parcours-univers-scenes.md` §9, point 2 ; commits 1cbc680, e0cb9c2). L'essai `/ensag/scena` tient trois visuels dans une constante en dur : maison (4 objets), animaux (6), corps (6), images `*-net.webp` exportées sans textes, coordonnées 860 × 860 (`ensag/scena/+page.svelte` l.1-16, l.206-213).

**Reste.** La fabrication : « une page d'administration où il dépose son visuel exporté sans textes, trace les ovales au doigt ou à la souris… scènes en base Supabase comme les fiches de /mots » (cahier §11, 20-10) ; construction en quatre points (schéma SQL, `Scena.svelte`, `/admin/scenas`, `verificar-scenas.mjs`) au §11 du document du 15-10. **Ordre décidé par Romain le 20-10 : d'abord reprendre ses visuels dans Canva**, ensuite seulement l'admin (`PILOTATGE.md` chantier 16). Côté Romain : les prononciations des animaux et du corps, et *fenèstra* à trancher (« c'est possible que ce soit une coquille », 15-10).

**Lien avec Instagram.** L'inventaire du 15-10 compte « 212 visuels en 35 thèmes », « images Canva aplaties » avec textes incrustés, et rapproche déjà les thèmes des unités A1 (Familha → unité 3, Ostal → unité 7, Metèo et Sasons → unité 6…) (`parcours-univers-scenes.md` §3 bis). Parmi les six familles de publications du 12-10, la famille « vocabulaire » nourrit les scènes, avec « deux exports par visuel : celui d'Instagram (avec étiquettes) et celui du site (sans textes ni flèches) » (§9). La scène est la première mécanique qui fait des publications Instagram la matière même du cours, et non une vitrine à côté.

## 4. `/mots` et le parcours : séparés aujourd'hui

- `/mots` montre les fiches Instagram : 204 fiches passées en base le 03-08 (cahier §11), « REGROUPÉES PAR THÈME, comme un profil Instagram » (`mots/+page.svelte` l.10-11 ; commit 48de39a).
- **Aucun lien** entre `/aprene` et `/mots` dans le code (grep `href="/mots|href="/aprene"`). La seule passerelle est textuelle et « bientôt » : « poste ton audio en commentaire du post Lo Ligam de la semaine » (`modul-1-1.js` l.465 ; `modul-1-2.js` l.408).
- Dans le plan du site, `/mots` est rangé sous « Amassa » et `/aprene` sous « S'apren » (`planSite.js` l.21-22, l.31-34). `DIRECCION.md` l.55 relève la contradiction : « rangée sous “Se viu” alors que c'est de l'apprentissage » ; la question 3 du bloc 3 reste sans réponse datée.
- Le pont existe sur le papier : mêmes visuels, même base (cahier 20-10), rapprochement thèmes ↔ unités du §3 bis.

## 5. Le jeu : décidé le 29-08, presque rien dans le code

| Décidé (cahier §11, 2026-08-29 ; `gamification.md` §1, §5 bis) | Dans le code |
|---|---|
| Fogassas = récolte immédiate | oui, dans `/aprene/essai` seulement (l.86-90, l.506-523) |
| Arbre del Ligam (« ne fane jamais ») | rien (grep `app/src`) |
| Còla pyrénéenne, un personnage par unité | rien ; seuls les prénoms des dialogues (`modul-1-1.js` l.19) |
| Fuòc de l'ostal, « jamais éteint », zéro classement | rien |
| Crostadas, badges | reportés (`gamification.md` §6) |
| « Vertadièr o inventat ? » (vrai mot / mot inventé) | **écarté définitivement**, « le reprendre serait du plagiat » (`catalogue-exercicis.md` §4) ; rappelé le 15-10 |

Le catalogue compte un socle « déjà dans le moteur » et six mécaniques validées, plus « Los parlars sus la carta » pour le module 0 (`catalogue-exercicis.md` §2-3, l.47-53) : aucune des six n'est codée. Règle d'économie du 15-10 : « Attention à ne pas empiler les récompenses » (`parcours-univers-scenes.md` §0, point 3) ; la scène « devient un nouveau type de bloc » du moteur (§8).

## 6. Lecture transversale : quand ça marche, quand ça bloque

**Ça marche** quand Claude met des options à l'écran et que Romain tranche en séance : étapes A à D closes en un jour le 29-08 (cahier §11), scène choisie sur planches le 20-10, `DIRECCION.md` né le 21-10 d'une demande précise (« un document que je puisse remplir, qui me pose les questions où tu as besoin de réponses »). Exigences constantes : « méthodologie irréprochable », « rien ne doit être laissé au hasard » (cahier §11, 2026-08-29 et 2026-08-22).

**Ça bloque** dès qu'une tâche demande à Romain de produire seul, hors séance, sans question posée : module 0, audio, validation, carnet. Quatre blocages, un même profil, deux mois.

## 7. Propositions (charpente, pas de chair)

1. **Relier le moteur au site** : `/aprene` liste l'unité 1 réelle et mène à `/aprene/modul/1-1` (chantier 6 « Camin », cadre dans `transposicion-racine2.md`). Une séance, Claude seul.
2. **Convertir les blocages en séances guidées** : enregistrer la scène du soir pendant une séance, au téléphone, d'après `LISTA.txt` ; trancher en séance les deux questions de graphie du 1.1 (l.104, l.199).
3. **Module 0 à la voix** : partir du titre posé le 02-09 ; Claude pose les questions au format de `DIRECCION.md`, Romain dicte, Claude met en forme et vérifie. Romain écrit la chair, règle du 04-10 tenue.
4. **Carnet** : remplacer « lire seul puis écrire » par les mêmes questions posées en séance, une étape par séance, réponses dictées dans `etapa-N.md`.
5. **`/mots` dans S'apren** et pont vers la scène : trancher la question 3 du bloc 3 ; les fiches Instagram deviennent la réserve de scènes (§3 bis à confirmer par Romain).
6. **Préparer l'admin des scènes sans contredire l'ordre du 20-10** : schéma SQL et `Scena.svelte` tirés de l'essai existant, pour que la construction tienne en une séance dès que les visuels Canva seront repris.
