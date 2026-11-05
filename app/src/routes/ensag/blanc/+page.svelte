<script>
	// Esquisse « page presque blanche » (nuit du 2026-10-22), pour que Romain
	// la voie sur son téléphone au réveil. Source : revisions/2026-10-22-
	// proposicion-pagina-blanca.md, points 7 (direction visuelle), 8 (le
	// mouvement) et 13 (gabarit en texte). Sept blocs : ouverture, bandeau,
	// Qu'es aquò, 01 Se parla, 02 S'apren, 03 Amassa, appel.
	// Règles : plâtre et encre, la brique seule couleur vive de la page, les
	// tuiles Canva portent leurs propres couleurs ; Limelight pour le titre
	// géant et le mot de chaque tuile, Luciole pour le reste, Cormorant pour
	// Max Rouquette seul ; une seule chose bouge par écran, en CSS seul ;
	// aucun occitan inventé : textes du site, sinon « [a escriure per Romain] ».
	// Page de travail, pas indexée.
	import Crotz from '$lib/components/Crotz.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import {
		RESERVAR, MANIFEST, LO_LIGAM, ESCRIURE, CAUSIR, MOT_SETMANA, BANDEL, BIAIS, TEULAS,
		VISTA, ESTELAS, COSTA_D
	} from './donadas.js';

	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';

	const href = (h) => (h === 'RESERVAR' ? RESERVAR : h);
	// Essai de l'ouverture (Romain, 2026-10-22 : « la carte est vraiment une pièce
	// maîtresse… s'ouvrir sur la version accueil de la carte ? ») : Fiche = la fiche
	// de la semaine ouvre, la carte en étoiles est en 01 ; Carte = la carte en
	// étoiles ouvre, la fiche rejoint S'apren (Mots en imatges y est depuis ce jour).
	// Le choix se garde dans l'adresse (?dobertura=carta).
	const DOBERTURAS = [['ficha', 'Fiche'], ['carta', 'Carte en étoiles']];
	const demandada = page.url.searchParams.get('dobertura');
	// Choix de Romain le 2026-10-22 au matin : « Oui, la carte version allégée » : Carte par défaut
	let dobertura = $state(DOBERTURAS.some(([v]) => v === demandada) ? demandada : 'carta');
	function causir(v) {
		dobertura = v;
		replaceState('?dobertura=' + v, {});
	}
	// La croix aux couleurs de Romain sur fond clair (app.css, 2026-10-21) : ocre et rouge
	const CROTZ = { traç: '#b53d17', ponch: '#eeaf34', moieu: '#b53d17' };
</script>

<svelte:head>
	<title>Lo Ligam · esquisse blanche</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- Lettres « en braise » au survol, sans halo (décision du 2026-10-21) -->
{#snippet braisa(t)}{#each [...t] as c, i (i)}{#if c === ' '}{' '}{:else}<span class="l">{c}</span>{/if}{/each}{/snippet}

{#snippet sageta()}<Icona nom="suivant" size="0.9em" />{/snippet}

<!-- La fiche de la semaine : dans l'ouverture (variante Fiche) ou dans S'apren (variante Carte) -->
{#snippet fichaFig(cl)}
	<figure class="ficha {cl}" style="--i: 2">
		<figcaption class="ficha-cap"><span class="etiqueta">Lo mot de la setmana</span><small class="nòta">[a validar]</small></figcaption>
		<a class="teula" href={MOT_SETMANA.href}>
			<img src="/ensag/blanc/{MOT_SETMANA.img}.webp" width="640" height="640" alt="Ficha « {MOT_SETMANA.mot} »" fetchpriority="high" />
		</a>
		<p class="teula-mot"><span class="mot">{MOT_SETMANA.mot}</span><a class="ligam-fl" href={MOT_SETMANA.href}>Mots en imatges {@render sageta()}</a></p>
	</figure>
{/snippet}

<!-- La carte en étoiles : en 01 (variante Fiche) ou dans l'ouverture (variante Carte) -->
{#snippet cartaFig()}
	<figure class="carta">
		<svg viewBox={VISTA} role="img" aria-label="La carta">
			<path class="costa" d={COSTA_D} pathLength="1" />
			{#each ESTELAS as e, i (e.nom + i)}
				<circle class="estela" class:vila={e.vila} cx={e.x} cy={e.y} r={e.vila ? 4 : 2} style="--i: {i}" />
				{#if e.vila}<text class="vila-nom" x={e.x + 8} y={e.y + 4}>{e.nom}</text>{/if}
			{/each}
		</svg>
	</figure>
{/snippet}

<div class="blanc">
	<header class="cap grasilha">
		<a class="marca" href="/"><Crotz talha={32} {...CROTZ} />Lo Ligam</a>
		<nav class="nav" aria-label="Lo Ligam">
			<button type="button"><Icona nom="menu" size="1.25em" /><span>Menú</span></button>
			<a class="pilula" href={RESERVAR} target="_blank" rel="noopener">Reservar un cors</a>
		</nav>
	</header>

	<main>
		<!-- 1. Ouverture : le titre géant et la fiche de la semaine -->
		<section class="dobertura grasilha">
			<p class="etiqueta esvani" style="--i: 0">L’occitan</p>
			<h1 class="titol esvani" style="--i: 1" aria-label="Se parla. S’apren. Amassa.">
				<span class="linha" aria-hidden="true">{@render braisa('Se parla.')}</span>
				<span class="linha" aria-hidden="true">{@render braisa('S’apren.')}</span>
				<span class="linha" aria-hidden="true">{@render braisa('Amassa.')}</span>
			</h1>
			<div class="pè-dobertura esvani" style="--i: 3">
				<!-- la phrase de Romain (22-10) ; « siès » : montpelliéranisme assumé -->
				<p class="sostitol">Benvenguda dins ton ligam amb lo mond occitan. D’ont que siás, aicí siès en çò tieu.</p>
				{#if dobertura === 'carta'}
					<div class="accions"><a class="boton" href="/carta">Dobrir la carta {@render sageta()}</a><a class="ligam-fl" href="/aprene">Aprene l’occitan</a></div>
				{:else}
					<a class="boton" href="/aprene">Aprene l’occitan {@render sageta()}</a>
				{/if}
			</div>
			{#if dobertura === 'carta'}{@render cartaFig()}{:else}{@render fichaFig('esvani')}{/if}
		</section>

		<!-- 2. Bandeau : onze mots des fiches, chacun mène à sa fiche -->
		<nav class="bandel grasilha" aria-label="Qualques mots">
			<ul>
				{#each BANDEL as m (m)}
					<li><a href="/mots" lang="oc">{m}</a></li>
				{/each}
			</ul>
			<p class="nòta">{CAUSIR}</p>
		</nav>

		<!-- 3. Qu'es aquò, Lo Ligam ? le manifeste, trois lignes de son histoire, Romain -->
		<section class="manifest grasilha" aria-labelledby="manifest-titol">
			<h2 id="manifest-titol" class="jalon">Qu’es aquò, Lo Ligam ?</h2>
			<div class="manifest-cors">
				<p class="manifest-tèxt" lang="oc">
					{#each MANIFEST.oc as [frasa, aur], n (n)}{#if aur}<mark>{frasa}</mark>{:else}{frasa}{/if}{' '}{/each}
				</p>
				<p class="escriure">{ESCRIURE}</p>
				<a class="ligam-fl" href="/istoria">Mon istòria {@render sageta()}</a>
			</div>
			<figure class="retrat">
				<img src="/ensag/clar/romain-480.webp" width="480" height="496" alt="" loading="lazy" />
				<figcaption>Romain</figcaption>
			</figure>
		</section>

		<!-- 4. 01 Se parla : la carte en étoiles qui se dessine -->
		<section class="bloc grasilha" id="parla" aria-labelledby="parla-titol">
			<header class="bloc-cap">
				<p class="num" aria-hidden="true">01</p>
				<h2 id="parla-titol">Se parla</h2>
				<p class="escriure">{ESCRIURE}</p>
			</header>
			{#if dobertura !== 'carta'}{@render cartaFig()}{/if}
			<div class="bloc-còs" class:larg={dobertura === 'carta'}>
				<ul class="ligams">
					<li><a href="/carta">Dobrir la carta entièra {@render sageta()}</a></li>
					<li><a href="/wiki">Lo wiki de las lengas e dels luòcs {@render sageta()}</a></li>
				</ul>
				<dl class="chifras">
					<div><dt>≈ 600 000</dt><dd>locutors</dd></div>
					<div><dt>32</dt><dd>despartaments</dd></div>
					<div><dt>10</dt><dd>sègles de literatura</dd></div>
				</dl>
			</div>
		</section>

		<!-- 5. 02 S'apren : la scène et la pastille qui respire, les trois façons -->
		<section class="bloc grasilha" id="apren" aria-labelledby="apren-titol">
			<header class="bloc-cap">
				<p class="num" aria-hidden="true">02</p>
				<h2 id="apren-titol">S’apren</h2>
				<p class="escriure">{ESCRIURE}</p>
			</header>
			<figure class="scena">
				<img src="/ensag/scena/ostal-net.webp" width="860" height="860" alt="La scèna de l’ostal" loading="lazy" />
				<span class="pastilha" aria-hidden="true"></span>
			</figure>
			<div class="bloc-còs biais">
				{#if dobertura === 'carta'}{@render fichaFig('')}{/if}
				{#each BIAIS as b (b.n)}
					<article class="biai">
						<p class="num" aria-hidden="true">{b.n}</p>
						<h3>{b.titol}</h3>
						<p>{b.tèxt}</p>
						<a class="ligam-fl" href={href(b.href)} target={b.href === 'RESERVAR' ? '_blank' : undefined} rel={b.href === 'RESERVAR' ? 'noopener' : undefined}>{b.ligam} {@render sageta()}</a>
					</article>
				{/each}
			</div>
		</section>

		<!-- 6. 03 Amassa : six fiches en tuiles, qui se soulèvent au survol -->
		<section class="bloc grasilha" id="amassa" aria-labelledby="amassa-titol">
			<header class="bloc-cap">
				<p class="num" aria-hidden="true">03</p>
				<h2 id="amassa-titol">Amassa</h2>
				<p class="escriure">{ESCRIURE}</p>
			</header>
			<ul class="teulas">
				{#each TEULAS as t (t.img)}
					<li>
						<a class="teula" href="/mots">
							<img src="/ensag/blanc/{t.img}.webp" width="640" height="640" alt="Ficha « {t.mot} »" loading="lazy" />
							<span class="teula-mot"><span class="mot">{t.mot}</span></span>
						</a>
					</li>
				{/each}
			</ul>
			<p class="nòta teulas-nòta">{CAUSIR}</p>
			<ul class="ligams amassa-ligams">
				<li><a href="/mots">Mots en imatges {@render sageta()}</a></li>
				<li><a href="/obras">Òbras {@render sageta()}</a></li>
				<li><a href="https://www.instagram.com/lo_ligam/" target="_blank" rel="noopener">Instagram <Icona nom="extern" size="0.9em" /></a></li>
			</ul>
		</section>

		<!-- 7. Appel : Max Rouquette, puis les cours -->
		<section class="crida grasilha" aria-labelledby="crida-titol">
			<figure class="fenestra">
				<img src="/ensag/clar/erau-760.webp" width="760" height="1101" alt="La vallée de l’Hérault vue par une fenêtre de pierre" loading="lazy" />
			</figure>
			<blockquote class="vers" lang="oc">
				<p>« Espinchas dins la solelhada<br />passar d’un nivol lo pantai… »</p>
				<cite>Max Roqueta · <i>La pietat dau matin</i>, 1963</cite>
			</blockquote>
			<div class="crida-còs">
				<h2 id="crida-titol">Prèst·a per <span class="brica">començar ?</span></h2>
				<p class="sostitol">Tres mots uèi, una lenga deman.</p>
				<div class="accions">
					<a class="boton" href={RESERVAR} target="_blank" rel="noopener">Reservar un primièr cors {@render sageta()}</a>
					<a class="ligam-fl" href="/aprene">Començar sol·a {@render sageta()}</a>
				</div>
			</div>
		</section>
	</main>

	<footer class="pè grasilha">
		<a class="marca" href="/"><Crotz talha={28} {...CROTZ} />Lo Ligam</a>
		<nav aria-label="Lo Ligam">
			{#each LO_LIGAM as l (l.href)}
				<a href={l.href} target={l.defòra ? '_blank' : undefined} rel={l.defòra ? 'noopener' : undefined}>{l.oc}</a>
			{/each}
		</nav>
	</footer>

	<!-- Outil d'essai (hors charte) : choisir ce qui ouvre la page -->
	<div class="causida" role="group" aria-label="Essai : l’ouverture">
		{#each DOBERTURAS as [v, nom] (v)}<button type="button" aria-pressed={dobertura === v} onclick={() => causir(v)}>{nom}</button>{/each}
	</div>
</div>

<style>
	/* ——— Jetons de l'esquisse (point 7) : plâtre, pierre, encre ; brique seule couleur vive ——— */
	.blanc {
		--fons: #f7f3ee;
		--f2: #ede6dc;
		--tinta: #2a1a10;
		--t2: #5e4b3e;
		--linha: rgba(42, 26, 16, 0.14);
		--brica: #b53d17;
		--or: #9c5611;
		--or-plen: #eeaf34;
		--marge: clamp(16px, 3.5vw, 64px);
		--gota: 24px;
		/* trois tailles : petite, courante, titre ; plus le seul titre géant */
		--pichon: 0.875rem;
		--cors: 1.125rem;
		--titol: clamp(2rem, 2.6vw, 2.75rem);
		--geant: clamp(3.25rem, 8.4vw, 10rem);
		--lent: cubic-bezier(0.22, 1, 0.36, 1);
		min-height: 100vh;
		background: var(--fons);
		color: var(--tinta);
		font: 400 var(--cors) / 1.5 'Luciole', system-ui, sans-serif;
		font-synthesis: none;
		overflow-x: clip;
	}
	.blanc a { color: inherit; text-decoration: none; }
	.blanc img { display: block; max-width: 100%; height: auto; }
	.blanc h1, .blanc h2, .blanc h3 { font: 400 var(--titol) / 1.05 'Limelight', serif; margin: 0; letter-spacing: -0.01em; }
	.blanc ul { list-style: none; margin: 0; padding: 0; }
	.blanc p { margin: 0; }

	.grasilha {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		column-gap: var(--gota);
		padding-inline: var(--marge);
	}

	/* Les mentions de travail : ce que Romain écrira ou choisira */
	.escriure, .nòta { font-size: var(--pichon); color: var(--or); font-style: italic; }
	.escriure { max-width: 34ch; }
	.etiqueta { font-size: var(--pichon); font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--or); }
	.num { font-size: var(--pichon); color: var(--or); font-variant-numeric: tabular-nums; letter-spacing: 0.08em; }

	/* ——— En-tête ——— */
	.cap { align-items: center; height: 72px; position: sticky; top: 0; z-index: 5; font-size: var(--pichon);
		background: color-mix(in srgb, var(--fons) 88%, transparent); backdrop-filter: blur(8px); }
	.marca { grid-column: 1 / 6; display: flex; align-items: center; gap: 12px; font: 400 1.25rem / 1 'Limelight', serif; min-height: 44px; }
	.marca :global(svg) { transition: transform 0.8s var(--lent); }
	.marca:hover :global(svg) { transform: rotate(45deg); }
	.nav { grid-column: 6 / 13; display: flex; justify-content: flex-end; align-items: center; gap: 20px; }
	.nav button { font: inherit; font-weight: 700; color: inherit; background: none; border: 0; padding: 0 8px; min-width: 44px; min-height: 44px; cursor: pointer; display: inline-flex; gap: 8px; align-items: center; }
	.pilula { background: var(--brica); color: #fff !important; padding: 12px 20px; border-radius: 999px; font-weight: 700; white-space: nowrap; transition: transform 0.3s var(--lent); }
	.pilula:hover { transform: translateY(-2px); }

	/* ——— Liens et boutons ——— */
	.boton { background: var(--brica); color: #fff !important; font-weight: 700; padding: 16px 28px; border-radius: 999px; display: inline-flex; gap: 12px; align-items: center; transition: transform 0.3s var(--lent), box-shadow 0.3s; }
	.boton:hover { transform: translateY(-2px); box-shadow: 0 8px 24px -12px var(--brica); }
	.ligam-fl { font-weight: 700; display: inline-flex; gap: 8px; align-items: center; min-height: 32px; padding: 4px 0 2px; border-bottom: 1.5px solid currentColor; }
	.ligam-fl:hover, .ligams a:hover { color: var(--brica); }
	.blanc :global(.icona) { transition: transform 0.3s var(--lent); }
	.boton:hover :global(.icona), .ligam-fl:hover :global(.icona), .ligams a:hover :global(.icona) { transform: translateX(4px); }
	.ligams { border-bottom: 1px solid var(--linha); }
	.ligams a { display: flex; justify-content: space-between; align-items: center; gap: 16px; min-height: 52px; border-top: 1px solid var(--linha); transition: color 0.3s, padding 0.3s var(--lent); }
	.ligams a:hover { padding-left: 8px; }

	/* ——— 1. Ouverture ——— */
	.dobertura { min-height: calc(100svh - 72px); grid-template-rows: 1fr auto auto auto 1fr; padding-top: 32px; }
	.dobertura .etiqueta { grid-column: 1 / 8; grid-row: 2; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
	.dobertura .etiqueta::before { content: ''; width: 48px; height: 1px; background: currentColor; }
	.blanc .titol { grid-column: 1 / 8; grid-row: 3; font-size: var(--geant); line-height: 0.94; }
	.titol .linha { display: block; }
	.titol .linha:last-child { color: var(--brica); }
	/* la braise : le fond doré monte dans la lettre, sans halo */
	.titol :global(.l) { background: linear-gradient(to top, var(--or-plen) 50%, currentColor 50%) 0 0 / 100% 200% no-repeat;
		-webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; transition: background-position 2.4s var(--lent); }
	.titol :global(.l:hover) { background-position: 0 100%; transition-duration: 0.35s; }
	.pè-dobertura { grid-column: 1 / 8; grid-row: 4; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px 48px; margin-top: 40px; }
	.dobertura .sostitol { max-width: 34ch; font-size: 1.25rem; line-height: 1.45; color: var(--t2); }
	.ficha { margin: 0; display: grid; gap: 12px; }
	.dobertura .ficha { grid-column: 9 / 13; grid-row: 1 / 6; align-self: center; }
	/* Variante Carte : la carte en étoiles ouvre la page, dessinée dans le temps (pas au défilement) */
	.dobertura .carta { grid-column: 7 / 13; grid-row: 1 / 6; align-self: center; }
	.dobertura .costa { animation: traçar 2.4s var(--lent) 0.2s forwards; animation-timeline: auto; }
	.dobertura .estela { animation: lusir 0.6s ease-out forwards; animation-delay: calc(0.6s + var(--i) * 6ms); animation-timeline: auto; }
	#parla .bloc-còs.larg { grid-column: 1 / 13; grid-template-columns: 1fr 1fr; align-items: start; }
	#apren .ficha { max-width: 360px; margin-bottom: 40px; }
	.ficha-cap { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
	.teula { display: block; border-radius: 8px; overflow: hidden; background: var(--f2); box-shadow: 0 1px 2px rgba(42, 26, 16, 0.08), 0 12px 32px -20px rgba(42, 26, 16, 0.5);
		transition: transform 0.5s var(--lent), box-shadow 0.5s; }
	.teula:hover { transform: translateY(-4px); box-shadow: 0 1px 2px rgba(42, 26, 16, 0.08), 0 24px 40px -20px rgba(42, 26, 16, 0.5); }
	.teula img { aspect-ratio: 1; width: 100%; object-fit: cover; }
	.teula-mot { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
	.mot { font: 400 var(--titol) / 1 'Limelight', serif; }

	/* ——— 2. Bandeau ——— */
	.bandel { padding-block: 32px; row-gap: 12px; border-block: 1px solid var(--linha); }
	.bandel ul { grid-column: 1 / 13; display: flex; flex-wrap: wrap; gap: 4px 8px; }
	.bandel a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 999px; font: 400 1.5rem / 1 'Limelight', serif; transition: background-color 0.3s, color 0.3s; }
	.bandel a:hover { background: var(--f2); color: var(--brica); }
	.bandel .nòta { grid-column: 1 / 13; }

	/* ——— 3. Qu'es aquò ——— */
	.manifest { padding-block: 128px; row-gap: 48px; }
	.blanc .jalon { grid-column: 1 / 4; font: 700 var(--pichon) / 1.5 'Luciole', sans-serif; letter-spacing: 0.08em; text-transform: uppercase; color: var(--or); }
	.manifest-cors { grid-column: 4 / 10; display: grid; gap: 32px; justify-items: start; }
	.manifest-tèxt { font-size: clamp(1.75rem, 3vw, 2.75rem); line-height: 1.25; max-width: 26ch; }
	.manifest mark { background: none; color: var(--brica); font-weight: 700; }
	.retrat { grid-column: 10 / 13; margin: 0; align-self: end; display: grid; gap: 12px; font-size: var(--pichon); color: var(--t2); }
	.retrat img { border-radius: 8px; aspect-ratio: 4 / 5; object-fit: cover; object-position: 50% 20%; }

	/* ——— 4, 5, 6 : les trois blocs numérotés ——— */
	.bloc { padding-block: 96px; row-gap: 48px; border-top: 1px solid var(--linha); }
	.bloc-cap { grid-column: 1 / 13; display: grid; grid-template-columns: subgrid; align-items: baseline; row-gap: 16px; }
	.bloc-cap .num { grid-column: 1 / 2; }
	.bloc-cap h2 { grid-column: 2 / 7; }
	.bloc-cap .escriure { grid-column: 7 / 13; }
	.bloc-còs { grid-column: 8 / 13; align-self: center; display: grid; gap: 40px; }

	/* 01 : la carte en étoiles, qui se dessine en entrant dans l'écran */
	.carta { grid-column: 1 / 8; margin: 0; }
	.carta svg { width: 100%; height: auto; display: block; }
	.costa { fill: none; stroke: var(--tinta); stroke-opacity: 0.35; stroke-width: 1.2; stroke-linejoin: round;
		stroke-dasharray: 1; stroke-dashoffset: 1; animation: traçar 2.4s var(--lent) 0.2s forwards; }
	.estela { fill: var(--tinta); fill-opacity: 0.55; opacity: 0; animation: lusir 0.6s ease-out forwards; animation-delay: calc(0.6s + var(--i) * 6ms); }
	.estela.vila { fill: var(--brica); fill-opacity: 1; }
	.vila-nom { font: 400 13px / 1 'Luciole', sans-serif; fill: var(--t2); }
	@keyframes traçar { to { stroke-dashoffset: 0; } }
	@keyframes lusir { to { opacity: 1; } }
	/* Quand le navigateur sait suivre le défilement, le dessin suit la carte qui entre dans l'écran */
	@supports (animation-timeline: view()) {
		.costa { animation: traçar auto linear forwards; animation-timeline: view(); animation-range: entry 10% cover 45%; }
		.estela { animation: lusir auto linear forwards; animation-timeline: view();
			animation-range: entry calc(20% + var(--i) * 0.15%) cover calc(40% + var(--i) * 0.15%); }
	}
	.chifras { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 0; font-size: var(--pichon); color: var(--t2); }
	.chifras div { border-top: 1px solid var(--linha); padding-top: 12px; }
	.chifras dt { font: 400 1.5rem / 1.1 'Limelight', serif; color: var(--tinta); }
	.chifras dd { margin: 4px 0 0; }

	/* 02 : la scène, et la pastille d'or qui respire (le geste de la leçon) */
	.scena { grid-column: 1 / 7; margin: 0; position: relative; border-radius: 8px; overflow: hidden; background: var(--f2); }
	.pastilha { position: absolute; left: 33.7%; top: 47.7%; width: 28px; height: 28px; margin: -14px 0 0 -14px; border-radius: 50%;
		background: var(--or-plen); box-shadow: 0 0 0 6px rgba(238, 175, 52, 0.35); animation: respirar 2.6s ease-in-out infinite; }
	@keyframes respirar { 50% { transform: scale(1.18); box-shadow: 0 0 0 14px rgba(238, 175, 52, 0.18); } }
	#apren .bloc-còs { grid-column: 7 / 13; gap: 0; }
	.biai { display: grid; grid-template-columns: 2.5rem 1fr; column-gap: 8px; row-gap: 8px; padding-block: 24px; border-top: 1px solid var(--linha); }
	.biai:last-child { border-bottom: 1px solid var(--linha); }
	.biai .num { grid-row: 1 / 4; padding-top: 0.5em; }
	.biai h3 { font-size: 1.5rem; }
	.biai p:not(.num) { color: var(--t2); }

	/* 03 : six tuiles qui portent leurs propres couleurs ; la page reste plâtre */
	.teulas { grid-column: 1 / 13; display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--gota); }
	.teulas .teula { display: grid; gap: 10px; background: none; box-shadow: none; }
	.teulas .teula img { border-radius: 8px; box-shadow: 0 1px 2px rgba(42, 26, 16, 0.08), 0 12px 32px -20px rgba(42, 26, 16, 0.5); transition: box-shadow 0.5s; }
	.teulas .teula:hover img { box-shadow: 0 1px 2px rgba(42, 26, 16, 0.08), 0 24px 40px -20px rgba(42, 26, 16, 0.5); }
	.teulas .teula-mot { display: grid; gap: 2px; font-size: var(--pichon); color: var(--t2); }
	.teulas .mot { font-size: 1.5rem; color: var(--tinta); }
	.teulas-nòta { grid-column: 1 / 13; margin-top: -32px; }
	.amassa-ligams { grid-column: 1 / 7; }

	/* ——— 7. Appel ——— */
	.crida { padding-block: 128px 96px; row-gap: 64px; border-top: 1px solid var(--linha); align-items: center; }
	.fenestra { grid-column: 1 / 4; grid-row: 1 / 3; margin: 0; border-radius: 999px 999px 8px 8px; overflow: hidden; background: var(--f2); }
	.fenestra img { aspect-ratio: 3 / 4; object-fit: cover; object-position: 50% 60%; }
	.vers { grid-column: 5 / 12; margin: 0; }
	.vers p { font: italic 500 clamp(1.75rem, 3.2vw, 3rem) / 1.2 'Cormorant Garamond', Georgia, serif; }
	.vers cite { display: block; margin-top: 16px; font: 400 var(--pichon) / 1.5 'Luciole', sans-serif; color: var(--t2); }
	.crida-còs { grid-column: 5 / 12; display: grid; gap: 24px; justify-items: start; }
	.crida-còs h2 { font-size: var(--geant); line-height: 0.94; }
	.brica { color: var(--brica); }
	.sostitol { font-size: 1.25rem; color: var(--t2); }
	.accions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 32px; }

	/* ——— Pied de page ——— */
	.pè { align-items: center; padding-block: 32px 64px; font-size: var(--pichon); color: var(--t2); border-top: 1px solid var(--linha); }
	.pè .marca { color: var(--tinta); }
	.pè nav { grid-column: 6 / 13; display: flex; gap: 32px; justify-content: flex-end; }
	.pè nav a { display: inline-flex; align-items: center; min-height: 44px; }

	/* ——— Sélecteur de l'essai (outil, pas le site) ——— */
	.causida { position: fixed; right: 16px; bottom: 16px; z-index: 9; display: flex; gap: 4px; padding: 4px;
		background: #fff; color: #2a1a10; border-radius: 999px; box-shadow: 0 8px 32px -8px rgba(42, 26, 16, 0.35); font: 700 0.8125rem / 1 'Luciole', sans-serif; }
	.causida button { font: inherit; color: inherit; border: 0; background: none; padding: 12px 16px; border-radius: 999px; cursor: pointer; white-space: nowrap; }
	.causida button[aria-pressed='true'] { background: #2a1a10; color: #fff; }

	/* ——— Entrée en douceur, une fois ——— */
	.esvani { animation: montar 0.9s var(--lent) both; animation-delay: calc(var(--i, 0) * 90ms + 100ms); }
	@keyframes montar { from { opacity: 0; transform: translateY(16px); } }

	/* Version légère (charte §5septies) : tout immobile, la carte dessinée d'un coup */
	@media (prefers-reduced-motion: reduce) {
		.blanc *, .blanc *::before, .blanc *::after { animation: none !important; transition: none !important; }
		.costa { stroke-dashoffset: 0; }
		.estela { opacity: 1; }
	}

	/* ——— Téléphone : chaque bloc est un écran, une colonne ——— */
	@media (max-width: 860px) {
		.blanc { --titol: 2rem; }
		.marca { grid-column: 1 / 7; }
		.nav { grid-column: 7 / 13; gap: 8px; }
		.nav button span { display: none; }
		.pilula { padding: 10px 14px; font-size: 0.8125rem; }
		.dobertura { grid-template-rows: auto; min-height: 0; padding-block: 32px 48px; row-gap: 0; }
		.dobertura .etiqueta, .blanc .titol, .pè-dobertura, .dobertura .ficha, .dobertura .carta { grid-column: 1 / 13; grid-row: auto; }
		.pè-dobertura { margin-top: 32px; }
		.dobertura .ficha { margin-top: 48px; max-width: 420px; }
		.dobertura .carta { margin-top: 40px; }
		#parla .bloc-còs.larg { grid-template-columns: 1fr; }
		.causida { left: 16px; justify-content: space-between; }
		.bandel { padding-block: 24px; }
		.bandel a { font-size: 1.25rem; padding: 0 10px; }
		.manifest { padding-block: 80px; row-gap: 32px; }
		.jalon, .manifest-cors, .retrat { grid-column: 1 / 13; }
		.retrat { max-width: 200px; }
		.bloc { padding-block: 72px; row-gap: 32px; }
		.bloc-cap { display: grid; grid-template-columns: 1fr; row-gap: 8px; }
		.bloc-cap .num, .bloc-cap h2, .bloc-cap .escriure { grid-column: 1; }
		.carta, .scena, .bloc-còs, #apren .bloc-còs, .amassa-ligams { grid-column: 1 / 13; }
		.vila-nom { display: none; }
		/* sur téléphone la carte est petite : étoiles plus grosses, côte plus nette */
		.estela { r: 3.2px; }
		.estela.vila { r: 5.5px; }
		.costa { stroke-opacity: 0.55; }
		.chifras { grid-template-columns: 1fr; gap: 0; }
		.chifras div { display: flex; align-items: baseline; gap: 12px; padding-block: 12px; }
		.chifras dt { font-size: 1.25rem; }
		.teulas { grid-template-columns: repeat(2, 1fr); gap: 16px; }
		.teulas-nòta { margin-top: -16px; }
		.crida { padding-block: 80px 64px; row-gap: 40px; align-items: start; }
		.fenestra { grid-column: 1 / 7; grid-row: auto; }
		.vers, .crida-còs { grid-column: 1 / 13; }
		.vers p { font-size: 1.75rem; }
		.crida-còs h2 { font-size: 3.25rem; }
		.pè { row-gap: 16px; }
		.pè .marca, .pè nav { grid-column: 1 / 13; }
		.pè nav { justify-content: flex-start; flex-wrap: wrap; gap: 8px 24px; }
	}
</style>
