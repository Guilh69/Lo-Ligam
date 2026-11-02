<script>
	// Le tableau de synthèse (« L'essentiel ») : lignes/colonnes, défilement
	// horizontal sur petit écran plutôt que débordement. Quatre colonnes ou
	// plus, avec des formes longues (Alhors en Occitània, phrases) : le
	// téléphone montre une fiche par ligne. Un petit tableau de formes courtes
	// (je, tu, il × trois verbes) reste un tableau : on y lit le motif en
	// colonne. `block.fiches` (vrai ou faux) tranche à la main si besoin.
	import { rich } from '$lib/lesson/rich.js';

	let { block } = $props();
	const etiqueta = (ci) => (block.head[ci] ?? '').replace(/\*/g, '');
	const longueur = (s) => String(s ?? '').replace(/\*/g, '').length;
	const fiches = $derived(
		block.fiches ??
			(block.head.length >= 4 &&
				Math.max(...block.head.slice(1).map(longueur), ...block.rows.flatMap((r) => r.slice(1).map(longueur))) > 12)
	);
</script>

<section class="block">
	<h3 class="block-title">{block.title}</h3>
	{#if block.intro}<p class="intro">{@html rich(block.intro)}</p>{/if}
	<div class="scroll">
		<table class:fiches>
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
								<td data-label={etiqueta(ci)}>{#if cell}<span>{@html rich(cell)}</span>{/if}</td>
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
		container-type: inline-size;
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
		border-bottom: 1px solid color-mix(in srgb, var(--t-tinta) 10%, transparent);
		line-height: 1.45;
		vertical-align: top;
	}

	thead th {
		font-family: var(--font-heading);
		font-size: 0.82rem;
		color: var(--l-teal);
		border-bottom: 2px solid color-mix(in srgb, var(--t-tinta) 15%, transparent);
	}

	tbody th {
		font-weight: 600;
		color: var(--t-tinta);
	}

	td {
		color: var(--t-tinta);
	}

	/* Téléphone : une fiche par ligne, l'en-tête de colonne devant chaque
	   forme ; une case vide (pas de forme sûre) disparaît. Seuil à 28rem : le
	   tableau à quatre colonnes déborde encore entre 24 et 26rem (formes
	   coupées à droite). */
	@container (max-width: 28rem) {
		table.fiches thead {
			display: none;
		}

		table.fiches,
		table.fiches tbody,
		table.fiches tr,
		table.fiches th {
			display: block;
		}

		table.fiches tr {
			padding: 0.55rem 0;
			border-bottom: 1px solid color-mix(in srgb, var(--t-tinta) 10%, transparent);
		}

		table.fiches th,
		table.fiches td {
			padding: 0.1rem 0;
			border: none;
		}

		table.fiches td {
			display: grid;
			grid-template-columns: 7.5rem 1fr;
			gap: 0.5rem;
			align-items: baseline;
		}

		table.fiches td::before {
			content: attr(data-label);
			font-family: var(--font-heading);
			font-size: 0.8rem;
			color: var(--l-teal);
		}

		table.fiches td:empty {
			display: none;
		}
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
		color: var(--t-tinta);
	}
</style>
