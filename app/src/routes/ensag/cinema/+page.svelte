<script>
	// Page d'essai du cinéma (2026-10-25, Romain : même méthode que la
	// littérature, dans les verts d'Òbras). Trois présentations à comparer,
	// inspirées des sites qui recensent les films :
	//   A. la pellicule (les frises des cinémathèques : les films du plus ancien
	//      au plus récent, une image par film, la légende dessous) ;
	//   B. le programme (le tableau des séances des salles et des
	//      cinémathèques : une ligne par film, en capitales sur le noir) ;
	//   C. les affiches (le mur d'affiches des plateformes et des carnets de
	//      cinéphiles, le plus récent en grand).
	// Puis, pour les trois, où voir les films (des billets). Chaque film mène à
	// sa page Wikipèdia. Données dans $lib/ensag/maqueta.js.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { PALETAS } from '$lib/apren/teulas.js';
	import { FILMES } from '$lib/ensag/maqueta.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let fr = $derived(langStore.current === 'fr');
	const t = {
		oc: {
			titol: 'Cinema',
			frasa: 'Los filmes en occitan, e ont los veire.',
			filmes: 'Los filmes',
			ont: 'Ont los veire',
			veire: 'Veire'
		},
		fr: {
			titol: 'Cinéma',
			frasa: 'Les films en occitan, et où les voir.',
			filmes: 'Les films',
			ont: 'Où les voir',
			veire: 'Voir'
		}
	};
	let tx = $derived(t[fr ? 'fr' : 'oc']);
	const s = (o) => (fr ? o.fr : o.oc);

	const VISTAS = [
		['pellicula', 'A. La pellicule'],
		['programa', 'B. Le programme'],
		['afichas', 'C. Les affiches']
	];
	let vista = $state('pellicula');

	const VERD = PALETAS.verd;
	const color = (i) => VERD[i % VERD.length];
	const FILMS = FILMES.filter((f) => f.grop === 'filme');
	const LUÒCS = FILMES.filter((f) => f.grop === 'veire');
	// les affiches : le plus récent en grand, en tête du mur
	const AFICHAS = [...FILMS].reverse();
	// les affiches : un motif lié au sujet du film (montagne, soleil, sillons…)
	const MOTIUS = { engloutie: 'montanha', seria: 'ecran', paur: 'linhas', lengadamor: 'tuc', aura: 'anèl', malaterra: 'solelh', orsalher: 'montanha', adrian: 'tuc', farrebique: 'solelh' };
	// la langue du titre : occitan, sauf les titres français
	const lt = (f) => f.lenga ?? 'oc';

	// la pellicule : l'image survolée (ou touchée au clavier) s'éclaire
	let causit = $state(0);
	const film = $derived(FILMS[causit]);
</script>

<svelte:head>
	<title>Cinema (maqueta) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="cinema">
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

	{#if vista === 'pellicula'}
		<!-- A. La pellicule : une image par film, du plus ancien au plus récent -->
		<div class="pellicula-cadre">
			<ol class="pellicula" aria-label={tx.filmes}>
				{#each FILMS as f, k (f.id)}
					{@const [fons, tinta] = color(k)}
					<li class="imatge" class:lum={causit === k} style:--fons={fons} style:--tinta={tinta}>
						<a href={f.site} target="_blank" rel="noopener noreferrer" onmouseenter={() => (causit = k)} onfocus={() => (causit = k)}>
							<span class="im-an">{f.an}</span>
							<span class="im-nom" lang={lt(f)}>{f.nom}</span>
							<span class="im-sorta" lang={fr ? 'fr' : 'oc'}>{s(f.sorta)}</span>
						</a>
					</li>
				{/each}
			</ol>
		</div>
		<div class="legenda">
			{#key causit}
				<div class="lg-contengut">
					<div class="lg-cap">
						<strong class="lg-nom" lang={lt(film)}>{film.nom}</strong>
						{#if film.fr}<span class="lg-fr" lang="fr">{film.fr}</span>{/if}
						<span class="lg-de">{film.de} · {film.an}</span>
					</div>
					<p class="lg-tèxt" lang={fr ? 'fr' : 'oc'}>{s(film.tèxt)}</p>
					<a class="veire" href={film.site} target="_blank" rel="noopener noreferrer">{tx.veire} <Icona nom="extern" size="1em" /></a>
				</div>
			{/key}
		</div>
	{:else if vista === 'programa'}
		<!-- B. Le programme : une ligne par film, comme le tableau des séances -->
		<ol class="programa" aria-label={tx.filmes}>
			{#each FILMS as f (f.id)}
				<li>
					<a class="pg-linha" href={f.site} target="_blank" rel="noopener noreferrer">
						<span class="pg-an">{f.an}</span>
						<span class="pg-nom" lang={lt(f)}>{f.nom}</span>
						<span class="pg-de" lang={fr ? 'fr' : 'oc'}>{s(f.sorta)} · {f.de}</span>
						<span class="pg-tèxt" lang={fr ? 'fr' : 'oc'}>{s(f.tèxt)}</span>
					</a>
				</li>
			{/each}
		</ol>
	{:else}
		<!-- C. Les affiches : le plus récent en grand -->
		<ul class="afichas" aria-label={tx.filmes}>
			{#each AFICHAS as f, k (f.id)}
				{@const [fons, tinta] = color(k + 1)}
				<li class:granda={k === 0} style:--fons={fons} style:--tinta={tinta} style:--i={k}>
					<a class="afiche motiu-{MOTIUS[f.id]}" href={f.site} target="_blank" rel="noopener noreferrer">
						<span class="af-de">{f.de}</span>
						<span class="af-motiu" aria-hidden="true"></span>
						<span class="af-pè">
							<strong class="af-nom" lang={lt(f)}>{f.nom}</strong>
							<span class="af-tèxt" lang={fr ? 'fr' : 'oc'}>{s(f.tèxt)}</span>
							<span class="af-an">{s(f.sorta)} · {f.an}</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}

	<!-- où voir les films : des billets, pour les trois présentations -->
	<section class="ont" aria-labelledby="ont-titol">
		<h2 id="ont-titol" lang={fr ? 'fr' : 'oc'}>{tx.ont}</h2>
		<ul class="bilhets">
			{#each LUÒCS as l (l.id)}
				<li>
					<a class="bilhet" href={l.site} target="_blank" rel="noopener noreferrer">
						<span class="bl-sorta" lang={fr ? 'fr' : 'oc'}>{s(l.sorta)}</span>
						<strong class="bl-nom" lang="oc">{l.nom}</strong>
						<span class="bl-tèxt" lang={fr ? 'fr' : 'oc'}>{s(l.tèxt)}</span>
						<span class="bl-veire" aria-hidden="true">{tx.veire} <Icona nom="extern" size="1em" /></span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
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
	.cinema {
		container: cinema / inline-size;
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

	.veire {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.6rem 1.3rem;
		border-radius: 999px;
		background: #b53d17;
		color: #fbf1e1;
		font-weight: 700;
		text-decoration: none;
		white-space: nowrap;
	}
	.veire:hover {
		background: #c9471d;
	}

	/* ---------- A. La pellicule ---------- */
	.pellicula-cadre {
		/* la bande : les perforations en haut et en bas */
		--trau: rgba(243, 239, 220, 0.82);
		position: relative;
		padding: 1.7rem 0.9rem;
		border-radius: 4px;
		background:
			linear-gradient(90deg, transparent 0.4rem, var(--trau) 0.4rem 1.2rem, transparent 1.2rem) 0 0.5rem / 1.6rem 0.7rem round no-repeat,
			linear-gradient(90deg, transparent 0.4rem, var(--trau) 0.4rem 1.2rem, transparent 1.2rem) 0 calc(100% - 0.5rem) / 1.6rem 0.7rem round no-repeat,
			#14170b;
		box-shadow: 0 24px 40px -24px rgba(0, 0, 0, 0.9);
	}
	.pellicula {
		display: grid;
		grid-template-columns: repeat(9, minmax(0, 1fr));
		gap: 0.6rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.imatge a {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		aspect-ratio: 3 / 4;
		padding: 0.8rem 0.7rem;
		border-radius: 3px;
		background:
			radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0, 0, 0, 0.35)),
			var(--fons);
		color: var(--tinta);
		text-decoration: none;
		transition:
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.3s ease;
	}
	/* l'image éclairée, comme dans la lumière du projecteur */
	.imatge.lum a,
	.imatge a:focus-visible {
		filter: none;
		transform: scale(1.06);
		box-shadow:
			0 0 0 2px #f3efdc,
			0 0 34px rgba(255, 240, 200, 0.3);
		outline: none;
	}
	.imatge a:focus-visible {
		box-shadow:
			0 0 0 3px #b0b791,
			0 0 34px rgba(255, 240, 200, 0.3);
	}
	.im-an {
		font-family: var(--font-heading);
		font-size: clamp(1.2rem, 1.9vw, 1.7rem);
		line-height: 1;
	}
	.im-nom {
		font-weight: 700;
		font-size: 0.92rem;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}
	.im-sorta {
		margin-top: auto;
		font-size: 0.8rem;
		font-weight: 700;
	}
	/* la légende du film éclairé, comme un écran sous la bande */
	.legenda {
		margin-top: var(--esp-24);
		border-radius: 6px;
		background: #f3efdc;
		color: #2a1a10;
		box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.8);
	}
	.lg-contengut {
		display: grid;
		grid-template-columns: minmax(14rem, 1.1fr) 1.4fr auto;
		align-items: center;
		gap: var(--esp-24);
		padding: var(--esp-24) var(--esp-32, 2rem);
		animation: virar 0.35s ease-out;
	}
	@keyframes virar {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	.lg-cap {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.lg-nom {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.6rem, 2.6vw, 2.3rem);
		line-height: 1.05;
	}
	.lg-fr {
		font-style: italic;
		color: #4a3a2a;
	}
	.lg-de {
		color: #425223;
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.lg-tèxt {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.5;
	}

	/* ---------- B. Le programme ---------- */
	.programa {
		margin: 0;
		padding: var(--esp-8) 0;
		list-style: none;
		border-radius: 6px;
		background: #14170b;
		box-shadow: 0 24px 40px -24px rgba(0, 0, 0, 0.9);
	}
	.programa li + li {
		border-top: 1px solid rgba(176, 183, 145, 0.18);
	}
	.pg-linha {
		display: grid;
		grid-template-columns: 5.5rem minmax(0, 1.25fr) minmax(0, 1fr);
		grid-template-areas:
			'an nom tèxt'
			'an de tèxt';
		align-items: baseline;
		column-gap: var(--esp-24);
		row-gap: 0.2rem;
		padding: 1.05rem var(--esp-32, 2rem);
		color: inherit;
		text-decoration: none;
		transition: background-color 0.2s ease;
	}
	.pg-linha:hover {
		background: rgba(176, 183, 145, 0.08);
	}
	.pg-linha:hover .pg-nom {
		text-decoration: underline 2px #b53d17;
		text-underline-offset: 5px;
	}
	.pg-linha:focus-visible {
		outline: 3px solid #b0b791;
		outline-offset: -3px;
	}
	.pg-an {
		grid-area: an;
		color: #b0b791;
		font-family: var(--font-heading);
		font-size: clamp(1.3rem, 2vw, 1.7rem);
	}
	.pg-nom {
		grid-area: nom;
		color: #f3efdc;
		font-weight: 700;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.pg-de {
		grid-area: de;
		color: #b0b791;
		font-size: 0.9rem;
	}
	.pg-tèxt {
		grid-area: tèxt;
		align-self: center;
		color: #d9d4bd;
		line-height: 1.45;
	}

	/* ---------- C. Les affiches ---------- */
	.afichas {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--esp-24);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.afichas .granda {
		grid-column: span 2;
		grid-row: span 2;
	}
	.afiche {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		min-height: 22rem;
		padding: 1.3rem 1.2rem;
		overflow: hidden;
		border-radius: 4px;
		background: var(--fons);
		color: var(--tinta);
		text-decoration: none;
		box-shadow: 0 18px 30px -18px rgba(0, 0, 0, 0.85);
		transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 60ms);
	}
	/* le filet intérieur des vieilles affiches */
	.afiche::after {
		content: '';
		position: absolute;
		inset: 0.55rem;
		border: 1px solid color-mix(in srgb, var(--tinta) 45%, transparent);
		border-radius: 2px;
		pointer-events: none;
	}
	/* le motif : une forme simple, différente d'une affiche à l'autre, dans
	   l'espace laissé entre le nom et le titre */
	.af-motiu {
		flex: 1 1 auto;
		min-height: 4rem;
		margin: 1rem 8%;
		opacity: 0.3;
	}
	.motiu-solelh .af-motiu {
		background: radial-gradient(circle at 50% 50%, var(--tinta) 0 30%, transparent 30.5%);
	}
	.motiu-montanha .af-motiu {
		background:
			linear-gradient(to top left, var(--tinta) 49.6%, transparent 50.4%) left / 50% 100% no-repeat,
			linear-gradient(to top right, var(--tinta) 49.6%, transparent 50.4%) right / 50% 100% no-repeat;
	}
	.motiu-ecran .af-motiu {
		background: linear-gradient(var(--tinta), var(--tinta)) center / 78% 72% no-repeat;
		border-radius: 10px;
	}
	.motiu-linhas .af-motiu {
		background: repeating-linear-gradient(0deg, var(--tinta) 0 3px, transparent 3px 16px);
	}
	.motiu-tuc .af-motiu {
		background: radial-gradient(circle at 50% 100%, var(--tinta) 0 48%, transparent 48.5%);
	}
	.motiu-anèl .af-motiu {
		background: radial-gradient(circle, transparent 0 24%, var(--tinta) 24.5% 29%, transparent 29.5%);
	}
	.afiche:hover,
	.afiche:focus-visible {
		transform: translateY(-6px);
		outline: none;
	}
	.afiche:focus-visible {
		box-shadow: 0 0 0 3px #b0b791;
	}
	.af-de {
		position: relative;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}
	.af-pè {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.af-nom {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.4rem, 2.2vw, 1.9rem);
		line-height: 1.02;
	}
	.granda .af-nom {
		font-size: clamp(2.4rem, 5vw, 4.4rem);
	}
	.af-tèxt {
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 1.05rem;
		line-height: 1.3;
	}
	.granda .af-tèxt {
		font-size: 1.4rem;
	}
	.af-an {
		padding-top: 0.5rem;
		border-top: 1px solid color-mix(in srgb, var(--tinta) 45%, transparent);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	@keyframes arribar {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	/* ---------- où voir : les billets ---------- */
	.ont {
		margin-top: var(--esp-64, 4rem);
	}
	h2 {
		margin: 0 0 var(--esp-16);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.5rem, 2.6vw, 2.2rem);
		color: #b0b791;
	}
	.bilhets {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--esp-24);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.bilhet {
		/* le billet : deux encoches sur les côtés, un pointillé avant le talon */
		--encòca: radial-gradient(circle at 0 50%, transparent 0.8rem, #000 0.85rem) left / 51% 100% no-repeat,
			radial-gradient(circle at 100% 50%, transparent 0.8rem, #000 0.85rem) right / 51% 100% no-repeat;
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto 1fr;
		column-gap: var(--esp-24);
		row-gap: 0.3rem;
		height: 100%;
		padding: 1.2rem 1.6rem 1.2rem 1.8rem;
		background: #f3efdc;
		color: #2a1a10;
		text-decoration: none;
		-webkit-mask: var(--encòca);
		mask: var(--encòca);
		transition: transform 0.25s ease;
	}
	.bilhet:hover,
	.bilhet:focus-visible {
		transform: translateY(-3px);
		outline: none;
	}
	.bl-sorta {
		color: #425223;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.bl-nom {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.8rem;
		line-height: 1.05;
	}
	.bl-tèxt {
		line-height: 1.45;
	}
	.bl-veire {
		grid-column: 2;
		grid-row: 1 / -1;
		align-self: center;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.6rem 1.2rem 0.6rem 1.6rem;
		border-left: 2px dashed #b0b791;
		color: #b53d17;
		font-weight: 700;
		white-space: nowrap;
	}

	/* téléphone : la pellicule en hauteur, les affiches sur deux colonnes */
	@container cinema (max-width: 640px) {
		.pellicula-cadre {
			padding: 0.9rem 1.7rem;
			background:
				linear-gradient(180deg, transparent 0.4rem, var(--trau) 0.4rem 1.2rem, transparent 1.2rem) 0.5rem 0 / 0.7rem 1.6rem no-repeat round,
				linear-gradient(180deg, transparent 0.4rem, var(--trau) 0.4rem 1.2rem, transparent 1.2rem) calc(100% - 0.5rem) 0 / 0.7rem 1.6rem no-repeat round,
				#14170b;
		}
		.pellicula {
			grid-template-columns: 1fr;
		}
		.imatge a {
			display: grid;
			grid-template-columns: auto 1fr;
			grid-template-rows: auto auto;
			column-gap: 0.9rem;
			row-gap: 0.15rem;
			align-items: center;
			aspect-ratio: auto;
			min-height: 4.4rem;
			filter: none;
		}
		.im-an {
			grid-row: 1 / 3;
		}
		.im-sorta {
			margin-top: 0;
		}
		.imatge.lum a {
			transform: none;
			box-shadow: none;
		}
		/* au téléphone, toucher une image ouvre la page du film : pas de légende */
		.legenda {
			display: none;
		}
		.pg-linha {
			grid-template-columns: auto minmax(0, 1fr);
			grid-template-areas:
				'an nom'
				'an de'
				'tèxt tèxt';
			column-gap: var(--esp-12);
			padding: 0.9rem var(--esp-16);
		}
		.pg-nom {
			font-size: 1rem;
		}
		.pg-tèxt {
			margin-top: 0.3rem;
			font-size: 0.92rem;
		}
		.afichas {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--esp-12);
		}
		.afiche {
			min-height: 15rem;
			padding: 1rem 0.9rem;
		}
		.af-tèxt {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			overflow: hidden;
			font-size: 0.92rem;
		}
		.granda .afiche {
			min-height: 24rem;
		}
		.granda .af-tèxt {
			-webkit-line-clamp: 3;
			line-clamp: 3;
			font-size: 1.1rem;
		}
		.af-nom {
			font-size: 1.15rem;
		}
		.granda .af-nom {
			font-size: 2.2rem;
		}
		.bilhets {
			grid-template-columns: 1fr;
		}
		.bilhet {
			grid-template-columns: 1fr;
			padding: 1.1rem 1.4rem;
		}
		.bl-veire {
			grid-column: 1;
			grid-row: auto;
			justify-self: start;
			margin-top: 0.4rem;
			padding: 0.6rem 0 0;
			border-left: 0;
			border-top: 2px dashed #b0b791;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.imatge a,
		.lg-contengut,
		.afiche,
		.bilhet {
			animation: none;
			transition: none;
		}
	}
	:global(html[data-leugier='on']) .lg-contengut,
	:global(html[data-leugier='on']) .afiche {
		animation: none;
	}
</style>
