<script>
	// Banc d'essai des récompenses animées (2026-10-12) : dessinées dans
	// EffectCraft, exportées en Lottie, lues par lottie-web (version légère, SVG).
	// Chaque vignette se rejoue au clic. Page de travail, pas indexée.
	import { onMount, onDestroy } from 'svelte';

	const LISTA = [
		{ id: 'a-coche', nom: 'A · Coche dorée', usage: 'Bonne réponse', ton: 'Sobre : un cercle or s’ouvre, la coche se dessine.', pes: '0,6 Ko' },
		{ id: 'b-eclat', nom: 'B · Éclat', usage: 'Bonne réponse', ton: 'Plus vif : la même coche, puis huit rayons or jaillissent.', pes: '0,7 Ko' },
		{ id: 'c-croix', nom: 'C · Croix qui s’allume', usage: 'Bonne réponse, série réussie', ton: 'Identitaire : la croix du logo se trace, les douze pommettes s’allument.', pes: '1,3 Ko' },
		{ id: 'd-fil', nom: 'D · Fil d’or', usage: 'Module terminé', ton: 'Le « lien » : un fil d’or dessine la croix branche par branche, puis un halo.', pes: '1,6 Ko' }
	];

	let fons = $state('nuech');
	let calm = false;
	const els = {};
	const anims = {};

	const jogar = (id) => {
		const a = anims[id];
		if (!a) return;
		if (calm) a.goToAndStop(a.totalFrames - 1, true);
		else a.goToAndPlay(0, true);
	};
	const totes = () => LISTA.forEach(({ id }, k) => setTimeout(() => jogar(id), k * 250));

	onMount(async () => {
		calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const { default: lottie } = await import('lottie-web/build/player/lottie_light.js');
		for (const { id } of LISTA) {
			const a = lottie.loadAnimation({
				container: els[id],
				renderer: 'svg',
				loop: false,
				autoplay: false,
				path: `/ensag/lottie/${id}.json`
			});
			a.addEventListener('DOMLoaded', () => jogar(id));
			anims[id] = a;
		}
	});
	onDestroy(() => Object.values(anims).forEach((a) => a.destroy()));
</script>

<svelte:head>
	<title>Récompenses animées · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="banc">
	<header>
		<h1>Récompenses animées</h1>
		<p>Dessinées dans EffectCraft, exportées au format Lottie. Clique sur une vignette pour la rejouer.</p>
		<div class="reglatges">
			<span class="fons" role="group" aria-label="Fond des vignettes">
				<button type="button" aria-pressed={fons === 'nuech'} onclick={() => (fons = 'nuech')}>Fond du site</button>
				<button type="button" aria-pressed={fons === 'crema'} onclick={() => (fons = 'crema')}>Fond crème</button>
			</span>
			<button type="button" class="totes" onclick={totes}>Tout rejouer</button>
		</div>
	</header>

	<ul>
		{#each LISTA as r (r.id)}
			<li>
				<button type="button" class="vinheta" class:crema={fons === 'crema'} onclick={() => jogar(r.id)} aria-label="Rejouer : {r.nom}">
					<span class="lottie" bind:this={els[r.id]}></span>
				</button>
				<span class="nom">{r.nom}</span>
				<span class="usage">{r.usage}</span>
				<span class="ton">{r.ton}</span>
				<span class="pes">{r.pes} compressé</span>
			</li>
		{/each}
	</ul>

	<footer>
		<p>
			<strong>Coût pour le site :</strong> le lecteur Lottie pèse 45 Ko compressés, chargé seulement sur les pages qui
			l’utilisent ; chaque animation ajoute ensuite 0,6 à 1,6 Ko. Pour qui a demandé moins de mouvement, l’image finale
			s’affiche directement.
		</p>
	</footer>
</main>

<style>
	.banc {
		max-width: 64rem;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
		color: var(--t-tinta);
	}
	h1 {
		margin: 0 0 0.4rem;
		font-size: 2rem;
	}
	header p,
	footer p {
		margin: 0 0 1rem;
		color: var(--t-tinta-2);
	}
	.reglatges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.25rem;
		align-items: center;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}
	.reglatges button {
		padding: 0.45rem 1rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
	.fons {
		display: inline-flex;
		gap: 0.4rem;
	}
	.reglatges button[aria-pressed='true'],
	.reglatges .totes {
		border-color: var(--t-aur);
		color: var(--t-aur-clar);
	}
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
		gap: 1.5rem;
		margin: 0 0 2rem;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.vinheta {
		display: grid;
		place-items: center;
		width: 100%;
		aspect-ratio: 1;
		margin-bottom: 0.4rem;
		padding: 0;
		border: 1px solid var(--t-linha);
		border-radius: 16px;
		background: color-mix(in srgb, var(--t-fons-2) 85%, transparent);
		cursor: pointer;
		overflow: hidden;
		transition: border-color 0.2s ease, background-color 0.3s ease;
	}
	.vinheta.crema {
		background: #f5ead8;
	}
	.vinheta:hover,
	.vinheta:focus-visible {
		border-color: var(--t-aur);
		outline: none;
	}
	.lottie {
		display: block;
		width: 80%;
		aspect-ratio: 1;
	}
	.nom {
		font-weight: 700;
	}
	.usage {
		color: var(--t-aur-clar);
		font-size: 0.875rem;
		font-weight: 600;
	}
	.ton,
	.pes {
		color: var(--t-tinta-2);
		font-size: 0.875rem;
	}
</style>
