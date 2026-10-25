<script>
	import Icona from '$lib/components/Icona.svelte';
	// Accueil (2026-10-07) : l'esbòs de nuèch validé par Romain, porté dans le
	// site et posé dans le cadre commun (bandeau AppHeader, pied SiteFooter,
	// réglage d'ambiance, retour en haut).
	//
	// Réorganisé le 2026-10-15 (cahier §11), d'après le site de l'Alliance des
	// collectivités pour la qualité de l'air : chaque section répond à une seule
	// question du visiteur, et le titre « Se parla. S'apren. Se viu. » devient
	// le plan de la page (option A de Romain, avec le meilleur de l'option B) :
	//   - un seul bouton principal à l'ouverture (la carte) ;
	//   - « Qui » : le manifeste sans numéro, avec la photo de Romain ;
	//   - 01 Se parla : la carte, les chiffres et le wiki ;
	//   - 02 S'apren : les trois façons d'apprendre ;
	//   - 03 Se viu : Descobrir (Mots, Òbras, Articles) et Amassa (forum,
	//     groupes, boîte à idées, Instagram) ; les rubriques à développer avant
	//     la diffusion du site ont déjà leur lien ;
	//   - « Quatre camins » retiré (il répétait le menu ; l'ancienne version
	//     reste dans l'historique Git, commit 614ff3c et avant).
	//
	// Le mouvement (fond vivant, constellation, carte en étoiles, défilement)
	// vit dans $lib/acuelh/motor.js, chargé après coup pour que la page
	// s'affiche vite.
	//
	// Édition sur place (2026-10-24, revisions/2026-10-24-edicion-sus-plaça.md) :
	// les textes, liens, images et listes de la page viennent des éléments
	// publiés (+page.server.js : base, sinon filet $lib/data/elements-filet.json)
	// et se lisent par txt(), ligam(), imatge(), lista() ; chaque élément porte
	// l'action `editar` avec sa clé. Romain les change lui-même, connecté avec
	// son compte administrateur : Claude ne retouche plus ces textes ici.
	import { onMount } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import { CONSIGNAS, DRAPEUS, SEQ } from '$lib/acuelh/donadas.js';
	import { AMASSA } from '$lib/acuelh/amassa.js';
	import { PLAN, VISIO } from '$lib/data/planSite.js';
	import { edicion, iniciar, txt, ligam, imatge, lista, amagat, apondre } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import { PALETAS, pictoPer } from '$lib/apren/teulas.js';
	import TresMondes from '$lib/acuelh/TresMondes.svelte';
	import '$lib/acuelh/acuelh.css';

	let { data } = $props();
	const lèvaEdicion = iniciar('acuelh', data.elements);

	let fr = $derived(langStore.current === 'fr');

	let racina;
	let motor = $state.raw(null);

	// Mise en ordre de l'ouverture (Romain, 2026-10-21 : « les éléments flottent »,
	// « trop de vide au milieu ») : « Fils d'or » à comparer sur /?ensag=eros ;
	// sans le paramètre, l'actuelle. Chaque phrase du titre se prolonge par un
	// trait doré jusqu'à son chemin. (Colonne, Sommaire et Fenêtre, essayées le
	// même jour, n'ont pas convaincu.)
	const FORMAS_EROS = [
		['actual', 'Actuelle'],
		['fials', 'Fils d’or']
	];
	const CLAU_ENSAG_EROS = 'lo-ligam-ensag-eros';
	let formaEros = $state('actual');
	let ensagEros = $state(false);
	function causirFormaEros(v) {
		formaEros = v;
		try {
			localStorage.setItem(CLAU_ENSAG_EROS, v);
		} catch {
			// pas grave : le choix vaut pour la visite
		}
	}
	// Séparation des sections (refonte claire, étape 4b, 2026-10-21 : l'accueil
	// reste la vue d'ensemble, on améliore la séparation et la compréhension) :
	// à comparer sur /?ensag=separa ; sans le paramètre, l'actuelle.
	const FORMAS_SEPARA = [
		['actual', 'Actuelle'],
		['bandas', 'Bandes'],
		['capitols', 'Chapitres'],
		['totes', 'Les deux']
	];
	// Bascule en français (DIRECCION bloc 2, 2026-10-22) : trois essais (Lien,
	// Bilingue, Choix) comparés le 22-10 ; Romain a préféré mettre en avant le
	// bouton Òc / Fr de la barre à la première visite (AppHeader.svelte).
	const CLAU_ENSAG_SEPARA = 'lo-ligam-ensag-separa';
	let formaSepara = $state('actual');
	let ensagSepara = $state(false);
	function causirFormaSepara(v) {
		formaSepara = v;
		try {
			localStorage.setItem(CLAU_ENSAG_SEPARA, v);
		} catch {
			// pas grave : le choix vaut pour la visite
		}
	}
	// Essai « Chapitres de couleur » (direction B, 2026-10-25, /?ensag=blocs) :
	// les trois entités deviennent des chapitres au fond calme et teinté (la
	// braise ne reste qu'au héros et à l'appel), avec leurs portes en blocs, dans
	// la palette sourde « terra » des rubriques. Sans le paramètre, rien ne change.
	// À rendre définitif ou à retirer après le choix de Romain.
	const FORMAS_BLOCS = [
		['actual', 'Actuelle'],
		['B', 'Chapitres']
	];
	const CLAU_ENSAG_BLOCS = 'lo-ligam-ensag-blocs';
	let formaBlocs = $state('actual');
	let ensagBlocs = $state(false);
	function causirFormaBlocs(v) {
		formaBlocs = v;
		try {
			localStorage.setItem(CLAU_ENSAG_BLOCS, v);
		} catch {
			// pas grave : le choix vaut pour la visite
		}
	}
	// Les blocs prennent la palette sourde « terra », décalée par chapitre pour
	// que chaque entité parte sur sa propre teinte (chaud, pétrole, prune)
	const TERRA = PALETAS.terra;
	const terraColor = (i) => TERRA[((i % TERRA.length) + TERRA.length) % TERRA.length];
	const CHAPS = { parla: { ini: 0 }, apren: { ini: 4 }, viu: { ini: 2 } };
	// Essai « Los tres mondes » (direction d'accueil validée le 2026-10-25, /?ensag=mondes) :
	// les trois entités deviennent des fenêtres vivantes (composant TresMondes) ; le milieu
	// actuel s'efface, le héros garde son titre, le manifeste et le troubadour restent.
	const FORMAS_MONDES = [
		['actual', 'Actuelle'],
		['mondes', 'Los tres mondes']
	];
	const CLAU_ENSAG_MONDES = 'lo-ligam-ensag-mondes';
	let formaMondes = $state('actual');
	let ensagMondes = $state(false);
	function causirFormaMondes(v) {
		formaMondes = v;
		try {
			localStorage.setItem(CLAU_ENSAG_MONDES, v);
		} catch {
			// pas grave : le choix vaut pour la visite
		}
	}
	// Les trois chemins, pris dans le plan du site (le même que le menu et le
	// pied de page) : un chemin principal et quelques autres. « Amassa » mène à
	// sa section plus bas tant que le fòrum et les grops ne sont pas faits.
	const rubrica = (href) => PLAN.flatMap((s) => s.grops.flatMap((g) => g.items)).find((i) => i.href === href);
	const [PARLA, APREN, VIU] = PLAN;
	const FIALS = [
		{ ...PARLA, cap: rubrica('/carta'), autres: [rubrica('/wiki'), rubrica('/obras'), rubrica('/articles')] },
		{ ...APREN, cap: rubrica('/aprene'), autres: [rubrica('/aprene/essai'), rubrica(VISIO)] },
		{ ...VIU, cap: { ...VIU.grops[0], href: '#viure' }, autres: [rubrica('/forum'), rubrica('/grops'), rubrica('/ideas')] }
	];
	// Le trait part de la fin de chaque phrase, dans la langue affichée : la
	// colonne du titre a la largeur de la langue la plus longue (les deux sont
	// superposées), on mesure donc l'écart entre chaque fin de phrase et le
	// début de la colonne des chemins
	function fialsMesura(ul, francés) {
		let lenga = francés;
		const mesurar = () => {
			const linhas = ul.parentElement.querySelectorAll('.eros-titol .linha');
			const ecart = parseFloat(getComputedStyle(ul.parentElement).columnGap) || 0;
			const debut = ul.getBoundingClientRect().left - ecart;
			[...linhas].forEach((l, i) => {
				const fin = l.querySelector(`.bi > ${lenga ? '.fr' : '.oc'}`).getBoundingClientRect().right;
				ul.children[i]?.style.setProperty('--manca', `${Math.max(0, Math.round(debut - fin))}px`);
			});
		};
		const ro = new ResizeObserver(mesurar);
		ro.observe(ul.parentElement);
		document.fonts?.ready.then(mesurar);
		mesurar();
		return {
			update(f) {
				lenga = f;
				mesurar();
			},
			destroy: () => ro.disconnect()
		};
	}

	// Le flux des liaisons ne tourne que lorsque la carte « Amassa » est à l'écran
	function enVista(el) {
		const io = new IntersectionObserver(([e]) => el.classList.toggle('en-vista', e.isIntersecting));
		io.observe(el);
		return { destroy: () => io.disconnect() };
	}

	// Les chiffres : le compteur du moteur part du nombre lu dans le texte
	// (« ≈ 600 000 » → 600000, préfixe « ≈ »)
	const nombre = (s) => (s ?? '').replace(/[^\d]/g, '');
	const prefix = (s) => {
		const i = (s ?? '').search(/\d/);
		return i > 0 ? s.slice(0, i) : '';
	};
	const im = (clau, defaut) => imatge(clau) ?? defaut;
	const alt = (i) => (fr ? i?.alt_fr : i?.alt_oc) || '';
	let retrat = $derived(im('acuelh.manifest.retrat', { url: '/acuelh/romain.webp', largor: 600, nautor: 620 }));
	let fen = $derived(im('acuelh.trobador.fenestra', { url: '/acuelh/erau.webp', largor: 1500, nautor: 2173 }));

	onMount(() => {
		ambianca.fonsPresent = true;
		let quitada = false;
		import('$lib/acuelh/motor.js').then(({ lancarAcuelh }) => {
			if (quitada) return;
			motor = lancarAcuelh(racina, { clar: ambianca.clar, dalt: ambianca.dalt, fons: ambianca.fons, leugier: ambianca.leugier });
		});
		try {
			const v = localStorage.getItem(CLAU_LENGA_CORS);
			if (v && CONSIGNAS[v]) lengaCors = v;
		} catch {
			// stockage indisponible : on garde le français
		}
		ensagEros = new URLSearchParams(location.search).get('ensag') === 'eros';
		if (ensagEros) {
			try {
				const f = localStorage.getItem(CLAU_ENSAG_EROS);
				if (FORMAS_EROS.some(([v]) => v === f)) formaEros = f;
			} catch {
				// stockage indisponible : la forme actuelle
			}
		}
		ensagSepara = new URLSearchParams(location.search).get('ensag') === 'separa';
		if (ensagSepara) {
			try {
				const f = localStorage.getItem(CLAU_ENSAG_SEPARA);
				if (FORMAS_SEPARA.some(([v]) => v === f)) formaSepara = f;
			} catch {
				// stockage indisponible : la forme actuelle
			}
		}
		ensagBlocs = new URLSearchParams(location.search).get('ensag') === 'blocs';
		if (ensagBlocs) {
			try {
				const f = localStorage.getItem(CLAU_ENSAG_BLOCS);
				if (FORMAS_BLOCS.some(([v]) => v === f)) formaBlocs = f;
			} catch {
				// stockage indisponible : la forme actuelle
			}
		}
		ensagMondes = new URLSearchParams(location.search).get('ensag') === 'mondes';
		if (ensagMondes) {
			// l'adresse ?ensag=mondes montre directement la nouvelle version (le bouton permet de revenir à l'actuelle)
			formaMondes = 'mondes';
			try {
				const f = localStorage.getItem(CLAU_ENSAG_MONDES);
				if (FORMAS_MONDES.some(([v]) => v === f)) formaMondes = f;
			} catch {
				// stockage indisponible : la nouvelle version
			}
		}
		return () => {
			quitada = true;
			clearTimeout(defilada);
			ambianca.fonsPresent = false;
			motor?.destruir();
			motor = null;
			lèvaEdicion?.();
		};
	});

	$effect(() => {
		const clar = ambianca.clar, dalt = ambianca.dalt;
		motor?.tema(clar, dalt);
	});
	$effect(() => {
		const n = ambianca.fons;
		motor?.fons(n);
	});
	$effect(() => {
		const l = ambianca.leugier;
		motor?.leugier(l);
	});

	const CLAU_LENGA_CORS = 'lo-ligam-lenga-cors';
	const LENGAS_CORS = [
		{ v: 'fr', nom: 'Français' },
		{ v: 'en', nom: 'English' },
		{ v: 'es', nom: 'Castellano' },
		{ v: 'ca', nom: 'Català' }
	];
	const darrièr = (v) => DRAPEUS[SEQ[v][SEQ[v].length - 1]];
	let lengaCors = $state('fr');
	const drapèus = $state(Object.fromEntries(LENGAS_CORS.map(({ v }) => [v, darrièr(v)])));
	let consigna = $derived(CONSIGNAS[lengaCors] ?? CONSIGNAS.fr);
	let defilada = 0;

	function causirLengaCors(v) {
		lengaCors = v;
		try {
			localStorage.setItem(CLAU_LENGA_CORS, v);
		} catch {
			// pas grave : le choix vaut pour la visite
		}
		clearTimeout(defilada);
		const seq = SEQ[v];
		if (matchMedia('(prefers-reduced-motion: reduce)').matches || seq.length < 2) {
			drapèus[v] = darrièr(v);
			return;
		}
		let k = 0;
		drapèus[v] = DRAPEUS[seq[0]];
		const seguent = () => {
			k++;
			drapèus[v] = DRAPEUS[seq[k]];
			if (k < seq.length - 1) defilada = setTimeout(seguent, k === seq.length - 2 ? 520 : 170);
		};
		defilada = setTimeout(seguent, seq.length === 2 ? 520 : 170);
	}

	// Ajouts dans les listes (mode édition) : un mot, un lien, une carte
	const apondreMot = () => apondre('acuelh.bandel', 'text', { oc: 'mot', fr: 'mot' });
	const apondreLigam = (l) => apondre(l, 'ligam', { oc: 'Ligam', fr: 'Lien', ligam: '/' });
	const apondreChifra = () =>
		apondre('acuelh.chifras', 'bloc', {}, [
			['num', 'text', { oc: '0', fr: '0' }],
			['nom', 'text', { oc: 'nom', fr: 'nom' }],
			['font', 'text', { oc: 'font', fr: 'source' }]
		]);
	const apondreBiai = () =>
		apondre('acuelh.biais', 'bloc', {}, [
			['titol', 'text', { oc: 'Títol', fr: 'Titre' }],
			['tèxt', 'text', { oc: 'Tèxt', fr: 'Texte' }],
			['ligam', 'ligam', { oc: 'Ligam', fr: 'Lien', ligam: '/' }]
		]);
</script>

<svelte:head>
	<title>Lo Ligam · L’occitan se parla, s’apren, amassa</title>
	<meta
		name="description"
		content="Aprene l’occitan sens vergonha : de corses en visio, un parcors autonòm fins al nivèl B1, e de monde per parlar. Apprendre l’occitan : cours en visio, parcours autonome jusqu’au B1."
	/>
	<!-- Sans JavaScript, tout est visible d'emblée (pas de masques fermés) -->
	<noscript>
		<style>
			.acuelh .masc > .masc-in,
			.acuelh .esvani {
				transform: none;
				opacity: 1;
			}
		</style>
	</noscript>
</svelte:head>

<!-- Un texte dans les deux langues (masques qui basculent), lu par sa clé -->
{#snippet bi(clau)}{@const v = txt(clau)}<span class="bi"
		><span class="oc" aria-hidden={fr}>{v.oc}</span><span class="fr" aria-hidden={!fr}>{v.fr}</span></span
	>{/snippet}

<!-- Le même, avec les marques *or* et _italique_ -->
{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
{#snippet bim(clau)}{@const v = txt(clau)}<span class="bi"
		><span class="oc" aria-hidden={fr}>{@render marcat(v.oc)}</span><span class="fr" aria-hidden={!fr}>{@render marcat(v.fr)}</span></span
	>{/snippet}

<!-- Le titre lettre par lettre, pour les lettres en braise au survol (acuelh.css ;
     Romain, 2026-10-15, à la place de la traduction). Les lecteurs d'écran
     lisent le mot entier (copie masquée), pas les lettres. -->
{#snippet letras(clau)}{@const v = txt(clau)}<span class="bi"
		><span class="oc" aria-hidden={fr}
			><span class="visually-hidden">{v.oc}</span><span aria-hidden="true"
				>{#each [...v.oc] as l, i (i)}<span class="letra" class:espaci={l === ' '}>{l}</span>{/each}</span
			></span
		><span class="fr" aria-hidden={!fr}
			><span class="visually-hidden">{v.fr}</span><span aria-hidden="true"
				>{#each [...v.fr] as l, i (i)}<span class="letra" class:espaci={l === ' '}>{l}</span>{/each}</span
			></span
		></span
	>{/snippet}

{#snippet sageta()}<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"
		><path d="M2 8h12M9 3l5 5-5 5" /></svg
	>{/snippet}

<!-- Un lien lu par sa clé : page du site, ancre, ou adresse https (nouvel onglet) -->
{#snippet lg(clau, classe, extra = {})}{@const l = ligam(clau)}<a
		class={classe}
		href={l.href}
		target={l.defòra ? '_blank' : undefined}
		rel={l.defòra ? 'noopener' : undefined}
		aria-describedby={l.defòra ? 'onglet-nou' : undefined}
		hidden={amagat(clau)}
		use:editar={clau}
		{...extra}>{@render bi(clau)}{#if extra['data-sageta']} {@render sageta()}{/if}</a
	>{/snippet}

<!-- Sommaire d'une rubrique sous son titre (essai de séparation, « Chapitres ») -->
{#snippet somari(sec)}<p class="jalon-somari">
		{#each sec.grops.flatMap((g) => g.items) as it, k (it.href)}{#if k}<span aria-hidden="true">·</span>{/if}<a
				href={it.href}
				target={it.defòra ? '_blank' : undefined}
				rel={it.defòra ? 'noopener' : undefined}>{fr ? it.fr : it.oc}</a
			>{/each}
	</p>{/snippet}

<!-- Essai « Chapitres » (direction B) : les portes d'une rubrique en blocs de couleur sourde -->
{#snippet teulasChap(sec)}{@const items = sec.grops.flatMap((g) => g.items)}<ul
		class="teulas-ac"
		aria-label={fr ? `Les portes de ${sec.fr}` : `Las portas de ${sec.oc}`}
	>
		{#each items as it, i (it.href)}
			{@const col = terraColor((CHAPS[sec.id]?.ini ?? 0) + i)}
			<li class="teula-ac" style="--fons: {col[0]}; --tinta: {col[1]}; --i: {i};">
				<span class="teula-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
				<a
					class="teula-ligam"
					href={it.href}
					target={it.defòra ? '_blank' : undefined}
					rel={it.defòra ? 'noopener' : undefined}
					aria-describedby={it.defòra ? 'onglet-nou' : undefined}
				>
					<span class="teula-nom">{fr ? it.fr : it.oc}</span>
				</a>
				<span class="teula-picto"><Pictograma nom={pictoPer(it.href)} size="2.8rem" /></span>
			</li>
		{/each}
	</ul>{/snippet}

{#snippet apondreBoton(f, txtOc, txtFr)}{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={f}>+ {fr ? txtFr : txtOc}</button>{/if}{/snippet}

<div class="acuelh" class:fr class:ed-actiu={edicion.actiu} bind:this={racina} data-separa={formaSepara} data-blocs={formaBlocs} data-mondes={formaMondes}>
	<canvas id="fons" aria-hidden="true"></canvas>
	<div class="brasa" aria-hidden="true"><i></i><i></i><b></b><b></b><b></b><b></b></div>
	<canvas id="estelas" aria-hidden="true"></canvas>
	<div class="cur-anel" aria-hidden="true"></div>
	<div class="cur-ponch" aria-hidden="true"></div>

	<div class="capçal">
		<AppHeader />
	</div>

	<main>
		<span id="onglet-nou" class="visually-hidden"
			>{fr ? 'S’ouvre dans un nouvel onglet' : 'Se dobrís dins un onglet novèl'}</span
		>

		<!-- I. Le héros : le titre annonce le plan de la page, un seul bouton principal -->
		<section class="eros" class:amb-carta={formaEros !== 'fials'} data-revela data-forma={formaEros}>
			<p class="eros-kicker" hidden={amagat('acuelh.eros.kicker')}>
				<span class="masc"><span class="masc-in" use:editar={'acuelh.eros.kicker'}>{@render bi('acuelh.eros.kicker')}</span></span>
			</p>
			<div class="eros-entitol">
				<h1 class="eros-titol">
					<span class="linha masc" hidden={amagat('acuelh.eros.titol.1')}><span class="masc-in" style="--i: 1" use:editar={'acuelh.eros.titol.1'}>{@render letras('acuelh.eros.titol.1')}</span></span>
					<span class="linha masc" hidden={amagat('acuelh.eros.titol.2')}><span class="masc-in" style="--i: 2" use:editar={'acuelh.eros.titol.2'}>{@render letras('acuelh.eros.titol.2')}</span></span>
					<span class="linha masc" hidden={amagat('acuelh.eros.titol.3')}><span class="masc-in" style="--i: 3" use:editar={'acuelh.eros.titol.3'}>{@render letras('acuelh.eros.titol.3')}</span></span>
				</h1>
				{#if formaEros === 'fials'}
					<ul class="eros-fials" use:fialsMesura={fr}>
						{#each FIALS as c, i (c.n)}
							<li class="esvani" style="--i: {4 + i}">
								<span class="fial" aria-hidden="true"></span>
								<div class="fial-camin">
									<span class="fial-n">{c.n}<span class="fial-verb"> · <span class="bi"><span class="oc" aria-hidden={fr}>{c.oc}</span><span class="fr" aria-hidden={!fr}>{c.fr}</span></span></span></span>
									<a class="fial-cap" href={c.cap.href}><span class="bi"><span class="oc" aria-hidden={fr}>{c.cap.oc}</span><span class="fr" aria-hidden={!fr}>{c.cap.fr}</span></span>{@render sageta()}</a>
									<span class="fial-autres">
										{#each c.autres as a, j (a.href)}
											{#if j}<span class="fial-sep" aria-hidden="true">·</span>{/if}
											<a
												href={a.href}
												target={a.defòra ? '_blank' : undefined}
												rel={a.defòra ? 'noopener' : undefined}
												aria-describedby={a.defòra ? 'onglet-nou' : undefined}>{fr ? a.fr : a.oc}</a
											>
										{/each}
									</span>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
			{#if formaEros === 'fials'}
				<div class="davalar esvani" style="--i: 7" aria-hidden="true"><span></span></div>
			{:else}
				<div class="eros-pe">
					<div class="esvani" style="--i: 5">
						<p class="eros-sub" hidden={amagat('acuelh.eros.frasa')} use:editar={'acuelh.eros.frasa'}>{@render bi('acuelh.eros.frasa')}</p>
						<p class="indici" aria-hidden="true" hidden={amagat('acuelh.eros.indici')} use:editar={'acuelh.eros.indici'}>
							{@render bi('acuelh.eros.indici')}
						</p>
					</div>
					<div class="eros-accions esvani" style="--i: 6">
						{#if !amagat('acuelh.eros.carta')}
							{@const l = ligam('acuelh.eros.carta')}
							<a class="boton" href={l.href} target={l.defòra ? '_blank' : undefined} rel={l.defòra ? 'noopener' : undefined} data-magnet use:editar={'acuelh.eros.carta'}>
								<span class="boton-emplenat"></span>
								<span class="boton-tèxt">{@render bi('acuelh.eros.carta')}{@render sageta()}</span>
							</a>
						{/if}
						{@render lg('acuelh.eros.aprene', 'ligam-tèxt')}
					</div>
					<div class="davalar esvani" style="--i: 7" aria-hidden="true"><span></span></div>
				</div>
			{/if}
			<!-- La carte en étoiles ouvre la page (Romain, 2026-10-22) : le moteur la
			     dessine ici, dans le temps, à l'arrivée ; elle était en 01 -->
			<div
				class="carta-estelas"
				role="img"
				aria-label={fr
					? 'Carte de l’Occitanie en étoiles : 304 villes et villages, avec leur nom occitan'
					: 'Carta de l’Occitània en estelas : 304 vilas e vilatges, amb lor nom occitan'}
			></div>
		</section>

		{#if formaMondes === 'mondes'}
			<!-- Direction « los tres mondes » (essai) : les trois fenêtres remplacent le milieu -->
			<TresMondes />
		{/if}

		<!-- II. Le bandeau de mots (Lexique de Max Rouquette) -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div class="bandel" role="group" tabindex="0" aria-label={fr ? 'Quelques mots' : 'Qualques mots'}>
			<div class="bandel-pista">
				{#each [false, true] as copia (copia)}
					{#each lista('acuelh.bandel') as m (m.clau)}
						{#if copia}
							<span class="bandel-mot" lang="oc" aria-hidden="true">{m.oc}<small lang="fr">{m.fr}</small></span>
						{:else}
							<span class="bandel-mot" lang="oc" use:editar={m.clau}>{m.oc}<small lang="fr">{m.fr}</small></span>
						{/if}
					{/each}
				{/each}
			</div>
		</div>
		<p class="bandel-font" hidden={amagat('acuelh.bandel.font')}>
			<span use:editar={'acuelh.bandel.font'}>{@render bim('acuelh.bandel.font')}</span>
			{@render apondreBoton(apondreMot, 'Apondre un mot', 'Ajouter un mot')}
		</p>

		<!-- III. Qui : le manifeste (sans numéro, comme la phrase d'identité de l'Alliance), avec la photo de Romain -->
		<section class="manifest">
			<h2 class="jalon" data-revela hidden={amagat('acuelh.manifest.titol')}>
				<span class="masc"><span class="masc-in" use:editar={'acuelh.manifest.titol'}>{@render bi('acuelh.manifest.titol')}</span></span>
			</h2>
			<div class="manifest-cors">
				<!-- chaque mot s'allume au défilement (motor : data-emplenar) ; *…* = en or -->
				<p class="manifest-tèxt" data-emplenar hidden={amagat('acuelh.manifest.tèxt')} use:editar={'acuelh.manifest.tèxt'}>
					{#each ['oc', 'fr'] as l (l)}
						<span data-lenga={l} lang={l}
							>{#each segments(txt('acuelh.manifest.tèxt')[l]) as seg, n (n)}{#each seg.t.trim().split(/\s+/).filter(Boolean) as m, k (k)}<span
										class={seg.aur ? 'm aur' : 'm'}>{m}</span
									>{' '}{/each}{/each}</span
						>
					{/each}
				</p>
				<figure class="manifest-retrat esvani" data-revela hidden={amagat('acuelh.manifest.retrat')}>
					<div class="panel-media retrat" use:editar={'acuelh.manifest.retrat'}>
						<img src={retrat.url} alt={alt(retrat)} loading="lazy" width={retrat.largor} height={retrat.nautor} />
					</div>
					<figcaption use:editar={'acuelh.manifest.legenda'} hidden={amagat('acuelh.manifest.legenda')}>{@render bi('acuelh.manifest.legenda')}</figcaption>
				</figure>
			</div>
		</section>

		<!-- IV. 01 Se parla : la carte en étoiles et les chiffres, remontés -->
		<!-- 01 compacte depuis le 2026-10-22 : la carte en étoiles est montée dans l'ouverture -->
		<section class="chifras compacta" data-revela>
			<h2 class="jalon">
				<b>01</b><span class="masc" hidden={amagat('acuelh.sec.parla.titol')}><span class="masc-in" use:editar={'acuelh.sec.parla.titol'}>{@render bi('acuelh.sec.parla.titol')}</span></span>
			</h2>
			{@render somari(PARLA)}
			{#if formaBlocs === 'B'}{@render teulasChap(PARLA)}{/if}
			<!-- La carte montre, le wiki explique : chaque fiche y est reliée
			     (revisions/2026-10-10-concept-wiki.md) -->
			<div class="carta-dobrir esvani">
				{#if !amagat('acuelh.parla.carta')}
					{@const l = ligam('acuelh.parla.carta')}
					<a class="boton boton-traç" href={l.href} data-magnet use:editar={'acuelh.parla.carta'}
						><span class="boton-emplenat"></span><span class="boton-tèxt">{@render bi('acuelh.parla.carta')} {@render sageta()}</span></a
					>
				{/if}
				<!-- Òbras et Articles : le pays, ce qui s'y dit et s'y fait (Romain, 2026-10-22) -->
				{#each lista('acuelh.parla.ligams') as l (l.clau)}
					{@render lg(l.clau, 'ligam-tèxt')}
				{/each}
				{@render apondreBoton(() => apondreLigam('acuelh.parla.ligams'), 'Apondre un ligam', 'Ajouter un lien')}
			</div>
			<div class="chifras-grasilha">
				{#each lista('acuelh.chifras') as c, i (c.clau)}
					{@const num = txt(c.clau + '.num')}
					<div class="chifra esvani" style="--i: {i + 1}" use:editar={c.clau}>
						<p class="chifra-num" data-comptar={nombre(num.oc)} data-prefix={prefix(num.oc)} hidden={amagat(c.clau + '.num')} use:editar={c.clau + '.num'}>{num.oc}</p>
						<p class="chifra-nom" hidden={amagat(c.clau + '.nom')} use:editar={c.clau + '.nom'}>{@render bi(c.clau + '.nom')}</p>
						<p class="chifra-font" hidden={amagat(c.clau + '.font')} use:editar={c.clau + '.font'}>{@render bi(c.clau + '.font')}</p>
					</div>
				{/each}
			</div>
			{@render apondreBoton(apondreChifra, 'Apondre una chifra', 'Ajouter un chiffre')}
			<!-- (les liens « Puèi · 02 S’apren → » et « Puèi · 03 Amassa → » ont été retirés : « ils ne servent à rien », Romain, 2026-10-24) -->
		</section>

		<!-- V. 02 S'apren : les trois façons d'apprendre, telles quelles -->
		<section class="biais" id="biais" data-revela>
			<h2 class="jalon">
				<b>02</b><span class="masc" hidden={amagat('acuelh.sec.apren.titol')}><span class="masc-in" use:editar={'acuelh.sec.apren.titol'}>{@render bi('acuelh.sec.apren.titol')}</span></span>
			</h2>
			{@render somari(APREN)}
			{#if formaBlocs === 'B'}{@render teulasChap(APREN)}{/if}
			<div class="biais-grasilha">
				{#each lista('acuelh.biais') as b, i (b.clau)}
					<article class="biai esvani" style="--i: {i + 1}" use:editar={b.clau}>
						<p class="biai-num" aria-hidden="true">{['I', 'II', 'III', 'IV', 'V', 'VI'][i] ?? i + 1}</p>
						<h3 class="biai-titol" hidden={amagat(b.clau + '.titol')} use:editar={b.clau + '.titol'}>{@render bi(b.clau + '.titol')}</h3>
						<p class="biai-tèxt" hidden={amagat(b.clau + '.tèxt')} use:editar={b.clau + '.tèxt'}>{@render bi(b.clau + '.tèxt')}</p>
						{@render lg(b.clau + '.ligam', 'biai-ligam', { 'data-sageta': true })}
					</article>
				{/each}
			</div>
			{@render apondreBoton(apondreBiai, 'Apondre un biais', 'Ajouter une carte')}
			<fieldset class="lengas esvani" style="--i: 4">
				<legend hidden={amagat('acuelh.lengas.legenda')} use:editar={'acuelh.lengas.legenda'}>{@render bi('acuelh.lengas.legenda')}</legend>
				<div class="lengas-chips">
					{#each LENGAS_CORS as l (l.v)}
						<label
							><input
								type="radio"
								name="lenga-cors"
								value={l.v}
								checked={lengaCors === l.v}
								onchange={() => causirLengaCors(l.v)}
							/><span lang={l.v} style:--drap={drapèus[l.v]}>{l.nom}</span></label
						>
					{/each}
				</div>
				<p class="lengas-consigna" aria-live="polite" lang={consigna[0]}>{consigna[1]}</p>
			</fieldset>
		</section>

		<!-- VI. 03 Amassa (« Se viu » jusqu’au 2026-10-21) : la communauté, une seule carte -->
		<section class="camins" id="viure" aria-labelledby="viure-titol">
			<h2 class="camins-cap jalon" data-revela>
				<b>03</b><span class="masc" hidden={amagat('acuelh.sec.viu.titol')}><span class="masc-in" id="viure-titol" use:editar={'acuelh.sec.viu.titol'}>{@render bi('acuelh.sec.viu.titol')}</span></span>
			</h2>
			{@render somari(VIU)}
			{#if formaBlocs === 'B'}{@render teulasChap(VIU)}{/if}
			<div class="camins-pista">
				<article class="panel esvani" data-revela style:--i={0}>
					<div class="panel-tèxt">
						<div>
							<h3 class="panel-nom" hidden={amagat('acuelh.viure.comunautat.nom')} use:editar={'acuelh.viure.comunautat.nom'}>{@render bi('acuelh.viure.comunautat.nom')}</h3>
							<p class="panel-tagline" hidden={amagat('acuelh.viure.comunautat.sota')} use:editar={'acuelh.viure.comunautat.sota'}>{@render bi('acuelh.viure.comunautat.sota')}</p>
						</div>
						<ul class="panel-items">
							{#each lista('acuelh.viure.comunautat.items') as it (it.clau)}
								{@const l = ligam(it.clau)}
								<li>
									<a href={l.href} target={l.defòra ? '_blank' : undefined} rel={l.defòra ? 'noopener noreferrer' : undefined} use:editar={it.clau}
										>{@render bi(it.clau)}<Icona nom={l.defòra ? 'extern' : 'suivant'} /></a
									>
								</li>
							{/each}
							{#if edicion.actiu}<li>{@render apondreBoton(() => apondreLigam('acuelh.viure.comunautat.items'), 'Apondre un ligam', 'Ajouter un lien')}</li>{/if}
						</ul>
					</div>
					<!-- Idée de Romain : le domaine occitan et des liaisons comme des lignes
					     aériennes entre les villes (dessin : scripts/amassa-liaisons.mjs) -->
					<div class="panel-media liams" use:enVista>
						<svg viewBox="0 0 400 300" aria-hidden="true">
							<path class="domeni" d={AMASSA.contorn} />
							{#each AMASSA.arcs as d, i (d)}
								<path class="liam" {d} pathLength="1" style:--i={i} />
								<path class="flux" {d} style:--i={i} />
							{/each}
							{#each AMASSA.vilas as [x, y], i (i)}
								<circle class="vila" cx={x} cy={y} r="3.2" style:--i={i} />
							{/each}
						</svg>
					</div>
				</article>
			</div>
		</section>

		<!-- VII. Le troubadour (Max Rouquette), qui clôt « Amassa » -->
		<section class="trobador">
			<div class="trobador-pin">
				<div class="trobador-fenestra" hidden={amagat('acuelh.trobador.fenestra')} use:editar={'acuelh.trobador.fenestra'}>
					<img src={fen.url} alt={alt(fen)} loading="lazy" decoding="async" width={fen.largor} height={fen.nautor} />
				</div>
				<blockquote class="trobador-vers">
					<p lang="oc">
						<span class="masc" hidden={amagat('acuelh.trobador.vers.1')}><span class="masc-in" use:editar={'acuelh.trobador.vers.1'}>{txt('acuelh.trobador.vers.1').oc}</span></span><span class="masc" hidden={amagat('acuelh.trobador.vers.2')}
							><span class="masc-in" style="--i: 1" use:editar={'acuelh.trobador.vers.2'}>{txt('acuelh.trobador.vers.2').oc}</span></span
						>
					</p>
					<cite class="esvani" style="--i: 4" hidden={amagat('acuelh.trobador.cita')} use:editar={'acuelh.trobador.cita'}>{@render bim('acuelh.trobador.cita')}</cite>
				</blockquote>
				<!-- Repère : continuer à descendre ouvre la fenêtre (s'efface dès qu'elle s'ouvre) -->
				<div class="trobador-indici" aria-hidden="true"><span></span></div>
			</div>
		</section>

		<!-- VIII. L'appel : les cours, en fin de parcours -->
		<section class="crida centrat" id="crida" data-revela>
			<div>
				<h2 class="crida-titol">
					<span class="masc" hidden={amagat('acuelh.crida.titol.1')}><span class="masc-in" use:editar={'acuelh.crida.titol.1'}>{@render bi('acuelh.crida.titol.1')}</span></span>
					<span class="masc" hidden={amagat('acuelh.crida.titol.2')}><span class="masc-in aur" style="--i: 1" use:editar={'acuelh.crida.titol.2'}>{@render bi('acuelh.crida.titol.2')}</span></span>
				</h2>
				<p class="crida-sub esvani" style="--i: 3" hidden={amagat('acuelh.crida.sota')} use:editar={'acuelh.crida.sota'}>
					{@render bi('acuelh.crida.sota')}
				</p>
				<div class="esvani" style="--i: 4">
					<div class="crida-accions">
						{#if !amagat('acuelh.crida.reservar')}
							{@const l = ligam('acuelh.crida.reservar')}
							<a class="boton" href={l.href} target={l.defòra ? '_blank' : undefined} rel={l.defòra ? 'noopener' : undefined} data-magnet aria-describedby={l.defòra ? 'onglet-nou' : undefined} use:editar={'acuelh.crida.reservar'}>
								<span class="boton-emplenat"></span>
								<span class="boton-tèxt">{@render bi('acuelh.crida.reservar')}{@render sageta()}</span>
							</a>
						{/if}
						{@render lg('acuelh.crida.sol', 'ligam-tèxt')}
					</div>
				</div>
			</div>
		</section>
	</main>
</div>

{#if ensagEros}
	<!-- Outil d'essai, volontairement neutre (hors charte) pour ne pas se confondre avec la page -->
	<div class="ensag-eros" role="group" aria-label="Essai : mise en ordre de l'ouverture">
		{#each FORMAS_EROS as [v, nom] (v)}
			<button type="button" aria-pressed={formaEros === v} onclick={() => causirFormaEros(v)}>{nom}</button>
		{/each}
	</div>
{/if}
{#if ensagSepara}
	<div class="ensag-eros" role="group" aria-label="Essai : séparation des sections">
		{#each FORMAS_SEPARA as [v, nom] (v)}
			<button type="button" aria-pressed={formaSepara === v} onclick={() => causirFormaSepara(v)}>{nom}</button>
		{/each}
	</div>
{/if}
{#if ensagBlocs}
	<div class="ensag-eros" role="group" aria-label="Essai : chapitres de couleur">
		{#each FORMAS_BLOCS as [v, nom] (v)}
			<button type="button" aria-pressed={formaBlocs === v} onclick={() => causirFormaBlocs(v)}>{nom}</button>
		{/each}
	</div>
{/if}
{#if ensagMondes}
	<div class="ensag-eros" role="group" aria-label="Essai : los tres mondes">
		{#each FORMAS_MONDES as [v, nom] (v)}
			<button type="button" aria-pressed={formaMondes === v} onclick={() => causirFormaMondes(v)}>{nom}</button>
		{/each}
	</div>
{/if}

<style>
	.ensag-eros {
		position: fixed;
		left: 50%;
		bottom: 1rem;
		z-index: 2000;
		transform: translateX(-50%);
		display: flex;
		gap: 3px;
		padding: 4px;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
		font: 700 0.8rem/1 system-ui, sans-serif;
	}
	.ensag-eros button {
		border: 0;
		border-radius: 999px;
		padding: 0.55rem 0.9rem;
		background: transparent;
		color: #222222;
		font: inherit;
		white-space: nowrap;
		cursor: pointer;
	}
	.ensag-eros button[aria-pressed='true'] {
		background: #222222;
		color: #ffffff;
	}

	/* Qui : le manifeste et la photo côte à côte, l'un sous l'autre quand la place manque */
	.manifest {
		container: manifest / inline-size;
	}
	.manifest-cors {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: clamp(2rem, 5vw, 6rem);
	}
	.manifest-retrat {
		width: clamp(220px, 22vw, 360px);
		margin: 0;
	}
	.manifest-retrat .panel-media {
		aspect-ratio: 4 / 5;
	}
	.manifest-retrat figcaption {
		margin-top: 0.9rem;
		font-family: var(--votz);
		font-style: italic;
		font-size: 1.15rem;
		color: var(--aur-clar);
	}
	@container manifest (max-width: 820px) {
		.manifest-cors {
			grid-template-columns: 1fr;
		}
		.manifest-retrat {
			width: min(72%, 300px);
		}
	}

	/* La carte et le wiki côte à côte */
	.carta-dobrir {
		flex-wrap: wrap;
		align-items: center;
		gap: 1.2rem 2.4rem;
	}

	/* Amassa : les villes éclosent, un trait fin se tire de A vers B, liaison
	   après liaison, puis des pointillés y coulent en continu, comme un flux
	   de données (retour de Romain : pas de lueurs « trains »). Le flux
	   s'arrête hors de l'écran, en version légère et si le visiteur réduit
	   les animations : les pointillés restent, immobiles. */
	.liams svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.domeni {
		fill: color-mix(in srgb, var(--terra) 24%, transparent);
		stroke: color-mix(in srgb, var(--aur) 50%, transparent);
		stroke-width: 0.8;
		stroke-linejoin: round;
	}
	.liam,
	.flux {
		fill: none;
		stroke-linecap: round;
	}
	.liam {
		stroke: var(--aur);
		stroke-width: 0.7;
		opacity: 0.35;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition: stroke-dashoffset 1.1s var(--ease-io) calc(700ms + var(--i) * 450ms);
	}
	.vila {
		fill: var(--aur-clar);
		transform-box: fill-box;
		transform-origin: center;
		transform: scale(0);
		transition: transform 0.8s var(--ease) calc(var(--i) * 60ms);
	}
	.panel:global(.vist) .liam {
		stroke-dashoffset: 0;
	}
	.panel:global(.vist) .vila {
		transform: scale(1);
	}
	/* Pointillés ronds tous les 7 px ; ils apparaissent une fois leur trait tiré */
	.flux {
		stroke: var(--aur-clar);
		stroke-width: 2;
		stroke-dasharray: 0 7;
		opacity: 0;
		transition: opacity 0.6s var(--ease) calc(1500ms + var(--i) * 450ms);
	}
	.panel:global(.vist) .flux {
		opacity: 0.9;
	}
	@media (prefers-reduced-motion: no-preference) {
		.liams:global(.en-vista) .flux {
			animation: flux 1.1s linear infinite;
		}
	}
	:global(:root[data-leugier='on']) .flux {
		animation: none !important;
	}
	@keyframes flux {
		to {
			stroke-dashoffset: -7;
		}
	}
	/* en mode édition, les éléments cachés restent là, les boutons d'ajout se placent */
	.acuelh :global(.ed-apondre) {
		margin: 0.6rem 0 0 0.6rem;
	}
	.bandel-font :global(.ed-apondre) {
		margin-left: 1rem;
	}
</style>
