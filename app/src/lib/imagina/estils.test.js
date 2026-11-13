import { describe, it, expect } from 'vitest';
import { ESTILS, LETRAS, estilsDe, estilPerDefaut, nomEstil, compausar, mesuraAproximada } from './estils.js';
import { NATURAS } from './emplacements.js';

describe('styles de ce qu’on imagine sur une photo', () => {
	it('chaque nature a ses styles, le style libre en dernier', () => {
		for (const n of NATURAS) {
			const l = estilsDe(n.id);
			expect(l.length).toBeGreaterThanOrEqual(1);
			expect(l.at(-1).id).toBe('liure');
			expect(estilPerDefaut(n.id)).toBe(l[0].id);
		}
		expect(estilsDe('placa').map((e) => e.id)).toEqual(['montpelhier', 'esmalt', 'clara', 'liure']);
		expect(estilsDe('autre').map((e) => e.id)).toEqual(['liure']);
	});

	it('chaque style est complet et son identifiant tient dans la demande', () => {
		const vistes = new Set();
		for (const e of ESTILS) {
			expect(e.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
			expect(vistes.has(e.id)).toBe(false);
			vistes.add(e.id);
			expect(LETRAS[e.letra]).toBeTruthy();
			expect(e.tinta).toMatch(/^#[0-9a-f]{6}$/);
			expect(nomEstil(e.id)).toBe(e.fr);
			if (e.naturas) for (const n of e.naturas) expect(NATURAS.some((x) => x.id === n)).toBe(true);
		}
	});

	it('met le texte en lignes pour que la lettre soit la plus grande possible', () => {
		const esmalt = ESTILS.find((e) => e.id === 'esmalt');
		const m = mesuraAproximada(esmalt);
		// plaque presque carrée : deux lignes ; bandeau très long : une seule
		const placa = compausar('Carrièra de la Lòtja', esmalt, 180, 100, m);
		expect(placa.linhas).toEqual(['CARRIÈRA', 'DE LA LÒTJA']);
		const bendel = compausar('Carrièra de la Lòtja', esmalt, 900, 100, m);
		expect(bendel.linhas).toEqual(['CARRIÈRA DE LA LÒTJA']);
		expect(bendel.talha).toBeGreaterThan(placa.talha);
		// la ligne la plus large tient dans le bloc
		for (const r of [placa, bendel]) expect(Math.max(...r.linhas.map(m)) * r.talha).toBeLessThanOrEqual(900);
		expect(Math.max(...placa.linhas.map(m)) * placa.talha).toBeLessThanOrEqual(180);
		expect(placa.linhas.length * placa.talha * placa.interlinha).toBeLessThanOrEqual(100);
		// pas de majuscules imposées pour la plaque de Montpellier
		expect(compausar('Carrièra de Sant Pèire', ESTILS[0], 184, 100, mesuraAproximada(ESTILS[0])).linhas.join(' ')).toBe('Carrièra de Sant Pèire');
		expect(compausar('  ', esmalt, 180, 100, m)).toEqual({ linhas: [], talha: 0, interlinha: placa.interlinha });
	});
});
