// La grille par facettes (13-11) : complète, états valides, deux rubriques en chantier au plus,
// et aucune case « bon / à améliorer / manque » sans preuve écrite (règle d'honnêteté).
import { describe, it, expect } from 'vitest';
import {
	RUBRIQUES,
	EXIGENCES,
	ESTATS_CASA,
	ESTATS_RUBRICA,
	MAX_EN_CHANTIER,
	comptesCases,
	enChantier,
	chantiersRespectes
} from './facetas.js';

describe('facetas', () => {
	it('6 rubriques, 8 exigences, clés uniques', () => {
		expect(RUBRIQUES).toHaveLength(6);
		expect(EXIGENCES).toHaveLength(8);
		expect(new Set(RUBRIQUES.map((r) => r.clau)).size).toBe(6);
		expect(new Set(EXIGENCES.map((e) => e.clau)).size).toBe(8);
	});

	it('toutes les cases existent (6 x 8) avec un état valide et une phrase', () => {
		for (const r of RUBRIQUES) {
			expect(ESTATS_RUBRICA[r.estat], r.clau).toBeTruthy();
			expect(Object.keys(r.cases).sort(), r.clau).toEqual(EXIGENCES.map((e) => e.clau).sort());
			for (const e of EXIGENCES) {
				const c = r.cases[e.clau];
				expect(ESTATS_CASA[c.etat], `${r.clau}/${e.clau}`).toBeTruthy();
				expect(c.phrase.trim().length, `${r.clau}/${e.clau}`).toBeGreaterThan(5);
			}
		}
	});

	it('au plus deux rubriques en chantier', () => {
		expect(enChantier().length).toBeLessThanOrEqual(MAX_EN_CHANTIER);
		expect(chantiersRespectes()).toBe(true);
		const trois = RUBRIQUES.map((r) => ({ ...r, estat: 'chantier' }));
		expect(chantiersRespectes(trois)).toBe(false);
	});

	it('chaque case « bon », « à améliorer » ou « manque » a une preuve non vide', () => {
		for (const r of RUBRIQUES)
			for (const e of EXIGENCES) {
				const c = r.cases[e.clau];
				if (['bon', 'melhorar', 'manca'].includes(c.etat))
					expect(c.preuve.trim().length, `${r.clau}/${e.clau}`).toBeGreaterThan(3);
			}
	});

	it('chaque rubrique dit ce qui attend Romain et ce qui attend l’IA', () => {
		for (const r of RUBRIQUES) {
			expect(r.romain.length, r.clau).toBeGreaterThan(0);
			expect(r.ia.length, r.clau).toBeGreaterThan(0);
		}
	});

	it('les comptes font 48 cases', () => {
		const n = comptesCases();
		expect(Object.values(n).reduce((a, b) => a + b, 0)).toBe(48);
	});

	it('pas de tiret long dans les textes (règle du projet)', () => {
		for (const r of RUBRIQUES)
			for (const e of EXIGENCES) {
				const c = r.cases[e.clau];
				expect(c.phrase + c.preuve, `${r.clau}/${e.clau}`).not.toMatch(/[—–]/);
			}
	});
});
