<script>
	// Essai du 08-11, deuxième mouture : la couche des dialectes en papier
	// découpé, avec une transition en fondu de couleur entre parlers (demande
	// de Romain : une transition douce et cohérente, sans saccade).
	// La vraie carte n'est pas touchée : tout est dans lib/carta/papier.js.
	// Adresses utiles : ?mode=costura|zona ; ?t=99 montre la carte posée
	// d'emblée (pour les captures) ; ?zoom=7&lat=43.9&lon=2.5
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state';
	import 'leaflet/dist/leaflet.css';
	import { crearColaPapier, MODES } from '$lib/carta/papier.js';

	const Q = page.url.searchParams;
	let mode = $state(MODES.includes(Q.get('mode')) ? Q.get('mode') : 'costura');
	let eltCarta;
	let carte, cola;

	const NOMS = {
		costura: ['Couture fine', 'Les deux couleurs se fondent sur une étroite bande collée à la frontière'],
		zona: ['Zone large', 'Le fondu s’étale sur toute la bande réelle de mélange entre les parlers']
	};

	onMount(async () => {
		const L = (await import('leaflet')).default;
		carte = L.map(eltCarta, { zoomSnap: 0.25, zoomControl: true, attributionControl: true, minZoom: 4, maxZoom: 12 });
		L.tileLayer('https://tile.openstreetmap.bzh/oc/{z}/{x}/{y}.png', {
			maxZoom: 17,
			className: 'fons-papier',
			attribution:
				'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> · dialèctes : d’aprèp <a href="https://www.occitanica.eu/items/show/21242" target="_blank" rel="noopener">CIRDÒC – Occitanica</a>'
		}).addTo(carte);
		const z = Number(Q.get('zoom')),
			lat = Number(Q.get('lat')),
			lon = Number(Q.get('lon'));
		if (z && lat && lon) carte.setView([lat, lon], z);
		else carte.fitBounds([[42.0, -1.4], [46.2, 7.8]]);
		cola = crearColaPapier(L, { mode });
		cola.addTo(carte);
		const t = Q.get('t');
		// (un instant figé : pour regarder une image précise de la coulée)
		if (t !== null) {
			const attendre = setInterval(() => {
				if (cola._G?.dom_c) {
					clearInterval(attendre);
					cola.lancer(Number(t));
				}
			}, 100);
		}
		window.__papier = cola; // (pour l'essai : rejouer, figer, changer de mode)
	});
	onDestroy(() => {
		carte?.remove();
		if (typeof window !== 'undefined') delete window.__papier;
	});

	function choisir(m) {
		mode = m;
		cola?.mode(m);
	}
</script>

<svelte:head>
	<title>Essai · carte en papier découpé</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="cadre">
	<div class="carte" bind:this={eltCarta}></div>
	<div class="commandes">
		<p class="titre">Essai : la couche des dialectes en papier découpé</p>
		<button class="pc pc-or" onclick={() => cola?.lancer()}>Rejouer l’arrivée</button>
		<p class="legende">Transition entre parlers</p>
		<div class="choix">
			{#each MODES as m}
				<button class="pc {mode === m ? 'pc-or' : 'pc-2'}" aria-pressed={mode === m} onclick={() => choisir(m)}>{NOMS[m][0]}</button>
			{/each}
		</div>
		<p class="aide">{NOMS[mode][1]}</p>
	</div>
</div>

<style>
	.cadre {
		position: fixed;
		inset: 0;
		z-index: 60;
		background: #f3f3f1;
	}
	.carte {
		position: absolute;
		inset: 0;
		background: #f3f3f1;
		font-family: var(--font-body);
	}
	/* le fond : la carte d'OSM en gris clair, pour que les pièces de papier soient seules en couleur */
	.carte :global(.fons-papier) {
		filter: grayscale(1) contrast(0.75);
		opacity: 0.55;
	}
	.commandes {
		position: absolute;
		top: 12px;
		left: 12px;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
		max-width: 17rem;
		padding: 0.2rem;
	}
	.titre {
		margin: 0 0 0.2rem;
		font: 700 0.95rem/1.25 var(--font-body);
		color: #2a1a10;
		text-shadow: 0 0 6px #f3f3f1, 0 0 6px #f3f3f1;
	}
	.legende {
		margin: 0.4rem 0 0;
		font: 600 0.8rem/1 var(--font-body);
		color: #2a1a10;
		text-shadow: 0 0 5px #f3f3f1;
	}
	.choix {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}
	.choix :global(.pc) {
		min-height: 36px;
		padding: 0.35rem 0.8rem;
		font-size: 0.88rem;
	}
	.aide {
		margin: 0;
		font: 400 0.82rem/1.3 var(--font-body);
		color: #2a1a10;
		text-shadow: 0 0 5px #f3f3f1, 0 0 5px #f3f3f1;
	}
</style>
