// Territòris occitans fòra de França, revelats al survòl coma un despartament
// (e una region) : Val d'Aran ; valadas d'Itàlia (se lo fichièr es aquí).
// Contorns OpenStreetMap (ODbL), simplificats (~150 m) e arredondits (3 decimalas).
import fs from 'fs';
import { fileURLToPath } from 'url';
// entradas de la cadena (fòra Git) : SIG/brut/cadena-entradas
const S = fileURLToPath(new URL('../brut/cadena-entradas/osm/', import.meta.url));
const F = 'C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/static/data/limits-carta.json';

// Douglas-Peucker sus un anèl (tolerància en grases, ~ 0,0015° ≈ 150 m)
const dp = (pts, tol) => {
	if (pts.length < 4) return pts;
	const k = Math.cos((pts[0][1] * Math.PI) / 180);
	const d = (p, a, b) => {
		const ax = a[0] * k, ay = a[1], bx = b[0] * k, by = b[1], px = p[0] * k, py = p[1];
		const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
		const t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
		return Math.hypot(px - ax - t * dx, py - ay - t * dy);
	};
	const garda = new Uint8Array(pts.length);
	garda[0] = garda[pts.length - 1] = 1;
	const pila = [[0, pts.length - 1]];
	while (pila.length) {
		const [i, j] = pila.pop();
		let m = -1, dm = tol;
		for (let n = i + 1; n < j; n++) {
			const v = d(pts[n], pts[i], pts[j]);
			if (v > dm) { dm = v; m = n; }
		}
		if (m > 0) { garda[m] = 1; pila.push([i, m], [m, j]); }
	}
	return pts.filter((_, i) => garda[i]).map(([x, y]) => [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]);
};
const anelsDe = (geom) => {
	const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
	// sonque los anèls exteriors (los traucs son pas d'utilitat pel survòl)
	return polys.map((p) => dp(p[0], 0.0015)).filter((a) => a.length >= 4);
};

const d = JSON.parse(fs.readFileSync(F, 'utf8'));
const metre = (lista, code, nom, anels) => {
	const i = lista.findIndex((x) => x[0] === code);
	if (i >= 0) lista[i] = [code, nom, anels];
	else lista.push([code, nom, anels]);
};

// Val d'Aran
const aran = JSON.parse(fs.readFileSync(S + 'aran.geojson', 'utf8'));
const aA = anelsDe(aran.type === 'GeometryCollection' ? aran.geometries[0] : aran);
metre(d.regions, 'ARAN', "Val d'Aran", aA);
metre(d.despartaments, 'ARAN', "Val d'Aran", aA);
console.log('Aran :', aA.length, 'anèls,', aA.reduce((s, a) => s + a.length, 0), 'ponches');

// Valadas d'Itàlia (calculadas per valadas.mjs, se presentas)
if (fs.existsSync(S + 'valadas.json')) {
	const v = JSON.parse(fs.readFileSync(S + 'valadas.json', 'utf8'));
	metre(d.regions, 'VALADAS', 'Vallées occitanes', v.totas);
	for (const [code, nomFr, anels] of v.valadas) metre(d.despartaments, code, nomFr, anels);
	console.log('Valadas :', v.valadas.length);
}
fs.writeFileSync(F, JSON.stringify(d));
console.log('limits-carta.json :', fs.statSync(F).size, 'octets');
