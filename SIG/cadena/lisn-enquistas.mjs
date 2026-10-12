// Enquêtes vocales de l'Atlas sonore des langues régionales de France (LISN,
// CNRS, Université Paris-Saclay ; licence CC BY-NC-SA 4.0) : les points
// d'enquête situés dans nos dialectes occitans ou dans le Croissant, pour le
// démonstrateur local de la couche « Enquêtes vocales » (décision de Romain,
// 2026-10-12, PILOTATGE question 9 ; le labo est favorable au projet).
//
// Le fichier produit (app/static/data/enquistas-lisn.json) n'est PAS dans Git
// (.gitignore) ni dans la version en ligne (app/scripts/levar-esbos.mjs) :
// chaque ordinateur le refabrique avec
//   node SIG/cadena/lisn-enquistas.mjs
// Les sons ne sont pas copiés : la carte les lit sur le site de l'Atlas.
//
// Le dialecte de chaque point vient de NOS tracés (dialectes.geojson,
// creissent.geojson, zonas-mixtas.geojson), pas de l'Atlas. Quand un point a
// deux graphies, la graphie classique passe en premier.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ATLAS = 'https://atlas.lisn.upsaclay.fr';
const FICHIÈRS = ['atlas', 'AtlasCH', 'AtlasG', 'AtlasBO'];
const DONADAS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'app', 'static', 'data');
const SORTIDA = path.join(DONADAS, 'enquistas-lisn.json');

const legir = (f) => JSON.parse(fs.readFileSync(path.join(DONADAS, f), 'utf8')).features;

// Point dans un polygone (tracé par rayons), trous compris
function dinsAnel(x, y, anel) {
	let dins = false;
	for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
		const [xi, yi] = anel[i],
			[xj, yj] = anel[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dins = !dins;
	}
	return dins;
}
function dins(x, y, geometria) {
	const poligons = geometria.type === 'Polygon' ? [geometria.coordinates] : geometria.coordinates;
	return poligons.some(([exterior, ...traucs]) => dinsAnel(x, y, exterior) && !traucs.some((t) => dinsAnel(x, y, t)));
}
const trobar = (features, x, y) => features.find((f) => f.geometry && dins(x, y, f.geometry));

// Les noms et libellés de l'Atlas portent parfois des espaces insécables HTML
const netejar = (s) =>
	String(s ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();

const dialèctes = legir('dialectes.geojson');
const creissent = legir('creissent.geojson');
const mixtas = legir('zonas-mixtas.geojson');

const vistes = new Set();
const ponches = [];
for (const f of FICHIÈRS) {
	const r = await fetch(`${ATLAS}/${f}.json`);
	if (!r.ok) throw new Error(`${f}.json : HTTP ${r.status}`);
	for (const p of (await r.json()).tabres ?? []) {
		const lon = Number(p.lon),
			lat = Number(p.lat);
		if (!p.soundfile || p.display === false || !Number.isFinite(lon) || !Number.isFinite(lat)) continue;
		if (vistes.has(p.soundfile)) continue;
		// le Croissant chevauche nos dialectes : un point peut être des deux
		const cro = !!trobar(creissent, lon, lat);
		const zona = trobar(dialèctes, lon, lat) ?? (cro ? creissent[0] : null);
		if (!zona) continue;
		vistes.add(p.soundfile);

		// graphie classique d'abord
		let [tx, g, tx2, g2] = [netejar(p.text), netejar(p.graphie), netejar(p.text1), netejar(p.graphie1)];
		if (/classique/i.test(g2) && !/classique/i.test(g)) [tx, g, tx2, g2] = [tx2, g2, tx, g];

		const mix = trobar(mixtas, lon, lat)?.properties;
		ponches.push({
			n: netejar(p.name),
			lon: Math.round(lon * 1e4) / 1e4,
			lat: Math.round(lat * 1e4) / 1e4,
			d: { kod: zona.properties.kod, oc: zona.properties.oc, fr: zona.properties.fr },
			...(cro && zona !== creissent[0] ? { cro: true } : {}),
			...(mix ? { mix: { oc: mix.oc, fr: mix.fr } } : {}),
			so: p.soundfile,
			...(p.soundfile1 ? { so2: p.soundfile1 } : {}),
			tx,
			...(tx2 ? { tx2, g2: g2 || null } : {})
		});
	}
}
ponches.sort((a, b) => a.n.localeCompare(b.n, 'fr'));

fs.writeFileSync(
	SORTIDA,
	JSON.stringify({
		font: `Enquêtes vocales : <a href="${ATLAS}" target="_blank" rel="noopener">Atlas sonore des langues régionales de France</a> (LISN, CNRS, Univ. Paris-Saclay), <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr" target="_blank" rel="noopener">CC BY-NC-SA</a>`,
		atlas: ATLAS,
		generat: new Date().toISOString().slice(0, 10),
		ponches
	})
);

const perDialècte = {};
for (const p of ponches) perDialècte[p.d.fr] = (perDialècte[p.d.fr] ?? 0) + 1;
console.log(`${ponches.length} points d'enquête gardés → ${path.relative(process.cwd(), SORTIDA)} (${Math.round(fs.statSync(SORTIDA).size / 1024)} Ko)`);
console.log(perDialècte);
console.log(`dont ${ponches.filter((p) => p.cro || p.d.kod === 'cro').length} dans le Croissant, ${ponches.filter((p) => p.tx2).length} en deux graphies, ${ponches.filter((p) => p.mix).length} dans une zone mixte`);
