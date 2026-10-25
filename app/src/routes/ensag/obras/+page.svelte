<script>
	// Maquette d'Òbras par art (2026-10-25) : voir $lib/ensag/maqueta.js
	import PaginaTeulas from '$lib/apren/PaginaTeulas.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { mostrar } from '$lib/ensag/maqueta.js';

	let { data } = $props();
	mostrar('ensag-obras', data.rows);
</script>

<svelte:head>
	<title>Òbras (maqueta) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PaginaTeulas pagina="ensag-obras" rubrica={PLAN.find((r) => r.id === 'parla')} etiqueta={{ oc: 'Las òbras, art per art', fr: 'Les œuvres, art par art' }} paleta="verd" />
