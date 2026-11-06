import { error } from '@sveltejs/kit';
import { ficha } from '$lib/cultura/index.js';
import { encart } from '$lib/cultura/encart.server.js';
import { dessenh } from '$lib/cultura/dessenhs.server.js';
import { foto, credit, extern, amples, srcset } from '$lib/cultura/imatges.js';
import { PAISATGES } from '$lib/paisatges/paisatges.js';

// Une fiche de Cultura : l'encart de sa leçon, lu côté serveur, avec sa photo
// en grand (celle des paysages, déjà en ligne) ou son dessin au trait. Une
// fiche inconnue répond par une vraie 404, comme les fiches de grammaire.
export function load({ params }) {
	const f = ficha(params.ficha);
	const e = f && encart(f);
	if (!e) error(404, 'Fiche introuvable');
	const ft = foto(f.id);
	const c = credit(f.id);
	const x = extern(f.id); // hors des paysages : Commons (crédité) ou stock de Romain
	const p = ft && !x && PAISATGES.find((y) => y.clau === ft.clau);
	const fotoGranda = p
		? {
				src: `/apren/paisatges/${p.clau}-${p.amples[0]}.webp`,
				srcset: p.amples.map((a) => `/apren/paisatges/${p.clau}-${a}.webp ${a}w`).join(', '),
				pos: ft.pos
			}
		: x?.objecte
			? // un objet en petite photo : entier, au bout de la case
				{ src: `/cultura/${f.id}-objecte.webp`, srcset: undefined, pos: '50% 50%', credit: c, objecte: true }
			: x
				? // ses images déjà recadrées, et son crédit s'il vient de Commons
					{ src: `/cultura/${f.id}-${amples(f.id)[0]}.webp`, srcset: srcset(f.id, Infinity), pos: x.posFicha ?? '50% 50%', credit: c, colors: !!x.colors }
				: null;
	return { id: f.id, encart: e, foto: fotoGranda, dessenh: dessenh(f.id) };
}
