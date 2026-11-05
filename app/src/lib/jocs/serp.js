// Logique de « La sèrp de las letras », sans affichage (testée dans
// serp.test.js). La sèrp avance d'une case à chaque pas et mange toute lettre
// qu'elle croise : la queue, lue de la queue vers la tête, écrit ce qu'elle a
// mangé. Le mot est écrit quand la queue épelle exactement le mot. Une lettre
// mangée à tort (`falsa`) se recrache (`escupir`, demande de Romain du
// 2026-11-05) : elle retombe sur la grille devant la tête. Rien n'est
// punitif (cahier §11, 25-10 : ni classement ni mécanique culpabilisante) :
// - le bord de la grille fait passer de l'autre côté ;
// - si la tête va toucher la queue, la sèrp s'arrête et attend qu'on tourne.
import { letrasDe } from './serp-mots.js';

export const DIRS = {
	amont: { x: 0, y: -1 },
	aval: { x: 0, y: 1 },
	esquerra: { x: -1, y: 0 },
	drecha: { x: 1, y: 0 }
};

const cle = (x, y) => `${x},${y}`;
const oposadas = (a, b) => a.x === -b.x && a.y === -b.y;
const mod = (n, m) => ((n % m) + m) % m;

/**
 * Une partie pour un mot. `cap` : case de départ de la tête ; `rand` :
 * tirage aléatoire (remplaçable dans les tests).
 */
export function novelaPartida({ mot, trapas = [], cols, rows, cap, dir = DIRS.drecha, rand = Math.random }) {
	const letras = letrasDe(mot);
	const p = {
		cols,
		rows,
		letras,
		cors: [{ ...(cap ?? { x: Math.floor(cols / 4), y: Math.floor(rows / 2) }) }],
		dir: { ...dir },
		file: [],
		creisser: 0,
		seguenta: 0, // lettres justes dans la queue (= la prochaine attendue)
		falsas: 0, // lettres mangées à tort, toujours en fin de queue
		manjadas: [], // k des tuiles mangées, dans l'ordre
		errors: 0, // erreurs de suite (pour l'aide douce)
		acabat: false,
		teulas: [] // { k, l, x, y, manjada }
	};
	placar(p, [...letras, ...trapas], rand);
	return p;
}

// Place les lettres sur des cases libres : jamais sur la sèrp ni sur les
// quatre cases devant la tête, jamais deux lettres qui se touchent.
function placar(p, lista, rand) {
	const pres = new Set();
	const cap = p.cors[0];
	for (let i = 0; i <= 4; i++) {
		pres.add(cle(mod(cap.x + p.dir.x * i, p.cols), mod(cap.y + p.dir.y * i, p.rows)));
	}
	for (const c of p.cors) pres.add(cle(c.x, c.y));
	let k = 0;
	for (const l of lista) {
		let c = null;
		for (let essai = 0; essai < 400 && !c; essai++) {
			const x = Math.floor(rand() * p.cols);
			const y = Math.floor(rand() * p.rows);
			if (pres.has(cle(x, y))) continue;
			if (p.teulas.some((t) => Math.abs(t.x - x) <= 1 && Math.abs(t.y - y) <= 1)) continue;
			c = { x, y };
		}
		// grille trop pleine (ne devrait pas arriver) : la première case libre
		if (!c) {
			for (let y = 0; y < p.rows && !c; y++)
				for (let x = 0; x < p.cols && !c; x++) if (!pres.has(cle(x, y)) && !p.teulas.some((t) => t.x === x && t.y === y)) c = { x, y };
		}
		p.teulas.push({ k: k++, l, x: c.x, y: c.y, manjada: false });
	}
}

/** La lettre attendue ; null quand le mot est écrit, ou qu'une lettre fausse est à recracher. */
export const letraAttesa = (p) => (p.acabat || p.falsas > 0 ? null : p.letras[p.seguenta]);

/** Les lettres de la queue, de la queue vers la tête. */
export const coa = (p) => p.manjadas.map((k) => p.teulas[k].l);

/**
 * Demande un virage. Refusé s'il fait revenir la sèrp sur elle-même (dès
 * qu'elle a une queue) ; deux virages au plus en attente.
 */
export function virar(p, d) {
	const darrier = p.file.length ? p.file[p.file.length - 1] : p.dir;
	if (d.x === darrier.x && d.y === darrier.y) return false;
	if (p.cors.length > 1 && oposadas(d, darrier)) return false;
	if (p.file.length >= 2) return false;
	p.file.push({ ...d });
	return true;
}

/**
 * Un pas. Renvoie ce qui s'est passé : { tipe: 'res' | 'manjada' | 'falsa'
 * | 'barrada' | 'acabat', teula? }.
 */
export function pas(p) {
	if (p.acabat) return { tipe: 'res' };
	if (p.file.length) p.dir = p.file.shift();
	const cap = p.cors[0];
	const nx = mod(cap.x + p.dir.x, p.cols);
	const ny = mod(cap.y + p.dir.y, p.rows);
	// la queue libère sa dernière case, sauf si la sèrp grandit à ce pas
	const corsQueDemora = p.creisser > 0 ? p.cors : p.cors.slice(0, -1);
	if (corsQueDemora.some((c) => c.x === nx && c.y === ny)) return { tipe: 'barrada' };

	p.cors.unshift({ x: nx, y: ny });
	if (p.creisser > 0) p.creisser--;
	else p.cors.pop();

	const teula = p.teulas.find((t) => !t.manjada && t.x === nx && t.y === ny);
	if (!teula) return { tipe: 'res' };
	teula.manjada = true;
	p.manjadas.push(teula.k);
	p.creisser++;
	if (p.falsas > 0 || teula.l !== p.letras[p.seguenta]) {
		p.falsas++;
		p.errors++;
		return { tipe: 'falsa', teula };
	}
	p.seguenta++;
	p.errors = 0;
	if (p.seguenta === p.letras.length) {
		p.acabat = true;
		return { tipe: 'acabat', teula };
	}
	return { tipe: 'manjada', teula };
}

/**
 * Recrache la dernière lettre mangée : elle retombe sur la première case
 * libre devant la tête, la queue raccourcit d'une case. Renvoie la tuile,
 * ou null s'il n'y a rien à recracher.
 */
export function escupir(p) {
	if (p.acabat || !p.manjadas.length) return null;
	const teula = p.teulas[p.manjadas.pop()];
	const cap = p.cors[0];
	let c = null;
	for (let i = 1; i <= p.cols + p.rows && !c; i++) {
		const x = mod(cap.x + p.dir.x * i, p.cols);
		const y = mod(cap.y + p.dir.y * i, p.rows);
		if (p.cors.some((s) => s.x === x && s.y === y)) continue;
		if (p.teulas.some((t) => !t.manjada && t.x === x && t.y === y)) continue;
		c = { x, y };
	}
	if (!c) {
		// aucune case libre devant (ne devrait pas arriver) : la première case libre
		for (let y = 0; y < p.rows && !c; y++)
			for (let x = 0; x < p.cols && !c; x++)
				if (!p.cors.some((s) => s.x === x && s.y === y) && !p.teulas.some((t) => !t.manjada && t.x === x && t.y === y)) c = { x, y };
	}
	teula.manjada = false;
	teula.x = c.x;
	teula.y = c.y;
	if (p.creisser > 0) p.creisser--;
	else p.cors.pop();
	if (p.falsas > 0) p.falsas--;
	else p.seguenta--;
	p.errors = 0;
	return teula;
}

/**
 * Où dessiner chaque case : la tête, puis les lettres. Une lettre mangée
 * suit la sèrp ; la plus récente est juste derrière la tête (ou encore sous
 * elle, au pas où elle vient d'être mangée).
 */
export function posicions(p) {
	const n = p.cors.length - 1;
	return p.teulas.map((t) => {
		if (!t.manjada) return { ...t, cors: false };
		const j = p.manjadas.indexOf(t.k);
		const c = p.cors[Math.max(0, n - j)];
		return { ...t, x: c.x, y: c.y, cors: true, sotaCap: n - j <= 0 };
	});
}
