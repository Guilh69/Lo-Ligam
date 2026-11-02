<script>
	// Proposition B, « Lo camin » : voir $lib/parcors/CaminAuca.svelte
	import ParcorsPagina from '$lib/parcors/ParcorsPagina.svelte';
	import CaminAuca from '$lib/parcors/CaminAuca.svelte';
</script>

<ParcorsPagina essai>
	{#snippet children(p)}<CaminAuca {...p} />{/snippet}
</ParcorsPagina>
