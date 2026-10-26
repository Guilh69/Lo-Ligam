<script>
	// Page des radios (2026-10-25, Romain : « pas comme ça… va
	// t'inspirer sur des sites qui recensent différentes radios »). Trois
	// présentations comparées (cases, cadran, carte) ; Romain a choisi la
	// carte : les dialectes en aplats d'or, un point par radio (comme Radio
	// Garden). Le direct se joue dans la page, seulement au clic, avec l'avis
	// écrit à côté ; « Arrestar » coupe le flux (rien ne se télécharge en
	// fond). Un bandeau en bas dit ce qui joue (comme Online Radio Box).
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { PALETAS } from '$lib/apren/teulas.js';
	import { RADIOS } from '$lib/data/medias.js';
	import { DIALECTES, LARG, NAUT, proj } from '$lib/data/carta-dialectes.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

	const t = {
		oc: {
			titol: 'Ràdios',
			frasa: 'Las ràdios en occitan, en dirècte.',
			avís: 'En escotant, la ràdio recebrà ton adreça IP.',
			arrestar: 'Arrestar',
			dirècte: 'En dirècte',
			site: 'Son site'
		},
		fr: {
			titol: 'Radios',
			frasa: 'Les radios en occitan, en direct.',
			avís: 'En écoutant, la radio recevra ton adresse IP.',
			arrestar: 'Arrêter',
			dirècte: 'En direct',
			site: 'Son site'
		},
		es: {
			titol: 'Radios',
			frasa: 'Las radios en occitano, en directo.',
			avís: 'Mientras escuchas, la emisora recibirá tu dirección IP.',
			arrestar: 'Parar',
			dirècte: 'En directo',
			site: 'Su sitio web'
		},
		en: {
			titol: 'Radio stations',
			frasa: 'Radio stations in Occitan, live.',
			avís: 'While you listen, the radio station will receive your IP address.',
			arrestar: 'Stop',
			dirècte: 'Live',
			site: 'Its website'
		},
		ca: {
			titol: 'Ràdios',
			frasa: 'Les ràdios en occità, en directe.',
			avís: 'Mentre escoltes, la ràdio rebrà la teva adreça IP.',
			arrestar: 'Aturar',
			dirècte: 'En directe',
			site: 'El seu web'
		},
		ar: {
			titol: 'الإذاعات',
			frasa: 'الإذاعات الأوكسيتانية على الهواء مباشرةً.',
			avís: 'عند الاستماع، تطّلع الإذاعة على عنوان IP الخاص بك.',
			arrestar: 'إيقاف',
			dirècte: 'بثّ مباشر',
			site: 'موقعها'
		}
	};
	let tx = $derived(t[langStore.current] ?? t.oc);

	const AUR = PALETAS.aur;
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
</script>

<svelte:head>
	<title>{tx.titol} · Lo Ligam</title>
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
	<nav class="camin" aria-label={tria({ oc: 'Camin', fr: 'Fil d’Ariane', es: 'Ruta de navegación', en: 'Breadcrumb', ca: 'Camí de navegació', ar: 'مسار التنقّل' })}>
		<a href="/parla">{tria({ oc: 'Se parla', fr: 'Se parle', es: 'Se habla', en: 'Speak', ca: 'Es parla', ar: 'نتحدّث' })}</a><span aria-hidden="true">›</span>
		<a href="/medias">{tria({ oc: 'Mèdias', fr: 'Médias', es: 'Medios', en: 'Media', ca: 'Mitjans', ar: 'وسائل الإعلام' })}</a><span aria-hidden="true">›</span>
		<span aria-current="page">{tx.titol}</span>
	</nav>

	<header class="cap">
		<h1 lang={langStore.current}>{tx.titol}</h1>
		<p class="frasa" lang={langStore.current}>{tx.frasa}</p>
		<p class="avís" lang={langStore.current}><Icona nom="son" size="1.1em" /> {tx.avís}</p>
	</header>

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

	/* téléphone : les noms ne tiennent pas sur la carte, on les liste dessous */
	@container radios (max-width: 640px) {
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
	}
	:global(html[data-leugier='on']) .onda i,
	:global(html[data-leugier='on']) .punt.actiu .punt-rond::after {
		animation: none;
	}
</style>
