<script>
	// Le sommaire de la grammaire, dans S'apren (Romain, 2026-11-03 : « c'est
	// plutôt dans apprendre la langue ») : les notions dans l'ordre où l'élève
	// les rencontre dans le parcours, pas dans celui d'un livre ; sous chaque
	// notion, ses fiches en cases de couleur ; une notion encore vide reste en
	// gris. Une fiche ajoutée dans $lib/gramatica/fichas/ apparaît ici
	// d'elle-même (mode d'emploi : LEGIR-ME.md).
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';
	import { PARTS, fichasDe } from '$lib/gramatica/index.js';
	import { marcar } from '$lib/gramatica/marcar.js';
	import { PALETAS } from '$lib/apren/teulas.js';

	// les fiches prennent la prune de la charte, celle des cartes du 1er groupe
	const [fons, tinta] = PALETAS.charta[5];

	const FRASA = marcar(
		'La grammaire de l’occitan, notion par notion, dans l’ordre où tu la rencontres dans le parcours. Chaque fiche cite ses sources. Les fiches arrivent une à une.'
	);
</script>

<svelte:head>
	<title>Gramatica · S’apren · Lo Ligam</title>
	<meta name="description" content="La grammaire de l’occitan, notion par notion, dans l’ordre du parcours de Lo Ligam." />
</svelte:head>

<PaginaSimpla titol="Gramatica" frasa={FRASA} parent={{ href: '/apren', nom: 'S’apren' }}>
	<div class="parts">
		{#each PARTS as p, i}
			<section class="part" aria-labelledby="part-{i}">
				<h2 id="part-{i}">{p.titol}</h2>
				<ol class="capitols">
					{#each p.capitols as c (c.id)}
						{@const fichas = fichasDe(c.id)}
						<li class="capitol" class:a-fichas={fichas.length}>
							<p class="capitol-nom">
								<span>{c.fr}{#if c.detalh}<span class="detalh">&nbsp;: {@html marcar(c.detalh)}</span>{/if}</span>
								{#if c.unitat}<span class="unitat">unité {c.unitat}</span>{/if}
							</p>
							{#if fichas.length}
								<ul class="fichas">
									{#each fichas as f (f.id)}
										<li>
											<a class="ficha" href="/apren/gramatica/{f.id}" style:--fons={fons} style:--tinta={tinta}>
												<span class="ficha-titol" lang="oc">{f.titol}</span>
												<span class="ficha-resumit">{f.resumit}</span>
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ol>
			</section>
		{/each}
	</div>
</PaginaSimpla>

<style>
	.parts {
		display: grid;
		gap: var(--esp-48) var(--esp-32);
	}
	@container pagina (min-width: 56rem) {
		.capitols {
			columns: 2;
			column-gap: var(--esp-32);
		}
	}
	h2 {
		margin: 0 0 var(--esp-12);
		font-family: var(--font-body);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--t-aur);
	}
	.capitols {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.capitol {
		break-inside: avoid;
		padding: 0.55rem 0;
		border-top: 1px solid var(--t-linha);
	}
	.capitol-nom {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		margin: 0;
	}
	.capitol:not(.a-fichas) .capitol-nom {
		color: var(--t-tinta-2);
	}
	.detalh {
		color: var(--t-tinta-2);
		font-size: 0.92rem;
	}
	.unitat {
		flex: none;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.fichas {
		margin: 0.5rem 0 0.2rem;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.5rem;
	}
	/* une fiche : une case de couleur qui se clique, comme celles de S'apren */
	.ficha {
		display: grid;
		gap: 0.15rem;
		padding: 0.8rem 1rem;
		border-radius: 6px;
		background: var(--fons);
		color: var(--tinta);
		text-decoration: none;
		transition:
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.3s;
	}
	.ficha:hover,
	.ficha:focus-visible {
		transform: translateY(-3px);
		box-shadow: 0 12px 26px -12px rgba(0, 0, 0, 0.45);
	}
	.ficha:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.ficha-titol {
		font-weight: 700;
		font-size: 1.3rem;
		line-height: 1.1;
	}
	.ficha-resumit {
		font-size: 0.95rem;
		line-height: 1.4;
	}
	@media (prefers-reduced-motion: reduce) {
		.ficha {
			transition: none;
		}
	}
</style>
