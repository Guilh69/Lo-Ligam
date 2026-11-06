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
// Relecture photo par photo, 06-11 au soir (Romain : « que les mots ne se
// répètent pas trop », « fais attention à ce genre de détails ») : 171 mots
// différents au lieu de 133, « l'arbre » 17 fois au lieu de 39, « lo cèl » 9
// au lieu de 37 ; chaque point sur une chose bien visible de près (l'olivier
// vu de très loin est devenu « la campanha »).
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
	'lo puèg': 'la colline',
	// 06-11, lot 3 (a taula, lo temps) : lo Congrès (asperge → espargue, poulet → polet, champignon → camparòl, jambon → cambajon, crevette → cambaròta, crêpe → pescajon, saucisse → salsissa, pichet → pichièr, poivron → pebròt, rambarde → baranda), genre d'après lo Basic
	'l’espargue': 'l’asperge',
	'la carchòfa': 'l’artichaut',
	'la caissa': 'la caisse, la cagette',
	'lo pescajon': 'la crêpe',
	'la salsissa': 'la saucisse',
	'l’uòu': 'l’œuf',
	'la salada': 'la salade',
	'l’oliva': 'l’olive',
	'l’etiqueta': 'l’étiquette',
	'lo prètz': 'le prix',
	'lo polet': 'le poulet',
	'la sieta': 'l’assiette',
	'lo pichièr': 'le pichet, la cruche',
	'lo camparòl': 'le champignon',
	'la taula': 'la table',
	'lo vin': 'le vin',
	'lo cambajon': 'le jambon',
	'lo pan': 'le pain',
	'lo pebròt': 'le poivron',
	'la botelha': 'la bouteille',
	'las fritas': 'les frites',
	'lo veire': 'le verre',
	'la pera': 'la poire',
	'l’amètla': 'l’amande',
	'la tarta': 'la tarte',
	'lo ris': 'le riz',
	'la cambaròta': 'la crevette',
	'lo fum': 'la fumée',
	'la grasilha': 'le gril',
	'la veitura': 'la voiture',
	'lo parapluèja': 'le parapluie',
	'la font': 'la fontaine',
	'la fuèlha': 'la feuille',
	'lo flume': 'le fleuve',
	'lo solelh': 'le soleil',
	'la baranda': 'la rambarde',
	// 06-11, lot 4 (fèstas e lésers) : lo Congrès (sapin → sap en lengadoc, drapeau → drapèl, cheminée → cheminièra, rail → ralh, manège → manètge), genre d'après lo Basic
	'lo forgon': 'le fourgon',
	'l’immòble': 'l’immeuble',
	'la vapor': 'la vapeur',
	'l’escala': 'l’échelle',
	'lo ralh': 'le rail',
	'lo sap': 'le sapin',
	'lo present': 'le cadeau',
	'la bòla': 'la boule',
	'lo manètge': 'le manège',
	'lo lustre': 'le lustre',
	'la garlanda': 'la guirlande',
	'lo parasòl': 'le parasol',
	'lo drapèl': 'le drapeau',
	'la barraca': 'la baraque',
	'la bicicleta': 'le vélo',
	'la cheminièra': 'la cheminée',
	'la tassa': 'la tasse',
	'lo bòl': 'le bol',
	'l’estadi': 'le stade',
	'lo projector': 'le projecteur',
	// 06-11, lot 5 (compléments mer et montagne) : lo Congrès (gouffre → avenc, sable → sabla, clôture → barralha), genre d'après lo Basic
	'l’avenc': 'le gouffre, l’aven',
	'la sabla': 'le sable',
	'la barralha': 'la clôture',
	'lo destrech': 'la gorge',
	// 06-11, lot 6 (compléments de la ville) : lo Congrès (fruit → fruch en lengadoc, vitrine → veirina, puits → potz), genre d'après lo Basic
	'lo fruch': 'le fruit',
	'la veirina': 'la vitrine',
	'l’olivièr': 'l’olivier',
	'lo ciprès': 'le cyprès',
	'lo musèu': 'le musée',
	'lo potz': 'le puits',
	// 06-11, relecture des mots photo par photo (Romain : « que les mots ne se répètent pas trop », « fais attention à ce genre de détails ») :
	// chaque mot pointe une chose bien visible ; lo Congrès (carreau → carrèu, empreinte → pesada, ruine → roïna, terrain → terren, tas → molon), genre d’après lo Basic
	'la botiga': 'le magasin',
	'la branca': 'la branche',
	'la brica': 'la brique',
	'la campanha': 'la campagne',
	'la faciada': 'la façade',
	'la grua': 'la grue (de chantier)',
	'la lausa': 'la lauze',
	'la persiana': 'le volet',
	'la pesada': 'l’empreinte de pas',
	'la piramida': 'la pyramide',
	'la platana': 'le platane',
	'la riba': 'la rive',
	'la roïna': 'la ruine',
	'la ròda': 'la roue',
	'la terrassa': 'la terrasse',
	'la travèrsa': 'la traverse',
	'la tribuna': 'la tribune',
	'lo boisson': 'le buisson',
	'lo camp': 'le champ',
	'lo carrèu': 'le carreau',
	'lo cotèl': 'le couteau',
	'lo gratacèl': 'le gratte-ciel',
	'lo lum': 'la lumière',
	'lo merlet': 'le créneau',
	'lo molon': 'le tas (de pierres)',
	'lo numèro': 'le numéro',
	'lo pal': 'le piquet',
	'lo panèl': 'le panneau',
	'lo penjal': 'la pente',
	'lo ridèl': 'le rideau',
	'lo sause': 'le saule',
	'lo terren': 'le terrain',
	'lo tronc': 'le tronc',
	'lo veirial': 'le vitrail',
	'l’agulha': 'l’aiguille (de roche)',
	'l’antena': 'l’antenne',
	'l’arcada': 'l’arcade',
	'l’èura': 'le lierre'
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
			['la riba', 0.85, 0.51],
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
			['lo pal', 0.08, 0.78]
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
			['l’arcada', 0.88, 0.55],
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
			['lo camp', 0.35, 0.58]
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
			['lo ciprès', 0.42, 0.52],
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
			['la vila', 0.72, 0.47],
			['la paissièra', 0.3, 0.58],
			['la grua', 0.4, 0.43]
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
			['lo tronc', 0.27, 0.4],
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
			['la terrassa', 0.75, 0.88]
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
			['lo penjal', 0.15, 0.3],
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
			['lo pin', 0.68, 0.86]
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
			['lo sap', 0.6, 0.5],
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
			['lo sause', 0.1, 0.33],
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
			['la faciada', 0.4, 0.55],
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
			['la persiana', 0.335, 0.33]
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
			['la branca', 0.18, 0.1]
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
			['la lausa', 0.72, 0.6],
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
			['lo ciprès', 0.285, 0.65],
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
			['lo veirial', 0.52, 0.84],
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
			['l’arcada', 0.93, 0.6]
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
			['lo merlet', 0.28, 0.4]
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
			['l’èura', 0.7, 0.38],
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
			['lo panèl', 0.79, 0.66],
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
			['lo ciprès', 0.435, 0.65]
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
			['l’èura', 0.1, 0.65]
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
	},
	// ── Lot 3 des thèmes : a taula, lo temps que fa (06-11) ──
	{
		clau: 'taula-espargue',
		tema: 'taula',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Un étal de marché : des bottes d’asperges violettes, vertes et blanches dans des cagettes de bois, des artichauts à gauche, des haricots verts.',
		mots: [
			['l’espargue', 0.33, 0.42],
			['la carchòfa', 0.06, 0.58],
			['la caissa', 0.55, 0.77]
		]
	},
	{
		clau: 'taula-pescajon',
		tema: 'taula',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une galette de sarrasin garnie de rondelles de saucisse et d’un œuf, une petite salade dans un bol de métal, une bouteille verte.',
		mots: [
			['lo pescajon', 0.15, 0.7],
			['la salsissa', 0.33, 0.6],
			['l’uòu', 0.6, 0.49],
			['la salada', 0.2, 0.35]
		]
	},
	{
		clau: 'taula-oliva',
		tema: 'taula',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Au marché, des bassines d’olives vertes, noires et violettes, chacune avec son étiquette et son prix.',
		mots: [
			['l’oliva', 0.46, 0.43],
			['l’etiqueta', 0.28, 0.51],
			['lo prètz', 0.09, 0.8]
		]
	},
	{
		clau: 'taula-polet',
		tema: 'taula',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une table vue d’en haut : un poulet rôti aux pommes de terre dans un plat, une salade d’endives, un bol d’olives, des assiettes blanches, une cruche de terre.',
		mots: [
			['lo polet', 0.44, 0.59],
			['l’oliva', 0.24, 0.8],
			['lo cotèl', 0.5, 0.76],
			['la salada', 0.34, 0.24],
			['lo pichièr', 0.07, 0.28]
		]
	},
	{
		clau: 'taula-camparol',
		tema: 'taula',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une galette de céréales garnie de champignons et de jeunes pousses, un filet de sauce brune autour, dans une assiette ronde sur une table de granito.',
		mots: [
			['lo camparòl', 0.4, 0.33],
			['la sieta', 0.83, 0.65],
			['la taula', 0.05, 0.9]
		]
	},
	{
		clau: 'taula-vin',
		tema: 'taula',
		amples: [1024, 1776],
		l: 1776,
		h: 1113,
		alt: 'Une main verse du vin rouge dans un verre ; sur la table, une assiette de jambon cru en fines tranches, des tartines grillées et des poivrons rouges.',
		mots: [
			['lo vin', 0.26, 0.489],
			['lo cambajon', 0.42, 0.638],
			['lo pan', 0.7, 0.489],
			['lo pebròt', 0.6, 0.819],
			['la botelha', 0.4, 0.17]
		]
	},
	{
		clau: 'taula-frita',
		tema: 'taula',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une assiette de frites, une salade aux carottes râpées et un chausson doré, sur une table de bois en terrasse ; des verres et une bouteille verte.',
		mots: [
			['las fritas', 0.45, 0.62],
			['la salada', 0.66, 0.42],
			['lo veire', 0.44, 0.17],
			['la botelha', 0.06, 0.3],
			['la taula', 0.19, 0.86]
		]
	},
	{
		clau: 'taula-pera',
		tema: 'taula',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une tarte aux poires et aux amandes effilées dans un plat noir, au soleil ; un verre de vin blanc, une main qui coupe la première part.',
		mots: [
			['la pera', 0.52, 0.62],
			['l’amètla', 0.31, 0.5],
			['la tarta', 0.38, 0.76],
			['lo veire', 0.06, 0.45]
		]
	},
	{
		clau: 'taula-cambajon',
		tema: 'taula',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une assiette de jambon cru en fines tranches et des tartines frottées de tomate, sur une table de bois sombre.',
		mots: [
			['lo cambajon', 0.35, 0.59],
			['lo pan', 0.65, 0.26],
			['la sieta', 0.79, 0.4],
			['la taula', 0.85, 0.75]
		]
	},
	{
		clau: 'taula-ris',
		tema: 'taula',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une paella dans sa grande poêle noire : du riz doré, des crevettes, des palourdes, de la vapeur qui monte.',
		mots: [
			['lo ris', 0.3, 0.88],
			['la cambaròta', 0.77, 0.51],
			['la vapor', 0.4, 0.18]
		]
	},
	{
		clau: 'taula-grasilha',
		tema: 'taula',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une grillade dans un jardin : un petit barbecue fume sur un muret de parpaings, des assiettes posées à côté, des arbres derrière.',
		mots: [
			['lo fum', 0.51, 0.2],
			['la grasilha', 0.5, 0.54],
			['la botelha', 0.61, 0.66],
			['la veitura', 0.72, 0.45],
			['la paret', 0.54, 0.87]
		]
	},
	{
		clau: 'temps-neu',
		tema: 'temps',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une avenue sous la neige : des platanes nus, des voitures blanchies, un tapis de neige épais au milieu.',
		mots: [
			['la nèu', 0.5, 0.8],
			['l’arbre', 0.3, 0.3],
			['la veitura', 0.9, 0.58],
			['lo fanal', 0.2, 0.56]
		]
	},
	{
		clau: 'temps-parapluja',
		tema: 'temps',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une rue de ville sous la neige qui tombe : de hauts immeubles de pierre à balcons, un passant sous un parapluie jaune, un scooter enneigé.',
		mots: [
			['lo parapluèja', 0.56, 0.575],
			['lo balcon', 0.88, 0.3],
			['la nèu', 0.38, 0.7]
		]
	},
	{
		clau: 'temps-font',
		tema: 'temps',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une fontaine à statues couverte de neige au milieu d’une place, entre des façades de pierre blonde.',
		mots: [
			['la font', 0.47, 0.65],
			['l’estatua', 0.48, 0.29],
			['la nèu', 0.4, 0.86]
		]
	},
	{
		clau: 'temps-fuelha',
		tema: 'temps',
		amples: [800, 1280],
		l: 1280,
		h: 1707,
		alt: 'Un grand arbre d’automne aux feuilles dorées devant un immeuble de pierre ; ses feuilles couvrent le sol.',
		mots: [
			['la fuèlha', 0.5, 0.88],
			['l’arbre', 0.36, 0.5],
			['la veitura', 0.14, 0.77]
		]
	},
	{
		clau: 'temps-flume',
		tema: 'temps',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Un ciel rose de fin de journée au-dessus d’un grand fleuve ; en face, les quais d’une ville et deux clochers pointus, une branche nue à droite.',
		mots: [
			['la nívol', 0.4, 0.3],
			['lo flume', 0.4, 0.72],
			['lo cloquièr', 0.53, 0.58],
			['la branca', 0.88, 0.45],
			['l’èrba', 0.3, 0.9]
		]
	},
	{
		clau: 'temps-cel',
		tema: 'temps',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Un coucher de soleil rouge et orange : de longues traînées de nuages enflammés, la silhouette noire des collines et d’un arbre.',
		mots: [
			['la nívol', 0.5, 0.38],
			['lo cèl', 0.2, 0.12],
			['la fuèlha', 0.88, 0.1],
			['lo puèg', 0.7, 0.9]
		]
	},
	{
		clau: 'temps-garriga',
		tema: 'temps',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Le soir au-dessus de la garrigue : un ciel bleu et rose, des collines vertes, un chemin clair, des toits blancs au premier plan.',
		mots: [
			['la nívol', 0.41, 0.34],
			['la garriga', 0.45, 0.6],
			['lo camin', 0.87, 0.71]
		]
	},
	{
		clau: 'temps-solelh',
		tema: 'temps',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Le soleil se couche sur la mer derrière une haute falaise ; l’eau est lisse, le ciel passe du jaune au bleu.',
		mots: [
			['lo solelh', 0.5, 0.47],
			['la mar', 0.75, 0.75],
			['la pena', 0.21, 0.54]
		]
	},
	{
		clau: 'temps-fenestra',
		tema: 'temps',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Par une fenêtre ouverte dans un mur épais, la brume efface tout : on devine à peine une montagne derrière.',
		mots: [
			['la bruma', 0.55, 0.4],
			['lo ridèl', 0.1, 0.45],
			['la baranda', 0.5, 0.94]
		]
	},
	{
		clau: 'temps-bruma',
		tema: 'temps',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une ruelle de village pavée dans la brume, entre de hauts murs de pierre ; au bout, un clocher à peine visible.',
		mots: [
			['la bruma', 0.45, 0.09],
			['lo cloquièr', 0.52, 0.34],
			['la carrièra', 0.45, 0.8],
			['la paret', 0.25, 0.5]
		]
	},
	// ── Lot 4 des thèmes : fèstas e lésers (06-11) ──
	{
		clau: 'festa-camion',
		tema: 'festas',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Un fourgon aménagé garé dans un pré, toutes portes ouvertes : un lit à l’arrière, une table pliante à côté, de grands arbres derrière.',
		mots: [
			['lo forgon', 0.35, 0.38],
			['la pòrta', 0.78, 0.45],
			['l’èrba', 0.3, 0.88],
			['la ròda', 0.385, 0.7]
		]
	},
	{
		clau: 'festa-piscina',
		tema: 'festas',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une piscine d’un bleu vif au pied de grands immeubles blancs, une échelle de métal, des dalles claires au soleil.',
		mots: [
			['la piscina', 0.5, 0.5],
			['l’escala', 0.91, 0.6],
			['l’immòble', 0.77, 0.1],
			['lo carrèu', 0.55, 0.85]
		]
	},
	{
		clau: 'festa-ralh',
		tema: 'festas',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une voie ferrée toute droite qui file dans le désert vers des montagnes lointaines, sous un ciel gris.',
		mots: [
			['lo ralh', 0.83, 0.53],
			['la pèira', 0.29, 0.85],
			['la montanha', 0.4, 0.32],
			['la travèrsa', 0.6, 0.68]
		]
	},
	{
		clau: 'festa-sap',
		tema: 'festas',
		amples: [800, 1600],
		l: 1600,
		h: 2318,
		alt: 'Un sapin de Noël décoré de boules et de guirlandes dans une maison, des paquets cadeaux rouges et bleus à son pied.',
		mots: [
			['lo sap', 0.49, 0.62],
			['lo present', 0.77, 0.65],
			['la bòla', 0.43, 0.36]
		]
	},
	{
		clau: 'festa-manetge',
		tema: 'festas',
		amples: [800, 1600],
		l: 1600,
		h: 1707,
		alt: 'Une fête foraine au crépuscule : un manège illuminé de rose et de vert au pied d’une montagne boisée.',
		mots: [
			['lo manètge', 0.47, 0.8],
			['lo puèg', 0.7, 0.55],
			['lo cèl', 0.4, 0.2],
			['lo lum', 0.12, 0.9]
		]
	},
	{
		clau: 'festa-bola',
		tema: 'festas',
		amples: [1024, 1920],
		l: 1920,
		h: 1878,
		alt: 'Une rue piétonne décorée de milliers de boules roses et bleues suspendues, entre un immeuble de brique et de pierre blanche.',
		mots: [
			['la bòla', 0.3, 0.81],
			['l’immòble', 0.72, 0.35],
			['lo gratacèl', 0.47, 0.48],
			['l’arbre', 0.15, 0.51]
		]
	},
	{
		clau: 'festa-lustre',
		tema: 'festas',
		amples: [1024, 1776],
		l: 1776,
		h: 912,
		alt: 'Une rue commerçante la nuit, sous d’immenses lustres de lumière suspendus entre les façades ; des parasols éclairés plus loin.',
		mots: [
			['lo lustre', 0.58, 0.51],
			['la garlanda', 0.42, 0.41],
			['lo parasòl', 0.75, 0.9],
			['la botiga', 0.1, 0.75]
		]
	},
	{
		clau: 'festa-barraca',
		tema: 'festas',
		amples: [1024, 1776],
		l: 1776,
		h: 876,
		alt: 'Un marché de Noël la nuit : des chalets rouges illuminés, une église blanche, une haute tour à horloge, des drapeaux.',
		mots: [
			['lo relòtge', 0.6, 0.36],
			['lo drapèl', 0.06, 0.33],
			['la glèisa', 0.4, 0.72],
			['la barraca', 0.72, 0.82]
		]
	},
	{
		clau: 'festa-bicicleta',
		tema: 'festas',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Des vélos garés en rang sur une place, devant des massifs d’herbes hautes ; derrière, des arbres nus et une vieille cheminée de brique.',
		mots: [
			['la bicicleta', 0.47, 0.61],
			['la cheminièra', 0.21, 0.13],
			['la branca', 0.66, 0.13],
			['l’èrba', 0.7, 0.4],
			['la planta', 0.1, 0.46]
		]
	},
	{
		clau: 'festa-bol',
		tema: 'festas',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Dans un atelier de poterie, une tasse et des bols d’argile crue qui sèchent sur une étagère blanche, une planche de bois devant.',
		mots: [
			['la tassa', 0.17, 0.5],
			['lo bòl', 0.37, 0.51],
			['la fusta', 0.2, 0.82],
			['la paret', 0.55, 0.15]
		]
	},
	{
		clau: 'festa-estadi',
		tema: 'festas',
		amples: [1024, 1920],
		l: 1920,
		h: 1094,
		alt: 'Un grand stade de football plein à la tombée du jour : la pelouse sous les projecteurs, des tribunes peintes de bleu et de rouge.',
		mots: [
			['l’estadi', 0.84, 0.618],
			['lo terren', 0.62, 0.737],
			['lo projector', 0.05, 0.382],
			['la tribuna', 0.15, 0.55]
		]
	},
	// ── Lot 5 des thèmes : compléments de la mar e la montanha (06-11) ──
	{
		clau: 'mar-duna',
		tema: 'mar',
		amples: [1024, 1920],
		l: 1920,
		h: 1600,
		alt: 'Du haut d’une grande dune de sable blanc, une immense forêt de pins s’étend jusqu’à l’horizon.',
		mots: [
			['lo bòsc', 0.44, 0.51],
			['la duna', 0.58, 0.93],
			['l’orizont', 0.67, 0.35]
		]
	},
	{
		clau: 'mar-barralha',
		tema: 'mar',
		amples: [1024, 1920],
		l: 1920,
		h: 1076,
		alt: 'Un chemin de sable vers la plage, bordé d’une clôture de bois, entre les dunes et les buissons.',
		mots: [
			['lo camin', 0.55, 0.85],
			['la barralha', 0.84, 0.74],
			['la duna', 0.07, 0.58],
			['lo boisson', 0.6, 0.3]
		]
	},
	{
		clau: 'mar-teulats',
		tema: 'mar',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une grande ville au bord de la mer, vue d’en haut le soir : des toits de tuiles, des immeubles blancs, un port, des collines au loin.',
		mots: [
			['la mar', 0.15, 0.54],
			['lo teulat', 0.4, 0.89],
			['l’ostal', 0.78, 0.54],
			['lo puèg', 0.64, 0.46]
		]
	},
	{
		clau: 'montanha-vista',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Du haut d’un rocher sombre, une grande plaine s’étend jusqu’aux montagnes, sous un ciel chargé de nuages.',
		mots: [
			['la ròca', 0.15, 0.59],
			['la plana', 0.59, 0.59],
			['la montanha', 0.73, 0.42],
			['la nívol', 0.46, 0.14]
		]
	},
	{
		clau: 'montanha-paret',
		tema: 'montanha',
		amples: [800, 1280],
		l: 1280,
		h: 1707,
		alt: 'Un muret de pierre au bord d’un chemin, des arbres d’un vert éclatant, et derrière une montagne de calcaire clair.',
		mots: [
			['la paret', 0.28, 0.75],
			['la fuèlha', 0.85, 0.5],
			['la montanha', 0.4, 0.38],
			['lo camin', 0.09, 0.91]
		]
	},
	{
		clau: 'montanha-balma',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Vue du fond d’un gouffre : une large ouverture ronde laisse voir le ciel bleu, bordée de feuillages.',
		mots: [
			['lo cèl', 0.56, 0.44],
			['l’arbre', 0.62, 0.65],
			['l’avenc', 0.47, 0.76]
		]
	},
	{
		clau: 'montanha-nivols',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Un grand pré de montagne en pente ; plus bas, une forêt de conifères et une mer de nuages qui cache la vallée.',
		mots: [
			['lo prat', 0.4, 0.79],
			['la nívol', 0.43, 0.45],
			['lo bòsc', 0.65, 0.55]
		]
	},
	{
		clau: 'montanha-sabla',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Des dunes de sable du désert dorées par le soleil bas, des montagnes au loin.',
		mots: [
			['la duna', 0.61, 0.61],
			['la montanha', 0.2, 0.34],
			['la pesada', 0.8, 0.75],
			['la sabla', 0.5, 0.9]
		]
	},
	{
		clau: 'montanha-roja',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'De hautes falaises de roche rouge au-dessus d’une forêt de pins, sous un ciel bleu sans nuage.',
		mots: [
			['la ròca', 0.4, 0.45],
			['lo pin', 0.1, 0.39],
			['lo bòsc', 0.44, 0.64]
		]
	},
	{
		clau: 'montanha-fenda',
		tema: 'montanha',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Au fond d’un canyon très étroit, la roche rose et orange ondule comme une vague ; tout en haut, une fente de ciel.',
		mots: [
			['la ròca', 0.29, 0.59],
			['lo cèl', 0.52, 0.27],
			['lo destrech', 0.45, 0.47]
		]
	},
	{
		clau: 'montanha-torre',
		tema: 'montanha',
		amples: [800, 1280],
		l: 1280,
		h: 1707,
		alt: 'Une vieille tour de pierre perdue dans une forêt très verte, au flanc d’une montagne ; une rambarde au premier plan.',
		mots: [
			['la torre', 0.52, 0.59],
			['la montanha', 0.2, 0.29],
			['lo bòsc', 0.29, 0.61],
			['la baranda', 0.6, 0.83]
		]
	},
	{
		clau: 'montanha-arbres',
		tema: 'montanha',
		amples: [800, 1280],
		l: 1280,
		h: 1707,
		alt: 'Un sous-bois au soleil, des arbres d’un vert vif au bord d’un ravin rocheux, un coin de ciel bleu.',
		mots: [
			['l’arbre', 0.6, 0.36],
			['la ròca', 0.1, 0.64],
			['la pèira', 0.65, 0.91]
		]
	},
	{
		clau: 'montanha-arc',
		tema: 'montanha',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Par une arche de pierre en ruine, la vue s’ouvre sur une grande plaine boisée jusqu’à l’horizon.',
		mots: [
			['l’arc', 0.5, 0.1],
			['la plana', 0.5, 0.52],
			['la paret', 0.88, 0.5],
			['la pèira', 0.45, 0.875]
		]
	},
	{
		clau: 'montanha-ramas',
		tema: 'montanha',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Entre les branches d’un pin, une vallée profonde couverte de forêt et une montagne dans la lumière.',
		mots: [
			['lo pin', 0.3, 0.3],
			['la valada', 0.5, 0.71],
			['la montanha', 0.76, 0.45],
			['lo bòsc', 0.61, 0.92]
		]
	},
	{
		clau: 'montanha-crotz',
		tema: 'montanha',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Un grand tas de pierres au sommet, surmonté de deux croix de pierre, sous le ciel bleu.',
		mots: [
			['la crotz', 0.62, 0.28],
			['lo molon', 0.5, 0.7],
			['la pèira', 0.35, 0.75]
		]
	},
	{
		clau: 'montanha-agulhas',
		tema: 'montanha',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Des aiguilles de roche claire dressées au-dessus d’une large vallée sèche, des montagnes à perte de vue.',
		mots: [
			['l’agulha', 0.72, 0.55],
			['la valada', 0.3, 0.6],
			['la montanha', 0.26, 0.35]
		]
	},
	{
		clau: 'montanha-ruina',
		tema: 'montanha',
		amples: [1024, 1136],
		l: 1136,
		h: 640,
		alt: 'Un gros rocher et un reste de tour en ruine au bout d’un plateau d’herbe sèche ; en bas, une vallée dans la brume.',
		mots: [
			['la ròca', 0.2, 0.29],
			['la roïna', 0.42, 0.55],
			['l’èrba', 0.35, 0.85],
			['la valada', 0.8, 0.6]
		]
	},
	{
		clau: 'montanha-garriga',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Des collines couvertes de garrigue sous un ciel très bleu, une crête rocheuse, des arbres au premier plan.',
		mots: [
			['la garriga', 0.15, 0.5],
			['la ròca', 0.55, 0.75],
			['l’arbre', 0.86, 0.39]
		]
	},
	{
		clau: 'montanha-flors',
		tema: 'montanha',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une prairie fleurie de violet au bord d’une forêt de pins, de hautes montagnes et des nuages blancs derrière.',
		mots: [
			['la montanha', 0.7, 0.38],
			['lo pin', 0.6, 0.54],
			['lo camin', 0.75, 0.89],
			['la flor', 0.45, 0.8],
			['la nívol', 0.3, 0.29]
		]
	},
	// ── Lot 6 des thèmes : compléments de la vila (06-11) ──
	{
		clau: 'vila-veire',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Des tours de verre et d’acier vues d’en bas, qui reflètent le ciel, dans un quartier d’affaires.',
		mots: [
			['lo gratacèl', 0.39, 0.3],
			['lo cèl', 0.6, 0.2],
			['lo veire', 0.64, 0.71]
		]
	},
	{
		clau: 'vila-piramida',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'À San Francisco, une tour en forme de pyramide très pointue domine les immeubles, sous un ciel bleu.',
		mots: [
			['la piramida', 0.5, 0.39],
			['lo panèl', 0.09, 0.71],
			['l’immòble', 0.86, 0.55]
		]
	},
	{
		clau: 'vila-cirdoc',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Le bâtiment du CIRDÒC, l’Institut occitan de cultura : une façade de béton clair et de verre, une grande bannière rouge, un ciel de nuages.',
		mots: [
			['lo fanal', 0.2, 0.59],
			['la nívol', 0.35, 0.15],
			['la fenèstra', 0.6, 0.75]
		]
	},
	{
		clau: 'vila-platana',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une petite place entre des façades de pierre blonde, un clocher pointu au fond, les branches d’un arbre doré au-dessus.',
		mots: [
			['la platana', 0.5, 0.18],
			['lo cloquièr', 0.48, 0.61],
			['lo balcon', 0.83, 0.69],
			['l’ostal', 0.12, 0.65]
		]
	},
	{
		clau: 'vila-teulats',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Au-dessus des toits de tuiles d’une vieille ville, la flèche d’un clocher dans la lumière du soir ; des balcons de fer.',
		mots: [
			['lo cloquièr', 0.455, 0.29],
			['lo teulat', 0.75, 0.44],
			['lo balcon', 0.79, 0.65],
			['la fenèstra', 0.16, 0.58],
			['l’antena', 0.72, 0.2]
		]
	},
	{
		clau: 'vila-relotge',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1843,
		alt: 'Une rue étroite au crépuscule mène à une vieille porte de ville coiffée de tours pointues et d’une horloge ; des balcons, une lanterne.',
		mots: [
			['lo relòtge', 0.51, 0.795],
			['la torre', 0.58, 0.51],
			['lo balcon', 0.21, 0.75],
			['lo fanal', 0.66, 0.91]
		]
	},
	{
		clau: 'vila-cheminiera',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Depuis le haut d’une colline, une rue étroite plonge entre de vieilles façades ; au loin, des clochers et une tour moderne.',
		mots: [
			['lo teulat', 0.08, 0.48],
			['la cheminièra', 0.13, 0.3],
			['lo gratacèl', 0.62, 0.45],
			['la branca', 0.9, 0.3]
		]
	},
	{
		clau: 'vila-font',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2294,
		alt: 'Dans un grand parc, un bassin à balustrade blanche, un petit pont et un petit pavillon, sous de grands arbres.',
		mots: [
			['la font', 0.44, 0.93],
			['l’arbre', 0.54, 0.39],
			['lo pont', 0.16, 0.79],
			['l’escalièr', 0.59, 0.82]
		]
	},
	{
		clau: 'vila-catedrala',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une cathédrale éclairée au crépuscule domine les toits d’une vieille ville ; une grande rosace, un clocher carré.',
		mots: [
			['la catedrala', 0.64, 0.45],
			['lo teulat', 0.41, 0.86],
			['lo cloquièr', 0.73, 0.29],
			['la rosassa', 0.36, 0.51]
		]
	},
	{
		clau: 'vila-garlanda',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une ruelle très étroite entre de hauts murs sombres, décorée de fanions de couleur ; au bout, la lumière.',
		mots: [
			['la carrièra', 0.5, 0.8],
			['la garlanda', 0.57, 0.12],
			['la paret', 0.12, 0.5]
		]
	},
	{
		clau: 'vila-bicicleta',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Deux passants, l’un poussant un vélo, dans une rue aux murs couverts de graffitis ; des marches au premier plan.',
		mots: [
			['la bicicleta', 0.65, 0.66],
			['l’escalièr', 0.5, 0.88],
			['la paret', 0.1, 0.45],
			['lo balcon', 0.44, 0.14]
		]
	},
	{
		clau: 'vila-copola',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Un immeuble d’angle très orné, coiffé d’une tourelle blanche, entre de grandes façades à balcons ; une coupole bleue à gauche.',
		mots: [
			['la torre', 0.45, 0.3],
			['la copòla', 0.27, 0.33],
			['lo balcon', 0.85, 0.54],
			['l’immòble', 0.49, 0.66]
		]
	},
	{
		clau: 'vila-porta',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une vieille porte de bois peinte en bleu, avec une petite porte jaune en arc, des clous et une plaque de rue.',
		mots: [
			['la pòrta', 0.45, 0.61],
			['la fusta', 0.8, 0.7],
			['l’arc', 0.44, 0.29],
			['lo numèro', 0.85, 0.29]
		]
	},
	{
		clau: 'vila-pan',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'La vitrine d’une boulangerie pleine de pains et de viennoiseries, un mur de brique, une porte vitrée, une ardoise posée devant.',
		mots: [
			['lo pan', 0.2, 0.45],
			['la pòrta', 0.73, 0.62],
			['la brica', 0.49, 0.61],
			['la veirina', 0.22, 0.7]
		]
	},
	{
		clau: 'vila-parc',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Un jardin public au printemps, des arbres et de vieux murets ; derrière, un grand bâtiment à tourelles.',
		mots: [
			['l’arbre', 0.24, 0.3],
			['la torre', 0.39, 0.25],
			['la paret', 0.6, 0.88],
			['l’èrba', 0.4, 0.75]
		]
	},
	{
		clau: 'vila-fruch',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Le soir dans une rue de Paris : l’étal éclairé d’un marchand de fruits et légumes, un arrêt de bus, des arbres.',
		mots: [
			['l’arbre', 0.23, 0.29],
			['lo fruch', 0.65, 0.6],
			['la carrièra', 0.15, 0.75]
		]
	},
	{
		clau: 'vila-teula',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Un mur crépi aux encadrements de brique rouge sous un toit de tuiles, entre les feuilles d’un arbre.',
		mots: [
			['la fenèstra', 0.49, 0.53],
			['lo teulat', 0.8, 0.56],
			['la fuèlha', 0.35, 0.16],
			['la paret', 0.4, 0.7]
		]
	},
	{
		clau: 'vila-ciutat',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Une rue tranquille mène vers les remparts et les tours d’une cité médiévale, au loin ; de grands bâtiments de pierre de chaque côté.',
		mots: [
			['la muralha', 0.41, 0.57],
			['la torre', 0.58, 0.49],
			['la carrièra', 0.5, 0.92],
			['la fenèstra', 0.05, 0.35]
		]
	},
	{
		clau: 'vila-flors',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Des maisons blanches aux balcons fleuris, sous le ciel bleu ; des antennes sur les toits, un réverbère.',
		mots: [
			['lo balcon', 0.65, 0.58],
			['lo fanal', 0.27, 0.86],
			['la flor', 0.67, 0.86],
			['lo cèl', 0.4, 0.12]
		]
	},
	{
		clau: 'vila-zinc',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Les toits de zinc gris d’une grande ville, hérissés de cheminées de terre cuite et d’antennes, sous un ciel sombre.',
		mots: [
			['lo teulat', 0.76, 0.75],
			['la cheminièra', 0.52, 0.54],
			['l’antena', 0.21, 0.37]
		]
	},
	{
		clau: 'vila-jardin',
		tema: 'vila',
		amples: [1024, 1776],
		l: 1776,
		h: 1184,
		alt: 'Un parc récent : des massifs de fleurs violettes, de jeunes arbres, une pelouse ; derrière, un vieux bâtiment à deux tours.',
		mots: [
			['la flor', 0.29, 0.78],
			['l’arbre', 0.76, 0.41],
			['la torre', 0.53, 0.32],
			['l’èrba', 0.59, 0.73],
			['lo camin', 0.4, 0.93]
		]
	},
	{
		clau: 'vila-panorama',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1015,
		alt: 'Depuis un toit, la vue sur une vieille ville aux toits de tuiles ; au premier plan, une grande toiture de zinc et une balustrade de pierre.',
		mots: [
			['lo teulat', 0.21, 0.6],
			['la vila', 0.64, 0.43],
			['la baranda', 0.85, 0.86]
		]
	},
	{
		clau: 'vila-arcs',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1076,
		alt: 'Des façades de brique rose aux balcons de fer forgé, des arcades, une lanterne et des enseignes de boutiques.',
		mots: [
			['lo balcon', 0.24, 0.41],
			['lo fanal', 0.63, 0.54],
			['la fenèstra', 0.56, 0.2],
			['l’arc', 0.75, 0.68]
		]
	},
	{
		clau: 'vila-prat',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1076,
		alt: 'Une grande pelouse au soleil le long d’une promenade ; au fond, des immeubles modernes et quelques promeneurs.',
		mots: [
			['l’èrba', 0.5, 0.85],
			['l’arbre', 0.15, 0.19],
			['l’immòble', 0.31, 0.41],
			['lo camin', 0.86, 0.66]
		]
	},
	{
		clau: 'vila-olivier',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1920,
		alt: 'Une ville vue d’en haut, sa grande cathédrale au milieu des toits, des oliveraies et des montagnes derrière.',
		mots: [
			['la catedrala', 0.24, 0.68],
			['la vila', 0.6, 0.66],
			['la montanha', 0.4, 0.27],
			['la ròca', 0.85, 0.85],
			['la campanha', 0.3, 0.49]
		]
	},
	{
		clau: 'vila-ruela',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une rue étroite entre de hautes façades de pierre blonde ; au fond, la tour carrée d’une cathédrale gothique.',
		mots: [
			['lo cloquièr', 0.455, 0.2],
			['la carrièra', 0.51, 0.82],
			['lo teulat', 0.23, 0.375],
			['l’arbre', 0.45, 0.61],
			['la fenèstra', 0.88, 0.71]
		]
	},
	{
		clau: 'vila-cipres',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Un village de pierre : un haut cyprès, un olivier, un mur de pierre et le clocher pointu de l’église.',
		mots: [
			['lo cloquièr', 0.5, 0.45],
			['l’olivièr', 0.75, 0.59],
			['lo ciprès', 0.29, 0.45],
			['la paret', 0.5, 0.875]
		]
	},
	{
		clau: 'vila-terrassa',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une maison de pierre dans la verdure, une porte orange, de longues tables de bois sur la terrasse, une guirlande d’ampoules.',
		mots: [
			['l’ostal', 0.6, 0.35],
			['la taula', 0.68, 0.67],
			['l’arbre', 0.09, 0.12],
			['la cheminièra', 0.75, 0.23],
			['la pòrta', 0.59, 0.55]
		]
	},
	{
		clau: 'vila-toledo',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Tolède, en Espagne, au soleil couchant : la vieille ville sur sa colline, sa cathédrale et son château carré, le fleuve en bas.',
		mots: [
			['la vila', 0.49, 0.59],
			['lo flume', 0.5, 0.87],
			['lo castèl', 0.76, 0.39],
			['la catedrala', 0.41, 0.39]
		]
	},
	{
		clau: 'vila-grimpanta',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Un immeuble ocre à l’angle de deux rues, ses balcons de fer et ses fenêtres à volets envahis de plantes grimpantes.',
		mots: [
			['lo balcon', 0.5, 0.35],
			['la planta', 0.47, 0.75],
			['la fenèstra', 0.72, 0.5],
			['la veitura', 0.08, 0.85]
		]
	},
	{
		clau: 'vila-plana',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Depuis une ville haute, la vue sur une grande ville de plaine aux toits rouges, des montagnes bleues à l’horizon, des arbres au premier plan.',
		mots: [
			['la vila', 0.45, 0.55],
			['la montanha', 0.12, 0.455],
			['l’arbre', 0.66, 0.8],
			['la nívol', 0.25, 0.12]
		]
	},
	{
		clau: 'vila-rosa',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une rue aux façades roses et ocre, des balcons débordant de plantes, une porte gothique en brique.',
		mots: [
			['lo balcon', 0.72, 0.4],
			['la planta', 0.82, 0.25],
			['la pòrta', 0.61, 0.875],
			['la paret', 0.65, 0.59],
			['lo cèl', 0.3, 0.12]
		]
	},
	{
		clau: 'vila-museu',
		tema: 'vila',
		amples: [800, 1280],
		l: 1280,
		h: 1707,
		alt: 'À Stockholm, à travers les arbres et un érable rouge, la façade de brique à pignons du musée nordique.',
		mots: [
			['lo musèu', 0.49, 0.48],
			['la fuèlha', 0.85, 0.64],
			['l’arbre', 0.2, 0.61]
		]
	},
	{
		clau: 'vila-volets',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Une haute façade de pierre aux volets gris et aux balcons de fer, dans une rue ancienne, sous des nuages roses du soir.',
		mots: [
			['la fenèstra', 0.655, 0.25],
			['lo balcon', 0.66, 0.54],
			['lo fanal', 0.25, 0.75],
			['la nívol', 0.31, 0.09],
			['la pèira', 0.86, 0.59]
		]
	},
	{
		clau: 'vila-baranda',
		tema: 'vila',
		amples: [1024, 1920],
		l: 1920,
		h: 1440,
		alt: 'Un carrefour de ruelles en pente, des bornes de pierre, une grille et quelques marches ; du lierre sur un vieux mur.',
		mots: [
			['l’escalièr', 0.75, 0.89],
			['la baranda', 0.75, 0.72],
			['la carrièra', 0.38, 0.79],
			['la fenèstra', 0.83, 0.47],
			['la planta', 0.63, 0.62]
		]
	},
	{
		clau: 'vila-potz',
		tema: 'vila',
		amples: [800, 1600],
		l: 1600,
		h: 2133,
		alt: 'Une petite place aux maisons colorées, à l’ombre d’un grand arbre ; un vieux puits de pierre à la ferronnerie ouvragée.',
		mots: [
			['la platana', 0.63, 0.25],
			['la fenèstra', 0.28, 0.51],
			['lo balcon', 0.55, 0.54],
			['lo potz', 0.85, 0.75],
			['la plaça', 0.35, 0.84]
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
	{ id: 'monuments', nom: { oc: 'Los monuments', fr: 'Les monuments', es: 'Los monumentos', en: 'Landmarks', ca: 'Els monuments', ar: 'المعالم' } },
	{ id: 'taula', nom: { oc: 'A taula', fr: 'À table', es: 'A la mesa', en: 'At the table', ca: 'A taula', ar: 'على المائدة' } },
	{ id: 'temps', nom: { oc: 'Lo temps que fa', fr: 'Le temps qu’il fait', es: 'El tiempo que hace', en: 'The weather', ca: 'El temps que fa', ar: 'الطقس' } },
	{ id: 'festas', nom: { oc: 'Fèstas e lésers', fr: 'Fêtes et loisirs', es: 'Fiestas y ocio', en: 'Festivities and leisure', ca: 'Festes i lleure', ar: 'الأعياد والترفيه' } }
];

/** Les paysages d'un thème (tous, sans thème). */
export const deTema = (tema) => PAISATGES.filter((p) => !tema || p.tema === tema);

/** Chemin d'un fichier de paysage. */
export const camin = (clau, a) => `/apren/paisatges/${clau}-${a}.webp`;

/** srcset d'un paysage. */
export const srcset = (p) => p.amples.map((a) => `${camin(p.clau, a)} ${a}w`).join(', ');
