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

// Les éléments modifiables présents dans la page (posés par l'action editar,
// lib/edicion/editar.svelte.js) : la couche du site y accroche les effets que
// Romain a publiés pour eux (« cliquer l'élément », 15-11). Une simple liste,
// sans rien télécharger.
const inscrits = new Map(); // clé de l'élément → Set de nœuds
const auditeurs = new Set();

export function inscrireElement(clau, node) {
	if (!inscrits.has(clau)) inscrits.set(clau, new Set());
	inscrits.get(clau).add(node);
	for (const f of auditeurs) f(clau, node);
	return () => {
		inscrits.get(clau)?.delete(node);
		if (!inscrits.get(clau)?.size) inscrits.delete(clau);
	};
}

export const noeudsDe = (clau) => [...(inscrits.get(clau) ?? [])];

export function escotarInscriccions(f) {
	auditeurs.add(f);
	return () => auditeurs.delete(f);
}
