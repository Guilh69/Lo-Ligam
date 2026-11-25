import { describe, it, expect } from 'vitest';
import { etiqueta } from './etiquetas.js';
import filet from '#lib/data/elements-filet.json';

// (15-11 : une virgule manquante entre deux lignes de la liste cassait tout le
// site sans que le build ne dise rien)
describe('étiquettes des éléments modifiables', () => {
	it('se lisent, en occitan et en français', () => {
		expect(etiqueta('acuelh.eros.kicker')).toBe('Lo pichon mot sus lo títol');
		expect(etiqueta('carta.titol', true)).not.toBe('carta.titol');
		expect(etiqueta('mencions.titol', true)).not.toBe('mencions.titol');
	});
	it('aucune étiquette vide pour les éléments du filet', () => {
		for (const [p, rows] of Object.entries(filet)) {
			if (p.startsWith('_')) continue;
			for (const r of rows) expect(typeof etiqueta(r.clau)).toBe('string');
		}
	});
});
