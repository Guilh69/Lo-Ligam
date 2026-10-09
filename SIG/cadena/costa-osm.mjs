// La còsta OpenStreetMap dels païses vesins de França (demanda de Romain,
// 2026-10-09 : « Monaco, l'Italie, la Belgique et tout ce qui concerne la
// proximité de la France »). Natural Earth (~1 km) bastís pas per la carta
// de prèp : los traits natural=coastline d'OSM son traçats sus las fòtos.
// Telecarga per zòna, una aprèp l'autra (pas de cargar lo servidor), dins
// SIG/brut/costa-osm/<zòna>.json (fòra Git). Licéncia ODbL (© contributors
// OpenStreetMap, ja citats sus la carta).
//
// Usatge : node SIG/cadena/costa-osm.mjs [zòna…]   (sens res : totas)
import fs from 'fs';
import { fileURLToPath } from 'url';

const SORTIDA = fileURLToPath(new URL('../brut/costa-osm/', import.meta.url));
// lo servidor principal e un miralh european (Alemanha), en cas de carga
const SERVIDORS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
// s, o, n, e
export const ZONAS = {
	belgica: [50.95, 2.4, 51.5, 3.8],
	kent: [50.85, 0.8, 51.4, 1.6],
	'illas-normandas': [49.1, -2.75, 49.8, -1.9],
	'espanha-nord': [43.2, -5.3, 43.8, -1.7],
	catalonha: [40.4, 0.0, 42.5, 3.4],
	'monegue-liguria': [43.6, 7.3, 44.5, 9.9],
	'sardenha-nord': [40.4, 8.0, 41.4, 9.9]
};

fs.mkdirSync(SORTIDA, { recursive: true });
const causidas = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ZONAS);
const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function demandar(q) {
	for (let essai = 0; essai < 6; essai++) {
		const url = SERVIDORS[essai % SERVIDORS.length];
		try {
			const r = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Lo Ligam (carta occitana)' },
				body: 'data=' + encodeURIComponent(q)
			});
			const t = await r.text();
			if (r.ok && t.startsWith('{')) return t;
			console.log(`  ${new URL(url).host} : ${r.status}, tornarai ensajar`);
		} catch (err) {
			console.log(`  ${new URL(url).host} : ${err.message}, tornarai ensajar`);
		}
		await esperar(10000 * (essai + 1));
	}
	throw new Error('Overpass respond pas');
}
for (const nom of causidas) {
	if (fs.existsSync(SORTIDA + nom + '.json')) {
		console.log(`${nom} : ja telecargat`);
		continue;
	}
	const [s, o, n, e] = ZONAS[nom];
	const t = await demandar(`[out:json][timeout:300];way["natural"="coastline"](${s},${o},${n},${e});out geom;`);
	const d = JSON.parse(t);
	fs.writeFileSync(SORTIDA + nom + '.json', t);
	console.log(`${nom} : ${d.elements.length} traits, ${Math.round(t.length / 1024)} Ko`);
	await new Promise((ok) => setTimeout(ok, 3000));
}
