// Lo Ligam — les deux façons d'attacher une vidéo à une fiche.
//
// Le champ `video_url` accepte indifféremment :
//   · une adresse Supabase Storage — vidéo courte, préparée avec
//     outils/preparar-video.cmd, servie par nous : légère, sans traceur,
//     et on maîtrise le lecteur (démarrage muet, bouton son) ;
//   · un lien Canva — pièce longue dont le poids ne nous coûte rien, au prix
//     de leur habillage et de leurs traceurs, d'où le chargement au clic.
//
// Même principe que `mini_url`, qui accepte déjà une image du site ou une
// image envoyée (décision du 2026-08-03, §11).

// Doit rester aligné sur le plafond du dossier « videos »
// (supabase-videos-schema.sql). Contrôlé ici pour prévenir AVANT l'envoi
// plutôt que de laisser le serveur refuser après plusieurs mégaoctets.
export const PLAFON_VIDEO = 12 * 1024 * 1024;

const TROÇ_STORAGE = '/storage/v1/object/public/videos/';

export function esVideoStorage(url) {
	return typeof url === 'string' && url.includes(TROÇ_STORAGE);
}

export function caminVideoStorage(url) {
	const i = String(url).indexOf(TROÇ_STORAGE);
	if (i === -1) return null;
	// On coupe la partie « ?v=… » : elle sert à forcer les navigateurs à
	// recharger une vidéo remplacée, mais ne fait pas partie du chemin.
	return decodeURIComponent(
		String(url)
			.slice(i + TROÇ_STORAGE.length)
			.split('?')[0]
	);
}

export function esCanva(url) {
	if (typeof url !== 'string') return false;
	try {
		return /(^|\.)canva\.(com|site)$/i.test(new URL(url).hostname);
	} catch {
		return false;
	}
}

/**
 * Accepte ce que Canva donne à copier — un lien de partage, un lien de vue, ou
 * le code <iframe> entier — et en tire l'adresse à intégrer.
 * Renvoie null si ce n'est pas un lien Canva : on préfère refuser clairement
 * plutôt que d'afficher un cadre vide sur le site.
 */
export function ligamCanvaEmbed(brut) {
	if (!brut) return null;
	let s = String(brut).trim();

	// Romain colle souvent le code d'intégration complet plutôt que l'adresse.
	const dins = s.match(/src=["']([^"']+)["']/i);
	if (dins) s = dins[1];

	let u;
	try {
		u = new URL(s);
	} catch {
		return null;
	}
	if (!/(^|\.)canva\.(com|site)$/i.test(u.hostname)) return null;

	u.search = '';
	u.hash = '';
	// Canva donne selon les cas une adresse en /view, /watch ou /edit. On retire
	// le dernier segment quel qu'il soit et on repose /view, la seule forme qui
	// s'intègre.
	const camin = u.pathname.replace(/\/+$/, '').replace(/\/(view|watch|edit)$/i, '');
	return `${u.origin}${camin}/view?embed`;
}

/** 'cap' | 'mp4' | 'canva' — d'où vient la vidéo d'une fiche. */
export function menaVideo(url) {
	if (!url) return 'cap';
	if (esVideoStorage(url)) return 'mp4';
	if (esCanva(url)) return 'canva';
	return 'mp4'; // adresse directe vers un fichier, servie telle quelle
}

// Le choix du son est mémorisé : c'est pénible de devoir le réactiver à
// chaque fiche. Les navigateurs interdisent de démarrer avec le son sans
// geste préalable — on démarre donc toujours muet, et ce réglage ne fait que
// décider si le bouton son est déjà enclenché pour les fiches suivantes.
const CLAU_SON = 'loligam.video.son';

export function sonVolgut() {
	if (typeof localStorage === 'undefined') return false;
	return localStorage.getItem(CLAU_SON) === '1';
}

export function gardarSon(volgut) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(CLAU_SON, volgut ? '1' : '0');
}
