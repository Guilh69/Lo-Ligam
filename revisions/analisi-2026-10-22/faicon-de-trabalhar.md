# Sa façon de travailler : quand ça marche, quand ça bloque

*Écrit le 2026-10-22 d'après les neuf lectures (`00-resums.md`), surtout `romain-sa-faicon.md`, `jornal-decisions.md`, `pilotatge-cantiers.md` et `istoria-git.md` ; `l.` = journal §11 du cahier. Franc, pas flatteur.*

## 1. Les séances qui ont marché

- **29-08** : étapes A à D du cursus closes en un jour ; unité 1 écrite et vérifiée par les API de lo Congrès (63d3634 ; aprendre-estat).
- **30-09** : « éditorial aéré » choisi devant une référence, « es geniala » (23e6e08) ; le logo « maître des couleurs » (l.232-233).
- **06-10** : page blanche refaite avec son identité, « beaucoup mieux, on a débloqué quelque chose » (l.238).
- **07-10** : « la carte en étoiles devient la carte » ; palette calée sur ses visuels (l.241-245).
- **15-10** : variantes sur le vrai site avec le sélecteur ?ensag=, tranchées en un mot (« braise », « 2 », « vertical ») ; plan en trois verbes (l.318).
- **20-10** : scène « Lumière avec pastilles » validée sur téléphone (univers-scenes §9).
- **21-10** : trois maquettes SVG, choix en un clic ; « Amassa » choisi entre trois formes vérifiées ; DIRECCION.md né (l.339-340).

Points communs : deux ou trois options nommées et visibles (image fixe ou variante sur le vrai site), dans ses couleurs, avec ses contenus, une décision à la fois, souvent sur téléphone ; il répond en un mot. Elles portent sur la structure ou l'identité, et tiennent (romain-sa-faicon).

## 2. Les blocages et les renversements

- **31-07** : annulation en six minutes (c21ea46 puis 2d6c5a9) (istoria-git).
- **18-09, puis 30-09 et 05-10** : le verrou « ne sont PAS rouvertes » (l.227) saute trois fois sur quatre (jornal-decisions).
- **05-10, 06-10, 14-10, 21-10** : accueil clair intégré puis « dépassé » le lendemain (l.236, 238) ; fond braise posé et retiré le même jour (05982a7, 4ab1184) ; retour au clair (l.335). Neuf accueils en douze semaines, trois typographies, cinq palettes (istoria-git).
- **03-09, 08-10, 09-10** : treize agents (« contexte à 98 % »), neuf enchaînements d'agents, forfait vidé, « je consomme trop vite les crédits » (feedback_limites).
- **21-10** : trois variantes codées d'emblée, « pas fan » ; la croix corrigée deux fois le même soir (feedback_colors_logo).
- **15-10, puis 21-10** : « dès maintenant un lien normal » aux rubriques absentes, puis « sept liens du menu mènent encore à une 404 » (l.318, 335).

Points communs : Claude réinterprète l'identité, ajoute ornement ou mouvement, code avant de montrer, dépense le forfait ; l'habillage est retouché avant la structure. Les 40 renversements du §11 touchent l'ambiance (17 sur l'accueil), jamais les verrous éthiques et techniques (jornal-decisions).

## 3. La cause de fond de « à l'aveugle, de manière artisanale »

21-10 : « j'ai l'impression qu'on avance à l'aveugle et que je construis au fur et à mesure de manière artisanale » (DIRECCION l.4-5). Cause consignée : « on retouche le visuel sans avoir posé la structure » (DIRECCION l.19-21 ; l.340). Cinq preuves.

1. **La structure n'a jamais eu sa séance.** Estructura, prévue depuis le 18-09, « jamais tenue : la carte a pris toute la place » (DIRECCION l.17-19) : 4 et 1 commits les jours de méthode, 92, 82 et 85 les jours de carte (pilotatge-cantiers).
2. **Quatre questions attendent depuis juillet** : modèle économique, unités A1 au lancement, carte en premier, statut juridique (PILOTATGE l.113-122). La carte est première de fait sans décision (cahier l.61).
3. **Les règles sont écrites, pas appliquées** : trois tailles de texte décidées, 31 dans acuelh.css ; dossier Inspiration vide (referencias-principis).
4. **Le registre OUTIL n'a jamais été dessiné** : 22 commits sur /aprene, 9 sur /compte, contre 126 sur l'accueil et 180 sur la carte (referencias-principis).
5. **Ce que Romain se réserve n'avance pas** : carnet de conception vide depuis le 04-10 ; module 0, audio (1 fichier sur 17), validation, photos « bloqué » ; ce que Claude code seul avance (romain-sa-faicon §6). Un choix visuel sur essai en ligne se tranche le soir même ; écrire, enregistrer ou valider ne se fait jamais, et les listes s'additionnent : 1 450 lignes de noms pour la seule carte (pilotatge-cantiers, carta-placa).

Artisanal : chaque soirée part du dernier visuel, pas d'un cadre écrit. À l'aveugle : ce cadre n'existe que depuis le 21-10, et la part que lui seul peut écrire n'a jamais eu sa soirée.

## 4. Sept règles de travail

Pour Claude :

1. **Montrer avant de coder** : deux ou trois options nommées, image fixe ou sélecteur ?ensag= ; jamais de variantes codées d'emblée. Preuve : 15-10 un mot par choix, 21-10 « pas fan » puis un clic sur trois SVG (feedback_metode_visuala_romain).
2. **Ses couleurs et ses contenus sans réinterprétation ; l'audace dans la composition, pas dans la palette.** Preuve : 06-10 « tu te censurais », 21-10 deux corrections de la croix (feedback_oser_proposer, feedback_colors_logo).
3. **Structure avant habillage** : aucune retouche d'ambiance tant que le bloc DIRECCION du jour n'a pas sa réponse. Preuve : 17 renversements d'accueil, verrou du 18-09 sauté, l.340.
4. **Une séance, un bloc ; pas d'agents sans son accord ; coût annoncé avant.** Preuve : 03-09, 08-10, 09-10 (feedback_limites).

Pour Romain :

5. **Répondre à la voix, une question à la fois, pendant la séance** ; Claude écrit, il valide. Preuve : « lire seul, puis écrire une page » « ne s'est pas enclenchée » (metode-parcours l.28-30) ; carnet vide depuis le 04-10.
6. **Une soirée de production à lui par semaine, avant toute soirée de carte** : une liste validée, une voix enregistrée ou un bloc de module 0 dicté. Preuve : chantiers 3, 4, 5 inchangés depuis le 18-09 ; à deux soirées par semaine, lancement en « 8 à 10 semaines » (pilotatge-cantiers).
7. **Trancher les quatre questions de juillet, une par séance, sans les rouvrir.** Preuve : PILOTATGE l.113-122 ; le seul verrou visuel a sauté trois fois.

## 5. Ce qu'il garde, ce qu'il délègue (règle du 04-10)

« Romain conçoit lui-même le parcours pédagogique ; Claude ne produit plus de contenu pédagogique à sa place » (04-10, l.235) ; « la charpente est à Claude, la chair à Romain » (15-10, DIRECCION l.15). À lui seul : la vision, les livres, les photos, la voix, la validation de l'occitan, chaque décision. À Claude : le code, la recherche, la mise en forme. Ensemble : les choix visuels « sur maquettes comparées, une décision à la fois » (romain-sa-faicon §6 ; PILOTATGE, rôles). Canva reste son atelier : le 20-10, ses visuels d'abord, la scène ensuite (PILOTATGE chantier 16).

La ligne est juste, le mode ne l'est pas : tout ce qu'il garde est à produire seul, hors séance, et c'est ce qui ne se fait pas (aprendre-estat). Déléguer sans se déposséder, DIRECCION.md le fait déjà : « Romain répond à la voix dans la conversation ; Claude écrit la réponse ici, datée, vérifie l'occitan » (l.10-12). La chair reste la sienne ; la main peut être celle de Claude, s'il dicte et relit.
