<script>
	// Une réplique de dialogue : l'initiale de la personne en Limelight, sa
	// bulle, la traduction dessous. Les bulles sont du papier neutre, POSÉ (ombre
	// courte) : la couleur est gardée pour ce qui se touche et pour la tête de
	// l'écran, une bulle ne doit jamais ressembler à une pièce à toucher. La
	// personne de gauche parle sur le papier des leçons (--l-carta), celle de
	// droite sur le papier des panneaux (--t-fons-2) ; le nom les distingue.
	// Le coin serré de la bulle est du côté de la personne qui parle.
	// « ambNom » : le nom s'écrit à la première réplique de chacun ; ensuite
	// l'initiale suffit à l'œil (le nom reste dit aux lecteurs d'écran).
	// « entra » : la réplique arrive pendant qu'on regarde (le dialogue se
	// débloque une bulle après l'autre, Romain, 18-11) ; elle se pose comme une
	// feuille, après « retard » secondes. Même geste que le mot qu'on pose dans
	// un trou, sans rebond.
	let { personatge, fr = '', ambNom = true, entra = false, retard = 0, children } = $props();
	const drecha = $derived(personatge.costat === 'drecha');
</script>

<div class="replica" class:drecha class:entra style:--retard={entra ? `${retard}s` : null}>
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
		background: var(--t-fons-2);
	}
	.nom {
		display: block;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--l-teal);
	}
	.drecha .nom {
		color: var(--l-marca);
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

	/* la feuille qui se pose : elle descend de quelques pixels, son ombre se resserre */
	.entra .bulla {
		animation: pausa-bulla 0.36s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: var(--retard, 0s);
	}
	.entra .qui {
		animation: vista 0.2s ease-out both;
		animation-delay: var(--retard, 0s);
	}
	@keyframes pausa-bulla {
		0% {
			opacity: 0;
			transform: translateY(-10px);
			box-shadow: 0 9px 8px var(--pc-ombre);
		}
		40% {
			opacity: 1;
		}
	}
	@keyframes vista {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.entra .bulla,
		.entra .qui {
			animation: none;
		}
	}
</style>
