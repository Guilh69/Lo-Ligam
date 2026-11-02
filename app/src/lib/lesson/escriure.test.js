import { describe, it, expect } from 'vitest';
import { corregir, netejar } from './escriure.js';

describe('écrire au clavier : la règle de l’A1', () => {
	const item = { answers: ['A deman !'] };

	it('majuscules et ponctuation ne comptent jamais', () => {
		expect(corregir('a deman', item).statut).toBe('just');
		expect(corregir('  A   DEMAN ! ', item).statut).toBe('just');
	});

	it('un mot sans accent est accepté avec remarque', () => {
		const r = corregir('Cossi vas', { answers: ['Cossí vas ?'] });
		expect(r.statut).toBe('quasi');
		expect(r.modele).toBe('Cossí vas ?');
	});

	it('le trait d’union oublié aussi', () => {
		expect(corregir('adieu siatz', { answers: ['Adieu-siatz !'] }).statut).toBe('quasi');
	});

	it('l’apostrophe droite vaut l’apostrophe courbe', () => {
		expect(corregir("d'ont siás", { answers: ['D’ont siás ?'] }).statut).toBe('just');
	});

	it('un autre mot est refusé', () => {
		expect(corregir('a lèu', item).statut).toBe('non');
		expect(corregir('', item).statut).toBe('non');
	});

	it('un début attendu, puis ce que l’élève veut', () => {
		const nom = { debut: ['Me dison', 'M’apèli'] };
		expect(corregir('Me dison Romain', nom).statut).toBe('just');
		expect(corregir("m'apeli Romain", nom).statut).toBe('quasi');
		expect(corregir('Me dison', nom).statut).toBe('non');
		expect(corregir('Romain', nom).statut).toBe('non');
	});

	it('netejar garde les accents', () => {
		expect(netejar('Òc, Marià !')).toBe('òc marià');
	});
	it('la négation : la forme familière, sans non, est juste aussi (2026-11-02)', () => {
		const item = { answers: ['Non parli pas italian.'] };
		expect(corregir('Non parli pas italian', item).statut).toBe('just');
		expect(corregir('Parli pas italian', item).statut).toBe('just');
		const loenh = { answers: ['Tot drech, non es pas luènh.'] };
		expect(corregir('Tot drech, es pas luènh', loenh).statut).toBe('just');
		const dos = { answers: ['Non ai pas de fraire e non ai pas de sòrre.'] };
		expect(corregir('Ai pas de fraire e ai pas de sòrre', dos).statut).toBe('just');
		expect(corregir('Non ai pas de fraire e ai pas de sòrre', dos).statut).toBe('just');
	});

	it('la négation : la réponse puis la négation, « Non, non… », est juste', () => {
		expect(corregir('Non, non ai pas de can.', { answers: ['Non ai pas de can.'] }).statut).toBe('just');
		expect(corregir('Non, non ai pas de sòrre', { debut: ['Non ai pas de'] }).statut).toBe('just');
	});

	it('la négation : un début et un accent oublié suivent la forme écrite', () => {
		expect(corregir('Parli pas catalan', { debut: ['Non parli pas'] })).toEqual({ statut: 'just', modele: 'Parli pas', debut: true });
		expect(corregir('Parli pas angles', { answers: ['Non parli pas anglés.'] })).toEqual({ statut: 'quasi', modele: 'Parli pas anglés.' });
	});

	it('le « Non » qui répond reste obligatoire', () => {
		const item = { answers: ['Non, soi catalana.'] };
		expect(corregir('Soi catalana', item).statut).toBe('non');
		expect(corregir('Non, soi catalana', item).statut).toBe('just');
	});

	it('un début qui finit par une apostrophe se colle à la suite', () => {
		const item = { debut: ['Soi d’'] };
		expect(corregir('Soi d’Albi', item).statut).toBe('just');
		expect(corregir("Soi d'Albi", item).statut).toBe('just');
		expect(corregir('Soi d’', item).statut).toBe('non');
	});
});
