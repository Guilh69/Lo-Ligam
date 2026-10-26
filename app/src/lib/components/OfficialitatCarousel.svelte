<script>
	import Icona from '$lib/components/Icona.svelte';
	// Série « Officialitat » : 9 visuels qui forment une démonstration
	// suivie sur le statut officiel de l'occitan. L'ordre compte (c'est un
	// raisonnement, pas une galerie).
	//
	// Carrousel flottant : la carte centrale est nette et au premier plan,
	// les voisines s'estompent et reculent à mesure qu'elles s'éloignent du
	// centre. Le flou est calculé en continu pendant le défilement, donc la
	// transition est fluide et non par paliers.
	let { lang = 'oc' } = $props();

	const slides = [
		{ src: '/officialitat/1_officialitat.webp', oc: 'Officialitat', fr: 'Officialité', es: 'Oficialidad', en: 'Official status', ca: 'Oficialitat' },
		{ src: '/officialitat/2_visibilitat.webp', oc: 'Visibilitat', fr: 'Visibilité', es: 'Visibilidad', en: 'Visibility', ca: 'Visibilitat' },
		{ src: '/officialitat/3_ont.webp', oc: 'Ont ?', fr: 'Où ?', es: '¿Dónde?', en: 'Where?', ca: 'On?' },
		{ src: '/officialitat/4_pluralitat.webp', oc: 'Pluralitat', fr: 'Pluralité', es: 'Pluralidad', en: 'Plurality', ca: 'Pluralitat' },
		{ src: '/officialitat/5_drech.webp', oc: 'Drech', fr: 'Droit', es: 'Derechos', en: 'Rights', ca: 'Drets' },
		{ src: '/officialitat/6_parlar.webp', oc: 'Parlar', fr: 'Parler', es: 'Hablar', en: 'Speaking', ca: 'Parlar' },
		{ src: '/officialitat/7_promoure.webp', oc: 'Promòure', fr: 'Promouvoir', es: 'Promover', en: 'Promoting', ca: 'Promoure' },
		{ src: '/officialitat/8_origina.webp', oc: 'Origina', fr: 'Origine', es: 'Origen', en: 'Origin', ca: 'Origen' },
		{ src: '/officialitat/9_senat.webp', oc: 'Senat', fr: 'Sénat', es: 'Senado', en: 'Senate', ca: 'Senat' }
	];

	const T = {
		serie: { oc: 'Seria Officialitat', fr: 'Série Officialité', es: 'Serie Oficialidad', en: 'Official status series', ca: 'Sèrie Oficialitat' },
		prec: { oc: 'Precedent', fr: 'Précédent', es: 'Anterior', en: 'Previous', ca: 'Anterior' },
		seg: { oc: 'Seguent', fr: 'Suivant', es: 'Siguiente', en: 'Next', ca: 'Següent' }
	};

	let index = $state(0);
	let trackEl = $state();
	let slideEls = $state([]);

	function centerOn(i, behavior = 'smooth') {
		if (!trackEl) return;
		const el = slideEls[i];
		if (!el) return;
		const target = el.offsetLeft + el.offsetWidth / 2 - trackEl.clientWidth / 2;
		trackEl.scrollTo({ left: target, behavior });
	}

	// Applique le flou/l'échelle en fonction de la distance au centre. Écrit
	// directement dans le style plutôt que via des classes : c'est une
	// valeur continue, pas un état binaire.
	function paint() {
		if (!trackEl) return;
		const mid = trackEl.scrollLeft + trackEl.clientWidth / 2;
		let best = 0;
		let bestDist = Infinity;

		slideEls.forEach((el, i) => {
			if (!el) return;
			const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
			// Normalisé sur une largeur de carte : 0 = au centre, 1 = une
			// carte plus loin, borné pour que les cartes très éloignées ne
			// deviennent pas invisibles.
			const t = Math.min(1, d / (el.offsetWidth || 1));
			el.style.setProperty('--away', t.toFixed(3));
			if (d < bestDist) {
				bestDist = d;
				best = i;
			}
		});

		index = best;
	}

	$effect(() => {
		// Premier calcul une fois les cartes mesurables.
		paint();
	});

	// Glissement à la souris : sans ça, la molette verticale ne fait rien
	// sur un défilement horizontal, et l'utilisateur croit que c'est bloqué.
	let dragging = false;
	let startX = 0;
	let startScroll = 0;
	let moved = 0;

	function onPointerDown(e) {
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		dragging = true;
		moved = 0;
		startX = e.clientX;
		startScroll = trackEl.scrollLeft;
		trackEl.setPointerCapture?.(e.pointerId);
	}

	function onPointerMove(e) {
		if (!dragging) return;
		const dx = e.clientX - startX;
		moved = Math.max(moved, Math.abs(dx));
		trackEl.scrollLeft = startScroll - dx;
	}

	function onPointerUp(e) {
		if (!dragging) return;
		dragging = false;
		trackEl.releasePointerCapture?.(e.pointerId);
		// Recale sur la carte la plus proche une fois le doigt levé.
		centerOn(index);
	}

	// Un clic ne doit centrer que si l'utilisateur n'était pas en train de
	// faire glisser (sinon relâcher après un glissement centrerait au
	// hasard sous le curseur).
	function onSlideClick(i) {
		if (moved > 6) return;
		centerOn(i);
	}

	function onKey(e) {
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			centerOn(Math.min(index + 1, slides.length - 1));
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			centerOn(Math.max(index - 1, 0));
		}
	}
</script>

<div class="carousel">
	<div
		class="track"
		class:dragging
		bind:this={trackEl}
		onscroll={paint}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		onkeydown={onKey}
		tabindex="0"
		role="listbox"
		aria-label={T.serie[lang] ?? T.serie.oc}
	>
		{#each slides as s, i (s.src)}
			<button
				type="button"
				class="slide"
				bind:this={slideEls[i]}
				onclick={() => onSlideClick(i)}
				role="option"
				aria-selected={i === index}
				aria-label={`${i + 1}. ${s[lang] ?? s.oc}`}
			>
				<img src={s.src} alt="" loading={i < 3 ? 'eager' : 'lazy'} draggable="false" />
				<span class="caption">
					<span class="slide-num">{String(i + 1).padStart(2, '0')}</span>
					<span class="slide-name">{s[lang] ?? s.oc}</span>
				</span>
			</button>
		{/each}
	</div>

	<div class="controls">
		<button
			type="button"
			onclick={() => centerOn(index - 1)}
			disabled={index === 0}
			aria-label={T.prec[lang] ?? T.prec.oc}><Icona nom="precedent" size="1.2em" /></button
		>
		<div class="dots">
			{#each slides as s, i (s.src)}
				<button
					type="button"
					class="dot"
					class:on={i === index}
					onclick={() => centerOn(i)}
					aria-label={`${i + 1}. ${s[lang] ?? s.oc}`}
				></button>
			{/each}
		</div>
		<button
			type="button"
			onclick={() => centerOn(index + 1)}
			disabled={index === slides.length - 1}
			aria-label={T.seg[lang] ?? T.seg.oc}><Icona nom="suivant" size="1.2em" /></button
		>
	</div>
</div>

<style>
	.carousel {
		margin: 2.5rem auto 0;
	}

	.track {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		/* Marge latérale d'une demi-largeur d'écran : la première et la
		   dernière carte peuvent ainsi atteindre le centre. */
		padding: 1.5rem max(1rem, calc(50% - 10rem)) 2rem;
		scrollbar-width: none;
		cursor: grab;
		overscroll-behavior-x: contain;
	}

	.track.dragging {
		cursor: grabbing;
		scroll-snap-type: none;
	}

	.track::-webkit-scrollbar {
		display: none;
	}

	.track:focus-visible {
		outline: 2px solid var(--color-brick);
		outline-offset: 4px;
		border-radius: 20px;
	}

	.slide {
		flex: 0 0 auto;
		width: min(20rem, 72vw);
		padding: 0;
		border: none;
		background: none;
		text-align: left;
		scroll-snap-align: center;
		cursor: pointer;
		/* --away : 0 au centre, 1 loin. Pilote flou, échelle et opacité
		   d'un seul coup, en continu. */
		filter: blur(calc(var(--away, 1) * 3.5px));
		opacity: calc(1 - var(--away, 1) * 0.45);
		transform: scale(calc(1 - var(--away, 1) * 0.12));
		transition: filter 120ms linear;
	}

	.slide img {
		width: 100%;
		display: block;
		border-radius: 16px;
		box-shadow: 0 12px 30px rgba(58, 42, 32, calc(0.1 + (1 - var(--away, 1)) * 0.18));
		user-select: none;
	}

	.caption {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-top: 0.7rem;
	}

	.slide-num {
		font-family: var(--font-heading);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		opacity: 0.5;
	}

	.slide-name {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--color-brick);
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
		transition:
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 150ms ease;
	}

	.controls > button:hover:not(:disabled) {
		transform: scale(1.1);
	}

	.controls > button:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.dots {
		display: flex;
		gap: 0.4rem;
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		padding: 0;
		border: none;
		border-radius: 999px;
		background: rgba(58, 42, 32, 0.25);
		cursor: pointer;
		transition:
			background 200ms ease,
			width 200ms ease;
	}

	.dot.on {
		width: 1.4rem;
		background: var(--color-brick);
	}

	@media (prefers-reduced-motion: reduce) {
		.slide {
			filter: none;
			transform: none;
			opacity: 1;
		}
	}
</style>
