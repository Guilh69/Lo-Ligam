// Las vilas del basc per la carta (demanda de Romain, 2026-10-09), sul modèl
// de l'arpitan e del catalan : nom basc (name:eu d'OSM), ponch, populacion, renc.
//
//   node SIG/cadena/basc-vilas.mjs
//
// França : las 158 comunas de la CAPB e Esquiule (SIG/basc/dialectes-basc.csv),
// ponch de la comuna e populacion de l'IGN (comunas-fr.geojson) ; nom basc :
// name:eu de la relacion OSM de la comuna (ref:INSEE), una requèsta Overpass.
// Espanha : los ponches place=city|town|village d'OSM de la Comunautat
// autonòma basca, de Navarra e de Treviño, amb lor populacion (etiqueta OSM).
// Populacion de la comuna (etiqueta OSM), ponch del vilatge cap-luòc.
//
// Renc : 1 = mai de 100 000 abitants, e Baiona (cap d'Iparralde) ; 2 = mai de
// 20 000, e los caps istorics (Maule, Donibane Garazi, Donapaleu, Uztaritze,
// Gernika) ; 3 = mai de 7 000 ; 4 = los autres, fins a 200 vilas en tot.
// Sortida : SIG/basc/vilas-basc.json. Donadas OSM © contributors OpenStreetMap (ODbL).
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BRUT = path.join(R, 'SIG/brut/basc');
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
const UA = 'LoLigam-carta/1.0 (preparacion de donadas)';
const MAX = 200;

function postar(url, data) {
	const cos = new URLSearchParams({ data }).toString();
	return new Promise((resolve, reject) => {
		const r = https.request(url, { method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(cos) }, timeout: 300000 }, (resp) => {
			const t = [];
			resp.on('data', (c) => t.push(c));
			resp.on('end', () => resolve({ estat: resp.statusCode, cos: Buffer.concat(t).toString('utf8') }));
		});
		r.on('timeout', () => r.destroy(new Error('temps passat')));
		r.on('error', reject);
		r.end(cos);
	});
}
async function overpass(q, fic) {
	const f = path.join(BRUT, fic);
	if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
	for (let i = 0; i < 9; i++) {
		const url = OVERPASS[i % OVERPASS.length];
		try {
			const r = await postar(url, q);
			if (r.estat === 200 && r.cos.trim().startsWith('{')) {
				fs.writeFileSync(f, r.cos);
				return JSON.parse(r.cos);
			}
			console.log(`  ${url} : ${r.estat}`);
		} catch (e) {
			console.log(`  ${url} : ${e.message}`);
		}
		await new Promise((s) => setTimeout(s, 5000 + i * 3000));
	}
	throw new Error('Overpass respond pas');
}

const csv = fs.readFileSync(path.join(R, 'SIG/basc/dialectes-basc.csv'), 'utf8').replace(/^﻿/, '').trim().split('\n');
const COL = csv[0].split(';');
const linhas = csv.slice(1).map((l) => {
	const v = [];
	let cur = '', q = false;
	for (const ch of l) {
		if (ch === '"') q = !q;
		else if (ch === ';' && !q) v.push(cur), (cur = '');
		else cur += ch;
	}
	v.push(cur);
	return Object.fromEntries(COL.map((c, i) => [c, v[i] ?? '']));
});
const DOMS = ['basc', 'mixta', 'desaparegut'];
const ES = new Set(linhas.filter((l) => l.codi.startsWith('ine:') && DOMS.includes(l.domeni)).map((l) => l.codi.slice(4)));
const FR = new Map(linhas.filter((l) => l.regio === 'France' && l.domeni === 'basc').map((l) => [l.codi, l]));

// França
const relFr = await overpass('[out:json][timeout:180];area["ISO3166-2"="FR-64"]->.a;rel(area.a)["boundary"="administrative"]["admin_level"="8"];out tags;', 'vilas-fr-osm.json');
const eu = Object.fromEntries(relFr.elements.filter((e) => e.tags?.['ref:INSEE']).map((e) => [e.tags['ref:INSEE'], e.tags['name:eu']]));
const comunas = JSON.parse(fs.readFileSync(path.join(BRUT, 'comunas-fr.geojson'), 'utf8')).features.map((f) => f.properties);
const vilas = [];
const sensEu = [];
for (const p of comunas) {
	if (!FR.has(p.insee)) continue;
	const n = eu[p.insee];
	if (!n) sensEu.push(p.nom);
	vilas.push({ nom_eu: n || p.nom, nom_oficial: p.nom, lon: p.mairie_lon, lat: p.mairie_lat, pop: p.population, estat: 'FR', font: 'IGN Admin Express 2026 (ponch, pop.) ; OSM name:eu' });
}

// Espanha
const pl = await overpass('[out:json][timeout:180];(area["ISO3166-2"="ES-PV"];area["ISO3166-2"="ES-NC"];)->.a;(node(area.a)["place"~"^(city|town|village)$"];node(42.55,-2.95,42.85,-2.45)["place"~"^(city|town|village)$"];);out body;', 'vilas-es-osm.json');
// (populacion : la de la comuna, etiqueta OSM ; ponch : lo del vilatge cap-luòc
// dins la comuna, del meteis nom, si que non lo vilatge pus poblat, si que non
// lo mitan de l'empresa de la comuna)
const norm = (x) => (x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const noms = (t) => new Set([t.name, t['name:eu'], t['name:es'], t.official_name].filter(Boolean).flatMap((n) => [n, ...n.split(/s*[/-]s*/)]).map(norm));
const dinsAnel = ([x, y], r) => {
	let c = false;
	for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
		const [xi, yi] = r[i], [xj, yj] = r[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
	}
	return c;
};
const dinsGeom = (p, g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).some((pol) => pol.reduce((c, r) => c !== dinsAnel(p, r), false));
const nòdes = pl.elements.filter((e) => e.type === 'node');
const muns = ['espanha-comunas.geojson', 'trevinho-comunas.geojson'].flatMap((fic) => JSON.parse(fs.readFileSync(path.join(BRUT, fic), 'utf8')).features).filter((x) => x.properties['ine:municipio']);
let sensNòde = 0;
for (const m of muns) {
	if (!ES.has(m.properties['ine:municipio'])) continue; // (defòra del domeni : Tutera, Miranda…)
	const t = m.properties;
	const pop = parseInt(String(t.population || '').replace(/[^0-9]/g, ''), 10) || 0;
	const n = noms(t);
	const dins = nòdes.filter((e) => dinsGeom([e.lon, e.lat], m.geometry));
	let nòde = dins.find((e) => [...noms(e.tags || {})].some((x) => n.has(x)));
	if (!nòde) nòde = dins.sort((x, y) => (parseInt(y.tags?.population, 10) || 0) - (parseInt(x.tags?.population, 10) || 0))[0];
	let lon, lat;
	if (nòde) (lon = nòde.lon), (lat = nòde.lat);
	else {
		sensNòde++;
		const pts = (m.geometry.type === 'Polygon' ? m.geometry.coordinates : m.geometry.coordinates[0])[0];
		const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
		(lon = (Math.min(...xs) + Math.max(...xs)) / 2), (lat = (Math.min(...ys) + Math.max(...ys)) / 2);
	}
	vilas.push({ nom_eu: t['name:eu'] || t.name, nom_oficial: t.name, ine: t['ine:municipio'], lon, lat, pop, estat: 'ES', font: 'OSM (comuna : name:eu, population ; ponch del vilatge cap-luòc)' });
}
console.log(`Espanha : ${muns.length} comunas, ${sensNòde} sens vilatge (mitan de l'empresa)`);

// noms basques de l'Academia quand OSM dona lo nom castelhan
const NOM_EU = { Bilbao: 'Bilbo' };
for (const v of vilas) v.nom_eu = NOM_EU[v.nom_eu] ?? v.nom_eu;
const CAP1 = ['Baiona'];
const CAP2 = ['Mauléon-Licharre', 'Saint-Jean-Pied-de-Port', 'Saint-Palais', 'Ustaritz', 'Gernika-Lumo'];
vilas.sort((a, b) => b.pop - a.pop);
const gardadas = vilas.filter((v, i) => i < MAX || CAP1.includes(v.nom_eu) || CAP2.includes(v.nom_oficial));
// Densitat (retorn de Romain, 2026-10-09 : « attention à la densité des
// villes ») : lo País Basc es pichon e plen de vilas. Coma per l'occitan (una
// o doas vilas grandas per dialècte de luènh), cada renc garda sonque las
// vilas pro luènh de las que son ja gardadas a aquel renc o al dessús ; las
// autras davalan d'un renc. Tolosa (Gipuscoa) davala al renc 3 : son nom es
// lo de Tolosa de Lengadòc, capitala de la carta.
const km = (p, q) => Math.hypot((p.lon - q.lon) * 111.32 * Math.cos((p.lat * Math.PI) / 180), (p.lat - q.lat) * 110.57);
const LUÈNH = { 1: 70, 2: 18, 3: 8 }; // (de luènh, 70 km : retorn de Romain, « trop de bruit textuel » a 70 km)
const ESTRANH = ['Tolosa'];
const vòl = (v) => (CAP1.includes(v.nom_eu) ? 1 : ESTRANH.includes(v.nom_eu) ? 3 : v.pop >= 100000 ? 1 : v.pop >= 20000 || CAP2.includes(v.nom_oficial) ? 2 : v.pop >= 7000 ? 3 : 4);
const forçat = (v) => CAP1.includes(v.nom_eu) || CAP2.includes(v.nom_oficial);
const plaçadas = [];
for (const r of [1, 2, 3]) {
	const cand = gardadas.filter((v) => !v.renc && vòl(v) <= r).sort((x, y) => forçat(y) - forçat(x) || y.pop - x.pop);
	for (const v of cand) if ((forçat(v) && vòl(v) === r) || plaçadas.every((p) => km(p, v) >= LUÈNH[r])) (v.renc = r), plaçadas.push(v);
}
for (const v of gardadas) v.renc ??= 4;
fs.writeFileSync(path.join(R, 'SIG/basc/vilas-basc.json'), '[\n' + gardadas.map((v) => JSON.stringify(v)).join(',\n') + '\n]\n');
const c = {};
for (const v of gardadas) c[v.renc] = (c[v.renc] || 0) + 1;
console.log(`vilas : ${gardadas.length} (de ${vilas.length}) ; per renc : ${JSON.stringify(c)} ; França sens name:eu : ${sensEu.length}${sensEu.length ? ' (' + sensEu.slice(0, 10).join(', ') + ')' : ''}`);
console.log('renc 1-2 : ' + gardadas.filter((v) => v.renc <= 2).map((v) => `${v.nom_eu} ${v.pop}`).join(', '));
