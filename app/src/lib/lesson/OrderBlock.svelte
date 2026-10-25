<script>
	// « Remets dans l'ordre » : des tuiles de mots à taper dans le bon ordre,
	// même mécanique que les lettres de l'essai libre. Mauvaise tuile → elle
	// tremble ; bonne tuile → elle rejoint la phrase.
	import { rich } from '$lib/lesson/rich.js';

	// onResult(item, reussi) : une fois la phrase remise, réussi sans aucune
	// tuile tremblante (le carnet de révision note les choses qu'elle teste).
	let { block, onCorrect = () => {}, onComplete = () => {}, onResult = () => {} } = $props();

	function shuffle(arr) {
		const a = [...arr];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	let states = $state(
		block.items.map((item) => ({
			bank: shuffle(item.tiles.map((t, id) => ({ text: t, id, used: false, wrong: false }))),
			placed: 0,
			missed: false
		}))
	);
	let doneCount = $derived(states.filter((s, i) => s.placed >= block.items[i].tiles.length).length);
	let visibleCount = $derived(Math.min(doneCount + 1, block.items.length));

	function tap(i, tile) {
		const st = states[i];
		const item = block.items[i];
		if (tile.used || st.placed >= item.tiles.length) return;
		if (tile.text === item.tiles[st.placed]) {
			tile.used = true;
			st.placed += 1;
			onCorrect();
			if (st.placed >= item.tiles.length) onResult(item, !st.missed);
			if (states.every((s, k) => s.placed >= block.items[k].tiles.length)) onComplete();
		} else {
			tile.wrong = true;
			st.missed = true;
			setTimeout(() => (tile.wrong = false), 280);
		}
	}
</script>

<section class="block">
	<header class="block-head">
		<h3 class="block-title">{block.title}</h3>
		<span class="counter" aria-label="Progression de l'exercice">{doneCount}/{block.items.length}</span>
	</header>
	{#if block.intro}<p class="intro">{@html rich(block.intro)}</p>{/if}

	{#each block.items.slice(0, visibleCount) as item, i}
		<div class="item">
			{#if item.prompt}<p class="question">{@html rich(item.prompt)}</p>{/if}
			<p class="built" class:complete={states[i].placed >= item.tiles.length}>
				{item.tiles.slice(0, states[i].placed).join(' ')}
				{#if states[i].placed < item.tiles.length}<span class="cursor" aria-hidden="true">…</span>{/if}
			</p>
			<div class="tiles">
				{#each states[i].bank as tile (tile.id)}
					<button
						type="button"
						class="tile"
						class:used={tile.used}
						class:wrong={tile.wrong}
						disabled={tile.used}
						onclick={() => tap(i, tile)}
					>
						{tile.text}
					</button>
				{/each}
			</div>
			{#if states[i].placed >= item.tiles.length && item.explain}
				<p class="explain">✓ {@html rich(item.explain)}</p>
			{/if}
		</div>
	{/each}
</section>

<style>
	.block {
		background: var(--l-carta);
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
	}

	.block-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.block-title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--l-marca);
	}

	.counter {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--l-teal);
		white-space: nowrap;
	}

	.intro {
		margin: 0.4rem 0 0;
		font-size: 0.88rem;
		color: color-mix(in srgb, var(--t-tinta) 75%, transparent);
		line-height: 1.5;
	}

	.item {
		margin-top: 1.1rem;
		animation: fade-in 350ms ease-out;
	}

	.question {
		margin: 0 0 0.5rem;
		line-height: 1.55;
		color: var(--t-tinta);
	}

	.built {
		min-height: 2.4rem;
		margin: 0 0 0.6rem;
		padding: 0.5rem 0.9rem;
		background: color-mix(in srgb, var(--t-tinta) 5%, transparent);
		border-radius: 12px;
		font-family: var(--font-heading);
		font-size: 1.05rem;
		color: var(--t-tinta);
	}

	.built.complete {
		background: rgba(238, 175, 52, 0.2);
	}

	.cursor {
		opacity: 0.4;
	}

	.tiles {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tile {
		border: 1.5px solid color-mix(in srgb, var(--t-tinta) 18%, transparent);
		background: var(--l-carta);
		border-radius: 12px;
		padding: 0.45rem 0.8rem;
		font-size: 0.98rem;
		color: var(--t-tinta);
		cursor: pointer;
		transition: transform 150ms ease, opacity 150ms ease;
	}

	.tile:hover:not(:disabled) {
		transform: translateY(-1px);
		border-color: var(--l-teal);
	}

	.tile.used {
		opacity: 0.25;
		cursor: default;
	}

	.tile.wrong {
		animation: shake 260ms ease;
		border-color: var(--l-marca);
	}

	.explain {
		margin: 0.55rem 0 0;
		font-size: 0.88rem;
		color: var(--l-bon);
		line-height: 1.5;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		30% { transform: translateX(-4px); }
		60% { transform: translateX(4px); }
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translateY(6px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.item { animation: none; }
		.tile { transition: none; }
		.tile.wrong { animation: none; }
	}
</style>
