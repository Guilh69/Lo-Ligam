<script>
	import { browser } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { scramble } from '$lib/actions/scramble';
	import logo from '$lib/assets/logo.png';
	import MenuIcon from '$lib/components/MenuIcon.svelte';
	import BookIcon from '$lib/components/BookIcon.svelte';
	import OccitaniaIcon from '$lib/components/OccitaniaIcon.svelte';
	import CommunityIcon from '$lib/components/CommunityIcon.svelte';
	import QuillIcon from '$lib/components/QuillIcon.svelte';
	import CrossIcon from '$lib/components/CrossIcon.svelte';
	import EnvelopeIcon from '$lib/components/EnvelopeIcon.svelte';
	import BgCarousel from '$lib/components/BgCarousel.svelte';
	import PageBackground from '$lib/components/PageBackground.svelte';
	import WaveLandscape from '$lib/components/WaveLandscape.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { siteSections, externalLinks } from '$lib/data/siteSections';

	const sectionIcons = {
		book: BookIcon,
		occitania: OccitaniaIcon,
		community: CommunityIcon,
		quill: QuillIcon,
		cross: CrossIcon,
		envelope: EnvelopeIcon
	};

	// La langue vit maintenant dans un magasin partagé par tout le site,
	// plus dans l'état local de cette page.
	let lang = $derived(langStore.current);
	let sectionsOpen = $state(false);
	let openTools = $state(null);
	// Resòlv l'actor dobèrt un sol còp : se openTools designa un href
	// desconegut (donada modificada, estat obsolet…), aquò val null e lo
	// popover s'aficha simplament pas, allòc de plantar en accedissent a
	// « .label » sus undefined.
	let activeToolsLink = $derived(
		openTools ? (externalLinks.find((l) => l.href === openTools) ?? null) : null
	);

	// Icòna (favicon) de cada site extèrne, per repèrer visualament cada
	// actor/aplicacion dins la lista de ressorsas, sens aver de logo local
	// a mantener per cadun.
	function favicon(href) {
		try {
			return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(href).hostname}`;
		} catch {
			return '';
		}
	}

	// Textes bilingues de la page d'accueil. Le contenu occitan est à
	// valider par Romain (locuteur natif) avant publication finale — voir
	// mémoire de session sur la pratique de validation du contenu.
	const t = {
		// Promessa d'acuèlh : lo nom de la marca ES lo concèpte (« ligam »
		// = ligam). « Acompanha » ditz quicòm que las autras formulacions
		// disián pas : que se daissa pas lo visitaire sol.
		// À VALIDER par Romain sur dicodòc avant publication.
		heroLead: { oc: "Lo Ligam t'acompanha", fr: "Lo Ligam t'accompagne" },
		heroSub: { oc: "a la descobèrta de l'occitan", fr: "à la découverte de l'occitan" },
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

	let scrollY = $state(0);

	// brandCardEl es lo repère (boita extèrna, JAMAI transformada) que
	// dòna la posicion naturala del logo dins lo flux normal. Lo contengut
	// vertadièrament afichat (brand-card-inner) es decalat en seguida per
	// que son centre tòque exactament lo centre de la renguèra 2 — mesurar
	// aquesta boita extèrna pas transformada evita tota bogla (mesurar un
	// element que se decala tot solet fariá derivar lo calcul a cada
	// mesura successiva).
	let brandCardEl = $state();
	let topbarEl = $state();
	let centerY = $state(300);
	let topbarBottom = $state(64);
	// Restat invisible tant que la premièra mesura fisabla (aprèp
	// cargament complet de las poliças) es pas facha : la poliça Fredoka
	// carga en async (font-display swap), e càmbia leugièrament la
	// nautor del kicker un còp cargada — la mesura facha abans aquò es
	// fausa, e corregir la posicion aprèp qu'òm vege lo logo dona
	// justament l'impression qu'el "bolega" al cargament/refrescament.
	let logoReady = $state(false);

	function measureLayout() {
		if (brandCardEl) {
			const rect = brandCardEl.getBoundingClientRect();
			// Element normal dins lo flux : sa getBoundingClientRect() depend
			// de l'endrech ont la pagina es scrollada al moment de la
			// mesura. Se tòrna totjorn a la posicion "coma se scrollY=0" per
			// èsser fisable quina que siá la scroll al moment del montatge
			// (navigation history de SvelteKit…).
			centerY = rect.top + window.scrollY + rect.height / 2;
		}
		if (topbarEl) {
			topbarBottom = topbarEl.getBoundingClientRect().bottom;
		}
	}

	// La mesura synchròna al montatge (abans lo primièr rendut complet
	// del navegador) se revèla pas totjorn fisabla — un rAF suplementari
	// tòrna mesurar aprèp lo primièr vertadièr passatge de mesa en
	// pagina. Un ResizeObserver pren lo relai per las evolucions
	// ulterioras (poliça que carga mai tard, redimensionament…).
	$effect(() => {
		if (!browser) return;
		measureLayout();
		// Lo ResizeObserver se declencha un primièr còp tre l'observacion
		// (aprèp mesa en pagina), puèi a cada cambiament real de talha
		// (poliça cargada mai tard, redimensionament…) : pas de pari sul
		// moment ont las poliças acaban de cargar.
		const observer = new ResizeObserver(() => {
			measureLayout();
			logoReady = true;
		});
		if (topbarEl) observer.observe(topbarEl);
		if (brandCardEl) observer.observe(brandCardEl);
		// Filet de seguretat : lo logo deu jamai demorar invisible se
		// l'observador se declenchava pas (navegador exotic, onglet en
		// rèire plan…).
		const fallback = setTimeout(() => (logoReady = true), 400);
		window.addEventListener('resize', measureLayout);
		return () => {
			observer.disconnect();
			clearTimeout(fallback);
			window.removeEventListener('resize', measureLayout);
		};
	});

	let viewportHeight = $state(800);

	$effect(() => {
		if (!browser) return;
		const onResize = () => {
			viewportHeight = window.innerHeight;
		};
		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	const buffer = 40;
	const rowItemHeight = 132;
	const halfItemHeight = rowItemHeight / 2;
	// 190px = nautor maximala de .landscape (vaga) + un pichon marge, per
	// que la renguèra 3 tòque pas jamai la vaga.
	const waveClearance = 190;
	// C'est la RANGÉE qui vient sur le logo, pas l'inverse : déplacer le
	// logo par-dessus la mise en page le faisait recouvrir le titre, et
	// obligeait à des compensations qui bouclaient. Ici le logo ne bouge
	// jamais — les rangées sont en position fixe, donc les déplacer ne
	// gêne personne.
	let rowTops = $derived.by(() => {
		const first = topbarBottom + buffer;
		const last = Math.max(first, viewportHeight - waveClearance - rowItemHeight);
		// Idéalement la rangée du milieu passe par le centre du logo. Mais
		// depuis que le message porte la page, le logo est haut placé : la
		// suivre collerait les deux rangées du haut l'une à l'autre. On la
		// borne donc pour qu'elle garde au moins une hauteur de vignette
		// d'écart avec ses voisines.
		const wanted = centerY - halfItemHeight;
		const room = rowItemHeight * 0.9;
		const middle = Math.min(Math.max(wanted, first + room), last - room);
		return [first, middle, last];
	});



</script>

<svelte:window
	bind:scrollY
	onkeydown={(event) => {
		if (event.key === 'Escape' && openTools) openTools = null;
	}}
/>

<BgCarousel {rowTops} {scrollY} />

<PageBackground />

<WaveLandscape {scrollY} />

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
			<button
				type="button"
				class:active={lang === 'oc'}
				onclick={() => (langStore.current = 'oc')}>Òc</button
			>
			<button
				type="button"
				class="fr"
				class:active={lang === 'fr'}
				onclick={() => (langStore.current = 'fr')}>Fr</button
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
					{#if l.tools}
						<button
							type="button"
							class="external-card external-card-btn"
							aria-haspopup="dialog"
							aria-expanded={openTools === l.href}
							onclick={() => (openTools = openTools === l.href ? null : l.href)}
						>
							<span class="shine" aria-hidden="true"></span>
							<img class="external-logo" src={favicon(l.href)} alt="" loading="lazy" />
							<span class="external-toggle-text">
								<span class="external-label">{l.label}</span>
								<span
									class="external-desc"
									use:scramble={{ oc: l.desc_oc, fr: l.desc_fr, lang }}
								></span>
							</span>
						</button>
					{:else}
						<a class="external-card" href={l.href} target="_blank" rel="noopener noreferrer">
							<span class="shine" aria-hidden="true"></span>
							<img class="external-logo" src={favicon(l.href)} alt="" loading="lazy" />
							<span class="external-toggle-text">
								<span class="external-label">{l.label} ↗</span>
								<span
									class="external-desc"
									use:scramble={{ oc: l.desc_oc, fr: l.desc_fr, lang }}
								></span>
							</span>
						</a>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Lien de test temporaire, à retirer avant la publication -->
		<a class="test-link" href="/dev-test-questionnaire">Questionnari (tèst)</a>
	</div>
{/if}

<!-- Popover des aisinas d'un actor (Lo Congrès) : rendu hors de
     .sections-panel (qui a un backdrop-filter, donc crée son pròpri
     bloc de positionament) per que position:fixed se centre bien per
     rapòrt a tot l'ecran, pas sonque per rapòrt al panèl del menú. -->
{#if activeToolsLink}
	{@const activeLink = activeToolsLink}
	<div
		class="tools-backdrop"
		role="presentation"
		onclick={() => (openTools = null)}
		transition:fade={{ duration: 220 }}
	></div>
	<div
		class="tools-popover"
		role="dialog"
		aria-modal="true"
		aria-label={activeLink.label}
		transition:fly={{ y: 14, duration: 320, easing: quintOut, opacity: 0 }}
	>
		<div class="tools-popover-header">
			<img class="external-logo" src={favicon(activeLink.href)} alt="" />
			<span class="tools-popover-title">{activeLink.label}</span>
			<button
				type="button"
				class="tools-popover-close"
				onclick={() => (openTools = null)}
				aria-label={lang === 'oc' ? 'Tampar' : 'Fermer'}
			>
				×
			</button>
		</div>
		<ul class="tools-list">
			{#each activeLink.tools as tool (tool.href)}
				<li>
					<a href={tool.href} target="_blank" rel="noopener noreferrer">
						<img class="tool-logo" src={favicon(tool.href)} alt="" loading="lazy" />
						<span class="tool-text">
							<span class="tool-name">{tool.label} ↗</span>
							<span class="tool-desc"
								>(<span
									use:scramble={{ oc: tool.desc_oc, fr: tool.desc_fr, lang, inline: true }}
								></span>)</span
							>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<main class="page">
	<section class="hero">
		<!-- Lo decalatge del logo es PURAMENT visual : jamai de marge, que
		     cambiariá la reparticion « space-evenly » del hero, donc
		     desplaçariá l'element mesurat, donc cambiariá lo decalatge…
		     una bocla que fa derivar las mesuras a cada cicle. -->
		<div class="brand-card" bind:this={brandCardEl}>
			<div class="brand-card-inner" style="opacity: {logoReady ? 1 : 0}">
				<img src={logo} alt="Lo Ligam" />
			</div>
		</div>

		<div class="welcome">
			<h1 class="hero-line" use:scramble={{ oc: t.heroLead.oc, fr: t.heroLead.fr, lang }}></h1>
			<p class="hero-sub" use:scramble={{ oc: t.heroSub.oc, fr: t.heroSub.fr, lang }}></p>
			<p class="tagline-secondary">
				<em
					use:scramble={{
						oc: `(${t.heroLead.fr} ${t.heroSub.fr})`,
						fr: `(${t.heroLead.oc} ${t.heroSub.oc})`,
						lang
					}}
				></em>
			</p>
		</div>

		<a class="btn-primary" href="/aprene"
			>{lang === 'oc' ? "Aprèni l'occitan !" : "J'apprends l'occitan !"}</a
		>
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

	<SiteFooter tagline={t.footer} />
</main>

<style>
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

	/* Reflet qui balaie TOUTE la carte au survol (pas juste l'icône) :
	   un dégradé diagonal teinté de la couleur de la section, caché hors
	   du cadre (overflow:hidden sur .section-card), qui traverse de
	   gauche à droite lentement quand on passe la souris. Teinté plutôt
	   que blanc pur pour rester visible même sur le fond blanc de la
	   carte, pas seulement là où il croise la pastille d'icône colorée. */
	.shine {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(
			115deg,
			transparent 20%,
			color-mix(in srgb, var(--section-color, var(--color-terracotta)) 30%, white) 45%,
			color-mix(in srgb, var(--section-color, var(--color-terracotta)) 30%, white) 58%,
			transparent 80%
		);
		transform: translateX(-130%);
	}

	/* Pas de transition sur l'état de repos : au retrait de la souris, le
	   reflet revient instantanément à son point de départ (hors champ)
	   plutôt que de rejouer la traversée à l'envers — le mouvement ne va
	   que dans un sens, gauche → droite. */
	.section-card:hover .shine,
	.external-card:hover .shine {
		transform: translateX(130%);
		transition: transform 1400ms cubic-bezier(0.22, 1, 0.36, 1);
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
		align-items: center;
		gap: 0.6rem;
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

	/* Le bouton « Lo Congrès » (qui ouvre le popover) reprend exactement
	   la même carte visuelle qu'un lien simple : on ne reset que les
	   à-côtés natifs d'un <button>. */
	.external-card-btn {
		border: none;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.external-logo {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		object-fit: contain;
		background: white;
		flex-shrink: 0;
	}

	.external-toggle-text {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}

	/* Le nom de l'acteur doit se voir en premier (gras) ; la description
	   reste secondaire, jamais en gras. */
	.external-label {
		font-weight: 700;
	}

	.external-desc {
		display: block;
		font-weight: 400;
		font-size: 0.78rem;
		color: var(--color-text);
		opacity: 0.75;
		margin-top: 0.05rem;
	}

	.external-links a:hover {
		transform: translateY(-2px);
	}

	/* Rideau qui assombrit le reste de la page pendant que le popover
	   des aisinas de Lo Congrès est ouvert — la carte-déclencheur elle
	   -même ne bouge pas, rien autour ne se redimensionne. */
	.tools-backdrop {
		position: fixed;
		inset: 0;
		z-index: 20;
		background: rgba(43, 30, 22, 0.45);
		backdrop-filter: blur(2px);
	}

	.tools-popover {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 21;
		width: min(23rem, calc(100vw - 2.5rem));
		max-height: min(28rem, calc(100vh - 4rem));
		overflow-y: auto;
		background: white;
		border-radius: 18px;
		box-shadow: 0 24px 60px rgba(43, 30, 22, 0.35);
		padding: 1rem 1.1rem 0.5rem;
	}

	.tools-popover-header {
		position: sticky;
		top: -1rem;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding-bottom: 0.65rem;
		background: white;
	}

	/* Barra elegante color Lo Ligam per separar lo títol de la lista,
	   plan mai fina qu'un traç gris ordinari. */
	.tools-popover-header::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--color-brick), var(--color-terracotta) 55%, transparent);
	}

	.tools-popover-title {
		flex: 1;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--color-brick);
	}

	.tools-popover-close {
		all: unset;
		cursor: pointer;
		font-size: 1.4rem;
		line-height: 1;
		color: var(--color-text);
		opacity: 0.6;
		padding: 0.2rem 0.5rem;
		border-radius: 8px;
		transition:
			opacity 150ms ease,
			background 150ms ease;
	}

	.tools-popover-close:hover {
		opacity: 1;
		background: rgba(58, 42, 32, 0.08);
	}

	.tools-list {
		list-style: none;
		margin: 0;
		padding: 0.55rem 0.6rem 0.7rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.tools-list a {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		text-decoration: none;
		color: inherit;
		padding: 0.4rem 0.35rem;
		border-radius: 8px;
		transition: background 150ms ease;
	}

	.tools-list a:hover {
		background: rgba(165, 52, 42, 0.07);
	}

	.tool-logo {
		width: 24px;
		height: 24px;
		border-radius: 6px;
		object-fit: contain;
		background: white;
		flex-shrink: 0;
	}

	.tool-text {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
		min-width: 0;
	}

	.tool-name {
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--color-brick);
	}

	.tool-desc {
		font-size: 0.76rem;
		font-weight: 400;
		color: var(--color-text);
		opacity: 0.75;
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

	/* 4 blocs (Benvenguda / logo / titre+sostítol / bòton) espaçats
	   regularament sus tota l'nautor del hero — pas sonque centrats amb
	   un pichon gap fixe, que sarrava tot ensemble. */
	/* La marge basse réserve la hauteur de la vague (128px, 160px au-delà
	   de 40rem — mêmes valeurs que WaveLandscape). En CSS statique, pas
	   calculée en JS : les 4 blocs se répartissent dans la place qui
	   reste, donc le bouton ne peut ni toucher la vague ni recouvrir le
	   texte au-dessus. */
	.hero {
		min-height: calc(100dvh - 64px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		gap: 1.5rem;
		padding: 2rem 1.5rem calc(128px + 1.5rem);
		text-align: center;
	}

	@media (min-width: 40rem) {
		.hero {
			padding-bottom: calc(160px + 1.5rem);
		}
	}

	/* brand-card (extèrna) : nòta la posicion naturala/mesurada, jamai
	   transformada — pas d'overflow:hidden aicí per pas retalhar
	   brand-card-inner quand se decala. brand-card-inner : rebomb visual
	   sonque (arredondiment + imatge), decalat via transform per tòcar lo
	   centre de la renguèra 2. */
	.brand-card {
		width: 220px;
		height: 220px;
	}

	/* Écrans peu hauts (mobile paysage, petits téléphones) : sans ça les
	   4 blocs + la place réservée à la vague ne tiennent pas dans la
	   hauteur, et le bouton finit par mordre sur la vague. */
	@media (max-height: 760px) {
		.brand-card {
			width: 150px;
			height: 150px;
		}
	}

	/* Logo statique : pas de transition sur le transform, qui ne sert
	   qu'à caler le logo sur la ligne 2 du fond (voir logoOffset) — un
	   changement de valeur (chargement, redimensionnement) ne doit jamais
	   se voir comme une animation du logo. Seul « Benvenguda » doit
	   apparaître visiblement. */
	.brand-card-inner {
		width: 100%;
		height: 100%;
		border-radius: 30px;
		overflow: hidden;
		box-shadow: 0 16px 36px rgba(165, 52, 42, 0.3);
	}

	.brand-card-inner img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.welcome {
		max-width: 34rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	/* La promesse porte la page : c'est elle qu'on lit en premier, pas le
	   logo (qui est déjà dans la barre du haut). Deux niveaux — la ligne
	   forte, puis la ligne d'appui — comme sur les références étudiées. */
	.hero-line {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.1rem, 5.5vw, 3.4rem);
		font-weight: 700;
		line-height: 1.1;
		color: var(--color-brick);
		text-wrap: balance;
		animation: hero-reveal 750ms 100ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.hero-sub {
		margin: 0.3rem 0 0;
		font-family: var(--font-heading);
		font-size: clamp(1.15rem, 2.6vw, 1.6rem);
		font-weight: 500;
		line-height: 1.3;
		color: var(--color-text);
		text-wrap: balance;
		animation: hero-reveal 750ms 250ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes hero-reveal {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-line,
		.hero-sub {
			animation: none;
		}
	}

	.tagline-secondary {
		margin: 0.15rem 0 0;
		font-size: 0.92rem;
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

</style>
