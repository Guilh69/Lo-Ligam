<script>
	// Page de rubrique 01 Se parla (2026-10-25, chantier 21), sur le modèle de
	// S'apren (Romain : « prends exemple sur la page S'apren »). Rôle distinct de
	// l'accueil, qui nomme les portes : ici, chaque porte en case de couleur,
	// avec une ligne sur ce qu'on y trouve (la carte en grand, le wiki, Òbras,
	// Articles, les musiques).
	import PaginaTeulas from '$lib/apren/PaginaTeulas.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { iniciar } from '$lib/edicion/edicion.svelte.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('parla', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let fr = $derived(langStore.current === 'fr');
	const RUBRICA = PLAN.find((r) => r.id === 'parla');
</script>

<svelte:head>
	<title>{fr ? 'Se parle' : 'Se parla'} · Lo Ligam</title>
	<meta
		name="description"
		content="L’occitan se parla : la carta, lo wiki, las òbras, los articles. L’occitan se parle : la carte, le wiki, les œuvres, les articles."
	/>
</svelte:head>

<PaginaTeulas pagina="parla" rubrica={RUBRICA} etiqueta={{ oc: 'Çò que se ditz e se fa aicí', fr: 'Ce qui se dit et se fait ici' }} />
