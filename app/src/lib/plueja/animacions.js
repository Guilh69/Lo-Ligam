// Petites animations de la poussière d'or (lot 2, refaites le 06-11).
//
// Romain (05-11) : « faire des petites animations quand il faut… le tonnerre,
// faire qu'on sent qu'il y a un tonnerre » ; puis (06-11) : « les animations
// devraient faire bouger le dessin en lui-même, pas rajouter des petits
// éléments en plus » et « des fois, il n'y a pas besoin d'animation quand le
// dessin est très clair ».
//
// Donc on ne fait que déplacer, déformer ou éclairer les traits du dessin, et
// chaque trait finit à sa place : la fin de l'animation est le dessin de départ.
// Une seule fois, quand le mot vient d'être net ; rien si l'on a demandé de
// réduire les animations. Unités : le carré du dessin (0 à 100) et la seconde.
//
// Sans animation parce que le dessin dit déjà tout (06-11) : la nèu, Fa freg.,
// cigala, grilh, estèla, nòu ; aigaci aussi (essayée en pointillé qui coule, on
// lisait des traits cassés plus que de l'eau ; Joan, 06-11).
//
//   i : rangs des chemins concernés dans le dessin du mot ;
//   tremol : tout le dessin tremble, le mot reste immobile { a : amplitude (px
//     pour un dessin de 300 px), f : Hz, t : [début, fin], gronh : le grondement
//     enfle puis s'éteint lentement } ;
//   cai : des traits tombent, s'effacent en bas et reviennent par le haut
//     { i, v : vitesse, zona : [haut, bas], fondu : longueur du fondu aux deux
//     bouts, dir : [dx, dy] pour la pluie oblique, separa : chaque segment d'un
//     chemin M…L… tombe seul, etal : chaque segment a sa zone décalée vers le
//     bas (0 à etal), pour que la pluie ne s'éteigne pas d'un coup au bas de la
//     zone, balanç : les flocons se balancent } ; la distance
//     parcourue est un nombre entier de tours, chaque trait revient à sa place ;
//   ondula : des lignes ondulent { i, a : amplitude, l : longueur d'onde, v } ;
//   ressaut : des arcs s'élargissent l'un après l'autre { i, c : centre, a,
//     t : début, len : durée d'un arc, desfasa : décalage, rep : passages } ;
//   bransol : le dessin se balance autour d'un point { c, a : radians, f, t } ;
//   eslum : un trait s'illumine { i, t : instants } ; deux au plus, à plus de
//     0,2 s l'un de l'autre (moins de trois flashs par seconde, RGAA) ;
//   vibrar : au téléphone, une courte vibration, juste après un geste (motif de
//     l'API : vibration, pause, vibration…).
import { cheminsDe } from './dessenhs.js';

const PLOU = { i: [1], separa: true, v: 22, zona: [60, 98], fondu: 5, dir: [-0.37, 0.93], etal: 10 };
const VENT = { i: [0, 1, 2], a: 2.6, l: 34, v: 40 };
const GOTAS = { i: [0, 1, 2], v: 18, zona: [0, 100], fondu: 12 };

export const ANIMACIONS = {
	// le tonnerre : le dessin gronde, les ondes sous le nuage s'élargissent l'une après l'autre
	tron: {
		dur: 2,
		tremol: { a: 3, f: 12, t: [0.05, 1.8], gronh: true },
		ressaut: { i: [1, 2, 3], c: [50, 61], a: 0.16, t: 0.1, len: 0.55, desfasa: 0.16, rep: 2 },
		vibrar: [70, 90, 140]
	},
	// l'orage : l'éclair du dessin s'allume deux fois, puis le tonnerre gronde (sans la
	// pluie : trois mouvements en trois secondes, c'était trop ; Joan, 06-11)
	auratge: {
		dur: 3.2,
		eslum: { i: [1], t: [0.1, 0.36] },
		tremol: { a: 2.4, f: 12, t: [0.8, 2.3], gronh: true },
		vibrar: [0, 800, 60, 90, 120]
	},
	liuç: { dur: 0.8, eslum: { i: [0], t: [0.05, 0.3] } },
	// la pluie du dessin tombe ; lente pour la bruine
	'Plòu.': { dur: 4, cai: PLOU },
	plòu: { dur: 4, cai: PLOU },
	plovina: { dur: 4, cai: { i: [1], separa: true, v: 9, zona: [60, 100], fondu: 5, dir: [-0.32, 0.95], etal: 10 } },
	// les trois gouttes descendent, sortent en bas et reviennent à leur place
	'la pluèja': { dur: 5, cai: GOTAS },
	pluèja: { dur: 5, cai: GOTAS },
	// la goutte du robinet tombe dans la flaque, une autre se forme
	gotejar: { dur: 4, cai: { i: [5], v: 20, zona: [52, 90], fondu: 6 } },
	// les lignes du vent ondulent
	'Fa vent.': { dur: 3, ondula: VENT },
	vent: { dur: 3, ondula: VENT },
	marin: { dur: 4, ondula: { i: [0, 1, 2, 3], a: 2.4, l: 40, v: 36 } }, // le vent et la mer
	// les flocons du dessin descendent en se balançant
	'Nèva.': { dur: 6, cai: { i: [1, 2, 3], v: 7, zona: [64, 104], fondu: 6, balanç: 3 } }, // ils renaissent sous le nuage, pas dessus
	// le réveil sonne : il tremble sur ses pieds
	'Me lèvi.': { dur: 1.4, bransol: { c: [50, 86], a: 0.11, f: 9, t: [0.05, 1.3] } }
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mod = (a, n) => ((a % n) + n) % n;
const frac = (x) => x - Math.floor(x);
const bossa = (x) => (x > 0 && x < 1 ? Math.sin(Math.PI * x) ** 2 : 0); // monte et redescend, de 0 à 0

// Le profil de vitesse : on démarre en douceur (20 % du temps), on finit en
// douceur (25 %) ; la distance totale D est atteinte exactement à la fin.
const MONTA = 0.2,
	DAVALA = 0.25,
	PLEN = 1 - (MONTA + DAVALA) / 2;
export function distAnim(u, D) {
	u = clamp(u, 0, 1);
	const v = D / PLEN; // vitesse en régime, par unité de temps relatif
	if (u < MONTA) return v * (u / 2 - (MONTA / (2 * Math.PI)) * Math.sin((Math.PI * u) / MONTA));
	if (u <= 1 - DAVALA) return v * (MONTA / 2 + (u - MONTA));
	const w = 1 - u;
	return D - v * (w / 2 - (DAVALA / (2 * Math.PI)) * Math.sin((Math.PI * w) / DAVALA));
}

/** Les points d'un chemin (extrémités et points de contrôle ; pour un arc, ses extrémités). */
function pointsDe(d) {
	const jetons = d.match(/[MLCQAZmlcqaz]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
	const AR = { M: 2, L: 2, C: 6, Q: 4, A: 7, Z: 0 };
	const pts = [];
	let cmd = 'M',
		x = 0,
		y = 0,
		k = 0;
	while (k < jetons.length) {
		if (/[a-z]/i.test(jetons[k])) {
			cmd = jetons[k++];
			if (cmd.toUpperCase() === 'Z') continue;
		}
		const n = AR[cmd.toUpperCase()],
			v = jetons.slice(k, k + n).map(Number);
		k += n;
		const rel = cmd === cmd.toLowerCase();
		if (cmd.toUpperCase() === 'A') {
			x = rel ? x + v[5] : v[5];
			y = rel ? y + v[6] : v[6];
			pts.push([x, y]);
		} else {
			for (let j = 0; j < n; j += 2) pts.push(rel ? [x + v[j], y + v[j + 1]] : [v[j], v[j + 1]]);
			[x, y] = pts[pts.length - 1];
		}
	}
	return pts;
}
const milhY = (d) => {
	const ys = pointsDe(d).map((p) => p[1]);
	return (Math.min(...ys) + Math.max(...ys)) / 2;
};

/** Les segments d'un chemin fait seulement de « M x y L x y » (une pluie). */
export function segments(d) {
	return d.match(/M[^M]+/g).map((s) => s.trim());
}

/** Un chemin M/L/C/Q en lignes brisées (une par « M »), pour le déformer ; les arcs (A, a)
 *  ne sont pas pris en charge : un chemin qui ondule n'en doit pas contenir. */
export function polylinhas(d, pas = 10) {
	const out = [];
	let cur = null,
		x = 0,
		y = 0;
	const re = /([MLCQZ])([^MLCQZ]*)/g;
	for (const [, cmd, args] of d.matchAll(re)) {
		const v = (args.match(/-?\d*\.?\d+/g) ?? []).map(Number);
		if (cmd === 'M') {
			cur = [[v[0], v[1]]];
			out.push(cur);
			[x, y] = [v[0], v[1]];
			for (let j = 2; j < v.length; j += 2) cur.push([(x = v[j]), (y = v[j + 1])]);
		} else if (cmd === 'L') for (let j = 0; j < v.length; j += 2) cur.push([(x = v[j]), (y = v[j + 1])]);
		else if (cmd === 'C')
			for (let j = 0; j < v.length; j += 6) {
				const [x1, y1, x2, y2, x3, y3] = v.slice(j, j + 6);
				for (let s = 1; s <= pas; s++) {
					const t = s / pas,
						u = 1 - t;
					cur.push([u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]);
				}
				[x, y] = [x3, y3];
			}
		else if (cmd === 'Q')
			for (let j = 0; j < v.length; j += 4) {
				const [x1, y1, x2, y2] = v.slice(j, j + 4);
				for (let s = 1; s <= pas; s++) {
					const t = s / pas,
						u = 1 - t;
					cur.push([u * u * x + 2 * u * t * x1 + t * t * x2, u * u * y + 2 * u * t * y1 + t * t * y2]);
				}
				[x, y] = [x2, y2];
			}
		else if (cmd === 'Z' && cur) cur.push([...cur[0]]);
	}
	return out;
}

/** Ce qu'il faut savoir d'avance pour animer le dessin d'un mot, ou null. */
export function prepAnim(oc, def = '') {
	const a = ANIMACIONS[oc],
		d = cheminsDe(oc, def);
	if (!a || !d) return null;
	const par = d.map(() => null),
		tours = (v, L) => Math.max(1, Math.round((v * a.dur * PLEN) / L)) * L;
	if (a.cai) {
		const m = a.cai;
		for (const j of m.i)
			par[j] = {
				k: 'cai',
				els: (m.separa ? segments(d[j]) : [d[j]]).map((s, n) => {
					const y = milhY(s),
						// le décalage ne doit pas faire pâlir le trait à sa place de départ
						z = m.etal ? Math.min(m.etal * frac(Math.sin((n + 1) * 12.9898 + j * 78.233) * 43758.5453), Math.max(0, y - m.zona[0] - m.fondu)) : 0;
					return { d: s, y, ph: n * 2.1 + j * 1.3, z };
				})
			};
	}
	if (a.ondula) for (const j of a.ondula.i) par[j] = { k: 'ondula', linhas: polylinhas(d[j]), ph: j * 1.9 };
	if (a.ressaut) a.ressaut.i.forEach((j, n) => (par[j] = { k: 'ressaut', n }));
	if (a.eslum) for (const j of a.eslum.i) par[j] = { k: 'eslum' };
	return {
		a,
		par,
		Dcai: a.cai ? tours(a.cai.v, a.cai.zona[1] - a.cai.zona[0]) : 0
	};
}

/** Où est un trait qui tombe, après la distance d : décalage et opacité. */
export function posCai(el, m, d, u) {
	const z0 = m.zona[0] + el.z,
		z1 = m.zona[1] + el.z,
		w = z0 + mod(el.y - z0 + d, z1 - z0),
		dy = w - el.y,
		[dx0, dy0] = m.dir ?? [0, 1],
		balanç = m.balanç ? m.balanç * Math.sin(u * 2 * Math.PI * 2.2 + el.ph) * Math.sin(Math.PI * u) : 0; // le flocon se balance deux fois
	return { dx: (dy * dx0) / dy0 + balanç, dy, alpha: clamp(Math.min(w - z0, z1 - w) / m.fondu, 0, 1) };
}

/** Le tremblement du dessin (px pour un dessin de 300 px), nul hors de sa fenêtre. */
export function tremolDe(a, ta) {
	const tr = a.tremol;
	if (!tr || ta < tr.t[0] || ta > tr.t[1]) return [0, 0];
	const u = (ta - tr.t[0]) / (tr.t[1] - tr.t[0]),
		env = tr.gronh ? Math.pow(Math.sin(Math.PI * Math.pow(u, 0.6)), 1.5) * (0.75 + 0.25 * Math.sin(ta * 17)) : Math.min(1, u * 8, (1 - u) * 5),
		w = 2 * Math.PI * tr.f * ta,
		amp = tr.a * env;
	return [(amp * (Math.sin(w) + 0.5 * Math.sin(w * 1.73 + 1.3))) / 1.5, amp * 0.6 * Math.sin(w * 1.31 + 2.1)];
}

/** L'angle du dessin qui se balance (radians), nul hors de sa fenêtre. */
export function bransolDe(m, ta) {
	if (!m || ta < m.t[0] || ta > m.t[1]) return 0;
	const u = (ta - m.t[0]) / (m.t[1] - m.t[0]);
	return m.a * Math.min(1, u * 12) * Math.pow(1 - u, 1.4) * Math.sin(2 * Math.PI * m.f * (ta - m.t[0]));
}

/** L'élargissement de l'arc n (0 = au repos). */
export function ressautDe(m, n, ta) {
	const cicle = m.len + m.desfasa * (m.i.length - 1);
	let b = 0;
	for (let r = 0; r < m.rep; r++) b = Math.max(b, bossa((ta - m.t - r * cicle - n * m.desfasa) / m.len));
	return b;
}

/** L'éclat d'un trait qui s'illumine (0 à 1) : il s'allume d'un coup et s'éteint en un cinquième de seconde. */
export function eslumDe(m, ta) {
	let e = 0;
	for (const tf of m.t) if (ta >= tf) e = Math.max(e, Math.exp(-(ta - tf) / 0.07));
	return e < 0.01 ? 0 : e;
}

/** L'enveloppe des lignes qui ondulent : monte, puis revient à plat. */
export const ondulaEnv = (u) => bossa(u);

/**
 * Trace le dessin d'un mot à l'instant ta (s) de son animation : le canevas est
 * déjà ramené au carré du dessin (0 à 100), trait et couleur réglés ; S est la
 * taille du dessin à l'écran (px). Rend false quand l'animation est finie.
 */
export function traçarAnim(c, dess, prep, ta, S) {
	const { a, par } = prep,
		u = clamp(ta / a.dur, 0, 1),
		base = c.globalAlpha;
	c.save();
	// tout le dessin : le grondement, le réveil qui tremble sur ses pieds
	const [ox, oy] = tremolDe(a, ta),
		kt = clamp(S / 300, 0.7, 1.3) / (S / 100);
	if (ox || oy) c.translate(ox * kt, oy * kt);
	const th = bransolDe(a.bransol, ta);
	if (th) {
		const [bx, by] = a.bransol.c;
		c.translate(bx, by);
		c.rotate(th);
		c.translate(-bx, -by);
	}
	const dCai = prep.Dcai ? distAnim(u, prep.Dcai) : 0;
	for (let j = 0; j < dess.length; j++) {
		const r = par[j];
		if (!r) c.stroke(dess[j]);
		else if (r.k === 'cai') {
			// les gouttes, la pluie, les flocons du dessin tombent et reviennent à leur place
			for (const el of r.els) {
				const q = posCai(el, a.cai, dCai, u);
				if (q.alpha <= 0) continue;
				el.p2 ??= new Path2D(el.d);
				c.globalAlpha = base * q.alpha;
				c.translate(q.dx, q.dy);
				c.stroke(el.p2);
				c.translate(-q.dx, -q.dy);
			}
			c.globalAlpha = base;
		} else if (r.k === 'ondula') {
			// les lignes du vent, les vagues ondulent
			const m = a.ondula,
				amp = m.a * ondulaEnv(u);
			c.beginPath();
			for (const linha of r.linhas)
				linha.forEach(([x, y], n) => {
					const yy = y + amp * Math.sin((2 * Math.PI * (x - m.v * ta)) / m.l + r.ph);
					if (n) c.lineTo(x, yy);
					else c.moveTo(x, yy);
				});
			c.stroke();
		} else if (r.k === 'ressaut') {
			// les ondes du tonnerre s'élargissent et s'éclairent, l'une après l'autre
			const b = ressautDe(a.ressaut, r.n, ta),
				[rx, ry] = a.ressaut.c,
				s = 1 + a.ressaut.a * b;
			c.save();
			c.translate(rx, ry);
			c.scale(s, s);
			c.translate(-rx, -ry);
			c.stroke(dess[j]);
			if (b > 0.01) {
				c.globalAlpha = base * 0.45 * b;
				c.strokeStyle = '#fff6e2';
				c.stroke(dess[j]);
			}
			c.restore();
		} else {
			// l'éclair du dessin s'allume : plus clair, plus épais, avec son halo
			c.stroke(dess[j]);
			const e = eslumDe(a.eslum, ta);
			if (e) {
				c.save();
				c.globalAlpha = base * e;
				c.strokeStyle = '#fff6e2';
				c.lineWidth *= 1.9;
				c.shadowColor = 'rgba(255, 238, 200, 0.9)';
				c.shadowBlur = 14 * e;
				c.stroke(dess[j]);
				c.restore();
			}
		}
	}
	c.restore();
	return ta <= Math.max(a.dur, a.tremol?.t[1] ?? 0, a.bransol?.t[1] ?? 0);
}
