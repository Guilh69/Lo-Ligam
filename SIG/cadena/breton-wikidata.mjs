// Breton, étape 2 : interrogations de Wikidata (données CC0) et de la Wikipédia
// en français (texte CC BY-SA, utilisé ici comme liste de faits cités).
//
//   node SIG/cadena/breton-wikidata.mjs
//
// A. Noms bretons des communes : titre de l'article de la Wikipédia bretonne
//    (lien de site de l'élément Wikidata qui porte le code INSEE, P374) et
//    étiquette bretonne de l'élément (contrôle).
//    Sortie : SIG/brut/breton/wd-br.csv (insee;item;titol_br;etiqueta_br;natura)
// B. Paroisses des anciens évêchés : listes des articles de la Wikipédia en
//    français (archidiaconés de Léon, Kemenet-Ily, Ac'h, Tréguier, Cornouaille,
//    Poher ; doyennés de Dol enclavés : Lanmeur, Lannion, Lanvollon ; Minihy de
//    Tréguier), copiées dans SIG/brut/breton/wpfr/*.wiki. Chaque lien est
//    résolu en élément Wikidata, puis en code INSEE (P374), avec « remplacé
//    par » (P1366) et « situé dans » (P131) pour les communes disparues.
//    Sortie : SIG/brut/breton/parroquias.json
import fs from 'fs';
import { fileURLToPath } from 'url';

const BRUT = fileURLToPath(new URL('../brut/breton/', import.meta.url));
const UA = 'LoLigamCarta/0.1 (carte des langues, recherche non commerciale)';
const pausa = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function sparql(q) {
	for (let i = 0; i < 4; i++) {
		const r = await fetch('https://query.wikidata.org/sparql', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/sparql-results+json', 'User-Agent': UA },
			body: 'query=' + encodeURIComponent(q)
		});
		if (r.ok) return (await r.json()).results.bindings;
		console.log('  erreur', r.status, (await r.text()).slice(0, 200));
		await pausa(5000);
	}
	throw new Error('wikidata');
}
const v = (x, k) => (x[k] ? x[k].value.replace('http://www.wikidata.org/entity/', '') : '');

// ---------- A. noms bretons ----------
const com = JSON.parse(fs.readFileSync(BRUT + 'comunas-bzh.json', 'utf8'));
const codis = Object.keys(com).sort();
const linhas = new Map();
for (let i = 0; i < codis.length; i += 150) {
	const b = await sparql(`SELECT ?item ?codi ?br ?lbr ?lfr ?nat WHERE {
  VALUES ?codi { ${codis.slice(i, i + 150).map((c) => JSON.stringify(c)).join(' ')} }
  ?item wdt:P374 ?codi .
  OPTIONAL { ?item wdt:P31 ?nat }
  OPTIONAL { ?a schema:about ?item; schema:isPartOf <https://br.wikipedia.org/>; schema:name ?br . }
  OPTIONAL { ?item rdfs:label ?lbr FILTER(LANG(?lbr) = "br") }
  OPTIONAL { ?item rdfs:label ?lfr FILTER(LANG(?lfr) = "fr") }
}`);
	for (const x of b) {
		const c = v(x, 'codi');
		const l = linhas.get(c) || [];
		l.push({ item: v(x, 'item'), br: v(x, 'br'), lbr: v(x, 'lbr'), lfr: v(x, 'lfr'), nat: v(x, 'nat') });
		linhas.set(c, l);
	}
	await pausa(1000);
}
// plusieurs éléments pour un même code (commune nouvelle / commune déléguée) :
// on garde l'élément dont l'étiquette française est le nom officiel IGN, sinon
// l'élément « commune de France » (Q484170) qui n'est pas « commune déléguée »
// (Q21869758), sinon le premier
const sortA = ['insee;item;titol_br;etiqueta_br;natura'];
for (const c of codis) {
	const l = linhas.get(c) || [];
	const items = [...new Set(l.map((x) => x.item))];
	const norm = (t) => (t || '').normalize('NFD').replace(/\p{M}/gu, '').replace(/[’']/g, "'").toLowerCase();
	const nat = (it, q) => l.some((x) => x.item === it && x.nat === q);
	let tria = items.find((it) => l.some((x) => x.item === it && norm(x.lfr) === norm(com[c].nom)))
		|| items.find((it) => nat(it, 'Q484170') && !nat(it, 'Q21869758'))
		|| items.find((it) => nat(it, 'Q484170')) || items[0] || '';
	const x = l.find((y) => y.item === tria && y.br) || l.find((y) => y.item === tria) || {};
	const nats = [...new Set(l.filter((y) => y.item === tria).map((y) => y.nat))].join(',');
	sortA.push([c, tria, x.br || '', x.lbr || '', nats].join(';'));
}
fs.writeFileSync(BRUT + 'wd-br.csv', sortA.join('\n') + '\n');
console.log('A. wd-br.csv :', sortA.length - 1, 'communes ;', sortA.filter((l) => l.split(';')[2]).length - 1, 'titres bretons');

// ---------- B. paroisses des évêchés ----------
const LISTAS = {
	leon: ["Léon_(archidiaconé)", 'Kemenet-Ily', "Ac_h_(archidiaconé)"],
	treguier: ["Tréguier_(archidiaconé)", 'Minihy_de_Tréguier'],
	cornouaille: ["Cornouaille_(archidiaconé)", "Poher_(archidiaconé)"],
	dol: ['Doyenné_de_Lanmeur', 'Doyenné_de_Lannion', "Lanvollon_(doyenné)"]
};
const entradas = [];
for (const [avesc, fics] of Object.entries(LISTAS)) {
	for (const f of fics) {
		const t = fs.readFileSync(BRUT + 'wpfr/' + f + '.wiki', 'utf8').replace(/<ref[^>]*\/>/g, '').replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '');
		for (const linha of t.split('\n').filter((l) => l.startsWith('*'))) {
			const ligams = [...linha.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)];
			for (const m of ligams) {
				const cibla = m[1].trim();
				if (/^(trève|paroisse|minihy|évêché|diocèse|archidiaconé)/i.test(cibla)) continue;
				entradas.push({ avesc, lista: f, cibla, etiqueta: (m[2] || m[1]).trim(), linha: linha.slice(0, 200) });
			}
			// noms sans lien (à rapprocher à la main)
			const nus = linha.replace(/\[\[[^\]]+\]\]/g, '#').replace(/^\*\s*/, '');
			const restes = nus.split(/,| et | ses | sa | son |;|\(|\)|:/).map((s) => s.replace(/(trèves?|chapelles?|la ville de|avec|paroisses?|\d+|#|')/g, ' ').trim()).filter((s) => /^[A-ZÉÎ]/.test(s) && s.length > 2);
			for (const n of restes) entradas.push({ avesc, lista: f, cibla: '', etiqueta: n, linha: linha.slice(0, 200) });
		}
	}
}
console.log('B. entrées :', entradas.length);

// titres -> éléments Wikidata (redirections suivies)
const titols = [...new Set(entradas.filter((e) => e.cibla).map((e) => e.cibla.replace(/_/g, ' ')))];
const qid = new Map();
for (let i = 0; i < titols.length; i += 50) {
	const u = 'https://fr.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageprops&ppprop=wikibase_item&titles=' + encodeURIComponent(titols.slice(i, i + 50).join('|'));
	const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
	const norm = new Map();
	for (const n of j.query.normalized || []) norm.set(n.from, n.to);
	const redir = new Map();
	for (const r of j.query.redirects || []) redir.set(r.from, r.to);
	const perTitol = new Map();
	for (const p of Object.values(j.query.pages)) perTitol.set(p.title, p.pageprops ? p.pageprops.wikibase_item : '');
	for (const t of titols.slice(i, i + 50)) {
		let x = norm.get(t) || t;
		x = redir.get(x) || x;
		qid.set(t, perTitol.get(x) || '');
	}
	await pausa(500);
}
const qids = [...new Set([...qid.values()].filter(Boolean))];
const info = new Map();
for (let i = 0; i < qids.length; i += 150) {
	const b = await sparql(`SELECT ?item ?lfr ?codi ?nat ?rempl ?codiRempl ?dins ?codiDins WHERE {
  VALUES ?item { ${qids.slice(i, i + 150).map((q) => 'wd:' + q).join(' ')} }
  OPTIONAL { ?item rdfs:label ?lfr FILTER(LANG(?lfr) = "fr") }
  OPTIONAL { ?item wdt:P374 ?codi }
  OPTIONAL { ?item wdt:P31 ?nat }
  OPTIONAL { ?item wdt:P1366 ?rempl . OPTIONAL { ?rempl wdt:P374 ?codiRempl } }
  OPTIONAL { ?item wdt:P131 ?dins . OPTIONAL { ?dins wdt:P374 ?codiDins } }
}`);
	for (const x of b) {
		const q = v(x, 'item');
		const o = info.get(q) || { lfr: v(x, 'lfr'), codi: new Set(), nat: new Set(), rempl: new Set(), dins: new Set() };
		if (v(x, 'codi')) o.codi.add(v(x, 'codi'));
		if (v(x, 'nat')) o.nat.add(v(x, 'nat'));
		if (v(x, 'codiRempl')) o.rempl.add(v(x, 'codiRempl'));
		if (v(x, 'codiDins')) o.dins.add(v(x, 'codiDins'));
		info.set(q, o);
	}
	await pausa(1000);
}
for (const e of entradas) {
	if (!e.cibla) continue;
	e.qid = qid.get(e.cibla.replace(/_/g, ' ')) || '';
	const o = info.get(e.qid);
	if (o) {
		e.lfr = o.lfr;
		e.codi = [...o.codi];
		e.nat = [...o.nat];
		e.rempl = [...o.rempl];
		e.dins = [...o.dins];
	}
}
fs.writeFileSync(BRUT + 'parroquias.json', JSON.stringify(entradas, null, 1));
console.log('B. parroquias.json :', entradas.filter((e) => e.codi && e.codi.length).length, 'entrées avec code INSEE ;', entradas.filter((e) => !e.cibla).length, 'noms sans lien');
