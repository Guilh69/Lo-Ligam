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
import { cargarLimits, INTRO } from './colaEstelas.js';
import { nivèlsDezoom, aDialectes, aDetalh } from './escalas.js';
import { prepContorn, traçarPart, estelaCap, avançada, TOTAL as TOTAL_APAR } from './aparicion.js';
import { proj0, projectar } from './projeccion.js';
import { cadreDe } from './centrar.js';
import { telaNoms } from './etiquetasVivas.js';
import { cargarFranca, francaCargada, dinsFranca, retalharFranca, pintarAmbFranca } from './franca.js';

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
	// lo gascon en blau prigond, l'« otramar » (causida de Romain, 2026-10-10 ; abans violet)
	sorne: { gas: '#5b7fff', lan: '#ff3f86', pro: '#ffb0dc', lem: '#ffa22e', auv: '#e8482a', viv: '#ffe27a' },
	clar: { gas: '#2350d8', lan: '#c2185b', pro: '#e573ad', lem: '#e07b00', auv: '#a8321a', viv: '#c9a227' },
	dalt: { gas: '#0072b2', lan: '#d55e00', pro: '#cc79a7', lem: '#e69f00', auv: '#009e73', viv: '#56b4e9' }
};
const TEMAS = {
	sorne: { estela: '#ffe9b8', lenga: '#e0612f', occitan: '#d9343f', occitanTèxt: '#ffc2b8', admin: '245, 234, 216', ombra: 'rgba(18, 9, 6, 0.9)', clar: false, tencha: 0.3 },
	clar: { estela: '#9a6a1c', lenga: '#b53d17', occitan: '#b0202c', occitanTèxt: '#7e121c', admin: '46, 29, 20', ombra: 'rgba(245, 234, 216, 0.95)', clar: true, tencha: 0.36 } // (tèma clar : tenchas mai fòrtas, retorn de Romain 2026-10-10 : zònas e noms pauc legibles)
};
const temaDe = (clar, dalt) => ({
	...(clar ? TEMAS.clar : TEMAS.sorne),
	...(dalt ? { lenga: clar ? '#1f5f8f' : '#6fb1ff', occitan: clar ? '#1f5f8f' : '#4a90d9', occitanTèxt: clar ? '#123a57' : '#cfe4ff' } : {}),
	dial: dalt ? COLORS.dalt : clar ? COLORS.clar : COLORS.sorne
});

// Lo luòc del nom d'un dialècte, quand lo de las donadas va pas : lo
// lengadocian, al mitan de sa zòna, tombava sus las Cevenas (retorn de
// Romain : « un peu plus en haut, il y a de l'espace »)
// lo nom de l'Occitània unida, de luènh (vers Rodés, al mitan)
const ETI_OCCITAN = [2.5, 44.3];
const ETI_NOM = { lan: [2.2, 43.95] };

// los luòcs ensajats per un nom de dialècte (a partir de son ponch)
const DECALATGES_NOM = [[0, 0], [0, -16], [0, 16], [-36, 0], [36, 0], [0, -30], [0, 30], [-30, -18], [30, 18], [30, -18], [-30, 18], [0, -44], [0, 44], [-60, 0], [60, 0], [-50, -30], [50, 30], [50, -30], [-50, 30], [0, -58], [0, 58]];

const DURADA = 1700; // ms : difusion d'un dialècte causit
// l'Occitània unida ↔ los dialèctes : la mescla (s), lo balet (s)
const DURADA_MESCLA = 1.4,
	DURADA_BALET = 2.2,
	DURADA_VUÈG = 1.8;
const easeS = (t) => (1 - Math.cos(Math.PI * t)) / 2;
let dialPromesa = null,
	creissentPromesa = null,
	mixPromesa = null,
	bandasPromesa = null;
const cargarJson = (url) =>
	fetch(url)
		.then((r) => (r.ok ? r.json() : null))
		.catch(() => null);

export function crearColaDonadas(
	L,
	{ clar = false, dalt = false, lang = 'oc', jaces = {}, ocupat = null, obstacles = null, onSurvòl = null, onCausida = null } = {}
) {
	const Cola = L.Layer.extend({
		options: {
			pane: 'donadas',
			padding: 0.3,
			attribution:
				// « Carte linguistique de l'Occitanie », CIRDÒC – Institut occitan de
				// cultura, Licence Ouverte (verificat lo 2026-10-07) : citar la font
				`Lenga e dialèctes : d'aprèp <a href="https://www.occitanica.eu/items/show/21242" target="_blank" rel="noopener">CIRDÒC – Occitanica</a> (Licéncia dobèrta) · Creissent : d'aprèp Tourtoulon e Bringuier (1876) · Aran e valadas : © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> (ODbL) · regions e despartaments : IGN e INSEE via <a href="https://github.com/gregoiredavid/france-geojson" target="_blank" rel="noopener">france-geojson</a> (Licéncia dobèrta)`
		},

		initialize() {
			this._tem = temaDe(clar, dalt);
			this._lang = lang;
			this._jaces = { ...jaces };
			// las zònas causidas (retorn de Romain : se'n pòt causir mantuna) :
			// còdis de dialèctes, e 'cro' pel Creissent, dins l'òrdre de la causida
			this._sels = [];
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
			// (los noms, sus lor tela : etiquetasVivas.js)
			this._noms = telaNoms(L, this._cv, map, (cx) => {
				if (!(this._franca && francaCargada() && this._min)) return;
				cx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
				retalharFranca(cx, this._map, this._zoom, this._map.getPixelOrigin().add(this._min));
			});
			// imatges en cache (lo dessenh d'una image d'animacion las recòpia)
			this._imgTotes = document.createElement('canvas');
			this._imgUni = document.createElement('canvas');
			this._imgFlo = document.createElement('canvas');
			this._imgSel = document.createElement('canvas');
			this._imgCro = document.createElement('canvas');
			this._imgMix = document.createElement('canvas');
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
			cancelAnimationFrame(this._rafIntro);
			cancelAnimationFrame(this._rafRel);
			cancelAnimationFrame(this._rafApar);
			L.DomUtil.remove(this._cv);
			this._noms?.levar();
			this._noms = null;
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
				const totas = this._sels;
				if (!totas.some((k) => (k === 'cro') === cro)) return;
				this._sels = totas.filter((k) => (k === 'cro') !== cro);
				this._aplicar(totas, true);
			};
			if (this._jaces.dialectes && !this._dial)
				(dialPromesa ??= cargarJson('/data/dialectes.geojson')).then((d) => {
					this._dial = d;
					this._update();
					tornarCausir(false);
				});
			// bendas de transicion (largor del fondut segon la recèrca) : amb los dialèctes
			if (this._jaces.dialectes && !this._bandas)
				(bandasPromesa ??= cargarJson('/data/transicions.geojson')).then((d) => {
					this._bandas = d;
					this._update();
				});
			// zònas mixtas (Ròia, Mónegue, comunas declaradas) : amb los dialèctes
			if ((this._jaces.dialectes || this._jaces.frontiera) && !this._mix)
				(mixPromesa ??= cargarJson('/data/zonas-mixtas.geojson')).then((d) => {
					this._mix = d;
					this._update();
				});
			if (this._jaces.creissent && !this._creissent)
				(creissentPromesa ??= cargarJson('/data/creissent.geojson')).then((d) => {
					this._creissent = d;
					this._update();
					tornarCausir(true);
				});
		},

		// Lo mòde « Lengas de França » : l'occitan coma las autras lengas, sonque
		// sa part francesa tant que son environament es pas causit (Romain, 2026-10-10)
		setFranca(on) {
			on = !!on;
			if (on === this._franca) return;
			this._franca = on;
			if (on) cargarFranca().then(() => (this._fondutFr = performance.now()) && this._map && this._pintar());
			else if (this._map) {
				// (la rèsta apareis : lo fuòc d'artifici dels dialèctes, coma quand se cochan)
				this.demandarBalet();
				this._pintar();
			}
		},
		setJaces(j) {
			// la jaça dels dialèctes ven d'èsser alucada (sovent pel meteis clic
			// qu'una pastilha) : sas zònas totas se mòstran pas abans la difusion
			if (j.dialectes && !this._jaces.dialectes) {
				this._dialAlucat = performance.now();
				// a cada còp que se cochan, los dialèctes arriban en fuòc
				// d'artifici (demanda de Romain, 2026-10-09)
				if (!this._calm) this._baletDemandat = true;
			}
			// regions e despartaments alucats : d'estelas ne fan lo torn (demanda de Romain)
			for (const k of ['regions', 'despartaments', 'frontiera'])
				if (j[k] && !this._jaces[k] && !this._calm) {
					(this._apar ??= {})[k] = performance.now();
					this._lançarApar();
				}
			this._jaces = { ...j };
			// una zòna causida dont la jaça s'escantís es pas pus causida
			const resta = this._sels.filter((k) => (k === 'cro' ? j.creissent : j.dialectes));
			if (resta.length !== this._sels.length) this._aplicar(resta, false);
			if (this._pus && !(this._pus === 'cro' ? j.creissent : j.dialectes)) this._survòl(null);
			this._cargar();
			this._update();
			this._lançarBalet();
		},
		// Lo fuòc d'artifici dels dialèctes, demandat en los cochant : sonque a
		// l'escala dels dialèctes (de pus luènh, la carta i vòla e lo jòga a
		// l'arribada), e sens lo roge de l'occitan unificat que s'esvaniriá
		_lançarBalet() {
			const n = this._nivèls;
			if (!this._baletDemandat || !n || this._jaces.unificat || !this._jaces.dialectes) return;
			if (this._zoom < n.zDial) return;
			this._baletDemandat = false;
			const R = (this._rel ??= {});
			R.uni = { v: 1, cibla: 1, q: 1 };
			this._relais('uni', 0, DURADA_BALET);
			R.uni.net = true;
		},
		// lo fuòc d'artifici demandat d'en defòra (lo boton « Tornar a l'Occitània »)
		demandarBalet() {
			if (this._calm) return;
			this._baletDemandat = true;
			this._lançarBalet();
		},
		// lo cadre d'un dialècte (la carta i vòla quand se causís de luènh)
		cadreDialècte(k) {
			return cadreDe(this._dial?.features.find((x) => x.properties.kod === k));
		},
		setTema(c, d) {
			this._tem = temaDe(c, d);
			this._update();
		},
		setLenga(l) {
			this._lang = l;
			this._pintar();
		},
		// Causida venguda de defòra (lo panèl) : la lista de las zònas causidas
		// (dialèctes e 'cro' pel Creissent), voida per totas
		// L'entrada en scèna : a la fin, totes los dialèctes se difusan
		// ensems, cadun a partir de son còr (demanda de Romain)
		setIntro(t0) {
			this._tIntro = t0;
			cancelAnimationFrame(this._rafIntro);
			const pas = (ts) => {
				this._pintarA(ts);
				if ((performance.now() - t0) / 1000 < INTRO.fin) this._rafIntro = requestAnimationFrame(pas);
			};
			// (t0 infinit : en espèra de las donadas, res se dessenha)
			if (!this._calm && Number.isFinite(t0)) this._rafIntro = requestAnimationFrame(pas);
			else this._pintar();
		},
		// las donadas dels dialèctes son aquí e lors tenchas preparadas (lo
		// primièr calcul es long : l'entrada en scèna l'espèra)
		prèsta() {
			return Promise.all([dialPromesa, bandasPromesa, mixPromesa, creissentPromesa].filter(Boolean));
		},
		acabarIntro() {
			cancelAnimationFrame(this._rafIntro);
			this._tIntro = null;
			this._pintar();
		},
		// segondas dempuèi l'arribada (sens entrada en scèna : tot es fach)
		_ti() {
			return this._tIntro == null || this._calm ? 99 : (performance.now() - this._tIntro) / 1000;
		},
		// totas las zònas, vistas a travèrs de lors tacas que creisson (masca en
		// pichon puèi agrandida), e lors fronts lusents
		_introDial(ti, a) {
			const G = this._geo,
				dpr = this._dpr,
				[d0, d1] = INTRO.dialectes;
			const t = this._trab,
				tg = t.getContext('2d');
			const m = this._masca,
				k = 1 / 6;
			const mw = Math.max(1, Math.round(t.width * k)),
				mh = Math.max(1, Math.round(t.height * k));
			if (m.width !== mw || m.height !== mh) (m.width = mw), (m.height = mh);
			const mg = m.getContext('2d');
			mg.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
			mg.clearRect(0, 0, m.width / (dpr * k), m.height / (dpr * k));
			mg.fillStyle = '#000';
			const tacas = G.zonas.map((zn, i) => {
				const p = clamp((ti - (d0 + i * 0.12)) / (d1 - d0 - 0.6));
				const pts = p > 0 ? this._contornTaca(zn, p) : null;
				if (pts) {
					mg.beginPath();
					pts.forEach(([x, y], j) => (j ? mg.lineTo(x, y) : mg.moveTo(x, y)));
					mg.closePath();
					mg.fill();
				}
				return { zn, p, pts };
			});
			tg.setTransform(1, 0, 0, 1, 0, 0);
			tg.globalCompositeOperation = 'source-over';
			tg.clearRect(0, 0, t.width, t.height);
			tg.drawImage(this._imgTotes, 0, 0);
			tg.globalCompositeOperation = 'destination-in';
			tg.imageSmoothingQuality = 'high';
			tg.drawImage(m, 0, 0, t.width, t.height);
			tg.globalCompositeOperation = 'source-over';
			this._copiar(t, a);
			const cx = this._cx,
				T = this._tem;
			for (const { zn, p, pts } of tacas) {
				const aF = pts ? (1 - dossa(p)) * 0.8 : 0;
				if (aF < 0.02) continue;
				cx.save();
				cx.clip(zn.c, 'evenodd');
				if (G.dom) cx.clip(G.dom, 'evenodd');
				cx.beginPath();
				pts.forEach(([x, y], j) => (j ? cx.lineTo(x, y) : cx.moveTo(x, y)));
				cx.closePath();
				const color = T.dial[zn.kod];
				cx.strokeStyle = T.clar ? color : mesclar(color, '#fff8ec', 0.45);
				cx.shadowColor = color;
				cx.shadowBlur = 14;
				cx.globalAlpha = aF;
				cx.lineWidth = 2;
				cx.stroke();
				cx.restore();
			}
		},
		// las bóstias dels noms de dialèctes pausats (per las autras còlas)
		caixasNoms() {
			return this._caixasNoms ?? null;
		},
		causir(kods = []) {
			if (kods.length === this._sels.length && kods.every((k) => this._sels.includes(k))) return;
			this._aplicar([...kods], true);
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
			this._noms?.transformar(topLeftOffset, scale);
		},

		/* ---------- Survòl e causida ---------- */
		// L'Occitània unida ↔ los dialèctes (demanda de Romain) : un relais dins
		// lo temps, pas amb lo zoom (coma las estelas e las tuèlas). Cap a
		// l'Occitània unida, los dialèctes se mesclan (s'enfoscan e rogejan)
		// fins al roge unit ; cap als dialèctes, tornan coma a l'entrada en
		// scèna, en fuòc d'artifici, e lors limits se traçan una a una.
		_majUni() {
			const n = this._nivèls;
			if (!n) return;
			// un grand saut de zoom (una recèrca, la vista d'ensemble) : pas de
			// coregrafia a l'arribada, l'estat final dirèctament
			const salt = this._zPrec != null && Math.abs(this._zoom - this._zPrec) > 1.5;
			this._zPrec = this._zoom;
			// (l'occitan unificat a totas las escalas, se la jaça es alucada)
			const uni = this._jaces.unificat || this._zoom < n.zDial ? 1 : 0;
			// (los dialèctes venon d'èsser cochats : lor fuòc d'artifici, quin que
			// siá lo saut de zoom per i arribar)
			if (this._baletDemandat && !uni) this._lançarBalet();
			else this._relais('uni', uni, (c) => (c ? DURADA_MESCLA : DURADA_BALET), salt);
			// de mai luènh (« 1 000 km »), l'Occitània unida se vuèja : sonque son contorn
			this._relais('vuèg', this._zoom < n.zVuèg ? 1 : 0, DURADA_VUÈG, salt);
			// l'escantiment de las jaces segon l'escala, dins lo temps (pas per saumets)
			this._relais('det', aDetalh(n, this._zoom), 0.45, salt);
		},
		// Un relais dins lo temps (pas amb lo zoom) : una sola bocla d'animacion
		// per totes, que s'arrèsta quand an totes acabat
		_relais(clau, cibla, dura, immediat = false) {
			const R = (this._rel ??= {}),
				r = R[clau],
				ara = performance.now(),
				ms = (c) => (typeof dura === 'function' ? dura(c) : dura) * 1000;
			if (!r || this._calm || immediat) {
				R[clau] = { v: cibla, cibla, q: 1 };
				return;
			}
			if (r.cibla === cibla && r.attend === undefined) return;
			if (r.attend !== undefined && cibla === r.cibla) {
				r.attend = undefined; // (tornat al sens d'abans : res a esperar)
				return;
			}
			if (clau === 'uni' && r.q < 1) {
				// inversion en cors de mescla o de balet : tornar en arrièr fasiá
				// sautar l'imatge ; l'animacion en cors s'acaba en 0,35 s, puèi l'autra
				r.attend = cibla;
				r.duraA = ms(cibla);
				r.dura = 350 / Math.max(0.02, 1 - r.q);
				r.t0 = ara - r.q * r.dura;
			} else Object.assign(r, { de: r.v, cibla, t0: null, dura: ms(cibla), q: 0, net: false });
			if (this._rafRel) return;
			const pas = (ts) => {
				let viu = false;
				const t = performance.now();
				for (const x of Object.values(R))
					if (x.q < 1) {
						x.t0 ??= t;
						x.q = clamp((t - x.t0) / x.dura);
						x.v = lerp(x.de, x.cibla, x.q);
						if (x.q >= 1 && x.attend !== undefined) Object.assign(x, { de: x.v, cibla: x.attend, t0: t, dura: x.duraA, q: 0, attend: undefined });
						if (x.q < 1) viu = true;
					}
				this._pintarA(ts);
				this._rafRel = viu && this._map ? requestAnimationFrame(pas) : null;
			};
			this._rafRel = requestAnimationFrame(pas);
		},
		// Lo temps (s) dempuèi que la jaça es estada alucada, se son aparicion es en cors
		_tApar(k) {
			const t0 = this._apar?.[k];
			if (t0 == null) return null;
			const t = (performance.now() - t0) / 1000;
			if (t > TOTAL_APAR) {
				delete this._apar[k];
				return null;
			}
			return t;
		},
		_lançarApar() {
			if (this._rafApar) return;
			const pas = (ts) => {
				this._pintarA(ts);
				const viu = Object.values(this._apar ?? {}).some((t0) => (performance.now() - t0) / 1000 <= TOTAL_APAR);
				this._rafApar = viu && this._map ? requestAnimationFrame(pas) : null;
				if (!viu) this._pintar(); // (lo darrièr estat, sens estelas)
			};
			this._rafApar = requestAnimationFrame(pas);
		},
		// Los contorns traçats per d'estelas que ne fan lo torn, en onda del mitan
		_traçEstelat(G, clau, t, larg, dash, al) {
			const cx = this._cx,
				T = this._tem;
			const cts = (G[clau + 'Tr'] ??= (G[clau + 'Anels'] || []).map((anels) => prepContorn(anels.map((a) => a.map(G.pt)))));
			const W = this._W,
				H = this._H;
			cx.save();
			cx.strokeStyle = `rgba(${T.admin}, ${al})`;
			cx.lineWidth = larg;
			cx.lineJoin = 'round';
			cx.setLineDash(dash);
			cx.beginPath();
			const caps = [];
			for (const ct of cts) {
				const q = avançada(t, ct, W, H);
				if (q <= 0) continue;
				const p = easeS(q);
				traçarPart(cx, ct, p);
				if (q < 1) caps.push([ct, p, Math.sin(Math.PI * q)]);
			}
			cx.stroke();
			cx.setLineDash([]);
			for (const [ct, p, a] of caps) estelaCap(cx, ct, p, T.estela, a * 0.9);
			cx.restore();
		},
		// (mantuna bocla d'animacion — entrada en scèna, relais, aparicions,
		// causida — pòdon demandar un dessenh dins la meteissa imatge : un sol)
		_pintarA(ts) {
			if (ts === this._tsPintat) return;
			this._tsPintat = ts;
			this._pintar();
		},
		_interactiu() {
			// (l'Occitània unida, de luènh o causida : los dialèctes se causisson pas)
			if (this._jaces.unificat || (this._nivèls && aDialectes(this._nivèls, this._zoom) < 0.5)) return false;
			return !!(this._jaces.dialectes && this._dial) || !!(this._jaces.creissent && this._creissent);
		},
		// Una enclava (Pichona Gavachariá) se dessenha amb la frontièra tanben :
		// son encastre al survòl o al tòc, coma un despartament (retorn de Romain)
		_enclavas() {
			return this._geo?.mix && this._map?.getZoom() < 13 ? this._geo.mix.filter((zm) => zm.enclava) : [];
		},
		enclavaA(lp) {
			const enc = this._enclavas();
			if (!enc.length || !this._min) return null;
			this._cxTest ??= document.createElement('canvas').getContext('2d');
			const x = lp.x - this._min.x,
				y = lp.y - this._min.y;
			return enc.find((zm) => this._cxTest.isPointInPath(zm.c, x, y, 'evenodd'))?.kod ?? null;
		},
		// (per las autras còlas : las provincias de 1789 cedisson als dialèctes)
		zonaA(lp) {
			return this._zonaA(lp);
		},
		// La zòna jos un ponch : l'enclava, lo Creissent (es dessús), puèi
		// las zònas mixtas (pel survòl sonque), puèi los dialèctes
		_zonaA(lp, ambMix = true) {
			const g = this._geo;
			if (!g) return null;
			if (this._franca) {
				const ll = this._map.layerPointToLatLng(lp);
				if (!dinsFranca(ll.lat, ll.lng)) return null;
			}
			const kEnc = this.enclavaA(lp);
			if (kEnc) return kEnc;
			if (!this._interactiu()) return null;
			this._cxTest ??= document.createElement('canvas').getContext('2d');
			const x = lp.x - this._min.x,
				y = lp.y - this._min.y;
			if (this._jaces.creissent && g.cro && this._cxTest.isPointInPath(g.cro.c, x, y, 'evenodd')) return 'cro';
			if (ambMix && this._jaces.dialectes && g.mix)
				for (const zm of g.mix) if (!zm.enclava && this._cxTest.isPointInPath(zm.c, x, y, 'evenodd')) return zm.kod;
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
			this._prepPus();
			onSurvòl?.(k, this._nomDe(k));
			this._pintar();
		},
		_onMirga(e) {
			if (e.originalEvent?.pointerType === 'touch') return;
			if (!this._interactiu() && !this._enclavas().length) return this._survòl(null);
			const k = ocupat?.(e.layerPoint) ? null : this._zonaA(e.layerPoint);
			this._survòl(k);
			if (k) this._map.getContainer().style.cursor = 'pointer';
		},
		_onSortida() {
			this._survòl(null);
		},
		// lo cadre de la zòna jos lo ponch (doble clic : centrar.js)
		cadreA(lp) {
			if (ocupat?.(lp)) return null;
			const k = this._zonaA(lp);
			if (!k) return null;
			const fc = k.startsWith('mix-') || k.startsWith('ist-') || k.startsWith('enc-') ? this._mix : k === 'cro' ? this._creissent : this._dial;
			return cadreDe(fc?.features.find((x) => x.properties.kod === k));
		},
		_onClic(e) {
			// (lo segond clic d'un doble clic : la vista se centra, la causida demòra)
			if (e.originalEvent?.detail > 1) return;
			if (ocupat?.(e.layerPoint)) return;
			// una enclava (fòra del domeni) : lo clic o lo tòc mòstra sa legenda
			const kEnc = this.enclavaA(e.layerPoint);
			if (kEnc) return this._survòl(kEnc);
			// al det, lo survòl demòra : un tòc endacòm mai l'escafa
			if (this._pus?.startsWith('enc-')) this._survòl(null);
			if (!this._interactiu()) return;
			// una zòna mixta se causís pas : lo clic va al dialècte de dejós
			const k = this._zonaA(e.layerPoint, false);
			// un clic sus una zòna l'apond a la causida, o l'en leva se i èra ; un
			// clic defòra : totes los dialèctes tornan
			if (!k) return this._aplicar([], true);
			this._aplicar(this._sels.includes(k) ? this._sels.filter((x) => x !== k) : [...this._sels, k], true);
		},
		_nomDe(k) {
			if (!k) return null;
			if (k.startsWith('mix-') || k.startsWith('ist-') || k.startsWith('enc-')) {
				const m = this._mix?.features.find((x) => x.properties.kod === k)?.properties;
				return m ? { kod: k, oc: m.oc, fr: m.fr, sota_oc: m.sota_oc, sota_fr: m.sota_fr, encadrat: m.encadrat, mix: true } : null;
			}
			const f = (k === 'cro' ? this._creissent : this._dial)?.features.find((x) => x.properties.kod === k);
			return f ? { kod: k, oc: f.properties.oc, fr: f.properties.fr, cro: k === 'cro' } : null;
		},
		// Novèla causida : una zòna apondida se difusa a partir de son còr, una
		// zòna levada s'escantís, la darrièra levada fa tornar totas las zònas
		_aplicar(sels, anim) {
			const de = this._sels;
			this._sels = sels;
			const dial = (l) => l.filter((k) => k !== 'cro');
			const ajust = sels.filter((k) => !de.includes(k));
			const lev = de.filter((k) => !sels.includes(k));
			// las zònas totas èran visiblas abans la causida ? (sonque alara se
			// fondon ; se la jaça ven d'èsser alucada, lo dialècte se difusa sol)
			const totesAvant = !dial(de).length && !!this._dial && performance.now() - (this._dialAlucat ?? 0) > 400;
			this._anim =
				anim && !this._calm && (ajust.length || lev.length)
					? { de: dial(de), a: dial(sels), ajust: ajust.length === 1 ? ajust[0] : null, lev: dial(lev), t0: performance.now(), totesAvant }
					: null;
			this._prepSel();
			// l'encastre d'en bas : la zòna causida, o totas se n'i a mantuna
			const noms = sels.map((k) => this._nomDe(k)).filter(Boolean);
			onCausida?.(
				[...sels],
				noms.length > 1
					? { kod: sels.join('+'), oc: noms.map((n) => n.oc).join(' · '), fr: noms.map((n) => n.fr).join(' · '), sota_oc: 'zònas causidas', sota_fr: 'zones choisies', mix: true }
					: (noms[0] ?? null)
			);
			this._pintar(); // tot d'ora : remplaça un dessenh de totas las zònas fach just abans
			this._bocla();
		},
		_bocla() {
			cancelAnimationFrame(this._raf);
			const pas = (ts) => {
				this._pintarA(ts);
				if (this._anim && performance.now() - this._anim.t0 < DURADA + 50) this._raf = requestAnimationFrame(pas);
				else {
					this._anim = null;
					this._prepSel(); // la zòna apondida rejonh las autras
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
			this._nivèls = nivèlsDezoom(map);
			this._majUni();
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
			this._noms?.ajustar(this._cv, min, map.getPixelOrigin().add(min), this._zoom, dpr);
			const o = map.getPixelOrigin().add(min);
			const z = this._zoom;
			const pt = ([lon, lat]) => {
				const q = map.project([lat, lon], z);
				return [q.x - o.x, q.y - o.y];
			};
			// (cada anèl projectat un còp al zoom 0, puèi multiplicat : projeccion.js)
			const s2 = Math.pow(2, z);
			const cami = (anels, c = new Path2D()) => {
				for (const a of anels) {
					const f = proj0(map, a);
					c.moveTo(f[0] * s2 - o.x, f[1] * s2 - o.y);
					for (let i = 1; i < a.length; i++) c.lineTo(f[2 * i] * s2 - o.x, f[2 * i + 1] * s2 - o.y);
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
					const f0 = proj0(map, anels[0]);
					for (let i = 0; i < anels[0].length; i++) {
						const x = f0[2 * i] * s2 - o.x,
							y = f0[2 * i + 1] * s2 - o.y;
						x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
					}
				}
				return { kod: f.properties.kod, c, eti: pt(ETI_NOM[f.properties.kod] ?? f.properties.eti), props: f.properties, bbox: [x0, y0, x1, y1] };
			};
			const dom = this._limits?.domeni;
			this._geo = {
				pt,
				mPx: 112600 / Math.pow(2, z), // mètres par pixel vers 44° N
				dom: dom?.anels?.length ? cami(dom.anels) : null,
				linhas: dom ? dom.linhas.map((l) => projectar(map, l, z, o.x, o.y)) : null,
				zonas: this._dial ? this._dial.features.map(zona) : null,
				cro: this._creissent ? zona(this._creissent.features[0]) : null,
				mix: this._mix && (this._jaces.dialectes || this._jaces.frontiera) ? this._mix.features.map((f) => ({ ...zona(f), istoric: f.properties.mena === 'istoric', enclava: f.properties.mena === 'enclava' })) : null,
				bandas:
					this._bandas && this._jaces.dialectes
						? this._bandas.features.map((f) => {
								const c = new Path2D();
								for (const anels of poligons(f.geometry)) cami(anels, c);
								return { c, larg: f.properties.larg };
							})
						: null,
				regions: this._jacesVivas('regions') ? (this._limits?.regions || []).map(([, , anels]) => cami(anels)) : null,
				deps: this._jacesVivas('despartaments') ? (this._limits?.despartaments || []).map(([, , anels]) => cami(anels)) : null,
				// (los ponches, per l'aparicion en estelas : calculats sonque se cal)
				regionsAnels: this._jacesVivas('regions') ? (this._limits?.regions || []).map(([, , anels]) => anels) : null,
				depsAnels: this._jacesVivas('despartaments') ? (this._limits?.despartaments || []).map(([, , anels]) => anels) : null
			};
			// las tenchas fondudas (lo flo es car) : preparadas sonque quand
			// servisson, al primièr dessenh que n'a besonh (çai-jos, _pintar)
			this._tenchasGeo = null;
			this._pintar();
			if (dom) map.getPane('donadas').style.opacity = '1';
		},

		// Una zòna (o totas) en tencha fonduda, dins un canavàs de la talha del
		// principal : las zònas espandidas d'en primièr cap a l'exterior (lo
		// fondut se palís pas sus la còsta), puèi las vertadièras dessús.
		// Una zòna sola (dialècte causit) : l'espandiment demòra en mar e a
		// l'estrangièr, e son fondut se fa DINS sa zòna (retorn de Romain : lo
		// lengadocian causit desbordava sus Bordèu, qu'es gascon)
		_tenchaDins(c, zonas, sola = false) {
			const g = c.getContext('2d'),
				G = this._geo,
				T = this._tem,
				dpr = this._dpr;
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.clearRect(0, 0, c.width, c.height);
			if (!zonas.length) return;
			const flo = clamp(5000 / G.mPx, 1.2, 45); // fondut d'environ 5 km
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
			if (sola && G.zonas) {
				tg.save();
				tg.globalCompositeOperation = 'destination-out';
				for (const o of G.zonas) {
					if (zonas.includes(o)) continue;
					tg.fill(o.c, 'evenodd'); // res sus los vesins
					tg.lineWidth = flo * 2.4; // e un recul d'un fondut long de lor limita
					tg.stroke(o.c);
				}
				tg.restore();
			}
			g.save();
			g.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (G.dom) g.clip(G.dom, 'evenodd');
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.filter = `blur(${(flo * dpr).toFixed(1)}px)`;
			g.drawImage(t, 0, 0);
			g.restore();
			// Nuancièr : dins las bendas de transicion de la recèrca, lo fondut pren
			// la largor relevada (5 a 35 km) ; tres classas de largor, cada una
			// vista a travèrs de sas bendas fondudas (pas de cassura al bòrd)
			if (!sola && G.bandas?.length) {
				const t2 = (this._trab2 ??= document.createElement('canvas'));
				t2.width = c.width;
				t2.height = c.height;
				const g2 = t2.getContext('2d');
				for (const [l0, l1] of [[0, 12], [12, 24], [24, 99]]) {
					const bs = G.bandas.filter((b) => b.larg > l0 && b.larg <= l1);
					if (!bs.length) continue;
					const sig = clamp((Math.max(...bs.map((b) => b.larg)) * 250) / G.mPx, 1, 90);
					if (sig <= flo * 1.05) continue; // pas pus larg que lo fondut de basa
					g2.setTransform(1, 0, 0, 1, 0, 0);
					g2.globalCompositeOperation = 'source-over';
					g2.clearRect(0, 0, t2.width, t2.height);
					g2.save();
					g2.filter = `blur(${(sig * 0.6 * dpr).toFixed(1)}px)`;
					g2.setTransform(dpr, 0, 0, dpr, 0, 0);
					g2.fillStyle = '#000';
					for (const b of bs) g2.fill(b.c);
					g2.restore();
					g2.globalCompositeOperation = 'source-in';
					g2.filter = `blur(${(sig * dpr).toFixed(1)}px)`;
					g2.drawImage(t, 0, 0);
					g2.filter = 'none';
					g2.globalCompositeOperation = 'source-over';
					g.save();
					g.setTransform(dpr, 0, 0, dpr, 0, 0);
					if (G.dom) g.clip(G.dom, 'evenodd');
					g.setTransform(1, 0, 0, 1, 0, 0);
					g.drawImage(t2, 0, 0);
					g.restore();
				}
			}
		},
		// Lo Creissent : asclas vistas a travèrs d'una masca fonduda (bòrd flo
		// d'environ 4 km, pas cap de contorn : es una transicion, pas una limita)
		_prepCro() {
			const G = this._geo,
				c = this._imgCro,
				dpr = this._dpr;
			if (!G?.cro) return;
			c.width = this._cv.width;
			c.height = this._cv.height;
			const g = c.getContext('2d');
			const motiu = document.createElement('canvas');
			const pas = Math.round(9 * dpr);
			motiu.width = motiu.height = pas;
			const m = motiu.getContext('2d');
			m.strokeStyle = this._tem.lenga;
			m.lineWidth = 1.5 * dpr;
			m.beginPath();
			m.moveTo(-1, pas + 1);
			m.lineTo(pas + 1, -1);
			m.moveTo(-1, 1);
			m.lineTo(1, -1);
			m.moveTo(pas - 1, pas + 1);
			m.lineTo(pas + 1, pas - 1);
			m.stroke();
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.clearRect(0, 0, c.width, c.height);
			// masca : la zòna, fonduda
			g.save();
			g.filter = `blur(${(clamp(4000 / G.mPx, 1.5, 40) * dpr).toFixed(1)}px)`;
			g.setTransform(dpr, 0, 0, dpr, 0, 0);
			g.fillStyle = '#000';
			g.fill(G.cro.c, 'evenodd');
			g.restore();
			// asclas dins la masca
			g.globalCompositeOperation = 'source-in';
			g.fillStyle = g.createPattern(motiu, 'repeat');
			g.fillRect(0, 0, c.width, c.height);
			g.globalCompositeOperation = 'source-over';
		},
		// Zònas mixtas : un quadrilhatge fin e clar (pas cap de dialècte sol),
		// a bòrd flo d'environ 1,5 km
		_prepMix() {
			const G = this._geo,
				c = this._imgMix,
				dpr = this._dpr;
			if (!G?.mix) return;
			c.width = this._cv.width;
			c.height = this._cv.height;
			const g = c.getContext('2d');
			const motiu = document.createElement('canvas');
			const pas = Math.round(7 * dpr);
			motiu.width = motiu.height = pas;
			const m = motiu.getContext('2d');
			m.strokeStyle = `rgba(${this._tem.admin}, 0.7)`;
			m.lineWidth = 0.8 * dpr;
			m.beginPath();
			m.moveTo(-1, pas + 1);
			m.lineTo(pas + 1, -1);
			m.moveTo(-1, -1);
			m.lineTo(pas + 1, pas + 1);
			m.stroke();
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.clearRect(0, 0, c.width, c.height);
			g.save();
			g.filter = `blur(${(clamp(1500 / G.mPx, 0.8, 20) * dpr).toFixed(1)}px)`;
			g.setTransform(dpr, 0, 0, dpr, 0, 0);
			g.fillStyle = '#000';
			// (las zònas mixtas, amb los dialèctes sonque)
			if (this._jaces.dialectes) for (const zm of G.mix) if (!zm.istoric && !zm.enclava) g.fill(zm.c, 'evenodd');
			g.restore();
			g.globalCompositeOperation = 'source-in';
			g.fillStyle = g.createPattern(motiu, 'repeat');
			g.fillRect(0, 0, c.width, c.height);
			g.globalCompositeOperation = 'source-over';
			// zònas de contacte amb una autra lenga (Baiona e lo basc) : de bendas
			// largas de la color del dialècte (lo gascon), que s'entremesclan amb la
			// tencha de l'autra lenga quand es alucada (retorn de Romain, 2026-10-09)
			const mesc = this._jaces.dialectes ? G.mix.filter((zm) => zm.props.mescla && this._tem.dial[zm.props.mescla]) : [];
			if (mesc.length) {
				const t = (this._imgMixMescla ??= document.createElement('canvas'));
				t.width = c.width;
				t.height = c.height;
				const tg = t.getContext('2d');
				for (const zm of mesc) {
					const p = document.createElement('canvas');
					const pp = Math.round(8 * dpr);
					p.width = p.height = pp;
					const pg = p.getContext('2d');
					pg.strokeStyle = this._tem.dial[zm.props.mescla];
					pg.lineWidth = 2.8 * dpr;
					pg.beginPath();
					pg.moveTo(-1, pp + 1);
					pg.lineTo(pp + 1, -1);
					pg.moveTo(-1, 1);
					pg.lineTo(1, -1);
					pg.moveTo(pp - 1, pp + 1);
					pg.lineTo(pp + 1, pp - 1);
					pg.stroke();
					tg.setTransform(1, 0, 0, 1, 0, 0);
					tg.clearRect(0, 0, t.width, t.height);
					tg.save();
					tg.filter = `blur(${(clamp(1500 / G.mPx, 0.8, 20) * dpr).toFixed(1)}px)`;
					tg.setTransform(dpr, 0, 0, dpr, 0, 0);
					tg.fillStyle = '#000';
					tg.fill(zm.c, 'evenodd');
					tg.restore();
					tg.globalCompositeOperation = 'source-in';
					tg.fillStyle = tg.createPattern(p, 'repeat');
					tg.fillRect(0, 0, t.width, t.height);
					tg.globalCompositeOperation = 'source-over';
					g.drawImage(t, 0, 0);
				}
			}
			// enclavas d'una autra lenga (Pichona Gavachariá) : un ponchejat leugièr
			const enc = G.mix.filter((zm) => zm.enclava);
			if (enc.length) {
				const p = document.createElement('canvas');
				const pp = Math.round(6 * dpr);
				p.width = p.height = pp;
				const pg = p.getContext('2d');
				pg.fillStyle = `rgba(${this._tem.admin}, 0.8)`;
				pg.beginPath();
				pg.arc(pp / 2, pp / 2, 0.9 * dpr, 0, 6.283);
				pg.fill();
				g.save();
				g.setTransform(dpr, 0, 0, dpr, 0, 0);
				for (const zm of enc) g.clip(zm.c, 'evenodd');
				g.setTransform(1, 0, 0, 1, 0, 0);
				g.fillStyle = g.createPattern(p, 'repeat');
				g.fillRect(0, 0, c.width, c.height);
				g.restore();
			}
		},
		// L'Occitània unida : lo roge fondut, preparat un còp per zoom e sonque
		// quand servís (lo flo recalculat a cada imatge copava la fluiditat :
		// 60 ms per imatge sus un ecran larg, retorn de Romain)
		_prepUni() {
			const G = this._geo,
				c = this._imgUni;
			this._uniGeo = G;
			if (!G?.dom) return;
			c.width = Math.max(1, Math.round(this._cv.width / 2));
			c.height = Math.max(1, Math.round(this._cv.height / 2));
			const g = c.getContext('2d'),
				k = this._dpr / 2;
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.clearRect(0, 0, c.width, c.height);
			g.setTransform(k, 0, 0, k, 0, 0);
			g.filter = `blur(${(clamp(2500 / G.mPx, 1, 10) * k).toFixed(1)}px)`;
			g.fillStyle = this._tem.occitan;
			g.fill(G.dom, 'evenodd');
			g.filter = 'none';
		},
		// La mescla : los dialèctes fondits, preparats un còp (lo flo a cada
		// imatge copava la fluiditat sus un ecran larg)
		_prepFlo() {
			const c = this._imgFlo,
				s = this._imgTotes;
			this._floGeo = this._geo;
			c.width = Math.max(1, Math.round(s.width / 2));
			c.height = Math.max(1, Math.round(s.height / 2));
			const g = c.getContext('2d');
			g.clearRect(0, 0, c.width, c.height);
			g.filter = `blur(${Math.round(8 * this._dpr)}px)`;
			g.drawImage(s, 0, 0, c.width, c.height);
			g.filter = 'none';
		},
		_prepTotes() {
			if (this._jaces.dialectes && this._geo?.zonas) this._tenchaDins(this._imgTotes, this._geo.zonas);
		},
		// Lo dialècte survolat : meteissa tencha fonduda que la causida
		_prepPus() {
			const G = this._geo,
				k = this._pus;
			const zn = k && G?.zonas ? G.zonas.find((x) => x.kod === k) : null;
			this._pusDial = !!zn;
			if (!zn) return;
			this._imgPus ??= document.createElement('canvas');
			this._imgPus.width = this._cv.width;
			this._imgPus.height = this._cv.height;
			this._tenchaDins(this._imgPus, [zn], true);
		},
		// Los dialèctes causits, sols : fonduts entre eles, e cap als autres se
		// ditz transicion. Pendent l'animacion, l'imatge d'abans es gardat a
		// despart (_transicion passa de l'un a l'autre).
		_prepSel() {
			const G = this._geo;
			if (!G || !G.zonas) return;
			const an = this._anim;
			const zonas = (l) => G.zonas.filter((x) => l.includes(x.kod));
			this._tenchaDins(this._imgSel, zonas(this._sels.filter((k) => k !== 'cro')), true);
			if (an && ((an.ajust && an.ajust !== 'cro') || an.lev.length)) {
				const c = (this._imgAvant ??= document.createElement('canvas'));
				c.width = this._cv.width;
				c.height = this._cv.height;
				this._tenchaDins(c, zonas(an.de), true);
			}
		},

		/* ---------- Dessenh (a cada recalatge, e a cada image d'una animacion) ---------- */
		// Una opacitat que rejonh sa cibla dins lo temps, pas d'un còp a cada cran
		// de zoom (demanda de Romain, 2026-10-09) ; tant que se mòu, la tela se
		// tòrna pintar a l'imatge seguent
		_doç(clau, cibla, dura = 0.55) {
			const D = (this._doces ??= {}),
				t = performance.now();
			if (this._calm) return cibla;
			let d = D[clau];
			if (!d) d = D[clau] = { v: cibla, cibla };
			else if (d.cibla !== cibla) Object.assign(d, { de: d.v, cibla, t0: t });
			if (d.v !== d.cibla) {
				const q = clamp((t - d.t0) / (dura * 1000));
				d.v = q >= 1 ? d.cibla : d.de + (d.cibla - d.de) * easeS(q);
				if (q < 1) this._rafDoç ??= requestAnimationFrame((ts) => ((this._rafDoç = null), this._pintarA(ts)));
			}
			return d.v;
		},
		_pintar() {
			this._noms?.començar(this._cx);
			try {
				pintarAmbFranca(this);
			} finally {
				this._noms?.acabar();
			}
		},
		_pintarCòs() {
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
			// (la part francesa sola : retalhat aprèp l'escafament)
			if (this._franca && francaCargada()) {
				cx.save();
				retalharFranca(cx, this._map, z, this._map.getPixelOrigin().add(this._min));
				this._retalhat = true;
			}
			// de prèp, lo dialècte es pertot : la tencha s'esvalís
			// Fòrt de prèp (escala d'una carrièra), sonque lo fons (retorn de Romain) :
			// los contorns simplificats se decalarián de las tuèlas e la frontièra
			// de la lenga pretendriá una precision qu'a pas. Escantits doçament, sus
			// mai d'un nivèl (retorn de Romain : una disparicion d'un sol còp de
			// zoom fasiá una cassura) : contorns administratius de 10 a 11,5,
			// frontièra de 11 a 13, tenchas de 11,5 a 13.
			// Lo dezoom (demandas de Romain, 2026-10-08) : vers « 200 km » los
			// dialèctes se fondon dins l'Occitània unida ; a partir de « 300 km »
			// las autras jaces s'escantisson, a « 500 km » demòra lo contorn sol
			const nv = this._nivèls ?? nivèlsDezoom(this._map),
				aDial = aDialectes(nv, z),
				aDet = this._rel?.det?.v ?? aDetalh(nv, z);
			const aAdmin = this._doç('admin', clamp((11.5 - z) / 1.5)) * aDet,
				aFront = dossa(clamp((13 - z) / 2)) * aDet,
				aTenchas0 = clamp((13 - z) / 1.5);
			// u : 0 los dialèctes, 1 l'Occitània unida (relais dins lo temps)
			const R = this._rel ?? {},
				ru = R.uni,
				u = ru ? ru.v : 1 - aDial,
				qUni = ru?.q ?? 1,
				balet = ru?.cibla === 0 && u > 0.001,
				mescla = ru?.cibla === 1 && u > 0.001,
				flo = mescla ? easeS(clamp(u / 0.6)) : 0,
				vE = easeS(R.vuèg?.v ?? 0),
				aMescla = mescla ? 1 - easeS(clamp((u - 0.55) / 0.45)) : 1,
				aTenchas = aTenchas0 * (1 - u);
			// (dialèctes e Creissent decochats : s'escantisson dins lo temps)
			const aJDial = this._aJ('dialectes'),
				aJCro = this._aJ('creissent');
			const aT = T.tencha * lerp(1, 0.3, clamp((z - 7) / 4)) * aTenchas0 * aMescla * aJDial;
			const an = this._anim,
				p = an ? clamp((performance.now() - an.t0) / DURADA) : 1;
			// l'entrada en scèna : las zònas a part (Creissent, zònas mixtas) e los
			// noms venon quand los dialèctes an acabat de se difusar
			const ti = this._ti(),
				aFinIntro = clamp((ti - (INTRO.dialectes[1] - 0.5)) / 0.8);

			// (l'Occitània unida e acabada : las tenchas dels dialèctes servisson pas)
			if (this._tenchasGeo !== G && u < 0.999) {
				this._tenchasGeo = G;
				this._prepTotes();
				this._prepSel();
				this._prepPus();
				if (J.creissent) this._prepCro();
				if (J.dialectes || J.frontiera) this._prepMix();
			}
			/* Dialèctes */
			if (aJDial > 0.01 && G.zonas && u < 0.999) {
				const selDial = this._sels.some((k) => k !== 'cro');
				// totes : visibles sens causida ; s'esvalisson quand un dialècte es
				// causit, tornan quand lo darrièr se descausís
				let aTotes = selDial ? 0 : 1;
				if (an && an.de.length && !an.a.length) aTotes = dossa(clamp(p / 0.6));
				if (an && an.a.length && !an.de.length) aTotes = an.totesAvant ? 1 - dossa(clamp(p / 0.35)) : 0;
				// a l'arribada, los dialèctes se difusan a la fin de l'entrada en scèna
				// lo balet : tornan coma a l'entrada en scèna, en fuòc d'artifici
				if (balet && !selDial) {
					const [d0, d1] = INTRO.dialectes;
					this._introDial(d0 + qUni * (d1 - d0), aT);
				} else if (ti < INTRO.dialectes[1] && !selDial) {
					if (ti > INTRO.dialectes[0]) this._introDial(ti, aT);
				} else if (aTotes > 0.01) {
					// la mescla : los dialèctes s'enfoscan e se fondon (puèi rogejan, çai-jos)
					if (flo > 0.01) {
						if (this._floGeo !== G) this._prepFlo();
						this._copiar(this._imgTotes, aT * aTotes * (1 - flo));
						this._copiar(this._imgFlo, aT * aTotes * flo);
					} else this._copiar(this._imgTotes, aT * aTotes);
				}
				// sols sus la carta, los dialèctes causits pòdon èsser mai marcats ;
				// l'apondut se difusa, los levats s'escantisson
				if (an && ((an.ajust && an.ajust !== 'cro') || an.lev.length)) this._transicion(p, aT * 1.6);
				else if (selDial) this._copiar(this._imgSel, aT * 1.6);
				// survòl (sens causida) : la zòna s'esclarzís un pauc, amb lo meteis
				// fondut que la causida (retorn de Romain : un emplenatge net fasiá de
				// bòrds tròp nets ; nets sonque sus la frontièra e la còsta)
				if (!selDial && this._pusDial) this._copiar(this._imgPus, aT * 0.45);
			}
			if (mescla) {
				// … e rogejan, fins al roge de l'Occitània unida
				cx.save();
				cx.setTransform(1, 0, 0, 1, 0, 0);
				cx.globalCompositeOperation = 'source-atop';
				cx.globalAlpha = easeS(clamp(u / 0.7)) * 0.85;
				cx.fillStyle = T.occitan;
				cx.fillRect(0, 0, this._cv.width, this._cv.height);
				cx.restore();
			}
			// lo balet : las limits dels dialèctes se traçan una a una, de lor
			// color, puèi s'esvanisson dins lo fondut
			if (balet && J.dialectes && G.zonas) {
				const q = qUni;
				cx.save();
				cx.lineJoin = 'round';
				cx.lineCap = 'round';
				cx.lineWidth = 0.9;
				G.zonas.forEach((zn, i) => {
					if (this._sels.some((k) => k !== 'cro') && !this._sels.includes(zn.kod)) return;
					const pz = clamp((q - 0.04 - i * 0.15) / 0.22);
					if (pz <= 0 || pz >= 1) return;
					const [x0, y0, x1, y1] = zn.bbox,
						L = (x1 - x0 + y1 - y0) * 3.2;
					cx.setLineDash([L * easeS(clamp(pz / 0.65)), L]);
					cx.strokeStyle = T.dial[zn.kod] ?? T.lenga;
					cx.globalAlpha = Math.sin(Math.PI * pz) * 0.9;
					cx.stroke(zn.c);
				});
				cx.restore();
			}

			/* Zònas mixtas (Ròia, Mónegue, comunas declaradas) : amb los dialèctes */
			if (G.mix) {
				const pus = this._pus?.startsWith('mix-') || this._pus?.startsWith('enc-');
				// domeni istoric (gascon escantit) : la tencha pus palla, sens asclas
				const ist = G.mix.filter((zm) => zm.istoric);
				if (ist.length && J.dialectes) {
					// (lo flo es preparat un còp per zoom, pas a cada imatge)
					if (this._istGeo !== G) {
						this._istGeo = G;
						const t = (this._imgIst ??= document.createElement('canvas'));
						if (t.width !== this._cv.width || t.height !== this._cv.height) (t.width = this._cv.width), (t.height = this._cv.height);
						const g = t.getContext('2d');
						g.setTransform(1, 0, 0, 1, 0, 0);
						g.clearRect(0, 0, t.width, t.height);
						g.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
						g.filter = `blur(${clamp(2500 / G.mPx, 1, 30).toFixed(1)}px)`;
						g.fillStyle = '#000';
						for (const zm of ist) g.fill(zm.c, 'evenodd');
						g.filter = 'none';
					}
					cx.save();
					cx.globalCompositeOperation = 'destination-out';
					cx.setTransform(1, 0, 0, 1, 0, 0);
					cx.globalAlpha = this._pus?.startsWith('ist-') ? 0.35 : 0.55;
					cx.drawImage(this._imgIst, 0, 0);
					cx.restore();
				}
				this._copiar(this._imgMix, (this._sels.length ? 0.25 : pus ? 0.75 : 0.5) * aTenchas * aFinIntro);
			}

			/* Lo Creissent : zòna de transicion, en asclas */
			if (aJCro > 0.01 && G.cro) {
				const causit = this._sels.includes('cro');
				const autreCausit = this._sels.length > 0 && !causit;
				let a = autreCausit ? 0.2 : this._pus === 'cro' || causit ? 1 : 0.75;
				if (an?.ajust === 'cro') a = 1;
				// de prèp, la zòna de transicion s'esvalís (es una nocion d'escala
				// regionala : sos bòrds son pas de traches)
				a *= lerp(1, 0.35, clamp((z - 8) / 3));
				a *= aJCro;
				cx.save();
				if (an?.ajust === 'cro') this._mascaDifusion(G.cro, p); // clip progressiu
				this._copiar(this._imgCro, a * aTenchas * aFinIntro);
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
			// a l'aparicion, d'estelas ne fan lo torn e los traçan
			const tD = this._tApar('despartaments'),
				tR = this._tApar('regions');
			// (decochats : s'escantisson dins lo temps)
			const aDeps = aAdmin * this._aJ('despartaments', 'deps'),
				aRegs = aAdmin * this._aJ('regions', 'regions');
			if (G.deps && aDeps > 0.01) tD == null ? contorns(G.deps, 0.7, [], 0.28 * aDeps) : this._traçEstelat(G, 'deps', tD, 0.7, [], 0.28 * aDeps);
			if (G.regions && aRegs > 0.01) tR == null ? contorns(G.regions, 1.2, [6, 4], 0.45 * aRegs) : this._traçEstelat(G, 'regions', tR, 1.2, [6, 4], 0.45 * aRegs);

			/* La frontièra de la lenga (demanda de Romain, 2026-10-07) : SONQUE de
			   ponches tèrra cuècha, lo fons demòra lo meteis d'un costat e de
			   l'autre. De prèp, sabèm pas al quilomètre près ont passa : los
			   ponches palisson e una benda difusa de quauques quilomètres ditz
			   « per aquí ». */
			// Lo domeni occitan (demanda de Romain, 2026-10-09) : de 200 km fins al
			// pus prèp, tanben sus l'occitan unificat (dessenhat aprèp el, dessús)
			const aFrontU = aFront * this._aJ('frontiera');
			const dessenharFront = () => {
				if (!(G.linhas && aFrontU > 0.01)) return;
				const vague = clamp((z - 7.5) / 2.5);
				// l'aparicion : los ponches se pausan al long de la frontièra, una
				// estela en cap (coma los contorns dels territòris)
				const tF = this._tApar('frontiera'),
					ctsF = tF == null ? null : (G.linhasTr ??= G.linhas.map((l) => prepContorn([l]))),
					capsF = [];
				const traçar = () => {
					cx.beginPath();
					if (ctsF) {
						capsF.length = 0;
						for (const ct of ctsF) {
							const q = avançada(tF, ct, this._W, this._H);
							if (q <= 0) continue;
							traçarPart(cx, ct, easeS(q));
							if (q < 1) capsF.push([ct, easeS(q), Math.sin(Math.PI * q)]);
						}
						return;
					}
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
						cx.globalAlpha = vague * al * aFrontU;
						cx.lineWidth = larg * k;
						cx.stroke();
					}
				}
				cx.setLineDash([0.01, 4.2 + vague * 3]);
				cx.lineWidth = 1.4 + vague * 0.6;
				cx.globalAlpha = lerp(0.8, 0.3, vague) * aFrontU;
				traçar();
				cx.stroke();
				cx.setLineDash([]);
				for (const [ct, pp, aC] of capsF) estelaCap(cx, ct, pp, T.estela, aC * aFrontU * 0.9);
				cx.restore();
			};

			/* L'Occitània unida (demanda de Romain) : de luènh, una sola lenga,
			   « OCCITAN », en roge ; a « 500 km », sonque son contorn */
			// (pendent la mescla, lo roge unit ven a la fin ; pendent lo balet, s'esvanís)
			// (un fuòc d'artifici demandat en cochant los dialèctes : sens lo roge)
			const aUni = (mescla ? easeS(clamp((u - 0.4) / 0.6)) : u) * aFinIntro * (balet && ru?.net ? 0 : 1);
			let caixaOc = null;
			if (G.dom && aUni > 0.01) {
				cx.save();
				// plena fins a « 700 km » ; puèi se vuèja del mitan cap als bòrds,
				// coma se la color se retirava dins son contorn (retorn de Romain)
				if ((J.dialectes || J.unificat) && vE < 0.999) {
					if (this._uniGeo !== G) this._prepUni();
					let img = this._imgUni;
					if (vE > 0.001) {
						// (lo vuèg se fa dins una còpia del roge : sus lo canavàs, escafava
						// tot çò qu'èra dessenhat abans, dialèctes e frontièra compresos)
						const c = (this._imgVuèg ??= document.createElement('canvas'));
						if (c.width !== img.width || c.height !== img.height) (c.width = img.width), (c.height = img.height);
						const g = c.getContext('2d'),
							k = this._dpr * (img.width / this._cv.width);
						g.setTransform(1, 0, 0, 1, 0, 0);
						g.globalCompositeOperation = 'source-over';
						g.clearRect(0, 0, c.width, c.height);
						g.drawImage(img, 0, 0);
						const [cx0, cy0] = G.pt(ETI_OCCITAN),
							rMax = Math.max(...[[-1.6, 42.65], [7.55, 42.65], [-1.6, 46.4], [7.55, 46.4]].map((q) => Math.hypot(G.pt(q)[0] - cx0, G.pt(q)[1] - cy0))),
							r = Math.max(1, vE * rMax * 1.35);
						g.setTransform(k, 0, 0, k, 0, 0);
						const gr = g.createRadialGradient(cx0, cy0, 0, cx0, cy0, r);
						gr.addColorStop(0, '#000');
						gr.addColorStop(0.62, '#000');
						gr.addColorStop(1, 'rgba(0, 0, 0, 0)');
						g.globalCompositeOperation = 'destination-out';
						g.fillStyle = gr;
						g.beginPath();
						g.arc(cx0, cy0, r, 0, 6.283);
						g.fill();
						g.globalCompositeOperation = 'source-over';
						img = c;
					}
					// (de fòrt prèp, coma las tenchas dels dialèctes, s'esvanís)
					this._copiar(img, aUni * T.tencha * 1.6 * aTenchas0);
				}
				// lo contorn s'afortís un pauc quand la color i es tornada
				cx.globalAlpha = aUni * lerp(0.7, 0.95, vE) * aTenchas0;
				cx.strokeStyle = T.occitan;
				cx.lineWidth = 0.8;
				cx.lineJoin = 'round';
				cx.stroke(G.dom);
				if ((J.dialectes || J.unificat) && vE < 0.6) {
					const [x, y] = G.pt(ETI_OCCITAN);
					// (lo nom se fa pichon amb la region, de luènh)
					const fsO = clamp(9 + (z - 3.75) * 3, 9, 15);
					cx.font = `600 ${fsO.toFixed(1)}px Luciole, sans-serif`;
					cx.letterSpacing = (fsO * 0.4).toFixed(1) + 'px';
					cx.textAlign = 'center';
					cx.textBaseline = 'middle';
					cx.shadowColor = T.ombra;
					cx.shadowBlur = 8;
					cx.fillStyle = T.occitanTèxt;
					cx.globalAlpha = aUni * (1 - easeS(clamp(vE / 0.6)));
					cx.fillText('OCCITAN', x, y);
					if (cx.globalAlpha > 0.3) {
						const w = cx.measureText('OCCITAN').width / 2 + 6,
							o = this._map.getPixelOrigin().add(this._min);
						caixaOc = [x - w + o.x, y - fsO + o.y, x + w + o.x, y + fsO + o.y].map(Math.round);
					}
				}
				cx.restore();
			}
			dessenharFront();

			/* Noms : capitalas espaçadas, una ombra doça (causida de Romain : pas
			   de contorn negre). De luènh sonque : de prèp, la carta es plena de
			   noms de vilas. Quand un dialècte es causit, sonque son nom. */
			// Lo nom d'una zòna particulara (la Pichona Gavachariá, ancian illòt
			// de lenga d'oïl) : que sa rajadura s'explique sens survòl (retorn de Romain)
			const aEnc = this._doç('enc', clamp((z - 7.6) / 0.5) * clamp(11.5 - z));
			if (aEnc > 0.01 && G.mix && (J.frontiera || J.dialectes)) {
				cx.save();
				cx.font = `italic 400 ${clamp(10 + (z - 8) * 1.5, 10, 13).toFixed(1)}px Luciole, sans-serif`;
				cx.textAlign = 'center';
				cx.textBaseline = 'middle';
				cx.shadowColor = T.ombra;
				cx.shadowBlur = 6;
				cx.fillStyle = `rgba(${T.admin}, 0.9)`;
				cx.globalAlpha = aEnc;
				for (const zm of G.mix) if (zm.props.etiqueta) cx.fillText(zm.props.etiqueta[this._lang === 'fr' ? 'fr' : 'oc'], zm.eti[0], zm.eti[1]);
				cx.restore();
			}
			const aNoms = this._doç('noms', clamp((9.6 - z) / 1.2) * clamp((z - 6.35) / 0.3)) * aFinIntro * (1 - u);
			if (aNoms <= 0.01) {
				// (una bóstia establa : las autras còlas gardan lors etiquetas en cache)
				const clau = caixaOc ? 'oc:' + caixaOc.join(',') : null;
				if (clau !== this._caixasNoms?.clau) this._caixasNoms = caixaOc ? { clau, z, cs: [caixaOc] } : null;
			}
			if (aNoms > 0.01) {
				const noms = [];
				if (aJDial > 0.01 && G.zonas)
					for (const zn of G.zonas) if (!this._sels.length || this._sels.includes(zn.kod)) noms.push([zn, T.dial[zn.kod], aJDial]);
				if (aJCro > 0.01 && G.cro && (!this._sels.length || this._sels.includes('cro'))) noms.push([G.cro, T.lenga, aJCro]);
				const fs = clamp(10.5 + (z - 6) * 1.1, 10.5, 13);
				cx.save();
				cx.font = `${T.clar ? 700 : 400} ${fs.toFixed(1)}px Luciole, sans-serif`; // (en gras sul fons clar)
				cx.letterSpacing = (fs * 0.32).toFixed(1) + 'px';
				cx.textAlign = 'center';
				cx.textBaseline = 'middle';
				cx.shadowColor = T.ombra;
				cx.shadowBlur = 7;
				// cada nom a son luòc, o a l'entorn se lo nom d'una vila i es ja
				// (retorn de Romain : AUVERNHAT sus MASSÍS CENTRAL, VIVAROAUPENC
				// sus Gap) ; los noms de las cadenas, eles, evitan aqueles
				const o = this._map.getPixelOrigin().add(this._min);
				const ocup = [obstacles?.()]
					.flat()
					.filter(Boolean)
					.flatMap((ob) => {
						const kz = Math.pow(2, z - ob.z);
						return ob.cs.map((b) => [b[0] * kz - o.x, b[1] * kz - o.y, b[2] * kz - o.x, b[3] * kz - o.y]);
					});
				const se = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
				const caixas = [];
				for (const [zn, color, aJ] of noms) {
					let a = aNoms * aJ;
					if (an?.ajust === zn.kod) a *= clamp((p - 0.25) / 0.4); // lo nom arriba aprèp la color
					if (a < 0.01) continue;
					const t = (this._lang === 'fr' ? zn.props.fr : zn.props.oc).toUpperCase();
					const w = cx.measureText(t).width + 6,
						h = fs * 1.5;
					let b = null,
						dec = [0, 0];
					for (const [dx, dy] of DECALATGES_NOM) {
						const c = [zn.eti[0] + dx - w / 2, zn.eti[1] + dy - h / 2, zn.eti[0] + dx + w / 2, zn.eti[1] + dy + h / 2];
						// (entre dos noms de dialèctes, una marja : sens ela se tocavan)
						const cm = [c[0] - 10, c[1] - 9, c[2] + 10, c[3] + 9];
						if (!ocup.some((q) => se(c, q)) && !caixas.some((q) => se(cm, q))) {
							b = c;
							dec = [dx, dy];
							break;
						}
					}
					b ??= [zn.eti[0] - w / 2, zn.eti[1] - h / 2, zn.eti[0] + w / 2, zn.eti[1] + h / 2];
					caixas.push(b);
					// un nom que se deu desplaçar (lo d'una vila ven d'arribar sus el) i
					// glissa, sens sautar (retorn de Romain, 2026-10-09 : PROVENÇAL)
					const [gx, gy] = this._glissar(zn.kod, dec);
					cx.globalAlpha = a;
					cx.fillStyle = T.clar ? mesclar(color, '#2e1d14', 0.7) : mesclar(color, '#fff8ec', 0.35);
					cx.fillText(t, zn.eti[0] + gx, zn.eti[1] + gy);
				}
				cx.restore();
				// gardadas (en coordenadas projectadas) per las autras còlas ; un
				// objècte nòu sonque se càmbian
				const clau = caixas.map((b) => b.map(Math.round).join(',')).join(';') + '@' + z;
				if (clau !== this._caixasNoms?.clau) this._caixasNoms = { clau, z, cs: caixas.map((b) => [b[0] + o.x, b[1] + o.y, b[2] + o.x, b[3] + o.y]) };
			}
		},

		// Una jaça cochada o decochada (domeni, regions, despartaments) : arriba
		// e se'n va dins lo temps (demanda de Romain, 2026-10-09) ; una vegada
		// escantida, sas donadas son levadas
		_jacesVivas(k) {
			return this._jaces[k] || (this._doces?.['jaça-' + k]?.v ?? 0) > 0.01;
		},
		_aJ(k, clauG) {
			const a = this._doç('jaça-' + k, this._jaces[k] ? 1 : 0, 0.6);
			if (clauG && !this._jaces[k] && a <= 0.01 && this._geo?.[clauG]) queueMicrotask(() => this._update());
			return a;
		},
		// La posicion afichada d'un nom de dialècte (decalatge en px) : rejonh sa
		// novèla plaça en 0,6 s
		_glissar(k, [dx, dy]) {
			const D = (this._decNoms ??= {}),
				ara = performance.now();
			let d = D[k];
			if (!d || this._calm) d = D[k] = { x: dx, y: dy, cx: dx, cy: dy };
			else if (d.cx !== dx || d.cy !== dy) Object.assign(d, { x0: d.x, y0: d.y, cx: dx, cy: dy, t0: ara });
			if (d.x !== d.cx || d.y !== d.cy) {
				const q = clamp((ara - d.t0) / 600),
					e = easeS(q);
				d.x = q >= 1 ? d.cx : d.x0 + (d.cx - d.x0) * e;
				d.y = q >= 1 ? d.cy : d.y0 + (d.cy - d.y0) * e;
				if (q < 1) this._rafDoç ??= requestAnimationFrame((ts) => ((this._rafDoç = null), this._pintarA(ts)));
			}
			return [d.x, d.y];
		},
		_copiar(img, a) {
			if (a < 0.005) return; // (una còpia invisibla còsta autant qu'una autra)
			const cx = this._cx;
			cx.save();
			cx.setTransform(1, 0, 0, 1, 0, 0);
			cx.globalAlpha = a;
			cx.drawImage(img, 0, 0, this._cv.width, this._cv.height);
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
		// Lo passatge d'una causida a l'autra (retorn de Romain : sens trauc ni
		// susimpression a la limita de doas zònas que se tòcan) : l'imatge
		// d'abans e lo d'aprèp, cadun dins sa part d'una masca (la taca que se
		// difusa a partir del dialècte apondut ; un fondut simple quand un
		// dialècte es levat), somats sens se recobrir. Al començament, exactament
		// l'imatge d'abans ; a la fin, exactament lo d'aprèp.
		_transicion(p, a) {
			const an = this._anim,
				G = this._geo,
				dpr = this._dpr;
			const zn = an.ajust && an.ajust !== 'cro' ? G.zonas.find((x) => x.kod === an.ajust) : null;
			const t = this._trab,
				tg = t.getContext('2d');
			const t2 = (this._trab2 ??= document.createElement('canvas'));
			t2.width = t.width;
			t2.height = t.height;
			const g2 = t2.getContext('2d');
			// la masca, en pichon (1/6) puèi agrandida : vòra doça a bon mercat
			const m = this._masca,
				k = 1 / 6;
			const mw = Math.max(1, Math.round(t.width * k)),
				mh = Math.max(1, Math.round(t.height * k));
			if (m.width !== mw || m.height !== mh) (m.width = mw), (m.height = mh);
			const mg = m.getContext('2d');
			mg.setTransform(1, 0, 0, 1, 0, 0);
			mg.clearRect(0, 0, m.width, m.height);
			mg.fillStyle = '#000';
			const pts = zn ? this._contornTaca(zn, p) : null;
			if (pts) {
				mg.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
				mg.beginPath();
				pts.forEach(([x, y], i) => (i ? mg.lineTo(x, y) : mg.moveTo(x, y)));
				mg.closePath();
				mg.fill();
				mg.setTransform(1, 0, 0, 1, 0, 0);
			}
			// a la fin (o tot lo long, per un dialècte levat) la masca s'emplís
			// pertot : lo darrièr imatge es exactament lo d'aprèp
			const g = pts ? dossa(clamp((p - 0.75) / 0.25)) : dossa(p);
			if (g > 0) {
				mg.globalAlpha = g;
				mg.fillRect(0, 0, m.width, m.height);
				mg.globalAlpha = 1;
			}
			// aprèp × masca
			tg.setTransform(1, 0, 0, 1, 0, 0);
			tg.globalCompositeOperation = 'source-over';
			tg.clearRect(0, 0, t.width, t.height);
			tg.drawImage(this._imgSel, 0, 0);
			tg.globalCompositeOperation = 'destination-in';
			tg.imageSmoothingQuality = 'high';
			tg.drawImage(m, 0, 0, t.width, t.height);
			// abans × (1 − masca)
			g2.setTransform(1, 0, 0, 1, 0, 0);
			g2.globalCompositeOperation = 'source-over';
			g2.clearRect(0, 0, t2.width, t2.height);
			if (this._imgAvant) g2.drawImage(this._imgAvant, 0, 0);
			g2.globalCompositeOperation = 'destination-out';
			g2.imageSmoothingQuality = 'high';
			g2.drawImage(m, 0, 0, t2.width, t2.height);
			g2.globalCompositeOperation = 'source-over';
			// la soma (additiva : las doas parts son complementàrias)
			tg.globalCompositeOperation = 'lighter';
			tg.drawImage(t2, 0, 0);
			tg.globalCompositeOperation = 'source-over';
			this._copiar(t, a);
			// lo front : una linha lusenta, dins la zòna sonque, que s'esvalís
			const cx = this._cx,
				T = this._tem,
				aF = (1 - dossa(p)) * 0.9;
			if (pts && aF > 0.02) {
				cx.save();
				cx.clip(zn.c, 'evenodd');
				if (G.dom) cx.clip(G.dom, 'evenodd');
				cx.beginPath();
				pts.forEach(([x, y], i) => (i ? cx.lineTo(x, y) : cx.moveTo(x, y)));
				cx.closePath();
				const color = T.dial[zn.kod];
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
