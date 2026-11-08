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
// Option « aimant » (confettis du fond, idée de Romain 08-11, sur le modèle de la constellation de
// l'accueil, où des traits fins relient les étoiles proches au curseur) : la main n'écarte plus, elle
// attrape. Les pièces du secteur proche sont tenues par un ressort souple, chacune sur sa petite orbite
// autour du pointeur (elles gravitent toutes dans le même sens, les plus proches plus vite), reliées à
// lui par un fil fin de leur couleur (tracé sur le canevas `fils`). Aimantées : elles suivent la main
// sans retard et ne se détachent pas quand on la déplace ; seul un geste franc (deux mouvements de suite
// au-delà de `seuilLance`) les lance dans tous les sens (elles ne peuvent être rattrapées qu'une
// seconde plus tard) ; un doigt qui se lève ou une souris qui sort de la fenêtre les relâche avec leur élan.
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
		attrapables: false, // survol : la pièce visée grossit, ralentit et ne fuit plus
		marge: 16, // de combien on peut rater une pièce à la souris, en pixels
		margeDoigt: 28, // et au doigt
		fondu: false, // fond du site : une pièce qui entre dans un bloc de texte ou une image s'efface (variable --fade)
		aimant: false, // la main attrape les pièces proches (fils fins) et un geste vif les lance ; remplace l'écartement
		fils: null, // le canevas où tracer les fils de l'aimant
		portee: 120, // le secteur proche à la souris, en pixels
		porteeDoigt: 150, // et au doigt
		maxTenus: 16, // combien de pièces la main tient à la fois
		seuilLance: 28, // vitesse du pointeur (pixels par image à 60 par seconde, soit environ 1 700 px/s) au-delà de laquelle on lance
		seuilPrise: 16, // et au-delà de laquelle on n'attrape plus rien (on ne cueille pas en balayant)
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
			fade: 1, // transparence due aux blocs de texte (option fondu)
			minuteur: 0,
			// l'aimant : tenue par la main ou non, orbite autour du pointeur, date avant laquelle elle ne se laisse pas rattraper
			tenu: false, refus: 0, orb: 0, orbR: 0, orbV: 0,
			force: 0, // de 0 (tout juste prise) à 1 (tenue pour de bon) : la prise monte progressivement
			couleur: o.aimant && o.fils ? getComputedStyle(el).getPropertyValue('--c').trim() || '#7a4a20' : ''
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
	if (o.immobile) return { pieces, attraper: () => false, attraperA: () => false, eviter() {}, arreter() {} };

	// le canevas des fils de l'aimant : à la taille de la zone, net sur les écrans denses
	const g = o.aimant && o.fils ? o.fils.getContext('2d') : null;
	const tailleFils = () => {
		if (!g) return;
		const d = Math.min(devicePixelRatio || 1, 2);
		o.fils.width = Math.round(L * d);
		o.fils.height = Math.round(H * d);
		g.setTransform(d, 0, 0, d, 0, 0);
	};
	tailleFils();

	const ro = new ResizeObserver(() => {
		L = zone.clientWidth;
		H = zone.clientHeight;
		tailleFils();
		const b = zone.getBoundingClientRect();
		ox = b.left;
		oy = b.top;
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
	// attraper ce qui se trouve là où l'on vient de cliquer ou de toucher (en pixels de la fenêtre) :
	// la pièce libre la plus proche, à son rayon plus une marge pour un doigt
	const attraperA = (x, y, marge = o.marge) => {
		const b = zone.getBoundingClientRect();
		const mx = x - b.left;
		const my = y - b.top;
		let meilleure = null;
		let dmin = Infinity;
		for (const p of pieces) {
			if (p.etat !== 'libre') continue;
			const d = Math.hypot(p.x - mx, p.y - my);
			if (d < p.r + marge && d < dmin) {
				dmin = d;
				meilleure = p;
			}
		}
		return meilleure ? attraper(meilleure) : false;
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

	// ── ce qui évite le texte : des rectangles (en pixels de la zone) que les pièces contournent ──
	let zonesTexte = [];
	let curseur = null; // la souris, en pixels de la zone
	let chaude = null; // la pièce que la souris est sur le point d'attraper
	let vCurseur = 0; // la vitesse de la souris (pixels par image) : un balayage rapide lance les pièces, une approche lente les rend attrapables
	let ox = zone.getBoundingClientRect().left;
	let oy = zone.getBoundingClientRect().top;

	// ── l'aimant : la main (souris ou doigt) tient les pièces proches, un geste vif les lance ──
	let touche = null; // le doigt posé, en pixels de la zone
	let pt = null; // le pointeur actif à cette image : la souris, sinon le doigt
	let portee = o.portee;
	let nTenus = 0;
	let filsSales = false; // des fils sont tracés : il faudra les effacer
	const vP = [0, 0]; // la vitesse du pointeur : les pièces tenues la suivent (pas de retard), et elle donne son élan à ce qu'on lance
	let fortes = 0; // combien de mouvements de suite ont dépassé le seuil du lancer : un seul à-coup ne lance rien
	let sens = 1; // le sens de rotation de l'essaim, le même pour toutes les pièces : elles gravitent
	const relacher = (p) => {
		p.tenu = false;
		p.force = 0;
		nTenus--;
		p.el.classList.remove('tenu');
		if (p.etat === 'libre') p.sc = 1;
	};
	// les pièces tenues s'écartent un peu les unes des autres : un petit nuage, pas une grappe
	const ecarter = (dt) => {
		if (nTenus < 2) return;
		const tenues = [];
		for (const p of pieces) if (p.tenu) tenues.push(p);
		for (let i = 0; i < tenues.length; i++) {
			const a = tenues[i];
			for (let j = i + 1; j < tenues.length; j++) {
				const b = tenues[j];
				const ex = b.x - a.x, ey = b.y - a.y;
				if (Math.abs(ex) > 28 || Math.abs(ey) > 28) continue;
				const d = Math.hypot(ex, ey);
				if (d >= 28 || d < 0.01) continue;
				const f = (28 - d) * 0.006 * dt / d;
				a.vx -= ex * f; a.vy -= ey * f;
				b.vx += ex * f; b.vy += ey * f;
			}
		}
	};
	const lancer = (t) => {
		for (const p of pieces) {
			if (!p.tenu) continue;
			relacher(p);
			// dans tous les sens : vers l'extérieur à partir du pointeur, un peu au hasard, avec l'élan du geste
			const a = (pt ? Math.atan2(p.y - pt[1], p.x - pt[0]) : alea() * 6.283) + (alea() - 0.5) * 1.6;
			const v = entre(2.5, 7.5);
			p.vx = Math.cos(a) * v + vP[0] * 0.4;
			p.vy = Math.sin(a) * v + vP[1] * 0.4;
			p.vr = (alea() < 0.5 ? -1 : 1) * entre(8, 18);
			p.refus = t + 1000;
		}
	};
	const aimanter = (t, dt) => {
		pt = curseur || touche;
		portee = curseur ? o.portee : o.porteeDoigt;
		// le lancer : un geste franc, deux mouvements de suite au-delà du seuil (et non un simple à-coup)
		if (nTenus && pt && fortes >= 2) { lancer(t); fortes = 0; }
		ecarter(dt);
		// attraper, une à une et pas toutes à la fois : plus la pièce est près, plus vite elle est prise ;
		// pas quand le geste est déjà vif (on ne cueille pas en balayant)
		if (!pt || vCurseur > o.seuilPrise || nTenus >= o.maxTenus) return;
		for (const p of pieces) {
			if (p.etat !== 'libre' || p.tenu || !p.dedans || t < p.refus) continue;
			const d = Math.hypot(p.x - pt[0], p.y - pt[1]);
			if (d > portee || alea() > 0.1 * dt * (1.15 - d / portee)) continue;
			p.tenu = true;
			p.force = 0;
			if (nTenus === 0) sens = alea() < 0.5 ? -1 : 1; // une nouvelle poignée : un nouveau sens de rotation
			nTenus++;
			p.orb = Math.atan2(p.y - pt[1], p.x - pt[0]);
			// une orbite large, de 20 px à presque toute la portée, tirée au hasard : un nuage plein, pas une couronne
			p.orbR = entre(20, portee * 0.92);
			// elles gravitent toutes dans le même sens, les plus proches plus vite (comme des planètes), sans emballement
			p.orbV = sens * 0.03 * Math.sqrt(60 / p.orbR) * entre(0.85, 1.15);
			p.sc = 1.25;
			p.el.classList.add('tenu');
			if (nTenus >= o.maxTenus) break;
		}
	};
	// le ressort : la pièce tenue vise un point de son orbite ; si ce point tombe dans un bloc de texte,
	// on le ramène au bord le plus proche (sinon la pièce glisserait derrière les lettres et s'effacerait)
	const tenir = (p, dt) => {
		// aimantée : elle ne se détache que si la main s'en va, ou si elle se retrouve vraiment loin (le texte l'a retenue)
		if (!pt || Math.hypot(p.x - pt[0], p.y - pt[1]) > portee * 3.2) { relacher(p); return; }
		p.orb += p.orbV * dt;
		let tx = pt[0] + Math.cos(p.orb) * p.orbR;
		let ty = pt[1] + Math.sin(p.orb) * p.orbR;
		const m = p.r + 8;
		for (const R of zonesTexte) {
			if (tx <= R.l - m || tx >= R.r + m || ty <= R.t - m || ty >= R.b + m) continue;
			const dg = tx - (R.l - m), dd = R.r + m - tx, dh = ty - (R.t - m), db = R.b + m - ty;
			const dm = Math.min(dg, dd, dh, db);
			if (dm === dg) tx = R.l - m;
			else if (dm === dd) tx = R.r + m;
			else if (dm === dh) ty = R.t - m;
			else ty = R.b + m;
		}
		tx = Math.max(p.r, Math.min(L - p.r, tx));
		ty = Math.max(p.r, Math.min(H - p.r, ty));
		// la prise monte doucement (environ 1 s) : la pièce garde d'abord sa dérive, puis le ressort la tire
		// de plus en plus, avec un léger rebond à l'arrivée
		p.force = Math.min(1, p.force + 0.017 * dt);
		const e = p.force * p.force * (3 - 2 * p.force);
		const k = 0.010 * e;
		const c = 0.03 + 0.11 * e;
		// la vitesse du point visé : celle du pointeur plus celle de l'orbite ; le frein se mesure par rapport à elle,
		// si bien que la pièce suit la main sans retard (l'aimant ne « lâche » pas quand on déplace la souris)
		const tvx = e * (vP[0] - Math.sin(p.orb) * p.orbR * p.orbV);
		const tvy = e * (vP[1] + Math.cos(p.orb) * p.orbR * p.orbV);
		p.vx += ((tx - p.x) * k - (p.vx - tvx) * c) * dt;
		p.vy += ((ty - p.y) * k - (p.vy - tvy) * c) * dt;
		// et, tant que la prise n'est pas ferme, une vitesse de plafond (par rapport au point visé) : même loin de
		// son orbite, la pièce glisse
		const plafond = 1.2 + 4.5 * e;
		const rx = p.vx - tvx, ry = p.vy - tvy;
		const v = Math.hypot(rx, ry);
		if (v > plafond) { p.vx = tvx + (rx * plafond) / v; p.vy = tvy + (ry * plafond) / v; }
		p.vr *= 0.97 ** dt;
	};
	// les fils : de la main à chaque pièce tenue, fins, de la couleur de la pièce, plus pâles avec la distance
	const tracer = () => {
		if (!g) return;
		if (!nTenus || !pt) {
			if (filsSales) { g.clearRect(0, 0, L, H); filsSales = false; }
			return;
		}
		g.clearRect(0, 0, L, H);
		filsSales = true;
		g.lineWidth = 0.9;
		for (const p of pieces) {
			if (!p.tenu) continue;
			// le fil apparaît avec la prise (il « pousse » en 1 s) et pâlit avec la distance
			const e = p.force * p.force * (3 - 2 * p.force);
			const a = (1 - Math.hypot(p.x - pt[0], p.y - pt[1]) / (portee * 1.6)) * 0.65 * p.fade * e;
			if (a <= 0.02) continue;
			g.globalAlpha = a;
			g.strokeStyle = p.couleur;
			g.beginPath();
			g.moveTo(pt[0], pt[1]);
			g.lineTo(p.x, p.y);
			g.stroke();
		}
	};

	// ── la boucle ──
	let enRoute = 0;
	let avant = performance.now();
	const image = (t) => {
		enRoute = 0;
		const dt = Math.min(2.5, (t - avant) / 16.667);
		avant = t;
		// la pièce que la souris est sur le point d'attraper : elle grossit, ralentit et ne fuit plus
		vCurseur *= 0.85 ** dt;
		if (o.aimant) aimanter(t, dt);
		if (o.attrapables) {
		let visee = null;
		if (curseur && vCurseur < 10) {
				let dmin = Infinity;
				for (const p of pieces) {
					if (p.etat !== 'libre') continue;
					const d = Math.hypot(p.x - curseur[0], p.y - curseur[1]);
					if (d < p.r + o.marge && d < dmin) { dmin = d; visee = p; }
				}
			}
			if (visee !== chaude) {
				if (chaude) { chaude.el.classList.remove('chaud'); if (chaude.etat === 'libre') chaude.sc = 1; }
				if (visee) { visee.el.classList.add('chaud'); visee.sc = 1.22; document.documentElement.dataset.flotantChaud = '1'; }
				else delete document.documentElement.dataset.flotantChaud;
				chaude = visee;
			}
		}
		for (const p of pieces) {
			if (p.etat === 'absent') continue;
			p.s += (p.sc - p.s) * Math.min(1, 0.2 * dt);
			if (p.etat === 'attrape') { p.rot += p.spin / 60 * 0.3 * dt; poser(p); continue; }
			if (p.etat === 'libre') {
				p.ang += p.dang * dt;
				if (p.tenu) tenir(p, dt);
				if (!p.tenu) {
					const bx = Math.cos(p.ang) * p.cr;
					const by = Math.sin(p.ang) * p.cr;
					p.vx += (bx - p.vx) * 0.004 * dt; // l'élan se perd doucement, la dérive reprend
					p.vy += (by - p.vy) * 0.004 * dt;
					p.vr *= 0.992 ** dt;
					// une pièce lancée (bien plus vite que sa dérive) freine plus franchement, puis reprend sa croisière
					if (o.aimant && p.vx * p.vx + p.vy * p.vy > 4.8) {
						const f = 1 - 0.012 * dt;
						p.vx *= f;
						p.vy *= f;
					}
				}
				if (p === chaude) { p.vx *= 0.9 ** dt; p.vy *= 0.9 ** dt; }
				else if (o.attrapables && curseur && vCurseur < 10 && Math.hypot(p.x - curseur[0], p.y - curseur[1]) < p.r + 70) { p.vx *= 0.97 ** dt; p.vy *= 0.97 ** dt; } // elle ralentit quand la souris approche
				// le texte dense : on le contourne, sans mur (une pièce lancée peut passer derrière,
				// puis elle est repoussée vers la sortie la plus proche)
				let fade = 1;
				for (const R of zonesTexte) {
					// dans le bloc lui-même : la pièce s'efface sur 14 px (elle passe « derrière », sans se voir entre les lettres)
					if (o.fondu) {
						const di = Math.min(p.x - R.l, R.r - p.x, p.y - R.t, R.b - p.y);
						if (di > 0) fade = Math.min(fade, Math.max(0, 1 - di / 14));
					}
					const m = p.r + 8;
					const g = R.l - m, d = R.r + m, h = R.t - m, b = R.b + m;
					if (p.x <= g || p.x >= d || p.y <= h || p.y >= b) continue;
					const dg = p.x - g, dd = d - p.x, dh = p.y - h, db = b - p.y;
					const dm = Math.min(dg, dd, dh, db);
					// une barrière douce : presque rien au bord, de plus en plus forte vers l'intérieur
					const f = Math.min(0.25, 0.0035 * dm) * dt;
					let nx = 0, ny = 0;
					if (dm === dg) nx = -1;
					else if (dm === dd) nx = 1;
					else if (dm === dh) ny = -1;
					else ny = 1;
					p.vx += nx * f;
					p.vy += ny * f;
					// et sa dérive tourne vers la sortie : sans cela, une pièce qui voudrait aller droit dans le texte
					// resterait collée au bord, immobile, jusqu'à ce que son cap change de lui-même
					let da = Math.atan2(ny, nx) - p.ang;
					da = Math.atan2(Math.sin(da), Math.cos(da));
					p.ang += da * 0.04 * dt;
				}
				if (o.fondu && Math.abs(fade - p.fade) > 0.04) {
					p.fade = fade;
					p.el.style.setProperty('--fade', fade.toFixed(2));
				}
				const v = Math.hypot(p.vx, p.vy);
				// une pièce tenue suit la main, si vive soit-elle : elle n'a pas la limite des pièces libres
				const vlim = p.tenu ? 60 : o.vmax;
				if (v > vlim) { p.vx *= vlim / v; p.vy *= vlim / v; }
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
		if (o.aimant) {
			// sans nouveau mouvement, la vitesse du pointeur retombe (la main s'est arrêtée) ; la prochaine image la relira à jour
			vP[0] *= 0.8 ** dt;
			vP[1] *= 0.8 ** dt;
			if (!pt) fortes = 0;
		}
		tracer();
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
		vCurseur = Math.hypot(pvx, pvy);
		vP[0] = pvx;
		vP[1] = pvy;
		fortes = vCurseur > o.seuilLance ? fortes + 1 : 0;
		dernier = [x, y, t];
		if (o.aimant) return; // la main attrape (boucle d'animation) au lieu d'écarter
		const b = zone.getBoundingClientRect();
		const mx = x - b.left, my = y - b.top;
		for (const p of pieces) {
			if (p.etat !== 'libre' || p === chaude) continue;
			const d = Math.hypot(p.x - mx, p.y - my);
			if (d > rayon) continue;
			const f = (1 - d / rayon) ** 1.5;
			const nx = (p.x - mx) / (d || 1), ny = (p.y - my) / (d || 1);
			// pièces à attraper : une approche lente ne les fait pas fuir (seul un geste rapide les écarte)
			const k = o.attrapables ? Math.min(1, Math.hypot(pvx, pvy) / 8) : 1;
			p.vx += (nx * o.radial * k + pvx * o.transfert) * f;
			p.vy += (ny * o.radial * k + pvy * o.transfert) * f;
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
		if (e.pointerType === 'touch') return;
		curseur = [e.clientX - ox, e.clientY - oy];
		passage(e.clientX, e.clientY, o.rayon);
	};
	const doigt = (e) => {
		const t = e.touches[0];
		if (!t) return;
		touche = [t.clientX - ox, t.clientY - oy];
		passage(t.clientX, t.clientY, o.rayonDoigt);
	};
	const fin = () => {
		dernier = null;
		touche = null; // le doigt se lève : ce qu'il tenait part avec son élan
	};
	const sorti = () => (curseur = null);
	document.documentElement.addEventListener('mouseleave', sorti);
	addEventListener('pointermove', souris, { passive: true });
	addEventListener('touchstart', doigt, { passive: true });
	addEventListener('touchmove', doigt, { passive: true });
	addEventListener('touchend', fin, { passive: true });
	addEventListener('touchcancel', fin, { passive: true });

	return {
		pieces,
		attraper,
		attraperA,
		/** les zones de texte à éviter : [{ l, t, r, b }] en pixels de la zone */
		eviter(rects) {
			zonesTexte = rects;
		},
		arreter() {
			document.documentElement.removeEventListener('mouseleave', sorti);
			delete document.documentElement.dataset.flotantChaud;
			cancelAnimationFrame(enRoute);
			for (const p of pieces) clearTimeout(p.minuteur);
			ro.disconnect();
			document.removeEventListener('visibilitychange', relancer);
			removeEventListener('pointermove', souris);
			removeEventListener('touchstart', doigt);
			removeEventListener('touchmove', doigt);
			removeEventListener('touchend', fin);
			removeEventListener('touchcancel', fin);
		}
	};
}
