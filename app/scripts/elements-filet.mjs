// Lo Ligam — rafraîchit le filet de secours src/lib/data/elements-filet.json
// depuis la base (état publié), après que Romain a modifié des pages dans
// l'éditeur. Lecture publique avec la clé anonyme (app/.env, jamais affichée).
//
//   cd app && node scripts/elements-filet.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const aquí = dirname(fileURLToPath(import.meta.url));
const envPath = join(aquí, '..', '.env');
if (!existsSync(envPath)) {
	console.error('Fichier app/.env introuvable.');
	process.exit(1);
}
const env = Object.fromEntries(
	readFileSync(envPath, 'utf8')
		.split(/\r?\n/)
		.filter((l) => l.includes('=') && !l.startsWith('#'))
		.map((l) => {
			const i = l.indexOf('=');
			return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
		})
);
const url = env.PUBLIC_SUPABASE_URL,
	clau = env.PUBLIC_SUPABASE_ANON_KEY;
const r = await fetch(`${url}/rest/v1/pagina_elements?estat=eq.publicat&select=clau,pagina,tipe,lista,ordre,oc,fr,ligam,imatge,visible&order=pagina,lista,ordre,clau`, {
	headers: { apikey: clau, Authorization: `Bearer ${clau}` }
});
if (!r.ok) {
	console.error('La base ne répond pas :', r.status);
	process.exit(1);
}
const rows = await r.json();
const camin = join(aquí, '..', 'src', 'lib', 'data', 'elements-filet.json');
const filet = JSON.parse(readFileSync(camin, 'utf8'));
const perPagina = {};
for (const { pagina, ...e } of rows) {
	const net = Object.fromEntries(Object.entries(e).filter(([k, v]) => v != null && !(k === 'ordre' && v === 0) && !(k === 'visible' && v === true)));
	(perPagina[pagina] ??= []).push(net);
}
for (const [pagina, l] of Object.entries(perPagina)) filet[pagina] = l;
writeFileSync(camin, JSON.stringify(filet, null, 2).replace(/\n {4}(?=\{)/g, '\n    ') + '\n');
console.log(`Filet rafraîchi : ${rows.length} éléments, ${Object.keys(perPagina).length} page(s)`);
