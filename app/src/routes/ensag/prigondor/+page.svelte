<script>
	// Essai (Romain, 06-11) : « une profondeur artificielle, avec un mouvement
	// qui avance sur les éléments distincts de la photo ». La première version
	// (photo découpée en quatre plans) a été jugée moche : « je veux quelque
	// chose de naturel et discret ». Ici la photo reste entière. Une carte de
	// profondeur (outils/prigondor/carta.py) la déforme de quelques pixels
	// pendant une lente avancée vers chaque mot : l'élément visé reste immobile
	// et net, ce qui est devant glisse un peu plus que ce qui est derrière,
	// comme quand on avance la tête, et une légère mise au point passe d'un
	// élément à l'autre (le principe de « Displacement Map » et « Camera Lens
	// Blur » d'EffectCraft, fait en direct pour garder la page légère).
	// Rendu en WebGL ; sans WebGL, ou en mouvement réduit, la photo reste fixe
	// et les mots passent l'un après l'autre.
	import { onMount } from 'svelte';
	import { PAISATGES, MOTS } from '$lib/paisatges/paisatges.js';

	const CLAUS = ['vila-panorama', 'montanha-valada', 'mon-valentre'];
	const NOMS = ['La vila', 'La montanha', 'Lo pont'];
	const FOTOS = CLAUS.map((c) => PAISATGES.find((p) => p.clau === c));

	// ── réglages, volontairement discrets ──
	const Z0 = 1.06; // léger agrandissement de départ : de la marge pour les glissements
	const PAS_Z = 0.05; // avancée à chaque mot
	const VERS = 0.6; // part du chemin vers le mot pour le centre de la vue
	const LATERAL = 0.07; // glissement selon la profondeur quand la vue se décale
	const POUSSA = 0.18; // les objets proches grossissent un peu plus quand on avance
	const FLOU = 2.2; // flou de mise au point le plus fort, en pixels d'écran
	const T_DEPART = 1500, T_MOU = 5500, T_ARRÈST = 4000, T_TORNAR = 5000;

	let causida = $state(0);
	let pausa = $state(false);
	let calme = $state(false);
	let sensGL = $state(false);
	let vista = $state({ w: 1200, h: 800 });
	let eticeta = $state(null);
	let canvas = $state();
	let imatge = $state(null); // la photo chargée (pour le repli sans WebGL)

	const p = $derived(FOTOS[causida]);
	const srcFoto = (f) => `/apren/paisatges/${f.clau}-${f.amples[f.amples.length - 1]}.webp`;

	let gl = null, loc = {}, texFoto = null, texProf = null;
	let img = { w: 1, h: 1 };
	let carta = null;
	let camins = [];
	let carregat = false;
	let t0 = 0, tPausa = 0, raf = 0, dpr = 1;
	let figat = null; // ?temps=12000 : l'image figée à cet instant (contrôle)
	let redessenhar = true; // en pause ou en mouvement réduit, on ne redessine qu'au besoin

	const ease = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
	const lerp = (a, b, s) => a + (b - a) * s;

	// profondeur (0 loin, 1 proche) d'un point de la photo
	function prof(u, v) {
		if (!carta) return 0.5;
		const x = Math.min(carta.w - 1, Math.max(0, Math.round(u * (carta.w - 1))));
		const y = Math.min(carta.h - 1, Math.max(0, Math.round(v * (carta.h - 1))));
		return carta.data[(y * carta.w + x) * 4] / 255;
	}

	// pixels d'écran par pixel de photo, pour un agrandissement z (photo couvrant l'écran à z = 1)
	const escala = (z) => Math.max(vista.w / img.w, vista.h / img.h) * z;

	// le centre de la vue reste assez loin des bords de la photo
	function borna(c, z) {
		const s = escala(z);
		const hx = Math.min(0.5, vista.w / (2 * img.w * s) + 0.025);
		const hy = Math.min(0.5, vista.h / (2 * img.h * s) + 0.025);
		return [Math.min(Math.max(c[0], hx), 1 - hx), Math.min(Math.max(c[1], hy), 1 - hy)];
	}

	// l'état de la vue au temps t : centre c, agrandissement z, profondeur nette f, mot affiché
	function etat(t) {
		const n = camins.length;
		const arr = [{ c: [0.5, 0.5], z: Z0, f: n ? camins[0].d : 0.5 }];
		camins.forEach((m, i) => {
			const z = Z0 + PAS_Z * (i + 1);
			arr.push({ c: borna([0.5 + (m.u - 0.5) * VERS, 0.5 + (m.v - 0.5) * VERS], z), z, f: m.d });
		});
		const mesclar = (a, b, s) => ({ c: [lerp(a.c[0], b.c[0], s), lerp(a.c[1], b.c[1], s)], z: lerp(a.z, b.z, s), f: lerp(a.f, b.f, s) });
		let r = t % (T_DEPART + n * (T_MOU + T_ARRÈST) + T_TORNAR);
		if (r < T_DEPART) return { ...arr[0], pas: -1 };
		r -= T_DEPART;
		for (let k = 0; k < n; k++) {
			if (r < T_MOU) return { ...mesclar(arr[k], arr[k + 1], ease(r / T_MOU)), pas: -1 };
			r -= T_MOU;
			if (r < T_ARRÈST) {
				// arrêt : on continue d'avancer à peine, le mot apparaît puis s'efface
				const q = arr[k + 1];
				return { ...q, z: q.z + 0.012 * (r / T_ARRÈST), pas: k, op: Math.max(0, Math.min(1, r / 900, (T_ARRÈST - r) / 700)) };
			}
			r -= T_ARRÈST;
		}
		const de = { ...arr[n], z: arr[n].z + 0.012 };
		return { ...mesclar(de, arr[0], ease(Math.min(1, r / T_TORNAR))), pas: -1 };
	}

	// ── WebGL : un rectangle plein écran, la photo lue à travers la carte de profondeur ──
	const VS = 'attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }';
	const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uFoto;
uniform sampler2D uProf;
uniform vec2 uRes;  // taille de l'écran (pixels réels)
uniform vec2 uImg;  // taille de la photo
uniform vec2 uC;    // centre de la vue, dans la photo (0..1)
uniform float uZ;   // agrandissement
uniform vec2 uO;    // glissement selon la profondeur
uniform float uF;   // profondeur nette (celle de l'élément visé)
uniform float uP;   // grossissement en plus des objets proches
uniform float uB;   // flou de mise au point le plus fort (pixels réels)
vec2 mapa(vec2 uv, float d) {
	float k = d - uF;
	return uC + (uv - uC) / (1.0 + uP * k) + uO * k;
}
void main() {
	vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) - 0.5 * uRes;
	float s = max(uRes.x / uImg.x, uRes.y / uImg.y) * uZ;
	vec2 uv = uC + px / (uImg * s);
	float d = texture2D(uProf, uv).r;
	d = texture2D(uProf, mapa(uv, d)).r;
	vec2 q = mapa(uv, d);
	// mise au point : net à la profondeur de l'élément, un peu flou loin de lui
	float r = uB * smoothstep(0.06, 0.45, abs(d - uF)) / s;
	vec2 e = r / uImg;
	vec4 c = texture2D(uFoto, q) * 0.2;
	c += texture2D(uFoto, q + e * vec2(1.0, 0.0)) * 0.1;
	c += texture2D(uFoto, q + e * vec2(-1.0, 0.0)) * 0.1;
	c += texture2D(uFoto, q + e * vec2(0.0, 1.0)) * 0.1;
	c += texture2D(uFoto, q + e * vec2(0.0, -1.0)) * 0.1;
	c += texture2D(uFoto, q + e * vec2(0.7, 0.7)) * 0.1;
	c += texture2D(uFoto, q + e * vec2(-0.7, 0.7)) * 0.1;
	c += texture2D(uFoto, q + e * vec2(0.7, -0.7)) * 0.1;
	c += texture2D(uFoto, q + e * vec2(-0.7, -0.7)) * 0.1;
	gl_FragColor = vec4(c.rgb, 1.0);
}`;

	function programa() {
		const sh = (tipe, src) => {
			const o = gl.createShader(tipe);
			gl.shaderSource(o, src);
			gl.compileShader(o);
			return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null;
		};
		const v = sh(gl.VERTEX_SHADER, VS), f = sh(gl.FRAGMENT_SHADER, FS);
		if (!v || !f) return false;
		const pr = gl.createProgram();
		gl.attachShader(pr, v);
		gl.attachShader(pr, f);
		gl.linkProgram(pr);
		if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false;
		gl.useProgram(pr);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		const a = gl.getAttribLocation(pr, 'p');
		gl.enableVertexAttribArray(a);
		gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
		for (const n of ['uRes', 'uImg', 'uC', 'uZ', 'uO', 'uF', 'uP', 'uB']) loc[n] = gl.getUniformLocation(pr, n);
		gl.uniform1i(gl.getUniformLocation(pr, 'uFoto'), 0);
		gl.uniform1i(gl.getUniformLocation(pr, 'uProf'), 1);
		texFoto = gl.createTexture();
		texProf = gl.createTexture();
		return true;
	}

	function texturar(tex, unitat, im) {
		gl.activeTexture(gl.TEXTURE0 + unitat);
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}

	function dessenhar(e, t) {
		const viu = !calme;
		const tau = 2 * Math.PI;
		// la vue « respire » à peine pendant les arrêts : l'image ne fige pas
		const o = viu
			? [(e.c[0] - 0.5) * LATERAL + Math.sin((t / 7000) * tau) * 0.0025, (e.c[1] - 0.5) * LATERAL + Math.cos((t / 9000) * tau) * 0.0015]
			: [0, 0];
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.uniform2f(loc.uRes, canvas.width, canvas.height);
		gl.uniform2f(loc.uImg, img.w, img.h);
		gl.uniform2f(loc.uC, e.c[0], e.c[1]);
		gl.uniform1f(loc.uZ, e.z);
		gl.uniform2f(loc.uO, o[0], o[1]);
		gl.uniform1f(loc.uF, e.f);
		gl.uniform1f(loc.uP, viu ? POUSSA * (e.z - Z0) : 0);
		gl.uniform1f(loc.uB, viu ? FLOU * dpr : 0);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	function pintar(t) {
		if (!carregat) return;
		if (figat !== null) t = figat;
		const n = camins.length;
		let e;
		if (calme || sensGL) {
			// photo fixe ; les mots passent l'un après l'autre
			const r = t % 4500;
			e = { c: [0.5, 0.5], z: sensGL ? 1 : Z0, f: 0.5, pas: n ? Math.floor(t / 4500) % n : -1, op: Math.max(0, Math.min(1, r / 600, (4500 - r) / 600)) };
		} else e = etat(t);
		// on ne redessine que si l'image change : pas en pause, pas en mouvement réduit
		const viu = !calme && !pausa && figat === null;
		if (!sensGL && gl && (viu || redessenhar)) {
			dessenhar(e, t);
			redessenhar = false;
		}
		if (e.pas >= 0) {
			const m = camins[e.pas];
			const s = escala(e.z);
			// le mot reste dans l'écran, sous la barre du haut
			const x = Math.max(60, Math.min(vista.w - 60, vista.w / 2 + (m.u - e.c[0]) * img.w * s));
			const y = Math.max(110, Math.min(vista.h - 110, vista.h / 2 + (m.v - e.c[1]) * img.h * s));
			const op = figat !== null ? 1 : e.op;
			if (!eticeta || eticeta.oc !== m.oc) eticeta = { oc: m.oc, fr: MOTS[m.oc], x, y, op, esquerra: x > vista.w * 0.62 };
			else Object.assign(eticeta, { x, y, op });
		} else if (eticeta) eticeta = null;
	}

	function anim(ara) {
		raf = requestAnimationFrame(anim);
		if (!carregat) return;
		if (pausa && !tPausa) tPausa = ara - t0;
		pintar(pausa ? tPausa : ara - t0);
	}

	const cargar = (src) =>
		new Promise((ok, ko) => {
			const i = new Image();
			i.onload = () => ok(i);
			i.onerror = ko;
			i.src = src;
		});

	async function cargarFoto(n) {
		carregat = false;
		eticeta = null;
		const f = FOTOS[n];
		let fi, ci;
		try {
			[fi, ci] = await Promise.all([cargar(srcFoto(f)), cargar(`/ensag/prigondor/${f.clau}-prigondor.png`).catch(() => null)]);
		} catch {
			return; // photo introuvable : l'écran reste sombre, rien ne casse
		}
		if (n !== causida) return;
		if (!ci) sensGL = true; // sans carte de profondeur : la photo fixe
		img = { w: fi.naturalWidth, h: fi.naturalHeight };
		imatge = fi.src;
		carta = null;
		if (ci) {
			const cv = document.createElement('canvas');
			cv.width = ci.width;
			cv.height = ci.height;
			const x = cv.getContext('2d', { willReadFrequently: true });
			x.drawImage(ci, 0, 0);
			carta = { w: cv.width, h: cv.height, data: x.getImageData(0, 0, cv.width, cv.height).data };
		}
		// du plus proche au plus lointain : on avance dans la photo
		camins = f.mots.map(([oc, u, v]) => ({ oc, u, v, d: prof(u, v) })).sort((a, b) => b.d - a.d || b.v - a.v);
		if (gl && !sensGL) {
			texturar(texFoto, 0, fi);
			texturar(texProf, 1, ci);
		}
		redessenhar = true;
		t0 = performance.now();
		tPausa = 0;
		carregat = true;
		if (figat !== null) setTimeout(() => pintar(figat), 50);
	}

	function mida() {
		vista = { w: innerWidth, h: innerHeight };
		dpr = Math.min(2, devicePixelRatio || 1);
		if (canvas) {
			canvas.width = Math.round(vista.w * dpr);
			canvas.height = Math.round(vista.h * dpr);
		}
		redessenhar = true;
		if (carregat) pintar(pausa ? tPausa : performance.now() - t0);
	}

	onMount(() => {
		const mq = matchMedia('(prefers-reduced-motion: reduce)');
		calme = mq.matches;
		const quand = (e) => {
			calme = e.matches;
			redessenhar = true;
		};
		mq.addEventListener('change', quand);
		const q = new URLSearchParams(location.search);
		if (q.has('temps')) figat = Number(q.get('temps')) || 0;
		if (q.has('foto')) causida = Math.max(0, Math.min(FOTOS.length - 1, Number(q.get('foto')) || 0));
		// la mémoire de l'image n'est gardée que pour les captures de contrôle
		gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: figat !== null });
		if (!gl || !programa()) sensGL = true;
		// le téléphone peut reprendre la mémoire graphique : on passe à la photo fixe
		const perdut = (e) => {
			e.preventDefault();
			sensGL = true;
		};
		canvas.addEventListener('webglcontextlost', perdut);
		mida();
		addEventListener('resize', mida);
		cargarFoto(causida);
		raf = requestAnimationFrame(anim);
		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('resize', mida);
			mq.removeEventListener('change', quand);
			canvas.removeEventListener('webglcontextlost', perdut);
			gl?.getExtension('WEBGL_lose_context')?.loseContext();
		};
	});

	function causir(n) {
		if (n === causida) return;
		causida = n;
		cargarFoto(n);
	}
	function bascularPausa() {
		if (pausa) {
			t0 = performance.now() - tPausa;
			tPausa = 0;
		}
		pausa = !pausa;
		redessenhar = true;
	}
</script>

<svelte:head>
	<title>Profondeur (essai) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="espaci">
	<div class="tela" role="img" aria-label={p.alt}>
		<canvas class="tela" class:amagat={sensGL} bind:this={canvas} aria-hidden="true"></canvas>
		{#if sensGL && imatge}
			<img class="repli" src={imatge} alt="" />
		{/if}
	</div>

	{#if eticeta}
		<div class="eticeta" class:esquerra={eticeta.esquerra} style:left="{eticeta.x}px" style:top="{eticeta.y}px" style:opacity={eticeta.op}>
			<span class="punt" aria-hidden="true"></span>
			<span class="tros">
				<span class="nom" lang="oc">{eticeta.oc}</span>
				<span class="def" lang="fr">{eticeta.fr}</span>
			</span>
		</div>
	{/if}

	<header class="barra">
		<a class="tornar" href="/apren/remira">‹ Remira</a>
		<p class="titol">Profondeur <span>(essai)</span></p>
		<div class="fotos" role="group" aria-label="Photo">
			{#each FOTOS as f, n (f.clau)}
				<button type="button" aria-pressed={n === causida} onclick={() => causir(n)} lang="oc">{NOMS[n]}</button>
			{/each}
		</div>
		<div class="accions">
			<button type="button" onclick={bascularPausa}>{pausa ? 'Reprendre' : 'Pause'}</button>
		</div>
	</header>
	<p class="sr" aria-live="polite">{#if eticeta}<span lang="oc">{eticeta.oc}</span> : <span lang="fr">{eticeta.fr}</span>{/if}</p>
</main>

<style>
	.espaci {
		position: fixed;
		inset: 0;
		z-index: 10;
		overflow: hidden;
		background: #22100a;
		container-type: inline-size;
		color: #f7f3ee;
	}
	.tela,
	.repli {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	.repli {
		object-fit: cover;
	}
	.amagat {
		display: none;
	}
	.barra {
		position: absolute;
		inset: 0 0 auto;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1.5rem;
		padding: 0.75rem clamp(0.75rem, 3vw, 2rem);
		background: linear-gradient(rgba(20, 10, 6, 0.72), rgba(20, 10, 6, 0));
	}
	.tornar {
		color: #f7f3ee;
		text-decoration: none;
	}
	.titol {
		margin: 0;
		font-weight: 700;
	}
	.titol span {
		font-weight: 400;
		opacity: 0.75;
	}
	.fotos,
	.accions {
		display: flex;
		gap: 0 1rem;
	}
	.accions {
		margin-inline-start: auto;
	}
	button {
		min-height: 2.75rem;
		padding: 0.3rem 0;
		border: none;
		border-bottom: 2px solid rgba(247, 243, 238, 0.3);
		background: none;
		font: inherit;
		color: #f7f3ee;
		cursor: pointer;
	}
	button[aria-pressed='true'] {
		border-bottom-color: #ffd47f;
		font-weight: 600;
	}
	/* téléphone : la barre tient sur deux lignes et laisse voir la photo */
	@container (max-width: 34rem) {
		.titol {
			display: none;
		}
		.barra {
			gap: 0 1rem;
			padding-block: 0.4rem;
		}
	}
	button:focus-visible,
	.tornar:focus-visible {
		outline: 3px solid #ffd47f;
		outline-offset: 2px;
	}

	/* le mot, posé sur l'élément : un point, la tuile, le français dessous ; il apparaît en fondu */
	.eticeta {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		translate: -0.45rem -50%;
		pointer-events: none;
	}
	.eticeta.esquerra {
		flex-direction: row-reverse;
		translate: calc(-100% + 0.45rem) -50%;
	}
	.punt {
		flex: none;
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 50%;
		border: 1.5px solid #ffd47f;
		box-shadow: 0 0 0 1.5px rgba(4, 9, 11, 0.5);
	}
	.tros {
		display: grid;
		justify-items: start;
		gap: 0.2rem;
		white-space: nowrap; /* le mot ne se coupe jamais en deux lignes */
	}
	.esquerra .tros {
		justify-items: end;
	}
	.nom {
		padding: 0.15em 0.55em;
		border-radius: 0.1em;
		background: #efe1c6;
		color: #2a1a10;
		font-size: clamp(1.2rem, 2.4vw, 1.8rem);
		font-weight: 700;
		line-height: 1.25;
	}
	.def {
		padding: 0.1em 0.5em;
		border-radius: 0.1em;
		background: rgba(8, 15, 17, 0.72);
		font-size: clamp(0.9rem, 1.6vw, 1.1rem);
		font-style: italic;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
</style>
