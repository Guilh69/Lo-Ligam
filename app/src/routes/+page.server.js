// Les éléments modifiables de l'accueil (édition sur place, 2026-10-24) :
// lus côté serveur, à l'état publié seulement, en une demande, gardés en
// mémoire vingt secondes. Si Supabase ne répond pas (ou si la table n'existe
// pas encore), le filet de secours de $lib/data/elements-filet.json prend le
// relais : le site public ne dépend jamais de la base pour s'afficher.
import { supabase } from '$lib/supabaseClient';
import filet from '$lib/data/elements-filet.json';

const PAGINA = 'acuelh';
const DURADA = 20_000;
let memòria = { t: 0, rows: null };

export async function load() {
	const ara = Date.now();
	if (!memòria.rows || ara - memòria.t > DURADA) {
		try {
			const { data, error } = await supabase
				.from('pagina_elements')
				.select('clau,pagina,tipe,lista,ordre,oc,fr,ligam,imatge,visible')
				.eq('pagina', PAGINA)
				.eq('estat', 'publicat');
			if (error || !data?.length) throw error ?? new Error('cap d’element');
			// la base complète le filet, clé par clé : une semence partielle ou un
			// seul élément publié ne font jamais disparaître le reste de la page
			const perClau = Object.fromEntries(filet[PAGINA].map((e) => [e.clau, e]));
			for (const e of data) perClau[e.clau] = e;
			memòria = { t: ara, rows: Object.values(perClau) };
		} catch {
			memòria = { t: ara, rows: memòria.rows ?? filet[PAGINA] };
		}
	}
	return { elements: memòria.rows };
}
