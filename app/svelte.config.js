import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Politique de sécurité du contenu : le navigateur refuse de charger ce qui
// ne vient pas d'une origine listée ici. C'est la protection principale
// contre l'injection de scripts — si quelqu'un parvenait à glisser un
// <script> dans une fiche ou un texte de l'admin, le navigateur ne
// l'exécuterait pas.
//
// SvelteKit gère lui-même les empreintes de ses propres scripts en ligne
// (mode 'auto'), il ne faut donc PAS ajouter 'unsafe-inline' pour script-src.
const csp = {
	mode: 'auto',
	directives: {
		'default-src': ['self'],
		'script-src': ['self'],
		// Svelte injecte les styles des composants en ligne : inévitable ici.
		'style-src': ['self', 'unsafe-inline'],
		// Les polices sont hébergées par nos soins : plus rien à autoriser
		// vers l'extérieur.
		'font-src': ['self'],
		'img-src': [
			'self',
			'data:',
			'blob:',
			'https://*.supabase.co', // designs, cartes et vidéos téléversés
			'https://tile.openstreetmap.bzh', // fond de carte occitan
			'https://*.tile.openstreetmap.org',
			'https://server.arcgisonline.com', // fond satellite
			'https://cawm.lib.uiowa.edu' // fond relief
		],
		'connect-src': [
			'self',
			'https://*.supabase.co',
			'wss://*.supabase.co',
			'https://api-adresse.data.gouv.fr', // autocomplétion des lieux
			'https://photon.komoot.io'
		],
		'media-src': ['self', 'https://*.supabase.co'],
		'frame-src': ['https://www.youtube-nocookie.com', 'https://www.canva.com'],
		'object-src': ['none'],
		'base-uri': ['self'],
		'form-action': ['self'],
		'frame-ancestors': ['none'] // interdit d'enfermer le site dans une iframe
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		csp
	}
};

export default config;
