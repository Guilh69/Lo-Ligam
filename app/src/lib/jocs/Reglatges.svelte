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
					<button type="button" disabled={o.inactiu} aria-pressed={c.valor === o.id} aria-label={o.aria} onclick={() => c.causir(o.id)}>
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
						<span class="pila" aria-hidden="true"><span class="punt"></span></span>
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
	button {
		font: inherit;
		color: var(--t-tinta);
		cursor: pointer;
	}
	button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	/* le choix : des segments joints, un seul pressé (en or) */
	.segments {
		display: flex;
		flex-wrap: wrap;
		border: 1px solid var(--t-linha);
		border-radius: 0.7rem;
		overflow: hidden;
		width: fit-content;
		max-width: 100%;
	}
	.segments button {
		display: grid;
		gap: 0.05rem;
		min-height: 2.75rem;
		padding: 0.4rem 0.9rem;
		border: none;
		border-inline-start: 1px solid var(--t-linha);
		background: none;
		text-align: start;
	}
	.segments button:first-child {
		border-inline-start: none;
	}
	.segments button:hover {
		background: color-mix(in srgb, var(--t-tinta) 6%, transparent);
	}
	.segments button[aria-pressed='true'] {
		background: var(--color-gold);
		color: var(--color-text);
	}
	/* un segment montré mais pas jouable : estompé, sans survol */
	.segments button:disabled {
		color: color-mix(in srgb, var(--t-tinta) 38%, transparent);
		cursor: default;
	}
	.segments button:disabled:hover {
		background: none;
	}
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
	.pila {
		position: relative;
		width: 2rem;
		height: 1.1rem;
		border-radius: 1rem;
		border: 1.5px solid color-mix(in srgb, var(--t-tinta) 45%, transparent);
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}
	.punt {
		position: absolute;
		top: 50%;
		left: 0.15rem;
		width: 0.7rem;
		height: 0.7rem;
		translate: 0 -50%;
		border-radius: 50%;
		background: color-mix(in srgb, var(--t-tinta) 55%, transparent);
		transition:
			left 0.2s,
			background-color 0.2s;
	}
	.bascula[aria-checked='true'] .pila {
		border-color: var(--color-gold);
		background: var(--color-gold);
	}
	.bascula[aria-checked='true'] .punt {
		left: calc(100% - 0.85rem);
		background: var(--color-text);
	}
	/* les actions : des boutons simples */
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.accions :global(button) {
		min-height: 2.75rem;
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 0.6rem;
		background: none;
		font: inherit;
		color: var(--t-tinta);
		cursor: pointer;
	}
	.accions :global(button:hover) {
		border-color: var(--t-tinta-2);
	}
	.accions :global(button:disabled) {
		opacity: 0.45;
		cursor: default;
	}
	.accions :global(button:focus-visible) {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		.pila,
		.punt {
			transition: none;
		}
	}
</style>
