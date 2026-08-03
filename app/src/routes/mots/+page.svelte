<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { categories, fichasUnicas } from '$lib/data/fichas';

	let lang = $derived(langStore.current);

	const t = {
		oc: {
			title: 'Mots en imatges',
			lead: 'Cada ficha : un tèma, los mots en occitan, lor prononciacion e lor revirada.',
			all: 'Totas',
			count: (n) => `${n} fichas`,
			close: 'Tampar',
			prev: 'Precedenta',
			next: 'Seguenta',
			empty: 'Cap de ficha dins aqueste tèma per ara.'
		},
		fr: {
			title: 'Mots en images',
			lead: 'Chaque fiche : un thème, les mots en occitan, leur prononciation et leur traduction.',
			all: 'Toutes',
			count: (n) => `${n} fiches`,
			close: 'Fermer',
			prev: 'Précédente',
			next: 'Suivante',
			empty: 'Aucune fiche dans ce thème pour l’instant.'
		}
	};
	let tx = $derived(t[lang]);

	let activeCat = $state('all');
	let visibles = $derived(
		activeCat === 'all' ? fichasUnicas : fichasUnicas.filter((f) => f.cat === activeCat)
	);

	// Index dans la liste VISIBLE : les flèches de la visionneuse doivent
	// suivre le filtre affiché, pas la liste complète.
	let openIndex = $state(-1);
	let openFicha = $derived(openIndex >= 0 ? visibles[openIndex] : null);

	function open(i) {
		openIndex = i;
	}
	function close() {
		openIndex = -1;
	}
	function step(d) {
		if (openIndex < 0) return;
		openIndex = (openIndex + d + visibles.length) % visibles.length;
	}

	function onKey(e) {
		if (openIndex < 0) return;
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowRight') step(1);
		else if (e.key === 'ArrowLeft') step(-1);
	}

	function label(f) {
		return lang === 'oc' ? f.oc : f.fr;
	}
	function catLabel(c) {
		return lang === 'oc' ? c.oc : c.fr;
	}
	function countIn(id) {
		return fichasUnicas.filter((f) => f.cat === id).length;
	}
</script>

<svelte:head>
	<title>{tx.title} — Lo Ligam</title>
</svelte:head>

<svelte:window onkeydown={onKey} />

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	<AppHeader />

	<header class="intro">
		<h1>{tx.title}</h1>
		<p class="lead">{tx.lead}</p>
	</header>

	<nav class="cats" aria-label={tx.title}>
		<button type="button" class="cat" class:on={activeCat === 'all'} onclick={() => (activeCat = 'all')}>
			{tx.all}
			<span class="cat-n">{fichasUnicas.length}</span>
		</button>
		{#each categories as c (c.id)}
			<button
				type="button"
				class="cat"
				class:on={activeCat === c.id}
				style="--cat: {c.color}"
				onclick={() => (activeCat = c.id)}
			>
				{catLabel(c)}
				<span class="cat-n">{countIn(c.id)}</span>
			</button>
		{/each}
	</nav>

	{#if visibles.length === 0}
		<p class="empty">{tx.empty}</p>
	{:else}
		<ul class="grid">
			{#each visibles as f, i (f.id)}
				<li>
					<button type="button" class="card" onclick={() => open(i)}>
						<!-- Vignette légère (celle du fond) : la version lisible n'est
						     chargée qu'à l'ouverture, pour ne pas peser inutilement. -->
						<img src={f.src} alt="" loading="lazy" />
						<span class="card-name">{label(f)}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</main>

{#if openFicha}
	<div class="viewer" role="dialog" aria-modal="true" aria-label={label(openFicha)}>
		<button type="button" class="backdrop" onclick={close} aria-label={tx.close}></button>
		<figure>
			<img src={openFicha.src.replace('/bg/', '/fichas/')} alt={label(openFicha)} />
			<figcaption>{label(openFicha)}</figcaption>
		</figure>
		<button type="button" class="nav prev" onclick={() => step(-1)} aria-label={tx.prev}>←</button>
		<button type="button" class="nav next" onclick={() => step(1)} aria-label={tx.next}>→</button>
		<button type="button" class="close" onclick={close} aria-label={tx.close}>×</button>
	</div>
{/if}

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 380px;
		height: 380px;
		background: var(--color-gold);
		opacity: 0.3;
		top: -120px;
		left: -100px;
	}

	.blob-teal {
		width: 320px;
		height: 320px;
		background: var(--color-teal);
		opacity: 0.18;
		bottom: -80px;
		right: -80px;
	}

	.screen {
		max-width: 64rem;
		margin: 0 auto;
		padding: 1.25rem 1.25rem 4rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.intro {
		text-align: center;
		margin: 2rem 0 1.5rem;
	}

	h1 {
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		color: var(--color-brick);
		margin: 0;
	}

	.lead {
		max-width: 34rem;
		margin: 0.6rem auto 0;
		line-height: 1.5;
		opacity: 0.8;
		text-wrap: pretty;
	}

	.cats {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.cat {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		border: 1px solid rgba(58, 42, 32, 0.15);
		background: white;
		color: var(--color-text);
		font-family: var(--font-heading);
		font-size: 0.88rem;
		font-weight: 600;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1),
			background 150ms ease,
			color 150ms ease;
	}

	.cat:hover {
		transform: translateY(-2px);
	}

	.cat.on {
		background: var(--cat, var(--color-brick));
		border-color: transparent;
		color: white;
	}

	.cat-n {
		font-size: 0.72rem;
		opacity: 0.65;
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 1rem;
	}

	.card {
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.card:hover {
		transform: translateY(-4px);
	}

	.card img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 14px;
		box-shadow: 0 6px 18px rgba(58, 42, 32, 0.14);
	}

	.card-name {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.88rem;
		color: var(--color-brick);
		text-align: left;
	}

	.empty {
		opacity: 0.6;
	}

	.viewer {
		position: fixed;
		inset: 0;
		z-index: 40;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		border: none;
		padding: 0;
		background: rgba(43, 30, 22, 0.72);
		backdrop-filter: blur(3px);
		cursor: pointer;
	}

	figure {
		position: relative;
		margin: 0;
		max-width: min(38rem, 100%);
		max-height: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	figure img {
		max-width: 100%;
		max-height: calc(100vh - 8rem);
		object-fit: contain;
		border-radius: 16px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
	}

	figcaption {
		text-align: center;
		font-family: var(--font-heading);
		font-weight: 600;
		color: var(--color-cream);
	}

	.nav,
	.close {
		position: absolute;
		border: none;
		background: rgba(255, 255, 255, 0.92);
		color: var(--color-brick);
		border-radius: 999px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.nav {
		top: 50%;
		width: 2.8rem;
		height: 2.8rem;
		font-size: 1.2rem;
		transform: translateY(-50%);
	}

	.nav:hover {
		transform: translateY(-50%) scale(1.1);
	}

	.prev {
		left: 1rem;
	}

	.next {
		right: 1rem;
	}

	.close {
		top: 1rem;
		right: 1rem;
		width: 2.4rem;
		height: 2.4rem;
		font-size: 1.4rem;
	}

	.close:hover {
		transform: scale(1.1);
	}

	@media (max-width: 30rem) {
		.nav {
			display: none;
		}
	}
</style>
