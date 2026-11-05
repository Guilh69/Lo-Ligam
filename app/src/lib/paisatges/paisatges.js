// Paysages de Romain (Bases_foto, choisis le 2026-11-05) : la troisième façon
// de regarder de Remira (« Paisatges », /apren/remira) et le jeu « Ont es… ? »
// (/apren/jocs?joc=paisatges). Une photo entière à la fois, des points d'or
// posés sur ce qu'elle montre ; on touche un point, le mot s'écrit.
//
// Photos sans GPS ni métadonnée, sRGB, saturation −15 %, WebP 60 :
// static/apren/paisatges/<clau>-<ample>.webp (l × h = le plus grand fichier).
// mots : [occitan, x, y], x et y en fraction de la photo (0 à 1, depuis le
// coin haut gauche), posés à l'œil sur une planche de contrôle.
//
// Ces mots de nature ne sont pas dans l'A1 : ils viennent avec leur
// traduction, toujours (choix de Romain, 05-11). Chaque forme passée à l'API
// de lo Congrès le 05-11 (variété languedocienne, genre d'après lo Basic) ;
// l'occitan reste à relire par Romain.

/** Le français de chaque mot (repli de tria() pour les autres langues). */
export const MOTS = {
	'lo cèl': 'le ciel',
	'la nívol': 'le nuage',
	'la mar': 'la mer',
	'la plaja': 'la plage',
	'la ròca': 'le rocher',
	'la montanha': 'la montagne',
	'la plana': 'la plaine',
	'la garriga': 'la garrigue',
	'lo bòsc': 'le bois, la forêt',
	'l’arbre': 'l’arbre',
	'la vinha': 'la vigne',
	'lo riu': 'la rivière',
	'lo lac': 'le lac',
	'l’aiga': 'l’eau',
	'la nèu': 'la neige',
	'lo camin': 'le chemin',
	'lo batèl': 'le bateau',
	'l’ostal': 'la maison',
	'la glèisa': 'l’église',
	'la torre': 'la tour',
	'lo vilatge': 'le village',
	'la vila': 'la ville'
};

export const PAISATGES = [
	{
		clau: 'calanca',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une côte rocheuse à Marseille : la mer bleue au premier plan, des maisons blanches au bord de l’eau, des îles au loin, un ciel de nuages.',
		mots: [
			['la mar', 0.22, 0.75],
			['la ròca', 0.75, 0.66],
			['l’ostal', 0.92, 0.48],
			['la nívol', 0.42, 0.18]
		]
	},
	{
		clau: 'riu',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une rivière claire au fond d’une gorge, entre des rochers blancs et des pentes boisées, sous un ciel pâle.',
		mots: [
			['lo riu', 0.6, 0.83],
			['la ròca', 0.32, 0.42],
			['lo bòsc', 0.8, 0.5],
			['lo cèl', 0.55, 0.12]
		]
	},
	{
		clau: 'lac',
		amples: [1024, 1920],
		l: 1920,
		h: 1076,
		alt: 'Un lac vert entouré d’une forêt de pins, des herbes hautes au premier plan, un petit nuage blanc dans le ciel.',
		mots: [
			['lo lac', 0.5, 0.62],
			['lo bòsc', 0.4, 0.38],
			['la nívol', 0.1, 0.21],
			['lo cèl', 0.75, 0.1]
		]
	},
	{
		clau: 'camin',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Un chemin de sable entre les dunes et des piquets de bois, la mer au bout, un ciel bleu profond.',
		mots: [
			['lo camin', 0.58, 0.82],
			['la mar', 0.2, 0.55],
			['lo cèl', 0.5, 0.22]
		]
	},
	{
		clau: 'plaja',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une grande plage de sable au coucher du soleil, un filet de volley, des immeubles au bord, le ciel orangé.',
		mots: [
			['la plaja', 0.4, 0.75],
			['la mar', 0.15, 0.53],
			['lo cèl', 0.4, 0.2]
		]
	},
	{
		clau: 'arcada',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une arche de pierre s’ouvre sur un pic rocheux au-dessus de la garrigue, sous un ciel bleu et quelques nuages.',
		mots: [
			['la montanha', 0.62, 0.4],
			['la ròca', 0.88, 0.55],
			['lo cèl', 0.4, 0.2],
			['la garriga', 0.45, 0.7]
		]
	},
	{
		clau: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une montagne calcaire domine une vaste forêt, quelques vignes au milieu, sous un ciel voilé.',
		mots: [
			['la montanha', 0.7, 0.33],
			['lo bòsc', 0.3, 0.88],
			['la vinha', 0.78, 0.77],
			['la nívol', 0.25, 0.3],
			['lo cèl', 0.3, 0.12]
		]
	},
	{
		clau: 'vilatge',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Un village de pierre autour d’une abbaye, entre des cyprès et des falaises, sous un ciel bleu.',
		mots: [
			['lo vilatge', 0.72, 0.38],
			['la glèisa', 0.52, 0.39],
			['l’arbre', 0.42, 0.52],
			['la montanha', 0.44, 0.25]
		]
	},
	{
		clau: 'port',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Le Vieux-Port de Marseille au soir : des bateaux, les façades de la ville et la basilique sur sa colline.',
		mots: [
			['la glèisa', 0.47, 0.43],
			['lo batèl', 0.22, 0.63],
			['la mar', 0.5, 0.82],
			['la vila', 0.8, 0.5]
		]
	},
	{
		clau: 'aigoal',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une tour de pierre crénelée au sommet d’une montagne enneigée, des crêtes bleues dans la brume.',
		mots: [
			['la nèu', 0.3, 0.88],
			['la torre', 0.33, 0.5],
			['la montanha', 0.75, 0.6],
			['lo cèl', 0.6, 0.2]
		]
	},
	{
		clau: 'garona',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'La Garonne à Toulouse : l’eau large et bleue, une chaussée qui écume, la ville de brique sous le ciel.',
		mots: [
			['l’aiga', 0.5, 0.85],
			['la vila', 0.5, 0.48],
			['lo cèl', 0.5, 0.2]
		]
	},
	{
		clau: 'plana',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Sous deux arbres, un muret de pierres sèches et, au loin, une plaine immense jusqu’à l’horizon.',
		mots: [
			['l’arbre', 0.27, 0.4],
			['la ròca', 0.4, 0.75],
			['la plana', 0.6, 0.55],
			['lo cèl', 0.6, 0.35]
		]
	}
];

/** Chemin d'un fichier de paysage. */
export const camin = (clau, a) => `/apren/paisatges/${clau}-${a}.webp`;

/** srcset d'un paysage. */
export const srcset = (p) => p.amples.map((a) => `${camin(p.clau, a)} ${a}w`).join(', ');
