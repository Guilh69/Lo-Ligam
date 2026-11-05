<script>
	// Poussière d'or (proposition acceptée par Romain le 04-11, réglée le 05-11) :
	// la deuxième façon de regarder les mots sur la page de calme. Des grains
	// d'or dessinent au trait l'objet, le mot en dessous et sa définition ; dès
	// qu'ils sont regroupés, tout devient net.
	//
	// Le mouvement (Romain, 05-11 au soir : « une explosion du mot avec une
	// reconstitution du prochain… qu'on puisse jouer avec l'effet et que ce soit
	// très satisfaisant ») : la molette charge le mot, qui se tend et frémit ;
	// au quatrième cran environ il éclate, et les grains retombent à leur tour,
	// de haut en bas, dans le mot suivant (vers le haut : le précédent). Un clic
	// ou un toucher le fait éclater aussi ; un glissé du doigt vers le haut ou le
	// bas change de mot. La souris ou le doigt remuent la poussière comme une
	// main dans le sable ; chaque grain revient à sa place tenu par un ressort
	// amorti juste ce qu'il faut, sans rebond.
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
	const RESSORT = 130, // raideur : un grain lâché rejoint sa place en un tiers de seconde environ
		SEUIL = 300, // molette : trois crans pour faire éclater le mot
		RAYON = 90, // portée de la main dans la poussière (px)
		ETAL = 0.4; // étalement des retours : du haut du dessin au bas de la définition (s)
	const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
	const ara = () => performance.now() / 1000;
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
		mi = 0, // mot formé (ou en train de se reconstituer)
		centre = [0, 0], // centre du mot formé : l'éclat part de là
		carga = 0, // tension donnée par la molette, de -1 (précédent) à 1 (suivant)
		net = 0, // netteté, dès que les grains sont regroupés
		ecartPrec = 99, // écart moyen des grains à leur place (px), au dernier calcul
		idle = 0,
		preparat = false, // les voisins du mot net sont-ils déjà photographiés ?
		darrierRodeta = -9,
		esclat = -9, // instant du dernier éclat
		tocat = -9, // dernier instant où la main a touché des grains
		garda = 0, // jusqu'à quand la molette est ignorée après un éclat
		tempsAnim = 0,
		main = null, // la souris ou le doigt dans la poussière : { x, y, vx, vy, t }
		tireP = null,
		toc0 = null; // début d'un toucher ou d'un clic : { x, y, t, bouge }

	function placer(i) {
		const P = pointsDe(i);
		for (const q of grans) {
			const L = P[q.g].length ? P[q.g] : P[1].length ? P[1] : P[2];
			const r = L.length ? L[Math.floor(q.r * L.length)] : [W / 2, H / 2];
			q.hx = r[0];
			q.hy = r[1];
		}
		const p = plan(i);
		centre = [W / 2, (p.Y0 + p.linhasD.at(-1).y) / 2];
		ecartPrec = 99; // nouvelles places : les grains doivent s'y rendre avant le repos
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
			// ordre de retour : le dessin d'abord, puis le mot, puis la définition ;
			// dans chaque groupe, de haut en bas (les points sont balayés dans cet ordre)
			const rang = (g === 0 ? 0 : g === 1 ? 0.42 : 0.8) + r * (g === 0 ? 0.42 : g === 1 ? 0.38 : 0.2);
			return {
				g,
				r,
				rang,
				ph: Math.random() * 6.28,
				k: RESSORT * (0.8 + Math.random() * 0.4), // chacun sa raideur : un retour vivant, pas mécanique
				x: Math.random() * W,
				y: Math.random() * H,
				vx: 0,
				vy: 0,
				hx: 0,
				hy: 0,
				act: 0,
				a: 0
			};
		});
	}

	/** Chaque grain rejoint sa place à son tour, de haut en bas. */
	function rappeler(delai) {
		const t = tempsAnim;
		for (const q of grans) q.act = t + delai + q.rang * ETAL;
	}

	/** Le mot éclate ; le suivant (s = 1) ou le précédent (s = -1) se reconstitue. */
	function eclater(s, force = 1) {
		if (!N) return;
		const [cx0, cy0] = centre;
		mi = mod(mi + s);
		placer(mi);
		actual = lista[mi];
		preparat = false;
		carga = 0;
		net = 0;
		idle = 0;
		esclat = tempsAnim;
		garda = tempsAnim + 0.4;
		if (calme) {
			// sans animation : le mot suivant est là tout de suite
			for (const q of grans) {
				q.x = q.hx;
				q.y = q.hy;
				q.vx = q.vy = 0;
				q.act = 0;
			}
			return;
		}
		const tour = (Math.random() < 0.5 ? -1 : 1) * 0.3; // l'éclat tourne un peu, comme un tourbillon
		for (const q of grans) {
			const dx = q.x - cx0,
				dy = q.y - cy0,
				L = Math.hypot(dx, dy) || 1,
				v = force * (60 + Math.pow(Math.random(), 1.4) * 1900), // des lents et des rapides : un nuage plein, sans trou au centre
				a = tour + (Math.random() - 0.5) * 0.9, // un peu de désordre dans la direction
				ux = dx / L,
				uy = dy / L;
			q.vx += (ux * Math.cos(a) - uy * Math.sin(a)) * v;
			q.vy += (ux * Math.sin(a) + uy * Math.cos(a)) * v - s * force * 300; // le mot suivant : la poussière monte
		}
		rappeler(0.24);
	}

	/** Nouvelle liste de mots : à l'ouverture les grains arrivent de partout ;
	 *  ensuite le mot en cours éclate et le premier mot du thème se forme. */
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
			placer(mi);
			actual = lista[mi];
			net = 0;
			if (calme)
				for (const q of grans) {
					q.x = q.hx;
					q.y = q.hy;
				}
			else rappeler(0.1);
		} else {
			mi = N - 1;
			eclater(1, 0.7);
		}
		idle = 0;
	}

	$effect(() => {
		const l = mots;
		untrack(() => cargar(l));
	});

	// Les places changent avec la taille de l'écran ou celle des commandes :
	// on « photographie » à nouveau et chaque grain rejoint la sienne.
	function replaçar() {
		cache.clear();
		plans.clear();
		preparat = false;
		if (grans.length && N) placer(mi);
	}
	$effect(() => {
		void reserva.naut;
		void reserva.bas;
		untrack(replaçar);
	});

	// ── Gestes (appelés par la page) ───────────────────────────────────
	export function rodeta(dy) {
		if (!N) return;
		// Juste après un éclat, l'élan de la molette ne recharge pas. L'inertie d'un pavé
		// tactile dure plus d'une seconde : chaque événement reçu prolonge la garde,
		// jusqu'à 1,2 s au plus (on doit pouvoir enchaîner les mots).
		if (tempsAnim < garda && tempsAnim - esclat < 1.2) {
			garda = tempsAnim + 0.15;
			return;
		}
		darrierRodeta = tempsAnim;
		idle = 0;
		if (carga && Math.sign(dy) !== Math.sign(carga)) carga = 0; // changement de sens : on repart de zéro
		carga = clamp(carga + dy / SEUIL, -1, 1);
		if (Math.abs(carga) >= 1) eclater(Math.sign(carga));
	}
	export function tocar(e) {
		// le bouton droit ou celui du milieu ne fait rien ; un seul doigt à la fois
		// (un appui relâché hors de la fenêtre ne bloque pas plus de deux secondes)
		if (!N || (e.pointerType === 'mouse' && e.button !== 0)) return;
		if (tireP !== null && toc0 && ara() - toc0.t < 2) return;
		tireP = e.pointerId;
		toc0 = { x: e.clientX, y: e.clientY, t: ara(), bouge: false };
		main = { x: e.clientX, y: e.clientY, vx: 0, vy: 0, t: ara() };
		idle = 0;
	}
	export function bolegar(e) {
		const t = ara();
		if (main && t - main.t < 0.12) {
			const d = Math.max(0.008, t - main.t),
				vx = (e.clientX - main.x) / d,
				vy = (e.clientY - main.y) / d;
			main.vx += (vx - main.vx) * 0.5; // vitesse lissée : pas d'à-coup d'un événement à l'autre
			main.vy += (vy - main.vy) * 0.5;
		} else main = { vx: 0, vy: 0 };
		main.x = e.clientX;
		main.y = e.clientY;
		main.t = t;
		if (toc0 && Math.hypot(e.clientX - toc0.x, e.clientY - toc0.y) > 12) toc0.bouge = true;
	}
	export function levar(e) {
		if (tireP === null || (e && e.pointerId !== tireP)) return;
		tireP = null;
		const t0c = toc0;
		toc0 = null;
		if (!t0c || !e || e.type === 'pointercancel') return;
		const dur = ara() - t0c.t,
			dy = e.clientY - t0c.y;
		if (!t0c.bouge && dur < 0.35) eclater(1); // un clic, un toucher : le mot éclate
		else if (Math.abs(dy) > 70 && Math.abs(dy) / Math.max(0.05, dur) > 450) eclater(dy < 0 ? 1 : -1); // glissé vif
	}
	export function tecla(e) {
		if (!N) return;
		const s = e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' ? 1 : e.key === 'ArrowUp' || e.key === 'PageUp' ? -1 : 0;
		if (!s) return;
		e.preventDefault();
		eclater(s);
	}

	// ── Boucle ──────────────────────────────────────────────────────────
	function physique(dt, t, forceMain) {
		const ten = calme ? 0 : Math.abs(carga), // réduire les animations : pas de frémissement
			[cx0, cy0] = centre,
			R2 = RAYON * RAYON;
		let ecart = 0;
		for (const q of grans) {
			if (tempsAnim >= q.act) {
				// tenu à sa place par un ressort amorti juste ce qu'il faut (aucun rebond) ;
				// la tension de la molette écarte un peu le mot et le fait frémir
				let tx = q.hx,
					ty = q.hy;
				if (ten > 0) {
					tx += (q.hx - cx0) * 0.25 * ten + Math.sin(t * 9 + q.ph * 7) * 8 * ten;
					ty += (q.hy - cy0) * 0.25 * ten + Math.cos(t * 7 + q.ph * 5) * 8 * ten;
				}
				const montee = Math.min(1, (tempsAnim - q.act) / 0.3),
					k = q.k * (0.15 + 0.85 * montee * montee),
					c = 2 * Math.sqrt(k);
				q.vx += (k * (tx - q.x) - c * q.vx) * dt;
				q.vy += (k * (ty - q.y) - c * q.vy) * dt;
			} else {
				const fr = Math.exp(-dt * 6); // en vol, l'air freine vite : l'éclat part d'un coup puis flotte
				q.vx *= fr;
				q.vy *= fr;
			}
			if (forceMain) {
				// la main écarte les grains sur son passage et les entraîne un peu, comme un
				// doigt dans le sable ; un grain touché flotte un instant avant de revenir
				const dx = q.x - main.x,
					dy = q.y - main.y,
					d2 = dx * dx + dy * dy;
				if (d2 < R2 && d2 > 0.25) {
					const d = Math.sqrt(d2),
						f = 1 - d / RAYON,
						p = (forceMain * f * f) / d;
					q.vx += (dx * p + main.vx * 1.5 * f) * dt;
					q.vy += (dy * p + main.vy * 1.5 * f) * dt;
					const v = Math.hypot(q.vx, q.vy);
					if (v > 700) {
						// la main ne lance pas les grains au loin : le sillage reste local
						q.vx *= 700 / v;
						q.vy *= 700 / v;
					}
					q.act = Math.max(q.act, tempsAnim + 0.18 + q.r * 0.25);
					tocat = tempsAnim;
				}
			}
			q.x += q.vx * dt;
			q.y += q.vy * dt;
			ecart += Math.abs(q.x - q.hx) + Math.abs(q.y - q.hy);
		}
		return ecart / grans.length;
	}

	function pas(dt, t) {
		tempsAnim += dt;
		idle += dt;
		if (tempsAnim - darrierRodeta > 0.6 && carga) {
			carga *= Math.exp(-dt * 2); // on lâche la molette : la tension retombe seule
			if (Math.abs(carga) < 0.003) carga = 0;
		}
		if (idle > 16 && !pausa && !calme && N > 1) eclater(1, 0.55); // seize secondes sans geste : le mot suivant, en douceur

		const tMain = ara(),
			vMain = main && tMain - main.t < 0.1 ? Math.hypot(main.vx, main.vy) : 0,
			forceMain = calme || vMain < 120 ? 0 : Math.min(1.6, vMain / 500) * 5500; // un curseur lent qui passe ne défait pas le mot
		if (forceMain) idle = 0;

		// au repos (tout est net, rien ne bouge), pas de calcul : chaque grain est à sa place
		const immobile = net >= 1 && ecartPrec < 0.3 && !carga && !forceMain && tireP === null;
		if (!immobile) {
			const n = Math.ceil(dt / 0.017); // petits pas : le ressort reste stable même à 30 images par seconde
			for (let i = 0; i < n; i++) ecartPrec = physique(dt / n, t, forceMain);
		}
		// La netteté vient pendant que les grains se posent, sans attendre le dernier :
		// nulle à 7 px d'écart moyen, entière à 1,5 px. Un geste la défait aussitôt.
		const cible =
			immobile ? 1 : (carga && !calme) || tempsAnim - tocat < 0.2 || tempsAnim - esclat < 0.3 ? 0 : clamp((7 - ecartPrec) / 5.5, 0, 1);
		net = cible > net ? Math.min(cible, net + dt / 0.12) : Math.max(cible, net - dt / 0.07);
		if (net >= 1 && !preparat) {
			// pendant le repos, on photographie déjà les deux voisins : aucun à-coup au premier éclat
			pointsDe(mod(mi + 1));
			pointsDe(mod(mi - 1));
			preparat = true;
		}

		const ten = calme ? 0 : Math.abs(carga);
		cx.clearRect(0, 0, W, H);
		let gCor = -1; // les grains sont rangés par groupe : la couleur ne change que trois fois
		for (const q of grans) {
			if (q.g !== gCor) {
				gCor = q.g;
				cx.fillStyle = gCor === 0 ? AUR : gCor === 1 ? CREMA : DEF;
			}
			const v2 = immobile ? 0 : q.vx * q.vx + q.vy * q.vy,
				base = q.g === 0 ? 0.6 : 0.5,
				va = Math.min(1, base * (1 - net) + (q.g === 0 ? 0.16 : 0.06) * net + Math.min(0.4, Math.sqrt(v2) / 900) + ten * 0.3);
			q.a += (va - q.a) * Math.min(1, dt * 10);
			cx.globalAlpha = q.a;
			const px = q.x + (calme ? 0 : Math.sin(t * 0.8 + q.ph) * 0.4), // respiration
				py = q.y + (calme ? 0 : Math.cos(t * 0.6 + q.ph) * 0.4),
				taille = v2 > 40000 ? 2.2 : 1.7; // un grain lancé brille un peu plus
			cx.fillRect(px, py, taille, taille);
		}
		if (net > 0) {
			// regroupés : le trait, le mot et sa définition deviennent nets
			const p = plan(mi);
			if (p.dess) {
				cx.globalAlpha = net * 0.95;
				cx.strokeStyle = AUR;
				trait(cx, p, 1.3);
			}
			cx.globalAlpha = net;
			cx.fillStyle = CREMA;
			textes(cx, p.linhasW, fontOc(p.fW));
			cx.globalAlpha = net * 0.6;
			cx.fillStyle = AUR;
			cx.fillRect(W / 2 - 18, p.yFilet, 36, 1);
			cx.globalAlpha = net;
			cx.fillStyle = DEF;
			textes(cx, p.linhasD, fontDef(p.fD));
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
		const repaus = net >= 1 && !carga && tireP === null && !(main && ara() - main.t < 0.1);
		if (repaus && now - darrier < 28) return;
		const dt = Math.min(0.05, (now - darrier) / 1000 || 0); // onglet en arrière-plan : on ne rattrape pas
		darrier = now;
		pas(dt, (now - t0) / 1000);
	}

	function talhar(e) {
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
		// au téléphone, la barre d'adresse qui se replie redimensionne en rafale :
		// on ne photographie à nouveau qu'une fois le mouvement fini
		clearTimeout(minutaTalh);
		if (e) minutaTalh = setTimeout(replaçar, 150);
		else replaçar();
	}
	let minutaTalh = 0;

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
			clearTimeout(minutaTalh);
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
