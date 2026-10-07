<script>
	// Accueil (2026-10-07) : l'esbòs de nuèch validé par Romain, porté dans le
	// site et posé dans le cadre commun (bandeau AppHeader, pied SiteFooter,
	// réglage d'ambiance, retour en haut). L'ancien accueil reste dans
	// l'historique Git (commit 737f8b6 et avant).
	//
	// Le contenu est rendu ici (Svelte, deux langues dans des masques qui
	// basculent) ; le mouvement (fond vivant, constellation, carte en étoiles,
	// défilement) vit dans $lib/acuelh/motor.js, chargé après coup pour que la
	// page s'affiche vite.
	//
	// Les textes ne passent plus par /admin/textes (site_textes) : à rebrancher
	// plus tard. Occitan nouveau : À VALIDER par Romain avant publication.
	import { onMount } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import { RESERVAR, MOTS, MANIFEST, CAMINS, CONSIGNAS, DRAPEUS, SEQ } from '$lib/acuelh/donadas.js';
	import { P, TRAÇATS } from '$lib/acuelh/simbol.js';
	import '$lib/acuelh/acuelh.css';

	let fr = $derived(langStore.current === 'fr');

	let racina;
	let motor = $state.raw(null);

	onMount(() => {
		// Le panneau d'ambiance propose les fonds seulement là où il y en a un
		ambianca.fonsPresent = true;
		let quitada = false;
		import('$lib/acuelh/motor.js').then(({ lancarAcuelh }) => {
			if (quitada) return;
			motor = lancarAcuelh(racina, { clar: ambianca.clar, dalt: ambianca.dalt, fons: ambianca.fons });
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

	// Le réglage commun pilote le fond et la carte
	$effect(() => {
		const clar = ambianca.clar, dalt = ambianca.dalt;
		motor?.tema(clar, dalt);
	});
	$effect(() => {
		const n = ambianca.fons;
		motor?.fons(n);
	});

	/* Langue de départ des cours : chaque langue nommée dans elle-même, la
	   consigne écrite dans la langue choisie. Au clic, les drapeaux des pays
	   où la langue se parle défilent puis se posent sur celui de son origine. */
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
		// L'avant-dernier drapeau (le Québec pour le français) reste un peu plus
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

{#snippet sageta()}<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"
		><path d="M2 8h12M9 3l5 5-5 5" /></svg
	>{/snippet}

<div class="acuelh" class:fr bind:this={racina}>
	<canvas id="fons" aria-hidden="true"></canvas>
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

		<!-- I. Le héros -->
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
							'De corses en visio amb ieu, un parcors per avançar a ton ritme, e de monde per parlar.',
							'Des cours en visio avec moi, un parcours pour avancer à ton rythme, et du monde avec qui parler.'
						)}
					</p>
					<p class="indici" aria-hidden="true">
						{@render bi('Passatz la mirga suls tres mots.', 'Survolez les trois mots.')}
					</p>
				</div>
				<div class="eros-accions esvani" style="--i: 6">
					<a class="boton" href={RESERVAR} target="_blank" rel="noopener" data-magnet aria-describedby="onglet-nou">
						<span class="boton-emplenat"></span>
						<span class="boton-tèxt">{@render bi('Reservar un primièr cors', 'Réserver un premier cours')}{@render sageta()}</span>
					</a>
					<a class="ligam-tèxt" href="/aprene/essai">{@render bi('Començar sol·a', 'Commencer seul·e')}</a>
				</div>
				<div class="davalar esvani" style="--i: 7" aria-hidden="true"><span></span></div>
			</div>
		</section>

		<!-- II. Le bandeau de mots (Lexique de Max Rouquette) -->
		<div class="bandel" role="group" aria-label={fr ? 'Quelques mots' : 'Qualques mots'}>
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

		<!-- III. Le manifeste : chaque mot s'allume avec le défilement -->
		<section class="manifest">
			<h2 class="jalon" data-revela>
				<b>01</b><span class="masc"><span class="masc-in">{@render bi('Qu’es aquò, Lo Ligam ?', 'Qu’est-ce que Lo Ligam ?')}</span></span>
			</h2>
			<p class="manifest-tèxt" data-emplenar>
				{#each ['oc', 'fr'] as l (l)}
					<span data-lenga={l} lang={l}
						>{#each MANIFEST[l] as [frasa, aur], n (n)}{#each frasa.split(' ') as m, k (k)}<span
									class={aur ? 'm aur' : 'm'}>{m}</span
								>{' '}{/each}{/each}</span
					>
				{/each}
			</p>
		</section>

		<!-- III bis. Trois façons d'apprendre : l'offre, dite clairement -->
		<section class="biais" id="biais" data-revela>
			<h2 class="jalon">
				<b>02</b><span class="masc"><span class="masc-in">{@render bi('Tres biais d’aprene', 'Trois façons d’apprendre')}</span></span>
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
			<!-- Les cours se font depuis quatre langues ; textes anglais, castillan et
			     catalan À VÉRIFIER par un locuteur -->
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

		<!-- IV. Quatre chemins : le défilement vertical devient horizontal -->
		<section class="camins" aria-labelledby="camins-titol">
			<div class="camins-pin">
				<h2 class="camins-cap jalon">
					<span><b>03</b>&ensp;<span id="camins-titol">{@render bi('Quatre camins', 'Quatre chemins')}</span></span>
					<span aria-hidden="true">→</span>
				</h2>
				<div class="camins-pista">
					{#each CAMINS as c, n (c.oc)}
						<article class="panel">
							<div class="panel-tèxt">
								<p class="panel-num" aria-hidden="true">0{n + 1}</p>
								<div>
									<h3 class="panel-nom">{@render bi(c.oc, c.fr)}</h3>
									<p class="panel-tagline">{@render bi(c.toc, c.tfr)}</p>
								</div>
								<ul class="panel-items">
									{#each c.items as [oc, frTxt, href] (oc)}
										{#if href}
											<li><a {href}>{@render bi(oc, frTxt)}<span aria-hidden="true">→</span></a></li>
										{:else}
											<li><span class="leu">{@render bi(oc, frTxt)}<em>{@render bi('Lèu', 'Bientôt')}</em></span></li>
										{/if}
									{/each}
								</ul>
							</div>
							{#if c.media === 'retrat'}
								<div class="panel-media retrat">
									<img src="/acuelh/romain.webp" alt="Romain Périer" loading="lazy" width="600" height="620" data-paral />
								</div>
							{:else if c.media === 'paisatge'}
								<div class="panel-media">
									<img class="sens-cel" src="/acuelh/paisatge.webp" alt="" loading="lazy" width="900" height="1028" data-paral />
								</div>
							{:else if c.media === 'tipo'}
								<div class="panel-media tipo"><span class="gros-mot" lang="oc">ensems</span></div>
							{:else}
								<!-- Le logo se dessine quand le panneau arrive au centre -->
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
				<div class="camins-barra" aria-hidden="true"><i></i></div>
			</div>
		</section>

		<!-- V. Les chiffres, et l'Occitanie dessinée par les étoiles -->
		<section class="chifras" data-revela>
			<h2 class="jalon">
				<b>04</b><span class="masc"><span class="masc-in">{@render bi('L’occitan, uèi', 'L’occitan, aujourd’hui')}</span></span>
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
					<p class="chifra-num" data-comptar="600000" data-prefix="≈ ">0</p>
					<p class="chifra-nom">{@render bi('locutors', 'locuteurs')}</p>
					<p class="chifra-font">
						{@render bi('Estimacion, enquèsta sociolingüistica OPLO, 2020', 'Estimation, enquête sociolinguistique OPLO, 2020')}
					</p>
				</div>
				<div class="chifra esvani" style="--i: 2">
					<p class="chifra-num" data-comptar="32">0</p>
					<p class="chifra-nom">{@render bi('despartaments', 'départements')}</p>
					<p class="chifra-font">
						{@render bi('e mai la Val d’Aran e las valadas occitanas d’Itàlia', 'plus le Val d’Aran et les vallées occitanes d’Italie')}
					</p>
				</div>
				<div class="chifra esvani" style="--i: 3">
					<p class="chifra-num" data-comptar="10">0</p>
					<p class="chifra-nom">{@render bi('sègles de literatura', 'siècles de littérature')}</p>
					<p class="chifra-font">{@render bi('dempuèi los primièrs trobadors', 'depuis les premiers troubadours')}</p>
				</div>
			</div>
		</section>

		<!-- VI. Le troubadour : la fenêtre de la page s'ouvre sur une vraie fenêtre
		     de pierre (vallée de l'Hérault, photo Romain, 2025) -->
		<section class="trobador">
			<div class="trobador-pin">
				<div class="trobador-fenestra">
					<img src="/acuelh/erau.webp" alt="" loading="lazy" decoding="async" width="1500" height="2173" />
				</div>
				<!-- Max Rouquette (1908-2005), choisi par Romain le 2026-10-06. Deux lignes
				     seulement : texte encore protégé, citation courte et signée. -->
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

		<!-- VII. L'appel -->
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
