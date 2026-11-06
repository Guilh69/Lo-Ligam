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
// de lo Congrès le 05-11 et le 06-11 (variété languedocienne, genre d'après
// lo Basic) ; l'occitan reste à relire par Romain. Chaque photo garde les mots
// qui lui sont propres : « lo cèl » n'est que là où le ciel est le sujet
// (Romain, 06-11 : « il y a 4 fois le mot ciel »).
//
// Thèmes (Romain, 06-11 : « par milieu, et aussi par thématique, ça dépend de
// la nature de la photo » ; une photo prise hors d'Occitanie peut illustrer un
// thème) : chaque paysage a son tema, voir TEMAS plus bas. Lot 1 (06-11) : 18
// photos de plus, rangées en trois milieux ; mots de la ville surtout, déjà
// croisés dans les leçons pour beaucoup.

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
	'la vila': 'la ville',
	// 06-11 : de quoi varier (lo Congrès : île → illa, digue → paissièra
	// lengadoc, falaise → pena)
	'l’illa': 'l’île',
	'l’èrba': 'l’herbe',
	'la paissièra': 'le barrage, la chaussée',
	'l’orizont': 'l’horizon',
	'la pèira': 'la pierre',
	'la duna': 'la dune',
	'lo pic': 'le pic',
	'la bruma': 'la brume',
	'la pena': 'la falaise',
	'lo pòrt': 'le port',
	// 06-11, lot 1 des thèmes (lo Congrès : clocher → cloquièr lengadoc, toit →
	// teulat ; campanar et teulada absents du Basic languedocien ; genre d'après
	// lo Basic)
	'lo pin': 'le pin',
	'lo cap': 'le cap',
	'la paret': 'le mur',
	'la valada': 'la vallée',
	'lo prat': 'le pré',
	'lo fanal': 'la lanterne',
	'lo cloquièr': 'le clocher',
	'lo teulat': 'le toit',
	'lo balcon': 'le balcon',
	'la fenèstra': 'la fenêtre',
	'la planta': 'la plante',
	'la pòrta': 'la porte',
	'la carrièra': 'la rue',
	'lo palmièr': 'le palmier',
	'la piscina': 'la piscine',
	'l’escalièr': 'l’escalier',
	'lo pont': 'le pont',
	'la crotz': 'la croix',
	// 06-11, lot 2 (los monuments) : lo Congrès (coupole → copòla, lampe → lampa ; cupòla refusé), genre d'après lo Basic
	'lo fèrre': 'le fer',
	'l’arc': 'l’arc',
	'la rosassa': 'la rosace',
	'l’estatua': 'la statue',
	'la catedrala': 'la cathédrale',
	'lo castèl': 'le château',
	'la muralha': 'la muraille, le rempart',
	'la copòla': 'la coupole',
	'la campana': 'la cloche',
	'lo relòtge': 'l’horloge',
	'la gara': 'la gare',
	'la flor': 'la fleur',
	'la lampa': 'la lampe',
	'la colomna': 'la colonne',
	'la fusta': 'le bois',
	'la plaça': 'la place',
	'lo puèg': 'la colline'
};

export const PAISATGES = [
	{
		clau: 'calanca',
		tema: 'mar',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une côte rocheuse à Marseille : la mer bleue au premier plan, des maisons blanches au bord de l’eau, des îles au loin, un ciel de nuages.',
		mots: [
			['la mar', 0.22, 0.75],
			['la ròca', 0.75, 0.66],
			['l’ostal', 0.92, 0.48],
			['la nívol', 0.42, 0.18],
			['l’illa', 0.2, 0.48]
		]
	},
	{
		clau: 'riu',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une rivière claire au fond d’une gorge, entre des rochers blancs et des pentes boisées, sous un ciel pâle.',
		mots: [
			['lo riu', 0.6, 0.83],
			['la ròca', 0.32, 0.42],
			['lo bòsc', 0.8, 0.5]
		]
	},
	{
		clau: 'lac',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1076,
		alt: 'Un lac vert entouré d’une forêt de pins, des herbes hautes au premier plan, un petit nuage blanc dans le ciel.',
		mots: [
			['lo lac', 0.5, 0.62],
			['lo bòsc', 0.4, 0.38],
			['la nívol', 0.1, 0.21],
			['l’èrba', 0.3, 0.86]
		]
	},
	{
		clau: 'camin',
		tema: 'mar',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Un chemin de sable entre les dunes et des piquets de bois, la mer au bout, un ciel bleu profond.',
		mots: [
			['lo camin', 0.58, 0.82],
			['la mar', 0.2, 0.55],
			['la duna', 0.82, 0.55],
			['lo cèl', 0.5, 0.22]
		]
	},
	{
		clau: 'plaja',
		tema: 'mar',
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
		tema: 'montanha',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une arche de pierre s’ouvre sur un pic rocheux au-dessus de la garrigue, sous un ciel bleu et quelques nuages.',
		mots: [
			['lo pic', 0.62, 0.38],
			['la montanha', 0.28, 0.445],
			['la ròca', 0.88, 0.55],
			['la garriga', 0.45, 0.7]
		]
	},
	{
		clau: 'montanha',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une montagne calcaire domine une vaste forêt, quelques vignes au milieu, sous un ciel voilé.',
		mots: [
			['la montanha', 0.7, 0.33],
			['lo bòsc', 0.3, 0.88],
			['la vinha', 0.78, 0.77],
			['la nívol', 0.25, 0.3]
		]
	},
	{
		clau: 'vilatge',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Un village de pierre autour d’une abbaye, entre des cyprès et des falaises, sous un ciel bleu.',
		mots: [
			['lo vilatge', 0.72, 0.38],
			['la glèisa', 0.52, 0.39],
			['l’arbre', 0.42, 0.52],
			['la pena', 0.44, 0.24]
		]
	},
	{
		clau: 'port',
		tema: 'mar',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Le Vieux-Port de Marseille au soir : des bateaux, les façades de la ville et la basilique sur sa colline.',
		mots: [
			['la glèisa', 0.47, 0.43],
			['lo batèl', 0.22, 0.63],
			['lo pòrt', 0.72, 0.62],
			['la vila', 0.8, 0.5]
		]
	},
	{
		clau: 'aigoal',
		tema: 'montanha',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une tour de pierre crénelée au sommet d’une montagne enneigée, des crêtes bleues dans la brume.',
		mots: [
			['la nèu', 0.3, 0.88],
			['la torre', 0.33, 0.5],
			['la montanha', 0.75, 0.6],
			['la bruma', 0.85, 0.49]
		]
	},
	{
		clau: 'garona',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'La Garonne à Toulouse : l’eau large et bleue, une chaussée qui écume, la ville de brique sous le ciel.',
		mots: [
			['l’aiga', 0.5, 0.85],
			['la vila', 0.5, 0.48],
			['la paissièra', 0.3, 0.58]
		]
	},
	{
		clau: 'plana',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Sous deux arbres, un muret de pierres sèches et, au loin, une plaine immense jusqu’à l’horizon.',
		mots: [
			['l’arbre', 0.27, 0.4],
			['la pèira', 0.4, 0.75],
			['la plana', 0.6, 0.55],
			['l’orizont', 0.4, 0.49]
		]
	},
	// ── Lot 1 des thèmes (06-11) ──
	{
		clau: 'mar-paret',
		tema: 'mar',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une ouverture ronde dans un vieux mur de pierre donne sur la mer bleue, avec des rochers au bord et une côte au loin.',
		mots: [
			['la mar', 0.45, 0.43],
			['la ròca', 0.55, 0.66],
			['la paret', 0.1, 0.55]
		]
	},
	{
		clau: 'mar-pena',
		tema: 'mar',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'De hautes falaises blanches tombent sur une plage de galets, une arche de roche s’avance dans la mer bleue, de l’herbe verte au premier plan.',
		mots: [
			['la pena', 0.72, 0.38],
			['la plaja', 0.57, 0.62],
			['la mar', 0.2, 0.33],
			['l’èrba', 0.15, 0.8]
		]
	},
	{
		clau: 'mar-illas',
		tema: 'mar',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Marseille au coucher du soleil : des toits et des immeubles au premier plan, la mer calme, des îles à l’horizon.',
		mots: [
			['l’illa', 0.42, 0.46],
			['la mar', 0.62, 0.56],
			['la vila', 0.3, 0.75],
			['la torre', 0.86, 0.64]
		]
	},
	{
		clau: 'mar-cap',
		tema: 'mar',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une côte de rochers rouges sous une pente couverte de pins, une eau si claire qu’on voit le fond, un cap au loin.',
		mots: [
			['la mar', 0.75, 0.62],
			['l’aiga', 0.45, 0.88],
			['la ròca', 0.25, 0.66],
			['la montanha', 0.15, 0.3],
			['lo cap', 0.66, 0.47]
		]
	},
	{
		clau: 'mar-pin',
		tema: 'mar',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Un pin tordu penché au-dessus d’une falaise, la mer d’un bleu profond, un petit voilier au loin.',
		mots: [
			['lo pin', 0.6, 0.25],
			['la mar', 0.3, 0.5],
			['lo batèl', 0.555, 0.52],
			['la ròca', 0.4, 0.88]
		]
	},
	{
		clau: 'montanha-pena',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1080,
		alt: 'Vue depuis le pic Saint-Loup : la longue falaise blanche de l’Hortus au-dessus d’une forêt sombre, une plaine jusqu’à l’horizon, un ciel de nuages.',
		mots: [
			['la pena', 0.62, 0.52],
			['la plana', 0.85, 0.44],
			['lo bòsc', 0.4, 0.82],
			['la nívol', 0.5, 0.15]
		]
	},
	{
		clau: 'montanha-rocas',
		tema: 'montanha',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Des montagnes de roche grise découpée en aiguilles, des pentes couvertes de garrigue, quelques arbres au premier plan.',
		mots: [
			['la montanha', 0.18, 0.28],
			['la ròca', 0.78, 0.28],
			['la garriga', 0.5, 0.65],
			['l’arbre', 0.68, 0.86]
		]
	},
	{
		clau: 'montanha-valada',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une vallée verte entre deux montagnes boisées, des chalets aux toits bruns au premier plan, des prés, des nuages accrochés aux sommets.',
		mots: [
			['la montanha', 0.85, 0.33],
			['la valada', 0.3, 0.5],
			['l’ostal', 0.17, 0.82],
			['lo prat', 0.35, 0.77],
			['la nívol', 0.4, 0.15]
		]
	},
	{
		clau: 'montanha-pins',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une clairière d’herbe et de grands pins ; derrière, une chaîne de montagnes bleues avec un pic pointu, des nuages blancs.',
		mots: [
			['lo pic', 0.47, 0.37],
			['la montanha', 0.18, 0.43],
			['lo pin', 0.6, 0.5],
			['l’èrba', 0.45, 0.88],
			['la nívol', 0.58, 0.14]
		]
	},
	{
		clau: 'vila-aiga',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1505,
		alt: 'Un grand bâtiment de briques aux portes rayées de bleu et de blanc, au bord d’une eau calme qui le reflète, un saule à gauche.',
		mots: [
			['l’aiga', 0.45, 0.78],
			['l’arbre', 0.1, 0.33],
			['la pòrta', 0.52, 0.5]
		]
	},
	{
		clau: 'vila-carriera',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une rue étroite et pavée à Montpellier, entre de hautes façades de pierre ; une lanterne accrochée au mur, un bout de ciel bleu tout en haut.',
		mots: [
			['la carrièra', 0.6, 0.78],
			['lo fanal', 0.66, 0.375],
			['la paret', 0.12, 0.55]
		]
	},
	{
		clau: 'vila-balcon',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Vue d’un balcon sur des immeubles de pierre aux balcons de fer, à Montpellier ; un clocher pointu, le soleil qui se couche, des plantes au premier plan.',
		mots: [
			['lo cloquièr', 0.8, 0.3],
			['la vila', 0.4, 0.55],
			['lo balcon', 0.62, 0.86],
			['la planta', 0.18, 0.85]
		]
	},
	{
		clau: 'vila-cloquier',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une rue entre des maisons à pans de bois et des immeubles de brique ; au fond, un haut clocher de pierre se détache sur le ciel.',
		mots: [
			['lo cloquièr', 0.5, 0.45],
			['l’ostal', 0.15, 0.45],
			['la fenèstra', 0.77, 0.43]
		]
	},
	{
		clau: 'vila-palmier',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1076,
		alt: 'Vue sur les toits d’un quartier de maisons : tuiles roses, jardins, une petite piscine, un palmier, la plaine au loin.',
		mots: [
			['lo teulat', 0.6, 0.88],
			['lo palmièr', 0.73, 0.46],
			['l’ostal', 0.33, 0.6],
			['la piscina', 0.22, 0.78]
		]
	},
	{
		clau: 'vila-plantas',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une ruelle d’Arles, en pierre blonde, aux volets bleus ; des plantes grimpantes et des pots de fleurs le long des murs.',
		mots: [
			['la carrièra', 0.55, 0.82],
			['la planta', 0.53, 0.5],
			['la pòrta', 0.06, 0.6],
			['la fenèstra', 0.335, 0.33]
		]
	},
	{
		clau: 'vila-escalier',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Des maisons de bois peintes en bleu, rouge et jaune au bord d’un canal, à Amiens ; une passerelle, un escalier de pierre aux rampes de fer, des branches nues d’hiver.',
		mots: [
			['l’ostal', 0.15, 0.43],
			['l’escalièr', 0.43, 0.54],
			['lo pont', 0.36, 0.72],
			['l’arbre', 0.18, 0.1]
		]
	},
	{
		clau: 'vila-montanha',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une petite ville de montagne aux toits de pierre grise, une maison rose au premier plan, une rue en pente, des sommets et des nuages.',
		mots: [
			['la montanha', 0.07, 0.36],
			['la nívol', 0.67, 0.2],
			['lo teulat', 0.72, 0.6],
			['la carrièra', 0.44, 0.84]
		]
	},
	{
		clau: 'vila-crotz',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une grande esplanade de pierre à Montpellier sous un ciel bleu : une porte monumentale, des immeubles anciens, un clocher pointu, un crucifix sur une colonne, à droite.',
		mots: [
			['la crotz', 0.92, 0.41],
			['la glèisa', 0.79, 0.49],
			['la pòrta', 0.12, 0.59]
		]
	},
	// ── Lot 2 des thèmes : los monuments (06-11) ──
	{
		clau: 'mon-ferre',
		tema: 'monuments',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'La tour Eiffel vue d’en dessous : une dentelle de fer brun contre le ciel bleu, ses étages, ses grands arcs.',
		mots: [
			['la torre', 0.5, 0.15],
			['lo fèrre', 0.25, 0.65],
			['l’arc', 0.5, 0.9]
		]
	},
	{
		clau: 'mon-catedrala',
		tema: 'monuments',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'La façade de Notre-Dame de Paris dorée par le soleil : deux tours, une grande rosace, une rangée de statues, des portails sculptés.',
		mots: [
			['la torre', 0.37, 0.15],
			['la rosassa', 0.55, 0.53],
			['l’estatua', 0.3, 0.65],
			['la pòrta', 0.6, 0.92]
		]
	},
	{
		clau: 'mon-pont',
		tema: 'monuments',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Le pont du Golden Gate à San Francisco, rouge au-dessus de la baie, des collines brunes derrière, des rochers et des vagues au premier plan.',
		mots: [
			['lo pont', 0.43, 0.32],
			['la mar', 0.5, 0.72],
			['lo puèg', 0.7, 0.48],
			['la ròca', 0.15, 0.63]
		]
	},
	{
		clau: 'mon-castel',
		tema: 'monuments',
		amples: [1024, 1920],
		l: 1920,
		h: 1280,
		alt: 'Un château de pierre vu d’en bas : une tourelle ronde, de hautes fenêtres, un vieux mur de pierres à gauche, le ciel bleu.',
		mots: [
			['la torre', 0.55, 0.3],
			['la muralha', 0.15, 0.65],
			['la fenèstra', 0.66, 0.53],
			['lo castèl', 0.8, 0.8]
		]
	},
	{
		clau: 'mon-copola',
		tema: 'monuments',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Le chevet d’une église romane en pierre blonde, sa coupole et son petit clocheton, sous un grand ciel bleu ; des fanions rouges et blancs.',
		mots: [
			['la copòla', 0.5, 0.66],
			['la glèisa', 0.55, 0.86],
			['lo cèl', 0.5, 0.25]
		]
	},
	{
		clau: 'mon-fort',
		tema: 'monuments',
		amples: [800, 1600],
		l: 1600,
		h: 2134,
		alt: 'Le fort Saint-Jean à Marseille : une tour ronde au bout d’un haut mur de pierre, un chemin de ronde, la mer à gauche.',
		mots: [
			['la torre', 0.65, 0.42],
			['la muralha', 0.9, 0.3],
			['la mar', 0.14, 0.72],
			['lo camin', 0.62, 0.88]
		]
	},
	{
		clau: 'mon-balcons',
		tema: 'monuments',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'À Montpellier, un immeuble blanc hérissé de grands balcons qui partent dans tous les sens, comme les branches d’un arbre, sous le ciel bleu.',
		mots: [
			['lo balcon', 0.55, 0.35],
			['l’arbre', 0.88, 0.77],
			['la planta', 0.4, 0.64]
		]
	},
	{
		clau: 'mon-estatua',
		tema: 'monuments',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une statue de bronze aux bras levés, tenant un bouquet, entre un toit de tuiles et un grand mur de pierre striée, sous un ciel bleu profond.',
		mots: [
			['l’estatua', 0.48, 0.55],
			['lo teulat', 0.12, 0.76],
			['la fenèstra', 0.3, 0.84],
			['la paret', 0.82, 0.5]
		]
	},
	{
		clau: 'mon-gleisa',
		tema: 'monuments',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une petite église de pierre sombre au pied des montagnes, un clocher carré, une fenêtre ronde, le ciel bleu.',
		mots: [
			['lo cloquièr', 0.38, 0.28],
			['la montanha', 0.83, 0.33],
			['la fenèstra', 0.52, 0.66],
			['la pèira', 0.66, 0.8]
		]
	},
	{
		clau: 'mon-campana',
		tema: 'monuments',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une grande église de brique vue d’en bas : une haute fenêtre gothique, une horloge, et tout en haut une cloche dans une cage de fer forgé.',
		mots: [
			['la campana', 0.66, 0.3],
			['lo relòtge', 0.77, 0.5],
			['la fenèstra', 0.52, 0.84],
			['la paret', 0.15, 0.55]
		]
	},
	{
		clau: 'mon-basilica',
		tema: 'monuments',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une basilique rose et blanche à Valence, en Espagne, coiffée d’une coupole aux tuiles bleues ; une foule minuscule devant les portes.',
		mots: [
			['la copòla', 0.52, 0.36],
			['la crotz', 0.51, 0.12],
			['la pòrta', 0.43, 0.86],
			['la fenèstra', 0.24, 0.66]
		]
	},
	{
		clau: 'mon-gara',
		tema: 'monuments',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'La gare de Limoges, en pierre blanche : une haute tour à horloge coiffée de cuivre vert, une coupole, de grandes verrières.',
		mots: [
			['lo relòtge', 0.22, 0.36],
			['la copòla', 0.6, 0.38],
			['la gara', 0.4, 0.62],
			['la fenèstra', 0.91, 0.68]
		]
	},
	{
		clau: 'mon-muralha',
		tema: 'monuments',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Les remparts de Carcassonne au-dessus d’un talus d’herbes hautes : des murailles crénelées et des tours rondes sous un ciel voilé.',
		mots: [
			['la torre', 0.49, 0.38],
			['la muralha', 0.78, 0.52],
			['l’èrba', 0.5, 0.82],
			['la nívol', 0.3, 0.14]
		]
	},
	{
		clau: 'mon-camin',
		tema: 'monuments',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Un sentier de terre longe le pied des remparts de Carcassonne : une tour ronde, de hauts murs couverts de lierre, des fleurs roses.',
		mots: [
			['la torre', 0.38, 0.45],
			['la muralha', 0.8, 0.3],
			['lo camin', 0.43, 0.85],
			['la flor', 0.84, 0.6]
		]
	},
	{
		clau: 'mon-torre',
		tema: 'monuments',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une rue neuve de Barcelone entre des immeubles de verre et de béton ; au fond, une tour ronde et pointue qui brille au soleil.',
		mots: [
			['la torre', 0.57, 0.36],
			['l’arbre', 0.66, 0.63],
			['la carrièra', 0.55, 0.9]
		]
	},
	{
		clau: 'mon-valentre',
		tema: 'monuments',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Le pont Valentré à Cahors : de grandes arches de pierre et une haute tour carrée, entre la verdure et un ciel de nuages.',
		mots: [
			['la torre', 0.58, 0.3],
			['lo pont', 0.62, 0.68],
			['lo bòsc', 0.1, 0.38],
			['la nívol', 0.84, 0.12]
		]
	},
	{
		clau: 'mon-arcs',
		tema: 'monuments',
		amples: [1024, 1600],
		l: 1600,
		h: 914,
		alt: 'Dans la grande mosquée de Cordoue, une forêt de colonnes portant des arcs rayés de rouge et de blanc, une lampe suspendue.',
		mots: [
			['l’arc', 0.66, 0.22],
			['la lampa', 0.46, 0.51],
			['la colomna', 0.39, 0.8]
		]
	},
	{
		clau: 'mon-prat',
		tema: 'monuments',
		amples: [1024, 1920],
		l: 1920,
		h: 1540,
		alt: 'Un château blanc à tourelles pointues au-dessus des arbres, un grand pré d’herbes folles au premier plan, un ciel moutonné.',
		mots: [
			['lo castèl', 0.48, 0.45],
			['l’arbre', 0.19, 0.25],
			['lo prat', 0.5, 0.82],
			['la nívol', 0.68, 0.2]
		]
	},
	{
		clau: 'mon-tor',
		tema: 'monuments',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une tour de pierre surmontée d’une flèche ajourée, au-dessus des toits d’un village, entre les cyprès et les arbres, sous le ciel bleu.',
		mots: [
			['la torre', 0.25, 0.6],
			['lo teulat', 0.25, 0.86],
			['l’arbre', 0.88, 0.7]
		]
	},
	{
		clau: 'mon-verona',
		tema: 'monuments',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une cour de Vérone : un petit balcon de pierre sur une façade de brique et de pierre, un mur crénelé couvert de lierre, des nuages.',
		mots: [
			['lo balcon', 0.55, 0.63],
			['la muralha', 0.22, 0.5],
			['la fenèstra', 0.78, 0.17],
			['la nívol', 0.15, 0.27]
		]
	},
	{
		clau: 'mon-fusta',
		tema: 'monuments',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Deux bâtiments neufs habillés de bois, l’un de planches, l’autre de petites tuiles de bois, autour d’une pelouse, sous un ciel de printemps.',
		mots: [
			['la fusta', 0.88, 0.5],
			['la fenèstra', 0.61, 0.46],
			['l’èrba', 0.4, 0.86],
			['la nívol', 0.33, 0.25]
		]
	},
	{
		clau: 'mon-milan',
		tema: 'monuments',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Depuis les toits de la cathédrale de Milan : des flèches de marbre sculpté, une statue tout en haut, et loin en bas la grande place.',
		mots: [
			['l’estatua', 0.38, 0.11],
			['la catedrala', 0.18, 0.45],
			['la plaça', 0.7, 0.82]
		]
	}
];

/** Les thèmes du défilé et du jeu (06-11). D'abord trois milieux ; viendront
 *  par lots les thèmes tirés de la nature des photos (les monuments, le temps
 *  qu'il fait, à table, les fêtes…). */
export const TEMAS = [
	{ id: 'mar', nom: { oc: 'La mar', fr: 'La mer', es: 'El mar', en: 'The sea', ca: 'El mar', ar: 'البحر' } },
	{ id: 'montanha', nom: { oc: 'La montanha', fr: 'La montagne', es: 'La montaña', en: 'The mountains', ca: 'La muntanya', ar: 'الجبل' } },
	{ id: 'vila', nom: { oc: 'La vila', fr: 'La ville', es: 'La ciudad', en: 'The town', ca: 'La ciutat', ar: 'المدينة' } },
	{ id: 'monuments', nom: { oc: 'Los monuments', fr: 'Les monuments', es: 'Los monumentos', en: 'Landmarks', ca: 'Els monuments', ar: 'المعالم' } }
];

/** Les paysages d'un thème (tous, sans thème). */
export const deTema = (tema) => PAISATGES.filter((p) => !tema || p.tema === tema);

/** Chemin d'un fichier de paysage. */
export const camin = (clau, a) => `/apren/paisatges/${clau}-${a}.webp`;

/** srcset d'un paysage. */
export const srcset = (p) => p.amples.map((a) => `${camin(p.clau, a)} ${a}w`).join(', ');
