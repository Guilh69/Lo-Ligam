<script>
	// Gabarit « dialogue en bulles » : on écoute d'abord (principe 1), le texte
	// suit ; la traduction se cache d'un geste, pour tester son oreille. Des
	// phrases entières, pas de grammaire (principe 3).
	// Le son est une pièce pétrole ; « Traduccion » est l'interrupteur du site
	// (.pc-basc, lib/styles/papier.css) : allumé ou éteint se lit d'un coup d'œil,
	// en clair comme en sombre.
	import Ecran from './Ecran.svelte';
	import Bulla from './Bulla.svelte';
	import BotonSon from './BotonSon.svelte';
	import { insecable } from '$lib/lesson/rich.js';

	let { replicas, personatges, son, avança = 0.4, oncontunhar } = $props();
	let traduccion = $state(true);
	// le nom s'écrit à la première réplique de chacun
	const primièra = (i) => replicas.findIndex((r) => r.qui === replicas[i].qui) === i;
</script>

<Ecran {avança} consigna={{ oc: 'Escota lo dialòg', fr: 'écoute le dialogue' }} boton={{ oc: 'Contunhar', actiu: true, onclick: oncontunhar }}>
	{#snippet media()}
		<div class="media-son">
			<BotonSon src={son} gran />
			<button type="button" class="trad" aria-pressed={traduccion} onclick={() => (traduccion = !traduccion)}>
				<span class="pc-basc" aria-hidden="true"></span><span lang="oc">Traduccion</span>
			</button>
		</div>
	{/snippet}
	{#snippet accion()}
		{#each replicas as r, i (i)}
			<Bulla personatge={personatges[r.qui]} fr={traduccion ? insecable(r.fr) : ''} ambNom={primièra(i)}>{insecable(r.oc)}</Bulla>
		{/each}
	{/snippet}
</Ecran>

<style>
	.media-son {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
	}
	.trad {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		min-height: 44px;
		padding: 0.4rem 0.2rem;
		border: 0;
		border-radius: 8px;
		background: none;
		color: var(--t-tinta-2);
		font: inherit;
		font-size: 0.95rem;
		cursor: pointer;
	}
	.trad[aria-pressed='true'] {
		color: var(--t-tinta);
	}
	.trad:focus-visible {
		outline: 3px solid var(--t-aur-clar, #ffd98a);
		outline-offset: 2px;
	}
</style>
