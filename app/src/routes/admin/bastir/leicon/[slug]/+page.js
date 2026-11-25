import { error } from '@sveltejs/kit';
import { leiçon } from '#lib/bastir/bastir.js';

/** une leçon du registre des modules, sinon 404 */
export function load({ params }) {
	if (!leiçon(params.slug)) error(404, 'Leçon inconnue');
	return { slug: params.slug };
}
