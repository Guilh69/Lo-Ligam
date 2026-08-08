import adapter from '@sveltejs/adapter-node';
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
			// Fonds de carte, tous européens : rendu occitan par OSM-bzh,
			// relief par OpenTopoMap (Allemagne), photos aériennes par l'IGN.
			'https://tile.openstreetmap.bzh',
			'https://*.tile.openstreetmap.org',
			'https://*.tile.opentopomap.org',
			'https://tiles.maps.eox.at'
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

// ⚠ CE FICHIER EST LA SEULE SOURCE DE CONFIGURATION.
// Auparavant, vite.config.js passait aussi une configuration en ligne au
// greffon sveltekit() : cette configuration-là REMPLACE celle-ci au lieu
// de s'y ajouter. Résultat, la politique de sécurité définie ici était
// purement et simplement ignorée. Ne pas réintroduire d'options SvelteKit
// dans vite.config.js.
/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		// Mode runes pour le projet, sauf pour les bibliothèques.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// adapter-node : produit un serveur Node autonome, mis en conteneur
		// pour Scaleway.
		adapter: adapter(),
		csp
	}
};

export default config;
