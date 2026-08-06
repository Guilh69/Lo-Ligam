<script>
	import { onMount, onDestroy } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	// Exemple de contenu pour la còla « Luòcs d'interès » — à remplacer par
	// de vraies données (association, curation manuelle) plus tard.
	const lieusInteres = [
		{ oc: 'Tolosa', desc: 'La Vila Ròsa, capitala istorica de l’Occitània', lat: 43.6045, lng: 1.4442 },
		{ oc: 'Carcassona', desc: 'La Ciutat medievala', lat: 43.213, lng: 2.3491 },
		{ oc: 'Nimes', desc: 'Las Arenas romanas', lat: 43.8367, lng: 4.3601 },
		{ oc: 'Avinhon', desc: 'Lo Palais dels Papas', lat: 43.9493, lng: 4.8055 }
	];

	// Còdis de la còla « Dialèctes » (SIG/Dialecte/Carte_dialecte_WG.geojson) :
	// lo Lengadocian ressòrt en aur per marcar que's lo dialècte ensenhat
	// dins l'aplicacion.
	const dialectStyles = {
		cro: { color: '#3e7cb1', label: 'Lo Creissent' },
		pro: { color: '#c8562e', label: 'Provençau' },
		gas: { color: '#1f5f63', label: 'Gascon' },
		lan: { color: '#e0a43b', label: 'Lengadocian' },
		noc: { color: '#5e7b3a', label: 'Nòrd-occitan' }
	};

	let { visibility = {} } = $props();

	let mapEl;
	let map;
	let L;
	let lieusLayer;
	let dialectesLayer;
	let dialectesLoading = false;

	async function loadDialectesLayer() {
		if (dialectesLayer || dialectesLoading) return;
		dialectesLoading = true;
		const res = await fetch('/data/dialectes.geojson');
		const data = await res.json();
		dialectesLayer = L.geoJSON(data, {
			style: (feature) => {
				const info = dialectStyles[feature.properties.name];
				return {
					color: info?.color ?? '#3a2a20',
					weight: 1.5,
					fillColor: info?.color ?? '#3a2a20',
					fillOpacity: 0.35
				};
			},
			onEachFeature: (feature, layer) => {
				const info = dialectStyles[feature.properties.name];
				layer.bindPopup(info?.label ?? feature.properties.name);
			}
		});
		dialectesLoading = false;
		if (visibility.dialectes) dialectesLayer.addTo(map);
	}

	onMount(async () => {
		L = (await import('leaflet')).default;

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

		lieusLayer = L.layerGroup(
			lieusInteres.map((lieu) =>
				L.circleMarker([lieu.lat, lieu.lng], {
					radius: 7,
					weight: 2,
					color: '#a5342a',
					fillColor: '#e0a43b',
					fillOpacity: 0.9
				}).bindPopup(`<strong>${lieu.oc}</strong><br>${lieu.desc}`)
			)
		);

		if (visibility.lieusInteres) lieusLayer.addTo(map);
		if (visibility.dialectes) loadDialectesLayer();
	});

	$effect(() => {
		// Legir las proprietats en primièr, meteis dins lo cas ont la carta es
		// pas encara prèsta : cal que l'effièch se marque coma dependent
		// d'aquelas valors d'en primièr còp, o se tornarà pas jamai executar
		// quand la visibilitat càmbia mai tard.
		const showLieus = visibility.lieusInteres;
		const showDialectes = visibility.dialectes;
		if (!map || !L) return;

		if (lieusLayer) {
			if (showLieus) {
				lieusLayer.addTo(map);
			} else {
				map.removeLayer(lieusLayer);
			}
		}

		if (showDialectes) {
			if (dialectesLayer) {
				dialectesLayer.addTo(map);
			} else if (!dialectesLoading) {
				loadDialectesLayer();
			}
		} else if (dialectesLayer) {
			map.removeLayer(dialectesLayer);
		}
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

	/* Atenua lo fons OSM (rotas colorejadas en roge/irange) sens tocar las
	   jaces (dialèctes, luòcs) que rèstan dins un autre pan Leaflet, pas
	   afectat per aqueste filtre. */
	.carta :global(.leaflet-tile-pane) {
		filter: grayscale(65%) brightness(1.08) contrast(0.92);
	}
</style>
