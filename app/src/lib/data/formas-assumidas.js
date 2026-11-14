// Formes locales assumées par Romain : absentes de lo Basic et de vèrb'Òc, mais
// voulues telles quelles. Une seule liste, lue par le script
// `scripts/verificar-oc.mjs` (vérification en ligne de commande) et par la
// vérification de Revirar (`$lib/server/congres.js`) : on dit « forme assumée »
// au lieu de signaler le mot absent. Fichier sans dépendance, importable par Node
// seul. Pour en ajouter une : une ligne, avec qui l'a décidé et quand.
export const FORMAS_ASSUMIDAS = {
	'siès': 'montpelliéranisme assumé pour « tu es » (Romain, 2026-10-22, charte §2 bis)',
	'uèi': '« aujourd’hui », mot validé par Romain (2026-10-23) : ne plus le signaler'
};

/** Le mot (en minuscules) est-il une forme assumée ? (Object.hasOwn : « constructor » n'en est pas une.) */
export const esAssumida = (mot) => Object.hasOwn(FORMAS_ASSUMIDAS, mot);
