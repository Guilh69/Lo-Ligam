<script>
	// Une fiche de Cultura (/cultura/<id>) : l'encart « Cultura » de sa leçon,
	// tel qu'écrit dans le parcours (texte en français, comme les explications
	// de la grammaire), sous une case de la couleur de son thème ; puis la
	// leçon où on le croise, et les fiches voisines dans l'ordre du parcours.
	// Même fond que le sommaire. Depuis le 2026-11-06, la case du titre porte
	// la photo de la fiche passée dans cette couleur, comme sur le sommaire
	// (ou son dessin au trait, ou la croix du logo).
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Bulla from '$lib/components/Bulla.svelte';
	import Crotz from '$lib/components/Crotz.svelte';
	import { rich } from '$lib/lesson/rich.js';
	import { FICHAS, IU, ficha as trobar, tema as temaDe, nomModul } from '$lib/cultura/index.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

	let { data } = $props();
	let f = $derived(trobar(data.id));
	let t = $derived(temaDe(f.tema));
	let e = $derived(data.encart);
	let n = $derived(FICHAS.indexOf(f));
	let prec = $derived(FICHAS[n - 1] ?? null);
	let seg = $derived(FICHAS[n + 1] ?? null);

	let lang = $derived(langStore.current);
	let esOc = $derived(lang === 'oc');
	// la bulle du titre occitan, sauf en occitan ou quand le titre est le même (« Lo mas »)
	let bulla = $derived(!esOc && tria(f.titol) !== f.titol.oc);
	const defòra = (href) => /^https?:\/\//.test(href);
</script>

<svelte:head>
	<title>{tria(f.titol)} · Cultura · Lo Ligam</title>
	<meta name="description" content={e.paragrafes[0]?.replace(/\*/g, '').slice(0, 160) ?? ''} />
</svelte:head>

<div class="pagina">
	<div class="entete"><AppHeader /></div>
	<main class="principal">
		<a class="parent" href="/cultura" lang="oc">Cultura</a>

		<header class="cap" class:amb-foto={data.foto} class:amb-dessenh={!data.foto && (data.dessenh?.length || f.id === 'roge-e-aur')} style:--aplat={t.color[0]} style:--sus={t.color[1]}>
			<span class="cap-media" aria-hidden="true">
				{#if data.foto}
					<img src={data.foto.src} srcset={data.foto.srcset} sizes="(min-width: 60rem) 52rem, 100vw" alt="" style:object-position={data.foto.pos} />
				{:else if data.dessenh?.length}
					<svg class="dessenh" viewBox="0 0 100 100">
						{#each data.dessenh as d}<path {d} />{/each}
					</svg>
				{:else if f.id === 'roge-e-aur'}
					<span class="dessenh crotz"><Crotz talha="100%" teula /></span>
				{/if}
			</span>
			<a class="cap-tema" href="/cultura?tema={f.tema}">{tria(t.nom)}</a>
			<h1>
				<!-- dans une autre langue, le titre occitan au survol (toucher au téléphone) -->
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<span lang={lang} tabindex={bulla ? 0 : undefined} aria-describedby={bulla ? 'b-titol' : undefined}
					>{tria(f.titol)}{#if bulla}<Bulla id="b-titol" text={f.titol.oc} />{/if}</span
				>
			</h1>
		</header>

		<div class="texte" lang="fr" dir="ltr">
			{#if lang !== 'fr'}<p class="nota-lenga" lang={lang} dir="auto">{tria(IU.enFrances)}</p>{/if}
			{#each e.paragrafes as p}
				<p>{@html rich(p)}</p>
			{/each}
			{#if e.lista.length}
				<ul>
					{#each e.lista as li}<li>{@html rich(li)}</li>{/each}
				</ul>
			{/if}
			{#if e.lien?.href}
				<p class="lien">
					<a href={e.lien.href} target={defòra(e.lien.href) ? '_blank' : undefined} rel={defòra(e.lien.href) ? 'noopener noreferrer' : undefined}
						>{e.lien.texte ?? e.lien.href}</a
					>{#if defòra(e.lien.href)}{' '}<span class="defora" lang={lang}>({tria(IU.autreSite)})</span>{/if}
				</p>
			{/if}
		</div>

		<p class="parcors">
			<span>{tria(IU.dinsParcors)}</span>
			<a href="/aprene/modul/{f.modul}"
				>{tria(nomModul(f.modul))}{#if e.modul.oc}{' · '}<span lang="oc" dir="ltr">{e.modul.oc}</span>{/if}</a
			>
		</p>

		{#if prec || seg}
			<nav class="vesinas" aria-label={tria(IU.vesinas)}>
				{#if prec}
					<a class="vesina" href="/cultura/{prec.id}" rel="prev">
						<span class="vesina-nom">{tria(IU.precedenta)}</span>
						<span class="vesina-titol" lang={lang}>{tria(prec.titol)}</span>
					</a>
				{/if}
				{#if seg}
					<a class="vesina seguenta" href="/cultura/{seg.id}" rel="next">
						<span class="vesina-nom">{tria(IU.seguenta)}</span>
						<span class="vesina-titol" lang={lang}>{tria(seg.titol)}</span>
					</a>
				{/if}
			</nav>
		{/if}
	</main>
</div>

<style>
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.entete {
		padding: 1.3rem var(--marge);
	}
	.entete :global(.top) {
		max-width: none;
	}
	.principal {
		max-width: calc(52rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(1.5rem, 5vh, 3.5rem) var(--marge) var(--esp-96);
	}
	.parent {
		display: inline-block;
		margin-bottom: var(--esp-12);
		color: var(--t-tinta-2);
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.2em;
	}

	/* la case du titre, de la couleur du thème ; le nom du thème mène au
	   sommaire filtré sur ce thème */
	.cap {
		position: relative;
		isolation: isolate;
		display: grid;
		align-content: end;
		gap: 0.6rem;
		padding: clamp(1.1rem, 3vw, 1.8rem) clamp(1.1rem, 3vw, 2rem) clamp(1.3rem, 3.4vw, 2.2rem);
		border-radius: 6px;
		background: var(--aplat);
		color: var(--sus);
	}
	/* la photo passée dans la couleur du thème, un voile sous le texte */
	.cap.amb-foto {
		min-height: clamp(12rem, 34vw, 18rem);
	}
	.cap-media {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		border-radius: inherit;
	}
	.cap-media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(1) contrast(1.08);
		mix-blend-mode: luminosity;
		opacity: 0.62;
	}
	.amb-foto .cap-media::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(20, 8, 4, 0.6), transparent 75%);
	}
	.dessenh {
		position: absolute;
		top: 0.9rem;
		inset-inline-end: 1rem;
		width: clamp(4rem, 12vw, 6.5rem);
		height: clamp(4rem, 12vw, 6.5rem);
		fill: none;
		stroke: var(--sus);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
		opacity: 0.55;
	}
	/* le titre laisse la place du dessin */
	.amb-dessenh h1 {
		padding-inline-end: clamp(4.5rem, 13vw, 7.5rem);
	}
	.dessenh.crotz {
		stroke: none;
		opacity: 1;
	}
	.dessenh.crotz :global(svg) {
		display: block;
	}
	.cap-tema {
		justify-self: start;
		color: inherit;
		font-size: 0.9rem;
		font-weight: 700;
		text-decoration: underline 1px;
		text-underline-offset: 0.2em;
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2rem, 5.4vw, 3.6rem);
		line-height: 1.05;
		text-wrap: balance;
	}
	h1 [tabindex] {
		cursor: help;
		border-radius: 3px;
	}
	h1 [tabindex]:focus-visible,
	.cap-tema:focus-visible {
		outline: 3px solid var(--sus);
		outline-offset: 3px;
	}

	/* le texte de la leçon, à la largeur de lecture */
	.texte {
		max-width: 62ch;
		margin: var(--esp-32) 0 0;
		font-size: 1.08rem;
		line-height: 1.6;
	}
	.texte p,
	.texte ul {
		margin: 0 0 1em;
	}
	.texte ul {
		padding-inline-start: 1.2em;
	}
	.texte li {
		margin-bottom: 0.35em;
	}
	.nota-lenga {
		font-size: 0.88rem;
		color: var(--t-tinta-2);
	}
	.lien a,
	.parcors a {
		color: var(--t-tinta);
		text-decoration: underline 2px var(--t-accion);
		text-underline-offset: 0.2em;
	}
	.defora {
		font-size: 0.85em;
		color: var(--t-tinta-2);
	}
	.parcors {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.6rem;
		max-width: 62ch;
		margin: var(--esp-16) 0 0;
		padding-top: var(--esp-16);
		border-top: 1px solid var(--t-linha);
	}
	.parcors > span {
		color: var(--t-tinta-2);
	}
	.lien a:focus-visible,
	.parcors a:focus-visible,
	.parent:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	/* les fiches voisines : deux cases neutres à filet fin (Joan, 06-11 : en
	   aplat, elles tiraient l'œil plus que la tête de fiche) */
	/* deux colonnes dès qu'il y a la place ; la suivante toujours à droite,
	   même seule (première fiche), la précédente à gauche */
	.vesinas {
		display: grid;
		gap: 0.6rem;
		margin-top: var(--esp-48);
	}
	@media (min-width: 36rem) {
		.vesinas {
			grid-template-columns: 1fr 1fr;
		}
		.vesina.seguenta {
			grid-column: 2;
		}
	}
	.vesina {
		display: grid;
		gap: 0.2rem;
		padding: 0.8rem 1rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		color: var(--t-tinta);
		text-decoration: none;
		transition:
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			border-color 0.3s;
	}
	.vesina.seguenta {
		text-align: end;
	}
	.vesina:hover,
	.vesina:focus-visible {
		transform: translateY(-3px);
		border-color: var(--t-tinta-2);
	}
	.vesina-nom {
		color: var(--t-tinta-2);
	}
	.vesina:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.vesina-nom {
		font-size: 0.82rem;
	}
	.vesina-titol {
		font-weight: 700;
		line-height: 1.2;
	}
	@media (prefers-reduced-motion: reduce) {
		.vesina {
			transition: none;
		}
	}
</style>
