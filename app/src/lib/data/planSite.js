// Plan du site sur le modèle de l'accueil (2026-10-15, option 2 de Romain) :
// les trois verbes du titre « Se parla. S'apren. Se viu. » rangent aussi le
// menu et le pied de page, comme l'Alliance des collectivités pour la qualité
// de l'air reprend dans son menu les questions de sa page d'accueil.
// Une seule source pour le menu-voile (MenuVel) et le pied de page.
// Les rubriques à développer avant la diffusion du site ont déjà leur lien
// (choix de Romain, 2026-10-15). Occitan nouveau : À VALIDER par Romain.
import { RESERVAR } from '$lib/acuelh/donadas.js';

export const PLAN = [
	{
		id: 'parla', n: '01', oc: 'Se parla', fr: 'Se parle',
		grops: [{ items: [
			{ oc: 'La carta', fr: 'La carte', href: '/carta' },
			{ oc: 'L’enciclopèdia', fr: 'L’encyclopédie', href: '/enciclopedia' }
		] }]
	},
	{
		id: 'apren', n: '02', oc: 'S’apren', fr: 'S’apprend',
		grops: [{ items: [
			{ oc: 'Lo parcors', fr: 'Le parcours', href: '/aprene' },
			{ oc: 'Leiçon d’ensag', fr: 'Leçon d’essai', href: '/aprene/essai' },
			{ oc: 'Corses en visio', fr: 'Cours en visio', href: RESERVAR, defòra: true }
		] }]
	},
	{
		id: 'viu', n: '03', oc: 'Se viu', fr: 'Se vit',
		grops: [
			{ oc: 'Descobrir', fr: 'Découvrir', items: [
				{ oc: 'Mots en imatges', fr: 'Mots en images', href: '/mots' },
				{ oc: 'Òbras', fr: 'Œuvres', href: '/obras' },
				{ oc: 'Articles', fr: 'Articles', href: '/articles' }
			] },
			{ oc: 'Amassa', fr: 'Ensemble', items: [
				{ oc: 'Fòrum', fr: 'Forum', href: '/forum' },
				{ oc: 'Grops', fr: 'Groupes', href: '/grops' },
				{ oc: 'Boita d’idèas', fr: 'Boîte à idées', href: '/ideas' }
			] }
		]
	}
];

// La ligne du bas : qui est derrière Lo Ligam
export const LO_LIGAM = [
	{ oc: 'Mon istòria', fr: 'Mon histoire', href: '/istoria' },
	{ oc: 'Contacte', fr: 'Contact', href: '/contacte' },
	{ oc: 'Instagram', fr: 'Instagram', href: 'https://www.instagram.com/lo_ligam/', defòra: true }
];

export { RESERVAR };
