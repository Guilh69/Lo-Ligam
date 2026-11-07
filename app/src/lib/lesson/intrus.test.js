// « L'intrús » (chantier 33, 07-11) : chaque série tient debout.
import { describe, it, expect } from 'vitest';
import { moduls } from '$lib/lesson/moduls/index.js';
import { choses } from '$lib/carnet/choses.js';

const ids = new Set(choses.map((c) => c.id));
const series = [];
for (const [cle, m] of Object.entries(moduls))
	for (const etapa of m.sessions)
		for (const bloc of etapa.blocks) if (bloc.type === 'intrus') for (const item of bloc.items) series.push({ cle, item });

describe('L’intrús', () => {
	it('une série par leçon de tâche des huit unités de l’A1, quatre chacune', () => {
		const parModul = Object.groupBy(series, (s) => s.cle);
		expect(Object.keys(parModul).sort()).toEqual(['1-4', '2-4', '3-4', '4-4', '5-4', '6-4', '7-4', '8-4']);
		for (const s of Object.values(parModul)) expect(s.length).toBe(4);
	});

	it('quatre mots différents, un intrus désigné, une famille nommée, une explication', () => {
		for (const { cle, item } of series) {
			const nom = `${cle} : ${item.mots.join(' · ')}`;
			expect(item.mots.length, nom).toBe(4);
			expect(new Set(item.mots).size, nom).toBe(4);
			expect(Number.isInteger(item.intrus) && item.intrus >= 0 && item.intrus < 4, nom).toBe(true);
			expect(item.familha?.length, nom).toBeGreaterThan(0);
			expect(item.explain?.length, nom).toBeGreaterThan(0);
		}
	});

	it('les choses notées au carnet existent dans les encadrés « À retenir »', () => {
		for (const { cle, item } of series) for (const c of item.choses ?? []) expect(ids.has(c), `${cle} : ${c}`).toBe(true);
	});

	it('aucun mot n’apparaît deux fois comme intrus dans une même leçon', () => {
		const vus = new Set();
		for (const { cle, item } of series) {
			const k = `${cle}|${item.mots[item.intrus]}`;
			expect(vus.has(k), k).toBe(false);
			vus.add(k);
		}
	});
});
