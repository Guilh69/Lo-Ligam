// Les trois textes que le préambule de la Constitution cite : /constitucion/declaracion-1789,
// /constitucion/preambul-1946, /constitucion/carta-environament. Toute autre adresse : page introuvable.
import { error } from '@sveltejs/kit';
import { texteDeFin } from '$lib/constitucion/textes.js';

export function load({ params }) {
	const t = texteDeFin(params.text);
	if (!t || t.id === 'const') error(404, 'Page introuvable');
	return { id: t.id };
}
