// Détecte les pastilles blanches des villes sur la carte Occitanica (version
// 4000 px) et les associe aux villes connues : points de calage (GCP).
const sharp = require('C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/node_modules/sharp');
const fs = require('fs');
const dir = __dirname + '/';

// Positions approximatives lues sur l'aperçu de 1600 px (× 2,5 pour 4000 px),
// et coordonnées réelles (lon, lat) des villes
const VILAS = [
	['Bordeaux', 371, 402, -0.5792, 44.8378], ['Toulouse', 626, 621, 1.4442, 43.6047], ['Montpellier', 936, 612, 3.8767, 43.6108],
	['Marseille', 1113, 662, 5.3698, 43.2965], ['Nice', 1347, 563, 7.262, 43.7102], ['Toulon', 1186, 690, 5.928, 43.1242],
	['Limoges', 601, 227, 1.2611, 45.8336], ['Clermont-Ferrand', 845, 229, 3.087, 45.7772], ['Pau', 388, 668, -0.3707, 43.2951],
	['Tarbes', 452, 677, 0.0781, 43.2328], ['Perpignan', 801, 776, 2.8954, 42.6887], ['Lyon', 1036, 241, 4.8357, 45.764],
	['Grenoble', 1148, 333, 5.7245, 45.1885], ['Avignon', 1047, 545, 4.8055, 43.9493], ['Nîmes', 988, 568, 4.3601, 43.8367],
	['Valence', 1046, 371, 4.8924, 44.9334], ['Poitiers', 476, 89, 0.3404, 46.5802], ['La Rochelle', 310, 153, -1.1508, 46.1603],
	['Annecy', 1189, 210, 6.1294, 45.8992], ['Agen', 524, 509, 0.6206, 44.2033], ['Cahors', 627, 451, 1.4405, 44.4475],
	['Rodez', 783, 470, 2.5755, 44.3506], ['Mende', 868, 466, 3.4993, 44.5181], ['Carcassonne', 733, 684, 2.3491, 43.213],
	['Angoulême', 470, 249, 0.1561, 45.6484], ['Périgueux', 546, 349, 0.7218, 45.1846], ['Gap', 1199, 443, 6.0794, 44.5594],
	['Digne', 1218, 519, 6.2356, 44.0925], ['Montauban', 606, 549, 1.3528, 44.0176], ['Albi', 698, 567, 2.1486, 43.9289],
	['Aurillac', 738, 389, 2.444, 44.9264], ['Le Puy', 924, 366, 3.8855, 45.0434], ['Privas', 1011, 434, 4.5986, 44.7353],
	['Tulle', 657, 332, 1.7708, 45.2658], ['Guéret', 674, 160, 1.8717, 46.1716], ['Moulins', 851, 104, 3.3333, 46.5664],
	['Mâcon', 1036, 133, 4.8286, 46.3069], ['Saint-Étienne', 987, 293, 4.3872, 45.4397], ['Chambéry', 1175, 264, 5.9178, 45.5646],
	['Auch', 516, 618, 0.5858, 43.646], ['Niort', 383, 129, -0.4646, 46.3237], ['Châteauroux', 654, 52, 1.6913, 46.8103],
	['Bourg-en-Bresse', 1080, 165, 5.2257, 46.2052], ['Lons-le-Saunier', 1122, 68, 5.5547, 46.6747],
	['La Roche-sur-Yon', 278, 76, -1.4269, 46.6705], ['Foix', 640, 735, 1.6053, 42.9653], ['Mont-de-Marsan', 424, 562, -0.4991, 43.8902]
];

(async () => {
	const { data, info } = await sharp(dir + 'treball.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const W = info.width, H = info.height, C = info.channels;
	const blanc = new Uint8Array(W * H);
	for (let i = 0; i < W * H; i++) {
		const r = data[i * C], g = data[i * C + 1], b = data[i * C + 2];
		blanc[i] = r > 232 && g > 232 && b > 232 ? 1 : 0;
	}
	// composantes connexes des pixels blancs
	const vist = new Uint8Array(W * H), pastilhas = [];
	const pila = new Int32Array(W * H);
	for (let s = 0; s < W * H; s++) {
		if (!blanc[s] || vist[s]) continue;
		let n = 0, sx = 0, sy = 0, x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1, top = 0;
		pila[top++] = s;
		vist[s] = 1;
		while (top) {
			const p = pila[--top], x = p % W, y = (p / W) | 0;
			n++; sx += x; sy += y;
			if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
			for (const q of [p - 1, p + 1, p - W, p + W]) {
				if (q < 0 || q >= W * H || vist[q] || !blanc[q]) continue;
				if (Math.abs((q % W) - x) > 1) continue;
				vist[q] = 1;
				pila[top++] = q;
			}
		}
		const w = x1 - x0 + 1, h = y1 - y0 + 1;
		const remp = n / (w * h);
		if (w >= 12 && w <= 30 && h >= 12 && h <= 30 && Math.abs(w - h) <= 4 && remp > 0.66) pastilhas.push({ x: sx / n, y: sy / n, w, h, n });
	}
	console.log('pastilhas detectadas :', pastilhas.length);
	const gcp = [];
	for (const [nom, px, py, lon, lat] of VILAS) {
		const ax = px * 2.5, ay = py * 2.5;
		let best = null, bd = Infinity;
		for (const p of pastilhas) {
			const d = Math.hypot(p.x - ax, p.y - ay);
			if (d < bd) { bd = d; best = p; }
		}
		if (best && bd < 40) gcp.push({ nom, x: +best.x.toFixed(1), y: +best.y.toFixed(1), lon, lat, ecart: +bd.toFixed(1) });
		else console.log('  pas trobada :', nom, bd.toFixed(0));
	}
	fs.writeFileSync(dir + 'gcp.json', JSON.stringify({ W, H, gcp }, null, 1));
	console.log('GCP :', gcp.length, '/', VILAS.length);
	console.log(gcp.map((g) => g.nom + ' ' + g.ecart).join(' | '));
})();
