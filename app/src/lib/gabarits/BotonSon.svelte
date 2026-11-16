<script>
	// Écouter un son dans un gabarit : un geste, lecture ou arrêt ; un seul son à
	// la fois sur la page ($lib/voix/lecteur.js). « gran » : le bouton principal
	// d'un écran d'écoute, sinon un petit bouton de réplique.
	import Icona from '$lib/components/Icona.svelte';
	import { jouer } from '$lib/voix/lecteur.js';

	let { src, gran = false, label = 'Escota', glosa = 'écoute', onfin = null } = $props();
	let arret = $state(null);

	function basculer() {
		if (arret) return arret();
		arret = jouer(src, () => {
			arret = null;
			onfin?.();
		});
	}
</script>

<button type="button" class="son" class:gran class:en-cors={arret} aria-pressed={!!arret} onclick={basculer}>
	<Icona nom={arret ? 'pause' : 'son'} size={gran ? '1.5rem' : '1.1rem'} />
	{#if gran}<span lang="oc">{label}</span> <span class="glosa">({glosa})</span>{:else}<span class="sr">{label} ({glosa})</span>{/if}
</button>

<style>
	.son {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-width: 2.75rem;
		min-height: 2.75rem;
		padding: 0.35rem;
		border: 1px solid var(--t-linha);
		border-radius: 3px;
		background: transparent;
		color: var(--t-accion);
		font: inherit;
		cursor: pointer;
	}
	.son.gran {
		padding: 0.6rem 1rem;
		border-color: var(--t-accion);
		font-size: 1.05rem;
	}
	.son.en-cors {
		background: color-mix(in srgb, var(--t-accion) 10%, transparent);
	}
	.son:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.glosa {
		color: var(--t-tinta-2);
		font-size: 0.9em;
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
