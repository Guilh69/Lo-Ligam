<script>
	// Page d'essai (06-11) : les illustrations des familles de jeux en trois
	// manières, sur les vraies couleurs des cartes de la salle (thème Joiós).
	import Illustracion from './Illustracion.svelte';
	import { FAMILHAS } from '$lib/jocs/sala/cataleg.js';

	const ESTILS = [
		{ id: 'fil', nom: 'A · Le trait fin', mot: 'un seul trait, la couleur du texte, une touche d’or (comme les petites icônes des jeux)' },
		{ id: 'papier', nom: 'B · Le papier découpé', mot: 'des pièces pleines posées sur la carte, avec une ombre courte' }
	];
	const COLORS = {
		adreca: { fons: '#b53d17', tinta: '#fbf1e1', aur: '#ffd47f' },
		mots: { fons: '#eeaf34', tinta: '#2a1a10', aur: '#7a2e0c' },
		observacion: { fons: '#4f6a2f', tinta: '#fbf1e1', aur: '#ffd47f' },
		memoria: { fons: '#1f5f63', tinta: '#fbf1e1', aur: '#ffd47f' },
		escota: { fons: '#2b6496', tinta: '#fbf1e1', aur: '#ffd47f' }
	};
	const estil = (f) => {
		const c = COLORS[f.id];
		const aurTinta = f.id === 'mots' ? '#fbf1e1' : '#2a1a10';
		return `--lletra:${f.id === 'mots' ? '#2a1a10' : c.fons};--fons:${c.fons};--tinta:${c.tinta};--aur:${c.aur};--tinta-aur:${aurTinta};` +
			`--clar:${f.id === 'mots' ? '#fff8ea' : '#fbf1e1'};` +
			`--escur:color-mix(in oklab, ${c.fons}, #000 30%);` +
			`--mitjan:color-mix(in oklab, ${c.fons}, #fff 30%);` +
			`--clarfons:color-mix(in oklab, ${c.fons}, #fff 22%)`;
	};
</script>

<svelte:head>
	<title>Essai : illustrations des jeux</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="contengut" class="essai">
	<h1>Illustrations des familles de jeux</h1>
	<p class="intro">Le même dessin en deux manières, sur les vraies couleurs des cartes. Les dessins se corrigent ensuite ; ici on choisit la manière.</p>
	{#each ESTILS as e (e.id)}
		<section>
			<h2>{e.nom}</h2>
			<p class="mot">{e.mot}</p>
			<div class="cartas">
				{#each FAMILHAS as f (f.id)}
					<div class="carta" style={estil(f)}>
						<Illustracion id={f.id} estil={e.id} />
						<h3 lang="oc">{f.oc}</h3>
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
		background: #1e130e;
		color: #fbf1e1;
		font-family: var(--font-body);
	}
	h1 {
		margin: 0 0 0.4rem;
		font-size: 1.8rem;
	}
	.intro,
	.mot {
		margin: 0 0 1rem;
		color: rgba(251, 241, 225, 0.8);
	}
	h2 {
		margin: 2.2rem 0 0.2rem;
		font-size: 1.25rem;
	}
	.cartas {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 1.2rem;
	}
	@media (max-width: 1100px) {
		.cartas {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 560px) {
		.cartas {
			grid-template-columns: 1fr;
		}
	}
	.carta {
		padding: 1rem 1rem 0.9rem;
		border-radius: 0.9rem;
		background: var(--fons);
		color: var(--tinta);
	}
	h3 {
		margin: 0.7rem 0 0;
		font-size: 1.1rem;
	}
</style>
