// Poussière d'or : chaque dessin doit correspondre à un mot d'une ambiance
// (sinon il ne sert jamais), chaque mot a son dessin (lot 2), et un mot à deux
// sens a un dessin par sens (la cosina : la cuisine, la cousine).
import { describe, it, expect } from 'vitest';
import { DESSENHS, ANIMACIONS, cheminsDe } from './dessenhs.js';
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


	it('chaque mot de chaque ambiance a un dessin', () => {
		const sans = SCENAS.flatMap((s) => s.mots.filter(([oc, def]) => !cheminsDe(oc, def)).map(([oc]) => `${s.id} : ${oc}`));
		expect(sans).toEqual([]);
	});

	it('la cosina : un dessin pour la cuisine, un autre pour la cousine', () => {
		// dessenhDe utilise Path2D (navigateur) : on vérifie ici la règle de sens
		const u3 = SCENAS.find((s) => s.id === 'u3').mots.find(([oc]) => oc === 'la cosina');
		const u7 = SCENAS.find((s) => s.id === 'u7').mots.find(([oc]) => oc === 'la cosina');
		expect(u3[1]).toContain('cousine');
		expect(u7[1]).toContain('cuisine');
		expect(cheminsDe(...u3)).not.toEqual(cheminsDe(...u7));
		expect(cheminsDe(...u7)).toBe(DESSENHS['la cosina']);
	});

	it('chaque petite animation vise un mot d’une ambiance, et l’éclair reste sous le seuil des flashs', () => {
		expect(Object.keys(ANIMACIONS).filter((k) => !MOTS.has(k))).toEqual([]);
		for (const [k, a] of Object.entries(ANIMACIONS)) {
			expect(a.dur, k).toBeGreaterThan(0);
			expect(a.dur, k).toBeLessThanOrEqual(6); // une animation courte, puis le repos
			if (a.flash) {
				// deux éclairs au plus, à plus de 0,2 s l’un de l’autre (moins de trois par seconde)
				expect(a.flash.length, k).toBeLessThanOrEqual(2);
				for (let i = 1; i < a.flash.length; i++) expect(a.flash[i] - a.flash[i - 1], k).toBeGreaterThan(0.2);
			}
		}
	});
});
