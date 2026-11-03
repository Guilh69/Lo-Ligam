<script>
	// Une fiche de grammaire (/apren/gramatica/<id>), lue dans
	// $lib/gramatica/fichas/<id>.js ; même fond que le sommaire.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import FichaGramatica from '$lib/gramatica/FichaGramatica.svelte';
	import { ficha } from '$lib/gramatica/index.js';

	let { data } = $props();
</script>

<div class="pagina">
	<div class="entete"><AppHeader /></div>
	{#key data.id}<FichaGramatica ficha={ficha(data.id)} />{/key}
</div>

<style>
	.pagina {
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.entete {
		padding: 1.3rem clamp(1rem, 4vw, 3.4rem) 0;
	}
	.entete :global(.top) {
		max-width: none;
	}
</style>
