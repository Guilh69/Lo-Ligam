<script>
	// Deux réponses posées côte à côte : deux pièces de papier identiques, même
	// taille, même forme, même écriture (le mot occitan, sa traduction dessous).
	// La pièce choisie passe à l'or et se soulève ; le choix peut être changé.
	let { opcions, causida = null, oncausir, label } = $props();
</script>

<div class="causidas" role="group" aria-label={label}>
	{#each opcions as o (o.id)}
		<button type="button" class="pc pc-rep causida" class:est-choisi={causida === o.id} aria-pressed={causida === o.id} onclick={() => oncausir(o.id)}>
			<span class="mot"><span lang="oc">{o.oc}</span> <span class="glosa">({o.fr})</span></span>
		</button>
	{/each}
</div>

<style>
	.causidas {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.7rem;
		margin-top: 1.1rem;
	}
	.causida {
		justify-content: center;
		min-height: 3.5rem;
		padding: 0.5rem 0.6rem;
		font-size: 1.1rem;
		text-align: center;
	}
	.mot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
	}
	.glosa {
		font-style: italic;
		font-weight: 400;
		font-size: 0.88em;
	}
</style>
