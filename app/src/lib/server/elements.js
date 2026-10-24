// Les éléments modifiables d'une page (édition sur place, 2026-10-24) : lus
// côté serveur, à l'état publié seulement, en une demande, gardés en mémoire
// vingt secondes. Si Supabase ne répond pas (ou si la table n'existe pas
// encore), le filet de secours de $lib/data/elements-filet.json prend le
// relais : le site public ne dépend jamais de la base pour s'afficher.
// Commun à l'accueil et à Mon istòria (2026-10-24).
import { supabase } from '$lib/supabaseClient';
import filet from '$lib/data/elements-filet.json';

const DURADA = 20_000;
const memòria = new Map();

export async function legirElements(pagina) {
	const ara = Date.now();
	const m = memòria.get(pagina);
	if (m && ara - m.t <= DURADA) return m.rows;
	let rows;
	try {
		const { data, error } = await supabase
			.from('pagina_elements')
			.select('clau,pagina,tipe,lista,ordre,oc,fr,ligam,imatge,visible')
			.eq('pagina', pagina)
			.eq('estat', 'publicat');
		if (error || !data?.length) throw error ?? new Error('cap d’element');
		// la base complète le filet, clé par clé : une semence partielle ou un
		// seul élément publié ne font jamais disparaître le reste de la page
		const perClau = Object.fromEntries((filet[pagina] ?? []).map((e) => [e.clau, e]));
		for (const e of data) perClau[e.clau] = e;
		rows = Object.values(perClau);
	} catch {
		rows = m?.rows ?? filet[pagina] ?? [];
	}
	memòria.set(pagina, { t: ara, rows });
	return rows;
}
