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

// Ce qui se clique, se tape ou se manipule : la main n'y attrape rien et n'écarte rien (Romain, 16-11 :
// l'attraction gênait le geste sur un lien, un menu, une rubrique dépliable ; elle ne joue que là où il n'y a
// rien à faire). Arriver dessus relâche ce que la main tenait, avec son élan, comme une souris qui sort de la fenêtre.
export const INTERACTIU =
	'a, button, input, select, textarea, label, summary, nav, dialog, video, audio, iframe, .leaflet-container, ' +
	'[role="button"], [role="link"], [role="menu"], [role="menubar"], [role="menuitem"], [role="tab"], [role="option"], ' +
	'[role="checkbox"], [role="radio"], [role="switch"], [role="slider"], [role="dialog"], ' +
	'[contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';

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
		// sobriété (essai « confettis raffinés », 2026-11-12) : au repos (personne ne touche, rien n'a été lancé), la dérive
		// fait quelques pixels par seconde : on n'affiche que « repos » images par seconde (0 = toutes), et on revient à
		// la cadence de l'écran dès que la main bouge, tient ou lance une pièce
		repos: 0,
		filsAuBesoin: false, // le canevas des fils n'est affiché que lorsqu'un fil est tracé (sinon l'écran le recompose pour rien)
		// l'écriture (Romain, 21-11, remplace l'aimant pour les confettis du fond) : la souris ne touche à rien ; posée
		// sur un endroit vide, elle fait venir les confettis proches, qui écrivent un mot occitan ; le mot tient, se défait,
		// puis un autre vient. { mots: [{ oc, fr }], police, taille, attente, tenue, pause, max, onMot, onEfface }
		ecrire: null,
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
		// (data-k : une pièce « lointaine » dérive moins vite qu'une proche ; 1 si rien n'est dit)
		const cr = entre(o.croisiere[0], o.croisiere[1]) * (Number(el.dataset.k) || 1);
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
			fade: 1, // transparence due aux blocs de texte et aux images (option fondu)
			fadeE: 1, // la dernière valeur écrite dans la page
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
	const g = (o.aimant || o.ecrire) && o.fils ? o.fils.getContext('2d') : null;
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
			// une image ne retient pas la ronde : la pièce suit la main et s'y enfonce en s'effaçant (sinon la ronde
			// s'écrase contre un mur invisible, le bord du rectangle de la carte)
			if (R.m) continue;
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
	if (g && o.filsAuBesoin) o.fils.style.display = 'none';
	const tracer = () => {
		if (!g) return;
		if (!nTenus || !pt) {
			if (filsSales) { g.clearRect(0, 0, L, H); filsSales = false; if (o.filsAuBesoin) o.fils.style.display = 'none'; }
			return;
		}
		if (!filsSales && o.filsAuBesoin) o.fils.style.display = '';
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

	// ── l'écriture : la souris posée, les confettis proches écrivent un mot ──
	// Retour de Romain (22-11 : « trop de latence entre le moment où la souris s'arrête et la création du mot ») : le mot
	// commence 0,4 s après l'arrêt (et non plus 1,3 s), chaque pièce part aussitôt et met le temps de sa distance (de 0,4
	// à 1,3 s, et non plus 1,5 à 2,3 s), et la pause entre deux mots ne vaut que lorsqu'un mot s'est défait de lui-même.
	const ec = o.ecrire ? { taille: 100, graisse: 'normal', attente: 400, tenue: 3800, pause: 1600, max: 88, parLettre: 20, point: 4.5, ...o.ecrire } : null;
	let pose = null; // [x, y, t] : où la souris s'est posée (en pixels de la zone) et depuis quand
	let ecrit = null; // le mot en cours : { phase (venir, tenir), fin, mot, pieces, boite }
	let prochain = 0; // pas de nouveau mot avant cette date
	let rang = 0;
	const ordre = ec ? [...ec.mots] : [];
	for (let i = ordre.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ordre[i], ordre[j]] = [ordre[j], ordre[i]];
	}
	const police = ec ? `${ec.graisse} ${ec.taille}px ${ec.police}` : '';
	const toile = ec ? document.createElement('canvas') : null;
	// les points du mot (essai du 21-11 : une lettre grasse remplie de points ne se lisait pas) : on écrit le mot en trait
	// fin sur une toile cachée, on en tire la ligne centrale des lettres (le squelette, calculé une fois par mot et gardé,
	// d'avance quand le navigateur n'a rien à faire : il ne retarde plus le départ du mot), puis on pose des points le long
	// du trait, à distance égale les uns des autres (aucun point à moins de « r » d'un autre) ; on cherche le plus grand
	// écart qui donne assez de points pour les confettis disponibles
	const squelettes = new Map();
	const squelette = (txt) => {
		if (squelettes.has(txt)) return squelettes.get(txt);
		const c = toile.getContext('2d', { willReadFrequently: true });
		c.font = police;
		const w = Math.ceil(c.measureText(txt).width) + 8;
		const h = Math.ceil(ec.taille * 1.3);
		toile.width = w;
		toile.height = h;
		c.font = police;
		c.textBaseline = 'middle';
		c.fillText(txt, 4, h / 2);
		const d = c.getImageData(0, 0, w, h).data;
		// le squelette des lettres (amincissement de Zhang et Suen) : on ronge le trait de part et d'autre jusqu'à sa ligne
		// centrale, d'un pixel de large ; les points s'y posent en file et les fils suivent le trait au lieu de s'emmêler
		const img = new Uint8Array(w * h);
		for (let i = 0; i < w * h; i++) img[i] = d[i * 4 + 3] > 120 ? 1 : 0;
		// avant d'amincir, les morceaux de la lettre pleine, d'un seul tenant chacun : les lettres, et les petits morceaux à
		// part, un accent ou le point d'un i (Romain, 22-11 : l'accent de « cèl » n'attrapait qu'un confetti au hasard, on
		// lisait « cel »). Mesurés pleins (le squelette d'un accent, trait court et épais, est trop court pour se mesurer)
		const morceau = new Int32Array(w * h).fill(-1);
		const pleins = [];
		for (let i0 = 0; i0 < w * h; i0++) {
			if (!img[i0] || morceau[i0] >= 0) continue;
			const px = [];
			const pile = [i0];
			morceau[i0] = pleins.length;
			while (pile.length) {
				const i = pile.pop();
				const x = i % w, y = (i - x) / w;
				px.push([x, y]);
				for (let dy = -1; dy <= 1; dy++)
					for (let dx = -1; dx <= 1; dx++) {
						const xx = x + dx, yy = y + dy, j = yy * w + xx;
						if (xx >= 0 && yy >= 0 && xx < w && yy < h && img[j] && morceau[j] < 0) { morceau[j] = pleins.length; pile.push(j); }
					}
			}
			pleins.push(px);
		}
		for (let change = true; change; ) {
			change = false;
			for (let passe = 0; passe < 2; passe++) {
				const ote = [];
				for (let y = 1; y < h - 1; y++)
					for (let x = 1; x < w - 1; x++) {
						const i = y * w + x;
						if (!img[i]) continue;
						const p2 = img[i - w], p3 = img[i - w + 1], p4 = img[i + 1], p5 = img[i + w + 1];
						const p6 = img[i + w], p7 = img[i + w - 1], p8 = img[i - 1], p9 = img[i - w - 1];
						const B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
						if (B < 2 || B > 6) continue;
						const A = (!p2 && p3 ? 1 : 0) + (!p3 && p4 ? 1 : 0) + (!p4 && p5 ? 1 : 0) + (!p5 && p6 ? 1 : 0) + (!p6 && p7 ? 1 : 0) + (!p7 && p8 ? 1 : 0) + (!p8 && p9 ? 1 : 0) + (!p9 && p2 ? 1 : 0);
						if (A !== 1) continue;
						if (passe === 0 ? p2 * p4 * p6 || p4 * p6 * p8 : p2 * p4 * p8 || p2 * p6 * p8) continue;
						ote.push(i);
					}
				for (const i of ote) img[i] = 0;
				if (ote.length) change = true;
			}
		}
		// les lettres donnent leur squelette ; un petit morceau a ses points à coup sûr : un seul au milieu pour un point
		// (rond), et pour un accent (allongé) deux points sur son axe, trois s'il est assez long, que relève son propre fil
		const seuil = ec.taille * ec.taille * 0.032; // en pixels pleins : un accent ou un point en a moins, une lettre bien plus
		const encre = [];
		const petits = [];
		for (let i = 0; i < w * h; i++) if (img[i] && pleins[morceau[i]].length >= seuil) encre.push([i % w, (i - (i % w)) / w]);
		for (const px of pleins) {
			if (px.length >= seuil) continue;
			// son centre, son axe et ses deux longueurs (moments d'ordre deux : une barre de longueur l a une variance l²/12)
			const n = px.length;
			const mx = px.reduce((s, p) => s + p[0], 0) / n, my = px.reduce((s, p) => s + p[1], 0) / n;
			let sxx = 0, syy = 0, sxy = 0;
			for (const [x, y] of px) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my); }
			sxx /= n; syy /= n; sxy /= n;
			const dl = Math.sqrt(((sxx - syy) / 2) ** 2 + sxy * sxy);
			const long = Math.sqrt(3 * ((sxx + syy) / 2 + dl)), large = Math.sqrt(3 * Math.max(0, (sxx + syy) / 2 - dl));
			if (long < 1.6 * large) { petits.push([[Math.round(mx), Math.round(my)]]); continue; }
			const th = 0.5 * Math.atan2(2 * sxy, sxx - syy);
			const e = Math.max(3, long - 0.8 * large); // de part et d'autre du centre, en rentrant d'une demi-épaisseur
			const ux = Math.cos(th) * e, uy = Math.sin(th) * e;
			const a = [Math.round(mx - ux), Math.round(my - uy)], b = [Math.round(mx + ux), Math.round(my + uy)];
			petits.push(2 * e >= 14 ? [a, [Math.round(mx), Math.round(my)], b] : [a, b]);
		}
		const s = { encre, petits, w, h };
		// gardé seulement s'il est tracé dans la bonne police (pas dans celle de secours, en attendant Luciole)
		if (!document.fonts || document.fonts.check(police)) squelettes.set(txt, s);
		return s;
	};
	const relever = (txt, n) => {
		const { encre: trait, petits, w, h } = squelette(txt);
		// les points des accents et des points sur les i d'abord, chacun marqué de son morceau (3e valeur) ; les lettres ensuite
		const fixes = petits.flatMap((m, g) => m.map(([x, y], k) => [x, y, g, k]));
		// les pixels du squelette, dans un ordre mêlé (sinon les points s'alignent sur le balayage)
		const encre = trait.slice();
		for (let i = encre.length - 1; i > 0; i--) {
			const j = Math.floor(alea() * (i + 1));
			[encre[i], encre[j]] = [encre[j], encre[i]];
		}
		const semer = (r) => {
			const pts = fixes.slice();
			for (const q of encre) if (!pts.some((p) => Math.abs(p[0] - q[0]) < r && Math.abs(p[1] - q[1]) < r && Math.hypot(p[0] - q[0], p[1] - q[1]) < r)) pts.push(q);
			return pts;
		};
		// le plus grand écart (entre 4 et 20 px) qui donne encore assez de points : par dichotomie, cinq essais au lieu de trente
		let bas = 4, haut = 20, pts = null;
		while (haut - bas > 0.5) {
			const mi = (bas + haut) / 2;
			const essai = semer(mi);
			if (essai.length >= n) { bas = mi; pts = essai; }
			else haut = mi;
		}
		const r = bas;
		if (!pts) pts = semer(r);
		// trop de points : on en retire au hasard, jamais ceux des accents ni des points sur les i
		while (pts.length > n && pts.length > fixes.length) pts.splice(fixes.length + Math.floor(alea() * (pts.length - fixes.length)), 1);
		return { pts, w, h, r };
	};
	// les squelettes de tous les mots, calculés d'avance un par un quand le navigateur est libre, une fois la police là
	let arrete = false;
	if (ec) {
		const libre = window.requestIdleCallback || ((f) => setTimeout(f, 80));
		const chauffer = (k) => {
			if (arrete || k >= ordre.length) return;
			libre(() => { if (!arrete) { squelette(ordre[k].oc); chauffer(k + 1); } }, { timeout: 3000 });
		};
		Promise.resolve(document.fonts?.load(police)).then(() => chauffer(0), () => {});
	}
	const commencer = (t) => {
		if (document.fonts && !document.fonts.check(police)) return false; // la police n'est pas encore là
		// (une pièce qui rentre chez elle après le mot précédent peut repartir tout de suite)
		const libres = pieces.filter((p) => p.etat === 'libre' && (p.dedans || p.ecrit) && !p.tenu && p.fade > 0.6);
		const m = ordre[rang % ordre.length];
		const n = Math.min(libres.length, ec.max, Math.max(30, [...m.oc].length * ec.parLettre));
		if (n < 24) return false;
		const { w, h } = squelette(m.oc);
		// la place : au-dessus de la souris (qu'elle ne cache pas le mot), sinon dessous, puis décalée à gauche ou à droite ;
		// jamais sur du texte ni une image
		const [cx, cy] = pose;
		let boite = null;
		const haut = cy - 30 - h / 2, bas = cy + 36 + h / 2, cote = w / 2 + 40;
		for (const [xc, yc] of [[cx, haut], [cx, bas], [cx - cote, haut], [cx + cote, haut], [cx - cote, bas], [cx + cote, bas]]) {
			const l = Math.max(16, Math.min(L - 16 - w, xc - w / 2));
			const b = { l, t: yc - h / 2, r: l + w, b: yc + h / 2 };
			if (b.t < 16 || b.b > H - 16) continue;
			if (zonesTexte.some((R) => R.l < b.r + 14 && R.r > b.l - 14 && R.t < b.b + 14 && R.b > b.t - 14)) continue;
			boite = b;
			break;
		}
		if (!boite) return false;
		const { pts, r } = relever(m.oc, n);
		rang++;
		// les plus proches viennent ; triées de gauche à droite comme les points, chacune va à peu près droit devant elle
		libres.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));
		const venus = libres.slice(0, pts.length).sort((a, b) => a.x - b.x);
		pts.sort((a, b) => a[0] - b[0]);
		let fin = 0;
		venus.forEach((p, k) => {
			const [px, py] = pts[k];
			const tx = boite.l + px + (alea() - 0.5) * 1.5, ty = boite.t + py + (alea() - 0.5) * 1.5;
			const dist = Math.hypot(tx - p.x, ty - p.y);
			// elles partent presque ensemble, de gauche à droite (le mot s'écrit dans le sens de la lecture), et chacune met
			// le temps de sa distance : les plus proches dessinent déjà les lettres quand les lointaines arrivent
			const t0 = t + (px / w) * 260 + alea() * 90;
			const d = Math.min(1300, 400 + dist * 0.5) * entre(0.9, 1.1);
			fin = Math.max(fin, t0 + d);
			// chez elle : là où elle était avant le premier mot (elle y retournera ensuite)
			if (!p.ecrit) p.chez = [p.x, p.y];
			// (grp, rang : le petit morceau, accent ou point d'un i, dont elle est un point, et son rang le long de ce morceau)
			p.ecrit = { t0, d, x0: null, y0: 0, tx, ty, arc: (alea() - 0.5) * Math.min(70, dist * 0.25), grp: pts[k][2] ?? -1, rang: pts[k][3] };
			// des points de taille égale, pour que les lettres se lisent
			p.sc = Math.max(0.7, Math.min(1.5, ec.point / p.w));
			p.el.classList.add('ecrit');
		});
		// les fils : chaque point se relie à ses deux plus proches voisins sur le trait (pas plus loin que 1,8 écart) ;
		// mis bout à bout, ils redessinent le trait de chaque lettre. Un accent ne se relie qu'à lui-même, bout à bout
		// (sinon un fil le rattachait à la lettre au-dessous) ; le point d'un i reste un point
		const liens = new Set();
		venus.forEach((a, i) => {
			const proches = [];
			venus.forEach((b, j) => {
				if (i === j || a.ecrit.grp !== b.ecrit.grp) return;
				if (a.ecrit.grp >= 0) {
					if (Math.abs(a.ecrit.rang - b.ecrit.rang) === 1) liens.add(i < j ? i * 1000 + j : j * 1000 + i);
					return;
				}
				const dd = Math.hypot(a.ecrit.tx - b.ecrit.tx, a.ecrit.ty - b.ecrit.ty);
				if (dd < r * 1.8) proches.push([dd, j]);
			});
			proches.sort((x, y) => x[0] - y[0]);
			for (const [, j] of proches.slice(0, 2)) liens.add(i < j ? i * 1000 + j : j * 1000 + i);
		});
		ecrit = { phase: 'venir', fin, mot: m, pieces: venus, boite, centre: [cx, cy], liens: [...liens].map((k) => [venus[Math.floor(k / 1000)], venus[k % 1000]]), r };
		return true;
	};
	// la pièce en route, sur un léger arc : vers sa place dans le mot, elle part aussitôt et se pose en douceur ; quand le mot
	// s'est défait, elle rentre chez elle (lente au départ, lente à l'arrivée), puis reprend sa dérive. Rend vrai tant qu'elle bouge.
	const guider = (p, t) => {
		const e = p.ecrit;
		if (e.x0 === null) { e.x0 = p.x; e.y0 = p.y; }
		const u = Math.min(1, (t - e.t0) / e.d);
		const s = e.retour ? (u < 0.5 ? 4 * u * u * u : 1 - (2 - 2 * u) ** 3 / 2) : Math.sin((u * Math.PI) / 2);
		e.s = s; // l'avancée du trajet : les fils n'apparaissent qu'à l'arrivée
		const dx = e.tx - e.x0, dy = e.ty - e.y0, dl = Math.hypot(dx, dy) || 1;
		const arc = Math.sin(Math.PI * s) * e.arc;
		let x = e.x0 + dx * s - (dy / dl) * arc;
		let y = e.y0 + dy * s + (dx / dl) * arc;
		if (e.retour) {
			p.x = x;
			p.y = y;
			if (u < 1) { p.vx = p.vy = 0; return true; }
			// arrivée chez elle : elle repart dans sa dérive, comme si de rien n'était
			p.ecrit = null;
			p.vx = Math.cos(p.ang) * p.cr;
			p.vy = Math.sin(p.ang) * p.cr;
			return false;
		}
		if (u >= 1) {
			// arrivée : elle respire à peine
			const r = (t - e.t0 - e.d) / 1000;
			x += Math.sin(r * 1.3 + p.i) * 0.5;
			y += Math.cos(r * 1.1 + p.i * 0.7) * 0.5;
		}
		p.x = x;
		p.y = y;
		p.vx = p.vy = p.vr = 0;
		// en chemin, elle se redresse (au quart de tour le plus proche) : des points droits, des lettres nettes
		p.rot += (Math.round(p.rot / 90) * 90 - p.rot) * 0.08 * s;
		return u < 1;
	};
	// le mot se défait : chaque pièce rentre chez elle, là où elle flottait avant le mot (Romain, 22-11 : les confettis
	// « restent en haut ». Ils partaient en ligne droite loin du mot, et le mot s'écrit au-dessus de la souris : de mot en
	// mot, tout finissait entassé contre le bord haut). « geste » : la souris a bougé, le mot suivant peut venir sans pause.
	const defaire = (t, geste = false) => {
		if (!ecrit) return;
		partants = { liens: ecrit.liens, r: ecrit.r, t0: t };
		for (const p of ecrit.pieces) {
			p.sc = 1;
			p.el.classList.remove('ecrit');
			const [hx, hy] = p.chez || [p.x, p.y];
			const tx = Math.max(p.r, Math.min(L - p.r, hx + (alea() - 0.5) * 30));
			const ty = Math.max(p.r, Math.min(H - p.r, hy + (alea() - 0.5) * 30));
			const dist = Math.hypot(tx - p.x, ty - p.y);
			p.ecrit = { t0: t + alea() * 200, d: Math.min(1800, 600 + dist * 0.7) * entre(0.9, 1.15), x0: null, y0: 0, tx, ty, arc: (alea() - 0.5) * Math.min(80, dist * 0.3), retour: true };
		}
		ecrit = null;
		ec.onEfface?.();
		prochain = geste ? 0 : t + ec.pause;
		eveil = Math.max(eveil, t + 2500);
	};
	const ecrire = (t) => {
		if (ecrit) {
			if (ecrit.phase === 'venir' && t >= ecrit.fin) {
				ecrit.phase = 'tenir';
				ecrit.fin = t + ec.tenue;
				ec.onMot?.(ecrit.mot, ecrit.boite, ecrit.centre); // (centre : là où la souris s'est posée)
			} else if (ecrit.phase === 'tenir' && t >= ecrit.fin) defaire(t);
		} else if (curseur && pose && t - pose[2] > ec.attente && t > prochain) {
			if (!commencer(t)) prochain = t + 400; // pas de place ici (ou la police manque) : on réessaiera
		}
	};
	// les fils du mot, sur le canevas sous les confettis : fins, couleur d'encre, ils apparaissent quand les deux points
	// qu'ils relient arrivent, et s'effacent en 0,7 s quand le mot se défait (les points s'écartent, le fil s'étire et pâlit)
	let partants = null;
	const tracerMot = (t) => {
		if (!g) return;
		const lots = [];
		if (ecrit) lots.push([ecrit.liens, 1, ecrit.r]);
		if (partants) {
			const f = 1 - (t - partants.t0) / 700;
			if (f <= 0) partants = null;
			else lots.push([partants.liens, f, partants.r]);
		}
		if (!lots.length) {
			if (filsSales) { g.clearRect(0, 0, L, H); filsSales = false; o.fils.style.display = 'none'; }
			return;
		}
		if (!filsSales) o.fils.style.display = '';
		g.clearRect(0, 0, L, H);
		filsSales = true;
		g.lineWidth = 0.9;
		g.lineCap = 'round';
		g.strokeStyle = ec.couleurFil?.() || '#3a2a20';
		for (const [liens, f, r] of lots)
			for (const [a, b] of liens) {
				// (le fil d'une pièce en route vers le mot pousse à son arrivée ; celui d'une pièce qui rentre chez elle pâlit avec le mot)
				const k = Math.min(a.ecrit && !a.ecrit.retour ? a.ecrit.s || 0 : 1, b.ecrit && !b.ecrit.retour ? b.ecrit.s || 0 : 1);
				const al = 0.55 * f * k * k * k;
				if (al < 0.02 || Math.hypot(a.x - b.x, a.y - b.y) > r * 3) continue;
				g.globalAlpha = al;
				g.beginPath();
				g.moveTo(a.x, a.y);
				g.lineTo(b.x, b.y);
				g.stroke();
			}
		g.globalAlpha = 1;
	};
	// la souris : posée, elle prépare un mot ; elle bouge, s'en va ou passe sur ce qui se clique, le mot se défait
	const poser2 = (x, y) => {
		if (!ec) return;
		const t = performance.now();
		if (x === null) {
			pose = null;
			defaire(t, true);
			return;
		}
		if (!pose || Math.hypot(x - pose[0], y - pose[1]) > 12) {
			pose = [x, y, t];
			defaire(t, true);
		}
	};

	// ── la boucle ──
	let enRoute = 0;
	let avant = performance.now();
	let eveil = 0; // jusqu'à quand on garde la cadence de l'écran (la main vient de bouger, une pièce est tenue ou lancée)
	const image = (t) => {
		enRoute = 0;
		// au repos : on saute les images en trop (rien n'est calculé ni redessiné)
		if (o.repos && t >= eveil && t - avant < 1000 / o.repos - 4) {
			if (!document.hidden) enRoute = requestAnimationFrame(image);
			return;
		}
		const dt = Math.min(o.repos ? 4 : 2.5, (t - avant) / 16.667);
		avant = t;
		let vive = false;
		// la pièce que la souris est sur le point d'attraper : elle grossit, ralentit et ne fuit plus
		vCurseur *= 0.85 ** dt;
		if (o.aimant) aimanter(t, dt);
		if (ec) ecrire(t);
		if (ecrit?.phase === 'venir') vive = true;
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
			if (p.ecrit && t >= p.ecrit.t0) { if (guider(p, t)) vive = true; }
			else if (p.etat === 'libre') {
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
				for (const R of zonesTexte) {
					const m = p.r + 8;
					const g = R.l - m, d = R.r + m, h = R.t - m, b = R.b + m;
					if (p.x <= g || p.x >= d || p.y <= h || p.y >= b) continue;
					// jamais de sortie par un bord de l'écran (Romain, 22-11) : une pièce poussée vers le haut d'un en-tête collé
					// au haut de la page restait coincée contre le bord, à jamais
					const dg = g > 0 ? p.x - g : Infinity, dd = d < L ? d - p.x : Infinity;
					const dh = h > 0 ? p.y - h : Infinity, db = b < H ? b - p.y : Infinity;
					const dm = Math.min(dg, dd, dh, db);
					if (dm === Infinity) continue; // un bloc qui couvre tout l'écran : rien à contourner
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
				const v = Math.hypot(p.vx, p.vy);
				if (v > 1.2 || p.tenu) vive = true;
				// une pièce tenue suit la main, si vive soit-elle : elle n'a pas la limite des pièces libres
				const vlim = p.tenu ? 60 : o.vmax;
				if (v > vlim) { p.vx *= vlim / v; p.vy *= vlim / v; }
			}
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.rot += (p.vr + p.spin / 60) * dt;
			// derrière un bloc de texte ou une image, la pièce s'efface (elle ne se voit pas entre les lettres ni dans les
			// transparences d'une carte). Sans à-coup (Romain, 12-11 : près de la carte, « que ça ne fasse pas comme un bug ») :
			// sur 14 px pour le texte, mais en s'enfonçant peu à peu dans une image (zone « m », profondeur « d »), et toujours
			// en fondu dans le temps, si vite qu'elle aille
			if (o.fondu) {
				let cible = 1;
				for (const R of zonesTexte) {
					const di = Math.min(p.x - R.l, R.r - p.x, p.y - R.t, R.b - p.y);
					if (di <= 0) continue;
					const f = Math.max(0, 1 - di / (R.m ? R.d : 14));
					cible = Math.min(cible, R.m ? f * f * (3 - 2 * f) : f);
				}
				p.fade += (cible - p.fade) * Math.min(1, 0.1 * dt);
				if (Math.abs(cible - p.fade) < 0.02) p.fade = cible;
				if (Math.abs(p.fade - p.fadeE) > 0.03 || (p.fade === cible && p.fade !== p.fadeE)) {
					p.fadeE = p.fade;
					p.el.style.setProperty('--fade', p.fade.toFixed(2));
				}
				if (p.fade !== cible) vive = true;
			}
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
				// le rebond renvoie aussi le cap de la dérive (Romain, 22-11) : sans cela, une pièce qui rebondit garde son cap
				// vers le bord, y revient aussitôt et reste collée contre lui
				if (p.x < p.r) { p.x = p.r; p.vx = Math.abs(p.vx) * 0.85; if (Math.cos(p.ang) < 0) p.ang = Math.PI - p.ang; }
				else if (p.x > L - p.r) { p.x = L - p.r; p.vx = -Math.abs(p.vx) * 0.85; if (Math.cos(p.ang) > 0) p.ang = Math.PI - p.ang; }
				if (p.y < p.r) { p.y = p.r; p.vy = Math.abs(p.vy) * 0.85; if (Math.sin(p.ang) < 0) p.ang = -p.ang; }
				else if (p.y > H - p.r) { p.y = H - p.r; p.vy = -Math.abs(p.vy) * 0.85; if (Math.sin(p.ang) > 0) p.ang = -p.ang; }
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
		if (ec) tracerMot(t);
		else tracer();
		if (vive || nTenus) eveil = Math.max(eveil, t + 600);
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
	let doigtLibre = true;
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
		eveil = t + 1500; // la main bouge : cadence de l'écran pendant 1,5 s
		// la main qui passe remue les confettis, même quand ils écrivent (Romain, 22-11 : « je veux garder l'interaction
		// avec la souris, quand on passe ça les remue ») ; l'aimant, lui, attrape au lieu d'écarter
		if (o.aimant) return;
		const b = zone.getBoundingClientRect();
		const mx = x - b.left, my = y - b.top;
		for (const p of pieces) {
			// (une pièce en route vers le mot ou vers chez elle suit son trajet)
			if (p.etat !== 'libre' || p === chaude || p.ecrit) continue;
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
	// la main est-elle sur quelque chose qui se clique ? (le résultat est gardé tant qu'on reste sur le même élément)
	let cible = null;
	let surInteractiu = false;
	const interactiu = (el) => {
		if (el !== cible) {
			cible = el;
			surInteractiu = !!el?.closest?.(INTERACTIU);
		}
		return surInteractiu;
	};
	const souris = (e) => {
		if (e.pointerType === 'touch') return;
		if (interactiu(e.target)) {
			curseur = null;
			dernier = null;
			poser2(null);
			return;
		}
		curseur = [e.clientX - ox, e.clientY - oy];
		poser2(curseur[0], curseur[1]);
		passage(e.clientX, e.clientY, o.rayon);
	};
	const doigt = (e) => {
		const t = e.touches[0];
		if (!t) return;
		// un doigt posé sur un bouton ou un lien : tout le geste lui appartient
		if (e.type === 'touchstart') doigtLibre = !e.target?.closest?.(INTERACTIU);
		if (!doigtLibre) {
			touche = null;
			dernier = null;
			return;
		}
		touche = [t.clientX - ox, t.clientY - oy];
		passage(t.clientX, t.clientY, o.rayonDoigt);
	};
	const fin = () => {
		dernier = null;
		touche = null; // le doigt se lève : ce qu'il tenait part avec son élan
	};
	const sorti = () => {
		curseur = null;
		poser2(null);
	};
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
			// un bloc tout près d'un bord de l'écran se prolonge jusqu'au bord (Romain, 22-11) : sinon il reste entre les deux
			// une bande étroite où les pièces se coincent, repoussées par le bloc vers le bord et par le bord vers le bloc
			// (au-dessus de l'en-tête, toute une rangée de confettis restait collée en haut de l'écran)
			const B = 56;
			zonesTexte = rects.map((R) => ({
				...R,
				l: R.l < B ? Math.min(R.l, -B) : R.l,
				t: R.t < B ? Math.min(R.t, -B) : R.t,
				r: R.r > L - B ? Math.max(R.r, L + B) : R.r,
				b: R.b > H - B ? Math.max(R.b, H + B) : R.b
			}));
			// la page a défilé sous le mot : s'il touche maintenant du texte ou une image, il se défait
			const b = ecrit?.boite;
			if (b && zonesTexte.some((R) => R.l < b.r && R.r > b.l && R.t < b.b && R.b > b.t)) defaire(performance.now());
		},
		arreter() {
			arrete = true;
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
