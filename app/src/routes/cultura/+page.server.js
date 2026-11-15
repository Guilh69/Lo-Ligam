// Sommaire de Cultura : les dessins au trait des fiches sans photo.
import { dessenhs } from '$lib/cultura/dessenhs.server.js';
import { legirElements } from '$lib/server/elements.js';

export async function load() {
	return { dessenhs: dessenhs(), elements: await legirElements('cultura') };
}
