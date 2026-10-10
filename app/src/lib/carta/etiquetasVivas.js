// Los noms pintats dins las còlas canvas (vilas, rius, dialèctes, relèu…)
// gardan lor talha pendent lo zoom e glissan cap a lor plaça nòva.
//
// Leaflet espandís los canavasses en CSS pendent l'animacion de zoom, puèi
// los torna pintar : las letras grossissián (×1,7 sus un cran), puèi
// sautavan a lor talha e a lor plaça nòvas (retorn de Romain, 2026-10-10 :
// « les villages me suivent et se recalent après »). Los tèxtes son ara
// enregistrats al moment de la pintura (fillText, strokeText) e tornats
// pintar a cada imatge :
//   - pendent lo zoom, cada nom seguís son ponch, mas sas letras se desfan
//     de l'espandiment ;
//   - a la fin, un nom que demòra glissa de son ancian ponch al nòu, un nom
//     que se'n va s'escantís, un nom nòu arriba en fondut.

const ESTAT = [
	'font',
	'fillStyle',
	'strokeStyle',
	'lineWidth',
	'lineJoin',
	'miterLimit',
	'textAlign',
	'textBaseline',
	'direction',
	'globalCompositeOperation',
	'shadowColor',
	'shadowBlur',
	'shadowOffsetX',
	'shadowOffsetY',
	'letterSpacing',
	'wordSpacing',
	'fontKerning'
];
const DURADA = 340; // ms
// un nom que demòra es cercat a mens d'aquesta distància (px CSS)
const RAI = 70;
const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const doç = (t) => t * t * (3 - 2 * t);
// Al dezoom, los noms gardan lor talha mas la carta s'estrecha : los pichons
// s'escantisson (los que demòran a l'arribada i tornan en fondut), los
// grands demòran
// (lo pes d'un nom : sa talha per son opacitat ; las vilatges en italica, pus
// pallas, s'escantisson abans las capitalas e los dialèctes)
const atenuat = (e, s) => (s >= 1 || e.fs * e.alfa >= 11.5 ? 1 : Math.max(0, Math.min(1, (s - 0.55) / 0.4)));

// Un contèxt que sap enregistrar sos tèxtes al luòc de los pintar
function enregistrable(cx) {
	if ('_rec' in cx) return;
	cx._rec = null;
	for (const [m, nom] of [
		[0, 'fillText'],
		[1, 'strokeText']
	]) {
		const orig = cx[nom];
		cx[nom] = function (t, x, y, mw) {
			if (!this._rec) return mw === undefined ? orig.call(this, t, x, y) : orig.call(this, t, x, y, mw);
			const M = this.getTransform();
			// (lo ponch d'ancoratge del tèxt, en pixèls de la tela)
			const e = { m, t: String(t), mw, a: M.a, b: M.b, c: M.c, d: M.d, px: M.a * x + M.c * y + M.e, py: M.b * x + M.d * y + M.f, alfa: this.globalAlpha, fs: +(/([\d.]+)px/.exec(this.font)?.[1] ?? 12) };
			for (const k of ESTAT) e[k] = this[k];
			this._rec.push(e);
		};
	}
}

// g : l'escala de las letras (1/s quand lo canavàs es espandit de s)
function pintarUn(cx, e, px, py, g, alfa) {
	if (alfa < 0.004) return;
	for (const k of ESTAT) {
		const v = e[k];
		if (v !== undefined && cx[k] !== v) cx[k] = v;
	}
	cx.globalAlpha = Math.min(1, alfa);
	if (g !== 1) {
		cx.shadowBlur = e.shadowBlur * g;
		cx.shadowOffsetX = e.shadowOffsetX * g;
		cx.shadowOffsetY = e.shadowOffsetY * g;
	}
	cx.setTransform(e.a * g, e.b * g, e.c * g, e.d * g, px, py);
	const f = e.m ? cx.strokeText : cx.fillText;
	if (e.mw === undefined) f.call(cx, e.t, 0, 0);
	else f.call(cx, e.t, 0, 0, e.mw);
}

export class EtiquetasVivas {
	constructor() {
		this.lista = [];
		this.geo = null;
		this.vièlha = null;
		this._parelhas = null;
	}
	// La geometria del canavàs (origen projectat en px CSS, zoom, dpr) : se
	// càmbia, los noms d'abans demòran lo temps de la transicion
	geometria(o, z, dpr) {
		const a = this.geo,
			n = { ox: o.x, oy: o.y, z, dpr };
		this.geo = n;
		if (!a || (a.z === z && a.ox === n.ox && a.oy === n.oy && a.dpr === dpr)) return;
		this.vièlha = this.lista.length && !calm() ? { lista: this.lista, geo: a, t0: performance.now(), s: this._sD ?? 1 } : null;
		this._sD = 1;
		this.lista = [];
		this._parelhas = null;
	}
	començar(cx) {
		enregistrable(cx);
		this._cx = cx;
		this._nòva = [];
		cx._rec = this._nòva;
	}
	acabar() {
		if (!this._cx) return;
		this._cx._rec = null;
		this._cx = null;
		this.lista = this._nòva;
		this._parelhas = null;
	}
	enCors() {
		if (this.vièlha && performance.now() - this.vièlha.t0 >= DURADA) this.vièlha = null;
		return !!this.vièlha;
	}
	voida() {
		return !this.lista.length && !this.enCors();
	}
	// Pintar los noms dins cx : s es l'escala CSS del canavàs (zoom en cors),
	// kA un alfa d'ensems ; final : sonque los noms d'ara, sens transicion
	pintar(cx, s = 1, kA = 1, final = false) {
		cx.save();
		if (final || Math.abs(s - 1) > 1e-3 || !this.enCors()) {
			const g = Math.abs(s - 1) > 1e-3 ? 1 / s : 1;
			if (!final) this._sD = s;
			for (const e of this.lista) pintarUn(cx, e, e.px, e.py, g, e.alfa * kA * (final ? 1 : atenuat(e, s)));
		} else {
			const q = doç(Math.min(1, (performance.now() - this.vièlha.t0) / DURADA));
			const P = (this._parelhas ??= this._aparelhar()),
				sV = this.vièlha.s;
			for (const [e, X, Y] of P.sols) pintarUn(cx, e, X, Y, 1, e.alfa * atenuat(e, sV) * kA * (1 - q));
			for (const [e, X, Y, eV] of P.nòus)
				if (eV) {
					const aV = eV.alfa * atenuat(eV, sV);
					pintarUn(cx, e, X + (e.px - X) * q, Y + (e.py - Y) * q, 1, (aV + (e.alfa - aV) * q) * kA);
				}
				else pintarUn(cx, e, e.px, e.py, 1, e.alfa * kA * q);
		}
		cx.restore();
	}
	// Cada nom nòu cèrca lo meteis tèxt pròche dins los noms d'abans
	// (rapòrtats a la geometria nòva)
	_aparelhar() {
		const v = this.vièlha,
			a = v.geo,
			n = this.geo,
			k = Math.pow(2, n.z - a.z);
		const vièlhs = v.lista.map((e) => ({
			e,
			X: ((e.px / a.dpr + a.ox) * k - n.ox) * n.dpr,
			Y: ((e.py / a.dpr + a.oy) * k - n.oy) * n.dpr,
			pres: false
		}));
		const perTèxt = new Map();
		for (const o of vièlhs) {
			const c = o.e.m + o.e.t;
			if (!perTèxt.has(c)) perTèxt.set(c, []);
			perTèxt.get(c).push(o);
		}
		const R2 = (RAI * n.dpr) ** 2;
		const nòus = this.lista.map((e) => {
			let m = null,
				dm = R2;
			for (const o of perTèxt.get(e.m + e.t) ?? []) {
				if (o.pres) continue;
				const d = (o.X - e.px) ** 2 + (o.Y - e.py) ** 2;
				if (d < dm) (dm = d), (m = o);
			}
			if (!m) return [e, 0, 0, null];
			m.pres = true;
			return [e, m.X, m.Y, m.e];
		});
		return { nòus, sols: vièlhs.filter((o) => !o.pres).map((o) => [o.e, o.X, o.Y]) };
	}
}

// Una tela de noms dessús lo canavàs d'una còla (meteis pan, meteissa
// plaça) : la còla i enregistra sos noms a cada pintura (començar/acabar),
// la tela los tòrna pintar pendent lo zoom e las transicions.
// retalh(cx) : un retalh opcional (la part francesa sola)
export function telaNoms(L, cvPrincipal, map, retalh = null) {
	const cv = L.DomUtil.create('canvas', 'noms-cola leaflet-zoom-animated');
	cv.style.pointerEvents = 'none';
	cvPrincipal.after(cv);
	const cx = cv.getContext('2d');
	const E = new EtiquetasVivas();
	let raf = 0,
		talha = [1, 1];
	const escala = () => {
		const m = getComputedStyle(cv).transform;
		return !m || m === 'none' ? 1 : new DOMMatrixReadOnly(m).a;
	};
	function pintar() {
		const s = escala();
		// (sobrietat : sens res a pintar, la tela se redutz a un pixèl)
		const [w, h] = E.voida() ? [1, 1] : talha;
		if (cv.width !== w || cv.height !== h) (cv.width = w), (cv.height = h);
		else {
			cx.setTransform(1, 0, 0, 1, 0, 0);
			cx.clearRect(0, 0, w, h);
		}
		if (w > 1) {
			cx.save();
			retalh?.(cx);
			E.pintar(cx, s);
			cx.restore();
		}
		return s;
	}
	function bocla() {
		raf = 0;
		const s = pintar();
		if (map._animatingZoom || Math.abs(s - 1) > 1e-3 || E.enCors()) raf = requestAnimationFrame(bocla);
	}
	const lançar = () => (raf ||= requestAnimationFrame(bocla));
	return {
		ajustar(cvP, min, o, z, dpr) {
			talha = [cvP.width, cvP.height];
			cv.style.width = cvP.style.width;
			cv.style.height = cvP.style.height;
			L.DomUtil.setPosition(cv, min);
			E.geometria(o, z, dpr);
		},
		transformar(offset, scale) {
			L.DomUtil.setTransform(cv, offset, scale);
			lançar();
		},
		començar(cxP) {
			E.començar(cxP);
		},
		acabar() {
			E.acabar();
			if (raf) return;
			pintar();
			if (E.enCors()) lançar();
		},
		levar() {
			cancelAnimationFrame(raf);
			L.DomUtil.remove(cv);
		}
	};
}
