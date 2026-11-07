// « Pausa los mots » : sur chaque photo, les cases ne se chevauchent pas, ne
// cachent aucun point d'or et restent dans la photo, sur un grand écran comme
// sur un téléphone (mêmes tailles de texte que le jeu : casaDe()).
import { describe, it, expect } from 'vitest';
import { PAISATGES } from '$lib/paisatges/paisatges.js';
import { plaçarCasas, recobriment, casaDe } from './pausa-casas.js';

const ECRANS = [
	['ordinateur', 1300, 790],
	['portable', 1000, 600],
	['téléphone', 343, 430]
];

describe('Pausa los mots : les cases sur la photo', () => {
	for (const [nom, AW, AH] of ECRANS) {
		it(`${nom} : chaque case à sa place, sans chevauchement`, () => {
			for (const p of PAISATGES) {
				const r = p.l / p.h;
				const W = Math.min(AW, AH * r),
					H = W / r;
				const { w, h } = casaDe(Math.max(W, H), p.mots.map(([oc]) => oc.length));
				const c = plaçarCasas(p.mots, W, H, w, h);
				expect(c.length).toBe(p.mots.length);
				for (const a of c) {
					expect(a.x, p.clau).toBeGreaterThanOrEqual(0);
					expect(a.y, p.clau).toBeGreaterThanOrEqual(0);
					expect(a.x + a.w, p.clau).toBeLessThanOrEqual(W);
					expect(a.y + a.h, p.clau).toBeLessThanOrEqual(H);
					for (const q of c) {
						const dins = a.ax > q.x + 2 && a.ax < q.x + q.w - 2 && a.ay > q.y + 2 && a.ay < q.y + q.h - 2;
						expect(dins, `${p.clau} : la case de ${q.oc} cache le point de ${a.oc}`).toBe(false);
						if (q !== a) expect(recobriment(a, q) / (w * h), `${p.clau} : ${a.oc} / ${q.oc}`).toBeLessThan(0.02);
					}
				}
			}
		});
	}
});
