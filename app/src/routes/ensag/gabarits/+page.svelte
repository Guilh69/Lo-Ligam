<script>
	// Essai des gabarits d'exercice, lot 1 (Romain, 2026-11-17 : « l'interface de
	// chaque exercice dans ma charte, déclinée par typologie ; ce sont des
	// exemples, pas une limitation »). Cinq écrans dans un cadre de téléphone,
	// vivants, avec la matière du module 1.1. Ils serviront à l'aperçu de
	// l'atelier Bastir, puis au moteur des leçons.
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
			<p class="frasa">Lot 1 : cinq écrans, un par type d’exercice, dans la charte. Touche-les, ils marchent. La matière vient du module 1.1.</p>
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
		padding: 1rem var(--marge) 5rem;
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
		max-width: 46ch;
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
		border-radius: 18px;
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
</style>
