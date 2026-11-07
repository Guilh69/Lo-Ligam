import { describe, it, expect } from 'vitest';
import { contraste, oklch, depuisOklch, analyser, accorderTuiles, simulerDaltonisme, hexVersRgb } from './coherence.js';
import { PISTES } from './pistes.js';

describe('coherence : mesures de base', () => {
	it('le contraste noir sur blanc vaut 21', () => {
		expect(contraste('#000000', '#ffffff')).toBeCloseTo(21, 1);
	});
	it('le contraste est le même dans les deux sens', () => {
		expect(contraste('#b53d17', '#fbf1e1')).toBeCloseTo(contraste('#fbf1e1', '#b53d17'), 6);
	});
	it('la brique du logo porte du texte crème à 5,1 (mesure du 07-11)', () => {
		expect(contraste('#fbf1e1', '#b53d17')).toBeGreaterThan(5.1);
	});
	it('OKLCH puis retour redonne la couleur', () => {
		const { L, C, H } = oklch('#4f6a2f');
		const retour = depuisOklch(L, C, H);
		const a = hexVersRgb('#4f6a2f');
		const b = hexVersRgb(retour);
		a.forEach((v, i) => expect(Math.abs(v - b[i])).toBeLessThanOrEqual(2));
	});
	it('le gris reste gris au daltonisme', () => {
		const [r, g, b] = hexVersRgb(simulerDaltonisme('#808080', 'deuteranopie'));
		expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThanOrEqual(3);
	});
});

describe('accorder les tuiles', () => {
	it('donne la même clarté et la même intensité à toutes, sauf la première', () => {
		const sortie = accorderTuiles(['#b53d17', '#00a0a0', '#20d020', '#2040ff', '#ffd000', '#d000d0'], 0);
		expect(sortie[0]).toBe('#b53d17');
		const m = sortie.slice(1).map(oklch);
		const L = m.map((x) => x.L);
		const C = m.map((x) => x.C);
		expect(Math.max(...L) - Math.min(...L)).toBeLessThan(0.02);
		expect(Math.max(...C) - Math.min(...C)).toBeLessThan(0.015);
		expect(Math.max(...C)).toBeLessThanOrEqual(0.09);
	});
	it('fonce les tuiles assez pour que le texte crème passe 4,5', () => {
		const sortie = accorderTuiles(['#b53d17', '#00a0a0', '#20d020', '#2040ff', '#ffd000', '#d000d0'], 0, '#fbf1e1');
		sortie.slice(1).forEach((t) => expect(contraste('#fbf1e1', t)).toBeGreaterThanOrEqual(4.5));
	});
	it('garde les teintes', () => {
		const avant = ['#b53d17', '#1f5f63', '#4f6a2f', '#2b6496', '#eeaf34', '#6b3a5b'];
		const apres = accorderTuiles(avant, 0);
		avant.slice(1).forEach((t, i) => {
			const d = Math.abs(oklch(t).H - oklch(apres[i + 1]).H);
			expect(Math.min(d, 360 - d)).toBeLessThan(6);
		});
	});
});

// Les trois pistes du 07-11 : ce que la page d'essai affiche doit rester vrai
describe('pistes de palette du 07-11', () => {
	for (const mode of ['clair', 'sombre']) {
		for (const id of ['brique', 'jaune', 'accordee']) {
			it(`${id} (${mode}) : tous les textes passent 4,5 et la palette est accordée`, () => {
				const a = analyser(PISTES[id][mode]);
				expect(a.contrastes.filter((c) => !c.ok)).toEqual([]);
				expect(a.verdict).toBe('Accordée');
			});
		}
	}
	for (const mode of ['clair', 'sombre']) {
		it(`la base mêlée (${mode}) : tous les textes passent 4,5, avec des réserves sur les teintes vives et l'accord des tuiles`, () => {
			const a = analyser(PISTES.melange[mode]);
			expect(a.contrastes.filter((c) => !c.ok)).toEqual([]);
			expect(a.verdict).toBe('Acceptable, avec réserves');
			expect(a.criantes.length).toBe(3);
		});
	}
	it('le site actuel (thème clair) sort « À revoir » : trop de teintes vives, teintes chaudes voisines, action et juste confondus', () => {
		const a = analyser(PISTES.actuel.clair);
		expect(a.verdict).toBe('À revoir');
		expect(a.criantes.length).toBeGreaterThan(2);
	});
	it('la piste 1 n’a qu’une teinte vive, la piste 3 deux seulement', () => {
		expect(analyser(PISTES.brique.clair).criantes.length).toBe(1);
		expect(analyser(PISTES.accordee.clair).criantes.length).toBe(2);
	});
});
