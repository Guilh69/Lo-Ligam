<script>
	// Essai du 12-11 (seconde piste, refaite le soir : « fais mieux ») : des motifs-symboles
	// qui se posent au défilement.
	// Romain voulait des motifs « un peu plus proches de ceux de Bourgogne mais qui
	// représentent différents territoires et symboles occitans ». Ici : neuf tuiles de
	// papier découpé, rangées comme une petite carte (le nord en haut, la mer en bas à
	// droite). Chaque tuile est un territoire ; son dessin est fait de formes simples
	// (demi-disques, triangles, bandes) dans les couleurs franches de la palette, et il se
	// construit pendant que la tuile se pose. À gauche (au-dessus sur téléphone), un cartel
	// annonce le territoire qui arrive : le numéro, le nom, le symbole.
	// Les dessins sont faits pour Lo Ligam : de languesdebourgogne.com ne reste que l'idée
	// d'une mosaïque d'aplats qui suit la page.
	//
	// Comment ça marche : le JavaScript n'écrit qu'UN nombre (--p, l'avancement de 0 à 1)
	// sur la scène ; tout le mouvement est du CSS qui lit ce nombre. Le nombre est amorti,
	// et la boucle s'arrête dès que tout est posé. Le cartel change neuf fois en tout.
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
	import { CARTE, TEINTES as T } from '$lib/styles/palette.js';

	const Q = page.url.searchParams;
	let leger = $state(Q.get('leger') === '1');
	let reduit = $state(false);
	const fige = Q.get('p') === null ? null : Math.min(1, Math.max(0, Number(Q.get('p')) || 0));

	let vivant = $derived(!leger && !reduit && !ambianca.leugier);

	const BLANC = '#ffffff';
	const DUR = 0.3; // part de l'avancement que met une tuile à se poser

	// ---- les neuf tuiles, dans l'ordre de lecture de la mosaïque (haut gauche → bas droite) ----
	// d : d'où la tuile arrive, en largeurs de tuile (x, y) ; r : inclinaison de départ (degrés) ;
	// ini : où, dans l'avancement 0 → 1, elle commence ; tinta : la couleur de son nom ;
	// mot : le symbole en occitan ; glosa : ce que c'est.
	const TUILES = [
		{ id: 'lemosin', nom: 'Lemosin', mot: 'porcelana', glosa: 'la porcelaine de Limoges', fond: CARTE.dialectes.lem, tinta: BLANC, d: [-1.1, -1], r: -14, ini: 0.1 },
		{ id: 'auvernhat', nom: 'Auvèrnha', mot: 'volcan', glosa: 'la chaîne des Puys', fond: CARTE.dialectes.auv, tinta: BLANC, d: [0.2, -1.4], r: 8, ini: 0.18 },
		{ id: 'vivaroaupenc', nom: 'Vivarés', mot: 'Pont d’Arc', glosa: 'l’arche de pierre sur l’Ardèche', fond: CARTE.dialectes.viv, tinta: BLANC, d: [1.2, -1], r: 13, ini: 0.26 },
		{ id: 'gascon', nom: 'Gasconha', mot: 'pin', glosa: 'les pins des Landes', fond: CARTE.dialectes.gas, tinta: T.encre, d: [-1.5, 0.2], r: -10, ini: 0.02 },
		{ id: 'crotz', nom: 'Occitània', mot: 'crotz', glosa: 'la croix occitane', fond: T.brique, tinta: BLANC, d: [0, 0], r: 90, ini: 0.68, sc: 0.7 },
		{ id: 'provençal', nom: 'Provença', mot: 'lavanda', glosa: 'les champs de lavande', fond: CARTE.dialectes.pro, tinta: T.encre, d: [1.5, 0.3], r: 10, ini: 0.34 },
		{ id: 'aran', nom: 'Aran', mot: 'Pirenèus', glosa: 'les Pyrénées', fond: T.encre, tinta: BLANC, d: [-1.2, 1.1], r: 12, ini: 0.58 },
		{ id: 'lengadocian', nom: 'Lengadòc', mot: 'Pont del Gard', glosa: 'le pont du Gard', fond: CARTE.dialectes.lan, tinta: BLANC, d: [-0.2, 1.4], r: -7, ini: 0.5 },
		{ id: 'mar', nom: 'Mar', mot: 'onda', glosa: 'la Méditerranée', fond: T.bleu, tinta: BLANC, d: [1.2, 1.1], r: -12, ini: 0.42 }
	].map((t, i) => ({
		...t,
		n: String(i + 1).padStart(2, '0'),
		style:
			`--fond:${t.fond};--tinta:${t.tinta};--dx:${t.d[0]};--dy:${t.d[1]};` +
			`--r0:${t.r};--ini:${t.ini};--dur:${DUR};--sc:${t.sc ?? 0.1}`
	}));
	// dans l'ordre d'arrivée : c'est l'ordre du cartel
	const ORDRE = [...TUILES].sort((a, b) => a.ini - b.ini);

	// ---- les dessins qui demandent un peu de calcul ----
	// La fleur de l'assiette : huit pétales autour du centre.
	const petales = Array.from({ length: 8 }, (_, k) => k * 45);
	// Le pont du Gard : trois étages d'arches, chacun d'un seul tenant (les arches sont des « trous » : evenodd).
	const etages = [
		{ y: 60, h: 42, n: 3, larg: 26, haut: 34 },
		{ y: 34, h: 24, n: 6, larg: 12, haut: 19 },
		{ y: 20, h: 12, n: 12, larg: 6, haut: 9 }
	].map((e) => {
		const x0 = -2;
		const tot = 124;
		const fente = tot / e.n;
		const r = e.larg / 2;
		const bas = e.y + e.h;
		const naissance = bas - e.haut + r; // là où le demi-cercle commence
		const trous = Array.from({ length: e.n }, (_, k) => {
			const a = x0 + fente * k + (fente - e.larg) / 2;
			return `M${a.toFixed(2)} ${bas}V${naissance}A${r} ${r} 0 0 1 ${(a + e.larg).toFixed(2)} ${naissance}V${bas}Z`;
		}).join('');
		return `M${x0} ${e.y}H${x0 + tot}V${bas}H${x0}Z${trous}`;
	});
	// La mer : une vague régulière (demi-période de 15), plus longue que la tuile pour pouvoir glisser.
	const vague = (y) => {
		let d = `M-45 ${y}Q-37.5 ${y - 9} -30 ${y}`;
		for (let x = -15; x <= 165; x += 15) d += `T${x} ${y}`;
		return d;
	};

	let piste = $state();
	let scene = $state();
	let courant = $state(ORDRE.length - 1); // la tuile annoncée par le cartel ; -1 : aucune encore
	let p = 1;
	let but = 1;
	let raf = 0;
	let avant = 0;

	let fiche = $derived(courant < 0 ? null : ORDRE[courant]);

	function viser() {
		if (fige !== null) return fige;
		const r = piste.getBoundingClientRect();
		const course = r.height - scene.offsetHeight;
		return course > 0 ? Math.min(1, Math.max(0, -r.top / course)) : 1;
	}
	function ecrire() {
		scene.style.setProperty('--p', p.toFixed(4));
		// le cartel annonce une tuile dès qu'elle est bien visible (au tiers de son trajet)
		let c = -1;
		for (let i = 0; i < ORDRE.length; i++) if (p >= ORDRE[i].ini + DUR * 0.33) c = i;
		if (c !== courant) courant = c;
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
			courant = ORDRE.length - 1;
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
			Neuf tuiles de papier, rangées comme une petite carte : le Lemosin, l’Auvèrnha et le Vivarés en haut ; la Gasconha, la croix occitane et la Provença
			au milieu ; l’Aran, le Lengadòc et la mer en bas. Chacune porte un symbole de son territoire, dessiné avec des formes simples. Elles se posent une à
			une quand on descend, et se relèvent si on remonte.
		</p>
		<p class="intro">
			L’allure d’ensemble (une mosaïque d’aplats qui suit la page) vient de
			<a href="https://languesdebourgogne.com/" rel="noopener">Langues de Bourgogne</a> ; les dessins sont faits pour Lo Ligam.
		</p>
	</main>

	<section class="piste" class:vivant bind:this={piste} aria-label="Les motifs se posent">
		<div class="scene" class:vivant bind:this={scene}>
			<div class="commandes">
				<span class="etiq">Mouvement</span>
				<button type="button" class="pc pc-2 pc-chip" aria-pressed={!leger} onclick={() => (leger = false)}>Complet</button>
				<button type="button" class="pc pc-2 pc-chip" aria-pressed={leger} onclick={() => (leger = true)}>Léger</button>
			</div>

			<!-- le cartel : il annonce la tuile qui arrive (les noms sont aussi sous chaque tuile) -->
			<div class="cartel" aria-hidden="true">
				{#key courant}
					<div class="fiche" style={fiche ? `--fond:${fiche.fond}` : ''}>
						{#if fiche}
							<p class="rang"><span class="coin"></span>{fiche.n}</p>
							<p class="titre">{fiche.nom}</p>
							<p class="simbol"><strong>{fiche.mot}</strong><span>{fiche.glosa}</span></p>
						{:else}
							<p class="rang">&nbsp;</p>
							<p class="titre">Occitània</p>
							<p class="simbol"><span>Descends : les tuiles se posent une à une.</span></p>
						{/if}
					</div>
				{/key}
			</div>

			<ol class="mur">
				{#each TUILES as t (t.id)}
					<li class="cas" style={t.style}>
						<div class="teula">
							<div class="face">
								{#if t.id === 'crotz'}
									<div class="motiu crotz"><Crotz talha="100%" traç={BLANC} ponch={T.orClair} moieu={T.or} /></div>
								{:else}
									<svg class="motiu" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
										{#if t.id === 'lemosin'}
											<!-- la porcelaine de Limòtges : une assiette, un filet d'or, une fleur qui tourne en se posant -->
											<circle cx="60" cy="60" r="50" fill={BLANC} />
											<circle cx="60" cy="60" r="42" fill="none" stroke={T.or} stroke-width="5" />
											<g class="vira">
												{#each petales as a}
													<ellipse cx="60" cy="37.5" rx="6.5" ry="13.5" fill={t.fond} transform="rotate({a} 60 60)" />
												{/each}
											</g>
											<circle cx="60" cy="60" r="9" fill={T.or} />
										{:else if t.id === 'auvernhat'}
											<!-- la chaîne des Puys : deux dômes sombres, le grand volcan monte entre eux, son cratère au sommet -->
											<path d="M-6 96A24 24 0 0 1 42 96Z" fill={T.encre} />
											<path d="M82 96A22 22 0 0 1 126 96Z" fill={T.encre} />
											<g class="monta" style="--h:72">
												<path d="M16 96L48 30H76L108 96Z" fill={T.or} />
												<path d="M51 30A11 11 0 0 0 73 30Z" fill={t.fond} />
											</g>
											<rect x="0" y="96" width="120" height="24" fill={T.encre} />
										{:else if t.id === 'vivaroaupenc'}
											<!-- le pont d'Arc : la falaise percée d'une arche descend, deux reflets glissent sur la rivière -->
											<path class="davala" style="--h:96" fill-rule="evenodd" d="M0 30H120V92H0ZM20 92A40 40 0 0 1 100 92Z" fill={T.orClair} />
											<rect class="lisa" style="--s:-1" x="0" y="100" width="120" height="4" fill={BLANC} />
											<rect class="lisa" style="--s:1" x="0" y="110" width="120" height="4" fill={BLANC} />
										{:else if t.id === 'gascon'}
											<!-- les pins des Lanas : trois troncs, trois cimes en demi-disque, ils sortent du sable -->
											<g class="monta" style="--h:70">
												<rect x="27.5" y="52" width="5" height="50" fill={T.encre} />
												<path d="M10 52A20 20 0 0 1 50 52Z" fill={T.olive} />
											</g>
											<g class="monta" style="--h:100">
												<rect x="61.5" y="36" width="5" height="66" fill={T.encre} />
												<path d="M38 36A26 26 0 0 1 90 36Z" fill={T.olive} />
											</g>
											<g class="monta" style="--h:60">
												<rect x="93.5" y="64" width="5" height="38" fill={T.encre} />
												<path d="M79 64A17 17 0 0 1 113 64Z" fill={T.olive} />
											</g>
											<rect x="0" y="100" width="120" height="20" fill={T.brique} />
										{:else if t.id === 'provençal'}
											<!-- la lavande : le soleil se lève derrière le champ, les rangs glissent chacun de son côté -->
											<path class="monta" style="--h:26" d="M38 50A22 22 0 0 1 82 50Z" fill={T.brique} />
											<rect x="0" y="50" width="120" height="70" fill={T.orClair} />
											<path class="lisa" style="--s:-1" d="M-10 58Q60 52 130 58V61Q60 55 -10 61Z" fill={T.prune} />
											<path class="lisa" style="--s:1" d="M-10 68Q60 61 130 68V73Q60 66 -10 73Z" fill={T.prune} />
											<path class="lisa" style="--s:-1" d="M-10 82Q60 73 130 82V89Q60 80 -10 89Z" fill={T.prune} />
											<path class="lisa" style="--s:1" d="M-10 100Q60 89 130 100V110Q60 99 -10 110Z" fill={T.prune} />
										{:else if t.id === 'aran'}
											<!-- les Pirenèus : deux triangles qui se dressent dans la nuit -->
											<path class="monta" style="--h:90" d="M-8 104L44 22L96 104Z" fill={BLANC} />
											<path class="monta" style="--h:70" d="M48 104L86 48L124 104Z" fill={T.ocre} />
										{:else if t.id === 'lengadocian'}
											<!-- le pont du Gard : trois étages d'arches qui se posent l'un sur l'autre -->
											<path class="davala" style="--h:70" fill-rule="evenodd" d={etages[0]} fill={BLANC} />
											<path class="davala" style="--h:100" fill-rule="evenodd" d={etages[1]} fill={BLANC} />
											<path class="davala" style="--h:130" fill-rule="evenodd" d={etages[2]} fill={BLANC} />
										{:else if t.id === 'mar'}
											<!-- la mer : le soleil monte, les vagues glissent en sens contraires -->
											<circle class="monta" style="--h:40" cx="84" cy="30" r="15" fill={T.or} />
											<path class="onda" style="--s:-1" d={vague(60)} stroke={BLANC} />
											<path class="onda" style="--s:1" d={vague(78)} stroke={T.orClair} />
											<path class="onda" style="--s:-1" d={vague(96)} stroke={BLANC} />
											<path class="onda" style="--s:1" d={vague(114)} stroke={T.orClair} />
										{/if}
									</svg>
								{/if}
								<p class="etiq-teula"><span class="n">{t.n}</span><span class="t">{t.nom}</span><span class="vh">, {t.mot} : {t.glosa}</span></p>
							</div>
						</div>
					</li>
				{/each}
			</ol>
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
	.vh {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* ---- la piste : une hauteur de plusieurs écrans, dans laquelle la scène reste collée ---- */
	.piste {
		position: relative;
	}
	.piste.vivant {
		height: 420svh;
	}
	.scene {
		--p: 1; /* sans JavaScript, ou en version légère : tout est posé */
		--reserve: 8rem; /* de la hauteur d'écran, ce qui n'est pas pour la mosaïque */
		/* la mosaïque prend la hauteur disponible, sans pousser le cartel hors de l'écran */
		--larg-mur: min(calc((100svh - var(--reserve)) / 1.28), calc(100vw - 2 * var(--marge) - 21rem));
		position: relative;
		display: grid;
		grid-template-columns: minmax(15rem, 25rem) auto;
		justify-content: center;
		align-items: center;
		gap: clamp(1.5rem, 5vw, 5rem);
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

	/* ---- le cartel : le numéro, le nom en grand, le symbole ---- */
	.cartel {
		position: relative;
		z-index: 3;
		min-height: 11rem;
	}
	.fiche {
		animation: arriba 0.28s cubic-bezier(0.2, 0.7, 0.3, 1) both;
	}
	@keyframes arriba {
		from {
			opacity: 0;
			transform: translateY(0.6rem);
		}
	}
	.fiche p {
		margin: 0;
	}
	.rang {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 1rem;
		font-variant-numeric: tabular-nums;
		color: var(--t-tinta-2);
	}
	.coin {
		width: 0.85em;
		height: 0.85em;
		background: var(--fond);
	}
	.titre {
		margin-top: 0.5rem !important;
		font-family: var(--font-heading);
		font-size: clamp(2.4rem, 4.6vw, 4.2rem);
		line-height: 1;
	}
	.simbol {
		display: grid;
		gap: 0.15rem;
		margin-top: 1rem !important;
		font-size: clamp(1.05rem, 1.4vw, 1.25rem);
		line-height: 1.35;
	}
	.simbol span {
		color: var(--t-tinta-2);
	}

	/* ---- la mosaïque : neuf cases au filet fin, neuf tuiles de papier qui viennent les remplir ---- */
	.mur {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 4px;
		width: var(--larg-mur);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.cas {
		/* avancement propre à la tuile : q (0 → 1), puis « ce qui reste à faire » i (1 → 0), freinage doux */
		--q: clamp(0, (var(--p) - var(--ini)) / var(--dur), 1);
		--k: calc(1 - var(--q));
		--i: calc(var(--k) * var(--k));
		/* le dessin se construit dans la seconde moitié de la pose : j (1 → 0), freinage doux */
		--jl: calc(1 - clamp(0, (var(--q) - 0.45) / 0.55, 1));
		--j: calc(var(--jl) * var(--jl));
		position: relative;
		border-radius: 3px;
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--t-tinta) 14%, transparent);
	}
	.teula {
		position: relative;
		height: 100%;
		border-radius: inherit;
		/* la tuile apparaît dès qu'elle bouge, puis elle est pleine */
		opacity: clamp(0, var(--q) * 5, 1);
		transform: translate(calc(var(--dx) * var(--i) * 100%), calc(var(--dy) * var(--i) * 100%)) rotate(calc(var(--r0) * 1deg * var(--i)))
			scale(calc(1 + var(--sc) * var(--i)));
	}
	.vivant .teula {
		will-change: transform, opacity;
	}
	/* l'ombre du papier : longue quand la tuile est en l'air, courte quand elle est posée (comme les pièces du site) */
	.teula::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: var(--pc-ombre, rgb(0 0 0 / 0.3));
		filter: blur(3px);
		transform: translate(calc(var(--i) * 8px), calc(2px + var(--i) * 18px));
	}
	.face {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		container-type: inline-size;
		overflow: hidden;
		border-radius: inherit;
		background: var(--fond);
		color: var(--tinta);
	}
	.motiu {
		display: block;
		width: 100%;
		aspect-ratio: 1;
	}
	.crotz {
		box-sizing: border-box;
		padding: 12%;
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
	}
	.n {
		font-weight: 400;
		opacity: 0.72;
		font-variant-numeric: tabular-nums;
	}

	/* ---- le dessin qui se construit (mesures en unités du dessin : 120 de côté) ---- */
	/* monte du bas */
	.monta {
		transform: translateY(calc(var(--j) * var(--h) * 1px));
	}
	/* descend du haut */
	.davala {
		transform: translateY(calc(var(--j) * var(--h) * -1px));
	}
	/* glisse de côté (s : -1 depuis la gauche, 1 depuis la droite) */
	.lisa {
		transform: translateX(calc(var(--j) * var(--s) * 140px));
	}
	/* tourne sur place */
	.vira {
		transform-origin: 60px 60px;
		transform: rotate(calc(var(--j) * -135deg));
	}
	/* la vague : un trait épais qui glisse d'une longueur d'onde */
	.onda {
		fill: none;
		stroke-width: 7;
		transform: translateX(calc(var(--j) * var(--s) * 30px));
	}

	/* ---- téléphone : le cartel au-dessus, la mosaïque dessous ---- */
	@media (max-width: 720px) {
		.scene {
			--reserve: 16.5rem;
			--larg-mur: min(100%, calc((100svh - var(--reserve)) / 1.28));
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;
			align-content: center;
			gap: 1rem;
		}
		.scene.vivant {
			padding-top: 3.6rem;
			padding-bottom: 4.6rem; /* la barre du bas du site */
		}
		.cartel {
			width: 100%;
			min-height: 6.6rem;
		}
		.rang {
			font-size: 0.9rem;
		}
		.titre {
			margin-top: 0.2rem !important;
			font-size: 2.1rem;
		}
		.simbol {
			display: flex;
			flex-wrap: wrap;
			gap: 0 0.6em;
			margin-top: 0.45rem !important;
			font-size: 1rem;
		}
	}

	/* l'appareil demande moins de mouvement : tout est posé, la page ne se fige pas
	   (le JavaScript arrive au même résultat ; ceci vaut avant même qu'il ne le sache) */
	@media (prefers-reduced-motion: reduce) {
		.piste.vivant {
			height: auto;
		}
		.scene.vivant {
			position: relative;
			height: auto;
			padding-block: 4.5rem 3rem;
		}
		.fiche {
			animation: none;
		}
	}
</style>
