<script>
	// Série « Officialitat » : 9 visuels qui forment une démonstration
	// suivie sur le statut officiel de l'occitan. L'ordre compte (c'est un
	// raisonnement, pas une galerie), d'où un carrousel à navigation
	// explicite plutôt qu'un défilement automatique.
	let { lang = 'oc' } = $props();

	const slides = [
		{ src: '/officialitat/1_officialitat.webp', oc: 'Officialitat', fr: 'Officialité' },
		{ src: '/officialitat/2_visibilitat.webp', oc: 'Visibilitat', fr: 'Visibilité' },
		{ src: '/officialitat/3_ont.webp', oc: 'Ont ?', fr: 'Où ?' },
		{ src: '/officialitat/4_pluralitat.webp', oc: 'Pluralitat', fr: 'Pluralité' },
		{ src: '/officialitat/5_drech.webp', oc: 'Drech', fr: 'Droit' },
		{ src: '/officialitat/6_parlar.webp', oc: 'Parlar', fr: 'Parler' },
		{ src: '/officialitat/7_promoure.webp', oc: 'Promòure', fr: 'Promouvoir' },
		{ src: '/officialitat/8_origina.webp', oc: 'Origina', fr: 'Origine' },
		{ src: '/officialitat/9_senat.webp', oc: 'Senat', fr: 'Sénat' }
	];

	let index = $state(0);
	let trackEl = $state();

	function go(i) {
		index = Math.max(0, Math.min(i, slides.length - 1));
		const card = trackEl?.children[index];
		// scrollIntoView plutôt qu'un calcul de position : le navigateur
		// gère l'inertie et reste juste quelle que soit la largeur réelle.
		card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
	}

	// L'utilisateur peut aussi faire défiler à la main (tactile, trackpad) :
	// on resynchronise la pastille active sur ce qu'il a réellement amené
	// au centre, sinon les points mentiraient.
	function onScroll() {
		if (!trackEl) return;
		const mid = trackEl.scrollLeft + trackEl.clientWidth / 2;
		let best = 0;
		let bestDist = Infinity;
		[...trackEl.children].forEach((c, i) => {
			const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
			if (d < bestDist) {
				bestDist = d;
				best = i;
			}
		});
		index = best;
	}
</script>

<div class="carousel">
	<div
		class="track"
		bind:this={trackEl}
		onscroll={onScroll}
		tabindex="0"
		role="group"
		aria-label={lang === 'oc' ? 'Seria Officialitat' : 'Série Officialité'}
	>
		{#each slides as s, i (s.src)}
			<figure class="slide" class:active={i === index}>
				<img src={s.src} alt={lang === 'oc' ? s.oc : s.fr} loading={i < 2 ? 'eager' : 'lazy'} />
				<figcaption>
					<span class="slide-num">{String(i + 1).padStart(2, '0')}</span>
					<span class="slide-name">{lang === 'oc' ? s.oc : s.fr}</span>
				</figcaption>
			</figure>
		{/each}
	</div>

	<div class="controls">
		<button
			type="button"
			onclick={() => go(index - 1)}
			disabled={index === 0}
			aria-label={lang === 'oc' ? 'Precedent' : 'Précédent'}>←</button
		>
		<div class="dots">
			{#each slides as s, i (s.src)}
				<button
					type="button"
					class="dot"
					class:on={i === index}
					onclick={() => go(i)}
					aria-label={`${i + 1}. ${lang === 'oc' ? s.oc : s.fr}`}
					aria-current={i === index}
				></button>
			{/each}
		</div>
		<button
			type="button"
			onclick={() => go(index + 1)}
			disabled={index === slides.length - 1}
			aria-label={lang === 'oc' ? 'Seguent' : 'Suivant'}>→</button
		>
	</div>
</div>

<style>
	.carousel {
		max-width: 64rem;
		margin: 2.5rem auto 0;
	}

	/* Défilement horizontal avec accrochage : on peut naviguer aux
	   flèches, aux pastilles, au doigt ou au trackpad — les trois restent
	   synchronisés. */
	.track {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding: 0.5rem 1rem 1rem;
		scrollbar-width: none;
	}

	.track::-webkit-scrollbar {
		display: none;
	}

	.slide {
		flex: 0 0 auto;
		width: min(19rem, 68vw);
		margin: 0;
		scroll-snap-align: center;
		transition:
			transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 300ms ease;
		opacity: 0.55;
		transform: scale(0.94);
	}

	.slide.active {
		opacity: 1;
		transform: scale(1);
	}

	.slide img {
		width: 100%;
		display: block;
		border-radius: 16px;
		box-shadow: 0 12px 30px rgba(58, 42, 32, 0.22);
	}

	figcaption {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-top: 0.6rem;
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
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 0.5rem;
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
			transition: none;
		}
	}
</style>
