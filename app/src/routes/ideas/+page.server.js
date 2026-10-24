// Boîte à idées : ses éléments modifiables, publiés seulement, avec le
// filet de secours ($lib/server/elements.js). Les idées elles-mêmes se lisent
// dans le navigateur, avec la session de la personne connectée (RLS).
import { legirElements } from '$lib/server/elements.js';

export async function load() {
	return { elements: await legirElements('ideas') };
}
