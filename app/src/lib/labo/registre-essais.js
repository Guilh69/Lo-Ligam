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
	// Les deux pages gardées de la session « palette-couleurs » (07-11) : le diagnostic des couleurs avec l’outil
	// « Retoucher les couleurs » (lib/palette) et les modèles de pages.
	{
		chemin: '/ensag/palette-actuel',
		titre: 'Palette : le site d’aujourd’hui',
		date: '2026-11-07',
		choix: 'palette-claire',
		etat: 'actif',
		pret: 'non',
		raison: 'La référence des essais de palette du 07-11, avec le panneau « Retoucher les couleurs » qui mesure la cohérence ; encore utile pour juger une couleur avant de la poser.',
		suppression: 'Elle importe lib/palette (outil, pistes, composants d’essai) : à retirer avec palette-modeles, quand l’outil ne sert plus. Les sept autres pages palette-* ont été retirées le 13-11.'
	},
	{
		chemin: '/ensag/palette-modeles',
		titre: 'Palette : modèles de pages, base mêlée',
		date: '2026-11-07',
		choix: 'palette-claire',
		etat: 'actif',
		pret: 'non',
		raison: 'Accueil, S’apren, jeux, leçon et menu en modèles simplifiés dans la base mêlée choisie par Romain ; utile pour voir une couleur avant de la mettre sur le site.',
		suppression: 'Elle importe lib/palette (ModelesPages) : à retirer avec palette-actuel, quand l’outil ne sert plus.'
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
		chemin: '/ensag/carta-papier',
		titre: 'La carte en papier découpé (couche des dialectes)',
		date: '2026-11-08',
		choix: 'style-carte',
		etat: 'confirmer',
		pret: 'attendre',
		raison: 'Essai du 08-11 (quatre modes de coutures et un fondu de couleur entre parlers) : aucune mention dans le cahier ni dans PILOTATGE, la vraie carte n’a pas été changée.',
		suppression: 'À supprimer avec lib/carta/papier.js (seule cette page l’importe) si la piste est abandonnée.'
	},
	{
		chemin: '/ensag/motius-simbols',
		titre: 'Motifs-symboles qui se posent au défilement',
		date: '2026-11-12',
		choix: 'accueil',
		etat: 'actif',
		pret: 'non',
		raison: 'PILOTATGE 35 : refait le soir du 12-11 après un « non, fais mieux » (neuf tuiles de papier découpé, un territoire chacune) ; Romain regarde.',
		suppression: 'Rien ne l’importe ; elle n’utilise que des composants et styles partagés (AppHeader, Crotz, papier.css, palette.js).'
	}
	// Les trois essais du 12-11 (/ensag/barra, /ensag/confetis, /ensag/fenestra) ont été tranchés le jour même
	// par Romain (barre « selon la page », confettis raffinés, fenêtre d'origine gardée et retouchée) : pages retirées.
	// Neuf pages retirées le 13-11 (Romain : « Oui, retire-les », Per tu #158) : papier-couleurs, papier-couleurs-clair, clar
	// (ses deux images static/ensag/clar restent : « Page presque blanche » s’en sert), palette-brique, palette-jaune,
	// palette-accordee, palette-habillage, palette-bandeaux et pieces-defilement. Tout reste dans l’historique de Git.
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
