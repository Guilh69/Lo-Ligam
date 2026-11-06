// Essai de Cultura (2026-11-06) : les dessins au trait des fiches sans photo.
import { dessenhs } from '$lib/cultura/dessenhs.server.js';

export function load() {
	return { dessenhs: dessenhs() };
}
