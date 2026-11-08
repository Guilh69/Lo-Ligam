// LA PALETTE DU SITE : le seul endroit où changer la direction artistique
// (Romain, 2026-11-07 : « tout regrouper en un endroit pour que, si je change
// de direction artistique, tu puisses changer plus rapidement »).
//
// Après une modification : `node scripts/palette-css.mjs` (dans app/), qui
// régénère palette.css ; un test signale un palette.css oublié.
// Plan et inventaire : revisions/2026-11-07-palette-unique-et-fin-du-papier.md
//
// Hors palette, volontairement : les couleurs du logo (--logo-* dans app.css,
// recettes de Romain), les dessins (scènes des jeux, pluie de mots) et la
// palette du daltonisme (Okabe-Ito).

/** Les teintes : celles des en-têtes de la salle de jeux et des boutons */
export const TEINTES = {
	brique: '#b53d17', // le rouge du logo : occitan unifié, jeux d'adresse (le logo garde sa recette)
	// Le rouge et l'ocre des boutons, ceux de la palette validée par Romain (07-11 : « le rouge de
	// la palette qu'on a validé serait à utiliser, l'ocre aussi pour les boutons »)
	rougeAction: '#9c2626', // ce qui se clique
	ocreAction: '#c7811b', // ce qui est choisi, sélectionné
	rougeVif: '#cc2a14', // le languedocien (Romain, 07-11 : « un rouge plus intense »)
	or: '#eeaf34', // ce qui est choisi, jeux de mots
	orClair: '#ffd47f', // l'or clair du logo
	olive: '#4f6a2f', // jeux d'observation, bonne réponse
	sarcelle: '#1f5f63', // le carton (petits boutons, puces, réponses, commandes de la carte) dans les deux thèmes (Romain, 2026-11-07 : « ce bleu turquoise pour les boutons pourrait être pas mal »), jeux de mémoire, cases de rubrique
	bleu: '#2b6496', // jeux d'écoute
	bleuOil: '#006aa7', // les langues d'oïl (choix de Romain, 2026-10-10)
	prune: '#6b3a5b',
	brun: '#5d4733', // le brun de la palette Coolors de Romain (07-11), une puce de la salle de jeux
	ocre: '#c98a2b',
	orangeClair: '#f4a261', // le gascon (Romain, 07-11)
	creme: '#ffffff', // texte posé sur une teinte sombre : blanc (Romain, 2026-11-07 : « le texte sur des boutons foncés devrait être blanc ») ; le nom « creme » est resté
	encre: '#2a1a10', // texte posé sur une teinte claire
	tuile: '#efe1c6' // la crème des tuiles de jeu (n'est plus le carton du thème sombre depuis le 2026-11-07)
};
const T = TEINTES;

/** Les boutons (lib/styles/papier.css) */
export const BOUTONS = {
	agir: T.rougeAction, // la pièce rouge, texte crème
	agirTexte: T.creme,
	choisi: T.ocreAction, // la pièce choisie, texte encre
	choisiTexte: T.encre,
	juste: T.olive, // la bonne réponse, texte crème
	justeTexte: T.creme,
	// le carton (boutons secondaires, puces, réponses, commandes de la carte) : le turquoise sombre,
	// texte blanc, en clair comme en sombre (Romain, 2026-11-07 ; le gris doux, essayé le même soir,
	// ne lui allait pas en sombre)
	carton: { sombre: T.sarcelle, clair: T.sarcelle },
	cartonTexte: { sombre: T.creme, clair: T.creme }
};

/** Les familles de jeux : une teinte par famille (Illustracion, Sala) */
export const JEUX = {
	adresse: T.rougeAction, // le même rouge que les boutons (07-11 : un seul rouge)
	mots: T.or,
	observation: T.olive,
	memoire: T.sarcelle,
	ecoute: T.bleu
};

/** Les langues du sélecteur de l'en-tête (Romain, 2026-11-08 : « Òc rouge plutôt que jaune ; le français, je vois du bleu ; le catalan du jaune ; l'arabe du vert »). L'anglais : violet, choisi sur trois essais (violet, turquoise, rose). La pièce de la langue choisie : `fons` = une couleur, ou deux (pièce coupée en deux) ; `tinta` = le texte. L'espagnol n'a pas été dit : l'orange, entre le rouge et le jaune de son drapeau, en attendant son avis.
 *  Le rouge de l'occitan est le rouge du logo (T.brique : « occitan unifié ») ; le bleu du français est celui des langues d'oïl de la carte. */
export const LANGUES = {
	oc: { fons: [T.brique], tinta: T.creme },
	fr: { fons: [T.bleuOil], tinta: T.creme },
	ca: { fons: [T.or], tinta: T.encre },
	en: { fons: [T.prune], tinta: T.creme }, // violet, choisi par Romain le 08-11 (le bleu et rouge essayé d'abord ne lui allait pas du tout)
	ar: { fons: [T.olive], tinta: T.creme },
	es: { fons: [T.orangeClair], tinta: T.encre }
};

/** La salle de jeux (Romain, 2026-11-07 : « une couleur différente à chaque thème ») : la pièce de chaque
 *  puce « Fa trabalhar », [fond, texte] ; la puce choisie se lève et prend un anneau (Sala.svelte) */
export const PUCES = {
	vocabulari: [T.or, T.encre],
	ortografia: [T.brique, T.creme],
	gramatica: [T.prune, T.creme],
	memoria: [T.sarcelle, T.creme],
	atencion: [T.orangeClair, T.encre],
	observacion: [T.olive, T.creme],
	escota: [T.bleu, T.creme],
	logica: [T.brun, T.creme],
	adreca: [T.rougeAction, T.creme]
};

/** La carte : aplats pleins, les mêmes couleurs dans les deux thèmes */
export const CARTE = {
	intensite: 0.88, // opacité des aplats (au-delà, plus de survol visible)
	occitan: T.brique,
	dialectes: { gas: T.orangeClair, lan: T.rougeVif, pro: T.or, lem: T.prune, auv: T.olive, viv: T.sarcelle },
	langues: {
		catalan: T.or,
		oil: T.bleuOil,
		arpitan: T.ocre,
		basc: T.olive,
		breton: T.sarcelle,
		alsacian: T.or,
		francic: T.prune,
		flamenc: T.olive,
		cors: T.prune
	}
};

/** Les cases des rubriques (S'apren, Se parla…) et Cultura : [fond, texte] */
export const CASES = [
	[T.rougeAction, T.creme], // la grande case : le rouge des boutons
	[T.sarcelle, T.creme],
	[T.olive, T.creme],
	[T.bleu, T.creme],
	[T.or, T.encre],
	[T.prune, T.creme]
];

/** Luminance perçue d'une couleur #rrggbb, de 0 (noir) à 255 (blanc) */
export const luminance = (c) => {
	const n = parseInt(c.slice(1), 16);
	return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
};

/** Texte lisible sur un aplat : crème sur une teinte sombre, encre sur une claire */
export const texteSur = (fond) => (luminance(fond) > 130 ? T.encre : T.creme);

/** Un nom posé sur un aplat de la carte : [couleur du texte, ombre qui contraste] */
export const nomSurAplat = (fond) =>
	texteSur(fond) === T.encre ? [T.encre, 'rgba(251, 241, 225, 0.75)'] : [T.creme, 'rgba(20, 10, 5, 0.75)'];

const tiret = (k) => k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

/** Le contenu de palette.css (écrit par scripts/palette-css.mjs) */
export function cssPalette() {
	const l = [
		'/* FICHIER GÉNÉRÉ par scripts/palette-css.mjs depuis lib/styles/palette.js :',
		'   ne pas le modifier à la main, modifier palette.js puis relancer le script. */',
		':root {'
	];
	for (const [k, v] of Object.entries(TEINTES)) l.push(`\t--p-${tiret(k)}: ${v};`);
	for (const [k, v] of Object.entries(JEUX)) l.push(`\t--p-jeu-${tiret(k)}: ${v};`);
	l.push(
		`\t--t-accion: ${BOUTONS.agir};`,
		`\t--t-accion-tinta: ${BOUTONS.agirTexte};`,
		`\t--pc-or-fons: ${BOUTONS.choisi};`,
		`\t--pc-or-tinta: ${BOUTONS.choisiTexte};`,
		`\t--pc-juste: ${BOUTONS.juste};`,
		`\t--pc-juste-tinta: ${BOUTONS.justeTexte};`,
		'}',
		':root,',
		":root[data-tema='sorne'] {",
		`\t--pc-carton: ${BOUTONS.carton.sombre};`,
		`\t--pc-carton-tinta: ${BOUTONS.cartonTexte.sombre};`,
		'}',
		":root[data-tema='clar'] {",
		`\t--pc-carton: ${BOUTONS.carton.clair};`,
		`\t--pc-carton-tinta: ${BOUTONS.cartonTexte.clair};`,
		'}',
		''
	);
	return l.join('\n');
}
