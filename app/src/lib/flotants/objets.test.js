import { describe, it, expect } from 'vitest';
import { OBJETS } from './objets.js';

// Les objets qui flottent sur le fond (page d'essai du 07-11) : chacun a un nom occitan et son sens
// en français, un dessin sûr (rien d'exécutable), et aucune couleur n'est inventée hors palette.
describe('objets qui flottent', () => {
	it('chaque objet a un identifiant unique, un mot occitan et sa traduction', () => {
		const ids = OBJETS.map((o) => o.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(new Set(OBJETS.map((o) => o.oc)).size).toBe(OBJETS.length);
		for (const o of OBJETS) {
			expect(o.oc.length).toBeGreaterThan(2);
			expect(o.fr.length).toBeGreaterThan(3);
		}
	});

	it('les dessins sont de simples formes SVG, sans script ni lien', () => {
		for (const o of OBJETS) {
			expect(o.svg, o.id).not.toMatch(/<script|onload|onclick|href|javascript:|<image|<foreignObject/i);
			expect(o.svg, o.id).toMatch(/<(path|circle|ellipse|rect|g)\b/);
		}
	});

	it('aucun tiret long dans les textes', () => {
		expect(JSON.stringify(OBJETS.map((o) => [o.oc, o.fr]))).not.toMatch(/[—–]/);
	});
});
