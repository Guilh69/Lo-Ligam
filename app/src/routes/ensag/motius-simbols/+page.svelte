<script>
	// Essai du 12-11 (seconde piste) : des motifs-symboles qui s'assemblent au défilement.
	// Romain a trouvé la carte des dialectes « bof » et voulait des motifs « un peu plus
	// proches de ceux de Bourgogne mais qui représentent différents territoires et
	// symboles occitans » : ici, une mosaïque d'aplats vifs, neuf tuiles rangées comme sur
	// une petite carte (le nord en haut, la mer en bas à droite) ; chaque tuile est un
	// territoire et dessine l'un de ses symboles. Au centre, la croix occitane.
	// Les dessins sont faits pour Lo Ligam : ce qui est repris de languesdebourgogne.com,
	// c'est seulement l'idée d'une mosaïque d'aplats qui glisse avec la page.
	//
	// Comment ça marche : le JavaScript n'écrit qu'UN nombre (--p, l'avancement de 0 à 1)
	// sur la scène ; tout le mouvement est du CSS qui lit ce nombre. Le nombre est amorti,
	// et la boucle s'arrête dès que tout est posé.
	//
	// Version légère (charte, § 5quinquies) : bouton « Léger », « Fons leugièr » ou
	// mouvement réduit demandé par l'appareil : aucun JavaScript de défilement, mosaïque
	// posée d'emblée (--p = 1).
	//
	// Adresses utiles : ?leger=1 ; ?p=0.5 fige l'avancement (pour les captures).
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Crotz from '$lib/components/Crotz.svelte';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import '$lib/styles/papier.css';
	import { CARTE, TEINTES as T, texteSur } from '$lib/styles/palette.js';

	const Q = page.url.searchParams;
	let leger = $state(Q.get('leger') === '1');
	let reduit = $state(false);
	const fige = Q.get('p') === null ? null : Math.min(1, Math.max(0, Number(Q.get('p')) || 0));

	let vivant = $derived(!leger && !reduit && !ambianca.leugier);
	let pour100 = $state(100);

	// ---- les couleurs : un aplat par tuile, deux autres tons du même aplat pour le dessin ----
	const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const mel = (a, b, t) => {
		const x = hex(a);
		const y = hex(b);
		return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
	};
	// m1 : le trait fort (blanc sur un fond sombre, encre sur un fond clair) ; m2 : le même aplat assombri ;
	// m3 : le même aplat éclairci
	const tons = (fond) => [texteSur(fond), mel(fond, '#000000', 0.26), mel(fond, '#ffffff', 0.4)];

	// ---- les neuf tuiles, dans l'ordre de lecture de la mosaïque (haut gauche → bas droite) ----
	// d : d'où la tuile arrive, en largeurs de tuile (x, y) ; r : inclinaison de départ (degrés) ;
	// ini et dur : où, dans l'avancement 0 → 1, la tuile commence et combien elle met ;
	// sc : à quel point elle est plus petite au départ.
	const TUILES = [
		{ id: 'lemosin', nom: 'Lemosin', simbol: 'porcelana', fond: CARTE.dialectes.lem, d: [-1.7, -1.5], r: -18, ini: 0.1 },
		{ id: 'auvernhat', nom: 'Auvèrnha', simbol: 'volcan', fond: CARTE.dialectes.auv, d: [0.3, -2.1], r: 9, ini: 0.18 },
		{ id: 'vivaroaupenc', nom: 'Vivarés', simbol: 'Pont d’Arc', fond: CARTE.dialectes.viv, d: [1.9, -1.4], r: 16, ini: 0.26 },
		{ id: 'gascon', nom: 'Gasconha', simbol: 'pin', fond: CARTE.dialectes.gas, d: [-2.3, 0.3], r: -12, ini: 0.02 },
		{ id: 'crotz', nom: 'Occitània', simbol: 'crotz', fond: T.brique, d: [0, 0], r: 90, ini: 0.66, sc: 0.7 },
		{ id: 'provençal', nom: 'Provença', simbol: 'lavanda', fond: CARTE.dialectes.pro, d: [2.3, 0.4], r: 12, ini: 0.34, m: [T.prune, T.brique, T.orClair] },
		{ id: 'aran', nom: 'Aran', simbol: 'Pirenèus', fond: T.brun, d: [-1.8, 1.7], r: 14, ini: 0.58 },
		{ id: 'lengadocian', nom: 'Lengadòc', simbol: 'Pont del Gard', fond: CARTE.dialectes.lan, d: [-0.2, 2.2], r: -8, ini: 0.5 },
		{ id: 'mar', nom: 'Mar', simbol: 'onda', fond: T.bleu, d: [1.8, 1.6], r: -15, ini: 0.42 }
	].map((t, i) => {
		const m = t.m ?? tons(t.fond);
		return {
			...t,
			n: String(i + 1).padStart(2, '0'),
			style:
				`--fond:${t.fond};--m1:${m[0]};--m2:${m[1]};--m3:${m[2]};--dx:${t.d[0]};--dy:${t.d[1]};` +
				`--r0:${t.r};--ini:${t.ini};--dur:0.32;--sc:${t.sc ?? 0.14}`
		};
	});

	// ---- les dessins qui demandent un peu de calcul ----
	// La fleur de l'assiette : huit pétales autour du centre.
	const petales = Array.from({ length: 8 }, (_, k) => k * 45);
	// Le pont du Gard : trois étages d'arches dans une même masse (le dessin se fait par « trous » : evenodd).
	const pont = (() => {
		const etages = [
			{ y: 60, h: 28, n: 3, haut: 0.78 },
			{ y: 40, h: 20, n: 6, haut: 0.7 },
			{ y: 28, h: 12, n: 11, haut: 0.6 }
		];
		const x0 = 6;
		const larg = 88;
		return etages
			.map((e) => {
				const fente = larg / e.n;
				const w = fente * 0.6;
				const r = w / 2;
				const bas = e.y + e.h;
				const ouvertures = Array.from({ length: e.n }, (_, k) => {
					const a = x0 + fente * k + (fente - w) / 2;
					const sommet = bas - e.h * e.haut;
					return `M${a.toFixed(1)} ${bas}V${(sommet + r).toFixed(1)}A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(a + w).toFixed(1)} ${(sommet + r).toFixed(1)}V${bas}Z`;
				}).join('');
				return `M${x0} ${e.y}H${x0 + larg}V${bas}H${x0}Z${ouvertures}`;
			})
			.join('');
	})();

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
	<title>Essai : des motifs-symboles · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<div class="capçal"><AppHeader /></div>

	<main id="contengut" class="essai">
		<h1>Essai : des motifs-symboles</h1>
		<p class="intro">
			Neuf tuiles en aplats, rangées comme sur une petite carte : le Lemosin, l’Auvèrnha et le Vivarés en haut, la Gasconha, la croix occitane et la
			Provença au milieu, l’Aran, le Lengadòc et la mer en bas. Chacune dessine un symbole de son territoire. Elles glissent en place quand on descend, et
			repartent si on remonte.
		</p>
		<p class="intro">
			Cette fois la forme d’ensemble (une mosaïque d’aplats vifs qui suit la page) se rapproche de celle de
			<a href="https://languesdebourgogne.com/" rel="noopener">Langues de Bourgogne</a> ; les dessins, eux, sont faits pour Lo Ligam.
		</p>
	</main>

	<section class="piste" class:vivant bind:this={piste} aria-label="Les motifs s’assemblent">
		<div class="scene" class:vivant bind:this={scene}>
			<div class="commandes">
				<span class="etiq">Mouvement</span>
				<button type="button" class="pc pc-2 pc-chip" aria-pressed={!leger} onclick={() => (leger = false)}>Complet</button>
				<button type="button" class="pc pc-2 pc-chip" aria-pressed={leger} onclick={() => (leger = true)}>Léger</button>
			</div>

			<div class="texte">
				<h2>Occitània</h2>
				<ol class="legende">
					{#each TUILES as t (t.id)}
						<li style={t.style}>
							<span class="coin" aria-hidden="true"></span>
							<span class="nom">{t.nom}</span>
							<span class="simbol">{t.simbol}</span>
						</li>
					{/each}
				</ol>
			</div>

			<ol class="mur">
				{#each TUILES as t (t.id)}
					<li class="teula" style={t.style}>
						{#if t.id === 'crotz'}
							<div class="motiu crotz"><Crotz talha="100%" traç="#ffffff" ponch={T.orClair} moieu={T.or} /></div>
						{:else}
							<svg class="motiu" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
								{#if t.id === 'gascon'}
									<!-- les pins des Lanas : trois troncs, des cimes plates, une dune, un soleil bas -->
									<circle class="m3" cx="80" cy="24" r="11" />
									<path class="m2" d="M0 76Q28 64 52 74T100 68V100H0Z" />
									<g class="m1">
										<rect x="21" y="40" width="4" height="48" /><ellipse cx="23" cy="38" rx="15" ry="6.5" />
										<rect x="47" y="28" width="4" height="60" /><ellipse cx="49" cy="26" rx="18" ry="7.5" />
										<rect x="72" y="48" width="3.5" height="40" /><ellipse cx="73.7" cy="46" rx="12" ry="5.5" />
									</g>
								{:else if t.id === 'aran'}
									<!-- les Pirenèus : deux chaînes superposées, des neiges aux sommets -->
									<path class="m3" d="M0 84L24 46L40 66L62 28L100 84Z" />
									<path class="m1" d="M62 28L52 45L58 42L63 48L69 41L74 45Z" />
									<path class="m1" d="M24 46L17 57L22 55L26 60L30 53Z" />
									<path class="m2" d="M0 100V80L30 62L52 84L76 66L100 82V100Z" />
								{:else if t.id === 'lemosin'}
									<!-- la porcelaine de Limòtges : une assiette blanche, deux filets d'or, une fleur à huit pétales -->
									<circle class="m1" cx="50" cy="48" r="37" />
									<circle fill="none" stroke={T.or} stroke-width="3" cx="50" cy="48" r="32" />
									<circle fill="none" stroke={T.or} stroke-width="1.3" cx="50" cy="48" r="27.5" />
									{#each petales as a}
										<ellipse class="m2" cx="50" cy="31" rx="4.6" ry="10" transform="rotate({a} 50 48)" />
									{/each}
									<circle fill={T.or} cx="50" cy="48" r="6.5" />
								{:else if t.id === 'auvernhat'}
									<!-- la chaîne des Puys : un grand cône entre deux petits, un cratère -->
									<path class="m2" d="M0 86L18 58H26L42 86Z" />
									<path class="m2" d="M60 86L76 62H84L100 86Z" />
									<path fill={T.orClair} d="M22 88L44 34H58L80 88Z" />
									<ellipse class="m2" cx="51" cy="34.5" rx="7.5" ry="2.8" />
									<path class="m2" d="M0 86Q30 80 52 86T100 84V100H0Z" />
								{:else if t.id === 'lengadocian'}
									<!-- le pont du Gard : trois étages d'arches, la rivière dessous, un soleil -->
									<circle fill={T.or} cx="82" cy="13" r="7" />
									<path class="m1" fill-rule="evenodd" d={pont} />
									<path class="m2" d="M0 90Q12 85 25 90T50 90T75 90T100 90V100H0Z" />
								{:else if t.id === 'provençal'}
									<!-- la lavande : des rangs courbes qui s'élargissent vers nous, un soleil à l'horizon -->
									<circle class="m2" cx="50" cy="36" r="16" />
									<path class="m3" d="M0 42H100V100H0Z" />
									<path class="m1" d="M0 52Q50 47 100 52V54Q50 49 0 54Z" />
									<path class="m1" d="M0 60Q50 54 100 60V64Q50 58 0 64Z" />
									<path class="m1" d="M0 71Q50 64 100 71V77Q50 70 0 77Z" />
									<path class="m1" d="M0 84Q50 76 100 84V92Q50 84 0 92Z" />
								{:else if t.id === 'vivaroaupenc'}
									<!-- le pont d'Arc : une masse de roche percée d'une arche, la rivière, un soleil dans l'arche -->
									<circle fill={T.orClair} cx="50" cy="58" r="9" />
									<path class="m3" d="M10 100V30Q10 18 22 18H78Q90 18 90 30V100H72V62A22 22 0 0 0 28 62V100Z" />
									<path class="m1" d="M0 90Q12 84 25 90T50 90T75 90T100 90V100H0Z" />
								{:else if t.id === 'mar'}
									<!-- la mer : un soleil, quatre vagues -->
									<circle fill={T.or} cx="74" cy="24" r="12" />
									<path class="s1" fill="none" stroke-width="4.5" stroke-linecap="round" d="M-5 46Q7.5 37 20 46T45 46T70 46T95 46T120 46" />
									<path class="s3" fill="none" stroke-width="4.5" stroke-linecap="round" d="M-18 60Q-5.5 51 7 60T32 60T57 60T82 60T107 60" />
									<path class="s1" fill="none" stroke-width="4.5" stroke-linecap="round" d="M-5 74Q7.5 65 20 74T45 74T70 74T95 74T120 74" />
									<path class="s3" fill="none" stroke-width="4.5" stroke-linecap="round" d="M-18 88Q-5.5 79 7 88T32 88T57 88T82 88T107 88" />
								{/if}
							</svg>
						{/if}
						<p class="etiq-teula"><span class="n">{t.n}</span><span class="t">{t.nom}</span></p>
					</li>
				{/each}
			</ol>

			<p class="mesure" aria-hidden="true">{vivant ? `Avancement : ${pour100} %` : 'Version légère : tout est posé'}</p>
		</div>
	</section>

	<section class="apres">
		<p>
			Les tuiles restent posées, puis la page continue. Version légère : rien ne bouge, la mosaïque est posée d’emblée ; c’est ce que verraient les
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
		height: 340svh;
	}
	.scene {
		--p: 1; /* sans JavaScript, ou en version légère : tout est posé */
		--reserve: 8rem; /* de la hauteur d'écran, ce qui n'est pas pour la mosaïque */
		--v: 1; /* à quel point les tuiles arrivent de haut et de bas (moins sur téléphone) */
		position: relative;
		display: grid;
		grid-template-columns: minmax(15rem, 0.3fr) minmax(0, 1fr);
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

	/* ---- le texte : un titre, neuf lignes qui s'allument quand leur tuile se pose ---- */
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
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.legende li {
		--q: clamp(0, (var(--p) - var(--ini)) / var(--dur), 1);
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		font-size: clamp(0.98rem, 1.35vw, 1.2rem);
		/* la ligne s'éclaire quand la tuile a fait les trois quarts du chemin */
		opacity: calc(0.22 + 0.78 * clamp(0, (var(--q) - 0.7) / 0.3, 1));
	}
	.coin {
		flex: none;
		align-self: center;
		width: 0.8em;
		height: 0.8em;
		background: var(--fond);
	}
	.nom {
		font-weight: 700;
	}
	.simbol {
		color: var(--t-tinta-2);
	}

	/* ---- la mosaïque : neuf tuiles, chacune arrive de son côté ---- */
	.mur {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 3px;
		width: min(100%, calc((100svh - var(--reserve)) / 1.28));
		margin: 0;
		padding: 0;
		list-style: none;
		justify-self: center;
	}
	.teula {
		/* avancement propre à la tuile : q (0 → 1), puis « ce qui reste à faire » i (1 → 0), freinage doux */
		--q: clamp(0, (var(--p) - var(--ini)) / var(--dur), 1);
		--k: calc(1 - var(--q));
		--i: calc(var(--k) * var(--k));
		display: flex;
		flex-direction: column;
		container-type: inline-size;
		overflow: hidden;
		border-radius: 3px;
		background: var(--fond);
		color: var(--m1);
		opacity: calc(1 - 0.9 * var(--k));
		transform-origin: center;
		transform: translate(calc(var(--dx) * var(--i) * 100%), calc(var(--dy) * var(--v) * var(--i) * 100%)) rotate(calc(var(--r0) * 1deg * var(--i)))
			scale(calc(1 - var(--sc) * var(--i)));
	}
	.vivant .teula {
		will-change: transform, opacity;
	}
	.motiu {
		display: block;
		width: 100%;
		aspect-ratio: 1;
	}
	.crotz {
		box-sizing: border-box;
		padding: 11%;
	}
	.etiq-teula {
		display: flex;
		align-items: baseline;
		gap: 0.5em;
		margin: 0;
		padding: 0.42rem 0.6rem 0.5rem;
		font-size: clamp(0.64rem, 8.2cqi, 1.05rem);
		font-weight: 700;
		line-height: 1.15;
		/* le nom apparaît quand la tuile est presque posée */
		opacity: clamp(0, (var(--q) - 0.7) / 0.3, 1);
	}
	.n {
		font-weight: 400;
		opacity: 0.7;
		font-variant-numeric: tabular-nums;
	}

	/* les tons du dessin : le trait fort, l'aplat assombri, l'aplat éclairci */
	.m1 {
		fill: var(--m1);
	}
	.m2 {
		fill: var(--m2);
	}
	.m3 {
		fill: var(--m3);
	}
	.s1 {
		stroke: var(--m1);
	}
	.s3 {
		stroke: var(--m3);
	}

	/* ---- téléphone : la mosaïque pleine largeur sous le titre ; les noms sont dans les tuiles ---- */
	@media (max-width: 640px) {
		.scene {
			--reserve: 10rem;
			--v: 0.6;
			grid-template-columns: minmax(0, 1fr);
			align-content: center;
			gap: 0.9rem;
		}
		.scene.vivant {
			padding-top: 3.6rem;
			padding-bottom: 1.6rem;
		}
		h2 {
			margin-bottom: 0;
			font-size: 2rem;
		}
		.legende {
			display: none;
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
		.vivant .legende li,
		.vivant .etiq-teula {
			opacity: 1;
		}
		.vivant .teula {
			opacity: 1;
			transform: none;
		}
	}
</style>
