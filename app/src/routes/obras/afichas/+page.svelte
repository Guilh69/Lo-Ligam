<script>
	// Òbras · Afichas : la galerie des affiches qui font parler la langue sur
	// les murs. Elle était sur /obras jusqu'au 2026-10-25 ; Òbras y est devenue
	// une porte par art (cahier §11), et la case « Pintura e afichas » mène ici.
	// La grande image se charge seulement à l'ouverture.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { afichas } from '$lib/data/afichas.js';

	let lang = $derived(langStore.current);
	let fr = $derived(lang === 'fr');

	const t = {
		oc: {
			title: 'Afichas',
			lead: 'D’afichas que fan parlar la lenga sus las parets.',
			parla: 'Se parla',
			obras: 'Òbras',
			agrandir: 'Veire en grand',
			tampar: 'Tampar'
		},
		fr: {
			title: 'Affiches',
			lead: 'Des affiches qui font parler la langue sur les murs.',
			parla: 'Se parle',
			obras: 'Œuvres',
			agrandir: 'Voir en grand',
			tampar: 'Fermer'
		}
	};
	let tx = $derived(t[lang]);

	// Galerie : la grande image se charge seulement à l'ouverture (<dialog> natif :
	// Échap ferme, le focus revient au bouton, la page derrière est inerte).
	let vista = $state(null);
	let dialeg;
	function dobrir(a) {
		vista = a;
		dialeg.showModal();
	}
	function tampar() {
		dialeg.close();
	}
</script>

<svelte:head>
	<title>{tx.title} · Lo Ligam</title>
	<meta
		name="description"
		content="D’afichas que fan parlar l’occitan sus las parets. Des affiches qui font parler l’occitan sur les murs."
	/>
</svelte:head>

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="obras">
	<nav class="camin" aria-label={fr ? 'Fil d’Ariane' : 'Camin'}>
		<a href="/parla">{tx.parla}</a><span aria-hidden="true">›</span>
		<a href="/obras">{tx.obras}</a><span aria-hidden="true">›</span>
		<span aria-current="page">{tx.title}</span>
	</nav>

	<header class="cap">
		<h1 lang={lang}>{tx.title}</h1>
		<p class="frasa" lang={lang}>{tx.lead}</p>
	</header>

	<section class="afichas" aria-label={tx.title}>
		<ul class="galaria">
			{#each afichas as a (a.id)}
				<li class={a.forma}>
					<button type="button" class="afica" onclick={() => dobrir(a)}>
						<img src="/obras/afichas/{a.id}-p.webp" alt="" loading="lazy" />
						<span class="afica-legenda">
							<span class="afica-titol" lang="oc">{a.titol}</span>
							{#if a.epoca}<span class="afica-epoca">{a.epoca}</span>{/if}
						</span>
						<span class="sr-only">{tx.agrandir} : {a.titol}</span>
					</button>
				</li>
			{/each}
		</ul>
	</section>
</main>
</div>

<dialog class="vista" bind:this={dialeg} onclose={() => (vista = null)} onclick={(e) => e.target === dialeg && tampar()} aria-labelledby="vista-titol">
	{#if vista}
		<figure>
			<img src="/obras/afichas/{vista.id}.webp" alt={vista.titol} />
			<figcaption>
				<strong id="vista-titol" lang="oc">{vista.titol}</strong>
				<span>{lang === 'oc' ? vista.oc : vista.fr}</span>
				{#if vista.epoca}<span class="vista-epoca">{vista.epoca}</span>{/if}
				{#if vista.font}<span class="vista-font">{lang === 'oc' ? 'Font' : 'Source'} : {#if vista.ligam}<a href={vista.ligam} target="_blank" rel="noopener noreferrer">{vista.font} <Icona nom="extern" size="0.9em" /></a>{:else}{vista.font}{/if}</span>{/if}
			</figcaption>
		</figure>
		<button type="button" class="vista-tampar" onclick={tampar}>{tx.tampar} <Icona nom="fermer" size="1.1em" /></button>
	{/if}
</dialog>

<style>
	/* ---------- Galerie des affiches ---------- */
	.galaria {
		list-style: none;
		padding: 0;
		margin: 1.6rem 0 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		grid-auto-flow: dense;
		gap: 1rem;
	}
	.galaria .paisatge {
		grid-column: span 2;
	}
	.afica {
		all: unset;
		box-sizing: border-box;
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 3 / 4;
		border-radius: 14px;
		overflow: hidden;
		cursor: zoom-in;
		background: var(--t-fons-2);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
		transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.6s;
	}
	.paisatge .afica {
		aspect-ratio: 3 / 2;
	}
	.afica img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.9s cubic-bezier(0.19, 1, 0.22, 1);
	}
	.afica:hover,
	.afica:focus-visible {
		transform: translateY(-4px);
		box-shadow: 0 0 0 3px var(--t-terra), 0 0 0 6px var(--t-aur), 0 14px 30px rgba(0, 0, 0, 0.25);
	}
	.afica:hover img {
		transform: scale(1.04);
	}
	.afica-legenda {
		position: absolute;
		inset: auto 0 0 0;
		padding: 4.5rem 0.9rem 0.8rem;
		/* plus haut et plus sombre : les légendes restent lisibles sur les
		   affiches chargées (Joan, 2026-10-25) */
		background: linear-gradient(transparent, rgba(30, 14, 8, 0.7) 45%, rgba(30, 14, 8, 0.94));
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
		color: #fff;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		text-align: left;
	}
	.afica-titol {
		font-family: var(--font-heading);
		font-size: 1.02rem;
		line-height: 1.15;
	}
	.afica-epoca {
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-gold-light);
	}
	.vista {
		border: 0;
		padding: 0;
		background: transparent;
		max-width: min(92vw, 1100px);
		max-height: 92vh;
		overflow: visible;
	}
	.vista::backdrop {
		background: rgba(20, 10, 6, 0.86);
		backdrop-filter: blur(4px);
	}
	.vista figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.9rem;
	}
	.vista img {
		max-width: 100%;
		max-height: 78vh;
		border-radius: 10px;
		box-shadow: 0 0 0 3px var(--color-terracotta), 0 0 0 6px var(--color-gold), 0 30px 60px rgba(0, 0, 0, 0.5);
	}
	.vista figcaption {
		color: #fff;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.vista figcaption strong {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.4rem;
	}
	.vista figcaption span {
		color: var(--color-gold-light);
		font-size: 0.95rem;
	}
	.vista figcaption .vista-epoca {
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
	}
	.vista figcaption .vista-font {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.75);
	}
	.vista figcaption .vista-font a {
		color: inherit;
	}
	.vista-tampar {
		position: fixed;
		top: 1.2rem;
		right: 1.2rem;
		border: 1px solid rgba(255, 255, 255, 0.4);
		background: rgba(20, 10, 6, 0.6);
		color: #fff;
		border-radius: 999px;
		padding: 0.55rem 1rem;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.vista-tampar:focus-visible {
		outline: 2px solid var(--color-gold);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		.afica,
		.afica img {
			transition: none;
		}
	}

	/* ---------- Le cadre des pages intérieures, comme S'apren et les Idées ----------
	   Suit le thème du site (sombre par défaut, clair au choix) */
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
	.obras {
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
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
		margin-bottom: var(--esp-48);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.6rem, 8vw, 5.5rem);
		line-height: 0.95;
	}
	.frasa {
		max-width: 38ch;
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
