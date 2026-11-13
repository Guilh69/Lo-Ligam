import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { FICHAS } from './fichas.js';

const CHAMPS = ['id', 'titol', 'imatge', 'quoi', 'ou', 'tombe', 'retenir'];

describe('fiches du livret technique', () => {
	it('compte dix fiches aux identifiants uniques', () => {
		expect(FICHAS).toHaveLength(10);
		expect(new Set(FICHAS.map((f) => f.id)).size).toBe(10);
	});

	it('remplit tous les champs, sans HTML', () => {
		for (const f of FICHAS) {
			for (const c of CHAMPS) {
				expect(typeof f[c], `${f.id}.${c}`).toBe('string');
				expect(f[c].trim().length, `${f.id}.${c}`).toBeGreaterThan(0);
				expect(f[c], `${f.id}.${c}`).not.toMatch(/<[a-z/]/i);
			}
			expect(Array.isArray(f.mots)).toBe(true);
			for (const m of f.mots) {
				expect(m.mot.trim()).not.toBe('');
				expect(m.explication.trim()).not.toBe('');
			}
		}
	});

	it('donne une fiche à chaque brique du plan', () => {
		const page = readFileSync('src/routes/admin/libret/+page.svelte', 'utf8');
		const briques = [...page.matchAll(/data-id="([a-z]+)"/g)].map((m) => m[1]);
		expect(briques).toHaveLength(10);
		expect(briques.sort()).toEqual(FICHAS.map((f) => f.id).sort());
	});
});
