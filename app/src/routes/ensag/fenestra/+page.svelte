<script>
	// Essai du 2026-11-12 (chantier 37, audit de l'accueil) : la photo et le vers de Max Rouquette.
	// Deux autres façons de les poser sur l'accueil, à la place de la fenêtre qui s'ouvre. Elles vivent
	// dans lib/acuelh/TrobadorEssai.svelte et se voient sur la vraie page d'accueil par « ?fenestra= » :
	// cette page ne fait que les présenter et y mener. Rien ne change tant que Romain n'a pas choisi.
	import AppHeader from '$lib/components/AppHeader.svelte';

	const FORMES = [
		{
			id: '',
			lettre: '',
			nom: 'Aujourd’hui',
			quoi: 'Une fenêtre aux coins ronds s’ouvre au milieu d’un écran vide jusqu’à remplir la page ; le vers est écrit en blanc sur la photo, assombrie pour qu’on puisse le lire.',
			cout: 'La photo est déjà une fenêtre : on en dessine une seconde par-dessus. Le voile ternit le paysage. Il faut traverser plus de deux écrans, d’où la poussée automatique ajoutée le 4 novembre.'
		},
		{
			id: 'pagina',
			lettre: 'A',
			nom: 'Dans la page',
			quoi: 'La photo dans le cadre des photos du site (celui du portrait), le vers à côté, sur le fond de la page. En descendant, on avance doucement vers l’ouverture de pierre et le vers remonte un peu.',
			cout: 'La plus calme ; c’est aussi la moins spectaculaire. Sur téléphone, la photo puis le vers dessous.'
		},
		{
			id: 'peira',
			lettre: 'B',
			nom: 'Sur la pierre',
			quoi: 'Une seule image, entière. Le vers est posé sur la pierre du linteau, le nom du poète dessous : la pierre sombre porte le texte, sans voile. En descendant, on avance vers l’ouverture ; les deux vers se lèvent l’un après l’autre.',
			cout: 'Sur grand écran, la photo reste un portrait au milieu de la page (elle ne remplit pas la largeur).',
			conseil: true
		}
	];
</script>

<svelte:head>
	<title>Essai : la fenêtre de Max Rouquette · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<div class="capçal"><AppHeader /></div>

	<main class="essai">
		<p class="date">Essai du 12 novembre 2026, accueil</p>
		<h1>La fenêtre de Max Rouquette</h1>
		<p class="intro">
			La photo montre déjà une fenêtre : une ouverture de pierre sur le paysage, un nuage dans le ciel. Et le vers dit : tu regardes, dans
			l’éclaircie, passer le rêve d’un nuage. Deux façons de les poser sans dessiner une seconde fenêtre ni assombrir la photo. Dans les
			deux, le défilement fait avancer vers l’ouverture.
		</p>
		<p class="intro">Chaque lien ouvre la vraie page d’accueil, à l’endroit de la photo. Remonte un peu puis redescends pour voir le mouvement.</p>

		<ol class="formes">
			{#each FORMES as f (f.id)}
				<li>
					<span class="lettre" aria-hidden="true">{f.lettre}</span>
					<div class="texte">
						<h2>
							{f.nom}
							{#if f.conseil}<span class="conseil">recommandée</span>{/if}
						</h2>
						<p>{f.quoi}</p>
						<p class="cout">{f.cout}</p>
						<p class="liens">
							<a class="pc" href={f.id ? `/?fenestra=${f.id}#trobador` : '/#trobador'}>Voir sur l’accueil</a>
						</p>
					</div>
				</li>
			{/each}
		</ol>

		<p class="note">
			La même photo sert aux deux (aucune image de plus à charger). Le texte du vers, le nom et la photo restent ceux que tu modifies
			avec « Editar » sur l’accueil.
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
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 1rem;
		margin: 0 0 0.5rem;
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.3;
	}
	.conseil,
	.ici {
		font-size: 0.85rem;
		font-weight: 400;
		color: var(--t-aur);
	}
	.texte p {
		max-width: 60ch;
		margin: 0 0 0.5rem;
		line-height: 1.6;
	}
	.cout {
		color: color-mix(in srgb, var(--t-tinta) 72%, transparent);
	}
	.liens {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1.5rem;
		margin-top: 1.1rem !important;
	}
	.liens a:not(.pc) {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: var(--t-terra);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.3em;
	}
	.liens a.pc {
		--r: 9px;
		min-height: 0;
		height: 2.4rem;
		padding: 0 1.1rem;
		font-size: 0.9rem;
		text-decoration: none;
	}
	.note {
		max-width: 62ch;
		margin: 2rem 0 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: color-mix(in srgb, var(--t-tinta) 72%, transparent);
	}
</style>
