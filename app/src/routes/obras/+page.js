import { supabase } from '$lib/supabaseClient';

// Pas de filet de secours gelé ici, contrairement aux fiches : cet espace
// naît en base, il n'a pas de version dans le code à retrouver. Si la base ne
// répond pas, la page le dit franchement plutôt que d'afficher un vide
// inexpliqué.
export async function load() {
	const { data, error } = await supabase
		.from('obras')
		.select('id, mena, titre, autor, editor, an, embed_url, ligam, imatge_url, comentari, ordre')
		.order('ordre')
		// Au plus 8 s : si la base ne répond pas, la page l'annonce au lieu de
		// rester bloquée côté serveur (audit du 2026-10-08).
		.abortSignal(AbortSignal.timeout(8000));

	if (error) {
		console.warn('[obras] basa injoignabla :', error.message);
		return { obras: [], pana: true };
	}
	return { obras: data ?? [], pana: false };
}
