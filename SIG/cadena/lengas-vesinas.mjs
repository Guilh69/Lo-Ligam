// Los contorns leugièrs de las lengas vesinas (demanda de Romain, 2026-10-09) :
// al survòl d'una lenga pas alucada, la carta prepausa de la descobrir. Per
// saber se lo ponteiro i es, pas besonh de cargar tota la jaça (catalan :
// 234 Ko) : sonque lo contorn de son domeni, simplificat (~0,01°, 1 km).
// Entradas : app/static/data/<lenga>.json (domeni.anels) ; sortida :
// app/static/data/lengas-vesinas.json. De tornar aviar quand un domeni càmbia.
// Usatge : node SIG/cadena/lengas-vesinas.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const DATA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../app/static/data');
const LENGAS = ['catalan', 'arpitan']; // (lo basc e las lengas d'oïl : quand lor domeni serà traçat)
const TOL = 0.01; // grau
const arr = (v) => Math.round(v * 100) / 100;

// Douglas-Peucker
function simplificar(l, tol) {
	if (l.length < 3) return l;
	const [ax, ay] = l[0],
		[bx, by] = l[l.length - 1];
	let dm = 0,
		im = 0;
	for (let i = 1; i < l.length - 1; i++) {
		const [px, py] = l[i];
		const dx = bx - ax,
			dy = by - ay,
			n = Math.hypot(dx, dy) || 1e-12;
		const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / n;
		if (d > dm) (dm = d), (im = i);
	}
	if (dm <= tol) return [l[0], l[l.length - 1]];
	return [...simplificar(l.slice(0, im + 1), tol).slice(0, -1), ...simplificar(l.slice(im), tol)];
}

// un anèl barrat (primièr ponch = darrièr) : copat al ponch lo pus luènh del primièr
function simplificarAnel(a, tol) {
	let im = 0,
		dm = -1;
	for (let i = 1; i < a.length; i++) {
		const d = Math.hypot(a[i][0] - a[0][0], a[i][1] - a[0][1]);
		if (d > dm) (dm = d), (im = i);
	}
	return [...simplificar(a.slice(0, im + 1), tol).slice(0, -1), ...simplificar(a.slice(im), tol)];
}

const sortida = {};
for (const k of LENGAS) {
	const d = JSON.parse(fs.readFileSync(path.join(DATA, k + '.json'), 'utf8'));
	sortida[k] = d.domeni.anels
		.map((a) => simplificarAnel(a, TOL).map(([x, y]) => [arr(x), arr(y)]))
		.filter((a) => a.length >= 4);
}
fs.writeFileSync(path.join(DATA, 'lengas-vesinas.json'), JSON.stringify(sortida));
console.log('lengas-vesinas.json', fs.statSync(path.join(DATA, 'lengas-vesinas.json')).size, 'octets', Object.fromEntries(Object.entries(sortida).map(([k, v]) => [k, v.length + ' anèls'])));
