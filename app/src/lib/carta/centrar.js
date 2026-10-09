// Lo doble clic centra la vista sus la donada (demanda de Romain, 2026-10-09 :
// « pour l'ensemble des données, un double clic rapide centre la vue sur la
// donnée ») : cada còla dona lo cadre de çò qu'es jos lo ponteiro
// (cadreA), una zòna (bounds) o un ponch (centre).

// L'emprèsa [[sud, oèst], [nòrd, èst]] de coordenadas GeoJSON ([lon, lat], a
// quina prigondor que siá)
export function emprèsa(coords) {
	let s = Infinity, w = Infinity, n = -Infinity, e = -Infinity;
	const percórrer = (c) => {
		if (typeof c[0] === 'number') {
			if (c[0] < w) w = c[0];
			if (c[0] > e) e = c[0];
			if (c[1] < s) s = c[1];
			if (c[1] > n) n = c[1];
		} else for (const x of c) percórrer(x);
	};
	percórrer(coords);
	return Number.isFinite(s) ? [[s, w], [n, e]] : null;
}

// Lo cadre d'una entitat GeoJSON
export const cadreDe = (f) => {
	const b = f?.geometry ? emprèsa(f.geometry.coordinates) : null;
	return b ? { bounds: b } : null;
};
