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
	import { lang as langStore, LENGAS, SEGONDAS } from '$lib/stores/lang.svelte.js';
	import { tampaDefòra } from '$lib/tampaDefora.js';
	import { VISIO } from '$lib/data/planSite.js';
	import { esAdmin } from '$lib/adminStore';
	import { session, authReady, pseudoCompte } from '$lib/authStore';
	import { page } from '$app/state';
	import Avatar from '$lib/grops/Avatar.svelte';

	let { children } = $props();
	let lang = $derived(langStore.current);

	let menuDobèrt = $state(false);
	let botonMenu = $state(null);

	// Première visite (Romain, 2026-10-22, DIRECCION bloc 2 : le site s'ouvre en
	// occitan par choix, « mais rendre la bascule en français évidente ») : le
	// bouton Òc / Fr se met en avant quelques secondes, avec sa légende, tant
	// qu'aucune langue n'a été choisie ; une seule fois par navigateur.
	const CLAU_VISTA = 'lo-ligam-lenga-vista';
	let crida = $state(false);
	$effect(() => {
		try {
			if (localStorage.getItem('lo-ligam-lang') || localStorage.getItem(CLAU_VISTA)) return;
			localStorage.setItem(CLAU_VISTA, '1');
		} catch {
			// stockage indisponible : on montre quand même, une fois par visite
		}
		crida = true;
		const t = setTimeout(() => (crida = false), 7000);
		return () => clearTimeout(t);
	});
	function causirLenga(v) {
		langStore.current = v;
		crida = false;
		globeDobert = false;
	}

	// Globe : l'espagnol, l'anglais et le catalan, pour qui découvre le site
	// (cahier §11, 2026-10-25). Òc / Fr reste la bascule du cœur, le globe est
	// posé juste à côté. L'occitan reste le repli de tout ce qui n'est pas
	// encore traduit.
	let botonGlobe = $state(null);
	let panelGlobe = $state(null);
	let globeDobert = $state(false);
	// La 2e place de la bascule montre la « seconde » langue (fr par défaut) ;
	// le globe permet d'en choisir une autre — les langues non occitanes qui ne
	// sont pas déjà dans la bascule, en ordre alphabétique (Romain, 2026-10-26).
	let segonda = $derived(langStore.segonda);
	let autras = $derived(SEGONDAS.filter((c) => c !== segonda));
	const GLOBE_ETIQ = { oc: 'Autras lengas', fr: 'Autres langues', es: 'Otros idiomas', en: 'Other languages', ca: 'Altres llengües' };
	let globeEtiq = $derived(GLOBE_ETIQ[lang] ?? GLOBE_ETIQ.oc);
	function basculaGlobe() {
		globeDobert = !globeDobert;
	}
	function causirGlobe(code) {
		langStore.current = code;
		globeDobert = false;
		botonGlobe?.focus();
	}
	// Ferme sur Échap ou clic dehors, et rend le focus au globe (comme Ambiance).
	$effect(() => {
		if (!globeDobert) return;
		const lèva = tampaDefòra(
			(t) => !!(panelGlobe?.contains(t) || botonGlobe?.contains(t)),
			() => (globeDobert = false)
		);
		const tòca = (e) => {
			if (e.key === 'Escape') {
				globeDobert = false;
				botonGlobe?.focus();
			}
		};
		document.addEventListener('keydown', tòca);
		return () => {
			lèva();
			document.removeEventListener('keydown', tòca);
		};
	});

	const t = {
		oc: { acuelhLong: "Tornar a l'acuèlh", admin: 'Administracion', menu: 'Menú', reservar: 'Reservar un cors', compte: 'Mon compte', connectar: 'Se connectar' },
		fr: { acuelhLong: "Retour à l'accueil", admin: 'Administration', menu: 'Menu', reservar: 'Réserver un cours', compte: 'Mon compte', connectar: 'Se connecter' },
		es: { acuelhLong: 'Volver al inicio', admin: 'Administración', menu: 'Menú', reservar: 'Reservar una clase', compte: 'Mi cuenta', connectar: 'Iniciar sesión' },
		en: { acuelhLong: 'Back to home', admin: 'Administration', menu: 'Menu', reservar: 'Book a lesson', compte: 'My account', connectar: 'Log in' },
		ca: { acuelhLong: 'Tornar a l’inici', admin: 'Administració', menu: 'Menú', reservar: 'Reservar una classe', compte: 'El meu compte', connectar: 'Inicia la sessió' }
	};
	let tx = $derived(t[lang] ?? t.oc);

	// Le compte, sur toutes les pages (2026-10-25) : « Se connectar » pour un
	// visiteur (on revient ensuite sur la page où l'on était), l'initiale et
	// « Mon compte » une fois connecté.
	let surCompte = $derived(page.url.pathname.startsWith('/compte'));
	let tornar = $derived(surCompte ? '/compte' : '/compte?tornar=' + encodeURIComponent(page.url.pathname));
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
			<a class="reservar" href={VISIO}>{tx.reservar}</a>

			{#if children}
				<div class="compte">
					{@render children()}
				</div>
			{/if}

			{#if $session}
				<a class="compte-ligam connectat" href="/compte" aria-current={surCompte ? 'page' : undefined} title={tx.compte}>
					<Avatar pseudo={$pseudoCompte ?? $session.user.email ?? '?'} id={$session.user.id} size="1.6rem" />
					<span class="compte-tèxte">{tx.compte}</span>
				</a>
			{:else if $authReady}
				<a class="compte-ligam" href={tornar} aria-current={surCompte ? 'page' : undefined} title={tx.connectar}>
					<Icona nom="persona" size="1.15em" />
					<span class="compte-tèxte">{tx.connectar}</span>
				</a>
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

			<div class="lengas">
				<div class="lang-toggle" class:en-avant={crida} role="group" aria-label="Lenga / Langue">
					<button type="button" aria-pressed={lang === 'oc'} lang="oc" onclick={() => causirLenga('oc')}>Òc</button>
					<button type="button" aria-pressed={lang === segonda} lang={segonda} onclick={() => causirLenga(segonda)}>{LENGAS[segonda].curt}</button>
					{#if crida}
						<span class="lang-crida" aria-hidden="true"><span lang="oc">lenga</span> · <span lang="fr">langue</span></span>
					{/if}
				</div>
				<div class="lang-globe">
					<button
						type="button"
						class="globe-boton"
						bind:this={botonGlobe}
						aria-expanded={globeDobert}
						aria-controls="globe-panel"
						title={globeEtiq}
						onclick={basculaGlobe}>
						<Icona nom="mond" size="1.2rem" />
						<span class="sr-only">{globeEtiq}</span>
					</button>
					{#if globeDobert}
						<div class="globe-panel" id="globe-panel" bind:this={panelGlobe} role="group" aria-label={globeEtiq}>
							{#each autras as code (code)}
								<button
									type="button"
									lang={code}
									onclick={() => causirGlobe(code)}>{LENGAS[code].nom}</button>
							{/each}
						</div>
					{/if}
				</div>
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
		border-color: var(--t-accion);
	}

	/* La seule action en couleur de la barre, comme « Nous rejoindre » chez l'Alliance ;
	   en tuile du rouge du logo, la couleur de ce qui se clique (app.css, 2026-10-23) */
	.reservar {
		display: inline-flex;
		align-items: center;
		height: 2.2rem;
		padding: 0 1.1rem;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
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

	/* le compte : même pastille discrète que l'administration, l'initiale
	   devant ; le rouge reste à « Reservar un cors » */
	.compte-ligam {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
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
	.compte-ligam.connectat {
		padding-left: 0.3rem;
	}
	.compte-ligam:hover,
	.compte-ligam[aria-current='page'] {
		border-color: var(--t-aur);
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
		border-color: var(--t-accion);
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

	/* Globe : les langues de découverte (es / en / ca), à côté de la bascule. */
	.lengas {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.lang-globe {
		position: relative;
		display: inline-flex;
	}
	/* Même famille que le bouton Ambiance voisin : cercle de 2,2 rem qui devient
	   une pilule quand le code Es/En/Ca s'affiche ; bordure rouge (--t-accion)
	   au survol et à l'ouverture, comme Ambiance (règle B). */
	.globe-boton {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		min-width: 2.2rem;
		height: 2.2rem;
		padding: 0 0.45rem;
		border: 1px solid var(--t-linha);
		background: transparent;
		color: var(--t-tinta);
		border-radius: 999px;
		cursor: pointer;
		transition:
			background 0.5s cubic-bezier(0.19, 1, 0.22, 1),
			color 0.5s,
			border-color 0.4s;
	}
	.globe-boton:hover,
	.globe-boton[aria-expanded='true'] {
		border-color: var(--t-accion);
	}
	/* Panneau d'en-tête opaque, comme celui d'Ambiance. */
	.globe-panel {
		position: absolute;
		top: calc(100% + 12px);
		right: 0;
		z-index: 60;
		display: flex;
		flex-direction: column;
		min-width: 9rem;
		padding: 0.4rem;
		background: var(--t-fons-2);
		color: var(--t-tinta);
		border: 1px solid var(--t-linha);
		border-radius: 18px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
	}
	.globe-panel button {
		border: 0;
		background: transparent;
		color: var(--t-tinta-2);
		font-weight: 600;
		font-size: 0.86rem;
		text-align: left;
		padding: 0.5rem 0.7rem;
		border-radius: 10px;
		cursor: pointer;
		transition:
			background 0.35s,
			color 0.35s;
	}
	.globe-panel button:hover {
		background: color-mix(in srgb, var(--t-tinta) 10%, transparent);
		color: var(--t-tinta);
	}
	.globe-panel button[aria-pressed='true'] {
		background: var(--t-tinta);
		color: var(--t-fons);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	/* Première visite : le bouton se met en avant (halo d'or qui bat trois fois,
	   légende dessous), puis s'efface ; immobile si « réduire les animations » */
	.lang-toggle { position: relative; }
	.lang-toggle.en-avant { border-color: var(--t-aur); box-shadow: 0 0 0 0 color-mix(in srgb, var(--t-aur) 55%, transparent); animation: lang-crida 1.6s ease-out 3; }
	.lang-crida {
		position: absolute; top: calc(100% + 6px); right: 0; white-space: nowrap;
		font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; color: var(--t-aur);
		animation: lang-crida-tèxt 7s ease-in-out forwards;
	}
	@keyframes lang-crida { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--t-aur) 55%, transparent); } 100% { box-shadow: 0 0 0 14px color-mix(in srgb, var(--t-aur) 0%, transparent); } }
	@keyframes lang-crida-tèxt { 0%, 8% { opacity: 0; translate: 0 -4px; } 20%, 85% { opacity: 1; translate: 0 0; } 100% { opacity: 0; } }
	@media (prefers-reduced-motion: reduce) {
		.lang-toggle.en-avant { animation: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-aur) 45%, transparent); }
		.lang-crida { animation: none; }
	}

	.lang-toggle button:focus-visible,
	.globe-boton:focus-visible,
	.globe-panel button:focus-visible,
	.compte-ligam:focus-visible,
	.admin-link:focus-visible,
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
		/* le mot reste pour les lecteurs d'écran : c'est le seul nom du lien */
		.compte-tèxte {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
		.compte-ligam {
			justify-content: center;
			width: 2.2rem;
			padding: 0;
		}
		.compte-ligam.connectat {
			padding: 0;
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
		.header-right:has(.compte, .compte-ligam) .menu-boton {
			justify-content: center;
			width: 2.2rem;
			padding: 0;
		}
		.header-right:has(.compte, .compte-ligam) .menu-boton span {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
	}

	/* Le globe ajoute un bouton ; sous ~27rem de bandeau (téléphones courants),
	   on cache le nom « Lo Ligam » — la croix-constellation reste — pour que
	   tout tienne sans déborder. */
	@container (max-width: 27rem) {
		.brand-name {
			display: none;
		}
	}
</style>
