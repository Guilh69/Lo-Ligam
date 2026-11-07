// Cohérence d'une palette : les mesures de l'outil « Retoucher les couleurs »
// (Romain, 2026-11-07 : « je dois pouvoir changer les couleurs directement sur
// la page »). Fonctions pures, sans dépendance : contrastes WCAG, intensité et
// teinte (OKLCH), simulation du daltonisme, et un verdict en phrases.
//
// Les rôles d'une palette (clés de `roles`) :
//   fond, surface, texte, surClair, surSombre,
//   action, choisi, juste, carton, valeur, tuiles[6]
// `surClair` : texte posé sur une teinte claire ; `surSombre` : sur une teinte sombre.
// Ils s'alignent sur lib/styles/palette.js (TEINTES, BOUTONS, CASES) : une piste
// validée se recopie là-bas, puis `node scripts/palette-css.mjs`.

export const hexVersRgb = (h) => {
	let s = String(h).replace('#', '');
	if (s.length === 3) s = [...s].map((c) => c + c).join('');
	const n = parseInt(s, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const rgbVersHex = (rgb) =>
	'#' +
	rgb
		.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0'))
		.join('');
export const hexValide = (h) => /^#[0-9a-f]{6}$/i.test(String(h));

const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gam = (v) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

export function luminance(hex) {
	const [r, g, b] = hexVersRgb(hex).map(lin);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contraste WCAG entre deux couleurs, de 1 à 21 */
export function contraste(a, b) {
	const x = luminance(a);
	const y = luminance(b);
	return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Le texte (parmi deux) le plus lisible sur un fond */
export function meilleurTexte(fond, clair, sombre) {
	return contraste(fond, clair) >= contraste(fond, sombre) ? clair : sombre;
}

/** Mélange `a` sur `b` : part de `a` entre 0 et 1 (pour le texte secondaire, par exemple) */
export function melanger(a, b, part) {
	const ra = hexVersRgb(a);
	const rb = hexVersRgb(b);
	return rgbVersHex(ra.map((v, i) => v * part + rb[i] * (1 - part)));
}

export function oklab(hex) {
	const [r, g, b] = hexVersRgb(hex).map(lin);
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return {
		L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
	};
}

/** Clarté L (0 à 1), intensité C (0 = gris, 0,15 = vif) et teinte H (degrés) */
export function oklch(hex) {
	const { L, a, b } = oklab(hex);
	return { L, C: Math.hypot(a, b), H: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
}

function depuisOklab(L, a, b) {
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
	];
}

/** Une couleur depuis L, C, H ; si elle sort de l'écran, l'intensité est réduite jusqu'à y tenir */
export function depuisOklch(L, C, H) {
	const h = (H * Math.PI) / 180;
	let c = C;
	for (let i = 0; i < 40; i++) {
		const rgb = depuisOklab(L, c * Math.cos(h), c * Math.sin(h));
		if (rgb.every((v) => v >= -0.0005 && v <= 1.0005)) return rgbVersHex(rgb.map((v) => gam(Math.min(1, Math.max(0, v)))));
		c *= 0.94;
	}
	return rgbVersHex(depuisOklab(L, 0, 0).map((v) => gam(Math.min(1, Math.max(0, v)))));
}

// Daltonisme : matrices de Machado, Oliveira et Fernandes (2009), gravité 1, en RVB linéaire
const DALT = {
	protanopie: [
		[0.152286, 1.052583, -0.204868],
		[0.114503, 0.786281, 0.099216],
		[-0.003882, -0.048116, 1.051998]
	],
	deuteranopie: [
		[0.367322, 0.860646, -0.227968],
		[0.280085, 0.672501, 0.047413],
		[-0.01182, 0.04294, 0.968881]
	]
};
export function simulerDaltonisme(hex, type) {
	const m = DALT[type];
	const c = hexVersRgb(hex).map(lin);
	return rgbVersHex(m.map((l) => gam(Math.min(1, Math.max(0, l[0] * c[0] + l[1] * c[1] + l[2] * c[2])))));
}

/** Écart perçu entre deux couleurs (distance OKLab × 100 : moins de 8, on les confond) */
export function ecart(a, b) {
	const x = oklab(a);
	const y = oklab(b);
	return 100 * Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b);
}

export function nomTeinte(H, C) {
	if (C < 0.03) return 'neutre';
	const t = [
		[25, 'rose'],
		[50, 'brique'],
		[70, 'ocre'],
		[100, 'or'],
		[118, 'olive'],
		[165, 'vert'],
		[225, 'sarcelle'],
		[275, 'bleu'],
		[335, 'violet'],
		[361, 'prune']
	];
	for (const [max, n] of t) if (H < max) return n;
	return 'rose';
}

/** Regroupe des couleurs par teinte (à `tol` degrés près) : [{ nom, H, C, hex: [...] }] */
export function groupesDeTeintes(hexes, tol = 28) {
	const groupes = [];
	for (const hex of hexes) {
		const { H, C } = oklch(hex);
		const g = groupes.find((x) => {
			const d = Math.abs(x.H - H);
			return Math.min(d, 360 - d) <= tol;
		});
		if (g) {
			g.hex.push(hex);
			g.C = Math.max(g.C, C);
		} else groupes.push({ nom: nomTeinte(H, C), H, C, hex: [hex] });
	}
	return groupes;
}

export const SEUIL_CRIANT = 0.1; // intensité OKLCH à partir de laquelle une couleur « crie »
export const SEUIL_CHUCHOTE = 0.04; // en dessous : presque un gris

/**
 * Analyse une palette (les rôles d'un seul thème).
 * Renvoie { contrastes, alertes, bons, criantes, chuchotent, chauds, fond, verdict }.
 */
export function analyser(roles) {
	const r = roles;
	const txt = (f) => meilleurTexte(f, r.surSombre, r.surClair);
	const paires = [
		['Texte sur le fond', r.texte, r.fond, 4.5],
		['Texte sur une surface', r.texte, r.surface, 4.5],
		['Texte secondaire sur le fond', melanger(r.texte, r.fond, 0.72), r.fond, 4.5],
		['Mise en valeur (texte) sur le fond', r.valeur, r.fond, 4.5],
		['Bouton d’action', txt(r.action), r.action, 4.5],
		['Bouton « choisi »', txt(r.choisi), r.choisi, 4.5],
		['Bouton « juste »', txt(r.juste), r.juste, 4.5],
		['Bouton discret', txt(r.carton), r.carton, 4.5],
		...r.tuiles.map((t, i) => [`Tuile ${i + 1}`, txt(t), t, 4.5])
	].map(([nom, a, b, min]) => ({ nom, ratio: contraste(a, b), min, ok: contraste(a, b) >= min }));

	const alertes = [];
	const bons = [];
	const rates = paires.filter((p) => !p.ok);
	if (rates.length) {
		alertes.push(
			`Contraste insuffisant (4,5 requis) : ${rates.map((p) => `${p.nom} ${p.ratio.toFixed(1).replace('.', ',')}`).join(' ; ')}.`
		);
	} else bons.push('Tous les textes passent le contraste AA (4,5).');

	// Couleurs de l'interface : tout sauf le fond, la surface et les textes
	const vives = [r.action, r.choisi, r.juste, r.carton, r.valeur, ...r.tuiles];
	const mesures = vives.map((hex) => ({ hex, ...oklch(hex) }));
	const criantes = groupesDeTeintes(mesures.filter((m) => m.C >= SEUIL_CRIANT).map((m) => m.hex));
	const chuchotent = groupesDeTeintes(
		mesures.filter((m) => m.C >= SEUIL_CHUCHOTE && m.C < SEUIL_CRIANT).map((m) => m.hex)
	).filter((g) => !criantes.some((c) => Math.min(Math.abs(c.H - g.H), 360 - Math.abs(c.H - g.H)) <= 28));

	if (criantes.length > 2) {
		alertes.push(
			`${criantes.length} teintes vives se disputent l’écran (${criantes.map((g) => g.nom).join(', ')}) : au-delà de deux, rien ne ressort.`
		);
	} else {
		bons.push(
			`${criantes.length} teinte${criantes.length > 1 ? 's' : ''} vive${criantes.length > 1 ? 's' : ''} (${criantes.map((g) => g.nom).join(', ') || 'aucune'}) : l’œil sait où aller.`
		);
	}

	// Teintes chaudes voisines (brique, ocre, or) : elles ne se distinguent que par la clarté
	const chauds = groupesDeTeintes(
		mesures.filter((m) => m.C >= 0.08 && m.H >= 20 && m.H <= 100).map((m) => m.hex),
		16
	);
	if (chauds.length >= 3) {
		alertes.push(`${chauds.length} teintes chaudes voisines (${chauds.map((g) => g.nom).join(', ')}) : elles se confondent.`);
	}

	// Tuiles : accordées si même clarté et même intensité (les teintes seules varient).
	// Une tuile qui reprend l'action, le « choisi » ou la mise en valeur est la tuile de
	// tête : elle a le droit de crier.
	const reprises = [r.action, r.choisi, r.valeur].map((x) => x.toLowerCase());
	const tuiles = mesures
		.slice(5)
		.filter((m) => m.C >= SEUIL_CHUCHOTE && !reprises.includes(m.hex.toLowerCase()));
	let accord = null;
	if (tuiles.length >= 2) {
		const teintes = groupesDeTeintes(tuiles.map((m) => m.hex));
		const ecL = Math.max(...tuiles.map((m) => m.L)) - Math.min(...tuiles.map((m) => m.L));
		const ecC = Math.max(...tuiles.map((m) => m.C)) - Math.min(...tuiles.map((m) => m.C));
		if (teintes.length <= 1) {
			accord = { camaieu: true, ecL, ecC, ok: true };
			bons.push('Les tuiles sont en camaïeu d’une seule teinte.');
		} else {
			accord = { ecL, ecC, ok: ecL <= 0.1 && ecC <= 0.06 };
			if (accord.ok) bons.push('Les tuiles sont accordées (clarté et intensité voisines).');
			else
				alertes.push(
					`Tuiles désaccordées : écart de clarté ${(ecL * 100).toFixed(0)} points, d’intensité ${(ecC * 100).toFixed(0)} points. « Accorder et tamiser les tuiles » les met d’aplomb.`
				);
		}
	}

	// Le fond : presque neutre, ou « crème » ?
	const f = oklch(r.fond);
	const fond = {
		...f,
		nom: f.C < 0.012 ? 'neutre' : f.C < 0.025 ? 'légèrement teinté' : f.L > 0.5 ? 'teinté (effet crème)' : 'brun marqué'
	};
	if (f.C >= 0.025 && f.H >= 40 && f.H <= 110 && f.L > 0.5) {
		alertes.push('Le fond est un beige marqué : c’est lui qui donne l’air « crème ».');
	}

	// Daltonisme : l'action et le « juste » restent-ils distincts ?
	const dalt = ['protanopie', 'deuteranopie'].map((t) => ({
		type: t,
		ecart: ecart(simulerDaltonisme(r.action, t), simulerDaltonisme(r.juste, t))
	}));
	const pire = dalt.reduce((a, b) => (a.ecart < b.ecart ? a : b));
	if (pire.ecart < 10) {
		alertes.push(
			`Daltonisme (${pire.type}) : l’action et le « juste » se confondent (écart ${pire.ecart.toFixed(0)}). Il faut aussi un signal autre que la couleur (icône, texte).`
		);
	}

	// La pièce se voit-elle sur le fond ? (information)
	const pieceVisible = contraste(r.carton, r.fond);
	const notes = [];
	if (pieceVisible < 1.3) {
		notes.push(
			`Les boutons discrets se voient surtout par leur ombre (contraste avec le fond ${pieceVisible.toFixed(2).replace('.', ',')}) : leur texte reste le signal principal.`
		);
	}

	const verdict = rates.length || alertes.length >= 3 ? 'À revoir' : alertes.length ? 'Acceptable, avec réserves' : 'Accordée';
	return { contrastes: paires, alertes, bons, notes, criantes, chuchotent, chauds, fond, accord, dalt, pieceVisible, verdict };
}

// La plus forte intensité qu'une teinte peut avoir à une clarté donnée sans sortir de l'écran
function intensiteMax(L, H) {
	const h = (H * Math.PI) / 180;
	let bas = 0;
	let haut = 0.4;
	for (let i = 0; i < 24; i++) {
		const m = (bas + haut) / 2;
		const rgb = depuisOklab(L, m * Math.cos(h), m * Math.sin(h));
		if (rgb.every((v) => v >= -0.0005 && v <= 1.0005)) bas = m;
		else haut = m;
	}
	return bas;
}

export const INTENSITE_TAMISEE = 0.085; // celle de la piste 3 : colorée, mais qui ne crie pas

/**
 * Met les tuiles d'aplomb : même clarté (la moyenne, tenue entre 0,42 et 0,55 pour que
 * le texte blanc passe) et même intensité (la moyenne, au plus tamisée, et au plus ce que
 * la teinte la moins vive peut atteindre). Les teintes sont conservées ; la tuile de tête
 * (`garder`) n'est pas touchée.
 */
export function accorderTuiles(tuiles, garder = 0, texte = '#ffffff') {
	const mes = tuiles.map((t) => oklch(t));
	const cibles = mes.filter((m, i) => i !== garder && m.C >= SEUIL_CHUCHOTE);
	if (!cibles.length) return tuiles;
	const moyenne = cibles.reduce((s, m) => s + m.C, 0) / cibles.length;
	let L = Math.min(0.55, Math.max(0.42, cibles.reduce((s, m) => s + m.L, 0) / cibles.length));
	const fabriquer = (l) => {
		const C = Math.min(moyenne, INTENSITE_TAMISEE, ...cibles.map((m) => intensiteMax(l, m.H) * 0.98));
		return tuiles.map((t, i) => (i === garder || mes[i].C < SEUIL_CHUCHOTE ? t : depuisOklch(l, C, mes[i].H)));
	};
	let sortie = fabriquer(L);
	// le texte posé dessus doit passer 4,5 : on fonce un peu les tuiles tant qu'il le faut
	const ok = (s) => s.every((t, i) => i === garder || contraste(texte, t) >= 4.6);
	while (!ok(sortie) && L > 0.3) {
		L -= 0.01;
		sortie = fabriquer(L);
	}
	return sortie;
}
