<script>
	import { onMount, onDestroy } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import { supabase } from '$lib/supabaseClient';

	// Contengut e estils venon ara de Supabase (taulas carta_luocs,
	// carta_colas, carta_dialectes — gerits dins /admin/carta) puslèu que
	// d'èsser escriches en dur aicí. Cargats dins onMount, abans de bastir la
	// carta, per evitar tota corsa entre l'afichatge e las donadas.
	let lieusInteres = [];
	let lieusColor = '#e0a43b';
	let dialectStyles = {};

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
					fillOpacity: info?.opacitat ?? 0.35
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
		const [{ data: luocsData }, { data: colaData }, { data: dialectesData }] = await Promise.all([
			supabase.from('carta_luocs').select('*').eq('publicat', true).order('ordre'),
			supabase.from('carta_colas').select('color').eq('id', 'lieusInteres').maybeSingle(),
			supabase.from('carta_dialectes').select('*').order('ordre')
		]);

		lieusInteres = luocsData ?? [];
		lieusColor = colaData?.color ?? lieusColor;
		for (const d of dialectesData ?? []) {
			dialectStyles[d.kòd] = { color: d.color, opacitat: d.opacitat, label: d.label_oc };
		}

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

		L.control
			.scale({ position: 'bottomleft', metric: true, imperial: false, maxWidth: 110 })
			.addTo(map);

		lieusLayer = L.layerGroup(
			lieusInteres.map((lieu) =>
				L.circleMarker([lieu.latitud, lieu.longitud], {
					radius: 7,
					weight: 2,
					color: '#a5342a',
					fillColor: lieusColor,
					fillOpacity: 0.9
				}).bindPopup(
					`<strong>${lieu.nom_oc}</strong>${lieu.descripcion_oc ? `<br>${lieu.descripcion_oc}` : ''}`
				)
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

<div class="carta-root">
	<div class="carta" class:muted={baseLayer === 'occitan'} bind:this={mapEl}></div>

	<div class="compass" aria-hidden="true">
		<svg viewBox="0 0 24 24" width="18" height="18">
			<polygon points="12,2 15.2,12 12,10.2 8.8,12" fill="#a5342a" />
			<polygon points="12,22 15.2,12 12,13.8 8.8,12" fill="#3a2a20" fill-opacity="0.55" />
		</svg>
		<span>N</span>
	</div>
</div>

<style>
	.carta-root {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.carta {
		width: 100%;
		height: 100%;
	}

	.carta :global(.leaflet-control-attribution) {
		font-family: var(--font-body);
		font-size: 0.7rem;
	}

	.carta :global(.leaflet-control-scale-line) {
		background: rgba(245, 234, 216, 0.85);
		backdrop-filter: blur(6px);
		border: 2px solid var(--color-text);
		border-top: none;
		color: var(--color-text);
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.72rem;
		padding: 1px 6px;
		border-radius: 0 0 8px 8px;
	}

	.compass {
		position: absolute;
		top: 1rem;
		left: 4.5rem;
		z-index: 900;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		width: 2.2rem;
		height: 2.2rem;
		justify-content: center;
		border-radius: 999px;
		background: rgba(245, 234, 216, 0.88);
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 12px rgba(58, 42, 32, 0.16);
	}

	.compass span {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.6rem;
		color: var(--color-text);
		line-height: 1;
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
