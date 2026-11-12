<script>
	// Page de la télévision (2026-10-25, Romain : « pour la télé,
	// pareil » que les radios). Trois présentations comparées (mur d'écrans,
	// téléviseur, carte) ; Romain a choisi le téléviseur : l'écran à gauche, la
	// télécommande à droite, on zappe de 1 à 6 avec un éclair de neige. Aucun
	// lecteur intégré : chaque chaîne mène à son site (rien ne se charge chez
	// un tiers sans clic). Données dans $lib/data/medias.js.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Retour from '$lib/components/Retour.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { TELES } from '$lib/data/medias.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

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
		},
		es: {
			titol: 'Televisión y vídeo',
			frasa: 'Los canales, los programas y los vídeos en occitano.',
			veire: 'Ver',
			dirècte: 'En directo',
			cadenas: 'Los canales'
		},
		en: {
			titol: 'Television and video',
			frasa: 'The channels, the programmes and the videos in Occitan.',
			veire: 'Watch',
			dirècte: 'Live',
			cadenas: 'The channels'
		},
		ca: {
			titol: 'Televisió i vídeo',
			frasa: 'Els canals, els programes i els vídeos en occità.',
			veire: 'Veure',
			dirècte: 'En directe',
			cadenas: 'Els canals'
		},
		ar: {
			titol: 'التلفزيون والفيديو',
			frasa: 'القنوات والبرامج ومقاطع الفيديو بالأوكسيتانية.',
			veire: 'مشاهدة',
			dirècte: 'بثّ مباشر',
			cadenas: 'القنوات'
		}
	};
	let tx = $derived(t[langStore.current] ?? t.oc);

	const num = (i) => String(i + 1).padStart(2, '0');
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
	<title>{tria({ oc: 'Television', fr: 'Télévision', es: 'Televisión', en: 'Television', ca: 'Televisió', ar: 'التلفزيون' })} · Lo Ligam</title>
</svelte:head>

{#snippet dirècte(e)}
	{#if e.dirècte}
		<a class="dirècte" href={e.dirècte} target="_blank" rel="noopener noreferrer"><span class="lum" aria-hidden="true"></span>{tx.dirècte}</a>
	{/if}
{/snippet}

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="tele">
	<Retour actuelle={tx.titol} />

	<header class="cap">
		<h1 lang={langStore.current}>{tx.titol}</h1>
		<p class="frasa" lang={langStore.current}>{tx.frasa}</p>
	</header>

	<!-- le téléviseur : l'écran à gauche, la télécommande à droite -->
	<div class="televisor">
		<div class="tv-ecran" aria-live="polite">
			{#key zap}
				<div class="tv-contengut">
					<span class="tv-num" aria-hidden="true">{num(causida)}</span>
					<span class="sorta" lang={langStore.current}>{tria(tele.sorta)} · {tria(tele.luòc)}</span>
					<strong class="tv-nom" lang="oc">{tele.nom}</strong>
					<p class="tèxt" lang={langStore.current}>{tria(tele.tèxt)}</p>
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
</main>
</div>

<style>
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, var(--t-braise), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, var(--t-braise-or), transparent 70%),
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

	/* le petit voyant rouge du direct (rouge du logo en aplat = clic) */
	.dirècte {
		position: relative;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		background: var(--t-accion);
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
	/* ---------- B. Le téléviseur ---------- */
	.televisor {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 15rem;
		gap: var(--esp-24);
		padding: var(--esp-24);
		border-radius: 28px;
		background: linear-gradient(160deg, #f2c368, #c8932c 60%, #aa7d26);
		color: var(--p-encre);
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
		color: var(--p-or);
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
		max-width: 34ch;
		margin: 0;
		line-height: 1.4;
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
		background: var(--t-accion);
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
		background: var(--p-encre);
		color: #f2c368;
		font-family: var(--font-heading);
		font-size: 1.4rem;
		/* une pièce de papier (ombre de lib/styles/papier.css) ; la chaîne
		   choisie reste rouge : l'or se perdrait sur le meuble doré */
		box-shadow: 0 3px 4px var(--pc-ombre);
		transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
	}
	.tv-boton:hover .tv-boton-num {
		transform: translateY(-1px);
		box-shadow: 0 5px 5px var(--pc-ombre);
	}
	.tv-boton:active .tv-boton-num {
		transform: translateY(2px);
		box-shadow: 0 1px 2px var(--pc-ombre);
	}
	.tv-boton[aria-pressed='true'] .tv-boton-num {
		background: var(--t-accion);
		color: var(--t-accion-tinta);
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
		outline: 3px solid var(--p-encre);
		outline-offset: 3px;
	}

	/* téléphone : l'écran au-dessus, la télécommande dessous */
	@container tele (max-width: 640px) {
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
	}

	@media (prefers-reduced-motion: reduce) {
		.lum {
			animation: none;
		}
		.neu {
			display: none;
		}
	}
	:global(html[data-leugier='on']) .lum {
		animation: none;
	}
	:global(html[data-leugier='on']) .neu {
		display: none;
	}
</style>
