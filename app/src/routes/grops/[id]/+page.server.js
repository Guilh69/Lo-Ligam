// La page d'un groupe : son adresse sert d'invitation. Le serveur fournit
// son nom et son nombre de membres (publics) pour l'aperçu du lien dans les
// messageries et réseaux ; les messages, eux, se lisent dans le navigateur.
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function load({ params }) {
	const [g, c] = await Promise.all([
		supabase
			.from('grops')
			.select('id, mena, nom_oc, nom_fr, descripcion_oc, descripcion_fr, estat')
			.eq('id', params.id)
			.maybeSingle(),
		supabase.rpc('grops_comptes')
	]);
	if (g.error) error(503, 'Una error : torna ensajar. Une erreur : réessaie.');
	if (!g.data) error(404, 'Aqueste grop existís pas. Ce groupe n’existe pas.');
	const membres = (c.data ?? []).find((r) => r.grop_id === params.id)?.membres ?? 0;
	return { grop: g.data, membres };
}
