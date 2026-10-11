// Lo zoom doç, coma sus Google Maps (retorn de Romain, 2026-10-11 : « il faut
// que tu arrives au même système que sur google maps ») : la carta seguís la
// rodeta, lo pinçament del pavat tactil, los botons + e − e lo doble clic de
// contunh, imatge per imatge, sens los crans animats de Leaflet (0,25 s en CSS,
// puèi un recalatge). A cada imatge la carta es a son escala vertadièra : los
// noms se i plaçan (nomsComunas.js), las còlas s'espandisson coma pendent un
// pinçament al det.
//
// Mecanica : la meteissa que lo pinçament de Leaflet (TouchZoom) : _move a
// cada imatge (eveniments « zoom » e « move »), _moveEnd a la fin (« zoomend »,
// « moveend » : las còlas se tòrnan pintar un còp). Las tuèlas se tòrnan
// demandar a l'escala nòva tot pendent lo movement, mas pas a cada imatge.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function zoomDoç(L, map, { pxPerNivèl = 260, doçor = 0.2 } = {}) {
	const cont = map.getContainer();
	let cibla = null,
		últim = null,
		ancòra = null,
		raf = 0,
		tTuèlas = 0;
	const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	function començar() {
		if (cibla != null) return;
		// (_stop : arrèsta un vòl sens tornar plaçar la vista, coma stop() o fa)
		map._stop();
		cibla = map.getZoom();
		últim = cibla;
		map._moveStart(true, false);
	}
	function pas(t) {
		raf = 0;
		if (!map._loaded || cibla == null) return;
		// (un vòl o una vista causida endacòm mai prenon la man)
		const z = map.getZoom();
		if (map._flyToFrame || Math.abs(z - últim) > 1e-6) return void ((cibla = null), (ancòra = null));
		let nz = calm() ? cibla : z + (cibla - z) * doçor;
		if (Math.abs(cibla - nz) < 0.003) nz = cibla;
		// lo ponch jos la mirga (o lo centre) demòra al meteis endrech
		const mieg = map.getSize().divideBy(2),
			a = ancòra ?? mieg,
			k = map.getZoomScale(nz, z),
			centre = map.containerPointToLatLng(mieg.add(a.subtract(mieg).multiplyBy(1 - 1 / k)));
		map._move(centre, nz, { pinch: true, round: false });
		últim = nz;
		// las tuèlas de l'escala nòva, cada 250 ms (pas a cada imatge)
		if (t - tTuèlas > 250) {
			tTuèlas = t;
			map.eachLayer((l) => l instanceof L.GridLayer && l._map && l._setView(map.getCenter(), nz, true, false));
		}
		if (nz === cibla) {
			cibla = null;
			ancòra = null;
			map._moveEnd(true);
			return;
		}
		raf = requestAnimationFrame(pas);
	}
	function anar(z, punt) {
		començar();
		cibla = clamp(z, map.getMinZoom(), map.getMaxZoom());
		ancòra = punt ?? null;
		raf ||= requestAnimationFrame(pas);
	}

	// la rodeta e lo pavat tactil (lo pinçament i arriba coma una rodeta amb Ctrl)
	map.scrollWheelZoom.disable();
	cont.addEventListener(
		'wheel',
		(e) => {
			if (!map._loaded) return;
			e.preventDefault();
			let d = e.deltaY * (e.deltaMode === 1 ? 20 : e.deltaMode === 2 ? 400 : 1);
			if (e.ctrlKey) d *= 2.5; // (pinçament : de pichons passes)
			d = clamp(d, -240, 240);
			const base = cibla ?? map.getZoom();
			anar(base - d / pxPerNivèl, map.mouseEventToContainerPoint(e));
		},
		{ passive: false }
	);

	// los botons, lo clavièr e lo doble clic passan per aquí tanben
	const zoomOrig = map.setZoomAround.bind(map);
	map.setZoomAround = function (latlng, zoom, options) {
		if (options?.animate === false || calm()) return zoomOrig(latlng, zoom, options);
		const p = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng);
		anar(zoom, p);
		return this;
	};
	map.zoomIn = function (delta, options) {
		delta = delta || this.options.zoomDelta || 1;
		if (options?.animate === false) return this.setZoom(this._zoom + delta, options);
		anar((cibla ?? this._zoom) + delta);
		return this;
	};
	map.zoomOut = function (delta, options) {
		delta = delta || this.options.zoomDelta || 1;
		if (options?.animate === false) return this.setZoom(this._zoom - delta, options);
		anar((cibla ?? this._zoom) - delta);
		return this;
	};
	return { anar, enCors: () => cibla != null };
}
