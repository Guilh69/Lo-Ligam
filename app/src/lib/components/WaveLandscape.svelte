<script>
	// Vagues du bas de page. Elles s'écartent et s'effacent au scroll, et
	// suivent légèrement la souris (parallaxe) tant qu'elles sont visibles.
	let { scrollY = 0 } = $props();

	const fadeDistance = 360;
	let progress = $derived(Math.min(1, scrollY / fadeDistance));

	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMove(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		mouseX = (event.clientX - rect.left) / rect.width - 0.5;
		mouseY = (event.clientY - rect.top) / rect.height - 0.5;
	}

	function resetMouse() {
		mouseX = 0;
		mouseY = 0;
	}
</script>

<svg
	class="landscape"
	viewBox="0 0 1440 220"
	preserveAspectRatio="none"
	aria-hidden="true"
	style="opacity: {1 - progress}; pointer-events: {progress < 1 ? 'auto' : 'none'}"
	onpointermove={handleMove}
	onpointerleave={resetMouse}
>
	<g class="wave-outer" style="transform: translateY({-progress * 28}px)">
		<g class="wave-mouse" style="transform: translate({mouseX * 16}px, {mouseY * 9}px)">
			<g class="wave-bob wave-bob-1">
				<path
					d="M0,120 C240,180 480,60 720,100 C960,140 1200,40 1440,90 L1440,220 L0,220 Z"
					fill="var(--color-brick)"
					opacity="0.5"
				/>
			</g>
		</g>
	</g>
	<g class="wave-outer" style="transform: translateY({progress * 34}px)">
		<g class="wave-mouse" style="transform: translate({mouseX * 28}px, {mouseY * 16}px)">
			<g class="wave-bob wave-bob-2">
				<path
					d="M0,160 C240,200 480,120 720,150 C960,180 1200,110 1440,140 L1440,220 L0,220 Z"
					fill="var(--color-terracotta)"
				/>
			</g>
		</g>
	</g>
</svg>

<style>
	.landscape {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 128px;
		z-index: 2;
		transition:
			opacity 200ms linear,
			height 200ms linear;
	}

	@media (min-width: 40rem) {
		.landscape {
			height: 160px;
		}
	}

	.wave-outer {
		transition: transform 200ms linear;
	}

	/* Suit la souris avec un peu d'inertie (easing plus lent que le
	   scroll) pour un effet de profondeur discret, jamais brusque. */
	.wave-mouse {
		transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* Mouvement organique en dérive, jamais synchronisé entre les deux
	   vagues (durées, déphasage et trajets différents), pour éviter tout
	   effet de rebond mécanique. */
	.wave-bob-1 {
		animation: wave-bob-1 14s ease-in-out infinite;
	}

	.wave-bob-2 {
		animation: wave-bob-2 18s ease-in-out infinite;
		animation-delay: -7s;
	}

	@keyframes wave-bob-1 {
		0% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(9px, -4px);
		}
		50% {
			transform: translate(3px, -8px);
		}
		75% {
			transform: translate(-7px, -2px);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	@keyframes wave-bob-2 {
		0% {
			transform: translate(0, 0);
		}
		30% {
			transform: translate(-8px, 3px);
		}
		60% {
			transform: translate(-2px, 6px);
		}
		85% {
			transform: translate(6px, 2px);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wave-bob-1,
		.wave-bob-2 {
			animation: none;
		}

		.wave-mouse {
			transition: none;
			transform: none !important;
		}
	}
</style>
