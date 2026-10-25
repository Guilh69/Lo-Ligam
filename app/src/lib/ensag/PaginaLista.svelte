<script>
	// Maquette des pages de liste (Médias, Littérature : 2026-10-25) : le cadre
	// des pages intérieures, un chemin de retour, puis des groupes de liens
	// vers les sites (ouverts dans un nouvel onglet, aucune requête avant le clic).
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import { PALETAS, PALETA_PER_DEFAUT } from '$lib/apren/teulas.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	/** titol, frasa : {oc, fr} ; picto : nom du pictogramme ; camin : [{href, oc, fr}] ; grops : $lib/ensag/maqueta.js */
	let { titol, frasa, picto, camin, grops } = $props();
	let fr = $derived(langStore.current === 'fr');
	const tr = (o) => (fr ? o.fr : o.oc);
	const domeni = (u) => new URL(u).hostname.replace(/^www\./, '');
	const color = (i) => PALETAS[PALETA_PER_DEFAUT][i % PALETAS[PALETA_PER_DEFAUT].length];
</script>

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="lista-pagina">
	<nav class="camin" aria-label={fr ? 'Fil d’Ariane' : 'Camin'}>
		{#each camin as c (c.href)}
			<a href={c.href}>{tr(c)}</a><span aria-hidden="true">›</span>
		{/each}
		<span aria-current="page">{tr(titol)}</span>
	</nav>
	<header class="cap">
		<span class="cap-picto"><Pictograma nom={picto} size="4.2rem" /></span>
		<div>
			<h1 lang={fr ? 'fr' : 'oc'}>{tr(titol)}</h1>
			<p class="frasa" lang={fr ? 'fr' : 'oc'}>{tr(frasa)}</p>
		</div>
	</header>

	{#each grops as g, i (g.id)}
		{@const [fons, tinta] = color(i)}
		<section class="grop" style:--fons={fons} style:--tinta={tinta} aria-labelledby="grop-{g.id}">
			<h2 id="grop-{g.id}"><span lang={fr ? 'fr' : 'oc'}>{tr(g)}</span> <small>{g.lista.length}</small></h2>
			<ul>
				{#each g.lista as [nom, u] (u)}
					<li>
						<a href={u} target="_blank" rel="noopener noreferrer">
							<span class="nom" lang="oc">{nom}</span>
							<span class="domeni">{domeni(u)}</span>
							<span class="accion">{tr(g.accion)} <Icona nom="extern" size="0.95em" /></span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</main>
</div>

<style>
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.lista-pagina {
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(1.5rem, 4vh, 3rem) var(--marge) var(--esp-96);
	}
	.camin {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.camin a {
		color: inherit;
		text-decoration-color: var(--t-terra);
		text-underline-offset: 3px;
	}
	.camin a:hover {
		color: var(--t-tinta);
	}
	.cap {
		display: flex;
		align-items: center;
		gap: clamp(1rem, 3vw, 2rem);
		margin: var(--esp-24) 0 var(--esp-48);
	}
	.cap-picto {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		color: var(--t-aur);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.6rem, 8vw, 5.5rem);
		line-height: 0.95;
	}
	.frasa {
		max-width: 40ch;
		margin: var(--esp-12) 0 0;
		font-size: clamp(1.05rem, 1.5vw, 1.3rem);
		line-height: 1.5;
		color: var(--t-tinta-2);
	}

	.grop + .grop {
		margin-top: var(--esp-48);
	}
	h2 {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin: 0 0 var(--esp-16);
		padding-bottom: 0.5rem;
		border-bottom: 3px solid var(--fons);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.6rem, 3vw, 2.2rem);
	}
	h2 small {
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--t-tinta-2);
	}
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li a {
		box-sizing: border-box;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--t-linha);
		border-left: 6px solid var(--fons);
		border-radius: 6px;
		background: var(--t-fons-2);
		color: inherit;
		text-decoration: none;
		transition: transform 0.15s ease, border-color 0.15s ease;
	}
	li a:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--fons) 60%, var(--t-linha));
	}
	li a:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
	}
	.nom {
		font-family: var(--font-heading);
		font-size: 1.3rem;
		line-height: 1.15;
	}
	.domeni {
		color: var(--t-tinta-2);
		font-size: 0.9rem;
		overflow-wrap: anywhere;
	}
	.accion {
		margin-top: auto;
		padding-top: 0.6rem;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-weight: 700;
		color: var(--t-aur);
	}
	@media (prefers-reduced-motion: reduce) {
		li a {
			transition: none;
		}
	}
	:global(html[data-leugier='on']) li a {
		transition: none;
	}
</style>
