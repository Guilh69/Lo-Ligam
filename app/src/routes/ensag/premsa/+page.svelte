<script>
	// Page d'essai de la presse (2026-10-25, Romain : même méthode que les
	// radios et la télé). Trois présentations à comparer, dans les ors de la
	// case Mèdias, inspirées des sites qui recensent la presse :
	//   A. le kiosque (les rayons de couvertures des kiosques numériques) ;
	//   B. la une (la page d'un journal : un grand titre, des colonnes) ;
	//   C. le rythme (les listes rangées par périodicité : chaque mois, chaque
	//      trimestre…), pour savoir ce qu'on lira souvent.
	// Les couvertures sont dessinées en lettres (aucune image de tiers) ;
	// chaque titre mène à son site. Données dans $lib/ensag/maqueta.js.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { PALETAS } from '$lib/apren/teulas.js';
	import { PREMSA, RITMES } from '$lib/ensag/maqueta.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let fr = $derived(langStore.current === 'fr');
	const t = {
		oc: {
			titol: 'Premsa',
			frasa: 'Los jornals e las revistas en occitan.',
			legir: 'Legir'
		},
		fr: {
			titol: 'Presse',
			frasa: 'Les journaux et les revues en occitan.',
			legir: 'Lire'
		}
	};
	let tx = $derived(t[fr ? 'fr' : 'oc']);
	const s = (o) => (fr ? o.fr : o.oc);
	const ritme = (id) => RITMES.find((r) => r.id === id);

	const VISTAS = [
		['quiosc', 'A. Le kiosque'],
		['una', 'B. La une'],
		['ritme', 'C. Le rythme']
	];
	let vista = $state('quiosc');

	const AUR = PALETAS.aur;
	const color = (i) => AUR[i % AUR.length];
	// une couverture sur deux un peu penchée, comme posée à la main
	const pench = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.6];
	// l'espacement des traits du rythme : serré pour le quotidien, large pour le trimestre
	const PAS = { linha: 6, mes: 16, dos: 30, trimèstre: 52 };
</script>

<svelte:head>
	<title>Premsa (maqueta) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="premsa">
	<nav class="camin" aria-label={fr ? 'Fil d’Ariane' : 'Camin'}>
		<a href="/ensag/parla">{fr ? 'Se parle' : 'Se parla'}</a><span aria-hidden="true">›</span>
		<a href="/ensag/medias">{fr ? 'Médias' : 'Mèdias'}</a><span aria-hidden="true">›</span>
		<span aria-current="page">{tx.titol}</span>
	</nav>

	{#if vista !== 'una'}
		<header class="cap">
			<h1 lang={fr ? 'fr' : 'oc'}>{tx.titol}</h1>
			<p class="frasa" lang={fr ? 'fr' : 'oc'}>{tx.frasa}</p>
		</header>
	{/if}

	<div class="vistas" role="group" aria-label="Présentation">
		{#each VISTAS as [v, nom] (v)}
			<button type="button" aria-pressed={vista === v} onclick={() => (vista = v)}>{nom}</button>
		{/each}
	</div>

	{#if vista === 'quiosc'}
		<!-- A. Le kiosque : les couvertures sur leurs rayons -->
		<ul class="quiosc">
			{#each PREMSA as p, i (p.id)}
				{@const [fons, tinta] = color(i)}
				<li style:--i={i}>
					<a class="cobèrta" href={p.site} target="_blank" rel="noopener noreferrer" style:--fons={fons} style:--tinta={tinta} style:--r="{pench[i % pench.length]}deg">
						<span class="cob-sorta" lang={fr ? 'fr' : 'oc'}>{s(p.sorta)}</span>
						<span class="cob-nom" lang="oc">{p.nom}</span>
						<span class="cob-tèxt" lang={fr ? 'fr' : 'oc'}>{s(p.tèxt)}</span>
						<span class="cob-linhas" aria-hidden="true">{#each Array(10) as _, k (k)}<i></i>{/each}</span>
						<span class="cob-pè">
							<span lang={fr ? 'fr' : 'oc'}>{s(ritme(p.ritme))}</span>
							<span class="cob-legir">{tx.legir} <Icona nom="extern" size="0.9em" /></span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{:else if vista === 'una'}
		<!-- B. La une : la page elle-même est un journal -->
		<article class="una">
			<header class="una-cap">
				<p class="una-filet" lang={fr ? 'fr' : 'oc'}>Lo Ligam · {fr ? 'Médias' : 'Mèdias'}</p>
				<h1 class="una-titol" lang={fr ? 'fr' : 'oc'}>{tx.titol}</h1>
				<p class="una-frasa" lang={fr ? 'fr' : 'oc'}>{tx.frasa}</p>
			</header>
			<div class="una-colonas">
				{#each PREMSA as p, i (p.id)}
					<section class="article" class:primièr={i === 0}>
						<span class="art-sorta" lang={fr ? 'fr' : 'oc'}>{s(p.sorta)} · {s(ritme(p.ritme))}</span>
						<h2><a href={p.site} target="_blank" rel="noopener noreferrer" lang="oc">{p.nom}</a></h2>
						<p class="art-tèxt" lang={fr ? 'fr' : 'oc'}>{s(p.tèxt)}</p>
						{#if i === 0}<span class="una-linhas" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>{/if}
						<span class="art-legir" aria-hidden="true">{tx.legir} ›</span>
					</section>
				{/each}
			</div>
		</article>
	{:else}
		<!-- C. Le rythme : du quotidien au trimestriel, de gauche à droite -->
		<ol class="ritme">
			{#each RITMES as r, k (r.id)}
				<li class="pas" style:--pas="{PAS[r.id]}px" style:--k={k}>
					<span class="traits" aria-hidden="true"></span>
					<span class="pas-punt" aria-hidden="true"></span>
					<h2 class="pas-nom" lang={fr ? 'fr' : 'oc'}>{s(r)}</h2>
					<ul class="pas-titols">
						{#each PREMSA.filter((p) => p.ritme === r.id) as p (p.id)}
							{@const [fons, tinta] = color(PREMSA.indexOf(p))}
							<li class="titol" style:--fons={fons} style:--tinta={tinta}>
								<a href={p.site} target="_blank" rel="noopener noreferrer"><span class="titol-nom" lang="oc">{p.nom}</span></a>
								<span class="titol-sorta" lang={fr ? 'fr' : 'oc'}>{s(p.sorta)}</span>
								<span class="titol-tèxt" lang={fr ? 'fr' : 'oc'}>{s(p.tèxt)}</span>
								<span class="titol-legir" aria-hidden="true">{tx.legir} <Icona nom="extern" size="0.9em" /></span>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ol>
	{/if}
</main>
</div>

<style>
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.premsa {
		container: premsa / inline-size;
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(1.5rem, 4vh, 3rem) var(--marge) var(--esp-96);
	}
	.camin {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: var(--esp-24);
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.camin a {
		color: inherit;
		text-decoration-color: var(--t-terra);
		text-underline-offset: 3px;
	}
	.cap {
		margin: 0 0 var(--esp-32, 2rem);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3.2rem, 11vw, 8rem);
		line-height: 0.95;
	}
	.frasa {
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		color: var(--t-tinta-2);
	}

	/* le choix de la présentation (maquette seulement) */
	.vistas {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: var(--esp-32, 2rem);
		padding: 0.3rem;
		border: 1px dashed var(--t-linha);
		border-radius: 999px;
	}
	.vistas button {
		padding: 0.45rem 1rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--t-tinta-2);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.vistas button[aria-pressed='true'] {
		background: var(--t-aur);
		color: #2a1a10;
	}

	/* ---------- A. Le kiosque ---------- */
	.quiosc {
		--esc: clamp(1.2rem, 3vw, 2.6rem);
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: calc(var(--esc) + 1.2rem) var(--esc);
		margin: 0;
		padding: 0 0 1.2rem;
		list-style: none;
	}
	.quiosc li {
		position: relative;
		padding-bottom: 0.9rem;
	}
	/* le rayon : une planche d'or sous chaque couverture, jointive d'une case à l'autre */
	.quiosc li::after {
		content: '';
		position: absolute;
		left: calc(var(--esc) / -2);
		right: calc(var(--esc) / -2);
		bottom: 0;
		height: 0.9rem;
		border-radius: 2px;
		background: linear-gradient(#c8932c, #79591c);
		box-shadow: 0 12px 18px -10px rgba(0, 0, 0, 0.7);
	}
	.cobèrta {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		aspect-ratio: 4 / 5;
		padding: clamp(1rem, 2vw, 1.6rem);
		border-radius: 3px;
		background:
			linear-gradient(100deg, rgba(0, 0, 0, 0.12), transparent 8%),
			var(--fons);
		color: var(--tinta);
		text-decoration: none;
		box-shadow: 0 10px 22px -12px rgba(0, 0, 0, 0.75);
		transform: rotate(var(--r));
		transform-origin: bottom center;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 70ms);
	}
	@keyframes arribar {
		from {
			opacity: 0;
			transform: translateY(14px) rotate(var(--r, 0deg));
		}
	}
	.cobèrta:hover,
	.cobèrta:focus-visible {
		transform: translateY(-10px) rotate(0deg);
		box-shadow: 0 22px 30px -14px rgba(0, 0, 0, 0.8);
		outline: none;
	}
	.cobèrta:focus-visible {
		box-shadow: 0 0 0 3px var(--t-aur), 0 22px 30px -14px rgba(0, 0, 0, 0.8);
	}
	.cob-sorta {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	/* le titre du journal, souligné d'un double filet */
	.cob-nom {
		margin-top: 0.3rem;
		padding-bottom: 0.5rem;
		border-bottom: 4px double currentColor;
		font-family: var(--font-heading);
		font-size: clamp(1.6rem, 3.4vw, 2.8rem);
		line-height: 1;
		text-transform: uppercase;
	}
	.cob-tèxt {
		margin: 0.9rem 0 0.9rem;
		font-family: var(--font-heading);
		font-size: clamp(1rem, 1.6vw, 1.3rem);
		line-height: 1.2;
	}
	/* deux colonnes de faux texte, pour l'allure d'une page */
	.cob-linhas {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.45rem 0.8rem;
		margin-top: 1rem;
	}
	.cob-linhas i {
		height: 0.35rem;
		border-radius: 2px;
		background: currentColor;
		opacity: 0.18;
	}
	.cob-linhas i:nth-child(9),
	.cob-linhas i:nth-child(10) {
		width: 70%;
	}
	.cob-pè {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: 0.6rem;
		border-top: 1px solid currentColor;
		font-size: 0.82rem;
		font-weight: 700;
	}
	.cob-legir {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	/* ---------- B. La une ---------- */
	.una {
		padding: clamp(1.2rem, 4vw, 3rem);
		border-radius: 4px;
		background:
			radial-gradient(ellipse 80% 60% at 20% 0%, rgba(255, 255, 255, 0.35), transparent 70%),
			#f5d393;
		color: #2a1a10;
		box-shadow: 0 30px 50px -30px rgba(0, 0, 0, 0.8);
	}
	.una-cap {
		text-align: center;
		border-bottom: 5px double #2a1a10;
		padding-bottom: var(--esp-12);
	}
	.una-filet {
		margin: 0;
		padding-bottom: var(--esp-8);
		border-bottom: 1px solid #2a1a10;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}
	.una-titol {
		margin: var(--esp-8) 0 0;
		font-size: clamp(3.6rem, 13vw, 9rem);
		line-height: 1;
	}
	.una-frasa {
		margin: var(--esp-8) 0 0;
		font-style: italic;
		font-size: clamp(1rem, 1.5vw, 1.2rem);
	}
	.una-colonas {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
	}
	.article {
		position: relative;
		grid-column: span 3;
		display: flex;
		flex-direction: column;
		gap: var(--esp-8);
		padding: var(--esp-16) var(--esp-16) var(--esp-24);
		border-top: 1px solid rgba(42, 26, 16, 0.5);
		border-left: 1px solid rgba(42, 26, 16, 0.5);
	}
	.article:nth-child(3) {
		border-left: 0;
	}
	.article.primièr {
		grid-column: span 8;
		border-left: 0;
		padding: var(--esp-24) var(--esp-32, 2rem) var(--esp-32, 2rem) 0;
	}
	.article:nth-child(2) {
		grid-column: span 4;
	}
	.article:nth-child(-n + 2) {
		border-top: 0;
	}
	.art-sorta {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #79591c;
	}
	.article h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.4rem, 2.2vw, 1.9rem);
		line-height: 1.05;
	}
	.primièr h2 {
		font-size: clamp(3rem, 7vw, 5.6rem);
	}
	.article h2 a {
		color: inherit;
		text-decoration: none;
	}
	/* tout l'article se clique ; le titre se souligne en rouge (rouge = clic) */
	.article h2 a::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.article:hover h2 a,
	.article h2 a:focus-visible {
		text-decoration: underline;
		text-decoration-color: #b53d17;
		text-decoration-thickness: 3px;
		text-underline-offset: 5px;
		outline: none;
	}
	.art-tèxt {
		margin: 0;
		line-height: 1.45;
	}
	.primièr .art-tèxt {
		font-size: clamp(1.15rem, 1.7vw, 1.45rem);
		font-family: var(--font-heading);
	}
	.una-linhas {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem 1.2rem;
		margin-top: var(--esp-8);
	}
	.una-linhas i {
		height: 0.4rem;
		border-radius: 2px;
		background: #2a1a10;
		opacity: 0.14;
	}
	.art-legir {
		margin-top: auto;
		font-weight: 700;
		color: #b53d17;
	}

	/* ---------- C. Le rythme ---------- */
	.ritme {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--esp-16);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.pas {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--esp-12);
	}
	/* les traits : plus ils sont serrés, plus le titre paraît souvent */
	.traits {
		display: block;
		height: 1.6rem;
		margin-right: calc(var(--esp-16) * -1);
		background: repeating-linear-gradient(90deg, var(--t-aur) 0 3px, transparent 3px var(--pas));
		opacity: 0.85;
	}
	.pas:last-child .traits {
		margin-right: 0;
	}
	.pas-punt {
		position: absolute;
		top: 0.3rem;
		left: -0.2rem;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: #b53d17;
		box-shadow: 0 0 0 3px var(--t-fons);
	}
	.pas-nom {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.4rem, 2.2vw, 2rem);
		line-height: 1.05;
		color: var(--t-aur);
	}
	.pas-titols {
		display: flex;
		flex-direction: column;
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.titol {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: var(--esp-16);
		border-radius: 6px;
		background: var(--fons);
		color: var(--tinta);
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--k) * 90ms);
	}
	.titol a {
		color: inherit;
		text-decoration: none;
	}
	.titol a::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.titol-nom {
		font-family: var(--font-heading);
		font-size: clamp(1.3rem, 1.9vw, 1.7rem);
		line-height: 1.05;
		text-transform: uppercase;
	}
	.titol-sorta {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.titol-tèxt {
		font-size: 0.92rem;
		line-height: 1.4;
	}
	.titol-legir {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-top: 0.3rem;
		font-size: 0.85rem;
		font-weight: 700;
	}
	.titol:hover,
	.titol:focus-within {
		transform: translateY(-4px);
		box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.5);
	}
	.titol:has(a:focus-visible) {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.titol a:focus-visible {
		outline: none;
	}

	/* téléphone */
	@container premsa (max-width: 640px) {
		.quiosc {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.cobèrta {
			aspect-ratio: auto;
			min-height: 15rem;
		}
		.cob-linhas {
			display: none;
		}
		.cob-tèxt {
			font-size: 0.95rem;
		}
		.cob-pè {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.2rem;
			font-size: 0.75rem;
		}
		.una-colonas {
			grid-template-columns: 1fr;
		}
		.article,
		.article.primièr,
		.article:nth-child(2) {
			grid-column: auto;
			border-left: 0;
			padding: var(--esp-16) 0;
		}
		.article:nth-child(2) {
			border-top: 1px solid rgba(42, 26, 16, 0.5);
		}
		.ritme {
			grid-template-columns: 1fr;
			gap: var(--esp-24);
		}
		.traits {
			margin-right: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cobèrta,
		.titol {
			animation: none;
			transition: none;
		}
	}
	:global(html[data-leugier='on']) .cobèrta,
	:global(html[data-leugier='on']) .titol {
		animation: none;
	}
</style>
