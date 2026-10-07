<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import CartaOccitania from '$lib/components/CartaOccitania.svelte';
	import InfoIcon from '$lib/components/InfoIcon.svelte';
	import LayersIcon from '$lib/components/LayersIcon.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { supabase } from '$lib/supabaseClient';
	import { esAdmin } from '$lib/adminStore';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';

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
			adminLink: "Modificar dins l'admin"
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
			adminLink: "Modifier dans l'admin"
		}
	};
	let tx = $derived(t[lang]);

	const SEEN_KEY = 'lo-ligam-carta-info-seen';

	let showInfo = $state(false);
	let layersPanelOpen = $state(false);
	// Par défaut, la carte en étoiles de l'accueil (2026-10-07) : la carte
	// détaillée en occitan se découvre dessous en s'approchant.
	let baseLayer = $state('estelas');

	const baseLayerOptions = ['estelas', 'occitan', 'natural', 'satellite'];

	let layerVisibility = $state({
		lieusInteres: true,
		librarias: true,
		dialectes: false,
		departaments: false,
		regions: false,
		provincias: false,
		limsi: false
	});

	// Registre des còlas — vient ara de Supabase (taula carta_colas, gerida
	// dins /admin/carta) puslèu que d'èsser escrich en dur : Romain pòt
	// cambiar los libellats, las nòtas, las tematicas e la disponibilitat
	// sens tocar al còdi.
	let layerDefs = $state([]);

	// Gropa las còlas per tematica, dins l'òrdre d'aparicion. Las còlas sens
	// tematica van dins un grop mut (sens títol) en tèsta.
	let layerGroups = $derived.by(() => {
		const grops = [];
		const perClau = new Map();
		for (const def of layerDefs) {
			const clau = def.tematica_oc ?? '';
			let grop = perClau.get(clau);
			if (!grop) {
				grop = { tematica_oc: def.tematica_oc, tematica_fr: def.tematica_fr, defs: [] };
				perClau.set(clau, grop);
				grops.push(grop);
			}
			grop.defs.push(def);
		}
		return grops;
	});

	onMount(async () => {
		const { data } = await supabase.from('carta_colas').select('*').order('ordre');
		layerDefs = (data ?? []).map((row) => ({
			id: row.id,
			oc: row.label_oc,
			fr: row.label_fr,
			available: row.disponible,
			note_oc: row.nòta_oc,
			note_fr: row.nòta_fr,
			tematica_oc: row.tematica_oc ?? null,
			tematica_fr: row.tematica_fr ?? null
		}));

		// La visibilitat per defaut ven ara de la basa (colomna « visibla »,
		// reglabla dins l'admin). Abans la migracion, la colomna existís pas
		// e los defauts escriches çai-subre demòran.
		for (const row of data ?? []) {
			if (typeof row.visibla === 'boolean') layerVisibility[row.id] = row.visibla;
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

<div class="screen">
	<!-- Le bandeau commun flotte sur la carte, dans un dégradé de nuit -->
	<div class="capçal">
		<AppHeader />
	</div>

	<main class="carta-wrap">
		<CartaOccitania visibility={layerVisibility} {baseLayer} clar={ambianca.clar} dalt={ambianca.dalt} />

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

		{#if layersPanelOpen}
			<div class="layers-panel" transition:fly={{ y: 12, duration: 260, easing: quintOut }}>
				<div class="layers-head">
					<h2>{tx.layers}</h2>
					<button
						type="button"
						class="info-close"
						onclick={() => (layersPanelOpen = false)}
						aria-label={tx.close}>×</button
					>
				</div>

				<div class="basemap-section">
					<p class="basemap-label">{tx.basemap}</p>
					<div class="basemap-options" role="radiogroup" aria-label={tx.basemap}>
						{#each baseLayerOptions as option (option)}
							<label class="basemap-option">
								<input
									type="radio"
									name="basemap"
									value={option}
									checked={baseLayer === option}
									onchange={() => (baseLayer = option)}
								/>
								{tx[
									'basemap' + option.charAt(0).toUpperCase() + option.slice(1)
								]}
							</label>
						{/each}
					</div>
				</div>

				<hr class="layers-divider" />

				{#each layerGroups as grop (grop.tematica_oc ?? '')}
					{#if grop.tematica_oc}
						<p class="grop-titol">{lang === 'oc' ? grop.tematica_oc : (grop.tematica_fr ?? grop.tematica_oc)}</p>
					{/if}
					<ul>
						{#each grop.defs as layer (layer.id)}
							<li class:disabled={!layer.available}>
								<label>
									<input
										type="checkbox"
										disabled={!layer.available}
										checked={layerVisibility[layer.id]}
										onchange={(e) => (layerVisibility[layer.id] = e.currentTarget.checked)}
									/>
									{lang === 'oc' ? layer.oc : layer.fr}
								</label>
								{#if layer.note_oc}
									<p class="layer-note">{lang === 'oc' ? layer.note_oc : layer.note_fr}</p>
								{/if}
							</li>
						{/each}
					</ul>
				{/each}

				{#if $esAdmin}
					<a class="admin-link" href="/admin/carta">{tx.adminLink} →</a>
				{/if}
			</div>
		{:else}
			<button
				type="button"
				class="layers-trigger"
				onclick={() => (layersPanelOpen = true)}
				aria-label={tx.layersLabel}
				transition:fly={{ y: 12, duration: 220, easing: quintOut }}
			>
				<LayersIcon size={20} />
			</button>
		{/if}
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
		top: 6.4rem;
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
		top: 6.4rem;
		right: var(--marge);
		width: 2.6rem;
		height: 2.6rem;
	}

	/* ---------- Calques ---------- */
	.layers-trigger {
		position: absolute;
		z-index: 1000;
		bottom: 3.5rem;
		left: var(--marge);
		width: 2.8rem;
		height: 2.8rem;
	}

	.layers-trigger:hover {
		transform: rotate(-8deg);
	}

	.layers-panel {
		bottom: 3.5rem;
		left: var(--marge);
		width: min(19rem, calc(100vw - 2rem));
		max-height: calc(100dvh - 12rem);
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--t-linha) transparent;
		padding: 1rem 1.1rem 1.1rem;
	}

	.layers-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.6rem;
	}

	.layers-head h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.35rem;
	}

	.layers-head .info-close {
		position: static;
	}

	.basemap-label,
	.grop-titol {
		margin: 0.9rem 0 0.4rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}

	.basemap-label {
		margin-top: 0.2rem;
	}

	/* Les fonds : un sélecteur à cases, comme le choix de thème */
	.basemap-options {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 4px;
		padding: 3px;
		border: 1px solid var(--t-linha);
		border-radius: 12px;
	}

	.basemap-option {
		position: relative;
		display: grid;
		place-items: center;
		padding: 0.45rem 0.3rem;
		border-radius: 9px;
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--t-tinta-2);
		cursor: pointer;
		transition:
			background 0.35s,
			color 0.35s;
	}

	.basemap-option input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.basemap-option:has(input:checked) {
		background: var(--t-tinta);
		color: var(--t-fons);
	}

	.basemap-option:has(input:focus-visible) {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}

	.layers-divider {
		border: none;
		border-top: 1px solid var(--t-linha);
		margin: 1rem 0 0.2rem;
	}

	.layers-panel ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.layers-panel li {
		padding: 0.3rem 0;
	}

	.layers-panel label {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.88rem;
		cursor: pointer;
	}

	.layers-panel li.disabled label {
		color: var(--t-tinta-2);
		opacity: 0.6;
		cursor: default;
	}

	.layers-panel input[type='checkbox'] {
		width: 1rem;
		height: 1rem;
		margin: 0;
		accent-color: var(--t-aur);
	}

	.layer-note {
		margin: 0.15rem 0 0 1.6rem;
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--t-tinta-2);
	}

	.admin-link {
		display: block;
		margin-top: 0.9rem;
		padding-top: 0.7rem;
		border-top: 1px solid var(--t-linha);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--t-aur-clar);
		text-decoration: none;
	}

	.admin-link:hover {
		color: var(--t-aur);
	}
</style>
