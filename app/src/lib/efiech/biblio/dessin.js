// COPIE d'Efièch 0.1.0 (C:\Users\perie\Depots\Efiech). Ne pas modifier ici : modifier là-bas, puis « node synchroniser.mjs ».
// Le dessin d'un effet : ce qu'on garde d'un fichier SVG déposé.
//
// Un fichier SVG est du texte qui peut contenir bien plus qu'un dessin : un
// programme (<script>, onload="…"), un lien vers un autre site, une page web
// entière (<foreignObject>). On ne le recopie donc jamais tel quel. On le lit
// balise par balise, on n'en retient que la géométrie (les tracés, leurs
// couleurs, leurs épaisseurs, leurs déplacements), chaque valeur étant vérifiée
// par une règle stricte, et on jette tout le reste. Le dessin gardé est un petit
// objet de données, jamais du SVG :
//
//   { vb: [x, y, largeur, hauteur], traces: [{ d, m, f, s, w, r, o }] }
//
//   d : le tracé (les lettres et les nombres d'un attribut « d » de SVG)
//   m : le déplacement [a, b, c, d, e, f] (une matrice), ou null
//   f : la couleur de remplissage (#rrggbb), ou null pour « pas de remplissage »
//   s : la couleur du trait, ou null ;  w : l'épaisseur du trait
//   r : « evenodd » si les trous se calculent ainsi, sinon null
//   o : l'opacité, de 0 à 1
//
// Ce même objet, relu depuis la base, repasse par validerDessin() avant de
// servir : rien d'autre ne peut entrer dans une page.

export const LIMITES = {
	traces: 400, // tracés gardés au plus
	trace: 40000, // lettres d'un tracé au plus
	total: 120000, // lettres de tous les tracés ensemble
	fichier: 400000 // taille du fichier déposé (octets)
};

const D_PERMIS = /^[MmZzLlHhVvCcSsQqTtAa0-9eE.,+\-\s]*$/;
const NOMBRE = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g;

// balises dont on ignore tout le contenu
const IGNORER = new Set([
	'defs', 'style', 'script', 'foreignobject', 'metadata', 'title', 'desc', 'clippath', 'mask', 'symbol',
	'pattern', 'lineargradient', 'radialgradient', 'marker', 'filter', 'text', 'switch', 'iframe', 'image', 'video', 'audio', 'canvas'
]);
const GROUPES = new Set(['svg', 'g', 'a']);
const FORMES_SVG = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon']);

const NOMMEES = {
	black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff', yellow: '#ffff00',
	orange: '#ffa500', gray: '#808080', grey: '#808080', brown: '#a52a2a', purple: '#800080', pink: '#ffc0cb'
};

const hex2 = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');

/** Une couleur lisible, rendue en #rrggbb ; null pour « aucune » ; undefined si on ne sait pas la lire */
export function lireCouleur(v) {
	if (v == null) return undefined;
	const c = String(v).trim().toLowerCase();
	if (c === 'none' || c === 'transparent') return null;
	let m = c.match(/^#([0-9a-f]{3})$/);
	if (m) return '#' + [...m[1]].map((x) => x + x).join('');
	m = c.match(/^#([0-9a-f]{6})(?:[0-9a-f]{2})?$/);
	if (m) return '#' + m[1];
	m = c.match(/^rgba?\(\s*([\d.]+)(%?)[\s,]+([\d.]+)(%?)[\s,]+([\d.]+)(%?)/);
	if (m) {
		const k = (n, p) => (p ? (parseFloat(n) * 255) / 100 : parseFloat(n));
		return '#' + hex2(k(m[1], m[2])) + hex2(k(m[3], m[4])) + hex2(k(m[5], m[6]));
	}
	if (NOMMEES[c]) return NOMMEES[c];
	return undefined; // url(#dégradé), currentColor… : on laissera la couleur de l'effet
}

function decoder(s) {
	return s
		.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
		.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
}

const estNomCar = (c) => /[\w:.-]/.test(c);

// Lecture des attributs par une boucle simple (pas d'expression régulière qui
// revient en arrière : un fichier piégé ne peut pas figer l'onglet, Rodrigo 15-11)
function attributs(txt) {
	const a = {};
	let i = 0;
	const n = txt.length;
	while (i < n) {
		while (i < n && !/[A-Za-z_]/.test(txt[i])) i++;
		const d = i;
		while (i < n && estNomCar(txt[i])) i++;
		const nom = txt.slice(d, i).toLowerCase();
		while (i < n && /\s/.test(txt[i])) i++;
		if (txt[i] !== '=') continue;
		i++;
		while (i < n && /\s/.test(txt[i])) i++;
		const q = txt[i];
		if (q !== '"' && q !== "'") continue;
		const f = txt.indexOf(q, i + 1);
		if (f < 0) break;
		if (nom) a[nom] = decoder(txt.slice(i + 1, f));
		i = f + 1;
	}
	// la règle « style » écrit les mêmes propriétés autrement (Affinity, Inkscape)
	if (a.style) {
		for (const decl of a.style.split(';')) {
			const i = decl.indexOf(':');
			if (i > 0) a[decl.slice(0, i).trim().toLowerCase()] = decl.slice(i + 1).trim();
		}
	}
	return a;
}

const nombres = (s) => (String(s ?? '').match(NOMBRE) ?? []).map(Number);
const num = (s, def = 0) => {
	const n = parseFloat(s);
	return Number.isFinite(n) ? n : def;
};

export const mult = (A, B) => [
	A[0] * B[0] + A[2] * B[1],
	A[1] * B[0] + A[3] * B[1],
	A[0] * B[2] + A[2] * B[3],
	A[1] * B[2] + A[3] * B[3],
	A[0] * B[4] + A[2] * B[5] + A[4],
	A[1] * B[4] + A[3] * B[5] + A[5]
];
const ID = [1, 0, 0, 1, 0, 0];

/** Lit un attribut transform (matrix, translate, scale, rotate, skewX, skewY) */
export function lireTransform(t) {
	let M = ID;
	if (!t) return M;
	const re = /(matrix|translate|scale|rotate|skewx|skewy)\s*\(([^)]*)\)/gi;
	let m;
	while ((m = re.exec(t))) {
		const n = nombres(m[2]);
		const f = m[1].toLowerCase();
		let T = ID;
		if (f === 'matrix' && n.length === 6) T = n;
		else if (f === 'translate') T = [1, 0, 0, 1, n[0] ?? 0, n[1] ?? 0];
		else if (f === 'scale') T = [n[0] ?? 1, 0, 0, n[1] ?? n[0] ?? 1, 0, 0];
		else if (f === 'rotate') {
			const r = ((n[0] ?? 0) * Math.PI) / 180;
			const c = Math.cos(r);
			const s = Math.sin(r);
			T = [c, s, -s, c, 0, 0];
			if (n.length >= 3) T = mult(mult([1, 0, 0, 1, n[1], n[2]], T), [1, 0, 0, 1, -n[1], -n[2]]);
		} else if (f === 'skewx') T = [1, 0, Math.tan(((n[0] ?? 0) * Math.PI) / 180), 1, 0, 0];
		else if (f === 'skewy') T = [1, Math.tan(((n[0] ?? 0) * Math.PI) / 180), 0, 1, 0, 0];
		M = mult(M, T);
	}
	return M;
}

const r3 = (x) => Math.round(x * 1000) / 1000;
const pts = (s) => {
	const n = nombres(s);
	const out = [];
	for (let i = 0; i + 1 < n.length; i += 2) out.push(`${r3(n[i])} ${r3(n[i + 1])}`);
	return out;
};

/** Une forme simple (rectangle, cercle…) réécrite en tracé */
function versTrace(nom, a) {
	if (nom === 'path') return a.d ?? '';
	if (nom === 'rect') {
		const x = num(a.x);
		const y = num(a.y);
		const w = num(a.width);
		const h = num(a.height);
		if (!(w > 0 && h > 0)) return '';
		let rx = Math.min(num(a.rx, num(a.ry)), w / 2);
		let ry = Math.min(num(a.ry, rx), h / 2);
		if (!(rx > 0)) return `M${r3(x)} ${r3(y)}H${r3(x + w)}V${r3(y + h)}H${r3(x)}Z`;
		return (
			`M${r3(x + rx)} ${r3(y)}H${r3(x + w - rx)}A${r3(rx)} ${r3(ry)} 0 0 1 ${r3(x + w)} ${r3(y + ry)}` +
			`V${r3(y + h - ry)}A${r3(rx)} ${r3(ry)} 0 0 1 ${r3(x + w - rx)} ${r3(y + h)}H${r3(x + rx)}` +
			`A${r3(rx)} ${r3(ry)} 0 0 1 ${r3(x)} ${r3(y + h - ry)}V${r3(y + ry)}A${r3(rx)} ${r3(ry)} 0 0 1 ${r3(x + rx)} ${r3(y)}Z`
		);
	}
	if (nom === 'circle' || nom === 'ellipse') {
		const cx = num(a.cx);
		const cy = num(a.cy);
		const rx = nom === 'circle' ? num(a.r) : num(a.rx);
		const ry = nom === 'circle' ? num(a.r) : num(a.ry);
		if (!(rx > 0 && ry > 0)) return '';
		return `M${r3(cx - rx)} ${r3(cy)}A${r3(rx)} ${r3(ry)} 0 1 0 ${r3(cx + rx)} ${r3(cy)}A${r3(rx)} ${r3(ry)} 0 1 0 ${r3(cx - rx)} ${r3(cy)}Z`;
	}
	if (nom === 'line') return `M${r3(num(a.x1))} ${r3(num(a.y1))}L${r3(num(a.x2))} ${r3(num(a.y2))}`;
	const p = pts(a.points);
	if (p.length < 2) return '';
	return 'M' + p.join('L') + (nom === 'polygon' ? 'Z' : '');
}

/**
 * Les balises d'un texte, une à une, en un seul passage (temps proportionnel à
 * la taille du fichier, même piégé). Commentaires, sections CDATA, instructions
 * et déclaration de type sont sautés. Une balise jamais refermée arrête la lecture.
 */
function* balises(s) {
	const n = s.length;
	let i = 0;
	const sauter = (debut, fin) => {
		const f = s.indexOf(fin, debut);
		return f < 0 ? -1 : f + fin.length;
	};
	while (true) {
		const lt = s.indexOf('<', i);
		if (lt < 0) return;
		let suite;
		if (s.startsWith('<!--', lt)) suite = sauter(lt + 4, '-->');
		else if (s.startsWith('<![CDATA[', lt)) suite = sauter(lt + 9, ']]>');
		else if (s[lt + 1] === '?') suite = sauter(lt + 2, '?>');
		else if (s[lt + 1] === '!') {
			const g = s.indexOf('>', lt + 2);
			const c = s.indexOf('[', lt + 2);
			if (g < 0) return;
			suite = c >= 0 && c < g ? (() => { const e = s.indexOf(']', c); return e < 0 ? -1 : sauter(e, '>'); })() : g + 1;
		}
		if (suite !== undefined) {
			if (suite < 0) return;
			i = suite;
			continue;
		}
		let j = lt + 1;
		const fin = s[j] === '/';
		if (fin) j++;
		if (!/[A-Za-z]/.test(s[j] ?? '')) {
			i = lt + 1;
			continue;
		}
		const d = j;
		while (j < n && estNomCar(s[j])) j++;
		const nom = s.slice(d, j);
		let q = null;
		let k = j;
		for (; k < n; k++) {
			const c = s[k];
			if (q) {
				if (c === q) q = null;
			} else if (c === '"' || c === "'") q = c;
			else if (c === '>') break;
		}
		if (k >= n) return;
		const attrs = s.slice(j, k);
		yield { fin, nom, attrs, seule: attrs.trimEnd().endsWith('/') };
		i = k + 1;
	}
}

/**
 * Lit le texte d'un fichier SVG et n'en garde que le dessin.
 * Rend { dessin, avis } : dessin vaut null si rien d'utilisable n'a été trouvé ;
 * avis dit en français ce qui a été laissé de côté.
 */
export function nettoyerSvg(texte) {
	const avis = new Set();
	if (typeof texte !== 'string' || !texte.trim()) return { dessin: null, avis: ['Le fichier est vide.'] };
	if (texte.length > LIMITES.fichier) return { dessin: null, avis: ['Le fichier est trop lourd (400 Ko au plus).'] };
	const pile = [{ M: ID, f: '#000000', s: null, w: 1, r: null, o: 1, nom: '#' }];
	let ignore = 0; // profondeur dans une balise ignorée
	let vb = null;
	const traces = [];
	let total = 0;
	for (const b of balises(texte)) {
		const fin = b.fin;
		const nom = b.nom.toLowerCase().replace(/^svg:/, '');
		const seule = b.seule;
		const m = [null, null, null, b.attrs];
		if (ignore) {
			if (IGNORER.has(nom) && !seule) ignore += fin ? -1 : 1;
			continue;
		}
		if (fin) {
			if (GROUPES.has(nom) && pile.length > 1) pile.pop();
			continue;
		}
		if (IGNORER.has(nom)) {
			if (nom === 'script' || nom === 'foreignobject' || nom === 'iframe') avis.add('Un programme ou une page web cachés dans le fichier ont été retirés.');
			else if (nom === 'text') avis.add('Les textes ne sont pas gardés : les vectoriser dans le logiciel de dessin.');
			else if (nom === 'image') avis.add('Les images collées dans le dessin ne sont pas gardées.');
			if (!seule) ignore = 1;
			continue;
		}
		const a = attributs(m[3]);
		if (Object.keys(a).some((k) => k.startsWith('on'))) avis.add('Un programme caché dans le fichier a été retiré.');
		const haut = pile[pile.length - 1];
		const etat = {
			M: mult(haut.M, lireTransform(a.transform)),
			f: haut.f,
			s: haut.s,
			w: haut.w,
			r: haut.r,
			o: haut.o
		};
		if (a.fill !== undefined) {
			const c = lireCouleur(a.fill);
			if (c !== undefined) etat.f = c;
			else if (/url\(/i.test(a.fill)) avis.add('Les dégradés sont remplacés par une couleur unie.');
		}
		if (a.stroke !== undefined) {
			const c = lireCouleur(a.stroke);
			if (c !== undefined) etat.s = c;
		}
		if (a['stroke-width'] !== undefined) etat.w = Math.max(0, Math.min(200, num(a['stroke-width'], etat.w)));
		if (a['fill-rule'] !== undefined) etat.r = a['fill-rule'] === 'evenodd' ? 'evenodd' : null;
		const op = (k) => (a[k] !== undefined ? Math.max(0, Math.min(1, num(a[k], 1))) : 1);
		etat.o = etat.o * op('opacity') * op('fill-opacity');
		if (a.display === 'none' || a.visibility === 'hidden') etat.o = 0;

		if (nom === 'svg') {
			if (!vb) {
				const n = nombres(a.viewbox);
				if (n.length === 4 && n[2] > 0 && n[3] > 0) vb = n;
				else if (num(a.width) > 0 && num(a.height) > 0) vb = [0, 0, num(a.width), num(a.height)];
			}
			// le svg racine ne se déplace pas lui-même (x, y) : seules ses balises comptent
			if (!seule) pile.push(etat);
			continue;
		}
		if (GROUPES.has(nom)) {
			if (!seule) pile.push(etat);
			continue;
		}
		if (!FORMES_SVG.has(nom)) continue; // balise inconnue : ignorée, son contenu aussi est lu (groupe neutre)
		if (etat.o <= 0) continue;
		const d = versTrace(nom, a).trim();
		if (!d) continue;
		if (!D_PERMIS.test(d) || d.length > LIMITES.trace) {
			avis.add('Un tracé illisible ou trop long a été laissé de côté.');
			continue;
		}
		const fill = nom === 'line' || nom === 'polyline' ? (a.fill !== undefined ? etat.f : null) : etat.f;
		if (fill === null && etat.s === null) continue; // invisible
		if (traces.length >= LIMITES.traces || total + d.length > LIMITES.total) {
			avis.add('Le dessin est très détaillé : la fin a été coupée. Le simplifier dans le logiciel de dessin.');
			break;
		}
		total += d.length;
		const estId = etat.M.every((v, i) => Math.abs(v - ID[i]) < 1e-9);
		traces.push({
			d,
			m: estId ? null : etat.M.map((v) => Math.round(v * 1e5) / 1e5),
			f: fill,
			s: etat.s,
			w: etat.s ? Math.round(etat.w * 100) / 100 : 0,
			r: etat.r,
			o: Math.round(etat.o * 100) / 100
		});
	}
	if (!traces.length) return { dessin: null, avis: ['Aucune forme n’a été trouvée dans ce fichier.', ...avis] };
	if (!vb) {
		const b = boiteDessin({ vb: [0, 0, 1, 1], traces });
		vb = b ? [b[0], b[1], Math.max(1, b[2] - b[0]), Math.max(1, b[3] - b[1])] : [0, 0, 100, 100];
	}
	return { dessin: validerDessin({ vb: vb.map(r3), traces }), avis: [...avis] };
}

// nombres finis et raisonnables (une matrice de 1e308 ne sert à rien : refusée)
const estNombre = (x) => typeof x === 'number' && Number.isFinite(x) && Math.abs(x) <= 1e6;
const estCouleur = (c) => c === null || (typeof c === 'string' && /^#[0-9a-f]{6}$/.test(c));

/**
 * Revérifie un dessin (relu depuis la base, ou venu d'ailleurs) : rend une copie
 * propre, ou null si quelque chose ne va pas. Rien n'est réparé en silence.
 */
export function validerDessin(x) {
	if (!x || typeof x !== 'object' || !Array.isArray(x.vb) || !Array.isArray(x.traces)) return null;
	if (x.vb.length !== 4 || !x.vb.every(estNombre) || !(x.vb[2] > 0 && x.vb[3] > 0)) return null;
	if (!x.traces.length || x.traces.length > LIMITES.traces) return null;
	let total = 0;
	const traces = [];
	for (const t of x.traces) {
		if (!t || typeof t.d !== 'string' || !D_PERMIS.test(t.d) || t.d.length > LIMITES.trace) return null;
		total += t.d.length;
		if (total > LIMITES.total) return null;
		if (t.m !== null && t.m !== undefined && !(Array.isArray(t.m) && t.m.length === 6 && t.m.every(estNombre))) return null;
		if (!estCouleur(t.f ?? null) || !estCouleur(t.s ?? null)) return null;
		const w = t.w ?? 0;
		const o = t.o ?? 1;
		if (!estNombre(w) || w < 0 || w > 200 || !estNombre(o) || o < 0 || o > 1) return null;
		if (t.r !== null && t.r !== undefined && t.r !== 'evenodd') return null;
		traces.push({ d: t.d, m: t.m ? [...t.m] : null, f: t.f ?? null, s: t.s ?? null, w, r: t.r ?? null, o });
	}
	return { vb: [...x.vb], traces };
}

// --- géométrie : la boîte d'un tracé, sans navigateur -----------------------

const NB_ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };

/** Les points (extrémités et points de contrôle) d'un tracé, en coordonnées absolues */
export function pointsTrace(d) {
	const out = [];
	const re = /([MmZzLlHhVvCcSsQqTtAa])|([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/g;
	let cmd = null;
	let args = [];
	let x = 0;
	let y = 0;
	let x0 = 0;
	let y0 = 0;
	const appliquer = (c, n) => {
		const rel = c === c.toLowerCase();
		const k = c.toLowerCase();
		const bx = rel ? x : 0;
		const by = rel ? y : 0;
		if (k === 'm' || k === 'l' || k === 't') {
			x = bx + n[0];
			y = by + n[1];
			if (k === 'm') {
				x0 = x;
				y0 = y;
			}
			out.push([x, y]);
		} else if (k === 'h') {
			x = bx + n[0];
			out.push([x, y]);
		} else if (k === 'v') {
			y = by + n[0];
			out.push([x, y]);
		} else if (k === 'c') {
			out.push([bx + n[0], by + n[1]], [bx + n[2], by + n[3]]);
			x = bx + n[4];
			y = by + n[5];
			out.push([x, y]);
		} else if (k === 's' || k === 'q') {
			out.push([bx + n[0], by + n[1]]);
			x = bx + n[2];
			y = by + n[3];
			out.push([x, y]);
		} else if (k === 'a') {
			const ex = bx + n[5];
			const ey = by + n[6];
			// l'arc peut déborder de ses extrémités : on compte son rayon autour du milieu
			const mx = (x + ex) / 2;
			const my = (y + ey) / 2;
			const r = Math.max(Math.abs(n[0]), Math.abs(n[1]));
			out.push([mx - r, my - r], [mx + r, my + r]);
			x = ex;
			y = ey;
			out.push([x, y]);
		}
	};
	let m;
	while ((m = re.exec(d))) {
		if (m[1]) {
			cmd = m[1];
			args = [];
			if (cmd === 'z' || cmd === 'Z') {
				x = x0;
				y = y0;
			}
			continue;
		}
		if (!cmd) continue;
		args.push(Number(m[2]));
		const k = cmd.toLowerCase();
		const n = NB_ARGS[k];
		if (n && args.length === n) {
			appliquer(cmd, args);
			args = [];
			// après un M, les paires suivantes sont des L
			if (k === 'm') cmd = cmd === 'm' ? 'l' : 'L';
		}
	}
	return out;
}

const appliquerM = (M, [x, y]) => (M ? [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]] : [x, y]);

/** La boîte [x0, y0, x1, y1] d'un tracé, déplacement compris (approchée : points de contrôle inclus) */
export function boiteTrace(t) {
	let b = null;
	for (const p of pointsTrace(t.d)) {
		const [x, y] = appliquerM(t.m, p);
		if (!b) b = [x, y, x, y];
		else {
			if (x < b[0]) b[0] = x;
			if (y < b[1]) b[1] = y;
			if (x > b[2]) b[2] = x;
			if (y > b[3]) b[3] = y;
		}
	}
	if (b && t.s && t.w) {
		const e = t.w / 2;
		b = [b[0] - e, b[1] - e, b[2] + e, b[3] + e];
	}
	return b;
}

export function boiteDessin(dessin) {
	let b = null;
	for (const t of dessin.traces) {
		const c = boiteTrace(t);
		if (!c) continue;
		b = b ? [Math.min(b[0], c[0]), Math.min(b[1], c[1]), Math.max(b[2], c[2]), Math.max(b[3], c[3])] : c;
	}
	return b;
}

/** Les couleurs du dessin, sans doublon (pour l'atelier) */
export function couleursDessin(dessin) {
	const s = new Set();
	for (const t of dessin.traces) {
		if (t.f) s.add(t.f);
		if (t.s) s.add(t.s);
	}
	return [...s];
}

const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/**
 * Réécrit un dessin validé en SVG, pour une vignette (à montrer dans une balise
 * <img>, où aucun programme ne peut tourner). Chaque valeur a été vérifiée par
 * validerDessin et est échappée quand même.
 */
export function versSvg(dessin) {
	const d = validerDessin(dessin);
	if (!d) return '';
	const corps = d.traces
		.map(
			(t) =>
				`<path d="${esc(t.d)}"${t.m ? ` transform="matrix(${t.m.map(esc).join(' ')})"` : ''} fill="${esc(t.f ?? 'none')}"` +
				`${t.s ? ` stroke="${esc(t.s)}" stroke-width="${esc(t.w)}"` : ''}${t.r ? ' fill-rule="evenodd"' : ''}${t.o < 1 ? ` opacity="${esc(t.o)}"` : ''}/>`
		)
		.join('');
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${d.vb.map(esc).join(' ')}">${corps}</svg>`;
}

// Les formes de papier découpé de la planche : servent quand aucun dessin n'est
// déposé, ou mêlées au dessin. Noir par défaut : l'effet les teinte.
const forme = (d) => ({ vb: [0, 0, 48, 48], traces: [{ d, m: null, f: '#000000', s: null, w: 0, r: null, o: 1 }] });
export const FORMES = {
	rond: forme('M4 24A20 20 0 1 0 44 24A20 20 0 1 0 4 24Z'),
	triangle: forme('M24 4L44 42H4Z'),
	feuille: forme('M6 42C6 18 22 6 42 6C42 30 28 42 6 42Z'),
	carre: forme('M7 7H41V41H7Z'),
	etoile: forme('M24 3L29.5 17.5L45 18L33 27.5L37.5 43L24 34L10.5 43L15 27.5L3 18L18.5 17.5Z')
};
