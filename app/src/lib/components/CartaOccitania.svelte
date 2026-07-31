<script>
	import { onMount, onDestroy } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	let mapEl;
	let map;

	onMount(async () => {
		const L = (await import('leaflet')).default;

		map = L.map(mapEl, {
			center: [43.95, 2.4],
			zoom: 7,
			minZoom: 5,
			maxZoom: 17
		});

		L.tileLayer('https://tile.openstreetmap.bzh/oc/{z}/{x}/{y}.png', {
			maxZoom: 17,
			attribution:
				'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> · rendu par <a href="https://www.openstreetmap.bzh/" target="_blank" rel="noopener">OpenStreetMap e occitan</a>'
		}).addTo(map);
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div class="carta" bind:this={mapEl}></div>

<style>
	.carta {
		width: 100%;
		height: 100%;
	}

	.carta :global(.leaflet-control-attribution) {
		font-family: var(--font-body);
		font-size: 0.7rem;
	}
</style>
