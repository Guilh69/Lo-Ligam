<script>
	// Écouter un son dans un gabarit : un geste, lecture ou arrêt ; un seul son à
	// la fois sur la page ($lib/voix/lecteur.js). Une pièce de papier pétrole, qui
	// passe à l'or tant que le son joue. « gran » : la pièce porte son nom (le
	// geste principal d'un écran d'écoute), sinon une petite pièce carrée ;
	// « pila » : le nom sous le pictogramme, pour tenir à côté du micro.
	import Icona from '$lib/components/Icona.svelte';
	import { jouer } from '$lib/voix/lecteur.js';

	let { src, gran = false, pila = false, label = 'Escota', glosa = 'écoute', onfin = null } = $props();
	let arret = $state(null);

	function basculer() {
		if (arret) return arret();
		arret = jouer(src, () => {
			arret = null;
			onfin?.();
		});
	}
</script>

<button type="button" class="pc son" class:pc-2={!arret} class:pc-or={!!arret} class:pc-icone={!gran} class:pila aria-pressed={!!arret} onclick={basculer}>
	<Icona nom={arret ? 'pause' : 'son'} size="1.35rem" />
	{#if gran}
		<span class="nom"><span lang="oc">{label}</span> <span class="glosa">({glosa})</span></span>
	{:else}
		<span class="sr">{label} ({glosa})</span>
	{/if}
</button>

<style>
	.son {
		flex: none;
	}
	.pila {
		flex-direction: column;
		gap: 0.3rem;
		min-width: 5.25rem;
		min-height: 4.5rem;
		padding: 0.6rem 0.7rem;
	}
	/* sur une pièce : le mot occitan, sa traduction dessous */
	.nom {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.1rem;
	}
	.pila .nom {
		align-items: center;
	}
	.glosa {
		font-style: italic;
		font-weight: 400;
		font-size: 0.85em;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
