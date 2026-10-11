// Las comunas de las autras lengas de la carta, coma las del domeni occitan
// (comunas.mjs) : un fichièr TopoJSON per zòna (lenga-despartament o
// lenga-país), amb nom oficial, nom local, ponch e populacion, e un indèx a
// despart (comunas/index-lengas.json), per que la jaça « Comunas » e la
// seleccion d'una comuna (contornComuna.js) cobrisson totas las zònas (Romain,
// 2026-10-11 : « dès qu'on couvre une nouvelle zone il faut qu'elle soit
// ouverte avec le même package que les autres »).
//
//   node SIG/cadena/comunas-lengas.mjs
// Etapas : 1. comunas-lengas.py (seleccion, noms, ponches) ; 2. mapshaper
// (simplificacion topologica, 20 m ; decopa per zòna) ; 3. fichièrs de la carta.
// Los fichièrs del domeni occitan (comunas.mjs) son pas tocats.
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const TRABALH = path.resolve(CADENA, '../brut/comunas/trabalh');
const SORTIDA = path.resolve(CADENA, '../../app/static/data/comunas');
const MAPSHAPER = 'npx -y mapshaper@0.7.80';
const QUANTIF = 50000;
const PYTHON = '"C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s -u -P';
const FONT =
	"Comunas : IGN Admin Express COG Carto 2026 (Licence Ouverte 2.0) ; Soïssa, Alemanha, Luxemborg, Belgica, Païses Basses, Itàlia, Espanha : instituts nacionals e contributors OpenStreetMap (ODbL) ; noms locals : veire noms-lengas.json";
const sh = (c, o = {}) => execSync(c, { stdio: 'inherit', ...o });

// 1. Seleccion
if (!process.argv.includes('--sens-seleccion')) sh(`${PYTHON} "${path.join(CADENA, 'comunas-lengas.py')}"`);
const entrada = path.join(TRABALH, 'comunas-lengas.geojson');
const atributs = {};
for (const f of JSON.parse(fs.readFileSync(entrada, 'utf8')).features) atributs[f.properties.i] = f.properties;

// 2. Simplificacion topologica e decopa
const topo = path.join(TRABALH, 'topo-lengas');
fs.rmSync(topo, { recursive: true, force: true });
fs.mkdirSync(topo, { recursive: true });
sh(`${MAPSHAPER} -i "${entrada}" -simplify dp interval=20 keep-shapes -split d -o "${topo}/" format=topojson singles quantization=${QUANTIF}`, {
	env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' }
});

// 3. Fichièrs de la carta (sonque los de las autras lengas : « lenga-zòna.json »)
const LENGAS = ['breton', 'cors', 'alsacian', 'francic', 'flamenc', 'arpitan', 'basc', 'catalan', 'oil'];
for (const f of fs.readdirSync(SORTIDA)) if (LENGAS.some((l) => f.startsWith(l + '-')) && f.endsWith('.json')) fs.rmSync(path.join(SORTIDA, f));
const index = { font: FONT, deps: [] };
const r4 = (x) => Math.round(x * 1e4) / 1e4;
let tKo = 0,
	tGz = 0,
	tN = 0;
for (const f of fs.readdirSync(topo).filter((f) => f.endsWith('.json')).sort()) {
	const t = JSON.parse(fs.readFileSync(path.join(topo, f), 'utf8'));
	const obj = Object.values(t.objects)[0];
	const d = path.basename(f, '.json');
	let w = 180, s = 90, e = -180, n = -90;
	for (const g of obj.geometries) {
		const a = atributs[g.properties.i];
		g.properties = { i: a.i, fr: a.fr, oc: a.oc ?? null, p: a.p, pop: a.pop ?? 0 };
		w = Math.min(w, a.bb[0]); s = Math.min(s, a.bb[1]); e = Math.max(e, a.bb[2]); n = Math.max(n, a.bb[3]);
	}
	const texte = JSON.stringify({ type: 'Topology', transform: t.transform, objects: { comunas: { type: 'GeometryCollection', geometries: obj.geometries } }, arcs: t.arcs });
	fs.writeFileSync(path.join(SORTIDA, d + '.json'), texte);
	const ko = Buffer.byteLength(texte) / 1024,
		gz = zlib.gzipSync(texte, { level: 9 }).length / 1024;
	index.deps.push({ d, bbox: [r4(w), r4(s), r4(e), r4(n)], n: obj.geometries.length, ko: Math.round(ko) });
	tKo += ko;
	tGz += gz;
	tN += obj.geometries.length;
}
fs.writeFileSync(path.join(SORTIDA, 'index-lengas.json'), JSON.stringify(index));
console.log(`${index.deps.length} zònas, ${tN} comunas, ${Math.round(tKo)} Ko (${Math.round(tGz)} Ko compressats)`);
// 4. Las comunas de doas lengas (comunas-mixtas.mjs)
await import('./comunas-mixtas.mjs');
