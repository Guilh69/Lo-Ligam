// Lo Ligam — « l'utilisateur courant est-il administrateur ? »
//
// Sert à afficher ou masquer le lien vers l'espace d'administration, et à
// montrer à Romain seul les modules pas encore relus (décision du 2026-10-25).
// Ce n'est pas une protection : n'importe qui peut lire ce fichier et appeler
// la base directement. Ce qui protège, ce sont les politiques RLS, qui
// refusent toute écriture à qui n'est pas administrateur.
//
// La réponse vient de la fonction is_admin() de la base, qui répond oui/non
// sans jamais révéler QUI sont les administrateurs.

import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase } from './supabaseClient';
import { session, authReady } from './authStore';

export const esAdmin = writable(false);
// Vrai une fois la réponse connue : une page qui dépend de esAdmin attend
// ce moment au lieu d'afficher d'abord la version « pas administrateur ».
export const adminSabut = writable(!browser);

if (browser) {
	let darrièr = 0;
	const verificar = async (s) => {
		const marca = ++darrièr;
		if (!s) {
			esAdmin.set(false);
			if (get(authReady)) adminSabut.set(true);
			return;
		}
		const { data } = await supabase.rpc('is_admin');
		// Une réponse arrivée en retard ne doit pas écraser une session plus
		// récente (déconnexion pendant que la question était en vol).
		if (marca === darrièr) {
			esAdmin.set(data === true);
			adminSabut.set(true);
		}
	};
	session.subscribe(verificar);
	authReady.subscribe((pret) => {
		if (pret) verificar(get(session));
	});
}
