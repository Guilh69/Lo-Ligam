// Las comunas de doas lengas (retorn de Romain, 2026-10-11 : « Bayonne, on
// devrait pouvoir voir du basque, de l'occitan et du français ») : dins los
// fichièrs de comunas/, cada comuna d'una zòna de transicion entre doas lengas
// de la carta recep `lg`, las autras lengas del luòc (ids de la carta, « oc »
// per l'occitan, « picard » o « galo » quand la lenga d'oïl es precisa). La ficha de la comuna las prepausa, la lenga del luòc
// d'en primièr, puèi l'occitan, puèi lo francés.
// Referéncia : las zònas de transicion de cada lenga (app/static/data/<lenga>.json,
// `transicio` e `entre`), las meteissas que la carta ; jonhent espacial pel
// ponch de la comuna. Las autras proprietats e la geometria son pas tocadas.
//
//   node SIG/cadena/comunas-mixtas.mjs
// (relançat a la fin de comunas.mjs e de comunas-lengas.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(CADENA, '..', '..', 'app', 'static', 'data');
const COMUNAS = path.join(DATA, 'comunas');
const LENGAS = ['breton', 'cors', 'alsacian', 'francic', 'flamenc', 'arpitan', 'basc', 'catalan', 'oil'];
// los noms de l'autra lenga dins `entre` (las lengas que la carta a pas son ignoradas)
const ENTRE = { occitan: 'oc', 'oïl': 'oil', oil: 'oil', galo: 'galo', picard: 'picard' };

// (ponch dins un poligon amb sos traucs : règla de la paritat)
function dins(anels, x, y) {
	let d = false;
	for (const a of anels)
		for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
			const [xi, yi] = a[i],
				[xj, yj] = a[j];
			if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
		}
	return d;
}
const poligons = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);

// las zònas de transicion : { lengas, poligons, bbox }
const zonas = [];
for (const l of LENGAS) {
	const fic = path.join(DATA, l + '.json');
	if (!fs.existsSync(fic)) continue;
	for (const f of JSON.parse(fs.readFileSync(fic, 'utf8')).features) {
		const p = f.properties;
		if (!p.transicio || !f.geometry) continue;
		const lengas = [l, ...(p.entre ?? []).map((e) => ENTRE[e]).filter(Boolean)];
		if (new Set(lengas).size < 2) continue;
		const pols = poligons(f.geometry);
		let w = 180, s = 90, e = -180, n = -90;
		for (const pl of pols) for (const [x, y] of pl[0]) (w = Math.min(w, x)), (e = Math.max(e, x)), (s = Math.min(s, y)), (n = Math.max(n, y));
		zonas.push({ kod: l + ':' + p.kod, lengas: [...new Set(lengas)], pols, bbox: [w, s, e, n] });
	}
}

let tMarcadas = 0;
const perZona = {};
for (const f of fs.readdirSync(COMUNAS).filter((f) => f.endsWith('.json') && !/^(index|noms)/.test(f))) {
	const fic = path.join(COMUNAS, f);
	const t = JSON.parse(fs.readFileSync(fic, 'utf8'));
	const zona = path.basename(f, '.json');
	const basa = /^[a-z]+-/.test(zona) ? zona.split('-')[0] : 'oc';
	let cambiat = false;
	for (const g of Object.values(t.objects)[0].geometries) {
		const pr = g.properties,
			[x, y] = pr.p ?? [];
		let lg = [];
		if (x != null)
			for (const z of zonas) {
				const [w, s, e, n] = z.bbox;
				if (x < w || x > e || y < s || y > n || !z.pols.some((pl) => dins(pl, x, y))) continue;
				lg.push(...z.lengas);
				perZona[z.kod] = (perZona[z.kod] ?? 0) + 1;
			}
		lg = [...new Set(lg)].filter((l) => l !== basa);
		const abans = JSON.stringify(pr.lg ?? null);
		if (lg.length) pr.lg = lg;
		else delete pr.lg;
		if (JSON.stringify(pr.lg ?? null) !== abans) cambiat = true;
		if (lg.length) tMarcadas++;
	}
	if (cambiat) fs.writeFileSync(fic, JSON.stringify(t));
}
console.log(`comunas de doas lengas : ${tMarcadas}`, perZona);
