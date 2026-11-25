<script>
	// La page du parcours (refonte du 2026-11-02) : Romain a choisi « Lo camin »,
	// le plateau de jeu, parmi les propositions relues par Joan. Le cadre (résumé,
	// niveaux, note du compte) et la logique sont dans #lib/parcors. Le titre et
	// la note du compte sont modifiables sur place (2026-11-15, page « parcors »).
	import ParcorsPagina from '#lib/parcors/ParcorsPagina.svelte';
	import CaminAuca from '#lib/parcors/CaminAuca.svelte';
	import { iniciar } from '#lib/edicion/edicion.svelte.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('parcors', data.elements);
	$effect(() => () => lèvaEdicion?.());
</script>

<ParcorsPagina>
	{#snippet children(p)}<CaminAuca {...p} />{/snippet}
</ParcorsPagina>
