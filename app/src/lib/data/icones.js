// Icônes des ressources occitanes, téléchargées une fois et servies par
// nos soins. Avant, elles étaient demandées à Google à chaque affichage du
// menu (une requête par icône, avec l'adresse IP du visiteur à la clé).
//
// Trois sites ne publient pas d'icône à un emplacement standard : pour
// eux, l'interface affiche l'initiale du nom sur pastille colorée. C'est
// aussi ce qui se produira pour toute ressource ajoutée plus tard sans
// qu'on ait récupéré son icône — jamais d'image cassée.

const fichiers = {
	'locongres.org': '/icones/locongres.org.ico',
	'dicodoc.eu': '/icones/dicodoc.eu.ico',
	'caoc.cat': '/icones/caoc.cat.webp',
	'www.ofici-occitan.eu': '/icones/www.ofici-occitan.eu.webp',
	'www.oc-cultura.eu': '/icones/www.oc-cultura.eu.webp',
	'www.cfpoccitan.org': '/icones/www.cfpoccitan.org.webp'
};

/** Chemin local de l'icône d'un lien, ou null s'il n'y en a pas. */
export function icona(href) {
	try {
		return fichiers[new URL(href).hostname] ?? null;
	} catch {
		return null;
	}
}
