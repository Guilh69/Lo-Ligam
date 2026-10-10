// Alsacian e francic : legís las taulas de l'article « Grenzorte des
// alemannischen Dialektraums » (Wikipèdia en alemand, CC BY-SA 4.0) e las
// escriu en CSV : seccion, sosseccion, luòc (comuna), nom alemand, nòta.
//
//   node SIG/cadena/alsacian-grenzorte.mjs [linha_debuta linha_fin] [--resumit]
//
// Entrada : SIG/brut/alsacian/fonts/de-Grenzorte_des_alemannischen_Dialektraums.wiki
// Sortida : SIG/brut/alsacian/grenzorte.csv
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const BRUT = path.resolve(CADENA, '../brut/alsacian');
const F = path.join(BRUT, 'fonts', 'de-Grenzorte_des_alemannischen_Dialektraums.wiki');
const linhas = fs.readFileSync(F, 'utf8').split(/\r?\n/);

// [[A|B]] -> B ; [[A]] -> A ; per la colomna del luòc, gardam la cibla del ligam (A)
const net = (s) => s.replace(/<ref[^>]*\/>/g, '').replace(/<ref[\s\S]*?<\/ref>/g, '').replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, '$2').replace(/\[\[([^\]]*)\]\]/g, '$1').replace(/'''?/g, '').replace(/\{\{[^}]*\}\}/g, '').trim();
const cibla = (s) => { const m = s.match(/\[\[([^\]|]*)/); return m ? m[1].trim() : net(s); };

const res = [];
let h2 = '', h3 = '', h4 = '', cellulas = null, n = 0;
const fin = () => { if (cellulas && cellulas.length) res.push({ h2, h3, h4, linha: n, c: cellulas }); cellulas = null; };
for (let i = 0; i < linhas.length; i++) {
	const l = linhas[i];
	let m;
	if ((m = l.match(/^(={2,4})\s*(.*?)\s*\1\s*$/))) {
		fin();
		if (m[1].length === 2) { h2 = m[2]; h3 = ''; h4 = ''; } else if (m[1].length === 3) { h3 = m[2]; h4 = ''; } else h4 = m[2];
		continue;
	}
	if (l.startsWith('|-') || l.startsWith('|}')) { fin(); continue; }
	// una linha « |a||b » o mantuna linha « |a », « |b » dins la meteissa rengada
	if (l.startsWith('|') && !l.startsWith('|+') && !l.startsWith('{|')) {
		if (!cellulas) { cellulas = []; n = i + 1; }
		cellulas.push(...l.slice(1).split('||'));
		continue;
	}
	if (cellulas && !l.startsWith('!') && l.trim()) cellulas[cellulas.length - 1] += ' ' + l;
}
fin();

const q = (s) => /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""').replace(/\n/g, ' ') + '"' : s;
const sortida = ['seccion;sosseccion;linha;luoc_ligam;luoc;nom_de;nota'];
for (const r of res) {
	const [a = '', b = '', c = ''] = r.c;
	sortida.push([r.h2, r.h3 + (r.h4 ? ' / ' + r.h4 : ''), r.linha, cibla(a), net(a), net(b), net(c)].map((x) => q(String(x))).join(';'));
}
fs.writeFileSync(path.join(BRUT, 'grenzorte.csv'), '﻿' + sortida.join('\n') + '\n');
console.log(`${res.length} luòcs escriches dins grenzorte.csv`);
const [d, f] = process.argv.slice(2).filter((x) => /^\d+$/.test(x)).map(Number);
if (d) for (const r of res) if (r.linha >= d && r.linha <= f) {
	const nota = net(r.c[2] || '');
	console.log(`${r.linha}\t${cibla(r.c[0] || '')}\t${net(r.c[1] || '')}\t${process.argv.includes('--resumit') ? nota.slice(0, 140) : nota}`);
}
