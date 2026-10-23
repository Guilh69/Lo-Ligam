<script>
	import Icona from '$lib/components/Icona.svelte';
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import CartaOccitania from '$lib/components/CartaOccitania.svelte';
	import RailJaces from '$lib/components/RailJaces.svelte';
	import CargamentCarta from '$lib/components/CargamentCarta.svelte';
	import Guida from '$lib/components/Guida.svelte';
	import LegendaLocutors from '$lib/components/LegendaLocutors.svelte';
	import InfoIcon from '$lib/components/InfoIcon.svelte';
	import { tampaDefòra } from '$lib/tampaDefora.js';
	import { estatCarta, ecranCarta } from '$lib/carta/estatCarta.svelte.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { cargarColas } from '$lib/carta/colasBasa.js';
	import { esAdmin } from '$lib/adminStore';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import { CATALOGUE, fusionarCatalogue, JACES_FONS } from '$lib/carta/catalogue.js';

	let lang = $derived(langStore.current);

	// Textes de l'interface dans les deux langues. L'occitan reste la
	// version de référence, le français en est la traduction.
	const t = {
		oc: {
			title: 'Lo Mond en occitan',
			intro: 'Fons de carta en occitan, realizat per',
			introEnd: "amb l'Institut d'Estudis Occitans.",
			close: 'Tampar',
			more: 'Saber mai sus lo Mond en occitan',
			guida: 'Tornar veire los primièrs passes'
		},
		fr: {
			title: 'Le Monde en occitan',
			intro: 'Fond de carte en occitan, réalisé par',
			introEnd: "avec l'Institut d'Études Occitanes.",
			close: 'Fermer',
			more: 'En savoir plus sur le Monde en occitan',
			guida: 'Revoir les premiers pas'
		}
	};

	// Les premiers pas de la carte (tutoriel de première connexion, Guida.svelte).
	// Un parcours, du plus important au plus « gadget » (Romain, 2026-10-23 :
	// gérer ses couches, comprendre les échelles en touchant la carte, chercher
	// un lieu, le zoom, revenir à l'Occitanie, vider et annuler) : la commande à
	// toucher (le halo la suit quand un panneau s'ouvre), et ce qui coche l'étape
	// quand le geste est vraiment fait. Tutoiement (cahier §11, 2026-10-22).
	const alucadas = () => familhas.flatMap((f) => f.jaces.filter((j) => layerVisibility[j.id]).map((j) => j.id));
	const tirador = (k) => document.querySelector(`#tirador-jaces[data-tirador="${k}"]`);
	// « Sus la carta » dans le rail (sur téléphone, une famille ouverte le remplace
	// par sa rangée de pastilles : on vise alors le bouton qui revient au rail)
	const railSus = () => document.querySelector('.rail-sus') ?? document.querySelector('.rail .banda-fam');
	const tiradorFamilha = () => {
		const t = document.querySelector('#tirador-jaces');
		return t && !['sus', 'fons'].includes(t.dataset.tirador) ? t : null;
	};
	const aLEcran = (el) => {
		const r = el?.getBoundingClientRect();
		return r && r.left >= 0 && r.right <= innerWidth ? el : null;
	};
	// (vers Rodez : sur l'occitan à l'arrivée, sur ordinateur comme sur téléphone)
	const puntCarta = () => {
		const p = ecranCarta.punt?.(44.35, 2.57);
		return p && { left: p.x, top: p.y, width: 1, height: 1, punt: true };
	};
	const ETAPAS = [
		{
			titol: { oc: 'Alucar una jaça', fr: 'Allumer une couche' },
			tèxt: {
				oc: 'Dobrís una familha (Territòri, per exemple) e aluca una jaça : Despartaments.',
				fr: 'Ouvre une famille (Territoire, par exemple) et allume une couche : Départements.'
			},
			// (sur téléphone, une famille ouverte devient une rangée de pastilles en bas)
			cibla: () =>
				tirador('administracion')?.querySelector('[data-jaca="despartaments"]') ??
				tiradorFamilha() ??
				aLEcran(document.querySelector('.banda-jaces .chip[data-jaca="despartaments"]')) ??
				document.querySelector('.banda-jaces') ??
				document.querySelector('[data-familha="administracion"]'),
			inici: alucadas,
			fach: (abans) => alucadas().some((id) => !abans.includes(id))
		},
		{
			titol: { oc: 'Gerir tas jaças', fr: 'Gérer tes couches' },
			tèxt: {
				oc: 'Dobrís « Sus la carta » : i son totas tas jaças alucadas. Escantís-ne una amb son boton ; « Anullar », just dessús, la torna.',
				fr: 'Ouvre « Sur la carte » : toutes tes couches allumées y sont. Éteins-en une avec son bouton ; « Annuler », juste au-dessus, la ramène.'
			},
			// le bouton de la couche active (la dernière allumée), puis « Anullar »
			// (une couche éteinte quitte « Sus la carta » : on ne l'y rallume pas)
			cibla: (mem) => {
				const t = tirador('sus');
				if (!t) return railSus();
				if (mem.escantida) return t.querySelector('.botons-sus .boton');
				// (sur téléphone, la ligne active peut être plus bas dans le panneau, hors de vue)
				const activa = t.querySelector('.linha.activa .basc')?.getBoundingClientRect(), c = t.getBoundingClientRect();
				return activa && activa.top >= c.top && activa.bottom <= Math.min(c.bottom, innerHeight - 80) ? t.querySelector('.linha.activa .basc') : t.querySelector('.linha .basc');
			},
			inici: alucadas,
			fach: (abans, mem) => {
				const ara = alucadas();
				mem.escantida ??= abans.find((id) => !ara.includes(id));
				return !!mem.escantida && ara.includes(mem.escantida);
			}
		},
		{
			titol: { oc: 'Causir sus la carta', fr: 'Choisir sur la carte' },
			tèxt: {
				oc: 'La jaça activa, enlusida dins « Sus la carta », decidís l’escala : region, despartament, vila… Tòca lo nom d’una jaça per l’activar, puèi tòca la carta.',
				fr: 'La couche active, en surbrillance dans « Sur la carte », décide de l’échelle : région, département, ville… Touche le nom d’une couche pour l’activer, puis touche la carte.'
			},
			cibla: () => tirador('sus') ?? puntCarta() ?? railSus(),
			inici: () => estatCarta.causida,
			fach: (abans) => !!estatCarta.causida && estatCarta.causida !== abans
		},
		{
			titol: { oc: 'Cercar un luòc', fr: 'Chercher un lieu' },
			tèxt: {
				oc: 'Escriu lo nom d’una vila o d’un despartament, puèi causís-lo dins la lista.',
				fr: 'Écris le nom d’une ville ou d’un département, puis choisis-le dans la liste.'
			},
			cibla: '.cerca',
			ev: { nom: 'carta-cercat' }
		},
		{
			titol: { oc: 'Raprochar, alunhar', fr: 'Zoomer' },
			tèxt: {
				oc: 'Los botons + e −, la moleta de la mirga o dos dets sus l’ecran. D’unas jaças se veson sonque de prèp.',
				fr: 'Les boutons + et −, la molette de la souris ou deux doigts sur l’écran. Certaines couches ne se voient que de près.'
			},
			cibla: '.leaflet-control-zoom',
			// (le vol de la recherche se pose d'abord : son zoom ne compte pas)
			pausa: 1800,
			inici: () => estatCarta.z,
			fach: (z) => estatCarta.z !== z
		},
		{
			titol: { oc: 'Tornar a l’Occitània', fr: 'Revenir à l’Occitanie' },
			tèxt: {
				oc: 'Aqueste boton te torna a la vista de tota l’Occitània.',
				fr: 'Ce bouton te ramène à la vue de toute l’Occitanie.'
			},
			cibla: '.tornar-oc',
			ev: { nom: 'click', sel: '.tornar-oc' }
		},
		{
			titol: { oc: 'Netejar e anullar', fr: 'Vider et annuler' },
			tèxt: {
				oc: 'Netejar la carta escantís totas las jaças ; Anullar, dins « Sus la carta » (o Ctrl+Z), las torna. Ensaja los dos.',
				fr: 'Vider la carte éteint toutes les couches ; Annuler, dans « Sur la carte » (ou Ctrl+Z), les ramène. Essaie les deux.'
			},
			// d'abord le bouton qui vide, puis « Anullar » (le panneau, ouvert ou pas)
			cibla: (mem) => (!mem.buit ? '.netejar-carta' : (tirador('sus')?.querySelector('.botons-sus .boton') ?? railSus())),
			fach: (_, mem) => {
				const n = alucadas().length;
				if (n === 0) mem.buit = true;
				return !!mem.buit && n > 0;
			}
		},
		{
			titol: { oc: 'Lo fons de carta', fr: 'Le fond de carte' },
			tèxt: {
				oc: 'Contorns, occitan, natural o satellit : causís lo fons que t’agrada.',
				fr: 'Contours, occitan, naturel ou satellite : choisis le fond qui te plaît.'
			},
			cibla: () => tirador('fons')?.querySelector('.fonses') ?? document.querySelector('.fons-carta'),
			inici: () => baseLayer,
			fach: (b) => baseLayer !== b
		}
	];
	const FIN = { oc: 'Bon viatge sus la carta !', fr: 'Bon voyage sur la carte !' };
	const NÒTA = { oc: 'Per tornar veire los primièrs passes : aicí.', fr: 'Pour revoir les premiers pas : ici.', cibla: '.info-trigger' };
	let guida = $state(null);
	let tx = $derived(t[lang]);

	let showInfo = $state(false);
	// la pancarta se tampa d'un clic defòra o amb Escapar (principi del site,
	// $lib/tampaDefora.js)
	$effect(() => {
		if (!showInfo) return;
		const lèva = tampaDefòra((t) => !!t.closest('.info-card'), () => (showInfo = false));
		const tòca = (e) => e.key === 'Escape' && (showInfo = false);
		document.addEventListener('keydown', tòca);
		return () => {
			lèva();
			document.removeEventListener('keydown', tòca);
		};
	});
	// elements e colors del fons, dialècte causit (rail de las jaces)
	// los elements del fons Contorns seguisson lors jaces (vilas, noms, rius…)
	const elements = $derived({
		...Object.fromEntries(Object.entries(JACES_FONS).map(([jaça, el]) => [el, !!layerVisibility[jaça]])),
		costa: true
	});
	let colors = $state({});
	// las zònas dialectalas causidas (mantuna se pòt)
	let causits = $state([]);
	// Par défaut, la carte en étoiles de l'accueil (2026-10-07) : la carte
	// détaillée en occitan se découvre dessous en s'approchant.
	let baseLayer = $state('estelas');

	// Lo catalògue de las jaces (lib/carta/catalogue.js) : cinc familhas, que
	// valon per totes los fonses. La basa (taula carta_colas, gerida dins
	// /admin/carta) pòt renomenar una jaça o n'apondre ; se respond pas
	// (projècte gratuit en pausa), lo catalògue s'aficha parièr.
	let familhas = $state(fusionarCatalogue([]));
	let layerVisibility = $state(
		Object.fromEntries(CATALOGUE.flatMap((f) => f.jaces.map((j) => [j.id, !!j.defaut])))
	);

	// Lo bas real del capçal (una o doas linhas segon la largor) : la recèrca
	// e lo boton d'informacion se plaçan just dejós (retorn de Romain : la
	// barra tocava « Mots » e « Òbras »)
	let capçalEl = $state(null);
	// La carta en plen ecran, en mòde visualizacion (demanda de Romain,
	// 2026-10-08) : lo bandèu, lo catalògue e la recèrca s'amagan (amagats e
	// pas levats : lo panèl garda son estat) ; lo navegador passa en plen
	// ecran quand o sap far (pas sus iPhone : lo mòde demòra). Escap ne sortís.
	let visualizacion = $state(false);
	let screenEl = $state(null);
	function basculaVisualizacion(on) {
		visualizacion = on;
		if (on) screenEl?.requestFullscreen?.().catch(() => {});
		else if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
	}
	$effect(() => {
		const quitar = () => {
			if (!document.fullscreenElement && visualizacion) visualizacion = false;
		};
		const escap = (e) => {
			if (e.key === 'Escape' && visualizacion && !document.fullscreenElement) visualizacion = false;
		};
		// (sens plen ecran del navegador, la pagina defila pas cap al pè de pagina)
		if (visualizacion) window.scrollTo(0, 0);
		document.documentElement.style.overflow = visualizacion ? 'hidden' : '';
		document.addEventListener('fullscreenchange', quitar);
		window.addEventListener('keydown', escap);
		return () => {
			document.removeEventListener('fullscreenchange', quitar);
			window.removeEventListener('keydown', escap);
			document.documentElement.style.overflow = '';
		};
	});
	let capBas = $state(0);
	$effect(() => {
		if (!capçalEl) return;
		const mesurar = () => {
			const t = capçalEl.firstElementChild?.getBoundingClientRect();
			if (t) capBas = Math.round(t.bottom - capçalEl.getBoundingClientRect().top);
		};
		mesurar();
		const ro = new ResizeObserver(mesurar);
		ro.observe(capçalEl);
		return () => ro.disconnect();
	});

	onMount(async () => {
		const { data } = await cargarColas();
		if (data?.length) {
			familhas = fusionarCatalogue(data);
			// visibilitat per defaut reglabla dins l'admin (colomna « visibla »),
			// sonque per las jaces apondudas dins l'admin : las del catalògue
			// seguisson la vista d'arribada (l'entrada en scèna, demanda de Romain)
			for (const f of familhas) for (const j of f.jaces) if (!(j.id in layerVisibility)) layerVisibility[j.id] = !!j.defaut;
		}

		if (!browser) return;
		// (le panneau de première visite « Trois portes » est débranché le 2026-10-23,
		// à la demande de Romain : le tutoriel de première connexion le remplacera ;
		// la pancarte des crédits reste derrière le bouton « ? »)
		const ensag = new URLSearchParams(location.search).get('ensag');
		ensagGuida = ensag === 'guida'; // les premiers pas, à chaque visite
	});

	let ensagGuida = $state(false);
	let nautLegenda = $state(0); // la hauteur de la légende des locuteurs, pour décaler les mots à écouter
	// La bascule de lecture Territòri / Uèi / Reviscolada est retirée (Romain,
	// 2026-10-23 : « ça fait doublon avec tout le reste », ses couches sont dans
	// le rail). Ce qu'elle faisait de plus est gardé : la couche des locuteurs
	// (OPLO 2020) estompe les teintes des dialectes et montre sa légende.
	const lectura = $derived(layerVisibility.locutors ? 1 : 0);
</script>

<svelte:head>
	<title>{tx.title} · Lo Ligam</title>
</svelte:head>

<div class="screen" class:visualizacion bind:this={screenEl} style:--cap-bas={capBas ? capBas + 'px' : null}>
	<!-- Le bandeau commun flotte sur la carte, dans un dégradé de nuit -->
	<div class="capçal" bind:this={capçalEl}>
		<AppHeader />
	</div>

	<main class="carta-wrap" style:--lectura-naut="{nautLegenda}px">
		<CartaOccitania
			visibility={layerVisibility}
			{lectura}
			{baseLayer}
			clar={ambianca.clar}
			dalt={ambianca.dalt}
			{lang}
			{elements}
			{colors}
			bind:causits
			{visualizacion}
			onVisualizacion={basculaVisualizacion}
			onAlucar={(k, v = true) => (layerVisibility[k] = v)}
			onNetejar={() => {
				// (coma « Netejar la carta » del panèl : las jaces de las familhas, pas los reglatges)
				for (const f of familhas) for (const j of f.jaces) if (layerVisibility[j.id]) layerVisibility[j.id] = false;
				causits = [];
			}}
		/>
		<!-- l'écran de chargement, jusqu'à ce que la carte soit prête (lot 2) -->
		{#if !estatCarta.prèsta}<CargamentCarta {lang} />{/if}

		{#if showInfo}
			<div class="info-card" transition:fly={{ y: -12, duration: 260, easing: quintOut }}>
				<button
					type="button"
					class="info-close"
					onclick={() => (showInfo = false)}
					aria-label={tx.close}><Icona nom="fermer" size="1.25em" /></button
				>
				<h1>{tx.title}</h1>
				<p>
					{tx.intro}
					<a href="https://www.openstreetmap.bzh/" target="_blank" rel="noopener noreferrer"
						>OpenStreetMap e occitan</a
					>
					{tx.introEnd}
				</p>
				{#if guida}<button
					type="button"
					class="info-guida"
					onclick={() => {
						showInfo = false;
						tick().then(() => guida?.lançar()); // (le bouton « ? » revient d'abord)
					}}><Icona nom="suivant" size="0.9em" /> {tx.guida}</button
				>{/if}
			</div>
		{:else}
			<button
				type="button"
				class="info-trigger comandas-carta"
				onclick={() => (showInfo = true)}
				aria-label={tx.more}
				transition:fly={{ y: -12, duration: 220, easing: quintOut }}
			>
				<InfoIcon size={22} />
			</button>
		{/if}

		<RailJaces
			{familhas}
			bind:visibility={layerVisibility}
			bind:baseLayer
			bind:colors
			bind:causits
			clar={ambianca.clar}
			{lang}
			esAdmin={$esAdmin}
		/>

		<!-- les premiers pas, dès la carte prête (l'essai se lit après le montage :
		     le guide repart alors sans mémoire) -->
		{#key ensagGuida}
			<Guida bind:this={guida} etapas={ETAPAS} clau="lo-ligam-carta-primiers-passes" fin={FIN} nota={NÒTA} ensag={ensagGuida} {lang} lest={estatCarta.prèsta} />
		{/key}
		{#if layerVisibility.locutors}<LegendaLocutors {lang} clar={ambianca.clar} dalt={ambianca.dalt} onNaut={(h) => (nautLegenda = h)} />{/if}
	</main>
</div>

<style>

	/* Carte plein écran, harmonisée avec la charte de l'accueil (2026-10-07) :
	   la carte occupe toute la fenêtre, le bandeau et les panneaux flottent
	   dessus en verre sombre (ou crème en thème clair). */
	.screen {
		--marge: clamp(1rem, 4vw, 3.4rem);
		--ease: cubic-bezier(0.19, 1, 0.22, 1);
		position: relative;
		height: 100dvh;
		container: carta / size;
		overflow: hidden;
		color: var(--t-tinta);
		background: var(--t-fons);
	}

	/* lo mòde visualizacion : sonque la carta e sos aisinas de lectura */
	.screen.visualizacion .capçal,
	.screen.visualizacion :global(.info-trigger),
	.screen.visualizacion :global(.info-card),
	.screen.visualizacion :global(.rail),
	.screen.visualizacion :global(.tirador),
	.screen.visualizacion :global(.guida) {
		display: none !important;
	}
	.capçal {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1100;
		padding: 1.3rem var(--marge) 2.4rem;
		background: linear-gradient(var(--t-fons) 35%, color-mix(in srgb, var(--t-fons) 70%, transparent) 65%, transparent);
		pointer-events: none;
	}

	.capçal :global(.top) {
		max-width: none;
		pointer-events: auto;
	}

	.carta-wrap {
		position: absolute;
		inset: 0;
	}

	/* ---------- Verre sombre commun aux panneaux et boutons ---------- */
	.info-card {
		position: absolute;
		z-index: 1000;
		background: color-mix(in srgb, var(--t-fons-2) 92%, transparent);
		backdrop-filter: blur(10px);
		border: 1px solid var(--t-linha);
		border-radius: 18px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
		color: var(--t-tinta);
	}

	.info-trigger,
	.info-close {
		display: grid;
		place-items: center;
		padding: 0;
		/* même verre que le rail et les boutons de la carte, sans trait (Romain, 2026-10-15) */
		border: 0;
		border-radius: 50%;
		background: var(--t-veire);
		backdrop-filter: blur(10px);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
		color: var(--t-aur-clar);
		cursor: pointer;
		transition:
			background 0.4s,
			transform 0.6s var(--ease);
	}

	.info-trigger:hover,
	.info-close:hover {
		background: var(--t-veire-fort);
		color: var(--t-aur);
	}

	.info-trigger:focus-visible,
	.info-close:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
	}

	/* ---------- Carte d'information ---------- */
	.info-card {
		top: calc(var(--cap-bas, 5.4rem) + 18px);
		right: var(--marge);
		width: min(22rem, calc(100vw - 2rem));
		padding: 1.3rem 1.4rem 1.2rem;
	}

	.info-card h1 {
		margin: 0 2rem 0.6rem 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.7rem;
		line-height: 1.05;
	}

	.info-card p {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--t-tinta-2);
	}

	.info-guida {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		min-height: 44px;
		margin-top: 0.8rem;
		padding: 0 1rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		font-size: 0.88rem;
		font-weight: 700;
		cursor: pointer;
		transition: background 0.3s, border-color 0.3s;
	}
	.info-guida:hover,
	.info-guida:focus-visible {
		background: color-mix(in srgb, var(--t-terra) 14%, transparent);
		border-color: var(--t-terra);
	}

	.info-card a {
		color: var(--t-aur-clar);
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--t-aur) 50%, transparent);
		text-underline-offset: 3px;
	}

	.info-close {
		position: absolute;
		top: 0.7rem;
		right: 0.7rem;
		width: 2rem;
		height: 2rem;
		font-size: 1.1rem;
		line-height: 1;
	}

	.info-trigger {
		position: absolute;
		z-index: 1000;
		top: calc(var(--cap-bas, 5.4rem) + 18px);
		right: var(--marge);
		width: 2.6rem;
		height: 2.6rem;
	}

	/* Telefon (retorn de Romain : lo rail espotissiá la barra de recèrca) :
	   las jaces passan dins una barra en bas, a portada del det ; la recèrca
	   pren tota la largor en naut, lo boton d'informacion a son costat ; las
	   aisinas de lectura (escala, bossòla, zoom, fonts) se lèvan sus la barra */
	/* (capçal sus doas linhas : lo boton s'aliniá pas pus amb la recèrca) */
	@media (max-width: 760px) {
		.info-trigger,
		.info-card {
			top: calc(var(--cap-bas, 6.4rem) + 18px);
		}
	}
	/* lo panèl de las jaces en bas a l'orizontala (sus un ecran larg) : las
	   aisinas de lectura se lèvan sus el */
	@container carta (min-width: 601px) {
		.carta-wrap:global(.jaces-orizontalas) {
			--barra-bas: 5.6rem;
		}
	}
	@container carta (max-width: 600px) {
		.carta-wrap {
			--barra-bas: calc(3.9rem + env(safe-area-inset-bottom, 0px));
		}
		.info-trigger {
			right: 0.75rem;
		}
		.info-card {
			right: 0.75rem;
			width: calc(100% - 1.5rem);
		}
	}

</style>
