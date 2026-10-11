// Los noms savoiards de las comunas de Savòia e de Nauta Savòia (retorn de
// Romain, 2026-10-11 : Mouxy, « cherche sa toponyme savoyarde ») : la Wikipèdia
// francesa los dona dins la seccion « Toponymie » de cada comuna (« En
// francoprovençal, le nom de la commune s'écrit Meûssi, selon la graphie de
// Conflans », d'aprèp lo Lexique Français : Francoprovençal du nom des communes
// de Savoie, 2009). Sortida : SIG/arpitan/noms-locals.csv
// (codi;nom_oficial;nom_local;grafia;font), de validar per Romain.
//
//   node SIG/cadena/arpitan-conflans.mjs
import fs from 'node:fs';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const SORTIDA = path.join(AQUI, '..', 'arpitan', 'noms-locals.csv');
const UA = 'LoLigam-carta/0.1 (preparation de donnees pour une carte des langues de France)';
const pausa = (ms) => new Promise((s) => setTimeout(s, ms));

const q = `SELECT ?insee ?fr ?t WHERE {
  ?c wdt:P374 ?insee ; rdfs:label ?fr .
  FILTER(STRSTARTS(?insee, "73") || STRSTARTS(?insee, "74")) FILTER(LANG(?fr) = "fr")
  ?a schema:about ?c ; schema:isPartOf <https://fr.wikipedia.org/> ; schema:name ?t .
  FILTER NOT EXISTS { ?c wdt:P576 ?fin }
}`;
const r = await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q), { headers: { 'User-Agent': UA } });
const comunas = new Map();
for (const b of (await r.json()).results.bindings) if (!comunas.has(b.t.value)) comunas.set(b.t.value, { insee: b.insee.value, fr: b.fr.value });
console.log(comunas.size, 'comunas amb un article');

// « En francoprovençal, le nom de la commune s'écrit ''Meûssi'', selon la graphie de Conflans »
const RE = /francoprovençal[^.]{0,120}?(?:s'écrit|se dit|se prononce|est)\s*(?:\{\{[^}]*\|)?''+([^'{}|\n]{2,60}?)''+[^.]{0,80}?(graphie de Conflans|ORB|graphie[^.,;)]{0,40})?/i;
const linhas = ['codi;nom_oficial;nom_local;grafia;font'];
const títols = [...comunas.keys()];
for (let i = 0; i < títols.length; i += 50) {
	const lot = títols.slice(i, i + 50);
	const u = 'https://fr.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=main&format=json&formatversion=2&maxlag=5&titles=' + encodeURIComponent(lot.join('|'));
	let j = null;
	for (let k = 0; k < 4 && !j; k++) {
		const rr = await fetch(u, { headers: { 'User-Agent': UA } });
		if (rr.ok) j = await rr.json();
		else await pausa(2000 * (k + 1));
	}
	for (const p of j?.query?.pages ?? []) {
		const c = comunas.get(p.title);
		const txt = p.revisions?.[0]?.slots?.main?.content ?? '';
		const m = txt.match(RE);
		if (!c || !m) continue;
		const nom = m[1].replace(/\[\[|\]\]/g, '').trim();
		if (!nom || nom.toLowerCase() === c.fr.toLowerCase()) continue;
		// (la grafia es dicha dins la frasa, après lo nom)
		const fin = txt.slice(m.index, m.index + m[0].length + 160);
		const grafia = /conflans/i.test(fin) ? 'Conflans' : /ORB/.test(fin) ? 'ORB' : '';
		linhas.push([c.insee, c.fr, nom, grafia, `Wikipédia fr, article « ${p.title} », §Toponymie`].map((x) => String(x).replace(/;/g, ',')).join(';'));
	}
	process.stdout.write(`${Math.min(i + 50, títols.length)}/${títols.length} `);
	await pausa(400);
}
fs.writeFileSync(SORTIDA, '﻿' + linhas.join('\n') + '\n');
console.log('\nescrich', SORTIDA, linhas.length - 1, 'noms');
