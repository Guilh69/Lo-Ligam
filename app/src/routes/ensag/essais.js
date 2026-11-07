// Le banc d'essai : la liste de tous les essais du site, rangés par sujet
// (index créé le 2026-11-07, demande de Romain : « un système cohérent d'essai »).
// Pour en ajouter un : une ligne dans le bon groupe (chemin, titre, une phrase).
// Quand un essai est adopté et devient une vraie page, on le déplace dans ADOPTES.
// Les textes sont du français simple, sans jargon ; rien d'occitan ici.

export const GROUPES = [
	{
		id: 'boutons',
		titre: 'Boutons et couleurs',
		intro: 'Le papier découpé des illustrations de jeux, et ses couleurs.',
		essais: [
			{
				chemin: '/ensag/papier-botons',
				titre: 'Boutons en papier découpé',
				texte: 'Le papier découpé des illustrations de jeux appliqué à tous les boutons du site.'
			},
			{
				chemin: '/ensag/papier-couleurs',
				titre: 'Couleurs des pièces, thème sombre',
				texte: 'Le même petit écran en trois partis de couleurs, aux teintes des familles de jeux.'
			},
			{
				chemin: '/ensag/papier-couleurs-clair',
				titre: 'Couleurs des pièces, thème clair',
				texte: 'Les mêmes partis sur fond clair, avec des pièces vives comme les en-têtes de la page des jeux.'
			},
			{
				chemin: '/ensag/palette-actuel',
				titre: 'Palette : le site d’aujourd’hui',
				texte: 'La référence des essais de palette du 07-11, avec le panneau « Retoucher les couleurs » qui mesure la cohérence.'
			},
			{
				chemin: '/ensag/palette-habillage',
				titre: 'Palette : habiller un fond sobre',
				texte: 'Un seul écran en trois habillages, à activer séparément ou ensemble : bandeaux de photos, photos teintées dans les tuiles, dessins et pictogrammes ; avec la logique des couleurs.'
			},
			{
				chemin: '/ensag/palette-modeles',
				titre: 'Palette : modèles de pages, base mêlée',
				texte: 'Accueil, S’apren, jeux, leçon et menu en modèles simplifiés (ordinateur et téléphone, clair et sombre), avec le panneau pour retoucher les couleurs.'
			},
			{
				chemin: '/ensag/palette-brique',
				titre: 'Palette 1 : brique seule',
				texte: 'Fond presque blanc, une seule couleur vive, la brique du logo ; le « juste » en vert pâle.'
			},
			{
				chemin: '/ensag/palette-jaune',
				titre: 'Palette 2 : brique et jaune pâle',
				texte: 'Les deux couleurs du logo sur fond blanc, dans l’esprit de La Fourche.'
			},
			{
				chemin: '/ensag/palette-accordee',
				titre: 'Palette 3 : multicolore accordé',
				texte: 'Les tuiles restent de couleur mais toutes à la même clarté et intensité, sur un fond très légèrement froid.'
			}
		]
	},
	{
		id: 'icones',
		titre: 'Icônes et dessins',
		intro: 'Les pictogrammes, les dessins de Remira et ceux des jeux.',
		essais: [
			{
				chemin: '/ensag/icones',
				titre: 'Icônes pratiques',
				texte: 'Les caractères et émojis actuels face à deux bibliothèques d’icônes et aux icônes maison.'
			},
			{
				chemin: '/ensag/dessenhs',
				titre: 'Dessins de Remira',
				texte: 'Tous les mots dessinés de la poussière d’or sur une page, pour garder, refaire ou retirer.'
			},
			{
				chemin: '/ensag/illustracions-jocs',
				titre: 'Illustrations des jeux',
				texte: 'Les illustrations des familles de jeux en trois manières, sur les vraies couleurs des cartes.'
			},
			{
				chemin: '/ensag/ia',
				titre: 'Mention IA',
				texte: 'Signaler sans bruit une illustration faite par IA, et en faire la porte d’une cagnotte pour engager un illustrateur ou une illustratrice.'
			}
		]
	},
	{
		id: 'mouvement',
		titre: 'Mouvement et effets',
		intro: 'Ce qui bouge : lettres, récompenses, profondeur.',
		essais: [
			{
				chemin: '/ensag/letra',
				titre: 'Animations de texte',
				texte: 'Les effets de lettres des suggestions de Canva, reproduits dans le site ; chaque vignette se rejoue au clic.'
			},
			{
				chemin: '/ensag/lottie',
				titre: 'Récompenses animées',
				texte: 'Les récompenses dessinées dans EffectCraft, en version légère ; chaque vignette se rejoue au clic.'
			},
			{
				chemin: '/ensag/prigondor',
				titre: 'Profondeur',
				texte: 'Un mouvement discret qui fait avancer les plans d’une photo restée entière.'
			}
		]
	},
	{
		id: 'pages',
		titre: 'Pages et ambiances',
		intro: 'Des pages entières, pour comparer des directions.',
		essais: [
			{
				chemin: '/ensag/blanc',
				titre: 'Page presque blanche',
				texte: 'L’esquisse d’une page presque blanche, en sept blocs, avec sa direction visuelle et son mouvement.'
			},
			{
				chemin: '/ensag/clar',
				titre: 'Refonte claire',
				texte: 'La même page en trois ambiances claires : seules les couleurs changent.'
			},
			{
				chemin: '/ensag/mondes',
				titre: 'Les trois mondes',
				texte: 'Les trois entités de l’accueil en fenêtres vivantes, tenues par le fil du ligam. Prototype de la fenêtre Se parla.'
			}
		]
	},
	{
		id: 'espaces',
		titre: 'Espaces et contenus',
		intro: 'Des espaces particuliers du site, avec leur contenu.',
		essais: [
			{
				chemin: '/ensag/scena',
				titre: 'La scène de l’unité',
				texte: 'Un visuel en grand où chaque objet se touche, vient à la lumière et montre son nom.'
			},
			{
				chemin: '/ensag/musica',
				titre: 'Espace musique',
				texte: 'La table du café vue d’en haut : on entre après accord, rien de Deezer ne se charge avant.'
			},
			{
				chemin: '/ensag/occitanica',
				titre: 'Documents d’Occitanica',
				texte: 'Valoriser dans Cultura les documents libres retenus : vignette légère, titre, auteur, date, source et lien vers la fiche d’origine.'
			}
		]
	}
];

// Essais adoptés : ils sont devenus de vraies pages (les anciennes adresses /ensag/…
// renvoient maintenant vers elles).
export const ADOPTES = [
	{
		chemin: '/apren/jocs',
		titre: 'Les jeux',
		texte: 'L’essai d’allure Teula, adopté le 05-11 et devenu rubrique de S’apren.'
	},
	{
		chemin: '/apren/remira',
		titre: 'Remira',
		texte: 'L’essai de la page de calme (poussière d’or), devenu rubrique de S’apren le 05-11.'
	},
	{
		chemin: '/apren/gramatica/infinitiu',
		titre: 'Fiches de grammaire',
		texte: 'L’essai du 03-11, devenu la première fiche de grammaire.'
	}
];

// Vieux essais et maquettes de app/static : ils ne s'ouvrent que sur l'ordinateur
// (npm run dev), le build les retire. Affichés seulement en développement.
export const LOCAUX = [
	{ chemin: '/esbos-nuech.html', titre: 'Esquisse de nuit' },
	{ chemin: '/esbos-engenh.html', titre: 'Ambiance Engenh' },
	{ chemin: '/esbos-fons.html', titre: 'Fonds comparés' },
	{ chemin: '/esbos-fons-leugiers.html', titre: 'Fonds légers' },
	{ chemin: '/esbos-venas.html', titre: 'Veines d’or comparées' },
	{ chemin: '/esbos-votz.html', titre: 'Les voix de l’Atlas' },
	{ chemin: '/maqueta-acuelh.html', titre: 'Accueil éditorial aéré' },
	{ chemin: '/maqueta-autras-lengas.html', titre: 'Panneau Autres langues' },
	{ chemin: '/maqueta-lengas.html', titre: 'Langues et échelles' },
	{ chemin: '/maqueta-portulan.html', titre: 'Portulan sobre' }
];
