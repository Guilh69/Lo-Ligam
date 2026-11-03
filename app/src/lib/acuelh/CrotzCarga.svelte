<script>
	// La croix du logo qui se charge (essai « la croix dans les ronds », Romain, 2026-11-03,
	// Corrections_page_accueil.pdf p. 5) : ses douze points s'allument un à un, dans le sens
	// des aiguilles d'une montre depuis le haut ; pleine, la croix passe au rouge du logo (sur
	// un rond d'or, dessiné par la scène). À poser DANS un <svg> : elle se place par son
	// centre (cx, cy) et son rayon r. Géométrie de Crotz.svelte (favicon.svg normalisée) ;
	// couleurs par les jetons --cc-* de la scène (recettes de Romain : or et rouge du logo).
	let { cx = 0, cy = 0, r = 10, acesa = 0, plena = false } = $props();

	// les douze points, dans l'ordre où ils s'allument
	const PONCHS = [
		[0, -1],
		[0.486, -0.797],
		[0.809, -0.48],
		[1, 0],
		[0.809, 0.48],
		[0.486, 0.797],
		[0, 0.992],
		[-0.468, 0.797],
		[-0.786, 0.48],
		[-0.976, 0.009],
		[-0.786, -0.48],
		[-0.468, -0.797]
	];
	const RAIS = 'M0 0L0.486 -0.797M0 0L0.809 -0.48M0 0L0.809 0.48M0 0L0.486 0.797M0 0L-0.468 0.797M0 0L-0.786 0.48M0 0L-0.786 -0.48M0 0L-0.468 -0.797';
	const ARCS =
		'M-0.468 -0.797Q-0.194 -0.746 0 -1M0 -1Q0.202 -0.746 0.486 -0.797M0.809 -0.48Q0.751 -0.199 1 0M1 0Q0.751 0.199 0.809 0.48M0.486 0.797Q0.202 0.742 0 0.992M0 0.992Q-0.194 0.742 -0.468 0.797M-0.786 0.48Q-0.731 0.203 -0.976 0.009M-0.976 0.009Q-0.731 -0.195 -0.786 -0.48';
</script>

<g class="cc" class:plena transform="translate({cx} {cy}) scale({r})">
	<g class="cc-traç" fill="none" stroke-linecap="round">
		<path d={RAIS} stroke-width="0.063" />
		<path d={ARCS} stroke-width="0.07" />
	</g>
	<circle class="cc-moieu" class:acesa={acesa > 0 || plena} cx="0" cy="0" r="0.124" />
	{#each PONCHS as [x, y], i (i)}
		<circle class="cc-ponch" class:acesa={plena || i < acesa} cx={x} cy={y} r="0.109" />
	{/each}
</g>

<style>
	.cc-traç {
		stroke: var(--cc-traç);
		stroke-opacity: 0.5;
		transition:
			stroke 0.4s,
			stroke-opacity 0.4s;
	}
	.cc-ponch,
	.cc-moieu {
		fill: var(--cc-ponch-amorta);
		transition: fill 0.35s;
		transform-box: fill-box;
		transform-origin: center;
	}
	.cc-ponch.acesa {
		fill: var(--cc-ponch-acesa);
		animation: pop 0.45s ease-out;
	}
	.cc-moieu.acesa {
		fill: var(--cc-moieu);
	}
	/* pleine : tout passe au rouge du logo, nettement */
	.plena .cc-traç {
		stroke: var(--cc-plena);
		stroke-opacity: 1;
	}
	.plena .cc-ponch,
	.plena .cc-moieu {
		fill: var(--cc-plena);
	}
	@keyframes pop {
		0% {
			transform: scale(1.9);
		}
		100% {
			transform: scale(1);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cc-ponch.acesa {
			animation: none;
		}
	}
</style>
