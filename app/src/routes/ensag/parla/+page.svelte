<script>
	// Maquette de Se parla (2026-10-25) : voir $lib/ensag/maqueta.js
	import PaginaTeulas from '$lib/apren/PaginaTeulas.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { mostrar } from '$lib/ensag/maqueta.js';

	let { data } = $props();
	mostrar('parla', data.rows);
</script>

<svelte:head>
	<title>Se parla (maqueta) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PaginaTeulas pagina="parla" rubrica={PLAN.find((r) => r.id === 'parla')} etiqueta={{ oc: 'Çò que se ditz e se fa aicí', fr: 'Ce qui se dit et se fait ici' }} />
