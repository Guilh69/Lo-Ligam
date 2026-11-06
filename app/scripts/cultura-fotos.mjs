// Petites images des fiches de Cultura (2026-11-06) : pour chaque fiche de
// src/lib/cultura/imatges.js, deux largeurs tirées de la plus grande photo
// de paysage déjà en ligne (static/apren/paisatges, sans métadonnée).
// Recadrées en 3:2 autour du point pos de la fiche. WebP 50, sans métadonnée (sharp n'en recopie aucune par défaut).
// Usage : cd app ; node scripts/cultura-fotos.mjs [--planca]
//   --planca : une planche de contrôle dans le dossier temporaire.
import sharp from 'sharp';
import { mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { FOTOS, AMPLES } from '../src/lib/cultura/imatges.js';
import { PAISATGES } from '../src/lib/paisatges/paisatges.js';

const DEST = 'static/cultura';
mkdirSync(DEST, { recursive: true });

let total = 0;
// recadrage en 3:2 autour du point pos (« x% y% ») de la fiche
const RATIO = 3 / 2;
for (const [id, { clau, pos }] of Object.entries(FOTOS)) {
	const p = PAISATGES.find((x) => x.clau === clau);
	if (!p) throw new Error(`paysage inconnu : ${clau} (${id})`);
	const src = `static/apren/paisatges/${clau}-${p.amples[p.amples.length - 1]}.webp`;
	for (const a of AMPLES) {
		const out = join(DEST, `${id}-${a}.webp`);
		const [px, py] = pos.split(' ').map((v) => parseFloat(v) / 100);
		const { width: w, height: h } = await sharp(src).metadata();
		const cw = Math.min(w, Math.round(h * RATIO)), ch = Math.round(cw / RATIO);
		const left = Math.round(Math.min(w - cw, Math.max(0, px * w - cw / 2)));
		const top = Math.round(Math.min(h - ch, Math.max(0, py * h - ch / 2)));
		await sharp(src)
			.extract({ left, top, width: cw, height: ch })
			.resize({ width: a, withoutEnlargement: true })
			.webp({ quality: 50, effort: 6 })
			.toFile(out);
		total += statSync(out).size;
	}
}
console.log(`${Object.keys(FOTOS).length} fiches, ${AMPLES.length} tailles, ${Math.round(total / 1024)} Ko en tout`);

if (process.argv.includes('--planca')) {
	const ids = Object.keys(FOTOS);
	const W = 300, H = 200, COL = 6;
	const tuiles = await Promise.all(
		ids.map(async (id, k) => ({
			input: await sharp(join(DEST, `${id}-480.webp`)).resize(W, H, { fit: 'cover' }).toBuffer(),
			left: (k % COL) * W,
			top: Math.floor(k / COL) * H
		}))
	);
	const out = join(tmpdir(), 'cultura-planca.png');
	await sharp({ create: { width: COL * W, height: Math.ceil(ids.length / COL) * H, channels: 3, background: '#222' } })
		.composite(tuiles)
		.png()
		.toFile(out);
	console.log('planche :', out, '·', ids.join(' '));
}
