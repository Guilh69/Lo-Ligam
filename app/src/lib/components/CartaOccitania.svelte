<script>
	import { onMount, onDestroy } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import { supabase } from '$lib/supabaseClient';

	// Contengut e estils venon ara de Supabase (taulas carta_luocs,
	// carta_colas, carta_dialectes — gerits dins /admin/carta) puslèu que
	// d'èsser escriches en dur aicí. Cargats dins onMount, abans de bastir la
	// carta, per evitar tota corsa entre l'afichatge e las donadas.
	//
	// Los punts son gropats per còla (colomna cola_id de carta_luocs) :
	// « lieusInteres », « librarias », e tota còla de punts venenta — cap de
	// còdi novèl serà de besonh, sonque una linha dins carta_colas e de punts.
	let colaColors = {};
	let colaOpacitats = {};
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
	let pointLayers = {};
	let geoLayers = {};
	let geoLoading = {};
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

	// Jaces de zònas (GeoJSON cargat a la demanda, sonque al primièr
	// afichatge). Cada dintrada balha l'adreça del fichièr e la faiçon de
	// l'estilizar / de nomenar sas zònas. Per n'apondre una : una dintrada
	// aicí + una linha dins carta_colas.
	const GEO_LAYERS = {
		dialectes: {
			url: '/data/dialectes.geojson',
			style: (feature) => {
				const info = dialectStyles[feature.properties.name];
				return {
					color: info?.color ?? '#3a2a20',
					weight: 1.5,
					fillColor: info?.color ?? '#3a2a20',
					fillOpacity: info?.opacitat ?? 0.35
				};
			},
			popup: (feature) =>
				dialectStyles[feature.properties.name]?.label ?? feature.properties.name
		},
		regions: {
			url: '/data/regions.geojson',
			attribution:
				'Contorns : <a href="https://github.com/gregoiredavid/france-geojson" target="_blank" rel="noopener">france-geojson</a> / Etalab (Licéncia Dobèrta)',
			// Simple linha de referéncia : contorn fin, emplenatge gaireben nul,
			// color e opacitat reglablas dins /admin/carta (linha « regions »).
			style: () => ({
				color: colaColors.regions ?? '#3a2a20',
				weight: 1.3,
				dashArray: '4 3',
				fillColor: colaColors.regions ?? '#3a2a20',
				fillOpacity: colaOpacitats.regions ?? 0.04
			}),
			popup: (feature) => feature.properties.nom
		}
	};

	async function loadGeoLayer(gid) {
		const def = GEO_LAYERS[gid];
		if (!def || geoLayers[gid] || geoLoading[gid]) return;
		geoLoading[gid] = true;
		const res = await fetch(def.url);
		const data = await res.json();
		geoLayers[gid] = L.geoJSON(data, {
			style: def.style,
			attribution: def.attribution,
			onEachFeature: (feature, layer) => {
				layer.bindPopup(def.popup(feature));
			}
		});
		geoLoading[gid] = false;
		if (visibility[gid]) geoLayers[gid].addTo(map);
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
		const [{ data: luocsData }, { data: colasData }, { data: dialectesData }] = await Promise.all([
			supabase.from('carta_luocs').select('*').eq('publicat', true).order('ordre'),
			supabase.from('carta_colas').select('id, color, opacitat').order('ordre'),
			supabase.from('carta_dialectes').select('*').order('ordre')
		]);

		for (const c of colasData ?? []) {
			colaColors[c.id] = c.color;
			colaOpacitats[c.id] = c.opacitat;
		}
		for (const d of dialectesData ?? []) {
			dialectStyles[d.kòd] = { color: d.color, opacitat: d.opacitat, label: d.label_oc };
		}

		// Grope los punts per còla. Los punts d'abans la colomna cola_id (basa
		// pas encara migrada) son de luòcs d'interès.
		const perCola = {};
		for (const luoc of luocsData ?? []) {
			const cid = luoc.cola_id ?? 'lieusInteres';
			(perCola[cid] ??= []).push(luoc);
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

		for (const [cid, luocs] of Object.entries(perCola)) {
			pointLayers[cid] = L.layerGroup(
				luocs.map((lieu) =>
					L.circleMarker([lieu.latitud, lieu.longitud], {
						radius: 7,
						weight: 2,
						color: '#a5342a',
						fillColor: colaColors[cid] ?? '#e0a43b',
						fillOpacity: 0.9
					}).bindPopup(
						`<strong>${lieu.nom_oc}</strong>${lieu.descripcion_oc ? `<br>${lieu.descripcion_oc}` : ''}`
					)
				)
			);
			if (visibility[cid]) pointLayers[cid].addTo(map);
		}

		for (const gid of Object.keys(GEO_LAYERS)) {
			if (visibility[gid]) loadGeoLayer(gid);
		}
	});

	$effect(() => {
		// Legir las proprietats en primièr, meteis dins lo cas ont la carta es
		// pas encara prèsta : cal que l'effièch se marque coma dependent
		// d'aquelas valors d'en primièr còp, o se tornarà pas jamai executar
		// quand la visibilitat càmbia mai tard. L'espandiment (...) legís
		// TOTAS las claus de visibility d'un còp — quina que siá la còla.
		const vis = { ...visibility };
		const nextBaseLayer = baseLayer;
		if (!map || !L) return;

		for (const [cid, layer] of Object.entries(pointLayers)) {
			if (vis[cid]) {
				layer.addTo(map);
			} else {
				map.removeLayer(layer);
			}
		}

		for (const gid of Object.keys(GEO_LAYERS)) {
			if (vis[gid]) {
				if (geoLayers[gid]) {
					geoLayers[gid].addTo(map);
				} else if (!geoLoading[gid]) {
					loadGeoLayer(gid);
				}
			} else if (geoLayers[gid]) {
				map.removeLayer(geoLayers[gid]);
			}
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
