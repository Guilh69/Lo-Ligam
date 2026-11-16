<script>
	// Gabarit « vrai ou faux » : une image (ou une vidéo), une affirmation, deux
	// réponses ; le retour explique toujours, juste ou non (principe 8).
	import Ecran from './Ecran.svelte';

	let { foto, afirmacion, responsa, explic, avança = 0.75, oncontunhar } = $props();
	let causit = $state(null); // true | false | null

	const retorn = $derived(
		causit === null
			? null
			: causit === responsa
				? { just: true, titol: { oc: 'Òsca !', fr: 'bravo' }, explic }
				: { just: false, titol: { oc: 'Pas encara', fr: 'pas encore' }, explic }
	);
</script>

<Ecran {avança} consigna={{ oc: 'Vertat o fals ?', fr: 'vrai ou faux ?' }} {retorn} boton={{ oc: 'Contunhar', actiu: causit !== null, onclick: oncontunhar }} onpassar={causit === null ? oncontunhar : null}>
	{#snippet media()}
		<img class="foto" src={foto.src} alt={foto.alt} width="800" height="533" />
	{/snippet}
	{#snippet accion()}
		<p class="afirmacion">{afirmacion}</p>
		<div class="causidas">
			{#each [true, false] as v (v)}
				<button
					type="button"
					class="causida"
					class:causit={causit === v}
					class:bona={causit !== null && v === responsa}
					disabled={causit !== null}
					onclick={() => (causit = v)}
				>
					<span lang="oc">{v ? 'Vertat' : 'Fals'}</span> <span class="glosa">({v ? 'vrai' : 'faux'})</span>
				</button>
			{/each}
		</div>
	{/snippet}
</Ecran>

<style>
	.foto {
		display: block;
		width: 100%;
		height: 11rem;
		object-fit: cover;
		border-radius: 3px;
	}
	.afirmacion {
		margin: 0;
		font-size: 1.25rem;
		line-height: 1.4;
	}
	.causidas {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
		margin-top: 1rem;
	}
	.causida {
		min-height: 3rem;
		border: 1px solid var(--t-tinta-2);
		border-radius: 3px;
		background: transparent;
		color: var(--t-tinta);
		font: inherit;
		font-size: 1.05rem;
		cursor: pointer;
	}
	.causida:disabled {
		cursor: default;
		opacity: 0.55;
	}
	.causida.causit {
		opacity: 1;
		border-width: 2px;
	}
	.causida.bona {
		opacity: 1;
		border: 2px solid var(--t-aur);
	}
	.causida:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.glosa {
		color: var(--t-tinta-2);
		font-size: 0.9em;
	}
</style>
