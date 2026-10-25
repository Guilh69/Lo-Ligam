<script>
	// Page d'essai des radios (2026-10-25, Romain : « pas comme ça… va
	// t'inspirer sur des sites qui recensent différentes radios »). Trois
	// présentations à comparer, dans la direction du site et les ors de
	// Mèdias : A les cases (comme des touches de présélection), B le cadran
	// d'un poste (l'aiguille va sur la station), C la carte (un point par
	// radio, comme Radio Garden). Le direct se joue dans la page, seulement au
	// clic, avec l'avis écrit à côté ; « Arrestar » coupe le flux (rien ne se
	// télécharge en fond). Un bandeau en bas dit ce qui joue (comme Online
	// Radio Box).
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import { PALETAS } from '$lib/apren/teulas.js';
	import { RADIOS } from '$lib/ensag/maqueta.js';
	import { DIALECTES, LARG, NAUT, proj } from '$lib/ensag/carta-dialectes.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let fr = $derived(langStore.current === 'fr');
	const t = {
		oc: {
			titol: 'Ràdios',
			frasa: 'Las ràdios en occitan, en dirècte.',
			avís: 'En escotant, la ràdio recebrà ton adreça IP.',
			escotar: 'Escotar',
			arrestar: 'Arrestar',
			dirècte: 'En dirècte',
			site: 'Son site',
			sus: 'Sus son site'
		},
		fr: {
			titol: 'Radios',
			frasa: 'Les radios en occitan, en direct.',
			avís: 'En écoutant, la radio recevra ton adresse IP.',
			escotar: 'Écouter',
			arrestar: 'Arrêter',
			dirècte: 'En direct',
			site: 'Son site',
			sus: 'Sur son site'
		}
	};
	let tx = $derived(t[fr ? 'fr' : 'oc']);

	const VISTAS = [
		['teulas', 'A. Les cases'],
		['cadran', 'B. Le cadran'],
		['carta', 'C. La carte']
	];
	let vista = $state('teulas');

	const AUR = PALETAS.aur;
	const color = (i) => AUR[i % AUR.length];
	const pos = RADIOS.map((r) => proj(r.lon, r.lat));

	let son;
	let actiu = $state(null);
	let jòga = $state(false);
	let cargant = $state(false);
	let error = $state(false);
	const radio = $derived(RADIOS.find((r) => r.id === actiu));

	function jogar(r) {
		if (!r.flux) return;
		if (actiu === r.id && (jòga || cargant)) return arrestar();
		actiu = r.id;
		error = false;
		cargant = true;
		son.src = r.flux;
		son.play().catch(() => {
			cargant = false;
			error = true;
		});
	}
	function arrestar() {
		son.pause();
		son.removeAttribute('src');
		son.load();
		jòga = cargant = false;
		actiu = null;
	}
	// l'aiguille du cadran : la place de la station sur la bande
	const plaça = (i) => 13 + (i * 74) / (RADIOS.length - 1);
	const aguilha = $derived(actiu ? plaça(RADIOS.findIndex((r) => r.id === actiu)) : 2);
</script>

<svelte:head>
	<title>Ràdios (maqueta) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- svelte-ignore a11y_media_has_caption -->
<audio
	bind:this={son}
	preload="none"
	onplaying={() => ((jòga = true), (cargant = false))}
	onwaiting={() => (cargant = true)}
	onpause={() => (jòga = false)}
	onerror={() => actiu && ((error = true), (cargant = false), (jòga = false))}
></audio>

{#snippet onda()}<span class="onda" aria-hidden="true"><i></i><i></i><i></i><i></i></span>{/snippet}

<div class="pagina" class:amb-banda={actiu}>
<div class="capçal"><AppHeader /></div>

<main class="radios">
	<nav class="camin" aria-label={fr ? 'Fil d’Ariane' : 'Camin'}>
		<a href="/ensag/parla">{fr ? 'Se parle' : 'Se parla'}</a><span aria-hidden="true">›</span>
		<a href="/ensag/medias">{fr ? 'Médias' : 'Mèdias'}</a><span aria-hidden="true">›</span>
		<span aria-current="page">{tx.titol}</span>
	</nav>

	<header class="cap">
		<h1 lang={fr ? 'fr' : 'oc'}>{tx.titol}</h1>
		<p class="frasa" lang={fr ? 'fr' : 'oc'}>{tx.frasa}</p>
		<p class="avís" lang={fr ? 'fr' : 'oc'}><Icona nom="son" size="1.1em" /> {tx.avís}</p>
	</header>

	<div class="vistas" role="group" aria-label="Présentation">
		{#each VISTAS as [v, nom] (v)}
			<button type="button" aria-pressed={vista === v} onclick={() => (vista = v)}>{nom}</button>
		{/each}
	</div>

	{#if vista === 'teulas'}
		<!-- A. Les cases : une touche de présélection par radio -->
		<ul class="teulas">
			{#each RADIOS as r, i (r.id)}
				{@const [fons, tinta] = color(i)}
				<li class="teula" class:actiu={actiu === r.id} style:--fons={fons} style:--tinta={tinta}>
					{#if r.flux}
						<button type="button" class="teula-boton" onclick={() => jogar(r)} aria-pressed={actiu === r.id}>
							<span class="num">{String(i + 1).padStart(2, '0')}</span>
							<span class="nom" lang="oc">{r.nom}</span>
							<span class="teula-accion">
								{#if actiu === r.id && jòga}{@render onda()} {tx.dirècte}{:else if actiu === r.id && cargant}…{:else}<Icona nom="lire" size="1em" /> {tx.escotar}{/if}
							</span>
						</button>
					{:else}
						<a class="teula-boton" href={r.site} target="_blank" rel="noopener noreferrer">
							<span class="num">{String(i + 1).padStart(2, '0')}</span>
							<span class="nom" lang="oc">{r.nom}</span>
							<span class="teula-accion">{tx.sus} <Icona nom="extern" size="0.95em" /></span>
						</a>
					{/if}
					<span class="picto-plaça"><Pictograma nom="medias" size="2.8rem" /></span>
				</li>
			{/each}
		</ul>
	{:else if vista === 'cadran'}
		<!-- B. Le cadran : la bande des stations, l'aiguille, le haut-parleur -->
		<div class="pòste">
			<div class="banda">
				<span class="aguilha" style:left="{aguilha}%" aria-hidden="true"></span>
				{#each RADIOS as r, i (r.id)}
					{#if r.flux}
						<button type="button" class="estacion" class:actiu={actiu === r.id} style:left="{plaça(i)}%" onclick={() => jogar(r)} aria-pressed={actiu === r.id}>
							<span lang="oc">{r.nom}</span>
						</button>
					{:else}
						<a class="estacion defòra" style:left="{plaça(i)}%" href={r.site} target="_blank" rel="noopener noreferrer">
							<span lang="oc">{r.nom}</span> <Icona nom="extern" size="0.9em" />
						</a>
					{/if}
				{/each}
			</div>
			<div class="pòste-bas">
				<span class="grasilha" aria-hidden="true"></span>
				<div class="pòste-ecran">
					{#if radio}
						<span class="ecran-dirècte">{#if jòga}{@render onda()}{/if} {jòga ? tx.dirècte : '…'}</span>
						<strong lang="oc">{radio.nom}</strong>
					{:else}
						<span class="ecran-dirècte">{tx.escotar}</span>
						<strong>— · —</strong>
					{/if}
				</div>
				<button type="button" class="boton-redond" onclick={() => (actiu ? arrestar() : jogar(RADIOS[0]))} aria-label={actiu ? tx.arrestar : tx.escotar}>
					<Icona nom={actiu ? 'pause' : 'lire'} size="1.6em" />
				</button>
			</div>
		</div>
	{:else}
		<!-- C. La carte : les dialectes en aplats d'or, un point par radio -->
		<div class="carta" style:aspect-ratio="{LARG} / {NAUT}">
			<svg viewBox="0 0 {LARG} {NAUT}" aria-hidden="true">
				{#each DIALECTES as d, i (d.id)}
					<path d={d.d} fill={AUR[i % AUR.length][0]} />
				{/each}
			</svg>
			{#each RADIOS as r, i (r.id)}
				{@const [x, y] = pos[i]}
				{#if r.flux}
					<button type="button" class="punt" class:actiu={actiu === r.id} class:esquèrra={x > 800} style:left="{x / 10}%" style:top="{(y / NAUT) * 100}%" onclick={() => jogar(r)} aria-pressed={actiu === r.id}>
						<span class="punt-rond" aria-hidden="true"></span>
						<span class="punt-nom" lang="oc">{r.nom}</span>
					</button>
				{:else}
					<a class="punt defòra" class:esquèrra={x > 800} style:left="{x / 10}%" style:top="{(y / NAUT) * 100}%" href={r.site} target="_blank" rel="noopener noreferrer">
						<span class="punt-rond" aria-hidden="true"></span>
						<span class="punt-nom" lang="oc">{r.nom} <Icona nom="extern" size="0.85em" /></span>
					</a>
				{/if}
			{/each}
		</div>
		<!-- téléphone : les noms ne tiennent pas sur la carte, on les liste dessous -->
		<ul class="carta-lista">
			{#each RADIOS as r (r.id)}
				<li>
					{#if r.flux}
						<button type="button" class:actiu={actiu === r.id} onclick={() => jogar(r)} aria-pressed={actiu === r.id}>
							<span class="punt-rond" aria-hidden="true"></span><span lang="oc">{r.nom}</span>
						</button>
					{:else}
						<a href={r.site} target="_blank" rel="noopener noreferrer"><span class="punt-rond" aria-hidden="true"></span><span lang="oc">{r.nom}</span> <Icona nom="extern" size="0.9em" /></a>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>

{#if actiu}
	<!-- le bandeau : ce qui joue, où le retrouver, et l'arrêt -->
	<div class="banda-bas" role="status">
		<span class="bb-dirècte">{#if jòga}{@render onda()}{/if} {error ? '✕' : jòga ? tx.dirècte : '…'}</span>
		<strong class="bb-nom" lang="oc">{radio.nom}</strong>
		<a class="bb-site" href={radio.site} target="_blank" rel="noopener noreferrer">{tx.site} <Icona nom="extern" size="0.95em" /></a>
		<button type="button" class="bb-arrestar" onclick={arrestar}><Icona nom="pause" size="1em" /> {tx.arrestar}</button>
	</div>
{/if}
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
	.pagina.amb-banda {
		padding-bottom: 5rem;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.radios {
		container: radios / inline-size;
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
		font-size: clamp(3.2rem, 11vw, 8rem);
		line-height: 0.95;
	}
	.frasa {
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		color: var(--t-tinta-2);
	}
	.avís {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin: var(--esp-12) 0 0;
		color: var(--t-tinta-2);
		font-size: 0.95rem;
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

	/* l'onde qui bat pendant le direct */
	.onda {
		display: inline-flex;
		align-items: flex-end;
		gap: 2px;
		height: 0.9em;
	}
	.onda i {
		width: 3px;
		height: 100%;
		background: currentColor;
		animation: batre 0.9s ease-in-out infinite;
	}
	.onda i:nth-child(2) {
		animation-delay: -0.3s;
	}
	.onda i:nth-child(3) {
		animation-delay: -0.6s;
	}
	.onda i:nth-child(4) {
		animation-delay: -0.15s;
	}
	@keyframes batre {
		0%, 100% { transform: scaleY(0.3); }
		50% { transform: scaleY(1); }
	}
	.onda i {
		transform-origin: bottom;
	}

	/* ---------- A. Les cases ---------- */
	.teulas {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.teula {
		position: relative;
		aspect-ratio: 1;
		border-radius: 4px;
		background: var(--fons);
		color: var(--tinta);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}
	.teula:hover {
		transform: translateY(-3px);
	}
	.teula.actiu {
		box-shadow: 0 0 0 4px var(--t-fons), 0 0 0 7px var(--t-terra);
	}
	.teula-boton {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: clamp(0.9rem, 1.8vw, 1.4rem);
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
		text-align: left;
		text-decoration: none;
		cursor: pointer;
	}
	.teula-boton:focus-visible {
		outline: 3px solid var(--t-tinta);
		outline-offset: 3px;
	}
	.num {
		font-family: var(--font-heading);
		font-size: 2.4rem;
		line-height: 1;
	}
	.nom {
		margin-top: 0.4rem;
		font-family: var(--font-heading);
		font-size: clamp(1.15rem, 1.8vw, 1.5rem);
		line-height: 1.1;
		text-transform: uppercase;
	}
	.teula-accion {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.7rem;
		font-weight: 700;
	}
	.picto-plaça {
		position: absolute;
		right: clamp(0.9rem, 1.8vw, 1.4rem);
		bottom: clamp(0.9rem, 1.8vw, 1.4rem);
		pointer-events: none;
	}

	/* ---------- B. Le cadran ---------- */
	.pòste {
		padding: clamp(1rem, 3vw, 2rem);
		border-radius: 18px;
		background: var(--t-fons-2);
		border: 1px solid var(--t-linha);
	}
	.banda {
		position: relative;
		height: clamp(9rem, 18vw, 12rem);
		border-radius: 8px;
		background:
			repeating-linear-gradient(90deg, rgba(42, 26, 16, 0.55) 0 2px, transparent 2px 2%) 0 0 / 100% 22% no-repeat,
			repeating-linear-gradient(90deg, rgba(42, 26, 16, 0.35) 0 1px, transparent 1px 1%) 0 0 / 100% 12% no-repeat,
			#eeaf34;
		overflow: hidden;
	}
	.aguilha {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 4px;
		margin-left: -2px;
		background: #b53d17;
		box-shadow: 0 0 12px rgba(181, 61, 23, 0.6);
		transition: left 0.7s cubic-bezier(0.3, 1.3, 0.5, 1);
	}
	.estacion {
		position: absolute;
		top: 44%;
		transform: translate(-50%, -50%);
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.3rem 0.5rem;
		border: 0;
		border-radius: 4px;
		background: none;
		color: #2a1a10;
		font-family: var(--font-heading);
		font-size: clamp(0.85rem, 1.5vw, 1.15rem);
		text-transform: uppercase;
		white-space: nowrap;
		text-decoration: none;
		cursor: pointer;
	}
	.estacion:nth-of-type(even) {
		top: 76%;
	}
	/* un trait relie chaque nom à sa place sur la graduation */
	.estacion::before {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 100%;
		width: 2px;
		height: 1.2rem;
		background: rgba(42, 26, 16, 0.55);
	}
	.estacion:nth-of-type(even)::before {
		height: 4.4rem;
	}
	.estacion:hover,
	.estacion.actiu {
		background: #2a1a10;
		color: #eeaf34;
	}
	.estacion:focus-visible {
		outline: 2px solid #2a1a10;
		outline-offset: 2px;
	}
	.pòste-bas {
		display: flex;
		align-items: center;
		gap: clamp(1rem, 3vw, 2rem);
		margin-top: clamp(1rem, 3vw, 1.6rem);
	}
	.grasilha {
		flex: 1 1 40%;
		height: 6rem;
		border-radius: 10px;
		background: radial-gradient(circle, color-mix(in srgb, var(--t-tinta) 30%, transparent) 2px, transparent 2.5px) 0 0 / 12px 12px;
	}
	.pòste-ecran {
		flex: 1 1 40%;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.ecran-dirècte {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--t-aur);
		font-weight: 700;
		text-transform: uppercase;
		font-size: 0.85rem;
		letter-spacing: 0.08em;
	}
	.pòste-ecran strong {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.4rem, 3vw, 2.2rem);
	}
	.boton-redond {
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 4.5rem;
		height: 4.5rem;
		border: 0;
		border-radius: 50%;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		cursor: pointer;
		box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.7);
	}
	.boton-redond:hover {
		background: var(--t-accion-viu);
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
		padding: 0;
		border: 0;
		background: none;
		color: #2a1a10;
		font: inherit;
		text-decoration: none;
		cursor: pointer;
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
	.punt.actiu .punt-rond::after {
		content: '';
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		border: 3px solid #b53d17;
		animation: espandir 1.4s ease-out infinite;
	}
	@keyframes espandir {
		from { transform: scale(1); opacity: 1; }
		to { transform: scale(2.6); opacity: 0; }
	}
	.punt-nom {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.2rem 0.55rem;
		border-radius: 4px;
		background: rgba(251, 241, 225, 0.92);
		font-family: var(--font-heading);
		font-size: clamp(0.8rem, 1.4vw, 1.05rem);
		text-transform: uppercase;
		white-space: nowrap;
	}
	.punt:hover .punt-nom,
	.punt.actiu .punt-nom {
		background: #2a1a10;
		color: #eeaf34;
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
	.carta-lista button,
	.carta-lista a {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		padding: 0.65rem 0;
		border: 0;
		border-bottom: 1px solid var(--t-linha);
		background: none;
		color: inherit;
		font-family: var(--font-heading);
		font-size: 1.1rem;
		text-transform: uppercase;
		text-align: left;
		text-decoration: none;
		cursor: pointer;
	}
	.carta-lista .punt-rond {
		width: 0.9rem;
		height: 0.9rem;
		box-shadow: none;
	}
	.carta-lista .actiu {
		color: var(--t-aur);
	}

	/* ---------- le bandeau du direct ---------- */
	.banda-bas {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: clamp(0.6rem, 2vw, 1.4rem);
		padding: 0.8rem var(--marge);
		background: #eeaf34;
		color: #2a1a10;
		box-shadow: 0 -10px 30px -12px rgba(0, 0, 0, 0.6);
	}
	.bb-dirècte {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-weight: 700;
		text-transform: uppercase;
		font-size: 0.85rem;
		letter-spacing: 0.06em;
	}
	.bb-nom {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.3rem;
		margin-right: auto;
	}
	.bb-site {
		color: inherit;
		font-weight: 700;
	}
	.bb-arrestar {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		border: 0;
		border-radius: 999px;
		background: #b53d17;
		color: #fbf1e1;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}

	/* téléphone */
	@container radios (max-width: 640px) {
		.teulas {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.num {
			font-size: 1.8rem;
		}
		/* le cadran en colonne : une station par ligne, la station jouée en noir */
		.banda {
			height: auto;
			display: flex;
			flex-direction: column;
			padding: 1.6rem 0.8rem 0.8rem;
			background-size: 100% 1rem, 100% 0.6rem, auto;
		}
		.aguilha,
		.estacion::before {
			display: none;
		}
		.estacion,
		.estacion:nth-of-type(even) {
			position: static;
			transform: none;
			justify-content: flex-start;
			padding: 0.55rem 0.6rem;
			font-size: 1rem;
		}
		.grasilha {
			display: none;
		}
		.punt-nom {
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
		.onda i,
		.punt.actiu .punt-rond::after {
			animation: none;
		}
		.aguilha,
		.teula {
			transition: none;
		}
	}
	:global(html[data-leugier='on']) .onda i,
	:global(html[data-leugier='on']) .punt.actiu .punt-rond::after {
		animation: none;
	}
</style>
