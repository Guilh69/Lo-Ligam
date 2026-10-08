// La projeccion de la carta (lo Mercator web de Leaflet) es proporcionala al
// zoom : un ponch al zoom z val son ponch al zoom 0 multiplicat per 2^z. Cada
// ponch es donc projectat un sol còp ; a cada cran de zoom, una multiplicacion
// (la projeccion de Leaflet, ponch per ponch a cada cran, costava d'unas
// desenas de milisegondas : un saumet visible). Optimizacion demandada per
// Romain (2026-10-08), sens cap de cambiament de rendut.

const cacha = new WeakMap();

// Los ponches d'una linha [[lon, lat], …] al zoom 0, dins un tablèu plat
export function proj0(map, linha) {
	let f = cacha.get(linha);
	if (!f) {
		f = new Float64Array(linha.length * 2);
		for (let i = 0; i < linha.length; i++) {
			const q = map.project([linha[i][1], linha[i][0]], 0);
			f[2 * i] = q.x;
			f[2 * i + 1] = q.y;
		}
		cacha.set(linha, f);
	}
	return f;
}

// La linha al zoom z : [[x, y], …], decalada de (dx, dy)
export function projectar(map, linha, z, dx = 0, dy = 0) {
	const f = proj0(map, linha),
		s = Math.pow(2, z),
		n = linha.length,
		out = new Array(n);
	for (let i = 0; i < n; i++) out[i] = [f[2 * i] * s - dx, f[2 * i + 1] * s - dy];
	return out;
}

// Un ponch sol, un objècte { lat, lon } : sa projeccion al zoom 0 es gardada sus el
export function projPonch(map, o, z) {
	if (o._x0 === undefined) {
		const q = map.project([o.lat, o.lon], 0);
		o._x0 = q.x;
		o._y0 = q.y;
	}
	const s = Math.pow(2, z);
	return [o._x0 * s, o._y0 * s];
}
