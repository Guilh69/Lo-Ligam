// Lo contorn d'una comuna a partir d'un ponch (retorn de Romain, 2026-10-11 :
// « il faut que ça sélectionne la surface de la ville ») : los fichièrs per
// despartament (o per zòna d'una autra lenga) de comunas/ (IGN ADMIN EXPRESS e
// instituts nacionals, TopoJSON, los meteisses que la jaça « Comunas »),
// cargats sonque quand cal e gardats.
import { decodarTopo } from './colaTematica.js';

let index = null;
const deps = {};

// (ponch dins un poligon amb sos traucs : règla de la paritat)
function dins(poligon, x, y) {
	let c = false;
	for (const anel of poligon)
		for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
			const [xi, yi] = anel[i],
				[xj, yj] = anel[j];
			if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
		}
	return c;
}

// { props, poligons: [[anel [[lon, lat], …], …], …] } o null
export async function contornComuna(lat, lon) {
	// (lo domeni occitan e las autras lengas : un indèx cadun)
	const legir = (u) =>
		fetch(u)
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null);
	index ??= Promise.all([legir('/data/comunas/index.json'), legir('/data/comunas/index-lengas.json')]).then(([a, b]) => [...(a?.deps ?? []), ...(b?.deps ?? [])]);
	for (const d of await index) {
		const [w, s, e, n] = d.bbox;
		if (lon < w || lon > e || lat < s || lat > n) continue;
		deps[d.d] ??= fetch(`/data/comunas/${d.d}.json`)
			.then((r) => (r.ok ? r.json() : null))
			.then((t) => (t ? decodarTopo(t) : null))
			.catch(() => null);
		const fs = await deps[d.d];
		const f = fs?.find((f) => f.poligons.some((p) => dins(p, lon, lat)));
		// (sa zòna, « arpitan-69 » o « 30 » : la lenga del luòc, per sa ficha)
		if (f) return Object.assign(f, { zona: d.d });
	}
	return null;
}
