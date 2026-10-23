import { dev } from '$app/environment';

// Une seule adresse pour le site (2026-10-15) : www.loligam.eu et l'adresse
// technique de Scaleway (…scw.cloud) renvoient vers loligam.eu, même page.
// On lit l'en-tête Host plutôt que event.url, qui suivrait ORIGIN s'il était
// un jour réglé dans la console.
const ADRESSE = 'loligam.eu';

function versAdresse(event) {
	const hote = event.request.headers.get('host')?.split(':')[0];
	if (dev || !hote || hote === ADRESSE) return null;
	if (hote !== 'www.' + ADRESSE && !hote.endsWith('.scw.cloud')) return null;
	return new Response(null, {
		status: 301,
		headers: { location: `https://${ADRESSE}${event.url.pathname}${event.url.search}` }
	});
}

// En-têtes de sécurité posés sur chaque réponse. Scaleway ne les met pas
// tout seul, et la politique de contenu (définie dans svelte.config.js)
// ne couvre pas ces aspects-là.
export async function handle({ event, resolve }) {
	const redirection = versAdresse(event);
	if (redirection) return redirection;

	const response = await resolve(event);

	// Empêche le navigateur de « deviner » un type de fichier différent de
	// celui annoncé — un fichier téléversé ne peut pas être réinterprété
	// comme du script.
	response.headers.set('X-Content-Type-Options', 'nosniff');

	// Pas encore lancé (cahier §11, 2026-10-24) : les moteurs de recherche ne
	// référencent aucune page, même trouvée par un lien venu d'ailleurs ; le
	// site reste ouvert à qui a l'adresse. À retirer au lancement, avec la
	// ligne « Disallow: / » de static/robots.txt.
	response.headers.set('X-Robots-Tag', 'noindex, nofollow');

	// Ne fuite pas l'adresse complète des pages visitées vers les sites
	// externes (ressources occitanes, cartes) : juste le domaine.
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	// Aucune de ces capacités n'est utilisée par le site : on les refuse
	// pour que rien ne puisse les demander à l'insu du visiteur.
	response.headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
	);

	// Double sécurité avec frame-ancestors de la CSP, pour les vieux
	// navigateurs qui ignorent cette directive.
	// En développement seulement, les pages du site peuvent l'encadrer
	// (maquettes posées sur la vraie carte). Fait ici et pas dans
	// svelte.config.js : une compilation réécrit la configuration partagée
	// avec le serveur local et remettait 'none' (2026-10-10).
	response.headers.set('X-Frame-Options', dev ? 'SAMEORIGIN' : 'DENY');
	const csp = dev && response.headers.get('content-security-policy');
	if (csp) response.headers.set('content-security-policy', csp.replace("frame-ancestors 'none'", "frame-ancestors 'self'"));

	// Force le HTTPS pendant deux ans. En développement le site est servi
	// en clair : l'en-tête n'aurait pas de sens et gênerait les tests.
	if (event.url.protocol === 'https:') {
		response.headers.set(
			'Strict-Transport-Security',
			'max-age=63072000; includeSubDomains; preload'
		);
	}

	return response;
}
