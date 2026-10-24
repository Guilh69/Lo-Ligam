<script>
	// Page de rubrique 02 S'apren (2026-10-24, chantier 19). Rôle distinct de
	// l'accueil, qui dit COMMENT apprendre (trois façons) : ici, tout ce qui
	// s'apprend, en cases de couleur bien visibles, « un peu comme les objectifs
	// de l'ONU » (Romain). Les cases elles-mêmes sont dans le gabarit commun
	// des pages de rubrique ($lib/apren/PaginaTeulas.svelte, 2026-10-25).
	import { browser } from '$app/environment';
	import PaginaTeulas from '$lib/apren/PaginaTeulas.svelte';
	import { PALETAS, NOMS_PALETAS, PALETA_PER_DEFAUT } from '$lib/apren/teulas.js';
	import { PLAN } from '$lib/data/planSite.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { iniciar } from '$lib/edicion/edicion.svelte.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('apren', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let fr = $derived(langStore.current === 'fr');
	const RUBRICA = PLAN.find((r) => r.id === 'apren');

	// Essai des couleurs : /apren?ensag=colors (pilule en bas), mémorisé
	const CLAU_ENSAG = 'lo-ligam-ensag-teulas';
	let ensag = $state(false);
	let paleta = $state(PALETA_PER_DEFAUT);
	if (browser) {
		ensag = new URLSearchParams(location.search).get('ensag') === 'colors';
		if (ensag)
			try {
				const p = localStorage.getItem(CLAU_ENSAG);
				if (PALETAS[p]) paleta = p;
			} catch {
				// stockage indisponible : le jeu par défaut
			}
	}
	function causirPaleta(p) {
		paleta = p;
		try {
			localStorage.setItem(CLAU_ENSAG, p);
		} catch {
			// pas grave : le choix vaut pour la visite
		}
	}
</script>

<svelte:head>
	<title>{fr ? 'S’apprend' : 'S’apren'} · Lo Ligam</title>
	<meta
		name="description"
		content="Aprene l’occitan : corses en visio, parcors, leiçon d’ensag, mots en imatges. Apprendre l’occitan : cours en visio, parcours, leçon d’essai, mots en images."
	/>
</svelte:head>

<PaginaTeulas pagina="apren" rubrica={RUBRICA} etiqueta={{ oc: 'Çò que s’apren aicí', fr: 'Ce qui s’apprend ici' }} {paleta} />

{#if ensag}
	<!-- Outil d'essai, volontairement neutre (hors charte), comme sur l'accueil -->
	<div class="ensag" role="group" aria-label="Essai : couleurs des cases">
		{#each NOMS_PALETAS as [v, nom] (v)}
			<button type="button" aria-pressed={paleta === v} onclick={() => causirPaleta(v)}>{nom}</button>
		{/each}
	</div>
{/if}

<style>
	.ensag {
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
	.ensag button {
		border: 0;
		border-radius: 999px;
		padding: 0.55rem 0.9rem;
		background: transparent;
		color: #222222;
		font: inherit;
		white-space: nowrap;
		cursor: pointer;
	}
	.ensag button[aria-pressed='true'] {
		background: #222222;
		color: #ffffff;
	}
</style>
