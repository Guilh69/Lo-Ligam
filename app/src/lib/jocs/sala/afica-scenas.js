// Les affiches de la salle de jeux : cinq paysages d'Occitanie dessinés par le
// code, d'après les photos de Romain (static/apren/paisatges : garona,
// vilatge, riu, plana, mar-pin). Romain, 2026-11-06 : « des visuels qui
// s'inspirent de tableaux calmes de l'Occitanie et de paysages, et moins ce
// style vraiment IA » ; le soir : « pas mal mais pas assez travaillées ».
//
// La manière : une affiche peinte. Des plans qui pâlissent en s'éloignant, une
// lumière venue de la gauche (faces à l'ombre, touches de lumière), la matière
// faite de coups de pinceau (feuillages, nuages, galets, pierres) et de filets
// fins (eau, strates, tuiles, écorce).
//
// Léger : un coup de pinceau est un trait très court à bouts ronds ; ils sont
// rangés par grosseur (trois tracés par couleur) et tirés d'un hasard fixe (le
// même dessin à chaque visite). Le dessin est fait dans le navigateur
// (Afica.svelte) : rien de tout cela dans la page envoyée.
//
// Les classes posées ici (nivols, ondas-a, ondas-b, escuma, lusor-a, lusor-b,
// volar, balanc, pin, ventolet, lums, sornas, barca) sont celles qui bougent en
// joiós ; leurs mouvements sont dans Afica.svelte.

/** un hasard fixe (mulberry32) : le même tirage à chaque visite */
function azard(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
const r1 = (v) => Math.round(v * 10) / 10;

// ── l'écriture du SVG ──

/** les attributs d'un élément (les vides sont omis) */
function at(o = {}) {
	let s = '';
	for (const k in o) if (o[k] !== undefined && o[k] !== '') s += ` ${k}="${o[k]}"`;
	return s;
}
/** un tracé plein */
const ple = (d, fill, o = {}) => (d ? `<path d="${d}"${at({ fill, ...o })}/>` : '');
/** un tracé au trait */
const fil = (d, stroke, w, o = {}) =>
	d ? `<path d="${d}"${at({ fill: 'none', stroke, 'stroke-width': w, ...o })}/>` : '';
const grop = (o, ...k) => `<g${at(o)}>${k.join('')}</g>`;
const rect = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
const degrade = (id, stops, x2 = 0, y2 = 1) =>
	`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">` +
	stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('') +
	'</linearGradient>';
const retalh = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const linhaDe = (P) => 'M' + P.map(([x, y]) => `${x} ${y}`).join('L');

// ── la matière ──

/**
 * des touches dans une ellipse, de haut en bas : {x, y, r, a}, a étant l'angle
 * du coup de pinceau (au hasard ; ou a0 ± aj/2 si aj est donné : des touches
 * couchées pour un nuage, debout pour un cyprès)
 */
function touffa(seed, cx, cy, rx, ry, n, rmin, rmax, aj, a0 = 0) {
	const a = azard(seed);
	const L = [];
	for (let i = 0; i < n; i++) {
		const t = a() * Math.PI * 2;
		const d = Math.sqrt(a());
		const r = rmin + a() * (rmax - rmin);
		const ang = aj === undefined ? a() * Math.PI : a0 + (a() - 0.5) * aj;
		L.push({ x: cx + Math.cos(t) * rx * d, y: cy + Math.sin(t) * ry * d, r, a: ang, v: a() });
	}
	return L.sort((p, q) => p.y - q.y);
}

/** de courts traits à bouts ronds {x, y, r, ux, uy}, rangés en trois grosseurs */
function tocs(T, color, o) {
	if (!T.length) return '';
	let min = Infinity;
	let max = -Infinity;
	for (const t of T) {
		if (t.r < min) min = t.r;
		if (t.r > max) max = t.r;
	}
	const e = (max - min) / 3;
	const D = ['', '', ''];
	for (const t of T) {
		const b = e ? Math.min(2, Math.floor((t.r - min) / e)) : 0;
		D[b] += `M${r1(t.x)} ${r1(t.y)}l${r1(t.ux)} ${r1(t.uy)}`;
	}
	return D.map((d, b) => fil(d, color, r1(2 * (min + (b + 0.5) * e)), o)).join('');
}

/**
 * des coups de pinceau sur des touches : décalés de (dx, dy) rayons, réduits
 * de k, une touche sur pas, allongés de al rayons
 */
function pincel(L, color, { dx = 0, dy = 0, k = 1, pas = 1, al = 0.7 } = {}, o) {
	const T = [];
	for (let i = 0; i < L.length; i += pas) {
		const p = L[i];
		const l = p.r * k * al;
		const ux = Math.cos(p.a) * l;
		const uy = Math.sin(p.a) * l;
		T.push({ x: p.x + dx * p.r - ux / 2, y: p.y + dy * p.r - uy / 2, r: p.r * k, ux, uy });
	}
	return tocs(T, color, o);
}

/**
 * des touches déplacées chacune à sa façon (sans motif qui se répète), un peu
 * vers (dx, dy) rayons et jusqu'à j rayons au hasard
 */
const bolegar = (L, dx, dy, j) =>
	L.map((p) => ({
		...p,
		x: p.x + (Math.cos(p.a * 2) * p.v * j + dx) * p.r,
		y: p.y + (Math.sin(p.a * 2) * p.v * j + dy) * p.r
	}));
/**
 * une frondaison modelée comme un volume éclairé d'en haut à gauche : la masse
 * sombre d'abord, puis les tons moyens, la lumière et quelques éclats, de plus
 * en plus serrés vers le côté du soleil (pas une bulle par touche)
 */
function fuelha(L, C) {
	let x0 = Infinity;
	let x1 = -Infinity;
	let y0 = Infinity;
	let y1 = -Infinity;
	for (const p of L) {
		x0 = Math.min(x0, p.x);
		x1 = Math.max(x1, p.x);
		y0 = Math.min(y0, p.y);
		y1 = Math.max(y1, p.y);
	}
	const cx = (x0 + x1) / 2;
	const cy = (y0 + y1) / 2;
	const hx = (x1 - x0) / 2 || 1;
	const hy = (y1 - y0) / 2 || 1;
	// de -1 (au soleil) à 1 (à l'ombre), un peu brouillé
	const sol = (p) => ((p.x - cx) / hx + (p.y - cy) / hy) / 2 + (p.v - 0.5) * 0.4;
	return (
		pincel(L, C[0], { dx: 0.14, dy: 0.2 }) +
		pincel(bolegar(L.filter((p) => sol(p) < 0.35), -0.05, -0.08, 0.5), C[1], { k: 0.9 }) +
		pincel(bolegar(L.filter((p) => sol(p) < -0.1), -0.1, -0.14, 0.8), C[2], { k: 0.55, al: 1.1 }) +
		(C[3] ? pincel(bolegar(L.filter((p) => sol(p) < -0.45), -0.12, -0.16, 0.9), C[3], { k: 0.3, al: 1.3 }) : '')
	);
}
/** un bois vu de loin : chaque arbre a son ombre et, parfois, un peu de lumière */
const selva = (L, C) =>
	pincel(L, C[0], { dx: 0.3, dy: 0.4 }) +
	pincel(L, C[1], { k: 0.9 }) +
	pincel(L, C[2], { dx: -0.28, dy: -0.34, k: 0.45, pas: 3 });
/** un nuage : des touches couchées, l'ombre en dessous */
const nivol = (L, ombra, blanc) =>
	pincel(L, ombra, { dy: 0.26, k: 1.05, al: 2.5 }, { opacity: 0.5 }) + pincel(L, blanc, { dy: -0.1, k: 0.8, al: 2.7 }, { opacity: 0.9 });

/** des galets ou des pierres, plus gros vers le bas (la perspective) : {x, y, rx, ry} */
function galets(seed, x0, x1, y0, y1, n, rmin, rmax) {
	const a = azard(seed);
	const L = [];
	for (let i = 0; i < n; i++) {
		const t = a();
		const s = rmin + (rmax - rmin) * t * (0.6 + a() * 0.8);
		L.push({
			x: x0 + a() * (x1 - x0),
			y: y0 + (y1 - y0) * t,
			rx: s * (1.15 + a() * 0.6),
			ry: s * (0.6 + a() * 0.25)
		});
	}
	return L.sort((p, q) => p.y - q.y);
}
/** des galets en traits couchés à bouts ronds ; décalés de (dx, dy), réduits de k */
function codols(L, color, { dx = 0, dy = 0, k = 1 } = {}, o) {
	return tocs(
		L.map((p) => {
			const h = Math.max(0, (p.rx - p.ry) * 2 * k);
			return { x: p.x + dx * p.rx - h / 2, y: p.y + dy * p.ry, r: p.ry * k, ux: h, uy: 0 };
		}),
		color,
		o
	);
}
/**
 * des pierres aux contours irréguliers (six côtés tirés au hasard), en
 * plusieurs tons, et leur face éclairée pour une partie d'entre elles
 */
function lauzas(L, tons, lum, seed, o) {
	const a = azard(seed);
	const D = tons.map(() => '');
	let E = '';
	for (const p of L) {
		const t0 = a() * Math.PI;
		let d = '';
		let e = '';
		for (let i = 0; i < 6; i++) {
			const t = t0 + (i / 6) * Math.PI * 2 + (a() - 0.5) * 0.5;
			const f = 0.82 + a() * 0.24;
			const x = p.x + Math.cos(t) * p.rx * f;
			const y = p.y + Math.sin(t) * p.ry * f;
			d += `${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`;
			e += `${i ? 'L' : 'M'}${r1(p.x - p.rx * 0.16 + (x - p.x) * 0.55)} ${r1(p.y - p.ry * 0.28 + (y - p.y) * 0.5)}`;
		}
		D[Math.floor(a() * tons.length)] += d + 'Z';
		if (lum && a() < 0.6) E += e + 'Z';
	}
	return D.map((d, i) => ple(d, tons[i], o)).join('') + (lum ? ple(E, lum, o) : '');
}
/** des galets ronds : l'ombre portée, plusieurs tons, un reflet sur un sur trois */
const graveta = (L, [ombra, ...tons], lum) =>
	codols(L, ombra, { dx: 0.12, dy: 0.5 }) +
	tons.map((c, i) => codols(L.filter((_, j) => j % tons.length === i), c)).join('') +
	(lum ? codols(L.filter((_, j) => j % 3 === 0), lum, { dx: -0.2, dy: -0.3, k: 0.45 }) : '');

/** de petits traits couchés (les rides de l'eau), plus serrés et plus courts au loin */
function rides(seed, x0, x1, y0, y1, n, lmin, lmax, gamma = 1.7) {
	const a = azard(seed);
	let d = '';
	for (let i = 0; i < n; i++) {
		const t = Math.pow(a(), gamma);
		const l = (lmin + a() * (lmax - lmin)) * (0.45 + 0.55 * t);
		d += `M${r1(x0 + a() * (x1 - x0 - l))} ${r1(y0 + (y1 - y0) * t)}h${r1(l)}`;
	}
	return d;
}

/** des traits dans un cadre (strates, fissures) ; angle en degrés, à ± jeu */
function traits(seed, x0, x1, y0, y1, n, lmin, lmax, ang, jeu = 8) {
	const a = azard(seed);
	let d = '';
	for (let i = 0; i < n; i++) {
		const l = lmin + a() * (lmax - lmin);
		const g = ((ang + (a() - 0.5) * 2 * jeu) * Math.PI) / 180;
		d += `M${r1(x0 + a() * (x1 - x0))} ${r1(y0 + a() * (y1 - y0))}l${r1(Math.cos(g) * l)} ${r1(Math.sin(g) * l)}`;
	}
	return d;
}

/** des traits le long d'un tronc (l'écorce) : pts = [[x, y, largeur], …] */
function escorsa(seed, pts, n, lmin, lmax) {
	const a = azard(seed);
	let d = '';
	for (let i = 0; i < n; i++) {
		const k = Math.floor(a() * (pts.length - 1));
		const t = a();
		const [x0, y0, w0] = pts[k];
		const [x1, y1, w1] = pts[k + 1];
		const dx = x1 - x0;
		const dy = y1 - y0;
		const long = Math.hypot(dx, dy) || 1;
		const ux = dx / long;
		const uy = dy / long;
		const o = (a() - 0.5) * (w0 + (w1 - w0) * t) * 0.75;
		const l = lmin + a() * (lmax - lmin);
		d += `M${r1(x0 + dx * t - uy * o)} ${r1(y0 + dy * t + ux * o)}l${r1(ux * l)} ${r1(uy * l)}`;
	}
	return d;
}

/** une rangée d'immeubles posés sur y : les murs, le bord des toits, les fenêtres */
function vila(seed, x0, x1, y, hmin, hmax, wmin, wmax, fenestras = false) {
	const a = azard(seed);
	let d = '';
	let t = '';
	let f = '';
	let x = x0;
	while (x < x1) {
		const w = wmin + a() * (wmax - wmin);
		const h = hmin + a() * (hmax - hmin);
		d += `M${r1(x)} ${y}v${r1(-h)}h${r1(w)}v${r1(h)}z`;
		t += `M${r1(x + 0.6)} ${r1(y - h + 0.5)}h${r1(w - 1.2)}`;
		if (fenestras)
			for (let fy = y - h + 3.4; fy < y - 4; fy += 5)
				for (let fx = x + 2.4; fx < x + w - 2; fx += 4) f += `M${r1(fx)} ${r1(fy)}v1.8`;
		x += w + (a() < 0.2 ? 2 : 0);
	}
	return { d, t, f };
}

/** un cyprès : le fuseau, son côté éclairé, le grain de son feuillage */
function cipres(seed, cx, top, bot, w, C) {
	const h = bot - top;
	const d =
		`M${cx} ${top}C${r1(cx + w * 0.62)} ${r1(top + h * 0.28)} ${r1(cx + w * 0.62)} ${r1(bot - h * 0.22)} ${r1(cx + w * 0.42)} ${bot}` +
		`H${r1(cx - w * 0.42)}C${r1(cx - w * 0.62)} ${r1(bot - h * 0.22)} ${r1(cx - w * 0.62)} ${r1(top + h * 0.28)} ${cx} ${top}Z`;
	const lum =
		`M${cx} ${top + 2}C${r1(cx - w * 0.22)} ${r1(top + h * 0.3)} ${r1(cx - w * 0.52)} ${r1(bot - h * 0.3)} ${r1(cx - w * 0.36)} ${bot - 1}` +
		`H${r1(cx - w * 0.06)}C${r1(cx - w * 0.16)} ${r1(bot - h * 0.3)} ${r1(cx - w * 0.06)} ${r1(top + h * 0.3)} ${cx} ${top + 2}Z`;
	const gran = touffa(seed, cx, top + h * 0.55, w * 0.3, h * 0.38, Math.round(h / 4), 0.8, 1.6, 0.6, Math.PI / 2);
	return ple(d, C[0]) + ple(lum, C[1]) + pincel(gran, C[2], { al: 1.4 });
}

// ── la Garonne au Bazacle (Toulouse) : la chaussée en biais, les quais de brique ──
function garona(u) {
	const a = azard(7);
	let raia = '';
	let esquit = '';
	const espuma = [];
	for (let x = -2; x < 402; x += 2 + a() * 1.8) {
		const y = 186 + (x / 400) * 20;
		raia += `M${r1(x)} ${r1(y + 0.6)}v${r1(4 + a() * 9)}`;
		if (a() < 0.3) esquit += `M${r1(x)} ${r1(y + 11 + a() * 12)}h0`;
		if (a() < 0.55) espuma.push({ x, y: y + 9 + a() * 6, r: 1.4 + a() * 2.2, a: (a() - 0.5) * 0.6, v: a() });
	}
	// le bas du seuil, brisé
	let banda = 'M0 186L400 206';
	for (let x = 400; x >= 0; x -= 10) banda += `L${x} ${r1(194 + (x / 400) * 20 + (a() - 0.5) * 4)}`;
	banda += 'Z';
	let arcadas = '';
	for (let i = 0; i < 27; i++) if (i % 7 !== 3) arcadas += `M${4 + i * 15} 178v-6a3.5 3.5 0 0 1 7 0v6z`;
	let colonas = '';
	for (let x = 306; x < 331; x += 3.5) colonas += `M${r1(x)} 133.5v11`;
	const arcs = (x, y, w, h) => {
		let d = '';
		const n = Math.max(2, Math.floor(w / 3.2));
		const pas = w / n;
		for (let i = 0; i < n; i++)
			d += `M${r1(x + i * pas + pas / 2 - 0.8)} ${r1(y + h - 1)}v-2.6a0.8 0.8 0 0 1 1.6 0v2.6z`;
		return d;
	};
	let cirrus = '';
	[[18, 214, 62], [120, 300, 87], [230, 382, 50], [40, 168, 112], [262, 394, 106]].forEach(
		([x0, x1, y], i) => (cirrus += traits(30 + i, x0, x1 - 30, y - 5, y + 5, 9, 12, 34, -2, 2))
	);
	const lonh = vila(11, -4, 404, 160, 8, 18, 8, 20);
	const mitan = vila(12, -4, 404, 167, 10, 28, 9, 24, true);
	const PLAT = ['#3f5f27', '#5b7d35', '#86a84c', '#b2c968'];
	return [
		'<defs>',
		degrade(`cel-${u}`, [[0, '#3f7fc4'], [0.62, '#8bbbe3'], [1, '#e0edf5']]),
		degrade(`amont-${u}`, [[0, '#69a2c3'], [1, '#41809f']]),
		degrade(`aval-${u}`, [[0, '#64a0bf'], [0.45, '#3f7c9c'], [1, '#2a5a78']]),
		retalh(`amont-c-${u}`, 'M0 178H400V206L0 186Z'),
		retalh(`aval-c-${u}`, 'M0 194L400 214V300H0Z'),
		'</defs>',
		rect(0, 0, 400, 200, `url(#cel-${u})`),
		// des cirrus en fines lanières, comme sur la photo
		grop(
			{ class: 'nivols' },
			ple(
				'M18 64C70 52 150 54 214 60C150 60 80 62 18 68ZM120 88C170 80 240 80 300 86C240 86 180 88 120 92ZM230 50C270 44 330 44 382 50C330 50 280 52 230 54ZM40 112C80 106 130 106 168 110C130 110 90 112 40 116ZM262 106C302 100 352 101 394 105C352 105 302 107 262 109Z',
				'#fff',
				{ opacity: 0.62 }
			),
			fil(cirrus, '#fff', 0.9, { opacity: 0.45 })
		),
		// la ville au loin, pâle
		ple(lonh.d, '#ecccb8'),
		// le clocher à étages, à la toulousaine
		ple('M70 167V134H86V167Z', '#d27f5c'),
		ple('M81 167V134H86V167Z', '#b8664a'),
		ple('M71.5 134V126H84.5V134ZM73 126V119H83V126ZM74.5 119V113H81.5V119Z', '#d68562'),
		ple('M80.6 134V126H84.5V134ZM80 126V119H83V126ZM79.4 119V113H81.5V119Z', '#b8664a'),
		ple(arcs(70, 134, 11, 10) + arcs(71.5, 126, 9, 8) + arcs(73, 119, 7, 7) + arcs(74.5, 113, 5, 6), '#6e2f1f'),
		ple('M74.5 113H81.5L78 94Z', '#b65e3e'),
		ple('M78 94L81.5 113H78Z', '#9c4c31'),
		// le dôme de La Grave, vert-de-gris
		rect(304, 132, 28, 35, '#d98c6b'),
		rect(322, 132, 10, 35, '#c27556'),
		fil(colonas, '#f2c8ad', 0.6),
		ple('M303 132C303 113 333 113 333 132Z', '#62a99b'),
		ple('M318 117.8C326 117.8 333 121 333 132H318Z', '#468a7c'),
		fil(
			'M318 118C312 120 308 126 306 132M318 118C314 122 312 127 311 132M318 118V132M318 118C322 122 324 127 325 132M318 118C324 120 328 126 330 132',
			'#3c7569',
			0.6
		),
		rect(315.5, 110.5, 5, 7.5, '#f0e7d6'),
		ple('M315 110.8C315 107 321 107 321 110.8Z', '#62a99b'),
		// les quais : immeubles de brique, platanes
		ple(mitan.d, '#d07a57'),
		fil(mitan.t, '#a24f33', 1.4),
		fil(mitan.f, '#9c5036', 1.3),
		fuelha(touffa(13, 132, 160, 20, 8, 20, 3, 6), PLAT),
		fuelha(touffa(14, 222, 158, 24, 9, 24, 3, 6.5), PLAT),
		fuelha(touffa(15, 266, 161, 12, 7, 12, 3, 5), PLAT),
		rect(0, 167, 400, 11, '#b4553a'),
		fil(traits(9, 0, 400, 169.5, 176.5, 50, 2, 5, 0, 0), '#9a4630', 0.5),
		rect(0, 167, 400, 1.6, '#e39d7a'),
		ple(arcadas, '#5a281b'),
		// l'eau dormante en amont, les reflets de brique et du dôme
		ple('M0 178H400V206L0 186Z', `url(#amont-${u})`),
		grop(
			{ 'clip-path': `url(#amont-c-${u})` },
			fil(traits(16, 0, 300, 179, 184, 60, 2, 6, 90, 3), '#d98a63', 1.3, { opacity: 0.55 }),
			fil(traits(17, 304, 332, 179, 190, 14, 3, 8, 90, 3), '#6fb3a4', 1.3, { opacity: 0.6 }),
			fil(rides(18, -10, 410, 180, 204, 34, 6, 22), '#e6f2fc', 0.7, { opacity: 0.55 })
		),
		// l'eau vive en aval, des reflets de brique brisés
		ple('M0 194L400 214V300H0Z', `url(#aval-${u})`),
		// la chaussée : l'écume qui tombe en biais
		ple(banda, '#d5e9ea'),
		fil(raia, '#fff', 0.9),
		grop(
			{ 'clip-path': `url(#aval-c-${u})` },
			fil(traits(21, 0, 300, 208, 246, 40, 3, 9, 90, 3), '#e0a27c', 1.2, { opacity: 0.28 }),
			fil(esquit, '#fff', 1.5, { class: 'escuma', opacity: 0.75 }),
			fil(rides(19, -30, 430, 198, 300, 80, 8, 36), '#e9f3fc', 1, { class: 'ondas-a', opacity: 0.5 }),
			fil(rides(20, -30, 430, 202, 300, 64, 10, 44), '#173f57', 1.4, { class: 'ondas-b', opacity: 0.3 })
		),
		pincel(espuma, '#fff', { al: 1.4 }, { opacity: 0.9 }),
		// le cormoran sur sa pierre, les ailes ouvertes à sécher
		ple('M141 240C143 235 157 235 160 240Z', '#1d3557'),
		grop(
			{ fill: '#17191d' },
			'<ellipse cx="150" cy="231" rx="2.4" ry="5.2"/>',
			'<path d="M150.6 226.5q0.8-3 2.8-3.4q1.4 0 2.2 0.6l-2.2 0.4q-1 0.3-1.4 2.4zM149 228q-6-5-11-1q5 0 10.6 3.6zM151 228q6-5 11-1q-5 0-10.6 3.6z"/>'
		),
		// des oiseaux
		fil('M150 84q4-4 8 0q4-4 8 0M174 97q3-3 6 0q3-3 6 0', '#24303f', 1.2, { class: 'volar' })
	].join('');
}

// ── Sant Guilhèm del Desèrt : l'abbaye sous les crêtes, les cyprès, le pin ──
function vilatge(u) {
	const P = [[0, 108], [18, 98], [34, 101], [52, 86], [70, 90], [92, 70], [108, 76], [126, 64], [142, 70], [158, 58], [176, 66], [196, 56], [214, 64], [232, 58], [252, 70], [272, 64], [292, 78], [312, 72], [334, 86], [356, 80], [380, 92], [400, 88]];
	const Q = [[0, 96], [30, 84], [60, 88], [90, 62], [120, 58], [150, 50], [180, 56], [210, 44], [240, 52], [270, 46], [300, 58], [330, 54], [360, 68], [400, 62]];
	const ombras = (R, h) => {
		let d = '';
		for (let i = 0; i < R.length - 1; i++) {
			const [x, y] = R[i];
			const [x2, y2] = R[i + 1];
			if (y2 > y) d += `M${x} ${y}L${x2} ${y2}L${x2 - 4} ${y2 + h}L${x - 6} ${y + h + 4}Z`;
		}
		return d;
	};
	const cresta = linhaDe(P) + 'V182H0Z';
	const crestaLonh = linhaDe(Q) + 'V140H0Z';
	const penda = 'M0 150C40 132 80 128 120 132C160 136 200 126 240 128C290 131 340 120 400 126V212H0Z';
	const ostal = (x, y, w, h) => {
		let teulas = '';
		let fen = '';
		for (let tx = x + 1; tx < x + w; tx += 2.4) teulas += `M${r1(tx)} ${y - 6}v5`;
		for (let fy = y + 6; fy < y + h - 6; fy += 9)
			for (let fx = x + 4; fx < x + w * 0.66 - 2; fx += 7) fen += `M${r1(fx)} ${fy}v2.4`;
		return (
			rect(x, y, w, h, '#ecd8b4') +
			rect(r1(x + w * 0.72), y, r1(w * 0.28), h, '#d2b890') +
			ple(`M${x - 2} ${y}H${x + w + 2}L${x + w - 3} ${y - 7}H${x + 3}Z`, '#c4683d') +
			fil(teulas, '#8f4325', 0.5, { opacity: 0.45 }) +
			fil(fen, '#5b4333', 2)
		);
	};
	let lombardas = '';
	for (let x = 117; x < 141; x += 3.4) lombardas += `M${r1(x)} 127a1.6 1.6 0 0 1 3.2 0`;
	let teulasGleisa = '';
	for (let x = 143; x < 199; x += 2.4) teulasGleisa += `M${r1(x)} 106v7.4`;
	const CIP = ['#2c5631', '#4a7c45', '#1f4326'];
	const BOSC = ['#364b2b', '#58703f', '#879a5c', '#b8c088'];
	const PIN = ['#15301b', '#24472a', '#3e6a3a', '#6f9a4e'];
	const bosc = [
		touffa(36, 40, 284, 56, 30, 40, 3.5, 7),
		touffa(35, 112, 214, 44, 12, 24, 3, 5.5),
		touffa(31, 170, 258, 80, 32, 58, 3.5, 7),
		touffa(32, 300, 238, 70, 24, 50, 3.5, 7),
		touffa(33, 378, 264, 46, 36, 40, 3.5, 7),
		touffa(34, 240, 296, 110, 22, 52, 4, 7.5)
	];
	const pin = [
		touffa(41, 46, 54, 36, 8, 26, 2.6, 6),
		touffa(42, 90, 92, 28, 7, 20, 2.6, 5.5),
		touffa(43, 32, 112, 28, 8, 20, 2.6, 6),
		touffa(44, 76, 146, 20, 6, 14, 2.6, 5),
		touffa(45, 34, 180, 24, 7, 16, 2.6, 5.5)
	];
	return [
		'<defs>',
		degrade(`cel-${u}`, [[0, '#3c84d6'], [1, '#c2e1f6']]),
		degrade(`absida-${u}`, [[0, '#f3e2c4'], [1, '#d3b98f']], 1, 0),
		retalh(`cresta-c-${u}`, cresta),
		retalh(`lonh-c-${u}`, crestaLonh),
		retalh(`penda-c-${u}`, penda),
		'</defs>',
		rect(0, 0, 400, 300, `url(#cel-${u})`),
		// des nuages qui passent derrière les crêtes
		grop(
			{ class: 'nivols' },
			nivol(touffa(26, 300, 50, 64, 7, 22, 4, 8, 0.3), '#d9e6f1', '#fff'),
			nivol(touffa(27, 120, 44, 50, 6, 16, 3.5, 7, 0.3), '#d9e6f1', '#fff')
		),
		// les crêtes du fond, bleutées
		ple(crestaLonh, '#c4cbd4'),
		ple(ombras(Q, 22), '#aeb6c1', { opacity: 0.7 }),
		fil(traits(28, 0, 400, 44, 120, 50, 3, 9, 10, 10), '#9aa3ae', 0.5, { opacity: 0.5, 'clip-path': `url(#lonh-c-${u})` }),
		fil(linhaDe(Q), '#e8edf2', 0.9, { opacity: 0.8 }),
		// les crêtes de calcaire, leurs faces à l'ombre, la garrigue
		ple(cresta, '#d6d2c9'),
		ple(ombras(P, 30), '#ada797', { opacity: 0.75 }),
		grop(
			{ 'clip-path': `url(#cresta-c-${u})` },
			fil(traits(21, 0, 400, 56, 150, 110, 3, 10, 12, 10), '#8d8472', 0.6, { opacity: 0.5 }),
			pincel(touffa(22, 200, 134, 220, 24, 90, 1.1, 2.8), '#8e9b60', { al: 0.5 })
		),
		fil(linhaDe(P), '#f4f1ea', 1, { opacity: 0.85 }),
		// la pente boisée sous le village
		ple(penda, '#879a57'),
		grop(
			{ 'clip-path': `url(#penda-c-${u})` },
			selva(touffa(23, 200, 154, 220, 18, 64, 1.4, 3.4), ['#6f8848', '#7a934e', '#9aae64'])
		),
		// la maison de gauche
		ostal(92, 128, 24, 22),
		// l'abbaye : la nef, le chevet aux bandes lombardes, le clocher carré
		rect(142, 114, 56, 34, '#ecd9b8'),
		rect(184, 114, 14, 34, '#d4bb94'),
		ple('M140 114H200L194 105H146Z', '#c3683d'),
		fil(teulasGleisa, '#8f4325', 0.5, { opacity: 0.45 }),
		rect(150, 128, 40, 20, '#e6cfa9'),
		fil('M157 134v4M167 134v4M177 134v4', '#5b4333', 2.2),
		ple('M116 148V125Q129 118 142 125V148Z', `url(#absida-${u})`),
		ple('M114 125Q129 108 144 123Z', '#b65f37'),
		fil(lombardas, '#b39874', 0.6),
		ple('M128 142v-7a1.5 1.5 0 0 1 3 0v7z', '#6b5240'),
		rect(198, 82, 18, 66, '#ead6b3'),
		rect(210, 82, 6, 66, '#cfb690'),
		ple('M196 82H218L207 72Z', '#b0582f'),
		ple('M207 72L218 82H207Z', '#94482a'),
		fil('M198 100H216M198 116H216', '#c6ab84', 0.7),
		ple(
			'M201 97v-6a1.6 1.6 0 0 1 3.2 0v6zM208.8 97v-6a1.6 1.6 0 0 1 3.2 0v6zM201 112v-6a1.6 1.6 0 0 1 3.2 0v6zM208.8 112v-6a1.6 1.6 0 0 1 3.2 0v6z',
			'#5e4535'
		),
		// les maisons de droite, serrées contre la pente
		ostal(226, 120, 26, 30),
		ostal(250, 112, 30, 38),
		ostal(278, 122, 22, 28),
		ostal(298, 108, 34, 42),
		ostal(330, 118, 24, 32),
		ostal(352, 126, 30, 26),
		// les murs des terrasses, en pierre sèche
		rect(60, 150, 340, 11, '#9a8e78'),
		lauzas(galets(24, 60, 400, 151.5, 159.5, 64, 1.8, 2.6), ['#e3d9c5', '#d6cab3', '#ece4d4'], null, 124),
		rect(150, 174, 250, 8, '#948871'),
		lauzas(galets(25, 150, 400, 175, 181, 44, 1.6, 2.3), ['#ddd2bd', '#cfc3ab', '#e7decd'], null, 125),
		// des oliviers dans le pré
		fil('M150 202v-8M262 200v-8M332 204v-8', '#5a4632', 1.4),
		...[touffa(37, 150, 191, 11, 6, 12, 2.4, 4), touffa(38, 262, 189, 12, 6, 12, 2.4, 4), touffa(39, 332, 193, 10, 6, 10, 2.4, 3.8)].map((L) =>
			fuelha(L, ['#55633f', '#7d8a5c', '#a9b38a', '#cfd5b4'])
		),
		// les cyprès
		...[[112, 100, 152, 8], [224, 70, 168, 13], [343, 98, 154, 9]].map(([x, t, b, w], i) =>
			grop({ class: 'balanc', style: `animation-delay:${-i * 1.7}s` }, cipres(50 + i, x, t, b, w, CIP))
		),
		// la végétation du premier plan
		ple('M0 206C60 200 120 208 200 204C280 200 340 208 400 204V300H0Z', '#4f6a3a'),
		...bosc.map((L, i) => grop({ class: i % 2 ? 'ventolet' : '' }, fuelha(L, BOSC))),
		// le grand pin de gauche
		ple('M34 300C38 250 36 210 44 170C52 130 64 100 60 70C58 56 62 44 68 34L72 36C66 46 64 58 66 72C70 102 58 132 50 172C42 212 46 252 44 300Z', '#4a3426'),
		fil(escorsa(46, [[39, 300, 10], [41, 250, 9], [47, 170, 7], [58, 110, 6], [63, 72, 5], [70, 35, 4]], 40, 2, 5), '#6e5442', 0.7),
		fil('M56 120Q72 104 88 94M50 158Q62 150 76 148M46 196Q38 188 30 182M62 82Q52 70 44 60', '#4a3426', 1.4),
		grop({ class: 'ventolet' }, ...pin.map((L) => fuelha(L, PIN))),
		// des oiseaux
		fil('M152 44q3-3 6 0q3-3 6 0M172 54q2.5-2.5 5 0q2.5-2.5 5 0M140 58q2.5-2.5 5 0q2.5-2.5 5 0', '#28323f', 1.1, { class: 'volar' })
	].join('');
}

// ── les gorges d'Erau : la falaise, la dent de roche, l'eau claire sur les galets ──
function riu(u) {
	const falesa = 'M0 0H58L64 22L60 50L70 80L66 112L78 146L84 178L92 206L0 214Z';
	const dent = 'M134 186C138 172 142 160 144 148C146 138 150 132 152 124C154 114 156 106 160 102C163 99 167 99 170 103C173 108 174 116 178 122C182 128 188 134 190 142C193 152 198 166 206 186Z';
	const lonh = 'M84 160L120 142L150 136L182 140L214 124L250 116L284 104L320 96L352 82L380 74L400 70';
	const pendaLonh = 'M178 200L214 172L252 156L292 136L330 118L366 102L400 92V230H178Z';
	const pendaProcha = 'M214 206L250 192L290 180L330 168L368 158L400 152V226C380 222 352 216 318 210C290 205 262 202 236 204L214 206Z';
	const graviera = 'M0 214L92 206L236 204C238 214 246 226 236 238C216 262 196 280 172 300H0Z';
	const aiga = 'M236 204C262 202 290 205 318 210C352 216 380 222 400 226V300H172C196 280 216 262 236 238C246 226 238 214 236 204Z';
	const rocs = [
		{ x: 262, y: 236, rx: 9, ry: 3.6 },
		{ x: 300, y: 265, rx: 13, ry: 5 },
		{ x: 236, y: 276, rx: 10, ry: 4.4 },
		{ x: 352, y: 246, rx: 7, ry: 3 }
	];
	const BOSC = ['#30502a', '#4d7438', '#7c9e52', '#adc479'];
	return [
		'<defs>',
		degrade(`cel-${u}`, [[0, '#84bce6'], [1, '#eaf4fb']]),
		degrade(`aiga-${u}`, [[0, '#c5e3ec'], [0.45, '#7cbfb8'], [1, '#5a9c8b']]),
		retalh(`falesa-c-${u}`, falesa),
		retalh(`dent-c-${u}`, dent),
		retalh(`lonh-c-${u}`, pendaLonh),
		retalh(`procha-c-${u}`, pendaProcha),
		retalh(`graviera-c-${u}`, graviera),
		retalh(`aiga-c-${u}`, aiga),
		'</defs>',
		rect(0, 0, 400, 300, `url(#cel-${u})`),
		// un nuage léger
		grop({ class: 'nivols' }, nivol(touffa(68, 250, 40, 56, 6, 18, 3.5, 7, 0.3), '#dbe8f2', '#fff')),
		// le lointain dans la brume, la dent de roche
		ple(lonh + 'V220H84Z', '#a7beb2'),
		fil(lonh, '#d3dfd8', 1.2),
		ple(dent, '#d0c8b7'),
		ple('M170 103C173 108 174 116 178 122C182 128 188 134 190 142C193 152 198 166 206 186H180C176 168 174 150 172 132C171 120 171 110 170 103Z', '#9f978a'),
		fil(traits(58, 138, 204, 104, 186, 44, 3, 8, 20, 12), '#857d70', 0.7, { opacity: 0.55, 'clip-path': `url(#dent-c-${u})` }),
		fuelha(touffa(69, 149, 137, 5, 2, 6, 1.4, 2.4), ['#3f5f30', '#5f8048', '#86a862']),
		fuelha(touffa(70, 186, 150, 7, 2.5, 7, 1.4, 2.6), ['#3f5f30', '#5f8048', '#86a862']),
		// les pentes boisées de droite
		ple(pendaLonh, '#6e9963'),
		grop(
			{ 'clip-path': `url(#lonh-c-${u})` },
			selva(touffa(59, 300, 152, 110, 44, 100, 1.6, 3.8), ['#5a8350', '#6a965e', '#83ad72'])
		),
		ple('M318 121l6-5 5 2 3 6zM346 106l5-6 6 3 2 5zM372 96l4-4 5 2 1 4z', '#d6d0c1'),
		ple(pendaProcha, '#4c7c43'),
		grop(
			{ 'clip-path': `url(#procha-c-${u})` },
			selva(touffa(60, 310, 190, 100, 26, 70, 2.4, 5.2), ['#3a6534', '#4a7b41', '#6a9a50'])
		),
		// la grande falaise : fissures, strates, touffes sur les corniches
		ple(falesa, '#c4bcad'),
		ple('M58 0L64 22L60 50L70 80L66 112L78 146L84 178L92 206L70 208L64 176L56 144L52 110L48 78L50 48L46 20L44 0Z', '#9b9487'),
		grop(
			{ 'clip-path': `url(#falesa-c-${u})` },
			fil(traits(53, 0, 92, 0, 210, 60, 6, 20, 92, 6), '#6e685e', 0.8, { opacity: 0.55 }),
			fil(traits(54, 0, 92, 0, 210, 30, 10, 30, -4, 5), '#f2eee6', 0.7, { opacity: 0.35 })
		),
		...[touffa(55, 38, 72, 14, 4, 10, 1.5, 3.2), touffa(56, 30, 140, 18, 5, 12, 1.5, 3.5), touffa(57, 62, 186, 20, 6, 14, 2, 4)].map(
			(L) => fuelha(L, ['#3f5f30', '#5f8048', '#86a862'])
		),
		// la grève de galets
		ple(graviera, '#d5cbb7'),
		grop(
			{ 'clip-path': `url(#graviera-c-${u})` },
			graveta(galets(52, 70, 250, 206, 300, 110, 0.8, 5.4), ['#a99f8a', '#ece5d7', '#e0d7c5', '#f4efe6'], '#fbf8f2')
		),
		// la rivière : claire sur les galets, des reflets qui scintillent
		ple(aiga, `url(#aiga-${u})`),
		grop(
			{ 'clip-path': `url(#aiga-c-${u})` },
			ple('M236 204C238 214 246 226 236 238C216 262 196 280 172 300H210C226 282 244 262 252 244C260 228 254 212 246 205Z', '#a3b27a', { opacity: 0.55 }),
			codols(galets(64, 190, 340, 232, 300, 40, 1.2, 4), '#a9d3c6', {}, { opacity: 0.45 }),
			fil(rides(65, 240, 400, 205, 224, 26, 8, 26, 1), '#3f6f45', 1.4, { opacity: 0.3 }),
			fil(rides(61, 200, 410, 208, 300, 46, 6, 30), '#f4fbfc', 0.8, { class: 'ondas-a', opacity: 0.6 }),
			fil(rides(62, 250, 400, 212, 298, 20, 1, 5, 1.4), '#fff', 1, { class: 'lusor-a' }),
			fil(rides(63, 250, 400, 212, 298, 20, 1, 5, 1.4), '#fff', 1, { class: 'lusor-b' })
		),
		codols(rocs, '#6f8a80', { dx: 0.1, dy: 0.45 }),
		lauzas(rocs, ['#e4ded1', '#d9d2c3'], '#f6f3ec', 126),
		// le héron sur son rocher
		fil('M299 261l-1-7.5M302 261l0.6-7.5', '#4a4f57', 0.7),
		ple('M295 254C295 249 303 247 306.5 251C305.5 255 299.5 256 295 254Z', '#8b949e'),
		fil('M304 250.5C305 246.5 302 244.5 303 241.5C304 239.5 306 239.5 307 240.5', '#8b949e', 1.6),
		fil('M307 240.5l4.4 1.2', '#d9b44a', 0.8),
		fil('M304.6 239.6l-3.2-0.9', '#2e3238', 0.5),
		// la végétation au pied de la falaise
		...[touffa(67, 122, 198, 34, 9, 20, 3, 6), touffa(64, 58, 232, 70, 24, 46, 5, 10), touffa(66, 128, 268, 40, 16, 24, 4, 8), touffa(65, 36, 282, 64, 28, 42, 5, 11)].map(
			(L, i) => grop({ class: i % 2 ? '' : 'ventolet' }, fuelha(L, BOSC))
		),
		fil('M160 70q4-3.5 8 0q4-3.5 8 0', '#3a4552', 1.1, { class: 'volar' })
	].join('');
}

// ── la plaine vue entre deux chênes : champs et vignes jusqu'à la mer, le mur de pierre ──
function plana(u) {
	const a = azard(81);
	const COLORS = ['#a9bb6f', '#cdb46b', '#97b162', '#c49b63', '#b9c57e', '#dac68a', '#8aa65a', '#bca266'];
	const parts = COLORS.map(() => '');
	let bartas = '';
	let vinhas = '';
	const arbres = [];
	const Y0 = 150;
	const H = 112;
	const N = 9;
	const s = (y) => 0.22 + 1.05 * ((y - Y0) / H);
	const X = (x, y) => 200 + (x - 200) * s(y);
	for (let k = 0; k < N; k++) {
		const y0 = Y0 + H * Math.pow(k / N, 1.65);
		const y1 = Y0 + H * Math.pow((k + 1) / N, 1.65);
		const j = (y1 - y0) * 0.2;
		let x = -1300 + a() * 40;
		while (x < 1700) {
			const w = 24 + a() * 106;
			const c = Math.floor(a() * COLORS.length);
			const c2 = Math.floor(a() * COLORS.length);
			const copat = k >= 2 && a() < 0.22;
			const haia = a() < 0.4;
			const haiaBas = a() < 0.35;
			const arbre = a() < 0.3;
			const vinha = k >= 4 && a() < 0.3;
			const ra = a();
			const ja = [a(), a(), a(), a()].map((v) => (v - 0.5) * 2 * j);
			const xa0 = X(x, y0);
			const xb0 = X(x + w, y0);
			const xa1 = X(x, y1);
			const xb1 = X(x + w, y1);
			if (Math.max(xb0, xb1) > -2 && Math.min(xa0, xa1) < 402) {
				// les coins un peu bougés : des champs qui ne sont pas des cases
				const A = [r1(xa0), r1(y0 + ja[0])];
				const B = [r1(xb0), r1(y0 + ja[1])];
				const C = [r1(xb1), r1(y1 + ja[2])];
				const E = [r1(xa1), r1(y1 + ja[3])];
				if (copat) {
					parts[c] += `M${A}L${B}L${C}Z`;
					parts[c2] += `M${A}L${C}L${E}Z`;
				} else parts[c] += `M${A}L${B}L${C}L${E}Z`;
				if (haia) bartas += `M${B}L${C}`;
				if (haiaBas) bartas += `M${E}L${C}`;
				if (arbre) arbres.push({ x: B[0], y: B[1] - 0.4, r: 0.55 + 0.8 * s(y0) * (0.6 + ra * 0.6), ux: 0, uy: 0 });
				if (vinha)
					for (let f = 1; f < 7; f++)
						vinhas += `M${r1(A[0] + ((B[0] - A[0]) * f) / 7)} ${r1(A[1] + ((B[1] - A[1]) * f) / 7 + 0.6)}L${r1(E[0] + ((C[0] - E[0]) * f) / 7)} ${r1(E[1] + ((C[1] - E[1]) * f) / 7 - 0.6)}`;
			}
			x += w;
		}
	}
	const mur = 'M-2 198C60 202 130 214 200 234L238 300H-2Z';
	const ponton = 'M190 300L236 257L400 247V300Z';
	let pos = '';
	for (let i = 1; i < 10; i++) {
		const xt = 236 + i * 18.2;
		pos += `M${190 + i * 23} 300L${r1(xt)} ${r1(257 - ((xt - 236) / 164) * 10)}`;
	}
	const aplatir = (L) => L.map((p) => ({ ...p, ry: p.ry * 0.5 }));
	const CIMA = ['#16261a', '#284326', '#436835', '#6f9447'];
	const cima = [
		touffa(83, 40, 18, 70, 30, 60, 4, 10),
		touffa(84, 150, 8, 80, 22, 54, 4, 10),
		touffa(85, 268, 14, 72, 26, 54, 4, 10),
		touffa(86, 372, 30, 58, 34, 50, 4, 10),
		touffa(87, 92, 58, 40, 14, 24, 3, 8),
		touffa(88, 330, 74, 30, 14, 18, 3, 7),
		touffa(89, 398, 96, 22, 30, 18, 3, 7)
	];
	const ESQUERRA = [[6, 300, 12], [20, 251, 10], [39, 191, 9], [58, 132, 8], [70, 98, 7], [80, 67, 6], [91, 31, 6]];
	const DRECHA = [[361, 300, 10], [363, 240, 9], [365, 171, 8], [362, 111, 8], [361, 81, 8], [363, 51, 7], [369, 21, 6]];
	return [
		'<defs>',
		degrade(`cel-${u}`, [[0, '#76aee0'], [1, '#f1f1e8']]),
		`<clipPath id="nivol-c-${u}"><rect width="400" height="149"/></clipPath>`,
		`<clipPath id="plana-c-${u}"><rect y="150" width="400" height="150"/></clipPath>`,
		retalh(`mur-c-${u}`, mur),
		retalh(`ponton-c-${u}`, ponton),
		degrade(`ponton-g-${u}`, [[0, '#b8915f'], [1, '#8f6c48']]),
		retalh(`sol-c-${u}`, mur + ponton),
		'</defs>',
		rect(0, 0, 400, 300, `url(#cel-${u})`),
		// les nuages posés sur l'horizon
		grop(
			{ 'clip-path': `url(#nivol-c-${u})` },
			grop(
				{ class: 'nivols' },
				...[touffa(71, 60, 138, 50, 9, 22, 4, 9, 0.35), touffa(72, 170, 132, 60, 10, 26, 4, 10, 0.35), touffa(73, 290, 136, 55, 9, 24, 4, 9, 0.35), touffa(74, 382, 140, 40, 8, 16, 4, 8, 0.35)].map(
					(L) => nivol(L, '#c9d5e1', '#fff') + pincel(L, '#fffdf6', { dx: -0.3, dy: -0.3, k: 0.5, pas: 2, al: 1.6 })
				)
			)
		),
		rect(0, 146, 400, 6, '#b5c8d4'),
		rect(190, 147, 210, 1.8, '#97b8d2'),
		// la plaine jusqu'à l'horizon : champs, vignes, haies, arbres, un chemin
		grop(
			{ 'clip-path': `url(#plana-c-${u})` },
			rect(0, 150, 400, 150, '#a9bb6f'),
			...parts.map((d, i) => ple(d, COLORS[i])),
			fil(vinhas, '#5d7436', 0.7, { opacity: 0.6 }),
			fil(bartas, '#6b7d47', 0.6, { opacity: 0.7 }),
			tocs(arbres, '#566b39'),
			fil('M128 262C150 230 190 196 222 160', '#d6c59d', 0.9, { opacity: 0.85 })
		),
		// un village sur l'horizon
		ple('M214 157h6v-3.5h-6zM221 157h5v-4.5h-5zM227 157h7v-3h-7zM234.5 157h4v-4h-4z', '#efe4d2'),
		ple('M214 153.5h6v-1h-6zM221 152.5h5v-1h-5zM227 154h7v-1h-7zM234.5 153h4v-1h-4z', '#c27a52'),
		ple('M230 154v-7l1-2 1 2v7z', '#e8dcc6'),
		// le mur de pierre sèche et le ponton
		ple(mur, '#7a6f5f'),
		grop(
			{ 'clip-path': `url(#mur-c-${u})` },
			lauzas(galets(82, -10, 250, 198, 300, 110, 3.5, 11), ['#b9ad96', '#ab9f88', '#c4b9a3'], '#d3c9b5', 127)
		),
		ple(ponton, `url(#ponton-g-${u})`),
		fil(traits(130, 196, 400, 248, 300, 46, 4, 12, -68, 14), '#7a5c3e', 0.6, { opacity: 0.5, 'clip-path': `url(#ponton-c-${u})` }),
		fil(traits(131, 196, 400, 248, 300, 22, 3, 9, -68, 14), '#d0a978', 0.7, { opacity: 0.45, 'clip-path': `url(#ponton-c-${u})` }),
		fil(pos, '#6f553a', 0.9, { 'clip-path': `url(#ponton-c-${u})` }),
		fil('M236 257L400 247', '#caa477', 1.6),
		// les taches de lumière sous les chênes
		grop(
			{ 'clip-path': `url(#sol-c-${u})` },
			lauzas(aplatir(galets(184, 0, 400, 212, 300, 26, 3, 9)), ['#fff4cf'], null, 128, { class: 'lums', opacity: 0.5 }),
			lauzas(aplatir(galets(185, 0, 400, 210, 300, 22, 3, 8)), ['#1c2414'], null, 129, { class: 'sornas', opacity: 0.22 })
		),
		// les deux chênes qui encadrent la vue
		ple('M0 300C14 250 32 190 54 130C66 96 76 66 88 30L94 31C84 68 74 100 62 134C42 192 24 252 12 300Z', '#2e231b'),
		ple('M356 300C359 240 362 170 358 110C356 80 360 50 366 20L372 21C366 52 364 82 366 112C370 172 368 240 366 300Z', '#2b2119'),
		fil(escorsa(90, ESQUERRA, 36, 3, 7) + escorsa(91, DRECHA, 30, 3, 7), '#4a3b2e', 0.7),
		fil('M2 300C16 250 35 190 57 130C67 98 77 68 89 32M357 296C360 240 363 170 359 110C357 80 361 50 367 24', '#6b5845', 1, { opacity: 0.8 }),
		fil('M70 92L130 42M64 120L20 80M358 110L404 70M360 150L324 120', '#2e231b', 1.6),
		grop({ class: 'ventolet' }, ...cima.map((L) => fuelha(L, CIMA)))
	].join('');
}

// ── le pin penché sur la mer : le bleu profond, la voile, le rocher ──
function mar(u) {
	const a = azard(97);
	const ondas = [];
	const N = 15;
	for (let k = 0; k < N; k++) {
		const t = (k + 0.6) / N;
		const y = 118 + 182 * Math.pow(t, 1.6) + (a() - 0.5) * 3 * t;
		const am = (0.5 + 2.4 * t) * (0.7 + a() * 0.6);
		const L = (16 + 46 * t) * (0.85 + a() * 0.3);
		let d = `M-60 ${r1(y)}q${r1(L / 4)} ${r1(-am)} ${r1(L / 2)} 0`;
		for (let x = -60 + L / 2; x < 470; x += L / 2) d += `t${r1(L / 2)} 0`;
		// des traits coupés au hasard : pas deux lignes pareilles
		const pas = [14 + 36 * t, 5 + 12 * t, 8 + 22 * t, 4 + 10 * t].map((v) => r1(v * (0.6 + a() * 0.8)));
		ondas.push({ d, w: r1(0.4 + 1.1 * t), dash: pas.join(' '), off: r1(a() * 60), o: r1(0.16 + 0.24 * t), clar: k % 2 === 0 });
	}
	const onda = (o) =>
		`<path d="${o.d}" stroke-width="${o.w}" stroke-dasharray="${o.dash}" stroke-dashoffset="${o.off}" opacity="${o.o}"/>`;
	const tronc =
		'M336 300C340 270 338 240 330 214C322 190 306 170 290 150C280 137 272 124 266 110L272 108C280 122 290 136 300 148C318 170 334 190 342 214C350 240 350 270 346 300Z';
	const roc = 'M-2 252C30 244 70 242 108 246C150 250 196 258 236 266C262 272 286 284 300 300H-2Z';
	const PIN = ['#284318', '#48692a', '#7b9838', '#a9bd52'];
	return [
		'<defs>',
		degrade(`cel-${u}`, [[0, '#3168ad'], [0.62, '#6d9fd2'], [1, '#d2e3f0']]),
		degrade(`mar-${u}`, [[0, '#86aed3'], [0.07, '#5285b9'], [0.4, '#2f6299'], [1, '#1b4474']]),
		retalh(`roc-c-${u}`, roc),
		'</defs>',
		rect(0, 0, 400, 119, `url(#cel-${u})`),
		// un cap au loin, dans la brume
		ple('M0 118V111C18 109 38 110 56 113C68 115 80 117 94 118Z', '#88a7cb'),
		// la mer profonde : des vagues en traits fins, plus serrées au loin
		rect(0, 118, 400, 182, `url(#mar-${u})`),
		fil('M0 118.4H400', '#d3e6f4', 0.8, { opacity: 0.8 }),
		grop({ class: 'ondas-a', fill: 'none', stroke: '#fff' }, ...ondas.filter((o) => o.clar).map(onda)),
		grop({ class: 'ondas-b', fill: 'none', stroke: '#04163f' }, ...ondas.filter((o) => !o.clar).map(onda)),
		fil(rides(91, 120, 300, 121, 178, 46, 3, 14, 1.3), '#fff', 0.9, { class: 'lusor-a', opacity: 0.5 }),
		// la voile
		grop(
			{ class: 'barca' },
			ple('M243 176H258L255 179H246Z', '#f4f1ea'),
			fil('M250.4 175.5V160.5', '#d8dde4', 0.5),
			ple('M251 175L251 161L257.5 174Z', '#fff'),
			ple('M249.8 175L249.8 163L244.5 174Z', '#e6ecf3'),
			fil('M245 181h11M247 183h7', '#fff', 0.6, { opacity: 0.5 })
		),
		// le rocher de calcaire du premier plan
		ple(roc, '#d9ccb1'),
		ple('M-2 276C50 268 110 268 160 276C200 282 240 292 262 300H-2Z', '#bba98a'),
		ple('M-2 252C30 244 70 242 108 246C150 250 196 258 236 266L232 271C194 263 150 256 108 252C70 249 32 250 -2 259Z', '#f0e8d6'),
		fil(traits(92, 0, 290, 254, 300, 46, 4, 14, 160, 25), '#7a6a52', 0.8, { opacity: 0.55, 'clip-path': `url(#roc-c-${u})` }),
		// la branche morte, à gauche
		fil('M-2 238C20 228 40 222 62 214C80 207 96 204 118 198', '#a69a8b', 2.4),
		fil('M62 214l10-14M88 206l14-10l6-8M40 222l-4-12', '#a69a8b', 1.2),
		...[touffa(99, 100, 192, 16, 6, 14, 2, 4.5), touffa(100, 126, 197, 12, 5, 10, 2, 4)].map((L) => fuelha(L, ['#2c4a1c', '#4b6d26', '#7d9a37'])),
		fuelha(touffa(101, 372, 278, 40, 22, 32, 4, 9), ['#28411f', '#45652a', '#7a963a']),
		// le pin, penché vers le large
		grop(
			{ class: 'pin' },
			ple(tronc, '#cdbfab'),
			ple('M272 108C280 122 290 136 300 148C318 170 334 190 342 214C350 240 350 270 346 300H339C342 270 342 241 335 217C327 194 311 173 294 152C285 140 276 125 269 112Z', '#9c8d7a'),
			fil(escorsa(102, [[341, 300, 10], [344, 255, 10], [336, 214, 12], [318, 180, 13], [295, 149, 10], [281, 129, 8], [269, 109, 6]], 60, 3, 7), '#6b5b49', 1.1),
			fil('M300 148C290 130 270 112 246 100M318 172C326 150 320 130 300 112M290 140C300 126 312 118 330 112M276 120C262 118 230 116 208 112', '#8a7a68', 1.8),
			...[touffa(93, 236, 94, 40, 12, 40, 3, 7.5), touffa(94, 278, 78, 32, 11, 34, 3, 7), touffa(95, 312, 104, 26, 9, 26, 3, 6.5), touffa(96, 262, 118, 28, 8, 26, 3, 6), touffa(97, 206, 112, 22, 7, 20, 2.5, 5.5), touffa(98, 332, 126, 18, 6, 14, 2.5, 5)].map(
				(L) => fuelha(L, PIN)
			)
		),
		fil('M120 66q4-3 8 0q4-3 8 0M148 56q3-2.5 6 0q3-2.5 6 0', '#fff', 1.2, { class: 'volar' })
	].join('');
}

const SCENAS = { garona, vilatge, riu, plana, mar };
export const IDS_SCENAS = Object.keys(SCENAS);
const memoria = new Map();

/** le dessin d'une affiche (le contenu de son <svg>, viewBox 0 0 400 300) ; '' si l'id est inconnu */
export function scena(id) {
	if (!memoria.has(id)) memoria.set(id, SCENAS[id] ? SCENAS[id](id) : '');
	return memoria.get(id);
}
