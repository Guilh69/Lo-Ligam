// La recherche dans lo Basic pour « Pausar los mots » (07-11) : les réponses
// ci-dessous sont des formes de réponse de l'API (structure seulement, mots
// courants), pas des données gardées.
import { describe, it, expect } from 'vitest';
import { genre, ambArticle, couples, nomsWikidata, lecturaRevirada } from './congres.js';

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

describe('Wikidata : les noms de lieux', () => {
	const entitats = {
		Q1: { labels: { oc: { value: 'Mar Mediterranèa' }, fr: { value: 'mer Méditerranée' } }, descriptions: { fr: { value: 'mer entre l’Europe, l’Asie et l’Afrique' } } },
		Q2: { labels: { fr: { value: 'Méditerranée' } }, descriptions: { fr: { value: 'ferry lancé en 1988' } } },
		Q3: { labels: { oc: { value: 'Garrigue' }, fr: { value: 'Garrigue' } }, descriptions: { fr: { value: 'nom de famille' } } },
		Q4: { labels: { oc: { value: 'Garriga' }, fr: { value: 'garrigue' } }, descriptions: { fr: { value: 'formation végétale' } } }
	};
	it('garde les entrées qui ont un libellé occitan, dans l’ordre de la recherche', () => {
		expect(nomsWikidata(['Q1', 'Q2', 'Q4'], entitats)).toEqual([
			{ oc: 'Mar Mediterranèa', fr: 'mer Méditerranée', font: 'wikidata', nota: 'mer entre l’Europe, l’Asie et l’Afrique' },
			{ oc: 'Garriga', fr: 'garrigue', font: 'wikidata', nota: 'formation végétale' }
		]);
	});
	it('écarte les noms de famille et ce qui n’est pas un lieu', () => {
		expect(nomsWikidata(['Q3'], entitats)).toEqual([]);
	});
	it('ne plante pas sur une réponse vide', () => {
		expect(nomsWikidata(['Q9'], undefined)).toEqual([]);
	});
});

describe('Revirada : la traduction automatique', () => {
	it('rend la traduction, marquée comme telle', () => {
		expect(lecturaRevirada({ translated_text: ' la  mar ' }, 'la mer')).toEqual({ oc: 'la mar', fr: 'la mer', font: 'revirada' });
	});
	it('écarte un mot que le moteur ne connaît pas', () => {
		expect(lecturaRevirada({ translated_text: '*zorglub' }, 'zorglub')).toBeNull();
		expect(lecturaRevirada({ translated_text: 'zorglub' }, 'zorglub')).toBeNull();
		expect(lecturaRevirada({}, 'mer')).toBeNull();
	});
});
