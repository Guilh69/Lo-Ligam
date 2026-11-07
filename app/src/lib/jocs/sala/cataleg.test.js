import { describe, it, expect } from 'vitest';
import { CAPACITATS, FAMILHAS, JOCS_SALA, jocsDe } from './cataleg.js';

// les jeux en ligne : ceux que la page /apren/jocs sait afficher
const EN_LINHA = ['serp', 'paniers', 'paisatges', 'intrus'];
const AFICAS = ['garona', 'vilatge', 'riu', 'plana', 'mar'];

describe('la salle de jeux', () => {
	it('chaque famille a un nom dans les deux langues, une affiche et au moins un jeu', () => {
		for (const f of FAMILHAS) {
			expect(f.oc && f.fr, f.id).toBeTruthy();
			expect(AFICAS).toContain(f.afica);
			expect(jocsDe(f.id).length, f.id).toBeGreaterThan(0);
		}
		expect(new Set(FAMILHAS.map((f) => f.afica)).size).toBe(FAMILHAS.length);
	});

	it('chaque jeu est dans une famille et dit ce qu’il fait travailler', () => {
		const ids = new Set();
		for (const j of JOCS_SALA) {
			expect(ids.has(j.id), `doublon ${j.id}`).toBe(false);
			ids.add(j.id);
			expect(FAMILHAS.map((f) => f.id)).toContain(j.familha);
			expect(j.capacitats.length).toBeGreaterThanOrEqual(2);
			expect(j.capacitats.length).toBeLessThanOrEqual(3);
			for (const c of j.capacitats) expect(CAPACITATS.map((x) => x.id)).toContain(c);
		}
	});

	it('un jeu en ligne a sa consigne et s’ouvre par ?joc= ; un jeu à venir a son nom français', () => {
		for (const j of JOCS_SALA) {
			if (j.disponible) {
				expect(EN_LINHA).toContain(j.id);
				expect(j.consigna?.oc && j.consigna?.fr, j.id).toBeTruthy();
			} else {
				expect(EN_LINHA).not.toContain(j.id);
				expect(j.fr, j.id).toBeTruthy();
			}
		}
		expect(JOCS_SALA.filter((j) => j.disponible).map((j) => j.id).sort()).toEqual([...EN_LINHA].sort());
	});

	it('le filtre ne garde que les jeux qui font travailler la capacité choisie', () => {
		expect(jocsDe('adreca', 'ortografia').map((j) => j.id)).toEqual(['serp']);
		expect(jocsDe('memoria', 'ortografia')).toEqual([]);
		for (const c of CAPACITATS) expect(JOCS_SALA.some((j) => j.capacitats.includes(c.id)), c.id).toBe(true);
	});
});
