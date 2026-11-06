import { describe, it, expect } from 'vitest';
import { IDS_SCENAS, scena } from './afica-scenas.js';
import { FAMILHAS } from './cataleg.js';

// les affiches de la salle de jeux : un dessin par famille, sain et léger
describe('affiches de la salle', () => {
	it('chaque famille a son affiche', () => {
		for (const f of FAMILHAS) expect(IDS_SCENAS).toContain(f.afica);
	});

	it('un id inconnu ne dessine rien', () => {
		expect(scena('nimporta')).toBe('');
	});

	for (const id of IDS_SCENAS) {
		describe(id, () => {
			const s = scena(id);

			it('aucun nombre manquant ni infini dans les tracés', () => {
				expect(s).not.toMatch(/NaN|undefined|Infinity/);
			});

			it('les groupes sont tous refermés', () => {
				const ouverts = (s.match(/<g[ >]/g) || []).length;
				const fermes = (s.match(/<[/]g>/g) || []).length;
				expect(ouverts).toBe(fermes);
			});

			it('les identifiants portent le nom de l’affiche', () => {
				const ids = [...s.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
				expect(ids.length).toBeGreaterThan(0);
				for (const i of ids) expect(i.endsWith('-' + id)).toBe(true);
				for (const [, ref] of s.matchAll(/url[(]#([^)]+)[)]/g)) expect(ids).toContain(ref);
			});

			it('reste léger (moins de 60 Ko de dessin)', () => {
				expect(s.length).toBeLessThan(60 * 1024);
			});
		});
	}
});
