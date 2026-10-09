<script>
	import { onMount, onDestroy } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { crearColaEstelas, Z_PRECARGA, Z_RELAIS, nivèlsDezoom, aDetalh, estilVila, rencVila } from '$lib/carta/colaEstelas.js';
	import { sonsEntrada } from '$lib/carta/sons.js';
	import { crearColaDonadas } from '$lib/carta/colaDonadas.js';
	import { crearColaTematica } from '$lib/carta/colaTematica.js';
	import { crearColaLenga } from '$lib/carta/colaLenga.js';
	import { LENGAS, esOccitan, fonsLenga } from '$lib/carta/lengas.js';
	import { JACES_DONADAS, JACES_TEMATICAS, JACES_LENGAS } from '$lib/carta/catalogue.js';
	import { ICONAS } from '$lib/carta/iconas.js';
	import { degatjar, zonaEtiqueta, zonaCaixa, placeVisible, DEFAUT } from '$lib/carta/degatjament.js';
	import { NOMS_FRANCES } from '$lib/carta/nomsFrances.js';
	import { LUOCS } from '$lib/acuelh/carta-estelas.js';
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
	// La mar al larg : a partir d'un cèrt zoom, l'IGN tòrna una tuèla blanca,
	// puèi pus res. A un zoom mai bas, la mar i es blava : la tuèla se
	// remplaça per son tròç de la tuèla d'un zoom mai bas, agrandit, se i a
	// pas de blanc (sus la tèrra d'Espanha, lo PNOA dejós demòra vesedor).
	let cxBlanc = null;
	// (blanc o quasi : la compression grisa las bendas finas, 235 a 250)
	const blanc = (d, k) => d[k] >= 235 && d[k + 1] >= 235 && d[k + 2] >= 235;
	// Lo blanc (lo « res » de l'IGN) d'un tròç d'imatge, a sa resolucion :
	// la pus longa seguida de blanc sus un bòrd (lo « res » es un grand
	// rectangle : dins una tuèla, tòca totjorn un bòrd ; un teulat blanc,
	// rarament), puèi, se cal, sa part. De bendas de 2 ponches i passan pas.
	function blancor(img, sx, sy, sw, sh, totjorn = false) {
		const g = (cxBlanc ??= Object.assign(document.createElement('canvas'), { width: 256, height: 256 }).getContext('2d', { willReadFrequently: true }));
		const w = Math.round(sw),
			h = Math.round(sh);
		try {
			g.clearRect(0, 0, w, h);
			g.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
			const seguida = (d) => {
				let r = 0,
					m = 0;
				for (let k = 0; k < d.length; k += 4) m = Math.max(m, (r = blanc(d, k) ? r + 1 : 0));
				return m;
			};
			// (los 3 ponches de cada bòrd : una benda pòt arribar a un ponch del bòrd)
			const linhas = [0, 1, 2].flatMap((o) => [[0, o, w, 1], [0, h - 1 - o, w, 1], [o, 0, 1, h], [w - 1 - o, 0, 1, h]]);
			const bòrd = Math.max(...linhas.map((r) => seguida(g.getImageData(...r).data)));
			if (!bòrd && !totjorn) return { bòrd, part: 0 };
			const d = g.getImageData(0, 0, w, h).data;
			let n = 0;
			for (let k = 0; k < d.length; k += 4) if (blanc(d, k)) n++;
			return { bòrd, part: n / (w * h) };
		} catch {
			return { bòrd: 0, part: 0 };
		}
	}
	// 16 × 16 ponches d'un imatge (sens lissatge)
	function mostras(img) {
		const g = (cxBlanc ??= Object.assign(document.createElement('canvas'), { width: 256, height: 256 }).getContext('2d', { willReadFrequently: true }));
		g.clearRect(0, 0, 16, 16);
		g.imageSmoothingEnabled = false;
		g.drawImage(img, 0, 0, 256, 256, 0, 0, 16, 16);
		g.imageSmoothingEnabled = true;
		return g.getImageData(0, 0, 16, 16).data;
	}
	// La fòto de dejós mòstra quicòm jos lo blanc de la tuèla de dessús ?
	// Un fons sens fòto es uniform (lo PNOA met un escur sus la mar de França) :
	// pas mai de 12 de diferéncia de luminositat suls ponches jos lo blanc
	function mostraQuicòm(dessús, dejós) {
		try {
			// (sens tuèla de dessús, un 404 : totes los ponches)
			const a = dessús && mostras(dessús),
				b = mostras(dejós);
			let min = 255,
				max = 0,
				n = 0;
			for (let k = 0; k < b.length; k += 4) {
				if (a && !blanc(a, k)) continue;
				const l = (b[k] + b[k + 1] + b[k + 2]) / 3;
				if (l < min) min = l;
				if (l > max) max = l;
				n++;
			}
			return n > 0 && max - min > 12;
		} catch {
			return false;
		}
	}
	const imatgesAvis = new Map();
	const cargarImatge = (url) => {
		if (imatgesAvis.size > 200) imatgesAvis.clear();
		if (!imatgesAvis.has(url))
			imatgesAvis.set(
				url,
				new Promise((res) => {
					const i = new Image();
					i.crossOrigin = 'anonymous';
					i.onload = () => res(i);
					i.onerror = () => res(null);
					i.src = url;
				})
			);
		return imatgesAvis.get(url);
	};
	// Rend transparent (dins los ponches d'una tuèla de 256) lo blanc que se
	// tòca amb lo « res » del bòrd (una plaja, un teulat blanc demòran),
	// alargat de 2 ponches : lo bòrd de la fòto, gastat per la compression,
	// fasiá una lisieira clara
	function escafarBlanc(d) {
		const clar = new Uint8Array(65536),
			b = new Uint8Array(65536),
			h = new Uint8Array(65536);
		for (let q = 0; q < 65536; q++) clar[q] = Math.min(d[q * 4], d[q * 4 + 1], d[q * 4 + 2]) > 220 ? 1 : 0;
		// (partença : las seguidas de 12 ponches clars o mai sus las 3 linhas de cada bòrd)
		const pila = [];
		for (const [q0, pas] of [0, 1, 2].flatMap((o) => [[o * 256, 1], [65280 - o * 256, 1], [o, 256], [255 - o, 256]]))
			for (let k = 0, r = 0; k <= 256; k++) {
				if (k < 256 && clar[q0 + k * pas]) r++;
				else {
					if (r >= 12) for (let j = k - r; j < k; j++) pila.push(q0 + j * pas);
					r = 0;
				}
			}
		while (pila.length) {
			const q = pila.pop();
			if (!clar[q] || b[q]) continue;
			b[q] = 1;
			const x0 = q & 255;
			if (x0 > 0) pila.push(q - 1);
			if (x0 < 255) pila.push(q + 1);
			if (q >= 256) pila.push(q - 256);
			if (q < 65280) pila.push(q + 256);
		}
		for (let q = 0; q < 65536; q++) {
			const x0 = q & 255;
			h[q] = b[q] | (x0 > 0 && b[q - 1]) | (x0 > 1 && b[q - 2]) | (x0 < 255 && b[q + 1]) | (x0 < 254 && b[q + 2]);
		}
		for (let q = 0; q < 65536; q++) if (h[q] | h[q - 256] | h[q - 512] | h[q + 256] | h[q + 512]) d[q * 4 + 3] = 0;
	}
	// Una tuèla a mitat blanca (la limita de las fòtos la traversa) : la tuèla
	// d'un zoom mai bas passa dejós, e sonque lo blanc ven transparent
	async function tuèlaAvi(url, tile, { x, y, z }, partiala = false, dejós = false) {
		tile._avi = true;
		// una autra fòto dejós (lo PNOA en Aran e en Catalonha) : lo blanc ven
		// transparent, sens la tuèla d'avant (l'IGN agrandit, mai flo)
		if (dejós) {
			if (!partiala) return void (tile.style.visibility = 'hidden');
			const t = Object.assign(document.createElement('canvas'), { width: 256, height: 256 }).getContext('2d', { willReadFrequently: true });
			t.drawImage(tile, 0, 0, 256, 256);
			const id = t.getImageData(0, 0, 256, 256);
			escafarBlanc(id.data);
			t.putImageData(id, 0, 0);
			tile.src = t.canvas.toDataURL('image/png');
			return;
		}
		// (d'en primièr lo zoom 12, lo mai naut ont la mar es tota blava : un
		// sol blau per totas las tuèlas, e de tuèlas partejadas)
		for (let dz = Math.max(1, z - 12); dz <= Math.max(1, z - 12) + 4 && z - dz >= 6; dz++) {
			const k = 2 ** dz,
				ax = Math.floor(x / k),
				ay = Math.floor(y / k);
			const img = await cargarImatge(L.Util.template(url, { x: ax, y: ay, z: z - dz }));
			if (!tile.isConnected) return;
			const s = 256 / k,
				sx = (x - ax * k) * s,
				sy = (y - ay * k) * s;
			// (lo tròç de la tuèla d'avant deu èsser sens cap de blanc)
			if (!img) continue;
			const bl = blancor(img, sx, sy, s, s, true);
			if (bl.bòrd >= 3 || bl.part > 0.002) continue;
			const cv = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
			const g = cv.getContext('2d');
			g.drawImage(img, sx, sy, s, s, 0, 0, 256, 256);
			if (partiala) {
				const t = Object.assign(document.createElement('canvas'), { width: 256, height: 256 }).getContext('2d', { willReadFrequently: true });
				t.drawImage(tile, 0, 0, 256, 256);
				const id = t.getImageData(0, 0, 256, 256);
				escafarBlanc(id.data);
				t.putImageData(id, 0, 0);
				g.drawImage(t.canvas, 0, 0);
			}
			tile.src = cv.toDataURL('image/jpeg', 0.85);
			return;
		}
		// pas res de segur : un 404 fa un trauc (lo fons, o lo PNOA dejós) ;
		// una tuèla blanca demòra (la nèu, que se pòt confondre)
		if (tile._fin) tile.style.visibility = 'hidden';
	}
	function crearSatellit(opts = {}) {
		// son pròpri plan, defòra del filtre « de nuèch » de las tuèlas OSM (que
		// las inversa) : una fotografia s'escurcís sens s'inversar
		if (!map.getPane('satellit')) {
			const p = map.createPane('satellit');
			// (jos los nívols de la revelacion, 250, coma las tuèlas OSM)
			p.style.zIndex = 210;
			p.classList.add('pan-satellit');
		}
		// (crossOrigin : los dos servidors o permeton, per poder legir la color d'una tuèla)
		const cs = SATELLIT.map(({ url, bounds, attribution }) => L.tileLayer(url, { maxZoom: 19, bounds, attribution, pane: 'satellit', crossOrigin: 'anonymous', ...opts }));
		// lo servidor de l'IGN refusa una part de las demandas quand ne recep
		// fòrça d'un còp (un grand ecran, un zoom) : una tuèla mancada se
		// torna demandar, de mai en mai tard, puslèu que de daissar un trauc
		// (una adreça un pauc cambiada : lo navegador gardava l'error en
		// memòria e tornava pas demandar). Un 404 es definitiu (la mar al
		// larg) : la tuèla d'un zoom mai bas pren lo relais.
		cs.forEach((c, i) => {
			// una autra fòto dejós aqueste tuèla, que mòstra quicòm (lo PNOA en
			// Aran e en Catalonha ; sus la mar de França, met un fons escur uniform) ?
			const dejós = async (coords, tile) => {
				const ll = map.unproject([(coords.x + 0.5) * 256, (coords.y + 0.5) * 256], coords.z);
				for (let j = i - 1; j >= 0; j--) {
					if (!L.latLngBounds(SATELLIT[j].bounds).contains(ll)) continue;
					const t = cs[j]._tiles?.[cs[j]._tileCoordsToKey(coords)];
					if (!t) continue;
					if (!t.loaded)
						await new Promise((res) => {
							t.el.addEventListener('load', res, { once: true });
							t.el.addEventListener('error', res, { once: true });
							setTimeout(res, 5000);
						});
					if (t.el.complete && t.el.naturalWidth && mostraQuicòm(tile, t.el)) return true;
				}
				return false;
			};
			c.on('tileerror', ({ tile, coords }) => {
				if (tile._avi) return;
				const n = (tile._essais = (tile._essais ?? 0) + 1);
				// (aprèp un segond fracàs : un servidor saturat respond a la segonda)
				if (n === 2)
					fetch(c.getTileUrl(coords))
						.then((r) => {
							if (r.status !== 404) return;
							tile._fin = true;
							// (una autra fòto dejós : lo trauc li daissa la plaça)
							dejós(coords).then((d) => tuèlaAvi(SATELLIT[i].url, tile, coords, false, d));
						})
						.catch(() => {});
				if (n > 4) return;
				setTimeout(() => tile.isConnected && !tile._fin && !tile._avi && (tile.src = c.getTileUrl(coords) + '&essai=' + n), 300 * 2 ** n + Math.random() * 400);
			});
			// la mar al larg, de prèp : una tuèla tota blanca (retorn de Romain,
			// « garder le bleu ») se remplaça tanben
			c.on('tileload', ({ tile, coords }) => {
				if (tile._avi) return;
				const b = blancor(tile, 0, 0, 256, 256);
				if (b.bòrd < 12) return;
				tile._avi = true;
				dejós(coords, tile).then((d) => tuèlaAvi(SATELLIT[i].url, tile, coords, b.part < 0.98, d));
			});
		});
		const g = L.layerGroup(cs);
		g.setOpacity = (o) => (cs.forEach((c) => c.setOpacity(o)), g);
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
		// lo dialècte causit (còdi, 'cro' pel Creissent, o null) : de la carta al
		// panèl e del panèl a la carta
		causits = $bindable([]),
		// lo mòde visualizacion (plen ecran) : la pagina lo gerís, lo boton es
		// sus la carta
		visualizacion = false,
		onVisualizacion = null
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
					cedir: (lp) => !!(colaDonadas && map.hasLayer(colaDonadas) && colaDonadas.enclavaA(lp)) || !!colaTematica?.ocupat(lp) || zonaLengaA(lp)
				});
				for (const id of JACES_LENGAS) colaEstelas.setLengaFons(id, visibility[id] ? (fonsLengas[id] ?? null) : null);
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
	// Fons « estelas » : en s'aprochant (vèrs 20 km, Z_RELAIS), lo plan
	// estelat cedís la plaça al satellit, sens passar per la carta OSM
	// (demanda de Romain, 2026-10-09) ; nòstres noms occitans passan al
	// dessús. En dejós del lindal, cap de tuèla es pas demandada (sobrietat).
	function majDetalh() {
		if (!map || baseLayer !== 'estelas') return;
		const z = map.getZoom();
		if (z >= Z_PRECARGA) {
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
		pointLayers.calandretas = L.layerGroup(
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
			})
		);
		if (d.font) map.attributionControl?.addAttribution(d.font);
		if (visibility.calandretas) pointLayers.calandretas.addTo(map);
	}

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
	let capaNoms = null;
	const nomsAfichats = new Map();
	let bóstiasNoms = [];
	const popNoms = (z) => (z >= 12.5 ? 0 : z >= 11.5 ? 100 : z >= 10.5 ? 500 : z >= 9.5 ? 2000 : 8000);
	// La polissa d'un nom segon lo reng de la vila, coma sus la carta estelada
	// (estil « Atlas », 2026-10-08) : Limelight per las metropòlis, capitalas
	// espaçadas per las vilas repèrs, italica per las autras. Las comunas fòra
	// la tièra son de vilatges ; lor talha seguís lor populacion.
	// (l'italica a de delhats fins : un pauc mai granda que sus las estelas)
	const talhaNom = (renc, pop) => ({ 1: 18, 2: 13, 3: 12.5 })[renc] ?? (pop >= 20000 ? 12 : pop >= 3000 ? 11.5 : 11);
	let cxMesura = null;
	function estilNom(c) {
		const e = estilVila(c.renc, talhaNom(c.renc, c.pop));
		const nom = c.oc || c.fr;
		const g = (cxMesura ??= document.createElement('canvas').getContext('2d'));
		g.font = e.font;
		if ('letterSpacing' in g) g.letterSpacing = e.esp.toFixed(2) + 'px';
		const px = parseFloat(e.font.match(/([\d.]+)px/)[1]);
		return {
			nom,
			px,
			w: g.measureText(e.majus ? nom.toUpperCase() : nom).width,
			css: `font:${e.font.replace(/"/g, "'")};letter-spacing:${e.esp.toFixed(2)}px${e.majus ? ';text-transform:uppercase' : ''}`
		};
	}
	function majNomsComunas() {
		if (!map) return;
		if (baseLayer !== 'estelas' || map.getZoom() < Z_RELAIS) {
			if (capaNoms) map.removeLayer(capaNoms);
			capaNoms = null;
			nomsAfichats.clear();
			bóstiasNoms = [];
			return;
		}
		if (!nomsComunas?.length) return void cargarNomsComunas();
		capaNoms ??= L.layerGroup().addTo(map);
		const z = map.getZoom();
		const b = map.getBounds().pad(0.1);
		const s = b.getSouth(), n = b.getNorth(), w = b.getWest(), e = b.getEast();
		const pm = popNoms(z);
		// (las vilas de la tièra se mòstran totjorn, coma sus la carta estelada)
		const cands = nomsComunas.filter((c) => (c.renc <= 3 || c.pop >= pm) && c.lat > s && c.lat < n && c.lon > w && c.lon < e);
		cands.sort((a, c) => a.renc - c.renc || c.pop - a.pop);
		const vòl = new Set();
		bóstiasNoms = [];
		for (const c of cands) {
			if (bóstiasNoms.length >= 260) break;
			const st = (c.estil ??= estilNom(c));
			const q = map.latLngToContainerPoint([c.lat, c.lon]);
			const wd = st.w + 6;
			const bx = [q.x - wd / 2, q.y - st.px * 0.62, q.x + wd / 2, q.y + st.px * 0.62];
			if (bóstiasNoms.some((o) => bx[0] < o[2] && bx[2] > o[0] && bx[1] < o[3] && bx[3] > o[1])) continue;
			bóstiasNoms.push(bx);
			const k = c.fr + c.dep;
			vòl.add(k);
			if (!nomsAfichats.has(k)) {
				const m = L.marker([c.lat, c.lon], {
					icon: L.divIcon({ className: 'nom-comuna', html: `<span style="${st.css}">${escapeHtml(st.nom)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }),
					interactive: false,
					keyboard: false
				});
				capaNoms.addLayer(m);
				nomsAfichats.set(k, m);
			}
		}
		for (const [k, m] of nomsAfichats)
			if (!vòl.has(k)) {
				capaNoms.removeLayer(m);
				nomsAfichats.delete(k);
			}
	}

	// de luènh, los ponches son d'estelas (la carta d'estelas de l'entrada) ;
	// l'icòna espelís en s'aprochant (causida de Romain, 2026-10-09)
	const Z_ICONAS = 10;
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
		if (map.getZoom() < Z_ICONAS) {
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
			ocupat: (lp) => !!(colaEstelas && map.hasLayer(colaEstelas) && colaEstelas.ocupat(lp)) || !!colaTematica?.ocupat(lp, true) || zonaLengaA(lp),
			// los noms de vilas : los noms de dialèctes los evitan
			obstacles: () => (colaEstelas && map.hasLayer(colaEstelas) ? colaEstelas.caixasNoms() : null),
			onSurvòl: (k, info) => (survòl = info),
			onCausida: (kods, info) => {
				causida = info;
				// (las zònas causidas de las autras lengas demòran)
				causits = [...kods, ...causits.filter((k) => !esOccitan(k))];
			}
		});
		colaDonadas.addTo(map);
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
					!!(colaEstelas && map.hasLayer(colaEstelas) && colaEstelas.ocupat(lp)) ||
					!!colaTematica?.ocupat(lp, true) ||
					!!colaDonadas.zonaA(lp) ||
					zonaLengaA(lp, id),
				obstacles: () => [
					colaEstelas && map.hasLayer(colaEstelas) ? colaEstelas.caixasNoms() : null,
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
					colaEstelas?.setLengaFons(id, visibility[id] ? fonsLengas[id] : null);
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
			obstacles: () => [colaEstelas && map.hasLayer(colaEstelas) ? colaEstelas.caixasNoms() : null, colaDonadas.caixasNoms(), ...Object.values(colasLengas).map((c) => c.caixasNoms())],
			onSurvòl: (info) => (survòlTem = info)
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
		map.on('movestart', () => (tMov = performance.now()));
		map.on('dblclick', (e) => {
			if (tMov >= tClic && tMov - tClic < 600) return;
			const lp = e.layerPoint,
				v = (c) => c && map.hasLayer(c);
			const cad =
				(v(colaEstelas) && colaEstelas.ponchA(lp)) ||
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
		if (import.meta.env.DEV) window.__carta = { map, colaDonadas, colasLengas, get colaCatalan() { return colasLengas.catalan; }, get colaEstelas() { return colaEstelas; }, get colaTematica() { return colaTematica; } };
		map.on('moveend', majNomsComunas);
		map.on('moveend layeradd layerremove', programarDegatjament);
		map.on('zoomend', applyToponymVisibility);
		map.on('zoomend', majDetalh);
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
		const estelas = () => mapEl?.classList.toggle('ponchs-estelas', map.getZoom() < Z_ICONAS);
		map.on('zoomend', estelas);
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
		for (const id of [...JACES_DONADAS, ...JACES_LENGAS]) delete geoDefs[id];

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
					// son site (colomna ligam, se la basa l'a) e lo ligam de navigacion
					const accions = [
						/^https:\/\//.test(lieu.ligam ?? '') ? accionBulla('world', lieu.ligam, txAccions().site, true) : '',
						accionsNav(lieu.latitud, lieu.longitud, nom)
					].join('');
					return dobleClicSus(L.marker([lieu.latitud, lieu.longitud], { icon: iconaPunt(cid), title: nom, keyboard: true })).bindPopup(
						`<strong>${escapeHtml(nom)}</strong>${desc ? `<br>${escapeHtml(desc)}` : ''}${accions ? `<span class="accions-bulla">${accions}</span>` : ''}`
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
		for (const [id, c] of Object.entries(colasLengas)) {
			c.setActiu(!!vis[id]);
			colaEstelas?.setLengaFons(id, vis[id] ? (fonsLengas[id] ?? null) : null);
		}
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
		for (const cl of Object.values(colasLengas)) cl.setTema(c, d);
		colaTematica?.setTema(c);
	});
	$effect(() => {
		const l = lang;
		colaEstelas?.setLenga(l);
		colaDonadas?.setLenga(l);
		for (const cl of Object.values(colasLengas)) cl.setLenga(l);
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
		colaDonadas?.causir(kods.filter(esOccitan));
		for (const cl of Object.values(colasLengas)) cl.causir(kods);
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

<div class="carta-root" class:visualizacion>
	<div
		class="carta"
		class:muted={baseLayer === 'occitan' && clar}
		class:nuech={(baseLayer === 'occitan' || baseLayer === 'estelas') && !clar}
		bind:this={mapEl}
	></div>

	{#if !visualizacion}<CercaCarta {lang} onCausir={anarA} />{/if}

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
	{#if legendaDial}
		<div class="legenda-dial" class:fixada={!!(causida ?? causidaLenga)} aria-live="polite">
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

	.carta :global(.plen-ecran a) {
		display: flex;
		align-items: center;
		justify-content: center;
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
	.carta :global(.ponch-usatgièr) {
		stroke: var(--t-fons);
		fill: var(--t-aur-clar);
	}
	.carta :global(.leaflet-popup-content .distancia) {
		color: var(--t-aur-clar);
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
	.carta :global(.ponch-jaça:focus-visible .ponch-estela) {
		outline: 2px solid var(--t-aur-clar);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		.carta:global(.ponchs-estelas) :global(.ponch-estela::before),
		.carta :global(.ponch-sol-estela .ponch-estela::before) {
			animation: none;
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
		-webkit-text-stroke: 3px rgba(245, 234, 216, 0.85);
		paint-order: stroke fill;
	}

	.carta :global(.oc-label-city) {
		font-size: 0.82rem;
	}

	/* los noms de las comunas sul satellit : la letra de la carta estelada
	   (polissa segon lo reng, en linha), amb un alo doç ; arriban aprèp las estelas */
	.carta :global(.nom-comuna span) {
		position: absolute;
		transform: translate(-50%, -50%);
		white-space: nowrap;
		pointer-events: none;
		/* letra clara e alo sorne amb los dos tèmas : lo fons es la fòto, pas
		   lo tèma (en sorne sus clar, l'italica fina dels vilatges s'i perdiá) */
		color: #f5ead8;
		text-shadow:
			0 0 3px rgba(18, 9, 6, 0.95),
			0 0 8px rgba(18, 9, 6, 0.75);
		animation: nom-ven 0.9s ease 0.35s backwards;
	}
	/* coma los noms de las tuèlas d'abans : pendent la revelacion (los nívols
	   que se dissipan), cap de nom ; arriban un còp la tèrra descobèrta, e se
	   n'anan tre que l'on se recula (jamai dos jòcs de noms ensems) */
	.carta :global(.nom-comuna) {
		transition: opacity 0.8s ease 0.15s;
	}
	.carta:global(.revelant) :global(.nom-comuna) {
		opacity: 0;
		transition: opacity 0.25s ease;
	}
	@keyframes nom-ven {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.carta :global(.nom-comuna span) {
			animation: none;
		}
	}

	.carta :global(.oc-label-town) {
		font-size: 0.68rem;
		font-weight: 600;
	}
</style>
