<script>
	// Essai du 2026-11-12 (chantier 37, audit de l'accueil) : les confettis du fond clair, raffinés.
	// Rien n'est retiré : mêmes pièces, même main qui les attrape et les lance. La version raffinée vit
	// dans le vrai composant (lib/flotants, propriété « fin ») et s'essaie sur les vraies pages par
	// « ?confetis=fin » (gabarit racine). Rien ne change sur le site tant que Romain n'a pas choisi.
	import AppHeader from '$lib/components/AppHeader.svelte';

	const PAGES = [
		['/', 'l’accueil'],
		['/amassa', 'Amassa'],
		['/apren', 'S’apren'],
		['/cultura', 'Cultura']
	];
	// Firefox sans carte graphique, fenêtre de 1830 × 900, page au repos pendant 20 s (12-11)
	const MESURES = [
		['Page Amassa, sans confettis', '6,6 %'],
		['Page Amassa, confettis d’aujourd’hui', '72,7 %'],
		['Page Amassa, confettis raffinés', '25,0 %']
	];
</script>

<svelte:head>
	<title>Essai : les confettis raffinés · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<div class="capçal"><AppHeader /></div>

	<main class="essai">
		<p class="date">Essai du 12 novembre 2026, thème clair</p>
		<h1>Les confettis, raffinés</h1>
		<p class="intro">
			Les mêmes confettis, la même main qui les attrape et les lance. Deux retouches légères, à comparer sur les vraies pages (elles
			n’ont pas de confettis en thème sombre).
		</p>

		<ol class="formes">
			<li>
				<span class="lettre" aria-hidden="true">1</span>
				<div class="texte">
					<h2>De la profondeur</h2>
					<p>
						Aujourd’hui toutes les pièces ont la même pâleur et des vitesses tirées au hasard. Raffinées : les petites sont plus pâles, plus
						lentes et sans ombre, comme si elles étaient loin ; les grandes sont plus franches et un peu plus vives. Même nombre, même
						taille moyenne, même présence d’ensemble.
					</p>
				</div>
			</li>
			<li>
				<span class="lettre" aria-hidden="true">2</span>
				<div class="texte">
					<h2>De la sobriété</h2>
					<p>
						Au repos, les pièces dérivent de quelques pixels par seconde : 20 images par seconde suffisent, au lieu de 60. Dès que la main
						bouge, tient ou lance une pièce, la cadence de l’écran revient. Le calque des fils n’est affiché que lorsqu’un fil est tracé.
					</p>
					<table>
						<caption>Part d’un cœur de processeur occupée, page au repos</caption>
						<tbody>
							{#each MESURES as [quoi, combien] (quoi)}
								<tr><th scope="row">{quoi}</th><td>{combien}</td></tr>
							{/each}
						</tbody>
					</table>
					<p class="cout">
						Mesure faite dans un Firefox sans carte graphique : les valeurs sont plus hautes que sur un ordinateur courant, mais le rapport
						entre elles tient (S’apren : 4,6 %, 72,7 % et 29,2 %). Sur l’accueil, le gain est faible : la carte en étoiles et le fond vivant occupent déjà le processeur.
					</p>
				</div>
			</li>
		</ol>

		<h2 class="voir">Comparer</h2>
		<ul class="comparer">
			{#each PAGES as [chemin, nom] (chemin)}
				<li>
					<span>Sur {nom}</span>
					<a href="{chemin}?confetis=actuel">aujourd’hui</a>
					<a class="pc" href="{chemin}?confetis=fin">raffinés</a>
				</li>
			{/each}
		</ul>
		<p class="note">
			Le choix te suit de page en page jusqu’à la fermeture de l’onglet. Pour juger le mouvement : laisse la souris immobile quelques
			secondes, puis approche-la des pièces.
		</p>
	</main>
</div>

<style>
	.page {
		min-height: 100vh;
		color: var(--t-tinta);
		--marge: clamp(1rem, 4vw, 3.4rem);
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.essai {
		max-width: 50rem;
		margin: 0 auto;
		padding: 2.5rem var(--marge) 8rem;
	}
	.date {
		margin: 0 0 0.8rem;
		color: var(--t-aur);
		font-size: 0.9rem;
	}
	h1 {
		margin: 0 0 1.4rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.2rem, 6vw, 3.6rem);
		line-height: 1.05;
	}
	.intro {
		max-width: 62ch;
		margin: 0 0 0.9rem;
		line-height: 1.6;
	}
	.formes {
		list-style: none;
		margin: 2.6rem 0 0;
		padding: 0;
	}
	.formes li {
		display: grid;
		grid-template-columns: 3.4rem minmax(0, 1fr);
		column-gap: 1.2rem;
		padding: 1.7rem 0 1.9rem;
		border-top: 1px solid var(--t-linha);
	}
	.formes li:last-child {
		border-bottom: 1px solid var(--t-linha);
	}
	.lettre {
		font-family: var(--font-heading);
		font-size: 2.8rem;
		line-height: 0.95;
		color: var(--t-aur-gros, var(--t-aur));
	}
	h2 {
		margin: 0 0 0.5rem;
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.3;
	}
	.texte p {
		max-width: 60ch;
		margin: 0 0 0.5rem;
		line-height: 1.6;
	}
	.cout,
	.note {
		color: color-mix(in srgb, var(--t-tinta) 72%, transparent);
		font-size: 0.9rem;
	}
	table {
		margin: 1.2rem 0 0.9rem;
		border-collapse: collapse;
		font-variant-numeric: tabular-nums;
	}
	caption {
		padding-bottom: 0.5rem;
		text-align: left;
		font-size: 0.9rem;
		color: var(--t-aur);
	}
	th,
	td {
		padding: 0.55rem 0;
		border-top: 1px solid var(--t-linha);
		text-align: left;
		font-weight: 400;
	}
	td {
		padding-left: 2.5rem;
		text-align: right;
		font-weight: 700;
	}
	.voir {
		margin: 2.6rem 0 0.9rem;
	}
	.comparer {
		list-style: none;
		margin: 0;
		padding: 0;
		max-width: 30rem;
	}
	.comparer li {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0.7rem 0;
		border-top: 1px solid var(--t-linha);
	}
	.comparer span {
		flex: 1;
	}
	.comparer a:not(.pc) {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: var(--t-terra);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.3em;
	}
	.comparer a.pc {
		--r: 9px;
		min-height: 0;
		height: 2.4rem;
		padding: 0 1.1rem;
		font-size: 0.9rem;
		text-decoration: none;
	}
	.note {
		max-width: 62ch;
		margin: 1.4rem 0 0;
		line-height: 1.6;
	}
</style>
