// Le catalogue de la salle de jeux (Romain, 2026-11-06 : « arriver dans une
// salle de jeu… dans la logique du café pour la musique… une distinction entre
// les types de jeux… presque comme une sorte d'App Store où on peut choisir
// son activité, et savoir quels aspects du cerveau on va mobiliser »).
//
// Cinq familles, nommées d'après la façon de jouer (comme les rayons d'une
// boutique de jeux) ; chacune a son affiche, un paysage dessiné d'après une
// photo de Romain (Afica.svelte). Chaque jeu dit ce qu'il fait travailler :
// des mots simples, sans promesse sur le cerveau. Un jeu « a venir » est
// montré sans lien : la salle grandit avec le cursus (décision du 25-10 :
// « un espace de jeux qui grandit avec les blocs »). Les consignes des jeux
// en ligne sont reprises de leur composant (Serp, Paniers, OntEs).
// Occitan passé à lo Congrès le 2026-11-06 (sala, adreça, memòria,
// observacion, escotar, atencion, ortografia, vocabulari, gramatica, logica,
// joiós, calme, jogar, venir, crosat, mesclat, parelh, tèma, trabalhar, tot,
// causís) ; à valider par Romain. Le nom « escota » (l'écoute) est absent du
// Basic, qui ne connaît que le verbe : d'où « Jòcs per escotar » et « Escotar ».

/** Ce que les jeux font travailler, dans l'ordre des filtres */
export const CAPACITATS = [
	{ id: 'vocabulari', oc: 'Vocabulari', fr: 'Vocabulaire' },
	{ id: 'ortografia', oc: 'Ortografia', fr: 'Orthographe' },
	{ id: 'gramatica', oc: 'Gramatica', fr: 'Grammaire' },
	{ id: 'memoria', oc: 'Memòria', fr: 'Mémoire' },
	{ id: 'atencion', oc: 'Atencion', fr: 'Attention' },
	{ id: 'observacion', oc: 'Observacion', fr: 'Observation' },
	{ id: 'escota', oc: 'Escotar', fr: 'Écoute' },
	{ id: 'logica', oc: 'Logica', fr: 'Logique' },
	{ id: 'adreca', oc: 'Adreça', fr: 'Adresse' }
];

/** Les familles, dans l'ordre de la salle ; `afica` : l'affiche (Afica.svelte) */
export const FAMILHAS = [
	{ id: 'adreca', oc: 'Jòcs d’adreça', fr: 'Jeux d’adresse', afica: 'garona' },
	{ id: 'mots', oc: 'Jòcs de mots', fr: 'Jeux de mots', afica: 'vilatge' },
	{ id: 'observacion', oc: 'Jòcs d’observacion', fr: 'Jeux d’observation', afica: 'riu' },
	{ id: 'memoria', oc: 'Jòcs de memòria', fr: 'Jeux de mémoire', afica: 'plana' },
	{ id: 'escota', oc: 'Jòcs per escotar', fr: 'Jeux d’écoute', afica: 'mar' }
];

/**
 * Les jeux. `id` : la valeur de ?joc= quand le jeu est en ligne ; `disponible`
 * false : à venir (pas de lien) ; `capacitats` : deux ou trois, la première
 * étant la principale.
 */
export const JOCS_SALA = [
	{
		id: 'serp',
		familha: 'adreca',
		disponible: true,
		nom: 'La sèrp de las letras',
		consigna: {
			oc: 'La sèrp manja las letras dins l’òrdre\u00a0: sa coa escriu lo mot.',
			fr: 'La sèrp mange les lettres dans l’ordre\u00a0: sa queue écrit le mot.'
		},
		capacitats: ['ortografia', 'adreca', 'atencion']
	},
	{
		id: 'paniers',
		familha: 'adreca',
		disponible: true,
		nom: 'Los panièrs',
		consigna: {
			oc: 'Un mot tomba\u00a0: lo panièr d’esquèrra o lo panièr de drecha\u00a0?',
			fr: 'Un mot tombe\u00a0: le panier de gauche ou le panier de droite\u00a0?'
		},
		capacitats: ['gramatica', 'vocabulari', 'adreca']
	},
	{
		id: 'mots-crosats',
		familha: 'mots',
		disponible: false,
		nom: 'Mots crosats',
		fr: 'Mots croisés',
		capacitats: ['vocabulari', 'ortografia', 'logica']
	},
	{
		id: 'mots-mesclats',
		familha: 'mots',
		disponible: false,
		nom: 'Mots mesclats',
		fr: 'Mots mêlés',
		capacitats: ['observacion', 'ortografia']
	},
	{
		id: 'paisatges',
		familha: 'observacion',
		disponible: true,
		nom: 'Ont es…\u00a0?',
		consigna: {
			oc: 'Un mot s’escriu\u00a0: tòca son endrech sus la fòto.',
			fr: 'Un mot s’écrit\u00a0: touche sa place sur la photo.'
		},
		capacitats: ['observacion', 'vocabulari']
	},
	{
		id: 'parelhs',
		familha: 'memoria',
		disponible: false,
		nom: 'Los parelhs',
		fr: 'Les paires',
		capacitats: ['memoria', 'vocabulari']
	},
	{
		id: 'escota-causis',
		familha: 'escota',
		disponible: false,
		nom: 'Escota e causís',
		fr: 'Écoute et choisis',
		capacitats: ['escota', 'vocabulari']
	}
];

/** Les jeux d'une famille, filtrés par ce qu'ils font travailler (null : tous) */
export const jocsDe = (familha, capacitat = null) =>
	JOCS_SALA.filter((j) => j.familha === familha && (!capacitat || j.capacitats.includes(capacitat)));
