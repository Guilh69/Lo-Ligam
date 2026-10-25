// Òbras (2026-10-25) : quand Romain colle le lien Bandcamp d'un artiste, on
// lit la page publique pour lui éviter de taper : le nom de l'artiste
// (og:site_name) et le lecteur officiel d'un de ses albums (le numéro est
// dans « bc-page-properties »). La demande passe par notre serveur, pas par
// le navigateur ; seules les pages *.bandcamp.com sont lues (rien d'autre ne
// peut transiter par ici). Réponses gardées un jour en mémoire.
//
//   GET /api/bandcamp?u=https://cocanha.bandcamp.com
//   → { nom: 'Cocanha', imatge: 'https://f4.bcbits.com/img/…', lector: 'https://bandcamp.com/EmbeddedPlayer/album=…/' }
import { json } from '@sveltejs/kit';

// (en ASCII : un « Ò » dans l'en-tête fait refuser la demande)
const UA = 'LoLigam/1.0 (+https://loligam.eu)';
const DURADA = 24 * 3600 * 1000;
const cache = new Map();

const legir = async (u) => {
	const r = await fetch(u, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(6000), redirect: 'follow' });
	return r.ok ? r.text() : null;
};
const meta = (html, re) => html.match(re)?.[1]?.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'") ?? null;
const proprietats = (html) => {
	try {
		return JSON.parse(meta(html, /name="bc-page-properties" content="([^"]*)"/) ?? 'null');
	} catch {
		return null;
	}
};
// (lecteur compact aux couleurs du site sombre : fond braise, liens or)
const lector = (mena, id) =>
	`https://bandcamp.com/EmbeddedPlayer/${mena}=${id}/size=large/bgcol=22100a/linkcol=f6b73c/artwork=small/tracklist=false/transparent=true/`;

export async function GET({ url }) {
	let u;
	try {
		u = new URL(url.searchParams.get('u') ?? '');
	} catch {
		return json({ error: 'ligam' }, { status: 400 });
	}
	if (u.protocol !== 'https:' || !/^[a-z0-9-]+\.bandcamp\.com$/.test(u.hostname)) return json({ error: 'ligam' }, { status: 400 });
	const clau = u.origin + u.pathname;
	const c = cache.get(clau);
	if (c && Date.now() - c.t < DURADA) return json(c.r);

	const html = await legir(clau).catch(() => null);
	if (!html) return json({ error: 'pagina' }, { status: 502 });
	const nom = meta(html, /property="og:site_name" content="([^"]*)"/);
	// l'image de la page collée (sur la page de l'artiste : sa photo, ou sa
	// dernière pochette), copiée ensuite par /api/bandcamp/imatge
	const imatge = meta(html, /property="og:image" content="(https:\/\/f\d\.bcbits\.com\/img\/[a-z0-9]+_\d+\.jpg)"/);
	let p = proprietats(html);
	// page de l'artiste (accueil, /music) : on prend son premier album ou titre
	if (!p || !['a', 't'].includes(p.item_type)) {
		const premier = html.match(/href="(\/(?:album|track)\/[a-z0-9-]+)"/)?.[1];
		const autra = premier ? await legir(u.origin + premier).catch(() => null) : null;
		p = autra ? proprietats(autra) : null;
	}
	const r = {
		nom,
		imatge,
		lector: p && ['a', 't'].includes(p.item_type) && /^\d+$/.test(String(p.item_id)) ? lector(p.item_type === 'a' ? 'album' : 'track', p.item_id) : null
	};
	cache.set(clau, { t: Date.now(), r });
	return json(r);
}
