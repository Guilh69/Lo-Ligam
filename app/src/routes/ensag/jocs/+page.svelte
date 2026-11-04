<script>
	// Jòcs, page d'essai (chantier 27, idée de Romain du 2026-11-04) : l'espace
	// de jeux, plein écran et stable (Romain, 05-11 : « une interface pleine et
	// stable », sans le pied de page ni la navigation du site, comme la Pluie
	// de mots) ; un jeu à la fois : La sèrp de las letras (04-11, option A sur
	// 3) et Los panièrs (05-11). Le jeu choisi reste dans l'adresse
	// (?joc=paniers). Non indexée, pas dans le menu. Les jeux : $lib/jocs/.
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Serp from '$lib/jocs/Serp.svelte';
	import Paniers from '$lib/jocs/Paniers.svelte';
	import { tria } from '$lib/stores/lang.svelte.js';

	const T = {
		tornar: { oc: 'Tornar a l’acuèlh', fr: 'Revenir à l’accueil' },
		triar: { oc: 'Triar un jòc', fr: 'Choisir un jeu' }
	};
	const JOCS = [
		{ id: 'serp', oc: 'La sèrp de las letras' },
		{ id: 'paniers', oc: 'Los panièrs' }
	];
	const demandat = page.url.searchParams.get('joc');
	let joc = $state(JOCS.some((j) => j.id === demandat) ? demandat : 'serp');
	function triar(id) {
		if (id === joc) return;
		joc = id;
		const u = new URL(page.url);
		u.searchParams.set('joc', id);
		replaceState(u, {});
	}
</script>

<svelte:head>
	<title>Jòcs · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="contengut" class="espaci">
	<header class="barra">
		<a class="tornar" href="/" aria-label="Lo Ligam, {tria(T.tornar)}"><span aria-hidden="true">‹</span> Lo Ligam</a>
		<h1 lang="oc">Jòcs</h1>
		<nav class="onglets" aria-label={tria(T.triar)}>
			{#each JOCS as j (j.id)}
				<button type="button" aria-pressed={joc === j.id} onclick={() => triar(j.id)} lang="oc">{j.oc}</button>
			{/each}
		</nav>
	</header>
	<div class="scena">
		{#if joc === 'serp'}
			<Serp />
		{:else}
			<Paniers />
		{/if}
	</div>
</main>

<style>
	/* L'espace couvre tout : ni bandeau du site, ni pied de page ; on en sort
	   par « ‹ Lo Ligam ». Le thème (sombre, clair, daltonisme) suit le site. */
	.espaci {
		position: fixed;
		inset: 0;
		z-index: 10;
		display: grid;
		grid-template-rows: auto 1fr;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
	}
	.barra {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem var(--esp-16);
		padding: 0.7rem clamp(1rem, 3vw, 2.4rem);
		border-bottom: 1px solid var(--t-linha);
	}
	.tornar {
		color: var(--t-tinta-2);
		text-decoration: none;
	}
	.tornar:hover {
		color: var(--t-tinta);
	}
	.tornar:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
		border-radius: 0.3rem;
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.6rem;
		line-height: 1;
	}
	.onglets {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-inline-start: auto;
	}
	.onglets button {
		min-height: 2.5rem;
		padding: 0.35rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 0.6rem;
		background: none;
		font: inherit;
		color: var(--t-tinta);
		cursor: pointer;
	}
	.onglets button:hover {
		border-color: var(--t-tinta-2);
	}
	.onglets button[aria-pressed='true'] {
		border-color: transparent;
		background: var(--color-gold);
		color: var(--color-text);
	}
	.onglets button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	/* Téléphone : les onglets sur leur propre ligne, à parts égales */
	@media (max-width: 559px) {
		.barra {
			padding-block: 0.5rem;
		}
		.onglets {
			flex-basis: 100%;
			margin-inline-start: 0;
		}
		.onglets button {
			flex: 1;
			min-height: 2.5rem;
			padding: 0.25rem 0.5rem;
			font-size: 0.92rem;
		}
	}
	.scena {
		overflow: auto;
		padding: clamp(1rem, 2.5vh, 2rem) clamp(1rem, 3vw, 2.4rem) var(--esp-32);
	}
	.scena > :global(.joc) {
		max-width: 90rem;
		margin: 0 auto;
	}
</style>
