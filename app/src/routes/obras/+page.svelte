<script>
	import Icona from '$lib/components/Icona.svelte';
	// Espace « Òbras » : ce que Romain fait découvrir.
	//
	// On n'héberge aucun extrait. On donne les informations, son commentaire, et
	// on laisse écouter par le lecteur officiel, chargé SEULEMENT au clic : avant
	// ça, aucune requête ne part chez un tiers, donc aucun traceur.
	//
	// Les musiques ont leur propre espace, le café (/ensag/musica, 2026-10-25) :
	// ici, une porte vers lui, plus de fiches en double.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { afichas } from '$lib/data/afichas.js';
	import { edicion, iniciar, txt, amagat } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('obras', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let lang = $derived(langStore.current);
	let fr = $derived(lang === 'fr');

	const t = {
		oc: {
			title: 'Òbras',
			lead: 'Çò qu’escoti, çò que legissi, çò que te fau descobrir en occitan.',
			escotar: 'Escotar aicí',
			jornal: 'Lo Jornal de la musica',
			jornalSota: 'Las novetats e los còps de còr de Lo Ligam',
			intrar: 'Dintrar',
			afichas: 'Afichas',
			afichasLead: 'D’afichas que fan parlar la lenga sus las parets.',
			agrandir: 'Veire en grand',
			tampar: 'Tampar'
		},
		fr: {
			title: 'Œuvres',
			lead: 'Ce que j’écoute, ce que je lis, ce que je te fais découvrir en occitan.',
			escotar: 'Écouter ici',
			jornal: 'Le Journal de la musique',
			jornalSota: 'Les nouveautés et les coups de cœur de Lo Ligam',
			intrar: 'Entrer',
			afichas: 'Affiches',
			afichasLead: 'Des affiches qui font parler la langue sur les murs.',
			agrandir: 'Voir en grand',
			tampar: 'Fermer'
		}
	};
	let tx = $derived(t[lang]);


	// Galerie : la grande image se charge seulement à l'ouverture (<dialog> natif :
	// Échap ferme, le focus revient au bouton, la page derrière est inerte).
	let vista = $state(null);
	let dialeg;
	function dobrir(a) {
		vista = a;
		dialeg.showModal();
	}
	function tampar() {
		dialeg.close();
	}
</script>

<svelte:head>
	<title>{tx.title} · Lo Ligam</title>
	<meta
		name="description"
		content="Musicas, libres e filmes en occitan, causits e comentats per Lo Ligam."
	/>
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
{#snippet tt(clau)}{@const v = txt(clau)}<span lang={fr ? 'fr' : 'oc'}>{@render marcat(fr ? v.fr : v.oc)}</span>{/snippet}


<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen" class:ed-actiu={edicion.actiu}>
	<AppHeader />

	<header class="intro">
		<h1>{tx.title}</h1>
		<p class="lead">{tx.lead}</p>
	</header>

	<section class="musicas" id="musicas" aria-labelledby="musicas-titol">
		<h2 id="musicas-titol" class="seccion-titol" hidden={amagat('obras.musica.titol')} use:editar={'obras.musica.titol'}>{@render tt('obras.musica.titol')}</h2>
		<p class="musicas-lead" hidden={amagat('obras.musica.frasa')} use:editar={'obras.musica.frasa'}>{@render tt('obras.musica.frasa')}</p>

		<a class="cafe" href="/ensag/musica">
			<span class="cafe-disc" aria-hidden="true"><span class="cafe-etiqueta"></span></span>
			<span class="cafe-tèxt">
				<span class="cafe-titol">{tx.jornal}</span>
				<span class="cafe-sota">{tx.jornalSota}</span>
				<span class="cafe-intrar">{tx.intrar} <Icona nom="suivant" size="1em" /></span>
			</span>
		</a>
	</section>

	<section class="afichas" aria-labelledby="afichas-titol">
		<h2 id="afichas-titol" class="afichas-titol">{tx.afichas}</h2>
		<p class="lead">{tx.afichasLead}</p>
		<ul class="galaria">
			{#each afichas as a (a.id)}
				<li class={a.forma}>
					<button type="button" class="afica" onclick={() => dobrir(a)}>
						<img src="/obras/afichas/{a.id}-p.webp" alt="" loading="lazy" />
						<span class="afica-legenda">
							<span class="afica-titol" lang="oc">{a.titol}</span>
							{#if a.epoca}<span class="afica-epoca">{a.epoca}</span>{/if}
						</span>
						<span class="sr-only">{tx.agrandir} : {a.titol}</span>
					</button>
				</li>
			{/each}
		</ul>
	</section>
</main>

<dialog class="vista" bind:this={dialeg} onclose={() => (vista = null)} onclick={(e) => e.target === dialeg && tampar()} aria-labelledby="vista-titol">
	{#if vista}
		<figure>
			<img src="/obras/afichas/{vista.id}.webp" alt={vista.titol} />
			<figcaption>
				<strong id="vista-titol" lang="oc">{vista.titol}</strong>
				<span>{lang === 'oc' ? vista.oc : vista.fr}</span>
				{#if vista.epoca}<span class="vista-epoca">{vista.epoca}</span>{/if}
				{#if vista.font}<span class="vista-font">{lang === 'oc' ? 'Font' : 'Source'} : {#if vista.ligam}<a href={vista.ligam} target="_blank" rel="noopener noreferrer">{vista.font} <Icona nom="extern" size="0.9em" /></a>{:else}{vista.font}{/if}</span>{/if}
			</figcaption>
		</figure>
		<button type="button" class="vista-tampar" onclick={tampar}>{tx.tampar} <Icona nom="fermer" size="1.1em" /></button>
	{/if}
</dialog>

<style>
	/* ---------- Galerie des affiches ---------- */
	.afichas {
		margin-top: 4rem;
	}
	.afichas-titol {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2rem, 4vw, 2.8rem);
		color: var(--color-terracotta);
		margin: 0 0 0.4rem;
	}
	.galaria {
		list-style: none;
		padding: 0;
		margin: 1.6rem 0 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		grid-auto-flow: dense;
		gap: 1rem;
	}
	.galaria .paisatge {
		grid-column: span 2;
	}
	.afica {
		all: unset;
		box-sizing: border-box;
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 3 / 4;
		border-radius: 14px;
		overflow: hidden;
		cursor: zoom-in;
		background: var(--color-text);
		box-shadow: 0 6px 20px rgba(58, 42, 32, 0.12);
		transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.6s;
	}
	.paisatge .afica {
		aspect-ratio: 3 / 2;
	}
	.afica img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.9s cubic-bezier(0.19, 1, 0.22, 1);
	}
	.afica:hover,
	.afica:focus-visible {
		transform: translateY(-4px);
		box-shadow: 0 0 0 3px var(--color-terracotta), 0 0 0 6px var(--color-gold), 0 14px 30px rgba(58, 42, 32, 0.2);
	}
	.afica:hover img {
		transform: scale(1.04);
	}
	.afica-legenda {
		position: absolute;
		inset: auto 0 0 0;
		padding: 2.4rem 0.9rem 0.8rem;
		background: linear-gradient(transparent, rgba(30, 14, 8, 0.82));
		color: #fff;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		text-align: left;
	}
	.afica-titol {
		font-family: var(--font-heading);
		font-size: 1.02rem;
		line-height: 1.15;
	}
	.afica-epoca {
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-gold-light);
	}
	.vista {
		border: 0;
		padding: 0;
		background: transparent;
		max-width: min(92vw, 1100px);
		max-height: 92vh;
		overflow: visible;
	}
	.vista::backdrop {
		background: rgba(20, 10, 6, 0.86);
		backdrop-filter: blur(4px);
	}
	.vista figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.9rem;
	}
	.vista img {
		max-width: 100%;
		max-height: 78vh;
		border-radius: 10px;
		box-shadow: 0 0 0 3px var(--color-terracotta), 0 0 0 6px var(--color-gold), 0 30px 60px rgba(0, 0, 0, 0.5);
	}
	.vista figcaption {
		color: #fff;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.vista figcaption strong {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.4rem;
	}
	.vista figcaption span {
		color: var(--color-gold-light);
		font-size: 0.95rem;
	}
	.vista figcaption .vista-epoca {
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
	}
	.vista figcaption .vista-font {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.75);
	}
	.vista figcaption .vista-font a {
		color: inherit;
	}
	.vista-tampar {
		position: fixed;
		top: 1.2rem;
		right: 1.2rem;
		border: 1px solid rgba(255, 255, 255, 0.4);
		background: rgba(20, 10, 6, 0.6);
		color: #fff;
		border-radius: 999px;
		padding: 0.55rem 1rem;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.vista-tampar:focus-visible {
		outline: 2px solid var(--color-gold);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		.afica,
		.afica img {
			transition: none;
		}
	}

	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 380px;
		height: 380px;
		background: var(--color-gold);
		opacity: 0.3;
		top: -120px;
		left: -100px;
	}

	.blob-teal {
		width: 340px;
		height: 340px;
		background: var(--color-teal);
		opacity: 0.18;
		bottom: -100px;
		right: -100px;
	}

	.screen {
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1.5rem;
	}

	.intro {
		text-align: center;
		max-width: 34rem;
		margin-top: 1rem;
	}

	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 6vw, 2.6rem);
		color: var(--color-terracotta);
	}

	.lead {
		margin: 0.5rem 0 0;
		color: var(--color-text);
		opacity: 0.85;
		line-height: 1.5;
	}

	.msg {
		background: white;
		border-radius: 18px;
		padding: 1.5rem 2rem;
		color: var(--color-teal);
	}

	/* ---------- Musiques : la porte du café ----------
	   Une bande sombre, les couleurs du café, même quand la page est claire */
	.musicas {
		--m-fons: #22100a;
		--m-tinta: #fbf1e1;
		--m-tinta-2: rgba(251, 241, 225, 0.78);
		--m-aur: #f6b73c;
		--m-accion: #b53d17;
		container: musicas / inline-size;
		box-sizing: border-box;
		width: calc(100% + 3rem);
		margin: 1rem -1.5rem 0;
		padding: clamp(2.2rem, 6vw, 4.5rem) clamp(1.25rem, 5vw, 4rem);
		/* (le disque sorti de la dernière pochette ne doit pas élargir la page) */
		overflow-x: clip;
		background: var(--m-fons);
		color: var(--m-tinta);
		text-align: center;
	}
	.seccion-titol {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.2rem, 6vw, 3.6rem);
		line-height: 1;
	}
	.musicas-lead {
		max-width: 36rem;
		margin: 0.8rem auto 0;
		color: var(--m-tinta-2);
		line-height: 1.5;
	}

	/* la porte : un disque qui tourne au survol, le titre du journal, « Dintrar » */
	.cafe {
		max-width: 40rem;
		margin: clamp(1.6rem, 4vw, 2.6rem) auto 0;
		display: flex;
		align-items: center;
		gap: clamp(1.2rem, 4vw, 2.4rem);
		padding: clamp(1rem, 3vw, 1.6rem);
		border-radius: 22px;
		background: rgba(251, 241, 225, 0.06);
		outline: 1px solid rgba(251, 241, 225, 0.14);
		color: inherit;
		text-align: left;
		text-decoration: none;
		transition: background 0.2s ease;
	}
	.cafe:hover {
		background: rgba(251, 241, 225, 0.1);
	}
	.cafe:focus-visible {
		outline: 2px solid var(--m-aur);
		outline-offset: 4px;
	}
	.cafe-disc {
		flex: 0 0 auto;
		width: clamp(5.5rem, 22cqi, 9rem);
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background:
			repeating-radial-gradient(circle, #181010 0 2px, #261a18 2px 4px),
			#181010;
		box-shadow: 0 14px 30px -14px rgba(0, 0, 0, 0.9);
	}
	.cafe-etiqueta {
		width: 36%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(circle, var(--m-fons) 0 9%, var(--m-accion) 10% 100%);
	}
	.cafe:hover .cafe-disc {
		animation: virar 2.4s linear infinite;
	}
	@keyframes virar {
		to {
			transform: rotate(1turn);
		}
	}
	.cafe-tèxt {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
	}
	.cafe-titol {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 4vw, 2.1rem);
		line-height: 1.05;
	}
	.cafe-sota {
		color: var(--m-tinta-2);
		font-style: italic;
		line-height: 1.4;
	}
	.cafe-intrar {
		margin-top: 0.6rem;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.5rem 1.1rem;
		border-radius: 999px;
		background: var(--m-accion);
		color: #fff;
		font-weight: 700;
	}
	@media (prefers-reduced-motion: reduce) {
		.cafe:hover .cafe-disc {
			animation: none;
		}
	}
	:global(html[data-leugier='on']) .cafe:hover .cafe-disc {
		animation: none;
	}


	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
