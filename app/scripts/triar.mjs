// Lit les choix de Romain sur /admin/triar (croix ou cœur, Romain, 2026-11-06),
// par les fonctions gardées des remarques (supabase/supabase-remarcas.sql).
//
//   cd app && node scripts/triar.mjs                 l'état de chaque lot, et les croix à traiter
//   cd app && node scripts/triar.mjs --lot dessenhs  un seul lot
//   cd app && node scripts/triar.mjs --lot releu --gardats  et la liste des clés gardées (à recopier
//                                                    dans GARDATS, lib/paisatges/releu.js)
//   cd app && node scripts/triar.mjs --clore-cors    range les paquets de cœurs (estat « tractada »),
//                                                    pour qu'ils ne chargent plus remarcas.mjs
//
// Lot « pausar » (07-11 : Romain pose lui-même les mots sur ses photos) :
//   cd app && node scripts/triar.mjs --lot pausar    chaque photo envoyée et pas encore reprise : ce qui a
//                                                    changé, les mots nouveaux (à passer à lo Congrès),
//                                                    les points trop proches pour le jeu
//   cd app && node scripts/triar.mjs --aplicar <id>  écrit les mots de cette photo dans
//                                                    lib/paisatges/paisatges.js (les mots nouveaux vont
//                                                    dans MOTS) ; seulement après la vérification de
//                                                    chaque mot nouveau (verificar-oc.mjs), et en
//                                                    corrigeant d'abord la remarque si un mot change
//   puis : node scripts/remarcas.mjs --tractar <id> --responsa "…" --autor Claude
//
// Une fois un élément refait : node scripts/remarcas.mjs --tractar <id> --responsa "ce qui a changé"
// La carte revient alors en tête du tri de Romain, avec cette réponse.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PAGINA, estatDe, comptes, legirPausats } from '../src/lib/triar/triar.js';
import { LOTS } from '../src/lib/triar/lots.js';
import { PAISATGES, MOTS } from '../src/lib/paisatges/paisatges.js';
import { cle, diferéncias, escriure } from '../src/lib/paisatges/pausar.js';

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

// ── Lot « pausar » : comparer et écrire, lib/paisatges/pausar.js ──
/** Écrit les mots d'une photo envoyée dans lib/paisatges/paisatges.js. */
function aplicar(r) {
	const p = PAISATGES.find((x) => x.clau === r.cibla);
	if (!p) throw new Error(`photo inconnue : ${r.cibla}`);
	const nous = legirPausats(r.tèxte);
	const F = join(aquí, '..', 'src', 'lib', 'paisatges', 'paisatges.js');
	const { t, novèls } = escriure(readFileSync(F, 'utf8'), p, nous, MOTS, `${new Date().toISOString().slice(0, 10)}, posés par Romain dans Triar (remarque #${r.id})`);
	writeFileSync(F, t);
	console.log(`${p.clau} : ${nous.length} mots écrits${novèls.length ? `, ${novèls.length} nouveau(x) dans MOTS : ${novèls.map((m) => m[0]).join(', ')}` : ''}.`);
	const servits = new Set(PAISATGES.filter((x) => x !== p).flatMap((x) => x.mots.map((m) => m[0])));
	for (const [oc] of nous) servits.add(cle(oc));
	const orfanèls = Object.keys(MOTS).filter((oc) => !servits.has(oc));
	if (orfanèls.length) console.log(`Plus utilisés nulle part (à retirer de MOTS, sinon le test échoue) : ${orfanèls.join(', ')}`);
	console.log(`Ensuite : npm test, puis node scripts/remarcas.mjs --tractar ${r.id} --responsa "…" --autor Claude`);
}

try {
	const totas = (await rpc('claude_legir_remarcas', { p_totas: true })).filter((r) => r.pagina === PAGINA);
	if (val('--aplicar')) {
		const r = totas.find((x) => String(x.id) === val('--aplicar') && x.extrait === 'pausar');
		if (!r) throw new Error(`pas de photo envoyée sous le numéro ${val('--aplicar')}`);
		aplicar(r);
	} else if (args.includes('--clore-cors')) {
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
			// les photos aux mots posés, pas encore reprises (lot « pausar »)
			for (const el of elements.filter((el) => estat[el.clau]?.pausats && !estat[el.clau].integrat)) {
				const e = estat[el.clau];
				console.log(`  #${e.id} ◎ ${el.clau} : ${e.pausats.length} mots`);
				for (const l of diferéncias(el.pausar, e.pausats, MOTS)) console.log(`     ${l}`);
			}
			if (args.includes('--gardats')) console.log(`  ♥ ${JSON.stringify(elements.filter((el) => estat[el.clau]?.v === 'gardar').map((el) => el.clau))}`);
		}
	}
} catch (e) {
	console.error('Échec :', e.message);
	process.exitCode = 1;
}
