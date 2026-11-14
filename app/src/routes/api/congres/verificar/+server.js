// Vérifier mot à mot de l'occitan pour l'atelier « Revirar » (2026-11-13) :
// Romain écrit une traduction, chaque mot est cherché dans lo Basic. Réservé à
// l'administrateur (comme la recherche) ; la clé reste sur le serveur.
//
//   POST /api/congres/verificar   corps : { mots: ['bonjorn', 'cossí'] }
//   (en-tête Authorization: Bearer <jeton de session>)
//   → { estat: 'ok' | 'sens-clau', mots: { bonjorn: 'ok', uèi: 'assumit', cossí: 'absent' } }
//
// 'absent' = lo Basic ne connaît pas ce mot ; 'assumit' = forme voulue par Romain
// (liste partagée avec scripts/verificar-oc.mjs) ; 'error' = lo Basic n'a pas répondu.
// Logique : verificarMots dans $lib/server/congres.js. Rien n'est gardé.
import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { verificarMots, MAX_MOTS_VERIFICAR } from '$lib/server/congres.js';
import { esAdmin } from '$lib/server/esadmin.js';

const SENS_CACHE = { 'cache-control': 'no-store' };
const MOT = /^[\p{L}]{3,40}$/u; // le point intérieur et les mots courts ne sont pas cherchés

export async function POST({ request }) {
	// en développement, la simulation de l'espace admin (?edicion=simular) n'a pas de session
	if (!dev && !(await esAdmin(request))) return json({ error: 'reservat' }, { status: 403, headers: SENS_CACHE });
	let corps;
	try {
		corps = await request.json();
	} catch {
		return json({ error: 'corps' }, { status: 400, headers: SENS_CACHE });
	}
	const mots = Array.isArray(corps?.mots) ? corps.mots.filter((m) => typeof m === 'string').map((m) => m.toLowerCase().normalize('NFC')) : [];
	const bons = [...new Set(mots.filter((m) => MOT.test(m)))];
	if (bons.length > MAX_MOTS_VERIFICAR) return json({ error: 'trop-de-mots', max: MAX_MOTS_VERIFICAR }, { status: 400, headers: SENS_CACHE });
	return json(await verificarMots(bons), { headers: SENS_CACHE });
}
