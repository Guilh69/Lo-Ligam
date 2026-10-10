// Lo contorn de França (SIG/cadena/franca-contorn.py), per lo mòde « Lengas de
// França » (Romain, 2026-10-10) : una lenga alucada mòstra d'en primièr sa part
// francesa ; « Veire la lenga dins son environament lingüistic » mòstra la
// rèsta. Cargat sonque quand cal (34 Ko).
let aneis = null,
	estrangier = [],
	dialectes = {},
	promesa = null;

export const cargarFranca = () =>
	(promesa ??= fetch('/data/franca.json')
		.then((r) => (r.ok ? r.json() : []))
		.then((d) => {
			aneis = d.aneis ?? d;
			estrangier = d.estrangier ?? [];
			dialectes = d.dialectes ?? {};
		})
		.catch(() => (aneis = [])));

// las lengas que desbòrdan de França (calculat per franca-contorn.py : mai de
// 1 % de lor domeni en defòra ; lo breton, tot en França, n'es pas)
export const lengasEstrangièr = () => estrangier;

export const francaCargada = () => !!aneis?.length;

// cada dialècte : 'fr' (en França), 'frontiera' (de cada band), 'defora'
// ({ lenga: { kod: classa } }, calculat per franca-contorn.py)
export const dialèctesFranca = () => dialectes;

// un ponch es en França ? (raia e parelh ; tant que lo contorn es pas cargat : òc)
export function dinsFranca(lat, lon) {
	if (!aneis?.length) return true;
	let dins = false;
	for (const a of aneis)
		for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
			const [xi, yi] = a[i],
				[xj, yj] = a[j];
			if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) dins = !dins;
		}
	return dins;
}

// retalha lo canavàs d'una jaça segon lo contorn (o : origina del canavàs en
// coordenadas projectadas, z : son zoom) ; de metre entre cx.save() e cx.restore()
export function retalharFranca(cx, map, z, o) {
	if (!aneis?.length) return;
	cx.beginPath();
	camiFranca(cx, map, z, o);
	cx.clip();
}
// lo contorn de França apondut al camin en cors (sens lo barrar ni retalhar)
export function camiFranca(cx, map, z, o) {
	for (const a of aneis ?? []) {
		for (let i = 0; i < a.length; i++) {
			const p = map.project([a[i][1], a[i][0]], z);
			if (i) cx.lineTo(p.x - o.x, p.y - o.y);
			else cx.moveTo(p.x - o.x, p.y - o.y);
		}
		cx.closePath();
	}
}

// Lo dessenh d'una jaça de lenga (colaLenga, colaDonadas) : quand torna a sa
// part francesa, la part d'a l'estrangièr s'esvanís (0,6 s) en luòc de
// desaparéisser d'un còp (Romain, 2026-10-10 : « la disparition doit être
// aussi soignée que l'apparition »). Lo còs del dessenh es pintat sens
// retalh dins un canavàs de trabalh, puèi recopiat : en plen dins França, e
// defòra en s'esvanissent.
const DURADA_FR = 600;
export function pintarAmbFranca(capa) {
	const cv = capa._cv,
		cx = capa._cx,
		f = capa._fondutFr,
		t = f ? (performance.now() - f) / DURADA_FR : 1;
	if (!(f && t < 1 && cv && capa._map && capa._min && aneis?.length)) {
		capa._fondutFr = null;
		capa._retalhat = false;
		capa._pintarCòs();
		if (capa._retalhat) capa._cx.restore();
		return;
	}
	const off = (capa._offFr ??= document.createElement('canvas'));
	if (off.width !== cv.width || off.height !== cv.height) (off.width = cv.width), (off.height = cv.height);
	const fr = capa._franca;
	capa._franca = false;
	capa._cv = off;
	capa._cx = off.getContext('2d');
	try {
		capa._pintarCòs();
	} finally {
		capa._franca = fr;
		capa._cv = cv;
		capa._cx = cx;
	}
	const o = capa._map.getPixelOrigin().add(capa._min),
		z = capa._zoom,
		d = capa._dpr || 1,
		a = 1 - t * t * (3 - 2 * t);
	cx.setTransform(1, 0, 0, 1, 0, 0);
	cx.clearRect(0, 0, cv.width, cv.height);
	for (const [defòra, alfa] of [[false, 1], [true, a]]) {
		cx.save();
		cx.setTransform(d, 0, 0, d, 0, 0);
		cx.beginPath();
		if (defòra) cx.rect(-1e5, -1e5, 2e5, 2e5);
		camiFranca(cx, capa._map, z, o);
		cx.clip(defòra ? 'evenodd' : 'nonzero');
		cx.setTransform(1, 0, 0, 1, 0, 0);
		cx.globalAlpha = alfa;
		cx.drawImage(off, 0, 0);
		cx.restore();
	}
	requestAnimationFrame(() => capa._map && capa._pintar());
}
