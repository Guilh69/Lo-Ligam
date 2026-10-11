// La fòto d'una comuna, relaiada per nòstre servidor (l'IP del visitaire va
// pas a Wikimedia) : sonque las vinhetas de upload. e thumb.wikimedia.org.
const UA = 'LoLigam/1.0 (https://loligam.eu ; carta de las lengas)';

export async function GET({ url }) {
	const u = url.searchParams.get('u') ?? '';
	let cibla;
	try {
		cibla = new URL(u);
	} catch {
		return new Response('', { status: 400 });
	}
	if (cibla.protocol !== 'https:' || !['upload.wikimedia.org', 'thumb.wikimedia.org'].includes(cibla.hostname)) return new Response('', { status: 400 });
	const r = await fetch(cibla, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) }).catch(() => null);
	if (!r?.ok) return new Response('', { status: 502 });
	const tipe = r.headers.get('content-type') ?? '';
	if (!tipe.startsWith('image/')) return new Response('', { status: 415 });
	return new Response(r.body, { headers: { 'content-type': tipe, 'cache-control': 'public, max-age=2592000, immutable' } });
}
