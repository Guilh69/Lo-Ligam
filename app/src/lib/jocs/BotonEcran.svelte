<script>
	// Bouton « Plen ecran » des jeux (Romain, 05-11 : « donner la possibilité
	// de jouer sur une interface pleine, pas juste intégrée à la page »). Le
	// jeu passe en mode plein (classe posée par le jeu à partir de `actiu`) et,
	// quand le navigateur le permet, en plein écran véritable ; sur iPhone, où
	// une page ne peut pas passer en plein écran, le jeu couvre seulement toute
	// la fenêtre. Échap (sortie du plein écran par le navigateur) ou « Sortir »
	// ramènent la page.
	import { onMount } from 'svelte';
	import { tria } from '$lib/stores/lang.svelte.js';

	let { actiu = $bindable(false), cibla } = $props();

	// Occitan passé à lo Congrès le 2026-11-05 (plen, ecran, sortir), à valider par Romain.
	const T = {
		plen: { oc: 'Plen ecran', fr: 'Plein écran' },
		sortir: { oc: 'Sortir', fr: 'Sortir' }
	};

	async function bascular() {
		actiu = !actiu;
		try {
			if (actiu && cibla?.requestFullscreen && !document.fullscreenElement) await cibla.requestFullscreen({ navigationUI: 'hide' });
			else if (!actiu && document.fullscreenElement) await document.exitFullscreen();
		} catch {
			// plein écran refusé : le mode plein reste, dans la fenêtre
		}
	}

	onMount(() => {
		const canviar = () => {
			if (!document.fullscreenElement && actiu) actiu = false;
		};
		document.addEventListener('fullscreenchange', canviar);
		return () => {
			document.removeEventListener('fullscreenchange', canviar);
			if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
		};
	});
</script>

<!-- pas d'aria-pressed : le libellé change déjà (« Sortir, enfoncé » se lisait mal, Joan, 06-11) -->
<button type="button" class="ecran" onclick={bascular}>
	<svg viewBox="0 0 24 24" aria-hidden="true">
		{#if actiu}
			<path d="M7 7l10 10M17 7L7 17" />
		{:else}
			<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
		{/if}
	</svg>
	<span>{actiu ? tria(T.sortir) : tria(T.plen)}</span>
</button>

<style>
	.ecran {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		min-height: 2.75rem;
		padding: 0.3rem 0.85rem 0.3rem 0.65rem;
		border: 1px solid var(--t-linha);
		border-radius: 0.6rem;
		background: none;
		font: inherit;
		color: var(--t-tinta);
		cursor: pointer;
		white-space: nowrap;
	}
	.ecran:hover {
		border-color: var(--t-tinta-2);
	}
	.ecran:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	svg {
		width: 1.25rem;
		height: 1.25rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
