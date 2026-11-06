// Images des fiches de Cultura (essai du 2026-11-06, Romain : « des fonds
// d'images un peu transparents avec les photos que j'ai mises, si ça
// correspond »). Les photos sont celles des paysages de Remira, déjà en ligne
// (sans GPS ni métadonnée) ; scripts/cultura-fotos.mjs en tire deux petites
// tailles par fiche dans static/cultura/ (<fiche>-480.webp, <fiche>-800.webp).
// Une photo prise ailleurs peut illustrer un thème (Romain, 06-11).
//
// pos : le point de la photo à garder au centre quand la case la recadre.
// Les petites images sont déjà recadrées en 3:2 autour de ce point.
// Sans photo qui corresponde : une autre photo du stock de Romain (STOCK), une
// photo libre de Wikimedia Commons (COMMONS, créditée), un dessin au trait de
// Remira (même famille que la poussière d'or), ou rien.

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

/**
 * fiche → dessin au trait de Remira (clé de lib/plueja/dessenhs.js), pour une
 * fiche sans photo. Vide depuis le 06-11 au soir (Romain : « Il manque des
 * illustrations sur certains blocs ») : òc, papeta-mameta et rocafort ont une
 * photo. Exemple : { oc: 'Òc !' }.
 */
export const DESSENHS = {};

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
	},
	// la langue des grands-parents : une cuisine rouergate du XIXe siècle,
	// cantou et marmites, reconstituée au musée Joseph Vaylet d'Espalion
	// (Romain, 06-11 : « Oui, les quatre »)
	'papeta-mameta': {
		font: 'papeta-mameta-vaylet-jojan.jpg',
		largor: 1920,
		pos: '50% 50%',
		autor: 'JoJan',
		licencia: 'CC BY 3.0',
		licenciaLigam: 'https://creativecommons.org/licenses/by/3.0/deed.fr',
		ligam: 'https://commons.wikimedia.org/wiki/File:Espalion_-_Mus%C3%A9e_Joseph_Vaylet_(16).jpg'
	},
	// des fromages en affinage dans les caves de Roquefort
	rocafort: {
		font: 'rocafort-afinatge-villafruela.jpg',
		largor: 1920,
		pos: '50% 50%',
		autor: 'Daniel Villafruela',
		licencia: 'CC BY-SA 3.0',
		licenciaLigam: 'https://creativecommons.org/licenses/by-sa/3.0/deed.fr',
		ligam: 'https://commons.wikimedia.org/wiki/File:Roquefort_sur_Soulzon-Affinage_des_tomes-20140628.jpg'
	},
	// le rouge et l'or : le drapeau occitan dans le ciel du Burgaud. Romain,
	// 06-11 : « la croix que tu choisis n'a pas les couleurs rouge et or »
	// (une porte à croix dorée, essayée une heure) ; choisi parmi trois.
	// colors : la seule photo laissée en couleurs, sans la teinte du thème,
	// puisque la fiche parle justement de ses couleurs
	'roge-e-aur': {
		font: 'roge-e-aur-luka-martin.jpg',
		// cadre un peu serré, calé à gauche : le drapeau passe à droite, hors
		// du titre (Joan, 06-11 : le titre couvrait la croix sur grand écran)
		largor: 1041,
		pos: '0% 34%',
		zoom: 1.23,
		posFicha: '50% 30%',
		colors: true,
		autor: 'Luka Martin 01',
		licencia: 'CC0',
		licenciaLigam: 'https://creativecommons.org/publicdomain/zero/1.0/deed.fr',
		ligam: 'https://commons.wikimedia.org/wiki/File:OCCITANIA_02.jpg'
	}
};

/**
 * fiches illustrées par une photo de Romain qui n'est pas dans les paysages :
 * son stock hors Git (Lo_Ligam_hors-git/design-stock/Fotos/Bases_foto/<font>),
 * sans métadonnée ni GPS dans les images tirées. Pas de crédit (comme les
 * paysages). largor : largeur une fois recadrée en 3:2.
 */
export const STOCK = {
	// la plaque « Rue de l'Escola » sous les roses (Romain, 06-11 : choisie
	// plutôt que l'Ostal dels Pichonets, une crèche au nom occitan)
	// posFicha : cadrage dans la case large de la fiche (la plaque au-dessus du titre, les roses dessous)
	calandreta: { font: 'PXL_20230521_104030960.jpg', largor: 3024, pos: '50% 46%', posFicha: '50% 66%' },
	// le mot òc : la vitrine de la Librariá occitana (« Cors de lenga »)
	// (Romain, 06-11 : « Oui, les quatre »)
	oc: { font: 'DSCF1944.JPG', largor: 1776, pos: '50% 50%', posFicha: '50% 28%' }
	// zoom (> 1) : un cadre plus serré, par exemple pour laisser hors champ un
	// numéro de maison ; ex. { font, largor: 1070, pos, zoom: 1.66 }
};

/** photo hors des paysages (Commons ou stock de Romain), tirée par scripts/cultura-fotos.mjs */
export const extern = (id) => COMMONS[id] ?? STOCK[id] ?? null;

export const AMPLES = [480, 800];
const AMPLES_EXTERNS = [480, 800, 1200]; // la plus grande sert à la case de la fiche
/** largeurs tirées pour une fiche ; une photo plus étroite s'arrête à sa largeur */
export const amples = (id) => {
	const x = extern(id);
	if (!x) return AMPLES;
	const max = Math.min(x.largor, AMPLES_EXTERNS.at(-1));
	return [...AMPLES_EXTERNS.filter((a) => a < max), max];
};
export const foto = (id) => FOTOS[id] ?? extern(id);
export const credit = (id) => COMMONS[id] ?? null;
/** photo laissée en couleurs, sans la teinte du thème (le rouge et l'or) */
export const colors = (id) => !!extern(id)?.colors;
/** srcset des petites images ; max : largeur la plus grande proposée (800 au sommaire) */
export const srcset = (id, max = 800) =>
	amples(id)
		.filter((a, k) => k === 0 || a <= max)
		.map((a) => `/cultura/${id}-${a}.webp ${a}w`)
		.join(', ');
