<script>
	// L'en-tête commun des pages d'administration (2026-11-07) : le même titre, la même
	// ligne d'explication, au même endroit, sur toutes les pages. Le titre est occitan avec
	// sa traduction entre parenthèses, comme dans le menu des ateliers.
	// <AdminTete oc="Laboratòri" fr="le laboratoire de design" resume="…" />
	let { oc, fr = '', resume = '', id = 'adm-titol', children } = $props();
</script>

<header class="adm-tete">
	<h1 {id}><span lang="oc">{oc}</span>{#if fr}{' '}<em>({fr})</em>{/if}</h1>
	{#if resume}<p class="resume">{resume}</p>{/if}
	{@render children?.()}
</header>

<style>
	.adm-tete {
		width: 100%;
		margin-bottom: 1rem;
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 400;
		color: var(--t-tinta, #2a1a10);
	}
	h1 em {
		font-family: var(--font-body);
		font-size: 0.5em;
		font-style: italic;
		opacity: 0.75;
	}
	.resume {
		margin: 0.5rem 0 0;
		max-width: 46rem;
		line-height: 1.55;
		color: var(--t-tinta, #2a1a10);
	}
</style>
