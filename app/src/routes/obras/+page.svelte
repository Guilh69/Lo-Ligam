<script>
	import Icona from '$lib/components/Icona.svelte';
	// Espace « Òbras » : ce que Romain fait découvrir.
	//
	// On n'héberge aucun extrait. On donne les informations, son commentaire, et
	// on laisse écouter par le lecteur officiel, chargé SEULEMENT au clic : avant
	// ça, aucune requête ne part chez un tiers, donc aucun traceur.
	//
	// Les musiques (2026-10-25, option « fiche + écouter ici ») : une fiche par
	// artiste, que Romain ajoute sur la page (édition sur place) : le nom, ses
	// lignes, les liens qu'il colle (la plateforme se reconnaît). « Escotar
	// aicí » ouvre d'abord une phrase qui dit ce que la plateforme recevra ;
	// le lecteur ne se charge qu'après l'accord, qui vaut pour la visite.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { plataforma, lectorPer } from '$lib/obras';
	import { afichas } from '$lib/data/afichas.js';
	import { edicion, iniciar, txt, ligam, lista, amagat, apondre } from '$lib/edicion/edicion.svelte.js';
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
			acòrd: (p) => `Escotar sus ${p} ? Son lector recebrà ton adreça IP e poirà pausar de cookies.`,
			òc: 'Escotar',
			non: 'Non, mercé',
			ligams: 'Ont escotar',
			cort: 'Ligam cort : lo lector se pòt pas cargar. Copiar l’adreça complèta (deezer.com/…).',
			void: 'Encara res aicí. Lèu.',
			afichas: 'Afichas',
			afichasLead: 'D’afichas que fan parlar la lenga sus las parets.',
			agrandir: 'Veire en grand',
			tampar: 'Tampar'
		},
		fr: {
			title: 'Œuvres',
			lead: 'Ce que j’écoute, ce que je lis, ce que je te fais découvrir en occitan.',
			escotar: 'Écouter ici',
			acòrd: (p) => `Écouter sur ${p} ? Son lecteur recevra ton adresse IP et pourra déposer des cookies.`,
			òc: 'Écouter',
			non: 'Non merci',
			ligams: 'Où écouter',
			cort: 'Lien court : le lecteur ne peut pas se charger. Copier l’adresse complète (deezer.com/…).',
			void: 'Rien encore ici. Bientôt.',
			afichas: 'Affiches',
			afichasLead: 'Des affiches qui font parler la langue sur les murs.',
			agrandir: 'Voir en grand',
			tampar: 'Fermer'
		}
	};
	let tx = $derived(t[lang]);

	// Les liens d'une fiche, rangés par plateforme (Bandcamp d'abord) ; hors
	// édition, un lien pas encore collé (« / ») ne s'affiche pas
	function ligamsDe(clau) {
		return lista(clau)
			.filter((e) => e.tipe === 'ligam')
			.map((e) => ({ clau: e.clau, l: ligam(e.clau), p: plataforma(ligam(e.clau).href) }))
			.filter((x) => edicion.actiu || x.p)
			.sort((a, b) => (a.p?.rang ?? 9) - (b.p?.rang ?? 9));
	}
	// le premier lien qui ouvre un lecteur dans la fiche (Deezer ou YouTube)
	const lectorDe = (ligams) => ligams.map((x) => lectorPer(x.l.href)).find((l) => l?.src) ?? null;
	const ligamsCorts = (ligams) => ligams.some((x) => lectorPer(x.l.href)?.cort);

	let demanda = $state(null); // la fiche dont la phrase d'accord est ouverte
	let dubèrt = $state(null); // la fiche dont le lecteur est chargé
	let acòrds = $state({}); // plateformes acceptées pendant la visite
	function escotar(clau, lector) {
		if (acòrds[lector.plataforma]) dubèrt = clau;
		else demanda = clau;
	}
	function acceptar(clau, lector) {
		acòrds[lector.plataforma] = true;
		demanda = null;
		dubèrt = clau;
	}

	const apondreArtista = () =>
		apondre('obras.artistas', 'bloc', {}, [
			['nom', 'text', { oc: 'Nom', fr: 'Nom' }],
			['tèxt', 'text', { oc: 'A escriure', fr: 'À écrire' }]
		]);
	const apondreLigam = (clau) => apondre(clau, 'ligam', { oc: '', fr: '', ligam: '/' });
	// le nom affiché d'un lien : celui que Romain a écrit, sinon la plateforme
	const nomLigam = (x) => (fr ? x.l.fr : x.l.oc) || x.p?.nom || (fr ? 'Coller l’adresse' : 'Pegar l’adreça');

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
		<p class="lead" hidden={amagat('obras.musica.frasa')} use:editar={'obras.musica.frasa'}>{@render tt('obras.musica.frasa')}</p>

		{#if !lista('obras.artistas').length && !edicion.actiu}
			<p class="msg">{tx.void}</p>
		{/if}
		<ul class="artistas">
			{#each lista('obras.artistas') as a (a.clau)}
				{@const ligams = ligamsDe(a.clau)}
				{@const lector = lectorDe(ligams)}
				{@const nom = txt(a.clau + '.nom')}
				<li class="artista-plaça">
					<div class="artista" use:editar={a.clau}>
						<h3 hidden={amagat(a.clau + '.nom')} use:editar={a.clau + '.nom'}>{fr ? nom.fr : nom.oc}</h3>
						<p class="tèxt" hidden={amagat(a.clau + '.tèxt')} use:editar={a.clau + '.tèxt'}>{@render tt(a.clau + '.tèxt')}</p>

						{#if lector}
							{#if dubèrt === a.clau}
								<iframe
									class="lector"
									class:video={lector.video}
									style:height={lector.video ? null : lector.nautor + 'px'}
									src={lector.src}
									title="{lector.plataforma} : {fr ? nom.fr : nom.oc}"
									allow="autoplay; encrypted-media; clipboard-write; picture-in-picture"
									referrerpolicy="strict-origin-when-cross-origin"
								></iframe>
							{:else if demanda === a.clau}
								<div class="acòrd" role="group" aria-label={tx.escotar}>
									<p>{tx.acòrd(lector.plataforma)}</p>
									<div class="acòrd-botons">
										<button type="button" class="acòrd-òc" onclick={() => acceptar(a.clau, lector)}>{tx.òc}</button>
										<button type="button" class="acòrd-non" onclick={() => (demanda = null)}>{tx.non}</button>
									</div>
								</div>
							{:else}
								<button type="button" class="escotar" onclick={() => escotar(a.clau, lector)}>
									<Icona nom="lire" size="1.1em" />
									{tx.escotar} <span class="escotar-p">· {lector.plataforma}</span>
								</button>
							{/if}
						{/if}
						{#if edicion.actiu && ligamsCorts(ligams)}
							<p class="ed-avis">{tx.cort}</p>
						{/if}

						<ul class="ligams" aria-label="{tx.ligams} : {fr ? nom.fr : nom.oc}">
							{#each ligams as x (x.clau)}
								<li>
									<a href={x.l.href} target="_blank" rel="noopener noreferrer" hidden={amagat(x.clau)} use:editar={x.clau}
										>{nomLigam(x)} <Icona nom="extern" size="0.85em" /></a
									>
								</li>
							{/each}
						</ul>
					</div>
					<!-- (hors de la fiche : un toucher dans la fiche, en édition, la choisit) -->
					{#if edicion.actiu}
						<button type="button" class="ed-apondre" onclick={() => apondreLigam(a.clau)}>+ {fr ? 'Ajouter un lien' : 'Apondre un ligam'}</button>
					{/if}
				</li>
			{/each}
		</ul>
		{#if edicion.actiu}
			<button type="button" class="ed-apondre" onclick={apondreArtista}>+ {fr ? 'Ajouter une fiche d’artiste' : 'Apondre una ficha'}</button>
		{/if}
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

	/* ---------- Musiques : une fiche par artiste ---------- */
	.musicas {
		container: musicas / inline-size;
		width: 100%;
		max-width: 60rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	.seccion-titol {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.4rem, 4vw, 1.9rem);
		color: var(--color-text);
	}
	.musicas > .lead {
		max-width: 34rem;
		text-align: center;
	}
	.artistas {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		width: 100%;
		display: grid;
		/* (centrées quand il y en a peu) */
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 28rem));
		justify-content: center;
		gap: 1.25rem;
	}
	.artista-plaça {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
	}
	.artista {
		align-self: stretch;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		background: white;
		border-radius: 20px;
		padding: 1.4rem;
		border-top: 4px solid var(--color-terracotta);
		box-shadow: 0 12px 30px rgba(58, 42, 32, 0.09);
	}
	h3 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.45rem;
		line-height: 1.15;
		color: var(--color-text);
	}
	.tèxt {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--color-text);
	}
	.tèxt :global(.aur) {
		color: var(--color-terracotta);
		font-weight: 700;
	}

	/* l'écoute : le bouton, la phrase d'accord, puis le lecteur officiel */
	.escotar {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border: none;
		border-radius: 999px;
		padding: 0.6rem 1.1rem;
		background: var(--color-terracotta);
		color: white;
		font: inherit;
		font-weight: 700;
		font-size: 0.92rem;
		cursor: pointer;
		transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.escotar:hover {
		transform: scale(1.04);
	}
	.escotar-p {
		font-weight: 400;
		opacity: 0.85;
	}
	.acòrd {
		border-radius: 14px;
		padding: 0.9rem 1rem;
		background: #f6efe3;
		color: var(--color-text);
	}
	.acòrd p {
		margin: 0 0 0.7rem;
		font-size: 0.9rem;
		line-height: 1.5;
	}
	.acòrd-botons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.acòrd-òc,
	.acòrd-non {
		border-radius: 999px;
		padding: 0.5rem 1rem;
		font: inherit;
		font-weight: 700;
		font-size: 0.88rem;
		cursor: pointer;
	}
	.acòrd-òc {
		border: 2px solid var(--color-terracotta);
		background: var(--color-terracotta);
		color: white;
	}
	.acòrd-non {
		border: 2px solid currentColor;
		background: transparent;
		color: var(--color-text);
	}
	.lector {
		width: 100%;
		border: none;
		border-radius: 12px;
		display: block;
	}
	.lector.video {
		aspect-ratio: 16 / 9;
	}

	/* les liens, Bandcamp d'abord */
	.ligams {
		list-style: none;
		margin: auto 0 0;
		padding: 0.4rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}
	.ligams a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		border: 1.5px solid rgba(58, 42, 32, 0.25);
		color: var(--color-text);
		font-size: 0.88rem;
		font-weight: 600;
		text-decoration: none;
	}
	.ligams a:hover {
		border-color: var(--color-terracotta);
		color: var(--color-terracotta);
	}
	.ed-avis {
		margin: 0;
		font-size: 0.8rem;
		color: var(--color-brick);
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

	@media (prefers-reduced-motion: reduce) {
		.escotar {
			transition: none;
		}
	}
</style>
