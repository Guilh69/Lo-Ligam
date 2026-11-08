// La couche des dialectes de la carte en papier découpé (essai /ensag/carta-papier).
// (Romain, 08-11 : trois moutures successives jugées laides ou saccadées. La
// leçon retenue : la coulée aux fronts ondulants, recalculés image par image,
// coûtait tout le temps de la machine et vivait mal. Quatrième mouture,
// volontairement simple et sobre :)
//
//   - les pièces de papier sont dessinées UNE fois par vue, à plat, avec leur
//     ombre courte : rien n'est redessiné pendant les déplacements ;
//   - l'arrivée est un simple fondu du papier posé (une seule image par
//     instant, rien à recalculer : la fluidité est garantie) ;
//   - la transition entre deux parlers reste le sujet de l'essai : les
//     couleurs se fondent sur une étroite couture collée à la frontière
//     (« costura ») ou sur toute la bande réelle de mélange (« zona »),
//     dessinée uniquement pendant les moments calmes, et seulement sur ce
//     qui est à l'écran.
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

const ARRIBADA = 1.1; // s : le temps du fondu d'arrivée du papier
const APAR = 0.45; // s : le temps du fondu d'une couture qui arrive
const COSTURA = 15; // px de chaque côté de la frontière où les couleurs se fondent (mode costura)

// Le nom d'un dialecte posé sur sa pièce, un peu à part de la donnée (comme colaDonadas.js)
const ETI_NOM = { lan: [2.2, 43.95] };
// Les villes dites sur la carte d'essai (noms déjà publiés sur le site : LUOCS)
const VILES = ['Tolosa', 'Bordèu', 'Montpelhièr', 'Marselha', 'Niça', 'Clarmont-Ferrand', 'Limòtges', 'Pau', 'Gap', 'Valença', 'Nimes', 'Tolon'];

const json = (u) => fetch(u).then((r) => (r.ok ? r.json() : null));

/* ---------- Géométrie ---------- */
const anelsDe = (g) => (g.type === 'Polygon' ? g.coordinates : g.coordinates.flat());

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
export function crearColaPapier(L, { mode = 'costura' } = {}) {
	const Cola = L.Layer.extend({
		options: { pane: 'papier', padding: 0.2 },

		initialize() {
			this._mode = mode;
			this._t0 = null;
			this._calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		},

		onAdd(map) {
			if (!map.getPane('papier')) {
				const p = map.createPane('papier');
				p.style.zIndex = '300';
				p.style.pointerEvents = 'none';
			}
			this._cv = L.DomUtil.create('canvas', 'cola-papier leaflet-zoom-animated', map.getPane('papier'));
			this._cx = this._cv.getContext('2d');
			// le papier, préparé une fois par vue (ce que l'écran affiche ensuite)
			this._base = document.createElement('canvas');
			this._bx2 = this._base.getContext('2d');
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
					this._update();
					this.lancer();
				}
			);
			document.fonts?.load('700 12px Luciole').then(
				() => {
					this._rendre();
					this._dessiner();
				},
				() => {}
			);
		},

		onRemove() {
			this._parar();
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
			this._rendre();
			this._dessiner();
		},
		// rejoue l'arrivée du papier (t, s'il est donné, fige à un instant : pour les captures)
		lancer(t = null) {
			this._parar();
			if (t !== null && this._G?.dom_c) {
				// capture d'un instant : les coutures se dessinent séance tenante
				this._t0 = null;
				for (const b of this._G.bandas) {
					b.img = null;
					b.apar = 0;
					this._rasterFondu(b);
				}
				return this._dessiner();
			}
			if (this._calme) return ((this._t0 = null), this._dessiner());
			this._t0 = performance.now();
			this._dessiner();
		},
		_temps() {
			return this._t0 === null ? Infinity : (performance.now() - this._t0) / 1000;
		},
		_parar() {
			cancelAnimationFrame(this._raf);
			this._raf = null;
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
			for (const c of [this._cv, this._base]) {
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
			// les coutures sont refaites pour cette vue, une par moment calme
			this._planjarFondus();
			this._rendre();
			this._dessiner();
		},

		/* --- le papier, préparé une fois par vue --- */
		_rendre() {
			const G = this._G;
			if (!G?.dom_c) return;
			const g = this._bx2,
				dpr = this._dpr;
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.clearRect(0, 0, this._base.width, this._base.height);
			g.setTransform(dpr, 0, 0, dpr, 0, 0);
			g.save();
			g.clip(G.dom_c, 'evenodd');
			// les pièces : à plat, leur ombre courte portée une fois pour toutes
			// tmp as d'èsser tan bèl coma l'escran
			const tmp = (this._tmp ??= document.createElement('canvas'));
			const tx = (this._tx ??= tmp.getContext('2d'));
			if (tmp.width !== this._base.width || tmp.height !== this._base.height) {
				tmp.width = this._base.width;
				tmp.height = this._base.height;
			}
			for (const zn of G.zonas) {
				const [bx0, by0, bx1, by1] = zn.bbox;
				const M = 10;
				const rx = Math.max(0, Math.floor((bx0 - M) * dpr)),
					ry = Math.max(0, Math.floor((by0 - M) * dpr)),
					rx1 = Math.min(this._base.width, Math.ceil((bx1 + M) * dpr)),
					ry1 = Math.min(this._base.height, Math.ceil((by1 + M) * dpr));
				if (rx1 <= rx || ry1 <= ry) continue;
				tx.setTransform(1, 0, 0, 1, 0, 0);
				tx.clearRect(0, 0, tmp.width, tmp.height);
				tx.setTransform(dpr, 0, 0, dpr, 0, 0);
				tx.save();
				tx.translate(-rx / dpr, -ry / dpr);
				tx.fillStyle = tx.strokeStyle = zn.color;
				tx.fill(zn.c, 'evenodd');
				tx.lineWidth = 1.2;
				tx.lineJoin = 'round';
				tx.stroke(zn.c);
				tx.restore();
				g.save();
				g.shadowColor = 'rgba(24, 12, 6, 0.3)';
				g.shadowBlur = 3 * dpr;
				g.shadowOffsetY = 2.2 * dpr;
				g.beginPath();
				g.rect(rx / dpr, ry / dpr, (rx1 - rx) / dpr, (ry1 - ry) / dpr);
				g.clip();
				g.drawImage(tmp, rx, ry, rx1 - rx, ry1 - ry, rx / dpr, ry / dpr, (rx1 - rx) / dpr, (ry1 - ry) / dpr);
				g.restore();
			}
			this._noms(g);
			g.restore();
		},

		/* --- les coutures : préparées par moment calme, jamais au milieu d'un geste --- */
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
				if (b) {
					this._rasterFondu(b);
					b.apar = b.img ? performance.now() : 0;
					this._dessiner();
				}
				if (this._fondPend.length) this._contunharFondus();
				else this._rendre();
			});
		},
		/* --- le fondu d'une couture : une fois par vue, sur ce qui est à l'écran --- */
		_rasterFondu(b) {
			if (b.img) return;
			const par = Object.fromEntries(this._G.zonas.map((z) => [z.kod, z]));
			const A = par[b.paire[0]],
				B = par[b.paire[1]];
			if (!A || !B || !b.c || !b.bbox) return;
			const tail = this._map.getSize();
			const costura = this._mode === 'costura';
			const [x0, y0, x1, y1] = b.bbox;
			// la fenêtre : la bande réduite à l'écran, avec la marge où le
			// mélange peut encore se voir
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
			for (let q = 0; q < gw * gh; q++) rho[q] = dB[q] - dA[q];
			// la bande des données : là où le mélange a le droit de se voir
			// (mode zona, c'est toute la bande ; mode costura, un simple garde-fou)
			const prof = lire(b.c, costura ? COSTURA * 1.2 : Math.max(b.largPx, 8) * 0.12);
			let lo = -1,
				hi = 1;
			if (!costura) {
				const vals = [];
				for (let q = 0; q < gw * gh; q++) if (prof[q] > 0.7) vals.push(rho[q]);
				vals.sort((p, q) => p - q);
				lo = vals.length ? vals[Math.floor(vals.length * 0.04)] : -1;
				hi = vals.length ? Math.max(vals[Math.floor(vals.length * 0.96)], lo + 3) : 1;
			}
			// l'image du fondu : des couleurs pleines, l'opacité ne ferme le
			// mélange qu'aux deux bords
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

		/* --- dessin : au pire une image composite, et les coutures qui arrivent --- */
		_dessiner() {
			const G = this._G;
			if (!G?.dom_c || !this._cv) return;
			const cx = this._cx,
				dpr = this._dpr;
			const t = this._temps();
			cx.setTransform(1, 0, 0, 1, 0, 0);
			cx.clearRect(0, 0, this._cv.width, this._cv.height);
			cx.setTransform(dpr, 0, 0, dpr, 0, 0);
			// le papier : du fondu d'arrivée au repos
			const a = this._calme ? 1 : mai(clamp(t / ARRIBADA));
			if (a > 0.002) {
				cx.save();
				cx.globalAlpha = a;
				cx.drawImage(this._base, 0, 0, this._cv.width, this._cv.height, 0, 0, this._cv.width / dpr, this._cv.height / dpr);
				cx.restore();
			}
			// une couture qui vient d'être prête se pose en douceur
			let encara = false;
			const ara = performance.now();
			cx.save();
			cx.clip(G.dom_c, 'evenodd');
			for (const b of G.bandas) {
				if (!b.img) continue;
				const ab = b.apar ? mai(clamp((ara - b.apar) / 1000 / APAR)) : 1;
				if (ab <= 0.002) continue;
				if (ab < 1) encara = true;
				cx.globalAlpha = clamp(a) * ab;
				cx.drawImage(b.img, b.imgX, b.imgY, b.img.width * b.imgS, b.img.height * b.imgS);
			}
			cx.restore();
			// la suite : tant que le papier ou une couture finit d'arriver
			if (t < ARRIBADA || encara) {
				this._parar();
				this._raf = requestAnimationFrame(() => this._dessiner());
			}
		},

		/* --- les noms, sur le papier préparé --- */
		_noms(g) {
			const G = this._G;
			g.save();
			g.textAlign = 'center';
			g.textBaseline = 'middle';
			g.letterSpacing = '2px';
			g.font = '700 12px Luciole, sans-serif';
			for (const zn of G.zonas) {
				g.fillStyle = texteSur(zn.color);
				g.fillText(zn.nom.toUpperCase(), zn.etiPx[0], zn.etiPx[1]);
			}
			g.letterSpacing = '0px';
			g.font = '600 11px Luciole, sans-serif';
			g.textAlign = 'left';
			for (const v of G.viles) {
				g.fillStyle = '#2a1a10';
				g.beginPath();
				g.arc(v.px[0], v.px[1], 2.6, 0, 6.283);
				g.fill();
				g.lineWidth = 3;
				g.strokeStyle = 'rgba(251, 241, 225, 0.92)';
				g.strokeText(v.nom, v.px[0] + 6, v.px[1] + 0.5);
				g.fillText(v.nom, v.px[0] + 6, v.px[1] + 0.5);
			}
			g.restore();
		}
	});
	return new Cola();
}
