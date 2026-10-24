import { describe, it, expect } from 'vitest';
import { carnetVide, noter, etatCarte, aRevoir, fusionner, relire, jourLocal } from './regles.js';
import { listerChoses } from './choses.js';
import { moduls, ordre } from '$lib/lesson/moduls/index.js';

const jour1 = new Date(2026, 9, 24, 10, 0);
const jour1soir = new Date(2026, 9, 24, 22, 0);
const jour2 = new Date(2026, 9, 25, 9, 0);

describe('carnet : deux cartes, acquise en deux jours', () => {
	it('une réussite ouvre « je reconnais », « je produis » reste fermée', () => {
		const c = carnetVide();
		noter(c, ['bonjorn'], 'reconnais', true, jour1);
		expect(etatCarte(c, 'bonjorn', 'reconnais')).toBe('en-cours');
		expect(etatCarte(c, 'bonjorn', 'produis')).toBe('fermee');
	});

	it('deux réussites le même jour ne suffisent pas', () => {
		const c = carnetVide();
		noter(c, ['bonjorn'], 'reconnais', true, jour1);
		noter(c, ['bonjorn'], 'reconnais', true, jour1soir);
		expect(etatCarte(c, 'bonjorn', 'reconnais')).toBe('en-cours');
	});

	it('deux jours différents : acquise, et « je produis » s’ouvre', () => {
		const c = carnetVide();
		noter(c, ['bonjorn'], 'reconnais', true, jour1);
		const touchees = noter(c, ['bonjorn'], 'reconnais', true, jour2);
		expect(etatCarte(c, 'bonjorn', 'reconnais')).toBe('acquise');
		expect(etatCarte(c, 'bonjorn', 'produis')).toBe('nouvelle');
		expect(touchees).toEqual(['bonjorn:reconnais', 'bonjorn:produis']);
	});

	it('un échec n’ajoute pas de jour et rapproche la révision', () => {
		const c = carnetVide();
		noter(c, ['bonjorn'], 'reconnais', true, jour1);
		const avant = new Date(c.cartes['bonjorn:reconnais'].fsrs.due);
		noter(c, ['bonjorn'], 'reconnais', false, jour1);
		expect(c.cartes['bonjorn:reconnais'].jours).toEqual([jourLocal(jour1)]);
		expect(new Date(c.cartes['bonjorn:reconnais'].fsrs.due) <= avant).toBe(true);
	});

	it('produire tant que « je produis » est fermée : la réussite compte pour « je reconnais »', () => {
		const c = carnetVide();
		noter(c, ['soi-de'], 'produis', true, jour1);
		expect(etatCarte(c, 'soi-de', 'reconnais')).toBe('en-cours');
		expect(c.cartes['soi-de:produis']).toBeUndefined();
		// un échec de production, carte fermée : rien n'est noté
		expect(noter(c, ['d-ont-sias'], 'produis', false, jour1)).toEqual([]);
	});

	it('une fois ouverte, la production note « je produis »', () => {
		const c = carnetVide();
		noter(c, ['merce'], 'reconnais', true, jour1);
		noter(c, ['merce'], 'reconnais', true, jour2);
		noter(c, ['merce'], 'produis', true, jour2);
		expect(etatCarte(c, 'merce', 'produis')).toBe('en-cours');
	});

	it('les cartes à revoir sont celles dont la date est passée', () => {
		const c = carnetVide();
		noter(c, ['bonjorn'], 'reconnais', true, jour1);
		expect(aRevoir(c, jour1)).toEqual([]);
		expect(aRevoir(c, new Date(2026, 10, 30))).toEqual(['bonjorn:reconnais']);
	});
});

describe('carnet : garde et fusion', () => {
	it('relit ce qu’il a écrit, ignore un texte abîmé', () => {
		const c = carnetVide();
		noter(c, ['bonjorn'], 'reconnais', true, jour1);
		const relu = relire(JSON.stringify(c));
		noter(relu, ['bonjorn'], 'reconnais', true, jour2);
		expect(etatCarte(relu, 'bonjorn', 'reconnais')).toBe('acquise');
		expect(relire('{pas du json')).toEqual(carnetVide());
		expect(relire(null)).toEqual(carnetVide());
	});

	it('la fusion garde la carte la plus récente et liste celles à envoyer', () => {
		const vieux = { fsrs: {}, jours: [], acquise: null, maj: jour1.toISOString() };
		const recent = { ...vieux, maj: jour2.toISOString() };
		const { cartes, aEnvoyer } = fusionner({ a: recent, b: vieux, c: vieux }, { a: vieux, b: recent });
		expect(cartes.a).toBe(recent);
		expect(cartes.b).toBe(recent);
		expect(cartes.c).toBe(vieux);
		expect(aEnvoyer).toEqual(['a', 'c']);
	});
});

describe('étiquettes des modules', () => {
	const liste = listerChoses(moduls, ordre);
	const ids = new Set(liste.map((c) => c.id));

	it('chaque chose a un id unique', () => {
		expect(ids.size).toBe(liste.length);
	});

	it('chaque question étiquetée renvoie à une chose existante', () => {
		for (const cle of ordre) {
			for (const etape of moduls[cle].sessions) {
				for (const bloc of etape.blocks) {
					for (const item of [...(bloc.items ?? []), ...(bloc.tours ?? [])]) {
						for (const id of item.choses ?? bloc.choses ?? []) expect(ids.has(id), `${cle} : ${id}`).toBe(true);
					}
				}
			}
		}
	});
});
