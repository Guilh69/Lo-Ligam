// Fond de carte léger du jeu « Ont es ? » (module 1.3) : les zones des
// dialectes de static/data/dialectes.geojson (carte d'Occitanica), simplifiées
// (Ramer-Douglas-Peucker) et projetées une fois pour toutes en tracés SVG.
// Le jeu n'embarque ainsi que quelques kilo-octets au lieu de la carte du site.
//
//   node scripts/contorn-occitania.mjs   → src/lib/lesson/contorn-occitania.js

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const racina = dirname(dirname(fileURLToPath(import.meta.url)));
const geo = JSON.parse(readFileSync(join(racina, 'static/data/dialectes.geojson'), 'utf8'));

const TOLERANCIA = 0.025; // en degrés (environ 2 km)
const LARGOR = 600;

function rdp(punts, tol) {
	if (punts.length < 3) return punts;
	const [a, b] = [punts[0], punts[punts.length - 1]];
	let max = 0;
	let idx = 0;
	for (let i = 1; i < punts.length - 1; i++) {
		const [x, y] = punts[i];
		const dx = b[0] - a[0];
		const dy = b[1] - a[1];
		const l = Math.hypot(dx, dy) || 1e-12;
		const d = Math.abs(dy * x - dx * y + b[0] * a[1] - b[1] * a[0]) / l;
		if (d > max) {
			max = d;
			idx = i;
		}
	}
	if (max <= tol) return [a, b];
	return [...rdp(punts.slice(0, idx + 1), tol).slice(0, -1), ...rdp(punts.slice(idx), tol)];
}

// Un anneau fermé commence et finit au même point : on le coupe en deux
// au point le plus éloigné du départ, et on simplifie chaque moitié.
function simplificarAnel(anel) {
	const [x, y] = anel[0];
	let loin = 1;
	for (let i = 1; i < anel.length; i++) if (Math.hypot(anel[i][0] - x, anel[i][1] - y) > Math.hypot(anel[loin][0] - x, anel[loin][1] - y)) loin = i;
	return [...rdp(anel.slice(0, loin + 1), TOLERANCIA).slice(0, -1), ...rdp(anel.slice(loin), TOLERANCIA)];
}

const poligons = (f) => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates);

let [mnx, mny, mxx, mxy] = [Infinity, Infinity, -Infinity, -Infinity];
for (const f of geo.features)
	for (const p of poligons(f))
		for (const [x, y] of p[0]) {
			mnx = Math.min(mnx, x);
			mxx = Math.max(mxx, x);
			mny = Math.min(mny, y);
			mxy = Math.max(mxy, y);
		}

// Projection simple (équirectangulaire corrigée à la latitude moyenne) :
// suffisante pour placer une dizaine de villes à l'échelle d'un écran.
const cosLat = Math.cos((((mny + mxy) / 2) * Math.PI) / 180);
const marge = 0.15;
const x0 = mnx - marge;
const y1 = mxy + marge;
const k = LARGOR / ((mxx - mnx + 2 * marge) * cosLat);
const nautor = Math.round((mxy - mny + 2 * marge) * k);
const proj = ([lon, lat]) => [((lon - x0) * cosLat * k).toFixed(1), ((y1 - lat) * k).toFixed(1)];

const zonas = geo.features.map((f) => {
	let d = '';
	for (const p of poligons(f)) {
		const anel = simplificarAnel(p[0]);
		if (anel.length < 4) continue; // îlots trop petits à cette échelle
		d += 'M' + anel.slice(0, -1).map((c) => proj(c).join(' ')).join('L') + 'Z';
	}
	return { kod: f.properties.kod, oc: f.properties.oc, d };
});

const sortida = `// Généré par scripts/contorn-occitania.mjs : ne pas modifier à la main.
// Zones des dialectes d'après la carte d'Occitanica (Mediatèca Occitanica).
export const vista = { largor: ${LARGOR}, nautor: ${nautor} };
export const proj = { x0: ${x0}, y1: ${y1}, cosLat: ${cosLat}, k: ${k} };
export const zonas = ${JSON.stringify(zonas, null, '\t')};
`;
writeFileSync(join(racina, 'src/lib/lesson/contorn-occitania.js'), sortida);
console.log(`${zonas.length} zones, ${sortida.length} octets, vue ${LARGOR}×${nautor}`);
