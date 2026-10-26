<script>
	// Mèdias (2026-10-25, cahier §11 : la case Musicas de Se parla laisse la
	// place aux médias) : une case par sorte de média, dans les ors (Romain :
	// « dans les médias, du jaune »). Les textes et les cases se modifient sur
	// la page.
	import PaginaTeulas from '$lib/apren/PaginaTeulas.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { iniciar } from '$lib/edicion/edicion.svelte.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('medias', data.elements);
	$effect(() => () => lèvaEdicion?.());

	const RUBRICA = PLAN.find((r) => r.id === 'parla');
</script>

<svelte:head>
	<title>{tria({ oc: 'Mèdias', fr: 'Médias', es: 'Medios', en: 'Media', ca: 'Mitjans' })} · Lo Ligam</title>
	<meta
		name="description"
		content="Las ràdios, las televisions e la premsa en occitan. Les radios, les télévisions et la presse en occitan."
	/>
</svelte:head>

<PaginaTeulas pagina="medias" rubrica={RUBRICA} etiqueta={{ oc: 'Los mèdias en occitan', fr: 'Les médias en occitan', es: 'Los medios en occitano', en: 'Media in Occitan', ca: 'Els mitjans en occità' }} paleta="aur" />
