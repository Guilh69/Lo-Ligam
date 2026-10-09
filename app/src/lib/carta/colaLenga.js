// Còla d'una autra lenga (demanda de Romain, 2026-10-08 : lo catalan, puèi
// las autras lengas de França, « suivre la même logique que pour
// l'occitan ») : la meteissa lectura que los dialèctes occitans
// (colaDonadas.js). Sos dialèctes en tenchas fondudas, lors noms, lo survòl e
// la causida (mantun a l'encòp, la color se difusa a partir del còr) ; de
// luènh, la lenga unida de sa color, que se vuèja coma l'Occitània. Una zòna
// « a despart » (la Catalonha del Nòrd, la part de França) se causís sola :
// pintada sonque quand es causida.
//
// Una còla per lenga, dins son pan (entre los dialèctes occitans, 300, e las
// jaces tematicas, 320) ; las donadas se cargan sonque quand la jaça s'aluca.
import { nivèlsDezoom, aDialectes, aDetalh } from './escalas.js';
import { proj0, projectar } from './projeccion.js';
import { cadreDe } from './centrar.js';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const dossa = (t) => 1 - Math.pow(1 - t, 3); // arribada doça
const easeS = (t) => (1 - Math.cos(Math.PI * t)) / 2;
// mescla de doas colors #rrggbb (t = part de la segonda)
const mesclar = (a, b, t) => {
	const h = (c, i) => parseInt(c.slice(1 + 2 * i, 3 + 2 * i), 16);
	return '#' + [0, 1, 2].map((i) => Math.round(lerp(h(a, i), h(b, i), t)).toString(16).padStart(2, '0')).join('');
};

const DURADA = 1700; // ms : difusion d'un dialècte causit
const APAR = 1.9; // s : las tacas de l'aparicion, quand la jaça s'aluca
const PALLA = 0.55; // part de la color levada a una lenga escantida (zònas « istoric »)
// los dialèctes ↔ la lenga unida (s), lo vuèg de luènh (s)
const DURADA_MESCLA = 1.4,
	DURADA_TORN = 2.2, // (lo balet, coma l'occitan)
	DURADA_VUÈG = 1.8;
// los luòcs ensajats per un nom de dialècte (a partir de son ponch)
const DECALATGES_NOM = [[0, 0], [0, -16], [0, 16], [-36, 0], [36, 0], [0, -30], [0, 30], [-30, -18], [30, 18], [30, -18], [-30, 18], [0, -44], [0, 44], [-60, 0], [60, 0]];

const promesas = {};
const cargarJson = (url) =>
	(promesas[url] ??= fetch(url)
		.then((r) => (r.ok ? r.json() : null))
		.catch(() => null));

export function crearColaLenga(
	L,
	lenga,
	{ clar = false, dalt = false, lang = 'oc', actiu = false, ocupat = null, obstacles = null, onSurvòl = null, onCausida = null, onDonadas = null } = {}
) {
	const pan = 'lenga-' + lenga.kod;
	// lo nom d'una zòna dins la lenga (ca, frp…)
	const endo = (pr) => pr[lenga.lang] ?? pr.endo ?? pr.ca ?? null;
	const temaDe = (c, d) => {
		const m = d ? 'dalt' : c ? 'clar' : 'sorne';
		const dial = {};
		for (const [k, v] of Object.entries(lenga.dial[m])) dial[lenga.pref + k] = v;
		return {
			clar: c,
			tencha: c ? 0.22 : 0.3,
			ombra: c ? 'rgba(245, 234, 216, 0.95)' : 'rgba(18, 9, 6, 0.9)',
			mòde: m,
			color: lenga.color[m],
			tèxt: lenga.tèxt[m],
			dial
		};
	};
	const Cola = L.Layer.extend({
		options: { pane: pan, padding: 0.3, attribution: lenga.atribucion },

		initialize() {
			this._tem = temaDe(clar, dalt);
			this._lang = lang;
			this._actiu = actiu;
			this._sels = []; // las zònas causidas, dins l'òrdre de la causida
			this._pus = null; // la zòna jos lo cursor
			this._anim = null;
			this._calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		},

		onAdd(map) {
			if (!map.getPane(pan)) {
				const p = map.createPane(pan);
				p.style.zIndex = '305';
				p.style.pointerEvents = 'none';
				// (lo fondut d'escantiment sul pan, pas sul canavàs : una transicion
				// sul canavàs remplaçariá la de Leaflet pel zoom)
				p.style.transition = 'opacity 0.6s ease';
				p.style.opacity = this._actiu ? '1' : '0';
			}
			this._cv = L.DomUtil.create('canvas', 'cola-lenga leaflet-zoom-animated', map.getPane(pan));
			this._cx = this._cv.getContext('2d');
			for (const k of ['_imgTotes', '_imgSel', '_imgUni', '_imgFlo', '_trab', '_masca']) this[k] = document.createElement('canvas');
			this._cargar();
			this._update();
			document.fonts?.load('400 12px Luciole').then(() => this._pintar(), () => {});
		},

		onRemove() {
			for (const r of ['_raf', '_rafRel', '_rafApar']) cancelAnimationFrame(this[r]);
			clearTimeout(this._tEscafar);
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

		// Las donadas se telecargan sonque quand la jaça es alucada
		_cargar() {
			if (!this._actiu || this._d || this._cargant) return;
			this._cargant = true;
			cargarJson(lenga.url).then((d) => {
				this._cargant = false;
				if (!d?.features) return;
				// (còdis prefixats : « ca-central », distints dels dialèctes occitans)
				const noms = Object.fromEntries((lenga.pastilhas || []).map((q) => [lenga.pref + q.k, { [lenga.lang]: q[lenga.lang] ?? q.ca, oc: q.oc, fr: q.fr }]));
				for (const f of d.features) {
					const p = f.properties;
					if (!p.kod.startsWith(lenga.pref)) p.kod = lenga.pref + p.kod;
					// (los noms del panèl, una sola font)
					if (noms[p.kod]) Object.assign(p, noms[p.kod]);
					const ap = lenga.apart?.[p.kod.slice(lenga.pref.length)];
					// (los dialèctes que la zòna a despart recòbre : los del fichièr, siquenon los de lengas.js)
					if (ap || p.apart) (p.apart = true), (p.dins = (p.dins ?? ap?.dins ?? []).map((k) => (k.startsWith(lenga.pref) ? k : lenga.pref + k)));
				}
				// l'emprèsa del domeni (pel vuèg, de luènh)
				let x0 = 180, y0 = 90, x1 = -180, y1 = -90;
				for (const a of d.domeni?.anels || [])
					for (const [x, y] of a) (x0 = Math.min(x0, x)), (y0 = Math.min(y0, y)), (x1 = Math.max(x1, x)), (y1 = Math.max(y1, y));
				this._caixaDom = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]];
				this._d = d;
				onDonadas?.(d);
				this._rel = null; // (l'escala d'ara, sens animacion)
				if (this._actiu) this._tAluc = performance.now();
				this._update();
				this._lançarApar();
				// una causida venguda abans las donadas (pastilha del panèl)
				if (this._sels.length) this._aplicar([...this._sels], false);
			});
		},

		// La jaça alucada : las tacas de cada dialècte s'espandisson a partir de
		// lor còr ; escantida : la còla s'esvanís
		setActiu(on) {
			on = !!on;
			if (on === this._actiu) return;
			this._actiu = on;
			const p = this._map?.getPane(pan);
			if (p) p.style.opacity = on ? '1' : '0';
			clearTimeout(this._tEscafar);
			if (on) {
				this._rel = null;
				this._tAluc = performance.now();
				this._cargar();
				this._update();
				this._lançarApar();
			} else {
				this._survòl(null);
				if (this._sels.length) this._aplicar([], false);
				// (escafat aprèp lo fondut)
				this._tEscafar = setTimeout(() => !this._actiu && this._cx && this._cx.clearRect(0, 0, this._cv.width, this._cv.height), 700);
			}
		},
		setTema(c, d) {
			this._tem = temaDe(c, d);
			this._tenchasGeo = null;
			this._uniGeo = null;
			this._transGeo = null;
			this._pintar();
		},
		setLenga(l) {
			this._lang = l;
			this._pintar();
		},
		// Causida venguda de defòra (lo panèl) : las zònas d'aquesta lenga
		causir(kods = []) {
			kods = kods.filter((k) => k.startsWith(lenga.pref));
			if (kods.length === this._sels.length && kods.every((k) => this._sels.includes(k))) return;
			this._aplicar(kods, true);
		},
		// las bóstias dels noms pausats (per las autras còlas)
		caixasNoms() {
			return this._caixasNoms ?? null;
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

		/* ---------- Relais dins lo temps (coma los dialèctes occitans) ---------- */
		_majUni() {
			const n = this._nivèls;
			if (!n) return;
			// un grand saut de zoom : l'estat final dirèctament
			const salt = this._zPrec != null && Math.abs(this._zoom - this._zPrec) > 1.5;
			this._zPrec = this._zoom;
			this._relais('uni', this._zoom < n.zDial ? 1 : 0, (c) => (c ? DURADA_MESCLA : DURADA_TORN), salt);
			this._relais('vuèg', this._zoom < n.zVuèg ? 1 : 0, DURADA_VUÈG, salt);
			this._relais('det', aDetalh(n, this._zoom), 0.45, salt);
		},
		_relais(clau, cibla, dura, immediat = false) {
			const R = (this._rel ??= {}),
				r = R[clau],
				ms = (c) => (typeof dura === 'function' ? dura(c) : dura) * 1000;
			if (!r || this._calm || immediat) {
				R[clau] = { v: cibla, cibla, q: 1 };
				return;
			}
			if (r.cibla === cibla) return;
			Object.assign(r, { de: r.v, cibla, t0: null, dura: ms(cibla), q: 0 });
			if (this._rafRel) return;
			const pas = (ts) => {
				let viu = false;
				const t = performance.now();
				for (const x of Object.values(R))
					if (x.q < 1) {
						x.t0 ??= t;
						x.q = clamp((t - x.t0) / x.dura);
						x.v = lerp(x.de, x.cibla, x.q);
						if (x.q < 1) viu = true;
					}
				this._pintarA(ts);
				this._rafRel = viu && this._map ? requestAnimationFrame(pas) : null;
			};
			this._rafRel = requestAnimationFrame(pas);
		},
		// l'aparicion (jaça alucada) : una bocla fins que las tacas e los noms son aquí
		_lançarApar() {
			if (this._rafApar || this._calm || !this._d || !this._actiu) return;
			const pas = (ts) => {
				this._pintarA(ts);
				const viu = (performance.now() - (this._tAluc ?? 0)) / 1000 < APAR + 0.9;
				this._rafApar = viu && this._map ? requestAnimationFrame(pas) : null;
			};
			this._rafApar = requestAnimationFrame(pas);
		},
		_tA() {
			return this._calm || this._tAluc == null ? 99 : (performance.now() - this._tAluc) / 1000;
		},
		// (mantuna bocla d'animacion dins la meteissa imatge : un sol dessenh)
		_pintarA(ts) {
			if (ts === this._tsPintat) return;
			this._tsPintat = ts;
			this._pintar();
		},

		/* ---------- Survòl e causida ---------- */
		_interactiu() {
			if (!this._actiu || !this._geo?.zonas) return false;
			return !(this._nivèls && aDialectes(this._nivèls, this._zoom) < 0.5);
		},
		// La zòna jos un ponch : una zòna a despart causida (la Catalonha del
		// Nòrd), puèi los dialèctes ; res defòra del domeni
		zonaA(lp, ambTrans = false) {
			const G = this._geo;
			if (!this._interactiu()) return null;
			const tc = (this._cxTest ??= document.createElement('canvas').getContext('2d'));
			const x = lp.x - this._min.x,
				y = lp.y - this._min.y;
			if (G.dom && !tc.isPointInPath(G.dom, x, y, 'evenodd')) return null;
			if (ambTrans) for (const zn of G.trans) if (tc.isPointInPath(zn.c, x, y, 'evenodd')) return zn.kod;
			for (const zn of G.apart) if (this._sels.includes(zn.kod) && tc.isPointInPath(zn.c, x, y, 'evenodd')) return zn.kod;
			for (const zn of G.zonas) if (tc.isPointInPath(zn.c, x, y, 'evenodd')) return zn.kod;
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
			if (!this._interactiu()) return this._survòl(null);
			const k = ocupat?.(e.layerPoint) ? null : this.zonaA(e.layerPoint, true);
			this._survòl(k);
			if (k) this._map.getContainer().style.cursor = 'pointer';
		},
		_onSortida() {
			this._survòl(null);
		},
		// lo cadre de la zòna jos lo ponch (doble clic : centrar.js)
		cadreA(lp) {
			const k = this.zonaA(lp, true);
			return k ? cadreDe(this._d?.features.find((x) => x.properties.kod === k)) : null;
		},
		_onClic(e) {
			// (lo segond clic d'un doble clic : la vista se centra, la causida demòra)
			if (e.originalEvent?.detail > 1) return;
			if (!this._interactiu() || ocupat?.(e.layerPoint)) return;
			// un clic sus una zòna l'apond a la causida, o l'en leva ; defòra,
			// totes los dialèctes tornan
			const k = this.zonaA(e.layerPoint);
			if (!k) return this._sels.length && this._aplicar([], true);
			this._aplicar(this._sels.includes(k) ? this._sels.filter((x) => x !== k) : [...this._sels, k], true);
		},
		_nomDe(k) {
			const p = k && this._d?.features.find((x) => x.properties.kod === k)?.properties;
			if (!p) return null;
			// un parlar de transicion : son nom, e çò qu'es (entre quinas lengas)
			if (p.transicio)
				return {
					kod: k,
					oc: endo(p) ?? p.oc,
					fr: endo(p) ?? p.fr,
					lang: lenga.lang,
					// (la nòta es en francés : sonque dins l'interfàcia francesa)
					sota_oc: `${p.oc ? p.oc + ' · ' : ''}${p.nota_oc ?? 'parlar de transicion'}`,
					sota_fr: `${p.fr ? p.fr + ' · ' : ''}${p.nota_fr ?? p.nota ?? 'parler de transition'}`,
					encadrat: p.encadrat,
					mix: true
				};
			// (un dialècte d'una lenga de la familha, coma lo ch'ti : son sostítol)
			const sota = p.apart ? lenga.sotaApart : p.sota_fr ? { oc: p.sota_oc, fr: p.sota_fr } : lenga.sota;
			// lo nom dins la lenga ; dejós, l'occitan (o lo francés) se n'es un autre
			const nom = endo(p) ?? p.oc;
			const amb = (n, s) => (n && n.toLowerCase() !== nom.toLowerCase() ? `${n} · ${s}` : s);
			return { kod: k, oc: nom, fr: nom, lang: lenga.lang, sota_oc: amb(p.oc, sota.oc), sota_fr: amb(p.fr, sota.fr), mix: true };
		},
		// Novèla causida : una zòna apondida se difusa a partir de son còr, una
		// zòna levada s'escantís, la darrièra levada fa tornar totas las zònas
		_aplicar(sels, anim) {
			const de = this._sels;
			this._sels = sels;
			const ajust = sels.filter((k) => !de.includes(k));
			const lev = de.filter((k) => !sels.includes(k));
			const totesAvant = !de.length && !!this._d && performance.now() - (this._tAluc ?? 0) > 400;
			this._anim =
				anim && !this._calm && this._geo && (ajust.length || lev.length)
					? { de: [...de], a: [...sels], ajust: ajust.length === 1 ? ajust[0] : null, lev, t0: performance.now(), totesAvant }
					: null;
			this._prepSel();
			const noms = sels.map((k) => this._nomDe(k)).filter(Boolean);
			onCausida?.(
				[...sels],
				noms.length > 1
					? { kod: sels.join('+'), oc: noms.map((n) => n.oc).join(' · '), fr: noms.map((n) => n.fr).join(' · '), sota_oc: `zònas causidas · ${lenga.nom.oc}`, sota_fr: `zones choisies · ${lenga.nom.fr}`, mix: true }
					: (noms[0] ?? null)
			);
			this._pintar();
			if (this._anim) this._bocla();
		},
		_bocla() {
			cancelAnimationFrame(this._raf);
			const pas = (ts) => {
				this._pintarA(ts);
				if (this._anim && performance.now() - this._anim.t0 < DURADA + 50) this._raf = requestAnimationFrame(pas);
				else {
					this._anim = null;
					this._prepSel();
					this._pintar();
				}
			};
			this._raf = requestAnimationFrame(pas);
		},

		/* ---------- Geometria (a cada recalatge) ---------- */
		_update() {
			const map = this._map;
			if (!map || !this._cv || !this._actiu) return;
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
			if (!this._d) return (this._geo = null);
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
				const pr = f.properties;
				return { kod: pr.kod, c, eti: pt(pr.eti ?? [(x0 + x1) / 2, (y0 + y1) / 2]), props: pr, bbox: [x0, y0, x1, y1] };
			};
			const dom = this._d.domeni;
			const fs = this._d.features;
			this._geo = {
				pt,
				mPx: 112600 / Math.pow(2, z), // mètres per pixel (environ)
				dom: dom?.anels?.length ? cami(dom.anels) : null,
				linhas: (dom?.linhas || []).map((l) => projectar(map, l, z, o.x, o.y)),
				zonas: fs.filter((f) => !f.properties.apart && !f.properties.transicio).map(zona),
				apart: fs.filter((f) => f.properties.apart).map(zona),
				// (los parlars de transicion, sus los dialèctes)
				// (sonque las transicions amb una autra lenga, coma lo benasqués : las d'entre
				// dos dialèctes de la lenga cobririán de grandas zònas d'asclas)
				trans: fs.filter((f) => f.properties.transicio && (f.properties.entre || []).some((k) => !lenga.dial.sorne[k])).map(zona)
			};
			// las tenchas fondudas : preparadas al primièr dessenh que n'a besonh
			this._tenchasGeo = null;
			this._pintar();
		},

		// Una zòna (o totas) en tencha fonduda, dins un canavàs de la talha del
		// principal (meteis biais que los dialèctes occitans) : espandidas cap a
		// l'exterior (lo fondut se palís pas sus la còsta), puèi las vertadièras
		// dessús, lo tot retalhat pel domeni. Una zòna sola : res sus sas vesinas.
		_tencha(c, zonas, sola = false) {
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
			const color = (zn) => (zn.props.apart ? T.color : (T.dial[zn.kod] ?? zn.props.color ?? T.color));
			for (const zn of zonas) {
				tg.strokeStyle = color(zn);
				tg.lineWidth = flo * 6;
				tg.stroke(zn.c);
			}
			for (const zn of zonas) {
				tg.fillStyle = color(zn);
				tg.fill(zn.c, 'evenodd');
			}
			// (lenga escantida : pus palla, vejatz _prepUni)
			tg.save();
			tg.globalCompositeOperation = 'destination-out';
			tg.globalAlpha = PALLA;
			for (const zn of zonas) if (zn.props.istoric) tg.fill(zn.c, 'evenodd');
			tg.restore();
			if (sola) {
				// (una zòna a despart recòbre de dialèctes : aqueles demòran)
				const dins = new Set(zonas.flatMap((zn) => zn.props.dins || []));
				tg.save();
				tg.globalCompositeOperation = 'destination-out';
				for (const v of G.zonas) {
					if (zonas.includes(v) || dins.has(v.kod)) continue;
					tg.fill(v.c, 'evenodd');
					tg.lineWidth = flo * 2.4;
					tg.stroke(v.c);
				}
				tg.restore();
			}
			g.save();
			g.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (G.dom) g.clip(G.dom, 'evenodd');
			// (una zòna a despart a sos bòrds nets : es una entitat, pas un parlar)
			const apart = zonas.filter((zn) => zn.props.apart);
			if (apart.length && apart.length === zonas.length) {
				const p = new Path2D();
				for (const zn of apart) p.addPath(zn.c);
				g.clip(p, 'evenodd');
			}
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.filter = `blur(${(flo * dpr).toFixed(1)}px)`;
			g.drawImage(t, 0, 0);
			g.restore();
		},
		_zonasDe(l) {
			const G = this._geo;
			return [...G.zonas, ...G.apart].filter((x) => l.includes(x.kod));
		},
		_prepSel() {
			if (!this._geo) return;
			const an = this._anim;
			this._tencha(this._imgSel, this._zonasDe(this._sels), true);
			if (an) {
				const c = (this._imgAvant ??= document.createElement('canvas'));
				c.width = this._cv.width;
				c.height = this._cv.height;
				this._tencha(c, this._zonasDe(an.de), true);
			}
		},
		_prepPus() {
			const G = this._geo,
				zn = this._pus && G && !this._pus.startsWith(lenga.pref + 'trans') ? this._zonasDe([this._pus])[0] : null;
			this._pusOk = !!zn;
			if (!zn) return;
			this._imgPus ??= document.createElement('canvas');
			this._imgPus.width = this._cv.width;
			this._imgPus.height = this._cv.height;
			this._tencha(this._imgPus, [zn], true);
		},
		// Los parlars de transicion : d'asclas finas de la color de la lenga,
		// vistas a travèrs de lor zòna fonduda (bòrd flo d'environ 3 km, pas cap
		// de contorn : es una transicion, pas una limita), coma lo Creissent
		_prepTrans() {
			const G = this._geo;
			this._transGeo = G;
			this._transPus = undefined;
			if (!G?.trans?.length) return;
			this._imgTrans ??= document.createElement('canvas');
			this._pintarTrans(this._imgTrans, G.trans);
		},
		// la zòna de transicion survolada, sola (retorn de Romain, 2026-10-09 :
		// lo survòl d'una zòna alucava tanben las autras)
		_prepTransPus() {
			const G = this._geo;
			this._transPus = this._pus;
			const zn = G?.trans?.find((x) => x.kod === this._pus);
			if (!zn) return;
			this._imgTransPus ??= document.createElement('canvas');
			this._pintarTrans(this._imgTransPus, [zn]);
		},
		// Cada zòna a son motiu : d'asclas finas de la color de la lenga ; una
		// zòna « mescla » (contacte basc-gascon : retorn de Romain, « que les
		// couleurs du gascon et du basque s'entremêlent ») a de bendas largas de
		// la color de l'autra lenga, que s'entremesclan amb la tencha de la lenga
		_pintarTrans(c, zonas) {
			const G = this._geo;
			c.width = this._cv.width;
			c.height = this._cv.height;
			const g = c.getContext('2d');
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.clearRect(0, 0, c.width, c.height);
			const t = (this._imgTransZona ??= document.createElement('canvas'));
			t.width = c.width;
			t.height = c.height;
			for (const zn of zonas) {
				this._pintarTransZona(t, zn);
				g.drawImage(t, 0, 0);
			}
		},
		_pintarTransZona(c, zn) {
			const G = this._geo,
				dpr = this._dpr;
			const g = c.getContext('2d');
			const motiu = document.createElement('canvas');
			const pas = Math.round(8 * dpr);
			motiu.width = motiu.height = pas;
			const m = motiu.getContext('2d');
			const autra = zn.props.mescla?.[this._tem.mòde];
			m.strokeStyle = autra ?? (this._tem.clar ? this._tem.color : mesclar(this._tem.color, '#fff8ec', 0.25));
			m.lineWidth = (autra ? 2.8 : 1.3) * dpr;
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
			g.save();
			g.filter = `blur(${(clamp(3000 / G.mPx, 1.5, 30) * dpr).toFixed(1)}px)`;
			g.setTransform(dpr, 0, 0, dpr, 0, 0);
			g.fillStyle = '#000';
			g.fill(zn.c, 'evenodd');
			g.restore();
			// (pas defòra del domeni, levat las zònas « defora » : la benda de
			// contacte de l'arpitan es dins lo domeni occitan, Romain 2026-10-09)
			const defora = zn.props.defora ? [zn] : [];
			if (G.dom && defora.length) {
				const m = (this._imgTransMasca ??= document.createElement('canvas'));
				m.width = c.width;
				m.height = c.height;
				const mg = m.getContext('2d');
				mg.setTransform(dpr, 0, 0, dpr, 0, 0);
				mg.fillStyle = '#000';
				mg.fill(G.dom, 'evenodd');
				for (const zn of defora) mg.fill(zn.c, 'evenodd');
				g.save();
				g.globalCompositeOperation = 'destination-in';
				g.drawImage(m, 0, 0);
				g.restore();
			} else if (G.dom) {
				g.save();
				g.setTransform(dpr, 0, 0, dpr, 0, 0);
				g.globalCompositeOperation = 'destination-in';
				g.fill(G.dom, 'evenodd');
				g.restore();
			}
			g.globalCompositeOperation = 'source-in';
			g.fillStyle = g.createPattern(motiu, 'repeat');
			g.fillRect(0, 0, c.width, c.height);
			g.globalCompositeOperation = 'source-over';
		},
		// la lenga unida : son domeni, d'una color, a mièja resolucion (es flo)
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
			g.fillStyle = this._tem.color;
			g.fill(G.dom, 'evenodd');
			// (las zònas « istoric », lenga escantida : l'alavés, lo navarrés
			// oriental, pus pallas, coma lo gascon escantit de l'occitan)
			g.globalCompositeOperation = 'destination-out';
			g.globalAlpha = PALLA;
			for (const zn of G.zonas) if (zn.props.istoric) g.fill(zn.c, 'evenodd');
			g.globalAlpha = 1;
			g.globalCompositeOperation = 'source-over';
			g.filter = 'none';
		},
		// los dialèctes fonduts (la mescla cap a la lenga unida), preparats un còp
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
			const G = this._geo;
			if (!G || !this._cv || !this._actiu) return;
			const cx = this._cx,
				T = this._tem,
				dpr = this._dpr,
				z = this._zoom;
			cx.setTransform(1, 0, 0, 1, 0, 0);
			cx.clearRect(0, 0, this._cv.width, this._cv.height);
			cx.setTransform(dpr, 0, 0, dpr, 0, 0);
			// Las escalas coma l'occitan : vers « 200 km » los dialèctes se fondon
			// dins la lenga unida, a « 500 km » demòra lo contorn ; de fòrt prèp,
			// las tenchas s'esvanisson (los contorns simplificats se decalarián)
			const nv = this._nivèls ?? nivèlsDezoom(this._map),
				R = this._rel ?? {},
				aDet = R.det?.v ?? aDetalh(nv, z),
				aTenchas0 = clamp((13 - z) / 1.5),
				aFront = dossa(clamp((13 - z) / 2)) * aDet;
			// u : 0 los dialèctes, 1 la lenga unida (relais dins lo temps). Cap a
			// la lenga unida, la mescla : los dialèctes se fondon e prenon sa color.
			// Cap als dialèctes, lo balet (coma l'occitan) : tornan en fuòc
			// d'artifici, cadun a partir de son còr, e lors limits se traçan una a una
			const ru = R.uni,
				u = ru ? ru.v : 1 - aDialectes(nv, z),
				qUni = ru?.q ?? 1,
				balet = ru?.cibla === 0 && u > 0.001,
				mescla = ru?.cibla === 1 && u > 0.001,
				flo = mescla ? easeS(clamp(u / 0.6)) : 0,
				aDialU = mescla ? 1 - easeS(clamp((u - 0.55) / 0.45)) : balet ? 1 : 1 - u,
				vE = easeS(R.vuèg?.v ?? 0);
			const aT = T.tencha * lerp(1, 0.3, clamp((z - 7) / 4)) * aTenchas0 * aDialU;
			const an = this._anim,
				p = an ? clamp((performance.now() - an.t0) / DURADA) : 1;
			const tA = this._tA(),
				aFinApar = clamp((tA - (APAR - 0.5)) / 0.8);

			if (this._tenchasGeo !== G && u < 0.999) {
				this._tenchasGeo = G;
				this._tencha(this._imgTotes, G.zonas);
				this._prepSel();
				this._prepPus();
			}
			/* Dialèctes */
			const sel = this._sels.length > 0;
			if (u < 0.999) {
				let aTotes = sel ? 0 : 1;
				if (an && an.de.length && !an.a.length) aTotes = dossa(clamp(p / 0.6));
				if (an && an.a.length && !an.de.length) aTotes = an.totesAvant ? 1 - dossa(clamp(p / 0.35)) : 0;
				if (balet && !sel) this._aparicion(qUni * APAR, aT);
				else if (tA < APAR && !sel) this._aparicion(tA, aT);
				else if (aTotes > 0.01) {
					if (flo > 0.01) {
						if (this._floGeo !== G) this._prepFlo();
						this._copiar(this._imgTotes, aT * aTotes * (1 - flo));
						this._copiar(this._imgFlo, aT * aTotes * flo);
					} else this._copiar(this._imgTotes, aT * aTotes);
				}
				// las zònas causidas, solas, mai marcadas ; l'apondida se difusa
				if (an && (an.ajust || an.lev.length)) this._transicion(p, aT * 1.6);
				else if (sel) this._copiar(this._imgSel, aT * 1.6);
				// survòl (sens causida) : la zòna s'esclarzís un pauc
				if (!sel && this._pusOk) this._copiar(this._imgPus, aT * 0.45);
				// los parlars de transicion, en asclas (mai marcadas al survòl)
				if (G.trans.length && !sel) {
					if (this._transGeo !== G) this._prepTrans();
					const aTr = aTenchas0 * aDialU * Math.min(1, tA / APAR);
					this._copiar(this._imgTrans, 0.6 * aTr);
					// (la zòna survolada sola, mai marcada)
					if (this._pus && G.trans.some((zn) => zn.kod === this._pus)) {
						if (this._transPus !== this._pus) this._prepTransPus();
						this._copiar(this._imgTransPus, 0.35 * aTr);
					}
				}
				// … e prenon la color de la lenga unida (la mescla sonque)
				if (mescla) {
					cx.save();
					cx.setTransform(1, 0, 0, 1, 0, 0);
					cx.globalCompositeOperation = 'source-atop';
					cx.globalAlpha = easeS(clamp(u / 0.7)) * 0.85;
					cx.fillStyle = T.color;
					cx.fillRect(0, 0, this._cv.width, this._cv.height);
					cx.restore();
				}
			}
			// lo balet : las limits dels dialèctes se traçan una a una, de lor
			// color, puèi s'esvanisson dins lo fondut
			if (balet) {
				cx.save();
				cx.lineJoin = 'round';
				cx.lineCap = 'round';
				cx.lineWidth = 0.9;
				G.zonas.forEach((zn, i) => {
					if (sel && !this._sels.includes(zn.kod)) return;
					const pz = clamp((qUni - 0.04 - i * 0.15) / 0.22);
					if (pz <= 0 || pz >= 1) return;
					const [x0, y0, x1, y1] = zn.bbox,
						Lm = (x1 - x0 + y1 - y0) * 3.2;
					cx.setLineDash([Lm * easeS(clamp(pz / 0.65)), Lm]);
					cx.strokeStyle = T.dial[zn.kod] ?? T.color;
					cx.globalAlpha = Math.sin(Math.PI * pz) * 0.9;
					cx.stroke(zn.c);
				});
				cx.restore();
			}
			// una zòna a despart causida (la Catalonha del Nòrd) : son contorn fin
			const apartSel = G.apart.filter((zn) => this._sels.includes(zn.kod));
			if (apartSel.length && aDialU > 0.01) {
				cx.save();
				cx.strokeStyle = T.clar ? T.color : mesclar(T.color, '#fff8ec', 0.3);
				cx.lineWidth = 1.1;
				cx.lineJoin = 'round';
				cx.setLineDash([5, 3.5]);
				let a = 0.85 * aDialU * aTenchas0;
				if (an?.ajust && apartSel.some((zn) => zn.kod === an.ajust)) a *= clamp((p - 0.3) / 0.5);
				cx.globalAlpha = a;
				for (const zn of apartSel) cx.stroke(zn.c);
				cx.restore();
			}

			/* La frontièra de la lenga : de ponches de sa color (las frontièras
			   terrèstras sonque, pas la còsta) */
			const aF = aFront * (1 - u) * Math.min(1, tA / 0.8);
			if (G.linhas.length && aF > 0.01) {
				const vague = clamp((z - 7.5) / 2.5);
				cx.save();
				cx.strokeStyle = T.color;
				cx.lineCap = 'round';
				cx.lineJoin = 'round';
				cx.beginPath();
				for (const l of G.linhas) {
					cx.moveTo(l[0][0], l[0][1]);
					for (let i = 1; i < l.length; i++) cx.lineTo(l[i][0], l[i][1]);
				}
				if (vague > 0.01) {
					const larg = Math.max(4, 4000 / G.mPx);
					for (const [k, al] of [[1, 0.05], [0.55, 0.06]]) {
						cx.globalAlpha = vague * al * aF;
						cx.lineWidth = larg * k;
						cx.stroke();
					}
				}
				cx.setLineDash([0.01, 4.2 + vague * 3]);
				cx.lineWidth = 1.4 + vague * 0.6;
				cx.globalAlpha = lerp(0.8, 0.3, vague) * aF;
				cx.stroke();
				cx.restore();
			}

			/* La lenga unida, de luènh : plena fins a « 700 km », puèi se vuèja
			   del mitan cap als bòrds ; son contorn demòra */
			const aUni = (balet ? u : easeS(clamp((u - 0.4) / 0.6))) * Math.min(1, tA / 0.8);
			let caixaL = null;
			if (G.dom && aUni > 0.01) {
				cx.save();
				if (vE < 0.999) {
					if (this._uniGeo !== G) this._prepUni();
					let img = this._imgUni;
					if (vE > 0.001) {
						const c = (this._imgVuèg ??= document.createElement('canvas'));
						if (c.width !== img.width || c.height !== img.height) (c.width = img.width), (c.height = img.height);
						const g = c.getContext('2d'),
							k = this._dpr * (img.width / this._cv.width);
						g.setTransform(1, 0, 0, 1, 0, 0);
						g.globalCompositeOperation = 'source-over';
						g.clearRect(0, 0, c.width, c.height);
						g.drawImage(img, 0, 0);
						const [cx0, cy0] = G.pt(lenga.eti),
							rMax = Math.max(...(this._caixaDom || []).map((q) => Math.hypot(G.pt(q)[0] - cx0, G.pt(q)[1] - cy0)), 1),
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
					this._copiar(img, aUni * T.tencha * 1.6 * aTenchas0);
				}
				cx.globalAlpha = aUni * lerp(0.7, 0.95, vE) * aTenchas0;
				cx.strokeStyle = T.color;
				cx.lineWidth = 0.8;
				cx.lineJoin = 'round';
				cx.stroke(G.dom);
				if (vE < 0.6) {
					const [x, y] = G.pt(lenga.eti);
					const fsO = clamp(9 + (z - 3.75) * 3, 9, 15);
					const t = lenga.nomCarta ?? lenga.nom.endo.toUpperCase();
					cx.font = `600 ${fsO.toFixed(1)}px Luciole, sans-serif`;
					cx.letterSpacing = (fsO * 0.4).toFixed(1) + 'px';
					cx.textAlign = 'center';
					cx.textBaseline = 'middle';
					cx.shadowColor = T.ombra;
					cx.shadowBlur = 8;
					cx.fillStyle = T.tèxt;
					cx.globalAlpha = aUni * (1 - easeS(clamp(vE / 0.6)));
					cx.fillText(t, x, y);
					if (cx.globalAlpha > 0.3) {
						const w = cx.measureText(t).width / 2 + 6,
							o = this._map.getPixelOrigin().add(this._min);
						caixaL = [x - w + o.x, y - fsO + o.y, x + w + o.x, y + fsO + o.y].map(Math.round);
					}
				}
				cx.restore();
			}

			/* Noms dels dialèctes : capitalas espaçadas, de lor color (coma
			   l'occitan) ; de luènh sonque. Quand de zònas son causidas, lors noms. */
			const aNoms = this._doç('noms', clamp((9.6 - z) / 1.2) * clamp((z - 6.35) / 0.3)) * (1 - u) * aFinApar;
			const caixas = [];
			if (aNoms > 0.01) {
				const noms = sel ? this._zonasDe(this._sels) : G.zonas;
				const fs = clamp(10.5 + (z - 6) * 1.1, 10.5, 13);
				cx.save();
				cx.font = `400 ${fs.toFixed(1)}px Luciole, sans-serif`;
				cx.letterSpacing = (fs * 0.32).toFixed(1) + 'px';
				cx.textAlign = 'center';
				cx.textBaseline = 'middle';
				cx.shadowColor = T.ombra;
				cx.shadowBlur = 7;
				// cada nom a son luòc, o a l'entorn se un autre nom i es ja
				const o = this._map.getPixelOrigin().add(this._min);
				const ocup = [];
				for (const ob of obstacles?.() || []) {
					if (!ob) continue;
					const kz = Math.pow(2, z - ob.z);
					for (const b of ob.cs) ocup.push([b[0] * kz - o.x, b[1] * kz - o.y, b[2] * kz - o.x, b[3] * kz - o.y]);
				}
				const se = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
				for (const zn of noms) {
					let a = aNoms;
					if (an?.ajust === zn.kod) a *= clamp((p - 0.25) / 0.4); // lo nom arriba aprèp la color
					if (a < 0.01) continue;
					const t = (endo(zn.props) ?? (this._lang === 'fr' ? zn.props.fr : zn.props.oc)).toUpperCase();
					const w = cx.measureText(t).width + 6,
						h = fs * 1.5;
					// (retorn de Romain, 2026-10-09 : « trop de bruit textuel » sul basc
					// a 70 km) : sens causida, un nom s'aficha sonque se sa zòna es pro
					// larga per el, e se tròba una plaça liura ; si que non arriba en
					// s'apropchant
					if (!sel && zn.bbox[2] - zn.bbox[0] < w * 0.75) continue;
					let b = null;
					for (const [dx, dy] of DECALATGES_NOM) {
						const c = [zn.eti[0] + dx - w / 2, zn.eti[1] + dy - h / 2, zn.eti[0] + dx + w / 2, zn.eti[1] + dy + h / 2];
						const cm = [c[0] - 10, c[1] - 9, c[2] + 10, c[3] + 9];
						if (!ocup.some((q) => se(c, q)) && !caixas.some((q) => se(cm, q))) {
							b = c;
							break;
						}
					}
					if (!b && !sel) continue;
					b ??= [zn.eti[0] - w / 2, zn.eti[1] - h / 2, zn.eti[0] + w / 2, zn.eti[1] + h / 2];
					caixas.push(b);
					const color = zn.props.apart ? T.color : (T.dial[zn.kod] ?? T.color);
					cx.globalAlpha = a;
					cx.fillStyle = T.clar ? mesclar(color, '#2e1d14', 0.25) : mesclar(color, '#fff8ec', 0.35);
					cx.fillText(t, (b[0] + b[2]) / 2, (b[1] + b[3]) / 2);
				}
				cx.restore();
				for (const b of caixas) (b[0] += o.x), (b[1] += o.y), (b[2] += o.x), (b[3] += o.y);
			}
			// (gardadas en coordenadas projectadas ; un objècte nòu sonque se càmbian)
			if (caixaL) caixas.push(caixaL);
			const clau = caixas.map((b) => b.map(Math.round).join(',')).join(';') + '@' + z;
			if (clau !== this._caixasNoms?.clau) this._caixasNoms = caixas.length ? { clau, z, cs: caixas } : null;
		},

		_copiar(img, a) {
			if (a < 0.005) return;
			const cx = this._cx;
			cx.save();
			cx.setTransform(1, 0, 0, 1, 0, 0);
			cx.globalAlpha = a;
			cx.drawImage(img, 0, 0, this._cv.width, this._cv.height);
			cx.restore();
		},
		// Una taca d'encre que s'espandís : un cercle trebolat per quauques
		// sinusas lentas, que viran doçament
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
		_masca1(k = 1 / 6) {
			const t = this._trab,
				m = this._masca;
			const mw = Math.max(1, Math.round(t.width * k)),
				mh = Math.max(1, Math.round(t.height * k));
			if (m.width !== mw || m.height !== mh) (m.width = mw), (m.height = mh);
			const mg = m.getContext('2d');
			mg.setTransform(1, 0, 0, 1, 0, 0);
			mg.clearRect(0, 0, m.width, m.height);
			mg.fillStyle = '#000';
			return mg;
		},
		// L'aparicion : totas las zònas, vistas a travèrs de lors tacas que
		// creisson (cadun a partir de son còr), e lors fronts lusents
		_aparicion(tA, a) {
			const G = this._geo,
				dpr = this._dpr,
				k = 1 / 6,
				mg = this._masca1(k);
			mg.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
			const tacas = G.zonas.map((zn, i) => {
				const p = clamp((tA - i * 0.12) / (APAR - 0.6));
				const pts = p > 0 ? this._contornTaca(zn, p) : null;
				if (pts) {
					mg.beginPath();
					pts.forEach(([x, y], j) => (j ? mg.lineTo(x, y) : mg.moveTo(x, y)));
					mg.closePath();
					mg.fill();
				}
				return { zn, p, pts };
			});
			const t = this._trab,
				tg = t.getContext('2d');
			tg.setTransform(1, 0, 0, 1, 0, 0);
			tg.globalCompositeOperation = 'source-over';
			tg.clearRect(0, 0, t.width, t.height);
			tg.drawImage(this._imgTotes, 0, 0);
			tg.globalCompositeOperation = 'destination-in';
			tg.imageSmoothingQuality = 'high';
			tg.drawImage(this._masca, 0, 0, t.width, t.height);
			tg.globalCompositeOperation = 'source-over';
			this._copiar(t, a);
			this._fronts(tacas.filter((x) => x.pts).map(({ zn, p, pts }) => [zn, pts, (1 - dossa(p)) * 0.8]));
		},
		// los fronts lusents de las tacas, dins lor zòna sonque
		_fronts(lista, larg = 2) {
			const cx = this._cx,
				T = this._tem,
				G = this._geo;
			for (const [zn, pts, aF] of lista) {
				if (aF < 0.02) continue;
				cx.save();
				cx.clip(zn.c, 'evenodd');
				if (G.dom) cx.clip(G.dom, 'evenodd');
				cx.beginPath();
				pts.forEach(([x, y], j) => (j ? cx.lineTo(x, y) : cx.moveTo(x, y)));
				cx.closePath();
				const color = zn.props.apart ? T.color : (T.dial[zn.kod] ?? T.color);
				cx.strokeStyle = T.clar ? color : mesclar(color, '#fff8ec', 0.45);
				cx.shadowColor = color;
				cx.shadowBlur = 14;
				cx.globalAlpha = aF;
				cx.lineWidth = larg;
				cx.stroke();
				cx.restore();
			}
		},
		// Lo passatge d'una causida a l'autra (coma los dialèctes occitans) :
		// l'imatge d'abans e lo d'aprèp, cadun dins sa part d'una masca (la taca
		// que se difusa a partir de la zòna apondida ; un fondut simple quand
		// una zòna es levada), somats sens se recobrir
		_transicion(p, a) {
			const an = this._anim,
				dpr = this._dpr;
			const zn = an.ajust ? this._zonasDe([an.ajust])[0] : null;
			const t = this._trab,
				tg = t.getContext('2d');
			const t2 = (this._trab2 ??= document.createElement('canvas'));
			if (t2.width !== t.width || t2.height !== t.height) (t2.width = t.width), (t2.height = t.height);
			const g2 = t2.getContext('2d');
			const k = 1 / 6,
				mg = this._masca1(k),
				m = this._masca;
			const pts = zn ? this._contornTaca(zn, p) : null;
			if (pts) {
				mg.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
				mg.beginPath();
				pts.forEach(([x, y], i) => (i ? mg.lineTo(x, y) : mg.moveTo(x, y)));
				mg.closePath();
				mg.fill();
				mg.setTransform(1, 0, 0, 1, 0, 0);
			}
			const gm = pts ? dossa(clamp((p - 0.75) / 0.25)) : dossa(p);
			if (gm > 0) {
				mg.globalAlpha = gm;
				mg.fillRect(0, 0, m.width, m.height);
				mg.globalAlpha = 1;
			}
			tg.setTransform(1, 0, 0, 1, 0, 0);
			tg.globalCompositeOperation = 'source-over';
			tg.clearRect(0, 0, t.width, t.height);
			tg.drawImage(this._imgSel, 0, 0);
			tg.globalCompositeOperation = 'destination-in';
			tg.imageSmoothingQuality = 'high';
			tg.drawImage(m, 0, 0, t.width, t.height);
			g2.setTransform(1, 0, 0, 1, 0, 0);
			g2.globalCompositeOperation = 'source-over';
			g2.clearRect(0, 0, t2.width, t2.height);
			if (this._imgAvant) g2.drawImage(this._imgAvant, 0, 0);
			g2.globalCompositeOperation = 'destination-out';
			g2.imageSmoothingQuality = 'high';
			g2.drawImage(m, 0, 0, t2.width, t2.height);
			g2.globalCompositeOperation = 'source-over';
			tg.globalCompositeOperation = 'lighter';
			tg.drawImage(t2, 0, 0);
			tg.globalCompositeOperation = 'source-over';
			this._copiar(t, a);
			if (pts) this._fronts([[zn, pts, (1 - dossa(p)) * 0.9]], 2.2);
		}
	});
	return new Cola();
}
