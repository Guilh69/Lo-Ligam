// Les pages d'essai du site : lesquelles garder, lesquelles retirer (audit du code du
// 07-11, avec preuves). Romain veut « archiver et supprimer ce qui n'est plus d'actualité » :
// cette liste dit, pour chaque page, si elle est encore utile et si on peut la supprimer
// sans casser quoi que ce soit. Rien n'est supprimé sans son « oui » ; tout reste dans Git.
//
// etat : 'actif'     = encore en cours ou encore utile ;
//        'adopte'    = adopté, la page d'essai n'a plus de raison d'être ;
//        'obsolete'  = remplacé ou périmé ;
//        'confirmer' = jamais tranché, à confirmer avec Romain.
// pret : 'oui'      = on peut supprimer la page maintenant sans rien casser ;
//        'attendre' = supprimable, mais pas encore (voir `suppression`) ;
//        'non'      = à garder pour l'instant.
// `dependances` : ce qui devient orphelin quand on supprime la page (à supprimer avec elle).

export const ESSAIS = [
	{
		chemin: '/ensag/papier-botons',
		titre: 'Boutons en papier découpé',
		date: '2026-11-07',
		choix: 'bouton-principal',
		etat: 'adopte',
		pret: 'oui',
		raison: 'Adopté : le style est dans papier.css, importé par app.css (commits 6ee21f9b, fbaf9b21).',
		suppression: 'Rien ne l’importe. Elle importe Icona, illustracions-jocs/Illustracion.svelte et le catalogue des jeux : à retirer avec « Illustrations des jeux ».'
	},
	{
		chemin: '/ensag/illustracions-jocs',
		titre: 'Illustrations des jeux',
		date: '2026-11-06',
		choix: 'illustrations-jeux',
		etat: 'adopte',
		pret: 'oui',
		raison: 'Le style B « papier découpé » est en place dans la salle de jeux (jocs/sala/Illustracion.svelte).',
		suppression: 'À retirer en même temps que « Boutons en papier découpé », qui importe son composant.'
	},
	{
		chemin: '/ensag/papier-couleurs',
		titre: 'Couleurs des pièces, thème sombre',
		date: '2026-11-07',
		choix: 'couleurs-pieces',
		etat: 'obsolete',
		pret: 'attendre',
		raison: 'Remplacé : le parti « terre cuite » a été adopté (341e9e0b) puis remplacé par la crème #efe1c6 (c24b9d46) ; le site n’a plus rien de cet essai.',
		suppression: 'Rien ne l’importe, mais la session « palette-couleurs » s’en sert peut-être de modèle : attendre qu’elle ait fini.'
	},
	{
		chemin: '/ensag/papier-couleurs-clair',
		titre: 'Couleurs des pièces, thème clair',
		date: '2026-11-07',
		choix: 'couleurs-pieces',
		etat: 'adopte',
		pret: 'attendre',
		raison: 'Adopté : le parti « sarcelle seule » est dans app.css (commit 1afee504).',
		suppression: 'Rien ne l’importe, mais la session « palette-couleurs » s’en sert peut-être de modèle : attendre qu’elle ait fini.'
	},
	{
		chemin: '/ensag/clar',
		titre: 'Refonte claire',
		date: '2026-10-21',
		choix: 'palette-claire',
		etat: 'adopte',
		pret: 'attendre',
		raison: 'Adopté le 21-10 : le Plâtre est le thème clair (app.css). La page montre l’ancien accueil.',
		suppression: 'La route ne sert plus, mais ses deux images (static/ensag/clar) sont utilisées par « Page presque blanche » : les garder. À retirer après la session « palette-couleurs ».'
	},
	{
		chemin: '/ensag/blanc',
		titre: 'Page presque blanche',
		date: '2026-10-22',
		choix: 'ambiances-accueil',
		etat: 'adopte',
		pret: 'non',
		raison: 'Adopté en partie : la carte en étoiles de l’accueil vient de cet essai (22-10).',
		suppression: 'Pas encore : l’accueil importe routes/ensag/blanc/donadas.js (MiegTres.svelte:15) et « Les trois mondes » aussi. Possible après avoir déplacé donadas.js dans lib/ et les trois images.'
	},
	{
		chemin: '/ensag/mondes',
		titre: 'Les trois mondes',
		date: '2026-10-25',
		choix: 'ambiances-accueil',
		etat: 'confirmer',
		pret: 'attendre',
		raison: 'Prototype du 25-10, jamais tranché : aucune mention dans le cahier ni dans PILOTATGE, et l’accueil a pris une autre direction.',
		suppression: 'Personne ne le lie ni ne l’importe. À supprimer si tu confirmes que cette piste est abandonnée.'
	},
	{
		chemin: '/ensag/icones',
		titre: 'Icônes pratiques',
		date: '2026-10-12',
		choix: 'icones-pratiques',
		etat: 'adopte',
		pret: 'oui',
		raison: 'Adopté le 12-10 : Iconoir via le composant Icona.',
		suppression: 'Rien ne l’importe ; la charte §5sexies la cite comme planche.'
	},
	{
		chemin: '/ensag/letra',
		titre: 'Animations de texte',
		date: '2026-10-23',
		choix: 'animations-texte',
		etat: 'adopte',
		pret: 'oui',
		raison: 'Adopté : animarText.js est utilisé par les leçons (CartaBlock, CartaTitol).',
		suppression: 'Rien ne l’importe ; la charte §5quinquies la cite comme banc. Elle peut rester comme démonstration des onze effets, si tu veux.'
	},
	{
		chemin: '/ensag/ia',
		titre: 'Mention IA',
		date: '2026-11-06',
		choix: 'mention-ia',
		etat: 'adopte',
		pret: 'oui',
		raison: 'Adopté : le composant MencionIA est posé à Remira, dans la salle de jeux et à Cultura.',
		suppression: 'Rien ne la lie. Afica.svelte, qui n’est plus importé que par cette page, devient du code mort.'
	},
	{
		chemin: '/ensag/dessenhs',
		titre: 'Dessins de Remira',
		date: '2026-11-06',
		choix: 'dessins-remira',
		etat: 'obsolete',
		pret: 'oui',
		raison: 'Remplacé : le tri se fait maintenant dans /admin/triar (lot « dessenhs »).',
		suppression: 'Aucun import ; seulement des commentaires dans dessenhs.js et PILOTATGE.'
	},
	{
		chemin: '/ensag/prigondor',
		titre: 'Profondeur',
		date: '2026-11-06',
		choix: 'profondeur-photo',
		etat: 'adopte',
		pret: 'oui',
		raison: 'Adopté sous une autre forme : le Relèu (Remira › Paisatges) en est la suite, validée photo par photo.',
		suppression: 'releu.js n’importe pas la page. Deux images (static/ensag/prigondor) et une mention dans outils/prigondor/carta.py deviennent orphelines.'
	},
	{
		chemin: '/ensag/scena',
		titre: 'La scène de l’unité',
		date: '2026-11-05',
		choix: 'scene-unite',
		etat: 'actif',
		pret: 'non',
		raison: 'La mécanique est portée dans Anem !, pas encore dans les leçons (module 7.1 : « à brancher »). L’essai reste la seule démo pour les unités.',
		suppression: 'Garder. Ses images (static/ensag/scena) servent aussi à « Page presque blanche ».'
	},
	{
		chemin: '/ensag/musica',
		titre: 'Espace musique',
		date: '2026-10-25',
		choix: 'espace-musique',
		etat: 'adopte',
		pret: 'non',
		raison: 'Validé et en ligne le 25-10, mais à l’adresse d’essai.',
		suppression: 'Ne pas supprimer : la tuile « Musica » d’Òbras y mène et /admin/musica alimente la liste. À déplacer vers une adresse de rubrique d’abord.'
	},
	{
		chemin: '/ensag/lottie',
		titre: 'Récompenses animées',
		date: '2026-10-12',
		choix: 'recompenses',
		etat: 'actif',
		pret: 'non',
		raison: 'Jamais tranché, jamais adopté : aucune animation Lottie sur le site (PILOTATGE : « choisir les récompenses des cours, plus tard »).',
		suppression: 'À toi de décider : garder les récompenses animées ou retirer l’essai. Si on retire, on peut aussi enlever la dépendance lottie-web (package.json) et les quatre fichiers JSON : un site plus léger.'
	},
	{
		chemin: '/ensag/occitanica',
		titre: 'Documents d’Occitanica',
		date: '2026-11-06',
		choix: 'documents-occitanica',
		etat: 'actif',
		pret: 'non',
		raison: 'Essai caché, pas encore intégré à Cultura.',
		suppression: 'Garder tant que la décision n’est pas prise (27 vignettes dans static/ensag/occitanica).'
	},
	// Les sept pages de la session « palette-couleurs » (07-11) : diagnostic des couleurs, outil
	// « Retoucher les couleurs » (lib/palette), pistes, modèles de pages, habillage, barre.
	{
		chemin: '/ensag/palette-actuel',
		titre: 'Palette : le site d’aujourd’hui',
		date: '2026-11-07',
		choix: 'palette-claire',
		etat: 'actif',
		pret: 'non',
		raison: 'La référence des essais de palette du 07-11, avec le panneau « Retoucher les couleurs » qui mesure la cohérence ; encore utile pour juger une couleur avant de la poser.',
		suppression: 'Elle importe lib/palette (outil, pistes, composants d’essai) : à retirer avec les six autres pages palette-*, quand l’outil ne sert plus.'
	},
	{
		chemin: '/ensag/palette-brique',
		titre: 'Palette 1 : brique seule',
		date: '2026-11-07',
		choix: 'palette-claire',
		etat: 'obsolete',
		pret: 'attendre',
		raison: 'Piste non retenue : Romain a choisi la base « mêlée » (rouge, ocre, vert, turquoise, brun) le 07-11.',
		suppression: 'Rien ne l’importe ; elle partage lib/palette avec les autres pages palette-*, à retirer ensemble.'
	},
	{
		chemin: '/ensag/palette-jaune',
		titre: 'Palette 2 : jaune',
		date: '2026-11-07',
		choix: 'palette-claire',
		etat: 'obsolete',
		pret: 'attendre',
		raison: 'Piste non retenue : Romain a choisi la base « mêlée » le 07-11 ; les jaunes moutarde ont été abandonnés.',
		suppression: 'Rien ne l’importe ; elle partage lib/palette avec les autres pages palette-*, à retirer ensemble.'
	},
	{
		chemin: '/ensag/palette-accordee',
		titre: 'Palette 3 : accordée',
		date: '2026-11-07',
		choix: 'palette-claire',
		etat: 'obsolete',
		pret: 'attendre',
		raison: 'Piste non retenue : Romain a choisi la base « mêlée » le 07-11.',
		suppression: 'Rien ne l’importe ; elle partage lib/palette avec les autres pages palette-*, à retirer ensemble.'
	},
	{
		chemin: '/ensag/palette-modeles',
		titre: 'Palette : modèles de pages, base mêlée',
		date: '2026-11-07',
		choix: 'palette-claire',
		etat: 'actif',
		pret: 'non',
		raison: 'Accueil, S’apren, jeux, leçon et menu en modèles simplifiés dans la base mêlée choisie par Romain ; utile pour voir une couleur avant de la mettre sur le site.',
		suppression: 'Elle importe lib/palette (ModelesPages) : à retirer avec les autres pages palette-*.'
	},
	{
		chemin: '/ensag/palette-habillage',
		titre: 'Palette : habiller un fond sobre',
		date: '2026-11-07',
		choix: 'palette-claire',
		etat: 'obsolete',
		pret: 'attendre',
		raison: 'Essai de photos, dessins et bandeaux sur un fond sobre ; photos mises de côté par Romain le 07-11 (une photo choisie à la couleur, pas au sujet de la case).',
		suppression: 'Rien ne l’importe ; elle partage lib/palette (HabillagePage) avec les autres pages palette-*.'
	},
	{
		chemin: '/ensag/flotants',
		titre: 'Flotteurs : confettis (adoptés) et objets à attraper (pour un jeu)',
		date: '2026-11-07',
		choix: 'ambiances-accueil',
		etat: 'actif',
		pret: 'non',
		raison: 'Tranché le 08-11 (Romain : « je préfère les confettis, on met ça dans le template ») : les confettis sont dans le gabarit racine, sur le fond clair de toutes les pages ordinaires, réglables dans le panneau d’ambiance. Les objets en papier découpé qu’on attrape pour voir le mot en occitan sont gardés pour un futur jeu : cette page reste le terrain d’essai du moteur et des objets.',
		suppression: 'À garder : Romain veut réutiliser les objets (lib/flotants/objets.js et le mode « objets ») pour un jeu. Les confettis du gabarit n’en dépendent pas (ils importent lib/flotants/moteur.js et Flotants.svelte, qui restent de toute façon).'
	},
	{
		chemin: '/ensag/palette-bandeaux',
		titre: 'Palette : quatre logiques de barre',
		date: '2026-11-07',
		choix: 'palette-claire',
		etat: 'adopte',
		pret: 'attendre',
		raison: 'Adopté : la logique « téléphone d’abord » est sur les vraies pages (barre du bas sur téléphone, trois verbes sur ordinateur, commit 158f9b05).',
		suppression: 'Rien ne l’importe ; elle partage lib/palette (BandeauxEssai) avec les autres pages palette-*.'
	}
];

// Essais cachés hors du dossier /ensag, trouvés par l'audit du 07-11 et jamais recensés :
// à vérifier avec Romain.
export const ESSAIS_CACHES = [
	{ chemin: '/cultura/ensag', quoi: 'Une page d’essai sous Cultura (l’allure B a été adoptée dans Cultura).' },
	{ chemin: '/apren?ensag=colors', quoi: 'Un essai des couleurs des tuiles de S’apren, qui s’ouvre par un paramètre d’adresse.' },
	{ chemin: '/carta?ensag=guida', quoi: 'Un essai du guide de la carte, qui s’ouvre par un paramètre d’adresse.' }
];

// Code mort repéré par l'audit du 07-11 (jamais utilisé), à supprimer avec l'accord de Romain.
export const CODE_MORT = [
	'WelcomeDialog.svelte : importé nulle part (l’écran de bienvenue n’est pas branché).',
	'La classe « liseré » du panneau média (acuelh.css) : aucun usage.',
	'Les classes .pc-vert, .est-bon et .est-faux de papier.css, et le jeton --pc-icone : définis, jamais utilisés.',
	'Afica.svelte hors de l’essai « Mention IA » : plus aucun usage ailleurs que dans les commentaires.',
	'Des commentaires de acuelh.css citent encore ?ensag=eros et ?ensag=separa, déjà retirés du code.',
	'La dépendance lottie-web : utilisée seulement par l’essai des récompenses animées.'
];
