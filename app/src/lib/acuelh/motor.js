// Moteur de l'accueil : fond vivant (WebGL), constellation et carte en étoiles
// (canvas 2D), révélations, compteurs, défilement doux et effets liés au
// défilement. Porté tel quel de l'esbòs de nuèch (app/static/esbos-nuech.html,
// 2026-10-06/07), assemblé par un script puis relu.
//
// Différences avec l'esbòs : le thème, le daltonisme et l'ambiance viennent du
// réglage commun (stores/ambianca) via l'API rendue ; la langue se lit sur la
// racine (classe « fr ») ; tout est cherché DANS la racine de la page, et
// destruir() défait tout (boucle, écouteurs, Lenis, contexte WebGL) quand on
// quitte l'accueil, puisque la navigation ne recharge pas la page.
import Lenis from 'lenis';
import { P, BRANCAS, ARCS } from './simbol.js';
import { LUOCS, RIUS, COSTA, NOMENATS, dialDe, rencDe } from './carta-estelas.js';

// Lo trait de còsta de la carta en estelas (essai demandat per Romain lo
// 2026-10-07, coma sus /carta), copat a 8,6° E coma los rius : la Còrsega, que
// tombariá fòra de la zòna de la carta sus l'acuèlh, es pas dessenhada.
const COSTA_ACUELH = COSTA.map((l) => l.filter(([lon]) => lon <= 8.6)).filter((l) => l.length > 1);

export function lancarAcuelh(racina, opcions = {}) {
	let viu = true, idRaf = 0;
	const ac = new AbortController(), signal = ac.signal;
	const doc = document.documentElement;
	const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const finPointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
	const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
	const lerp = (a, b, t) => a + (b - a) * t;
	const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

	let forçarFons = true;
	/* ================= Tèma : sorne, clar, o coma lo sistèma ================= */
	const TEMAS = {
		sorne: { costa: 'rgba(245, 234, 216, 0.42)', bulla: 'rgba(29, 15, 10, 0.94)', riu: '#eeaf34', estela: '#f5ead8', liser: 'rgba(18, 9, 6, 0.9)', fil: '#eeaf34', riuTèxt: '#ffd47f', vilaTèxt: '#f5ead8', vel: 'rgba(18, 9, 6, 0.75)', velFin: 'rgba(18, 9, 6, 0)', crotzPonch: '#f5ead8', crotzEstret: '#b9822f', crotzCrida: '#6e2e12' },
		clar: { costa: 'rgba(46, 29, 20, 0.42)', bulla: 'rgba(250, 243, 232, 0.96)', riu: '#b06a14', estela: '#6b3a22', liser: 'rgba(245, 234, 216, 0.92)', fil: '#b06a14', riuTèxt: '#8a3f12', vilaTèxt: '#2e1d14', vel: 'rgba(245, 234, 216, 0.85)', velFin: 'rgba(245, 234, 216, 0)', crotzPonch: '#b53d17', crotzEstret: '#c98a4a', crotzCrida: '#e6cbaa' }
	};
	let TEM = TEMAS.sorne, temaClar = false;
	function aplicarTema(clar, dalt) {
		temaClar = clar;
		// Daltonisme : los rius e lors noms ven blaus (lo blau se destria de l'aur per
		// totes los daltonismes roge-verd), lo rèsta de la paleta se fa per CSS
		TEM = { ...(clar ? TEMAS.clar : TEMAS.sorne), ...(dalt ? (clar ? { riu: '#1f5f8f', riuTèxt: '#174a72' } : { riu: '#6fb1ff', riuTèxt: '#a9d0ff' }) : {}) };
		forçarFons = true;
	}

	/* ================= Ambiança del fons (personalizacion) ================= */
	// 0 Venas d'aur (per defaut, la preferida de Romain 2026-10-07) · 1 Lum e estelas · 2 Corbas de nivèl · 3 Simple.
	// D'autras ambiças se pòdon apondre : un cas de mai dins lo shader e una linha aicí.
	let modeFons = 0;

	/* ================= Revelacions ================= */
	const io = new IntersectionObserver((es) => es.forEach((e) => {
		if (!e.isIntersecting) return;
		e.target.classList.add('vist');
		io.unobserve(e.target);
		e.target.querySelectorAll('[data-comptar]').forEach(comptar);
	}), { threshold: 0.18 });
	racina.querySelectorAll('[data-revela]').forEach((el) => io.observe(el));

	function comptar(el) {
		const fin = +el.dataset.comptar, pre = el.dataset.prefix || '';
		const fmt = (n) => pre + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
		if (calm) { el.textContent = fmt(fin); return; }
		const t0 = performance.now(), dura = 2200;
		(function pas(t) {
			const k = clamp((t - t0) / dura);
			el.textContent = fmt(fin * (1 - Math.pow(2, -10 * k)));
			if (k < 1 && viu) requestAnimationFrame(pas); else el.textContent = fmt(fin);
		})(t0);
	}

	/* ================= Defilament doç ================= */
	let lenis = null;
	if (!calm) lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });

	/* ================= Cursor e botons magnetics ================= */
	let mx = innerWidth * 0.5, my = innerHeight * 0.45, mouVist = false;
	const anel = racina.querySelector('.cur-anel'), ponch = racina.querySelector('.cur-ponch');
	let ax = mx, ay = my;
	addEventListener('pointermove', (e) => {
		mx = e.clientX; my = e.clientY; mouVist = true;
		ponch.style.transform = `translate(${mx}px, ${my}px)`;
	}, { passive: true, signal });
	if (finPointer && !calm) {
		doc.classList.add('cursor-viu');
		// Lo cercle s'agrandís sus tot çò que se clica, bandèl comun inclús
		document.addEventListener('pointerover', (e) => anel.classList.toggle('gros', !!e.target.closest?.('a, button, label, [data-cur]')), { signal });
		racina.querySelectorAll('[data-magnet]').forEach((el) => {
			const fill = el.querySelector('.boton-emplenat'), txt = el.querySelector('.boton-tèxt');
			el.addEventListener('pointerenter', (e) => {
				const r = el.getBoundingClientRect();
				fill.style.setProperty('--x', `${e.clientX - r.left}px`);
				fill.style.setProperty('--y', `${e.clientY - r.top}px`);
			});
			el.addEventListener('pointermove', (e) => {
				const r = el.getBoundingClientRect();
				const dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
				el.style.transform = `translate(${dx * 0.28}px, ${dy * 0.4}px)`;
				txt.style.transform = `translate(${dx * 0.12}px, ${dy * 0.16}px)`;
			});
			el.addEventListener('pointerleave', (e) => {
				const r = el.getBoundingClientRect();
				fill.style.setProperty('--x', `${e.clientX - r.left}px`);
				fill.style.setProperty('--y', `${e.clientY - r.top}px`);
				el.style.transform = ''; txt.style.transform = '';
			});
		});
	}

	/* ================= Fons WebGL : las venas d'aur ================= */
	const fons = racina.querySelector('#fons');
	const gl = fons.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
	let U = null;
	if (gl) {
		// Las corbas de nivèl an besonh de las derivadas (fwidth) per un traç fin e regular
		const deriv = gl.getExtension('OES_standard_derivatives');
		const frag = (deriv ? '#extension GL_OES_standard_derivatives : enable\n#define DERIV\n' : '') + `
		precision highp float;
		uniform vec2 r; uniform float t; uniform vec2 m; uniform float s; uniform float p; uniform float c;
		uniform sampler2D rel; uniform vec4 g; uniform float ro; uniform float mo; uniform float cl;
		float h(vec2 q){ return fract(sin(dot(q, vec2(41.3, 289.1))) * 43758.5453); }
		float n(vec2 q){ vec2 i = floor(q), f = fract(q); vec2 u = f*f*(3.0-2.0*f);
			return mix(mix(h(i), h(i+vec2(1,0)), u.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), u.x), u.y); }
		float fbm(vec2 q){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*n(q); q = q*2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
		void main(){
			vec2 uv = gl_FragCoord.xy / r;
			vec2 asp = vec2(r.x / r.y, 1.0);
			vec2 st = uv * asp * 1.5;
			vec2 dm = (uv - m) * asp; float d = length(dm);
			vec3 nuech = vec3(0.071, 0.035, 0.024);
			vec3 brica = vec3(0.27, 0.075, 0.035);
			vec3 terra = vec3(0.71, 0.24, 0.09);
			vec3 aur = vec3(0.93, 0.69, 0.20);
			vec3 col;
			vec3 basa = nuech; // la color de fons de referéncia (per lo mòde clar)
			if (mo < 0.5) {
				// 0. Venas d'aur, paleta « Brasa » (causida per Romain lo 2026-10-07) : colors
				// tiradas de sas publicacions Instagram (design-stock/canva-vf, 213 visuals) :
				// brica prigonda → terracòta #a84830, tacas coral #e84848, venas d'aur #f0a830.
				vec3 b0 = vec3(0.20, 0.055, 0.03), b1 = vec3(0.56, 0.22, 0.13), b2 = vec3(0.91, 0.28, 0.28), b3 = vec3(0.98, 0.70, 0.22);
				basa = b0;
				float tt = t * 0.045;
				st += normalize(dm + 1e-4) * exp(-d * 4.5) * -0.32;
				vec2 q = vec2(fbm(st + tt), fbm(st + vec2(5.2, 1.3) - tt));
				vec2 w = vec2(fbm(st + q * 1.7 + vec2(1.7, 9.2) + s * 0.22), fbm(st + q * 1.7 + vec2(8.3, 2.8) - s * 0.12));
				float v = fbm(st + w * 1.4);
				col = mix(b0, b1, smoothstep(0.28, 0.86, v));
				col = mix(col, b2, smoothstep(0.62, 0.98, v) * (0.22 + 0.3 * p));
				float f = abs(fract(v * 3.4 + tt * 0.6) - 0.5);
				float vena = smoothstep(0.045, 0.0, f) * smoothstep(0.38, 0.82, v);
				col += b3 * vena * (0.5 + 0.2 * p) * (1.0 - 0.8 * c);
				col += vec3(0.85, 0.47, 0.19) * exp(-d * 5.5) * 0.24;
				col *= 1.0 - 0.4 * c;
			} else if (mo < 1.5) {
				// 1. Lum e estelas : grandas tacas de lum cauda que derivan, una candela jos la mirga
				float T = t * 0.02;
				col = mix(vec3(0.078, 0.039, 0.027), vec3(0.16, 0.068, 0.04), smoothstep(1.1, -0.2, uv.y));
				vec2 c1 = vec2(0.25 + 0.12 * sin(T * 1.3), 0.45 + 0.12 * cos(T));
				vec2 c2 = vec2(0.78 + 0.10 * cos(T * 0.9), 0.75 + 0.08 * sin(T * 1.1));
				vec2 c3 = vec2(0.55 + 0.15 * sin(T * 0.7), 0.05 + 0.10 * cos(T * 1.2));
				vec2 e1 = (uv - c1) * asp, e2 = (uv - c2) * asp, e3 = (uv - c3) * asp;
				col += terra * 0.2 * exp(-dot(e1, e1) * 4.0);
				col += aur * 0.08 * exp(-dot(e2, e2) * 5.0);
				col += vec3(0.54, 0.17, 0.07) * 0.18 * exp(-dot(e3, e3) * 3.0);
				col += vec3(1.0, 0.83, 0.5) * 0.085 * exp(-d * d * 9.0);
				col += (h(gl_FragCoord.xy) - 0.5) * 0.018;
				col *= 1.0 - 0.3 * c;
			} else if (mo < 2.5) {
				// 2. Corbas de nivèl : un relief imaginari que respira, una colina jos la man
				float e = fbm(st * 0.93 + vec2(t * 0.006, -t * 0.004)) + 0.18 * exp(-d * d * 18.0);
				float lv = e * 14.0;
				#ifdef DERIV
				float fw = max(fwidth(lv), 1e-4);
				#else
				float fw = 0.04;
				#endif
				float lm = 1.0 - smoothstep(0.0, 1.0, abs(fract(lv - 0.5) - 0.5) / fw);
				float lM = 1.0 - smoothstep(0.0, 1.3, abs(fract(lv / 5.0 - 0.5) - 0.5) / (fw / 5.0));
				col = mix(nuech, vec3(0.14, 0.055, 0.03), uv.y * 0.6 + 0.2);
				col += aur * (lm * 0.12 + lM * 0.2) * (1.0 - 0.85 * c);
				col += terra * 0.1 * exp(-d * 3.0);
			} else {
				// 3. Simple : una nuèch cauda e immobila, sens floritura
				col = mix(nuech, vec3(0.15, 0.06, 0.035), smoothstep(1.0, -0.3, uv.y));
				col *= 1.0 - 0.25 * c;
			}
			// Corbas de nivèl vertadièras (cada 200 m, mai marcadas cada 1000 m), sonque amb la carta
			if (ro > 0.5 && c > 0.001) {
				vec2 tuv = vec2(gl_FragCoord.x * g.x + g.y, gl_FragCoord.y * g.z + g.w);
				float dins = smoothstep(0.0, 0.05, tuv.x) * smoothstep(1.0, 0.95, tuv.x) * smoothstep(0.0, 0.07, tuv.y) * smoothstep(1.0, 0.93, tuv.y);
				float e = texture2D(rel, clamp(tuv, 0.0, 1.0)).r * 4080.0;
				float lv = e / 200.0;
				#ifdef DERIV
				float fw = max(fwidth(lv), 1e-4);
				#else
				float fw = 0.05;
				#endif
				float lm = 1.0 - smoothstep(0.0, 1.0, abs(fract(lv - 0.5) - 0.5) / fw);
				float lM = 1.0 - smoothstep(0.0, 1.4, abs(fract(lv / 5.0 - 0.5) - 0.5) / (fw / 5.0));
				// Ont las corbas se sarran tròp (pendís fòrts), s'escafan : un filigrana, pas una taca
				float dens = smoothstep(0.4, 0.1, fw);
				col += aur * (lm * 0.1 * dens + lM * 0.2 * smoothstep(1.6, 0.4, fw)) * smoothstep(4.0, 40.0, e) * dins * c;
			}
			col *= mix(0.62, 1.0, smoothstep(0.0, 0.7, uv.x));
			col *= smoothstep(1.45, 0.2, length((uv - vec2(0.58, 0.5)) * vec2(1.0, 1.25)));
			// Mòde clar : çò qu'èra lum sus la nuèch ven tencha terracòta sus lo papièr crèma
			if (cl > 0.5) {
				float i = clamp(dot(col - basa, vec3(0.6, 0.3, 0.1)) * 2.4, 0.0, 1.0);
				col = mix(vec3(0.961, 0.918, 0.847), vec3(0.76, 0.43, 0.26), i);
			}
			gl_FragColor = vec4(col, 1.0);
		}`;
		const vert = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }';
		const sh = (ty, src) => { const o = gl.createShader(ty); gl.shaderSource(o, src); gl.compileShader(o); return o; };
		const pr = gl.createProgram();
		gl.attachShader(pr, sh(gl.VERTEX_SHADER, vert));
		gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, frag));
		gl.linkProgram(pr); gl.useProgram(pr);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		const a = gl.getAttribLocation(pr, 'a');
		gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
		U = Object.fromEntries(['r', 't', 'm', 's', 'p', 'c', 'rel', 'g', 'ro', 'mo', 'cl'].map((k) => [k, gl.getUniformLocation(pr, k)]));
	}
	// Mièja resolucion : lo flou del bruch o perdona, la carta grafica trabalha 4 còps mens.
	const ESCALA_FONS = 0.5;
	// Lo relief (tuèlas Terrarium de Mapzen, dadas dobèrtas) : carta d'altitud 576×351,
	// 8 bits (16 m per nivèl), de -3° a 8,5° E e de 42° a 47° N. Cargada sonque quand
	// la carta s'aprèsta (97 Ko).
	const REL = { lon0: -3, lon1: 8.5, lat0: 42, lat1: 47 };
	let reliefDemandat = false, reliefOK = 0, geoFons = [0, 0, 0, 0];
	function cargarRelief() {
		reliefDemandat = true;
		if (!gl) return;
		const img = new Image();
		img.onload = () => {
			if (!viu) return;
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
			gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img);
			for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
			gl.uniform1i(U.rel, 0);
			reliefOK = 1;
		};
		img.src = '/acuelh/relief.png';
	}

	/* ================= La constellacion ================= */
	const cv = racina.querySelector('#estelas');
	const cx = cv.getContext('2d');
	let W = 0, H = 0, DPR = 1;
	function talhar() {
		W = innerWidth; H = innerHeight; DPR = Math.min(devicePixelRatio || 1, 2);
		cv.width = W * DPR; cv.height = H * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
		if (gl) { fons.width = Math.round(W * ESCALA_FONS); fons.height = Math.round(H * ESCALA_FONS); gl.viewport(0, 0, fons.width, fons.height); }
		estelas.forEach(semenar);
		punts.forEach((pt) => semenar(pt.estela));
	}
	const aleat = (a, b) => a + Math.random() * (b - a);
	function semenar(e) { e.x = aleat(0.04, 0.96) * innerWidth; e.y = aleat(0.04, 0.96) * innerHeight; }
	// Ierarquia dels noms (coma sus /carta, demanda Romain 2026-10-07) : las
	// metropòlis en grand, una vila repèr per despartament en retirada ; los
	// autres luòcs son d'estelas sens nom (visibles al subrevòl)
	const estelas = LUOCS.map(([lon, lat, nom, , dia]) => ({
		lon, lat, nom, dia, renc: rencDe(nom), vila: rencDe(nom) <= 2, x: 0, y: 0, px: 0, py: 0,
		r: aleat(0.5, 1.4), f: aleat(0, 6.28), v: aleat(0.2, 0.7), retard: aleat(0, 0.35)
	}));
	// Cadre geografic : l'Occitània de Bordèu a Niça, de Lemòtges a Vielha
	const GEO = { lon0: -1.6, lon1: 7.55, lat0: 42.65, lat1: 46.4, kx: Math.cos((44.5 * Math.PI) / 180) };
	const zonaCarta = racina.querySelector('.carta-estelas');
	const jalonCarta = racina.querySelector('.chifras .jalon');
	// Ont escriure lo nom de cada riu : al mièg de sa linha mai longa
	const rius_nomenats = {};
	for (const [nom, , l] of RIUS) if (nom) (rius_nomenats[nom] ||= []).push(l);
	let aCartaFons = 0, darrierDefil = 0, tòcCarta = -1e9;
	const detCarta = (e) => { if (e.pointerType === 'mouse') return; mx = e.clientX; my = e.clientY; mouVist = true; tòcCarta = performance.now(); };
	zonaCarta.addEventListener('pointerdown', detCarta);
	zonaCarta.addEventListener('pointermove', detCarta);
	const punts = P.map(([lx, ly], i) => ({ lx, ly, x: 0, y: 0, vx: 0, vy: 0, retard: i === 0 ? 0 : aleat(0, 0.28), estela: { x: 0, y: 0, f: aleat(0, 6.28) } }));
	talhar();
	punts.forEach((pt) => { pt.x = pt.estela.x; pt.y = pt.estela.y; });
	addEventListener('resize', talhar, { signal });

	const t0 = performance.now();
	const crida = racina.querySelector('.crida');
	const eros = racina.querySelector('.eros');

	// Plaçament de las etiquetas, en coordenadas relativas al centre de la carta.
	// Vilas : a drecha, a esquèrra, en naut o en bas, la primièra plaça liura.
	// Rius : lo nom seguís lo traçat, letra per letra ; s'ensaja mantun endrech
	// long de l'aiga e se garda lo que tòca pas res.
	let plaçament = { clau: null, vilas: [], rius: [] };
	function plaçar(esc, clau, zw, zh, fv = 12) {
		const lonM = (GEO.lon0 + GEO.lon1) / 2, latM = (GEO.lat0 + GEO.lat1) / 2;
		const loc = (lon, lat) => [(lon - lonM) * GEO.kx * esc, -(lat - latM) * esc];
		const res = { clau, vilas: [], rius: [] };
		// Obstacles dins una grasilha (16 px) : etiquetas e pomètas (pes 5, interdich),
		// traçats dels rius (pes 1, evitat se se pòt). Cada obstacle a un proprietari :
		// un riu se destorba pas el meteis.
		const CEL = 16, grilha = new Map();
		const cases = (b, fn) => { for (let i = Math.floor(b[0] / CEL); i <= Math.floor(b[2] / CEL); i++) for (let j = Math.floor(b[1] / CEL); j <= Math.floor(b[3] / CEL); j++) fn(i + ',' + j); };
		const metre = (b, pes, prop) => { const o = { b, pes, prop }; cases(b, (k) => { if (!grilha.has(k)) grilha.set(k, []); grilha.get(k).push(o); }); };
		const cost = (b, prop) => {
			const vist = new Set(); let c = 0, fort = 0;
			cases(b, (k) => { for (const o of grilha.get(k) || []) {
				if (vist.has(o) || o.prop === prop) continue; vist.add(o);
				if (b[0] < o.b[2] && b[2] > o.b[0] && b[1] < o.b[3] && b[3] > o.b[1]) { c += o.pes; if (o.pes >= 5) fort++; }
			} });
			return [c, fort];
		};
		const liss = (pts, n) => { for (let k = 0; k < n; k++) { const q = [pts[0]]; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } q.push(pts[pts.length - 1]); pts = q; } return pts; };

		// Òrdre de plaçament : las primièras causisson lor plaça. Montpelhièr passa
		// davant (demanda Romain 2026-10-07) ; se cal ne sacrificar una sus telefon,
		// serà una de las darrièras (Nimes, Ais…), pas jamai Montpelhièr.
		const PRIORITAT = ['Montpelhièr', 'Tolosa', 'Marselha', 'Bordèu', 'Niça', 'Clarmont-Ferrand', 'Limòtges', 'Avinhon', 'Baiona', 'Vielha', 'Draonier', 'Pau', 'Valença', 'Tolon', 'Nimes', 'Ais de Provença'];
		const rang = (n) => { const i = PRIORITAT.indexOf(n); return i < 0 ? 99 : i; };
		// Sus telefon la carta es pichona : sonque las metropòlis e los luòcs nomenats
		// (Vielha, Draonier, Baiona) ; las autras vilas se legisson al tòc
		const vilas = estelas
			.filter((e) => e.vila && (fv >= 12 || e.renc === 1 || NOMENATS.includes(e.nom)))
			.sort((a, b) => a.renc - b.renc || rang(a.nom) - rang(b.nom));
		for (const e of vilas) { const [x, y] = loc(e.lon, e.lat); e.lx = x; e.ly = y; metre([x - 4, y - 4, x + 4, y + 4], 5, e.nom); }
		RIUS.forEach(([nom, , l], n) => {
			const pts = l.map(([lon, lat]) => loc(lon, lat)), prop = nom || 'riu' + n;
			for (let i = 1; i < pts.length; i++) {
				const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
				for (let d = 0; d < L; d += 4) { const x = a[0] + ((b[0] - a[0]) * d) / L, y = a[1] + ((b[1] - a[1]) * d) / L; metre([x - 1.5, y - 1.5, x + 1.5, y + 1.5], 1, prop); }
			}
		});

		// Vilas : la plaça la mens encombrada entre drecha, esquèrra, naut e bas
		for (const e of vilas) {
			const fe = e.renc === 1 ? fv * 1.35 : fv * 0.92, k = fe / 12;
			cx.font = '700 ' + fe + 'px Luciole, sans-serif';
			const w = cx.measureText(e.nom).width, x = e.lx, y = e.ly;
			const cand = [
				{ x: x + 7 * k, y: y + 4 * k, al: 'left', b: [x + 5 * k, y - 8 * k, x + 9 * k + w, y + 7 * k], bonus: 0 },
				{ x: x - 7 * k, y: y + 4 * k, al: 'right', b: [x - 9 * k - w, y - 8 * k, x - 5 * k, y + 7 * k], bonus: 0.4 },
				{ x, y: y - 9 * k, al: 'center', b: [x - w / 2 - 2, y - 21 * k, x + w / 2 + 2, y - 5 * k], bonus: 0.6 },
				{ x, y: y + 18 * k, al: 'center', b: [x - w / 2 - 2, y + 5 * k, x + w / 2 + 2, y + 21 * k], bonus: 0.8 },
				{ x: x + 5 * k, y: y - 7 * k, al: 'left', b: [x + 3 * k, y - 19 * k, x + 7 * k + w, y - 4 * k], bonus: 1 },
				{ x: x + 5 * k, y: y + 15 * k, al: 'left', b: [x + 3 * k, y + 3 * k, x + 7 * k + w, y + 18 * k], bonus: 1 },
				{ x: x - 5 * k, y: y - 7 * k, al: 'right', b: [x - 7 * k - w, y - 19 * k, x - 3 * k, y - 4 * k], bonus: 1.2 },
				{ x: x - 5 * k, y: y + 15 * k, al: 'right', b: [x - 7 * k - w, y + 3 * k, x - 3 * k, y + 18 * k], bonus: 1.2 }
			];
			let c = cand[0], mendre = Infinity;
			// Un nom pòt crosar un riu (son liseré lo destaca) : quasi gratuit ; tocar un autre
			// nom o una pomèta, enebit. Atal Clarmont-Ferrand tòrna a drecha de son ponch.
			// Un nom sortís pas de la carta (Baiona, Draonier, sus los bòrds)
			const bòrd = zw / 2 + 10;
			for (const k of cand) {
				const [v, f] = cost(k.b, e.nom);
				const defòra = k.b[0] < -bòrd || k.b[2] > bòrd ? 1 : 0;
				const sc = (v - 5 * f) * 0.03 + (f + defòra) * 100 + k.bonus;
				if (sc < mendre) { mendre = sc; c = k; }
			}
			// Cap de plaça liura (ciutats sarradas sus telefon) : lo nom se mòstra pas,
			// puslèu que de se pilar sus un autre ; demòra visible al tòc
			if (mendre >= 100) continue;
			metre(c.b, 5, 'etiqueta'); res.vilas.push({ e, x: c.x, y: c.y, al: c.al, f: fe });
		}

		// Rius : dels mai grands als mai pichons ; lo nom seguís lo traçat lissat,
		// en naut o en bas de l'aiga, sus un tròç calm, sens tocar res
		const rius = Object.entries(rius_nomenats).map(([nom, linhas]) => ({ nom, linhas, pes: Math.max(...RIUS.filter((r) => r[0] === nom).map((r) => r[1])) }))
			.sort((a, b) => b.pes - a.pes);
		for (const { nom, linhas, pes } of rius) {
			const fs = Math.round(12 + pes * 0.75), trac = fs * 0.09;
			cx.font = 'italic ' + fs + 'px "Cormorant Garamond", Georgia, serif';
			const larg = [...nom].map((c) => cx.measureText(c).width), tot = larg.reduce((a, b) => a + b, 0) + trac * (nom.length - 1);
			const ofs = fs * 0.55 + 3;
			let melhor = null;
			for (const l of linhas) {
				const pts = liss(l.map(([lon, lat]) => loc(lon, lat)), 3);
				const cum = [0];
				for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
				const L = cum[cum.length - 1];
				if (L < tot + 20) continue;
				const ponch = (d) => {
					d = Math.max(0, Math.min(L, d));
					let lo = 1, hi = cum.length - 1;
					while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < d) lo = m + 1; else hi = m; }
					const i = lo, f = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
					return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
				};
				for (const frac of [0.5, 0.44, 0.56, 0.38, 0.62, 0.31, 0.69, 0.24, 0.76, 0.17, 0.83, 0.1, 0.9]) {
					const d0 = frac * L - tot / 2;
					if (d0 < 6 || d0 + tot > L - 6) continue;
					// Lo nom seguís pas lo traçat exacte mas un ARC DOÇ ajustat sus tres ponches
					// del tròç (debuta, mièg, fin). Sa corbatura es plafonada segon la talha del
					// nom, e las letras son espaçadas al long de l'arc meteis : se pòdon pas
					// cavalcar, a cap de talha de fenèstra.
					const span = tot * 1.08;
					let P0 = ponch(d0 + tot / 2 - span / 2), P1 = ponch(d0 + tot / 2), P2 = ponch(d0 + tot / 2 + span / 2);
					if (P2[0] < P0[0]) [P0, P2] = [P2, P0];
					const cl = Math.hypot(P2[0] - P0[0], P2[1] - P0[1]);
					if (cl < tot * 0.6) continue;
					const u = [(P2[0] - P0[0]) / cl, (P2[1] - P0[1]) / cl], nv = [u[1], -u[0]];
					// corbatura del riu sul tròç (positiva = arc bombat cap amont del tèxte)
					const M = [(P0[0] + P2[0]) / 2, (P0[1] + P2[1]) / 2];
					const sag = (P1[0] - M[0]) * nv[0] + (P1[1] - M[1]) * nv[1];
					const kr = (8 * sag) / (cl * cl + 4 * sag * sag);
					for (const costat of [1, -1]) {
						let kb = kr / (1 + kr * ofs * costat);
						const kmax = Math.min(1 / (7 * fs), 0.9 / tot);
						kb = Math.max(-kmax, Math.min(kmax, kb));
						const A = [P1[0] + nv[0] * ofs * costat, P1[1] + nv[1] * ofs * costat];
						const letras = [], bs = [];
						let d = -tot / 2;
						[...nom].forEach((c, k) => {
							const sL = d + larg[k] / 2, th = sL * kb;
							const x = A[0] + (Math.abs(kb) < 1e-6 ? u[0] * sL : (u[0] * Math.sin(th) - nv[0] * (1 - Math.cos(th))) / kb);
							const y = A[1] + (Math.abs(kb) < 1e-6 ? u[1] * sL : (u[1] * Math.sin(th) - nv[1] * (1 - Math.cos(th))) / kb);
							const t = [u[0] * Math.cos(th) - nv[0] * Math.sin(th), u[1] * Math.cos(th) - nv[1] * Math.sin(th)];
							letras.push({ c, x, y, a: Math.atan2(t[1], t[0]) });
							bs.push([x - larg[k] / 2 - 1, y - fs * 0.42, x + larg[k] / 2 + 1, y + fs * 0.42]);
							d += larg[k] + trac;
						});
						// L'arc deu demorar a l'entorn del riu : ni sus l'aiga, ni tròp luènh
						let dmin = Infinity, dmax = 0;
						for (const g of letras) {
							let m = Infinity;
							for (let dd = Math.max(0, d0 - fs * 2); dd <= Math.min(L, d0 + tot + fs * 2); dd += 3) { const q = ponch(dd); m = Math.min(m, Math.hypot(q[0] - g.x, q[1] - g.y)); }
							dmin = Math.min(dmin, m); dmax = Math.max(dmax, m);
						}
						if (dmin < ofs * 0.55 || dmax > ofs + fs * 1.3) continue;
						let sc = (dmax - ofs) / fs + Math.abs(frac - 0.5) * 3 + (costat < 0 ? 0.3 : 0), fort = 0;
						for (const bx of bs) { const r = cost(bx, nom); sc += r[0]; fort += r[1]; }
						if (!fort && (!melhor || sc < melhor.sc)) melhor = { letras, bs, sc };
					}
				}
			}
			if (!melhor) continue;
			for (const b of melhor.bs) metre([b[0] - 2, b[1] - 2, b[2] + 2, b[3] + 2], 5, 'etiqueta');
			const m = melhor.letras[Math.floor(melhor.letras.length / 2)];
			res.rius.push({ letras: melhor.letras, cx: m.x, cy: m.y, fs });
		}
		return res;
	}

	let cacheEtiq = null;
	function construirEtiquetas(clau, pusNom, pusLoc, zw, zh, fv = 12) {
		const M = 220, w = Math.ceil(zw + 2 * M), h = Math.ceil(zh + 2 * M), ox = w / 2, oy = h / 2;
		const fa = () => { const c = document.createElement('canvas'); c.width = Math.ceil(w * DPR); c.height = Math.ceil(h * DPR); const g = c.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, ox * DPR, oy * DPR); g.strokeStyle = TEM.liser; g.lineJoin = 'round'; return [c, g]; };
		// Los noms vesins de l'estela subrevolada s'escafan (mai prèp sus telefon)
		const rayVesins = fv < 12 ? 60 : 150;
		const pres = (x, y) => (pusLoc ? Math.hypot(x - pusLoc[0], y - pusLoc[1]) < rayVesins : false);
		const [cr, gr] = fa();
		gr.fillStyle = TEM.riuTèxt; gr.textAlign = 'center'; gr.textBaseline = 'middle'; gr.lineWidth = 3;
		for (const r of plaçament.rius) {
			gr.font = 'italic ' + r.fs + 'px "Cormorant Garamond", Georgia, serif';
			gr.globalAlpha = pres(r.cx, r.cy) ? 0.12 : 1;
			for (const pas of ['strokeText', 'fillText']) for (const g of r.letras) {
				gr.save(); gr.translate(g.x, g.y); gr.rotate(g.a); gr[pas](g.c, 0, 0); gr.restore();
			}
		}
		const [cv2, gv] = fa();
		gv.fillStyle = TEM.vilaTèxt;
		for (const v of plaçament.vilas) {
			if (v.e.nom === pusNom) continue;
			gv.font = '700 ' + v.f + 'px Luciole, sans-serif'; gv.lineWidth = v.e.renc === 1 ? 4.5 : 3.2;
			gv.globalAlpha = (pres(v.e.lx, v.e.ly) ? 0.12 : 1) * (v.e.renc === 1 ? 1 : 0.85);
			gv.textAlign = v.al; gv.strokeText(v.e.nom, v.x, v.y); gv.fillText(v.e.nom, v.x, v.y);
		}
		return { clau, pusNom, dpr: DPR, tema: TEM, rius: cr, vilas: cv2, ox, oy, w, h };
	}

	function dessenharConstellacion(t, sy) {
		const temps = (t - t0) / 1000;
		// Intro : los punts venon s'ajustar (1,8 s), en luòc d'un compte a rebors factici.
		const intro = calm ? 1 : easeIO(clamp((temps - 0.35) / 1.8));
		// Ecran estrech : la crotz se fa discreta en naut a drecha, darrièr lo tèxte.
		const estret = W < 1100;
		const aEros = intro * clamp(1 - sy / (H * 0.85));
		const rc = crida.getBoundingClientRect();
		const aCrida = clamp((H - rc.top) / (H * 0.9));
		const enCrida = aCrida > aEros;
		const a = Math.max(aEros, aCrida);
		const R = enCrida ? Math.min(H * 0.4, W * 0.36) : estret ? Math.min(W * 0.26, H * 0.2) : Math.min(H * 0.26, W * 0.14);
		const ox = enCrida ? W / 2 : estret ? W * 0.7 : W * 0.8;
		const oy = enCrida ? rc.top + rc.height / 2 : (estret ? H * 0.27 : H * 0.42) - sy * 0.35;
		const opacitat = enCrida ? 0.32 : estret ? 0.45 : 1;
		const rot = temps * 0.015 + sy * 0.0004;
		const co = Math.cos(rot), si = Math.sin(rot);

		cx.clearRect(0, 0, W, H);

		// Estelas de fons : los luòcs esparpalhats… que venon dessenhar l'Occitània
		// quand la zòna de la carta (acte V) passa davant l'uelh.
		const zr = zonaCarta.getBoundingClientRect();
		const aCarta = clamp((H * 0.95 - zr.top) / (H * 0.55)) * clamp((zr.bottom - H * 0.05) / (H * 0.45));
		aCartaFons = aCarta;
		if (!reliefDemandat && zr.top < H * 2.5) cargarRelief();
		const gw = (GEO.lon1 - GEO.lon0) * GEO.kx, gh = GEO.lat1 - GEO.lat0;
		const esc = Math.min((zr.width * 0.98) / gw, (zr.height * 0.94) / gh);
		// Centre calat sus un pixèl entièr : las letras tremolan pas pendent lo defilament
		const zcx = Math.round(zr.left + zr.width / 2), zcy = Math.round(zr.top + zr.height / 2);
		const lonM = (GEO.lon0 + GEO.lon1) / 2, latM = (GEO.lat0 + GEO.lat1) / 2;
		const rayLigam = lerp(140, 90, aCarta);
		// Los rius se tràçan de la font a la boca, un pauc après las estelas
		const aRiu = easeIO(clamp((aCarta - 0.35) / 0.6));
		const pX = (lon) => zcx + (lon - lonM) * GEO.kx * esc, pY = (lat) => zcy - (lat - latM) * esc;
		// Lo fial de còsta : apareis un pauc abans los rius, fin e discret
		const aCosta = clamp((aCarta - 0.25) / 0.5);
		if (aCosta > 0.01) {
			cx.globalAlpha = aCosta; cx.strokeStyle = TEM.costa; cx.lineWidth = 0.8; cx.lineJoin = 'round';
			cx.beginPath();
			for (const l of COSTA_ACUELH) {
				cx.moveTo(pX(l[0][0]), pY(l[0][1]));
				for (let i = 1; i < l.length; i++) cx.lineTo(pX(l[i][0]), pY(l[i][1]));
			}
			cx.stroke();
		}
		if (aRiu > 0.01) {
			cx.strokeStyle = TEM.riu; cx.lineCap = 'round'; cx.lineJoin = 'round';
			for (const [nom, pes, l] of RIUS) {
				const k = aRiu * (l.length - 1), n = Math.floor(k);
				cx.globalAlpha = nom ? 0.75 : 0.25;
				cx.lineWidth = 0.4 + pes * 0.22;
				cx.beginPath(); cx.moveTo(pX(l[0][0]), pY(l[0][1]));
				for (let i = 1; i <= n; i++) cx.lineTo(pX(l[i][0]), pY(l[i][1]));
				if (n < l.length - 1) {
					const f = k - n;
					cx.lineTo(pX(lerp(l[n][0], l[n + 1][0], f)), pY(lerp(l[n][1], l[n + 1][1], f)));
				}
				cx.stroke();
			}
		}
		// Correspondéncia pixèl del fons → coordenada de la carta d'altitud
		{
			const lw = REL.lon1 - REL.lon0, lh = REL.lat1 - REL.lat0;
			geoFons = [1 / (ESCALA_FONS * GEO.kx * esc * lw), (lonM - REL.lon0) / lw - zcx / (GEO.kx * esc * lw),
				-1 / (ESCALA_FONS * esc * lh), (REL.lat1 - latM) / lh + (H - zcy) / (esc * lh)];
		}
		// Sus telefon, lo nom tòcat demòra 5 s, e la zòna de tòc es mai larga que la mirga
		const detActiu = performance.now() - tòcCarta < 5000;
		// Las vilas an la prioritat : se lo det tomba a costat d'una vila, es ela que s'aficha
		// e non lo vilatjòt vesin (bonus de distància, mai fòrt al det qu'a la mirga)
		const rayPus = detActiu ? 34 : 22, bonusVila = detActiu ? 18 : 6;
		let pus = null, pusD = Infinity;
		for (const e of estelas) {
			const tw = Math.sin(temps * e.v + e.f) * 0.5 + 0.5;
			const x0 = e.x + Math.sin(temps * 0.05 + e.f) * 12, y0 = e.y + Math.cos(temps * 0.04 + e.f) * 10 - ((sy * 0.08) % H);
			const yy0 = ((y0 % H) + H) % H;
			const ai = aCarta > 0 ? easeIO(clamp(aCarta * 1.35 - e.retard)) : 0;
			const mxp = zcx + (e.lon - lonM) * GEO.kx * esc, myp = zcy - (e.lat - latM) * esc;
			const x = lerp(x0, mxp, ai), y = lerp(yy0, myp, ai);
			e.px = x; e.py = y; e.ai = ai;
			cx.globalAlpha = lerp(0.18 + 0.27 * tw, e.vila ? 1 : 0.55 + 0.35 * tw, ai);
			cx.fillStyle = TEM.estela;
			cx.beginPath(); cx.arc(x, y, lerp(e.r, e.renc === 1 ? 3.2 : e.vila ? 2.2 : 1.35, ai), 0, 6.283); cx.fill();
			if (mouVist && (finPointer || detActiu)) {
				const dd = Math.hypot(x - mx, y - my);
				if (dd < rayLigam) {
					cx.globalAlpha = (1 - dd / rayLigam) * 0.5; cx.strokeStyle = TEM.fil; cx.lineWidth = 0.6;
					cx.beginPath(); cx.moveTo(x, y); cx.lineTo(mx, my); cx.stroke();
				}
				// Pas de subrevòl pendent lo defilament : la carta glissa jos la mirga immobila
				// e cada estela traversada fasiá lusir son nom e son vel (clinhaments)
				const sc = dd - (e.vila ? bonusVila : 0);
				if (ai > 0.9 && dd < rayPus && sc < pusD && performance.now() - darrierDefil > 250) { pus = e; pusD = sc; }
			}
		}
		// Las etiquetas : un liseré de nuèch a l'entorn de cada nom per que se destaque
		// dels rius ; al subrevòl, los noms vesins s'escafan (pas de fotralha).
		// Las etiquetas son dessenhadas UN CÒP dins doas imatges en memòria (rius, vilas),
		// puèi simplament desplaçadas : pas mai de 250 letras viradas de redessenhar
		// a cada imatge (Firefox o pagava car). Refachas sonque quand l'escala o
		// l'estela subrevolada càmbian.
		const telefon = W <= 700, fv = telefon ? 10 : 12;
		if (aRiu > 0.8 || aCarta > 0.6) {
			const clau = esc.toFixed(1) + '|' + Math.round(zr.width) + '|' + Math.round(zr.height) + '|' + fv;
			if (plaçament.clau !== clau) plaçament = plaçar(esc, clau, zr.width, zr.height, fv);
			const pusNom = pus ? pus.nom : '';
			if (!cacheEtiq || cacheEtiq.clau !== clau || cacheEtiq.pusNom !== pusNom || cacheEtiq.dpr !== DPR || cacheEtiq.tema !== TEM)
				cacheEtiq = construirEtiquetas(clau, pusNom, pus ? [pus.px - zcx, pus.py - zcy] : null, zr.width, zr.height, fv);
			const c = cacheEtiq;
			if (aRiu > 0.8 && !telefon) { cx.globalAlpha = ((aRiu - 0.8) / 0.2) * 0.85; cx.drawImage(c.rius, zcx - c.ox, zcy - c.oy, c.w, c.h); }
			if (aCarta > 0.6) { cx.globalAlpha = ((aCarta - 0.6) / 0.4) * 0.92; cx.drawImage(c.vilas, zcx - c.ox, zcy - c.oy, c.w, c.h); }
		}
		// Al subrevòl : lo nom occitan del luòc e son dialècte, sus un vel sorne doç
		if (pus) {
			const escriure = (t, x, y, liseré) => { cx.lineWidth = liseré; cx.strokeText(t, x, y); cx.fillText(t, x, y); };
			if (detActiu && !finPointer) {
				// Al det (telefon) : lo nom es desportat dins una bulla AL DESSÚS del det,
				// religada a l'estela per un fial, per que lo pouce l'amague pas
				const nomF = 'italic 22px "Cormorant Garamond", Georgia, serif', dialF = '700 11px Luciole, sans-serif';
				cx.font = nomF; const wn = cx.measureText(pus.nom).width;
				cx.font = dialF; const wd = cx.measureText(dialDe(pus)).width;
				const bw = Math.max(wn, wd) + 30, bh = 52;
				const bx = Math.min(W - bw / 2 - 10, Math.max(bw / 2 + 10, pus.px));
				const by = Math.max(70 + bh / 2, pus.py - 86);
				cx.globalAlpha = 1; cx.strokeStyle = TEM.fil; cx.lineWidth = 1;
				cx.beginPath(); cx.moveTo(pus.px, pus.py - 9); cx.lineTo(bx, by + bh / 2); cx.stroke();
				cx.lineWidth = 1.3; cx.beginPath(); cx.arc(pus.px, pus.py, 9, 0, 6.283); cx.stroke();
				cx.fillStyle = TEM.bulla; cx.beginPath(); cx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 14); cx.fill();
				cx.lineWidth = 1; cx.stroke();
				cx.textAlign = 'center';
				cx.font = nomF; cx.fillStyle = TEM.riuTèxt; cx.fillText(pus.nom, bx, by + 2);
				cx.font = dialF; cx.fillStyle = TEM.vilaTèxt; cx.globalAlpha = 0.8; cx.fillText(dialDe(pus), bx, by + 18);
				cx.textAlign = 'left'; cx.globalAlpha = 1;
			} else {
			const dreta = pus.px < W - (telefon ? 150 : 260);
			const tx = pus.px + (dreta ? 16 : -16);
			const vel = cx.createRadialGradient(pus.px, pus.py, 0, pus.px, pus.py, 130);
			vel.addColorStop(0, TEM.vel); vel.addColorStop(1, TEM.velFin);
			cx.globalAlpha = 1; cx.fillStyle = vel;
			cx.fillRect(pus.px - 130, pus.py - 130, 260, 260);
			cx.strokeStyle = TEM.fil; cx.lineWidth = 1.2;
			cx.beginPath(); cx.arc(pus.px, pus.py, 8, 0, 6.283); cx.stroke();
			cx.textAlign = dreta ? 'left' : 'right'; cx.strokeStyle = TEM.liser;
			cx.font = (telefon ? 'italic 21px' : 'italic 26px') + ' "Cormorant Garamond", Georgia, serif'; cx.fillStyle = TEM.riuTèxt;
			escriure(pus.nom, tx, pus.py + 2, 5);
			cx.font = '700 11px Luciole, sans-serif'; cx.fillStyle = TEM.vilaTèxt; cx.globalAlpha = 0.8;
			escriure(dialDe(pus), tx, pus.py + 20, 4);
			cx.textAlign = 'left';
			}
		}
		// La flècha del nòrd, a l'anciana : agulha en losange (mitat plena, mitat
		// traçada), un anèl fin, una N italica ; FÒRA de la carta, dins l'espaci entre
		// lo jalon « 04 » e lo primièr riu (demanda Romain 2026-10-07)
		if (aCarta > 0.05) {
			// Mesurada a cada talha : l'espaci sorne entre lo bas del jalon « 04 » e lo primièr
			// element de la carta JUST DEJÓS (riu o vila de la banda esquèrra, sovent la Charanta) ;
			// la flècha se centra dedins, alinhada sul « 04 »
			const jr = jalonCarta.getBoundingClientRect();
			const x0 = jr.left - 10, x1 = jr.left + 120;
			let nautCarta = zr.top + zr.height * 0.3;
			for (const [, , l] of RIUS) for (const [lo, la] of l) { const x = pX(lo), y = pY(la); if (x > x0 && x < x1 && y > jr.bottom && y < nautCarta) nautCarta = y; }
			for (const e of estelas) if (e.ai > 0.5 && e.px > x0 && e.px < x1 && e.py > jr.bottom && e.py < nautCarta) nautCarta = e.py;
			const espaci = Math.max(30, nautCarta - jr.bottom);
			const h = Math.max(11, Math.min(telefon ? 15 : 20, espaci * 0.36)), l = h * 0.19, rA = h / 3, bra = h * 0.6;
			const nx = Math.round(jr.left + bra), ny = jr.bottom + espaci / 2 - h * 0.95;
			cx.globalAlpha = aCarta * 0.8; cx.strokeStyle = TEM.fil; cx.fillStyle = TEM.fil; cx.lineWidth = 0.9;
			cx.beginPath(); cx.arc(nx, ny + h, rA, 0, 6.283); cx.stroke();
			cx.globalAlpha = aCarta * 0.45;
			cx.beginPath(); cx.moveTo(nx - bra, ny + h); cx.lineTo(nx + bra, ny + h); cx.stroke();
			cx.globalAlpha = aCarta * 0.8;
			cx.beginPath(); cx.moveTo(nx, ny); cx.lineTo(nx - l, ny + h); cx.lineTo(nx, ny + h); cx.closePath(); cx.fill();
			cx.beginPath(); cx.moveTo(nx, ny); cx.lineTo(nx + l, ny + h); cx.lineTo(nx, ny + h); cx.closePath(); cx.stroke();
			cx.beginPath(); cx.moveTo(nx - l, ny + h); cx.lineTo(nx, ny + h * 1.9); cx.lineTo(nx + l, ny + h); cx.stroke();
			cx.font = 'italic ' + (telefon ? 13 : 16) + 'px "Cormorant Garamond", Georgia, serif'; cx.textAlign = 'left'; cx.fillStyle = TEM.riuTèxt;
			cx.fillText('N', nx + bra + 4, ny + h * 0.35);
		}

		// Los 13 punts del lògo : ressòrt cap a la cibla + repulsion de la mirga
		for (const pt of punts) {
			const ai = easeIO(clamp((a * 1.28 - pt.retard)));
			const ex = pt.estela.x + Math.sin(temps * 0.07 + pt.estela.f) * 30;
			const ey = pt.estela.y + Math.cos(temps * 0.06 + pt.estela.f) * 24;
			const lx = (pt.lx * co - pt.ly * si) * R + ox, ly = (pt.lx * si + pt.ly * co) * R + oy;
			const tx = lerp(ex, lx, ai), ty = lerp(ey, ly, ai);
			if (calm) { pt.x = tx; pt.y = ty; pt.ai = ai; continue; }
			pt.vx += (tx - pt.x) * 0.055; pt.vy += (ty - pt.y) * 0.055;
			if (mouVist) {
				const dx = pt.x - mx, dy = pt.y - my, dd = Math.hypot(dx, dy);
				if (dd < 140 && dd > 0.1) { const k = (1 - dd / 140) * 2.4; pt.vx += (dx / dd) * k; pt.vy += (dy / dd) * k; }
			}
			pt.vx *= 0.8; pt.vy *= 0.8;
			pt.x += pt.vx; pt.y += pt.vy; pt.ai = ai;
		}
		const aL = clamp((a - 0.55) / 0.4) * opacitat;
		if (aL > 0.01) {
			cx.globalAlpha = aL; cx.strokeStyle = TEM.fil; cx.lineCap = 'round';
			cx.lineWidth = Math.max(1.2, R * 0.05);
			cx.beginPath();
			for (const i of BRANCAS) { cx.moveTo(punts[0].x, punts[0].y); cx.lineTo(punts[i].x, punts[i].y); }
			for (const [i, j] of ARCS) {
				const A = punts[i], B = punts[j], O = punts[0];
				const mxp = (A.x + B.x) / 2, myp = (A.y + B.y) / 2;
				cx.moveTo(A.x, A.y); cx.quadraticCurveTo(lerp(mxp, O.x, 0.17), lerp(myp, O.y, 0.17), B.x, B.y);
			}
			cx.stroke();
		}
		// Mòde discret (crida, ecran estrech) : pomètas d'aur amortit e OPACAS,
		// per que los traçats se vejan pas a travèrs (efièch grisastre).
		// Darrièr lo títol de la crida, color de braça (lo tèxte daurat demòra legible).
		cx.fillStyle = enCrida ? TEM.crotzCrida : estret ? TEM.crotzEstret : TEM.crotzPonch;
		punts.forEach((pt, i) => {
			const rr = lerp(1.6, R * (i === 0 ? 0.124 : 0.109), pt.ai * pt.ai);
			cx.globalAlpha = lerp(0.6, 1, pt.ai);
			cx.beginPath(); cx.arc(pt.x, pt.y, rr, 0, 6.283); cx.fill();
		});
		cx.globalAlpha = 1;
	}

	/* ================= Lo defilament pilòta tot ================= */
	const head = racina.querySelector('.capçal');
	const camins = racina.querySelector('.camins'), caminsPista = racina.querySelector('.camins-pista'), caminsBarra = racina.querySelector('.camins-barra i');
	const panels = [...racina.querySelectorAll('.panel')];
	const trobador = racina.querySelector('.trobador'), fenestra = racina.querySelector('.trobador-fenestra'), fenestraImg = fenestra.querySelector('img');
	const vers = racina.querySelector('.trobador-vers');
	if (calm) vers.classList.add('vist');
	const manifest = racina.querySelector('[data-emplenar]');
	const bandel = racina.querySelector('.bandel'), bandelPista = racina.querySelector('.bandel-pista');
	let bandelX = 0, bandelSkew = 0, ultimY = scrollY;

	function segonDefilament(sy, vel) {
		// Capçal : s'amaga en davalant, torna en remontant
		if (!calm && Math.abs(sy - ultimY) > 0.3) head.classList.toggle('amagat', sy > H * 0.7 && sy > ultimY);
		head.classList.toggle('solid', sy > 40);
		ultimY = sy;

		// Bandèl : sa velocitat e son inclinason seguisson lo defilament
		const rb = bandel.getBoundingClientRect();
		if (rb.bottom > 0 && rb.top < H) {
			const largor = bandelPista.scrollWidth / 2;
			// Totjorn de drecha a esquèrra (demanda Romain 2026-10-07) : lo defilament l'accelèra sonque
		bandelX -= calm ? 0 : 0.55 + Math.min(Math.abs(vel) * 0.35, 14);
			bandelX = ((bandelX % largor) - largor) % largor;
			bandelSkew = lerp(bandelSkew, calm ? 0 : clamp(vel * 0.4, -9, 9), 0.12);
			bandelPista.style.transform = `translate3d(${bandelX}px,0,0) skewX(${-bandelSkew}deg)`;
		}

		// Manifèst : los mots s'alumenan un per un
		const rm = manifest.getBoundingClientRect();
		if (rm.top < H && rm.bottom > 0) {
			const prog = clamp((H * 0.82 - rm.top) / (rm.height + H * 0.3));
			const mots = manifest.querySelectorAll(`[data-lenga="${racina.classList.contains('fr') ? 'fr' : 'oc'}"] .m`);
			const n = Math.floor(prog * (mots.length + 1));
			mots.forEach((m, i) => m.classList.toggle('on', calm || i < n));
		}

		// Camins : lo defilament vertical ven orizontal
		const rc = camins.getBoundingClientRect();
		if (rc.top < H && rc.bottom > 0) {
			const prog = clamp(-rc.top / (rc.height - H));
			const despl = caminsPista.scrollWidth - W;
			caminsPista.style.transform = `translate3d(${-prog * despl}px,0,0)`;
			caminsBarra.style.transform = `scaleX(${prog})`;
			panels.forEach((p) => {
				const r = p.getBoundingClientRect();
				const c = (r.left + r.width / 2 - W / 2) / W;
				const img = p.querySelector('[data-paral]');
				if (img && !calm) img.style.transform = `translate3d(${c * -12}%,0,0)`;
				const simb = p.querySelector('.simbol');
				if (simb && Math.abs(c) < 0.35) simb.classList.add('actiu');
			});
		}

		// Trobador : la fenèstra s'obrís fins a tota la pagina
		const rt = trobador.getBoundingClientRect();
		if (!calm && rt.top < H && rt.bottom > 0) {
			const k = easeIO(clamp(-rt.top / (rt.height - H) * 1.25));
			const iy = lerp(22, 0, k), ix = lerp(32, 0, k), rad = lerp(28, 0, k);
			fenestra.style.clipPath = `inset(${iy}% ${ix}% round ${rad}px)`;
			fenestraImg.style.transform = `scale(${lerp(1.3, 1, k)})`;
			// Lo vèrs apareis sonque quand la fenèstra es pro larga per l'aculhir
			vers.classList.toggle('vist', k > 0.62);
		}
	}

	/* ================= Una sola bocla ================= */
	let fotograma = 0, syAbans = scrollY, sySimple = -1;
	function bocla(t) {
		if (!viu) return;
		lenis?.raf(t);
		const sy = scrollY, vel = lenis ? lenis.velocity : 0;
		if (Math.abs(sy - syAbans) > 0.5) darrierDefil = performance.now();
		syAbans = sy;
		ax = lerp(ax, mx, 0.16); ay = lerp(ay, my, 0.16);
		anel.style.transform = `translate(${ax}px, ${ay}px)`;
		segonDefilament(sy, vel);
		dessenharConstellacion(t, sy);
		// Fons a 30 imatges/s : las venas van lentament, l'uelh i ve pas res
		const besonhFons = modeFons !== 3 || sy !== sySimple || forçarFons;
		if (gl && besonhFons && (fotograma++ & 1) === 0) {
			sySimple = sy; forçarFons = false;
			const maxSy = Math.max(1, document.documentElement.scrollHeight - H);
			gl.uniform2f(U.r, fons.width, fons.height);
			gl.uniform1f(U.t, calm ? 12 : (t - t0) / 1000);
			gl.uniform2f(U.m, ax / W, 1 - ay / H);
			gl.uniform1f(U.mo, modeFons);
			gl.uniform1f(U.cl, temaClar ? 1 : 0);
			gl.uniform1f(U.s, sy / H);
			gl.uniform1f(U.p, sy / maxSy);
			// La nuèch se calma quand la carta se forma : las venas dauradas s'escafan
			gl.uniform1f(U.c, aCartaFons);
			gl.uniform1f(U.ro, reliefOK);
			gl.uniform4f(U.g, geoFons[0], geoFons[1], geoFons[2], geoFons[3]);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}
		if (!calm) idRaf = requestAnimationFrame(bocla);
	}
	aplicarTema(opcions.clar, opcions.dalt);
	modeFons = opcions.fons ?? 0;
	idRaf = requestAnimationFrame(bocla);
	// Mòde calm : un imatge fix, redessenhat sonque quand quicòm càmbia
	if (calm) ['scroll', 'resize'].forEach((ev) => addEventListener(ev, () => (idRaf = requestAnimationFrame(bocla)), { passive: true, signal }));

	// Lo primièr acte se revela tre que las poliças son prèstas
	document.fonts.ready.then(() => viu && requestAnimationFrame(() => eros.classList.add('vist')));

	return {
		tema(clar, dalt) {
			aplicarTema(clar, dalt);
			if (calm) idRaf = requestAnimationFrame(bocla);
		},
		fons(n) {
			modeFons = n; forçarFons = true;
			if (calm) idRaf = requestAnimationFrame(bocla);
		},
		destruir() {
			viu = false;
			cancelAnimationFrame(idRaf);
			ac.abort();
			io.disconnect();
			lenis?.destroy();
			doc.classList.remove('cursor-viu');
			gl?.getExtension('WEBGL_lose_context')?.loseContext();
		}
	};
}
