<script>
	// Page d'essai de la littérature (2026-10-25, Romain : même méthode que les
	// médias, dans les verts d'Òbras). Trois présentations à comparer,
	// inspirées des sites qui recensent les livres :
	//   A. la bibliothèque (les étagères des sites de lecteurs : des dos de
	//      livres, on en tire un) ;
	//   B. le fichier (les fiches des catalogues de bibliothèque) ;
	//   C. les cases (le langage des pages de rubrique, avec pictogramme).
	// Deux groupes : les éditeurs, puis où trouver les livres. Chaque entrée
	// mène à son site. Données dans $lib/ensag/maqueta.js.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import { PALETAS } from '$lib/apren/teulas.js';
	import { LIBRES } from '$lib/ensag/maqueta.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let fr = $derived(langStore.current === 'fr');
	const t = {
		oc: {
			titol: 'Literatura',
			frasa: 'Los editors en occitan, e ont trobar los libres.',
			editors: 'Los editors',
			trobar: 'Ont trobar los libres',
			veire: 'Veire',
			fondat: 'Fondat en'
		},
		fr: {
			titol: 'Littérature',
			frasa: 'Les éditeurs en occitan, et où trouver les livres.',
			editors: 'Les éditeurs',
			trobar: 'Où trouver les livres',
			veire: 'Voir',
			fondat: 'Fondé en'
		}
	};
	let tx = $derived(t[fr ? 'fr' : 'oc']);
	const s = (o) => (fr ? o.fr : o.oc);

	const VISTAS = [
		['bibloteca', 'A. La bibliothèque'],
		['fichièr', 'B. Le fichier'],
		['teulas', 'C. Les cases']
	];
	let vista = $state('bibloteca');

	const VERD = PALETAS.verd;
	const color = (i) => VERD[i % VERD.length];
	const GROPS = $derived([
		{ id: 'editor', nom: tx.editors, lista: LIBRES.filter((l) => l.grop === 'editor') },
		{ id: 'trobar', nom: tx.trobar, lista: LIBRES.filter((l) => l.grop === 'trobar') }
	]);
	// les dos de livres : hauteur et largeur un peu différentes d'un livre à l'autre
	const DOS = [
		[92, 4.6], [80, 3.8], [100, 4.2], [86, 5], [96, 4], [84, 4.4]
	];
	// la bibliothèque : le livre survolé (ou touché au clavier) se présente à droite
	let causit = $state(0);
	const libre = $derived(LIBRES[causit]);
</script>

<svelte:head>
	<title>Literatura (maqueta) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="literatura">
	<nav class="camin" aria-label={fr ? 'Fil d’Ariane' : 'Camin'}>
		<a href="/ensag/parla">{fr ? 'Se parle' : 'Se parla'}</a><span aria-hidden="true">›</span>
		<a href="/ensag/obras">{fr ? 'Œuvres' : 'Òbras'}</a><span aria-hidden="true">›</span>
		<span aria-current="page">{tx.titol}</span>
	</nav>

	<header class="cap">
		<h1 lang={fr ? 'fr' : 'oc'}>{tx.titol}</h1>
		<p class="frasa" lang={fr ? 'fr' : 'oc'}>{tx.frasa}</p>
	</header>

	<div class="vistas" role="group" aria-label="Présentation">
		{#each VISTAS as [v, nom] (v)}
			<button type="button" aria-pressed={vista === v} onclick={() => (vista = v)}>{nom}</button>
		{/each}
	</div>

	{#if vista === 'bibloteca'}
		<!-- A. La bibliothèque : un dos de livre par entrée, la fiche du livre tiré à droite -->
		<div class="bibloteca">
			<div class="laissas">
				{#each GROPS as g (g.id)}
					<div class="laissa-grop">
						<ul class="laissa" aria-label={g.nom}>
							{#each g.lista as l (l.id)}
								{@const k = LIBRES.indexOf(l)}
								{@const [fons, tinta] = color(k)}
								{@const [naut, larg] = DOS[k % DOS.length]}
								<li class="libre" class:tirat={causit === k} style:--fons={fons} style:--tinta={tinta} style:--naut="{naut}%" style:--larg="{larg}rem" style:--i={k}>
									<a href={l.site} target="_blank" rel="noopener noreferrer" class="dos" onmouseenter={() => (causit = k)} onfocus={() => (causit = k)}>
										<span class="dos-nom" lang="oc">{l.nom}</span>
									</a>
								</li>
							{/each}
						</ul>
						<p class="laissa-nom" lang={fr ? 'fr' : 'oc'}>{g.nom}</p>
					</div>
				{/each}
			</div>
			<div class="pagina-libre" aria-live="polite">
				{#key causit}
					<div class="pl-contengut">
						<span class="pl-sorta" lang={fr ? 'fr' : 'oc'}>{s(libre.sorta)}{#if libre.an} · {libre.an}{/if}</span>
						<strong class="pl-nom" lang="oc">{libre.nom}</strong>
						<p class="pl-tèxt" lang={fr ? 'fr' : 'oc'}>{s(libre.tèxt)}</p>
						<a class="pl-veire" href={libre.site} target="_blank" rel="noopener noreferrer">{tx.veire} <Icona nom="extern" size="1em" /></a>
					</div>
				{/key}
			</div>
		</div>
	{:else}
	{#each GROPS as g, gi (g.id)}
		<section class="grop">
			<h2 class="grop-nom" lang={fr ? 'fr' : 'oc'}>{g.nom}</h2>

			{#if vista === 'fichièr'}
				<!-- B. Le fichier : une fiche de catalogue par entrée -->
				<ul class="fichas">
					{#each g.lista as l, i (l.id)}
						{@const k = LIBRES.indexOf(l)}
						<li class="ficha" style:--i={k} style:--r="{[-0.8, 0.6, -0.4, 0.9][k % 4]}deg">
							<span class="ficha-cota" aria-hidden="true">OC · {String(k + 1).padStart(3, '0')}</span>
							<a href={l.site} target="_blank" rel="noopener noreferrer" class="ficha-nom" lang="oc">{l.nom}</a>
							<dl>
								<dt lang={fr ? 'fr' : 'oc'}>{fr ? 'Genre' : 'Mena'}</dt>
								<dd lang={fr ? 'fr' : 'oc'}>{s(l.sorta)}</dd>
								{#if l.an}
									<dt lang={fr ? 'fr' : 'oc'}>{tx.fondat}</dt>
									<dd>{l.an}</dd>
								{/if}
							</dl>
							<p class="ficha-tèxt" lang={fr ? 'fr' : 'oc'}>{s(l.tèxt)}</p>
							<span class="ficha-veire" aria-hidden="true">{tx.veire} <Icona nom="extern" size="0.9em" /></span>
							<span class="ficha-trauc" aria-hidden="true"></span>
						</li>
					{/each}
				</ul>
			{:else}
				<!-- C. Les cases : comme les pages de rubrique, dans les verts d'Òbras -->
				<ul class="teulas">
					{#each g.lista as l, i (l.id)}
						{@const k = LIBRES.indexOf(l)}
						{@const [fons, tinta] = color(k)}
						<li class="teula" class:granda={k === 0} style:--fons={fons} style:--tinta={tinta} style:--i={k}>
							<span class="num" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
							<a href={l.site} target="_blank" rel="noopener noreferrer" class="teula-ligam"><span class="nom" lang="oc">{l.nom}</span></a>
							<p class="sota" lang={fr ? 'fr' : 'oc'}>{s(l.tèxt)}</p>
							<span class="picto-plaça"><Pictograma nom={l.grop === 'editor' ? 'literatura' : 'articles'} size={k === 0 ? '6rem' : '3.2rem'} /></span>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	{/each}
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
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, #55702f 14%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.literatura {
		container: literatura / inline-size;
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(1.5rem, 4vh, 3rem) var(--marge) var(--esp-96);
	}
	.camin {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: var(--esp-24);
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.camin a {
		color: inherit;
		text-decoration-color: var(--t-terra);
		text-underline-offset: 3px;
	}
	.cap {
		margin: 0 0 var(--esp-32, 2rem);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3.2rem, 11vw, 8rem);
		line-height: 0.95;
	}
	.frasa {
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		color: var(--t-tinta-2);
	}

	/* le choix de la présentation (maquette seulement) */
	.vistas {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: var(--esp-32, 2rem);
		padding: 0.3rem;
		border: 1px dashed var(--t-linha);
		border-radius: 999px;
	}
	.vistas button {
		padding: 0.45rem 1rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--t-tinta-2);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.vistas button[aria-pressed='true'] {
		background: #879764;
		color: #2a1a10;
	}

	.grop + .grop {
		margin-top: var(--esp-48);
	}
	.grop-nom {
		margin: 0 0 var(--esp-16);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.5rem, 2.6vw, 2.2rem);
		color: #b0b791;
	}

	/* ---------- A. La bibliothèque ---------- */
	.bibloteca {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(16rem, 22rem);
		align-items: end;
		gap: var(--esp-32, 2rem);
	}
	.laissas {
		display: flex;
		align-items: flex-end;
		padding: 0 var(--esp-24);
		/* l'étagère : une planche verte sous tous les livres */
		border-bottom: 1rem solid #353c1a;
		box-shadow: 0 14px 20px -12px rgba(0, 0, 0, 0.7);
	}
	.laissa-grop {
		position: relative;
		display: flex;
		flex-direction: column;
	}
	/* le serre-livres entre les deux groupes */
	.laissa-grop + .laissa-grop {
		margin-left: var(--esp-32, 2rem);
		padding-left: var(--esp-32, 2rem);
		border-left: 0.6rem solid #425223;
	}
	.laissa {
		display: flex;
		align-items: flex-end;
		gap: 0.3rem;
		height: 24rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.laissa-nom {
		position: absolute;
		top: calc(100% + 1.5rem);
		left: 0;
		margin: 0;
		color: #b0b791;
		font-size: 0.9rem;
		font-weight: 700;
		white-space: nowrap;
	}
	.laissa-grop + .laissa-grop .laissa-nom {
		left: calc(var(--esp-32, 2rem) + 0.6rem);
	}
	.libre {
		position: relative;
		height: var(--naut);
	}
	.dos {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--larg);
		height: 100%;
		padding: 1rem 0;
		border-radius: 3px 3px 0 0;
		/* le dos : deux filets en haut et en bas, comme une reliure */
		background:
			linear-gradient(var(--tinta), var(--tinta)) center 1.4rem / 70% 2px no-repeat,
			linear-gradient(var(--tinta), var(--tinta)) center calc(100% - 1.4rem) / 70% 2px no-repeat,
			linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 25%, transparent 75%, rgba(0, 0, 0, 0.22)),
			var(--fons);
		color: var(--tinta);
		text-decoration: none;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
		transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 70ms);
	}
	.dos-nom {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		font-family: var(--font-heading);
		font-size: clamp(1.1rem, 1.8vw, 1.6rem);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		white-space: nowrap;
	}
	/* le livre tiré dépasse des autres */
	.libre.tirat .dos,
	.dos:focus-visible {
		transform: translateY(-1.6rem);
		outline: none;
	}
	.dos:focus-visible {
		box-shadow: 0 0 0 3px #b0b791;
	}
	/* la fiche du livre tiré, comme une page ouverte */
	.pagina-libre {
		align-self: stretch;
		display: flex;
		margin-bottom: 1rem;
		border-radius: 6px;
		background:
			linear-gradient(90deg, rgba(0, 0, 0, 0.12), transparent 6%),
			#f3efdc;
		color: #2a1a10;
		box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.8);
	}
	.pl-contengut {
		display: flex;
		flex-direction: column;
		gap: var(--esp-12);
		width: 100%;
		padding: var(--esp-32, 2rem);
		animation: virar 0.35s ease-out;
	}
	@keyframes virar {
		from {
			opacity: 0;
			transform: translateX(10px);
		}
	}
	.pl-sorta {
		color: #425223;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.pl-nom {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 3vw, 2.6rem);
		line-height: 1.05;
	}
	.pl-tèxt {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.5;
	}
	.pl-veire {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		gap: 0.4rem;
		margin-top: auto;
		padding: 0.6rem 1.3rem;
		border-radius: 999px;
		background: #b53d17;
		color: #fbf1e1;
		font-weight: 700;
		text-decoration: none;
	}
	.pl-veire:hover {
		background: #c9471d;
	}
	@keyframes arribar {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	/* ---------- B. Le fichier ---------- */
	.fichas {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
		gap: var(--esp-24);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.ficha {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-height: 15rem;
		padding: 1.1rem 1.3rem 2.2rem;
		border-radius: 3px;
		/* la fiche bristol : un filet rouge en haut, des lignes vertes ensuite */
		background:
			linear-gradient(#b53d17, #b53d17) 0 3.2rem / 100% 1px no-repeat,
			repeating-linear-gradient(transparent 0 1.55rem, rgba(66, 82, 35, 0.22) 1.55rem calc(1.55rem + 1px)) 0 3.3rem / 100% auto no-repeat,
			#f3efdc;
		color: #2a1a10;
		box-shadow: 0 12px 24px -14px rgba(0, 0, 0, 0.8);
		transform: rotate(var(--r));
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 70ms);
	}
	.ficha-cota {
		position: absolute;
		top: 1.1rem;
		right: 1.3rem;
		color: #425223;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
	}
	.ficha-nom {
		padding-right: 5.5rem;
		font-family: var(--font-heading);
		font-size: clamp(1.4rem, 2vw, 1.8rem);
		line-height: 1.1;
		color: inherit;
		text-decoration: none;
	}
	.ficha-nom::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0 0.8rem;
		margin: 0.6rem 0 0;
		font-size: 0.9rem;
		line-height: 1.55rem;
	}
	dt {
		color: #425223;
		font-weight: 700;
	}
	dd {
		margin: 0;
	}
	.ficha-tèxt {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.55rem;
	}
	.ficha-veire {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-top: auto;
		font-weight: 700;
		color: #b53d17;
	}
	/* le trou de la tringle du fichier, en bas au milieu */
	.ficha-trauc {
		position: absolute;
		bottom: 0.7rem;
		left: 50%;
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 50%;
		background: var(--t-fons);
		transform: translateX(-50%);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
	}
	.ficha:hover,
	.ficha:focus-within {
		transform: translateY(-6px) rotate(0deg);
		box-shadow: 0 20px 30px -14px rgba(0, 0, 0, 0.85);
	}
	.ficha:has(.ficha-nom:focus-visible) {
		outline: 3px solid #b0b791;
		outline-offset: 3px;
	}
	.ficha-nom:focus-visible {
		outline: none;
	}

	/* ---------- C. Les cases ---------- */
	.teulas {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.teula {
		position: relative;
		display: flex;
		flex-direction: column;
		aspect-ratio: 1;
		padding: var(--esp-16);
		border-radius: 6px;
		background: var(--fons);
		color: var(--tinta);
		overflow: clip;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 70ms);
	}
	.teula.granda {
		grid-column: span 2;
		grid-row: span 2;
		padding: var(--esp-32, 2rem);
	}
	.num {
		font-family: var(--font-heading);
		font-size: 2.4rem;
		line-height: 1;
	}
	.granda .num {
		font-size: 4.5rem;
	}
	.teula-ligam {
		margin-top: var(--esp-8);
		color: inherit;
		text-decoration: none;
	}
	.teula-ligam::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	.nom {
		display: block;
		font-family: var(--font-heading);
		font-size: clamp(1.25rem, 1.9vw, 1.6rem);
		line-height: 1.1;
		text-transform: uppercase;
	}
	.granda .nom {
		font-size: clamp(2rem, 4vw, 3.4rem);
	}
	.sota {
		max-width: 30ch;
		margin: var(--esp-8) 0 0;
		font-size: 0.95rem;
		line-height: 1.45;
	}
	.granda .sota {
		font-size: clamp(1.05rem, 1.4vw, 1.25rem);
	}
	.picto-plaça {
		display: flex;
		justify-content: flex-end;
		margin-top: auto;
		transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.teula:hover,
	.teula:focus-within {
		transform: translateY(-4px);
		box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
	}
	.teula:hover .picto-plaça,
	.teula:focus-within .picto-plaça {
		transform: scale(1.08) rotate(-4deg);
	}
	.teula:has(.teula-ligam:focus-visible) {
		outline: 3px solid #b0b791;
		outline-offset: 3px;
	}
	.teula-ligam:focus-visible {
		outline: none;
	}

	/* téléphone : les livres couchés en pile, les fiches et les cases en colonne */
	@container literatura (max-width: 640px) {
		.bibloteca {
			grid-template-columns: 1fr;
		}
		.laissas {
			flex-direction: column;
			align-items: stretch;
			padding: 0;
			border-bottom: 0;
			box-shadow: none;
		}
		.laissa-grop + .laissa-grop {
			margin: var(--esp-24) 0 0;
			padding: 0;
			border-left: 0;
		}
		.laissa-nom,
		.laissa-grop + .laissa-grop .laissa-nom {
			position: static;
			order: -1;
			margin-bottom: var(--esp-8);
		}
		/* les livres couchés en pile, sur une planche */
		.laissa {
			flex-direction: column-reverse;
			align-items: stretch;
			gap: 0.3rem;
			height: auto;
			border-bottom: 0.7rem solid #353c1a;
		}
		.libre {
			height: auto;
			width: var(--naut);
			margin-left: calc((100% - var(--naut)) / 2);
		}
		.dos {
			width: 100%;
			height: auto;
			min-height: 3.2rem;
			padding: 0.5rem 1rem;
			border-radius: 3px;
			background:
				linear-gradient(var(--tinta), var(--tinta)) 1rem center / 2px 60% no-repeat,
				linear-gradient(var(--tinta), var(--tinta)) calc(100% - 1rem) center / 2px 60% no-repeat,
				linear-gradient(rgba(0, 0, 0, 0.15), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.2)),
				var(--fons);
		}
		.dos-nom {
			writing-mode: horizontal-tb;
			transform: none;
		}
		.libre.tirat .dos,
		.dos:focus-visible {
			transform: translateX(0.6rem);
		}
		/* au téléphone, toucher un livre ouvre son site : pas de fiche à côté */
		.pagina-libre {
			display: none;
		}
		.teulas {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--esp-8);
		}
		.teula {
			aspect-ratio: auto;
			min-height: 10rem;
			padding: var(--esp-12);
		}
		.teula.granda {
			grid-row: auto;
			aspect-ratio: 1.15;
			padding: var(--esp-24);
		}
		.num {
			font-size: 1.8rem;
		}
		.granda .num {
			font-size: 3rem;
		}
		.nom {
			font-size: 1.05rem;
		}
		.sota {
			font-size: 0.85rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dos,
		.pl-contengut,
		.ficha,
		.teula,
		.picto-plaça {
			animation: none;
			transition: none;
		}
	}
	:global(html[data-leugier='on']) .dos,
	:global(html[data-leugier='on']) .ficha,
	:global(html[data-leugier='on']) .teula {
		animation: none;
	}
</style>
