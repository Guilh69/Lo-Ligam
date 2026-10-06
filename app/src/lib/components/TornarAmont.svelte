<script>
	// Bouton « remonter en haut » (cadre commun, 2026-10-07, demande Romain) :
	// un chevron sans tige, en bas à droite, visible dès qu'on a défilé d'un
	// écran. Défilement doux, sauf si « réduire les animations » est activé.
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let lang = $derived(langStore.current);
	let vist = $state(false);
	let tèxt = $derived(lang === 'fr' ? 'Remonter en haut' : 'Tornar amont');

	$effect(() => {
		const verificar = () => (vist = window.scrollY > window.innerHeight * 0.9);
		verificar();
		window.addEventListener('scroll', verificar, { passive: true });
		return () => window.removeEventListener('scroll', verificar);
	});

	function montar() {
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
	}
</script>

<button
	type="button"
	class="amont"
	class:vist
	aria-label={tèxt}
	title={tèxt}
	tabindex={vist ? 0 : -1}
	aria-hidden={!vist}
	onclick={montar}
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.8"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg
	>
</button>

<style>
	.amont {
		position: fixed;
		z-index: 55;
		right: clamp(1rem, 4vw, 3.4rem);
		bottom: calc(1.4rem + env(safe-area-inset-bottom, 0px));
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		padding: 0;
		border-radius: 50%;
		border: 1px solid var(--t-linha);
		background: color-mix(in srgb, var(--t-fons) 75%, transparent);
		backdrop-filter: blur(6px);
		color: var(--t-aur);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		opacity: 0;
		transform: translateY(14px);
		pointer-events: none;
		transition:
			opacity 0.6s cubic-bezier(0.19, 1, 0.22, 1),
			transform 0.6s cubic-bezier(0.19, 1, 0.22, 1),
			border-color 0.4s;
	}

	.amont svg {
		width: 22px;
		height: 22px;
		transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.amont.vist {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}

	.amont:hover {
		border-color: var(--t-aur);
	}

	.amont:hover svg {
		transform: translateY(-3px);
	}

	.amont:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
	}

	@media (prefers-reduced-motion: reduce) {
		.amont,
		.amont svg {
			transition: none;
		}
	}
</style>
