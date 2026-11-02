// Où vit l'avancement : aux mêmes endroits que l'écrit la page module
// (/aprene/modul/[modulId]). Pour un compte, la table lesson_progress (une
// ligne par module : le masque des étapes faites dans word_index, les
// fogassas dans points) ; sans compte, la mémoire du navigateur (clé
// lo-ligam-<id du module>-progress). La ligne « module-1 » et la clé
// lo-ligam-module-1-done de l'ancien essai ne servent plus.
import { get } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { session, authReady } from '$lib/authStore';
import { comptarBits } from './parcors.js';

async function sesilhaPrèsta() {
	if (get(authReady)) return;
	await new Promise((resolve) => {
		const stop = authReady.subscribe((ok) => {
			if (ok) {
				stop();
				resolve();
			}
		});
	});
}

/** { fachas: { [clau]: étapes faites }, fogassas, compte } pour les modules donnés */
export async function legirAvancament(claus) {
	await sesilhaPrèsta();
	const s = get(session);
	const fachas = {};
	let fogassas = 0;
	if (s) {
		try {
			const { data } = await supabase
				.from('lesson_progress')
				.select('module_id, word_index, points')
				.eq('user_id', s.user.id)
				.in('module_id', claus);
			for (const r of data ?? []) {
				fachas[r.module_id] = comptarBits(r.word_index);
				fogassas += r.points ?? 0;
			}
		} catch {
			/* échec réseau : le chemin s'affiche depuis le début, sans bloquer */
		}
		return { fachas, fogassas, compte: true };
	}
	for (const c of claus) {
		try {
			const v = JSON.parse(localStorage.getItem(`lo-ligam-${c}-progress`) || 'null');
			if (v) {
				fachas[c] = comptarBits(v.mask);
				fogassas += v.points ?? 0;
			}
		} catch {
			/* stockage indisponible (navigation privée…) : pas bloquant */
		}
	}
	return { fachas, fogassas, compte: false };
}
