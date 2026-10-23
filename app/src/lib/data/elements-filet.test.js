import { describe, it, expect } from 'vitest';
import filet from './elements-filet.json';

// Le filet de secours des éléments modifiables : s'il se désaccorde (clé en
// double, enfant d'une carte qui n'existe pas, lien mal formé), la page
// affiche un trou sans prévenir. Mêmes règles que le SQL.
const ligamValid = (h) => /^(\/[^\s]*|#[^\s]+|https:\/\/[^\s]+)$/.test(h ?? '');

describe('filet des éléments modifiables', () => {
	const paginas = Object.entries(filet).filter(([k]) => !k.startsWith('_'));

	it('a au moins l’accueil', () => {
		expect(Object.keys(filet)).toContain('acuelh');
		expect(filet.acuelh.length).toBeGreaterThan(50);
	});

	for (const [pagina, rows] of paginas) {
		it(`${pagina} : aucune clé en double, chaque clé commence par la page`, () => {
			const claus = rows.map((r) => r.clau);
			expect(new Set(claus).size).toBe(claus.length);
			expect(claus.every((c) => c.startsWith(pagina + '.'))).toBe(true);
		});

		it(`${pagina} : un type connu, un texte pour les textes, une adresse valide pour les liens, une image pour les images`, () => {
			for (const r of rows) {
				expect(['text', 'ligam', 'imatge', 'bloc']).toContain(r.tipe);
				if (r.tipe === 'text' || r.tipe === 'ligam') expect(typeof r.oc === 'string' && typeof r.fr === 'string').toBe(true);
				if (r.tipe === 'ligam') expect(ligamValid(r.ligam)).toBe(true);
				if (r.tipe === 'imatge') expect(typeof r.imatge?.url).toBe('string');
			}
		});

		it(`${pagina} : les enfants d’une carte appartiennent à une carte qui existe`, () => {
			const blocs = new Set(rows.filter((r) => r.tipe === 'bloc').map((r) => r.clau));
			const listas = new Set(rows.map((r) => r.lista).filter(Boolean));
			for (const l of listas) {
				// une liste est soit une carte (bloc), soit une liste « libre » dont la clé
				// est le préfixe de ses éléments
				const membres = rows.filter((r) => r.lista === l);
				expect(blocs.has(l) || membres.every((m) => m.clau.startsWith(l + '.'))).toBe(true);
			}
		});
	}
});
