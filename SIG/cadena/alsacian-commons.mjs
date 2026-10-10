// Alsacian e francic : metadonadas (autor, licéncia, font, talha) de fichièrs
// de Wikimedia Commons, e telecargament se cal (--telecargar).
//
//   node SIG/cadena/alsacian-commons.mjs [--telecargar] "File:A.svg" "File:B.png"
//
// Sortida : SIG/brut/alsacian/fonts/commons.json (cumulatiu) e, amb
// --telecargar, los fichièrs dins SIG/brut/alsacian/fonts/.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.resolve(CADENA, '../brut/alsacian/fonts');
const UA = 'LoLigam-carta/1.0 (preparacion de donadas)';
const TELE = process.argv.includes('--telecargar');
const titols = process.argv.slice(2).filter((x) => !x.startsWith('--'));
const JS = path.join(FONTS, 'commons.json');
const tot = fs.existsSync(JS) ? JSON.parse(fs.readFileSync(JS, 'utf8')) : {};
const net = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const u = new URL('https://commons.wikimedia.org/w/api.php');
u.search = new URLSearchParams({ action: 'query', prop: 'imageinfo', iiprop: 'url|size|extmetadata|timestamp|user', titles: titols.join('|'), format: 'json', formatversion: '2', redirects: '1' }).toString();
const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
for (const p of j.query.pages) {
	if (!p.imageinfo) { console.log('MANCA', p.title); continue; }
	const i = p.imageinfo[0], m = i.extmetadata || {};
	const r = {
		url: i.url.split('?')[0], pagina: i.descriptionurl, talha: `${i.width}x${i.height}`, octets: i.size,
		mandaire: i.user, data: i.timestamp, licencia: m.LicenseShortName?.value, autor: net(m.Artist?.value),
		descripcion: net(m.ImageDescription?.value).slice(0, 600), font: net(m.Credit?.value).slice(0, 600),
	};
	tot[p.title] = r;
	console.log(`${p.title} | ${r.talha} ${(r.octets / 1e6).toFixed(2)} Mo | ${r.licencia} | ${r.autor} | ${r.data}\n   desc : ${r.descripcion.slice(0, 300)}\n   font : ${r.font.slice(0, 300)}`);
	if (TELE) {
		const f = path.join(FONTS, p.title.replace(/^File:/, '').replace(/[\\/:*?"<>|\s]+/g, '_'));
		const b = Buffer.from(await (await fetch(r.url, { headers: { 'User-Agent': UA } })).arrayBuffer());
		fs.writeFileSync(f, b);
		console.log(`   -> ${path.basename(f)} (${b.length} octets)`);
		await new Promise((s) => setTimeout(s, 1500));
	}
}
fs.writeFileSync(JS, JSON.stringify(tot, null, 1));
