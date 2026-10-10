// Noms de las comunas de Belgica, dels Païses Basses e del Westhoek francés
// dins la lenga del luòc, d'aprèp Wikidata (donadas CC0) : etiquetas
// oficialas (nl, fr, de) e títols dels articles de las Wikipèdias regionalas
// (vls flamenc occidental, zea zelandés, li limborgés, nds-nl bas-saxon
// neerlandés, fy frison, wa valon, pcd picard, lb luxemborgés), que son lo
// nom local.
//
//   node SIG/cadena/flamenc-wikidata.mjs
//
// Sortidas (SIG/brut/flamenc/, fòra Git) : wd-be.csv, wd-nl.csv, wd-fr.csv
import fs from 'fs';
import { fileURLToPath } from 'url';

const BRUT = fileURLToPath(new URL('../brut/flamenc/', import.meta.url));
const WIKIS = ['vls', 'zea', 'li', 'nds-nl', 'fy', 'wa', 'pcd', 'lb', 'nl', 'fr', 'de'];

async function sparql(q) {
	for (let i = 0; i < 4; i++) {
		const r = await fetch('https://query.wikidata.org/sparql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/sparql-results+json',
				'User-Agent': 'LoLigamCarta/0.1 (carta de las lengas, recèrca non comerciala)'
			},
			body: 'query=' + encodeURIComponent(q)
		});
		if (r.ok) return (await r.json()).results.bindings;
		console.log('  error', r.status, (await r.text()).slice(0, 200));
		await new Promise((ok) => setTimeout(ok, 5000));
	}
	throw new Error('wikidata');
}

function consulta(prop, codis) {
	const ligams = WIKIS.map(
		(w) =>
			`OPTIONAL { ?a_${w.replace('-', '_')} schema:about ?item; schema:isPartOf <https://${w}.wikipedia.org/>; schema:name ?${w.replace('-', '_')} . }`
	).join('\n');
	return `SELECT ?item ?codi ?lnl ?lfr ?lde ?pop ${WIKIS.map((w) => '?' + w.replace('-', '_')).join(' ')} WHERE {
  VALUES ?codi { ${codis.map((c) => JSON.stringify(c)).join(' ')} }
  ?item wdt:${prop} ?codi .
  OPTIONAL { ?item rdfs:label ?lnl FILTER(LANG(?lnl) = "nl") }
  OPTIONAL { ?item rdfs:label ?lfr FILTER(LANG(?lfr) = "fr") }
  OPTIONAL { ?item rdfs:label ?lde FILTER(LANG(?lde) = "de") }
  OPTIONAL { ?item wdt:P1082 ?pop }
  ${ligams}
}`;
}

async function far(nom, prop, codis) {
	const linhas = new Map();
	for (let i = 0; i < codis.length; i += 150) {
		const b = await sparql(consulta(prop, codis.slice(i, i + 150)));
		for (const x of b) {
			const c = x.codi.value;
			const v = (k) => (x[k] ? x[k].value : '');
			const prev = linhas.get(c);
			const l = {
				codi: c,
				item: v('item').replace('http://www.wikidata.org/entity/', ''),
				nl: v('lnl'),
				fr: v('lfr'),
				de: v('lde'),
				pop: v('pop')
			};
			for (const w of WIKIS) l['wp_' + w] = v(w.replace('-', '_'));
			// mantun element per un còdi (comuna vièlha e novèla) : gardar los dos
			if (prev && prev.item !== l.item) {
				linhas.set(c + '#' + l.item, l);
			} else if (!prev || Number(l.pop) > Number(prev.pop)) linhas.set(c, l);
		}
		console.log(nom, Math.min(i + 150, codis.length), '/', codis.length);
	}
	const cols = ['codi', 'item', 'nl', 'fr', 'de', 'pop', ...WIKIS.map((w) => 'wp_' + w)];
	const out = [cols.join(';'), ...[...linhas.values()].map((l) => cols.map((k) => String(l[k]).replace(/;/g, ',')).join(';'))];
	fs.writeFileSync(BRUT + 'wd-' + nom + '.csv', '﻿' + out.join('\n'));
	console.log('  ', linhas.size, 'linhas');
}

const be = JSON.parse(fs.readFileSync(BRUT + 'be-comunas-2025-brut.geojson')).features.map((f) => f.properties.nationalCode);
const nl = JSON.parse(fs.readFileSync(BRUT + 'cbs-gemeenten-2025-rd.json'))
	.features.filter((f) => f.properties.water === 'NEE')
	.map((f) => f.properties.gemeentecode.slice(2)); // P382 : còdi CBS sens « GM »
const fr = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8').trim().split(/\r?\n/) : [];
await far('be', 'P1567', be);
await far('nl', 'P382', nl);
if (fr.length) await far('fr', 'P374', fr);
