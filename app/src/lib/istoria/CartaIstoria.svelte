<script>
	// La carte qui suit le récit de « Mon ligam amb l'occitan » (Romain,
	// 2026-11-05) : à chaque chapitre, la caméra vole vers son lieu (on recule
	// pour voir les deux endroits, puis on plonge, comme dans Prezi), et un
	// projecteur se resserre sur la zone. Les points se cliquent : on va au
	// chapitre. Fond léger (≈ 15 Ko compressé), chargé quand la carte approche.
	// Données : etapas.js (lieux, étapes) ; fond : carta-fons.js (généré).
	import { onMount } from 'svelte';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { LUÒCS, ETAPAS, etapaDe, vol, escalaRedona } from './etapas.js';

	/** racina : l'élément qui contient les chapitres, marqués data-etapa={clé} ;
	 *  actiu : le chapitre en cours de lecture (lecture guidée : la page le fait
	 *  ressortir), même s'il n'a pas d'étape sur la carte */
	let { racina, actiu = $bindable(null) } = $props();

	const KM = 1.112; // km par unité (1/100 de degré de latitude)
	const fontsTèxt = { oc: 'Fonts', fr: 'Sources', es: 'Fuentes', en: 'Sources', ca: 'Fonts', ar: 'المصادر' };

	let el = $state();
	let W = $state(0);
	let H = $state(0);
	let fons = $state(null);
	let estelas = $state([]);
	let luòcsOc = []; // les lieux d'Occitània, pour les repères discrets
	let cam = $state([0, 0, 800]);
	let etapa = $state('debuta');
	let arribada = $state(0);
	let banda = $state(false);
	let P = null;
	let redusit = false;

	const proj = (lon, lat) => [(lon - P.lon0) * Math.cos((P.lat0 * Math.PI) / 180) * P.k, (P.lat0 - lat) * P.k];
	const camDe = (e) => [...proj(e.c[0], e.c[1]), (2 * e.r) / KM];

	// échelle (pixels par unité), cadre visible, et passage carte → écran
	let s = $derived(W && H ? Math.min(W, H) / cam[2] : 1);
	let vista = $derived(`${cam[0] - W / (2 * s)} ${cam[1] - H / (2 * s)} ${W / s} ${H / s}`);
	const ecran = (x, y) => [(x - cam[0]) * s + W / 2, (y - cam[1]) * s + H / 2];

	let e = $derived(ETAPAS[etapa] ?? ETAPAS.debuta);
	// marge sans repère ni point secondaire : les bords de la carte s'estompent
	let marge = $derived(banda ? 28 : 64);
	let punts = $derived(
		fons
			? Object.entries(LUÒCS).map(([id, l]) => {
					const [x, y] = proj(l.lon, l.lat);
					const [px, py] = ecran(x, y);
					const actiu = e.focus?.[0] === id || e.luòcs?.includes(id);
					const dins = px > marge && py > marge && px < W - marge && py < H - marge;
					return {
						id,
						...l,
						px,
						py,
						vist: (l.zona ? e.zona === id : true) && (actiu || dins),
						actiu,
						focus: e.focus?.[0] === id,
						segond: e.segond === id
					};
				})
			: []
	);
	let projector = $derived.by(() => {
		if (!fons || !e.focus) return null;
		const l = LUÒCS[e.focus[0]];
		const [px, py] = ecran(...proj(l.lon, l.lat));
		return { px, py, r: (e.focus[1] / KM) * s };
	});
	// une étape sans point (le domaine occitan) : son nom au milieu de l'aplat,
	// le même que celui écrit au-dessus du chapitre
	// et le nom d'une langue sur son aplat (lenga catalana : Romain, 05-11)
	let etiquetas = $derived.by(() => {
		if (!fons) return [];
		const out = [];
		if (e.lòc && !e.focus) out.push({ nom: e.lòc, xy: e.c, lenga: false });
		if (e.lenga) out.push({ nom: e.lenga[0], xy: [e.lenga[1], e.lenga[2]], lenga: true });
		return out.map((t) => {
			const [px, py] = ecran(...proj(t.xy[0], t.xy[1]));
			return { ...t, px, py };
		});
	});
	let arc = $derived.by(() => {
		if (!fons || !e.arc) return null;
		const [a, b] = e.arc.map((id) => ecran(...proj(LUÒCS[id].lon, LUÒCS[id].lat)));
		const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.22;
		const my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.22;
		return `M${a[0]} ${a[1]}Q${mx} ${my} ${b[0]} ${b[1]}`;
	});
	// quelques villes autour, en petit, pour se repérer quand on zoome : les
	// grandes villes d'abord, sans chevauchement, jamais sur un point du récit
	let repèris = $derived.by(() => {
		if (!fons || !W) return [];
		const rKm = (cam[2] * KM) / 2;
		if (rKm > 520) return [];
		// autour d'un point du récit, une large zone libre (Joan, 05-11 : Latas
		// collait à Montpelhièr)
		const caixas = punts
			.filter((p) => p.vist)
			.map((p) => (p.actiu ? [p.px - 44, p.py - 40, p.px + 44 + p.nom.length * 8.5, p.py + 40] : [p.px - 16, p.py - 18, p.px + 16 + p.nom.length * 8, p.py + 18]));
		for (const t of etiquetas) caixas.push([t.px - 90, t.py - 30, t.px + 90, t.py + 30]);
		const out = [];
		const max = e.estelas ? 6 : banda ? 8 : 11;
		for (const l of luòcsOc) {
			if (!l.vila && rKm > 130) continue;
			const [px, py] = ecran(...l.xy);
			if (px < marge || py < marge || px > W - marge - 90 || py > H - marge) continue;
			const c = [px - 10, py - 12, px + 16 + l.nom.length * 7.2, py + 12];
			if ([...caixas].some((b) => c[0] < b[2] && c[2] > b[0] && c[1] < b[3] && c[3] > b[1])) continue;
			caixas.push(c);
			out.push({ nom: l.nom, px, py });
			if (out.length >= max) break;
		}
		return out;
	});
	let escala = $derived.by(() => {
		const kmPx = KM / s;
		const km = escalaRedona(130 * kmPx);
		return { km, px: km / kmPx };
	});

	let anim = 0;
	function anarA(id, dirècte = false) {
		const et = ETAPAS[id];
		if (!et || !P) return;
		const fin = camDe(et);
		cancelAnimationFrame(anim);
		if (dirècte || redusit || !W) {
			cam = fin;
			return;
		}
		const f = vol(cam, fin);
		const dur = Math.min(2600, Math.max(800, f.duracion * 0.9));
		const t0 = performance.now();
		const pas = (t) => {
			let k = Math.min(1, (t - t0) / dur);
			k = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
			cam = f(k);
			if (k < 1) anim = requestAnimationFrame(pas);
		};
		anim = requestAnimationFrame(pas);
	}

	const capitols = () => [...(racina?.querySelectorAll('[data-etapa]') ?? [])];
	// la ligne de lecture : au milieu de l'écran, sous la carte au téléphone
	const linha = () => innerHeight * (banda ? 0.68 : 0.5);

	function calcular() {
		if (!el) return;
		banda = el.getBoundingClientRect().width > innerWidth * 0.8;
		let id = 'debuta';
		let lec = null;
		const cs = capitols();
		for (const c of cs) {
			if (c.getBoundingClientRect().top >= linha()) break;
			lec = c.dataset.etapa;
			if (ETAPAS[lec]) id = lec;
		}
		// le dernier chapitre reste actif jusqu'à ce qu'on l'ait quitté
		const fin = cs.at(-1);
		if (lec && fin && lec === fin.dataset.etapa && fin.getBoundingClientRect().bottom < innerHeight * 0.2) lec = null;
		actiu = lec;
		if (id !== etapa) {
			etapa = id;
			arribada++;
			anarA(id);
		}
	}

	function anarAuLuòc(luòc) {
		const id = etapaDe(luòc, capitols().map((c) => c.dataset.etapa)) ?? 'debuta';
		const c = id === 'debuta' ? null : racina.querySelector(`[data-etapa="${id}"]`);
		const y = c ? c.getBoundingClientRect().top + scrollY - linha() + 24 : (racina.getBoundingClientRect().top + scrollY - innerHeight * 0.9);
		scrollTo({ top: Math.max(0, y), behavior: redusit ? 'auto' : 'smooth' });
	}

	onMount(() => {
		redusit = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const ro = new ResizeObserver(([r]) => {
			W = r.contentRect.width;
			H = r.contentRect.height;
		});
		ro.observe(el);

		let pendent = false;
		const onScroll = () => {
			if (pendent) return;
			pendent = true;
			requestAnimationFrame(() => {
				pendent = false;
				calcular();
			});
		};

		// on charge le fond quand la carte approche de l'écran
		const io = new IntersectionObserver(
			async ([en]) => {
				if (!en.isIntersecting || fons) return;
				io.disconnect();
				const [f, { LUOCS }] = await Promise.all([import('./carta-fons.js'), import('$lib/acuelh/carta-estelas.js')]);
				P = f.PROJ;
				estelas = LUOCS.map(([lon, lat], i) => [...proj(lon, lat), (i * 37) % 900]);
				// pas de repère qui recoupe le récit (lieux du récit, et la ville de la
				// famille, qu'on ne nomme pas : Romain, 05-11), ni Valença (Drôme), qu'on
				// confondrait avec Valéncia (Joan, 05-11)
				const tirats = new Set(['Montpelhièr', "Clarmont d'Erau", 'Valença']);
				luòcsOc = LUOCS.filter(([, , nom]) => !tirats.has(nom)).map(([lon, lat, nom, vila]) => ({ nom, vila, xy: proj(lon, lat) }));
				fons = f;
				calcular();
				anarA(etapa, true);
				addEventListener('scroll', onScroll, { passive: true });
				addEventListener('resize', onScroll);
			},
			{ rootMargin: '600px 0px' }
		);
		io.observe(el);

		return () => {
			ro.disconnect();
			io.disconnect();
			cancelAnimationFrame(anim);
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
		};
	});
</script>

<div class="carta" class:banda class:prèsta={fons} class:lum={e.estelas} bind:this={el} aria-hidden="true">
	{#if fons && W}
		<svg class="mapa" viewBox={vista} preserveAspectRatio="xMidYMid meet">
			<path class="terra" d={fons.TERRA} />
			<path class="domeni occitan" class:vist={e.domenis?.includes('occitan')} d={fons.OCCITAN} />
			<path class="domeni catalan" class:vist={e.domenis?.includes('catalan')} d={fons.CATALAN} />
			<path class="zona" class:vist={e.zona === 'erau'} d={fons.ERAU} />
			<path class="frontieras" d={fons.FRONTIERAS} />
			<g class="estelas" class:vist={e.estelas}>
				{#each estelas as [x, y, d], i (i)}<path d="M{x} {y}h0" style:--d="{d}ms" />{/each}
			</g>
		</svg>

		<svg class="dessús" width={W} height={H}>
			<defs>
				<!-- un bord doux : le noir du centre se fond dans le blanc -->
				<radialGradient id="carta-iris">
					<stop offset="0.62" stop-color="black" />
					<stop offset="1" stop-color="white" />
				</radialGradient>
				<mask id="carta-projector">
					<rect width={W} height={H} fill="white" />
					{#if projector}
						{#key arribada}<circle class="iris" cx={projector.px} cy={projector.py} r={projector.r * 1.5} fill="url(#carta-iris)" />{/key}
					{/if}
				</mask>
			</defs>
			<rect class="ombra" class:vist={projector} width={W} height={H} mask="url(#carta-projector)" />
			<!-- un filet d'or qui se resserre sur la zone -->
			{#if projector}{#key arribada}<circle class="iris cèrcle" cx={projector.px} cy={projector.py} r={projector.r} />{/key}{/if}
			{#if arc}{#key arribada}<path class="arc" d={arc} pathLength="1" />{/key}{/if}
		</svg>

		{#each etiquetas as t (t.nom + arribada)}<span class="etiqueta" class:lenga={t.lenga} lang="oc" style:transform="translate({t.px}px, {t.py}px)">{t.nom}</span>{/each}
		{#each repèris as v (v.nom)}<span class="repèri" lang="oc" style:transform="translate({v.px}px, {v.py}px)">{v.nom}</span>{/each}

		{#each punts as p (p.id)}
			<button
				type="button"
				tabindex="-1"
				class="punt"
				class:zona={p.zona}
				class:vist={p.vist}
				class:actiu={p.actiu}
				class:focus={p.focus}
				class:segond={p.segond}
				style:transform="translate({p.px}px, {p.py}px)"
				onclick={() => anarAuLuòc(p.id)}
			>
				{#if !p.zona}<span class="ponch">{#if p.focus || p.segond}{#key arribada}<span class="anèl"></span>{/key}{/if}</span>{/if}
				<span class="nom" lang="oc">{p.nom}</span>
			</button>
		{/each}

		<div class="escala" style:--px="{escala.px}px"><span></span>{escala.km} km</div>
		<p class="fonts">{tria(fontsTèxt)} : Natural Earth · IGN · Occitanica · © OpenStreetMap</p>
	{/if}
</div>

<style>
	.carta {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		opacity: 0;
		transition: opacity 0.8s ease;
		font-family: var(--font-body);
	}
	.carta.prèsta {
		opacity: 1;
	}
	/* grand écran : les bords de la carte se fondent dans la page, sur les quatre
	   côtés (pas de cadre) ; au téléphone, le bandeau est opaque et le fondu est
	   porté par la page */
	.carta:not(.banda) .mapa,
	.carta:not(.banda) .dessús {
		mask-image: linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent);
		mask-composite: intersect;
	}
	.carta.banda .fonts {
		top: 0.5rem;
		bottom: auto;
	}
	.mapa,
	.dessús {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.dessús {
		pointer-events: none;
	}

	/* aplats sans contour, frontières en pointillé très fin (règle des cartes) */
	.terra {
		fill: color-mix(in srgb, var(--t-tinta) 15%, transparent);
	}
	.domeni,
	.zona {
		fill-opacity: 0;
		transition: fill-opacity 0.9s ease;
	}
	.occitan {
		fill: var(--t-aur);
	}
	.catalan {
		fill: var(--t-terra);
	}
	.zona {
		fill: var(--t-aur);
	}
	.occitan.vist {
		fill-opacity: 0.16;
	}
	/* la fin du récit, la communauté : le domaine s'allume */
	.lum .occitan.vist {
		fill-opacity: 0.3;
	}
	.catalan.vist {
		fill-opacity: 0.24;
	}
	.zona.vist {
		fill-opacity: 0.2;
	}
	.frontieras {
		fill: none;
		stroke: color-mix(in srgb, var(--t-tinta) 45%, transparent);
		stroke-width: 0.9;
		stroke-dasharray: 1 3;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}
	.estelas path {
		stroke: var(--t-tinta);
		stroke-width: 2.4;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
		opacity: 0;
		transition: opacity 0.6s ease;
	}
	.estelas.vist path {
		opacity: 0.55;
		transition-delay: var(--d);
	}

	/* le projecteur : un voile léger hors de la zone (sans éteindre la carte :
	   Joan, 05-11), et un filet d'or qui se resserre sur elle */
	.ombra {
		fill: var(--t-fons);
		opacity: 0;
		transition: opacity 0.7s ease;
	}
	.ombra.vist {
		opacity: 0.3;
	}
	.cèrcle {
		fill: none;
		stroke: var(--t-aur);
		stroke-width: 1;
		opacity: 0.5;
	}
	.iris {
		transform-box: fill-box;
		transform-origin: center;
		animation: iris 1.4s var(--ease, cubic-bezier(0.19, 1, 0.22, 1)) both;
	}
	@keyframes iris {
		from {
			transform: scale(3.2);
		}
	}
	.arc {
		fill: none;
		stroke: var(--t-aur);
		stroke-width: 1.4;
		stroke-linecap: round;
		stroke-dasharray: 1;
		opacity: 0.75;
		animation: traçar 1.6s 0.3s ease-out both;
	}
	@keyframes traçar {
		from {
			stroke-dashoffset: 1;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	/* les points : un rond et son nom ; on clique pour aller au chapitre */
	.punt {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.5s ease;
		will-change: transform;
	}
	.punt.vist {
		opacity: 0.55;
		pointer-events: auto;
	}
	.punt.actiu {
		opacity: 1;
	}
	.ponch {
		position: relative;
		flex: none;
		width: 0.5rem;
		height: 0.5rem;
		margin-inline-start: -0.25rem;
		border-radius: 50%;
		background: var(--t-tinta);
		transition:
			background 0.4s ease,
			transform 0.4s ease;
	}
	.punt.focus .ponch,
	.punt.segond .ponch {
		background: var(--t-aur);
		transform: scale(1.35);
	}
	.anèl {
		position: absolute;
		inset: -0.35rem;
		border: 1px solid var(--t-aur);
		border-radius: 50%;
		animation: anèl 1.3s 0.5s ease-out both;
	}
	.punt.segond .anèl {
		animation-delay: 1.4s;
	}
	@keyframes anèl {
		from {
			transform: scale(4);
			opacity: 0;
		}
		40% {
			opacity: 1;
		}
		to {
			transform: scale(1);
			opacity: 0.9;
		}
	}
	.nom {
		font-size: 0.82rem;
		line-height: 1;
		white-space: nowrap;
		text-shadow:
			0 0 6px var(--t-fons),
			0 0 2px var(--t-fons);
	}
	.punt.focus .nom {
		color: var(--t-aur);
		font-weight: 700;
	}
	.punt.zona .nom {
		transform: translateX(-50%);
		font-style: italic;
		letter-spacing: 0.06em;
	}
	.punt:hover .nom {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.repèri {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: -0.4rem;
		font-size: 0.78rem;
		line-height: 1;
		white-space: nowrap;
		color: color-mix(in srgb, var(--t-tinta) 72%, transparent);
		text-shadow:
			0 0 3px var(--t-fons),
			0 0 1px var(--t-fons);
		pointer-events: none;
		animation: aparéisser 0.5s ease both;
	}
	.etiqueta {
		position: absolute;
		top: 0;
		left: 0;
		translate: -50% -50%;
		font-size: 1.05rem;
		font-style: italic;
		font-weight: 700;
		letter-spacing: 0.08em;
		line-height: 1;
		white-space: nowrap;
		color: var(--t-aur);
		text-shadow:
			0 0 8px var(--t-fons),
			0 0 2px var(--t-fons);
		pointer-events: none;
		animation: aparéisser 0.9s 0.4s ease both;
	}
	/* une langue, pas un lieu : en clair et plus petit, sans rouge en texte
	   sur le sombre (règle B) */
	.etiqueta.lenga {
		font-size: 0.92rem;
		font-weight: 400;
		letter-spacing: 0.1em;
		color: var(--t-tinta);
		animation-delay: 1s;
	}
	.repèri::before {
		content: '';
		width: 0.22rem;
		height: 0.22rem;
		margin-inline-start: -0.11rem;
		border-radius: 50%;
		background: currentColor;
	}
	@keyframes aparéisser {
		from {
			opacity: 0;
		}
	}

	.escala {
		position: absolute;
		inset-inline-start: 1rem;
		bottom: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.72rem;
		color: color-mix(in srgb, var(--t-tinta) 70%, transparent);
	}
	.escala span {
		width: var(--px);
		height: 0.3rem;
		border: 1px solid currentColor;
		border-top: 0;
		transition: width 0.2s linear;
	}
	.fonts {
		position: absolute;
		inset-inline-end: 1rem;
		bottom: 0.6rem;
		margin: 0;
		font-size: 0.7rem;
		color: color-mix(in srgb, var(--t-tinta) 62%, transparent);
	}
	/* grand écran : échelle et sources à gauche, loin du bouton « remonter » */
	.carta:not(.banda) .escala {
		bottom: 2.9rem;
		inset-inline-start: 1.5rem;
	}
	.carta:not(.banda) .fonts {
		bottom: 1.4rem;
		inset-inline-start: 1.5rem;
		inset-inline-end: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.iris,
		.arc,
		.etiqueta,
		.anèl {
			animation: none;
		}
	}
</style>
