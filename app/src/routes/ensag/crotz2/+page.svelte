<script>
	// Essai 2 : « la croix dans les ronds du chemin », version plus fine (retour de Romain, 2026-11-04 :
	// le rond d'or et la croix rouge faisaient lourd et « amateur », l'idée était bonne). Trois façons de
	// charger la même croix, dans la même scène (le chemin de S'apren, ses quatre ronds, à la taille de
	// l'accueil). Page de travail, non indexée, en français. Chaque scène se joue quand elle est vue à
	// moitié et se rejoue au bouton ; avec « moins d'animation », elle s'affiche dans son état final.
	import { onMount } from 'svelte';
	import CaminCrotz from '$lib/acuelh/CaminCrotz.svelte';

	let clar = $state(false);
	let anim = $state(false);
	onMount(() => {
		anim = !matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	// la scène se joue la première fois qu'elle est vue à moitié
	function vist(node) {
		const io = new IntersectionObserver(
			(lignes) => {
				if (lignes.some((l) => l.isIntersecting)) {
					io.disconnect();
					node.classList.add('vist');
				}
			},
			{ threshold: 0.5 }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
	function rejouer(e) {
		const scena = e.currentTarget.closest('section').querySelector('.scena');
		scena.classList.remove('vist');
		void scena.getBoundingClientRect();
		scena.classList.add('vist');
	}
</script>

<svelte:head>
	<title>Essai 2 · la croix dans les ronds, plus fine · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="banc" class:clar class:anim data-fons={clar ? 'clar' : 'sorne'}>
	<header class="cap">
		<p class="retorn"><a href="/">← Lo Ligam</a></p>
		<h1>La croix dans les ronds, version plus fine</h1>
		<p class="intro">
			Tu avais raison : le rond d'or avec la croix rouge faisait lourd. Ici la croix de ton logo reste seule, dans ses couleurs (blanc, or clair et or ; en clair, brique et or),
			dans un rond de verre fumé cerclé d'un filet d'or, d'un seul poids de trait, celui du logo. Le chemin devient un filet qui relie les ronds, comme le « ligam ». Trois façons
			de la charger, toutes en moins de 5 secondes : dis-moi celle qui te plaît, ou un mélange.
		</p>
		<p class="intro">
			Tu avais aussi raison sur les niveaux : les quatre ronds ne finissaient pas au même point. Maintenant le premier est le débutant (3 points allumés, un petit bout de cercle), le deuxième
			en a 6, le troisième 9, et le dernier est la croix pleine : les 12 points, le cercle fermé, et un double cercle pour dire qu'on est arrivé. Chaque rond se charge jusqu'à son niveau.
		</p>
		<div class="fons" role="group" aria-label="Fond de la page">
			<button type="button" aria-pressed={!clar} onclick={() => (clar = false)}>Fond sombre</button>
			<button type="button" aria-pressed={clar} onclick={() => (clar = true)}>Fond clair</button>
		</div>
	</header>

	<section class="var" id="hybride">
		<h2><span class="lletra">1</span> Le tour, puis les liens</h2>
		<p>Un filet d'or fait le tour du rond jusqu'à son niveau et allume les points à son passage. Puis le moyeu, les rayons et les arcs les relient : la croix n'existe que parce que les points sont liés, c'est l'idée du logo. Les ronds se chargent l'un après l'autre et le chemin se trace de l'un à l'autre. C'est celle que Joan met en premier : elle raconte le logo et reste la plus légère sur un téléphone lent.</p>
		<div class="scena" use:vist><CaminCrotz variant="hybride" gran /></div>
		<button type="button" class="rejoua" onclick={rejouer}>Rejouer</button>
	</section>

	<section class="var" id="balayage">
		<h2><span class="lletra">2</span> Le balayage</h2>
		<p>Le même tour, mais une aiguille d'or précède le filet : la croix se dessine derrière elle, rayon après rayon, jusqu'au niveau du rond. Plus démonstrative, un peu « indicateur de chargement ».</p>
		<div class="scena" use:vist><CaminCrotz variant="balayage" gran /></div>
		<button type="button" class="rejoua" onclick={rejouer}>Rejouer</button>
	</section>

	<section class="var" id="constellation">
		<h2><span class="lletra">3</span> La constellation</h2>
		<p>Les points arrivent d'abord seuls, depuis le bord du rond, puis les rayons et les arcs les relient. Le filet d'or se referme jusqu'au niveau du rond. La plus lisible, mais celle qui demande le plus d'effort à un téléphone lent.</p>
		<div class="scena" use:vist><CaminCrotz variant="constellation" gran /></div>
		<button type="button" class="rejoua" onclick={rejouer}>Rejouer</button>
	</section>

	<p class="fin">Chaque scène se joue quand tu arrives dessus. Avec « moins d'animation » dans ton appareil, elle s'affiche d'emblée dans son état final.</p>
</main>

<style>
	.banc {
		--fons: #22100a;
		--tinta: #fbf1e1;
		--or: #f6b73c;
		--linha: rgba(251, 241, 225, 0.2);
		--ciel: radial-gradient(ellipse at 62% 38%, #8a3d25 0%, #5a2615 45%, #2f170e 100%);
		/* le site force les pages d'essai en clair : les jetons du logo et le décor des ronds se règlent ici, fond sombre */
		--logo-traç: #ffffff;
		--logo-ponch: #ffd47f;
		--logo-moieu: #eeaf34;
		--cc-verre: rgba(34, 16, 10, 0.62);
		--cc-anell: #eeaf34;
		--cc-piste: rgba(238, 175, 52, 0.26);
		--cc-via: #eeaf34;
		min-height: 100vh;
		padding: 2rem clamp(1rem, 4vw, 3rem) 4rem;
		background: var(--fons);
		color: var(--tinta);
		font-family: var(--font-body, sans-serif);
	}
	/* fond clair : les jetons du logo de la version claire (le site les change à la racine) et le décor ocre */
	.banc.clar {
		--fons: #f7f3ee;
		--tinta: #2a1a10;
		--or: #9c5611;
		--linha: rgba(42, 26, 16, 0.2);
		--ciel: radial-gradient(ellipse at 62% 38%, #e9c9b5 0%, #f0dccd 45%, #f7f3ee 100%);
		--logo-traç: #b53d17;
		--logo-ponch: #eeaf34;
		--logo-moieu: #b53d17;
		--cc-verre: rgba(251, 241, 225, 0.84);
		--cc-anell: #8f5400;
		--cc-piste: rgba(143, 84, 0, 0.26);
		--cc-via: #8f5400;
	}
	.cap,
	.var,
	.fin {
		max-width: 48rem;
		margin-inline: auto;
	}
	.retorn a {
		color: var(--or);
		font-weight: 700;
		text-decoration: none;
	}
	h1 {
		margin: 0.6rem 0 0.8rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 5vw, 2.8rem);
		line-height: 1.1;
	}
	.intro {
		max-width: 40rem;
		line-height: 1.55;
	}
	.fons {
		display: inline-flex;
		gap: 0.5rem;
		margin-top: 0.6rem;
	}
	button {
		padding: 0.5rem 1rem;
		border: 1px solid var(--linha);
		border-radius: 999px;
		background: transparent;
		color: inherit;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	button[aria-pressed='true'] {
		border-color: var(--or);
		color: var(--or);
	}
	.var {
		margin-top: 2.6rem;
		padding-top: 1.4rem;
		border-top: 1px solid var(--linha);
	}
	h2 {
		margin: 0 0 0.4rem;
		font-size: 1.25rem;
		font-weight: 700;
	}
	.lletra {
		display: inline-block;
		min-width: 1.6em;
		color: var(--or);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5em;
	}
	.var p {
		max-width: 40rem;
		line-height: 1.5;
	}
	/* la scène, sur un fond qui ressemble à celui de l'accueil (brun et braise, pas du noir) */
	.scena {
		width: 100%;
		margin: 1rem 0 0.8rem;
		padding: clamp(0.6rem, 3vw, 1.6rem);
		border-radius: 1rem;
		background: var(--ciel);
	}
	.scena :global(.vis) {
		display: block;
		width: 100%;
		height: auto;
	}
	.rejoua {
		margin-top: 0.2rem;
	}
	.fin {
		margin-top: 3rem;
		font-weight: 700;
	}
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--or);
		outline-offset: 3px;
	}
</style>
