// COPIE d'Efièch 0.1.0 (C:\Users\perie\Depots\Efiech). Ne pas modifier ici : modifier là-bas, puis « node synchroniser.mjs ».
// Le moteur des effets : un canevas posé sur une zone de la page, des pièces
// (le dessin déposé, répété), une apparition qui les fait entrer, un mouvement
// qui les anime ensuite.
//
//   const effet = lancer(zone, { dessins, mouvement, apparition, reglages, couleurs });
//   effet.declencher();   // rejoue l'apparition (réussite d'un jeu…)
//   effet.arreter();      // retire le canevas
//
// Sobriété : un seul canevas, chaque dessin pré-rendu une fois en petite image
// (on ne recalcule pas ses formes à chaque image), la boucle s'arrête quand
// l'onglet est caché ou quand plus rien ne bouge. Respect de
// prefers-reduced-motion : les pièces sont posées à leur place, immobiles.

import { configPropre } from './catalogue.js';
import { FORMES, validerDessin, boiteTrace, boiteDessin } from './dessin.js';
import { MOUV } from './mouvements.js';
import { APPAR } from './apparitions.js';

/** Un tirage au hasard qui se rejoue à l'identique (même graine, mêmes places) */
export function hasard(graine = 7) {
	let g = graine % 2147483647 || 7;
	return () => (g = (g * 16807) % 2147483647) / 2147483647;
}

/**
 * Les places de repos de n pièces dans une zone l × h : une grille légèrement
 * secouée, rangée de gauche à droite et de haut en bas.
 */
export function places(n, l, h, marge, alea) {
	const cols = Math.max(1, Math.round(Math.sqrt((n * l) / Math.max(1, h))));
	const lignes = Math.ceil(n / cols);
	const cl = (l - 2 * marge) / cols;
	const ch = (h - 2 * marge) / lignes;
	const out = [];
	for (let i = 0; i < n; i++) {
		const c = i % cols;
		const li = Math.floor(i / cols);
		out.push([marge + (c + 0.5 + (alea() - 0.5) * 0.7) * cl, marge + (li + 0.5 + (alea() - 0.5) * 0.7) * ch]);
	}
	return out;
}

const reduire = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function cheminDe(t) {
	try {
		return new Path2D(t.d);
	} catch {
		return null;
	}
}

/** Dessine un dessin dans le contexte, ramené à une boîte de côté 1 centrée sur 0 */
function poserDessin(ctx, d, couleur, avance = 1) {
	const [x, y, w, h] = d.boite;
	const k = 1 / Math.max(w, h);
	ctx.save();
	ctx.scale(k, k);
	ctx.translate(-(x + w / 2), -(y + h / 2));
	for (let i = 0; i < d.traces.length; i++) poserTrace(ctx, d.traces[i], d.chemins[i], couleur, avance, d.longueurs?.[i]);
	ctx.restore();
}

function poserTrace(ctx, t, p, couleur, avance = 1, longueur = 0) {
	if (!p) return;
	ctx.save();
	if (t.m) ctx.transform(...t.m);
	const o = t.o ?? 1;
	if (avance < 1) {
		// tracé de la plume : le contour avance, le remplissage vient à la fin
		const L = longueur || 1000;
		ctx.globalAlpha *= o;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = couleur ?? t.s ?? t.f ?? '#000000';
		// au moins un trait et demi de pixel à l'écran, quelle que soit la taille du dessin
		const m = ctx.getTransform();
		const ecran = Math.hypot(m.a, m.b) || 1;
		const mini = (1.6 * Math.min(2, globalThis.devicePixelRatio || 1)) / ecran;
		ctx.lineWidth = Math.max(t.s && t.w ? t.w : 0, mini);
		ctx.setLineDash([L * Math.min(1, avance / 0.75), L + 1]);
		ctx.stroke(p);
		ctx.setLineDash([]);
		const fin = (avance - 0.75) / 0.25;
		if (fin > 0 && t.f) {
			ctx.globalAlpha *= fin;
			ctx.fillStyle = couleur ?? t.f;
			ctx.fill(p, t.r ?? 'nonzero');
		}
		ctx.restore();
		return;
	}
	ctx.globalAlpha *= o;
	if (t.f) {
		ctx.fillStyle = couleur ?? t.f;
		ctx.fill(p, t.r ?? 'nonzero');
	}
	if (t.s && t.w) {
		ctx.strokeStyle = couleur ?? t.s;
		ctx.lineWidth = t.w;
		ctx.stroke(p);
	}
	ctx.restore();
}

/** Longueur d'un tracé, mesurée par le navigateur (pour le tracé de la plume) */
function longueurs(traces) {
	if (typeof document === 'undefined') return traces.map(() => 0);
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('width', '0');
	svg.setAttribute('height', '0');
	svg.style.position = 'absolute';
	svg.style.visibility = 'hidden';
	document.body.appendChild(svg);
	const out = traces.map((t) => {
		try {
			const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			p.setAttribute('d', t.d);
			svg.appendChild(p);
			const L = p.getTotalLength();
			const m = t.m;
			// le déplacement agrandit ou rétrécit le trait : on en tient compte en moyenne
			const k = m ? Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2])) : 1;
			return L * k;
		} catch {
			return 0;
		}
	});
	svg.remove();
	return out;
}

function preparer(dessin) {
	const d = validerDessin(dessin);
	if (!d) return null;
	const b = boiteDessin(d);
	const boite = b ? [b[0], b[1], Math.max(1e-3, b[2] - b[0]), Math.max(1e-3, b[3] - b[1])] : d.vb;
	return { ...d, boite, chemins: d.traces.map(cheminDe), ratio: boite[2] / boite[3] };
}

/**
 * Lance un effet dans une zone de la page.
 * options : {
 *   dessins : [dessin…] (validés par validerDessin ; vide → formes de papier),
 *   mouvement, apparition, reglages, teinte, formes (voir configPropre),
 *   couleurs : ['#rrggbb'…] couleurs du site, pour la teinte « palette » et les formes,
 *   origine : { x, y } point de départ de l'explosion (pixels dans la zone),
 *   pointeur : true pour suivre la souris et le doigt (par défaut),
 *   graine, auFin : fonction appelée quand toutes les pièces sont parties (durée de vie)
 * }
 */
export function lancer(zone, options = {}) {
	const cfg = configPropre(options);
	const R = cfg.reglages;
	const alea = hasard(options.graine ?? 7 + Math.floor(Math.random() * 1e6));
	const couleurs = (options.couleurs ?? []).filter((c) => /^#[0-9a-f]{6}$/i.test(c));
	const fige = options.fige ?? reduire();

	// --- les dessins et leurs images pré-rendues
	let dessins = (options.dessins ?? []).map(preparer).filter(Boolean);
	const papier = Object.values(FORMES).map(preparer);
	const avecPapier = !dessins.length || cfg.formes;
	if (!dessins.length) dessins = papier;
	else if (cfg.formes) dessins = [...dessins, ...papier];
	// les formes de papier prennent toujours les couleurs du site (ou ocre si rien)
	const teintes = couleurs.length ? couleurs : ['#9c5611'];

	const canevas = document.createElement('canvas');
	canevas.setAttribute('aria-hidden', 'true');
	Object.assign(canevas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', display: 'block' });
	if (getComputedStyle(zone).position === 'static') zone.style.position = 'relative';
	zone.appendChild(canevas);
	const ctx = canevas.getContext('2d');
	const dpr = Math.min(2, globalThis.devicePixelRatio || 1);

	let L = zone.clientWidth;
	let H = zone.clientHeight;

	// une image par (dessin, couleur) ; null pour garder les couleurs du dessin
	const images = new Map();
	function imageDe(di, ci) {
		const cle = di + ':' + ci;
		if (images.has(cle)) return images.get(cle);
		const d = dessins[di];
		const cote = Math.ceil(R.taille * (1 + R.variation) * dpr * 1.7);
		const c = document.createElement('canvas');
		const w = d.ratio >= 1 ? cote : Math.ceil(cote * d.ratio);
		const h = d.ratio >= 1 ? Math.ceil(cote / d.ratio) : cote;
		c.width = Math.max(1, w);
		c.height = Math.max(1, h);
		const x = c.getContext('2d');
		x.translate(c.width / 2, c.height / 2);
		x.scale(Math.max(c.width, c.height), Math.max(c.width, c.height));
		poserDessin(x, d, ci < 0 ? null : teintes[ci % teintes.length]);
		const im = { c, w: d.ratio >= 1 ? 1 : d.ratio, h: d.ratio >= 1 ? 1 / d.ratio : 1 };
		images.set(cle, im);
		return im;
	}

	// --- l'état partagé avec les mouvements et les apparitions
	const E = {
		R,
		L,
		H,
		t: 0,
		alea,
		ptr: null,
		origine: options.origine ?? null,
		pieces: [],
		dessins,
		vectoriel: false // l'apparition demande de dessiner les formes une à une (éclatement, plume)
	};

	function creerPieces() {
		E.L = L;
		E.H = H;
		const ap = APPAR[cfg.apparition] ?? APPAR.aucune;
		const n = ap.nombre ? ap.nombre(E) : Math.round(R.nombre);
		const pl = places(n, L, H, R.taille * 0.6, alea);
		E.pieces = [];
		const nbUser = dessins.length - (avecPapier && options.dessins?.length ? papier.length : 0);
		for (let i = 0; i < n; i++) {
			const di = i % dessins.length;
			const estPapier = !options.dessins?.length || di >= nbUser;
			const ci = estPapier || cfg.teinte === 'palette' ? Math.floor(alea() * teintes.length) : -1;
			const s = R.taille * (1 - R.variation / 2 + alea() * R.variation);
			const p = {
				i, di, ci, s,
				x: pl[i][0], y: pl[i][1], hx: pl[i][0], hy: pl[i][1],
				vx: 0, vy: 0, a: (alea() - 0.5) * 0.6, va: 0,
				e: 1, ve: 0, al: 1,
				k: alea(), ph: alea() * Math.PI * 2, dir: alea() * Math.PI * 2,
				age: 0, delai: 0, libre: false, avance: 1, mort: false, fin: 1
			};
			E.pieces.push(p);
		}
		E.vectoriel = false;
		ap.init?.(E);
		if (E.vectoriel && cfg.apparition === 'trace') for (const d of dessins) d.longueurs ??= longueurs(d.traces);
		E.t = 0;
	}

	function dessiner() {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canevas.width, canevas.height);
		for (const p of E.pieces) {
			const al = p.al * p.fin;
			if (al <= 0.002 || p.mort) continue;
			const c = Math.cos(p.a);
			const s = Math.sin(p.a);
			const k = p.e;
			ctx.globalAlpha = Math.min(1, al);
			if (p.trace !== undefined) {
				// une forme du dessin, seule (éclatement)
				const d = dessins[p.di];
				const kk = (p.echelle * k * dpr);
				ctx.setTransform(c * kk, s * kk, -s * kk, c * kk, p.x * dpr, p.y * dpr);
				ctx.translate(-p.cx, -p.cy);
				poserTrace(ctx, d.traces[p.trace], d.chemins[p.trace], p.ci < 0 ? null : teintes[p.ci % teintes.length]);
				continue;
			}
			if (p.avance < 1) {
				const kk = p.s * k * dpr;
				ctx.setTransform(c * kk, s * kk, -s * kk, c * kk, p.x * dpr, p.y * dpr);
				poserDessin(ctx, dessins[p.di], p.ci < 0 ? null : teintes[p.ci % teintes.length], p.avance);
				continue;
			}
			const im = imageDe(p.di, p.ci);
			const kk = p.s * k * dpr;
			const sy = p.sy ?? 1; // écrasement vertical (éclosion), depuis le pied
			ctx.setTransform(c * kk, s * kk, -s * kk * sy, c * kk * sy, p.x * dpr, (p.y + (p.s * k * (1 - sy) * im.h) / 2) * dpr);
			ctx.drawImage(im.c, -im.w / 2, -im.h / 2, im.w, im.h);
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.globalAlpha = 1;
	}

	function dimensionner() {
		L = Math.max(1, zone.clientWidth);
		H = Math.max(1, zone.clientHeight);
		canevas.width = Math.round(L * dpr);
		canevas.height = Math.round(H * dpr);
		E.L = L;
		E.H = H;
	}

	// --- le pointeur (souris, doigt), en pixels dans la zone
	let rect = null;
	const suivre = options.pointeur !== false;
	function auPointeur(ev) {
		rect = zone.getBoundingClientRect();
		const x = ev.clientX - rect.left;
		const y = ev.clientY - rect.top;
		const dedans = x >= -40 && y >= -40 && x <= rect.width + 40 && y <= rect.height + 40;
		if (!dedans) {
			E.ptr = null;
			return;
		}
		const avant = E.ptr;
		const ara = performance.now();
		const dt = avant ? Math.max(8, ara - avant.t) : 16;
		E.ptr = { x, y, vx: avant ? ((x - avant.x) / dt) * 16.7 : 0, vy: avant ? ((y - avant.y) / dt) * 16.7 : 0, t: ara };
		reveiller();
	}
	const quitter = () => (E.ptr = null);

	// --- la boucle
	let anim = 0;
	let dernier = 0;
	let arrete = false;
	let calme = 0;
	function image(ara) {
		anim = 0;
		if (arrete) return;
		const dt = Math.min(0.05, dernier ? (ara - dernier) / 1000 : 1 / 60);
		dernier = ara;
		pas(dt);
		dessiner();
		if (E.ptr && ara - E.ptr.t > 120) {
			E.ptr.vx = 0;
			E.ptr.vy = 0;
		}
		// tout est parti : on s'arrête
		if (E.pieces.length && E.pieces.every((p) => p.mort)) {
			finir();
			return;
		}
		// rien ne bouge (lancer arrêté, gravité posée…) : on dort jusqu'au prochain geste
		const bouge = E.pieces.some((p) => !p.libre || Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.va) + Math.abs(p.ve) > 0.01);
		calme = bouge || E.ptr || MOUV[cfg.mouvement]?.continu ? 0 : calme + dt;
		if (calme > 1.5) return;
		if (!document.hidden) anim = requestAnimationFrame(image);
	}
	function reveiller() {
		calme = 0;
		if (!anim && !arrete && !fige && !document.hidden) {
			dernier = 0;
			anim = requestAnimationFrame(image);
		}
	}

	function pas(dt) {
		E.t += dt;
		const u = dt * 60 * R.vitesse; // « images » à 60 par seconde, à la vitesse choisie
		const ap = APPAR[cfg.apparition] ?? APPAR.aucune;
		const mv = MOUV[cfg.mouvement] ?? MOUV.aucun;
		ap.avant?.(E, dt);
		for (const p of E.pieces) {
			if (p.mort) continue;
			p.age += dt;
			if (!p.libre) {
				if (ap.entree(p, E, dt, u)) {
					p.libre = true;
					p.vie = 0;
					p.hx = p.x;
					p.hy = p.y;
					mv.depart?.(p, E);
				}
				continue;
			}
			p.vie += dt;
			mv.pas(p, E, u, dt);
			if (R.vie > 0 && p.vie > R.vie) {
				p.fin -= dt / 0.8;
				if (p.fin <= 0) p.mort = true;
			}
		}
		mv.groupe?.(E, u, dt);
	}

	function finir() {
		arreter();
		options.auFin?.();
	}

	function arreter() {
		arrete = true;
		if (anim) cancelAnimationFrame(anim);
		anim = 0;
		obs?.disconnect();
		if (suivre) {
			removeEventListener('pointermove', auPointeur);
			removeEventListener('pointerdown', auPointeur);
			document.documentElement.removeEventListener('pointerleave', quitter);
		}
		document.removeEventListener('visibilitychange', auVisible);
		canevas.remove();
	}

	function auVisible() {
		if (!document.hidden) reveiller();
	}

	/** Pose tout de suite chaque pièce à sa place, sans mouvement */
	function poserFige() {
		for (const p of E.pieces) {
			p.x = p.hx;
			p.y = p.hy;
			p.e = 1;
			p.al = 1;
			p.avance = 1;
			p.libre = true;
			delete p.sy;
		}
		APPAR[cfg.apparition]?.fige?.(E);
		dessiner();
		if (R.vie > 0) setTimeout(finir, Math.min(R.vie, 2.5) * 1000);
	}

	dimensionner();
	creerPieces();
	let obs = null;
	if (typeof ResizeObserver === 'function') {
		let premier = true;
		obs = new ResizeObserver(() => {
			if (premier) return void (premier = false);
			const l0 = L;
			const h0 = H;
			dimensionner();
			// les places de repos suivent la zone, en proportion
			for (const p of E.pieces) {
				p.hx *= L / l0;
				p.hy *= H / h0;
				if (fige) {
					p.x = p.hx;
					p.y = p.hy;
				}
			}
			fige ? dessiner() : reveiller();
		});
		obs.observe(zone);
	}
	if (fige) poserFige();
	else {
		if (suivre) {
			addEventListener('pointermove', auPointeur, { passive: true });
			addEventListener('pointerdown', auPointeur, { passive: true });
			document.documentElement.addEventListener('pointerleave', quitter);
		}
		document.addEventListener('visibilitychange', auVisible);
		reveiller();
	}

	return {
		/** rejoue l'apparition depuis le début (pour la réaction : fait réagir toutes les pièces) */
		declencher(origine) {
			if (arrete) return;
			if (origine) E.origine = origine;
			if (cfg.mouvement === 'reaction' && E.pieces.every((p) => p.libre)) {
				for (const p of E.pieces) MOUV.reaction.secouer(p, E);
				reveiller();
				return;
			}
			creerPieces();
			fige ? poserFige() : reveiller();
		},
		arreter,
		get pieces() {
			return E.pieces.length;
		}
	};
}

// pour les tests et l'atelier
export { boiteTrace };
