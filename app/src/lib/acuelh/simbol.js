// Géométrie du logo (favicon.svg, normalisée), partagée par la constellation
// du moteur et le grand symbole dessiné du 4e chemin.
// 0 = centre ; 1-12 = pommettes dans le sens des aiguilles d'une montre.
export const P = [
	[0, 0],
	[0, -1], [0.486, -0.797], [0.809, -0.48], [1, 0], [0.809, 0.48], [0.486, 0.797],
	[0, 0.992], [-0.468, 0.797], [-0.786, 0.48], [-0.976, 0.009], [-0.786, -0.48], [-0.468, -0.797]
];
export const BRANCAS = [2, 3, 5, 6, 8, 9, 11, 12]; // reliées au centre
export const ARCS = [[12, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [9, 10], [10, 11]];

// Tracés SVG du symbole (même dessin que simbolSVG dans l'esbòs) :
// k = facteur d'épaisseur (les branches sont un peu plus fines que les arcs)
export const TRAÇATS = [
	...BRANCAS.map((i) => ({ d: `M0 0L${P[i][0]} ${P[i][1]}`, k: 0.9 })),
	...ARCS.map(([a, b]) => {
		const [ax, ay] = P[a], [bx, by] = P[b];
		return { d: `M${ax} ${ay}Q${(ax + bx) * 0.415} ${(ay + by) * 0.415} ${bx} ${by}`, k: 1 };
	})
];
