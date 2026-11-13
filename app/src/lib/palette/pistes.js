// Les pistes de palette du 07-11 (Romain : « les couleurs ne vont pas ensemble »),
// montrées sur /ensag/palette-actuel (les pages -brique, -jaune et -accordee ont été retirées le 13-11, récupérables dans Git). Rien ici ne
// touche le site : tant que Romain n'a pas choisi, palette.js et app.css restent
// tels quels. Une piste choisie se recopie dans lib/styles/palette.js (TEINTES,
// BOUTONS, CASES) et dans les jetons de fond de app.css.
//
// Les rôles (voir coherence.js) : fond, surface, texte, action, choisi, juste,
// carton (bouton discret), valeur (texte d'accent), surClair / surSombre (texte
// posé sur une pièce claire / sombre) et six tuiles (S'apren, familles de jeux).
import { depuisOklch, melanger, meilleurTexte } from './coherence.js';

export const ROLES = [
	{ cle: 'fond', nom: 'Fond de la page', groupe: 'Base' },
	{ cle: 'surface', nom: 'Surface des panneaux', groupe: 'Base' },
	{ cle: 'texte', nom: 'Texte', groupe: 'Base' },
	{ cle: 'action', nom: 'Action (ce qui se clique)', groupe: 'Boutons' },
	{ cle: 'choisi', nom: 'Choisi, sélectionné', groupe: 'Boutons' },
	{ cle: 'juste', nom: 'Bonne réponse', groupe: 'Boutons' },
	{ cle: 'carton', nom: 'Bouton discret', groupe: 'Boutons' },
	{ cle: 'valeur', nom: 'Mise en valeur (texte)', groupe: 'Accents' },
	{ cle: 'surClair', nom: 'Texte sur teinte claire', groupe: 'Textes posés sur une pièce' },
	{ cle: 'surSombre', nom: 'Texte sur teinte sombre', groupe: 'Textes posés sur une pièce' }
];
export const NB_TUILES = 6;

// Les cases de S'apren et les familles de jeux aujourd'hui (palette.js : CASES)
const CASES = ['#b53d17', '#1f5f63', '#4f6a2f', '#2b6496', '#eeaf34', '#6b3a5b'];
// Piste 3 : même clarté et même intensité pour toutes, seules les teintes varient
const accord = (H) => depuisOklch(0.5, 0.072, H);
const TUILES_ACCORDEES = ['#b53d17', accord(205), accord(250), accord(135), accord(345), accord(65)];

export const PISTES = {
	actuel: {
		nom: 'Aujourd’hui',
		titre: 'Le site tel qu’il est (référence)',
		mot: 'Les valeurs de palette.js et d’app.css, pour comparer. Le verdict de l’outil est celui du site actuel.',
		clair: { fond: '#f7f7f7', surface: '#eeeeee', texte: '#2a1a10', surClair: '#2a1a10', surSombre: '#fbf1e1', action: '#b53d17', choisi: '#eeaf34', juste: '#4f6a2f', carton: '#1f5f63', valeur: '#9c5611', tuiles: CASES },
		sombre: { fond: '#22100a', surface: '#2f170e', texte: '#fbf1e1', surClair: '#2a1a10', surSombre: '#fbf1e1', action: '#b53d17', choisi: '#eeaf34', juste: '#4f6a2f', carton: '#efe1c6', valeur: '#f6b73c', tuiles: CASES }
	},
	brique: {
		nom: 'Piste 1 · Brique seule',
		titre: 'Une seule couleur vive : la brique du logo',
		mot: 'Fond presque blanc, texte presque noir, la brique pour tout ce qui se clique et pour la mise en valeur. Le « juste » est un vert pâle ; le « choisi » est noir. Les tuiles de S’apren redeviennent blanches, sauf la première : cela revient sur la décision du 24-10 (tuiles de couleur).',
		clair: { fond: '#f6f7f7', surface: '#ffffff', texte: '#1f1b19', surClair: '#1f1b19', surSombre: '#ffffff', action: '#b53d17', choisi: '#1f1b19', juste: '#bfe3c4', carton: '#ffffff', valeur: '#b53d17', tuiles: ['#b53d17', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
		sombre: { fond: '#171413', surface: '#211d1b', texte: '#f3efec', surClair: '#1f1b19', surSombre: '#ffffff', action: '#b53d17', choisi: '#f3efec', juste: '#a9d9b0', carton: '#2f2927', valeur: '#ec8b63', tuiles: ['#b53d17', '#211d1b', '#211d1b', '#211d1b', '#211d1b', '#211d1b'] }
	},
	jaune: {
		nom: 'Piste 2 · Brique et jaune pâle',
		titre: 'Les deux couleurs du logo, sur blanc',
		mot: 'Dans l’esprit de La Fourche : fond blanc, brique pour agir, jaune pâle et or pour les pièces et les tuiles, texte brun-noir. Plus de sarcelle, de bleu ni de prune. Le « juste » est un vert pâle.',
		clair: { fond: '#ffffff', surface: '#fff5d6', texte: '#2a1a10', surClair: '#2a1a10', surSombre: '#ffffff', action: '#b53d17', choisi: '#eeaf34', juste: '#bfe3c4', carton: '#ffe39a', valeur: '#b53d17', tuiles: ['#b53d17', '#ffe39a', '#fff3cf', '#eeaf34', '#fff3cf', '#ffe39a'] },
		sombre: { fond: '#1f1812', surface: '#2b2219', texte: '#fbf1e1', surClair: '#2a1a10', surSombre: '#ffffff', action: '#b53d17', choisi: '#eeaf34', juste: '#a9d9b0', carton: '#f3d98b', valeur: '#f6b73c', tuiles: ['#b53d17', '#4a3a22', '#3a2d1c', '#eeaf34', '#3a2d1c', '#4a3a22'] }
	},
	accordee: {
		nom: 'Piste 3 · Multicolore accordé',
		titre: 'Les tuiles restent de couleur, mais elles vont ensemble',
		mot: 'Garde l’idée des tuiles colorées (24-10), sur un fond très légèrement froid comme chez Busuu. Toutes les teintes ont la même clarté et la même intensité, tamisées : seules la brique et l’or sont vifs. Les pièces discrètes sont en gris-bleu.',
		clair: { fond: '#f4f6f9', surface: '#ffffff', texte: '#1d2530', surClair: '#1d2530', surSombre: '#ffffff', action: '#b53d17', choisi: '#eeaf34', juste: '#bfe3c4', carton: '#46607a', valeur: '#b53d17', tuiles: TUILES_ACCORDEES },
		sombre: { fond: '#12171d', surface: '#1b222b', texte: '#eef2f6', surClair: '#12171d', surSombre: '#ffffff', action: '#b53d17', choisi: '#f6b73c', juste: '#a9d9b0', carton: '#34465a', valeur: '#f6b73c', tuiles: TUILES_ACCORDEES }
	}
};
export const ORDRE_PISTES = ['actuel', 'brique', 'jaune', 'accordee'];

// La base mêlée (Romain, 07-11, devant la planche Coolors / ses couleurs : « mélangé, j'aime bien ») :
// le rouge, l'ocre, le brun, le vieux rose et le vert de Coolors (#5d4733, #729f1f, #9c2626,
// #c7811b, #966258) avec son turquoise, son bleu, son sapin et son or mesurés sur ses visuels.
// Fond blanc franc (le crème est banni), textes en blanc franc sur les teintes sombres. Hors
// ORDRE_PISTES : elle n'a pas de page de comparaison, seulement les modèles de pages.
// Le brun de texte (#3b2e22) est le brun de Coolors approfondi, pour tenir le texte courant ;
// le rouge d'action est celui de Coolors, plus froid que la brique du logo (à regarder).
const MELANGE = ['#9c2626', '#035e68', '#1e4d36', '#38668e', '#c7811b', '#966258'];
PISTES.melange = {
	nom: 'Base mêlée',
	titre: 'La palette Coolors mêlée à tes couleurs',
	mot: 'Fond blanc franc, rouge de Coolors pour agir, brun pour les pièces discrètes, or pour le choisi, vert de Coolors pour le juste ; turquoise, bleu, sapin, ocre et vieux rose en tuiles. Première lecture du thème sombre : à regarder dans un second temps.',
	clair: { fond: '#ffffff', surface: '#f4f4f4', texte: '#3b2e22', surClair: '#2b2118', surSombre: '#ffffff', action: '#9c2626', choisi: '#c7811b', juste: '#729f1f', carton: '#5d4733', valeur: '#9c2626', tuiles: MELANGE },
	sombre: { fond: '#1c1612', surface: '#271f19', texte: '#ffffff', surClair: '#2b2118', surSombre: '#ffffff', action: '#9c2626', choisi: '#c7811b', juste: '#729f1f', carton: '#5d4733', valeur: '#ecb13f', tuiles: MELANGE }
};

/** Les variables CSS du site (jetons de app.css, palette.css, papier.css) posées par une palette */
export function variablesCss(r, mode) {
	const txt = (f) => meilleurTexte(f, r.surSombre, r.surClair);
	const v = {
		'--t-fons': r.fond,
		'--t-fons-2': r.surface,
		'--t-tinta': r.texte,
		'--t-tinta-2': melanger(r.texte, r.fond, 0.72),
		'--t-linha': `color-mix(in srgb, ${r.texte} 14%, transparent)`,
		'--t-aur': r.valeur,
		'--t-aur-clar': r.choisi,
		'--t-accion': r.action,
		'--t-accion-tinta': txt(r.action),
		'--t-accion-viu': `color-mix(in srgb, ${r.action} 82%, #000)`,
		'--pc-or-fons': r.choisi,
		'--pc-or-tinta': txt(r.choisi),
		'--pc-juste': r.juste,
		'--pc-juste-tinta': txt(r.juste),
		'--pc-carton': r.carton,
		'--pc-carton-tinta': txt(r.carton),
		'--pc-ombre': mode === 'clair' ? 'rgba(20, 16, 14, 0.26)' : 'rgba(0, 0, 0, 0.6)'
	};
	r.tuiles.forEach((t, i) => {
		v[`--tu${i + 1}`] = t;
		v[`--tu${i + 1}-t`] = txt(t);
	});
	return Object.entries(v)
		.map(([k, x]) => `${k}:${x}`)
		.join(';');
}

/** Une copie profonde des deux thèmes d'une piste */
export function copierPiste(id) {
	const p = PISTES[id];
	const copie = (t) => ({ ...t, tuiles: [...t.tuiles] });
	return { clair: copie(p.clair), sombre: copie(p.sombre) };
}
