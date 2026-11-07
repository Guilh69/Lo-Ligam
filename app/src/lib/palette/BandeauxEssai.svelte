<script>
	// Quatre logiques de barre (Romain, 2026-11-07 : « aucun [de ces cinq tons] ne va, c'est
	// peut-être le format qui me dérange… un bandeau minimal, comme dans Remira, ou une logique
	// avec plus de différence »). La barre porte sept choses de poids égal (marque, réservation,
	// compte, thème, langue, globe, menu) : on essaie de les ranger par fonction.
	//   0 · aujourd'hui : sept pièces pleines.
	//   1 · calme (Remira) : seule la réservation est une pièce ; le reste est du texte et des icônes.
	//   2 · deux niveaux : une fine bande de réglages (langue, thème, compte) au-dessus d'une barre
	//       réduite à la marque, la réservation et le menu.
	//   3 · téléphone d'abord : en haut la marque et la langue ; en bas cinq onglets (comme Busuu) ;
	//       sur ordinateur, les trois verbes dans la barre.
	// Idées prises à la bibliothèque d'inspiration de Romain (labo/inspirations.js, 07-11) :
	// la pilule teintée « une couleur, deux intensités » (odd-squid-52) pour les réglages ;
	// l'interrupteur lune et soleil (fresh-fireant-15), rendu atteignable au clavier ;
	// le bouton qui s'étire pour s'expliquer (thin-duck-22) n'est PAS repris : au toucher il ne
	// montre jamais son mot. Rien n'est modifié sur le site.
	import Crotz from '$lib/components/Crotz.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { variablesCss, copierPiste } from './pistes.js';

	let mode = $state('clair');
	let appareil = $state('tel');
	let lang = $state('oc');

	const vars = $derived(variablesCss(copierPiste('melange')[mode], mode));
	const sombre = $derived(mode === 'sombre');
	const basculerTheme = () => (mode = sombre ? 'clair' : 'sombre');

	const CADRES = [
		['0', 'Aujourd’hui', 'Sept pièces pleines de même poids.'],
		['1', 'Calme, comme Remira', 'Une seule pièce, la réservation ; le reste en texte et en icônes.'],
		['2', 'Deux niveaux', 'Une fine bande de réglages au-dessus d’une barre réduite à l’essentiel.'],
		['3', 'Téléphone d’abord', 'Marque et langue en haut ; cinq onglets en bas. Sur ordinateur, les trois verbes dans la barre.']
	];
	const ONGLETS = [
		['acuelh', 'Acuèlh', true],
		['parla', 'Se parla', false],
		['apren', 'S’apren', false],
		['amassa', 'Amassa', false],
		['menu', 'Menú', false]
	];
</script>

<svelte:head>
	<title>Essai : quatre logiques de barre</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet marque(nom = true)}
	<span class="marque"><Crotz teula talha={30} />{#if nom}<span class="nom">Lo Ligam</span>{/if}</span>
{/snippet}

{#snippet soleil()}
	<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></svg>
{/snippet}
{#snippet lune()}
	<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>
{/snippet}

<!-- l'interrupteur Òc | Fr : une piste, la langue choisie posée dessus -->
{#snippet bascule(teinte = false)}
	<div class="sw" class:teinte role="group" aria-label="Lenga / Langue">
		<button type="button" aria-pressed={lang === 'oc'} lang="oc" onclick={() => (lang = 'oc')}>Òc</button>
		<button type="button" aria-pressed={lang === 'fr'} lang="fr" onclick={() => (lang = 'fr')}>Fr</button>
	</div>
{/snippet}

<!-- le thème : un interrupteur lune et soleil, un vrai bouton (clavier, lecteur d'écran) -->
{#snippet themeSw()}
	<button type="button" class="sw-theme" role="switch" aria-checked={sombre} aria-label="Thème sombre" onclick={basculerTheme}>
		<span class="piste-t"><span class="astre">{#if sombre}{@render lune()}{:else}{@render soleil()}{/if}</span></span>
	</button>
{/snippet}

<div class="page">
	<nav class="choix" aria-label="Appareil et thème">
		<div class="groupe" role="group" aria-label="Appareil">
			<button type="button" aria-pressed={appareil === 'tel'} onclick={() => (appareil = 'tel')}>Téléphone</button>
			<button type="button" aria-pressed={appareil === 'ordi'} onclick={() => (appareil = 'ordi')}>Ordinateur</button>
		</div>
		<div class="groupe" role="group" aria-label="Thème">
			<button type="button" aria-pressed={!sombre} onclick={() => (mode = 'clair')}>Clair</button>
			<button type="button" aria-pressed={sombre} onclick={() => (mode = 'sombre')}>Sombre</button>
		</div>
	</nav>
	<p class="explic">
		<strong>Même page, quatre barres.</strong> On range les sept éléments par fonction : agir (réserver), naviguer (menu), régler (langue, thème, compte). Les couleurs sont celles validées (rouge, ocre) ; aucune couleur de « fonctions techniques » à choisir ici. Clique sur les interrupteurs : ils marchent.
	</p>

	<div class="zone">
		<div class="cadres {appareil}" style={vars}>
			{#each CADRES as [n, titre, mot] (n)}
				<section class="bloc" aria-labelledby="t{n}">
					<h2 id="t{n}"><span class="num">{n}</span> {titre}</h2>
					<p class="mot">{mot}</p>
					<div class="cadre {appareil}">
						<div class="ecran">
							<!-- ====== 0 : aujourd'hui ====== -->
							{#if n === '0'}
								<header class="barre b0">
									{@render marque(appareil === 'ordi')}
									<div class="b0-droite">
										<a class="pc reservar" href="#r">Reservar un cors</a>
										<a class="pc pc-2" href="#c" aria-label="Se connectar"><Icona nom="persona" size="1.15em" /><span class="mot-b">Se connectar</span></a>
										<button type="button" class="pc pc-2 pc-icone" aria-label="Thème">{@render soleil()}</button>
										<div class="sw" role="group" aria-label="Lenga / Langue">
											<button type="button" aria-pressed={lang === 'oc'} onclick={() => (lang = 'oc')}>Òc</button>
											<button type="button" aria-pressed={lang === 'fr'} onclick={() => (lang = 'fr')}>Fr</button>
										</div>
										<button type="button" class="pc pc-2 pc-icone" aria-label="Langues"><Icona nom="mond" /></button>
										<button type="button" class="pc pc-2"><Icona nom="menu" size="1.15em" /><span class="mot-b">Menú</span></button>
									</div>
								</header>

								<!-- ====== 1 : calme ====== -->
							{:else if n === '1'}
								<header class="barre b1">
									{@render marque(appareil === 'ordi')}
									<div class="b1-droite">
										<a class="pc reservar" href="#r">Reservar un cors</a>
										<div class="lang-texte" role="group" aria-label="Lenga / Langue">
											<button type="button" aria-pressed={lang === 'oc'} lang="oc" onclick={() => (lang = 'oc')}>Òc</button>
											<button type="button" aria-pressed={lang === 'fr'} lang="fr" onclick={() => (lang = 'fr')}>Fr</button>
										</div>
										<button type="button" class="ico" aria-label="Autres langues"><Icona nom="mond" size="1.2rem" /></button>
										<button type="button" class="ico" aria-label="Thème" onclick={basculerTheme}>{#if sombre}{@render lune()}{:else}{@render soleil()}{/if}</button>
										<a class="ico" href="#c" aria-label="Se connectar"><Icona nom="persona" size="1.2rem" /></a>
										<button type="button" class="texte"><Icona nom="menu" size="1.2rem" /><span class="mot-b">Menú</span></button>
									</div>
								</header>

								<!-- ====== 2 : deux niveaux ====== -->
							{:else if n === '2'}
								<div class="service" role="group" aria-label="Réglages">
									<span class="hint">lenga · langue</span>
									{@render bascule(true)}
									<button type="button" class="ico teinte-p" aria-label="Autres langues"><Icona nom="mond" size="1.1rem" /></button>
									{@render themeSw()}
									<a class="pilule-t" href="#c"><Icona nom="persona" size="1.05rem" /><span class="mot-b">Mon compte</span></a>
								</div>
								<header class="barre b2">
									{@render marque(appareil === 'ordi')}
									<div class="b2-droite">
										<a class="pc reservar" href="#r">Reservar un cors</a>
										<button type="button" class="fantome"><Icona nom="menu" size="1.2rem" /><span>Menú</span></button>
									</div>
								</header>

								<!-- ====== 3 : téléphone d'abord ====== -->
							{:else}
								<header class="barre b3">
									{@render marque(true)}
									{#if appareil === 'ordi'}
										<nav class="verbes" aria-label="Plan du site">
											<a href="#parla">Se parla</a><a href="#apren">S’apren</a><a href="#amassa">Amassa</a>
										</nav>
									{/if}
									<div class="b3-droite">
										{@render bascule(true)}
										{#if appareil === 'ordi'}
											{@render themeSw()}
											<a class="ico" href="#c" aria-label="Se connectar"><Icona nom="persona" size="1.2rem" /></a>
											<a class="pc reservar" href="#r">Reservar un cors</a>
										{:else}
											<a class="ico" href="#c" aria-label="Se connectar"><Icona nom="persona" size="1.3rem" /></a>
										{/if}
									</div>
								</header>
							{/if}

							<!-- le même début de page sous chaque barre -->
							<div class="heros">
								<p class="kicker"><span class="filet"></span>L’OCCITAN</p>
								<h3><span>Se parla.</span><span class="decale">S’apren.</span><span class="valeur">Amassa.</span></h3>
								<p class="lead">Benvenguda dins ton ligam amb lo mond occitan.</p>
								<div class="ctas">
									<a class="pc pc-grand" href="#carta">Dobrir la carta <Icona nom="suivant" /></a>
									{#if n === '3' && appareil === 'tel'}
										<a class="pc reservar-hero" href="#r">Reservar un cors</a>
									{/if}
								</div>
							</div>

							{#if n === '3' && appareil === 'tel'}
								<nav class="onglets" aria-label="Navigation principale">
									{#each ONGLETS as [id, nom, actuel] (id)}
										<a href="#{id}" aria-current={actuel ? 'page' : undefined}>
											<span class="ic">
												{#if id === 'acuelh'}
													<svg viewBox="0 0 24 24" width="1.4rem" height="1.4rem" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11 12 4l8 7v9H4z" /><path d="M10 20v-6h4v6" /></svg>
												{:else if id === 'parla'}
													<Icona nom="comentar" size="1.4rem" />
												{:else if id === 'apren'}
													<svg viewBox="0 0 24 24" width="1.4rem" height="1.4rem" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5c3-1.3 5.5-1 8 1 2.5-2 5-2.300 8-1V19c-3-1.300-5.500-1-8 1-2.500-2-5-2.300-8-1z" /><path d="M12 6.500V20" /></svg>
												{:else if id === 'amassa'}
													<Icona nom="persona" size="1.4rem" />
												{:else}
													<Icona nom="menu" size="1.4rem" />
												{/if}
											</span>
											<span class="et">{nom}</span>
										</a>
									{/each}
								</nav>
							{/if}
						</div>
					</div>
				</section>
			{/each}
		</div>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #ffffff;
		color: #1d1b1a;
		font-family: system-ui, sans-serif;
	}
	/* ---- commandes de la page (hors palette) ---- */
	.choix {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 1.4rem;
		align-items: center;
		padding: 0.6rem clamp(1rem, 3vw, 2rem);
		background: #ffffff;
		border-bottom: 1px solid #d6d2ce;
		font-size: 0.88rem;
	}
	.groupe {
		display: inline-flex;
		border: 1px solid #1d1b1a;
		border-radius: 8px;
		overflow: hidden;
	}
	.groupe button {
		min-height: 38px;
		padding: 0 0.9rem;
		border: 0;
		background: #ffffff;
		color: #1d1b1a;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
	.groupe button + button {
		border-left: 1px solid #1d1b1a;
	}
	.groupe button[aria-pressed='true'] {
		background: #1d1b1a;
		color: #ffffff;
	}
	.groupe button:focus-visible {
		outline: 3px solid #0b63c8;
		outline-offset: -3px;
	}
	.explic {
		max-width: 88ch;
		margin: 0;
		padding: 0.6rem clamp(1rem, 3vw, 2rem);
		color: #55504c;
		font-size: 0.86rem;
		line-height: 1.45;
		border-bottom: 1px solid #e3e0dd;
	}
	.explic strong {
		color: #1d1b1a;
	}
	.zone {
		background: #e6e6e8;
		padding: clamp(0.8rem, 2vw, 1.6rem);
	}
	.cadres {
		display: grid;
		gap: 2.2rem 1.6rem;
		justify-content: center;
		grid-template-columns: minmax(0, 1fr);
	}
	.cadres.tel {
		grid-template-columns: repeat(auto-fit, 390px);
	}
	.bloc h2 {
		margin: 0 0 0.2rem;
		font: 700 1.05rem system-ui, sans-serif;
	}
	.num {
		display: inline-grid;
		place-items: center;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		background: #1d1b1a;
		color: #ffffff;
		font-size: 0.85rem;
	}
	.mot {
		margin: 0 0 0.6rem;
		color: #55504c;
		font-size: 0.85rem;
		line-height: 1.4;
		min-height: 2.4em;
	}

	/* ---- le cadre : palette validée, variables posées sur .cadres ---- */
	.cadre {
		position: relative;
		background: var(--t-fons);
		color: var(--t-tinta);
		font-family: var(--font-body);
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04), 0 8px 30px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}
	.cadre.tel {
		width: 390px;
		min-height: 640px;
		border-radius: 26px;
	}
	.cadre.ordi {
		border-radius: 14px;
	}
	.ecran {
		container-type: inline-size;
		min-height: inherit;
		display: flex;
		flex-direction: column;
	}
	.barre {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		padding: 0.9rem 1rem;
	}
	.marque {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
	}
	.nom {
		font-family: var(--font-logo);
		font-size: 1.3rem;
	}
	.mot-b {
		white-space: nowrap;
	}
	@container (max-width: 40rem) {
		.mot-b {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}
	}

	/* ---- pièces communes ---- */
	.pc {
		--r: 9px;
		min-height: 0;
		height: 2.3rem;
		padding: 0 0.9rem;
		font-size: 0.82rem;
		gap: 0.4rem;
		white-space: nowrap;
	}
	.pc-icone {
		width: 2.3rem;
		padding: 0;
	}
	.ico {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border: 0;
		border-radius: 10px;
		background: transparent;
		color: var(--t-tinta);
		cursor: pointer;
		text-decoration: none;
	}
	.ico:hover,
	.texte:hover {
		background: color-mix(in srgb, var(--t-tinta) 8%, transparent);
	}
	.texte {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 2.5rem;
		padding: 0 0.6rem;
		border: 0;
		border-radius: 10px;
		background: transparent;
		color: var(--t-tinta);
		font: 700 0.9rem var(--font-body);
		cursor: pointer;
	}
	.fantome {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		height: 2.3rem;
		padding: 0 0.85rem;
		border: 1.5px solid var(--t-tinta);
		border-radius: 9px;
		background: transparent;
		color: var(--t-tinta);
		font: 700 0.85rem var(--font-body);
		cursor: pointer;
	}
	:global(.ico:focus-visible),
	:global(.texte:focus-visible),
	:global(.fantome:focus-visible),
	:global(.sw button:focus-visible),
	:global(.lang-texte button:focus-visible),
	:global(.sw-theme:focus-visible),
	:global(.onglets a:focus-visible) {
		outline: 3px solid var(--t-aur-clar, #c7811b);
		outline-offset: 2px;
	}

	/* l'interrupteur de langue : une piste, la langue choisie posée dessus */
	.sw {
		display: inline-flex;
		padding: 3px;
		border-radius: 12px;
		background: var(--pc-carton);
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
	}
	.sw button {
		height: 1.85rem;
		min-width: 2.6rem;
		padding: 0 0.7rem;
		border: 0;
		border-radius: 9px;
		background: transparent;
		color: var(--pc-carton-tinta);
		font: 700 0.8rem var(--font-body);
		cursor: pointer;
	}
	.sw button[aria-pressed='true'] {
		background: var(--pc-or-fons);
		color: var(--pc-or-tinta);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
	}
	/* version teintée (odd-squid-52) : la piste est l'encre à 10 %, la langue choisie en ocre */
	.sw.teinte {
		background: color-mix(in srgb, var(--t-tinta) 10%, transparent);
		box-shadow: none;
	}
	.sw.teinte button {
		color: var(--t-tinta);
	}
	.sw.teinte button[aria-pressed='true'] {
		background: var(--pc-or-fons);
		color: var(--pc-or-tinta);
	}

	/* ---- 0 : aujourd'hui ---- */
	.b0-droite {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	@container (max-width: 40rem) {
		.b0 .reservar {
			display: none;
		}
		.b0 .pc:not(.pc-icone) {
			width: 2.3rem;
			padding: 0;
		}
	}

	/* ---- 1 : calme ---- */
	.b1-droite {
		display: flex;
		align-items: center;
		gap: 0.1rem;
	}
	.b1-droite .reservar {
		margin-right: 0.5rem;
	}
	.lang-texte {
		display: inline-flex;
		margin-right: 0.1rem;
	}
	.lang-texte button {
		min-height: 2.5rem;
		padding: 0 0.45rem;
		border: 0;
		background: transparent;
		color: var(--t-tinta-2);
		font: 600 0.88rem var(--font-body);
		cursor: pointer;
	}
	.lang-texte button[aria-pressed='true'] {
		color: var(--t-tinta);
		text-decoration: underline;
		text-decoration-color: var(--pc-or-fons);
		text-decoration-thickness: 2px;
		text-underline-offset: 5px;
	}
	@container (max-width: 40rem) {
		.b1 .reservar {
			display: none;
		}
	}

	/* ---- 2 : deux niveaux ---- */
	.service {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.6rem;
		padding: 0.4rem 1rem;
		background: var(--t-fons-2);
		border-bottom: 1px solid var(--t-linha);
		font-size: 0.8rem;
	}
	.hint {
		margin-right: auto;
		color: var(--t-tinta-2);
		font-size: 0.74rem;
		letter-spacing: 0.04em;
	}
	@container (max-width: 40rem) {
		.hint {
			display: none;
		}
	}
	.teinte-p {
		width: 2.2rem;
		height: 2.2rem;
		background: color-mix(in srgb, var(--t-tinta) 10%, transparent);
	}
	.pilule-t {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		height: 2.2rem;
		padding: 0 0.8rem;
		border-radius: 12px;
		background: color-mix(in srgb, var(--t-tinta) 10%, transparent);
		color: var(--t-tinta);
		font-weight: 700;
		text-decoration: none;
	}
	@container (max-width: 40rem) {
		.pilule-t {
			width: 2.2rem;
			padding: 0;
			justify-content: center;
		}
	}
	.b2-droite {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	@container (max-width: 40rem) {
		.b2 .reservar {
			height: 2.3rem;
		}
	}

	/* le thème : interrupteur lune et soleil, un vrai bouton (fresh-fireant-15 rendu accessible) */
	.sw-theme {
		display: inline-flex;
		align-items: center;
		width: 3.1rem;
		height: 1.85rem;
		padding: 3px;
		border: 0;
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-tinta) 14%, transparent);
		color: var(--t-tinta);
		cursor: pointer;
	}
	.piste-t {
		display: flex;
		width: 100%;
	}
	.astre {
		display: grid;
		place-items: center;
		width: 1.45rem;
		height: 1.45rem;
		border-radius: 50%;
		background: var(--pc-or-fons);
		color: var(--pc-or-tinta);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
		transition: transform 0.25s ease;
	}
	.sw-theme[aria-checked='true'] .astre {
		transform: translateX(1.25rem);
	}
	@media (prefers-reduced-motion: reduce) {
		.astre {
			transition: none;
		}
	}

	/* ---- 3 : téléphone d'abord ---- */
	.b3 {
		gap: 1.2rem;
	}
	.verbes {
		display: flex;
		gap: 1.6rem;
		margin-right: auto;
		margin-left: 1.2rem;
	}
	.verbes a {
		color: var(--t-tinta);
		font-weight: 700;
		text-decoration: none;
		padding: 0.3rem 0;
		border-bottom: 2px solid transparent;
	}
	.verbes a:hover {
		border-bottom-color: var(--pc-or-fons);
	}
	.b3-droite {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}
	.onglets {
		position: absolute;
		inset: auto 0 0 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		background: var(--t-fons);
		border-top: 1px solid var(--t-linha);
		padding: 0.3rem 0.2rem calc(0.3rem + env(safe-area-inset-bottom, 0px));
		box-shadow: 0 -4px 14px rgba(0, 0, 0, 0.06);
	}
	.onglets a {
		display: grid;
		justify-items: center;
		gap: 0.15rem;
		padding: 0.4rem 0 0.35rem;
		min-height: 3.6rem;
		color: var(--t-tinta-2);
		font-size: 0.72rem;
		font-weight: 600;
		text-decoration: none;
	}
	/* l'onglet actif : la couleur d'accent du thème (rouge en clair, ocre en sombre) : jamais de rouge en texte sur le sombre */
	.onglets a[aria-current='page'] {
		color: var(--t-aur);
	}
	.onglets a[aria-current='page'] .ic {
		background: color-mix(in srgb, var(--t-aur) 14%, transparent);
	}
	.ic {
		display: grid;
		place-items: center;
		width: 3.2rem;
		height: 1.9rem;
		border-radius: 999px;
	}

	/* ---- le début de page, le même sous chaque barre ---- */
	.heros {
		padding: 1.4rem 1rem 5rem;
	}
	.kicker {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin: 0 0 0.5rem;
		color: var(--t-aur);
		font: 700 0.76rem var(--font-body);
		letter-spacing: 0.26em;
	}
	.filet {
		width: 2.6rem;
		height: 1px;
		background: currentColor;
	}
	h3 {
		display: grid;
		margin: 0 0 0.8rem;
		font: 400 clamp(2.1rem, 9cqw, 3.6rem) / 1.03 var(--font-heading);
	}
	h3 .decale {
		padding-left: 0.9em;
	}
	.valeur {
		color: var(--t-aur);
	}
	.lead {
		max-width: 28ch;
		margin: 0 0 1rem;
		color: var(--t-tinta-2);
		line-height: 1.5;
	}
	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}
	.reservar-hero {
		--pc-fons: transparent;
		--pc-tinta: var(--t-tinta);
		box-shadow: inset 0 0 0 1.5px var(--t-tinta);
	}
</style>
