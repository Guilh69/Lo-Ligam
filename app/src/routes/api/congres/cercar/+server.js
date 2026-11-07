// Chercher un mot pour l'outil « Pausar los mots » de Triar (07-11) : lo Basic,
// les noms de lieux de Wikidata, et Revirada quand sa clé sera là. Réservé à
// l'administrateur : les clés de lo Congrès sont celles de Romain, elles ne
// servent pas aux visiteurs.
//
//   GET /api/congres/cercar?q=nuage   (en-tête Authorization: Bearer <jeton de session>)
//   → { resultats: [{ oc: 'la nívol', fr: 'le nuage', var: 'lengadoc', font: 'basic' }],
//       estats: { basic: 'ok', wikidata: 'ok', revirada: 'sens-clau' } }
//
// Logique et règles de lo Congrès : $lib/server/congres.js.
import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { cercarTot } from '$lib/server/congres.js';

const SENS_CACHE = { 'cache-control': 'no-store' }; // rien n'est gardé (CGU de lo Congrès)

/** Le jeton est-il celui d'un administrateur ? (fonction is_admin de la base) */
async function esAdmin(request) {
	const jeton = request.headers.get('authorization')?.match(/^Bearer (\S{20,4000})$/)?.[1];
	if (!jeton || !env.PUBLIC_SUPABASE_URL) return false;
	try {
		const r = await fetch(`${env.PUBLIC_SUPABASE_URL}/rest/v1/rpc/is_admin`, {
			method: 'POST',
			headers: { apikey: env.PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${jeton}`, 'Content-Type': 'application/json' },
			body: '{}',
			signal: AbortSignal.timeout(5000)
		});
		return r.ok && (await r.json()) === true;
	} catch {
		return false;
	}
}

export async function GET({ url, request }) {
	// en développement, la simulation de l'espace admin (?edicion=simular) n'a pas de session
	if (!dev && !(await esAdmin(request))) return json({ error: 'reservat' }, { status: 403, headers: SENS_CACHE });
	const q = (url.searchParams.get('q') ?? '').trim().replace(/\s+/g, ' ').slice(0, 60);
	if (q.length < 2) return json({ resultats: [], estats: {} }, { headers: SENS_CACHE });
	const r = await cercarTot(q);
	// aucune source n'a répondu : c'est une panne, pas une absence
	const totasEnPana = Object.values(r.estats).every((e) => e !== 'ok');
	if (totasEnPana && Object.values(r.estats).includes('error')) return json({ error: 'congres', estats: r.estats }, { status: 502, headers: SENS_CACHE });
	return json(r, { headers: SENS_CACHE });
}
