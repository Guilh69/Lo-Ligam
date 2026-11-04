import { describe, expect, it } from 'vitest';
import { ARC_LISTE, ARC_POINTS, CAMIN_ROND, PONCHS, RAI_LISTE, RAI_POINTS, segmentsCamin } from './crotz-geometria.js';

const nombres = (d) => d.match(/-?\d+(\.\d+)?/g).map(Number);
const proche = (a, b, tol = 0.001) => Math.abs(a - b) < tol;

describe('croix du logo, rayons et arcs un par un', () => {
	it('huit rayons et huit arcs', () => {
		expect(RAI_LISTE).toHaveLength(8);
		expect(ARC_LISTE).toHaveLength(8);
		expect(RAI_POINTS).toHaveLength(8);
		expect(ARC_POINTS).toHaveLength(8);
	});

	it('chaque rayon part du moyeu et aboutit au point annoncé', () => {
		RAI_LISTE.forEach((d, i) => {
			const n = nombres(d);
			expect(n.slice(0, 2)).toEqual([0, 0]);
			const [x, y] = PONCHS[RAI_POINTS[i]];
			expect(proche(n[2], x) && proche(n[3], y)).toBe(true);
		});
	});

	it('chaque arc relie les deux points annoncés', () => {
		ARC_LISTE.forEach((d, i) => {
			const n = nombres(d);
			const [a, b] = ARC_POINTS[i];
			expect(proche(n[0], PONCHS[a][0]) && proche(n[1], PONCHS[a][1])).toBe(true);
			expect(proche(n[4], PONCHS[b][0]) && proche(n[5], PONCHS[b][1])).toBe(true);
		});
	});
});

describe('chemin de S’apren', () => {
	it('trois courbes qui s’arrêtent à la marge des ronds, sans y entrer', () => {
		const rayons = [15, 15, 15, 17.6]; // le dernier rond porte un double cercle
		const marge = 2;
		const segments = segmentsCamin(rayons, marge);
		expect(segments).toHaveLength(3);
		segments.forEach((d, i) => {
			const n = nombres(d);
			expect(n).toHaveLength(8);
			const depart = Math.hypot(n[0] - CAMIN_ROND[i].x, n[1] - CAMIN_ROND[i].y);
			const arrivee = Math.hypot(n[6] - CAMIN_ROND[i + 1].x, n[7] - CAMIN_ROND[i + 1].y);
			expect(Math.abs(depart - (rayons[i] + marge))).toBeLessThan(0.05);
			expect(Math.abs(arrivee - (rayons[i + 1] + marge))).toBeLessThan(0.05);
		});
	});

	it('chaque courbe va du rond i vers le rond i + 1', () => {
		segmentsCamin([15, 15, 15, 17.6], 2).forEach((d, i) => {
			const n = nombres(d);
			const versSuivant = (x, y) => Math.hypot(x - CAMIN_ROND[i + 1].x, y - CAMIN_ROND[i + 1].y);
			expect(versSuivant(n[0], n[1])).toBeGreaterThan(versSuivant(n[6], n[7]));
		});
	});
});
