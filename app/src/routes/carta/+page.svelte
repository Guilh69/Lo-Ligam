<script>
	import Icona from '$lib/components/Icona.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import CartaOccitania from '$lib/components/CartaOccitania.svelte';
	import RailJaces from '$lib/components/RailJaces.svelte';
	import VisitaCarta from '$lib/components/VisitaCarta.svelte';
	import LecturaCarta from '$lib/components/LecturaCarta.svelte';
	import InfoIcon from '$lib/components/InfoIcon.svelte';
	import { tampaDefòra } from '$lib/tampaDefora.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { supabase } from '$lib/supabaseClient';
	import { esAdmin } from '$lib/adminStore';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import { CATALOGUE, fusionarCatalogue, JACES_FONS } from '$lib/carta/catalogue.js';

	let lang = $derived(langStore.current);

	// Textes de l'interface dans les deux langues. L'occitan reste la
	// version de référence, le français en est la traduction.
	const t = {
		oc: {
			title: 'Lo Mond en occitan',
			intro: 'Fons de carta en occitan, realizat per',
			introEnd: "amb l'Institut d'Estudis Occitans.",
			close: 'Tampar',
			more: 'Saber mai sus lo Mond en occitan'
		},
		fr: {
			title: 'Le Monde en occitan',
			intro: 'Fond de carte en occitan, réalisé par',
			introEnd: "avec l'Institut d'Études Occitanes.",
			close: 'Fermer',
			more: 'En savoir plus sur le Monde en occitan'
		}
	};
	let tx = $derived(t[lang]);

	let showInfo = $state(false);
	// la pancarta se tampa d'un clic defòra o amb Escapar (principi del site,
	// $lib/tampaDefora.js)
	$effect(() => {
		if (!showInfo) return;
		const lèva = tampaDefòra((t) => !!t.closest('.info-card'), () => (showInfo = false));
		const tòca = (e) => e.key === 'Escape' && (showInfo = false);
		document.addEventListener('keydown', tòca);
		return () => {
			lèva();
			document.removeEventListener('keydown', tòca);
		};
	});
	// elements e colors del fons, dialècte causit (rail de las jaces)
	// los elements del fons Contorns seguisson lors jaces (vilas, noms, rius…)
	const elements = $derived({
		...Object.fromEntries(Object.entries(JACES_FONS).map(([jaça, el]) => [el, !!layerVisibility[jaça]])),
		costa: true
	});
	let colors = $state({});
	// las zònas dialectalas causidas (mantuna se pòt)
	let causits = $state([]);
	// Par défaut, la carte en étoiles de l'accueil (2026-10-07) : la carte
	// détaillée en occitan se découvre dessous en s'approchant.
	let baseLayer = $state('estelas');

	// Lo catalògue de las jaces (lib/carta/catalogue.js) : cinc familhas, que
	// valon per totes los fonses. La basa (taula carta_colas, gerida dins
	// /admin/carta) pòt renomenar una jaça o n'apondre ; se respond pas
	// (projècte gratuit en pausa), lo catalògue s'aficha parièr.
	let familhas = $state(fusionarCatalogue([]));
	let layerVisibility = $state(
		Object.fromEntries(CATALOGUE.flatMap((f) => f.jaces.map((j) => [j.id, !!j.defaut])))
	);

	// Lo bas real del capçal (una o doas linhas segon la largor) : la recèrca
	// e lo boton d'informacion se plaçan just dejós (retorn de Romain : la
	// barra tocava « Mots » e « Òbras »)
	let capçalEl = $state(null);
	// La carta en plen ecran, en mòde visualizacion (demanda de Romain,
	// 2026-10-08) : lo bandèu, lo catalògue e la recèrca s'amagan (amagats e
	// pas levats : lo panèl garda son estat) ; lo navegador passa en plen
	// ecran quand o sap far (pas sus iPhone : lo mòde demòra). Escap ne sortís.
	let visualizacion = $state(false);
	let screenEl = $state(null);
	function basculaVisualizacion(on) {
		visualizacion = on;
		if (on) screenEl?.requestFullscreen?.().catch(() => {});
		else if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
	}
	$effect(() => {
		const quitar = () => {
			if (!document.fullscreenElement && visualizacion) visualizacion = false;
		};
		const escap = (e) => {
			if (e.key === 'Escape' && visualizacion && !document.fullscreenElement) visualizacion = false;
		};
		// (sens plen ecran del navegador, la pagina defila pas cap al pè de pagina)
		if (visualizacion) window.scrollTo(0, 0);
		document.documentElement.style.overflow = visualizacion ? 'hidden' : '';
		document.addEventListener('fullscreenchange', quitar);
		window.addEventListener('keydown', escap);
		return () => {
			document.removeEventListener('fullscreenchange', quitar);
			window.removeEventListener('keydown', escap);
			document.documentElement.style.overflow = '';
		};
	});
	let capBas = $state(0);
	$effect(() => {
		if (!capçalEl) return;
		const mesurar = () => {
			const t = capçalEl.firstElementChild?.getBoundingClientRect();
			if (t) capBas = Math.round(t.bottom - capçalEl.getBoundingClientRect().top);
		};
		mesurar();
		const ro = new ResizeObserver(mesurar);
		ro.observe(capçalEl);
		return () => ro.disconnect();
	});

	onMount(async () => {
		const { data } = await supabase.from('carta_colas').select('*').order('ordre');
		if (data?.length) {
			familhas = fusionarCatalogue(data);
			// visibilitat per defaut reglabla dins l'admin (colomna « visibla »),
			// sonque per las jaces apondudas dins l'admin : las del catalògue
			// seguisson la vista d'arribada (l'entrada en scèna, demanda de Romain)
			for (const f of familhas) for (const j of f.jaces) if (!(j.id in layerVisibility)) layerVisibility[j.id] = !!j.defaut;
		}

		if (!browser) return;
		// Première visite guidée « Trois portes » (retenue par Romain le 2026-10-22) :
		// elle remplace l'ouverture automatique de la pancarte des crédits, qui reste
		// derrière le bouton « ? » ; /carta?ensag=visita compare encore les trois formes
		const ensag = new URLSearchParams(location.search).get('ensag');
		ensagVisita = ensag === 'visita';
		ensagLectura = ensag === 'lectura'; // le geste territoire / aujourd'hui, trois formes
	});

	let ensagVisita = $state(false);
	let formaVisita = $state('portas'); // la forme retenue ; l'essai en propose trois
	let ensagLectura = $state(false);
	let formaLectura = $state('bascula'); // la forme par défaut ; /carta?ensag=lectura en propose trois
	let nautLectura = $state(0); // la hauteur de la commande, pour décaler les mots à écouter
	// La lecture de la carte (DIRECCION bloc 1 : « naviguer entre le territoire
	// naturel et la réalité d'aujourd'hui ») : 0 lo territòri (tenchas plenas),
	// 1 « uèi » (tenchas estompadas ; la part de locuteurs par département,
	// enquête OPLO 2020, Romain 22-10), 2 « la reviscolada » (tenchas estompadas ;
	// calandretas e librariás alucadas : çò que fa reviure la lenga, Romain
	// 22-10) ; entre eux, la glissière. Les voix de l'Atlas ne sont liées à aucune
	// lecture (témoins de la langue parlée). Les portes de la première visite
	// choisissent la lecture aussi.
	let lectura = $state(0);
	function causirLectura(u) {
		lectura = Math.max(0, Math.min(2, Number(u) || 0));
		const uei = lectura >= 0.5 && lectura < 1.5,
			reviscolada = lectura >= 1.5;
		layerVisibility.dialectes = true;
		layerVisibility.locutors = uei;
		layerVisibility.calandretas = reviscolada;
		layerVisibility.ensenhament = reviscolada;
		layerVisibility.librarias = reviscolada;
		layerVisibility.cercles = reviscolada;
		layerVisibility.culturaOc = reviscolada;
	}
	// Les trois portes du panneau d'accueil (forme C) : la page tient les couches
	function porta(k) {
		if (k === 'territori') causirLectura(0);
		else if (k === 'reviscolada') causirLectura(2);
		else if (k === 'vila') document.getElementById('cerca-carta')?.focus();
	}
</script>

<svelte:head>
	<title>{tx.title} · Lo Ligam</title>
</svelte:head>

<div class="screen" class:visualizacion bind:this={screenEl} style:--cap-bas={capBas ? capBas + 'px' : null}>
	<!-- Le bandeau commun flotte sur la carte, dans un dégradé de nuit -->
	<div class="capçal" bind:this={capçalEl}>
		<AppHeader />
	</div>

	<main class="carta-wrap" style:--lectura-naut="{nautLectura}px">
		<CartaOccitania
			visibility={layerVisibility}
			{lectura}
			{baseLayer}
			clar={ambianca.clar}
			dalt={ambianca.dalt}
			{lang}
			{elements}
			{colors}
			bind:causits
			{visualizacion}
			onVisualizacion={basculaVisualizacion}
			onAlucar={(k, v = true) => (layerVisibility[k] = v)}
			onNetejar={() => {
				// (coma « Netejar la carta » del panèl : las jaces de las familhas, pas los reglatges)
				for (const f of familhas) for (const j of f.jaces) if (layerVisibility[j.id]) layerVisibility[j.id] = false;
				causits = [];
			}}
		/>

		{#if showInfo}
			<div class="info-card" transition:fly={{ y: -12, duration: 260, easing: quintOut }}>
				<button
					type="button"
					class="info-close"
					onclick={() => (showInfo = false)}
					aria-label={tx.close}><Icona nom="fermer" size="1.25em" /></button
				>
				<h1>{tx.title}</h1>
				<p>
					{tx.intro}
					<a href="https://www.openstreetmap.bzh/" target="_blank" rel="noopener noreferrer"
						>OpenStreetMap e occitan</a
					>
					{tx.introEnd}
				</p>
			</div>
		{:else}
			<button
				type="button"
				class="info-trigger comandas-carta"
				onclick={() => (showInfo = true)}
				aria-label={tx.more}
				transition:fly={{ y: -12, duration: 220, easing: quintOut }}
			>
				<InfoIcon size={22} />
			</button>
		{/if}

		<RailJaces
			{familhas}
			bind:visibility={layerVisibility}
			bind:baseLayer
			bind:colors
			bind:causits
			clar={ambianca.clar}
			{lang}
			esAdmin={$esAdmin}
		/>

		<VisitaCarta bind:forma={formaVisita} ensag={ensagVisita} {lang} onPorta={porta} />
		<LecturaCarta bind:forma={formaLectura} {lectura} ensag={ensagLectura} {lang} clar={ambianca.clar} dalt={ambianca.dalt} onCausir={causirLectura} onNaut={(h) => (nautLectura = h)} />
	</main>
</div>

<style>

	/* Carte plein écran, harmonisée avec la charte de l'accueil (2026-10-07) :
	   la carte occupe toute la fenêtre, le bandeau et les panneaux flottent
	   dessus en verre sombre (ou crème en thème clair). */
	.screen {
		--marge: clamp(1rem, 4vw, 3.4rem);
		--ease: cubic-bezier(0.19, 1, 0.22, 1);
		position: relative;
		height: 100dvh;
		container: carta / size;
		overflow: hidden;
		color: var(--t-tinta);
		background: var(--t-fons);
	}

	/* lo mòde visualizacion : sonque la carta e sos aisinas de lectura */
	.screen.visualizacion .capçal,
	.screen.visualizacion :global(.info-trigger),
	.screen.visualizacion :global(.info-card),
	.screen.visualizacion :global(.rail),
	.screen.visualizacion :global(.tirador) {
		display: none !important;
	}
	.capçal {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1100;
		padding: 1.3rem var(--marge) 2.4rem;
		background: linear-gradient(var(--t-fons) 35%, color-mix(in srgb, var(--t-fons) 70%, transparent) 65%, transparent);
		pointer-events: none;
	}

	.capçal :global(.top) {
		max-width: none;
		pointer-events: auto;
	}

	.carta-wrap {
		position: absolute;
		inset: 0;
	}

	/* ---------- Verre sombre commun aux panneaux et boutons ---------- */
	.info-card {
		position: absolute;
		z-index: 1000;
		background: color-mix(in srgb, var(--t-fons-2) 92%, transparent);
		backdrop-filter: blur(10px);
		border: 1px solid var(--t-linha);
		border-radius: 18px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
		color: var(--t-tinta);
	}

	.info-trigger,
	.info-close {
		display: grid;
		place-items: center;
		padding: 0;
		/* même verre que le rail et les boutons de la carte, sans trait (Romain, 2026-10-15) */
		border: 0;
		border-radius: 50%;
		background: var(--t-veire);
		backdrop-filter: blur(10px);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
		color: var(--t-aur-clar);
		cursor: pointer;
		transition:
			background 0.4s,
			transform 0.6s var(--ease);
	}

	.info-trigger:hover,
	.info-close:hover {
		background: var(--t-veire-fort);
		color: var(--t-aur);
	}

	.info-trigger:focus-visible,
	.info-close:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
	}

	/* ---------- Carte d'information ---------- */
	.info-card {
		top: calc(var(--cap-bas, 5.4rem) + 18px);
		right: var(--marge);
		width: min(22rem, calc(100vw - 2rem));
		padding: 1.3rem 1.4rem 1.2rem;
	}

	.info-card h1 {
		margin: 0 2rem 0.6rem 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.7rem;
		line-height: 1.05;
	}

	.info-card p {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--t-tinta-2);
	}

	.info-card a {
		color: var(--t-aur-clar);
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--t-aur) 50%, transparent);
		text-underline-offset: 3px;
	}

	.info-close {
		position: absolute;
		top: 0.7rem;
		right: 0.7rem;
		width: 2rem;
		height: 2rem;
		font-size: 1.1rem;
		line-height: 1;
	}

	.info-trigger {
		position: absolute;
		z-index: 1000;
		top: calc(var(--cap-bas, 5.4rem) + 18px);
		right: var(--marge);
		width: 2.6rem;
		height: 2.6rem;
	}

	/* Telefon (retorn de Romain : lo rail espotissiá la barra de recèrca) :
	   las jaces passan dins una barra en bas, a portada del det ; la recèrca
	   pren tota la largor en naut, lo boton d'informacion a son costat ; las
	   aisinas de lectura (escala, bossòla, zoom, fonts) se lèvan sus la barra */
	/* (capçal sus doas linhas : lo boton s'aliniá pas pus amb la recèrca) */
	@media (max-width: 760px) {
		.info-trigger,
		.info-card {
			top: calc(var(--cap-bas, 6.4rem) + 18px);
		}
	}
	/* lo panèl de las jaces en bas a l'orizontala (sus un ecran larg) : las
	   aisinas de lectura se lèvan sus el */
	@container carta (min-width: 601px) {
		.carta-wrap:global(.jaces-orizontalas) {
			--barra-bas: 5.6rem;
		}
	}
	@container carta (max-width: 600px) {
		.carta-wrap {
			--barra-bas: calc(3.9rem + env(safe-area-inset-bottom, 0px));
		}
		.info-trigger {
			right: 0.75rem;
		}
		.info-card {
			right: 0.75rem;
			width: calc(100% - 1.5rem);
		}
	}

</style>
