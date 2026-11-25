<script>
	// Bastir : une unité et ses quatre leçons, en cases des nuances de sa couleur.
	import TeulaBastir from '#lib/bastir/TeulaBastir.svelte';
	import { UNITATS_A1, colorsUnitat, leiçon } from '#lib/bastir/bastir.js';
	import { nuanças } from '#lib/parcors/colors.js';
	import { cargarBrolhons } from '#lib/bastir/brolhon.js';
	import { simulacion } from '#lib/talhier/notas.svelte.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	const u = $derived(UNITATS_A1.find((x) => x.n === data.n));
	const leiçons = $derived(u.slugs.map(leiçon));
	const tons = $derived(nuanças(colorsUnitat(u.n)[0]));

	// où en est le déroulé de Romain, leçon par leçon
	let brolhons = $state({});
	onMount(() => {
		if (!simulacion()) cargarBrolhons().then((b) => (brolhons = b)).catch(() => {});
	});
	const pè = (l) => {
		const n = brolhons[l.slug]?.plan.length ?? 0;
		return `${l.elements.length} éléments, ${l.etapas.length} étapes` + (n ? `, ton déroulé : ${n}` : '');
	};
</script>

<svelte:head><title>Unitat {u.n} · Bastir · Lo Ligam</title></svelte:head>

<p class="camin"><a href="/admin/bastir">Toutes les unités</a></p>

<header class="cap">
	<h1><b aria-hidden="true">{String(u.n).padStart(2, '0')}</b> <span lang="oc">{u.titol}</span></h1>
	{#if u.fr}<p class="fr">{u.fr}</p>{/if}
</header>

<ul class="leiçons" aria-label="Les leçons de l’unité {u.n}">
	{#each leiçons as l, i (l.slug)}
		{@const [fons, tinta] = tons[i % tons.length]}
		<TeulaBastir href="/admin/bastir/leicon/{l.slug}" num={l.num} titol={l.oc} sota={l.fr} pè={pè(l)} {fons} {tinta} {i} />
	{/each}
</ul>

<style>
	.camin {
		margin: 0 0 1rem;
		font-size: 0.95rem;
	}
	.camin a {
		color: var(--t-tinta-2);
		text-underline-offset: 0.2em;
	}
	.cap {
		margin-bottom: 1.5rem;
	}
	.cap h1 {
		display: flex;
		align-items: baseline;
		gap: 0.3em;
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 6vw, 4rem);
		line-height: 1;
		color: var(--t-tinta);
	}
	.cap h1 b {
		font-weight: 400;
		font-size: 0.5em;
		color: var(--t-aur-gros);
	}
	.fr {
		margin: 0.5rem 0 0;
		max-width: 46ch;
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.leiçons {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	@media (max-width: 900px) {
		.leiçons {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
