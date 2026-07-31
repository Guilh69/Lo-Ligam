<script>
	import { browser } from '$app/environment';
	import { scramble } from '$lib/actions/scramble';
	import logo from '$lib/assets/logo.png';
	import MenuIcon from '$lib/components/MenuIcon.svelte';
	import BookIcon from '$lib/components/BookIcon.svelte';
	import OccitaniaIcon from '$lib/components/OccitaniaIcon.svelte';
	import CommunityIcon from '$lib/components/CommunityIcon.svelte';
	import QuillIcon from '$lib/components/QuillIcon.svelte';
	import CrossIcon from '$lib/components/CrossIcon.svelte';
	import EnvelopeIcon from '$lib/components/EnvelopeIcon.svelte';
	import { siteSections, externalLinks } from '$lib/data/siteSections';

	const sectionIcons = {
		book: BookIcon,
		occitania: OccitaniaIcon,
		community: CommunityIcon,
		quill: QuillIcon,
		cross: CrossIcon,
		envelope: EnvelopeIcon
	};

	let lang = $state('oc');
	let sectionsOpen = $state(false);

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

	// Les vagues du bas s'écartent et s'effacent progressivement au scroll,
	// plutôt que de disparaître d'un coup — même logique que le carrousel.
	const landscapeFadeDistance = 360;
	let landscapeProgress = $derived(Math.min(1, scrollY / landscapeFadeDistance));

	// La souris fait légèrement "pencher" les vagues vers elle (parallaxe),
	// désactivé une fois les vagues effacées pour ne jamais gêner le
	// contenu réel qui défile en dessous.
	let waveMouseX = $state(0);
	let waveMouseY = $state(0);

	function handleWaveMove(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		waveMouseX = (event.clientX - rect.left) / rect.width - 0.5;
		waveMouseY = (event.clientY - rect.top) / rect.height - 0.5;
	}

	function resetWaveMouse() {
		waveMouseX = 0;
		waveMouseY = 0;
	}

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

<svg
	class="landscape"
	viewBox="0 0 1440 220"
	preserveAspectRatio="none"
	aria-hidden="true"
	style="opacity: {1 - landscapeProgress}; pointer-events: {landscapeProgress < 1 ? 'auto' : 'none'}"
	onpointermove={handleWaveMove}
	onpointerleave={resetWaveMouse}
>
	<g class="wave-outer" style="transform: translateY({-landscapeProgress * 28}px)">
		<g class="wave-mouse" style="transform: translate({waveMouseX * 16}px, {waveMouseY * 9}px)">
			<g class="wave-bob wave-bob-1">
				<path
					d="M0,120 C240,180 480,60 720,100 C960,140 1200,40 1440,90 L1440,220 L0,220 Z"
					fill="var(--color-brick)"
					opacity="0.5"
				/>
			</g>
		</g>
	</g>
	<g class="wave-outer" style="transform: translateY({landscapeProgress * 34}px)">
		<g class="wave-mouse" style="transform: translate({waveMouseX * 28}px, {waveMouseY * 16}px)">
			<g class="wave-bob wave-bob-2">
				<path
					d="M0,160 C240,200 480,120 720,150 C960,180 1200,110 1440,140 L1440,220 L0,220 Z"
					fill="var(--color-terracotta)"
				/>
			</g>
		</g>
	</g>
</svg>

<header class="topbar" bind:this={topbarEl}>
	<div class="topbar-brand">
		<span class="mini-logo"><img src={logo} alt="" /></span>
		<span class="brand-name">Lo Ligam</span>
	</div>
	<button
		type="button"
		class="menu-toggle"
		onclick={() => (sectionsOpen = !sectionsOpen)}
		aria-label={sectionsOpen ? 'Tampar lo menú' : 'Dobrir lo menú'}
		aria-expanded={sectionsOpen}
	>
		{#if sectionsOpen}
			<span class="menu-close">×</span>
		{:else}
			<MenuIcon size={20} />
		{/if}
		<span class="menu-label">Menú</span>
	</button>
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

{#if sectionsOpen}
	<div class="sections-panel" role="dialog" aria-modal="true" aria-label="Menú del site">
		<div class="sections-grid">
			{#each siteSections as s (s.id)}
				{@const Icon = sectionIcons[s.icon]}
				{#if s.status === 'live'}
					<a
						class="section-card"
						href={s.href}
						style="--section-color: {s.color}"
						onclick={() => (sectionsOpen = false)}
					>
						<span class="shine" aria-hidden="true"></span>
						<span class="section-icon"><Icon size={22} /></span>
						<span class="section-primary" use:scramble={{ oc: s.oc, fr: s.fr, lang }}></span>
						<span class="section-secondary" use:scramble={{ oc: s.fr, fr: s.oc, lang }}></span>
						<span
							class="section-desc"
							use:scramble={{ oc: s.desc_oc, fr: s.desc_fr, lang }}
						></span>
					</a>
				{:else}
					<div class="section-card soon" style="--section-color: {s.color}" aria-disabled="true">
						<span class="section-icon"><Icon size={22} /></span>
						<span class="section-primary" use:scramble={{ oc: s.oc, fr: s.fr, lang }}></span>
						<span class="section-secondary" use:scramble={{ oc: s.fr, fr: s.oc, lang }}></span>
						<span
							class="section-desc"
							use:scramble={{ oc: s.desc_oc, fr: s.desc_fr, lang }}
						></span>
						<span class="soon-tag" use:scramble={{ oc: 'Lèu', fr: 'Bientôt', lang }}></span>
					</div>
				{/if}
			{/each}
		</div>

		<div class="sections-external">
			<p class="external-title" use:scramble={{
					oc: 'Ressorsas occitanas',
					fr: 'Ressources occitanes',
					lang
				}}></p>
			<div class="external-links">
				{#each externalLinks as l (l.href)}
					<a class="external-card" href={l.href} target="_blank" rel="noopener noreferrer">
						<span class="shine" aria-hidden="true"></span>
						<span class="external-label">{l.label} ↗</span>
						<span use:scramble={{ oc: l.desc_oc, fr: l.desc_fr, lang }}></span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Lien de test temporaire, à retirer avant la publication -->
		<a class="test-link" href="/dev-test-questionnaire">Questionnari (tèst)</a>
	</div>
{/if}

<main class="page">
	<section class="hero">
		<div class="brand-card" bind:this={brandCardEl}>
			<img src={logo} alt="Lo Ligam" />
		</div>

		<div class="welcome">
			<p class="tagline-primary" use:scramble={{ oc: t.tagline.oc, fr: t.tagline.fr, lang }}></p>
			<p class="tagline-secondary">
				<em use:scramble={{ oc: `(${t.tagline.fr})`, fr: `(${t.tagline.oc})`, lang }}></em>
			</p>
		</div>

		<a class="btn-primary" href="/aprene">Aprèni l'occitan !</a>
	</section>

	<section class="feature">
		<div class="feature-text">
			<p
				class="feature-tag"
				use:scramble={{ oc: t.feature1.tag.oc, fr: t.feature1.tag.fr, lang }}
			></p>
			<h2
				class="feature-title"
				use:scramble={{ oc: t.feature1.title.oc, fr: t.feature1.title.fr, lang }}
			></h2>
			<p
				class="feature-body"
				use:scramble={{ oc: t.feature1.body.oc, fr: t.feature1.body.fr, lang }}
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
				use:scramble={{ oc: t.feature2.tag.oc, fr: t.feature2.tag.fr, lang }}
			></p>
			<h2
				class="feature-title"
				use:scramble={{ oc: t.feature2.title.oc, fr: t.feature2.title.fr, lang }}
			></h2>
			<p
				class="feature-body"
				use:scramble={{ oc: t.feature2.body.oc, fr: t.feature2.body.fr, lang }}
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
			use:scramble={{ oc: t.statement.oc, fr: t.statement.fr, lang }}
		></p>
		<p class="statement-secondary">
			<em use:scramble={{ oc: `(${t.statement.fr})`, fr: `(${t.statement.oc})`, lang }}></em>
		</p>
	</section>

	<section class="values">
		{#each t.values as value}
			<div class="value">
				<p class="value-tag" use:scramble={{ oc: value.tag.oc, fr: value.tag.fr, lang }}></p>
				<p class="value-text" use:scramble={{ oc: value.text.oc, fr: value.text.fr, lang }}></p>
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
				<p class="trio-title" use:scramble={{ oc: card.title.oc, fr: card.title.fr, lang }}></p>
				<p class="trio-text" use:scramble={{ oc: card.text.oc, fr: card.text.fr, lang }}></p>
			</a>
		{/each}
	</section>

	<footer class="site-footer">
		<div class="footer-top">
			<div class="footer-about">
				<div class="footer-brand-row">
					<span class="mini-logo"><img src={logo} alt="" /></span>
					<span class="footer-brand">Lo Ligam</span>
				</div>
				<p class="footer-tag" use:scramble={{ oc: t.footer.oc, fr: t.footer.fr, lang }}></p>
				<a
					class="footer-social"
					href="https://www.instagram.com/lo_ligam/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Instagram ↗
				</a>
			</div>

			<div class="footer-col">
				<p class="footer-col-title" use:scramble={{ oc: 'Explorar', fr: 'Explorer', lang }}></p>
				<ul>
					{#each siteSections as s (s.id)}
						{@const Icon = sectionIcons[s.icon]}
						<li>
							{#if s.status === 'live'}
								<a class="footer-link" href={s.href} style="--section-color: {s.color}">
									<span class="footer-icon"><Icon size={15} /></span>
									<span use:scramble={{ oc: s.oc, fr: s.fr, lang }}></span>
								</a>
							{:else}
								<span
									class="footer-link soon-inline"
									style="--section-color: {s.color}"
								>
									<span class="footer-icon"><Icon size={15} /></span>
									<span use:scramble={{ oc: s.oc, fr: s.fr, lang }}></span>
									<em use:scramble={{ oc: '· Lèu', fr: '· Bientôt', lang }}></em>
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>

			<div class="footer-col">
				<p class="footer-col-title" use:scramble={{ oc: 'Ressorsas', fr: 'Ressources', lang }}
				></p>
				<ul>
					{#each externalLinks as l (l.href)}
						<li>
							<a class="footer-link" href={l.href} target="_blank" rel="noopener noreferrer"
								>{l.label} ↗</a
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="footer-legal">
			<p>© 2026 Lo Ligam</p>
			<div class="footer-legal-links">
				<span class="soon-inline"
					><span use:scramble={{ oc: 'Mentions legalas', fr: 'Mentions légales', lang }}
					></span><em use:scramble={{ oc: '· Lèu', fr: '· Bientôt', lang }}></em></span
				>
				<span class="soon-inline"
					><span use:scramble={{ oc: 'Confidencialitat', fr: 'Confidentialité', lang }}
					></span><em use:scramble={{ oc: '· Lèu', fr: '· Bientôt', lang }}></em></span
				>
				<span class="soon-inline"
					><span use:scramble={{ oc: 'Accessibilitat', fr: 'Accessibilité', lang }}
					></span><em use:scramble={{ oc: '· Lèu', fr: '· Bientôt', lang }}></em></span
				>
			</div>
		</div>
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
		transition: opacity 200ms linear;
	}

	.wave-outer {
		transition: transform 200ms linear;
	}

	/* Suit la souris avec un peu d'inertie (easing plus lent que le
	   scroll) pour un effet de profondeur discret, jamais brusque. */
	.wave-mouse {
		transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* Mouvement organique en dérive, jamais synchronisé entre les deux
	   vagues (durées, déphasage et trajets différents), pour éviter tout
	   effet de rebond mécanique. */
	.wave-bob-1 {
		animation: wave-bob-1 14s ease-in-out infinite;
	}

	.wave-bob-2 {
		animation: wave-bob-2 18s ease-in-out infinite;
		animation-delay: -7s;
	}

	@keyframes wave-bob-1 {
		0% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(9px, -4px);
		}
		50% {
			transform: translate(3px, -8px);
		}
		75% {
			transform: translate(-7px, -2px);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	@keyframes wave-bob-2 {
		0% {
			transform: translate(0, 0);
		}
		30% {
			transform: translate(-8px, 3px);
		}
		60% {
			transform: translate(-2px, 6px);
		}
		85% {
			transform: translate(6px, 2px);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wave-bob-1,
		.wave-bob-2 {
			animation: none;
		}

		.wave-mouse {
			transition: none;
			transform: none !important;
		}
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
		margin-left: auto;
	}

	.menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		height: 2.4rem;
		flex-shrink: 0;
		margin-left: 1.75rem;
		border: none;
		border-radius: 999px;
		padding: 0 0.9rem;
		background: rgba(165, 52, 42, 0.1);
		color: var(--color-brick);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.menu-toggle:hover {
		background: rgba(165, 52, 42, 0.18);
		transform: scale(1.04);
	}

	.menu-close {
		font-size: 1.2rem;
		line-height: 1;
	}

	@media (max-width: 30rem) {
		.menu-label {
			display: none;
		}

		.menu-toggle {
			margin-left: auto;
		}

		.topbar {
			padding: 0.9rem 0.85rem;
			gap: 0.4rem;
		}

		.topbar-actions {
			gap: 0.45rem;
		}

		.btn-small {
			padding: 0.55rem 0.85rem;
			font-size: 0.85rem;
		}
	}

	.test-link {
		display: inline-block;
		margin-top: 0.5rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-brick);
		text-decoration: none;
		border: 1px dashed rgba(165, 52, 42, 0.4);
		padding: 0.3rem 0.6rem;
		border-radius: 999px;
		white-space: nowrap;
	}

	.test-link:hover {
		background: rgba(165, 52, 42, 0.08);
	}

	.carta-link:hover {
		background: rgba(31, 95, 99, 0.18);
		transform: scale(1.06);
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

	.sections-panel {
		position: sticky;
		top: 64px;
		z-index: 9;
		background: rgba(245, 234, 216, 0.98);
		backdrop-filter: blur(10px);
		box-shadow: 0 16px 30px rgba(58, 42, 32, 0.15);
		padding: 1.5rem;
		animation: card-in 220ms ease-out;
	}

	.sections-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
		gap: 0.75rem;
		max-width: 60rem;
		margin: 0 auto;
	}

	.section-card {
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		background: white;
		border-radius: 16px;
		padding: 0.9rem 1.1rem;
		text-decoration: none;
		color: inherit;
		border-left: 4px solid var(--section-color, var(--color-terracotta));
		box-shadow: 0 6px 16px rgba(58, 42, 32, 0.08);
		transition:
			transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 180ms ease;
	}

	.section-card:not(.soon):hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 22px rgba(58, 42, 32, 0.14);
	}

	.section-card.soon {
		background: rgba(255, 255, 255, 0.5);
		box-shadow: none;
		border: 1px dashed rgba(58, 42, 32, 0.18);
		border-left-width: 4px;
		opacity: 0.75;
		cursor: not-allowed;
	}

	/* Reflet qui balaie la carte au survol : un dégradé diagonal, caché
	   hors du cadre (overflow:hidden sur .section-card), qui traverse de
	   gauche à droite quand on passe la souris. */
	.shine {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(
			115deg,
			transparent 30%,
			rgba(255, 255, 255, 0.55) 47%,
			rgba(255, 255, 255, 0.55) 53%,
			transparent 70%
		);
		transform: translateX(-120%);
	}

	.section-card:hover .shine,
	.external-card:hover .shine {
		transform: translateX(120%);
		transition: transform 750ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.section-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		height: 2.2rem;
		margin-bottom: 0.3rem;
		border-radius: 10px;
		color: var(--section-color, var(--color-terracotta));
		background: color-mix(in srgb, var(--section-color, var(--color-terracotta)) 14%, transparent);
	}

	.section-primary {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--section-color, var(--color-brick));
	}

	.section-secondary {
		font-size: 0.78rem;
		color: var(--color-teal);
	}

	.section-desc {
		margin-top: 0.25rem;
		font-size: 0.8rem;
		line-height: 1.35;
		color: var(--color-text);
		opacity: 0.85;
	}

	.soon-tag {
		margin-top: 0.4rem;
		align-self: flex-start;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: rgba(58, 42, 32, 0.55);
		background: rgba(58, 42, 32, 0.08);
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
	}

	.sections-external {
		max-width: 60rem;
		margin: 1.25rem auto 0;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(58, 42, 32, 0.12);
	}

	.external-title {
		margin: 0 0 0.6rem;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-teal);
	}

	.external-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.external-card {
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		background: white;
		border-radius: 12px;
		padding: 0.6rem 0.9rem;
		text-decoration: none;
		color: var(--color-brick);
		font-weight: 600;
		font-size: 0.88rem;
		box-shadow: 0 4px 12px rgba(58, 42, 32, 0.08);
		transition: transform 150ms ease;
	}

	.external-card:hover {
		transform: translateY(-2px);
	}

	.external-label {
		font-weight: 600;
	}

	.external-links a:hover {
		transform: translateY(-2px);
	}

	.external-links a em {
		font-weight: 400;
		font-style: normal;
		color: var(--color-text);
		font-size: 0.76rem;
		opacity: 0.8;
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
		padding: 2rem 1.5rem calc(2rem + 100px);
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
		text-wrap: balance;
	}

	.tagline-secondary {
		margin: 0;
		font-size: 1.05rem;
		color: var(--color-teal);
		text-wrap: pretty;
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
		text-wrap: balance;
	}

	.feature-body {
		margin: 0;
		text-wrap: pretty;
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
		text-wrap: balance;
	}

	.statement-secondary {
		margin: 0;
		color: rgba(255, 255, 255, 0.85);
		font-size: 1.1rem;
		text-wrap: pretty;
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
		text-wrap: pretty;
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
		text-wrap: pretty;
	}

	.site-footer {
		position: relative;
		background: var(--color-text);
		color: var(--color-cream);
		padding: 3rem 1.5rem 8rem;
		margin-top: 2rem;
	}

	.footer-top {
		max-width: 60rem;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.3fr 1fr 1fr;
		gap: 2.5rem;
		text-align: left;
	}

	.footer-brand-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.6rem;
	}

	.footer-brand {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.15rem;
		color: white;
	}

	.footer-tag {
		margin: 0 0 0.9rem;
		font-size: 0.85rem;
		color: rgba(245, 234, 216, 0.75);
		text-wrap: pretty;
		max-width: 22rem;
	}

	.footer-social {
		display: inline-block;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-gold);
		text-decoration: none;
	}

	.footer-social:hover {
		text-decoration: underline;
	}

	.footer-col-title {
		margin: 0 0 0.75rem;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-gold);
	}

	.footer-col-title em {
		text-transform: none;
		font-weight: 400;
		letter-spacing: normal;
		color: rgba(245, 234, 216, 0.6);
	}

	.footer-col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.footer-link {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: rgba(245, 234, 216, 0.9);
		text-decoration: none;
		font-size: 0.9rem;
	}

	.footer-link:hover {
		color: var(--color-gold);
	}

	.footer-icon {
		display: inline-flex;
		color: var(--section-color, var(--color-gold));
		flex-shrink: 0;
	}

	.soon-inline em {
		font-weight: 400;
		font-style: normal;
		opacity: 0.65;
		font-size: 0.82em;
		margin-left: 0.3em;
	}

	.soon-inline {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.9rem;
		color: rgba(245, 234, 216, 0.55);
	}

	.footer-legal {
		max-width: 60rem;
		margin: 2.5rem auto 0;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(245, 234, 216, 0.15);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.footer-legal p {
		margin: 0;
		font-size: 0.8rem;
		color: rgba(245, 234, 216, 0.6);
	}

	.footer-legal-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.1rem;
	}

	.footer-legal-links .soon-inline {
		font-size: 0.8rem;
	}

	@media (max-width: 45rem) {
		.footer-top {
			grid-template-columns: 1fr;
			gap: 1.75rem;
		}
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
