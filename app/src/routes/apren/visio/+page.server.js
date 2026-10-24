// « Corses en visio » : ses éléments modifiables, publiés seulement, avec le
// filet de secours ($lib/server/elements.js).
import { legirElements } from '$lib/server/elements.js';

export async function load() {
	return { elements: await legirElements('visio') };
}
