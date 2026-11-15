// COPIE d'Efièch 0.1.0 (C:\Users\perie\Depots\Efiech). Ne pas modifier ici : modifier là-bas, puis « node synchroniser.mjs ».
// Le catalogue des effets : les 22 de la planche de références gardés par
// Romain le 2026-11-15 (canevas « Bibliothèque d'effets »). Un effet est un
// mouvement (comment les pièces bougent une fois là) combiné à une apparition
// (comment elles entrent en scène), plus des réglages.
//
// Chaque réglage est décrit ici une fois : l'atelier en fait un curseur, le
// moteur lit sa valeur avec valeursReglages(), qui la borne. Les noms sont en
// français : ce sont les mots de la planche.

const r = (id, nom, min, max, pas, defaut, aide = '') => ({ id, nom, min, max, pas, defaut, aide });
const choix = (id, nom, options, defaut) => ({ id, nom, options, defaut, type: 'choix' });

// réglages de tous les effets
export const REGLAGES_COMMUNS = [
	r('nombre', 'Nombre de pièces', 1, 150, 1, 24),
	r('taille', 'Taille', 8, 160, 1, 32, 'en pixels'),
	r('variation', 'Écart de taille', 0, 1, 0.05, 0.35, 'les pièces sont plus ou moins grandes'),
	r('vitesse', 'Vitesse', 0.1, 3, 0.05, 1),
	r('vie', 'Durée de vie', 0, 30, 0.5, 0, 'en secondes ; 0 : toujours là')
];

export const MOUVEMENTS = [
	{ id: 'aucun', num: '00', nom: 'Immobile', texte: 'Les pièces restent là où elles sont arrivées.', reglages: [] },
	{ id: 'derive', num: '01', nom: 'Dérive lente', texte: 'Les objets flottent au hasard, en douceur, sans jamais partir.', reglages: [r('balancement', 'Balancement', 0, 1, 0.05, 0.4)] },
	{
		id: 'chute', num: '02', nom: 'Chute balancée', texte: 'Ça tombe en oscillant, chaque pièce à son rythme.',
		reglages: [r('balancement', 'Balancement', 0, 1, 0.05, 0.5), r('rotation', 'Rotation', 0, 1, 0.05, 0.5)]
	},
	{
		id: 'bulles', num: '03', nom: 'Montée de bulles', texte: 'Les objets montent du bas, grossissent un peu et s’effacent.',
		reglages: [r('ecart', 'Écart latéral', 0, 1, 0.05, 0.4), r('croissance', 'Croissance', 0, 1, 0.05, 0.4)]
	},
	{
		id: 'attraction', num: '04', nom: 'Attraction', texte: 'Les objets sont tirés vers le curseur ou le doigt.',
		reglages: [r('rayon', 'Rayon d’action', 40, 500, 10, 180), r('force', 'Force', 0.1, 3, 0.05, 1)]
	},
	{
		id: 'repulsion', num: '05', nom: 'Répulsion', texte: 'Les objets fuient le curseur, puis reviennent à leur place.',
		reglages: [r('rayon', 'Rayon', 40, 400, 10, 120), r('force', 'Force', 0.1, 3, 0.05, 1), r('retour', 'Vitesse du retour', 0.1, 3, 0.05, 1)]
	},
	{
		id: 'gravite', num: '06', nom: 'Gravité et rebond', texte: 'Les objets tombent, touchent le sol, rebondissent de moins en moins.',
		reglages: [r('gravite', 'Gravité', 0.1, 3, 0.05, 1), r('rebond', 'Rebond', 0, 0.95, 0.05, 0.55), r('frottement', 'Frottement', 0, 1, 0.05, 0.3)]
	},
	{
		id: 'ressort', num: '07', nom: 'Ressort', texte: 'L’objet dépasse sa place, revient, se stabilise.',
		reglages: [r('raideur', 'Raideur', 0.1, 3, 0.05, 1), r('amorti', 'Amortissement', 0.05, 1, 0.05, 0.25)]
	},
	{
		id: 'lancer', num: '08', nom: 'Lancer et glisser', texte: 'L’objet part vite, continue sur sa lancée puis ralentit jusqu’à l’arrêt.',
		reglages: [r('elan', 'Vitesse de départ', 0.1, 3, 0.05, 1), r('resistance', 'Résistance', 0.1, 3, 0.05, 1)]
	},
	{
		id: 'trajectoire', num: '09', nom: 'Trajectoire lancée', texte: 'Une courbe de projectile : ça monte, ralentit en haut, retombe.',
		reglages: [r('angle', 'Angle', 20, 85, 1, 62, 'en degrés'), r('gravite', 'Gravité', 0.1, 3, 0.05, 1)]
	},
	{
		id: 'essaim', num: '10', nom: 'Essaim', texte: 'Des petits agents se suivent comme une volée d’oiseaux.',
		reglages: [r('cohesion', 'Cohésion', 0, 2, 0.05, 1), r('alignement', 'Alignement', 0, 2, 0.05, 1), r('ecart', 'Écart entre eux', 0, 2, 0.05, 1)]
	},
	{
		id: 'tourbillon', num: '11', nom: 'Tourbillon', texte: 'Les objets tournent autour d’un centre, plus lentement quand ils sont loin.',
		reglages: [r('rayon', 'Rayon', 40, 700, 10, 240), choix('sens', 'Sens', [['1', 'des aiguilles d’une montre'], ['-1', 'inverse']], '1'), r('vent', 'Vent', 0, 1, 0.05, 0.2)]
	},
	{
		id: 'reaction', num: '12', nom: 'Réaction', texte: 'Le dessin répond quand on passe dessus ou quand on réussit.',
		reglages: [r('ampleur', 'Ampleur', 0.1, 2, 0.05, 1), r('duree', 'Durée', 0.2, 2, 0.05, 0.6, 'en secondes')]
	}
];

export const APPARITIONS = [
	{ id: 'aucune', num: '00', nom: 'Déjà là', texte: 'Les pièces sont là dès le début.', reglages: [] },
	{
		id: 'explosion', num: '01', nom: 'Explosion', texte: 'Une gerbe jaillit d’un point, s’ouvre puis retombe.',
		reglages: [r('direction', 'Direction', 0, 360, 5, 90, '90 : vers le haut'), r('dispersion', 'Dispersion', 10, 360, 5, 120, 'en degrés'), r('elan', 'Élan', 0.2, 3, 0.05, 1), r('duree', 'Durée', 0.3, 4, 0.1, 1.4, 'en secondes')]
	},
	{
		id: 'canons', num: '02', nom: 'Canons latéraux', texte: 'Deux jets partent des bords et se rejoignent au centre.',
		reglages: [r('dispersion', 'Dispersion', 5, 90, 1, 35, 'en degrés'), r('elan', 'Élan', 0.2, 3, 0.05, 1), r('duree', 'Durée', 0.3, 4, 0.1, 1.6, 'en secondes')]
	},
	{
		id: 'eclatement', num: '03', nom: 'Ton dessin en confettis', texte: 'Le dessin entier apparaît, puis éclate : chacune de ses formes devient une pièce.',
		reglages: [r('tenue', 'Temps avant l’éclat', 0, 3, 0.1, 0.8, 'en secondes'), r('elan', 'Élan', 0.2, 3, 0.05, 1), r('grandeur', 'Taille du dessin entier', 0.15, 0.9, 0.05, 0.45, 'part de la zone')]
	},
	{
		id: 'bouquet', num: '04', nom: 'Bouquet', texte: 'Une pièce monte, s’ouvre en couronne, les éclats retombent.',
		reglages: [r('hauteur', 'Hauteur', 0.1, 0.9, 0.05, 0.4, 'part de la zone, depuis le haut'), r('elan', 'Élan', 0.2, 3, 0.05, 1)]
	},
	{
		id: 'cascade', num: '05', nom: 'Cascade', texte: 'Les éléments entrent l’un après l’autre, en glissant doucement.',
		reglages: [r('delai', 'Délai entre deux', 0, 0.5, 0.01, 0.08, 'en secondes'), choix('ordre', 'Ordre', [['debut', 'du début'], ['fin', 'de la fin'], ['centre', 'du centre'], ['hasard', 'au hasard']], 'debut')]
	},
	{
		id: 'cascadeRessort', num: '06', nom: 'Cascade à ressort', texte: 'La même entrée décalée, avec un petit rebond à l’arrivée.',
		reglages: [r('delai', 'Délai', 0, 0.5, 0.01, 0.08, 'en secondes'), r('raideur', 'Raideur du ressort', 0.2, 3, 0.05, 1)]
	},
	{
		id: 'trace', num: '07', nom: 'Dessin du trait', texte: 'Le contour du dessin se trace sous nos yeux, comme à la plume.',
		reglages: [r('duree', 'Durée', 0.3, 6, 0.1, 2, 'en secondes'), r('delai', 'Délai entre deux', 0, 0.5, 0.01, 0.05, 'en secondes')]
	},
	{
		id: 'eclosion', num: '08', nom: 'Éclosion', texte: 'L’élément pousse depuis son pied, puis s’ouvre avec un léger dépassement.',
		reglages: [r('delai', 'Délai entre deux', 0, 0.5, 0.01, 0.06, 'en secondes'), r('elan', 'Élan du ressort', 0.2, 3, 0.05, 1)]
	},
	{
		id: 'pluie', num: '09', nom: 'Pluie', texte: 'Ça tombe droit et vite depuis le haut.',
		reglages: [r('elan', 'Vitesse', 0.2, 3, 0.05, 1), r('inclinaison', 'Inclinaison', -45, 45, 1, 0, 'en degrés')]
	},
	{
		id: 'fondu', num: '10', nom: 'Fondu dispersé', texte: 'Les pièces surgissent ici et là, dans le désordre, en fondu.',
		reglages: [r('duree', 'Durée du fondu', 0.2, 3, 0.05, 0.8, 'en secondes'), r('desordre', 'Étalement', 0, 3, 0.05, 1.2, 'en secondes')]
	}
];

export const mouvement = (id) => MOUVEMENTS.find((m) => m.id === id) ?? MOUVEMENTS[1];
export const apparition = (id) => APPARITIONS.find((a) => a.id === id) ?? APPARITIONS[0];

/** Tous les réglages d'une combinaison, communs d'abord (préfixés : « m. » mouvement, « a. » apparition) */
export function reglagesDe(idMouvement, idApparition) {
	return [
		...REGLAGES_COMMUNS.map((x) => ({ ...x, cle: x.id })),
		...mouvement(idMouvement).reglages.map((x) => ({ ...x, cle: 'm.' + x.id })),
		...apparition(idApparition).reglages.map((x) => ({ ...x, cle: 'a.' + x.id }))
	];
}

/** Les valeurs des réglages, bornées ; ce qui manque prend sa valeur par défaut */
export function valeursReglages(idMouvement, idApparition, donnees = {}) {
	const v = {};
	for (const x of reglagesDe(idMouvement, idApparition)) {
		const brut = donnees?.[x.cle];
		if (x.type === 'choix') v[x.cle] = x.options.some(([o]) => o === String(brut)) ? String(brut) : x.defaut;
		else {
			const n = Number(brut);
			v[x.cle] = Number.isFinite(n) && brut !== null && brut !== '' ? Math.max(x.min, Math.min(x.max, n)) : x.defaut;
		}
	}
	return v;
}

/**
 * Une configuration d'effet propre (celle que garde la base) :
 * { mouvement, apparition, reglages, teinte, formes }
 *   teinte : 'dessin' (les couleurs du dessin) ou 'palette' (les couleurs du site)
 *   formes : true pour mêler les formes de papier au dessin
 */
export function configPropre(c = {}) {
	const m = mouvement(c?.mouvement).id;
	const a = apparition(c?.apparition).id;
	return {
		mouvement: m,
		apparition: a,
		reglages: valeursReglages(m, a, c?.reglages),
		teinte: c?.teinte === 'palette' ? 'palette' : 'dessin',
		formes: c?.formes === true
	};
}
