<script>
	import HomeIcon from './HomeIcon.svelte';
	import OccitaniaIcon from './OccitaniaIcon.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { esAdmin } from '$lib/adminStore';

	let { children } = $props();
	let lang = $derived(langStore.current);
</script>

<header class="top">
	<a class="home-link" href="/" aria-label={lang === 'oc' ? "Tornar a l'acuèlh" : "Retour à l'accueil"}>
		<HomeIcon size={22} />
	</a>
	<span class="brand-name">Lo Ligam</span>
	<a
		class="carta-link"
		href="/carta"
		aria-label={lang === 'oc' ? 'Veire lo Mond en occitan' : 'Voir le Monde en occitan'}
	>
		<OccitaniaIcon size={20} />
	</a>
	<div class="header-right">
		{#if children}
			{@render children()}
		{/if}
		<!-- Visible seulement pour un administrateur. C'est du confort, pas une
		     protection : les verrous sont dans la base (RLS). -->
		{#if $esAdmin}
			<a class="admin-link" href="/admin">
				<span aria-hidden="true">⚙</span>
				{lang === 'oc' ? 'Administracion' : 'Administration'}
			</a>
		{/if}
		<!-- Selector de lenga present sus TOTAS las paginas que passan per
		     aqueste entèsta, pas mai sonque sus l'acuèlh. -->
		<div class="lang-toggle" role="group" aria-label="Lenga / Langue">
			<button type="button" class:active={lang === 'oc'} onclick={() => (langStore.current = 'oc')}
				>Òc</button
			>
			<button
				type="button"
				class="fr"
				class:active={lang === 'fr'}
				onclick={() => (langStore.current = 'fr')}>Fr</button
			>
		</div>
	</div>
</header>

<style>
	.top {
		width: 100%;
		max-width: 40rem;
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.admin-link {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		background: rgba(31, 95, 99, 0.12);
		color: var(--color-teal);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.78rem;
		text-decoration: none;
		white-space: nowrap;
	}

	.admin-link:hover {
		background: rgba(31, 95, 99, 0.2);
	}

	.home-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 999px;
		color: var(--color-brick);
		background: rgba(165, 52, 42, 0.1);
		text-decoration: none;
		transition:
			background-color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.home-link:hover {
		background: rgba(165, 52, 42, 0.18);
		transform: scale(1.06);
	}

	.carta-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 999px;
		color: var(--color-teal);
		background: rgba(31, 95, 99, 0.1);
		text-decoration: none;
		transition:
			background-color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.carta-link:hover {
		background: rgba(31, 95, 99, 0.18);
		transform: scale(1.06);
	}

	.brand-name {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--color-text);
	}

	.header-right {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	/* Même sélecteur de langue que sur l'accueil, pour que le geste soit
	   identique partout. */
	.lang-toggle {
		display: flex;
		gap: 0.35rem;
		background: white;
		padding: 0.25rem;
		border-radius: 999px;
		box-shadow: 0 2px 8px rgba(58, 42, 32, 0.12);
	}

	.lang-toggle button {
		border: none;
		background: transparent;
		color: var(--color-text);
		font-weight: 600;
		font-size: 0.8rem;
		padding: 0.3rem 0.65rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.lang-toggle button:hover {
		transform: scale(1.08);
	}

	.lang-toggle button:active {
		transform: scale(0.95);
	}

	.lang-toggle button.active {
		background: var(--color-terracotta);
		color: white;
	}

	.lang-toggle button.fr.active {
		background: var(--color-sky);
	}
</style>
