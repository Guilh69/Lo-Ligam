<script>
	// A validar (2026-11-07) : La pila et Triar réunies sur une seule page. Romain : « trop de
	// pages différentes qui ne fonctionnent pas dans un écosystème cohérent » ; les deux pages
	// faisaient le même geste (une carte à la fois : garder, refaire, répondre) avec deux
	// en-têtes, deux largeurs, deux jeux de touches et des rechargements complets.
	//  - La pila  (PilaCartes) : les questions de l'IA, ses réponses, l'occitan des pages, les fiches ;
	//  - Triar    (TriarCartes) : les dessins, les photos, les décisions, en lots.
	// L'adresse dit où l'on est : /admin/valider?vue=pila&lot=gramatica, ?vue=triar&lot=releu.
	// Changer de vue ou de lot est une navigation sans rechargement : « Précédent » revient
	// exactement où l'on était. Les anciennes adresses /admin/pila et /admin/triar redirigent ici.
	// Les clés de données (la colonne `pagina` des remarques : '/admin/triar') ne changent pas :
	// scripts/triar.mjs et scripts/remarcas.mjs les lisent.
	import { page } from '$app/state';
	import AdminTete from '$lib/talhier/AdminTete.svelte';
	import PilaCartes from './PilaCartes.svelte';
	import TriarCartes from './TriarCartes.svelte';

	const vue = $derived(page.url.searchParams.get('vue') === 'triar' ? 'triar' : 'pila');
	const lot = $derived(page.url.searchParams.get('lot'));
	const VUES = [
		{ id: 'pila', oc: 'La pila', fr: 'les questions de l’IA, l’occitan des pages, les fiches de grammaire' },
		{ id: 'triar', oc: 'Triar', fr: 'les dessins, les photos, les décisions' }
	];
</script>

<svelte:head>
	<title>A validar — Espaci d'administracion</title>
</svelte:head>

<AdminTete oc="A validar" fr="à valider" resume="Ce qui attend ton œil, une carte à la fois : tu gardes, tu renvoies à refaire, ou tu réponds." />

<nav class="vues" aria-label="Ce qu’on valide">
	{#each VUES as v (v.id)}
		<a href="?vue={v.id}" aria-current={vue === v.id ? 'page' : undefined}>
			<span lang="oc">{v.oc}</span>
			<small>{v.fr}</small>
		</a>
	{/each}
</nav>

<div class="cartes">
	{#if vue === 'pila'}
		<PilaCartes {lot} />
	{:else}
		<!-- chaque lot a ses propres cœurs en attente : changer de lot remonte le composant -->
		{#key lot}
			<TriarCartes lotId={lot} />
		{/key}
	{/if}
</div>

<style>
	.vues {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
		margin-bottom: 1.2rem;
	}
	.vues a {
		display: grid;
		gap: 0.1rem;
		min-height: 44px;
		padding: 0.6rem 0.9rem;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.25));
		border-radius: 10px;
		color: var(--t-tinta, #2a1a10);
		text-decoration: none;
		background: color-mix(in srgb, #fff 55%, transparent);
	}
	.vues a span {
		font-weight: 700;
	}
	.vues small {
		font-size: 0.78rem;
		line-height: 1.35;
		opacity: 0.75;
	}
	.vues a[aria-current='page'] {
		border: 2px solid var(--t-aur, #9c5611);
		background: color-mix(in srgb, var(--t-aur, #9c5611) 12%, transparent);
	}
	.vues a:focus-visible {
		outline: 2px solid var(--t-aur, #9c5611);
		outline-offset: 2px;
	}
	.cartes {
		display: flex;
		justify-content: center;
	}
	.cartes :global(section) {
		min-width: 0;
	}
</style>
