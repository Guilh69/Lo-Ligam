// Essai du nouveau menu (2026-10-15) : on bascule « Actuel / Essai » sur
// /ensag/menu. Le choix reste dans ce navigateur seulement (les autres
// visiteurs gardent la barre actuelle). Lu après l'hydratation (onMount des
// composants) pour que la page servie et la page vivante soient identiques.
const CLAU = 'lo-ligam-essai-menu';

export const essaiMenu = $state({ actiu: false });

export function legirEssaiMenu() {
	try {
		essaiMenu.actiu = localStorage.getItem(CLAU) === 'on';
	} catch {
		essaiMenu.actiu = false;
	}
}

export function mudarEssaiMenu(actiu) {
	essaiMenu.actiu = actiu;
	try {
		localStorage.setItem(CLAU, actiu ? 'on' : 'off');
	} catch {
		// stockage indisponible : l'essai vaut pour la visite
	}
}
