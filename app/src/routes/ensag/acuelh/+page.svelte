<script>
	import Icona from '$lib/components/Icona.svelte';
	// Essai de réorganisation de l'accueil (2026-10-15), d'après le site de
	// l'Alliance des collectivités pour la qualité de l'air : chaque section
	// répond à une seule question du visiteur. Option A choisie par Romain
	// (« les trois verbes » du titre deviennent le plan de la page), avec le
	// meilleur de l'option B :
	//   - un seul bouton principal à l'ouverture (la carte) ;
	//   - « Qui » : le manifeste sans numéro, avec la photo de Romain ;
	//   - les numéros 01-02-03 portent les idées (se parle, s'apprend, se vit) ;
	//   - « Quatre chemins » disparaît (il répétait le menu, 6 liens sur 12 « Bientôt ») ;
	//   - Instagram tient lieu de lettre d'informations, sans travail en plus.
	// Même moteur et même feuille de style que l'accueil ($lib/acuelh) : seuls
	// l'ordre et quelques textes changent. Occitan nouveau : À VALIDER par Romain.
	import { onMount } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import { RESERVAR, MOTS, MANIFEST, CONSIGNAS, DRAPEUS, SEQ } from '$lib/acuelh/donadas.js';
	import { P, TRAÇATS } from '$lib/acuelh/simbol.js';
	import '$lib/acuelh/acuelh.css';

	let fr = $derived(langStore.current === 'fr');

	let racina;
	let motor = $state.raw(null);

	// « Se viu » : ce qui fait vivre la langue, que des liens qui existent
	const VIURE = [
		{ oc: 'Mots', fr: 'Mots', toc: 'Las fichas, per tèma', tfr: 'Les fiches, par thème', media: 'tipo',
			items: [['Mots en imatges', 'Mots en images', '/mots']] },
		{ oc: 'Òbras', fr: 'Œuvres', toc: 'Çò qu’escoti, çò que legissi', tfr: 'Ce que j’écoute, ce que je lis', media: 'paisatge',
			items: [['Veire las òbras', 'Voir les œuvres', '/obras']] },
		{ oc: 'Instagram', fr: 'Instagram', toc: 'Las novetats de Lo Ligam', tfr: 'Les nouveautés de Lo Ligam', media: 'simbol',
			items: [['Seguir Lo Ligam', 'Suivre Lo Ligam', 'https://www.instagram.com/lo_ligam/']] }
	];

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
	<title>Ensag · Acuèlh · Lo Ligam</title>
	<meta name="robots" content="noindex" />
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

{#snippet sageta()}<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"
		><path d="M2 8h12M9 3l5 5-5 5" /></svg
	>{/snippet}

<div class="acuelh" class:fr bind:this={racina}>
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
		<section class="eros" data-revela>
			<p class="eros-kicker">
				<span class="masc"><span class="masc-in">{@render bi('L’occitan', 'L’occitan')}</span></span>
			</p>
			<h1 class="eros-titol">
				<span class="linha masc"><span class="masc-in" style="--i: 1">{@render bi('Se parla.', 'Se parle.')}</span></span>
				<span class="linha masc"><span class="masc-in" style="--i: 2">{@render bi('S’apren.', 'S’apprend.')}</span></span>
				<span class="linha masc"><span class="masc-in" style="--i: 3">{@render bi('Se viu.', 'Se vit.')}</span></span>
			</h1>
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
			<div
				class="carta-estelas"
				role="img"
				aria-label={fr
					? 'Carte de l’Occitanie en étoiles : 304 villes et villages, avec leur nom occitan'
					: 'Carta de l’Occitània en estelas : 304 vilas e vilatges, amb lor nom occitan'}
			></div>
			<div class="carta-dobrir esvani">
				<a class="boton boton-traç" href="/carta" data-magnet
					><span class="boton-emplenat"></span><span class="boton-tèxt"
						>{@render bi('Dobrir la carta entièra', 'Ouvrir la carte entière')} {@render sageta()}</span
					></a
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
						>{@render bi('Ne parlar ensems', 'En parler ensemble')} {@render sageta()}</a
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

		<!-- VI. 03 Se viu : trois cartes, que des liens vivants -->
		<section class="camins tres" aria-labelledby="viure-titol">
			<h2 class="camins-cap jalon" data-revela>
				<b>03</b><span class="masc"><span class="masc-in" id="viure-titol">{@render bi('Se viu', 'Se vit')}</span></span>
			</h2>
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
						{:else if c.media === 'tipo'}
							<div class="panel-media tipo"><span class="gros-mot" lang="oc">abelugat</span></div>
						{:else}
							<div class="panel-media simbol">
								<svg viewBox="-1.3 -1.3 2.6 2.6" aria-hidden="true">
									{#each TRAÇATS as t (t.d)}
										<path class="tr" d={t.d} fill="none" stroke="#fff" stroke-width={0.055 * t.k} stroke-linecap="round" pathLength="1" />
									{/each}
									{#each P as [x, y], i (i)}
										<circle
											cx={x}
											cy={y}
											r={i === 0 ? 0.124 : 0.109}
											fill={i === 0 ? '#eeaf34' : '#ffd47f'}
											style:transition-delay="{600 + i * 50}ms"
										/>
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

<style>
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

	/* Se viu : trois cartes de front, puis l'une sous l'autre */
	.tres .camins-pista {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@container camins (max-width: 1250px) {
		.tres .camins-pista {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@container camins (max-width: 760px) {
		.tres .camins-pista {
			grid-template-columns: 1fr;
			row-gap: 3.4rem;
		}
	}
</style>
