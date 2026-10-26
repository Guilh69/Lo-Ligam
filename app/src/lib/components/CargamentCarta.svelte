<script>
	// L'écran de chargement de la carte (lot 2 de la remise en ordre, choix de
	// Romain, 2026-10-23 : « un chargement qui s'affiche, mais joli, presque
	// ludique, qui fasse patienter le temps que tout soit chargé ») : la croix
	// du logo se trace, ses douze points s'allument au fil du chargement réel
	// (estatCarta.cargament), puis l'écran s'efface quand la carte est prête.
	// Rendu dès le serveur : visible au premier octet. Sobre si l'on demande
	// moins de mouvement.
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { estatCarta } from '$lib/carta/estatCarta.svelte.js';

	let { lang = 'oc' } = $props();
	const tx = { oc: 'La carta se prepara…', fr: 'La carte se prépare…', es: 'El mapa se está preparando…', en: 'The map is getting ready…', ca: 'El mapa s’està preparant…', ar: 'جارٍ تحضير الخريطة…' };

	// los dotze ponches de la crotz (geometria de favicon.svg, coma Crotz.svelte)
	const PONCHES = [
		[0, -1], [0.486, -0.797], [0.809, -0.48], [1, 0], [0.809, 0.48], [0.486, 0.797],
		[0, 0.992], [-0.468, 0.797], [-0.786, 0.48], [-0.976, 0.009], [-0.786, -0.48], [-0.468, -0.797]
	];
	const RAIS = PONCHES.map(([x, y]) => `M0 0L${x} ${y}`);
	let alucats = $derived(Math.round(Math.min(1, estatCarta.cargament ?? 0) * PONCHES.length));

	// (garda-fòl : se quicòm se bloca, la carta se mòstra pasmens ; 30 s, al luòc
	// de 9 s : sus un telefòn lent, l'emblèma s'escafava abans la fin, 2026-10-26)
	onMount(() => {
		estatCarta.cargament = Math.max(estatCarta.cargament ?? 0, 0.15);
		const t = setTimeout(() => (estatCarta.prèsta = true), 30000);
		return () => clearTimeout(t);
	});
</script>

<div class="cargament" role="status" aria-live="polite" out:fade={{ duration: 600 }}>
	<svg viewBox="-1.3 -1.3 2.6 2.6" aria-hidden="true" focusable="false">
		<g class="rais">
			{#each RAIS as d, i}<path {d} pathLength="1" style:--i={i} />{/each}
		</g>
		<circle class="moieu" cx="0" cy="0" r="0.13" />
		{#each PONCHES as [x, y], i}
			<circle class="ponch" class:alucat={i < alucats} cx={x} cy={y} r="0.11" style:--i={i} />
		{/each}
	</svg>
	<p>{tx[lang] ?? tx.oc}</p>
</div>

<style>
	.cargament {
		position: absolute;
		inset: 0;
		z-index: 1050;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 18px;
		background: var(--t-fons);
	}
	svg {
		width: min(28vw, 132px);
		height: min(28vw, 132px);
		overflow: visible;
	}
	/* los rais se tracan l'un après l'autre, puèi tornan, en bocla */
	.rais path {
		fill: none;
		stroke: var(--logo-traç, var(--t-aur));
		stroke-width: 0.06;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: rai 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		animation-delay: calc(var(--i) * 0.08s);
	}
	@keyframes rai {
		0% {
			stroke-dashoffset: 1;
			opacity: 0.25;
		}
		40%,
		70% {
			stroke-dashoffset: 0;
			opacity: 0.9;
		}
		100% {
			stroke-dashoffset: -1;
			opacity: 0.25;
		}
	}
	.moieu {
		fill: var(--logo-moieu, var(--t-aur));
		animation: bat 2.4s ease-in-out infinite;
		transform-origin: 0 0;
	}
	@keyframes bat {
		50% {
			transform: scale(1.25);
		}
	}
	/* un ponch s'aluca quand una partida de la carta es cargada */
	.ponch {
		fill: var(--logo-ponch, var(--t-aur-clar));
		opacity: 0.15;
		transform-box: fill-box;
		transform-origin: center;
		transform: scale(0.6);
		transition:
			opacity 0.5s ease-out,
			transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.4);
		transition-delay: calc(var(--i) * 0.04s);
	}
	.ponch.alucat {
		opacity: 1;
		transform: scale(1);
		filter: drop-shadow(0 0 0.08px var(--logo-ponch, var(--t-aur-clar)));
	}
	p {
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 1.05rem;
		color: var(--t-tinta-2);
	}
	@media (prefers-reduced-motion: reduce) {
		.rais path,
		.moieu {
			animation: none;
			stroke-dashoffset: 0;
			opacity: 0.6;
		}
		.ponch {
			transition: none;
		}
	}
</style>
