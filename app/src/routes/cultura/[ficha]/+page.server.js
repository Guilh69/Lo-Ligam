import { error } from '@sveltejs/kit';
import { ficha } from '$lib/cultura/index.js';
import { encart } from '$lib/cultura/encart.server.js';

// Une fiche de Cultura : l'encart de sa leçon, lu côté serveur. Une fiche
// inconnue répond par une vraie 404, comme les fiches de grammaire.
export function load({ params }) {
	const f = ficha(params.ficha);
	const e = f && encart(f);
	if (!e) error(404, 'Fiche introuvable');
	return { id: f.id, encart: e };
}
