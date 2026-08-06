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

	// Fonses de carta disponibles. Sonque lo fons « occitan » a d'etiquetas en
	// occitan (rendudas per OSM-bzh) ; los autres son de fonses tèrças sens
	// contengut lingüistic occitan, gratuits e sens clau d'API.
	const baseLayers = {
		occitan: {
			url: 'https://tile.openstreetmap.bzh/oc/{z}/{x}/{y}.png',
			maxZoom: 17,
			attribution:
				'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> · rendu per <a href="https://www.openstreetmap.bzh/" target="_blank" rel="noopener">OpenStreetMap e occitan</a>'
		},
		natural: {
			url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
			maxZoom: 17,
			attribution:
				'Donadas : © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a>, SRTM · Estil : © <a href="https://opentopomap.org" target="_blank" rel="noopener">OpenTopoMap</a> (CC-BY-SA)'
		},
		satellite: {
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			maxZoom: 19,
			attribution:
				'Tiles © <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a> — Esri, Maxar, Earthstar Geographics'
		}
	};

	let { visibility = {}, baseLayer = 'occitan' } = $props();

	let mapEl;
	let map;
	let L;
	let lieusLayer;
	let dialectesLayer;
	let dialectesLoading = false;
	let currentBaseTileLayer;

	function setBaseLayer(key) {
		const resolvedKey = baseLayers[key] ? key : 'occitan';
		const cfg = baseLayers[resolvedKey];
		if (currentBaseTileLayer) map.removeLayer(currentBaseTileLayer);
		currentBaseTileLayer = L.tileLayer(cfg.url, {
			maxZoom: cfg.maxZoom,
			attribution: cfg.attribution
		});
		currentBaseTileLayer._loLigamKey = resolvedKey;
		currentBaseTileLayer.addTo(map);
	}

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
			maxZoom: 19
		});

		setBaseLayer(baseLayer);

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
		const nextBaseLayer = baseLayer;
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

		if (currentBaseTileLayer?._loLigamKey !== nextBaseLayer) {
			setBaseLayer(nextBaseLayer);
		}
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div class="carta" class:muted={baseLayer === 'occitan'} bind:this={mapEl}></div>

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
	   afectat per aqueste filtre. Pas aplicat als autres fonses (natural,
	   satellit), qu'an ja de colors naturalas que cal pas amortir. */
	.carta.muted :global(.leaflet-tile-pane) {
		filter: grayscale(65%) brightness(1.08) contrast(0.92);
	}
</style>
