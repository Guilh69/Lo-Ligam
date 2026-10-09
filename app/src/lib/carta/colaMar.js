// La mar del satellit (retorn de Romain, 2026-10-09 : « une couche en dehors
// des limites terrestres, qui fait un fondu jusqu'à la côte, et qui ne touche
// pas du tout l'intérieur des terres »).
//
// Al larg, a partir del zoom 13, l'IGN a pas mai de fòto (tuèlas blancas,
// puèi res). Aquesta còla pausa sus las fòtos una mar d'un blau unit, lo de
// l'IGN al zoom 12, transparenta a la còsta e plena a 500 m : l'IGN a de fòto
// fins a 850 m del ribatge al mens (mesurat de Gruissan a Biarritz). La mar
// ven de SIG/cadena/mar.py : la zòna levada de las tèrras (comunas de l'IGN,
// païses vesins alargats de 2 km) e de las aigas dins las tèrras (Berre,
// Arcaishon, la Gironda), copada en cases de 0,25°. Los bòrds de las cases
// son pas de còsta : i a pas de fondut.

const FONDUT = 500; // m
// l'IGN es blanc a partir del zoom 13, que Leaflet pren tre 12,5 (arredondit) ;
// al zoom 12, sa mar es ja d'aqueste blau
const Z0 = 12,
	Z1 = 12.5;
const clamp = (v) => Math.min(1, Math.max(0, v));
// las zònas de mar.py (ZONAS) : o, s, e, n ; en defòra, res a cargar
const ZONAS = [
	[2.75, 41.75, 7.75, 44.0],
	[-2.25, 43.25, -0.75, 45.75]
];

let promesa = null;
function cargar() {
	return (promesa ??= fetch('/data/mar.json')
		.then((r) => (r.ok ? r.json() : null))
		.then(decodar)
		.catch(() => null));
}
// los anèls en entièrs (1e-5 grau), en diferéncias ; e la bóstia de cada tròç
function decodar(d) {
	if (!d) return null;
	const polis = d.p.map((p) => {
		let o = Infinity,
			s = Infinity,
			e = -Infinity,
			n = -Infinity;
		const anèls = p.map((r) => {
			const a = new Int32Array(r.length);
			let x = 0,
				y = 0;
			for (let k = 0; k < r.length; k += 2) {
				a[k] = x += r[k];
				a[k + 1] = y += r[k + 1];
				if (x < o) o = x;
				if (x > e) e = x;
				if (y < s) s = y;
				if (y > n) n = y;
			}
			return a;
		});
		return { anèls, o: o / d.q, s: s / d.q, e: e / d.q, n: n / d.q };
	});
	return { q: d.q, casa: d.casa, color: `rgb(${d.color.join(',')})`, polis };
}

export function crearColaMar(L) {
	const Cola = L.Canvas.extend({
		options: { pane: 'satellit', padding: 0.2 },
		onAdd(map) {
			L.Canvas.prototype.onAdd.call(this, map);
			// (dessús las tuèlas del meteis plan, qu'an un z-index de 1)
			this._container.style.zIndex = 5;
			this._container.style.opacity = this._op ?? 1;
		},
		// Leaflet escafa lo canavàs puèi i dessenha sos camins (_redraw :
		// _clear, _draw), a cada desplaçament e tanben aprèp un « viewreset »
		// sens « update » : la mar se dessenha a aquel moment
		_draw() {
			this._pintar();
		},
		// segueix l'opacitat del satellit (lo relais de la carta en estelas)
		setOpacity(o) {
			this._op = o;
			if (this._container) this._container.style.opacity = o;
			return this;
		},
		_pintar() {
			const map = this._map;
			if (!map) return;
			const z = map.getZoom(),
				a = clamp((z - Z0) / (Z1 - Z0));
			const b = this._bounds,
				nw = map.layerPointToLatLng(b.min),
				se = map.layerPointToLatLng(b.max);
			const d = this._d;
			if (!d) {
				// (cargada sonque quand cal : de prèp, un pauc abans d'aparéisser,
				// e se la vista tòca una zòna de còsta)
				const zona = ZONAS.some(([o, s, e, n]) => o < se.lng && e > nw.lng && s < nw.lat && n > se.lat);
				if (zona && z >= Z0 - 0.5) cargar().then((v) => v && this._map && ((this._d = v), this._update()));
				return;
			}
			if (a <= 0) return;
			// metres per ponch, al mitan de la vista : lo fondut en ponches
			const lat = (nw.lat + se.lat) / 2;
			const D = FONDUT / ((40075016.686 * Math.cos((lat * Math.PI) / 180)) / (256 * 2 ** z));
			const m = 0.01; // grau
			const vis = d.polis.filter((p) => p.o < se.lng + m && p.e > nw.lng - m && p.s < nw.lat + m && p.n > se.lat - m);
			if (!vis.length) return;
			const { q, casa } = d;
			// los trachs de còsta pròches de la vista sonque (lo fondut los tòca)
			const x0 = b.min.x - D,
				y0 = b.min.y - D,
				x1 = b.max.x + D,
				y1 = b.max.y + D;
			const mar = new Path2D(),
				còsta = new Path2D();
			for (const p of vis)
				for (const r of p.anèls) {
					let px = 0,
						py = 0,
						lèva = true;
					for (let k = 0; k < r.length; k += 2) {
						const P = map.latLngToLayerPoint([r[k + 1] / q, r[k] / q]);
						if (k === 0) mar.moveTo(P.x, P.y);
						else {
							mar.lineTo(P.x, P.y);
							// un bòrd de casa es pas de còsta
							const xa = r[k - 2],
								ya = r[k - 1],
								xb = r[k],
								yb = r[k + 1];
							const casaB = (xa === xb && xa % casa === 0) || (ya === yb && ya % casa === 0);
							const prèp = Math.max(px, P.x) > x0 && Math.min(px, P.x) < x1 && Math.max(py, P.y) > y0 && Math.min(py, P.y) < y1;
							if (casaB || !prèp) lèva = true;
							else {
								if (lèva) còsta.moveTo(px, py);
								còsta.lineTo(P.x, P.y);
								lèva = false;
							}
						}
						px = P.x;
						py = P.y;
					}
					mar.closePath();
				}
			const ctx = this._ctx;
			ctx.save();
			ctx.globalAlpha = a;
			ctx.fillStyle = d.color;
			ctx.fill(mar, 'evenodd');
			// Lo fondut : de traits de còsta de mai en mai estrechs, que cadun
			// escafa una part de çò que demòra. A la distància t·D de la còsta,
			// demòra f(t), una corba doça (sens bòrd vesible a D) : transparent
			// sus la còsta, plen a D.
			ctx.globalCompositeOperation = 'destination-out';
			ctx.lineJoin = ctx.lineCap = 'round';
			const N = Math.max(2, Math.min(12, Math.round(D / 6)));
			const f = (t) => t * t * (3 - 2 * t);
			for (let k = N; k >= 1; k--) {
				ctx.globalAlpha = 1 - f((k - 1) / N) / f(k / N);
				ctx.lineWidth = (2 * D * k) / N;
				ctx.stroke(còsta);
			}
			ctx.restore();
		}
	});
	return new Cola();
}
