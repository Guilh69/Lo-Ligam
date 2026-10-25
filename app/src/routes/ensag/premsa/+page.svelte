<script>
	// Page d'essai de la presse (2026-10-25, Romain : même méthode que les
	// radios et la télé). Trois présentations comparées (kiosque, une,
	// rythme) ; Romain a choisi le kiosque : les couvertures sur leurs rayons,
	// comme dans les kiosques numériques. Les couvertures sont dessinées en
	// lettres (aucune image de tiers) ; chaque titre mène à son site. Données
	// dans $lib/ensag/maqueta.js.
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

	const AUR = PALETAS.aur;
	const color = (i) => AUR[i % AUR.length];
	// une couverture sur deux un peu penchée, comme posée à la main
	const pench = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.6];
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

	<header class="cap">
		<h1 lang={fr ? 'fr' : 'oc'}>{tx.titol}</h1>
		<p class="frasa" lang={fr ? 'fr' : 'oc'}>{tx.frasa}</p>
	</header>

	<!-- le kiosque : les couvertures sur leurs rayons -->
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

	/* téléphone : deux couvertures par rayon */
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
	}

	@media (prefers-reduced-motion: reduce) {
		.cobèrta {
			animation: none;
			transition: none;
		}
	}
	:global(html[data-leugier='on']) .cobèrta {
		animation: none;
	}
</style>
