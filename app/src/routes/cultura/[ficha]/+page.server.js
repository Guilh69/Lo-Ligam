import { error } from '@sveltejs/kit';
import { ficha } from '$lib/cultura/index.js';
import { encart } from '$lib/cultura/encart.server.js';
import { dessenh } from '$lib/cultura/dessenhs.server.js';
import { foto } from '$lib/cultura/imatges.js';
import { PAISATGES } from '$lib/paisatges/paisatges.js';

// Une fiche de Cultura : l'encart de sa leçon, lu côté serveur, avec sa photo
// en grand (celle des paysages, déjà en ligne) ou son dessin au trait. Une
// fiche inconnue répond par une vraie 404, comme les fiches de grammaire.
export function load({ params }) {
	const f = ficha(params.ficha);
	const e = f && encart(f);
	if (!e) error(404, 'Fiche introuvable');
	const ft = foto(f.id);
	const p = ft && PAISATGES.find((x) => x.clau === ft.clau);
	const fotoGranda = p
		? {
				src: `/apren/paisatges/${p.clau}-${p.amples[0]}.webp`,
				srcset: p.amples.map((a) => `/apren/paisatges/${p.clau}-${a}.webp ${a}w`).join(', '),
				pos: ft.pos
			}
		: null;
	return { id: f.id, encart: e, foto: fotoGranda, dessenh: dessenh(f.id) };
}
