// Revirar : découper une phrase en mots (logique pure, sans écran).
// Les apostrophes (l’ostal), les traits d'union (dona-me) et la ponctuation
// séparent les mots ; le point intérieur (n·h, s·h) reste dans le mot ; les
// majuscules sont gardées pour l'affichage et rabaissées pour la recherche.

/** Petits mots grammaticaux : pas cherchés dans lo Basic (articles, pronoms, prépositions). */
export const MOTS_OUTILS = new Set([
	'los', 'las', 'una', 'unas', 'del', 'dels', 'als', 'amb', 'que', 'per', 'sus', 'sul', 'dins',
	'nos', 'vos', 'mon', 'ton', 'son', 'mas', 'mos', 'tas', 'tos', 'sas', 'sos'
]);

const MOT = /(\p{L}+(?:·\p{L}+)*)(['’])?/gu;

/** Les mots d'une phrase : [{ brut, mot, elision }] (mot = minuscules, elision = suivi d'une apostrophe). */
export function decouper(phrase) {
	const r = [];
	for (const m of String(phrase ?? '').normalize('NFC').matchAll(MOT)) r.push({ brut: m[1], mot: m[1].toLowerCase(), elision: Boolean(m[2]) });
	return r;
}

/**
 * Pourquoi un mot n'est pas cherché dans lo Basic, ou null s'il l'est :
 * 'elision' (l’, d’, m’…), 'interne' (point intérieur), 'court' (moins de 3
 * lettres : l'API refuse), 'outil' (mot grammatical).
 */
export function raisonNonCherche(t) {
	if (t.elision) return 'elision';
	if (t.mot.includes('·')) return 'interne';
	if ([...t.mot].length < 3) return 'court';
	if (MOTS_OUTILS.has(t.mot)) return 'outil';
	return null;
}

/** Les mots distincts à envoyer à la vérification, dans l'ordre. */
export function motsACercar(tokens) {
	return [...new Set(tokens.filter((t) => !raisonNonCherche(t)).map((t) => t.mot))];
}

/**
 * La phrase en morceaux, ponctuation et espaces conservés :
 * [{ texte, token? }] (token présent pour un mot, absent pour le reste).
 */
export function morceaux(phrase) {
	const texte = String(phrase ?? '').normalize('NFC');
	const r = [];
	let fin = 0;
	for (const m of texte.matchAll(MOT)) {
		if (m.index > fin) r.push({ texte: texte.slice(fin, m.index) });
		r.push({ texte: m[1], token: { brut: m[1], mot: m[1].toLowerCase(), elision: Boolean(m[2]) } });
		if (m[2]) r.push({ texte: m[2] });
		fin = m.index + m[0].length;
	}
	if (fin < texte.length) r.push({ texte: texte.slice(fin) });
	return r;
}

/** Deux phrases ont-elles les mêmes mots, indifféremment de la casse et de la ponctuation ? */
export function memesMots(a, b) {
	const f = (p) => decouper(p).map((t) => t.mot + (t.elision ? '’' : '')).join(' ');
	const x = f(a);
	return x !== '' && x === f(b);
}
