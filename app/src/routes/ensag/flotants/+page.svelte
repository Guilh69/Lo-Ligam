<script>
	// Essai du 07-11, repris le 08-11 (idée de Romain) : des petits éléments qui flottent sur le fond du
	// site, qu'on fait virevolter, et qu'on peut attraper pour voir le mot en occitan. Les deux pistes
	// restent en option (« Aucun », « Confettis », « Objets »), comme elles le seraient dans le réglage
	// d'ambiance du site. Rien d'occitan écrit ici n'est du texte du site, sauf les noms d'objets
	// (objets.js), vérifiés par l'API de lo Congrès, à valider par Romain.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Flotants from '$lib/flotants/Flotants.svelte';
	import { OBJETS } from '$lib/flotants/objets.js';

	let mode = $state('objets');
	let attrapes = $state([]);
	const attrape = (o) => {
		if (!attrapes.some((x) => x.id === o.id)) attrapes = [...attrapes, o];
	};
</script>

<svelte:head>
	<title>Essai : des flotteurs sur le fond · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#key mode}
	{#if mode !== 'aucun'}<Flotants {mode} onattrape={attrape} />{/if}
{/key}

<div class="page">
	<div class="capçal"><AppHeader /></div>

	<main class="essai">
		<h1>Essai : le fond qui bouge</h1>
		<p class="intro">
			Un fond qui vit, en option. Les pièces évitent les blocs de texte : elles glissent dans les marges et entre les paragraphes. Lance-les
			avec la souris (ou le doigt) vers le texte : elles passent derrière, puis ressortent.
		</p>

		<div class="commandes">
			<div class="groupe" role="group" aria-label="Fond animé">
				<span class="etiq">Fond animé</span>
				<button type="button" class="pc pc-2 pc-chip" aria-pressed={mode === 'aucun'} onclick={() => (mode = 'aucun')}>Aucun</button>
				<button type="button" class="pc pc-2 pc-chip" aria-pressed={mode === 'confettis'} onclick={() => (mode = 'confettis')}>Confettis</button>
				<button type="button" class="pc pc-2 pc-chip" aria-pressed={mode === 'objets'} onclick={() => (mode = 'objets')}>Objets</button>
			</div>
		</div>

		{#if mode === 'objets'}
			<p class="regle">
				<b>Objets à attraper.</b> Approche la souris d’un objet : il s’éclaire, grossit un peu et ralentit, le curseur devient une main.
				Clique : il s’arrête, le mot s’affiche en occitan, puis il déguerpit et revient plus tard. Au doigt, touche près de l’objet.
			</p>
			<p class="mots" aria-live="polite">
				<span class="etiq">Mots attrapés : {attrapes.length} sur {OBJETS.length}</span>
				{#each attrapes as o (o.id)}<span class="mot-pris" lang="oc">{o.oc}</span>{/each}
			</p>
		{:else if mode === 'confettis'}
			<p class="regle">
				<b>Confettis.</b> Du papier de couleur, tout petit et pâli. On ne peut pas les attraper, mais la main les écarte et les emporte.
			</p>
		{:else}
			<p class="regle"><b>Aucun.</b> Le fond reste calme, comme aujourd’hui.</p>
		{/if}

		<section class="maquette" aria-label="Maquette d’une page du site">
			<h2>Se parla. S’apren. Amassa.</h2>
			<p>
				Benvenguda dins ton ligam amb lo mond occitan. D’ont que siás, aicí siès en çò tieu. Passa la mirga suls tres mots.
			</p>
			<ul class="teulas">
				<li style="--f: #9c2626">Se parla</li>
				<li style="--f: #1f5f63">S’apren</li>
				<li style="--f: #4f6a2f">Amassa</li>
			</ul>
			<p>
				Ce bloc de texte sert à juger la lecture : le fond doit rester un fond, sans jamais rendre un mot plus difficile à lire. Les pièces
				contournent ce paragraphe comme les autres ; si tu en lances une dessus, elle passe derrière, puis elle est repoussée vers la sortie
				la plus proche.
			</p>
			<p>
				Fais défiler la page : le fond reste à l’écran, comme le ferait un fond fixe du site, et les pièces se réarrangent autour du texte qui
				arrive. Sur téléphone, un glissé du doigt sur le fond emporte les pièces sans bloquer le défilement.
			</p>
			<p>
				Les confettis et les objets s’arrêtent si l’appareil demande moins d’animations. Un lecteur d’écran ne lit rien du décor, sauf le mot
				d’un objet attrapé.
			</p>
		</section>
	</main>
</div>

<style>
	.page {
		position: relative;
		z-index: 1;
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
		max-width: 46rem;
		margin: 0 auto;
		padding: 1.2rem var(--marge) 8rem;
	}
	h1 {
		margin: 0 0 0.6rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.9rem, 5vw, 2.8rem);
		line-height: 1.05;
	}
	.intro,
	.regle,
	.maquette p {
		max-width: 62ch;
		line-height: 1.5;
	}
	.commandes {
		display: grid;
		gap: 0.6rem;
		margin: 1.2rem 0 0.8rem;
	}
	.groupe {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}
	.etiq {
		margin-right: 0.4rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.mots {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem 0.5rem;
		min-height: 2.2rem;
	}
	.mot-pris {
		padding: 0.15rem 0.7rem;
		border-radius: 999px;
		background: var(--pc-or-fons, #c7811b);
		color: var(--pc-or-tinta, #2a1a10);
		font-weight: 700;
	}
	.maquette {
		margin-top: 2rem;
		padding-top: 1.4rem;
		border-top: 1px solid var(--t-linha);
	}
	h2 {
		margin: 0 0 0.6rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.6rem, 4.4vw, 2.4rem);
	}
	.teulas {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.6rem;
		margin: 1.2rem 0;
		padding: 0;
		list-style: none;
	}
	.teulas li {
		display: grid;
		align-content: end;
		min-height: 7rem;
		padding: 0.9rem;
		border-radius: 6px;
		background: var(--f);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 1.2rem;
	}
</style>
