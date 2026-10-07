// Còla de donadas : las jaces del catalògue que lo site pinta el meteis
// (frontièra de la lenga, dialèctes, Creissent, regions, despartaments). Un
// canavàs dins un pan entre las tuèlas (200) e las estelas (350) : las jaces
// valon per totes los fonses, e demòran jos los noms de la carta en estelas.
//
// Dialèctes (2026-10-07) : zònas de la carta d'Occitanica, calada en
// Lambert-93, corregidas (Gevaudan, còsta). Las limits entre dialèctes son pas
// de traches mas de fonduts larges (causida de Romain : las parlars se
// mesclan). Un dialècte (o lo Creissent) se pòt causir : sol el demòra, e sa
// color se difusa sus son territòri a partir de son còr.
import { cargarLimits } from './colaEstelas.js';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const dossa = (t) => 1 - Math.pow(1 - t, 3); // arribada doça
// mescla de doas colors #rrggbb (t = part de la segonda)
const mesclar = (a, b, t) => {
	const h = (c, i) => parseInt(c.slice(1 + 2 * i, 3 + 2 * i), 16);
	return '#' + [0, 1, 2].map((i) => Math.round(lerp(h(a, i), h(b, i), t)).toString(16).padStart(2, '0')).join('');
};

// Una color per dialècte, dins l'esperit de la carta d'Occitanica (violet
// gascon, magenta lengadocian, ròse provençal, irangis del nòrd) ; en
// daltonisme, la paleta Okabe-Ito
const COLORS = {
	sorne: { gas: '#9d7dff', lan: '#ff3f86', pro: '#ffb0dc', lem: '#ffa22e', auv: '#e8482a', viv: '#ffe27a' },
	clar: { gas: '#6a45d0', lan: '#c2185b', pro: '#e573ad', lem: '#e07b00', auv: '#a8321a', viv: '#c9a227' },
	dalt: { gas: '#0072b2', lan: '#d55e00', pro: '#cc79a7', lem: '#e69f00', auv: '#009e73', viv: '#56b4e9' }
};
const TEMAS = {
	sorne: { lenga: '#e0612f', admin: '245, 234, 216', ombra: 'rgba(18, 9, 6, 0.9)', clar: false, tencha: 0.3 },
	clar: { lenga: '#b53d17', admin: '46, 29, 20', ombra: 'rgba(245, 234, 216, 0.95)', clar: true, tencha: 0.22 }
};
const temaDe = (clar, dalt) => ({
	...(clar ? TEMAS.clar : TEMAS.sorne),
	...(dalt ? { lenga: clar ? '#1f5f8f' : '#6fb1ff' } : {}),
	dial: dalt ? COLORS.dalt : clar ? COLORS.clar : COLORS.sorne
});

const DURADA = 1700; // ms : difusion d'un dialècte causit
let dialPromesa = null,
	creissentPromesa = null;
const cargarJson = (url) =>
	fetch(url)
		.then((r) => (r.ok ? r.json() : null))
		.catch(() => null);

export function crearColaDonadas(
	L,
	{ clar = false, dalt = false, lang = 'oc', jaces = {}, ocupat = null, onSurvòl = null, onCausida = null } = {}
) {
	const Cola = L.Layer.extend({
		options: {
			pane: 'donadas',
			padding: 0.3,
			attribution:
				// « Carte linguistique de l'Occitanie », CIRDÒC – Institut occitan de
				// cultura, Licence Ouverte (verificat lo 2026-10-07) : citar la font
				`Lenga e dialèctes : d'aprèp <a href="https://www.occitanica.eu/items/show/21242" target="_blank" rel="noopener">CIRDÒC – Occitanica</a> (Licéncia dobèrta) · Creissent : d'aprèp Tourtoulon e Bringuier (1876)`
		},

		initialize() {
			this._tem = temaDe(clar, dalt);
			this._lang = lang;
			this._jaces = { ...jaces };
			this._sel = null; // dialècte causit (còdi) o 'cro' pel Creissent
			this._pus = null; // zòna jos lo cursor
			this._anim = null;
			this._calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		},

		onAdd(map) {
			if (!map.getPane('donadas')) {
				const p = map.createPane('donadas');
				p.style.zIndex = '300';
				p.style.pointerEvents = 'none';
				// fondu d'arrivada sul pan, pas sul canavàs : una transicion en linha
				// sul canavàs remplaçariá la de Leaflet pel zoom (las colors
				// sautavan al luòc de seguir)
				p.style.opacity = '0';
				p.style.transition = 'opacity 0.9s ease';
			}
			this._cv = L.DomUtil.create('canvas', 'cola-donadas leaflet-zoom-animated', map.getPane('donadas'));
			this._cx = this._cv.getContext('2d');
			// imatges en cache (lo dessenh d'una image d'animacion las recòpia)
			this._imgTotes = document.createElement('canvas');
			this._imgSel = document.createElement('canvas');
			this._masca = document.createElement('canvas');
			this._trab = document.createElement('canvas');
			cargarLimits().then((l) => {
				this._limits = l;
				this._update();
			});
			this._cargar();
			this._update();
			// los noms se pintan dins lo canavàs : esperar la polissa
			document.fonts?.load('400 12px Luciole').then(() => this._pintar(), () => {});
		},

		onRemove() {
			cancelAnimationFrame(this._raf);
			L.DomUtil.remove(this._cv);
		},

		getEvents() {
			const ev = {
				viewreset: this._update,
				moveend: this._update,
				resize: this._update,
				zoom: this._onZoom,
				mousemove: this._onMirga,
				mouseout: this._onSortida,
				click: this._onClic
			};
			if (this._zoomAnimated) ev.zoomanim = this._onAnimZoom;
			return ev;
		},

		// Las donadas d'una jaça se telecargan sonque quand es alucada
		_cargar() {
			// una zòna causida abans que sas donadas arriben (pastilha del panèl) :
			// sa difusion e son nom venon un còp las donadas aquí
			const tornarCausir = (cro) => {
				if (this._sel && (this._sel === 'cro') === cro) this._causir(this._sel, true);
			};
			if (this._jaces.dialectes && !this._dial)
				(dialPromesa ??= cargarJson('/data/dialectes.geojson')).then((d) => {
					this._dial = d;
					this._update();
					tornarCausir(false);
				});
			if (this._jaces.creissent && !this._creissent)
				(creissentPromesa ??= cargarJson('/data/creissent.geojson')).then((d) => {
					this._creissent = d;
					this._update();
					tornarCausir(true);
				});
		},

		setJaces(j) {
			// la jaça dels dialèctes ven d'èsser alucada (sovent pel meteis clic
			// qu'una pastilha) : sas zònas totas se mòstran pas abans la difusion
			if (j.dialectes && !this._jaces.dialectes) this._dialAlucat = performance.now();
			this._jaces = { ...j };
			// una zòna causida dont la jaça s'escantís es pas pus causida
			if (this._sel && !(this._sel === 'cro' ? j.creissent : j.dialectes)) this._causir(null, false);
			if (this._pus && !(this._pus === 'cro' ? j.creissent : j.dialectes)) this._survòl(null);
			this._cargar();
			this._update();
		},
		setTema(c, d) {
			this._tem = temaDe(c, d);
			this._update();
		},
		setLenga(l) {
			this._lang = l;
			this._pintar();
		},
		// Causida venguda de defòra (lo panèl) : un dialècte, 'cro', o null
		causir(kod) {
			if (kod !== this._sel) this._causir(kod, true);
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

		/* ---------- Survòl e causida ---------- */
		_interactiu() {
			return !!(this._jaces.dialectes && this._dial) || !!(this._jaces.creissent && this._creissent);
		},
		// La zòna jos un ponch : lo Creissent d'en primièr (es dessús), puèi
		// los dialèctes ; quand un dialècte es causit, sonque el
		_zonaA(lp) {
			const g = this._geo;
			if (!g || !this._interactiu()) return null;
			this._cxTest ??= document.createElement('canvas').getContext('2d');
			const x = lp.x - this._min.x,
				y = lp.y - this._min.y;
			if (this._jaces.creissent && g.cro && this._cxTest.isPointInPath(g.cro.c, x, y, 'evenodd')) return 'cro';
			if (this._jaces.dialectes && g.zonas) {
				// hors du domaine : rien (les zones sont découpées par lui)
				if (g.dom && !this._cxTest.isPointInPath(g.dom, x, y, 'evenodd')) return null;
				for (const zn of g.zonas) if (this._cxTest.isPointInPath(zn.c, x, y, 'evenodd')) return zn.kod;
			}
			return null;
		},
		_survòl(k) {
			if (k === this._pus) return;
			this._pus = k;
			onSurvòl?.(k, this._nomDe(k));
			this._pintar();
		},
		_onMirga(e) {
			if (e.originalEvent?.pointerType === 'touch' || !this._interactiu()) return;
			const k = ocupat?.(e.layerPoint) ? null : this._zonaA(e.layerPoint);
			this._survòl(k);
			if (k) this._map.getContainer().style.cursor = 'pointer';
		},
		_onSortida() {
			this._survòl(null);
		},
		_onClic(e) {
			if (!this._interactiu() || ocupat?.(e.layerPoint)) return;
			const k = this._zonaA(e.layerPoint);
			// un clic sus la zòna causida o defòra : totes los dialèctes tornan
			this._causir(k && k !== this._sel ? k : null, true);
		},
		_nomDe(k) {
			if (!k) return null;
			const f = (k === 'cro' ? this._creissent : this._dial)?.features.find((x) => x.properties.kod === k);
			return f ? { kod: k, oc: f.properties.oc, fr: f.properties.fr, cro: k === 'cro' } : null;
		},
		_causir(k, anim) {
			const de = this._sel;
			this._sel = k;
			// las zònas totas èran visiblas abans la causida ? (sonque alara se
			// fondon ; se la jaça ven d'èsser alucada, lo dialècte se difusa sol)
			const totesAvant = !de && !!this._dial && performance.now() - (this._dialAlucat ?? 0) > 400;
			this._anim = anim && !this._calm ? { de, a: k, t0: performance.now(), totesAvant } : null;
			this._prepSel();
			onCausida?.(k, this._nomDe(k));
			this._pintar(); // tot d'ora : remplaça un dessenh de totas las zònas fach just abans
			this._bocla();
		},
		_bocla() {
			cancelAnimationFrame(this._raf);
			const pas = () => {
				this._pintar();
				if (this._anim && performance.now() - this._anim.t0 < DURADA + 50) this._raf = requestAnimationFrame(pas);
				else {
					this._anim = null;
					this._pintar();
				}
			};
			this._raf = requestAnimationFrame(pas);
		},

		/* ---------- Geometria (a cada recalatge) ---------- */
		_update() {
			const map = this._map;
			if (!map || !this._cv) return;
			const p = this.options.padding,
				size = map.getSize();
			const min = map.containerPointToLayerPoint(size.multiplyBy(-p)).round();
			const tal = size.multiplyBy(1 + 2 * p).round();
			this._center = map.getCenter();
			this._zoom = map.getZoom();
			this._min = min;
			L.DomUtil.setPosition(this._cv, min);
			const dpr = Math.min(devicePixelRatio || 1, 2);
			this._dpr = dpr;
			this._W = tal.x;
			this._H = tal.y;
			for (const c of [this._cv, this._imgTotes, this._imgSel, this._trab]) {
				c.width = Math.round(tal.x * dpr);
				c.height = Math.round(tal.y * dpr);
			}
			this._cv.style.width = tal.x + 'px';
			this._cv.style.height = tal.y + 'px';
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
			const zona = (f) => {
				const c = new Path2D();
				let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
				for (const anels of poligons(f.geometry)) {
					cami(anels, c);
					for (const [lon, lat] of anels[0]) {
						const [x, y] = pt([lon, lat]);
						x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
					}
				}
				return { kod: f.properties.kod, c, eti: pt(f.properties.eti), props: f.properties, bbox: [x0, y0, x1, y1] };
			};
			const dom = this._limits?.domeni;
			this._geo = {
				pt,
				mPx: 112600 / Math.pow(2, z), // mètres par pixel vers 44° N
				dom: dom?.anels?.length ? cami(dom.anels) : null,
				linhas: dom ? dom.linhas.map((l) => l.map(pt)) : null,
				zonas: this._dial ? this._dial.features.map(zona) : null,
				cro: this._creissent ? zona(this._creissent.features[0]) : null,
				regions: this._jaces.regions ? (this._limits?.regions || []).map(([, , anels]) => cami(anels)) : null,
				deps: this._jaces.despartaments ? (this._limits?.despartaments || []).map(([, , anels]) => cami(anels)) : null
			};
			this._prepTotes();
			this._prepSel();
			this._pintar();
			if (dom) map.getPane('donadas').style.opacity = '1';
		},

		// Una zòna (o totas) en tencha fonduda, dins un canavàs de la talha del
		// principal : las zònas espandidas d'en primièr cap a l'exterior (lo
		// fondut se palís pas sus la còsta), puèi las vertadièras dessús
		_tenchaDins(c, zonas) {
			const g = c.getContext('2d'),
				G = this._geo,
				T = this._tem,
				dpr = this._dpr;
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.clearRect(0, 0, c.width, c.height);
			if (!zonas.length) return;
			const flo = clamp(7000 / G.mPx, 1.5, 60); // fondut d'environ 7 km
			const t = this._trab,
				tg = t.getContext('2d');
			tg.setTransform(1, 0, 0, 1, 0, 0);
			tg.clearRect(0, 0, t.width, t.height);
			tg.setTransform(dpr, 0, 0, dpr, 0, 0);
			tg.lineJoin = 'round';
			for (const zn of zonas) {
				tg.strokeStyle = T.dial[zn.kod];
				tg.lineWidth = flo * 6;
				tg.stroke(zn.c);
			}
			for (const zn of zonas) {
				tg.fillStyle = T.dial[zn.kod];
				tg.fill(zn.c, 'evenodd');
			}
			g.save();
			g.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (G.dom) g.clip(G.dom, 'evenodd');
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.filter = `blur(${(flo * dpr).toFixed(1)}px)`;
			g.drawImage(t, 0, 0);
			g.restore();
		},
		_prepTotes() {
			if (this._jaces.dialectes && this._geo?.zonas) this._tenchaDins(this._imgTotes, this._geo.zonas);
		},
		// Lo dialècte causit, sol : son fondut cap als vesins se ditz transicion
		_prepSel() {
			const G = this._geo;
			if (!G || !this._sel || this._sel === 'cro' || !G.zonas) return;
			const zn = G.zonas.find((x) => x.kod === this._sel);
			if (zn) this._tenchaDins(this._imgSel, [zn]);
		},

		/* ---------- Dessenh (a cada recalatge, e a cada image d'una animacion) ---------- */
		_pintar() {
			const G = this._geo;
			if (!G || !this._cv) return;
			const cx = this._cx,
				T = this._tem,
				J = this._jaces,
				dpr = this._dpr,
				z = this._zoom;
			cx.setTransform(1, 0, 0, 1, 0, 0);
			cx.clearRect(0, 0, this._cv.width, this._cv.height);
			cx.setTransform(dpr, 0, 0, dpr, 0, 0);
			// de prèp, lo dialècte es pertot : la tencha s'esvalís
			const aT = T.tencha * lerp(1, 0.3, clamp((z - 7) / 4));
			const an = this._anim,
				p = an ? clamp((performance.now() - an.t0) / DURADA) : 1;

			/* Dialèctes */
			if (J.dialectes && G.zonas) {
				const selDial = this._sel && this._sel !== 'cro' ? this._sel : null;
				// totes : visibles sens causida ; s'esvalisson quand un dialècte es
				// causit, tornan quand se descausís
				let aTotes = selDial ? 0 : 1;
				if (an && !an.a) aTotes = dossa(clamp(p / 0.6));
				if (an && an.a && !an.de) aTotes = an.totesAvant ? 1 - dossa(clamp(p / 0.35)) : 0;
				if (aTotes > 0.01) this._copiar(this._imgTotes, aT * aTotes);
				// sol sus la carta, lo dialècte causit pòt èsser mai marcat
				if (selDial) {
					if (an && an.a === selDial) this._difusar(selDial, p, aT * 1.6);
					else this._copiar(this._imgSel, aT * 1.6);
				}
				// survòl (sens causida) : la zòna s'esclarzís un pauc
				if (!selDial && this._pus && this._pus !== 'cro') {
					const zn = G.zonas.find((x) => x.kod === this._pus);
					if (zn) {
						cx.save();
						if (G.dom) cx.clip(G.dom, 'evenodd');
						cx.globalAlpha = 0.12;
						cx.fillStyle = T.dial[zn.kod];
						cx.fill(zn.c, 'evenodd');
						cx.restore();
					}
				}
			}

			/* Lo Creissent : zòna de transicion, en asclas */
			if (J.creissent && G.cro) {
				const causit = this._sel === 'cro';
				const autreCausit = this._sel && !causit;
				let a = autreCausit ? 0.15 : this._pus === 'cro' || causit ? 0.75 : 0.45;
				if (an && an.a === 'cro') a = 0.75;
				const motiu = document.createElement('canvas');
				motiu.width = motiu.height = 9;
				const m = motiu.getContext('2d');
				m.strokeStyle = T.lenga;
				m.lineWidth = 1.2;
				m.beginPath();
				m.moveTo(-1, 10);
				m.lineTo(10, -1);
				m.stroke();
				cx.save();
				if (an && an.a === 'cro') this._mascaDifusion(G.cro, p); // clip progressiu
				cx.globalAlpha = a;
				cx.fillStyle = cx.createPattern(motiu, 'repeat');
				cx.fill(G.cro.c, 'evenodd');
				cx.globalAlpha = a * 0.9;
				cx.strokeStyle = T.lenga;
				cx.lineWidth = 0.8;
				cx.stroke(G.cro.c);
				cx.restore();
			}

			/* Contorns administratius : regions en tirets, despartaments fins */
			const contorns = (lista, larg, dash, al) => {
				cx.save();
				cx.strokeStyle = `rgba(${T.admin}, ${al})`;
				cx.lineWidth = larg;
				cx.setLineDash(dash);
				cx.lineJoin = 'round';
				for (const c of lista) cx.stroke(c);
				cx.restore();
			};
			if (G.deps) contorns(G.deps, 0.7, [], 0.28);
			if (G.regions) contorns(G.regions, 1.2, [6, 4], 0.45);

			/* La frontièra de la lenga (demanda de Romain, 2026-10-07) : SONQUE de
			   ponches tèrra cuècha, lo fons demòra lo meteis d'un costat e de
			   l'autre. De prèp, sabèm pas al quilomètre près ont passa : los
			   ponches palisson e una benda difusa de quauques quilomètres ditz
			   « per aquí ». */
			if (J.frontiera && G.linhas) {
				const vague = clamp((z - 7.5) / 2.5);
				const traçar = () => {
					cx.beginPath();
					for (const l of G.linhas) {
						cx.moveTo(l[0][0], l[0][1]);
						for (let i = 1; i < l.length; i++) cx.lineTo(l[i][0], l[i][1]);
					}
				};
				cx.save();
				cx.strokeStyle = T.lenga;
				cx.lineCap = 'round';
				cx.lineJoin = 'round';
				if (vague > 0.01) {
					const larg = Math.max(4, 4000 / G.mPx);
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

			/* Noms : capitalas espaçadas, una ombra doça (causida de Romain : pas
			   de contorn negre). De luènh sonque : de prèp, la carta es plena de
			   noms de vilas. Quand un dialècte es causit, sonque son nom. */
			const aNoms = clamp((9.6 - z) / 1.2) * clamp((z - 6.35) / 0.3);
			if (aNoms > 0.01) {
				const noms = [];
				if (J.dialectes && G.zonas)
					for (const zn of G.zonas) if (!this._sel || this._sel === zn.kod) noms.push([zn, T.dial[zn.kod]]);
				if (J.creissent && G.cro && (!this._sel || this._sel === 'cro')) noms.push([G.cro, T.lenga]);
				const fs = clamp(10.5 + (z - 6) * 1.1, 10.5, 13);
				cx.save();
				cx.font = `400 ${fs.toFixed(1)}px Luciole, sans-serif`;
				cx.letterSpacing = (fs * 0.32).toFixed(1) + 'px';
				cx.textAlign = 'center';
				cx.textBaseline = 'middle';
				cx.shadowColor = T.ombra;
				cx.shadowBlur = 7;
				for (const [zn, color] of noms) {
					let a = aNoms;
					if (an && an.a === zn.kod) a *= clamp((p - 0.25) / 0.4); // lo nom arriba aprèp la color
					if (a < 0.01) continue;
					const t = (this._lang === 'fr' ? zn.props.fr : zn.props.oc).toUpperCase();
					cx.globalAlpha = a;
					cx.fillStyle = T.clar ? mesclar(color, '#2e1d14', 0.25) : mesclar(color, '#fff8ec', 0.35);
					cx.fillText(t, zn.eti[0], zn.eti[1]);
				}
				cx.restore();
			}
		},

		_copiar(img, a) {
			const cx = this._cx;
			cx.save();
			cx.setTransform(1, 0, 0, 1, 0, 0);
			cx.globalAlpha = a;
			cx.drawImage(img, 0, 0);
			cx.restore();
		},

		// Contorn organic d'una taca d'encre que s'espandís : un cercle
		// trebolat per quauques sinusas lentas, que viran doçament
		_contornTaca(zn, p) {
			const [ex, ey] = zn.eti,
				[x0, y0, x1, y1] = zn.bbox;
			const Rmax = Math.max(Math.hypot(x0 - ex, y0 - ey), Math.hypot(x1 - ex, y0 - ey), Math.hypot(x0 - ex, y1 - ey), Math.hypot(x1 - ex, y1 - ey)) * 1.12;
			const R = Rmax * dossa(p),
				fase = p * 1.4,
				pts = [];
			for (let i = 0; i < 120; i++) {
				const th = (i / 120) * 6.2832;
				const r = R * (1 + 0.1 * Math.sin(3 * th + 1.3 + fase) + 0.06 * Math.sin(7 * th + 4.1 - fase * 1.7) + 0.035 * Math.sin(13 * th + 2.2 + fase * 2.3));
				pts.push([ex + r * Math.cos(th), ey + r * Math.sin(th)]);
			}
			return pts;
		},
		// La difusion : la tencha del dialècte causit, vista a travèrs d'una taca
		// que creis (masca dessenhada en pichon puèi agrandida : vòra doça a
		// bon mercat), e un front lusent que s'esvalís
		_difusar(kod, p, aT) {
			const G = this._geo,
				zn = G.zonas.find((x) => x.kod === kod);
			if (!zn) return;
			const pts = this._contornTaca(zn, p);
			const t = this._trab,
				tg = t.getContext('2d'),
				dpr = this._dpr;
			// masca en pichon (1/6)
			const m = this._masca,
				k = 1 / 6;
			m.width = Math.max(1, Math.round(t.width * k));
			m.height = Math.max(1, Math.round(t.height * k));
			const mg = m.getContext('2d');
			mg.clearRect(0, 0, m.width, m.height);
			mg.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
			mg.fillStyle = '#000';
			mg.beginPath();
			pts.forEach(([x, y], i) => (i ? mg.lineTo(x, y) : mg.moveTo(x, y)));
			mg.closePath();
			mg.fill();
			// tencha × masca
			tg.setTransform(1, 0, 0, 1, 0, 0);
			tg.globalCompositeOperation = 'source-over';
			tg.clearRect(0, 0, t.width, t.height);
			tg.drawImage(this._imgSel, 0, 0);
			tg.globalCompositeOperation = 'destination-in';
			tg.imageSmoothingQuality = 'high';
			tg.drawImage(m, 0, 0, t.width, t.height);
			tg.globalCompositeOperation = 'source-over';
			this._copiar(t, aT);
			// lo front : una linha lusenta, dins la zòna sonque, que s'esvalís
			const cx = this._cx,
				T = this._tem,
				aF = (1 - dossa(p)) * 0.9;
			if (aF > 0.02) {
				cx.save();
				cx.clip(zn.c, 'evenodd');
				if (G.dom) cx.clip(G.dom, 'evenodd');
				cx.beginPath();
				pts.forEach(([x, y], i) => (i ? cx.lineTo(x, y) : cx.moveTo(x, y)));
				cx.closePath();
				const color = T.dial[kod];
				cx.strokeStyle = T.clar ? color : mesclar(color, '#fff8ec', 0.45);
				cx.shadowColor = color;
				cx.shadowBlur = 14;
				cx.globalAlpha = aF;
				cx.lineWidth = 2.2;
				cx.stroke();
				cx.globalAlpha = aF * 0.35;
				cx.lineWidth = 9;
				cx.stroke();
				cx.restore();
			}
		},
		// Pel Creissent (en asclas) : la taca serv de clip
		_mascaDifusion(zn, p) {
			const cx = this._cx,
				pts = this._contornTaca(zn, p);
			cx.beginPath();
			pts.forEach(([x, y], i) => (i ? cx.lineTo(x, y) : cx.moveTo(x, y)));
			cx.closePath();
			cx.clip();
		}
	});
	return new Cola();
}
