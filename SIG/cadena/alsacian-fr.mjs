// Alsacian e francic : classament de las comunas francesas (Mosèla, Bas-Rin,
// Naut-Rin). Basa : la carta « Sprachen in Elsass-Lothringen » recampada amb
// las comunas (alsacian-svg.py -> svg-comunas.csv). Corrèccions e
// precisions, cadun amb sa font :
//  1. limit alemanic / francic al nòrd d'Alsàcia e a l'entorn de Dabo :
//     « Grenzorte des alemannischen Dialektraums » (Wikipèdia de), d'acòrdi amb
//     la carta de Hudlett (2001, contraròtle) : las comunas francicas de la carta
//     de basa claus entre la linha dels Grenzorte e lo domeni alemanic venon
//     alemanicas (transicio = lo francic de la carta de basa) ;
//  2. francic mosellan / luxemborgés : linha op/of (Wikipèdia fr, « Francique
//     lorrain »), per proximitat dins lo graf de las comunas vesinas ;
//  3. bas-alemanic del nòrd / del sud : limit departamental (aproximacion, la
//     carta de Hudlett met la linha a l'entorn de la limit Bas-Rin / Naut-Rin) ;
//     Estrasborg : parlar estrasborgés ;
//  4. comunas que la limit romanica / germanica travèrsa (Constant This 1887,
//     « à travers ») o regadas dins la carta de basa : domeni mixta.
//
//   node SIG/cadena/alsacian-fr.mjs
// Sortida : SIG/brut/alsacian/classament-fr.json
import fs from 'fs';
import path from 'path';
import { BRUT, csv, insee } from './alsacian-comun.mjs';

const props = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(BRUT, 'comunas-fr.geojson'), 'utf8')).features.map((f) => [f.properties.codi, f.properties]));
const svg = Object.fromEntries(csv(path.join(BRUT, 'svg-comunas.csv')).map((r) => [r.insee, r]));
const vesins = {};
for (const v of csv(path.join(BRUT, 'comunas-fr-vesins.csv'))) { (vesins[v.a] ??= []).push(v.b); (vesins[v.b] ??= []).push(v.a); }
const parts = (s) => Object.fromEntries((s || '').split(' ').filter(Boolean).map((x) => { const [k, v] = x.split(':'); return [k, +v]; }));
const un = (nom, deps) => { const l = insee(nom, deps); if (l.length !== 1) throw new Error(`${nom} : ${l}`); return l[0]; };

// classas de la carta de basa -> dialècte
const DIAL = { moselfrankisch: 'moselfrankisch', rheinfrankisch: 'rheinfrankisch', pfalzisch: 'sudfrankisch', elsassisch: 'niederalemannisch', hochalemannisch: 'hochalemannisch', lothringisch: '', frainc_comtou: '' };
const ROMAN = { lothringisch: 'lorrain', frainc_comtou: 'franc-comtois' };
const GROPE = { letzebuergesch: 'francic', moselfrankisch: 'francic', rheinfrankisch: 'francic', sudfrankisch: 'francic', niederalemannisch: 'alemanic', hochalemannisch: 'alemanic' };

const C = {};
for (const [i, r] of Object.entries(svg)) {
	const p = parts(r.parts), rg = parts(r.regas);
	C[i] = { codi: i, classa: r.classa, parts: p, regas: rg, dialecte: DIAL[r.classa], parlar: ROMAN[r.classa] || '', transicio: [], notas: [], fonts: ['SEL'] };
}

// ---- 1. limit alemanic / francic (Grenzorte) ----
const go = csv(path.join(BRUT, 'grenzorte.csv')).filter((r) => /Oberrheinalemannisch zu Rheinfränkisch/.test(r.sosseccion) || /Oberrheinalemannisch zu Rheinfränkisch/.test(r.seccion));
const B = new Set(), Bparcial = new Set();
for (const r of go) {
	let c = r.luoc_ligam;
	const gde = r.nota.match(/Gde\.\s+([^.;]+?)(?:\s+(?:BR|MOS|NA)\b|\.|$)/);
	if (gde) c = gde[1].trim();
	if (/^\(Gebiet/.test(r.luoc)) c = r.nom_de.replace(/^Gde\.\s*/, '');
	if (/Burg Fleckenstein/.test(c)) c = 'Lembach';
	if (/Phalsbourg/.test(c)) c = 'Phalsbourg';
	const deps = /\bMOS\b/.test(r.nota) ? ['57'] : /\bBR\b/.test(r.nota) ? ['67'] : ['57', '67', '68'];
	const l = insee(c.replace(/\s*\((Bas-Rhin|Moselle|Elsass)\)$/, ''), deps);
	if (l.length !== 1) { console.log(`Grenzorte : ${r.luoc} (${c}) -> ${l}`); continue; }
	if (/\bNA\b/.test(r.nota)) continue; // Hoffen : comuna pas alemanica
	// Dabo e Phalsbourg : lo vilatge principal es francic (tèxte de l'article), sonque d'amaguets alemanics
	if (['57163', '57540'].includes(l[0])) { Bparcial.add(l[0]); continue; }
	B.add(l[0]);
}
const FRANC = new Set(Object.keys(C).filter((i) => /rheinfrankisch|pfalzisch/.test(C[i].classa)));
const grans = ['Bitche', 'Sarre-Union', 'Drulingen', 'Wissembourg', 'Lauterbourg', 'Sarreguemines', 'Rohrbach-lès-Bitche', 'Seltz', 'Forbach', 'Volmunster'].map((n) => un(n, ['57', '67']));
const vist = new Set(grans), coa = [...grans];
while (coa.length) { const a = coa.shift(); for (const b of vesins[a] || []) if (FRANC.has(b) && !B.has(b) && !vist.has(b)) { vist.add(b); coa.push(b); } }
// Dabo e Walscheid : isolats francics renans (tèxte de l'article) : demòran francics
const ISOLATS = ['57163', '57742'];
for (const i of ISOLATS) { C[i].notas.push('îlot francique rhénan entre alémanique et roman (Grenzorte)'); C[i].fonts.push('GRZ'); }
const passan = [...FRANC].filter((i) => !vist.has(i) && !ISOLATS.includes(i));
console.log(`1. Grenzorte : ${B.size} comunas alemanicas de la linha (+ ${Bparcial.size} parcialas : Dabo, Phalsbourg) ; comunas francicas de la carta de basa que venon alemanicas : ${passan.length}`);
for (const i of passan) {
	const c = C[i];
	c.transicio.push(DIAL[c.classa]);
	c.notas.push(`${c.classa === 'pfalzisch' ? 'francique méridional' : 'francique rhénan'} dans la carte de base (Wenker) ; alémanique selon les Grenzorte${B.has(i) ? ' (commune de la ligne)' : ' (entre la ligne et le domaine alémanique)'}`);
	c.dialecte = 'niederalemannisch';
	c.fonts.push('GRZ');
	console.log(`   ${i} ${props[i].nom} (${c.classa})${B.has(i) ? ' [linha]' : ''}`);
}
for (const i of Bparcial) { C[i].transicio.push('niederalemannisch'); C[i].notas.push('hameaux alémaniques à l\'est (Grenzorte), village principal francique rhénan'); C[i].fonts.push('GRZ'); }
// comunas de la linha ja alemanicas dins la carta de basa : font en mai
for (const i of B) if (!passan.includes(i) && C[i].dialecte === 'niederalemannisch') C[i].fonts.push('GRZ');

// ---- 2. luxemborgés / mosellan (linha op/of) ----
const iso = JSON.parse(fs.readFileSync(path.join(BRUT, 'isoglossas-mosela.json'), 'utf8'));
const semenas = { letzebuergesch: ['Thionville', 'Sierck-les-Bains', 'Cattenom', 'Rédange', 'Russange'], moselfrankisch: ['Boulay-Moselle', 'Bouzonville'] };
// la linha fa barralha : cada costat s'espandís dins lo francic mosellan de la
// carta de basa sens passar per las comunas de l'autre costat de la linha.
const MOS = new Set(Object.keys(C).filter((i) => C[i].dialecte === 'moselfrankisch'));
const oest0 = iso['op/of oèst'].flatMap((x) => x.insee), est0 = iso['op/of èst'].flatMap((x) => x.insee);
// comuna dins las doas listas (Anzeling : Edling a l'oèst, Anzeling a l'èst) : la linha la travèrsa
const travessadas = oest0.filter((i) => est0.includes(i));
const oest = oest0.filter((i) => !travessadas.includes(i)), est = est0.filter((i) => !travessadas.includes(i));
for (const i of travessadas) { C[i].transicio.push('letzebuergesch'); C[i].notas.push('la ligne op/of traverse la commune (Edling à l\'ouest, Anzeling à l\'est) : classée avec le village principal'); }
const espandir = (sem, barralha) => {
	const v = new Set(sem.filter((i) => MOS.has(i))), q = [...v];
	while (q.length) { const a = q.shift(); for (const b of vesins[a] || []) if (MOS.has(b) && !v.has(b) && !barralha.includes(b)) { v.add(b); q.push(b); } }
	return v;
};
const lux = espandir([...oest, ...semenas.letzebuergesch.map((n) => un(n, ['57']))], [...est, ...travessadas]);
const mos = espandir([...est, ...semenas.moselfrankisch.map((n) => un(n, ['57']))], [...oest, ...travessadas]);
for (const i of travessadas) mos.add(i);
let nlux = 0, nmos = 0; const dos = [], cap = [];
for (const i of MOS) {
	if (lux.has(i) && !mos.has(i)) { C[i].dialecte = 'letzebuergesch'; nlux++; }
	else if (mos.has(i) && !lux.has(i)) nmos++;
	else { (lux.has(i) ? dos : cap).push(`${i} ${props[i].nom}`); C[i].notas.push('ligne op/of non fermée : côté incertain'); }
	C[i].fonts.push('WFL');
}
console.log(`2. op/of : ${nlux} luxemborgés, ${nmos} mosellan ; dels dos costats : ${dos.join(', ') || 'cap'} ; d'un costat ni de l'autre : ${cap.join(', ') || 'cap'}`);
// linha wat/was : desacòrdis amb la carta de basa
for (const [k, d] of [['wat/was oèst', 'moselfrankisch'], ['wat/was èst', 'rheinfrankisch']]) {
	for (const x of iso[k]) for (const i of x.insee) if (C[i] && C[i].dialecte !== d && GROPE[C[i].dialecte] === 'francic') {
		C[i].transicio.push(d); C[i].notas.push(`ligne wat/was (Wikipédia fr) : côté ${d === 'moselfrankisch' ? 'mosellan' : 'rhénan'}`); C[i].fonts.push('WFL');
		console.log(`   wat/was : ${i} ${props[i].nom} = ${C[i].dialecte}, la linha lo met ${d}`);
	}
}

// ---- 3. parlars ----
for (const c of Object.values(C)) {
	if (c.dialecte === 'niederalemannisch') c.parlar = c.codi.startsWith('68') ? 'sud' : 'nord';
	if (c.dialecte === 'rheinfrankisch' && c.codi.startsWith('67')) c.parlar = 'alsace_bossue';
	if (c.dialecte === 'rheinfrankisch' && c.codi.startsWith('57')) c.parlar = 'lorrain';
}
C['67482'].parlar = 'strasbourgeois';
C['67482'].transicio.push('sudfrankisch');
C['67482'].notas.push('parler urbain à traits franciques (hachures francique méridional dans la carte de base ; Wikipédia fr « Alsacien », de « Elsässisch »)');
// haut / bas-alemanic : desacòrdis amb los Grenzorte (Seppois-le-Bas, Ueberstrass, Friesen dins la seccion « Hochalemannisch »)
for (const r of csv(path.join(BRUT, 'grenzorte.csv')).filter((r) => /Hochalemannisch zu Französisch/.test(r.sosseccion) && r.seccion.startsWith('Frankreich'))) {
	const l = insee(r.luoc_ligam.replace(/\s*\(Haut-Rhin\)$/, ''), ['68']);
	if (l.length === 1 && C[l[0]].dialecte === 'niederalemannisch') { C[l[0]].transicio.push('hochalemannisch'); C[l[0]].notas.push('haut-alémanique selon les Grenzorte'); C[l[0]].fonts.push('GRZ'); }
}

// ---- 4. limit romanica / germanica : comunas mixtas ----
const MAP = { moselfrankisch: 'moselfrankisch', rheinfrankisch: 'rheinfrankisch', pfalzisch: 'sudfrankisch', elsassisch: 'niederalemannisch', hochalemannisch: 'hochalemannisch', lothringisch: 'roman', frainc_comtou: 'roman' };
const fl = fs.readFileSync(path.join(BRUT, 'fonts', 'fr-Francique_lorrain.wiki'), 'utf8');
const travers = [...fl.matchAll(/à travers \[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)].map((m) => m[1].replace(/\s*\(Moselle\)/, ''));
const mixtas = new Set();
for (const n of new Set(travers)) {
	const l = insee(n, ['57']);
	const i = l[0] || (n === 'Suzange' ? '57647' : null); // Suzange : ancian vilatge de Serémange-Erzange
	if (!i) continue;
	mixtas.add(i); C[i].notas.push(`la limite de Constant This (1887) traverse ${n === 'Suzange' ? 'Suzange (Serémange-Erzange)' : 'la commune'}`); C[i].fonts.push('THIS');
}
for (const c of Object.values(C)) {
	const rom = (c.parts.lothringisch || 0) + (c.parts.frainc_comtou || 0), germ = 1 - rom;
	const rgRom = (c.regas.lothringisch || 0) + (c.regas.frainc_comtou || 0);
	const rgGerm = Object.entries(c.regas).filter(([k]) => !ROMAN[k]).reduce((s, [, v]) => s + v, 0);
	const estRom = !c.dialecte;
	if ((estRom && rgGerm >= 0.15) || (!estRom && rgRom >= 0.15)) { mixtas.add(c.codi); c.notas.push(`hachurée dans la carte de base (${Object.entries(c.regas).map(([k, v]) => `${k} ${Math.round(v * 100)} %`).join(', ')})`); }
	// partida romanica e germanica dins la carta (calatge o ancianas comunas) : sonque una nòta,
	// las listas de This e dels Grenzorte classan aquelas comunas d'un costat
	else if (Math.min(rom, germ) >= 0.15 && Object.values(c.parts).reduce((s, v) => s + v, 0) > 0.8) { c.notas.push(`partagée dans la carte de base (${Object.entries(c.parts).map(([k, v]) => `${k} ${Math.round(v * 100)} %`).join(', ')}), classée d'un côté par This ou les Grenzorte`); }
	// partiment intèrne al germanic (mai de 15 %) : transicio
	else if (!estRom) {
		// (la carta de basa met lo luxemborgés dins lo francic mosellan : pas de transicion per aquò)
		const memo = (k) => MAP[k] === c.dialecte || (k === 'moselfrankisch' && c.dialecte === 'letzebuergesch');
		const autres = Object.entries(c.parts).filter(([k, v]) => !ROMAN[k] && !memo(k) && v >= 0.15);
		for (const [k, v] of autres) if (!c.transicio.includes(MAP[k])) { c.transicio.push(MAP[k]); c.notas.push(`${Math.round(v * 100)} % ${k} dans la carte de base`); }
		const rgAutres = Object.entries(c.regas).filter(([k, v]) => !ROMAN[k] && !memo(k) && v >= 0.15);
		for (const [k, v] of rgAutres) if (!c.transicio.includes(MAP[k])) { c.transicio.push(MAP[k]); c.notas.push(`hachures ${k} (${Math.round(v * 100)} %) dans la carte de base`); }
	}
}
console.log(`4. comunas mixtas (romanic / germanic) : ${[...mixtas].map((i) => `${i} ${props[i].nom}`).join(', ')}`);

// ---- sortida ----
const DEP = { 57: 'Moselle', 67: 'Bas-Rhin', 68: 'Haut-Rhin' };
const sortida = Object.values(C).map((c) => {
	const p = props[c.codi];
	const estRom = !c.dialecte;
	let domeni = estRom ? 'roman' : GROPE[c.dialecte];
	if (mixtas.has(c.codi)) {
		domeni = 'mixta';
		if (estRom) c.transicio.push(MAP[Object.entries(c.regas).concat(Object.entries(c.parts)).filter(([k]) => !ROMAN[k]).sort((a, b) => b[1] - a[1])[0]?.[0]] || 'germanic');
		else c.transicio.push('roman');
	}
	return {
		regio: 'France', unitat: DEP[p.dep], mena: 'comuna_fr', nom_oficial: p.nom, codi: c.codi, domeni,
		dialecte: c.dialecte, parlar: c.parlar, transicio: [...new Set(c.transicio)].filter(Boolean).join(' '),
		part_oc: 0, nota: [...new Set(c.notas)].join(' ; '), font: [...new Set(['IGN', ...c.fonts])].join(' '),
		populacion: p.populacion, cap_luoc: p.cap_luoc,
	};
});
fs.writeFileSync(path.join(BRUT, 'classament-fr.json'), JSON.stringify(sortida, null, 0));
const compte = {};
for (const s of sortida) { const k = `${s.unitat} ${s.domeni} ${s.dialecte}${s.parlar ? ' (' + s.parlar + ')' : ''}`; compte[k] = (compte[k] || 0) + 1; }
console.log(Object.entries(compte).sort().map(([k, v]) => `  ${k} : ${v}`).join('\n'));
