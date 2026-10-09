// Noms occitans e entradas de recèrca de las valadas d'Itàlia dins territoris.js
import fs from 'fs';
import { fileURLToPath } from 'url';
// entradas de la cadena (fòra Git) : SIG/brut/cadena-entradas
const S = fileURLToPath(new URL('../brut/cadena-entradas/osm/', import.meta.url));
const F = 'C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/src/lib/carta/territoris.js';
const v = JSON.parse(fs.readFileSync(S + 'valadas.json', 'utf8'));
const OC = {
	'V-SUSA': 'Auta Val de Susa',
	'V-CLUSON': 'Val Cluson',
	'V-SANTMARTIN': 'Val Sant Martin',
	'V-PELIS': 'Val Pèlis',
	'V-PO': 'Val Pò',
	'V-VARACHA': 'Val Varacha',
	'V-MAIRA': 'Val Maira',
	'V-GRANA': 'Val Grana',
	'V-ESTURA': "Val d'Estura",
	'V-GES': 'Val Ges',
	'V-VERMENANHA': 'Val Vermenanha'
};
const bbox = (anels) => {
	const p = anels.flat();
	const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
	return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map((x) => Math.round(x * 1000) / 1000);
};
let s = fs.readFileSync(F, 'utf8');
if (!s.includes("'despartament:V-SUSA'")) {
	const a = "\t'region:VALADAS': 'Valadas occitanas'\n};";
	if (!s.includes(a)) throw new Error('NOMS_OC_TER introbable');
	const linhas = Object.entries(OC).map(([c, n]) => `\t'despartament:${c}': ${JSON.stringify(n)}`);
	s = s.replace(a, "\t'region:VALADAS': 'Valadas occitanas',\n" + linhas.join(',\n') + '\n};');
}
if (!s.includes('"code":"VALADAS"')) {
	const b = '{"nom":"Val d\'Aran","code":"ARAN"';
	if (!s.includes(b)) throw new Error('ARAN introbable');
	const ent = [
		{ nom: 'Vallées occitanes', code: 'VALADAS', mena: 'region', bbox: bbox(v.totas) },
		...v.valadas.map(([c, n, an]) => ({ nom: n, code: c, mena: 'despartament', bbox: bbox(an) }))
	];
	s = s.replace(b, ent.map((e) => JSON.stringify(e)).join(',') + ',' + b);
}
fs.writeFileSync(F, s);
console.log('ok');
