// Les esquisses de l'atelier S'imagina (essai du 2026-11-13). Romain : le visiteur voit « une esquisse tout de
// suite », un dessin assumé posé sur la photo, pas un faux réaliste. Trois styles à comparer :
//
//   traç   : un trait fin d'un seul poids, aux couleurs du logo (traits brique, points or aux quatre coins),
//            qui se trace sous les yeux ;
//   papièr : une pièce de papier découpé posée à plat sur le mur, ombre courte et nette (papier.css) ;
//   calc   : le calque de l'urbaniste. Un voile de papier calque, les arêtes prolongées au-delà des coins, et
//            les lignes de fuite qui partent vers le fond : la mesure du mur se voit, le mot est une annotation.
//
// Une esquisse est une liste de formes simples dans un repère à plat (largeur 1000, hauteur 1000 / proportion), que
// deux moteurs dessinent à l'identique : le SVG de la page (couché sur le mur par matrix3d) et le canevas qui
// fabrique l'image à enregistrer. Les couleurs sont des noms de jetons (`--imagina-<nom>`, registre Colors), lus au
// moment de dessiner, jamais recopiés ici.
import { omografia, aplicar } from './perspectiva.js';

export const ESTILS_ESQUISSA = [
	{
		id: 'traç',
		nom: 'Le trait',
		mot: 'Un trait fin qui se dessine, aux couleurs du logo.'
	},
	{
		id: 'papièr',
		nom: 'Le papier découpé',
		mot: 'Une pièce de papier posée sur le mur.'
	},
	{
		id: 'calc',
		nom: 'Le calque',
		mot: 'Le croquis de l’urbaniste : le mur mesuré, le mot annoté.'
	}
];

/** Les jetons de couleur dont se servent les esquisses (une ligne chacun dans lib/colors/registre.js). */
export const TINTAS = ['traç', 'ponch', 'papier', 'ombra', 'calc', 'grafit'];

export const LARG = 1000;
/** La marge du canevas à plat autour de la surface, au moins (le calque et sa note débordent : voir marge()). */
export const MARGE = 40;

const POLICES = {
	luciole: "'Luciole', system-ui, sans-serif",
	limelight: "'Limelight', Georgia, serif"
};
export const police = (p, pes, talha) => `${pes} ${talha}px ${POLICES[p]}`;

/**
 * Le mot coupé en lignes, et sa taille, pour tenir dans une boîte de `l` × `h` (unités du repère à plat).
 * `mesura(tèxte, police)` rend la largeur du texte à la taille 100. On essaie 1, 2 ou 3 lignes (coupées aux
 * espaces, au plus équilibré) et l'on garde la plus grande taille.
 */
export function compausar(mot, { l, h, familha, pes, mesura, interlinha = 1.12, lignes = null }) {
	const font = police(familha, pes, 100);
	const mots = mot.split(/\s+/).filter(Boolean);
	const candidats = [];
	if (lignes) candidats.push(lignes);
	else {
		candidats.push([mots.join(' ')]);
		if (mots.length >= 2)
			for (let i = 1; i < mots.length; i++) candidats.push([mots.slice(0, i).join(' '), mots.slice(i).join(' ')]);
		if (mots.length >= 3)
			for (let i = 1; i < mots.length - 1; i++)
				for (let j = i + 1; j < mots.length; j++)
					candidats.push([mots.slice(0, i).join(' '), mots.slice(i, j).join(' '), mots.slice(j).join(' ')]);
	}
	let melhor = null;
	for (const ls of candidats) {
		const larg = Math.max(...ls.map((t) => mesura(t, font)));
		const talha = Math.min(h / (ls.length * interlinha), (l / larg) * 100);
		if (!melhor || talha > melhor.talha * 1.04) melhor = { lignes: ls, talha };
	}
	return { ...melhor, interlinha };
}

// les lignes de texte d'une boîte centrée en (cx, cy) : une forme 'text' par ligne, ligne de base calculée
function textes(
	c,
	{
		cx,
		cy,
		familha,
		pes,
		tinta,
		opacitat = 1,
		contorn = 0,
		traçar = false,
		dec = [0, 0],
		majuscula = false,
		retard = 0
	}
) {
	const { lignes, talha, interlinha } = c;
	const haut = lignes.length * interlinha * talha;
	return lignes.map((t, i) => ({
		t: 'text',
		x: cx + dec[0],
		y: cy - haut / 2 + (i + 0.5) * interlinha * talha + 0.35 * talha + dec[1],
		text: majuscula ? t.toUpperCase() : t,
		talha,
		familha,
		pes,
		tinta,
		opacitat,
		contorn,
		traçar,
		retard: retard + i * 0.25
	}));
}

/**
 * L'esquisse d'un mot sur une surface de proportion `prop` (largeur / hauteur réelles).
 * `px` = unités du repère à plat par pixel affiché (les traits gardent leur finesse quelle que soit la surface).
 * Renvoie { W, H, formas, fuga } ; fuga = vrai si les lignes de fuite se dessinent sur la photo autour.
 */
export function esquissa({ estil, mot, prop, px, mesura, cobrir = false, remplaça = false }) {
	const W = LARG,
		H = LARG / Math.max(0.2, Math.min(12, prop));
	const p = (n) => n * px; // n pixels affichés, en unités
	// une marge de n pixels, jamais plus d'une part `max` du petit côté (sur une petite surface, le mot passe avant)
	const mp = (n, max = 0.07) => Math.min(p(n), max * Math.min(W, H));
	// la boîte du texte : ce qui reste une fois les marges ôtées
	const boita = (ml, mh) => ({ l: W - 2 * mp(ml), h: H - 2 * mp(mh, 0.12) });
	const f = [];
	const tèxte = mot.oc;
	if (estil === 'traç') {
		if (cobrir)
			f.push({
				t: 'rect',
				x: 0,
				y: 0,
				l: W,
				h: H,
				r: p(6),
				fons: 'papier',
				opacitat: 1
			});
		const i = mp(4, 0.025);
		f.push({
			t: 'rect',
			x: i,
			y: i,
			l: W - 2 * i,
			h: H - 2 * i,
			r: p(3),
			trach: 'traç',
			espes: p(1.6),
			traçar: true,
			retard: 0
		});
		const k = mp(10, 0.06);
		for (const [x, y] of [
			[k, k],
			[W - k, k],
			[W - k, H - k],
			[k, H - k]
		])
			f.push({ t: 'ponch', x, y, r: p(2.4), fons: 'ponch', retard: 0.8 });
		const c = compausar(tèxte, {
			l: W - 2 * mp(17, 0.1),
			h: H - 2 * mp(15, 0.14),
			familha: 'luciole',
			pes: 700,
			mesura,
			lignes: mot.lignes
		});
		// sur la pierre nue, un liseré de papier sous les lettres : le mot se lit même petit
		if (!cobrir)
			f.push(
				...textes(c, {
					cx: W / 2,
					cy: H / 2,
					familha: 'luciole',
					pes: 700,
					tinta: 'papier',
					opacitat: 0.85,
					contorn: p(3.2),
					retard: 0.45
				}).map((t) => ({ ...t, pausar: true }))
			);
		f.push(
			...textes(c, {
				cx: W / 2,
				cy: H / 2,
				familha: 'luciole',
				pes: 700,
				tinta: 'traç',
				contorn: p(1),
				traçar: true,
				retard: 0.45
			})
		);
		return { W, H, formas: f, fuga: false };
	}
	if (estil === 'papièr') {
		const r = p(5);
		f.push({
			t: 'rect',
			x: 0,
			y: p(3),
			l: W,
			h: H,
			r,
			fons: 'ombra',
			opacitat: 0.32,
			pausar: true,
			retard: 0
		});
		f.push({
			t: 'rect',
			x: 0,
			y: 0,
			l: W,
			h: H,
			r,
			fons: 'papier',
			pausar: true,
			retard: 0
		});
		const c = compausar(tèxte, {
			...boita(14, 11),
			familha: 'limelight',
			pes: 400,
			mesura,
			lignes: mot.lignes
		});
		f.push(
			...textes(c, {
				cx: W / 2,
				cy: H / 2,
				familha: 'limelight',
				pes: 400,
				tinta: 'ombra',
				opacitat: 0.28,
				dec: [0, p(1.5)],
				retard: 0.25
			}).map((x) => ({ ...x, pausar: true }))
		);
		f.push(
			...textes(c, {
				cx: W / 2,
				cy: H / 2,
				familha: 'limelight',
				pes: 400,
				tinta: 'traç',
				retard: 0.25
			}).map((x) => ({ ...x, pausar: true }))
		);
		return { W, H, formas: f, fuga: false };
	}
	// calc : le voile déborde de 6 px ; les arêtes dépassent les coins de 16 px ; l'annotation (le mot en français)
	// s'écrit sous la surface, sur le voile
	const v = p(6),
		nota = p(20);
	f.push({
		t: 'rect',
		x: -v,
		y: -v,
		l: W + 2 * v,
		h: H + 2 * v + nota,
		r: 0,
		fons: 'calc',
		opacitat: cobrir ? 0.9 : 0.66,
		pausar: true,
		retard: 0
	});
	const d = p(16);
	const arestas = [
		[-d, 0, W + d, 0],
		[W, -d, W, H + d],
		[W + d, H, -d, H],
		[0, H + d, 0, -d]
	];
	arestas.forEach(([x1, y1, x2, y2], n) =>
		f.push({
			t: 'linha',
			x1,
			y1,
			x2,
			y2,
			trach: 'grafit',
			espes: p(1),
			traçar: true,
			retard: 0.12 * n
		})
	);
	const c = compausar(tèxte.toUpperCase(), {
		...boita(15, 13),
		familha: 'luciole',
		pes: 400,
		mesura,
		lignes: mot.lignes?.map((x) => x.toUpperCase())
	});
	f.push(
		...textes(c, {
			cx: W / 2,
			cy: H / 2,
			familha: 'luciole',
			pes: 400,
			tinta: 'grafit',
			majuscula: true,
			retard: 0.7
		}).map((x) => ({ ...x, pausar: true }))
	);
	f.push({
		t: 'text',
		x: 0,
		y: H + nota - p(5),
		// la note du croquis : ce qui est écrit aujourd'hui (une plaque remplacée), ou le mot en français
		text: remplaça ? `aujourd’hui : ${mot.fr}` : `${mot.fr.toLowerCase()}, en français`,
		talha: p(11),
		familha: 'luciole',
		pes: 400,
		estil: 'italic',
		ancra: 'start',
		tinta: 'grafit',
		opacitat: 0.85,
		pausar: true,
		retard: 1.1
	});
	return { W, H, formas: f, fuga: true };
}

/** La marge qu'il faut au canevas à plat pour ne rien couper de l'esquisse (en unités du repère). */
export function marge({ W, H, formas }) {
	let m = MARGE;
	for (const f of formas) {
		if (f.t === 'rect') m = Math.max(m, -f.x, -f.y, f.x + f.l - W, f.y + f.h - H);
		else if (f.t === 'linha') m = Math.max(m, -f.x1, -f.x2, -f.y1, -f.y2, f.x1 - W, f.x2 - W, f.y1 - H, f.y2 - H);
		else if (f.t === 'text') m = Math.max(m, f.y + 0.35 * f.talha - H, f.talha - f.y);
		else if (f.t === 'ponch') m = Math.max(m, f.r - f.x, f.r - f.y);
	}
	return Math.ceil(m + 4);
}

/** Les lignes de fuite d'une surface : chaque arête prolongée au-delà de ses deux coins (fractions de la photo). */
export function fugas(quad, allonge = 0.7) {
	const out = [];
	for (let i = 0; i < 4; i++) {
		const a = quad[i],
			b = quad[(i + 1) % 4];
		const dx = b[0] - a[0],
			dy = b[1] - a[1];
		out.push([b[0], b[1], b[0] + dx * allonge, b[1] + dy * allonge]);
		out.push([a[0], a[1], a[0] - dx * allonge, a[1] - dy * allonge]);
	}
	return out;
}

/* ------------------------------------------------------------------ l'image à enregistrer (canevas) */

/** Dessine les formes d'une esquisse sur un contexte 2D déjà placé dans le repère à plat. */
export function dessenhar(ctx, formas, tinta) {
	for (const f of formas) {
		ctx.save();
		ctx.globalAlpha = f.opacitat ?? 1;
		if (f.t === 'rect') {
			ctx.beginPath();
			if (f.r > 0 && ctx.roundRect) ctx.roundRect(f.x, f.y, f.l, f.h, f.r);
			else ctx.rect(f.x, f.y, f.l, f.h);
			if (f.fons) {
				ctx.fillStyle = tinta(f.fons);
				ctx.fill();
			}
			if (f.trach) {
				ctx.strokeStyle = tinta(f.trach);
				ctx.lineWidth = f.espes;
				ctx.stroke();
			}
		} else if (f.t === 'ponch') {
			ctx.beginPath();
			ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
			ctx.fillStyle = tinta(f.fons);
			ctx.fill();
		} else if (f.t === 'linha') {
			ctx.beginPath();
			ctx.moveTo(f.x1, f.y1);
			ctx.lineTo(f.x2, f.y2);
			ctx.strokeStyle = tinta(f.trach);
			ctx.lineWidth = f.espes;
			ctx.lineCap = 'round';
			ctx.stroke();
		} else if (f.t === 'text') {
			ctx.font = `${f.estil === 'italic' ? 'italic ' : ''}${police(f.familha, f.pes, f.talha)}`;
			ctx.textAlign = f.ancra === 'start' ? 'left' : 'center';
			ctx.textBaseline = 'alphabetic';
			ctx.fillStyle = tinta(f.tinta);
			ctx.fillText(f.text, f.x, f.y);
			if (f.contorn) {
				ctx.strokeStyle = tinta(f.tinta);
				ctx.lineWidth = f.contorn;
				ctx.lineJoin = 'round';
				ctx.strokeText(f.text, f.x, f.y);
			}
		}
		ctx.restore();
	}
}

/**
 * Pose une image à plat (canevas `plat`, qui couvre le repère [-m, W + m] × [-m, H + m] à `s` pixels par unité) sur les quatre coins `quad` (pixels de l'image d'arrivée) : chaque pixel d'arrivée va chercher
 * sa couleur dans l'image à plat (homographie inverse, lecture bilinéaire), puis se fond sur la photo.
 */
export function coucar(dest, plat, { W, H, s, quad, m = MARGE }) {
	const Hinv = omografia(quad, [
		[0, 0],
		[W, 0],
		[W, H],
		[0, H]
	]);
	const Hdir = omografia(
		[
			[0, 0],
			[W, 0],
			[W, H],
			[0, H]
		],
		quad
	);
	if (!Hinv || !Hdir) return;
	const bords = [
		[-m, -m],
		[W + m, -m],
		[W + m, H + m],
		[-m, H + m]
	].map((p) => aplicar(Hdir, p));
	const x0 = Math.max(0, Math.floor(Math.min(...bords.map((p) => p[0])))),
		x1 = Math.min(dest.width - 1, Math.ceil(Math.max(...bords.map((p) => p[0])))),
		y0 = Math.max(0, Math.floor(Math.min(...bords.map((p) => p[1])))),
		y1 = Math.min(dest.height - 1, Math.ceil(Math.max(...bords.map((p) => p[1]))));
	const pw = plat.width,
		ph = plat.height,
		src = plat.data,
		dst = dest.data;
	for (let y = y0; y <= y1; y++)
		for (let x = x0; x <= x1; x++) {
			const [u, v] = aplicar(Hinv, [x + 0.5, y + 0.5]);
			const fx = (u + m) * s - 0.5,
				fy = (v + m) * s - 0.5;
			if (fx < 0 || fy < 0 || fx >= pw - 1 || fy >= ph - 1) continue;
			const ix = fx | 0,
				iy = fy | 0,
				ax = fx - ix,
				ay = fy - iy;
			const o = (iy * pw + ix) * 4;
			// les quatre voisins, pesés ; les couleurs sont lues multipliées par leur opacité, pour qu'un bord
			// transparent n'assombrisse pas le trait
			const w = [(1 - ax) * (1 - ay), ax * (1 - ay), (1 - ax) * ay, ax * ay];
			const os = [o, o + 4, o + pw * 4, o + pw * 4 + 4];
			let al = 0,
				r = 0,
				g = 0,
				b = 0;
			for (let n = 0; n < 4; n++) {
				const a = (src[os[n] + 3] / 255) * w[n];
				al += a;
				r += src[os[n]] * a;
				g += src[os[n] + 1] * a;
				b += src[os[n] + 2] * a;
			}
			if (al <= 0) continue;
			const d = (y * dest.width + x) * 4;
			dst[d] = r + dst[d] * (1 - al);
			dst[d + 1] = g + dst[d + 1] * (1 - al);
			dst[d + 2] = b + dst[d + 2] * (1 - al);
		}
}
