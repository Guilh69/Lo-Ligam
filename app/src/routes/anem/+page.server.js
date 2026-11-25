// Les textes d'en-tête modifiables de la page « anem » (édition sur place,
// 2026-11-15) : publiés seulement, avec le filet de secours
// (#lib/server/elements.js).
import { legirElements } from '#lib/server/elements.js';

export async function load() {
	return { elements: await legirElements('anem') };
}
