// Les fiches viennent de la base, avec repli sur le catalogue gelé.
// Voir $lib/data/fichasFont.js pour le pourquoi du filet de secours.
import { cargarCatalog } from '$lib/data/fichasFont';

export async function load() {
	return await cargarCatalog();
}
