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
	import { LANGUES } from '$lib/styles/palette.js';
	import { VISIO, PLAN } from '$lib/data/planSite.js';
	import { esAdmin } from '$lib/adminStore';
	import { session, authReady, pseudoCompte } from '$lib/authStore';
	import { page } from '$app/state';
	import Avatar from '$lib/grops/Avatar.svelte';

	let { children } = $props();
	let lang = $derived(langStore.current);
	// la pièce de la langue choisie prend la couleur de sa langue (palette.js, LANGUES) ; deux couleurs = pièce coupée en deux
	const couleurLangue = (code) => {
		const l = LANGUES[code];
		if (!l) return undefined;
		const fons = l.fons.length > 1 ? `linear-gradient(90deg, ${l.fons[0]} 50%, ${l.fons[1]} 50%)` : l.fons[0];
		return `--pc-fons: ${fons}; --pc-tinta: ${l.tinta};`;
	};

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
	const GLOBE_ETIQ = { oc: 'Autras lengas', fr: 'Autres langues', es: 'Otros idiomas', en: 'Other languages', ca: 'Altres llengües', ar: 'لغات أخرى' };
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
		ca: { acuelhLong: 'Tornar a l’inici', admin: 'Administració', menu: 'Menú', reservar: 'Reservar una classe', compte: 'El meu compte', connectar: 'Inicia la sessió' },
		ar: { acuelhLong: 'العودة إلى الصفحة الرئيسية', admin: 'الإدارة', menu: 'القائمة', reservar: 'حجز درس', compte: 'حسابي', connectar: 'تسجيل الدخول' }
	};
	let tx = $derived(t[lang] ?? t.oc);

	// Le compte, sur toutes les pages (2026-10-25) : « Se connectar » pour un
	// visiteur (on revient ensuite sur la page où l'on était), l'initiale et
	// « Mon compte » une fois connecté.
	let surCompte = $derived(page.url.pathname.startsWith('/compte'));
	let tornar = $derived(surCompte ? '/compte' : '/compte?tornar=' + encodeURIComponent(page.url.pathname));

	// Téléphone d'abord (Romain, 2026-11-07, logique 3 de /ensag/palette-bandeaux) : sur téléphone, le haut
	// garde les réglages (marque, langue, thème, compte) et la navigation passe en bas, en onglets
	// (Acuèlh, les rubriques du plan, Menú) ; sur grand écran, les rubriques entrent dans la barre.
	// Pages d'immersion (la carte, l'administration) : pas d'onglets, le bouton Menú reste en haut.
	const ACUELH = { oc: 'Acuèlh', fr: 'Accueil', es: 'Inicio', en: 'Home', ca: 'Inici', ar: 'الرئيسية' };
	const ETIQ_NAV = { oc: 'Navegacion principala', fr: 'Navigation principale', es: 'Navegación principal', en: 'Main navigation', ca: 'Navegació principal', ar: 'التنقل الرئيسي' };
	const SANS_ONGLETS = ['/carta', '/admin'];
	let avecOnglets = $derived(!SANS_ONGLETS.some((p) => page.url.pathname === p || page.url.pathname.startsWith(p + '/')));
	let verbes = $derived(
		PLAN.map((v) => ({
			id: v.id,
			href: v.href,
			nom: v[lang] ?? v.oc,
			// les pages de la rubrique ; « Ma progression » (/compte) n'allume aucun onglet
			liens: v.grops.flatMap((g) => g.items.map((i) => i.href)).filter((h) => h.startsWith('/') && h !== '/compte')
		}))
	);
	let actiu = $derived.by(() => {
		const c = page.url.pathname;
		if (c === '/') return 'acuelh';
		const v = verbes.find((x) => c === x.href || c.startsWith(x.href + '/') || x.liens.some((h) => c === h || c.startsWith(h + '/')));
		return v ? v.id : null;
	});
	// Forme de la barre sur grand écran, choisie par Romain le 2026-11-12 (essai /ensag/barra) :
	// sur l'accueil, barre presque vide (le titre est déjà le plan, décision du 15-10) ; ailleurs,
	// les trois verbes à gauche, à côté du nom, séparés des réglages. Le menu les garde partout.
	let formaVista = $derived(page.url.pathname === '/' ? 'vuda' : 'plan');
	let botonOnglet = $state(null);
	// La barre du bas est rattachée au <body> : sur l'accueil, l'enveloppe du bandeau glisse hors de
	// l'écran quand on descend (transform), et un élément fixe dans un élément qui bouge n'est plus
	// fixe. Elle n'est posée qu'après le chargement (pas de saut au premier affichage).
	let monte = $state(false);
	$effect(() => {
		monte = true;
	});
	function versBody(noeud) {
		document.body.appendChild(noeud);
		return { destroy: () => noeud.remove() };
	}
	let telephone = $state(false);
	$effect(() => {
		const mq = matchMedia('(max-width: 40rem)');
		telephone = mq.matches;
		const suit = (e) => (telephone = e.matches);
		mq.addEventListener('change', suit);
		return () => mq.removeEventListener('change', suit);
	});
</script>

<header class="top" class:avec-onglets={avecOnglets} data-forma={formaVista || undefined}>
	<div class="top-in">
		<a class="brand" href="/" title={tx.acuelhLong} aria-label={`Lo Ligam, ${tx.acuelhLong}`}>
			<Crotz talha={30} teula />
			<span class="brand-name">Lo Ligam</span>
		</a>

		<div class="header-right">
			<!-- sur grand écran : les trois verbes du plan dans la barre (cachés quand la place manque) -->
			<nav class="verbes" aria-label={ETIQ_NAV[lang] ?? ETIQ_NAV.oc}>
				{#each verbes as v (v.id)}
					<a href={v.href} aria-current={actiu === v.id ? 'page' : undefined}>{v.nom}</a>
				{/each}
			</nav>
			<a class="pc reservar" href={VISIO}>{tx.reservar}</a>

			{#if children}
				<div class="compte">
					{@render children()}
				</div>
			{/if}

			{#if $session}
				<a class="pc pc-2 compte-ligam connectat" href="/compte" aria-current={surCompte ? 'page' : undefined} title={tx.compte}>
					<Avatar pseudo={$pseudoCompte ?? $session.user.email ?? '?'} id={$session.user.id} size="1.6rem" />
					<span class="compte-tèxte">{tx.compte}</span>
				</a>
			{:else if $authReady}
				<a class="pc pc-2 compte-ligam" href={tornar} aria-current={surCompte ? 'page' : undefined} title={tx.connectar}>
					<Icona nom="persona" size="1.15em" />
					<span class="compte-tèxte">{tx.connectar}</span>
				</a>
			{/if}

			<!-- Visible seulement pour un administrateur. C'est du confort, pas une
			     protection : les verrous sont dans la base (RLS). -->
			{#if $esAdmin}
				<a class="pc pc-2 admin-link" href="/admin" title={tx.admin}>
					<Icona nom="reglages" size="1.1em" />
					<span class="admin-tèxte">{tx.admin}</span>
				</a>
			{/if}

			<AmbiancaPanel />

			<div class="lengas">
				<div class="lang-toggle" class:en-avant={crida} role="group" aria-label="Lenga / Langue">
					<button type="button" class="pc pc-2" aria-pressed={lang === 'oc'} style={lang === 'oc' ? couleurLangue('oc') : undefined} lang="oc" onclick={() => causirLenga('oc')}>Òc</button>
					<button type="button" class="pc pc-2" aria-pressed={lang === segonda} style={lang === segonda ? couleurLangue(segonda) : undefined} lang={segonda} onclick={() => causirLenga(segonda)}>{LENGAS[segonda].curt}</button>
					{#if crida}
						<span class="lang-crida" aria-hidden="true"><span lang="oc">lenga</span> · <span lang="fr">langue</span></span>
					{/if}
				</div>
				<div class="lang-globe">
					<button
						type="button"
						class="pc pc-2 globe-boton"
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

			<!-- « Menu » à droite du bandeau (Romain, 2026-11-03) : le dernier
			     élément ; l'ordre de tabulation suit l'ordre affiché. -->
			<button
				type="button"
				class="pc pc-2 menu-boton"
				bind:this={botonMenu}
				aria-haspopup="dialog"
				aria-expanded={menuDobèrt}
				onclick={() => (menuDobèrt = !menuDobèrt)}
			>
				<Icona nom="menu" size="1.15em" /><span>{tx.menu}</span>
			</button>
		</div>
	</div>
</header>

<!-- sur téléphone : la navigation en bas, cinq onglets (hors du bandeau : un élément fixe dans un
     conteneur de requêtes serait calé sur lui, pas sur l'écran) -->
{#if avecOnglets && monte}
	<nav class="onglets-bas" use:versBody aria-label={ETIQ_NAV[lang] ?? ETIQ_NAV.oc}>
		<a href="/" aria-current={actiu === 'acuelh' ? 'page' : undefined}>
			<span class="ic"
				><svg viewBox="0 0 24 24" width="1.4rem" height="1.4rem" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11 12 4l8 7v9H4z" /><path d="M10 20v-6h4v6" /></svg></span
			>
			<span class="et">{ACUELH[lang] ?? ACUELH.oc}</span>
		</a>
		{#each verbes as v (v.id)}
			<a href={v.href} aria-current={actiu === v.id ? 'page' : undefined}>
				<span class="ic">
					{#if v.id === 'parla'}<Icona nom="comentar" size="1.4rem" />
					{:else if v.id === 'apren'}<svg viewBox="0 0 24 24" width="1.4rem" height="1.4rem" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5c3-1.3 5.5-1 8 1 2.5-2 5-2.3 8-1V19c-3-1.3-5.5-1-8 1-2.5-2-5-2.3-8-1z" /><path d="M12 6.5V20" /></svg>
					{:else if v.id === 'imagina'}<svg viewBox="0 0 24 24" width="1.4rem" height="1.4rem" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 3.5l1.9 5.6 5.6 1.9-5.6 1.9L11 18.5l-1.9-5.6L3.5 11l5.6-1.9z" /><path d="M19 15.5v4.5M16.75 17.75h4.5" /></svg>
					{:else}<Icona nom="persona" size="1.4rem" />{/if}
				</span>
				<span class="et">{v.nom}</span>
			</a>
		{/each}
		<button type="button" bind:this={botonOnglet} aria-haspopup="dialog" aria-expanded={menuDobèrt} onclick={() => (menuDobèrt = !menuDobèrt)}>
			<span class="ic"><Icona nom="menu" size="1.4rem" /></span>
			<span class="et">{tx.menu}</span>
		</button>
	</nav>
{/if}

<MenuVel bind:dobèrt={menuDobèrt} {lang} boton={avecOnglets && telephone ? botonOnglet : botonMenu} />

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

	/* Arabe (droite à gauche) : le bandeau garde sa disposition d'origine, pour
	   que le menu, le compte, le choix de langue et le globe restent exactement
	   où les gens les cherchent (Romain, 2026-10-26 : « ça va perdre les gens »).
	   Seul le texte des boutons est en arabe ; le reste de la page, lui, s'inverse. */
	:global(html[dir='rtl']) .top {
		direction: ltr;
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

	/* pièces de papier (lib/styles/papier.css) : les boutons de la barre ; ouverts, ils passent à l'or */
	.menu-boton,
	.globe-boton {
		--r: 9px;
		gap: 0.45rem;
		min-height: 0;
		height: 2.2rem;
		padding: 0 0.9rem;
		font: inherit;
		font-weight: 700;
		font-size: 0.82rem;
	}

	.menu-boton[aria-expanded='true'],
	.globe-boton[aria-expanded='true'] {
		--pc-fons: var(--pc-or-fons);
		--pc-tinta: #2a1a10;
	}

	/* La seule action en couleur de la barre, comme « Nous rejoindre » chez l'Alliance ;
	   en tuile du rouge du logo, la couleur de ce qui se clique (app.css, 2026-10-23) */
	.reservar {
		--r: 9px;
		min-height: 0;
		height: 2.2rem;
		padding: 0 1.1rem;
		font-size: 0.82rem;
		white-space: nowrap;
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
	/* pièce de papier (lib/styles/papier.css) : le compte, comme les autres boutons de la barre */
	.compte-ligam {
		--r: 9px;
		gap: 0.4rem;
		min-height: 0;
		height: 2.2rem;
		padding: 0 0.75rem;
		font-size: 0.78rem;
		white-space: nowrap;
	}
	.compte-ligam[aria-current='page'] {
		--pc-fons: var(--pc-or-fons);
		--pc-tinta: #2a1a10;
	}

	.compte-ligam.connectat {
		padding-left: 0.3rem;
	}
	.admin-link {
		--r: 9px;
		gap: 0.35rem;
		min-height: 0;
		height: 2.2rem;
		padding: 0 0.75rem;
		font-size: 0.78rem;
		white-space: nowrap;
	}

	/* L'interrupteur Òc / Fr (Romain, 2026-11-07 : « ils sont séparés, on ne comprend pas que
	   c'est un interrupteur… on bascule de l'une à l'autre ») : une seule piste de la couleur du
	   carton, la langue choisie est une pièce d'ocre posée dessus, l'autre est à plat. L'autre
	   langue remplace « Fr » quand on la choisit au globe (logique inchangée). */
	.lengas .lang-toggle {
		gap: 0;
		padding: 3px;
		border-radius: 12px;
		background: color-mix(in srgb, var(--t-tinta) 10%, transparent); /* la piste : l'encre à 10 %, sans troisième couleur (odd-squid-52) */
		box-shadow: none;
	}
	.lengas .lang-toggle button {
		--pc-fons: transparent;
		--pc-tinta: var(--t-tinta);
		--pc-lev: none;
		--r: 9px;
		height: 1.85rem;
		min-width: 2.7rem;
		padding: 0 0.75rem;
		box-shadow: none;
	}
	.lengas .lang-toggle button:hover:not(:disabled),
	.lengas .lang-toggle button:active:not(:disabled) {
		transform: none;
		box-shadow: none;
	}
	.lengas .lang-toggle button[aria-pressed='true'],
	.lengas .lang-toggle button[aria-pressed='true']:hover:not(:disabled) {
		--pc-fons: var(--pc-or-fons);
		--pc-tinta: var(--pc-or-tinta);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
	}

	/* la bascule Òc / Fr : deux pièces de papier, l'or marque la langue choisie */
	.lang-toggle {
		display: inline-flex;
		gap: 0.5rem;
		border-radius: 12px;
	}

	.lang-toggle button {
		--r: 9px;
		min-height: 0;
		height: 2.2rem;
		padding: 0 0.85rem;
		font-size: 0.78rem;
	}

	.lang-toggle button[aria-pressed='true'] {
		--pc-fons: var(--pc-or-fons);
		--pc-tinta: #2a1a10;
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
		gap: 4px;
		min-width: 2.2rem;
		padding: 0 0.55rem;
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
	/* ---- téléphone d'abord (2026-11-07) ---- */
	/* Les réglages et le menu sont de simples icônes et mots, sans pièce pleine (logique 3 choisie par
	   Romain le 07-11) : seules la réservation (rouge) et la langue choisie (ocre) sont en couleur ;
	   plus de troisième couleur à choisir. Les états ouverts et la page courante gardent leur pièce. */
	.header-right .compte-ligam:not([aria-current='page']),
	.header-right .admin-link,
	.header-right .globe-boton:not([aria-expanded='true']),
	.header-right .menu-boton:not([aria-expanded='true']),
	.header-right :global(.ambianca-boton:not([aria-expanded='true'])) {
		--pc-fons: transparent;
		--pc-tinta: var(--t-tinta);
		box-shadow: none;
	}
	.header-right .compte-ligam:not([aria-current='page']):hover:not(:disabled),
	.header-right .admin-link:hover:not(:disabled),
	.header-right .globe-boton:not([aria-expanded='true']):hover:not(:disabled),
	.header-right .menu-boton:not([aria-expanded='true']):hover:not(:disabled),
	.header-right :global(.ambianca-boton:not([aria-expanded='true']):hover:not(:disabled)) {
		--pc-fons: color-mix(in srgb, var(--t-tinta) 9%, transparent);
		transform: none;
		box-shadow: none;
	}
	/* grand écran : les trois verbes dans la barre, s'il y a la place */
	.verbes {
		display: none;
	}
	@container (min-width: 62rem) {
		.verbes {
			display: flex;
			gap: 1.5rem;
			margin-right: 0.8rem;
		}
	}
	.verbes a {
		padding: 0.3rem 0;
		border-bottom: 2px solid transparent;
		color: var(--t-tinta);
		font-size: 0.9rem;
		font-weight: 700;
		text-decoration: none;
	}
	.verbes a:hover,
	.verbes a[aria-current='page'] {
		border-bottom-color: var(--pc-or-fons);
	}
	.verbes a:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
		border-radius: 4px;
	}
	/* forme de la barre (voir le script) : vide sur l'accueil, le plan à gauche ailleurs */
	.top[data-forma='vuda'] .verbes {
		display: none;
	}
	/* le plan à gauche : un filet fin le sépare du nom ; les réglages restent à droite. Il lui faut
	   un peu plus de place qu'à droite (davantage encore avec le lien d'administration). */
	.top[data-forma='plan'] .header-right {
		justify-self: stretch;
		justify-content: flex-end;
	}
	.top[data-forma='plan'] .verbes {
		display: none;
		gap: 1.7rem;
		margin: 0 auto 0 0;
		padding-left: 1.6rem;
		border-left: 1px solid color-mix(in srgb, var(--t-tinta) 28%, transparent);
	}
	@container (min-width: 66rem) {
		.top[data-forma='plan'] .header-right:not(:has(.admin-link)) .verbes {
			display: flex;
		}
	}
	@container (min-width: 76rem) {
		.top[data-forma='plan'] .verbes {
			display: flex;
		}
	}
	/* téléphone : la navigation en bas */
	.onglets-bas {
		display: none;
	}
	@media (max-width: 40rem) {
		.top.avec-onglets .menu-boton {
			display: none;
		}
		.onglets-bas {
			position: fixed;
			inset: auto 0 0 0;
			z-index: 70;
			display: grid;
			/* autant de colonnes égales que d'onglets : Acuèlh, les rubriques du plan (quatre depuis S'imagina, 2026-11-12), Menú */
			grid-auto-flow: column;
			grid-auto-columns: 1fr;
			padding: 0.3rem 0.2rem calc(0.3rem + env(safe-area-inset-bottom, 0px));
			background: var(--t-fons);
			border-top: 1px solid var(--t-linha);
			box-shadow: 0 -4px 14px rgba(0, 0, 0, 0.08);
		}
		.onglets-bas a,
		.onglets-bas button {
			display: grid;
			justify-items: center;
			align-content: start;
			gap: 0.15rem;
			min-height: 3.6rem;
			padding: 0.4rem 0 0.35rem;
			border: 0;
			background: transparent;
			color: var(--t-tinta-2);
			font: 600 0.72rem/1.1 var(--font-body);
			text-decoration: none;
			cursor: pointer;
			-webkit-tap-highlight-color: transparent;
		}
		.onglets-bas .ic {
			display: grid;
			place-items: center;
			width: min(3.2rem, 100%);
			height: 1.9rem;
			border-radius: 999px;
		}
		/* l'onglet actif : l'accent du thème (l'ocre en sombre, jamais de rouge en texte sur le sombre ; le rouge en clair) */
		.onglets-bas [aria-current='page'] {
			color: var(--t-aur);
		}
		.onglets-bas [aria-current='page'] .ic {
			background: color-mix(in srgb, var(--t-aur) 14%, transparent);
		}
		:global(:root[data-tema='clar']) .onglets-bas [aria-current='page'] {
			color: var(--t-accion);
		}
		:global(:root[data-tema='clar']) .onglets-bas [aria-current='page'] .ic {
			background: color-mix(in srgb, var(--t-accion) 12%, transparent);
		}
		.onglets-bas a:focus-visible,
		.onglets-bas button:focus-visible {
			outline: 3px solid var(--t-aur-clar, #c7811b);
			outline-offset: -3px;
			border-radius: 12px;
		}
		/* cibles de 44 px au doigt (la règle du site) : les réglages du haut faisaient 35 px */
		.top.avec-onglets .compte-ligam,
		.top.avec-onglets .admin-link,
		.top.avec-onglets .globe-boton,
		.top.avec-onglets :global(.ambianca-boton) {
			min-width: 2.75rem;
			height: 2.75rem;
		}
		.top.avec-onglets .lang-toggle button {
			height: 2.35rem;
		}
		.top.avec-onglets .brand {
			min-height: 2.75rem;
			padding-right: 0.4rem;
		}
		/* la page ne passe pas sous la barre */
		:global(body:has(.onglets-bas)) {
			padding-bottom: calc(4.3rem + env(safe-area-inset-bottom, 0px));
		}
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
