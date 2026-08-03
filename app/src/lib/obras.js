// Lo Ligam — espace « Òbras ».
//
// RÈGLE : on n'héberge aucun extrait. On affiche des informations, un
// commentaire de Romain, et on laisse écouter par le lecteur officiel de la
// plateforme — qui porte les droits et rémunère les ayants droit. Voir le §11
// du cahier des charges pour le raisonnement juridique.
//
// Le lecteur n'est chargé qu'au clic du visiteur : avant, rien de YouTube
// n'est appelé, donc aucun de leurs traceurs n'est déposé. C'est ce qui nous
// dispense d'une bannière de consentement pour cette page.

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

/** Le nom de domaine, pour montrer au visiteur où le lien l'emmène. */
export function ostePropre(url) {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return null;
	}
}
