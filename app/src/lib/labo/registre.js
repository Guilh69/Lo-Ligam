// Le registre des choix de design (Laboratòri, /admin/labo, 2026-11-07).
// Romain : « une interface unique, dans mon espace administrateur, pour voir les
// essais en cours ; quand j'ai fait un choix, les autres options disparaissent et on
// garde le choix validé ; je peux ajouter des inspirations ; un outil qui liste ce
// que je devrais choisir ». Méthode déjà écrite en charte §5sexies : Romain range
// des inspirations, Claude propose un essai dans /ensag/, Romain décide, la
// décision entre dans la charte. Ce registre en est la version vivante.
//
// REFAIT LE 07-11 APRÈS AUDIT DU CODE : la première version avait été écrite à partir
// de notes et de souvenirs ; Romain a vu que des fiches étaient périmées (écrites sur une
// vieille version du site). Chaque fiche « en place », « retenu » ou « archivé » est
// maintenant vérifiée dans le code, avec les fichiers en preuve. Une fiche se re-vérifie
// avec `git log` sur ses fichiers de preuve : si le code a bougé depuis `verifie`, relire.
//
// Un choix = une question de design. Cinq états (voir STATUTS) ; un choix ouvert a des
// options (registre-options.js) et un ordre de décision (`apres`). Un choix retenu
// n'affiche que lui ; les options perdues restent dans « écartés » (archive, jamais
// supprimée), avec la raison. `ecart` = ce qui sépare la décision du site réel (décidé
// mais pas encore appliqué). Les clés ne changent jamais. Textes en français simple.
// Séance 1 : lecture seule, Claude tient les états à jour. Séance 2 : inspirations et
// validation depuis la page, en base. Séance 3 : le pont vers Claude Design.
//
// Sources : app.css, papier.css, charte-graphique.md (§ cités), cahier §11, PILOTATGE §5,
// les retours de Romain, et l'audit du code du 07-11. Une date « jj-mm » est en 2026.
import { COMPLEMENTS } from './registre-options.js';

// Cinq états. « En place » est apparu le 07-11 : beaucoup de choses existent déjà dans le
// code sans que Romain les ait jamais validées ; la question n'est pas « quoi explorer ? »
// mais « on garde tel quel, ou on change ? ».
//  - 'explorer'    : rien n'existe encore ;
//  - 'enplace'     : existe dans le site ; depuis le 12-11 (« une seule porte », cahier §11),
//                    tenu pour validé tant que Romain ne le signale pas (« Comentar ») :
//                    ce n'est plus une question, et il ne bloque aucun autre choix ;
//  - 'comparaison' : des essais existent (page /ensag/…), Romain doit choisir ;
//  - 'retenu'      : tranché (et appliqué, sauf `ecart`) ;
//  - 'archive'     : périmé, remplacé ou abandonné ; gardé pour mémoire, avec la raison.
export const STATUTS = {
	explorer: { nom: 'À explorer', court: 'à explorer' },
	enplace: { nom: 'En place, validé par défaut', court: 'en place' },
	comparaison: { nom: 'En comparaison', court: 'en comparaison' },
	retenu: { nom: 'Retenu', court: 'retenus' },
	archive: { nom: 'Archivé', court: 'archivés' }
};
/** Les états où il reste quelque chose à décider (« en place » n'en est plus un depuis le 12-11). */
export const OUVERTS = ['explorer', 'comparaison'];

// Constructeurs courts : R retenu, C en comparaison, E à explorer, P en place (vérifié dans
// le code), A archivé (périmé, avec sa raison).
const R = (clau, titol, question, texte, source, extra = {}) => ({
	clau,
	titol,
	question,
	statut: 'retenu',
	retenu: { texte, source },
	...extra
});
const C = (clau, titol, question, essais, extra = {}) => ({ clau, titol, question, statut: 'comparaison', essais, ...extra });
const E = (clau, titol, question, extra = {}) => ({ clau, titol, question, statut: 'explorer', ...extra });
const P = (clau, titol, question, texte, preuve, extra = {}) => ({
	clau,
	titol,
	question,
	statut: 'enplace',
	aujourdhui: { texte, preuve, verifie: '2026-11-07' },
	...extra
});
const A = (clau, titol, question, raison, extra = {}) => ({
	clau,
	titol,
	question,
	statut: 'archive',
	archive: { raison, date: '2026-11-07' },
	...extra
});
const essai = (chemin, titol) => ({ chemin, titol });
// « Rien n'existe » vérifié dans le code : même bloc « Ce que fait le site aujourd'hui ».
const RIEN = (texte, preuve) => ({ texte, preuve, verifie: '2026-11-07' });

// Inspirations envoyées par Romain le 07-11 (captures d'écran de Busuu et de La Fourche).
// Notes en texte : les images viendront en séance 2 (stockage, poids).
const BUSUU = 'Busuu';
const FOURCHE = 'La Fourche';

const FAMILLES_BRUT = [
	{
		id: 'couleurs',
		titre: 'Couleurs',
		intro: 'La palette, les deux thèmes, et le rôle de chaque couleur.',
		choix: [
			R(
				'palette-sombre',
				'Palette du thème sombre',
				'Les couleurs de fond, de texte et d’accent quand le site est sombre.',
				'Gamme « Éclat » : fond brun chaud #22100a, crème #fbf1e1, or #f6b73c, terracotta #c8481c.',
				'Romain, 15-10 (« un peu trop sombre ») ; app.css',
				{ ecartes: [{ titol: 'La gamme précédente (fond #120906)', raison: 'Jugée « un peu trop sombre » (Romain, 15-10).' }] }
			),
			P(
				'palette-claire',
				'Palette du thème clair',
				'Les couleurs de fond, de texte et d’accent quand le site est clair.',
				'Gamme « Plâtre » : fond #f7f3ee, encre #2a1a10, la brique #b53d17 pour l’action, l’ocre #9c5611 pour la valeur. Depuis le 07-11, les boutons secondaires sont en sarcelle #1f5f63 à texte crème, et l’or #eeaf34 est réservé à « le choisi ».',
				['src/app.css:113-129', 'src/app.css:149-155', 'commit 1afee504'],
				{
					ecartes: [
						{ titol: 'Terre cuite', raison: 'Écartée au profit du Plâtre sur /ensag/clar (21-10).' },
						{ titol: 'Ciel du Sud', raison: 'Écartée au profit du Plâtre sur /ensag/clar (21-10).' }
					],
					avis: 'Rouvert par Romain le 07-11 : « le crème fait slop Claude et la palette ne va pas bien ensemble ». Une session dédiée (palette-couleurs) mesure les couleurs réelles et prépare trois pistes ; rien ne change sur le site avant ta validation. À savoir : /compte, /anem, /apren/remira, /accessibilitat, /confidencialitat et /mencions-legalas restent en clair même si le visiteur choisit le sombre (liste ARMONIZADAS), donc la palette claire pèse plus que le choix de thème.',
					inspirations: [
						{ source: BUSUU, note: 'Fond bleu très pâle presque blanc, une seule couleur vive (un bleu), le vert seulement pour « juste ».' },
						{ source: FOURCHE, note: 'Fond blanc, un rouge-orangé comme couleur de marque, un jaune pâle pour les bandeaux, du noir pour le trait.' }
					]
				}
			),
			R(
				'theme-defaut',
				'Thème par défaut',
				'Dans quel thème le site s’ouvre pour un nouveau visiteur.',
				'Sombre par défaut. Le visiteur choisit clair, sombre ou celui de son système.',
				'Romain, 22-10 ; app.html (le clair était le défaut le 21-10)'
			),
			R(
				'couleur-action',
				'Couleur de ce qui se clique',
				'La couleur qui dit « tu peux cliquer ici ».',
				'Le rouge du logo #b53d17 : en aplat sous un texte crème pour un bouton, en soulignement pour un lien. Le même sur les deux thèmes. Jamais en texte sur fond sombre (contraste 3,2).',
				'Romain, 23-10 (règle B) ; app.css'
			),
			R(
				'couleur-valeur',
				'Couleur de mise en valeur',
				'La couleur qui met en avant sans inviter à cliquer.',
				'L’or #f6b73c en sombre, l’ocre #9c5611 en clair (4,70:1) : numéros, titres de leçon, mots mis en avant.',
				'Romain, 23-10 (règle B) ; app.css'
			),
			P(
				'couleurs-retour',
				'Couleurs de retour : juste, faux, attention',
				'Comment le site dit « bravo », « raté » ou « fais attention », sans que la couleur soit le seul signal.',
				'Juste : la pièce passe à l’or, avec un « ✓ » et une explication d’une ligne en vert (--l-bon : #b8d27c en sombre, #55702f en clair). Faux : la pièce est grisée et barrée, avec une secousse de 260 ms. Jamais de rouge pour « faux », pas de panneau teinté.',
				['src/lib/lesson/QcmBlock.svelte:75,187-205', 'src/app.css:147,154'],
				{
					inspirations: [
						{
							source: BUSUU,
							note: 'Quand la réponse est juste, un panneau blanc monte du bas avec une coche verte, le bouton passe du bleu au vert, et le mot juste est souligné en vert dans la phrase.'
						}
					],
					avis: 'Le vert existe déjà dans les deux thèmes et le « faux » se dit sans couleur (barré) : la base est saine. Reste à décider si l’on garde ce traitement discret ou si l’on ajoute un panneau teinté comme Busuu.'
				}
			),
			R(
				'couleurs-pieces',
				'Couleurs des pièces de papier',
				'Quelle teinte pour quel rôle, sur fond sombre et sur fond clair.',
				'Carton secondaire : crème #efe1c6 à texte brun en sombre, sarcelle #1f5f63 à texte crème en clair. L’or #eeaf34 pour « le choisi », le rouge du logo pour l’action.',
				'Romain, 07-11 (« clair sur le sombre », « vif en clair ») ; app.css ; commits 341e9e0b, c24b9d46, 1afee504',
				{
					ecartes: [
						{ titol: 'Terre cuite pour le carton en sombre', raison: 'Remplacée par la crème #efe1c6 : « pour que Se connecter et Menú ressortent » (Romain, 07-11).' },
						{ titol: 'Les autres partis des deux essais papier-couleurs', raison: 'Non retenus (07-11).' }
					],
					ecart: 'Les classes .pc-vert, .est-bon et .est-faux sont définies mais n’ont aucun usage ; le jeton --pc-icone (bleu) n’a jamais été adopté.',
					avis: 'Remis en cause avec la palette claire (« la palette ne va pas bien ensemble ») : la sarcelle du thème clair fait partie de ce que la session palette-couleurs réexamine.'
				}
			)
		]
	},
	{
		id: 'typo',
		titre: 'Typographie et texte',
		intro: 'Les polices, leur emploi, la hiérarchie du texte.',
		choix: [
			R(
				'polices',
				'Les polices du site',
				'Quelles polices, et seulement celles-là.',
				'Trois seulement : Limelight (titres et logo), Luciole (texte courant, conçue pour la mauvaise vue), Cormorant Garamond (citations poétiques).',
				'Romain, 30-09 et 05-10 ; charte §2',
				{
					ecartes: [
						{ titol: 'Fontshare et Fontspace', raison: 'Typographie fermée à d’autres polices (charte §2) ; licences mêlées chez Fontspace (12-10).' }
					]
				}
			),
			R(
				'limelight-usage',
				'Où employer Limelight',
				'Jusqu’à quelle taille de titre la police de décor reste lisible.',
				'Limelight pour les gros titres et les gros chiffres seulement. Tout le reste en Luciole.',
				'Romain, 02-11 (« assez difficile à lire »)',
				{
					ecart: 'Limelight reste en petit : titres des tuiles de S’apren (capitales de 1,25 à 1,6 rem), titres de bloc de chaque exercice (1,15 rem), numéros (0,75 rem), bouton « Acabada » (1,05 rem). Les pièces ordinaires sont bien en Luciole.'
				}
			),
			R(
				'hierarchie-texte',
				'Hiérarchie du texte',
				'Combien de niveaux de texte, quelle longueur de ligne.',
				'Trois niveaux de texte au plus par écran, tailles décroissantes ; 45 à 75 signes par ligne ; interligne 1,4 à 1,6.',
				'Charte §5octies (TYP-01)'
			)
		]
	},
	{
		id: 'miseenpage',
		titre: 'Espace, formes et traits',
		intro: 'L’espacement, la grille, les coins, les traits, les ombres.',
		choix: [
			R(
				'echelle-espacement',
				'Échelle d’espacement',
				'Les seules valeurs d’espace autorisées entre les éléments.',
				'Multiples de 4 px : 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (variables --esp-4 à --esp-128, en rem).',
				'Charte §5octies (ESP-01), 21-10'
			),
			R(
				'grille',
				'Grille de mise en page',
				'Comment les grands blocs se posent sur un grand écran.',
				'12 colonnes sur ordinateur, gouttière 24 px.',
				'Charte §5octies (GRI-01)'
			),
			R(
				'trait-fin',
				'Traits et filets',
				'Quelle épaisseur et quelle présence pour les séparateurs et les contours.',
				'Filets fins, un seul poids de trait, recettes du logo, sans rebond. Pas de filet coloré à gauche, de pastille ni de verre fumé.',
				'Retours de Romain (« raffiné » contre « amateur », « pas de cliché du web »)',
				{
					ecart: 'Le code fait encore le contraire : 19 règles border-left de 3 à 4 px colorées (compte, groupes, idées, visio, parcours, confidentialité) et 32 usages de backdrop-filter (verre). Le message d’erreur du compte a lui aussi un filet doré de 4 px à gauche.'
				}
			),
			R(
				'aplats-carte',
				'Aplats de la carte',
				'Comment les surfaces et les limites sont dessinées sur la carte.',
				'Aplats sans contour, comme dans QGIS, aux teintes des boutons (aplats pleins à 0,88 d’opacité depuis le 07-11, identiques en sombre et en clair) ; limites en pointillé blanc très fin.',
				'Romain, 24-10 ; carta/colaDonadas.js ; commit e2f15d44',
				{ ecart: 'Le détail « frontière tracée une seule fois » n’est pas vérifié ; les aplats sont bien plus intenses depuis le 07-11.' }
			),
			P(
				'coins-formes',
				'Coins et formes : arrondis, pilules, papier découpé',
				'Le degré d’arrondi des boutons, des cartes, des champs.',
				'Plus de pilule pour les actions : pièces à coins de 10 px (de 8 à 18 selon le format), champs de formulaire 6 px, panneaux 8 px, cartes de leçon 20 px. Les pilules (999 px) restent pour la recherche de la carte, les interrupteurs et les pastilles.',
				['src/lib/styles/papier.css:14,84,94,109,144', 'src/routes/compte/+page.svelte:633,652', 'src/lib/components/CercaCarta.svelte:250'],
				{
					inspirations: [
						{ source: BUSUU, note: 'Bouton « Continuer » en pilule très arrondie, pleine largeur, collé en bas de l’écran.' },
						{ source: FOURCHE, note: 'Champ de recherche en pilule à bordure fine ; cartes à bordure fine rosée et coins arrondis.' }
					],
					avis: 'Le papier découpé aux coins de 10 px est adopté pour les pièces : c’est tranché. Ce qui reste est un mélange de rayons pour le reste (6, 8, 10, 20 px et pilules) : unifier, ou garder une hiérarchie voulue ?'
				}
			),
			P(
				'ombres',
				'Ombres et profondeur',
				'Quelle ombre sous une pièce, un bouton, une carte qui se soulève.',
				'Une ombre courte sous les pièces (0 3px 4px, jeton --pc-ombre), plus longue au survol. Elle est déjà étendue aux cartes de leçon (0 8px 20px) et au survol des tuiles de rubrique (0 14px 30px).',
				['src/lib/styles/papier.css:17,31,39-43', 'src/lib/lesson/QcmBlock.svelte:86', 'src/lib/apren/PaginaTeulas.svelte:258']
			)
		]
	},
	{
		id: 'boutons',
		titre: 'Boutons et actions',
		intro: 'Quel bouton pour quel type d’action, avec ses états.',
		choix: [
			R(
				'bouton-principal',
				'Bouton principal',
				'L’action la plus importante de l’écran (« Dobrir la carta », « Reservar un cors »).',
				'Une pièce de papier (classe .pc) : aplat du rouge du logo #b53d17, texte crème, coins de 10 px, ombre courte, soulevée au survol et enfoncée à l’appui. Posée sur l’accueil, la carte, les leçons, les jeux et le compte (au moins 127 emplacements).',
				'Romain, 06-11 (« que ce soit vraiment la marque de fabrique du site ») ; papier.css ; commits 6ee21f9b, fbaf9b21',
				{
					ecartes: [
						{ titol: 'Pilule pleine rouge', raison: 'L’ancien bouton, remplacé par la pièce de papier (06-11).' },
						{ titol: 'Papier découpé aux bords irréguliers', raison: 'Jugé « un faux découpage raté » (06-11) ; la reprise a des bords nets et une ombre courte.' }
					],
					ecart: 'Le bouton « Contunhar » du parcours (rouge à coins de 6 px) et le lien btn-primary de la page de module n’ont pas encore la pièce de papier. Les formulaires gardent leurs champs inchangés.'
				}
			),
			R(
				'bouton-secondaire',
				'Bouton secondaire',
				'Une action moins importante, à côté d’un bouton principal.',
				'Une pièce « carton » (.pc-2) : crème #efe1c6 à texte brun en sombre, sarcelle #1f5f63 à texte crème en clair. Elle sert à Menú, au compte, à Òc / Fr, à « Non », au retour et à « remonter ».',
				'Romain, 07-11 ; papier.css ; app.css ; AppHeader.svelte',
				{ avis: 'La sarcelle du thème clair est ce que la session palette-couleurs réexamine.' }
			),
			R(
				'bouton-lien',
				'Lien dans le texte',
				'Comment se reconnaît un lien.',
				'Texte souligné avec le rouge du logo (jamais la couleur seule).',
				'Romain, 23-10 (règle B) ; app.css'
			),
			P(
				'bouton-danger',
				'Action délicate : supprimer, quitter',
				'Un bouton dont l’effet est difficile à défaire, et la confirmation qui va avec.',
				'Pas de style dédié. Sur le compte : le lien souligné « Suprimir mon compte », puis « Segur ? » avec deux pièces (« Òc, suprimir » au rouge ordinaire, « Non » en carton). Groupes et idées : la fenêtre native confirm() du navigateur.',
				['src/routes/compte/+page.svelte:558-577', 'src/routes/grops/[id]/+page.svelte:361,414', 'src/routes/ideas/+page.svelte:150']
			),
			R(
				'bouton-icone',
				'Bouton avec une icône seule',
				'Les petits boutons sans texte : fermer, écouter, réglages.',
				'Icônes Iconoir, trait 1,7, via le composant Icona (26 tracés aujourd’hui, dont 13 d’Iconoir, dans 37 fichiers), avec un nom lisible pour les lecteurs d’écran.',
				'Romain, 12-10 ; charte §5sexies',
				{ ecart: 'Quelques boutons-icônes ont encore leur propre dessin, au trait de 1,5 à 1,8 : le soleil de l’ambiance, « remonter », le haut-parleur de module.' }
			),
			R(
				'bouton-reponse-jeu',
				'Bouton de réponse dans un jeu',
				'Les tuiles sur lesquelles on appuie pour jouer.',
				'Allure « Teula », palette crème.',
				'Romain, 05-11 (« A, crème »), page /apren/jocs'
			),
			P(
				'bouton-continuer',
				'Bouton « Continuer » d’une leçon',
				'Le bouton qui fait avancer d’un écran de leçon à l’autre.',
				'« Acabada » apparaît sous les exercices une fois tous faits : centré, pièce rouge en Limelight 1,05 rem, pas collé en bas. Sur le parcours, « Contunhar » est un grand bloc rouge à coins de 6 px, hors papier.',
				['src/routes/aprene/modul/[modulId]/+page.svelte:400-411,789-797', 'src/lib/parcors/ParcorsPagina.svelte:378-386'],
				{
					inspirations: [
						{ source: BUSUU, note: 'Toujours au même endroit, en bas, très large et arrondi. Sa couleur change selon l’état : bleu pour continuer, vert quand la réponse est juste.' }
					]
				}
			),
			P(
				'interrupteurs',
				'Interrupteurs et cases à cocher',
				'Les réglages qui s’allument et s’éteignent (sons, version légère).',
				'Trois interrupteurs différents : une pastille de 34 × 20 px (panneau Ambiance, bleu ou or), une piste de papier à poignée carrée (rail de la carte, or), une pastille à bordure (réglages des jeux) ; cases à cocher natives ailleurs.',
				['src/lib/components/AmbiancaPanel.svelte:306-346', 'src/lib/components/RailJaces.svelte:2424', 'src/lib/jocs/Reglatges.svelte:46,149']
			),
			R(
				'etats-boutons',
				'États d’un bouton : survol, appui, focus, inactif',
				'À quoi ressemble un bouton quand on le survole, qu’on appuie, qu’on y arrive au clavier, ou qu’il est inactif.',
				'Survol : la pièce se soulève d’un pixel, l’ombre s’allonge. Appui : elle descend de 2 px. Clavier : anneau doré de 3 px décalé de 3 px. Inactif : opacité 0,5. Le mouvement réduit et le contraste forcé sont gérés.',
				'Romain, 06-11 (reprise du papier découpé) ; papier.css'
			),
			R(
				'cible-tactile',
				'Taille d’une cible tactile',
				'La taille minimale de tout ce qui se touche.',
				'24 × 24 px au moins, 44 px visés sur téléphone.',
				'Charte §5octies (ACC-02, WCAG 2.2)'
			)
		]
	},
	{
		id: 'formulaires',
		titre: 'Formulaires et saisie',
		intro: 'Connexion, inscription, contact, recherche.',
		choix: [
			P(
				'champ-texte',
				'Champ de texte',
				'L’allure d’un champ à remplir : bordure, étiquette, texte d’aide.',
				'Formulaires : étiquette grasse au-dessus, champ de 44 px au moins, bordure de 1 px, coins de 6 px, fond du thème. Recherche de la carte : pilule à bordure fine avec une loupe.',
				['src/routes/compte/+page.svelte:636-655', 'src/lib/components/CercaCarta.svelte:244-258'],
				{ inspirations: [{ source: FOURCHE, note: 'Champ de recherche en pilule à bordure fine, une loupe à gauche, texte d’aide en gris.' }] }
			),
			P(
				'messages-erreur',
				'Messages d’erreur et d’aide',
				'Comment on dit à quelqu’un qu’il s’est trompé, sans le brusquer ni compter sur la couleur seule.',
				'Message en gras, role="alert", placé au-dessus du bouton d’envoi, avec un filet doré de 4 px à gauche et sans icône. Le message de succès a une coche (icône « valide »).',
				['src/routes/compte/+page.svelte:489,699-710', 'src/routes/compte/mot-de-pas/+page.svelte:237'],
				{ avis: 'Ce filet doré à gauche contredit la règle des traits fins (voir « Traits et filets »).' }
			),
			P(
				'selecteurs',
				'Menus et sélecteurs',
				'Le choix d’une langue, d’un niveau, d’une date : liste déroulante ou choix visibles.',
				'Les trois coexistent : <select> natifs (questionnaire, profil de groupe), choix visibles en pièces « pc-chip » (filtres de la salle de jeux, rail de la carte), bascule Òc / Fr plus panneau du globe pour les autres langues.',
				['src/routes/compte/questionnaire/+page.svelte:237,251', 'src/lib/jocs/sala/Sala.svelte:45', 'src/lib/components/AppHeader.svelte:150-181']
			)
		]
	},
	{
		id: 'navigation',
		titre: 'Navigation et structure',
		intro: 'Les barres, les menus, le plan du site.',
		choix: [
			R(
				'plan-site',
				'Plan du site',
				'Les grandes entrées du site.',
				'« Se parla. S’apren. Amassa. », dans cet ordre ; le site s’ouvre en occitan, avec la bascule Òc / Fr bien visible.',
				'Romain, 22-10 ; PILOTATGE §5'
			),
			R(
				'navigation-principe',
				'Principe de navigation',
				'La règle qui guide toute la navigation.',
				'Un clic ailleurs, jamais deux clics. On ne retire jamais une fonction. Une maquette habille le vrai composant.',
				'Retours de Romain'
			),
			P(
				'barre-haut',
				'Barre du haut',
				'Les contrôles toujours visibles en haut : profil, thème, langues, menu.',
				'Sur grand écran : 7 contrôles quand on est déconnecté (Reservar un cors en rouge, Se connectar, thème, Òc, deuxième langue, globe, Menú), 7 connecté (« Mon compte » avec avatar), 8 administrateur (avec l’engrenage). Sous 44 rem, « Reservar » disparaît. Le logo-lien s’y ajoute.',
				['src/lib/components/AppHeader.svelte:119-194', 'src/lib/components/AppHeader.svelte:455-461'],
				{ avis: 'Jusqu’à huit contrôles en haut. À grouper et à hiérarchiser : les langues et le globe vont ensemble.' }
			),
			E('barre-bas', 'Barre du bas sur téléphone', 'Une barre à cinq onglets avec un libellé, à portée du pouce.', {
				aujourdhui: RIEN(
					'Aucune barre à onglets. Seuls éléments fixes en bas : le bouton rond « remonter en haut » (carton, 46 px) et les commandes propres à la carte. Le menu en voile tient lieu de navigation.',
					['src/lib/components/TornarAmont.svelte:27-60', 'src/routes/apren/jocs/+page.svelte:61,121']
				),
				inspirations: [
					{ source: BUSUU, note: 'Cinq onglets (Apprendre, Réviser, classement, communauté, Profil) : icône grise, l’onglet actif en bleu avec son libellé.' },
					{ source: FOURCHE, note: 'Cinq onglets dessinés à la main avec un libellé en dessous ; l’onglet actif en noir.' }
				]
			}),
			P(
				'menu-page',
				'Menu',
				'La façon dont s’ouvre le menu du site : rangement, ordre, ton.',
				'Pas une page : un panneau « menu-voile » qui glisse depuis la droite, fond brique #b53d17, texte crème, trois rubriques en accordéon (Se parla, S’apren, Amassa), puis une liste « Lo Ligam » et le bouton de réservation.',
				['src/lib/components/MenuVel.svelte:1-12,102,181-206']
			),
			P(
				'pied-page',
				'Pied de page',
				'Ce qui reste en bas de chaque page : mentions, accessibilité, contact.',
				'Cinq colonnes (01 Se parla, 02 S’apren, 03 Amassa, Lo Ligam, Ressorsas), le grand nom « Lo Ligam » en terracotta, puis la ligne légale (©, mentions légales, confidentialité, accessibilité). Le contact est dans la colonne Lo Ligam.',
				['src/lib/components/SiteFooter.svelte:31-86,170', 'src/lib/data/planSite.js:77-79']
			)
		]
	},
	{
		id: 'tuiles',
		titre: 'Tuiles, listes et cartes',
		intro: 'Comment une rubrique, une liste ou un contenu se présente.',
		choix: [
			P(
				'tuiles-rubriques',
				'Tuiles de rubrique (S’apren)',
				'Les grandes tuiles qui ouvrent les rubriques : taille, couleur, picto, titre.',
				'8 tuiles : la première en 2 × 2, les autres carrées, les dernières en demi-bandeaux ; une palette de 6 couleurs qui reviennent ; des pictos dessinés maison au trait ; des titres en capitales Limelight de 1,25 à 1,6 rem ; coins de 6 px.',
				['src/lib/apren/PaginaTeulas.svelte:150-237', 'src/lib/apren/teulas.js:14-22', 'src/lib/data/elements-filet.json:167-189'],
				{
					avis: 'Ce qui fait « modèle générique » : six couleurs qui reviennent et des titres en capitales Limelight en petit (ce dernier point contredit la règle « Limelight pour les gros titres seulement »). Il existe déjà un essai des couleurs de ces tuiles sur /apren?ensag=colors.'
				}
			),
			P(
				'listes',
				'Listes à lire (menu, réglages, résultats)',
				'Une liste de lignes qui mènent chacune quelque part.',
				'Lignes à bordure de 1 px, coins de 6 px et chevron « suivant » à droite (page Compte) ; liens du menu et du pied avec chevron ; aucune petite illustration à gauche.',
				['src/routes/compte/+page.svelte:525-527,748-770', 'src/lib/components/MenuVel.svelte:120-135'],
				{
					inspirations: [
						{ source: FOURCHE, note: 'Filets fins entre les lignes, une petite illustration colorée à gauche, un chevron à droite, un seul trait de séparation.' }
					]
				}
			),
			R(
				'cartes-photo',
				'Photo dans une carte',
				'Comment une photo s’intègre à un contenu.',
				'Le langage média du site : panneau arrondi, photo en cover. À Cultura : la photo est grisée puis teintée de la couleur du thème, vraies couleurs au survol (allure B du 06-11). Pas de cadre bricolé (liseré, arc, vignette).',
				'Romain, 25-10 et 06-11 ; acuelh.css ; cultura/+page.svelte',
				{ ecart: 'Une classe « liseré » (double anneau) reste dans le CSS sans aucun usage : du code mort.' }
			),
			E('bandeaux', 'Bandeau d’annonce', 'Un encart qui met en avant une information ou une offre.', {
				aujourdhui: RIEN(
					'Aucun encart d’annonce. Le seul « bandeau » est le défilé de phrases (bandèl) de l’accueil, et il y a des notes de texte (.nota) sans fond particulier.',
					['src/routes/+page.svelte:116-120', 'src/lib/parcors/ParcorsPagina.svelte:164']
				),
				inspirations: [
					{ source: FOURCHE, note: 'Un seul bandeau jaune pâle, une petite illustration, une phrase courte, un chevron. Chaleureux, sans dégradé.' },
					{ source: BUSUU, note: 'À ne pas reprendre : les bandeaux promotionnels (abonnement, soldes) en tête de chaque écran.' }
				]
			})
		]
	},
	{
		id: 'icones',
		titre: 'Icônes, dessins et images',
		intro: 'Pictogrammes, illustrations, photographies.',
		choix: [
			R(
				'icones-pratiques',
				'Icônes pratiques',
				'Fermer, suivant, écouter, réglages, valider…',
				'Iconoir, trait 1,7, un seul composant Icona (26 tracés aujourd’hui). Plus de caractères ni d’émojis pour les boutons.',
				'Romain, 12-10 ; charte §5sexies',
				{
					ecartes: [{ titol: 'Phosphor', raison: 'Comparée à Iconoir sur la planche /ensag/icones, non retenue (12-10).' }],
					essais: [essai('/ensag/icones', 'Planche comparée (adoptée)')]
				}
			),
			R(
				'icones-identite',
				'Icônes d’identité',
				'Croix, plume, livre, communauté…',
				'Dessinées maison, au même trait que les icônes pratiques.',
				'Charte §5ter et §5sexies'
			),
			R(
				'alphabet-icones',
				'Alphabet dans les icônes',
				'Comment figurer les langues ou le bilinguisme dans une icône.',
				'Jamais d’écriture non latine (A/文) ; alphabet latin seulement.',
				'Retour de Romain'
			),
			P(
				'pictos-tuiles',
				'Pictogrammes des tuiles',
				'Le dessin qui accompagne chaque tuile de rubrique.',
				'23 pictogrammes dessinés maison, au trait (viewBox 48, trait 2,2), dans la couleur du texte de la tuile. Ce ne sont pas des icônes standards, mais ils n’ont ni touche d’aplat ni irrégularité « à la main ».',
				['src/lib/apren/Pictograma.svelte:1-26', 'src/lib/apren/PaginaTeulas.svelte:66', 'src/lib/apren/teulas.js:78-114'],
				{
					inspirations: [
						{ source: FOURCHE, note: 'Dessin au trait noir avec une touche d’aplat (jaune ou bleu), irrégulier comme à la main : icônes de la barre du bas, personnage de la page Compte.' }
					]
				}
			),
			R(
				'illustrations-jeux',
				'Illustrations des familles de jeux',
				'Le style des illustrations de la salle de jeux.',
				'Le style B « papier découpé » : cinq dessins, un par famille, sur la couleur de la famille, animés dans Joiós, avec un petit rond « IA ».',
				'Romain, 06-11 ; jocs/sala/Illustracion.svelte ; cahier §11',
				{
					ecartes: [{ titol: 'Les deux autres manières de l’essai', raison: 'Non retenues (06-11).' }]
				}
			),
			P(
				'dessins-remira',
				'Dessins de Remira (poussière d’or)',
				'Garder, refaire ou retirer chaque dessin.',
				'Un dessin au trait par mot de Remira (dessenhs.js), affichés dans la poussière d’or, à Cultura et dans les animations. Le tri « garder ou refaire » se fait déjà carte par carte dans /admin/triar (lot « dessenhs »).',
				['src/lib/plueja/dessenhs.js:1-15', 'src/lib/triar/lots.js:56', 'src/lib/plueja/Polsa.svelte:20']
			),
			R(
				'photos',
				'Photographies',
				'Quelles images illustrent le site.',
				'Le système « sang e aur » : vraies photos, sans images fabriquées par IA ; poids cibles stricts (sobriété).',
				'Romain, 30-08 ; charte §3bis'
			),
			R(
				'mention-ia',
				'Mention d’une illustration faite par IA',
				'Signaler sans bruit une illustration générée.',
				'Le composant MencionIA en trois formes : signature (illustration seule, Remira), petit rond « IA » (salle de jeux), ligne (Cultura), toutes liées à la page /illustracions.',
				'Romain, 06-11 (« signature et ligne ») ; MencionIA.svelte ; cahier §11',
				{
					ecart: 'La cagnotte annoncée pour engager un illustrateur ou une illustratrice n’est pas encore ouverte (service de paiement non tranché).'
				}
			)
		]
	},
	{
		id: 'mouvement',
		titre: 'Mouvement, sons et récompenses',
		intro: 'Ce qui bouge, ce qui sonne, ce qui récompense.',
		choix: [
			R(
				'animations-texte',
				'Animations de texte',
				'Comment un texte apparaît.',
				'Onze effets d’entrée (animarText.js), sobres : une seule animation de texte à la fois, moins d’une seconde, jamais sur un texte long. Déjà utilisés dans les leçons.',
				'Romain, 11-10 ; charte §5quinquies',
				{ essais: [essai('/ensag/letra', 'Banc des onze effets (adopté)')] }
			),
			P(
				'recompenses',
				'Récompenses animées',
				'Ce qui s’anime quand on réussit : quel dessin, quelle durée.',
				'Aucune animation Lottie sur le site. La récompense réelle : une fougasse vole vers le compteur « fogaças » à chaque bonne réponse, et « Modul acabat, òsca ! » s’affiche en fin de module.',
				['src/routes/aprene/modul/[modulId]/+page.svelte:190-225,277,337', 'package.json:37 (lottie-web, seul usage : l’essai)'],
				{
					avis: 'La bibliothèque lottie-web est dans les dépendances du site uniquement pour l’essai du 12-10 : si on garde la fougasse, on peut retirer la dépendance et l’essai.'
				}
			),
			R(
				'profondeur-photo',
				'Profondeur d’une photo',
				'Un mouvement discret qui fait avancer les plans d’une photo restée entière.',
				'Adoptée comme option « Relèu » de Remira › Paisatges : la photo entière, déformée par une carte de profondeur (WebGL), décalage de 1,2 % au plus, éteinte par défaut ; validée photo par photo dans Triar (138 photos sur 139).',
				'Romain, 06-11 ; paisatges/releu.js ; cahier §11',
				{
					ecartes: [{ titol: 'Photo découpée en quatre plans', raison: 'Jugée « moche » ; Romain veut « naturel et discret » (06-11).' }]
				}
			),
			R(
				'version-legere',
				'Version légère et mouvement réduit',
				'Que devient une animation pour qui préfère le calme.',
				'Toute nouvelle animation prévoit sa version légère (immobile, ou un fondu court) ; le réglage du système (prefers-reduced-motion) est toujours respecté.',
				'Romain, 14-10 ; charte §5septies'
			),
			R('sons', 'Sons', 'La place du son dans l’interface.', 'Sons discrets et désactivables.', 'Cadre du projet (CLAUDE.md)'),
			E('transitions-pages', 'Transitions entre les pages', 'Comment on passe d’une page à l’autre : fondu, glissement, rien.', {
				aujourdhui: RIEN(
					'Aucune transition globale entre les pages. Seulement deux transitions de vue locales : la vignette de thème de Mots vers le carrousel, et le changement de langue d’une fiche de commune.',
					['src/app.css:269-331', 'src/routes/mots/+page.svelte:215-221', 'src/lib/components/FichaComuna.svelte:301-320']
				)
			})
		]
	},
	{
		id: 'apprentissage',
		titre: 'Apprentissage et jeux',
		intro: 'Les écrans de leçon, le retour sur une réponse, la progression.',
		choix: [
			P(
				'ecran-lecon',
				'Écran de leçon',
				'Combien de choses par écran, quelle mise en page, où sont les actions.',
				'Une page qui défile : barre en haut (Acuèlh, Somari, compteur de fogaças, son), titre « Étape x/n », puis plusieurs exercices dévoilés un à un dans des cartes de 20 px. Pas de croix de sortie ni de barre fine en haut.',
				['src/routes/aprene/modul/[modulId]/+page.svelte:263-290,361-411', 'src/lib/lesson/QcmBlock.svelte:80-90'],
				{
					inspirations: [
						{
							source: BUSUU,
							note: 'Une seule idée par écran (« Voici un conseil ! »), beaucoup de blanc, une seule couleur d’action, une barre de progression fine en haut avec la croix pour quitter.'
						}
					],
					avis: 'Piste « leçons aérées » : un seul geste attendu par écran, le bouton d’action toujours au même endroit.'
				}
			),
			P(
				'retour-exercice',
				'Retour sur une réponse',
				'Ce qui se passe quand on répond : le panneau, le message, l’explication.',
				'Le retour est dans la carte de l’exercice, sans panneau : la bonne pièce passe à l’or, les erreurs sont barrées, un « ✓ » et une explication d’une ligne en vert, une secousse de 260 ms ; l’exercice suivant se dévoile.',
				['src/lib/lesson/QcmBlock.svelte:75,187-216'],
				{
					inspirations: [
						{ source: BUSUU, note: 'Un panneau blanc monte du bas : coche verte, « Correct », la réponse avec sa traduction, une phrase d’explication, puis le bouton « Continuer ».' }
					]
				}
			),
			P(
				'progression-lecon',
				'Progression dans une leçon',
				'Comment on voit qu’on avance dans une leçon.',
				'Pas de barre fine en haut. Un compteur « n/N » par exercice, « Étape x/n » dans l’en-tête, le compteur de fogaças ; le parcours /aprene a une vraie barre de progression et « N modules sur M ».',
				['src/lib/lesson/QcmBlock.svelte:51-54', 'src/routes/aprene/modul/[modulId]/+page.svelte:277,361', 'src/lib/parcors/ParcorsPagina.svelte:124-134'],
				{ inspirations: [{ source: BUSUU, note: 'Barre fine en haut, bleue sur gris clair, sans pourcentage.' }] }
			),
			E('jauges', 'Jauges de maîtrise', 'Montrer ce qui est à travailler, à revoir, acquis.', {
				aujourdhui: RIEN(
					'Aucune jauge de maîtrise. Le carnet de révision est un tableau de contrôle en texte (fermée, pas vue, en cours, acquise) ; la seule barre est la progression du parcours /aprene.',
					['src/routes/aprene/carnet/+page.svelte:19,66-110', 'src/lib/parcors/ParcorsPagina.svelte:124-134']
				),
				inspirations: [
					{
						source: BUSUU,
						note: 'Trois cartes (À travailler en rouge, À revoir en jaune, Acquis en vert hachuré) qui se remplissent en hauteur ; un gros pourcentage dans un arc de cercle.'
					}
				],
				avis: 'Piste « jauges qui se remplissent », dans ton esprit « satisfaisant » : un remplissage plein, à ras bord, sans jour.'
			}),
			P(
				'parcours-unites',
				'Parcours des unités',
				'La liste des unités et des leçons, et l’état de chacune.',
				'« Lo camin » : un plateau de jeu de l’oie, un module par case, en rangées de quatre aux couleurs de la palette, un chemin en serpentin (or là où l’on est passé, en pointillé ensuite), des haltes, une mission ; l’unité du jour est dépliée.',
				['src/lib/parcors/CaminAuca.svelte:1-12', 'src/lib/parcors/ParcorsPagina.svelte:1-10', 'commit 7f468b5e'],
				{
					inspirations: [
						{ source: BUSUU, note: 'Vignettes rondes avec une vraie photo, un anneau vert et une coche pour une leçon finie, reliées par un trait vertical ; « 4/4 leçons terminées ».' }
					]
				}
			),
			R(
				'allure-jeux',
				'Allure des jeux',
				'L’apparence des jeux de la salle.',
				'Allure « Teula », palette crème ; une rubrique de S’apren (/apren/jocs).',
				'Romain, 05-11 (« A, crème »)'
			),
			R(
				'scene-unite',
				'Scène d’une unité',
				'Un grand visuel où chaque objet se touche, vient à la lumière et montre son nom.',
				'Le révélateur « Lumière avec pastilles » : un visuel en grand, chaque chose à découvrir se touche et son nom apparaît ; la scène complète ouvre l’unité suivante.',
				'Romain, 15-10 et 20-10 ; anem/ScenaTocar.svelte ; cahier §11',
				{
					ecart: 'Porté seulement dans Anem ! (3 à 6 ans). Les leçons n’ont pas de scène : le module 7.1 note « à brancher ». L’essai reste la seule démo pour les unités.',
					essais: [essai('/ensag/scena', 'Banc de la scène (encore utile)')]
				}
			),
			R(
				'gamification',
				'Gamification',
				'Quelle part de jeu dans l’apprentissage.',
				'Une récompense douce, sans classement.',
				'Romain, 29-08 ; PILOTATGE §5'
			)
		]
	},
	{
		id: 'compte',
		titre: 'Compte et parcours',
		intro: 'Se connecter, s’inscrire, son profil, soutenir le site.',
		choix: [
			P(
				'connexion',
				'Connexion et inscription',
				'L’écran et le geste pour se connecter, y compris l’effet qui accompagne l’arrivée.',
				'Un écran unique /compte : courriel et mot de passe, bascule entre connexion, inscription et mot de passe oublié ; retour à la page d’origine. Ni fenêtre superposée ni effet de la croix (la croix n’est pas utilisée sur cette page).',
				['src/routes/compte/+page.svelte:462-515', 'src/lib/components/AppHeader.svelte:108']
			),
			P(
				'premier-passage',
				'Premier passage',
				'Ce que voit quelqu’un qui arrive pour la première fois.',
				'Aucun écran de bienvenue : le bouton Òc / Fr est mis en avant 7 secondes, une seule fois ; /carta a une liste de premiers pas. Le choix de la version légère au premier passage (charte §5septies) n’est pas codé : il n’existe que dans le panneau Ambiance.',
				['src/lib/components/AppHeader.svelte:29-45', 'src/routes/carta/+page.svelte:79,481', 'src/lib/stores/ambianca.svelte.js:56'],
				{ avis: 'Un composant WelcomeDialog.svelte existe mais n’est importé nulle part : du code mort, à reprendre ou à retirer.' }
			),
			P(
				'profil',
				'Profil',
				'La page personnelle : photo, progrès, amis.',
				'/compte : un rond à initiale (Limelight), le pseudo, le courriel, des liens (parcours, profil de groupe), mot de passe, déconnexion, suppression. Le profil de groupe : avatar de 4 à 5 rem et des sections. Ni arc de pourcentage, ni onglets, ni amis.',
				['src/routes/compte/+page.svelte:508-530', 'src/lib/grops/Avatar.svelte:1-30', 'src/routes/grops/perfil/[pseudo]/+page.svelte:272'],
				{
					inspirations: [
						{ source: BUSUU, note: 'Avatar rond, amis en petits cercles, trois onglets en majuscules soulignés en bleu, un gros pourcentage au centre d’un arc.' }
					]
				}
			),
			E('soutien', 'Don et modèle gradué', 'Comment on soutient le site : libre, don, solidaire.', {
				aujourdhui: RIEN(
					'Aucune page de don ni de modèle gradué. Seule la page /illustracions explique la mention IA et annonce une cagnotte pas encore ouverte (service de paiement non tranché).',
					['src/routes/illustracions/+page.svelte:1-14', 'cahier-des-charges.md §11 (552-553)']
				),
				avis: 'Le modèle payant est en cours d’arbitrage (cahier §3, §6, §11) : à trancher avant de dessiner l’écran.'
			})
		]
	},
	{
		id: 'pages',
		titre: 'Pages et espaces',
		intro: 'Les pages entières et les espaces particuliers.',
		choix: [
			R(
				'accueil',
				'Accueil',
				'Par quoi le site s’ouvre.',
				'La carte en étoiles ; le plan « Se parla. S’apren. Amassa. » ; le premier public est le curieux.',
				'Romain, 22-10 ; PILOTATGE §5'
			),
			A(
				'ambiances-accueil',
				'Pistes d’ambiance pour l’accueil',
				'Trois pages d’essai : une page presque blanche, une refonte claire, « les trois mondes ».',
				'Tranché le 22-10 : l’accueil s’ouvre sur la carte en étoiles issue de l’essai « page presque blanche » (« Oui, la carte version allégée »), et le Plâtre de la refonte claire est devenu le thème clair. « Les trois mondes » (25-10) n’a jamais eu de suite : jamais tranché, rien ne le lie.',
				{
					essais: [
						essai('/ensag/blanc', 'Page presque blanche (adoptée en partie)'),
						essai('/ensag/mondes', 'Les trois mondes (sans suite, à confirmer)')
					]
				}
			),
			R(
				'style-carte',
				'Style de la carte',
				'Le ton visuel de la carte.',
				'Sobre, lisible d’abord, une seule touche thématique discrète, panneaux translucides.',
				'Romain, 10-10 (portulan orné rejeté)',
				{ ecartes: [{ titol: 'Portulan orné', raison: 'Rejeté le 10-10 : kitsch.' }] }
			),
			R(
				'remira',
				'Page de calme',
				'Une page où l’on se pose.',
				'« Remira », la poussière d’or, rubrique de S’apren.',
				'Romain, 05-11 (« je préfère Remira »)',
				{ ecartes: [{ titol: 'Le nom d’essai « plueja »', raison: 'Devenue Remira ; l’ancienne adresse redirige.' }] }
			),
			R(
				'espace-musique',
				'Espace musique',
				'La table du café vue d’en haut : on entre après accord, rien de Deezer ne se charge avant.',
				'Version 2 « table du café », en ligne ; la tuile « Musica » d’Òbras y mène et la liste se trie dans /admin/musica.',
				'Romain, 25-10 ; cahier §11 ; PILOTATGE',
				{
					ecart: 'La page vit encore à l’adresse d’essai /ensag/musica : il faudrait la déplacer vers une adresse de rubrique avant de retirer le dossier des essais.',
					essais: [essai('/ensag/musica', 'Espace musique (en ligne à l’adresse d’essai)')]
				}
			),
			C(
				'documents-occitanica',
				'Documents d’Occitanica dans Cultura',
				'Valoriser les documents libres retenus : vignette légère, titre, auteur, date, source, lien vers la fiche d’origine.',
				[essai('/ensag/occitanica', 'Documents d’Occitanica')],
				{ avis: 'Toujours un essai caché : 27 vignettes, rien ne l’importe dans la page Cultura (lib/cultura/occitanica.js n’est utilisé que par l’essai).' }
			)
		]
	},
	{
		id: 'ton',
		titre: 'Ton, langue et accessibilité',
		intro: 'La façon de parler, et ce qui rend le site utilisable par tous.',
		choix: [
			R('tutoiement', 'Tutoiement', 'Tu ou vous.', 'Le site dit « tu » partout.', 'Romain, 22-10'),
			R(
				'ecriture-inclusive',
				'Écriture inclusive',
				'Comment le site s’adresse à tout le monde.',
				'Écriture inclusive.',
				'Valeurs du projet (CLAUDE.md)'
			),
			R(
				'texte-public',
				'Textes destinés au public',
				'Les règles d’écriture de tout ce qui est publié.',
				'Pas de tirets longs, pas de jargon anglais.',
				'Romain'
			),
			R(
				'humour-slogans',
				'Humour et slogans',
				'Le ton des petites phrases.',
				'Humour fin, par touches. Pas de slogans inventés.',
				'Romain, 25-10 (il a retiré « Tres mots uèi, una lenga deman »)'
			),
			R(
				'contraste',
				'Contraste des couleurs',
				'Le seuil de lisibilité à respecter.',
				'WCAG 2.2 AA : 4,5:1 pour le texte courant, 3:1 pour le grand texte, dans les deux thèmes ; à mesurer aussi sur les veines claires du fond animé.',
				'Charte §5octies (ACC-01)'
			)
		]
	}
];

// Les trois étages : on décide du bas vers le haut (la couleur avant le bouton, le
// bouton avant l'écran). Chaque famille appartient à un étage.
export const ETAGES = [
	{ id: 1, titre: 'Fondations', intro: 'L’identité : couleurs, polices, formes, images, règles. Tout le reste en dépend.' },
	{ id: 2, titre: 'Composants', intro: 'Les éléments d’interface : boutons, champs, barres, tuiles. Ils reprennent les fondations.' },
	{ id: 3, titre: 'Parcours et écrans', intro: 'Les écrans entiers : leçons, jeux, compte, pages. Ils assemblent les composants.' }
];
const ETAGE_DE = {
	couleurs: 1,
	typo: 1,
	miseenpage: 1,
	icones: 1,
	mouvement: 1,
	ton: 1,
	boutons: 2,
	formulaires: 2,
	navigation: 2,
	tuiles: 2,
	apprentissage: 3,
	compte: 3,
	pages: 3
};

// Chaque choix reçoit ses `options` et son ordre de décision (`apres`) de registre-options.js.
const complete = (c) => ({ apres: [], options: [], ...c, ...(COMPLEMENTS[c.clau] ?? {}) });
export const FAMILLES = FAMILLES_BRUT.map((f) => ({ ...f, etage: ETAGE_DE[f.id], choix: f.choix.map(complete) }));

/** Tous les choix, à plat, avec leur famille et leur étage. */
export const TOUS = FAMILLES.flatMap((f) => f.choix.map((c) => ({ ...c, famille: f.id, familleTitre: f.titre, etage: f.etage })));

const PAR_CLAU = new Map(TOUS.map((c) => [c.clau, c]));
export const choix = (clau) => PAR_CLAU.get(clau);

/** Les choix à trancher avant celui-ci et qui ne le sont pas encore (un choix archivé ne bloque plus). */
export const bloquants = (c) => c.apres.map((k) => PAR_CLAU.get(k)).filter((x) => x && OUVERTS.includes(x.statut));

/** Les choix ouverts qui dépendent de celui-ci, de près ou de loin. */
export function debloque(clau) {
	const vus = new Set();
	const pile = [clau];
	while (pile.length) {
		const k = pile.pop();
		for (const c of TOUS) {
			if (c.apres.includes(k) && !vus.has(c.clau)) {
				vus.add(c.clau);
				pile.push(c.clau);
			}
		}
	}
	return [...vus].map((k) => PAR_CLAU.get(k)).filter((c) => OUVERTS.includes(c.statut));
}

/** « À faire maintenant » : les choix ouverts qui ne sont plus bloqués, ceux qui en débloquent le plus d'abord. */
export function afaire() {
	return TOUS.map((c, i) => ({ c, i }))
		.filter(({ c }) => OUVERTS.includes(c.statut) && bloquants(c).length === 0)
		.map(({ c, i }) => ({ c, i, debloque: debloque(c.clau).length }))
		.sort((a, b) => b.debloque - a.debloque || a.c.etage - b.c.etage || a.i - b.i)
		.map(({ c, debloque: n }) => ({ c, debloque: n }));
}

/** Le décompte par état (tous les choix, ou la liste donnée). `total` ne compte pas les archivés. */
export function compter(liste = TOUS) {
	const n = { explorer: 0, enplace: 0, comparaison: 0, retenu: 0, archive: 0 };
	for (const c of liste) n[c.statut] += 1;
	return { ...n, total: liste.length - n.archive };
}
