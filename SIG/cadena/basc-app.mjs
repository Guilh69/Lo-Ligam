// Lo basc per la carta : apond al fichièr de la carta (app/static/data/basc.json,
// fabricat per basc.py) sas vilas (Romain, 2026-10-09, sul
// modèl de l'arpitan e del catalan).
//
//   node SIG/cadena/basc-app.mjs
//
// Las vilas : SIG/basc/vilas-basc.json (basc-vilas.mjs) -> [lon, lat, nom basc,
// renc, dialècte] ; lo dialècte es lo de la carta (ponch dins polígon) ; una
// vila defòra (bòrd de la simplificacion) pren la zòna pus pròcha a mens de
// 2 km ; las autras (Tutera, Miranda d'Ebre…) son pas gardadas e son listadas.
// La còsta : pas aicí (costa.json).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FIC = path.join(RAIC, 'app/static/data/basc.json');
const d = JSON.parse(fs.readFileSync(FIC, 'utf8'));
const vilas = JSON.parse(fs.readFileSync(path.join(RAIC, 'SIG/basc/vilas-basc.json'), 'utf8'));

const r4 = (x) => Math.round(x * 1e4) / 1e4;
const KY = 110570;
const dSeg = ([x, y], [x1, y1], [x2, y2]) => {
	const KX = 111320 * Math.cos((y * Math.PI) / 180);
	const ax = (x - x1) * KX, ay = (y - y1) * KY, bx = (x2 - x1) * KX, by = (y2 - y1) * KY;
	const t = bx || by ? Math.max(0, Math.min(1, (ax * bx + ay * by) / (bx * bx + by * by))) : 0;
	return Math.hypot(ax - t * bx, ay - t * by);
};
const zonas = d.features
	.filter((f) => !f.properties.apart && !f.properties.transicio)
	.map((f) => ({ kod: f.properties.kod, pols: f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates }));
const dinsAnel = ([x, y], a) => {
	let c = false;
	for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
		const [xi, yi] = a[i], [xj, yj] = a[j];
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
const pròchas = [], defòra = [], per = {};
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
			if (dia) pròchas.push(`${v.nom_eu} (${dia}, ${Math.round(dm)} m)`);
			else return defòra.push(`${v.nom_eu} / ${v.nom_oficial}`), null;
		}
		per[dia] = (per[dia] || 0) + 1;
		return [r4(v.lon), r4(v.lat), v.nom_eu, v.renc, dia];
	})
	.filter(Boolean);
// (pas de còsta pròpria : la còsta del País Basc d'Espanha es dins costa.json,
// calada sus lo contorn precís d'OSM, costa-estelas.py e mar.py PRECIS ; doas
// còstas se dobdavan : retorn de Romain, 2026-10-09, « pb de côte »)
delete d.costa;

fs.writeFileSync(FIC, JSON.stringify(d));

console.log(`vilas : ${d.vilas.length} ; per dialècte : ${JSON.stringify(per)} ; fichièr : ${(fs.statSync(FIC).size / 1024).toFixed(1)} Ko`);
console.log(`defòra de tota zòna, presa la pus pròcha (< 2 km) : ${pròchas.length}${pròchas.length ? ' : ' + pròchas.join(', ') : ''}`);
console.log(`defòra del domeni (pas gardadas) : ${defòra.length}${defòra.length ? ' : ' + defòra.join(', ') : ''}`);
