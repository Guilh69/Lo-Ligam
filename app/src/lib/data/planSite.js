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
		id: 'parla', n: '01', oc: 'Se parla', fr: 'Se parle', es: 'Se habla',
		// la page de la rubrique, sur le modèle de S'apren (Romain, 2026-10-25)
		href: '/parla',
		grops: [{ items: [
			{ oc: 'La carta', fr: 'La carte', es: 'El mapa', href: '/carta' },
			{ oc: 'Lo wiki', fr: 'Le wiki', es: 'El wiki', href: '/wiki' }, // (« wiki » plutôt qu'« encyclopédie », Romain, 2026-10-15)
			// (venaient d'Amassa : le pays, ce qui s'y dit et s'y fait ; Romain, 2026-10-22)
			{ oc: 'Òbras', fr: 'Œuvres', es: 'Obras', href: '/obras' },
			{ oc: 'Articles', fr: 'Articles', es: 'Artículos', href: '/articles' },
			// (la case Musicas de Se parla devenue Médias ; la musique est dans Òbras, 2026-10-25)
			{ oc: 'Mèdias', fr: 'Médias', es: 'Medios', href: '/medias' }
		] }]
	},
	{
		id: 'apren', n: '02', oc: 'S’apren', fr: 'S’apprend', es: 'Se aprende',
		// la page de la rubrique, en cases de couleur (2026-10-24)
		href: '/apren',
		grops: [{ items: [
			{ oc: 'Lo parcors', fr: 'Le parcours', es: 'El recorrido', href: '/aprene' },
			{ oc: 'Leiçon d’ensag', fr: 'Leçon d’essai', es: 'Lección de prueba', href: '/aprene/essai' },
			// (venait d'Amassa : « c'est de l'apprentissage », Romain, 2026-10-22)
			{ oc: 'Mots en imatges', fr: 'Mots en images', es: 'Palabras en imágenes', href: '/mots' },
			// (la page qui explique le cours avant le calendrier, Romain, 2026-10-24)
			{ oc: 'Corses en visio', fr: 'Cours en visio', es: 'Clases por videollamada', href: VISIO },
			// (était dans l'ancien pied de page : on ne retire aucune fonction)
			{ oc: 'Ma progression', fr: 'Ma progression', es: 'Mi progreso', href: '/compte' }
		] }]
	},
	{
		// « Amassa » / « Rassemble » remplace « Se viu » / « Se vit » (Romain, 2026-10-21 :
		// « se viu ne correspond pas au contenu ») ; l'id reste 'viu' (ancres, styles)
		id: 'viu', n: '03', oc: 'Amassa', fr: 'Rassemble', es: 'Se reúne',
		// la page de la rubrique, en cases de couleur comme S'apren (2026-10-25)
		href: '/amassa',
		// Amassa = la communauté au sens strict (Òbras et Articles partis dans
		// Se parla le 2026-10-22)
		grops: [
			// (s'appelait « Amassa », devenu le nom de la rubrique, 2026-10-21)
			{ oc: 'La comunautat', fr: 'La communauté', es: 'La comunidad', items: [
				{ oc: 'Fòrum', fr: 'Forum', es: 'Foro', href: '/forum' },
				{ oc: 'Grops', fr: 'Groupes', es: 'Grupos', href: '/grops' },
				{ oc: 'Boita d’idèas', fr: 'Boîte à idées', es: 'Buzón de ideas', href: '/ideas' }
			] }
		]
	}
];

// La ligne du bas : qui est derrière Lo Ligam
export const LO_LIGAM = [
	{ oc: 'Mon ligam amb l’occitan', fr: 'Mon lien avec l’occitan', es: 'Mi vínculo con el occitano', href: '/istoria' }, // (ex-« Mon istòria », titre C de Romain, 2026-10-24)
	{ oc: 'Contacte', fr: 'Contact', es: 'Contacto', href: '/istoria#contacte' }, // (fin de Mon istòria, option A de Romain, 2026-10-24)
	{ oc: 'Instagram', fr: 'Instagram', es: 'Instagram', href: 'https://www.instagram.com/lo_ligam/', defòra: true }
];

export { RESERVAR };
