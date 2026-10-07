// Còla de donadas : las jaces del catalògue que lo site pinta el meteis
// (frontièra de la lenga, dialèctes, Creissent, regions, despartaments). Un
// canavàs dins un pan entre las tuèlas (200) e las estelas (350) : las jaces
// valon per totes los fonses, e demòran jos los noms de la carta en estelas.
//
// Dialèctes (2026-10-07) : zònas de la carta d'Occitanica, calada en
// Lambert-93. Las limits entre dialèctes son pas de traches : de luènh son
// netas, de prèp se fondon sus quauques quilomètres (las parlars se mesclan,
// e lo calatge es precis a 3-6 km près).
import { cargarLimits } from './colaEstelas.js';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

// Una color per dialècte, dins l'esperit de la carta d'Occitanica (violet
// gascon, magenta lengadocian, ròse provençal, irangis del nòrd) ; en
// daltonisme, la paleta Okabe-Ito
const COLORS = {
	sorne: { gas: '#9d7dff', lan: '#ff3f86', pro: '#ffb0dc', lem: '#ffa22e', auv: '#e8482a', viv: '#ffe27a' },
	clar: { gas: '#6a45d0', lan: '#c2185b', pro: '#e573ad', lem: '#e07b00', auv: '#a8321a', viv: '#c9a227' },
	dalt: { gas: '#0072b2', lan: '#d55e00', pro: '#cc79a7', lem: '#e69f00', auv: '#009e73', viv: '#56b4e9' }
};
const TEMAS = {
	sorne: { lenga: '#e0612f', admin: '245, 234, 216', liser: 'rgba(18, 9, 6, 0.85)', tencha: 0.3 },
	clar: { lenga: '#b53d17', admin: '46, 29, 20', liser: 'rgba(245, 234, 216, 0.9)', tencha: 0.22 }
};
const temaDe = (clar, dalt) => ({
	...(clar ? TEMAS.clar : TEMAS.sorne),
	...(dalt ? { lenga: clar ? '#1f5f8f' : '#6fb1ff' } : {}),
	dial: dalt ? COLORS.dalt : clar ? COLORS.clar : COLORS.sorne
});

let dialPromesa = null,
	creissentPromesa = null;
const cargarJson = (url) =>
	fetch(url)
		.then((r) => (r.ok ? r.json() : null))
		.catch(() => null);

export function crearColaDonadas(L, { clar = false, dalt = false, lang = 'oc', jaces = {} } = {}) {
	const Cola = L.Layer.extend({
		options: {
			pane: 'donadas',
			padding: 0.3,
			attribution:
				'Lenga e dialèctes : <a href="https://www.occitanica.eu/" target="_blank" rel="noopener">Occitanica</a>'
		},

		initialize() {
			this._tem = temaDe(clar, dalt);
			this._lang = lang;
			this._jaces = { ...jaces };
		},

		onAdd(map) {
			if (!map.getPane('donadas')) {
				const p = map.createPane('donadas');
				p.style.zIndex = '300';
				p.style.pointerEvents = 'none';
			}
			this._cv = L.DomUtil.create('canvas', 'cola-donadas leaflet-zoom-animated', map.getPane('donadas'));
			this._cv.style.opacity = '0';
			this._cv.style.transition = 'opacity 0.9s ease';
			this._cx = this._cv.getContext('2d');
			this._fora = document.createElement('canvas');
			cargarLimits().then((l) => {
				this._limits = l;
				this._update();
			});
			this._cargar();
			this._update();
		},

		onRemove() {
			L.DomUtil.remove(this._cv);
		},

		getEvents() {
			const ev = { viewreset: this._update, moveend: this._update, resize: this._update, zoom: this._onZoom };
			if (this._zoomAnimated) ev.zoomanim = this._onAnimZoom;
			return ev;
		},

		// Las donadas d'una jaça se telecargan sonque quand es alucada
		_cargar() {
			if (this._jaces.dialectes && !this._dial)
				(dialPromesa ??= cargarJson('/data/dialectes.geojson')).then((d) => {
					this._dial = d;
					this._update();
				});
			if (this._jaces.creissent && !this._creissent)
				(creissentPromesa ??= cargarJson('/data/creissent.geojson')).then((d) => {
					this._creissent = d;
					this._update();
				});
		},

		setJaces(j) {
			this._jaces = { ...j };
			this._cargar();
			this._update();
		},
		setTema(c, d) {
			this._tem = temaDe(c, d);
			this._update();
		},
		setLenga(l) {
			this._lang = l;
			this._update();
		},

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

		_update() {
			const map = this._map;
			if (!map || !this._cv) return;
			const p = this.options.padding,
				size = map.getSize();
			const min = map.containerPointToLayerPoint(size.multiplyBy(-p)).round();
			const tal = size.multiplyBy(1 + 2 * p).round();
			this._center = map.getCenter();
			this._zoom = map.getZoom();
			L.DomUtil.setPosition(this._cv, min);
			const dpr = Math.min(devicePixelRatio || 1, 2);
			const W = tal.x,
				H = tal.y;
			this._cv.width = Math.round(W * dpr);
			this._cv.height = Math.round(H * dpr);
			this._cv.style.width = W + 'px';
			this._cv.style.height = H + 'px';
			const o = map.getPixelOrigin().add(min);
			const z = this._zoom;
			const pt = ([lon, lat]) => {
				const q = map.project([lat, lon], z);
				return [q.x - o.x, q.y - o.y];
			};
			const cami = (anels, c = new Path2D()) => {
				for (const a of anels) {
					const p0 = pt(a[0]);
					c.moveTo(p0[0], p0[1]);
					for (let i = 1; i < a.length; i++) {
						const q = pt(a[i]);
						c.lineTo(q[0], q[1]);
					}
					c.closePath();
				}
				return c;
			};
			const poligons = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
			const cx = this._cx,
				T = this._tem,
				J = this._jaces;
			cx.setTransform(dpr, 0, 0, dpr, 0, 0);
			cx.clearRect(0, 0, W, H);
			const mPx = 112600 / Math.pow(2, z); // mètres par pixel vers 44° N
			const dom = this._limits?.domeni;
			const camiDom = dom?.anels?.length ? cami(dom.anels) : null;

			/* Dialèctes : tencha fonduda, retalhada pel domeni (còsta e frontièra
			   netas, sonque las limits intèrnas se fondon) */
			if (J.dialectes && this._dial) {
				const off = this._fora;
				off.width = this._cv.width;
				off.height = this._cv.height;
				const g = off.getContext('2d');
				g.setTransform(dpr, 0, 0, dpr, 0, 0);
				for (const f of this._dial.features) {
					g.fillStyle = T.dial[f.properties.kod] ?? '#888';
					const c = new Path2D();
					for (const anels of poligons(f.geometry)) cami(anels, c);
					g.fill(c, 'evenodd');
				}
				const flo = clamp(3000 / mPx, 1, 30); // fondut d'environ 3 km
				cx.save();
				if (camiDom) cx.clip(camiDom, 'evenodd');
				cx.setTransform(1, 0, 0, 1, 0, 0);
				cx.filter = `blur(${(flo * dpr).toFixed(1)}px)`;
				// de prèp, lo dialècte es pertot : la tencha s'esvalís a mitat
				cx.globalAlpha = T.tencha * lerp(1, 0.3, clamp((z - 7) / 4));
				cx.drawImage(off, 0, 0);
				cx.restore();
			}

			/* Lo Creissent : zòna de transicion, en asclas */
			if (J.creissent && this._creissent) {
				const motiu = document.createElement('canvas');
				motiu.width = motiu.height = 9;
				const m = motiu.getContext('2d');
				m.strokeStyle = T.lenga;
				m.lineWidth = 1.2;
				m.beginPath();
				m.moveTo(-1, 10);
				m.lineTo(10, -1);
				m.stroke();
				for (const f of this._creissent.features) {
					const c = new Path2D();
					for (const anels of poligons(f.geometry)) cami(anels, c);
					cx.save();
					cx.globalAlpha = 0.45;
					cx.fillStyle = cx.createPattern(motiu, 'repeat');
					cx.fill(c, 'evenodd');
					cx.globalAlpha = 0.5;
					cx.strokeStyle = T.lenga;
					cx.lineWidth = 0.8;
					cx.stroke(c);
					cx.restore();
				}
			}

			/* Contorns administratius : regions en tirets, despartaments fins */
			const contorns = (lista, larg, dash, al) => {
				cx.save();
				cx.strokeStyle = `rgba(${T.admin}, ${al})`;
				cx.lineWidth = larg;
				cx.setLineDash(dash);
				cx.lineJoin = 'round';
				for (const [, , anels] of lista || []) cx.stroke(cami(anels));
				cx.restore();
			};
			if (J.despartaments) contorns(this._limits?.despartaments, 0.7, [], 0.28);
			if (J.regions) contorns(this._limits?.regions, 1.2, [6, 4], 0.45);

			/* La frontièra de la lenga (demanda de Romain, 2026-10-07) : SONQUE de
			   ponches tèrra cuècha, lo fons demòra lo meteis d'un costat e de
			   l'autre. De prèp, sabèm pas al quilomètre près ont passa : los
			   ponches palisson e una benda difusa de quauques quilomètres ditz
			   « per aquí ». */
			if (J.frontiera && dom) {
				const vague = clamp((z - 7.5) / 2.5);
				const linhas = dom.linhas.map((l) => l.map(pt));
				const traçar = () => {
					cx.beginPath();
					for (const l of linhas) {
						cx.moveTo(l[0][0], l[0][1]);
						for (let i = 1; i < l.length; i++) cx.lineTo(l[i][0], l[i][1]);
					}
				};
				cx.save();
				cx.strokeStyle = T.lenga;
				cx.lineCap = 'round';
				cx.lineJoin = 'round';
				if (vague > 0.01) {
					const larg = Math.max(4, 4000 / mPx);
					traçar();
					for (const [k, al] of [[1, 0.05], [0.55, 0.06]]) {
						cx.globalAlpha = vague * al;
						cx.lineWidth = larg * k;
						cx.stroke();
					}
				}
				cx.setLineDash([0.01, 4.2 + vague * 3]);
				cx.lineWidth = 1.4 + vague * 0.6;
				cx.globalAlpha = lerp(0.8, 0.3, vague);
				traçar();
				cx.stroke();
				cx.restore();
			}

			/* Noms dels dialèctes e del Creissent : de luènh sonque (de prèp, la
			   carta es plena de noms de vilas) */
			const aNoms = clamp((9.6 - z) / 1.2) * clamp((z - 6.35) / 0.3); // ni tròp luènh (noms mesclats) ni tròp prèp
			if (aNoms > 0.01) {
				const noms = [];
				if (J.dialectes && this._dial) for (const f of this._dial.features) noms.push([f.properties, T.dial[f.properties.kod]]);
				if (J.creissent && this._creissent) for (const f of this._creissent.features) noms.push([f.properties, T.lenga]);
				const fs = clamp(11 + (z - 6) * 1.2, 11, 14);
				cx.save();
				cx.font = `700 ${fs.toFixed(1)}px Luciole, sans-serif`;
				cx.letterSpacing = (fs * 0.28).toFixed(1) + 'px';
				cx.textAlign = 'center';
				cx.textBaseline = 'middle';
				cx.lineJoin = 'round';
				for (const [pr, color] of noms) {
					const [x, y] = pt(pr.eti);
					const t = (this._lang === 'fr' ? pr.fr : pr.oc).toUpperCase();
					cx.globalAlpha = aNoms;
					cx.strokeStyle = T.liser;
					cx.lineWidth = 3.5;
					cx.strokeText(t, x, y);
					cx.globalAlpha = aNoms;
					cx.fillStyle = color;
					cx.fillText(t, x, y);
				}
				cx.restore();
			}
			if (dom) this._cv.style.opacity = '1';
		}
	});
	return new Cola();
}
