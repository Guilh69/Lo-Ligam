<script>
	// Essai des gabarits d'exercice, lot 1 (Romain, 2026-11-17 : « l'interface de
	// chaque exercice dans ma charte, déclinée par typologie ; ce sont des
	// exemples, pas une limitation »). Cinq écrans dans un cadre de téléphone,
	// vivants, avec la matière du module 1.1. Ils serviront à l'aperçu de
	// l'atelier Bastir, puis au moteur des leçons.
	// Deuxième version (même jour, « pas très fidèle à ma DA, assez générique ») :
	// les écrans parlent la langue du site (pièces de papier, grand chiffre en
	// Limelight, grains de progression, photo à coins de 22 px). Deux têtes à
	// comparer, sans recharger : « Papièr » (tête sur le fond de la page) et
	// « Teula » (tête en aplat, à la couleur de l'unité).
	import { onMount, setContext } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import EscotarRepetir from '$lib/gabarits/EscotarRepetir.svelte';
	import DialogBulles from '$lib/gabarits/DialogBulles.svelte';
	import DialogTraucs from '$lib/gabarits/DialogTraucs.svelte';
	import VertatFals from '$lib/gabarits/VertatFals.svelte';
	import CausidaMultipla from '$lib/gabarits/CausidaMultipla.svelte';
	import { SON_EXEMPLE, FOTO_EXEMPLE, PERSONATGES, ESCOTAR, DIALÒG, TRAUCS, VERTAT_FALS, CAUSIDA } from '$lib/gabarits/exemples.js';

	const ECRANS = [
		{ id: 'escotar', nom: 'Écouter et répéter' },
		{ id: 'bulles', nom: 'Dialogue en bulles' },
		{ id: 'traucs', nom: 'Dialogue à trous' },
		{ id: 'vertat', nom: 'Vrai ou faux' },
		{ id: 'causida', nom: 'Choix multiple' }
	];
	// un tour de plus : l'écran repart de zéro (« Contunhar » ou « recommencer »)
	let torns = $state(Object.fromEntries(ECRANS.map((e) => [e.id, 0])));
	const tornar = (id) => () => (torns[id] += 1);

	// la leçon qui porte les écrans : la tête à l'essai et l'unité (sa couleur)
	const TÈSTAS = [
		{ id: 'papièr', nom: 'Papièr' },
		{ id: 'teula', nom: 'Teula' }
	];
	const UNITATS = [1, 2, 3, 4, 5, 6, 7, 8];
	const CLAU = 'lo-ligam-ensag-gabarits';
	let cap = $state('papièr');
	let unitat = $state(1);
	setContext('gabarit', {
		get cap() {
			return cap;
		},
		get unitat() {
			return unitat;
		},
		get leiçon() {
			return `${unitat}.1`;
		},
		total: 5
	});

	onMount(() => {
		try {
			const m = JSON.parse(localStorage.getItem(CLAU) ?? 'null');
			if (TÈSTAS.some((t) => t.id === m?.cap)) cap = m.cap;
			if (UNITATS.includes(m?.unitat)) unitat = m.unitat;
		} catch {
			// pas de mémoire du navigateur : l'essai marche sans
		}
	});
	function causir(c, u = unitat) {
		cap = c;
		unitat = u;
		try {
			localStorage.setItem(CLAU, JSON.stringify({ cap, unitat }));
		} catch {
			// idem
		}
	}
</script>

<svelte:head>
	<title>Gabarits d’exercici · essai · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="pagina">
	<div class="capçal"><AppHeader /></div>
	<main>
		<header class="cap">
			<h1><span lang="oc">Gabarits d’exercici</span></h1>
			<p class="frasa">
				Lot 1, deuxième version : les cinq mêmes écrans, avec les pièces de papier du site. Deux têtes à comparer, en bas de la page. Touche-les, ils marchent. La
				matière vient du module 1.1.
			</p>
		</header>

		<ol class="ecrans">
			{#each ECRANS as e, i (e.id)}
				<li>
					<p class="nom"><b>{String(i + 1).padStart(2, '0')}</b> {e.nom}</p>
					<div class="telefon">
						{#key torns[e.id]}
							{#if e.id === 'escotar'}
								<EscotarRepetir foto={FOTO_EXEMPLE} frasa={ESCOTAR} son={SON_EXEMPLE} oncontunhar={tornar(e.id)} />
							{:else if e.id === 'bulles'}
								<DialogBulles replicas={DIALÒG} personatges={PERSONATGES} son={SON_EXEMPLE} oncontunhar={tornar(e.id)} />
							{:else if e.id === 'traucs'}
								<DialogTraucs {...TRAUCS} personatges={PERSONATGES} son={SON_EXEMPLE} oncontunhar={tornar(e.id)} />
							{:else if e.id === 'vertat'}
								<VertatFals foto={FOTO_EXEMPLE} {...VERTAT_FALS} oncontunhar={tornar(e.id)} />
							{:else}
								<CausidaMultipla {...CAUSIDA} oncontunhar={tornar(e.id)} />
							{/if}
						{/key}
					</div>
					<button type="button" class="recomençar" onclick={tornar(e.id)}>recommencer</button>
				</li>
			{/each}
		</ol>
	</main>

	<!-- L'outil d'essai, neutre exprès : il ne fait pas partie de l'interface. -->
	<div class="ensags">
		{#if cap === 'teula'}
			<div class="ensag unitats" role="group" aria-label="Unité (la couleur de la tête)">
				<span class="et">Unité</span>
				{#each UNITATS as u (u)}
					<button type="button" aria-pressed={unitat === u} onclick={() => causir(cap, u)}>{u}</button>
				{/each}
			</div>
		{/if}
		<div class="ensag" role="group" aria-label="Tête de l’écran">
			<span class="et">Tête</span>
			{#each TÈSTAS as t (t.id)}
				<button type="button" aria-pressed={cap === t.id} onclick={() => causir(t.id)}><span lang="oc">{t.nom}</span></button>
			{/each}
		</div>
	</div>
</div>

<style>
	.pagina {
		--marge: clamp(1rem, 4vw, 3rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background: var(--t-fons);
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	main {
		max-width: 112rem;
		margin: 0 auto;
		padding: 1rem var(--marge) 9rem;
	}
	.cap {
		margin-bottom: 2rem;
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.2rem, 5vw, 3.6rem);
		line-height: 1;
	}
	.frasa {
		max-width: 52ch;
		margin: 0.75rem 0 0;
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.ecrans {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		gap: 2.5rem 1.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.nom {
		margin: 0 0 0.6rem;
		font-size: 1.05rem;
	}
	.nom b {
		font-family: var(--font-heading);
		font-weight: 400;
		color: var(--t-aur-gros);
	}
	.telefon {
		width: min(100%, 22rem);
		height: 44rem;
		overflow: hidden;
		border: 1px solid var(--t-linha);
		border-radius: 22px;
	}
	.recomençar {
		margin-top: 0.5rem;
		padding: 0.25rem 0;
		border: 0;
		background: none;
		color: var(--t-tinta-2);
		font: inherit;
		font-size: 0.9rem;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}
	.recomençar:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	/* les deux réglettes des essais, mêmes que celles de /apren : blanc et noir,
	   hors palette, pour ne pas se confondre avec les écrans à juger */
	.ensags {
		position: fixed;
		left: 50%;
		bottom: 1rem;
		z-index: 2000;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		max-width: calc(100vw - 1rem);
	}
	/* sur téléphone, les réglettes restent au-dessus de la barre du bas du site */
	@media (max-width: 40rem) {
		.ensags {
			bottom: calc(4.9rem + env(safe-area-inset-bottom, 0px));
		}
	}
	.ensag {
		display: flex;
		align-items: center;
		gap: 3px;
		padding: 4px;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
		font:
			700 0.8rem/1 system-ui,
			sans-serif;
	}
	.ensag .et {
		padding: 0 0.35rem 0 0.7rem;
		color: #555555;
		font-weight: 400;
	}
	.ensag button {
		border: 0;
		border-radius: 999px;
		padding: 0.55rem 0.9rem;
		background: transparent;
		color: #222222;
		font: inherit;
		white-space: nowrap;
		cursor: pointer;
	}
	.ensag.unitats button {
		padding: 0.55rem 0.62rem;
	}
	.ensag button[aria-pressed='true'] {
		background: #222222;
		color: #ffffff;
	}
	.ensag button:focus-visible {
		outline: 2px solid #222222;
		outline-offset: 2px;
	}
</style>
