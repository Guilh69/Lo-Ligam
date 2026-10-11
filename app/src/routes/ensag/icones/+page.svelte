<script>
	// Banc d'essai des icônes pratiques (2026-10-12) : les caractères et émojis
	// actuels (× → ↗ ▶ 🔊 ⚙…) face à Phosphor et Iconoir, à côté des icônes
	// maison pour juger la parenté. Page de travail, non indexée.
	import { ICONES } from './icones.js';
	import CrossIcon from '$lib/components/CrossIcon.svelte';
	import QuillIcon from '$lib/components/QuillIcon.svelte';
	import BookIcon from '$lib/components/BookIcon.svelte';
	import CommunityIcon from '$lib/components/CommunityIcon.svelte';
	import LayersIcon from '$lib/components/LayersIcon.svelte';
	import EnvelopeIcon from '$lib/components/EnvelopeIcon.svelte';
	import MenuIcon from '$lib/components/MenuIcon.svelte';
	import InfoIcon from '$lib/components/InfoIcon.svelte';

	const MAISON = [
		[CrossIcon, 'Croix'], [QuillIcon, 'Plume'], [BookIcon, 'Livre'], [CommunityIcon, 'Communauté'],
		[LayersIcon, 'Couches'], [EnvelopeIcon, 'Enveloppe'], [MenuIcon, 'Menu'], [InfoIcon, 'Aide']
	];
	// [clé, fonction, caractère actuel, où on le voit aujourd'hui]
	const LIGNES = [
		['fermer', 'Fermer', '×', 'leçons, carte, fiches, mots'],
		['suivant', 'Suivant, continuer', '→', 'boutons « Contunhar », liens'],
		['precedent', 'Précédent', '←', 'mots, carrousel'],
		['extern', 'Lien vers un autre site', '↗', 'pied de page, fiches'],
		['lire', 'Lire', '▶', 'dialogues, vidéos'],
		['pause', 'Pause', '⏸', 'dialogues'],
		['son', 'Écouter', '🔊', 'leçons, vidéos'],
		['muet', 'Son coupé', '🔇', 'vidéos'],
		['reglages', 'Réglages', '⚙', 'en-tête'],
		['valide', 'Validé', '✓', 'leçons, sommaire'],
		['chercher', 'Rechercher', null, 'recherche de la carte (dessin maison)'],
		['revenir', 'Revenir', '‹', 'rail de la carte']
	];
	const JEUX = [
		['actuel', 'Actuel'],
		['ph', 'Phosphor, trait'],
		['phd', 'Phosphor, fond teinté'],
		['ic', 'Iconoir, trait réglable']
	];

	let taille = $state(24);
	let trait = $state(1.7); // épaisseur Iconoir ; les icônes maison sont entre 1,6 et 1,8
	let jeu = $state('ic'); // jeu montré dans la mise en situation
</script>

{#snippet icone(j, k, t = taille)}
	{#if j === 'actuel'}
		{#if k === 'chercher'}
			<svg viewBox="0 0 24 24" width={t} height={t} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"
				><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg
			>
		{:else}
			<span class="car" style:font-size="{t * 0.9}px" aria-hidden="true">{LIGNES.find((l) => l[0] === k)[2]}</span>
		{/if}
	{:else if j === 'ic'}
		<svg viewBox="0 0 24 24" width={t} height={t} fill="none" stroke-width={trait} aria-hidden="true">{@html ICONES.ic[k]}</svg>
	{:else}
		<svg viewBox="0 0 256 256" width={t} height={t} fill="currentColor" aria-hidden="true">{@html ICONES[j][k]}</svg>
	{/if}
{/snippet}

<svelte:head>
	<title>Icônes pratiques · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="banc">
	<header>
		<h1>Icônes pratiques</h1>
		<p>
			Aujourd'hui, les icônes pratiques du site sont des caractères et des émojis : leur dessin change d'un
			téléphone à l'autre. Voici trois façons de les harmoniser avec les icônes maison.
		</p>
		<div class="reglatges">
			<label>Taille
				<select bind:value={taille}>
					<option value={20}>20 px (bouton discret)</option>
					<option value={24}>24 px (taille courante)</option>
					<option value={32}>32 px (gros bouton)</option>
				</select>
			</label>
			<label>Trait Iconoir
				<input type="range" min="1.2" max="2.4" step="0.1" bind:value={trait} />
				<output>{String(trait).replace('.', ',')}</output>
			</label>
		</div>
	</header>

	<section>
		<h2>La famille maison</h2>
		<ul class="maison">
			{#each MAISON as [Ic, nom] (nom)}
				<li><Ic size={taille} /><span>{nom}</span></li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Les douze icônes pratiques</h2>
		<div class="taula" role="table" aria-label="Comparaison des icônes">
			<div class="ren cap" role="row">
				<span role="columnheader">Fonction</span>
				{#each JEUX as [j, nom] (j)}<span role="columnheader">{nom}</span>{/each}
			</div>
			{#each LIGNES as [k, nom, , lòc] (k)}
				<div class="ren" role="row">
					<span class="fonc" role="rowheader"><b>{nom}</b><small>{lòc}</small></span>
					{#each JEUX as [j] (j)}
						<span class="cela" role="cell">{@render icone(j, k)}</span>
					{/each}
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2>En situation</h2>
		<div class="tria" role="radiogroup" aria-label="Jeu d'icônes">
			{#each JEUX as [j, nom] (j)}
				<label class:actiu={jeu === j}><input type="radio" name="jeu" value={j} bind:group={jeu} />{nom}</label>
			{/each}
		</div>
		<div class="scenas">
			<div class="scena barra">
				<button type="button" class="rond" aria-label="Fermer">{@render icone(jeu, 'fermer', 22)}</button>
				<span class="progres"><span style:width="40%"></span></span>
				<button type="button" class="rond" aria-label="Écouter">{@render icone(jeu, 'son', 22)}</button>
			</div>
			<div class="scena">
				<button type="button" class="principal">Contunhar {@render icone(jeu, 'suivant', 20)}</button>
			</div>
			<div class="scena dialòg">
				<button type="button" class="rond plen" aria-label="Lire">{@render icone(jeu, 'lire', 20)}</button>
				<span>Adieu, cossí va ?</span>
				<button type="button" class="rond" aria-label="Écouter">{@render icone(jeu, 'son', 20)}</button>
				<span class="ok">{@render icone(jeu, 'valide', 20)}</span>
			</div>
			<div class="scena">
				<a href="#ensag" class="ligam">Instagram {@render icone(jeu, 'extern', 16)}</a>
				<span class="cerca">{@render icone(jeu, 'chercher', 20)}<span>Cercar una vila, un despartament…</span></span>
			</div>
		</div>
	</section>
</main>

<style>
	.banc {
		max-width: 64rem;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
		color: var(--t-tinta);
	}
	h1 {
		margin: 0 0 0.4rem;
		font-size: 2rem;
	}
	h2 {
		margin: 2rem 0 0.8rem;
		font-size: 1.25rem;
	}
	header p {
		margin: 0 0 1rem;
		max-width: 46rem;
		color: var(--t-tinta-2);
	}
	.reglatges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
		align-items: center;
		font-size: 0.875rem;
	}
	.reglatges label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.reglatges select {
		padding: 0.35rem 0.6rem;
		border: 1px solid var(--t-linha);
		border-radius: 8px;
		background: var(--t-fons-2);
		color: var(--t-tinta);
	}
	.reglatges input[type='range'] {
		accent-color: var(--t-aur);
	}
	.maison {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.maison li {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		min-width: 5.5rem;
		padding: 0.8rem 0.5rem;
		border: 1px solid var(--t-linha);
		border-radius: 12px;
		background: var(--t-fons-2);
	}
	.maison span,
	.fonc small {
		font-size: 0.75rem;
		color: var(--t-tinta-2);
	}
	.taula {
		border: 1px solid var(--t-linha);
		border-radius: 12px;
		overflow: hidden;
	}
	.ren {
		display: grid;
		grid-template-columns: minmax(9rem, 1.4fr) repeat(4, 1fr);
		align-items: center;
		border-top: 1px solid var(--t-linha);
	}
	.ren:nth-child(even) {
		background: var(--t-fons-2);
	}
	.cap {
		border-top: 0;
		font-size: 0.8rem;
		font-weight: 700;
		background: var(--t-fons-2);
	}
	.cap span,
	.fonc,
	.cela {
		padding: 0.6rem 0.75rem;
	}
	.cap span:not(:first-child),
	.cela {
		text-align: center;
	}
	.cela {
		display: grid;
		place-items: center;
		min-height: 3rem;
	}
	.fonc {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		font-size: 0.9rem;
	}
	.car {
		line-height: 1;
	}
	.tria {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	.tria label {
		padding: 0.4rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.tria label.actiu {
		border-color: var(--t-aur);
		color: var(--t-aur);
		font-weight: 700;
	}
	.tria input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
	.tria label:has(input:focus-visible) {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.scenas {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: 1rem;
	}
	.scena {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		padding: 1rem;
		border: 1px solid var(--t-linha);
		border-radius: 14px;
		background: var(--t-fons-2);
	}
	.rond {
		display: grid;
		place-items: center;
		flex: none;
		width: 2.6rem;
		height: 2.6rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: var(--t-fons);
		color: var(--t-tinta);
		cursor: pointer;
	}
	.rond.plen {
		border-color: transparent;
		background: var(--t-terra);
		color: #f5ead8;
	}
	.progres {
		flex: 1;
		height: 0.5rem;
		border-radius: 999px;
		background: var(--t-linha);
		overflow: hidden;
	}
	.progres span {
		display: block;
		height: 100%;
		background: var(--t-aur);
	}
	.principal {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.7rem 1.3rem;
		border: 0;
		border-radius: 999px;
		background: var(--t-terra);
		color: #f5ead8;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.dialòg > span:not(.ok) {
		flex: 1;
	}
	.ok {
		display: grid;
		color: var(--color-olive);
	}
	.ligam {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		color: var(--t-aur);
	}
	.cerca {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		min-width: 12rem;
		padding: 0.5rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		color: var(--t-tinta-2);
		font-size: 0.9rem;
	}
	@media (max-width: 40rem) {
		.ren {
			grid-template-columns: minmax(5.5rem, 1.2fr) repeat(4, minmax(0, 1fr));
		}
		.fonc small {
			display: none;
		}
		.fonc {
			padding-right: 0.3rem;
			font-size: 0.8rem;
		}
		.cap span {
			font-size: 0.65rem;
			padding: 0.5rem 0.15rem;
			overflow-wrap: anywhere;
		}
	}
</style>
