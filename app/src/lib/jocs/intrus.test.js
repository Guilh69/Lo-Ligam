// « L'intrús » (chantier 33, 07-11), jeu de la salle Jòcs : chaque série tient debout.
import { describe, it, expect } from 'vitest';
import { SERIAS, UNITATS_INTRUS } from './intrus-series.js';
import { UNITATS } from './serp-mots.js';
import { choses } from '$lib/carnet/choses.js';

const ids = new Set(choses.map((c) => c.id));
const series = Object.entries(SERIAS).flatMap(([u, s]) => s.map((item) => ({ u, item })));

describe('L’intrús', () => {
	it('quatre séries pour chacune des huit unités de l’A1', () => {
		expect(UNITATS_INTRUS).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
		for (const u of UNITATS_INTRUS) {
			expect(SERIAS[u].length, `unitat ${u}`).toBe(4);
			expect(UNITATS.some((x) => x.id === u), `unitat ${u}`).toBe(true);
		}
	});

	it('quatre mots différents, un intrus désigné, une famille nommée, une explication', () => {
		for (const { u, item } of series) {
			const nom = `${u} : ${item.mots.join(' · ')}`;
			expect(item.mots.length, nom).toBe(4);
			expect(new Set(item.mots).size, nom).toBe(4);
			expect(Number.isInteger(item.intrus) && item.intrus >= 0 && item.intrus < 4, nom).toBe(true);
			expect(item.familha?.length, nom).toBeGreaterThan(0);
			expect(item.explain?.length, nom).toBeGreaterThan(0);
		}
	});

	it('les cartes du carnet notées existent dans les encadrés « À retenir »', () => {
		for (const { u, item } of series) for (const c of item.choses ?? []) expect(ids.has(c), `${u} : ${c}`).toBe(true);
	});

	it('aucun mot n’est deux fois l’intrus dans une même unité', () => {
		const vus = new Set();
		for (const { u, item } of series) {
			const k = `${u}|${item.mots[item.intrus]}`;
			expect(vus.has(k), k).toBe(false);
			vus.add(k);
		}
	});
});
