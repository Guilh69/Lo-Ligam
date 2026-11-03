import { error } from '@sveltejs/kit';
import { ficha } from '$lib/gramatica/index.js';

// Une fiche inconnue répond par une vraie 404, comme les modules du parcours.
export function load({ params }) {
	if (!ficha(params.ficha)) error(404, 'Fiche introuvable');
	return { id: params.ficha };
}
