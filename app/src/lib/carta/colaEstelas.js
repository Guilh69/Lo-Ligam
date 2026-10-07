// Còla « Estelas » de /carta (2026-10-07) : la carte en étoiles de l'accueil,
// devenue une couche Leaflet. Mêmes lieux (304 villes et villages, nom
// occitan, dialecte), mêmes rivières, même placement des noms (villes à
// droite / gauche / dessus / dessous, la place la moins encombrée ; noms de
// rivières courbés le long de l'eau), mêmes couleurs de thème.
//
// En plus de l'accueil : on zoome et on se déplace (Leaflet s'en charge),
// les noms des villages apparaissent quand il y a la place, un clic sur un
// lieu y fait voler la carte, et la couche s'efface quand la carte détaillée
// (tuiles OSM en occitan) prend le relais, vers le niveau 9-10.
//
// Technique : un canevas dans un « pane » Leaflet, redessiné à chaque image
// (scintillement, survol), recalé à chaque fin de déplacement, et mis à
// l'échelle par transformation CSS pendant l'animation de zoom (même méthode
// que le moteur de rendu canevas de Leaflet).
import { LUOCS, RIUS, dialDe } from '$lib/acuelh/carta-estelas.js';

const TEMAS = {
	sorne: { bulla: 'rgba(29, 15, 10, 0.94)', riu: '#eeaf34', estela: '#f5ead8', liser: 'rgba(18, 9, 6, 0.9)', fil: '#eeaf34', riuTèxt: '#ffd47f', vilaTèxt: '#f5ead8', vel: 'rgba(18, 9, 6, 0.75)', velFin: 'rgba(18, 9, 6, 0)' },
	clar: { bulla: 'rgba(250, 243, 232, 0.96)', riu: '#b06a14', estela: '#6b3a22', liser: 'rgba(245, 234, 216, 0.92)', fil: '#b06a14', riuTèxt: '#8a3f12', vilaTèxt: '#2e1d14', vel: 'rgba(245, 234, 216, 0.85)', velFin: 'rgba(245, 234, 216, 0)' }
};
const temaDe = (clar, dalt) => ({
	...(clar ? TEMAS.clar : TEMAS.sorne),
	...(dalt ? (clar ? { riu: '#1f5f8f', riuTèxt: '#174a72' } : { riu: '#6fb1ff', riuTèxt: '#a9d0ff' }) : {})
});

// Montpelhièr d'abord (demande Romain) ; si une ville doit céder sa place, ce
// sera une des dernières.
const PRIORITAT = ['Montpelhièr', 'Tolosa', 'Marselha', 'Bordèu', 'Niça', 'Clarmont-Ferrand', 'Limòtges', 'Avinhon', 'Baiona', 'Vielha', 'Draonier', 'Pau', 'Valença', 'Tolon', 'Nimes', 'Ais de Provença'];
const rang = (n) => {
	const i = PRIORITAT.indexOf(n);
	return i < 0 ? 99 : i;
};

// Seuils d'échelle (niveaux de zoom Leaflet)
const Z_VILATGES = 7.25; // les noms des villages apparaissent
const Z_DETALH_0 = 8.5; // la carte détaillée commence à se montrer…
const Z_DETALH_1 = 10; // … et a pris le relais

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const aleat = (a, b) => a + Math.random() * (b - a);
const CORMORANT = '"Cormorant Garamond", Georgia, serif';

/** Part de la carte détaillée à un niveau de zoom (0 = étoiles seules, 1 = détail). */
export const partDetalh = (z) => clamp((z - Z_DETALH_0) / (Z_DETALH_1 - Z_DETALH_0));
export const Z_DETALH_MIN = Z_DETALH_0;

/* ---------- Placement des noms (repris de l'accueil, en pixels projetés) ---------- */
function plaçar(cx, vilas, rius) {
	const CEL = 16,
		grilha = new Map();
	const cases = (b, fn) => {
		for (let i = Math.floor(b[0] / CEL); i <= Math.floor(b[2] / CEL); i++)
			for (let j = Math.floor(b[1] / CEL); j <= Math.floor(b[3] / CEL); j++) fn(i + ',' + j);
	};
	const metre = (b, pes, prop) => {
		const o = { b, pes, prop };
		cases(b, (k) => {
			if (!grilha.has(k)) grilha.set(k, []);
			grilha.get(k).push(o);
		});
	};
	const cost = (b, prop) => {
		const vist = new Set();
		let c = 0,
			fort = 0;
		cases(b, (k) => {
			for (const o of grilha.get(k) || []) {
				if (vist.has(o) || o.prop === prop) continue;
				vist.add(o);
				if (b[0] < o.b[2] && b[2] > o.b[0] && b[1] < o.b[3] && b[3] > o.b[1]) {
					c += o.pes;
					if (o.pes >= 5) fort++;
				}
			}
		});
		return [c, fort];
	};
	const liss = (pts, n) => {
		for (let k = 0; k < n; k++) {
			const q = [pts[0]];
			for (let i = 0; i < pts.length - 1; i++) {
				const a = pts[i],
					b = pts[i + 1];
				q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
			}
			q.push(pts[pts.length - 1]);
			pts = q;
		}
		return pts;
	};

	const res = { vilas: [], rius: [] };
	// Les points des villes d'abord ; ceux des villages n'entrent en jeu
	// qu'après le placement des villes (sinon, en zoomant, les villages
	// voisins étouffaient Montpelhièr : aucune place libre pour son nom)
	const punt = (v) => metre([v.x - 4, v.y - 4, v.x + 4, v.y + 4], 5, v.nom);
	vilas.filter((v) => v.ciutat).forEach(punt);
	rius.forEach(({ nom, pts }, n) => {
		const prop = nom || 'riu' + n;
		for (let i = 1; i < pts.length; i++) {
			const a = pts[i - 1],
				b = pts[i],
				L = Math.hypot(b[0] - a[0], b[1] - a[1]);
			for (let d = 0; d < L; d += 4) {
				const x = a[0] + ((b[0] - a[0]) * d) / L,
					y = a[1] + ((b[1] - a[1]) * d) / L;
				metre([x - 1.5, y - 1.5, x + 1.5, y + 1.5], 1, prop);
			}
		}
	});

	// Villes puis villages : la place la moins encombrée parmi huit ; un nom
	// peut croiser une rivière (son liseré le détache), jamais un autre nom
	// Ordre : villes, puis noms de rivières, puis villages dans la place qui reste
	const pausarVila = (v) => {
		cx.font = '700 ' + v.f + 'px Luciole, sans-serif';
		const k = v.f / 12,
			w = cx.measureText(v.nom).width,
			x = v.x,
			y = v.y;
		const cand = [
			{ x: x + 7 * k, y: y + 4 * k, al: 'left', b: [x + 5 * k, y - 8 * k, x + 9 * k + w, y + 7 * k], bonus: 0 },
			{ x: x - 7 * k, y: y + 4 * k, al: 'right', b: [x - 9 * k - w, y - 8 * k, x - 5 * k, y + 7 * k], bonus: 0.4 },
			{ x, y: y - 9 * k, al: 'center', b: [x - w / 2 - 2, y - 21 * k, x + w / 2 + 2, y - 5 * k], bonus: 0.6 },
			{ x, y: y + 18 * k, al: 'center', b: [x - w / 2 - 2, y + 5 * k, x + w / 2 + 2, y + 21 * k], bonus: 0.8 },
			{ x: x + 5 * k, y: y - 7 * k, al: 'left', b: [x + 3 * k, y - 19 * k, x + 7 * k + w, y - 4 * k], bonus: 1 },
			{ x: x + 5 * k, y: y + 15 * k, al: 'left', b: [x + 3 * k, y + 3 * k, x + 7 * k + w, y + 18 * k], bonus: 1 },
			{ x: x - 5 * k, y: y - 7 * k, al: 'right', b: [x - 7 * k - w, y - 19 * k, x - 3 * k, y - 4 * k], bonus: 1.2 },
			{ x: x - 5 * k, y: y + 15 * k, al: 'right', b: [x - 7 * k - w, y + 3 * k, x - 3 * k, y + 18 * k], bonus: 1.2 }
		];
		let c = cand[0],
			mendre = Infinity;
		for (const q of cand) {
			const [val, f] = cost(q.b, v.nom);
			const sc = (val - 5 * f) * 0.03 + f * 100 + q.bonus;
			if (sc < mendre) {
				mendre = sc;
				c = q;
			}
		}
		if (mendre >= 100) return; // pas de place : le nom reste visible au survol
		metre(c.b, 5, 'etiqueta');
		res.vilas.push({ nom: v.nom, x: c.x, y: c.y, al: c.al, f: v.f, ciutat: v.ciutat });
	};
	for (const v of vilas) if (v.ciutat) pausarVila(v);

	// Rivières : des plus grandes aux plus petites ; le nom suit un arc doux
	// ajusté sur le tracé lissé, au-dessus ou au-dessous de l'eau, sans rien toucher
	const perNom = {};
	for (const r of rius) if (r.nom) (perNom[r.nom] ||= { nom: r.nom, pes: 0, linhas: [] }).linhas.push(r.pts), (perNom[r.nom].pes = Math.max(perNom[r.nom].pes, r.pes));
	for (const { nom, linhas, pes } of Object.values(perNom).sort((a, b) => b.pes - a.pes)) {
		const fs = Math.round(12 + pes * 0.75),
			trac = fs * 0.09;
		cx.font = 'italic 500 ' + fs + 'px ' + CORMORANT;
		const larg = [...nom].map((ch) => cx.measureText(ch).width),
			tot = larg.reduce((a, b) => a + b, 0) + trac * (nom.length - 1);
		const ofs = fs * 0.55 + 3;
		let melhor = null;
		for (const l of linhas) {
			const pts = liss(l, 3);
			const cum = [0];
			for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
			const L = cum[cum.length - 1];
			if (L < tot + 20) continue;
			const ponch = (d) => {
				d = Math.max(0, Math.min(L, d));
				let lo = 1,
					hi = cum.length - 1;
				while (lo < hi) {
					const m = (lo + hi) >> 1;
					if (cum[m] < d) lo = m + 1;
					else hi = m;
				}
				const i = lo,
					f = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
				return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
			};
			for (const frac of [0.5, 0.44, 0.56, 0.38, 0.62, 0.31, 0.69, 0.24, 0.76, 0.17, 0.83, 0.1, 0.9]) {
				const d0 = frac * L - tot / 2;
				if (d0 < 6 || d0 + tot > L - 6) continue;
				const span = tot * 1.08;
				let P0 = ponch(d0 + tot / 2 - span / 2),
					P1 = ponch(d0 + tot / 2),
					P2 = ponch(d0 + tot / 2 + span / 2);
				if (P2[0] < P0[0]) [P0, P2] = [P2, P0];
				const cl = Math.hypot(P2[0] - P0[0], P2[1] - P0[1]);
				if (cl < tot * 0.6) continue;
				const u = [(P2[0] - P0[0]) / cl, (P2[1] - P0[1]) / cl],
					nv = [u[1], -u[0]];
				const M = [(P0[0] + P2[0]) / 2, (P0[1] + P2[1]) / 2];
				const sag = (P1[0] - M[0]) * nv[0] + (P1[1] - M[1]) * nv[1];
				const kr = (8 * sag) / (cl * cl + 4 * sag * sag);
				for (const costat of [1, -1]) {
					let kb = kr / (1 + kr * ofs * costat);
					const kmax = Math.min(1 / (7 * fs), 0.9 / tot);
					kb = Math.max(-kmax, Math.min(kmax, kb));
					const A = [P1[0] + nv[0] * ofs * costat, P1[1] + nv[1] * ofs * costat];
					const letras = [],
						bs = [];
					let d = -tot / 2;
					[...nom].forEach((ch, k) => {
						const sL = d + larg[k] / 2,
							th = sL * kb;
						const x = A[0] + (Math.abs(kb) < 1e-6 ? u[0] * sL : (u[0] * Math.sin(th) - nv[0] * (1 - Math.cos(th))) / kb);
						const y = A[1] + (Math.abs(kb) < 1e-6 ? u[1] * sL : (u[1] * Math.sin(th) - nv[1] * (1 - Math.cos(th))) / kb);
						const t = [u[0] * Math.cos(th) - nv[0] * Math.sin(th), u[1] * Math.cos(th) - nv[1] * Math.sin(th)];
						letras.push({ c: ch, x, y, a: Math.atan2(t[1], t[0]) });
						bs.push([x - larg[k] / 2 - 1, y - fs * 0.42, x + larg[k] / 2 + 1, y + fs * 0.42]);
						d += larg[k] + trac;
					});
					let dmin = Infinity,
						dmax = 0;
					for (const g of letras) {
						let m = Infinity;
						for (let dd = Math.max(0, d0 - fs * 2); dd <= Math.min(L, d0 + tot + fs * 2); dd += 3) {
							const q = ponch(dd);
							m = Math.min(m, Math.hypot(q[0] - g.x, q[1] - g.y));
						}
						dmin = Math.min(dmin, m);
						dmax = Math.max(dmax, m);
					}
					if (dmin < ofs * 0.55 || dmax > ofs + fs * 1.3) continue;
					let sc = (dmax - ofs) / fs + Math.abs(frac - 0.5) * 3 + (costat < 0 ? 0.3 : 0),
						fort = 0;
					for (const bx of bs) {
						const r = cost(bx, nom);
						sc += r[0];
						fort += r[1];
					}
					if (!fort && (!melhor || sc < melhor.sc)) melhor = { letras, bs, sc };
				}
			}
		}
		if (!melhor) continue;
		for (const b of melhor.bs) metre([b[0] - 2, b[1] - 2, b[2] + 2, b[3] + 2], 5, 'etiqueta');
		res.rius.push({ letras: melhor.letras, fs });
	}

	const vilatges = vilas.filter((v) => !v.ciutat);
	vilatges.forEach(punt);
	vilatges.forEach(pausarVila);
	return res;
}

/* ---------- La couche ---------- */
export function crearColaEstelas(L, { clar = false, dalt = false } = {}) {
	const Cola = L.Layer.extend({
		options: {
			pane: 'estelas',
			padding: 0.3,
			// Sources de la couche, affichées avec les crédits de la carte
			attribution:
				'Rius : <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a> · noms : © OpenStreetMap'
		},

		initialize() {
			this._tem = temaDe(clar, dalt);
			this._calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
			this._estelas = LUOCS.map(([lon, lat, nom, vila, dia]) => ({
				lon, lat, nom, vila, dia,
				r: aleat(0.5, 1.4), f: aleat(0, 6.28), v: aleat(0.2, 0.7), retard: aleat(0, 0.35),
				sx: Math.random(), sy: Math.random(), X: 0, Y: 0
			}));
		},

		onAdd(map) {
			if (!map.getPane('estelas')) {
				const p = map.createPane('estelas');
				p.style.zIndex = '350'; // au-dessus des tuiles, sous les couches de l'admin
				p.style.pointerEvents = 'none';
			}
			this._cv = L.DomUtil.create('canvas', 'cola-estelas leaflet-zoom-animated', map.getPane('estelas'));
			this._cx = this._cv.getContext('2d');
			this._etiq = document.createElement('canvas');
			this._t0 = performance.now();
			this._pus = null;
			this._zP = null;
			this._update();
			// Les noms de rivières sont en Cormorant : on attend la police pour les placer
			document.fonts?.load('italic 500 16px "Cormorant Garamond"').then(() => {
				this._zP = null;
				this._update();
			});
			this._viu = true;
			const bocla = (t) => {
				if (!this._viu) return;
				this._dessenhar(t);
				this._raf = requestAnimationFrame(bocla);
			};
			this._raf = requestAnimationFrame(bocla);
		},

		onRemove() {
			this._viu = false;
			cancelAnimationFrame(this._raf);
			L.DomUtil.remove(this._cv);
			this._map.getContainer().style.cursor = '';
		},

		getEvents() {
			const ev = {
				viewreset: this._update,
				zoom: this._onZoom,
				moveend: this._update,
				resize: this._update,
				mousemove: this._onMirga,
				mouseout: this._onSortida,
				click: this._onClic
			};
			if (this._zoomAnimated) ev.zoomanim = this._onAnimZoom;
			return ev;
		},

		setTema(c, d) {
			this._tem = temaDe(c, d);
			this._construirEtiquetas();
		},

		/* Recalage : le canevas couvre la vue + une marge, en coordonnées « layer » */
		_update() {
			const map = this._map;
			if (!map || !this._cv) return;
			const p = this.options.padding,
				size = map.getSize();
			const min = map.containerPointToLayerPoint(size.multiplyBy(-p)).round();
			const tal = size.multiplyBy(1 + 2 * p).round();
			this._min = min;
			this._center = map.getCenter();
			this._zoom = map.getZoom();
			L.DomUtil.setPosition(this._cv, min);
			this._dpr = Math.min(devicePixelRatio || 1, 2);
			this._W = tal.x;
			this._H = tal.y;
			this._cv.width = Math.round(tal.x * this._dpr);
			this._cv.height = Math.round(tal.y * this._dpr);
			this._cv.style.width = tal.x + 'px';
			this._cv.style.height = tal.y + 'px';
			this._o = map.getPixelOrigin().add(min); // projeté → canevas : soustraire o

			const z = this._zoom;
			if (this._zP !== z) {
				for (const e of this._estelas) {
					const q = map.project([e.lat, e.lon], z);
					e.X = q.x;
					e.Y = q.y;
				}
				this._rius = RIUS.map(([nom, pes, l]) => ({
					nom,
					pes,
					pts: l.map(([lon, lat]) => {
						const q = map.project([lat, lon], z);
						return [q.x, q.y];
					})
				}));
				this._plaçament = z < Z_DETALH_1 ? this._plaçarTot(z) : { vilas: [], rius: [] };
				this._zP = z;
			}
			this._construirEtiquetas();
		},

		_plaçarTot(z) {
			const telefon = this._map.getSize().x <= 700;
			const fv = telefon ? 10.5 : 12;
			const vilas = this._estelas
				.filter((e) => e.vila)
				.sort((a, b) => rang(a.nom) - rang(b.nom))
				.map((e) => ({ nom: e.nom, x: e.X, y: e.Y, f: fv, ciutat: true }));
			if (z >= Z_VILATGES)
				for (const e of this._estelas) if (!e.vila) vilas.push({ nom: e.nom, x: e.X, y: e.Y, f: fv - 1.5, ciutat: false });
			return plaçar(this._cx, vilas, this._rius);
		},

		/* Les noms sont dessinés UNE fois par recalage dans une image en mémoire,
		   puis simplement recopiés à chaque image (pas des centaines de textes
		   tournés à redessiner en continu) */
		_construirEtiquetas() {
			if (!this._W || !this._plaçament) return;
			const c = this._etiq,
				g = c.getContext('2d'),
				T = this._tem,
				o = this._o,
				dpr = this._dpr;
			c.width = this._cv.width;
			c.height = this._cv.height;
			g.setTransform(dpr, 0, 0, dpr, -o.x * dpr, -o.y * dpr);
			g.strokeStyle = T.liser;
			g.lineJoin = 'round';
			g.textAlign = 'center';
			g.textBaseline = 'middle';
			g.fillStyle = T.riuTèxt;
			g.lineWidth = 3;
			const dins = (x, y) => x > o.x - 60 && x < o.x + this._W + 60 && y > o.y - 60 && y < o.y + this._H + 60;
			// Autour du lieu survolé, les noms voisins s'estompent (sa bulle les
			// recouvrirait) et le sien disparaît (la bulle le porte)
			const p = this._pus,
				ray = this._map.getSize().x <= 700 ? 70 : 150;
			const prèp = (x, y) => (p ? Math.hypot(x - p.X, y - p.Y) < ray : false);
			this._etiqPus = p;
			for (const r of this._plaçament.rius) {
				if (!dins(r.letras[0].x, r.letras[0].y)) continue;
				const m = r.letras[Math.floor(r.letras.length / 2)];
				g.globalAlpha = prèp(m.x, m.y) ? 0.12 : 1;
				g.font = 'italic 500 ' + r.fs + 'px ' + CORMORANT;
				for (const pas of ['strokeText', 'fillText'])
					for (const l of r.letras) {
						g.save();
						g.translate(l.x, l.y);
						g.rotate(l.a);
						g[pas](l.c, 0, 0);
						g.restore();
					}
			}
			g.textBaseline = 'alphabetic';
			g.fillStyle = T.vilaTèxt;
			for (const v of this._plaçament.vilas) {
				if (!dins(v.x, v.y) || (p && v.nom === p.nom)) continue;
				g.font = '700 ' + v.f + 'px Luciole, sans-serif';
				g.lineWidth = v.f < 11 ? 3 : 4;
				// distance du lieu survolé au TEXTE (sa boîte), pas à son point d'ancrage
				let aprèp = false;
				if (p) {
					const w = g.measureText(v.nom).width,
						x0 = v.al === 'left' ? v.x : v.al === 'right' ? v.x - w : v.x - w / 2;
					const dx = Math.max(x0 - p.X, 0, p.X - (x0 + w)),
						dy = Math.max(v.y - v.f - p.Y, 0, p.Y - v.y);
					aprèp = Math.hypot(dx, dy) < ray;
				}
				g.globalAlpha = (v.ciutat ? 1 : 0.82) * (aprèp ? 0.12 : 1);
				g.textAlign = v.al;
				g.strokeText(v.nom, v.x, v.y);
				g.fillText(v.nom, v.x, v.y);
			}
			g.globalAlpha = 1;
		},

		/* Animation de zoom : on étire le canevas comme Leaflet le fait pour ses
		   propres couches, puis on redessine net à la fin */
		_onAnimZoom(e) {
			this._transformar(e.center, e.zoom);
		},
		_onZoom() {
			this._transformar(this._map.getCenter(), this._map.getZoom());
		},
		_transformar(center, zoom) {
			const map = this._map;
			if (!this._center) return;
			const scale = map.getZoomScale(zoom, this._zoom),
				viewHalf = map.getSize().multiplyBy(0.5 + this.options.padding),
				currentCenterPoint = map.project(this._center, zoom),
				topLeftOffset = viewHalf.multiplyBy(-scale).add(currentCenterPoint).subtract(map._getNewPixelOrigin(center, zoom));
			L.DomUtil.setTransform(this._cv, topLeftOffset, scale);
		},

		/* Survol et toucher : le lieu le plus proche, les villes passent devant */
		_pròche(lp, ray, bonus) {
			const x = lp.x - this._min.x,
				y = lp.y - this._min.y;
			let best = null,
				bestD = Infinity;
			for (const e of this._estelas) {
				const d = Math.hypot(e.X - this._o.x - x, e.Y - this._o.y - y);
				const sc = d - (e.vila ? bonus : 0);
				if (d < ray && sc < bestD) {
					best = e;
					bestD = sc;
				}
			}
			return best;
		},
		_onMirga(e) {
			if (e.originalEvent?.pointerType === 'touch' || partDetalh(this._zoom) >= 1) return;
			this._pus = this._pròche(e.layerPoint, 22, 6);
			this._det = false;
			if (this._pus !== this._etiqPus) this._construirEtiquetas();
			this._map.getContainer().style.cursor = this._pus ? 'pointer' : '';
		},
		_onSortida() {
			if (this._det) return;
			this._pus = null;
			if (this._etiqPus) this._construirEtiquetas();
		},
		// Clic sur un lieu : la carte y vole et s'en approche. Au doigt, un
		// premier toucher montre le nom (dans une bulle au-dessus du doigt), un
		// second sur le même lieu y emmène.
		_onClic(e) {
			const tactil = e.originalEvent?.pointerType === 'touch' || !matchMedia('(hover: hover)').matches;
			const lòc = this._pròche(e.layerPoint, tactil ? 34 : 22, tactil ? 18 : 6);
			if (!lòc) {
				if (tactil) this._pus = null;
				return;
			}
			if (tactil && this._pus !== lòc) {
				this._pus = lòc;
				this._det = true;
				this._tòc = performance.now();
				this._construirEtiquetas();
				return;
			}
			this._pus = null;
			const z = Math.min(Math.max(this._zoom + 2.5, Z_DETALH_1 + 0.5), 12);
			this._map.flyTo([lòc.lat, lòc.lon], z, { duration: this._calm ? 0 : 1.8 });
		},

		_dessenhar(t) {
			const cx = this._cx,
				W = this._W,
				H = this._H,
				o = this._o,
				T = this._tem,
				z = this._zoom;
			if (!cx || !W) return;
			cx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
			cx.clearRect(0, 0, W, H);
			const temps = (t - this._t0) / 1000;
			// Arrivée : les étoiles, éparpillées, viennent dessiner l'Occitanie
			const intro = this._calm ? 1 : clamp((temps - 0.15) / 1.9);
			const det = partDetalh(z);
			const aGen = 1 - det * 0.85,
				aEtiq = 1 - det;
			const gros = 1 + Math.max(0, z - 7) * 0.14;

			const aRiu = easeIO(clamp((intro - 0.45) / 0.55));
			if (aRiu > 0.01 && this._rius) {
				cx.strokeStyle = T.riu;
				cx.lineCap = 'round';
				cx.lineJoin = 'round';
				for (const r of this._rius) {
					const l = r.pts,
						k = aRiu * (l.length - 1),
						n = Math.floor(k);
					cx.globalAlpha = (r.nom ? 0.75 : 0.25) * aGen;
					cx.lineWidth = (0.4 + r.pes * 0.22) * gros;
					cx.beginPath();
					cx.moveTo(l[0][0] - o.x, l[0][1] - o.y);
					for (let i = 1; i <= n; i++) cx.lineTo(l[i][0] - o.x, l[i][1] - o.y);
					if (n < l.length - 1) {
						const f = k - n;
						cx.lineTo(lerp(l[n][0], l[n + 1][0], f) - o.x, lerp(l[n][1], l[n + 1][1], f) - o.y);
					}
					cx.stroke();
				}
			}

			cx.fillStyle = T.estela;
			for (const e of this._estelas) {
				const tw = this._calm ? 0.6 : Math.sin(temps * e.v + e.f) * 0.5 + 0.5;
				const ai = easeIO(clamp(intro * 1.35 - e.retard));
				const x = lerp(e.sx * W, e.X - o.x, ai),
					y = lerp(e.sy * H, e.Y - o.y, ai);
				if (x < -10 || y < -10 || x > W + 10 || y > H + 10) continue;
				cx.globalAlpha = lerp(0.18 + 0.27 * tw, e.vila ? 1 : 0.55 + 0.35 * tw, ai) * aGen;
				cx.beginPath();
				cx.arc(x, y, lerp(e.r, e.vila ? 2.8 : 1.35, ai) * gros, 0, 6.283);
				cx.fill();
			}

			if (intro > 0.7 && aEtiq > 0.01) {
				cx.globalAlpha = ((intro - 0.7) / 0.3) * aEtiq * 0.92;
				cx.drawImage(this._etiq, 0, 0, W, H);
			}

			// La bulle du lieu survolé (ou touché, 5 s)
			if (this._det && performance.now() - this._tòc > 5000) {
				this._pus = null;
				this._det = false;
				this._construirEtiquetas();
			}
			const p = this._pus;
			if (p) {
				const px = p.X - o.x,
					py = p.Y - o.y;
				const escriure = (s, x, y, l) => {
					cx.lineWidth = l;
					cx.strokeText(s, x, y);
					cx.fillText(s, x, y);
				};
				cx.globalAlpha = 1;
				// Coin haut-gauche de la vue, en coordonnées du canevas (qui déborde de la vue)
				const vis = this._map.getSize(),
					v0 = this._map.containerPointToLayerPoint([0, 0]).subtract(this._min);
				if (this._det) {
					const nomF = 'italic 500 22px ' + CORMORANT,
						dialF = '700 11px Luciole, sans-serif';
					cx.font = nomF;
					const wn = cx.measureText(p.nom).width;
					cx.font = dialF;
					const wd = cx.measureText(dialDe(p)).width;
					const bw = Math.max(wn, wd) + 30,
						bh = 52;
					const bx = Math.min(v0.x + vis.x - bw / 2 - 10, Math.max(v0.x + bw / 2 + 10, px));
					const by = Math.max(v0.y + 90 + bh / 2, py - 86);
					cx.strokeStyle = T.fil;
					cx.lineWidth = 1;
					cx.beginPath();
					cx.moveTo(px, py - 9);
					cx.lineTo(bx, by + bh / 2);
					cx.stroke();
					cx.lineWidth = 1.3;
					cx.beginPath();
					cx.arc(px, py, 9, 0, 6.283);
					cx.stroke();
					cx.fillStyle = T.bulla;
					cx.beginPath();
					cx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 14);
					cx.fill();
					cx.lineWidth = 1;
					cx.stroke();
					cx.textAlign = 'center';
					cx.font = nomF;
					cx.fillStyle = T.riuTèxt;
					cx.fillText(p.nom, bx, by + 2);
					cx.font = dialF;
					cx.fillStyle = T.vilaTèxt;
					cx.globalAlpha = 0.8;
					cx.fillText(dialDe(p), bx, by + 18);
				} else {
					const vel = cx.createRadialGradient(px, py, 0, px, py, 130);
					vel.addColorStop(0, T.vel);
					vel.addColorStop(1, T.velFin);
					cx.fillStyle = vel;
					cx.fillRect(px - 130, py - 130, 260, 260);
					cx.strokeStyle = T.fil;
					cx.lineWidth = 1.2;
					cx.beginPath();
					cx.arc(px, py, 8, 0, 6.283);
					cx.stroke();
					const dreta = px - v0.x < vis.x - 260;
					const tx = px + (dreta ? 16 : -16);
					cx.textAlign = dreta ? 'left' : 'right';
					cx.strokeStyle = T.liser;
					cx.font = 'italic 500 26px ' + CORMORANT;
					cx.fillStyle = T.riuTèxt;
					escriure(p.nom, tx, py + 2, 5);
					cx.font = '700 11px Luciole, sans-serif';
					cx.fillStyle = T.vilaTèxt;
					cx.globalAlpha = 0.8;
					escriure(dialDe(p), tx, py + 20, 4);
				}
				cx.textAlign = 'left';
				cx.globalAlpha = 1;
			}
		}
	});
	return new Cola();
}
