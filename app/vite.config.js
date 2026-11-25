import adaptador from './adaptador.js';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

// Politique de sécurité du contenu : le navigateur refuse de charger ce qui
// ne vient pas d'une origine listée ici. C'est la protection principale
// contre l'injection de scripts — si quelqu'un parvenait à glisser un
// <script> dans une fiche ou un texte de l'admin, le navigateur ne
// l'exécuterait pas.
//
// SvelteKit gère lui-même les empreintes de ses propres scripts en ligne
// (mode 'auto'), il ne faut donc PAS ajouter 'unsafe-inline' pour script-src.
/** @type {import('@sveltejs/kit/vite').Config['csp']} */
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
			// photos et pochettes de Deezer, affichées seulement dans l'espace
			// musique, après l'accord du visiteur (2026-10-25)
			'https://cdn-images.dzcdn.net',
			'https://e-cdns-images.dzcdn.net',
			// Fonds de carte, tous européens : rendu occitan par OSM-bzh,
			// relief par OpenTopoMap (Allemagne), photos aériennes par l'IGN
			// (France) et le PNOA (Espagne). EOX retiré : licence non commerciale.
			'https://tile.openstreetmap.bzh',
			'https://*.tile.openstreetmap.org',
			'https://*.tile.opentopomap.org',
			'https://data.geopf.fr',
			'https://www.ign.es'
		],
		'connect-src': [
			'self',
			'https://*.supabase.co',
			'wss://*.supabase.co',
			'https://api-adresse.data.gouv.fr', // autocomplétion des lieux
			'https://photon.komoot.io'
		],
		// sons des enquêtes de l'Atlas sonore (LISN), lus seulement quand on
		// lance l'écoute sur la carte
		// + le direct des radios en occitan, joué au clic (page d'essai des radios, 2026-10-25)
		// + blob: pour réécouter une prise du studio de voix avant de la garder (2026-11-13)
		'media-src': [
			'self',
			'blob:',
			'https://*.supabase.co',
			'https://atlas.lisn.upsaclay.fr',
			'https://stream-ssl.radios-arra.fr:8443',
			'https://stunnel2.cyber-streaming.com:9272',
			'https://live-albiges.radiom.fr',
			'https://icecast.radio-occitania.com',
			'https://listen.radioking.com',
			'https://*.radioking.com'
		],
		// lecteurs officiels de musique, chargés au clic après accord (Òbras, 2026-10-25)
		'frame-src': ['https://www.youtube-nocookie.com', 'https://www.canva.com', 'https://widget.deezer.com'],
		'object-src': ['none'],
		'base-uri': ['self'],
		'form-action': ['self'],
		'frame-ancestors': ['none'] // interdit d'enfermer le site dans une iframe (exception en développement : hooks.server.js)
	}
};

// ⚠ CE FICHIER EST LA SEULE SOURCE DE CONFIGURATION (SvelteKit 3, 2026-11-25 :
// svelte.config.js n’est plus lu). Toutes les options de SvelteKit passent
// par sveltekit({...}) ci-dessous, en un seul endroit : un second objet de
// configuration remplacerait celui-ci au lieu de s’y ajouter (c’est ce qui
// avait fait ignorer la politique de sécurité, 2026-10).
export default defineConfig({
	plugins: [
		sveltekit({
			// adapter-node (enveloppé dans adaptador.js) : un serveur Node autonome, mis en conteneur
			// pour Scaleway.
			adapter: adaptador(),
			csp,
			preprocess: vitePreprocess(),
			compilerOptions: {
				// Mode runes pour le projet, sauf pour les bibliothèques.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			}
		})
	],

	test: {
		// Les tests de logique tournent sans navigateur. Ceux qui rendent un
		// composant ont besoin d'un DOM simulé, d'où jsdom.
		environment: 'jsdom',
		include: ['src/**/*.test.js'],
		globals: true,
		// Un seul processus : sur Windows, avec le projet dans un dossier
		// synchronisé, les processus de travail de Vitest expirent avant de
		// répondre. La suite est courte, la parallélisation n'apporte rien ici.
		// (Vitest 4 : poolOptions.threads.singleThread est devenu maxWorkers.)
		pool: 'threads',
		maxWorkers: 1,
		fileParallelism: false
	}
});
