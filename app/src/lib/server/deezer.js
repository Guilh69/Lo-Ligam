// Espace musique (2026-10-25, Romain : « tout vient de Deezer », on tape le
// nom de l'artiste) : l'API publique de Deezer répond sans compte ni clé. La
// demande part de notre serveur, jamais du navigateur du visiteur ; les
// adresses d'images renvoyées ne sont affichées qu'après son accord.
// On ne garde chez nous que l'identifiant Deezer de chaque artiste (liste
// triée par Romain, table pagina_elements) : photo et dernier album sont
// relus chez Deezer, une fois par jour, en arrière-plan.
const API = 'https://api.deezer.com';
const JORN = 24 * 3600 * 1000;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function legir(camin) {
	const r = await fetch(API + camin, { signal: AbortSignal.timeout(6000) })
		.then((x) => (x.ok ? x.json() : null))
		.catch(() => null);
	return r && !r.error ? r : null;
}

/** les artistes qui portent ce nom (pour que Romain choisisse le bon) */
export async function cercarArtistas(nom, n = 6) {
	const r = await legir(`/search/artist?q=${encodeURIComponent(nom)}&limit=${n}`);
	return (r?.data ?? []).map((a) => ({ id: a.id, nom: a.name, imatge: a.picture_medium, albums: a.nb_album, fans: a.nb_fan }));
}

/** un artiste et son dernier vrai album (sinon sa dernière sortie), au format de musica-candidats.json */
export async function fichaMusica(id) {
	const a = await legir(`/artist/${id}`);
	if (!a?.id) return null;
	const al = await legir(`/artist/${id}/albums?limit=100`);
	const totas = (al?.data ?? []).filter((x) => x.release_date).sort((x, y) => y.release_date.localeCompare(x.release_date));
	const d = totas.find((x) => x.record_type === 'album') ?? totas[0];
	if (!d) return null;
	return {
		id: a.id,
		nom: a.name,
		imatge: a.picture_big,
		fans: a.nb_fan ?? 0,
		album: { id: d.id, titol: d.title, data: d.release_date, cobèrta: d.cover_medium, tipe: d.record_type }
	};
}

// les fiches en mémoire : { t, ficha } par identifiant
const fichas = new Map();
let enCors = false;

// une à une, sans dépasser le quota de Deezer (50 demandes par 5 secondes)
async function rafrescar(ids) {
	if (enCors) return;
	enCors = true;
	try {
		for (const id of ids) {
			const f = await fichaMusica(id);
			if (f) fichas.set(id, { t: Date.now(), ficha: f });
			await dormir(300);
		}
	} finally {
		enCors = false;
	}
}

/**
 * Les fiches de ces artistes, tout de suite : celles qu'on a (ou les
 * semences, la liste préparée), relues chez Deezer en arrière-plan quand
 * elles ont plus d'un jour. Seul un artiste inconnu fait attendre la page.
 */
export async function fichasMusica(ids, semenças = {}) {
	for (const id of ids) if (!fichas.has(id) && semenças[id]) fichas.set(id, { t: 0, ficha: semenças[id] });
	const absents = ids.filter((id) => !fichas.has(id));
	for (const id of absents) {
		const f = await fichaMusica(id);
		if (f) fichas.set(id, { t: Date.now(), ficha: f });
	}
	const vièlhs = ids.filter((id) => Date.now() - (fichas.get(id)?.t ?? 0) > JORN);
	if (vièlhs.length) rafrescar(vièlhs);
	return ids.map((id) => fichas.get(id)?.ficha).filter(Boolean);
}
