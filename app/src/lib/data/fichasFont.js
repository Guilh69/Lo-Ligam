// Lo Ligam — d'où viennent les fiches affichées par le site.
//
// LA BASE EST LA SEULE VÉRITÉ MODIFIABLE. fichas.js n'est plus qu'un FILET DE
// SECOURS gelé : on le lit uniquement si la base ne répond pas, et jamais on ne
// fusionne les deux (décision du 2026-08-03, §11 du cahier des charges — deux
// sources modifiables, ce sont deux vérités et des bugs ingérables).
//
// Pourquoi un filet : sur le forfait gratuit, un projet Supabase se met en
// pause après environ une semaine sans activité. Sans filet, la bibliothèque
// s'afficherait vide ce jour-là.

import { supabase } from '$lib/supabaseClient';
import { categories as categoriasGeladas, fichas as fichasGeladas } from './fichas';

// Au-delà, on n'attend plus : mieux vaut le catalogue gelé tout de suite qu'une
// page qui tourne dans le vide parce que la base est en pause.
const TEMPS_MAX = 5000;

export async function cargarCatalog() {
	let relotge;
	try {
		const contraroTle = new AbortController();
		relotge = setTimeout(() => contraroTle.abort(), TEMPS_MAX);

		const [t, f] = await Promise.all([
			supabase
				.from('temas')
				.select('id, oc, fr, color, ordre')
				.order('ordre')
				.abortSignal(contraroTle.signal),
			supabase
				.from('fichas')
					.select('id, tema_id, titre, mini_url, grand_url, video_url, ordre')
				.abortSignal(contraroTle.signal)
		]);

		if (t.error) throw t.error;
		if (f.error) throw f.error;
		if (!t.data?.length || !f.data?.length) throw new Error('la basa a res tornat');

		// L'ordre d'affichage est celui des THÈMES d'abord, des fiches ensuite.
		// Trier les fiches sur leur seul « ordre » mettrait toutes les premières
		// fiches de chaque thème en tête — ce n'est pas le classement de Romain.
		const rang = new Map(t.data.map((x, i) => [x.id, i]));
		const fichas = f.data
			.map((x) => ({
				id: x.id,
				cat: x.tema_id,
				titre: x.titre,
				mini: x.mini_url,
				grand: x.grand_url,
				video: x.video_url ?? null,
				_rang: [rang.get(x.tema_id) ?? 9999, x.ordre]
			}))
			.sort((a, b) => a._rang[0] - b._rang[0] || a._rang[1] - b._rang[1])
			.map(({ _rang, ...ficha }) => ficha);

		return {
			font: 'basa',
			categories: t.data.map(({ id, oc, fr, color }) => ({ id, oc, fr, color })),
			fichas
		};
	} catch (e) {
		// On ne fait pas échouer la page : le visiteur voit le catalogue gelé,
		// qui reste juste — seulement peut-être un peu ancien.
		console.warn('[fichas] basa injoignabla, filet de securitat emplegat :', e?.message ?? e);
		return {
			font: 'filet',
			categories: categoriasGeladas,
			fichas: fichasGeladas
		};
	} finally {
		clearTimeout(relotge);
	}
}
