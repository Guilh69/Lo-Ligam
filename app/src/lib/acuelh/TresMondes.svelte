<script>
	// « Los tres mondes » (direction d'accueil validée le 2026-10-25) : les trois
	// entités deviennent des fenêtres vivantes sur chaque monde, en composition
	// libre, tenues par le fil du ligam. Porté de l'essai /ensag/mondes dans la
	// vraie page, bilingue, liens pris du plan du site.
	//
	// CHARPENTE (étape 1) : les textes sous les titres sont encore des exemples,
	// descriptifs ; ils deviendront modifiables sur la page (étape 2) et Romain
	// écrira les vrais. Aucune accroche inventée.
	import { onMount } from 'svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { PLAN } from '$lib/data/planSite.js';
	import { AMASSA } from '$lib/acuelh/amassa.js';
	import { ESTELAS, VISTA, COSTA_D } from '../../routes/ensag/blanc/donadas.js';

	let fr = $derived(langStore.current === 'fr');
	const [PARLA, APREN, VIU] = PLAN;

	// phrases d'exemple (descriptives), à rendre modifiables à l'étape 2
	const SOTA = {
		parla: { oc: 'Lo país e sas lengas, en carta d’estelas.', fr: 'Le pays et ses langues, en carte d’étoiles.' },
		apren: { oc: 'Un camin, pas a pas, a ton ritme.', fr: 'Un chemin, pas à pas, à ton rythme.' },
		viu: { oc: 'De monde, de ligams, pertot.', fr: 'Des gens, des liens, partout.' }
	};
	const DINTRAR = { oc: 'Dintrar', fr: 'Entrer' };

	let racina;
	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		racina.classList.add('anim');
		const io = new IntersectionObserver(
			(lignas) => {
				for (const l of lignas)
					if (l.isIntersecting) {
						l.target.classList.add('vist');
						io.unobserve(l.target);
					}
			},
			{ threshold: 0.2 }
		);
		racina.querySelectorAll('.fenestra').forEach((el) => io.observe(el));

		const mur = racina.querySelector('.mur');
		const carta = racina.querySelector('.carta');
		let af = 0;
		const maj = () => {
			af = 0;
			const r = mur.getBoundingClientRect();
			const h = window.innerHeight;
			const p = Math.min(1, Math.max(0, (h - r.top) / (h + r.height)));
			racina.style.setProperty('--fil', Math.min(1, p * 1.3).toFixed(3));
			if (carta) carta.style.setProperty('--para', (-(p - 0.5) * 40).toFixed(1) + 'px');
		};
		const aScroll = () => { if (!af) af = requestAnimationFrame(maj); };
		addEventListener('scroll', aScroll, { passive: true });
		addEventListener('resize', aScroll, { passive: true });
		maj();
		return () => {
			io.disconnect();
			removeEventListener('scroll', aScroll);
			removeEventListener('resize', aScroll);
			if (af) cancelAnimationFrame(af);
		};
	});
</script>

{#snippet sageta()}<svg class="fl" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5" /></svg>{/snippet}

<section class="tres-mondes" bind:this={racina} aria-label={fr ? 'Les trois mondes' : 'Los tres mondes'}>
	<div class="mur">
		<span class="fil" aria-hidden="true"><i class="trait"></i></span>

		<!-- 01 Se parla : la carte en étoiles -->
		<article class="fenestra granda parla">
			<div class="fen-cap">
				<span class="num">01</span>
				<h2>{fr ? PARLA.fr : PARLA.oc}</h2>
				<p class="sota">{fr ? SOTA.parla.fr : SOTA.parla.oc}</p>
			</div>
			<figure class="carta" aria-hidden="true">
				<svg viewBox={VISTA} role="img">
					<path class="costa" d={COSTA_D} pathLength="1" />
					{#each ESTELAS as e, i (e.nom + i)}
						<circle class="estela" class:vila={e.vila} cx={e.x} cy={e.y} r={e.vila ? 4 : 2} style="--i: {i}" />
						{#if e.vila}<text class="vila-nom" x={e.x + 8} y={e.y + 4}>{e.nom}</text>{/if}
					{/each}
				</svg>
			</figure>
			<a class="dintrar" href={PARLA.href}>{fr ? DINTRAR.fr : DINTRAR.oc} {@render sageta()}</a>
		</article>

		<!-- 02 S'apren : le chemin et ses jalons -->
		<article class="fenestra apren">
			<div class="fen-cap">
				<span class="num">02</span>
				<h2>{fr ? APREN.fr : APREN.oc}</h2>
				<p class="sota">{fr ? SOTA.apren.fr : SOTA.apren.oc}</p>
			</div>
			<figure class="camin" aria-hidden="true">
				<svg viewBox="0 0 260 140" role="img">
					<path class="camin-via" d="M22 120 C 70 120 66 88 108 84 S 168 70 178 44 S 214 24 238 20" pathLength="1" fill="none" stroke="#ffd98a" stroke-width="2.6" stroke-linecap="round" stroke-opacity="0.85" />
					<circle class="camin-fita" cx="22" cy="120" r="6" style="--i: 0" />
					<circle class="camin-fita" cx="108" cy="84" r="5" style="--i: 1" />
					<circle class="camin-fita" cx="178" cy="44" r="5" style="--i: 2" />
					<circle class="camin-fita camin-fin" cx="238" cy="20" r="6.5" style="--i: 3" />
				</svg>
			</figure>
			<a class="dintrar" href={APREN.href}>{fr ? DINTRAR.fr : DINTRAR.oc} {@render sageta()}</a>
		</article>

		<!-- 03 Amassa : le domaine et ses liaisons (donnée réelle) -->
		<article class="fenestra amassa">
			<div class="fen-cap">
				<span class="num">03</span>
				<h2>{fr ? VIU.fr : VIU.oc}</h2>
				<p class="sota">{fr ? SOTA.viu.fr : SOTA.viu.oc}</p>
			</div>
			<figure class="rets" aria-hidden="true">
				<svg viewBox="0 0 400 300" role="img">
					<path class="rets-domeni" d={AMASSA.contorn} />
					{#each AMASSA.arcs as d, i (d)}
						<path class="rets-arc" {d} pathLength="1" style="--i: {i}" />
						<path class="rets-flux" {d} style="--i: {i}" />
					{/each}
					{#each AMASSA.vilas as [x, y], i (i)}
						<circle class="rets-vila" cx={x} cy={y} r="4" style="--i: {i}" />
					{/each}
				</svg>
			</figure>
			<a class="dintrar" href={VIU.href}>{fr ? DINTRAR.fr : DINTRAR.oc} {@render sageta()}</a>
		</article>
	</div>
</section>

<style>
	.tres-mondes {
		--or: #eeaf34;
		--or-clar: #f0c877;
		--crema: #fbf1e1;
		--lent: cubic-bezier(0.22, 1, 0.36, 1);
		display: block;
		padding: clamp(2rem, 6vh, 5rem) var(--marge);
		max-width: calc(1100px + 2 * var(--marge));
		margin: 0 auto;
	}
	.mur { position: relative; display: grid; grid-template-columns: 1.25fr 1fr; grid-template-rows: auto auto; gap: 18px 44px; }
	.fil { position: absolute; top: 24px; bottom: 0; left: calc(55.6% - 1px); width: 2px; z-index: 2; }
	.fil .trait { position: absolute; inset: 0; transform-origin: top; transform: scaleY(var(--fil, 1)); background: linear-gradient(var(--or), var(--or) 92%, transparent); opacity: 0.8; }
	.fil::before, .fil::after { content: ''; position: absolute; left: 50%; width: 11px; height: 11px; margin-left: -5.5px; border-radius: 50%; background: var(--or); }
	.fil::before { top: 22%; }
	.fil::after { top: 70%; }

	.fenestra { position: relative; border-radius: 14px; padding: 22px; overflow: clip; display: flex; flex-direction: column; min-width: 0; }
	.fenestra::before { content: ''; position: absolute; inset: 10px; border: 1px solid rgba(238, 175, 52, 0.4); border-radius: 10px; pointer-events: none; }
	.parla { grid-row: 1 / 3; background: #a5342a; min-height: 440px; }
	.apren { grid-column: 2; grid-row: 1; background: #1f5f63; min-height: 200px; }
	.amassa { grid-column: 2; grid-row: 2; background: #6b3a5b; min-height: 200px; }

	.fen-cap .num { font-family: var(--font-heading), serif; font-size: 1.2rem; color: var(--or-clar); }
	.fen-cap h2 { font-family: var(--font-heading), serif; font-weight: 400; margin: 2px 0 0; font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1; color: var(--crema); }
	.granda .fen-cap h2 { font-size: clamp(2.4rem, 4vw, 3.4rem); }
	.sota { margin: 8px 0 0; font-size: 0.95rem; color: var(--crema); opacity: 0.9; max-width: 32ch; }

	.carta { margin: 14px 0 0; flex: 1; display: flex; align-items: center; justify-content: center; transform: translateY(var(--para, 0)); will-change: transform; }
	.carta svg, .camin svg, .rets svg { width: 100%; height: auto; display: block; }
	.camin { margin: 12px 0 0; flex: 1; display: flex; align-items: center; justify-content: center; }
	.camin svg { max-height: 150px; }
	.rets { margin: 10px 0 0; flex: 1; display: flex; align-items: center; justify-content: center; }
	.rets svg { max-height: 172px; }

	.costa { fill: none; stroke: var(--or-clar); stroke-opacity: 0.5; stroke-width: 1.2; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
	.estela { fill: #ffe6b8; fill-opacity: 0.6; }
	.estela.vila { fill: #ffd98a; fill-opacity: 1; }
	.vila-nom { font: 400 12px/1 var(--font-body), sans-serif; fill: var(--crema); fill-opacity: 0.85; }
	.camin-fita { fill: #1f5f63; stroke: #ffd98a; stroke-width: 2.4; transform-box: fill-box; transform-origin: center; }
	.camin-fin { fill: #ffd98a; }
	.rets-domeni { fill: color-mix(in srgb, #ffd98a 8%, transparent); stroke: rgba(238, 175, 52, 0.4); stroke-width: 0.8; stroke-linejoin: round; }
	.rets-arc { fill: none; stroke: #ffd98a; stroke-width: 1; opacity: 0.4; }
	.rets-flux { fill: none; stroke: #fff; stroke-width: 2; stroke-dasharray: 0 7; stroke-linecap: round; opacity: 0.85; }
	.rets-vila { fill: #ffd98a; transform-box: fill-box; transform-origin: center; }

	.dintrar { margin-top: 14px; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; width: fit-content; padding-bottom: 2px; color: var(--crema); border-bottom: 2px solid var(--or); text-decoration: none; }
	.fl { width: 1em; height: 1em; transition: transform 0.4s var(--lent); }
	.dintrar:hover .fl { transform: translateX(4px); }

	/* Animations de défilement (JS : classe « anim » posée hors « moins d'animation ») */
	.anim .fenestra { opacity: 0; transform: translateY(26px); transition: opacity 0.9s var(--lent), transform 0.9s var(--lent); }
	.anim .fenestra.vist { opacity: 1; transform: none; }
	.anim .parla .costa { stroke-dashoffset: 1; transition: stroke-dashoffset 2s var(--lent); }
	.anim .parla.vist .costa { stroke-dashoffset: 0; }
	.anim .parla .estela { opacity: 0; transition: opacity 0.5s ease-out; transition-delay: calc(var(--i) * 4ms); }
	.anim .parla.vist .estela { opacity: 1; }
	.anim .camin-via { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s var(--lent); }
	.anim .apren.vist .camin-via { stroke-dashoffset: 0; }
	.anim .camin-fita { transform: scale(0); transition: transform 0.5s var(--lent); transition-delay: calc(var(--i, 0) * 160ms + 350ms); }
	.anim .apren.vist .camin-fita { transform: scale(1); }
	.anim .rets-arc { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.1s var(--lent); transition-delay: calc(var(--i) * 110ms); }
	.anim .amassa.vist .rets-arc { stroke-dashoffset: 0; }
	.anim .rets-flux { opacity: 0; }
	.anim .amassa.vist .rets-flux { opacity: 0.85; animation: fluir 1.1s linear infinite; animation-delay: calc(1.1s + var(--i) * 110ms); }
	.anim .rets-vila { transform: scale(0); transition: transform 0.6s var(--lent); transition-delay: calc(var(--i) * 70ms + 200ms); }
	.anim .amassa.vist .rets-vila { transform: scale(1); }
	@keyframes fluir { to { stroke-dashoffset: -7; } }

	.fenestra :focus-visible { outline: 2px solid var(--or); outline-offset: 3px; border-radius: 4px; }

	/* Téléphone : une colonne, le fil s'efface */
	@media (max-width: 820px) {
		.mur { grid-template-columns: 1fr; }
		.parla { grid-row: auto; min-height: 360px; }
		.apren, .amassa { grid-column: 1; grid-row: auto; }
		.fil { display: none; }
	}
	@media (prefers-reduced-motion: reduce) {
		.tres-mondes *, .tres-mondes *::before, .tres-mondes *::after { animation: none !important; transition: none !important; }
		.fil .trait { transform: none; }
	}
</style>
