<script>
	// « Corses en visio » (2026-10-24, chantier 19) : la page qui explique le
	// cours avant le calendrier (Romain : « éviter d'arriver directement sur mon
	// calendrier »). Pour qui, la méthode, le déroulé, la pratique, puis le
	// bouton vers la prise de rendez-vous. Tout se modifie sur la page ; ce qui
	// n'est pas encore écrit par Romain est caché au public (visible, estompé,
	// en édition seulement). La couleur reprend celle de la case visio de /apren.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { edicion, iniciar, txt, ligam, lista, amagat, apondre } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('visio', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let fr = $derived(langStore.current === 'fr');
	const RUBRICA = PLAN.find((r) => r.id === 'apren');

	let metòde = $derived(edicion.actiu || !amagat('visio.metòde.tèxt'));
	let etapas = $derived(lista('visio.debana'));
	let practica = $derived(lista('visio.practica'));

	const apondreEtapa = () => apondre('visio.debana', 'text', { oc: 'Etapa', fr: 'Étape' });
	const apondrePractica = () => apondre('visio.practica', 'text', { oc: 'Linha', fr: 'Ligne' });
</script>

<svelte:head>
	<title>{fr ? 'Cours en visio' : 'Corses en visio'} · Lo Ligam</title>
	<meta
		name="description"
		content="Corses d’occitan en visio amb Romain, en pichon grop o sol a sol ; lo primièr es ofèrt. Cours d’occitan en visio avec Romain, en petit groupe ou en tête-à-tête ; le premier est offert."
	/>
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
{#snippet t(clau)}{@const v = txt(clau)}<span lang={fr ? 'fr' : 'oc'}>{@render marcat(fr ? v.fr : v.oc)}</span>{/snippet}

{#snippet reservar(classe)}{@const l = ligam('visio.reservar')}<a
		class="reservar {classe}"
		href={l.href}
		target={l.defòra ? '_blank' : undefined}
		rel={l.defòra ? 'noopener' : undefined}
		aria-describedby={l.defòra ? 'visio-onglet' : undefined}
		hidden={amagat('visio.reservar')}
		use:editar={'visio.reservar'}
		><span lang={fr ? 'fr' : 'oc'}>{fr ? l.fr : l.oc}</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"
			><path d="M2 8h12M9 3l5 5-5 5" /></svg
		></a
	>{/snippet}

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="visio" class:ed-actiu={edicion.actiu}>
	<span id="visio-onglet" class="visually-hidden">{fr ? 'S’ouvre dans un nouvel onglet' : 'Se dobrís dins un onglet novèl'}</span>

	<nav class="camin" aria-label={fr ? 'Fil d’Ariane' : 'Camin dins lo site'}>
		<a href="/apren"><b>{RUBRICA.n}</b> {fr ? RUBRICA.fr : RUBRICA.oc}</a>
	</nav>

	<header class="eros">
		<div class="eros-tèxt">
			<h1 hidden={amagat('visio.titol')} use:editar={'visio.titol'}>{@render t('visio.titol')}</h1>
			<p class="chapeu" hidden={amagat('visio.chapeu')} use:editar={'visio.chapeu'}>{@render t('visio.chapeu')}</p>
			{@render reservar('sus-color')}
		</div>
		<span class="eros-picto"><Pictograma nom="visio" size="9rem" /></span>
	</header>

	<div class="cors">
		<div class="seccions">
			<section aria-labelledby="visio-qual" hidden={amagat('visio.qual.tèxt') && !edicion.actiu}>
				<h2 id="visio-qual" hidden={amagat('visio.qual.titol')} use:editar={'visio.qual.titol'}>{@render t('visio.qual.titol')}</h2>
				<p hidden={amagat('visio.qual.tèxt')} use:editar={'visio.qual.tèxt'}>{@render t('visio.qual.tèxt')}</p>
			</section>

			{#if metòde}
				<section aria-labelledby="visio-metode">
					<h2 id="visio-metode" hidden={amagat('visio.metòde.titol')} use:editar={'visio.metòde.titol'}>{@render t('visio.metòde.titol')}</h2>
					<p class="metode" hidden={amagat('visio.metòde.tèxt')} use:editar={'visio.metòde.tèxt'}>{@render t('visio.metòde.tèxt')}</p>
				</section>
			{/if}

			{#if etapas.length || edicion.actiu}
				<section aria-labelledby="visio-debana">
					<h2 id="visio-debana" hidden={amagat('visio.debana.titol')} use:editar={'visio.debana.titol'}>{@render t('visio.debana.titol')}</h2>
					<ol class="etapas">
						{#each etapas as e (e.clau)}
							<li use:editar={e.clau}>{@render t(e.clau)}</li>
						{/each}
					</ol>
					{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={apondreEtapa}>+ {fr ? 'Ajouter une étape' : 'Apondre una etapa'}</button>{/if}
				</section>
			{/if}
		</div>

		<aside class="practica" aria-labelledby="visio-practica">
			<h2 id="visio-practica" hidden={amagat('visio.practica.titol')} use:editar={'visio.practica.titol'}>{@render t('visio.practica.titol')}</h2>
			<ul>
				{#each practica as p (p.clau)}
					<li use:editar={p.clau}>{@render t(p.clau)}</li>
				{/each}
			</ul>
			{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={apondrePractica}>+ {fr ? 'Ajouter une ligne' : 'Apondre una linha'}</button>{/if}
			{@render reservar('sus-fons')}
		</aside>
	</div>
</main>
</div>

<style>
	/* Le cadre des pages intérieures, comme /mots : fond du thème, une chaleur
	   de braise en haut à gauche, rien qui bouge ; bandeau pleine largeur */
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

	.visio {
		/* la couleur de la case visio de /apren (jeu « Charte ») */
		--visio: #b53d17;
		--visio-tinta: #fbf1e1;
		container: visio / inline-size;
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.camin {
		margin-bottom: var(--esp-16);
		font-size: 0.95rem;
	}
	.camin a {
		color: var(--t-tinta-2);
		text-decoration: none;
	}
	.camin a:hover {
		color: var(--t-tinta);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.camin b {
		color: var(--t-aur);
		font-weight: 700;
	}

	/* L'ouverture : la case visio en grand, avec le bouton tout de suite */
	.eros {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: var(--esp-32);
		padding: clamp(1.5rem, 4vw, 3.5rem);
		border-radius: 6px;
		background: var(--visio);
		color: var(--visio-tinta);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.6rem, 7vw, 5.5rem);
		line-height: 1;
		text-transform: uppercase;
	}
	.chapeu {
		max-width: 40ch;
		margin: var(--esp-16) 0 var(--esp-32);
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		line-height: 1.5;
	}
	.eros-picto {
		opacity: 0.9;
	}

	/* Le bouton : crème sur la couleur, couleur d'action ailleurs (règle B) */
	.reservar {
		display: inline-flex;
		align-items: center;
		gap: 0.6em;
		min-height: 48px;
		padding: 0.8rem 1.4rem;
		border-radius: 999px;
		font-weight: 700;
		text-decoration: none;
		transition:
			transform 0.25s,
			background-color 0.25s;
	}
	.reservar svg {
		width: 1em;
		height: 1em;
		transition: transform 0.25s;
	}
	.reservar:hover svg {
		transform: translateX(4px);
	}
	.sus-color {
		background: var(--visio-tinta);
		color: var(--visio);
	}
	.sus-fons {
		margin-top: var(--esp-24);
		background: var(--t-accion);
		color: var(--t-accion-tinta);
	}
	.sus-fons:hover {
		background: var(--t-accion-viu);
	}
	.reservar:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}

	/* Le corps : les explications à gauche, la pratique à droite */
	.cors {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(16rem, 22rem);
		gap: var(--esp-64);
		margin-top: var(--esp-64);
	}
	.seccions {
		display: grid;
		gap: var(--esp-48);
		align-content: start;
	}
	h2 {
		margin: 0 0 var(--esp-12);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.5rem, 2.4vw, 2rem);
		line-height: 1.15;
	}
	section p {
		max-width: 62ch;
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.6;
	}
	.metode {
		white-space: pre-line;
	}
	section :global(.aur),
	.chapeu :global(.aur) {
		color: var(--t-aur);
	}
	.etapas {
		display: grid;
		gap: var(--esp-16);
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: etapa;
	}
	.etapas li {
		position: relative;
		max-width: 60ch;
		padding-left: 3.2rem;
		font-size: 1.1rem;
		line-height: 1.55;
		counter-increment: etapa;
	}
	.etapas li::before {
		content: counter(etapa);
		position: absolute;
		left: 0;
		top: -0.1rem;
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 50%;
		background: var(--visio);
		color: var(--visio-tinta);
		font-family: var(--font-heading);
		font-size: 1.1rem;
	}

	.practica {
		position: sticky;
		top: 6rem;
		align-self: start;
		padding: var(--esp-24);
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons-2);
	}
	.practica ul {
		display: grid;
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.practica li {
		position: relative;
		padding-left: 1.2rem;
		line-height: 1.5;
	}
	.practica li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.6em;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--t-aur);
	}

	.ed-apondre {
		margin-top: var(--esp-12);
	}

	/* Téléphone : une seule colonne, la pratique sous les explications */
	@container visio (max-width: 760px) {
		.eros {
			grid-template-columns: 1fr;
		}
		.eros-picto {
			display: none;
		}
		.cors {
			grid-template-columns: 1fr;
			gap: var(--esp-48);
			margin-top: var(--esp-48);
		}
		.practica {
			position: static;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.reservar,
		.reservar svg {
			transition: none;
		}
	}
</style>
