// Les petites animations ne font bouger que les traits du dessin (Romain, 06-11),
// et chaque trait finit à sa place : la fin de l'animation est le dessin de départ.
import { describe, it, expect } from 'vitest';
import { ANIMACIONS, prepAnim, distAnim, posCai, tremolDe, bransolDe, ressautDe, eslumDe, ondulaEnv, segments } from './animacions.js';
import { DESSENHS } from './dessenhs.js';
import { SCENAS } from './scenas.js';

const MOTS = new Set(SCENAS.flatMap((s) => s.mots.map(([oc]) => oc)));
const GENRES = new Set(['dur', 'tremol', 'cai', 'ondula', 'ressaut', 'bransol', 'eslum', 'vibrar']);

describe('petites animations de la poussière d’or', () => {
	it('chaque animation vise un mot dessiné et des traits qui existent', () => {
		for (const [k, a] of Object.entries(ANIMACIONS)) {
			expect(MOTS.has(k), k).toBe(true);
			expect(DESSENHS[k], k).toBeTruthy();
			for (const g of Object.keys(a)) expect(GENRES.has(g), `${k} : ${g}`).toBe(true); // rien d'ajouté au dessin
			for (const g of ['cai', 'ondula', 'ressaut', 'eslum'])
				if (a[g]) for (const i of a[g].i) expect(DESSENHS[k][i], `${k} : ${g} ${i}`).toBeTruthy();
			if (a.cai?.separa) for (const i of a.cai.i) expect(DESSENHS[k][i], k).toMatch(/^(M[\d.\s-]+L[\d.\s-]+)+$/);
			if (a.ondula) for (const i of a.ondula.i) expect(DESSENHS[k][i], k).not.toMatch(/[Aa]/); // pas d'arc dans un trait qui ondule
		}
	});

	it('courtes, et l’éclair reste sous le seuil des flashs', () => {
		for (const [k, a] of Object.entries(ANIMACIONS)) {
			expect(a.dur, k).toBeGreaterThan(0);
			expect(a.dur, k).toBeLessThanOrEqual(6);
			if (a.eslum) {
				// deux éclairs au plus, à plus de 0,2 s l’un de l’autre (moins de trois par seconde)
				expect(a.eslum.t.length, k).toBeLessThanOrEqual(2);
				for (let i = 1; i < a.eslum.t.length; i++) expect(a.eslum.t[i] - a.eslum.t[i - 1], k).toBeGreaterThan(0.2);
			}
		}
	});

	it('la distance démarre et s’arrête en douceur, et tombe juste', () => {
		expect(distAnim(0, 76)).toBeCloseTo(0, 6);
		expect(distAnim(1, 76)).toBeCloseTo(76, 6);
		let avant = 0;
		for (let u = 0.01; u <= 1; u += 0.01) {
			const d = distAnim(u, 76);
			expect(d).toBeGreaterThanOrEqual(avant - 1e-9);
			avant = d;
		}
	});

	it('au début et à la fin, chaque trait est à sa place, entièrement visible', () => {
		for (const k of Object.keys(ANIMACIONS)) {
			const prep = prepAnim(k);
			const { a } = prep;
			if (a.cai)
				for (const r of prep.par.filter((r) => r?.k === 'cai'))
					for (const el of r.els)
						for (const [d, u] of [
							[0, 0],
							[prep.Dcai, 1]
						]) {
							const q = posCai(el, a.cai, d, u);
							expect(Math.abs(q.dx), `${k} dx`).toBeLessThan(1e-6);
							expect(Math.abs(q.dy), `${k} dy`).toBeLessThan(1e-6);
							expect(q.alpha, `${k} : ${el.d}`).toBe(1);
						}
			if (a.ondula) expect(ondulaEnv(0) + ondulaEnv(1), k).toBe(0);
			if (a.ressaut) for (let n = 0; n < a.ressaut.i.length; n++) expect(ressautDe(a.ressaut, n, 0) + ressautDe(a.ressaut, n, a.dur), k).toBe(0);
			if (a.bransol) expect(bransolDe(a.bransol, 0) + bransolDe(a.bransol, a.dur), k).toBe(0);
			if (a.eslum) expect(eslumDe(a.eslum, 0) + eslumDe(a.eslum, a.dur), k).toBe(0);
			const fin = Math.max(a.dur, a.tremol?.t[1] ?? 0) + 0.01;
			expect(tremolDe(a, 0), k).toEqual([0, 0]);
			expect(tremolDe(a, fin), k).toEqual([0, 0]);
		}
	});

	it('la pluie tombe segment par segment', () => {
		expect(segments('M30 66L26 76M44 66L40 76')).toEqual(['M30 66L26 76', 'M44 66L40 76']);
	});
});
