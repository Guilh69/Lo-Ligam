// Noms locals de las comunas francesas fòra del domeni occitan (retorn de
// Romain, 2026-10-11 : « tu as pas des noms en plus pour les différents
// fonds ? ») : los libellats Wikidata (CC0) dins la lenga del luòc, quand
// difèrisson del nom oficial (un libellat identic es sovent una còpia del
// francés : pas gardat, coma sus la carta occitana).
//   basc (eu) : Pirenèus Atlantics ; catalan (ca) : Pirenèus Orientals ;
//   arpitan (frp) : Ain, Isèra, Léger, Ròse, Savòia, Nauta Savòia ;
//   picard (pcd) : Aisne, Nòrd, Oise, Pas de Calais, Soma ;
//   normand (nrf) : Calvados, Èure, Mancha, Òrne, Sena Maritima.
// Lo breton, lo còrs, l'alsacian, lo francic, lo flamenc e lo valon an ja lors
// listas (SIG/<lenga>/noms-locals.csv). Sortida : SIG/cadena-entradas
// noms-wikidata.csv (codi;nom_oficial;nom_local;lenga;font).
//
//   node SIG/cadena/noms-wikidata.mjs
import fs from 'node:fs';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const SORTIDA = path.join(AQUI, '..', 'brut', 'cadena-entradas', 'noms-wikidata.csv');
const UA = 'LoLigam-carta/0.1 (preparation de donnees pour une carte des langues de France)';
const LENGAS = {
	eu: ['64'],
	ca: ['66'],
	frp: ['01', '38', '42', '69', '73', '74'],
	pcd: ['02', '59', '60', '62', '80'],
	nrf: ['14', '27', '50', '61', '76']
};

async function sparql(q) {
	for (let i = 0; i < 4; i++) {
		const r = await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q), { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' } });
		if (r.ok) return (await r.json()).results.bindings;
		await new Promise((s) => setTimeout(s, 3000 * (i + 1)));
	}
	throw new Error('SPARQL');
}

const linhas = ['codi;nom_oficial;nom_local;lenga;font'];
for (const [lg, deps] of Object.entries(LENGAS)) {
	const filtre = deps.map((d) => `STRSTARTS(?insee, "${d}")`).join(' || ');
	const q = `SELECT ?c ?insee ?fr ?l WHERE {
  ?c wdt:P374 ?insee ; rdfs:label ?l ; rdfs:label ?fr .
  FILTER(${filtre})
  FILTER(LANG(?l) = "${lg}") FILTER(LANG(?fr) = "fr")
  FILTER NOT EXISTS { ?c wdt:P576 ?fin }
}`;
	const rs = await sparql(q);
	const vist = new Set();
	let n = 0;
	for (const b of rs) {
		const insee = b.insee.value,
			fr = b.fr.value,
			l = b.l.value.trim();
		if (vist.has(insee) || !l || l.toLowerCase() === fr.toLowerCase()) continue;
		vist.add(insee);
		linhas.push([insee, fr, l, lg, 'Wikidata ' + b.c.value.split('/').pop() + ', libellé ' + lg].map((x) => x.replace(/;/g, ',')).join(';'));
		n++;
	}
	console.log(lg, rs.length, 'libellats,', n, 'diferents del francés');
	await new Promise((s) => setTimeout(s, 1500));
}
fs.writeFileSync(SORTIDA, '﻿' + linhas.join('\n') + '\n');
console.log('escrich', SORTIDA, linhas.length - 1, 'noms');
