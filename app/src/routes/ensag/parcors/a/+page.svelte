<script>
	// Proposition A, « Lo fial » : voir $lib/parcors/CaminFial.svelte
	import ParcorsPagina from '$lib/parcors/ParcorsPagina.svelte';
	import CaminFial from '$lib/parcors/CaminFial.svelte';
</script>

<ParcorsPagina essai>
	{#snippet children(p)}<CaminFial {...p} />{/snippet}
</ParcorsPagina>
