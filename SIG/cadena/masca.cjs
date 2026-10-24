const RAIZ = require('path').resolve(__dirname, '..', '..'); // racine du projet, où qu'il soit
// Masque du domaine occitan sur la carte Occitanica (pixels colorés : violet,
// magenta, rose, orangé), nettoyé : rivières, pointillés et écritures
// bouchés par fermeture morphologique et remplissage des petits trous.
const sharp = require(RAIZ + '/app/node_modules/sharp');
const fs = require('fs');
const dir = __dirname + '/';

const hsv = (r, g, b) => {
	r /= 255; g /= 255; b /= 255;
	const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
	let h = 0;
	if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
	h *= 60; if (h < 0) h += 360;
	return [h, mx ? d / mx : 0, mx];
};

(async () => {
	const { data, info } = await sharp(dir + 'treball.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const W = info.width, H = info.height;
	let m = new Uint8Array(W * H);
	for (let i = 0; i < W * H; i++) {
		const [h, s, v] = hsv(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
		// violet → magenta → rouge → orange ; le gris (peu saturé) et le cyan exclus
		m[i] = s > 0.3 && v > 0.35 && (h >= 255 || h <= 40) ? 1 : 0;
	}
	// logos (bas à droite, haut à droite) : hors carte
	for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((x > 2620 && y > 1880) || (x > 3200 && y < 330)) m[y * W + x] = 0;

	const dilater = (a, r) => {
		const b = new Uint8Array(W * H);
		// passes séparables (carré de côté 2r+1)
		const t = new Uint8Array(W * H);
		for (let y = 0; y < H; y++) { let c = 0; for (let x = -r; x < W; x++) { if (x + r < W && a[y * W + x + r]) c++; if (x - r - 1 >= 0 && a[y * W + x - r - 1]) c--; if (x >= 0) t[y * W + x] = c > 0 ? 1 : 0; } }
		for (let x = 0; x < W; x++) { let c = 0; for (let y = -r; y < H; y++) { if (y + r < H && t[(y + r) * W + x]) c++; if (y - r - 1 >= 0 && t[(y - r - 1) * W + x]) c--; if (y >= 0) b[y * W + x] = c > 0 ? 1 : 0; } }
		return b;
	};
	const eroder = (a, r) => { const inv = a.map((v) => 1 - v); return dilater(inv, r).map((v) => 1 - v); };
	// fermeture : rivières (3-5 px) et pointillés bouchés
	m = eroder(dilater(m, 5), 5);

	// composantes connexes : valeur 0 (trous) entourées de 1, et petites îles de 1
	const etiquetas = (val) => {
		const lab = new Int32Array(W * H).fill(-1), tailles = [], bord = [];
		const pila = new Int32Array(W * H);
		let n = 0;
		for (let s = 0; s < W * H; s++) {
			if (m[s] !== val || lab[s] >= 0) continue;
			let top = 0, t = 0, touche = false;
			pila[top++] = s; lab[s] = n;
			while (top) {
				const p = pila[--top], x = p % W, y = (p / W) | 0;
				t++;
				if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touche = true;
				for (const q of [p - 1, p + 1, p - W, p + W]) {
					if (q < 0 || q >= W * H || lab[q] >= 0 || m[q] !== val) continue;
					if (Math.abs((q % W) - x) > 1) continue;
					lab[q] = n; pila[top++] = q;
				}
			}
			tailles.push(t); bord.push(touche); n++;
		}
		return { lab, tailles, bord };
	};
	// trous intérieurs de moins de 4000 px (≈ 250 km²) : écritures, pastilles
	{
		const { lab, tailles, bord } = etiquetas(0);
		for (let i = 0; i < W * H; i++) if (m[i] === 0 && !bord[lab[i]] && tailles[lab[i]] < 4000) m[i] = 1;
	}
	// îlots colorés de moins de 3000 px : bruit (logos, légendes)
	{
		const { lab, tailles } = etiquetas(1);
		for (let i = 0; i < W * H; i++) if (m[i] === 1 && tailles[lab[i]] < 3000) m[i] = 0;
	}
	const out = Buffer.alloc(W * H);
	for (let i = 0; i < W * H; i++) out[i] = m[i] ? 255 : 0;
	await sharp(out, { raw: { width: W, height: H, channels: 1 } }).png().toFile(dir + 'masca.png');
	// aperçu : masque en surimpression
	const ap = Buffer.alloc(W * H * 3);
	for (let i = 0; i < W * H; i++) {
		ap[i * 3] = m[i] ? 255 : data[i * 3] * 0.5;
		ap[i * 3 + 1] = m[i] ? data[i * 3 + 1] * 0.3 : data[i * 3 + 1] * 0.5;
		ap[i * 3 + 2] = m[i] ? data[i * 3 + 2] * 0.3 : data[i * 3 + 2] * 0.5;
	}
	await sharp(ap, { raw: { width: W, height: H, channels: 3 } }).resize(1600).jpeg({ quality: 80 }).toFile(dir + 'masca-apercu.jpg');
	console.log('ok', W, H);
})();
