<script>
	// Essai du 07-11 : des pièces vives pour le thème clair, « comme les en-têtes de
	// la page des jeux » (Romain). Le même petit écran dans trois partis, sur le
	// fond clair du site. Tout passe par les jetons de papier.css.
	import Icona from '$lib/components/Icona.svelte';

	const PASTILLES = ['Tot', 'Occitan', 'Francés', 'Catalan'];
	const PARTIS = [
		{
			id: 'or',
			nom: '1 · L’or vif',
			mot: 'les pièces discrètes en or des jeux ; la pièce choisie passe au rouge du logo ; le vert pour la bonne réponse',
			vars: '--pc-carton:#f2b53a;--pc-icone:#f2b53a;'
		},
		{
			id: 'sarcelle',
			nom: '2 · Une seule teinte vive : la sarcelle',
			mot: 'les pièces discrètes en sarcelle (celle des jeux de mémoire), qui tranche avec le rouge d’action ; l’or marque ce qui est choisi',
			vars: '--pc-carton:#1f5f63;--pc-icone:#1f5f63;'
		},
		{
			id: 'role',
			nom: '3 · Les teintes des jeux, une par rôle',
			mot: 'sarcelle pour le calme, bleu pour les boutons-icônes, rouge pour agir, or pour le choisi, vert pour le juste',
			vars: '--pc-carton:#1f5f63;--pc-icone:#2b6496;'
		}
	];
</script>

<svelte:head>
	<title>Essai : couleurs des pièces, thème clair</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="contengut" class="essai">
	<h1>Des couleurs vives pour le thème clair</h1>
	<p class="intro">
		En thème clair, le carton des pièces est un sable pâle : il ne tient pas à côté des cartes vives des jeux.
		Trois façons de le raviver, le même petit écran à chaque fois.
	</p>

	{#each PARTIS as p (p.id)}
		<section>
			<h2>{p.nom}</h2>
			<p class="mot">{p.mot}</p>
			<div class="pan {p.id}" style={p.vars}>
				<div class="barre">
					<button type="button" class="pc pc-2 pc-icone ico" aria-label="Menu"><Icona nom="menu" /></button>
					<button type="button" class="pc pc-2 pc-icone ico" aria-label="Son"><Icona nom="son" /></button>
					<button type="button" class="pc pc-2 pc-icone ico" aria-label="Réglages"><Icona nom="reglages" /></button>
					<span class="espaci"></span>
					<button type="button" class="pc pc-2 tornar">Tornar</button>
				</div>
				<div class="chips">
					{#each PASTILLES as c, i (c)}<button type="button" class="pc pc-2 pc-chip" aria-pressed={i === 1}>{c}</button>{/each}
				</div>
				<div class="reps">
					<button type="button" class="pc pc-rep est-bon">Bonjorn<Icona nom="valide" /></button>
					<button type="button" class="pc pc-rep">Mercé</button>
					<button type="button" class="pc pc-rep">Tornar</button>
				</div>
				<div class="accions">
					<button type="button" class="pc pc-2">Mai tard</button>
					<button type="button" class="pc">Contunhar</button>
				</div>
				<div class="carta">
					<span class="carta-nom">Carte</span>
					<div class="zoom">
						<button type="button" class="pc pc-2 pc-icone ico" aria-label="Zoom avant"><span aria-hidden="true">+</span></button>
						<button type="button" class="pc pc-2 pc-icone ico" aria-label="Zoom arrière"><span aria-hidden="true">−</span></button>
					</div>
				</div>
			</div>
		</section>
	{/each}
</main>

<style>
	.essai {
		min-height: 100vh;
		padding: 2rem clamp(1rem, 4vw, 4.5rem) 4rem;
		background: #f7f3ee;
		color: #2a1a10;
		font-family: var(--font-body);
		--t-fons: #f7f3ee;
		--t-fons-2: #ede6dc;
		--t-tinta: #2a1a10;
		--t-tinta-2: rgba(42, 26, 16, 0.72);
		--t-linha: rgba(42, 26, 16, 0.14);
		--t-aur: #9c5611;
		--t-aur-clar: #8a3f12;
		--t-accion: #b53d17;
		--t-accion-tinta: #fbf1e1;
		--pc-ombre: rgba(20, 10, 5, 0.32);
		--pc-or-fons: #eeaf34;
	}
	h1 {
		margin: 0 0 0.4rem;
		font-size: 1.8rem;
	}
	h2 {
		margin: 2.4rem 0 0.2rem;
		font-size: 1.2rem;
	}
	.intro,
	.mot {
		max-width: 66ch;
		margin: 0 0 1rem;
		color: var(--t-tinta-2);
	}
	.pan {
		display: grid;
		gap: 1.1rem;
		width: min(100%, 22rem);
		padding: 1.1rem 1.2rem 1.3rem;
		background: var(--t-fons-2);
		border: 1px solid var(--t-linha);
	}
	.barre,
	.chips,
	.accions,
	.zoom {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
	}
	.espaci {
		flex: 1;
	}
	.reps {
		display: grid;
		gap: 0.6rem;
	}
	.carta {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.carta-nom {
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.pan :global(.ico) {
		--pc-fons: var(--pc-icone, var(--pc-carton));
	}
	.pan :global(.pc-rep:not(.est-bon)) {
		--pc-fons: var(--pc-carton);
	}
	/* parti 1 : l'or vif prend le texte brun ; le choisi passe au rouge du logo */
	.or :global(.pc-2),
	.or :global(.ico),
	.or :global(.pc-rep:not(.est-bon)) {
		--pc-tinta: #2a1a10;
	}
	.or :global(.pc-chip[aria-pressed='true']) {
		--pc-fons: var(--t-accion);
		--pc-tinta: #fbf1e1;
	}
	/* partis 2 et 3 : les pièces vives portent un texte crème */
	.sarcelle :global(.pc-2),
	.sarcelle :global(.ico),
	.sarcelle :global(.pc-rep:not(.est-bon)),
	.role :global(.pc-2),
	.role :global(.ico),
	.role :global(.pc-rep:not(.est-bon)) {
		--pc-tinta: #fbf1e1;
	}
	.sarcelle :global(.pc-chip[aria-pressed='true']),
	.role :global(.pc-chip[aria-pressed='true']) {
		--pc-fons: var(--pc-or-fons);
		--pc-tinta: #2a1a10;
	}
</style>
