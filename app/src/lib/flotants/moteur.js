// Le moteur des flotteurs (page d'essai /ensag/flotants, 2026-11-07, idée de Romain : des petits
// éléments qui se baladent sur le fond, qu'on fait virevolter, et qu'on peut attraper).
//
// Apesanteur : chaque pièce dérive dans sa direction (qui tourne très lentement), presque sans
// frottement ; elle rebondit sur les bords de la zone et, si on le demande, sur les autres pièces.
// Une main (souris ou doigt) qui passe l'emporte dans son sens et l'écarte ; l'élan se perd
// doucement et la pièce retrouve sa vitesse de croisière. On peut aussi l'attraper : elle
// s'arrête, grossit, laisse voir ce qu'elle cache, puis déguerpit hors de la zone ; plus tard
// elle revient par un bord.
//
// Les positions sont tenues ici (centre de la pièce, en pixels dans la zone) et posées par
// transform : aucune mise en page à chaque image. La boucle s'arrête quand l'onglet est caché.

export function flotter(zone, elements, options = {}) {
	const o = {
		rayon: 95, // portée de la main à la souris
		rayonDoigt: 115,
		radial: 1.4, // à quel point la main écarte
		transfert: 0.12, // à quel point la main emporte dans son sens
		vmax: 5,
		croisiere: [0.1, 0.3], // vitesse de dérive, pixels par image à 60 images par seconde
		collisions: false,
		tenue: 1900, // combien de temps une pièce attrapée reste là, en ms
		retour: [3500, 6500], // au bout de combien de temps elle revient, en ms
		echelle: 1.7, // de combien elle grossit quand on l'attrape
		immobile: false, // juste placer les pièces (appareil qui demande moins d'animations)
		onAttrape: null,
		onLache: null,
		...options
	};
	let L = zone.clientWidth;
	let H = zone.clientHeight;
	let graine = 17;
	const alea = () => (graine = (graine * 16807) % 2147483647) / 2147483647;
	const entre = (a, b) => a + alea() * (b - a);

	const pieces = elements.map((el, i) => {
		const cr = entre(o.croisiere[0], o.croisiere[1]);
		const ang = alea() * Math.PI * 2;
		const w = el.offsetWidth;
		const h = el.offsetHeight;
		const r = (Math.max(w, h) / 2) * 0.9;
		const p = {
			el, i, w, h, r,
			etat: 'libre', // libre, attrape, fuite, absent
			dedans: true, // pour les bords : pas de rebond tant qu'une pièce revenante est encore dehors
			x: r + alea() * Math.max(1, L - 2 * r),
			y: r + alea() * Math.max(1, H - 2 * r),
			vx: Math.cos(ang) * cr, vy: Math.sin(ang) * cr,
			cr, ang, dang: (alea() - 0.5) * 0.004, // sa vitesse de croisière et son changement de cap
			rot: alea() * 360, vr: 0, spin: (0.8 + alea() * 2.6) * (alea() < 0.5 ? -1 : 1), // degrés par seconde
			s: 1, sc: 1, // échelle actuelle et visée
			minuteur: 0
		};
		el.style.position = 'absolute';
		el.style.left = '0';
		el.style.top = '0';
		el.style.willChange = 'transform';
		return p;
	});

	const poser = (p) => {
		p.el.style.transform = `translate(${(p.x - p.w / 2).toFixed(1)}px, ${(p.y - p.h / 2).toFixed(1)}px) rotate(${p.rot.toFixed(1)}deg) scale(${p.s.toFixed(3)})`;
	};
	for (const p of pieces) poser(p);
	if (o.immobile) return { pieces, attraper: () => false, arreter() {} };

	const ro = new ResizeObserver(() => {
		L = zone.clientWidth;
		H = zone.clientHeight;
	});
	ro.observe(zone);

	// ── attraper et lâcher ──
	const attraper = (p) => {
		if (p.etat !== 'libre') return false;
		p.etat = 'attrape';
		p.vx = p.vy = p.vr = 0;
		p.sc = o.echelle;
		p.minuteur = setTimeout(() => lacher(p), o.tenue);
		o.onAttrape?.(p, { x: p.x, y: p.y, L, H });
		return true;
	};
	const lacher = (p) => {
		if (p.etat !== 'attrape') return;
		o.onLache?.(p);
		p.etat = 'fuite';
		const a = Math.atan2(p.y - H / 2, p.x - L / 2) + (alea() - 0.5) * 1.2;
		p.vx = Math.cos(a) * 7;
		p.vy = Math.sin(a) * 7;
		p.vr = (alea() < 0.5 ? -1 : 1) * entre(6, 12);
		p.sc = 0.8;
	};
	const revenir = (p) => {
		// elle rentre par un bord, déjà lancée vers l'intérieur
		const bord = Math.floor(alea() * 4);
		const m = p.r + 30;
		if (bord === 0) { p.x = -m; p.y = entre(0, H); }
		else if (bord === 1) { p.x = L + m; p.y = entre(0, H); }
		else if (bord === 2) { p.x = entre(0, L); p.y = -m; }
		else { p.x = entre(0, L); p.y = H + m; }
		p.ang = Math.atan2(H / 2 - p.y, L / 2 - p.x) + (alea() - 0.5) * 0.8;
		p.vx = Math.cos(p.ang) * p.cr * 3;
		p.vy = Math.sin(p.ang) * p.cr * 3;
		p.vr = 0;
		p.s = 0.8;
		p.sc = 1;
		p.dedans = false;
		p.etat = 'libre';
		p.el.style.visibility = '';
	};

	// ── la boucle ──
	let enRoute = 0;
	let avant = performance.now();
	const image = (t) => {
		enRoute = 0;
		const dt = Math.min(2.5, (t - avant) / 16.667);
		avant = t;
		for (const p of pieces) {
			if (p.etat === 'absent') continue;
			p.s += (p.sc - p.s) * Math.min(1, 0.2 * dt);
			if (p.etat === 'attrape') { p.rot += p.spin / 60 * 0.3 * dt; poser(p); continue; }
			if (p.etat === 'libre') {
				p.ang += p.dang * dt;
				const bx = Math.cos(p.ang) * p.cr;
				const by = Math.sin(p.ang) * p.cr;
				p.vx += (bx - p.vx) * 0.004 * dt; // l'élan se perd doucement, la dérive reprend
				p.vy += (by - p.vy) * 0.004 * dt;
				p.vr *= 0.992 ** dt;
				const v = Math.hypot(p.vx, p.vy);
				if (v > o.vmax) { p.vx *= o.vmax / v; p.vy *= o.vmax / v; }
			}
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.rot += (p.vr + p.spin / 60) * dt;
			if (p.etat === 'fuite') {
				if (p.x < -p.r - 60 || p.x > L + p.r + 60 || p.y < -p.r - 60 || p.y > H + p.r + 60) {
					p.etat = 'absent';
					p.el.style.visibility = 'hidden';
					p.minuteur = setTimeout(() => revenir(p), entre(o.retour[0], o.retour[1]));
					continue;
				}
			} else if (!p.dedans) {
				if (p.x > p.r && p.x < L - p.r && p.y > p.r && p.y < H - p.r) p.dedans = true;
			} else {
				if (p.x < p.r) { p.x = p.r; p.vx = Math.abs(p.vx) * 0.85; }
				else if (p.x > L - p.r) { p.x = L - p.r; p.vx = -Math.abs(p.vx) * 0.85; }
				if (p.y < p.r) { p.y = p.r; p.vy = Math.abs(p.vy) * 0.85; }
				else if (p.y > H - p.r) { p.y = H - p.r; p.vy = -Math.abs(p.vy) * 0.85; }
			}
		}
		if (o.collisions) {
			for (let i = 0; i < pieces.length; i++) {
				const a = pieces[i];
				if (a.etat !== 'libre' || !a.dedans) continue;
				for (let j = i + 1; j < pieces.length; j++) {
					const b = pieces[j];
					if (b.etat !== 'libre' || !b.dedans) continue;
					const ex = b.x - a.x, ey = b.y - a.y, min = a.r + b.r;
					if (Math.abs(ex) > min || Math.abs(ey) > min) continue;
					const d = Math.hypot(ex, ey);
					if (d >= min || d === 0) continue;
					const nx = ex / d, ny = ey / d, rec = (min - d) / 2;
					a.x -= nx * rec; a.y -= ny * rec; b.x += nx * rec; b.y += ny * rec;
					const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
					if (rv < 0) {
						const j2 = (-(1 + 0.88) * rv) / 2;
						a.vx -= j2 * nx; a.vy -= j2 * ny; b.vx += j2 * nx; b.vy += j2 * ny;
						a.vr -= Math.min(3, -rv) * 0.4; b.vr += Math.min(3, -rv) * 0.4;
					}
				}
			}
		}
		for (const p of pieces) if (p.etat !== 'absent') poser(p);
		if (!document.hidden) enRoute = requestAnimationFrame(image);
	};
	const relancer = () => {
		if (!enRoute && !document.hidden) {
			avant = performance.now();
			enRoute = requestAnimationFrame(image);
		}
	};
	document.addEventListener('visibilitychange', relancer);
	relancer();

	// ── la main : le pointeur emporte et écarte ce qu'il frôle ──
	let dernier = null;
	let attente = null;
	const main = (x, y, rayon) => {
		const t = performance.now();
		let pvx = 0, pvy = 0;
		if (dernier) {
			const k = Math.max(1, t - dernier[2]) / 16.667;
			pvx = Math.max(-40, Math.min(40, (x - dernier[0]) / k));
			pvy = Math.max(-40, Math.min(40, (y - dernier[1]) / k));
		}
		dernier = [x, y, t];
		const b = zone.getBoundingClientRect();
		const mx = x - b.left, my = y - b.top;
		for (const p of pieces) {
			if (p.etat !== 'libre') continue;
			const d = Math.hypot(p.x - mx, p.y - my);
			if (d > rayon) continue;
			const f = (1 - d / rayon) ** 1.5;
			const nx = (p.x - mx) / (d || 1), ny = (p.y - my) / (d || 1);
			p.vx += (nx * o.radial + pvx * o.transfert) * f;
			p.vy += (ny * o.radial + pvy * o.transfert) * f;
			p.vr += ((nx * pvy - ny * pvx) * 0.03 + p.spin * 0.01) * f;
		}
	};
	// au plus un calcul par image affichée, quelle que soit la vitesse du pointeur
	const passage = (x, y, rayon) => {
		const libre = !attente;
		attente = [x, y, rayon];
		if (libre)
			requestAnimationFrame(() => {
				const a = attente;
				attente = null;
				if (a) main(a[0], a[1], a[2]);
			});
	};
	const souris = (e) => {
		if (e.pointerType !== 'touch') passage(e.clientX, e.clientY, o.rayon);
	};
	const doigt = (e) => {
		const t = e.touches[0];
		if (t) passage(t.clientX, t.clientY, o.rayonDoigt);
	};
	const fin = () => (dernier = null);
	addEventListener('pointermove', souris, { passive: true });
	addEventListener('touchstart', doigt, { passive: true });
	addEventListener('touchmove', doigt, { passive: true });
	addEventListener('touchend', fin, { passive: true });

	return {
		pieces,
		attraper,
		arreter() {
			cancelAnimationFrame(enRoute);
			for (const p of pieces) clearTimeout(p.minuteur);
			ro.disconnect();
			document.removeEventListener('visibilitychange', relancer);
			removeEventListener('pointermove', souris);
			removeEventListener('touchstart', doigt);
			removeEventListener('touchmove', doigt);
			removeEventListener('touchend', fin);
		}
	};
}
