<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import FichaTunnel from '$lib/components/FichaTunnel.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	// Les fiches arrivent de la base via +page.js, qui se replie sur le
	// catalogue gelé si elle ne répond pas.
	let { data } = $props();
	let categories = $derived(data.categories);
	let fichas = $derived(data.fichas);

	let lang = $derived(langStore.current);

	const t = {
		oc: {
			title: 'Mots en imatges',
			lead: 'Cada ficha : un tèma, los mots en occitan, lor prononciacion e lor revirada.',
			all: 'Totas',
			close: 'Tampar',
			prev: 'Precedenta',
			next: 'Seguenta',
			views: { mosaica: 'Mosaïca', carrossel: 'Carrossèl', tunel: 'Tunèl' }
		},
		fr: {
			title: 'Mots en images',
			lead: 'Chaque fiche : un thème, les mots en occitan, leur prononciation et leur traduction.',
			all: 'Toutes',
			close: 'Fermer',
			prev: 'Précédente',
			next: 'Suivante',
			views: { mosaica: 'Mosaïque', carrossel: 'Carrousel', tunel: 'Tunnel' }
		}
	};
	let tx = $derived(t[lang]);

	let view = $state('mosaica');
	let activeCat = $state('all');
	let visibles = $derived(
		activeCat === 'all' ? fichas : fichas.filter((f) => f.cat === activeCat)
	);

	function countIn(id) {
		return fichas.filter((f) => f.cat === id).length;
	}

	// Visionneuse partagée par les trois modes.
	let openIndex = $state(-1);
	let openFicha = $derived(openIndex >= 0 ? visibles[openIndex] : null);

	function openItem(item) {
		openIndex = visibles.findIndex((f) => f.id === item.id);
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

	// Carrousel : glissement + centrage, même principe que sur l'accueil.
	let trackEl = $state();
	let slideEls = $state([]);
	let carIndex = $state(0);
	let dragging = $state(false);
	let startX = 0,
		startScroll = 0,
		moved = 0;

	function centerOn(i) {
		const el = slideEls[i];
		if (!el || !trackEl) return;
		trackEl.scrollTo({
			left: el.offsetLeft + el.offsetWidth / 2 - trackEl.clientWidth / 2,
			behavior: 'smooth'
		});
	}
	// L'effet de profondeur des cartes n'était recalculé qu'au défilement. Tant
	// qu'on n'avait rien touché, TOUTES les cartes gardaient leur valeur par
	// défaut « au plus loin » : floues, ternes et rétrécies, carte centrale
	// comprise. Le carrousel avait l'air éteint, et il fallait cliquer pour
	// qu'il s'anime — ce n'était pas voulu. On peint donc dès l'affichage.
	$effect(() => {
		if (view !== 'carrossel' || !trackEl) return;
		requestAnimationFrame(() => requestAnimationFrame(paint));
	});

	// Les flèches ne doivent pas sortir de la liste : sans bornes, la première
	// flèche gauche ne faisait rien du tout, sans dire pourquoi.
	function go(d) {
		centerOn(Math.max(0, Math.min(visibles.length - 1, carIndex + d)));
	}

	function paint() {
		if (!trackEl) return;
		const mid = trackEl.scrollLeft + trackEl.clientWidth / 2;
		let best = 0,
			bestD = Infinity;
		slideEls.forEach((el, i) => {
			if (!el) return;
			const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
			el.style.setProperty('--away', Math.min(1, d / (el.offsetWidth || 1)).toFixed(3));
			if (d < bestD) {
				bestD = d;
				best = i;
			}
		});
		carIndex = best;
	}
	function down(e) {
		dragging = true;
		moved = 0;
		startX = e.clientX;
		startScroll = trackEl.scrollLeft;
		trackEl.setPointerCapture?.(e.pointerId);
	}
	function move(e) {
		if (!dragging) return;
		const dx = e.clientX - startX;
		moved = Math.max(moved, Math.abs(dx));
		trackEl.scrollLeft = startScroll - dx;
	}
	function up(e) {
		if (!dragging) return;
		dragging = false;
		trackEl.releasePointerCapture?.(e.pointerId);
		centerOn(carIndex);
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

	<div class="views" role="group" aria-label="Vista">
		{#each ['mosaica', 'carrossel', 'tunel'] as v (v)}
			<button type="button" class="view" class:on={view === v} onclick={() => (view = v)}>
				{tx.views[v]}
			</button>
		{/each}
	</div>

	<nav class="cats" aria-label={tx.title}>
		<button type="button" class="cat" class:on={activeCat === 'all'} onclick={() => (activeCat = 'all')}>
			{tx.all}<span class="cat-n">{fichas.length}</span>
		</button>
		{#each categories as c (c.id)}
			<button
				type="button"
				class="cat"
				class:on={activeCat === c.id}
				style="--cat: {c.color}"
				onclick={() => (activeCat = c.id)}
			>
				{lang === 'oc' ? c.oc : c.fr}<span class="cat-n">{countIn(c.id)}</span>
			</button>
		{/each}
	</nav>

	{#if view === 'mosaica'}
		<ul class="grid">
			{#each visibles as f, i (f.id)}
				<li>
					<button type="button" class="card" onclick={() => (openIndex = i)}>
						<img src={f.mini} alt="" loading="lazy" />
						<span class="card-name">{f.titre}</span>
					</button>
				</li>
			{/each}
		</ul>
	{:else if view === 'carrossel'}
		<div class="carousel">
			<div
				class="track"
				class:dragging
				bind:this={trackEl}
				onscroll={paint}
				onpointerdown={down}
				onpointermove={move}
				onpointerup={up}
				onpointercancel={up}
			>
				<!-- Un seul clic ouvre n'importe quelle carte, centrée ou non. Avant,
				     une carte de côté se contentait de se recentrer : il fallait
				     cliquer deux fois pour la voir, sans que rien ne l'indique. Le
				     défilement et les flèches suffisent pour parcourir. -->
				{#each visibles as f, i (f.id)}
					<button
						type="button"
						class="slide"
						bind:this={slideEls[i]}
						onclick={() => moved <= 6 && (openIndex = i)}
					>
						<img src={f.mini} alt="" loading="lazy" draggable="false" />
						<span class="slide-name">{f.titre}</span>
					</button>
				{/each}
			</div>
			<div class="controls">
				<button type="button" onclick={() => go(-1)} disabled={carIndex === 0} aria-label={tx.prev}
					>←</button
				>
				<span class="counter">{carIndex + 1} / {visibles.length}</span>
				<button
					type="button"
					onclick={() => go(1)}
					disabled={carIndex === visibles.length - 1}
					aria-label={tx.next}>→</button
				>
			</div>
		</div>
	{:else}
		<FichaTunnel items={visibles} onOpen={openItem} />
	{/if}
</main>

{#if openFicha}
	<div class="viewer" role="dialog" aria-modal="true" aria-label={openFicha.titre}>
		<button type="button" class="backdrop" onclick={close} aria-label={tx.close}></button>
		<figure>
			<img src={openFicha.grand} alt={openFicha.titre} />
			<figcaption>{openFicha.titre}</figcaption>
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
		max-width: 68rem;
		margin: 0 auto;
		padding: 1.25rem 1.25rem 4rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.intro {
		text-align: center;
		margin: 2rem 0 1.25rem;
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

	.views {
		display: flex;
		gap: 0.3rem;
		background: rgba(58, 42, 32, 0.07);
		padding: 0.3rem;
		border-radius: 999px;
		margin-bottom: 1.25rem;
	}

	.view {
		border: none;
		background: transparent;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.85rem;
		color: var(--color-text);
		padding: 0.4rem 1rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background 150ms ease,
			color 150ms ease;
	}

	.view.on {
		background: var(--color-brick);
		color: white;
	}

	.cats {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.4rem;
		margin-bottom: 2rem;
		max-width: 58rem;
	}

	.cat {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		border: 1px solid rgba(58, 42, 32, 0.15);
		background: white;
		color: var(--color-text);
		font-family: var(--font-heading);
		font-size: 0.82rem;
		font-weight: 600;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1),
			background 150ms ease;
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
		font-size: 0.7rem;
		opacity: 0.6;
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
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
		gap: 0.45rem;
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

	.card-name,
	.slide-name {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.85rem;
		color: var(--color-brick);
		text-align: left;
	}

	.carousel {
		width: 100%;
	}

	.track {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding: 1.5rem max(1rem, calc(50% - 9rem)) 1.5rem;
		scrollbar-width: none;
		cursor: grab;
	}

	.track.dragging {
		cursor: grabbing;
		scroll-snap-type: none;
	}

	.track::-webkit-scrollbar {
		display: none;
	}

	.slide {
		flex: 0 0 auto;
		width: min(18rem, 70vw);
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		scroll-snap-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		filter: blur(calc(var(--away, 0) * 3px));
		opacity: calc(1 - var(--away, 0) * 0.45);
		transform: scale(calc(1 - var(--away, 0) * 0.1));
		transition: filter 120ms linear;
	}

	.slide img {
		width: 100%;
		border-radius: 16px;
		box-shadow: 0 12px 30px rgba(58, 42, 32, 0.2);
		user-select: none;
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.controls > button {
		border: none;
		background: white;
		color: var(--color-brick);
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 999px;
		font-size: 1.1rem;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(58, 42, 32, 0.12);
	}

	.counter {
		font-family: var(--font-heading);
		font-size: 0.85rem;
		opacity: 0.7;
		min-width: 4rem;
		text-align: center;
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
	}

	.nav {
		top: 50%;
		width: 2.8rem;
		height: 2.8rem;
		font-size: 1.2rem;
		transform: translateY(-50%);
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

	@media (max-width: 30rem) {
		.nav {
			display: none;
		}
	}
</style>
