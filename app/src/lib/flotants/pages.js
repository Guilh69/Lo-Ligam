// Où le fond de confettis est monté (gabarit racine, routes/+layout.svelte). Romain, 2026-11-08 :
// « je préfère les confettis, on va mettre ça par défaut dans le template ». Il habille le fond clair
// des pages ordinaires ; pas là où il gênerait ou ferait doublon :
//  - la carte (interface pleine et stable), l'espace des petits, Remira, les leçons : écrans d'immersion ;
//  - la salle de jeux, qui a ses propres confettis ;
//  - l'administration et le compte : des écrans de travail, des formulaires ;
//  - les pages d'essai (/ensag), qui s'en occupent elles-mêmes ;
//  - les pages légales et d'accessibilité : à lire sans rien autour.
export const SANS_CONFETIS = [
	'/admin',
	'/carta',
	'/anem',
	'/apren/remira',
	'/apren/jocs',
	'/aprene/modul',
	'/ensag',
	'/compte',
	'/mencions-legalas',
	'/confidencialitat',
	'/accessibilitat'
];

/** vrai si le fond de confettis peut paraître sur cette route (page.route.id de SvelteKit) */
export const confetisSurPage = (id) => !SANS_CONFETIS.some((p) => id === p || id.startsWith(p + '/'));
