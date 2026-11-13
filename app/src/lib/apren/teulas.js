// Les cases de la page 02 S'apren (Romain, 2026-10-24 : « des blocs, des
// cases de différentes couleurs, très ludiques et très visibles, un peu comme
// les objectifs de l'ONU »). Exception assumée à la règle « une seule couleur
// vive par écran » (refonte claire, 21-10), propre aux pages de rubrique.
//
// Les couleurs suivent l'ordre des cases (la première, la grande, prend la
// première couleur) ; le texte est crème ou encre selon le fond, choisi pour
// tenir au moins 4,5:1 (mesures du 2026-10-24). Trois jeux à comparer sur
// /apren?ensag=colors, tous pris dans la charte ou dérivés d'elle.
// Les teintes viennent de lib/styles/palette.js (2026-11-07) : la palette
// « charta » est CASES ; les camaïeux des sous-pages partent de la même teinte.
import { CASES, TEINTES, TEINTES_DEFAUT } from '$lib/styles/palette.js';
import { oklch, depuisOklch, contraste } from '$lib/palette/coherence.js';

// Un camaïeu suit sa teinte mère. Tant qu'elle a sa valeur d'origine, ses nuances sont celles choisies à la
// main. Si Romain la change depuis le site (lib/colors, 2026-11-13), chaque nuance garde son écart à la
// teinte mère (clarté, intensité, teinte), et son texte est celui des deux qui s'y lit le mieux.
function seguir(nom, cases) {
	const origina = TEINTES_DEFAUT[nom],
		actuala = TEINTES[nom];
	if (origina === actuala) return cases;
	const o = oklch(origina),
		a = oklch(actuala);
	const tintas = [TEINTES.creme, TEINTES.encre];
	const melhora = (c) => tintas.reduce((m, t) => (contraste(c, t) > contraste(c, m) ? t : m));
	return cases.map(([fons], i) => {
		if (i === 0) return [fons, melhora(fons)];
		const n = oklch(fons);
		let c = depuisOklch(Math.min(0.97, Math.max(0.12, a.L + n.L - o.L)), o.C > 0.01 ? (n.C * a.C) / o.C : n.C, a.H + n.H - o.H);
		let t = melhora(c);
		// une nuance moyenne où ni le clair ni le foncé ne tiennent 4,5:1 : elle s'écarte un peu de son texte
		for (let k = 0; k < 25 && contraste(c, t) < 4.5; k++) {
			const x = oklch(c);
			c = depuisOklch(Math.min(0.99, Math.max(0.05, x.L + (oklch(t).L > 0.5 ? -0.02 : 0.02))), x.C, x.H);
			t = melhora(c);
		}
		return [c, t];
	});
}

// (Lus au moment de s'en servir, pas recopiés ici : Romain change les couleurs depuis le site,
// lib/colors, 2026-11-13.)

export const PALETAS = {
	// les accents de la charte (§1) : brique, pétrole, olive, bleu, or
	charta: CASES,
	// plus sourde : rouge brique, ocre, prune, olive, pétrole
	get terra() {
		const CREMA = TEINTES.creme,
			TINTA = TEINTES.encre;
		return [
			['#a5342a', CREMA],
			['#c98a2b', TINTA],
			['#6b3a5b', CREMA],
			['#55702f', CREMA],
			['#1f5f63', CREMA],
			['#8a4f12', CREMA]
		];
	},
	// plus franche, la plus proche des objectifs de l'ONU
	get viu() {
		const CREMA = TEINTES.creme,
			TINTA = TEINTES.encre;
		return [
			['#e8562a', TINTA],
			['#0b7372', CREMA],
			['#f6b73c', TINTA],
			['#2d6fb0', CREMA],
			['#7a3b69', CREMA],
			['#3f7a2a', CREMA]
		];
	},
	// Les sous-pages prennent les teintes de leur case dans Se parla (Romain,
	// 2026-10-25 : « si on va dans Òbras, un camaïeu de vert… dans les médias,
	// du jaune ») : on sait où l'on est, et l'on ne confond pas avec la page
	// d'avant. La première case garde la couleur de la case mère ; texte
	// choisi pour tenir 4,5:1 au moins.
	get verd() {
		const CREMA = TEINTES.creme,
			TINTA = TEINTES.encre;
		return seguir('olive', [
			[TEINTES.olive, CREMA],
			['#353c1a', CREMA],
			['#879764', TINTA],
			['#b0b791', TINTA],
			['#425223', CREMA],
			['#4a5f28', CREMA]
		]);
	},
	get aur() {
		const CREMA = TEINTES.creme,
			TINTA = TEINTES.encre;
		return seguir('or', [
			[TEINTES.or, TINTA],
			['#79591c', CREMA],
			['#f2c368', TINTA],
			['#f5d393', TINTA],
			['#aa7d26', TINTA],
			['#c8932c', TINTA]
		]);
	},
	get blau() {
		const CREMA = TEINTES.creme,
			TINTA = TEINTES.encre;
		return seguir('bleu', [
			[TEINTES.bleu, CREMA],
			['#233a4b', CREMA],
			['#6c92b1', TINTA],
			['#9fb4c2', TINTA],
			['#284e6d', CREMA],
			['#2b5a81', CREMA]
		]);
	}
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
	// Anem !, l'espace des petits, à la place de la leçon d'essai (2026-11-05)
	if (href.startsWith('/anem')) return 'anem';
	// Jòcs, les jeux pour apprendre, rubrique de S'apren (2026-11-05) : le dé
	if (href.startsWith('/apren/jocs')) return 'jocs';
	// Remira, la page de calme, rubrique de S'apren (2026-11-05) : la poussière qui se pose en mot
	if (href.startsWith('/apren/remira')) return 'remira';
	if (href.startsWith('/apren/gramatica')) return 'wiki';
	if (href.startsWith('/aprene')) return 'parcors';
	if (href.startsWith('/mots')) return 'mots';
	if (href.startsWith('/compte')) return 'progression';
	// les portes de Se parla (2026-10-25)
	if (href.startsWith('/carta')) return 'carta';
	if (href.startsWith('/wiki')) return 'wiki';
	// Cultura, à la place du wiki (2026-11-04) : un soleil
	if (href.startsWith('/cultura')) return 'cultura';
	if (href.startsWith('/obras#musicas') || href.startsWith('/ensag/musica')) return 'musica';
	// Òbras par art et Médias (2026-10-25)
	if (href.startsWith('/medias/television')) return 'television';
	if (href.startsWith('/medias/premsa')) return 'articles';
	if (href.startsWith('/medias/livres')) return 'literatura';
	if (href.startsWith('/medias')) return 'medias';
	if (href.startsWith('/obras/literatura')) return 'literatura';
	if (href.startsWith('/obras/cinema')) return 'cinema';
	if (href.startsWith('/obras/afichas')) return 'pintura';
	if (href.includes('#scena')) return 'scena';
	if (href.startsWith('/obras')) return 'obras';
	if (href.startsWith('/articles')) return 'articles';
	// les cases d'Amassa (2026-10-25)
	if (href.startsWith('/grops')) return 'grops';
	if (href.startsWith('/forum')) return 'forum';
	if (href.startsWith('/ideas')) return 'ideas';
	if (href.includes('instagram.com')) return 'imatges';
	// les cases de S'imagina (2026-11-12) : la Constitution (un fronton) et les rues (deux plaques)
	if (href.startsWith('/constitucion')) return 'constitucion';
	if (href.startsWith('/imagina/carrieras')) return 'carrieras';
	return 'autre';
}
