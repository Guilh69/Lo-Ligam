// Los panièrs : comment les mots rangés remplissent le panier (Romain,
// 05-11 : « je veux que ça épouse parfaitement la forme jusqu'à remplir
// totalement »). Chaque mot fait monter le niveau d'une part de la hauteur du
// panier, à la mesure de sa longueur : le dernier mot du thème arrive donc
// pile au bord, quel que soit l'ordre d'arrivée. Les mots se posent en rangs,
// du fond vers le bord ; un rang couvre toute la largeur intérieure du panier
// à sa hauteur (les bords suivent la courbe du panier), et la hauteur sous le
// niveau se partage entre les rangs pour que le plus petit texte soit le plus
// grand possible. Coordonnées : celles du dessin du panier (viewBox 0 0 200
// 110, Paniers.svelte).

// le flanc gauche du corps : M6 14 C9 58 17 96 32 107
const P = [
	[6, 14],
	[9, 58],
	[17, 96],
	[32, 107]
];
export const VB = { l: 200, h: 110 };
export const BORD = 14; // le bord du panier (le milieu de l'ouverture)
const RY = 9; // la demi-hauteur de l'ouverture, une ellipse (rx 94, ry 9)
/** le bas de la lèvre de devant : le niveau monte jusque-là, le texte reste dessous */
export const LABRE = BORD + RY;
/** le haut de l'ouverture : panier plein, le rang du dessus la couvre */
export const CIM = BORD - RY;
export const FONS = 106.5; // le fond, à l'intérieur (le trait du fond est à 107)
const PAROI = 1; // les tuiles vont jusqu'au trait de la paroi
const MARGE = 3.5; // le texte, lui, reste un peu plus loin de la paroi
const K = 1.15; // rapport habituel hauteur/largeur d'une unité du dessin à l'écran
// la chasse des lettres de Luciole grasse, en em (mesurée dans le navigateur
// le 05-11) ; une lettre absente compte pour un « n »
// prettier-ignore
const CHASSA = { " ": 0.39, "!": 0.324, ",": 0.308, "-": 0.48, ".": 0.324, "?": 0.537, "A": 0.774, "B": 0.724, "C": 0.668, "D": 0.775, "E": 0.644, "M": 1.022, "N": 0.812, "O": 0.828, "P": 0.695, "Q": 0.828, "S": 0.644, "V": 0.774, "a": 0.611, "b": 0.665, "c": 0.51, "d": 0.666, "e": 0.585, "f": 0.479, "g": 0.632, "h": 0.686, "i": 0.36, "j": 0.36, "l": 0.36, "m": 0.994, "n": 0.686, "o": 0.639, "p": 0.666, "q": 0.666, "r": 0.491, "s": 0.534, "t": 0.5, "u": 0.686, "v": 0.593, "z": 0.554, "Ò": 0.828, "á": 0.611, "è": 0.585, "é": 0.585, "í": 0.36, "ò": 0.639, "’": 0.292, "…": 0.976 };
const SEGUR = 1.04; // un peu de jeu, pour les arrondis du navigateur
const COIXIN = 0.6; // marge intérieure d’une tuile et écart, en em
// corps du texte / hauteur du rang, sur une ligne, et sur deux lignes
// (interligne 1,15 : deux lignes tiennent 2,3 corps, avec un peu d'air)
const OBJ = { 1: 0.62, 2: 0.39 };
// la part de la hauteur du rang qu'occupe le texte (pour le garder loin de la
// paroi, là où le panier se resserre)
const BLOC = { 1: 0.62, 2: 0.9 };

function bez(t, k) {
	const u = 1 - t;
	return u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k];
}
// le flanc, x en fonction de y, relevé tous les quarts d'unité (y croît avec t)
const PAS_Y = 0.25;
const FLANC = (() => {
	const pts = Array.from({ length: 801 }, (_, i) => [bez(i / 800, 0), bez(i / 800, 1)]);
	const t = [];
	let j = 0;
	for (let y = P[0][1]; y <= P[3][1] + 1e-9; y += PAS_Y) {
		while (j < pts.length - 2 && pts[j + 1][1] < y) j++;
		const [x0, y0] = pts[j];
		const [x1, y1] = pts[j + 1];
		t.push(x0 + ((x1 - x0) * (y - y0)) / (y1 - y0 || 1));
	}
	return t;
})();
function costat(y) {
	const u = (Math.min(Math.max(y, P[0][1]), P[3][1]) - P[0][1]) / PAS_Y;
	const i = Math.min(Math.floor(u), FLANC.length - 2);
	return FLANC[i] + (FLANC[i + 1] - FLANC[i]) * (u - i);
}
/** x du flanc gauche à la hauteur y, là où s'arrête le texte */
export const flanc = (y) => costat(y) + MARGE;
/** x de la paroi gauche à la hauteur y, là où s'arrêtent les tuiles */
const paret = (y) => costat(y) + PAROI;
/** largeur intérieure à la hauteur y */
export const largor = (y) => VB.l - 2 * flanc(y);

// le niveau monte régulièrement, mot après mot : chaque mot reçoit une part
// de la hauteur du panier à la mesure de sa longueur (avec une part en
// volume, le haut, plus large, se remplissait trop vite : à 4 mots sur 5 le
// panier paraissait plein)
const HAUT = FONS - LABRE;
/** hauteur y du niveau quand la fraction f du panier est remplie */
export function nivel(f) {
	return FONS - Math.min(Math.max(f, 0), 1) * HAUT;
}

// la part d'un mot : sa longueur, plus un fond fixe (un mot court ne fait
// pas monter le niveau d'un rien)
const pes = (m) => m.oc.length + 5;
const chassa = (t) => [...t].reduce((s, c) => s + (CHASSA[c] ?? 0.686), 0) * SEGUR;
// la plus longue ligne d'un texte, en em, sur une ligne ou deux : une phrase
// se coupe à l'espace qui équilibre le mieux les deux lignes (jamais devant
// « ! ? : ; … », que le navigateur garde collés au mot)
function lonc(oc, lin) {
	let m = chassa(oc);
	if (lin === 2)
		for (let i = 1; i < oc.length - 1; i++)
			if (oc[i] === ' ' && !/[!?:;…»]/.test(oc[i + 1])) m = Math.min(m, Math.max(chassa(oc.slice(0, i)), chassa(oc.slice(i + 1))));
	return m;
}
// la largeur que demande une tuile, en corps de texte
const besonh = (m, lin) => lonc(m.oc, lin) + COIXIN;
// le bas du texte d'un rang (y0 : le bas du rang, h : sa hauteur) : c'est là
// que le panier est le plus étroit sous le texte
const basTexte = (y0, h, lin) => y0 - ((1 - BLOC[lin]) / 2) * h;
/** le plus grand corps (en unités de largeur du dessin) que permet la largeur d'un rang, au bas de son texte */
const corsLarg = (mots, yb, lin) => largor(yb) / mots.reduce((s, m) => s + besonh(m, lin), 0);

// Les hauteurs des rangs entre le fond et le niveau `nautor` : on cherche le
// plus grand corps de texte que tous les rangs peuvent avoir à la fois (le
// plus petit texte, le plus lisible possible), chaque rang prenant la hauteur
// juste nécessaire, sur une ligne ou deux ; le reste se partage à proportion.
function apilar(grops, nautor, k) {
	const essai = (F) => {
		let y = FONS;
		const hs = [];
		for (const g of grops) {
			let h = Infinity;
			for (const lin of [1, 2]) {
				const hl = F / (OBJ[lin] * k);
				if (corsLarg(g, basTexte(y, hl, lin), lin) >= F) h = Math.min(h, hl);
			}
			if (h === Infinity) return null;
			hs.push(h);
			y -= h;
			if (y < nautor - 1e-9) return null;
		}
		return hs;
	};
	let lo = 0;
	let hi = 400;
	for (let i = 0; i < 40; i++) {
		const mid = (lo + hi) / 2;
		if (essai(mid)) lo = mid;
		else hi = mid;
	}
	const hs = essai(lo);
	const s = hs.reduce((a, b) => a + b, 0);
	// hauteur restante partagée à proportion (ou à parts égales si rien ne tient)
	return s > 0 ? hs.map((h) => (h * (FONS - nautor)) / s) : hs.map(() => (FONS - nautor) / hs.length);
}

// les rangs posés : positions, lignes et corps du texte
function disposar(grops, nautor, k) {
	const hs = apilar(grops, nautor, k);
	let y = FONS;
	return grops.map((g, i) => {
		const y0 = y;
		const y1 = y - hs[i];
		y = y1;
		const de = (lin) => ({ lin, fh: OBJ[lin] * (y0 - y1) * k, fw: corsLarg(g, basTexte(y0, y0 - y1, lin), lin) });
		const ecran = (c) => Math.min(c.fh, c.fw);
		const [c1, c2] = [de(1), de(2)];
		// deux lignes seulement si le texte y gagne nettement
		const c = ecran(c2) > ecran(c1) * 1.08 ? c2 : c1;
		return { y0, y1, ...c, cors: ecran(c) };
	});
}

// comparer deux piles : la meilleure a le plus petit texte le plus grand,
// puis le suivant, etc. (à 1 % près)
function melhor(a, b) {
	const x = a.map((r) => r.cors).sort((p, q) => p - q);
	const y = b.map((r) => r.cors).sort((p, q) => p - q);
	for (let i = 0; i < Math.min(x.length, y.length); i++) {
		if (x[i] > y[i] * 1.01) return true;
		if (y[i] > x[i] * 1.01) return false;
	}
	return true;
}

/**
 * Les rangs d'un panier. `placats` : les mots rangés, dans l'ordre d'arrivée ;
 * `totes` : tous les mots qu'il recevra (pour la part de chacun). Renvoie,
 * du fond vers le bord : { k, y0 (bas), y1 (haut), ins (retrait du texte),
 * fh, fw (corps du texte possible en % de la hauteur et de la largeur du
 * panier), lin (une ligne ou deux), mots: [{ oc, n (largeur demandée), j, dos }] }.
 */
export function rengs(placats, totes, k = K) {
	const total = totes.reduce((s, m) => s + pes(m), 0) || 1;
	let grops = [];
	let cum = 0;
	placats.forEach((m, j) => {
		cum += pes(m);
		const mot = { oc: m.oc, j, dos: m.panier === 'ab' };
		if (!grops.length) {
			grops = [[mot]];
			return;
		}
		// le mot rejoint le rang du dessus ou en ouvre un nouveau : ce qui
		// laisse les textes les plus grands (les rangs déjà faits ne changent pas)
		const nautor = nivel(cum / total);
		const ensem = [...grops.slice(0, -1), [...grops.at(-1), mot]];
		const sol = [...grops, [mot]];
		grops = melhor(disposar(ensem, nautor, k), disposar(sol, nautor, k)) ? ensem : sol;
	});
	if (!grops.length) return [];
	const pila = disposar(grops, nivel(cum / total), k);
	return pila.map((r, i) => {
		const g = grops[i];
		// le bas du texte, là où le panier est le plus étroit sous lui
		const yb = basTexte(r.y0, r.y0 - r.y1, r.lin);
		// panier plein : le rang du dessus monte couvrir l'ouverture, son texte
		// reste sous la lèvre (ras : la hauteur ajoutée au-dessus du texte)
		const ras = i === pila.length - 1 && r.y1 <= LABRE + 1e-6 ? LABRE - CIM : 0;
		return {
			k: g[0].j,
			y0: r.y0,
			y1: r.y1,
			ras,
			ins: flanc(yb),
			fh: (r.fh * 100) / (VB.h * k),
			fw: (r.fw * 100) / VB.l,
			lin: r.lin,
			mots: g.map((m) => ({ ...m, n: +besonh(m, r.lin).toFixed(3) }))
		};
	});
}

/** une espace insécable devant « ! ? : ; » » : la ponctuation ne passe jamais
 * seule à la ligne (« Cossí te dison / ? ») */
export const insecable = (t) => t.replace(/ (?=[!?:;»])/g, '\u00a0');

/** le contour intérieur du panier, pour découper la pile (clip-path) */
export const DECOPA = (() => {
	// les parois, du bord au fond, puis, en haut, la moitié arrière de l'ouverture
	const pts = [];
	for (let y = BORD; y <= FONS; y += 1.5) pts.push([paret(y), y]);
	pts.push([paret(FONS), FONS]);
	const g = pts.map(([x, y]) => `${((x / VB.l) * 100).toFixed(2)}% ${((y / VB.h) * 100).toFixed(2)}%`);
	const d = pts
		.slice()
		.reverse()
		.map(([x, y]) => `${(((VB.l - x) / VB.l) * 100).toFixed(2)}% ${((y / VB.h) * 100).toFixed(2)}%`);
	const rx = VB.l / 2 - paret(BORD);
	const arc = Array.from({ length: 23 }, (_, i) => {
		const t = (Math.PI * (i + 1)) / 24;
		return `${(((VB.l / 2 + rx * Math.cos(t)) / VB.l) * 100).toFixed(2)}% ${(((BORD - (RY - 1) * Math.sin(t)) / VB.h) * 100).toFixed(2)}%`;
	});
	return `polygon(${g.join(', ')}, ${d.join(', ')}, ${arc.join(', ')})`;
})();
