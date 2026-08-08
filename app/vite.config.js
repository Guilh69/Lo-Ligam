import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	],

	test: {
		// Les tests de logique tournent sans navigateur. Ceux qui rendent un
		// composant ont besoin d'un DOM simulé, d'où jsdom.
		environment: 'jsdom',
		include: ['src/**/*.test.js'],
		globals: true,
		// Un seul processus : sur Windows, avec le projet dans OneDrive, les
		// processus de travail de Vitest expirent avant de répondre. La suite
		// est courte, la parallélisation n'apporte rien ici.
		pool: 'threads',
		poolOptions: { threads: { singleThread: true } },
		fileParallelism: false
	}
});
