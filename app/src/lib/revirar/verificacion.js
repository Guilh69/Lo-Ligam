// Revirar : l'appel à la route serveur de vérification (côté navigateur).
// La clé de lo Congrès reste sur le serveur. On ne garde, le temps de l'onglet
// ouvert, que « ce mot est connu / inconnu » (aucune donnée brute de l'API).
const memoire = new Map(); // mot → 'ok' | 'absent'

/**
 * Vérifie des mots occitans ; rend { estat, mots } comme la route
 * (estat : 'ok' | 'sens-clau' | 'reservat' | 'error'). Ne lève jamais.
 */
export async function verificar(mots, jeton = '', fetchFn = fetch) {
	const uniques = [...new Set(mots)];
	const manca = uniques.filter((m) => !memoire.has(m));
	let estat = 'ok';
	if (manca.length) {
		try {
			const res = await fetchFn('/api/congres/verificar', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}) },
				body: JSON.stringify({ mots: manca })
			});
			if (res.status === 403) estat = 'reservat';
			else if (!res.ok) estat = 'error';
			else {
				const d = await res.json();
				estat = d.estat;
				for (const [m, v] of Object.entries(d.mots ?? {})) if (v === 'ok' || v === 'absent') memoire.set(m, v);
			}
		} catch {
			estat = 'error';
		}
	}
	// les mots non résolus (panne, mot en erreur) restent absents : la page les dit « indisponibles »
	return { estat, mots: Object.fromEntries(uniques.filter((m) => memoire.has(m)).map((m) => [m, memoire.get(m)])) };
}

export const oublier = () => memoire.clear();
