# Journal de décisions (§11) : relecture complète au 2026-10-22

Corpus : `cahier-des-charges.md` §11 (l. 167 à 341) et §1 à §10 ; contrôles ponctuels dans `PILOTATGE.md` et `DIRECCION.md`. « l. N » = ligne du cahier. Les mots de Romain sont entre « ».

## 1. Chiffres

| Mesure | Valeur | Source |
|---|---|---|
| Décisions datées | **168** sur **28 dates** (07-28 → 10-21) ; pics : 07-28 et 10-07 (18 chacun), 10-10 (16) | l. 173 à 340 |
| Décisions sur la carte | **78** (46 %) | l. 205-206, 240-300, 305-311, 320-321, 327-331 |
| Attribuées explicitement à Romain | **103** | formules « Décision Romain », « (Romain) », « Romain : » |
| Lignes nommant Instagram | **5** (l. 189, 241, 318, 319, 326) + « publications » (l. 301) | grep |
| Renversements | **≈ 40** (24 %) | §3 |
| Version affichée du cahier | « 0.6 · 18 septembre » ; 100 décisions sont postérieures | l. 5 |
| But du journal | « pour ne pas tourner en rond dans six semaines » | l. 169 |

## 2. (a) Registre classé

**T** tenue · **R** renversée (par quoi) · **D** dormante (décidée, jamais appliquée ou reprise). Les 78 décisions carte du 10-07 au 10-19 sont **T** sauf mention : elles s'empilent sans se contredire.

| Date | Décision (l.) | Statut |
|---|---|---|
| 07-28 | 4 phases, MVP = apprentissage (173) | **R** 10-06 visio « activité principale » (239), puis 10-15 « le contenu et la carte d'abord » (318) |
| 07-28 | Norme classique (174), nom (177), API en complément (176), séquençage (178), A1 CEFR (184), RGPD (185), oc + fr (186), 15 ans (187), piliers UX (190) | **T** |
| 07-28 | Atlas LISN à autoriser (175) | **T** puis contourné : tracés libres (265), audios « échange en cours » (302) |
| 07-28 | Animations « élégantes et fluides » (179) | **T**, réduites 10-21 à « une seule chose qui bouge vraiment » (335) |
| 07-28 | Votz d'abord (180) | **R** 08-29 voix de Romain (219), 10-12 « pas de clé Votz » (302) |
| 07-28 | Essai libre (181) | **R** sur papier 08-29 (221) ; **D** de fait : toujours en ligne, module 0 « bloqué » (`PILOTATGE.md` l. 52, 163) |
| 07-28 | Interface 6 langues (182) | **D** : seul Òc/Fr existe (236, 298) |
| 07-28 | Appli mobile et web (188) | **R** 08-22 un produit, deux registres (214) |
| 07-28 | **Identité visuelle = l'Instagram** (189) | **R** 09-30 « le logo est le maître des couleurs » (233) et 10-06 nuit (238) ; **restaurée** 10-07 (213 visuels Instagram, 241) ; **R** 10-21 « couleurs de Léo Parpeix » (335) |
| 07-31 | Vercel (191) | **R** 08-08 Scaleway (207) ; secours **R** 10-07 (256) |
| 07-31 | Carte en premier ? Modèle payant ? (192-193) | **D** : jamais tranchées (§3 l. 61, §6 l. 103) ; la carte est passée première de fait |
| 08-03 | Aucun MP4 (194) | **R** le lendemain (199) |
| 08-03/04 | Fiches en base, images statiques, RLS, son muet, Òbras sans extrait, lien admin (195-202) | **T** |
| 08-06 | Pas de CMS, `site_textes` (203-204) | **T** (236) |
| 08-06 | Carte pilotée par la base (205) | **R** 08-07 couches génériques (206) ; catalogue « vit dans le code » (246) ; départements 3 niveaux **R** 10-12 (305) |
| 08-08/09 | Scaleway, config, Supabase gardé, CLOUD Act dit (207-211) | **T** ; réexamen Eurobase (210) **D** |
| 08-22 | corpus-design « lumière méditerranéenne » (212) | **T** sauf « touche méditerranéenne » **R** 10-21 « non sourcée » (334) |
| 08-22 | Daltonien (213), deux registres (214), une maison (218) | **T** |
| 08-22 | Typo Syne/Instrument/Cormorant (215) | **R** 09-30 (229) |
| 08-22 | Héros « Lo riu » (216) | **R** 10-05 (236), malgré le verrou du 09-18 (227) |
| 08-22 | 4 familles en cartes, chiffres OPLO, Officialitat, actualités (217) | Cartes **R** 10-05 (236), 10-14 (314), retirées 10-15 (318) ; chiffres **T** ; actualités **D** (404 le 10-21, 335) |
| 08-29 | API jamais depuis le site (219) | **T** (302, 333) |
| 08-29 | Méthode A→E, Claude produit (220) | **R** 10-04 (235), précisée 10-15 (325) |
| 08-29 | Cursus unique, module 0 (221), rythme libre (222), gamification Arbre/còla/Fuòc (223) | **D** ; badges « reportés » ; scène 10-15 « sans ajouter de récompense » (326) |
| 08-29 | « vrai mot / mot inventé » écarté définitivement (224) | **T** (326) |
| 08-30 | Photos sang e aur (225) | **T** au décor ; casting et droit à l'image **D** (`PILOTATGE.md` l. 57) |
| 09-03 | Romain seul : lancement / évolution (226) | **T** (340) |
| 09-18 | Racine2 : promesse, FAQ, A prepaus, Contacte, « Lèu » visibles (227) | **D** chantier 7 « à faire » (`PILOTATGE.md` l. 56) ; « Lèu » **R** 10-15 (318) ; la promesse devient le titre 10-15 |
| 09-18 | Claude Design (228) | **R** 09-30, 12 jours après (234) |
| 09-30 | Barrio/Limelight/Luciole (229) | **R** partiel 10-05 : Barrio sort (236) ; Cormorant revient 10-09 (271) |
| 09-30 | Logo croix-constellation, variante C (230-231) | **T**, réaffirmé 10-21 (338) |
| 09-30 | « Éditorial aéré » (232) | **R** 10-06 (238) ; **restauré** 10-21 (335) |
| 09-30 | Palette brique du logo (233) | **R** 10-07 Brasa (241), 10-15 Éclat (323), 10-21 Plâtre (336) |
| 10-04 | Romain conçoit, Claude vérifie (235) | **T** |
| 10-05 | Accueil éditorial aéré (236) | **R** le lendemain (238) |
| 10-06 | Menu voile, pied crème (237) | Menu **R** 10-15 (319) puis « reste tel quel » (337) ; pied **R** 10-07 sombre, 10-21 clair |
| 10-06 | Esbòs de nuèch, fond sombre par défaut (238) | **R** 10-21 (336) ; croix qui se forme et s'éparpille **T** |
| 10-06 | Visio, espace élèves, rendez-vous, « Qui suis-je » (239) | Visio nuancée 10-15 (318) ; élèves, rendez-vous, Proton **D** (aucune ligne ensuite) |
| 10-06 | « ancrés mais connectés » (240) | **T** |
| 10-07 | Venas d'aur par défaut (241) ; steampunk « trop IA » | Défaut **R** 10-21 (336) ; steampunk **T** |
| 10-07 | Un seul dialecte (248) → plusieurs (257) ; Croissant sélectionnable (248) → retiré (251) → pastille (257) ; mentonnais alpin (245) → transition 10-12 (311) | **R** le jour même ou sous cinq jours : ajustements |
| 10-07 | Fai ta carta (250) | **D** « à trancher » |
| 10-08/10 | Entrée en scène, niveaux de lecture, autres langues, limites, « clic ailleurs », rail (259-294) | **T** ; onglets (286) **R** le jour même (288) ; 50 km (274) **R** 70 km (299) ; seuils barre d'échelle (273) **R** relatifs à l'écran (299) |
| 10-12 | Six familles de publications « à valider » (301) | **D** |
| 10-12 | Pas de courriels, 1 Mo Git, rangement, départements retirés (302-305) | **T** ; option C **D** |
| 10-12 | Démonstrateur local (306) | **R** le jour même (307) |
| 10-12 | Voix A et C (308-310) | **T** ; B **D** (`DIRECCION.md` l. 257) |
| 10-14 | Fond léger auto téléphone (312) | **R** le jour même ; Venas d'aur pour tous **R** 10-21 |
| 10-14 | Version légère « pas imposée par défaut » (313) | **D** par construction ; tension avec 10-21 |
| 10-14 | Quatre camins en 4 cartes (314) | **R** le lendemain (318) |
| 10-14 | Fil d'or, chapitres (315) | **T** ; séparation « à améliorer » encore 10-21 (337) |
| 10-15 | loligam.eu, menu-plan, relevé, flèche, braise, Éclat, wiki, charpente et chair, scène (316-326) | **T** ; « Se viu » **R** « Amassa » (339) ; liens normaux → sept 404 (335) |
| 10-19/21 | Mémoire, couche active, clic partout, Lumière, règles, Plâtre, structure, logo, Amassa, DIRECCION (327-340) | **T** (trop récentes) |

## 3. (b) Renversements : combien, sur quoi

| Sujet | Nb | Nature |
|---|---|---|
| **Accueil : héros, fond, palette, typo, menu, pied** | **17** | Retours de direction : riu → éditorial aéré → nuit → Brasa → Éclat → Plâtre ; typo 3 fois, palette 4 fois en six semaines |
| Carte | 9 | Ajustements du jour ou de la semaine ; la carte converge |
| Périmètre produit | 6 | Phases, essai libre, appli native, visio, « Lèu » |
| Infrastructure | 5 | Vercel (2), MP4, carte en base, départements |
| Méthode, outils | 3 | Claude Design, rôle de Claude, « bloc par bloc » |

Oui, toujours les mêmes sujets : **l'habillage de l'accueil = 17 renversements sur 40**, quatre accueils en seize jours (10-05, 10-06, 10-15, 10-21). Zéro renversement sur : norme, nom, hébergement européen, API hors site, âge, RGPD, une maison, Romain seul, « vrai mot », « clic ailleurs », logo.

## 4. (c) Romain en ses mots

Six citations avant le 10-04 ; presque une par ligne depuis le 10-06.

**Ce qu'il aime, ce qui débloque** : « belle et fière » (179) · « rien ne doit être laissé au hasard » (212) · « méthodologie irréprochable » (220) · « beaucoup mieux, on a débloqué quelque chose… tu peux utiliser cette base dorénavant » (238) · « une carte informative mais aussi artistique, vraiment captivante » (263) · « Étoiles → carte » (243) · « ancrés mais connectés » (240) · « apparition des points en éclairage par vague poétique » (310) · « plus créatif et intuitif », « pour les 3 » (308) · « Un bleu profond joli » (291) · menu-voile « presque la partie la plus sympa du site » (337) · « on part sur la nouvelle couleur » (233) · « je veux qu'on me pousse la maquette sur le projet principal » (236) · « la référence » (Occitanica, 245).

**Ce qu'il rejette**
- Le générique : « site standard qui pourrait venir de n'importe où » (212) · « trop classique Claude » (232) · « ça se voit que c'est Claude qui l'a fait » (237) · « trop IA » (241).
- L'ornement, le bruit, le sombre : « trop kitsch » (290) · « plus jamais » l'amas d'icônes (266) · « trop de bruit, pas assez de structure », « un peu sombre » (335) · « un peu triste » (241) · « un peu trop intense parfois » (322) · « un peu trop sombre » (323) · « Trop sombre sur sombre » (320) · « les boutons flottent » (334).
- Le défaut d'exécution : « Illisible » (293) · « Ce n'est pas fluide au niveau des noms des villes » (295) · « mal organisé et en conflit avec le nom des villes » (309) · « Les bordures apparaissent en retard, ce n'est pas naturel » (300) · carte qui « revient à l'étape initiale » (327).
- La dépossession : « ça va vers l'atrophie cognitive en réalisant tout par IA, je réfléchis plus » (235) · « contente-toi de respecter les couleurs que j'ai décidé dans le Canva » (338) · « se viu ne correspond pas au contenu » (339).
- Son frère Cyril : « la logique de descendre et après ça slide me perturbe » (314).

**Ce qu'il demande** : « L'occitan se parle, s'apprend et se vit. Quel que soit ton objectif, tu es au bon endroit ! » (227) · « le téléphone, c'est le principal » (299) · « Remets la vue par défaut à 70 km… on voit pas toute l'Occitanie » (299) · « ce n'est pas une propriété mais un territoire » (251) · « si le nom d'une ville est attesté dans une langue, ça n'appartient à personne » (281) · « au moins le ch'ti et le picard » (280) · « Dès qu'on couvre une nouvelle zone il faut qu'elle soit ouverte avec le même package que les autres » (296) · « Il faut pouvoir cocher oc si on veut voir en oc » (297) · « Quand on est en occitan, sur les villes occitanes pas de traduction » · « beaucoup de francophones sont paniqués dès qu'ils ne comprennent pas » (298) · « dès qu'on clique sur la zone où il y a une langue prévue par le site, on devrait pouvoir l'afficher, à toutes les échelles » (328) · « bilan complet du code » (261) · « on fait au max aujourd'hui » (304) · « le site n'est pas ouvert au public… ce n'est pas maintenant que le site sera diffusé » (307) · « le B peut attendre » (308) · « zone complexe avec le niçois, le ligure, le gavot » (311) · « on avance à l'aveugle… un document que je puisse remplir, qui me pose les questions où tu as besoin de réponses… regrouper l'ensemble, le digérer, le confronter et le faire évoluer » (340).

## 5. (d) Verrous et leur sort

| Verrou | l. | Sort |
|---|---|---|
| « Les décisions du 2026-08-22 (riu, typo, 6 stations, une maison) ne sont PAS rouvertes » | 227 | **3 sur 4 ont sauté** : typo 12 jours après (229), riu et stations le 10-05 (236) |
| « Écarté définitivement : vrai mot / mot inventé » | 224 | Tenu (326) |
| « rien ne meurt, zéro classement, frontière étanche jeu/paiement » | 223 | Jamais contredit, jamais appliqué |
| « jamais d'appel à l'API depuis le site » | 219, 333 | Tenu |
| « plus jamais » l'amas d'icônes | 266 | Tenu |
| « Ne jamais retirer une fonction existante sans demande » | 289 | Tenu (328) |
| « le logo est le maître des couleurs » | 233 | Bousculé 10-07 et 10-15, réaffirmé 10-21 (338) |
| « un nouveau texte visible se met dans `site_textes` » | 204 | Tenu (236) |
| Valeurs « non négociables » éthique, écologie, inclusivité | 18 | Tenues |

Tous les verrous techniques et éthiques tiennent ; le seul verrou visuel a sauté trois fois.

## 6. (e) Contradictions internes

1. §9 (l. 148-149) dit encore que Claude doit « rédiger le contenu pédagogique et culturel » ; le 10-04 dit le contraire (235).
2. §1 (l. 12) et §3 « cinq produits » (l. 33) restent écrits alors que Lo Ligam « n'est plus la plateforme de tout l'écosystème occitan » (239) ; le recroisement « §3, §6, §8 » n'a pas eu lieu (version 0.6, l. 5).
3. Visio « activité principale » avec espace élèves et rendez-vous (239) : aucune des 100 décisions suivantes ne la touche ; le 10-15 la sort de la porte d'entrée (318).
4. Quatre maîtres des couleurs successifs : Instagram (189), logo (233), Instagram (241), Parpeix (335) ; le 10-21 Romain rappelle « les couleurs que j'ai décidé dans le Canva » (338).
5. Essai libre « remplacé » (221) mais en ligne 54 jours après, module 0 bloqué (`PILOTATGE.md` l. 52, 163).
6. Version légère « pas imposée par défaut » (313) contre « Simple (immobile) par défaut » une semaine après (336).
7. Liens normaux vers des rubriques vides (318) ; six jours après, « sept liens du menu mènent encore à une 404 : la structure doit exister avant l'habillage » (335).
8. Carte première de fait, jamais tranchée : §3 garde la « réflexion en cours » du 07-31 (l. 61) ; 78 décisions sur 168 ; `DIRECCION.md` l. 19 : « la carte a pris toute la place », chantier Estructura du 18-09 « jamais tenu ».
9. « Touche méditerranéenne » retenue (212, 290), écartée « non sourcée » (334).
10. Animations exigées (179), relevées en « hauts standards » (237), réduites à « une seule chose qui bouge vraiment » (335).

## 7. Instagram dans le journal

Origine déclarée de l'identité (189), étalon des couleurs (241 : 213 visuels), système de publication (301 : six familles « à valider »), lien de la communauté (318-319), matière du parcours (326 : « la scène relie ses visuels Instagram, la carte et le jeu »). Mais aucune décision ne fait de l'Instagram un canal ou un contenu du site : l'« espace actualités » (217) dort depuis le 08-22, les six familles n'ont jamais été validées.

## 8. Lecture

Tient tout ce qui a été tranché **sur planche comparée, une question à la fois** (typo 09-30, logo, Lumière avec pastilles, Plâtre) et tout le fond (langue, droit, hébergement, rôles, carte). Tourne l'habillage de l'accueil, rouvert chaque fois par un déclencheur extérieur (test Mistral, Parpeix, Cyril, fatigue du sombre) sans structure posée : « on avance à l'aveugle » (340). Les décisions dormantes forment un bloc : tout le parcours d'apprentissage (module 0, cursus, gamification, rythme, casting, actualités, visio) attend depuis août que la carte lui laisse la place.
