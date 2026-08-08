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
	let deptNivels = {};

	// Los tres nivèls de la còla « Despartaments occitans » (definits per
	// Romain) : lo nivèl mena l'intensitat de l'emplenatge e lo tèxte del
	// popup. Etiquetas occitanas de validar (dicodòc).
	const DEPT_NIVELS = {
		1: { opacitat: 1, label: 'Occitan, sola lenga regionala' },
		2: { opacitat: 0.55, label: 'Occitan, lenga regionala en partida' },
		3: { opacitat: 0.25, label: "Preséncia anciana de l'occitan, despareguda" }
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
		// Relèu : OpenTopoMap, projècte alemand, servidors en Alemanha.
		// Remplaça CAWM (University of Iowa, Estats Units).
		natural: {
			url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
			maxZoom: 17,
			subdomains: 'abc',
			attribution:
				'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> · relèu <a href="https://opentopomap.org/" target="_blank" rel="noopener">OpenTopoMap</a> (CC BY-SA)'
		},
		// Satellit : Sentinel-2, satellit de l'Agéncia espaciala europèa,
		// servit per EOX (Àustria). Remplaça ArcGIS (Esri, Estats Units).
		//
		// L'IGN francés èra l'autra pista, mas cobrís pas que la França :
		// verificat, tòrna un 404 sul Val d'Aran — justament ont l'occitan
		// es co-oficial. Sentinel-2 cobrís los tres territòris occitans
		// (França, Val d'Aran, valadas d'Itàlia).
		satellite: {
			url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg',
			maxZoom: 15,
			attribution:
				'Sentinel-2 cloudless (<a href="https://s2maps.eu" target="_blank" rel="noopener">s2maps.eu</a>) per <a href="https://eox.at" target="_blank" rel="noopener">EOX</a> — donadas <a href="https://www.esa.int" target="_blank" rel="noopener">ESA</a> Copernicus'
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
			attribution: cfg.attribution,
			// OpenTopoMap réparti sa carga sus a/b/c ; los autres fonses ne
			// pas besonh, l'opcion es alara ignorada.
			...(cfg.subdomains ? { subdomains: cfg.subdomains } : {})
		});
		currentBaseTileLayer._loLigamKey = resolvedKey;
		currentBaseTileLayer.addTo(map);
	}

	// Jaces de zònas e de linhas. Doas menas :
	// — GENERICAS : descrichas entièrament dins carta_colas (tipe, fichièr
	//   geojson_url, color, opacitat, pes de linha, puntejat, plantilha de
	//   popup) — creablas dempuèi /admin/carta sens cap de còdi ;
	// — ESPECIALAS : dialèctes e despartaments, qu'an un compòrtament pròpri
	//   (colors per zòna, nivèls), rendudas pel còdi çai-jos.
	// Lo registre final (geoDefs) es bastit dins onMount, un còp la basa legida.
	let geoDefs = {};

	function escapeHtml(s) {
		return String(s).replace(
			/[&<>"']/g,
			(c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
		);
	}

	// « {nom} — {descripcion} » : cada {camp} es remplaçat per la valor del
	// camp dins las donadas del traçat (escapada, per que de donadas
	// telecargadas pòscan pas injectar d'HTML).
	function renderPlantilha(plantilha, props) {
		return plantilha.replace(/\{([^{}]+)\}/g, (m, clau) => {
			const valor = props?.[clau.trim()];
			return valor == null ? '' : escapeHtml(valor);
		});
	}

	function makeGenericGeoDef(cola) {
		const esLinha = cola.tipe === 'linhas';
		return {
			url: cola.geojson_url,
			style: () => ({
				color: cola.color,
				weight: Number(cola.pes_linha ?? 1.5),
				dashArray: cola.linha_puntejada ? '4 3' : null,
				opacity: esLinha ? Number(cola.opacitat ?? 0.9) : 1,
				fill: !esLinha,
				fillColor: cola.color,
				fillOpacity: esLinha ? 0 : Number(cola.opacitat ?? 0.3)
			}),
			popup: cola.popup_plantilha
				? (feature) => renderPlantilha(cola.popup_plantilha, feature.properties)
				: null
		};
	}

	const SPECIAL_GEO = {
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
		departaments: {
			url: '/data/departements.geojson',
			attribution:
				'Contorns : <a href="https://github.com/gregoiredavid/france-geojson" target="_blank" rel="noopener">france-geojson</a> / Etalab (Licéncia Dobèrta)',
			// Sonque los despartaments classats (taula carta_departaments) son
			// afichats ; l'intensitat seguís lo nivèl (1 fòrt, 2 mejan, 3 leugièr).
			filter: (feature) => feature.properties.code in deptNivels,
			style: (feature) => {
				const nivèl = DEPT_NIVELS[deptNivels[feature.properties.code]?.nivèl];
				const basa = colaOpacitats.departaments ?? 0.45;
				const color = colaColors.departaments ?? '#c8562e';
				return {
					color,
					weight: 1,
					fillColor: color,
					fillOpacity: basa * (nivèl?.opacitat ?? 1)
				};
			},
			popup: (feature) => {
				const dept = deptNivels[feature.properties.code];
				const nivèl = DEPT_NIVELS[dept?.nivèl];
				return `<strong>${feature.properties.nom}</strong>${nivèl ? `<br>${nivèl.label}` : ''}`;
			}
		}
	};

	// Filet de seguretat abans la migracion « generica » : tant que la linha
	// « regions » de carta_colas a pas encara son geojson_url, la còla garda
	// son anciana definicion escricha aicí.
	const REGIONS_FALLBACK = {
		url: '/data/regions.geojson',
		attribution:
			'Contorns : <a href="https://github.com/gregoiredavid/france-geojson" target="_blank" rel="noopener">france-geojson</a> / Etalab (Licéncia Dobèrta)',
		style: () => ({
			color: colaColors.regions ?? '#3a2a20',
			weight: 1.3,
			dashArray: '4 3',
			fillColor: colaColors.regions ?? '#3a2a20',
			fillOpacity: colaOpacitats.regions ?? 0.04
		}),
		popup: (feature) => feature.properties.nom
	};

	async function loadGeoLayer(gid) {
		const def = geoDefs[gid];
		if (!def || geoLayers[gid] || geoLoading[gid]) return;
		geoLoading[gid] = true;
		const res = await fetch(def.url);
		const data = await res.json();
		geoLayers[gid] = L.geoJSON(data, {
			style: def.style,
			filter: def.filter,
			attribution: def.attribution,
			onEachFeature: def.popup
				? (feature, layer) => {
						layer.bindPopup(def.popup(feature));
					}
				: undefined
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
		const [{ data: luocsData }, { data: colasData }, { data: dialectesData }, { data: deptData }] =
			await Promise.all([
				supabase.from('carta_luocs').select('*').eq('publicat', true).order('ordre'),
				supabase.from('carta_colas').select('*').order('ordre'),
				supabase.from('carta_dialectes').select('*').order('ordre'),
				supabase.from('carta_departaments').select('code, nom, nivèl')
			]);

		for (const c of colasData ?? []) {
			colaColors[c.id] = c.color;
			colaOpacitats[c.id] = c.opacitat;
			// Còlas genericas de zònas/linhas : tota la definicion ven de la basa.
			if (
				(c.tipe === 'zonas' || c.tipe === 'linhas') &&
				c.geojson_url &&
				!(c.id in SPECIAL_GEO)
			) {
				geoDefs[c.id] = makeGenericGeoDef(c);
			}
		}
		// Las especialas passan totjorn en darrièr (ganhan sus tota linha
		// generica omonima), e « regions » garda son filet tant que la basa
		// es pas migrada.
		Object.assign(geoDefs, SPECIAL_GEO);
		if (!geoDefs.regions && (colasData ?? []).some((c) => c.id === 'regions')) {
			geoDefs.regions = REGIONS_FALLBACK;
		}

		for (const d of dialectesData ?? []) {
			dialectStyles[d.kòd] = { color: d.color, opacitat: d.opacitat, label: d.label_oc };
		}
		for (const d of deptData ?? []) {
			deptNivels[d.code] = d;
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

		for (const gid of Object.keys(geoDefs)) {
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

		for (const gid of Object.keys(geoDefs)) {
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
