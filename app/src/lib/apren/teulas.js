// Les cases de la page 02 S'apren (Romain, 2026-10-24 : « des blocs, des
// cases de différentes couleurs, très ludiques et très visibles, un peu comme
// les objectifs de l'ONU »). Exception assumée à la règle « une seule couleur
// vive par écran » (refonte claire, 21-10), propre aux pages de rubrique.
//
// Les couleurs suivent l'ordre des cases (la première, la grande, prend la
// première couleur) ; le texte est crème ou encre selon le fond, choisi pour
// tenir au moins 4,5:1 (mesures du 2026-10-24). Trois jeux à comparer sur
// /apren?ensag=colors, tous pris dans la charte ou dérivés d'elle.
const CREMA = '#fbf1e1';
const TINTA = '#2a1a10';

export const PALETAS = {
	// les accents de la charte (§1) : brique, pétrole, olive, bleu, or
	charta: [
		['#b53d17', CREMA],
		['#1f5f63', CREMA],
		['#55702f', CREMA],
		['#2f6a9c', CREMA],
		['#eeaf34', TINTA],
		['#6b3a5b', CREMA]
	],
	// plus sourde : rouge brique, ocre, prune, olive, pétrole
	terra: [
		['#a5342a', CREMA],
		['#c98a2b', TINTA],
		['#6b3a5b', CREMA],
		['#55702f', CREMA],
		['#1f5f63', CREMA],
		['#8a4f12', CREMA]
	],
	// plus franche, la plus proche des objectifs de l'ONU
	viu: [
		['#e8562a', TINTA],
		['#0b7372', CREMA],
		['#f6b73c', TINTA],
		['#2d6fb0', CREMA],
		['#7a3b69', CREMA],
		['#3f7a2a', CREMA]
	]
};
export const NOMS_PALETAS = [
	['charta', 'Charte'],
	['terra', 'Terre'],
	['viu', 'Vif']
];
export const PALETA_PER_DEFAUT = 'charta';

/** le pictogramme d'une case, d'après l'endroit où elle mène */
export function pictoPer(href = '') {
	if (href.startsWith('/apren/visio') || href.startsWith('https://calendar.proton.me')) return 'visio';
	if (href.startsWith('/aprene/essai')) return 'ensag';
	if (href.startsWith('/aprene')) return 'parcors';
	if (href.startsWith('/mots')) return 'mots';
	if (href.startsWith('/compte')) return 'progression';
	// les portes de Se parla (2026-10-25)
	if (href.startsWith('/carta')) return 'carta';
	if (href.startsWith('/wiki')) return 'wiki';
	if (href.startsWith('/obras')) return 'obras';
	if (href.startsWith('/articles')) return 'articles';
	// les cases d'Amassa (2026-10-25)
	if (href.startsWith('/grops')) return 'grops';
	if (href.startsWith('/forum')) return 'forum';
	if (href.startsWith('/ideas')) return 'ideas';
	if (href.includes('instagram.com')) return 'imatges';
	return 'autre';
}
