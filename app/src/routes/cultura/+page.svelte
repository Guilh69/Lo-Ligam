<script>
	// Cultura (Se parla), à la place du wiki (Romain, 2026-11-04) : une case
	// de couleur par fiche, dans l'ordre du parcours ; le filtre du haut ne
	// garde qu'un thème, avec le même geste que la grammaire (les autres
	// s'effacent, celles du thème se rangent l'une après l'autre ; immédiat
	// avec « moins d'animation »). Le thème choisi reste dans l'adresse
	// (?tema=noms) : on le retrouve en revenant d'une fiche. Données :
	// $lib/cultura/index.js.
	import { onMount, tick } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';
	import Bulla from '$lib/components/Bulla.svelte';
	import { flip } from '$lib/components/flip.js';
	import { FICHAS, TEMAS, IU, nomModul } from '$lib/cultura/index.js';
	import { IU as IU_G } from '$lib/gramatica/lengas.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

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
						<span class="mostra" aria-hidden="true"></span>
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

	<ul class="fichas" aria-label={tria(IU.fichas)} bind:this={lista}>
		{#each fichas as f (f.id)}
			<li data-clau={f.id}>
				<a class="ficha" style:--aplat={colorDe(f.tema)[0]} style:--sus={colorDe(f.tema)[1]} href="/cultura/{f.id}" aria-describedby={esOc || tria(f.titol) === f.titol.oc ? undefined : `b-ficha-${f.id}`}>
					<span class="ficha-tema">{nomTema(f.tema)}</span>
					<span class="ficha-titol" lang={lang}>{tria(f.titol)}</span>
					<span class="ficha-modul">{tria(nomModul(f.modul))}</span>
					<!-- dans une autre langue, le titre occitan au survol (sauf s'il est le même : « Lo mas ») -->
					{#if !esOc && tria(f.titol) !== f.titol.oc}<Bulla id="b-ficha-{f.id}" text={f.titol.oc} />{/if}
				</a>
			</li>
		{/each}
	</ul>
</PaginaSimpla>

<style>
	/* le filtre, comme celui de la grammaire : six cases de couleur ; sur
	   grand écran, six colonnes avec le détail de chaque thème ; sur
	   téléphone, les noms seuls, à la suite */
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
		gap: 0.6rem;
		padding: 0.5rem 0.85rem 0.5rem 0.55rem;
		border: none;
		border-radius: 6px;
		background: var(--aplat);
		color: var(--sus);
		font: inherit;
		text-align: start;
		cursor: pointer;
		transition: box-shadow 0.25s;
	}
	.tema strong {
		display: block;
	}
	.tema-detalh {
		display: none;
		font-size: 0.82rem;
	}
	.mostra {
		flex: none;
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		background: var(--sus);
		opacity: 0.85;
	}
	/* le thème choisi : un anneau autour, et sa pastille devient une coche */
	.tema[aria-pressed='true'] .mostra {
		background: none;
		border: 2px solid var(--sus);
		opacity: 1;
		position: relative;
	}
	.tema[aria-pressed='true'] {
		box-shadow:
			0 0 0 2px var(--t-fons),
			0 0 0 4px var(--t-tinta);
	}
	.tema[aria-pressed='true'] .mostra::after {
		content: '';
		position: absolute;
		inset-inline-start: 0.2rem;
		top: 0;
		width: 0.25rem;
		height: 0.46rem;
		border: solid var(--sus);
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
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

	/* les fiches : une case par fiche, de la couleur de son thème, comme les
	   cases de S'apren ; le nom du thème écrit dessus, pour ne pas dépendre de
	   la couleur seule */
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
			min-height: 9rem;
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
		display: grid;
		grid-template-rows: auto 1fr auto;
		gap: 0.35rem;
		min-height: 6rem;
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
	.ficha-tema,
	.ficha-modul {
		font-size: 0.82rem;
		font-weight: 700;
	}
	.ficha-modul {
		font-weight: 400;
	}
	.ficha-titol {
		font-weight: 700;
		font-size: 1.3rem;
		line-height: 1.15;
		text-wrap: balance;
	}
	@media (prefers-reduced-motion: reduce) {
		.ficha,
		.tema {
			transition: none;
		}
	}
</style>
