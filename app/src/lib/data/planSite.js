// Plan du site sur le modèle de l'accueil (2026-10-15, cahier §11) : les trois
// verbes du titre « Se parla. S’apren. Amassa. » (« Se viu » jusqu’au 2026-10-21) rangent aussi le menu et le
// pied de page, comme l'Alliance des collectivités pour la qualité de l'air
// reprend dans son menu les questions de sa page d'accueil.
// Une seule source pour le menu-voile (MenuVel) et le pied de page.
// Les rubriques à développer avant la diffusion du site ont déjà leur lien
// (choix de Romain, 2026-10-15). Occitan nouveau : À VALIDER par Romain.
import { RESERVAR } from '$lib/acuelh/donadas.js';

// Les boutons « Reservar un cors » du bandeau et du menu mènent d'abord à la
// page qui explique le cours ; c'est elle qui ouvre le calendrier (Romain,
// 2026-10-24 : « éviter d'arriver directement sur mon calendrier »).
export const VISIO = '/apren/visio';

export const PLAN = [
	{
		id: 'parla', n: '01', oc: 'Se parla', fr: 'Se parle', es: 'Se habla', en: 'Speak', ca: 'Es parla', ar: 'نتحدّث',
		// la page de la rubrique, sur le modèle de S'apren (Romain, 2026-10-25)
		href: '/parla',
		grops: [{ items: [
			{ oc: 'La carta', fr: 'La carte', es: 'El mapa', en: 'The map', ca: 'El mapa', ar: 'الخريطة', href: '/carta' },
			{ oc: 'Lo wiki', fr: 'Le wiki', es: 'El wiki', en: 'The wiki', ca: 'El wiki', ar: 'الويكي', href: '/wiki' }, // (« wiki » plutôt qu'« encyclopédie », Romain, 2026-10-15)
			// (venaient d'Amassa : le pays, ce qui s'y dit et s'y fait ; Romain, 2026-10-22)
			{ oc: 'Òbras', fr: 'Œuvres', es: 'Obras', en: 'Works', ca: 'Obres', ar: 'أعمال', href: '/obras' },
			{ oc: 'Articles', fr: 'Articles', es: 'Artículos', en: 'Articles', ca: 'Articles', ar: 'مقالات', href: '/articles' },
			// (la case Musicas de Se parla devenue Médias ; la musique est dans Òbras, 2026-10-25)
			{ oc: 'Mèdias', fr: 'Médias', es: 'Medios', en: 'Media', ca: 'Mitjans', ar: 'وسائل الإعلام', href: '/medias' }
		] }]
	},
	{
		id: 'apren', n: '02', oc: 'S’apren', fr: 'S’apprend', es: 'Se aprende', en: 'Learn', ca: 'S’aprèn', ar: 'نتعلّم',
		// la page de la rubrique, en cases de couleur (2026-10-24)
		href: '/apren',
		grops: [{ items: [
			{ oc: 'Lo parcors', fr: 'Le parcours', es: 'El recorrido', en: 'The learning path', ca: 'El recorregut', ar: 'المسار', href: '/aprene' },
			{ oc: 'Leiçon d’ensag', fr: 'Leçon d’essai', es: 'Lección de prueba', en: 'Trial lesson', ca: 'Lliçó de prova', ar: 'درس تجريبي', href: '/aprene/essai' },
			// (venait d'Amassa : « c'est de l'apprentissage », Romain, 2026-10-22)
			{ oc: 'Mots en imatges', fr: 'Mots en images', es: 'Palabras en imágenes', en: 'Words in pictures', ca: 'Paraules en imatges', ar: 'كلمات بالصور', href: '/mots' },
			// (la page qui explique le cours avant le calendrier, Romain, 2026-10-24)
			{ oc: 'Corses en visio', fr: 'Cours en visio', es: 'Clases por videollamada', en: 'Video lessons', ca: 'Classes per videotrucada', ar: 'دروس عبر الفيديو', href: VISIO },
			// (était dans l'ancien pied de page : on ne retire aucune fonction)
			{ oc: 'Ma progression', fr: 'Ma progression', es: 'Mi progreso', en: 'My progress', ca: 'El meu progrés', ar: 'تقدّمي', href: '/compte' }
		] }]
	},
	{
		// « Amassa » / « Rassemble » remplace « Se viu » / « Se vit » (Romain, 2026-10-21 :
		// « se viu ne correspond pas au contenu ») ; l'id reste 'viu' (ancres, styles)
		id: 'viu', n: '03', oc: 'Amassa', fr: 'Rassemble', es: 'Reúne', en: 'Gather', ca: 'Reuneix', ar: 'نجتمع',
		// la page de la rubrique, en cases de couleur comme S'apren (2026-10-25)
		href: '/amassa',
		// Amassa = la communauté au sens strict (Òbras et Articles partis dans
		// Se parla le 2026-10-22)
		grops: [
			// (s'appelait « Amassa », devenu le nom de la rubrique, 2026-10-21)
			{ oc: 'La comunautat', fr: 'La communauté', es: 'La comunidad', en: 'The community', ca: 'La comunitat', ar: 'المجتمع', items: [
				{ oc: 'Fòrum', fr: 'Forum', es: 'Foro', en: 'Forum', ca: 'Fòrum', ar: 'المنتدى', href: '/forum' },
				{ oc: 'Grops', fr: 'Groupes', es: 'Grupos', en: 'Groups', ca: 'Grups', ar: 'المجموعات', href: '/grops' },
				{ oc: 'Boita d’idèas', fr: 'Boîte à idées', es: 'Buzón de ideas', en: 'Idea box', ca: 'Bústia d’idees', ar: 'صندوق الأفكار', href: '/ideas' }
			] }
		]
	}
];

// La ligne du bas : qui est derrière Lo Ligam
export const LO_LIGAM = [
	{ oc: 'Mon ligam amb l’occitan', fr: 'Mon lien avec l’occitan', es: 'Mi vínculo con el occitano', en: 'My connection to Occitan', ca: 'El meu vincle amb l’occità', ar: 'صلتي باللغة الأوكسيتانية', href: '/istoria' }, // (ex-« Mon istòria », titre C de Romain, 2026-10-24)
	{ oc: 'Contacte', fr: 'Contact', es: 'Contacto', en: 'Contact', ca: 'Contacte', ar: 'التواصل', href: '/istoria#contacte' }, // (fin de Mon istòria, option A de Romain, 2026-10-24)
	{ oc: 'Instagram', fr: 'Instagram', es: 'Instagram', en: 'Instagram', ca: 'Instagram', ar: 'Instagram', href: 'https://www.instagram.com/lo_ligam/', defòra: true }
];

export { RESERVAR };
