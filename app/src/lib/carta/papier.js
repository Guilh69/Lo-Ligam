// La couche des dialectes de la carte en papier découpé (essai /ensag/carta-papier).
// (Romain, 08-11 : « l'idée est là… pas du tout convaincu par les zones de
// transition, en plus ça lag. Il faut quelque chose de plus quali et original.
// J'imagine une transition douce, et pourquoi pas un fondu de couleur cohérent ».)
//
// Ce que ça change par rapport à la première mouture :
//   - les zones de transition ne sont plus des confettis ni des carreaux :
//     la couleur des deux parlers se fond, soit serrée le long de la
//     frontière (« costura », essayée d'abord), soit sur toute la bande de
//     vrai mélange des parlers (« zona », la bande des données) ;
//   - le fondu d'une bande est dessiné quand la page est calme, jamais au
//     milieu d'un déplacement ou de l'animation : plus de saccades ;
//   - il ne couvre que ce qui est à l'écran, aux couleurs pleines (pas de
//     empilements translucides : la bave brunâtre vient de là) ;
//   - la coulée de chaque pièce n'est plus recalculée image par image :
//     ses contours sont calculés une fois (en coordonnées de la carte, pas
//     de l'écran), rangés par avance, puis simplement remplis pendant
//     l'animation, à toute échelle.
//
// Un seul fichier, une couche Leaflet autonome, qui lit les mêmes données que
// la vraie carte (/data/dialectes.geojson, transicions.geojson, limits-carta).
import { proj0 } from './projeccion.js';
import { CARTE, texteSur } from '../styles/palette.js';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const lis = (t) => t * t * (3 - 2 * t); // arrivée et fin douces
const mai = (t) => t * t * t * (t * (t * 6 - 15) + 10); // encore plus doux (le fondu)

export const MODES = ['costura', 'zona'];

// L'ordre de la pile (le dernier est dessus : son ombre tombe sur les autres)
const PILE = ['gas', 'lem', 'auv', 'viv', 'pro', 'lan'];
// L'ordre dans lequel les pièces se mettent à couler (le languedocien d'abord)
const DEPART = { lan: 0, gas: 1, pro: 2, auv: 3, lem: 4, viv: 5 };
const DUREE = 2.6; // s : une pièce occupe tout son périmètre
const PAS = 0.2; // s : décalage entre deux pièces
const DUREE_FIN = DUREE + PAS * 5 + 0.2; // coulée finie (les transitions viennent ensuite)
const DUREE_TRANS = 0.9; // s : le fondu se pose
const TOTAL = DUREE_FIN + DUREE_TRANS + 0.2;
const LOBES = 0.2; // à quel point le front est irrégulier (0 = rond comme un cercle)
const NIVELS = 14; // contours de la coulée gardés en mémoire par pièce
const COSTURA = 15; // px de chaque côté de la frontière où les couleurs se fondent (mode costura)

// Le nom d'un dialecte posé sur sa pièce, un peu à part de la donnée (comme colaDonadas.js)
const ETI_NOM = { lan: [2.2, 43.95] };
// Les villes dites sur la carte d'essai (noms déjà publiés sur le site : LUOCS)
const VILES = ['Tolosa', 'Bordèu', 'Montpelhièr', 'Marselha', 'Niça', 'Clarmont-Ferrand', 'Limòtges', 'Pau', 'Gap', 'Valença', 'Nimes', 'Tolon'];

const json = (u) => fetch(u).then((r) => (r.ok ? r.json() : null));

/* ---------- Géométrie ---------- */
const anelsDe = (g) => (g.type === 'Polygon' ? g.coordinates : g.coordinates.flat());
const pip = (f, x, y) => {
	// point dans le premier anneau (f : x,y aplatis, mêmes unités que x et y)
	let dedins = false;
	const n = f.length / 2;
	for (let i = 0, j = n - 1; i < n; j = i++) {
		const xi = f[2 * i],
			yi = f[2 * i + 1],
			xj = f[2 * j],
			yj = f[2 * j + 1];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dedins = !dedins;
	}
	return dedins;
};

/* ---------- Le tas (file de priorité) pour la distance « à pied » ---------- */
function tas() {
	const c = [],
		v = [];
	return {
		get taille() {
			return v.length;
		},
		pousser(cout, i) {
			let k = v.length;
			c.push(cout);
			v.push(i);
			while (k > 0) {
				const p = (k - 1) >> 1;
				if (c[p] <= c[k]) break;
				[c[p], c[k]] = [c[k], c[p]];
				[v[p], v[k]] = [v[k], v[p]];
				k = p;
			}
		},
		tirer() {
			const cout = c[0],
				i = v[0],
				dc = c.pop(),
				dv = v.pop();
			if (v.length) {
				c[0] = dc;
				v[0] = dv;
				let k = 0;
				for (;;) {
					const g = 2 * k + 1,
						d = g + 1;
					let m = k;
					if (g < v.length && c[g] < c[m]) m = g;
					if (d < v.length && c[d] < c[m]) m = d;
					if (m === k) break;
					[c[m], c[k]] = [c[k], c[m]];
					[v[m], v[k]] = [v[k], v[m]];
					k = m;
				}
			}
			return [cout, i];
		}
	};
}

/* ---------- Le champ de coulée d'une zone (une fois, en coordonnées du zoom 0) ---------- */
const PAD = 3;
function preparerCoulee(map, zn) {
	let x0 = Infinity,
		y0 = Infinity,
		x1 = -Infinity,
		y1 = -Infinity;
	for (const a of zn.anels) {
		const f = proj0(map, a);
		for (let i = 0; i < a.length; i++) {
			x0 = Math.min(x0, f[2 * i]);
			x1 = Math.max(x1, f[2 * i]);
			y0 = Math.min(y0, f[2 * i + 1]);
			y1 = Math.max(y1, f[2 * i + 1]);
		}
	}
	const cell = Math.max(x1 - x0, y1 - y0) / 170;
	const w = Math.ceil((x1 - x0) / cell) + 2 * PAD,
		h = Math.ceil((y1 - y0) / cell) + 2 * PAD;
	// 1. le masque de la zone
	const cv = document.createElement('canvas');
	cv.width = w;
	cv.height = h;
	const g = cv.getContext('2d', { willReadFrequently: true });
	g.setTransform(1 / cell, 0, 0, 1 / cell, PAD - x0 / cell, PAD - y0 / cell);
	g.fillStyle = '#000';
	const c = new Path2D();
	for (const a of zn.anels) {
		const f = proj0(map, a);
		c.moveTo(f[0], f[1]);
		for (let i = 1; i < a.length; i++) c.lineTo(f[2 * i], f[2 * i + 1]);
		c.closePath();
	}
	g.fill(c, 'evenodd');
	const px = g.getImageData(0, 0, w, h).data;
	const dedans = new Uint8Array(w * h);
	for (let i = 0; i < w * h; i++) dedans[i] = px[4 * i + 3] > 127 ? 1 : 0;
	// 2. le masque gonflé de deux cellules (le bord exact est coupé plus tard
	//    par le tracé vrai de la zone : rien ne manque au ras du bord)
	let ok = dedans;
	for (let k = 0; k < 2; k++) {
		const n = new Uint8Array(w * h);
		for (let j = 0; j < h; j++)
			for (let i = 0; i < w; i++) {
				const q = j * w + i;
				n[q] = ok[q] || (i > 0 && ok[q - 1]) || (i < w - 1 && ok[q + 1]) || (j > 0 && ok[q - w]) || (j < h - 1 && ok[q + w]) ? 1 : 0;
			}
		ok = n;
	}
	// 3. le cœur : la cellule de la zone la plus proche de l'étiquette
	const e = map.project([zn.eti[1], zn.eti[0]], 0);
	const gx = (e.x - x0) / cell + PAD - 0.5,
		gy = (e.y - y0) / cell + PAD - 0.5;
	let cœur = -1,
		meilleur = Infinity;
	for (let j = 0; j < h; j++)
		for (let i = 0; i < w; i++)
			if (dedans[j * w + i]) {
				const d = (i - gx) ** 2 + (j - gy) ** 2;
				if (d < meilleur) (meilleur = d), (cœur = j * w + i);
			}
	// 4. la distance « à pied » depuis le cœur (Dijkstra, huit voisins)
	const dist = new Float64Array(w * h).fill(Infinity);
	const T = tas();
	dist[cœur] = 0;
	T.pousser(0, cœur);
	const voisins = [
		[-1, 0, 1],
		[1, 0, 1],
		[0, -1, 1],
		[0, 1, 1],
		[-1, -1, 1.4142],
		[1, -1, 1.4142],
		[-1, 1, 1.4142],
		[1, 1, 1.4142]
	];
	let garde = w * h * 40;
	while (T.taille && garde-- > 0) {
		const [d, q] = T.tirer();
		if (d > dist[q]) continue;
		const qi = q % w,
			qj = (q - qi) / w;
		for (const [di, dj, pas] of voisins) {
			const i = qi + di,
				j = qj + dj;
			if (i < 0 || j < 0 || i >= w || j >= h) continue;
			const r = j * w + i;
			if (!ok[r]) continue;
			const nd = d + pas;
			if (nd < dist[r]) (dist[r] = nd), T.pousser(nd, r);
		}
	}
	let dmax = 0;
	for (let i = 0; i < w * h; i++) if (dedans[i] && dist[i] < Infinity) dmax = Math.max(dmax, dist[i]);
	// 5. les champs : distance normalisée, et deux bruits lents qui font onduler le front
	const dn = new Float32Array(w * h),
		n1 = new Float32Array(w * h),
		n2 = new Float32Array(w * h);
	for (let j = 0; j < h; j++)
		for (let i = 0; i < w; i++) {
			const q = j * w + i;
			dn[q] = !ok[q] ? 1e3 : dist[q] === Infinity ? 1.15 : dist[q] / dmax;
			n1[q] = (Math.sin(i * 0.075 + j * 0.021 + 1.1) + Math.sin(j * 0.083 - i * 0.037 + 2.4) + Math.sin((i + j) * 0.052 + 0.3)) / 3;
			n2[q] = (Math.sin(i * 0.061 - j * 0.047 + 4.0) + Math.sin(j * 0.071 + i * 0.029 + 0.8) + Math.sin((i - j) * 0.044 + 2.9)) / 3;
		}
	return { x0, y0, cell, w, h, dn, n1, n2, champ: new Float32Array(w * h) };
}

/* ---------- Lignes de niveau (marching squares) → un tracé fermé et lissé ---------- */
// Dedans = champ < niveau. Le tableau est supposé bordé de valeurs hautes.
function ligneDeNiveau(f, w, h, niveau, ax, bx, ay, by) {
	const adj = new Map();
	const pos = new Map();
	const clef = (i, j, vert) => (j * w + i) * 2 + (vert ? 1 : 0);
	const point = (i, j, vert) => {
		const k = clef(i, j, vert);
		let p = pos.get(k);
		if (!p) {
			const a = f[j * w + i],
				b = vert ? f[(j + 1) * w + i] : f[j * w + i + 1];
			const t = clamp((niveau - a) / (b - a || 1e-9));
			p = vert ? [ax * i + bx, ay * (j + t) + by] : [ax * (i + t) + bx, ay * j + by];
			pos.set(k, p);
		}
		return k;
	};
	const lier = (k1, k2) => {
		(adj.get(k1) ?? adj.set(k1, []).get(k1)).push(k2);
		(adj.get(k2) ?? adj.set(k2, []).get(k2)).push(k1);
	};
	for (let j = 0; j < h - 1; j++)
		for (let i = 0; i < w - 1; i++) {
			const tl = f[j * w + i] < niveau,
				tr = f[j * w + i + 1] < niveau,
				br = f[(j + 1) * w + i + 1] < niveau,
				bl = f[(j + 1) * w + i] < niveau;
			const cas = (tl ? 1 : 0) | (tr ? 2 : 0) | (br ? 4 : 0) | (bl ? 8 : 0);
			if (cas === 0 || cas === 15) continue;
			const T = () => point(i, j, false),
				B = () => point(i + 0, j + 1, false),
				L = () => point(i, j, true),
				R = () => point(i + 1, j, true);
			switch (cas) {
				case 1:
				case 14:
					lier(L(), T());
					break;
				case 2:
				case 13:
					lier(T(), R());
					break;
				case 3:
				case 12:
					lier(L(), R());
					break;
				case 4:
				case 11:
					lier(R(), B());
					break;
				case 6:
				case 9:
					lier(T(), B());
					break;
				case 7:
				case 8:
					lier(L(), B());
					break;
				case 5:
					lier(L(), T());
					lier(R(), B());
					break;
				case 10:
					lier(T(), R());
					lier(L(), B());
					break;
			}
		}
	const chemin = new Path2D();
	const vus = new Set();
	for (const [k0, nb] of adj) {
		if (vus.has(k0) || nb.length !== 2) continue;
		const pts = [];
		let prec = -1,
			k = k0;
		for (let s = 0; s < 100000; s++) {
			vus.add(k);
			pts.push(pos.get(k));
			const v = adj.get(k);
			if (!v || v.length !== 2) break;
			const suiv = v[0] !== prec ? v[0] : v[1];
			prec = k;
			k = suiv;
			if (k === k0 || vus.has(k)) break;
		}
		const n = pts.length;
		if (n < 3) continue;
		// lissage : on passe par les milieux, les points sont les guides
		const milieu = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
		const m0 = milieu(pts[n - 1], pts[0]);
		chemin.moveTo(m0[0], m0[1]);
		for (let i = 0; i < n; i++) {
			const m = milieu(pts[i], pts[(i + 1) % n]);
			chemin.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
		}
		chemin.closePath();
	}
	return chemin;
}

// les contours de la coulée d'une pièce, calculés une fois pour toutes les vues
// (en coordonnées de la carte, jamais de l'écran : mêmes à toute échelle)
function contourNivel(C, k) {
	const { w, h, dn, n1, n2, champ, cell, x0, y0 } = C;
	const p = (k + 0.5) / NIVELS;
	const ph = p * 1.6,
		cs = Math.cos(ph),
		sn = Math.sin(ph);
	for (let q = 0; q < w * h; q++) champ[q] = dn[q] < 100 ? dn[q] + LOBES * (n1[q] * cs + n2[q] * sn) : 1e3;
	const niveau = lerp(-LOBES - 0.02, 1.15 + LOBES + 0.02, lis(p));
	return ligneDeNiveau(champ, w, h, niveau, cell, x0 + (0.5 - PAD) * cell, cell, y0 + (0.5 - PAD) * cell);
}

/* ---------- Distance (en cellules) jusqu'à la zone la plus proche, par deux passes ---------- */
function distance(masque, w, h) {
	const d = new Float32Array(w * h);
	for (let i = 0; i < w * h; i++) d[i] = masque[i] ? 0 : 1e6;
	const a = 1,
		b = 1.4142;
	for (let j = 0; j < h; j++)
		for (let i = 0; i < w; i++) {
			const q = j * w + i;
			let v = d[q];
			if (i > 0) v = Math.min(v, d[q - 1] + a);
			if (j > 0) {
				v = Math.min(v, d[q - w] + a);
				if (i > 0) v = Math.min(v, d[q - w - 1] + b);
				if (i < w - 1) v = Math.min(v, d[q - w + 1] + b);
			}
			d[q] = v;
		}
	for (let j = h - 1; j >= 0; j--)
		for (let i = w - 1; i >= 0; i--) {
			const q = j * w + i;
			let v = d[q];
			if (i < w - 1) v = Math.min(v, d[q + 1] + a);
			if (j < h - 1) {
				v = Math.min(v, d[q + w] + a);
				if (i < w - 1) v = Math.min(v, d[q + w + 1] + b);
				if (i > 0) v = Math.min(v, d[q + w - 1] + b);
			}
			d[q] = v;
		}
	return d;
}

// une couleur de la palette (« #rrggbb ») → [r, g, b]
const rgb = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

/* ---------- La couche Leaflet ---------- */
export function crearColaPapier(L, { mode = 'dous' } = {}) {
	const Cola = L.Layer.extend({
		options: { pane: 'papier', padding: 0.25 },

		initialize() {
			this._mode = mode;
			this._t0 = null;
			this._calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
			this._fige = null; // un instant figé (pour les captures d'essai)
		},

		onAdd(map) {
			if (!map.getPane('papier')) {
				const p = map.createPane('papier');
				p.style.zIndex = '300';
				p.style.pointerEvents = 'none';
			}
			this._cv = L.DomUtil.create('canvas', 'cola-papier leaflet-zoom-animated', map.getPane('papier'));
			this._cx = this._cv.getContext('2d');
			this._tmp = document.createElement('canvas');
			this._tx = this._tmp.getContext('2d');
			Promise.all([json('/data/dialectes.geojson'), json('/data/transicions.geojson'), json('/data/limits-carta.json'), import('$lib/acuelh/carta-estelas.js')]).then(
				([dial, trans, lim, est]) => {
					if (!this._map) return;
					this._G = {
						zonas: dial.features.map((f) => ({
							kod: f.properties.kod,
							nom: f.properties.oc,
							eti: ETI_NOM[f.properties.kod] ?? f.properties.eti,
							anels: anelsDe(f.geometry),
							color: CARTE.dialectes[f.properties.kod]
						})),
						bandas: trans.features.map((f) => ({ paire: f.properties.paire.split('/'), larg: f.properties.larg, anels: anelsDe(f.geometry) })),
						dom: lim?.domeni?.anels ?? [],
						viles: est.LUOCS.filter((l) => VILES.includes(l[2])).map((l) => ({ lon: l[0], lat: l[1], nom: l[2] }))
					};
					for (const z of this._G.zonas) z.rang = DEPART[z.kod] ?? 0;
					this._G.zonas.sort((a, b) => PILE.indexOf(a.kod) - PILE.indexOf(b.kod));
					this._update();
					// les fronts de coulée se préparent à l'écart des images d'animation,
					// puis la coulée démarresse dès que tout est prêt
					this._preparar().then(() => {
						if (this._map) this.lancer();
					});
				}
			);
			document.fonts?.load('700 12px Luciole').then(() => this._dessiner(), () => {});
		},

		onRemove() {
			cancelAnimationFrame(this._raf);
			L.DomUtil.remove(this._cv);
		},

		getEvents() {
			const ev = { viewreset: this._update, moveend: this._update, resize: this._update, zoom: this._onZoom };
			if (this._zoomAnimated) ev.zoomanim = this._onAnimZoom;
			return ev;
		},

		/* --- commandes --- */
		mode(m) {
			this._mode = m;
			this._planjarFondus();
			this._dessiner();
		},
		// rejoue la coulée ; t = un instant figé (secondes), pour les captures
		lancer(t = null) {
			cancelAnimationFrame(this._raf);
			this._fige = t;
			// un instant figé sert aux captures : les fondus se dessinent
			// séance tenante, sans attendre un moment calme
			if (t !== null && this._G?.dom_c) {
				this._fondPend = [];
				for (const b of this._G.bandas) {
					b.img = null;
					this._rasterFondu(b);
				}
			}
			if (t !== null) {
				this._t0 = null;
				return this._dessiner();
			}
			if (this._calme) return ((this._t0 = null), this._dessiner());
			this._t0 = performance.now();
			const pas = () => {
				const s = (performance.now() - this._t0) / 1000;
				if (s >= TOTAL) {
					this._t0 = null;
					return this._dessiner();
				}
				this._dessiner();
				this._raf = requestAnimationFrame(pas);
			};
			this._raf = requestAnimationFrame(pas);
		},
		_temps() {
			if (this._fige !== null) return this._fige;
			return this._t0 === null ? Infinity : (performance.now() - this._t0) / 1000;
		},

		/* --- préparation des fronts de coulée, hors animation --- */
		_preparar() {
			const zonas = this._G.zonas.filter((z) => z.anels.length);
			return new Promise((fin) => {
				const etape = () => {
					const zn = zonas.find((z) => !z.coulee || (z.fronts?.length ?? 0) < NIVELS);
					if (!zn || !this._map) {
						this._dessiner();
						return fin();
					}
					if (!zn.coulee) zn.coulee = preparerCoulee(this._map, zn);
					else (zn.fronts ??= []).push(contourNivel(zn.coulee, zn.fronts.length));
					setTimeout(etape, 0);
				};
				setTimeout(etape, 0);
			});
		},

		/* --- vue : tracés, à chaque déplacement ou zoom --- */
		_onAnimZoom(e) {
			this._transformer(e.center, e.zoom);
		},
		_onZoom() {
			this._transformer(this._map.getCenter(), this._map.getZoom());
		},
		_transformer(centre, zoom) {
			const map = this._map;
			if (!this._centre) return;
			const echelle = map.getZoomScale(zoom, this._zoom),
				demi = map.getSize().multiplyBy(0.5 + this.options.padding),
				pointCentre = map.project(this._centre, zoom),
				decal = demi.multiplyBy(-echelle).add(pointCentre).subtract(map._getNewPixelOrigin(centre, zoom));
			L.DomUtil.setTransform(this._cv, decal, echelle);
		},
		_update() {
			const map = this._map;
			if (!map || !this._cv || !this._G) return;
			const p = this.options.padding,
				taille = map.getSize();
			const min = map.containerPointToLayerPoint(taille.multiplyBy(-p)).round();
			const tal = taille.multiplyBy(1 + 2 * p).round();
			this._centre = map.getCenter();
			this._zoom = map.getZoom();
			this._min = min;
			L.DomUtil.setPosition(this._cv, min);
			const dpr = Math.min(devicePixelRatio || 1, 2);
			this._dpr = dpr;
			for (const c of [this._cv, this._tmp]) {
				c.width = Math.round(tal.x * dpr);
				c.height = Math.round(tal.y * dpr);
			}
			this._cv.style.width = tal.x + 'px';
			this._cv.style.height = tal.y + 'px';
			const o = map.getPixelOrigin().add(min);
			const z = this._zoom,
				s2 = Math.pow(2, z);
			this._o = o;
			this._s2 = s2;
			this._mPx = 112600 / s2; // mètres par pixel vers 44° N
			const cami = (anels, c = new Path2D()) => {
				for (const a of anels) {
					const f = proj0(map, a);
					c.moveTo(f[0] * s2 - o.x, f[1] * s2 - o.y);
					for (let i = 1; i < a.length; i++) c.lineTo(f[2 * i] * s2 - o.x, f[2 * i + 1] * s2 - o.y);
					c.closePath();
				}
				return c;
			};
			const boite = (anels) => {
				let x0 = Infinity,
					y0 = Infinity,
					x1 = -Infinity,
					y1 = -Infinity;
				for (const a of anels) {
					const f = proj0(map, a);
					for (let i = 0; i < a.length; i++) {
						const x = f[2 * i] * s2 - o.x,
							y = f[2 * i + 1] * s2 - o.y;
						x0 = Math.min(x0, x);
						x1 = Math.max(x1, x);
						y0 = Math.min(y0, y);
						y1 = Math.max(y1, y);
					}
				}
				return [x0, y0, x1, y1];
			};
			const G = this._G;
			G.dom_c = cami(G.dom);
			for (const zn of G.zonas) {
				zn.c = cami(zn.anels);
				zn.bbox = boite(zn.anels);
				const q = map.project([zn.eti[1], zn.eti[0]], z);
				zn.etiPx = [q.x - o.x, q.y - o.y];
			}
			for (const b of G.bandas) {
				b.c = cami(b.anels);
				b.bbox = boite(b.anels);
				b.largPx = (b.larg * 1000) / this._mPx;
			}
			for (const v of G.viles) {
				const q = map.project([v.lat, v.lon], z);
				v.px = [q.x - o.x, q.y - o.y];
			}
			// les fondus sont refaits pour cette vue, un par moment calme
			this._planjarFondus();
			this._dessiner();
		},

		/* --- les fondus : dessinés quand la page est calme, jamais au milieu d'un geste --- */
		_planjarFondus() {
			const G = this._G;
			if (!G) return;
			for (const b of G.bandas) b.img = null;
			this._fondPend = G.bandas.slice();
			this._contunharFondus();
		},
		_contunharFondus() {
			if (!this._fondPend?.length) return;
			const repaus = window.requestIdleCallback
				? (cb) => requestIdleCallback(cb, { timeout: 400 })
				: (cb) => setTimeout(cb, 40);
			repaus(() => {
				if (!this._map) return;
				const b = this._fondPend.shift();
				if (b) this._rasterFondu(b);
				this._dessiner();
				if (this._fondPend.length) this._contunharFondus();
			});
		},

		/* --- le fondu d'une bande : une fois par vue, sur ce qui est à l'écran --- */
		_rasterFondu(b) {
			if (b.img) return;
			const par = Object.fromEntries(this._G.zonas.map((z) => [z.kod, z]));
			const A = par[b.paire[0]],
				B = par[b.paire[1]];
			if (!A || !B || !b.c || !b.bbox) return;
			const tail = this._map.getSize();
			const costura = this._mode === 'costura';
			const [x0, y0, x1, y1] = b.bbox;
			// la fenêtre : la bande réduite à l'écran (jamais la carte entière),
			// avec la marge où le mélange peut encore se voir
			const marg = costura ? COSTURA * 2.5 : Math.max(b.largPx * 0.2, 24);
			const vx0 = Math.max(x0 - marg, 0),
				vy0 = Math.max(y0 - marg, 0),
				vx1 = Math.min(x1 + marg, tail.x),
				vy1 = Math.min(y1 + marg, tail.y);
			if (vx1 <= vx0 || vy1 <= vy0) return;
			const aire = (vx1 - vx0) * (vy1 - vy0);
			if (aire > 3600000) return; // trop zoomé pour que la couture reste juste
			const c = aire > 120000 ? 3 : 2; // pixels de carte par cellule
			const bx = Math.floor(vx0),
				by = Math.floor(vy0);
			const gw = Math.ceil((vx1 - bx) / c) + 2,
				gh = Math.ceil((vy1 - by) / c) + 2;
			// la distance à chaque parler, dans la fenêtre seule
			const lire = (chemin, flou) => {
				const cv = document.createElement('canvas');
				cv.width = gw;
				cv.height = gh;
				const g = cv.getContext('2d', { willReadFrequently: true });
				g.filter = `blur(${(flou / c).toFixed(2)}px)`;
				g.setTransform(1 / c, 0, 0, 1 / c, -bx / c, -by / c);
				g.fillStyle = '#000';
				g.fill(chemin, 'evenodd');
				const px = g.getImageData(0, 0, gw, gh).data;
				const r = new Float32Array(gw * gh);
				for (let i = 0; i < gw * gh; i++) r[i] = px[4 * i + 3] / 255;
				return r;
			};
			const dur = (chemin) => {
				const r = lire(chemin, 0.01);
				const n = new Uint8Array(gw * gh);
				for (let i = 0; i < gw * gh; i++) n[i] = r[i] > 0.5 ? 1 : 0;
				return n;
			};
			const dA = distance(dur(A.c), gw, gh),
				dB = distance(dur(B.c), gw, gh);
			const rho = new Float32Array(gw * gh);
			// la bande elle-même : mode zona, là où le mélange s'étale ;
			// mode costura, un garde-fou (le mélange ne dépasse jamais la
			// bande de transition des données, même à mi-distance des deux parlars)
			let prof = null,
				lo = -1,
				hi = 1;
			for (let q = 0; q < gw * gh; q++) rho[q] = dB[q] - dA[q];
			if (costura) {
				prof = lire(b.c, COSTURA * 1.2);
			} else {
				prof = lire(b.c, Math.max(b.largPx, 8) * 0.12);
				const vals = [];
				for (let q = 0; q < gw * gh; q++) if (prof[q] > 0.7) vals.push(rho[q]);
				vals.sort((p, q) => p - q);
				lo = vals.length ? vals[Math.floor(vals.length * 0.04)] : -1;
				hi = vals.length ? Math.max(vals[Math.floor(vals.length * 0.96)], lo + 3) : 1;
			}
			// l'image du fondu : des couleurs pleines, un seul passage,
			// l'opacité ne servant qu'à fermer le mélange aux deux bords
			const ca = rgb(A.color),
				cb = rgb(B.color);
			const img = document.createElement('canvas');
			img.width = gw;
			img.height = gh;
			const g2 = img.getContext('2d');
			const im = g2.createImageData(gw, gh);
			const dt = im.data;
			const AMPLA = COSTURA * 1.6; // en pixels, la demi-largeur du mélange
			for (let j = 0; j < gh; j++)
				for (let i = 0; i < gw; i++) {
					const q = j * gw + i;
					let w, u;
					if (costura) {
						const r_px = rho[q] * c; // distance signée à la frontière, en pixels
						w = lis(clamp(1 - Math.abs(r_px) / AMPLA)) * clamp(prof[q] * 2.2);
						u = mai(clamp(0.5 + r_px / (AMPLA * 2)));
						if (w <= 0.002) continue;
					} else {
						w = lis(clamp((prof[q] - 0.55) / 0.38));
						if (w <= 0.002) continue;
						u = mai(clamp((rho[q] - lo) / (hi - lo)));
					}
					const p4 = 4 * q;
					dt[p4] = lerp(cb[0], ca[0], u);
					dt[p4 + 1] = lerp(cb[1], ca[1], u);
					dt[p4 + 2] = lerp(cb[2], ca[2], u);
					dt[p4 + 3] = Math.round(255 * w);
				}
			g2.putImageData(im, 0, 0);
			b.img = img;
			b.imgX = bx;
			b.imgY = by;
			b.imgS = c;
		},

		/* --- dessin --- */
		_dessiner() {
			const G = this._G;
			if (!G?.dom_c || !this._cv) return;
			const cx = this._cx,
				t = this._temps();
			cx.setTransform(1, 0, 0, 1, 0, 0);
			cx.clearRect(0, 0, this._cv.width, this._cv.height);
			const aT = lis(clamp((t - DUREE_FIN) / DUREE_TRANS));
			this._aTrans = aT;
			for (const zn of G.zonas) {
				const p = clamp((t - zn.rang * PAS) / DUREE);
				if (p > 0) this._piece(zn, p);
			}
			if (aT > 0.01) {
				this._fondu(aT);
				this._noms(aT);
			}
		},
		// une pièce : de 0 à 1, les fronts précalculés se remplissent l'un
		// après l'autre (deux au plus à la fois, un fondu entre eux)
		_piece(zn, p) {
			const cx = this._cx,
				tx = this._tx,
				dpr = this._dpr,
				G = this._G,
				o = this._o,
				s2 = this._s2;
			const [bx0, by0, bx1, by1] = zn.bbox;
			const M = 12;
			const rx = Math.max(0, Math.floor((bx0 - M) * dpr)),
				ry = Math.max(0, Math.floor((by0 - M) * dpr)),
				rx1 = Math.min(this._cv.width, Math.ceil((bx1 + M) * dpr)),
				ry1 = Math.min(this._cv.height, Math.ceil((by1 + M) * dpr));
			const rw = rx1 - rx,
				rh = ry1 - ry;
			if (rw <= 0 || rh <= 0) return;
			tx.setTransform(1, 0, 0, 1, 0, 0);
			tx.clearRect(rx, ry, rw, rh);
			tx.save();
			tx.setTransform(dpr, 0, 0, dpr, 0, 0);
			tx.clip(G.dom_c, 'evenodd');
			tx.fillStyle = tx.strokeStyle = zn.color;
			if (p >= 1) {
				tx.fill(zn.c, 'evenodd');
				tx.lineWidth = 1.2;
				tx.lineJoin = 'round';
				tx.stroke(zn.c);
			} else {
				if (!zn.coulee) zn.coulee = preparerCoulee(this._map, zn);
				const fronts = (zn.fronts ??= []);
				const v = p * NIVELS,
					k = clamp(Math.floor(v), 0, NIVELS - 1);
				// capture d'un instant figé : les fronts manquants se calculent
				// séance tenante (une fois, l'image ne bouge plus ensuite)
				if (this._fige !== null)
					while (fronts.length < Math.min(k + 2, NIVELS)) fronts.push(contourNivel(zn.coulee, fronts.length));
				if (!fronts.length) return tx.restore();
				tx.clip(zn.c, 'evenodd');
				// les coordonnées des fronts sont celles de la carte (zoom 0) :
				// on les amène à l'écran d'un seul changement de repère
				tx.save();
				tx.transform(s2, 0, 0, s2, -o.x, -o.y);
				const kk = Math.min(k, fronts.length - 1);
				tx.fill(fronts[kk], 'evenodd');
				const frac = v - kk;
				if (frac > 0.01 && kk + 1 < fronts.length) {
					tx.globalAlpha = frac;
					tx.fill(fronts[kk + 1], 'evenodd');
				}
				tx.restore();
			}
			tx.restore();
			// l'ombre du papier : une seule passe (deux mangeaient le temps des
			// grandes vues, la première cause des saccades)
			{
				cx.save();
				cx.shadowColor = 'rgba(24, 12, 6, 0.34)';
				cx.shadowBlur = 4.2 * dpr;
				cx.shadowOffsetY = 2.8 * dpr;
				cx.drawImage(this._tmp, rx, ry, rw, rh, rx, ry, rw, rh);
				cx.restore();
			}
		},
		// le fondu des transitions : les tranches déjà dessinées, posées sans calcul
		_fondu(a) {
			const G = this._G,
				cx = this._cx,
				dpr = this._dpr;
			let alguna = false;
			for (const b of G.bandas) {
				if (!b.img) continue;
				if (!alguna) {
					alguna = true;
					cx.save();
					cx.setTransform(dpr, 0, 0, dpr, 0, 0);
					cx.clip(G.dom_c, 'evenodd');
					cx.globalAlpha = a;
				}
				cx.drawImage(b.img, b.imgX, b.imgY, b.img.width * b.imgS, b.img.height * b.imgS);
			}
			if (alguna) cx.restore();
		},
		_noms(a) {
			const G = this._G,
				cx = this._cx,
				dpr = this._dpr;
			cx.save();
			cx.setTransform(dpr, 0, 0, dpr, 0, 0);
			cx.textAlign = 'center';
			cx.textBaseline = 'middle';
			cx.globalAlpha = a;
			cx.letterSpacing = '2px';
			cx.font = '700 12px Luciole, sans-serif';
			for (const zn of G.zonas) {
				cx.fillStyle = texteSur(zn.color);
				cx.fillText(zn.nom.toUpperCase(), zn.etiPx[0], zn.etiPx[1]);
			}
			cx.letterSpacing = '0px';
			cx.font = '600 11px Luciole, sans-serif';
			cx.textAlign = 'left';
			for (const v of G.viles) {
				cx.fillStyle = '#2a1a10';
				cx.beginPath();
				cx.arc(v.px[0], v.px[1], 2.6, 0, 6.283);
				cx.fill();
				cx.lineWidth = 3;
				cx.strokeStyle = 'rgba(251, 241, 225, 0.92)';
				cx.strokeText(v.nom, v.px[0] + 6, v.px[1] + 0.5);
				cx.fillText(v.nom, v.px[0] + 6, v.px[1] + 0.5);
			}
			cx.restore();
		}
	});
	return new Cola();
}
