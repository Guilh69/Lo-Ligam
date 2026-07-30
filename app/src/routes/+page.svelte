<script>
	import { browser } from '$app/environment';
	import { scramble } from '$lib/actions/scramble';
	import logo from '$lib/assets/logo.png';

	let lang = $state('oc');

	// Textes bilingues de la page d'accueil. Le contenu occitan est à
	// valider par Romain (locuteur natif) avant publication finale — voir
	// mémoire de session sur la pratique de validation du contenu.
	const t = {
		tagline: {
			oc: "Benvenguda ! Apren l'occitan, teis lo ligam amb sa cultura.",
			fr: 'Bienvenue ! Apprends l’occitan, tisse le lien avec sa culture.'
		},
		feature1: {
			tag: { oc: 'Fièrs de la lenga', fr: 'Fiers de la langue' },
			title: {
				oc: "Una lenga a l'ora del mond modèrne.",
				fr: 'Une langue à l’heure du monde moderne.'
			},
			body: {
				oc: "Pels occitans : un espleit bèl e seriós, a l'ausada de las mai grandas aplicacions, per tornar prene una lenga qu'es ja vòstra — sens nostalgia, amb fiertat.",
				fr: 'Pour les occitans : un outil beau et sérieux, à la hauteur des plus grandes applications, pour se réapproprier une langue qui est la vôtre — sans nostalgie, avec fierté.'
			}
		},
		feature2: {
			tag: { oc: "Descobrir l'Occitània", fr: 'Découvrir l’Occitanie' },
			title: {
				oc: 'Una pòrta dobèrta sus un país entièr.',
				fr: 'Une porte ouverte sur un pays entier.'
			},
			body: {
				oc: "Pels curioses : una pòrta d'entrada cap a l'Occitània, sa lenga, son istòria e son territòri — plan mai qu'un vocabulari, tot un país d'explorar.",
				fr: 'Pour les curieux : une porte d’entrée vers l’Occitanie, sa langue, son histoire et son territoire — bien plus qu’un vocabulaire, tout un pays à explorer.'
			}
		},
		statement: {
			oc: 'Una lenga viva, pas un musèu.',
			fr: 'Une langue vivante, pas un musée.'
		},
		values: [
			{
				tag: { oc: 'Ètica', fr: 'Éthique' },
				text: {
					oc: 'Vòstras donadas son pas vendudas, ni pistadas.',
					fr: 'Vos données ne sont ni vendues, ni pistées.'
				}
			},
			{
				tag: { oc: 'Ecologia', fr: 'Écologie' },
				text: {
					oc: 'Un site sobri, albergat en Euròpa, pensat per pesar leugièr.',
					fr: 'Un site sobre, hébergé en Europe, pensé pour peser léger.'
				}
			},
			{
				tag: { oc: 'Inclusivitat', fr: 'Inclusivité' },
				text: {
					oc: "Gratuit dins son còr, per jamai exclure per l'argent.",
					fr: 'Gratuit dans son cœur, pour ne jamais exclure par l’argent.'
				}
			}
		],
		trio: [
			{
				title: { oc: 'Ensag gratuit', fr: 'Essai gratuit' },
				text: {
					oc: 'Una leiçon gratuita, sens compte, per tastar abans de te lançar.',
					fr: 'Une leçon gratuite, sans compte, pour goûter avant de te lancer.'
				},
				href: '/aprene/essai'
			},
			{
				title: { oc: 'Ai ja un compte', fr: 'J’ai déjà un compte' },
				text: {
					oc: 'Retròba ta progression e contunha ton aprendissatge.',
					fr: 'Retrouve ta progression et continue ton apprentissage.'
				},
				href: '/compte'
			},
			{
				title: { oc: 'Seguètz-nos', fr: 'Suivez-nous' },
				text: {
					oc: 'Retròba Lo Ligam sus Instagram entre doas leiçons.',
					fr: 'Retrouve Lo Ligam sur Instagram entre deux leçons.'
				},
				href: 'https://www.instagram.com/lo_ligam/',
				external: true
			}
		],
		footer: {
			oc: 'Fach amb amor en Occitània.',
			fr: 'Fait avec amour en Occitanie.'
		}
	};

	const bgImages = Array.from(
		{ length: 28 },
		(_, i) => `/bg/design-${String(i + 1).padStart(2, '0')}.png`
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

	let scrollY = $state(0);
	const fadeDistance = 500;
	let carouselOpacity = $derived(Math.max(0, 1 - scrollY / fadeDistance));

	let brandCardEl = $state();
	let topbarEl = $state();
	let centerY = $state(300);
	let topbarBottom = $state(64);

	function measureLayout() {
		if (brandCardEl) {
			const rect = brandCardEl.getBoundingClientRect();
			centerY = rect.top + rect.height / 2;
		}
		if (topbarEl) {
			topbarBottom = topbarEl.getBoundingClientRect().bottom;
		}
	}

	$effect(() => {
		if (!browser) return;
		measureLayout();
		document.fonts?.ready.then(measureLayout);
		window.addEventListener('resize', measureLayout);
		return () => window.removeEventListener('resize', measureLayout);
	});

	let viewportHeight = $state(800);

	$effect(() => {
		if (!browser) return;
		const onResize = () => (viewportHeight = window.innerHeight);
		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	const buffer = 40;
	const halfItemHeight = 66;
	let rowGap = $derived(
		Math.max(
			90,
			Math.min(
				260,
				centerY - topbarBottom - buffer - halfItemHeight,
				viewportHeight - centerY - buffer - halfItemHeight
			)
		)
	);
	let rowTops = $derived([centerY - rowGap, centerY, centerY + rowGap]);

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

	const rowSpeeds = [16, -13, 19]; // px/s ; sign = direction

	$effect(() => {
		if (!browser) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const els = [
			document.querySelector('.bg-row-1'),
			document.querySelector('.bg-row-2'),
			document.querySelector('.bg-row-3')
		];
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

<svelte:window bind:scrollY />

<div class="bg-carousel" aria-hidden="true" style="opacity: {carouselOpacity}">
	{#each bgRows as row, i}
		<div class="bg-row bg-row-{i + 1}" style="top: {rowTops[i]}px">
			{#each [...row, ...row, ...row, ...row] as src, j (i + '-' + j)}
				<span class="bg-item" onpointermove={updateLens} onpointerleave={clearLens}>
					<img class="bg-img-blur" {src} alt="" />
					<img class="bg-img-sharp" {src} alt="" />
				</span>
			{/each}
		</div>
	{/each}
</div>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
	<span class="blob blob-brick"></span>
</div>

<svg class="landscape" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
	<path
		d="M0,120 C240,180 480,60 720,100 C960,140 1200,40 1440,90 L1440,220 L0,220 Z"
		fill="var(--color-brick)"
		opacity="0.5"
	/>
	<path
		d="M0,160 C240,200 480,120 720,150 C960,180 1200,110 1440,140 L1440,220 L0,220 Z"
		fill="var(--color-terracotta)"
	/>
</svg>

<header class="topbar" bind:this={topbarEl}>
	<div class="topbar-brand">
		<span class="mini-logo"><img src={logo} alt="" /></span>
		<span class="brand-name">Lo Ligam</span>
	</div>
	<div class="topbar-actions">
		<div class="lang-toggle" role="group" aria-label="Lenga / Langue">
			<button type="button" class:active={lang === 'oc'} onclick={() => (lang = 'oc')}>Òc</button>
			<button type="button" class="fr" class:active={lang === 'fr'} onclick={() => (lang = 'fr')}
				>Fr</button
			>
		</div>
		<a class="btn-primary btn-small" href="/aprene">Començar</a>
	</div>
</header>

<main class="page">
	<section class="hero">
		<div class="brand-card" bind:this={brandCardEl}>
			<img src={logo} alt="Lo Ligam" />
		</div>

		<div class="welcome">
			<p class="tagline-primary" use:scramble={lang === 'oc' ? t.tagline.oc : t.tagline.fr}></p>
			<p class="tagline-secondary">
				<em use:scramble={`(${lang === 'oc' ? t.tagline.fr : t.tagline.oc})`}></em>
			</p>
		</div>

		<a class="btn-primary" href="/aprene">Aprèni l'occitan !</a>
	</section>

	<section class="feature">
		<div class="feature-text">
			<p class="feature-tag" use:scramble={lang === 'oc' ? t.feature1.tag.oc : t.feature1.tag.fr}
			></p>
			<h2
				class="feature-title"
				use:scramble={lang === 'oc' ? t.feature1.title.oc : t.feature1.title.fr}
			></h2>
			<p
				class="feature-body"
				use:scramble={lang === 'oc' ? t.feature1.body.oc : t.feature1.body.fr}
			></p>
		</div>
		<div class="feature-visual feature-visual--terracotta" aria-hidden="true">
			<svg class="watermark" viewBox="0 0 300 300">
				<rect x="122" y="55" width="56" height="95" rx="24" />
				<rect x="122" y="150" width="56" height="95" rx="24" />
				<rect x="55" y="122" width="95" height="56" rx="24" />
				<rect x="150" y="122" width="95" height="56" rx="24" />
				<rect x="122" y="122" width="56" height="56" rx="10" />
			</svg>
		</div>
	</section>

	<section class="feature feature--reverse">
		<div class="feature-text">
			<p
				class="feature-tag feature-tag--teal"
				use:scramble={lang === 'oc' ? t.feature2.tag.oc : t.feature2.tag.fr}
			></p>
			<h2
				class="feature-title"
				use:scramble={lang === 'oc' ? t.feature2.title.oc : t.feature2.title.fr}
			></h2>
			<p
				class="feature-body"
				use:scramble={lang === 'oc' ? t.feature2.body.oc : t.feature2.body.fr}
			></p>
		</div>
		<div class="feature-visual feature-visual--teal" aria-hidden="true">
			<svg class="watermark" viewBox="0 0 300 300">
				<rect x="122" y="55" width="56" height="95" rx="24" />
				<rect x="122" y="150" width="56" height="95" rx="24" />
				<rect x="55" y="122" width="95" height="56" rx="24" />
				<rect x="150" y="122" width="95" height="56" rx="24" />
				<rect x="122" y="122" width="56" height="56" rx="10" />
			</svg>
		</div>
	</section>

	<section class="statement">
		<p
			class="statement-primary"
			use:scramble={lang === 'oc' ? t.statement.oc : t.statement.fr}
		></p>
		<p class="statement-secondary">
			<em use:scramble={`(${lang === 'oc' ? t.statement.fr : t.statement.oc})`}></em>
		</p>
	</section>

	<section class="values">
		{#each t.values as value}
			<div class="value">
				<p class="value-tag" use:scramble={lang === 'oc' ? value.tag.oc : value.tag.fr}></p>
				<p class="value-text" use:scramble={lang === 'oc' ? value.text.oc : value.text.fr}></p>
			</div>
		{/each}
	</section>

	<section class="trio">
		{#each t.trio as card}
			<a
				class="trio-card"
				href={card.href}
				target={card.external ? '_blank' : undefined}
				rel={card.external ? 'noopener noreferrer' : undefined}
			>
				<p class="trio-title" use:scramble={lang === 'oc' ? card.title.oc : card.title.fr}></p>
				<p class="trio-text" use:scramble={lang === 'oc' ? card.text.oc : card.text.fr}></p>
			</a>
		{/each}
	</section>

	<footer class="site-footer">
		<p class="footer-brand">Lo Ligam</p>
		<p class="footer-tag" use:scramble={lang === 'oc' ? t.footer.oc : t.footer.fr}></p>
	</footer>
</main>

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
		margin-top: -66px;
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
		filter: blur(1.8px);
	}

	.bg-img-sharp {
		clip-path: circle(0px at var(--mx, 50%) var(--my, 50%));
		transition: clip-path 30ms linear;
		filter: contrast(1.15) saturate(1.2);
	}

	.bg-item:hover .bg-img-sharp {
		clip-path: circle(76px at var(--mx, 50%) var(--my, 50%));
	}

	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: 1;
		pointer-events: none;
		background: radial-gradient(
			circle at 50% 0%,
			rgba(250, 243, 230, 0.9) 0%,
			rgba(245, 234, 216, 0.86) 60%
		);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 420px;
		height: 420px;
		background: var(--color-gold);
		opacity: 0.35;
		top: -140px;
		left: -120px;
	}

	.blob-teal {
		width: 380px;
		height: 380px;
		background: var(--color-teal);
		opacity: 0.2;
		bottom: -100px;
		right: -100px;
	}

	.blob-brick {
		width: 300px;
		height: 300px;
		background: var(--color-brick);
		opacity: 0.15;
		top: 25%;
		right: 8%;
	}

	.landscape {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 180px;
		z-index: 2;
		pointer-events: none;
	}

	.topbar {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.9rem 1.5rem;
		background: rgba(245, 234, 216, 0.85);
		backdrop-filter: blur(10px);
	}

	.topbar-brand {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.mini-logo {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		overflow: hidden;
		display: block;
		box-shadow: 0 2px 8px rgba(165, 52, 42, 0.25);
	}

	.mini-logo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.brand-name {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.15rem;
		color: var(--color-text);
	}

	.topbar-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.lang-toggle {
		display: flex;
		gap: 0.35rem;
		background: white;
		padding: 0.3rem;
		border-radius: 999px;
		box-shadow: 0 2px 8px rgba(58, 42, 32, 0.12);
	}

	.lang-toggle button {
		border: none;
		background: transparent;
		color: var(--color-text);
		font-weight: 600;
		font-size: 0.85rem;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.lang-toggle button:hover {
		transform: scale(1.08);
	}

	.lang-toggle button:active {
		transform: scale(0.95);
	}

	.lang-toggle button.active {
		background: var(--color-terracotta);
		color: white;
	}

	.lang-toggle button.fr.active {
		background: var(--color-sky);
	}

	.page {
		position: relative;
		z-index: 3;
		pointer-events: none;
	}

	.page .welcome,
	.page a,
	.page button {
		pointer-events: auto;
	}

	.hero {
		min-height: calc(100dvh - 64px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		padding: 2rem 1.5rem;
		text-align: center;
		animation: fade-in 600ms ease-out;
	}

	.brand-card {
		width: 220px;
		height: 220px;
		border-radius: 30px;
		overflow: hidden;
		box-shadow: 0 16px 36px rgba(165, 52, 42, 0.3);
	}

	.brand-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.welcome {
		max-width: 34rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.tagline-primary {
		font-family: var(--font-heading);
		font-size: clamp(2.1rem, 4.5vw, 2.6rem);
		font-weight: 600;
		margin: 0;
		color: var(--color-text);
		line-height: 1.2;
	}

	.tagline-secondary {
		margin: 0;
		font-size: 1.05rem;
		color: var(--color-teal);
	}

	.btn-primary {
		display: inline-block;
		background: var(--color-gold);
		color: var(--color-text);
		border: none;
		padding: 1rem 1.75rem;
		border-radius: 999px;
		font-weight: 600;
		font-family: var(--font-heading);
		font-size: 1.1rem;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 220ms ease,
			filter 80ms ease;
		box-shadow: 0 6px 18px rgba(224, 164, 59, 0.45);
	}

	.btn-primary .arrow {
		display: inline-block;
		transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.btn-primary:hover {
		transform: translateY(-3px) scale(1.03);
		box-shadow: 0 10px 24px rgba(224, 164, 59, 0.55);
	}

	.btn-primary:hover .arrow {
		transform: translateX(4px);
	}

	.btn-primary:active {
		transform: translateY(0) scale(0.96);
		filter: brightness(0.95);
		transition-duration: 70ms;
	}

	.btn-small {
		padding: 0.55rem 1.15rem;
		font-size: 0.95rem;
		box-shadow: 0 4px 12px rgba(224, 164, 59, 0.4);
	}

	.feature {
		position: relative;
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		align-items: center;
		gap: 2.5rem;
		max-width: 72rem;
		margin: 0 auto;
		padding: 5rem 1.5rem;
	}

	.feature--reverse {
		direction: rtl;
	}

	.feature--reverse .feature-text {
		direction: ltr;
	}

	.feature-tag {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-brick);
		margin: 0 0 0.5rem;
	}

	.feature-tag--teal {
		color: var(--color-teal);
	}

	.feature-title {
		font-family: var(--font-heading);
		font-size: clamp(1.9rem, 3vw, 2.3rem);
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.75rem;
		line-height: 1.25;
	}

	.feature-body {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--color-text);
		max-width: 34rem;
	}

	.feature-visual {
		direction: ltr;
		aspect-ratio: 4 / 3;
		border-radius: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.feature-visual--terracotta {
		background: linear-gradient(155deg, var(--color-terracotta), var(--color-brick));
	}

	.feature-visual--teal {
		background: linear-gradient(155deg, var(--color-teal), #163e41);
	}

	.watermark {
		width: 60%;
		height: 60%;
	}

	.feature-visual--terracotta .watermark rect {
		fill: var(--color-gold);
		opacity: 0.5;
	}

	.feature-visual--teal .watermark rect {
		fill: var(--color-cream);
		opacity: 0.35;
	}

	.statement {
		position: relative;
		background: var(--color-terracotta);
		padding: 4.5rem 1.5rem;
		text-align: center;
	}

	.statement-primary {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4.5vw, 3rem);
		font-weight: 700;
		color: white;
		margin: 0 0 0.5rem;
	}

	.statement-secondary {
		margin: 0;
		color: rgba(255, 255, 255, 0.85);
		font-size: 1.1rem;
	}

	.values {
		position: relative;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		max-width: 60rem;
		margin: 0 auto;
		padding: 4rem 1.5rem 2rem;
		text-align: center;
	}

	.value-tag {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-olive);
		margin: 0 0 0.35rem;
	}

	.value-text {
		margin: 0;
		font-size: 0.9rem;
		color: var(--color-text);
	}

	.trio {
		position: relative;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.25rem;
		max-width: 60rem;
		margin: 0 auto;
		padding: 2rem 1.5rem 3rem;
	}

	.trio-card {
		display: block;
		background: rgba(255, 255, 255, 0.6);
		border: 1px solid rgba(165, 52, 42, 0.15);
		border-radius: 20px;
		padding: 1.5rem;
		text-align: left;
		text-decoration: none;
		color: inherit;
		transition:
			transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 200ms ease,
			border-color 200ms ease;
	}

	.trio-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 24px rgba(58, 42, 32, 0.12);
		border-color: rgba(165, 52, 42, 0.35);
	}

	.trio-card:active {
		transform: translateY(-1px) scale(0.98);
	}

	.trio-title {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.05rem;
		margin: 0 0 0.35rem;
		color: var(--color-brick);
	}

	.trio-text {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--color-text);
	}

	.site-footer {
		position: relative;
		text-align: center;
		padding: 2rem 1.5rem 10rem;
	}

	.footer-brand {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--color-text);
		margin: 0 0 0.25rem;
	}

	.footer-tag {
		margin: 0;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	@media (max-width: 45rem) {
		.feature,
		.feature--reverse {
			grid-template-columns: 1fr;
			direction: ltr;
			text-align: left;
			padding: 3rem 1.5rem;
		}

		.feature-visual {
			order: -1;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
