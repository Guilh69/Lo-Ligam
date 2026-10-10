// Comunas de Belgica (565 dempuèi lo 1èr de genièr de 2025), contorns oficials
// del SPF Finanças (AGDP, servici INSPIRE « Administrative units », nivèl 5).
// Telecarga per paquets de 40 (lo servidor refusa tot d'un còp).
//
//   node SIG/cadena/flamenc-be-comunas.mjs
//
// Sortida : SIG/brut/flamenc/be-comunas-2025-brut.geojson (WGS84, fòra Git).
// Font : https://ccff02.minfin.fgov.be/geoservices/arcgis/rest/services/INSPIRE/AU/MapServer/1
import fs from 'fs';
import { fileURLToPath } from 'url';

const B = 'https://ccff02.minfin.fgov.be/geoservices/arcgis/rest/services/INSPIRE/AU/MapServer/1/query';
const SORTIDA = fileURLToPath(new URL('../brut/flamenc/be-comunas-2025-brut.geojson', import.meta.url));

async function json(params) {
	const u = B + '?' + new URLSearchParams(params);
	for (let i = 0; i < 5; i++) {
		const r = await fetch(u);
		const t = await r.text();
		if (r.ok && t.startsWith('{')) return JSON.parse(t);
		console.log('  error', r.status, 'tornar ensajar');
		await new Promise((ok) => setTimeout(ok, 3000));
	}
	throw new Error('servidor');
}

const ids = (await json({ where: '1=1', returnIdsOnly: 'true', f: 'json' })).objectIds.sort((a, b) => a - b);
console.log(ids.length, 'comunas');
const features = [];
for (let i = 0; i < ids.length; i += 40) {
	const lot = ids.slice(i, i + 40);
	const g = await json({
		objectIds: lot.join(','),
		outFields: 'nationalCode,id_localId,upperLevelUnit,beginLifespanVersion',
		returnGeometry: 'true',
		outSR: '4326',
		geometryPrecision: '6',
		f: 'geojson'
	});
	features.push(...g.features);
	console.log('  ', features.length);
}
fs.writeFileSync(SORTIDA, JSON.stringify({ type: 'FeatureCollection', features }));
console.log('escrich', SORTIDA);
