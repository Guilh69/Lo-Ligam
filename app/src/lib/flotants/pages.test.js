import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { SANS_CONFETIS, confetisSurPage } from './pages.js';

// Où paraît le fond de confettis : les pages ordinaires oui, les écrans d'immersion, de travail et les essais non.
describe('fond de confettis : sur quelles pages', () => {
	it('paraît sur les pages ordinaires, y compris S’apren (qui n’est pas la salle de jeux)', () => {
		for (const id of ['/', '/parla', '/apren', '/apren/visio', '/apren/gramatica', '/amassa', '/mots', '/istoria', '/medias/radios', '/obras/cinema', '/cultura'])
			expect(confetisSurPage(id), id).toBe(true);
	});

	it('ne paraît ni sur la carte, ni dans l’immersion, ni dans l’administration, ni sur les essais', () => {
		for (const id of ['/carta', '/anem', '/apren/remira', '/apren/jocs', '/aprene/modul/[modulId]', '/admin', '/admin/labo', '/ensag/flotants', '/compte', '/compte/questionnaire', '/accessibilitat'])
			expect(confetisSurPage(id), id).toBe(false);
	});

	it('chaque exception vise une route qui existe', () => {
		const manquantes = SANS_CONFETIS.filter((p) => !existsSync(`src/routes${p}`));
		expect(manquantes).toEqual([]);
	});
});
