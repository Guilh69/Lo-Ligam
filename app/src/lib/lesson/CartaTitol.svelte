<script>
	// Ouverture d'unité (décision du 2026-10-25, option B) : en attendant les
	// visuels de scène de Romain, l'unité s'ouvre sur son titre. Harmonisée le
	// même jour avec les pages de rubrique (S'apren) : pas de carte blanche, le
	// numéro en or et le titre en grand, posés sur le fond du site.
	//
	// ouverture = { numero, bloc: { oc, fr }, titre, fr, phrase }
	import { rich, insecable } from '$lib/lesson/rich.js';
	import { animat } from '$lib/actions/animarText.js';

	let { ouverture } = $props();
</script>

<section class="ouverture" aria-labelledby="titol-unitat">
	<p class="surtitre">
		Unitat {ouverture.numero} · <span lang="oc">{ouverture.bloc.oc}</span>
		<span class="fr">({ouverture.bloc.fr})</span>
	</p>
	<h1 id="titol-unitat">
		<b aria-hidden="true">{String(ouverture.numero).padStart(2, '0')}</b>
		<span lang="oc" {@attach animat('decalatge')}>{insecable(ouverture.titre)}</span>
	</h1>
	<p class="titre-fr">({ouverture.fr})</p>
	<p class="phrase">{@html rich(ouverture.phrase)}</p>
</section>

<style>
	.ouverture {
		padding-bottom: var(--esp-24);
		border-bottom: 1px solid var(--t-linha);
	}

	.surtitre {
		margin: 0;
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--t-aur);
	}

	/* la glose passe à la ligne tout d'un bloc : jamais « autour) » seul */
	.fr {
		white-space: nowrap;
		letter-spacing: 0;
		text-transform: none;
		color: var(--t-tinta-2);
	}

	/* le gabarit des pages de rubrique : le numéro, puis le titre en grand */
	h1 {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 0.3em;
		margin: var(--esp-8) 0 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3.2rem, 11vw, 7rem);
		line-height: 0.95;
		letter-spacing: -0.01em;
		color: var(--t-tinta);
	}

	h1 b {
		font-weight: 400;
		font-size: 0.42em;
		color: var(--t-aur);
	}

	.titre-fr {
		margin: var(--esp-12) 0 0;
		font-size: clamp(1.05rem, 1.5vw, 1.25rem);
		color: var(--t-tinta-2);
	}

	.phrase {
		max-width: 46ch;
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.05rem, 1.5vw, 1.2rem);
		line-height: 1.5;
	}
</style>
