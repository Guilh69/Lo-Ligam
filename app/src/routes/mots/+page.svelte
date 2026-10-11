<script>
	import Icona from '$lib/components/Icona.svelte';
	// Mots en imatges, harmonisée avec la charte de l'accueil (2026-10-07) :
	// fond de thème (sombre, clair, daltonisme), titres en Limelight, repère
	// « petit chiffre, grand titre ». Les 38 thèmes ne sont plus un nuage de
	// pastilles mais un SOMMAIRE : colonne fixe à gauche quand il y a la
	// place, une seule ligne qu'on fait glisser sinon. Pas de fond animé ici
	// (sobriété) : la vitrine, c'est l'accueil.
	//
	// Par défaut, les fiches sont REGROUPÉES PAR THÈME, comme un profil
	// Instagram : une vignette par thème (sa première fiche). Au clic, la
	// vignette s'agrandit et devient le carrousel du thème (transition de vue
	// du navigateur, à la manière de Léo Parpeix / Locomotive), et y revient
	// en refermant. Sans cette fonction (vieux navigateurs) ou si l'on a
	// demandé moins d'animations, le carrousel s'ouvre simplement.
	import { tick } from 'svelte';
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
			tema: 'Tèma',
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
			tema: 'Thème',
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

	// Regroupement par thème (vue par défaut : mosaïque, tous les thèmes)
	let grops = $derived(
		categories
			.map((c) => ({ cat: c, fichas: fichas.filter((f) => f.cat === c.id) }))
			.filter((g) => g.fichas.length)
	);
	let agropat = $derived(view === 'mosaica' && activeCat === 'all');
	const nomCat = (c) => (lang === 'oc' ? c.oc : c.fr);

	/* ---------- Le carrousel d'un thème (« post ») ---------- */
	let paginaEl = $state();
	let diaposEl = $state();
	let tamparEl = $state();
	let post = $state(null); // { cat } quand un thème est ouvert
	let postActiu = $state(0);
	let senseVT = $state(false); // ouverture sans transition de vue : animation CSS de repli
	let fichasPost = $derived(post ? fichas.filter((f) => f.cat === post.cat) : []);
	let catPost = $derived(post ? categories.find((c) => c.id === post.cat) : null);
	let numPost = $derived(post ? String(categories.findIndex((c) => c.id === post.cat) + 1).padStart(2, '0') : '');
	let tornarFocus = null;

	// Deux éléments « voyagent » d'une vue à l'autre : l'image et le nom du thème
	const VT_IMG = 'ficha-cuberta',
		VT_TITOL = 'tema-titol';
	const nomar = (el, n) => el?.style.setProperty('view-transition-name', n);
	const desnomar = (...els) => els.forEach((el) => el?.style.removeProperty('view-transition-name'));

	function transicion(fn) {
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!document.startViewTransition || calm) {
			senseVT = !calm;
			fn();
			return null;
		}
		senseVT = false;
		const vt = document.startViewTransition(fn);
		// Transition sautée (onglet caché, autre transition en cours) : le
		// changement se fait quand même, sans animation ; rien à signaler.
		vt.ready.catch(() => {});
		return vt;
	}

	// La grande image est demandée tout de suite ; on lui laisse un instant pour
	// arriver, afin que l'agrandissement montre une image nette (sinon la
	// vignette, déjà chargée, sert de doublure le temps qu'elle arrive).
	function precargar(src) {
		const im = new Image();
		im.src = src;
		return Promise.race([im.decode().catch(() => {}), new Promise((r) => setTimeout(r, 220))]);
	}

	async function dobrir(cat, index, img = null, titol = null) {
		const liste = fichas.filter((f) => f.cat === cat);
		if (!liste.length) return;
		tornarFocus = document.activeElement;
		await precargar(liste[index]?.grand);
		nomar(img, VT_IMG);
		nomar(titol, VT_TITOL);
		const vt = transicion(async () => {
			desnomar(img, titol);
			document.documentElement.classList.add('post-dobert');
			post = { cat };
			postActiu = index;
			await tick();
			if (diaposEl) diaposEl.scrollLeft = index * diaposEl.clientWidth;
		});
		if (!vt) desnomar(img, titol);
		(vt ? vt.finished : Promise.resolve()).finally(() => tamparEl?.focus({ preventScroll: true }));
	}

	function dobrirFicha(f, el) {
		const index = fichas.filter((x) => x.cat === f.cat).findIndex((x) => x.id === f.id);
		dobrir(f.cat, Math.max(0, index), el?.querySelector('img'));
	}

	// En refermant, l'image revient à la fiche d'où l'on vient (ou à la vignette
	// du thème), seulement si elle est à l'écran : sinon, simple fondu.
	function cibla(cat, id) {
		const visible = (el) => {
			const r = el?.getBoundingClientRect();
			return r && r.width > 0 && r.bottom > 0 && r.top < innerHeight;
		};
		const fiche = paginaEl?.querySelector(`[data-ficha="${CSS.escape(id ?? '')}"] img`);
		if (visible(fiche)) return { img: fiche, titol: null };
		const vinheta = paginaEl?.querySelector(`[data-tema="${CSS.escape(cat)}"]`);
		const img = vinheta?.querySelector('img');
		return visible(img) ? { img, titol: vinheta.querySelector('.tile-nom') } : null;
	}

	function tampar() {
		if (!post) return;
		const c = cibla(post.cat, fichasPost[postActiu]?.id);
		const vt = transicion(async () => {
			post = null;
			document.documentElement.classList.remove('post-dobert');
			await tick();
			nomar(c?.img, VT_IMG);
			nomar(c?.titol, VT_TITOL);
		});
		const netejar = () => {
			desnomar(c?.img, c?.titol);
			tornarFocus?.focus?.({ preventScroll: true });
		};
		if (vt) vt.finished.finally(netejar);
		else netejar();
	}

	// Si l'on quitte la page fiche ouverte, la page suivante doit pouvoir défiler
	$effect(() => () => document.documentElement.classList.remove('post-dobert'));

	function anar(d) {
		if (!diaposEl) return;
		const i = Math.max(0, Math.min(fichasPost.length - 1, postActiu + d));
		anarA(i);
	}
	function anarA(i) {
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		diaposEl?.scrollTo({ left: i * diaposEl.clientWidth, behavior: calm ? 'auto' : 'smooth' });
	}
	function onDiapos() {
		if (!diaposEl) return;
		postActiu = Math.round(diaposEl.scrollLeft / (diaposEl.clientWidth || 1));
	}

	function onKey(e) {
		if (!post) return;
		if (e.key === 'Escape') tampar();
		else if (e.key === 'ArrowRight') anar(1);
		else if (e.key === 'ArrowLeft') anar(-1);
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

<div class="pagina" bind:this={paginaEl}>
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
						<b>{agropat ? grops.length : visibles.length}</b>
						<span>{agropat ? tx.temas : tx.fichas}</span>
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

				{#if agropat}
					<!-- Un thème = une publication : sa première fiche en vignette, le
					     paquet des autres derrière, l'icône « carrousel » d'Instagram -->
					<ul class="grid grid-temas">
						{#each grops as g, i (g.cat.id)}
							<li style:--i={Math.min(i, 16)}>
								<button
									type="button"
									class="tile"
									data-tema={g.cat.id}
									style:--cat={g.cat.color}
									onclick={(e) => dobrir(g.cat.id, 0, e.currentTarget.querySelector('img'), e.currentTarget.querySelector('.tile-nom'))}
								>
									<span class="tile-pila">
										<img src={g.fichas[0].mini} alt="" loading="lazy" />
										{#if g.fichas.length > 1}
											<svg class="tile-icona" viewBox="0 0 24 24" aria-hidden="true"
												><path d="M19 7H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" fill="currentColor" /><path
													d="M4 16V6a2 2 0 0 1 2-2h10"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
												/></svg
											>
										{/if}
									</span>
									<span class="tile-nom">{nomCat(g.cat)}</span>
									<span class="tile-n">{g.fichas.length} {tx.fichas}</span>
								</button>
							</li>
						{/each}
					</ul>
				{:else if view === 'mosaica'}
					<ul class="grid">
						{#each visibles as f, i (f.id)}
							<li style:--i={Math.min(i, 16)}>
								<button type="button" class="card" data-ficha={f.id} onclick={(e) => dobrirFicha(f, e.currentTarget)}>
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
									data-ficha={f.id}
									bind:this={slideEls[i]}
									onclick={(e) => moved <= 6 && dobrirFicha(f, e.currentTarget)}
								>
									<img src={f.mini} alt="" loading="lazy" draggable="false" />
									<span class="card-name">{f.titre}</span>
								</button>
							{/each}
						</div>
						<div class="controls">
							<button type="button" class="rond" onclick={() => go(-1)} disabled={carIndex === 0} aria-label={tx.prev}
								><Icona nom="precedent" size="1.2em" /></button
							>
							<span class="counter">{carIndex + 1} / {visibles.length}</span>
							<button
								type="button"
								class="rond"
								onclick={() => go(1)}
								disabled={carIndex === visibles.length - 1}
								aria-label={tx.next}><Icona nom="suivant" size="1.2em" /></button
							>
						</div>
					</div>
				{:else}
					<FichaTunnel items={visibles} onOpen={(f) => dobrirFicha(f, null)} />
				{/if}
			</section>
		</div>
	</main>
</div>

{#if post && catPost}
	<div class="post" class:sens-vt={senseVT} role="dialog" aria-modal="true" aria-labelledby="post-titol">
		<button type="button" class="post-fons" onclick={tampar} aria-label={tx.close} tabindex="-1"></button>

		<div class="post-cors">
			<div class="post-media">
				<div class="diapos" bind:this={diaposEl} onscroll={onDiapos} aria-roledescription="carrossèl">
					{#each fichasPost as f, i (f.id)}
						<!-- La vidéo ne joue que sur la fiche affichée : une seule à la fois
						     (poids maîtrisé, décision du 2026-08-04, §11). La vignette sert de
						     doublure le temps que la grande image arrive. -->
						<div
							class="diapo"
							style:background-image="url({f.mini})"
							style:view-transition-name={i === postActiu ? VT_IMG : null}
							aria-label="{i + 1} / {fichasPost.length}"
						>
							{#if i === postActiu}
								<FichaVideo ficha={f} {lang} />
							{:else}
								<img src={f.grand} alt="" loading="lazy" />
							{/if}
						</div>
					{/each}
				</div>
				{#if fichasPost.length > 1}
					<button type="button" class="rond post-prev" onclick={() => anar(-1)} disabled={postActiu === 0} aria-label={tx.prev}
						><Icona nom="precedent" size="1.2em" /></button
					>
					<button
						type="button"
						class="rond post-next"
						onclick={() => anar(1)}
						disabled={postActiu === fichasPost.length - 1}
						aria-label={tx.next}><Icona nom="suivant" size="1.2em" /></button
					>
					<div class="ponches" aria-hidden="true">
						{#each fichasPost as f, i (f.id)}<i class:on={i === postActiu}></i>{/each}
					</div>
				{/if}
			</div>

			<div class="post-tèxt">
				<p class="post-kicker revela" style="--i: 0">{tx.tema} {numPost}</p>
				<h2 id="post-titol" class="post-titol" style:view-transition-name={VT_TITOL}>{nomCat(catPost)}</h2>
				<p class="post-n revela" style="--i: 1">
					<b>{postActiu + 1}</b> / {fichasPost.length}
					{tx.fichas}
				</p>
				<ol class="post-lista">
					{#each fichasPost as f, i (f.id)}
						<li class="revela" style:--i={Math.min(i + 2, 14)}>
							<button type="button" aria-current={i === postActiu ? 'true' : undefined} onclick={() => anarA(i)}
								>{f.titre}</button
							>
						</li>
					{/each}
				</ol>
			</div>
		</div>

		<button type="button" class="rond post-tampar" bind:this={tamparEl} onclick={tampar} aria-label={tx.close}><Icona nom="fermer" size="1.25em" /></button>
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

	/* ---------- Vignettes de thème (vue par défaut) ---------- */
	/* Au moins deux colonnes, même sur téléphone (comme un profil Instagram) */
	.grid-temas {
		grid-template-columns: repeat(auto-fill, minmax(min(12.5rem, calc(50% - 0.6rem)), 1fr));
		gap: 2.4rem 1.8rem;
	}

	@container (max-width: 40rem) {
		.grid-temas {
			gap: 1.8rem 1.2rem;
		}

		.tile-nom {
			font-size: 1.05rem;
		}

		.tile-n {
			font-size: 0.62rem;
			letter-spacing: 0.14em;
		}
	}

	.tile {
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		color: inherit;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		text-align: left;
	}

	.tile:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 6px;
		border-radius: 14px;
	}

	/* Le paquet : deux fiches fantômes derrière la vignette, liserées de la
	   couleur du thème ; au survol, elles s'ouvrent en éventail */
	.tile-pila {
		position: relative;
		display: block;
		aspect-ratio: 1;
		margin-bottom: 0.55rem;
		isolation: isolate;
	}

	.tile-pila::before,
	.tile-pila::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: 14px;
		background: var(--t-fons-2);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--cat, var(--t-aur)) 55%, transparent);
		transform-origin: 50% 100%;
		transition: transform 0.8s var(--ease);
	}

	.tile-pila::before {
		transform: translate(5px, -5px);
	}

	.tile-pila::after {
		transform: translate(10px, -10px);
		opacity: 0.55;
	}

	.tile:hover .tile-pila::before,
	.tile:focus-visible .tile-pila::before {
		transform: translate(8px, -6px) rotate(4deg);
	}

	.tile:hover .tile-pila::after,
	.tile:focus-visible .tile-pila::after {
		transform: translate(16px, -9px) rotate(8deg);
	}

	.tile-pila img {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 14px;
		box-shadow: 0 0 0 1px var(--t-linha);
		transition:
			transform 0.8s var(--ease),
			box-shadow 0.4s;
	}

	.tile:hover .tile-pila img {
		transform: rotate(-1.5deg) translateY(-4px);
		box-shadow:
			0 0 0 2px var(--t-aur),
			0 18px 34px rgba(0, 0, 0, 0.35);
	}

	/* L'icône « carrousel » d'Instagram : plusieurs fiches dans ce thème */
	.tile-icona {
		position: absolute;
		top: 0.55rem;
		right: 0.55rem;
		width: 1.75rem;
		height: 1.75rem;
		padding: 0.3rem;
		border-radius: 7px;
		/* pastille sombre : l'icône reste visible sur les fiches à fond blanc */
		background: rgba(18, 9, 6, 0.55);
		backdrop-filter: blur(4px);
		color: #fff;
	}

	.tile-nom {
		width: fit-content;
		font-family: var(--font-heading);
		font-size: 1.25rem;
		line-height: 1.1;
		color: var(--t-tinta);
		transition: color 0.3s;
	}

	.tile:hover .tile-nom {
		color: var(--t-aur);
	}

	.tile-n {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}

	/* ---------- Le carrousel d'un thème, ouvert ---------- */
	.post {
		position: fixed;
		inset: 0;
		z-index: 60;
		display: grid;
		place-items: center;
		padding: clamp(1rem, 4vw, 3rem);
		color: var(--t-tinta);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.post-fons {
		position: fixed;
		inset: 0;
		border: none;
		padding: 0;
		background: color-mix(in srgb, var(--t-fons) 94%, transparent);
		backdrop-filter: blur(10px);
		cursor: zoom-out;
	}

	.post-cors {
		position: relative;
		display: grid;
		grid-template-columns: auto minmax(14rem, 21rem);
		align-items: center;
		gap: clamp(2rem, 4vw, 4rem);
	}

	.post-media {
		position: relative;
		width: min(78vh, calc(100vw - 32rem), 46rem);
	}

	.diapos {
		display: flex;
		aspect-ratio: 1;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		border-radius: 18px;
		box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45);
	}

	.diapos::-webkit-scrollbar {
		display: none;
	}

	.diapo {
		flex: 0 0 100%;
		display: grid;
		place-items: center;
		scroll-snap-align: center;
		overflow: hidden;
		border-radius: 18px;
		background: var(--t-fons-2) center / contain no-repeat;
	}

	/* La fiche remplit la diapo ; fond transparent pour laisser voir la
	   doublure (vignette) tant que la grande image n'est pas arrivée */
	.diapo > img,
	.diapo :global(img),
	.diapo :global(video) {
		width: 100%;
		height: 100%;
		max-height: none;
		object-fit: contain;
		border-radius: 0;
		background: transparent;
	}

	.diapo :global(.envolopa) {
		height: 100%;
	}

	.post-prev,
	.post-next {
		position: absolute;
		top: 50%;
		translate: 0 -50%;
		width: 2.9rem;
		height: 2.9rem;
	}

	.post-prev {
		left: -1.45rem;
	}

	.post-next {
		right: -1.45rem;
	}

	/* Les points d'Instagram */
	.ponches {
		display: flex;
		justify-content: center;
		gap: 6px;
		margin-top: 1.1rem;
	}

	.ponches i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--t-linha);
		transition:
			background 0.4s,
			transform 0.4s var(--ease);
	}

	.ponches i.on {
		background: var(--t-aur);
		transform: scale(1.35);
	}

	.post-kicker {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		margin: 0 0 1rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--t-aur);
	}

	.post-kicker::before {
		content: '';
		width: 2.4rem;
		height: 1px;
		background: currentColor;
	}

	.post-titol {
		width: fit-content;
		margin: 0 0 1.1rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.1rem, 3.3vw, 3.4rem);
		line-height: 1.02;
	}

	.post-n {
		margin: 0;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}

	.post-n b {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
		letter-spacing: 0;
		color: var(--t-aur);
	}

	.post-lista {
		list-style: none;
		margin: 1.6rem 0 0;
		padding: 0;
		max-height: 42vh;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--t-linha) transparent;
		border-top: 1px solid var(--t-linha);
		counter-reset: n;
	}

	.post-lista button {
		width: 100%;
		display: flex;
		align-items: baseline;
		gap: 0.8rem;
		padding: 0.55rem 0;
		border: none;
		border-bottom: 1px solid var(--t-linha);
		background: none;
		color: var(--t-tinta-2);
		font: 700 0.9rem var(--font-body);
		text-align: left;
		cursor: pointer;
		transition:
			color 0.3s,
			padding 0.5s var(--ease);
	}

	.post-lista button::before {
		counter-increment: n;
		content: counter(n, decimal-leading-zero);
		min-width: 1.7rem;
		font-family: var(--font-quote);
		font-style: italic;
		font-weight: 500;
		font-size: 1.05rem;
		color: var(--t-aur);
	}

	.post-lista button:hover {
		color: var(--t-aur-clar);
	}

	.post-lista button[aria-current='true'] {
		color: var(--t-tinta);
		padding-left: 0.5rem;
	}

	.post-lista button:focus-visible,
	.post-tampar:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}

	.post-tampar {
		position: fixed;
		top: 1.2rem;
		right: 1.2rem;
		font-size: 1.4rem;
	}

	/* Le texte arrive en cascade pendant que l'image s'agrandit */
	.revela {
		animation: post-monta 0.9s var(--ease) both;
		animation-delay: calc(0.28s + var(--i, 0) * 55ms);
	}

	@keyframes post-monta {
		from {
			opacity: 0;
			transform: translateY(22px);
		}
	}

	/* Repli sans transition de vue : le fond se lève, la fiche s'avance */
	.post.sens-vt .post-fons {
		animation: post-fons 0.5s ease both;
	}

	.post.sens-vt .post-media,
	.post.sens-vt .post-titol {
		animation: post-avança 0.8s var(--ease) both;
	}

	@keyframes post-fons {
		from {
			opacity: 0;
		}
	}

	@keyframes post-avança {
		from {
			opacity: 0;
			transform: scale(0.94) translateY(16px);
		}
	}

	/* Téléphone : la fiche en haut sur toute la largeur, le texte dessous ;
	   on fait glisser du doigt (pas de flèches) */
	@media (max-width: 760px) {
		.post {
			place-items: start center;
			padding: 4.4rem 1rem 2rem;
		}

		.post-cors {
			grid-template-columns: minmax(0, 1fr);
			gap: 1.6rem;
		}

		.post-media {
			width: calc(100vw - 2rem);
		}

		.post-prev,
		.post-next {
			display: none;
		}

		.post-lista {
			max-height: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.grid li,
		.revela {
			animation: none;
		}

		.card img,
		.tema,
		.tile-pila img,
		.tile-pila::before,
		.tile-pila::after {
			transition: none;
		}
	}
</style>
