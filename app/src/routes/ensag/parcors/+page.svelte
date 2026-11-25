<script>
	// Essai de « Lo parcors » en version « une action par écran » (Romain,
	// 2026-11-16) : le haut de page ne garde qu'un bouton et l'avancement en une
	// ligne, les niveaux n'ont plus de cases, et le chemin est replié sur la
	// suite immédiate (« Veire tot lo parcors » l'ouvre). Le chemin lui-même est
	// celui de /aprene. Avec « essai », ?simul=6 simule un avancement de six modules.
	import ParcorsPagina from '#lib/parcors/ParcorsPagina.svelte';
	import CaminAuca from '#lib/parcors/CaminAuca.svelte';
	import { iniciar } from '#lib/edicion/edicion.svelte.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('parcors', data.elements);
	$effect(() => () => lèvaEdicion?.());
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<ParcorsPagina unPas essai>
	{#snippet children(p)}<CaminAuca {...p} />{/snippet}
</ParcorsPagina>
