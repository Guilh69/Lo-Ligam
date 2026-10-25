<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { ambianca, armonizada } from '$lib/stores/ambianca.svelte.js';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import TornarAmont from '$lib/components/TornarAmont.svelte';
	// l'édition sur place (bouton, barre, panneau) : ne montre rien tant
	// qu'une page ne s'y est pas branchée (2026-10-24)
	import Edicion from '$lib/components/Edicion.svelte';

	let { children } = $props();

	// Cadre commun (2026-10-07). Les pages sont harmonisées une à une avec la
	// charte de l'esbòs de nuèch ; tant qu'une page n'est pas dans ARMONIZADAS
	// (stores/ambianca), elle reste en thème clair (elle est dessinée pour un
	// fond crème), sans toucher au choix mémorisé du visiteur.
	let id = $derived(page.route.id ?? '');
	$effect(() => {
		ambianca.forçarClar = !armonizada(id);
	});
	// Pied de page partout, sauf l'administration (l'accueil l'a aussi depuis
	// qu'il est passé dans le cadre commun, 2026-10-07). L'essai de la refonte
	// claire (/ensag/clar, 2026-10-21) et l'esquisse « page presque blanche »
	// (/ensag/blanc, 2026-10-22) dessinent leur propre pied de page.
	let ambPè = $derived(!id.startsWith('/admin') && id !== '/ensag/clar' && id !== '/ensag/blanc');
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<title>Lo Ligam</title>
</svelte:head>

{@render children()}

{#if ambPè}
	<SiteFooter />
{/if}

{#if ambPè}
	<TornarAmont />
{/if}

<Edicion />
