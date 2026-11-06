<script>
	// Essai (Romain, 06-11) : « décomposer l'image en lui donnant une
	// profondeur artificielle, avec un mouvement qui avance sur les éléments
	// distincts de la photo ». Chaque photo est découpée hors du site en
	// quatre plans selon la distance (carte de profondeur Depth Anything V2
	// Small ; derrière chaque plan, ce qu'il cache est reconstitué par
	// diffusion) : static/ensag/prigondor/<clau>-p0…p3.webp et <clau>.json.
	// Les plans sont posés en 3D (CSS, perspective) ; la caméra entre dans la
	// photo d'un élément à l'autre, du plus proche au plus lointain, et le mot
	// occitan se pose sur l'élément à chaque arrêt. Vue de départ : la photo
	// telle quelle (chaque plan est agrandi pour se projeter à sa place).
	import { onMount } from 'svelte';
	import { PAISATGES, MOTS } from '$lib/paisatges/paisatges.js';

	const CLAUS = ['vila-panorama', 'montanha-valada', 'mon-valentre'];
	const NOMS = ['La vila', 'La montanha', 'Lo pont'];
	const FOTOS = CLAUS.map((c) => PAISATGES.find((p) => p.clau === c));

	let causida = $state(0);
	let pausa = $state(false);
	let veirePlans = $state(false);
	let calme = $state(false);
	let info = $state(null); // le .json de la photo : seuils et profondeur des plans
	let vista = $state({ w: 1200, h: 800 });
	let mon = $state(); // le monde : ses plans bougent avec la caméra
	let eticeta = $state(null);
	let carregat = $state(false);

	const p = $derived(FOTOS[causida]);

	// ── réglages ──
	// relief et mouvement modérés : au-delà, on voit les zones reconstituées
	// derrière les plans proches
	const PROF = 0.45; // recul du plan le plus lointain (en fraction de la perspective)
	const AVANÇA = 0.34; // jusqu'où la caméra entre
	const LATERAL = 0.28; // part du décalage vers l'élément visé
	const T_MOU = 2800;
	const T_ARRÈST = 2600;
	const T_DEPART = 1400;
	const T_TORNAR = 3200;

	let carta = null; // carte de profondeur lue en JS (pour savoir à quel plan appartient un point)
	let camins = [];
	let t0 = 0, tPausa = 0, raf = 0;

	const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

	const persp = $derived(1.1 * Math.max(vista.w, vista.h));
	// la boîte de la photo : couvre l'écran, avec un peu de marge pour les déplacements
	const caissa = $derived.by(() => {
		const a = p.l / p.h, ra = vista.w / vista.h;
		const w = (ra > a ? vista.w : vista.h * a) * 1.06;
		return { w, h: w / a };
	});
	// plans à intervalles réguliers : deux plans voisins ne s’écartent jamais trop (moins de trous à combler)
	const zPlan = (k) => -(1 - k / 3) * PROF * persp;
	const escala = (z) => (persp - z) / persp;

	function plaDe(u, v) {
		if (!carta || !info) return 0;
		const x = Math.min(carta.w - 1, Math.round(u * (carta.w - 1))), y = Math.min(carta.h - 1, Math.round(v * (carta.h - 1)));
		const d = carta.data[(y * carta.w + x) * 4] / 255;
		return info.seuils.filter((s) => d >= s).length;
	}

	// position (avant caméra) d'un point de la photo, posé sur son plan
	function punt(u, v) {
		const k = plaDe(u, v);
		const z = zPlan(k), s = escala(z);
		return [(u - 0.5) * caissa.w * s, (v - 0.5) * caissa.h * s, z];
	}

	const cargar = (src) =>
		new Promise((ok, ko) => {
			const i = new Image();
			i.onload = () => ok(i);
			i.onerror = ko;
			i.src = src;
		});

	async function cargarFoto(n) {
		carregat = false;
		const f = FOTOS[n];
		const [j, c] = await Promise.all([
			fetch(`/ensag/prigondor/${f.clau}.json`).then((r) => r.json()),
			cargar(`/ensag/prigondor/${f.clau}-prigondor.png`),
			...[0, 1, 2, 3].map((k) => cargar(`/ensag/prigondor/${f.clau}-p${k}.webp`))
		]);
		if (n !== causida) return;
		const cv = document.createElement('canvas');
		cv.width = c.width;
		cv.height = c.height;
		const x = cv.getContext('2d', { willReadFrequently: true });
		x.drawImage(c, 0, 0);
		carta = { w: cv.width, h: cv.height, data: x.getImageData(0, 0, cv.width, cv.height).data };
		info = j;
		// du plus proche au plus lointain : on avance dans la photo
		camins = f.mots
			.map(([oc, u, v]) => ({ oc, u, v, k: plaDe(u, v) }))
			.sort((a, b) => b.k - a.k || b.v - a.v);
		t0 = performance.now();
		tPausa = 0;
		eticeta = null;
		carregat = true;
		if (figat !== null) setTimeout(() => pintar(figat), 50);
	}

	// la caméra au temps t : { x, y, f (avancée), pas, arribat }
	function camera(t) {
		const n = camins.length;
		const cicle = T_DEPART + n * (T_MOU + T_ARRÈST) + T_TORNAR;
		let r = t % cicle;
		const arrests = [[0, 0, 0]];
		// le plan du fond doit toujours couvrir l'écran : le décalage est borné
		const z0 = zPlan(0), s0 = escala(z0);
		const borna = (f, mitat, vist) => Math.max(0, mitat * s0 - vist / 2 / (persp / (persp - z0 - f)) - 4);
		camins.forEach((m, i) => {
			const [x, y] = punt(m.u, m.v);
			const f = (AVANÇA * persp * (i + 1)) / n;
			const bx = borna(f, caissa.w / 2, vista.w), by = borna(f, caissa.h / 2, vista.h);
			arrests.push([Math.max(-bx, Math.min(bx, x * LATERAL)), Math.max(-by, Math.min(by, y * LATERAL)), f]);
		});
		if (r < T_DEPART) return { c: arrests[0], pas: -1, arribat: false };
		r -= T_DEPART;
		for (let k = 0; k < n; k++) {
			if (r < T_MOU) {
				const s = ease(r / T_MOU), a = arrests[k], b = arrests[k + 1];
				return { c: a.map((v, i) => v + (b[i] - v) * s), pas: k, arribat: false };
			}
			r -= T_MOU;
			if (r < T_ARRÈST) {
				// une dérive lente pendant l'arrêt : l'image ne fige pas
				const q = arrests[k + 1], dv = r / T_ARRÈST;
				return { c: [q[0], q[1], q[2] + dv * 0.02 * persp], pas: k, arribat: true };
			}
			r -= T_ARRÈST;
		}
		const a = arrests[n], s = ease(Math.min(1, r / T_TORNAR));
		const de = [a[0], a[1], a[2] + 0.02 * persp];
		return { c: de.map((v, i) => v + (arrests[0][i] - v) * s), pas: -1, arribat: false };
	}

	// ?temps=12000 : la caméra figée à cet instant (contrôle image par image)
	let figat = null;

	function anim(ara) {
		raf = requestAnimationFrame(anim);
		if (!carregat || !mon) return;
		if (pausa && !tPausa) tPausa = ara - t0;
		pintar(pausa ? tPausa : ara - t0);
	}

	function pintar(t) {
		if (figat !== null) t = figat;
		// mouvement réduit : la photo ne bouge pas, les mots se montrent l'un après l'autre
		const cam = calme ? { c: [0, 0, 0], pas: Math.floor(t / 4500) % camins.length, arribat: true } : camera(t);
		const [cx, cy, f] = cam.c;
		mon.style.transform = `translate3d(${-cx}px, ${-cy}px, ${f}px)`;
		if (cam.arribat) {
			const m = camins[cam.pas];
			const [x, y, z] = punt(m.u, m.v);
			const e = persp / (persp - (z + f));
			// le mot reste dans l'écran, sous la barre du haut (un nuage tout en haut, par exemple)
			const px = Math.max(60, Math.min(vista.w - 60, vista.w / 2 + (x - cx) * e));
			const py = Math.max(110, Math.min(vista.h - 110, vista.h / 2 + (y - cy) * e));
			if (!eticeta || eticeta.oc !== m.oc) eticeta = { oc: m.oc, fr: MOTS[m.oc], x: px, y: py, esquerra: px > vista.w * 0.62 };
			else {
				eticeta.x = px;
				eticeta.y = py;
			}
		} else if (eticeta) eticeta = null;
	}

	onMount(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const q = new URLSearchParams(location.search);
		if (q.has('temps')) figat = Number(q.get('temps')) || 0;
		if (q.has('foto')) causida = Math.max(0, Math.min(FOTOS.length - 1, Number(q.get('foto')) || 0));
		const mida = () => (vista = { w: innerWidth, h: innerHeight });
		mida();
		addEventListener('resize', mida);
		cargarFoto(causida);
		raf = requestAnimationFrame(anim);
		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('resize', mida);
		};
	});

	function causir(n) {
		if (n === causida) return;
		causida = n;
		cargarFoto(n);
	}
	function bascularPausa() {
		if (pausa) {
			t0 = performance.now() - tPausa;
			tPausa = 0;
		}
		pausa = !pausa;
	}
</script>

<svelte:head>
	<title>Profondeur (essai) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="espaci">
	<div class="scena" style:perspective="{persp}px" role="img" aria-label={p.alt}>
		<div class="mon" bind:this={mon} style:width="{caissa.w}px" style:height="{caissa.h}px" style:margin-left="{-caissa.w / 2}px" style:margin-top="{-caissa.h / 2}px">
			{#if info && info.clau === p.clau}
				{#each info.plans as pl (pl.k)}
					{@const z = zPlan(pl.k)}
					<img
						class="pla"
						class:separat={veirePlans}
						src="/ensag/prigondor/{p.clau}-p{pl.k}.webp"
						alt=""
						style:transform="translateZ({z}px) scale({escala(z)})"
						style:--k={pl.k}
						draggable="false"
					/>
				{/each}
			{/if}
		</div>
	</div>

	{#if eticeta}
		{#key eticeta.oc}
			<div class="eticeta" class:fixa={figat !== null} class:esquerra={eticeta.esquerra} style:left="{eticeta.x}px" style:top="{eticeta.y}px">
				<span class="punt" aria-hidden="true"></span>
				<span class="tros">
					<span class="nom" lang="oc">{eticeta.oc}</span>
					<span class="def" lang="fr">{eticeta.fr}</span>
				</span>
			</div>
		{/key}
	{/if}

	<header class="barra">
		<a class="tornar" href="/apren/remira">‹ Remira</a>
		<p class="titol">Profondeur <span>(essai)</span></p>
		<div class="fotos" role="group" aria-label="Photo">
			{#each FOTOS as f, n (f.clau)}
				<button type="button" aria-pressed={n === causida} onclick={() => causir(n)} lang="oc">{NOMS[n]}</button>
			{/each}
		</div>
		<div class="accions">
			<button type="button" aria-pressed={veirePlans} onclick={() => (veirePlans = !veirePlans)}>Voir les plans</button>
			<button type="button" onclick={bascularPausa}>{pausa ? 'Reprendre' : 'Pause'}</button>
		</div>
	</header>
	<p class="sr" aria-live="polite">{#if eticeta}<span lang="oc">{eticeta.oc}</span> : <span lang="fr">{eticeta.fr}</span>{/if}</p>
</main>

<style>
	.espaci {
		position: fixed;
		inset: 0;
		z-index: 10;
		overflow: hidden;
		background: #22100a;
		container-type: inline-size;
		color: #f7f3ee;
	}
	.scena {
		position: absolute;
		inset: 0;
		overflow: hidden;
		perspective-origin: 50% 50%;
	}
	.mon {
		position: absolute;
		left: 50%;
		top: 50%;
		transform-style: preserve-3d;
		will-change: transform;
	}
	.pla {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		user-select: none;
		backface-visibility: hidden;
		transition: filter 0.4s;
	}
	/* « Voir les plans » : chaque plan teinté, pour voir le découpage */
	.pla.separat {
		filter: sepia(1) hue-rotate(calc(var(--k) * 70deg)) saturate(2.2) brightness(0.9);
	}
	.barra {
		position: absolute;
		inset: 0 0 auto;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1.5rem;
		padding: 0.75rem clamp(0.75rem, 3vw, 2rem);
		background: linear-gradient(rgba(20, 10, 6, 0.72), rgba(20, 10, 6, 0));
	}
	.tornar {
		color: #f7f3ee;
		text-decoration: none;
	}
	.titol {
		margin: 0;
		font-weight: 700;
	}
	.titol span {
		font-weight: 400;
		opacity: 0.75;
	}
	.fotos,
	.accions {
		display: flex;
		gap: 0 1rem;
	}
	.accions {
		margin-inline-start: auto;
	}
	button {
		min-height: 2.75rem;
		padding: 0.3rem 0;
		border: none;
		border-bottom: 2px solid rgba(247, 243, 238, 0.3);
		background: none;
		font: inherit;
		color: #f7f3ee;
		cursor: pointer;
	}
	button[aria-pressed='true'] {
		border-bottom-color: #ffd47f;
		font-weight: 600;
	}
	/* téléphone : la barre tient sur deux lignes et laisse voir la photo */
	@container (max-width: 34rem) {
		.titol {
			display: none;
		}
		.barra {
			gap: 0 1rem;
			padding-block: 0.4rem;
		}
	}
	button:focus-visible,
	.tornar:focus-visible {
		outline: 3px solid #ffd47f;
		outline-offset: 2px;
	}

	/* le mot, posé sur l'élément : un point, la tuile, le français dessous */
	.eticeta {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		translate: -0.45rem -50%;
		pointer-events: none;
		animation: venir 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.eticeta.esquerra {
		flex-direction: row-reverse;
		translate: calc(-100% + 0.45rem) -50%;
	}
	.punt {
		flex: none;
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 50%;
		border: 1.5px solid #ffd47f;
		box-shadow: 0 0 0 1.5px rgba(4, 9, 11, 0.5);
	}
	.tros {
		display: grid;
		justify-items: start;
		gap: 0.2rem;
	}
	.esquerra .tros {
		justify-items: end;
	}
	.nom {
		padding: 0.15em 0.55em;
		border-radius: 0.1em;
		background: #efe1c6;
		color: #2a1a10;
		font-size: clamp(1.2rem, 2.4vw, 1.8rem);
		font-weight: 700;
		line-height: 1.25;
	}
	.def {
		padding: 0.1em 0.5em;
		border-radius: 0.1em;
		background: rgba(8, 15, 17, 0.72);
		font-size: clamp(0.9rem, 1.6vw, 1.1rem);
		font-style: italic;
	}
	@keyframes venir {
		from {
			opacity: 0;
		}
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	.eticeta.fixa {
		animation: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.eticeta {
			animation: none;
		}
	}
</style>
