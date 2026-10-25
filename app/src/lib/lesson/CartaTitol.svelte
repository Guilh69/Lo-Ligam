<script>
	// Carte de titre d'ouverture d'unité (décision du 2026-10-25, option B) :
	// en attendant les visuels de scène de Romain, l'unité s'ouvre sobrement
	// sur son titre, la question du premier module et une phrase sur ce qu'on
	// saura faire. Quand la scène sera prête, elle prendra cette place.
	//
	// ouverture = { numero, bloc: { oc, fr }, titre, fr, question, questionFr, phrase }
	import { rich } from '$lib/lesson/rich.js';
	import { animat } from '$lib/actions/animarText.js';

	let { ouverture } = $props();
</script>

<section class="carta-titol" aria-labelledby="titol-unitat">
	<p class="bloc">
		<span lang="oc">{ouverture.bloc.oc}</span>
		<span class="bloc-fr">({ouverture.bloc.fr})</span>
	</p>
	<p class="numero">Unitat {ouverture.numero}</p>
	<h1 id="titol-unitat" class="titre" lang="oc" {@attach animat('decalatge')}>{ouverture.titre}</h1>
	<p class="titre-fr">({ouverture.fr})</p>
	<span class="trait" aria-hidden="true"></span>
	<p class="question">
		Première question : <span lang="oc">{ouverture.question}</span>
		<span class="question-fr">({ouverture.questionFr})</span>
	</p>
	<p class="phrase">{@html rich(ouverture.phrase)}</p>
</section>

<style>
	.carta-titol {
		position: relative;
		text-align: center;
		padding: 2rem 1.4rem 1.6rem;
		border-radius: 24px;
		background: white;
		box-shadow: 0 10px 28px rgba(58, 42, 32, 0.12);
		overflow: hidden;
		animation: fade-in 500ms ease-out;
	}

	/* un liseré or et rouge, les couleurs du logo, en haut de la carte */
	.carta-titol::before {
		content: '';
		position: absolute;
		inset: 0 0 auto;
		height: 6px;
		background: linear-gradient(90deg, var(--color-gold) 0 50%, var(--color-terracotta) 50% 100%);
	}

	.bloc {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-teal);
	}

	.bloc-fr {
		font-weight: 400;
		text-transform: none;
		letter-spacing: 0;
	}

	.numero {
		margin: 1.1rem 0 0;
		font-family: var(--font-heading);
		font-size: 1rem;
		color: var(--color-text);
		opacity: 0.75;
	}

	.titre {
		margin: 0.1rem 0 0;
		font-family: var(--font-heading);
		font-size: clamp(2.6rem, 9vw, 3.6rem);
		line-height: 1.05;
		color: var(--color-brick);
	}

	.titre-fr {
		margin: 0.2rem 0 0;
		font-size: 0.95rem;
		color: var(--color-teal);
	}

	.trait {
		display: block;
		width: 3rem;
		height: 2px;
		margin: 1.1rem auto;
		background: var(--color-gold);
	}

	.question {
		margin: 0;
		font-size: 1rem;
		color: var(--color-text);
	}

	.question span[lang='oc'] {
		font-family: var(--font-heading);
		color: var(--color-brick);
	}

	.question-fr {
		display: block;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.phrase {
		max-width: 30rem;
		margin: 0.8rem auto 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: rgba(42, 26, 16, 0.85);
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: none; }
	}

	@media (prefers-reduced-motion: reduce) {
		.carta-titol { animation: none; }
	}
</style>
