<script>
	// Tous les dessins de la poussière d'or sur une seule page (consolidation
	// du 2026-11-05) : Romain les regarde d'un coup d'œil et dit lesquels
	// garder, refaire ou retirer. Page de travail, non indexée. Les dessins
	// sont dans $lib/plueja/dessenhs.js, les mots dans $lib/plueja/scenas.js.
	import { SCENAS, GROPS } from '$lib/plueja/scenas.js';
	import { cheminsDe, TINTAS } from '$lib/plueja/dessenhs.js';

	const ambiancas = GROPS.flatMap((g) =>
		SCENAS.filter((s) => s.grop === g.id).map((s) => {
			const ambDessenh = [];
			const sensDessenh = [];
			for (const [oc, def] of s.mots) {
				const chemins = cheminsDe(oc, def);
				if (chemins) ambDessenh.push({ oc, def, chemins, tintas: TINTAS[oc] ?? [] }); // un drapeau : ses couleurs
				else sensDessenh.push(oc);
			}
			return { ...s, ambDessenh, sensDessenh };
		})
	);
	const nDessenhs = ambiancas.reduce((n, a) => n + a.ambDessenh.length, 0);
	const nMots = ambiancas.reduce((n, a) => n + a.mots.length, 0);
</script>

<svelte:head>
	<title>Los dessenhs · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="contengut" class="dessenhs">
	<header>
		<h1><span lang="oc">Los dessenhs</span> <span class="fr">Les dessins de la poussière d’or</span></h1>
		<p>
			{nDessenhs} mots dessinés sur {nMots}. Les mots sans dessin se forment quand même, en poussière, sans
			image. Les dessins se voient en mouvement sur <a href="/apren/remira">Remira</a>.
		</p>
	</header>

	{#each ambiancas as a (a.id)}
		<section>
			<h2>
				{#if a.numero}<span class="num">{a.numero}</span>{' '}{/if}<span lang="oc">{a.nom.oc}</span>
				<span class="fr">{a.nom.fr}</span>
				<span class="compte">{a.ambDessenh.length} / {a.mots.length}</span>
			</h2>
			{#if a.ambDessenh.length}
				<ul class="grilha">
					{#each a.ambDessenh as m (m.oc)}
						<li>
							<svg viewBox="0 0 100 100" aria-hidden="true">
								{#each m.tintas as z, k (k)}<path d={z.d} style={z.s ? `stroke: ${z.c}` : `fill: ${z.c}; stroke: none`} />{/each}
								{#each m.chemins as d, k (k)}<path {d} />{/each}
							</svg>
							<span class="oc" lang="oc">{m.oc}</span>
							<span class="def">{m.def}</span>
						</li>
					{/each}
				</ul>
			{/if}
			{#if a.sensDessenh.length}
				<p class="sens"><span>Sans dessin :</span> <span lang="oc">{a.sensDessenh.join(' · ')}</span></p>
			{/if}
		</section>
	{/each}
</main>

<style>
	.dessenhs {
		--crema: #f7f3ee;
		--aur-clar: #ffd47f;
		background: #0b1517;
		color: var(--crema);
		font-family: var(--font-body);
		padding: clamp(1.5rem, 4vw, 3rem) 16px 4rem;
	}
	header,
	section {
		max-width: 72rem;
		margin: 0 auto;
	}
	h1 {
		margin: 0 0 0.6rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		line-height: 1.15;
	}
	.fr {
		display: block;
		font-family: var(--font-body);
		font-size: 0.45em;
		letter-spacing: 0.04em;
		color: rgba(247, 243, 238, 0.62);
	}
	header p {
		max-width: 44rem;
		margin: 0;
		line-height: 1.6;
		color: rgba(247, 243, 238, 0.78);
	}
	header a {
		color: var(--crema);
		text-underline-offset: 0.3em;
	}
	section {
		margin-top: 2.6rem;
		padding-top: 1.4rem;
		border-top: 1px solid rgba(247, 243, 238, 0.12);
	}
	h2 {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.7rem;
		margin: 0 0 1.2rem;
		font-weight: 400;
		font-size: 1.25rem;
	}
	h2 .fr {
		display: inline;
		font-size: 0.8rem;
	}
	.num,
	.compte {
		font-variant-numeric: tabular-nums;
		color: var(--aur-clar);
	}
	.compte {
		margin-left: auto;
		font-size: 0.8rem;
		color: rgba(247, 243, 238, 0.55);
	}
	.grilha {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
		gap: 1.6rem 1.2rem;
	}
	.grilha li {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.25rem;
	}
	svg {
		width: 100%;
		max-width: 8rem;
		aspect-ratio: 1;
		margin-bottom: 0.3rem;
		fill: none;
		stroke: var(--aur-clar);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.oc {
		font-size: 1rem;
	}
	.def {
		font-size: 0.78rem;
		line-height: 1.4;
		color: rgba(247, 243, 238, 0.62);
	}
	.sens {
		margin: 1.4rem 0 0;
		font-size: 0.85rem;
		line-height: 1.6;
		color: rgba(247, 243, 238, 0.62);
	}
	.sens span:first-child {
		color: rgba(247, 243, 238, 0.55);
	}
</style>
