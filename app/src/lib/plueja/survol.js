// Force de la main (souris, stylet, doigt) sur la poussière d'or de Remira.
// Fonction pure, sortie de Polsa.svelte pour être testée (note 126 de Romain,
// 13-11 : « la flèche déclenche trop tôt l'effet de dispersion quand on survole »).
//
// Deux régimes :
// - bouton ou doigt appuyé : un geste voulu, la main répond dès 120 px/s ;
// - simple survol (souris sans clic) : un curseur qui traverse la page vers l'en-tête
//   ou les commandes ne doit pas défaire le mot. Il faut une volée rapide (450 px/s
//   au moins), tenue 0,2 s, et la force monte avec la vitesse jusqu'à 900 px/s.

export const FORCE_MAX = 1.6 * 5500; // force à pleine vitesse (inchangée depuis le réglage du 05-11)
export const APPUYE_V = 120; // appuyé : vitesse minimale (px/s)
export const SURVOL_V = 450; // survol : vitesse minimale (px/s)
export const SURVOL_PLEIN = 900; // survol : vitesse où la main retrouve toute sa force (px/s)
export const SURVOL_ELAN = 0.2; // survol : durée de la volée avant que les grains bougent (s)
const RETOMBEE = 0.1; // survol : durée pour que l'élan retombe quand la souris ralentit (s)

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * @param {{ vitesse: number, appuye: boolean, elan: number, dt: number }} p
 *   vitesse : vitesse lissée de la main (px/s), 0 si elle ne bouge plus ;
 *   appuye : un bouton ou un doigt est enfoncé ; elan : valeur précédente (0 à 1) ; dt : pas de temps (s)
 * @returns {{ force: number, elan: number }}
 */
export function forceDeLaMain({ vitesse, appuye, elan, dt }) {
	if (appuye) {
		const force = vitesse < APPUYE_V ? 0 : Math.min(1.6, vitesse / 500) * 5500;
		return { force, elan: 0 };
	}
	const nouvel = vitesse >= SURVOL_V ? Math.min(1, elan + dt / SURVOL_ELAN) : Math.max(0, elan - dt / RETOMBEE);
	const montee = clamp((vitesse - SURVOL_V) / (SURVOL_PLEIN - SURVOL_V), 0, 1);
	return { force: montee * nouvel * FORCE_MAX, elan: nouvel };
}
