import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase } from './supabaseClient';

export const session = writable(null);
export const authReady = writable(!browser);
// le pseudo de la personne connectée (profiles), pour l'initiale du bandeau ;
// undefined tant qu'on ne sait pas, null s'il n'y a pas de profil
export const pseudoCompte = writable(undefined);

export async function cargarPseudo(s) {
	if (!s) return pseudoCompte.set(null);
	const { data } = await supabase.from('profiles').select('pseudo').eq('user_id', s.user.id).maybeSingle();
	pseudoCompte.set(data?.pseudo ?? null);
}

if (browser) {
	supabase.auth.getSession().then(({ data }) => {
		session.set(data.session);
		authReady.set(true);
		cargarPseudo(data.session);
	});

	supabase.auth.onAuthStateChange((event, newSession) => {
		session.set(newSession);
		// hors du rappel (conseil de Supabase : une requête dedans peut bloquer)
		if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED')
			setTimeout(() => cargarPseudo(newSession), 0);
	});
}
