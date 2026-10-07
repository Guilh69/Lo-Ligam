// Dialècte de cada luòc de la carta en estelas, d'après las zònas Occitanica
// (ponch dins lo poligòn ; defòra : la zòna mai pròcha).
import fs from 'fs';
const S = 'C:/Users/perie/AppData/Local/Temp/claude/C--Users-perie-Documents-6-Projectes-Lo-Ligam/0e63bbde-6a7e-4082-97fe-1ae56a3855ba/scratchpad/occitanica/';
const F = 'C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/src/lib/acuelh/carta-estelas.js';
const g = JSON.parse(fs.readFileSync(S + 'dialectes-occitanica.geojson', 'utf8'));
const ORDRE = ['gas', 'lan', 'pro', 'lem', 'auv', 'viv'];
const pip = (p, poly) => {
	let n = 0;
	for (const r of poly)
		for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
			const [a, b] = r[i], [c, e] = r[j];
			if (b > p[1] !== e > p[1] && p[0] < ((c - a) * (p[1] - b)) / (e - b) + a) n++;
		}
	return n % 2 === 1;
};
const polys = (f) => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates);
const dSeg = (p, a, b) => {
	const k = Math.cos((p[1] * Math.PI) / 180), dx = (b[0] - a[0]) * k, dy = b[1] - a[1], px = (p[0] - a[0]) * k, py = p[1] - a[1];
	const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy || 1)));
	return Math.hypot(px - t * dx, py - t * dy);
};
const de = (p) => {
	for (const f of g.features) if (polys(f).some((q) => pip(p, q))) return [ORDRE.indexOf(f.properties.kod), 0];
	let best = -1, bd = 1e9;
	for (const f of g.features)
		for (const q of polys(f))
			for (const r of q)
				for (let i = 1; i < r.length; i++) {
					const d = dSeg(p, r[i - 1], r[i]);
					if (d < bd) { bd = d; best = ORDRE.indexOf(f.properties.kod); }
				}
	return [best, bd * 111];
};
let src = fs.readFileSync(F, 'utf8');
const m = src.match(/export const LUOCS = (\[.*?\]);\r?\n/);
const L = JSON.parse(m[1]);
const ANC = ['gascon', 'lengadocian', 'provençal', 'nòrd-occitan', 'creissent'];
const NOU = ['gascon', 'lengadocian', 'provençal', 'lemosin', 'auvernhat', 'vivaroaupenc'];
const canv = {}, defora = [], transit = [];
for (const l of L) {
	const [k, dist] = de([l[0], l[1]]);
	const clau = ANC[l[4]] + ' → ' + NOU[k];
	if (process.argv[3] && clau.includes(process.argv[3])) console.log(l[2]);
	canv[clau] = (canv[clau] || 0) + 1;
	if (dist > 0) defora.push(`${l[2]} (${dist.toFixed(1)} km → ${NOU[k]})`);
	l[4] = k;
	// zòna de transicion : una autra zòna a mens de 4 km (precision del calatge)
	l.length = 5;
	let k2 = -1, d2 = 4;
	for (const f of g.features) { const kk = ORDRE.indexOf(f.properties.kod); if (kk === k) continue; let bd = 1e9; for (const q of polys(f)) for (const r of q) for (let i = 1; i < r.length; i++) bd = Math.min(bd, dSeg([l[0], l[1]], r[i - 1], r[i]) * 111); if (bd < d2) { d2 = bd; k2 = kk; } }
	if (k2 >= 0) { l[5] = k2; transit.push(l[2] + ' ' + NOU[k] + ' / ' + NOU[k2]); }
}
// Lo Creissent (zòna de transicion oc / oïl) : sas vilas pòrtan « creissent »
// coma segond nom, al luòc d'una transicion entre dialèctes
const cro = JSON.parse(fs.readFileSync('C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/static/data/creissent.geojson', 'utf8')).features[0];
const creissent = [];
for (const l of L) if (polys(cro).some((q) => pip([l[0], l[1]], q))) { l[5] = 6; creissent.push(l[2] + ' (' + NOU[l[4]] + ')'); }
console.log(creissent.length, 'dins lo Creissent :', creissent.join(', '));
console.log(canv);
console.log('defòra del domeni :', defora.join(', '));
console.log(transit.length, 'en transicion :', transit.join(', '));
if (process.argv[2] === 'escriure') {
	src = src.replace(m[0], 'export const LUOCS = ' + JSON.stringify(L) + ';\n');
	fs.writeFileSync(F, src);
	console.log('escrich');
}
