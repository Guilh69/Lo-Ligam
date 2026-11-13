import { describe, it, expect } from 'vitest';
import { clauDe, frasasDe, totasLasFrasas, sonDe, normalisar } from './phrases.js';
import { moduls } from '../lesson/moduls/index.js';
import { VOTZ } from './voix-index.js';

describe('clauDe', () => {
	it('expression avec id : <module>/<id>', () => {
		expect(clauDe('1-1', { id: 'adieu', oc: 'Adieu !' })).toBe('1-1/adieu');
	});

	it('réplique : <module>/d-<8 caractères hexadécimaux>', () => {
		expect(clauDe('1-1', { oc: 'Bonjorn, Yasmine !' })).toMatch(/^1-1\/d-[0-9a-f]{8}$/);
	});

	it('même texte → même clé ; espaces, majuscules, ponctuation, mise en forme sans effet', () => {
		const a = clauDe('1-1', { oc: 'Cossí vas ?' });
		expect(clauDe('1-1', { oc: 'Cossí vas ?' })).toBe(a);
		expect(clauDe('1-1', { oc: '  cossí   VAS  ' })).toBe(a);
		expect(clauDe('1-1', { oc: '*Cossí* vas…' })).toBe(a);
		expect(clauDe('1-1', 'Cossí vas ?')).toBe(a);
	});

	it('un accent différent change la clé', () => {
		expect(clauDe('1-1', { oc: 'Cossí vas ?' })).not.toBe(clauDe('1-1', { oc: 'Cossi vas ?' }));
		expect(clauDe('1-1', { oc: 'La pòrta' })).not.toBe(clauDe('1-1', { oc: 'La porta' }));
	});

	it('le module fait partie de la clé', () => {
		expect(clauDe('1-1', { oc: 'Adieu !' })).not.toBe(clauDe('1-2', { oc: 'Adieu !' }));
	});

	it('normalisation : accents conservés', () => {
		expect(normalisar('  *Cossí*   anatz ? ')).toBe('cossí anatz');
	});
});

describe('frasasDe', () => {
	it('clés uniques dans chaque module', () => {
		for (const [id, m] of Object.entries(moduls)) {
			const cles = frasasDe(m).map((f) => f.clau);
			expect(new Set(cles).size, `doublon de clé dans ${id}`).toBe(cles.length);
		}
	});

	it('chaque phrase a une clé, un texte occitan et un type', () => {
		for (const f of totasLasFrasas()) {
			expect(f.clau).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+$/);
			expect(f.oc.length).toBeGreaterThan(0);
			expect(['replica', 'expression']).toContain(f.tipe);
		}
	});

	it('deux répliques identiques d’un module partagent un enregistrement', () => {
		const m = {
			slug: 'x',
			sessions: [
				{ blocks: [{ type: 'dialogue', scenes: [{ title: 'S', lines: [{ oc: 'Va plan !' }, { oc: 'va  plan' }, 'Adieu'] }] }] }
			]
		};
		expect(frasasDe(m).map((f) => f.oc)).toEqual(['Va plan !', 'Adieu']);
	});

	it('nombre total de phrases (pour information)', () => {
		const toutes = totasLasFrasas();
		const rep = toutes.filter((f) => f.tipe === 'replica').length;
		const exp = toutes.filter((f) => f.tipe === 'expression').length;
		console.log(`Phrases à enregistrer : ${toutes.length} (${rep} répliques, ${exp} expressions)`);
		expect(toutes.length).toBe(rep + exp);
		expect(toutes.length).toBeGreaterThan(0);
	});
});

describe('sonDe', () => {
	it('renvoie null avec l’index vide', () => {
		expect(Object.keys(VOTZ)).toHaveLength(0);
		expect(sonDe('1-1', { id: 'adieu', oc: 'Adieu !' })).toBeNull();
		expect(sonDe('1-1', { oc: 'Bonjorn, Yasmine !' })).toBeNull();
	});
});
