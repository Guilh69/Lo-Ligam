import { describe, expect, it } from 'vitest';
import { barrejar, barrejarTot } from './barrejar.js';

describe('barrejar', () => {
	const mots = ['Vau', 'plan,', 'mercés.', 'E', 'tu ?'];

	it('rend les mêmes éléments, ni plus ni moins', () => {
		expect([...barrejar(mots)].sort()).toEqual([...mots].sort());
	});

	it('rend le même ordre à chaque appel (serveur et navigateur)', () => {
		expect(barrejar(mots)).toEqual(barrejar(mots));
	});

	it('ne rend jamais l’ordre de départ', () => {
		for (let n = 2; n <= 9; n += 1) {
			const lista = Array.from({ length: n }, (_, i) => i);
			for (let grana = 0; grana < 40; grana += 1) expect(barrejar(lista, grana)).not.toEqual(lista);
		}
	});

	it('ne touche pas à la liste reçue', () => {
		const copia = [...mots];
		barrejar(mots);
		expect(mots).toEqual(copia);
	});

	it('laisse en paix une liste vide ou d’un seul élément', () => {
		expect(barrejar([])).toEqual([]);
		expect(barrejar(['a'])).toEqual(['a']);
	});
});

describe('barrejarTot', () => {
	it('ne laisse aucun élément à sa place', () => {
		for (let n = 2; n <= 9; n += 1) {
			const lista = Array.from({ length: n }, (_, i) => i);
			const mesclat = barrejarTot(lista);
			expect([...mesclat].sort()).toEqual(lista);
			expect(mesclat.some((v, i) => v === i)).toBe(false);
		}
	});

	it('rend le même ordre à chaque appel', () => {
		expect(barrejarTot([0, 1, 2, 3])).toEqual(barrejarTot([0, 1, 2, 3]));
	});

	it('laisse en paix une liste vide ou d’un seul élément', () => {
		expect(barrejarTot([])).toEqual([]);
		expect(barrejarTot(['a'])).toEqual(['a']);
	});
});
