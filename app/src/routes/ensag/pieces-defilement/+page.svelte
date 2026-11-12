<script>
	// Essai du 12-11 : la carte qui s'assemble au défilement.
	// Les six dialectes de la carte du site (les mêmes silhouettes que la carte des
	// radios) sont écartés, inclinés ; en descendant dans la page, chacun glisse
	// depuis son côté et vient se poser à sa place : six parlers, une seule langue.
	// Il n'y a ici ni mosaïque ni formes géométriques : seulement le territoire.
	//
	// Seule idée venue d'ailleurs : un mouvement lié à la position de la page
	// (languesdebourgogne.com, dont l'accueil incline ses formes en défilant).
	//
	// Comment ça marche : le JavaScript ne fait qu'une chose, écrire UN nombre
	// (--p, l'avancement de 0 à 1) sur la scène. Tout le mouvement est du CSS qui
	// lit ce nombre. Le nombre est amorti (la pièce « suit » le doigt avec un léger
	// retard) et la boucle s'arrête dès que tout est posé.
	//
	// Version légère (règle de la charte, § 5quinquies) : si l'appareil demande
	// moins de mouvement, ou si « Fons leugièr » est choisi, ou si on prend le
	// bouton « Léger » : aucun JavaScript de défilement, aucune pièce en l'air, la
	// carte est posée d'emblée (--p = 1).
	//
	// Adresses utiles : ?leger=1 ; ?p=0.5 fige l'avancement (pour les captures).
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import '$lib/styles/papier.css';
	import { DIALECTES, LARG, NAUT } from '$lib/data/carta-dialectes.js';
	import { CARTE, texteSur } from '$lib/styles/palette.js';

	const Q = page.url.searchParams;
	let leger = $state(Q.get('leger') === '1');
	let reduit = $state(false);
	const fige = Q.get('p') === null ? null : Math.min(1, Math.max(0, Number(Q.get('p')) || 0));

	let vivant = $derived(!leger && !reduit && !ambianca.leugier);
	let pour100 = $state(100);

	// Chaque dialecte arrive du côté d'où il vient, dans l'ordre où on les rencontre
	// en remontant la carte. d : départ sur grand écran, m : sur téléphone (là il n'y a
	// pas de place au-dessus ni en dessous de la carte, les pièces arrivent de côté).
	// Mesures en unités de la carte (1000 de large) ; r : inclinaison de départ (degrés) ;
	// ini et dur : où, dans l'avancement 0 → 1, la pièce commence et combien elle met.
	const DEPART = {
		gascon: { nom: 'Gascon', d: [-40, 175], m: [-330, 40], r: -13, ini: 0.03, dur: 0.5 },
		lemosin: { nom: 'Lemosin', d: [-50, -185], m: [-330, -60], r: 11, ini: 0.11, dur: 0.5 },
		lengadocian: { nom: 'Lengadocian', d: [20, 200], m: [60, 60], r: 8, ini: 0.19, dur: 0.5 },
		auvernhat: { nom: 'Auvernhat', d: [60, -210], m: [200, -90], r: -10, ini: 0.27, dur: 0.5 },
		provençal: { nom: 'Provençal', d: [190, 150], m: [330, 50], r: 14, ini: 0.34, dur: 0.5 },
		vivaroaupenc: { nom: 'Vivaroaupenc', d: [250, -60], m: [340, -120], r: -11, ini: 0.4, dur: 0.5 }
	};
	const KOD = { gascon: 'gas', lengadocian: 'lan', provençal: 'pro', lemosin: 'lem', auvernhat: 'auv', vivaroaupenc: 'viv' };

	// Dans l'ordre de DEPART : la pièce se pose, son nom s'allume dans la légende.
	const pieces = Object.entries(DEPART).map(([id, dep]) => {
		const forme = DIALECTES.find((f) => f.id === id);
		const fond = CARTE.dialectes[KOD[id]];
		return {
			id,
			nom: dep.nom,
			d: forme.d,
			fond,
			style:
				`--fond:${fond};--tinta:${texteSur(fond)};--dx:${dep.d[0]};--dy:${dep.d[1]};` +
				`--mdx:${dep.m[0]};--mdy:${dep.m[1]};--r0:${dep.r};--ini:${dep.ini};--dur:${dep.dur}`
		};
	});

	let piste = $state();
	let scene = $state();
	let p = 1;
	let but = 1;
	let raf = 0;
	let avant = 0;

	function viser() {
		if (fige !== null) return fige;
		const r = piste.getBoundingClientRect();
		const course = r.height - scene.offsetHeight;
		return course > 0 ? Math.min(1, Math.max(0, -r.top / course)) : 1;
	}
	function ecrire() {
		scene.style.setProperty('--p', p.toFixed(4));
		const c = Math.round(p * 100);
		if (c !== pour100) pour100 = c;
	}
	function boucle(t) {
		const dt = Math.min(0.05, (t - avant) / 1000);
		avant = t;
		p += (but - p) * (1 - Math.exp(-dt / 0.09));
		if (Math.abs(but - p) < 0.0004) p = but;
		ecrire();
		raf = p === but ? 0 : requestAnimationFrame(boucle);
	}
	function reveiller() {
		but = viser();
		if (!raf && p !== but) {
			avant = performance.now();
			raf = requestAnimationFrame(boucle);
		}
	}

	onMount(() => {
		const mm = matchMedia('(prefers-reduced-motion: reduce)');
		reduit = mm.matches;
		const suivre = () => (reduit = mm.matches);
		mm.addEventListener('change', suivre);
		return () => mm.removeEventListener('change', suivre);
	});

	// branche ou débranche le mouvement selon le mode
	$effect(() => {
		if (!scene || !piste) return;
		if (!vivant) {
			cancelAnimationFrame(raf);
			raf = 0;
			p = but = 1;
			scene.style.removeProperty('--p');
			pour100 = 100;
			return;
		}
		p = but = viser();
		ecrire();
		if (fige !== null) return;
		addEventListener('scroll', reveiller, { passive: true });
		addEventListener('resize', reveiller);
		return () => {
			removeEventListener('scroll', reveiller);
			removeEventListener('resize', reveiller);
			cancelAnimationFrame(raf);
			raf = 0;
		};
	});
</script>

<svelte:head>
	<title>Essai : la carte qui s’assemble · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<div class="capçal"><AppHeader /></div>

	<main id="contengut" class="essai">
		<h1>Essai : la carte qui s’assemble</h1>
		<p class="intro">
			Les six dialectes de la carte du site, écartés puis rassemblés à mesure qu’on descend ; on remonte, ils s’écartent de nouveau. Le mouvement
			suit la position de la page : il n’est pas lancé une fois pour toutes. Seule idée venue d’ailleurs : un mouvement lié au défilement, vu sur
			<a href="https://languesdebourgogne.com/" rel="noopener">l’accueil de Langues de Bourgogne</a> ; le dessin, lui, est celui de la carte de Lo
			Ligam.
		</p>
		<p class="intro">Descends : la scène se fige à l’écran, puis les pièces se posent.</p>
	</main>

	<section class="piste" class:vivant bind:this={piste} aria-label="Les dialectes s’assemblent">
		<div class="scene" class:vivant bind:this={scene}>
			<div class="commandes">
				<span class="etiq">Mouvement</span>
				<button type="button" class="pc pc-2 pc-chip" aria-pressed={!leger} onclick={() => (leger = false)}>Complet</button>
				<button type="button" class="pc pc-2 pc-chip" aria-pressed={leger} onclick={() => (leger = true)}>Léger</button>
			</div>

			<div class="texte">
				<h2>Occitània</h2>
				<ol class="legende">
					{#each pieces as pc (pc.id)}
						<li style={pc.style}>
							<span class="coin" aria-hidden="true"></span>
							<span class="nom">{pc.nom}</span>
						</li>
					{/each}
				</ol>
			</div>

			<svg class="carta" viewBox="0 0 {LARG} {NAUT}" role="img" aria-label="Les six dialectes occitans posés côte à côte, qui forment un seul territoire">
				{#each pieces as pc (pc.id)}
					<g class="piece" style={pc.style}>
						<path class="ombre" d={pc.d} fill-rule="evenodd" />
						<path class="papier" d={pc.d} fill-rule="evenodd" />
					</g>
				{/each}
			</svg>

			<p class="mesure" aria-hidden="true">{vivant ? `Avancement : ${pour100} %` : 'Version légère : tout est posé'}</p>
		</div>
	</section>

	<section class="apres">
		<p>
			Les dialectes restent posés, puis la page continue. Version légère : rien ne bouge, la carte est posée d’emblée ; c’est ce que verraient les
			personnes qui demandent moins de mouvement, ou qui choisissent « Fons leugièr ».
		</p>
	</section>
</div>

<style>
	.page {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		color: var(--t-tinta);
		--marge: clamp(1rem, 4vw, 3.4rem);
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.essai,
	.apres {
		max-width: 46rem;
		margin: 0 auto;
		padding: 1.2rem var(--marge);
	}
	.apres {
		padding-bottom: 7rem;
	}
	h1 {
		margin: 0 0 0.8rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.9rem, 5vw, 2.8rem);
		line-height: 1.05;
	}
	.intro,
	.apres p {
		max-width: 62ch;
		line-height: 1.5;
	}
	.intro a {
		color: inherit;
		text-underline-offset: 0.2em;
	}

	/* ---- la piste : une hauteur de plusieurs écrans, dans laquelle la scène reste collée ---- */
	.piste {
		position: relative;
	}
	.piste.vivant {
		height: 320svh;
	}
	.scene {
		--p: 1; /* sans JavaScript, ou en version légère : tout est posé */
		position: relative;
		display: grid;
		grid-template-columns: minmax(12rem, 0.32fr) minmax(0, 1fr);
		align-items: center;
		gap: clamp(1rem, 4vw, 4rem);
		padding: 4.5rem var(--marge) 3rem;
		overflow: clip;
	}
	.scene.vivant {
		position: sticky;
		top: 0;
		height: 100svh;
		padding-block: 0;
	}

	.commandes {
		position: absolute;
		top: 0.9rem;
		left: var(--marge);
		right: var(--marge);
		z-index: 4;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem 0.5rem;
	}
	.etiq {
		margin-right: 0.2rem;
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.mesure {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0.9rem;
		margin: 0;
		text-align: center;
		font-size: 0.8rem;
		font-variant-numeric: tabular-nums;
		color: var(--t-tinta-2);
	}

	/* ---- le texte : un titre, six noms qui s'allument quand leur pièce se pose ---- */
	.texte {
		position: relative;
		z-index: 3;
	}
	h2 {
		margin: 0 0 1.4rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.2rem, 5.4vw, 4.4rem);
		line-height: 1;
	}
	.legende {
		display: grid;
		gap: 0.55rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.legende li {
		--q: clamp(0, (var(--p) - var(--ini)) / var(--dur), 1);
		display: flex;
		align-items: center;
		gap: 0.7rem;
		font-size: clamp(1.05rem, 1.5vw, 1.3rem);
	}
	.coin {
		flex: none;
		width: 0.8em;
		height: 0.8em;
		background: var(--fond);
	}
	.nom {
		font-weight: 700;
	}
	/* le nom s'éclaire quand la pièce a fait les trois quarts du chemin */
	.vivant .legende li {
		opacity: calc(0.22 + 0.78 * clamp(0, (var(--q) - 0.7) / 0.3, 1));
	}

	/* ---- la carte : six pièces, chacune arrive de son côté ---- */
	.carta {
		position: relative;
		z-index: 2;
		display: block;
		width: min(100%, calc(62svh * 1000 / 604));
		height: auto;
		justify-self: center;
		overflow: visible; /* les pièces écartées sortent du cadre de la carte */
	}
	.piece {
		--tx: var(--dx);
		--ty: var(--dy);
		/* avancement propre à la pièce : q (0 → 1), puis « ce qui reste à faire » i (1 → 0), freinage doux */
		--q: clamp(0, (var(--p) - var(--ini)) / var(--dur), 1);
		--k: calc(1 - var(--q));
		--i: calc(var(--k) * var(--k));
		transform-box: fill-box;
		transform-origin: center;
		transform: translate(calc(var(--tx) * var(--i) * 1px), calc(var(--ty) * var(--i) * 1px)) rotate(calc(var(--r0) * 1deg * var(--i)));
	}
	.vivant .piece {
		will-change: transform;
	}
	.papier {
		fill: var(--fond);
	}
	/* l'ombre se resserre quand la pièce se pose : longue en l'air, courte posée (3 px, comme le papier du site) */
	.ombre {
		fill: var(--pc-ombre, rgb(0 0 0 / 0.35));
		opacity: 0.55;
		transform: translate(0, calc(2px + 10px * var(--i)));
	}

	/* ---- téléphone : le titre et les noms au-dessus, la carte dessous, les pièces arrivent de côté ---- */
	@media (max-width: 640px) {
		.scene {
			grid-template-columns: minmax(0, 1fr);
			align-content: center;
			gap: 1.6rem;
		}
		.scene.vivant {
			padding-top: 4.5rem;
			padding-bottom: 2.2rem;
		}
		.legende {
			grid-template-columns: 1fr 1fr;
			gap: 0.35rem 1rem;
		}
		.carta {
			width: 100%;
		}
		.piece {
			--tx: var(--mdx);
			--ty: var(--mdy);
		}
	}

	/* l'appareil demande moins de mouvement : tout est posé, la page ne se fige pas
	   (le même résultat que la version légère, avant même que le JavaScript ne le sache) */
	@media (prefers-reduced-motion: reduce) {
		.piste.vivant {
			height: auto;
		}
		.scene.vivant {
			position: relative;
			height: auto;
			padding-block: 4.5rem 3rem;
		}
		.vivant .legende li {
			opacity: 1;
		}
		.vivant .piece {
			transform: none;
		}
		.vivant .ombre {
			transform: translate(0, 3px);
		}
	}
</style>
