// Images des fiches de Cultura (essai du 2026-11-06, Romain : « des fonds
// d'images un peu transparents avec les photos que j'ai mises, si ça
// correspond »). Les photos sont celles des paysages de Remira, déjà en ligne
// (sans GPS ni métadonnée) ; scripts/cultura-fotos.mjs en tire deux petites
// tailles par fiche dans static/cultura/ (<fiche>-480.webp, <fiche>-800.webp).
// Une photo prise ailleurs peut illustrer un thème (Romain, 06-11).
//
// pos : le point de la photo à garder au centre quand la case la recadre.
// Les petites images sont déjà recadrées en 3:2 autour de ce point.
// Sans photo qui corresponde : une photo libre de Wikimedia Commons (COMMONS,
// créditée), un dessin au trait de Remira (même famille que la poussière
// d'or), ou rien.

/** fiche → photo de paysage (clau de lib/paisatges) et point à garder */
export const FOTOS = {
	'nou-punts': { clau: 'vila-cirdoc', pos: '50% 40%' }, // le CIRDÒC, Institut occitan de cultura
	'amor-d-aussau': { clau: 'montanha-pins', pos: '50% 45%' }, // une chaîne et un pic pointu (Joan, 06-11 : les chalets de montanha-valada font alpins)
	escais: { clau: 'vila-potz', pos: '50% 60%' }, // une place de village
	'claudi-marti': { clau: 'mon-muralha', pos: '50% 45%' }, // Carcassonne, sa ville
	'oc-oil-si': { clau: 'mon-verona', pos: '50% 45%' }, // Vérone, où Dante s'est réfugié
	'mon-paire': { clau: 'mon-campana', pos: '50% 22%' }, // « me marida » : la cloche des noces
	familha: { clau: 'taula-polet', pos: '50% 50%' }, // la table de famille
	trobador: { clau: 'mon-castel', pos: '68% 40%' },
	mestiers: { clau: 'vila-pan', pos: '50% 50%' }, // la boulangerie : lo fornièr
	jorns: { clau: 'vila-relotge', pos: '60% 45%' }, // l'horloge
	'alh-oli': { clau: 'taula-oliva', pos: '50% 50%' }, // l'òli
	'bon-mercat': { clau: 'taula-espargue', pos: '50% 50%' },
	'al-mercat': { clau: 'vila-fruch', pos: '50% 55%' },
	miegjorn: { clau: 'montanha-garriga', pos: '50% 40%' },
	vents: { clau: 'mar-pin', pos: '72% 40%' }, // un pin couché par le vent
	solelh: { clau: 'temps-solelh', pos: '50% 45%' },
	ostal: { clau: 'vila-porta', pos: '50% 50%' },
	mas: { clau: 'vila-terrassa', pos: '50% 50%' },
	'a-mon-ostal': { clau: 'vila-volets', pos: '50% 40%' },
	vila: { clau: 'vila-rosa', pos: '50% 45%' },
	bastidas: { clau: 'vila-arcs', pos: '50% 55%' }, // des arcades de brique
	'parla-patois': { clau: 'port', pos: '50% 60%' }, // Marseille
	tolosa: { clau: 'garona', pos: '50% 50%' } // la Garonne à Toulouse
};

/** fiche → dessin au trait de Remira (clé de lib/plueja/dessenhs.js) */
export const DESSENHS = {
	oc: 'Òc !',
	'papeta-mameta': 'la mameta',
	rocafort: 'lo formatge'
};

/**
 * fiches sans photo de Romain : une photo libre de Wikimedia Commons (Romain,
 * 06-11 : « Oui, les deux », après un aperçu des candidates ; écartées : les
 * photos où l'on reconnaît des visages). La source réduite est gardée hors Git
 * (Lo_Ligam_hors-git/design-stock/brut/commons-cultura/<font>), sans métadonnée
 * dans les images tirées. Le crédit (auteur, licence, lien, « modifiée ») est
 * affiché sous la case de la fiche et au pied du sommaire, comme l'exige la
 * licence CC BY-SA. largor : largeur de la source une fois recadrée en 3:2.
 */
export const COMMONS = {
	carnaval: {
		font: 'carnaval-tivoli-unuaiga.jpg',
		largor: 1280,
		pos: '50% 40%', // les masques du Tivoli, carnaval de Limoux 2015
		autor: 'Unuaiga',
		licencia: 'CC BY-SA 4.0',
		licenciaLigam: 'https://creativecommons.org/licenses/by-sa/4.0/deed.fr',
		ligam: 'https://commons.wikimedia.org/wiki/File:Le_Tivoli_-_Sortie_du_soir_-_Carnaval_de_Limoux_2015_(05).jpg'
	},
	'copa-santa': {
		font: 'copa-santa-capsot.jpg',
		largor: 532,
		pos: '50% 30%', // la coupe elle-même (Louis Guillaume Fulconis)
		// trop petite pour remplir la case de la fiche : la coupe entière, au
		// bout de la case, comme les dessins (<fiche>-objecte.webp)
		objecte: true,
		autor: 'Capsot',
		licencia: 'CC0',
		licenciaLigam: 'https://creativecommons.org/publicdomain/zero/1.0/deed.fr',
		ligam: 'https://commons.wikimedia.org/wiki/File:CopaSantaN.JPG'
	}
};

export const AMPLES = [480, 800];
const AMPLES_COMMONS = [480, 800, 1200]; // la plus grande sert à la case de la fiche
/** largeurs tirées pour une fiche ; une photo de Commons plus étroite s'arrête à sa largeur */
export const amples = (id) => {
	const c = COMMONS[id];
	if (!c) return AMPLES;
	const max = Math.min(c.largor, AMPLES_COMMONS.at(-1));
	return [...AMPLES_COMMONS.filter((a) => a < max), max];
};
export const foto = (id) => FOTOS[id] ?? COMMONS[id] ?? null;
export const credit = (id) => COMMONS[id] ?? null;
/** srcset des petites images ; max : largeur la plus grande proposée (800 au sommaire) */
export const srcset = (id, max = 800) =>
	amples(id)
		.filter((a, k) => k === 0 || a <= max)
		.map((a) => `/cultura/${id}-${a}.webp ${a}w`)
		.join(', ');
