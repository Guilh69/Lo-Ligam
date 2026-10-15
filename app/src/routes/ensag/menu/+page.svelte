<script>
	// Banc d'essai du menu (2026-10-15, option 2 de Romain d'après le site de
	// l'Alliance des collectivités pour la qualité de l'air). Le bouton allume
	// le nouveau menu dans CE navigateur seulement, sur toutes les pages : on
	// juge le vrai bandeau et le vrai pied de page, pas une copie.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { essaiMenu, mudarEssaiMenu } from '$lib/stores/essaiMenu.svelte.js';

	const PAGINAS = [
		['/', 'Accueil (thème sombre, barre qui se cache au défilement)'],
		['/carta', 'La carte'],
		['/mots', 'Mots en images'],
		['/aprene', 'Apprendre (bandeau étroit, avec le compte)'],
		['/obras', 'Œuvres']
	];
</script>

<svelte:head>
	<title>Essai du menu · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="ensag">
	<AppHeader />

	<main>
		<h1>Essai du menu</h1>
		<p>
			Option 2, d'après le site de l'Alliance : une barre presque vide (Menu, Réserver un cours, compte, ambiance, langue)
			et un grand panneau rangé comme l'accueil, en trois colonnes : Se parle, S'apprend, Se vit. Le pied de page
			reprend le même plan.
		</p>
		<p>
			L'essai ne vaut que pour ce navigateur : les autres visiteurs gardent la barre actuelle. Une pastille
			« Menu d'essai », en bas à gauche, rappelle qu'il est allumé et ramène ici.
		</p>

		<div class="bascula" role="group" aria-label="Menu affiché">
			<button type="button" aria-pressed={!essaiMenu.actiu} onclick={() => mudarEssaiMenu(false)}>Actuel</button>
			<button type="button" aria-pressed={essaiMenu.actiu} onclick={() => mudarEssaiMenu(true)}>Essai</button>
		</div>

		<h2>Pages pour juger</h2>
		<ul>
			{#each PAGINAS as [href, nom] (href)}
				<li><a {href}>{nom}</a></li>
			{/each}
		</ul>
	</main>
</div>

<style>
	.ensag {
		max-width: 46rem;
		margin: 0 auto;
		padding: 1.4rem 1.2rem 0;
	}

	main {
		padding: 3rem 0 1rem;
		line-height: 1.7;
	}

	h1 {
		font-family: var(--font-heading);
		font-size: 2.4rem;
		margin: 0 0 1rem;
	}

	h2 {
		font-family: var(--font-heading);
		font-size: 1.4rem;
		margin: 2.4rem 0 0.6rem;
	}

	.bascula {
		display: inline-flex;
		gap: 3px;
		margin-top: 1.4rem;
		padding: 4px;
		border-radius: 999px;
		border: 1px solid var(--t-linha);
	}

	.bascula button {
		border: 0;
		background: transparent;
		color: var(--t-tinta);
		font: inherit;
		font-weight: 700;
		padding: 0.55rem 1.4rem;
		border-radius: 999px;
		cursor: pointer;
	}

	.bascula button[aria-pressed='true'] {
		background: var(--t-tinta);
		color: var(--t-fons);
	}

	.bascula button:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
	}

	a {
		color: var(--t-terra);
	}
</style>
