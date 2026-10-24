<script>
	// Page de rubrique 03 Amassa (2026-10-25, chantier 22), sur le modèle de
	// S'apren (Romain : « la même logique avec les cases »). Tout ce qui
	// rassemble : les groupes en grand (« que les gens puissent se rencontrer et
	// sachent qu'ils ont accès à d'autres locuteurs », 24-10), les cercles de la
	// carte, le forum, la boîte à idées, Instagram. Ce que deviennent le forum,
	// les groupes et la boîte à idées reste à trancher (options du 24-10).
	import PaginaTeulas from '$lib/apren/PaginaTeulas.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { iniciar } from '$lib/edicion/edicion.svelte.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('amassa', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let fr = $derived(langStore.current === 'fr');
	const RUBRICA = PLAN.find((r) => r.id === 'viu');
</script>

<svelte:head>
	<title>{fr ? 'Rassemble' : 'Amassa'} · Lo Ligam</title>
	<meta
		name="description"
		content="Rencontrar d’autras personas que parlan occitan : grops, cercles, fòrum, boita d’idèas. Rencontrer d’autres personnes qui parlent occitan : groupes, cercles, forum, boîte à idées."
	/>
</svelte:head>

<PaginaTeulas pagina="amassa" rubrica={RUBRICA} etiqueta={{ oc: 'Çò que nos amassa', fr: 'Ce qui nous rassemble' }} />
