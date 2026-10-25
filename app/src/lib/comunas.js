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
// Les noms viennent en français ; en France, le département (tiré du code
// postal), ailleurs le pays.
// Sans réponse (hors ligne, service coupé), on garde le texte libre.
export async function cercarMonde(q, signal) {
	try {
		const r = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&lang=fr&osm_tag=place`, { signal });
		if (!r.ok) return [];
		const d = await r.json();
		const vist = new Set();
		return (d.features ?? [])
			.map(({ properties: p }) => {
				const fr = p.countrycode === 'FR';
				const dep = fr ? depDe(p.postcode, p.county) : null;
				return { nom: p.name, dep, pais: fr ? null : p.country, detalh: [p.state, fr ? dep : p.country].filter(Boolean).join(', ') };
			})
			.filter((x) => x.nom && !vist.has(x.nom + x.detalh) && vist.add(x.nom + x.detalh));
	} catch {
		return [];
	}
}

// le département : par son nom (« Haute-Garonne », « Métropole de Lyon »),
// sinon par le code postal (34070 → 34, 20000 → 2A, 97400 → 974)
const DEP_NOMS = Object.fromEntries(
	"01 Ain|02 Aisne|03 Allier|04 Alpes-de-Haute-Provence|05 Hautes-Alpes|06 Alpes-Maritimes|07 Ardèche|08 Ardennes|09 Ariège|10 Aube|11 Aude|12 Aveyron|13 Bouches-du-Rhône|14 Calvados|15 Cantal|16 Charente|17 Charente-Maritime|18 Cher|19 Corrèze|2A Corse-du-Sud|2B Haute-Corse|21 Côte-d'Or|22 Côtes-d'Armor|23 Creuse|24 Dordogne|25 Doubs|26 Drôme|27 Eure|28 Eure-et-Loir|29 Finistère|30 Gard|31 Haute-Garonne|32 Gers|33 Gironde|34 Hérault|35 Ille-et-Vilaine|36 Indre|37 Indre-et-Loire|38 Isère|39 Jura|40 Landes|41 Loir-et-Cher|42 Loire|43 Haute-Loire|44 Loire-Atlantique|45 Loiret|46 Lot|47 Lot-et-Garonne|48 Lozère|49 Maine-et-Loire|50 Manche|51 Marne|52 Haute-Marne|53 Mayenne|54 Meurthe-et-Moselle|55 Meuse|56 Morbihan|57 Moselle|58 Nièvre|59 Nord|60 Oise|61 Orne|62 Pas-de-Calais|63 Puy-de-Dôme|64 Pyrénées-Atlantiques|65 Hautes-Pyrénées|66 Pyrénées-Orientales|67 Bas-Rhin|68 Haut-Rhin|69 Rhône|69 Métropole de Lyon|70 Haute-Saône|71 Saône-et-Loire|72 Sarthe|73 Savoie|74 Haute-Savoie|75 Paris|76 Seine-Maritime|77 Seine-et-Marne|78 Yvelines|79 Deux-Sèvres|80 Somme|81 Tarn|82 Tarn-et-Garonne|83 Var|84 Vaucluse|85 Vendée|86 Vienne|87 Haute-Vienne|88 Vosges|89 Yonne|90 Territoire de Belfort|91 Essonne|92 Hauts-de-Seine|93 Seine-Saint-Denis|94 Val-de-Marne|95 Val-d'Oise|971 Guadeloupe|972 Martinique|973 Guyane|974 La Réunion|976 Mayotte"
		.split('|')
		.map((x) => [normC(x.slice(x.indexOf(' ') + 1)), x.slice(0, x.indexOf(' '))])
);
function depDe(cp, nom) {
	const d = nom && DEP_NOMS[normC(nom)];
	if (d) return d;
	if (!/^\d{5}/.test(cp ?? '')) return null;
	if (cp.startsWith('97') || cp.startsWith('98')) return cp.slice(0, 3);
	if (cp.startsWith('20')) return cp < '20200' ? '2A' : '2B';
	return cp.slice(0, 2);
}

// Le lieu d'un profil tel qu'on l'affiche : son nom dans la langue choisie,
// puis entre parenthèses le département, ou le pays hors de France
// (« Montpelhièr (34) », « Lyon (69) », « Alger (Algérie) »)
const DEPS = { ARAN: ["Val d'Aran", "Val d'Aran"], IT: ['Itàlia', 'Italie'] };
export function luòcAfichat(l, fr) {
	const nom = (fr ? l.ont : (l.ont_oc ?? l.ont)) ?? '';
	const de = l.ont_dep ? (DEPS[l.ont_dep]?.[fr ? 1 : 0] ?? l.ont_dep) : l.ont_pais;
	return nom && de ? `${nom} (${de})` : nom;
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
