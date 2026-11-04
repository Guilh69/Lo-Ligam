import { describe, it, expect } from 'vitest';
import { TEMAS, bonPanier } from './paniers-mots.js';
import { moduls, ordre } from '$lib/lesson/moduls/index.js';

// Les choses des encadrés « À retenir » des unités 1 à n, par id.
function choses(maxUnitat) {
	const m = new Map();
	for (const cle of ordre) {
		const u = parseInt(cle, 10);
		if (!(u >= 1 && u <= maxUnitat)) continue; // ni le module 0 ni les haltes
		for (const etape of moduls[cle].sessions)
			for (const bloc of etape.blocks)
				if (bloc.type === 'chunks') for (const it of bloc.items) if (it.id) m.set(it.id, it);
	}
	return m;
}

describe('panièrs : seulement des mots déjà appris', () => {
	for (const t of TEMAS) {
		const ch = choses(t.unitat);
		it(`${t.id} : deux paniers, chacun garni, pas de doublon`, () => {
			expect(t.paniers).toHaveLength(2);
			expect(new Set(t.mots.map((m) => m.oc)).size).toBe(t.mots.length);
			for (const p of t.paniers) expect(t.mots.filter((m) => bonPanier(m, p.id)).length).toBeGreaterThanOrEqual(3);
			expect(t.mots.length).toBeLessThanOrEqual(16);
		});
		for (const m of t.mots) {
			it(`${m.oc} (${t.id}) vient de l'encadré « ${m.id} »`, () => {
				const c = ch.get(m.id);
				expect(c, `pas de chose « ${m.id} » dans les unités 1 à ${t.unitat}`).toBeTruthy();
				expect(c.oc.split(' · ')).toContain(m.oc);
				expect(['a', 'b', 'ab']).toContain(m.panier);
			});
		}
	}
	it('Adieu va dans les deux paniers', () => {
		const adieu = TEMAS[0].mots.find((m) => m.oc === 'Adieu !');
		expect(bonPanier(adieu, 'a') && bonPanier(adieu, 'b')).toBe(true);
	});
});
