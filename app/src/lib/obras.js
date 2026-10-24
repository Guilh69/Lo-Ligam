// Lo Ligam — espace « Òbras ».
//
// RÈGLE : on n'héberge aucun extrait. On affiche des informations, un
// commentaire de Romain, et on laisse écouter par le lecteur officiel de la
// plateforme — qui porte les droits et rémunère les ayants droit. Voir le §11
// du cahier des charges pour le raisonnement juridique.
//
// Le lecteur n'est chargé qu'au clic du visiteur : avant, rien de YouTube
// n'est appelé, donc aucun de leurs traceurs n'est déposé. C'est ce qui nous
// dispense d'une bannière de consentement pour cette page. Pour les musiques
// (2026-10-25), le clic ouvre d'abord une phrase qui dit ce que la plateforme
// recevra : le lecteur ne se charge qu'après « Escotar ».

export const MENAS = [
	{ id: 'musica', oc: 'Musica', fr: 'Musique' },
	{ id: 'libre', oc: 'Libre', fr: 'Livre' },
	{ id: 'filme', oc: 'Filme', fr: 'Film' }
];

/**
 * Extrait l'identifiant d'une vidéo YouTube, quelle que soit la forme du lien
 * (youtube.com/watch, youtu.be, /embed/, /shorts/).
 */
export function idYoutube(url) {
	if (!url) return null;
	let u;
	try {
		u = new URL(String(url).trim());
	} catch {
		return null;
	}
	const oste = u.hostname.replace(/^www\./, '');

	if (oste === 'youtu.be') return neteja(u.pathname.slice(1));
	if (!/(^|\.)youtube(-nocookie)?\.com$/.test(oste)) return null;

	if (u.pathname === '/watch') return neteja(u.searchParams.get('v'));
	const m = u.pathname.match(/^\/(embed|shorts|v)\/([^/]+)/);
	if (m) return neteja(m[2]);
	return null;
}

function neteja(id) {
	return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
}

/**
 * Adresse d'intégration YouTube en mode « sans cookie » : leur domaine
 * youtube-nocookie.com ne dépose pas de traceur publicitaire. Combiné au
 * chargement au clic, c'est le réglage le plus respectueux possible sans
 * renoncer à l'écoute officielle.
 */
export function embedYoutube(url) {
	const id = idYoutube(url);
	return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
}

// PAS de vignette YouTube ici, volontairement. Leur image de couverture est
// servie par un domaine de Google : l'afficher avant le clic enverrait l'adresse
// IP de chaque visiteur chez eux, ce qui ruinerait justement l'intérêt du
// chargement au clic. En l'absence d'une image dont on a le droit, la fiche
// s'affiche avec un aplat de la charte et son titre — c'est très bien ainsi.

// --- Musiques : une fiche par artiste, ses liens, l'écoute au clic ---------
// (Romain, 2026-10-25, option « fiche + écouter ici » : « je ne veux pas voler
// quoi que ce soit, je veux juste permettre aux gens d'accéder aux musiques
// des artistes que j'identifie »). Romain colle les adresses ; la plateforme
// se reconnaît d'elle-même. Rang : d'abord ce qui rémunère le mieux les
// artistes (Bandcamp), puis les plateformes européennes (Qobuz, Deezer).
const PLATAFORMAS = [
	{ nom: 'Bandcamp', rang: 0, test: (o) => o === 'bandcamp.com' || o.endsWith('.bandcamp.com') },
	{ nom: 'Qobuz', rang: 1, test: (o) => o === 'qobuz.com' || o.endsWith('.qobuz.com') },
	{ nom: 'Deezer', rang: 2, test: (o) => o === 'deezer.com' || o.endsWith('.deezer.com') || o === 'deezer.page.link' },
	{ nom: 'YouTube', rang: 3, test: (o) => o === 'youtu.be' || /(^|\.)youtube\.com$/.test(o) },
	{ nom: 'Spotify', rang: 4, test: (o) => o.endsWith('spotify.com') },
	{ nom: 'Apple Music', rang: 4, test: (o) => o === 'music.apple.com' },
	{ nom: 'SoundCloud', rang: 4, test: (o) => o === 'soundcloud.com' || o.endsWith('.soundcloud.com') },
	{ nom: 'Instagram', rang: 6, test: (o) => o === 'instagram.com' },
	{ nom: 'Facebook', rang: 6, test: (o) => o === 'facebook.com' }
];

/** la plateforme d'un lien : son nom et son rang ; sinon le site de l'artiste (rang 5) */
export function plataforma(url) {
	const oste = ostePropre(url);
	if (!oste) return null;
	return PLATAFORMAS.find((p) => p.test(oste)) ?? { nom: oste, rang: 5, site: true };
}

/** les liens collés d'un coup (un par ligne, ou séparés par des espaces) : seuls les https */
export function ligamsCollats(tèxt) {
	return [...new Set((tèxt ?? '').split(/\s+/).filter((l) => /^https:\/\/[^\s]+$/.test(l) && plataforma(l)))];
}

/**
 * Le lecteur officiel qu'on peut ouvrir dans la fiche, d'après un lien Deezer
 * (album, titre, liste, artiste) ou YouTube (vidéo, liste). Les liens courts
 * de partage de Deezer (link.deezer.com) ne disent pas ce qu'ils visent :
 * pas de lecteur, et l'éditeur prévient Romain (`cort`).
 */
export function lectorPer(url) {
	let u;
	try {
		u = new URL(String(url).trim());
	} catch {
		return null;
	}
	const oste = u.hostname.replace(/^www\./, '');
	// le lecteur officiel de Bandcamp, trouvé par /api/bandcamp quand Romain
	// colle le lien (2026-10-25 : « Bandcamp au centre »)
	if (oste === 'bandcamp.com' && u.pathname.startsWith('/EmbeddedPlayer/')) return { plataforma: 'Bandcamp', src: u.href, nautor: 120 };
	if (oste === 'deezer.com') {
		const m = u.pathname.match(/^\/(?:[a-z]{2}\/)?(album|track|playlist|artist)\/(\d+)/);
		if (!m) return null;
		const [, mena, id] = m;
		return {
			plataforma: 'Deezer',
			src: `https://widget.deezer.com/widget/light/${mena}/${id}${mena === 'artist' ? '/top_tracks' : ''}`,
			nautor: mena === 'track' ? 152 : 300
		};
	}
	if (oste === 'link.deezer.com' || oste === 'deezer.page.link') return { plataforma: 'Deezer', cort: true };
	const lista = /(^|\.)youtube\.com$/.test(oste) ? u.searchParams.get('list') : null;
	if (lista && /^[A-Za-z0-9_-]{10,64}$/.test(lista))
		return { plataforma: 'YouTube', src: `https://www.youtube-nocookie.com/embed/videoseries?list=${lista}&rel=0`, video: true };
	const video = embedYoutube(url);
	if (video) return { plataforma: 'YouTube', src: video, video: true };
	return null;
}

/** Le nom de domaine, pour montrer au visiteur où le lien l'emmène. */
export function ostePropre(url) {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return null;
	}
}
