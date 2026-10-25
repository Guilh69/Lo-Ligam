// Lo Ligam — Claude lit les remarques de relecture posées sur les pages
// (Romain, 2026-10-25, option A) et les marque traitées une fois la
// correction faite. Par les fonctions gardées de supabase/supabase-remarcas.sql ;
// clé dans app/.env (CLAUDE_EDICION_CLAU), jamais affichée.
//
//   cd app && node scripts/remarcas.mjs                 les remarques ouvertes
//   cd app && node scripts/remarcas.mjs --totas         toutes, traitées comprises
//   cd app && node scripts/remarcas.mjs --tractar 12 [--responsa "…"]
//   cd app && node scripts/remarcas.mjs --escartar 12 [--responsa "…"]
//
// La réponse est lue par Romain dans la bulle de la remarque.
import { readFileSync, existsSync } from 'node:fs';
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

const args = process.argv.slice(2);
const val = (nom) => {
	const i = args.indexOf(nom);
	return i >= 0 ? args[i + 1] : undefined;
};

async function rpc(fonction, cors) {
	const r = await fetch(`${env.PUBLIC_SUPABASE_URL}/rest/v1/rpc/${fonction}`, {
		method: 'POST',
		headers: {
			apikey: env.PUBLIC_SUPABASE_ANON_KEY,
			Authorization: `Bearer ${env.PUBLIC_SUPABASE_ANON_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ p_clau_secreta: env.CLAUDE_EDICION_CLAU, ...cors })
	});
	const t = await r.text();
	if (!r.ok) throw new Error(`${r.status} ${t}`);
	return JSON.parse(t);
}

const accion = args.includes('--tractar') ? 'tractada' : args.includes('--escartar') ? 'escartada' : null;
try {
	if (accion) {
		const id = Number(val(accion === 'tractada' ? '--tractar' : '--escartar'));
		const n = await rpc('claude_tractar_remarca', { p_id: id, p_estat: accion, p_responsa: val('--responsa') ?? null });
		console.log(n ? `Remarque ${id} : ${accion}.` : `Remarque ${id} introuvable.`);
	} else {
		const totas = await rpc('claude_legir_remarcas', { p_totas: args.includes('--totas') });
		if (!totas.length) console.log('Aucune remarque ouverte.');
		let modul = null;
		for (const r of totas) {
			if (r.modul !== modul) {
				modul = r.modul;
				console.log(`\n■ ${modul ? `Module ${modul.replace('-', '.')}` : r.pagina}`);
			}
			const ont = [r.etapa != null ? `étape ${r.etapa + 1}` : 'sommaire', r.bloc != null ? `exercice ${r.bloc + 1}` : null, r.cibla].filter(Boolean).join(' · ');
			console.log(`  #${r.id} [${r.estat}] ${ont}${r.autor ? ` (${r.autor})` : ''}`);
			if (r.extrait) console.log(`     sur : « ${r.extrait} »`);
			console.log(`     ${r.tèxte}`);
			if (r.responsa) console.log(`     réponse : ${r.responsa}`);
		}
	}
} catch (e) {
	console.error('Échec :', e.message);
	process.exitCode = 1;
}
