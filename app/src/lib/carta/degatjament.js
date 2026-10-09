// Dégagement des ponchs (icônes de points) : un ponch ne doit pas cacher un nom
// de ville. Les noms sont dessinés dans les tuiles, donc on en estime la place
// à partir de la liste des communes (position, population) : une grande ville a
// son nom centré sur le point, un village l'a au-dessus ou à droite.
// Le nom ne bouge jamais ; c'est le ponch qui se décale, relié au lieu par un
// trait fin. Fonctions pures : testables sans carte.

export const RAYON = 13; // rayon du corps du ponch (26 px)
const MARGE = 2;
// position par défaut du centre du ponch : au-dessus du lieu (corps + trait de 8 px)
export const DEFAUT = [0, -21];

// population minimale d'un nom affiché dans les tuiles, selon le zoom
const popMin = (z) => (z >= 13 ? 0 : z >= 12 ? 100 : z >= 11 ? 400 : z >= 10 ? 2500 : z >= 9 ? 12000 : 60000);
export const placeVisible = (pop, z) => (pop ?? 0) >= popMin(z);

// zone estimée de l'étiquette d'une commune dont le point est en (x, y)
// boîte exacte d'un nom dessiné par la carte elle-même
export const zonaCaixa = (b) => ({ x0: b[0], y0: b[1], x1: b[2], y1: b[3], poids: 1.5 });

export function zonaEtiqueta(x, y, nom, pop, z = 11) {
	const gran = pop >= 100000;
	// (les noms des grandes villes grossissent avec le zoom)
	const f = gran ? 21 + Math.max(0, z - 11) * 2 : pop >= 20000 ? 15 : pop >= 3000 ? 13 : 11.5;
	const w = nom.length * f * (gran ? 0.8 : 0.55);
	if (pop >= 50000) return { x0: x - w / 2 - 4, x1: x + w / 2 + 4, y0: y - f * 0.6 - 2, y1: y + f * 0.6 + 2, poids: 1.5 };
	// (place incertaine : au-dessus, à droite ou centré : on y tient moins)
	return { x0: x - w / 2 - 4, x1: x + w + 10, y0: y - f - 6, y1: y + f * 0.5 + 4, poids: 0.6 };
}

// surface commune entre le carré du ponch centré en (cx, cy) et une zone
function recouvrement(cx, cy, z) {
	const r = RAYON + MARGE;
	const w = Math.min(cx + r, z.x1) - Math.max(cx - r, z.x0);
	const h = Math.min(cy + r, z.y1) - Math.max(cy - r, z.y0);
	return w > 0 && h > 0 ? w * h * z.poids : 0;
}

// candidats : d'abord au-dessus, puis à côté, puis en dessous ; ensuite plus
// loin (le trait s'allonge). Rayon 21 = juste à côté du lieu.
const ANGLES = [-90, -45, -135, 0, 180, 45, 135, 90];
// (un sol rayon : l'icône reste toujours collée à son lieu, jamais au bout
// d'un long trait)
const RAYONS = [21];
const CANDIDATS = RAYONS.flatMap((r) =>
	ANGLES.map((a) => [Math.round(r * Math.cos((a * Math.PI) / 180)), Math.round(r * Math.sin((a * Math.PI) / 180))])
);

// points : [{x, y}] positions à l'écran ; zones : étiquettes estimées.
// Renvoie, pour chaque point, le décalage [dx, dy] du centre de son ponch et
// s'il a la place (sinon il reste une étoile jusqu'à ce qu'on s'approche).
export function degatjar(points, zones) {
	const posats = [];
	return points.map((p) => {
		let melhor = DEFAUT;
		let melhorNota = Infinity;
		for (const [dx, dy] of CANDIDATS) {
			const cx = p.x + dx;
			const cy = p.y + dy;
			let nota = 0;
			for (const z of zones) nota += recouvrement(cx, cy, z);
			// deux ponchs ne se recouvrent pas non plus
			for (const q of posats) {
				const d = Math.hypot(cx - q.x, cy - q.y);
				if (d < 2 * RAYON + 2) nota += (2 * RAYON + 2 - d) * 70;
			}
			// à égalité, préférer le plus proche (l'ordre des candidats)
			if (nota < melhorNota) {
				melhor = [dx, dy];
				melhorNota = nota;
				if (nota === 0) break;
			}
		}
		const plaça = melhorNota < 40;
		if (plaça) posats.push({ x: p.x + melhor[0], y: p.y + melhor[1] });
		return [melhor[0], melhor[1], plaça];
	});
}
