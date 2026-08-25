<script>
	// Le tableau de synthèse (« L'essentiel ») : lignes/colonnes, défilement
	// horizontal sur petit écran plutôt que débordement.
	import { rich } from '$lib/lesson/rich.js';

	let { block } = $props();
</script>

<section class="block">
	<h3 class="block-title">{block.title}</h3>
	{#if block.intro}<p class="intro">{@html rich(block.intro)}</p>{/if}
	<div class="scroll">
		<table>
			<thead>
				<tr>
					{#each block.head as h}<th>{@html rich(h)}</th>{/each}
				</tr>
			</thead>
			<tbody>
				{#each block.rows as row}
					<tr>
						{#each row as cell, ci}
							{#if ci === 0}
								<th scope="row">{@html rich(cell)}</th>
							{:else}
								<td>{@html rich(cell)}</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	{#if block.notes?.length}
		<ul class="notes">
			{#each block.notes as n}<li>{@html rich(n)}</li>{/each}
		</ul>
	{/if}
</section>

<style>
	.block {
		background: white;
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.1);
	}

	.block-title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--color-brick);
	}

	.intro {
		margin: 0.4rem 0 0;
		font-size: 0.88rem;
		color: rgba(58, 42, 32, 0.75);
	}

	.scroll {
		margin-top: 0.9rem;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.92rem;
	}

	th,
	td {
		padding: 0.5rem 0.65rem;
		text-align: left;
		border-bottom: 1px solid rgba(58, 42, 32, 0.1);
		line-height: 1.45;
		vertical-align: top;
	}

	thead th {
		font-family: var(--font-heading);
		font-size: 0.82rem;
		color: var(--color-teal);
		border-bottom: 2px solid rgba(58, 42, 32, 0.15);
	}

	tbody th {
		font-weight: 600;
		color: var(--color-text);
	}

	td {
		color: var(--color-text);
	}

	.notes {
		margin: 0.9rem 0 0;
		padding-left: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.notes li {
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-text);
	}
</style>
