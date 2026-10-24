const RAIZ = require('path').resolve(__dirname, '..', '..'); // racine du projet, où qu'il soit
// Calage de la carte Occitanica en Lambert-93 : ajustement affine initial sur
// les villes, puis affiné sur le trait de côte (ICP : chaque point de côte de
// la carte est rapproché du point le plus proche de la côte Natural Earth, et
// l'on recalcule la transformation, jusqu'à stabilité).
const sharp = require(RAIZ + '/app/node_modules/sharp');
const fs = require('fs');
const { execFileSync } = require('child_process');
const dir = __dirname + '/';
const GDAL = 'C:/Program Files/QGIS 4.2.3/bin/';

const versL93 = (lonlat) => {
	const out = execFileSync(GDAL + 'gdaltransform.exe', ['-s_srs', 'EPSG:4326', '-t_srs', 'EPSG:2154', '-output_xy'], {
		input: lonlat.map(([a, b]) => `${a} ${b}`).join('\n'),
		maxBuffer: 1 << 26
	}).toString().trim().split(/\r?\n/);
	return out.map((l) => l.trim().split(/\s+/).map(Number));
};

// Polynôme de degré 2 (moindres carrés pondérés) sur coordonnées pixel
// normalisées : absorbe le dessin légèrement stylisé de la carte
const NX = 2000, NY = 1136;
const base = (x, y) => { const u = (x - NX) / NX, v = (y - NY) / NY; return [1, u, v, u * u, u * v, v * v]; };
function afin(src, dst, w) {
	const K = 6, N = Array.from({ length: K }, () => new Array(K).fill(0)), bx = new Array(K).fill(0), by = new Array(K).fill(0);
	src.forEach(([x, y], i) => {
		const v = base(x, y), p = w ? w[i] : 1;
		for (let r = 0; r < K; r++) {
			for (let c = 0; c < K; c++) N[r][c] += p * v[r] * v[c];
			bx[r] += p * v[r] * dst[i][0];
			by[r] += p * v[r] * dst[i][1];
		}
	});
	const resol = (b) => {
		const A = N.map((r, i) => [...r, b[i]]);
		for (let i = 0; i < K; i++) {
			let p = i; for (let k = i + 1; k < K; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k;
			[A[i], A[p]] = [A[p], A[i]];
			for (let k = 0; k < K; k++) if (k !== i) { const f = A[k][i] / A[i][i]; for (let j = i; j <= K; j++) A[k][j] -= f * A[i][j]; }
		}
		return A.map((r, i) => r[K] / r[i]);
	};
	return [resol(bx), resol(by)];
}
const aplicar = ([cx, cy], [x, y]) => { const v = base(x, y); let X = 0, Y = 0; for (let k = 0; k < 6; k++) { X += cx[k] * v[k]; Y += cy[k] * v[k]; } return [X, Y]; };

(async () => {
	const { gcp } = JSON.parse(fs.readFileSync(dir + 'gcp.json', 'utf8'));
	const gcpL93 = versL93(gcp.map((g) => [g.lon, g.lat]));
	let T = afin(gcp.map((g) => [g.x, g.y]), gcpL93);

	// Côte de la carte : pixel de terre voisin d'un pixel de mer (blanc ou halo cyan clair)
	const { data, info } = await sharp(dir + 'treball.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const W = info.width, H = info.height;
	const mar = new Uint8Array(W * H);
	for (let i = 0; i < W * H; i++) {
		const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
		mar[i] = r > 180 && g > 225 && b > 225 ? 1 : 0;
	}
	// La mer, c'est l'étendue claire RELIÉE AUX BORDS de l'image : les écritures et
	// pointillés blancs posés sur les terres n'en font pas partie
	{
		const conn = new Uint8Array(W * H), pila = [];
		for (let x = 0; x < W; x++) for (const y of [0, H - 1]) { const i = y * W + x; if (mar[i]) { conn[i] = 1; pila.push(i); } }
		for (let y = 0; y < H; y++) for (const x of [0, W - 1]) { const i = y * W + x; if (mar[i] && !conn[i]) { conn[i] = 1; pila.push(i); } }
		while (pila.length) {
			const p = pila.pop(), x = p % W;
			for (const q of [p - 1, p + 1, p - W, p + W]) {
				if (q < 0 || q >= W * H || conn[q] || !mar[q]) continue;
				if (Math.abs((q % W) - x) > 1) continue;
				conn[q] = 1;
				pila.push(q);
			}
		}
		mar.set(conn);
	}
	const exclus = (x, y) =>
		x < 4 || y < 4 || x > W - 5 || y > H - 5 ||
		(x > 2620 && y > 1880) || // logos du bas
		(x > 3200 && y < 330) || // logo Occitanica
		(x > 2800 && x < 3250 && y < 450) || // lac Léman et Savoie
		(x > 3350); // bord est (Italie, hors côte utile)
	const costaCarta = [];
	for (let y = 1; y < H - 1; y += 1)
		for (let x = 1; x < W - 1; x += 1) {
			const i = y * W + x;
			if (mar[i] || exclus(x, y)) continue;
			if (mar[i - 1] || mar[i + 1] || mar[i - W] || mar[i + W]) costaCarta.push([x, y]);
		}
	// un point sur trois suffit
	const pts = costaCarta.filter((_, i) => i % 3 === 0);
	console.log('ponches de còsta sus la carta :', pts.length);

	// Côte de référence (Natural Earth), densifiée tous les ~400 m
	const { COSTA } = await import(require('url').pathToFileURL(RAIZ + '/app/src/lib/acuelh/carta-estelas.js').href);
	const lignes = COSTA.map((l) => versL93(l));
	const ref = [];
	for (const l of lignes)
		for (let i = 1; i < l.length; i++) {
			const [a, b] = [l[i - 1], l[i]], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 400));
			for (let k = 0; k < n; k++) ref.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
		}
	const CEL = 5000, grilha = new Map();
	for (const p of ref) {
		const k = Math.floor(p[0] / CEL) + ',' + Math.floor(p[1] / CEL);
		if (!grilha.has(k)) grilha.set(k, []);
		grilha.get(k).push(p);
	}
	const proche = (q, rmax) => {
		let best = null, bd = rmax;
		const gx = Math.floor(q[0] / CEL), gy = Math.floor(q[1] / CEL), r = Math.ceil(rmax / CEL);
		for (let i = gx - r; i <= gx + r; i++)
			for (let j = gy - r; j <= gy + r; j++)
				for (const p of grilha.get(i + ',' + j) || []) {
					const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
					if (d < bd) { bd = d; best = p; }
				}
		return [best, bd];
	};

	const estat = (T, rmax) => {
		const d = [];
		for (const p of pts) { const [, bd] = proche(aplicar(T, p), rmax); if (bd < rmax) d.push(bd); }
		d.sort((a, b) => a - b);
		return { apariats: d.length, mediana: d[d.length >> 1] / 1000, p90: d[Math.floor(d.length * 0.9)] / 1000 };
	};
	console.log('abans ICP (vilas)   :', JSON.stringify(estat(T, 20000)));
	for (const [iter, rmax] of [[0, 20000], [1, 15000], [2, 12000], [3, 10000], [4, 8000], [5, 6000], [6, 5000], [7, 4000], [8, 4000], [9, 4000], [10, 3000], [11, 3000]]) {
		const src = [], dst = [], w = [];
		for (const p of pts) {
			const [best, bd] = proche(aplicar(T, p), rmax);
			if (best) { src.push(p); dst.push(best); w.push(1); }
		}
		gcp.forEach((g, i) => { src.push([g.x, g.y]); dst.push(gcpL93[i]); w.push(25); });
		T = afin(src, dst, w);
	}
	console.log('aprèp ICP (còsta)   :', JSON.stringify(estat(T, 20000)));
	const resVilas = gcp.map((g, i) => [g.nom, Math.hypot(...aplicar(T, [g.x, g.y]).map((v, k) => v - gcpL93[i][k])) / 1000]);
	resVilas.sort((a, b) => b[1] - a[1]);
	console.log('écart moyen des villes après :', (Math.sqrt(resVilas.reduce((s, r) => s + r[1] * r[1], 0) / resVilas.length)).toFixed(1), 'km ; les plus écartées :', resVilas.slice(0, 5).map((r) => r[0] + ' ' + r[1].toFixed(1)).join(', '));
	fs.writeFileSync(dir + 'transfo.json', JSON.stringify({ T, W, H, srs: 'EPSG:2154' }));
})();
