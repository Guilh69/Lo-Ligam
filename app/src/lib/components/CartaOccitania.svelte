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
			url: 'https://cawm.lib.uiowa.edu/tiles/{z}/{x}/{y}.png',
			maxZoom: 11,
			attribution:
				'Relèu : <a href="https://cawm.lib.uiowa.edu/" target="_blank" rel="noopener">Consortium of Ancient World Mappers</a> / University of Iowa Libraries (CC BY 4.0)'
		},
		satellite: {
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			maxZoom: 19,
			attribution:
				'Tiles © <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a> — Esri, Maxar, Earthstar Geographics'
		}
	};

	// Nivèl de zoom a partir d'ont apareisson los borgs (en mai de las vilas,
	// totjorn vesedoiras) : evita d'encombrar la carta amb 354 etiquetas a
	// una vista alunhada.
	const TOWN_MIN_ZOOM = 9;

	let { visibility = {}, baseLayer = 'occitan' } = $props();

	let mapEl;
	let map;
	let L;
	let lieusLayer;
	let dialectesLayer;
	let dialectesLoading = false;
	let currentBaseTileLayer;
	let toponymCities;
	let toponymTowns;
	let toponymsLoading = false;

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

	// Etiquetas dels noms de luòcs en occitan (venon d'OSM, camp « name:oc »,
	// extraches amb Overpass) — sonque utilas suls fonses que n'an pas ja
	// (Natural, Satellit) : lo fons « Occitan » a ja sos pròpris noms rendus
	// per las tuèlas.
	function makeLabelMarker(feature) {
		const [lng, lat] = feature.geometry.coordinates;
		const isCity = feature.properties.place === 'city';
		return L.marker([lat, lng], {
			icon: L.divIcon({
				className: `oc-label ${isCity ? 'oc-label-city' : 'oc-label-town'}`,
				html: feature.properties.name_oc,
				iconSize: [140, 18],
				iconAnchor: [70, 9]
			}),
			interactive: false
		});
	}

	async function loadToponymsLayer() {
		if (toponymCities || toponymsLoading) return;
		toponymsLoading = true;
		const res = await fetch('/data/toponims-oc.geojson');
		const data = await res.json();
		const cityMarkers = [];
		const townMarkers = [];
		for (const feature of data.features) {
			const marker = makeLabelMarker(feature);
			if (feature.properties.place === 'city') {
				cityMarkers.push(marker);
			} else {
				townMarkers.push(marker);
			}
		}
		toponymCities = L.layerGroup(cityMarkers);
		toponymTowns = L.layerGroup(townMarkers);
		toponymsLoading = false;
		applyToponymVisibility();
	}

	function applyToponymVisibility() {
		if (!map || !toponymCities) return;
		if (baseLayer !== 'occitan') {
			toponymCities.addTo(map);
			if (map.getZoom() >= TOWN_MIN_ZOOM) {
				toponymTowns.addTo(map);
			} else {
				map.removeLayer(toponymTowns);
			}
		} else {
			map.removeLayer(toponymCities);
			map.removeLayer(toponymTowns);
		}
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
		map.on('zoomend', applyToponymVisibility);
		if (baseLayer !== 'occitan') loadToponymsLayer();

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

		if (toponymCities) {
			applyToponymVisibility();
		} else if (nextBaseLayer !== 'occitan' && !toponymsLoading) {
			loadToponymsLayer();
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

	/* Etiquetas dels noms occitans, per las mostrar suls fonses Natural e
	   Satellit. Contorn clar (text-stroke) per rèstar legibles sus de fonses
	   variables (fòrças colors en satellit). */
	.carta :global(.oc-label) {
		font-family: var(--font-heading);
		font-weight: 700;
		color: var(--color-text);
		text-align: center;
		white-space: nowrap;
		pointer-events: none;
		-webkit-text-stroke: 3px rgba(245, 234, 216, 0.85);
		paint-order: stroke fill;
	}

	.carta :global(.oc-label-city) {
		font-size: 0.82rem;
	}

	.carta :global(.oc-label-town) {
		font-size: 0.68rem;
		font-weight: 600;
	}
</style>
