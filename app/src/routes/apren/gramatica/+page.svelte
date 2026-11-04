<script>
	// Le sommaire de la grammaire, dans S'apren (Romain, 2026-11-03 : « c'est
	// plutôt dans apprendre la langue ») : les notions dans l'ordre où l'élève
	// les rencontre dans le parcours, pas dans celui d'un livre ; sous chaque
	// notion, ses fiches en cases de couleur. Une fiche ajoutée dans
	// $lib/gramatica/fichas/ apparaît ici d'elle-même (mode d'emploi :
	// LEGIR-ME.md).
	// Depuis le 2026-11-04, chaque case prend la couleur de son thème, et le
	// filtre du haut ne garde qu'un thème, toujours dans l'ordre du parcours
	// (Romain : « pouvoir filtrer en haut, mais d'avoir ensuite les cases de
	// couleurs… dans l'ordre logique de l'apprentissage » ; piste 1 de
	// l'essai, choisie contre « rangé par thème » et « filet fin »). Le thème
	// choisi reste dans l'adresse (?tema=verb) : on le retrouve en revenant
	// d'une fiche.
	// Le geste (Romain, même jour : « il faut que les autres disparaissent et
	// que les cases de la catégorie sélectionnée bougent avec une animation et
	// se mettent les unes après les autres ») : les autres notions s'effacent,
	// puis celles du thème glissent de leur place à la nouvelle (technique
	// « FLIP » : on mesure avant, on change, on mesure après, on anime l'écart).
	// Moins de 1 s en tout ; avec « moins d'animation », le filtre est immédiat.
	import { tick } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';
	import { PARTS, TEMAS, fichasDe } from '$lib/gramatica/index.js';
	import { marcar } from '$lib/gramatica/marcar.js';

	const FRASA = marcar(
		'La grammaire de l’occitan, notion par notion, dans l’ordre où tu la rencontres dans le parcours. Chaque fiche cite ses sources. Les fiches arrivent une à une.'
	);

	let filtre = $state(TEMAS.some((t) => t.id === page.url.searchParams.get('tema')) ? page.url.searchParams.get('tema') : null);
	let tema = $derived(TEMAS.find((t) => t.id === filtre) ?? null);
	// le thème demandé : le bouton le montre tout de suite, la liste suit
	// après l'effacement
	let visat = $state(filtre);
	const nomTema = (id) => TEMAS.find((t) => t.id === id)?.fr ?? '';

	// les parties et les notions qui restent avec un filtre donné
	const triadas = (f) =>
		PARTS.map((p, n) => ({ ...p, n, capitols: p.capitols.filter((c) => !f || c.tema === f) })).filter((p) => p.capitols.length);
	let parts = $derived(triadas(filtre));

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
			await animar(nou, url);
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

	async function animar(nou, url) {
		// 1. où est chaque bloc avant ; ce qui reste après
		const restan = new Set(triadas(nou).flatMap((p) => [p.titol, ...p.capitols.map((c) => c.id)]));
		const blocs = () => [...lista.querySelectorAll('[data-clau]')];
		const avant = new Map(blocs().map((el) => [el.dataset.clau, el.getBoundingClientRect()]));
		// 2. ce qui part s'efface (au plus 0,3 s d'attente : un onglet en
		// arrière-plan fige les animations, le filtre ne doit pas rester bloqué)
		const partent = blocs().filter((el) => !restan.has(el.dataset.clau));
		await Promise.race([
			Promise.all(
				partent.map(
					(el) =>
						el.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(0.97)' }], {
							duration: 180,
							easing: 'ease-in',
							fill: 'forwards'
						}).finished
				)
			),
			new Promise((r) => setTimeout(r, 300))
		]);
		// 3. la liste change ; 4. ce qui reste glisse de son ancienne place,
		// ce qui arrive apparaît, l'un après l'autre
		filtre = nou;
		replaceState(url, {});
		await tick();
		let arrivee = 0;
		for (const el of blocs()) {
			const a = avant.get(el.dataset.clau);
			const b = el.getBoundingClientRect();
			if (a && a.width) {
				const dx = a.left - b.left;
				const dy = a.top - b.top;
				if (dx || dy)
					el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
						duration: 480,
						easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
					});
			} else {
				el.animate([{ opacity: 0, transform: 'translateY(0.6rem)' }, { opacity: 1, transform: 'none' }], {
					duration: 320,
					delay: Math.min(arrivee++ * 25, 400),
					easing: 'ease-out',
					fill: 'backwards'
				});
			}
		}
	}
	let compte = $derived(parts.reduce((n, p) => n + p.capitols.reduce((m, c) => m + fichasDe(c.id).length, 0), 0));
</script>

<svelte:head>
	<title>Gramatica · S’apren · Lo Ligam</title>
	<meta name="description" content="La grammaire de l’occitan, notion par notion, dans l’ordre du parcours de Lo Ligam." />
</svelte:head>

<PaginaSimpla titol="Gramatica" frasa={FRASA} parent={{ href: '/apren', nom: 'S’apren' }}>
	<div class="filtre">
		<ul class="temas" aria-label="Filtrer par thème">
			{#each TEMAS as t}
				<li>
					<button type="button" class="tema t-{t.id}" aria-pressed={visat === t.id} onclick={() => triar(t.id)}>
						<span class="mostra" aria-hidden="true"></span>
						<span><strong>{t.fr}</strong><span class="tema-detalh">{t.detalh}</span></span>
					</button>
				</li>
			{/each}
		</ul>
		{#if visat}
			<button type="button" class="tot" onclick={() => triar(null)}>Tout afficher</button>
		{/if}
		<p class="estat" aria-live="polite">{tema ? `${tema.fr} : ${compte} fiches, dans l’ordre du parcours.` : ''}</p>
	</div>

	<div class="parts" bind:this={lista}>
		{#each parts as p (p.titol)}
			<section class="part" aria-labelledby="part-{p.n}">
				<h2 id="part-{p.n}" data-clau={p.titol}>{p.titol}</h2>
				<ol class="capitols">
					{#each p.capitols as c (c.id)}
						{@const fichas = fichasDe(c.id)}
						<li class="capitol" class:a-fichas={fichas.length} data-clau={c.id}>
							<p class="capitol-nom">
								<span>{c.fr}{#if c.detalh}<span class="detalh">&nbsp;: {@html marcar(c.detalh)}</span>{/if}</span>
								{#if c.unitat}<span class="unitat">unité {c.unitat}</span>{/if}
							</p>
							{#if fichas.length}
								<ul class="fichas">
									{#each fichas as f (f.id)}
										<li>
											<a class="ficha t-{c.tema}" href="/apren/gramatica/{f.id}">
												<span class="ficha-cap">
													<span class="ficha-titol" lang="oc">{f.titol}</span>
													<span class="ficha-tema">{nomTema(c.tema)}</span>
												</span>
												<span class="ficha-resumit">{f.resumit}</span>
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ol>
			</section>
		{/each}
	</div>
</PaginaSimpla>

<style>
	/* chaque thème : sa couleur de case (accents de la charte, sans le rouge
	   du logo), le texte posé dessus (5,0 à 8,6 de contraste, mesuré le
	   2026-11-04) et la pastille de la légende */
	.t-sons {
		--aplat: #1f5f63;
		--sus: #fbf1e1;
	}
	.t-nom {
		--aplat: #55702f;
		--sus: #fbf1e1;
	}
	.t-pronoms {
		--aplat: #2f6a9c;
		--sus: #fbf1e1;
	}
	.t-verb {
		--aplat: #6b3a5b;
		--sus: #fbf1e1;
	}
	.t-frasa {
		--aplat: #eeaf34;
		--sus: #2a1a10;
	}

	/* le filtre : cinq cases de couleur ; sur grand écran, cinq colonnes avec
	   le détail de chaque thème ; sur téléphone, les noms seuls, à la suite */
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
	@container pagina (min-width: 56rem) {
		.filtre {
			display: grid;
			grid-template-columns: 1fr auto;
		}
		.temas {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
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
		text-align: left;
		cursor: pointer;
		transition: box-shadow 0.25s;
	}
	.tema strong {
		display: block;
	}
	.tema-detalh {
		display: none;
		font-size: 0.82rem;
		opacity: 0.85;
	}
	.mostra {
		flex: none;
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		background: var(--sus);
		opacity: 0.85;
	}
	/* le thème choisi : un anneau autour, et sa pastille devient une coche ;
	   les autres gardent leur couleur pleine (pâlis, ils perdaient le
	   contraste : 2,3 à 0,45 d'opacité, mesuré le 2026-11-04) */
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
		left: 0.2rem;
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

	.parts {
		display: grid;
		gap: var(--esp-48) var(--esp-32);
	}
	@container pagina (min-width: 56rem) {
		.capitols {
			columns: 2;
			column-gap: var(--esp-32);
		}
	}
	h2 {
		margin: 0 0 var(--esp-12);
		font-family: var(--font-body);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--t-aur);
	}
	.capitols {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.capitol {
		break-inside: avoid;
		padding: 0.55rem 0;
		border-top: 1px solid var(--t-linha);
	}
	.capitol-nom {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		margin: 0;
	}
	.capitol:not(.a-fichas) .capitol-nom {
		color: var(--t-tinta-2);
	}
	.detalh {
		color: var(--t-tinta-2);
		font-size: 0.92rem;
	}
	.unitat {
		flex: none;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.fichas {
		margin: 0.5rem 0 0.2rem;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.5rem;
	}
	/* une fiche : une case de la couleur de son thème, qui se clique, comme
	   celles de S'apren ; le nom du thème écrit dessus, pour ne pas dépendre
	   de la couleur seule */
	.ficha {
		display: grid;
		gap: 0.15rem;
		padding: 0.8rem 1rem;
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
	.ficha-cap {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.8rem;
	}
	.ficha-titol {
		font-weight: 700;
		font-size: 1.3rem;
		line-height: 1.1;
	}
	.ficha-tema {
		flex: none;
		font-size: 0.82rem;
		font-weight: 700;
	}
	.ficha-resumit {
		font-size: 0.95rem;
		line-height: 1.4;
	}
	@media (prefers-reduced-motion: reduce) {
		.ficha,
		.tema {
			transition: none;
		}
	}
</style>
