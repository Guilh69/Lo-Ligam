<script>
	// Bastir, l'atelier des leçons (2026-11-16) : les huit unités de l'A1 en cases de
	// couleur ; une case mène à ses quatre leçons. Voir $lib/bastir/bastir.js.
	import AdminTete from '$lib/talhier/AdminTete.svelte';
	import TeulaBastir from '$lib/bastir/TeulaBastir.svelte';
	import { UNITATS_A1, AUTRAS, colorsUnitat, leiçon } from '$lib/bastir/bastir.js';
	import { cargarBrolhons } from '$lib/bastir/brolhon.js';
	import { simulacion } from '$lib/talhier/notas.svelte.js';
	import { onMount } from 'svelte';

	const nElements = (u) => u.slugs.reduce((t, s) => t + (leiçon(s)?.elements.length ?? 0), 0);

	// un carré plein par leçon dont Romain a commencé le déroulé
	let brolhons = $state({});
	onMount(() => {
		if (!simulacion()) cargarBrolhons().then((b) => (brolhons = b)).catch(() => {});
	});
	const començada = (s) => (brolhons[s]?.plan.length ?? 0) > 0;
</script>

<svelte:head><title>Bastir · Lo Ligam</title></svelte:head>

<AdminTete
	oc="Bastir"
	fr="construire les leçons"
	resume="Les huit unités du parcours A1. Dans chaque unité, ses leçons ; dans chaque leçon, la matière déjà écrite d’un côté, et de l’autre la place pour construire, avec la bibliothèque des modalités."
/>

<ul class="unitats" aria-label="Les unités de l’A1">
	{#each UNITATS_A1 as u, i (u.n)}
		{@const [fons, tinta] = colorsUnitat(u.n)}
		<TeulaBastir href="/admin/bastir/{u.n}" num={String(u.n).padStart(2, '0')} titol={u.titol} sota={u.fr} pè="{u.slugs.length} leçons, {nElements(u)} éléments" {fons} {tinta} {i}>
			<span class="leiçons" aria-hidden="true">
				{#each u.slugs as s (s)}<span class="carrat" class:ple={començada(s)}></span>{/each}
			</span>
		</TeulaBastir>
	{/each}
</ul>

<nav class="autras" aria-label="Hors des unités">
	<span class="autras-titol">Hors des unités</span>
	{#each AUTRAS as s (s)}
		{@const l = leiçon(s)}
		<a href="/admin/bastir/leicon/{s}"><span lang="oc">{l?.oc ?? s}</span></a>
	{/each}
</nav>

<style>
	.unitats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.75rem;
		margin: 1.5rem 0 0;
		padding: 0;
		list-style: none;
	}
	@media (max-width: 900px) {
		.unitats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	.leiçons {
		display: flex;
		gap: 4px;
	}
	.carrat {
		width: 0.7rem;
		height: 0.7rem;
		border: 1.5px solid currentColor;
		border-radius: 1px;
	}
	.carrat.ple {
		background: currentColor;
	}
	.autras {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem 1.4rem;
		margin-top: 2rem;
		padding-top: 0.9rem;
		border-top: 1px solid var(--t-linha);
	}
	.autras-titol {
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.autras a {
		color: var(--t-tinta);
		text-underline-offset: 0.2em;
	}
</style>
