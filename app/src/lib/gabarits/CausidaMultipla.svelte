<script>
	// Gabarit « choix multiple » : une question, trois ou quatre réponses ; un
	// toucher suffit, le retour explique la réponse choisie et montre la bonne.
	// Les réponses sont des pièces de papier (.pc-rep), comme dans le QCM du site.
	import Ecran from './Ecran.svelte';
	import Icona from '#lib/components/Icona.svelte';
	import { insecable } from '#lib/lesson/rich.js';

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
		<p class="question">{insecable(question)}</p>
		<ul class="opcions">
			{#each opcions as o, i (i)}
				<li>
					<button
						type="button"
						class="pc pc-rep opcion"
						class:est-bon={causit !== null && i === bona}
						class:est-faux={causit === i && i !== bona}
						disabled={causit !== null}
						onclick={() => (causit = i)}
						lang="oc"
					>
						<span>{insecable(o.oc)}</span>
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
		border-radius: 22px;
	}
	.question {
		margin: 0 0 1.1rem;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.4;
	}
	.opcions {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.opcion {
		width: 100%;
		min-height: 3.25rem;
		font-size: 1.1rem;
	}
	/* une fois répondu : la bonne et la choisie restent pleines, les autres pâlissent */
	.opcion.est-bon:disabled,
	.opcion.est-faux:disabled {
		opacity: 1;
		box-shadow: var(--pc-lev);
		cursor: default;
	}
</style>
