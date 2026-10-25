<script>
	// Cases à cocher (critères de réussite, bilan « je peux… »). L'état est
	// gardé dans le navigateur : c'est une auto-évaluation, pas une note.
	import { browser } from '$app/environment';
	import { rich } from '$lib/lesson/rich.js';

	let { block, storagePrefix = '' } = $props();

	const storageKey = `${storagePrefix}-${block.key}`;

	function load() {
		if (!browser) return block.items.map(() => false);
		try {
			const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
			if (Array.isArray(saved) && saved.length === block.items.length) return saved;
		} catch (e) {
			/* stockage indisponible : on repart décoché */
		}
		return block.items.map(() => false);
	}

	let checked = $state(load());

	function toggle(i) {
		checked[i] = !checked[i];
		if (!browser) return;
		try {
			localStorage.setItem(storageKey, JSON.stringify($state.snapshot(checked)));
		} catch (e) {
			/* stockage indisponible : pas bloquant */
		}
	}
</script>

<section class="block">
	<h3 class="block-title">{block.title}</h3>
	{#if block.intro}<p class="intro">{@html rich(block.intro)}</p>{/if}
	<ul class="checks">
		{#each block.items as item, i}
			<li>
				<label class="check">
					<input type="checkbox" checked={checked[i]} onchange={() => toggle(i)} />
					<span class="check-label">{@html rich(item)}</span>
				</label>
			</li>
		{/each}
	</ul>
</section>

<style>
	.block {
		background: var(--l-carta);
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
	}

	.block-title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--l-marca);
	}

	.intro {
		margin: 0.4rem 0 0;
		font-size: 0.88rem;
		color: color-mix(in srgb, var(--t-tinta) 75%, transparent);
	}

	.checks {
		margin: 0.8rem 0 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.check {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		cursor: pointer;
	}

	.check input {
		margin-top: 0.25rem;
		width: 1.05rem;
		height: 1.05rem;
		accent-color: var(--color-gold);
		flex-shrink: 0;
	}

	.check-label {
		line-height: 1.5;
		font-size: 0.93rem;
		color: var(--t-tinta);
	}

	.check input:checked + .check-label {
		color: color-mix(in srgb, var(--t-tinta) 55%, transparent);
	}
</style>
