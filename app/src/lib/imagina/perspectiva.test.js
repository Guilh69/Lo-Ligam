import { describe, it, expect } from 'vitest';
import { mendrePropri, segments, camera, preparar, vertical, paret, orizontala, quadParet, grasilha, perspectiva, omografia, aplicar, matrix3d, dins } from './perspectiva.js';

const RAD = Math.PI / 180;
const unit = (a) => {
	const n = Math.hypot(...a);
	return a.map((x) => x / n);
};
const angle = (a, b) => Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) / RAD;

// Une scène de synthèse : appareil penché vers le haut, un mur tourné de `phi`, des traits sur ce mur.
const cam = camera({ l: 1600, h: 1200 }, [0.8, 0.5, 0.5]);
function scena(phi, pencha = 12, bruit = 0) {
	const dv = unit([0.02, Math.cos(pencha * RAD), -Math.sin(pencha * RAD)]);
	const dh = orizontala(dv, phi);
	let g = 7;
	const rnd = () => ((g = (g * 16807) % 2147483647) / 2147483647 - 0.5) * 2;
	const proj = (P) => [cam.cx + (cam.f * P[0]) / P[2], cam.cy + (cam.f * P[1]) / P[2] / cam.r];
	const pt = (u, v) => proj([0.1 + u * dh[0] + v * dv[0], 0.02 + u * dh[1] + v * dv[1], 1 + u * dh[2] + v * dv[2]]);
	const segs = [];
	const trach = (a, b) => {
		const p = pt(...a),
			q = pt(...b);
		segs.push([p[0] + bruit * rnd(), p[1] + bruit * rnd(), q[0] + bruit * rnd(), q[1] + bruit * rnd()]);
	};
	for (let i = -4; i <= 4; i++) {
		trach([-0.25, i * 0.06], [-0.1, i * 0.06]); // linteaux, appuis
		trach([0.05, i * 0.06 + 0.02], [0.22, i * 0.06 + 0.02]);
		trach([i * 0.07, -0.25], [i * 0.07, -0.1]); // montants
		trach([i * 0.07 + 0.03, 0.05], [i * 0.07 + 0.03, 0.24]);
	}
	return { dv, dh, segs };
}

describe('perspective du mur', () => {
	it('trouve le vecteur propre de la plus petite valeur propre', () => {
		const v = unit([1, 2, -2]);
		// matrice qui annule v : I - v vT
		const M = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? 1 : 0) - v[i] * v[j]));
		expect(angle(mendrePropri(M), v)).toBeLessThan(1e-6);
	});

	it('retrouve la verticale et l’orientation du mur d’une scène de synthèse', () => {
		for (const phi of [-62, -25, 0, 18, 55]) {
			const s = scena(phi);
			const tr = preparar(s.segs, cam);
			const v = vertical(tr);
			expect(angle(v.d, s.dv)).toBeLessThan(0.05);
			const p = paret(tr, cam, v.d, [0.45, 0.45, 0.6, 0.52]);
			expect(Math.abs(p.phi - phi)).toBeLessThan(0.1);
			expect(p.fisable).toBe(true);
		}
	});

	it('tient avec des traits imprécis', () => {
		const s = scena(-33, 15, 0.0015);
		const tr = preparar(s.segs, cam);
		const v = vertical(tr);
		expect(angle(v.d, s.dv)).toBeLessThan(1.5);
		expect(Math.abs(paret(tr, cam, v.d, [0.45, 0.45, 0.6, 0.52]).phi + 33)).toBeLessThan(3);
	});

	it('sans traits, garde la photo droite et le dit', () => {
		const v = vertical([]);
		expect(v.d).toEqual([0, 1, 0]);
		const p = perspectiva([], cam, [0.4, 0.4, 0.6, 0.5]);
		expect(p.fisable).toBe(false);
		expect(p.phi).toBe(0);
		// mur de face, appareil droit : la forme couchée est le rectangle tracé
		p.quad.flat().forEach((c, i) => expect(c).toBeCloseTo([0.4, 0.4, 0.6, 0.4, 0.6, 0.5, 0.4, 0.5][i], 9));
		expect(p.proporcion).toBeCloseTo((0.2 * 1600) / (0.1 * 1200), 9);
	});

	it('couche le rectangle sur le mur : médianes égales au tracé, côtés qui fuient vers les points de fuite', () => {
		const s = scena(-40, 14);
		const zona = [0.55, 0.3, 0.75, 0.38];
		const { quad, proporcion } = quadParet(cam, s.dv, -40, zona);
		const mil = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
		// les médianes de la forme ne sont pas les milieux des côtés en perspective : on les reprend sur le mur
		const tr = preparar(
			[
				[...quad[0], ...quad[1]],
				[...quad[3], ...quad[2]],
				[...quad[0], ...quad[3]],
				[...quad[1], ...quad[2]]
			],
			cam
		);
		const esc = (n, d) => Math.abs(n[0] * d[0] + n[1] * d[1] + n[2] * d[2]);
		expect(esc(tr[0].n, s.dh)).toBeLessThan(1e-9); // haut et bas : horizontales du mur
		expect(esc(tr[1].n, s.dh)).toBeLessThan(1e-9);
		expect(esc(tr[2].n, s.dv)).toBeLessThan(1e-9); // côtés : verticales
		expect(esc(tr[3].n, s.dv)).toBeLessThan(1e-9);
		// le centre du tracé est sur les deux diagonales de la forme (centre du rectangle réel)
		const H = omografia(
			[
				[0, 0],
				[1, 0],
				[1, 1],
				[0, 1]
			],
			quad
		);
		const c = aplicar(H, [0.5, 0.5]);
		expect(c[0]).toBeCloseTo(0.65, 9);
		expect(c[1]).toBeCloseTo(0.34, 9);
		const g = aplicar(H, [0, 0.5]),
			d = aplicar(H, [1, 0.5]),
			ha = aplicar(H, [0.5, 0]),
			ba = aplicar(H, [0.5, 1]);
		expect(d[0] - g[0]).toBeCloseTo(0.2, 9); // médiane horizontale : la largeur tracée
		expect(ba[1] - ha[1]).toBeCloseTo(0.08, 9); // médiane verticale : la hauteur tracée
		expect(proporcion).toBeGreaterThan(0);
		expect(mil(quad[0], quad[2])[0]).not.toBeCloseTo(0.65, 4); // en perspective, pas un parallélogramme
		expect(grasilha(cam, s.dv, -40, zona).length).toBeGreaterThan(10);
	});

	it('pose un dessin à plat sur quatre coins', () => {
		const coins = [
			[12, 30],
			[240, 18],
			[251, 133],
			[8, 120]
		];
		const src = [
			[0, 0],
			[300, 0],
			[300, 100],
			[0, 100]
		];
		const H = omografia(src, coins);
		src.forEach((p, i) => aplicar(H, p).forEach((v, k) => expect(v).toBeCloseTo(coins[i][k], 8)));
		expect(matrix3d(300, 100, coins)).toMatch(/^matrix3d\((-?[\d.e-]+,){15}-?[\d.e-]+\)$/);
		expect(
			omografia(src, [
				[0, 0],
				[1, 1],
				[2, 2],
				[3, 3]
			])
		).toBe(null);
		expect(dins(coins, [120, 70])).toBe(true);
		expect(dins(coins, [300, 70])).toBe(false);
	});

	it('trouve les traits droits d’une image', () => {
		const w = 240,
			h = 180,
			g = new Float32Array(w * h).fill(200);
		// un volet sombre : rectangle de 80 × 110, penché de rien
		for (let y = 30; y < 140; y++) for (let x = 70; x < 150; x++) g[y * w + x] = 60;
		const s = segments(g, w, h);
		const pente = (t) => Math.abs(Math.atan2((t[3] - t[1]) * h, (t[2] - t[0]) * w) / RAD);
		const oriz = s.filter((t) => pente(t) < 2 || pente(t) > 178),
			vert = s.filter((t) => Math.abs(pente(t) - 90) < 2);
		expect(oriz.length).toBe(2);
		expect(vert.length).toBe(2);
		expect(s.length).toBe(4);
		// bien placés : les deux horizontales sur les bords haut et bas du volet
		const ys = oriz.map((t) => ((t[1] + t[3]) / 2) * h).sort((a, b) => a - b);
		expect(ys[0]).toBeGreaterThan(28);
		expect(ys[0]).toBeLessThan(32);
		expect(ys[1]).toBeGreaterThan(138);
		expect(ys[1]).toBeLessThan(142);
	});

	it('donne une caméra courante quand la focale manque', () => {
		const c = camera({ l: 1600, h: 1200 });
		expect(c.mesurada).toBe(false);
		expect(c.f).toBeCloseTo(0.62 * 1.25, 9);
		expect(camera({ l: 1600, h: 1200 }, [0.78, 0.5, 0.47])).toEqual({ f: 0.78, cx: 0.5, cy: 0.47, r: 0.75, mesurada: true });
	});
});
