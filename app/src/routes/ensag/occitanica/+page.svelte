<script>
	// Essai caché (Romain, 06-11) : valoriser dans Cultura les documents libres
	// d'Occitanica, ceux qu'il a retenus sur la page de recensement. Pas de copie
	// des fichiers : une vignette légère, le titre, l'auteur, la date, la mention
	// de source exigée par le CIRDÒC, et un lien vers la fiche d'origine.
	// Page de travail, non indexée. Données : $lib/cultura/occitanica.js.
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';
	import { FAMILHAS, IU, SOURCE, urlFiche, urlVignette } from '$lib/cultura/occitanica.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

	let lang = $derived(langStore.current);
</script>

<svelte:head>
	<title>Lo Ligam · essai Occitanica</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PaginaSimpla titol={tria(IU.titol)} frasa={tria(IU.frasa)} parent={{ href: '/cultura', nom: 'Cultura' }}>
	{#each FAMILHAS as f (f.id)}
		<section class="familha" aria-labelledby="f-{f.id}">
			<h2 id="f-{f.id}" lang={lang === 'oc' ? 'oc' : undefined}>{tria(f.nom)}</h2>
			<ul class="grelha">
				{#each f.docs as d (d.id)}
					<li>
						<a class="fiche" href={urlFiche(d.id)} target="_blank" rel="noopener">
							<span class="imatge">
								<img src={urlVignette(d.id)} alt="" loading="lazy" decoding="async" />
							</span>
							<span class="tèxte">
								<span class="titre">{d.titre}</span>
								<span class="meta">{[d.genre, d.data].filter(Boolean).join(' · ')}</span>
								<span class="font">{d.auteur} - Source {SOURCE}</span>
								<span class="veire">{tria(IU.veire)}<span class="soi"> ({tria(IU.novel)})</span></span>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
	<p class="nota">{tria(IU.nota)}</p>
</PaginaSimpla>

<style>
	.familha {
		margin-top: clamp(1.8rem, 5vw, 3rem);
	}
	h2 {
		margin: 0 0 1rem;
		font-size: clamp(1.25rem, 2.6vw, 1.6rem);
		font-weight: 600;
		color: var(--t-tinta);
		padding-bottom: 0.45rem;
		border-bottom: 1px solid var(--t-linha);
	}
	.grelha {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
		gap: 1rem;
	}
	.fiche {
		display: flex;
		flex-direction: column;
		height: 100%;
		color: var(--t-tinta);
		text-decoration: none;
		background: var(--t-fons-2);
		border: 1px solid var(--t-linha);
		border-radius: 16px;
		overflow: hidden;
		transition: border-color 0.2s ease;
	}
	.fiche:hover,
	.fiche:focus-visible {
		border-color: var(--t-aur);
	}
	.fiche:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.imatge {
		display: block;
		position: relative;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		background: color-mix(in srgb, var(--t-fons) 70%, black);
	}
	.imatge img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
	}
	.tèxte {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 0.8rem 0.9rem 0.9rem;
		flex: 1;
	}
	.titre {
		font-weight: 600;
		line-height: 1.3;
		overflow-wrap: anywhere;
	}
	.meta {
		color: var(--t-tinta-2);
		font-size: 0.9rem;
	}
	.font {
		color: var(--t-tinta-2);
		font-size: 0.8rem;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}
	.soi {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.veire {
		margin-top: auto;
		padding-top: 0.5rem;
		color: var(--t-tinta);
		font-size: 0.88rem;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.nota {
		margin: 2.4rem 0 0;
		color: var(--t-tinta-2);
		font-size: 0.88rem;
	}
</style>
