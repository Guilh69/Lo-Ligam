import { describe, expect, it } from 'vitest';
import { MAX_FIN, NIVEAUX, plan } from './camin-plan.js';

const PISTES = ['hybride', 'balayage', 'constellation'];

describe('déroulé du chemin de S’apren : quatre niveaux', () => {
	it('quatre ronds, du débutant (3 points) à la croix pleine (12)', () => {
		expect(NIVEAUX).toEqual([3, 6, 9, 12]);
		PISTES.forEach((p) => expect(plan(p).ronds.map((r) => r.lit)).toEqual(NIVEAUX));
	});

	it('chaque rond n’allume que ses points, et ne relie que des points allumés', () => {
		PISTES.forEach((p) => {
			plan(p).ronds.forEach((r) => {
				expect(r.ponchs.filter((o) => o.on)).toHaveLength(r.lit);
				expect(r.ponchs.slice(0, r.lit).every((o) => o.on)).toBe(true);
				expect(r.ponchs.slice(r.lit).every((o) => !o.on)).toBe(true);
			});
			// rayons et arcs : 2 et 1 au premier niveau, 4 et 3, 6 et 5, puis 8 et 8 pour la croix pleine
			expect(plan(p).ronds.map((r) => [r.rais.length, r.arcs.length])).toEqual([
				[2, 1],
				[4, 3],
				[6, 5],
				[8, 8]
			]);
		});
	});

	it('le cercle se trace jusqu’un peu au-delà du dernier point allumé, entier pour la croix pleine', () => {
		const fs = plan('hybride').ronds.map((r) => r.f);
		expect(fs[3]).toBe(1);
		expect(fs[0]).toBeGreaterThan(2 / 12);
		expect(fs[0]).toBeLessThan(3 / 12);
		expect(fs[0] < fs[1] && fs[1] < fs[2] && fs[2] < fs[3]).toBe(true);
	});

	it('seul le dernier rond reçoit le double cercle du but', () => {
		PISTES.forEach((p) => expect(plan(p).ronds.map((r) => r.but !== null)).toEqual([false, false, false, true]));
	});

	it('seule la piste « balayage » a une aiguille', () => {
		expect(plan('balayage').ronds.every((r) => r.tete)).toBe(true);
		expect(plan('hybride').ronds.every((r) => r.tete === null)).toBe(true);
		expect(plan('constellation').ronds.every((r) => r.tete === null)).toBe(true);
	});

	it('tout est fini en moins de 5 s, et rien ne démarre avant 0', () => {
		PISTES.forEach((p) => {
			const pl = plan(p);
			expect(pl.fin).toBeLessThanOrEqual(MAX_FIN);
			pl.ronds.forEach((r) => {
				const tous = [r.verre, r.anell, r.hub, r.tete, r.but, ...r.ponchs, ...r.rais, ...r.arcs].filter((e) => e && e.u !== undefined);
				tous.forEach((e) => {
					expect(e.d).toBeGreaterThanOrEqual(0);
					expect(e.u).toBeGreaterThan(0);
				});
			});
			pl.via.forEach((v) => expect(v.d).toBeGreaterThanOrEqual(0));
		});
	});

	it('aucun rayon ne se trace avant le moyeu ni avant le premier point', () => {
		PISTES.forEach((p) => {
			plan(p).ronds.forEach((r) => {
				r.rais.forEach((x) => {
					expect(x.d).toBeGreaterThanOrEqual(r.hub.d - 1e-9);
					expect(x.d).toBeGreaterThanOrEqual(r.T);
				});
			});
		});
	});

	it('les ronds se chargent dans l’ordre', () => {
		PISTES.forEach((p) => {
			const t = plan(p).ronds.map((r) => r.T);
			expect([...t].sort((a, b) => a - b)).toEqual(t);
		});
	});
});
