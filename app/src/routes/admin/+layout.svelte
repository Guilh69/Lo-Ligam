<script>
	// Portail de l'espace d'administration : le contrôle d'accès est fait ICI,
	// une seule fois, pour toutes les pages en dessous.
	//
	// RAPPEL : ce contrôle rend l'espace propre à utiliser, il ne protège PAS le
	// site. N'importe qui peut lire ce fichier et appeler la base directement.
	// Ce qui protège, ce sont les politiques RLS, qui refusent l'écriture à qui
	// n'est pas administrateur — quoi que fasse le navigateur.
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady } from '$lib/authStore';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	let estat = $state('cargament'); // cargament | pas-connectat | pas-admin | admin

	$effect(() => {
		if (!$authReady) return;
		if (!$session) {
			estat = 'pas-connectat';
			return;
		}
		supabase.rpc('is_admin').then(({ data }) => {
			estat = data === true ? 'admin' : 'pas-admin';
		});
	});

	const menut = [
		{ href: '/admin', oc: 'Verrolhs', fr: 'Verrous' },
		{ href: '/admin/grops', oc: 'Grops', fr: 'Groupes' },
		{ href: '/admin/designs', oc: 'Designs', fr: 'Designs' },
		{ href: '/admin/obras', oc: 'Òbras', fr: 'Œuvres' },
		{ href: '/admin/carta', oc: 'Carta', fr: 'Carte' },
		{ href: '/admin/carta/luocs', oc: 'Luòcs', fr: 'Lieux' },
		{ href: '/admin/textes', oc: 'Tèxtes', fr: 'Textes' }
	];
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="admin-screen">
	<AppHeader />

	{#if estat === 'cargament'}
		<section class="card"><p class="subtitle">Un momenton…</p></section>
	{:else if estat === 'pas-connectat'}
		<section class="card">
			<h1>Espaci reservat</h1>
			<p class="subtitle"><em>(Espace réservé)</em></p>
			<a class="btn-primary" href="/compte">Se connectar <span class="arrow">→</span></a>
		</section>
	{:else if estat === 'pas-admin'}
		<section class="card">
			<h1>Espaci reservat</h1>
			<p class="msg info">
				Ton compte a pas los dreches per aquesta pagina.
				<em>(Ton compte n'a pas les droits pour cette page.)</em>
			</p>
		</section>
	{:else}
		<nav class="menut" aria-label="Espaci d'administracion">
			{#each menut as m (m.href)}
				<a href={m.href} class:actiu={page.url.pathname === m.href}>{m.oc}</a>
			{/each}
		</nav>

		{@render children()}
	{/if}
</main>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 380px;
		height: 380px;
		background: var(--color-gold);
		opacity: 0.3;
		top: -120px;
		left: -100px;
	}

	.blob-teal {
		width: 340px;
		height: 340px;
		background: var(--color-teal);
		opacity: 0.18;
		bottom: -100px;
		right: -100px;
	}

	.admin-screen {
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem;
	}

	.menut {
		display: flex;
		gap: 0.35rem;
		background: rgba(255, 255, 255, 0.75);
		padding: 0.3rem;
		border-radius: 999px;
		margin-top: 1rem;
	}

	.menut a {
		padding: 0.5rem 1.1rem;
		border-radius: 999px;
		text-decoration: none;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.92rem;
		color: var(--color-text);
		transition: background-color 150ms ease;
	}

	.menut a.actiu {
		background: var(--color-terracotta);
		color: white;
	}

	/* Styles partagés par les pages de l'espace d'administration. Déclarés ici
	   pour ne pas les recopier dans chaque page ; cantonnés à .admin-screen
	   pour ne rien déborder sur le reste du site. */
	.admin-screen :global(.card) {
		width: 100%;
		max-width: 46rem;
		background: white;
		border-radius: 24px;
		padding: 2rem 2.25rem;
		box-shadow: 0 16px 36px rgba(58, 42, 32, 0.1);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.admin-screen :global(h1) {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.5rem;
		color: var(--color-text);
	}

	.admin-screen :global(h2) {
		margin: 0.5rem 0 0;
		font-family: var(--font-heading);
		font-size: 1.1rem;
		color: var(--color-text);
	}

	/* Volontairement PAS en :global : une marge négative partagée finit toujours
	   par faire chevaucher le titre d'une page qui l'agence autrement — c'est
	   arrivé sur l'écran des designs. Chaque page règle son propre sous-titre ;
	   cette règle-ci ne vaut que pour le « Espaci reservat » ci-dessus. */
	.subtitle {
		margin: -0.7rem 0 0;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.admin-screen :global(.msg) {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.45;
		padding: 0.6rem 0.8rem;
		border-radius: 10px;
	}

	.admin-screen :global(.msg em),
	.admin-screen :global(.subtitle em) {
		color: inherit;
		opacity: 0.85;
	}

	.admin-screen :global(.msg.ok) {
		background: rgba(107, 124, 50, 0.12);
		color: var(--color-olive);
	}

	.admin-screen :global(.msg.error) {
		background: rgba(165, 52, 42, 0.1);
		color: var(--color-brick);
	}

	.admin-screen :global(.msg.info) {
		background: rgba(31, 95, 99, 0.1);
		color: var(--color-teal);
	}

	.admin-screen :global(.btn-primary) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--color-gold);
		color: var(--color-text);
		border: none;
		padding: 0.9rem 1.5rem;
		border-radius: 999px;
		font-weight: 600;
		font-family: var(--font-heading);
		font-size: 1.05rem;
		cursor: pointer;
		text-decoration: none;
		transition:
			transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 220ms ease,
			filter 80ms ease;
		box-shadow: 0 6px 18px rgba(238, 175, 52, 0.45);
	}

	.admin-screen :global(.btn-primary:hover:not(:disabled)) {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 10px 24px rgba(238, 175, 52, 0.55);
	}

	.admin-screen :global(.btn-primary:active:not(:disabled)) {
		transform: translateY(0) scale(0.97);
		filter: brightness(0.95);
	}

	.admin-screen :global(.btn-primary:disabled) {
		opacity: 0.6;
		cursor: default;
	}

	.admin-screen :global(.btn-segond) {
		background: transparent;
		border: 1.5px solid rgba(58, 42, 32, 0.2);
		color: var(--color-text);
		padding: 0.5rem 0.9rem;
		border-radius: 999px;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.admin-screen :global(.btn-segond:hover:not(:disabled)) {
		border-color: var(--color-teal);
		color: var(--color-teal);
	}

	.admin-screen :global(.btn-segond:disabled) {
		opacity: 0.4;
		cursor: default;
	}

	.admin-screen :global(.btn-perilhos) {
		border-color: rgba(165, 52, 42, 0.35);
		color: var(--color-brick);
	}

	.admin-screen :global(label) {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.admin-screen :global(input[type='text']),
	.admin-screen :global(select) {
		font-family: var(--font-body);
		font-size: 1rem;
		padding: 0.65rem 0.8rem;
		border-radius: 12px;
		border: 1.5px solid rgba(58, 42, 32, 0.15);
		background: var(--color-cream);
		color: var(--color-text);
	}

	@media (prefers-reduced-motion: reduce) {
		.admin-screen :global(.btn-primary) {
			transition: none;
		}
	}
</style>
