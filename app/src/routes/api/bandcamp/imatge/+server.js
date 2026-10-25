// Òbras (2026-10-25, option A de Romain) : l'image d'un artiste, celle que sa
// page Bandcamp donne pour les partages (og:image), copiée une fois par notre
// serveur et allégée (WebP de 480 px, une vingtaine de Ko). L'éditeur la range
// ensuite dans le stockage des images du site : les visiteurs ne la chargent
// jamais chez Bandcamp, qui ne reçoit rien avant « Escotar ».
//
//   GET /api/bandcamp/imatge?u=https://f4.bcbits.com/img/a2932183413_5.jpg
//   → image/webp
import { error } from '@sveltejs/kit';
import sharp from 'sharp';

const UA = 'LoLigam/1.0 (+https://loligam.eu)';

export async function GET({ url }) {
	let u;
	try {
		u = new URL(url.searchParams.get('u') ?? '');
	} catch {
		error(400, 'ligam');
	}
	// seulement les images de Bandcamp : rien d'autre ne peut transiter par ici
	const m = u.protocol === 'https:' && /^f\d\.bcbits\.com$/.test(u.hostname) && u.pathname.match(/^\/img\/([a-z0-9]+)_\d+\.jpg$/);
	if (!m) error(400, 'ligam');
	// (taille 16 = 700 px : assez pour une pochette nette sur un écran dense)
	const r = await fetch(`https://${u.hostname}/img/${m[1]}_16.jpg`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) }).catch(() => null);
	if (!r?.ok) error(502, 'imatge');
	const webp = await sharp(Buffer.from(await r.arrayBuffer()))
		.resize(480, 480, { fit: 'cover' })
		.webp({ quality: 72 })
		.toBuffer();
	return new Response(webp, { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'private, max-age=86400' } });
}
