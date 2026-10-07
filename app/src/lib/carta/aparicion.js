// Las aparicions de las jaces (demanda de Romain, 2026-10-08 : « une carte
// informative mais aussi artistique, vraiment captivante ») : quand una jaça
// s'aluca, sos contorns son traçats per d'estelas que ne fan lo torn
// (despartaments, regions), o se pausan coma de constellacions (comunas).
// Dins l'esperit de la pagina d'acuèlh : d'estelas discretas mas vivas.

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const easeS = (t) => (1 - Math.cos(Math.PI * t)) / 2;

// Un contorn fa son torn en DURADA s ; los contorns partisson en onda, del
// mitan de la vista cap als bòrds, en ONDA s
export const DURADA = 1.5,
	ONDA = 0.75,
	TOTAL = DURADA + ONDA + 0.1;

// Un contorn : sos anèls (ponches en px) amb lors longors cumuladas, e son mitan
export function prepContorn(anels) {
	const rs = [];
	let sx = 0,
		sy = 0,
		n = 0;
	for (const a of anels) {
		if (a.length < 2) continue;
		const cum = new Float32Array(a.length);
		for (let i = 1; i < a.length; i++) cum[i] = cum[i - 1] + Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]);
		rs.push({ a, cum, L: cum[a.length - 1] });
		sx += a[0][0];
		sy += a[0][1];
		n++;
	}
	// (lo mitan : la mejana dels ponches del pus grand anèl)
	const gros = rs.reduce((m, r) => (!m || r.L > m.L ? r : m), null);
	if (gros) {
		sx = sy = 0;
		for (const q of gros.a) (sx += q[0]), (sy += q[1]);
		n = gros.a.length;
	}
	return { rs, x: n ? sx / n : 0, y: n ? sy / n : 0 };
}

// Lo ponch a la distància d sus un anèl
function ponchA(r, d) {
	const { a, cum } = r;
	if (d <= 0) return a[0];
	if (d >= r.L) return a[a.length - 1];
	let lo = 0,
		hi = a.length - 1;
	while (hi - lo > 1) {
		const m = (lo + hi) >> 1;
		if (cum[m] <= d) lo = m;
		else hi = m;
	}
	const t = (d - cum[lo]) / (cum[hi] - cum[lo] || 1);
	return [a[lo][0] + (a[hi][0] - a[lo][0]) * t, a[lo][1] + (a[hi][1] - a[lo][1]) * t];
}

// La part [0, p] de cada anèl, dins lo camin en cors
export function traçarPart(cx, ct, p) {
	for (const r of ct.rs) {
		const d = p * r.L,
			{ a, cum } = r;
		cx.moveTo(a[0][0], a[0][1]);
		let i = 1;
		for (; i < a.length && cum[i] <= d; i++) cx.lineTo(a[i][0], a[i][1]);
		if (i < a.length && p < 1) {
			const q = ponchA(r, d);
			cx.lineTo(q[0], q[1]);
		}
	}
}

// L'estela al cap del traç : un pichon cor lusent, un alo, e tres esquilhas
// que la seguisson
export function estelaCap(cx, ct, p, color, a) {
	if (a < 0.01) return;
	for (const r of ct.rs) {
		if (r.L < 30) continue; // (los illòts : sonque lo traç)
		const d = p * r.L;
		const [hx, hy] = ponchA(r, d);
		const g = cx.createRadialGradient(hx, hy, 0, hx, hy, 8);
		g.addColorStop(0, color);
		g.addColorStop(1, 'rgba(0, 0, 0, 0)');
		cx.globalAlpha = a * 0.4;
		cx.fillStyle = g;
		cx.fillRect(hx - 8, hy - 8, 16, 16);
		cx.fillStyle = color;
		for (let k = 0; k < 4; k++) {
			const [x, y] = k ? ponchA(r, d - k * 6) : [hx, hy];
			cx.globalAlpha = a * (k ? 0.6 - k * 0.15 : 1);
			cx.beginPath();
			cx.arc(x, y, k ? 1 - k * 0.2 : 1.5, 0, 6.283);
			cx.fill();
		}
	}
}

// L'avançada d'un contorn al temps t (s) : 0 abans son torn, 1 quand es fach
export function avançada(t, ct, W, H) {
	const R = 0.5 * Math.hypot(W, H);
	const retard = ONDA * clamp(Math.hypot(ct.x - W / 2, ct.y - H / 2) / R);
	return clamp((t - retard) / DURADA);
}

// Las constellacions d'una comuna : quauques ponches de sos contorns, que
// venon d'a costat se pausar (cada estela a sa dòna, totjorn la meteissa)
export function estelasDe(ct, max = 10) {
	const e = [];
	for (const r of ct.rs) {
		const n = Math.max(2, Math.min(max, Math.round(r.L / 14)));
		for (let k = 0; k < n; k++) {
			const [x, y] = ponchA(r, (k / n) * r.L);
			const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
			const f = h - Math.floor(h);
			e.push({ x, y, dx: (x - ct.x) * (0.35 + 0.4 * f), dy: (y - ct.y) * (0.35 + 0.4 * f), f });
		}
	}
	return e;
}
