// Note 126 de Romain (13-11) : « la flèche déclenche trop tôt l'effet de dispersion
// quand on survole ». La poussière d'or ne doit pas partir au simple passage de la
// souris, mais le geste voulu (clic maintenu, doigt) garde sa réponse immédiate.
import { describe, it, expect } from 'vitest';
import { forceDeLaMain, FORCE_MAX, SURVOL_V, SURVOL_PLEIN, SURVOL_ELAN } from './survol.js';

const DT = 1 / 60;

// Fait filer la souris à vitesse constante pendant `duree` secondes ; rend la force maximale.
function volee(vitesse, duree, appuye = false) {
	let elan = 0,
		max = 0;
	for (let t = 0; t < duree; t += DT) {
		const r = forceDeLaMain({ vitesse, appuye, elan, dt: DT });
		elan = r.elan;
		max = Math.max(max, r.force);
	}
	return max;
}

// L'ancien réglage, gardé ici pour la comparaison (seuil 120 px/s, force immédiate).
const ancien = (v) => (v < 120 ? 0 : Math.min(1.6, v / 500) * 5500);

describe('survol à la souris (bouton relevé)', () => {
	it('un passage tranquille, même d’un demi-seconde, ne bouge aucun grain', () => {
		for (const v of [150, 250, 350, SURVOL_V - 1]) {
			expect(ancien(v)).toBeGreaterThan(0); // avant : la poussière partait dès 120 px/s
			expect(volee(v, 0.5)).toBe(0);
		}
	});

	it('une volée brève, même rapide, ne défait pas le mot tout de suite', () => {
		// un coup de souris de 0,05 s à 1200 px/s : avant, pleine force dès la première image
		expect(ancien(1200)).toBe(FORCE_MAX);
		expect(volee(1200, 0.05)).toBeLessThan(FORCE_MAX * 0.5);
	});

	it('une vraie volée, tenue, retrouve toute sa force', () => {
		expect(volee(SURVOL_PLEIN, SURVOL_ELAN + 0.1)).toBeCloseTo(FORCE_MAX, 5);
		expect(volee(2000, 0.5)).toBeCloseTo(FORCE_MAX, 5);
	});

	it('la force monte avec la vitesse (rien de brutal à 450 px/s)', () => {
		const lente = volee(SURVOL_V + 50, 1),
			moyenne = volee(675, 1),
			vive = volee(SURVOL_PLEIN, 1);
		expect(lente).toBeGreaterThan(0);
		expect(lente).toBeLessThan(moyenne);
		expect(moyenne).toBeLessThan(vive);
	});

	it('l’élan retombe vite quand la souris ralentit : le passage suivant repart de zéro', () => {
		let elan = 0;
		for (let t = 0; t < 0.4; t += DT) elan = forceDeLaMain({ vitesse: 1200, appuye: false, elan, dt: DT }).elan;
		expect(elan).toBe(1);
		for (let t = 0; t < 0.12; t += DT) elan = forceDeLaMain({ vitesse: 0, appuye: false, elan, dt: DT }).elan;
		expect(elan).toBe(0);
	});
});

describe('appuyé (clic maintenu, doigt) : le geste voulu répond tout de suite', () => {
	it('mêmes valeurs qu’avant, dès la première image', () => {
		for (const v of [0, 100, 119, 120, 300, 500, 800, 1500]) {
			const r = forceDeLaMain({ vitesse: v, appuye: true, elan: 0.7, dt: DT });
			expect(r.force).toBe(ancien(v));
			expect(r.elan).toBe(0);
		}
	});
});
