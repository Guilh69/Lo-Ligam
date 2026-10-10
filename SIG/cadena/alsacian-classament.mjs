// Alsacian e francic : assemblatge final. França (alsacian-fr.mjs) e païses
// vesins (cartas calibradas per alsacian-calatge.py, listas de las fonts
// escrichas), noms locals (Wikidata, OSM).
//
//   node SIG/cadena/alsacian-classament.mjs
// Sortidas : SIG/alsacian/dialectes-alsacian.csv, dialectes-alsacian.json, noms-locals.csv
import fs from 'fs';
import path from 'path';
import { BRUT, csv } from './alsacian-comun.mjs';

const SIG = path.resolve(BRUT, '../..');
const SORT = path.join(SIG, 'alsacian');
fs.mkdirSync(SORT, { recursive: true });
const gj = (f) => JSON.parse(fs.readFileSync(path.join(BRUT, f), 'utf8')).features.map((x) => x.properties);
const cal = (n) => Object.fromEntries(csv(path.join(BRUT, `calatge-${n}.csv`)).map((r) => [r.codi, r]));
const parts = (s) => Object.fromEntries((s || '').split(' ').filter(Boolean).map((x) => { const [k, v] = x.split(':'); return [k, +v]; }));
const RF = cal('rf'), AL = cal('alem');
const WD = JSON.parse(fs.readFileSync(path.join(BRUT, 'wd-noms.json'), 'utf8'));

const GROPE = { letzebuergesch: 'francic', moselfrankisch: 'francic', rheinfrankisch: 'francic', sudfrankisch: 'francic', ripuarisch: 'francic', limburgisch: 'francic',
	niederalemannisch: 'alemanic', hochalemannisch: 'alemanic', hochstalemannisch: 'alemanic', schwabisch: 'alemanic' };
const M_RF = { moselfrankisch_nord: ['moselfrankisch', 'nord'], moselfrankisch_sud: ['moselfrankisch', 'sud'], rheinfrankisch: ['rheinfrankisch', ''], ripuarisch: ['ripuarisch', ''], sudniederfrankisch: ['limburgisch', ''], nordniederfrankisch: ['', ''] };
const M_AL = { oberrheinalemannisch: ['niederalemannisch', 'oberrhein'], bodenseealemannisch: ['niederalemannisch', 'bodensee'], hochalemannisch: ['hochalemannisch', ''],
	hochstalemannisch: ['hochstalemannisch', ''], schwabisch: ['schwabisch', ''], nordoberdeutsch: ['sudfrankisch', ''], mitteldeutsch: ['rheinfrankisch', ''], bairisch: ['bairisch', ''],
	oil: ['', ''], francoprovencal: ['', ''], galloitalic: ['', ''], retoroman: ['', ''] };
const files = [];
const ligne = (o) => files.push({ regio: '', unitat: '', mena: '', nom_oficial: '', nom_local: '', codi: '', domeni: '', dialecte: '', parlar: '', transicio: '', part_oc: 0, nota: '', font: '', ...o });

// transicions d'aprèp los escapolons de la carta (classa autra de mai de 25 %)
function transicions(r, M, dial) {
	const t = [];
	for (const [k, v] of Object.entries(parts(r?.parts))) {
		if (v < 0.25 || k === 'fons' || !M[k]) continue;
		const d = M[k][0] || 'roman';
		if (d !== dial && !t.includes(d)) t.push(d);
	}
	return t;
}

// ---------- França ----------
for (const c of JSON.parse(fs.readFileSync(path.join(BRUT, 'classament-fr.json'), 'utf8'))) {
	const { populacion, cap_luoc, ...o } = c;
	ligne(o);
}

// ---------- Alemanha ----------
const OSTFR = ['08126', '08127', '08128', '08225']; // Hohenlohe, Schwäbisch Hall, Main-Tauber, Neckar-Odenwald
const de = gj('de-comunas.geojson');
const deNom = {};
for (const p of de) (deNom[p.nom] ??= []).push(p.codi);
const deC = {};
for (const p of de) {
	const land = p.codi.slice(3, 5);
	const r = RF[p.codi], a = AL[p.codi];
	let d = '', parlar = '', fonts = ['VG250'], notas = [], tr = [];
	const deRF = () => { if (r && M_RF[r.classa]) { [d, parlar] = M_RF[r.classa]; fonts.push('RF'); tr = transicions(r, M_RF, d); return true; } return false; };
	const deAL = () => { if (a && M_AL[a.classa] && M_AL[a.classa][0]) { [d, parlar] = M_AL[a.classa]; fonts.push('ALM'); tr = transicions(a, M_AL, d); return true; } return false; };
	if (land === '08') { if (!deAL()) deRF(); } else { if (!deRF()) deAL(); }
	if (!d) {
		// fons de las doas cartas : classa vesina pus pròcha
		// (la carta que sa classa vesina es la pus pròcha, a mens de 10 km)
		const cand = [[r, M_RF, 'RF'], [a, M_AL, 'ALM']].filter(([v, M]) => v && v.classa === 'fons' && M[v.classa_vesina]?.[0] && +v.dist_km <= 10).sort((x, y) => +x[0].dist_km - +y[0].dist_km);
		if (cand.length) { const [v, M, fnt] = cand[0]; [d, parlar] = M[v.classa_vesina]; fonts.push(fnt); notas.push(`hors des aires colorées de la carte ${fnt === 'RF' ? 'Rheinischer Fächer' : 'Alemannic-Dialects-Map'} (${v.dist_km} km) : classe la plus proche`); }
		else if (p.codi.startsWith('de:08128')) notas.push('francique oriental probable (Main-Tauber), hors des deux cartes');
	}
	if (d === 'sudfrankisch' && OSTFR.includes(p.codi.slice(3, 8))) { tr.push('ostfrankisch'); notas.push('francique oriental possible (Hohenlohe, Tauber, Odenwald) : la carte confond francique méridional et oriental'); }
	if (r && a && M_RF[r.classa]?.[0] && M_AL[a.classa]?.[0] && GROPE[M_RF[r.classa][0]] && GROPE[M_AL[a.classa][0]] && M_RF[r.classa][0] !== M_AL[a.classa][0] && !(M_AL[a.classa][0] === 'rheinfrankisch' && M_RF[r.classa][0] === 'rheinfrankisch')) {
		const autre = land === '08' ? M_RF[r.classa][0] : M_AL[a.classa][0];
		if (autre !== d && !tr.includes(autre)) { tr.push(autre); notas.push(`l'autre carte (${land === '08' ? 'Rheinischer Fächer' : 'Alemannic-Dialects-Map'}) indique ${autre}`); }
	}
	deC[p.codi] = { p, d, parlar, fonts, notas, tr };
}
// Grenzorte : las comunas de la linha alemanica (Bade) e soaba (Wurtemberg)
let gOk = 0, gCorr = [], gMan = [];
for (const r of csv(path.join(BRUT, 'grenzorte.csv')).filter((r) => r.seccion === 'Baden-Württemberg')) {
	let nom = r.luoc_ligam.replace(/\s*\([^)]*\)$/, '');
	const tx = `${r.nom_de} ${r.nota}`;
	if (/\bNA\b/.test(tx)) continue; // comuna pas alemanica (o pas soaba) segon l'article
	const gde = tx.match(/Gde\.\s+([^,.;]+?)(?:\s+NA)?(?:[,.;]|$)/);
	if (gde) nom = gde[1].trim();
	const l = (deNom[nom] || []).filter((c) => c.startsWith('de:08'));
	if (l.length !== 1) { gMan.push(`${r.luoc} (${nom})`); continue; }
	const c = deC[l[0]];
	const voluda = /Oberrheinalemannisch/.test(r.sosseccion) ? 'niederalemannisch' : 'schwabisch';
	c.fonts.push('GRZ');
	if (c.d === voluda || (voluda === 'niederalemannisch' && GROPE[c.d] === 'alemanic')) { gOk++; continue; }
	gCorr.push(`${l[0]} ${c.p.nom} : ${c.d} -> ${voluda}`);
	c.tr.push(c.d); c.notas.push(`commune de la ligne des Grenzorte (${voluda === 'schwabisch' ? 'côté souabe' : 'côté alémanique'}) ; la carte calée indiquait ${c.d}`);
	c.d = voluda; c.parlar = voluda === 'niederalemannisch' ? 'oberrhein' : '';
}
console.log(`Alemanha, Grenzorte : ${gOk} d'acòrdi, corregidas : ${gCorr.join(' ; ') || 'cap'} ; pas trobadas : ${gMan.length} (${gMan.slice(0, 12).join(', ')}${gMan.length > 12 ? '…' : ''})`);
for (const { p, d, parlar, fonts, notas, tr } of Object.values(deC)) {
	const domeni = p.mena === 'gemeindefrei_de' ? 'vesina' : d ? (GROPE[d] || 'autre') : 'incert';
	if (!d) notas.push('aucune classe dans les deux cartes');
	ligne({ regio: 'Allemagne', unitat: `${p.unitat} · ${p.unitat2}`, mena: p.mena, nom_oficial: p.nom, codi: p.codi, domeni, dialecte: d, parlar,
		transicio: [...new Set(tr)].join(' '), nota: [...new Set([...notas, p.mena === 'gemeindefrei_de' ? 'territoire sans commune (forêt), classé d\'après la carte' : ''])].filter(Boolean).join(' ; '), font: [...new Set(fonts)].join(' ') });
}

// ---------- Soïssa ----------
const OFS = Object.fromEntries(csv(path.join(SIG, 'arpitan', 'ofs-regions-linguisticas.csv')).map((r) => [r.bfs, r]));
const BIEL = { 'ch:371': 'Biel/Bienne', 'ch:372': 'Evilard' };
const ROM_CH = { FR: 'arpitan', VS: 'arpitan', JU: 'oil', BE: 'oil', SO: 'oil' };
let chSens = [];
for (const p of gj('ch-comunas.geojson')) {
	const bfs = p.codi.slice(3), o = OFS[bfs], a = AL[p.codi];
	const reg = o?.regio_ling_2020;
	let d = '', parlar = '', fonts = ['OSM', 'OFS'], notas = [], tr = [], domeni;
	if (!o) chSens.push(`${p.codi} ${p.nom}`);
	if (reg === '1' || (!o && a && GROPE[M_AL[a.classa]?.[0]])) {
		if (a && M_AL[a.classa] && GROPE[M_AL[a.classa][0]]) { [d, parlar] = M_AL[a.classa]; fonts.push('ALM'); tr = transicions(a, M_AL, d); }
		else {
			// la carta met la comuna dins lo roman o lo fons : la classa alemanica pus frequenta dels escapolons, o la vesina
			const pa = Object.entries(parts(a?.parts)).filter(([k]) => GROPE[M_AL[k]?.[0]]).sort((x, y) => y[1] - x[1]);
			const k = pa[0]?.[0] || (GROPE[M_AL[a?.classa_vesina]?.[0]] ? a.classa_vesina : null);
			if (k) { [d, parlar] = M_AL[k]; fonts.push('ALM'); notas.push('commune de langue allemande (OFS) au bord de l\'aire alémanique de la carte'); }
			else { d = 'hochalemannisch'; notas.push('commune de langue allemande (OFS) hors de la carte : haut-alémanique par défaut'); }
			tr.push('roman');
		}
		// En Soïssa, sonque Basilèa es bas-alemanica (Wikipèdia fr « Alsacien » : « seule enclave bas-alémanique »
		// de Suïssa) ; los autres tòcs bas-alemanics de la carta (Leimental, Crotz-Linga) venon del calatge
		// (1 a 2 km) o d'una aira dessenhada a cavalièr sus la frontièra : naut alemanic, amb la transicion.
		if (p.codi === 'ch:2701') { d = 'niederalemannisch'; parlar = 'basel'; tr = tr.filter((x) => x !== 'niederalemannisch'); tr.push('hochalemannisch'); notas.push('Baseldytsch : enclave bas-alémanique (Wikipédia fr « Alsacien »), aujourd\'hui en recul devant le haut-alémanique'); fonts.push('WALS'); }
		else if (d === 'niederalemannisch') { d = 'hochalemannisch'; parlar = ''; tr.push('niederalemannisch'); notas.push('bas-alémanique dans la carte (à la frontière) : classé haut-alémanique'); }
		domeni = GROPE[d];
	} else {
		domeni = 'roman'; parlar = reg === '2' ? (ROM_CH[p.unitat] || '') : reg === '3' ? 'italian' : '';
		notas.push(`région linguistique ${reg === '2' ? 'française' : reg === '3' ? 'italienne' : reg || '?'} (OFS)`);
	}
	if (BIEL[p.codi]) { domeni = 'mixta'; tr.push('roman'); notas.push('commune officiellement bilingue (Constitution du canton de Berne, art. 6 : arrondissement administratif de Biel/Bienne)'); fonts.push('BECONST'); }
	if (['ch:2196', 'ch:2275'].includes(p.codi)) notas.push('ville bilingue de fait (à valider)');
	if (!o && /wald/i.test(p.nom)) { domeni = 'vesina'; notas.push('territoire sans commune (forêt domaniale), classé d\'après la carte'); }
	ligne({ regio: 'Suisse', unitat: 'CH-' + p.unitat, mena: 'comuna_ch', nom_oficial: p.nom, codi: p.codi, domeni, dialecte: d, parlar,
		transicio: [...new Set(tr)].join(' '), nota: notas.join(' ; '), font: [...new Set(fonts)].join(' ') });
}
if (chSens.length) console.log(`Soïssa : sens region OFS : ${chSens.join(', ')}`);

// ---------- Luxemborg ----------
for (const p of gj('lu-comunas.geojson')) {
	const r = RF[p.codi];
	ligne({ regio: 'Luxembourg', unitat: 'Lëtzebuerg', mena: 'comuna_lu', nom_oficial: p.nom, nom_local: p.nom_lb || '', codi: p.codi, domeni: 'francic', dialecte: 'letzebuergesch',
		parlar: '', nota: r?.classa === 'moselfrankisch_nord' ? '' : `carte Rheinischer Fächer : ${r?.classa}`, font: 'OSM LUX84 RF' });
}

// ---------- Belgica ----------
const BE = {
	letz: ['81001', '81003', '81015', '81013'], mixta_letz: { '81004': 'partie orientale (Aubange)', '82009': 'partie orientale (Bodange, Wisembach…)', '85046': 'section de Hachy' },
	limb: ['63023', '63040', '63048', '63088', '63084', '63004', '73109'], rip: ['63061', '63013', '63012'], mos: ['63001', '63067', '63087'],
	fora: ['73066', '73111'], wal_ost: ['63049', '63080'],
};
for (const p of gj('be-comunas.geojson')) {
	const n = p.codi.slice(3), r = RF[p.codi];
	if (BE.fora.includes(n)) continue; // Limborg neerlandés : fòra del prètzfach
	let o = { regio: 'Belgique', unitat: { 6: 'Liège', 7: 'Limburg', 8: 'Luxembourg' }[n[0]], mena: 'comuna_be', nom_oficial: p.nom, codi: p.codi, domeni: 'roman', font: 'OSM' };
	if (BE.letz.includes(n)) o = { ...o, domeni: 'francic', dialecte: 'letzebuergesch', font: 'OSM PARL RF' };
	else if (BE.mixta_letz[n]) o = { ...o, domeni: 'mixta', dialecte: 'letzebuergesch', transicio: 'roman', nota: `Pays d'Arlon : seulement la ${BE.mixta_letz[n]}`, font: 'OSM PARL' };
	else if (BE.limb.includes(n)) o = { ...o, domeni: 'francic', dialecte: 'limburgisch', nota: n === '73109' ? 'région de langue néerlandaise (Fourons)' : ['63088', '63084', '63004'].includes(n) ? 'commune « platdiets » de la Communauté française' : 'Communauté germanophone', font: 'OSM OSTB THIOIS RF' };
	else if (BE.rip.includes(n)) o = { ...o, domeni: 'francic', dialecte: 'ripuarisch', nota: 'Communauté germanophone ; « mittelfränkisch » (de:Ostbelgien), ripuaire selon la carte', font: 'OSM OSTB RF' };
	else if (BE.mos.includes(n)) o = { ...o, domeni: 'francic', dialecte: 'moselfrankisch', parlar: 'nord', nota: 'Communauté germanophone (Eifel belge)', font: 'OSM OSTB RF' };
	else if (BE.wal_ost.includes(n)) o = { ...o, nota: 'wallon traditionnel, minorité germanophone (facilités) ; « Ostbelgien » au sens large', font: 'OSM OSTB' };
	// (la carta met lo luxemborgés dins lo mosellan del Nòrd : pas un desacòrdi)
	if (o.dialecte && r && M_RF[r.classa]?.[0] && M_RF[r.classa][0] !== o.dialecte && !(o.dialecte === 'letzebuergesch' && r.classa === 'moselfrankisch_nord')) o.nota = [o.nota, `carte Rheinischer Fächer : ${M_RF[r.classa][0]}`].filter(Boolean).join(' ; ');
	ligne(o);
}

// ---------- noms locals ----------
const LENGA = { niederalemannisch: 'gsw', hochalemannisch: 'gsw', hochstalemannisch: 'gsw', schwabisch: 'swg', sudfrankisch: 'gsw', rheinfrankisch: 'gsw', moselfrankisch: 'gsw', letzebuergesch: 'lb', ripuarisch: 'ksh', limburgisch: 'li' };
const PARL = {};
for (const m of fs.readFileSync(path.join(BRUT, 'fonts', "fr-Pays_d'Arlon.wiki"), 'utf8').matchAll(/\* Commune d[’'e]\s*(?:de\s+)?\[\[([^\]|]+)(?:\|[^\]]+)?\]\][^\n]*\n\*\* [^(\n]*\(''([^']+)''/g)) PARL[m[1].replace(/\s*\(commune\)/, '')] = m[2];
const noms = [];
for (const f of files) {
	if (!f.dialecte || f.domeni === 'roman') continue;
	const w = WD[f.codi] || {};
	const oficial = f.nom_oficial;
	const cands = [];
	const p1705 = (w.p1705 || []).filter(([, l]) => /^gsw/.test(l));
	if (f.regio === 'Luxembourg' && f.nom_local) cands.push([f.nom_local, 'lb', 'OSM name:lb (nom officiel luxembourgeois)']);
	if (f.regio === 'Belgique' && f.dialecte === 'letzebuergesch') {
		if (PARL[oficial]) cands.push([PARL[oficial], 'lb', "Wikipédia fr « Pays d'Arlon »"]);
		if (w.lb_label) cands.push([w.lb_label, 'lb', 'Wikidata, libellé lb']);
	}
	if (f.dialecte === 'letzebuergesch' || (f.dialecte === 'moselfrankisch' && f.regio !== 'Allemagne')) {
		if (w.lb_label) cands.push([w.lb_label, 'lb', 'Wikidata, libellé lb']);
		if (w.lb) cands.push([w.lb, 'lb', 'Wikipédia lb, titre']);
	}
	if (GROPE[f.dialecte] === 'alemanic' || ['sudfrankisch', 'rheinfrankisch', 'moselfrankisch'].includes(f.dialecte)) {
		for (const [n, l] of p1705) cands.push([n, l, 'Wikidata, P1705 (nom dans la langue d\'origine)']);
		if (w.gsw) cands.push([w.gsw, 'gsw', 'Wikidata, libellé gsw']);
	}
	if (f.dialecte === 'rheinfrankisch' && w.pfl && f.regio === 'Allemagne') cands.push([w.pfl, 'pfl', 'Wikipédia pfl, titre']);
	if (f.dialecte === 'moselfrankisch' && f.regio === 'Allemagne' && w.lb_label) cands.push([w.lb_label, 'lb', 'Wikidata, libellé lb']);
	if (f.dialecte === 'ripuarisch' && w.ksh) cands.push([w.ksh, 'ksh', 'Wikipédia ksh, titre']);
	const net = (s) => s.replace(/\s*\(.*\)$/, '').trim();
	// pas un nom local se diferís sonque per la ponctuacion, los accents o lo canton (« Altdorf UR »)
	const cl = (s) => net(s).replace(/\s+(UR|SH|SO|BE|LU|ZH|AG|BL|FR|VS|SZ|ZG|TG|JU|NW|OW|BS)$/, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-zß]/g, '');
	const bon = cands.map(([n, l, s]) => [net(n), l, s]).find(([n]) => n && cl(n) !== cl(oficial) && !/^(Stadt|Gemeinde) /.test(n));
	if (!bon) continue;
	f.nom_local = bon[0];
	const autres = [...new Set(cands.map(([n]) => net(n)).filter((n) => n !== bon[0] && n !== oficial))];
	noms.push({ codi: f.codi, nom_oficial: oficial, nom_local: bon[0], lenga: bon[1], dialecte: f.dialecte, font: bon[2], autras_formas: autres.join(' / ') });
}

// ---------- escritura ----------
// una transicion cap al meteis dialècte (classa cambiada aprèp lo calcul) es levada
for (const f of files) f.transicio = [...new Set(String(f.transicio || '').split(' ').filter((t) => t && t !== f.dialecte))].join(' ');
// pas de « ; » ni de guilhemets dins los camps (coma los CSV de l'arpitan e del catalan) :
// las nòtas son separadas per « | »
const q = (v) => String(v ?? '').replace(/\s*;\s*/g, ' | ').replace(/"/g, '').replace(/\n/g, ' ');
const COLS = ['regio', 'unitat', 'mena', 'nom_oficial', 'nom_local', 'codi', 'domeni', 'dialecte', 'parlar', 'transicio', 'part_oc', 'nota', 'font'];
const ord = { France: 0, Luxembourg: 1, Belgique: 2, Allemagne: 3, Suisse: 4 };
files.sort((a, b) => ord[a.regio] - ord[b.regio] || a.unitat.localeCompare(b.unitat) || a.nom_oficial.localeCompare(b.nom_oficial));
fs.writeFileSync(path.join(SORT, 'dialectes-alsacian.csv'), '﻿' + [COLS.join(';'), ...files.map((f) => COLS.map((k) => q(f[k])).join(';'))].join('\n') + '\n');
const NC = ['codi', 'nom_oficial', 'nom_local', 'lenga', 'dialecte', 'font', 'autras_formas'];
fs.writeFileSync(path.join(SORT, 'noms-locals.csv'), '﻿' + [NC.join(';'), ...noms.map((n) => NC.map((k) => q(n[k])).join(';'))].join('\n') + '\n');

// ---------- JSON ----------
const P = (kod, fr, oc, endo) => ({ kod, ...(endo ? { endo } : {}), fr, oc });
const D = [
	{ kod: 'letzebuergesch', endo: 'Lëtzebuergesch', fr: 'luxembourgeois (francique luxembourgeois)', oc: 'luxemborgés', grope: 'francique', parlars: [] },
	{ kod: 'moselfrankisch', endo: 'Moselfränkisch (Platt)', fr: 'francique mosellan', oc: 'francic mosellan', grope: 'francique', parlars: [P('nord', 'mosellan du Nord (op)', 'mosellan del Nòrd'), P('sud', 'mosellan du Sud (of)', 'mosellan del Sud')] },
	{ kod: 'rheinfrankisch', endo: 'Rheinfränkisch (Platt)', fr: 'francique rhénan', oc: 'francic renan', grope: 'francique', parlars: [P('lorrain', 'francique rhénan lorrain', 'francic renan de Lorena'), P('alsace_bossue', "francique rhénan d'Alsace bossue", "francic renan d'Alsàcia boçuda")] },
	{ kod: 'sudfrankisch', endo: 'Südfränkisch', fr: 'francique méridional (francique rhénan méridional)', oc: 'francic meridional', grope: 'francique', parlars: [] },
	{ kod: 'ripuarisch', endo: 'Ripuarisch (Platt)', fr: 'ripuaire', oc: 'ripuari', grope: 'francique', parlars: [] },
	{ kod: 'limburgisch', endo: 'Platt, Platdiets', fr: 'francique rhéno-mosan (limbourgeois)', oc: 'limborgés', grope: 'francique', parlars: [] },
	{ kod: 'niederalemannisch', endo: 'Niederalemannisch (Elsässisch)', fr: 'bas-alémanique (alsacien)', oc: 'bas alemanic (alsacian)', grope: 'alémanique',
		parlars: [P('nord', 'bas-alémanique du Nord', 'bas alemanic del Nòrd'), P('sud', 'bas-alémanique du Sud', 'bas alemanic del Sud'), P('strasbourgeois', 'strasbourgeois', 'estrasborgés', 'Strossburjerisch'),
			P('oberrhein', 'alémanique du Rhin supérieur (Bade)', 'alemanic del Rin superior', 'Oberrheinalemannisch'), P('bodensee', 'alémanique du lac de Constance', 'alemanic del lac de Constança', 'Bodenseealemannisch'), P('basel', 'bâlois', 'basilés', 'Baseldytsch')] },
	{ kod: 'hochalemannisch', endo: 'Hochalemannisch', fr: 'haut-alémanique', oc: 'naut alemanic', grope: 'alémanique', parlars: [] },
	{ kod: 'hochstalemannisch', endo: 'Höchstalemannisch', fr: 'alémanique supérieur (très haut alémanique)', oc: 'alemanic superior', grope: 'alémanique', parlars: [] },
	{ kod: 'schwabisch', endo: 'Schwäbisch', fr: 'souabe', oc: 'soabe', grope: 'alémanique', parlars: [] },
];
const compte = {};
for (const f of files) if (f.dialecte) { const k = `${f.regio}|${f.dialecte}`; compte[k] = (compte[k] || 0) + 1; }
for (const d of D) d.comunas = Object.fromEntries(Object.entries(compte).filter(([k]) => k.endsWith('|' + d.kod)).map(([k, v]) => [k.split('|')[0], v]));
const grop = {};
for (const f of files) if (f.transicio) for (const t of f.transicio.split(' ')) {
	const k = f.domeni === 'mixta' ? 'mixta' : `${f.dialecte}>${t}`;
	(grop[k] ??= []).push(f.codi);
}
const zonasTrans = Object.entries(grop).sort((a, b) => b[1].length - a[1].length).map(([k, l]) => k === 'mixta'
	? { kod: 'mixta-roman-germanic', fr: 'communes partagées entre parler roman et parler germanique', oc: 'comunas partejadas entre roman e germanic', entre: ['roman', 'germanic'], comunas: l }
	: { kod: `trans-${k.replace('>', '-')}`, fr: `${k.split('>')[0]} avec des traits de ${k.split('>')[1]}`, entre: k.split('>'), comunas: l });
const json = {
	font: "Alsacian e francic : comunas IGN Admin Express COG Carto 2026 (Licéncia dobèrta 2.0), BKG VG250-EW (© <a href=\"https://www.bkg.bund.de\" target=\"_blank\" rel=\"noopener\">BKG</a> 2026, <a href=\"https://www.govdata.de/dl-de/by-2-0\" target=\"_blank\" rel=\"noopener\">dl-de/by-2-0</a>), OFS (limits e regions lingüisticas), © contributors OpenStreetMap (ODbL) ; dialèctes d'aprèp « Sprachen in Elsass-Lothringen » (Furfur 2023, CC BY-SA 3.0, d'aprèp Rosss 2010 e lo Digitaler Wenker-Atlas), Constant This (1887), « Grenzorte des alemannischen Dialektraums » e autres articles de Wikipèdia (CC BY-SA 4.0), « Rheinischer Fächer » (Hans Erren 2021, CC BY-SA 3.0), « Alemannic-Dialects-Map » (Pyrokrat 2010, CC BY-SA 3.0) ; noms locals Wikidata (CC0) e OSM",
	a_validar: "noms dels dialèctes en occitan (oc) e en francés, noms locals (noms-locals.csv), limits a l'escala de la comuna (cartas esquematicas calibradas), comunas mixtas : propausas de validar per Romain",
	dialectes: D,
	apart: { kod: 'alsacian-franca', endo: 'Elsass un Deitsch-Lothringe', fr: 'Alsace et Moselle germanophone', oc: 'Alsàcia e Mosèla germanofòna', comunas: files.filter((f) => f.regio === 'France' && f.domeni !== 'roman').length },
	transicions: zonasTrans,
};
fs.writeFileSync(path.join(SORT, 'dialectes-alsacian.json'), JSON.stringify(json, null, '\t'));

// ---------- resumit ----------
const tab = {};
for (const f of files) { const k = `${f.regio.padEnd(12)} ${f.domeni.padEnd(9)} ${f.dialecte}`; tab[k] = (tab[k] || 0) + 1; }
console.log(Object.entries(tab).sort().map(([k, v]) => `  ${k} : ${v}`).join('\n'));
console.log(`Linhas : ${files.length} ; noms locals : ${noms.length} (${Object.entries(noms.reduce((a, n) => ({ ...a, [n.lenga]: (a[n.lenga] || 0) + 1 }), {})).map(([k, v]) => `${k} ${v}`).join(', ')}) ; transicions : ${zonasTrans.length} grops`);
