// Jouer un effet de la bibliothèque Efièch depuis n'importe quelle page :
//   jogarEfiech('reussita')
// La couche du site (EfiechsSite.svelte, gabarit racine) l'entend et joue ce
// que Romain a publié pour cet emplacement ; rien de publié, rien ne se passe.
// Ce fichier reste minuscule (aucune importation) : une page qui l'appelle ne
// télécharge pas la bibliothèque.

const EVENEMENT = 'lo-ligam-efiech';

export function jogarEfiech(id, origine = null) {
	if (typeof window === 'undefined') return;
	window.dispatchEvent(new CustomEvent(EVENEMENT, { detail: { id, origine } }));
}

export function escotarEfiech(f) {
	const h = (e) => f(e.detail);
	window.addEventListener(EVENEMENT, h);
	return () => window.removeEventListener(EVENEMENT, h);
}
