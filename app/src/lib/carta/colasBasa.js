// Las jaces de la basa (taula carta_colas) : una sola demanda per visita, que
// la pagina (lo catalògue del rail) e la carta (colors, zònas) partejan
// (abans, doas demandas identicas ; audit de la carta, 2026-10-23).
import { supabase } from '$lib/supabaseClient';

let promesa = null;
export function cargarColas() {
	promesa ??= supabase
		.from('carta_colas')
		.select('*')
		.order('ordre')
		.then((r) => {
			if (r.error) promesa = null;
			return r;
		});
	return promesa;
}
