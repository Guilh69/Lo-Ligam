// Lo Ligam — « l'utilisateur courant est-il administrateur ? »
//
// Sert UNIQUEMENT à afficher ou masquer le lien vers l'espace d'administration.
// Ce n'est pas une protection : n'importe qui peut lire ce fichier et appeler
// la base directement. Ce qui protège, ce sont les politiques RLS, qui
// refusent toute écriture à qui n'est pas administrateur.
//
// La réponse vient de la fonction is_admin() de la base, qui répond oui/non
// sans jamais révéler QUI sont les administrateurs.

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase } from './supabaseClient';
import { session } from './authStore';

export const esAdmin = writable(false);

if (browser) {
	let darrièr = 0;
	session.subscribe(async (s) => {
		const marca = ++darrièr;
		if (!s) {
			esAdmin.set(false);
			return;
		}
		const { data } = await supabase.rpc('is_admin');
		// Une réponse arrivée en retard ne doit pas écraser une session plus
		// récente (déconnexion pendant que la question était en vol).
		if (marca === darrièr) esAdmin.set(data === true);
	});
}
