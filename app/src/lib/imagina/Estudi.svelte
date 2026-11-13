<script>
	// Une photo de l'atelier S'imagina, ses endroits repérés et l'esquisse posée (essai du 2026-11-13).
	// Le dessin est fait à plat (esquissa.js) puis couché sur le mur par matrix3d : les quatre coins viennent de la
	// perspective mesurée (atelier.js). Les repères des endroits sont des boutons : un tracé fin en tirets sur la
	// photo, un numéro, et une cible d'au moins 44 px.
	import { matrix3d } from './perspectiva.js';
	import { esquissa, fugas } from './esquissa.js';

	let {
		foto,
		quads,
		causit = null, // id de l'endroit choisi
		mot = null,
		estil = 'traç',
		mesura = null, // mesure du texte (canevas) ; sans elle, pas d'esquisse (rendu serveur, polices pas prêtes)
		interactiu = true,
		eager = false,
		aprochar = false, // téléphone : la photo s'approche de l'endroit choisi
		onchausir = () => {},
		onesquissa = () => {}
	} = $props();

	let larg = $state(0);
	const naut = $derived(larg * (foto.h / foto.l));
	let survol = $state(null);

	const px = (q) => q.map(([x, y]) => [x * larg, y * naut]);
	const centre = (q) => [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4];
	const caissa = (q) => {
		const xs = q.map((p) => p[0]),
			ys = q.map((p) => p[1]);
		return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
	};
	const ponchs = (q) => q.map(([x, y]) => `${x * foto.l},${y * foto.h}`).join(' ');

	const endrech = $derived(foto.endrechs.find((e) => e.id === causit) ?? null);
	const quad = $derived(endrech ? quads[endrech.id] : null);

	// l'approche : un agrandissement centré sur l'endroit (au plus 2,4 fois), sans sortir de la photo
	const vista = $derived.by(() => {
		if (!aprochar || !quad || !larg) return { k: 1, tx: 0, ty: 0 };
		const [x0, y0, x1, y1] = caissa(px(quad.quad));
		const k = Math.max(1, Math.min(2.4, (0.72 * larg) / (x1 - x0), (0.6 * naut) / (y1 - y0)));
		const cx = (x0 + x1) / 2,
			cy = (y0 + y1) / 2;
		const tx = Math.min(0, Math.max(larg - larg * k, larg / 2 - cx * k)),
			ty = Math.min(0, Math.max(naut - naut * k, naut / 2 - cy * k));
		return { k, tx, ty };
	});

	// largeur de la surface à l'écran (avant l'approche) : moyenne des arêtes haute et basse
	const flatL = $derived.by(() => {
		if (!quad || !larg) return 0;
		const q = px(quad.quad);
		return Math.max(24, (Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]) + Math.hypot(q[2][0] - q[3][0], q[2][1] - q[3][1])) / 2);
	});

	const esq = $derived.by(() => {
		if (!quad || !mot || !mesura || !flatL) return null;
		// la finesse des traits se règle sur la taille vue, approche comprise
		return esquissa({ estil, mot, prop: quad.proporcion, px: 1000 / (flatL * vista.k), mesura, cobrir: !!endrech.cobrir, remplaça: !!endrech.remplaça });
	});
	$effect(() => onesquissa(esq));

	const transform = $derived(esq ? matrix3d(flatL, flatL * (esq.H / esq.W), px(quad.quad)) : 'none');
	const clauEsq = $derived(`${foto.clau}-${causit}-${estil}-${mot?.oc}`);
</script>

<div class="estudi" bind:clientWidth={larg}>
	<div class="camp" style="transform: translate({vista.tx}px, {vista.ty}px) scale({vista.k})">
	<img
		src={foto.src}
		alt={foto.alt}
		width={foto.l}
		height={foto.h}
		loading={eager ? 'eager' : 'lazy'}
		decoding="async"
		draggable="false"
	/>

	<!-- les repères et, pour le calque, les lignes de fuite : dans le repère de la photo -->
	<svg class="reperes" viewBox="0 0 {foto.l} {foto.h}" preserveAspectRatio="none" aria-hidden="true">
		{#if esq?.fuga}
			{#key clauEsq}
				<g class="fugas">
					{#each fugas(quad.quad) as [x1, y1, x2, y2], i (i)}
						<line
							x1={x1 * foto.l}
							y1={y1 * foto.h}
							x2={x2 * foto.l}
							y2={y2 * foto.h}
							style="animation-delay: {0.5 + 0.06 * i}s; stroke-dasharray: {(5 * foto.l) / larg / vista.k} {(4 * foto.l) / larg / vista.k}"
						/>
					{/each}
				</g>
			{/key}
		{/if}
		{#if interactiu}
			{#each foto.endrechs as e, i (e.id)}
				{@const q = quads[e.id].quad}
				{#if !(esq && e.id === causit)}
					<polygon class="contorn" class:actiu={e.id === causit || e.id === survol} points={ponchs(q)} />
					<polygon class="trach" class:actiu={e.id === causit || e.id === survol} points={ponchs(q)} />
					<text
						class="num"
						x={q[0][0] * foto.l + 8 / vista.k}
						y={q[0][1] * foto.h - 10 / vista.k}
						style="font-size: {34 / vista.k}px; stroke-width: {6 / vista.k}px">{i + 1}</text
					>
				{/if}
			{/each}
		{/if}
	</svg>

	{#if esq}
		{#key clauEsq}
			<div class="plat" style="width: {flatL}px; height: {flatL * (esq.H / esq.W)}px; transform: {transform}">
				<svg viewBox="0 0 {esq.W} {esq.H}" preserveAspectRatio="none" aria-hidden="true">
					{#each esq.formas as f, i (i)}
						{#if f.t === 'rect'}
							<rect
								class:tr={f.traçar}
								class:pa={f.pausar}
								x={f.x}
								y={f.y}
								width={f.l}
								height={f.h}
								rx={f.r}
								fill={f.fons ? `var(--imagina-${f.fons})` : 'none'}
								stroke={f.trach ? `var(--imagina-${f.trach})` : 'none'}
								stroke-width={f.espes ?? 0}
								opacity={f.opacitat ?? 1}
								pathLength={f.traçar ? 1 : undefined}
								style="animation-delay: {f.retard ?? 0}s"
							/>
						{:else if f.t === 'ponch'}
							<circle class="po" cx={f.x} cy={f.y} r={f.r} fill="var(--imagina-{f.fons})" style="animation-delay: {f.retard}s" />
						{:else if f.t === 'linha'}
							<line
								class="tr"
								x1={f.x1}
								y1={f.y1}
								x2={f.x2}
								y2={f.y2}
								stroke="var(--imagina-{f.trach})"
								stroke-width={f.espes}
								stroke-linecap="round"
								pathLength="1"
								style="animation-delay: {f.retard}s"
							/>
						{:else if f.t === 'text'}
							<text
								class:tt={f.traçar}
								class:pa={f.pausar}
								x={f.x}
								y={f.y}
								text-anchor={f.ancra === 'start' ? 'start' : 'middle'}
								font-family={f.familha === 'limelight' ? 'Limelight, Georgia, serif' : 'Luciole, system-ui, sans-serif'}
								font-weight={f.pes}
								font-style={f.estil ?? 'normal'}
								font-size={f.talha}
								fill="var(--imagina-{f.tinta})"
								stroke={f.contorn ? `var(--imagina-${f.tinta})` : 'none'}
								stroke-width={f.contorn || 0}
								stroke-linejoin="round"
								opacity={f.opacitat ?? 1}
								style="animation-delay: {f.retard ?? 0}s{f.traçar ? `, ${(f.retard ?? 0) + 1.1}s` : ''}; --dash: {f.talha * 5}"
								lang="oc">{f.text}</text
							>
						{/if}
					{/each}
				</svg>
			</div>
		{/key}
	{/if}

	{#if interactiu && larg}
		{#each foto.endrechs as e, i (e.id)}
			{@const [x0, y0, x1, y1] = caissa(px(quads[e.id].quad))}
			{@const [cx, cy] = centre(px(quads[e.id].quad))}
			{@const l = Math.max(44, x1 - x0)}
			{@const h = Math.max(44, y1 - y0)}
			<button
				type="button"
				class="endrech"
				style="left: {cx - l / 2}px; top: {cy - h / 2}px; width: {l}px; height: {h}px"
				aria-pressed={e.id === causit}
				aria-label="Endroit {i + 1} : {e.fr}"
				onclick={() => onchausir(e.id)}
				onpointerenter={() => (survol = e.id)}
				onpointerleave={() => (survol = null)}
				onfocus={() => (survol = e.id)}
				onblur={() => (survol = null)}
			></button>
		{/each}
	{/if}
	</div>
</div>

<style>
	.estudi {
		position: relative;
		overflow: hidden;
		line-height: 0;
		user-select: none;
		-webkit-user-select: none;
	}
	.camp {
		position: relative;
		transform-origin: 0 0;
		transition: transform 0.55s ease-in-out;
	}
	img {
		display: block;
		width: 100%;
		height: auto;
	}
	.reperes {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: visible;
	}
	/* un tracé en tirets, blanc sur un contour noir léger : lisible sur la pierre claire comme sur les arbres */
	.contorn {
		fill: none;
		stroke: var(--imagina-marca-fons);
		stroke-opacity: 0.45;
		stroke-width: 4;
		vector-effect: non-scaling-stroke;
	}
	.trach {
		fill: none;
		stroke: var(--imagina-marca);
		stroke-width: 1.5;
		stroke-dasharray: 6 5;
		vector-effect: non-scaling-stroke;
	}
	.trach.actiu {
		stroke-dasharray: none;
		stroke-width: 2;
	}
	.num {
		font: 700 34px var(--font-body);
		fill: var(--imagina-marca);
		stroke: var(--imagina-marca-fons);
		stroke-opacity: 0.55;
		stroke-width: 6px;
		paint-order: stroke;
	}
	.fugas line {
		stroke: var(--imagina-grafit);
		stroke-width: 1;
		stroke-opacity: 0.55;
		vector-effect: non-scaling-stroke;
		animation: apareisser 0.6s ease-out both;
	}
	.plat {
		position: absolute;
		left: 0;
		top: 0;
		transform-origin: 0 0;
		pointer-events: none;
	}
	.plat svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.endrech {
		position: absolute;
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.endrech:focus-visible {
		outline: 3px solid var(--t-aur-clar);
		outline-offset: 2px;
	}

	/* l'esquisse se trace : les traits se déroulent, les lettres s'écrivent puis se remplissent */
	.tr {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: traçar 0.9s ease-in-out forwards;
	}
	.tt {
		stroke-dasharray: var(--dash);
		stroke-dashoffset: var(--dash);
		fill-opacity: 0;
		animation:
			traçar 1.4s ease-in-out forwards,
			emplenar 0.5s ease-out forwards;
	}
	.po,
	.pa {
		animation: apareisser 0.45s ease-out both;
	}
	@keyframes traçar {
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes emplenar {
		from {
			fill-opacity: 0;
		}
		to {
			fill-opacity: 1;
		}
	}
	@keyframes apareisser {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.camp {
			transition: none;
		}
		.tr,
		.tt,
		.po,
		.pa,
		.fugas line {
			animation: none;
			stroke-dashoffset: 0;
			fill-opacity: 1;
		}
		.fugas line {
			opacity: 1;
		}
	}
</style>
