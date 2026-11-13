import { describe, it, expect } from 'vitest';
import { FOTOS, MOTS, motsDe, endrechsDe } from './atelier.js';
import { NATURAS } from './emplacements.js';
import { esquissa, compausar, coucar, fugas, marge, LARG, MARGE } from './esquissa.js';

// mesure approchée (sans canevas) : 0,55 cadratin par lettre à la taille 100
const mesura = (t) => t.length * 55;

describe('atelier S’imagina : les endroits', () => {
	it('chaque photo a deux à quatre endroits, chacun d’une sorte connue, avec ses mots', () => {
		const sortes = new Set(NATURAS.map((n) => n.id));
		for (const f of FOTOS) {
			expect(f.endrechs.length, f.clau).toBeGreaterThanOrEqual(2);
			expect(f.endrechs.length, f.clau).toBeLessThanOrEqual(4);
			for (const e of f.endrechs) {
				expect(sortes.has(e.natura), e.id).toBe(true);
				expect(motsDe(e).length, e.id).toBeGreaterThan(0);
			}
		}
	});

	it('six à dix mots par sorte, en occitan et en français, sans doublon', () => {
		for (const [natura, ms] of Object.entries(MOTS)) {
			expect(ms.length, natura).toBeGreaterThanOrEqual(6);
			expect(ms.length, natura).toBeLessThanOrEqual(10);
			expect(new Set(ms.map((m) => m.oc)).size).toBe(ms.length);
			for (const m of ms) expect(m.oc && m.fr, natura).toBeTruthy();
		}
	});

	it('chaque endroit donne quatre coins dans la photo et une proportion plausible', () => {
		for (const f of FOTOS) {
			const q = endrechsDe(f);
			for (const e of f.endrechs) {
				const { quad, proporcion } = q[e.id];
				expect(quad).toHaveLength(4);
				for (const [x, y] of quad) {
					expect(x, `${f.clau}/${e.id}`).toBeGreaterThan(0);
					expect(x).toBeLessThan(1);
					expect(y).toBeGreaterThan(0);
					expect(y).toBeLessThan(1);
				}
				expect(proporcion).toBeGreaterThan(0.3);
				expect(proporcion).toBeLessThan(12);
			}
		}
	});

	it('un mur relevé n’est pas pris de face (les arêtes donnent son orientation)', () => {
		const q = endrechsDe(FOTOS.find((f) => f.clau === 'fornaria'));
		expect(Math.abs(q.naut.phi)).toBeGreaterThan(10);
	});
});

describe('esquisses', () => {
	it('un mot long se coupe en lignes plutôt que de rapetisser', () => {
		const c = compausar('Fèsta del vilatge', {
			l: 900,
			h: 900,
			familha: 'luciole',
			pes: 700,
			mesura
		});
		expect(c.lignes.length).toBeGreaterThan(1);
		const seul = compausar('Bal', {
			l: 900,
			h: 300,
			familha: 'luciole',
			pes: 700,
			mesura
		});
		expect(seul.lignes).toEqual(['Bal']);
	});

	it('les trois styles donnent des formes dans le repère à plat', () => {
		for (const estil of ['traç', 'papièr', 'calc']) {
			const e = esquissa({
				estil,
				mot: { oc: 'Fornariá', fr: 'Boulangerie' },
				prop: 2,
				px: 5,
				mesura
			});
			expect(e.W).toBe(LARG);
			expect(e.H).toBe(500);
			expect(e.formas.some((f) => f.t === 'text' && f.text.toLowerCase() === 'fornariá')).toBe(true);
			// tout reste dans la marge du canevas à plat (sinon l'image enregistrée le couperait)
			const m = marge(e);
			for (const f of e.formas) {
				if (f.t === 'rect') {
					expect(f.x).toBeGreaterThanOrEqual(-m);
					expect(f.y + f.h).toBeLessThanOrEqual(e.H + m);
				}
				if (f.t === 'text') expect(f.y + 0.35 * f.talha).toBeLessThanOrEqual(e.H + m);
			}
			expect(e.fuga).toBe(estil === 'calc');
		}
	});

	it('les lignes de fuite prolongent chaque arête de ses deux côtés', () => {
		const f = fugas(
			[
				[0.4, 0.4],
				[0.6, 0.4],
				[0.6, 0.5],
				[0.4, 0.5]
			],
			0.5
		);
		expect(f).toHaveLength(8);
		expect(f[0]).toEqual([0.6, 0.4, 0.7, 0.4]);
	});

	it('l’image à plat se couche sur les quatre coins (homographie inverse, fondu sur la photo)', () => {
		// un canevas à plat entièrement rouge et opaque, posé sur un carré de la photo
		const W = 10,
			H = 10,
			s = 1;
		const pw = W + 2 * MARGE,
			ph = H + 2 * MARGE;
		const plat = {
			width: pw,
			height: ph,
			data: new Uint8ClampedArray(pw * ph * 4)
		};
		for (let y = MARGE; y < MARGE + H; y++)
			for (let x = MARGE; x < MARGE + W; x++) plat.data.set([255, 0, 0, 255], (y * pw + x) * 4);
		const dest = {
			width: 40,
			height: 40,
			data: new Uint8ClampedArray(40 * 40 * 4).fill(255)
		};
		coucar(dest, plat, {
			W,
			H,
			s,
			quad: [
				[10, 10],
				[30, 10],
				[30, 30],
				[10, 30]
			]
		});
		const px = (x, y) => Array.from(dest.data.slice((y * 40 + x) * 4, (y * 40 + x) * 4 + 3));
		expect(px(20, 20)).toEqual([255, 0, 0]);
		expect(px(2, 2)).toEqual([255, 255, 255]);
	});
});
