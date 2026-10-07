<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import CartaOccitania from '$lib/components/CartaOccitania.svelte';
	import RailJaces from '$lib/components/RailJaces.svelte';
	import InfoIcon from '$lib/components/InfoIcon.svelte';
	import LayersIcon from '$lib/components/LayersIcon.svelte';
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
			more: 'Saber mai sus lo Mond en occitan',
			layers: 'Jaces',
			layersLabel: 'Jaces de la carta',
			basemap: 'Fons de carta',
			basemapEstelas: 'Estelas',
			basemapOccitan: 'Occitan',
			basemapNatural: 'Natural',
			basemapSatellite: 'Satellit',
			adminLink: "Modificar dins l'admin",
			aVenir: 'A venir',
			indisponible: 'Indisponibla per ara'
		},
		fr: {
			title: 'Le Monde en occitan',
			intro: 'Fond de carte en occitan, réalisé par',
			introEnd: "avec l'Institut d'Études Occitanes.",
			close: 'Fermer',
			more: 'En savoir plus sur le Monde en occitan',
			layers: 'Calques',
			layersLabel: 'Calques de la carte',
			basemap: 'Fond de carte',
			basemapEstelas: 'Étoiles',
			basemapOccitan: 'Occitan',
			basemapNatural: 'Naturel',
			basemapSatellite: 'Satellite',
			adminLink: "Modifier dans l'admin",
			aVenir: 'À venir',
			indisponible: "Indisponible pour l'instant"
		}
	};
	let tx = $derived(t[lang]);

	const SEEN_KEY = 'lo-ligam-carta-info-seen';

	let showInfo = $state(false);
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

	const baseLayerOptions = ['estelas', 'occitan', 'natural', 'satellite'];

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
		if (!localStorage.getItem(SEEN_KEY)) {
			showInfo = true;
			localStorage.setItem(SEEN_KEY, '1');
		}
	});
</script>

<svelte:head>
	<title>{tx.title} · Lo Ligam</title>
</svelte:head>

<div class="screen" style:--cap-bas={capBas ? capBas + 'px' : null}>
	<!-- Le bandeau commun flotte sur la carte, dans un dégradé de nuit -->
	<div class="capçal" bind:this={capçalEl}>
		<AppHeader />
	</div>

	<main class="carta-wrap">
		<CartaOccitania
			visibility={layerVisibility}
			{baseLayer}
			clar={ambianca.clar}
			dalt={ambianca.dalt}
			{lang}
			{elements}
			{colors}
			bind:causits
		/>

		{#if showInfo}
			<div class="info-card" transition:fly={{ y: -12, duration: 260, easing: quintOut }}>
				<button
					type="button"
					class="info-close"
					onclick={() => (showInfo = false)}
					aria-label={tx.close}>×</button
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
				class="info-trigger"
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
	.info-card,
	.layers-panel {
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
	.layers-trigger,
	.info-close {
		display: grid;
		place-items: center;
		padding: 0;
		border: 1px solid var(--t-linha);
		border-radius: 50%;
		background: color-mix(in srgb, var(--t-fons) 78%, transparent);
		backdrop-filter: blur(6px);
		color: var(--t-aur-clar);
		cursor: pointer;
		transition:
			border-color 0.4s,
			transform 0.6s var(--ease);
	}

	.info-trigger:hover,
	.layers-trigger:hover,
	.info-close:hover {
		border-color: var(--t-aur);
	}

	.info-trigger:focus-visible,
	.layers-trigger:focus-visible,
	.info-close:focus-visible,
	.admin-link:focus-visible {
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
