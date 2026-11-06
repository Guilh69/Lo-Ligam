// Images des fiches de Cultura (essai du 2026-11-06, Romain : « des fonds
// d'images un peu transparents avec les photos que j'ai mises, si ça
// correspond »). Les photos sont celles des paysages de Remira, déjà en ligne
// (sans GPS ni métadonnée) ; scripts/cultura-fotos.mjs en tire deux petites
// tailles par fiche dans static/cultura/ (<fiche>-480.webp, <fiche>-800.webp).
// Une photo prise ailleurs peut illustrer un thème (Romain, 06-11).
//
// pos : le point de la photo à garder au centre quand la case la recadre.
// Les petites images sont déjà recadrées en 3:2 autour de ce point.
// Sans photo qui corresponde : un dessin au trait de Remira (même famille que
// la poussière d'or), ou rien.

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

export const AMPLES = [480, 800];
export const foto = (id) => FOTOS[id] ?? null;
export const srcset = (id) => AMPLES.map((a) => `/cultura/${id}-${a}.webp ${a}w`).join(', ');
