<script>
	// Jòcs, essai d'allure « Teula » (Romain, 05-11 : « ça fait très IA
	// encore » ; « Oui, essaie »). Les mêmes jeux que /ensag/jocs, habillés
	// autrement depuis cette page seulement, sans toucher aux jeux en ligne :
	// mise en page éditoriale (titre géant, aplats, filets), les mots et les
	// lettres deviennent des tuiles de terre cuite (la brique de Toulouse, les
	// teulas des toits), plus de verre fumé, de halo ni de lueur. Le rouge reste
	// ce qui se clique, l'or ce qui est choisi. Non indexée, pas dans le menu.
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Serp from '$lib/jocs/Serp.svelte';
	import Paniers from '$lib/jocs/Paniers.svelte';
	import { tria } from '$lib/stores/lang.svelte.js';

	const T = {
		tornar: { oc: 'Tornar a l’acuèlh', fr: 'Revenir à l’accueil' },
		triar: { oc: 'Triar un jòc', fr: 'Choisir un jeu' }
	};
	const JOCS = [
		{ id: 'serp', oc: 'La sèrp de las letras' },
		{ id: 'paniers', oc: 'Los panièrs' }
	];
	// trois palettes à comparer (Romain, 05-11 : « les couleurs sont moches,
	// on peut mieux faire »), prises dans la charte ; la palette reste dans
	// l'adresse (?teinta=b)
	const TEINTAS = [
		{ id: 'a', nom: 'Crème', mostra: ['#efe1c6', '#e6d3b1', '#ffd47f'] },
		{ id: 'b', nom: 'Bleu-vert', mostra: ['#2d6a6e', '#34767a', '#eeaf34'] },
		{ id: 'c', nom: 'Ocre et olivier', mostra: ['#d6ae64', '#a4a15e', '#f7f3ee'] }
	];
	const teintaDemandada = page.url.searchParams.get('teinta');
	let teinta = $state(TEINTAS.some((t) => t.id === teintaDemandada) ? teintaDemandada : 'a');
	function causirTeinta(id) {
		teinta = id;
		const u = new URL(page.url);
		u.searchParams.set('teinta', id);
		replaceState(u, {});
	}
	const demandat = page.url.searchParams.get('joc');
	let joc = $state(JOCS.some((j) => j.id === demandat) ? demandat : 'serp');
	function triar(id) {
		if (id === joc) return;
		joc = id;
		const u = new URL(page.url);
		u.searchParams.set('joc', id);
		replaceState(u, {});
	}
</script>

<svelte:head>
	<title>Jòcs, essai · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="contengut" class="espaci">
	<header class="barra">
		<a class="tornar" href="/" aria-label="Lo Ligam, {tria(T.tornar)}"><span aria-hidden="true">‹</span> Lo Ligam</a>
		<p class="marca" lang="oc">Jòcs</p>
		<div class="teintas" role="group" aria-label="Palette de l’essai">
			{#each TEINTAS as t (t.id)}
				<button type="button" aria-pressed={teinta === t.id} aria-label={t.nom} title={t.nom} onclick={() => causirTeinta(t.id)}
					>{#each t.mostra as c (c)}<i style:background={c}></i>{/each}</button
				>
			{/each}
		</div>
		<nav class="onglets" aria-label={tria(T.triar)}>
			{#each JOCS as j (j.id)}
				<button type="button" aria-pressed={joc === j.id} onclick={() => triar(j.id)} lang="oc">{j.oc}</button>
			{/each}
		</nav>
	</header>
	<div class="scena brica teinta-{teinta}">
		{#if joc === 'serp'}
			<Serp />
		{:else}
			<Paniers />
		{/if}
	</div>
</main>

<style>
	/* ── L'espace : un aplat, un filet sous la barre, rien d'autre ── */
	.espaci {
		position: fixed;
		inset: 0;
		z-index: 10;
		display: grid;
		grid-template-rows: auto 1fr;
		color: var(--t-tinta);
		background: var(--t-fons);
	}
	.barra {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem var(--esp-24);
		padding: 0.8rem clamp(1rem, 4vw, 3.5rem) 0;
		border-bottom: 1px solid var(--t-linha);
	}
	.tornar {
		color: var(--t-tinta-2);
		text-decoration: none;
	}
	.tornar:hover {
		color: var(--t-tinta);
	}
	.tornar:focus-visible,
	.onglets button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.marca {
		margin: 0;
		font-size: 0.78rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	/* le choix de la palette : trois pastilles de trois carrés */
	.teintas {
		display: flex;
		gap: 0.35rem;
		align-self: center;
	}
	.teintas button {
		display: flex;
		gap: 2px;
		min-height: 2.75rem;
		min-width: 2.75rem;
		align-items: center;
		justify-content: center;
		padding: 0 0.4rem;
		border: none;
		border-bottom: 2px solid transparent;
		background: none;
		cursor: pointer;
	}
	.teintas button[aria-pressed='true'] {
		border-bottom-color: var(--t-aur);
	}
	.teintas button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.teintas i {
		width: 0.8rem;
		height: 0.8rem;
		box-shadow: inset 0 0 0 1px rgba(42, 26, 16, 0.25);
	}
	/* les onglets : du texte, souligné d'or quand il est choisi */
	.onglets {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--esp-24);
		margin-inline-start: auto;
	}
	.onglets button {
		min-height: 2.75rem;
		padding: 0.3rem 0 0.5rem;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		background: none;
		font: inherit;
		color: var(--t-tinta-2);
		cursor: pointer;
	}
	.onglets button:hover {
		color: var(--t-tinta);
	}
	.onglets button[aria-pressed='true'] {
		border-bottom-color: var(--t-aur);
		color: var(--t-tinta);
		font-weight: 600;
	}
	@media (max-width: 559px) {
		.marca {
			display: none;
		}
		.onglets {
			flex-basis: 100%;
			margin-inline-start: 0;
			justify-content: space-between;
		}
		.onglets button {
			font-size: 0.95rem;
		}
	}
	.scena {
		overflow: auto;
		padding: clamp(1rem, 3vh, 2.5rem) clamp(1rem, 4vw, 3.5rem) var(--esp-32);
	}
	.scena > :global(.joc) {
		max-width: 90rem;
		margin: 0 auto;
	}

	/* Les règles des jeux sont précédées de « .espaci .brica » : elles passent
	   devant celles des composants, quel que soit l'ordre des feuilles. */

	/* ── Les tuiles : trois palettes à comparer, trois tons chacune, un joint
	   fin, pas d'ombre ; contraste du texte d'au moins 4,8 contre 1 ── */
	.brica {
		--b-joint: inset -1px 0 0 rgba(42, 26, 16, 0.2), inset 0 -0.12em 0 rgba(42, 26, 16, 0.2);
		--fons-camp: color-mix(in srgb, var(--t-tinta) 4%, var(--t-fons));
	}
	/* A · Crème : papier et parchemin, l'encre dessus ; l'or clair des
	   pommettes du logo pour le mot des deux paniers */
	.teinta-a {
		--b1: #efe1c6;
		--b2: #e6d3b1;
		--b3: #f5ead6;
		--b-mot: #f7f0e2;
		--b-tinta: #2a1a10;
		--b-dos: #ffd47f;
		--b-dos-tinta: #2a1a10;
	}
	:global(:root[data-tema='clar']) .teinta-a {
		--b1: #e6d2ad;
		--b2: #dbc296;
		--b3: #eddcbd;
		--b-mot: #e8d4ae;
		--b-joint: inset -1px 0 0 rgba(42, 26, 16, 0.3), inset 0 -0.12em 0 rgba(42, 26, 16, 0.3);
	}
	/* B · Bleu-vert : le bleu-vert de la charte, le crème dessus ; l'or pour
	   le mot des deux paniers */
	.teinta-b {
		--b1: #2d6a6e;
		--b2: #24585c;
		--b3: #34767a;
		--b-mot: #2f7276;
		--b-tinta: #f7f3ee;
		--b-dos: #eeaf34;
		--b-dos-tinta: #2a1a10;
		--b-joint: inset -1px 0 0 rgba(0, 0, 0, 0.28), inset 0 -0.12em 0 rgba(0, 0, 0, 0.28);
	}
	/* C · Ocre et olivier : l'ocre, l'olivier clair et le sable, l'encre
	   dessus ; le crème pour le mot des deux paniers */
	.teinta-c {
		--b1: #d6ae64;
		--b2: #a4a15e;
		--b3: #dcc596;
		--b-mot: #e3cf9f;
		--b-tinta: #2a1a10;
		--b-dos: #f7f3ee;
		--b-dos-tinta: #2a1a10;
	}

	/* ── Mise en page : le titre du jeu, géant, sur toute la largeur ── */
	.espaci .brica :global(.cap-joc h2) {
		font-size: clamp(2.4rem, 5.4vw, 4.4rem);
		line-height: 0.95;
		color: var(--t-tinta);
	}
	.espaci .brica :global(.cap-joc .consigna) {
		max-width: 44ch;
		margin-top: var(--esp-16);
	}
	@container joc (min-width: 52rem) {
		.espaci .brica :global(.joc:not(.immersiu) .disposicion) {
			grid-template-rows: auto auto 1fr;
			grid-template-areas: 'cap cap' 'taula pista' 'taula comandas';
			row-gap: var(--esp-32);
		}
		.espaci .brica :global(.joc:not(.immersiu) .cap-joc) {
			display: flex;
			flex-wrap: wrap;
			align-items: flex-end;
			justify-content: space-between;
			gap: var(--esp-12) var(--esp-48);
			padding-bottom: var(--esp-24);
			border-bottom: 1px solid var(--t-linha);
		}
		.espaci .brica :global(.joc:not(.immersiu) .cap-joc .consigna) {
			margin: 0;
		}
		.espaci .brica :global(.joc:not(.immersiu) .grasilha) {
			max-width: calc(58svh * var(--cols) / var(--rows));
		}
		.espaci .brica :global(.joc:not(.immersiu) .camp) {
			max-width: calc(54svh * 4 / 3);
		}
	}
	.espaci .brica :global(.joc.immersiu) {
		background: var(--t-fons);
	}

	/* ── Les terrains : un aplat à peine plus clair, un filet, angles nets ── */
	.espaci .brica :global(.grasilha) {
		border-radius: 0.2rem;
		box-shadow: none;
		background:
			radial-gradient(circle, var(--t-linha) 1px, transparent 1.5px) 0 0 / calc(100% / var(--cols)) calc(100% / var(--rows)),
			var(--fons-camp);
	}
	.espaci .brica :global(.camp) {
		border-radius: 0.2rem;
		box-shadow: none;
		background: var(--fons-camp);
	}
	.espaci .brica :global(.sol) {
		left: 0;
		right: 0;
		background: var(--t-linha);
	}

	/* ── La sèrp : lettres libres à nu, corps en tuiles, tête d'encre ── */
	.espaci .brica :global(.teula .l) {
		width: 100%;
		height: 100%;
		border-radius: 0;
		background: none;
		box-shadow: none;
		font-size: calc(var(--cela) * 0.56);
	}
	.espaci .brica :global(.teula.indici .l) {
		box-shadow: inset 0 -0.16em 0 var(--or);
	}
	.espaci .brica :global(.teula.cors .l) {
		width: 92%;
		height: 92%;
		border-radius: 0.08em;
		background: var(--b1);
		box-shadow: var(--b-joint);
		color: var(--b-tinta);
	}
	.espaci .brica :global(.teula.cors:nth-child(3n + 1) .l) {
		background: var(--b2);
	}
	.espaci .brica :global(.teula.cors:nth-child(3n + 2) .l) {
		background: var(--b3);
	}
	.espaci .brica :global(.teula.cors.falsa .l) {
		background: color-mix(in srgb, var(--t-tinta) 16%, var(--t-fons));
		box-shadow: none;
		color: var(--t-tinta-2);
	}
	.espaci .brica :global(.testa) {
		width: 92%;
		height: 92%;
		border-radius: 0.08em 45% 45% 0.08em;
		background: var(--t-tinta);
		box-shadow: none;
	}
	.espaci .brica :global(.uelh),
	.espaci .brica :global(.boca) {
		background: var(--t-fons);
	}
	.espaci .brica :global(.lenga) {
		background: var(--b2);
		height: 3px;
		margin-top: -1.5px;
	}
	.espaci .brica :global(.cap.barrada .testa) {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-tinta) 30%, transparent);
	}

	/* ── Los panièrs : le mot qui tombe et les mots rangés, en tuiles ── */
	/* le mot qui tombe : le ton le plus sable, sans relief, pour qu'il ne
	   passe pas pour une touche rouge (Joan, 05-11 ; rouge = clic) */
	.espaci .brica :global(.mot > span) {
		border-radius: 0.1em;
		background: var(--b-mot);
		box-shadow: none;
		color: var(--b-tinta);
	}
	.espaci .brica :global(.mot.torna > span) {
		background: color-mix(in srgb, var(--t-tinta) 16%, var(--t-fons));
		box-shadow: none;
		color: var(--t-tinta);
	}
	.espaci .brica :global(.mot.rapid::before) {
		background: linear-gradient(to top, var(--t-tinta-2), transparent);
	}
	.espaci .brica :global(.chip) {
		border-radius: 0.1em;
		background: var(--b1);
		box-shadow: var(--b-joint);
		color: var(--b-tinta);
	}
	.espaci .brica :global(.reng .chip[data-t='1']) {
		background: var(--b2);
	}
	.espaci .brica :global(.reng .chip[data-t='2']) {
		background: var(--b3);
	}
	/* le mot des deux paniers : sa tuile à part */
	.espaci .brica :global(.chip.dos),
	.espaci .brica :global(.reng .chip.dos) {
		background: var(--b-dos);
		color: var(--b-dos-tinta);
	}
	/* le panier : un aplat, la vannerie à peine marquée */
	.espaci .brica :global(.davant .cors) {
		fill: color-mix(in srgb, var(--t-tinta) 9%, var(--t-fons));
	}
	.espaci .brica :global(.panier.indici .davant .cors) {
		fill: color-mix(in srgb, var(--or) 12%, var(--t-fons));
	}
	.espaci .brica :global(.davant .vim path) {
		opacity: 0.22;
	}
	.espaci .brica :global(.davant .vim .montants) {
		opacity: 0.14;
	}
	.espaci .brica :global(.dalfons ellipse) {
		fill: color-mix(in srgb, black 30%, var(--t-fons));
	}
	/* le compte : de petits carrés, dorés une fois rangés */
	.espaci .brica :global(.granas i) {
		border-radius: 0;
	}
	.espaci .brica :global(.polsa i) {
		border-radius: 0;
	}

	/* ── Les cartes posées sur le terrain : un aplat, plus de verre fumé ── */
	.espaci .brica :global(.carta),
	.espaci .brica :global(.fin) {
		border-radius: 0.2rem;
		background: var(--t-fons);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		box-shadow: 0 0 0 1px var(--t-linha);
	}
	/* Limelight pour les gros titres seulement : le titre de l'aide en Luciole */
	.espaci .brica :global(.carta-titol) {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--t-tinta);
	}

	/* ── Les commandes : la croix en un seul bloc de touches rouges ── */
	.espaci .brica :global(.crotz) {
		gap: 3px;
	}
	.espaci .brica :global(.dir),
	.espaci .brica :global(.accion) {
		border-radius: 0.2rem;
	}
	.espaci .brica :global(.escupir) {
		border-radius: 0.2rem;
	}
	.espaci .brica :global(.ecran) {
		border-radius: 0.2rem;
	}
	/* les réglages : du texte, souligné d'or quand il est choisi */
	.espaci .brica :global(.segments) {
		gap: 0 var(--esp-16);
		border: none;
		border-radius: 0;
		overflow: visible;
	}
	.espaci .brica :global(.segments button) {
		min-height: 2.75rem;
		padding: 0.3rem 0 0.35rem;
		border: none;
		border-bottom: 2px solid var(--t-linha);
	}
	.espaci .brica :global(.segments button:hover) {
		background: none;
		border-bottom-color: var(--t-tinta-2);
	}
	.espaci .brica :global(.segments button[aria-pressed='true']) {
		background: none;
		border-bottom-color: var(--or);
		color: var(--t-tinta);
		font-weight: 600;
	}
	.espaci .brica :global(.accions button) {
		border-radius: 0.2rem;
	}
</style>
