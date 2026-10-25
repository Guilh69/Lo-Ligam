// Espace musique (2026-10-25, Romain : « tout vient de Deezer », on tape le
// nom de l'artiste) : l'API publique de Deezer répond sans compte ni clé. La
// demande part de notre serveur, jamais du navigateur du visiteur ; les
// adresses d'images renvoyées ne sont affichées qu'après son accord.
// Réponses gardées un jour en mémoire.
const API = 'https://api.deezer.com';
const DURADA = 24 * 3600 * 1000;
const cache = new Map();

async function legir(camin) {
	const c = cache.get(camin);
	if (c && Date.now() - c.t < DURADA) return c.r;
	const r = await fetch(API + camin, { signal: AbortSignal.timeout(6000) })
		.then((x) => (x.ok ? x.json() : null))
		.catch(() => null);
	if (r && !r.error) cache.set(camin, { t: Date.now(), r });
	return r?.error ? null : r;
}

const net = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

/** les artistes qui portent ce nom (pour que Romain choisisse le bon) */
export async function cercarArtistas(nom, n = 5) {
	const r = await legir(`/search/artist?q=${encodeURIComponent(nom)}&limit=${n}`);
	return (r?.data ?? []).map((a) => ({ id: a.id, nom: a.name, imatge: a.picture_medium, albums: a.nb_album }));
}

/** la fiche d'un artiste : photo, dernier album, titres les plus écoutés */
export async function fichaArtista(id) {
	const [a, top, albums] = await Promise.all([legir(`/artist/${id}`), legir(`/artist/${id}/top?limit=3`), legir(`/artist/${id}/albums?limit=1`)]);
	if (!a?.id) return null;
	const al = albums?.data?.[0];
	return {
		id: a.id,
		nom: a.name,
		ligam: a.link,
		imatge: a.picture_big,
		album: al ? { titol: al.title, annada: al.release_date?.slice(0, 4) ?? '', cobèrta: al.cover_medium, ligam: al.link } : null,
		titols: (top?.data ?? []).map((t) => t.title_short || t.title)
	};
}

/** d'un nom à sa fiche : le premier artiste dont le nom correspond exactement */
export async function fichaPerNom(nom) {
	const lista = await cercarArtistas(nom, 5);
	const bon = lista.find((a) => net(a.nom) === net(nom)) ?? lista[0];
	return bon ? fichaArtista(bon.id) : null;
}
