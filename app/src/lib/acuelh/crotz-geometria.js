// La géométrie de la croix occitane du logo (Crotz.svelte : favicon.svg normalisée, rayon 1,
// centre en 0 0), partagée par CrotzCarga.svelte (essai /ensag/crotz) et par le chemin de
// S'apren (MiegTres.svelte, variante C choisie par Romain le 2026-11-03).

// les douze points, dans l'ordre où ils s'allument : depuis le haut, dans le sens des aiguilles
// d'une montre
export const PONCHS = [
	[0, -1],
	[0.486, -0.797],
	[0.809, -0.48],
	[1, 0],
	[0.809, 0.48],
	[0.486, 0.797],
	[0, 0.992],
	[-0.468, 0.797],
	[-0.786, 0.48],
	[-0.976, 0.009],
	[-0.786, -0.48],
	[-0.468, -0.797]
];

// les huit rayons qui vont du moyeu aux points intermédiaires
export const RAIS = 'M0 0L0.486 -0.797M0 0L0.809 -0.48M0 0L0.809 0.48M0 0L0.486 0.797M0 0L-0.468 0.797M0 0L-0.786 0.48M0 0L-0.786 -0.48M0 0L-0.468 -0.797';

// les huit arcs entre les points
export const ARCS =
	'M-0.468 -0.797Q-0.194 -0.746 0 -1M0 -1Q0.202 -0.746 0.486 -0.797M0.809 -0.48Q0.751 -0.199 1 0M1 0Q0.751 0.199 0.809 0.48M0.486 0.797Q0.202 0.742 0 0.992M0 0.992Q-0.194 0.742 -0.468 0.797M-0.786 0.48Q-0.731 0.203 -0.976 0.009M-0.976 0.009Q-0.731 -0.195 -0.786 -0.48';

// les mêmes rayons et arcs, un par un (pour les tracer séparément) ; RAI_POINTS[i] est le point
// atteint par le rayon i, ARC_POINTS[i] les deux points que relie l'arc i (numérotés comme PONCHS)
export const RAI_LISTE = RAIS.slice(1).split('M').map((s) => 'M' + s);
export const RAI_POINTS = [1, 2, 4, 5, 7, 8, 10, 11];
export const ARC_LISTE = ARCS.slice(1).split('M').map((s) => 'M' + s);
export const ARC_POINTS = [
	[11, 0],
	[0, 1],
	[2, 3],
	[3, 4],
	[5, 6],
	[6, 7],
	[8, 9],
	[9, 10]
];

// Le chemin de S'apren : les quatre ronds et les trois courbes de Bézier cubiques qui les relient
// (le tracé historique « M22 120 C 70 120 66 88 108 84 S 168 70 178 44 S 214 24 238 20 », où le
// premier point de contrôle d'un S est le symétrique du précédent par rapport au point d'arrivée).
export const CAMIN_ROND = [
	{ x: 22, y: 120 },
	{ x: 108, y: 84 },
	{ x: 178, y: 44 },
	{ x: 238, y: 20 }
];
const CAMIN_COURBES = [
	[[22, 120], [70, 120], [66, 88], [108, 84]],
	[[108, 84], [150, 80], [168, 70], [178, 44]],
	[[178, 44], [188, 18], [214, 24], [238, 20]]
];

const ptBezier = (P, t) => {
	const u = 1 - t;
	return [0, 1].map((i) => u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i]);
};
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
// coupe une courbe en t : [partie avant, partie après]
const coupe = (P, t) => {
	const a = lerp(P[0], P[1], t);
	const b = lerp(P[1], P[2], t);
	const c = lerp(P[2], P[3], t);
	const d = lerp(a, b, t);
	const e = lerp(b, c, t);
	const f = lerp(d, e, t);
	return [[P[0], a, d, f], [f, e, c, P[3]]];
};
const morceau = (P, t0, t1) => {
	const [avant] = coupe(P, t1);
	return t0 > 0 ? coupe(avant, t0 / t1)[1] : avant;
};
// plus petit t (depuis le départ) où la courbe sort du cercle de centre c et de rayon r ;
// avec `fin`, plus grand t (depuis l'arrivée) où elle en sort
function sortie(P, c, r, fin) {
	const dist = (t) => Math.hypot(...ptBezier(P, t).map((v, i) => v - c[i]));
	let dedans = fin ? 1 : 0;
	let dehors = fin ? 0 : 1;
	for (let i = 0; i < 40; i++) {
		const milieu = (dedans + dehors) / 2;
		if (dist(milieu) < r) dedans = milieu;
		else dehors = milieu;
	}
	return dehors;
}

// Les trois courbes, rognées pour s'arrêter à `marge` unités des ronds (le filet n'entre pas dans
// les ronds ; `rayons[n]` est le rayon du rond n, double cercle compris) ; chaque courbe est un
// tracé « M… C… » prêt pour un <path>.
export function segmentsCamin(rayons, marge) {
	return CAMIN_COURBES.map((P, i) => {
		const t0 = sortie(P, [CAMIN_ROND[i].x, CAMIN_ROND[i].y], rayons[i] + marge, false);
		const t1 = sortie(P, [CAMIN_ROND[i + 1].x, CAMIN_ROND[i + 1].y], rayons[i + 1] + marge, true);
		const [a, b, c, d] = morceau(P, t0, t1);
		const f = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
		return `M${f(a)}C${f(b)} ${f(c)} ${f(d)}`;
	});
}
