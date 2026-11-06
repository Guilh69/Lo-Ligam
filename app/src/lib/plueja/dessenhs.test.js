// Poussière d'or : chaque dessin doit correspondre à un mot d'une ambiance
// (sinon il ne sert jamais), chaque mot a son dessin (lot 2), et un mot à deux
// sens a un dessin par sens (la cosina : la cuisine, la cousine).
import { describe, it, expect } from 'vitest';
import { DESSENHS, TINTAS, cheminsDe } from './dessenhs.js';
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


	it('les drapeaux en couleur (06-11) : un mot dessiné, des zones valides, des couleurs lisibles', () => {
		expect(Object.keys(TINTAS).length).toBe(8);
		for (const [k, zones] of Object.entries(TINTAS)) {
			expect(DESSENHS[k], k).toBeTruthy();
			expect(MOTS.has(k), k).toBe(true);
			for (const z of zones) {
				expect(z.d, k).toMatch(/^M/);
				expect(z.d, k).not.toMatch(/NaN|undefined/);
				expect(z.c, k).toMatch(/^#[0-9a-f]{6}$/);
				// sur le ciel de nuit (#0e1a2b), une couleur trop sombre disparaît
				const [r, g, b] = [1, 3, 5].map((i) => parseInt(z.c.slice(i, i + 2), 16) / 255);
				expect(0.2126 * r + 0.7152 * g + 0.0722 * b, `${k} ${z.c}`).toBeGreaterThan(0.3);
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
});
