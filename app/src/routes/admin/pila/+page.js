// La pila est devenue une vue de « A validar » (2026-11-07, /admin/valider) : les anciens
// liens et favoris arrivent au bon endroit, avec le lot demandé.
import { redirect } from '@sveltejs/kit';
export function load({ url }) {
	const lot = url.searchParams.get('lot');
	const edicion = url.searchParams.get('edicion'); // l'aperçu sans compte, en développement
	redirect(301, `/admin/valider?vue=pila${lot ? `&lot=${encodeURIComponent(lot)}` : ''}${edicion ? `&edicion=${encodeURIComponent(edicion)}` : ''}`);
}
