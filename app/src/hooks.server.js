// En-têtes de sécurité posés sur chaque réponse. Vercel ne les met pas
// tout seul, et la politique de contenu (définie dans svelte.config.js)
// ne couvre pas ces aspects-là.
export async function handle({ event, resolve }) {
	const response = await resolve(event);

	// Empêche le navigateur de « deviner » un type de fichier différent de
	// celui annoncé — un fichier téléversé ne peut pas être réinterprété
	// comme du script.
	response.headers.set('X-Content-Type-Options', 'nosniff');

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
	response.headers.set('X-Frame-Options', 'DENY');

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
