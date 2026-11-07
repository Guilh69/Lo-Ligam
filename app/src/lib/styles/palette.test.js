import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cssPalette, TEINTES, BOUTONS, texteSur } from './palette.js';

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
	it('le texte des boutons se lit sur sa pièce', () => {
		expect(texteSur(BOUTONS.agir)).toBe(BOUTONS.agirTexte);
		expect(texteSur(BOUTONS.choisi)).toBe(BOUTONS.choisiTexte);
		expect(texteSur(BOUTONS.carton.sombre)).toBe(BOUTONS.cartonTexte.sombre);
		expect(texteSur(BOUTONS.carton.clair)).toBe(BOUTONS.cartonTexte.clair);
	});
});
