import { error } from '@sveltejs/kit';
import { UNITATS_A1 } from '#lib/bastir/bastir.js';

/** une unité de l'A1 (1 à 8), sinon 404 */
export function load({ params }) {
	const u = UNITATS_A1.find((x) => String(x.n) === params.unitat);
	if (!u) error(404, 'Unité inconnue');
	return { n: u.n };
}
