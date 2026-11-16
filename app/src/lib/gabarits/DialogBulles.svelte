<script>
	// Gabarit « dialogue en bulles » : une scène de la vie, écoutée ; chaque
	// réplique avec sa traduction (repliable : on peut l'écouter sans lire).
	import Ecran from './Ecran.svelte';
	import Bulla from './Bulla.svelte';
	import BotonSon from './BotonSon.svelte';

	let { replicas, personatges, son, avança = 0.4, oncontunhar } = $props();
	let traduccion = $state(true);
</script>

<Ecran {avança} consigna={{ oc: 'Escota lo dialòg', fr: 'écoute le dialogue' }} boton={{ oc: 'Contunhar', actiu: true, onclick: oncontunhar }}>
	{#snippet media()}
		<div class="media-son">
			<BotonSon src={son} gran />
			<button type="button" class="ligam" aria-pressed={traduccion} onclick={() => (traduccion = !traduccion)}>
				{traduccion ? 'cacher la traduction' : 'montrer la traduction'}
			</button>
		</div>
	{/snippet}
	{#snippet accion()}
		{#each replicas as r, i (i)}
			<Bulla personatge={personatges[r.qui]} fr={traduccion ? r.fr : ''}>{r.oc}</Bulla>
		{/each}
	{/snippet}
</Ecran>

<style>
	.media-son {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.ligam {
		padding: 0.25rem;
		border: 0;
		background: none;
		color: var(--t-tinta-2);
		font: inherit;
		font-size: 0.9rem;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}
	.ligam:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
</style>
