// Alsacian e francic : noms de las comunas dins la lenga del luòc, d'aprèp
// Wikidata (donadas CC0) : títols dels articles de las Wikipèdias alemanica
// (als), luxemborguesa (lb), palatina (pfl) e ripuària (ksh), etiquetas
// Wikidata en gsw e lb, e « nom dins la lenga d'origina » (P1705).
// Clau : còdi INSEE (P374), AGS (P439), numèro OFS (P771), còdi NIS (P1567),
// e per Luxemborg l'element Wikidata (etiqueta wikidata d'OSM).
//
//   node SIG/cadena/alsacian-noms.mjs
// Sortida : SIG/brut/alsacian/wd-noms.json ({codi: {als, lb, pfl, ksh, gsw, lb_label, p1705: [[nom, lenga]]}})
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const BRUT = path.resolve(CADENA, '../brut/alsacian');
const UA = 'LoLigam-carta/1.0 (preparacion de donadas)';

const cos = (prop, filtre) => `SELECT ?c ?item ?als ?lb ?pfl ?ksh ?gsw ?lbl ?n1705 ?l1705 WHERE {
  ?item wdt:${prop} ?c . ${filtre}
  OPTIONAL { ?a schema:about ?item ; schema:isPartOf <https://als.wikipedia.org/> ; schema:name ?als }
  OPTIONAL { ?b schema:about ?item ; schema:isPartOf <https://lb.wikipedia.org/> ; schema:name ?lb }
  OPTIONAL { ?d schema:about ?item ; schema:isPartOf <https://pfl.wikipedia.org/> ; schema:name ?pfl }
  OPTIONAL { ?e schema:about ?item ; schema:isPartOf <https://ksh.wikipedia.org/> ; schema:name ?ksh }
  OPTIONAL { ?item rdfs:label ?gsw FILTER(LANG(?gsw) = "gsw") }
  OPTIONAL { ?item rdfs:label ?lbl FILTER(LANG(?lbl) = "lb") }
  OPTIONAL { ?item wdt:P1705 ?n1705 . BIND(LANG(?n1705) AS ?l1705) }
}`;
const REQ = [
	['fr', 'P374', 'FILTER(STRSTARTS(?c, "57") || STRSTARTS(?c, "67") || STRSTARTS(?c, "68"))', (c) => c],
	['de', 'P439', 'FILTER(STRSTARTS(?c, "07") || STRSTARTS(?c, "08") || STRSTARTS(?c, "10"))', (c) => 'de:' + c],
	['ch', 'P771', '', (c) => 'ch:' + c],
	['be', 'P1567', 'FILTER(STRSTARTS(?c, "6") || STRSTARTS(?c, "7") || STRSTARTS(?c, "8"))', (c) => 'be:' + c],
];
const out = {};
for (const [pais, prop, filtre, codi] of REQ) {
	const u = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(cos(prop, filtre));
	let j = null;
	for (let k = 0; k < 4 && !j; k++) {
		const r = await fetch(u, { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' } });
		if (r.ok) j = await r.json(); else { console.log(`${pais} : ${r.status}, tòrna ensajar`); await new Promise((s) => setTimeout(s, 10000)); }
	}
	if (!j) { console.log(`${pais} : FRACAS`); continue; }
	let n = 0;
	for (const b of j.results.bindings) {
		const k = codi(b.c.value);
		const o = (out[k] ??= { item: b.item.value.replace(/.*\//, '') });
		for (const c of ['als', 'lb', 'pfl', 'ksh', 'gsw']) if (b[c]) o[c] = b[c].value;
		if (b.lbl) o.lb_label = b.lbl.value;
		if (b.n1705) { o.p1705 ??= []; if (!o.p1705.some(([x, l]) => x === b.n1705.value && l === b.l1705?.value)) o.p1705.push([b.n1705.value, b.l1705?.value || '']); }
		n++;
	}
	const ks = Object.keys(out).filter((k) => (pais === 'fr' ? /^\d/.test(k) : k.startsWith(pais + ':')));
	console.log(`${pais} : ${n} rengadas, ${ks.length} comunas ; als ${ks.filter((k) => out[k].als).length}, lb ${ks.filter((k) => out[k].lb).length}, pfl ${ks.filter((k) => out[k].pfl).length}, ksh ${ks.filter((k) => out[k].ksh).length}, gsw ${ks.filter((k) => out[k].gsw).length}, lb_label ${ks.filter((k) => out[k].lb_label).length}, P1705 ${ks.filter((k) => out[k].p1705).length}`);
	await new Promise((s) => setTimeout(s, 3000));
}
fs.writeFileSync(path.join(BRUT, 'wd-noms.json'), JSON.stringify(out));
