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
	import PageBackground from '$lib/components/PageBackground.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import CartaOccitania from '$lib/components/CartaOccitania.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { families, externalLinks } from '$lib/data/siteSections';
	import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
	import { icona } from '$lib/data/icones';
	import { supabase } from '$lib/supabaseClient';
	import { esAdmin } from '$lib/adminStore';

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

	// Initiale de repli quand le site ne publie pas d'icône récupérable.
	function inicial(label) {
		return (label || '?').trim().charAt(0).toUpperCase();
	}

	// Textes bilingues de la page d'accueil. Les valeurs écrites ici sont des
	// valeurs de SECOURS : les vraies viennent de la table site_textes
	// (éditable dans /admin/textes) et les remplacent dès qu'elles arrivent.
	// Si la base est injoignable ou une ligne manquante, la page affiche
	// simplement ceci — rien ne casse.
	const t = $state({
		// Promessa d'acuèlh : lo nom de la marca ES lo concèpte (« ligam »
		// = ligam). « Acompanha » ditz quicòm que las autras formulacions
		// disián pas : que se daissa pas lo visitaire sol.
		// À VALIDER par Romain sur dicodòc avant publication.
		heroLead: { oc: "Lo Ligam t'acompanha", fr: "Lo Ligam t'accompagne" },
		heroSub: { oc: "a la descobèrta de l'occitan", fr: "à la découverte de l'occitan" },
		what: {
			title: { oc: 'Qu’es aquò, Lo Ligam ?', fr: 'Qu’est-ce que Lo Ligam ?' },
			lead: {
				oc: 'Un sol endrech per tot l’ecosistèma occitan : aprene la lenga, descobrir lo país, se retrobar.',
				fr: 'Un seul endroit pour tout l’écosystème occitan : apprendre la langue, découvrir le pays, se retrouver.'
			}
		},
		// Décision Romain 2026-08-22 : la page doit être comprise par
		// quelqu'un qui n'a JAMAIS entendu parler de l'occitan (« lenga
		// latina »), et les chiffres sont officiels, sourcés, marqués
		// « estimation ». Source locuteurs : enquête sociolinguistique
		// OPLO 2020 (~600 000 sur le territoire enquêté, 7 %).
		// À VALIDER par Romain (dicodòc) avant publication définitive.
		lenga: {
			title: { oc: 'L’occitan, uèi', fr: 'L’occitan, aujourd’hui' },
			lead: {
				oc: 'Una lenga viva, parlada de l’Atlantic a las Alps.',
				fr: 'Une langue vivante, parlée de l’Atlantique aux Alpes.'
			},
			intro: {
				oc: 'L’occitan es una lenga latina — sòrre del catalan, cosina del francés, de l’italian e del castelhan. Se parla dins lo tèrç sud de l’Estat francés, dins la Val d’Aran (Espanha) e dins de valadas del Piemont (Itàlia). Es la lenga dels trobadors — e se parla encara uèi.',
				fr: 'L’occitan est une langue latine — sœur du catalan, cousine du français, de l’italien et du castillan. Il se parle dans le tiers sud de la France, au Val d’Aran (Espagne) et dans des vallées du Piémont (Italie). C’est la langue des troubadours — et il se parle encore aujourd’hui.'
			},
			facts: [
				{
					num: '≈ 600 000',
					oc: 'locutors',
					fr: 'locuteurs',
					font_oc: 'Estimacion — enquèsta sociolingüistica OPLO, 2020',
					font_fr: 'Estimation — enquête sociolinguistique OPLO, 2020'
				},
				{
					num: '32',
					oc: 'despartaments',
					fr: 'départements',
					font_oc: 'e mai la Val d’Aran e las valadas occitanas d’Itàlia',
					font_fr: 'plus le Val d’Aran et les vallées occitanes d’Italie'
				},
				{
					num: '10',
					oc: 'sègles de literatura',
					fr: 'siècles de littérature',
					font_oc: 'dempuèi los primièrs trobadors',
					font_fr: 'depuis les premiers troubadours'
				}
			]
		},
		// La voix poétique (Cormorant italique, charte §2) : le plus célèbre
		// chant de troubadour. Le vers reste en occitan dans les deux
		// langues — c'est la citation qui est bilingue, pas sa traduction.
		citacion: {
			texte: {
				oc: '« Can vei la lauzeta mover de joi sas alas contra·l rai… »',
				fr: '« Can vei la lauzeta mover de joi sas alas contra·l rai… »'
			},
			autor: { oc: 'Bernart de Ventadorn · sègle XII', fr: 'Bernart de Ventadorn · XIIᵉ siècle' }
		},
		carta: {
			title: { oc: 'Lo Mond en occitan', fr: 'Le Monde en occitan' },
			lead: {
				oc: 'Una carta entièra dins la lenga, dialèctes e luòcs d’interès compreses.',
				fr: 'Une carte entière dans la langue, dialectes et lieux d’intérêt compris.'
			},
			cta: { oc: 'Dobrir la carta entièra', fr: 'Ouvrir la carte entière' }
		},
		officialitat: {
			title: { oc: 'Una lenga sens estatut', fr: 'Une langue sans statut' },
			lead: {
				oc: 'Co-oficiala en Val d’Aran, protegida en Itàlia, sens estatut en França : nòu cartas per o comprene.',
				fr: 'Co-officielle au Val d’Aran, protégée en Italie, sans statut en France : neuf cartes pour le comprendre.'
			}
		},
		// L'invitation finale (station 6 du camin).
		comenca: {
			title: { oc: 'Prèst a començar ?', fr: 'Prêt à commencer ?' },
			sub: { oc: 'Tres mots uèi, una lenga deman.', fr: 'Trois mots aujourd’hui, une langue demain.' },
			cta: { oc: 'Començar l’aventura', fr: 'Commencer l’aventure' }
		},
		heroCta2: { oc: 'Descobrir la carta', fr: 'Découvrir la carte' },
		footer: {
			oc: 'Fach amb amor en Occitània.',
			fr: 'Fait avec amour en Occitanie.'
		}
	});

	// Lo riu : las illustracions que davalan lentament jol títol. Doas
	// bendas en sens opausats ; cada lista es doblada dins lo marcatge per
	// que la bocla CSS (translateX -50 %) semble infinida.
	const riuAlt = ['01', '05', '09', '03', '07', '02'];
	const riuBas = ['07', '02', '01', '09', '05', '03'];

	// Recopie les textes venus de la base par-dessus les valeurs de secours,
	// puis — en mode aperçu (?apercebut=1, brouillon posé par /admin/textes
	// dans CE navigateur) — le brouillon par-dessus tout. Le brouillon ne
	// vit que dans localStorage : aucun visiteur ne peut le voir.
	const CLAU_APERCEBUT = 'lo-ligam-apercebut-textes';
	let apercebutActiu = $state(false);

	function aplicarTexte(id, valors) {
		const ciblas = {
			hero_lead: t.heroLead,
			hero_sub: t.heroSub,
			hero_cta2: t.heroCta2,
			what_title: t.what.title,
			what_lead: t.what.lead,
			lenga_title: t.lenga.title,
			lenga_lead: t.lenga.lead,
			lenga_intro: t.lenga.intro,
			citacion_texte: t.citacion.texte,
			citacion_autor: t.citacion.autor,
			carta_title: t.carta.title,
			carta_lead: t.carta.lead,
			carta_cta: t.carta.cta,
			officialitat_title: t.officialitat.title,
			officialitat_lead: t.officialitat.lead,
			comenca_title: t.comenca.title,
			comenca_sub: t.comenca.sub,
			comenca_cta: t.comenca.cta,
			footer_tagline: t.footer
		};
		const num = id.match(/^lenga_fact(\d)_num$/);
		if (num) {
			// Les « XX » semés en base à l'époque des chiffres provisoires ne
			// doivent pas recouvrir les valeurs réelles et sourcées du code.
			if (valors.oc === 'XX') return;
			const fact = t.lenga.facts[Number(num[1]) - 1];
			if (fact) fact.num = valors.oc;
			return;
		}
		const font = id.match(/^lenga_fact(\d)_font$/);
		if (font) {
			const fact = t.lenga.facts[Number(font[1]) - 1];
			if (fact) {
				fact.font_oc = valors.oc;
				fact.font_fr = valors.fr;
			}
			return;
		}
		const label = id.match(/^lenga_fact(\d)_label$/);
		const cibla = label ? t.lenga.facts[Number(label[1]) - 1] : ciblas[id];
		if (cibla) {
			cibla.oc = valors.oc;
			cibla.fr = valors.fr;
		}
	}

	function sortirApercebut() {
		localStorage.removeItem(CLAU_APERCEBUT);
		location.href = '/';
	}

	$effect(() => {
		if (!browser) return;
		supabase
			.from('site_textes')
			.select('id, oc, fr')
			.then(({ data }) => {
				for (const r of data ?? []) aplicarTexte(r.id, r);
			})
			.finally(() => {
				if (!new URLSearchParams(location.search).has('apercebut')) return;
				let brolhons = {};
				try {
					brolhons = JSON.parse(localStorage.getItem(CLAU_APERCEBUT) ?? '{}');
				} catch {
					brolhons = {};
				}
				for (const [id, valors] of Object.entries(brolhons)) aplicarTexte(id, valors);
				apercebutActiu = true;
			});
	});

</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape' && openTools) openTools = null;
	}}
/>

<PageBackground />

<header class="topbar">
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
		<div class="families-grid">
			{#each families as fam (fam.id)}
				{@const Icon = sectionIcons[fam.icon]}
				<div class="family" style="--section-color: {fam.color}">
					<div class="family-head">
						<span class="family-icon"><Icon size={20} /></span>
						<span class="family-name" use:scramble={{ oc: fam.oc, fr: fam.fr, lang }}></span>
						<span
							class="family-tagline"
							use:scramble={{ oc: fam.tagline_oc, fr: fam.tagline_fr, lang }}
						></span>
					</div>
					<ul class="family-items">
						{#each fam.items as it (it.id)}
							<li>
								{#if it.status === 'live'}
									<a class="family-item" href={it.href} onclick={() => (sectionsOpen = false)}>
										<span class="shine" aria-hidden="true"></span>
										<span class="item-name" use:scramble={{ oc: it.oc, fr: it.fr, lang }}></span>
										<span
											class="item-desc"
											use:scramble={{ oc: it.desc_oc, fr: it.desc_fr, lang }}
										></span>
									</a>
								{:else}
									<div class="family-item soon" aria-disabled="true">
										<span class="item-name" use:scramble={{ oc: it.oc, fr: it.fr, lang }}></span>
										<span
											class="item-desc"
											use:scramble={{ oc: it.desc_oc, fr: it.desc_fr, lang }}
										></span>
										<span class="soon-tag" use:scramble={{ oc: 'Lèu', fr: 'Bientôt', lang }}></span>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
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
							{#if icona(l.href)}<img class="external-logo" src={icona(l.href)} alt="" loading="lazy" />{:else}<span class="external-logo inicial">{inicial(l.label)}</span>{/if}
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
							{#if icona(l.href)}<img class="external-logo" src={icona(l.href)} alt="" loading="lazy" />{:else}<span class="external-logo inicial">{inicial(l.label)}</span>{/if}
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
			{#if icona(activeLink.href)}<img class="external-logo" src={icona(activeLink.href)} alt="" />{:else}<span class="external-logo inicial">{inicial(activeLink.label)}</span>{/if}
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
						{#if icona(tool.href)}<img class="tool-logo" src={icona(tool.href)} alt="" loading="lazy" />{:else}<span class="tool-logo inicial">{inicial(tool.label)}</span>{/if}
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

<WelcomeDialog {lang} />

<main class="page">
	<!-- L'eròi « Lo riu » (decision del 2026-08-22, cf. cahier §11) : la
	     frasa granda e centrada, puèi lo flume de designs que davala
	     lentament. La frasa PORTA la pagina (compreneson), lo flume la fa
	     VIURE — es lo fons vivent, independent del defilament. -->
	<section class="hero">
		<p class="hero-kicker" use:scramble={{ oc: 'Benvenguda', fr: 'Bienvenue', lang }}></p>
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
		<div class="hero-ctas">
			<a class="btn-primary" href="/aprene">
				<span use:scramble={{ oc: t.comenca.cta.oc, fr: t.comenca.cta.fr, lang }}></span>
			</a>
			<a class="btn-ghost" href="/carta">
				<span use:scramble={{ oc: t.heroCta2.oc, fr: t.heroCta2.fr, lang }}></span>
			</a>
		</div>
	</section>

	<div class="riu" aria-hidden="true">
		<div class="riu-benda riu-benda-alt">
			{#each [...riuAlt, ...riuAlt] as n, i (i)}
				<img src={`/bg/design-${n}.webp`} alt="" loading={i < 4 ? 'eager' : 'lazy'} />
			{/each}
		</div>
		<div class="riu-benda riu-benda-bas">
			{#each [...riuBas, ...riuBas] as n, i (i)}
				<img src={`/bg/design-${n}.webp`} alt="" loading="lazy" />
			{/each}
		</div>
	</div>

	<!-- Lo filet ondulat : la signatura. Se DESSENHA al passatge del
	     defilament (stroke-dashoffset pilotat per view()). -->
	<div class="filet-onda" aria-hidden="true">
		<svg viewBox="0 0 1200 30" preserveAspectRatio="none">
			<path
				class="filet-linha"
				pathLength="1"
				d="M0 16 Q 150 4 300 15 T 600 14 T 900 15 T 1200 13"
				fill="none"
			/>
		</svg>
	</div>

	<section class="chapter chapter--what">
		<h2 class="chapter-title reveal" use:scramble={{ oc: t.what.title.oc, fr: t.what.title.fr, lang }}></h2>
		<p class="chapter-lead reveal" use:scramble={{ oc: t.what.lead.oc, fr: t.what.lead.fr, lang }}></p>

		<!-- Las quatre pòrtas (decision Romain 2026-08-22 : « cartes
		     cliquables »). Una familha sens cap de pagina viva rend una
		     carta identica mas SENS ligam ni sageta — pas de faus ligam,
		     pas de « lèu » grisat (charte §5ter). -->
		<div class="what-families">
			{#each families as fam, i (fam.id)}
				{@const Icon = sectionIcons[fam.icon]}
				{@const porta = fam.items.find((it) => it.status === 'live')?.href ?? null}
				{#if porta}
					<a
						class="what-family what-porta reveal"
						href={porta}
						style="--section-color: {fam.color}; --step: {i}"
					>
						<span class="what-head">
							<span class="what-icon"><Icon size={24} /></span>
							<span class="what-name" use:scramble={{ oc: fam.oc, fr: fam.fr, lang }}></span>
							<svg class="what-sageta" viewBox="0 0 20 20" aria-hidden="true">
								<path
									d="M7 4 L13 10 L7 16"
									fill="none"
									stroke="currentColor"
									stroke-width="2.4"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
						<span
							class="what-tagline"
							use:scramble={{ oc: fam.tagline_oc, fr: fam.tagline_fr, lang }}
						></span>
					</a>
				{:else}
					<div class="what-family reveal" style="--section-color: {fam.color}; --step: {i}">
						<span class="what-head">
							<span class="what-icon"><Icon size={24} /></span>
							<span class="what-name" use:scramble={{ oc: fam.oc, fr: fam.fr, lang }}></span>
						</span>
						<span
							class="what-tagline"
							use:scramble={{ oc: fam.tagline_oc, fr: fam.tagline_fr, lang }}
						></span>
					</div>
				{/if}
			{/each}
		</div>
	</section>

	<section class="chapter chapter--lenga">
		<p class="chapter-jalon reveal" use:scramble={{ oc: 'Partida una · La lenga', fr: 'Partie une · La langue', lang }}></p>
		<h2 class="chapter-title reveal" use:scramble={{ oc: t.lenga.title.oc, fr: t.lenga.title.fr, lang }}></h2>
		<!-- Lo paragraf pel novici complet : la pagina deu èsser compresa
		     per qualqu'un qu'a JAMAI ausit parlar de l'occitan. -->
		<p class="chapter-lead lenga-intro reveal" use:scramble={{ oc: t.lenga.intro.oc, fr: t.lenga.intro.fr, lang }}></p>

		<div class="facts">
			{#each t.lenga.facts as fact, i}
				<div class="fact reveal" style="--step: {i}">
					<span class="fact-num">{fact.num}</span>
					<span class="fact-label" use:scramble={{ oc: fact.oc, fr: fact.fr, lang }}></span>
					<span class="fact-font" use:scramble={{ oc: fact.font_oc, fr: fact.font_fr, lang }}></span>
				</div>
			{/each}
		</div>

		<!-- La votz poetica (Cormorant italica, sonque per las citacions). -->
		<blockquote class="citacion reveal">
			<p class="citacion-texte">{t.citacion.texte[lang] ?? t.citacion.texte.oc}</p>
			<cite class="citacion-autor">{t.citacion.autor[lang] ?? t.citacion.autor.oc}</cite>
		</blockquote>
	</section>

	<section class="chapter chapter--carta">
		<p class="chapter-jalon reveal" use:scramble={{ oc: 'Partida dos · Lo territòri', fr: 'Partie deux · Le territoire', lang }}></p>
		<h2 class="chapter-title" use:scramble={{ oc: t.carta.title.oc, fr: t.carta.title.fr, lang }}></h2>
		<p class="chapter-lead" use:scramble={{ oc: t.carta.lead.oc, fr: t.carta.lead.fr, lang }}></p>
		<!-- Carte réellement navigable : on peut se déplacer et zoomer sans
		     quitter l'accueil. Les dialectes sont le calque par défaut —
		     c'est ce qui raconte la langue, plus parlant que des points
		     d'intérêt isolés. -->
		<div class="carta-live reveal">
			<CartaOccitania visibility={{ lieusInteres: false, dialectes: true }} />
		</div>
		<!-- Le texte bilingue est dans un span interne : l'action scramble
		     impose display:grid à l'élément qu'elle occupe, ce qui étirait
		     le bouton sur toute la largeur au lieu de le laisser tenir dans
		     sa propre taille. -->
		<a class="btn-primary carta-cta" href="/carta">
			<span use:scramble={{ oc: t.carta.cta.oc, fr: t.carta.cta.fr, lang }}></span>
		</a>
	</section>

	<!-- Officialitat, ALLEUGERIDA en bendèl (decision Romain 2026-08-22 :
	     « annexe, à voir ») — lo grand carrossèl es partit, dos visuals e
	     lo messatge sufisson. -->
	<section class="chapter chapter--officialitat">
		<div class="officialitat-benda reveal">
			<div class="officialitat-imatges" aria-hidden="true">
				<img src="/officialitat/1_officialitat.webp" alt="" loading="lazy" />
				<img src="/officialitat/5_drech.webp" alt="" loading="lazy" />
			</div>
			<div class="officialitat-texte">
				<h2
					class="officialitat-title"
					use:scramble={{ oc: t.officialitat.title.oc, fr: t.officialitat.title.fr, lang }}
				></h2>
				<p
					class="officialitat-lead"
					use:scramble={{ oc: t.officialitat.lead.oc, fr: t.officialitat.lead.fr, lang }}
				></p>
			</div>
		</div>
	</section>

	<!-- L'invitacion finala (estacion 6 del camin). -->
	<section class="chapter chapter--comenca">
		<h2 class="chapter-title reveal" use:scramble={{ oc: t.comenca.title.oc, fr: t.comenca.title.fr, lang }}></h2>
		<p class="chapter-lead reveal" use:scramble={{ oc: t.comenca.sub.oc, fr: t.comenca.sub.fr, lang }}></p>
		<a class="btn-primary comenca-btn reveal" href="/aprene">
			<span use:scramble={{ oc: t.comenca.cta.oc, fr: t.comenca.cta.fr, lang }}></span>
		</a>
	</section>

	<SiteFooter tagline={t.footer} />
</main>

{#if apercebutActiu}
	<div class="apercebut-banda" role="status">
		<span>Mòde apercebut — res es pas enregistrat</span>
		<button type="button" onclick={sortirApercebut}>Sortir</button>
	</div>
{/if}

{#if $esAdmin}
	<a class="edit-floating" href="/admin/textes" title="Modificar los tèxtes d'aquesta pagina">
		<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
			stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
		</svg>
		<span>Modificar</span>
	</a>
{/if}

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
		font-family: var(--font-logo); /* lo wordmark garda Fredoka (charte §2) */
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

	/* Quatre familles côte à côte, chacune avec sa couleur et ses entrées.
	   Le visiteur balaie quatre intentions d'un coup d'œil au lieu de lire
	   une grille plate de six cartes équivalentes. */
	.families-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1.25rem 1rem;
		max-width: 62rem;
		margin: 0 auto;
	}

	.family-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		padding-bottom: 0.5rem;
		margin-bottom: 0.6rem;
		border-bottom: 2px solid var(--section-color, var(--color-terracotta));
	}

	.family-icon {
		display: flex;
		color: var(--section-color, var(--color-terracotta));
	}

	.family-name {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--section-color, var(--color-brick));
	}

	.family-tagline {
		flex-basis: 100%;
		font-size: 0.75rem;
		color: var(--color-text);
		opacity: 0.6;
	}

	.family-items {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.family-item {
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		background: white;
		border-radius: 12px;
		padding: 0.6rem 0.8rem;
		text-decoration: none;
		color: inherit;
		box-shadow: 0 4px 12px rgba(58, 42, 32, 0.07);
		transition:
			transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 180ms ease;
	}

	.family-item:not(.soon):hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 22px rgba(58, 42, 32, 0.14);
	}

	.family-item.soon {
		background: rgba(255, 255, 255, 0.45);
		box-shadow: none;
		border: 1px dashed rgba(58, 42, 32, 0.16);
		opacity: 0.75;
	}

	.item-name {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--color-brick);
	}

	.item-desc {
		font-size: 0.78rem;
		line-height: 1.35;
		color: var(--color-text);
		opacity: 0.8;
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
	.family-item:hover .shine,
	.external-card:hover .shine {
		transform: translateX(130%);
		transition: transform 1400ms cubic-bezier(0.22, 1, 0.36, 1);
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

	/* Repli quand le site ne publie pas d'icône : son initiale sur pastille,
	   plutôt qu'une image cassée. */
	.inicial {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--color-brick);
		color: var(--color-cream);
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.8rem;
		line-height: 1;
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
	}

	/* L'eròi « Lo riu » : compacte e centrat — la frasa pòrta, lo flume
	   (en dejós) fa viure. Fons calme : la color ven dels designs. */
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.1rem;
		padding: 4.5rem 1.5rem 2.75rem;
		text-align: center;
	}

	.hero-kicker {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--color-terracotta);
	}

	.hero-ctas {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.btn-ghost {
		display: inline-block;
		padding: 1rem 1.5rem;
		border-radius: 999px;
		border: 1.5px solid rgba(58, 42, 32, 0.3);
		color: var(--color-text);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1rem;
		text-decoration: none;
		transition:
			transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
			border-color 150ms ease,
			background-color 150ms ease;
	}

	.btn-ghost:hover {
		transform: translateY(-3px);
		border-color: var(--color-terracotta);
		background: rgba(200, 86, 46, 0.06);
	}

	/* Lo riu : doas bendas que davalan sens fin, cadenciadas lentament
	   (una respiracion, pas un manètge) e en sens opausats. Independentas
	   del defilament : es lo fons vivent de la pagina. */
	.riu {
		position: relative;
		z-index: 3;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		overflow: hidden;
		padding-bottom: 0.5rem;
	}

	.riu-benda {
		display: flex;
		gap: 1rem;
		width: max-content;
	}

	.riu-benda img {
		width: clamp(130px, 16vw, 200px);
		border-radius: 14px;
		box-shadow: 0 6px 18px rgba(58, 42, 32, 0.12);
	}

	.riu-benda-alt {
		animation: riu-desfilar 70s linear infinite;
	}

	.riu-benda-bas {
		animation: riu-desfilar-invers 90s linear infinite;
	}

	.riu-benda-bas img {
		width: clamp(100px, 12vw, 150px);
	}

	@keyframes riu-desfilar {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@keyframes riu-desfilar-invers {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0);
		}
	}

	/* Lo filet ondulat, la signatura : las vagas plenas d'abans, tornadas
	   en linha fina. Se dessenha al ritme del defilament. */
	.filet-onda {
		position: relative;
		z-index: 3;
		padding: 1.5rem 0 0.25rem;
		line-height: 0;
	}

	.filet-onda svg {
		width: 100%;
		height: 30px;
		display: block;
	}

	.filet-linha {
		stroke: var(--color-terracotta);
		stroke-width: 2.5;
		opacity: 0.75;
	}

	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.filet-linha {
				stroke-dasharray: 1;
				stroke-dashoffset: 1;
				animation: filet-tracar linear both;
				animation-timeline: view();
				animation-range: entry 0% entry 90%;
			}
		}
	}

	@keyframes filet-tracar {
		to {
			stroke-dashoffset: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.riu-benda-alt,
		.riu-benda-bas {
			animation: none;
		}
	}

	.welcome {
		max-width: 34rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	/* La promesse porte la page : capitales Syne 800, la voix principale
	   (charte §2). Deux niveaux — la ligne forte, puis la ligne d'appui. */
	.hero-line {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.1rem, 5.5vw, 3.5rem);
		font-weight: 800;
		line-height: 1.06;
		letter-spacing: 0.015em;
		text-transform: uppercase;
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

	.btn-primary:hover {
		transform: translateY(-3px) scale(1.03);
		box-shadow: 0 10px 24px rgba(224, 164, 59, 0.55);
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

	/* Chapitres numérotés (repris de Ponpon Mania) : chaque section est
	   une idée, annoncée par son numéro. Bandes pleine largeur alternées
	   pour donner du rythme, au lieu d'une suite de cartes centrées. */
	.chapter {
		position: relative;
		z-index: 3;
		padding: 5rem 1.5rem;
		text-align: center;
	}

	.chapter--what {
		background: rgba(255, 255, 255, 0.55);
	}

	.chapter--lenga {
		background: var(--color-brick);
		color: var(--color-cream);
	}

	/* Los jalons de capítol : pichonas capitalas espaçadas (Instrument
	   Sans), lo motiu retengut aprèp l'abandon de Marcellus. */
	.chapter-jalon {
		margin: 0 0 0.75rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--color-teal);
	}

	.chapter--lenga .chapter-jalon {
		color: var(--color-gold);
	}

	.chapter-title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.6rem, 3.6vw, 2.4rem);
		font-weight: 700;
		text-wrap: balance;
	}

	.chapter--what .chapter-title,
	.chapter--carta .chapter-title {
		color: var(--color-brick);
	}

	.chapter-lead {
		max-width: 34rem;
		margin: 0.75rem auto 0;
		font-size: 1.02rem;
		line-height: 1.5;
		opacity: 0.85;
		text-wrap: pretty;
	}

	/* Révélation au défilement, en CSS natif : chaque bloc apparaît quand
	   il entre dans la fenêtre, décalé par --step pour un effet de
	   cascade. Sur les navigateurs sans animation-timeline (Firefox,
	   anciens Safari) le contenu s'affiche simplement, rien ne casse. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.reveal {
				animation: reveal-in linear both;
				animation-timeline: view();
				animation-range: entry 10% cover 32%;
				animation-delay: calc(var(--step, 0) * -0.06s);
			}
		}
	}

	@keyframes reveal-in {
		from {
			opacity: 0;
			transform: translateY(28px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.what-families {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: 1rem;
		max-width: 58rem;
		margin: 2.5rem auto 0;
	}

	.what-family {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.4rem;
		padding: 1.4rem 1.3rem;
		background: white;
		border-radius: 16px;
		border-top: 4px solid var(--section-color);
		box-shadow: 0 6px 18px rgba(58, 42, 32, 0.08);
		text-align: left;
	}

	/* Las pòrtas clicablas : meteissa carta, mai una sageta e un
	   soslevament al subrevòl. */
	.what-porta {
		text-decoration: none;
		color: inherit;
		transition:
			transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 180ms ease;
	}

	.what-porta:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 26px rgba(58, 42, 32, 0.14);
	}

	.what-head {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	.what-sageta {
		width: 16px;
		height: 16px;
		margin-left: auto;
		color: var(--section-color);
		transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.what-porta:hover .what-sageta {
		transform: translateX(4px);
	}

	.what-icon {
		display: flex;
		color: var(--section-color);
	}

	.what-name {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.15rem;
		color: var(--section-color);
	}

	.what-tagline {
		font-size: 0.85rem;
		opacity: 0.7;
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: 1.5rem;
		max-width: 46rem;
		margin: 2.5rem auto 0;
	}

	.fact {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.fact-num {
		font-family: var(--font-heading);
		font-size: clamp(2.4rem, 6vw, 3.6rem);
		font-weight: 700;
		line-height: 1;
		color: var(--color-gold);
	}

	.fact-label {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	/* La font de cada chifra, JOL chifra : la decision « chiffres
	   officiels, sourcés, marqués estimation » (cahier §11, 2026-08-22). */
	.fact-font {
		margin-top: 0.3rem;
		font-size: 0.72rem;
		line-height: 1.4;
		opacity: 0.55;
	}

	.lenga-intro {
		max-width: 40rem;
	}

	/* La citacion del trobador : la votz poetica (Cormorant italica),
	   presentada sus un filet daurat — sòbria, pas un panèl. */
	.citacion {
		max-width: 36rem;
		margin: 2.75rem auto 0;
		padding: 0.4rem 0 0.4rem 1.4rem;
		border-left: 3px solid var(--color-gold);
		text-align: left;
	}

	.citacion-texte {
		margin: 0;
		font-family: var(--font-quote);
		font-style: italic;
		font-weight: 500;
		font-size: clamp(1.3rem, 2.6vw, 1.7rem);
		line-height: 1.4;
		color: var(--color-cream);
	}

	.citacion-autor {
		display: block;
		margin-top: 0.5rem;
		font-style: normal;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		opacity: 0.6;
	}

	/* Carte réellement manipulable depuis l'accueil : on peut se déplacer
	   et zoomer sur place. Le bouton sous la carte mène à la page pleine,
	   au lieu d'un lien qui recouvrirait la carte et bloquerait son
	   utilisation. */
	.carta-live {
		max-width: 62rem;
		height: min(58vh, 26rem);
		margin: 2.5rem auto 0;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 14px 36px rgba(58, 42, 32, 0.18);
	}

	.carta-cta {
		display: inline-block;
		margin-top: 1.5rem;
		/* Ne dépasse jamais la largeur de la carte, quoi qu'il arrive. */
		max-width: min(62rem, 100%);
	}

	/* Officialitat en bendèl compacte (annexe, decision 2026-08-22). */
	.chapter--officialitat {
		padding: 3rem 1.5rem;
	}

	.officialitat-benda {
		display: flex;
		align-items: center;
		gap: 1.4rem;
		max-width: 46rem;
		margin: 0 auto;
		padding: 1.4rem 1.6rem;
		border-radius: 16px;
		background: rgba(165, 52, 42, 0.06);
		text-align: left;
	}

	.officialitat-imatges {
		display: flex;
		gap: 0.6rem;
		flex-shrink: 0;
	}

	.officialitat-imatges img {
		width: 84px;
		border-radius: 10px;
		box-shadow: 0 4px 12px rgba(58, 42, 32, 0.12);
	}

	.officialitat-title {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.15rem;
		color: var(--color-brick);
	}

	.officialitat-lead {
		margin: 0.35rem 0 0;
		font-size: 0.92rem;
		line-height: 1.55;
		opacity: 0.85;
		text-wrap: pretty;
	}

	@media (max-width: 34rem) {
		.officialitat-benda {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	/* L'invitacion finala. */
	.chapter--comenca {
		background: rgba(200, 86, 46, 0.07);
	}

	.chapter--comenca .chapter-title {
		color: var(--color-brick);
	}

	.comenca-btn {
		display: inline-block;
		margin-top: 1.5rem;
	}

	/* Bouton d'édition réservé à l'administrateur connecté — les visiteurs
	   ne le voient jamais (esAdmin est faux pour eux). */
	.edit-floating {
		position: fixed;
		bottom: 1.25rem;
		right: 1.25rem;
		z-index: 30;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.6rem 1rem;
		border-radius: 999px;
		background: var(--color-text);
		color: var(--color-cream);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.85rem;
		text-decoration: none;
		box-shadow: 0 8px 22px rgba(58, 42, 32, 0.35);
		transition:
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 150ms ease;
	}

	.edit-floating:hover {
		transform: translateY(-2px) scale(1.03);
		box-shadow: 0 12px 28px rgba(58, 42, 32, 0.4);
	}

	/* Bandeau du mode aperçu : bien visible mais sans gêner la lecture de
	   la page qu'on est justement en train de juger. */
	.apercebut-banda {
		position: fixed;
		bottom: 1.25rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 31;
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0.55rem 0.6rem 0.55rem 1.1rem;
		border-radius: 999px;
		background: var(--color-brick);
		color: white;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.85rem;
		box-shadow: 0 8px 22px rgba(58, 42, 32, 0.35);
		white-space: nowrap;
	}

	.apercebut-banda button {
		border: none;
		border-radius: 999px;
		padding: 0.35rem 0.8rem;
		background: rgba(255, 255, 255, 0.9);
		color: var(--color-brick);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.apercebut-banda button:hover {
		background: white;
	}

	@media (max-width: 30rem) {
		.apercebut-banda {
			white-space: normal;
			width: calc(100% - 2rem);
			justify-content: space-between;
		}
	}
</style>
