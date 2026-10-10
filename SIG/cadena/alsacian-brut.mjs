// Alsacian e francic : donadas brutas dels païses vesins (demanda de Romain,
// 2026-10-10 : lo continuum alemanic e francic de l'autra man de la frontièra).
//
// Telecargaments amb l'API Overpass (OSM XML), un a l'autre, amb una pausa :
//   - soissa : comunas (admin_level 8, swisstopo:BFS_NUMMER) dels cantons
//     alemanics a mens de 150 km de França a pus près (ZH BE LU UR SZ OW NW ZG
//     FR SO BS BL SH AG TG VS JU) e lo limit d'aqueles cantons ;
//   - luxemborg : comunas del Grand Ducat (admin_level 8) e lo limit del país ;
//   - belgica : comunas (admin_level 8, ref:INS) de l'èst de la província de
//     Liège e del sud de la província de Luxemborg (empresa long. 5,55 a 6,45,
//     lat. 49,45 a 50,80).
// Alemanha : pas d'Overpass, lo VG250-EW del BKG (vejatz alsacian-geo.py).
// Forma de las requèstas coma dins arpitan-brut.mjs (« .r>; out skel qt; .r out body; »).
//
// Sortidas (ignoradas per Git) : SIG/brut/alsacian/osm/<nom>.osm.gz e
// SIG/brut/alsacian/telecargaments.json (jornal). Donadas OSM © los
// contribuidors d'OpenStreetMap, licéncia ODbL 1.0. La conversion es dins
// alsacian-geo.py.
//
// Usatge : node SIG/cadena/alsacian-brut.mjs [--tornar]
import fs from 'fs';
import path from 'path';
import https from 'https';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const BRUT = path.resolve(CADENA, '../brut/alsacian');
const OSM = path.join(BRUT, 'osm');
const JORNAL = path.join(BRUT, 'telecargaments.json');
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
const UA = 'LoLigam-carta/1.0 (preparacion de donadas)';
const BUDGET = 40e6;
const TORNAR = process.argv.includes('--tornar');
const req = (sel, pre = '') => `[out:xml][timeout:900];${pre}(${sel})->.r;.r>;out skel qt;.r out body;`;
const CANTONS = ['ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'ZG', 'FR', 'SO', 'BS', 'BL', 'SH', 'AG', 'TG', 'VS', 'JU'];

const EXTRACCIONS = [
	{
		nom: 'soissa',
		requesta: req('rel(area.a)["boundary"="administrative"]["admin_level"="8"];.k;',
			`rel["boundary"="administrative"]["admin_level"="4"]["ISO3166-2"~"^CH-(${CANTONS.join('|')})$"]->.k;.k map_to_area->.a;`),
	},
	{
		nom: 'luxemborg',
		requesta: req('rel(area.a)["boundary"="administrative"]["admin_level"="8"];rel(2171347);', 'rel(2171347);map_to_area->.a;'),
	},
	{
		nom: 'belgica',
		requesta: req('rel(area.a)["boundary"="administrative"]["admin_level"="8"]["ref:INS"](49.45,5.55,50.80,6.45);', 'rel(52411);map_to_area->.a;'),
	},
];

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const mo = (n) => (n / 1e6).toFixed(2) + ' Mo';
const lire = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
function postar(url, data) {
	const cos = new URLSearchParams({ data }).toString();
	return new Promise((resolve, reject) => {
		const r = https.request(url, {
			method: 'POST',
			headers: { 'User-Agent': UA, 'Accept-Encoding': 'gzip', 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(cos) },
			timeout: 960000,
		}, (resp) => {
			const t = [];
			resp.on('data', (c) => t.push(c));
			resp.on('end', () => resolve({ estat: resp.statusCode, gzip: resp.headers['content-encoding'] === 'gzip', cos: Buffer.concat(t) }));
			resp.on('error', reject);
		});
		r.on('timeout', () => r.destroy(new Error('temps passat')));
		r.on('error', reject);
		r.end(cos);
	});
}
let transferit = 0, servidor = 0;
async function overpass(requesta) {
	for (let ensag = 0; ensag < 10; ensag++) {
		if (transferit > BUDGET) throw new Error(`Budgèt de ${mo(BUDGET)} despassat : arrèst.`);
		const n = (servidor + ensag) % OVERPASS.length, url = OVERPASS[n];
		try {
			const r = await postar(url, requesta);
			transferit += r.cos.length;
			const gz = r.gzip ? r.cos : zlib.gzipSync(r.cos);
			const xml = zlib.gunzipSync(gz).toString('utf8');
			const ok = r.estat === 200 && xml.startsWith('<?xml') && /<\/osm>\s*$/.test(xml) && !xml.includes('<remark>');
			if (!ok) throw new Error(`${r.estat} ${xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 160)}`);
			servidor = n;
			const compte = (re) => (xml.match(re) || []).length;
			return { gz, servidor: url, data: new Date().toISOString(), octets_transferits: r.cos.length, octets_xml: Buffer.byteLength(xml),
				nosels: compte(/<node /g), camins: compte(/<way /g), relacions: compte(/<relation /g), osm_base: (xml.match(/<meta osm_base="([^"]+)"/) || [])[1] };
		} catch (e) {
			console.log(`  Overpass (${url}), ensag ${ensag + 1} : ${e.message}`);
			await pausa(8000 + ensag * 5000);
		}
	}
	throw new Error('Overpass respond pas.');
}

fs.mkdirSync(OSM, { recursive: true });
const jornal = lire(JORNAL, { licencia: "ODbL 1.0, © los contribuidors d'OpenStreetMap", extraccions: {} });
for (const e of EXTRACCIONS) {
	const f = path.join(OSM, e.nom + '.osm.gz');
	if (fs.existsSync(f) && !TORNAR) { console.log(`${e.nom} : ja aquí`); continue; }
	console.log(`${e.nom} : requèsta…`);
	const r = await overpass(e.requesta);
	fs.writeFileSync(f, r.gz);
	const { gz, ...info } = r;
	jornal.extraccions[e.nom] = { requesta: e.requesta, ...info };
	console.log(`  ${mo(info.octets_transferits)} (${mo(info.octets_xml)} en XML), ${info.relacions} relacions ; total ${mo(transferit)}`);
	fs.writeFileSync(JORNAL, JSON.stringify(jornal, null, '\t'));
	await pausa(5000);
}
