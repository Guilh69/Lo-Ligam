// Los noms de las comunas sul satellit, coma sus Google Maps (retorn de
// Romain, 2026-10-11 : « il faut que tu arrives au même système que sur google
// maps ») : una tela sola, tornada pintar a cada imatge del movement (amb lo
// zoom doç, zoomDoc.js, la carta es a son escala vertadièra a cada imatge).
//   - A cada imatge, los noms se plaçan d'aprèp lor reng (vilas, puèi las
//     comunas mai pobladas), sens se tocar e sens tocar los noms de las autras
//     còlas (relèu, dialèctes) ;
//   - cada nom a son opacitat, que tira cap a 1 s'a sa plaça, cap a 0 se non
//     (fondut de 0,25 s) : en s'aprochant los noms arriban un a un, en se
//     recuolant se'n van un a un ; jamai de recalatge a la fin ;
//   - cada nom es pintat un còp dins una pichona imatge (letras e alo), puèi
//     recopiat : pas cap de tèxt a tornar compausar a cada imatge.
// Remplaça los marcadors DOM d'abans (un per nom, plaçats sonque a la fin del
// movement).

const DURADA = 0.25; // s
const MAX = 280; // noms al mai sus l'ecran
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function crearNomsComunas(
	L,
	map,
	{
		// la lista de las comunas, d'aprèp lor prioritat ({ lat, lon, renc, pop, … })
		lista = () => [],
		// l'estil d'un nom : { nom, font, esp, majus, px, w }
		estil,
		// los noms son visibles (lo fons, l'escala, la revelacion)
		actiu = () => true,
		// la populacion minimala a un zoom
		popMin = () => 0,
		// las bóstias dels noms de las autras còlas, en ponches del contenedor
		obstacles = () => [],
		// a la fin d'un movement : las bóstias de las vilas e de totes los noms
		onRepaus = null
	} = {}
) {
	if (!map.getPane('nomsComunas')) {
		const p = map.createPane('nomsComunas');
		// (jos las icònas dels luòcs, 600, e las bullas)
		p.style.zIndex = '590';
		p.style.pointerEvents = 'none';
	}
	const cv = L.DomUtil.create('canvas', 'noms-comunas', map.getPane('nomsComunas'));
	const cx = cv.getContext('2d');
	const estats = new Map(); // comuna → { a, cibla, x, y, w, h }
	const imatges = new WeakMap(); // comuna → tela del nom
	let raf = 0,
		tPrec = 0,
		bougant = false,
		pus = null,
		dpr = 1,
		ordenada = null,
		listaFont = null;

	// lo nom en imatge : letras claras e alo sorne (coma lo text-shadow d'abans)
	function imatge(c) {
		let im = imatges.get(c);
		if (im && im.dpr === dpr) return im;
		const e = estil(c),
			marge = 10,
			w = Math.ceil(e.w + 2 * marge),
			h = Math.ceil(e.px * 1.5 + 2 * marge),
			t = document.createElement('canvas');
		t.width = Math.ceil(w * dpr);
		t.height = Math.ceil(h * dpr);
		const g = t.getContext('2d');
		g.scale(dpr, dpr);
		g.font = e.font;
		if ('letterSpacing' in g) g.letterSpacing = e.esp.toFixed(2) + 'px';
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		const tx = e.majus ? e.nom.toUpperCase() : e.nom;
		g.fillStyle = '#f5ead8';
		g.shadowColor = 'rgba(18, 9, 6, 0.75)';
		g.shadowBlur = 8 * dpr;
		g.fillText(tx, w / 2, h / 2);
		g.shadowColor = 'rgba(18, 9, 6, 0.95)';
		g.shadowBlur = 3 * dpr;
		g.fillText(tx, w / 2, h / 2);
		g.shadowColor = 'transparent';
		g.fillText(tx, w / 2, h / 2);
		im = { t, w, h, bw: e.w + 6, bh: e.px * 1.24, dpr };
		imatges.set(c, im);
		return im;
	}

	const tòca = (b, lista) => {
		for (const o of lista) if (b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) return true;
		return false;
	};

	// Plaçar los noms a l'escala d'ara : las vilas d'en primièr, puèi los
	// autres, que evitan tanben los noms de las autras còlas
	function plaçar() {
		const z = map.getZoom(),
			size = map.getSize(),
			on = actiu();
		const vist = new Set(),
			pausats = [],
			vilas = [];
		if (on) {
			const l = lista();
			if (l !== listaFont) {
				listaFont = l;
				ordenada = [...l].sort((a, b) => a.renc - b.renc || b.pop - a.pop);
			}
			const pm = popMin(z),
				obst = obstacles(z),
				b = map.getBounds().pad(0.15),
				s = b.getSouth(),
				n = b.getNorth(),
				w = b.getWest(),
				e = b.getEast();
			for (const c of ordenada) {
				if (pausats.length >= MAX) break;
				if (!(c.renc <= 3 || c.pop >= pm) || c.lat < s || c.lat > n || c.lon < w || c.lon > e) continue;
				const im = imatge(c),
					q = map.latLngToContainerPoint([c.lat, c.lon]);
				const bx = [q.x - im.bw / 2, q.y - im.bh / 2, q.x + im.bw / 2, q.y + im.bh / 2];
				if (bx[2] < -50 || bx[0] > size.x + 50 || bx[3] < -30 || bx[1] > size.y + 30) continue;
				// (un pauc d'aire a l'entorn dels noms de las autras còlas)
				const ok = !tòca(bx, pausats) && (c.renc <= 3 || !tòca([bx[0] - 4, bx[1] - 3, bx[2] + 4, bx[3] + 3], obst));
				let st = estats.get(c);
				if (!ok && !st) continue;
				st ??= { a: 0 };
				estats.set(c, st);
				st.x = q.x;
				st.y = q.y;
				st.cibla = ok ? 1 : 0;
				st.bx = bx;
				vist.add(c);
				if (ok) {
					pausats.push(bx);
					if (c.renc <= 3) vilas.push(bx);
				}
			}
		}
		// los noms que son pas pus dins la vista o dins la lista se'n van
		for (const [c, st] of estats)
			if (!vist.has(c)) {
				st.cibla = 0;
				const q = map.latLngToContainerPoint([c.lat, c.lon]);
				st.x = q.x;
				st.y = q.y;
			}
		return { pausats, vilas };
	}

	function pintar(t) {
		const dt = tPrec ? Math.min(0.1, (t - tPrec) / 1000) : 0;
		tPrec = t;
		const size = map.getSize();
		dpr = Math.min(devicePixelRatio || 1, 2);
		// la tela demòra fixa sus l'ecran (dins un pan que se desplaça amb la carta)
		L.DomUtil.setPosition(cv, map.containerPointToLayerPoint([0, 0]));
		const W = Math.round(size.x * dpr),
			H = Math.round(size.y * dpr);
		if (cv.width !== W || cv.height !== H) {
			cv.width = W;
			cv.height = H;
			cv.style.width = size.x + 'px';
			cv.style.height = size.y + 'px';
		} else cx.clearRect(0, 0, W, H);
		const r = plaçar();
		let anima = false;
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		cx.setTransform(dpr, 0, 0, dpr, 0, 0);
		for (const [c, st] of estats) {
			// lo luòc survolat : son nom en aur lo remplaça ; los que recobrís s'escantisson
			let cibla = st.cibla,
				k = 1;
			if (pus && cibla) {
				if (Math.hypot(st.x - pus.x, st.y - pus.y) < 14) cibla = 0;
				else if (st.bx && st.bx[0] < pus.caixa[2] && st.bx[2] > pus.caixa[0] && st.bx[1] < pus.caixa[3] && st.bx[3] > pus.caixa[1]) k = 0.15;
			}
			st.a = calm ? cibla : clamp(st.a + Math.sign(cibla - st.a) * (dt / DURADA), Math.min(st.a, cibla), Math.max(st.a, cibla));
			if (st.a !== cibla) anima = true;
			if (st.a <= 0.001 && !st.cibla) {
				estats.delete(c);
				continue;
			}
			const im = imatge(c);
			cx.globalAlpha = st.a * k;
			cx.drawImage(im.t, st.x - im.w / 2, st.y - im.h / 2, im.w, im.h);
		}
		cx.globalAlpha = 1;
		return { anima, r };
	}

	function bocla(t) {
		raf = 0;
		const { anima, r } = pintar(t);
		if (bougant || anima) raf = requestAnimationFrame(bocla);
		else tPrec = 0;
		return r;
	}
	const lançar = () => (raf ||= requestAnimationFrame(bocla));

	map.on('zoomstart movestart', () => {
		bougant = true;
		lançar();
	});
	map.on('zoom move', lançar);
	map.on('moveend', () => {
		bougant = false;
		// a la pausa : las bóstias de las vilas per las autras còlas (que i
		// tòrnan plaçar lors noms), puèi un imatge amb lors noms nòus
		cancelAnimationFrame(raf);
		raf = 0;
		const r = bocla(performance.now());
		onRepaus?.(r);
		lançar();
	});
	map.on('resize', lançar);

	return {
		tornarPintar: lançar,
		// lo luòc survolat ({ x, y, caixa } en ponches del contenedor) o null
		pus(p) {
			pus = p;
			lançar();
		},
		// las bóstias dels noms afichats (per las icònas)
		caixas: () => [...estats.values()].filter((s) => s.cibla && s.bx).map((s) => s.bx)
	};
}
