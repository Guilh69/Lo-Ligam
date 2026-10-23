<script>
	import Icona from '$lib/components/Icona.svelte';
	import { onMount, onDestroy, untrack } from 'svelte';
	import { cargarFranca, francaCargada, dinsFranca } from '$lib/carta/franca.js';
	import { crearDonadasLengas } from '$lib/carta/donadasLengas.js';
	import { zoomDoç } from '$lib/carta/zoomDoc.js';
	import { crearNomsComunas } from '$lib/carta/nomsComunas.js';
	import { contornComuna } from '$lib/carta/contornComuna.js';
	import FichaComuna from './FichaComuna.svelte';
	import { fly } from 'svelte/transition';
	import 'leaflet/dist/leaflet.css';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { cargarColas } from '$lib/carta/colasBasa.js';
	import { tampaDefòra } from '$lib/tampaDefora.js';
	import { estatCarta, ecranCarta } from '$lib/carta/estatCarta.svelte.js';
	import { crearColaMar } from '$lib/carta/colaMar.js';
	import { crearColaEstelas, estilVila, rencVila } from '$lib/carta/colaEstelas.js';
	import { Z, KM, zDès, zCran, zPlaja, OCCITANAS, PLAJAS, fixarLatEscala, fixarEcran, nivèlsDezoom, aDetalh, aTenchas } from '$lib/carta/escalas.js';
	import { sonsEntrada } from '$lib/carta/sons.js';
	import { crearColaDonadas, COLORS as COLORS_DIAL } from '$lib/carta/colaDonadas.js';
	import { crearColaTematica } from '$lib/carta/colaTematica.js';
	import { crearColaLenga } from '$lib/carta/colaLenga.js';
	import { LENGAS, esOccitan, fonsLenga } from '$lib/carta/lengas.js';
	import { JACES_DONADAS, JACES_TEMATICAS, JACES_LENGAS, ICONAS_JACES } from '$lib/carta/catalogue.js';
	import { ICONAS } from '$lib/carta/iconas.js';
	import { degatjar, zonaEtiqueta, zonaCaixa, placeVisible, DEFAUT } from '$lib/carta/degatjament.js';
	import { NOMS_FRANCES } from '$lib/carta/nomsFrances.js';
	import { LUOCS } from '$lib/acuelh/carta-estelas.js';
	import CercaCarta from './CercaCarta.svelte';
	import VotzAtlas from './VotzAtlas.svelte';
	import { cargarVotz } from '$lib/carta/votz.js';
	import { ponchesEnsenhament, ponchesCorses } from '$lib/carta/ensenhament.js';
	import { crearPonchs } from '$lib/carta/colaPonchs.js';

	// Los punts e las jaces de l'admin venon de Supabase (taulas carta_luocs,
	// carta_colas — geridas dins /admin/carta) puslèu que
	// d'èsser escriches en dur aicí. Cargats dins onMount, abans de bastir la
	// carta, per evitar tota corsa entre l'afichatge e las donadas.
	//
	// Los punts son gropats per còla (colomna cola_id de carta_luocs) :
	// « lieusInteres », « librarias », e tota còla de punts venenta — cap de
	// còdi novèl serà de besonh, sonque una linha dins carta_colas e de punts.
	let colaColors = {};
	let colaOpacitats = {};

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
				'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> · SRTM · relèu © <a href="https://opentopomap.org/" target="_blank" rel="noopener">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC BY-SA</a>)'
		},
		// Satellit : fotografias aerianas publicas (crearSatellit)
		satellite: { satellit: true }
	};

	// Lo satellit : las fotografias aerianas liuras mai polidas, una per
	// país — IGN (França, Licéncia dobèrta 2.0) e PNOA (Espanha : Val d'Aran,
	// Catalonha ; CC BY 4.0). Pas mai d'EOX (Sentinel-2) : sa licéncia es non
	// comerciala, e una carta gratuita que mena a de corses pagants i
	// escaparà pas (decision de Romain, 2026-10-09). Las valadas d'Itàlia
	// gardan la carta OSM tant qu'una font liura i es pas verificada.
	// (l'IGN tòrna un 404 defòra França : lo PNOA, dejós, pren lo relais)
	const SATELLIT = [
		{
			url: 'https://www.ign.es/wmts/pnoa-ma?request=GetTile&service=WMTS&VERSION=1.0.0&Layer=OI.OrthoimageCoverage&Style=default&Format=image/jpeg&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
			bounds: [[40.5, 0.15], [42.87, 3.33]],
			attribution: 'PNOA © <a href="https://www.scne.es" target="_blank" rel="noopener">IGN España</a> (CC BY 4.0)'
		},
		{
			url: 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/jpeg&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
			bounds: [[41.3, -5.2], [51.1, 9.6]],
			attribution: 'Fotografias aerianas © <a href="https://geoservices.ign.fr" target="_blank" rel="noopener">IGN</a> (Licéncia dobèrta 2.0)'
		}
	];
	function crearSatellit(opts = {}) {
		// son pròpri plan, defòra del filtre « de nuèch » de las tuèlas OSM (que
		// las inversa) : una fotografia s'escurcís sens s'inversar
		if (!map.getPane('satellit')) {
			const p = map.createPane('satellit');
			// (jos los nívols de la revelacion, 250, coma las tuèlas OSM)
			p.style.zIndex = 210;
			p.classList.add('pan-satellit');
		}
		const cs = SATELLIT.map(({ url, bounds, attribution }) => L.tileLayer(url, { maxZoom: 19, bounds, attribution, pane: 'satellit', ...opts }));
		// lo servidor de l'IGN refusa una part de las demandas quand ne recep
		// fòrça d'un còp (un grand ecran, un zoom) : una tuèla mancada se
		// torna demandar, de mai en mai tard, puslèu que de daissar un trauc
		// (una adreça un pauc cambiada : lo navegador gardava l'error en
		// memòria e tornava pas demandar)
		// Entretant, la tuèla del nivèl de dessús (ja dins lo cache) cobrís lo
		// trauc : un pauc mai flo, mas pas un carrat de color sul negre
		for (const c of cs)
			c.on('tileerror', ({ tile, coords }) => {
				const n = (tile._essais = (tile._essais ?? 0) + 1);
				if (n === 1 && coords.z > 0) {
					const paire = L.Util.template(c._url, { ...c.options, x: coords.x >> 1, y: coords.y >> 1, z: coords.z - 1 });
					tile.style.background = `url("${paire}") ${coords.x & 1 ? '100%' : '0'} ${coords.y & 1 ? '100%' : '0'} / 200% 200%`;
					tile.classList.add('leaflet-tile-loaded');
				}
				if (n > 5) return;
				setTimeout(() => tile.isConnected && (tile.src = c.getTileUrl(coords) + '&essai=' + n), 200 * 2 ** n + Math.random() * 300);
			});
		// la mar al larg, en fondut fins a la còsta (l'IGN i es blanc de prèp)
		const mar = crearColaMar(L).setOpacity(opts.opacity ?? 1);
		const g = L.layerGroup([...cs, mar]);
		g.setOpacity = (o) => (cs.forEach((c) => c.setOpacity(o)), mar.setOpacity(o), g);
		g.isLoading = () => cs.some((c) => c.isLoading?.());
		return g;
	}

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
		// la lecture de la carte : 0 lo territòri (teintes pleines), 1 « uèi », 2 « la
		// reviscolada » (teintes estompées dans les deux cas : setLectura borne à 1) ;
		// la page tient les couches de chaque lecture
		lectura = 0,
		// lo dialècte causit (còdi, 'cro' pel Creissent, o null) : de la carta al
		// panèl e del panèl a la carta
		causits = $bindable([]),
		// lo mòde visualizacion (plen ecran) : la pagina lo gerís, lo boton es
		// sus la carta
		visualizacion = false,
		onVisualizacion = null,
		// (una lenga vesina a alucar, quand se clica sus son domeni)
		onAlucar = null,
		// (lo boton « Netejar la carta », dessús lo de l'Occitània)
		onNetejar = null
	} = $props();
	// la zòna dialectala survolada o causida, dins la legenda d'en bas
	let survòl = $state(null);
	let causida = $state(null);
	// lo meteis per las autras lengas (lo catalan, l'arpitan…), una per lenga
	let survòlsLengas = $state({});
	let causidasLengas = $state({});
	const survòlLenga = $derived(Object.values(survòlsLengas).find(Boolean) ?? null);
	const causidaLenga = $derived(Object.values(causidasLengas).find(Boolean) ?? null);
	// una comuna, un parc o una província survolada passa davant
	let survòlTem = $state(null);
	const legendaDial = $derived(survòlTem ?? causida ?? causidaLenga ?? survòl ?? survòlLenga);
	let colaEstelas;
	// Jaces del catalògue pintadas pel site (frontièra, dialèctes, Creissent,
	// regions, despartaments) : sus totes los fonses
	let colaDonadas;
	// Las autras lengas (lo catalan, l'arpitan…) : una còla per lenga declarada
	const colasLengas = {};
	// las vilas e la còsta de cada lenga (de sas donadas), per la carta en estelas
	const fonsLengas = {};
	// La couche active de la légende (façon QGIS, Romain 2026-10-19) : la
	// dernière allumée, ou celle dont on a touché le nom (RailJaces) ; elle seule
	// répond au clic et au double clic sur la carte, même sous d'autres couches.
	// Sans couche active (ou éteinte), l'ordre habituel des couches.
	const activa = () => {
		const a = estatCarta.activa;
		return a && visibility[a] ? a : null;
	};
	// (une autre couche que celle-ci est active : elle lui cède la place)
	const cedirAActiva = (id) => {
		const a = activa();
		return !!a && a !== id;
	};
	// (una zòna d'una autra lenga jos lo ponch ; sauf : la lenga que demanda)
	const zonaLengaA = (lp, sauf = null) => Object.entries(colasLengas).some(([id, c]) => id !== sauf && map?.hasLayer(c) && !!c.zonaA(lp));
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
		oc: { mai: 'Apropar', mens: 'Alunhar', tampar: 'Tampar', carta: "Carta de l'occitan", plen: 'Carta en plen ecran', sortir: 'Quitar lo plen ecran' },
		fr: { mai: 'Zoom avant', mens: 'Zoom arrière', tampar: 'Fermer', carta: "Carte de l'occitan", plen: 'Carte en plein écran', sortir: 'Quitter le plein écran' }
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
	// lo boton del plen ecran : son icòna e son tèxte seguisson lo mòde
	let botonPlen = null;
	const ICONA_PLEN = {
		dintrar: '<path d="M4 8v-2a2 2 0 0 1 2 -2h2"/><path d="M4 16v2a2 2 0 0 0 2 2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M16 20h2a2 2 0 0 0 2 -2v-2"/>',
		sortir: '<path d="M15 19v-2a2 2 0 0 1 2 -2h2"/><path d="M15 5v2a2 2 0 0 0 2 2h2"/><path d="M5 15h2a2 2 0 0 1 2 2v2"/><path d="M5 9h2a2 2 0 0 0 2 -2v-2"/>'
	};
	function majPlen() {
		if (!botonPlen) return;
		const t = TÈXTES_LEAFLET[lang] ?? TÈXTES_LEAFLET.oc,
			tx = visualizacion ? t.sortir : t.plen;
		botonPlen.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${visualizacion ? ICONA_PLEN.sortir : ICONA_PLEN.dintrar}</svg>`;
		botonPlen.title = tx;
		botonPlen.setAttribute('aria-label', tx);
		botonPlen.setAttribute('aria-pressed', String(!!visualizacion));
	}
	$effect(() => {
		visualizacion;
		lang;
		majPlen();
	});
	// « Cap a l'Occitània » (demanda de Romain, 2026-10-09) : un boton al costat
	// del plen ecran e del zoom ; quin que siá l'endrech, la vista d'ensemble,
	// lo domeni e los dialèctes, en fuòc d'artifici. L'icòna : lo contorn del
	// domeni occitan, simplificat (limits-carta.json)
	const ICONA_OC =
		'M16.0 15.7L14.1 15.1L12.3 16.2L12.0 17.2L9.3 18.1L4.1 17.4L2.9 15.4L2.0 15.4L2.8 11.7L3.3 11.8L2.7 11.8L3.1 8.9L4.1 10.6L5.3 10.7L6.5 7.3L8.1 6.2L10.5 5.9L13.6 7.1L13.5 8.2L14.4 9.5L16.6 9.8L18.0 11.1L19.0 10.3L21.3 10.7L21.0 11.4L22.0 13.5L19.9 16.2L18.1 16.6L16.4 15.7L16.8 15.3L16.3 15.1L16.0 15.7Z';
	let botonOc = null;
	function majTornarOc() {
		if (!botonOc) return;
		const tx = lang === 'fr' ? "Cap sur l'Occitanie" : "Cap a l'Occitània"; // (causit per Romain)
		botonOc.title = tx;
		botonOc.setAttribute('aria-label', tx);
	}
	$effect(() => {
		lang;
		majTornarOc();
	});
	let botonNet = null;
	function majNetejar() {
		if (!botonNet) return;
		const tx = lang === 'fr' ? 'Vider la carte : éteindre toutes les couches' : 'Netejar la carta : escantir totas las jaces';
		botonNet.title = tx;
		botonNet.setAttribute('aria-label', tx);
	}
	$effect(() => {
		lang;
		majNetejar();
	});
	// Las fonts de la carta (retorn de Romain, 2026-10-10 : « illisible ») : una
	// linha corta totjorn vesibla (© OpenStreetMap, obligatòri) e un boton
	// « Fonts » que dobrís la lista completa de las jaces afichadas, rengada per
	// tèma (« Rius, còsta e païses : Natural Earth · noms : © OpenStreetMap »)
	let fontsCarta = $state([]),
		fontsDobèrtas = $state(false);
	const fontsPerTèma = $derived.by(() => {
		const tèmas = new Map();
		for (const html of fontsCarta)
			for (const tròç of html.split(/\s+·\s+/)) {
				const m = tròç.match(/^([^<:]{2,60}?)\s*:\s*([\s\S]+)$/);
				const tèma = m ? m[1].trim() : '';
				const font = (m ? m[2] : tròç).trim();
				const k = tèma.toLowerCase();
				if (!tèmas.has(k)) tèmas.set(k, { tèma: tèma ? tèma[0].toUpperCase() + tèma.slice(1) : '', fonts: [] });
				if (!tèmas.get(k).fonts.includes(font)) tèmas.get(k).fonts.push(font);
			}
		return [...tèmas.values()].sort((a, b) => (!a.tèma) - (!b.tèma));
	});
	$effect(() => {
		if (!fontsDobèrtas) return;
		const lèva = tampaDefòra((t) => !!t.closest('.fonts-carta, .fonts-b'), () => (fontsDobèrtas = false));
		const tòca = (e) => e.key === 'Escape' && (fontsDobèrtas = false);
		document.addEventListener('keydown', tòca);
		return () => {
			lèva();
			document.removeEventListener('keydown', tòca);
		};
	});
	let botonFons = null;
	function majFons() {
		if (!botonFons) return;
		const tx = lang === 'fr' ? 'Fond de carte' : 'Fons de carta';
		botonFons.title = tx;
		botonFons.setAttribute('aria-label', tx);
	}
	$effect(() => {
		lang;
		majFons();
	});
	function tornarALOccitan() {
		onAlucar?.('unificat', false);
		onAlucar?.('frontiera');
		onAlucar?.('dialectes');
		colaDonadas?.demandarBalet();
		anarALaVistaOccitana('dialectes');
	}
	// arrèst de l'entrada en scèna (sons, escotas) quand se quita la pagina
	let quitarIntro = null;
	let L;
	let pointLayers = {};
	// l'etiqueta del departament o de la region revelats (colaEstelas onLegenda)
	let legendaTer = $state(null);
	// la tela dels ponches e sos grops (colaPonchs.js) : de luènh, una sola tela
	let ponchs = null;
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
					onPus: (p) => marcarPus(p),
					zonasUI,
					cedir: (lp) => !!(colaDonadas && map.hasLayer(colaDonadas) && colaDonadas.enclavaA(lp)) || !!colaTematica?.ocupat(lp) || zonaLengaA(lp) || vesinaPren(lp),
					activa,
					onTerritori: dessenharTerritori,
					// de luènh, un clic sus una vila i vòla : a l'arribada, sa comuna es
					// causida (contorn e ficha, sens segond clic ; retorn de Romain 2026-10-23)
					onVol: (l) => map.once('moveend', () => causirComunaA(l.lat, l.lon)),
					// l'etiqueta del territòri revelat : un element de la pagina, al dessús
					// dels noms de las comunas e dels ponches
					onLegenda: (l) => (legendaTer = l)
				});
				for (const id of JACES_LENGAS) colaEstelas.setLengaFons(id, visibility[id] ? (fonsLengas[id] ?? null) : null);
				colaEstelas.setNomsDobles(lang === 'fr' ? 'fr' : null, polissaSota);
				colaEstelas.setElements(elementsVesibles());
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
		currentBaseTileLayer = cfg.satellit
			? crearSatellit()
			: L.tileLayer(cfg.url, {
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
	// Fons « estelas » : en s'aprochant (vèrs 20 km, Z.RELAIS), lo plan
	// estelat cedís la plaça al satellit, sens passar per la carta OSM
	// (demanda de Romain, 2026-10-09) ; nòstres noms occitans passan al
	// dessús. En dejós del lindal, cap de tuèla es pas demandada (sobrietat).
	function majDetalh() {
		if (!map || baseLayer !== 'estelas') return;
		const z = map.getZoom();
		if (z >= Z.PRECARGA) {
			if (!currentBaseTileLayer) {
				currentBaseTileLayer = crearSatellit({ opacity: 0 });
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

	// Jaces de zònas e de linhas GENERICAS : descrichas entièrament dins
	// carta_colas (tipe, fichièr geojson_url, color, opacitat, pes de linha,
	// puntejat, plantilha de popup) — creablas dempuèi /admin/carta sens cap de
	// còdi. Los dialèctes, la frontièra, lo Creissent e los contorns
	// administratius son pintats per la còla de donadas (colaDonadas.js).
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

	// Cada punt : una pastilha de veire amb l'icòna de sa jaça (Tabler Icons,
	// MIT), de la color de la jaça ; las colors de basa venon del tèma
	const ICONA_COLA = { lieusInteres: 'building-arch', librarias: 'books', festas: 'confetti', limsi: 'microphone-2', ...ICONAS_JACES };
	// una jaça apondida dins l'admin pren sa color de la basa
	// Las lengas vesinas (demanda de Romain, 2026-10-09 : « une incitation à
	// découvrir ce qui se passe à côté ») : al survòl (o al tòc) d'una lenga pas
	// alucada, la carta prepausa de la descobrir ; un clic l'aluca. Sonque lo
	// contorn leugièr de lor domeni (lengas-vesinas.json, 12 Ko), pas tota la jaça
	let vesinas = null,
		vesinasPromesa = null,
		vesina = $state(null);
	const cargarVesinas = () =>
		(vesinasPromesa ??= fetch('/data/lengas-vesinas.json')
			.then((r) => (r.ok ? r.json() : null))
			.then((d) => (vesinas = d))
			.catch(() => null));
	function dinsAnels(anels, x, y) {
		let d = false;
		for (const a of anels)
			for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
				const [xi, yi] = a[i],
					[xj, yj] = a[j];
				if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
			}
		return d;
	}
	function vesinaA(ll) {
		if (!vesinas) return null;
		// dins lo mòde Lengas : la part d'a l'estrangièr d'una lenga afichada sonque
		// en França prepausa de descobrir la rèsta, a totas las escalas (Romain, 2026-10-10)
		if (estatCarta.mòde === 'lengas' && francaCargada() && !dinsFranca(ll.lat, ll.lng))
			for (const [k, anels] of Object.entries(vesinas))
				if (k !== 'franca' && !amagada(k) && nomésFrança(k) && dinsAnels(anels, ll.lng, ll.lat)) return 'rèsta:' + k;
		// L'invitation, à toutes les échelles et partout dans une langue prévue par
		// le site (retour de Romain, 2026-10-19 : les langues d'oïl n'apparaissaient
		// jamais, cachées par les départements, ni rien à 40 km et moins)
		// Au-delà de 400 km, une autre langue invite à découvrir la diversité
		// linguistique de la France : la couche « Lengas de França », une étiquette
		// par langue (Romain, 2026-10-19 : les langues une à une à partir de 400 km)
		const luènh = map && map.getZoom() < zDès(400, map.getCenter().lat) - 0.01;
		for (const [k, anels] of Object.entries(vesinas))
			if (amagada(k) && dinsAnels(anels, ll.lng, ll.lat)) return !luènh || k === 'occitan' ? k : visibility.lengasFranca ? null : 'lengasFranca';
		return null;
	}
	// Le clic sur une langue cachée l'allume tout de suite, sauf quand il sert
	// déjà à autre chose : de près (40 km et moins), le clic est pour les
	// départements et les villes (Romain, 2026-10-10) ; un département, une
	// région ou une zone thématique sous le pointeur passent d'abord. Le clic fait
	// alors son office et l'invitation s'affiche en bouton.
	// (retorn de Romain, 2026-10-23 : « pourquoi ça sélectionne la région quand
	// l'option découvrir les langues d'oïl est affichée ? ») : regions e
	// despartaments prenon lo clic sonque se lor jaça es alucada ; si que non,
	// l'invitacion afichada es per el
	function clicPres(ll) {
		if (survòlTem) return true;
		if (map && map.getZoom() >= zDès(40, map.getCenter().lat) - 0.01) return true;
		return !!(visibility.regions || visibility.despartaments);
	}
	// una lenga amagada jos lo ponch, que lo clic alucariá : los territòris (lo
	// despartament o la region revelats al clic dins un vuèg) li cedisson
	const vesinaPren = (lp) => {
		if (!vesinas || !map) return false;
		const ll = map.layerPointToLatLng(lp);
		return !!vesinaA(ll) && !clicPres(ll);
	};
	// una lenga pas afichada : lo catalan, l'arpitan… decochats ; l'occitan, quand
	// sos dialèctes e l'occitan unificat son levats (« Netejar la carta »)
	const amagada = (k) => (k === 'occitan' ? !visibility.dialectes && !visibility.unificat : LENGAS[k] && !visibility[k]);
	// (noms de validar per Romain)
	const vocala = (t) => /^[aeiouàèéíòóúh]/i.test(t);
	const descVesina = (kod) => {
		if (kod === 'lengasFranca')
			return {
				kod,
				lang: lang === 'fr' ? 'fr' : 'oc',
				endo: lang === 'fr' ? 'Langues de France' : 'Lengas de França',
				oc: 'Descobrir la diversitat lingüistica de França',
				fr: 'Découvrir la diversité linguistique de la France'
			};
		const rèsta = kod.startsWith('rèsta:'),
			k = rèsta ? kod.slice(6) : kod;
		const n = LENGAS[k]?.nom ?? { oc: 'occitan', fr: 'occitan', endo: 'occitan' };
		// (un plural, « lengas d'oïl » : « las », « les »)
		const art = (t, pl, v, m) => (/^(lengas|langues) /.test(t) ? pl : vocala(t) ? v : m);
		if (rèsta)
			return {
				kod,
				endo: n.endo,
				oc: 'Descobrir la rèsta ' + art(n.oc, 'de las ', "de l'", 'del ') + n.oc,
				fr: 'Découvrir le reste ' + art(n.fr, 'des ', "de l'", 'du ') + n.fr
			};
		return { kod: k, endo: n.endo, oc: 'Descobrir ' + art(n.oc, 'las ', "l'", 'lo ') + n.oc, fr: 'Découvrir ' + art(n.fr, 'les ', "l'", 'le ') + n.fr };
	};
	function alucarVesina(k) {
		vesina = null;
		colaEstelas?.amagarLegenda(false);
		mapEl?.classList.remove('sus-vesina');
		// (la rèsta d'una lenga afichada en França : son environament)
		if (k.startsWith('rèsta:')) return void (estatCarta.environament = [...estatCarta.environament, k.slice(6)]);
		// (l'occitan : son domeni e sos dialèctes, la vista d'ensemble, lo fuòc d'artifici)
		if (k === 'occitan') tornarALOccitan();
		else onAlucar?.(k);
	}
	// (los ponches d'una jaça que se decocha, en camin de partir)
	const partidas = {};
	// (cada ponch s'aluca a son moment : un pichon retard a l'azard)
	const estilPunt = (cid) => ` style="--retard:${Math.round(Math.random() * 900)}ms;${colaColors[cid] && !(cid in ICONA_COLA) ? `--ponch:${escapeHtml(colaColors[cid])}` : ''}"`;
	const iconaPunt = (cid, st = estilPunt(cid)) =>
		L.divIcon({
			className: 'ponch-jaça ponch-jaça-' + cid,
			html: `<span class="ponch-estela"${st}></span><span class="ponch-fil"><i class="ponch-cueta"${st}></i></span><span class="ponch-pos"><span class="ponch"${st}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONAS[ICONA_COLA[cid] ?? 'building-arch']}</svg></span></span>`,
			// l'icòna es sul luòc (talha nula) : sa pastilha se ten al dessús, o se
			// descala amb un fil quand amaga un nom de vila (degatjarPonchs)
			iconSize: [0, 0],
			iconAnchor: [0, 0],
			popupAnchor: [DEFAUT[0], DEFAUT[1] - 11]
		});

	// Las accions d'una bulla (retorn de Romain, 2026-10-08 : pas d'adreça
	// brutla, mas çò que fa lo clic, « Contactar aquesta Calandreta ») : una
	// icòna e un vèrb ; un ligam cap a defòra s'obrís dins una novèla fenèstra
	// e o ditz (RGAA)
	const TÈXTES_ACCIONS = {
		oc: { novèla: 's’obrís dins una novèla fenèstra', site: 'Veire lo site', nav: 'Dobrir dins mon aplicacion de navigacion', osm: 'Veire sus OpenStreetMap', osmTanben: 'o sus OpenStreetMap' },
		fr: { novèla: 's’ouvre dans une nouvelle fenêtre', site: 'Voir le site', nav: 'Ouvrir dans mon application de navigation', osm: 'Voir sur OpenStreetMap', osmTanben: 'ou sur OpenStreetMap' }
	};
	const txAccions = () => TÈXTES_ACCIONS[lang] ?? TÈXTES_ACCIONS.oc;
	const accionBulla = (icona, href, tèxt, defòra = false) =>
		`<a class="accion-bulla" href="${escapeHtml(href)}"${
			defòra ? ` target="_blank" rel="noopener" title="${escapeHtml(tèxt + ' (' + txAccions().novèla + ')')}"` : ''
		}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONAS[icona]}</svg><span>${escapeHtml(tèxt)}</span></a>`;

	// Localizar un luòc dins l'aplicacion de navigacion de la persona : sus
	// Android, un ligam geo: (lo sistèma prepausa las aplicacions installadas :
	// Organic Maps, OsmAnd, Google…) ; sus iPhone e iPad, Plans d'Apple (dins
	// l'UE, l'aplicacion de navigacion causida per defaut) ; sus ordenador,
	// OpenStreetMap. Cap de servici de pistatge. Sus mobil, un ligam OpenStreetMap
	// en mai, se cap d'aplicacion respond. (Recèrca verificada lo 2026-10-08.)
	const encNom = (t) => encodeURIComponent(String(t).normalize('NFC').trim()).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
	function accionsNav(lat, lon, nom) {
		if (!Number.isFinite(+lat) || !Number.isFinite(+lon)) return '';
		const la = Number(lat).toFixed(6),
			lo = Number(lon).toFixed(6),
			n = encNom(nom),
			ua = navigator.userAgent,
			t = txAccions();
		const osm = `https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=18/${la}/${lo}`;
		const android = /Android/i.test(ua) || (/Linux/.test(ua) && !/CrOS/.test(ua) && navigator.maxTouchPoints > 0);
		const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
		if (!android && !ios) return accionBulla('map-pin', osm, t.osm, true);
		const href = android ? `geo:${la},${lo}?q=${la},${lo}(${n})` : `https://maps.apple.com/place?coordinate=${la},${lo}&name=${n}`;
		return accionBulla('map-pin', href, t.nav) + `<a class="accion-bulla segonda" href="${escapeHtml(osm)}" target="_blank" rel="noopener">${escapeHtml(t.osmTanben)}</a>`;
	}

	// Las Calandretas (annuari de l'educacion, Licéncia dobèrta) : un fichièr
	// estatic, cargat a la primièra activacion de la jaça
	let calandretasCargadas = false;
	// la comuna de l'annuari (en francés) en occitan, quand la carta coneis son nom
	const OC_DE_FR = Object.fromEntries(Object.entries(NOMS_FRANCES).map(([oc, fr]) => [fr, oc]));
	const comunaOc = (c) => OC_DE_FR[(c ?? '').replace(/ \d+(e|er) Arrondissement$/, '')] ?? c;
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
		calandretas = [];
		pointLayers.calandretas = ponchs.grop(
			d.features.map((f) => {
				const [lon, lat] = f.geometry.coordinates;
				const q = f.properties;
				// Contactar l'escòla (retorn de Romain : pas l'adreça brutla, mas
				// « Contactar aquesta Calandreta ») : son corrièl (lo de l'annuari
				// del ministèri), son telefòn, e son site se n'a un
				const fr = lang === 'fr';
				const accions = [
					q.corrièl ? accionBulla('mail', 'mailto:' + q.corrièl, fr ? 'Contacter cette Calandreta' : 'Contactar aquesta Calandreta') : '',
					q.telefon ? accionBulla('phone', 'tel:' + q.telefon.replace(/\s/g, ''), (fr ? 'Appeler' : 'Sonar') + ' (' + q.telefon + ')') : '',
					/^https:\/\//.test(q.ligam ?? '') ? accionBulla('world', q.ligam, fr ? 'Voir son site' : 'Veire son site', true) : '',
					accionsNav(lat, lon, q.nom + ' ' + q.comuna)
				].join('');
				const ligam = accions ? `<span class="accions-bulla">${accions}</span>` : '';
				const cap = `<strong>${escapeHtml(q.nom)}</strong><br>${escapeHtml(mena[q.mena] ?? q.mena)} · ${escapeHtml(lang === 'fr' ? q.comuna : comunaOc(q.comuna))}`;
				const m = dobleClicSus(L.marker([lat, lon], { icon: iconaPunt('calandretas'), title: q.nom, keyboard: true }).bindPopup(cap + ligam));
				// (per la mai pròcha : la distància s'insertís jos lo nom)
				calandretas.push({ lat, lon, m, cap, ligam });
				return m;
			}),
			'calandretas'
		);
		if (d.font) map.attributionControl?.addAttribution(d.font);
		if (visibility.calandretas) pointLayers.calandretas.addTo(map);
	}

	// L'ensenhament de l'occitan, levat de las Calandretas (decision de Romain,
	// 2026-10-23 ; SIG/ensenhament) : un fichièr per quatre jaces de la familha
	// Ensenhament ; los ponches se fabrican dins ensenhament.js
	const JACES_ENSENHAMENT = ['ensBilingue', 'ensEscola', 'ensSegond', 'ensSuperior'];
	let ensenhamentCargat = false;
	async function cargarEnsenhament() {
		if (ensenhamentCargat || !map) return;
		ensenhamentCargat = true;
		const d = await fetch('/data/ensenhament.json')
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null);
		if (!d?.ponches) return (ensenhamentCargat = false);
		for (const [id, ms] of Object.entries(ponchesEnsenhament(d.ponches, { L, lang, iconaPunt, dobleClicSus, accionsNav, escapeHtml, comunaOc }))) {
			pointLayers[id] = ponchs.grop(ms, id);
			if (visibility[id]) pointLayers[id].addTo(map);
		}
		if (d.font) map.attributionControl?.addAttribution(d.font);
	}
	// los corses per adults : las associacions dels cercles que ne donan
	let corsesCargats = false;
	async function cargarCorses() {
		if (corsesCargats || !map) return;
		corsesCargats = true;
		const d = await fetch('/data/cercles.geojson')
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null);
		if (!d?.features) return (corsesCargats = false);
		pointLayers.corsAdults = ponchs.grop(ponchesCorses(d.features, { L, lang, iconaPunt, dobleClicSus, accionsNav, escapeHtml }), 'corsAdults');
		if (visibility.corsAdults) pointLayers.corsAdults.addTo(map);
	}

	// Los cercles e las associacions (decision de Romain, 2026-10-23 ;
	// SIG/cercles) : un fichièr per doas jaces, « l » la lenga, « c » la
	// cultura. Ponch plen : activitat provada (ret, carta de l'OPLO, agenda) ;
	// vuèg : sonque declarada en prefectura dempuèi 2021
	let cerclesCargats = false;
	const FONTS_CERCLES = {
		ag: { oc: 'agenda Lo CalenDiari', fr: 'agenda Lo CalenDiari', ligam: (u) => 'https://openagenda.com/agendas/41454951/events/' + u },
		ieo: { oc: "guida de l'IEO", fr: "guide du réseau IEO", ligam: () => 'https://ieo-opm.com/wp-content/uploads/GuideReseauIEO2026.pdf' },
		fp: { oc: 'Félibrige', fr: 'Félibrige', ligam: () => 'https://provence.felibrige.org/escolo-felibrenco-prouvenco/' },
		fa: { oc: 'Félibrige', fr: 'Félibrige', ligam: () => 'https://aquitaine.felibrige.org/escolo-felibrenco-aquitani/' },
		fl: { oc: 'Félibrige', fr: 'Félibrige', ligam: () => 'https://limousin.felibrige.org/escolo-felibrenco-dou-limousin/' },
		op: { oc: "carta de l'OPLO", fr: "carte de l'OPLO", ligam: () => 'https://umap.openstreetmap.fr/fr/map/actors-de-terren-siti_1186246' },
		ar: { oc: "Registre d'entitats de Catalunya", fr: "Registre d'entitats de Catalunya", ligam: () => 'https://analisi.transparenciacatalunya.cat/d/y6fz-g3ff' }
	};
	// lo debat sul provençal, mencionat coma una informacion (Romain, 2026-10-23)
	const DEBAT_PROVENÇAL = {
		oc: "D'associacions provençalas tenon lo provençal per una autra lenga que l'occitan : lo debat existís.",
		fr: "Certaines associations provençales tiennent le provençal pour une langue distincte de l'occitan : le débat existe."
	};
	async function cargarCercles() {
		if (cerclesCargats || !map) return;
		cerclesCargats = true;
		const d = await fetch('/data/cercles.geojson')
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null);
		if (!d?.features) return (cerclesCargats = false);
		const fr = lang === 'fr';
		const grops = { cercles: [], culturaOc: [] };
		for (const f of d.features) {
			const [lon, lat] = f.geometry.coordinates;
			const q = f.properties;
			const cid = q.m === 'c' ? 'culturaOc' : 'cercles';
			const fonts = (q.p ?? []).map(([k, data, u]) => {
				const s = FONTS_CERCLES[k];
				const quand = k === 'ag' && data ? ' (' + data.split('-').reverse().join('/') + ')' : '';
				return `<a href="${escapeHtml(s.ligam(u))}" target="_blank" rel="noopener">${escapeHtml(fr ? s.fr : s.oc)}</a>${quand}`;
			});
			const estat =
				q.e === 'v'
					? `${fr ? 'Activité prouvée' : 'Activitat provada'} : ${fonts.join(', ')}`
					: q.a
						? fr
							? `Déclarée en préfecture en ${q.a}`
							: `Declarada en prefectura en ${q.a}`
						: `${fr ? 'Source' : 'Font'} : ${fonts.join(', ')}`;
			const provençal = /parlaren|prouven|proven|escolo|felibr/i.test(q.n) ? `<br><em class="nota-bulla">${escapeHtml(fr ? DEBAT_PROVENÇAL.fr : DEBAT_PROVENÇAL.oc)}</em>` : '';
			const cap =
				`<strong>${escapeHtml(q.n)}</strong><br>${escapeHtml(fr ? q.c : (q.o ?? q.c))}` +
				(q.k ? ` · ${fr ? "cours d'occitan" : "cors d'occitan"}` : '') +
				`<br><small>${estat}</small>${provençal}`;
			const icon = iconaPunt(cid);
			icon.options.className += q.e === 'v' ? ' ponch-plen' : ' ponch-vuèg';
			const m = dobleClicSus(L.marker([lat, lon], { icon, title: q.n, keyboard: true }).bindPopup(cap + `<span class="accions-bulla">${accionsNav(lat, lon, q.n + ' ' + q.c)}</span>`));
			grops[cid].push(m);
		}
		for (const [cid, ms] of Object.entries(grops)) {
			pointLayers[cid] = ponchs.grop(ms, cid);
			if (visibility[cid]) pointLayers[cid].addTo(map);
		}
		if (d.font) map.attributionControl?.addAttribution(d.font);
	}

	// L'Atlas sonòr (LISN) : demostracion (decision de Romain, 2026-10-12) ;
	// donadas de SIG/cadena/lisn-enquistas.mjs, mp3 sul site de l'Atlas.
	// Lecteur « Ondas » (VotzAtlas.svelte) : un toucher sur un point et la
	// voix part ; le point qui parle émet des ondes.
	let enquistasCargadas = false;
	// (raw : les points restent les mêmes objets que ceux des marqueurs)
	let enquistas = $state.raw([]);
	let votzComp = $state();
	let votzAra = $state.raw(null);
	const votzMarcas = new Map();
	const colorDial = (kod) => COLORS_DIAL[dalt ? 'dalt' : clar ? 'clar' : 'sorne'][kod] ?? '#eeaf34';
	const nomVotz = (p) => (lang === 'fr' ? p.n : comunaOc(p.n));
	async function cargarEnquistas() {
		if (enquistasCargadas || !map) return;
		enquistasCargadas = true;
		const d = await cargarVotz();
		if (!d?.ponches) return (enquistasCargadas = false);
		pointLayers.limsi = L.layerGroup(
			d.ponches.map((p) => {
				const m = L.marker([p.lat, p.lon], {
					icon: L.divIcon({
						className: 'votz-ponch',
						html: `<span style="--c:${colorDial(p.d.kod)}"><i></i><i></i><i></i><b></b><em data-m="nom" class="nom">${escapeHtml(nomVotz(p))}</em>${Object.entries(p.m ?? {})
							.map(([k, w]) => `<em data-m="${k}" lang="oc">${escapeHtml(w)}</em>`)
							.join('')}</span>`,
						iconSize: [24, 24],
						iconAnchor: [12, 12]
					}),
					title: nomVotz(p),
					keyboard: true
				});
				// le son part dans le geste même (les téléphones l'exigent)
				m.on('click', () => votzComp?.jogar(p));
				votzMarcas.set(p, m);
				return dobleClicSus(m);
			})
		);
		enquistas = d.ponches;
		if (d.font) map.attributionControl?.addAttribution(d.font);
		pointLayers.limsi.on('add', () => requestAnimationFrame(vagaVotz));
		if (visibility.limsi) pointLayers.limsi.addTo(map);
		votzMarcas.get(votzAra)?.getElement()?.classList.add('ara');
		map.on('zoomend moveend', placarMots);
		requestAnimationFrame(placarMots);
	}

	// L'allumage en vague (Romain, 2026-10-12 : « l'apparition des points en
	// éclairage par vague poétique ») : quand la couche s'allume, une onde part
	// du milieu de la vue et allume chaque voix à son passage, comme une pierre
	// dans l'eau ; les noms suivent un souffle plus tard.
	let vagaFin = null;
	function vagaVotz() {
		if (!map || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const mitan = map.getSize().divideBy(2);
		const tièra = [];
		let max = 1;
		for (const [p, m] of votzMarcas) {
			const el = m.getElement();
			if (!el) continue;
			const d = map.latLngToContainerPoint([p.lat, p.lon]).distanceTo(mitan);
			max = Math.max(max, d);
			tièra.push([el, d]);
		}
		for (const [el, d] of tièra) {
			el.style.setProperty('--vaga', ((d / max) * 1.6 + Math.random() * 0.15).toFixed(2) + 's');
			el.classList.remove('apareis');
			void el.offsetWidth;
			el.classList.add('apareis');
		}
		clearTimeout(vagaFin);
		vagaFin = setTimeout(() => tièra.forEach(([el]) => el.classList.remove('apareis')), 3200);
	}

	// Depuis la fiche d'une ville : « Totas las votz sus la carta » allume le
	// mode écoute et fait entendre ce point (dans le geste même)
	// (la jaça alucada per la ficha s'escantís quand se tampa lo lector : la
	// vila tòrna clicable, retorn de Romain 2026-10-23 ; alucada pel rail, demòra)
	let limsiPerFicha = false;
	function votzSusLaCarta(p) {
		causirNomComuna(null);
		votzComp?.jogar(p);
		limsiPerFicha = !visibility.limsi;
		onAlucar?.('limsi');
	}

	// « Un mot, cent parlars » : la carte écrit la forme locale du mot choisi ;
	// sans mot, le nom du lieu enregistré (les noms des villes sont effacés
	// en mode écoute). Les étiquettes qui se chevauchent sont cachées, les
	// formes rares d'abord gardées (c'est la variation qu'on veut voir).
	let votzMot = $state(null);
	function placarMots() {
		const k = votzMot ?? 'nom';
		if (!map) return;
		const forma = (p) => (k === 'nom' ? '' : (p.m?.[k] ?? '').toLowerCase());
		const n = {};
		for (const p of enquistas) n[forma(p)] = (n[forma(p)] ?? 0) + 1;
		const tièra = [];
		for (const [p, m] of votzMarcas) {
			const em = m.getElement()?.querySelector(`em[data-m="${k}"]`);
			if (!em) continue;
			em.classList.remove('amagat');
			tièra.push({ em, n: n[forma(p)] ?? 0 });
		}
		tièra.sort((a, b) => a.n - b.n);
		const placats = [];
		for (const { em } of tièra) {
			const r = em.getBoundingClientRect();
			if (!r.width) continue;
			const b = { x: r.left - 2, y: r.top - 1, w: r.width + 4, h: r.height + 2 };
			if (placats.some((a) => b.x < a.x + a.w && b.x + b.w > a.x && b.y < a.y + a.h && b.y + b.h > a.y)) em.classList.add('amagat');
			else placats.push(b);
		}
	}
	$effect(() => {
		const k = votzMot ?? 'nom';
		if (!mapEl) return;
		for (const m of ['nom', 'solelh', 'bisa', 'viatjaire']) mapEl.classList.toggle('votz-mot-' + m, m === k);
		requestAnimationFrame(placarMots);
	});
	// Mode écoute (Romain, 2026-10-12 : « option enregistrement ouverte
	// uniquement : une interface précise ») : la couche allumée efface les
	// noms des villes, qui reviennent quand on l'éteint ; le réglage des noms
	// dans le rail n'est pas touché.
	let escota = $derived(!!visibility.limsi);
	const elementsVesibles = () => ({ ...elements, nomsVilas: !!elements.nomsVilas && !escota });
	$effect(() => {
		mapEl?.classList.toggle('escota', escota);
	});

	// Le point écouté : ses ondes, et la carte le garde visible au-dessus de
	// la feuille du lecteur (en bas sur téléphone, à droite sur ordinateur)
	function veireVotz(p) {
		votzAra = p;
		if (!map) return;
		const s = map.getSize(),
			pt = map.latLngToContainerPoint([p.lat, p.lon]);
		const estrech = s.x < 720;
		const liure = estrech ? pt.y > 80 && pt.y < s.y * 0.36 : pt.x > 110 && pt.x < s.x - 480 && pt.y > 80;
		if (liure) return;
		const cibla = estrech ? L.point(s.x / 2, s.y * 0.24) : L.point((s.x - 480) / 2 + 55, s.y / 2);
		map.panBy(pt.subtract(cibla), { animate: !matchMedia('(prefers-reduced-motion: reduce)').matches });
	}
	$effect(() => {
		const ara = votzAra;
		for (const [p, m] of votzMarcas) m.getElement()?.classList.toggle('ara', p === ara);
	});
	// les couleurs suivent le thème (clair, sombre, daltonisme)
	$effect(() => {
		const pal = COLORS_DIAL[dalt ? 'dalt' : clar ? 'clar' : 'sorne'];
		for (const [p, m] of votzMarcas) m.getElement()?.firstElementChild?.style.setProperty('--c', pal[p.d.kod] ?? '#eeaf34');
	});
	// couche éteinte : la voix se tait
	$effect(() => {
		if (!visibility.limsi) untrack(() => votzAra && votzComp?.tampar());
	});

	// La Calandreta mai pròcha (demanda de Romain, 2026-10-08) : a partir de
	// la posicion de l'internauta (lo navegador la demanda ; demòra dins la
	// pagina, es pas mandada endacòm) o de sa comuna, cercada dins un indèx
	// dels noms de las comunas (cargat sonque a la primièra recèrca, cap de
	// servici de defòra). La carta mòstra los dos ponches, la bulla ditz la
	// distància a vòl d'aucèl.
	let calandretas = [];
	let menuPròcha = $state(false);
	let mesPròcha = $state(null); // un messatge (posicion refusada…)
	let ponchUsatgièr = null;
	const TÈXTES_PRÒCHA = {
		oc: {
			boton: 'La Calandreta mai pròcha',
			titol: 'Trobar la Calandreta mai pròcha',
			posicion: 'De ma posicion',
			comuna: 'O cercatz vòstra comuna',
			exemple: 'Rodés, Pau, Agen…',
			cap: 'Cap de comuna trobada',
			privat: 'Vòstra posicion demòra dins vòstre navegador : es pas mandada endacòm.',
			cerca: 'Cerca de vòstra posicion…',
			refusada: 'Vòstra posicion es pas disponibla : cercatz vòstra comuna.',
			distancia: (km) => `A ${km} a vòl d’aucèl`,
			vos: 'Vos sètz aquí',
			tampar: 'Tampar'
		},
		fr: {
			boton: 'La Calandreta la plus proche',
			titol: 'Trouver la Calandreta la plus proche',
			posicion: 'Depuis ma position',
			comuna: 'Ou cherchez votre commune',
			exemple: 'Rodez, Pau, Agen…',
			cap: 'Aucune commune trouvée',
			privat: 'Votre position reste dans votre navigateur : elle n’est envoyée nulle part.',
			cerca: 'Recherche de votre position…',
			refusada: 'Votre position n’est pas disponible : cherchez votre commune.',
			distancia: (km) => `À ${km} à vol d’oiseau`,
			vos: 'Vous êtes ici',
			tampar: 'Fermer'
		}
	};
	const txPròcha = $derived(TÈXTES_PRÒCHA[lang] ?? TÈXTES_PRÒCHA.oc);
	// distància (km) entre dos ponches, sus la Tèrra
	const km = (a, b, c, d) => {
		const r = Math.PI / 180,
			x = Math.sin(((c - a) * r) / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(((d - b) * r) / 2) ** 2;
		return 12742 * Math.asin(Math.sqrt(x));
	};
	// (etiqueta : « Vos sètz aquí », o lo nom de la comuna cercada)
	async function trobarPròcha(lat, lon, etiqueta) {
		if (!calandretas.length) await cargarCalandretas();
		if (!calandretas.length || !map) return;
		let mai = null,
			dMai = Infinity;
		for (const c of calandretas) {
			const dk = km(lat, lon, c.lat, c.lon);
			if (dk < dMai) (mai = c), (dMai = dk);
		}
		menuPròcha = false;
		mesPròcha = null;
		ponchUsatgièr?.remove();
		ponchUsatgièr = L.circleMarker([lat, lon], { radius: 7, className: 'ponch-usatgièr', weight: 2, fillOpacity: 0.9, interactive: false })
			.bindTooltip(etiqueta, { direction: 'top', offset: [0, -8] })
			.addTo(map);
		const dTèxt = dMai < 10 ? dMai.toFixed(1).replace('.', ',') + ' km' : Math.round(dMai) + ' km';
		mai.m.setPopupContent(`${mai.cap}<br><em class="distancia">${escapeHtml(txPròcha.distancia(dTèxt))}</em>${mai.ligam}`);
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		// los dos ponches dins la vista (sens sortir de l'escala d'una vila)
		map.flyToBounds(
			[
				[lat, lon],
				[mai.lat, mai.lon]
			],
			{ paddingTopLeft: [60, 170], paddingBottomRight: [60, 120], maxZoom: 13, duration: calm ? 0 : 1.6 }
		);
		map.once('moveend', () => {
			pointLayers.calandretas?.assegurar?.(mai.m);
			mai.m.openPopup();
			ponchUsatgièr?.openTooltip();
		});
		// la bulla tampada : la distància se'n va (lo ponch tanben)
		mai.m.once('popupclose', () => mai.m.setPopupContent(mai.cap + mai.ligam));
	}
	function deMaPosicion() {
		if (!('geolocation' in navigator)) return (mesPròcha = txPròcha.refusada);
		mesPròcha = txPròcha.cerca;
		navigator.geolocation.getCurrentPosition(
			(pos) => trobarPròcha(pos.coords.latitude, pos.coords.longitude, txPròcha.vos),
			() => (mesPròcha = txPròcha.refusada),
			{ enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
		);
	}
	// La recèrca d'una comuna : nom francés o occitan, sens comptar los
	// accents ; las comunas que començan pel tèxte d'en primièr, puèi las
	// mai pobladas (dins lo domeni occitan : 10 000 comunas, 155 Ko compressats)
	let nomsComunas = null;
	let qComuna = $state('');
	let comunasTrobadas = $state([]);
	let comunaActiva = $state(-1);
	const normC = (t) =>
		t
			.normalize('NFD')
			.replace(/\p{M}/gu, '')
			.toLowerCase()
			.replace(/[-'’()]/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
	// lo nom occitan d'una vila de la carta (sonque la meteissa : i a doas Valença)
	const POS_VILAS = Object.fromEntries(LUOCS.map(([lon, lat, nom]) => [nom, [lon, lat]]));
	const vilaCarta = (fr, lon, lat) => {
		const oc = OC_DE_FR[fr],
			q = oc && POS_VILAS[oc];
		return q && km(lat, lon, q[1], q[0]) < 15 ? oc : null;
	};
	// Los ponches amagan pas los noms de las vilas (los noms son dins las tuèlas :
	// la plaça de cada nom se n'estima amb la lista de las comunas). Un ponch
	// que n'amagariá un se descala, ligat al luòc per un fil. Se torna calcular
	// a cada zoom e quand una jaça s'aluca o s'atudís.
	// Los noms de totas las comunas en occitan, sus lo satellit (demanda de
	// Romain, 2026-10-09) : sonque los de la vista, las comunas mai pobladas
	// d'en primièr, sens que dos noms se tòquen. Los ponches los evitan.
	// Los noms de totas las comunas en occitan, sus lo satellit (demanda de
	// Romain, 2026-10-09) : un motor de noms coma sus Google Maps (2026-10-11,
	// nomsComunas.js), tornat pintar a cada imatge del zoom doç (zoomDoc.js).
	let motorNoms = null;
	// las bóstias dels noms afichats, a la pausa (las icònas los evitan)
	let bóstiasNoms = [];
	// Un òrdre per totes los tèxtes de la carta (retorn de Romain, 2026-10-10 :
	// Ais de Provença jos lo Mont Ventor, de comunas sus los massís) : las
	// vilas d'en primièr ; los noms de dialèctes e del relèu las evitan ; los
	// vilatges, al darrièr, evitan tot. (bóstias de las vilas en coordenadas
	// projectadas, coma las de las còlas)
	let caixasVilasDOM = null,
		clauVilas = '';
	function noms_repaus({ pausats, vilas }) {
		bóstiasNoms = pausats;
		const z = map.getZoom(),
			o = map.getPixelOrigin();
		const proj = (x, y) => map.containerPointToLayerPoint([x, y]).add(o);
		const cs = vilas.map(([x0, y0, x1, y1]) => {
			const a = proj(x0, y0),
				b = proj(x1, y1);
			return [a.x, a.y, b.x, b.y];
		});
		const clau = cs.map((b) => b.map(Math.round).join(',')).join(';') + '@' + z;
		if (clau !== clauVilas) {
			clauVilas = clau;
			caixasVilasDOM = cs.length ? { z, cs } : null;
			if (z < 9.8) colaDonadas?._pintar();
			for (const c of Object.values(colasLengas)) c._pintar?.();
			colaTematica?._pintar();
			motorNoms?.tornarPintar();
		}
		programarDegatjament();
	}
	// Lo luòc survolat : son nom en aur, al costat de son ponch (colaEstelas) ;
	// sus lo satellit, lo nom de la comuna s'escafa e los que lo nom en aur
	// recobrís s'escantisson (retorn de Romain, 2026-10-11 : Vilafranca de
	// Roergue escrich dos còps, l'un sus l'autre)
	function marcarPus(p) {
		motorNoms?.pus(p);
	}
	function caixasDeCòlas(z) {
		const o = map.getPixelOrigin(),
			res = [];
		for (const ob of [colaDonadas?.caixasNoms(), ...Object.values(colasLengas).map((c) => c.caixasNoms()), colaTematica?.caixasNoms()]) {
			if (!ob) continue;
			const kz = Math.pow(2, z - ob.z);
			for (const b of ob.cs) {
				const a = map.layerPointToContainerPoint(L.point(b[0] * kz - o.x, b[1] * kz - o.y)),
					c = map.layerPointToContainerPoint(L.point(b[2] * kz - o.x, b[3] * kz - o.y));
				res.push([a.x, a.y, c.x, c.y]);
			}
		}
		return res;
	}
	const popNoms = (z) => (z >= 12.5 ? 0 : z >= 11.5 ? 100 : z >= 10.5 ? 500 : z >= 9.5 ? 2000 : 8000);
	// (sul site en francés, dos noms per vila : mens de comunas, que arriban
	// mai prèp ; retorn de Romain, 2026-10-11 : « à 5 km, ça fait chargé »,
	// « il faudrait zoomer encore un peu plus en français »)
	const popNomsFr = (z) => (z >= 13 ? 0 : z >= 12.25 ? 300 : z >= 11.5 ? 1500 : z >= 10.75 ? 5000 : 15000);
	const popNomsSite = (z) => (lang === 'fr' ? popNomsFr(z) : popNoms(z));
	// La polissa d'un nom segon lo reng de la vila, coma sus la carta estelada
	// (estil « Atlas », 2026-10-08) : Limelight per las metropòlis, capitalas
	// espaçadas per las vilas repèrs, italica per las autras. Las comunas fòra
	// la tièra son de vilatges ; lor talha seguís lor populacion.
	// (l'italica a de delhats fins : un pauc mai granda que sus las estelas)
	const talhaNom = (renc, pop) => ({ 1: 18, 2: 13, 3: 12.5 })[renc] ?? (pop >= 20000 ? 12 : pop >= 3000 ? 11.5 : 11);
	let cxMesura = null;
	// Sul site en francés, lo nom francés tanben (retorn de Romain, 2026-10-11 :
	// « beaucoup de francophones sont paniqués dès qu'ils ne comprennent
	// pas ») : lo nom francés d'en primièr, l'occitan en pichon e en italica
	// dejós (causit per Romain entre los dos òrdres). Las comunas de las autras
	// lengas (lo camp fr es alara lor nom local) gardan un sol nom.
	let clauEstil = '',
		polissaSota = $state(false);
	$effect(() => {
		clauEstil = lang + (polissaSota ? '|l' : '');
		motorNoms?.tornarPintar();
		colaEstelas?.setNomsDobles?.(lang === 'fr' ? 'fr' : null, polissaSota);
	});
	// (la polissa del segond nom cargada : los noms se tòrnan dessenhar amb ela)
	$effect(() => {
		if (lang !== 'fr' || polissaSota) return;
		document.fonts
			?.load('italic 400 11px Luciole')
			.then(() => (polissaSota = true))
			.catch(() => {});
	});
	function estilNom(c) {
		const e = estilVila(c.renc, talhaNom(c.renc, c.pop));
		const oc = c.oc || c.fr,
			fr = JACES_LENGAS.includes(c.dep) ? null : c.fr;
		let nom = oc,
			sota = null;
		if (lang === 'fr' && fr && oc && fr.toLowerCase() !== oc.toLowerCase()) [nom, sota] = [fr, oc];
		const g = (cxMesura ??= document.createElement('canvas').getContext('2d'));
		g.font = e.font;
		if ('letterSpacing' in g) g.letterSpacing = e.esp.toFixed(2) + 'px';
		const px = parseFloat(e.font.match(/([\d.]+)px/)[1]);
		const r = { nom, px, font: e.font, esp: e.esp, majus: e.majus, w: g.measureText(e.majus ? nom.toUpperCase() : nom).width, clau: clauEstil };
		if (sota) {
			// (una autra letra que lo nom principal : Luciole, dessenhada per
			// demorar legibla en pichon, en italica, daurada ; retorn de Romain :
			// « pas lisible et la hiérarchie des polices n'est pas bonne »)
			r.pxSota = Math.min(10.5, Math.max(9, Math.round(px * 0.74 * 2) / 2));
			r.fontSota = `italic 400 ${r.pxSota}px Luciole, sans-serif`;
			r.colorSota = '#ecd29c';
			g.font = r.fontSota;
			if ('letterSpacing' in g) g.letterSpacing = '0px';
			r.sota = sota;
			r.wSota = g.measureText(sota).width;
		}
		return r;
	}
	// Las vilas de las autras lengas alucadas, amb lor nom dins la lenga (retorn
	// de Romain, 2026-10-11 : cap de nom en Savòia sul satellit ; la lista de
	// las comunas es sonque la del domeni occitan). Meteis filtre que la carta
	// estelada (la part francesa sola dins lo mòde). Lor populacion es pas
	// coneguda : estimada d'aprèp lor reng.
	const POP_RENC = { 1: 100000, 2: 30000, 3: 8000, 4: 2500 };
	// (e totas las comunas que lor nom dins la lenga es conegut, amb lor
	// populacion : la meteissa règla d'aparicion pertot ; SIG/cadena/noms-lengas.py)
	let nomsLengas = null;
	function cargarNomsLengas() {
		if (nomsLengas) return;
		nomsLengas = { lengas: [], c: [] };
		fetch('/data/comunas/noms-lengas.json')
			.then((r) => (r.ok ? r.json() : null))
			.then((d) => {
				if (d?.c) nomsLengas = d;
				// (la font, dins lo panèl « Fonts », rengada amb sas parèlhas)
				if (d?.font) map?.attributionControl?.addAttribution(d.font);
				motorNoms?.tornarPintar();
			})
			.catch(() => {});
	}
	let listaNoms = [],
		clauNoms = '';
	function nomsDeLaCarta() {
		const ids = JACES_LENGAS.filter((id) => visibility[id]);
		if (ids.length) cargarNomsLengas();
		const fs = ids.map((id) => [id, fonsDe(id)]).filter(([, f]) => f?.vilas?.length);
		const clau = [
			nomsComunas?.length ?? 0,
			nomsLengas?.c.length ?? 0,
			ids.map((id) => id + (nomésFrança(id) ? '·fr' : '')).join(','),
			fs.map(([id, f]) => id + f.vilas.length).join(','),
			francaCargada()
		].join('|');
		if (clau !== clauNoms) {
			clauNoms = clau;
			const dins = new Set(ids);
			// (una vila de la tièra es ja nomenada : pas un segond nom al meteis luòc,
			// Èx-los-Bens e Ésse per Aix-les-Bains)
			const vilas = fs.flatMap(([, f]) => f.vilas);
			const nomenada = (c) => vilas.some((v) => Math.abs(v.lat - c.lat) < 0.02 && Math.abs(v.lon - c.lon) < 0.028);
			// (la part francesa sola dins lo mòde, coma la carta estelada)
			const comunasLengas = (nomsLengas?.c ?? [])
				.map(([nom, lon, lat, pop, i]) => ({ id: nomsLengas.lengas[i], nom, lon, lat, pop }))
				.filter((c) => dins.has(c.id) && !(nomésFrança(c.id) && francaCargada() && !dinsFranca(c.lat, c.lon)) && !nomenada(c))
				.map((c) => ({ fr: c.nom, oc: c.nom, lon: c.lon, lat: c.lat, renc: 4, pop: c.pop ?? 1000, dep: c.id }));
			listaNoms = [
				...(nomsComunas ?? []),
				...fs.flatMap(([id, f]) => f.vilas.map((v) => ({ fr: v.nom, oc: v.nom, lon: v.lon, lat: v.lat, renc: v.renc ?? 4, pop: POP_RENC[v.renc] ?? 2500, dep: id }))),
				...comunasLengas
			];
		}
		return listaNoms;
	}
	// La comuna causida : son nom en aur, l'onda daurada, e la carta i vòla, a
	// una escala segon sa talha (de 7 km per una metropòla a 1 km per un
	// vilatge), sens jamai se recuolar
	// La susfàcia de la comuna tanben (retorn de Romain, 2026-10-11 : « il faut
	// que ça sélectionne la surface de la ville ») : son contorn en aur, un
	// fons leugièr ; la carta la mòstra tota (contornComuna.js ; sonque dins
	// lo domeni occitan, ont son los contorns)
	let contornCausit = null,
		comunaCausida = null;
	// Lo dialècte del centre de la carta, de prèp (retorn de Romain, 2026-10-11 :
	// las tenchas se vesián pas pus e se causissián per res) : escrich al dessús
	// de l'escala, sens clic ; las zònas de transicion passan davant
	let elDialLuòc = null,
		clauDialLuòc = '';
	function majDialLuòc() {
		const el = elDialLuòc;
		if (!el || !map) return;
		let info = null;
		if (aTenchas(map.getZoom()) < 0.5) {
			const lp = map.latLngToLayerPoint(map.getCenter());
			const l = [colaDonadas?.dialècteA(lp), ...Object.values(colasLengas).map((c) => c.dialècteA?.(lp))].filter(Boolean);
			info = l.find((i) => i.mix || i.cro) ?? l[0] ?? null;
		}
		el.classList.toggle('vesible', !!info);
		// (en s'escantissent, lo nom d'abans demòra)
		if (!info) return;
		const fr = lang === 'fr',
			nom = fr ? info.fr : info.oc,
			sota = info.mix || info.cro ? (fr ? 'zone de transition' : 'zòna de transicion') : ((fr ? info.sota_fr : info.sota_oc) ?? (fr ? 'dialecte' : 'dialècte'));
		const clau = nom + '|' + sota;
		if (clau === clauDialLuòc) return;
		clauDialLuòc = clau;
		const n = L.DomUtil.create('span', 'nom'),
			so = L.DomUtil.create('span', 'sota');
		n.lang = info.lang ?? (fr ? 'fr' : 'oc');
		n.textContent = nom;
		so.textContent = sota;
		el.replaceChildren(n, so);
	}
	$effect(() => {
		// (una lenga o los dialèctes alucats o escantits, la lenga de la pagina)
		JSON.stringify(visibility);
		lang;
		const t = setTimeout(majDialLuòc, 400);
		return () => clearTimeout(t);
	});
	// la ficha de la comuna, dins l'encastre d'en bas (FichaComuna.svelte)
	// ($state.raw : la comuna e son contorn demòran los objèctes d'origina, sens proxy)
	let fichaComuna = $state.raw(null);
	function causirNomComuna(c) {
		motorNoms?.causir(c);
		comunaCausida = c;
		contornCausit?.remove();
		contornCausit = null;
		fichaComuna = c ? { c, contorn: null } : null;
		// (rappelée sous la couche « Comunas » de la légende)
		causidaLegenda(['comunas'], c && { jaça: 'comunas', nom: lang === 'fr' ? (c.fr ?? c.oc) : c.oc || c.fr });
	}
	// la comuna jos un luòc (son nom es centrat sus el) : causida se son nom es
	// pausat ; los noms se cargan après lo vol, d'unes ensages
	function causirComunaA(lat, lon, n = 0) {
		if (!map) return;
		const pt = map.latLngToContainerPoint([lat, lon]);
		const c = [0, -6, -12, 6].map((dy) => motorNoms?.a(pt.add([0, dy]))).find(Boolean);
		if (c) return void anarALaComuna(c);
		if (n < 8) setTimeout(() => causirComunaA(lat, lon, n + 1), 250);
	}
	async function anarALaComuna(c) {
		map.closePopup();
		causirNomComuna(c);
		// (lo contorn, se ven pro lèu ; si que non la carta part sens el)
		const f = await Promise.race([contornComuna(c.lat, c.lon), new Promise((r) => setTimeout(() => r(null), 450))]);
		if (comunaCausida !== c || !map) return;
		const km = c.renc === 1 ? 7 : c.renc === 2 ? 5 : c.renc === 3 ? 3 : c.pop >= 3000 ? 2 : 1;
		let z = Math.min(15, Math.max(map.getZoom(), zCran(km, c.lat))),
			centre = L.latLng(c.lat, c.lon);
		const pintar = (f) => {
			if (!f || comunaCausida !== c || !map) return null;
			if (!map.getPane('comunaCausida')) map.createPane('comunaCausida').style.zIndex = '345';
			contornCausit = L.polygon(
				f.poligons.map((p) => p.map((a) => a.map(([x, y]) => [y, x]))),
				{ pane: 'comunaCausida', className: 'comuna-causida', color: '#f3c25a', weight: 2, opacity: 0.95, fillColor: '#f3c25a', fillOpacity: 0.1, interactive: false }
			).addTo(map);
			contornCausit.getElement()?.setAttribute('pathLength', '1');
			if (fichaComuna?.c === c) fichaComuna = { c, contorn: f };
			return contornCausit.getBounds();
		};
		const b = pintar(f);
		// (la ficha ocupa lo bas de la carta : la comuna se mòstra dins l'espaci
		// que demòra, al dessús ; plegada, ~150 px)
		// (sul telefòn, lo panèl de la ficha e la barra d'en bas, ~280 px, e lo
		// capçal amb la recèrca, ~180 px)
		const size = map.getSize(),
			telefon = size.x <= 600,
			ficha = telefon ? 280 : Math.min(170, size.y * 0.3),
			naut = telefon ? 180 : 60,
			marge = telefon ? 24 : 120;
		if (b) {
			// (tota la comuna dins l'espaci liure, al mai prèp de l'escala de sa talha)
			const liure = L.point(Math.max(80, size.x - 2 * marge), Math.max(80, size.y - ficha - naut - 50));
			z = Math.min(z, map.getBoundsZoom(b, false, size.subtract(liure)));
			centre = b.getCenter();
		}
		// lo centre de la comuna al mitan de l'espaci liure (pas jos la ficha)
		const p = map.project(centre, z).add([0, (ficha - naut) / 2]);
		centre = map.unproject(p, z);
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		map.flyTo(centre, z, { duration: calm ? 0 : 1.2 });
		if (!f) contornComuna(c.lat, c.lon).then(pintar);
	}
	// Le département ou la région choisis d'un clic : le même contour doré que la
	// commune choisie, qui se trace, se remplit d'un fond léger et luit deux fois
	// (retour de Romain, 2026-10-19 ; animation .comuna-causida)
	// (même dessin pour la province, le parc ou la commune choisis d'un clic :
	// audit des clics, 2026-10-19 ; un contour par couche qui choisit)
	const contornsCausits = {};
	function dessenharContorn(clau, anels, mena) {
		contornsCausits[clau]?.remove();
		contornsCausits[clau] = null;
		if (!anels?.length || !map || !L) return;
		if (!map.getPane('comunaCausida')) map.createPane('comunaCausida').style.zIndex = '345';
		const p = L.polygon(
			anels.map((a) => a.map(([x, y]) => [y, x])),
			{ pane: 'comunaCausida', className: 'comuna-causida', color: '#f3c25a', weight: mena === 'region' || mena === 'prov' ? 2.4 : 2, opacity: 0.95, fillColor: '#f3c25a', fillOpacity: 0.1, interactive: false }
		).addTo(map);
		p.getElement()?.setAttribute('pathLength', '1');
		contornsCausits[clau] = p;
	}
	// La sélection rappelée dans la légende, sous sa couche (RailJaces) : son nom
	// et un ✕ qui la relâche (événement « carta-levar-causida »)
	function causidaLegenda(jaces, c) {
		if (c) estatCarta.causida = c;
		else if (jaces.includes(estatCarta.causida?.jaça)) estatCarta.causida = null;
	}
	function dessenharTerritori(t) {
		dessenharContorn('ter', t?.anels, t?.mena);
		causidaLegenda(['regions', 'despartaments'], t && { jaça: t.mena === 'region' ? 'regions' : 'despartaments', nom: t.nom });
	}
	function causidaTematica(c) {
		dessenharContorn('tem', c?.poligons?.flat(), c?.mena);
		causidaLegenda(['provincias', 'parcs', 'comunas'], c && { jaça: c.jaça, nom: c.info?.oc });
	}
	$effect(() => {
		const levar = (e) => {
			const j = e.detail?.jaça;
			if (j === 'regions' || j === 'despartaments') colaEstelas?.levarTerritori();
			else if (j === 'provincias' || j === 'parcs') colaTematica?.levarCausida();
			else if (j === 'comunas') (colaTematica?.levarCausida(), fichaComuna && causirNomComuna(null));
		};
		addEventListener('carta-levar-causida', levar);
		return () => removeEventListener('carta-levar-causida', levar);
	});
	// (los noms se cargan quand cal ; lo motor se torna pintar)
	function majNomsComunas() {
		if (!map) return;
		if (baseLayer === 'estelas' && map.getZoom() >= Z.RELAIS && !nomsComunas?.length) return void cargarNomsComunas();
		motorNoms?.tornarPintar();
	}

	// de luènh, los ponches son d'estelas (la carta d'estelas de l'entrada) ;
	// l'icòna espelís en s'aprochant (causida de Romain, 2026-10-09)
	let degatRaf = 0;
	function programarDegatjament() {
		cancelAnimationFrame(degatRaf);
		degatRaf = requestAnimationFrame(degatjarPonchs);
	}
	function degatjarPonchs() {
		if (!map) return;
		const ms = [];
		const vue = map.getBounds().pad(0.15);
		for (const [id, g] of Object.entries(pointLayers))
			if (id !== 'lengasFranca' && map.hasLayer(g)) g.eachLayer((m) => m._icon && vue.contains(m.getLatLng()) && ms.push(m));
		if (!ms.length) return;
		if (map.getZoom() < Z.ICONAS) {
			for (const m of ms) {
				m.options.icon.options.popupAnchor = [0, -6];
				m._icon.classList.remove('ponch-sol-estela');
			}
			return;
		}
		cargarNomsComunas();
		const z = map.getZoom();
		const pts = ms.map((m) => map.latLngToContainerPoint(m.getLatLng()));
		const zonas = [];
		// de luènh, la carta dessina sos pròpris noms : sas bóstias son exactas,
		// e l'icòna s'estaca al ponch de la vila quand n'es tocant
		const estelas = colaEstelas && map.hasLayer(colaEstelas) ? colaEstelas.caixasNoms() : null;
		const ancòras = pts.map((p) => p);
		if (estelas) {
			const o = map.getPixelOrigin();
			const cp = (x, y, kz) => map.layerPointToContainerPoint(L.point(x * kz - o.x, y * kz - o.y));
			for (const ob of [estelas, colaDonadas?.caixasNoms(), ...Object.values(colasLengas).map((c) => c.caixasNoms())]) {
				if (!ob) continue;
				const kz = Math.pow(2, z - ob.z);
				for (const b of ob.cs) {
					const a = cp(b[0], b[1], kz), c = cp(b[2], b[3], kz);
					zonas.push(zonaCaixa([a.x, a.y, c.x, c.y]));
				}
			}
			const kz = Math.pow(2, z - estelas.z);
			const vilas = (estelas.ponchs ?? []).map(([x, y]) => cp(x, y, kz));
			pts.forEach((p, i) => {
				let melhor = null, dm = 14;
				for (const v of vilas) {
					const d = Math.hypot(v.x - p.x, v.y - p.y);
					if (d < dm) (dm = d), (melhor = v);
				}
				if (melhor) ancòras[i] = melhor;
			});
		}
		// sus lo satellit, nòstres noms de comunas (bóstias exactas) ; suls autres
		// fonses, los noms de las tuèlas, estimats
		if (bóstiasNoms.length) for (const bx of bóstiasNoms) zonas.push(zonaCaixa(bx));
		else if (nomsComunas?.length) {
			const b = vue.pad(0.15);
			const s = b.getSouth(), n = b.getNorth(), w = b.getWest(), e = b.getEast();
			for (const c of nomsComunas) {
				if (c.lat < s || c.lat > n || c.lon < w || c.lon > e || !placeVisible(c.pop, z)) continue;
				// una granda vila : son nom es a son centre (lo de la carta), pas al
				// mièg de la comuna (Montpelhièr : 1,5 km d'escart)
				const v = c.pop >= 50000 && POS_VILAS[c.oc];
				const q = map.latLngToContainerPoint(v ? [v[1], v[0]] : [c.lat, c.lon]);
				zonas.push(zonaEtiqueta(q.x, q.y, c.oc || c.fr, c.pop, z));
			}
		}
		const desc = degatjar(ancòras, zonas);
		ms.forEach((m, i) => {
			const [dx, dy, plaça] = desc[i];
			// pas de plaça sens amagar un nom o una autra icòna : demòra estela
			m._icon.classList.toggle('ponch-sol-estela', !plaça);
			if (!plaça) return void (m.options.icon.options.popupAnchor = [0, -6]);
			const ox = ancòras[i].x - pts[i].x, oy = ancòras[i].y - pts[i].y;
			const d = Math.hypot(dx, dy);
			const st = m._icon.style;
			st.setProperty('--ox', ox + 'px');
			st.setProperty('--oy', oy + 'px');
			st.setProperty('--dx', dx + 'px');
			st.setProperty('--dy', dy + 'px');
			st.setProperty('--ang', Math.atan2(-dx, dy) + 'rad');
			st.setProperty('--fil', Math.max(0, d - 13) + 'px');
			m.options.icon.options.popupAnchor = [ox + dx, oy + dy - 11];
		});
	}
	async function cargarNomsComunas() {
		if (nomsComunas) return;
		nomsComunas = [];
		// (las polissas dels noms, cargadas abans de mesurar la plaça de cada nom)
		const [d] = await Promise.all([
			fetch('/data/comunas/noms.json')
				.then((r) => (r.ok ? r.json() : null))
				.catch(() => null),
			Promise.all(['18px Limelight', "italic 500 14px 'Cormorant Garamond'", '400 12px Luciole'].map((f) => document.fonts?.load(f))).catch(() => {})
		]);
		// (las vilas de la carta gardan lor nom : « Rodés », pas « Rodès »)
		nomsComunas = (d?.c ?? []).map(([fr, oc0, lon, lat, pop, dep]) => {
			const v = vilaCarta(fr, lon, lat);
			const oc = v ?? (oc0 || null);
			return { fr, oc, lon, lat, pop, dep, renc: v ? rencVila(v) : 4, k: [normC(fr), ...(oc ? [normC(oc)] : []), ...(oc0 && oc0 !== oc ? [normC(oc0)] : [])] };
		});
		if (qComuna) cercarComuna(qComuna);
		majNomsComunas();
		programarDegatjament();
	}
	function cercarComuna(q) {
		const n = normC(q);
		comunaActiva = -1;
		if (n.length < 2 || !nomsComunas?.length) return (comunasTrobadas = []);
		const nota = (c) => {
			let m = 0;
			for (const k of c.k) m = Math.max(m, k === n ? 3 : k.startsWith(n) ? 2 : k.includes(' ' + n) ? 1 : 0);
			return m;
		};
		comunasTrobadas = nomsComunas
			.map((c) => [c, nota(c)])
			.filter(([, m]) => m > 0)
			.sort((a, b) => b[1] - a[1] || b[0].pop - a[0].pop)
			.slice(0, 6)
			.map(([c]) => c);
	}
	const nomComuna = (c) => (lang === 'fr' ? c.fr : (c.oc ?? c.fr));
	function causirComuna(c) {
		qComuna = nomComuna(c);
		comunasTrobadas = [];
		trobarPròcha(c.lat, c.lon, nomComuna(c));
	}
	function claveComuna(e) {
		const n = comunasTrobadas.length;
		if (e.key === 'ArrowDown' && n) (comunaActiva = (comunaActiva + 1) % n), e.preventDefault();
		else if (e.key === 'ArrowUp' && n) (comunaActiva = (comunaActiva - 1 + n) % n), e.preventDefault();
		else if (e.key === 'Enter' && n) causirComuna(comunasTrobadas[Math.max(0, comunaActiva)]), e.preventDefault();
		else if (e.key === 'Escape') (comunasTrobadas.length ? (comunasTrobadas = []) : (menuPròcha = false)), e.preventDefault();
	}
	// un clic defòra tampa la lista (principi del site, $lib/tampaDefora.js)
	$effect(() => {
		if (!menuPròcha) return;
		return tampaDefòra((t) => !!t.closest('.procha'), () => (menuPròcha = false));
	});
	// la jaça escantida : lo ponch de l'usatgièr se'n va
	$effect(() => {
		if (!visibility.calandretas) {
			ponchUsatgièr?.remove();
			ponchUsatgièr = null;
			menuPròcha = false;
		}
	});

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

	// Lo doble clic sus una donada : la vista se centra dessús (una zòna se
	// cadra, un ponch se centra un pauc pus prèp)
	function centrarSus({ bounds, centre }) {
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches,
			opts = { animate: !calm, duration: calm ? 0 : 1.2 };
		if (bounds) map.flyToBounds(bounds, { ...opts, paddingTopLeft: [100, 90], paddingBottomRight: [40, 60], maxZoom: 13 });
		else map.flyTo(centre, Math.min(Math.max(map.getZoom() + 1, 8), 15), opts);
	}
	// (los marcaires e las entitats GeoJSON de Leaflet : lor doble clic los centra)
	const dobleClicSus = (layer) =>
		layer.on('dblclick', (ev) => {
			L.DomEvent.stop(ev);
			centrarSus(layer.getBounds ? { bounds: layer.getBounds() } : { centre: layer.getLatLng() });
		});

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
			onEachFeature: (feature, layer) => {
				if (def.popup) layer.bindPopup(def.popup(feature));
				dobleClicSus(layer);
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
		if (!map) return;
		const ambNoms = ambToponims(baseLayer);
		if (!toponymCities) return void (ambNoms && loadToponymsLayer());
		if (ambNoms) {
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
		estatCarta.cargament = 0.35;

		// Zoom par quarts de niveau : la traversée des échelles est plus douce,
		// et l'Occitanie entière tient juste dans la fenêtre à l'arrivée (même
		// cadre que la carte en étoiles de l'accueil).
		map = L.map(mapEl, {
			// lo zoom doç (zoomDoc.js) remplaça las animacions de Leaflet : cap de
			// cran, cap d'escala imposada a la fin d'un pinçament
			zoomSnap: 0,
			zoomAnimation: false,
			zoomDelta: 0.5,
			wheelPxPerZoomLevel: 110,
			minZoom: 2, // fins al mond (dezoom : Euròpa, puèi lo mond)
			maxZoom: 19,
			zoomControl: false
		});
		// las estelas de las jaces de ponches, sus una sola tela ; una tocada
		// dobrís la bulla de son ponch (coma la pastilha de prèp)
		ponchs = crearPonchs(L, {
			zIconas: () => Z.ICONAS,
			onClic: (m) => {
				const b = m.getPopup();
				if (b) L.popup({ ...b.options, offset: L.point(0, -4) }).setLatLng(m.getLatLng()).setContent(b.getContent()).openOn(map);
			},
			onDobleClic: (m) => centrarSus({ centre: m.getLatLng() }),
			// (de ponches alucats o escantits : los noms dels dialèctes se tòrnan plaçar)
			onCanvi: () => colaDonadas?._update?.()
		});
		// la grilha de las escalas seguís la latitud del centre (escalas.js)
		map.on('move', () => fixarLatEscala(map.getCenter().lat));
		// (e la talha de l'ecran : un telefòn vei las meteissas jaces al meteis cadratge)
		fixarEcran(map.getSize().x, map.getSize().y);
		map.on('resize', () => fixarEcran(map.getSize().x, map.getSize().y));
		// tota l'Occitània a l'arribada, sus totes los aparelhs (vistaOccitana)
		{
			const v = vistaOccitana();
			map.setView(v.c, v.z, { animate: false });
		}

		setBaseLayer(baseLayer);
		estatCarta.cargament = 0.55;
		colaDonadas = crearColaDonadas(L, {
			clar,
			dalt,
			lang,
			jaces: jacesDonadas(visibility),
			// un luòc o una vila a ficha jos lo det : lo clic es per las estelas
			// (una zòna mixta occitana, coma Baiona amb lo basc, garda lo survòl :
			// es ela que conta lo contacte ; sens aquò las doas còlas se cedavan
			// l'una a l'autra e res s'afichava)
			ocupat: (lp) =>
				cedirAActiva('dialectes') ||
				!!(colaEstelas && map.hasLayer(colaEstelas) && colaEstelas.ocupat(lp)) ||
				!!colaTematica?.ocupat(lp, true) ||
				(zonaLengaA(lp) && !colaDonadas?.zonaA(lp)?.startsWith('mix-')),
			// los noms de vilas : los noms de dialèctes los evitan
			obstacles: () => [colaEstelas && map.hasLayer(colaEstelas) ? colaEstelas.caixasNoms() : null, caixasVilasDOM, ponchs?.tela.caixas()],
			onSurvòl: (k, info) => (survòl = info),
			onCausida: (kods, info) => {
				causida = info;
				// (las zònas causidas de las autras lengas demòran)
				causits = [...kods, ...causits.filter((k) => !esOccitan(k))];
			}
		});
		colaDonadas.addTo(map);
		colaDonadas.setLectura(lectura);
		// Las autras lengas (demanda de Romain, 2026-10-08) : meteissa lectura
		// que l'occitan ; lors vilas grandas venon sus la carta en estelas amb elas
		for (const id of JACES_LENGAS) {
			const lg = LENGAS[id];
			if (!lg) continue;
			colasLengas[id] = crearColaLenga(L, lg, {
				clar,
				dalt,
				lang,
				actiu: !!visibility[id],
				ocupat: (lp) =>
					cedirAActiva(id) ||
					!!(colaEstelas && map.hasLayer(colaEstelas) && colaEstelas.ocupat(lp)) ||
					!!colaTematica?.ocupat(lp, true) ||
					(activa() !== id && !!colaDonadas.zonaA(lp)) ||
					zonaLengaA(lp, id),
				obstacles: () => [
					colaEstelas && map.hasLayer(colaEstelas) ? colaEstelas.caixasNoms() : null,
					caixasVilasDOM,
					colaDonadas.caixasNoms(),
					...Object.entries(colasLengas)
						.filter(([o]) => o !== id)
						.map(([, c]) => c.caixasNoms())
				],
				onSurvòl: (k, info) => (survòlsLengas = { ...survòlsLengas, [id]: info }),
				onCausida: (kods, info) => {
					causidasLengas = { ...causidasLengas, [id]: info };
					causits = [...causits.filter((k) => !k.startsWith(lg.pref)), ...kods];
				},
				onDonadas: (d) => {
					fonsLengas[id] = fonsLenga(lg, d);
					delete fonsFr[id];
					colaEstelas?.setLengaFons(id, visibility[id] ? fonsDe(id) : null);
				}
			});
			colasLengas[id].addTo(map);
		}
		colaTematica = crearColaTematica(L, {
			clar,
			lang,
			jaces: jacesTematicas(visibility),
			// las provincias, que cobrisson tot, cedisson als dialèctes e al Creissent
			cedirProv: (lp) => !!(map.hasLayer(colaDonadas) && colaDonadas.zonaA(lp)) || zonaLengaA(lp),
			// los noms de vilas de la carta en estelas : los noms de províncias los evitan
			obstacles: () => [colaEstelas && map.hasLayer(colaEstelas) ? colaEstelas.caixasNoms() : null, caixasVilasDOM, colaDonadas.caixasNoms(), ...Object.values(colasLengas).map((c) => c.caixasNoms())],
			onSurvòl: (info) => (survòlTem = info),
			activa,
			onCausida: causidaTematica
		});
		colaTematica.addTo(map);
		// Lo doble clic centra la vista sus la donada jos lo ponteiro (Romain,
		// 2026-10-09) : un ponch (vila a ficha, luòc), puèi una zòna (comuna,
		// parc, província, dialècte d'una autra lenga, dialècte occitan,
		// despartament o region) ; endacòm mai, lo zoom de Leaflet. Lo segond
		// clic es ignorat per las còlas : la causida del primièr demòra.
		map.doubleClickZoom.disable();
		// (un clic sus una vila o un luòc i vòla ja : lo doble clic ajusta pas res)
		let tClic = -1e9,
			tMov = -1e9;
		map.on('click', () => (tClic = performance.now()));
		// (lo contorn de las lengas vesinas, 12 Ko, cargat d'avança : al det, lo
		// primièr tòc deu ja saber se una lenga es jos el)
		cargarVesinas();
		// las lengas vesinas : al survòl, l'invitacion ; al clic, la lenga s'aluca
		// (al det, lo primièr tòc mòstra l'invitacion, que se tòca per alucar)
		map.on('mousemove', (e) => {
			if (!vesinas) return void cargarVesinas();
			// (une zone thématique, les provinces, couvre tout : elle ne cache pas l'invitation)
			const k = survòl || survòlLenga ? null : vesinaA(e.latlng);
			if (k !== (vesina?.kod ?? null)) vesina = k ? descVesina(k) : null;
			colaEstelas?.amagarLegenda(!!k);
			// (la main seulement là où le clic allume la langue)
			mapEl?.classList.toggle('sus-vesina', !!k && (k.startsWith('rèsta:') || !clicPres(e.latlng)));
		});
		map.on('mouseout', () => {
			vesina = null;
			colaEstelas?.amagarLegenda(false);
			mapEl?.classList.remove('sus-vesina');
		});
		map.on('click', async (e) => {
			await cargarVesinas();
			if (survòl || survòlLenga) return;
			const k = vesinaA(e.latlng);
			if (!k) return void (matchMedia('(hover: hover)').matches || ((vesina = null), colaEstelas?.amagarLegenda(false)));
			if (matchMedia('(hover: hover)').matches && (k.startsWith('rèsta:') || !clicPres(e.latlng))) alucarVesina(k);
			else {
				vesina = descVesina(k);
				colaEstelas?.amagarLegenda(true);
			}
		});
		map.on('movestart', () => (tMov = performance.now()));
		map.on('dblclick', (e) => {
			if (tMov >= tClic && tMov - tClic < 600) return;
			const lp = e.layerPoint,
				v = (c) => c && map.hasLayer(c);
			// la couche active seule (façon QGIS, Romain 2026-10-19) : le double clic
			// centre sur son objet et zoome pour le cadrer ; rien dessous : un cran de zoom
			const a = activa();
			const cad = a
				? a === 'vilas'
					? v(colaEstelas) && colaEstelas.ponchA(lp)
					: a === 'regions' || a === 'despartaments'
						? v(colaEstelas) && colaEstelas.cadreA(lp)
						: a === 'dialectes'
							? v(colaDonadas) && colaDonadas.cadreA(lp)
							: a === 'comunas' || a === 'provincias' || a === 'parcs'
								? v(colaTematica) && colaTematica.cadreA(lp)
								: v(colasLengas[a]) && colasLengas[a].cadreA(lp)
				: (v(colaEstelas) && colaEstelas.ponchA(lp)) ||
				(v(colaTematica) && colaTematica.cadreA(lp)) ||
				Object.values(colasLengas).reduce((r, c) => r || (v(c) && c.cadreA(lp)), null) ||
				(v(colaDonadas) && colaDonadas.cadreA(lp)) ||
				(v(colaEstelas) && colaEstelas.cadreA(lp));
			if (cad) centrarSus(cad);
			else map.setZoomAround(e.containerPoint, map.getZoom() + (e.originalEvent?.shiftKey ? -1 : 1));
		});
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
		// (los gèstes que copan l'entrada en scèna s'escotan quand comença, pas
		// abans : un toquet pendent lo cargament fasiá tot aparéisser d'un còp)
		quitarIntro = () => {
			acabada = true;
			sons?.copar();
			for (const ev of escotas) window.removeEventListener(ev, acabarIntro, true);
			document.removeEventListener('visibilitychange', amagada);
		};
		Promise.race([
			Promise.all([colaEstelas?.prèsta(), colaDonadas.prèsta()]),
			new Promise((r) => setTimeout(r, 4000))
		]).then(() => {
			estatCarta.cargament = 1;
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					// la carta es prèsta : l'ecran de cargament s'escafa
					estatCarta.prèsta = true;
					if (acabada) return;
					for (const ev of escotas) window.addEventListener(ev, acabarIntro, true);
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
			);
		});
		// un luòc de la carta en pixèls d'ecran (los primièrs passes, Guida.svelte)
		ecranCarta.punt = (lat, lon) => {
			const p = map.latLngToContainerPoint([lat, lon]), r = map.getContainer().getBoundingClientRect();
			return { x: r.left + p.x, y: r.top + p.y };
		};
		// desbugatge (sonque en desvolopament) : la carta e sas còlas dins la consòla
		if (import.meta.env.DEV) window.__carta = { map, colaDonadas, colasLengas, get colaCatalan() { return colasLengas.catalan; }, get colaEstelas() { return colaEstelas; }, get colaTematica() { return colaTematica; }, get motorNoms() { return motorNoms; } };
		zoomDoç(L, map);
		motorNoms = crearNomsComunas(L, map, {
			lista: nomsDeLaCarta,
			estil: (c) => (c.estil?.clau === clauEstil ? c.estil : (c.estil = estilNom(c))),
			// (pendent la revelacion, los nívols que se dissipan : cap de nom)
			// (ni en mode écoute : les points des voix portent leurs noms)
			actiu: () => baseLayer === 'estelas' && map.getZoom() >= Z.RELAIS && !map.getContainer().classList.contains('revelant') && !escota,
			popMin: popNomsSite,
			obstacles: caixasDeCòlas,
			onRepaus: noms_repaus
		});
		new MutationObserver(() => motorNoms?.tornarPintar()).observe(map.getContainer(), { attributes: true, attributeFilter: ['class'] });
		// Un clic sul nom d'una comuna la causís e i mena, en doçor, a una escala
		// centrada sus ela (retorn de Romain, 2026-10-11). Lo clic es pres abans
		// las còlas (captura) : los dialèctes jos lo nom se causisson pas.
		{
			const cont = map.getContainer();
			const nomA = (e) => motorNoms?.a(map.mouseEventToContainerPoint(e));
			cont.addEventListener(
				'click',
				(e) => {
					// (la fin d'un lisament de la carta es pas un clic)
					if (map.dragging?.moved()) return;
					// (los botons de la carta, la ficha, las fonts : pas un clic sus la carta)
					if (e.target.closest?.('.leaflet-control-container, .ficha-comuna, .legenda-dial, .fonts-carta, .leaflet-popup')) return;
					// (una pastilha o una estela de las jaces jos lo det : lo clic es per ela)
					if (e.target.closest?.('.leaflet-marker-icon') || ponchs?.tela.tocada(e)) return;
					const c = nomA(e);
					if (!c) return void causirNomComuna(null);
					e.stopImmediatePropagation();
					e.preventDefault();
					anarALaComuna(c);
				},
				true
			);
			// (lo doble clic sus un nom fa pas lo zoom de la carta per dessús)
			cont.addEventListener('dblclick', (e) => nomA(e) && (e.stopImmediatePropagation(), e.preventDefault()), true);
			cont.addEventListener('mousemove', (e) => cont.classList.toggle('sus-nom', !!nomA(e)), true);
			addEventListener('keydown', (e) => e.key === 'Escape' && causirNomComuna(null));
		}
		map.on('moveend', majNomsComunas);
		map.on('moveend layeradd layerremove', programarDegatjament);
		map.on('zoomend', applyToponymVisibility);
		map.on('zoomend', majDetalh);
		// una bulla de luòc se tampa al clic endacòm mai (la recèrca, lo rail,
		// lo capçal), coma la rèsta del site ; sus la carta, lo clic que la tampa
		// fa pas res mai (principi de navigacion, 2026-10-10)
		map.on('popupopen', () => {
			const lèva = tampaDefòra((t) => !!t.closest('.leaflet-popup'), () => map?.closePopup());
			map.once('popupclose', lèva);
		});
		// de luènh (« 500 km »), los ponches (luòcs, librarias, Calandretas)
		// s'escantisson amb las autras jaces : demòra lo contorn de l'Occitània
		const luènh = () => {
			const l = aDetalh(nivèlsDezoom(map), map.getZoom()) < 0.25;
			mapEl?.classList.toggle('luenh', l);
			// (invisibles : pas mai atenhables al clavièr, e lor bulla se tampa)
			for (const el of map.getPane('markerPane').children)
				if (!el.classList.contains('lenga-franca') && el.hasAttribute('tabindex')) el.tabIndex = l ? -1 : 0;
			if (l) map.closePopup();
		};
		map.on('zoomend', luènh);
		luènh();
		const estelas = () => mapEl?.classList.toggle('ponchs-estelas', map.getZoom() < Z.ICONAS);
		map.on('zoomend', estelas);
		// la vista actuala, per lo rail (escalas de las jaças alucadas)
		const difusarVista = () => {
			estatCarta.z = map.getZoom();
			estatCarta.lat = map.getCenter().lat;
		};
		map.on('moveend', difusarVista);
		difusarVista();
		estelas();
		if (ambToponims(baseLayer)) loadToponymsLayer();

		L.control.zoom({ position: 'bottomright' }).addTo(map);
		// Lo plen ecran (demanda de Romain) : un boton al dessús del zoom
		const PlenEcran = L.Control.extend({
			options: { position: 'bottomright' },
			onAdd() {
				const c = L.DomUtil.create('div', 'leaflet-bar plen-ecran');
				botonPlen = L.DomUtil.create('a', '', c);
				botonPlen.href = '#';
				botonPlen.setAttribute('role', 'button');
				L.DomEvent.disableClickPropagation(c);
				L.DomEvent.on(botonPlen, 'click', (e) => {
					L.DomEvent.preventDefault(e);
					onVisualizacion?.(!visualizacion);
				});
				majPlen();
				return c;
			}
		});
		new PlenEcran().addTo(map);
		const TornarOc = L.Control.extend({
			options: { position: 'bottomright' },
			onAdd() {
				const c = L.DomUtil.create('div', 'leaflet-bar tornar-oc');
				botonOc = L.DomUtil.create('a', '', c);
				botonOc.href = '#';
				botonOc.setAttribute('role', 'button');
				botonOc.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="${ICONA_OC}" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`;
				L.DomEvent.disableClickPropagation(c);
				L.DomEvent.on(botonOc, 'click', (e) => {
					L.DomEvent.preventDefault(e);
					tornarALOccitan();
				});
				majTornarOc();
				return c;
			}
		});
		new TornarOc().addTo(map);
		// « Netejar la carta » en acorchi (demanda de Romain, 2026-10-10) :
		// dessús l'icòna occitana, lo meteis gèst que dins « Sus la carta »
		const Netejar = L.Control.extend({
			options: { position: 'bottomright' },
			onAdd() {
				const c = L.DomUtil.create('div', 'leaflet-bar netejar-carta');
				botonNet = L.DomUtil.create('a', '', c);
				botonNet.href = '#';
				botonNet.setAttribute('role', 'button');
				botonNet.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 3 8.5l9 4.5 9-4.5z" fill="currentColor" fill-opacity="0.25"/><path d="m3 12.5 9 4.5 9-4.5" opacity=".55"/><path d="M4 20 20 4"/></svg>';
				L.DomEvent.disableClickPropagation(c);
				L.DomEvent.on(botonNet, 'click', (e) => {
					L.DomEvent.preventDefault(e);
					onNetejar?.();
				});
				majNetejar();
				return c;
			}
		});
		new Netejar().addTo(map);
		// Lo fons de carta (decision de Romain, 2026-10-10) : sortit del rail,
		// amont dels autres botons de la carta ; dobrís lo tirador « Fons » de
		// RailJaces, plaçat al costat d'aqueste boton
		const FonsCarta = L.Control.extend({
			options: { position: 'bottomright' },
			onAdd() {
				const c = L.DomUtil.create('div', 'leaflet-bar fons-carta');
				botonFons = L.DomUtil.create('a', '', c);
				botonFons.href = '#';
				botonFons.setAttribute('role', 'button');
				botonFons.setAttribute('aria-expanded', 'false');
				botonFons.setAttribute('aria-controls', 'tirador-jaces');
				botonFons.innerHTML = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 4l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>';
				L.DomEvent.disableClickPropagation(c);
				L.DomEvent.on(botonFons, 'click', (e) => {
					L.DomEvent.preventDefault(e);
					window.dispatchEvent(new CustomEvent('carta-fons', { detail: { boton: botonFons } }));
				});
				majFons();
				return c;
			}
		});
		new FonsCarta().addTo(map);
		map.attributionControl?.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
		{
			const ctl = map.attributionControl;
			if (ctl) {
				ctl._update = function () {
					if (!this._map) return;
					fontsCarta = Object.keys(this._attributions).filter((k) => this._attributions[k]);
					const tx = lang === 'fr' ? 'Sources' : 'Fonts';
					this._container.innerHTML = `<button type="button" class="fonts-b" aria-haspopup="dialog">${tx}</button><span aria-hidden="true"> · </span>© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>`;
					this._container.querySelector('.fonts-b').onclick = (e) => {
						e.preventDefault();
						fontsDobèrtas = !fontsDobèrtas;
					};
				};
				L.DomEvent.disableClickPropagation(ctl.getContainer());
				ctl._update();
			}
		}
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
		// lo dialècte del centre, de prèp : al dessús de la barra
		elDialLuòc = L.DomUtil.create('div', 'dial-luoc', escala.getContainer());
		elDialLuòc.setAttribute('aria-hidden', 'true');
		map.on('moveend', () => requestAnimationFrame(majDialLuòc));
		// (lo nom del palièr, « Las comunas » sus « 5 km », se legissiá coma una
		// mesura e Romain sabiá pas çò que voliá dire, 2026-10-10 : levat ; la
		// barra mòstra sonque la distància)

		// Puèi las donadas de la basa (luòcs, còlas)
		const [{ data: luocsData }, { data: colasData }] = await Promise.all([
			supabase.from('carta_luocs').select('*').eq('publicat', true).order('ordre'),
			cargarColas()
		]);

		for (const c of colasData ?? []) {
			colaColors[c.id] = c.color;
			colaOpacitats[c.id] = c.opacitat;
			// Còlas genericas de zònas/linhas : tota la definicion ven de la basa.
			if ((c.tipe === 'zonas' || c.tipe === 'linhas') && c.geojson_url) {
				geoDefs[c.id] = makeGenericGeoDef(c);
			}
		}
		// Las jaces de la còla de donadas son pas de jaces Leaflet
		for (const id of [...JACES_DONADAS, ...JACES_LENGAS]) delete geoDefs[id];

		// Grope los punts per còla. Los punts d'abans la colomna cola_id (basa
		// pas encara migrada) son de luòcs d'interès.
		const perCola = {};
		for (const luoc of luocsData ?? []) {
			const cid = luoc.cola_id ?? 'lieusInteres';
			(perCola[cid] ??= []).push(luoc);
		}

		for (const [cid, luocs] of Object.entries(perCola)) {
			pointLayers[cid] = ponchs.grop(
				luocs.map((lieu) => {
					const nom = (lang === 'fr' && lieu.nom_fr) || lieu.nom_oc;
					const desc = (lang === 'fr' && lieu.descripcion_fr) || lieu.descripcion_oc;
					// son site (colomna ligam, se la basa l'a) e lo ligam de navigacion
					const accions = [
						/^https:\/\//.test(lieu.ligam ?? '') ? accionBulla('world', lieu.ligam, txAccions().site, true) : '',
						accionsNav(lieu.latitud, lieu.longitud, nom)
					].join('');
					return dobleClicSus(L.marker([lieu.latitud, lieu.longitud], { icon: iconaPunt(cid), title: nom, keyboard: true })).bindPopup(
						`<strong>${escapeHtml(nom)}</strong>${desc ? `<br>${escapeHtml(desc)}` : ''}${accions ? `<span class="accions-bulla">${accions}</span>` : ''}`
					);
				}),
				cid
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
		for (const [id, c] of Object.entries(colasLengas)) {
			c.setActiu(!!vis[id]);
			colaEstelas?.setLengaFons(id, vis[id] ? fonsDe(id) : null);
		}
		// lo territòri survolat o clicat seguís las jaces alucadas (region o despartament)
		colaEstelas?.setTerritoris({ regions: !!vis.regions, despartaments: !!vis.despartaments, comunas: !!vis.comunas });
		colaTematica?.setJaces(jacesTematicas(vis));
		if (vis.calandretas) cargarCalandretas();
		if (JACES_ENSENHAMENT.some((id) => vis[id])) cargarEnsenhament();
		if (vis.corsAdults) cargarCorses();
		if (vis.cercles || vis.culturaOc) cargarCercles();
		if (vis.limsi) cargarEnquistas();
		if (vis.lengasFranca) cargarLengas();
		// dialèctes o Creissent visibles : lo survòl e lo clic son per eles
		colaEstelas?.setModeDialectes(!!vis.dialectes);

		for (const [cid, layer] of Object.entries(pointLayers)) {
			if (vis[cid]) {
				const tornar = !!partidas[cid];
				clearTimeout(partidas[cid]);
				partidas[cid] = null;
				// (rapelada en plena onda d'escantiment : l'onda d'aluc tòrna partir)
				if (tornar && layer.reviure) layer.reviure();
				else layer.eachLayer((m) => m._icon?.classList.remove('ponch-se-va'));
				layer.addTo(map);
			} else if (map.hasLayer(layer) && !partidas[cid]) {
				// los ponches s'escantisson un a un abans de partir (demanda de
				// Romain, 2026-10-09 : « quand elles s'effacent, il faut que ce soit joli »)
				if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
					map.removeLayer(layer);
					continue;
				}
				// (las jaces de la tela : una onda lumenosa las escantís, vejatz colaPonchs.js)
				if (layer.escantir) layer.escantir();
				else layer.eachLayer((m) => m._icon?.classList.add('ponch-se-va'));
				partidas[cid] = setTimeout(
					() => {
						partidas[cid] = null;
						map?.removeLayer(layer);
					},
					layer.escantir ? ponchs.DURADA_MS : 1000
				);
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
		for (const cl of Object.values(colasLengas)) cl.setTema(c, d);
		colaTematica?.setTema(c);
		ponchs?.tela.repintar();
	});
	$effect(() => {
		const l = lang;
		colaEstelas?.setLenga(l);
		colaDonadas?.setLenga(l);
		for (const cl of Object.values(colasLengas)) cl.setLenga(l);
		colaTematica?.setLenga(l);
		tèxtesLeaflet();
	});
	// La lectura (territòri / uèi) : las tenchas dels dialèctes s'estompan
	$effect(() => {
		const u = lectura;
		colaDonadas?.setLectura(u);
	});
	// Elements e colors del fons, dialècte causit dempuèi lo panèl
	$effect(() => {
		// (en mode écoute, sans les noms des villes)
		const el = elementsVesibles();
		colaEstelas?.setElements(el);
	});
	$effect(() => {
		const c = { ...colors };
		colaEstelas?.setColors(c);
	});
	$effect(() => {
		const kods = [...causits];
		colaDonadas?.causir(kods.filter(esOccitan));
		for (const cl of Object.values(colasLengas)) cl.causir(kods);
		const nòus = causitsAbans ? kods.filter((k) => !causitsAbans.includes(k)) : [];
		causitsAbans = kods;
		if (nòus.length) anarAlsDialectes(nòus.find(esOccitan) ?? null);
	});

	// Los dialèctes cochats, o un dialècte causit, de mai luènh que 100 km : la
	// carta i vòla, a 100 km (demanda de Romain, 2026-10-09 ; lo fuòc
	// d'artifici se jòga a l'arribada, colaDonadas)
	let visAbans = null,
		causitsAbans = null;
	function anarAlsDialectes(kod) {
		if (!map || !L) return;
		if (map.getZoom() >= zDès(KM.dialectes, map.getCenter().lat)) return;
		const cadre = kod ? colaDonadas?.cadreDialècte(kod) : null,
			occ = L.latLng(44.5, 2.97);
		const c = cadre ? L.latLngBounds(cadre.bounds).getCenter() : map.getBounds().contains(occ) ? map.getCenter() : occ;
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		map.flyTo(c, zCran(KM.dialectes, c.lat), { animate: !calm, duration: calm ? 0 : 1.4 });
	}
	// Una jaça cochada en defòra de sa plaja d'escalas : la carta va a
	// l'escala vesibla la mai pròcha (escalas.js, PLAJAS), sens cambiar de
	// centre se l'Occitània es a l'ecran
	function anarALaPlaja(id) {
		if (!map || !L) return;
		const z = zPlaja(id, map.getZoom(), map.getCenter().lat);
		if (z == null) return;
		// Les langues de France allumées de trop loin : toute la France, où leurs
		// étiquettes se lisent (au cran de 400 km, la vue « monde » ne montre que
		// l'outre-mer ; Romain, 2026-10-19, découvrir la diversité linguistique)
		if (id === 'lengasFranca' && z > map.getZoom()) {
			const estrech = map.getSize().x <= 600,
				calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
			// (sur téléphone, les marges de vistaOccitana : la colonne de boutons à droite)
			return void map.flyToBounds(L.latLngBounds([41.33, -5.15], [51.09, 9.56]), {
				paddingTopLeft: L.point(estrech ? 12 : 110, estrech ? 110 : 90),
				paddingBottomRight: L.point(estrech ? 58 : 70, estrech ? 96 : 50),
				duration: calm ? 0 : 1.3
			});
		}
		const occ = L.latLng(44.5, 2.97),
			c = map.getBounds().contains(occ) ? map.getCenter() : occ,
			calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		map.flyTo(c, z, { animate: !calm, duration: calm ? 0 : 1.2 });
	}
	// Lo mòde « Lengas de França » (Romain, 2026-10-10) : cada lenga mòstra
	// d'en primièr sa part francesa (sa jaça retalhada al contorn de França, sas
	// vilas d'estrangièr escafadas) ; « Veire la lenga dins son environament
	// lingüistic » (estatCarta.environament) mòstra la rèsta
	const nomésFrança = (id) => estatCarta.mòde === 'lengas' && !estatCarta.environament.includes(id);
	const fonsFr = {};
	const fonsDe = (id) => {
		const f = fonsLengas[id] ?? null;
		if (!f || !nomésFrança(id) || !francaCargada()) return f;
		return (fonsFr[id] ??= { ...f, vilas: f.vilas?.filter((v) => dinsFranca(v.lat, v.lon)) ?? null });
	};
	// La carta va sus las lengas que venon d'èsser alucadas (Romain, 2026-10-10) :
	// sonque lor part francesa o tota la lenga ; mantuna alucadas l'una aprèp
	// l'autra : un sol vòl, un moment aprèp lo darrièr clic, que las mòstra
	// totas (lo panèl a esquèrra, la barra en bas sul telefòn)
	let minutaVòl = null;
	const recentas = new Set();
	function anarALasLengas(nòvas = []) {
		for (const k of nòvas) recentas.add(k === 'dialectes' ? 'occitan' : k);
		clearTimeout(minutaVòl);
		minutaVòl = setTimeout(async () => {
			const ids = [...recentas].filter((id) => (id === 'occitan' ? visibility.dialectes : visibility[id]));
			recentas.clear();
			if (!map || !L || !ids.length) return;
			await Promise.all([cargarVesinas(), cargarFranca()]);
			if (!vesinas) return;
			let b = null;
			for (const id of ids)
				for (const a of vesinas[id] ?? [])
					for (const [x, y] of a) {
						if (nomésFrança(id) && !dinsFranca(y, x)) continue;
						b = b ? b.extend([y, x]) : L.latLngBounds([y, x], [y, x]);
					}
			if (!b) return;
			const estrech = map.getSize().x <= 600,
				panèl = !!document.getElementById('tirador-jaces'),
				calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
			map.flyToBounds(b, {
				// (la plaça del panèl, sonque se es dobèrt)
				paddingTopLeft: L.point(estrech ? 16 : panèl ? 420 : 110, estrech ? 110 : 90),
				paddingBottomRight: L.point(estrech ? 16 : 70, estrech ? 90 : 50),
				// (pas pus prèp que ~40 km : lo fons demòra lo de las lengas, pas lo satellit)
				maxZoom: Math.floor(zDès(40, b.getCenter().lat) / 0.25) * 0.25,
				duration: calm ? 0 : 1.3
			});
		}, 450);
	}
	// La rubrica « Donadas » del mòde « Lengas de França » (etapa 4) : creada
	// a la primièra jaça alucada ; l'alucar mena la carta sus sas donadas
	let donadasLengas = null;
	$effect(() => {
		const e = !!visibility.escolasBreton,
			l = !!visibility.limitsBreton;
		if (!map || (!e && !l && !donadasLengas)) return;
		donadasLengas ??= crearDonadasLengas(L, map, {
			color: untrack(() => LENGAS.breton?.color?.[clar ? 'clar' : 'sorne']),
			// (los limits istorics en ivòri, a despart del verd de las escòlas)
			colorLimits: untrack(() => (clar ? '#6b4e1f' : '#e9d7b0')),
			lang: untrack(() => lang),
			pad: () => {
				const estrech = map.getSize().x <= 600;
				// (la largor vertadièra del panèl, se es dobèrt)
				const tir = document.getElementById('tirador-jaces')?.getBoundingClientRect();
				return [estrech ? 16 : tir ? tir.right - map.getContainer().getBoundingClientRect().left + 28 : 110, estrech ? 110 : 90];
			}
		});
		donadasLengas.mostrar({ escolas: e, limits: l });
	});
	$effect(() => {
		const l = lang;
		untrack(() => donadasLengas?.setLang(l));
	});
	let envAbans = '';
	$effect(() => {
		const m = estatCarta.mòde,
			env = [...estatCarta.environament];
		if (!map) return;
		// (« environament » o « part francesa » cambiat : la carta i va)
		const clau = m + ':' + env.join(',');
		if (m === 'lengas' && envAbans && clau !== envAbans && envAbans.startsWith('lengas')) {
			// (la lenga que son environament càmbia)
			const abans = envAbans.slice(7).split(',').filter(Boolean);
			const cambiadas = [...env.filter((k) => !abans.includes(k)), ...abans.filter((k) => !env.includes(k))];
			untrack(() => anarALasLengas(cambiadas));
		}
		envAbans = clau;
		const aplicar = () =>
			untrack(() => {
				colaDonadas?.setFranca?.(m === 'lengas' && !env.includes('occitan'));
				for (const [id, c] of Object.entries(colasLengas)) {
					c.setFranca?.(m === 'lengas' && !env.includes(id));
					if (visibility[id]) colaEstelas?.setLengaFons(id, fonsDe(id));
				}
			});
		if (m === 'lengas') cargarFranca().then(aplicar);
		else aplicar();
	});
	// « I anar » del rail : una jaça alucada mas pas vesibla a aquesta escala
	$effect(() => {
		const anar = (e) => e.detail?.id && anarALaPlaja(e.detail.id);
		addEventListener('carta-anar-plaja', anar);
		return () => removeEventListener('carta-anar-plaja', anar);
	});
	// La vista d'ensemble de l'Occitània (retorn de Romain, 2026-10-11 :
	// « remets la vue par défaut à 70 km… voir l'Occitanie de cette manière
	// sur l'ensemble des appareils ») : tot lo domeni (del Creissent als
	// Pirenèus, de l'Ocean a las valadas d'Itàlia) dins l'espaci que demòra
	// liure (sens lo capçal e la recèrca, lo rail, los botons, la barra d'en
	// bas del telefòn), amb un pauc d'aire. Sus l'ordenador de Romain : 70 km.
	const OCCITANIA_VISTA = [
		[42.5, -1.8],
		[46.55, 7.7]
	];
	// Las zònas de l'ecran presas per l'interfàcia (botons de la carta, capçal,
	// recèrca, rail), en ponches del contenedor : los noms de las vilas i van
	// pas jos (retorn de Romain sul telefòn, 2026-10-11)
	function zonasUI() {
		if (!map) return [];
		const c = map.getContainer().getBoundingClientRect(),
			z = [];
		for (const el of document.querySelectorAll('.leaflet-control-container .leaflet-right .leaflet-control:not(.leaflet-control-attribution), .cerca, .info-trigger, .rail, .capçal')) {
			const r = el.getBoundingClientRect();
			if (r.width < 4 || r.height < 4) continue;
			z.push([r.left - c.left - 4, r.top - c.top - 4, r.right - c.left + 4, r.bottom - c.top + 4]);
		}
		return z;
	}
	function vistaOccitana() {
		const size = map.getSize(),
			telefon = size.x <= 700;
		// (esquèrra, naut, drecha, bas : la plaça presa per l'interfàcia ; sul
		// telefòn, l'Occitània sus tota la largor, al dessús de la colomna de
		// botons, se i a la plaça ; si que non, a costat)
		let [pe, pn, pd, pb] = telefon ? [12, 180, 58, 96] : [120, 140, 76, 44];
		if (telefon) {
			const c = map.getContainer().getBoundingClientRect();
			const tops = [...document.querySelectorAll('.leaflet-control-container .leaflet-right .leaflet-control:not(.leaflet-control-attribution)')]
				.map((el) => el.getBoundingClientRect().top - c.top)
				.filter((t) => t > 0);
			// (a l'arribada los botons son pas encara pausats : lor colomna fa ~380 px amb la barra d'en bas)
			const naut = tops.length ? Math.min(...tops) : size.y - 380;
			if (naut - pn > size.y * 0.3) [pd, pb] = [12, size.y - naut + 10];
		}
		const b = L.latLngBounds(OCCITANIA_VISTA);
		const z = Math.min(map.getBoundsZoom(b, false, L.point(pe + pd, pn + pb)) - 0.1, Z.ARRIBADA_MAX);
		// (lo domeni al mitan de l'espaci liure, pas de tot l'ecran)
		const liure = L.point((pe + size.x - pd) / 2, (pn + size.y - pb) / 2);
		const c = map.unproject(map.project(b.getCenter(), z).subtract(liure.subtract(size.divideBy(2))), z);
		return { c, z };
	}
	// Una jaça occitana cochada : la vista d'ensemble de l'Occitània, mai
	// pròche se la jaça se vei pas d'aquí (los dialèctes, a 100 km al mai)
	function anarALaVistaOccitana(id) {
		if (!map || !L) return;
		let { c, z } = vistaOccitana();
		const pl = PLAJAS[id];
		if (pl) z = Math.max(z, zCran(pl[0], c.lat));
		z = Math.min(z, Z.ARRIBADA_MAX);
		if (Math.abs(map.getZoom() - z) < 0.01 && map.getBounds().contains(c)) return;
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		map.flyTo(c, z, { animate: !calm, duration: calm ? 0 : 1.4 });
	}
	$effect(() => {
		const vis = { ...visibility },
			abans = visAbans;
		visAbans = vis;
		if (!abans) return;
		const nòvas = Object.keys(vis).filter((k) => vis[k] && !abans[k]);
		// (una jaça en apercebut al survòl : la carta bolega pas)
		if (estatCarta.apercebut && nòvas.includes(estatCarta.apercebut)) return;
		// (lo mòde Lengas : una lenga alucada, la carta i va)
		if (estatCarta.mòde === 'lengas' && nòvas.some((k) => LENGAS[k] || k === 'dialectes'))
			return untrack(() => anarALasLengas(nòvas.filter((k) => LENGAS[k] || k === 'dialectes')));
		// (mantuna jaça d'un còp — « Tot tornar », « Afichar l'occitan » : se los
		// dialèctes i son, la vista de l'Occitània ; si que non, la carta bolega pas)
		if (nòvas.length !== 1) {
			if (nòvas.includes('dialectes')) anarALaVistaOccitana('dialectes');
			return;
		}
		// (una jaça occitana : la vista de l'Occitània ; los dialèctes i jògan
		// lor fuòc d'artifici ; las autras : l'escala vesibla la mai pròcha)
		const id = nòvas[0];
		if (OCCITANAS.has(id)) anarALaVistaOccitana(id);
		else anarALaPlaja(id);
	});

	// Recherche : un lieu, la carte y vole (et l'y signale) ; un département ou
	// une région, elle se cadre dessus
	function anarA(r) {
		if (!map) return;
		map.closePopup();
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
		// (las boclas d'imatges s'arrèstan abans la carta : quitar la pagina
		// daissava de boclas que pintavan una carta levada ; sul servidor, res)
		if (typeof window === 'undefined') return;
		ecranCarta.punt = null;
		// (en tornant sus la carta, l'ecran de cargament tòrna)
		estatCarta.prèsta = false;
		estatCarta.cargament = 0;
		cancelAnimationFrame(degatRaf);
		motorNoms?.levar();
		map?.remove();
		map = null;
	});
</script>

<div class="carta-root" class:visualizacion>
	<div
		class="carta"
		class:amb-ficha={!!fichaComuna}
		class:muted={baseLayer === 'occitan' && clar}
		class:nuech={(baseLayer === 'occitan' || baseLayer === 'estelas') && !clar}
		bind:this={mapEl}
	></div>

	{#if !visualizacion}<CercaCarta {lang} onCausir={anarA} />{/if}

	<!-- lecteur des enquêtes vocales de l'Atlas sonore -->
	<VotzAtlas
		bind:this={votzComp}
		{lang}
		ponches={enquistas}
		colorDe={colorDial}
		nomDe={nomVotz}
		onPunt={veireVotz}
		onTampar={() => {
			votzAra = null;
			if (limsiPerFicha) onAlucar?.('limsi', false);
			limsiPerFicha = false;
		}}
		actiu={!!visibility.limsi && enquistas.length > 0 && !visualizacion}
		bind:mot={votzMot}
	/>

	<!-- La Calandreta mai pròcha : quand la jaça es alucada -->
	{#if visibility.calandretas && !visualizacion}
		<div class="procha" class:dobert={menuPròcha}>
			{#if menuPròcha}
				<div class="procha-menut" role="dialog" aria-label={txPròcha.titol}>
					<p class="procha-titol">{txPròcha.titol}</p>
					<button type="button" onclick={deMaPosicion}>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M12 2v2M12 20v2M20 12h2M2 12h2" /></svg>
						{txPròcha.posicion}
					</button>
					<label class="procha-comuna">
						<span>{txPròcha.comuna}</span>
						<input
							type="search"
							role="combobox"
							autocomplete="off"
							aria-autocomplete="list"
							aria-expanded={comunasTrobadas.length > 0}
							aria-controls="procha-lista"
							aria-activedescendant={comunaActiva >= 0 ? 'procha-op-' + comunaActiva : undefined}
							placeholder={txPròcha.exemple}
							bind:value={qComuna}
							onfocus={cargarNomsComunas}
							oninput={() => cercarComuna(qComuna)}
							onkeydown={claveComuna}
						/>
					</label>
					{#if comunasTrobadas.length}
						<ul class="procha-lista" id="procha-lista" role="listbox" aria-label={txPròcha.comuna}>
							{#each comunasTrobadas as c, i (c.fr + c.dep + i)}
								<li
									id={'procha-op-' + i}
									role="option"
									aria-selected={i === comunaActiva}
									class:activa={i === comunaActiva}
									onmousedown={(e) => (e.preventDefault(), causirComuna(c))}
								>
									{nomComuna(c)}{#if lang !== 'fr' && c.oc && c.oc !== c.fr}<small> {c.fr}</small>{/if}<small class="dep">{c.dep}</small>
								</li>
							{/each}
						</ul>
					{:else if normC(qComuna).length >= 2 && nomsComunas?.length}
						<p class="procha-mes">{txPròcha.cap}</p>
					{/if}
					{#if mesPròcha}<p class="procha-mes" aria-live="polite">{mesPròcha}</p>{/if}
					<p class="procha-privat">{txPròcha.privat}</p>
				</div>
			{/if}
			<button type="button" class="procha-boton" aria-expanded={menuPròcha} onclick={() => ((menuPròcha = !menuPròcha), (mesPròcha = null))}>
				<svg viewBox="0 0 24 24" aria-hidden="true">{@html ICONAS.school}</svg>
				{menuPròcha ? txPròcha.tampar : txPròcha.boton}
			</button>
		</div>
	{/if}

	<!-- Lo dialècte survolat o causit : meteissa etiqueta que los territòris -->
	{#if fichaComuna}
		<FichaComuna
			comuna={fichaComuna.c}
			contorn={fichaComuna.contorn}
			{lang}
			onTampar={() => causirNomComuna(null)}
			nomVotz={nomVotz}
			colorVotz={colorDial}
			onVotzCarta={votzSusLaCarta}
		/>
	{:else if legendaDial && !vesina}
		<div class="legenda-dial" class:fixada={!!(causida ?? causidaLenga)} class:amb-encadrat={!!legendaDial.encadrat} aria-live="polite">
			<span class="nom" lang={legendaDial.lang}>{lang === 'fr' ? legendaDial.fr : legendaDial.oc}</span>
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
			<!-- un encadrat, per las zònas que demandan una explicacion (Baiona) -->
			{#if legendaDial.encadrat}
				<p class="encadrat" lang={lang === 'fr' ? 'fr' : 'oc'}>{lang === 'fr' ? legendaDial.encadrat.fr : legendaDial.encadrat.oc}</p>
			{/if}
		</div>
	{:else if legendaTer && !vesina}
		<!-- lo departament o la region revelats (al dessús de tot) -->
		<div class="legenda-dial" class:fixada={legendaTer.fixat} aria-live="polite">
			<span class="nom">{legendaTer.nom}</span>
			<span class="sota">{legendaTer.sota}</span>
		</div>
	{/if}

	{#if fontsDobèrtas}
		<section class="fonts-carta" role="dialog" aria-label={lang === 'fr' ? 'Sources de la carte' : 'Fonts de la carta'} transition:fly={{ y: 10, duration: 220 }}>
			<header>
				<h2>{lang === 'fr' ? 'Sources de la carte' : 'Fonts de la carta'}</h2>
				<button type="button" class="tampar-fonts" aria-label={lang === 'fr' ? 'Fermer' : 'Tampar'} onclick={() => (fontsDobèrtas = false)}><Icona nom="fermer" size="20px" /></button>
			</header>
			<dl>
				{#each fontsPerTèma as g (g.tèma)}
					<dt>{g.tèma || (lang === 'fr' ? 'Carte' : 'Carta')}</dt>
					{#each g.fonts as font (font)}<dd>{@html font}</dd>{/each}
				{/each}
				<dt>{lang === 'fr' ? 'Affichage' : 'Afichatge'}</dt>
				<dd><a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a></dd>
			</dl>
		</section>
	{/if}

	<!-- (l'invitation passe devant l'étiquette d'une zone survolée ou choisie :
	     elle n'existe que sous le pointeur, ou après un toucher, sur une langue cachée) -->
	{#if vesina && !fichaComuna}
		<button type="button" class="legenda-dial vesina" onclick={() => alucarVesina(vesina.kod)}>
			<span class="nom" lang={vesina.lang ?? LENGAS[vesina.kod.replace('rèsta:', '')]?.lang ?? 'oc'}>{vesina.endo}</span>
			<span class="sota">{lang === 'fr' ? vesina.fr : vesina.oc} <Icona nom="suivant" /></span>
		</button>
	{/if}

	<!-- Flèche du nord (dessin de Romain, 2026-10-15, design-stock/icones/Fleche_nord.webp,
	     redessiné en tracé) : deux cercles, le fin dehors, l'épais dedans ; la pointe
	     touche le cercle extérieur et s'effile jusqu'au centre -->
	<div class="compass" class:escantit={!!fichaComuna} aria-hidden="true">
		<svg viewBox="-50 -64 100 114" width="44" height="50">
			<!-- petit N italique au-dessus de la pointe (demande de Romain, 2026-10-15) -->
			<text x="0" y="-41" text-anchor="middle">N</text>
			<circle r="35.5" fill="none" stroke="currentColor" stroke-width="1.8" />
			<circle r="28.1" fill="none" stroke="currentColor" stroke-width="3.6" />
			<path d="M0 -35.5L14.3 -24.2A28.1 28.1 0 0 0 4.2 -27.8L0 -0.2L-4.2 -27.8A28.1 28.1 0 0 0 -14.3 -24.2Z" fill="currentColor" />
		</svg>
	</div>
</div>

<style>
	/* Los punts de las jaces (luòcs d'interès, librariás…) : pastilha de veire,
	   icòna e liseret de la color de la jaça */
	:global(.ponch-jaça) {
		--ponch: var(--t-aur);
		background: none;
		border: 0;
		outline: none;
	}
	/* la pastille et son fil se placent par rapport au lieu (taille nulle de
	   l'icône) ; --dx, --dy, --ang et --fil viennent de degatjarPonchs, qui
	   décale la pastille quand elle cacherait un nom de ville */
	:global(.ponch-pos) {
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(calc(var(--ox, 0px) + var(--dx, 0px) - 13px), calc(var(--oy, 0px) + var(--dy, -21px) - 13px));
		transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.3, 1);
	}
	:global(.ponch-fil) {
		position: absolute;
		left: calc(var(--ox, 0px) - 0.75px);
		top: var(--oy, 0px);
		width: 1.5px;
		height: var(--fil, 8px);
		transform-origin: 0 0;
		transform: rotate(var(--ang, 3.14159rad));
		transition: height 0.3s, transform 0.3s;
		pointer-events: none;
	}
	:global(.ponch-cueta) {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--ponch);
	}
	:global(.ponch-jaça:focus-visible .ponch) {
		outline: 2px solid var(--t-aur-clar);
		outline-offset: 2px;
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
	/* En s'anant (jaça decochada), cada ponch s'escantís a son moment */
	:global(.ponch-se-va .ponch),
	:global(.ponch-se-va .ponch-cueta),
	:global(.ponch-se-va .ponch-estela),
	:global(.ponch-se-va.lenga-franca span) {
		animation: ponch-part 0.45s cubic-bezier(0.5, 0, 0.8, 0.4) forwards;
		animation-delay: calc(var(--retard, 0ms) * 0.5);
	}
	@keyframes ponch-part {
		to {
			opacity: 0;
			transform: scale(0.2);
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
		:global(.ponch-se-va .ponch),
		:global(.ponch-se-va .ponch-cueta),
		:global(.ponch-se-va .ponch-estela),
		.carta :global(.lenga-franca span) {
			animation: none;
		}
	}
	:global(.ponch-jaça-librarias) {
		--ponch: var(--t-terra-viu);
	}
	/* cercles e associacions : plen quand l'activitat es provada, vuèg (traç
	   menut) quand l'associacion es sonque declarada (Romain, 2026-10-23) */
	:global(.ponch-jaça-cercles) {
		--ponch: var(--t-aur-clar);
	}
	:global(.ponch-jaça-culturaOc) {
		--ponch: var(--t-terra-viu);
	}
	/* l'ensenhament : la pastilha al gredon ; la sensibilizacion (mens d'oras),
	   un ponch pichon plen, sens icòna, per daissar veire l'ensenhament regular */
	/* una color per jaça : vejatz app.css (--t-ens-*) */
	:global(.ponch-jaça-calandretas) {
		--ponch: var(--t-ens-cal);
	}
	:global(.ponch-jaça-ensBilingue) {
		--ponch: var(--t-ens-bil);
	}
	:global(.ponch-jaça-ensEscola) {
		--ponch: var(--t-ens-esc);
	}
	:global(.ponch-jaça-ensSegond) {
		--ponch: var(--t-ens-seg);
	}
	:global(.ponch-jaça-ensSuperior) {
		--ponch: var(--t-ens-sup);
	}
	:global(.ponch-jaça-corsAdults) {
		--ponch: var(--t-ens-adu);
	}
	:global(.ponch-pichon .ponch) {
		width: 10px;
		height: 10px;
		background: var(--ponch);
		border-color: color-mix(in srgb, var(--t-fons-2) 70%, transparent);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
	}
	:global(.ponch-pichon .ponch svg),
	:global(.ponch-pichon .ponch-estela),
	:global(.ponch-pichon .ponch-fil) {
		display: none;
	}
	/* (lo ponch pichon es sul luòc meteis, sens camba : la camba fasiá un
	   tiret estranh sota cada ponch) */
	:global(.ponch-pichon .ponch-pos) {
		transform: translate(-5px, -5px);
	}
	:global(.leaflet-popup-content .lista-bulla) {
		margin: 0.3em 0 0.2em;
		padding-left: 1.1em;
		font-size: 0.9em;
	}
	:global(.ponch-plen .ponch) {
		background: var(--ponch);
		color: var(--t-fons-2, #1d1a17);
	}
	:global(.ponch-vuèg .ponch) {
		border-style: dashed;
	}
	/* la tela dels ponches (colaPonchs.js) : la man sus una estela ; escafada
	   a l'escala del mond, coma las pastilhas */
	:global(.leaflet-container.sus-estela) {
		cursor: pointer;
	}
	:global(.leaflet-ponchs-pane) {
		transition: opacity 0.45s;
	}
	.carta:global(.luenh) :global(.leaflet-ponchs-pane) {
		opacity: 0;
	}
	:global(.leaflet-popup-content small a) {
		color: var(--t-aur-clar);
	}
	:global(.leaflet-popup-content .nota-bulla) {
		display: block;
		margin-top: 0.3em;
		font-size: 0.85em;
		opacity: 0.85;
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
		:global(.ponch),
		:global(.ponch-pos),
		:global(.ponch-fil) {
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
	/* l'invitacion a descobrir una lenga vesina : un boton */
	.legenda-dial.vesina {
		pointer-events: auto;
		cursor: pointer;
		font: inherit;
		border-color: var(--t-aur);
	}
	.legenda-dial.vesina:hover,
	.legenda-dial.vesina:focus-visible {
		background: color-mix(in srgb, var(--t-aur) 18%, var(--t-fons-2));
		outline: none;
	}
	.carta:global(.sus-vesina.leaflet-grab),
	.carta:global(.sus-vesina) :global(.leaflet-interactive) {
		cursor: pointer;
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
	.legenda-dial.amb-encadrat {
		/* (una largor fixa : lo tèxt passa jos lo nom) */
		width: min(27rem, calc(100% - 2rem));
		border-radius: 12px;
	}
	.legenda-dial .encadrat {
		flex-basis: 100%;
		max-width: 26rem;
		margin: 4px auto 2px;
		padding-top: 7px;
		border-top: 1px solid color-mix(in srgb, var(--t-tinta) 25%, transparent);
		font: 400 12.5px/1.45 var(--font-body);
		text-align: left;
		white-space: normal;
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

	/* Contrôles Leaflet (zoom, plein écran, fonds…) dans la charte : le même
	   verre que le rail, sans trait (Romain, 2026-10-15 : ni autour des
	   boutons ni entre + et −), une ombre douce pour les détacher, or */
	.carta :global(.leaflet-bar) {
		border: 0;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
	}

	.carta :global(.leaflet-bar a) {
		width: 2.4rem;
		height: 2.4rem;
		line-height: 2.4rem;
		background: var(--t-veire);
		backdrop-filter: blur(10px);
		color: var(--t-aur-clar);
		border-bottom: 0;
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
		background: var(--t-veire-fort);
		color: var(--t-aur);
	}

	.carta :global(.leaflet-bar a:focus:not(:focus-visible)) {
		outline: none;
	}

	.carta :global(.leaflet-bar a:focus-visible) {
		outline: 2px solid var(--t-aur);
		outline-offset: -2px;
	}

	.carta :global(.plen-ecran a),
	.carta :global(.tornar-oc a),
	.carta :global(.netejar-carta a),
	.carta :global(.fons-carta a) {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	/* lo boton del fons, quand son tirador es dobèrt (coma dins lo rail) */
	.carta :global(.fons-carta a[aria-expanded='true']) {
		color: var(--t-aur-clar);
		background: color-mix(in srgb, var(--t-aur) 22%, var(--t-fons-2));
	}
	.carta :global(.leaflet-bar a.leaflet-disabled) {
		color: var(--t-linha);
		background: var(--t-veire);
	}

	/* Las fonts : una linha corta (© OpenStreetMap e lo boton « Fonts ») ; la
	   lista completa dins un panèl rengat per tèma (Romain, 2026-10-10) */
	.carta :global(.fonts-b) {
		padding: 0;
		border: 0;
		background: none;
		color: var(--t-aur-clar);
		font: inherit;
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}
	.fonts-carta {
		position: absolute;
		z-index: 1200;
		right: 12px;
		bottom: 30px;
		width: min(26rem, calc(100% - 24px));
		max-height: min(60%, 30rem);
		overflow-y: auto;
		padding: 14px 16px 12px;
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		background: color-mix(in srgb, var(--t-fons-2) 90%, transparent);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
		color: var(--t-tinta);
	}
	.fonts-carta header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}
	.fonts-carta h2 {
		margin: 0;
		font: 700 1rem/1.25 var(--font-body);
	}
	.tampar-fonts {
		width: 28px;
		height: 28px;
		border: 1px solid var(--t-linha);
		border-radius: 50%;
		background: none;
		color: var(--t-tinta-2);
		cursor: pointer;
	}
	.fonts-carta dl {
		margin: 0;
	}
	.fonts-carta dt {
		margin: 12px 0 4px;
		font: 700 0.72rem/1.3 var(--font-body);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.fonts-carta dd {
		margin: 0 0 4px;
		font-size: 0.84rem;
		line-height: 1.45;
	}
	.fonts-carta :global(a) {
		color: var(--t-aur-clar);
	}

	/* (la linha corta) */
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

	/* lo dialècte del centre, de prèp, just al dessús de la barra (retorn de Romain, 2026-10-11) */
	.carta :global(.dial-luoc) {
		display: flex;
		align-items: baseline;
		gap: 7px;
		margin: 0 0 5px;
		padding: 3px 10px 4px;
		border: 1px solid color-mix(in srgb, var(--t-tinta) 35%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-fons) 84%, transparent);
		color: var(--t-tinta);
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		transform: translateY(3px);
		transition:
			opacity 0.35s ease,
			transform 0.35s ease;
	}
	.carta :global(.dial-luoc.vesible) {
		opacity: 1;
		transform: none;
	}
	.carta :global(.dial-luoc .nom) {
		font: 700 10.5px/1.3 var(--font-body);
		letter-spacing: 1.8px;
		text-transform: uppercase;
	}
	.carta :global(.dial-luoc .sota) {
		font: 400 10.5px/1.3 var(--font-body);
		color: var(--t-aur-clar);
	}
	@media (prefers-reduced-motion: reduce) {
		.carta :global(.dial-luoc) {
			transition: none;
		}
	}

	/* lo palièr, just al dessús de la barra (al costat, tustava las mencions de la carta) */
	.carta :global(.leaflet-control-scale) {
		display: flex;
		flex-direction: column-reverse;
		align-items: flex-start;
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
	/* La Calandreta mai pròcha : un boton en bas, al mièg, al dessús de la
	   legenda ; son menut se desplega cap amont */
	.procha {
		position: absolute;
		z-index: 950;
		left: 50%;
		bottom: calc(108px + var(--barra-bas, 0px));
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		font-family: var(--font-body);
	}
	.procha-boton,
	.procha-menut {
		background: color-mix(in srgb, var(--t-fons-2) 92%, transparent);
		backdrop-filter: blur(10px);
		box-shadow:
			0 0 0 1px var(--t-linha),
			0 10px 28px rgba(0, 0, 0, 0.35);
		color: var(--t-tinta);
	}
	.procha-boton {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 8px 16px;
		border: 0;
		border-radius: 999px;
		font: 500 0.85rem/1.2 var(--font-body);
		cursor: pointer;
	}
	.procha-boton:hover,
	.procha-boton:focus-visible {
		color: var(--t-aur-clar);
	}
	.procha svg {
		width: 18px;
		height: 18px;
		flex: none;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.procha-menut {
		width: min(19rem, calc(100vw - 2rem));
		padding: 12px 14px;
		border-radius: 14px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.procha-menut button {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
		width: 100%;
		padding: 8px 10px;
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		background: none;
		color: inherit;
		font: 500 0.88rem/1.3 var(--font-body);
		text-align: left;
		cursor: pointer;
	}
	.procha-menut button:hover,
	.procha-menut button:focus-visible {
		border-color: var(--t-aur);
		color: var(--t-aur-clar);
	}
	.procha-comuna {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-top: 4px;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}
	.procha-comuna input {
		width: 100%;
		padding: 7px 10px;
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		background: color-mix(in srgb, var(--t-fons) 70%, transparent);
		color: var(--t-tinta);
		font: 400 0.9rem/1.3 var(--font-body);
	}
	.procha-comuna input:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 1px;
	}
	.procha-lista {
		margin: 0;
		padding: 0;
		list-style: none;
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		overflow: hidden;
	}
	.procha-lista li {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		padding: 6px 10px;
		font-size: 0.88rem;
		cursor: pointer;
	}
	.procha-lista li + li {
		border-top: 1px solid var(--t-linha);
	}
	.procha-lista li:hover,
	.procha-lista li.activa {
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
		color: var(--t-aur-clar);
	}
	.procha-lista small {
		font-size: 0.75rem;
		color: var(--t-tinta-2);
	}
	.procha-lista .dep {
		margin-left: auto;
	}
	.procha-titol {
		margin: 0 0 2px;
		font: 400 1.05rem/1.2 var(--font-heading);
		color: var(--t-aur-clar);
	}
	.procha-mes {
		margin: 2px 0 0;
		font-size: 0.8rem;
		color: var(--t-aur-clar);
	}
	.procha-privat {
		margin: 2px 0 0;
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--t-tinta-2);
	}
	/* las donadas del mòde « Lengas de França » */
	.carta :global(.bulla-donada) {
		padding: 7px 10px;
		border: 1px solid var(--t-linha);
		border-radius: 8px;
		background: color-mix(in srgb, var(--t-fons-2) 92%, transparent);
		color: var(--t-tinta);
		font: 0.8125rem/1.4 var(--font-body);
		box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
	}
	.carta :global(.bulla-donada::before) {
		display: none;
	}
	.carta :global(.bulla-donada .sota) {
		color: var(--t-tinta-2);
	}
	.carta :global(.etiqueta-limit) {
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--t-tinta);
		font: italic 600 0.75rem/1 var(--font-body);
		text-shadow:
			0 0 3px var(--t-fons),
			0 0 7px var(--t-fons);
	}
	.carta :global(.etiqueta-limit::before) {
		display: none;
	}
	.carta :global(.ponch-usatgièr) {
		stroke: var(--t-fons);
		fill: var(--t-aur-clar);
	}
	.carta :global(.leaflet-popup-content .distancia) {
		color: var(--t-aur-clar);
	}

	/* points des voix de l'Atlas sonore : la couleur du dialecte ; celui
	   qu'on écoute émet des ondes (lecteur « Ondas », 2026-10-12) */
	.carta :global(.votz-ponch) {
		cursor: pointer;
	}
	.carta :global(.votz-ponch span) {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
	}
	.carta :global(.votz-ponch b) {
		grid-area: 1 / 1;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--c);
		border: 1.5px solid rgba(18, 9, 6, 0.85);
		box-shadow:
			0 0 0 4px color-mix(in srgb, var(--c) 18%, transparent),
			0 0 12px color-mix(in srgb, var(--c) 55%, transparent);
		transition: transform 0.25s;
	}
	.carta :global(.votz-ponch:hover b),
	.carta :global(.votz-ponch:focus-visible b) {
		transform: scale(1.35);
	}
	.carta :global(.votz-ponch i) {
		grid-area: 1 / 1;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1.5px solid var(--c);
		opacity: 0;
	}
	.carta :global(.votz-ponch.ara b) {
		transform: scale(1.5);
		border-color: #fff8ec;
	}
	.carta :global(.votz-ponch.ara i) {
		animation: votz-onda 2.4s ease-out infinite;
	}
	.carta :global(.votz-ponch.ara i:nth-child(2)) {
		animation-delay: 0.8s;
	}
	.carta :global(.votz-ponch.ara i:nth-child(3)) {
		animation-delay: 1.6s;
	}
	/* le mot de la fable écrit sur chaque point (« Un mot, cent parlars ») */
	.carta :global(.votz-ponch em) {
		display: none;
		position: absolute;
		left: 50%;
		bottom: calc(50% + 6px);
		transform: translateX(-50%);
		font: 700 0.74rem/1 var(--font-body);
		font-style: normal;
		white-space: nowrap;
		color: var(--c);
		text-shadow:
			0 0 3px var(--t-fons),
			0 0 3px var(--t-fons),
			0 0 1px var(--t-fons);
		pointer-events: auto;
	}
	/* sans mot choisi : le nom du lieu enregistré, discret */
	.carta :global(.votz-ponch em.nom) {
		font: italic 400 0.82rem/1 var(--font-quote);
		color: var(--t-tinta);
		bottom: calc(50% + 7px);
	}
	.carta:global(.votz-mot-nom) :global(.votz-ponch em[data-m='nom']:not(.amagat)),
	.carta:global(.votz-mot-solelh) :global(.votz-ponch em[data-m='solelh']:not(.amagat)),
	.carta:global(.votz-mot-bisa) :global(.votz-ponch em[data-m='bisa']:not(.amagat)),
	.carta:global(.votz-mot-viatjaire) :global(.votz-ponch em[data-m='viatjaire']:not(.amagat)) {
		display: block;
	}
	/* l'allumage en vague : un éclat, un cercle qui s'ouvre, puis le nom */
	.carta :global(.votz-ponch.apareis b) {
		animation: votz-alucar 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: var(--vaga, 0s);
	}
	.carta :global(.votz-ponch.apareis i:first-child) {
		animation: votz-cercle 1.3s ease-out both;
		animation-delay: var(--vaga, 0s);
	}
	.carta :global(.votz-ponch.apareis em) {
		animation: votz-nom 0.7s ease both;
		animation-delay: calc(var(--vaga, 0s) + 0.45s);
	}
	@keyframes -global-votz-alucar {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		40% {
			transform: scale(1.9);
			opacity: 1;
			box-shadow:
				0 0 0 8px color-mix(in srgb, var(--c) 30%, transparent),
				0 0 28px var(--c);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
	@keyframes -global-votz-cercle {
		0% {
			transform: scale(1);
			opacity: 0.85;
		}
		100% {
			transform: scale(5.5);
			opacity: 0;
		}
	}
	@keyframes -global-votz-nom {
		from {
			opacity: 0;
			transform: translate(-50%, 4px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}
	/* en s'éteignant, chaque voix se retire à son tour */
	.carta :global(.votz-ponch.ponch-se-va b) {
		animation: ponch-part 0.45s cubic-bezier(0.5, 0, 0.8, 0.4) forwards;
		animation-delay: calc(var(--vaga, 0s) * 0.5);
	}
	.carta :global(.votz-ponch.ponch-se-va em) {
		opacity: 0;
		transition: opacity 0.3s;
	}
	@keyframes -global-votz-onda {
		from {
			transform: scale(1);
			opacity: 0.9;
		}
		to {
			transform: scale(6);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.carta :global(.votz-ponch.ara i) {
			animation: none;
			opacity: 0.5;
			transform: scale(2.4);
		}
	}

	/* las accions d'una bulla : un vèrb amb son icòna, una per linha */
	.carta :global(.accions-bulla) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		margin-top: 0.5rem;
	}
	.carta :global(.accion-bulla) {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 3px 0;
		color: var(--t-aur-clar);
		text-decoration: none;
	}
	.carta :global(.accion-bulla svg) {
		width: 16px;
		height: 16px;
		flex: none;
	}
	.carta :global(.accion-bulla span) {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}
	.carta :global(.accion-bulla.segonda) {
		padding: 0 0 0 calc(16px + 0.4rem);
		font-size: 0.78rem;
		color: var(--t-tinta-2);
	}
	.carta :global(.accion-bulla:hover span),
	.carta :global(.accion-bulla:focus-visible span) {
		text-decoration-thickness: 2px;
	}

	.carta :global(.cola-estelas) {
		pointer-events: none;
	}

	/* La flèche du nord forme un bloc avec l'échelle, en bas à gauche : posée
	   juste au-dessus, alignée sur son bord gauche (Romain, 2026-10-15). Le rail
	   s'arrête toujours au-dessus de ce bloc (sa hauteur maximale, RailJaces) :
	   avant, il la recouvrait dès que l'écran était un peu bas. En haut, elle
	   collait au logo du bandeau (retour de Romain, 2026-10-07). */
	/* Alignés sur le rail, où qu'il soit rangé à gauche (retour de Romain :
	   « alignement ») : l'échelle part de son bord gauche, la flèche (44 px) se
	   centre sur son axe. --rail-esq et --rail-mitan viennent de RailJaces ; à
	   défaut, la place par défaut du rail (marge, 4,6 rem de large). */
	.carta :global(.leaflet-left .leaflet-control-scale) {
		margin-left: var(--rail-esq, var(--marge, 1rem));
	}
	.compass {
		position: absolute;
		bottom: 2.75rem;
		left: calc(var(--rail-mitan, calc(var(--marge, 1rem) + 2.3rem)) - 22px);
		z-index: 900;
		color: var(--t-aur);
		opacity: 0.9;
		pointer-events: none;
	}
	.compass svg {
		display: block;
	}

	/* Telefon : las aisinas de lectura se lèvan sus la barra de las jaces */
	.carta :global(.leaflet-bottom) {
		bottom: var(--barra-bas, 0px);
		transition: opacity 0.25s ease;
	}
	/* (la ficha d'una comuna dobèrta sul telefòn : l'escala, lo dialècte e
	   los botons s'escantisson jos son panèl) */
	@container carta (max-width: 600px) {
		.carta.amb-ficha :global(.leaflet-bottom),
		.compass.escantit {
			opacity: 0;
			pointer-events: none;
		}
	}
	@container carta (max-width: 600px) {
		/* téléphone : le rail est la barre du bas ; la flèche se cale sur l'échelle */
		.compass {
			bottom: calc(var(--barra-bas, 0px) + 2.75rem);
			left: calc(var(--marge, 1rem) - 6px);
		}
		/* l'encadré long (Baiona, un département de la lecture « Uèi ») : entre
		   la marge gauche et la colonne des boutons (centré sur cet espace) */
		.legenda-dial.amb-encadrat {
			left: calc(50% - 1.6rem);
			width: calc(100% - 4.7rem);
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
	/* de luènh, los ponches s'escantisson (las lengas de França demòran). Lo
	   fondut va suls enfants : la raiç de l'icòna garda la transicion de
	   Leaflet pel zoom (los ponches sautavan a cada cran) */
	.carta :global(.leaflet-marker-pane > :not(.lenga-franca) > *) {
		transition:
			opacity 0.45s,
			visibility 0.45s,
			transform 0.4s cubic-bezier(0.2, 0.8, 0.3, 1.2),
			height 0.3s;
	}
	/* de luènh, cada ponch es una estela de la color de sa jaça, que
	   lusís doçament ; en s'aprochant, l'estela s'esvanís e l'icòna espelís */
	.carta :global(.ponch-estela) {
		position: absolute;
		left: -4px;
		top: -4px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--ponch);
		opacity: 0;
		visibility: hidden;
		transform: scale(0.3);
	}
	.carta :global(.ponch-estela::after) {
		content: '';
		position: absolute;
		inset: -7px;
	}
	/* lo lusiment : un alo precalculat que sonque son opacitat càmbia (la
	   carta grafica o fa sola ; animar l'ombra fasiá tot redessenhar) */
	.carta :global(.ponch-estela::before) {
		content: '';
		position: absolute;
		inset: -8px;
		border-radius: 50%;
		background: radial-gradient(circle, color-mix(in srgb, var(--ponch) 70%, transparent) 0%, transparent 65%);
		opacity: 0.35;
		will-change: opacity;
	}
	.carta:global(.ponchs-estelas) :global(.ponch-estela),
	.carta :global(.ponch-sol-estela .ponch-estela) {
		opacity: 1;
		visibility: visible;
		transform: scale(1);
	}
	.carta:global(.ponchs-estelas) :global(.ponch-estela::before),
	.carta :global(.ponch-sol-estela .ponch-estela::before) {
		animation: estela-lusis 3.2s ease-in-out infinite alternate;
		animation-delay: var(--retard, 0ms);
	}
	@keyframes estela-lusis {
		to {
			opacity: 1;
		}
	}
	.carta:global(.ponchs-estelas) :global(.ponch-pos),
	.carta:global(.ponchs-estelas) :global(.ponch-fil),
	.carta :global(.ponch-sol-estela .ponch-pos),
	.carta :global(.ponch-sol-estela .ponch-fil) {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}
	.carta:global(.ponchs-estelas) :global(.ponch-jaça .ponch),
	.carta :global(.ponch-sol-estela .ponch) {
		transform: scale(0.2);
	}
	/* Al zoom, pas tot d'un còp (demanda de Romain, 2026-10-09 : « comme des
	   pops jolis, un mouvement organique ») : cada ponch a son moment
	   (--retard, a l'azard). Las estelas espelisson en venent de luènh e
	   s'escantisson una a una en i tornant ; l'icòna tòrna espelir quand
	   l'estela li laissa la plaça (l'animacion es levada en mòde estela, e
	   se torna jogar quand aquel mòde s'acaba) */
	.carta :global(.leaflet-marker-pane .ponch-jaça > .ponch-estela) {
		transition-delay: calc(var(--retard, 0ms) * 0.6);
	}
	.carta:global(.ponchs-estelas:not(.luenh)) :global(.ponch-estela) {
		animation: estela-espelis 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.4) backwards;
		animation-delay: calc(var(--retard, 0ms) * 0.7);
	}
	@keyframes estela-espelis {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		60% {
			opacity: 1;
			transform: scale(1.7);
		}
	}
	.carta:global(.ponchs-estelas) :global(.ponch-jaça .ponch),
	.carta:global(.ponchs-estelas) :global(.ponch-jaça .ponch-cueta),
	.carta :global(.ponch-sol-estela .ponch),
	.carta :global(.ponch-sol-estela .ponch-cueta) {
		animation: none;
	}
	.carta :global(.ponch-jaça:focus-visible .ponch-estela) {
		outline: 2px solid var(--t-aur-clar);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		.carta:global(.ponchs-estelas) :global(.ponch-estela::before),
		.carta :global(.ponch-sol-estela .ponch-estela::before),
		.carta:global(.ponchs-estelas:not(.luenh)) :global(.ponch-estela) {
			animation: none;
		}
		.carta :global(.leaflet-marker-pane .ponch-jaça > .ponch-estela) {
			transition-delay: 0ms;
		}
	}
	.carta:global(.luenh) :global(.leaflet-marker-pane > :not(.lenga-franca)) {
		pointer-events: none;
	}
	.carta:global(.luenh) :global(.leaflet-marker-pane > :not(.lenga-franca) > *) {
		opacity: 0;
	}
	/* las lengas d'outra mar demòran visiblas en s'aprochant de lor illa ; las
	   de França s'amagan sonque a l'escala del mond */
	.carta:global(.zoom-mond) :global(.lenga-franca:not(.outremer)) {
		display: none;
	}

	/* (taille en unités du dessin, 100 unités = 44 px : 26 unités ≈ 11 px) */
	.compass text {
		font-family: var(--font-quote);
		font-style: italic;
		font-weight: 500;
		font-size: 26px;
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
	/* lo satellit de nuèch : la fotografia s'escurcís e se rescalfa un pauc */
	.carta.nuech :global(.pan-satellit) {
		filter: brightness(0.72) contrast(1.06) saturate(0.85) sepia(0.18);
	}
	/* la revelacion de la carta detalhada : del flo al net, coma en sortent
	   dels nívols. Una transicion CSS que lo navegador mena sol (pas de calcul
	   a cada imatge) ; lo flo sonque pendent la revelacion */
	.carta:global(.revelant) :global(.leaflet-tile-pane) {
		filter: blur(5px);
		transition: filter var(--rev-dur, 2s) cubic-bezier(0.45, 0, 0.55, 1);
		will-change: filter;
	}
	.carta:global(.revelant.net) :global(.leaflet-tile-pane) {
		filter: blur(0px);
	}
	.carta.nuech:global(.revelant) :global(.leaflet-tile-pane) {
		filter: invert(1) hue-rotate(180deg) brightness(0.88) contrast(0.9) sepia(0.35) saturate(0.75) blur(5px);
	}
	.carta.nuech:global(.revelant.net) :global(.leaflet-tile-pane) {
		filter: invert(1) hue-rotate(180deg) brightness(0.88) contrast(0.9) sepia(0.35) saturate(0.75) blur(0px);
	}
	/* la meteissa revelacion pel satellit (son pròpri plan) */
	.carta:global(.revelant) :global(.pan-satellit) {
		filter: blur(5px);
		transition: filter var(--rev-dur, 2s) cubic-bezier(0.45, 0, 0.55, 1);
		will-change: filter;
	}
	.carta:global(.revelant.net) :global(.pan-satellit) {
		filter: blur(0px);
	}
	.carta.nuech:global(.revelant) :global(.pan-satellit) {
		filter: brightness(0.72) contrast(1.06) saturate(0.85) sepia(0.18) blur(5px);
	}
	.carta.nuech:global(.revelant.net) :global(.pan-satellit) {
		filter: brightness(0.72) contrast(1.06) saturate(0.85) sepia(0.18) blur(0px);
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
		-webkit-text-stroke: 3px rgba(247, 243, 238, 0.85);
		paint-order: stroke fill;
	}

	.carta :global(.oc-label-city) {
		font-size: 0.82rem;
	}

	/* (los noms de las comunas sul satellit : una tela, nomsComunas.js) ;
	   un nom se pòt causir : la man al survòl */
	.carta:global(.sus-nom) {
		cursor: pointer !important;
	}
	/* la comuna causida : son contorn se traça (0,9 s), lo fons arriba, puèi
	   lo contorn lusís doas vegadas (retorn de Romain, 2026-10-11 : pas un
	   pichon rond que lusís, mal acordat als noms longs) */
	.carta :global(.comuna-causida) {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation:
			comuna-traça 0.9s ease-out forwards,
			comuna-fons 0.6s ease 0.5s both,
			comuna-lusís 1.1s ease-in-out 0.9s 2;
	}
	@keyframes comuna-traça {
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes comuna-fons {
		from {
			fill-opacity: 0;
		}
	}
	@keyframes comuna-lusís {
		50% {
			filter: drop-shadow(0 0 6px rgba(243, 194, 90, 0.95));
			stroke-width: 3px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.carta :global(.comuna-causida) {
			animation: none;
			stroke-dashoffset: 0;
		}
	}

	.carta :global(.oc-label-town) {
		font-size: 0.68rem;
		font-weight: 600;
	}
</style>
