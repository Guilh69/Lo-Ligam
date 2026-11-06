<script>
	// Essai (Romain, 06-11) : le sommaire de Cultura « pas ouf » ; garder le
	// code couleur à un seul endroit, plus discret, sans filet de couleur sur
	// le côté ; des photos de Romain en fond, un peu transparentes, si elles
	// correspondent. Trois allures sur la vraie mise en page (?v=a|b|c) :
	//   A · fond voilé : la photo en fond, transparente ; la couleur du thème
	//       seulement dans son nom ;
	//   B · photo teintée : la photo prend la couleur du thème ; tout le reste
	//       neutre ;
	//   C · photo au-dessus : la photo nette en tête de case, le texte dessous ;
	//       la couleur seulement dans le nom du thème.
	// Fiches sans photo : un dessin au trait de Remira, la croix du logo, ou
	// rien (trois fiches, à combler).
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';
	import Bulla from '$lib/components/Bulla.svelte';
	import Crotz from '$lib/components/Crotz.svelte';
	import { FICHAS, TEMAS, IU, nomModul, ficha as trobar } from '$lib/cultura/index.js';
	import { foto, srcset } from '$lib/cultura/imatges.js';
	import { PAISATGES } from '$lib/paisatges/paisatges.js';
	import { IU as IU_G } from '$lib/gramatica/lengas.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

	let { data } = $props();

	let lang = $derived(langStore.current);
	let esOc = $derived(lang === 'oc');

	// couleur du nom du thème : [sur le sombre, sur le clair] (contraste ≥ 7:1
	// et ≥ 5:1) ; aplat de la photo teintée (B)
	const COLOR = {
		lenga: { s: '#7cc7c4', c: '#1f5f63', aplat: '#1f5f63' },
		noms: { s: '#8ab8e6', c: '#2f6a9c', aplat: '#2f6a9c' },
		pais: { s: '#a7c46e', c: '#4f6a2b', aplat: '#55702f' },
		poetas: { s: '#d9a0c8', c: '#6b3a5b', aplat: '#6b3a5b' },
		musica: { s: '#f2c14e', c: '#85600f', aplat: '#8f6514' },
		uei: { s: '#e8955a', c: '#8a4f12', aplat: '#8a4f12' }
	};

	const VARIANTAS = [
		{ id: 'a', nom: 'A · Fond voilé' },
		{ id: 'b', nom: 'B · Photo teintée' },
		{ id: 'c', nom: 'C · Photo au-dessus' }
	];
	// ?tema=clar : regarder le thème clair sans toucher au choix mémorisé
	onMount(() => {
		if (page.url.searchParams.get('tema') === 'clar') setTimeout(() => (document.documentElement.dataset.tema = 'clar'));
	});
	const demandada = page.url.searchParams.get('v');
	let v = $state(VARIANTAS.some((x) => x.id === demandada) ? demandada : 'a');
	function causir(id) {
		v = id;
		const url = new URL(page.url);
		url.searchParams.set('v', id);
		replaceState(url, {});
	}

	let filtre = $state(null);
	const nomTema = (id) => tria(TEMAS.find((t) => t.id === id)?.nom ?? {});
	let fichas = $derived(FICHAS.filter((x) => !filtre || x.tema === filtre));
	let tema = $derived(TEMAS.find((t) => t.id === filtre) ?? null);

	// la fiche d'exemple, en tête de page de fiche
	const EXEMPLE = trobar('vents');
	const fotoGranda = (id) => {
		const p = PAISATGES.find((x) => x.clau === foto(id)?.clau);
		return p ? { src: `/apren/paisatges/${p.clau}-${p.amples[0]}.webp`, srcset: p.amples.map((a) => `/apren/paisatges/${p.clau}-${a}.webp ${a}w`).join(', ') } : null;
	};
	const GRANDA = fotoGranda(EXEMPLE.id);
</script>

<svelte:head>
	<title>Essai · Cultura · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PaginaSimpla titol="Cultura" frasa="Essai : trois allures pour le sommaire." parent={{ href: '/cultura', nom: 'Cultura' }}>
	<div class="variantas" role="group" aria-label="Allure">
		{#each VARIANTAS as x}
			<button type="button" aria-pressed={v === x.id} onclick={() => causir(x.id)}>{x.nom}</button>
		{/each}
	</div>

	<div class="essai v-{v}">
		<div class="filtre">
			<ul class="temas" aria-label={tria(IU_G.triarTema)}>
				{#each TEMAS as t}
					<li>
						<button
							type="button"
							class="tema"
							style:--k-s={COLOR[t.id].s}
							style:--k-c={COLOR[t.id].c}
							style:--aplat={COLOR[t.id].aplat}
							aria-pressed={filtre === t.id}
							aria-describedby="b-tema-{t.id}"
							onclick={() => (filtre = filtre === t.id ? null : t.id)}
						>
							<span><strong>{tria(t.nom)}</strong><span class="tema-detalh">{tria(t.detalh)}</span></span>
							<Bulla
								id="b-tema-{t.id}"
								titol={esOc ? '' : t.nom.oc}
								etiqueta={esOc ? tria(IU_G.perExemple) : ''}
								text={t.exemple}
							/>
						</button>
					</li>
				{/each}
			</ul>
			{#if filtre}
				<button type="button" class="tot" onclick={() => (filtre = null)}>{tria(IU_G.totVeire)}</button>
			{/if}
			<p class="estat" aria-live="polite">{tema ? tria(IU_G.estat)(tria(tema.nom), fichas.length) : ''}</p>
		</div>

		<ul class="fichas" aria-label={tria(IU.fichas)}>
			{#each fichas as f (f.id)}
				{@const ft = foto(f.id)}
				<li>
					<a
						class="ficha"
						class:sens-foto={!ft}
						style:--k-s={COLOR[f.tema].s}
						style:--k-c={COLOR[f.tema].c}
						style:--aplat={COLOR[f.tema].aplat}
						href="/cultura/{f.id}"
						aria-describedby={esOc || tria(f.titol) === f.titol.oc ? undefined : `b-ficha-${f.id}`}
					>
						<span class="ficha-media" aria-hidden="true">
							{#if ft}
								<img src="/cultura/{f.id}-480.webp" srcset={srcset(f.id)} sizes="(min-width: 1100px) 24rem, (min-width: 640px) 46vw, 40vw" alt="" loading="lazy" decoding="async" />
							{:else if data.dessenhs[f.id]?.length}
								<svg class="dessenh" viewBox="0 0 100 100">
									{#each data.dessenhs[f.id] as d}<path {d} />{/each}
								</svg>
							{:else if f.id === 'roge-e-aur'}
								<span class="dessenh crotz"><Crotz talha="100%" /></span>
							{/if}
						</span>
						<span class="ficha-tema" lang={lang}>{nomTema(f.tema)}</span>
						<span class="ficha-titol" lang={lang}>{tria(f.titol)}</span>
						<span class="ficha-modul">{tria(nomModul(f.modul))}</span>
						{#if !esOc && tria(f.titol) !== f.titol.oc}<Bulla id="b-ficha-{f.id}" text={f.titol.oc} />{/if}
					</a>
				</li>
			{/each}
		</ul>

		<h2 class="sostitol">En tête d'une fiche</h2>
		<header class="cap" style:--k-s={COLOR[EXEMPLE.tema].s} style:--k-c={COLOR[EXEMPLE.tema].c} style:--aplat={COLOR[EXEMPLE.tema].aplat}>
			{#if GRANDA}<img class="cap-foto" src={GRANDA.src} srcset={GRANDA.srcset} sizes="(min-width: 60rem) 52rem, 100vw" alt="" />{/if}
			<span class="cap-tema" lang={lang}>{nomTema(EXEMPLE.tema)}</span>
			<p class="cap-titol" lang={lang}>{tria(EXEMPLE.titol)}</p>
		</header>
	</div>
</PaginaSimpla>

<style>
	.variantas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0 0 var(--esp-32);
		padding: 0.6rem;
		border: 1px dashed var(--t-linha);
		border-radius: 6px;
	}
	.variantas button {
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		cursor: pointer;
	}
	.variantas button[aria-pressed='true'] {
		background: var(--t-tinta);
		color: var(--t-fons);
		font-weight: 700;
	}

	/* la couleur du thème : une version claire sur le sombre, foncée sur le clair */
	.essai {
		--crema: #fbf1e1;
	}
	.tema,
	.ficha,
	.cap {
		--k: var(--k-s);
	}
	:global([data-tema='clar']) .tema,
	:global([data-tema='clar']) .ficha,
	:global([data-tema='clar']) .cap {
		--k: var(--k-c);
	}

	/* ── le filtre : six boutons neutres, le nom du thème dans sa couleur ── */
	.filtre {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1rem;
		margin: 0 0 var(--esp-32);
	}
	.temas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	@container pagina (min-width: 60rem) {
		.filtre {
			display: grid;
			grid-template-columns: 1fr auto;
		}
		.temas {
			display: grid;
			grid-template-columns: repeat(6, 1fr);
		}
		.tema {
			width: 100%;
			height: 100%;
		}
		.temas .tema-detalh {
			display: block;
		}
	}
	.tema {
		display: flex;
		align-items: center;
		padding: 0.5rem 0.85rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		text-align: start;
		cursor: pointer;
		transition:
			background-color 0.25s,
			border-color 0.25s;
	}
	.tema strong {
		display: block;
		color: var(--k);
	}
	.tema-detalh {
		display: none;
		font-size: 0.82rem;
		color: var(--t-tinta-2);
	}
	.tema:hover {
		border-color: var(--k);
	}
	.tema[aria-pressed='true'] {
		border-color: var(--k);
		box-shadow: inset 0 0 0 1px var(--k);
		background: color-mix(in srgb, var(--k) 13%, transparent);
	}
	/* B : la couleur n'est que dans les photos ; le bouton choisi prend l'aplat */
	.v-b .tema strong {
		color: inherit;
	}
	.v-b .tema:hover {
		border-color: var(--t-tinta-2);
	}
	.v-b .tema[aria-pressed='true'] {
		border-color: transparent;
		box-shadow: none;
		background: var(--aplat);
		color: var(--crema);
	}
	.v-b .tema[aria-pressed='true'] .tema-detalh {
		color: inherit;
	}
	.tot {
		padding: 0.4rem 0.2rem;
		border: none;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		text-decoration: underline 2px var(--t-accion);
		text-underline-offset: 0.2em;
		cursor: pointer;
	}
	.tema:focus-visible,
	.tot:focus-visible,
	.variantas button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.estat {
		grid-column: 1 / -1;
		margin: 0;
		color: var(--t-tinta-2);
		font-size: 0.92rem;
	}

	/* ── les cases ── */
	.fichas {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.7rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	@container pagina (min-width: 36rem) {
		.fichas {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@container pagina (min-width: 60rem) {
		.fichas {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.fichas li {
		display: grid;
	}
	.ficha {
		position: relative;
		isolation: isolate;
		display: grid;
		align-content: end;
		gap: 0.3rem;
		min-height: 7rem;
		padding: 0.9rem 1.05rem 0.85rem;
		border-radius: 6px;
		color: var(--t-tinta);
		text-decoration: none;
	}
	@container pagina (min-width: 36rem) {
		.ficha {
			min-height: 11rem;
		}
	}
	.ficha:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.ficha-tema {
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--k);
	}
	.ficha-tema:lang(ar) {
		letter-spacing: 0;
	}
	.ficha-titol {
		font-weight: 700;
		font-size: 1.28rem;
		line-height: 1.15;
		text-wrap: balance;
	}
	.ficha-modul {
		font-size: 0.82rem;
		color: var(--t-tinta-2);
	}
	.ficha-media {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		border-radius: inherit;
	}
	.ficha-media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			opacity 0.5s,
			transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ficha:hover .ficha-media img,
	.ficha:focus-visible .ficha-media img {
		transform: scale(1.04);
	}
	.dessenh {
		position: absolute;
		top: 0.7rem;
		inset-inline-end: 0.8rem;
		width: 5.2rem;
		height: 5.2rem;
		fill: none;
		stroke: var(--k);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	/* au téléphone, des cases plus basses : un dessin plus petit, loin du titre */
	@container pagina (max-width: 36rem) {
		.v-a .dessenh,
		.v-b .dessenh {
			width: 3.6rem;
			height: 3.6rem;
		}
	}
	/* la croix garde ses propres traits (couleurs du logo) */
	.dessenh.crotz {
		width: 4.4rem;
		height: 4.4rem;
		stroke: none;
	}
	.dessenh.crotz :global(svg) {
		display: block;
	}

	/* A · fond voilé : la photo transparente sur le fond de la page, un voile
	   qui s'épaissit vers le texte ; un filet fin tout autour */
	.v-a .ficha {
		border: 1px solid var(--t-linha);
		background: var(--t-fons-2);
	}
	.v-a .ficha-media img {
		opacity: 0.58;
	}
	:global([data-tema='clar']) .v-a .ficha-media img {
		opacity: 0.3;
	}
	.v-a .ficha-media::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			var(--t-fons-2) 6%,
			color-mix(in srgb, var(--t-fons-2) 58%, transparent) 48%,
			transparent 85%
		);
	}
	.v-a .ficha:hover .ficha-media img,
	.v-a .ficha:focus-visible .ficha-media img {
		opacity: 0.62;
	}
	:global([data-tema='clar']) .v-a .ficha:hover .ficha-media img {
		opacity: 0.45;
	}
	.v-a .dessenh {
		opacity: 0.6;
	}

	/* B · photo teintée : la photo en camaïeu de la couleur du thème */
	.v-b .ficha {
		background: var(--aplat);
		color: var(--crema);
	}
	.v-b .ficha-media img {
		filter: grayscale(1) contrast(1.08);
		mix-blend-mode: luminosity;
		opacity: 0.62;
	}
	.v-b .ficha-media::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(20, 8, 4, 0.62) 10%, rgba(20, 8, 4, 0.2) 60%, transparent);
	}
	.v-b .ficha:hover .ficha-media img {
		opacity: 0.8;
	}
	.v-b .ficha-tema,
	.v-b .ficha-modul {
		color: var(--crema);
	}
	.v-b .dessenh {
		stroke: var(--crema);
		opacity: 0.55;
	}

	/* C · photo au-dessus : la photo nette dans son cadre arrondi, le texte
	   dessous sur le fond de la page ; au téléphone, la photo à gauche */
	.v-c .fichas {
		row-gap: 1.6rem;
	}
	.v-c .ficha {
		align-content: start;
		grid-template-columns: 7.2rem 1fr;
		grid-template-rows: auto auto 1fr;
		column-gap: 0.9rem;
		min-height: 0;
		padding: 0;
	}
	.v-c .ficha-media {
		position: relative;
		inset: auto;
		z-index: auto;
		grid-row: 1 / span 3;
		aspect-ratio: 3 / 2;
		align-self: start;
		border-radius: 6px;
		background: var(--t-fons-2);
	}
	@container pagina (min-width: 36rem) {
		.v-c .ficha {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto 1fr;
		}
		.v-c .ficha-media {
			grid-row: auto;
			margin-bottom: 0.45rem;
		}
	}
	.v-c .dessenh {
		inset: 0;
		margin: auto;
		width: 52%;
		height: 72%;
	}
	.v-c .ficha:hover .ficha-titol,
	.v-c .ficha:focus-visible .ficha-titol {
		text-decoration: underline 2px var(--t-accion);
		text-underline-offset: 0.18em;
	}

	/* ── la tête d'une fiche, dans la même allure ── */
	.sostitol {
		margin: var(--esp-64) 0 var(--esp-16);
		font-size: 1rem;
		font-weight: 700;
		color: var(--t-tinta-2);
	}
	.cap {
		position: relative;
		isolation: isolate;
		display: grid;
		align-content: end;
		gap: 0.5rem;
		min-height: 15rem;
		padding: clamp(1.1rem, 3vw, 1.8rem) clamp(1.1rem, 3vw, 2rem);
		border-radius: 6px;
		overflow: hidden;
	}
	.cap-foto {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 70% 40%;
	}
	.cap-tema {
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--k);
	}
	.cap-tema:lang(ar) {
		letter-spacing: 0;
	}
	.cap-titol {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5.4vw, 3.6rem);
		line-height: 1.05;
		text-wrap: balance;
	}
	.v-a .cap {
		border: 1px solid var(--t-linha);
		background: var(--t-fons-2);
	}
	.v-a .cap-foto {
		opacity: 0.45;
	}
	:global([data-tema='clar']) .v-a .cap-foto {
		opacity: 0.32;
	}
	.v-a .cap::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(to top, var(--t-fons-2) 5%, color-mix(in srgb, var(--t-fons-2) 40%, transparent) 60%, transparent);
	}
	.v-b .cap {
		background: var(--aplat);
		color: var(--crema);
	}
	.v-b .cap-foto {
		filter: grayscale(1) contrast(1.08);
		mix-blend-mode: luminosity;
		opacity: 0.62;
	}
	.v-b .cap::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(to top, rgba(20, 8, 4, 0.6), transparent 70%);
	}
	.v-b .cap-tema {
		color: var(--crema);
	}
	.v-c .cap {
		min-height: 0;
		padding: 0;
		overflow: visible;
		border-radius: 0;
	}
	.v-c .cap-foto {
		position: static;
		z-index: auto;
		aspect-ratio: 21 / 9;
		height: auto;
		margin-bottom: 0.8rem;
		border-radius: 6px;
	}

	@media (prefers-reduced-motion: reduce) {
		.ficha-media img,
		.tema {
			transition: none;
		}
		.ficha:hover .ficha-media img {
			transform: none;
		}
	}
</style>
