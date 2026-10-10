// Lo contorn de França (SIG/cadena/franca-contorn.py), per lo mòde « Lengas de
// França » (Romain, 2026-10-10) : una lenga alucada mòstra d'en primièr sa part
// francesa ; « Veire la lenga dins son environament lingüistic » mòstra la
// rèsta. Cargat sonque quand cal (34 Ko).
let aneis = null,
	estrangier = [],
	promesa = null;

export const cargarFranca = () =>
	(promesa ??= fetch('/data/franca.json')
		.then((r) => (r.ok ? r.json() : []))
		.then((d) => {
			aneis = d.aneis ?? d;
			estrangier = d.estrangier ?? [];
		})
		.catch(() => (aneis = [])));

// las lengas que desbòrdan de França (calculat per franca-contorn.py : mai de
// 1 % de lor domeni en defòra ; lo breton, tot en França, n'es pas)
export const lengasEstrangièr = () => estrangier;

export const francaCargada = () => !!aneis?.length;

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
	for (const a of aneis) {
		for (let i = 0; i < a.length; i++) {
			const p = map.project([a[i][1], a[i][0]], z);
			if (i) cx.lineTo(p.x - o.x, p.y - o.y);
			else cx.moveTo(p.x - o.x, p.y - o.y);
		}
		cx.closePath();
	}
	cx.clip();
}
