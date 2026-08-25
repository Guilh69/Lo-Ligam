<script>
	// Bloc de texte typé : son du jour, Los que parlan, culture, consigne de
	// tâche… La variante choisit la couleur et l'icône, le contenu reste des
	// paragraphes (et une liste optionnelle).
	import { rich } from '$lib/lesson/rich.js';

	let { block } = $props();

	const icons = {
		info: '',
		son: '🔊',
		natiu: '🗣️',
		culture: '🎶',
		task: '✍️'
	};
	let icon = $derived(icons[block.variant] ?? '');
</script>

<section class="block {block.variant ?? 'info'}">
	<h3 class="block-title">{#if icon}<span aria-hidden="true">{icon}</span> {/if}{block.title}</h3>
	{#if block.audio}
		<button type="button" class="listen" disabled title="Àudio a venir (audio à venir)" aria-label="Àudio a venir">
			🔊 <span class="listen-label">a venir</span>
		</button>
	{/if}
	{#each block.paragraphs ?? [] as p}
		<p class="para">{@html rich(p)}</p>
	{/each}
	{#if block.list?.length}
		<ul class="list">
			{#each block.list as li}<li>{@html rich(li)}</li>{/each}
		</ul>
	{/if}
</section>

<style>
	.block {
		position: relative;
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		background: white;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.1);
	}

	.block.son {
		background: rgba(224, 164, 59, 0.13);
		box-shadow: none;
	}

	.block.natiu {
		background: rgba(58, 122, 122, 0.1);
		box-shadow: none;
	}

	.block.culture {
		background: rgba(178, 84, 58, 0.09);
		box-shadow: none;
	}

	.block.task {
		border: 2px solid rgba(224, 164, 59, 0.55);
	}

	.block-title {
		margin: 0 0 0.5rem;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--color-brick);
	}

	.listen {
		position: absolute;
		top: 1.1rem;
		right: 1.1rem;
		border: none;
		background: rgba(255, 255, 255, 0.7);
		border-radius: 999px;
		padding: 0.25rem 0.6rem;
		font-size: 0.8rem;
		color: rgba(58, 42, 32, 0.5);
		cursor: default;
	}

	.listen-label {
		font-size: 0.7rem;
		font-style: italic;
	}

	.para {
		margin: 0 0 0.6rem;
		line-height: 1.6;
		color: var(--color-text);
		font-size: 0.95rem;
	}

	.para:last-child {
		margin-bottom: 0;
	}

	.list {
		margin: 0;
		padding-left: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.list li {
		font-size: 0.93rem;
		line-height: 1.55;
		color: var(--color-text);
	}
</style>
