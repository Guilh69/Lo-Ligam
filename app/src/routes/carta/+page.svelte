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
			layersLabel: 'Jaces de la carta'
		},
		fr: {
			title: 'Le Monde en occitan',
			intro: 'Fond de carte en occitan, réalisé par',
			introEnd: "avec l'Institut d'Études Occitanes.",
			close: 'Fermer',
			more: 'En savoir plus sur le Monde en occitan',
			layers: 'Calques',
			layersLabel: 'Calques de la carte'
		}
	};
	let tx = $derived(t[lang]);

	const SEEN_KEY = 'lo-ligam-carta-info-seen';

	let showInfo = $state(false);
	let layersPanelOpen = $state(false);

	let layerVisibility = $state({
		lieusInteres: true,
		dialectes: false,
		provincias: false,
		limsi: false
	});

	// Còlas de la carta : « lieusInteres » e « dialectes » an de vertadièras
	// donadas (dialectes vengudas de SIG/Dialecte/Carte_dialecte_WG.geojson,
	// cargadas a la demanda dins CartaOccitania.svelte) ; las autras son de
	// jaces pas encara dotadas de donadas — vesedoiras dins lo panèl mas
	// desactivadas, per mostrar l'arquitectura visada sens inventar de
	// contengut.
	const layerDefs = [
		{ id: 'lieusInteres', oc: "Luòcs d'interès", fr: "Lieux d'intérêt", available: true },
		{ id: 'dialectes', oc: 'Dialèctes', fr: 'Dialectes', available: true },
		{
			id: 'provincias',
			oc: 'Provincias istoricas',
			fr: 'Provinces historiques',
			available: false,
			note_oc: 'A venir',
			note_fr: 'À venir'
		},
		{
			id: 'limsi',
			oc: 'Enquistas vocalas (Atlàs LISN)',
			fr: 'Enquêtes vocales (Atlas LISN)',
			available: false,
			note_oc: "En espèra de l'autorizacion del LISN (licéncia CC BY-NC-SA)",
			note_fr: "En attente de l'autorisation du LISN (licence CC BY-NC-SA)"
		}
	];

	onMount(() => {
		if (!browser) return;
		if (!localStorage.getItem(SEEN_KEY)) {
			showInfo = true;
			localStorage.setItem(SEEN_KEY, '1');
		}
	});
</script>

<svelte:head>
	<title>{tx.title} — Lo Ligam</title>
</svelte:head>

<div class="screen">
	<AppHeader />

	<main class="carta-wrap">
		<CartaOccitania visibility={layerVisibility} />

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
				<ul>
					{#each layerDefs as layer (layer.id)}
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
	.screen {
		position: relative;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.screen :global(.top) {
		max-width: none;
		padding: 0.9rem 1.5rem;
		background: rgba(245, 234, 216, 0.9);
		backdrop-filter: blur(10px);
		flex-shrink: 0;
		z-index: 2;
	}

	.carta-wrap {
		position: relative;
		flex: 1;
		min-height: 0;
	}

	.info-card {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 1000;
		max-width: min(22rem, calc(100% - 2rem));
		background: rgba(245, 234, 216, 0.92);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		padding: 1rem 1.25rem;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.18);
		transform-origin: top right;
	}

	.info-card h1 {
		font-size: 1.3rem;
		margin: 0 2rem 0.4rem 0;
	}

	.info-card p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.45;
		color: var(--color-teal);
	}

	.info-card a {
		color: inherit;
		text-decoration: underline;
	}

	.info-close {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
		width: 1.6rem;
		height: 1.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 999px;
		background: rgba(58, 42, 32, 0.08);
		color: var(--color-text);
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		transition: background-color 150ms ease;
	}

	.info-close:hover {
		background: rgba(58, 42, 32, 0.16);
	}

	.info-trigger {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 1000;
		width: 2.6rem;
		height: 2.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 999px;
		background: rgba(245, 234, 216, 0.92);
		backdrop-filter: blur(10px);
		color: var(--color-teal);
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.18);
		cursor: pointer;
		transition:
			background-color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.info-trigger:hover {
		background: rgba(245, 234, 216, 1);
		transform: scale(1.06);
	}

	.layers-trigger {
		position: absolute;
		bottom: 3.5rem;
		left: 1rem;
		z-index: 1000;
		width: 2.6rem;
		height: 2.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 999px;
		background: rgba(245, 234, 216, 0.92);
		backdrop-filter: blur(10px);
		color: var(--color-olive);
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.18);
		cursor: pointer;
		transition:
			background-color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.layers-trigger:hover {
		background: rgba(245, 234, 216, 1);
		transform: scale(1.06);
	}

	.layers-panel {
		position: absolute;
		bottom: 3.5rem;
		left: 1rem;
		z-index: 1000;
		width: min(17rem, calc(100% - 2rem));
		background: rgba(245, 234, 216, 0.92);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		padding: 0.9rem 1.1rem 1.1rem;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.18);
		transform-origin: bottom left;
	}

	.layers-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.layers-head h2 {
		font-size: 1rem;
		color: var(--color-olive);
	}

	.layers-panel ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.layers-panel label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.layers-panel li.disabled label {
		color: var(--color-text);
		opacity: 0.55;
		cursor: not-allowed;
	}

	.layers-panel input[type='checkbox'] {
		accent-color: var(--color-olive);
		width: 1rem;
		height: 1rem;
	}

	.layer-note {
		margin: 0.15rem 0 0 1.5rem;
		font-size: 0.72rem;
		line-height: 1.3;
		color: var(--color-teal);
	}
</style>
