<script>
	// La croix du logo qui se charge (essai « la croix dans les ronds », Romain, 2026-11-03,
	// Corrections_page_accueil.pdf p. 5) : les douze points, petits et blancs, deviennent grands
	// et dorés un à un, dans le sens des aiguilles d'une montre depuis le haut ; pleine, la croix
	// passe au rouge du logo (sur un rond d'or, dessiné par la scène). À poser DANS un <svg> : elle
	// se place par son centre (cx, cy) et son rayon r. Géométrie de Crotz.svelte (favicon.svg
	// normalisée).
	// Couleurs : celles des recettes du logo (app.css, jetons --logo-*, charte §1 bis), sans
	// aucune teinte dérivée (relecture de Joan, 2026-11-03) : « éteint » se dit par la taille (petit
	// point) et « allumé » par la couleur (point doré), pas par une transparence. La scène donne
	// --cc-traç (traits et points éteints), --cc-ponch (points allumés), --cc-moieu (moyeu allumé)
	// et --cc-plena (croix pleine).
	import { PONCHS, RAIS, ARCS } from './crotz-geometria.js';

	let { cx = 0, cy = 0, r = 10, acesa = 0, plena = false } = $props();
</script>

<g class="cc" class:plena transform="translate({cx} {cy}) scale({r})">
	<g class="cc-traç" fill="none" stroke-linecap="round">
		<path d={RAIS} stroke-width="0.075" />
		<path d={ARCS} stroke-width="0.08" />
	</g>
	<circle class="cc-moieu" class:acesa={acesa > 0 || plena} cx="0" cy="0" r="0.15" />
	{#each PONCHS as [x, y], i (i)}
		<circle class="cc-ponch" class:acesa={plena || i < acesa} cx={x} cy={y} r="0.125" />
	{/each}
</g>

<style>
	.cc-traç {
		stroke: var(--cc-traç);
		transition: stroke 0.4s;
	}
	/* éteint : un petit point de la couleur des traits ; allumé : grand, de la couleur des points */
	.cc-ponch,
	.cc-moieu {
		fill: var(--cc-traç);
		transform-box: fill-box;
		transform-origin: center;
		transform: scale(0.5);
		transition:
			transform 0.45s cubic-bezier(0.3, 1.7, 0.5, 1),
			fill 0.3s;
	}
	.cc-ponch.acesa {
		fill: var(--cc-ponch);
		transform: scale(1);
	}
	.cc-moieu.acesa {
		fill: var(--cc-moieu);
		transform: scale(1);
	}
	/* pleine : tout passe au rouge du logo, nettement */
	.plena .cc-traç {
		stroke: var(--cc-plena);
	}
	.plena .cc-ponch,
	.plena .cc-moieu {
		fill: var(--cc-plena);
		transform: scale(1);
	}
	@media (prefers-reduced-motion: reduce) {
		.cc-ponch,
		.cc-moieu,
		.cc-traç {
			transition: none;
		}
	}
</style>
