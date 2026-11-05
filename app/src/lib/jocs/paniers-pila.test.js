import { describe, it, expect } from 'vitest';
import { TEMAS, bonPanier } from './paniers-mots.js';
import { rengs, nivel, largor, flanc, BORD, LABRE, FONS, VB } from './paniers-pila.js';

// un ordre d'arrivée mélangé, toujours le même (pas de hasard dans les tests)
function melhar(a, graine) {
	const b = a.slice();
	let s = graine;
	for (let i = b.length - 1; i > 0; i--) {
		s = (s * 9301 + 49297) % 233280;
		const j = Math.floor((s / 233280) * (i + 1));
		[b[i], b[j]] = [b[j], b[i]];
	}
	return b;
}

describe('le remplissage des paniers (paniers-pila.js)', () => {
	it('le panier est plus large en haut qu’au fond, et vide au départ', () => {
		expect(largor(BORD)).toBeGreaterThan(largor(FONS));
		expect(nivel(0)).toBe(FONS);
		expect(nivel(1)).toBe(LABRE);
		expect(rengs([], [{ oc: 'a', panier: 'a' }])).toEqual([]);
	});

	for (const t of TEMAS)
		for (const p of t.paniers)
			it(`${t.id}, ${p.id} : plein pile au bord, sans trou, quel que soit l’ordre`, () => {
				const totes = t.mots.filter((m) => bonPanier(m, p.id));
				for (const graine of [1, 7, 42, 99, 2026]) {
					const r = rengs(melhar(totes, graine), totes);
					// tous les mots sont rangés, une fois chacun
					expect(r.flatMap((x) => x.mots.map((m) => m.oc)).sort()).toEqual(totes.map((m) => m.oc).sort());
					// du fond au bord, les rangs se touchent
					expect(r[0].y0).toBeCloseTo(FONS, 6);
					for (let i = 1; i < r.length; i++) expect(r[i].y0).toBeCloseTo(r[i - 1].y1, 6);
					// le dernier mot arrive pile au bord, et le rang du dessus couvre l'ouverture
					expect(r.at(-1).y1).toBeCloseTo(LABRE, 6);
					expect(r.at(-1).ras).toBeGreaterThan(0);
					expect(r.slice(0, -1).every((x) => x.ras === 0)).toBe(true);
					// le texte reste dans le panier et garde un corps raisonnable
					for (const x of r) {
						expect(x.ins).toBeGreaterThan(0);
						expect(x.ins).toBeLessThan(VB.l / 2);
						expect(x.ins).toBeGreaterThanOrEqual(flanc(BORD) - 1e-9);
						expect(Math.min(x.fh, x.fw)).toBeGreaterThan(0);
					}
				}
			});

	// un téléphone de 375 px : paniers de 161 × 223 px (terrain 4/5)
	it('sur téléphone, le texte reste lisible quand les paniers sont pleins', () => {
		const [pw, ph] = [161, 223];
		const k = ph / VB.h / (pw / VB.l);
		for (const t of TEMAS)
			for (const p of t.paniers) {
				const totes = t.mots.filter((m) => bonPanier(m, p.id));
				for (const graine of [1, 7, 42, 99, 2026]) {
					const r = rengs(melhar(totes, graine), totes, k);
					const px = Math.min(...r.map((x) => Math.min((x.fh * ph) / 100, (x.fw * pw) / 100)));
					expect(px, `${t.id} ${p.id} graine ${graine}`).toBeGreaterThanOrEqual(11);
				}
			}
	});

	// Romain, 05-11 : « le el est trop petit » ; le premier mot posé, même court,
	// et chaque étape de la partie doivent rester lisibles sur téléphone
	it('sur téléphone, le texte reste lisible à chaque étape, dès le premier mot', () => {
		const [pw, ph] = [161, 223];
		const k = ph / VB.h / (pw / VB.l);
		for (const t of TEMAS)
			for (const p of t.paniers) {
				const totes = t.mots.filter((m) => bonPanier(m, p.id));
				for (const graine of [1, 7, 42, 99, 2026]) {
					const ordre = melhar(totes, graine);
					for (let n = 1; n <= ordre.length; n++) {
						const r = rengs(ordre.slice(0, n), totes, k);
						const px = Math.min(...r.map((x) => Math.min((x.fh * ph) / 100, (x.fw * pw) / 100)));
						expect(px, `${t.id} ${p.id} graine ${graine}, ${n} mot(s)`).toBeGreaterThanOrEqual(11.5);
					}
				}
			}
	});

	it('en cours de partie, le niveau monte avec les mots rangés', () => {
		const t = TEMAS[0];
		const totes = t.mots.filter((m) => bonPanier(m, t.paniers[0].id));
		let avant = FONS;
		for (let n = 1; n <= totes.length; n++) {
			const haut = rengs(totes.slice(0, n), totes).at(-1).y1;
			expect(haut).toBeLessThan(avant);
			avant = haut;
		}
	});
});
