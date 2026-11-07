<script>
	// La pastille « Aviat » (bientôt) des pages pas encore ouvertes : la pièce ocre de la
	// langue choisie, texte encre (5,3:1). Romain, 2026-11-07 (option 3 pour Articles et
	// Fòrum). « aviat » vérifié par l'API de lo Congrès ; es/en/ca/ar : à relire par Aran.
	import { tria } from '$lib/stores/lang.svelte.js';
	import { AVIAT } from '$lib/data/planSite.js';
</script>

<span class="aviat-pastille">{tria(AVIAT)}</span>

<style>
	.aviat-pastille {
		display: inline-flex;
		align-items: center;
		flex: none;
		padding: 0.16em 0.7em;
		border-radius: 999px;
		background: var(--pc-or-fons, #c7811b);
		color: var(--pc-or-tinta, #2a1a12);
		font-family: var(--font-body, system-ui, sans-serif);
		font-size: 0.74rem;
		font-weight: 700;
		line-height: 1.4;
		letter-spacing: 0.04em;
		text-transform: none;
		white-space: nowrap;
	}
</style>
