// Lit les choix de Romain sur /admin/triar (croix ou cœur, Romain, 2026-11-06),
// par les fonctions gardées des remarques (supabase/supabase-remarcas.sql).
//
//   cd app && node scripts/triar.mjs                 l'état de chaque lot, et les croix à traiter
//   cd app && node scripts/triar.mjs --lot dessenhs  un seul lot
//   cd app && node scripts/triar.mjs --clore-cors    range les paquets de cœurs (estat « tractada »),
//                                                    pour qu'ils ne chargent plus remarcas.mjs
//
// Une fois un élément refait : node scripts/remarcas.mjs --tractar <id> --responsa "ce qui a changé"
// La carte revient alors en tête du tri de Romain, avec cette réponse.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PAGINA, estatDe, comptes } from '../src/lib/triar/triar.js';
import { LOTS } from '../src/lib/triar/lots.js';

const aquí = dirname(fileURLToPath(import.meta.url));
const envPath = join(aquí, '..', '.env');
if (!existsSync(envPath)) {
	console.error('Fichier app/.env introuvable.');
	process.exit(1);
}
const env = Object.fromEntries(
	readFileSync(envPath, 'utf8')
		.split(/\r?\n/)
		.filter((l) => l.includes('=') && !l.trim().startsWith('#'))
		.map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')])
);

const args = process.argv.slice(2);
const val = (nom) => {
	const i = args.indexOf(nom);
	return i >= 0 ? args[i + 1] : undefined;
};

async function rpc(fonction, cors) {
	const r = await fetch(`${env.PUBLIC_SUPABASE_URL}/rest/v1/rpc/${fonction}`, {
		method: 'POST',
		headers: { apikey: env.PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${env.PUBLIC_SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ p_clau_secreta: env.CLAUDE_EDICION_CLAU, ...cors })
	});
	const t = await r.text();
	if (!r.ok) throw new Error(`${r.status} ${t}`);
	return JSON.parse(t);
}

try {
	const totas = (await rpc('claude_legir_remarcas', { p_totas: true })).filter((r) => r.pagina === PAGINA);
	if (args.includes('--clore-cors')) {
		const cors = totas.filter((r) => r.extrait === 'gardar' && r.estat === 'dubèrta');
		for (const r of cors) await rpc('claude_tractar_remarca', { p_id: r.id, p_estat: 'tractada', p_responsa: null });
		console.log(`${cors.length} paquet(s) de cœurs rangé(s).`);
	} else {
		for (const lot of LOTS.filter((l) => !val('--lot') || l.id === val('--lot'))) {
			const elements = lot.elements();
			const estat = estatDe(totas.filter((r) => r.modul === lot.id));
			const n = comptes(elements, estat);
			console.log(`\n■ ${lot.nom.fr} (${lot.id}) : ${elements.length - n.rèsta - n.refach} triés sur ${elements.length}`);
			console.log(`  ♥ ${n.gardar} gardés · ✕ ${n.refar} à refaire · ${n.refach} refaits en attente de Romain · ${n.rèsta} pas encore vus`);
			const refar = elements.filter((el) => estat[el.clau]?.v === 'refar');
			for (const el of refar) {
				const e = estat[el.clau];
				console.log(`  #${e.id} ✕ ${el.clau}${el.sotstitol ? ` (${el.sotstitol})` : ''}`);
				console.log(`     ${e.comentari || '(sans commentaire)'}`);
			}
		}
	}
} catch (e) {
	console.error('Échec :', e.message);
	process.exitCode = 1;
}
