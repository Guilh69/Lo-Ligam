// Relèu : l'option « relief » de Remira › Paisatges (Romain, 06-11 : l'essai
// « Profondeur » lui plaît ; « il faut le mettre en option et d'abord dans un
// sas de validation »). La photo reste entière ; sa carte de profondeur
// (outils/prigondor/carta.py, 4 à 6 Ko) la déforme de quelques pixels en WebGL :
// pendant le glissement, ce qui est proche bouge à peine plus que le fond.
//
// Le sas : chaque photo passe d'abord dans Triar (/admin/triar, lot « releu »).
// Seules les photos gardées d'un cœur ont le relief sur le site : leurs clés
// vont dans GARDATS, recopiées depuis `node scripts/triar.mjs --lot releu --gardats`.
// Sans WebGL, sans carte, si le téléphone reprend la mémoire graphique, ou si
// l'appareil demande moins d'animation : la photo, sans relief.

/** Les photos dont Romain a gardé le relief dans Triar (clés de paisatges.js). */
export const GARDATS = new Set([]);

/** La carte de profondeur d'une photo (proche = clair). */
export const cartaDe = (clau) => `/apren/paisatges/prigondor/${clau}.webp`;

// Réglages : discret (Romain, 06-11 : « naturel et discret »)
/** La photo est agrandie de 2 % sous le relief : ses bords ne s'étirent jamais. */
export const MARGE = 0.98;
const LATERAL = 0.05; // décalage pour un écart de profondeur de 1, en part du glissement…
const MAX_O = 0.012; // … borné à 1,2 % de la photo (avec POUSSA, tout reste dans la marge)
const POUSSA = 0.01; // le proche grossit un peu plus que le fond, aux deux bouts du glissement
const FIX = 0.45; // la profondeur qui suit exactement la photo

/**
 * Le décalage à un moment du glissement. p : la progression (0 à 1, adoucie)
 * de l'aller-retour ; du, dv : le glissement en pixels ; w, h : la photo à l'écran.
 */
export function reglatges(p, du, dv, w, h) {
	const borna = (x) => Math.max(-MAX_O, Math.min(MAX_O, x));
	return {
		O: [borna((-LATERAL * (p - 0.5) * du) / w), borna((-LATERAL * (p - 0.5) * dv) / h)],
		P: POUSSA * (2 * p - 1)
	};
}

/** Ce que montre le canevas en u (0 à 1, sur un axe) : le point de la photo pris, comme le shader. */
export function font(u, d, o, P) {
	const k = d - FIX;
	return 0.5 + (0.5 + (u - 0.5) / (1 + P * k) - o * k - 0.5) * MARGE;
}

/** Où un point de la photo (x, y de 0 à 1, profondeur d) se retrouve, en pixels de plus. */
export function desplaçament(x, y, d, { O, P }, w, h) {
	const k = d - FIX;
	const ont = (u, o) => 0.5 + (0.5 + (u - 0.5) / MARGE - 0.5 + o * k) * (1 + P * k);
	return [(ont(x, O[0]) - x) * w, (ont(y, O[1]) - y) * h];
}

const VS = 'attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }';
const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uFoto;
uniform sampler2D uProf;
uniform vec2 uO;   // décalage pour un écart de profondeur de 1 (part de la photo)
uniform float uP;  // grossissement en plus du proche
uniform float uF;  // profondeur fixe
uniform float uM;  // marge
uniform vec2 uPix; // le canevas, en pixels réels
uniform vec2 uRes; // le canevas, en pixels CSS (la boîte visible)
uniform vec2 uW;   // le cadre de la photo (pixels CSS)
uniform vec2 uT;   // son déplacement…
uniform float uS;  // … et son grossissement (autour de son milieu), comme l'animation CSS
vec2 mapa(vec2 uv, float d) {
	float k = d - uF;
	vec2 m = 0.5 + (uv - 0.5) / (1.0 + uP * k) - uO * k;
	return 0.5 + (m - 0.5) * uM;
}
void main() {
	vec2 X = vec2(gl_FragCoord.x, uPix.y - gl_FragCoord.y) / uPix * uRes;
	vec2 C = 0.5 * uW;
	vec2 uv = (C + (X - uT - C) / uS) / uW;
	float d = texture2D(uProf, uv).r;
	d = texture2D(uProf, mapa(uv, d)).r;
	gl_FragColor = vec4(texture2D(uFoto, mapa(uv, d)).rgb, 1.0);
}`;

/** Le moteur WebGL d'un canevas, ou null si le navigateur ne sait pas. */
function motor(cv) {
	const gl = cv.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' });
	if (!gl) return null;
	const sh = (tipe, src) => {
		const o = gl.createShader(tipe);
		gl.shaderSource(o, src);
		gl.compileShader(o);
		return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null;
	};
	const v = sh(gl.VERTEX_SHADER, VS),
		f = sh(gl.FRAGMENT_SHADER, FS);
	if (!v || !f) return null;
	const pr = gl.createProgram();
	gl.attachShader(pr, v);
	gl.attachShader(pr, f);
	gl.linkProgram(pr);
	if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
	gl.useProgram(pr);
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
	const a = gl.getAttribLocation(pr, 'p');
	gl.enableVertexAttribArray(a);
	gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
	const loc = {};
	for (const n of ['uO', 'uP', 'uF', 'uM', 'uPix', 'uRes', 'uW', 'uT', 'uS']) loc[n] = gl.getUniformLocation(pr, n);
	gl.uniform1i(gl.getUniformLocation(pr, 'uFoto'), 0);
	gl.uniform1i(gl.getUniformLocation(pr, 'uProf'), 1);
	gl.uniform1f(loc.uF, FIX);
	gl.uniform1f(loc.uM, MARGE);
	const tex = [gl.createTexture(), gl.createTexture()]; // la photo, la carte (réutilisées si la taille change)
	const texturar = (unitat, im) => {
		gl.activeTexture(gl.TEXTURE0 + unitat);
		gl.bindTexture(gl.TEXTURE_2D, tex[unitat]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	};
	return {
		max: gl.getParameter(gl.MAX_TEXTURE_SIZE),
		foto: (im) => texturar(0, im),
		carta: (im) => texturar(1, im),
		dessenhar({ O, P }, e, T, S) {
			gl.viewport(0, 0, cv.width, cv.height);
			gl.uniform2f(loc.uO, O[0], O[1]);
			gl.uniform1f(loc.uP, P);
			gl.uniform2f(loc.uPix, cv.width, cv.height);
			gl.uniform2f(loc.uRes, e.W, e.H);
			gl.uniform2f(loc.uW, e.w, e.h);
			gl.uniform2f(loc.uT, T[0], T[1]);
			gl.uniform1f(loc.uS, S);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		},
		destruir() {
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		}
	};
}

/** Lire la profondeur d'un point (pour que les points d'or suivent leur objet). */
function lectorProf(im) {
	const c = document.createElement('canvas');
	c.width = im.naturalWidth;
	c.height = im.naturalHeight;
	const x = c.getContext('2d', { willReadFrequently: true });
	x.drawImage(im, 0, 0);
	const { data } = x.getImageData(0, 0, c.width, c.height);
	return (u, v) => {
		const i = Math.min(c.height - 1, Math.max(0, Math.round(v * (c.height - 1)))) * c.width;
		return data[(i + Math.min(c.width - 1, Math.max(0, Math.round(u * (c.width - 1))))) * 4] / 255;
	};
}

/**
 * La photo à la taille où elle paraît, une fois pour toutes : sans cela, une
 * photo plus grande que l'écran scintille quand elle glisse d'une fraction de
 * pixel (la mer de « calanca », Romain, 06-11).
 */
function aLaTalha(img, lw, lh) {
	const c = document.createElement('canvas');
	c.width = lw;
	c.height = lh;
	const x = c.getContext('2d');
	x.imageSmoothingQuality = 'high';
	x.drawImage(img, 0, 0, lw, lh);
	return c;
}

/**
 * Pose le relief sur un canevas qui couvre la boîte visible, sous le cadre qui
 * glisse (où restent la photo, cachée une fois le relief prêt, et les points).
 * Le canevas calcule lui-même le glissement, à chaque image, comme l'essai
 * « Profondeur », et déplace le cadre à la même image : l'animation du cadre
 * ne sert plus que d'horloge (sa cible est retirée). Firefox, quand le cadre
 * glissait de son côté, n'affichait plus le canevas que toutes les deux ou
 * trois secondes, d'où des à-coups (Romain, 06-11, trois fois ; filmé à
 * l'écran : 170 images figées sur 200, aucune une fois le cadre déplacé ici).
 * estat() rend { a, w, h, t0, t1, s1, W, H } ou null : l'animation CSS du cadre
 * (aller-retour adouci, d'un déplacement t0 à t1 et d'un grossissement 1 à s1
 * autour de son milieu), le cadre (w, h) et la boîte visible (W, H).
 * ponches() rend les éléments à déplacer avec leur objet : [[élément, x, y]].
 * Rend la fonction qui arrête tout. À l'arrêt (pause, point ouvert), rien
 * n'est redessiné.
 */
export function relevar(cv, { clau, img, estat, ponches = () => [] }) {
	const m = motor(cv);
	if (!m) return () => {};
	let viu = true,
		raf = 0,
		prof = null,
		darrier = '',
		talhaFoto = '',
		ara = null; // les réglages dessinés
	// l'animation du cadre devient une horloge : le cadre suit le canevas
	let pres = null; // { a, q, t } : l'animation, son cadre, sa transformation d'avant
	const prendre = (a) => {
		if (!a?.effect?.target || pres?.a === a) return;
		rendre();
		pres = { a, q: a.effect.target, t: a.effect.target.style.transform };
		a.effect.target = null;
	};
	function rendre() {
		if (!pres) return;
		if (pres.a.playState !== 'idle') pres.a.effect.target = pres.q;
		pres.q.style.transform = pres.t;
		pres = null;
	}
	const remetre = () => {
		rendre();
		for (const [el] of ponches()) {
			el.style.transform = '';
			delete el.dataset.rel;
		}
		img.style.opacity = '';
	};
	// mémoire graphique reprise : la photo revient, à sa taille
	const perdut = (e) => {
		e.preventDefault();
		arrestar();
		cv.style.display = 'none';
		img.style.scale = '1';
	};
	cv.addEventListener('webglcontextlost', perdut);
	function arrestar() {
		viu = false;
		cancelAnimationFrame(raf);
		remetre();
	}
	function pas() {
		if (!viu) return;
		raf = requestAnimationFrame(pas);
		const e = estat();
		if (!e || !e.W || !e.H) return;
		const p = e.a?.effect?.getComputedTiming().progress ?? 0.5;
		const r = Math.min(devicePixelRatio || 1, 1.5);
		const lw = Math.min(Math.round(e.W * r), m.max, 4096),
			lh = Math.min(Math.round(e.H * r), m.max, 4096);
		const clau2 = `${lw}x${lh} ${e.w}x${e.h} ${p}`;
		if (clau2 !== darrier) {
			darrier = clau2;
			const T = [e.t0[0] + (e.t1[0] - e.t0[0]) * p, e.t0[1] + (e.t1[1] - e.t0[1]) * p];
			const S = 1 + (e.s1 - 1) * p;
			const rg = reglatges(p, e.t0[0] - e.t1[0], e.t0[1] - e.t1[1], e.w, e.h);
			ara = { rg, w: e.w, h: e.h };
			if (cv.width !== lw || cv.height !== lh) {
				cv.width = lw;
				cv.height = lh;
			}
			// la photo à la taille où elle paraît (jamais plus grande que l'originale)
			const k = Math.min((e.w * r * e.s1) / img.naturalWidth, 1, m.max / img.naturalWidth, m.max / img.naturalHeight);
			const tw = Math.round(img.naturalWidth * k),
				th = Math.round(img.naturalHeight * k);
			if (`${tw}x${th}` !== talhaFoto) {
				talhaFoto = `${tw}x${th}`;
				m.foto(aLaTalha(img, tw, th));
			}
			m.dessenhar(rg, e, T, S);
			prendre(e.a);
			if (pres) pres.q.style.transform = `translate(${T[0]}px, ${T[1]}px) scale(${S})`;
			if (cv.style.opacity !== '1') {
				cv.style.opacity = '1'; // d'un coup : il est sous la photo
				img.style.transition = 'opacity 0.6s ease';
				img.style.opacity = '0'; // la photo du cadre s'efface sur le relief, identique
			}
		}
		// les points (et le mot qui vient de paraître) suivent leur objet
		for (const [el, x, y] of ponches()) {
			if (el.dataset.rel === darrier) continue;
			el.dataset.rel = darrier;
			const [dx, dy] = desplaçament(x, y, prof(x, y), ara.rg, ara.w, ara.h);
			el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
		}
	}
	const carta = new Image();
	carta.src = cartaDe(clau);
	Promise.all([img.decode(), carta.decode()])
		.then(() => {
			if (!viu) return;
			m.carta(carta);
			prof = lectorProf(carta);
			pas();
		})
		.catch(() => {}); // pas de carte : la photo, sans relief
	return () => {
		arrestar();
		img.style.scale = '';
		cv.removeEventListener('webglcontextlost', perdut);
		m.destruir();
	};
}
