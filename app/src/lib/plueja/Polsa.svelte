<script>
	// Poussière d'or (proposition acceptée par Romain le 04-11, réglée le 05-11) :
	// la deuxième façon de regarder les mots sur la page de calme. Des grains
	// d'or dessinent au trait l'objet, le mot en dessous et sa définition ; au
	// repos tout devient net. Tourner la molette (six crans environ) ou faire
	// glisser le doigt soulève la poussière : chaque grain part à son tour, de
	// haut en bas, et glisse en douceur vers sa place dans le mot suivant, sur le
	// modèle des points de la croix de l'accueil (CaminCrotz). En remontant, on
	// revient. Si on s'arrête en route, le mouvement se termine seul.
	//
	// Sobriété : rien à charger (les dessins sont des chemins de quelques octets),
	// un seul canevas, les points de chaque mot calculés une fois puis gardés.
	import { onMount, untrack } from 'svelte';
	import { dessenhDe } from './dessenhs.js';

	/** mots : [[oc, définition], …] ; pausa arrête l'avance automatique ;
	 *  calme (réduire les animations) : les grains se posent sans voler ;
	 *  reserva : hauteurs prises en haut (en-tête) et en bas (commandes). */
	let { mots = [], pausa = false, calme = false, reserva = { naut: 64, bas: 110 } } = $props();

	const CREMA = '#f7f3ee',
		DEF = '#f1dcb2',
		AUR = '#ffd47f';
	const ETAL = 0.6; // étalement des départs : le dernier grain part quand le premier est à 60 %
	const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
	const sortie = (x) => 1 - Math.pow(1 - x, 3.2); // même esprit que --sortie de l'accueil
	const lisse = (e) => e * e * (3 - 2 * e);
	const fontOc = (px) => `${px}px Limelight, Georgia, serif`;
	const fontDef = (px) => `italic ${px}px "Cormorant Garamond", Georgia, serif`;

	let tela;
	let cx = null,
		dpr = 1,
		W = 1280,
		H = 800;
	let hors, hx; // canevas hors écran où l'on « photographie » le dessin et les textes

	let lista = []; // les mots de l'ambiance en cours (hors réactivité)
	let N = 0;
	const mod = (i) => ((i % N) + N) % N;
	let actual = $state(null); // mot net du moment, pour les lecteurs d'écran

	// ── Mise en page d'un mot ───────────────────────────────────────────
	// Un mot long passe sur deux ou trois lignes équilibrées plutôt que de
	// rapetisser sous le plancher (Limelight reste gros).
	function equilibrar(texte, n, larg) {
		const ms = texte.split(' ');
		if (n === 1 || ms.length < n) return [texte];
		const cibla = larg(texte) / n;
		const linhas = [];
		let cur = [];
		for (const m of ms) {
			if (cur.length && linhas.length < n - 1 && larg([...cur, m].join(' ')) > cibla * 1.05) {
				linhas.push(cur.join(' '));
				cur = [m];
			} else cur.push(m);
		}
		if (cur.length) linhas.push(cur.join(' '));
		return linhas;
	}
	function decopar(texte, font, px, maxW, plancher) {
		const larg = (t) => {
			hx.font = font(px);
			return hx.measureText(t).width;
		};
		for (const n of [1, 2, 3]) {
			const linhas = equilibrar(texte, n, larg);
			const maxL = Math.max(...linhas.map(larg));
			const p = Math.min(px, (px * maxW) / maxL);
			if (p >= plancher || n === 3) return { px: Math.round(p * 10) / 10, linhas };
		}
	}

	const plans = new Map();
	function plan(i) {
		const k = `${i}|${W}x${H}|${reserva.naut}|${reserva.bas}`;
		if (plans.has(k)) return plans.get(k);
		const [oc, def] = lista[i];
		const dess = dessenhDe(oc, def);
		const Hu = Math.max(220, H - reserva.naut - reserva.bas);
		const S = dess ? Math.min(Hu * 0.48, W * 0.6, 420) : 0;
		// Limelight reste gros (Romain : « le mot pourrait être encore un peu plus gros »)
		// un texte trop large passe à la ligne plutôt que de rapetisser (10 à 20 % au plus)
		const fW0 = clamp(22 + W * 0.03, 32, 68),
			fD0 = clamp(14 + W * 0.011, 19, 30);
		const mot = decopar(oc, fontOc, fW0, W - 48, fW0 * 0.8);
		const defi = decopar(def, fontDef, fD0, W - 48, fD0 * 0.9);
		const lhW = mot.px * 1.1,
			lhD = defi.px * 1.25;
		const gap1 = dess ? mot.px * 1.05 : 0;
		const gap2 = defi.px * 1.5;
		const total = S + gap1 + mot.linhas.length * lhW + gap2 + defi.linhas.length * lhD;
		let y = reserva.naut + (Hu - total) / 2;
		const Y0 = y;
		y += S + gap1;
		const linhasW = mot.linhas.map((t, j) => ({ t, y: y + mot.px * 0.82 + j * lhW }));
		y += mot.linhas.length * lhW;
		const yFilet = y + gap2 * 0.4;
		y += gap2;
		const linhasD = defi.linhas.map((t, j) => ({ t, y: y + defi.px * 0.8 + j * lhD }));
		const p = { dess, S, X0: W / 2 - S / 2, Y0, fW: mot.px, fD: defi.px, linhasW, linhasD, yFilet };
		plans.set(k, p);
		return p;
	}

	function trait(c, p, lw) {
		c.save();
		c.translate(p.X0, p.Y0);
		c.scale(p.S / 100, p.S / 100);
		c.lineWidth = (lw * 100) / p.S;
		c.lineCap = 'round';
		c.lineJoin = 'round';
		for (const ch of p.dess) c.stroke(ch);
		c.restore();
	}
	function textes(c, linhas, font) {
		c.font = font;
		c.textAlign = 'center';
		for (const l of linhas) c.fillText(l.t, W / 2, l.y);
	}

	// « Photographie » une zone du canevas hors écran : les pixels encrés
	// deviennent les places possibles des grains, de haut en bas.
	function echant(rect, dessin) {
		const [rx, ry, rw, rh] = rect.map(Math.round);
		if (rw <= 0 || rh <= 0) return [];
		hx.clearRect(rx, ry, rw, rh);
		hx.fillStyle = '#fff';
		hx.strokeStyle = '#fff';
		dessin(hx);
		const d = hx.getImageData(rx, ry, rw, rh).data;
		const pts = [];
		for (let y = 0; y < rh; y += 2) for (let x = 0; x < rw; x += 2) if (d[(y * rw + x) * 4 + 3] > 110) pts.push([rx + x, ry + y]);
		return pts;
	}
	const cache = new Map();
	function pointsDe(i) {
		const k = `${i}|${W}x${H}|${reserva.naut}|${reserva.bas}`;
		if (cache.has(k)) return cache.get(k);
		const p = plan(i);
		const banda = (linhas, px) => [0, linhas[0].y - px * 1.05, W, linhas.at(-1).y - linhas[0].y + px * 1.45];
		const v = [
			p.dess ? echant([p.X0 - 4, p.Y0 - 4, p.S + 8, p.S + 8], (c) => trait(c, p, 2.6)) : [],
			echant(banda(p.linhasW, p.fW), (c) => textes(c, p.linhasW, fontOc(p.fW))),
			echant(banda(p.linhasD, p.fD), (c) => textes(c, p.linhasD, fontDef(p.fD)))
		];
		cache.set(k, v);
		return v;
	}

	// ── Grains ──────────────────────────────────────────────────────────
	let grans = [],
		mi = 0, // mot formé (ou en train de se défaire)
		u = 0, // progression vers le mot voisin, de -1 (précédent) à 1 (suivant), menée par la molette
		dir = 0,
		net = 0, // netteté du rendu au repos
		idle = 0,
		autoVers = 0, // avance seule après une longue inactivité
		arr = 0, // arrivée des grains à l'ouverture
		preparat = false, // les voisins du mot net sont-ils déjà photographiés ?
		darrierRodeta = -9,
		tireP = null,
		py0 = 0,
		pyl = 0,
		u0 = 0;

	function placer(i, c) {
		const P = pointsDe(i);
		for (const q of grans) {
			const L = P[q.g].length ? P[q.g] : P[1].length ? P[1] : P[2];
			const r = L.length ? L[Math.floor(q.r * L.length)] : [W / 2, H / 2];
			q[c + 'x'] = r[0];
			q[c + 'y'] = r[1];
		}
	}

	function crearGrans() {
		const Hu = Math.max(220, H - reserva.naut - reserva.bas);
		const S = Math.min(Hu * 0.48, W * 0.6, 420);
		const n0 = clamp(Math.round((S * S) / 60), 300, 1800),
			n1 = clamp(Math.round(W * 0.75), 300, 900),
			n2 = clamp(Math.round(W * 0.4), 180, 520);
		grans = Array.from({ length: n0 + n1 + n2 }, (_, k) => {
			const g = k < n0 ? 0 : k < n0 + n1 ? 1 : 2;
			const r = Math.random();
			// rang de départ : le dessin d'abord, puis le mot, puis la définition ;
			// dans chaque groupe, de haut en bas (les points sont balayés dans cet ordre)
			const rang = (g === 0 ? 0 : g === 1 ? 0.42 : 0.8) + r * (g === 0 ? 0.42 : g === 1 ? 0.38 : 0.2);
			return { g, r, rang, ox: Math.random() * 2 - 1, ph: Math.random() * 6.28, sx: Math.random() * W, sy: Math.random() * H, ax: 0, ay: 0, tx: 0, ty: 0, x: 0, y: 0, a: 0 };
		});
	}

	/** Nouvelle liste de mots : à l'ouverture les grains arrivent de partout ;
	 *  ensuite ils glissent depuis leur place vers le premier mot du thème. */
	function cargar(l) {
		if (!hx) return;
		lista = l;
		N = l.length;
		cache.clear();
		plans.clear();
		preparat = false;
		if (!N) return;
		if (!grans.length) {
			crearGrans();
			mi = 0;
			placer(mi, 'a');
			u = 0;
			dir = 0;
			net = 0;
			arr = calme ? 1 : 0;
			autoVers = 0;
			actual = lista[mi];
		} else {
			for (const q of grans) {
				q.ax = q.x;
				q.ay = q.y;
			}
			mi = N - 1;
			dir = 1;
			placer(0, 't');
			u = calme ? 1 : 0.001;
			autoVers = 2; // plus vif que l'avance automatique après inactivité
			net = 0;
		}
		idle = 0;
	}

	$effect(() => {
		const l = mots;
		untrack(() => cargar(l));
	});

	// Les places changent avec la taille de l'écran ou celle des commandes :
	// on « photographie » à nouveau et chaque grain retrouve la sienne.
	function replaçar() {
		cache.clear();
		plans.clear();
		preparat = false;
		if (grans.length && N) {
			placer(mi, 'a');
			if (dir !== 0) placer(mod(mi + dir), 't');
		}
	}
	$effect(() => {
		void reserva.naut;
		void reserva.bas;
		untrack(replaçar);
	});

	// ── Gestes (appelés par la page) ───────────────────────────────────
	export function rodeta(dy) {
		if (arr < 1 || !N) return;
		u = clamp(u + dy / 600, -1, 1); // six crans environ pour changer de mot
		darrierRodeta = performance.now() / 1000;
		autoVers = 0;
	}
	export function tocar(e) {
		if (!N) return;
		tireP = e.pointerId;
		py0 = pyl = e.clientY;
		u0 = u;
		autoVers = 0;
	}
	export function bolegar(e) {
		if (tireP !== e.pointerId || arr < 1) return;
		pyl = e.clientY;
		u = clamp(u0 + (py0 - e.clientY) / 380, -1, 1); // le doigt vers le haut : le mot suivant
	}
	export function levar() {
		tireP = null;
	}
	export function tecla(e) {
		if (!N) return;
		const s = e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' ? 1 : e.key === 'ArrowUp' || e.key === 'PageUp' ? -1 : 0;
		if (!s) return;
		e.preventDefault();
		if (u === 0 || Math.sign(u) === s) u = s * Math.max(Math.abs(u), 0.51); // la finition fait le reste
		autoVers = 0;
	}

	// ── Boucle ──────────────────────────────────────────────────────────
	function pas(dt, t) {
		const ara = performance.now() / 1000,
			geste = ara - darrierRodeta < 0.16 || tireP !== null;
		idle += dt;
		if (geste) {
			idle = 0;
			autoVers = 0;
		}
		if (arr < 1) arr = Math.min(1, arr + dt / 1.8);
		else if (!geste) {
			// sans geste : on finit seul, en arrière avant la moitié, en avant après
			const but = autoVers ? dir : Math.abs(u) > 0.5 ? Math.sign(u) : 0,
				k = autoVers === 1 ? 0.8 : autoVers === 2 ? 2 : 3;
			u += (but - u) * (1 - Math.exp(-dt * k));
			if (Math.abs(but - u) < 0.002) u = but;
		}
		if (calme && u !== 0 && Math.abs(u) >= 0.5) u = Math.sign(u); // sans animation : on passe directement
		if (u !== 0 && dir !== Math.sign(u)) {
			dir = Math.sign(u);
			placer(mod(mi + dir), 't');
		}
		if (Math.abs(u) >= 1) {
			mi = mod(mi + dir);
			for (const q of grans) {
				q.ax = q.tx;
				q.ay = q.ty;
			}
			u = 0;
			dir = 0;
			autoVers = 0;
			idle = 0;
			preparat = false;
			actual = lista[mi];
			if (tireP !== null) {
				u0 = 0;
				py0 = pyl;
			}
		}
		if (idle > 16 && u === 0 && !autoVers && !pausa && !calme) {
			autoVers = 1;
			dir = 1;
			placer(mod(mi + 1), 't');
			u = 0.001;
		}
		const pausat = u === 0 && !geste && arr >= 1;
		net = pausat ? Math.min(1, net + dt / 0.8) : Math.max(0, net - dt / 0.25);
		if (pausat && net >= 1 && !preparat) {
			// pendant le repos, on photographie déjà les deux voisins : aucun à-coup au premier cran
			pointsDe(mod(mi + 1));
			pointsDe(mod(mi - 1));
			preparat = true;
		}

		const au = Math.abs(u),
			s = dir || 1,
			ea = lisse(arr),
			nv = net * (1 - Math.min(1, au * 6));
		cx.clearRect(0, 0, W, H);
		let gCor = -1; // les grains sont rangés par groupe : la couleur ne change que trois fois
		for (const q of grans) {
			if (q.g !== gCor) {
				gCor = q.g;
				cx.fillStyle = gCor === 0 ? AUR : gCor === 1 ? CREMA : DEF;
			}
			let px, py;
			if (dir === 0) {
				px = q.ax;
				py = q.ay;
			} else {
				// chaque grain part à son tour (rang), suit une courbe douce et arrive sans à-coup
				const pg = clamp(au * (1 + ETAL) - q.rang * ETAL, 0, 1),
					pe = sortie(pg),
					dx = q.tx - q.ax,
					dy = q.ty - q.ay,
					L = Math.hypot(dx, dy) || 1,
					b = Math.sin(Math.PI * pe),
					amp = q.ox * Math.min(36, L * 0.3);
				px = q.ax + dx * pe + (-dy / L) * amp * b;
				py = q.ay + dy * pe + (dx / L) * amp * b - s * 20 * b;
			}
			if (!calme) {
				px += Math.sin(t * 0.8 + q.ph) * 0.4; // respiration
				py += Math.cos(t * 0.6 + q.ph) * 0.4;
			}
			if (arr < 1) {
				const ei = sortie(clamp(arr * 1.5 - q.rang * 0.5, 0, 1));
				px = q.sx + (px - q.sx) * ei;
				py = q.sy + (py - q.sy) * ei;
			}
			q.x = px;
			q.y = py;
			const base = q.g === 0 ? 0.55 : 0.45,
				va = dir === 0 ? base * (1 - net) + (q.g === 0 ? 0.16 : 0.06) * net : q.g === 0 ? 0.88 : 0.78;
			q.a += (va - q.a) * Math.min(1, dt * 6);
			cx.globalAlpha = q.a * (arr < 1 ? ea * 0.9 + 0.1 : 1);
			cx.fillRect(q.x, q.y, 1.7, 1.7);
		}
		if (nv > 0) {
			// au repos : le trait, le mot et sa définition deviennent nets
			const p = plan(mi);
			cx.save();
			cx.translate(0, -s * au * 24);
			if (p.dess) {
				cx.globalAlpha = nv * 0.95;
				cx.strokeStyle = AUR;
				trait(cx, p, 1.3);
			}
			cx.globalAlpha = nv;
			cx.fillStyle = CREMA;
			textes(cx, p.linhasW, fontOc(p.fW));
			cx.globalAlpha = nv * 0.6;
			cx.fillStyle = AUR;
			cx.fillRect(W / 2 - 18, p.yFilet, 36, 1);
			cx.globalAlpha = nv;
			cx.fillStyle = DEF;
			textes(cx, p.linhasD, fontDef(p.fD));
			cx.restore();
		}
		cx.globalAlpha = 1;
	}

	let raf = 0,
		darrier = 0,
		t0 = 0;
	function tick(now) {
		raf = requestAnimationFrame(tick);
		if (!cx || !N) {
			darrier = now;
			return;
		}
		// Au repos (tout est net, rien ne bouge que la respiration), 30 images par
		// seconde suffisent : moitié moins de travail pour une page de calme.
		const repaus = net >= 1 && u === 0 && tireP === null;
		if (repaus && now - darrier < 28) return;
		const dt = Math.min(0.05, (now - darrier) / 1000 || 0); // onglet en arrière-plan : on ne rattrape pas
		darrier = now;
		pas(dt, (now - t0) / 1000);
	}

	function talhar() {
		W = innerWidth;
		H = innerHeight;
		if (!tela) return;
		dpr = Math.min(devicePixelRatio || 1, 2);
		tela.width = Math.round(W * dpr);
		tela.height = Math.round(H * dpr);
		cx = tela.getContext('2d');
		cx.setTransform(dpr, 0, 0, dpr, 0, 0);
		hors.width = Math.ceil(W);
		hors.height = Math.ceil(H);
		hx.textAlign = 'center';
		replaçar();
	}

	onMount(() => {
		hors = document.createElement('canvas');
		hx = hors.getContext('2d', { willReadFrequently: true });
		talhar();
		addEventListener('resize', talhar);
		let viu = true;
		// les polices doivent être là avant de photographier les textes
		Promise.all([document.fonts.load('40px Limelight'), document.fonts.load('italic 24px "Cormorant Garamond"')])
			.catch(() => {})
			.finally(() => {
				if (!viu) return;
				cargar(mots);
				t0 = darrier = performance.now();
				raf = requestAnimationFrame(tick);
			});
		return () => {
			viu = false;
			cancelAnimationFrame(raf);
			removeEventListener('resize', talhar);
		};
	});
</script>

<canvas bind:this={tela} class="polsa" aria-hidden="true"></canvas>
<!-- Pour les lecteurs d'écran : le mot formé du moment -->
<p class="sr" aria-live="polite">
	{#if actual}<span lang="oc">{actual[0]}</span> : <span lang="fr">{actual[1]}</span>{/if}
</p>

<style>
	.polsa {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
