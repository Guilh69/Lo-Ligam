// Triar (Romain, 06-11) : le format des choix et les lots.
import { describe, it, expect } from 'vitest';
import { estatDe, aTriar, comptes, paquetsGardats, tèxteGardats, tèxteRefar, SENS_COMENTARI } from './triar.js';
import { LOTS } from './lots.js';
import { DESSENHS } from '../plueja/dessenhs.js';

const els = ['a', 'b', 'c', 'd'].map((clau) => ({ clau }));

describe('triar : les choix', () => {
	it('le dernier choix l’emporte, une croix traitée revient à revoir', () => {
		const e = estatDe([
			{ id: 3, extrait: 'refar', cibla: 'b', tèxte: 'plus fin', estat: 'dubèrta' },
			{ id: 1, extrait: 'gardar', cibla: 'gardats', tèxte: tèxteGardats(['a', 'b']), estat: 'dubèrta' },
			{ id: 4, extrait: 'refar', cibla: 'c', tèxte: SENS_COMENTARI, estat: 'tractada', responsa: 'traits allégés' },
			{ id: 9, extrait: 'autre', cibla: 'd', tèxte: 'une remarque ordinaire', estat: 'dubèrta' }
		]);
		expect(e.a.v).toBe('gardar');
		expect(e.b).toMatchObject({ v: 'refar', comentari: 'plus fin' });
		expect(e.c).toMatchObject({ v: 'refach', comentari: '', responsa: 'traits allégés' });
		expect(e.d).toBeUndefined();
		expect(aTriar(els, e).map((x) => x.clau)).toEqual(['c', 'd']);
		expect(comptes(els, e)).toEqual({ gardar: 1, refar: 1, refach: 1, rèsta: 1 });
	});

	it('une croix a toujours un texte, dans les limites de la table', () => {
		expect(tèxteRefar('   ')).toBe(SENS_COMENTARI);
		expect(tèxteRefar(' trop chargé ')).toBe('trop chargé');
		expect(tèxteRefar('x'.repeat(3000))).toHaveLength(2000);
	});

	it('les cœurs partent en paquets de moins de 2 000 signes, sans rien perdre', () => {
		const claus = Array.from({ length: 400 }, (_, i) => `mot-${i}-${'x'.repeat(i % 17)}`);
		const paquets = paquetsGardats(claus);
		expect(paquets.flat()).toEqual(claus);
		for (const p of paquets) expect(tèxteGardats(p).length).toBeLessThanOrEqual(2000);
		const e = estatDe(paquets.map((p, i) => ({ id: i + 1, extrait: 'gardar', cibla: 'gardats', tèxte: tèxteGardats(p) })));
		expect(Object.keys(e)).toHaveLength(400);
	});
});

describe('triar : les lots', () => {
	it('des id courts, des clés uniques et sûres', () => {
		for (const lot of LOTS) {
			expect(lot.id.length, lot.id).toBeLessThanOrEqual(20);
			const claus = lot.elements().map((el) => el.clau);
			expect(new Set(claus).size, lot.id).toBe(claus.length);
			for (const c of claus) {
				expect(c.length, c).toBeLessThanOrEqual(300);
				expect(c, c).not.toMatch(/\n/); // une clé par ligne dans les paquets de cœurs
				expect(c, c).not.toBe('gardats');
			}
		}
	});

	it('le lot des dessins les montre tous, chacun une fois', () => {
		const lot = LOTS.find((l) => l.id === 'dessenhs');
		const els = lot.elements();
		const vists = new Set(els.map((el) => el.dessenh));
		expect(vists.size).toBe(els.length);
		expect(els.filter((el) => el.dessenh === DESSENHS[el.titol]).length).toBeGreaterThan(200);
		expect(els.length).toBeGreaterThan(200);
		for (const el of els) {
			expect(el.dessenh.length, el.clau).toBeGreaterThan(0);
			expect(el.context.length, el.clau).toBeGreaterThan(0);
		}
	});
});

describe('triar : les décisions', () => {
	it('chaque carte a une clé unique et courte, un titre, un texte et pas de tiret long', () => {
		const lot = LOTS.find((l) => l.id === 'decisions');
		expect(LOTS[0]).toBe(lot); // la page s'ouvre sur les décisions
		const els = lot.elements();
		expect(new Set(els.map((el) => el.clau)).size).toBe(els.length);
		for (const el of els) {
			expect(el.clau.length, el.clau).toBeLessThanOrEqual(40);
			expect(el.titol.length, el.clau).toBeGreaterThan(10);
			expect(el.decision.tèxte.length, el.clau).toBeGreaterThan(10);
			expect(el.titol + el.decision.tèxte + el.decision.avís, el.clau).not.toMatch(/[—–]/);
		}
	});
});
