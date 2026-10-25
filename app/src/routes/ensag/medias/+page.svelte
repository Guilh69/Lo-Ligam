<script>
	// Maquette de la page Médias (2026-10-25) : voir $lib/ensag/maqueta.js
	import PaginaLista from '$lib/ensag/PaginaLista.svelte';
	import { MEDIAS } from '$lib/ensag/maqueta.js';
</script>

<svelte:head>
	<title>Mèdias (maqueta) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PaginaLista
	titol={{ oc: 'Mèdias', fr: 'Médias' }}
	frasa={{ oc: 'Las ràdios, las televisions e la premsa en occitan.', fr: 'Les radios, les télévisions et la presse en occitan.' }}
	picto="medias"
	camin={[{ href: '/ensag/parla', oc: 'Se parla', fr: 'Se parle' }]}
	grops={MEDIAS}
/>
