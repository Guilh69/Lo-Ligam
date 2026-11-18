<script>
	// Essai des gabarits d'exercice, lot 1 (Romain, 2026-11-17 : « l'interface de
	// chaque exercice dans ma charte, déclinée par typologie ; ce sont des
	// exemples, pas une limitation »). Cinq écrans dans un cadre de téléphone,
	// vivants, avec la matière du module 1.1. Ils serviront à l'aperçu de
	// l'atelier Bastir, puis au moteur des leçons.
	// Deuxième version (même jour, « pas très fidèle à ma DA, assez générique ») :
	// les écrans parlent la langue du site (pièces de papier, grand chiffre en
	// Limelight, grains de progression, photo à coins de 22 px). Deux têtes
	// étaient à comparer ; Romain a gardé « Teula » le 18-11 (tête en aplat, à la
	// couleur de l'unité). Reste une réglette : l'unité, pour voir les couleurs.
	// Lot 2 (18-11) : huit écrans de plus, dans le même cadre : remettre dans
	// l'ordre (mots, puis lettres), relier les paires, écrire la réponse, carte de
	// mot, texte à lire, bilan, audace.
	import { onMount, setContext } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import EscotarRepetir from '$lib/gabarits/EscotarRepetir.svelte';
	import DialogBulles from '$lib/gabarits/DialogBulles.svelte';
	import DialogTraucs from '$lib/gabarits/DialogTraucs.svelte';
	import VertatFals from '$lib/gabarits/VertatFals.svelte';
	import CausidaMultipla from '$lib/gabarits/CausidaMultipla.svelte';
	import RemetreOrdre from '$lib/gabarits/RemetreOrdre.svelte';
	import Parelhs from '$lib/gabarits/Parelhs.svelte';
	import Escriure from '$lib/gabarits/Escriure.svelte';
	import CartaMot from '$lib/gabarits/CartaMot.svelte';
	import TextLegir from '$lib/gabarits/TextLegir.svelte';
	import Bilanc from '$lib/gabarits/Bilanc.svelte';
	import Audacia from '$lib/gabarits/Audacia.svelte';
	import {
		SON_EXEMPLE,
		FOTO_EXEMPLE,
		PERSONATGES,
		ESCOTAR,
		DIALÒG,
		TRAUCS,
		VERTAT_FALS,
		CAUSIDA,
		ÒRDRE_MOTS,
		ÒRDRE_LETRAS,
		PARELHS,
		ESCRIURE,
		CARTA_MOT,
		TÈXT,
		BILANÇ,
		AUDÀCIA
	} from '$lib/gabarits/exemples.js';

	const ECRANS = [
		{ id: 'escotar', nom: 'Écouter et répéter' },
		{ id: 'bulles', nom: 'Dialogue en bulles' },
		{ id: 'traucs', nom: 'Dialogue à trous' },
		{ id: 'vertat', nom: 'Vrai ou faux' },
		{ id: 'causida', nom: 'Choix multiple' },
		{ id: 'mots', nom: 'Remettre dans l’ordre' },
		{ id: 'letras', nom: 'Lettres dans l’ordre' },
		{ id: 'parelhs', nom: 'Relier les paires' },
		{ id: 'escriure', nom: 'Écrire la réponse' },
		{ id: 'carta', nom: 'Carte de mot' },
		{ id: 'text', nom: 'Texte à lire' },
		{ id: 'bilanc', nom: 'Bilan' },
		{ id: 'audacia', nom: 'Audace' }
	];
	// un tour de plus : l'écran repart de zéro (« Contunhar » ou « recommencer »)
	let torns = $state(Object.fromEntries(ECRANS.map((e) => [e.id, 0])));
	const tornar = (id) => () => (torns[id] += 1);

	// la leçon qui porte les écrans : son unité donne la couleur de la tête
	const UNITATS = [1, 2, 3, 4, 5, 6, 7, 8];
	const CLAU = 'lo-ligam-ensag-gabarits';
	let unitat = $state(1);
	setContext('gabarit', {
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
			if (UNITATS.includes(m?.unitat)) unitat = m.unitat;
		} catch {
			// pas de mémoire du navigateur : l'essai marche sans
		}
	});
	function causir(u) {
		unitat = u;
		try {
			localStorage.setItem(CLAU, JSON.stringify({ unitat }));
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
				Lots 1 et 2 : treize écrans, un par type d’exercice, avec les pièces de papier du site et la tête à la couleur de l’unité. Change d’unité en bas de la page
				pour voir les autres couleurs. Touche-les, ils marchent. La matière vient du module 1.1.
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
							{:else if e.id === 'causida'}
								<CausidaMultipla {...CAUSIDA} oncontunhar={tornar(e.id)} />
							{:else if e.id === 'mots'}
								<RemetreOrdre {...ÒRDRE_MOTS} oncontunhar={tornar(e.id)} />
							{:else if e.id === 'letras'}
								<RemetreOrdre {...ÒRDRE_LETRAS} oncontunhar={tornar(e.id)} />
							{:else if e.id === 'parelhs'}
								<Parelhs parelhs={PARELHS} oncontunhar={tornar(e.id)} />
							{:else if e.id === 'escriure'}
								<Escriure {...ESCRIURE} oncontunhar={tornar(e.id)} />
							{:else if e.id === 'carta'}
								<CartaMot mot={CARTA_MOT} oncontunhar={tornar(e.id)} />
							{:else if e.id === 'text'}
								<TextLegir {...TÈXT} oncontunhar={tornar(e.id)} />
							{:else if e.id === 'bilanc'}
								<Bilanc {...BILANÇ} oncontunhar={tornar(e.id)} />
							{:else}
								<Audacia {...AUDÀCIA} oncontunhar={tornar(e.id)} />
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
		<div class="ensag unitats" role="group" aria-label="Unité (la couleur de la tête)">
			<span class="et">Unité</span>
			{#each UNITATS as u (u)}
				<button type="button" aria-pressed={unitat === u} onclick={() => causir(u)}>{u}</button>
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

	/* la réglette des essais, la même que celles de /apren : blanc et noir,
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
	/* sur téléphone, la réglette reste au-dessus de la barre du bas du site */
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
