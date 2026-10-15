// Essai du nouveau menu (2026-10-15) : on bascule « Actuel / Essai » sur
// /ensag/menu. Le choix reste dans ce navigateur seulement (les autres
// visiteurs gardent la barre actuelle). Lu après l'hydratation (onMount des
// composants) pour que la page servie et la page vivante soient identiques.
const CLAU = 'lo-ligam-essai-menu';
// Deux dispositions du menu-voile à comparer (demande de Romain, même jour) :
// « colomnas » (trois colonnes côte à côte) ou « vertical » (01, 02, 03
// empilés en grand, chacun se déroule pour montrer ses rubriques)
const CLAU_FORMA = 'lo-ligam-essai-menu-forma';
const FORMAS = ['colomnas', 'vertical'];

export const essaiMenu = $state({ actiu: false, forma: 'vertical' });

export function legirEssaiMenu() {
	try {
		essaiMenu.actiu = localStorage.getItem(CLAU) === 'on';
		const f = localStorage.getItem(CLAU_FORMA);
		if (FORMAS.includes(f)) essaiMenu.forma = f;
	} catch {
		essaiMenu.actiu = false;
	}
}

export function mudarForma(forma) {
	essaiMenu.forma = forma;
	try {
		localStorage.setItem(CLAU_FORMA, forma);
	} catch {
		// pas grave : le choix vaut pour la visite
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
