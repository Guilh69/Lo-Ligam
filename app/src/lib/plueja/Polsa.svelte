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
	import { dessenhDe, dessenhGuida, ANIMACIONS } from './dessenhs.js';

	/** mots : [[oc, définition, id, dessin, langue], …] (les deux derniers pour
	 *  l'explication de première visite : un dessin à elle, la langue choisie) ;
	 *  pausa arrête l'avance automatique ;
	 *  calme (réduire les animations) : les grains se posent sans voler ;
	 *  reserva : hauteurs prises en haut (en-tête) et en bas (commandes) ;
	 *  boucla : après le dernier mot, revenir au premier (sinon onfin est appelé,
	 *  c'est l'explication qui se termine) ;
	 *  clau : nom de la liste ; une liste du même nom qui change (la langue)
	 *  se reforme sur place, sans éclat ni retour au début. */
	let {
		mots = [],
		pausa = false,
		calme = false,
		reserva = { naut: 64, bas: 110 },
		boucla = true,
		onfin = null,
		clau = null
	} = $props();

	const CREMA = '#f7f3ee',
		DEF = '#f1dcb2',
		AUR = '#ffd47f';
	const RESSORT = 160, // raideur : un grain lâché rejoint sa place en un tiers de seconde environ
		SEUIL = 300, // molette : trois crans pour faire éclater le mot
		RAYON = 90, // portée de la main dans la poussière (px)
		ETAL = 0.4, // étalement des retours : du haut du dessin au bas de la définition (s)
		COURANT = 1500, // force des courants qui font tourbillonner la poussière en vol (px/s²)
		K1 = 0.021, // tourbillons d'environ 300 px…
		K2 = 0.037; // … et d'environ 170 px, inclinés, pour casser toute régularité
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
		const [oc, def, , clauDess, lg] = lista[i];
		const dess = clauDess ? dessenhGuida(clauDess) : dessenhDe(oc, def);
		const dir = lg === 'ar' ? 'rtl' : 'ltr'; // l'arabe de l'explication ; les mots et leurs définitions restent de gauche à droite
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
		const p = { dess, dir, S, X0: W / 2 - S / 2, Y0, fW: mot.px, fD: defi.px, linhasW, linhasD, yFilet };
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
	function textes(c, linhas, font, dir = 'ltr') {
		c.font = font;
		c.textAlign = 'center';
		c.direction = dir; // sinon le canevas suit la page : en arabe, le « ! » final passerait à gauche
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
			echant(banda(p.linhasW, p.fW), (c) => textes(c, p.linhasW, fontOc(p.fW), p.dir)),
			echant(banda(p.linhasD, p.fD), (c) => textes(c, p.linhasD, fontDef(p.fD), p.dir))
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
		pose = [0, 0, 0], // part des grains posés à leur place, par groupe : dessin, mot, définition
		netG = [0, 0, 0], // netteté de chaque groupe : le dessin, puis le mot, puis la définition
		comptes = [1, 1, 1], // nombre de grains de chaque groupe
		fase = [0, 0, 0, 0], // dessin des courants, tiré à chaque éclat
		silenci = 0, // images au repos déjà dessinées : au-delà, on ne redessine plus rien
		idle = 0,
		preparat = false, // les voisins du mot net sont-ils déjà photographiés ?
		darrierRodeta = -9,
		esclat = -9, // instant du dernier éclat
		tocat = [-9, -9, -9], // dernier instant où la main a touché des grains, par groupe
		garda = 0, // jusqu'à quand la molette est ignorée après un éclat
		tempsAnim = 0,
		main = null, // la souris ou le doigt dans la poussière : { x, y, vx, vy, t }
		tireP = null,
		toc0 = null; // début d'un toucher ou d'un clic : { x, y, t, bouge }

	// ── Petites animations (Romain, 05-11 : « le tonnerre, faire qu'on sent qu'il
	// y a un tonnerre ») : une seule fois par mot, quand il vient d'être net, puis
	// la page retrouve son repos. Réglages par mot dans ANIMACIONS (dessenhs.js).
	let anim = null, // { a : réglages, t0 : début, acum : gouttes ou flocons à faire naître }
		animFacha = false, // l'animation de ce mot a déjà été lancée
		particulas = [], // gouttes, flocons, filets de vent, petites étoiles
		darrierGest = -9; // dernier geste (molette, clic, toucher, touche)
	const MAX_PART = 80,
		sx = [0, 0, 0], // tremblement de chaque groupe : le dessin entier, le texte un peu
		sy = [0, 0, 0];
	const alea = (a, b) => a + Math.random() * (b - a);

	function lancarAnim() {
		animFacha = true;
		const [oc, , , clauDess] = lista[mi] ?? [];
		const a = !clauDess && !calme && ANIMACIONS[oc];
		if (!a) return;
		anim = { a, t0: tempsAnim, acum: 0.7 };
		// au téléphone, on sent aussi le tonnerre ; seulement juste après un geste
		// (une vibration sans geste surprendrait)
		if (a.vibrar && tempsAnim - darrierGest < 5 && navigator.userActivation?.hasBeenActive !== false)
			try {
				navigator.vibrate?.(a.vibrar);
			} catch {
				/* l'appareil ne vibre pas : tant pis */
			}
	}
	function arrestarAnim() {
		anim = null;
		animFacha = false;
		particulas.length = 0;
		sx.fill(0);
		sy.fill(0);
	}

	/** Une goutte, un flocon, un filet de vent ou une petite étoile, dans le carré du dessin. */
	function naisser(a, p, k) {
		const X = (x) => p.X0 + (x * p.S) / 100,
			Y = (y) => p.Y0 + (y * p.S) / 100;
		if (a.pluja) {
			const e = a.pluja,
				vy = e.v * k * alea(0.85, 1.15);
			return {
				t: 'p',
				age: 0,
				x: X(alea(e.zona[0], e.zona[1])),
				y: Y(e.zona[2] + alea(0, 4)),
				vy,
				vx: vy * (e.biais ?? 0),
				g: (e.gravetat ?? 0) * k,
				creis: e.gravetat ? 0.55 : 0, // la goutte qui pend grossit avant de tomber
				long: e.long * k,
				fins: Y(e.fins)
			};
		}
		if (a.neu) {
			const e = a.neu;
			return { t: 'n', age: 0, x0: X(alea(e.zona[0], e.zona[1])), x: 0, y: Y(e.zona[2]), vy: e.v * k * alea(0.7, 1.3), ph: alea(0, 6.28), amp: alea(4, 10) * k, s: alea(1.2, 2.1), fins: Y(e.fins ?? 100) };
		}
		if (a.vent) {
			const e = a.vent;
			return { t: 'v', age: 0, x: X(-12) - alea(0, 30) * k, y: Y(alea(26, 80)), vx: e.v * k * alea(0.8, 1.25), len: alea(16, 30) * (p.S / 100), ph: alea(0, 6.28), x1: X(112) };
		}
		// petites étoiles autour du dessin
		const ang = alea(0, 6.28),
			r = alea(38, 50);
		return { t: 'b', age: 0, x: X(50 + Math.cos(ang) * r), y: Y(50 + Math.sin(ang) * r), vida: alea(0.7, 1.1), s: alea(3, 5) * (p.S / 100) };
	}

	/** Avance l'animation du mot ; rend la lueur de l'éclair (0 à 1) et règle le tremblement. */
	function avancarAnim(dt, p) {
		const { a } = anim,
			ta = tempsAnim - anim.t0,
			k = p.S / 300; // réglages donnés pour un dessin de 300 px
		const em = a.pluja || a.neu || a.vent || a.belugas;
		if (em && ta < a.dur) {
			anim.acum += em.n * dt;
			while (anim.acum >= 1 && particulas.length < MAX_PART) {
				anim.acum--;
				particulas.push(naisser(a, p, k));
			}
			anim.acum = Math.min(anim.acum, 1);
		}
		for (let i = particulas.length - 1; i >= 0; i--) {
			const q = particulas[i];
			q.age += dt;
			let fin = false;
			if (q.t === 'p') {
				if (q.age > q.creis) {
					q.vy += q.g * dt;
					q.x += q.vx * dt;
					q.y += q.vy * dt;
				}
				fin = q.y > q.fins;
			} else if (q.t === 'n') {
				q.y += q.vy * dt;
				q.x = q.x0 + Math.sin(q.age * 1.5 + q.ph) * q.amp; // le flocon se balance en descendant
				fin = q.y > q.fins;
			} else if (q.t === 'v') {
				q.x += q.vx * dt;
				fin = q.x - q.len > q.x1;
			} else fin = q.age > q.vida;
			if (fin) particulas.splice(i, 1);
		}
		// le tremblement : le grondement enfle vite et s'éteint lentement ; le froid,
		// la cigale ou le réveil frémissent d'un bout à l'autre
		let ox = 0,
			oy = 0;
		const tr = a.tremol;
		if (tr && ta >= tr.t[0] && ta <= tr.t[1]) {
			const u = (ta - tr.t[0]) / (tr.t[1] - tr.t[0]),
				env = tr.gronh ? Math.pow(Math.sin(Math.PI * Math.pow(u, 0.6)), 1.5) * (0.75 + 0.25 * Math.sin(ta * 17)) : Math.min(1, u * 8, (1 - u) * 5),
				w = 2 * Math.PI * tr.f * ta,
				amp = tr.a * clamp(k, 0.7, 1.3) * env;
			ox = (amp * (Math.sin(w) + 0.5 * Math.sin(w * 1.73 + 1.3))) / 1.5;
			oy = amp * 0.6 * Math.sin(w * 1.31 + 2.1);
		}
		sx[0] = ox;
		sy[0] = oy;
		sx[1] = sx[2] = ox * 0.4;
		sy[1] = sy[2] = oy * 0.4;
		// l'éclair s'allume d'un coup et s'éteint en un cinquième de seconde
		let eclat = 0;
		if (a.flash) for (const tf of a.flash) if (ta >= tf) eclat = Math.max(eclat, Math.exp(-(ta - tf) / 0.07));
		const finit = ta > a.dur && !particulas.length && (!tr || ta > tr.t[1]) && eclat < 0.01;
		if (finit) {
			anim = null;
			sx.fill(0);
			sy.fill(0);
		}
		return eclat;
	}

	function dessenharParticulas(p) {
		const k = p.S / 300;
		cx.strokeStyle = AUR;
		cx.fillStyle = AUR;
		cx.lineWidth = 1.3;
		cx.lineCap = 'round';
		for (const q of particulas) {
			if (q.t === 'p') {
				const f = clamp((q.fins - q.y) / (14 * k), 0, 1); // la goutte s'efface en arrivant
				if (q.long) {
					const v = Math.hypot(q.vx, q.vy) || 1;
					cx.globalAlpha = 0.75 * f * clamp(q.age / 0.06, 0, 1);
					cx.beginPath();
					cx.moveTo(q.x - (q.vx / v) * q.long, q.y - (q.vy / v) * q.long);
					cx.lineTo(q.x, q.y);
					cx.stroke();
				} else {
					cx.globalAlpha = 0.85 * f;
					cx.beginPath();
					cx.arc(q.x, q.y, 2.2 * k * Math.min(1, 0.3 + q.age / (q.creis || 1)), 0, 6.283);
					cx.fill();
				}
			} else if (q.t === 'n') {
				cx.globalAlpha = 0.85 * clamp(q.age / 0.4, 0, 1) * clamp((q.fins - q.y) / (14 * k), 0, 1);
				cx.beginPath();
				cx.arc(q.x, q.y, q.s, 0, 6.283);
				cx.fill();
			} else if (q.t === 'v') {
				// un filet d'air ondule et s'efface aux deux bouts
				cx.beginPath();
				for (let j = 0; j <= 8; j++) {
					const xx = q.x - (q.len * j) / 8,
						yy = q.y + Math.sin(xx * 0.03 + q.ph) * 3 * k;
					if (j) cx.lineTo(xx, yy);
					else cx.moveTo(xx, yy);
				}
				const x0 = p.X0 - 0.12 * p.S;
				cx.globalAlpha = 0.5 * Math.sin(Math.PI * clamp((q.x - q.len / 2 - x0) / (q.x1 - x0), 0, 1));
				cx.stroke();
			} else {
				const e = Math.sin((Math.PI * q.age) / q.vida),
					s = q.s * e;
				cx.globalAlpha = 0.9 * e;
				cx.beginPath();
				cx.moveTo(q.x - s, q.y);
				cx.lineTo(q.x + s, q.y);
				cx.moveTo(q.x, q.y - s);
				cx.lineTo(q.x, q.y + s);
				cx.stroke();
			}
		}
	}

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
		// des grains fins et nombreux : une poussière, pas des confettis
		const n0 = clamp(Math.round((S * S) / 36), 500, 2600),
			n1 = clamp(Math.round(W * 1.2), 500, 1300),
			n2 = clamp(Math.round(W * 0.65), 300, 800);
		comptes = [n0, n1, n2];
		fase = fase.map(() => Math.random() * 6.28);
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
				s: 0.75 + Math.random() * 0.6, // taille (px) : chacun la sienne
				d: 99, // écart à sa place (px)
				m: 0.35, // durée de la montée du ressort (s)
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
		for (const q of grans) {
			q.act = t + delai + q.rang * ETAL;
			q.m = 0.35; // après un éclat, le retour démarre en douceur
		}
	}

	/** Le mot éclate ; le suivant (s = 1) ou le précédent (s = -1) se reconstitue. */
	function eclater(s, force = 1) {
		if (!N) return;
		const [cx0, cy0] = centre;
		if (boucla) mi = mod(mi + s);
		else {
			// l'explication : pas de retour en arrière avant le début, et après la
			// dernière étape c'est la page qui charge les mots (leur éclat suit)
			if (mi + s >= N) {
				idle = 0; // l'avance automatique ne rappelle pas onfin à chaque image
				onfin?.();
				return;
			}
			if (mi + s < 0) return;
			mi += s;
		}
		placer(mi);
		actual = lista[mi];
		preparat = false;
		carga = 0;
		net = 0;
		netG.fill(0);
		arrestarAnim();
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
		fase = fase.map(() => Math.random() * 6.28); // chaque éclat a ses propres courants
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
	let pret = false, // polices chargées : on peut « photographier » les textes
		clauAnciana = null;
	function cargar(l) {
		if (!hx || !pret) return;
		arrestarAnim();
		const memaLista = clau !== null && clau === clauAnciana && grans.length && N && l.length === N;
		clauAnciana = clau;
		if (memaLista) {
			// la même liste dans une autre langue : le mot du moment se reforme sur place
			lista = l;
			cache.clear();
			plans.clear();
			preparat = false;
			net = 0;
			netG.fill(0);
			silenci = 0;
			idle = 0;
			placer(mi);
			actual = lista[mi];
			return;
		}
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
			netG.fill(0);
			if (calme)
				for (const q of grans) {
					q.x = q.hx;
					q.y = q.hy;
				}
			else rappeler(0.1);
		} else {
			mi = -1; // le premier mot de la nouvelle liste
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
		darrierRodeta = darrierGest = tempsAnim;
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
		darrierGest = tempsAnim;
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
		darrierGest = tempsAnim;
		eclater(s);
	}

	// ── Boucle ──────────────────────────────────────────────────────────
	function physique(dt, t, forceMain) {
		const ten = calme ? 0 : Math.abs(carga), // réduire les animations : pas de frémissement
			[cx0, cy0] = centre,
			R2 = RAYON * RAYON,
			[p0, p1, p2, p3] = fase,
			// les courants sont forts juste après un éclat, puis s'apaisent : la main ne fait
			// qu'un sillage léger, le dessin revient vite
			vigor = Math.max(0.15, 1 - (tempsAnim - esclat) / 1.6);
		let ecart = 0;
		const proches = [0, 0, 0];
		for (const q of grans) {
			let libre = 1; // part des courants : entière en vol, elle s'efface pendant le retour
			if (tempsAnim >= q.act) {
				// tenu à sa place par un ressort amorti juste ce qu'il faut (aucun rebond) ;
				// la tension de la molette écarte un peu le mot et le fait frémir
				let tx = q.hx,
					ty = q.hy;
				if (ten > 0) {
					tx += (q.hx - cx0) * 0.25 * ten + Math.sin(t * 9 + q.ph * 7) * 8 * ten;
					ty += (q.hy - cy0) * 0.25 * ten + Math.cos(t * 7 + q.ph * 5) * 8 * ten;
				}
				const montee = Math.min(1, (tempsAnim - q.act) / q.m),
					k = q.k * (0.15 + 0.85 * montee * montee),
					c = 2 * Math.sqrt(k);
				q.vx += (k * (tx - q.x) - c * q.vx) * dt;
				q.vy += (k * (ty - q.y) - c * q.vy) * dt;
				libre = (1 - montee) * (1 - montee);
			} else {
				const fr = Math.exp(-dt * 6); // en vol, l'air freine vite : l'éclat part d'un coup puis flotte
				q.vx *= fr;
				q.vy *= fr;
			}
			if (libre > 0.01 && !calme) {
				// Courants : deux couches de tourbillons doux qui dérivent lentement (un champ
				// sans source ni puits, la poussière s'enroule sans s'entasser) ; le retour
				// suit donc des chemins courbes, jamais des lignes droites.
				const a = K1 * q.x + p0 + t * 0.6,
					b = K1 * q.y + p1 - t * 0.45,
					u = K2 * (0.8 * q.x + 0.6 * q.y) + p2 - t * 0.5,
					w = K2 * (0.8 * q.y - 0.6 * q.x) + p3 + t * 0.35,
					vu = Math.sin(u) * Math.cos(w),
					vw = -Math.cos(u) * Math.sin(w),
					f = COURANT * vigor * libre * dt;
				q.vx += (Math.sin(a) * Math.cos(b) + 0.6 * (0.8 * vu - 0.6 * vw)) * f;
				q.vy += (-Math.cos(a) * Math.sin(b) + 0.6 * (0.6 * vu + 0.8 * vw)) * f;
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
					q.vx += (dx * p + main.vx * 0.9 * f) * dt;
					q.vy += (dy * p + main.vy * 0.9 * f) * dt;
					const v = Math.hypot(q.vx, q.vy);
					if (v > 500) {
						// la main ne lance pas les grains au loin : le sillage reste local
						q.vx *= 500 / v;
						q.vy *= 500 / v;
					}
					q.act = Math.max(q.act, tempsAnim + 0.06 + q.r * 0.14);
					q.m = 0.15; // écarté par la main : il revient plus vite qu'après un éclat
					tocat[q.g] = tempsAnim;
				}
			}
			q.x += q.vx * dt;
			q.y += q.vy * dt;
			q.d = Math.abs(q.x - q.hx) + Math.abs(q.y - q.hy);
			ecart += q.d;
			if (q.d < 2.5) proches[q.g]++;
		}
		for (let g = 0; g < 3; g++) pose[g] = proches[g] / comptes[g];
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
		// La netteté vient pendant que les grains se posent : elle commence quand six
		// sur dix sont à leur place, elle est entière à 95 sur 100 ; les derniers arrivés
		// s'effacent (voir plus bas), on ne voit jamais de poussière à côté du mot net.
		// Un geste la défait aussitôt.
		// Chaque groupe devient net à son tour, comme il se reforme : le dessin, le mot, la définition.
		// La main ne défait que le groupe qu'elle touche : le reste reste net.
		const bloc = (carga && !calme) || tempsAnim - esclat < 0.3;
		for (let g = 0; g < 3; g++) {
			const c = immobile ? 1 : bloc || tempsAnim - tocat[g] < 0.2 ? 0 : clamp((pose[g] - 0.6) / 0.35, 0, 1);
			netG[g] = c > netG[g] ? Math.min(c, netG[g] + dt / 0.12) : Math.max(c, netG[g] - dt / 0.07);
		}
		net = Math.min(netG[0], netG[1], netG[2]);
		if (net >= 1 && !preparat) {
			// pendant le repos, on photographie déjà les deux voisins : aucun à-coup au premier éclat
			pointsDe(mod(mi + 1));
			pointsDe(mod(mi - 1));
			preparat = true;
		}
		if (net >= 1 && !animFacha) lancarAnim();
		if (calme && anim) arrestarAnim();
		const pA = anim ? plan(mi) : null,
			eclat = anim ? avancarAnim(dt, pA) : 0;

		const ten = calme ? 0 : Math.abs(carga);
		cx.clearRect(0, 0, W, H);
		let gCor = -1; // les grains sont rangés par groupe : la couleur ne change que trois fois
		for (const q of grans) {
			if (q.g !== gCor) {
				gCor = q.g;
				cx.fillStyle = gCor === 0 ? AUR : gCor === 1 ? CREMA : DEF;
			}
			const nq = netG[q.g],
				v2 = immobile ? 0 : q.vx * q.vx + q.vy * q.vy,
				base = q.g === 0 ? 0.75 : 0.6,
				// en vol, l'or scintille doucement ; posé, le grain se fond sous le trait net
				scint = calme || nq >= 1 ? 1 : 0.78 + 0.3 * Math.sin(t * 4 + q.ph * 13),
				poussa = (base + Math.min(0.35, Math.sqrt(v2) / 1000)) * (1 - nq) * scint + ten * 0.3,
				// un grain encore en route quand le mot devient net s'efface au lieu de traîner à côté
				va = Math.min(1, poussa + (q.d < 2.5 ? (q.g === 0 ? 0.09 : 0.05) * nq : 0));
			q.a += (va - q.a) * Math.min(1, dt * 10);
			cx.globalAlpha = q.a;
			const px = q.x + sx[q.g] + (calme ? 0 : Math.sin(t * 0.8 + q.ph) * 0.4), // respiration
				py = q.y + sy[q.g] + (calme ? 0 : Math.cos(t * 0.6 + q.ph) * 0.4),
				taille = v2 > 40000 ? q.s + 0.35 : q.s; // un grain lancé brille un peu plus
			cx.fillRect(px, py, taille, taille);
		}
		if (netG[0] + netG[1] + netG[2] > 0) {
			// regroupés : le trait, le mot et sa définition deviennent nets, chacun à son tour
			const p = plan(mi);
			const trem = sx[0] || sy[0];
			if (trem) {
				cx.save();
				cx.translate(sx[0], sy[0]);
			}
			if (p.dess && netG[0] > 0) {
				cx.globalAlpha = netG[0] * 0.95;
				cx.strokeStyle = AUR;
				trait(cx, p, 1.3);
				if (eclat > 0.01) {
					// sous l'éclair, le dessin s'illumine
					cx.globalAlpha = eclat * 0.9;
					cx.strokeStyle = '#fff6e2';
					trait(cx, p, 2);
				}
			}
			if (trem) cx.translate(sx[1] - sx[0], sy[1] - sy[0]);
			if (netG[1] > 0) {
				cx.globalAlpha = netG[1];
				cx.fillStyle = CREMA;
				textes(cx, p.linhasW, fontOc(p.fW), p.dir);
			}
			if (netG[2] > 0) {
				cx.globalAlpha = netG[2] * 0.6;
				cx.fillStyle = AUR;
				cx.fillRect(W / 2 - 18, p.yFilet, 36, 1);
				cx.globalAlpha = netG[2];
				cx.fillStyle = DEF;
				textes(cx, p.linhasD, fontDef(p.fD), p.dir);
			}
			if (trem) cx.restore();
		}
		if (particulas.length) dessenharParticulas(pA ?? plan(mi));
		if (eclat > 0.01) {
			// la lueur de l'éclair : tout le ciel s'éclaire un instant, plus fort autour du
			// dessin ; deux éclairs au plus, à plus d'un quart de seconde (sous le seuil
			// de trois flashs par seconde)
			const yc = pA.Y0 + pA.S * 0.45,
				g = cx.createRadialGradient(W / 2, yc, 0, W / 2, yc, Math.max(W, H) * 0.75);
			g.addColorStop(0, 'rgba(255,242,218,0.28)');
			g.addColorStop(1, 'rgba(255,242,218,0.07)');
			cx.globalAlpha = eclat;
			cx.fillStyle = g;
			cx.fillRect(0, 0, W, H);
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
		const repaus = net >= 1 && ecartPrec < 0.3 && !carga && tireP === null && !anim && !(main && ara() - main.t < 0.1);
		if (repaus && now - darrier < 28) return;
		const dt = Math.min(0.05, (now - darrier) / 1000 || 0); // onglet en arrière-plan : on ne rattrape pas
		darrier = now;
		if (repaus && silenci > 20) {
			// tout est net et posé depuis un instant : l'image reste telle quelle, plus aucun
			// dessin ni calcul ; seul compte le temps, pour passer au mot suivant
			tempsAnim += dt;
			idle += dt;
			if (idle > 16 && !pausa && !calme && N > 1) eclater(1, 0.55);
			return;
		}
		silenci = repaus ? silenci + 1 : 0;
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
		silenci = 0; // le canevas vient d'être vidé : il faut le redessiner
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
				pret = true;
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
	{#if actual}<span lang={actual[4] ?? 'oc'}>{actual[0]}</span> : <span lang={actual[4] ?? 'fr'}>{actual[1]}</span>{/if}
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
