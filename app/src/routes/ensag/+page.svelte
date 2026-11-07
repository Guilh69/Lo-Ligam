<script>
	// Le banc d'essai : l'index de tous les essais du site (2026-11-07). Page de
	// travail, non indexée. La liste est dans ./essais.js (une ligne par essai).
	// Suit le thème choisi dans la barre (la page est dans ARMONIZADAS).
	// Les liens « Sur téléphone et tablette » et les vieux essais locaux ne
	// s'affichent qu'en développement : l'aperçu est un fichier de static/, retiré
	// au build, parce que le vrai site interdit d'être mis dans un cadre.
	import { dev } from '$app/environment';
	import { GROUPES, ADOPTES, LOCAUX } from './essais.js';

	const nEssais = GROUPES.reduce((n, g) => n + g.essais.length, 0);
	const nombre = (i) => String(i + 1).padStart(2, '0');
</script>

<svelte:head>
	<title>Banc d’essai · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="contengut" class="banc" lang="fr">
	<header>
		<h1>Banc d’essai</h1>
		<p class="chapo">
			Tous les essais du site, rangés au même endroit. Un essai est une page de travail : rien n’est branché sur
			le vrai site tant que tu ne l’as pas validé.
		</p>
		<p class="compte">{nEssais} essais en cours · {ADOPTES.length} devenus de vraies pages</p>
		{#if dev}
			<p class="outil">
				<a class="bouton" href="/esbos-apercu.html" data-sveltekit-reload>Voir sur téléphone et tablette</a>
			</p>
		{/if}
	</header>

	{#each GROUPES as g, i (g.id)}
		<section aria-labelledby={'g-' + g.id}>
			<h2 id={'g-' + g.id}><span class="num">{nombre(i)}</span> {g.titre}</h2>
			<p class="intro">{g.intro}</p>
			<ul>
				{#each g.essais as e (e.chemin)}
					<li class:avec-cadres={dev}>
						<a class="essai" href={e.chemin}>
							<span class="titre">{e.titre}</span>
							<span class="texte">{e.texte}</span>
						</a>
						{#if dev}
							<a class="cadres" href={`/esbos-apercu.html?page=${encodeURIComponent(e.chemin)}`} data-sveltekit-reload>
								Sur téléphone et tablette
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/each}

	<section aria-labelledby="g-adoptes">
		<h2 id="g-adoptes"><span class="num">{nombre(GROUPES.length)}</span> Devenus de vraies pages</h2>
		<p class="intro">Ces essais ont été adoptés : ils vivent maintenant dans le site.</p>
		<ul>
			{#each ADOPTES as e (e.chemin)}
				<li>
					<a class="essai" href={e.chemin}>
						<span class="titre">{e.titre}</span>
						<span class="texte">{e.texte}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	{#if dev}
		<section aria-labelledby="g-locaux">
			<h2 id="g-locaux"><span class="num">{nombre(GROUPES.length + 1)}</span> Sur cet ordinateur seulement</h2>
			<p class="intro">Les anciens essais et maquettes du dossier static : ils ne sont jamais mis en ligne.</p>
			<ul>
				{#each LOCAUX as e (e.chemin)}
					<li>
						<a class="essai" href={e.chemin} data-sveltekit-reload>
							<span class="titre">{e.titre}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>

<style>
	.banc {
		max-width: 56rem;
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) 16px 4rem;
		font-family: var(--font-body);
		color: var(--t-tinta);
		container-type: inline-size;
	}
	h1 {
		margin: 0 0 var(--esp-16);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.2rem, 6vw, 3.6rem);
		line-height: 1.1;
	}
	.chapo {
		max-width: 40rem;
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--t-tinta-2);
	}
	.compte {
		margin: var(--esp-12) 0 0;
		font-size: 0.85rem;
		font-variant-numeric: tabular-nums;
		color: var(--t-tinta-2);
	}
	.outil {
		margin: var(--esp-24) 0 0;
	}
	.bouton {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 var(--esp-24);
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font-weight: 700;
		text-decoration: none;
	}
	.bouton:hover {
		background: var(--t-accion-viu);
	}

	section {
		margin-top: var(--esp-48);
	}
	h2 {
		display: flex;
		align-items: baseline;
		gap: var(--esp-12);
		margin: 0;
		/* Limelight est réservée aux gros titres : les titres de section en Luciole */
		font-family: var(--font-body);
		font-size: 1.3rem;
		font-weight: 700;
	}
	.num {
		font-weight: 400;
		font-size: 0.95rem;
		font-variant-numeric: tabular-nums;
		color: var(--t-aur);
	}
	.intro {
		margin: var(--esp-4) 0 var(--esp-16);
		font-size: 0.95rem;
		color: var(--t-tinta-2);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		border-bottom: 1px solid var(--t-linha);
	}
	li {
		display: grid;
		border-top: 1px solid var(--t-linha);
	}
	.essai {
		display: block;
		padding: var(--esp-16) 0;
		color: inherit;
		text-decoration: none;
	}
	.titre {
		display: block;
		font-size: 1.08rem;
		font-weight: 700;
		/* le rouge du logo en soulignement : ce qui se clique (règle B) */
		text-decoration: underline;
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.3em;
		width: fit-content;
	}
	.texte {
		display: block;
		margin-top: var(--esp-4);
		font-size: 0.93rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.titre {
		transition: text-underline-offset 0.15s ease;
	}
	.essai:hover .titre,
	.essai:focus-visible .titre {
		text-underline-offset: 0.42em;
	}
	.essai:hover .texte,
	.essai:focus-visible .texte {
		color: var(--t-tinta);
	}
	.essai:focus-visible,
	.cadres:focus-visible,
	.bouton:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.cadres {
		padding: 0 0 var(--esp-16);
		width: fit-content;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
		text-decoration: underline;
		text-decoration-color: var(--t-linha);
		text-underline-offset: 0.3em;
	}
	.cadres:hover {
		color: var(--t-tinta);
	}

	@container (min-width: 40rem) {
		li.avec-cadres {
			grid-template-columns: 1fr auto;
			align-items: center;
			column-gap: var(--esp-24);
		}
		li.avec-cadres .cadres {
			padding: var(--esp-16) 0;
		}
	}
</style>
