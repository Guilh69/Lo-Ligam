// Groupes d'Amassa : leurs éléments modifiables (accueil du chat, avis sur
// le compte et le pseudo), publiés seulement, avec le filet de secours. Les
// messages se lisent dans le navigateur, avec la session de la personne (RLS).
import { legirElements } from '$lib/server/elements.js';

export async function load() {
	return { elements: await legirElements('grops') };
}
