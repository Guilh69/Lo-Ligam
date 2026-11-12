// Los noms de las comunas, sens lors contorns : un pichon indèx per cercar
// una comuna (demanda de Romain, 2026-10-08 : « taper le nom de la commune »
// per trobar la Calandreta mai pròcha). Tot demòra dins la pagina : cap de
// servici de defòra.
//
//   node SIG/cadena/comunas-noms.mjs
//
// Entrada : app/static/data/comunas/<dep>.json (TopoJSON fabricat per comunas.mjs).
// Sortida : app/static/data/comunas/noms.json
//   { font, c: [[nom francés, nom occitan (0 se es lo meteis, null se cap es pas conegut), lon, lat, populacion, dep], …] }
// (null : la carta aficha pas lo nom en occitan, « quand tu ne sais pas, tu effaces », Romain 2026-10-10 ;
// la comuna demòra trobabla per la recèrca amb son nom francés ; audit del 2026-11-12)
// (coordenadas a 3 decimalas : environ 100 m, pro per una distància)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../app/static/data/comunas');
const index = JSON.parse(fs.readFileSync(path.join(DIR, 'index.json'), 'utf8'));
const r3 = (x) => Math.round(x * 1000) / 1000;
const c = [];
for (const { d } of index.deps) {
	const topo = JSON.parse(fs.readFileSync(path.join(DIR, d + '.json'), 'utf8'));
	for (const g of Object.values(topo.objects)[0].geometries) {
		const q = g.properties;
		if (!q?.p) continue;
		const fr = q.fr || q.oc;
		c.push([fr, q.oc ? (q.oc !== fr ? q.oc : 0) : null, r3(q.p[0]), r3(q.p[1]), q.pop ?? 0, d]);
	}
}
const sortida = path.join(DIR, 'noms.json');
fs.writeFileSync(sortida, JSON.stringify({ font: index.font, c }));
console.log(`${c.length} comunas, ${(fs.statSync(sortida).size / 1024).toFixed(0)} Ko`);
