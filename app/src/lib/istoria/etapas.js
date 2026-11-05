// La carte de « Mon ligam amb l'occitan » (Romain, 2026-11-05 : « une carte à
// l'échelle qui permette de naviguer entre Paris, Montpellier et Valencia,
// Barcelone. Chaque point apparaît avec un focus animé sur la zone… des zooms
// et dézooms selon l'endroit de l'histoire »).
//
// Données personnelles (Romain, 05-11) : pas de ville de naissance exacte, ni
// pour lui ni pour sa famille. La famille de sa mère = la zone « Erau », pas une
// commune ; Paris = la ville de son père, sans plus.

/** Les lieux du récit, en occitan (comme le texte). */
export const LUÒCS = {
	paris: { nom: 'París', lon: 2.35, lat: 48.86 },
	erau: { nom: 'Erau', lon: 3.42, lat: 43.6, zona: true },
	montpelhier: { nom: 'Montpelhièr', lon: 3.877, lat: 43.611 },
	valencia: { nom: 'Valéncia', lon: -0.376, lat: 39.47 },
	barcelona: { nom: 'Barcelona', lon: 2.17, lat: 41.39 }
};

// Une étape par chapitre (clé de pagina_elements), calée sur ce que dit le
// texte (Romain, 05-11 : « une lecture accompagnée et guidée ») : le lieu
// nommé dans le chapitre, rien d'inventé. Un chapitre sans lieu (c5 : apprendre
// seul, Assimil) n'a pas d'étape et garde la vue du précédent.
//   lòc : le nom du lieu, affiché aussi au-dessus du titre du chapitre
//   c : centre [lon, lat] ; r : demi-largeur visible en km (sur le petit côté)
//   luòcs : les points montrés ; focus : [lieu, rayon du projecteur en km]
//   segond : un deuxième point qui s'allume un instant après
//   zona / domenis : les aplats à faire ressortir ; arc : un trait entre deux lieux
//   estelas : les lieux d'Occitània s'allument (la communauté)
export const ETAPAS = {
	// avant le premier chapitre : l'Hérault dans sa région, sans Paris (Romain,
	// 05-11 : « il faut pas que ça commence à Paris ») ; le chapitre 1 resserre
	debuta: { c: [3.2, 43.75], r: 170, luòcs: ['erau'], zona: 'erau' },
	// la famille de sa mère, les mots qu'il ne comprenait pas
	'istoria.capitols.c1': { lòc: 'Erau', c: [3.42, 43.62], r: 85, luòcs: ['erau'], zona: 'erau', focus: ['erau', 55] },
	// « Montpelhièr, una vila sens istòria ? »
	'istoria.capitols.c2': { lòc: 'Montpelhièr', c: [3.877, 43.611], r: 38, luòcs: ['montpelhier'], focus: ['montpelhier', 14] },
	// Erasmus à Valéncia, le débat « encara mai fòrt en Catalonha »
	'istoria.capitols.c3': {
		lòc: 'Valéncia · Barcelona',
		c: [1.0, 40.6],
		r: 215,
		luòcs: ['valencia', 'barcelona'],
		domenis: ['catalan'],
		focus: ['valencia', 70],
		segond: 'barcelona'
	},
	// le retour en France, « la riquesa jos mos pès » : le domaine occitan
	'istoria.capitols.c4': { lòc: 'Occitània', c: [2.5, 44.2], r: 330, domenis: ['occitan'] },
	// les mots de la famille, le grand-père
	'istoria.capitols.c6': { lòc: 'Erau', c: [3.42, 43.62], r: 85, luòcs: ['erau'], zona: 'erau', focus: ['erau', 55] },
	// le compte Instagram, une communauté : les lieux d'Occitània s'allument
	'istoria.espelida.c1': { lòc: 'Occitània', c: [2.4, 44.4], r: 330, domenis: ['occitan'], estelas: true },
	// « la realitat occitana d'ara en França » : vue d'ensemble, tout le parcours
	'istoria.espelida.c2': {
		c: [2.0, 44.0],
		r: 480,
		luòcs: ['paris', 'montpelhier', 'valencia', 'barcelona'],
		domenis: ['occitan', 'catalan'],
		estelas: true
	}
};

/** La première étape (dans l'ordre du récit) qui met ce lieu en avant, sinon
 *  la première qui le montre (Paris : seulement à la fin, depuis le 05-11). */
export function etapaDe(luòc, ordre) {
	const met = (id) => {
		const e = ETAPAS[id];
		return e && (e.focus?.[0] === luòc || e.segond === luòc || (e.zona && e.zona === luòc));
	};
	return ordre.find(met) ?? ordre.find((id) => ETAPAS[id]?.luòcs?.includes(luòc));
}

// Le zoom « en vol » de van Wijk et Nuij (2003), celui de Prezi et de d3 :
// on recule pour voir les deux endroits, puis on plonge. p = [x, y, largeur].
const RHO = 1.4;
export function vol(p0, p1) {
	const [ux0, uy0, w0] = p0;
	const [ux1, uy1, w1] = p1;
	const dx = ux1 - ux0,
		dy = uy1 - uy0,
		d2 = dx * dx + dy * dy,
		rho2 = RHO * RHO,
		rho4 = rho2 * rho2;
	let S, f;
	if (d2 < 1e-9) {
		S = Math.log(w1 / w0) / RHO;
		f = (t) => [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(RHO * t * S)];
	} else {
		const d1 = Math.sqrt(d2);
		const b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1);
		const b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1);
		const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
		const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
		S = (r1 - r0) / RHO;
		f = (t) => {
			const s = t * S;
			const ch = Math.cosh(r0);
			const u = (w0 / (rho2 * d1)) * (ch * Math.tanh(RHO * s + r0) - Math.sinh(r0));
			return [ux0 + u * dx, uy0 + u * dy, (w0 * ch) / Math.cosh(RHO * s + r0)];
		};
	}
	f.duracion = (Math.abs(S) * 1000 * RHO) / Math.SQRT2;
	return f;
}

/** Une longueur « ronde » pour l'échelle : 1, 2, 5, 10, 20, 50… km */
export function escalaRedona(km) {
	const p = 10 ** Math.floor(Math.log10(km));
	const n = km / p;
	return (n >= 5 ? 5 : n >= 2 ? 2 : 1) * p;
}
