<script>
	// « Ont es ? » (catalogue des exercices §3, priorité 4) : une ville est
	// nommée en français, l'élève la touche sur la carte du pays d'òc et
	// découvre son nom occitan. Un toucher à côté montre le nom français de la
	// ville touchée (on apprend aussi en se trompant). Fond de carte léger,
	// généré une fois (scripts/contorn-occitania.mjs), sans la carte du site.
	// Le toucher va à la ville la plus proche : sur téléphone, le doigt n'a
	// pas besoin d'être précis.
	//
	// block = { title, intro, items: [{ fr, oc, sound, lon, lat, cap, nota? }],
	//   choses?, lien?: { href, texte } }
	import { rich } from '$lib/lesson/rich.js';
	import { animat } from '$lib/actions/animarText.js';
	import { vista, proj, zonas } from '$lib/lesson/contorn-occitania.js';

	let { block, onCorrect = () => {}, onComplete = () => {}, onResult = () => {} } = $props();

	const punts = block.items.map((v) => ({
		...v,
		x: (v.lon - proj.x0) * proj.cosLat * proj.k,
		y: (proj.y1 - v.lat) * proj.k
	}));

	let trobats = $state([]); // index des villes trouvées, dans l'ordre
	let actual = $derived(trobats.length < punts.length ? trobats.length : null);
	let errors = $state(0);
	let bulle = $state(null); // { i, id } : nom français montré après une erreur
	let shake = $state(false);
	let svg = $state(null);
	let idBulle = 0;

	// Décalage de l'étiquette selon la place libre autour de la ville.
	const DECALATGE = { e: [15, 7, 'start'], o: [-15, 7, 'end'], n: [0, -15, 'middle'], s: [0, 28, 'middle'] };

	function causir(i) {
		if (actual === null) return;
		if (i === actual) {
			onCorrect();
			onResult({ choses: punts[i].choses ?? block.choses }, errors === 0);
			trobats.push(i);
			errors = 0;
			bulle = null;
			if (trobats.length === punts.length) onComplete();
			return;
		}
		if (trobats.includes(i)) return;
		errors += 1;
		idBulle += 1;
		bulle = { i, id: idBulle };
		const ceta = idBulle;
		setTimeout(() => {
			if (bulle?.id === ceta) bulle = null;
		}, 1800);
		shake = true;
		setTimeout(() => (shake = false), 300);
	}

	// Un toucher n'importe où sur la carte vise la ville la plus proche.
	function toucar(e) {
		if (!svg) return;
		const pt = svg.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		const m = svg.getScreenCTM();
		if (!m) return;
		const { x, y } = pt.matrixTransform(m.inverse());
		let mielh = -1;
		let dist = Infinity;
		punts.forEach((p, i) => {
			const d = Math.hypot(p.x - x, p.y - y);
			if (d < dist) {
				dist = d;
				mielh = i;
			}
		});
		if (mielh >= 0 && dist < 60) causir(mielh);
	}
</script>

<section class="block">
	<header class="block-head">
		<h3 class="block-title">{block.title}</h3>
		<span class="counter" aria-label="Villes trouvées">{trobats.length}/{punts.length}</span>
	</header>
	{#if block.intro}<p class="intro">{@html rich(block.intro)}</p>{/if}

	<div class="question" class:shake aria-live="polite">
		{#if actual !== null}
			<span class="ont">Ont es…</span>
			<strong class="vila-fr">{punts[actual].fr}</strong>
			<span class="ont">?</span>
		{:else}
			<span class="vila-fr">Totas trobadas, òsca !</span>
			<span class="ont"><em>(toutes trouvées, bravo !)</em></span>
		{/if}
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
	<svg
		bind:this={svg}
		class="mapa"
		viewBox="0 0 {vista.largor} {vista.nautor}"
		role="group"
		aria-label="Carte du pays d’òc avec {punts.length} villes"
		onclick={toucar}
	>
		{#each zonas as z (z.kod)}
			<path d={z.d} class="zona" class:lengadoc={z.kod === 'lan'} />
		{/each}
		{#each punts as p, i}
			{@const trobat = trobats.includes(i)}
			{@const [dx, dy, ancra] = DECALATGE[p.cap ?? 'e']}
			<g
				class="punt"
				class:trobat
				role="button"
				tabindex="0"
				aria-label={trobat ? p.oc : `Ville ${i + 1}`}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						causir(i);
					}
				}}
			>
				<circle cx={p.x} cy={p.y} r="22" class="zone-toucar" />
				<circle cx={p.x} cy={p.y} r={trobat ? 10 : 8.5} class="ponch" />
				{#if trobat}
					<text x={p.x + dx} y={p.y + dy} text-anchor={ancra} class="etiqueta" lang="oc">{p.oc}</text>
				{/if}
			</g>
		{/each}
		{#if bulle}
			{@const p = punts[bulle.i]}
			{#key bulle.id}
				<text x={p.x} y={p.y - 17} text-anchor="middle" class="bulle-fr">{p.fr}</text>
			{/key}
		{/if}
	</svg>

	{#if trobats.length}
		<ul class="trobadas">
			{#each [...trobats].reverse() as i (i)}
				{@const p = punts[i]}
				<li>
					<span class="t-oc" lang="oc" {@attach animat('clarificar')}>{p.oc}</span>
					<span class="t-sound">{p.sound}</span>
					<span class="t-fr">{p.fr}{#if p.nota}{@html ` · ${rich(p.nota)}`}{/if}</span>
				</li>
			{/each}
		</ul>
	{/if}

	{#if block.lien && actual === null}
		<p class="lien"><a href={block.lien.href}>{block.lien.texte}</a></p>
	{/if}
</section>

<style>
	.block {
		background: white;
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.1);
	}

	.block-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.block-title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--color-brick);
	}

	.counter {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-teal);
		white-space: nowrap;
	}

	.intro {
		margin: 0.4rem 0 0;
		font-size: 0.88rem;
		color: rgba(58, 42, 32, 0.75);
		line-height: 1.5;
	}

	.question {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: center;
		gap: 0.4rem;
		margin: 1rem 0 0.4rem;
		text-align: center;
	}

	.ont {
		color: var(--color-teal);
	}

	.vila-fr {
		font-family: var(--font-heading);
		font-size: 1.35rem;
		color: var(--color-text);
	}

	/* la carte prend toute la largeur de la carte blanche, même sur téléphone */
	.mapa {
		display: block;
		width: calc(100% + 1.6rem);
		margin: 0 -0.8rem;
		height: auto;
		cursor: pointer;
		touch-action: manipulation;
	}

	.zona {
		fill: color-mix(in srgb, var(--color-gold) 30%, white);
		stroke: color-mix(in srgb, var(--color-gold) 30%, white);
		stroke-width: 1;
	}

	.zona.lengadoc {
		fill: color-mix(in srgb, var(--color-gold) 48%, white);
		stroke: color-mix(in srgb, var(--color-gold) 48%, white);
	}

	.zone-toucar {
		fill: transparent;
	}

	.ponch {
		fill: var(--color-teal);
		stroke: white;
		stroke-width: 2.5;
		transition: r 200ms ease;
	}

	.punt:hover .ponch,
	.punt:focus-visible .ponch {
		fill: var(--color-brick);
	}

	/* au doigt ou à la souris, pas de cadre ; au clavier, un cercle rouge */
	.punt:focus,
	.punt:focus-visible {
		outline: none;
	}

	.punt:focus-visible .zone-toucar {
		stroke: var(--color-brick);
		stroke-width: 2;
	}

	.punt.trobat .ponch {
		fill: var(--color-gold);
		stroke: var(--color-brick);
	}

	.etiqueta {
		font-family: var(--font-heading);
		font-size: 21px;
		fill: var(--color-text);
		paint-order: stroke;
		stroke: white;
		stroke-width: 5px;
		stroke-linejoin: round;
		pointer-events: none;
	}

	.bulle-fr {
		font-size: 20px;
		font-weight: 600;
		fill: var(--color-teal);
		paint-order: stroke;
		stroke: white;
		stroke-width: 4px;
		pointer-events: none;
		animation: aparéisser 1.8s ease forwards;
	}

	.trobadas {
		list-style: none;
		margin: 0.6rem 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.trobadas li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.6rem;
		padding: 0.35rem 0;
		border-bottom: 1px solid rgba(58, 42, 32, 0.07);
	}

	.t-oc {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		color: var(--color-brick);
	}

	.t-sound {
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.t-fr {
		font-size: 0.85rem;
		color: rgba(58, 42, 32, 0.65);
	}

	.lien {
		margin: 0.8rem 0 0;
		font-size: 0.9rem;
	}

	.lien a {
		color: var(--color-brick);
		font-weight: 600;
	}

	.shake {
		animation: shake 260ms ease;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		30% { transform: translateX(-4px); }
		60% { transform: translateX(4px); }
	}

	@keyframes aparéisser {
		0% { opacity: 0; }
		12% { opacity: 1; }
		80% { opacity: 1; }
		100% { opacity: 0; }
	}

	@media (prefers-reduced-motion: reduce) {
		.shake, .bulle-fr { animation: none; }
		.ponch { transition: none; }
	}
</style>
