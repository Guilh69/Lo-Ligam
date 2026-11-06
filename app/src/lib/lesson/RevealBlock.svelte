<script>
	// Question ouverte : on répond dans sa tête (ou à voix haute), puis on
	// révèle le corrigé avec son explication. Sert au Rappel, aux traductions
	// et au mini-test — la récupération active avant la relecture.
	import { rich } from '$lib/lesson/rich.js';

	let { block, onCorrect = () => {}, onComplete = () => {} } = $props();

	let revealed = $state(block.items.map(() => false));
	let doneCount = $derived(revealed.filter(Boolean).length);
	let visibleCount = $derived(Math.min(doneCount + 1, block.items.length));

	function reveal(i) {
		if (revealed[i]) return;
		revealed[i] = true;
		onCorrect();
		if (revealed.every(Boolean)) onComplete();
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
			<p class="question"><span class="num">{i + 1}</span> {@html rich(item.q)}</p>
			{#if revealed[i]}
				<p class="answer">{@html rich(item.a)}</p>
			{:else}
				<button type="button" class="pc pc-2 reveal-btn" onclick={() => reveal(i)}>
					Voir la réponse
				</button>
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

	/* pièce de papier (lib/styles/papier.css) */
	.reveal-btn {
		min-height: 0;
		padding: 0.45rem 0.9rem;
		font-size: 0.88rem;
		font-weight: 600;
	}

	.answer {
		margin: 0;
		padding: 0.6rem 0.9rem;
		background: rgba(238, 175, 52, 0.14);
		border-radius: 12px;
		line-height: 1.55;
		color: var(--t-tinta);
		animation: fade-in 300ms ease-out;
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translateY(6px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.item, .answer { animation: none; }
	}
</style>
