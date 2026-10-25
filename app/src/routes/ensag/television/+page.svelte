<script>
	// Page d'essai de la télévision (2026-10-25, Romain : « pour la télé,
	// pareil » que les radios). Trois présentations à comparer, dans les ors de
	// la case Mèdias, inspirées des sites qui recensent les télés :
	//   A. le mur d'écrans (les mosaïques de chaînes des sites de replay) ;
	//   B. le téléviseur (on zappe d'une chaîne à l'autre à la télécommande) ;
	//   C. la carte (comme TV Garden, devenu Famelack ; même fond que les radios).
	// Aucun lecteur intégré : chaque chaîne mène à son site (rien ne se charge
	// chez un tiers sans clic). Données dans $lib/ensag/maqueta.js.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { PALETAS } from '$lib/apren/teulas.js';
	import { TELES } from '$lib/ensag/maqueta.js';
	import { DIALECTES, LARG, NAUT, proj } from '$lib/ensag/carta-dialectes.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let fr = $derived(langStore.current === 'fr');
	const t = {
		oc: {
			titol: 'Television e video',
			frasa: 'Las cadenas, las emissions e las videos en occitan.',
			veire: 'Veire',
			dirècte: 'En dirècte',
			cadenas: 'Las cadenas'
		},
		fr: {
			titol: 'Télévision et vidéo',
			frasa: 'Les chaînes, les émissions et les vidéos en occitan.',
			veire: 'Voir',
			dirècte: 'En direct',
			cadenas: 'Les chaînes'
		}
	};
	let tx = $derived(t[fr ? 'fr' : 'oc']);
	const s = (o) => (fr ? o.fr : o.oc);

	const VISTAS = [
		['mur', 'A. Le mur d’écrans'],
		['televisor', 'B. Le téléviseur'],
		['carta', 'C. La carte']
	];
	let vista = $state('mur');

	const AUR = PALETAS.aur;
	const color = (i) => AUR[i % AUR.length];
	const num = (i) => String(i + 1).padStart(2, '0');
	const pos = TELES.map((e) => proj(e.lon, e.lat));

	// le téléviseur : la chaîne choisie, et un compteur pour rejouer la neige
	let causida = $state(0);
	let zap = $state(0);
	const tele = $derived(TELES[causida]);
	function zapar(i) {
		causida = i;
		zap++;
	}
</script>

<svelte:head>
	<title>Television (maqueta) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet jogar()}<svg class="jogar" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" /><path d="M20 15l13 9-13 9z" /></svg>{/snippet}
{#snippet dirècte(e)}
	{#if e.dirècte}
		<a class="dirècte" href={e.dirècte} target="_blank" rel="noopener noreferrer"><span class="lum" aria-hidden="true"></span>{tx.dirècte}</a>
	{/if}
{/snippet}

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="tele">
	<nav class="camin" aria-label={fr ? 'Fil d’Ariane' : 'Camin'}>
		<a href="/ensag/parla">{fr ? 'Se parle' : 'Se parla'}</a><span aria-hidden="true">›</span>
		<a href="/ensag/medias">{fr ? 'Médias' : 'Mèdias'}</a><span aria-hidden="true">›</span>
		<span aria-current="page">{tx.titol}</span>
	</nav>

	<header class="cap">
		<h1 lang={fr ? 'fr' : 'oc'}>{tx.titol}</h1>
		<p class="frasa" lang={fr ? 'fr' : 'oc'}>{tx.frasa}</p>
	</header>

	<div class="vistas" role="group" aria-label="Présentation">
		{#each VISTAS as [v, nom] (v)}
			<button type="button" aria-pressed={vista === v} onclick={() => (vista = v)}>{nom}</button>
		{/each}
	</div>

	{#if vista === 'mur'}
		<!-- A. Le mur d'écrans : un écran par chaîne, le premier en grand -->
		<ul class="mur">
			{#each TELES as e, i (e.id)}
				{@const [fons, tinta] = color(i)}
				<li class="ecran" class:gran={i === 0} style:--fons={fons} style:--tinta={tinta} style:--i={i}>
					<span class="sorta" lang={fr ? 'fr' : 'oc'}>{s(e.sorta)}</span>
					{@render dirècte(e)}
					<a class="ecran-ligam" href={e.site} target="_blank" rel="noopener noreferrer">
						<span class="nom" lang="oc">{e.nom}</span>
					</a>
					<p class="tèxt" lang={fr ? 'fr' : 'oc'}>{s(e.tèxt)}</p>
					<span class="pè">
						<span class="luòc" lang={fr ? 'fr' : 'oc'}>{s(e.luòc)}</span>
						{@render jogar()}
					</span>
				</li>
			{/each}
		</ul>
	{:else if vista === 'televisor'}
		<!-- B. Le téléviseur : l'écran à gauche, la télécommande à droite -->
		<div class="televisor">
			<div class="tv-ecran" aria-live="polite">
				{#key zap}
					<div class="tv-contengut">
						<span class="tv-num" aria-hidden="true">{num(causida)}</span>
						<span class="sorta" lang={fr ? 'fr' : 'oc'}>{s(tele.sorta)} · {s(tele.luòc)}</span>
						<strong class="tv-nom" lang="oc">{tele.nom}</strong>
						<p class="tèxt" lang={fr ? 'fr' : 'oc'}>{s(tele.tèxt)}</p>
						<span class="tv-accions">
							<a class="veire" href={tele.site} target="_blank" rel="noopener noreferrer">{tx.veire} <Icona nom="extern" size="1em" /></a>
							{@render dirècte(tele)}
						</span>
					</div>
					<span class="neu" aria-hidden="true"></span>
				{/key}
			</div>
			<div class="tv-comandas" role="group" aria-label={tx.cadenas}>
				{#each TELES as e, i (e.id)}
					<button type="button" class="tv-boton" aria-pressed={causida === i} onclick={() => zapar(i)}>
						<span class="tv-boton-num" aria-hidden="true">{i + 1}</span>
						<span class="tv-boton-nom" lang="oc">{e.nom}</span>
					</button>
				{/each}
			</div>
		</div>
	{:else}
		<!-- C. La carte : les dialectes en aplats d'or, un point par chaîne -->
		<div class="carta" style:aspect-ratio="{LARG} / {NAUT}">
			<svg viewBox="0 0 {LARG} {NAUT}" aria-hidden="true">
				{#each DIALECTES as d, i (d.id)}
					<path d={d.d} fill={AUR[i % AUR.length][0]} />
				{/each}
			</svg>
			{#each TELES as e, i (e.id)}
				{@const [x, y] = pos[i]}
				<a class="punt" class:esquèrra={x > 800} style:left="{x / 10}%" style:top="{(y / NAUT) * 100}%" href={e.site} target="_blank" rel="noopener noreferrer">
					<span class="punt-rond" aria-hidden="true"></span>
					<span class="punt-nom" lang="oc">{e.nom}</span>
					<span class="punt-fica" lang={fr ? 'fr' : 'oc'}><b>{s(e.sorta)}</b> {s(e.tèxt)}</span>
				</a>
			{/each}
		</div>
		<!-- téléphone : les noms ne tiennent pas sur la carte, on les liste dessous -->
		<ul class="carta-lista">
			{#each TELES as e (e.id)}
				<li>
					<a href={e.site} target="_blank" rel="noopener noreferrer">
						<span class="punt-rond" aria-hidden="true"></span>
						<span><b lang="oc">{e.nom}</b> <span class="lista-tèxt" lang={fr ? 'fr' : 'oc'}>{s(e.sorta)} · {s(e.luòc)}</span></span>
						<Icona nom="extern" size="0.9em" />
					</a>
				</li>
			{/each}
		</ul>
	{/if}
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
	.tele {
		container: tele / inline-size;
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
	.cap {
		margin: var(--esp-24) 0 var(--esp-32, 2rem);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3rem, 9vw, 7rem);
		line-height: 0.95;
	}
	.frasa {
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		color: var(--t-tinta-2);
	}

	/* le choix de la présentation (maquette seulement) */
	.vistas {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: var(--esp-24);
		padding: 0.3rem;
		border: 1px dashed var(--t-linha);
		border-radius: 999px;
	}
	.vistas button {
		padding: 0.45rem 1rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--t-tinta-2);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.vistas button[aria-pressed='true'] {
		background: var(--t-aur);
		color: #2a1a10;
	}

	/* le petit voyant rouge du direct (rouge du logo en aplat = clic) */
	.dirècte {
		position: relative;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		background: #b53d17;
		color: #fbf1e1;
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-decoration: none;
	}
	.lum {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: #fbf1e1;
		animation: lusir 1.6s ease-in-out infinite;
	}
	@keyframes lusir {
		50% { opacity: 0.25; }
	}
	.sorta {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.jogar {
		width: 3rem;
		height: 3rem;
		flex: 0 0 auto;
		transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.jogar circle {
		fill: none;
		stroke: currentColor;
		stroke-width: 2.5;
	}
	.jogar path {
		fill: currentColor;
	}

	/* ---------- A. Le mur d'écrans ---------- */
	.mur {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.ecran {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--esp-8);
		aspect-ratio: 16 / 9;
		padding: var(--esp-16) var(--esp-16) var(--esp-12);
		border-radius: 12px;
		/* l'écran : un léger bombé et des lignes de balayage à peine visibles */
		background:
			radial-gradient(ellipse 120% 90% at 30% 20%, rgba(255, 255, 255, 0.14), transparent 60%),
			repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.035) 0 1px, transparent 1px 3px),
			var(--fons);
		color: var(--tinta);
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12), inset 0 -30px 50px -30px rgba(0, 0, 0, 0.25);
		overflow: clip;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 70ms);
	}
	.ecran.gran {
		grid-column: span 2;
		grid-row: span 2;
		aspect-ratio: auto;
		padding: var(--esp-32);
	}
	@keyframes arribar {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}
	.ecran .dirècte {
		position: absolute;
		top: var(--esp-16);
		right: var(--esp-16);
	}
	.gran .dirècte {
		top: var(--esp-32);
		right: var(--esp-32);
	}
	.ecran-ligam {
		color: inherit;
		text-decoration: none;
	}
	.ecran-ligam::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	.nom {
		font-family: var(--font-heading);
		font-size: clamp(1.25rem, 1.9vw, 1.7rem);
		line-height: 1.05;
		text-transform: uppercase;
	}
	.gran .nom {
		font-size: clamp(2.6rem, 6vw, 5rem);
	}
	.tèxt {
		max-width: 34ch;
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.4;
	}
	.gran .tèxt {
		font-size: clamp(1.05rem, 1.4vw, 1.3rem);
	}
	.pè {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		width: 100%;
		margin-top: auto;
	}
	.luòc {
		font-size: 0.85rem;
		font-weight: 700;
	}
	.gran .jogar {
		width: 5rem;
		height: 5rem;
	}
	.ecran:hover,
	.ecran:focus-within {
		transform: translateY(-4px);
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12), 0 14px 30px -12px rgba(0, 0, 0, 0.5);
	}
	.ecran:hover .jogar,
	.ecran:focus-within .jogar {
		transform: scale(1.12);
	}
	.ecran-ligam:focus-visible {
		outline: none;
	}
	.ecran:has(.ecran-ligam:focus-visible) {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}

	/* ---------- B. Le téléviseur ---------- */
	.televisor {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 15rem;
		gap: var(--esp-24);
		padding: var(--esp-24);
		border-radius: 28px;
		background: linear-gradient(160deg, #f2c368, #c8932c 60%, #aa7d26);
		color: #2a1a10;
		box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.6);
	}
	.tv-ecran {
		position: relative;
		aspect-ratio: 16 / 10;
		border-radius: 18px;
		background:
			radial-gradient(ellipse 90% 80% at 35% 25%, rgba(238, 175, 52, 0.16), transparent 65%),
			repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 3px),
			#1d120b;
		color: #fbf1e1;
		box-shadow: inset 0 0 0 4px rgba(0, 0, 0, 0.35), inset 0 0 60px rgba(0, 0, 0, 0.6);
		overflow: hidden;
		container-type: inline-size;
	}
	.tv-contengut {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--esp-12);
		height: 100%;
		padding: clamp(1.2rem, 4cqi, 3rem);
	}
	.tv-num {
		font-family: var(--font-heading);
		font-size: 1.6rem;
		color: #eeaf34;
	}
	.tv-contengut .sorta {
		color: #f2c368;
	}
	.tv-nom {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 7cqi, 5.5rem);
		line-height: 1;
		text-transform: uppercase;
	}
	.tv-contengut .tèxt {
		font-size: clamp(1rem, 1.5vw, 1.3rem);
		color: rgba(251, 241, 225, 0.85);
	}
	.tv-accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--esp-12);
		margin-top: auto;
	}
	.veire {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.6rem 1.3rem;
		border-radius: 999px;
		background: #b53d17;
		color: #fbf1e1;
		font-weight: 700;
		text-decoration: none;
	}
	.veire:hover {
		background: #c9471d;
	}
	/* la neige du changement de chaîne, un tiers de seconde */
	.neu {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			repeating-linear-gradient(0deg, rgba(251, 241, 225, 0.5) 0 2px, transparent 2px 5px),
			repeating-linear-gradient(90deg, rgba(42, 26, 16, 0.6) 0 3px, transparent 3px 7px),
			#6b5a48;
		animation: neu 0.35s steps(6) forwards;
	}
	@keyframes neu {
		0% { opacity: 1; background-position: 0 0, 0 0; }
		100% { opacity: 0; background-position: 0 40px, 30px 0; }
	}
	.tv-comandas {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-content: center;
		gap: var(--esp-16) var(--esp-12);
		padding: var(--esp-16);
		border-radius: 18px;
		background: rgba(42, 26, 16, 0.12);
	}
	.tv-boton {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
	.tv-boton-num {
		display: grid;
		place-items: center;
		width: 3.2rem;
		height: 3.2rem;
		border-radius: 50%;
		background: #2a1a10;
		color: #f2c368;
		font-family: var(--font-heading);
		font-size: 1.4rem;
		box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
		transition: transform 0.12s, box-shadow 0.12s, background 0.2s;
	}
	.tv-boton:active .tv-boton-num {
		transform: translateY(3px);
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
	}
	.tv-boton[aria-pressed='true'] .tv-boton-num {
		background: #b53d17;
		color: #fbf1e1;
	}
	.tv-boton-nom {
		font-size: 0.8rem;
		font-weight: 700;
		text-align: center;
		line-height: 1.2;
	}
	.tv-boton:focus-visible {
		outline: none;
	}
	.tv-boton:focus-visible .tv-boton-num {
		outline: 3px solid #2a1a10;
		outline-offset: 3px;
	}

	/* ---------- C. La carte ---------- */
	.carta {
		position: relative;
		width: 100%;
	}
	.carta svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.carta path {
		opacity: 0.9;
	}
	.punt {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transform: translate(-0.75rem, -50%);
		color: #2a1a10;
		text-decoration: none;
	}
	.punt.esquèrra {
		flex-direction: row-reverse;
		transform: translate(calc(-100% + 0.75rem), -50%);
	}
	.punt-rond {
		position: relative;
		flex: 0 0 auto;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: #b53d17;
		box-shadow: 0 0 0 3px #fbf1e1;
	}
	.punt-nom {
		padding: 0.2rem 0.55rem;
		border-radius: 4px;
		background: rgba(251, 241, 225, 0.92);
		font-family: var(--font-heading);
		font-size: clamp(0.8rem, 1.4vw, 1.05rem);
		text-transform: uppercase;
		white-space: nowrap;
	}
	/* au survol, la fiche de la chaîne sous son nom */
	.punt-fica {
		position: absolute;
		top: calc(100% + 0.4rem);
		left: 2rem;
		z-index: 3;
		width: 16rem;
		padding: 0.6rem 0.8rem;
		border-radius: 6px;
		background: #2a1a10;
		color: #fbf1e1;
		font-size: 0.9rem;
		line-height: 1.4;
		opacity: 0;
		transform: translateY(-4px);
		pointer-events: none;
		transition: opacity 0.2s, transform 0.2s;
	}
	.punt.esquèrra .punt-fica {
		left: auto;
		right: 2rem;
	}
	.punt-fica b {
		display: block;
		color: #eeaf34;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.punt:hover,
	.punt:focus-visible {
		z-index: 4;
	}
	.punt:hover .punt-nom,
	.punt:focus-visible .punt-nom {
		background: #2a1a10;
		color: #eeaf34;
	}
	.punt:hover .punt-fica,
	.punt:focus-visible .punt-fica {
		opacity: 1;
		transform: none;
	}
	.punt:focus-visible {
		outline: none;
	}
	.punt:focus-visible .punt-nom {
		outline: 2px solid var(--t-tinta);
		outline-offset: 2px;
	}
	.carta-lista {
		display: none;
		margin: var(--esp-16) 0 0;
		padding: 0;
		list-style: none;
	}
	.carta-lista a {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.65rem 0;
		border-bottom: 1px solid var(--t-linha);
		color: inherit;
		text-decoration: none;
	}
	.carta-lista b {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.05rem;
		text-transform: uppercase;
	}
	.lista-tèxt {
		display: block;
		color: var(--t-tinta-2);
		font-size: 0.85rem;
	}
	.carta-lista :global(svg:last-child) {
		margin-left: auto;
	}
	.carta-lista .punt-rond {
		width: 0.9rem;
		height: 0.9rem;
		box-shadow: none;
	}

	/* téléphone */
	@container tele (max-width: 640px) {
		.mur {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--esp-8);
		}
		.ecran {
			aspect-ratio: auto;
			min-height: 9.5rem;
			padding: var(--esp-12);
		}
		.ecran.gran {
			grid-row: auto;
			aspect-ratio: 16 / 11;
			padding: var(--esp-24);
		}
		.ecran:not(.gran) .tèxt {
			display: none;
		}
		/* la dernière, seule sur sa ligne, prend toute la largeur */
		.ecran:not(.gran):last-child:nth-child(even) {
			grid-column: span 2;
		}
		.ecran:not(.gran) .dirècte {
			top: var(--esp-12);
			right: var(--esp-12);
		}
		.nom {
			font-size: 1.2rem;
		}
		.jogar {
			width: 2.2rem;
			height: 2.2rem;
		}
		.gran .jogar {
			width: 3.4rem;
			height: 3.4rem;
		}
		.televisor {
			grid-template-columns: 1fr;
			padding: var(--esp-12);
			border-radius: 20px;
		}
		.tv-ecran {
			aspect-ratio: auto;
			min-height: 19rem;
		}
		.tv-comandas {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.punt-nom,
		.punt-fica {
			display: none;
		}
		.carta-lista {
			display: block;
		}
		.punt-rond {
			width: 1.1rem;
			height: 1.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ecran,
		.jogar,
		.neu,
		.lum {
			animation: none;
			transition: none;
		}
		.neu {
			display: none;
		}
	}
	:global(html[data-leugier='on']) .ecran,
	:global(html[data-leugier='on']) .lum {
		animation: none;
	}
	:global(html[data-leugier='on']) .neu {
		display: none;
	}
</style>
