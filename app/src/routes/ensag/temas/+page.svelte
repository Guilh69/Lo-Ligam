<script>
	// Essai : un code couleur par thème dans le sommaire de la grammaire
	// (Romain, 2026-11-04 : « il pourrait y avoir un code couleur un peu plus
	// clair en fonction des thématiques »). Deux pistes sur les vraies fiches,
	// une à la fois (?piste=1 ou 2). Page de travail, non indexée.
	// Couleurs : les accents de la charte, sans le rouge du logo (réservé à ce
	// qui se clique, règle B). Contrastes mesurés le 2026-11-04 : texte sur
	// aplat 5,0 à 8,6 ; trait sur le fond 4,5 à 10,9 dans les deux thèmes.
	import { page } from '$app/state';
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';
	import { PARTS, fichasDe } from '$lib/gramatica/index.js';
	import { marcar } from '$lib/gramatica/marcar.js';

	const TEMAS = [
		{ id: 'sons', fr: 'Les sons', detalh: 'lire et prononcer' },
		{ id: 'nom', fr: 'Le nom', detalh: 'articles, adjectifs, nombres, accords' },
		{ id: 'pronoms', fr: 'Les pronoms', detalh: 'je, mon, celui-ci, quelqu’un' },
		{ id: 'verb', fr: 'Le verbe', detalh: 'les temps, les modes, les formes' },
		{ id: 'frasa', fr: 'La phrase', detalh: 'relier, nier, questionner, situer' }
	];
	const TEMA_DE = {
		sons: 'sons',
		'article-definit': 'nom',
		'article-indefinit': 'nom',
		'nom-adjectiu': 'nom',
		'placa-adjectiu': 'nom',
		acords: 'nom',
		grases: 'nom',
		nombres: 'nom',
		formacion: 'nom',
		'pronoms-personals': 'pronoms',
		possessius: 'pronoms',
		demonstratius: 'pronoms',
		indefinits: 'pronoms',
		present: 'verb',
		verb: 'verb',
		alternanca: 'verb',
		condicional: 'verb',
		pronominal: 'verb',
		imperatiu: 'verb',
		futur: 'verb',
		'tempses-compausats': 'verb',
		imperfach: 'verb',
		preterit: 'verb',
		subjonctiu: 'verb',
		passiu: 'verb',
		irregulars: 'verb',
		preposicions: 'frasa',
		adverbis: 'frasa',
		negacion: 'frasa',
		questions: 'frasa',
		conjoncions: 'frasa',
		condicion: 'frasa'
	};
	const nomTema = (id) => TEMAS.find((t) => t.id === id)?.fr ?? '';

	const PISTAS = [
		{ n: '1', nom: 'Cases de couleur', text: 'L’ordre du parcours ne bouge pas ; chaque case prend la couleur de son thème.' },
		{ n: '2', nom: 'Rangé par thème', text: 'Cinq blocs, un par thème ; dans chaque bloc, l’ordre du parcours et l’unité.' }
	];
	// La piste 3 (cases en verre fumé, filet de couleur à gauche) est retirée :
	// Romain, 2026-11-04, « typique… ça se voit partout sur Internet ».
	let piste = $derived(['1', '2'].includes(page.url.searchParams.get('piste')) ? page.url.searchParams.get('piste') : '1');

	// la légende met un thème en avant ; un clic ailleurs rend tout
	let tema = $state(null);
	function cliquer(e) {
		if (!e.target.closest('.legenda')) tema = null;
	}

	const tots = PARTS.flatMap((p) => p.capitols);
	const capitolsDe = (t) => tots.filter((c) => TEMA_DE[c.id] === t);
	const FRASA = marcar('Essai du 4 novembre : deux façons de donner une couleur à chaque thème. Touche une piste en haut pour changer.');
</script>

<svelte:head>
	<title>Essai · les couleurs des thèmes de la grammaire · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<svelte:window onclick={cliquer} />

<PaginaSimpla titol="Gramatica" frasa={FRASA} parent={{ href: '/apren/gramatica', nom: 'Gramatica' }}>
	<nav class="pistas" aria-label="Pistes de l’essai">
		{#each PISTAS as p}
			<a class="pista" href="?piste={p.n}" aria-current={piste === p.n ? 'page' : undefined} data-sveltekit-noscroll data-sveltekit-replacestate>
				<span class="pista-nom">Piste {p.n} · {p.nom}</span>
				<span class="pista-text">{p.text}</span>
			</a>
		{/each}
	</nav>

	{#snippet legenda(fin)}
		<ul class="legenda" class:fin aria-label="Les thèmes">
			{#each TEMAS as t}
				<li>
					<button
						type="button"
						class="tema-boton t-{t.id}"
						aria-pressed={tema === t.id}
						onclick={() => (tema = tema === t.id ? null : t.id)}
					>
						<span class="mostra" aria-hidden="true"></span>
						<span><strong>{t.fr}</strong><span class="tema-detalh">{t.detalh}</span></span>
					</button>
				</li>
			{/each}
			{#if tema}
				<li class="tot"><button type="button" class="tot-boton" onclick={() => (tema = null)}>Tout afficher</button></li>
			{/if}
		</ul>
	{/snippet}

	{#snippet cartaFicha(f, c, fin)}
		{@const t = TEMA_DE[c.id]}
		<li>
			<a class="ficha t-{t}" class:fin class:esvanida={tema && tema !== t} href="/apren/gramatica/{f.id}">
				<span class="ficha-cap">
					<span class="ficha-titol" lang="oc">{f.titol}</span>
					{#if piste !== '2'}<span class="ficha-tema">{nomTema(t)}</span>{/if}
				</span>
				<span class="ficha-resumit">{f.resumit}</span>
			</a>
		</li>
	{/snippet}

	{#snippet capitol(c, fin)}
		{@const fichas = fichasDe(c.id)}
		<li class="capitol">
			<p class="capitol-nom">
				<span>{c.fr}{#if c.detalh}<span class="detalh">&nbsp;: {@html marcar(c.detalh)}</span>{/if}</span>
				<span class="unitat">{c.unitat ? `unité ${c.unitat}` : 'plus loin'}</span>
			</p>
			{#if fichas.length}
				<ul class="fichas">
					{#each fichas as f (f.id)}{@render cartaFicha(f, c, fin)}{/each}
				</ul>
			{/if}
		</li>
	{/snippet}

	{#if piste === '2'}
		<div class="temas">
			{#each TEMAS as t}
				<section class="tema t-{t.id}" aria-labelledby="tema-{t.id}">
					<header class="tema-cap">
						<span class="mostra gran" aria-hidden="true"></span>
						<h2 id="tema-{t.id}">{t.fr}</h2>
						<p>{t.detalh}</p>
					</header>
					<ol class="capitols">
						{#each capitolsDe(t.id) as c (c.id)}{@render capitol(c, false)}{/each}
					</ol>
				</section>
			{/each}
		</div>
	{:else}
		{@render legenda(piste === '3')}
		<div class="parts">
			{#each PARTS as p, i}
				<section class="part" aria-labelledby="part-{i}">
					<h2 id="part-{i}">{p.titol}</h2>
					<ol class="capitols">
						{#each p.capitols as c (c.id)}{@render capitol(c, piste === '3')}{/each}
					</ol>
				</section>
			{/each}
		</div>
	{/if}
</PaginaSimpla>

<style>
	/* chaque thème : son aplat (fond de case), le texte posé dessus, et son
	   trait (texte ou filet sur le fond de la page), éclairci sur le sombre,
	   assombri sur le clair */
	.t-sons {
		--aplat: #1f5f63;
		--sus: #fbf1e1;
		--trait: #86cbc6;
	}
	.t-nom {
		--aplat: #55702f;
		--sus: #fbf1e1;
		--trait: #b8d27c;
	}
	.t-pronoms {
		--aplat: #2f6a9c;
		--sus: #fbf1e1;
		--trait: #8cc3f0;
	}
	.t-verb {
		--aplat: #6b3a5b;
		--sus: #fbf1e1;
		--trait: #e3a0cf;
	}
	.t-frasa {
		--aplat: #eeaf34;
		--sus: #2a1a10;
		--trait: #f6b73c;
	}
	:global(:root[data-tema='clar']) .t-sons {
		--trait: #1f5f63;
	}
	:global(:root[data-tema='clar']) .t-nom {
		--trait: #47602a;
	}
	:global(:root[data-tema='clar']) .t-pronoms {
		--trait: #255d90;
	}
	:global(:root[data-tema='clar']) .t-verb {
		--trait: #7a3b69;
	}
	:global(:root[data-tema='clar']) .t-frasa {
		--trait: #9c5611;
	}

	/* les pistes de l'essai */
	.pistas {
		display: grid;
		gap: 0.6rem;
		margin: 0 0 var(--esp-32);
	}
	@container pagina (min-width: 56rem) {
		.pistas {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.pista {
		display: grid;
		gap: 0.2rem;
		padding: 0.7rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		color: var(--t-tinta);
		text-decoration: none;
	}
	.pista[aria-current] {
		border-color: var(--t-aur);
		box-shadow: inset 0 0 0 1px var(--t-aur);
	}
	.pista-nom {
		font-weight: 700;
	}
	.pista[aria-current] .pista-nom {
		color: var(--t-aur);
	}
	.pista-text {
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}

	/* la légende */
	.legenda {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0 0 var(--esp-32);
		padding: 0;
		list-style: none;
	}
	/* sur grand écran, cinq colonnes et le détail de chaque thème ; sur
	   téléphone, les noms seuls, à la suite */
	@container pagina (min-width: 56rem) {
		.legenda {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
		}
		.legenda .tema-boton {
			width: 100%;
			height: 100%;
		}
		.legenda .tema-detalh {
			display: block;
		}
	}
	.tema-boton {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.85rem 0.5rem 0.55rem;
		border: 1px solid transparent;
		border-radius: 6px;
		background: var(--aplat);
		color: var(--sus);
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition: opacity 0.25s;
	}
	.tema-boton strong {
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
	.legenda:has([aria-pressed='true']) .tema-boton:not([aria-pressed='true']) {
		opacity: 0.4;
	}
	.tot-boton {
		padding: 0.4rem 0.2rem;
		border: none;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		text-decoration: underline 2px var(--t-accion);
		text-underline-offset: 0.2em;
		cursor: pointer;
	}
	@container pagina (min-width: 56rem) {
		.legenda:has(.tot) {
			grid-template-columns: repeat(5, 1fr) auto;
		}
	}
	.tema-boton:focus-visible,
	.tot-boton:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	/* la légende en version fine : un point de couleur, un filet */
	.legenda.fin .tema-boton {
		background: transparent;
		color: var(--t-tinta);
		border-color: var(--t-linha);
	}
	.legenda.fin .tema-boton[aria-pressed='true'] {
		border-color: var(--trait);
	}
	.legenda.fin .mostra {
		background: var(--trait);
		opacity: 1;
	}
	.legenda.fin .tema-detalh {
		color: var(--t-tinta-2);
		opacity: 1;
	}

	/* le sommaire, comme la vraie page */
	.parts,
	.temas {
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

	/* une fiche : la case de couleur de son thème */
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
			box-shadow 0.3s,
			opacity 0.25s;
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
	.ficha.esvanida {
		opacity: 0.45;
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
	/* la case fine : verre fumé, un filet de couleur à gauche */
	.ficha.fin {
		background: var(--t-veire);
		color: var(--t-tinta);
		border: 1px solid var(--t-linha);
		border-left: 2px solid var(--trait);
	}
	.ficha.fin .ficha-tema {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--trait);
		opacity: 1;
	}
	.ficha.fin .ficha-tema::before {
		content: '';
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--trait);
	}
	.ficha.fin .ficha-resumit {
		color: var(--t-tinta-2);
	}

	/* piste 2 : un bloc par thème, lu ligne par ligne (l'ordre du parcours
	   de gauche à droite) ; un thème d'une seule notion (les sons) range ses
	   fiches sur deux colonnes */
	.tema .capitol:first-child {
		border-top: none;
		padding-top: 0;
	}
	@container pagina (min-width: 56rem) {
		.tema .capitols {
			columns: auto;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			column-gap: var(--esp-32);
			align-items: start;
		}
		.tema .capitol:nth-child(2) {
			border-top: none;
			padding-top: 0;
		}
		.tema .capitols:has(> .capitol:only-child) {
			grid-template-columns: 1fr;
		}
		.tema .capitols:has(> .capitol:only-child) .fichas {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.tema-cap {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		column-gap: 0.7rem;
		margin: 0 0 var(--esp-12);
		padding-bottom: 0.6rem;
		border-bottom: 2px solid var(--trait);
	}
	.tema-cap h2 {
		margin: 0;
		font-size: 1.6rem;
		color: var(--trait);
	}
	.tema-cap p {
		grid-column: 2;
		margin: 0;
		color: var(--t-tinta-2);
	}
	.mostra.gran {
		width: 1.1rem;
		height: 1.1rem;
		background: var(--trait);
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.ficha,
		.tema-boton {
			transition: none;
		}
	}
</style>
