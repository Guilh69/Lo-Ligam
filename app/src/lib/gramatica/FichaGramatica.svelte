<script>
	// Une fiche de grammaire, mise en page à partir de ses données
	// (fichas/<id>.js ; mode d'emploi : LEGIR-ME.md). Une idée par écran, une
	// couleur par clé (groupe de verbes, genre…) gardée d'un écran à l'autre ;
	// la source sous chaque écran tiré du livre, toutes les sources à la fin.
	// Né de l'essai /ensag/gramatica du 2026-11-03 (inspiration : la grammaire
	// cognitive du CPNL, habillée à la manière de Lo Ligam).
	import { dev } from '$app/environment';
	import { fly } from 'svelte/transition';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import NoteBlock from '$lib/lesson/NoteBlock.svelte';
	import { insecable } from '$lib/lesson/rich.js';
	import PictoFicha from './PictoFicha.svelte';
	import Relacionar from './Relacionar.svelte';
	import { marcar, copa, classeColor } from './marcar.js';
	import { FICHAS_LENGAS, IU, paginas } from './lengas.js';
	import { tria } from '$lib/stores/lang.svelte.js';
	import Retour from '$lib/components/Retour.svelte';

	let { ficha } = $props();
	// l'habillage suit la langue choisie (lengas.js) ; les explications de la
	// fiche restent en français pour l'instant (option 1 de Romain, 2026-11-04)
	const resumit = $derived(tria({ fr: ficha.resumit, ...FICHAS_LENGAS[ficha.id]?.resumit }));

	const LIBRE = '_oc:Gramatica de l’occitan estandard_ (Collègi d’Occitania, Academia Occitana)';
	const ECRANS = $derived(ficha.ecrans);
	const m = (text) => marcar(text, ficha.colors);
	const mot = (s) => copa(s).rad + copa(s).fin;

	let ecran = $state(0);
	let sens = $state(1);
	let titres = [];
	const calme = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	const e = $derived(ECRANS[ecran]);
	const costat = $derived(e.blocs.filter((b) => b.type === 'cultura'));

	function aller(n, focus = true) {
		if (n < 0 || n >= ECRANS.length || n === ecran) return;
		sens = n > ecran ? 1 : -1;
		ecran = n;
		if (focus) setTimeout(() => titres[n]?.focus({ preventScroll: true }), 30);
	}

	function touche(ev) {
		if (ev.target.closest?.('input, textarea, select, [contenteditable]')) return;
		if (ev.key === 'Escape') ouverte = null;
		else if (ev.key === 'ArrowRight') aller(ecran + 1, false);
		else if (ev.key === 'ArrowLeft') aller(ecran - 1, false);
	}

	// glisser du doigt sur l'écran : écran suivant ou précédent
	let x0 = 0, y0 = 0;
	const debut = (ev) => ((x0 = ev.changedTouches[0].clientX), (y0 = ev.changedTouches[0].clientY));
	function fin(ev) {
		const dx = ev.changedTouches[0].clientX - x0, dy = ev.changedTouches[0].clientY - y0;
		if (Math.abs(dx) > 60 && Math.abs(dy) < 40) aller(ecran + (dx < 0 ? 1 : -1), false);
	}

	// la bulle d'exemples ouverte (une à la fois)
	let ouverte = $state(null);
</script>

<svelte:head>
	<title>Gramatica · {ficha.titol} · Lo Ligam</title>
	<meta name="description" content={resumit} />
	<!-- tant que Romain n'a pas relu l'occitan, la fiche n'est pas indexée -->
	{#if !ficha.validada}<meta name="robots" content="noindex" />{/if}
</svelte:head>

<!-- la bulle d'exemples se ferme d'un clic ailleurs (principe du site) -->
<svelte:window onkeydown={touche} onclick={(ev) => ouverte && !ev.target.closest?.('.cartas') && (ouverte = null)} />

{#snippet bloc(b, cle)}
	{#if b.type === 'intro' || b.type === 'nota' || b.type === 'indic' || b.type === 'seguida'}
		<p class={b.type}>{@html m(b.text)}</p>
	{:else if b.type === 'font'}
		<p class="font">{tria(IU.font)}&nbsp;: {@html marcar(b.libre ?? ficha.libre ?? LIBRE)}, {paginas(b.pages, tria(IU.paginas))}.</p>
	{:else if b.type === 'cartas'}
		<ul class="cartas">
			{#each b.items as g, i}
				{@const id = `${cle}-${i}`}
				{@const c = classeColor(ficha.colors, g.color)}
				<li>
					<button
						type="button"
						class="carta {c}"
						class:ouverte={ouverte === id}
						aria-expanded={ouverte === id}
						aria-controls={ouverte === id ? `ex-${id}` : undefined}
						onclick={() => (ouverte = ouverte === id ? null : id)}
					>
						<span class="carta-en">{g.titol}</span>
						<span class="carta-fin" lang="oc">{g.gros}</span>
						<span class="carta-ex" lang="oc">{mot(g.exemples[0][0])}…</span>
					</button>
					{#if ouverte === id}
						<ul class="exemples {c}" id="ex-{id}" transition:fly={{ y: calme() ? 0 : 8, duration: calme() ? 0 : 180 }}>
							{#each g.exemples as [oc, fr]}
								{@const k = copa(oc)}
								<li><span lang="oc">{k.rad}<b>{k.fin}</b></span> <small>{fr}</small></li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{:else if b.type === 'copas'}
		<div class="copas">
			{#each b.items as it, i}
				{@const k = copa(it.mot)}
				{@const c = classeColor(ficha.colors, k.color)}
				<span class="copa-picto" style:--i={i}>{#if it.picto}<PictoFicha nom={it.picto} />{/if}</span>
				<span class="copa-mot" lang="oc">{k.rad}<span class="colorat {c}">{k.fin}</span></span>
				<span class="copa-sageta" aria-hidden="true">⟶</span>
				<span class="copa-rad" lang="oc" style:--i={i}>{k.rad}</span>
				<span class="copa-fin colorat {c}" lang="oc" style:--i={i}>+{k.fin}</span>
				<span class="copa-fr" style:--i={i}>{it.fr}</span>
			{/each}
			<span class="accolada a-rad" aria-hidden="true"></span>
			<span class="accolada a-fin" aria-hidden="true"></span>
			<span class="nom-rad"><span lang="oc">{b.noms[0].oc}</span><small>{b.noms[0].fr}</small></span>
			<span class="nom-fin"><span lang="oc">{b.noms[1].oc}</span><small>{b.noms[1].fr}</small></span>
		</div>
	{:else if b.type === 'colonas'}
		<div class="dos">
			{#each b.items as col}
				<div class="colona">
					<h3>{insecable(col.titol)}</h3>
					{#each col.frasas as f}
						<div class="frasa">
							{#if f.picto}<PictoFicha nom={f.picto} size="3.2rem" />{/if}
							<p><span class="f-oc" lang="oc">{@html m(f.oc)}</span><small>{f.fr}</small></p>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{:else if b.type === 'relacionar'}
		<Relacionar bloc={b} colors={ficha.colors} />
	{:else if b.type === 'marcas'}
		<ul class="resumit">
			{#each b.linhas as [marca, qui, ex]}
				<li>
					<span class="r-fin" class:rien={!marca}>{marca ? '-' + marca : tria(IU.res)}</span>
					<span class="r-qui" lang="oc">{qui}</span>
					<span class="r-ex" lang="oc">{ex.slice(0, ex.length - marca.length)}<b>{marca}</b></span>
				</li>
			{/each}
		</ul>
	{:else if b.type === 'fonts'}
		<div class="credits">
			<h3>{tria(IU.fonts)}</h3>
			{#each ficha.fonts ?? [] as f}
				<p><strong>{@html m(f.de)}</strong>&nbsp;: {@html m(f.text)}</p>
			{/each}
		</div>
	{:else if dev}
		<p class="inconnu">Bloc inconnu : « {b.type} » (voir LEGIR-ME.md)</p>
	{/if}
{/snippet}

<main class="fiche" aria-labelledby="fiche-titol">
	<header class="cap">
		<span class="cap-picto"><Pictograma nom="wiki" size="2.2rem" /></span>
		<div class="cap-retour"><Retour actuelle={ficha.titol} /></div>
		<h1 id="fiche-titol" class="sr-only"><span lang="oc">Gramatica : {ficha.titol}</span></h1>
	</header>

	<div class="escena" role="presentation" ontouchstart={debut} ontouchend={fin}>
		{#key ecran}
			<section
				class="ecran"
				class:a-costat={costat.length}
				aria-labelledby="ecran-{ecran}"
				in:fly={{ x: calme() ? 0 : sens * 48, duration: calme() ? 0 : 320, opacity: 0 }}
			>
				<h2 id="ecran-{ecran}" lang="oc" tabindex="-1" bind:this={titres[ecran]}>{e.titol}</h2>
				<div class="cors">
					{#each e.blocs as b, bi}
						{#if b.type !== 'cultura'}{@render bloc(b, `${ecran}-${bi}`)}{/if}
					{/each}
				</div>
				{#if costat.length}
					<div class="costat">
						{#each costat as b}<NoteBlock block={{ variant: 'culture', title: b.titol, paragraphs: b.paragrafes }} />{/each}
					</div>
				{/if}
			</section>
		{/key}
	</div>

	<nav class="navegacion" aria-label={tria(IU.ecrans)}>
		<button type="button" class="pc sageta" aria-label={tria(IU.ecranPrecedent)} disabled={ecran === 0} onclick={() => aller(ecran - 1)}>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
		</button>
		<ol class="ponchs">
			{#each ECRANS as t, i}
				<li>
					<button type="button" class="ponch" aria-label="{tria(IU.ecran)} {i + 1} : {t.titol}" aria-current={i === ecran ? 'step' : undefined} onclick={() => aller(i)}></button>
				</li>
			{/each}
		</ol>
		<button type="button" class="pc sageta" aria-label={tria(IU.ecranSeguent)} disabled={ecran === ECRANS.length - 1} onclick={() => aller(ecran + 1)}>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
		</button>
	</nav>
</main>

<style>
	/* Les couleurs des fiches, prises dans la charte (prune, olive, bleu
	   ciel) : en aplat sur les cartes, comme les cases de S'apren ; en texte,
	   assombries sur le clair (4,5 au moins), éclaircies sur le sombre. Jamais
	   le rouge du logo, réservé à ce qui se clique (règle B). Une fiche relie
	   ses clés à ces couleurs (champ « colors ») ; en ajouter une = ici. */
	.fiche {
		--pruna: #e3a0cf;
		--oliva: #b8d27c;
		--blau: #8cc3f0;
		--pruna-aplat: #6b3a5b;
		--oliva-aplat: #55702f;
		--blau-aplat: #2f6a9c;
		--pastilha: color-mix(in srgb, var(--t-aur) 16%, var(--t-fons-2));
		container-type: inline-size;
		max-width: 76rem;
		margin: 0 auto;
		padding: 1.25rem 1rem 1.5rem;
		color: var(--t-tinta);
		display: flex;
		flex-direction: column;
		min-height: calc(100svh - 5rem);
	}
	:global(:root[data-tema='clar']) .fiche {
		--pruna: #7a3b69;
		--oliva: #47602a;
		--blau: #255d90;
	}
	/* la couleur d'une clé (classe c-<couleur>, posée par marcar.js) */
	.fiche :global(.c-pruna) {
		--c: var(--pruna);
		--c-aplat: var(--pruna-aplat);
	}
	.fiche :global(.c-oliva) {
		--c: var(--oliva);
		--c-aplat: var(--oliva-aplat);
	}
	.fiche :global(.c-blau) {
		--c: var(--blau);
		--c-aplat: var(--blau-aplat);
	}
	.fiche :global(.fin) {
		font-weight: 700;
		color: var(--c, inherit);
	}
	.colorat {
		color: var(--c);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.cap {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--t-tinta-2);
	}
	/* le retour commun (Retour.svelte) prend la place du ruban ; il occupe la largeur qui reste */
	.cap-retour {
		flex: 1;
		min-width: 0;
	}
	.cap-retour :global(.retour) {
		margin: 0;
	}

	.escena {
		flex: 1;
		display: grid;
		overflow-x: clip;
	}
	.ecran {
		grid-area: 1 / 1;
		display: grid;
		grid-template-columns: 1fr;
		align-content: start;
		gap: 1.1rem;
		padding-top: 0.6rem;
	}
	h2 {
		margin: 0.4rem 0 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.9rem, 5.5cqi, 3rem);
		line-height: 1.1;
		color: var(--t-aur);
		outline: none;
	}
	.intro {
		margin: 0;
		max-width: 52rem;
		font-size: clamp(1.1rem, 2.6cqi, 1.45rem);
		line-height: 1.45;
	}
	.indic {
		margin: 0;
		color: var(--t-tinta-2);
	}

	/* un encart culture se range à droite sur grand écran */
	.cors {
		display: grid;
		align-content: start;
		gap: 1.1rem;
		min-width: 0;
	}
	@container (min-width: 64rem) {
		.ecran.a-costat {
			grid-template-columns: 1fr 24rem;
			column-gap: 2.5rem;
		}
		.ecran.a-costat > h2,
		.cors {
			grid-column: 1;
		}
		.costat {
			grid-column: 2;
			grid-row: 2;
			align-self: start;
		}
	}
	.costat :global(.block) {
		margin: 0;
	}
	/* les cartes (les trois groupes) */
	.cartas {
		list-style: none;
		margin: 0.4rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem;
	}
	.cartas > li:last-child {
		grid-column: 1 / -1;
	}
	@container (min-width: 40rem) {
		.cartas {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.cartas > li:last-child {
			grid-column: auto;
		}
	}
	.cartas > li {
		position: relative;
	}
	.carta {
		width: 100%;
		display: grid;
		justify-items: center;
		gap: 0.1rem;
		padding: 1rem 0.5rem 0.9rem;
		border: 0;
		border-radius: 1rem;
		background: var(--c-aplat);
		color: #fbf1e1;
		font: inherit;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			background 0.2s ease;
	}
	.carta:hover,
	.carta.ouverte {
		background: color-mix(in srgb, var(--c-aplat) 88%, #000);
		transform: translateY(-3px);
	}
	.carta:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.carta-en,
	.carta-ex {
		font-size: 0.95rem;
		color: #fbf1e1;
	}
	.carta-fin {
		font-size: clamp(2.2rem, 7cqi, 3.4rem);
		font-weight: 700;
		/* 1.2 : les jambages de g, j, p ne mordent pas sur l'exemple dessous */
		line-height: 1.2;
	}
	.exemples {
		position: absolute;
		z-index: 2;
		left: 50%;
		bottom: calc(100% + 0.6rem);
		translate: -50% 0;
		min-width: 11rem;
		margin: 0;
		padding: 0.6rem 0.9rem;
		list-style: none;
		border-radius: 0.8rem;
		background: var(--t-tinta);
		color: var(--t-fons);
		box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.25);
		line-height: 1.5;
	}
	.exemples::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 100%;
		translate: -50% 0;
		border: 0.5rem solid transparent;
		border-top-color: var(--t-tinta);
	}
	.exemples b {
		color: color-mix(in srgb, var(--c) 45%, var(--t-fons));
	}
	.exemples small {
		opacity: 0.75;
	}
	.nota {
		margin: 0.4rem 0 0;
		max-width: 52rem;
		line-height: 1.5;
	}

	/* le mot coupé en deux */
	.copas {
		display: grid;
		grid-template-columns: auto auto auto auto auto;
		align-items: center;
		justify-content: start;
		gap: 0.35rem clamp(0.5rem, 2.2cqi, 1.6rem);
		margin-top: 0.4rem;
		font-weight: 700;
		text-transform: uppercase;
		font-size: clamp(1.3rem, 6cqi, 3.6rem);
		line-height: 1.15;
	}
	.copa-picto {
		width: clamp(2rem, 6cqi, 3.6rem);
		height: clamp(2rem, 6cqi, 3.6rem);
		color: var(--t-tinta-2);
		grid-column: 1;
	}
	.copa-picto :global(svg) {
		width: 100%;
		height: 100%;
	}
	.copa-mot {
		grid-column: 2;
	}
	.copa-sageta {
		grid-column: 3;
		color: var(--t-tinta-2);
		font-weight: 400;
	}
	.copa-rad {
		grid-column: 4;
		color: var(--t-tinta-2);
	}
	.copa-fin {
		grid-column: 5;
	}
	.copa-fr {
		grid-column: 2 / -1;
		margin: -0.3rem 0 0.4rem;
		font-size: 0.95rem;
		font-weight: 400;
		text-transform: none;
		color: var(--t-tinta-2);
	}
	.copa-rad,
	.copa-fin {
		animation: copar 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		animation-delay: calc(0.25s + var(--i) * 0.16s);
	}
	.copa-fin {
		animation-delay: calc(0.4s + var(--i) * 0.16s);
	}
	@keyframes copar {
		from {
			opacity: 0;
			translate: -1.2em 0;
		}
	}
	.accolada {
		height: 0.8rem;
		margin-top: 0.3rem;
		border: 3px solid var(--t-tinta-2);
		border-top: 0;
		border-radius: 0 0 0.5rem 0.5rem;
	}
	.a-rad,
	.nom-rad {
		grid-column: 4;
	}
	.a-fin,
	.nom-fin {
		grid-column: 5;
	}
	.nom-rad,
	.nom-fin {
		display: grid;
		justify-items: center;
		text-transform: none;
		font-size: clamp(1rem, 2.6cqi, 1.5rem);
		text-align: center;
	}
	.nom-rad small,
	.nom-fin small {
		font-size: 0.8rem;
		font-weight: 400;
		color: var(--t-tinta-2);
	}

	/* les colonnes de phrases */
	.dos {
		display: grid;
		gap: 1.2rem 3rem;
	}
	@container (min-width: 48rem) {
		.dos {
			grid-template-columns: 1fr 1fr;
		}
	}
	h3 {
		margin: 0 0 0.6rem;
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 1.15rem;
		color: var(--t-aur);
	}
	.frasa {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.7rem 0;
	}
	.frasa :global(svg) {
		flex: none;
		width: 3.2rem;
		height: 3.2rem;
		color: var(--t-tinta-2);
	}
	.frasa p {
		display: grid;
		margin: 0;
	}
	.f-oc {
		font-size: clamp(1.4rem, 4cqi, 2rem);
		font-style: italic;
	}
	.frasa small {
		color: var(--t-tinta-2);
	}
	.f-oc :global(.fin) {
		text-transform: uppercase;
		font-style: normal;
	}

	/* le tableau des marques */
	.resumit {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem;
		max-width: 52rem;
	}
	@container (min-width: 44rem) {
		.resumit {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	.resumit li {
		display: grid;
		gap: 0.1rem;
		padding: 0.8rem 1rem;
		border-radius: 0.9rem;
		background: var(--t-fons-2);
	}
	.r-fin.rien {
		font-size: 1.2rem;
		line-height: 1.65;
	}
	.r-fin {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1;
		color: var(--t-aur);
	}
	.r-qui {
		font-weight: 700;
	}
	.r-ex {
		font-style: italic;
		color: var(--t-tinta-2);
	}
	.r-ex b {
		color: var(--t-aur);
	}
	.seguida :global(a) {
		color: var(--t-tinta);
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.25em;
	}
	.seguida {
		margin: 0;
	}
	.inconnu {
		padding: 0.5rem 0.8rem;
		border: 2px dashed currentColor;
	}
	.font {
		margin: 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.credits {
		max-width: 52rem;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.credits h3 {
		margin: 0.4rem 0 0.3rem;
		color: var(--t-tinta);
	}
	.credits p {
		margin: 0 0 0.35rem;
	}
	.credits :global(a) {
		color: var(--t-tinta);
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.2em;
	}

	/* la navigation, toujours en bas */
	.navegacion {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(0.6rem, 3cqi, 2rem);
		padding-top: 1.5rem;
	}
	.ponchs {
		display: flex;
		gap: clamp(0.6rem, 2.5cqi, 1.6rem);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.ponch {
		display: block;
		width: 1.6rem;
		height: 1.6rem;
		border: 0;
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
		position: relative;
	}
	.ponch::after {
		content: '';
		position: absolute;
		inset: 0.35rem;
		border-radius: 50%;
		background: var(--t-tinta-2);
		transition:
			background 0.2s ease,
			inset 0.2s ease;
	}
	.ponch[aria-current='step']::after {
		inset: 0.2rem;
		background: var(--t-aur);
	}
	.sageta {
		--r: 14px;
		width: 3rem;
		height: 3rem;
		min-height: 0;
		padding: 0;
	}

	.sageta:disabled {
		visibility: hidden;
	}
	.sageta svg {
		width: 1.4rem;
		height: 1.4rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.copa-rad,
		.copa-fin {
			animation: none;
		}
		.carta {
			transition: none;
		}
	}
</style>

