// Lo catalan per la carta : apond al fichièr de la carta (app/static/data/catalan.json,
// fabricat per catalan.py) sas vilas e son trach de còsta (demanda de Romain,
// 2026-10-08 : las vilas grandas del catalan, e la còsta de València, de las
// Balears e de l'Alguer sus la carta en estelas, que s'arrèsta a Tarragona).
//
//   node SIG/cadena/catalan-app.mjs
//
// Las vilas : SIG/catalan/vilas-catalan.json ([lon, lat, nom catalan, renc,
// dialècte, dialecte2 se n'i a un]) ; lo dialècte es lo de la carta (ponch
// dins polígon, vejatz çai jos).
// La còsta : los anèls del domeni, levats los tròces que seguisson una
// frontièra terrèstra (domeni.linhas, a mens de 400 m), al sud de 41,45° N
// (al nòrd, la carta a ja sa còsta) e sus las illas.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FIC = path.join(RAIC, 'app/static/data/catalan.json');
const d = JSON.parse(fs.readFileSync(FIC, 'utf8'));
const vilas = JSON.parse(fs.readFileSync(path.join(RAIC, 'SIG/catalan/vilas-catalan.json'), 'utf8'));

const r4 = (x) => Math.round(x * 1e4) / 1e4;

// distància aproximativa (m) d'un ponch a un segment, en lon/lat
const KY = 110570;
const dSeg = ([x, y], [x1, y1], [x2, y2]) => {
	const KX = 111320 * Math.cos((y * Math.PI) / 180);
	const ax = (x - x1) * KX,
		ay = (y - y1) * KY,
		bx = (x2 - x1) * KX,
		by = (y2 - y1) * KY;
	const t = bx || by ? Math.max(0, Math.min(1, (ax * bx + ay * by) / (bx * bx + by * by))) : 0;
	return Math.hypot(ax - t * bx, ay - t * by);
};

// Lo dialècte de cada vila es recalculat sus la carta (Romain, 2026-10-08) :
// la zòna de dialècte que la conten (ponch dins polígon, règla « evenodd ») ;
// una vila defòra (sus la còsta, en ribas de la simplificacion) pren la zòna
// pus pròcha a mens de 2 km ; sinon, demòra amb lo dialècte de
// vilas-catalan.json (e es signalada). Lo dialecte2 (parlars de transicion)
// es gardat, en 6a posicion ; se la carta dona just lo dialecte2, los dos
// s'escambian.
const zonas = d.features
	.filter((f) => !f.properties.apart && !f.properties.transicio)
	.map((f) => ({ kod: f.properties.kod, pols: f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates }));
const dinsAnel = ([x, y], a) => {
	let c = false;
	for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
		const [xi, yi] = a[i],
			[xj, yj] = a[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
	}
	return c;
};
const dinsZona = (p, z) => z.pols.some((pol) => pol.reduce((c, a) => c !== dinsAnel(p, a), false));
const distZona = (p, z) => {
	let m = Infinity;
	for (const pol of z.pols) for (const a of pol) for (let i = 1; i < a.length; i++) m = Math.min(m, dSeg(p, a[i - 1], a[i]));
	return m;
};
const cambis = [],
	pròchas = [],
	defòra = [];
d.vilas = vilas
	.filter((v) => v.lon != null && v.lat != null)
	.sort((a, b) => a.renc - b.renc || (b.pop ?? 0) - (a.pop ?? 0))
	.map((v) => {
		const p = [v.lon, v.lat];
		let dia = zonas.find((z) => dinsZona(p, z))?.kod;
		if (!dia) {
			let dm = 2000;
			for (const z of zonas) {
				const dd = distZona(p, z);
				if (dd < dm) (dm = dd), (dia = z.kod);
			}
			if (dia) pròchas.push(`${v.nom_ca} (${dia}, ${Math.round(dm)} m)`);
			else defòra.push(`${v.nom_ca} (${v.dialecte})`), (dia = v.dialecte);
		}
		let dia2 = v.dialecte2 ?? null;
		if (dia !== v.dialecte) {
			if (dia2 === dia) dia2 = v.dialecte;
			cambis.push(`${v.nom_ca} : ${v.dialecte} -> ${dia}${dia2 ? ` (dialecte2 : ${dia2})` : ''}`);
		}
		const r = [r4(v.lon), r4(v.lat), v.nom_ca, v.renc, dia];
		if (dia2) r.push(dia2);
		return r;
	});
const segs = [];
for (const l of d.domeni?.linhas || []) for (let i = 1; i < l.length; i++) segs.push([l[i - 1], l[i]]);
const terrèstre = (q) => segs.some(([a, b]) => dSeg(q, a, b) < 400);
const costa = [];
for (const anel of d.domeni?.anels || []) {
	let cur = [];
	const fin = () => {
		if (cur.length > 1) costa.push(cur);
		cur = [];
	};
	for (const q of anel) {
		if (q[1] < 41.45 && !terrèstre(q)) cur.push([r4(q[0]), r4(q[1])]);
		else fin();
	}
	fin();
}
d.costa = costa;
fs.writeFileSync(FIC, JSON.stringify(d));
const n = costa.reduce((s, l) => s + l.length, 0);
console.log(`vilas : ${d.vilas.length} ; còsta : ${costa.length} tròces, ${n} ponches ; fichièr : ${(fs.statSync(FIC).size / 1024).toFixed(1)} Ko`);
console.log(`dialècte cambiat per la carta : ${cambis.length}`);
for (const c of cambis) console.log('  ' + c);
console.log(`defòra de tota zòna, presa la pus pròcha (< 2 km) : ${pròchas.length}${pròchas.length ? ' : ' + pròchas.join(', ') : ''}`);
console.log(`defòra, a mai de 2 km (dialècte de vilas-catalan.json gardat) : ${defòra.length}${defòra.length ? ' : ' + defòra.join(', ') : ''}`);
