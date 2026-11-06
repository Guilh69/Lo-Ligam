<script>
	// Les affiches de la salle de jeux : cinq paysages d'Occitanie d'après les
	// photos de Romain, dessinés par afica-scenas.js (la manière y est décrite).
	// Le dessin est fait dans le navigateur une fois la page affichée : la page
	// envoyée reste légère ; en attendant, la case a la couleur du paysage.
	// Joiós (par défaut) : couleurs franches, le dessin lui-même bouge (l'eau,
	// les feuilles, les nuages, la voile, les oiseaux), seulement quand
	// l'affiche est à l'écran. Calme : le même dessin, passé comme une vieille
	// affiche, immobile. Rien ne bouge si l'appareil demande moins
	// d'animations. Décoratif : rien à lire pour un lecteur d'écran.
	import { onMount } from 'svelte';
	import { scena } from './afica-scenas.js';

	let { id, tema = 'joios' } = $props();
	let dessenh = $state('');
	let vista = $state(true);
	let cadre;

	$effect(() => {
		dessenh = scena(id);
	});
	onMount(() => {
		if (typeof IntersectionObserver === 'undefined') return;
		const o = new IntersectionObserver(([e]) => (vista = e.isIntersecting));
		o.observe(cadre);
		return () => o.disconnect();
	});
</script>

<div
	bind:this={cadre}
	class="afica {id}"
	class:joios={tema === 'joios'}
	class:pausa={!vista}
	aria-hidden="true"
>
	{#if dessenh}
		<svg
			class="scena"
			viewBox="0 0 400 300"
			preserveAspectRatio="xMidYMid slice"
			focusable="false"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			{@html dessenh}
		</svg>
	{/if}
	<!-- le grain du papier, à part : il ne bouge jamais -->
	<svg class="gra" viewBox="0 0 400 300" preserveAspectRatio="none" focusable="false">
		<filter id="gra-{id}" x="0" y="0" width="100%" height="100%">
			<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
			<feColorMatrix type="saturate" values="0" />
		</filter>
		<rect width="400" height="300" filter="url(#gra-{id})" />
	</svg>
</div>

<style>
	.afica {
		position: relative;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		background: var(--fons-afica, #8fa9bf);
	}
	/* la couleur du paysage, le temps que le dessin se fasse */
	.garona {
		--fons-afica: #5a8fc6;
	}
	.vilatge {
		--fons-afica: #7b9a5e;
	}
	.riu {
		--fons-afica: #9fc2b3;
	}
	.plana {
		--fons-afica: #b6c08a;
	}
	.mar {
		--fons-afica: #2f66ae;
	}
	.afica svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	.scena {
		animation: afica-aparicion 0.6s ease-out;
	}
	.gra {
		mix-blend-mode: overlay;
		opacity: 0.2;
		pointer-events: none;
	}
	/* calme : le même dessin, passé comme une vieille affiche */
	.afica:not(.joios) {
		filter: saturate(0.55) sepia(0.16) brightness(1.05) contrast(0.9);
	}

	/* ── joiós : le dessin lui-même bouge ── */
	.joios :global(.nivols) {
		animation: afica-nivols 38s ease-in-out infinite alternate;
	}
	.joios :global(.ondas-a) {
		animation: afica-ondas 9s ease-in-out infinite alternate;
	}
	.joios :global(.ondas-b) {
		animation: afica-ondas 12s ease-in-out infinite alternate-reverse;
	}
	.joios :global(.escuma) {
		animation: afica-escuma 4.2s ease-in-out infinite alternate;
	}
	.joios :global(.lusor-a) {
		animation: afica-lusor 5s ease-in-out infinite alternate;
	}
	.joios :global(.lusor-b) {
		animation: afica-lusor 5s ease-in-out -2.5s infinite alternate;
	}
	.joios :global(.volar) {
		animation: afica-volar 30s linear infinite;
	}
	.joios :global(.balanc) {
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: afica-balanc 9s ease-in-out infinite alternate;
	}
	.joios :global(.pin) {
		transform-box: fill-box;
		transform-origin: 90% 100%;
		animation: afica-pin 10s ease-in-out infinite alternate;
	}
	.joios :global(.ventolet) {
		animation: afica-ventolet 8s ease-in-out infinite alternate;
	}
	.joios :global(.lums) {
		animation: afica-lums 7s ease-in-out infinite alternate;
	}
	.joios :global(.sornas) {
		animation: afica-sornas 7s ease-in-out -3.5s infinite alternate;
	}
	.joios :global(.barca) {
		animation: afica-barca 26s ease-in-out infinite alternate;
	}
	/* hors de l'écran, rien ne tourne */
	.pausa :global(*) {
		animation-play-state: paused !important;
	}
	@keyframes -global-afica-aparicion {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes -global-afica-nivols {
		from {
			transform: translateX(-8px);
		}
		to {
			transform: translateX(10px);
		}
	}
	@keyframes -global-afica-ondas {
		from {
			transform: translateX(-12px);
		}
		to {
			transform: translateX(12px);
		}
	}
	@keyframes -global-afica-escuma {
		from {
			opacity: 0.4;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes -global-afica-lusor {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.12;
		}
	}
	@keyframes -global-afica-volar {
		from {
			transform: translateX(-210px);
		}
		to {
			transform: translateX(290px);
		}
	}
	@keyframes -global-afica-balanc {
		from {
			transform: rotate(-1deg);
		}
		to {
			transform: rotate(1deg);
		}
	}
	@keyframes -global-afica-pin {
		from {
			transform: rotate(-0.8deg);
		}
		to {
			transform: rotate(0.6deg);
		}
	}
	@keyframes -global-afica-ventolet {
		from {
			transform: translateX(-2.5px);
		}
		to {
			transform: translateX(2.5px);
		}
	}
	@keyframes -global-afica-lums {
		from {
			opacity: 0.3;
			transform: translateX(-2px);
		}
		to {
			opacity: 0.85;
			transform: translateX(2px);
		}
	}
	@keyframes -global-afica-sornas {
		from {
			opacity: 0.1;
			transform: translateX(-2px);
		}
		to {
			opacity: 0.3;
			transform: translateX(2px);
		}
	}
	@keyframes -global-afica-barca {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(40px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.afica :global(*) {
			animation: none !important;
		}
	}
</style>
