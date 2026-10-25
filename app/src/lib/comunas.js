// Recherche d'une commune par son nom français ou occitan (2026-10-25), sur la
// même donnée que la carte (static/data/comunas/noms.json : 10 042 communes,
// [fr, oc|0, lon, lat, pop, dep]) et avec la même notation que sa recherche
// (CartaOccitania.svelte, cercarComuna). Chargée une fois, à la demande.
// Les villes nommées sur la carte gardent son nom (« Rodés », pas « Rodès ») :
// la carte vérifie la position, ici on prend la plus peuplée des homonymes.

export const normC = (t) =>
	t
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[-'’()]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

let comunas = null;
let promesa = null;

export function cargarComunas() {
	promesa ??= Promise.all([
		fetch('/data/comunas/noms.json')
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null),
		import('$lib/carta/nomsFrances.js')
			.then((m) => m.NOMS_FRANCES)
			.catch(() => ({}))
	]).then(([d, noms]) => {
		const ocDeFr = Object.fromEntries(Object.entries(noms).map(([oc, fr]) => [fr, oc]));
		const lista = d?.c ?? [];
		const mai = {};
		for (const [fr, , , , pop] of lista) if (ocDeFr[fr] && pop > (mai[fr] ?? -1)) mai[fr] = pop;
		comunas = lista.map(([fr, oc0, , , pop, dep]) => {
			const oc0n = oc0 || null;
			const oc = mai[fr] === pop ? ocDeFr[fr] : oc0n;
			return { fr, oc, pop, dep, k: [normC(fr), ...(oc ? [normC(oc)] : []), ...(oc0n && oc0n !== oc ? [normC(oc0n)] : [])] };
		});
		return comunas;
	});
	return promesa;
}

// Le reste du monde (New York, Lyon, Alger…) : Photon, déjà permis par la
// politique de sécurité pour le questionnaire (LocationAutocomplete.svelte).
// Les noms viennent en français ; le pays suit le nom, sauf pour la France.
// Sans réponse (hors ligne, service coupé), on garde le texte libre.
export async function cercarMonde(q, signal) {
	try {
		const r = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&lang=fr&osm_tag=place`, { signal });
		if (!r.ok) return [];
		const d = await r.json();
		const vist = new Set();
		return (d.features ?? [])
			.map(({ properties: p }) => ({ nom: p.name, pais: p.country, detalh: [p.state, p.country].filter(Boolean).join(', ') }))
			.filter((x) => x.nom && !vist.has(x.nom + x.detalh) && vist.add(x.nom + x.detalh));
	} catch {
		return [];
	}
}

// exact 3, début du nom 2, début d'un mot 1 ; puis les plus peuplées d'abord
export function cercarComunas(q, n = 6) {
	const c = normC(q);
	if (c.length < 2 || !comunas?.length) return [];
	const nota = (x) => {
		let m = 0;
		for (const k of x.k) m = Math.max(m, k === c ? 3 : k.startsWith(c) ? 2 : k.includes(' ' + c) ? 1 : 0);
		return m;
	};
	return comunas
		.map((x) => [x, nota(x)])
		.filter(([, m]) => m > 0)
		.sort((a, b) => b[1] - a[1] || b[0].pop - a[0].pop)
		.slice(0, n)
		.map(([x]) => x);
}
