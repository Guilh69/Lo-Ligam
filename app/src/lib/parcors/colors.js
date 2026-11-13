// Les couleurs du parcours : celles des cases de séance de la page module
// (PALETAS.charta) et leurs nuances voisines (Romain, 2026-11-02 : « la
// logique des cases et des couleurs voisines »). Le texte d'une case est
// crème ou encre, celui des deux qui contraste le plus (WCAG, 4,5:1 au moins
// pour toutes les teintes ci-dessous, mesuré le 2026-11-02).
import { PALETAS } from '$lib/apren/teulas.js';
import { quandCambia } from '$lib/styles/palette.js';

export const CREMA = '#fbf1e1';
export const TINTA = '#2a1a10';

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** mélange de deux couleurs (t = 0 : a, t = 1 : b) */
export const mesclar = (a, b, t) => hex(rgb(a).map((v, i) => v + (rgb(b)[i] - v) * t));

function luminancia(h) {
	const [r, g, b] = rgb(h).map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** rapport de contraste WCAG entre deux couleurs */
export function contrast(a, b) {
	const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
	return (x + 0.05) / (y + 0.05);
}

/** crème ou encre : la plus lisible sur ce fond */
export const tintaPer = (fons) => (contrast(fons, CREMA) >= contrast(fons, TINTA) ? CREMA : TINTA);

/** une case : [fond, texte] */
export const teula = (fons) => [fons, tintaPer(fons)];

// Les cinq premières couleurs des cases de séance, dans leur ordre (brique,
// pétrole, olive, bleu, or), puis la prune ; trois voisines de la charte
// (ocre, caramel, sarcelle) pour que les huit unités de l'A1 aient chacune la
// sienne.
export const OCRE = '#c98a2b';
export const CARAMEL = '#8a4f12';
export const SARCELA = '#0b7372';
// (Recalculées quand la palette change : Romain règle les couleurs depuis le site, lib/colors, 2026-11-13.)
export let BRICA, PETROLI, OLIVA, BLAU, AUR, PRUNA;
/** la couleur d'une unité (1 à 8), puis la ronde recommence */
export let UNITATS;
function seguirPaleta() {
	[BRICA, PETROLI, OLIVA, BLAU, AUR, PRUNA] = PALETAS.charta.map(([c]) => c);
	UNITATS = [BRICA, PETROLI, OLIVA, BLAU, PRUNA, OCRE, CARAMEL, SARCELA];
}
seguirPaleta();
quandCambia(seguirPaleta);
export const colorUnitat = (n) => UNITATS[(Math.max(1, n) - 1) % UNITATS.length];

/**
 * Quatre nuances voisines d'une couleur, comme les sous-pages de Se parla
 * (PALETAS.verd…) : la couleur, plus sombre, plus claire, très claire. Une
 * couleur claire (l'or, l'ocre) fonce davantage, sans quoi ni la crème ni
 * l'encre n'y tiennent 4,5:1.
 */
export const nuanças = (c) =>
	[c, mesclar(c, '#000000', tintaPer(c) === TINTA ? 0.5 : 0.3), mesclar(c, '#ffffff', 0.38), mesclar(c, '#ffffff', 0.58)].map(teula);
