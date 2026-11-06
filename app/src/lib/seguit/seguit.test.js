// Le suivi des chantiers (06-11) : des données cohérentes, des liens qui mènent quelque part.
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { CHANTIERS, ESTATS, comptes } from './seguit.js';

describe('seguit', () => {
	it('chaque chantier a une clé unique, un état connu, un avancement entre 0 et 100', () => {
		expect(new Set(CHANTIERS.map((c) => c.clau)).size).toBe(CHANTIERS.length);
		for (const c of CHANTIERS) {
			expect(ESTATS[c.estat], c.clau).toBeTruthy();
			expect(c.avanç, c.clau).toBeGreaterThanOrEqual(0);
			expect(c.avanç, c.clau).toBeLessThanOrEqual(100);
			expect(c.seguenta.length, c.clau).toBeGreaterThan(5);
			expect(c.nom + c.seguenta, c.clau).not.toMatch(/[—–]/);
		}
	});
	it('les liens mènent à une page du site', () => {
		for (const c of CHANTIERS.filter((c) => c.ligam))
			expect(existsSync(`src/routes${c.ligam}/+page.svelte`), c.ligam).toBe(true);
	});
	it('les comptes font le total', () => {
		const n = comptes();
		expect(Object.values(n).reduce((a, b) => a + b, 0)).toBe(CHANTIERS.length);
	});
});
