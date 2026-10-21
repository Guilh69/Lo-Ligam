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
	// Le contenu est rendu ici (deux langues dans des masques qui basculent) ;
	// le mouvement (fond vivant, constellation, carte en étoiles, défilement)
	// vit dans $lib/acuelh/motor.js, chargé après coup pour que la page
	// s'affiche vite. Textes en dur (plus de /admin/textes, à rebrancher).
	// Occitan nouveau : À VALIDER par Romain avant publication.
	import { onMount } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import { RESERVAR, MOTS, MANIFEST, CONSIGNAS, DRAPEUS, SEQ } from '$lib/acuelh/donadas.js';
	import { AMASSA } from '$lib/acuelh/amassa.js';
	import { PLAN } from '$lib/data/planSite.js';
	import '$lib/acuelh/acuelh.css';

	let fr = $derived(langStore.current === 'fr');

	let racina;
	let motor = $state.raw(null);

	// « Se viu » : découvrir, et faire ensemble (option 1 de Romain, 2026-10-15).
	// Articles, forum, groupes et boîte à idées seront développés avant la
	// diffusion du site : leurs liens figurent dès maintenant, comme les autres.
	const VIURE = [
		{ oc: 'Descobrir', fr: 'Découvrir', toc: 'Lo país e sa cultura', tfr: 'Le pays et sa culture', media: 'paisatge',
			items: [['Mots en imatges', 'Mots en images', '/mots'], ['Òbras', 'Œuvres', '/obras'], ['Articles', 'Articles', '/articles']] },
		{ oc: 'Amassa', fr: 'Ensemble', toc: 'La comunautat', tfr: 'La communauté', media: 'liams',
			items: [['Fòrum', 'Forum', '/forum'], ['Grops', 'Groupes', '/grops'], ['Boita d’idèas', 'Boîte à idées', '/ideas'],
				['Instagram', 'Instagram', 'https://www.instagram.com/lo_ligam/']] }
	];

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
	// Les trois chemins, pris dans le plan du site (le même que le menu et le
	// pied de page) : un chemin principal et quelques autres. « Amassa » mène à
	// sa section plus bas tant que le fòrum et les grops ne sont pas faits.
	const rubrica = (href) => PLAN.flatMap((s) => s.grops.flatMap((g) => g.items)).find((i) => i.href === href);
	const [PARLA, APREN, VIU] = PLAN;
	const FIALS = [
		{ ...PARLA, cap: rubrica('/carta'), autres: [rubrica('/wiki')] },
		{ ...APREN, cap: rubrica('/aprene'), autres: [rubrica('/aprene/essai'), rubrica(RESERVAR)] },
		{ ...VIU, cap: { ...VIU.grops[1], href: '#viure' }, autres: [rubrica('/forum'), rubrica('/grops'), rubrica('/obras')] }
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
		return () => {
			quitada = true;
			clearTimeout(defilada);
			ambianca.fonsPresent = false;
			motor?.destruir();
			motor = null;
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
</script>

<svelte:head>
	<title>Lo Ligam · L’occitan se parla, s’apren, se viu</title>
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

{#snippet bi(oc, frTxt)}<span class="bi"
		><span class="oc" aria-hidden={fr}>{oc}</span><span class="fr" aria-hidden={!fr}>{frTxt}</span></span
	>{/snippet}

<!-- Le titre lettre par lettre, pour les lettres en braise au survol (acuelh.css ;
     Romain, 2026-10-15, à la place de la traduction). Les lecteurs d'écran
     lisent le mot entier (copie masquée), pas les lettres. -->
{#snippet letras(oc, frTxt)}<span class="bi"
		><span class="oc" aria-hidden={fr}
			><span class="visually-hidden">{oc}</span><span aria-hidden="true"
				>{#each [...oc] as l, i (i)}<span class="letra" class:espaci={l === ' '}>{l}</span>{/each}</span
			></span
		><span class="fr" aria-hidden={!fr}
			><span class="visually-hidden">{frTxt}</span><span aria-hidden="true"
				>{#each [...frTxt] as l, i (i)}<span class="letra" class:espaci={l === ' '}>{l}</span>{/each}</span
			></span
		></span
	>{/snippet}

{#snippet sageta()}<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"
		><path d="M2 8h12M9 3l5 5-5 5" /></svg
	>{/snippet}

<!-- Sommaire d'une rubrique sous son titre (essai de séparation, « Chapitres ») -->
{#snippet somari(sec)}<p class="jalon-somari">
		{#each sec.grops.flatMap((g) => g.items) as it, k (it.href)}{#if k}<span aria-hidden="true">·</span>{/if}<a
				href={it.href}
				target={it.defòra ? '_blank' : undefined}
				rel={it.defòra ? 'noopener' : undefined}>{fr ? it.fr : it.oc}</a
			>{/each}
	</p>{/snippet}

<div class="acuelh" class:fr bind:this={racina} data-separa={formaSepara}>
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
			>{fr
				? 'Ouvre la page de réservation de Proton dans un nouvel onglet'
				: 'Dobrís la pagina de reservacion de Proton dins un onglet novèl'}</span
		>

		<!-- I. Le héros : le titre annonce le plan de la page, un seul bouton principal -->
		<section class="eros" data-revela data-forma={formaEros}>
			<p class="eros-kicker">
				<span class="masc"><span class="masc-in">{@render bi('L’occitan', 'L’occitan')}</span></span>
			</p>
			<div class="eros-entitol">
				<h1 class="eros-titol">
					<span class="linha masc"><span class="masc-in" style="--i: 1">{@render letras('Se parla.', 'Se parle.')}</span></span>
					<span class="linha masc"><span class="masc-in" style="--i: 2">{@render letras('S’apren.', 'S’apprend.')}</span></span>
					<span class="linha masc"><span class="masc-in" style="--i: 3">{@render letras('Se viu.', 'Se vit.')}</span></span>
				</h1>
				{#if formaEros === 'fials'}
					<ul class="eros-fials" use:fialsMesura={fr}>
						{#each FIALS as c, i (c.n)}
							<li class="esvani" style="--i: {4 + i}">
								<span class="fial" aria-hidden="true"></span>
								<div class="fial-camin">
									<span class="fial-n">{c.n}<span class="fial-verb"> · {@render bi(c.oc, c.fr)}</span></span>
									<a class="fial-cap" href={c.cap.href}>{@render bi(c.cap.oc, c.cap.fr)}{@render sageta()}</a>
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
						<p class="eros-sub">
							{@render bi(
								'Una carta per lo veire, de corses per l’aprene, de mots e d’òbras per lo viure.',
								'Une carte pour le voir, des cours pour l’apprendre, des mots et des œuvres pour le vivre.'
							)}
						</p>
						<p class="indici" aria-hidden="true">
							{@render bi('Passatz la mirga suls tres mots.', 'Survolez les trois mots.')}
						</p>
					</div>
					<div class="eros-accions esvani" style="--i: 6">
						<a class="boton" href="/carta" data-magnet>
							<span class="boton-emplenat"></span>
							<span class="boton-tèxt">{@render bi('Dobrir la carta', 'Ouvrir la carte')}{@render sageta()}</span>
						</a>
						<a class="ligam-tèxt" href="#biais">{@render bi('Aprene l’occitan', 'Apprendre l’occitan')}</a>
					</div>
					<div class="davalar esvani" style="--i: 7" aria-hidden="true"><span></span></div>
				</div>
			{/if}
		</section>

		<!-- II. Le bandeau de mots (Lexique de Max Rouquette) -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div class="bandel" role="group" tabindex="0" aria-label={fr ? 'Quelques mots' : 'Qualques mots'}>
			<div class="bandel-pista">
				{#each [false, true] as copia (copia)}
					{#each MOTS as [oc, frTxt] (oc)}
						<span class="bandel-mot" lang="oc" aria-hidden={copia ? 'true' : undefined}>{oc}<small lang="fr">{frTxt}</small></span>
					{/each}
				{/each}
			</div>
		</div>
		<p class="bandel-font">
			<span class="bi"
				><span class="oc" aria-hidden={fr}>Mots del <i>Lexic de Max Roqueta</i>, establit per Joan-Guilhèm Roqueta</span
				><span class="fr" aria-hidden={!fr}>Mots du <i>Lexique de Max Rouquette</i>, établi par Jean-Guilhem Rouquette</span></span
			>
		</p>

		<!-- III. Qui : le manifeste (sans numéro, comme la phrase d'identité de l'Alliance), avec la photo de Romain -->
		<section class="manifest">
			<h2 class="jalon" data-revela>
				<span class="masc"><span class="masc-in">{@render bi('Qu’es aquò, Lo Ligam ?', 'Qu’est-ce que Lo Ligam ?')}</span></span>
			</h2>
			<div class="manifest-cors">
				<p class="manifest-tèxt" data-emplenar>
					{#each ['oc', 'fr'] as l (l)}
						<span data-lenga={l} lang={l}
							>{#each MANIFEST[l] as [frasa, aur], n (n)}{#each frasa.split(' ') as m, k (k)}<span
										class={aur ? 'm aur' : 'm'}>{m}</span
									>{' '}{/each}{/each}</span
						>
					{/each}
				</p>
				<figure class="manifest-retrat esvani" data-revela>
					<div class="panel-media retrat">
						<img src="/acuelh/romain.webp" alt="" loading="lazy" width="600" height="620" />
					</div>
					<figcaption>Romain Périer</figcaption>
				</figure>
			</div>
		</section>

		<!-- IV. 01 Se parla : la carte en étoiles et les chiffres, remontés -->
		<section class="chifras" data-revela>
			<h2 class="jalon">
				<b>01</b><span class="masc"><span class="masc-in">{@render bi('Se parla', 'Se parle')}</span></span>
			</h2>
			{@render somari(PARLA)}
			<div
				class="carta-estelas"
				role="img"
				aria-label={fr
					? 'Carte de l’Occitanie en étoiles : 304 villes et villages, avec leur nom occitan'
					: 'Carta de l’Occitània en estelas : 304 vilas e vilatges, amb lor nom occitan'}
			></div>
			<!-- La carte montre, le wiki explique : chaque fiche y est reliée
			     (revisions/2026-10-10-concept-wiki.md) -->
			<div class="carta-dobrir esvani">
				<a class="boton boton-traç" href="/carta" data-magnet
					><span class="boton-emplenat"></span><span class="boton-tèxt"
						>{@render bi('Dobrir la carta entièra', 'Ouvrir la carte entière')} {@render sageta()}</span
					></a
				>
				<a class="ligam-tèxt" href="/wiki"
					>{@render bi('Lo wiki de las lengas e dels luòcs', 'Le wiki des langues et des lieux')}</a
				>
			</div>
			<div class="chifras-grasilha">
				<div class="chifra esvani" style="--i: 1">
					<p class="chifra-num" data-comptar="600000" data-prefix="≈ ">≈ 600 000</p>
					<p class="chifra-nom">{@render bi('locutors', 'locuteurs')}</p>
					<p class="chifra-font">
						{@render bi('Estimacion, enquèsta sociolingüistica OPLO, 2020', 'Estimation, enquête sociolinguistique OPLO, 2020')}
					</p>
				</div>
				<div class="chifra esvani" style="--i: 2">
					<p class="chifra-num" data-comptar="32">32</p>
					<p class="chifra-nom">{@render bi('despartaments', 'départements')}</p>
					<p class="chifra-font">
						{@render bi('e mai la Val d’Aran e las valadas occitanas d’Itàlia', 'plus le Val d’Aran et les vallées occitanes d’Italie')}
					</p>
				</div>
				<div class="chifra esvani" style="--i: 3">
					<p class="chifra-num" data-comptar="10">10</p>
					<p class="chifra-nom">{@render bi('sègles de literatura', 'siècles de littérature')}</p>
					<p class="chifra-font">{@render bi('dempuèi los primièrs trobadors', 'depuis les premiers troubadours')}</p>
				</div>
			</div>
		</section>

		<!-- V. 02 S'apren : les trois façons d'apprendre, telles quelles -->
		<section class="biais" id="biais" data-revela>
			<h2 class="jalon">
				<b>02</b><span class="masc"><span class="masc-in">{@render bi('S’apren', 'S’apprend')}</span></span>
			</h2>
			{@render somari(APREN)}
			<div class="biais-grasilha">
				<article class="biai esvani" style="--i: 1">
					<p class="biai-num" aria-hidden="true">I</p>
					<h3 class="biai-titol">{@render bi('En visio, amb ieu', 'En visio, avec moi')}</h3>
					<p class="biai-tèxt">
						{@render bi(
							'De corses en dirècte, en pichon grop o sol a sol. Lo primièr es ofèrt.',
							'Des cours en direct, en petit groupe ou en tête-à-tête. Le premier est offert.'
						)}
					</p>
					<a class="biai-ligam" href={RESERVAR} target="_blank" rel="noopener" aria-describedby="onglet-nou"
						>{@render bi('Prene rendètz-vos', 'Prendre rendez-vous')} {@render sageta()}</a
					>
				</article>
				<article class="biai esvani" style="--i: 2">
					<p class="biai-num" aria-hidden="true">II</p>
					<h3 class="biai-titol">{@render bi('A ton ritme', 'À ton rythme')}</h3>
					<p class="biai-tèxt">
						{@render bi(
							'Un parcors autonòm, de zèro fins al nivèl B1, leiçon per leiçon, per contunhar entre dos corses.',
							'Un parcours autonome, de zéro jusqu’au niveau B1, leçon par leçon, pour continuer entre deux cours.'
						)}
					</p>
					<a class="biai-ligam" href="/aprene">{@render bi('Començar lo parcors', 'Commencer le parcours')} {@render sageta()}</a>
				</article>
				<article class="biai esvani" style="--i: 3">
					<p class="biai-num" aria-hidden="true">III</p>
					<h3 class="biai-titol">{@render bi('Sus mesura', 'Sur mesure')}</h3>
					<p class="biai-tèxt">
						{@render bi(
							'Visio, parcors autonòm e rescontres en persona se sèm dins la meteissa vila : ara, soi a Lion.',
							'Visio, parcours autonome et rencontres en personne si nous sommes dans la même ville : en ce moment, je suis à Lyon.'
						)}
					</p>
					<a class="biai-ligam" href={RESERVAR} target="_blank" rel="noopener" aria-describedby="onglet-nou"
						>{@render bi('Ne parlar amassa', 'En parler ensemble')} {@render sageta()}</a
					>
				</article>
			</div>
			<fieldset class="lengas esvani" style="--i: 4">
				<legend>{@render bi('Aprene l’occitan dempuèi :', 'Apprendre l’occitan depuis :')}</legend>
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

		<!-- VI. 03 Se viu : deux cartes, découvrir et faire ensemble -->
		<section class="camins" id="viure" aria-labelledby="viure-titol">
			<h2 class="camins-cap jalon" data-revela>
				<b>03</b><span class="masc"><span class="masc-in" id="viure-titol">{@render bi('Se viu', 'Se vit')}</span></span>
			</h2>
			{@render somari(VIU)}
			<div class="camins-pista">
				{#each VIURE as c, n (c.oc)}
					<article class="panel esvani" data-revela style:--i={n}>
						<div class="panel-tèxt">
							<div>
								<h3 class="panel-nom">{@render bi(c.oc, c.fr)}</h3>
								<p class="panel-tagline">{@render bi(c.toc, c.tfr)}</p>
							</div>
							<ul class="panel-items">
								{#each c.items as [oc, frTxt, href] (oc)}
									{#if href.startsWith('http')}
										<li>
											<a {href} target="_blank" rel="noopener noreferrer">{@render bi(oc, frTxt)}<Icona nom="extern" /></a>
										</li>
									{:else}
										<li><a {href}>{@render bi(oc, frTxt)}<Icona nom="suivant" /></a></li>
									{/if}
								{/each}
							</ul>
						</div>
						{#if c.media === 'paisatge'}
							<div class="panel-media">
								<img class="sens-cel" src="/acuelh/paisatge.webp" alt="" loading="lazy" width="900" height="1028" />
							</div>
						{:else}
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
						{/if}
					</article>
				{/each}
			</div>
		</section>

		<!-- VII. Le troubadour (Max Rouquette), qui clôt « Se viu » -->
		<section class="trobador">
			<div class="trobador-pin">
				<div class="trobador-fenestra">
					<img src="/acuelh/erau.webp" alt="" loading="lazy" decoding="async" width="1500" height="2173" />
				</div>
				<blockquote class="trobador-vers">
					<p lang="oc">
						<span class="masc"><span class="masc-in">« Espinchas dins la solelhada</span></span><span class="masc"
							><span class="masc-in" style="--i: 1">passar d’un nivol lo pantai… »</span></span
						>
					</p>
					<cite class="esvani" style="--i: 4"
						><span class="bi"
							><span class="oc" aria-hidden={fr}>Max Roqueta · <i>La pietat dau matin</i>, 1963</span><span
								class="fr"
								aria-hidden={!fr}>Max Rouquette · <i>La pietat dau matin</i>, 1963</span
							></span
						></cite
					>
				</blockquote>
				<!-- Repère : continuer à descendre ouvre la fenêtre (s'efface dès qu'elle s'ouvre) -->
				<div class="trobador-indici" aria-hidden="true"><span></span></div>
			</div>
		</section>

		<!-- VIII. L'appel : les cours, en fin de parcours -->
		<section class="crida centrat" id="crida" data-revela>
			<div>
				<h2 class="crida-titol">
					<span class="masc"><span class="masc-in">{@render bi('Prèst·a per', 'Prêt·e à')}</span></span>
					<span class="masc"><span class="masc-in aur" style="--i: 1">{@render bi('començar ?', 'commencer ?')}</span></span>
				</h2>
				<p class="crida-sub esvani" style="--i: 3">
					{@render bi('Tres mots uèi, una lenga deman.', 'Trois mots aujourd’hui, une langue demain.')}
				</p>
				<div class="esvani" style="--i: 4">
					<div class="crida-accions">
						<a class="boton" href={RESERVAR} target="_blank" rel="noopener" data-magnet aria-describedby="onglet-nou">
							<span class="boton-emplenat"></span>
							<span class="boton-tèxt">{@render bi('Reservar un primièr cors', 'Réserver un premier cours')}{@render sageta()}</span>
						</a>
						<a class="ligam-tèxt" href="/aprene/essai">{@render bi('Començar sol·a', 'Commencer seul·e')}</a>
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
</style>
