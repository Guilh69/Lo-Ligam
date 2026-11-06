// Triar : valider ou refuser des éléments un par un, comme des cartes
// (Romain, 2026-11-06 : « une interface comme Tinder… une croix ou un cœur ;
// la croix veut dire que je refuse, et je peux mettre un commentaire ; le
// cœur, on garde tel quel »). Page : /admin/triar. Lots : ./lots.js.
//
// Les choix vont dans la table des remarques de relecture (remarcas), déjà
// protégée et déjà lue par Claude (scripts/triar.mjs), sans nouvelle table :
// - une croix = une remarque : cibla = la clé de l'élément, extrait = 'refar',
//   tèxte = le commentaire (ou « (sans commentaire) ») ;
// - les cœurs partent par paquets (le site accepte 300 remarques par jour en
//   tout) : cibla = 'gardats', extrait = 'gardar', tèxte = « ♥ » puis une clé
//   par ligne.
// Le dernier choix l'emporte. Une croix que Claude a marquée « tractada »
// (l'élément a été refait) revient en tête du tri, avec sa réponse.
// Ce fichier ne dépend de rien : la page et le script de Claude le partagent.

export const PAGINA = '/admin/triar';
export const SENS_COMENTARI = '(sans commentaire)';
const COR = '♥';

/** Le texte d'une croix : le commentaire, ou la mention « sans commentaire ». */
export function tèxteRefar(comentari) {
	return comentari.trim().slice(0, 2000) || SENS_COMENTARI;
}

/** Les cœurs en paquets qui tiennent dans une remarque (2 000 signes au plus). */
export function paquetsGardats(claus, max = 1900) {
	const paquets = [];
	let paquet = [];
	let long = COR.length;
	for (const c of claus) {
		if (paquet.length && long + 1 + c.length > max) {
			paquets.push(paquet);
			paquet = [];
			long = COR.length;
		}
		paquet.push(c);
		long += 1 + c.length;
	}
	if (paquet.length) paquets.push(paquet);
	return paquets;
}

/** Le texte d'un paquet de cœurs. */
export function tèxteGardats(claus) {
	return [COR, ...claus].join('\n');
}

/**
 * L'état de chaque élément d'après les remarques d'un lot (dans l'ordre des id).
 * Rend { clé: { v: 'gardar' | 'refar' | 'refach', id, comentari?, responsa? } }.
 */
export function estatDe(remarcas) {
	const e = {};
	for (const r of [...remarcas].sort((a, b) => a.id - b.id)) {
		if (r.extrait === 'gardar') {
			for (const c of r.tèxte.split('\n').slice(1)) if (c.trim()) e[c.trim()] = { v: 'gardar', id: r.id };
		} else if (r.extrait === 'refar' && r.cibla) {
			const comentari = r.tèxte === SENS_COMENTARI ? '' : r.tèxte;
			e[r.cibla] = { v: r.estat === 'tractada' ? 'refach' : 'refar', id: r.id, comentari, responsa: r.responsa ?? null };
		}
	}
	return e;
}

/** Ce qui reste à trier : les éléments refaits d'abord, puis ceux jamais vus. */
export function aTriar(elements, estat) {
	return [...elements.filter((el) => estat[el.clau]?.v === 'refach'), ...elements.filter((el) => !estat[el.clau])];
}

/** Les comptes d'un lot : gardés, à refaire, refaits à revoir, restants. */
export function comptes(elements, estat) {
	const n = { gardar: 0, refar: 0, refach: 0, rèsta: 0 };
	for (const el of elements) n[estat[el.clau]?.v ?? 'rèsta']++;
	return n;
}
