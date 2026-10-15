// Fabrique le dessin de la carte « Amassa » de l'accueil (idée de Romain,
// 2026-10-15) : le domaine occitan d'après la carte linguistique d'Occitanica
// (static/data/limits-carta.json), et des liaisons en arc entre des villes,
// comme des lignes aériennes, pour montrer la connexion.
// Lancer depuis app/ : node scripts/amassa-liaisons.mjs
// Écrit src/lib/acuelh/amassa.js (quelques ko, rien à charger en plus).
import { readFileSync, writeFileSync } from 'node:fs';

const L = JSON.parse(readFileSync('static/data/limits-carta.json', 'utf8'));
const src = readFileSync('src/lib/acuelh/carta-estelas.js', 'utf8');
const LUOCS = JSON.parse(src.match(/export const LUOCS = (\[.*?\]);/s)[1]);

// Même projection que la carte en étoiles : équirectangulaire, calée à 44,5°
const KX = Math.cos((44.5 * Math.PI) / 180);
const proj = ([lon, lat]) => [lon * KX, -lat];

// Anneaux du domaine, projetés ; on écarte les îlots minuscules
const aire = (r) => Math.abs(r.reduce((s, [x, y], i) => { const [u, v] = r[(i + 1) % r.length]; return s + x * v - u * y; }, 0) / 2);
let anels = L.domeni.anels.map((r) => r.map(proj)).filter((r) => aire(r) > 0.004);

// Cadre 400 × 300 (même rapport 4/3 que les vignettes), marge pour les arcs
const W = 400, H = 300, M = 26;
const xs = anels.flat().map((p) => p[0]), ys = anels.flat().map((p) => p[1]);
const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
const k = Math.min((W - 2 * M) / (x1 - x0), (H - 2 * M - 18) / (y1 - y0));
const ox = (W - (x1 - x0) * k) / 2, oy = (H - (y1 - y0) * k) / 2 + 9;
const ecran = ([x, y]) => [ox + (x - x0) * k, oy + (y - y0) * k];

// Douglas-Peucker : une précision d'un demi-pixel suffit à cette taille
function simplificar(pts, tol) {
	if (pts.length < 3) return pts;
	const [a, b] = [pts[0], pts[pts.length - 1]];
	let dmax = 0, imax = 0;
	for (let i = 1; i < pts.length - 1; i++) {
		const [x, y] = pts[i], dx = b[0] - a[0], dy = b[1] - a[1];
		const d = Math.abs(dy * x - dx * y + b[0] * a[1] - b[1] * a[0]) / (Math.hypot(dx, dy) || 1);
		if (d > dmax) { dmax = d; imax = i; }
	}
	if (dmax <= tol) return [a, b];
	return [...simplificar(pts.slice(0, imax + 1), tol).slice(0, -1), ...simplificar(pts.slice(imax), tol)];
}
// Un anneau est fermé (premier point = dernier) : on le coupe en deux au point
// le plus éloigné du départ, sinon la simplification n'a pas de segment de référence
function simplificarAnel(r) {
	let m = 1, dm = 0;
	r.forEach(([x, y], i) => { const d = Math.hypot(x - r[0][0], y - r[0][1]); if (d > dm) { dm = d; m = i; } });
	return [...simplificar(r.slice(0, m + 1), 0.5).slice(0, -1), ...simplificar(r.slice(m), 0.5)];
}
const r1 = (n) => Math.round(n * 10) / 10;
const contorn = anels
	.map((r) => simplificarAnel(r.map(ecran)))
	.filter((r) => r.length > 3)
	.map((r) => 'M' + r.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L') + 'Z')
	.join('');

// Villes reliées : tout le domaine, y compris le Val d'Aran et les vallées d'Italie
const NOMS = ['Bordèu', 'Pau', 'Tolosa', 'Vielha', 'Limòtges', 'Clarmont-Ferrand', 'Montpelhièr', 'Marselha', 'Niça', 'Draonier'];
const vila = Object.fromEntries(NOMS.map((n) => {
	const l = LUOCS.find((q) => q[2] === n);
	if (!l) throw new Error('Lieu absent : ' + n);
	return [n, ecran(proj([l[0], l[1]])).map(r1)];
}));
// Peu de liaisons (demande de Romain : « il n'en faut pas trop »), tracées
// l'une après l'autre d'un point A à un point B, d'un bout à l'autre du domaine,
// sud-ouest compris (Pau, retour de Romain)
const LIAMS = [
	['Bordèu', 'Tolosa'], ['Limòtges', 'Montpelhièr'], ['Pau', 'Montpelhièr'], ['Vielha', 'Tolosa'],
	['Clarmont-Ferrand', 'Marselha'], ['Tolosa', 'Niça'], ['Montpelhièr', 'Draonier'], ['Bordèu', 'Clarmont-Ferrand']
];
// Chaque arc se bombe vers le nord, d'autant plus que le trajet est long
const arcs = LIAMS.map(([a, b]) => {
	const [p, q] = [vila[a], vila[b]];
	const [mx, my] = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
	const [dx, dy] = [q[0] - p[0], q[1] - p[1]], len = Math.hypot(dx, dy);
	let [nx, ny] = [-dy / len, dx / len];
	if (ny > 0) [nx, ny] = [-nx, -ny];
	const c = 0.24 * len;
	return `M${p[0]} ${p[1]}Q${r1(mx + nx * c)} ${r1(my + ny * c)} ${q[0]} ${q[1]}`;
});

const js = `// Généré par scripts/amassa-liaisons.mjs (ne pas modifier à la main).
// Domaine occitan d'après la carte linguistique d'Occitanica (limits-carta.json),
// villes de la carte en étoiles, cadre 400 × 300.
export const AMASSA = ${JSON.stringify({ contorn, vilas: Object.values(vila), arcs })};
`;
writeFileSync('src/lib/acuelh/amassa.js', js);
console.log(`${anels.length} anneaux, ${contorn.length} caractères de contour, ${arcs.length} arcs, ${js.length} octets`);
