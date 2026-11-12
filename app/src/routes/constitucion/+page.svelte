<script>
	// La Constitution du 4 octobre 1958 en occitan (2026-11-12). Le texte est dans $lib/constitucion.
	import PaginaConstitucion from '$lib/constitucion/PaginaConstitucion.svelte';
	import { texte } from '$lib/constitucion/textes.js';
</script>

<PaginaConstitucion texte={texte('const')} />
