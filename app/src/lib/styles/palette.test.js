import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cssPalette, TEINTES, BOUTONS, PUCES, texteSur } from './palette.js';
import { CAPACITATS } from '../jocs/sala/cataleg.js';
import { contraste } from '../palette/coherence.js';

// La palette unique (2026-11-07) : palette.css doit être celui que produit
// palette.js ; sinon, lancer `node scripts/palette-css.mjs` dans app/.
describe('palette', () => {
	it('palette.css est à jour', () => {
		const css = readFileSync(join(process.cwd(), 'src', 'lib', 'styles', 'palette.css'), 'utf8').replace(/\r\n/g, '\n');
		expect(css).toBe(cssPalette());
	});
	it('toutes les teintes sont des couleurs #rrggbb', () => {
		for (const v of Object.values(TEINTES)) expect(v).toMatch(/^#[0-9a-f]{6}$/);
	});
	it('chaque thème de la salle de jeux a sa puce, et son texte s’y lit', () => {
		expect(Object.keys(PUCES).sort()).toEqual(CAPACITATS.map((c) => c.id).sort());
		for (const [fond, texte] of Object.values(PUCES)) {
			expect(texteSur(fond)).toBe(texte);
			expect(contraste(fond, texte)).toBeGreaterThanOrEqual(4.5);
		}
		expect(new Set(Object.values(PUCES).map(([f]) => f)).size).toBe(Object.keys(PUCES).length);
	});
	it('le texte des boutons se lit sur sa pièce', () => {
		expect(texteSur(BOUTONS.agir)).toBe(BOUTONS.agirTexte);
		expect(texteSur(BOUTONS.choisi)).toBe(BOUTONS.choisiTexte);
		expect(texteSur(BOUTONS.carton.sombre)).toBe(BOUTONS.cartonTexte.sombre);
		expect(texteSur(BOUTONS.carton.clair)).toBe(BOUTONS.cartonTexte.clair);
	});
});
