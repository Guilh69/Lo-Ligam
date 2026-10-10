// Alsacian e francic : contraròtle de la classificacion venguda de la carta
// « Sprachen in Elsass-Lothringen » (svg-comunas.csv) per las listas de
// comunas de las fonts escrichas :
//  - Constant This, Die deutsch-französische Sprachgrenze in Lothringen (1887),
//    p. 23-24, d'aprèp la Wikipèdia fr « Francique lorrain » (comunas de cada
//    costat de la limit en Mosèla) ;
//  - las linhas op/of e wat/was (meteis article) ;
//  - « Grenzorte des alemannischen Dialektraums » (Wikipèdia de), seccion França.
//
//   node SIG/cadena/alsacian-control.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { BRUT, csv, insee } from './alsacian-comun.mjs';

const svg = Object.fromEntries(csv(path.join(BRUT, 'svg-comunas.csv')).map((r) => [r.insee, r]));
const GERM = /moselfrankisch|rheinfrankisch|pfalzisch|elsassisch|hochalemannisch/;
const ROM = /lothringisch|frainc_comtou/;

let mancas = [], errors = [];
function verif(font, nom, cibla, re, nota = '') {
	const ii = insee(cibla);
	if (ii.length !== 1) { mancas.push(`${font} : ${nom} (${cibla}) -> ${ii.join(',') || 'pas trobat'}`); return; }
	const r = svg[ii[0]];
	const ok = re.test(r.classa);
	if (!ok) errors.push(`${font} : ${nom}${cibla !== nom ? ' [' + cibla + ']' : ''} ${ii[0]} = ${r.classa} (${r.parts}${r.regas ? ' ; regas ' + r.regas : ''}) ${nota}`);
	return ok;
}

// 1. Constant This 1887
const fl = fs.readFileSync(path.join(BRUT, 'fonts', 'fr-Francique_lorrain.wiki'), 'utf8');
const lig = (t) => [...t.matchAll(/(à travers )?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)].map((m) => ({ travers: !!m[1], cibla: m[2].replace(/\s*\(Moselle\)/, ''), nom: m[3] || m[2] }));
const germ = fl.match(/\*Zone germanophone :(.*)/)[1], franc = fl.match(/\*Zone francophone :(.*)/)[1];
let n = 0, ok = 0;
for (const x of lig(germ)) { if (x.travers) { console.log(`This : limit a travèrs ${x.nom} (${insee(x.cibla)}) = ${svg[insee(x.cibla)[0]]?.parts}`); continue; } n++; if (verif('This germ.', x.nom, x.cibla, GERM)) ok++; }
for (const x of lig(franc)) { if (x.travers) continue; n++; if (verif('This franc.', x.nom, x.cibla, ROM)) ok++; }
console.log(`This 1887 : ${ok}/${n} d'acòrdi`);

// 2. linhas op/of e wat/was
const linha = (re) => fl.match(re)[1].split('/').map((s) => s.trim());
const ISO = [
	['op/of oèst', /''Zeurange([^']*)''/, 'Zeurange'], ['op/of èst', /''Schwerdorff([^']*)''/, 'Schwerdorff'],
	['wat/was oèst', /''Ham-Sous-Varsberg([^']*)''/, 'Ham-Sous-Varsberg'], ['wat/was èst', /''Creutzwald([^']*)''/, 'Creutzwald'],
];
const iso = {};
for (const [k, re, p] of ISO) {
	const noms = [p, ...fl.match(re)[1].split('/').filter(Boolean)].map((s) => s.trim());
	// ancianas comunas e amaguets -> comuna d'ara (Wikipèdia fr, articles de cada luòc, 2026-10-10)
	const AMAGUETS = { Zeurange: 'Flastroff', Grindorf: 'Grindorff-Bizing', Lacroix: 'Saint-François-Lacroix', Rodlach: 'Bibiche', Edling: 'Anzeling',
		Beckerholtz: 'Filstroff', Diding: 'Freistroff', Bisten: 'Bisten-en-Lorraine', Tritteling: 'Tritteling-Redlach', Tetting: 'Tetting-sur-Nied', Longeville: 'Longeville-lès-Saint-Avold', Chémery: 'Chémery-les-Deux' };
	iso[k] = noms.map((nm) => ({ nom: nm, comuna: AMAGUETS[nm] || nm, insee: insee(AMAGUETS[nm] || nm, ['57']) }));
	console.log(k + ' : ' + iso[k].map((x) => `${x.nom} ${x.insee.join(',') || '?'} ${svg[x.insee[0]]?.classa ?? ''}`).join(' | '));
}
fs.writeFileSync(path.join(BRUT, 'isoglossas-mosela.json'), JSON.stringify(iso, null, 1));

// 3. Grenzorte (França)
const go = csv(path.join(BRUT, 'grenzorte.csv')).filter((r) => r.seccion.startsWith('Frankreich'));
n = 0; ok = 0;
for (const r of go) {
	let cibla = r.luoc_ligam;
	const gde = r.nota.match(/Gde\.\s+([^.;]+?)(?:\s+(?:BR|MOS|NA)\b|\.|$)/);
	if (gde) cibla = gde[1].trim();
	if (/^\(Gebiet/.test(r.luoc)) cibla = r.nom_de.replace(/^Gde\.\s*/, '');
	if (/Burg Fleckenstein/.test(cibla)) cibla = 'Lembach';
	let re = /elsassisch|hochalemannisch/;
	if (/Romanische Gemeinde|vor allem romanischsprachige/.test(r.nota) || /Ab dem 17\. Jh\. französischsprachig/.test(r.sosseccion)) re = ROM;
	if (/\bNA\b/.test(r.nota)) re = /rheinfrankisch|pfalzisch/;
	n++;
	if (verif('Grenzorte', r.luoc, cibla, re, `[${r.sosseccion.slice(0, 60)}] ${r.nota.slice(0, 80)}`)) ok++;
}
console.log(`Grenzorte (França) : ${ok}/${n} d'acòrdi`);
console.log('\nDesacòrdis :\n  ' + errors.join('\n  '));
console.log('\nPas trobats o ambigús :\n  ' + mancas.join('\n  '));
