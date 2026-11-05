// Poussière d'or : chaque dessin doit correspondre à un mot d'une ambiance
// (sinon il ne sert jamais), et un mot à deux sens n'est dessiné que dans le
// sens prévu (la cosina : la cuisine oui, la cousine non).
import { describe, it, expect } from 'vitest';
import { DESSENHS } from './dessenhs.js';
import { SCENAS } from './scenas.js';

const MOTS = new Set(SCENAS.flatMap((s) => s.mots.map(([oc]) => oc)));

describe('dessins de la poussière d’or', () => {
	it('chaque dessin correspond à un mot d’une ambiance', () => {
		const orphelins = Object.keys(DESSENHS).filter((k) => !MOTS.has(k));
		expect(orphelins).toEqual([]);
	});

	it('chaque dessin est une liste de chemins SVG non vides', () => {
		for (const [k, chemins] of Object.entries(DESSENHS)) {
			expect(Array.isArray(chemins), k).toBe(true);
			expect(chemins.length, k).toBeGreaterThan(0);
			for (const d of chemins) {
				expect(typeof d, k).toBe('string');
				expect(d, k).toMatch(/^M/);
				expect(d, k).not.toMatch(/NaN|undefined/);
			}
		}
	});

	it('la cosina : dessinée pour la cuisine, pas pour la cousine', () => {
		// dessenhDe utilise Path2D (navigateur) : on vérifie ici la règle de sens
		const u3 = SCENAS.find((s) => s.id === 'u3').mots.find(([oc]) => oc === 'la cosina');
		const u7 = SCENAS.find((s) => s.id === 'u7').mots.find(([oc]) => oc === 'la cosina');
		expect(u3[1]).not.toContain('cuisine');
		expect(u7[1]).toContain('cuisine');
	});
});
