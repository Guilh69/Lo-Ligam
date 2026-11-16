<script>
	// Une réplique de dialogue : l'initiale du personnage, la bulle, la
	// traduction dessous. À gauche ou à droite selon le personnage.
	let { personatge, fr = '', children } = $props();
	const drecha = $derived(personatge.costat === 'drecha');
</script>

<div class="replica" class:drecha>
	<span class="qui" aria-hidden="true">{personatge.nom[0]}</span>
	<div class="bulla">
		<span class="nom">{personatge.nom}</span>
		<p class="oc" lang="oc">{@render children()}</p>
		{#if fr}<p class="fr">{fr}</p>{/if}
	</div>
</div>

<style>
	.replica {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 0.6rem;
	}
	.replica.drecha {
		flex-direction: row-reverse;
	}
	.qui {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--t-linha);
		border-radius: 3px;
		font-family: var(--font-heading);
		font-size: 1.05rem;
		color: var(--t-aur);
	}
	.bulla {
		max-width: 80%;
		padding: 0.45rem 0.7rem 0.5rem;
		border: 1px solid var(--t-linha);
		border-radius: 3px;
	}
	.drecha .bulla {
		background: var(--t-fons-2);
		border-color: transparent;
	}
	.nom {
		display: block;
		font-size: 0.78rem;
		color: var(--t-tinta-2);
	}
	.oc {
		margin: 0.1rem 0 0;
		font-size: 1.05rem;
		line-height: 1.6;
	}
	.fr {
		margin: 0.1rem 0 0;
		font-size: 0.88rem;
		color: var(--t-tinta-2);
	}
</style>
