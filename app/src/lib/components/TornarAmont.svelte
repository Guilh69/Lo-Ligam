<script>
	// Bouton « remonter en haut » (cadre commun, 2026-10-07, demande Romain) :
	// un chevron sans tige, en bas à droite, visible dès qu'on a défilé d'un
	// écran. Défilement doux, sauf si « réduire les animations » est activé.
	import { tria } from '$lib/stores/lang.svelte.js';

	let vist = $state(false);
	let tèxt = $derived(
		tria({ oc: 'Tornar amont', fr: 'Remonter en haut', es: 'Volver arriba', en: 'Back to top', ca: 'Tornar a dalt', ar: 'العودة إلى الأعلى' })
	);

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
	class="pc pc-2 amont"
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
	/* pièce de papier (lib/styles/papier.css) : posée au bord de la page, elle apparaît en montant */
	.amont {
		position: fixed;
		z-index: 55;
		right: clamp(1rem, 4vw, 3.4rem);
		bottom: calc(1.4rem + env(safe-area-inset-bottom, 0px));
		--r: 14px;
		width: 46px;
		height: 46px;
		padding: 0;
		opacity: 0;
		transform: translateY(14px);
		pointer-events: none;
		transition:
			opacity 0.6s cubic-bezier(0.19, 1, 0.22, 1),
			transform 0.6s cubic-bezier(0.19, 1, 0.22, 1),
			box-shadow 0.3s;
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
