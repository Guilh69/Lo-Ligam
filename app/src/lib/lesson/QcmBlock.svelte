<script>
	// Exercice à choix : un item à la fois, retour immédiat, explication d'une
	// ligne après la bonne réponse (gabarit du cursus §5). L'item suivant
	// n'apparaît qu'une fois l'item courant réussi.
	import { rich } from '$lib/lesson/rich.js';

	// item.ditz = { qui, oc } : quelqu'un te parle (jeu « Escota e causís ») ;
	// la question devient une bulle, et l'on choisit sa réponse.
	// onResult(item, reussi) : une fois l'item trouvé, réussi s'il l'a été du
	// premier coup (le carnet de révision note les choses qu'il teste).
	let { block, onCorrect = () => {}, onComplete = () => {}, onResult = () => {} } = $props();

	// L'ordre des options est mélangé à l'affichage (sinon la bonne réponse
	// serait devinable par sa position), sauf Vrai/Faux (noShuffle).
	function shuffled(item) {
		const order = item.options.map((_, i) => i);
		if (item.noShuffle) return order;
		for (let i = order.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[order[i], order[j]] = [order[j], order[i]];
		}
		return order;
	}

	let states = $state(
		block.items.map((item) => ({ done: false, wrong: [], shake: false, order: shuffled(item) }))
	);
	let doneCount = $derived(states.filter((s) => s.done).length);
	let visibleCount = $derived(Math.min(doneCount + 1, block.items.length));

	function pick(i, oi) {
		const st = states[i];
		if (st.done) return;
		if (oi === block.items[i].correct) {
			st.done = true;
			onCorrect();
			onResult(block.items[i], st.wrong.length === 0);
			if (states.every((s) => s.done)) onComplete();
		} else {
			if (!st.wrong.includes(oi)) st.wrong.push(oi);
			st.shake = true;
			setTimeout(() => (st.shake = false), 300);
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
		<div class="item" class:shake={states[i].shake}>
			{#if item.ditz}
				<p class="ditz"><span class="num">{i + 1}</span> <span class="qui">{item.ditz.qui}</span> <span class="paraula" lang="oc">{item.ditz.oc}</span></p>
			{/if}
			<p class="question">{#if !item.ditz}<span class="num">{i + 1}</span> {/if}{@html rich(item.q)}</p>
			<div class="options">
				{#each states[i].order as oi}
					<button
						type="button"
						class="opt"
						class:correct={states[i].done && oi === item.correct}
						class:wrong={states[i].wrong.includes(oi)}
						disabled={states[i].done || states[i].wrong.includes(oi)}
						onclick={() => pick(i, oi)}
					>
						{@html rich(item.options[oi])}
					</button>
				{/each}
			</div>
			{#if states[i].done && item.explain}
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

	.ditz {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		margin: 0 0 0.45rem;
	}

	.qui {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--l-teal);
	}

	.paraula {
		padding: 0.45rem 0.85rem;
		border-radius: 16px 16px 16px 4px;
		background: color-mix(in srgb, var(--l-teal) 10%, var(--l-carta));
		font-size: 1.05rem;
		color: var(--t-tinta);
	}

	.num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.4rem;
		height: 1.4rem;
		margin-right: 0.35rem;
		border-radius: 50%;
		background: rgba(238, 175, 52, 0.25);
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.75rem;
		color: var(--t-tinta);
	}

	.options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.opt {
		border: 1.5px solid color-mix(in srgb, var(--t-tinta) 18%, transparent);
		background: var(--l-carta);
		border-radius: 12px;
		padding: 0.5rem 0.9rem;
		font-size: 0.95rem;
		color: var(--t-tinta);
		cursor: pointer;
		transition:
			transform 150ms ease,
			background 150ms ease,
			border-color 150ms ease;
	}

	.opt:hover:not(:disabled) {
		transform: translateY(-1px);
		border-color: var(--l-teal);
	}

	.opt.correct {
		background: rgba(238, 175, 52, 0.22);
		border-color: var(--color-gold);
		font-weight: 600;
	}

	.opt.wrong {
		background: color-mix(in srgb, var(--t-tinta) 5%, transparent);
		border-color: transparent;
		color: color-mix(in srgb, var(--t-tinta) 40%, transparent);
		text-decoration: line-through;
	}

	.opt:disabled {
		cursor: default;
	}

	.explain {
		margin: 0.55rem 0 0;
		font-size: 0.88rem;
		color: var(--l-bon);
		line-height: 1.5;
	}

	.shake {
		animation: shake 260ms ease;
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
		.item, .shake { animation: none; }
		.opt { transition: none; }
	}
</style>
