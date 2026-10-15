<script>
	// Essai des gammes du thème sombre (Romain, 2026-10-15 : « un peu trop
	// sombre », plus d'éclat en gardant l'aspect). Allumé par /?ensag=gama, il
	// suit sur toutes les pages de ce navigateur seulement ; le choix est posé
	// sur <html data-gama> (couleurs dans app.css, éclat du fond vivant dans
	// acuelh/motor.js). « Fermer » revient à la gamme actuelle. Outil neutre,
	// hors charte, pour ne pas se confondre avec le site.
	import { onMount } from 'svelte';

	const CLAU_ENSAG = 'lo-ligam-ensag-gama';
	const CLAU_GAMA = 'lo-ligam-gama';
	const GAMAS = [
		['', 'Actuel'],
		['eclat', 'Éclat'],
		['eclat-plus', 'Éclat +']
	];
	let visible = $state(false);
	let gama = $state('');

	function aplicar(g) {
		gama = g;
		if (g) document.documentElement.dataset.gama = g;
		else delete document.documentElement.dataset.gama;
		try {
			localStorage.setItem(CLAU_GAMA, g);
		} catch {}
	}
	function tampar() {
		aplicar('');
		visible = false;
		try {
			localStorage.removeItem(CLAU_ENSAG);
			localStorage.removeItem(CLAU_GAMA);
		} catch {}
	}

	onMount(() => {
		try {
			if (new URLSearchParams(location.search).get('ensag') === 'gama') localStorage.setItem(CLAU_ENSAG, 'on');
			visible = localStorage.getItem(CLAU_ENSAG) === 'on';
			if (visible) aplicar(localStorage.getItem(CLAU_GAMA) ?? '');
		} catch {}
	});
</script>

{#if visible}
	<div class="ensag-gama" role="group" aria-label="Essai : gamme de couleurs du thème sombre">
		{#each GAMAS as [v, nom] (v)}
			<button type="button" aria-pressed={gama === v} onclick={() => aplicar(v)}>{nom}</button>
		{/each}
		<button type="button" class="tampar" onclick={tampar} aria-label="Fermer l'essai des gammes">✕</button>
	</div>
{/if}

<style>
	.ensag-gama {
		position: fixed;
		left: 50%;
		bottom: 1rem;
		z-index: 2000;
		transform: translateX(-50%);
		display: flex;
		gap: 3px;
		padding: 4px;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
		font: 700 0.8rem/1 system-ui, sans-serif;
	}
	button {
		border: 0;
		border-radius: 999px;
		padding: 0.55rem 1rem;
		background: transparent;
		color: #222222;
		font: inherit;
		cursor: pointer;
	}
	button[aria-pressed='true'] {
		background: #222222;
		color: #ffffff;
	}
	.tampar {
		padding: 0.55rem 0.8rem;
		color: #777777;
	}
</style>
