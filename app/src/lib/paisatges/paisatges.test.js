// Paysages de Remira et du jeu « Ont es… ? » : chaque point est sur la photo,
// chaque mot a son français, chaque fichier existe.
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { PAISATGES, MOTS, TEMAS, camin, deTema } from './paisatges.js';

// les tests tournent depuis app/ (comme fichas.test.js)
const statique = 'static';

describe('paysages', () => {
	it('une douzaine de paysages, clés uniques', () => {
		expect(PAISATGES.length).toBeGreaterThanOrEqual(12);
		expect(new Set(PAISATGES.map((p) => p.clau)).size).toBe(PAISATGES.length);
	});

	for (const p of PAISATGES) {
		it(`${p.clau} : fichiers, texte de remplacement, points`, () => {
			for (const a of p.amples) expect(existsSync(`${statique}${camin(p.clau, a)}`), camin(p.clau, a)).toBe(true);
			expect(p.amples.at(-1)).toBe(p.l);
			expect(p.alt.length).toBeGreaterThan(30);
			expect(p.mots.length).toBeGreaterThanOrEqual(3);
			const vists = new Set();
			for (const [oc, x, y] of p.mots) {
				expect(MOTS[oc], `${oc} sans français`).toBeTruthy();
				expect(vists.has(oc), `${oc} deux fois`).toBe(false);
				vists.add(oc);
				expect(x).toBeGreaterThan(0);
				expect(x).toBeLessThan(1);
				expect(y).toBeGreaterThan(0);
				expect(y).toBeLessThan(1);
			}
		});
	}

	it('chaque paysage a un thème connu ; chaque thème a de quoi faire une partie (8 photos)', () => {
		const ids = new Set(TEMAS.map((t) => t.id));
		for (const p of PAISATGES) expect(ids.has(p.tema), `${p.clau} : thème ${p.tema}`).toBe(true);
		for (const t of TEMAS) {
			expect(deTema(t.id).length, t.id).toBeGreaterThanOrEqual(8);
			for (const l of ['oc', 'fr', 'es', 'en', 'ca', 'ar']) expect(t.nom[l], `${t.id} ${l}`).toBeTruthy();
		}
		expect(deTema(null).length).toBe(PAISATGES.length);
	});

	it('chaque mot du lexique sert au moins une fois', () => {
		const servits = new Set(PAISATGES.flatMap((p) => p.mots.map(([oc]) => oc)));
		for (const oc of Object.keys(MOTS)) expect(servits.has(oc), oc).toBe(true);
	});

	it('pour le jeu : deux points d’une même photo ne se touchent pas', () => {
		for (const p of PAISATGES)
			for (let i = 0; i < p.mots.length; i++)
				for (let j = i + 1; j < p.mots.length; j++) {
					const [a, xa, ya] = p.mots[i];
					const [b, xb, yb] = p.mots[j];
					// distance en fraction du grand côté de la photo
					const r = p.l / Math.max(p.l, p.h),
						q = p.h / Math.max(p.l, p.h);
					expect(Math.hypot((xa - xb) * r, (ya - yb) * q), `${p.clau} : ${a} / ${b}`).toBeGreaterThan(0.12);
				}
	});
});
