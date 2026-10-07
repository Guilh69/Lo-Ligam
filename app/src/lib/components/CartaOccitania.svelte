<script>
	import { onMount, onDestroy } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { crearColaEstelas, Z_PRECARGA, nivèlsDezoom, aDetalh } from '$lib/carta/colaEstelas.js';
	import { sonsEntrada } from '$lib/carta/sons.js';
	import { crearColaDonadas } from '$lib/carta/colaDonadas.js';
	import { crearColaTematica } from '$lib/carta/colaTematica.js';
	import { JACES_DONADAS, JACES_TEMATICAS } from '$lib/carta/catalogue.js';
	import { ICONAS } from '$lib/carta/iconas.js';
	import CercaCarta from './CercaCarta.svelte';

	// Los punts e las jaces de l'admin venon de Supabase (taulas carta_luocs,
	// carta_colas, carta_departaments — geridas dins /admin/carta) puslèu que
	// d'èsser escriches en dur aicí. Cargats dins onMount, abans de bastir la
	// carta, per evitar tota corsa entre l'afichatge e las donadas.
	//
	// Los punts son gropats per còla (colomna cola_id de carta_luocs) :
	// « lieusInteres », « librarias », e tota còla de punts venenta — cap de
	// còdi novèl serà de besonh, sonque una linha dins carta_colas e de punts.
	let colaColors = {};
	let colaOpacitats = {};
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
				'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> · realizat per <a href="https://www.openstreetmap.bzh/" target="_blank" rel="noopener">OpenStreetMap e occitan</a>'
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
				'Sentinel-2 cloudless (<a href="https://s2maps.eu" target="_blank" rel="noopener">s2maps.eu</a>) per <a href="https://eox.at" target="_blank" rel="noopener">EOX</a> · donadas <a href="https://www.esa.int" target="_blank" rel="noopener">ESA</a> Copernicus'
		}
	};

	// Nivèl de zoom a partir d'ont apareisson los borgs (en mai de las vilas,
	// totjorn vesedoiras) : evita d'encombrar la carta amb 354 etiquetas a
	// una vista alunhada.
	const TOWN_MIN_ZOOM = 9;

	// Fons « estelas » (per defaut dempuèi lo 2026-10-07) : la carta en estelas
	// de l'acuèlh ; las tuèlas OSM en occitan se descobrisson dejós sonque quand
	// s'aprèpa (nivèl 8,5 e mai), e son pas telecargadas abans.
	let {
		visibility = {},
		baseLayer = 'estelas',
		clar = false,
		dalt = false,
		lang = 'oc',
		// elements del fons en estelas ({ estelas, nomsVilas, rius, nomsRius, corbas, costa })
		elements = {},
		// colors causidas per l'internauta ({ riu, costa, estela, corba })
		colors = {},
		// lo dialècte causit (còdi, 'cro' pel Creissent, o null) : de la carta al
		// panèl e del panèl a la carta
		causits = $bindable([])
	} = $props();
	// la zòna dialectala survolada o causida, dins la legenda d'en bas
	let survòl = $state(null);
	let causida = $state(null);
	// una comuna, un parc o una província survolada passa davant
	let survòlTem = $state(null);
	const legendaDial = $derived(survòlTem ?? causida ?? survòl);
	let colaEstelas;
	// Jaces del catalògue pintadas pel site (frontièra, dialèctes, Creissent,
	// regions, despartaments) : sus totes los fonses
	let colaDonadas;
	// (lo Creissent es una pastilha dels dialèctes : se mòstra amb eles)
	const jacesDonadas = (vis) => ({ ...Object.fromEntries(JACES_DONADAS.map((id) => [id, !!vis[id]])), creissent: !!vis.dialectes });
	// Jaces de fonts publicas (comunas, provincias, parcs, relèu) : colaTematica.js
	let colaTematica;
	const jacesTematicas = (vis) => Object.fromEntries(JACES_TEMATICAS.map((id) => [id, !!vis[id]]));
	// Fonses sens noms occitans : las etiquetas de toponims i son apondudas
	const ambToponims = (k) => k === 'natural' || k === 'satellite';

	let mapEl;
	let map;
	// Los tèxtes de Leaflet (botons de zoom, boton que tampa las bulles) dins
	// la lenga de la pagina : Leaflet los a en anglés (occitan de validar)
	const TÈXTES_LEAFLET = {
		oc: { mai: 'Apropar', mens: 'Alunhar', tampar: 'Tampar', carta: "Carta de l'occitan" },
		fr: { mai: 'Zoom avant', mens: 'Zoom arrière', tampar: 'Fermer', carta: "Carte de l'occitan" }
	};
	function tèxtesLeaflet() {
		if (!map) return;
		const t = TÈXTES_LEAFLET[lang] ?? TÈXTES_LEAFLET.oc,
			c = map.getContainer();
		c.setAttribute('aria-label', t.carta);
		for (const [sel, tx] of [
			['.leaflet-control-zoom-in', t.mai],
			['.leaflet-control-zoom-out', t.mens],
			['.leaflet-popup-close-button', t.tampar]
		])
			for (const b of c.querySelectorAll(sel)) {
				b.title = tx;
				b.setAttribute('aria-label', tx);
			}
	}
	// arrèst de l'entrada en scèna (sons, escotas) quand se quita la pagina
	let quitarIntro = null;
	let L;
	let pointLayers = {};
	let geoLayers = {};
	let geoLoading = {};
	let currentBaseTileLayer;
	let toponymCities;
	let toponymTowns;
	let toponymsLoading = false;

	function setBaseLayer(key) {
		if (key === 'estelas') {
			if (currentBaseTileLayer) map.removeLayer(currentBaseTileLayer);
			currentBaseTileLayer = null;
			// Clic sur le repère d'une ville à fiche (de près) : sa page
			if (!colaEstelas) {
				colaEstelas = crearColaEstelas(L, {
					clar,
					dalt,
					lang,
					onFicha: (v) => goto(v.ligam),
					cedir: (lp) => !!(colaDonadas && map.hasLayer(colaDonadas) && colaDonadas.enclavaA(lp)) || !!colaTematica?.ocupat(lp)
				});
				colaEstelas.setElements(elements);
				colaEstelas.setColors(colors);
				colaEstelas.setModeDialectes(!!visibility.dialectes);
				colaEstelas.setTerritoris({ regions: !!visibility.regions, despartaments: !!visibility.despartaments, comunas: !!visibility.comunas });
			}
			colaEstelas.addTo(map);
			majDetalh();
			return;
		}
		if (colaEstelas) map.removeLayer(colaEstelas);
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

	// Fons « estelas » : la carta detalhada (tuèlas OSM en occitan) apareis e
	// las estelas s'escafan a mesura que s'aprèpa ; en dejós del lindal, cap de
	// tuèla es pas demandada (sobrietat).
	function majDetalh() {
		if (!map || baseLayer !== 'estelas') return;
		const z = map.getZoom();
		if (z >= Z_PRECARGA) {
			if (!currentBaseTileLayer) {
				const cfg = baseLayers.occitan;
				currentBaseTileLayer = L.tileLayer(cfg.url, { maxZoom: cfg.maxZoom, attribution: cfg.attribution, className: 'teules-detalh', opacity: 0 });
				currentBaseTileLayer._loLigamKey = 'estelas';
				currentBaseTileLayer.addTo(map);
			}
			// invisibles sous le seuil ; le fondu du relais, c'est la còla
			// d'estelas qui le mène (en même temps que ses noms s'effacent)
			colaEstelas?.setTeulas(currentBaseTileLayer);
		} else if (currentBaseTileLayer) {
			map.removeLayer(currentBaseTileLayer);
			currentBaseTileLayer = null;
			colaEstelas?.setTeulas(null);
		}
	}

	// Jaces de zònas e de linhas. Doas menas :
	// — GENERICAS : descrichas entièrament dins carta_colas (tipe, fichièr
	//   geojson_url, color, opacitat, pes de linha, puntejat, plantilha de
	//   popup) — creablas dempuèi /admin/carta sens cap de còdi ;
	// — ESPECIALAS : los despartaments occitanofòns (nivèls), renduts pel
	//   còdi çai-jos. Los dialèctes, la frontièra, lo Creissent e los contorns
	//   administratius son pintats per la còla de donadas (colaDonadas.js).
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
				const color = colaColors.departaments ?? '#b53d17';
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

	// Cada punt : una pastilha de veire amb l'icòna de sa jaça (Tabler Icons,
	// MIT), de la color de la jaça ; las colors de basa venon del tèma
	const ICONA_COLA = { lieusInteres: 'building-arch', librarias: 'books', calandretas: 'school', festas: 'confetti', limsi: 'microphone-2' };
	// una jaça apondida dins l'admin pren sa color de la basa
	// (cada ponch s'aluca a son moment : un pichon retard a l'azard)
	const estilPunt = (cid) => ` style="--retard:${Math.round(Math.random() * 900)}ms;${colaColors[cid] && !(cid in ICONA_COLA) ? `--ponch:${escapeHtml(colaColors[cid])}` : ''}"`;
	const iconaPunt = (cid, st = estilPunt(cid)) =>
		L.divIcon({
			className: 'ponch-jaça ponch-jaça-' + cid,
			html: `<span class="ponch"${st}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONAS[ICONA_COLA[cid] ?? 'building-arch']}</svg></span><i class="ponch-cueta"${st}></i>`,
			// una espilla : la pastilha se ten al dessús del luòc, que son nom
			// (a costat del ponch) demòre legible
			iconSize: [26, 34],
			iconAnchor: [13, 34],
			popupAnchor: [0, -32]
		});

	// Las Calandretas (annuari de l'educacion, Licéncia dobèrta) : un fichièr
	// estatic, cargat a la primièra activacion de la jaça
	let calandretasCargadas = false;
	const MENA_ESCÒLA = {
		oc: { escòla: 'escòla', collègi: 'collègi', licèu: 'licèu' },
		fr: { escòla: 'école', collègi: 'collège', licèu: 'lycée' }
	};
	async function cargarCalandretas() {
		if (calandretasCargadas || !map) return;
		calandretasCargadas = true;
		const d = await fetch('/data/calandretas.geojson')
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null);
		if (!d?.features) return (calandretasCargadas = false);
		const mena = MENA_ESCÒLA[lang] ?? MENA_ESCÒLA.oc;
		pointLayers.calandretas = L.layerGroup(
			d.features.map((f) => {
				const [lon, lat] = f.geometry.coordinates;
				const q = f.properties;
				// lo site de l'escòla se n'a un, siquenon lo contacte que dona lo
				// ministèri dins l'annuari (retorn de Romain)
				const ligam = /^https?:\/\//.test(q.ligam ?? '')
					? `<br><a href="${escapeHtml(q.ligam)}" target="_blank" rel="noopener">Site ↗</a>`
					: [
							q.corrièl ? `<br><a href="mailto:${escapeHtml(q.corrièl)}">${escapeHtml(q.corrièl)}</a>` : '',
							q.telefon ? `<br><a href="tel:${escapeHtml(q.telefon.replace(/\s/g, ''))}">${escapeHtml(q.telefon)}</a>` : ''
						].join('');
				return L.marker([lat, lon], { icon: iconaPunt('calandretas'), title: q.nom, keyboard: true }).bindPopup(
					`<strong>${escapeHtml(q.nom)}</strong><br>${escapeHtml(mena[q.mena] ?? q.mena)} · ${escapeHtml(q.comuna)}${ligam}`
				);
			})
		);
		if (d.font) map.attributionControl?.addAttribution(d.font);
		if (visibility.calandretas) pointLayers.calandretas.addTo(map);
	}

	// Las autras lengas de França (demanda de Romain) : una etiqueta per
	// lenga, a sa region, e una ficha corta al clic. Las d'outra mar se veson
	// quand se dezooma fins al mond, las de França metropolitana de mai prèp.
	let lengasCargadas = false;
	async function cargarLengas() {
		if (lengasCargadas || !map) return;
		lengasCargadas = true;
		const d = await fetch('/data/lengas-franca.json')
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null);
		if (!d?.lengas) return (lengasCargadas = false);
		const fr = lang === 'fr';
		pointLayers.lengasFranca = L.layerGroup(
			d.lengas.map((q) =>
				L.marker([q.lat, q.lon], {
					icon: L.divIcon({
						className: 'lenga-franca' + (q.outremer ? ' outremer' : ''),
						html: `<span style="--retard:${Math.round(Math.random() * 700)}ms">${escapeHtml(q.endo)}</span>`,
						iconSize: null
					}),
					title: `${q.endo} : ${fr ? q.fr : q.oc}`,
					keyboard: true
				}).bindPopup(
					`<strong>${escapeHtml(q.endo)}</strong><br>${escapeHtml(fr ? q.fr : q.oc)} · ${escapeHtml(fr ? q.familha_fr : q.familha_oc)}<br><small>${escapeHtml(fr ? q.zona_fr : q.zona_oc)}</small>`
				)
			)
		);
		const zoomMond = () => mapEl?.classList.toggle('zoom-mond', map.getZoom() < 4.6);
		map.on('zoomend', zoomMond);
		zoomMond();
		if (visibility.lengasFranca) pointLayers.lengasFranca.addTo(map);
	}

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
		if (ambToponims(baseLayer)) {
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
		// La carta e las estelas s'afichan TRE ARA, sens esperar la basa : se
		// Supabase respond pas (projècte gratuit en pausa, ret copada), la carta
		// demòra utilizabla ; las còlas de l'admin s'apondon quand arriban.
		L = (await import('leaflet')).default;

		// Zoom par quarts de niveau : la traversée des échelles est plus douce,
		// et l'Occitanie entière tient juste dans la fenêtre à l'arrivée (même
		// cadre que la carte en étoiles de l'accueil).
		map = L.map(mapEl, {
			zoomSnap: 0.25,
			zoomDelta: 0.5,
			wheelPxPerZoomLevel: 110,
			minZoom: 2, // fins al mond (dezoom : Euròpa, puèi lo mond)
			maxZoom: 19,
			zoomControl: false
		});
		map.fitBounds(
			[
				[42.65, -1.6],
				[46.4, 7.55]
			],
			{ paddingTopLeft: [16, 96], paddingBottomRight: [16, 24] }
		);

		setBaseLayer(baseLayer);
		colaDonadas = crearColaDonadas(L, {
			clar,
			dalt,
			lang,
			jaces: jacesDonadas(visibility),
			// un luòc o una vila a ficha jos lo det : lo clic es per las estelas
			ocupat: (lp) => !!(colaEstelas && map.hasLayer(colaEstelas) && colaEstelas.ocupat(lp)) || !!colaTematica?.ocupat(lp, true),
			// los noms de vilas : los noms de dialèctes los evitan
			obstacles: () => (colaEstelas && map.hasLayer(colaEstelas) ? colaEstelas.caixasNoms() : null),
			onSurvòl: (k, info) => (survòl = info),
			onCausida: (kods, info) => {
				causida = info;
				causits = kods;
			}
		});
		colaDonadas.addTo(map);
		colaTematica = crearColaTematica(L, {
			clar,
			lang,
			jaces: jacesTematicas(visibility),
			// las provincias, que cobrisson tot, cedisson als dialèctes e al Creissent
			cedirProv: (lp) => !!(map.hasLayer(colaDonadas) && colaDonadas.zonaA(lp)),
			// los noms de vilas de la carta en estelas : los noms de províncias los evitan
			obstacles: () => [colaEstelas && map.hasLayer(colaEstelas) ? colaEstelas.caixasNoms() : null, colaDonadas.caixasNoms()],
			onSurvòl: (info) => (survòlTem = info)
		});
		colaTematica.addTo(map);
		// L'entrada en scèna (demanda de Romain) : còsta, corbas de nivèl, noms
		// de las cadenas, rius, vilas grandas, puèi los dialèctes ; un relòtge
		// comun a las tres còlas. Un clic, la molèta o una tòca menan a la fin.
		// L'entrada en scèna part quand las donadas son aquí e preparadas (lo
		// primièr calcul de las tenchas blocava lo navegador doas segondas : las
		// estapas e los sons sautavan), al mai tard aprèp 4 s. Fins alara las
		// còlas son voidas.
		for (const c of [colaEstelas, colaDonadas, colaTematica]) c?.setIntro(Infinity);
		let sons = null,
			acabada = false;
		const escotas = ['pointerdown', 'wheel', 'keydown'];
		const acabarIntro = () => {
			acabada = true;
			sons?.copar();
			colaEstelas?.setSons(null);
			for (const c of [colaEstelas, colaDonadas, colaTematica]) c?.acabarIntro();
			for (const ev of escotas) window.removeEventListener(ev, acabarIntro, true);
			document.removeEventListener('visibilitychange', amagada);
		};
		// un onglet amagat suspend lo dessenh mas pas los sons : l'entrada en
		// scèna va a la fin
		const amagada = () => document.hidden && acabarIntro();
		document.addEventListener('visibilitychange', amagada);
		for (const ev of escotas) window.addEventListener(ev, acabarIntro, true);
		quitarIntro = () => {
			acabada = true;
			sons?.copar();
			for (const ev of escotas) window.removeEventListener(ev, acabarIntro, true);
			document.removeEventListener('visibilitychange', amagada);
		};
		Promise.race([
			Promise.all([colaEstelas?.prèsta(), colaDonadas.prèsta()]),
			new Promise((r) => setTimeout(r, 4000))
		]).then(() =>
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					if (acabada) return;
					const t0 = performance.now();
					// los sons (gredon, pèiras, aiga), menats pel dessenh de la carta
					// en estelas ; res se mens de movement es demandat
					sons = matchMedia('(prefers-reduced-motion: reduce)').matches ? null : sonsEntrada();
					colaEstelas?.setSons(sons);
					for (const c of [colaEstelas, colaDonadas, colaTematica]) c?.setIntro(t0);
					setTimeout(() => {
						for (const ev of escotas) window.removeEventListener(ev, acabarIntro, true);
					}, 10000);
				})
			)
		);
		// desbugatge (sonque en desvolopament) : la carta e sas còlas dins la consòla
		if (import.meta.env.DEV) window.__carta = { map, colaDonadas, get colaEstelas() { return colaEstelas; }, get colaTematica() { return colaTematica; } };
		map.on('zoomend', applyToponymVisibility);
		map.on('zoomend', majDetalh);
		// de luènh (« 500 km »), los ponches (luòcs, librarias, Calandretas)
		// s'escantisson amb las autras jaces : demòra lo contorn de l'Occitània
		const luènh = () => mapEl?.classList.toggle('luenh', aDetalh(nivèlsDezoom(map), map.getZoom()) < 0.5);
		map.on('zoomend', luènh);
		luènh();
		if (ambToponims(baseLayer)) loadToponymsLayer();

		L.control.zoom({ position: 'bottomright' }).addTo(map);
		map.attributionControl?.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
		tèxtesLeaflet();
		map.on('popupopen', tèxtesLeaflet);
		// Échelle : Leaflet n'arrondit qu'à 1, 2, 3 ou 5, si bien que deux crans
		// de zoom affichaient le même « 50 km » (retour de Romain). Des paliers
		// intermédiaires la font changer à chaque cran ; virgule à la française.
		const escala = L.control.scale({ position: 'bottomleft', metric: true, imperial: false, maxWidth: 110 });
		escala._getRoundNum = (num) => {
			const pow10 = Math.pow(10, String(Math.floor(num)).length - 1);
			const d = num / pow10;
			return pow10 * ([10, 7, 5, 4, 3, 2, 1.5, 1].find((v) => d >= v) ?? 1);
		};
		escala._updateMetric = function (maxMeters) {
			const m = this._getRoundNum(maxMeters);
			const label = m < 1000 ? m + ' m' : (m / 1000).toLocaleString('fr-FR') + ' km';
			this._updateScale(this._mScale, label, m / maxMeters);
		};
		escala.addTo(map);

		// Puèi las donadas de la basa (luòcs, còlas, dialèctes, despartaments)
		const [{ data: luocsData }, { data: colasData }, { data: deptData }] =
			await Promise.all([
				supabase.from('carta_luocs').select('*').eq('publicat', true).order('ordre'),
				supabase.from('carta_colas').select('*').order('ordre'),
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
		// Las jaces de la còla de donadas son pas de jaces Leaflet
		for (const id of JACES_DONADAS) delete geoDefs[id];

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

		for (const [cid, luocs] of Object.entries(perCola)) {
			pointLayers[cid] = L.layerGroup(
				luocs.map((lieu) => {
					const nom = (lang === 'fr' && lieu.nom_fr) || lieu.nom_oc;
					const desc = (lang === 'fr' && lieu.descripcion_fr) || lieu.descripcion_oc;
					return L.marker([lieu.latitud, lieu.longitud], { icon: iconaPunt(cid), title: nom, keyboard: true }).bindPopup(
						`<strong>${escapeHtml(nom)}</strong>${desc ? `<br>${escapeHtml(desc)}` : ''}`
					);
				})
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
		colaDonadas?.setJaces(jacesDonadas(vis));
		// lo territòri survolat o clicat seguís las jaces alucadas (region o despartament)
		colaEstelas?.setTerritoris({ regions: !!vis.regions, despartaments: !!vis.despartaments, comunas: !!vis.comunas });
		colaTematica?.setJaces(jacesTematicas(vis));
		if (vis.calandretas) cargarCalandretas();
		if (vis.lengasFranca) cargarLengas();
		// dialèctes o Creissent visibles : lo survòl e lo clic son per eles
		colaEstelas?.setModeDialectes(!!vis.dialectes);

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

		const actiu = colaEstelas && map.hasLayer(colaEstelas) ? 'estelas' : currentBaseTileLayer?._loLigamKey;
		if (actiu !== nextBaseLayer) {
			setBaseLayer(nextBaseLayer);
		}

		if (toponymCities) {
			applyToponymVisibility();
		} else if (ambToponims(nextBaseLayer) && !toponymsLoading) {
			loadToponymsLayer();
		}
	});

	// Thème (sombre / clair / daltonisme) : la couche en étoiles suit
	$effect(() => {
		const c = clar,
			d = dalt;
		colaEstelas?.setTema(c, d);
		colaDonadas?.setTema(c, d);
		colaTematica?.setTema(c);
	});
	$effect(() => {
		const l = lang;
		colaEstelas?.setLenga(l);
		colaDonadas?.setLenga(l);
		colaTematica?.setLenga(l);
		tèxtesLeaflet();
	});
	// Elements e colors del fons, dialècte causit dempuèi lo panèl
	$effect(() => {
		const el = { ...elements };
		colaEstelas?.setElements(el);
	});
	$effect(() => {
		const c = { ...colors };
		colaEstelas?.setColors(c);
	});
	$effect(() => {
		const kods = [...causits];
		colaDonadas?.causir(kods);
	});

	// Recherche : un lieu, la carte y vole (et l'y signale) ; un département ou
	// une région, elle se cadre dessus
	function anarA(r) {
		if (!map) return;
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (r.mena === 'luòc') {
			const z = r.renc <= 2 ? 10.5 : r.renc === 3 ? 11 : 12;
			map.flyTo([r.lat, r.lon], z, { duration: calm ? 0 : 1.8 });
			colaEstelas?.senhalar(r.lat, r.lon);
		} else {
			const [w, s, e, n] = r.bbox;
			map.flyToBounds(
				[
					[s, w],
					[n, e]
				],
				{ paddingTopLeft: [40, 130], paddingBottomRight: [40, 40], duration: calm ? 0 : 1.6 }
			);
		}
	}

	onDestroy(() => {
		quitarIntro?.();
		map?.remove();
	});
</script>

<div class="carta-root">
	<div
		class="carta"
		class:muted={baseLayer === 'occitan' && clar}
		class:nuech={(baseLayer === 'occitan' || baseLayer === 'estelas') && !clar}
		bind:this={mapEl}
	></div>

	<CercaCarta {lang} onCausir={anarA} />

	<!-- Lo dialècte survolat o causit : meteissa etiqueta que los territòris -->
	{#if legendaDial}
		<div class="legenda-dial" class:fixada={!!causida} aria-live="polite">
			<span class="nom">{lang === 'fr' ? legendaDial.fr : legendaDial.oc}</span>
			<span class="sota"
				>{legendaDial.mix
					? lang === 'fr'
						? legendaDial.sota_fr
						: legendaDial.sota_oc
					: legendaDial.cro
					? lang === 'fr'
						? 'zone de transition'
						: 'zòna de transicion'
					: lang === 'fr'
						? 'dialecte'
						: 'dialècte'}</span
			>
		</div>
	{/if}

	<!-- Flèche du nord à l'ancienne, comme sur l'accueil : aiguille en losange
	     (moitié pleine, moitié tracée), anneau fin, N italique -->
	<div class="compass" aria-hidden="true">
		<svg viewBox="-12 -16 34 40" width="30" height="36">
			<circle cx="0" cy="4" r="5.5" fill="none" stroke="currentColor" stroke-width="0.9" />
			<line x1="-9" y1="4" x2="9" y2="4" stroke="currentColor" stroke-width="0.9" opacity="0.5" />
			<path d="M0 -14L-3 4L0 4Z" fill="currentColor" />
			<path d="M0 -14L3 4L0 4Z" fill="none" stroke="currentColor" stroke-width="0.9" stroke-linejoin="round" />
			<path d="M-3 4L0 20L3 4" fill="none" stroke="currentColor" stroke-width="0.9" stroke-linejoin="round" />
			<text x="8" y="-6">N</text>
		</svg>
	</div>
</div>

<style>
	/* Los punts de las jaces (luòcs d'interès, librariás…) : pastilha de veire,
	   icòna e liseret de la color de la jaça */
	:global(.ponch-jaça) {
		--ponch: var(--t-aur);
		display: grid;
		justify-items: center;
		background: none;
		border: 0;
	}
	:global(.ponch-cueta) {
		display: block;
		width: 1.5px;
		height: 8px;
		background: var(--ponch);
	}
	/* L'aparicion d'un ponch (demanda de Romain : una animacion per jaça, la
	   mai adaptada a sas donadas) : s'aluca coma una estela, a son moment */
	:global(.ponch-jaça .ponch),
	:global(.ponch-jaça .ponch-cueta) {
		animation: ponch-aluca 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.3) backwards;
		animation-delay: var(--retard, 0ms);
	}
	@keyframes ponch-aluca {
		0% {
			opacity: 0;
			transform: scale(0.2);
			filter: brightness(2.4) drop-shadow(0 0 6px var(--t-aur-clar));
		}
		55% {
			opacity: 1;
			filter: brightness(1.7) drop-shadow(0 0 5px var(--t-aur-clar));
		}
	}
	/* los noms de las autras lengas : lors letras se sarran, coma los noms dels massís */
	.carta :global(.lenga-franca span) {
		animation: lenga-ven 0.9s cubic-bezier(0.2, 0.8, 0.3, 1) backwards;
		animation-delay: var(--retard, 0ms);
	}
	@keyframes lenga-ven {
		0% {
			opacity: 0;
			letter-spacing: 0.7em;
			filter: blur(2px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.ponch-jaça .ponch),
		:global(.ponch-jaça .ponch-cueta),
		.carta :global(.lenga-franca span) {
			animation: none;
		}
	}
	:global(.ponch-jaça-librarias) {
		--ponch: var(--t-terra-viu);
	}
	:global(.ponch) {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--t-fons-2) 88%, transparent);
		border: 1.5px solid var(--ponch);
		color: var(--ponch);
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
		transition: transform 0.2s;
		transform-origin: 50% 100%;
	}
	:global(.ponch svg) {
		width: 15px;
		height: 15px;
	}
	:global(.leaflet-marker-icon:hover .ponch),
	:global(.leaflet-marker-icon:focus-visible .ponch) {
		transform: scale(1.12);
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.ponch) {
			transition: none;
		}
	}

	/* L'etiqueta del dialècte survolat o causit : la meteissa que pels
	   territòris (pintada dins lo canavàs de las estelas), en bas al centre */
	.legenda-dial {
		position: absolute;
		z-index: 900;
		left: 50%;
		bottom: calc(62px + var(--barra-bas, 0px));
		transform: translateX(-50%);
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 4px 10px;
		/* (los noms longs e las causidas multiplas passan a la linha en
		   demorant dins l'ecran) */
		width: max-content;
		max-width: calc(100% - 2rem);
		min-height: 34px;
		padding: 7px 18px;
		box-sizing: border-box;
		border-radius: 17px;
		text-align: center;
		border: 1px solid color-mix(in srgb, var(--t-tinta) 70%, transparent);
		background: color-mix(in srgb, var(--t-fons-2) 94%, transparent);
		color: var(--t-tinta);
		pointer-events: none;
		animation: legenda-dial 0.25s ease-out;
	}
	.legenda-dial.fixada {
		border-color: var(--t-aur);
	}
	.legenda-dial .nom {
		font: 700 12.5px/1.35 var(--font-body);
		letter-spacing: 2.5px;
		text-transform: uppercase;
	}
	.legenda-dial .sota {
		font: 400 11px/1 var(--font-body);
		letter-spacing: 0.5px;
		color: var(--t-aur-clar);
	}
	@keyframes legenda-dial {
		from {
			opacity: 0;
			transform: translate(-50%, 4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.legenda-dial {
			animation: none;
		}
	}

	.carta-root {
		position: relative;
		width: 100%;
		height: 100%;
	}

	/* La nuit sous les étoiles (ou le papier crème en thème clair), avec une
	   chaleur de braise : Leaflet met du gris par défaut */
	.carta {
		width: 100%;
		height: 100%;
		background:
			radial-gradient(ellipse 60% 55% at 45% 55%, color-mix(in srgb, var(--t-terra) 16%, transparent), transparent 75%),
			var(--t-fons);
		font-family: var(--font-body);
	}

	/* Contrôles Leaflet (zoom, échelle, crédits) dans la charte : verre sombre,
	   liseré, or */
	.carta :global(.leaflet-bar) {
		border: 1px solid var(--t-linha);
		border-radius: 14px;
		overflow: hidden;
		box-shadow: none;
	}

	.carta :global(.leaflet-bar a) {
		width: 2.4rem;
		height: 2.4rem;
		line-height: 2.4rem;
		background: color-mix(in srgb, var(--t-fons) 78%, transparent);
		backdrop-filter: blur(6px);
		color: var(--t-aur-clar);
		border-bottom-color: var(--t-linha);
		font: 400 1.2rem var(--font-body);
	}

	/* Pas de surlignage bleu après un clic ou un toucher (navigateurs), ni de
	   texte sélectionné quand on clique vite plusieurs fois sur + ou − */
	.carta :global(.leaflet-bar a) {
		-webkit-tap-highlight-color: transparent;
		user-select: none;
	}

	.carta :global(.leaflet-control-container) {
		user-select: none;
	}

	.carta :global(.leaflet-bar a:hover),
	.carta :global(.leaflet-bar a:focus) {
		background: var(--t-fons-2);
		color: var(--t-aur);
	}

	.carta :global(.leaflet-bar a:focus:not(:focus-visible)) {
		outline: none;
	}

	.carta :global(.leaflet-bar a:focus-visible) {
		outline: 2px solid var(--t-aur);
		outline-offset: -2px;
	}

	.carta :global(.leaflet-bar a.leaflet-disabled) {
		color: var(--t-linha);
		background: color-mix(in srgb, var(--t-fons) 78%, transparent);
	}

	/* Las fonts : una sola linha que daissa la plaça a l'escala (retorn de
	   Romain : l'escala èra jos lo bandèu), desplegada al survòl o al tòc */
	.carta :global(.leaflet-control-attribution) {
		max-width: calc(100vw - 10rem);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		background: color-mix(in srgb, var(--t-fons) 70%, transparent);
		color: var(--t-tinta-2);
		font-size: 0.68rem;
		border-radius: 8px 0 0 0;
		cursor: default;
	}
	.carta :global(.leaflet-control-attribution:hover),
	.carta :global(.leaflet-control-attribution:focus-within) {
		white-space: normal;
		background: color-mix(in srgb, var(--t-fons) 92%, transparent);
	}

	.carta :global(.leaflet-control-attribution a) {
		color: var(--t-aur-clar);
	}

	/* L'échelle : nette (Leaflet ajoute une ombre blanche décalée d'un pixel
	   au texte, qui le rendait gras et flou sur fond sombre ; pas de verre
	   flouté non plus derrière) */
	.carta :global(.leaflet-control-scale-line) {
		background: color-mix(in srgb, var(--t-fons) 88%, transparent);
		border: 1px solid var(--t-aur);
		border-top: none;
		color: var(--t-tinta);
		text-shadow: none;
		font-weight: 400;
		font-size: 0.72rem;
		letter-spacing: 0.03em;
		line-height: 1.3;
		padding: 1px 6px 2px;
		border-radius: 0 0 4px 4px;
	}

	/* Bulles des lieux et des couches */
	.carta :global(.leaflet-popup-content-wrapper),
	.carta :global(.leaflet-popup-tip) {
		background: var(--t-fons-2);
		color: var(--t-tinta);
		box-shadow:
			0 0 0 1px var(--t-linha),
			0 14px 34px rgba(0, 0, 0, 0.4);
	}

	.carta :global(.leaflet-popup-content-wrapper) {
		border-radius: 14px;
	}

	.carta :global(.leaflet-popup-content) {
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.carta :global(.leaflet-popup-content strong) {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.15rem;
		color: var(--t-aur-clar);
	}

	.carta :global(.leaflet-popup-close-button) {
		color: var(--t-tinta-2) !important;
	}

	.carta :global(.cola-estelas) {
		pointer-events: none;
	}

	/* La flèche du nord rejoint les outils de lecture de la carte, en bas à
	   gauche : centrée au-dessus du bouton des calques (2,8 rem, à 3,5 rem du
	   bas), avec le même souffle entre chaque élément. En haut, elle collait au
	   logo du bandeau (retour de Romain, 2026-10-07). */
	.compass {
		position: absolute;
		bottom: 7.5rem;
		left: calc(var(--marge, 1rem) + 1.4rem - 15px);
		z-index: 900;
		color: var(--t-aur);
		opacity: 0.85;
		pointer-events: none;
	}

	/* Telefon : las aisinas de lectura se lèvan sus la barra de las jaces */
	.carta :global(.leaflet-bottom) {
		bottom: var(--barra-bas, 0px);
	}
	@container carta (max-width: 600px) {
		.compass {
			bottom: calc(var(--barra-bas, 0px) + 2.9rem);
			left: 0.85rem;
		}
	}

	/* Las autras lengas de França : lor nom dins la lenga meteissa, en
	   capitalas espaçadas, de la color de l'aur ; un clic dona la ficha */
	.carta :global(.lenga-franca) {
		width: auto !important;
		height: auto !important;
		background: none;
		border: 0;
	}
	.carta :global(.lenga-franca span) {
		display: inline-block;
		transform: translate(-50%, -50%);
		padding: 2px 6px;
		border-radius: 10px;
		font: 600 11px/1.2 var(--font-body);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		white-space: nowrap;
		color: var(--t-aur-clar);
		text-shadow:
			0 0 4px var(--t-fons),
			0 0 8px var(--t-fons);
		cursor: pointer;
	}
	.carta :global(.lenga-franca:focus-visible span) {
		outline: 2px solid var(--t-aur);
	}
	/* de luènh, los ponches s'escantisson (las lengas de França demòran) */
	.carta :global(.leaflet-marker-pane > :not(.lenga-franca)) {
		transition: opacity 0.45s;
	}
	.carta:global(.luenh) :global(.leaflet-marker-pane > :not(.lenga-franca)) {
		opacity: 0;
		pointer-events: none;
	}
	/* d'outra mar sonque quand se dezooma fins al mond, e l'invèrse */
	.carta:not(:global(.zoom-mond)) :global(.lenga-franca.outremer),
	.carta:global(.zoom-mond) :global(.lenga-franca:not(.outremer)) {
		display: none;
	}

	.compass text {
		font-family: var(--font-quote);
		font-style: italic;
		font-weight: 500;
		font-size: 11px;
		fill: var(--t-aur-clar);
	}

	/* Thème clair, fond OSM : on atténue les routes colorées sans toucher aux
	   couches (dialectes, lieux), qui sont dans un autre pan Leaflet. */
	.carta.muted :global(.leaflet-tile-pane) {
		filter: grayscale(65%) brightness(1.08) contrast(0.92);
	}

	/* Thème sombre : la carte OSM passe « de nuit » (couleurs inversées puis
	   réchauffées vers la braise), pour se fondre sous les étoiles */
	.carta.nuech :global(.leaflet-tile-pane) {
		filter: invert(1) hue-rotate(180deg) brightness(0.88) contrast(0.9) sepia(0.35) saturate(0.75);
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
