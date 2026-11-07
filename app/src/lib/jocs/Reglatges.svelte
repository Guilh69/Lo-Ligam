<script>
	// Le panneau de réglages commun aux jeux (Romain, 2026-11-05 : les boutons
	// « fouillis, pas très structurés ; parler de niveau, mieux organiser les
	// boutons et leurs effets »). Trois blocs distincts, chacun avec son titre :
	// le choix (niveau ou thème : une seule option à la fois, en segments
	// joints), les options (interrupteurs : son, pas à pas), les actions
	// (boutons simples, passés en enfants).
	/**
	 * causida : { titol, opcions: [{ id, label, detalh?, aria?, inactiu? }], valor, causir(id),
	 *   compacte?, legenda? } ; compacte : des segments étroits (les chiffres des
	 *   unités, 06-11) ; legenda : { nom, titol? }, dite sous les segments (le
	 *   titre de l'unité choisie, en occitan) ; inactiu : un segment montré mais
	 *   pas jouable (une unité sans thème, 06-11)
	 * causidas : d'autres choix pareils, chacun son bloc (le thème, 06-11)
	 * bascules : [{ id, label, valor, bascular() }]
	 * titolOpcions : titre du bloc des options ; children : les actions
	 */
	let { causida = null, causidas = [], bascules = [], titolOpcions = '', children } = $props();
	const id = `reg-${Math.random().toString(36).slice(2, 8)}`;
	const totas = $derived(causida ? [causida, ...causidas] : causidas);
</script>

<div class="reglatges">
	{#each totas as c, k (k)}
		<div class="grop">
			<span class="grop-titol" id="{id}-c{k}">{c.titol}</span>
			<div class="segments" class:compacte={c.compacte} role="group" aria-labelledby="{id}-c{k}">
				{#each c.opcions as o (o.id)}
					<button type="button" class="pc pc-2" disabled={o.inactiu} aria-pressed={c.valor === o.id} aria-label={o.aria} onclick={() => c.causir(o.id)}>
						<span>{o.label}</span>{#if o.detalh}<span class="detalh" lang="oc">{o.detalh}</span>{/if}
					</button>
				{/each}
			</div>
			{#if c.legenda}
				<p class="legenda" aria-hidden="true">
					{c.legenda.nom}{#if c.legenda.titol}{' · '}<span lang="oc">{c.legenda.titol}</span>{/if}
				</p>
			{/if}
		</div>
	{/each}
	{#if bascules.length}
		<div class="grop">
			<span class="grop-titol" id="{id}-o">{titolOpcions}</span>
			<div class="bascules" role="group" aria-labelledby="{id}-o">
				{#each bascules as b (b.id)}
					<button type="button" class="bascula" role="switch" aria-checked={b.valor} onclick={b.bascular}>
						<span class="pc-basc" aria-hidden="true"></span>
						<span>{b.label}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
	{#if children}
		<div class="accions">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.reglatges {
		display: grid;
		gap: var(--esp-16);
	}
	.grop {
		display: grid;
		gap: 0.35rem;
	}
	.grop-titol {
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	button:not(.pc) {
		font: inherit;
		color: var(--t-tinta);
		cursor: pointer;
	}

	button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	/* le choix : des segments joints, un seul pressé (en or) */
	/* le choix : des pièces de papier (lib/styles/papier.css), une seule pressée (en or) */
	.segments {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		width: fit-content;
		max-width: 100%;
	}
	.segments button {
		--r: 10px;
		display: grid;
		gap: 0.05rem;
		justify-items: start;
		min-height: 2.75rem;
		padding: 0.4rem 0.9rem;
		text-align: start;
	}
	.segments button[aria-pressed='true'] {
		--pc-fons: var(--pc-or-fons);
		--pc-tinta: #2a1a10;
	}
	.segments button:disabled {
		cursor: default;
	}

	/* un segment montré mais pas jouable : estompé, sans survol */
	.detalh {
		font-size: 0.82rem;
		font-style: italic;
		opacity: 0.8;
	}
	/* des segments étroits : un chiffre, centré, assez large pour le doigt */
	.segments.compacte button {
		min-width: 2.2rem;
		padding-inline: 0.5rem;
		justify-items: center;
		text-align: center;
	}
	.legenda {
		margin: 0.1rem 0 0;
		font-size: 0.88rem;
		color: var(--t-tinta-2);
	}
	.legenda span[lang] {
		font-style: italic;
		color: var(--t-tinta);
	}
	/* les options : des interrupteurs */
	.bascules {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.2rem;
	}
	.bascula {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.75rem;
		padding: 0.2rem 0;
		border: none;
		background: none;
	}
	/* l'interrupteur lui-même : .pc-basc (lib/styles/papier.css) */
	/* les actions : des boutons simples */
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.accions :global(button) {
		--r: 10px;
		min-height: 2.75rem;
		padding: 0.45rem 0.9rem;
		font: inherit;
		font-weight: 600;
	}
	.accions :global(button[aria-pressed='true']) {
		--pc-fons: var(--pc-or-fons);
		--pc-tinta: #2a1a10;
	}
	.accions :global(button:disabled) {
		cursor: default;
	}
</style>
