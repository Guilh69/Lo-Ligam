<script>
	// Essai du 2026-11-12 (chantier 37, audit de l'accueil) : où ranger « Se parla, S'apren, Amassa »
	// dans la barre du haut, sur grand écran. Les trois formes vivent dans le vrai composant
	// (AppHeader, paramètre d'adresse « ?barra= ») : cette page ne fait que les présenter et y mener.
	// Rien ne change sur le site tant que Romain n'a pas choisi. Le téléphone garde ses cinq onglets.
	import { page } from '$app/state';
	import AppHeader from '$lib/components/AppHeader.svelte';

	const FORMES = [
		{
			id: 'actuala',
			lettre: '',
			nom: 'Aujourd’hui',
			quoi: 'Les trois verbes sont à droite, contre « Reservar un cors », depuis le 7 novembre.',
			cout: 'Neuf éléments à la suite à droite ; les trois verbes se lisent aussi dans le grand titre de l’accueil, juste dessous.'
		},
		{
			id: 'vuda',
			lettre: 'A',
			nom: 'Presque vide',
			quoi: 'Les trois verbes quittent la barre. C’est la décision du 15 octobre, sur le modèle de l’Alliance : le nom, une seule action en couleur, les réglages, le menu.',
			cout: 'Sur ordinateur, changer de rubrique passe par le menu : deux clics au lieu d’un.'
		},
		{
			id: 'plan',
			lettre: 'B',
			nom: 'Le plan à gauche',
			quoi: 'Les trois verbes passent à côté du nom, derrière un filet. À droite ne restent que la réservation et les réglages. Un clic pour changer de rubrique ; la rubrique en cours est soulignée.',
			cout: 'Sur l’accueil, les trois mots se lisent juste au-dessus du grand titre, qui dit la même chose.'
		},
		{
			id: 'pagina',
			lettre: 'C',
			nom: 'Selon la page',
			quoi: 'Sur l’accueil, barre presque vide : le grand titre et les tuiles sont déjà le plan. Sur toutes les autres pages, le plan à gauche, comme dans B.',
			cout: 'La barre n’est pas la même sur l’accueil et ailleurs. Sur cette page-ci, elle ressemble à B.',
			conseil: true
		}
	];

	// la forme en cours : le paramètre d'adresse, sinon celle gardée pour la visite
	let enCours = $state('actuala');
	$effect(() => {
		const p = page.url.searchParams.get('barra');
		let v = p;
		try {
			if (v === null) v = sessionStorage.getItem('lo-ligam-essai-barra');
		} catch {
			// stockage indisponible : on s'en tient à l'adresse
		}
		enCours = FORMES.some((f) => f.id === v) ? v : 'actuala';
	});
</script>

<svelte:head>
	<title>Essai : la barre du haut · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<div class="capçal"><AppHeader /></div>

	<main class="essai">
		<p class="date">Essai du 12 novembre 2026, grand écran</p>
		<h1>La barre du haut</h1>
		<p class="intro">
			« Se parla », « S’apren » et « Amassa » se lisent à trois endroits : dans la barre, dans le menu et sur l’accueil (le grand titre,
			puis les tuiles). Trois façons de ranger la barre. Le menu, le pied de page et le téléphone (cinq onglets en bas) ne changent dans
			aucune.
		</p>
		<p class="intro">
			Choisis une forme : elle s’applique à la barre ci-dessus et te suit de page en page, jusqu’à la fermeture de l’onglet.
		</p>

		<ol class="formes">
			{#each FORMES as f (f.id)}
				<li class:choisie={enCours === f.id}>
					<span class="lettre" aria-hidden="true">{f.lettre}</span>
					<div class="texte">
						<h2>
							{f.nom}
							{#if f.conseil}<span class="conseil">recommandée</span>{/if}
							{#if enCours === f.id}<span class="ici">affichée en ce moment</span>{/if}
						</h2>
						<p>{f.quoi}</p>
						<p class="cout">{f.cout}</p>
						<p class="liens">
							<a class="pc" href="?barra={f.id}" data-sveltekit-noscroll>Essayer ici</a>
							<a href="/?barra={f.id}">Voir sur l’accueil</a>
							<a href="/apren?barra={f.id}">Voir sur S’apren</a>
							<a href="/cultura?barra={f.id}">Voir sur Cultura</a>
						</p>
					</div>
				</li>
			{/each}
		</ol>

		<p class="note">
			Largeur : les trois verbes n’entrent dans la barre qu’à partir d’environ 1 100 px ; en dessous, le bouton « Menú » fait le travail,
			comme aujourd’hui.
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
