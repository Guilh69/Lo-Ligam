// Le jeton de session est-il celui d'un administrateur ? (fonction is_admin de
// la base.) Sorti de la route de recherche pour servir aussi à la route de
// vérification mot à mot (Revirar, 2026-11-13) : les clés de lo Congrès sont
// celles de Romain, elles ne servent pas aux visiteurs.
import { env } from '$env/dynamic/public';

export async function esAdmin(request) {
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
