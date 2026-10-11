<script>
	import Icona from '$lib/components/Icona.svelte';
	// Bandeau commun à toutes les pages (cadre commun, refonte 2026-10-07 dans
	// la charte de l'esbòs de nuèch) : la croix-constellation + « Lo Ligam » en
	// Limelight, quatre liens texte, puis le compte, l'administration, le
	// réglage d'ambiance et la langue. Couleurs de thème (--t-*) : suit le
	// sombre, le clair et le daltonisme. Même API qu'avant (le bloc compte
	// passe en enfant), donc aucune page à modifier.
	import { page } from '$app/state';
	import Crotz from './Crotz.svelte';
	import AmbiancaPanel from './AmbiancaPanel.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { esAdmin } from '$lib/adminStore';

	let { children } = $props();
	let lang = $derived(langStore.current);

	const t = {
		oc: { acuelhLong: "Tornar a l'acuèlh", admin: 'Administracion', nav: 'Navigacion' },
		fr: { acuelhLong: "Retour à l'accueil", admin: 'Administration', nav: 'Navigation' }
	};
	const LIGAMS = [
		{ href: '/aprene', oc: 'Aprene', fr: 'Apprendre' },
		{ href: '/carta', oc: 'La carta', fr: 'La carte' },
		{ href: '/mots', oc: 'Mots', fr: 'Mots' },
		{ href: '/obras', oc: 'Òbras', fr: 'Œuvres' }
	];
	let tx = $derived(t[lang]);
	const actiu = (href) => page.url.pathname === href || page.url.pathname.startsWith(href + '/');
</script>

<header class="top">
	<div class="top-in">
		<a class="brand" href="/" title={tx.acuelhLong} aria-label={`Lo Ligam, ${tx.acuelhLong}`}>
			<Crotz talha={30} />
			<span class="brand-name">Lo Ligam</span>
		</a>

		<nav class="nav" aria-label={tx.nav}>
			{#each LIGAMS as l (l.href)}
				<a class="nav-ligam" href={l.href} aria-current={actiu(l.href) ? 'page' : undefined}
					>{lang === 'oc' ? l.oc : l.fr}</a
				>
			{/each}
		</nav>

		<div class="header-right">
			{#if children}
				<div class="compte">
					{@render children()}
				</div>
			{/if}

			<!-- Visible seulement pour un administrateur. C'est du confort, pas une
			     protection : les verrous sont dans la base (RLS). -->
			{#if $esAdmin}
				<a class="admin-link" href="/admin" title={tx.admin}>
					<Icona nom="reglages" size="1.1em" />
					<span class="admin-tèxte">{tx.admin}</span>
				</a>
			{/if}

			<AmbiancaPanel />

			<div class="lang-toggle" role="group" aria-label="Lenga / Langue">
				<button type="button" aria-pressed={lang === 'oc'} lang="oc" onclick={() => (langStore.current = 'oc')}
					>Òc</button
				>
				<button type="button" aria-pressed={lang === 'fr'} lang="fr" onclick={() => (langStore.current = 'fr')}
					>Fr</button
				>
			</div>
		</div>
	</div>
</header>

<style>
	.top {
		width: 100%;
		max-width: 40rem;
		color: var(--t-tinta);
		/* On mesure la largeur DU BANDEAU, pas celle de la fenêtre : le même
		   bandeau vit contraint à 40 rem (aprene, compte) ou pleine largeur
		   (carta). */
		container-type: inline-size;
	}

	/* Une ligne quand il y a la place : marque · liens · réglages. Sinon deux
	   lignes nettes : marque et réglages en haut, liens dessous (jamais un
	   bloc de réglages qui retombe de travers sous les liens). */
	.top-in {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-areas: 'brand nav right';
		align-items: center;
		column-gap: 1.6rem;
		row-gap: 0.9rem;
	}

	.brand {
		grid-area: brand;
	}

	.nav {
		grid-area: nav;
	}

	.header-right {
		grid-area: right;
	}

	@container (max-width: 52rem) {
		.top-in {
			grid-template-columns: auto auto;
			grid-template-areas:
				'brand right'
				'nav nav';
		}
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		text-decoration: none;
		color: var(--t-tinta);
	}

	.brand :global(svg) {
		transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.brand:hover :global(svg) {
		transform: rotate(90deg);
	}

	.brand-name {
		font-family: var(--font-logo);
		font-size: 1.3rem;
		white-space: nowrap;
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 1.1rem;
	}

	/* Lien texte, soulignement d'or qui balaie de gauche à droite */
	.nav-ligam {
		position: relative;
		padding: 0.3rem 0;
		font-size: 0.86rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		text-decoration: none;
		white-space: nowrap;
		color: var(--t-tinta);
	}

	.nav-ligam::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 1px;
		background: var(--t-aur);
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.nav-ligam:hover::after,
	.nav-ligam:focus-visible::after,
	.nav-ligam[aria-current='page']::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.nav-ligam[aria-current='page'] {
		color: var(--t-aur);
	}

	.header-right {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}

	/* Le bloc compte fourni par la page : encadré discret, pour qu'un pseudo
	   ne se confonde jamais avec le nom du site à gauche. */
	.compte {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		height: 2.2rem;
		padding: 0 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--t-linha);
		font-size: 0.82rem;
	}

	.compte:empty {
		display: none;
	}

	.admin-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		height: 2.2rem;
		padding: 0 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--t-linha);
		color: var(--t-tinta);
		font-weight: 700;
		font-size: 0.78rem;
		text-decoration: none;
		white-space: nowrap;
		transition: border-color 0.3s;
	}

	.admin-link:hover {
		border-color: var(--t-aur);
	}

	.lang-toggle {
		display: inline-flex;
		gap: 2px;
		padding: 3px;
		border-radius: 999px;
		border: 1px solid var(--t-linha);
	}

	.lang-toggle button {
		border: 0;
		background: transparent;
		color: var(--t-tinta);
		font-weight: 700;
		font-size: 0.78rem;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background 0.5s cubic-bezier(0.19, 1, 0.22, 1),
			color 0.5s;
	}

	.lang-toggle button[aria-pressed='true'] {
		background: var(--t-tinta);
		color: var(--t-fons);
	}

	.lang-toggle button:focus-visible,
	.nav-ligam:focus-visible,
	.brand:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
		border-radius: 6px;
	}

	/* Dégradation par ordre de sacrifice : d'abord le mot « Administration »
	   (l'engrenage reste), puis l'e-mail du compte, puis le nom du site. */
	@container (max-width: 41rem) {
		.admin-tèxte {
			display: none;
		}
	}

	@container (max-width: 34rem) {
		.compte :global(.account-email) {
			display: none;
		}
	}

	@container (max-width: 22rem) {
		.brand-name {
			display: none;
		}
	}
</style>
