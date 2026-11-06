<script>
	// Essai du 07-11 : des couleurs plus vivantes pour les pièces de papier, avec
	// les teintes des familles de jeux (rouge #b53d17, or #eeaf34, vert #4f6a2f,
	// sarcelle #1f5f63, bleu #2b6496). Le même petit écran dans trois partis :
	// A, une teinte par rôle ; B, la même famille mais plus chaude ; C, une
	// teinte par zone du site. Tout passe par les jetons de papier.css.
	import Icona from '$lib/components/Icona.svelte';

	const PASTILLES = ['Tot', 'Occitan', 'Francés', 'Catalan'];
	const PARTIS = [
		{
			id: 'a',
			nom: 'A · Une teinte par rôle',
			mot: 'le rouge pour agir, la sarcelle pour le calme (retour, choix), le bleu pour les petits boutons-icônes, l’or pour ce qui est choisi, le vert pour la bonne réponse',
			panneaux: [{ titre: 'Tout le site', vars: '--pc-carton:#1f5f63;--pc-icone:#2b6496;' }]
		},
		{
			id: 'b',
			nom: 'B · La même famille, plus chaude',
			mot: 'on garde le carton mais il devient terre cuite vive, sur un fond brun plus chaud : un peu plus de vie, sans changer le rôle des couleurs',
			panneaux: [{ titre: 'Tout le site', vars: '--pc-carton:#8a4a2a;--pc-icone:#8a4a2a;--fond:#3a1a0e;' }]
		},
		{
			id: 'c',
			nom: 'C · Une teinte par zone',
			mot: 'chaque zone prend la couleur d’une famille de jeu pour ses pièces discrètes : leçons en sarcelle, jeux en bleu, carte en vert',
			panneaux: [
				{ titre: 'Leçons', vars: '--pc-carton:#1f5f63;--pc-icone:#1f5f63;' },
				{ titre: 'Jeux', vars: '--pc-carton:#2b6496;--pc-icone:#2b6496;' },
				{ titre: 'Carte', vars: '--pc-carton:#4f6a2f;--pc-icone:#4f6a2f;' }
			]
		}
	];
</script>

<svelte:head>
	<title>Essai : couleurs des pièces</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="contengut" class="essai">
	<h1>Des couleurs plus vivantes pour les boutons</h1>
	<p class="intro">
		Aujourd’hui les pièces discrètes sont en carton brun : sobre, mais terne à côté des cartes des jeux. Voici trois
		façons de les raviver avec les teintes des jeux. Le même petit écran à chaque fois, en thème sombre.
	</p>

	{#each PARTIS as p (p.id)}
		<section>
			<h2>{p.nom}</h2>
			<p class="mot">{p.mot}</p>
			<div class="panneaux">
				{#each p.panneaux as pan (pan.titre)}
					<div class="pan" style={pan.vars}>
						<p class="pan-titre">{pan.titre}</p>
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
				{/each}
			</div>
		</section>
	{/each}
</main>

<style>
	.essai {
		min-height: 100vh;
		padding: 2rem clamp(1rem, 4vw, 4.5rem) 4rem;
		background: #22100a;
		color: #fbf1e1;
		font-family: var(--font-body);
		--t-fons: #22100a;
		--t-fons-2: #2f170e;
		--t-tinta: #fbf1e1;
		--t-tinta-2: rgba(251, 241, 225, 0.78);
		--t-linha: rgba(251, 241, 225, 0.2);
		--t-aur: #f6b73c;
		--t-aur-clar: #ffd98a;
		--t-accion: #b53d17;
		--t-accion-tinta: #fbf1e1;
		--pc-ombre: rgba(0, 0, 0, 0.6);
		--pc-or-fons: #eeaf34;
	}
	h1 {
		margin: 0 0 0.4rem;
		font-size: 1.8rem;
	}
	h2 {
		margin: 2.6rem 0 0.2rem;
		font-size: 1.25rem;
	}
	.intro,
	.mot {
		max-width: 66ch;
		margin: 0 0 1rem;
		color: var(--t-tinta-2);
	}
	.panneaux {
		display: flex;
		flex-wrap: wrap;
		gap: 1.4rem;
	}
	.pan {
		display: grid;
		gap: 1.1rem;
		width: min(100%, 22rem);
		padding: 1.1rem 1.2rem 1.3rem;
		background: var(--fond, var(--t-fons-2));
		border: 1px solid var(--t-linha);
	}
	.pan-titre {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-aur);
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
	/* les boutons-icônes prennent leur teinte propre (partis A et C) */
	.pan :global(.ico) {
		--pc-fons: var(--pc-icone, var(--pc-carton));
	}
	/* la réponse neutre prend la teinte discrète du parti */
	.pan :global(.pc-rep:not(.est-bon)) {
		--pc-fons: var(--pc-carton);
	}
	.carta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.2rem;
	}
	.carta-nom {
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
</style>
