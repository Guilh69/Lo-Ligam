<script>
	// Mots en imatges, harmonisée avec la charte de l'accueil (2026-10-07) :
	// fond de thème (sombre, clair, daltonisme), titres en Limelight, repère
	// « petit chiffre, grand titre ». Les 38 thèmes ne sont plus un nuage de
	// pastilles mais un SOMMAIRE : colonne fixe à gauche quand il y a la
	// place, une seule ligne qu'on fait glisser sinon. Pas de fond animé ici
	// (sobriété) : la vitrine, c'est l'accueil.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import FichaTunnel from '$lib/components/FichaTunnel.svelte';
	import FichaVideo from '$lib/components/FichaVideo.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	// Les fiches arrivent de la base via +page.js, qui se replie sur le
	// catalogue gelé si elle ne répond pas.
	let { data } = $props();
	let categories = $derived(data.categories);
	let fichas = $derived(data.fichas);

	let lang = $derived(langStore.current);

	const t = {
		oc: {
			kicker: 'Descobrir',
			title: 'Mots en imatges',
			lead: 'Cada ficha : un tèma, los mots en occitan, lor prononciacion e lor revirada.',
			fichas: 'fichas',
			temas: 'tèmas',
			all: 'Totas',
			close: 'Tampar',
			prev: 'Precedenta',
			next: 'Seguenta',
			vista: 'Vista',
			views: { mosaica: 'Mosaïca', carrossel: 'Carrossèl', tunel: 'Tunèl' }
		},
		fr: {
			kicker: 'Découvrir',
			title: 'Mots en images',
			lead: 'Chaque fiche : un thème, les mots en occitan, leur prononciation et leur traduction.',
			fichas: 'fiches',
			temas: 'thèmes',
			all: 'Toutes',
			close: 'Fermer',
			prev: 'Précédente',
			next: 'Suivante',
			vista: 'Affichage',
			views: { mosaica: 'Mosaïque', carrossel: 'Carrousel', tunel: 'Tunnel' }
		}
	};
	let tx = $derived(t[lang]);

	let view = $state('mosaica');
	let activeCat = $state('all');
	let visibles = $derived(
		activeCat === 'all' ? fichas : fichas.filter((f) => f.cat === activeCat)
	);
	let catActiva = $derived(categories.find((c) => c.id === activeCat));
	let nomActiu = $derived(catActiva ? (lang === 'oc' ? catActiva.oc : catActiva.fr) : tx.all);

	function countIn(id) {
		return fichas.filter((f) => f.cat === id).length;
	}

	// Choisir un thème depuis le sommaire fixe, quand on est descendu loin dans
	// la grille : on remonte au début des fiches, sinon on resterait devant un
	// vide (la nouvelle liste est plus courte).
	let cimEl = $state();
	function causir(id) {
		activeCat = id;
		const r = cimEl?.getBoundingClientRect();
		if (r && r.top < 0) {
			const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
			window.scrollTo({ top: scrollY + r.top - 16, behavior: calm ? 'auto' : 'smooth' });
		}
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

	// Carrousel : glissement + centrage.
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
	// comprise. On peint donc dès l'affichage.
	$effect(() => {
		if (view !== 'carrossel' || !trackEl) return;
		requestAnimationFrame(() => requestAnimationFrame(paint));
	});

	// Les flèches ne doivent pas sortir de la liste.
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
	<title>{tx.title} · Lo Ligam</title>
</svelte:head>

<svelte:window onkeydown={onKey} />

<div class="pagina">
	<div class="capçal">
		<AppHeader />
	</div>

	<main class="cors">
		<header class="intro">
			<p class="kicker">{tx.kicker}</p>
			<h1>{tx.title}</h1>
			<div class="intro-pe">
				<p class="lead">{tx.lead}</p>
				<p class="comptes">
					<span><b>{fichas.length}</b> {tx.fichas}</span>
					<span><b>{categories.length}</b> {tx.temas}</span>
				</p>
			</div>
		</header>

		<div class="disposicion">
			<!-- Le sommaire des thèmes : chaque thème garde sa couleur en pastille -->
			<nav class="temas" aria-label={tx.temas}>
				<p class="temas-titol" aria-hidden="true">{tx.temas}</p>
				<ul>
					<li>
						<button type="button" class="tema" aria-pressed={activeCat === 'all'} onclick={() => causir('all')}>
							<span class="tema-ponch tot" aria-hidden="true"></span>
							<span class="tema-nom">{tx.all}</span>
							<span class="tema-n">{fichas.length}</span>
						</button>
					</li>
					{#each categories as c (c.id)}
						<li>
							<button
								type="button"
								class="tema"
								aria-pressed={activeCat === c.id}
								style:--cat={c.color}
								onclick={() => causir(c.id)}
							>
								<span class="tema-ponch" aria-hidden="true"></span>
								<span class="tema-nom">{lang === 'oc' ? c.oc : c.fr}</span>
								<span class="tema-n">{countIn(c.id)}</span>
							</button>
						</li>
					{/each}
				</ul>
			</nav>

			<section class="fichas" bind:this={cimEl} aria-labelledby="tema-actiu">
				<div class="barra">
					<div class="jalon">
						<b>{visibles.length}</b>
						<span>{tx.fichas}</span>
					</div>
					<h2 id="tema-actiu" class="tema-actiu">{nomActiu}</h2>
					<div class="views" role="group" aria-label={tx.vista}>
						{#each ['mosaica', 'carrossel', 'tunel'] as v (v)}
							<button type="button" class="view" aria-pressed={view === v} onclick={() => (view = v)}>
								{tx.views[v]}
							</button>
						{/each}
					</div>
				</div>

				{#if view === 'mosaica'}
					<ul class="grid">
						{#each visibles as f, i (f.id)}
							<li style:--i={Math.min(i, 16)}>
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
							<!-- Un seul clic ouvre n'importe quelle carte, centrée ou non. -->
							{#each visibles as f, i (f.id)}
								<button
									type="button"
									class="slide"
									bind:this={slideEls[i]}
									onclick={() => moved <= 6 && (openIndex = i)}
								>
									<img src={f.mini} alt="" loading="lazy" draggable="false" />
									<span class="card-name">{f.titre}</span>
								</button>
							{/each}
						</div>
						<div class="controls">
							<button type="button" class="rond" onclick={() => go(-1)} disabled={carIndex === 0} aria-label={tx.prev}
								>←</button
							>
							<span class="counter">{carIndex + 1} / {visibles.length}</span>
							<button
								type="button"
								class="rond"
								onclick={() => go(1)}
								disabled={carIndex === visibles.length - 1}
								aria-label={tx.next}>→</button
							>
						</div>
					</div>
				{:else}
					<FichaTunnel items={visibles} onOpen={openItem} />
				{/if}
			</section>
		</div>
	</main>
</div>

{#if openFicha}
	<div class="viewer" role="dialog" aria-modal="true" aria-label={openFicha.titre}>
		<button type="button" class="backdrop" onclick={close} aria-label={tx.close}></button>
		<figure>
			<!-- La vidéo ne joue qu'ici, à l'ouverture d'une fiche : une seule à la
			     fois. C'est ce qui garde le poids maîtrisé (décision du 2026-08-04,
			     §11). Sans vidéo, la grande image est affichée. -->
			<FichaVideo ficha={openFicha} {lang} />
			<figcaption>{openFicha.titre}</figcaption>
		</figure>
		<button type="button" class="rond nav prev" onclick={() => step(-1)} aria-label={tx.prev}>←</button>
		<button type="button" class="rond nav next" onclick={() => step(1)} aria-label={tx.next}>→</button>
		<button type="button" class="rond close" onclick={close} aria-label={tx.close}>×</button>
	</div>
{/if}

<style>
	.pagina {
		--ease: cubic-bezier(0.19, 1, 0.22, 1);
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		/* Une chaleur de braise en haut à gauche, rien qui bouge */
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}

	/* Le bandeau commun, pleine largeur comme sur l'accueil */
	.capçal {
		padding: 1.3rem var(--marge);
	}

	.capçal :global(.top) {
		max-width: none;
	}

	.cors {
		padding: 0 var(--marge) 4rem;
		container-type: inline-size;
	}

	/* ---------- Ouverture : repère, grand titre, chapeau ---------- */
	.intro {
		padding: clamp(2.5rem, 8vh, 5.5rem) 0 clamp(2rem, 6vh, 3.5rem);
		border-bottom: 1px solid var(--t-linha);
		margin-bottom: 2.4rem;
	}

	.kicker {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin: 0 0 1.2rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: var(--t-aur);
	}

	.kicker::before {
		content: '';
		width: 3.2rem;
		height: 1px;
		background: currentColor;
	}

	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3rem, 9vw, 8.5rem);
		line-height: 0.98;
		letter-spacing: -0.01em;
	}

	.intro-pe {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		flex-wrap: wrap;
		gap: 1.2rem 3rem;
		margin-top: 2rem;
	}

	.lead {
		max-width: 34ch;
		margin: 0;
		font-size: clamp(1rem, 1.3vw, 1.15rem);
		line-height: 1.65;
		color: var(--t-tinta-2);
		text-wrap: pretty;
	}

	.comptes {
		display: flex;
		gap: 2.2rem;
		margin: 0;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}

	.comptes b {
		display: block;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.2rem, 4vw, 3.4rem);
		line-height: 1;
		letter-spacing: 0;
		color: var(--t-aur);
	}

	/* ---------- Disposition : sommaire + fiches ---------- */
	.disposicion {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1.6rem;
	}

	.temas-titol {
		margin: 0 0 0.6rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}

	/* Écran étroit : une seule ligne qu'on fait glisser, fondue sur les bords */
	.temas ul {
		list-style: none;
		margin: 0;
		padding: 0 0 0.4rem;
		display: flex;
		gap: 0.45rem;
		overflow-x: auto;
		scrollbar-width: none;
		scroll-snap-type: x proximity;
		mask-image: linear-gradient(90deg, #000 calc(100% - 2.5rem), transparent);
	}

	.temas ul::-webkit-scrollbar {
		display: none;
	}

	.temas li {
		flex: none;
		scroll-snap-align: start;
	}

	.tema {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.45rem 0.85rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: transparent;
		color: var(--t-tinta);
		font: 700 0.84rem var(--font-body);
		text-align: left;
		cursor: pointer;
		white-space: nowrap;
		transition:
			color 0.35s,
			background 0.35s,
			border-color 0.35s,
			padding 0.5s var(--ease);
	}

	.tema:hover {
		border-color: var(--t-aur);
	}

	.tema:focus-visible,
	.view:focus-visible,
	.card:focus-visible,
	.slide:focus-visible,
	.rond:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
	}

	.tema[aria-pressed='true'] {
		background: var(--t-tinta);
		border-color: transparent;
		color: var(--t-fons);
	}

	.tema-ponch {
		flex: none;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: var(--cat, var(--t-aur));
		transition: box-shadow 0.35s;
	}

	/* « Toutes » : un anneau d'or, pas une couleur de thème */
	.tema-ponch.tot {
		background: transparent;
		box-shadow: inset 0 0 0 1.5px var(--t-aur);
	}

	.tema-nom {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tema-n {
		font-size: 0.72rem;
		font-weight: 400;
		opacity: 0.6;
		font-variant-numeric: tabular-nums;
	}

	/* Grand écran : le sommaire devient une colonne fixe, à la manière d'un
	   index de livre (placé APRÈS les règles d'écran étroit pour les remplacer) */
	@container (min-width: 62rem) {
		.disposicion {
			grid-template-columns: 15rem minmax(0, 1fr);
			gap: 3rem;
			align-items: start;
		}

		.temas {
			position: sticky;
			top: 1.2rem;
			max-height: calc(100vh - 2.4rem);
			overflow-y: auto;
			scrollbar-width: thin;
			scrollbar-color: var(--t-linha) transparent;
		}

		.temas ul {
			flex-direction: column;
			gap: 0;
			padding: 0;
			overflow: visible;
			mask-image: none;
		}

		.tema {
			width: 100%;
			border-radius: 0;
			border: 0;
			border-bottom: 1px solid var(--t-linha);
			padding: 0.55rem 0.2rem;
			white-space: normal;
		}

		.tema:hover {
			padding-left: 0.6rem;
			color: var(--t-aur-clar);
		}

		.tema[aria-pressed='true'] {
			background: transparent;
			color: var(--t-aur);
			padding-left: 0.6rem;
		}

		.tema[aria-pressed='true'] .tema-ponch {
			box-shadow: 0 0 0 3px color-mix(in srgb, var(--cat, var(--t-aur)) 35%, transparent);
		}
	}

	/* ---------- La barre au-dessus des fiches ---------- */
	.barra {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: baseline;
		gap: 0.4rem 1.2rem;
		margin-bottom: 1.6rem;
	}

	.jalon {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}

	.jalon b {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
		letter-spacing: 0.04em;
		color: var(--t-aur);
	}

	.tema-actiu {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 3.4vw, 3rem);
		line-height: 1.05;
		min-width: 0;
	}

	.views {
		display: flex;
		gap: 3px;
		padding: 3px;
		border: 1px solid var(--t-linha);
		border-radius: 12px;
	}

	.view {
		border: none;
		background: transparent;
		font: 700 0.82rem var(--font-body);
		color: var(--t-tinta-2);
		padding: 0.45rem 0.85rem;
		border-radius: 9px;
		cursor: pointer;
		transition:
			background 0.4s,
			color 0.4s;
	}

	.view:hover {
		color: var(--t-tinta);
	}

	.view[aria-pressed='true'] {
		background: var(--t-tinta);
		color: var(--t-fons);
	}

	/* Écran étroit : repère, titre, puis le choix d'affichage sur sa propre
	   ligne, les trois boutons à parts égales */
	@container (max-width: 40rem) {
		.barra {
			grid-template-columns: minmax(0, 1fr);
		}

		.views {
			margin-top: 0.6rem;
		}

		.view {
			flex: 1;
		}
	}

	/* ---------- Mosaïque ---------- */
	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 1.6rem 1.1rem;
	}

	/* Les fiches arrivent en cascade quand on change de thème */
	.grid li {
		animation: arriba 0.9s var(--ease) both;
		animation-delay: calc(var(--i, 0) * 35ms);
	}

	@keyframes arriba {
		from {
			opacity: 0;
			transform: translateY(18px);
		}
	}

	.card,
	.slide {
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		color: inherit;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.card img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 14px;
		box-shadow: 0 0 0 1px var(--t-linha);
		transition:
			transform 0.6s var(--ease),
			box-shadow 0.4s;
	}

	.card:hover img {
		transform: translateY(-5px);
		box-shadow:
			0 0 0 2px var(--t-aur),
			0 18px 34px rgba(0, 0, 0, 0.35);
	}

	.card-name {
		font: 700 0.86rem var(--font-body);
		color: var(--t-tinta);
		text-align: left;
		transition: color 0.3s;
	}

	.card:hover .card-name {
		color: var(--t-aur);
	}

	/* ---------- Carrousel ---------- */
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
		scroll-snap-align: center;
		filter: blur(calc(var(--away, 0) * 3px));
		opacity: calc(1 - var(--away, 0) * 0.45);
		transform: scale(calc(1 - var(--away, 0) * 0.1));
		transition: filter 120ms linear;
	}

	.slide img {
		width: 100%;
		border-radius: 16px;
		box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
		user-select: none;
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.counter {
		font-size: 0.85rem;
		font-variant-numeric: tabular-nums;
		color: var(--t-tinta-2);
		min-width: 4rem;
		text-align: center;
	}

	/* Boutons ronds (carrousel, visionneuse) : verre sombre, flèche d'or */
	.rond {
		display: grid;
		place-items: center;
		width: 2.6rem;
		height: 2.6rem;
		padding: 0;
		border-radius: 50%;
		border: 1px solid var(--t-linha);
		background: color-mix(in srgb, var(--t-fons) 75%, transparent);
		backdrop-filter: blur(6px);
		color: var(--t-aur-clar);
		font-size: 1.1rem;
		cursor: pointer;
		transition:
			border-color 0.4s,
			transform 0.5s var(--ease);
	}

	.rond:hover:not(:disabled) {
		border-color: var(--t-aur);
	}

	.rond:disabled {
		opacity: 0.35;
		cursor: default;
	}

	/* ---------- Visionneuse ---------- */
	.viewer {
		position: fixed;
		inset: 0;
		z-index: 60;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		color: var(--t-tinta);
	}

	.backdrop {
		position: absolute;
		inset: 0;
		border: none;
		padding: 0;
		background: color-mix(in srgb, var(--t-fons) 90%, transparent);
		backdrop-filter: blur(6px);
		cursor: pointer;
	}

	figure {
		position: relative;
		margin: 0;
		max-width: min(38rem, 100%);
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	figcaption {
		text-align: center;
		font-family: var(--font-heading);
		font-size: 1.5rem;
		color: var(--t-tinta);
	}

	.nav {
		position: absolute;
		top: 50%;
		width: 2.9rem;
		height: 2.9rem;
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
		position: absolute;
		top: 1rem;
		right: 1rem;
		font-size: 1.4rem;
	}

	@media (max-width: 30rem) {
		.nav {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.grid li {
			animation: none;
		}

		.card img,
		.tema {
			transition: none;
		}
	}
</style>
