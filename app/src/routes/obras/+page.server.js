// Òbras : ses éléments modifiables (les fiches d'artistes, 2026-10-25),
// publiés seulement, avec le filet de secours ($lib/server/elements.js).
// Remplace la table `obras` (2026-08-04), jamais créée dans la base.
import { legirElements } from '$lib/server/elements.js';

export async function load() {
	return { elements: await legirElements('obras') };
}
