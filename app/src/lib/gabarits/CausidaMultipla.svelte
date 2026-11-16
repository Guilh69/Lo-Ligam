<script>
	// Gabarit « choix multiple » : une question, trois ou quatre réponses ; un
	// toucher suffit, le retour explique la réponse choisie et montre la bonne.
	import Ecran from './Ecran.svelte';
	import Icona from '$lib/components/Icona.svelte';

	let { question, opcions, foto = null, avança = 0.9, oncontunhar } = $props();
	let causit = $state(null); // index de la réponse touchée

	const bona = $derived(opcions.findIndex((o) => o.just));
	const retorn = $derived.by(() => {
		if (causit === null) return null;
		const o = opcions[causit];
		if (o.just) return { just: true, titol: { oc: 'Òsca !', fr: 'bravo' }, explic: o.explic };
		return { just: false, titol: { oc: 'Pas encara', fr: 'pas encore' }, explic: `${o.explic} La bonne réponse : « ${opcions[bona].oc} » ; ${opcions[bona].explic}` };
	});
</script>

<Ecran {avança} consigna={{ oc: 'Causís la bona responsa', fr: 'choisis la bonne réponse' }} {retorn} boton={{ oc: 'Contunhar', actiu: causit !== null, onclick: oncontunhar }} onpassar={causit === null ? oncontunhar : null}>
	{#snippet media()}
		{#if foto}<img class="foto" src={foto.src} alt={foto.alt} width="800" height="533" />{/if}
	{/snippet}
	{#snippet accion()}
		<p class="question">{question}</p>
		<ul class="opcions">
			{#each opcions as o, i (i)}
				<li>
					<button
						type="button"
						class="opcion"
						class:causida={causit === i}
						class:bona={causit !== null && i === bona}
						disabled={causit !== null}
						onclick={() => (causit = i)}
						lang="oc"
					>
						<span>{o.oc}</span>
						{#if causit !== null && i === bona}<Icona nom="valide" size="1.2rem" label="bonne réponse" />{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/snippet}
</Ecran>

<style>
	.foto {
		display: block;
		width: 100%;
		height: 8rem;
		object-fit: cover;
		border-radius: 3px;
	}
	.question {
		margin: 0 0 0.9rem;
		font-size: 1.25rem;
		line-height: 1.4;
	}
	.opcions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.opcion {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		min-height: 3rem;
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--t-tinta-2);
		border-radius: 3px;
		background: transparent;
		color: var(--t-tinta);
		font: inherit;
		font-size: 1.1rem;
		text-align: left;
		cursor: pointer;
	}
	.opcion:disabled {
		cursor: default;
		opacity: 0.55;
	}
	.opcion.causida {
		opacity: 1;
		border-width: 2px;
	}
	.opcion.bona {
		opacity: 1;
		border: 2px solid var(--t-aur);
		color: var(--t-tinta);
	}
	.opcion.bona :global(svg) {
		color: var(--t-aur);
	}
	.opcion:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
</style>
