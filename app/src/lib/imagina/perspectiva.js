// Perspective d'un mur, calculée dans la page Imaginar (2026-11-13). Romain : « il faut que l'outil soit capable
// de mettre en place la bonne perspective ». Un rectangle tracé à plat sur une photo ne suit pas le mur ; cette
// brique le couche sur le mur, par la mesure et jamais à l'œil (même principe que outils/photos-oc/talhar.py,
// où les arêtes étaient désignées à la main ; ici la photo les donne toute seule).
//
//   1. segments()  : les traits droits de la photo (croissance de régions de même pente, façon LSD).
//   2. vertical()  : la verticale du monde. Tous les murs la partagent : on la tire de tous les montants de la photo.
//   3. paret()     : l'orientation du mur. La verticale connue, un mur n'a plus qu'une inconnue (l'angle dont il
//                    tourne) ; chaque trait proche de l'endroit tracé vote pour un angle, le vote le plus net gagne.
//   4. quadParet() : le vrai rectangle du mur dont les médianes couvrent le rectangle tracé, projeté sur la photo.
//   5. omografia() : la déformation qui pose un dessin à plat sur ces quatre coins (matrix3d de CSS).
//
// Repères : la photo en fractions (x et y de 0 à 1 depuis le coin haut gauche) ; la caméra par sa focale en
// largeurs d'image et son centre optique (focales.json, relevés dans les originaux par outils/photos-oc/focales.py).
// Aucune dépendance, aucun accès au DOM : tout se teste hors navigateur (perspectiva.test.js).

const RAD = Math.PI / 180;

const prod = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const esc = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => {
	const n = Math.hypot(a[0], a[1], a[2]) || 1;
	return [a[0] / n, a[1] / n, a[2] / n];
};

/** Vecteur propre de la plus petite valeur propre d'une matrice 3 × 3 symétrique (rotations de Jacobi). */
export function mendrePropri(M) {
	const A = M.map((l) => l.slice());
	const V = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	];
	const traca = Math.abs(A[0][0]) + Math.abs(A[1][1]) + Math.abs(A[2][2]) || 1;
	for (let torn = 0; torn < 30; torn++) {
		if (Math.abs(A[0][1]) + Math.abs(A[0][2]) + Math.abs(A[1][2]) < 1e-15 * traca) break;
		for (const [p, q] of [
			[0, 1],
			[0, 2],
			[1, 2]
		]) {
			if (Math.abs(A[p][q]) < 1e-300) continue;
			const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
			const t = (th < 0 ? -1 : 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
			const c = 1 / Math.sqrt(t * t + 1),
				s = t * c;
			for (let k = 0; k < 3; k++) {
				const a = A[k][p],
					b = A[k][q];
				A[k][p] = c * a - s * b;
				A[k][q] = s * a + c * b;
			}
			for (let k = 0; k < 3; k++) {
				const a = A[p][k],
					b = A[q][k];
				A[p][k] = c * a - s * b;
				A[q][k] = s * a + c * b;
			}
			for (let k = 0; k < 3; k++) {
				const a = V[k][p],
					b = V[k][q];
				V[k][p] = c * a - s * b;
				V[k][q] = s * a + c * b;
			}
		}
	}
	let i = 0;
	for (let k = 1; k < 3; k++) if (A[k][k] < A[i][i]) i = k;
	return [V[0][i], V[1][i], V[2][i]];
}

/* ------------------------------------------------------------------ 1. les traits droits de la photo */

/** Gris d'une image RGBA (Uint8ClampedArray de canvas ou tampon brut). */
export function gris(rgba, w, h) {
	const g = new Float32Array(w * h);
	for (let i = 0, j = 0; i < g.length; i++, j += 4) g[i] = 0.299 * rgba[j] + 0.587 * rgba[j + 1] + 0.114 * rgba[j + 2];
	return g;
}

/** Flou binomial 1-4-6-4-1 dans les deux sens : calme le grain de la pierre avant de chercher les arêtes. */
function adocir(g, w, h) {
	const t = new Float32Array(w * h),
		o = new Float32Array(w * h);
	for (let y = 0; y < h; y++)
		for (let x = 0; x < w; x++) {
			const i = y * w + x,
				a = g[y * w + Math.max(0, x - 2)],
				b = g[y * w + Math.max(0, x - 1)],
				d = g[y * w + Math.min(w - 1, x + 1)],
				e = g[y * w + Math.min(w - 1, x + 2)];
			t[i] = (a + 4 * b + 6 * g[i] + 4 * d + e) / 16;
		}
	for (let y = 0; y < h; y++)
		for (let x = 0; x < w; x++) {
			const i = y * w + x,
				a = t[Math.max(0, y - 2) * w + x],
				b = t[Math.max(0, y - 1) * w + x],
				d = t[Math.min(h - 1, y + 1) * w + x],
				e = t[Math.min(h - 1, y + 2) * w + x];
			o[i] = (a + 4 * b + 6 * t[i] + 4 * d + e) / 16;
		}
	return o;
}

/**
 * Les traits droits d'une image en gris : [[x1, y1, x2, y2], …] en fractions de la photo.
 * Méthode : pente du contour en chaque point, régions de points voisins de même pente (à 22,5° près), droite
 * ajustée sur chaque région ; on ne garde que les régions longues et fines.
 */
export function segments(g0, w, h, opt = {}) {
	const g = opt.brut ? g0 : adocir(g0, w, h);
	const sulhet = opt.sulhet ?? 3.2;
	const tol = (opt.tol ?? 22.5) * RAD;
	const minLong = opt.minLong ?? Math.max(12, 0.016 * Math.hypot(w, h));
	const n = w * h;
	const mag = new Float32Array(n),
		ang = new Float32Array(n);
	let max = 0;
	for (let y = 0; y < h - 1; y++)
		for (let x = 0; x < w - 1; x++) {
			const i = y * w + x;
			const a = g[i],
				b = g[i + 1],
				c = g[i + w],
				d = g[i + w + 1];
			const gx = (b + d - a - c) / 2,
				gy = (c + d - a - b) / 2;
			const m = Math.hypot(gx, gy);
			mag[i] = m;
			if (m > max) max = m;
			ang[i] = Math.atan2(gx, -gy); // direction du contour (la pente tourne d'un quart de tour)
		}
	if (max < sulhet) return [];
	// les points les plus nets d'abord (tri par casiers)
	const NB = 1024;
	const cap = new Int32Array(NB).fill(-1),
		seg = new Int32Array(n);
	for (let i = 0; i < n; i++) {
		if (mag[i] < sulhet) continue;
		const b = Math.min(NB - 1, ((mag[i] / max) * NB) | 0);
		seg[i] = cap[b];
		cap[b] = i;
	}
	const pres = new Uint8Array(n),
		pila = new Int32Array(n);
	const DOS_PI = 2 * Math.PI;
	const sortida = [];
	for (let b = NB - 1; b >= 0; b--)
		for (let s = cap[b]; s !== -1; s = seg[s]) {
			if (pres[s]) continue;
			let nb = 0;
			pila[nb++] = s;
			pres[s] = 1;
			let sc = Math.cos(ang[s]),
				ss = Math.sin(ang[s]),
				ra = ang[s];
			for (let k = 0; k < nb; k++) {
				const p = pila[k],
					px = p % w,
					py = (p / w) | 0;
				for (let dy = -1; dy <= 1; dy++) {
					const yy = py + dy;
					if (yy < 0 || yy >= h - 1) continue;
					for (let dx = -1; dx <= 1; dx++) {
						const xx = px + dx;
						if (xx < 0 || xx >= w - 1) continue;
						const q = yy * w + xx;
						if (pres[q] || mag[q] < sulhet) continue;
						let d = Math.abs(ang[q] - ra);
						if (d > Math.PI) d = DOS_PI - d;
						if (d > tol) continue;
						pres[q] = 1;
						pila[nb++] = q;
						sc += Math.cos(ang[q]);
						ss += Math.sin(ang[q]);
						ra = Math.atan2(ss, sc);
					}
				}
			}
			if (nb < minLong) continue;
			// droite ajustée sur la région (axe principal, pondéré par la netteté)
			let sw = 0,
				sx = 0,
				sy = 0;
			for (let k = 0; k < nb; k++) {
				const p = pila[k],
					m = mag[p];
				sw += m;
				sx += m * (p % w);
				sy += m * ((p / w) | 0);
			}
			const cx = sx / sw,
				cy = sy / sw;
			let cxx = 0,
				cyy = 0,
				cxy = 0;
			for (let k = 0; k < nb; k++) {
				const p = pila[k],
					m = mag[p],
					dx = (p % w) - cx,
					dy = ((p / w) | 0) - cy;
				cxx += m * dx * dx;
				cyy += m * dy * dy;
				cxy += m * dx * dy;
			}
			const th = 0.5 * Math.atan2(2 * cxy, cxx - cyy),
				ct = Math.cos(th),
				st = Math.sin(th);
			let l0 = Infinity,
				l1 = -Infinity,
				t0 = Infinity,
				t1 = -Infinity;
			for (let k = 0; k < nb; k++) {
				const p = pila[k],
					dx = (p % w) - cx,
					dy = ((p / w) | 0) - cy,
					l = dx * ct + dy * st,
					t = dy * ct - dx * st;
				if (l < l0) l0 = l;
				if (l > l1) l1 = l;
				if (t < t0) t0 = t;
				if (t > t1) t1 = t;
			}
			const long = l1 - l0,
				larg = t1 - t0 + 1;
			if (long < minLong || long < 4 * larg || nb < 0.5 * long * larg) continue; // ni courte, ni large, ni courbe
			// (+ 0,5 : la pente est mesurée au milieu de quatre points)
			sortida.push([
				(cx + ct * l0 + 0.5) / w,
				(cy + st * l0 + 0.5) / h,
				(cx + ct * l1 + 0.5) / w,
				(cy + st * l1 + 0.5) / h
			]);
		}
	return sortida;
}

/* ------------------------------------------------------------------ la caméra */

/** Focale d'un appareil courant (équivalent 27 mm), en diagonales d'image : repli quand l'original ne la donne pas. */
const FOCALA_PER_DEFAUT = 0.62;

/**
 * La caméra d'une photo : { f, cx, cy, r, mesurada }. `focala` = [f, cx, cy] de focales.json (ou rien) ;
 * f en largeurs d'image, cx et cy en fraction de la photo, r = hauteur / largeur.
 */
export function camera(foto, focala) {
	const r = foto.h / foto.l;
	if (focala) return { f: focala[0], cx: focala[1], cy: focala[2], r, mesurada: true };
	return {
		f: FOCALA_PER_DEFAUT * Math.hypot(1, r),
		cx: 0.5,
		cy: 0.5,
		r,
		mesurada: false
	};
}

// photo (fractions) <-> plan de la caméra (focale = 1)
const versCam = (c, x, y) => [(x - c.cx) / c.f, ((y - c.cy) * c.r) / c.f];
const versFoto = (c, X, Y) => [c.cx + c.f * X, c.cy + (c.f * Y) / c.r];

/** Chaque trait vu par la caméra : milieu, direction, longueur (en largeurs d'image), plan qui le contient, emprise sur la photo. */
export function preparar(segs, cam) {
	return segs.map(([x1, y1, x2, y2]) => {
		const a = versCam(cam, x1, y1),
			b = versCam(cam, x2, y2);
		const dx = b[0] - a[0],
			dy = b[1] - a[1],
			l = Math.hypot(dx, dy) || 1e-12;
		return {
			m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
			u: [dx / l, dy / l],
			n: unit(prod([a[0], a[1], 1], [b[0], b[1], 1])),
			long: l * cam.f,
			p: [x1, y1, x2, y2],
			x: [Math.min(x1, x2), Math.max(x1, x2)],
			y: [Math.min(y1, y2), Math.max(y1, y2)]
		};
	});
}

/** Sinus de l'écart entre un trait et la droite qui joint son milieu au point de fuite de la direction d. */
function escart(s, d) {
	const vx = d[0] - s.m[0] * d[2],
		vy = d[1] - s.m[1] * d[2];
	const nv = Math.hypot(vx, vy);
	return nv < 1e-12 ? 1 : Math.abs(s.u[0] * vy - s.u[1] * vx) / nv;
}

// tirage reproductible : la même photo donne toujours la même perspective
function azard(grana) {
	let a = grana >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/* ------------------------------------------------------------------ 2. la verticale du monde */

/**
 * Direction 3D de la verticale (vers le bas), commune à tous les murs de la photo.
 * Renvoie { d, suport, nombre } ; sans montants en nombre suffisant, la verticale de l'image (appareil tenu droit).
 */
export function vertical(trachs, opt = {}) {
	const pencha = Math.cos((opt.pencha ?? 35) * RAD);
	const cand = trachs.filter((s) => Math.abs(s.u[1]) > pencha);
	const drech = { d: [0, 1, 0], suport: 0, nombre: 0 };
	if (cand.length < 3) return drech;
	const total = cand.reduce((t, s) => t + s.long, 0);
	const cumul = [];
	let c = 0;
	for (const s of cand) cumul.push((c += s.long / total));
	const rnd = azard(20261113);
	const tirar = () => {
		const v = rnd();
		let lo = 0,
			hi = cumul.length - 1;
		while (lo < hi) {
			const mi = (lo + hi) >> 1;
			if (cumul[mi] < v) lo = mi + 1;
			else hi = mi;
		}
		return cand[lo];
	};
	const tol = Math.sin(1.2 * RAD);
	let melhor = null;
	for (let i = 0; i < 500; i++) {
		const a = tirar(),
			b = tirar();
		if (a === b) continue;
		let d = prod(a.n, b.n);
		if (Math.hypot(d[0], d[1], d[2]) < 1e-6) continue; // deux traits sur la même droite
		d = unit(d);
		if (d[1] < 0) d = [-d[0], -d[1], -d[2]];
		if (d[1] < 0.8) continue; // un appareil ne penche pas autant
		let p = 0;
		for (const s of cand) if (escart(s, d) < tol) p += s.long;
		if (!melhor || p > melhor.p) melhor = { p, d };
	}
	if (!melhor) return drech;
	let d = melhor.d,
		dins = [];
	for (let pas = 0; pas < 3; pas++) {
		dins = cand.filter((s) => escart(s, d) < Math.sin(2 * RAD));
		if (dins.length < 3) break;
		const M = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
		for (const s of dins) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) M[i][j] += s.long * s.n[i] * s.n[j];
		let e = mendrePropri(M);
		if (e[1] < 0) e = [-e[0], -e[1], -e[2]];
		if (e[1] < 0.8) break;
		d = e;
	}
	return {
		d,
		suport: dins.reduce((t, s) => t + s.long, 0),
		nombre: dins.length
	};
}

/* ------------------------------------------------------------------ 3. l'orientation du mur */

/** Les deux directions horizontales de référence : e1 vers la droite de l'image, e2 vers le fond. */
function basa(dv) {
	const k = dv[0];
	const e1 = unit([1 - k * dv[0], -k * dv[1], -k * dv[2]]);
	return { e1, e2: prod(e1, dv) };
}

/** Direction 3D de l'horizontale d'un mur tourné de `phi` degrés (0 = mur de face ; positif = sa droite s'éloigne). */
export function orizontala(dv, phi) {
	const { e1, e2 } = basa(dv);
	const c = Math.cos(phi * RAD),
		s = Math.sin(phi * RAD);
	return [c * e1[0] + s * e2[0], c * e1[1] + s * e2[1], c * e1[2] + s * e2[2]];
}

/**
 * Orientation du mur à l'endroit tracé : chaque trait (ni montant, ni sur l'horizon) dit de quel angle le mur
 * devrait tourner pour que ce trait y soit horizontal ; l'angle le plus plébiscité l'emporte.
 * Deux murs se séparent toujours par une arête verticale : les traits situés dans la colonne de l'endroit tracé
 * (au-dessus, au-dessous) sont donc presque sûrement sur le même mur, ceux d'à côté beaucoup moins. Le vote est
 * serré en largeur, lâche en hauteur.
 * Renvoie { phi (degrés), nombre, part, fisable, autras: [les orientations suivantes, s'il y en a] }.
 */
export function paret(trachs, cam, dv, zona, opt = {}) {
	const { e1, e2 } = basa(dv);
	const zw = zona[2] - zona[0],
		zh = (zona[3] - zona[1]) * cam.r;
	const sx = opt.sx ?? Math.max(0.75 * zw, 0.04),
		sy = opt.sy ?? Math.max(3 * zh, 0.3 * cam.r);
	// un trait à moins de 20° de la verticale n'est jamais une horizontale du mur (arête d'angle, descente d'eau)
	const montant = Math.sin(20 * RAD);
	const vots = [];
	for (const s of trachs) {
		if (escart(s, dv) < montant) continue;
		const a = esc(s.n, e1),
			b = esc(s.n, e2);
		if (a * a + b * b < 0.03) continue; // trait couché sur l'horizon : il ne dit rien du mur
		const dx = Math.max(zona[0] - s.x[1], 0, s.x[0] - zona[2]),
			dy = Math.max(zona[1] - s.y[1], 0, s.y[0] - zona[3]) * cam.r;
		const pes = s.long * Math.exp(-(dx * dx) / (2 * sx * sx) - (dy * dy) / (2 * sy * sy));
		if (pes < 1e-6) continue;
		let phi = Math.atan2(-a, b) / RAD;
		if (phi > 90) phi -= 180;
		if (phi <= -90) phi += 180;
		vots.push({ phi, pes, a, b, xm: (s.x[0] + s.x[1]) / 2 });
	}
	const res = { phi: 0, nombre: 0, part: 0, fisable: false, autras: [] };
	if (!vots.length) return res;
	const tot = vots.reduce((t, v) => t + v.pes, 0);
	// le vote : un casier par demi-degré, adouci sur ±4° (un trait court ne donne l'angle qu'à 2 ou 3° près ;
	// les angles bouclent à ±90°)
	const N = 360,
		urna = new Float64Array(N),
		lis = new Float64Array(N);
	for (const v of vots) urna[Math.min(N - 1, Math.floor((v.phi + 90) * 2))] += v.pes;
	for (let i = 0; i < N; i++) for (let k = -9; k <= 9; k++) lis[i] += Math.exp(-(k * k) / 18) * urna[(i + k + N) % N];
	const escartA = (p, q) => {
		const d = Math.abs(p - q) % 180;
		return d > 90 ? 180 - d : d;
	};
	// affinage d'un sommet par moindres carrés : (cos, sin) de l'angle le plus perpendiculaire à tous les (a, b)
	const afinar = (phi) => {
		let dins = [];
		for (const marge of [4.5, 3.5, 3]) {
			dins = vots.filter((v) => escartA(v.phi, phi) < marge);
			if (!dins.length) break;
			let aa = 0,
				ab = 0,
				bb = 0;
			for (const v of dins) {
				aa += v.pes * v.a * v.a;
				ab += v.pes * v.a * v.b;
				bb += v.pes * v.b * v.b;
			}
			const th = 0.5 * Math.atan2(2 * ab, aa - bb) + Math.PI / 2; // axe de moindre inertie
			let p = Math.atan2(Math.sin(th), Math.cos(th)) / RAD;
			if (p > 90) p -= 180;
			if (p <= -90) p += 180;
			phi = p;
		}
		const pes = dins.reduce((t, v) => t + v.pes, 0);
		return {
			phi,
			nombre: dins.length,
			suport: pes,
			part: pes / tot,
			xm: dins.reduce((t, v) => t + v.pes * v.xm, 0) / (pes || 1)
		};
	};
	// le sommet le plus haut, puis les suivants s'ils sont nets et à plus de 10° des précédents
	const cims = [];
	let primier = 0;
	for (let tour = 0; tour < 3; tour++) {
		let cim = 0,
			on = -1;
		for (let i = 0; i < N; i++) if (lis[i] > cim) [cim, on] = [lis[i], i];
		if (on < 0 || (tour && cim < 0.3 * primier)) break;
		if (!tour) primier = cim;
		const c = afinar(on / 2 - 90 + 0.25);
		if (!cims.some((x) => escartA(x.phi, c.phi) < 8)) cims.push(c);
		for (let k = -20; k <= 20; k++) lis[(on + k + N) % N] = 0;
	}
	// Près d'un angle de bâtiment, deux murs votent : l'un à gauche de l'endroit tracé, l'autre à droite. L'arête
	// d'angle est le plus long montant entre les deux ; le mur retenu est celui qui est du même côté qu'elle que le tracé.
	const zc = (zona[0] + zona[2]) / 2,
		yc = (zona[1] + zona[3]) / 2;
	const passaDavant = (A, B) => {
		if (B.nombre < 3 || B.part < 0.3 * A.part || (A.xm - zc) * (B.xm - zc) >= 0) return false;
		{
			const x0 = Math.min(A.xm, B.xm),
				x1 = Math.max(A.xm, B.xm);
			// les montants alignés forment une même arête : on les regroupe par leur position à la hauteur du tracé
			const montants = [];
			for (const m of trachs) {
				if (escart(m, dv) > Math.sin(3 * RAD)) continue;
				const [xa, ya, xb, yb] = m.p;
				if (Math.abs(yb - ya) < 1e-9) continue;
				const x = xa + ((yc - ya) * (xb - xa)) / (yb - ya);
				if (x > x0 && x < x1) montants.push({ x, long: m.long, y0: m.y[0], y1: m.y[1] });
			}
			montants.sort((m, n) => m.x - n.x);
			let aresta = null,
				g = null;
			const clavar = () => {
				// une arête d'angle court sur toute la hauteur du mur : elle passe à la hauteur du tracé
				if (g && g.long > 0.12 * cam.r && g.y0 - 0.03 < yc && g.y1 + 0.03 > yc && (!aresta || g.long > aresta.long))
					aresta = g;
			};
			for (const m of montants) {
				if (g && m.x - g.fin < 0.008) {
					g.x = (g.x * g.long + m.x * m.long) / (g.long + m.long);
					g.long += m.long;
					g.fin = m.x;
					g.y0 = Math.min(g.y0, m.y0);
					g.y1 = Math.max(g.y1, m.y1);
				} else {
					clavar();
					g = { ...m, fin: m.x };
				}
			}
			clavar();
			return !!aresta && (aresta.x < zona[0] || aresta.x > zona[2]) && (B.xm - aresta.x) * (zc - aresta.x) > 0;
		}
	};
	for (let j = 1; j < cims.length; j++)
		if (passaDavant(cims[0], cims[j])) {
			cims.unshift(...cims.splice(j, 1));
			break;
		}
	const [c, ...autras] = cims;
	// Trop peu de lignes (une porte de planches, un crépi nu) : on ne croit pas deux traits isolés. Le mur est
	// supposé de face, ce que la page dit ; ce que les traits suggéraient reste proposé comme autre orientation.
	if (c.nombre < 4 || c.suport < 0.06 || c.part <= 0.12) return { ...res, autras: cims.map((x) => x.phi) };
	return {
		phi: c.phi,
		nombre: c.nombre,
		part: c.part,
		fisable: true,
		autras: autras.map((x) => x.phi)
	};
}

/* ------------------------------------------------------------------ 4. le rectangle couché sur le mur */

/**
 * Le vrai rectangle du mur (vertical, tourné de `phi`) dont la médiane horizontale a la largeur du rectangle tracé
 * et la médiane verticale sa hauteur, centré au même endroit.
 * Renvoie { quad: quatre coins [x, y] en fractions (haut gauche, haut droit, bas droit, bas gauche),
 * proporcion: largeur réelle / hauteur réelle }.
 */
export function quadParet(cam, dv, phi, zona) {
	const q = quadre(cam, dv, phi, zona);
	return {
		quad: [q.punt(-q.a, -q.b), q.punt(q.a, -q.b), q.punt(q.a, q.b), q.punt(-q.a, q.b)],
		proporcion: q.a / q.b
	};
}

// Le repère du mur à l'endroit tracé : centre, demi-largeur a et demi-hauteur b réelles (la profondeur du centre
// vaut 1), et punt(u, v) = le point du mur à u vers la droite et v vers le bas, vu sur la photo (null derrière l'appareil).
function quadre(cam, dv, phi, zona) {
	let dh = orizontala(dv, phi),
		dw = dv;
	const [X, Y] = versCam(cam, (zona[0] + zona[2]) / 2, (zona[1] + zona[3]) / 2);
	// sens : dh vers la droite de l'image, dw vers le bas
	if (dh[0] - X * dh[2] < 0) dh = [-dh[0], -dh[1], -dh[2]];
	if (dw[1] - Y * dw[2] < 0) dw = [-dw[0], -dw[1], -dw[2]];
	const lN = (zona[2] - zona[0]) / cam.f,
		hN = ((zona[3] - zona[1]) * cam.r) / cam.f;
	const kh = Math.max(1e-9, dh[0] - X * dh[2]),
		kv = Math.max(1e-9, dw[1] - Y * dw[2]);
	const a = lN / (kh + Math.sqrt(kh * kh + lN * lN * dh[2] * dh[2])),
		b = hN / (kv + Math.sqrt(kv * kv + hN * hN * dw[2] * dw[2]));
	const prof = (u, v) => 1 + u * dh[2] + v * dw[2];
	const punt = (u, v) => {
		const z = prof(u, v);
		return z > 0.02 ? versFoto(cam, (X + u * dh[0] + v * dw[0]) / z, (Y + u * dh[1] + v * dw[1]) / z) : null;
	};
	return { a, b, punt, prof };
}

/**
 * Une grille posée sur le mur autour de l'endroit tracé (cases carrées, hautes comme le rectangle) : la preuve
 * à regarder. Elle doit suivre les assises de pierre, les linteaux, les montants des fenêtres.
 * Renvoie des traits [x1, y1, x2, y2] en fractions de la photo.
 */
export function grasilha(cam, dv, phi, zona, n = 5) {
	const q = quadre(cam, dv, phi, zona);
	const pas = 2 * q.b,
		bout = n * pas,
		trachs = [];
	const trach = (p0, p1) => {
		// on ne garde que la partie devant l'appareil
		let t0 = 0,
			t1 = 1;
		const z0 = q.prof(...p0),
			z1 = q.prof(...p1),
			lim = 0.12;
		if (z0 < lim && z1 < lim) return;
		if (z0 < lim) t0 = (lim - z0) / (z1 - z0);
		if (z1 < lim) t1 = (lim - z0) / (z1 - z0);
		const a = q.punt(p0[0] + t0 * (p1[0] - p0[0]), p0[1] + t0 * (p1[1] - p0[1])),
			b = q.punt(p0[0] + t1 * (p1[0] - p0[0]), p0[1] + t1 * (p1[1] - p0[1]));
		if (a && b) trachs.push([a[0], a[1], b[0], b[1]]);
	};
	for (let i = -n; i <= n; i++) {
		trach([-bout, (i + 0.5) * pas], [bout, (i + 0.5) * pas]);
		trach([(i + 0.5) * pas, -bout], [(i + 0.5) * pas, bout]);
	}
	return trachs;
}

/**
 * Tout d'un coup, pour la page : la perspective du mur à l'endroit `zona`.
 * `phi` donné = orientation réglée à la main ; sinon elle est calculée.
 */
export function perspectiva(trachs, cam, zona, phi) {
	const v = vertical(trachs);
	const p = phi == null ? paret(trachs, cam, v.d, zona) : { phi, fisable: true, manual: true };
	return {
		dv: v.d,
		montants: v.nombre,
		...p,
		...quadParet(cam, v.d, p.phi, zona)
	};
}

/* ------------------------------------------------------------------ 5. poser un dessin à plat sur quatre coins */

/** Homographie 3 × 3 (ligne par ligne, h33 = 1) qui envoie quatre points sur quatre autres ; null si dégénérée. */
export function omografia(src, dst) {
	const A = [];
	for (let i = 0; i < 4; i++) {
		const [x, y] = src[i],
			[u, v] = dst[i];
		A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
		A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
	}
	for (let c = 0; c < 8; c++) {
		let p = c;
		for (let l = c + 1; l < 8; l++) if (Math.abs(A[l][c]) > Math.abs(A[p][c])) p = l;
		if (Math.abs(A[p][c]) < 1e-12) return null;
		[A[c], A[p]] = [A[p], A[c]];
		for (let l = 0; l < 8; l++) {
			if (l === c) continue;
			const k = A[l][c] / A[c][c];
			for (let j = c; j < 9; j++) A[l][j] -= k * A[c][j];
		}
	}
	const h = A.map((l, i) => l[8] / l[i]);
	return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

/** Image d'un point par une homographie. */
export function aplicar(H, [x, y]) {
	const w = H[6] * x + H[7] * y + H[8];
	return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
}

/** La valeur CSS `matrix3d(…)` qui pose un bloc de l × h pixels (origine en haut à gauche) sur quatre coins en pixels. */
export function matrix3d(l, h, coins) {
	const H = omografia(
		[
			[0, 0],
			[l, 0],
			[l, h],
			[0, h]
		],
		coins
	);
	if (!H) return 'none';
	const v = [H[0], H[3], 0, H[6], H[1], H[4], 0, H[7], 0, 0, 1, 0, H[2], H[5], 0, H[8]];
	return `matrix3d(${v.map((x) => +x.toFixed(8)).join(',')})`;
}

/** Vrai si le point est dans le quadrilatère (convexe, coins dans l'ordre). */
export function dins(quad, [x, y]) {
	let signe = 0;
	for (let i = 0; i < 4; i++) {
		const [ax, ay] = quad[i],
			[bx, by] = quad[(i + 1) % 4];
		const s = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
		if (s !== 0) {
			if (signe && Math.sign(s) !== signe) return false;
			signe = Math.sign(s);
		}
	}
	return true;
}
