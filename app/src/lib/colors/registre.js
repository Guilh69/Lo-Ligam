// Le registre des couleurs du site (Romain, 2026-11-13 : « il faut que je puisse
// changer toutes les couleurs du site directement dans le site »).
//
// Chaque couleur réglable a une ligne ici : un identifiant, un nom en français,
// un groupe, sa valeur d'origine, et la variable CSS qu'elle pose quand elle en
// a une. Deux familles :
//  - la palette (lib/styles/palette.js) : les teintes (`teinte.or`) et les
//    rôles qui s'en servent (`role.BOUTONS.agir`, `role.CARTE.dialectes.gas`…) ;
//  - les jetons de thème d'app.css (`tema.clar.t-fons`, `tema.sorne.t-fons`…)
//    et quelques jetons communs (`comun.color-brick`).
// Une surcharge est un couple { identifiant: '#rrggbb' }. Rien d'autre n'est
// accepté : les valeurs vont dans une feuille de style servie à tout le monde.
//
// Une couleur de plus : une ligne dans JETONS (jeton d'app.css) ou dans
// palette.js (et son nom dans NOMS) ; le test registre.test.js vérifie que les
// valeurs d'origine sont bien celles d'app.css.
// Hors registre, volontairement : les couleurs adaptées au daltonisme
// (Okabe-Ito, une garantie d'accessibilité) et les dessins.
import { TEINTES_DEFAUT, calcularPalette, ligamsRoles, hexColor, VARS_PALETTE } from '../styles/palette.js';

export const GROPS = [
	{ id: 'base', nom: 'Fond et texte' },
	{ id: 'valeur', nom: 'Mise en valeur' },
	{ id: 'botons', nom: 'Boutons' },
	{ id: 'teintes', nom: 'La palette', mot: 'Changer une teinte change tout ce qui s’en sert : boutons, cases, carte, jeux.' },
	{ id: 'logo', nom: 'La croix du logo' },
	{ id: 'cases', nom: 'Cases des rubriques' },
	{ id: 'jeux', nom: 'Familles de jeux' },
	{ id: 'puces', nom: 'Salle de jeux : les thèmes' },
	{ id: 'langues', nom: 'Langues de l’en-tête' },
	{ id: 'dialectes', nom: 'Carte : l’occitan et ses dialectes' },
	{ id: 'lengas', nom: 'Carte : les autres langues' },
	{ id: 'ens', nom: 'Carte : l’enseignement' },
	{ id: 'lecons', nom: 'Leçons' },
	{ id: 'ancianas', nom: 'Pages anciennes' },
	{ id: 'imagina', nom: 'S’imagina : les esquisses sur les photos', mot: 'Le dessin posé sur la photo, et les repères des endroits à toucher.' }
];

// --- les jetons d'app.css ----------------------------------------------------
// [variable, nom, groupe, clair, sombre, thèmes où l'option daltonisme la redéfinit]
// Une valeur : '#rrggbb', '@identifiant' (elle suit une autre couleur, par var() dans
// app.css) ou null (calculée par un mélange dans app.css : pas réglable dans ce thème).
const D2 = ['clar', 'sorne'];
const JETONS = [
	['t-fons', 'Fond de la page', 'base', '#f7f7f7', '#22100a'],
	['t-fons-2', 'Fond des panneaux', 'base', '#eeeeee', '#2f170e'],
	['t-tinta', 'Texte', 'base', '#2a1a10', '#fbf1e1'],
	['t-aur', 'Mise en valeur (petits textes, numéros)', 'valeur', '#9c5611', '#f6b73c', ['clar']],
	['t-aur-clar', 'Mise en valeur, second ton', 'valeur', '#8a3f12', '#ffd98a', ['clar']],
	['t-aur-gros', 'Grands mots et grands numéros', 'valeur', '#c28100', '@tema.sorne.t-aur'],
	['t-terra', 'Terracotta (accents)', 'valeur', '@teinte.brique', '#c8481c', D2],
	['t-terra-viu', 'Terracotta vif', 'valeur', '@teinte.brique', '#ef6a35', D2],
	['logo-traç', 'Traits de la croix', 'logo', '#b53d17', '#ffffff'],
	['logo-ponch', 'Points de la croix', 'logo', '#eeaf34', '#ffd47f'],
	['logo-moieu', 'Moyeu de la croix', 'logo', '#b53d17', '#eeaf34'],
	['t-ens-cal', 'Calandretas', 'ens', '#9c5611', '#f6b73c', D2],
	['t-ens-bil', 'Écoles bilingues', 'ens', '#3e7cb1', '#3e7cb1', D2],
	['t-ens-esc', 'L’occitan à l’école', 'ens', '#5e7b3a', '#5e7b3a', D2],
	['t-ens-seg', 'Collèges et lycées', 'ens', '@teinte.brique', '#c8481c', D2],
	['t-ens-sup', 'Universités et formation', 'ens', '#2a1a10', '#f5ead8', D2],
	['t-ens-adu', 'Cours pour adultes', 'ens', '#8a3f12', '#ffd98a', D2],
	['l-marca', 'Titres des exercices', 'lecons', '#a5342a', '@tema.sorne.t-aur'],
	['l-teal', 'Personnages et traductions', 'lecons', '@teinte.sarcelle', '#8fcfc6'],
	['l-bon', 'Bravo', 'lecons', '@role.BOUTONS.juste', '#b8d27c'],
	['l-carta', 'Carte de l’exercice', 'lecons', '#ffffff', null]
];
// les jetons communs aux deux thèmes : [variable, nom, groupe, valeur]
const COMUNS = [
	['color-brick', 'Brique', 'ancianas', '#a5342a'],
	['color-cream', 'Fond', 'ancianas', '#f7f7f7'],
	['color-sky', 'Bleu ciel', 'ancianas', '#3e7cb1'],
	['color-olive', 'Olive', 'ancianas', '#5e7b3a'],
	// S'imagina, atelier des rues (essai du 13-11) : les esquisses posées sur les photos, et les repères des
	// endroits à toucher (blanc sur noir, pour se lire sur n'importe quelle photo). Les mêmes dans les deux thèmes :
	// l'image enregistrée ne dépend pas du thème de celui qui la fait.
	['imagina-traç', 'Esquisse : le trait et les lettres', 'imagina', '#b53d17'],
	['imagina-ponch', 'Esquisse : les points aux coins', 'imagina', '#eeaf34'],
	['imagina-papier', 'Esquisse : le papier', 'imagina', '#f7f7f7'],
	['imagina-ombra', 'Esquisse : l’ombre du papier', 'imagina', '#2a1a10'],
	['imagina-calc', 'Esquisse : le voile du calque', 'imagina', '#ffffff'],
	['imagina-grafit', 'Esquisse : le crayon du calque', 'imagina', '#2a1a10'],
	['imagina-marca', 'Repères des endroits : le trait', 'imagina', '#ffffff'],
	['imagina-marca-fons', 'Repères des endroits : le contour', 'imagina', '#000000']
];

// --- les noms des couleurs de la palette ---------------------------------------
const NOMS_TEINTES = {
	brique: 'Brique (le rouge du logo)',
	rougeAction: 'Rouge des boutons',
	ocreAction: 'Ocre des boutons',
	rougeVif: 'Rouge vif',
	or: 'Or',
	orClair: 'Or clair',
	olive: 'Olive',
	sarcelle: 'Sarcelle',
	bleu: 'Bleu',
	bleuOil: 'Bleu des langues d’oïl',
	prune: 'Prune',
	brun: 'Brun',
	ocre: 'Ocre',
	orangeClair: 'Orange clair',
	creme: 'Texte sur une teinte sombre',
	encre: 'Texte sur une teinte claire',
	tuile: 'Crème des tuiles de jeu'
};
// rôles : [chemin du fond, nom, groupe, chemin du texte posé dessus, thème]
const ROLES = [
	['BOUTONS.agir', 'Bouton principal (ce qui se clique)', 'botons', 'BOUTONS.agirTexte'],
	['BOUTONS.choisi', 'Choisi, sélectionné', 'botons', 'BOUTONS.choisiTexte'],
	['BOUTONS.juste', 'Bonne réponse', 'botons', 'BOUTONS.justeTexte'],
	['BOUTONS.carton.clair', 'Bouton discret', 'botons', 'BOUTONS.cartonTexte.clair', 'clar'],
	['BOUTONS.carton.sombre', 'Bouton discret', 'botons', 'BOUTONS.cartonTexte.sombre', 'sorne'],
	['CASES.0.0', 'Case 1 (la grande)', 'cases', 'CASES.0.1'],
	['CASES.1.0', 'Case 2', 'cases', 'CASES.1.1'],
	['CASES.2.0', 'Case 3', 'cases', 'CASES.2.1'],
	['CASES.3.0', 'Case 4', 'cases', 'CASES.3.1'],
	['CASES.4.0', 'Case 5', 'cases', 'CASES.4.1'],
	['CASES.5.0', 'Case 6', 'cases', 'CASES.5.1'],
	['JEUX.adresse', 'Jeux d’adresse', 'jeux'],
	['JEUX.mots', 'Jeux de mots', 'jeux'],
	['JEUX.observation', 'Jeux d’observation', 'jeux'],
	['JEUX.memoire', 'Jeux de mémoire', 'jeux'],
	['JEUX.ecoute', 'Jeux d’écoute', 'jeux'],
	['PUCES.vocabulari', 'Vocabulaire', 'puces'],
	['PUCES.ortografia', 'Orthographe', 'puces'],
	['PUCES.gramatica', 'Grammaire', 'puces'],
	['PUCES.memoria', 'Mémoire', 'puces'],
	['PUCES.atencion', 'Attention', 'puces'],
	['PUCES.observacion', 'Observation', 'puces'],
	['PUCES.escota', 'Écoute', 'puces'],
	['PUCES.logica', 'Logique', 'puces'],
	['PUCES.adreca', 'Adresse', 'puces'],
	['LANGUES.oc', 'Occitan', 'langues'],
	['LANGUES.fr', 'Français', 'langues'],
	['LANGUES.ca', 'Catalan', 'langues'],
	['LANGUES.es', 'Espagnol', 'langues'],
	['LANGUES.en', 'Anglais', 'langues'],
	['LANGUES.ar', 'Arabe', 'langues'],
	['CARTE.occitan', 'L’occitan, d’un seul tenant', 'dialectes'],
	['CARTE.dialectes.gas', 'Gascon', 'dialectes'],
	['CARTE.dialectes.lan', 'Languedocien', 'dialectes'],
	['CARTE.dialectes.pro', 'Provençal', 'dialectes'],
	['CARTE.dialectes.lem', 'Limousin', 'dialectes'],
	['CARTE.dialectes.auv', 'Auvergnat', 'dialectes'],
	['CARTE.dialectes.viv', 'Vivaro-alpin', 'dialectes'],
	['CARTE.langues.catalan', 'Catalan', 'lengas'],
	['CARTE.langues.oil', 'Langues d’oïl', 'lengas'],
	['CARTE.langues.arpitan', 'Arpitan', 'lengas'],
	['CARTE.langues.basc', 'Basque', 'lengas'],
	['CARTE.langues.breton', 'Breton', 'lengas'],
	['CARTE.langues.alsacian', 'Alsacien', 'lengas'],
	['CARTE.langues.francic', 'Francique', 'lengas'],
	['CARTE.langues.flamenc', 'Flamand', 'lengas'],
	['CARTE.langues.cors', 'Corse', 'lengas']
];
// les puces et les langues rangent leur fond et leur texte à des places fixes
const fondEtTexte = (chemin) => {
	if (chemin.startsWith('PUCES.')) return [`${chemin}.0`, `${chemin}.1`];
	if (chemin.startsWith('LANGUES.')) return [`${chemin}.fons.0`, `${chemin}.tinta`];
	return [chemin, null];
};

const suivre = (o, chemin) => chemin.split('.').reduce((x, k) => x?.[k], o);

function bastir() {
	const origine = calcularPalette();
	const ligams = ligamsRoles();
	const lista = [];
	for (const [k, v] of Object.entries(TEINTES_DEFAUT))
		lista.push({ id: `teinte.${k}`, nom: NOMS_TEINTES[k] ?? k, grop: 'teintes', tema: null, defaut: v, var: VARS_PALETTE[`teinte.${k}`].var });
	for (const [chemin, nom, grop, cheminTexte, tema = null] of ROLES) {
		const [fond, texteAuto] = fondEtTexte(chemin);
		const texte = cheminTexte ?? texteAuto;
		const une = (c, extra) => ({
			id: `role.${c}`,
			nom,
			grop,
			tema,
			defaut: suivre(origine, c),
			ligat: ligams[c] ? `teinte.${ligams[c]}` : null,
			var: VARS_PALETTE[`role.${c}`]?.var ?? null,
			...extra
		});
		lista.push(une(fond, texte ? { tinta: `role.${texte}` } : {}));
		if (texte) lista.push(une(texte, { esTinta: true }));
	}
	for (const [v, nom, grop, clar, sorne, dalt = []] of JETONS)
		for (const [tema, val] of [
			['clar', clar],
			['sorne', sorne]
		]) {
			if (val === null) continue;
			const ligat = val.startsWith('@') ? val.slice(1) : null;
			lista.push({ id: `tema.${tema}.${v}`, nom, grop, tema, defaut: ligat ? null : val, ligat, var: `--${v}`, dalt: dalt.includes(tema) });
		}
	for (const [v, nom, grop, val] of COMUNS) lista.push({ id: `comun.${v}`, nom, grop, tema: null, defaut: val, ligat: null, var: `--${v}` });
	return lista;
}

/** Toutes les couleurs réglables */
export const LISTA = bastir();
// (sans prototype : « constructor » ou « toString » ne sont pas des identifiants connus ;
// relecture de sécurité du 2026-11-13)
export const PER_ID = Object.assign(Object.create(null), Object.fromEntries(LISTA.map((e) => [e.id, e])));

// Dans la base, les surcharges sont des éléments de la « page » colors de la table
// pagina_elements (celle de l'édition sur place : brouillon, publication, retour en
// arrière) : clé « colors.<identifiant> », la couleur dans la colonne oc.
export const PAGINA = 'colors';
export const clauDe = (id) => `${PAGINA}.${id}`;
/** Les surcharges que portent des lignes de la base (les lignes retirées ou étrangères sont ignorées) */
export function surchargesDe(rows) {
	const s = {};
	for (const r of rows ?? []) if (r?.clau?.startsWith(PAGINA + '.') && !r.suprimit) s[r.clau.slice(PAGINA.length + 1)] = r.oc;
	return netejar(s);
}

/** Ne garde d'un jeu de surcharges que les identifiants connus et les couleurs #rrggbb */
export function netejar(surcharges) {
	const res = {};
	for (const [id, v] of Object.entries(surcharges ?? {})) {
		const c = typeof v === 'string' ? v.trim().toLowerCase() : v;
		if (PER_ID[id] && hexColor(c)) res[id] = c;
	}
	return res;
}

/** La valeur de chaque couleur pour un jeu de surcharges : { identifiant: '#rrggbb' } */
export function valors(surcharges = {}) {
	const s = netejar(surcharges);
	const p = calcularPalette(s);
	const res = {};
	const legir = (id, fonsor = 0) => {
		if (id in res) return res[id];
		const e = PER_ID[id];
		if (!e || fonsor > 6) return null;
		let v;
		if (id.startsWith('teinte.')) v = p.TEINTES[id.slice(7)];
		else if (id.startsWith('role.')) v = suivre(p, id.slice(5));
		else v = s[id] ?? (e.ligat ? legir(e.ligat, fonsor + 1) : e.defaut);
		return (res[id] = v);
	};
	for (const e of LISTA) legir(e.id);
	return res;
}

/** Les valeurs d'origine (aucune surcharge) */
export const ORIGINA = valors();

const BLOCS = [
	['comun', 'html:root'],
	['clar', "html:root[data-tema='clar']"],
	['clar-dalt', "html:root[data-tema='clar']:not([data-dalt='on'])"],
	['sorne', "html:root:not([data-tema='clar'])"],
	['sorne-dalt', "html:root:not([data-tema='clar']):not([data-dalt='on'])"]
];

/** La feuille de style qui pose un jeu de surcharges : seulement les variables dont la valeur
 *  n'est plus celle d'origine. Les sélecteurs l'emportent sur ceux d'app.css et de palette.css
 *  quel que soit l'ordre des feuilles, sauf sur les couleurs adaptées au daltonisme, qui restent. */
export function cssColors(surcharges = {}) {
	const v = valors(surcharges);
	const blocs = {};
	for (const e of LISTA) {
		if (!e.var || v[e.id] === ORIGINA[e.id] || !hexColor(v[e.id])) continue;
		const bloc = (e.tema ?? 'comun') + (e.dalt ? '-dalt' : '');
		(blocs[bloc] ??= []).push(`${e.var}:${v[e.id]}`);
	}
	return BLOCS.filter(([k]) => blocs[k])
		.map(([k, sel]) => `${sel}{${blocs[k].join(';')}}`)
		.join('\n');
}
