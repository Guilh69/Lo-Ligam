<script>
	// Òbras, une porte par art (2026-10-25, cahier §11 : « Se parla et Òbras
	// hiérarchisés ») : la musique (le café), la littérature, le cinéma, les
	// affiches et la scène, en cases dans les verts. Avant, une longue page
	// avec la porte du café et la galerie d'affiches (partie sur
	// /obras/afichas). Les textes et les cases se modifient sur la page.
	import PaginaTeulas from '$lib/apren/PaginaTeulas.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { iniciar } from '$lib/edicion/edicion.svelte.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('obras', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let fr = $derived(langStore.current === 'fr');
	const RUBRICA = PLAN.find((r) => r.id === 'parla');
</script>

<svelte:head>
	<title>{fr ? 'Œuvres' : 'Òbras'} · Lo Ligam</title>
	<meta
		name="description"
		content="Las òbras en occitan, art per art : musica, literatura, cinema, afichas, scèna. Les œuvres en occitan, art par art : musique, littérature, cinéma, affiches, scène."
	/>
</svelte:head>

<PaginaTeulas pagina="obras" rubrica={RUBRICA} etiqueta={{ oc: 'Las òbras, art per art', fr: 'Les œuvres, art par art' }} paleta="verd" />
