<script>
	// Le milieu de l'accueil — les trois entités (Se parla, S'apren, Amassa) — en
	// TROIS variantes à comparer (Romain, 2026-10-25), à la place des sections
	// 01/02/03. Le haut (héros + carte) et le récit (manifeste, troubadour, appel)
	// ne changent pas. Textes et visuels partagés entre les variantes.
	//   - 'jalons'    : les sections numérotées de l'accueil, enrichies d'un visuel (piste 2)
	//   - 'blocs'     : trois bandes de couleur plates, fondues dans la braise (piste 3)
	//   - 'chapitres' : chaque entité sur un écran, visuel immersif (piste 5)
	// Prototypes : les phrases sous les titres sont des exemples descriptifs.
	import { onMount } from 'svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { PLAN } from '$lib/data/planSite.js';
	import { AMASSA } from '$lib/acuelh/amassa.js';
	import { ESTELAS, VISTA, COSTA_D } from '../../routes/ensag/blanc/donadas.js';

	let { varianta = 'jalons' } = $props();
	let fr = $derived(langStore.current === 'fr');
	const [PARLA, APREN, VIU] = PLAN;
	const DINTRAR = { oc: 'Dintrar', fr: 'Entrer' };
	// couleurs un peu profondes, pour rester dans le ton chaud de la braise
	const ENTITATS = [
		{ sec: PARLA, vis: 'carta', color: '#93301a', sota: { oc: 'Lo país e sas lengas, en carta d’estelas.', fr: 'Le pays et ses langues, en carte d’étoiles.' } },
		{ sec: APREN, vis: 'camin', color: '#1b5256', sota: { oc: 'Un camin, pas a pas, a ton ritme.', fr: 'Un chemin, pas à pas, à ton rythme.' } },
		{ sec: VIU, vis: 'rets', color: '#5a3350', sota: { oc: 'De monde, de ligams, pertot.', fr: 'Des gens, des liens, partout.' } }
	];
	// la couleur de la section précédente, pour fondre les passages (la 1re part de la braise)
	const colorPrec = (i) => (i === 0 ? 'transparent' : ENTITATS[i - 1].color);
	const portas = (sec) => sec.grops.flatMap((g) => g.items);

	let racina;
	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		racina.classList.add('anim');
		const io = new IntersectionObserver(
			(ls) => {
				for (const l of ls)
					if (l.isIntersecting) {
						l.target.classList.add('vist');
						io.unobserve(l.target);
					}
			},
			{ threshold: 0.25 }
		);
		racina.querySelectorAll('[data-revela]').forEach((el) => io.observe(el));
		return () => io.disconnect();
	});
</script>

{#snippet sageta()}<svg class="fl" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5" /></svg>{/snippet}

{#snippet visual(type, gran)}
	{#if type === 'carta'}
		<svg class="vis carta" class:gran viewBox={VISTA} role="img" aria-hidden="true">
			<path class="costa" d={COSTA_D} pathLength="1" />
			{#each ESTELAS as e, i (e.nom + i)}
				<circle class="estela" class:vila={e.vila} cx={e.x} cy={e.y} r={e.vila ? 4 : 2} style="--i: {i}" />
				{#if e.vila && gran}<text class="vila-nom" x={e.x + 8} y={e.y + 4}>{e.nom}</text>{/if}
			{/each}
		</svg>
	{:else if type === 'camin'}
		<svg class="vis camin" class:gran viewBox="0 0 260 140" role="img" aria-hidden="true">
			<path class="camin-via" d="M22 120 C 70 120 66 88 108 84 S 168 70 178 44 S 214 24 238 20" pathLength="1" fill="none" stroke="#ffd98a" stroke-width="2.6" stroke-linecap="round" stroke-opacity="0.85" />
			<circle class="camin-fita" cx="22" cy="120" r="6" style="--i: 0" />
			<circle class="camin-fita" cx="108" cy="84" r="5" style="--i: 1" />
			<circle class="camin-fita" cx="178" cy="44" r="5" style="--i: 2" />
			<circle class="camin-fita camin-fin" cx="238" cy="20" r="6.5" style="--i: 3" />
		</svg>
	{:else}
		<svg class="vis rets" class:gran viewBox="0 0 400 300" role="img" aria-hidden="true">
			<path class="rets-domeni" d={AMASSA.contorn} />
			{#each AMASSA.arcs as d, i (d)}
				<path class="rets-arc" {d} pathLength="1" style="--i: {i}" />
				<path class="rets-flux" {d} style="--i: {i}" />
			{/each}
			{#each AMASSA.vilas as [x, y], i (i)}
				<circle class="rets-vila" cx={x} cy={y} r="4" style="--i: {i}" />
			{/each}
		</svg>
	{/if}
{/snippet}

{#snippet lligams(sec)}
	<p class="portas">
		{#each portas(sec) as it, k (it.href)}{#if k}<span aria-hidden="true">·</span>{/if}<a
				href={it.href}
				target={it.defòra ? '_blank' : undefined}
				rel={it.defòra ? 'noopener' : undefined}>{fr ? it.fr : it.oc}</a
			>{/each}
	</p>
{/snippet}

<section class="mieg" data-varianta={varianta} bind:this={racina} aria-label={fr ? 'Les trois rubriques' : 'Las tres rubricas'}>
	{#if varianta === 'jalons'}
		{#each ENTITATS as e, i (e.sec.id)}
			<section class="jalon-ent" data-revela>
				<h2 class="jalon-cap"><b>{e.sec.n}</b><span>{fr ? e.sec.fr : e.sec.oc}</span></h2>
				<div class="jalon-cors">
					<div class="jalon-tèxt">
						<p class="sota">{fr ? e.sota.fr : e.sota.oc}</p>
						{@render lligams(e.sec)}
						<a class="dintrar" href={e.sec.href}>{fr ? DINTRAR.fr : DINTRAR.oc} {@render sageta()}</a>
					</div>
					<figure class="jalon-vis">{@render visual(e.vis, false)}</figure>
				</div>
			</section>
		{/each}
	{:else if varianta === 'blocs'}
		{#each ENTITATS as e, i (e.sec.id)}
			<section class="banda" data-revela style="--color: {e.color}; --color-prec: {colorPrec(i)}">
				<div class="banda-in">
					<div class="banda-cap"><b>{e.sec.n}</b><span>{fr ? e.sec.fr : e.sec.oc}</span></div>
					<p class="sota">{fr ? e.sota.fr : e.sota.oc}</p>
					{@render lligams(e.sec)}
					<a class="dintrar clar" href={e.sec.href}>{fr ? DINTRAR.fr : DINTRAR.oc} {@render sageta()}</a>
				</div>
			</section>
		{/each}
	{:else}
		{#each ENTITATS as e, i (e.sec.id)}
			<section class="chapitre" data-revela style="--color: {e.color}; --color-prec: {colorPrec(i)}">
				<div class="chap-in">
					<div class="chap-tèxt">
						<h2 class="chap-cap"><b>{e.sec.n}</b><span>{fr ? e.sec.fr : e.sec.oc}</span></h2>
						<p class="sota">{fr ? e.sota.fr : e.sota.oc}</p>
						<a class="dintrar clar" href={e.sec.href}>{fr ? DINTRAR.fr : DINTRAR.oc} {@render sageta()}</a>
					</div>
					<figure class="chap-vis">{@render visual(e.vis, true)}</figure>
				</div>
			</section>
		{/each}
	{/if}
</section>

<style>
	.mieg { --or: #eeaf34; --or-clar: #f0c877; --crema: #fbf1e1; --lent: cubic-bezier(0.22, 1, 0.36, 1); display: block; }
	.mieg a { color: inherit; text-decoration: none; }
	.sota { font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.5; color: var(--crema); opacity: 0.92; max-width: 34ch; margin: 0; }
	.portas { margin: 0.9rem 0 0; font-size: 0.95rem; line-height: 1.8; color: var(--crema); }
	.portas span { margin-inline: 0.5em; color: var(--or); opacity: 0.7; }
	.portas a { padding-bottom: 2px; background: linear-gradient(var(--or), var(--or)) 0 100% / 0 1.5px no-repeat; transition: background-size 0.5s var(--lent); }
	.portas a:hover, .portas a:focus-visible { background-size: 100% 1.5px; }
	.dintrar { display: inline-flex; align-items: center; gap: 8px; margin-top: 1.1rem; font-weight: 700; color: var(--crema); border-bottom: 2px solid var(--t-accion, #b53d17); padding-bottom: 2px; }
	.dintrar.clar { border-bottom-color: var(--or); }
	.fl { width: 1em; height: 1em; transition: transform 0.4s var(--lent); }
	.dintrar:hover .fl { transform: translateX(4px); }

	/* visuels partagés */
	.vis { width: 100%; height: auto; display: block; }
	.costa { fill: none; stroke: var(--or-clar); stroke-opacity: 0.5; stroke-width: 1.2; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
	.estela { fill: #ffe6b8; fill-opacity: 0.6; }
	.estela.vila { fill: #ffd98a; fill-opacity: 1; }
	.vila-nom { font: 400 12px/1 var(--font-body), sans-serif; fill: var(--crema); fill-opacity: 0.85; }
	.camin-fita { fill: #123; stroke: #ffd98a; stroke-width: 2.4; transform-box: fill-box; transform-origin: center; }
	.camin-fin { fill: #ffd98a; }
	.rets-domeni { fill: color-mix(in srgb, #ffd98a 8%, transparent); stroke: rgba(238, 175, 52, 0.4); stroke-width: 0.8; stroke-linejoin: round; }
	.rets-arc { fill: none; stroke: #ffd98a; stroke-width: 1; opacity: 0.4; }
	.rets-flux { fill: none; stroke: #fff; stroke-width: 2; stroke-dasharray: 0 7; stroke-linecap: round; opacity: 0.85; }
	.rets-vila { fill: #ffd98a; transform-box: fill-box; transform-origin: center; }

	/* ——— Piste 2 : jalons enrichis (grammaire de l'accueil) ——— */
	.jalon-ent { padding: 10vh var(--marge); }
	.jalon-cap { position: relative; display: flex; align-items: baseline; gap: 1rem; margin: 0 0 var(--esp-32, 2rem); padding-top: 1.4rem; }
	.jalon-cap::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, var(--or), color-mix(in srgb, var(--or) 30%, transparent) 45%, transparent); transform-origin: left; transform: scaleX(0); transition: transform 1.3s var(--lent); }
	.jalon-ent.vist .jalon-cap::before { transform: scaleX(1); }
	.jalon-cap b { font-family: var(--font-heading), serif; font-weight: 400; font-size: clamp(2.2rem, 4vw, 3.4rem); line-height: 1; color: transparent; -webkit-text-stroke: 1px var(--or); }
	.jalon-cap span { font-family: var(--font-heading), serif; font-weight: 400; font-size: clamp(1.8rem, 3vw, 2.6rem); color: var(--crema); }
	.jalon-cors { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr); gap: clamp(1.5rem, 4vw, 4rem); align-items: center; }
	.jalon-vis { margin: 0; max-width: 360px; justify-self: end; }
	@media (max-width: 820px) { .jalon-cors { grid-template-columns: 1fr; } .jalon-vis { max-width: 260px; } }

	/* ——— Piste 3 : blocs fondus (bandes de couleur plates) ——— */
	.banda { position: relative; background: var(--color); }
	/* le haut de chaque bande se fond depuis la couleur précédente (ou la braise pour la 1re) */
	.banda::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 120px; background: linear-gradient(to bottom, var(--color-prec, transparent), var(--color)); }
	/* la dernière bande ressort en douceur vers la braise */
	.banda:last-child::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 130px; background: linear-gradient(to top, transparent, var(--color)); }
	.banda-in { position: relative; z-index: 1; max-width: calc(72rem + 2 * var(--marge)); margin: 0 auto; padding: clamp(3.4rem, 7vh, 5.5rem) var(--marge); }
	.banda-cap { display: flex; align-items: baseline; gap: 0.8rem; }
	.banda-cap b { font-family: var(--font-heading), serif; font-weight: 400; font-size: clamp(2rem, 3vw, 3rem); line-height: 1; color: var(--crema); opacity: 0.85; }
	.banda-cap span { font-family: var(--font-heading), serif; font-weight: 400; font-size: clamp(2rem, 4vw, 3.4rem); color: var(--crema); }
	.banda .sota { margin-top: 0.6rem; }

	/* ——— Piste 5 : chapitres plein écran ——— */
	.chapitre { position: relative; min-height: 100svh; display: grid; place-items: center; background: var(--color); }
	/* chaque chapitre émerge en douceur de la couleur précédente (ou de la braise) ; le dernier ressort vers la braise */
	.chapitre::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 28vh; background: linear-gradient(to bottom, var(--color-prec, transparent), var(--color)); }
	.chapitre:last-child::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 26vh; background: linear-gradient(to top, transparent, var(--color)); }
	.chap-in { position: relative; z-index: 1; width: 100%; max-width: calc(72rem + 2 * var(--marge)); padding: 8vh var(--marge); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(2rem, 5vw, 5rem); align-items: center; }
	.chap-cap { display: flex; align-items: baseline; gap: 1rem; margin: 0 0 1.2rem; }
	.chap-cap b { font-family: var(--font-heading), serif; font-weight: 400; font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1; color: var(--crema); opacity: 0.8; }
	.chap-cap span { font-family: var(--font-heading), serif; font-weight: 400; font-size: clamp(3rem, 7vw, 6rem); line-height: 0.95; color: var(--crema); }
	.chap-vis { margin: 0; }
	.chapitre .sota { font-size: clamp(1.1rem, 1.8vw, 1.5rem); max-width: 30ch; }
	@media (max-width: 820px) { .chap-in { grid-template-columns: 1fr; text-align: left; } }

	/* ——— Révélation au défilement (classe « anim » posée hors « moins d'animation ») ——— */
	.anim [data-revela] { opacity: 0; transform: translateY(26px); transition: opacity 0.9s var(--lent), transform 0.9s var(--lent); }
	.anim [data-revela].vist { opacity: 1; transform: none; }
	.anim .vist .costa { stroke-dashoffset: 1; animation: traçar 1.8s var(--lent) 0.2s forwards; }
	.anim .vist .camin-via { stroke-dasharray: 1; stroke-dashoffset: 1; animation: traçar 1.4s var(--lent) 0.2s forwards; }
	.anim .vist .rets-flux { animation: fluir 1.1s linear infinite; }
	@keyframes traçar { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
	@keyframes fluir { to { stroke-dashoffset: -7; } }
	@media (prefers-reduced-motion: reduce) {
		.mieg *, .mieg *::before, .mieg *::after { animation: none !important; transition: none !important; }
	}
</style>
