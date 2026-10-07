// Domaine linguistique occitan : anneaux (pour voiler l'extérieur) et limite
// TERRESTRE (les tronçons qui longent la mer sont retirés : le trait de côte
// existe déjà). Ajouté à app/static/data/limits-carta.json sous « domeni ».
import fs from 'fs';
import { COSTA } from 'file:///C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/src/lib/acuelh/carta-estelas.js';

const dir = 'C:/Users/perie/AppData/Local/Temp/claude/C--Users-perie-Documents-6-Projectes-Lo-Ligam/0e63bbde-6a7e-4082-97fe-1ae56a3855ba/scratchpad/limits/';
const sortida = 'C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/static/data/limits-carta.json';
const SEUIL_KM = Number(process.argv[2] ?? 4);

const g = JSON.parse(fs.readFileSync(dir + (process.argv[3] ?? 'domeni.geojson'), 'utf8')).features[0].geometry;
// anèls de mens de 2 km² levats : trauquets entre los contorns de las comunas
// d'Itàlia o de l'Aran e la carta Occitanica (pas de frontièra a l'entorn)
const km2 = (r) => { let x = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) x += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1]); return Math.abs(x / 2) * 111 * 111 * Math.cos((r[0][1] * Math.PI) / 180); };
const grands = (rs) => rs.filter((r) => km2(r) >= 2); // (Mónegue, ~3 km², demòra un trauc ; l'escart França / Aran, 1 km², s'en va)
const anels = grands(g.type === 'Polygon' ? g.coordinates : g.coordinates.flat());

const KX = 111 * Math.cos((44 * Math.PI) / 180), KY = 111; // km par degré
const segs = [];
for (const l of COSTA) for (let i = 1; i < l.length; i++) segs.push([l[i - 1], l[i]]);
const distSeg = (p, [a, b]) => {
	const ax = a[0] * KX, ay = a[1] * KY, bx = b[0] * KX, by = b[1] * KY, px = p[0] * KX, py = p[1] * KY;
	const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1;
	const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L));
	return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};
const costier = (p) => segs.some((s) => distSeg(p, s) < SEUIL_KM);

const linhas = [];
for (const a of anels) {
	const marc = a.map(costier);
	// chaque tronçon retient si ses bouts ont été coupés près de la mer
	let cur = [], copatDebuta = false;
	for (let i = 0; i < a.length; i++) {
		if (!marc[i]) {
			if (!cur.length) copatDebuta = i > 0 && marc[i - 1];
			cur.push(a[i]);
		} else {
			if (cur.length > 1) linhas.push(Object.assign(cur, { copat: [copatDebuta, true] }));
			cur = [];
		}
	}
	if (cur.length > 1) linhas.push(Object.assign(cur, { copat: [copatDebuta, false] }));
}
// La frontière doit TOUCHER la mer : là où un tronçon a été coupé près de la
// côte, on le prolonge jusqu'au point le plus proche du vrai trait de côte
const prochCosta = (p) => {
	let best = null, bd = Infinity;
	for (const [a, b] of segs) {
		const ax = a[0] * KX, ay = a[1] * KY, bx = b[0] * KX, by = b[1] * KY, px = p[0] * KX, py = p[1] * KY;
		const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1;
		const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L));
		const qx = ax + t * dx, qy = ay + t * dy, d = Math.hypot(px - qx, py - qy);
		if (d < bd) { bd = d; best = [+(qx / KX).toFixed(3), +(qy / KY).toFixed(3)]; }
	}
	return [best, bd];
};
for (const l of linhas) {
	for (const cap of [0, 1]) {
		if (!l.copat[cap]) continue; // bout intérieur : on ne le touche pas
		const p = cap ? l[l.length - 1] : l[0];
		const [q, d] = prochCosta(p);
		if (q && d < 18) cap ? l.push(q) : l.unshift(q);
	}
}
// Ancres côtières : là où la carte source fait toucher la mer à sa frontière
// du mauvais côté d'une ville (1 à 2 km près), le bout de la frontière est
// posé à la main sur la limite connue
// an : point posé sur la côte ; junh : sommet de la frontière où l'on rejoint
// le tracé de la carte (tout le bout de ligne entre les deux est remplacé)
const ANCRAS = [
	{ an: [3.045, 42.858], junh: [2.931, 42.865] }, // Leucata e Fitor (occitans) / Salsas (catalan)
	{ an: [-1.578, 43.458], junh: [-1.411, 43.506] } // Baiona, Anglet, Biàrritz (gascons) / Bidart (basc)
];
const dKm = (p, q) => Math.hypot((p[0] - q[0]) * 0.73, p[1] - q[1]) * 111;
for (const l of linhas)
	for (const cap of [0, 1]) {
		const fin = cap ? l.length - 1 : 0;
		for (const { an, junh } of ANCRAS) {
			if (dKm(l[fin], an) > 25) continue;
			let k = fin, bd = Infinity;
			for (let n = 0; n < Math.min(25, l.length); n++) {
				const i = cap ? l.length - 1 - n : n;
				const d = dKm(l[i], junh);
				if (d < bd) { bd = d; k = i; }
			}
			if (cap) l.splice(k + 1, l.length - k - 1, an);
			else l.splice(0, k, an);
		}
	}
// Les petits tronçons qui longent la côte sans jamais s'en éloigner (la côte
// de la carte source diffère par endroits du vrai trait de côte) ne sont pas
// la frontière : la vraie frontière terrestre part toujours vers l'intérieur
const distCosta = (p) => Math.min(...segs.map((sg) => distSeg(p, sg)));
const avans = linhas.length;
for (let i = linhas.length - 1; i >= 0; i--) if (Math.max(...linhas[i].map(distCosta)) < 8) linhas.splice(i, 1);
console.log('tronçons costièrs levats :', avans - linhas.length);
const d = JSON.parse(fs.readFileSync(sortida, 'utf8'));
// anèls : per tencher sonque la part occitanofòna dels territòris ; pres d'un
// fichièr a part se cal (version espandida fins a la vertadièra còsta)
const anelsTencha = process.argv[4] ? (() => { const h = JSON.parse(fs.readFileSync(dir + process.argv[4], 'utf8')).features[0].geometry; return grands(h.type === 'Polygon' ? h.coordinates : h.coordinates.flat()); })() : anels;
d.domeni = { anels: anelsTencha, linhas };
if (process.argv[5]) d.domeni.font = process.argv[5];
fs.writeFileSync(sortida, JSON.stringify(d));
console.log('seuil', SEUIL_KM, 'km :', d.domeni.anels.length, 'anèls,', linhas.length, 'linhas de frontièra,', linhas.reduce((s, l) => s + l.length, 0), 'ponches ;', fs.statSync(sortida).size, 'octets');
