<script>
	// Cultura (Se parla), à la place du wiki (Romain, 2026-11-04) : une case
	// de couleur par fiche, dans l'ordre du parcours ; le filtre du haut ne
	// garde qu'un thème, avec le même geste que la grammaire (les autres
	// s'effacent, celles du thème se rangent l'une après l'autre ; immédiat
	// avec « moins d'animation »). Le thème choisi reste dans l'adresse
	// (?tema=noms) : on le retrouve en revenant d'une fiche. Données :
	// $lib/cultura/index.js.
	//
	// Allure « photo teintée » (Romain, 2026-11-06, trois allures comparées sur
	// /cultura/ensag ; « pas ouf » avant) : chaque case montre une photo de
	// Romain passée dans la couleur de son thème ; la couleur n'est que là. Le
	// filtre est neutre, le thème choisi prend sa couleur. Sans photo : un
	// dessin au trait de Remira, la croix du logo, ou l'aplat seul. Photos et
	// dessins : $lib/cultura/imatges.js.
	import { onMount, tick } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';
	import Bulla from '$lib/components/Bulla.svelte';
	import Crotz from '$lib/components/Crotz.svelte';
	import MencionIA from '$lib/components/MencionIA.svelte';
	import { flip } from '$lib/components/flip.js';
	import { FICHAS, TEMAS, IU, nomModul } from '$lib/cultura/index.js';
	import { foto, srcset, COMMONS } from '$lib/cultura/imatges.js';
	import { IU as IU_G } from '$lib/gramatica/lengas.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

	let { data } = $props();

	let lang = $derived(langStore.current);
	let esOc = $derived(lang === 'oc');
	// la phrase part en occitan (comme la page du serveur) et prend la langue
	// choisie une fois la page montée
	let monte = $state(false);
	onMount(() => (monte = true));
	let FRASA = $derived((monte ? tria(IU.frasa) : IU.frasa.oc)(FICHAS.length));

	const temaValid = (id) => TEMAS.some((t) => t.id === id);
	const demandat = page.url.searchParams.get('tema');
	const temaInicial = temaValid(demandat) ? demandat : null;
	let filtre = $state(temaInicial);
	let tema = $derived(TEMAS.find((t) => t.id === filtre) ?? null);
	// le thème demandé : le bouton le montre tout de suite, la liste suit
	// après l'effacement
	let visat = $state(temaInicial);
	const nomTema = (id) => tria(TEMAS.find((t) => t.id === id)?.nom ?? {});
	const colorDe = (id) => TEMAS.find((t) => t.id === id)?.color ?? [];

	const triadas = (f) => FICHAS.filter((x) => !f || x.tema === f);
	let fichas = $derived(triadas(filtre));

	let lista = $state();
	let enCors = false;
	let seguent; // un clic pendant l'animation attend la fin, il n'est pas perdu
	async function triar(id) {
		const nou = id && id !== visat ? id : null;
		if (enCors) {
			seguent = { id: nou };
			visat = nou;
			return;
		}
		visat = nou;
		const url = new URL(page.url);
		if (nou) url.searchParams.set('tema', nou);
		else url.searchParams.delete('tema');
		if (nou === filtre) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			filtre = nou;
			replaceState(url, {});
			return;
		}
		enCors = true;
		try {
			await flip(lista, new Set(triadas(nou).map((x) => x.id)), async () => {
				filtre = nou;
				replaceState(url, {});
				await tick();
			});
		} finally {
			enCors = false;
			if (seguent) {
				const s = seguent;
				seguent = null;
				visat = filtre;
				triar(s.id ?? filtre);
			}
		}
	}
</script>

<svelte:head>
	<title>Cultura · Se parla · Lo Ligam</title>
	<meta name="description" content={tria(IU.descripcion)} />
</svelte:head>

<PaginaSimpla titol="Cultura" frasa={FRASA} parent={{ href: '/parla', nom: 'Se parla' }}>
	<div class="filtre">
		<ul class="temas" aria-label={tria(IU_G.triarTema)}>
			{#each TEMAS as t}
				<li>
					<button
						type="button"
						class="tema"
						style:--aplat={t.color[0]}
						style:--sus={t.color[1]}
						aria-pressed={visat === t.id}
						aria-describedby="b-tema-{t.id}"
						onclick={() => triar(t.id)}
					>
						<span><strong>{tria(t.nom)}</strong><span class="tema-detalh">{tria(t.detalh)}</span></span>
						<!-- en occitan, des exemples ; dans une autre langue, le nom occitan puis les exemples -->
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
		{#if visat}
			<button type="button" class="tot" onclick={() => triar(null)}>{tria(IU_G.totVeire)}</button>
		{/if}
		<p class="estat" aria-live="polite">{tema ? tria(IU_G.estat)(tria(tema.nom), fichas.length) : ''}</p>
	</div>

	<!-- ontouchstart vide : sans lui, Safari (iPhone) n'applique pas :active sous le doigt -->
	<ul class="fichas" aria-label={tria(IU.fichas)} bind:this={lista} ontouchstart={() => {}}>
		{#each fichas as f (f.id)}
			<li data-clau={f.id}>
				<a class="ficha" style:--aplat={colorDe(f.tema)[0]} style:--sus={colorDe(f.tema)[1]} href="/cultura/{f.id}" aria-describedby={esOc || tria(f.titol) === f.titol.oc ? undefined : `b-ficha-${f.id}`}>
					<span class="ficha-media" aria-hidden="true">
						{#if foto(f.id)}
							<img src="/cultura/{f.id}-480.webp" srcset={srcset(f.id)} sizes="(min-width: 1100px) 24rem, (min-width: 640px) 46vw, 92vw" alt="" loading="lazy" decoding="async" />
						{:else if data.dessenhs[f.id]?.length}
							<svg class="dessenh" viewBox="0 0 100 100">
								{#each data.dessenhs[f.id] as d}<path {d} />{/each}
							</svg>
						{:else if f.id === 'roge-e-aur'}
							<span class="dessenh crotz"><Crotz talha="100%" teula /></span>
						{/if}
					</span>
					<span class="ficha-tema" lang={lang}>{nomTema(f.tema)}</span>
					<span class="ficha-titol" lang={lang}>{tria(f.titol)}</span>
					<span class="ficha-modul">{tria(nomModul(f.modul))}</span>
					<!-- dans une autre langue, le titre occitan au survol (sauf s'il est le même : « Lo mas ») -->
					{#if !esOc && tria(f.titol) !== f.titol.oc}<Bulla id="b-ficha-{f.id}" text={f.titol.oc} />{/if}
				</a>
			</li>
		{/each}
	</ul>
	<!-- les fiches sans photo montrent un dessin de Remira, fait par IA (06-11) -->
	{#if fichas.some((f) => !foto(f.id) && data.dessenhs[f.id]?.length)}
		<MencionIA forma="linha" quina="dessenh" />
	{/if}
	<!-- crédit des photos libres de Wikimedia Commons (licence CC BY-SA) -->
	<p class="credits" lang={lang}>
		{tria(IU.fotosCommons)}
		{#each Object.values(COMMONS) as c, k}{#if k}{', '}{/if}<a href={c.ligam} target="_blank" rel="noopener noreferrer">{c.autor}</a>
			(<a href={c.licenciaLigam} target="_blank" rel="noopener noreferrer license">{c.licencia}</a>){/each}.
	</p>
</PaginaSimpla>

<style>
	/* le filtre, rangé comme celui de la grammaire : sur grand écran, six
	   colonnes avec le détail de chaque thème ; sur téléphone, les noms seuls,
	   à la suite */
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
	/* neutres, un filet fin ; le thème choisi prend sa couleur et un anneau
	   (la couleur ne dit pas seule qu'il est choisi) */
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
			border-color 0.25s,
			box-shadow 0.25s;
	}
	.tema strong {
		display: block;
	}
	.tema-detalh {
		display: none;
		font-size: 0.82rem;
		color: var(--t-tinta-2);
	}
	.tema:hover {
		border-color: var(--t-tinta-2);
	}
	.tema[aria-pressed='true'] {
		border-color: transparent;
		background: var(--aplat);
		color: var(--sus);
		box-shadow:
			0 0 0 2px var(--t-fons),
			0 0 0 4px var(--t-tinta);
	}
	.tema[aria-pressed='true'] .tema-detalh {
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
	.tot:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.estat {
		grid-column: 1 / -1;
		margin: 0;
		color: var(--t-tinta-2);
		font-size: 0.92rem;
	}

	/* les fiches : une case par fiche, de la couleur de son thème, la photo
	   passée dans cette couleur (sa lumière sur l'aplat) ; un voile sombre sous
	   le texte ; le nom du thème écrit dessus, pour ne pas dépendre de la
	   couleur seule */
	.fichas {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.6rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	/* au téléphone, des cases plus basses : trente fiches à la suite */
	@container pagina (min-width: 36rem) {
		.fichas {
			grid-template-columns: repeat(2, 1fr);
		}
		.fichas .ficha {
			min-height: 11rem;
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
	.credits {
		margin: var(--esp-32) 0 0;
		color: var(--t-tinta-2);
		font-size: 0.8rem;
	}
	.credits a {
		color: inherit;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.15em;
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
		background: var(--aplat);
		color: var(--sus);
		text-decoration: none;
		transition:
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.3s;
	}
	.ficha:hover,
	.ficha:focus-visible {
		transform: translateY(-3px);
		box-shadow: 0 12px 26px -12px rgba(0, 0, 0, 0.45);
	}
	.ficha:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
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
		filter: grayscale(1) contrast(1.08);
		mix-blend-mode: luminosity;
		opacity: 0.62;
		transition:
			filter 0.5s,
			opacity 0.5s,
			transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	/* sous la souris, au clavier ou sous le doigt : la photo reprend ses
	   vraies couleurs (Romain, 06-11 : « quand on survole avec la souris ou
	   le doigt, la case devrait afficher la vraie couleur de la photo ») */
	.ficha:hover .ficha-media img,
	.ficha:focus-visible .ficha-media img,
	.ficha:active .ficha-media img {
		filter: grayscale(0) contrast(1);
		opacity: 1;
		transform: scale(1.04);
	}
	.ficha-media::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(20, 8, 4, 0.62) 10%, rgba(20, 8, 4, 0.2) 60%, transparent);
	}
	/* sans photo : un dessin au trait dans un coin, couleur du texte */
	.dessenh {
		position: absolute;
		top: 0.7rem;
		inset-inline-end: 0.8rem;
		width: 5.2rem;
		height: 5.2rem;
		fill: none;
		stroke: var(--sus);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
		opacity: 0.55;
	}
	/* la croix garde ses traits et les couleurs du logo */
	.dessenh.crotz {
		width: 4.4rem;
		height: 4.4rem;
		stroke: none;
		opacity: 1;
	}
	.dessenh.crotz :global(svg) {
		display: block;
	}
	@container pagina (max-width: 36rem) {
		.dessenh {
			width: 3.6rem;
			height: 3.6rem;
		}
	}
	.ficha-tema {
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.ficha-tema:lang(ar) {
		letter-spacing: 0;
	}
	.ficha-modul {
		font-size: 0.82rem;
	}
	.ficha-titol {
		font-weight: 700;
		font-size: 1.28rem;
		line-height: 1.15;
		text-wrap: balance;
	}
	@media (prefers-reduced-motion: reduce) {
		.ficha,
		.tema,
		.ficha-media img {
			transition: none;
		}
		.ficha:hover .ficha-media img,
		.ficha:focus-visible .ficha-media img,
		.ficha:active .ficha-media img {
			transform: none;
		}
	}
</style>
