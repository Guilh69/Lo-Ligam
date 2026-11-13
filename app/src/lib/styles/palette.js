// LA PALETTE DU SITE : le seul endroit où changer la direction artistique
// (Romain, 2026-11-07 : « tout regrouper en un endroit pour que, si je change
// de direction artistique, tu puisses changer plus rapidement »).
//
// Après une modification : `node scripts/palette-css.mjs` (dans app/), qui
// régénère palette.css ; un test signale un palette.css oublié.
// Plan et inventaire : revisions/2026-11-07-palette-unique-et-fin-du-papier.md
//
// Depuis le 2026-11-13 (Romain : « il faut que je puisse changer toutes les
// couleurs du site directement dans le site »), ce fichier donne les valeurs
// D'ORIGINE. Romain les change depuis le site (outil « Colors » de sa barre,
// lib/colors) : ses choix sont des surcharges, rangées dans la base, posées
// ici par fixarColors(). Tout ce qui est exporté (TEINTES, BOUTONS, CARTE…)
// se lit donc AU MOMENT DE S'EN SERVIR : ne jamais recopier une couleur dans
// une constante au niveau d'un module (elle resterait à la valeur d'origine).
// Détail : revisions/2026-11-13-colors-sus-plaça.md
//
// Hors palette, volontairement : les dessins (scènes des jeux, pluie de mots)
// et la palette du daltonisme (Okabe-Ito).

/** Les teintes d'origine : celles des en-têtes de la salle de jeux et des boutons */
export const TEINTES_DEFAUT = {
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

/** Les rôles : quelle teinte sert à quoi. Une fonction des teintes : quand une
 *  teinte change, tout ce qui s'en sert suit. */
const rolesDe = (T) => ({
	/** Les boutons (lib/styles/papier.css) */
	BOUTONS: {
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
	},

	/** Les familles de jeux : une teinte par famille (Illustracion, Sala) */
	JEUX: {
		adresse: T.rougeAction, // le même rouge que les boutons (07-11 : un seul rouge)
		mots: T.or,
		observation: T.olive,
		memoire: T.sarcelle,
		ecoute: T.bleu
	},

	/** Les langues du sélecteur de l'en-tête (Romain, 2026-11-08 : « Òc rouge plutôt que jaune ; le français, je vois du bleu ; le catalan du jaune ; l'arabe du vert »). L'anglais : violet, choisi sur trois essais (violet, turquoise, rose). La pièce de la langue choisie : `fons` = une couleur, ou deux (pièce coupée en deux) ; `tinta` = le texte. L'espagnol n'a pas été dit : l'orange, entre le rouge et le jaune de son drapeau, en attendant son avis.
	 *  Le rouge de l'occitan est le rouge du logo (T.brique : « occitan unifié ») ; le bleu du français est celui des langues d'oïl de la carte. */
	LANGUES: {
		oc: { fons: [T.brique], tinta: T.creme },
		fr: { fons: [T.bleuOil], tinta: T.creme },
		ca: { fons: [T.or], tinta: T.encre },
		en: { fons: [T.prune], tinta: T.creme }, // violet, choisi par Romain le 08-11 (le bleu et rouge essayé d'abord ne lui allait pas du tout)
		ar: { fons: [T.olive], tinta: T.creme },
		es: { fons: [T.orangeClair], tinta: T.encre }
	},

	/** La salle de jeux (Romain, 2026-11-07 : « une couleur différente à chaque thème ») : la pièce de chaque
	 *  puce « Fa trabalhar », [fond, texte] ; la puce choisie se lève et prend un anneau (Sala.svelte) */
	PUCES: {
		vocabulari: [T.or, T.encre],
		ortografia: [T.brique, T.creme],
		gramatica: [T.prune, T.creme],
		memoria: [T.sarcelle, T.creme],
		atencion: [T.orangeClair, T.encre],
		observacion: [T.olive, T.creme],
		escota: [T.bleu, T.creme],
		logica: [T.brun, T.creme],
		adreca: [T.rougeAction, T.creme]
	},

	/** La carte : aplats pleins, les mêmes couleurs dans les deux thèmes */
	CARTE: {
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
	},

	/** Les cases des rubriques (S'apren, Se parla…) et Cultura : [fond, texte] */
	CASES: [
		[T.rougeAction, T.creme], // la grande case : le rouge des boutons
		[T.sarcelle, T.creme],
		[T.olive, T.creme],
		[T.bleu, T.creme],
		[T.or, T.encre],
		[T.prune, T.creme]
	]
});

// --- Les valeurs du moment (origine + surcharges de Romain) ------------------

const HEX = /^#[0-9a-f]{6}$/;
/** Une couleur #rrggbb en minuscules, la seule forme acceptée d'une surcharge */
export const hexColor = (v) => typeof v === 'string' && HEX.test(v);

// pose une valeur au bout d'un chemin (BOUTONS.carton.sombre, CASES.0.1) si une couleur s'y trouve déjà
function pausar(racine, chemin, v) {
	let o = racine;
	for (let i = 0; i < chemin.length - 1; i++) {
		o = o?.[chemin[i]];
		if (!o || typeof o !== 'object') return;
	}
	const k = chemin.at(-1);
	if (hexColor(o[k])) o[k] = v;
}

/** La palette entière pour un jeu de surcharges { 'teinte.or': '#…', 'role.BOUTONS.agir': '#…' } :
 *  les teintes d'abord, les rôles qui en découlent, puis les rôles changés un par un. */
export function calcularPalette(surcharges = {}) {
	const T = { ...TEINTES_DEFAUT };
	for (const k of Object.keys(T)) if (hexColor(surcharges[`teinte.${k}`])) T[k] = surcharges[`teinte.${k}`];
	const p = { TEINTES: T, ...rolesDe(T) };
	for (const [id, v] of Object.entries(surcharges)) if (id.startsWith('role.') && hexColor(v)) pausar(p, id.slice(5).split('.'), v);
	return p;
}

/** À quelle teinte chaque rôle est lié à l'origine : { 'BOUTONS.agir': 'rougeAction', … } */
export function ligamsRoles() {
	const marques = Object.fromEntries(Object.keys(TEINTES_DEFAUT).map((k) => [k, `@${k}`]));
	const res = {};
	const passar = (o, chemin) => {
		for (const [k, v] of Object.entries(o)) {
			if (typeof v === 'string' && v.startsWith('@')) res[[...chemin, k].join('.')] = v.slice(1);
			else if (v && typeof v === 'object') passar(v, [...chemin, k]);
		}
	};
	passar(rolesDe(marques), []);
	return res;
}

// Un seul état pour toute la page (ce module peut être évalué deux fois, comme stores/ambianca) ;
// sur le serveur, le même pour toutes les demandes : la palette publiée est la même pour tous.
// Dans le navigateur, les couleurs publiées sont écrites dans la page par le serveur (app.html,
// hooks.server.js) AVANT que ce module soit évalué : même une constante recopiée au niveau
// d'un module part donc avec la bonne valeur. __loLigamColorsVista : ce que Romain est en train
// de régler (son brouillon), gardé le temps de l'onglet pour qu'un rechargement le montre partout.
const clauDe = (s) => JSON.stringify(Object.entries(s).sort(([a], [b]) => (a < b ? -1 : 1)));
function estatInicial() {
	const s = globalThis.__loLigamColorsVista ?? globalThis.__loLigamColors ?? {};
	return { actuel: calcularPalette(s), clau: clauDe(s), senhal: () => {}, escotaires: new Set() };
}
const etat = (globalThis.__loLigamPalette ??= estatInicial());
// (en développement, l'état survit au rechargement à chaud du module : une version plus ancienne
// peut ne pas avoir cette liste)
etat.escotaires ??= new Set();

/** Pose les surcharges (publiées, ou le brouillon de Romain pendant qu'il règle). Renvoie vrai si la palette a changé. */
export function fixarColors(surcharges = {}) {
	const clau = clauDe(surcharges);
	if (clau === etat.clau) return false;
	etat.clau = clau;
	etat.actuel = calcularPalette(surcharges);
	for (const f of etat.escotaires) f();
	return true;
}

/** Pour un module qui garde des valeurs calculées depuis la palette (un camaïeu, une liste) :
 *  la fonction donnée est rappelée à chaque changement de palette, pour les recalculer. */
export function quandCambia(f) {
	etat.escotaires.add(f);
	return () => etat.escotaires.delete(f);
}

/** Dans le navigateur, lib/colors/senhal.svelte.js branche ici un signal de Svelte : chaque lecture
 *  de la palette en dépend, et les pages se redessinent quand Romain change une couleur. */
export function brancarSenhal(f) {
	etat.senhal = f;
}

// Une vue vivante d'un morceau de la palette : même objet d'un bout à l'autre, valeurs lues à chaque
// accès. Se comporte comme l'objet ou le tableau qu'elle montre (Object.entries, [...x], x.map, x.length).
function viu(legir, tablèu = false) {
	const enfants = new Map();
	return new Proxy(tablèu ? [] : {}, {
		get(_, k) {
			etat.senhal();
			const o = legir();
			const v = o[k];
			if (typeof v === 'function') return v.bind(o);
			if (v && typeof v === 'object') {
				if (!enfants.has(k)) enfants.set(k, viu(() => legir()[k], Array.isArray(v)));
				return enfants.get(k);
			}
			return v;
		},
		has: (_, k) => k in legir(),
		ownKeys() {
			etat.senhal();
			return Reflect.ownKeys(legir());
		},
		getOwnPropertyDescriptor(_, k) {
			const d = Reflect.getOwnPropertyDescriptor(legir(), k);
			if (!d) return undefined;
			// (la longueur d'un tableau ne peut pas être dite « configurable »)
			return tablèu && k === 'length' ? d : { ...d, configurable: true };
		},
		set: () => false,
		deleteProperty: () => false,
		defineProperty: () => false
	});
}

/** Les teintes */
export const TEINTES = viu(() => etat.actuel.TEINTES);
/** Les boutons (lib/styles/papier.css) */
export const BOUTONS = viu(() => etat.actuel.BOUTONS);
/** Les familles de jeux */
export const JEUX = viu(() => etat.actuel.JEUX);
/** Les langues du sélecteur de l'en-tête */
export const LANGUES = viu(() => etat.actuel.LANGUES);
/** Les puces de la salle de jeux : [fond, texte] */
export const PUCES = viu(() => etat.actuel.PUCES);
/** La carte */
export const CARTE = viu(() => etat.actuel.CARTE);
/** Les cases des rubriques et de Cultura : [fond, texte] */
export const CASES = viu(() => etat.actuel.CASES, true);
const T = TEINTES;

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

/** La variable CSS de chaque couleur de la palette qui en a une, et le thème où elle vaut
 *  (null : les deux). Les autres couleurs (carte, langues, puces, cases) ne passent que par le JS. */
export const VARS_PALETTE = {
	...Object.fromEntries(Object.keys(TEINTES_DEFAUT).map((k) => [`teinte.${k}`, { var: `--p-${tiret(k)}`, tema: null }])),
	...Object.fromEntries(['adresse', 'mots', 'observation', 'memoire', 'ecoute'].map((k) => [`role.JEUX.${k}`, { var: `--p-jeu-${k}`, tema: null }])),
	'role.BOUTONS.agir': { var: '--t-accion', tema: null },
	'role.BOUTONS.agirTexte': { var: '--t-accion-tinta', tema: null },
	'role.BOUTONS.choisi': { var: '--pc-or-fons', tema: null },
	'role.BOUTONS.choisiTexte': { var: '--pc-or-tinta', tema: null },
	'role.BOUTONS.juste': { var: '--pc-juste', tema: null },
	'role.BOUTONS.justeTexte': { var: '--pc-juste-tinta', tema: null },
	'role.BOUTONS.carton.sombre': { var: '--pc-carton', tema: 'sorne' },
	'role.BOUTONS.cartonTexte.sombre': { var: '--pc-carton-tinta', tema: 'sorne' },
	'role.BOUTONS.carton.clair': { var: '--pc-carton', tema: 'clar' },
	'role.BOUTONS.cartonTexte.clair': { var: '--pc-carton-tinta', tema: 'clar' }
};

/** Le contenu de palette.css (écrit par scripts/palette-css.mjs) : les valeurs d'origine */
export function cssPalette() {
	const { TEINTES: T0, BOUTONS: B, JEUX: J } = calcularPalette();
	const l = [
		'/* FICHIER GÉNÉRÉ par scripts/palette-css.mjs depuis lib/styles/palette.js :',
		'   ne pas le modifier à la main, modifier palette.js puis relancer le script. */',
		':root {'
	];
	for (const [k, v] of Object.entries(T0)) l.push(`\t--p-${tiret(k)}: ${v};`);
	for (const [k, v] of Object.entries(J)) l.push(`\t--p-jeu-${tiret(k)}: ${v};`);
	l.push(
		`\t--t-accion: ${B.agir};`,
		`\t--t-accion-tinta: ${B.agirTexte};`,
		`\t--pc-or-fons: ${B.choisi};`,
		`\t--pc-or-tinta: ${B.choisiTexte};`,
		`\t--pc-juste: ${B.juste};`,
		`\t--pc-juste-tinta: ${B.justeTexte};`,
		'}',
		':root,',
		":root[data-tema='sorne'] {",
		`\t--pc-carton: ${B.carton.sombre};`,
		`\t--pc-carton-tinta: ${B.cartonTexte.sombre};`,
		'}',
		":root[data-tema='clar'] {",
		`\t--pc-carton: ${B.carton.clair};`,
		`\t--pc-carton-tinta: ${B.cartonTexte.clair};`,
		'}',
		''
	);
	return l.join('\n');
}
