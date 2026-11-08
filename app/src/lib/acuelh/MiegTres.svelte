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
	import { tria } from '$lib/stores/lang.svelte.js';
	import { PLAN } from '$lib/data/planSite.js';
	import PastilleAviat from '$lib/components/PastilleAviat.svelte';
	import { AMASSA } from '$lib/acuelh/amassa.js';
	import CaminCrotz from '$lib/acuelh/CaminCrotz.svelte';
	import { ESTELAS, VISTA, COSTA_D } from '../../routes/ensag/blanc/donadas.js';
	import { txt, lista } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';

	const [PARLA, APREN, VIU] = PLAN;
	const DINTRAR = { oc: 'Dintrar', fr: 'Entrer', es: 'Entrar', en: 'Enter', ca: 'Entrar', ar: 'ادخل' };
	// accent = couleur claire qui ressort sur la braise (numéro et lueur de chaque bloc)
	const ENTITATS = [
		{ sec: PARLA, vis: 'carta', accent: '#d2542c', sota: { oc: 'Descobrís la geografia occitana e las produccions en lenga nòstra.', fr: 'Découvre la géographie occitane et les productions en lenga nòstra.', es: 'Descubre la geografía occitana y las producciones en lenga nòstra.', en: 'Discover Occitan geography and works created in lenga nòstra.', ca: 'Descobreix la geografia occitana i les produccions en lenga nòstra.', ar: 'اكتشاف جغرافيا أوكسيتانيا والأعمال الإبداعية بلغة lenga nòstra.' } },
		{ sec: APREN, vis: 'camin', accent: '#3bb0a3', sota: { oc: 'Descobrís, apren e practica la lenga a ta manièra.', fr: 'Découvre, apprends et pratique la langue à ta manière.', es: 'Descubre, aprende y practica la lengua a tu manera.', en: 'Discover, learn and practise the language your way.', ca: 'Descobreix, aprèn i practica la llengua a la teva manera.', ar: 'اكتشاف اللغة وتعلّمها وممارستها بطريقتك.' } },
		{ sec: VIU, vis: 'rets', accent: '#c974a6', sota: { oc: 'Crèa ligam amb lo mond occitan.', fr: 'Crée du lien avec le monde occitan.', es: 'Crea vínculos con el mundo occitano.', en: 'Create connections with the Occitan world.', ca: 'Crea vincles amb el món occità.', ar: 'بناء علاقات مع العالم الأوكسيتاني.' } }
	];

	// Contenu riche RÉUTILISÉ de l'accueil actuel : les chiffres (acuelh.chifras) et
	// les trois façons (acuelh.biais) sont déjà des éléments modifiables ; on les lit.
	const LENGAS = ['Français', 'English', 'Castellano', 'Català'];
	// la phrase sous le titre : l'élément modifiable, sinon l'exemple du composant
	const sotaTxt = (id, fallback) => {
		const t = txt(`acuelh.mondes.${id}.sota`);
		return tria(t) || tria(fallback);
	};
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

		// mouvement fluide (piste Système) : chaque grand visuel dérive un peu au défilement
		const visuals = racina.querySelectorAll('.sist-vis');
		let af = 0;
		const maj = () => {
			af = 0;
			const h = window.innerHeight;
			visuals.forEach((el) => {
				const r = el.getBoundingClientRect();
				const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - h / 2) / h)); // ≈ -1 (haut) … 1 (bas)
				el.style.setProperty('--para', (p * -26).toFixed(1) + 'px');
			});
		};
		const aScroll = () => { if (!af) af = requestAnimationFrame(maj); };
		if (visuals.length) {
			addEventListener('scroll', aScroll, { passive: true });
			addEventListener('resize', aScroll, { passive: true });
			maj();
		}
		return () => {
			io.disconnect();
			removeEventListener('scroll', aScroll);
			removeEventListener('resize', aScroll);
			if (af) cancelAnimationFrame(af);
		};
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
		<CaminCrotz variant="hybride" {gran} />
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
		{#each portas(sec) as it, k (it.href)}{#if k}<span aria-hidden="true">·</span><wbr />{/if}{#if it.aviat}<em class="aviat-it">{tria(it)}<PastilleAviat /></em>{:else}<a
				href={it.href}
				target={it.defòra ? '_blank' : undefined}
				rel={it.defòra ? 'noopener' : undefined}>{tria(it)}</a
				>{/if}{/each}
	</p>
{/snippet}

<!-- Contenu riche par entité (variante « Combiné ») : chiffres, trois façons, langues -->
{#snippet extra(id)}
	{#if id === 'parla'}
		<dl class="mix-chifras">
			{#each lista('acuelh.chifras') as c (c.clau)}
				{@const nom = txt(c.clau + '.nom')}
				<div use:editar={c.clau}>
					<dt dir="ltr" use:editar={c.clau + '.num'}>{txt(c.clau + '.num').oc}</dt>
					<dd use:editar={c.clau + '.nom'}>{tria(nom)}</dd>
				</div>
			{/each}
		</dl>
	{:else if id === 'apren'}
		<ul class="mix-biais">
			{#each lista('acuelh.biais') as b, i (b.clau)}
				{@const titol = txt(b.clau + '.titol')}
				<li><span class="mix-n">{['I', 'II', 'III', 'IV', 'V', 'VI'][i] ?? i + 1}</span><span use:editar={b.clau + '.titol'}>{tria(titol)}</span></li>
			{/each}
		</ul>
		<p class="mix-lengas-cap">{tria({ oc: 'Aprene dempuèi :', fr: 'Apprendre depuis :', es: 'Aprender desde:', en: 'Learn from:', ca: 'Aprendre des de:', ar: 'تعلّم انطلاقًا من:' })}</p>
		<div class="mix-lengas">{#each LENGAS as l (l)}<span>{l}</span>{/each}</div>
	{/if}
{/snippet}

<section class="mieg" bind:this={racina} aria-label={tria({ oc: 'Las tres rubricas', fr: 'Les trois rubriques', es: 'Las tres secciones', en: 'The three sections', ca: 'Les tres seccions', ar: 'الأقسام الثلاثة' })}>
		{#each ENTITATS as e, i (e.sec.id)}
			<section class="sistema-ent" data-revela class:invers={i % 2 === 1} class:sec-camin={e.vis === 'camin'} style="--color: {e.accent}">
				<div class="sist-cors">
					<div class="sist-gauche">
						<div class="sist-cap">
							<span class="sist-num">{e.sec.n}</span>
							<h2>{tria(e.sec)}</h2>
						</div>
						<div class="sist-tèxt">
							<p class="sota" use:editar={`acuelh.mondes.${e.sec.id}.sota`}>{sotaTxt(e.sec.id, e.sota)}</p>
							{@render extra(e.sec.id)}
							{@render lligams(e.sec)}
							<a class="dintrar" href={e.sec.href}>{tria(DINTRAR)} {@render sageta()}</a>
						</div>
					</div>
					<figure class="sist-vis">{@render visual(e.vis, true)}</figure>
				</div>
			</section>
		{/each}
</section>

<style>
	.mieg { --or: #eeaf34; --or-clar: #f0c877; --crema: #fbf1e1; --lent: cubic-bezier(0.22, 1, 0.36, 1); display: block; }
	.mieg a { color: inherit; text-decoration: none; }
	/* balance : plus de mot seul sur la dernière ligne (« manièra. »), relecture de Joan du 2026-11-03 */
	.sota { font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.5; color: var(--crema); opacity: 0.92; max-width: 34ch; margin: 0; text-wrap: balance; }
	.portas { margin: 0.9rem 0 0; font-size: 0.95rem; line-height: 1.8; color: var(--crema); }
	.portas span { margin-inline: 0.5em; color: var(--or); opacity: 0.7; }
	/* un lien ne se coupe jamais (« Corses en / visio ») : la ligne ne se coupe qu'après un « · » (<wbr>) */
	.portas a { white-space: nowrap; padding-bottom: 2px; background: linear-gradient(var(--or), var(--or)) 0 100% / 0 1.5px no-repeat; transition: background-size 0.5s var(--lent); }
	.portas a:hover, .portas a:focus-visible { background-size: 100% 1.5px; }
	/* une page pas encore ouverte : le nom sans lien, suivi de la pastille « Aviat » (planSite.js) */
	.portas .aviat-it { display: inline-flex; align-items: center; gap: 0.45em; font-style: normal; white-space: nowrap; color: color-mix(in srgb, currentColor 72%, transparent); }
	.dintrar { display: inline-flex; align-items: center; gap: 8px; margin-top: 1.1rem; font-weight: 700; color: var(--crema); border-bottom: 2px solid var(--t-accion, #b53d17); padding-bottom: 2px; }
	.fl { width: 1em; height: 1em; transition: transform 0.4s var(--lent); }
	.dintrar:hover .fl { transform: translateX(4px); }

	/* visuels partagés */
	.vis { width: 100%; height: auto; display: block; }
	.costa { fill: none; stroke: var(--or-clar); stroke-opacity: 0.5; stroke-width: 1.2; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
	.estela { fill: #ffe6b8; fill-opacity: 0.6; }
	.estela.vila { fill: #ffd98a; fill-opacity: 1; }
	.vila-nom { font: 400 12px/1 var(--font-body), sans-serif; fill: var(--crema); fill-opacity: 0.85; }
	/* Le chemin de S'apren : la croix du logo dans des ronds de verre fumé cerclés d'un filet d'or (composant
	   CaminCrotz.svelte, piste « hybride » choisie par Romain le 2026-11-04). Le composant
	   lit ces variables ; la croix lit les jetons --logo-* de app.css (charte §1 bis). Un seul poids de trait. */
	.mieg { --cc-verre: rgba(34, 16, 10, 0.62); --cc-anell: var(--or); --cc-piste: rgba(238, 175, 52, 0.26); --cc-via: var(--or); }
	/* La carte d'Amassa en papier découpé (Romain, 2026-11-08) : une silhouette d'un seul rouge, celui de la charte,
	   une ombre à peine posée dessous ; les liens et les villes en blanc, comme les pictogrammes des tuiles de couleur. */
	.rets-domeni { fill: var(--p-brique, #b53d17); stroke: none; filter: drop-shadow(0 2px 2.5px rgba(20, 10, 5, 0.2)); }
	.rets-arc { fill: none; stroke: #fff; stroke-width: 1.1; opacity: 0.6; }
	.rets-flux { fill: none; stroke: #fff; stroke-width: 2.2; stroke-dasharray: 0 7; stroke-linecap: round; opacity: 0.95; }
	.rets-vila { fill: #fff; transform-box: fill-box; transform-origin: center; }


	/* ——— Piste « Système » (inspirée de Léo Parpeix) : braise unifiée (section transparente),
	   système fort (grand numéro + verbe, filet fin, grand visuel), couleur seulement en accent ——— */
	.sistema-ent { position: relative; max-width: calc(80rem + 2 * var(--marge)); margin: 0 auto; padding: clamp(8vh, 12vh, 14vh) var(--marge); }
	.sistema-ent + .sistema-ent { border-top: 1px solid color-mix(in srgb, var(--or) 22%, transparent); }
	.sist-cap { display: flex; align-items: baseline; gap: 1.2rem; margin: 0 0 var(--esp-48, 2.5rem); }
	.sist-num { font-family: var(--font-heading), serif; font-weight: 400; font-size: clamp(3rem, 7vw, 6.5rem); line-height: 0.9; color: var(--or); }
	.sist-cap h2 { font-family: var(--font-heading), serif; font-weight: 400; font-size: clamp(2.4rem, 5vw, 4.5rem); line-height: 0.95; color: var(--crema); margin: 0; }
	/* titre et texte forment une seule colonne ; le visuel prend la plus grande part et la hauteur de l'écran */
	.sist-cors { display: grid; grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr); gap: clamp(2rem, 5vw, 5rem); align-items: center; }
	.sistema-ent.invers .sist-cors { grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr); }
	.sistema-ent.invers .sist-gauche { order: 2; }
	.sist-gauche .sist-cap { flex-wrap: wrap; row-gap: 0.4rem; margin-bottom: clamp(1.2rem, 3vh, 2rem); }
	.sist-vis { position: relative; margin: 0; display: flex; justify-content: center; transform: translateY(var(--para, 0)); will-change: transform; }
	/* une lueur dorée douce derrière le grand visuel (dans le ton de la braise) */
	.sist-vis::before { content: ''; position: absolute; inset: -10% -8%; z-index: -1; border-radius: 50%; filter: blur(66px); opacity: 0.4; background: radial-gradient(closest-side, rgba(238, 175, 52, 0.5), transparent); }
	.sist-vis :global(.vis) { width: 100%; max-height: clamp(280px, 68vh, 640px); }
	@media (max-width: 820px) {
		.sist-cors, .sistema-ent.invers .sist-cors { grid-template-columns: 1fr; }
		.sistema-ent.invers .sist-gauche { order: 0; }
		.sist-vis :global(.vis) { max-height: 52vh; }
		/* le chemin de S'apren, un visuel bas : autant de blanc sous « Dintrar » qu'avant la section suivante */
		.sist-vis :global(.camin) { margin-top: 2rem; }
		.sec-camin { padding-bottom: 8vh; }
	}

	/* ——— Thème clair : le crème et l'or pâle du fond sombre disparaissent sur le fond clair ;
	   encre brune pour les textes (≥ 9:1), ocre profond pour numéros et traits (≥ 3:1) ——— */
	/* l'or est l'ocre des grands mots (--t-aur-gros, app.css) et les traits des cartes et du parcours le rouge de la charte (08-11 : « harmoniser les couleurs ») */
	:global(:root[data-tema='clar']) .mieg { --or: var(--t-aur-gros); --or-clar: var(--p-brique, #b53d17); --crema: #2a1a10; }
	:global(:root[data-tema='clar']) .sota { opacity: 1; }
	:global(:root[data-tema='clar']) .portas span { opacity: 1; }
	:global(:root[data-tema='clar']) .costa { stroke-opacity: 0.85; stroke-width: 1.5; }
	:global(:root[data-tema='clar']) .estela { fill: var(--p-brique, #b53d17); fill-opacity: 0.7; }
	:global(:root[data-tema='clar']) .estela.vila { fill: var(--p-brique, #b53d17); fill-opacity: 1; }
	:global(:root[data-tema='clar']) .vila-nom { fill-opacity: 1; }
	/* fond clair : verre crème, piste ocre ; le filet et le chemin prennent déjà l'ocre de --or */
	:global(:root[data-tema='clar']) .mieg { --cc-verre: rgba(255, 255, 255, 0.9); --cc-piste: rgba(181, 61, 23, 0.22); --cc-anell: var(--p-brique, #b53d17); --cc-via: var(--p-brique, #b53d17); }
	/* en clair, plus de lueur dorée derrière les visuels (le voile « crème », 08-11) */
	:global(:root[data-tema='clar']) .sist-vis::before { display: none; }

	/* ——— Contenu riche de la variante « Combiné » (scope :global pour que Svelte
	   n'élague pas ces styles, qui ne vivent que dans un extrait conditionnel) ——— */
	.sist-tèxt :global(.mix-chifras) { display: flex; flex-direction: column; margin: 1.4rem 0 0; padding: 0; }
	.sist-tèxt :global(.mix-chifras div) { display: flex; align-items: baseline; gap: 0.7rem; padding: 0.5rem 0; border-top: 1px solid color-mix(in srgb, var(--or) 20%, transparent); }
	/* le nombre ne se coupe jamais : c'est le libellé, plus long depuis « locutors en Nòva Aquitània / Occitània (OPLO 2020) », qui passe à la ligne */
	.sist-tèxt :global(.mix-chifras dt) { flex: none; white-space: nowrap; font-family: var(--font-heading), serif; font-size: clamp(1.4rem, 2vw, 2rem); line-height: 1; color: var(--or); }
	.sist-tèxt :global(.mix-chifras dd) { margin: 0; font-size: 0.85rem; color: var(--crema); opacity: 0.85; }
	.sist-tèxt :global(.mix-biais) { list-style: none; margin: 1.4rem 0 0; padding: 0; }
	.sist-tèxt :global(.mix-biais li) { list-style: none; display: flex; gap: 0.7rem; align-items: baseline; padding: 0.55rem 0; border-top: 1px solid color-mix(in srgb, var(--or) 18%, transparent); font-family: var(--font-body), sans-serif; font-weight: 700; font-size: clamp(1.05rem, 1.5vw, 1.3rem); color: var(--crema); }
	.sist-tèxt :global(.mix-n) { flex: none; min-width: 1.6em; font-family: var(--font-quote), serif; font-style: italic; color: var(--or); }
	.sist-tèxt :global(.mix-lengas-cap) { margin: 1.3rem 0 0.5rem; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--crema); opacity: 0.7; }
	.sist-tèxt :global(.mix-lengas) { display: flex; flex-wrap: wrap; gap: 0.4rem; }
	.sist-tèxt :global(.mix-lengas span) { font-family: var(--font-quote), serif; font-style: italic; font-size: 1rem; padding: 0.3rem 0.9rem; border: 1px solid color-mix(in srgb, var(--or) 30%, transparent); border-radius: 999px; color: var(--crema); }

	/* ——— Révélation au défilement (classe « anim » posée hors « moins d'animation »). Ces règles dormaient depuis le
	   début : écrites « .anim … » sans :global, Svelte les supprimait (avertissements « Unused CSS selector ») ;
	   remises en marche le 2026-11-04, à la demande de Romain. ——— */
	:global(.anim) [data-revela] { opacity: 0; transform: translateY(26px); transition: opacity 0.9s var(--lent), transform 0.9s var(--lent); }
	:global(.anim) [data-revela]:global(.vist) { opacity: 1; transform: none; }
	:global(.anim .vist) .costa { stroke-dashoffset: 1; animation: traçar 1.8s var(--lent) 0.2s forwards; }
	/* les points qui coulent le long des liens : après le tracé des liens, quatre tours (moins de 5 s, RGAA 13.8) */
	:global(.anim) .rets-flux { opacity: 0; }
	:global(.anim .vist) .rets-flux { animation: flux-ven 0.5s ease 1.9s forwards, fluir 1.1s linear 1.9s 4; }
	:global(.anim .vist) .rets-arc { stroke-dasharray: 1; stroke-dashoffset: 1; animation: traçar 1.2s var(--lent) both; animation-delay: calc(0.2s + var(--i) * 0.12s); }
	:global(.anim .vist) .rets-vila { transform: scale(0); animation: naisser 0.6s var(--lent) both; animation-delay: calc(0.3s + var(--i) * 0.06s); }
	/* à l'impression, les blocs sont tous visibles (on n'a pas fait défiler la page) */
	@media print {
		:global(.anim) [data-revela] { opacity: 1; transform: none; }
		:global(.anim) .rets-flux { opacity: 0.9; }
	}
	@keyframes traçar { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
	@keyframes fluir { to { stroke-dashoffset: -7; } }
	@keyframes naisser { from { transform: scale(0); } to { transform: scale(1); } }
	@keyframes flux-ven { from { opacity: 0; } to { opacity: 0.9; } }
	@media (prefers-reduced-motion: reduce) {
		.mieg *, .mieg *::before, .mieg *::after { animation: none !important; transition: none !important; }
	}
</style>
