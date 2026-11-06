<script>
	// Jòcs (chantier 27, idée de Romain du 2026-11-04), rubrique de S'apren
	// depuis le 05-11 (Romain : « une rubrique à part entière dans S'apren »),
	// après un essai sur /ensag/jocs : l'espace de jeux, plein écran et stable,
	// sans le pied de page ni la navigation du site, la sortie vers S'apren ;
	// un jeu à la fois : La sèrp de las letras (04-11), Los panièrs (05-11) et
	// Pausa los mots (05-11 sous le nom « Ont es… ? », refait le 06-11 : les
	// paysages de Romain, chaque mot dans sa case), choisi dans l'adresse
	// (?joc=paniers, ?joc=paisatges). Allure « Teula », adoptée par
	// Romain le 05-11 avec la palette crème : mise en page éditoriale (titre
	// géant, aplats, filets), mots et lettres en tuiles, ni verre fumé, ni
	// halo, ni lueur. Le rouge reste ce qui se clique, l'or ce qui est choisi.
	// Les jeux : $lib/jocs/. Depuis le 06-11 (Romain : « arriver dans une salle
	// de jeu… dans la logique du café pour la musique »), sans ?joc= on entre
	// dans la salle de jeux ($lib/jocs/sala/) : les familles de jeux, leurs
	// affiches, ce que chaque jeu fait travailler ; deux tèmas, joiós par défaut
	// (Romain, 06-11 au soir : « Je préfère joios en fait ») et calme, gardés sur
	// l'appareil. Dans un jeu, « ‹ Sala de jòcs » y ramène.
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Serp from '$lib/jocs/Serp.svelte';
	import Paniers from '$lib/jocs/Paniers.svelte';
	import PausaMots from '$lib/jocs/PausaMots.svelte';
	import Sala from '$lib/jocs/sala/Sala.svelte';
	import { tria } from '$lib/stores/lang.svelte.js';

	const T = {
		tornar: { oc: 'Tornar a S’apren', fr: 'Revenir à S’apprend' },
		triar: { oc: 'Triar un jòc', fr: 'Choisir un jeu' },
		sala: { oc: 'Sala de jòcs', fr: 'Salle de jeux' }
	};
	const JOCS = [
		{ id: 'serp', oc: 'La sèrp de las letras' },
		{ id: 'paniers', oc: 'Los panièrs' },
		{ id: 'paisatges', oc: 'Pausa los mots' }
	];
	// sans ?joc= : la salle de jeux ; avec : le jeu (un lien, donc le bouton
	// « retour » du navigateur ramène à la salle)
	let joc = $derived.by(() => {
		const d = page.url.searchParams.get('joc');
		return JOCS.some((j) => j.id === d) ? d : null;
	});
	// le tèma de la salle : joiós par défaut, gardé sur cet appareil
	const CLAU_TEMA = 'loligam-jocs-tema';
	let tema = $state('joios');
	onMount(() => {
		// ?tema=joios ou ?tema=calme : un lien qui ouvre la salle dans ce tèma
		const demandat = page.url.searchParams.get('tema');
		if (demandat === 'joios' || demandat === 'calme') return causirTema(demandat);
		try {
			if (localStorage.getItem(CLAU_TEMA) === 'calme') tema = 'calme';
		} catch {
			// stockage refusé : on reste au tèma par défaut
		}
	});
	function causirTema(t) {
		tema = t;
		try {
			localStorage.setItem(CLAU_TEMA, t);
		} catch {
			// stockage refusé : le choix vaut pour cette visite
		}
	}
</script>

<svelte:head>
	<title>Jòcs · Lo Ligam</title>
	<meta
		name="description"
		content="La sala de jòcs per aprene l’occitan : jòcs d’adreça, de mots, d’observacion, de memòria e per escotar. La salle de jeux pour apprendre l’occitan : jeux d’adresse, de mots, d’observation, de mémoire et d’écoute."
	/>
</svelte:head>

<main id="contengut" class="espaci">
	<header class="barra">
		{#if joc}
			<a class="tornar" href="/apren/jocs" lang="oc"><span aria-hidden="true">‹</span> {tria(T.sala)}</a>
		{:else}
			<a class="tornar" href="/apren" aria-label={tria(T.tornar)} lang="oc"><span aria-hidden="true">‹</span> S’apren</a>
		{/if}
		<h1 class="marca" lang="oc">Jòcs</h1>
		{#if joc}
			<nav class="onglets" aria-label={tria(T.triar)}>
				{#each JOCS as j (j.id)}
					<a href="?joc={j.id}" data-sveltekit-replacestate aria-current={joc === j.id ? 'page' : undefined} lang="oc">{j.oc}</a>
				{/each}
			</nav>
		{/if}
	</header>
	<div class="scena brica">
		{#if joc === 'serp'}
			<Serp />
		{:else if joc === 'paniers'}
			<Paniers />
		{:else if joc === 'paisatges'}
			<PausaMots />
		{:else}
			<Sala {tema} {causirTema} />
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
	.onglets a:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.marca {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 400;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	/* les onglets : du texte, souligné d'or quand il est choisi */
	.onglets {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--esp-24);
		margin-inline-start: auto;
	}
	.onglets a {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: 0.3rem 0 0.5rem;
		text-decoration: none;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		background: none;
		font: inherit;
		color: var(--t-tinta-2);
		cursor: pointer;
	}
	.onglets a:hover {
		color: var(--t-tinta);
	}
	.onglets a[aria-current='page'] {
		border-bottom-color: var(--t-aur);
		color: var(--t-tinta);
		font-weight: 600;
	}
	@media (max-width: 559px) {
		/* le nom de l’espace reste pour les lecteurs d’écran */
		.marca {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}
		.onglets {
			flex-basis: 100%;
			margin-inline-start: 0;
			justify-content: space-between;
		}
		/* les trois noms de jeux tiennent sur une ligne, même sur un
		   téléphone de 360 px (« Pausa los mots », 06-11) ; plus petit encore,
		   ils passent à la ligne */
		.onglets {
			gap: 0 0.5rem;
		}
		.onglets a {
			font-size: max(0.78rem, min(0.95rem, calc((100vw - 3rem) / 24.5)));
		}
	}
	.scena {
		overflow: auto;
		scrollbar-gutter: stable; /* la photo ne bouge pas quand la colonne s'allonge */
		padding: clamp(1rem, 3vh, 2.5rem) clamp(1rem, 4vw, 3.5rem) var(--esp-32);
	}
	.scena > :global(.joc) {
		max-width: 90rem;
		margin: 0 auto;
	}

	/* Les règles des jeux sont précédées de « .espaci .brica » : elles passent
	   devant celles des composants, quel que soit l'ordre des feuilles. */

	/* ── Les tuiles : la palette crème (Romain, 05-11), papier et parchemin,
	   l'encre dessus, l'or clair des pommettes du logo pour le mot des deux
	   paniers ; un joint fin, pas d'ombre ; contraste du texte d'au moins
	   4,8 contre 1 ── */
	.brica {
		--b-joint: inset -1px 0 0 rgba(42, 26, 16, 0.2), inset 0 -0.12em 0 rgba(42, 26, 16, 0.2);
		--fons-camp: color-mix(in srgb, var(--t-tinta) 4%, var(--t-fons));
		--b1: #efe1c6;
		--b2: #e6d3b1;
		--b3: #f5ead6;
		--b-mot: #f7f0e2;
		--b-tinta: #2a1a10;
		--b-dos: #ffd47f;
		--b-dos-tinta: #2a1a10;
	}
	:global(:root[data-tema='clar']) .brica {
		--b1: #e6d2ad;
		--b2: #dbc296;
		--b3: #eddcbd;
		--b-mot: #e8d4ae;
		--b-joint: inset -1px 0 0 rgba(42, 26, 16, 0.3), inset 0 -0.12em 0 rgba(42, 26, 16, 0.3);
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
	/* le mode plein couvre tout l'écran, même au-delà de 90rem (06-11 : sur un
	   écran large, les bords de la page restaient visibles) */
	.espaci .brica :global(.joc.immersiu) {
		max-width: none;
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
	/* les chiffres des unités (06-11) : serrés, chacun assez large pour le doigt */
	.espaci .brica :global(.segments.compacte) {
		gap: 0 0.25rem;
	}
	.espaci .brica :global(.segments.compacte button) {
		min-width: 2rem;
		justify-items: center;
	}
	.espaci .brica :global(.accions button) {
		border-radius: 0.2rem;
	}
</style>
