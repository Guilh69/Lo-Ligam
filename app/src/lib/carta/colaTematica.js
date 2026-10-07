// Còla tematica (2026-10-07) : las jaces del catalògue tiradas de fonts
// publicas, pintadas dins un canavàs (pan 'tematica', dessús las tenchas dels
// dialèctes, jos las estelas) :
//   - comunas (IGN Admin Express 2026, noms occitans d'OSM e de BdTopoc) : a
//     partir de l'escala « 5 km », cargadas per despartament visible ;
//   - provincias de 1789 (Gay, Gobbi, Goñi 2024) : governaments generals en
//     traç espés, provincias en traç fin ;
//   - parcs naturals (PatriNat, Region Piemont) ;
//   - noms del relèu : massís, plans, cimas (sonque d'etiquetas : cap de font
//     dobèrta dona los contorns dels massís nomenats).
// Al survòl (o al tòc), l'encastre d'en bas dona lo nom e sa natura, coma pels
// territòris. Noms occitans de validar per Romain.

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeS = (t) => (1 - Math.cos(Math.PI * t)) / 2;
const CORMORANT = '"Cormorant Garamond", Georgia, serif';

const TEMAS = {
	sorne: {
		linha: '245, 234, 216',
		parc: '134, 196, 140',
		mar: '120, 180, 220',
		ombra: 'rgba(18, 9, 6, 0.9)'
	},
	clar: {
		linha: '46, 29, 20',
		parc: '46, 110, 62',
		mar: '30, 90, 140',
		ombra: 'rgba(245, 234, 216, 0.95)'
	}
};

// Una color per governament general de 1789 (retorn de Romain : que se
// veja que Gavaudan, Vivarés e Lengadòc fan partida del meteis governament) :
// tons sords, que se legisson sul fons sorne coma sul clar
const COLORS_GOV = {
	'g-guyenne': '214, 164, 70',
	'g-languedoc': '205, 96, 78',
	'g-provence': '120, 168, 214',
	'g-dauphine': '160, 140, 214',
	'g-auvergne': '118, 176, 112',
	'g-limousin': '222, 136, 86',
	'g-marche': '196, 178, 96',
	'g-bearn': '86, 178, 166',
	'g-foix': '214, 120, 170',
	'g-poitou': '150, 150, 150',
	'g-saintonge': '176, 152, 112',
	'g-berry': '150, 166, 100',
	'g-bourbonnais': '130, 150, 190',
	'g-lyonnais': '176, 124, 104'
};
const colorGov = (kod) => COLORS_GOV[kod] ?? '190, 170, 140';

// Seuils (zoom Leaflet ; à 44° N, 11 ≈ « 5 km » sur l'échelle)
// comunas a partir de l'escala « 7 km » (causida de Romain) : lo cran de zoom
// 10,5 (zoomSnap 0,25), lo primièr ont l'escala de 110 px passa a 7 km
const Z_COMUNAS = 10.5;
const Z_PROV_MAX = 10.5;
// governaments de luènh, províncias de prèp : lo cambi se fa entre dos crans de
// zoom (6,75 e 7 ; zoomSnap 0,25), que cap cran demòre sens nom
const Z_GOV_PROV = 6.875;

const TÈXTES = {
	oc: {
		comuna: 'comuna',
		provincia: 'província en 1789',
		governament: 'governament general en 1789',
		gov: 'governament',
		provs: 'províncias',
		unica: 'governament e província en 1789',
		fora: 'fòra del reialme en 1789',
		pnr: 'parc natural regional',
		'pn-cor': 'parc nacional, còr',
		'pn-adesion': 'parc nacional, aira d’adesion',
		pnm: 'parc natural marin',
		'parc-it': 'parc natural, Itàlia'
	},
	fr: {
		comuna: 'commune',
		provincia: 'province en 1789',
		governament: 'gouvernement général en 1789',
		gov: 'gouvernement',
		provs: 'provinces',
		unica: 'gouvernement et province en 1789',
		fora: 'hors du royaume en 1789',
		pnr: 'parc naturel régional',
		'pn-cor': 'parc national, cœur',
		'pn-adesion': 'parc national, aire d’adhésion',
		pnm: 'parc naturel marin',
		'parc-it': 'parc naturel, Italie'
	}
};

const cargarJson = (url) =>
	fetch(url)
		.then((r) => (r.ok ? r.json() : null))
		.catch(() => null);
const promesas = {};
const cargar = (url) => (promesas[url] ??= cargarJson(url));

// TopoJSON → [{ props, poligons: [[anel [[lon, lat], …], …], …] }]
function decodarTopo(topo, nom) {
	const t = topo.transform;
	const arcs = topo.arcs.map((arc) => {
		if (!t) return arc;
		let x = 0,
			y = 0;
		return arc.map(([dx, dy]) => [(x += dx) * t.scale[0] + t.translate[0], (y += dy) * t.scale[1] + t.translate[1]]);
	});
	const anel = (idx) => {
		const pts = [];
		for (const i of idx) {
			const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
			for (let k = pts.length ? 1 : 0; k < a.length; k++) pts.push(a[k]);
		}
		return pts;
	};
	const obj = topo.objects[nom] ?? Object.values(topo.objects)[0];
	return obj.geometries.map((g) => ({
		props: g.properties ?? {},
		poligons: g.type === 'Polygon' ? [g.arcs.map(anel)] : g.type === 'MultiPolygon' ? g.arcs.map((p) => p.map(anel)) : []
	}));
}
// Un nom sus mantunas linhas (retorn de Romain : « autorise le passage à la
// ligne pour les noms composés ») : a las virgulas, davant « e » / « et », e
// los noms longs a l'espaci lo pus prèp del mitan
const linhasDe = (nom, max = 13) =>
	nom
		.replace(/, /g, ',\n')
		.replace(/ (e|et) /gi, '\n$1 ')
		.split('\n')
		.flatMap((l) => {
			const sp = [...l.matchAll(/ /g)].map((m) => m.index);
			if (l.length <= max || !sp.length) return [l];
			const i = sp.reduce((a, b) => (Math.abs(b - l.length / 2) < Math.abs(a - l.length / 2) ? b : a));
			return [l.slice(0, i), l.slice(i + 1)];
		});
// Los luòcs ensajats per un nom de zòna, en fraccions del ray del cercle
// inscrit : del mitan cap a l'exterior, pus luènh al long de l'axe (las zònas
// longas coma Lengadòc an de plaça) que de travèrs
const DECALATGES_MITAN = [0, 0.35, -0.35, 0.7, -0.7, 1.05, -1.05, 1.4, -1.4, 1.8, -1.8]
	.flatMap((u) => [0, 0.3, -0.3, 0.55, -0.55].map((v) => [u, v]))
	.sort((p, q) => p[0] ** 2 + 2 * p[1] ** 2 - (q[0] ** 2 + 2 * q[1] ** 2));
// Los governaments que pausan lor nom sus una de lors províncias
const FORMA_ETIQUETA = { 'g-languedoc': 'languedoc' };
const se = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];

const poligonsDe = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);

// ---------- Forma d'una zòna, per i pausar son nom (retorn de Romain : « le
// nom doit être au milieu de la province », inclinat se la zòna es longa,
// e de la talha que i cap) ----------

// distància (signada : positiva dedins) d'un ponch als bòrds d'un poligòn
function distSignada(x, y, anels) {
	let dedins = false,
		min = Infinity;
	for (const a of anels)
		for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
			const [ax, ay] = a[i],
				[bx, by] = a[j];
			if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) dedins = !dedins;
			const dx = bx - ax,
				dy = by - ay,
				l = dx * dx + dy * dy;
			const t = l ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l)) : 0;
			const ex = ax + t * dx - x,
				ey = ay + t * dy - y;
			min = Math.min(min, ex * ex + ey * ey);
		}
	return (dedins ? 1 : -1) * Math.sqrt(min);
}
// lo « pòl d'inaccessibilitat » : lo ponch dedins lo pus luènh dels bòrds
// (d'aprèp l'algoritme polylabel de Mapbox, licéncia ISC)
function pòl(anels, precision = 1) {
	let x0 = Infinity,
		y0 = Infinity,
		x1 = -Infinity,
		y1 = -Infinity;
	for (const [x, y] of anels[0]) {
		if (x < x0) x0 = x;
		if (y < y0) y0 = y;
		if (x > x1) x1 = x;
		if (y > y1) y1 = y;
	}
	const cela = Math.min(x1 - x0, y1 - y0);
	if (!cela) return [x0, y0, 0];
	const fa = (x, y, h) => {
		const d = distSignada(x, y, anels);
		return { x, y, h, d, max: d + h * Math.SQRT2 };
	};
	const coa = [];
	for (let x = x0; x < x1; x += cela) for (let y = y0; y < y1; y += cela) coa.push(fa(x + cela / 2, y + cela / 2, cela / 2));
	let melhor = fa((x0 + x1) / 2, (y0 + y1) / 2, 0);
	while (coa.length) {
		let im = 0;
		for (let i = 1; i < coa.length; i++) if (coa[i].max > coa[im].max) im = i;
		const c = coa.splice(im, 1)[0];
		if (c.d > melhor.d) melhor = c;
		if (c.max - melhor.d <= precision) continue;
		const h = c.h / 2;
		coa.push(fa(c.x - h, c.y - h, h), fa(c.x + h, c.y - h, h), fa(c.x - h, c.y + h, h), fa(c.x + h, c.y + h, h));
	}
	return [melhor.x, melhor.y, melhor.d];
}
// l'axe d'una zòna (moments d'aira) : son angle e son alongament
function axe(a) {
	let A = 0,
		sx = 0,
		sy = 0,
		sxx = 0,
		syy = 0,
		sxy = 0;
	for (let i = 0; i < a.length; i++) {
		const [x0, y0] = a[i],
			[x1, y1] = a[(i + 1) % a.length];
		const c = x0 * y1 - x1 * y0;
		A += c;
		sx += (x0 + x1) * c;
		sy += (y0 + y1) * c;
		sxx += (x0 * x0 + x0 * x1 + x1 * x1) * c;
		syy += (y0 * y0 + y0 * y1 + y1 * y1) * c;
		sxy += (x0 * y1 + 2 * x0 * y0 + 2 * x1 * y1 + x1 * y0) * c;
	}
	A /= 2;
	if (!A) return { ang: 0, along: 1 };
	const cx = sx / (6 * A),
		cy = sy / (6 * A);
	const vxx = sxx / (12 * A) - cx * cx,
		vyy = syy / (12 * A) - cy * cy,
		vxy = sxy / (24 * A) - cx * cy;
	const m = (vxx + vyy) / 2,
		r = Math.sqrt(((vxx - vyy) / 2) ** 2 + vxy * vxy);
	return {
		ang: 0.5 * Math.atan2(2 * vxy, vxx - vyy),
		along: Math.sqrt((m + r) / Math.max(1e-9, m - r))
	};
}
const airaAnel = (a) => a.reduce((s, [x0, y0], i) => s + x0 * a[(i + 1) % a.length][1] - a[(i + 1) % a.length][0] * y0, 0) / 2;
// Calculada un còp (en Mercator al zoom 8, valent per totes los zooms) :
// lo centre (lon, lat), lo ray del cercle inscrit al zoom 8, l'angle del nom
function analisarForma(map, geometry) {
	let melhor = null,
		aMax = 0;
	for (const p of poligonsDe(geometry)) {
		const anels = p.map((a) =>
			a.map(([lon, lat]) => {
				const q = map.project([lat, lon], 8);
				return [q.x, q.y];
			})
		);
		const A = Math.abs(airaAnel(anels[0]));
		if (A > aMax) {
			aMax = A;
			melhor = anels;
		}
	}
	if (!melhor) return null;
	const [x, y, r] = pòl(melhor, 1);
	const { ang, along } = axe(melhor[0]);
	// inclinat sonque se la zòna es netament longa, e jamai mai de 40° (lisible)
	const graus = (ang * 180) / Math.PI;
	const incl = along > 1.6 && Math.abs(graus) <= 40 ? ang : 0;
	const ll = map.unproject([x, y], 8);
	return { ll: [ll.lng, ll.lat], r8: r, ang: incl };
}

export function crearColaTematica(L, { clar = false, lang = 'oc', jaces = {}, cedirProv = null, obstacles = null, onSurvòl = null } = {}) {
	const Cola = L.Layer.extend({
		options: { pane: 'tematica', padding: 0.3 },

		initialize() {
			this._tem = clar ? TEMAS.clar : TEMAS.sorne;
			this._lang = lang;
			this._jaces = { ...jaces };
			this._deps = new Map(); // despartament → comunas decodadas
			this._pus = null; // { mena, kod } jos lo cursor
			this._a = new Map(); // fondut del survòl, per clau
			this._calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		},

		onAdd(map) {
			if (!map.getPane('tematica')) {
				const p = map.createPane('tematica');
				p.style.zIndex = '320';
				p.style.pointerEvents = 'none';
			}
			this._cv = L.DomUtil.create('canvas', 'cola-tematica leaflet-zoom-animated', map.getPane('tematica'));
			this._cx = this._cv.getContext('2d');
			this._cargar();
			this._update();
			Promise.all([document.fonts?.load(`italic 500 14px ${CORMORANT}`), document.fonts?.load('14px Limelight')]).then(
				() => this._pintar(),
				() => {}
			);
		},
		onRemove() {
			cancelAnimationFrame(this._raf);
			for (const f of this._fontsMesas ?? []) this._map?.attributionControl?.removeAttribution(f);
			this._fontsMesas = null;
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

		setJaces(j) {
			this._jaces = { ...j };
			if (this._pus && !this._jaçaDe(this._pus.mena)) this._survòl(null);
			this._cargar();
			this._update();
		},
		setTema(c) {
			this._tem = c ? TEMAS.clar : TEMAS.sorne;
			this._pintar();
		},
		setLenga(l) {
			this._lang = l;
			if (this._pus) onSurvòl?.(this._info(this._pus));
			this._pintar();
		},
		// Quicòm de survolable jos aqueste ponch ? fòrt : parcs e comunas (las
		// autras còlas li cedisson) ; las provincias, que cobrisson tot, cedisson
		// elas als dialèctes
		ocupat(lp, sonqueFòrt = false) {
			const t = this._ciblaA(lp);
			return !!t && (!sonqueFòrt || t.mena !== 'prov');
		},

		_jaçaDe(mena) {
			return !!this._jaces[{ com: 'comunas', parc: 'parcs', prov: 'provincias' }[mena]];
		},
		// Las fonts de las jaces alucadas, dins la linha de las fonts de la carta
		// (cada fichièr de donadas pòrta la siá, camp « font »)
		_fonts() {
			const ctl = this._map?.attributionControl;
			if (!ctl) return;
			const J = this._jaces;
			const voladas = new Set(
				[J.comunas && this._index?.font, J.provincias && this._prov?.font, J.parcs && this._parcs?.font, J.massis && this._releu?.font].filter(Boolean)
			);
			for (const f of this._fontsMesas ?? []) if (!voladas.has(f)) ctl.removeAttribution(f);
			for (const f of voladas) if (!this._fontsMesas?.has(f)) ctl.addAttribution(f);
			this._fontsMesas = voladas;
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

		/* ---------- Cargament : sonque çò que se vei ---------- */
		_cargar() {
			const J = this._jaces;
			if (J.provincias && !this._prov) cargar('/data/provincias-1789.json').then((d) => ((this._prov = d), this._update()));
			if (J.parcs && !this._parcs) cargar('/data/parcs.json').then((d) => ((this._parcs = d), this._update()));
			if (J.massis && !this._releu) cargar('/data/releu-noms.json').then((d) => ((this._releu = d), this._update()));
			if (J.comunas && !this._index) cargar('/data/comunas/index.json').then((d) => ((this._index = d), this._cargarComunas()));
		},
		// Los despartaments visibles, a partir de l'escala de las comunas
		_cargarComunas() {
			const map = this._map;
			if (!map || !this._jaces.comunas || !this._index || map.getZoom() < Z_COMUNAS - 0.5) return;
			const b = map.getBounds().pad(0.2);
			for (const d of this._index.deps) {
				const [w, s, e, n] = d.bbox;
				if (this._deps.has(d.d) || e < b.getWest() || w > b.getEast() || n < b.getSouth() || s > b.getNorth()) continue;
				this._deps.set(d.d, null);
				cargar(`/data/comunas/${d.d}.json`).then((topo) => {
					if (!topo) return;
					this._deps.set(
						d.d,
						decodarTopo(topo, 'comunas').map((c) => ({ ...c, dep: d.d }))
					);
					this._update();
				});
			}
		},

		/* ---------- Projeccion (a cada recalatge) ---------- */
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
			this._cv.width = Math.round(tal.x * dpr);
			this._cv.height = Math.round(tal.y * dpr);
			this._cv.style.width = tal.x + 'px';
			this._cv.style.height = tal.y + 'px';
			const o = map.getPixelOrigin().add(min);
			this._o = o;
			this._nUpd = (this._nUpd ?? 0) + 1;
			const z = this._zoom;
			const pt = ([lon, lat]) => {
				const q = map.project([lat, lon], z);
				return [q.x - o.x, q.y - o.y];
			};
			// un poligòn → camin + bóstia (pel tèst rapid del survòl)
			const zona = (poligons) => {
				const c = new Path2D();
				let x0 = Infinity,
					y0 = Infinity,
					x1 = -Infinity,
					y1 = -Infinity;
				for (const anels of poligons)
					for (const a of anels) {
						for (let i = 0; i < a.length; i++) {
							const [x, y] = pt(a[i]);
							if (i) c.lineTo(x, y);
							else c.moveTo(x, y);
							if (x < x0) x0 = x;
							if (y < y0) y0 = y;
							if (x > x1) x1 = x;
							if (y > y1) y1 = y;
						}
						c.closePath();
					}
				return { c, bbox: [x0, y0, x1, y1] };
			};
			const dins = (bb) => bb[2] > 0 && bb[0] < this._W && bb[3] > 0 && bb[1] < this._H;
			const J = this._jaces;
			const G = (this._geo = { pt });
			if (this._prov && !this._govs) {
				this._govs = new Map(
					this._prov.features.filter((f) => f.properties.nivel === 'governament').map((f) => [f.properties.kod, { props: f.properties, n: 0 }])
				);
				for (const f of this._prov.features)
					if (f.properties.nivel === 'provincia') this._govs.get(f.properties.governament) && this._govs.get(f.properties.governament).n++;
			}
			if (J.provincias && this._prov && z < Z_PROV_MAX + 0.5)
				G.prov = this._prov.features
					.map((f) => ({
						...zona(poligonsDe(f.geometry)),
						props: f.properties,
						eti: f.properties.eti && pt(f.properties.eti)
					}))
					.filter((x) => dins(x.bbox));
			if (J.parcs && this._parcs && z >= 6)
				G.parcs = this._parcs.features
					.map((f) => ({
						...zona(poligonsDe(f.geometry)),
						props: f.properties,
						eti: f.properties.eti && pt(f.properties.eti)
					}))
					.filter((x) => dins(x.bbox));
			if (J.massis && this._releu)
				G.releu = this._releu.features.map((f) => ({
					props: f.properties,
					p: pt(f.geometry.coordinates)
				}));
			this._fonts();
			if (J.comunas && z >= Z_COMUNAS - 0.5) {
				G.com = [];
				for (const lista of this._deps.values())
					for (const c of lista ?? []) {
						const zn = zona(c.poligons);
						if (dins(zn.bbox)) G.com.push({ ...zn, props: c.props, dep: c.dep });
					}
				this._cargarComunas();
			}
			this._pintar();
		},

		/* ---------- Survòl ---------- */
		_ciblaA(lp) {
			const G = this._geo;
			if (!G || !this._min) return null;
			this._cxTest ??= document.createElement('canvas').getContext('2d');
			const x = lp.x - this._min.x,
				y = lp.y - this._min.y,
				z = this._zoom;
			const dins = (zn) => x >= zn.bbox[0] && x <= zn.bbox[2] && y >= zn.bbox[1] && y <= zn.bbox[3] && this._cxTest.isPointInPath(zn.c, x, y, 'evenodd');
			if (G.parcs) {
				// lo còr d'un parc nacional abans son aira d'adesion
				const p = G.parcs.filter(dins).sort((a, b) => (a.props.mena === 'pn-adesion') - (b.props.mena === 'pn-adesion'))[0];
				if (p) return { mena: 'parc', kod: p.props.kod, props: p.props };
			}
			if (G.com && z >= Z_COMUNAS) {
				const c = G.com.find(dins);
				if (c) return { mena: 'com', kod: c.props.i, props: c.props, dep: c.dep };
			}
			if (G.prov && z < Z_PROV_MAX && !cedirProv?.(lp)) {
				// de luènh, los governaments ; de prèp, las provincias
				const nivèl = z < Z_GOV_PROV ? 'governament' : 'provincia';
				const lista = G.prov.filter((p) => p.props.nivel === nivèl || p.props.nivel === 'fora');
				const p = lista.find(dins);
				if (p) return { mena: 'prov', kod: p.props.kod, props: p.props };
			}
			return null;
		},
		_info(t) {
			if (!t) return null;
			const tx = TÈXTES[this._lang] ?? TÈXTES.oc,
				fr = this._lang === 'fr';
			const p = t.props;
			const nom = fr ? p.fr : (p.oc ?? p.fr);
			let sota;
			if (t.mena === 'com') {
				sota = tx.comuna + (t.dep && /^\d|^2[AB]$/.test(t.dep) ? ` (${t.dep})` : '');
				if (fr && p.oc && p.oc !== p.fr) sota += ` · en occitan : ${p.oc}`;
				if (!fr && p.oc && p.oc !== p.fr) sota += ` · ${p.fr}`;
			} else if (t.mena === 'parc') {
				sota = (tx[p.mena] ?? tx.pnr) + (p.annada ? ` · ${p.annada}` : '');
			} else {
				// (la nòta de la font es longa e en francés : l'encastre demòra d'una linha)
				const g = this._govs?.get(p.governament);
				if (p.nivel === 'provincia' && g && g.n > 1) sota = `${tx.provincia} · ${tx.gov} : ${fr ? g.props.fr : (g.props.oc ?? g.props.fr)}`;
				else if (p.nivel === 'governament') {
					const n = this._govs?.get(p.kod)?.n ?? 0;
					sota = n > 1 ? `${tx.governament} · ${n} ${tx.provs}` : tx.unica;
				} else if (p.nivel === 'provincia' && g) sota = tx.unica;
				else sota = tx[p.nivel] ?? tx.provincia;
			}
			return {
				kod: t.mena + ':' + t.kod,
				oc: nom,
				fr: nom,
				sota_oc: sota,
				sota_fr: sota,
				mix: true
			};
		},
		_survòl(t) {
			const clau = t ? t.mena + ':' + t.kod : null;
			if (clau === (this._pus ? this._pus.mena + ':' + this._pus.kod : null)) return;
			this._pus = t;
			onSurvòl?.(this._info(t));
			this._bocla();
		},
		_onMirga(e) {
			if (e.originalEvent?.pointerType === 'touch') return;
			this._survòl(this._ciblaA(e.layerPoint));
		},
		_onSortida() {
			this._survòl(null);
		},
		// al det : un tòc mòstra l'encastre, un tòc endacòm mai l'escafa
		_onClic(e) {
			const tactil = e.originalEvent?.pointerType === 'touch' || !matchMedia('(hover: hover)').matches;
			if (tactil) this._survòl(this._ciblaA(e.layerPoint));
		},
		// lo survòl se fond (≈ 0,3 s) : una bocla sonque pendent lo fondut
		_bocla() {
			cancelAnimationFrame(this._raf);
			let t0 = performance.now();
			const pas = (t) => {
				const dt = Math.min(0.1, (t - t0) / 1000);
				t0 = t;
				const clau = this._pus ? this._pus.mena + ':' + this._pus.kod : null;
				if (clau && !this._a.has(clau)) this._a.set(clau, { t: this._pus, p: 0 });
				let viu = false;
				for (const [k, v] of this._a) {
					const cib = k === clau ? 1 : 0;
					v.p = this._calm ? cib : cib ? Math.min(1, v.p + dt / 0.3) : Math.max(0, v.p - dt / 0.4);
					if (!cib && v.p <= 0) this._a.delete(k);
					else if (v.p !== cib) viu = true;
				}
				this._pintar();
				if (viu) this._raf = requestAnimationFrame(pas);
			};
			this._raf = requestAnimationFrame(pas);
		},

		// Los noms de províncias : plaçats un còp per recalatge (lo survòl
		// redessenha sovent), puèi tornats prene
		_etiquetasProv(G, z, a, nomDe, ocupadas, ob) {
			const c = this._etiCache;
			if (c && c.n === this._nUpd && c.lang === this._lang && c.ob === ob) {
				for (const e of c.lista) ocupadas.push(e.b);
				return c.lista;
			}
			const lista = this._plaçarProv(G, z, a, nomDe, ocupadas);
			this._etiCache = { n: this._nUpd, lang: this._lang, ob, lista };
			return lista;
		},
		// un blòc de tèxt (larg × naut, virat de ang) es tot dins la zòna ?
		_dins(cami, x, y, w, h, ang) {
			const c = Math.cos(ang),
				s = Math.sin(ang);
			for (const fx of [-0.5, -0.25, 0, 0.25, 0.5])
				for (const fy of [-0.5, 0, 0.5]) {
					const dx = fx * w,
						dy = fy * h;
					if (!this._cxTest.isPointInPath(cami, x + dx * c - dy * s, y + dx * s + dy * c, 'evenodd')) return false;
				}
			return true;
		},
		_plaçarProv(G, z, a, nomDe, ocupadas) {
			const cx = this._cx,
				T = this._tem,
				esp = 'letterSpacing' in cx;
			if (!this._formas && this._prov) this._formas = new Map(this._prov.features.map((f) => [f.properties.kod, analisarForma(this._map, f.geometry)]));
			const lista = [],
				pausadas = [];
			const aira = (pv) => (pv.bbox[2] - pv.bbox[0]) * (pv.bbox[3] - pv.bbox[1]);
			cx.save();
			for (const pv of G.prov.slice().sort((x, y) => aira(y) - aira(x))) {
				const gov = pv.props.nivel !== 'provincia';
				// (retorn de Romain : « DAUFINAT » e « Daufinat » se crosavan al
				// meteis luòc ; los dos noms se seguisson ara sens se crosar, al
				// meteis zoom que lo survòl càmbia de nivèl)
				const al = gov ? a * clamp((Z_GOV_PROV - z) / 0.125) : a * clamp((z - Z_GOV_PROV) / 0.125) * clamp((10 - z) / 0.8);
				if (al < 0.01) continue;
				// la forma que pòrta lo nom : la zòna meteissa, levat qualques
				// governaments ont lo nom se pausa melhor sus la província del meteis
				// nom (Lengadòc : al long del litoral, demanda de Romain)
				const f = this._formas?.get(FORMA_ETIQUETA[pv.props.kod] ?? pv.props.kod);
				if (!f) continue;
				const [px0, py0] = G.pt(f.ll);
				const r = f.r8 * Math.pow(2, z - 8);
				const nom = nomDe(pv.props);
				const tèxt = gov ? nom.toUpperCase() : nom;
				const espac = gov ? '0.16em' : '0.08em';
				const g = !gov && this._govs?.get(pv.props.governament);
				const nomGov = g && nomDe(g.props);
				const sotaGov = nomGov && g.n > 1 && nomGov !== nom ? nomGov.toUpperCase() : null;
				let sotaW = 0;
				if (sotaGov) {
					cx.font = '600 8.5px Luciole, sans-serif';
					if (esp) cx.letterSpacing = '0.16em';
					sotaW = cx.measureText(sotaGov).width;
				}
				const variantas = [[tèxt]];
				const l2 = linhasDe(tèxt, gov ? 12 : 14);
				if (l2.length > 1) variantas.push(l2);
				const tMax = gov ? Math.round(clamp(14 + (z - 5.5) * 4, 14, 24)) : 17;
				// de luòcs ensajats a l'entorn del mitan (al long de l'axe e de travèrs) :
				// lo nom pren lo primièr que cap dins la zòna sens èsser acapat per un
				// nom de vila ; a defaut, lo mens acapat
				const ca = Math.cos(f.ang),
					sa = Math.sin(f.ang);
				const luòcs = DECALATGES_MITAN.map(([u, v]) => [px0 + (u * ca - v * sa) * r, py0 + (u * sa + v * ca) * r]);
				let tròp = null,
					melhor = null;
				// lo governament en dejós passa d'en primièr (que se veja que la
				// província n'es una subdivision), tant que lo nom fa 10 px o mai
				cèrca: for (const ambSota of sotaGov ? [true, false] : [false])
					for (let talha = tMax; talha >= (ambSota ? 10 : 8); talha--) {
						cx.font = `${talha}px Limelight, Georgia, serif`;
						if (esp) cx.letterSpacing = espac;
						for (const linhas of variantas) {
							const lh = talha * 1.12;
							const w0 = Math.max(...linhas.map((l) => cx.measureText(l).width));
							const w = Math.max(w0, ambSota ? sotaW : 0),
								h = linhas.length * lh + (ambSota ? 13 : 0);
							const bw = w * Math.abs(ca) + h * Math.abs(sa),
								bh = w * Math.abs(sa) + h * Math.abs(ca);
							for (const [x, y] of luòcs) {
								if (!this._dins(pv.c, x, y, w + 6, h + 4, f.ang)) continue;
								const b = [x - bw / 2, y - bh / 2, x + bw / 2, y + bh / 2];
								if (pausadas.some((o) => se(b, o))) continue;
								const n = ocupadas.reduce((t, o) => t + se(b, o), 0);
								const c = { talha, linhas, lh, w, h, ambSota, x, y, b, n };
								if (!n) {
									tròp = c;
									break cèrca;
								}
								if (!melhor || n < melhor.n) melhor = c;
							}
						}
					}
				tròp ??= melhor;
				// pas de plaça dins la zòna : lo nom espèra un zoom mai prèp (lo
				// survòl lo dona totjorn)
				if (!tròp) continue;
				const { x: px, y: py, b } = tròp;
				pausadas.push(b);
				ocupadas.push(b);
				lista.push({
					x: px,
					y: py,
					ang: f.ang,
					al,
					talha: tròp.talha,
					linhas: tròp.linhas,
					lh: tròp.lh,
					h: tròp.h,
					esp: espac,
					color: gov && pv.props.nivel !== 'fora' ? `rgb(${colorGov(pv.props.kod)})` : `rgb(${T.linha})`,
					sotaGov: tròp.ambSota ? sotaGov : null,
					colorGov: `rgb(${colorGov(pv.props.governament)})`,
					b
				});
			}
			cx.restore();
			return lista;
		},

		/* ---------- Dessenh ---------- */
		_pintar() {
			const cx = this._cx,
				G = this._geo;
			if (!cx || !G) return;
			const T = this._tem,
				z = this._zoom,
				dpr = this._dpr,
				fr = this._lang === 'fr';
			cx.setTransform(dpr, 0, 0, dpr, 0, 0);
			cx.clearRect(0, 0, this._W, this._H);
			const nomDe = (p) => (fr ? p.fr : (p.oc ?? p.fr));
			const survòl = (kod) => easeS(this._a.get(kod)?.p ?? 0);
			// los noms de vilas ja pausats per la còla d'estelas, puèi cada nom
			// pausat aquí : los noms seguents los evitan
			const ocupadas = [];
			const ob = obstacles?.();
			if (ob && this._o) {
				const k = Math.pow(2, z - ob.z);
				for (const b of ob.cs) ocupadas.push([b[0] * k - this._o.x, b[1] * k - this._o.y, b[2] * k - this._o.x, b[3] * k - this._o.y]);
			}
			this._cxTest ??= document.createElement('canvas').getContext('2d');

			/* Parcs : un aplat leugièr e un contorn ponchejat */
			if (G.parcs) {
				const a = clamp((z - 6) / 0.8) * clamp((15 - z) / 1.5);
				for (const pc of G.parcs) {
					const m = pc.props.mena,
						col = m === 'pnm' ? T.mar : T.parc;
					const s = survòl('parc:' + pc.props.kod);
					cx.fillStyle = `rgba(${col}, ${(m === 'pn-adesion' ? 0.06 : m === 'pn-cor' ? 0.2 : 0.12) * a + s * 0.12})`;
					cx.fill(pc.c, 'evenodd');
					cx.strokeStyle = `rgba(${col}, ${(0.55 + s * 0.35) * a})`;
					cx.lineWidth = m === 'pn-cor' ? 1.3 : 0.9;
					cx.setLineDash(m === 'pn-adesion' ? [2, 3] : m === 'pnm' ? [5, 3] : []);
					cx.stroke(pc.c);
				}
				cx.setLineDash([]);
				// noms dels parcs, a escala mejana
				const aNom = clamp((z - 7.6) / 0.6) * clamp((11.5 - z) / 1);
				if (aNom > 0.01) {
					cx.save();
					cx.font = `italic 500 ${clamp(11 + (z - 8) * 1.2, 11, 14).toFixed(1)}px ${CORMORANT}`;
					cx.textAlign = 'center';
					cx.textBaseline = 'middle';
					cx.shadowColor = T.ombra;
					cx.shadowBlur = 5;
					for (const pc of G.parcs) {
						if (!pc.eti || pc.props.mena === 'pn-adesion') continue;
						cx.globalAlpha = aNom * 0.9;
						cx.fillStyle = `rgb(${pc.props.mena === 'pnm' ? T.mar : T.parc})`;
						cx.fillText(nomDe(pc.props), pc.eti[0], pc.eti[1]);
					}
					cx.restore();
				}
			}

			/* Provincias de 1789 : cada governament a sa color, partejada per sas
			   províncias ; sos bòrds en traç plen e espés, los de las províncias
			   en fin ponchejat (retorn de Romain : « rendre plus clair les grandes
			   provinces » e lors subdivisions) */
			if (G.prov) {
				const a = clamp((Z_PROV_MAX - z) / 1);
				const aProv = a * clamp((z - 6.4) / 0.8);
				const pusGov = this._pus?.mena === 'prov' ? (this._pus.props.nivel === 'governament' ? this._pus.kod : this._pus.props.governament) : null;
				cx.save();
				cx.lineJoin = 'round';
				// aplats : un per governament
				for (const pv of G.prov) {
					if (pv.props.nivel !== 'governament') continue;
					const s = survòl('prov:' + pv.props.kod) + (pusGov === pv.props.kod ? 0.4 : 0);
					cx.fillStyle = `rgba(${colorGov(pv.props.kod)}, ${(0.1 + 0.06 * s) * a})`;
					cx.fill(pv.c, 'evenodd');
				}
				// províncias : fin ponchejat crèma, la survolada s'esclaira
				for (const pv of G.prov) {
					if (pv.props.nivel !== 'provincia' || aProv < 0.01) continue;
					const s = survòl('prov:' + pv.props.kod);
					if (s > 0) {
						cx.fillStyle = `rgba(${T.linha}, ${0.09 * s * aProv})`;
						cx.fill(pv.c, 'evenodd');
					}
					cx.strokeStyle = `rgba(${T.linha}, ${0.3 * aProv + s * 0.4})`;
					cx.lineWidth = 0.8 + s * 0.4;
					cx.setLineDash([4, 3]);
					cx.stroke(pv.c);
				}
				// governaments (e territòris de defòra) : traç plen, de lor color
				for (const pv of G.prov) {
					if (pv.props.nivel === 'provincia') continue;
					const fora = pv.props.nivel === 'fora';
					const s = survòl('prov:' + pv.props.kod) + (pusGov === pv.props.kod ? 0.5 : 0);
					cx.strokeStyle = fora ? `rgba(${T.linha}, ${0.45 * a})` : `rgba(${colorGov(pv.props.kod)}, ${clamp(0.75 + s * 0.25) * a})`;
					cx.lineWidth = fora ? 1 : 2.2 + s * 0.6;
					cx.setLineDash(fora ? [2, 3] : []);
					cx.stroke(pv.c);
				}
				cx.setLineDash([]);
				// noms : de luènh los governaments, de prèp las províncias amb, en
				// dejós, lor governament en pichonas capitalas (s'a un autre nom).
				// Cada nom al mitan de sa zòna, inclinat se la zòna es longa, de la
				// talha mai granda que i cap (retorn de Romain)
				cx.textAlign = 'center';
				cx.textBaseline = 'middle';
				cx.shadowColor = T.ombra;
				cx.shadowBlur = 6;
				const esp = 'letterSpacing' in cx;
				for (const e of this._etiquetasProv(G, z, a, nomDe, ocupadas, ob)) {
					cx.save();
					cx.translate(e.x, e.y);
					if (e.ang) cx.rotate(e.ang);
					cx.globalAlpha = e.al * 0.9;
					cx.fillStyle = e.color;
					cx.font = `${e.talha}px Limelight, Georgia, serif`;
					if (esp) cx.letterSpacing = e.esp;
					const y0 = -e.h / 2 + e.lh / 2;
					e.linhas.forEach((l, i) => cx.fillText(l, 0, y0 + i * e.lh));
					if (e.sotaGov) {
						cx.globalAlpha = e.al * 0.75;
						cx.fillStyle = e.colorGov;
						cx.font = '600 8.5px Luciole, sans-serif';
						if (esp) cx.letterSpacing = '0.16em';
						cx.fillText(e.sotaGov, 0, y0 + e.linhas.length * e.lh - e.lh / 2 + 7);
					}
					cx.restore();
				}
				cx.restore();
			}

			/* Comunas : un fil fin, a partir de « 5 km » ; la survolada s'esclaira */
			if (G.com) {
				const a = clamp((z - (Z_COMUNAS - 0.2)) / 0.2) * clamp((16 - z) / 1.5);
				if (a > 0.01) {
					cx.save();
					cx.lineJoin = 'round';
					cx.strokeStyle = `rgba(${T.linha}, ${0.5 * a})`;
					cx.lineWidth = 0.7;
					cx.setLineDash([3, 2]);
					for (const c of G.com) cx.stroke(c.c);
					cx.setLineDash([]);
					for (const [k, v] of this._a) {
						if (!k.startsWith('com:')) continue;
						const c = G.com.find((x) => 'com:' + x.props.i === k);
						if (!c) continue;
						const s = easeS(v.p);
						cx.fillStyle = `rgba(${T.linha}, ${0.1 * s * a})`;
						cx.fill(c.c, 'evenodd');
						cx.strokeStyle = `rgba(${T.linha}, ${0.75 * s * a})`;
						cx.lineWidth = 1.3;
						cx.stroke(c.c);
					}
					cx.restore();
				}
			}

			/* Noms del relèu : massís en capitalas espaçadas, cimas amb un
			   triangle e lor nautor ; cada nom a son escala, sens se trucar */
			if (G.releu) {
				const fenèstras = {
					massis: { 1: [5.5, 9], 2: [7, 10.5], 3: [8.5, 12] },
					cadena: { 1: [5.5, 9], 2: [7, 10.5], 3: [8.5, 12] },
					plan: { 1: [6.5, 10], 2: [7.5, 11], 3: [9, 12.5] },
					som: { 1: [7.5, 15], 2: [9, 15], 3: [10.5, 15] }
				};
				const pausats = ocupadas;
				const lista = G.releu.slice().sort((x, y) => x.props.renc - y.props.renc);
				cx.save();
				cx.shadowColor = T.ombra;
				cx.shadowBlur = 5;
				const esp = 'letterSpacing' in cx;
				for (const r of lista) {
					const [z0, z1] = fenèstras[r.props.mena]?.[r.props.renc] ?? [9, 13];
					const al = clamp((z - z0) / 0.6) * clamp((z1 - z) / 0.6);
					if (al < 0.01) continue;
					const [x, y] = r.p;
					if (x < -100 || y < -40 || x > this._W + 100 || y > this._H + 40) continue;
					const som = r.props.mena === 'som';
					const nom = nomDe(r.props);
					cx.font = som ? `500 10.5px Luciole, sans-serif` : `italic 500 ${{ 1: 15, 2: 13, 3: 11.5 }[r.props.renc] ?? 12}px ${CORMORANT}`;
					if (esp) cx.letterSpacing = som ? '0px' : r.props.renc === 1 ? '0.32em' : '0.2em';
					const tèxt = som ? nom : nom.toUpperCase();
					const w = cx.measureText(tèxt).width + (som ? 12 : 0),
						h = som ? 13 : 16;
					const bx = som ? [x - 5, y - h / 2, x + w, y + h / 2] : [x - w / 2, y - h / 2, x + w / 2, y + h / 2];
					if (pausats.some((b) => b[0] < bx[2] && b[2] > bx[0] && b[1] < bx[3] && b[3] > bx[1])) continue;
					pausats.push(bx);
					cx.globalAlpha = al * (som ? 0.85 : 0.6);
					cx.fillStyle = `rgb(${T.linha})`;
					if (som) {
						cx.beginPath();
						cx.moveTo(x, y - 4);
						cx.lineTo(x + 4, y + 3);
						cx.lineTo(x - 4, y + 3);
						cx.closePath();
						cx.fill();
						cx.textAlign = 'left';
						cx.textBaseline = 'middle';
						cx.fillText(tèxt, x + 7, y);
						if (r.props.alt && z >= 10) {
							cx.globalAlpha = al * 0.6;
							cx.font = `400 9.5px Luciole, sans-serif`;
							cx.fillText(`${r.props.alt} m`, x + 7, y + 11);
						}
					} else {
						cx.save();
						cx.translate(x, y);
						if (r.props.ang) cx.rotate((r.props.ang * Math.PI) / 180);
						cx.textAlign = 'center';
						cx.textBaseline = 'middle';
						cx.fillText(tèxt, 0, 0);
						cx.restore();
					}
				}
				if (esp) cx.letterSpacing = '0px';
				cx.restore();
			}
		}
	});
	return new Cola();
}
