<script>
	import Icona from '$lib/components/Icona.svelte';
	// Bandeau commun à toutes les pages (cadre commun, refonte 2026-10-07 dans
	// la charte de l'esbòs de nuèch). Depuis le 2026-10-15 (cahier §11, d'après
	// le site de l'Alliance des collectivités pour la qualité de l'air) : une
	// barre presque vide, la croix-constellation + « Lo Ligam », puis le bouton
	// « Menú » qui ouvre le menu-voile (MenuVel : Se parla, S'apren, Se viu),
	// la seule action en couleur « Reservar un cors », le compte,
	// l'administration, le réglage d'ambiance et la langue. Couleurs de thème
	// (--t-*) : suit le sombre, le clair et le daltonisme. Même API qu'avant
	// (le bloc compte passe en enfant), donc aucune page à modifier.
	import Crotz from './Crotz.svelte';
	import AmbiancaPanel from './AmbiancaPanel.svelte';
	import MenuVel from './MenuVel.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { RESERVAR } from '$lib/data/planSite.js';
	import { esAdmin } from '$lib/adminStore';

	let { children } = $props();
	let lang = $derived(langStore.current);

	let menuDobèrt = $state(false);
	let botonMenu = $state(null);

	const t = {
		oc: { acuelhLong: "Tornar a l'acuèlh", admin: 'Administracion', menu: 'Menú', reservar: 'Reservar un cors' },
		fr: { acuelhLong: "Retour à l'accueil", admin: 'Administration', menu: 'Menu', reservar: 'Réserver un cours' }
	};
	let tx = $derived(t[lang]);
</script>

<header class="top">
	<div class="top-in">
		<a class="brand" href="/" title={tx.acuelhLong} aria-label={`Lo Ligam, ${tx.acuelhLong}`}>
			<Crotz talha={30} teula />
			<span class="brand-name">Lo Ligam</span>
		</a>

		<div class="header-right">
			<button
				type="button"
				class="menu-boton"
				bind:this={botonMenu}
				aria-haspopup="dialog"
				aria-expanded={menuDobèrt}
				onclick={() => (menuDobèrt = !menuDobèrt)}
			>
				<Icona nom="menu" size="1.15em" /><span>{tx.menu}</span>
			</button>
			<a class="reservar" href={RESERVAR} target="_blank" rel="noopener">{tx.reservar}</a>

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

<MenuVel bind:dobèrt={menuDobèrt} {lang} boton={botonMenu} />

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

	/* Une seule ligne : la marque à gauche, tout le reste à droite */
	.top-in {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		column-gap: 1.6rem;
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

	.header-right {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}

	.menu-boton {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		height: 2.2rem;
		padding: 0 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: transparent;
		color: var(--t-tinta);
		font: inherit;
		font-weight: 700;
		font-size: 0.82rem;
		cursor: pointer;
		transition: border-color 0.3s;
	}

	.menu-boton:hover,
	.menu-boton[aria-expanded='true'] {
		border-color: var(--t-aur);
	}

	/* La seule action en couleur de la barre, comme « Nous rejoindre » chez l'Alliance */
	.reservar {
		display: inline-flex;
		align-items: center;
		height: 2.2rem;
		padding: 0 1.1rem;
		border-radius: 999px;
		background: var(--t-aur);
		color: var(--t-fons);
		font-weight: 700;
		font-size: 0.82rem;
		text-decoration: none;
		white-space: nowrap;
		transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.reservar:hover {
		transform: translateY(-1px);
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
	.menu-boton:focus-visible,
	.reservar:focus-visible,
	.brand:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
		border-radius: 6px;
	}

	/* Dégradation par ordre de sacrifice : d'abord le mot « Administration »
	   (l'engrenage reste), puis la réservation (elle reste dans le menu, comme
	   sur le téléphone de l'Alliance), puis l'e-mail du compte, puis le nom du
	   site ; au plus étroit, avec le compte affiché, « Menú » ne garde que son
	   icône (le mot reste pour les lecteurs d'écran), sinon la barre dépasse
	   l'écran et la page glisse de côté. */
	@container (max-width: 44rem) {
		.admin-tèxte,
		.reservar {
			display: none;
		}
	}

	@container (max-width: 34rem) {
		.compte :global(.account-email) {
			display: none;
		}
	}

	@container (max-width: 30rem) {
		.top-in {
			column-gap: 0.8rem;
		}
		.header-right {
			gap: 0.4rem;
		}
		.header-right:has(.compte) .menu-boton {
			justify-content: center;
			width: 2.2rem;
			padding: 0;
		}
		.header-right:has(.compte) .menu-boton span {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
	}

	@container (max-width: 22rem) {
		.brand-name {
			display: none;
		}
	}
</style>
