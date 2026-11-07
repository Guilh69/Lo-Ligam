// « Pausa los mots » : où poser la case de chaque mot sur la photo. La case
// ne couvre pas la chose qu'elle nomme : elle se met à côté de son point
// d'or (dessous d'abord, puis dessus, à droite, à gauche, en biais, plus
// loin), là où elle ne chevauche ni une autre case ni un autre point, sans
// sortir de la photo. Un filet fin relie le point à sa case.
// Tout en pixels de la photo affichée : la page recalcule quand elle change
// de taille.

const candidats = (ax, ay, w, h, e) => [
	{ x: ax - w / 2, y: ay + e, c: 0 }, // dessous
	{ x: ax - w / 2, y: ay - e - h, c: 1 }, // dessus
	{ x: ax + e, y: ay - h / 2, c: 2 }, // à droite
	{ x: ax - e - w, y: ay - h / 2, c: 2 }, // à gauche
	{ x: ax + e * 0.6, y: ay + e * 0.6, c: 3 }, // en biais
	{ x: ax - w - e * 0.6, y: ay + e * 0.6, c: 3 },
	{ x: ax + e * 0.6, y: ay - e * 0.6 - h, c: 3 },
	{ x: ax - w - e * 0.6, y: ay - e * 0.6 - h, c: 3 },
	{ x: ax - w / 2, y: ay + e * 2.4, c: 5 }, // plus loin
	{ x: ax - w / 2, y: ay - e * 2.4 - h, c: 5 }
];

const borna = (v, a, b) => Math.min(Math.max(v, a), b);

/**
 * La taille du texte et d'une case pour une photo dont le grand côté fait L pixels : le
 * texte entre 12 et 17 px ; la case tient le plus long mot de la photo
 * (longueurs en lettres ; Luciole gras : environ 0,6 em par lettre).
 */
export function casaDe(L, longors) {
	const fs = borna(L / 48, 12, 17);
	return { fs, w: Math.ceil(Math.max(...longors) * 0.6 * fs + 1.3 * fs), h: Math.ceil(2.1 * fs) };
}

/** La surface commune de deux rectangles { x, y, w, h }. */
export function recobriment(a, b) {
	const l = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
	const h = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
	return l * h;
}

// à quel point un rectangle mord sur un rond (0 : pas du tout)
function mossa(r, cx, cy, rai) {
	const dx = cx - borna(cx, r.x, r.x + r.w),
		dy = cy - borna(cy, r.y, r.y + r.h);
	return Math.max(0, rai - Math.hypot(dx, dy));
}

/**
 * punts : [[oc, x, y]] (x et y en fraction de la photo) ; W × H : la photo
 * affichée ; w × h : une case. Rend [{ oc, ax, ay, x, y, w, h, bx, by }] :
 * le point (ax, ay), le coin haut gauche de la case (x, y), et (bx, by) le
 * bout du filet sur le bord de la case.
 */
export function plaçarCasas(punts, W, H, w, h, { marge = 6, anel = 11 } = {}) {
	const e = anel + 7; // l'écart entre le point et sa case
	const ancoras = punts.map(([oc, x, y]) => ({ oc, ax: x * W, ay: y * H }));
	// les points les plus entourés choisissent d'abord
	const vesins = (a) => ancoras.filter((b) => b !== a && Math.abs(b.ax - a.ax) < w + e && Math.abs(b.ay - a.ay) < 2 * h + 2 * e).length;
	const ordre = [...ancoras].sort((a, b) => vesins(b) - vesins(a) || a.ay - b.ay);
	const pausadas = new Map();
	for (const a of ordre) {
		let melhor = null;
		for (const k of candidats(a.ax, a.ay, w, h, e)) {
			const r = { x: borna(k.x, marge, W - w - marge), y: borna(k.y, marge, H - h - marge), w, h };
			let s = k.c * 6 + Math.hypot(r.x - k.x, r.y - k.y) * 1.5;
			for (const q of pausadas.values()) s += recobriment(r, q) * 4;
			for (const b of ancoras) s += mossa(r, b.ax, b.ay, anel + 4) * (b === a ? 40 : 25);
			if (!melhor || s < melhor.s) melhor = { ...r, s };
		}
		pausadas.set(a.oc, melhor);
	}
	return ancoras.map((a) => {
		const r = pausadas.get(a.oc);
		return { oc: a.oc, ax: a.ax, ay: a.ay, x: r.x, y: r.y, w, h, bx: borna(a.ax, r.x, r.x + w), by: borna(a.ay, r.y, r.y + h) };
	});
}
