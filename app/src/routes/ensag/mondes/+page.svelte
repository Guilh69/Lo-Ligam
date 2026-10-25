<script>
	// Essai « Los tres mondes » (direction ambitieuse de l'accueil, 2026-10-25) :
	// les trois entités deviennent des fenêtres vivantes sur chaque monde, en
	// composition libre (pas une grille), tenues par le fil du ligam qui se noue
	// à l'appel. Prototype : la grande fenêtre Se parla, avec la carte en étoiles
	// « version allégée » (celle de /ensag/blanc, SVG + CSS, validée le 22-10)
	// vivante dedans ; S'apren et Amassa en aperçu, à bâtir ensuite.
	// Page de travail, non indexée. Aucun texte d'ambiance inventé : les phrases
	// sous les fenêtres sont des exemples, à écrire par Romain.
	import { onMount } from 'svelte';
	import Crotz from '$lib/components/Crotz.svelte';
	import { ESTELAS, VISTA, COSTA_D } from '../blanc/donadas.js';
	import { AMASSA } from '$lib/acuelh/amassa.js';

	// Sur fond sombre, la croix en or et rouge (recettes de Romain)
	const CROTZ = { traç: '#eeaf34', ponch: '#b53d17', moieu: '#eeaf34' };

	// Les animations de défilement en JavaScript (observateur + progression), pour
	// qu'elles marchent dans tous les navigateurs : l'« animation-timeline » CSS
	// n'est pas encore suivie partout (Firefox, Safari anciens). Rien ne bouge si
	// l'écran demande moins d'animation, et tout est déjà visible sans JavaScript.
	let racina;
	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		racina.classList.add('anim');

		// chaque fenêtre se révèle quand elle entre à l'écran
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

		// le fil se tire, le nœud se serre, la carte flotte (parallaxe) au défilement
		const mur = racina.querySelector('.mur');
		const carta = racina.querySelector('.carta');
		let af = 0;
		const maj = () => {
			af = 0;
			const r = mur.getBoundingClientRect();
			const h = window.innerHeight;
			const p = Math.min(1, Math.max(0, (h - r.top) / (h + r.height)));
			racina.style.setProperty('--fil', Math.min(1, p * 1.3).toFixed(3));
			racina.style.setProperty('--knot', (1 - Math.min(1, Math.max(0, (p - 0.72) / 0.22))).toFixed(3));
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

<svelte:head>
	<title>Lo Ligam · essai « los tres mondes »</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet sageta()}<svg class="fl" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5" /></svg>{/snippet}

<div class="mondes" bind:this={racina}>
	<header class="cap">
		<a class="marca" href="/"><Crotz talha={30} {...CROTZ} />Lo Ligam</a>
		<span class="esc">Essai · los tres mondes</span>
	</header>

	<main>
		<p class="kicker">L’occitan</p>
		<h1 class="titol">Se parla. S’apren. <span class="or">Amassa.</span></h1>

		<div class="mur">
			<span class="fil" aria-hidden="true"><i class="trait"></i></span>

			<!-- 01 Se parla : la fenêtre vivante, avec la carte en étoiles -->
			<section class="fenestra granda parla">
				<div class="fen-cap">
					<span class="num">01</span>
					<h2>Se parla</h2>
					<p class="sota">Lo país e sas lengas, en carta d’estelas. <span class="ex">[exemple]</span></p>
				</div>
				<figure class="carta">
					<svg viewBox={VISTA} role="img" aria-label="La carta en estelas">
						<path class="costa" d={COSTA_D} pathLength="1" />
						{#each ESTELAS as e, i (e.nom + i)}
							<circle class="estela" class:vila={e.vila} cx={e.x} cy={e.y} r={e.vila ? 4 : 2} style="--i: {i}" />
							{#if e.vila}<text class="vila-nom" x={e.x + 8} y={e.y + 4}>{e.nom}</text>{/if}
						{/each}
					</svg>
				</figure>
				<a class="dintrar" href="/parla">Dintrar {@render sageta()}</a>
			</section>

			<!-- 02 S'apren : aperçu (fenêtre à bâtir ensuite) -->
			<section class="fenestra apren">
				<div class="fen-cap">
					<span class="num">02</span>
					<h2>S’apren</h2>
					<p class="sota">Un camin, pas a pas, a ton ritme. <span class="ex">[exemple]</span></p>
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
				<a class="dintrar" href="/apren">Dintrar {@render sageta()}</a>
			</section>

			<!-- 03 Amassa : aperçu (fenêtre à bâtir ensuite) -->
			<section class="fenestra amassa">
				<div class="fen-cap">
					<span class="num">03</span>
					<h2>Amassa</h2>
					<p class="sota">De monde, de ligams, pertot. <span class="ex">[exemple]</span></p>
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
				<a class="dintrar" href="/amassa">Dintrar {@render sageta()}</a>
			</section>
		</div>

		<!-- L'appel : le fil se noue -->
		<div class="apel">
			<svg class="nos" viewBox="0 0 48 60" aria-hidden="true">
				<path d="M24 0V18" pathLength="1" fill="none" stroke="#eeaf34" stroke-width="2" />
				<path d="M24 18c-13 0-13 20 0 20s13-20 0-20" pathLength="1" fill="none" stroke="#eeaf34" stroke-width="2" />
				<path d="M24 38v8" pathLength="1" fill="none" stroke="#eeaf34" stroke-width="2" />
			</svg>
			<h2 class="apel-titol">Prèst·a per <span class="brica">començar ?</span></h2>
			<a class="boton" href="/apren/visio">Reservar un primièr cors {@render sageta()}</a>
		</div>
	</main>
</div>

<style>
	.mondes {
		--fons: #1a0f0a;
		--fons-2: #241310;
		--crema: #fbf1e1;
		--crema-2: #d8c3a0;
		--or: #eeaf34;
		--or-clar: #f0c877;
		--brica: #b53d17;
		--marge: clamp(16px, 4vw, 56px);
		--lent: cubic-bezier(0.22, 1, 0.36, 1);
		min-height: 100vh;
		background: radial-gradient(ellipse 80% 60% at 50% -10%, #3a190f, transparent 60%), var(--fons);
		color: var(--crema);
		font: 400 1.125rem/1.5 var(--font-body), system-ui, sans-serif;
		font-synthesis: none;
		overflow-x: clip;
	}
	.mondes a { color: inherit; text-decoration: none; }
	.mondes h1, .mondes h2 { font-family: var(--font-heading), serif; font-weight: 400; margin: 0; }

	.cap { display: flex; align-items: center; justify-content: space-between; padding: 20px var(--marge); }
	.marca { display: inline-flex; align-items: center; gap: 12px; font: 400 1.25rem/1 var(--font-heading), serif; }
	.marca :global(svg) { transition: transform 0.8s var(--lent); }
	.marca:hover :global(svg) { transform: rotate(45deg); }
	.esc { font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--crema-2); }

	main { max-width: 1100px; margin: 0 auto; padding: clamp(24px, 6vh, 64px) var(--marge) 96px; }
	.kicker { display: flex; align-items: center; gap: 14px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--or); margin: 0 0 18px; }
	.kicker::before { content: ''; width: 48px; height: 1px; background: currentColor; }
	.titol { font-size: clamp(2.6rem, 6vw, 4.6rem); line-height: 1.0; letter-spacing: -0.01em; margin-bottom: clamp(28px, 5vh, 52px); }
	.titol .or { color: var(--or); }

	/* La composition libre : une grande fenêtre à gauche, deux à droite ; le fil
	   du ligam descend dans la gouttière */
	.mur { position: relative; display: grid; grid-template-columns: 1.25fr 1fr; grid-template-rows: auto auto; gap: 18px 44px; }
	.fil { position: absolute; top: 24px; bottom: -28px; left: calc(55.6% - 1px); width: 2px; z-index: 2; }
	.fil .trait { position: absolute; inset: 0; transform-origin: top; transform: scaleY(var(--fil, 1)); background: linear-gradient(#eeaf34, #eeaf34 92%, transparent); opacity: 0.8; }
	.fil::before, .fil::after { content: ''; position: absolute; left: 50%; width: 11px; height: 11px; margin-left: -5.5px; border-radius: 50%; background: var(--or); }
	.fil::before { top: 22%; }
	.fil::after { top: 70%; }

	.fenestra { position: relative; border-radius: 14px; padding: 22px; overflow: clip; display: flex; flex-direction: column; min-width: 0; }
	.fenestra::before { content: ''; position: absolute; inset: 10px; border: 1px solid rgba(238, 175, 52, 0.4); border-radius: 10px; pointer-events: none; }
	.parla { grid-row: 1 / 3; background: #a5342a; min-height: 440px; }
	.apren { grid-column: 2; grid-row: 1; background: #1f5f63; }
	.amassa { grid-column: 2; grid-row: 2; background: #6b3a5b; }

	.fen-cap .num { font-family: var(--font-heading), serif; font-size: 1.2rem; color: var(--or-clar); }
	.fen-cap h2 { font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1; margin-top: 2px; }
	.granda .fen-cap h2 { font-size: clamp(2.4rem, 4vw, 3.4rem); }
	.sota { font-size: 0.95rem; color: var(--crema); opacity: 0.9; margin-top: 8px; max-width: 32ch; }
	.ex { color: var(--or-clar); font-style: italic; opacity: 0.8; font-size: 0.82em; }

	/* La carte en étoiles, vivante (reprise de /ensag/blanc, couleurs pour fond sombre) */
	.carta { margin: 14px 0 0; flex: 1; display: flex; align-items: center; justify-content: center; transform: translateY(var(--para, 0)); will-change: transform; }
	.carta svg { width: 100%; height: auto; display: block; }
	.costa { fill: none; stroke: var(--or-clar); stroke-opacity: 0.5; stroke-width: 1.2; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
	.estela { fill: #ffe6b8; fill-opacity: 0.6; }
	.estela.vila { fill: #ffd98a; fill-opacity: 1; }
	.vila-nom { font: 400 12px/1 var(--font-body), sans-serif; fill: var(--crema); fill-opacity: 0.85; }

	.dintrar { margin-top: 14px; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; width: fit-content; padding-bottom: 2px; border-bottom: 2px solid var(--or); }
	.fl { width: 1em; height: 1em; transition: transform 0.4s var(--lent); }
	.dintrar:hover .fl { transform: translateX(4px); }

	/* Les deux aperçus : légers, pour montrer la composition */
	.apren, .amassa { min-height: 200px; }
	.apercu { flex: 1; display: flex; align-items: center; justify-content: center; margin-top: 10px; }
	.apercu svg { width: min(220px, 80%); height: auto; }
	.apbord { position: absolute; right: 16px; bottom: 14px; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--crema); opacity: 0.6; }

	/* L'appel : le fil se noue, puis le bouton */
	.apel { display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 8px; padding-top: 24px; }
	.nos { width: 40px; height: 50px; }
	.nos path { stroke-dasharray: 1; stroke-dashoffset: var(--knot, 0); }
	.apel-titol { font-size: clamp(2.4rem, 7vw, 5rem); line-height: 0.98; margin: 10px 0 24px; }
	.brica { color: var(--or); }
	.boton { background: var(--brica); color: #fff; font-weight: 700; padding: 15px 28px; border-radius: 999px; display: inline-flex; align-items: center; gap: 10px; transition: transform 0.3s var(--lent), box-shadow 0.3s; }
	.boton:hover { transform: translateY(-2px); box-shadow: 0 10px 28px -14px var(--brica); }

	/* ——— Animations de défilement (JavaScript : observateur + progression) ———
	   Sobres : une chose vivante par fenêtre. La classe « anim » est posée par le
	   script quand l'écran accepte le mouvement ; sans JavaScript ou en « moins
	   d'animation », tout reste visible et immobile. Le fil (--fil), le nœud
	   (--knot) et la parallaxe (--para) sont mis à jour au défilement. */
	.anim .fenestra { opacity: 0; transform: translateY(26px); transition: opacity 0.9s var(--lent), transform 0.9s var(--lent); }
	.anim .fenestra.vist { opacity: 1; transform: none; }
	.anim .parla .costa { stroke-dashoffset: 1; transition: stroke-dashoffset 2s var(--lent); }
	.anim .parla.vist .costa { stroke-dashoffset: 0; }
	.anim .parla .estela { opacity: 0; transition: opacity 0.5s ease-out; transition-delay: calc(var(--i) * 4ms); }
	.anim .parla.vist .estela { opacity: 1; }
	/* S'apren : le chemin et ses jalons */
	.camin { margin: 12px 0 0; flex: 1; display: flex; align-items: center; justify-content: center; }
	.camin svg { width: 100%; height: auto; max-height: 150px; }
	.camin-fita { fill: #1f5f63; stroke: #ffd98a; stroke-width: 2.4; transform-box: fill-box; transform-origin: center; }
	.camin-fin { fill: #ffd98a; }
	/* Amassa : le domaine, les liaisons, le flux, les villes (donnée réelle) */
	.rets { margin: 10px 0 0; flex: 1; display: flex; align-items: center; justify-content: center; }
	.rets svg { width: 100%; height: auto; max-height: 172px; }
	.rets-domeni { fill: color-mix(in srgb, #ffd98a 8%, transparent); stroke: rgba(238, 175, 52, 0.4); stroke-width: 0.8; stroke-linejoin: round; }
	.rets-arc { fill: none; stroke: #ffd98a; stroke-width: 1; opacity: 0.4; }
	.rets-flux { fill: none; stroke: #fff; stroke-width: 2; stroke-dasharray: 0 7; stroke-linecap: round; opacity: 0.85; }
	.rets-vila { fill: #ffd98a; transform-box: fill-box; transform-origin: center; }
	/* révélation au défilement (sinon tout est déjà visible, immobile) */
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

	@media (max-width: 820px) {
		.mur { grid-template-columns: 1fr; }
		.parla { grid-row: auto; min-height: 380px; }
		.apren, .amassa { grid-column: 1; grid-row: auto; }
		.fil { display: none; }
	}
	@media (prefers-reduced-motion: reduce) {
		.mondes *, .mondes *::before, .mondes *::after { animation: none !important; transition: none !important; }
		.fil .trait { transform: none; }
		.nos path { stroke-dashoffset: 0; }
	}
</style>
