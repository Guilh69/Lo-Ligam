// Les mots que les confettis écrivent quand la souris se pose (Romain, 2026-11-21 : « que ça puisse écrire
// un mot en occitan, et si on reste, ça disparaît, puis il y en a un autre qui arrive doucement »).
// Languedocien, vérifiés le 2026-11-21 avec l'API de lo Congrès (verificar-oc.mjs, et --fr pour le sens).
// Retirés : « cor » (l'API ne le connaît que comme forme de córrer), « cel » et « auzèl » (formes reconnues : cèl, aucèl).
// Des mots courts (3 à 5 lettres) : avec moins de 90 confettis, au-delà les lettres ne se lisent plus (essai du 21-11,
// « amistat » et « paraula » illisibles).
export const MOTS = [
	{ oc: 'ligam', fr: 'le lien' },
	{ oc: 'luna', fr: 'la lune' },
	{ oc: 'aiga', fr: "l'eau" },
	{ oc: 'flor', fr: 'la fleur' },
	{ oc: 'ostal', fr: 'la maison' },
	{ oc: 'camin', fr: 'le chemin' },
	{ oc: 'sòmi', fr: 'le rêve' },
	{ oc: 'vent', fr: 'le vent' },
	{ oc: 'cèl', fr: 'le ciel' },
	{ oc: 'nèu', fr: 'la neige' },
	{ oc: 'prat', fr: 'le pré' },
	{ oc: 'riu', fr: 'la rivière' },
	{ oc: 'mar', fr: 'la mer' },
	{ oc: 'aucèl', fr: "l'oiseau" },
	{ oc: 'blat', fr: 'le blé' }
];
