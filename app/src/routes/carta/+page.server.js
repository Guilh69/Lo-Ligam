// La carte : les textes fixes du panneau d'explication se modifient sur place,
// publiés seulement, avec le filet de secours (#lib/server/elements.js).
import { legirElements } from '#lib/server/elements.js';

export async function load() {
	return { elements: await legirElements('carta') };
}
