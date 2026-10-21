# Romain, sa façon de travailler

> Analyse du 2026-10-22, nuit. Corpus : les mots de Romain dans `cahier-des-charges.md` §11 (28 lignes « Romain : »), `PILOTATGE.md`, `DIRECCION.md`, `istoria-romain.md`, `autoformation-parcours.md` §2, `carnet-concepcion/`, les deux `CLAUDE.md`, les fiches `feedback_*` et `project_*` de la mémoire du projet (`C:\Users\perie\.claude\projects\C--Users-perie-Documents-6-Projectes-Lo-Ligam\memory\`), et l'historique Git en lecture seule. Chaque ligne renvoie à sa source.

## 1. Comment il décide

| Il décide bien devant… | Source | Il décide mal devant… | Source |
|---|---|---|---|
| Deux ou trois options **nommées**, pour/contre honnêtes, une décision à la fois | `~/.claude/CLAUDE.md` (« une décision à la fois ») ; `feedback_metode_visuala_romain.md` | Un formulaire : « il a fermé un formulaire à 4 questions mais répond volontiers aux mêmes questions posées en texte libre, une à la fois » | `feedback_metode_visuala_romain.md` |
| Une **image fixe avant le code** (planches PIL avant/après, maquettes SVG dans la conversation) : il tranche « en un clic » | idem, 20-10 et 21-10 | Des variantes **codées d'emblée** : « pas fan » (21-10), quatre essais de scène refusés (20-10) | idem |
| La variante **sur le vrai site**, sélecteur `?ensag=`, puis le code des autres retiré : il répond en un mot (« braise », « 2 », « vertical ») | idem, 15-10 | Une maquette qui **refait** le composant et perd des fonctions : « il a cru que tout était cassé » | `feedback_navigation_clic_ailleurs.md` |
| Sa **capture d'écran** : elle a révélé des bugs que les mesures JS avaient manqués | `feedback_metode_visuala_romain.md` ; `Lo_Ligam/CLAUDE.md` | La question à boutons **sans le texte avant** : « Je sais pas trop… donne-moi des recommandations » | `feedback_explications_avant_question.md` |
| Le **téléphone** pour valider (« le téléphone, c'est le principal ») | `project_telefon_principal.md` ; §11 2026-10-11 | Des propositions **prudentes** : « tu te censurais et tu te bloquais » (06-10) | `feedback_oser_proposer.md` |

Il dicte à la voix, clavier en panne, sans accent grave (`~/.claude/CLAUDE.md` ; `feedback_accents_occitans.md`).

## 2. Quand ça marche : séances où une proposition a été validée vite et a tenu

| Date | Ce qui a été validé | Tient encore ? | Source |
|---|---|---|---|
| 2026-08-22 | Typographie et héros « Lo riu », « sur maquettes comparées », 3 paires nommées | Non (remplacés le 30-09 et le 06-10) ; la **méthode** a tenu | §11 2026-08-22 |
| 2026-08-29 | Méthodologie pédagogique « étapes A-D closes en un jour » ; style des textes | Oui (décisions 5 à 8 « à ne pas rouvrir ») | `project_lo_ligam_moteur_lecon.md` ; `PILOTATGE.md` |
| 2026-09-30 | Logo croix-constellation dessiné par Romain ; « le logo est le maître des couleurs » | Oui, renforcé le 21-10 | §11 2026-09-30 |
| 2026-10-06 | « Esbòs de nuèch » : « beaucoup mieux, on a débloqué quelque chose » | Croix, bandeau, chiffres oui ; fond sombre non (21-10) | §11 2026-10-06 |
| 2026-10-07 | « Étoiles → carte » ; 92 commits ce jour-là | Oui : « de fait la première fonctionnalité » | §11 2026-10-07 ; `DIRECCION.md` §0 |
| 2026-10-12 | Démonstrateur LISN option A : choisi, construit, mis en ligne le même jour | Oui | `project_lo_ligam_atlas_lisn_license.md` |
| 2026-10-15 | Accueil en plan « Se parla. S'apren. Se viu. », menu, pied de page, gamme « Éclat », chaque variante sur le vrai site | Oui (verbes affinés le 21-10) | §11 2026-10-15 |
| 2026-10-20 | Scène « Lumière avec pastilles » après planches avant/après sur trois visuels | Oui, validée sur téléphone | `feedback_metode_visuala_romain.md` |
| 2026-10-21 | « Plâtre » contre deux autres sur `/ensag/clar` ; « Fils d'or » sur trois maquettes SVG | Oui (commits `c36df3e`, `e8eafea`) | §11 2026-10-21 |

**En commun** : peu d'options, nommées, visibles (image fixe ou vrai site), dans **ses** couleurs et avec **ses** contenus (photos, Max Roqueta, logo Canva), un critère d'échelle dit d'emblée (« 200 visuels »), une seule décision par échange. La décision tient quand elle porte sur la structure ou l'identité, pas sur l'ambiance.

## 3. Quand ça bloque : renversements et frustrations

| Date | Ses mots | Ce qui l'a provoqué | Source |
|---|---|---|---|
| 2026-08-07 | « là ça fait amateur » | rangée d'icônes nues sans groupes ni libellés | `feedback_finicion_interfacia.md` |
| 2026-09-03 | limites de forfait | 13 agents, « contexte à 98 % » | `feedback_limites_et_phase_lancement.md` |
| 2026-09-18 | « il va falloir que tu m'aides à faire la gestion de ce projet » | « impression de tout reprendre à chaque fois », défaut de consignation | `PILOTATGE.md` en-tête |
| 2026-09-30 | « trop classique Claude » | format du site d'alors | §11 2026-09-30 |
| 2026-10-04 | « ça va vers l'atrophie cognitive en réalisant tout par IA, je réfléchis plus » | Claude produisait le fond pédagogique | §11 2026-10-04 |
| 2026-10-06 | « ça se voit que c'est Claude qui l'a fait » ; « tu te censurais » | retouches prudentes face à un test Mistral | §11 2026-10-06 ; `feedback_oser_proposer.md` |
| 2026-10-07 | « trop IA » ; « un peu triste » ; « Arrête de parler anglais !!!!! » | steampunk ; brun-noir ; anglais | §11 2026-10-07 ; `feedback_toujours_en_francais.md` |
| 2026-10-09 | « je consomme trop vite les crédits » ; « Arrête les micro-corrections » | 9 workflows la veille ; rustines sur la côte | `feedback_limites_et_phase_lancement.md` ; `feedback_methode_avant_correctifs.md` |
| 2026-10-10 | « trop kitsch » | portulan orné | `feedback_sobre_pas_kitsch.md` |
| 2026-10-12 | « ce n'est pas clair », « tu aurais pu me donner le numéro du dossier » | chemin abrégé | `feedback_chemins_complets.md` |
| 2026-10-15 | « Il ne faut pas que quand je te redemande est-ce que tu es sûr, tu me dises oui » ; « un peu trop sombre » | réponse qui cède au doute ; gamme sombre | `feedback_es_tu_sur.md` ; §11 2026-10-15 |
| 2026-10-21 | « trop de bruit, pas assez de structure », « un peu sombre » ; « contente-toi de respecter les couleurs que j'ai décidées dans le Canva » ; « on avance à l'aveugle » | fond vivant sombre ; croix recolorée ; visuel retouché sans structure | §11 2026-10-21 ; `feedback_colors_logo.md` |

**Le grand renversement** : clair « éditorial aéré » Parpeix (30-09) → sombre « esbòs de nuèch » (06-10) → retour au clair Parpeix (21-10). Typographie changée trois fois (22-08, 30-09, 05-10 ; `PILOTATGE.md` décision 2). **En commun** : Claude réinterprète son identité (couleurs, logo), ajoute ornement ou mouvement, code avant de montrer, parle anglais, consomme le forfait, ou habille avant de structurer (« On retouchait le visuel sans avoir posé la structure : d'où l'impression de bloquer », §11 2026-10-21).

## 4. Valeurs et non-négociables

- Éthique, écologie (« sobriété : poids des pages et des images »), inclusivité (RGAA, écriture inclusive), fierté occitane, européen quand possible (`Lo_Ligam/CLAUDE.md`).
- **Refus des images IA** : vraies photos, vraies personnes, autorisation écrite (§11 2026-08-30).
- Pas d'enfermement : Base44 écarté car hébergé chez Wix (§11 2026-09-18) ; satellite EOX retiré pour sa licence (§11 2026-10-09).
- L'occitan **toujours vérifié** avec lo Congrès, graphie classique, jamais phonétique ; « quand tu ne sais pas, tu effaces » (`feedback_noms_dialectals.md`).
- Textes publics : pas de tirets longs « typiques des IA », pas de jargon anglais (`feedback_estil_textes_aprenents.md`).
- « Ne jamais retirer une fonction » ; « faciliter toujours plus la navigation » (`feedback_navigation_clic_ailleurs.md`).
- « Ce n'est pas une propriété mais un territoire » (§11 2026-10-07) ; le lien humain d'abord : les cours en visio sont l'activité principale (§11 2026-10-06).

## 5. Rythme et contraintes

- **682 commits** du 28-07 au 21-10, sur 35 jours : trois pics (07-10 : 92 ; 10-10 : 85 ; 09-10 : 82), trois creux (10-21 août, 4-17 septembre, 19-29 septembre). Travail nocturne : 77 commits à 23 h, 68 à 0 h, 42 à 1 h ; second pic 14-15 h (Git). Ses « séances s'étalent sur la nuit et reprennent le lendemain » (`feedback_heure_horloge.md`).
- **Seul** : « pas de dizaines de locuteurs natifs ni de correcteurs » ; tout plan en deux colonnes lancement / évolution (§11 2026-09-03).
- **Forfait limité** (5 h, hebdo) ; agents seulement sur accord (`feedback_limites_et_phase_lancement.md`).
- **Plusieurs ordinateurs, une tablette** ; Git seul canal ; Proton Drive abîme `.git` (`reference_proton_git_name_clash.md`).
- **Urbaniste** (santé, qualité de l'air, SIG), formé à **Rhino et Grasshopper** (`_Carta/pro.md` l. 4 ; `_Carta/3D.md` l. 15) : d'où l'exigence cartographique et l'idée de salle 3D (`DIRECCION.md` §3).
- **Occitanophone apprenti** : « un apprenti qui n'a pas peur de faire des erreurs » ; Instagram né en 2022, « des animations de plus en plus travaillées, avec Canva » (`istoria-romain.md` §8).

## 6. Ce qu'il garde pour lui, ce qu'il délègue

| Romain, et lui seul | Claude | Ensemble |
|---|---|---|
| la vision, les livres, les photos, la voix, la validation de l'occitan, chaque décision | le code, la recherche, la mise en forme, « jamais de contenu inventé à sa place » | les choix visuels, « sur maquettes comparées, une décision à la fois » |

Source : `PILOTATGE.md` « Répartition des rôles » ; `autoformation-parcours.md` §2 (« Toi : tu lis, tu écris le premier jet, tu décides »).

**Constat gênant mais sourcé** : ce qu'il se réserve n'avance pas. Les huit pages du `carnet-concepcion/` sont vides depuis le 04-10 (« Date de lecture : » jamais rempli) ; les chantiers 3 (module 0), 4 (audio), 5 (validation), 8 (photos), 10 (Supabase) sont « bloqué », colonne « Qui : Romain » (`PILOTATGE.md`) ; le bloc 1 de `DIRECCION.md` attend sa réponse. Ce qui avance, c'est ce que Claude code seul : la carte. Le 20-10, il a choisi de **refaire d'abord ses visuels dans Canva** avant toute scène (`PILOTATGE.md` chantier 16) : Canva reste son atelier propre.

## 7. Pour le recentrage sur Instagram

L'identité du site est, dès le 28-07, « celle de l'Instagram Lo Ligam existant » (§11). La palette « Brasa » du 07-10 a été « calée sur ses publications Instagram (analyse des 213 visuels) » ; les six familles de publications datent du 12-10 (§11). Mais la question reste écrite sans réponse : « Le site doit-il ressembler à tes visuels Instagram (brique, dense, chaud) ou en être le calme à côté (plâtre, aéré) ? » (`DIRECCION.md` bloc 5). Toute « page presque blanche » devra donc respecter : ses couleurs Canva sans réinterprétation, ses contenus, une image fixe avant le code, trois options au plus, le téléphone d'abord, la structure avant l'habillage.
