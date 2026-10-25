<script>
	// Essai « Los tres mondes » (direction ambitieuse de l'accueil, 2026-10-25) :
	// les trois entités deviennent des fenêtres vivantes sur chaque monde, en
	// composition libre (pas une grille), tenues par le fil du ligam qui se noue
	// à l'appel. Prototype : la grande fenêtre Se parla, avec la carte en étoiles
	// « version allégée » (celle de /ensag/blanc, SVG + CSS, validée le 22-10)
	// vivante dedans ; S'apren et Amassa en aperçu, à bâtir ensuite.
	// Page de travail, non indexée. Aucun texte d'ambiance inventé : les phrases
	// sous les fenêtres sont des exemples, à écrire par Romain.
	import Crotz from '$lib/components/Crotz.svelte';
	import { ESTELAS, VISTA, COSTA_D } from '../blanc/donadas.js';

	// Sur fond sombre, la croix en or et rouge (recettes de Romain)
	const CROTZ = { traç: '#eeaf34', ponch: '#b53d17', moieu: '#eeaf34' };
</script>

<svelte:head>
	<title>Lo Ligam · essai « los tres mondes »</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet sageta()}<svg class="fl" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5" /></svg>{/snippet}

<div class="mondes">
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
					<p class="sota">Un camin, a ton ritme o amb ieu. <span class="ex">[exemple]</span></p>
				</div>
				<div class="apercu" aria-hidden="true">
					<svg viewBox="0 0 220 90" class="camin-apercu">
						<polyline points="14,76 70,60 120,34 206,16" pathLength="1" fill="none" stroke="#ffd98a" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.9" />
						<circle cx="14" cy="76" r="5" fill="#ffd98a" />
						<circle cx="120" cy="34" r="4" fill="#1f5f63" stroke="#ffd98a" stroke-width="2" />
						<circle cx="206" cy="16" r="4" fill="#1f5f63" stroke="#ffd98a" stroke-width="2" />
					</svg>
				</div>
				<span class="apbord">fenêtre à bâtir</span>
			</section>

			<!-- 03 Amassa : aperçu (fenêtre à bâtir ensuite) -->
			<section class="fenestra amassa">
				<div class="fen-cap">
					<span class="num">03</span>
					<h2>Amassa</h2>
					<p class="sota">De monde, de ligams, pertot. <span class="ex">[exemple]</span></p>
				</div>
				<div class="apercu" aria-hidden="true">
					<svg viewBox="0 0 220 90" class="rets-apercu">
						<g stroke="#ffd98a" stroke-width="1.2" stroke-opacity="0.55">
							<line x1="26" y1="70" x2="96" y2="40" /><line x1="96" y1="40" x2="150" y2="64" />
							<line x1="96" y1="40" x2="170" y2="26" /><line x1="26" y1="70" x2="70" y2="54" />
						</g>
						<g fill="#ffd98a">
							<circle cx="26" cy="70" r="4" /><circle cx="96" cy="40" r="5" /><circle cx="150" cy="64" r="4" />
							<circle cx="170" cy="26" r="4" /><circle cx="70" cy="54" r="3" />
						</g>
					</svg>
				</div>
				<span class="apbord">fenêtre à bâtir</span>
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
	.mur { position: relative; display: grid; grid-template-columns: 1.25fr 1fr; grid-template-rows: auto auto; gap: 18px 44px; view-timeline-name: --mur; view-timeline-axis: block; }
	.fil { position: absolute; top: 24px; bottom: -28px; left: calc(55.6% - 1px); width: 2px; z-index: 2; }
	.fil .trait { position: absolute; inset: 0; transform-origin: top; background: linear-gradient(#eeaf34, #eeaf34 92%, transparent); opacity: 0.8; }
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
	.carta { margin: 14px 0 0; flex: 1; display: flex; align-items: center; justify-content: center; }
	.carta svg { width: 100%; height: auto; display: block; }
	.costa { fill: none; stroke: var(--or-clar); stroke-opacity: 0.5; stroke-width: 1.2; stroke-linejoin: round;
		stroke-dasharray: 1; stroke-dashoffset: 1; animation: traçar 2.4s var(--lent) 0.3s forwards; }
	.estela { fill: #ffe6b8; fill-opacity: 0.6; opacity: 0; animation: lusir 0.6s ease-out forwards; animation-delay: calc(0.7s + var(--i) * 6ms); }
	.estela.vila { fill: #ffd98a; fill-opacity: 1; }
	.vila-nom { font: 400 12px/1 var(--font-body), sans-serif; fill: var(--crema); fill-opacity: 0.85; }
	@keyframes traçar { to { stroke-dashoffset: 0; } }
	@keyframes lusir { to { opacity: 1; } }

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
	.apel-titol { font-size: clamp(2.4rem, 7vw, 5rem); line-height: 0.98; margin: 10px 0 24px; }
	.brica { color: var(--or); }
	.boton { background: var(--brica); color: #fff; font-weight: 700; padding: 15px 28px; border-radius: 999px; display: inline-flex; align-items: center; gap: 10px; transition: transform 0.3s var(--lent), box-shadow 0.3s; }
	.boton:hover { transform: translateY(-2px); box-shadow: 0 10px 28px -14px var(--brica); }

	/* ——— Animations de défilement (sobres, une chose vivante par fenêtre) ——— */
	@keyframes obrir { from { opacity: 0; transform: translateY(26px); } }
	@keyframes tirar { from { transform: scaleY(0); } to { transform: scaleY(1); } }
	@keyframes nosar { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
	/* repli si le navigateur ne suit pas le défilement : une entrée douce, une fois */
	.fenestra { animation: obrir 0.9s var(--lent) both; }
	.apren { animation-delay: 0.12s; }
	.amassa { animation-delay: 0.24s; }
	/* quand le navigateur sait suivre le défilement : tout se joue au scroll */
	@supports (animation-timeline: view()) {
		.fenestra { animation: obrir auto linear both; animation-timeline: view(); animation-range: entry 6% cover 34%; animation-delay: 0s; }
		/* le fil se tire au rythme de la zone des fenêtres, le nœud se serre quand l'appel entre */
		.fil .trait { transform: scaleY(0); animation: tirar auto linear both; animation-timeline: --mur; animation-range: entry 10% exit 85%; }
		.nos path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: nosar auto linear both; animation-timeline: view(); animation-range: entry 0% cover 45%; }
		/* la carte en étoiles se trace en entrant dans l'écran */
		.parla .costa { animation: traçar auto linear forwards; animation-timeline: view(); animation-range: entry 10% cover 50%; }
		.parla .estela { animation: lusir auto linear forwards; animation-timeline: view(); animation-range: entry calc(20% + var(--i) * 0.12%) cover calc(46% + var(--i) * 0.12%); }
		/* le chemin de S'apren se dessine en entrant */
		.camin-apercu polyline { stroke-dasharray: 1; stroke-dashoffset: 1; animation: traçar auto linear both; animation-timeline: view(); animation-range: entry 16% cover 60%; }
	}

	@media (max-width: 820px) {
		.mur { grid-template-columns: 1fr; }
		.parla { grid-row: auto; min-height: 380px; }
		.apren, .amassa { grid-column: 1; grid-row: auto; }
		.fil { display: none; }
	}
	@media (prefers-reduced-motion: reduce) {
		.mondes *, .mondes *::before, .mondes *::after { animation: none !important; transition: none !important; }
		.costa { stroke-dashoffset: 0; }
		.estela { opacity: 1; }
		.fil .trait { transform: none; }
		.nos path { stroke-dashoffset: 0; }
		.camin-apercu polyline { stroke-dashoffset: 0; }
		.fenestra { opacity: 1; transform: none; }
	}
</style>
