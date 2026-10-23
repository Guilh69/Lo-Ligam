// La tela dels ponches (decision de Romain, 2026-10-23 : « la carte fluide au
// maximum » ; « un joli vague qui déferle sur le système, qui s'illumine…
// avec un cercle lumineux »). De luènh, las estelas de totas las jaces de
// ponches son pintadas sus una sola tela (abans : dos mila objèctes de nòu
// elements cadun dins la pagina) ; de prèp, sonque los ponches de la vista
// venon de pastilhas. Quand una jaça s'aluca, los ponches s'alucan l'un après
// l'autre, coma una onda que partís d'un ponch e se difusa sus tota
// l'Occitània (retorn de Romain : pas de cercle, « les points s'illuminent
// comme une vague les uns après les autres ») ; un pauc d'azard dins lo
// moment de cadun fa viure la difusion. L'escantiment seguís la meteissa onda.

import { DURADA as DURADA_CONTORNS } from './aparicion.js';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// lo temps que l'onda met per traversar la vista (s), l'azard de cada ponch
// (s), e la durada de son aluc (s)
// (una sola relòtge per las aparicions : l'onda dels ponches a lo tempo dels
// contorns que se tracan, aparicion.js ; audit del 2026-10-23)
const DURADA = DURADA_CONTORNS,
	AZARD = 0.4,
	ALUC = 0.8,
	// lo fondut entre estelas (de luènh) e pastilhas (de prèp)
	FONDUT = 0.35;
// un azard estable per ponch (lo meteis a cada onda)
const azard = (n) => {
	const x = Math.sin(n * 12.9898) * 43758.5453;
	return x - Math.floor(x);
};

// la mena d'un ponch, legida sus son icòna (ponch-plen, ponch-vuèg, ponch-pichon)
function mena(m) {
	const c = m.options.icon?.options?.className ?? '';
	return c.includes('ponch-pichon') ? 'pichon' : c.includes('ponch-vuèg') ? 'vuèg' : c.includes('ponch-plen') ? 'plen' : '';
}

export function crearPonchs(L, { zIconas, onClic, onDobleClic, onCanvi }) {
	const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	// --- la tela ---
	const Tela = L.Layer.extend({
		options: { pane: 'ponchs', padding: 0.3 },

		initialize() {
			this._grops = new Set();
			this._sprites = new Map();
		},

		onAdd(map) {
			if (!map.getPane('ponchs')) {
				// jos los noms de vilas (estelas, 350) e de comunas (590) : los noms
				// demòran legibles (retorn de Romain, 2026-10-23)
				const p = map.createPane('ponchs');
				p.style.zIndex = '349';
				p.style.pointerEvents = 'none';
			}
			this._cv = L.DomUtil.create('canvas', 'cola-ponchs leaflet-zoom-animated', this.getPane());
			this._cx = this._cv.getContext('2d');
			// los clics e lo survòl : escotats abans Leaflet (captura), per que
			// una estela tocada dobrisca sa bulla sens dobrir la ficha de la comuna
			const c = map.getContainer();
			this._clic = (e) => this._onClic(e, onClic);
			this._dclic = (e) => this._onClic(e, onDobleClic);
			this._mirga = (e) => this._onMirga(e);
			c.addEventListener('click', this._clic, true);
			c.addEventListener('dblclick', this._dclic, true);
			c.addEventListener('mousemove', this._mirga, { passive: true });
			this._update();
		},
		onRemove(map) {
			cancelAnimationFrame(this._raf);
			const c = map.getContainer();
			c.removeEventListener('click', this._clic, true);
			c.removeEventListener('dblclick', this._dclic, true);
			c.removeEventListener('mousemove', this._mirga);
			L.DomUtil.remove(this._cv);
		},
		getEvents() {
			const ev = { viewreset: this._update, zoom: this._onZoom, moveend: this._update, resize: this._update };
			if (this._zoomAnimated) ev.zoomanim = this._onAnimZoom;
			return ev;
		},
		_onAnimZoom(ev) {
			this._transform(ev.center, ev.zoom);
		},
		_onZoom() {
			this._transform(this._map.getCenter(), this._map.getZoom());
		},
		// (coma los rendèires de Leaflet : la tela s'agrandís pendent lo zoom)
		_transform(centre, zoom) {
			if (!this._centre) return;
			const map = this._map;
			const s = map.getZoomScale(zoom, this._zoom),
				miei = map.getSize().multiplyBy(0.5 + this.options.padding),
				pc = map.project(this._centre, zoom),
				o = miei.multiplyBy(-s).add(pc).subtract(map._getNewPixelOrigin(centre, zoom));
			L.DomUtil.setTransform(this._cv, o, s);
		},

		_update() {
			const map = this._map;
			if (!map) return;
			const p = this.options.padding,
				tal = map.getSize(),
				min = map.containerPointToLayerPoint(tal.multiplyBy(-p)).round(),
				t = tal.multiplyBy(1 + 2 * p).round();
			this._min = min;
			this._centre = map.getCenter();
			this._zoom = map.getZoom();
			L.DomUtil.setPosition(this._cv, min);
			const dpr = Math.min(devicePixelRatio || 1, 2);
			this._dpr = dpr;
			this._W = t.x;
			this._H = t.y;
			this._cv.width = Math.round(t.x * dpr);
			this._cv.height = Math.round(t.y * dpr);
			this._cv.style.width = t.x + 'px';
			this._cv.style.height = t.y + 'px';
			// (las posicions, un còp per vista : l'onda las tòrna legir)
			for (const g of this._grops)
				for (const q of g.punts()) {
					const lp = map.latLngToLayerPoint(q.ll);
					q.x = lp.x - min.x;
					q.y = lp.y - min.y;
				}
			if (this._pintar()) this._animar();
		},

		// --- las jaces ---
		mostrar(g) {
			this._grops.add(g);
			this._caixas = null;
			queueMicrotask(() => onCanvi?.());
			// (tornada alucar en plena onda d'escantiment : sas estelas encara
			// visiblas demòran, l'onda las tòrna pas far espelir)
			g._dejaVisibla = g._estat === 'va';
			g._estat = 'ven';
			this._vaga(g, 1);
		},
		amagar(g) {
			g._estat = 'va';
			this._vaga(g, -1);
		},
		retirar(g) {
			this._grops.delete(g);
			this._pintar();
			this._caixas = null;
			onCanvi?.();
		},
		// las bóstias de las estelas visiblas (±6 px), en coordenadas
		// projectadas al zoom actual : los noms dels dialèctes las evitan
		// (retorn de Romain, 2026-10-23 : VIVAROAUPENC sus un ponch prèp de Gap)
		caixas() {
			const map = this._map;
			if (!map || map.getZoom() >= zIconas()) return null;
			const z = map.getZoom(),
				clau = z + '|' + [...this._grops].filter((g) => g._estat !== 'va').map((g) => g.cid).join(',');
			if (this._caixas?.clau === clau) return this._caixas;
			const cs = [];
			for (const g of this._grops) {
				if (g._estat === 'va') continue;
				for (const q of g.punts()) {
					if (q.m === 'pichon') continue;
					const p = map.project(q.ll, z);
					cs.push([p.x - 6, p.y - 6, p.x + 6, p.y + 6]);
				}
			}
			return (this._caixas = { clau, z, cs });
		},
		// lo tèma o lo daltonisme an cambiat : las colors (--ponch) se tòrnan
		// legir a l'imatge seguent, un còp las variablas CSS mesas
		repintar() {
			requestAnimationFrame(() => this._pintar());
		},
		// l'onda : partís del mitan de la vista ; las jaces alucadas al meteis
		// moment (la lectura Reviscolada n'aluca cinc) partejan la meteissa onda
		_vaga(g, dir) {
			const ara = performance.now() / 1000;
			const v = this._darrièra;
			if (v && v.dir === dir && ara - v.t0 < 1.2) g._vagaA = v;
			else {
				const tal = this._map.getSize();
				g._vagaA = this._darrièra = { t0: calm() ? -99 : ara, dir, centre: this._map.getCenter(), max: Math.hypot(tal.x, tal.y) / 2 };
			}
			this._update();
			this._animar();
		},
		// lo moment ont l'onda passa sus un ponch (s), e son retard per las
		// pastilhas (CSS)
		retard(g, ll, n = 0) {
			const v = g._vagaA;
			if (!v || !this._map) return 0;
			const d = this._map.latLngToContainerPoint(ll).distanceTo(this._map.latLngToContainerPoint(v.centre));
			return clamp(d / v.max, 0, 1.2) * DURADA + azard(n) * AZARD;
		},

		_animar() {
			if (this._raf) return;
			const pas = () => {
				this._raf = null;
				const viu = this._pintar();
				if (viu) this._raf = requestAnimationFrame(pas);
			};
			this._raf = requestAnimationFrame(pas);
		},

		// --- lo dessenh ---
		_color(cid) {
			// la color de la jaça : la de sas pastilhas (--ponch), legida sul CSS
			let s = this._sonda;
			if (!s) {
				s = this._sonda = L.DomUtil.create('div', '', this._map.getContainer());
				s.style.display = 'none';
			}
			s.className = 'ponch-jaça ponch-jaça-' + cid;
			return getComputedStyle(s).getPropertyValue('--ponch').trim() || '#f6b73c';
		},
		// una estela precalculada (alo + còr) per color e mena
		_sprite(color, m) {
			const k = color + m;
			let sp = this._sprites.get(k);
			if (sp) return sp;
			const dpr = this._dpr,
				R = 13,
				c = document.createElement('canvas');
			c.width = c.height = Math.ceil(2 * R * dpr);
			const x = c.getContext('2d');
			x.scale(dpr, dpr);
			const g = x.createRadialGradient(R, R, 0, R, R, R);
			g.addColorStop(0, color);
			g.addColorStop(0.18, color);
			g.addColorStop(0.3, `color-mix(in srgb, ${color} 55%, transparent)`);
			g.addColorStop(0.65, 'transparent');
			x.fillStyle = g;
			x.globalAlpha = m === 'vuèg' ? 0.45 : 0.8;
			x.beginPath();
			x.arc(R, R, R, 0, 2 * Math.PI);
			x.fill();
			x.globalAlpha = 1;
			x.beginPath();
			if (m === 'vuèg') {
				x.strokeStyle = color;
				x.lineWidth = 1.2;
				x.arc(R, R, 3.2, 0, 2 * Math.PI);
				x.stroke();
			} else {
				x.fillStyle = color;
				x.arc(R, R, 3.6, 0, 2 * Math.PI);
				x.fill();
			}
			sp = { c, R };
			this._sprites.set(k, sp);
			return sp;
		},

		// l'esclat d'un ponch qu'es alucat : un alo blanc-daurat
		_esclat() {
			if (this._spEsclat?.dpr === this._dpr) return this._spEsclat;
			const dpr = this._dpr,
				R = 16,
				c = document.createElement('canvas');
			c.width = c.height = Math.ceil(2 * R * dpr);
			const x = c.getContext('2d');
			x.scale(dpr, dpr);
			const g = x.createRadialGradient(R, R, 0, R, R, R);
			g.addColorStop(0, 'rgba(255, 252, 240, 1)');
			g.addColorStop(0.12, 'rgba(255, 240, 200, 0.9)');
			g.addColorStop(0.35, 'rgba(255, 215, 140, 0.35)');
			g.addColorStop(1, 'rgba(255, 200, 120, 0)');
			x.fillStyle = g;
			x.fillRect(0, 0, 2 * R, 2 * R);
			return (this._spEsclat = { c, R, dpr });
		},

		// torna true tant qu'una onda es en cors
		_pintar() {
			const x = this._cx,
				map = this._map;
			if (!x || !map) return false;
			const dpr = this._dpr;
			x.setTransform(dpr, 0, 0, dpr, 0, 0);
			x.clearRect(0, 0, this._W, this._H);
			const ara = performance.now() / 1000;
			const luenh = map.getZoom() < zIconas();
			// (lo fondut de las estelas quand se passa lo lindal de las pastilhas)
			const dtF = Math.min(0.1, ara - (this._tF ?? ara));
			this._tF = ara;
			const cibF = luenh ? 1 : 0;
			this._aF = calm() || this._aF === undefined ? cibF : this._aF + Math.sign(cibF - this._aF) * Math.min(Math.abs(cibF - this._aF), dtF / FONDUT);
			let viu = this._aF !== cibF;
			const FIN = DURADA * 1.2 + AZARD + ALUC;
			const esclat = this._esclat();
			const esclats = [];
			for (const g of this._grops) {
				const v = g._vagaA;
				const dt = v ? ara - v.t0 : 99;
				const enOnda = v && dt < FIN;
				if (enOnda) viu = true;
				else if (g._estat === 'va') continue;
				if (this._aF <= 0.001) continue;
				const color = this._color(g.cid);
				const vc = enOnda ? map.latLngToLayerPoint(v.centre).subtract(this._min) : null;
				for (const q of g.punts()) {
					if (q.m === 'pichon' || q.x === undefined) continue;
					if (q.x < -20 || q.y < -20 || q.x > this._W + 20 || q.y > this._H + 20) continue;
					let a = 1,
						esc = 1,
						e = 0;
					if (vc) {
						q.az ??= azard(q.n);
						const tq = clamp(Math.hypot(q.x - vc.x, q.y - vc.y) / v.max, 0, 1.2) * DURADA + q.az * AZARD;
						let u = (dt - tq) / ALUC;
						if (v.dir > 0) {
							if (u < 0 && !g._dejaVisibla) continue;
							if (u < 0) u = 1;
							// l'aluc : una belugueta que naís, s'espandís e se pausa
							const k = clamp(u);
							a = clamp(u * 6);
							esc = 0.35 + 0.65 * clamp(u * 4) + 0.55 * Math.sin(Math.PI * clamp(u * 1.6)) * (1 - k);
							e = Math.sin(Math.PI * clamp(u * 1.3)) * (1 - 0.4 * k);
						} else {
							if (u > 1) continue;
							// l'escantiment : un darrièr lusor, puèi l'estela s'amorça
							a = 1 - clamp((u - 0.15) / 0.85);
							esc = 1 + 0.35 * Math.sin(Math.PI * clamp(u * 2.5)) - 0.5 * clamp(u);
							e = 0.5 * Math.sin(Math.PI * clamp(u * 2.5));
						}
					}
					const sp = this._sprite(color, q.m);
					const r = sp.R * esc;
					x.globalAlpha = a * this._aF;
					x.drawImage(sp.c, q.x - r, q.y - r, 2 * r, 2 * r);
					if (e > 0.02) esclats.push(q.x, q.y, e);
				}
			}
			// los esclats, per dessús : la lutz de l'onda que passa (en « screen » :
			// ont los ponches son espesses, la lutz se pòt pas cremar en blanc)
			x.globalCompositeOperation = 'screen';
			for (let i = 0; i < esclats.length; i += 3) {
				const r = esclat.R * (0.45 + 0.45 * esclats[i + 2]);
				x.globalAlpha = 0.6 * esclats[i + 2];
				x.drawImage(esclat.c, esclats[i] - r, esclats[i + 1] - r, 2 * r, 2 * r);
			}
			x.globalCompositeOperation = 'source-over';
			x.globalAlpha = 1;
			return viu;
		},

		// --- las estelas tocadas ---
		_tocada(e) {
			const map = this._map;
			if (!map || !this._min || map.getZoom() >= zIconas()) return null;
			if (map.getContainer().classList.contains('luenh')) return null;
			const lp = map.containerPointToLayerPoint(map.mouseEventToContainerPoint(e)).subtract(this._min);
			// (al det, una estela se tòca de pus luènh qu'a la mirga)
			const r = e.pointerType === 'touch' || !matchMedia('(hover: hover)').matches ? 16 : 10;
			let mai = null,
				dm = r * r;
			for (const g of this._grops) {
				if (g._estat === 'va') continue;
				for (const q of g.punts()) {
					if (q.m === 'pichon' || q.x === undefined) continue;
					const d = (q.x - lp.x) ** 2 + (q.y - lp.y) ** 2;
					if (d < dm) (dm = d), (mai = q);
				}
			}
			return mai;
		},
		// (pels autres escotaires : una estela es jos lo det ?)
		tocada(e) {
			return !!this._tocada(e);
		},
		_onClic(e, f) {
			if (this._map?.dragging?._draggable?._moved) return;
			const q = this._tocada(e);
			if (!q || !f) return;
			// (escotat en captura sul contenidor : Leaflet o veirà pas)
			e.stopImmediatePropagation();
			e.stopPropagation();
			f(q.marca);
		},
		_onMirga(e) {
			if (this._rafM) return;
			this._rafM = requestAnimationFrame(() => {
				this._rafM = null;
				this._map?.getContainer().classList.toggle('sus-estela', !!this._tocada(e));
			});
		}
	});

	const tela = new Tela();

	// --- un grop de ponches : de prèp, sonque las pastilhas de la vista ---
	const Grop = L.LayerGroup.extend({
		initialize(marcas, cid) {
			L.LayerGroup.prototype.initialize.call(this, marcas);
			this.cid = cid;
			this._fixas = new Set();
		},
		punts() {
			if (!this._punts) {
				this._punts = [];
				this.eachLayer((m) => this._punts.push({ ll: m.getLatLng(), marca: m, m: mena(m), n: L.stamp(m) }));
			}
			return this._punts;
		},
		onAdd(map) {
			this._map = map;
			if (!map.hasLayer(tela)) tela.addTo(map);
			map.on('moveend', this._sync, this);
			tela.mostrar(this);
			this._sync(true);
		},
		onRemove(map) {
			map.off('moveend', this._sync, this);
			this.eachLayer((m) => map.hasLayer(m) && map.removeLayer(m));
			this._fixas.clear();
			tela.retirar(this);
		},
		_sync(vaga) {
			const map = this._map;
			if (!map) return;
			const luenh = map.getZoom() < zIconas();
			// (lo lindal passat en s'apropant : las pastilhas espelisson del mitan
			// de la vista cap als bòrds, a l'endreit de las estelas que s'escafan)
			const lindal = this._luenhPrec === true && !luenh;
			this._luenhPrec = luenh;
			const mitan = map.getSize().divideBy(2),
				diag = mitan.distanceTo([0, 0]) || 1;
			const b = map.getBounds().pad(0.3);
			this.eachLayer((m) => {
				const vòl = this._fixas.has(m) || (!luenh && b.contains(m.getLatLng())) || m.isPopupOpen?.();
				const i = map.hasLayer(m);
				if (vòl && !i) {
					map.addLayer(m);
					// a l'aluc de la jaça, la pastilha espelís al passatge de l'onda
					if (vaga === true && m._icon && !calm()) m._icon.style.setProperty('--retard', Math.round(tela.retard(this, m.getLatLng(), L.stamp(m)) * 1000) + 'ms');
					else if (lindal && m._icon && !calm()) {
						const d = map.latLngToContainerPoint(m.getLatLng()).distanceTo(mitan) / diag;
						m._icon.style.setProperty('--retard', Math.round(Math.min(1, d) * 450 + azard(L.stamp(m)) * 150) + 'ms');
					}
				} else if (!vòl && i) map.removeLayer(m);
			});
		},
		// la jaça s'escantís : l'onda d'escantiment (estelas e pastilhas)
		escantir() {
			tela.amagar(this);
			this.eachLayer((m) => {
				if (!m._icon) return;
				m._icon.style.setProperty('--retard', Math.round(tela.retard(this, m.getLatLng(), L.stamp(m)) * 2000) + 'ms');
				m._icon.classList.add('ponch-se-va');
			});
		},
		reviure() {
			this.eachLayer((m) => m._icon?.classList.remove('ponch-se-va'));
			tela.mostrar(this);
		},
		// una pastilha que deu èsser sus la carta (la Calandreta mai pròcha)
		assegurar(m) {
			this._fixas.add(m);
			if (this._map && !this._map.hasLayer(m)) this._map.addLayer(m);
			m.once('popupclose', () => {
				this._fixas.delete(m);
				setTimeout(() => this._sync(), 0);
			});
		}
	});

	return {
		tela,
		grop: (marcas, cid) => new Grop(marcas, cid),
		// la durada d'una onda d'escantiment (ms), per levar la jaça après
		DURADA_MS: Math.round((DURADA * 1.2 + AZARD + ALUC) * 1000)
	};
}
