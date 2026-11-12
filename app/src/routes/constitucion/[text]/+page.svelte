<script>
	import PaginaConstitucion from '$lib/constitucion/PaginaConstitucion.svelte';
	import { texte } from '$lib/constitucion/textes.js';

	let { data } = $props();
</script>

<PaginaConstitucion texte={texte(data.id)} />
