<script>
	// Les pictogrammes des fiches : ceux des cases du site (Pictograma : forum,
	// wiki, grops…) et quelques-uns dessinés pour la grammaire, au même trait.
	// Toujours décoratifs : le mot est écrit à côté.
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import { PICTOS_PROPRES as PROPRES } from './listas.js';

	let { nom, size = '100%' } = $props();
</script>

{#if PROPRES.includes(nom)}
	<svg class="picto" viewBox="0 0 48 48" width={size} height={size} fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		{#if nom === 'vendre'}
			<path d="M25 6h15a2 2 0 0 1 2 2v15L23 42 6 25z" />
			<circle cx="34" cy="14" r="3" />
		{:else if nom === 'voler'}
			<path d="M13 30a10 10 0 0 1 1-19.5 12 12 0 0 1 21 2.5 8.5 8.5 0 0 1-1 17z" />
			<circle cx="12" cy="37" r="2.6" />
			<circle cx="7" cy="43" r="1.6" />
			<path d="M24 14.5l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" />
		{:else if nom === 'ieu'}
			<circle cx="24" cy="15" r="6.5" />
			<path d="M11 41c1.5-9 6.5-14 13-14s11.5 5 13 14" />
		{:else if nom === 'escotar'}
			<path d="M15 19a11 11 0 0 1 22 0c0 7-6 9-6 15a6 6 0 0 1-11 3" />
			<path d="M21 20a5 5 0 0 1 10 0c0 3-3 4-3 6" />
		{/if}
	</svg>
{:else}
	<Pictograma {nom} {size} />
{/if}
