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
		id: 'parla', n: '01', oc: 'Se parla', fr: 'Se parle',
		grops: [{ items: [
			{ oc: 'La carta', fr: 'La carte', href: '/carta' },
			{ oc: 'Lo wiki', fr: 'Le wiki', href: '/wiki' }, // (« wiki » plutôt qu'« encyclopédie », Romain, 2026-10-15)
			// (venaient d'Amassa : le pays, ce qui s'y dit et s'y fait ; Romain, 2026-10-22)
			{ oc: 'Òbras', fr: 'Œuvres', href: '/obras' },
			{ oc: 'Articles', fr: 'Articles', href: '/articles' }
		] }]
	},
	{
		id: 'apren', n: '02', oc: 'S’apren', fr: 'S’apprend',
		// la page de la rubrique, en cases de couleur (2026-10-24)
		href: '/apren',
		grops: [{ items: [
			{ oc: 'Lo parcors', fr: 'Le parcours', href: '/aprene' },
			{ oc: 'Leiçon d’ensag', fr: 'Leçon d’essai', href: '/aprene/essai' },
			// (venait d'Amassa : « c'est de l'apprentissage », Romain, 2026-10-22)
			{ oc: 'Mots en imatges', fr: 'Mots en images', href: '/mots' },
			// (la page qui explique le cours avant le calendrier, Romain, 2026-10-24)
			{ oc: 'Corses en visio', fr: 'Cours en visio', href: VISIO },
			// (était dans l'ancien pied de page : on ne retire aucune fonction)
			{ oc: 'Ma progression', fr: 'Ma progression', href: '/compte' }
		] }]
	},
	{
		// « Amassa » / « Rassemble » remplace « Se viu » / « Se vit » (Romain, 2026-10-21 :
		// « se viu ne correspond pas au contenu ») ; l'id reste 'viu' (ancres, styles)
		id: 'viu', n: '03', oc: 'Amassa', fr: 'Rassemble',
		// Amassa = la communauté au sens strict (Òbras et Articles partis dans
		// Se parla le 2026-10-22)
		grops: [
			// (s'appelait « Amassa », devenu le nom de la rubrique, 2026-10-21)
			{ oc: 'La comunautat', fr: 'La communauté', items: [
				{ oc: 'Fòrum', fr: 'Forum', href: '/forum' },
				{ oc: 'Grops', fr: 'Groupes', href: '/grops' },
				{ oc: 'Boita d’idèas', fr: 'Boîte à idées', href: '/ideas' }
			] }
		]
	}
];

// La ligne du bas : qui est derrière Lo Ligam
export const LO_LIGAM = [
	{ oc: 'Mon ligam amb l’occitan', fr: 'Mon lien avec l’occitan', href: '/istoria' }, // (ex-« Mon istòria », titre C de Romain, 2026-10-24)
	{ oc: 'Contacte', fr: 'Contact', href: '/istoria#contacte' }, // (fin de Mon istòria, option A de Romain, 2026-10-24)
	{ oc: 'Instagram', fr: 'Instagram', href: 'https://www.instagram.com/lo_ligam/', defòra: true }
];

export { RESERVAR };
