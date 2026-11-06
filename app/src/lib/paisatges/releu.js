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

const VS = 'attribute vec2 p; varying vec2 vUv; void main() { vUv = vec2(0.5 + 0.5 * p.x, 0.5 - 0.5 * p.y); gl_Position = vec4(p, 0.0, 1.0); }';
const FS = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uFoto;
uniform sampler2D uProf;
uniform vec2 uO;   // décalage pour un écart de profondeur de 1 (part de la photo)
uniform float uP;  // grossissement en plus du proche
uniform float uF;  // profondeur fixe
uniform float uM;  // marge
vec2 mapa(vec2 uv, float d) {
	float k = d - uF;
	vec2 m = 0.5 + (uv - 0.5) / (1.0 + uP * k) - uO * k;
	return 0.5 + (m - 0.5) * uM;
}
void main() {
	float d = texture2D(uProf, vUv).r;
	d = texture2D(uProf, mapa(vUv, d)).r;
	gl_FragColor = vec4(texture2D(uFoto, mapa(vUv, d)).rgb, 1.0);
}`;

/** Le moteur WebGL d'un canevas, ou null si le navigateur ne sait pas. */
function motor(cv) {
	// l'image dessinée est gardée : on ne redessine que quand le relief bouge, et les captures la voient
	const gl = cv.getContext('webgl', { antialias: false, alpha: false, depth: false, preserveDrawingBuffer: true, powerPreference: 'low-power' });
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
	for (const n of ['uO', 'uP', 'uF', 'uM']) loc[n] = gl.getUniformLocation(pr, n);
	gl.uniform1i(gl.getUniformLocation(pr, 'uFoto'), 0);
	gl.uniform1i(gl.getUniformLocation(pr, 'uProf'), 1);
	gl.uniform1f(loc.uF, FIX);
	gl.uniform1f(loc.uM, MARGE);
	const texturar = (unitat, im) => {
		gl.activeTexture(gl.TEXTURE0 + unitat);
		gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	};
	return {
		max: gl.getParameter(gl.MAX_TEXTURE_SIZE),
		texturas(foto, carta) {
			texturar(0, foto);
			texturar(1, carta);
		},
		dessenhar({ O, P }) {
			gl.viewport(0, 0, cv.width, cv.height);
			gl.uniform2f(loc.uO, O[0], O[1]);
			gl.uniform1f(loc.uP, P);
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
 * Pose le relief sur un canevas placé par-dessus la photo, dans le même cadre
 * qui glisse. estat() rend { a, w, h, du, dv } : l'animation du glissement
 * (aller-retour adouci), la photo à l'écran et le glissement, ou null.
 * ponches() rend les éléments à déplacer avec leur objet : [[élément, x, y]].
 * Rend la fonction qui arrête tout. Le canevas reste invisible tant qu'il n'a
 * rien dessiné : dessous, la même photo, agrandie de la même marge.
 */
export function relevar(cv, { clau, img, estat, ponches = () => [] }) {
	const m = motor(cv);
	if (!m) return () => {};
	let viu = true,
		raf = 0,
		prof = null,
		darrier = '',
		ara = null; // les réglages dessinés
	const remetre = () => {
		for (const [el] of ponches()) {
			el.style.transform = '';
			delete el.dataset.rel;
		}
	};
	const perdut = (e) => {
		e.preventDefault();
		arrestar();
		cv.style.display = 'none';
		cv.parentElement?.classList.remove('releu'); // la photo de dessous reprend sa taille (Joan, 06-11)
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
		if (!e) return;
		const p = e.a?.effect?.getComputedTiming().progress ?? 0.5;
		const r = Math.min(devicePixelRatio || 1, 1.5);
		const lw = Math.min(Math.round(e.w * r), m.max, 4096),
			lh = Math.min(Math.round(e.h * r), m.max, 4096);
		const rg = reglatges(p, e.du, e.dv, e.w, e.h);
		// redessiner seulement quand quelque chose a bougé d'un dixième de pixel
		const clau2 = [lw, lh, Math.round(rg.O[0] * e.w * 10), Math.round(rg.O[1] * e.h * 10), Math.round(rg.P * e.w * 10)].join();
		if (clau2 !== darrier) {
			darrier = clau2;
			ara = { rg, w: e.w, h: e.h };
			if (cv.width !== lw || cv.height !== lh) {
				cv.width = lw;
				cv.height = lh;
			}
			m.dessenhar(rg);
			cv.style.opacity = '1';
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
			m.texturas(img, carta);
			prof = lectorProf(carta);
			pas();
		})
		.catch(() => {}); // pas de carte : la photo, sans relief
	return () => {
		arrestar();
		cv.removeEventListener('webglcontextlost', perdut);
		m.destruir();
	};
}
