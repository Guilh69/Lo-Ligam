// Couche « Comunas » de la carte /carta : communes du domaine de la langue,
// un fichier TopoJSON par département (plus ARAN et IT), avec nom officiel,
// nom occitan, point de la mairie et population.
//
// Lancer depuis n'importe où :  node SIG/cadena/comunas.mjs
// Étapes (chacune saute ce qui est déjà téléchargé dans SIG/brut/comunas/) :
//   1. téléchargements : IGN ADMIN EXPRESS COG CARTO 2026 (archive 7z, on n'en
//      garde que le GeoPackage), BdTopoc 2023 de l'IEO, communes OSM du Val
//      d'Aran et des vallées d'Italie (Overpass) ;
//   2. comunas.py seleccion : communes dont au moins 50 % de la surface est dans
//      le domaine (app/static/data/limits-carta.json, domeni.anels), mairies ;
//   3. noms OSM (name:oc) des communes françaises, une requête par département ;
//   4. noms occitans : OSM name:oc, sinon BdTopoc, sinon rien ; liste des
//      désaccords et des manques pour Romain (SIG/comunas/noms-a-validar.csv) ;
//   5. simplification topologique (mapshaper, 20 m) et découpe par département ;
//   6. écriture de app/static/data/comunas/<dep>.json et index.json ;
//   7. comunas.py verificar : géométries valides, ni trou ni chevauchement.
// « --sens-noms-osm » : pas de noms OSM pels departaments pas encara telecargats.
// Options : « --sens-telecargar » n'interroge aucun serveur (échoue s'il manque
// un fichier) ; « --tornar-osm » retélécharge les noms OSM.
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const BRUT = path.resolve(CADENA, '../brut/comunas');
const TRABALH = path.join(BRUT, 'trabalh');
const OSM = path.join(BRUT, 'osm');
const REVISION = path.resolve(CADENA, '../comunas');
const SORTIDA = path.resolve(CADENA, '../../app/static/data/comunas');
const QGIS_PY = process.env.QGIS_PYTHON ?? 'C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat';
const MAPSHAPER = 'npx -y mapshaper@0.7.80';
// Simplification Douglas-Peucker à 20 m (écart garanti, 0,4 pixel au zoom 11),
// coordonnées réduites à une grille de 50 000 pas par département (2 à 3 m).
const QUANTIF = 50000;
const SENS_TELECARGAR = process.argv.includes('--sens-telecargar');
const TORNAR_OSM = process.argv.includes('--tornar-osm');
// sens los noms OSM (Romain, 2026-10-07 : los contorns sols bastan, los noms
// son ja sul fons OpenStreetMap) : sonque los departaments ja telecargats
const SENS_NOMS_OSM = process.argv.includes('--sens-noms-osm');

const IGN_7Z = 'ADMIN-EXPRESS-COG-CARTO_4-0__GPKG_LAMB93_FXX_2026-01-01.7z';
const IGN_URL = `https://data.geopf.fr/telechargement/download/ADMIN-EXPRESS-COG-CARTO/ADMIN-EXPRESS-COG-CARTO_4-0__GPKG_LAMB93_FXX_2026-01-01/${IGN_7Z}`;
const GPKG = 'ADE-COG-CARTO_2026.gpkg';
const BDTOPOC = 'bdtopoc-2023.csv';
const BDTOPOC_URL = 'https://static.data.gouv.fr/resources/basa-de-donadas-noms-de-lespaci-occitan-base-de-donnees-nom-de-lespace-occitan/20231116-105526/bdtopoc-2023.csv';
// Serveurs Overpass essayés à tour de rôle (le premier est souvent saturé).
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
const Q_ARAN = '[out:json][timeout:180];rel(2810776);map_to_area->.a;rel(area.a)["boundary"="administrative"]["admin_level"="8"];out geom;';
const Q_IT = '[out:json][timeout:300];rel["boundary"="administrative"]["admin_level"="8"]["ref:ISTAT"](44.0,6.6,45.25,7.8);out geom;';
const Q_DEP = (d, [w, s, e, n]) => `[out:json][timeout:180];rel["boundary"="administrative"]["admin_level"="8"]["ref:INSEE"~"^${d}"](${s - 0.02},${w - 0.02},${n + 0.02},${e + 0.02});out tags;`;

export const FONT = 'Communes : IGN Admin Express COG Carto 2026 (Licence Ouverte 2.0) ; Aran et Italie, noms occitans : contributeurs OpenStreetMap, IEO BdTopoc 2023 (ODbL)';

const lire = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const existe = (f) => fs.existsSync(f) && fs.statSync(f).size > 0;
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const sh = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });

async function telecargar(url, fichier, opcions = {}) {
	if (existe(fichier)) return;
	if (SENS_TELECARGAR) throw new Error(`Fichier absent : ${fichier}`);
	console.log('Téléchargement', url);
	const r = await fetch(url, opcions);
	if (!r.ok) throw new Error(`${url} : ${r.status}`);
	fs.writeFileSync(fichier + '.part', Buffer.from(await r.arrayBuffer()));
	fs.renameSync(fichier + '.part', fichier);
}

// Overpass est souvent saturé : on alterne les serveurs et on réessaie, en
// repartant du dernier serveur qui a répondu.
let servidor = 0;
async function overpass(requete, fichier, forcar = false) {
	if (!forcar && existe(fichier)) {
		try { return lire(fichier); } catch { /* réponse d'erreur enregistrée : on retélécharge */ }
	}
	if (SENS_TELECARGAR) throw new Error(`Fichier absent : ${fichier}`);
	for (let essai = 0; essai < 18; essai++) {
		const n = (servidor + essai) % OVERPASS.length, url = OVERPASS[n];
		try {
			const r = await fetch(url, { method: 'POST', body: new URLSearchParams({ data: requete }), headers: { 'User-Agent': 'LoLigam-carta/1.0 (preparacion de donadas)' }, signal: AbortSignal.timeout(320000) });
			const t = await r.text();
			if (r.ok && t.startsWith('{')) {
				const j = JSON.parse(t);
				if (j.remark && /error|timed out/i.test(j.remark)) throw new Error(j.remark);
				fs.writeFileSync(fichier, t);
				servidor = n;
				return j;
			}
			throw new Error(`${r.status} ${t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 160)}`);
		} catch (e) {
			console.log(`  Overpass (${url}), essai ${essai + 1} : ${e.message}`);
			await pausa(5000 + essai * 3000);
		}
	}
	throw new Error('Overpass ne répond pas : ' + fichier);
}

function python(...args) {
	sh(`"${QGIS_PY}" "${path.join(CADENA, 'comunas.py')}" ${args.join(' ')}`);
}

// ---------- 4. Noms occitans ----------
const norm = (s) => (s ?? '').normalize('NFC').replace(/[’ʼ]/g, "'").replace(/\s+/g, ' ').trim();

// Nom français réduit pour comparer (sans accents, casse ni ponctuation).
const clauFr = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// CSV « ; » avec champs entre guillemets (qui peuvent contenir « ; » et des retours à la ligne).
function lireCsv(texte, sep = ';') {
	const linhas = [];
	let l = [], c = '', cometas = false;
	for (let i = 0; i < texte.length; i++) {
		const ch = texte[i];
		if (cometas) {
			if (ch === '"' && texte[i + 1] === '"') { c += '"'; i++; }
			else if (ch === '"') cometas = false;
			else c += ch;
		} else if (ch === '"' && c === '') cometas = true;
		else if (ch === sep) { l.push(c); c = ''; }
		else if (ch === '\n' || ch === '\r') {
			if (ch === '\r' && texte[i + 1] === '\n') i++;
			l.push(c); linhas.push(l); l = []; c = '';
		} else c += ch;
	}
	if (c !== '' || l.length) { l.push(c); linhas.push(l); }
	return linhas;
}

// BdTopoc : pour chaque code INSEE, les lignes « comuna » { oc, fr } (codes de 2023).
function lireBdtopoc() {
	const m = new Map();
	const [cap, ...linhas] = lireCsv(fs.readFileSync(path.join(BRUT, BDTOPOC), 'utf8'));
	const k = Object.fromEntries(cap.map((c, i) => [c.trim(), i]));
	for (const c of linhas) {
		if (c[k.GEO] !== 'comuna') continue;
		const id = (c[k.ID] ?? '').trim();
		if (!/^(\d\d|2[AB])\d{3}$/.test(id)) continue; // quelques lignes portent un code de département
		const oc = norm(c[k.NOM_OC]);
		if (!oc) continue;
		if (!m.has(id)) m.set(id, []);
		if (!m.get(id).some((x) => x.oc === oc && x.fr === c[k.NOM_FORESTIER])) m.get(id).push({ oc, fr: (c[k.NOM_FORESTIER] ?? '').trim() });
	}
	return m;
}

const csv = (v) => {
	const s = v == null ? '' : String(v);
	return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

// ---------- programme ----------
async function principal() {
	for (const d of [BRUT, TRABALH, OSM, REVISION, SORTIDA]) fs.mkdirSync(d, { recursive: true });

	// 1. Téléchargements
	if (!existe(path.join(BRUT, GPKG))) {
		await telecargar(IGN_URL, path.join(BRUT, IGN_7Z));
		// tar de Windows (bsdtar, libarchive) sait lire le 7z ; ailleurs, 7z.
		const tar = process.platform === 'win32' ? 'C:/Windows/System32/tar.exe' : null;
		const dins = path.join(TRABALH, 'ign');
		fs.mkdirSync(dins, { recursive: true });
		if (tar) sh(`"${tar}" -xf "${path.join(BRUT, IGN_7Z)}" -C "${dins}" "*.gpkg"`);
		else sh(`7z e -o"${dins}" "${path.join(BRUT, IGN_7Z)}" "*.gpkg" -r`);
		const trobat = fs.readdirSync(dins, { recursive: true }).find((f) => String(f).endsWith('.gpkg'));
		fs.renameSync(path.join(dins, trobat), path.join(BRUT, GPKG));
		fs.rmSync(dins, { recursive: true, force: true });
	}
	await telecargar(BDTOPOC_URL, path.join(BRUT, BDTOPOC));
	await overpass(Q_ARAN, path.join(BRUT, 'comunas-aran.json'));
	await overpass(Q_IT, path.join(BRUT, 'comunas-it.json'));

	// 2. Sélection des communes du domaine (GDAL)
	python('seleccion');
	const atributs = lire(path.join(TRABALH, 'atributs.json')); // { code: { d, fr, pop, p, part, oc_osm? } }

	// 3. Noms OSM des communes françaises, par département
	const deps = {};
	for (const [i, a] of Object.entries(atributs)) {
		if (a.d === 'ARAN' || a.d === 'IT') continue;
		const b = (deps[a.d] ??= [180, 90, -180, -90]);
		b[0] = Math.min(b[0], a.bbox[0]); b[1] = Math.min(b[1], a.bbox[1]);
		b[2] = Math.max(b[2], a.bbox[2]); b[3] = Math.max(b[3], a.bbox[3]);
	}
	const osm = new Map();
	for (const [d, b] of Object.entries(deps).sort()) {
		if (SENS_NOMS_OSM && !fs.existsSync(path.join(OSM, d + '.json'))) continue;
		const j = await overpass(Q_DEP(d, b), path.join(OSM, d + '.json'), TORNAR_OSM);
		for (const e of j.elements) {
			const t = e.tags ?? {};
			if (!t['ref:INSEE'] || osm.has(t['ref:INSEE'])) continue;
			osm.set(t['ref:INSEE'], { name: t.name, oc: t['name:oc'] });
		}
	}

	// 4. Noms occitans : OSM name:oc, sinon BdTopoc, sinon null.
	// BdTopoc date de 2023 : une commune nouvelle a souvent repris le code d'une
	// ancienne commune. On ne prend donc son nom que si son nom français est
	// celui de la commune 2026 ; sinon il est seulement montré à Romain, avec le
	// nom français de la fiche BdTopoc entre parenthèses.
	const bdt = lireBdtopoc();
	const revision = [['i', 'fr', 'oc_osm', 'oc_bdtopoc', 'retengut', 'motiu']];
	const sources = { osm: 0, bdtopoc: 0, aran: 0 };
	for (const [i, a] of Object.entries(atributs)) {
		let o = null, lignes = [], memes = [];
		if (a.d === 'ARAN' || a.d === 'IT') o = a.oc_osm ? norm(a.oc_osm) : null;
		else {
			o = osm.get(i)?.oc ? norm(osm.get(i).oc) : null;
			lignes = bdt.get(i) ?? [];
			memes = [...new Set(lignes.filter((x) => clauFr(x.fr) === clauFr(a.fr)).map((x) => x.oc))];
		}
		a.oc = o ?? memes[0] ?? null;
		if (o) sources.osm++; else if (memes[0]) sources.bdtopoc++;
		// Aran : le nom officiel est déjà aranais (occitan) ; on le garde quand OSM n'a pas de name:oc.
		if (a.d === 'ARAN' && !a.oc) { a.oc = a.fr; sources.aran++; }
		const autres = lignes.filter((x) => clauFr(x.fr) !== clauFr(a.fr));
		const colBdt = [...memes, ...autres.map((x) => `${x.oc} (BdTopoc : ${x.fr})`)].join(' / ');
		let motiu = null;
		if (!a.oc) motiu = 'mancant';
		else if (o && lignes.length && !lignes.some((x) => x.oc === o)) motiu = 'desacòrd';
		else if (!o && memes.length > 1) motiu = 'desacòrd';
		if (motiu) revision.push([i, a.fr, o, colBdt, a.oc, motiu]);
	}
	console.log('Noms occitans retenus :', sources);
	const capRev = revision.shift();
	revision.sort((x, y) => (atributs[x[0]].d + x[0]).localeCompare(atributs[y[0]].d + y[0]));
	fs.writeFileSync(path.join(REVISION, 'noms-a-validar.csv'), [capRev, ...revision].map((r) => r.map(csv).join(';')).join('\n') + '\n');

	// 5. Simplification topologique et découpe (mapshaper)
	const topo = path.join(TRABALH, 'topo');
	fs.rmSync(topo, { recursive: true, force: true });
	fs.mkdirSync(topo, { recursive: true });
	sh(`${MAPSHAPER} -i "${path.join(TRABALH, 'comunas-sel.geojson')}" -simplify dp interval=20 keep-shapes -split d -o "${topo}/" format=topojson singles quantization=${QUANTIF}`, {
		env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' }
	});

	// 6. Fichiers de la carte
	// (sonque los fichièrs d'aquesta cadena : los noms e las autras lengas,
	// noms*.json, index-lengas.json e <lenga>-<zòna>.json, demòran)
	for (const f of fs.readdirSync(SORTIDA)) if (/^(\d\d|2A|2B|ARAN|IT|index)\.json$/.test(f)) fs.rmSync(path.join(SORTIDA, f));
	const index = { font: FONT, deps: [] };
	const r4 = (x) => Math.round(x * 1e4) / 1e4;
	const estat = [];
	for (const f of fs.readdirSync(topo).filter((f) => f.endsWith('.json')).sort()) {
		const t = lire(path.join(topo, f));
		const [nomObj] = Object.keys(t.objects);
		const obj = t.objects[nomObj];
		const d = path.basename(f, '.json');
		let w = 180, s = 90, e = -180, n = -90, ambOc = 0;
		for (const g of obj.geometries) {
			const a = atributs[g.properties.i];
			g.properties = { i: g.properties.i, fr: a.fr, oc: a.oc ?? null, p: a.p, pop: a.pop ?? 0 };
			if (a.oc) ambOc++;
			w = Math.min(w, a.bbox[0]); s = Math.min(s, a.bbox[1]); e = Math.max(e, a.bbox[2]); n = Math.max(n, a.bbox[3]);
		}
		const sortida = { type: 'Topology', transform: t.transform, objects: { comunas: { type: 'GeometryCollection', geometries: obj.geometries } }, arcs: t.arcs };
		const texte = JSON.stringify(sortida);
		fs.writeFileSync(path.join(SORTIDA, d + '.json'), texte);
		const ko = Buffer.byteLength(texte) / 1024;
		const kogz = zlib.gzipSync(texte, { level: 9 }).length / 1024;
		index.deps.push({ d, bbox: [r4(w), r4(s), r4(e), r4(n)], n: obj.geometries.length, ko: Math.round(ko) });
		estat.push({ d, n: obj.geometries.length, oc: ambOc, ko: ko.toFixed(1), kogz: kogz.toFixed(1) });
	}
	fs.writeFileSync(path.join(SORTIDA, 'index.json'), JSON.stringify(index));

	// 7. Contrôle des géométries
	python('verificar');

	console.log('\nDép.  communes  avec nom oc   Ko    Ko gzip');
	let tn = 0, toc = 0, tko = 0, tgz = 0;
	for (const x of estat) {
		console.log(`${x.d.padEnd(5)} ${String(x.n).padStart(8)} ${String(x.oc).padStart(6)} (${Math.round((100 * x.oc) / x.n)} %) ${x.ko.padStart(7)} ${x.kogz.padStart(7)}`);
		tn += x.n; toc += x.oc; tko += +x.ko; tgz += +x.kogz;
	}
	console.log(`total ${tn} communes, ${toc} avec nom occitan (${Math.round((100 * toc) / tn)} %), ${Math.round(tko)} Ko, ${Math.round(tgz)} Ko gzip`);
	console.log(`Liste pour Romain : ${revision.length} lignes dans SIG/comunas/noms-a-validar.csv`);
	fs.writeFileSync(path.join(TRABALH, 'estat.json'), JSON.stringify(estat, null, 1));
}

principal().catch((e) => { console.error(e); process.exit(1); });
