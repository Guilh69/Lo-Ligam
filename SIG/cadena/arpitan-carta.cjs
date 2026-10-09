// Lo domeni arpitan d'aprèp la carta d'arpitania.eu (demanda de Romain, 2026-10-09) :
// calatge de la carta, masca de la zòna crèma, puèi part de cada comuna dins
// aquesta masca e dins lo domeni occitan de la carta.
//
//   node SIG/cadena/arpitan-carta.cjs
//
// Entradas :
//  - Modules_cors/Autras_lengas/Arpitan_francoprovencal_map.jpg : « Geographic
//    distribution of Arpitan », Savoyerli / arpitania.eu, 2009, Wikimedia Commons,
//    CC BY-SA 3.0 (e GFDL) ;
//  - SIG/arpitan/gcp-arpitania.csv : 60 vilas de la carta (ponch en pixèls) amb
//    lors coordenadas (Wikidata o comuna IGN) ;
//  - SIG/brut/arpitan/*.geojson (arpitan-brut.mjs) e app/static/data/limits-carta.json.
// Sortidas (dins SIG/brut/arpitan/, pas seguit per Git) :
//  - calatge.json (polinòmi de gra 2, pixèls <-> km), masca.png ;
//  - parts-comunas.json : [{ src, id, nom, dep, pop, arp, occ }], arp = part de
//    la comuna dins la masca, occ = part dins lo domeni occitan (grasilha de
//    ponches, environ 300 m a 1 km segon la talha de la comuna).
//
// Calatge del 2026-10-09 : escart mejan 1,5 km (lo pus marrit 4 km, Savièsa).
// La Clusa es tirada (ponch mal identificat). Lo contorn de la carta es
// esquematic (bòrds lisses) : a l'escala de la comuna, sonque la part ≥ 50 % compta.
const fs = require('fs'), path = require('path');
const RAIC = path.resolve(__dirname, '../..');
const B = path.join(RAIC, 'SIG/brut/arpitan');
const sharp = require(path.join(RAIC, 'app/node_modules/sharp'));

// --- calatge -----------------------------------------------------------------
const K = Math.cos((46 * Math.PI) / 180);
const km = ([lon, lat]) => [(lon - 6) * 111.32 * K, (lat - 46) * 110.57];
const base = (x, y) => [1, x, y, x * x, x * y, y * y];
const dot = (c, v) => c.reduce((s, ci, i) => s + ci * v[i], 0);
function lsq(A, b) {
	const n = A[0].length, M = Array.from({ length: n }, () => Array(n + 1).fill(0));
	A.forEach((r, k) => { for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) M[i][j] += r[i] * r[j]; M[i][n] += r[i] * b[k]; } });
	for (let i = 0; i < n; i++) {
		let p = i;
		for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[p][i])) p = k;
		[M[i], M[p]] = [M[p], M[i]];
		for (let k = 0; k < n; k++) if (k !== i) { const f = M[k][i] / M[i][i]; for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j]; }
	}
	return M.map((r, i) => r[n] / r[i]);
}
const gcp = fs.readFileSync(path.join(RAIC, 'SIG/arpitan/gcp-arpitania.csv'), 'utf8').trim().split('\n').slice(1)
	.map((l) => l.split(';')).map(([n, x, y, lon, lat]) => ({ n, px: [+x, +y], km: km([+lon, +lat]) }));
const A = gcp.map((p) => base(p.px[0] / 100, p.px[1] / 100)), Bk = gcp.map((p) => base(p.km[0] / 100, p.km[1] / 100));
const T = { K, cx: lsq(A, gcp.map((p) => p.km[0])), cy: lsq(A, gcp.map((p) => p.km[1])), ix: lsq(Bk, gcp.map((p) => p.px[0])), iy: lsq(Bk, gcp.map((p) => p.px[1])) };
const errs = gcp.map((p) => { const b = base(p.px[0] / 100, p.px[1] / 100); return Math.hypot(dot(T.cx, b) - p.km[0], dot(T.cy, b) - p.km[1]); });
console.log(`calatge : ${gcp.length} vilas, escart mejan ${(errs.reduce((a, b) => a + b, 0) / errs.length).toFixed(1)} km, max ${Math.max(...errs).toFixed(1)} km`);
fs.writeFileSync(path.join(B, 'calatge.json'), JSON.stringify(T));
const toPx = (p) => { const [x, y] = km(p); const b = base(x / 100, y / 100); return [dot(T.ix, b), dot(T.iy, b)]; };

(async () => {
	// --- masca : zòna crèma, grandas compausantas (sens l'encart de las Polhas ni
	// lo cadre roge), dilatacion 3 px, traucs emplenats, erosion 3 px
	const { data, info } = await sharp(path.join(RAIC, 'Modules_cors/Autras_lengas/Arpitan_francoprovencal_map.jpg')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const W = info.width, H = info.height, n = info.channels, N = W * H;
	const m = new Uint8Array(N);
	for (let i = 0; i < N; i++) { const r = data[i * n], g = data[i * n + 1], b = data[i * n + 2]; m[i] = r > 225 && g > 220 && b < 225 && r - b > 18 ? 1 : 0; }
	const lab = new Uint8Array(N), keep = new Uint8Array(N);
	for (let s = 0; s < N; s++) {
		if (!m[s] || lab[s]) continue;
		const st = [s], memb = [];
		lab[s] = 1;
		while (st.length) {
			const p = st.pop(); memb.push(p); const x = p % W;
			for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W]) if (q >= 0 && q < N && m[q] && !lab[q]) { lab[q] = 1; st.push(q); }
		}
		if (memb.length < 300) continue;
		let sx = 0, sy = 0;
		for (const p of memb) { sx += p % W; sy += (p / W) | 0; }
		sx /= memb.length; sy /= memb.length;
		if ((sx > 880 && sy > 470) || (sx > 860 && sy < 200)) continue;
		for (const p of memb) keep[p] = 1;
	}
	const morf = (a, r, v) => {
		const o = new Uint8Array(N);
		for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
			let hit = false;
			for (let dy = -r; dy <= r && !hit; dy++) for (let dx = -r; dx <= r; dx++) {
				const X = x + dx, Y = y + dy, val = X < 0 || Y < 0 || X >= W || Y >= H ? 0 : a[Y * W + X];
				if (val === v) { hit = true; break; }
			}
			o[y * W + x] = hit === (v === 1) ? 1 : 0;
		}
		return o;
	};
	let d = morf(keep, 3, 1);
	const defòra = new Uint8Array(N), st = [];
	for (let x = 0; x < W; x++) st.push(x, (H - 1) * W + x);
	for (let y = 0; y < H; y++) st.push(y * W, y * W + W - 1);
	while (st.length) {
		const p = st.pop();
		if (defòra[p] || d[p]) continue;
		defòra[p] = 1; const x = p % W;
		if (x > 0) st.push(p - 1); if (x < W - 1) st.push(p + 1); if (p >= W) st.push(p - W); if (p < N - W) st.push(p + W);
	}
	for (let i = 0; i < N; i++) d[i] = defòra[i] ? 0 : 1;
	d = morf(d, 3, 0);
	await sharp(Buffer.from(d.map((v) => v * 255)), { raw: { width: W, height: H, channels: 1 } }).png().toFile(path.join(B, 'masca.png'));
	const dinsMasca = (p) => { const [x, y] = toPx(p).map(Math.round); return x >= 0 && y >= 0 && x < W && y < H && d[y * W + x] === 1; };

	// --- domeni occitan (anèls en « evenodd »)
	const occ = JSON.parse(fs.readFileSync(path.join(RAIC, 'app/static/data/limits-carta.json'), 'utf8')).domeni.anels;
	const bbox = (a) => a.reduce(([x0, y0, x1, y1], [x, y]) => [Math.min(x0, x), Math.min(y0, y), Math.max(x1, x), Math.max(y1, y)], [1e9, 1e9, -1e9, -1e9]);
	const inRing = ([x, y], a) => { let c = false; for (let i = 0, j = a.length - 1; i < a.length; j = i++) { const [xi, yi] = a[i], [xj, yj] = a[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
	const occBB = occ.map(bbox);
	const dinsOcc = (p) => { let c = false; occ.forEach((a, i) => { const b = occBB[i]; if (p[0] >= b[0] && p[0] <= b[2] && p[1] >= b[1] && p[1] <= b[3] && inRing(p, a)) c = !c; }); return c; };

	// --- part de cada comuna
	const res = [];
	const FICS = [['comunas-fr', 'insee'], ['soissa-comunas', 'swisstopo:BFS_NUMMER'], ['val-d-aosta-comunas', 'ref:ISTAT'], ['piemont-comunas', 'ref:ISTAT'], ['piemont-extra-comunas', 'ref:ISTAT'], ['polha-comunas', 'ref:ISTAT']];
	for (const [fic, id] of FICS) {
		const g = JSON.parse(fs.readFileSync(path.join(B, fic + '.geojson'), 'utf8'));
		for (const f of g.features) {
			const rings = (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).flat();
			const [x0, y0, x1, y1] = bbox(rings.flat());
			const pas = Math.max(0.0025, Math.min(x1 - x0, y1 - y0) / 12);
			let t = 0, a = 0, o = 0;
			for (let y = y0 + pas / 2; y < y1; y += pas) for (let x = x0 + pas / 2; x < x1; x += pas) {
				let c = false;
				for (const r of rings) if (inRing([x, y], r)) c = !c;
				if (!c) continue;
				t++; if (dinsMasca([x, y])) a++; if (dinsOcc([x, y])) o++;
			}
			if (!t) { const p = rings[0][0]; t = 1; a = +dinsMasca(p); o = +dinsOcc(p); }
			const p = f.properties;
			res.push({ src: fic, id: String(p[id] ?? ''), nom: p.nom || p.name, dep: p.departement || p.canton || '', pop: p.population ?? null, arp: +(a / t).toFixed(2), occ: +(o / t).toFixed(2) });
		}
	}
	fs.writeFileSync(path.join(B, 'parts-comunas.json'), JSON.stringify(res));
	const c = {};
	for (const r of res) { const k = `${r.src} ${r.arp >= 0.5 ? 'carta' : '-'}${r.occ >= 0.5 ? ' occ' : ''}`; c[k] = (c[k] || 0) + 1; }
	console.log(c);
})();
