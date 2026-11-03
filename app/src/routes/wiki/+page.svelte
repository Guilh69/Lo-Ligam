<script>
	// L'accueil du wiki (« wiki » plutôt qu'« encyclopédie », Romain,
	// 2026-10-15) : les langues et les lieux, bientôt ; en attendant, la porte
	// de la grammaire, rangée dans S'apren (2026-11-03). Cases de couleur comme
	// les pages de rubrique. Textes fixes pour l'instant : pas encore
	// modifiables sur la page (édition sur place).
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import { PALETAS, PALETA_PER_DEFAUT } from '$lib/apren/teulas.js';
	import { FICHAS } from '$lib/gramatica/index.js';

	// la grammaire en prune, comme ses fiches ; les langues et les lieux en pétrole
	const [f0, t0] = PALETAS[PALETA_PER_DEFAUT][5];
	const [f1, t1] = PALETAS[PALETA_PER_DEFAUT][1];
	const n = FICHAS.length;
</script>

<svelte:head>
	<title>Lo wiki · Lo Ligam</title>
	<meta name="description" content="Le wiki de Lo Ligam : bientôt les langues et les lieux ; la grammaire de l’occitan, dans S’apren." />
</svelte:head>

<PaginaSimpla titol="Lo wiki" frasa="Ce qu’il faut savoir sur la langue et le pays, à lire à ton rythme.">
	<ul class="teulas" aria-label="Les parties du wiki">
		<li class="teula granda" style:--fons={f0} style:--tinta={t0}>
			<a class="teula-ligam" href="/apren/gramatica"><span class="nom" lang="oc">Gramatica</span></a>
			<p class="sota">
				La grammaire de l’occitan, notion par notion, dans l’ordre du parcours. Elle est rangée dans
				<span lang="oc">S’apren</span> : {n === 1 ? 'une fiche' : `${n} fiches`} pour commencer.
			</p>
			<span class="picto-place"><Pictograma nom="wiki" size="7rem" /></span>
		</li>
		<li class="teula" style:--fons={f1} style:--tinta={t1}>
			<span class="nom">Les langues et les lieux</span>
			<p class="sota">Bientôt, autour de <a class="ligam-carta" href="/carta" lang="oc">la carta</a>.</p>
			<span class="picto-place"><Pictograma nom="carta" size="3.6rem" /></span>
		</li>
	</ul>
</PaginaSimpla>

<style>
	/* les cases des pages de rubrique (PaginaTeulas), en plus court */
	.teulas {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.teula {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: clamp(16rem, 28vw, 24rem);
		padding: var(--esp-16);
		border-radius: 6px;
		background: var(--fons);
		color: var(--tinta);
		overflow: clip;
	}
	.teula.granda {
		grid-column: span 2;
		padding: var(--esp-32);
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
	}
	@container pagina (max-width: 40rem) {
		.teula,
		.teula.granda {
			grid-column: 1 / -1;
			min-height: 9rem;
		}
		.teula.granda {
			min-height: 14rem;
		}
	}
	.teula-ligam {
		color: inherit;
		text-decoration: none;
	}
	/* toute la case se clique (le lien s'étend sur elle) */
	.teula-ligam::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	.nom {
		display: block;
		font-family: var(--font-heading);
		font-size: clamp(1.25rem, 1.9vw, 1.6rem);
		line-height: 1.1;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.granda .nom {
		font-size: clamp(2rem, 4vw, 3.4rem);
	}
	.sota {
		max-width: 34ch;
		margin: var(--esp-8) 0 0;
		font-size: 0.95rem;
		line-height: 1.45;
	}
	.granda .sota {
		font-size: clamp(1.05rem, 1.4vw, 1.25rem);
	}
	.ligam-carta {
		position: relative;
		z-index: 2;
		color: inherit;
		text-decoration-thickness: 2px;
		text-underline-offset: 0.2em;
	}
	.picto-place {
		display: flex;
		justify-content: flex-end;
		margin-top: auto;
		transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.granda:hover,
	.granda:focus-within {
		transform: translateY(-4px);
		box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
	}
	.granda:hover .picto-place,
	.granda:focus-within .picto-place {
		transform: scale(1.08) rotate(-4deg);
	}
	.teula-ligam:focus-visible,
	.ligam-carta:focus-visible {
		outline: none;
	}
	.teula:has(.teula-ligam:focus-visible),
	.ligam-carta:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		.teula.granda,
		.picto-place {
			transition: none;
		}
	}
</style>
