// Les éléments modifiables de l'accueil (édition sur place, 2026-10-24) : voir
// $lib/server/elements.js (lecture publiée, mémoire de vingt secondes, filet).
import { legirElements } from '$lib/server/elements.js';

export async function load() {
	return { elements: await legirElements('acuelh') };
}
