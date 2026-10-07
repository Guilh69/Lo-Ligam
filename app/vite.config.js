import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// sveltekit() est appelé SANS options : toute configuration passée ici
	// remplacerait celle de svelte.config.js au lieu de s'y ajouter. C'est
	// ce qui faisait que la politique de sécurité n'était jamais appliquée.
	plugins: [sveltekit()],

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
