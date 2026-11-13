<script>
	// Livret technique : le plan du projet en dix briques, la fiche de la brique touchée en dessous.
	// Données : $lib/libret/fichas.js (texte brut). Maquette validée par Romain, 2026-11-13.
	import { FICHAS } from '$lib/libret/fichas.js';

	const CLE = 'livret-brique';
	let choix = $state('site');
	let fiche = $derived(FICHAS.find((f) => f.id === choix) ?? FICHAS[0]);

	// la dernière brique ouverte est un confort propre à ce navigateur
	try {
		const sauvee = localStorage.getItem(CLE);
		if (sauvee && FICHAS.some((f) => f.id === sauvee)) choix = sauvee;
	} catch {
		/* stockage indisponible : on garde « site » */
	}

	function montrer(id) {
		choix = id;
		try {
			localStorage.setItem(CLE, id);
		} catch {
			/* sans importance */
		}
	}
	function touche(e, id) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			montrer(id);
		}
	}
</script>

<svelte:head>
	<title>Livret technique — Espaci d'administracion</title>
</svelte:head>

<section class="libret" aria-labelledby="libret-titol">
	<h1 id="libret-titol">Comment marche Lo Ligam</h1>
	<p class="chapeau">
		Neuf briques, reliées entre elles. Touche une brique pour lire à quoi elle sert, où elle vit et ce qui se passe si elle tombe.
	</p>

	<div class="plan">
		<svg viewBox="0 0 360 400" role="group" aria-label="Plan du projet : dix briques reliées">
			<defs>
				<marker id="f" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
					<path class="pointe" d="M0 0 8 4 0 8z" />
				</marker>
			</defs>
			<path class="lien" d="M130 48H116" marker-end="url(#f)" />
			<path class="lien" d="M230 48H244" marker-end="url(#f)" />
			<path class="lien" d="M180 76V118" marker-start="url(#f)" />
			<path class="lien" d="M296 76V118" marker-end="url(#f)" />
			<path class="lien" d="M296 176V218" marker-end="url(#f)" />
			<path class="lien" d="M246 248H232" marker-end="url(#f)" />
			<path class="lien" d="M130 248H116" marker-end="url(#f)" marker-start="url(#f)" />
			<path class="lien" d="M180 276V318" marker-end="url(#f)" />
			<text class="etiq" x="302" y="100">on pousse</text>
			<text class="etiq" x="302" y="200">ça part seul</text>
			<text class="etiq" x="186" y="100">ouvre</text>
			<text class="etiq" x="186" y="300">envoie</text>
			<g class="brique" data-id="congres" role="button" tabindex="0" aria-pressed={choix === 'congres'} onclick={() => montrer('congres')} onkeydown={(e) => touche(e, 'congres')}>
				<rect x="14" y="20" width="100" height="56" rx="5" />
				<text x="64" y="44">Lo Congrès</text>
				<text class="lieu" x="64" y="61">le dictionnaire</text>
			</g>
			<g class="brique" data-id="ia" role="button" tabindex="0" aria-pressed={choix === 'ia'} onclick={() => montrer('ia')} onkeydown={(e) => touche(e, 'ia')}>
				<rect x="130" y="20" width="100" height="56" rx="5" />
				<text x="180" y="44">L'équipe d'IA</text>
				<text class="lieu" x="180" y="61">L'amic, Mistral</text>
			</g>
			<g class="brique" data-id="dossier" role="button" tabindex="0" aria-pressed={choix === 'dossier'} onclick={() => montrer('dossier')} onkeydown={(e) => touche(e, 'dossier')}>
				<rect x="246" y="20" width="100" height="56" rx="5" />
				<text x="296" y="44">Le dossier</text>
				<text class="lieu" x="296" y="61">ton ordinateur</text>
			</g>
			<g class="brique" data-id="cles" role="button" tabindex="0" aria-pressed={choix === 'cles'} onclick={() => montrer('cles')} onkeydown={(e) => touche(e, 'cles')}>
				<rect x="130" y="120" width="100" height="56" rx="5" />
				<text x="180" y="144">Le trousseau</text>
				<text class="lieu" x="180" y="161">les clés</text>
			</g>
			<g class="brique" data-id="github" role="button" tabindex="0" aria-pressed={choix === 'github'} onclick={() => montrer('github')} onkeydown={(e) => touche(e, 'github')}>
				<rect x="246" y="120" width="100" height="56" rx="5" />
				<text x="296" y="144">GitHub</text>
				<text class="lieu" x="296" y="161">le coffre</text>
			</g>
			<g class="brique" data-id="base" role="button" tabindex="0" aria-pressed={choix === 'base'} onclick={() => montrer('base')} onkeydown={(e) => touche(e, 'base')}>
				<rect x="14" y="220" width="100" height="56" rx="5" />
				<text x="64" y="244">La base</text>
				<text class="lieu" x="64" y="261">le classeur</text>
			</g>
			<g class="brique" data-id="site" role="button" tabindex="0" aria-pressed={choix === 'site'} onclick={() => montrer('site')} onkeydown={(e) => touche(e, 'site')}>
				<rect x="130" y="220" width="100" height="56" rx="5" />
				<text x="180" y="244">Le site</text>
				<text class="lieu" x="180" y="261">loligam.eu</text>
			</g>
			<g class="brique" data-id="livraison" role="button" tabindex="0" aria-pressed={choix === 'livraison'} onclick={() => montrer('livraison')} onkeydown={(e) => touche(e, 'livraison')}>
				<rect x="246" y="220" width="100" height="56" rx="5" />
				<text x="296" y="244">La livraison</text>
				<text class="lieu" x="296" y="261">mise en ligne</text>
			</g>
			<g class="brique" data-id="courriels" role="button" tabindex="0" aria-pressed={choix === 'courriels'} onclick={() => montrer('courriels')} onkeydown={(e) => touche(e, 'courriels')}>
				<rect x="130" y="320" width="100" height="56" rx="5" />
				<text x="180" y="344">Les courriels</text>
				<text class="lieu" x="180" y="361">le facteur</text>
			</g>
			<g class="brique" data-id="voix" role="button" tabindex="0" aria-pressed={choix === 'voix'} onclick={() => montrer('voix')} onkeydown={(e) => touche(e, 'voix')}>
				<rect x="246" y="320" width="100" height="56" rx="5" />
				<text x="296" y="344">La voix</text>
				<text class="lieu" x="296" y="361">le studio</text>
			</g>
		</svg>
		<p class="legende">Les flèches montrent qui parle à qui.</p>
	</div>

	{#key fiche.id}
		<article class="fiche" aria-live="polite">
			<h2>{fiche.titol}</h2>
			<p class="image">{fiche.imatge}</p>
			<dl>
				<div><dt>À quoi ça sert</dt><dd>{fiche.quoi}</dd></div>
				<div><dt>Où ça vit</dt><dd>{fiche.ou}</dd></div>
				<div><dt>Si ça tombe</dt><dd>{fiche.tombe}</dd></div>
				<div><dt>À retenir</dt><dd>{fiche.retenir}</dd></div>
			</dl>
			{#if fiche.mots.length}
				<ul class="mots" aria-label="Mots expliqués">
					{#each fiche.mots as m (m.mot)}
						<li><strong>{m.mot}</strong> : {m.explication}</li>
					{/each}
				</ul>
			{/if}
		</article>
	{/key}

	<p class="pied">Une fiche s'ajoute ou change à chaque décision technique. Dernière mise à jour : 13 novembre 2026.</p>
</section>

<style>
	/* Couleurs : celles de l'espace d'administration et de la palette du site, jamais de code en dur. */
	.libret {
		--fond: var(--l-sol);
		--carton: var(--l-carta);
		--encre: var(--t-tinta);
		--doux: var(--t-tinta-2);
		--trait: var(--t-linha);
		--action: var(--t-accion);
		--choisi: var(--p-or);
		--choisi-encre: var(--p-encre);
		--sarcelle: var(--l-teal);
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		font-family: var(--font-body);
		color: var(--encre);
		line-height: 1.5;
	}
	.libret h1 {
		font-size: clamp(1.75rem, 7vw, 2.5rem);
		line-height: 1.1;
		text-wrap: balance;
	}
	.chapeau {
		margin: 0;
		max-width: 34em;
		font-family: var(--font-quote);
		font-size: 1.25rem;
		line-height: 1.35;
		color: var(--doux);
	}
	.plan {
		background: var(--carton);
		border: 1px solid var(--trait);
		border-radius: 6px;
		padding: 0.6rem;
	}
	.plan svg {
		display: block;
		width: 100%;
		height: auto;
		max-width: 520px;
		margin: 0 auto;
	}
	.lien {
		stroke: var(--trait);
		stroke-width: 2;
		fill: none;
	}
	.pointe {
		fill: var(--trait);
	}
	.etiq {
		font: italic 500 12px var(--font-quote);
		fill: var(--doux);
	}
	.brique {
		cursor: pointer;
		outline: none;
	}
	.brique rect {
		fill: var(--fond);
		stroke: var(--action);
		stroke-width: 1.5;
	}
	.brique text {
		font: 600 12.5px var(--font-body);
		fill: var(--encre);
		text-anchor: middle;
		pointer-events: none;
	}
	.brique .lieu {
		font: 11px var(--font-body);
		fill: var(--doux);
	}
	.brique:hover rect {
		stroke-width: 2.5;
	}
	.brique:focus-visible rect {
		stroke-width: 3;
		stroke-dasharray: 4 3;
	}
	.brique[aria-pressed='true'] rect {
		fill: var(--choisi);
		stroke: var(--choisi);
	}
	.brique[aria-pressed='true'] text {
		fill: var(--choisi-encre);
	}
	.legende {
		margin: 0.5rem 0.1rem 0;
		font-size: 0.85rem;
		color: var(--doux);
		text-align: center;
	}
	.fiche {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}
	.libret .fiche h2 {
		margin: 0;
		font-size: 1.6rem;
		line-height: 1.15;
	}
	.image {
		margin: 0;
		padding-left: 0.9rem;
		border-left: 3px solid var(--choisi);
		font-family: var(--font-quote);
		font-size: 1.4rem;
		line-height: 1.3;
	}
	dl {
		margin: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.75rem;
	}
	dl div {
		min-width: 0;
	}
	dt {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--sarcelle);
	}
	dd {
		margin: 0.15rem 0 0;
		max-width: 38em;
		overflow-wrap: anywhere;
	}
	.mots {
		margin: 0;
		padding: 0.6rem 0.8rem;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.92rem;
		color: var(--doux);
		border: 1px dotted var(--trait);
		border-radius: 6px;
	}
	.mots strong {
		color: var(--encre);
	}
	.pied {
		margin: 0;
		padding-top: 0.75rem;
		border-top: 1px solid var(--trait);
		font-size: 0.85rem;
		color: var(--doux);
	}
	@media (min-width: 640px) {
		dl {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1rem 1.75rem;
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		.fiche {
			animation: arrivee 0.25s ease-out;
		}
		@keyframes arrivee {
			from {
				transform: translateY(6px);
			}
			to {
				transform: none;
			}
		}
	}
</style>
