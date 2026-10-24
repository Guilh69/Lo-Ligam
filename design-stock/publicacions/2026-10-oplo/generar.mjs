// Publication Instagram « carte OPLO 2020 » (Romain, 2026-10-24) : projette
// les contours de la vraie carte (app/static/data/limits-carta.json) en
// chemins SVG pour un visuel 1080 × 1350, et écrit carta-donadas.js, lu par
// plan-1.html (et plus tard par l'animation).
// Chiffres : SIG/oplo-2020/locutors-2020.csv (validé par Romain le 22-10).
// Lancer depuis la racine du dépôt : node design-stock/publicacions/2026-10-oplo/generar.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const racina = join(aqui, '..', '..', '..');
const limits = JSON.parse(readFileSync(join(racina, 'app/static/data/limits-carta.json'), 'utf8'));

// Taux de locuteurs (%) par département, « ND » ignoré (rien n'est indiqué)
const locs = {};
for (const l of readFileSync(join(racina, 'SIG/oplo-2020/locutors-2020.csv'), 'utf8').split(/\r?\n/).slice(1)) {
	const [code, nom, taux] = l.split(';');
	if (code && /^\d+$/.test(taux)) locs[code] = { nom, pct: +taux };
}

// Cadre de la carte dans le visuel
const CADRE = { x0: 60, y0: 320, x1: 1020, y1: 900 };

const merc = ([lon, lat]) => [lon, -Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * (180 / Math.PI)];

let b = [Infinity, Infinity, -Infinity, -Infinity];
for (const r of limits.domeni.anels)
	for (const p of r) {
		const [x, y] = merc(p);
		b = [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)];
	}
const k = Math.min((CADRE.x1 - CADRE.x0) / (b[2] - b[0]), (CADRE.y1 - CADRE.y0) / (b[3] - b[1]));
const ox = CADRE.x0 + (CADRE.x1 - CADRE.x0 - (b[2] - b[0]) * k) / 2;
const oy = CADRE.y0 + (CADRE.y1 - CADRE.y0 - (b[3] - b[1]) * k) / 2;
const px = (p) => {
	const [x, y] = merc(p);
	return [ox + (x - b[0]) * k, oy + (y - b[1]) * k];
};

// Un anneau en chemin, au dixième de pixel, sans points répétés
function cami(anels) {
	let d = '';
	for (const r of anels) {
		let prec = '';
		const pts = [];
		for (const p of r) {
			const [x, y] = px(p).map((v) => Math.round(v * 10) / 10);
			const s = `${x} ${y}`;
			if (s !== prec) pts.push(s);
			prec = s;
		}
		if (pts.length > 2) d += 'M' + pts.join('L') + 'Z';
	}
	return d;
}

const deps = limits.despartaments
	.filter(([code]) => locs[code] || code === 'ARAN')
	.map(([code, nom, anels]) => {
		const pct = code === 'ARAN' ? 62 : locs[code].pct;
		let cx = 0,
			cy = 0,
			n = 0;
		for (const p of anels[0]) {
			const [x, y] = px(p);
			cx += x;
			cy += y;
			n++;
		}
		return { code, nom, pct, d: cami(anels), c: [Math.round(cx / n), Math.round(cy / n)] };
	});

const donadas = { cadre: CADRE, domeni: cami(limits.domeni.anels), deps };
writeFileSync(join(aqui, 'carta-donadas.js'), 'window.CARTA = ' + JSON.stringify(donadas) + ';\n');
console.log(`${deps.length} départements, ${(JSON.stringify(donadas).length / 1024).toFixed(0)} ko`);
