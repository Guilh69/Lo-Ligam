// Où un effet de la bibliothèque Efièch peut être posé sur le site (atelier
// /admin/efiechs, 2026-11-15). Un emplacement de plus : une ligne ici.
// (Sans importation : le gabarit racine lit cette liste pour savoir s'il doit
// charger la couche des effets.)
//
// Ce que Romain règle dans l'atelier est rangé dans la table pagina_elements,
// « page » efiechs, une ligne par emplacement (clé efiechs.<emplacement>),
// brouillon puis « Publicar », comme les textes et les couleurs ; voir legida.js.

export const PAGINA = 'efiechs';
export const clauDe = (id) => `${PAGINA}.${id}`;

// Par-dessus une page : l'effet joue au-dessus du contenu, sans gêner les clics.
// À l'événement : il se joue une fois, puis s'efface. « pages » : les routes où
// l'événement peut se produire (la couche n'est chargée que là).
export const EMPLACAMENTS = [
	{ id: 'reussita', nom: 'Réussite d’une séance', texte: 'joue une fois quand on termine une séance d’un module', evenement: true, pages: ['/aprene/modul/[modulId]'] },
	{ id: 'pagina-acuelh', nom: 'Accueil', texte: 'par-dessus la page d’accueil', route: '/' },
	{ id: 'pagina-apren', nom: 'Apprendre', texte: 'par-dessus la page Aprene', route: '/apren' },
	{ id: 'pagina-mots', nom: 'Mots', texte: 'par-dessus la page des mots', route: '/mots' },
	{ id: 'pagina-cultura', nom: 'Culture', texte: 'par-dessus la page Cultura', route: '/cultura' },
	{ id: 'pagina-istoria', nom: 'Histoire', texte: 'par-dessus la page Istòria', route: '/istoria' },
	{ id: 'pagina-imagina', nom: 'Imaginer', texte: 'par-dessus la page S’imagina', route: '/imagina' },
	{ id: 'pagina-contacte', nom: 'Contact', texte: 'par-dessus la page de contact', route: '/contacte' }
];

export const emplacament = (id) => EMPLACAMENTS.find((e) => e.id === id) ?? null;

/** Les emplacements « page » à jouer sur cette route (page.route.id) */
export const emplacamentsDeRoute = (routeId) => EMPLACAMENTS.filter((e) => e.route && e.route === routeId);

/** Vrai si la couche des effets a quelque chose à faire sur cette route */
export const efiechSurRoute = (routeId) => EMPLACAMENTS.some((e) => e.route === routeId || e.pages?.includes(routeId));
