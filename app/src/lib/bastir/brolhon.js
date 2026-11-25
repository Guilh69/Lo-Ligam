// Lire et ranger les brouillons de l'atelier Bastir dans la base (table
// pagina_elements, « page » bastir, état brouillon : lisible et modifiable par
// l'administrateur seul). Le contenu passe par escriureBrolhon / legirBrolhon.
import { supabase } from '#lib/supabaseClient.js';
import { PAGINA_BASTIR, clauBastir, slugDeClau, escriureBrolhon, legirBrolhon } from './bastir.js';

/** tous les brouillons : { slug: brouillon } */
export async function cargarBrolhons() {
	const { data, error } = await supabase.from('pagina_elements').select('clau, oc').eq('pagina', PAGINA_BASTIR).eq('estat', 'brolhon');
	if (error) throw error;
	const fora = {};
	for (const r of data ?? []) {
		const slug = slugDeClau(r.clau);
		const b = legirBrolhon(r.oc);
		if (slug && b) fora[slug] = b;
	}
	return fora;
}

/** le brouillon d'une leçon, ou null */
export async function cargarBrolhon(slug) {
	const { data, error } = await supabase.from('pagina_elements').select('oc').eq('clau', clauBastir(slug)).eq('estat', 'brolhon').maybeSingle();
	if (error) throw error;
	return data ? legirBrolhon(data.oc) : null;
}

/** range le brouillon d'une leçon (remplace le précédent) */
export async function gardarBrolhon(slug, brolhon) {
	const { error } = await supabase
		.from('pagina_elements')
		.upsert({ clau: clauBastir(slug), estat: 'brolhon', pagina: PAGINA_BASTIR, tipe: 'bloc', oc: escriureBrolhon(brolhon) }, { onConflict: 'clau,estat' });
	if (error) throw error;
}
