<script>
	import { browser } from '$app/environment';

	// Trois rangées d'illustrations qui défilent lentement en fond, floutées,
	// avec une « loupe » nette qui suit la souris sur la vignette survolée.
	// La position verticale des rangées est décidée par la page (elle doit
	// s'accorder au logo), d'où rowTops en propriété.
	let { rowTops = [0, 0, 0], scrollY = 0 } = $props();

	const fadeDistance = 500;
	let opacity = $derived(Math.max(0, 1 - scrollY / fadeDistance));

	const bgImages = Array.from(
		{ length: 28 },
		(_, i) => `/bg/design-${String(i + 1).padStart(2, '0')}.webp`
	);

	function shuffle(arr) {
		const a = [...arr];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	// Ordre fixe par défaut (identique serveur/client) pour que les rangées
	// soient déjà pleines dès le tout premier rendu, sans "trou" le temps
	// que le JS s'active. Le mélange aléatoire arrive juste après, en
	// remplaçant seulement les src des images déjà en place (pas de flash).
	let bgRows = $state([bgImages.slice(0, 9), bgImages.slice(9, 19), bgImages.slice(19, 28)]);

	$effect(() => {
		if (!browser) return;
		const shuffled = shuffle(bgImages);
		bgRows = [shuffled.slice(0, 9), shuffled.slice(9, 19), shuffled.slice(19, 28)];
	});

	function updateLens(event) {
		const item = event.currentTarget;
		const rect = item.getBoundingClientRect();
		item.style.setProperty('--mx', event.clientX - rect.left + 'px');
		item.style.setProperty('--my', event.clientY - rect.top + 'px');
	}

	function clearLens(event) {
		event.currentTarget.style.removeProperty('--mx');
		event.currentTarget.style.removeProperty('--my');
	}

	let rowEls = $state([]);
	const rowSpeeds = [16, -13, 19]; // px/s ; signe = sens du défilement

	$effect(() => {
		if (!browser) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const els = rowEls;
		// Largeur d'un seul jeu d'images mesurée une seule fois : la lire à
		// chaque frame forcerait le navigateur à recalculer la mise en page
		// ~60 fois par seconde (source classique de saccades).
		const singleWidths = els.map((el) => (el ? el.scrollWidth / 4 : 0));
		const positions = [0, 0, 0];
		let lastTime;
		let rafId;

		function tick(now) {
			if (lastTime === undefined) lastTime = now;
			// Borne le pas de temps : si l'onglet a été mis en arrière-plan,
			// évite un grand saut visuel au retour.
			const dt = Math.min((now - lastTime) / 1000, 0.1);
			lastTime = now;

			els.forEach((el, idx) => {
				const singleWidth = singleWidths[idx];
				if (!el || !singleWidth) return;
				positions[idx] += rowSpeeds[idx] * dt;
				const wrapped = ((positions[idx] % singleWidth) + singleWidth) % singleWidth;
				el.style.transform = `translateX(${-wrapped}px)`;
			});

			rafId = requestAnimationFrame(tick);
		}

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	});
</script>

<div class="bg-carousel" aria-hidden="true" style="opacity: {opacity}">
	{#each bgRows as row, i}
		<div class="bg-row" bind:this={rowEls[i]} style="top: {rowTops[i]}px">
			{#each [...row, ...row, ...row, ...row] as src, j (i + '-' + j)}
				<span class="bg-item" onpointermove={updateLens} onpointerleave={clearLens}>
					<img class="bg-img-blur" {src} alt="" />
					<img class="bg-img-sharp" {src} alt="" />
				</span>
			{/each}
		</div>
	{/each}
</div>

<style>
	.bg-carousel {
		position: fixed;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0%,
			black 8%,
			black 92%,
			transparent 100%
		);
		mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
	}

	.bg-row {
		position: absolute;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 1.75rem;
		width: max-content;
		will-change: transform;
	}

	.bg-item {
		position: relative;
		width: 132px;
		height: 132px;
		flex-shrink: 0;
	}

	.bg-img-blur,
	.bg-img-sharp {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 18px;
		box-shadow: 0 6px 16px rgba(58, 42, 32, 0.18);
	}

	.bg-img-blur {
		filter: blur(3.5px);
	}

	/* Écart plus net avec la version floue (contraste/saturation/luminosité
	   nettement relevés) pour que la zone survolée se voie vraiment comme
	   "mise au point", pas juste un peu moins floue. */
	.bg-img-sharp {
		clip-path: circle(0px at var(--mx, 50%) var(--my, 50%));
		transition: clip-path 30ms linear;
		filter: contrast(1.35) saturate(1.5) brightness(1.05);
	}

	.bg-item:hover .bg-img-sharp {
		clip-path: circle(84px at var(--mx, 50%) var(--my, 50%));
	}
</style>
