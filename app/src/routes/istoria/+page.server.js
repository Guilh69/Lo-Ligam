// Mon istòria (2026-10-24, option A de Romain : une seule page, le récit puis
// le contact en fin de page ; /contacte y renvoie). Les textes se modifient
// sur place ($lib/server/elements.js) ; le formulaire part par courriel
// ($lib/server/contacte.js) et marche aussi sans JavaScript.
import { fail } from '@sveltejs/kit';
import { legirElements } from '$lib/server/elements.js';
import { geton, mandarContacte } from '$lib/server/contacte.js';

export async function load() {
	return { elements: await legirElements('istoria'), geton: geton() };
}

// l'adresse du visiteur derrière le relais de Scaleway : la dernière de la
// chaîne est celle que le relais a vue (les précédentes peuvent être inventées)
const ipDe = (request, getClientAddress) =>
	request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() || getClientAddress();

export const actions = {
	default: async ({ request, getClientAddress }) => {
		const fd = await request.formData();
		const r = await mandarContacte(fd, ipDe(request, getClientAddress));
		if (r.ok || r.piège) return { mandat: true };
		// on rend ce que la personne avait écrit, pour qu'elle ne perde rien
		return fail(r.status, {
			error: r.error,
			nom: String(fd.get('nom') ?? ''),
			corrièl: String(fd.get('corrièl') ?? ''),
			messatge: String(fd.get('messatge') ?? '')
		});
	}
};
