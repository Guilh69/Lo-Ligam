// Alsacian e francic : telecarga lo tèxte brut (wikitèxte) d'articles de
// Wikipèdia, per los legir e los citar (fonts de las limits). Redireccions seguidas.
//
//   node SIG/cadena/alsacian-wiki.mjs de:"Deutsch-französische Sprachgrenze" fr:Alsacien
//
// Sortida : SIG/brut/alsacian/fonts/<lenga>-<títol>.wiki, amb en tèsta la
// revision (id, data) per la citacion. Tèxtes de Wikipèdia : CC BY-SA 4.0.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.resolve(CADENA, '../brut/alsacian/fonts');
const UA = 'LoLigam-carta/1.0 (preparacion de donadas)';
fs.mkdirSync(FONTS, { recursive: true });

for (const arg of process.argv.slice(2)) {
	const i = arg.indexOf(':');
	const lenga = arg.slice(0, i), titol = arg.slice(i + 1);
	const u = new URL(`https://${lenga}.wikipedia.org/w/api.php`);
	u.search = new URLSearchParams({
		action: 'query', prop: 'revisions', rvprop: 'ids|timestamp|content', rvslots: 'main',
		titles: titol, redirects: '1', format: 'json', formatversion: '2',
	}).toString();
	let j = null;
	for (let ensag = 0; ensag < 6 && !j; ensag++) {
		const t = await (await fetch(u, { headers: { 'User-Agent': UA } })).text();
		try { j = JSON.parse(t); } catch { console.log(`  ${lenga}:${titol} : ${t.slice(0, 60)} ; tòrna ensajar`); await new Promise((s) => setTimeout(s, 5000 * (ensag + 1))); }
	}
	if (!j) { console.log(`FRACAS ${lenga}:${titol}`); continue; }
	const p = j.query?.pages?.[0];
	if (!p || p.missing) { console.log(`MANCA ${lenga}:${titol}`); continue; }
	const rev = p.revisions[0];
	const nom = `${lenga}-${p.title.replace(/[\\/:*?"<>|\s]+/g, '_')}.wiki`;
	const tèsta = `<!-- ${lenga}.wikipedia.org « ${p.title} », revision ${rev.revid} del ${rev.timestamp} -->\n`;
	fs.writeFileSync(path.join(FONTS, nom), tèsta + rev.slots.main.content);
	console.log(`${nom} : ${rev.slots.main.content.length} caractèrs (rev ${rev.revid}, ${rev.timestamp})`);
	await new Promise((s) => setTimeout(s, 1500));
}
