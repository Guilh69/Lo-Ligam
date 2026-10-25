<script>
	// Maquette de la porte Littérature d'Òbras (2026-10-25) : voir $lib/ensag/maqueta.js
	import PaginaLista from '$lib/ensag/PaginaLista.svelte';
	import { EDITORS } from '$lib/ensag/maqueta.js';
</script>

<svelte:head>
	<title>Literatura (maqueta) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PaginaLista
	titol={{ oc: 'Literatura', fr: 'Littérature' }}
	frasa={{ oc: 'Los editors en occitan.', fr: 'Les éditeurs en occitan.' }}
	picto="literatura"
	camin={[{ href: '/ensag/parla', oc: 'Se parla', fr: 'Se parle' }, { href: '/ensag/obras', oc: 'Òbras', fr: 'Œuvres' }]}
	grops={EDITORS}
/>
