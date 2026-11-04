// Le déroulé du chemin de S'apren : quatre niveaux, du débutant à la croix pleine, et, pour chaque
// piste, l'instant et la durée de chaque élément (en secondes). CaminCrotz.svelte en fait des
// variables CSS ; le test vérifie que tout est fini en moins de 5 s (critère RGAA 13.8).
//
// Les quatre ronds sont quatre niveaux (retour de Romain, 2026-11-04 : « il faut qu'on comprenne
// que le premier, on est débutant, et ensuite on arrive à une croix avec les belles couleurs et
// pleine ») : chaque rond s'arrête à son niveau, le dernier est la croix complète.
import { ARC_POINTS, RAI_POINTS } from './crotz-geometria.js';

// points allumés à l'arrivée, rond par rond : 3 = le débutant, 12 = la croix pleine
export const NIVEAUX = [3, 6, 9, 12];
export const MAX_FIN = 5;
const DEPARTS = [0.3, 0.95, 1.7, 2.6]; // début de chaque rond
const DUREE = 1.1; // un tour complet du filet
const PAS_POINT = DUREE / 12; // un point toutes les 0,092 s

// les douze points, dont les `lit` premiers sont allumés (les autres restent de petites perles)
const ponchs = (lit, quand) => Array.from({ length: 12 }, (_, k) => (k < lit ? { on: true, ...quand(k) } : { on: false }));

// l'instant où tout ce qui concerne ce rond est fini
const fin = (rond) => {
	const tous = [rond.verre, rond.anell, rond.hub, rond.tete, rond.but, ...rond.ponchs, ...rond.rais, ...rond.arcs];
	return Math.max(...tous.filter((e) => e && e.u !== undefined).map((e) => e.d + e.u));
};

/**
 * @param {'hybride' | 'balayage' | 'constellation'} variant
 */
export function plan(variant) {
	const ronds = NIVEAUX.map((lit, n) => {
		const T = DEPARTS[n];
		const f = lit === 12 ? 1 : (lit - 0.5) / 12; // part du cercle tracée : un peu au-delà du dernier point allumé
		const tour = f * DUREE;
		// rayons et arcs qui relient des points allumés ; p = le dernier point (dans l'ordre du tour) qu'ils touchent
		const rais = RAI_POINTS.map((p, i) => ({ i, p })).filter((r) => r.p < lit);
		const arcs = ARC_POINTS.map(([a, b], i) => ({ i, p: Math.max(a, b) })).filter((a) => a.p < lit);
		const rond = { n, lit, f, T, verre: { d: T - 0.15, u: 0.5 }, tete: null, but: null };
		if (variant === 'constellation') {
			rond.anell = { d: T + 0.75, u: 0.9 * f };
			rond.hub = { d: T + 0.5, u: 0.5 };
			rond.ponchs = ponchs(lit, (k) => ({ d: T + k * 0.045, u: 0.85 }));
			rond.rais = rais.map((r, o) => ({ i: r.i, d: T + 0.55 + o * 0.045, u: 0.5 }));
			rond.arcs = arcs.map((a, o) => ({ i: a.i, d: T + 0.85 + o * 0.04, u: 0.4 }));
		} else if (variant === 'balayage') {
			rond.anell = { d: T, u: tour };
			rond.tete = { d: T, u: tour };
			rond.hub = { d: T, u: 0.5 };
			rond.ponchs = ponchs(lit, (k) => ({ d: T + k * PAS_POINT, u: 0.5 }));
			rond.rais = rais.map((r) => ({ i: r.i, d: T + Math.max(r.p * PAS_POINT - 0.12, 0.04), u: 0.5 }));
			rond.arcs = arcs.map((a) => ({ i: a.i, d: T + a.p * PAS_POINT, u: 0.4 }));
		} else {
			// hybride : le tour allume les points, puis le moyeu, les rayons et les arcs les relient
			rond.anell = { d: T, u: tour };
			rond.hub = { d: T + Math.max(0.05, tour - 0.3), u: 0.5 };
			rond.ponchs = ponchs(lit, (k) => ({ d: T + k * PAS_POINT, u: 0.5 }));
			rond.rais = rais.map((r, o) => ({ i: r.i, d: T + Math.max(tour - 0.25, 0.1) + o * 0.045, u: 0.5 }));
			rond.arcs = arcs.map((a, o) => ({ i: a.i, d: T + tour + o * 0.04, u: 0.4 }));
		}
		rond.fin = fin(rond);
		// le but : la croix pleine reçoit un double cercle, qui se trace une fois tout le reste en place
		if (lit === 12) {
			rond.but = { d: rond.fin - 0.35, u: 0.6 };
			rond.fin = fin(rond);
		}
		return rond;
	});
	// le chemin se trace d'un rond au suivant : il part un peu après le début du rond, arrive un peu après le début du suivant
	const via = [0, 1, 2].map((i) => {
		const d = DEPARTS[i] + 0.2;
		return { d, u: Math.max(0.5, DEPARTS[i + 1] - d + 0.15) };
	});
	return { ronds, via, fin: Math.max(...ronds.map((r) => r.fin), ...via.map((v) => v.d + v.u)) };
}
