// La page de calme, essayée ici depuis le 2026-11-04, est devenue « Remira »,
// rubrique de S'apren (Romain, 2026-11-05 : « Je crois que je préfère
// Remira »). Les anciens liens arrivent au bon endroit.
import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(301, '/apren/remira');
}
