import { describe, it, expect } from 'vitest';
import { UNITATS, copar, letrasDe } from './serp-mots.js';
import { novelaPartida, virar, pas, posicions, letraAttesa, DIRS } from './serp.js';
import { moduls, ordre } from '$lib/lesson/moduls/index.js';

// Les choses des encadrés « À retenir » des unités 1 et 2, par id.
function chosesUnitat(u) {
	const m = new Map();
	for (const cle of ordre.filter((c) => c.startsWith(`${u}-`))) {
		for (const etape of moduls[cle].sessions)
			for (const bloc of etape.blocks)
				if (bloc.type === 'chunks') for (const it of bloc.items) if (it.id) m.set(it.id, it);
	}
	return m;
}

describe('sèrp : seulement des mots déjà appris', () => {
	for (const u of UNITATS) {
		const choses = chosesUnitat(u.id);
		for (const m of u.mots) {
			it(`${m.mot} (unité ${u.id}) vient de l'encadré « ${m.id} »`, () => {
				const chose = choses.get(m.id);
				expect(chose, `pas de chose « ${m.id} » dans l'unité ${u.id}`).toBeTruthy();
				const { avant, apres } = copar(m.cadre);
				expect(chose.oc).toContain(avant + m.mot + apres);
				expect(chose.sound).toContain(m.son);
				expect(m.mot).not.toMatch(/[\s’'-]/);
				expect(letrasDe(m.mot).length).toBeLessThanOrEqual(9);
				expect(m.trapas.length).toBeGreaterThan(0);
				expect(m.trapas.length).toBeLessThanOrEqual(2);
			});
		}
	}
});

// Tirage prévisible pour les tests
function graine(s = 7) {
	return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

describe('sèrp : le jeu', () => {
	it('place les lettres sans qu’elles se touchent, hors de la sèrp et de sa route', () => {
		for (let s = 1; s < 40; s++) {
			const p = novelaPartida({ mot: 'Encantada', trapas: ['h', 'é'], cols: 10, rows: 12, rand: graine(s) });
			expect(p.teulas).toHaveLength(11);
			for (const a of p.teulas) {
				for (const b of p.teulas)
					if (a !== b) expect(Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1).toBe(false);
				expect(a.y === p.cors[0].y && a.x >= p.cors[0].x && a.x <= p.cors[0].x + 4).toBe(false);
			}
		}
	});

	it('le bord fait passer de l’autre côté', () => {
		const p = novelaPartida({ mot: 'mas', cols: 6, rows: 6, cap: { x: 5, y: 2 }, rand: graine() });
		p.teulas = [];
		pas(p);
		expect(p.cors[0]).toEqual({ x: 0, y: 2 });
		virar(p, DIRS.amont);
		pas(p);
		pas(p);
		pas(p);
		expect(p.cors[0]).toEqual({ x: 0, y: 5 });
	});

	it('mange dans l’ordre, la lettre fausse reste, la queue écrit le mot', () => {
		const p = novelaPartida({ mot: 'mas', cols: 10, rows: 5, cap: { x: 0, y: 2 }, rand: graine() });
		// lettres posées à la main sur la route : m, i (piège), a, s
		p.teulas = [
			{ k: 0, l: 'm', x: 1, y: 2, manjada: false },
			{ k: 1, l: 'i', x: 2, y: 2, manjada: false },
			{ k: 2, l: 'a', x: 3, y: 2, manjada: false },
			{ k: 3, l: 's', x: 5, y: 2, manjada: false }
		];
		expect(pas(p).tipe).toBe('manjada');
		expect(letraAttesa(p)).toBe('a');
		expect(pas(p).tipe).toBe('error');
		expect(p.teulas[1].manjada).toBe(false);
		expect(pas(p).tipe).toBe('manjada');
		expect(pas(p).tipe).toBe('res');
		expect(pas(p).tipe).toBe('acabat');
		expect(p.acabat).toBe(true);
		// lue de la queue vers la tête : m, a, s (le s encore sous la tête)
		const pos = posicions(p).filter((t) => t.cors).sort((a, b) => a.x - b.x);
		expect(pos.map((t) => t.l).join('')).toBe('mas');
		expect(pos.at(-1).sotaCap).toBe(true);
	});

	it('une lettre répétée : n’importe laquelle des deux convient', () => {
		const p = novelaPartida({ mot: 'ela', cols: 10, rows: 5, cap: { x: 0, y: 2 }, rand: graine() });
		p.teulas = [
			{ k: 0, l: 'e', x: 1, y: 2, manjada: false },
			{ k: 1, l: 'l', x: 3, y: 2, manjada: false },
			{ k: 2, l: 'l', x: 5, y: 2, manjada: false },
			{ k: 3, l: 'a', x: 7, y: 2, manjada: false }
		];
		const tipes = [];
		for (let i = 0; i < 7; i++) tipes.push(pas(p).tipe);
		expect(tipes).toEqual(['manjada', 'res', 'manjada', 'res', 'error', 'res', 'acabat']);
	});

	it('ne fait jamais demi-tour sur sa queue, et s’arrête au lieu de se mordre', () => {
		const p = novelaPartida({ mot: 'lenga', cols: 8, rows: 8, cap: { x: 0, y: 0 }, rand: graine() });
		p.teulas = ['l', 'e', 'n', 'g'].map((l, k) => ({ k, l, x: k + 1, y: 0, manjada: false }));
		p.teulas.push({ k: 4, l: 'a', x: 7, y: 7, manjada: false });
		for (let i = 0; i < 4; i++) pas(p);
		pas(p); // la sèrp grandit encore d'une case : tête + 4 lettres
		expect(p.cors).toHaveLength(5);
		expect(virar(p, DIRS.esquerra)).toBe(false);
		// tourner trois fois à droite pour revenir sur la queue
		virar(p, DIRS.aval);
		pas(p);
		virar(p, DIRS.esquerra);
		pas(p);
		virar(p, DIRS.amont);
		const avant = p.cors.map((c) => ({ ...c }));
		expect(pas(p).tipe).toBe('barrada');
		expect(p.cors).toEqual(avant);
	});
});
