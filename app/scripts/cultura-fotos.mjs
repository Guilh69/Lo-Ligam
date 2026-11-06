// Petites images des fiches de Cultura (2026-11-06) : pour chaque fiche de
// src/lib/cultura/imatges.js, deux largeurs tirées de la plus grande photo
// de paysage déjà en ligne (static/apren/paisatges, sans métadonnée).
// Recadrées en 3:2 autour du point pos de la fiche. WebP 50, sans métadonnée (sharp n'en recopie aucune par défaut).
// Les fiches de COMMONS (photos libres de Wikimedia Commons) partent de leur
// source réduite, gardée hors Git, et ont aussi une grande taille pour la fiche.
// Usage : cd app ; node scripts/cultura-fotos.mjs [--planca]
//   --planca : une planche de contrôle dans le dossier temporaire.
import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { homedir, tmpdir } from 'node:os';
import { FOTOS, COMMONS, STOCK, AMPLES, amples } from '../src/lib/cultura/imatges.js';
import { PAISATGES } from '../src/lib/paisatges/paisatges.js';

const DEST = 'static/cultura';
mkdirSync(DEST, { recursive: true });

let total = 0;
// recadrage en 3:2 autour du point pos (« x% y% ») de la fiche ; zoom > 1 :
// un cadre plus serré (pour laisser hors champ un numéro de maison, par exemple)
const RATIO = 3 / 2;
async function tirar(id, src, pos, largors, zoom = 1, colors = false) {
	const [px, py] = pos.split(' ').map((v) => parseFloat(v) / 100);
	const { width: w, height: h } = await sharp(src).metadata();
	const cw = Math.round(Math.min(w, Math.round(h * RATIO)) / zoom), ch = Math.round(cw / RATIO);
	const left = Math.round(Math.min(w - cw, Math.max(0, px * w - cw / 2)));
	const top = Math.round(Math.min(h - ch, Math.max(0, py * h - ch / 2)));
	for (const a of largors) {
		const out = join(DEST, `${id}-${a}.webp`);
		let img = sharp(src).extract({ left, top, width: cw, height: ch }).resize({ width: a, withoutEnlargement: true });
		// la grande taille ne sert qu'en tête de fiche, où la photo est passée
		// en gris sous un voile : en gris et à peine adoucie, elle pèse moitié
		// moins sans différence visible (comparé en capture le 06-11 : 166 → 83 Ko) ;
		// sauf une photo laissée en couleurs (colors)
		if (a >= 1200 && !colors) img = img.grayscale().blur(0.6);
		await img.webp({ quality: a >= 1200 ? 45 : 50, effort: 6 }).toFile(out);
		total += statSync(out).size;
	}
	return cw;
}
for (const [id, { clau, pos }] of Object.entries(FOTOS)) {
	const p = PAISATGES.find((x) => x.clau === clau);
	if (!p) throw new Error(`paysage inconnu : ${clau} (${id})`);
	await tirar(id, `static/apren/paisatges/${clau}-${p.amples[p.amples.length - 1]}.webp`, pos, AMPLES);
}
// photos libres de Wikimedia Commons et autres photos du stock de Romain :
// la source est hors Git (LO_LIGAM_HORS_GIT, sinon
// Documents/6_Projectes/Lo_Ligam_hors-git) ; aucune métadonnée (GPS) n'est recopiée
const HORS_GIT = process.env.LO_LIGAM_HORS_GIT ?? join(homedir(), 'Documents', '6_Projectes', 'Lo_Ligam_hors-git');
const EXTERNS = [
	...Object.entries(COMMONS).map(([id, c]) => [id, c, join('design-stock', 'brut', 'commons-cultura')]),
	...Object.entries(STOCK).map(([id, c]) => [id, c, join('design-stock', 'Fotos', 'Bases_foto')])
];
for (const [id, c, dossier] of EXTERNS) {
	const src = join(HORS_GIT, dossier, c.font);
	if (!existsSync(src)) {
		console.warn(`source absente, images gardées telles quelles : ${src}`);
		continue;
	}
	const cw = await tirar(id, src, c.pos, amples(id), c.zoom, c.colors);
	if (cw !== c.largor) throw new Error(`${id} : largor ${c.largor} dans imatges.js, ${cw} en vrai`);
	if (c.objecte) {
		// l'objet entier, sans recadrage, pour le bout de la case de la fiche
		const out = join(DEST, `${id}-objecte.webp`);
		await sharp(src).resize({ height: 700, withoutEnlargement: true }).webp({ quality: 50, effort: 6 }).toFile(out);
		total += statSync(out).size;
	}
}
const n = Object.keys(FOTOS).length + EXTERNS.length;
console.log(`${n} fiches, ${Math.round(total / 1024)} Ko en tout`);

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
