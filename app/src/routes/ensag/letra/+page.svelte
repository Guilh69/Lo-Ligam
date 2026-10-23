<script>
	// Banc d'ensag de las animacions de tèxt (retorn de Romain, 2026-10-11 :
	// las « suggestions » de Canva, reproduchas dins lo site) : cada vinheta
	// tòrna jogar son efèct a cada clic. Pagina de trabalh, pas indexada.
	import { onMount } from 'svelte';
	import { animarText } from '$lib/actions/animarText.js';

	const LISTA = [
		['maquina', 'Machine à écrire'],
		['ascension', 'Ascension'],
		['decalatge', 'Décalage'],
		['fusion', 'Fusion'],
		['bloc', 'Bloc'],
		['explosion', 'Explosion'],
		['rebond', 'Rebond'],
		['deroulat', 'Déroulé'],
		['patinatge', 'Patinage'],
		['escart', 'Écart'],
		['clarificar', 'Clarifier']
	];
	let tèxt = $state('Montpelhièr');
	let velocitat = $state(1);
	const els = {};
	const jogar = (ef) => animarText(els[ef], ef, { tèxt: tèxt || 'Lo Ligam', velocitat });
	const totes = () => LISTA.forEach(([ef], k) => animarText(els[ef], ef, { tèxt: tèxt || 'Lo Ligam', velocitat, retard: k * 90 }));
	// (lo tèxt es pas gerit per Svelte dins las vinhetas : l'animacion lo copa en letras)
	$effect(() => {
		const t = tèxt || 'Lo Ligam';
		for (const el of Object.values(els)) {
			el?._animarText?.anullar();
			if (el) el.textContent = t;
		}
	});
	onMount(() => setTimeout(totes, 300));
</script>

<svelte:head>
	<title>Animations de texte · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="banc">
	<header>
		<h1>Animations de texte</h1>
		<p>Les onze effets de Canva, reproduits pour le site. Clique sur une vignette pour la rejouer.</p>
		<div class="reglatges">
			<label>Texte <input type="text" bind:value={tèxt} maxlength="40" /></label>
			<label>Vitesse
				<select bind:value={velocitat}>
					<option value={0.5}>lente</option>
					<option value={1}>normale</option>
					<option value={1.6}>vive</option>
				</select>
			</label>
			<button type="button" onclick={totes}>Tout rejouer</button>
		</div>
	</header>
	<ul>
		{#each LISTA as [ef, nom] (ef)}
			<li>
				<button type="button" class="vinheta" onclick={() => jogar(ef)} aria-label="Rejouer : {nom}">
					<span class="mostra" bind:this={els[ef]}></span>
				</button>
				<span class="nom">{nom}</span>
			</li>
		{/each}
	</ul>
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
	header p {
		margin: 0 0 1rem;
		color: var(--t-tinta-2);
	}
	.reglatges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.25rem;
		align-items: center;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}
	.reglatges input,
	.reglatges select {
		margin-left: 0.4rem;
		padding: 0.35rem 0.6rem;
		border: 1px solid var(--t-linha);
		border-radius: 8px;
		background: var(--t-fons-2);
		color: var(--t-tinta);
		font: inherit;
	}
	.reglatges button {
		padding: 0.45rem 1rem;
		border: 1px solid var(--t-aur);
		border-radius: 999px;
		background: none;
		color: var(--t-aur-clar);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr));
		gap: 1.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	.vinheta {
		display: grid;
		place-items: center;
		width: 100%;
		aspect-ratio: 1;
		padding: 0.75rem;
		border: 1px solid var(--t-linha);
		border-radius: 16px;
		background: color-mix(in srgb, var(--t-fons-2) 85%, transparent);
		color: var(--t-aur-clar);
		cursor: pointer;
		overflow: hidden;
		transition: border-color 0.2s ease;
	}
	.vinheta:hover,
	.vinheta:focus-visible {
		border-color: var(--t-aur);
		outline: none;
	}
	.mostra {
		font: 600 1.6rem/1.2 'Cormorant Garamond', Georgia, serif;
		font-style: italic;
		text-align: center;
	}
	.nom {
		font-size: 0.875rem;
		font-weight: 600;
	}
</style>
