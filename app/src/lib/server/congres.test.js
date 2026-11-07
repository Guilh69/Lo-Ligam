// La recherche dans lo Basic pour « Pausar los mots » (07-11) : les réponses
// ci-dessous sont des formes de réponse de l'API (structure seulement, mots
// courants), pas des données gardées.
import { describe, it, expect } from 'vitest';
import { genre, ambArticle, couples } from './congres.js';

const nuatge = {
	query: [
		{
			forms: [{ orth: 'nuage', PoS: ['N1110'] }],
			trads: [
				{ var: 'gascon', orth: 'nubla', PoS: ['N1210'] },
				{ var: 'oc', orth: 'crum', PoS: ['N1110'] },
				{ var: 'lengadoc', orth: 'nívol', PoS: ['N1210'] }
			]
		}
	]
};

describe('lo Basic : genre et article', () => {
	it('lit le genre et le nombre d’un nom', () => {
		expect(genre(['N1210'])).toEqual({ f: true, pl: false });
		expect(genre(['N1110'])).toEqual({ f: false, pl: false });
		expect(genre(['N1220'])).toEqual({ f: true, pl: true });
		expect(genre(['AJ0110'])).toBe(null);
		expect(genre(undefined)).toBe(null);
	});

	it('met l’article occitan ou français', () => {
		expect(ambArticle('nívol', ['N1210'], 'oc')).toBe('la nívol');
		expect(ambArticle('bòsc', ['N1110'], 'oc')).toBe('lo bòsc');
		expect(ambArticle('aiga', ['N1210'], 'oc')).toBe('l’aiga');
		expect(ambArticle('ostal', ['N1110'], 'oc')).toBe('l’ostal');
		expect(ambArticle('banas', ['N1220'], 'oc')).toBe('las banas');
		expect(ambArticle('nuage', ['N1110'], 'fr')).toBe('le nuage');
		expect(ambArticle('eau', ['N1210'], 'fr')).toBe('l’eau');
		expect(ambArticle('verd', ['AJ0110'], 'oc')).toBe('verd');
	});
});

describe('lo Basic : les couples proposés', () => {
	it('depuis le français : le languedocien d’abord, puis l’occitan commun, sans le gascon', () => {
		expect(couples(nuatge, 'nuage', 'fr')).toEqual([
			{ oc: 'la nívol', fr: 'le nuage', var: 'lengadoc' },
			{ oc: 'lo crum', fr: 'le nuage', var: 'oc' }
		]);
	});

	it('depuis l’occitan : seulement le mot cherché, avec chacun de ses sens', () => {
		const aiga = {
			query: [
				{ forms: [{ orth: 'eau', PoS: ['N1210'] }], trads: [{ var: 'oc', orth: 'aiga', PoS: ['N1210'] }] },
				{
					forms: [{ orth: 'flotte', PoS: ['N1210'] }],
					trads: [
						{ var: 'oc', orth: 'aiga', PoS: ['N1210'] },
						{ var: 'lengadoc', orth: 'pluèja', PoS: ['N1210'] }
					]
				}
			]
		};
		expect(couples(aiga, 'Aiga', 'oc')).toEqual([
			{ oc: 'l’aiga', fr: 'l’eau', var: 'oc' },
			{ oc: 'l’aiga', fr: 'la flotte', var: 'oc' }
		]);
	});

	it('une absence (erreur 8 de l’API) ne donne rien', () => {
		expect(couples({ error: { code: '8', text: 'No entry found with your conditions' } }, 'nuag', 'fr')).toEqual([]);
	});
});
