<script>
	import { browser } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { scramble } from '$lib/actions/scramble';
	import logo from '$lib/assets/favicon.svg';
	import MenuIcon from '$lib/components/MenuIcon.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import CartaOccitania from '$lib/components/CartaOccitania.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { families, externalLinks } from '$lib/data/siteSections';
	import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
	import { icona } from '$lib/data/icones';
	import { supabase } from '$lib/supabaseClient';
	import { esAdmin } from '$lib/adminStore';
	import Lenis from 'lenis';

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
		// L'eròi « editorial aerat » (decision Romain 2026-10-05, §11) : la
		// linha de promessa del §11 (18-09), desplegada en tres linhas gigantas.
		// À VALIDER par Romain sur dicodòc avant publication.
		heroKicker: { oc: 'L’occitan', fr: 'L’occitan' },
		heroL1: { oc: 'Se parla.', fr: 'Se parle.' },
		heroL2: { oc: 'S’apren.', fr: 'S’apprend.' },
		heroL3: { oc: 'Se viu.', fr: 'Se vit.' },
		heroSub2: {
			oc: 'Quin que siá ton objectiu, siás al bon endrech.',
			fr: 'Quel que soit ton objectif, tu es au bon endroit.'
		},
		// L'anciana frasa d'eròi ven l'acuèlh intime de l'acte II — sos
		// identificants site_textes (hero_lead / hero_sub) demòran valids.
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
					// Espacis fins insecables (U+202F) : lo nombre se copa pas.
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
		// Depuis la refonte 2026-10-05, elle se pose en blanc sur la
		// bande-paysage des Cévennes (acte IV).
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
		// L'invitacion finala (estacion 6 del camin), ara en « darrièr crit ».
		comenca: {
			title: { oc: 'Prèst·a per començar ?', fr: 'Prêt·e à commencer ?' },
			sub: { oc: 'Tres mots uèi, una lenga deman.', fr: 'Trois mots aujourd’hui, une langue demain.' },
			cta: { oc: 'Començar l’aventura', fr: 'Commencer l’aventure' }
		},
		heroCta2: { oc: 'Descobrir la carta', fr: 'Découvrir la carte' },
		footer: {
			oc: 'Fach amb amor en Occitània.',
			fr: 'Fait avec amour en Occitanie.'
		}
	});

	// Recopie les textes venus de la base par-dessus les valeurs de secours,
	// puis — en mode aperçu (?apercebut=1, brouillon posé par /admin/textes
	// dans CE navigateur) — le brouillon par-dessus tout. Le brouillon ne
	// vit que dans localStorage : aucun visiteur ne peut le voir.
	const CLAU_APERCEBUT = 'lo-ligam-apercebut-textes';
	let apercebutActiu = $state(false);

	function aplicarTexte(id, valors) {
		const ciblas = {
			hero_kicker: t.heroKicker,
			hero_l1: t.heroL1,
			hero_l2: t.heroL2,
			hero_l3: t.heroL3,
			hero_sub2: t.heroSub2,
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

	// Menú dobèrt = la pagina darrièr se bloca (lo vel plen ecran pòrta
	// son pròpri defilament).
	$effect(() => {
		if (!browser) return;
		document.documentElement.style.overflow = sectionsOpen ? 'hidden' : '';
		return () => {
			document.documentElement.style.overflow = '';
		};
	});

	// Lo defilament fluid (Lenis — decision Romain 2026-10-05, §11).
	// Garde-fous : rien si la personne demande moins d'animations, et le
	// clavier / les lecteurs d'écran gardent le défilement natif (Lenis ne
	// touche qu'à la roulette et au tactile).
	$effect(() => {
		if (!browser) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const lenis = new Lenis({ autoRaf: true });
		return () => lenis.destroy();
	});
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key !== 'Escape') return;
		if (openTools) openTools = null;
		else if (sectionsOpen) sectionsOpen = false;
	}}
/>

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

<!-- Lo menú plen ecran « editorial » (refonta 2026-10-06, demanda Romain :
     fini las cartas blancas generiques — de linhas gigantas Limelight que
     davalan en cascada, de tèxte, d'aire). -->
{#if sectionsOpen}
	<div class="menu-vel" role="dialog" aria-modal="true" aria-label="Menú del site">
		<div class="menu-dedins">
			<div class="menu-familhas">
				{#each families as fam, fi (fam.id)}
					<section class="menu-familha">
						<p class="menu-jalon" style="--md: {fi * 4}">
							<span use:scramble={{ oc: fam.oc, fr: fam.fr, lang }}></span>
							<span class="menu-jalon-dich" use:scramble={{ oc: fam.tagline_oc, fr: fam.tagline_fr, lang }}></span>
						</p>
						<ul class="menu-lista">
							{#each fam.items as it, ii (it.id)}
								<li class="menu-mask">
									<div class="menu-linha" style="--md: {fi * 4 + ii + 1}">
										{#if it.status === 'live'}
											<a class="menu-ligam" href={it.href} onclick={() => (sectionsOpen = false)}>
												<span class="menu-nom" use:scramble={{ oc: it.oc, fr: it.fr, lang }}></span>
												<span class="menu-sageta" aria-hidden="true">→</span>
											</a>
										{:else}
											<span class="menu-ligam leu">
												<span class="menu-nom" use:scramble={{ oc: it.oc, fr: it.fr, lang }}></span>
												<em class="menu-leu-tag" use:scramble={{ oc: 'lèu', fr: 'bientôt', lang }}></em>
											</span>
										{/if}
									</div>
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			</div>

			<div class="menu-ressorsas">
				<p class="menu-jalon" style="--md: 16" use:scramble={{
						oc: 'Ressorsas occitanas',
						fr: 'Ressources occitanes',
						lang
					}}></p>
				<p class="menu-ressorsas-linha" style="--md: 17">
					{#each externalLinks as l, li (l.href)}
						{#if li > 0}<span class="menu-punt" aria-hidden="true">·</span>{/if}
						{#if l.tools}
							<button
								type="button"
								class="menu-ressorsa menu-ressorsa-btn"
								aria-haspopup="dialog"
								aria-expanded={openTools === l.href}
								onclick={() => (openTools = openTools === l.href ? null : l.href)}
							>{l.label}</button>
						{:else}
							<a class="menu-ressorsa" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
						{/if}
					{/each}
				</p>
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
	<!-- Acte I — l'eròi « editorial aerat » (decision Romain 2026-10-05,
	     §11, maqueta validada) : la promessa del §11 en tres linhas
	     gigantas (Limelight), pausada sus la crèsta de las Cevenas al
	     liseron sang e aur (fòto de Romain, sistèma §3bis). Remplaça
	     l'eròi « Lo riu » del 2026-08-22. -->
	<section class="eros">
		<p class="eros-kicker" use:scramble={{ oc: t.heroKicker.oc, fr: t.heroKicker.fr, lang }}></p>
		<h1 class="eros-titol" aria-label="{t.heroKicker[lang]} {t.heroL1[lang]} {t.heroL2[lang]} {t.heroL3[lang]}">
			<span class="titol-mask"><span class="linha" use:scramble={{ oc: t.heroL1.oc, fr: t.heroL1.fr, lang }}></span></span>
			<span class="titol-mask"><span class="linha" use:scramble={{ oc: t.heroL2.oc, fr: t.heroL2.fr, lang }}></span></span>
			<span class="titol-mask"><span class="linha" use:scramble={{ oc: t.heroL3.oc, fr: t.heroL3.fr, lang }}></span></span>
		</h1>
		<p class="eros-sub" use:scramble={{ oc: t.heroSub2.oc, fr: t.heroSub2.fr, lang }}></p>
		<div class="hero-ctas">
			<a class="btn-primary" href="/aprene">
				<span use:scramble={{ oc: t.comenca.cta.oc, fr: t.comenca.cta.fr, lang }}></span>
			</a>
			<a class="btn-ghost" href="/carta">
				<span use:scramble={{ oc: t.heroCta2.oc, fr: t.heroCta2.fr, lang }}></span>
			</a>
		</div>
		<p class="eros-indici" use:scramble={{ oc: 'Davala ↓', fr: 'Descends ↓', lang }}></p>
		<div class="eros-paisatge" aria-hidden="true"></div>
	</section>

	<!-- Acte II — l'acuèlh intime : l'anciana frasa d'eròi (sos tèxtes de
	     basa hero_lead / hero_sub vivon encara) e lo personatge destorat. -->
	<section class="adieu">
		<div class="adieu-tèxte">
			<p class="adieu-lead reveal">
				<span use:scramble={{ oc: t.heroLead.oc, fr: t.heroLead.fr, lang }}></span>
				<span class="adieu-sub" use:scramble={{ oc: t.heroSub.oc, fr: t.heroSub.fr, lang }}></span>
			</p>
			<p class="tagline-secondary reveal" style="--step: 1">
				<em
					use:scramble={{
						oc: `(${t.heroLead.fr} ${t.heroSub.fr})`,
						fr: `(${t.heroLead.oc} ${t.heroSub.oc})`,
						lang
					}}
				></em>
			</p>
		</div>
		<img
			class="adieu-personatge reveal"
			style="--step: 2"
			src="/acuelh/personatge.png"
			alt=""
			loading="lazy"
		/>
	</section>

	<!-- Acte III — los camins : las familhas del site en lista editoriala
	     numerotada (l'esperit « sommaire de festival » de la maqueta).
	     Una familha sens cap de pagina viva rend una linha identica mas
	     SENS ligam ni sageta — pas de faus ligam (charte §5ter). -->
	<section class="camins">
		<h2 class="camins-title reveal" use:scramble={{ oc: t.what.title.oc, fr: t.what.title.fr, lang }}></h2>
		<p class="camins-lead reveal" use:scramble={{ oc: t.what.lead.oc, fr: t.what.lead.fr, lang }}></p>
		<div class="camins-lista">
			{#each families as fam, i (fam.id)}
				{@const porta = fam.items.find((it) => it.status === 'live')?.href ?? null}
				{#if porta}
					<a class="camin reveal" href={porta} style="--step: {i}; --section-color: {fam.color}">
						<span class="camin-n">{String(i + 1).padStart(2, '0')}</span>
						<span class="camin-nom" use:scramble={{ oc: fam.oc, fr: fam.fr, lang }}></span>
						<span class="camin-dich" use:scramble={{ oc: fam.tagline_oc, fr: fam.tagline_fr, lang }}></span>
						<span class="camin-sageta" aria-hidden="true">→</span>
					</a>
				{:else}
					<div class="camin leu reveal" style="--step: {i}" aria-disabled="true">
						<span class="camin-n">{String(i + 1).padStart(2, '0')}</span>
						<span class="camin-nom" use:scramble={{ oc: fam.oc, fr: fam.fr, lang }}></span>
						<span class="camin-dich">
							<span use:scramble={{ oc: fam.tagline_oc, fr: fam.tagline_fr, lang }}></span>
							<span class="camin-leu-tag" use:scramble={{ oc: 'lèu', fr: 'bientôt', lang }}></span>
						</span>
					</div>
				{/if}
			{/each}
		</div>
	</section>

	<!-- La lenga, uèi : l'explica pel novici complet e los chifras sorsats. -->
	<section class="chapter chapter--lenga">
		<p class="chapter-jalon reveal" use:scramble={{ oc: 'La lenga', fr: 'La langue', lang }}></p>
		<h2 class="chapter-title reveal" use:scramble={{ oc: t.lenga.title.oc, fr: t.lenga.title.fr, lang }}></h2>
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
	</section>

	<!-- Acte IV — la benda-paisatge : la votz poetica del trobador en blanc
	     sus las Cevenas (parallaxa doça, pilotada pel defilament natiu). -->
	<section class="benda">
		<div class="benda-fons" aria-hidden="true"></div>
		<blockquote class="citacion">
			<p class="citacion-texte reveal">{t.citacion.texte[lang] ?? t.citacion.texte.oc}</p>
			<cite class="citacion-autor reveal" style="--step: 1">{t.citacion.autor[lang] ?? t.citacion.autor.oc}</cite>
		</blockquote>
	</section>

	<section class="chapter chapter--carta">
		<p class="chapter-jalon reveal" use:scramble={{ oc: 'Lo territòri', fr: 'Le territoire', lang }}></p>
		<h2 class="chapter-title reveal" use:scramble={{ oc: t.carta.title.oc, fr: t.carta.title.fr, lang }}></h2>
		<p class="chapter-lead reveal" use:scramble={{ oc: t.carta.lead.oc, fr: t.carta.lead.fr, lang }}></p>
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
	     « annexe, à voir ») — dos visuals e lo messatge sufisson. -->
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

	<!-- Acte V — lo darrièr crit (estacion 6 del camin) : lo títol gigant,
	     la crotz-constellacion en filigrana, lo boton d'aur. -->
	<section class="crida">
		<svg class="crida-simbol" viewBox="0 0 375 375" aria-hidden="true">
			<g stroke="currentColor" fill="none">
				<g stroke-width="9">
					<path transform="matrix(0.268014, 0.700477, -0.700477, 0.268014, 64.86348, 183.788938)" d="M 1.376068 17.552014 C 31.817355 -2.514514 62.260322 -2.515953 92.703108 17.552563"/>
					<path transform="matrix(-0.264462, 0.701826, -0.701826, -0.264462, 90.09249, 126.787067)" d="M 1.362442 17.551517 C 32.215336 -2.517821 63.067305 -2.516403 93.916511 17.550899"/>
					<path transform="matrix(0.691513, 0.29036, -0.29036, 0.691513, 126.085587, 284.330547)" d="M 1.348645 17.5517 C 32.627018 -2.518593 63.904784 -2.518294 95.186744 17.550581"/>
					<path transform="matrix(0.693965, -0.284452, 0.284452, 0.693965, 182.144918, 311.278163)" d="M 1.384734 17.548771 C 31.55003 -2.514684 61.715991 -2.516508 91.885462 17.550094"/>
					<path transform="matrix(0.271321, -0.699203, 0.699203, 0.271321, 284.023404, 247.651683)" d="M 1.451193 17.549063 C 29.632651 -2.515269 57.816365 -2.518569 86.001247 17.550756"/>
					<path transform="matrix(-0.249767, -0.707189, 0.707189, -0.249767, 307.550843, 193.403865)" d="M 1.370475 17.551954 C 31.989038 -2.516707 62.607047 -2.51822 93.217856 17.550591"/>
					<path transform="matrix(-0.691743, 0.289812, -0.289812, -0.691743, 190.590153, 63.74593)" d="M 1.38408 17.548767 C 31.566341 -2.518959 61.743885 -2.519346 91.926321 17.551629"/>
					<path transform="matrix(-0.698452, -0.273248, 0.273248, -0.698452, 248.993103, 90.119833)" d="M 1.376053 17.552315 C 31.806364 -2.517971 62.241936 -2.518033 92.676019 17.549175"/>
				</g>
				<g stroke-width="8">
					<path transform="matrix(0.641948, -0.387818, 0.387818, 0.641948, 73.545424, 252.913812)" d="M 3.999957 3.998973 L 345.757126 3.999943"/>
					<path transform="matrix(-0.642386, -0.387091, 0.387091, -0.642386, 294.426636, 256.816332)" d="M -0.00130785 4.001866 L 338.79745 3.999582"/>
					<path transform="matrix(0.385815, -0.643154, 0.643154, 0.385815, 118.61033, 295.77414)" d="M 0.00157877 4.000061 L 339.885894 4.000818"/>
					<path transform="matrix(-0.384776, -0.643776, 0.643776, -0.384776, 250.14365, 300.072431)" d="M -0.0020904 3.998745 L 343.962972 4.001613"/>
				</g>
			</g>
			<g fill="currentColor">
				<circle cx="185.77" cy="188.05" r="17"/>
				<circle cx="185.77" cy="50.75" r="15"/><circle cx="121.45" cy="78.61" r="15"/><circle cx="252.46" cy="78.61" r="15"/>
				<circle cx="51.75" cy="189.22" r="15"/><circle cx="77.83" cy="122.14" r="15"/><circle cx="77.83" cy="254.02" r="15"/>
				<circle cx="323.25" cy="188.05" r="15"/><circle cx="296.89" cy="122.12" r="15"/><circle cx="296.89" cy="253.99" r="15"/>
				<circle cx="121.45" cy="297.43" r="15"/><circle cx="252.46" cy="297.43" r="15"/><circle cx="185.77" cy="324.25" r="15"/>
			</g>
		</svg>
		<h2 class="crida-title reveal" use:scramble={{ oc: t.comenca.title.oc, fr: t.comenca.title.fr, lang }}></h2>
		<p class="crida-sub reveal" style="--step: 1" use:scramble={{ oc: t.comenca.sub.oc, fr: t.comenca.sub.fr, lang }}></p>
		<a class="btn-primary crida-btn reveal" style="--step: 2" href="/aprene">
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

	/* L'ombra de la barra apareis al primièr defilament (CSS natiu,
	   pilotat pel defilament — pas de JavaScript). */
	@supports (animation-timeline: scroll()) {
		.topbar {
			animation: barra-ombra linear both;
			animation-timeline: scroll();
			animation-range: 0 140px;
		}
	}

	@keyframes barra-ombra {
		to {
			box-shadow: 0 10px 28px rgba(58, 42, 32, 0.12);
		}
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
		font-family: var(--font-logo); /* Limelight, coma lo lògo (jornal §11, 2026-10-05) */
		font-size: 1.15rem;
		white-space: nowrap; /* « Lo Ligam » se copa pas jamai en doas linhas */
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
		font-family: var(--font-body);
		font-weight: 700;
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

	/* Ecran plan estrech : lo boton « Començar » de la barra fa doblon amb
	   lo grand boton de l'eròi just en dejós, e fasiá desbordar la barra. */
	@media (max-width: 26rem) {
		.topbar .btn-small {
			display: none;
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

	/* Lo menú-vel plen ecran : de linhas gigantas que davalan en cascada,
	   cada linha dins son pròpri masc (overflow hidden) — la revelacion
	   « rideau » dels sites de nautas exigéncias. La barra del naut demòra
	   visibla en dessús (z-index 10 > 9) : son boton ven la crotz ✕. */
	.menu-vel {
		position: fixed;
		inset: 0;
		z-index: 9;
		background: var(--color-cream);
		overflow-y: auto;
		padding: 7.5rem clamp(1.5rem, 6vw, 5rem) 3rem;
		animation: vel-in 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes vel-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.menu-dedins {
		max-width: 72rem;
		margin: 0 auto;
	}

	.menu-familhas {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 3rem clamp(2rem, 6vw, 5rem);
	}

	.menu-jalon {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
		margin: 0 0 0.6rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--color-terracotta);
		opacity: 0;
		animation: fade-arriba 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: calc(var(--md, 0) * 40ms);
	}

	.menu-jalon-dich {
		font-weight: 400;
		letter-spacing: normal;
		text-transform: none;
		font-style: italic;
		color: var(--color-text);
		opacity: 0.55;
	}

	.menu-lista {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.menu-mask {
		overflow: hidden;
	}

	.menu-linha {
		transform: translateY(115%);
		animation: linha-arriba 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: calc(var(--md, 0) * 40ms);
	}

	@keyframes linha-arriba {
		to {
			transform: none;
		}
	}

	@keyframes fade-arriba {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.menu-ligam {
		display: flex;
		align-items: baseline;
		gap: 0.8rem;
		padding: 0.3rem 0;
		text-decoration: none;
		color: var(--color-text);
	}

	.menu-nom {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 3.2vw, 2.3rem);
		line-height: 1.15;
		transition: color 250ms ease;
	}

	.menu-sageta {
		font-size: 1.3rem;
		color: var(--color-terracotta);
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 350ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	a.menu-ligam:hover .menu-nom,
	a.menu-ligam:focus-visible .menu-nom {
		color: var(--color-terracotta);
	}

	a.menu-ligam:hover .menu-sageta,
	a.menu-ligam:focus-visible .menu-sageta {
		opacity: 1;
		transform: none;
	}

	.menu-ligam.leu .menu-nom {
		opacity: 0.32;
	}

	.menu-leu-tag {
		font-style: normal;
		font-size: 0.8rem;
		color: var(--color-gold);
	}

	/* Las ressorsas : de tèxte solet, soslinhat d'aur — pas cap de lògo. */
	.menu-ressorsas {
		margin-top: 3.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(58, 42, 32, 0.15);
	}

	.menu-ressorsas-linha {
		margin: 0;
		font-size: 0.95rem;
		line-height: 2.3;
		opacity: 0;
		animation: fade-arriba 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: calc(var(--md, 0) * 40ms);
	}

	.menu-ressorsa {
		color: var(--color-text);
		text-decoration: none;
		border-bottom: 1.5px solid var(--color-gold);
		padding-bottom: 0.05rem;
		transition:
			color 200ms ease,
			border-color 200ms ease;
	}

	.menu-ressorsa:hover,
	.menu-ressorsa:focus-visible {
		color: var(--color-terracotta);
		border-color: var(--color-terracotta);
	}

	.menu-ressorsa-btn {
		background: none;
		border: none;
		border-bottom: 1.5px solid var(--color-gold);
		font: inherit;
		padding: 0 0 0.05rem;
		cursor: pointer;
	}

	.menu-punt {
		margin: 0 0.7rem;
		opacity: 0.4;
	}

	@media (max-width: 52rem) {
		.menu-vel {
			padding-top: 6rem;
		}

		.menu-familhas {
			grid-template-columns: 1fr;
			gap: 2.2rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.menu-vel,
		.menu-jalon,
		.menu-linha,
		.menu-ressorsas-linha {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}

	/* Repli quand le site ne publie pas d'icône : son initiale sur pastille,
	   plutôt qu'une image cassée (utilisé par le popover des aisinas). */
	.inicial {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--color-brick);
		color: var(--color-cream);
		font-family: var(--font-body);
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
		font-family: var(--font-body);
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

	/* ————————————————————————————————————————————————————————————————
	   La pagina racònte « editorial aerat » (decision Romain 2026-10-05) :
	   marges generosas, títols gigants Limelight, pauc de colors per ecran,
	   imatges calmes — los principis retenguts de la referéncia, amb la
	   matèria Lo Ligam. */
	.page {
		position: relative;
		z-index: 3;
		/* Jamai de defilament orizontal : las doblonas bilingüas de
		   l'efècte scramble pòdon despassar de qualques pixèls. */
		overflow-x: clip;
	}

	/* Acte I — l'eròi. Lo cèl de la fòto es blanc pur : lo fons passa de
	   la crèma de la barra al blanc, e la crèsta se pausa sens costura. */
	.eros {
		min-height: calc(100svh - 64px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		position: relative;
		padding: 4svh 1.5rem 30svh;
		background: linear-gradient(var(--color-cream), #ffffff 55%);
	}

	.eros-kicker {
		margin: 0 0 1rem;
		font-size: clamp(0.8rem, 1.4vw, 1rem);
		font-weight: 600;
		letter-spacing: 0.35em;
		text-indent: 0.35em; /* compensa l'espaci fantauma aprèp la darrièra letra */
		text-transform: uppercase;
		color: var(--color-terracotta);
	}

	.eros-titol {
		margin: 0;
		font-weight: 400;
	}

	/* Cada linha dins son masc : la revelacion « rideau » — lo tèxte monta
	   de darrièr una fenèstra invisibla, linha aprèp linha. */
	.titol-mask {
		display: block;
		overflow: hidden;
		padding: 0.04em 0.1em; /* las letras amb queue (g, ç) se còpan pas */
		margin: -0.04em -0.1em;
	}

	.eros-titol .linha {
		display: block;
		font-family: var(--font-heading);
		font-size: clamp(2.6rem, 10vw, 8.5rem);
		line-height: 1.04;
		text-transform: uppercase;
		color: var(--color-text);
		cursor: default;
		/* L'encra colorada al subrevòl. (L'ancian efècte background-clip
		   rendiá visiblas LAS DOAS lengas empiladas per scramble — pas
		   compatible, testat lo 2026-10-05.) */
		transition: color 500ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.eros-titol .linha:hover {
		color: var(--color-terracotta);
	}

	.eros-sub {
		margin: 1.3rem 0 0;
		font-size: clamp(0.95rem, 1.7vw, 1.1rem);
		opacity: 0.7;
		text-wrap: balance;
	}

	.eros .hero-ctas {
		margin-top: 1.8rem;
	}

	.eros-indici {
		position: absolute;
		bottom: 26svh;
		margin: 0;
		font-size: 0.78rem;
		letter-spacing: 0.2em;
		text-indent: 0.2em;
		text-transform: uppercase;
		opacity: 0.45;
	}

	/* La crèsta de las Cevenas (fòto de Romain, liseron sang e aur §3bis). */
	.eros-paisatge {
		position: absolute;
		inset: auto 0 0 0;
		height: 24svh;
		background: url('/acuelh/paisatge.jpg') 50% 30% / cover no-repeat;
		z-index: 0;
	}

	.eros-paisatge::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(#ffffff, #ffffff00 35%);
	}

	/* L'intrada de l'eròi, al cargament : las linhas del títol montan de
	   lor masc (rideau), la rèsta se lèva doçament. */
	.eros-kicker,
	.eros-sub,
	.eros .hero-ctas,
	.eros-indici {
		opacity: 0;
		transform: translateY(26px);
		animation: intrada 950ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.eros-titol .linha {
		transform: translateY(112%);
		animation: linha-arriba 1050ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.titol-mask:nth-child(1) .linha { animation-delay: 150ms; }
	.titol-mask:nth-child(2) .linha { animation-delay: 280ms; }
	.titol-mask:nth-child(3) .linha { animation-delay: 410ms; }
	.eros-kicker { animation-delay: 60ms; }
	.eros-sub { animation-delay: 650ms; }
	.eros .hero-ctas { animation-delay: 780ms; }
	.eros-indici { animation-delay: 1000ms; }

	@keyframes intrada {
		to {
			opacity: 1;
			transform: none;
		}
	}

	.hero-ctas {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
	}

	.btn-ghost {
		display: inline-block;
		padding: 1rem 1.5rem;
		border-radius: 999px;
		border: 1.5px solid rgba(58, 42, 32, 0.3);
		color: var(--color-text);
		font-family: var(--font-body);
		font-weight: 700;
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
		background: rgba(181, 61, 23, 0.06);
	}

	.btn-primary {
		display: inline-block;
		background: var(--color-gold);
		color: var(--color-text);
		border: none;
		padding: 1rem 1.75rem;
		border-radius: 999px;
		font-weight: 700;
		font-family: var(--font-body);
		font-size: 1.05rem;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 220ms ease,
			filter 80ms ease;
		box-shadow: 0 6px 18px rgba(238, 175, 52, 0.45);
	}

	.btn-primary:hover {
		transform: translateY(-3px) scale(1.03);
		box-shadow: 0 10px 24px rgba(238, 175, 52, 0.55);
	}

	.btn-primary:active {
		transform: translateY(0) scale(0.96);
		filter: brightness(0.95);
		transition-duration: 70ms;
	}

	.btn-small {
		padding: 0.55rem 1.15rem;
		font-size: 0.95rem;
		box-shadow: 0 4px 12px rgba(238, 175, 52, 0.4);
	}

	/* Acte II — l'acuèlh intime. */
	.adieu {
		max-width: 1100px;
		margin: 0 auto;
		padding: clamp(4rem, 12vh, 8rem) clamp(1.2rem, 5vw, 3rem);
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 2rem 4rem;
		align-items: center;
		background: transparent;
	}

	.adieu-lead {
		margin: 0;
		font-size: clamp(1.4rem, 2.8vw, 2.1rem);
		line-height: 1.45;
		max-width: 21em;
	}

	.adieu-sub {
		display: block;
		color: var(--color-terracotta);
	}

	.tagline-secondary {
		margin: 1rem 0 0;
		font-size: 0.95rem;
		color: var(--color-teal);
		text-wrap: pretty;
	}

	.adieu-personatge {
		width: clamp(130px, 15vw, 200px);
		display: block;
	}

	@media (max-width: 720px) {
		.adieu {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.adieu-personatge {
			order: -1;
			margin: 0 auto;
		}
	}

	/* Acte III — los camins, en lista editoriala numerotada. */
	.camins {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 clamp(1.2rem, 5vw, 3rem) clamp(4rem, 10vh, 7rem);
		text-align: left;
	}

	.camins-title {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 4.5vw, 3rem);
		color: var(--color-brick);
		text-wrap: balance;
	}

	.camins-lead {
		margin: 0.75rem 0 2.2rem;
		max-width: 36rem;
		font-size: 1.02rem;
		line-height: 1.55;
		opacity: 0.8;
		text-wrap: pretty;
	}

	.camin {
		position: relative;
		display: grid;
		grid-template-columns: 3rem 1fr auto 2.5rem;
		gap: 1.5rem;
		align-items: center;
		padding: 1.5rem 1rem;
		border-top: 1px solid rgba(58, 42, 32, 0.15);
		text-decoration: none;
		color: inherit;
		transition: padding-left 500ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* Lo balajatge de crèma : una tela que se desplega d'esquèrra a drecha
	   al subrevòl (transform solet — pas de recalcul de pagina). */
	.camin::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--color-cream);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
		z-index: -1;
	}

	.camin:last-of-type {
		border-bottom: 1px solid rgba(58, 42, 32, 0.15);
	}

	.camin-n {
		font-family: var(--font-heading);
		font-size: 1rem;
		opacity: 0.4;
	}

	.camin-nom {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 4.2vw, 2.9rem);
		line-height: 1.1;
		transition: color 350ms ease;
	}

	.camin-dich {
		font-size: 0.9rem;
		font-style: italic;
		opacity: 0.6;
		text-align: right;
		max-width: 16em;
	}

	.camin-sageta {
		font-size: 1.5rem;
		color: var(--color-terracotta);
		transform: translateX(-8px);
		opacity: 0;
		transition: all 450ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	a.camin:hover,
	a.camin:focus-visible {
		padding-left: 2rem;
	}

	a.camin:hover::before,
	a.camin:focus-visible::before {
		transform: scaleX(1);
	}

	a.camin:hover .camin-n {
		color: var(--color-terracotta);
		opacity: 1;
	}

	.camin-n {
		transition: color 350ms ease, opacity 350ms ease;
	}

	a.camin:hover .camin-sageta,
	a.camin:focus-visible .camin-sageta {
		transform: none;
		opacity: 1;
	}

	a.camin:hover .camin-nom {
		color: var(--color-terracotta);
	}

	.camin.leu {
		grid-template-columns: 3rem 1fr auto;
	}

	.camin.leu .camin-nom {
		opacity: 0.35;
	}

	.camin-leu-tag {
		font-style: normal;
		color: var(--color-gold);
	}

	@media (max-width: 720px) {
		.camin {
			grid-template-columns: 2rem 1fr 1.6rem;
		}

		.camin.leu {
			grid-template-columns: 2rem 1fr;
		}

		.camin-dich {
			display: none;
		}
	}

	/* Los capítols que demòran (lenga, carta, officialitat) : la meteissa
	   gramatica aerada, títols Limelight. */
	.chapter {
		position: relative;
		z-index: 3;
		padding: clamp(4rem, 11vh, 7rem) 1.5rem;
		text-align: center;
	}

	.chapter--lenga {
		background: var(--color-cream);
	}

	.chapter-jalon {
		margin: 0 0 0.75rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.28em;
		text-indent: 0.28em;
		text-transform: uppercase;
		color: var(--color-terracotta);
	}

	.chapter-title {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.9rem, 5vw, 3.4rem);
		color: var(--color-text);
		text-wrap: balance;
	}

	.chapter-lead {
		max-width: 36rem;
		margin: 1rem auto 0;
		font-size: 1.02rem;
		line-height: 1.6;
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

	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: 1.5rem;
		max-width: 48rem;
		margin: 3rem auto 0;
	}

	.fact {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	/* Jamai de retorn a la linha dins un chifra : « ≈ 600 000 » copat en
	   doas linhas desalinhava las tres colomnas (vist per Romain). */
	.fact-num {
		font-family: var(--font-heading);
		font-size: clamp(1.9rem, 3.4vw, 3.1rem);
		line-height: 1;
		white-space: nowrap;
		color: var(--color-terracotta);
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
		/* Linhas de longors equilibradas : lo paragraf centrat fasiá de
		   linhas iregularas (« desordonat », disiá Romain amb rason). */
		text-wrap: balance;
	}

	/* Acte IV — la benda-paisatge : la votz poetica en blanc sus las
	   Cevenas, parallaxa doça pilotada pel defilament (CSS natiu). */
	.benda {
		position: relative;
		min-height: 64svh;
		display: grid;
		place-items: center;
		overflow: clip;
		text-align: center;
		padding: 4rem 1.5rem;
	}

	.benda-fons {
		position: absolute;
		inset: -16% 0;
		background: url('/acuelh/paisatge.jpg') 50% 62% / cover no-repeat;
	}

	.benda-fons::after {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(90, 30, 10, 0.42);
	}

	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.benda-fons {
				animation: benda-parallaxa linear both;
				animation-timeline: view();
			}
		}
	}

	@keyframes benda-parallaxa {
		from {
			transform: translateY(5%);
		}
		to {
			transform: translateY(-5%);
		}
	}

	.citacion {
		position: relative;
		margin: 0;
		max-width: 15em;
	}

	.citacion-texte {
		margin: 0;
		font-family: var(--font-quote);
		font-style: italic;
		font-weight: 500;
		font-size: clamp(1.7rem, 4.2vw, 3rem);
		line-height: 1.35;
		color: #fdfaf4;
		text-wrap: balance;
	}

	.citacion-autor {
		display: block;
		margin-top: 1rem;
		font-style: normal;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(253, 250, 244, 0.75);
	}

	/* Carte réellement manipulable depuis l'accueil : on peut se déplacer
	   et zoomer sur place. Le bouton sous la carte mène à la page pleine. */
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
		padding: 1rem 1.5rem 3rem;
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
		font-family: var(--font-body);
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

	/* Acte V — lo darrièr crit. */
	.crida {
		position: relative;
		z-index: 3;
		text-align: center;
		padding: clamp(6rem, 16vh, 10rem) 1.5rem clamp(4rem, 9vh, 6rem);
		background: var(--color-cream);
		overflow: clip;
	}

	.crida-simbol {
		position: absolute;
		width: min(70vw, 540px);
		height: auto;
		left: 50%;
		top: 46%;
		transform: translate(-50%, -50%);
		color: var(--color-terracotta);
		opacity: 0.07;
		pointer-events: none;
	}

	/* La constellacion respira : una rotacion de tres minutas, a la limita
	   del perceptible. */
	@media (prefers-reduced-motion: no-preference) {
		.crida-simbol {
			animation: simbol-vira 180s linear infinite;
		}
	}

	@keyframes simbol-vira {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	.crida-title {
		position: relative;
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.3rem, 7.5vw, 5.8rem);
		line-height: 1.05;
		text-transform: uppercase;
		color: var(--color-text);
		text-wrap: balance;
	}

	.crida-sub {
		position: relative;
		margin: 1.2rem 0 2.2rem;
		font-style: italic;
		opacity: 0.6;
	}

	.crida-btn {
		position: relative;
		font-size: clamp(1.05rem, 2.2vw, 1.3rem);
		padding: 1.05rem 2.4rem;
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
		font-family: var(--font-body);
		font-weight: 700;
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
		font-family: var(--font-body);
		font-weight: 700;
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
		font-family: var(--font-body);
		font-weight: 700;
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

	/* Mens d'animacions demandadas : tot s'aficha, res bolega. */
	@media (prefers-reduced-motion: reduce) {
		.eros-kicker,
		.eros-titol .linha,
		.eros-sub,
		.eros .hero-ctas,
		.eros-indici {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
