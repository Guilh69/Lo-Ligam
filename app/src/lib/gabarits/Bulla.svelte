<script>
	// Une réplique de dialogue : l'initiale de la personne en Limelight, sa
	// bulle, la traduction dessous. La personne de gauche parle sur le papier
	// des leçons (--l-carta), celle de droite sur le carton pétrole. Les bulles
	// sont du papier POSÉ (ombre courte) : seul ce qui se touche est soulevé.
	// Le coin serré de la bulle est du côté de la personne qui parle.
	// « ambNom » : le nom s'écrit à la première réplique de chacun ; ensuite
	// l'initiale suffit à l'œil (le nom reste dit aux lecteurs d'écran).
	let { personatge, fr = '', ambNom = true, children } = $props();
	const drecha = $derived(personatge.costat === 'drecha');
</script>

<div class="replica" class:drecha>
	<span class="qui" aria-hidden="true">{personatge.nom[0]}</span>
	<div class="bulla">
		<span class="nom" class:sr={!ambNom}>{personatge.nom}</span>
		<p class="oc" lang="oc">{@render children()}</p>
		{#if fr}<p class="fr">({fr})</p>{/if}
	</div>
</div>

<style>
	.replica {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}
	.replica + :global(.replica) {
		margin-top: 0.8rem;
	}
	.drecha {
		flex-direction: row-reverse;
	}
	.qui {
		flex: none;
		width: 1.5rem;
		margin-top: 0.3rem;
		font-family: var(--font-heading);
		font-size: 1.7rem;
		line-height: 1;
		text-align: center;
		color: var(--t-aur-gros);
	}
	.bulla {
		max-width: 82%;
		padding: 0.55rem 0.85rem 0.65rem;
		border-radius: 3px 14px 14px 14px;
		color: var(--t-tinta);
		background: var(--l-carta);
		box-shadow: 0 1px 2px var(--pc-ombre);
	}
	.drecha .bulla {
		border-radius: 14px 3px 14px 14px;
		color: var(--pc-carton-tinta, var(--t-tinta));
		background: var(--pc-carton);
	}
	.nom {
		display: block;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--l-teal);
	}
	.drecha .nom {
		color: inherit;
	}
	.nom.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.nom.sr + .oc {
		margin-top: 0;
	}
	.oc {
		margin: 0.1rem 0 0;
		font-size: 1.08rem;
		line-height: 1.45;
	}
	.fr {
		margin: 0.2rem 0 0;
		font-size: 0.9rem;
		font-style: italic;
		line-height: 1.4;
		opacity: 0.82;
	}
</style>
